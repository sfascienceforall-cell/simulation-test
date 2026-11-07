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
function lround(ps,n){ /* effectifs entiers de somme n (plus grands restes) */
  var raw=ps.map(function(p){ return p*n; }), fl=raw.map(Math.floor), rem=n-fl.reduce(function(a,b){ return a+b; },0), idx=raw.map(function(v,i){ return [v-Math.floor(v),i]; }).sort(function(a,b){ return b[0]-a[0]; });
  for(var i=0;i<rem;i++) fl[idx[i][1]]++; return fl; }
function chiCurve(c,S,stat,df,xmax){
  var ax=S.draw.axes(c,{x0:0,x1:xmax,y0:0,y1:df<=2?(df===1?0.8:0.55):0.3,xl:"χ²",stepY:0.1,t:24});
  var f=function(x){ return Math.min(df===1?0.8:5,ST.chi2pdf(Math.max(x,1e-6),df)); }, crit=ST.chi2ppf(0.95,df);
  S.draw.area(c,ax,f,Math.min(crit,xmax),xmax,P.red,0.25); if(stat<xmax) S.draw.area(c,ax,f,stat,xmax,P.mat,0.45);
  S.draw.fn(c,ax,f,P.ink,2.6);
  S.draw.line(c,ax.X(Math.min(stat,xmax)),ax.B,ax.X(Math.min(stat,xmax)),ax.T,P.mat,2.6);
  S.draw.line(c,ax.X(crit),ax.B,ax.X(crit),ax.T,P.red,1.6,[5,4]);
  S.draw.label(c,"seuil 5 % = "+S.fmt(crit,2),Math.min(ax.X(crit)+6,ax.R-4),ax.T+36,{align:ax.X(crit)>ax.R-120?"right":"left",size:11,color:P.red});
  S.draw.label(c,"χ² observé = "+S.fmt(stat,2),Math.min(ax.X(Math.min(stat,xmax))+(stat>crit?-8:8),ax.R-4),ax.T+12,{align:stat>crit?"right":"left",size:12,color:P.mat});
  return ax;
}

SFA.sim({
  id:"us-c09-chi2-adequation-mendel", ch:"c09", tag:"Classique",
  titre:"χ² d'adéquation : un croisement respecte-t-il 3:1, 1:2:1 ou 9:3:3:1 ?",
  resume:"Compare des effectifs de descendants aux proportions attendues ; lis χ², degrés de liberté et p-valeur.",
  but:"Choisis la proportion théorique et le nombre de descendants, puis éloigne les effectifs observés de la théorie (curseur, ou glisse la première barre bleue) : le χ² croît, la p-valeur chute.",
  aRetenir:"χ² = Σ (O − E)²/E, avec E = n × proportion théorique. Degrés de liberté = (nombre de classes − 1). On rejette le modèle si χ² dépasse la valeur critique (p &lt; 0,05).",
  piege:"Le test exige des effectifs théoriques ≥ 5 par classe. Un grand n rend le test sensible à des écarts minuscules. « Ne pas rejeter 3:1 » ne prouve pas que 3:1 est vrai.",
  build:function(k,S){
    var c=UI.canvas(k,230,.5,300), tb=UI.canvas(k,230,.5,300);
    var sc=k.seg("Proportion théorique",[["31","3:1"],["121","1:2:1"],["9331","9:3:3:1"]],"9331");
    var n=k.slider("Nombre de descendants n",20,2000,10,320,"");
    var e=k.slider("Écart à la théorie (en points de proportion)",0,15,0.5,5,"%");
    var ro=k.readouts(["χ²","Degrés de liberté","p-valeur","Décision (5 %)"]);
    var nt=k.note("","");
    var lay={};
    UI.drag(tb,function(){ return lay.hs||[]; },function(id,q){ var v=(lay.y0-q.y)/(lay.y0-lay.top)*lay.mx, th0=lay.th0; e.set(UI.clamp(Math.round((th0-v/n.value)*200)/2,0,15)); k.redraw(); });
    k.draw(function(){
      var eps=e.value/100, th, ob, names;
      if(sc.value==="31"){ th=[0.75,0.25]; ob=[0.75-eps,0.25+eps]; names=["dominant","récessif"]; }
      else if(sc.value==="121"){ th=[0.25,0.5,0.25]; ob=[0.25+eps/2,0.5-eps,0.25+eps/2]; names=["AA","Aa","aa"]; }
      else { th=[9/16,3/16,3/16,1/16]; ob=[9/16-eps,3/16+eps/3,3/16+eps/3,1/16+eps/3]; names=["A·B·","A·bb","aaB·","aabb"]; }
      var O=lround(ob,n.value), E=th.map(function(p){ return p*n.value; }), chi=0, minE=1e9, contrib=[];
      O.forEach(function(o,i){ var q=Math.pow(o-E[i],2)/E[i]; contrib.push(q); chi+=q; if(E[i]<minE) minE=E[i]; });
      var df=th.length-1, p=1-ST.chi2cdf(chi,df);
      c.clear(); chiCurve(c,S,chi,df,Math.max(12,Math.min(60,chi*1.3+4)));
      tb.clear(); var ctx=tb.ctx, top=34, y0=tb.H-34, w=(tb.W-40)/th.length, mx=Math.max.apply(null,O.concat(E))*1.12; lay.y0=y0; lay.top=top; lay.mx=mx; lay.th0=th[0]; lay.hs=[];
      ctx.strokeStyle=P.axis; ctx.beginPath(); ctx.moveTo(20,y0+.5); ctx.lineTo(tb.W-20,y0+.5); ctx.stroke();
      for(var i=0;i<th.length;i++){ var x=20+i*w, h1=O[i]/mx*(y0-top), h2=E[i]/mx*(y0-top);
        ctx.fillStyle=S.draw.tint(P.mat,.85); ctx.fillRect(x+w*0.1,y0-h1,w*0.38,h1); ctx.fillStyle=S.draw.tint(P.grey,.7); ctx.fillRect(x+w*0.52,y0-h2,w*0.38,h2);
        S.draw.text(tb,names[i],x+w/2,y0+16,{size:12,color:"#2c3a4e"}); S.draw.text(tb,String(O[i]),x+w*0.29,y0-h1-9,{size:11,color:P.mat}); S.draw.text(tb,S.fmt(E[i],1),x+w*0.71,y0-h2-9,{size:11,color:"#5f6b7a"});
        if(i===0){ lay.hs=[{id:0,x:x+w*0.29,y:y0-h1,r:20}]; S.draw.dot(tb,x+w*0.29,y0-h1,6.5,P.mat); } }
      S.draw.legend(tb,[[P.mat,"observé"],[S.draw.tint(P.grey,.8),"attendu"]],tb.W-8,6,{align:"right",box:false});
      UI.hint(tb,"glisse la 1re barre",tb.W/2,top-8,P.mat);
      ro.set(0,S.fmt(chi,2)); ro.set(1,df); ro.set(2,ST.pval(p)); ro.set(3,p<0.05?"modèle rejeté":"compatible");
      if(minE<5) nt.set("Effectif théorique minimal = "+S.fmt(minE,1)+" &lt; 5 : le test du χ² n'est plus fiable, regroupe des classes ou augmente n.","warn");
      else nt.set(p<0.05?"Les effectifs observés s'écartent trop du modèle : sous H₀, un tel écart serait rare (p &lt; 5 %).":"Écart compatible avec la fluctuation d'échantillonnage sous le modèle.",p<0.05?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"us-c09-chi2-independance", ch:"c09", tag:"Classique · P1",
  titre:"χ² d'indépendance sur un tableau 2 × 2",
  resume:"Effectifs théoriques, χ², p-valeur et force de l'association, avec ou sans correction de Yates.",
  but:"Un facteur d'exposition (tabagisme) et une maladie. La mosaïque montre les 4 cases : bleue si elles contiennent plus de personnes que sous l'indépendance, rouge si moins. Glisse les poignées (part d'exposés, risques) et suis le χ².",
  aRetenir:"E<sub>ij</sub> = (total ligne × total colonne)/N ; χ² = Σ (O − E)²/E ; ν = (lignes − 1)(colonnes − 1) = 1 pour un 2 × 2. Le χ² mesure l'écart à l'indépendance ; le coefficient φ = √(χ²/N) mesure la force de l'association.",
  piege:"Un p très petit ne dit pas que l'association est forte (regarde φ ou le risque relatif). Si un effectif théorique est inférieur à 5, utilise le test exact de Fisher.",
  build:function(k,S){
    var m=UI.canvas(k,270,.6,340), c=UI.canvas(k,200,.42,260);
    var n=k.slider("Effectif total N",40,2000,10,400,"");
    var pe=k.slider("Part d'exposés (fumeurs)",0.1,0.9,0.05,0.4,"");
    var r1=k.slider("Risque chez les exposés",0,0.6,0.01,0.2,"");
    var r0=k.slider("Risque chez les non-exposés",0,0.6,0.01,0.12,"");
    var yt=k.toggle("Correction de continuité de Yates",false);
    var ro=k.readouts(["χ²","p-valeur","Force de l'association (phi)","Effectif théorique minimal"]);
    var tbl=k.note("","");
    var nt=k.note("","");
    var lay={}, YM=0.6;
    UI.drag(m,function(){ if(!lay.w) return []; var wE=lay.w*pe.value; return [{id:"d",x:lay.x0+wE,y:lay.y0-4,r:16},{id:"1",x:lay.x0+wE/2,y:lay.y0+lay.h*(r1.value/YM),r:16},{id:"0",x:lay.x0+wE+(lay.w-wE)/2,y:lay.y0+lay.h*(r0.value/YM),r:16}]; },
      function(id,q){ if(id==="d") pe.set(UI.clamp(Math.round((q.x-lay.x0)/lay.w*20)/20,0.1,0.9)); else (id==="1"?r1:r0).set(UI.clamp(Math.round((q.y-lay.y0)/lay.h*YM*100)/100,0,0.6)); k.redraw(); });
    k.draw(function(){
      var N=n.value, nE=Math.round(N*pe.value), nN=N-nE, a=Math.round(nE*r1.value), b=nE-a, cc=Math.round(nN*r0.value), d=nN-cc;
      var R1=a+b, R2=cc+d, C1=a+cc, C2=b+d, E=[[R1*C1/N,R1*C2/N],[R2*C1/N,R2*C2/N]], O=[[a,b],[cc,d]], chi=0, minE=1e9, i, j;
      for(i=0;i<2;i++) for(j=0;j<2;j++){ var dev=Math.abs(O[i][j]-E[i][j]); if(yt.value) dev=Math.max(0,dev-0.5); if(E[i][j]>0) chi+=dev*dev/E[i][j]; minE=Math.min(minE,E[i][j]); }
      var p=1-ST.chi2cdf(chi,1), phi=Math.sqrt(chi/N);
      tbl.set('<table style="border-collapse:collapse;width:100%;font-size:13px;text-align:center"><tr><th></th><th>Malades</th><th>Sains</th><th>Total</th></tr><tr><td><b>Exposés</b></td><td>'+a+' <small>(att. '+S.fmt(E[0][0],1)+')</small></td><td>'+b+' <small>(att. '+S.fmt(E[0][1],1)+')</small></td><td>'+R1+'</td></tr><tr><td><b>Non exposés</b></td><td>'+cc+' <small>(att. '+S.fmt(E[1][0],1)+')</small></td><td>'+d+' <small>(att. '+S.fmt(E[1][1],1)+')</small></td><td>'+R2+'</td></tr><tr><td><b>Total</b></td><td>'+C1+'</td><td>'+C2+'</td><td>'+N+'</td></tr></table>');
      /* mosaïque : couleur = résidu de Pearson */
      m.clear(); var ctx=m.ctx, x0=40, w=m.W-x0-14, y0=34, h=m.H-y0-70; lay.x0=x0; lay.w=w; lay.y0=y0; lay.h=h;
      var wE=w*nE/N, g=3;
      function cell(x,wd,yTop,hh,o,ex,txt){ var rs=ex>0?(o-ex)/Math.sqrt(ex):0, col=rs>=0?P.mat:P.red, al=Math.min(.85,.12+Math.abs(rs)*.22);
        ctx.fillStyle=S.draw.tint(col,al); ctx.fillRect(x,yTop,wd,hh); if(wd>40&&hh>38){ S.draw.text(m,txt+"  "+o,x+wd/2,yTop+hh/2-7,{size:12.5,color:P.ink}); S.draw.text(m,"attendu "+S.fmt(ex,1),x+wd/2,yTop+hh/2+9,{size:10.5,color:"#4a5a6e",weight:600}); } else if(wd>40&&hh>16){ S.draw.text(m,txt+" "+o+" (att. "+S.fmt(ex,1)+")",x+wd/2,yTop+hh/2,{size:11,color:P.ink}); } }
      var hM1=h*Math.min(1,r1.value/YM), hM0=h*Math.min(1,r0.value/YM);
      /* hauteur = risque (zoom 0–60 %) : zone malades en haut */
      cell(x0,wE-g,y0,hM1,a,E[0][0],"malades"); cell(x0,wE-g,y0+hM1,h-hM1,b,E[0][1],"sains");
      cell(x0+wE+g,w-wE-g,y0,hM0,cc,E[1][0],"malades"); cell(x0+wE+g,w-wE-g,y0+hM0,h-hM0,d,E[1][1],"sains");
      S.draw.text(m,"Exposés ("+nE+")",x0+wE/2,y0+h+14,{size:12,color:P.mat}); S.draw.text(m,"Non exposés ("+nN+")",x0+wE+(w-wE)/2,y0+h+14,{size:12,color:P.orange});
      S.draw.text(m,"part de malades (0 à 60 %)",x0-34,y0-14,{size:10.5,align:"left",color:"#6b7685"});
      S.draw.dot(m,x0+wE,y0-4,8,P.ink); S.draw.dot(m,x0+wE/2,y0+hM1,8,P.red); S.draw.dot(m,x0+wE+(w-wE)/2,y0+hM0,8,P.red);
      S.draw.legend(m,[[P.mat,"plus que sous indépendance"],[P.red,"moins que sous indépendance"]],m.W-8,m.H-40,{align:"right",box:false});
      c.clear(); chiCurve(c,S,chi,1,Math.max(10,Math.min(60,chi*1.3+3)));
      ro.set(0,S.fmt(chi,2)); ro.set(1,ST.pval(p)); ro.set(2,S.fmt(phi,3)); ro.set(3,S.fmt(minE,1));
      if(minE<5) nt.set("Effectif théorique &lt; 5 : approximation du χ² douteuse, utilise le test exact de Fisher.","warn");
      else if(p<0.05&&phi<0.1) nt.set("Association statistiquement significative mais faible (φ &lt; 0,1) : l'effectif est grand, l'effet est petit.","warn");
      else nt.set(p<0.05?"Les variables ne sont pas indépendantes (p &lt; 5 %).":"Indépendance non rejetée.",p<0.05?"ok":"");
    });
  }
});

SFA.sim({
  id:"us-c09-risque-relatif-odds-ratio", ch:"c09", tag:"Classique · P1",
  titre:"Risque relatif, odds ratio, différence de risques",
  resume:"Trois mesures d'association à partir d'un tableau 2 × 2 : quand l'OR ressemble au RR, et quand il s'en éloigne.",
  but:"Étude de cohorte : chaque grille compte 100 personnes (une pastille rouge = un malade). Règle le risque chez les non-exposés (aussi en glissant le point de la courbe), le risque relatif réel et l'effectif : l'OR s'éloigne du RR dès que la maladie devient fréquente.",
  aRetenir:"RR = (a/(a+b))/(c/(c+d)) ; OR = (a·d)/(b·c) ; DR = p₁ − p₀ ; NNT = 1/DR. OR ≈ RR seulement si la maladie est rare dans les deux groupes (risques inférieurs à environ 10 %). Un IC de RR ou d'OR qui contient 1 correspond à une association non significative.",
  piege:"Quand la maladie est fréquente, l'OR exagère l'association par rapport au RR. Dans une étude cas-témoins, seul l'OR est estimable.",
  build:function(k,S){
    var g=UI.canvas(k,170,.36,215), c=UI.canvas(k,250,.56,330);
    var p0=k.slider("Risque chez les non-exposés",0.01,0.8,0.01,0.1,"");
    var rr=k.slider("Risque relatif réel",0.2,5,0.05,2,"");
    var n=k.slider("Effectif par groupe",50,3000,10,500,"");
    var ro=k.readouts(["RR [IC 95 %]","OR [IC 95 %]","Différence de risques","NNT / NNH"]);
    var tbl=k.note("",""), nt=k.note("","");
    var lay={};
    UI.drag(c,function(){ if(!lay.ax) return []; var orf=lay.orf; return [{id:"p",x:lay.ax.X(p0.value),y:lay.ax.Y(orf(p0.value)),r:18}]; },function(id,q){ p0.set(UI.clamp(Math.round(lay.ax.ix(q.x)*100)/100,0.01,0.8)); k.redraw(); });
    k.draw(function(){
      var p1=Math.min(0.99,p0.value*rr.value), N=n.value, a=Math.round(N*p1), b=N-a, cc=Math.round(N*p0.value), d=N-cc;
      var RR=(a/N)/(cc/N), OR=(a*d)/(b*cc), seR=Math.sqrt(1/a-1/N+1/cc-1/N), seO=Math.sqrt(1/a+1/b+1/cc+1/d), dr=a/N-cc/N, z=1.96;
      tbl.set('<table style="border-collapse:collapse;width:100%;font-size:13px;text-align:center"><tr><th></th><th>Malades</th><th>Sains</th><th>Risque</th></tr><tr><td><b>Exposés</b></td><td>'+a+'</td><td>'+b+'</td><td>'+S.fmt(100*a/N,1)+' %</td></tr><tr><td><b>Non exposés</b></td><td>'+cc+'</td><td>'+d+'</td><td>'+S.fmt(100*cc/N,1)+' %</td></tr></table>');
      g.clear(); c.clear();
      /* deux grilles de 100 personnes */
      var gw=(g.W-30)/2, cs=Math.min(15,(g.H-40)/10,(gw-10)/10), ctx=g.ctx;
      [[p1,"Exposés",P.mat,0],[p0.value,"Non exposés",P.orange,1]].forEach(function(gr){ var x0=15+gr[3]*(gw+10)+(gw-cs*10)/2, nsick=Math.round(gr[0]*100);
        for(var i=0;i<100;i++){ var cx=x0+(i%10)*cs+cs/2, cy=24+Math.floor(i/10)*cs+cs/2, sick=i<nsick; ctx.beginPath(); ctx.arc(cx,cy,cs*0.36,0,6.2832); ctx.fillStyle=sick?P.red:S.draw.tint(P.grey,.42); ctx.fill(); }
        S.draw.label(g,gr[1]+" : "+nsick+" malades sur 100",x0+cs*5,10,{color:gr[2],size:11}); });
      var ax=S.draw.axes(c,{x0:0,x1:0.8,y0:0,y1:Math.max(6,rr.value*1.4),xl:"risque de base chez les non-exposés",yl:"mesure d'association",stepX:0.1,t:24}); lay.ax=ax;
      var orf=function(x){ var q=Math.min(0.999,x*rr.value); return (q/(1-q))/(x/(1-x)); }; lay.orf=orf;
      S.draw.line(c,ax.L,ax.Y(1),ax.R,ax.Y(1),"#c8d0dc",1.3);
      S.draw.fn(c,ax,function(){ return rr.value; },P.grey,2.2,[6,4]); S.draw.fn(c,ax,orf,P.red,3);
      S.draw.dot(c,ax.X(p0.value),ax.Y(orf(p0.value)),8,P.red); S.draw.dot(c,ax.X(p0.value),ax.Y(rr.value),6,P.grey);
      S.draw.legend(c,[[P.grey,"RR réel (constant)",1],[P.red,"OR correspondant"]],ax.R-4,ax.B-72,{align:"right"});
      S.draw.label(c,"OR = "+S.fmt(OR,2),ax.X(p0.value)+(p0.value>0.55?-12:12),ax.Y(orf(p0.value))-(OR>rr.value*1.02?14:-16),{color:P.red,size:11.5,align:p0.value>0.55?"right":"left"});
      UI.hint(c,"glisse le point",ax.X(0.5),ax.B-14,P.red);
      if(a>0&&cc>0&&b>0&&d>0){
        ro.set(0,S.fmt(RR,2)+" ["+S.fmt(Math.exp(Math.log(RR)-z*seR),2)+" ; "+S.fmt(Math.exp(Math.log(RR)+z*seR),2)+"]");
        ro.set(1,S.fmt(OR,2)+" ["+S.fmt(Math.exp(Math.log(OR)-z*seO),2)+" ; "+S.fmt(Math.exp(Math.log(OR)+z*seO),2)+"]");
      } else { ro.set(0,"—"); ro.set(1,"—"); }
      ro.set(2,S.fmt(100*dr,1)+" points"); ro.set(3,Math.abs(dr)<1e-9?"—":(dr>0?"NNH ":"NNT ")+S.fmt(1/Math.abs(dr),0));
      if(p0.value*rr.value>0.99) nt.set("Le risque chez les exposés est plafonné à 99 % (un risque ne dépasse pas 1).","warn");
      else if(Math.max(p1,p0.value)<=0.1) nt.set("Maladie rare dans les deux groupes : l'OR est très proche du RR.","ok");
      else nt.set("Maladie fréquente : l'OR s'éloigne du RR ("+S.fmt(OR,2)+" contre "+S.fmt(RR,2)+") et l'exagère.","warn");
    });
  }
});

SFA.sim({
  id:"us-c09-fisher-effectifs-faibles", ch:"c09", tag:"Original · petits effectifs",
  titre:"Test exact de Fisher contre χ² sur de petits effectifs",
  resume:"Avec quelques patients par case, le χ² peut se tromper ; le test exact calcule la p-valeur sans approximation.",
  but:"Un petit essai : traitement et guérison. Modifie les quatre cases. La p-valeur exacte de Fisher est comparée à celle du χ² (avec et sans Yates).",
  aRetenir:"Les marges étant fixées, le nombre de guéris dans le groupe traité suit une loi hypergéométrique. La p-valeur bilatérale de Fisher additionne les probabilités des tableaux au plus aussi probables que celui observé. Utilise Fisher dès qu'un effectif théorique est inférieur à 5.",
  piege:"Le χ² sans correction a tendance à être trop optimiste sur de petits effectifs ; Yates corrige en partie mais devient conservateur.",
  build:function(k,S){
    var tb=UI.canvas(k,130,.27,150), c=UI.canvas(k,260,.58,340);
    var a=k.slider("Traités guéris",0,25,1,8,"");
    var b=k.slider("Traités non guéris",0,25,1,2,"");
    var cc=k.slider("Témoins guéris",0,25,1,3,"");
    var d=k.slider("Témoins non guéris",0,25,1,7,"");
    var ro=k.readouts(["Fisher exact (bilatéral)","χ² sans correction","χ² avec Yates","Effectif théorique minimal"]);
    var nt=k.note("","");
    function lh(a,b,cc,d){ var n=a+b+cc+d; return ST.lfact(a+b)+ST.lfact(cc+d)+ST.lfact(a+cc)+ST.lfact(b+d)-ST.lfact(n)-ST.lfact(a)-ST.lfact(b)-ST.lfact(cc)-ST.lfact(d); }
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value,D=d.value, N=A+B+C+D, R1=A+B,R2=C+D,C1=A+C,C2=B+D;
      tb.clear(); var ctx=tb.ctx, tx=84, cw=Math.min(120,(tb.W-tx-10)/3), rh=30, ty=16;
      ctx.save(); ctx.font="800 11px Mulish, system-ui"; ctx.fillStyle="#6b7685"; ctx.textAlign="center"; ctx.textBaseline="middle"; ["GUÉRIS","NON GUÉRIS","TOTAL"].forEach(function(t,j){ ctx.fillText(t,tx+cw*(j+.5),ty); });
      var rowsT=[["Traités",A,B,R1,P.mat],["Témoins",C,D,R2,P.orange],["Total",C1,C2,N,P.ink]];
      rowsT.forEach(function(r,i){ ctx.fillStyle=r[4]; ctx.textAlign="right"; ctx.font="800 12.5px Mulish, system-ui"; ctx.fillText(r[0],tx-8,ty+rh*(i+1)); for(var j=1;j<4;j++){ ctx.fillStyle=i<2&&j<3?S.draw.tint(j===1?P.green:P.red,.22):"#e8edf3"; S.draw.rrect(tb,tx+cw*(j-1)+2,ty+rh*(i+1)-rh/2+2,cw-4,rh-4,6); ctx.fill(); ctx.fillStyle=P.ink; ctx.textAlign="center"; ctx.font="800 14px Mulish, system-ui"; ctx.fillText(r[j],tx+cw*(j-0.5),ty+rh*(i+1)+1); } });
      ctx.restore();
      if(N===0||R1===0||R2===0||C1===0||C2===0){ c.clear(); nt.set("Une ligne ou une colonne est vide : le test n'est pas défini.","warn"); ro.set(0,"—"); ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); return; }
      var lo=Math.max(0,C1-R2), hi=Math.min(R1,C1), pobs=Math.exp(lh(A,R1-A,C1-A,R2-(C1-A))), pf=0, probs=[], x;
      for(x=lo;x<=hi;x++){ var q=Math.exp(lh(x,R1-x,C1-x,R2-(C1-x))); probs.push(q); if(q<=pobs*(1+1e-9)) pf+=q; }
      pf=Math.min(1,pf);
      var E=[R1*C1/N,R1*C2/N,R2*C1/N,R2*C2/N], O=[A,B,C,D], chi=0, chiY=0, minE=Math.min.apply(null,E);
      for(var i=0;i<4;i++){ chi+=Math.pow(O[i]-E[i],2)/E[i]; chiY+=Math.pow(Math.max(0,Math.abs(O[i]-E[i])-0.5),2)/E[i]; }
      c.clear(); var ax=S.draw.axes(c,{x0:lo-0.5,x1:hi+0.5,y0:0,y1:Math.max.apply(null,probs)*1.6,xl:"nombre de traités guéris possible (marges fixées)",yl:"probabilité",stepX:1,stepY:0.05,t:24});
      var w=(ax.R-ax.L)/(hi-lo+1);
      probs.forEach(function(q,i){ var xx=lo+i, ex=q<=pobs*(1+1e-9); c.ctx.fillStyle=xx===A?S.draw.tint(P.mat,.92):(ex?S.draw.tint(P.red,.6):S.draw.tint(P.grey,.5)); c.ctx.fillRect(ax.X(xx-0.5)+2,ax.Y(q),w-4,ax.B-ax.Y(q)); });
      S.draw.legend(c,[[P.mat,"tableau observé"],[S.draw.tint(P.red,.7),"au plus aussi probable (somme = p de Fisher)"],[S.draw.tint(P.grey,.7),"autres tableaux"]],ax.R-4,ax.T+2,{align:"right"});
      ro.set(0,ST.pval(pf)); ro.set(1,ST.pval(1-ST.chi2cdf(chi,1))); ro.set(2,ST.pval(1-ST.chi2cdf(chiY,1))); ro.set(3,S.fmt(minE,2));
      nt.set(minE<5?"Effectif théorique minimal &lt; 5 : le χ² n'est pas fiable ici ; retiens la p-valeur de Fisher.":"Effectifs théoriques ≥ 5 : le χ² et Fisher donnent des résultats proches.",minE<5?"warn":"ok");
    });
  }
});

SFA.sim({
  id:"us-c09-paradoxe-de-simpson", ch:"c09", tag:"Original · confusion",
  titre:"Paradoxe de Simpson : un traitement meilleur partout, moins bon au total",
  resume:"Un traitement qui gagne dans chaque stratum de gravité peut perdre dans l'ensemble, si les deux groupes n'ont pas la même gravité.",
  but:"Le traitement A réussit mieux que B chez les cas légers (92 % contre 88 %) et chez les cas graves (60 % contre 55 %). Glisse la frontière de composition de chaque groupe (barres du bas) : la part de cas graves change, et avec elle le taux global.",
  aRetenir:"Quand la gravité influence à la fois le choix du traitement et le résultat, c'est une variable de confusion : comparer les groupes globalement est trompeur. On stratifie ou on randomise.",
  piege:"Les taux globaux sont des moyennes pondérées par la composition des groupes. Si A reçoit surtout des cas graves, son taux global baisse même s'il est meilleur à gravité égale.",
  build:function(k,S){
    var c=UI.canvas(k,270,.6,340), cp=UI.canvas(k,130,.27,160);
    var sa=k.slider("Cas graves parmi les patients du traitement A",0.1,0.9,0.05,0.7,"");
    var sb=k.slider("Cas graves parmi les patients du traitement B",0.1,0.9,0.05,0.2,"");
    var ro=k.readouts(["Succès global A","Succès global B","Légers : A − B","Graves : A − B"]);
    var nt=k.note("","");
    var rL={A:0.92,B:0.88}, rG={A:0.60,B:0.55}, lay={};
    UI.drag(cp,function(){ return lay.L!==undefined?[{id:"a",x:lay.L+lay.w*(1-sa.value),y:lay.ya,r:16},{id:"b",x:lay.L+lay.w*(1-sb.value),y:lay.yb,r:16}]:[]; },function(id,q){ var v=UI.clamp(Math.round((1-(q.x-lay.L)/lay.w)*20)/20,0.1,0.9); (id==="a"?sa:sb).set(v); k.redraw(); });
    k.draw(function(){
      var gA=(1-sa.value)*rL.A+sa.value*rG.A, gB=(1-sb.value)*rL.B+sb.value*rG.B;
      c.clear(); cp.clear(); var ax=S.draw.axes(c,{x0:0,x1:3,y0:0,y1:1.14,yl:"taux de succès",stepX:100,hideZero:true,stepY:0.2,l:54,t:22,b:38});
      var cats=[["Cas légers",rL.A,rL.B],["Cas graves",rG.A,rG.B],["Ensemble",gA,gB]];
      cats.forEach(function(ct,i){ var cx=ax.X(i+0.5), w=(ax.X(1)-ax.X(0))*0.28, lose=i===2&&gA<gB;
        c.ctx.fillStyle=S.draw.tint(P.mat,.88); c.ctx.fillRect(cx-w-3,ax.Y(ct[1]),w,ax.B-ax.Y(ct[1])); c.ctx.fillStyle=S.draw.tint(P.orange,.88); c.ctx.fillRect(cx+3,ax.Y(ct[2]),w,ax.B-ax.Y(ct[2]));
        S.draw.label(c,S.fmt(100*ct[1],0)+" %",cx-w/2-3,ax.Y(ct[1])-12,{size:11.5,color:P.mat}); S.draw.label(c,S.fmt(100*ct[2],0)+" %",cx+w/2+3,ax.Y(ct[2])-12,{size:11.5,color:P.orange});
        S.draw.text(c,ct[0],cx,ax.B+20,{size:12.5,color:lose?P.red:"#2c3a4e"}); });
      S.draw.legend(c,[[P.mat,"traitement A"],[P.orange,"traitement B"]],ax.R-4,ax.T,{align:"right"});
      /* composition des groupes */
      var L=96,R=cp.W-14,w=R-L; lay.L=L; lay.w=w; lay.ya=34; lay.yb=84;
      S.draw.text(cp,"part de cas graves dans chaque groupe",L-82,12,{size:11,align:"left",color:"#3d4b5f"});
      [["A",sa.value,34,P.mat],["B",sb.value,84,P.orange]].forEach(function(r){ var xl=L+w*(1-r[1]); cp.ctx.fillStyle=S.draw.tint(P.green,.4); cp.ctx.fillRect(L,r[2]-14,xl-L,28); cp.ctx.fillStyle=S.draw.tint(P.red,.55); cp.ctx.fillRect(xl,r[2]-14,R-xl,28);
        S.draw.text(cp,"Groupe "+r[0],L-8,r[2],{size:12,align:"right",color:r[3]}); S.draw.text(cp,S.fmt(100*(1-r[1]),0)+(xl-L>78?" % légers":" %"),L+(xl-L)/2,r[2],{size:11,color:P.ink}); S.draw.text(cp,S.fmt(100*r[1],0)+(R-xl>78?" % graves":" %"),xl+(R-xl)/2,r[2],{size:11,color:P.ink}); S.draw.dot(cp,xl,r[2],7,r[3]); });
      ro.set(0,S.fmt(100*gA,1)+" %"); ro.set(1,S.fmt(100*gB,1)+" %"); ro.set(2,"+ "+S.fmt(100*(rL.A-rL.B),0)+" points"); ro.set(3,"+ "+S.fmt(100*(rG.A-rG.B),0)+" points");
      if(gA<gB) nt.set("Paradoxe : A est meilleur dans les deux strates mais son taux global ("+S.fmt(100*gA,1)+" %) est inférieur à celui de B ("+S.fmt(100*gB,1)+" %). La gravité est un facteur de confusion.","warn");
      else nt.set("Les groupes ont des compositions proches : le taux global reflète la supériorité de A.","ok");
    });
  }
});
})();
