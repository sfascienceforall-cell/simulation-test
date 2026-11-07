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
function corr(x,y){ var mx=ST.mean(x), my=ST.mean(y), sxy=0, sxx=0, syy=0; for(var i=0;i<x.length;i++){ sxy+=(x[i]-mx)*(y[i]-my); sxx+=(x[i]-mx)*(x[i]-mx); syy+=(y[i]-my)*(y[i]-my); } return sxy/Math.sqrt(sxx*syy); }
function ols(x,y){ var mx=ST.mean(x), my=ST.mean(y), sxy=0, sxx=0; for(var i=0;i<x.length;i++){ sxy+=(x[i]-mx)*(y[i]-my); sxx+=(x[i]-mx)*(x[i]-mx); } var a=sxy/sxx; return {a:a,b:my-a*mx}; }
function stdz(v){ var m=ST.mean(v), s=ST.sd(v); return v.map(function(t){ return (t-m)/s; }); }
/* jauge horizontale de −1 à +1 */
function gauge(c,S,v,y,L,R){
  var ctx=c.ctx, X=function(t){ return L+(t+1)/2*(R-L); }, g=ctx.createLinearGradient(L,0,R,0);
  g.addColorStop(0,S.draw.tint(P.red,.75)); g.addColorStop(.5,S.draw.tint(P.grey,.25)); g.addColorStop(1,S.draw.tint(P.green,.75));
  ctx.fillStyle=g; S.draw.rrect(c,L,y-5,R-L,10,5); ctx.fill();
  [-1,0,1].forEach(function(t){ S.draw.text(c,t===0?"0":S.fmt(t,0),X(t),y+16,{size:10.5,color:"#6b7685",weight:600}); });
  if(isFinite(v)) S.draw.dot(c,X(UI.clamp(v,-1,1)),y,8,P.ink);
}

SFA.sim({
  id:"us-c10-nuage-coefficient-r", ch:"c10", tag:"Classique · P1",
  titre:"Nuage de points et coefficient de corrélation r",
  resume:"Quel r pour quel nuage ? Un lien très net peut donner r ≈ 0 s'il n'est pas linéaire.",
  but:"Choisis la forme du nuage, augmente le bruit et lis r. Attrape un point à la souris ou au doigt et déplace-le : r réagit tout de suite. Observe les formes qui ont un r proche de 0 alors que les deux variables sont fortement liées.",
  aRetenir:"r ∈ [−1 ; 1] mesure uniquement la force du lien linéaire ; r² est la part de variance de y expliquée par la droite. r = 0 n'implique pas l'indépendance.",
  piege:"Un seul point extrême peut créer ou détruire une corrélation. Mélanger deux sous-groupes peut inverser le signe de r.",
  build:function(k,S){
    var c=UI.canvas(k,330,.8,430), mv={};
    function reset(){ mv={}; }
    var sh=k.select("Forme du nuage",[["lin","Relation linéaire"],["neg","Relation linéaire décroissante"],["u","Parabole (relation en U)"],["circ","Cercle"],["grp","Deux sous-groupes"],["out","Linéaire + un point extrême"]],"lin",reset);
    var bz=k.slider("Bruit",0,1,0.05,0.3,"",reset);
    var n=k.slider("Nombre de points",10,200,5,60,"",reset);
    k.button("Replacer les points",reset);
    var ro=k.readouts(["r","r²","Pente de la droite"]);
    var nt=k.note("","");
    var lay={}, pts=[];
    UI.drag(c,function(){ if(!lay.ax) return []; return pts.map(function(p,i){ return {id:i,x:lay.ax.X(p[0]),y:lay.ax.Y(p[1]),r:12}; }); },
      function(id,q){ mv[id]=[UI.clamp(lay.ax.ix(q.x),-2.5,2.5),UI.clamp(lay.ax.iy(q.y),-3,3)]; k.redraw(); });
    k.draw(function(){
      var N=n.value, r=ST.rng(777+N), x=[], y=[], i, t, g;
      for(i=0;i<N;i++){ var e1=ST.randn(r), e2=ST.randn(r), u=r()*2-1;
        if(sh.value==="lin"){ x.push(u); y.push(u+bz.value*e1); }
        else if(sh.value==="neg"){ x.push(u); y.push(-u+bz.value*e1); }
        else if(sh.value==="u"){ x.push(u); y.push(2*u*u-0.7+bz.value*0.5*e1); }
        else if(sh.value==="circ"){ t=r()*2*Math.PI; x.push(Math.cos(t)+bz.value*0.3*e1); y.push(Math.sin(t)+bz.value*0.3*e2); }
        else if(sh.value==="grp"){ g=i%2; x.push((g?0.8:-0.8)+0.45*e1*(0.4+bz.value)); y.push((g?0.8:-0.8)-0.5*(x[i]-(g?0.8:-0.8))+0.45*e2*(0.4+bz.value)); }
        else { x.push(u); y.push(u+bz.value*e1); }
      }
      if(sh.value==="out"){ x[0]=1.9; y[0]=-2.6; }
      var nmoved=0; for(i=0;i<N;i++) if(mv[i]){ x[i]=mv[i][0]; y[i]=mv[i][1]; nmoved++; }
      pts=x.map(function(v,j){ return [v,y[j]]; });
      var rr=corr(x,y), f=ols(x,y);
      c.clear(); var ax=S.draw.axes(c,{x0:-2.5,x1:2.5,y0:-3,y1:3,xl:"x",yl:"y",stepX:1,stepY:1,b:70,t:20}); lay.ax=ax;
      S.draw.fn(c,ax,function(xx){ return f.a*xx+f.b; },P.red,2.4,[6,4]);
      for(i=0;i<N;i++){ var spec=(i===0&&sh.value==="out"), mvd=!!mv[i]; S.draw.dot(c,ax.X(x[i]),ax.Y(y[i]),spec||mvd?6.5:4,spec?P.red:mvd?P.orange:S.draw.tint(P.mat,.85)); }
      S.draw.display(c,"r = "+S.fmt(rr,2),ax.R-62,ax.T+34,{w:112,h:46,caption:"coefficient de corrélation"});
      gauge(c,S,rr,c.H-26,ax.L+10,ax.R-10);
      UI.hint(c,"attrape un point",ax.L+80,ax.T+10,P.mat);
      ro.set(0,S.fmt(rr,3)); ro.set(1,S.fmt(rr*rr,3)); ro.set(2,S.fmt(f.a,2));
      if(nmoved) nt.set(nmoved+" point(s) déplacé(s) (en orange) : r vaut maintenant "+S.fmt(rr,2)+". Un ou deux points suffisent à changer le verdict ; « Replacer les points » rétablit le nuage.","warn");
      else if(Math.abs(rr)<0.2&&(sh.value==="u"||sh.value==="circ")) nt.set("r proche de 0 alors que y est une fonction nette de x : r ne détecte que les liens linéaires.","warn");
      else if(sh.value==="grp") nt.set("Chaque sous-groupe a une pente négative, l'ensemble est lié positivement : r global ne dit rien des sous-groupes.","warn");
      else if(sh.value==="out") nt.set("Le point rouge à lui seul fait chuter r. Calcule toujours r avec et sans les valeurs extrêmes. Déplace-le pour voir.","warn");
      else nt.set("Plus le bruit est grand, plus r s'éloigne de ±1. Essaie de déplacer un point loin du nuage.","ok");
    });
  }
});

SFA.sim({
  id:"us-c10-droite-moindres-carres", ch:"c10", tag:"Classique · P1",
  titre:"Ajuster la droite à la main : les moindres carrés",
  resume:"Place la droite avec deux poignées, vois les carrés des résidus et compare à la droite optimale.",
  but:"Dix patients : dose d'un médicament (x, mg) et baisse de pression (y, mmHg). Fais glisser les deux poignées de la droite pour minimiser la somme des carrés des résidus (aires des carrés rouges).",
  aRetenir:"La droite des moindres carrés minimise Σ(y<sub>i</sub> − ŷ<sub>i</sub>)². Pente a = s<sub>xy</sub>/s<sub>x</sub>² = r·s<sub>y</sub>/s<sub>x</sub> ; ordonnée b = ȳ − a·x̄ ; la droite passe par (x̄ ; ȳ).",
  piege:"La droite ne doit pas être utilisée hors de l'étendue des x observés (extrapolation). La pente de y sur x n'est pas l'inverse de la pente de x sur y.",
  build:function(k,S){
    var X=[2,4,5,7,8,10,11,13,14,16], Y=[3.1,5.9,5.2,9.4,8.1,12.6,11.0,15.2,14.8,18.9];
    var c=UI.canvas(k,330,.8,430), f=ols(X,Y), rr=corr(X,Y);
    var a=k.slider("Pente a",0,2,0.02,0.5,"mmHg/mg");
    var b=k.slider("Ordonnée à l'origine b",-5,10,0.1,3,"mmHg");
    var sq=k.toggle("Afficher les carrés des résidus",true);
    k.button("Droite optimale",function(){ a.set(Math.round(f.a*100)/100); b.set(Math.round(f.b*10)/10); },true);
    var ro=k.readouts(["Σ des carrés (ta droite)","Σ des carrés (minimum)","Droite optimale","r"]);
    var nt=k.note("","");
    var ssMin=0; X.forEach(function(x,i){ ssMin+=Math.pow(Y[i]-(f.a*x+f.b),2); });
    var lay={}, H1=1.5, H2=16.5;
    UI.drag(c,function(){ if(!lay.ax) return []; return [{id:1,x:lay.ax.X(H1),y:lay.ax.Y(a.value*H1+b.value),r:18},{id:2,x:lay.ax.X(H2),y:lay.ax.Y(a.value*H2+b.value),r:18}]; },
      function(id,q){ var yv=lay.ax.iy(q.y), y1=a.value*H1+b.value, y2=a.value*H2+b.value; if(id===1) y1=yv; else y2=yv; var na=(y2-y1)/(H2-H1), nb=y1-na*H1; a.set(UI.clamp(Math.round(na*50)/50,0,2)); b.set(UI.clamp(Math.round(nb*10)/10,-5,10)); k.redraw(); });
    k.draw(function(){
      var ss=0, i;
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:18,y0:0,y1:22,xl:"dose (mg)",yl:"baisse (mmHg)",stepX:2,stepY:4,t:20}); lay.ax=ax;
      S.draw.fn(c,ax,function(x){ return f.a*x+f.b; },S.draw.tint(P.green,.6),2.2,[6,4]);
      for(i=0;i<X.length;i++){ var yh=a.value*X[i]+b.value, e=Y[i]-yh; ss+=e*e;
        if(sq.value){ var sw=Math.abs(ax.Y(yh)-ax.Y(Y[i])); c.ctx.fillStyle=S.draw.tint(P.red,.24); c.ctx.fillRect(ax.X(X[i]),Math.min(ax.Y(yh),ax.Y(Y[i])),sw,sw); c.ctx.strokeStyle=S.draw.tint(P.red,.5); c.ctx.lineWidth=1; c.ctx.strokeRect(ax.X(X[i])+.5,Math.min(ax.Y(yh),ax.Y(Y[i]))+.5,sw,sw); }
        S.draw.line(c,ax.X(X[i]),ax.Y(yh),ax.X(X[i]),ax.Y(Y[i]),P.red,1.8); }
      S.draw.fn(c,ax,function(x){ return a.value*x+b.value; },P.mat,3);
      for(i=0;i<X.length;i++) S.draw.dot(c,ax.X(X[i]),ax.Y(Y[i]),4.8,P.ink);
      S.draw.dot(c,ax.X(H1),ax.Y(a.value*H1+b.value),9,P.mat); S.draw.dot(c,ax.X(H2),ax.Y(a.value*H2+b.value),9,P.mat);
      S.draw.display(c,"Σ = "+S.fmt(ss,1),ax.L+70,ax.B-34,{w:122,h:46,caption:"minimum : "+S.fmt(ssMin,1),color:ss<=ssMin+0.5?P.green:P.ink});
      S.draw.legend(c,[[P.mat,"ta droite"],[S.draw.tint(P.green,.8),"droite optimale",1],[S.draw.tint(P.red,.7),"carrés des résidus"]],ax.R-4,ax.T+4,{align:"right"});
      UI.hint(c,"glisse les deux poignées",ax.X(9),ax.T+10,P.mat);
      ro.set(0,S.fmt(ss,1)); ro.set(1,S.fmt(ssMin,1)); ro.set(2,"ŷ = "+S.fmt(f.a,3)+" x + "+S.fmt(f.b,2)); ro.set(3,S.fmt(rr,3));
      nt.set(ss<=ssMin+0.5?"Presque optimal : tu as retrouvé la droite des moindres carrés.":"Σ = "+S.fmt(ss,1)+" contre "+S.fmt(ssMin,1)+" au minimum : ajuste pente et ordonnée (la droite doit passer près du point moyen).",ss<=ssMin+0.5?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c10-quatre-jeux-memes-statistiques", ch:"c10", tag:"Original · P1",
  titre:"Quatre jeux, mêmes statistiques, structures différentes",
  resume:"Mêmes moyennes, mêmes écarts-types, même r, même droite : mais un nuage linéaire, une courbe, un point aberrant et un point à fort effet de levier.",
  but:"Passe d'un jeu à l'autre : tous les chiffres restent identiques. Retire ensuite le point influent des jeux 3 et 4, ou fais-le glisser à la souris : r et la droite changent radicalement (jeu 3 : r monte à presque 1 ; jeu 4 : plus aucune droite calculable).",
  aRetenir:"Les indicateurs numériques ne remplacent jamais le graphique : regarde toujours le nuage de points. Un point à fort effet de levier ou aberrant peut déterminer à lui seul la droite et r.",
  piege:"r = 0,82 dans les quatre cas ne signifie pas que la droite convient aux quatre. Le jeu 2 est une courbe (la droite est inadaptée) ; les jeux 3 et 4 dépendent d'un seul point.",
  build:function(k,S){
    var c=UI.canvas(k,330,.8,430), R=0.82, MX=9, SX=3.2, MY=7.5, SY=2, mv={};
    var xs=[[3,4,5,6,7,8,9,10,11,12,13],[3,4,5,6,7,8,9,10,11,12,13],[3,4,5,6,7,8,9,10,11,12,13],[7,7,7,7,7,7,7,7,7,7,17]];
    var rw=[[0.9,-0.3,0.6,-1.1,0.2,0.8,-0.5,1.0,-0.8,0.4,-0.2],null,null,[0.5,-0.9,0.3,1.2,-0.4,0.8,-1.1,0.1,-0.6,1.0,0]];
    var raw=[], i, j;
    raw[0]=xs[0].map(function(x,j){ return 0.8*(x-8)+rw[0][j]*1.2; });
    raw[1]=xs[1].map(function(x){ return -Math.pow(x-8,2)/4; });
    raw[2]=xs[2].map(function(x,j){ return 0.8*(x-8)+[0.2,-0.1,0.15,-0.2,0.1,0,-0.1,0.2,-0.15,0.05,0][j]+(j===8?5.5:0); });
    raw[3]=xs[3].map(function(x,j){ return j===10?10:rw[3][j]*1.2; });
    var ds=[];
    for(i=0;i<4;i++){ var zx=stdz(xs[i]), f=ols(xs[i],raw[i]), res=xs[i].map(function(x,j){ return raw[i][j]-(f.a*x+f.b); }), zr=stdz(res);
      ds.push({x:zx.map(function(z){ return MX+SX*z; }), y:zx.map(function(z,j){ return MY+SY*(R*z+Math.sqrt(1-R*R)*zr[j]); })}); }
    var which=k.seg("Jeu de données",[["0","Jeu 1"],["1","Jeu 2"],["2","Jeu 3"],["3","Jeu 4"]],"0",function(){ mv={}; });
    var rm=k.toggle("Retirer le point influent (jeux 3 et 4)",false);
    k.button("Replacer les points",function(){ mv={}; });
    var ro=k.readouts(["Moyenne de x ; de y","Écart-type de x ; de y","r","Droite ŷ = a·x + b"]);
    var nt=k.note("","");
    var infl=[-1,-1,8,10], lay={}, cur=[];
    UI.drag(c,function(){ if(!lay.ax) return []; return cur.map(function(p,j){ return {id:j,x:lay.ax.X(p[0]),y:lay.ax.Y(p[1]),r:(j===infl[+which.value]?18:13)}; }); },
      function(id,q){ mv[which.value+"_"+id]=[UI.clamp(lay.ax.ix(q.x),0,22),UI.clamp(lay.ax.iy(q.y),0,14)]; k.redraw(); });
    k.draw(function(){
      var w=+which.value, d=ds[w], x=d.x.slice(), y=d.y.slice(), pi=infl[w], nm=0;
      for(var q=0;q<x.length;q++){ var m=mv[w+"_"+q]; if(m){ x[q]=m[0]; y[q]=m[1]; nm++; } }
      cur=x.map(function(v,j){ return [v,y[j]]; });
      var removed=rm.value&&pi>=0;
      var xr=x.slice(), yr=y.slice(); if(removed){ xr.splice(pi,1); yr.splice(pi,1); }
      var f0=ols(x,y), degen=ST.sd(xr)<1e-6, f=degen?{a:0,b:0}:ols(xr,yr), rr=degen?NaN:corr(xr,yr);
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:22,y0:0,y1:14,xl:"x",yl:"y",stepX:2,stepY:2,t:20}); lay.ax=ax;
      S.draw.fn(c,ax,function(t){ return f0.a*t+f0.b; },removed?S.draw.tint(P.grey,.9):P.red,removed?2:2.8,removed?[6,4]:null);
      if(removed&&!degen) S.draw.fn(c,ax,function(t){ return f.a*t+f.b; },P.mat,3);
      x.forEach(function(v,j){ var isI=(j===pi), mvd=!!mv[w+"_"+j]; S.draw.dot(c,ax.X(v),ax.Y(y[j]),isI?7:5,isI?(removed?P.orange:P.red):mvd?P.orange:P.ink); });
      if(pi>=0) S.draw.label(c,"point influent",ax.X(x[pi])+(x[pi]>15?-12:12),ax.Y(y[pi])-(y[pi]>12?-16:14),{color:P.red,align:x[pi]>15?"right":"left",size:11});
      S.draw.display(c,isFinite(rr)?"r = "+S.fmt(rr,2):"r = —",ax.L+70,ax.T+34,{w:112,h:46,caption:"coefficient de corrélation"});
      UI.hint(c,"glisse n'importe quel point",ax.X(15),ax.B-14,P.mat);
      ro.set(0,S.fmt(ST.mean(xr),2)+" ; "+S.fmt(ST.mean(yr),2)); ro.set(1,S.fmt(ST.sd(xr),2)+" ; "+S.fmt(ST.sd(yr),2)); ro.set(2,degen?"—":S.fmt(rr,3)); ro.set(3,degen?"—":S.fmt(f.a,3)+" x + "+S.fmt(f.b,2));
      if(nm) nt.set(nm+" point(s) déplacé(s) (en orange) : les statistiques ne sont plus identiques d'un jeu à l'autre. « Replacer les points » rétablit les données d'origine.","warn");
      else if(degen) nt.set("Sans le point influent, tous les x sont identiques : aucune droite ni aucun r ne peuvent être calculés. Toute la « corrélation » du jeu 4 venait d'un seul sujet.","warn"); else nt.set(w===0?"Nuage linéaire raisonnable : la droite résume bien.":w===1?"Relation courbe : la droite est inadaptée, malgré r = 0,82.":removed?"Sans le point influent, les statistiques changent : r et la droite dépendaient d'un seul sujet (pointillé : droite avec tous les points).":"Un point (en rouge) dicte la droite et r. Coche « retirer » ou fais-le glisser pour voir ce qui reste.",w===0?"ok":"warn");
    });
  }
});

SFA.sim({
  id:"us-c10-correlation-contre-causalite", ch:"c10", tag:"Original · confusion",
  titre:"Corrélation n'est pas causalité : la variable cachée",
  resume:"Café et risque cardiaque corrélés… à cause du tabac. Stratifier sur la variable cachée fait disparaître le lien.",
  but:"Un facteur Z (tabagisme) influence à la fois X (tasses de café) et Y (score de risque cardiaque). Le schéma du haut montre les liens (flèche épaisse = lien fort) ; règle-les et compare la corrélation brute à la corrélation ajustée sur Z.",
  aRetenir:"Une corrélation observée entre X et Y peut provenir d'une variable de confusion Z qui agit sur les deux. Ajuster sur Z (stratifier, régression multiple) ou randomiser permet d'isoler l'effet propre de X.",
  piege:"Ajuster sur toutes les variables n'est pas toujours la solution : ajuster sur un médiateur ou un collisionneur crée des biais. Seul un plan d'étude (randomisation) élimine la confusion.",
  build:function(k,S){
    var dg=UI.canvas(k,120,.25,140), c=UI.canvas(k,300,.7,400);
    var a=k.slider("Effet de Z sur X",0,0.95,0.05,0.7,"");
    var b=k.slider("Effet de Z sur Y",0,0.95,0.05,0.7,"");
    var d=k.slider("Effet direct réel de X sur Y",0,0.6,0.05,0,"");
    var n=k.slider("Nombre de sujets",50,400,10,200,"");
    var st=k.toggle("Stratifier sur Z (3 niveaux)",false);
    var ro=k.readouts(["r brut (X, Y)","r ajusté sur Z","Pente brute","Pente ajustée sur Z"]);
    var nt=k.note("","");
    k.draw(function(){
      var N=n.value, r=ST.rng(31415+N), z=[], x=[], y=[], i;
      for(i=0;i<N;i++){ var zz=ST.randn(r), xx=a.value*zz+Math.sqrt(1-a.value*a.value)*ST.randn(r), yy=b.value*zz+d.value*xx+0.7*ST.randn(r); z.push(zz); x.push(xx); y.push(yy); }
      var rxy=corr(x,y), rxz=corr(x,z), ryz=corr(y,z), pr=(rxy-rxz*ryz)/Math.sqrt((1-rxz*rxz)*(1-ryz*ryz));
      var f=ols(x,y);
      var mx=ST.mean(x), my=ST.mean(y), mz=ST.mean(z), sxx=0, szz=0, sxz=0, sxy=0, szy=0;
      for(i=0;i<N;i++){ var dx=x[i]-mx, dz=z[i]-mz, dy=y[i]-my; sxx+=dx*dx; szz+=dz*dz; sxz+=dx*dz; sxy+=dx*dy; szy+=dz*dy; }
      var adj=(sxy*szz-sxz*szy)/(sxx*szz-sxz*sxz);
      var q1=-0.43, q2=0.43, cols=[P.teal,P.amber,P.red];
      /* schéma causal */
      dg.clear(); var nodes={Z:[dg.W/2,26,"Z : tabac",P.red],X:[dg.W*0.2,dg.H-26,"X : café",P.mat],Y:[dg.W*0.8,dg.H-26,"Y : risque cardiaque",P.orange]};
      function arrow(from,to,w,col,dash){ var A=nodes[from],B=nodes[to],dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L; var x1=A[0]+ux*34,y1=A[1]+uy*18,x2=B[0]-ux*34,y2=B[1]-uy*18;
        if(w<0.02){ S.draw.line(dg,x1,y1,x2,y2,S.draw.tint(P.grey,.6),1.4,[4,4]); return; } if(dash){ S.draw.line(dg,x1,y1,x2,y2,col,1+w*7,[6,4]); } S.draw.arrow(dg,x1,y1,x2,y2,col,1+w*7); S.draw.label(dg,S.fmt(w,2),(x1+x2)/2,(y1+y2)/2-(from==="X"?14:0),{color:col,size:11}); }
      arrow("Z","X",a.value,P.red); arrow("Z","Y",b.value,P.red); arrow("X","Y",d.value,P.green);
      Object.keys(nodes).forEach(function(kk){ var nd=nodes[kk]; S.draw.panel(dg,nd[0]-(nd[2].length>14?62:44),nd[1]-14,(nd[2].length>14?124:88),28,{shadow:false,stroke:nd[3],radius:14}); S.draw.text(dg,nd[2],nd[0],nd[1],{size:nd[2].length>14?10:11.5,color:nd[3]}); });
      c.clear(); var ax=S.draw.axes(c,{x0:-3.5,x1:3.5,y0:-4,y1:4,xl:"X : café (écarts réduits)",yl:"Y : risque cardiaque",stepX:1,stepY:1,t:20});
      for(i=0;i<N;i++){ var g=z[i]<q1?0:(z[i]<q2?1:2); S.draw.dot(c,ax.X(x[i]),ax.Y(y[i]),N>250?3:3.8,st.value?S.draw.tint(cols[g],.85):S.draw.tint(P.mat,.7)); }
      if(!st.value) S.draw.fn(c,ax,function(t){ return f.a*t+f.b; },P.ink,2.8);
      else [0,1,2].forEach(function(g){ var xg=[], yg=[]; for(i=0;i<N;i++){ if((z[i]<q1?0:(z[i]<q2?1:2))===g){ xg.push(x[i]); yg.push(y[i]); } } if(xg.length>3){ var fg=ols(xg,yg); S.draw.fn(c,ax,function(t){ return fg.a*t+fg.b; },cols[g],2.8); } });
      if(st.value) S.draw.legend(c,[[P.teal,"Z bas"],[P.amber,"Z moyen"],[P.red,"Z élevé"]],ax.R-4,ax.T+2,{align:"right"});
      else S.draw.label(c,"droite brute : pente "+S.fmt(f.a,2),ax.R-6,ax.T+40,{color:P.ink,align:"right",size:11.5});
      ro.set(0,S.fmt(rxy,2)); ro.set(1,S.fmt(pr,2)); ro.set(2,S.fmt(f.a,2)); ro.set(3,S.fmt(adj,2));
      if(d.value===0&&Math.abs(rxy)>0.25) nt.set("X n'a aucun effet direct sur Y, pourtant r = "+S.fmt(rxy,2)+" : la corrélation vient entièrement de Z. Après ajustement, le lien disparaît.","warn");
      else if(d.value>0) nt.set("Il existe un vrai effet direct de X : la pente ajustée le retrouve, la pente brute le mélange avec l'effet de Z.","ok");
      else nt.set("Peu de confusion : les liens avec Z sont faibles.","ok");
    });
  }
});

SFA.sim({
  id:"us-c10-regression-logistique", ch:"c10", tag:"Option · introduction",
  titre:"Régression logistique : probabilité, odds et courbe en S",
  resume:"Expliquer un événement oui/non (complication) par une variable continue : p = 1/(1 + e^−(β₀ + β₁x)).",
  but:"40 patients : concentration d'un biomarqueur (x) et survenue d'une complication (0/1, points rouges en haut). Glisse la courbe en S par ses deux poignées (centre et pente), ou cherche l'ajustement optimal, et lis la probabilité, les odds et l'odds ratio.",
  aRetenir:"ln(odds) = β₀ + β₁x. e<sup>β₁</sup> est l'odds ratio pour une augmentation de x d'une unité. La probabilité vaut 50 % en x = −β₀/β₁. Les coefficients se trouvent par maximum de vraisemblance, pas par moindres carrés.",
  piege:"Une droite ajustée sur des 0/1 prédit des « probabilités » hors de [0 ; 1] ; la sigmoïde reste entre 0 et 1. Un OR de e<sup>β₁</sup> concerne les odds, pas la probabilité.",
  build:function(k,S){
    var c=UI.canvas(k,330,.78,420), r=ST.rng(2), X=[], Y=[], i;
    for(i=0;i<40;i++){ var x=0.25+i*0.25; X.push(x); Y.push(r()<1/(1+Math.exp(-(-3.5+0.7*x)))?1:0); }
    function ll(b0,b1){ var s=0; for(var j=0;j<40;j++){ var p=1/(1+Math.exp(-(b0+b1*X[j]))); p=Math.min(1-1e-12,Math.max(1e-12,p)); s+=Y[j]?Math.log(p):Math.log(1-p); } return s; }
    function fit(){ var b0=0,b1=0,j; for(var it=0;it<50;it++){ var g0=0,g1=0,h00=0,h01=0,h11=0; for(j=0;j<40;j++){ var p=1/(1+Math.exp(-(b0+b1*X[j]))), w=p*(1-p); g0+=Y[j]-p; g1+=(Y[j]-p)*X[j]; h00+=w; h01+=w*X[j]; h11+=w*X[j]*X[j]; }
      var det=h00*h11-h01*h01; b0+=(h11*g0-h01*g1)/det; b1+=(-h01*g0+h00*g1)/det; } return [b0,b1]; }
    var best=fit(), lin=ols(X,Y), llmax=ll(best[0],best[1]);
    var b0=k.slider("β₀ (ordonnée)",-10,2,0.1,-1,"");
    var b1=k.slider("β₁ (effet du biomarqueur)",-0.5,2.5,0.05,0.2,"");
    var x0=k.slider("Biomarqueur x pour lire la probabilité",0,10,0.25,6,"");
    var cmp=k.toggle("Comparer à une droite ajustée par moindres carrés",false);
    k.button("Ajustement optimal (maximum de vraisemblance)",function(){ b0.set(Math.round(best[0]*10)/10); b1.set(Math.round(best[1]*100)/100); },true);
    var ro=k.readouts(["Probabilité en x","Odds en x","OR pour +1 unité","x où p = 50 %","Log-vraisemblance (max : "+S.fmt(llmax,1)+")"]);
    var nt=k.note("","");
    var lay={};
    function handles(){ var B1=b1.value, x50=B1!==0?-b0.value/B1:5; return {x50:x50, x90:B1>0.02?x50+Math.log(9)/B1:null}; }
    UI.drag(c,function(){ if(!lay.ax) return []; var h=handles(), out=[{id:"c",x:lay.ax.X(h.x50),y:lay.ax.Y(0.5),r:18},{id:"x0",x:lay.ax.X(x0.value),y:lay.ax.Y(1/(1+Math.exp(-(b0.value+b1.value*x0.value)))),r:14}]; if(h.x90!==null&&h.x90<10.5) out.push({id:"s",x:lay.ax.X(h.x90),y:lay.ax.Y(0.9),r:18}); return out; },
      function(id,q){ var h=handles(), B1=b1.value, xv=UI.clamp(lay.ax.ix(q.x),0,10.5);
        if(id==="c"){ var nb0=-B1*xv; b0.set(UI.clamp(Math.round(nb0*10)/10,-10,2)); }
        else if(id==="s"){ var d=Math.max(0.3,xv-h.x50), nb1=Math.log(9)/d, nb0=-nb1*h.x50; b1.set(UI.clamp(Math.round(nb1*20)/20,0.05,2.5)); b0.set(UI.clamp(Math.round(nb0*10)/10,-10,2)); }
        else x0.set(UI.clamp(Math.round(xv*4)/4,0,10)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ax=S.draw.axes(c,{x0:0,x1:10.5,y0:-0.15,y1:1.15,xl:"biomarqueur x",yl:"probabilité de complication",stepX:1,stepY:0.25,t:20}); lay.ax=ax;
      S.draw.line(c,ax.L,ax.Y(0.5),ax.R,ax.Y(0.5),S.draw.tint(P.grey,.6),1,[4,4]);
      if(cmp.value) S.draw.fn(c,ax,function(x){ return lin.a*x+lin.b; },P.orange,2.4,[6,4]);
      S.draw.area(c,ax,function(x){ return 1/(1+Math.exp(-(b0.value+b1.value*x))); },0,10.5,P.mat,0.08);
      S.draw.fn(c,ax,function(x){ return 1/(1+Math.exp(-(b0.value+b1.value*x))); },P.mat,3.4);
      for(i=0;i<40;i++){ var yy=Y[i]?1:0, jit=((i*37)%11-5)*0.006; S.draw.dot(c,ax.X(X[i]),ax.Y(yy+(Y[i]?0.07:-0.07)+jit),4,Y[i]?P.red:S.draw.tint(P.grey,.85)); }
      var p=1/(1+Math.exp(-(b0.value+b1.value*x0.value))), h=handles();
      S.draw.line(c,ax.X(x0.value),ax.Y(0),ax.X(x0.value),ax.Y(p),P.green,1.6,[4,4]); S.draw.line(c,ax.L,ax.Y(p),ax.X(x0.value),ax.Y(p),P.green,1.6,[4,4]); S.draw.dot(c,ax.X(x0.value),ax.Y(p),7,P.green);
      S.draw.label(c,S.fmt(100*p,0)+" %",ax.X(x0.value)+10,ax.Y(p)+(p>0.5?16:-14),{color:P.green,align:"left",size:11.5});
      if(h.x50>=0&&h.x50<=10.5) S.draw.dot(c,ax.X(h.x50),ax.Y(0.5),8.5,P.mat);
      if(h.x90!==null&&h.x90<10.5) S.draw.dot(c,ax.X(h.x90),ax.Y(0.9),8.5,P.violet);
      S.draw.legend(c,[[P.mat,"modèle logistique"],[P.red,"complication (1)"],[S.draw.tint(P.grey,.9),"pas de complication (0)"]].concat(cmp.value?[[P.orange,"droite (hors [0 ; 1])",1]]:[]),ax.L+8,ax.T+4);
      UI.hint(c,"glisse le centre et la pente",ax.R-110,ax.B-14,P.mat);
      var L=ll(b0.value,b1.value);
      S.draw.display(c,S.fmt(L,1),ax.R-82,ax.B-84,{w:150,h:48,caption:"log-vraisemblance (max "+S.fmt(llmax,1)+")",color:L>=llmax-0.6?P.green:P.ink,size:18});
      ro.set(0,S.fmt(100*p,1)+" %"); ro.set(1,p>0.9999?"> 10 000":S.fmt(p/(1-p),2)); ro.set(2,S.fmt(Math.exp(b1.value),2)); ro.set(3,b1.value===0?"—":S.fmt(-b0.value/b1.value,2)); ro.set(4,S.fmt(L,1));
      nt.set(L>=llmax-0.6?"Tu as trouvé l'ajustement du maximum de vraisemblance : la vraisemblance ne peut plus guère augmenter.":cmp.value?"La droite orange sort de [0 ; 1] aux extrémités : une « probabilité » négative ou supérieure à 1 n'a pas de sens. La sigmoïde reste dans [0 ; 1].":"Rapproche la log-vraisemblance de son maximum ("+S.fmt(llmax,1)+") en glissant le centre (50 %) et la pente (point violet = 90 %).",L>=llmax-0.6?"ok":"");
    });
  }
});
})();
