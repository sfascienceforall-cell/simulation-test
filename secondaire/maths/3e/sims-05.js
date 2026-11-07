/* Chapitre 5 : inéquations du premier degré */
window.M3 = window.M3 || {};
/* résout (a x + b) op (c x + d) ; renvoie {all,none,op,bound} */
M3.solveIneq = function(a,b,c,d,op){
  var m=a-c, r=d-b, flip={"<":">","≤":"≥",">":"<","≥":"≤"};
  if(m===0){ var t={"<":b<d,"≤":b<=d,">":b>d,"≥":b>=d}[op]; return t?{all:true}:{none:true}; }
  return {op:m>0?op:flip[op], bound:r/m};
};
M3.interval = function(sol,S){
  if(sol.all) return "ℝ (tous les nombres)"; if(sol.none) return "∅ (aucun nombre)";
  var v=S.fmt(sol.bound,2);
  return {"<":"]−∞ ; "+v+"[","≤":"]−∞ ; "+v+"]",">":"]"+v+" ; +∞[","≥":"["+v+" ; +∞["}[sol.op];
};
M3.range = function(sol,x0,x1){
  if(sol.all) return {from:x0-1,to:x1+1,fo:true,too:true};
  if(sol.none) return null;
  if(sol.op==="<"||sol.op==="≤") return {from:-Infinity,to:sol.bound,fo:true,too:sol.op==="<"};
  return {from:sol.bound,to:Infinity,fo:sol.op===">",too:true};
};
SFA.sim({
  id:"m3-c05-test", ch:"c05", tag:"Curseur-test", titre:"Teste un nombre : vrai ou faux ?",
  resume:"Fais glisser x sur la droite numérique et vois quand l'inéquation devient vraie.",
  but:"Fais glisser le point rouge (ou le curseur) : chaque essai laisse une pastille verte (vrai) ou rouge (faux). Trouve la frontière, puis révèle la solution calculée pour comparer.",
  aRetenir:"La solution d'une inéquation est un ensemble de nombres, pas un seul. La frontière est incluse (crochet fermé) pour ≤ et ≥, exclue (crochet ouvert) pour < et >.",
  piege:"On écrit la réponse comme x < 4 ou ]−∞ ; 4[, jamais x = 4. Et au bord (x = 4), < est faux mais ≤ est vrai.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.66}), P=S.draw.palette, T=S.draw.tint;
    var PRE=[[3,-2,1,6,"<"],[3,-2,1,6,"≤"],[-2,1,0,5,"≥"],[2,3,2,7,">"],[1,4,3,-2,">"]];
    var tests=[], geo={};
    var ps=k.select("Inéquation",PRE.map(function(p,i){return [i,M3.side(p[0],p[1],0)+" "+p[4]+" "+M3.side(p[2],p[3],0)];}),0,function(){ tests=[]; });
    var x=k.slider("x",-10,10,0.5,0,"");
    var rv=k.toggle("Révéler la solution calculée",false);
    k.button("Marquer cet essai",function(){ mark(); },true);
    k.button("Effacer les essais",function(){ tests=[]; });
    var ro=k.readouts(["Membre gauche","Membre droit","Vrai ou faux ?","Solution"]);
    var nt=k.note("");
    function holds(p,X){ var l=p[0]*X+p[1], r=p[2]*X+p[3]; return {"<":l<r,"≤":l<=r,">":l>r,"≥":l>=r}[p[4]]; }
    function mark(){ var p=PRE[+ps.value], X=x.value; if(!tests.some(function(t){return t.v===X;})) tests.push({v:X,ok:holds(p,X)}); if(tests.length>40) tests.shift(); }
    M3.drag(c,function(){ return geo.X?[{id:"x",x:geo.X(x.value),y:geo.y,r:9999}]:[]; },function(id,p){ x.set(M3.snap((p.x-geo.L)/(geo.R-geo.L)*20-10,0.5,-10,10)); k.redraw(); },function(){ mark(); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, p=PRE[+ps.value], X=x.value, l=p[0]*X+p[1], r=p[2]*X+p[3], ok=holds(p,X), fs=M3.sz(c,17);
      var sol=M3.solveIneq(p[0],p[1],p[2],p[3],p[4]), rg=M3.range(sol,-10,10), col=ok?P.green:P.red;
      /* badge */
      S.draw.panel(c,c.W/2-70,12,140,40,{shadow:false,fill:T(col,0.12),stroke:T(col,0.5),radius:20});
      S.draw.text(c,ok?"VRAI ✓":"FAUX ✗",c.W/2,32,{size:fs+5,color:col});
      /* les deux membres en vis-à-vis */
      var cy=c.H*0.4, bw=Math.min(130,c.W*0.34);
      function chip(cx,txt,val,cc){ S.draw.panel(c,cx-bw/2,cy-30,bw,60,{shadow:false,fill:"#fff",stroke:T(cc,0.45)});
        S.draw.text(c,txt,cx,cy-13,{size:fs-3,color:P.grey,math:true}); S.draw.text(c,S.fmt(val,2),cx,cy+10,{size:fs+4,color:cc,weight:800}); }
      chip(c.W/2-bw/2-30,M3.side(p[0],p[1],0),l,P.acc); chip(c.W/2+bw/2+30,M3.side(p[2],p[3],0),r,P.red);
      S.draw.dot(c,c.W/2,cy,22,col); S.draw.text(c,p[4],c.W/2,cy+0.5,{size:fs+6,color:"#fff"});
      /* droite numérique */
      var o={x0:-10,x1:10,y:c.H*0.8,step:2,dec:0,mark:X,markColor:col,marks:tests,color:P.green}; if(rv.value&&rg){o.from=rg.from;o.to=rg.to;o.fo=rg.fo;o.too=rg.too;}
      var XX=M3.nline(c,S,o); geo.X=XX; geo.y=o.y; geo.L=26; geo.R=c.W-26;
      M3.handle(c,XX(X),o.y,col,false,10);
      if(!tests.length&&!rv.value) S.draw.text(c,"Glisse le point rouge sur la droite",c.W/2,c.H-12,{size:12,color:P.grey,weight:600});
      var near=!sol.all&&!sol.none&&Math.abs(X-sol.bound)<1e-9;
      ro.set(0,S.fmt(l,2)); ro.set(1,S.fmt(r,2)); ro.set(2,ok?"vrai ✓":"faux ✗"); ro.set(3,rv.value?M3.interval(sol,S):"à trouver");
      if(near) nt.set("Sur la frontière : les deux membres sont égaux ("+S.fmt(l,2)+" = "+S.fmt(r,2)+"). Avec « "+p[4]+" », x = "+S.fmt(X,1)+" est "+(ok?"une solution (≤ ou ≥ : borne incluse).":"exclu (< ou > : borne exclue)."),ok?"ok":"warn");
      else if(rv.value) nt.set(sol.all?"Les x disparaissent et il reste une inégalité vraie : tous les nombres conviennent.":sol.none?"Les x disparaissent et il reste une inégalité fausse : aucun nombre ne convient.":"Zone verte : tous les x qui rendent l'inéquation vraie. Le rond est "+(sol.op==="<"||sol.op===">"?"vide (borne exclue)":"plein (borne incluse)")+".",sol.none?"warn":"ok");
      else nt.set(tests.length?"Tu as testé "+tests.length+" nombre(s). Où les pastilles vertes s'arrêtent-elles ? Cherche la frontière.":"Glisse x et regarde si l'inéquation est vraie.","");
    });
  }
});
SFA.sim({
  id:"m3-c05-graphe", ch:"c05", tag:"Graphique", titre:"f(x) > g(x) : où la courbe est-elle au-dessus ?",
  resume:"Deux droites : la solution est la partie de l'axe où l'une passe au-dessus de l'autre.",
  but:"Règle les droites et le sens, puis lis la zone solution colorée sur l'axe des x.",
  aRetenir:"Résoudre f(x) > g(x), c'est trouver les x où la droite de f est strictement au-dessus de celle de g. Le point d'intersection fournit la frontière.",
  piege:"La solution est une valeur de x (axe horizontal), pas une valeur de y.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a=k.slider("a (f : y = ax + b)",-3,3,0.5,1,""), b=k.slider("b",-6,6,1,-1,""), cc=k.slider("c (g : y = cx + d)",-3,3,0.5,-1,""), d=k.slider("d",-6,6,1,3,"");
    var op=k.seg("Inéquation",[[">","f(x) > g(x)"],["<","f(x) < g(x)"]],">");
    var ro=k.readouts(["Frontière","Solution"]);
    k.draw(function(){
      c.clear(); var A=a.value,B=b.value,C=cc.value,D=d.value;
      var ax=S.draw.axes(c,{x0:-8,x1:8,y0:-12,y1:12,xl:"x",yl:"y",stepX:2,stepY:4}), ctx=c.ctx;
      var sol=M3.solveIneq(A,B,C,D,op.value);
      var rg=M3.range(sol,-8,8);
      if(rg){ var f=Math.max(-8,rg.from), t=Math.min(8,rg.to);
        ctx.fillStyle="rgba(46,107,85,.16)"; ctx.fillRect(ax.X(f),ax.T,ax.X(t)-ax.X(f),ax.B-ax.T);
        ctx.strokeStyle=P.green; ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(ax.X(f),ax.Y(0)); ctx.lineTo(ax.X(t),ax.Y(0)); ctx.stroke(); }
      S.draw.fn(c,ax,function(x){return A*x+B;},P.acc,3); S.draw.fn(c,ax,function(x){return C*x+D;},P.red,3);
      function cl(y){ return Math.max(ax.T+10,Math.min(ax.B-10,y)); }
      S.draw.text(c,"f",ax.X(7)-4,cl(ax.Y(A*7+B)-10),{size:13,color:P.acc}); S.draw.text(c,"g",ax.X(7)-4,cl(ax.Y(C*7+D)+12),{size:13,color:P.red});
      if(A!==C){ var xs=(D-B)/(A-C); if(Math.abs(xs)<=8&&Math.abs(A*xs+B)<=12) S.draw.dot(c,ax.X(xs),ax.Y(A*xs+B),7,P.ink); ro.set(0,"x = "+S.fmt(xs,2)); } else ro.set(0,"droites parallèles");
      ro.set(1,M3.interval(sol,S));
    });
  }
});
SFA.sim({
  id:"m3-c05-signe", ch:"c05", tag:"Pourquoi le sens change", titre:"Multiplier par un négatif retourne l'ordre",
  resume:"Deux nombres p < q : que devient l'ordre quand on les multiplie ou qu'on ajoute k ?",
  but:"Place p et q, choisis ajouter ou multiplier, puis fais varier k. Regarde les flèches : quand elles se croisent, l'ordre est retourné.",
  aRetenir:"Ajouter ou soustraire un même nombre, ou multiplier par un nombre positif, conserve le sens. Multiplier (ou diviser) par un nombre négatif inverse le sens de l'inégalité.",
  piege:"−2x > 6 donne x < −3 (et non x > −3) : on divise par −2, donc on inverse.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.78}), P=S.draw.palette, T=S.draw.tint;
    var p=k.slider("p",-5,5,1,-2,""), q=k.slider("q",-5,5,1,3,"");
    var md=k.seg("Opération",[["add","Ajouter k"],["mul","Multiplier par k"]],"mul");
    var kk=k.slider("k",-4,4,1,-2,"");
    var ro=k.readouts(["Avant","Après"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, Pp=p.value,Q=q.value,K=kk.value,add=md.value==="add", fs=M3.sz(c,15);
      var f=function(v){return add?v+K:v*K;};
      var lo=Math.min(Pp,Q,f(Pp),f(Q)), hi=Math.max(Pp,Q,f(Pp),f(Q)), m=Math.max(Math.abs(lo),Math.abs(hi),5);
      var x1=Math.ceil(m/5)*5, x0=-x1, st=x1>=10?5:1;
      var y1=c.H*0.26, y2=c.H*0.74;
      var X1=M3.nline(c,S,{x0:x0,x1:x1,y:y1,step:st,dec:0}), X2=M3.nline(c,S,{x0:x0,x1:x1,y:y2,step:st,dec:0});
      var sb=Pp<Q?"<":Pp>Q?">":"=", sa=f(Pp)<f(Q)?"<":f(Pp)>f(Q)?">":"=", flip=(sb!==sa&&sb!=="="&&sa!=="=");
      /* flèches de correspondance */
      function ar(a,b,col){ ctx.save(); ctx.strokeStyle=T(col,0.55); ctx.lineWidth=2.2; ctx.setLineDash([6,5]); ctx.beginPath(); ctx.moveTo(a,y1+10); ctx.bezierCurveTo(a,(y1+y2)/2,b,(y1+y2)/2,b,y2-12); ctx.stroke(); ctx.restore(); S.draw.arrow(c,b,y2-24,b,y2-11,col,2.2); }
      ar(X1(Pp),X2(f(Pp)),P.acc); ar(X1(Q),X2(f(Q)),P.red);
      S.draw.dot(c,X1(Pp),y1,8,P.acc); S.draw.dot(c,X1(Q),y1,8,P.red); S.draw.dot(c,X2(f(Pp)),y2,8,P.acc); S.draw.dot(c,X2(f(Q)),y2,8,P.red);
      S.draw.label(c,"p = "+S.fmt(Pp,0),X1(Pp),y1-26,{color:P.acc,size:fs-1}); S.draw.label(c,"q = "+S.fmt(Q,0),X1(Q),y1-26+(Math.abs(X1(Pp)-X1(Q))<56?-22:0),{color:P.red,size:fs-1});
      S.draw.label(c,S.fmt(f(Pp),0),X2(f(Pp)),y2+30,{color:P.acc,size:fs-1}); S.draw.label(c,S.fmt(f(Q),0),X2(f(Q)),y2+30+(Math.abs(X2(f(Pp))-X2(f(Q)))<40?22:0),{color:P.red,size:fs-1});
      S.draw.label(c,"avant : "+S.fmt(Pp,0)+" "+sb+" "+S.fmt(Q,0),c.W*0.27,18,{color:P.ink,size:fs});
      S.draw.label(c,(add?"+ ":"× ")+M3.par(K,0)+"  →  "+S.fmt(f(Pp),0)+" "+sa+" "+S.fmt(f(Q),0),c.W*0.7,(y1+y2)/2,{color:flip?P.red:P.green,size:fs+1,fill:T(flip?P.red:P.green,0.14)});
      ro.set(0,S.fmt(Pp,0)+" "+sb+" "+S.fmt(Q,0)); ro.set(1,S.fmt(f(Pp),0)+" "+sa+" "+S.fmt(f(Q),0));
      if(flip) nt.set("Le sens est inversé : "+sb+" est devenu "+sa+" parce qu'on a multiplié par un négatif. Les flèches se croisent.","warn");
      else if(!add&&K===0) nt.set("Multiplier par 0 écrase tout sur 0 : on ne le fait jamais dans une inéquation.","warn");
      else if(Pp===Q) nt.set("p et q sont égaux : choisis deux nombres différents pour voir l'ordre.","");
      else nt.set("Le sens est conservé : les flèches ne se croisent pas.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c05-tolerance", ch:"c05", tag:"Tolérance", titre:"Pièce usinée : dans la tolérance ?",
  resume:"Une tige doit mesurer 10 mm à ± t près. Mesure-la : conforme ou rebut ?",
  but:"Règle la tolérance t et fais glisser la tige dans le gabarit (ou règle la mesure). Regarde aussi le lot de 8 pièces : combien sont conformes ? Vérifie que « conforme » correspond à 10 − t ≤ x ≤ 10 + t.",
  aRetenir:"Une double inégalité 10 − t ≤ x ≤ 10 + t décrit un intervalle fermé [10 − t ; 10 + t]. Les bornes sont incluses : une pièce exactement à 10,05 mm est conforme si t = 0,05.",
  piege:"« À ±0,05 près » ne signifie pas « entre 0 et 0,05 » : la mesure peut être plus petite ou plus grande que 10.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:.74}), P=S.draw.palette, T=S.draw.tint;
    var t=k.slider("Tolérance t",0.05,0.30,0.05,0.1,"mm"), x=k.slider("Mesure x",9.6,10.4,0.05,10.15,"mm");
    var lot=[9.78,9.91,9.96,10.0,10.03,10.07,10.12,10.24];
    var ro=k.readouts(["Intervalle conforme","Mesure","Lot de 8 pièces"]); var nt=k.note(""); var geo={};
    M3.drag(c,function(){ return geo.X?[{id:"x",x:geo.X(x.value),y:geo.y,r:9999}]:[]; },function(id,p){ x.set(M3.snap(9.6+(p.x-26)/(c.W-52)*0.8,0.05,9.6,10.4)); k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx=c.ctx, Tt=t.value, X=x.value, lo=Math.round((10-Tt)*100)/100, hi=Math.round((10+Tt)*100)/100, ok=X>=lo-1e-9&&X<=hi+1e-9, fs=M3.sz(c,15), col=ok?P.green:P.red;
      function inT(v){ return v>=lo-1e-9&&v<=hi+1e-9; }
      var Xf=function(v){ return 26+(v-9.6)/0.8*(c.W-52); };
      /* gabarit : zones rebut / conforme */
      var gy=c.H*0.17, gh=c.H*0.4;
      ctx.fillStyle=T(P.red,0.08); ctx.fillRect(Xf(9.6),gy,Xf(lo)-Xf(9.6),gh); ctx.fillRect(Xf(hi),gy,Xf(10.4)-Xf(hi),gh);
      ctx.fillStyle=T(P.green,0.15); ctx.fillRect(Xf(lo),gy,Xf(hi)-Xf(lo),gh);
      ctx.save(); ctx.strokeStyle=P.green; ctx.lineWidth=2.4; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(Xf(lo),gy); ctx.lineTo(Xf(lo),gy+gh); ctx.moveTo(Xf(hi),gy); ctx.lineTo(Xf(hi),gy+gh); ctx.stroke(); ctx.restore();
      S.draw.label(c,"conforme",(Xf(lo)+Xf(hi))/2,gy+14,{color:P.green,size:fs-2});
      if(Xf(lo)-Xf(9.6)>70) S.draw.label(c,"trop court",(Xf(9.6)+Xf(lo))/2,gy+14,{color:P.red,size:fs-2});
      if(Xf(10.4)-Xf(hi)>70) S.draw.label(c,"trop long",(Xf(hi)+Xf(10.4))/2,gy+14,{color:P.red,size:fs-2});
      /* la tige : un cylindre gris qui entre dans le gabarit par la gauche */
      var ry=gy+gh*0.6, rh=Math.min(30,gh*0.34), rx0=-10, rx1=Xf(X);
      var g=ctx.createLinearGradient(0,ry-rh/2,0,ry+rh/2); g.addColorStop(0,"#eef2f7"); g.addColorStop(0.45,"#b8c3d1"); g.addColorStop(1,"#7f8da0");
      S.draw.rrect(c,rx0,ry-rh/2,rx1-rx0,rh,rh/3); ctx.fillStyle=g; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle=col; ctx.stroke();
      M3.handle(c,rx1,ry,col,false,9); geo.y=Xf(10)*0+ry;
      S.draw.text(c,ok?"CONFORME":"REBUT",c.W/2,gy-4,{size:fs+6,color:col,base:"alphabetic"});
      /* graduation en mm */
      var yl=c.H*0.7;
      var X0=M3.nline(c,S,{x0:9.6,x1:10.4,y:yl,step:0.1,dec:1,from:lo,to:hi,fo:false,too:false,mark:X,markColor:col,color:P.green,markText:S.fmt(X,2)+" mm",marks:[]}); geo.X=X0;
      /* le lot de 8 pièces */
      var n=0; lot.forEach(function(v){ var o=inT(v); if(o) n++; S.draw.dot(c,X0(v),yl+34,5.5,o?P.green:P.red); });
      S.draw.text(c,"Lot de 8 pièces mesurées : "+n+" conformes, "+(8-n)+" rebuts",c.W/2,c.H-14,{size:fs-2,color:P.grey,weight:700});
      ro.set(0,"["+S.fmt(lo,2)+" ; "+S.fmt(hi,2)+"]"); ro.set(1,S.fmt(X,2)+" mm"); ro.set(2,n+" conformes");
      nt.set(ok?S.fmt(lo,2)+" ≤ "+S.fmt(X,2)+" ≤ "+S.fmt(hi,2)+" : les deux inégalités sont vraies.":(X<lo?S.fmt(X,2)+" < "+S.fmt(lo,2)+" : trop petite.":S.fmt(X,2)+" > "+S.fmt(hi,2)+" : trop grande."),ok?"ok":"warn");
    });
  }
});
