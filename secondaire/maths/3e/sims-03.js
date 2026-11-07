/* Chapitre 3 : fonctions du premier degré */
window.M3 = window.M3 || {};
M3.lin = function(a,b,S){
  var f=function(v){return S.fmt(v,2);}, s="y = ";
  if(a===0) return s+f(b);
  s+= (a===1?"":a===-1?"−":f(a))+"x";
  if(b>0) s+=" + "+f(b); else if(b<0) s+=" − "+f(-b);
  return s;
};
SFA.sim({
  id:"m3-c03-ab", ch:"c03", tag:"Droite", titre:"Pente a et ordonnée à l'origine b",
  resume:"Deux curseurs : a fait pivoter la droite, b la fait glisser.",
  but:"Fais glisser le point rouge (b) et le point orange (a), ou utilise les curseurs. Regarde la droite, son équation, son zéro et le petit triangle « un pas à droite, a en hauteur ».",
  aRetenir:"f(x) = ax + b : a est la pente (de combien y varie quand x augmente de 1), b est l'ordonnée du point où la droite coupe l'axe y. Si a > 0 la droite monte, si a < 0 elle descend.",
  piege:"b n'est pas l'endroit où la droite coupe l'axe des x. Cet endroit, le zéro, vaut −b/a.",
  build:function(k,S){
    var c=k.canvas(360), P=S.draw.palette;
    var a=k.slider("a (pente)",-4,4,0.5,1,""), b=k.slider("b (ordonnée à l'origine)",-5,5,0.5,2,"");
    var ro=k.readouts(["Équation","Zéro (y = 0)","La droite…"]);
    var M3=window.M3, geo={};
    M3.drag(c,function(){ return geo.ax?[{id:"a",x:geo.ax.X(1),y:geo.ax.Y(a.value+b.value),r:26},{id:"b",x:geo.ax.X(0),y:geo.ax.Y(b.value),r:26}]:[]; },function(id,p){
      if(id==="b") b.set(M3.snap(geo.ax.iy(p.y),0.5,-5,5)); else a.set(M3.snap(geo.ax.iy(p.y)-b.value,0.5,-4,4)); k.redraw(); });
    k.draw(function(){
      c.clear(); var A=a.value,B=b.value;
      var ax=S.draw.axes(c,{x0:-6,x1:6,y0:-8,y1:8,xl:"x",yl:"y",stepX:1,stepY:2});
      geo.ax=ax; S.draw.fn(c,ax,function(x){return A*x+B;},P.acc,3);
      S.draw.line(c,ax.X(0),ax.Y(B),ax.X(1),ax.Y(B),P.amber,2,[4,3]); S.draw.line(c,ax.X(1),ax.Y(B),ax.X(1),ax.Y(A+B),P.amber,2,[4,3]);
      S.draw.text(c,"1",ax.X(0.5),ax.Y(B)+(A>=0?12:-12),{size:12,color:P.amber}); S.draw.text(c,S.fmt(A,1),ax.X(1)+14,ax.Y(B+A/2),{size:12,color:P.amber});
      var z=A!==0?-B/A:null;
      if(z!==null&&Math.abs(z)<=6){ S.draw.dot(c,ax.X(z),ax.Y(0),6,P.green); S.draw.label(c,"zéro : x = "+S.fmt(z,2),ax.X(z),ax.Y(0)+(A>0?26:-26),{color:P.green,size:12}); }
      M3.handle(c,ax.X(0),ax.Y(B),P.red,false,8); M3.handle(c,ax.X(1),ax.Y(A+B),P.amber,false,8);
      S.draw.label(c,"b = "+S.fmt(B,1),ax.X(0)+(c.W<420?34:40),ax.Y(B)+(A>=0?-22:22),{color:P.red,size:12});
      ro.set(0,M3.lin(A,B,S)); ro.set(1,A===0?(B===0?"tous les x":"aucun"):"x = "+S.fmt(z,2));
      ro.set(2,A>0?"monte (croissante)":A<0?"descend (décroissante)":"est horizontale");
    });
  }
});
SFA.sim({
  id:"m3-c03-pente", ch:"c03", tag:"Taux de variation", titre:"Le triangle de pente ne change pas de rapport",
  resume:"Prends deux points sur une droite : Δy ÷ Δx vaut toujours a.",
  but:"Fais glisser les deux points sur la droite (ou utilise les curseurs). Le triangle grandit, mais le rapport Δy ÷ Δx reste le même.",
  aRetenir:"Sur une droite, a = Δy ÷ Δx = (y₂ − y₁) ÷ (x₂ − x₁), quels que soient les deux points choisis.",
  piege:"On divise la variation de y par la variation de x, pas l'inverse : Δx ÷ Δy est une erreur très fréquente.",
  build:function(k,S){
    var c=k.canvas(340), P=S.draw.palette;
    var a=k.slider("a (pente)",-2,2,0.5,1.5,""), b=k.slider("b",-3,3,0.5,-1,"");
    var x1=k.slider("Point 1 : x₁",-2,2,0.5,-2,""), dx=k.slider("Largeur Δx",-4,4,0.5,3,"");
    var ro=k.readouts(["Δx","Δy","Δy ÷ Δx","Piège Δx ÷ Δy"]);
    var nt=k.note("");
    var M3=window.M3, geo={};
    M3.drag(c,function(){ return geo.h||[]; },function(id,p){ var X1=x1.value; if(id==="p1") x1.set(M3.snap(geo.ax.ix(p.x),0.5,-2,2)); else dx.set(M3.snap(geo.ax.ix(p.x)-X1,0.5,-4,4)); k.redraw(); });
    k.draw(function(){
      c.clear(); var A=a.value,B=b.value,X1=x1.value,DX=dx.value,X2=X1+DX,f=function(x){return A*x+B;};
      var ax=S.draw.axes(c,{x0:-6,x1:6,y0:-16,y1:16,xl:"x",yl:"y",stepX:1,stepY:4});
      S.draw.fn(c,ax,f,P.acc,3);
      var Y1=f(X1),Y2=f(X2);
      S.draw.line(c,ax.X(X1),ax.Y(Y1),ax.X(X2),ax.Y(Y1),P.amber,2.5); S.draw.line(c,ax.X(X2),ax.Y(Y1),ax.X(X2),ax.Y(Y2),P.green,2.5);
      S.draw.text(c,"Δx = "+S.fmt(DX,1),ax.X((X1+X2)/2),ax.Y(Y1)+(A*DX>=0?14:-14),{size:12,color:P.amber,bg:"rgba(255,255,255,.85)"});
      geo.ax=ax; geo.h=[{id:"p1",x:ax.X(X1),y:ax.Y(Y1),r:24},{id:"p2",x:ax.X(X2),y:ax.Y(Y2),r:24}];
      M3.handle(c,ax.X(X1),ax.Y(Y1),P.red,false,8); M3.handle(c,ax.X(X2),ax.Y(Y2),P.green,false,8);
      var DY=Y2-Y1;
      S.draw.text(c,"Δy = "+S.fmt(DY,2),ax.X(X2)+(DX>=0?12:-12),ax.Y((Y1+Y2)/2),{size:12,color:P.green,align:DX>=0?"left":"right",bg:"rgba(255,255,255,.85)"});
      ro.set(0,S.fmt(DX,1)); ro.set(1,S.fmt(DY,2)); ro.set(2,DX===0?"—":S.fmt(DY/DX,2)); ro.set(3,DY===0?"impossible":S.fmt(DX/DY,2));
      if(DX===0) nt.set("Δx = 0 : les deux points sont sur la même verticale, on ne peut pas diviser par 0.","warn");
      else nt.set("Le rapport Δy ÷ Δx vaut "+S.fmt(DY/DX,2)+" = a, quelle que soit la taille du triangle.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c03-deuxpoints", ch:"c03", tag:"À la souris", titre:"Deux points, une droite : trouve l'équation",
  resume:"Déplace A et B sur la grille et vois la pente puis b se calculer.",
  but:"Glisse les points A et B (ils se calent sur les nœuds de la grille). Lis les deux étapes du calcul.",
  aRetenir:"Étape 1 : a = (y_B − y_A) ÷ (x_B − x_A). Étape 2 : on remplace dans y_A = a·x_A + b pour trouver b. Contrôle : B doit vérifier l'équation.",
  piege:"Si x_A = x_B, la droite est verticale : ce n'est le graphique d'aucune fonction (pas de pente).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.95}), P=S.draw.palette;
    var A={x:-2,y:-1}, B={x:2,y:3}, sel=null, ax;
    function gcd(p,q){p=Math.abs(p);q=Math.abs(q);while(q){var t=p%q;p=q;q=t;}return p;}
    function frac(n,d){ if(d<0){n=-n;d=-d;} var g=gcd(n,d)||1; n/=g;d/=g; return d===1?S.fmt(n,0):S.fmt(n,0)+"/"+d; }
    function eqf(n,d,bn){ /* équation exacte avec fractions : y = (n/d)x + bn/d */
      if(d<0){n=-n;d=-d;bn=-bn;} var g=gcd(n,d)||1, an=n/g, ad=d/g, g2=gcd(bn,d)||1, bb=bn===0?null:frac(bn,d), s="y = ";
      if(an===0) return s+(bb===null?"0":bb);
      var at=ad===1?(an===1?"":an===-1?"−":S.fmt(an,0)):S.fmt(an,0)+"/"+ad; s+=at+"x";
      if(bn>0) s+=" + "+bb; else if(bn<0) s+=" − "+frac(-bn,d); return s; }
    k.button("Exemple 1",function(){A.x=-2;A.y=-1;B.x=2;B.y=3;});
    k.button("Exemple 2",function(){A.x=-3;A.y=4;B.x=3;B.y=-2;});
    k.button("Pente non entière",function(){A.x=-4;A.y=-2;B.x=2;B.y=1;});
    k.button("Verticale (piège)",function(){A.x=2;A.y=-3;B.x=2;B.y=4;});
    var ro=k.readouts(["Pente a","Ordonnée b","Équation"]);
    var nt=k.note("Glisse A ou B.");
    c.pointer(function(t,p){
      if(!ax) return;
      if(t==="down"){ var dA=Math.hypot(p.x-ax.X(A.x),p.y-ax.Y(A.y)), dB=Math.hypot(p.x-ax.X(B.x),p.y-ax.Y(B.y)); sel=Math.min(dA,dB)<30?(dA<=dB?A:B):null; }
      if((t==="down"||t==="drag")&&sel){ sel.x=Math.max(-6,Math.min(6,Math.round(ax.ix(p.x)))); sel.y=Math.max(-6,Math.min(6,Math.round(ax.iy(p.y)))); k.redraw(); }
      if(t==="up") sel=null;
    });
    k.draw(function(){
      c.clear(); ax=S.draw.axes(c,{x0:-7,x1:7,y0:-7,y1:7,xl:"x",yl:"y",stepX:1,stepY:1});
      var vert=A.x===B.x;
      if(vert){ S.draw.line(c,ax.X(A.x),ax.T,ax.X(A.x),ax.B,P.red,3); }
      else{ var a=(B.y-A.y)/(B.x-A.x), b=A.y-a*A.x; S.draw.fn(c,ax,function(x){return a*x+b;},P.acc,3);
        ro.set(0,frac(B.y-A.y,B.x-A.x)); ro.set(1,frac(A.y*(B.x-A.x)-(B.y-A.y)*A.x,B.x-A.x)); ro.set(2,eqf(B.y-A.y,B.x-A.x,A.y*(B.x-A.x)-(B.y-A.y)*A.x));
        nt.set("a = ("+S.fmt(B.y,0)+" − "+(A.y<0?"("+S.fmt(A.y,0)+")":S.fmt(A.y,0))+") ÷ ("+S.fmt(B.x,0)+" − "+(A.x<0?"("+S.fmt(A.x,0)+")":S.fmt(A.x,0))+") = "+frac(B.y-A.y,B.x-A.x)+". Puis b = "+S.fmt(A.y,0)+" − a × "+(A.x<0?"("+S.fmt(A.x,0)+")":S.fmt(A.x,0))+" = "+frac(A.y*(B.x-A.x)-(B.y-A.y)*A.x,B.x-A.x)+".","ok"); }
      if(vert){ ro.set(0,"indéfinie"); ro.set(1,"—"); ro.set(2,"x = "+S.fmt(A.x,0)); nt.set("A et B ont le même x : droite verticale, pas de fonction du premier degré. Déplace un point.","warn"); }
      S.draw.dot(c,ax.X(A.x),ax.Y(A.y),8,P.red); S.draw.dot(c,ax.X(B.x),ax.Y(B.y),8,P.green);
      S.draw.text(c,"A ("+S.fmt(A.x,0)+" ; "+S.fmt(A.y,0)+")",ax.X(A.x),ax.Y(A.y)-16,{size:12,color:P.red,bg:"rgba(255,255,255,.85)"});
      S.draw.text(c,"B ("+S.fmt(B.x,0)+" ; "+S.fmt(B.y,0)+")",ax.X(B.x),ax.Y(B.y)-16,{size:12,color:P.green,bg:"rgba(255,255,255,.85)"});
    });
  }
});
SFA.sim({
  id:"m3-c03-tarifs", ch:"c03", tag:"Comparer deux tarifs", titre:"Abonnement ou paiement à l'acte ?",
  resume:"Deux droites de coût : à partir de combien de trajets l'abonnement devient-il avantageux ?",
  but:"Règle les prix. Trouve le nombre de trajets à partir duquel l'abonnement coûte moins cher.",
  aRetenir:"Chaque tarif est une fonction affine du nombre de trajets n. Le seuil est l'abscisse du point d'intersection : n = F ÷ (p − q).",
  piege:"Au seuil exact, les deux coûts sont égaux. Il faut une valeur entière de n : au-dessus du seuil, l'abonnement gagne ; en dessous, le paiement à l'acte gagne.",
  build:function(k,S){
    var c=k.canvas(340), P=S.draw.palette;
    var p=k.slider("Prix à l'acte p",2,6,0.5,3,"€"), F=k.slider("Abonnement fixe F",10,60,5,30,"€"), q=k.slider("Prix avec abonnement q",0,5,0.5,1.5,"€"), n=k.slider("Nombre de trajets n",0,40,1,12,"");
    var ro=k.readouts(["Coût à l'acte","Coût abonnement","Seuil n*"]);
    var nt=k.note("");
    var M3=window.M3, geo={};
    M3.drag(c,function(){ return geo.ax?[{id:"n",x:geo.ax.X(n.value),y:geo.ax.Y(p.value*n.value),r:9999}]:[]; },function(id,pt){ n.set(M3.snap(geo.ax.ix(pt.x),1,0,40)); k.redraw(); });
    k.draw(function(){
      c.clear(); var pp=p.value,FF=F.value,qq=q.value,N=n.value;
      var ymax=Math.ceil(Math.max(pp*40,FF+qq*40)/20)*20;
      var ax=S.draw.axes(c,{x0:0,x1:40,y0:0,y1:ymax,xl:"trajets n",yl:"coût (€)",stepX:5,stepY:ymax/5});
      S.draw.fn(c,ax,function(x){return pp*x;},P.red,2.8); S.draw.fn(c,ax,function(x){return FF+qq*x;},P.acc,2.8);
      var ca=pp*N, cb=FF+qq*N;
      geo.ax=ax; S.draw.line(c,ax.X(N),ax.B,ax.X(N),ax.T,"rgba(15,27,45,.25)",1.5,[4,4]);
      S.draw.dot(c,ax.X(N),ax.Y(cb),5.5,P.acc); M3.handle(c,ax.X(N),ax.Y(ca),P.red,false,8);
      var star=pp>qq?FF/(pp-qq):null;
      if(star!==null&&star<=40){ S.draw.dot(c,ax.X(star),ax.Y(pp*star),7,P.green); S.draw.line(c,ax.X(star),ax.Y(pp*star),ax.X(star),ax.Y(0),P.green,1.5,[4,3]); }
      S.draw.text(c,"à l'acte",ax.X(36),ax.Y(pp*36)-14,{size:12,color:P.red}); S.draw.text(c,"abonnement",ax.X(34),ax.Y(FF+qq*34)+16,{size:12,color:P.acc});
      ro.set(0,S.fmt(ca,2)+" €"); ro.set(1,S.fmt(cb,2)+" €"); ro.set(2,star===null?"aucun":S.fmt(star,2));
      if(star===null) nt.set("Avec p ≤ q, l'abonnement n'est jamais avantageux : sa droite part plus haut et ne descend jamais sous l'autre.","warn");
      else if(star>40) nt.set("Le seuil est à "+S.fmt(star,1)+" trajets, au-delà de l'échelle : l'abonnement ne devient avantageux qu'après.","warn");
      else if(Math.abs(ca-cb)<1e-9) nt.set("Égalité exacte pour "+S.fmt(N,0)+" trajets : même prix.","ok");
      else nt.set(ca>cb?"Pour "+S.fmt(N,0)+" trajets, l'abonnement est moins cher de "+S.fmt(ca-cb,2)+" €.":"Pour "+S.fmt(N,0)+" trajets, le paiement à l'acte est moins cher de "+S.fmt(cb-ca,2)+" €.","ok");
    });
  }
});
