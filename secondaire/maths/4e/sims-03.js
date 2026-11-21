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

/* ---------- trajectoire : un coup franc dans un stade ---------- */
/* dessins du stade (aplats + légers dégradés) */
var TJ = (function(){
  var T = {}, seed = 7;
  function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  var COLS = ["#c0321d","#1f4b9e","#f4c542","#ffffff","#24775a","#e07a1f","#6236c4","#13233a","#c43a7a","#2f7fd1"];
  T.crowd = []; for (var i = 0; i < 230; i++) T.crowd.push({u:rnd(), v:rnd(), c:COLS[Math.floor(rnd() * COLS.length)], s:0.8 + rnd() * 0.4, p:rnd() * 6.28});
  T.clouds = [[0.12, 0.12, 1.1], [0.47, 0.07, 0.8], [0.78, 0.16, 1.0]];
  function lin(ctx, x0, y0, x1, y1, st){ var g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(s){ g.addColorStop(s[0], s[1]); }); return g; }
  T.lin = lin;
  T.cloud = function(ctx, x, y, s){
    ctx.save(); ctx.fillStyle = "rgba(255,255,255,.88)";
    [[0, 0, 14], [15, -7, 17], [33, 0, 13], [17, 5, 14]].forEach(function(p){ ctx.beginPath(); ctx.arc(x + p[0] * s, y + p[1] * s, p[2] * s, 0, 6.2832); ctx.fill(); });
    ctx.restore();
  };
  /* tribunes, toit, projecteurs et panneaux publicitaires (repère écran) */
  T.stadium = function(c, yG, tt, cheer){
    var ctx = c.ctx, W = c.W, top = yG - Math.max(62, c.H * 0.2), bot = yG - 14;
    ctx.save();
    /* projecteurs */
    [[W * 0.06, -1], [W * 0.94, 1]].forEach(function(q){
      var x = q[0], y0 = top - Math.max(40, c.H * 0.16);
      ctx.fillStyle = "#7b8694"; ctx.fillRect(x - 2.5, y0, 5, top - y0 + 4);
      ctx.fillStyle = "#3c4756"; SFA.draw.rrect(c, x - 17, y0 - 13, 34, 16, 3); ctx.fill();
      ctx.fillStyle = "#fff6cf"; for (var i = 0; i < 4; i++){ ctx.beginPath(); ctx.arc(x - 11 + i * 7.3, y0 - 5, 2.6, 0, 6.2832); ctx.fill(); }
      SFA.draw.glow(c, x, y0 - 5, 34, "#fff3b0", 0.45);
    });
    /* toit */
    ctx.fillStyle = lin(ctx, 0, top - 16, 0, top, [[0, "#4b5768"], [1, "#2c3a4e"]]);
    ctx.beginPath(); ctx.moveTo(0, top - 4); ctx.lineTo(W, top - 4); ctx.lineTo(W, top + 2); ctx.lineTo(0, top + 2); ctx.closePath(); ctx.fill();
    ctx.fillRect(0, top - 12, W, 9);
    /* gradins */
    ctx.fillStyle = lin(ctx, 0, top, 0, bot, [[0, "#8c9bb0"], [1, "#b7c3d3"]]); ctx.fillRect(0, top + 2, W, bot - top - 2);
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.beginPath();
    for (var r = 1; r < 6; r++){ var yy = top + 2 + (bot - top - 2) * r / 6; ctx.moveTo(0, yy); ctx.lineTo(W, yy); } ctx.stroke();
    /* spectateurs (petites silhouettes) */
    var hH = bot - top - 10;
    T.crowd.forEach(function(p){
      var x = p.u * W, y = top + 10 + p.v * hH, s = p.s * Math.max(1, c.H / 420);
      var j = cheer ? Math.max(0, Math.sin(tt * 9 + p.p)) * 3 * s : Math.sin(tt * 1.3 + p.p) * 0.5;
      ctx.fillStyle = p.c; ctx.globalAlpha = 0.85; SFA.draw.rrect(c, x - 3 * s, y - j, 6 * s, 7 * s, 2.4 * s); ctx.fill();
      ctx.fillStyle = "#e7c09a"; ctx.beginPath(); ctx.arc(x, y - j - 2.6 * s, 2.4 * s, 0, 6.2832); ctx.fill();
      if (cheer){ ctx.strokeStyle = p.c; ctx.lineWidth = 1.4 * s; ctx.beginPath(); ctx.moveTo(x - 2.6 * s, y - j); ctx.lineTo(x - 4 * s, y - j - 6 * s); ctx.moveTo(x + 2.6 * s, y - j); ctx.lineTo(x + 4 * s, y - j - 6 * s); ctx.stroke(); }
    });
    ctx.globalAlpha = 1;
    /* brume légère : la scène reste lisible derrière la trajectoire */
    ctx.fillStyle = "rgba(225,238,250,.42)"; ctx.fillRect(0, top - 12, W, bot - top + 12);
    /* panneaux publicitaires */
    var n = Math.ceil(W / 120);
    for (var b = 0; b < n; b++){
      var bx = b * 120;
      ctx.fillStyle = b % 2 ? "#1f4b9e" : "#13233a"; ctx.fillRect(bx, bot, 120, 14);
      ctx.fillStyle = b % 2 ? "#f4c542" : "#ffffff"; ctx.font = "800 9.5px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(b % 2 ? "SFA · MATHS" : "y = ax² + bx + c", bx + 60, bot + 7.5);
    }
    ctx.restore();
  };
  /* pelouse tondue en bandes de 5 m (repère du monde) */
  T.pitch = function(c, yG, X, x0, x1){
    var ctx = c.ctx; ctx.save();
    ctx.fillStyle = "#5e9f4c"; ctx.fillRect(0, yG, c.W, c.H - yG);
    for (var m = Math.floor(x0 / 5) * 5; m < x1; m += 5){ if (Math.round(m / 5) % 2 === 0) continue; ctx.fillStyle = "#68ab55"; ctx.fillRect(X(m), yG, X(m + 5) - X(m), c.H - yG); }
    ctx.fillStyle = lin(ctx, 0, yG, 0, c.H, [[0, "rgba(255,255,255,.10)"], [1, "rgba(15,27,45,.20)"]]); ctx.fillRect(0, yG, c.W, c.H - yG);
    ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillRect(0, yG, c.W, 2);
    ctx.restore();
  };
  /* ballon de football : sphère blanche, pièces noires qui tournent */
  T.ball = function(c, x, y, r, rot, alpha, tint){
    var ctx = c.ctx; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
    var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.05);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.55, tint || "#f4f6f8"); g.addColorStop(1, "#9aa7b5");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = "#1b2433";
    function pent(px, py, s, a){ ctx.beginPath(); for (var i = 0; i < 5; i++){ var q = a + i * 1.2566; i ? ctx.lineTo(px + Math.cos(q) * s, py + Math.sin(q) * s) : ctx.moveTo(px + Math.cos(q) * s, py + Math.sin(q) * s); } ctx.closePath(); ctx.fill(); }
    pent(x + Math.cos(rot) * r * 0.15, y + Math.sin(rot) * r * 0.15, r * 0.34, rot);
    for (var i = 0; i < 5; i++){ var a = rot + 0.63 + i * 1.2566; pent(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, r * 0.3, a); }
    ctx.restore();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(15,27,45,.45)"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke();
    ctx.restore();
  };
  /* footballeur : (x, y) = pieds, h = taille en px ; o = {shirt, shorts, num, dir, kick (−1 → 1), run (phase), arms (0 → 1 bras levés)} */
  T.player = function(c, x, y, h, o){
    var ctx = c.ctx, u = h / 100, dir = o.dir || 1; ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(15,27,45,.22)"; ctx.beginPath(); ctx.ellipse(0, 0, 20 * u, 4.5 * u, 0, 0, 6.2832); ctx.fill();
    var hipY = -47 * u, Ls = 23.5 * u;
    function leg(a, bend, back){
      var kx = Math.sin(a) * Ls, ky = hipY + Math.cos(a) * Ls, fx = kx + Math.sin(a - bend) * Ls, fy = ky + Math.cos(a - bend) * Ls;
      ctx.strokeStyle = back ? "#d8b18c" : "#efc8a0"; ctx.lineWidth = 9 * u;
      ctx.beginPath(); ctx.moveTo(0, hipY); ctx.lineTo(kx, ky); ctx.stroke();
      ctx.strokeStyle = back ? S2(o.socks, 0.82) : o.socks; ctx.lineWidth = 8.5 * u;
      ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.save(); ctx.translate(fx, fy); ctx.rotate(-(a - bend)); ctx.beginPath(); ctx.ellipse(3.5 * u, -1 * u, 7.5 * u, 3.6 * u, 0, 0, 6.2832); ctx.fill(); ctx.restore();
    }
    var aF, aB, bF, bB;
    if (o.kick != null){ aB = -0.08; bB = 0.05; aF = o.kick * 1.15; bF = o.kick < 0.4 ? 1.1 * (1 - Math.max(0, o.kick)) + 0.2 : 0.1; }
    else if (o.run != null){ var s = Math.sin(o.run); aF = 0.65 * s; aB = -0.65 * s; bF = 0.25 + 0.9 * Math.max(0, -Math.cos(o.run)); bB = 0.25 + 0.9 * Math.max(0, Math.cos(o.run)); }
    else { aF = 0.1; aB = -0.1; bF = bB = 0.05; }
    leg(aB, bB, true);
    /* bras arrière */
    var arm = o.arms || 0, sw = o.run != null ? Math.sin(o.run) : (o.kick != null ? -o.kick : 0);
    function armd(sgn, back){
      var sx = 0, sy = -80 * u, ang = arm > 0 ? Math.PI - 0.35 * sgn : 0.35 * sgn * sw + (back ? -0.15 : 0.15), L1 = 26 * u;
      var ex = sx + Math.sin(ang) * L1 * (arm > 0 ? 1 : 1), ey = sy + Math.cos(ang) * L1;
      ctx.strokeStyle = back ? S2(o.shirt, 0.8) : o.shirt; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (ex - sx) * 0.45, sy + (ey - sy) * 0.45); ctx.stroke();
      ctx.strokeStyle = back ? "#d8b18c" : "#efc8a0"; ctx.lineWidth = 6.5 * u; ctx.beginPath(); ctx.moveTo(sx + (ex - sx) * 0.45, sy + (ey - sy) * 0.45); ctx.lineTo(ex, ey); ctx.stroke();
    }
    armd(-1, true);
    /* short et maillot */
    ctx.fillStyle = o.shorts; SFA.draw.rrect(c, -12 * u, -56 * u, 24 * u, 15 * u, 4 * u); ctx.fill();
    leg(aF, bF, false);
    ctx.fillStyle = o.shirt; SFA.draw.rrect(c, -13 * u, -86 * u, 26 * u, 34 * u, 8 * u); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.18)"; SFA.draw.rrect(c, -13 * u, -86 * u, 9 * u, 34 * u, 6 * u); ctx.fill();
    if (h > 34){ ctx.fillStyle = "#ffffff"; ctx.font = "800 " + Math.round(13 * u) + "px Mulish, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.save(); ctx.scale(dir, 1); ctx.fillText(o.num || "10", 0, -70 * u); ctx.restore(); }
    armd(1, false);
    /* tête */
    ctx.fillStyle = "#efc8a0"; ctx.fillRect(-3.5 * u, -92 * u, 7 * u, 7 * u);
    ctx.beginPath(); ctx.arc(1 * u, -96 * u, 9.5 * u, 0, 6.2832); ctx.fill();
    ctx.fillStyle = o.hair || "#3b2a1c"; ctx.beginPath(); ctx.arc(0, -98 * u, 9.8 * u, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    ctx.fillStyle = "#13233a"; ctx.beginPath(); ctx.arc(6 * u, -96 * u, 1.3 * u, 0, 6.2832); ctx.fill();
    ctx.restore();
  };
  function S2(col, f){ var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(col); if (!m) return col; return "rgb(" + [m[1], m[2], m[3]].map(function(h){ return Math.round(parseInt(h, 16) * f); }).join(",") + ")"; }
  return T;
})();

SFA.sim({
  id:"m4-c03-trajectoire", ch:"c03", tag:"Niche",
  titre:"La trajectoire d'un ballon est une parabole",
  resume:"Un coup franc tiré du sol : règle la vitesse et l'angle, regarde la parabole se dessiner sous le ballon.",
  but:"Tire un coup franc (le ballon part du sol). Change la vitesse v et l'angle θ, ou tire la flèche rouge. Le ballon laisse sa trace (une position toutes les 0,2 s) et la parabole se dessine dessous. Active l'angle complémentaire (90° − θ) : que remarques-tu sur la portée ? Quel angle donne la portée maximale ?",
  aRetenir:"Sans frottement, y = x·tan θ − g·x² / (2v²·cos²θ) : c'est une fonction du 2e degré en x avec a < 0. Portée = v²·sin(2θ)/g, hauteur maximale = v²·sin²θ/(2g) au milieu de la portée. θ et 90° − θ donnent la même portée ; le maximum est à 45°.",
  piege:"Modèle simplifié : lancer depuis le sol, g = 9,81 m/s², sans résistance de l'air (en vrai, la portée est plus courte et la courbe n'est plus une parabole exacte). Le ballon et les joueurs sont dessinés un peu plus gros que l'échelle pour rester visibles.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.66});
    var v=k.slider("Vitesse initiale v",5,25,1,20,"m/s",function(){ kick(); });
    var th=k.slider("Angle de lancer θ",10,80,1,45,"°",function(){ kick(); });
    var tg=k.toggle("Montrer aussi l'angle complémentaire (90° − θ)",true,function(){ kick(); });
    var ro=k.readouts(["Équation y(x)","Portée","Hauteur maximale","Durée du vol"]);
    var g=9.81, M=window.M4, geo={}, st={tt:-0.7, clock:0, s:0};
    var D=Math.PI/180, RUN=0.7, HOLD=2.2;
    function kick(){ st.tt=-RUN; }
    var lp=k.loop(function(dt){
      st.clock+=dt; st.tt+=dt;
      var r=th.value*D, Tf=2*v.value*Math.sin(r)/g, Tc=2*v.value*Math.cos(r)/g, Tm=tg.value?Math.max(Tf,Tc):Tf;
      if(st.tt>Tm+HOLD) st.tt=-RUN;
      if(geo.sT) st.s+=(geo.sT-st.s)*Math.min(1,dt*3.5);
      k.redraw();
    });
    M.grab(c,function(){ return geo.tip?[{id:"v",x:geo.tip[0],y:geo.tip[1],r:30}]:[]; },
      function(id,px,py){ var dx=px-geo.ox, dy=geo.yG-py; th.set(M.clamp(Math.round(Math.atan2(dy,dx)/D),10,80)); v.set(M.clamp(Math.round(Math.hypot(dx,dy)/geo.kpx),5,25)); kick(); if(!lp.running) lp.play(); k.redraw(); });
    k.button("⚽ Tirer le coup franc",function(){ kick(); lp.play(); },true);
    k.button("❚❚ Pause",function(){ if(lp.running) lp.pause(); else lp.play(); });
    lp.play();
    function traj(V,T){ var r=T*D; return function(x){ return x*Math.tan(r)-g*x*x/(2*V*V*Math.cos(r)*Math.cos(r)); }; }
    function txt(s){ return String(s).replace(/<[^>]+>/g,""); }
    k.draw(function(){
      if(M.adapt(c,.95,.66,520)) return;
      var V=v.value, T=th.value, r=T*D, comp=tg.value&&T!==45, Tc_=90-T, rc=Tc_*D;
      var R=V*V*Math.sin(2*r)/g, Hm=V*V*Math.sin(r)*Math.sin(r)/(2*g), Tf=2*V*Math.sin(r)/g;
      var Hc=V*V*Math.sin(rc)*Math.sin(rc)/(2*g), Tc=2*V*Math.sin(rc)/g;
      var W=c.W, H=c.H, ctx=c.ctx, phone=W<520;
      var yG=Math.round(H*(phone?0.84:0.85)), L=40, ox=L+(phone?30:46), top=phone?48:56;
      /* échelle : même échelle en x et en y, le cadre suit les trajectoires */
      var xr=Math.max(20,(comp?Math.max(R,V*V/g*Math.sin(2*rc)):R)*1.1+2), yr=Math.max(6,(comp?Math.max(Hm,Hc):Hm)*1.15+2.5);
      var sT=Math.min((W-ox-14)/xr,(yG-top)/yr); geo.sT=sT; if(!(st.s>0)) st.s=sT;
      var s=st.s, X=function(x){ return ox+x*s; }, Y=function(y){ return yG-y*s; };
      geo.ox=ox; geo.yG=yG;
      c.clear();
      /* ciel, nuages, stade, pelouse */
      ctx.fillStyle=TJ.lin(ctx,0,0,0,yG,[[0,"#8fc0ec"],[1,"#dcecf9"]]); ctx.fillRect(0,0,W,yG);
      TJ.clouds.forEach(function(q){ var cx=((q[0]*W+st.clock*8*q[2])%(W+120))-60; TJ.cloud(ctx,cx,q[1]*H+10,q[2]*(phone?0.7:1)); });
      var tFly=Math.max(0,st.tt), landed=tFly>=Tf;
      TJ.stadium(c,yG,st.clock,landed&&st.tt>=0);
      TJ.pitch(c,yG,X,-ox/s,(W-ox)/s);
      /* règles graduées : sol (x) et verticale (y) */
      var span=(W-ox)/s, stp = span/ (phone?5:9) <= 2 ? 2 : span/(phone?5:9) <= 5 ? 5 : 10;
      ctx.save(); ctx.font="800 10.5px Mulish, system-ui, sans-serif"; ctx.textAlign="center"; ctx.textBaseline="top";
      for(var m=0;X(m)<W-8;m+=stp){ ctx.fillStyle="rgba(255,255,255,.95)"; ctx.fillRect(X(m)-1,yG,2,7); ctx.fillStyle="#ffffff"; ctx.fillText(S.fmt(m,0)+(m===0?"":""),X(m),yG+10); }
      ctx.textAlign="right"; ctx.fillText("x (m)",W-8,yG+(phone?24:26));
      ctx.restore();
      var ys=(yG-top)/s/(phone?4:6); ys = ys<=1?1:ys<=2?2:ys<=5?5:10;
      ctx.save(); ctx.fillStyle="rgba(255,255,255,.6)"; SFA.draw.rrect(c,4,top-20,L-6,yG-top+20,7); ctx.fill();
      ctx.strokeStyle="#5f6b7a"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(L-4,yG); ctx.lineTo(L-4,top-6); ctx.stroke();
      ctx.font="800 10.5px Mulish, system-ui, sans-serif"; ctx.fillStyle="#2c3a4e"; ctx.textAlign="right"; ctx.textBaseline="middle";
      for(var yv=ys;Y(yv)>top-4;yv+=ys){ ctx.beginPath(); ctx.moveTo(L-9,Y(yv)); ctx.lineTo(L-4,Y(yv)); ctx.stroke(); ctx.fillText(S.fmt(yv,0),L-11,Y(yv)); }
      ctx.textAlign="center"; ctx.fillText("y (m)",L/2+1,top-12);
      ctx.restore();
      /* tailles dessinées */
      var hp=Math.min(Math.max(1.8*s,phone?40:52),(yG-top)*0.42), rb=Math.max(phone?6:7.5,Math.min(12,0.22*s));
      /* trajectoire prévue (pâle) */
      function curve(f,x1,col,w,dash,alpha){
        if(!(x1>0)) return; ctx.save(); ctx.globalAlpha=alpha==null?1:alpha; ctx.strokeStyle=col; ctx.lineWidth=w; ctx.lineJoin="round"; ctx.lineCap="round"; ctx.setLineDash(dash||[]);
        ctx.beginPath(); for(var i=0;i<=160;i++){ var x=x1*i/160, y=Math.max(0,f(x)); i?ctx.lineTo(X(x),Y(y)-0):ctx.moveTo(X(x),Y(y)); } ctx.stroke(); ctx.restore();
      }
      var f1=traj(V,T), f2=traj(V,Tc_), Rc=V*V*Math.sin(2*rc)/g;
      curve(f1,R,"#ffffff",2,[3,6],0.75);
      if(comp) curve(f2,Rc,"#fff3d6",2,[3,6],0.6);
      /* trace + parabole qui se dessine */
      function flight(Th,Tfl,col,ghost,lab){
        var rr_=Th*D, vx=V*Math.cos(rr_), vy=V*Math.sin(rr_), t=Math.min(tFly,Tfl), xb=vx*t;
        curve(traj(V,Th),xb,col,3.4,lab?[]:[8,5]);
        ctx.save();
        for(var q=0.2;q<t-1e-6;q+=0.2){ var gx=vx*q, gy=vy*q-g*q*q/2; ctx.globalAlpha=0.55; ctx.fillStyle=ghost; ctx.strokeStyle="rgba(15,27,45,.35)"; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(X(gx),Y(gy)-rb*0.6,rb*0.62,0,6.2832); ctx.fill(); ctx.stroke(); }
        ctx.restore();
        var yb=Math.max(0,vy*t-g*t*t/2), bx=X(xb), by=Y(yb)-rb;
        /* ombre au sol */
        ctx.save(); ctx.fillStyle="rgba(15,27,45,"+(0.28-Math.min(0.2,yb*s/900))+")"; ctx.beginPath(); ctx.ellipse(bx,yG+2,rb*(1.1-Math.min(.5,yb*s/1200)),rb*0.3,0,0,6.2832); ctx.fill(); ctx.restore();
        if(st.tt>0&&t<Tfl){ ctx.save(); ctx.strokeStyle="rgba(255,255,255,.7)"; ctx.lineWidth=rb*0.9; ctx.lineCap="round"; var tb=Math.max(0,t-0.08); ctx.globalAlpha=0.45; ctx.beginPath(); ctx.moveTo(X(vx*tb),Y(vy*tb-g*tb*tb/2)-rb); ctx.lineTo(bx,by); ctx.stroke(); ctx.restore(); }
        TJ.ball(c,bx,by,rb,-xb*0.9/Math.max(rb/s,0.11)*0.12,1,lab?null:"#ffe2b8");
        return {x:xb,t:t,done:tFly>=Tfl&&st.tt>0};
      }
      /* joueurs */
      var ph=st.tt<0?(st.tt+RUN)/RUN:1;   /* 0 → 1 pendant l'élan */
      var kx=ox-rb-hp*0.34-(1-ph)*hp*0.55;
      var kickA=st.tt<0?(ph<0.55?Math.sin(ph/0.55*Math.PI*2)*0.3:-1+(ph-0.55)/0.45*1.9):Math.max(0.05,0.9-Math.max(0,st.tt)*1.6);
      var Tmax=comp?Math.max(Tf,Tc):Tf, both=tFly>=Tmax&&st.tt>0;
      if(st.tt<0&&ph<0.55) TJ.player(c,kx,yG+1,hp,{shirt:"#c0321d",shorts:"#ffffff",socks:"#c0321d",num:"10",run:ph*9});
      else TJ.player(c,kx,yG+1,hp,{shirt:"#c0321d",shorts:"#ffffff",socks:"#c0321d",num:"10",kick:kickA,arms:both?1:0});
      /* coéquipier qui court vers le point de chute */
      var rx0=R+Math.max(5,hp*1.2/s), rt=Math.min(1,tFly/Math.max(Tf,0.3)), rxx=rx0-(rx0-(R+hp*0.3/s))*rt;
      if(X(rxx)<W+hp) TJ.player(c,X(rxx),yG+1,hp*0.97,{shirt:"#c0321d",shorts:"#ffffff",socks:"#c0321d",num:"9",dir:-1,hair:"#a86b2d",run:rt<1&&st.tt>0?st.clock*11:null,arms:both&&!comp?1:0});
      var b2=comp?flight(Tc_,Tc,P.amber,"#ffd9a3",false):null;
      var b1=flight(T,Tf,P.acc,"#ffffff",true);
      /* repères : sommet, portée, équation */
      if(tFly>=Tf/2&&st.tt>0){ S.draw.dot(c,X(R/2),Y(Hm),5,P.red); M.lab(c,"sommet "+S.fmt(Hm,1)+" m",X(R/2),Y(Hm)-rb*2-14,P.red,{size:11}); ctx.save(); ctx.setLineDash([4,4]); ctx.strokeStyle="rgba(192,50,29,.6)"; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(X(R/2),Y(Hm)); ctx.lineTo(X(R/2),yG); ctx.stroke(); ctx.restore(); }
      if(b1.done){
        var yd=yG+(phone?30:34);
        ctx.save(); ctx.strokeStyle="#ffffff"; ctx.fillStyle="#ffffff"; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(X(0),yd); ctx.lineTo(X(R),yd); ctx.stroke(); ctx.restore();
        S.draw.arrow(c,X(R/2),yd,X(R),yd,"#ffffff",1.6); S.draw.arrow(c,X(R/2),yd,X(0),yd,"#ffffff",1.6);
        S.draw.text(c,"portée "+txt(S.fmt(R,1))+" m",X(R/2),yd+(phone?13:12),{size:11.5,weight:800,color:P.green,bg:"rgba(255,255,255,.95)"});
        S.draw.dot(c,X(R),yG,5,P.green);
        var bs=txt(S.fmt(Math.tan(r),3)), eqs="y = "+txt(S.fmt(-g/(2*V*V*Math.cos(r)*Math.cos(r)),4))+"x² + "+(bs==="1"?"":bs)+"x";
        S.draw.text(c,eqs,X(R*0.5),Math.max(top+8,Y(Hm)-rb*2-40),{size:phone?12.5:14.5,weight:800,color:P.acc,bg:"rgba(255,255,255,.93)",math:true});
      }
      if(comp&&both) M.lab(c,"θ = "+T+"° et 90° − θ = "+Tc_+"° : même portée !",W/2,top-30,P.green,{size:phone?10.5:12});
      /* flèche de vitesse (déplaçable) */
      var kpx=Math.min(W-ox-30,yG-top)*0.5/25; geo.kpx=kpx;
      var tip=[ox+V*kpx*Math.cos(r),yG-rb-V*kpx*Math.sin(r)]; geo.tip=tip;
      if(st.tt<0.25){ S.draw.arrow(c,ox,yG-rb,tip[0],tip[1],P.red,3); M.handle(c,tip[0],tip[1],P.red,6.5); M.lab(c,"v = "+S.fmt(V,0)+" m/s ; "+S.fmt(T,0)+"°",tip[0]+10,tip[1]-18,P.red,{size:11}); }
      else { ctx.save(); ctx.globalAlpha=0.55; S.draw.arrow(c,ox,yG-rb,tip[0],tip[1],P.red,2.4); ctx.restore(); M.handle(c,tip[0],tip[1],P.red,5.5); }
      if(st.tt<0) TJ.ball(c,ox,yG-rb,rb,0,1);
      /* chrono */
      S.draw.display(c,S.fmt(Math.min(tFly,Tmax),2)+" s",W-(phone?50:62),phone?26:32,{w:phone?82:100,h:phone?36:42,caption:"CHRONO",size:phone?14:17});
      var a=-g/(2*V*V*Math.cos(r)*Math.cos(r)), b=Math.tan(r);
      var bstr=txt(S.fmt(b,3));
      ro.set(0,"y = "+S.fmt(a,4)+"x² + "+(bstr==="1"?"":S.fmt(b,3))+"x");
      ro.set(1,S.fmt(R,1)+" m"); ro.set(2,S.fmt(Hm,1)+" m"); ro.set(3,S.fmt(Tf,2)+" s");
    });
  }
});
})();
