/* Chapitre 8 : Pythagore et irrationnels */
SFA.sim({
  id:"m3-c08-carres", ch:"c08", tag:"Géométrie", titre:"Des carrés sur les côtés : quand a² + b² = c² ?",
  resume:"Fais varier l'angle au sommet C : la somme des deux petits carrés égale le grand carré seulement à 90°.",
  but:"Fixe les côtés a et b, puis fais tourner l'angle en C. Cherche l'angle pour lequel les aires s'égalisent.",
  aRetenir:"Si l'angle en C est droit, l'aire du carré de l'hypoténuse c² est égale à a² + b². Si l'angle est aigu, c² < a² + b² ; s'il est obtus, c² > a² + b².",
  piege:"Pythagore ne s'applique qu'aux triangles rectangles. Et c est l'hypoténuse : le côté opposé à l'angle droit, toujours le plus long.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.95}), P=S.draw.palette;
    var a=k.slider("Côté a",2,6,0.5,3,""), b=k.slider("Côté b",2,6,0.5,4,""), g=k.slider("Angle en C",50,130,1,90,"°");
    var ro=k.readouts(["a² + b²","c²","Différence c² − (a² + b²)","Triangle"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=a.value,B=b.value,G=g.value*Math.PI/180;
      var C0=[0,0], Pa=[A,0], Pb=[B*Math.cos(G),B*Math.sin(G)];   /* C, point sur CB (longueur a), point sur CA (longueur b) */
      var cc=Math.sqrt(A*A+B*B-2*A*B*Math.cos(G));
      var pts=[C0,Pa,Pb], gx=(pts[0][0]+pts[1][0]+pts[2][0])/3, gy=(pts[0][1]+pts[1][1]+pts[2][1])/3;
      var sc=Math.min(c.W,c.H)/(Math.max(A,B,cc)*2.9);
      var ox=c.W/2-gx*sc, oy=c.H/2+gy*sc;
      function T(p){ return [ox+p[0]*sc, oy-p[1]*sc]; }
      function sq(p,q,col,label){ var dx=q[0]-p[0], dy=q[1]-p[1], nx=-dy, ny=dx, mid=[(p[0]+q[0])/2,(p[1]+q[1])/2];
        if((mid[0]-gx)*nx+(mid[1]-gy)*ny<0){ nx=-nx; ny=-ny; }
        var q1=[q[0]+nx,q[1]+ny], p1=[p[0]+nx,p[1]+ny], pp=[p,q,q1,p1].map(T);
        ctx.beginPath(); ctx.moveTo(pp[0][0],pp[0][1]); for(var i=1;i<4;i++) ctx.lineTo(pp[i][0],pp[i][1]); ctx.closePath(); ctx.fillStyle=col; ctx.globalAlpha=.55; ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.stroke();
        var m=T([(p[0]+q1[0])/2,(p[1]+q1[1])/2]); S.draw.text(c,label,m[0],m[1],{size:13,color:"#fff"}); }
      sq(C0,Pa,P.acc,"a²"); sq(C0,Pb,P.green,"b²"); sq(Pa,Pb,P.red,"c²");
      var t=pts.map(T); ctx.beginPath(); ctx.moveTo(t[0][0],t[0][1]); ctx.lineTo(t[1][0],t[1][1]); ctx.lineTo(t[2][0],t[2][1]); ctx.closePath(); ctx.fillStyle="#fff"; ctx.fill(); ctx.strokeStyle=P.ink; ctx.lineWidth=2.4; ctx.stroke();
      S.draw.text(c,"C",t[0][0]-(t[1][0]>t[0][0]?10:-10)-0,t[0][1]+12,{size:13});
      var d=cc*cc-(A*A+B*B), right=Math.abs(g.value-90)<0.5;
      ro.set(0,S.fmt(A*A+B*B,2)); ro.set(1,S.fmt(cc*cc,2)); ro.set(2,right?"0":S.fmt(d,2)); ro.set(3,right?"rectangle en C":d<0?"acutangle en C":"obtusangle en C");
      nt.set(right?"Angle droit : c² = a² + b². Ici c = "+S.fmt(Math.sqrt(A*A+B*B),3)+".":d<0?"Angle aigu (< 90°) : c² est plus petit que a² + b².":"Angle obtus (> 90°) : c² est plus grand que a² + b².",right?"ok":"warn");
    });
  }
});
SFA.sim({
  id:"m3-c08-dissection", ch:"c08", tag:"Preuve visuelle", titre:"Preuve sans calcul : quatre triangles qui se déplacent",
  resume:"Un grand carré de côté a + b, quatre triangles identiques : la place libre change de forme mais pas d'aire.",
  but:"Fais glisser le curseur de la position 1 (deux carrés a² et b² libres) à la position 2 (un seul carré c² libre).",
  aRetenir:"Dans les deux positions, la place libre = grand carré − 4 triangles : elle a la même aire. Donc a² + b² = c².",
  piege:"Ce n'est pas un « dessin qui illustre » : c'est une démonstration. Les triangles ne sont que déplacés, jamais déformés.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:.92}), P=S.draw.palette;
    var a=k.slider("a",2,8,0.5,3,""), b=k.slider("b",2,8,0.5,5,"");
    var tt=k.slider("Position (1 → 2)",0,1,0.02,0,"");
    var lp=k.loop(function(dt){ var v=tt.value+dt*0.35; if(v>=1){ v=1; lp.pause(); } tt.set(v); k.redraw(); });
    k.button("Animer",function(){ if(tt.value>=1) tt.set(0); lp.play(); },true);
    k.button("Retour",function(){ lp.pause(); tt.set(0); });
    var ro=k.readouts(["a² + b²","c²"]); var nt=k.note("");
    k.draw(function(){
      c.clear(); var ctx=c.ctx, A=a.value,B=b.value,s=A+B,t=tt.value, u=Math.min(c.W-30,c.H-30)/s, ox=(c.W-s*u)/2, oy=(c.H+s*u)/2;
      function X(x){return ox+x*u;} function Y(y){return oy-y*u;}
      ctx.fillStyle="#fff"; ctx.fillRect(X(0),Y(s),s*u,s*u);
      /* place libre en position 1 : a² et b² ; en position 2 : carré tourné */
      function tri(pts,dx,dy,col){ ctx.beginPath(); pts.forEach(function(p,i){ var x=X(p[0]+dx),y=Y(p[1]+dy); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.closePath(); ctx.fillStyle=col; ctx.fill(); ctx.strokeStyle="#fff"; ctx.lineWidth=1.5; ctx.stroke(); }
      /* positions de départ (A) des 4 triangles, translations vers B */
      var pcs=[{p:[[0,A],[A,A],[0,s]],d:[0,-A],col:P.acc},{p:[[s,0],[s,A],[A,0]],d:[0,0],col:P.green},{p:[[A,s],[0,s],[A,A]],d:[B,0],col:P.amber},{p:[[A,A],[A,0],[s,A]],d:[-A,B],col:P.violet}];
      /* en B : T1 (0,0),(A,0),(0,B) ; on vérifie les translations ci-dessous */
      pcs.forEach(function(q){ tri(q.p,q.d[0]*t,q.d[1]*t,q.col); });
      ctx.strokeStyle=P.ink; ctx.lineWidth=2; ctx.strokeRect(X(0),Y(s),s*u,s*u);
      if(t<0.02){ S.draw.text(c,"a²",X(A/2),Y(A/2),{size:16,color:P.acc}); S.draw.text(c,"b²",X(A+B/2),Y(A+B/2),{size:16,color:P.green}); }
      if(t>0.98) S.draw.text(c,"c²",X(s/2),Y(s/2),{size:16,color:P.red});
      ro.set(0,S.fmt(A*A+B*B,2)); ro.set(1,S.fmt(A*A+B*B,2));
      nt.set(t<0.02?"Position 1 : la place libre est formée du carré a² = "+S.fmt(A*A,2)+" et du carré b² = "+S.fmt(B*B,2)+".":t>0.98?"Position 2 : la place libre est un seul carré, celui de l'hypoténuse c.":"Les triangles glissent : l'aire libre ne change pas.","ok");
    });
  }
});
SFA.sim({
  id:"m3-c08-spirale", ch:"c08", tag:"Racines carrées", titre:"La spirale de Théodore : construire √2, √3, √4…",
  resume:"Chaque nouveau triangle rectangle de côté 1 fabrique la racine carrée suivante.",
  but:"Augmente le nombre de triangles (ou lance la construction pas à pas). Lis la longueur de la dernière hypoténuse et repère les carrés parfaits : les points dorés tombent sur des longueurs entières.",
  aRetenir:"Quand les côtés de l'angle droit mesurent √k et 1, l'hypoténuse vaut √(k + 1), car (√k)² + 1² = k + 1. Les longueurs √2, √3, √5… se construisent à la règle et au compas.",
  piege:"√3 ≈ 1,732 n'est pas égal à 1,732 : les décimales de √3 ne s'arrêtent jamais. On l'écrit √3 pour la valeur exacte.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.05}), P=S.draw.palette, T=S.draw.tint;
    var n=k.slider("Nombre de triangles",1,16,1,6,"");
    var lp=k.loop(function(dt){ acc+=dt; if(acc>0.55){ acc=0; if(n.value>=16){ lp.pause(); } else n.set(n.value+1); k.redraw(); } }), acc=0;
    k.button("Construire pas à pas",function(){ n.set(1); acc=0; lp.play(); k.redraw(); },true);
    var ro=k.readouts(["Dernière hypoténuse","Valeur approchée","Carré parfait ?"]); var nt=k.note("");
    window.M3.fit(c,0.72,1.05);
    k.draw(function(){
      c.clear(); var N=n.value, ctx=c.ctx, pts=[], phi=0, fs=M3.sz(c,13);
      for(var j=1;j<=N+1;j++){ pts.push([Math.sqrt(j)*Math.cos(phi),Math.sqrt(j)*Math.sin(phi)]); phi+=Math.atan(1/Math.sqrt(j)); }
      var xs=pts.map(function(p){return p[0];}).concat([0]), ys=pts.map(function(p){return p[1];}).concat([0]);
      var mnx=Math.min.apply(null,xs), mxx=Math.max.apply(null,xs), mny=Math.min.apply(null,ys), mxy=Math.max.apply(null,ys);
      var sc=Math.min((c.W-64)/(mxx-mnx),(c.H-64)/(mxy-mny)), ox=c.W/2-(mnx+mxx)/2*sc, oy=c.H/2+(mny+mxy)/2*sc;
      function Tt(p){ return [ox+p[0]*sc, oy-p[1]*sc]; }
      var o=Tt([0,0]);
      for(var i=0;i<N;i++){ var p=Tt(pts[i]),q=Tt(pts[i+1]), last=i===N-1, hue=P.acc;
        ctx.beginPath(); ctx.moveTo(o[0],o[1]); ctx.lineTo(p[0],p[1]); ctx.lineTo(q[0],q[1]); ctx.closePath();
        ctx.fillStyle=last?T(P.red,.26):T(i%2?P.teal:P.acc,.10+0.05*(i%3)); ctx.fill(); ctx.strokeStyle=last?P.red:T(P.acc,.75); ctx.lineWidth=last?2.6:1.4; ctx.lineJoin="round"; ctx.stroke();
        /* angle droit au sommet p */
        var ux=(o[0]-p[0]), uy=(o[1]-p[1]), vx=(q[0]-p[0]), vy=(q[1]-p[1]), lu=Math.hypot(ux,uy), lv=Math.hypot(vx,vy), sz=Math.min(8,sc*0.18);
        if(sz>3){ ctx.beginPath(); ctx.moveTo(p[0]+ux/lu*sz,p[1]+uy/lu*sz); ctx.lineTo(p[0]+ux/lu*sz+vx/lv*sz,p[1]+uy/lu*sz+vy/lv*sz); ctx.lineTo(p[0]+vx/lv*sz,p[1]+vy/lv*sz); ctx.strokeStyle=last?P.red:T(P.acc,.8); ctx.lineWidth=1.2; ctx.stroke(); } }
      var lastp=Tt(pts[N]), prev=Tt(pts[N-1]);
      S.draw.line(c,o[0],o[1],lastp[0],lastp[1],P.red,3.4);
      for(i=0;i<=N;i++){ var pp=Tt(pts[i]), kk=i+1, rt=Math.round(Math.sqrt(kk)), perf=rt*rt===kk;
        var ang=Math.atan2(-(pp[1]-o[1]),pp[0]-o[0]), off=(c.W<430?15:19);
        if(perf){ S.draw.glow(c,pp[0],pp[1],16,P.yellow,.7); S.draw.dot(c,pp[0],pp[1],5.5,P.amber); }
        else S.draw.dot(c,pp[0],pp[1],3,i===N?P.red:P.acc);
        if(N<=11||perf||i===N) S.draw.label(c,"√"+kk,pp[0]+Math.cos(ang)*off,pp[1]-Math.sin(ang)*off,{color:perf?P.amber:i===N?P.red:P.acc,size:fs-2,math:true}); }
      var m1=Tt([pts[N-1][0],pts[N-1][1]]);
      S.draw.label(c,"1",(m1[0]+lastp[0])/2+(lastp[0]-m1[0])*0.0+Math.cos(Math.atan2(-(lastp[1]-m1[1]),lastp[0]-m1[0])+Math.PI/2)*13,(m1[1]+lastp[1])/2-Math.sin(Math.atan2(-(lastp[1]-m1[1]),lastp[0]-m1[0])+Math.PI/2)*13,{color:P.ink,size:fs-2});
      S.draw.dot(c,o[0],o[1],4.5,P.ink);
      var m=N+1, rt2=Math.round(Math.sqrt(m)), perfect=rt2*rt2===m;
      ro.set(0,"√"+m); ro.set(1,perfect?S.fmt(rt2,0):S.fmt(Math.sqrt(m),4)+"…"); ro.set(2,perfect?"oui : √"+m+" = "+rt2:"non : irrationnel");
      nt.set(perfect?"√"+m+" = "+rt2+" : un carré parfait, la longueur est un nombre entier.":"Triangle n°"+N+" : côtés √"+N+" et 1, hypoténuse √"+N+"² + 1² = √"+m+". Ses décimales ne s'arrêtent jamais : on garde √"+m+" pour la valeur exacte.",perfect?"ok":"");
    });
  }
});
SFA.sim({
  id:"m3-c08-encadrement", ch:"c08", tag:"Irrationnels", titre:"Encadrer une racine carrée décimale par décimale",
  resume:"On resserre l'encadrement de √2 : la précision augmente sans jamais finir ni se répéter.",
  but:"Choisis un nombre et augmente le nombre de décimales : à chaque ligne, on zoome sur la case qui contient la racine (le point noir). Active le mode jeu et touche toi-même la bonne case pour deviner la décimale suivante. Compare les carrés des bornes avec le nombre de départ.",
  aRetenir:"Un encadrement donne une valeur approchée : par défaut (borne basse) et par excès (borne haute). Pour √2, aucun encadrement ne devient jamais une égalité : √2 est irrationnel.",
  piege:"Une calculatrice affiche 1,41421356… : c'est un arrondi. Jamais « √2 = 1,414 ». Mais attention : √9 = 3 est exact, c'est un carré parfait.",
  build:function(k,S){
    var M3=window.M3, c=k.canvas(0,{ratio:1.0}), P=S.draw.palette, T=S.draw.tint;
    var N=k.select("Nombre",[[2,"√2"],[3,"√3"],[5,"√5"],[7,"√7"],[10,"√10"],[9,"√9 (carré parfait)"]],2);
    var d=k.slider("Nombre de décimales",0,6,1,2,"");
    var gm=k.toggle("Mode jeu : devine la décimale suivante",false);
    var ro=k.readouts(["Borne basse","Borne haute","Carré de la borne basse","Carré de la borne haute"]); var nt=k.note("");
    var flash=null, score=0, geo={};
    function digit(r,i){ return Math.floor(r*Math.pow(10,i)+1e-9)%10; }
    c.pointer(function(t,p){
      if(t!=="down"||!gm.value||!geo.rows) return;
      var n=+N.value, r=Math.sqrt(n), D=d.value;
      if(Math.round(r)*Math.round(r)===n||D>=6){ return; }
      var g=geo; if(p.y<g.y1||p.y>g.y1+g.bh||p.x<g.L||p.x>g.R) return;
      var j=Math.min(9,Math.floor((p.x-g.L)/g.cw)), right=digit(r,D+1);
      if(j===right){ score++; flash={j:j,ok:true,at:Date.now()}; d.set(D+1); nt.set("Bien vu ! Chiffre "+j+" : √"+n+" = "+S.fmt(Math.floor(r*Math.pow(10,D+1)+1e-9)/Math.pow(10,D+1),D+1)+"… Total : "+score+" bonne(s) réponse(s).","ok"); }
      else { flash={j:j,ok:false,at:Date.now()}; nt.set("Non : la racine n'est pas dans la case "+j+" ("+(j<right?"elle est plus à droite":"elle est plus à gauche")+").","warn"); }
      k.redraw(); setTimeout(function(){ flash=null; k.redraw(); },900);
    });
    window.M3.fit(c,0.72,1.0);
    k.draw(function(){
      c.clear(); var ctx=c.ctx, n=+N.value, D=d.value, r=Math.sqrt(n), p=Math.pow(10,D), perfect=Math.round(r)*Math.round(r)===n, fs=M3.sz(c,13), game=gm.value&&!perfect&&D<6;
      var lo=perfect?r:Math.floor(r*p+1e-9)/p, hi=perfect?r:lo+1/p;
      var rows=D+1+(game?1:0), top=10, rh=Math.min(74,(c.H-36)/rows), L=18, R=c.W-18, cw=(R-L)/10, bh=Math.min(26,rh-30);
      geo={L:L,R:R,cw:cw,bh:bh,rows:rows,y1:0};
      for(var i=0;i<rows;i++){
        var q=Math.pow(10,i), li=Math.floor(r*q+1e-9)/q, hv=li+1/q, parentLo=i===0?0:Math.floor(r*Math.pow(10,i-1)+1e-9)/Math.pow(10,i-1);
        var y=top+i*rh, by=y+20, idx=Math.round((li-parentLo)*q), cur=(i===D)&&!game, ask=(game&&i===D+1);
        if(ask){ geo.y1=by; S.draw.text(c,"Où est √"+n+" ? Touche la bonne case",L,y+8,{size:fs,color:P.amber,align:"left",weight:800}); }
        else S.draw.text(c,(i===0?"Unités":i+(i===1?" décimale":" décimales"))+" :  "+S.fmt(li,i)+" < √"+n+" < "+S.fmt(hv,i),L,y+8,{size:fs,color:cur||(game&&i===D)?P.ink:P.grey,align:"left",weight:cur?800:600});
        for(var j=0;j<10;j++){
          var on=!ask&&(j===idx), fx=ask&&flash&&flash.j===j;
          S.draw.rrect(c,L+j*cw+1,by,cw-2,bh,5);
          ctx.fillStyle=fx?T(flash.ok?P.green:P.red,.35):on?T(cur?P.red:P.acc,cur?0.5:0.4):ask?T(P.amber,.14):"#f1f4f8"; ctx.fill();
          if(on||fx||ask){ ctx.lineWidth=on||fx?2:1.2; ctx.strokeStyle=fx?(flash.ok?P.green:P.red):on?(cur?P.red:P.acc):T(P.amber,.7); ctx.stroke(); }
          if(ask||(i===D&&!game)||true){ var dg=ask?"":""; }
          if(bh>=18) S.draw.text(c,S.fmt(parentLo+j/q*1+ (i===0?0:0),i===0?0:i)+"",L+j*cw+cw/2,by+bh/2+3,{size:Math.max(9,fs-4),color:on?P.ink:"#a5aebb",weight:on?800:600});
        }
        if(!ask){ var frac=((r-parentLo)*q)/10, px=L+frac*(R-L); ctx.fillStyle=P.ink; ctx.beginPath(); ctx.moveTo(px,by+3); ctx.lineTo(px-5,by-6); ctx.lineTo(px+5,by-6); ctx.closePath(); ctx.fill(); }
        if(i<rows-1&&!(game&&i===D)){ ctx.save(); ctx.strokeStyle=T(P.acc,0.4); ctx.setLineDash([3,4]); ctx.lineWidth=1.5; var nx=L+idx*cw; ctx.beginPath(); ctx.moveTo(nx,by+bh); ctx.lineTo(L,y+rh+20); ctx.moveTo(nx+cw,by+bh); ctx.lineTo(R,y+rh+20); ctx.stroke(); ctx.restore(); }
      }
      if(perfect) S.draw.label(c,"√"+n+" = "+S.fmt(r,0)+" exactement",c.W/2,c.H-14,{color:P.green,size:fs});
      else if(!game) S.draw.label(c,"√"+n+" ≈ "+S.fmt(r,Math.min(9,D+4))+"…",c.W/2,c.H-14,{color:P.acc,size:fs-1});
      ro.set(0,S.fmt(lo,D)); ro.set(1,S.fmt(hi,D)); ro.set(2,S.fmt(lo*lo,2*D+1)); ro.set(3,S.fmt(hi*hi,2*D+1));
      if(!game||!nt._set) {}
      if(!flash) nt.set(perfect?"√"+n+" = "+S.fmt(r,0)+" exactement : à chaque niveau le nombre tombe pile sur un trait.":game?"Mode jeu : touche la case de la ligne ambre où tu penses que se trouve √"+n+".":"Largeur de l'encadrement : "+S.fmt(1/p,D)+". Les carrés des bornes entourent "+n+" sans jamais l'égaler.",perfect?"ok":"");
    });
  }
});
