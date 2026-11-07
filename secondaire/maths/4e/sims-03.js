(function(){
var P = SFA.draw.palette;
function term(v,sym,first){ /* v coefficient, sym "x²" ou "x" ou "" */
  if(Math.abs(v)<1e-12) return "";
  var a=Math.abs(v), s = first ? (v<0?"−":"") : (v<0?" − ":" + ");
  var num = (a===1 && sym) ? "" : SFA.fmt(a,3);
  return s+num+sym;
}
function eq(a,b,c){ var s=term(a,"x²",true); s+=term(b,"x",s===""); s+=term(c,"",s===""); return s||"0"; }

SFA.sim({
  id:"m4-c03-abc", ch:"c03", tag:"Classique",
  titre:"La parabole y = ax² + bx + c : à quoi servent a, b, c ?",
  resume:"Trois curseurs, une parabole : ouverture, sommet, axe de symétrie et zéros en direct.",
  but:"Fais varier a, b et c l'un après l'autre. Que change a ? Que change c ? Et b, qui déplace le sommet ?",
  aRetenir:"Le signe de a donne l'ouverture (a > 0 vers le haut, a < 0 vers le bas), c est l'ordonnée à l'origine (la courbe coupe l'axe y en (0 ; c)). Le sommet est en x = −b/(2a) ; l'axe de symétrie est la droite x = −b/(2a).",
  piege:"Le sommet n'est pas le point d'ordonnée c, et son abscisse est −b/(2a), pas −b/a. Si a = 0, ce n'est plus une parabole mais une droite.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var a=k.slider("a",-3,3,0.25,1,"");
    var b=k.slider("b",-6,6,0.5,-2,"");
    var cc=k.slider("c",-6,6,0.5,-3,"");
    var ro=k.readouts(["Équation","Sommet","Axe de symétrie","Zéros (Δ = b² − 4ac)"]);
    var nt=k.note("","");
    var M=window.M4, geo={};
    M.grab(c,function(){ if(!geo.ax||a.value===0) return []; var A=a.value,B=b.value,C=cc.value, xs=-B/(2*A); return [{id:"s",x:geo.ax.X(xs),y:geo.ax.Y(A*xs*xs+B*xs+C),r:24},{id:"c",x:geo.ax.X(0),y:geo.ax.Y(C),r:20}]; },
      function(id,px,py){ var ax=geo.ax; if(id==="c") cc.set(M.clamp(Math.round(ax.iy(py)*2)/2,-6,6)); else b.set(M.clamp(Math.round(-2*a.value*ax.ix(px)*2)/2,-6,6)); k.redraw(); });
    k.draw(function(){
      var A=a.value,B=b.value,C=cc.value;
      c.clear();
      var ax=geo.ax=S.draw.axes(c,{x0:-8,x1:8,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:2});
      var f=function(x){return A*x*x+B*x+C;};
      if(A!==0){
        var xs=-B/(2*A), ys=f(xs);
        S.draw.line(c,ax.X(xs),ax.T,ax.X(xs),ax.B,P.grey,1.5,[5,4]);
        S.draw.fn(c,ax,f,P.acc,3);
        if(Math.abs(xs)<=8&&Math.abs(ys)<=8){ M.handle(c,ax.X(xs),ax.Y(ys),P.red,6.5); M.lab(c,"S ("+S.fmt(xs,2)+" ; "+S.fmt(ys,2)+")",ax.X(xs)+(xs>3?-52:52),ax.Y(ys)+(A>0?20:-20),P.red,{size:11}); }
        var D=B*B-4*A*C;
        if(D>=0){ var r=Math.sqrt(D); [(-B-r)/(2*A),(-B+r)/(2*A)].forEach(function(x){ if(Math.abs(x)<=8){ S.draw.dot(c,ax.X(x),ax.Y(0),5.5,P.green); M.lab(c,S.fmt(x,2),ax.X(x),ax.Y(0)+(A>0?17:-17),P.green,{size:10.5}); } }); }
        M.handle(c,ax.X(0),ax.Y(C),P.amber,5.5); M.lab(c,"c = "+S.fmt(C,1),ax.X(0)+(xs>0?-34:34),ax.Y(C)+(C>ys?-14:14),P.amber,{size:10.5});
        ro.set(1,"("+S.fmt(xs,2)+" ; "+S.fmt(ys,2)+")");
        ro.set(2,"x = "+S.fmt(xs,2));
        ro.set(3, D<0 ? "aucun (Δ = "+S.fmt(D,2)+" < 0)" : (D===0 ? "un seul : x = "+S.fmt(xs,2)+" (Δ = 0)" : S.fmt((-B-Math.sqrt(D))/(2*A),2)+" et "+S.fmt((-B+Math.sqrt(D))/(2*A),2)+" (Δ = "+S.fmt(D,2)+")"));
        nt.set((A>0?"a > 0 : parabole ouverte vers le haut, le sommet est un minimum ("+S.fmt(ys,2)+").":"a < 0 : parabole ouverte vers le bas, le sommet est un maximum ("+S.fmt(ys,2)+").")+(Math.abs(xs)>8||Math.abs(ys)>8?" Le sommet sort du cadre du graphique.":"")+(D>=0&&(Math.abs((-B-Math.sqrt(D))/(2*A))>8||Math.abs((-B+Math.sqrt(D))/(2*A))>8)?" Un zéro est hors du cadre.":""),A>0?"ok":"warn");
      } else {
        S.draw.fn(c,ax,f,P.acc,3);
        ro.set(1,"pas de sommet"); ro.set(2,"aucun"); ro.set(3, B===0 ? (C===0?"tout ℝ":"aucun") : "x = "+S.fmt(-C/B,2));
        nt.set("a = 0 : l'équation devient celle d'une droite. Ce n'est plus une fonction du 2e degré.","warn");
      }
      ro.set(0,"y = "+eq(A,B,C));
    });
  }
});

/* ---------- forme canonique ---------- */
SFA.sim({
  id:"m4-c03-canonique", ch:"c03", tag:"Classique",
  titre:"Forme canonique : place le sommet, lis les coefficients",
  resume:"Place le sommet (h ; k) et l'ouverture a : la forme développée apparaît.",
  but:"Fais varier h, k et a dans y = a(x − h)² + k. Regarde b = −2ah et c = ah² + k de la forme développée y = ax² + bx + c.",
  aRetenir:"a(x − h)² + k = ax² − 2ah·x + (ah² + k). Le sommet est (h ; k). Inversement, h = −b/(2a) et k = f(h).",
  piege:"Dans a(x − h)², l'abscisse du sommet est h, avec le signe changé : (x + 3)² a son sommet en x = −3. Et (x − h)² = x² − 2hx + h², pas x² + h².",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.78});
    var a=k.slider("a",-3,3,0.5,1,"");
    var h=k.slider("h (abscisse du sommet)",-5,5,0.5,2,"");
    var kk=k.slider("k (ordonnée du sommet)",-6,6,0.5,-1,"");
    var ro=k.readouts(["Forme canonique","Forme développée","b = −2ah","c = ah² + k"]);
    var nt=k.note("","");
    var M=window.M4, geo={};
    M.grab(c,function(){ return geo.ax?[{id:"v",x:geo.ax.X(h.value),y:geo.ax.Y(kk.value),r:26}]:[]; },
      function(id,px,py){ h.set(M.clamp(Math.round(geo.ax.ix(px)*2)/2,-5,5)); kk.set(M.clamp(Math.round(geo.ax.iy(py)*2)/2,-6,6)); k.redraw(); });
    k.draw(function(){
      var A=a.value,H=h.value,K=kk.value;
      c.clear();
      var ax=geo.ax=S.draw.axes(c,{x0:-8,x1:8,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:2});
      if(A===0){ ro.set(0,"y = "+S.fmt(K)); ro.set(1,"droite horizontale"); ro.set(2,"—"); ro.set(3,"—"); nt.set("a = 0 : plus de parabole.","warn"); S.draw.fn(c,ax,function(){return K;},P.acc,3); return; }
      var f=function(x){return A*(x-H)*(x-H)+K;};
      S.draw.line(c,ax.X(H),ax.T,ax.X(H),ax.B,P.grey,1.5,[5,4]);
      S.draw.fn(c,ax,f,P.acc,3);
      M.handle(c,ax.X(H),ax.Y(K),P.red,6.5); M.lab(c,"sommet ("+S.fmt(H,1)+" ; "+S.fmt(K,1)+")",ax.X(H)+(H>3?-62:62),ax.Y(K)+(A>0?20:-20),P.red,{size:11});
      var B=-2*A*H, C=A*H*H+K;
      var ca=(A===1?"":(A===-1?"−":S.fmt(A)))+"(x "+(H<0?"+ "+S.fmt(-H):(H>0?"− "+S.fmt(H):""))+")²"; if(H===0) ca=(A===1?"":(A===-1?"−":S.fmt(A)))+"x²";
      ro.set(0,"y = "+ca+(K===0?"":(K<0?" − "+S.fmt(-K):" + "+S.fmt(K))));
      ro.set(1,"y = "+eq(A,B,C)); ro.set(2,S.fmt(B,2)); ro.set(3,S.fmt(C,2));
      nt.set("Vérification : en x = 0, y = "+S.fmt(C,2)+" (c) ; en x = "+S.fmt(H)+", y = "+S.fmt(K)+" (k).","ok");
    });
  }
});

/* ---------- parabole par trois points ---------- */
SFA.sim({
  id:"m4-c03-trois-points", ch:"c03", tag:"Manipuler",
  titre:"Une parabole par trois points",
  resume:"Déplace trois points à la souris ou au doigt : la parabole qui passe par eux se calcule seule. Puis fais-la passer par une cible.",
  but:"Fais glisser A, B, C. Observe que trois points d'abscisses différentes déterminent une unique parabole. Défi : fais passer la courbe par la cible dorée. Essaie aussi d'aligner les points, ou de mettre deux points à la même abscisse.",
  aRetenir:"Trois points d'abscisses distinctes (non alignés) définissent une seule parabole y = ax² + bx + c : on résout un système de trois équations à trois inconnues.",
  piege:"Si les trois points sont alignés, a = 0 : c'est une droite. Si deux points ont la même abscisse, aucune fonction ne passe par eux (une abscisse = une seule image).",
  build:function(k,S){
    var M=window.M4, c=k.canvas(0,{ratio:.8});
    var pts=[{x:-2,y:3},{x:0,y:-1},{x:3,y:2}], ax=null, tgt={x:5,y:-4}, won=0, got=false;
    var ro=k.readouts(["Points","a ; b ; c","Équation","Sommet"]);
    var nt=k.note("","");
    var COL=[P.red,P.green,P.amber], NM=["A","B","C"];
    k.button("Nouvelle cible",function(){ var xs=[-6,-5,-4,-3,3,4,5,6]; tgt={x:xs[Math.floor(Math.random()*xs.length)],y:Math.floor(Math.random()*11)-5}; got=false; },true);
    k.button("Aligner A, B, C",function(){ pts=[{x:-3,y:-2},{x:0,y:1},{x:3,y:4}]; });
    k.button("Remettre",function(){ pts=[{x:-2,y:3},{x:0,y:-1},{x:3,y:2}]; });
    M.grab(c,function(){ return ax?pts.map(function(q,i){ return {id:i,x:ax.X(q.x),y:ax.Y(q.y),r:30}; }):[]; },
      function(i,px,py){ pts[i].x=M.clamp(Math.round(ax.ix(px)*2)/2,-7.5,7.5); pts[i].y=M.clamp(Math.round(ax.iy(py)*2)/2,-7.5,7.5); k.redraw(); });
    k.draw(function(){
      c.clear();
      ax=S.draw.axes(c,{x0:-8,x1:8,y0:-8,y1:8,xl:"x",yl:"y",stepX:2,stepY:2});
      var X=pts.map(function(q){return q.x;}), bad=(X[0]===X[1]||X[0]===X[2]||X[1]===X[2]);
      var A=0,B=0,C=0,f=null,ycol=P.acc;
      if(!bad){
        var x1=pts[0].x,y1=pts[0].y,x2=pts[1].x,y2=pts[1].y,x3=pts[2].x,y3=pts[2].y;
        var d12=(y2-y1)/(x2-x1), d13=(y3-y1)/(x3-x1); A=(d13-d12)/(x3-x2); B=d12-A*(x1+x2); C=y1-d12*x1+A*x1*x2;
        f=function(x){return A*x*x+B*x+C;};
        S.draw.fn(c,ax,f,P.acc,3.4);
      }
      /* cible */
      var hit = f && Math.abs(f(tgt.x)-tgt.y)<0.26;
      if(hit&&!got){ got=true; won++; }
      S.draw.glow(c,ax.X(tgt.x),ax.Y(tgt.y),24,hit?P.green:P.yellow,.7);
      S.draw.dot(c,ax.X(tgt.x),ax.Y(tgt.y),7,hit?P.green:P.yellow); M.lab(c,"cible ("+S.fmt(tgt.x,0)+" ; "+S.fmt(tgt.y,0)+")",ax.X(tgt.x),ax.Y(tgt.y)+(tgt.y>5?22:-22),hit?P.green:P.amber,{size:10.5});
      pts.forEach(function(q,i){ M.handle(c,ax.X(q.x),ax.Y(q.y),COL[i],8); });
      /* étiquettes placées pour ne pas se chevaucher */
      var off=[[0,-22],[0,22],[0,-22]];
      pts.forEach(function(q,i){ var dy=off[i][1]; if(f&&A<0&&i===1) dy=-22; M.lab(c,NM[i]+" ("+S.fmt(q.x,1)+" ; "+S.fmt(q.y,1)+")",ax.X(q.x),ax.Y(q.y)+dy,COL[i],{size:10.5}); });
      ro.set(0,pts.map(function(q,i){return NM[i]+"("+S.fmt(q.x,1)+" ; "+S.fmt(q.y,1)+")";}).join(" "));
      if(bad){ ro.set(1,"—"); ro.set(2,"impossible"); ro.set(3,"—"); nt.set("Deux points ont la même abscisse : aucune fonction ne passe par les trois.","warn"); return; }
      ro.set(1,S.fmt(A,3)+" ; "+S.fmt(B,3)+" ; "+S.fmt(C,3)); ro.set(2,"y = "+eq(A,B,C));
      if(Math.abs(A)<1e-9){ ro.set(3,"aucun"); nt.set("Les trois points sont alignés : a = 0, la « parabole » est une droite.","warn"); }
      else { var xs=-B/(2*A); ro.set(3,"("+S.fmt(xs,2)+" ; "+S.fmt(f(xs),2)+")");
        nt.set(hit?"Cible atteinte ! ("+won+" réussie"+(won>1?"s":"")+") Clique « Nouvelle cible ».":"Une seule parabole passe par A, B, C ; a "+(A>0?"> 0 (vers le haut).":"< 0 (vers le bas).")+" Déplace les points pour qu'elle passe par la cible.",hit?"ok":""); }
    });
  }
});

/* ---------- optimisation de clôture ---------- */
SFA.sim({
  id:"m4-c03-cloture", ch:"c03", tag:"Optimisation",
  titre:"Enclos d'aire maximale",
  resume:"Une longueur de grillage fixée, un mur : quel rectangle a la plus grande aire ?",
  but:"Un enclos rectangulaire s'appuie sur un mur (3 côtés à clôturer). Choisis la largeur x : la longueur est F − 2x. Trouve la largeur qui donne l'aire maximale.",
  aRetenir:"L'aire A(x) = x(F − 2x) = −2x² + Fx est une fonction du 2e degré avec a < 0 : elle a un maximum au sommet, en x = F/4, qui vaut F²/8.",
  piege:"Le rectangle d'aire maximale n'est pas un carré : contre un mur, la longueur vaut le double de la largeur. Et le maximum est un sommet de parabole, pas un zéro de la fonction.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1.05});
    var F=k.slider("Grillage disponible F",40,120,10,80,"m");
    var x=k.slider("Largeur x",0,60,0.5,10,"m");
    var ro=k.readouts(["Longueur F − 2x","Aire A(x)","Aire maximale","Largeur optimale"]);
    var nt=k.note("","");
    var M=window.M4, geo={};
    M.grab(c,function(){ if(!geo.ax) return []; var Fv=F.value, X=Math.min(x.value,Fv/2); return [{id:"p",x:geo.ax.X(X),y:geo.ax.Y(X*(Fv-2*X)),r:30}]; },
      function(id,px){ x.set(M.clamp(Math.round(geo.ax.ix(px)*2)/2,0,Math.min(60,F.value/2))); k.redraw(); });
    k.draw(function(){
      var Fv=F.value, X=Math.min(x.value,Fv/2), L=Fv-2*X, A=X*L, Amax=Fv*Fv/8, xo=Fv/4;
      c.clear();
      var W=c.W,H=c.H, ctx=c.ctx, top=H*.42;
      /* enclos */
      var sc=Math.min((W-40)/ (Fv), (top-40)/(Fv/2)), rw=L*sc, rh=X*sc, ox=(W-rw)/2, oy=22;
      ctx.fillStyle="rgba(46,107,85,.2)"; ctx.fillRect(ox,oy,rw,rh);
      ctx.strokeStyle=P.green; ctx.lineWidth=3; ctx.strokeRect(ox,oy,rw,rh);
      S.draw.line(c,ox-8,oy,ox+rw+8,oy,P.ink,5);
      S.draw.text(c,"mur",ox+rw+22 > W-20 ? W-18 : ox+rw+22,oy,{size:12,color:P.grey});
      S.draw.text(c,"L = "+S.fmt(L,1)+" m",ox+rw/2,oy+rh+14,{size:13,color:P.green});
      S.draw.text(c,"x = "+S.fmt(X,1),ox-4,oy+rh/2,{size:12,color:P.green,align:"right"});
      /* graphe A(x) */
      var sub={W:W,H:H,ctx:ctx}; 
      var ax=geo.ax=S.draw.axes(c,{x0:0,x1:Fv/2,y0:0,y1:Amax*1.1,xl:"x (m)",yl:"A (m²)",l:52,t:top+10,b:30,stepX:Fv/8});
      S.draw.fn(c,ax,function(t){return t*(Fv-2*t);},P.acc,3);
      S.draw.dot(c,ax.X(xo),ax.Y(Amax),6,P.red); M.lab(c,"maximum "+S.fmt(Amax,0)+" m²",ax.X(xo)+(xo>Fv/4*0.9?0:0),ax.Y(Amax)-18,P.red,{size:11});
      S.draw.line(c,ax.X(X),ax.Y(0),ax.X(X),ax.Y(A),P.amber,1.5,[4,3]);
      M.handle(c,ax.X(X),ax.Y(A),P.amber,7);
      ro.set(0,S.fmt(L,1)+" m"); ro.set(1,S.fmt(A,1)+" m²"); ro.set(2,S.fmt(Amax,1)+" m²"); ro.set(3,S.fmt(xo,1)+" m");
      if(x.value>Fv/2) nt.set("Avec ce grillage, la largeur ne peut pas dépasser F/2 = "+S.fmt(Fv/2,1)+" m : on limite x.","warn");
      else if(Math.abs(X-xo)<1e-9) nt.set("Maximum atteint ! Largeur "+S.fmt(xo,1)+" m, longueur "+S.fmt(L,1)+" m (le double), aire "+S.fmt(Amax,1)+" m².","ok");
      else nt.set("Rapproche-toi du sommet de la parabole A(x) pour agrandir l'aire.","");
    });
  }
});

/* ---------- trajectoire ---------- */
SFA.sim({
  id:"m4-c03-trajectoire", ch:"c03", tag:"Niche",
  titre:"La trajectoire d'un ballon est une parabole",
  resume:"Règle la vitesse et l'angle de lancer : portée, hauteur maximale et angle complémentaire.",
  but:"Lance un ballon depuis le sol. Change la vitesse v et l'angle θ. Active l'angle complémentaire (90° − θ) : que remarques-tu sur la portée ? Quel angle donne la portée maximale ?",
  aRetenir:"Sans frottement, y = x·tan θ − g·x² / (2v²·cos²θ) : c'est une fonction du 2e degré en x avec a < 0. Portée = v²·sin(2θ)/g, hauteur maximale = v²·sin²θ/(2g) au milieu de la portée. θ et 90° − θ donnent la même portée ; le maximum est à 45°.",
  piege:"Modèle simplifié : lancer depuis le sol, g = 9,81 m/s², sans résistance de l'air (en vrai, la portée est plus courte et la courbe n'est plus une parabole exacte).",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.58});
    var v=k.slider("Vitesse initiale v",5,25,1,20,"m/s");
    var th=k.slider("Angle de lancer θ",10,80,1,45,"°");
    var tg=k.toggle("Montrer aussi l'angle complémentaire (90° − θ)",true);
    var ro=k.readouts(["Équation y(x)","Portée","Hauteur maximale","Durée du vol"]);
    var g=9.81, tt=0, M=window.M4, geo={};
    var lp=k.loop(function(dt){ tt+=dt; k.redraw(); });
    M.grab(c,function(){ if(!geo.ax) return []; var r=th.value*Math.PI/180; return [{id:"v",x:geo.ax.X(v.value*Math.cos(r)*1.1),y:geo.ax.Y(v.value*Math.sin(r)*1.1),r:28}]; },
      function(id,px,py){ var x=geo.ax.ix(px)/1.1, y=geo.ax.iy(py)/1.1; th.set(M.clamp(Math.round(Math.atan2(y,x)*180/Math.PI),10,80)); v.set(M.clamp(Math.round(Math.hypot(x,y)),5,25)); tt=0; if(!lp.running) lp.play(); k.redraw(); });
    k.button("Lancer / pause",function(){ if(lp.running) lp.pause(); else { tt=0; lp.play(); } },true); lp.play();
    function traj(V,T){ var r=T*Math.PI/180; return function(x){ return x*Math.tan(r)-g*x*x/(2*V*V*Math.cos(r)*Math.cos(r)); }; }
    k.draw(function(){
      var V=v.value, T=th.value, r=T*Math.PI/180;
      var R=V*V*Math.sin(2*r)/g, Hm=V*V*Math.sin(r)*Math.sin(r)/(2*g), Tf=2*V*Math.sin(r)/g;
      c.clear();
      var ax=geo.ax=S.draw.axes(c,{x0:0,x1:70,y0:0,y1:35,xl:"x (m)",yl:"y (m)",stepX:10,stepY:10});
      c.ctx.save(); c.ctx.fillStyle="rgba(36,119,90,.14)"; c.ctx.fillRect(ax.L,ax.Y(0),ax.R-ax.L,5); c.ctx.restore();
      if(tg.value && T!==45){ S.draw.fn(c,ax,function(x){var y=traj(V,90-T)(x); return y<0?NaN:y;},P.amber,2.2,[6,4]); }
      S.draw.fn(c,ax,function(x){var y=traj(V,T)(x); return y<0?NaN:y;},P.acc,3);
      S.draw.dot(c,ax.X(R/2),ax.Y(Hm),5,P.red); M.lab(c,"sommet "+S.fmt(Hm,1)+" m",ax.X(R/2),ax.Y(Hm)-17,P.red,{size:11});
      S.draw.dot(c,ax.X(R),ax.Y(0),5,P.green); M.lab(c,"portée "+S.fmt(R,1)+" m",ax.X(R),ax.Y(0)-17,P.green,{size:11});
      S.draw.arrow(c,ax.X(0),ax.Y(0),ax.X(V*Math.cos(r)*1.1),ax.Y(V*Math.sin(r)*1.1),P.red,2.4); M.handle(c,ax.X(V*Math.cos(r)*1.1),ax.Y(V*Math.sin(r)*1.1),P.red,6.5); M.lab(c,"v = "+S.fmt(V,0)+" m/s ; "+S.fmt(T,0)+"°",ax.R-62,ax.T+14,P.red,{size:11});
      if(lp.running||tt>0){ var tp=tt%(Tf+0.6); if(tp<=Tf){ var bx=V*Math.cos(r)*tp, by=V*Math.sin(r)*tp-g*tp*tp/2; S.draw.dot(c,ax.X(bx),ax.Y(Math.max(0,by)),8,P.red); } }
      var a=-g/(2*V*V*Math.cos(r)*Math.cos(r)), b=Math.tan(r);
      ro.set(0,"y = "+S.fmt(a,4)+"x² + "+S.fmt(b,3)+"x");
      ro.set(1,S.fmt(R,1)+" m"); ro.set(2,S.fmt(Hm,1)+" m"); ro.set(3,S.fmt(Tf,2)+" s");
    });
  }
});
})();
