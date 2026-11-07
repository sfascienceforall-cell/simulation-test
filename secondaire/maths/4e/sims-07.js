(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI, D2R=PI/180;
function gcd(a,b){ return b?gcd(b,a%b):a; }
function radStr(d){
  var n=Math.round(d/15);
  if(Math.abs(d-n*15)<1e-7){ var neg=n<0; n=Math.abs(n); if(n===0) return "0"; var g=gcd(n,12), num=n/g, den=12/g;
    return (neg?"−":"")+(num===1?"":num)+"π"+(den===1?"":"/"+den); }
  return F(d*D2R,3)+" rad";
}
function arcAt(c,cx,cy,r,a0,a1,col,w){ var ctx=c.ctx; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w||2; ctx.beginPath(); ctx.arc(cx,cy,r,-a0,-a1,a1>a0); ctx.stroke(); ctx.restore(); }

/* ---------- triangle quelconque ---------- */
SFA.sim({
  id:"m4-c07-triangle", ch:"c07", tag:"Classique",
  titre:"Un triangle quelconque : lois des sinus et des cosinus",
  resume:"Déplace les sommets : côtés, angles, aire et vérification numérique des deux lois.",
  but:"Fais glisser A, B ou C. Observe que a/sin A = b/sin B = c/sin C reste constant (loi des sinus) et que a² = b² + c² − 2bc·cos A (loi des cosinus) est toujours vraie. Quand A = 90°, retrouves-tu Pythagore ?",
  aRetenir:"Loi des sinus : a/sin A = b/sin B = c/sin C. Loi des cosinus : a² = b² + c² − 2bc·cos A. Aire = ½·b·c·sin A. Pour A = 90°, cos A = 0 et la loi des cosinus devient a² = b² + c².",
  piege:"Dans la loi des sinus, chaque côté est divisé par le sinus de l'angle OPPOSÉ (a ↔ A). Et un angle obtus a un sinus positif : sin(180° − A) = sin A.",
  build:function(k,S){
    var M=window.M4, c=k.canvas(0,{ratio:.9});
    var pts=[{x:1,y:1.5},{x:10,y:2},{x:4,y:7.5}], ax=null, geo={};
    k.button("Triangle rectangle en A",function(){ pts=[{x:2,y:1.5},{x:9,y:1.5},{x:2,y:6}]; });
    k.button("Triangle équilatéral",function(){ pts=[{x:2,y:1.5},{x:10,y:1.5},{x:6,y:1.5+4*Math.sqrt(3)}]; });
    k.button("Remettre",function(){ pts=[{x:1,y:1.5},{x:10,y:2},{x:4,y:7.5}]; });
    var ro=k.readouts(["Côtés a ; b ; c","Angles A ; B ; C","Aire","a/sin A ; b/sin B ; c/sin C","a² et b² + c² − 2bc·cos A"]);
    var nt=k.note("","");
    M.grab(c,function(){ return ax?pts.map(function(q,i){ return {id:i,x:ax.X(q.x),y:ax.Y(q.y),r:32}; }):[]; },
      function(i,px,py){ pts[i].x=M.clamp(Math.round(ax.ix(px)*2)/2,0.5,11.5); pts[i].y=M.clamp(Math.round(ax.iy(py)*2)/2,0.5,9); k.redraw(); });
    k.draw(function(){
      c.clear();
      ax=S.draw.axes(c,{x0:0,x1:12,y0:0,y1:10.8,stepX:2,stepY:2,equal:true});
      var A=pts[0],B=pts[1],C=pts[2], X=ax.X, Y=ax.Y, ctx=c.ctx;
      var a=Math.hypot(B.x-C.x,B.y-C.y), b=Math.hypot(A.x-C.x,A.y-C.y), cc=Math.hypot(A.x-B.x,A.y-B.y);
      M.poly(c,[[X(A.x),Y(A.y)],[X(B.x),Y(B.y)],[X(C.x),Y(C.y)]],S.draw.tint(P.acc,.1));
      S.draw.line(c,X(B.x),Y(B.y),X(C.x),Y(C.y),P.red,3); S.draw.line(c,X(A.x),Y(A.y),X(C.x),Y(C.y),P.green,3); S.draw.line(c,X(A.x),Y(A.y),X(B.x),Y(B.y),P.amber,3);
      var degen = a<1e-9||b<1e-9||cc<1e-9;
      var area2=Math.abs((B.x-A.x)*(C.y-A.y)-(C.x-A.x)*(B.y-A.y));
      var cen={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3};
      function out(P0,k0){ var dx=P0.x-cen.x, dy=P0.y-cen.y, n=Math.hypot(dx,dy)||1; return [X(P0.x)+dx/n*k0, Y(P0.y)-dy/n*k0]; }
      if(degen||area2<1e-9){ pts.forEach(function(q,i){ M.handle(c,X(q.x),Y(q.y),P.acc,7.5); }); ro.set(0,F(a,2)+" ; "+F(b,2)+" ; "+F(cc,2)); ro.set(1,"—"); ro.set(2,"0 (sommets alignés)"); ro.set(3,"—"); ro.set(4,"—"); nt.set("Les trois points sont alignés : le triangle est aplati (aire nulle).","warn"); return; }
      var cosA=(b*b+cc*cc-a*a)/(2*b*cc), cosB=(a*a+cc*cc-b*b)/(2*a*cc), Ar=Math.acos(cosA), Br=Math.acos(cosB), Cr=PI-Ar-Br;
      /* arcs d'angle aux sommets */
      [[A,B,C,Ar],[B,C,A,Br],[C,A,B,Cr]].forEach(function(t,i){
        var P0=t[0],Q=t[1],R=t[2], a1=Math.atan2(Q.y-P0.y,Q.x-P0.x), a2=Math.atan2(R.y-P0.y,R.x-P0.x), d=a2-a1; while(d>PI)d-=2*PI; while(d<-PI)d+=2*PI;
        var lo=d>0?a1:a2, hi=lo+Math.abs(d), rr=22;
        if(Math.abs(t[3]-PI/2)<0.012){ var u=[Math.cos(a1),-Math.sin(a1)], v=[Math.cos(a2),-Math.sin(a2)], px=X(P0.x), py=Y(P0.y), s=13;
          ctx.save(); ctx.strokeStyle=P.ink; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(px+u[0]*s,py+u[1]*s); ctx.lineTo(px+(u[0]+v[0])*s,py+(u[1]+v[1])*s); ctx.lineTo(px+v[0]*s,py+v[1]*s); ctx.stroke(); ctx.restore(); }
        else { M.sector(c,X(P0.x),Y(P0.y),rr,lo,hi,P.violet,.25); M.arc(c,X(P0.x),Y(P0.y),rr,lo,hi,P.violet,2); }
        var mid=lo+(hi-lo)/2; S.draw.text(c,F(t[3]/D2R,1)+"°",X(P0.x)+Math.cos(mid)*40,Y(P0.y)-Math.sin(mid)*40,{size:11,weight:800,color:P.violet,halo:true}); });
      /* noms des côtés (à l'opposé du sommet) */
      var mids=[[B,C,"a = "+F(a,2),P.red,A],[A,C,"b = "+F(b,2),P.green,B],[A,B,"c = "+F(cc,2),P.amber,C]];
      mids.forEach(function(m){ var mx=(m[0].x+m[1].x)/2, my=(m[0].y+m[1].y)/2, dx=mx-m[4].x, dy=my-m[4].y, n=Math.hypot(dx,dy)||1; M.lab(c,m[2],X(mx)+dx/n*26,Y(my)-dy/n*26,m[3],{size:11}); });
      pts.forEach(function(q,i){ var o=out(q,24); M.handle(c,X(q.x),Y(q.y),P.acc,7.5); S.draw.text(c,["A","B","C"][i],o[0],o[1],{size:14,weight:800,color:P.acc}); });
      var area=0.5*b*cc*Math.sin(Ar), kk=a/Math.sin(Ar);
      S.draw.panel(c,8,8,c.W<420?150:176,56,{shadow:false});
      S.draw.text(c,"a/sin A = "+F(a/Math.sin(Ar),2),16,22,{size:11,weight:700,color:P.red,align:"left"});
      S.draw.text(c,"b/sin B = "+F(b/Math.sin(Br),2),16,36,{size:11,weight:700,color:P.green,align:"left"});
      S.draw.text(c,"c/sin C = "+F(cc/Math.sin(Cr),2),16,50,{size:11,weight:700,color:P.amber,align:"left"});
      ro.set(0,F(a,2)+" ; "+F(b,2)+" ; "+F(cc,2));
      ro.set(1,F(Ar/D2R,1)+"° ; "+F(Br/D2R,1)+"° ; "+F(Cr/D2R,1)+"°");
      ro.set(2,F(area,2)+" u²");
      ro.set(3,F(a/Math.sin(Ar),3)+" ; "+F(b/Math.sin(Br),3)+" ; "+F(cc/Math.sin(Cr),3));
      ro.set(4,F(a*a,2)+" et "+F(b*b+cc*cc-2*b*cc*cosA,2));
      var rect=Math.abs(Ar/D2R-90)<0.05||Math.abs(Br/D2R-90)<0.05||Math.abs(Cr/D2R-90)<0.05;
      nt.set(rect ? "Triangle rectangle : la loi des cosinus se réduit au théorème de Pythagore." : (Math.max(Ar,Br,Cr)>PI/2+1e-6 ? "Un angle est obtus (> 90°) : cos négatif, donc le terme −2bc·cos A est positif." : "Les trois angles sont aigus. Les trois rapports a/sin A, b/sin B, c/sin C sont égaux : c'est le diamètre du cercle circonscrit."), rect?"ok":"");
    });
  }
});

/* ---------- équations trigonométriques ---------- */
SFA.sim({
  id:"m4-c07-equation-trigo", ch:"c07", tag:"Manipuler",
  titre:"Résoudre sin x = a, cos x = a ou tan x = a",
  resume:"Une droite horizontale coupe la courbe : les abscisses des intersections sont les solutions.",
  but:"Choisis la fonction, puis fais glisser la droite rouge (ou le curseur a). Les solutions dans [0 ; 2π[ sont les points rouges sur la courbe et sur le cercle. Combien y en a-t-il ? Quand n'y en a-t-il qu'une ? Aucune ?",
  aRetenir:"sin x = a : deux solutions x₁ et π − x₁ dans [0 ; 2π[ (une seule pour a = ±1, aucune si |a| > 1). cos x = a : x₁ et 2π − x₁. tan x = a : x₁ et x₁ + π. Avec la période, on ajoute 2kπ (ou kπ pour tan).",
  piege:"La calculatrice (arcsin) ne donne qu'UNE solution, l'angle aigu ou négatif. Il faut chercher l'autre sur le cercle. Et mets la calculatrice en radians ou en degrés selon l'unité voulue !",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, PI=Math.PI, D2R=PI/180;
    function gcd(a,b){ return b?gcd(b,a%b):a; }
    function radStr(d){ var n=Math.round(d/15); if(Math.abs(d-n*15)<1e-7){ var neg=n<0; n=Math.abs(n); if(n===0) return "0"; var g=gcd(n,12), num=n/g, den=12/g; return (neg?"−":"")+(num===1?"":num)+"π"+(den===1?"":"/"+den); } return F(d*D2R,3)+" rad"; }
    var c=k.canvas(0,{ratio:.62});
    var fn=k.seg("Équation",[["sin","sin x = a"],["cos","cos x = a"],["tan","tan x = a"]],"sin");
    var a=k.slider("Valeur a",-1.5,1.5,0.05,0.5,"");
    var ro=k.readouts(["Équation","Solution x₁","Solution x₂","Solutions dans ℝ"]);
    var nt=k.note("","");
    var geo={};
    M.grab(c,function(){ if(!geo.Y) return []; return [{id:"g",x:geo.gx1-14,y:geo.Y(Math.max(-1.5,Math.min(1.5,a.value))),r:28}]; },
      function(id,px,py){ var v=geo.iy(py); a.set(M.clamp(Math.round(v*20)/20,-1.5,1.5)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,1.22,.62,560);
      var A=Math.round(a.value*100)/100, f=fn.value, W=c.W,H=c.H, narrow=W<560, ctx=c.ctx; c.clear();
      var r,cx,cy,gx0,gx1,gy0,gy1;
      if(!narrow){ r=Math.min(W*.14,H*.32); cx=r+26; cy=H/2; gx0=cx+r*1.6+26; gx1=W-12; gy0=12; gy1=H-30; }
      else { r=Math.min(W*.2,H*.17); cx=W/2; cy=r+16; gx0=40; gx1=W-12; gy0=cy+r+30; gy1=H-26; }
      var gcy=(gy0+gy1)/2, yR=f==="tan"?3:1.5, ys=(gy1-gy0)/2/yR, gs=(gx1-gx0)/(2*PI);
      var Y=function(v){return gcy-v*ys;}, G=function(u){return gx0+u*gs;};
      geo={Y:Y,cx:cx,cy:cy,r:r,gx1:gx1,iy:function(py){return (gcy-py)/ys;}};
      /* cercle */
      ctx.save(); ctx.fillStyle="rgba(30,63,143,.05)"; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.fill(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.2; ctx.stroke(); ctx.restore();
      S.draw.line(c,cx-r*1.3,cy,cx+r*1.3,cy,P.axis,1.2); S.draw.line(c,cx,cy-r*1.3,cx,cy+r*1.3,P.axis,1.2);
      /* graphe */
      for(var v=-Math.floor(yR);v<=Math.floor(yR);v+=(f==="tan"?1:0.5)) S.draw.line(c,gx0,Y(v),gx1,Y(v),v===0?P.axis:P.grid,v===0?1.3:1);
      for(var m=1;m<=4;m++) S.draw.line(c,G(m*PI/2),gy0,G(m*PI/2),gy1,P.grid,1);
      S.draw.line(c,gx0,gy0,gx0,gy1,P.axis,1.3);
      var labs=["0","π/2","π","3π/2","2π"]; for(var m2=0;m2<=4;m2++) S.draw.text(c,labs[m2],G(m2*PI/2),gy1+13,{size:11,color:P.grey,math:true});
      var ticks=f==="tan"?[-3,-2,-1,1,2,3]:[-1,1]; ticks.forEach(function(v){ S.draw.text(c,F(v,0),gx0-9,Y(v),{size:11,color:P.grey}); });
      var fx=function(u){ return f==="sin"?Math.sin(u):(f==="cos"?Math.cos(u):Math.tan(u)); };
      ctx.save(); ctx.beginPath(); ctx.rect(gx0,gy0,gx1-gx0,gy1-gy0); ctx.clip(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.8; ctx.lineJoin="round"; ctx.beginPath(); var st=false;
      for(var u=0;u<=2*PI+1e-9;u+=0.01){ if(f==="tan"&&Math.abs(Math.cos(u))<0.02){ st=false; continue; } var vv=fx(u); if(!st){ctx.moveTo(G(u),Y(vv));st=true;} else ctx.lineTo(G(u),Y(vv)); } ctx.stroke(); ctx.restore();
      var yl=Math.max(-yR*1.02,Math.min(yR*1.02,A));
      S.draw.line(c,gx0,Y(yl),gx1,Y(yl),P.red,2,[6,4]);
      M.handle(c,gx1-14,Y(yl),P.red,7); M.lab(c,"a = "+F(A,2),gx1-52,Y(yl)+(A>=0?15:-15),P.red,{size:11});
      /* solutions */
      var sols=[], x1;
      if(f==="sin"){ if(Math.abs(A)<=1){ x1=Math.asin(A); sols=[x1,PI-x1]; } }
      else if(f==="cos"){ if(Math.abs(A)<=1){ x1=Math.acos(A); sols=[x1,2*PI-x1]; } }
      else { x1=Math.atan(A); sols=[x1,x1+PI]; }
      sols=sols.map(function(s){ return ((s%(2*PI))+2*PI)%(2*PI); }).sort(function(p,q){return p-q;});
      var uniq=[]; sols.forEach(function(s){ if(!uniq.length||Math.abs(s-uniq[uniq.length-1])>1e-7) uniq.push(s); });
      if(uniq.length>1&&Math.abs(uniq[0]+2*PI-uniq[uniq.length-1])<1e-7) uniq.pop();
      /* repères sur le cercle */
      if(f==="sin") S.draw.line(c,cx-r*1.15,cy-A*r,cx+r*1.15,cy-A*r,S.draw.tint(P.red,.6),1.5,[4,3]);
      else if(f==="cos") S.draw.line(c,cx+A*r,cy-r*1.15,cx+A*r,cy+r*1.15,S.draw.tint(P.red,.6),1.5,[4,3]);
      else { S.draw.line(c,cx+r,cy-r*1.3,cx+r,cy+r*1.3,P.violet,1.3,[4,3]); if(Math.abs(A)<1.3) S.draw.dot(c,cx+r,cy-A*r,4.5,P.violet); }
      uniq.forEach(function(s,i){ var px=cx+r*Math.cos(s), py=cy-r*Math.sin(s);
        S.draw.line(c,cx,cy,px,py,P.red,1.6,[3,3]); S.draw.dot(c,px,py,6,P.red); M.arc(c,cx,cy,r*.3+i*7,0,s,P.amber,1.8);
        S.draw.dot(c,G(s),Y(fx(s)),7,P.red); S.draw.line(c,G(s),Y(fx(s)),G(s),gcy,S.draw.tint(P.red,.5),1.3,[3,3]);
        M.lab(c,"x"+(i?"₂":"₁")+" = "+radStr(s/D2R),G(s),Y(fx(s))+(fx(s)>=0?-17:17),P.red,{size:11}); });
      ro.set(0,f+" x = "+F(A,2));
      ro.set(1,uniq.length?F(uniq[0]/D2R,1)+"° = "+radStr(uniq[0]/D2R):"aucune");
      ro.set(2,uniq.length>1?F(uniq[1]/D2R,1)+"° = "+radStr(uniq[1]/D2R):(uniq.length?"(identique)":"aucune"));
      var per=f==="tan"?"kπ":"2kπ";
      ro.set(3,uniq.length?(uniq.length>1?"x₁ + "+per+" ou x₂ + "+per:"x₁ + "+per):"aucune");
      nt.set(uniq.length===0?"|a| > 1 : la droite ne coupe jamais la courbe, aucune solution réelle.":("Dans [0 ; 2π[ : "+uniq.length+" solution"+(uniq.length>1?"s":"")+(uniq.length===1&&f!=="tan"?" (a = ±1 : le point est tangent à la droite)":"")+"."),uniq.length?"":"warn");
    });
  }
});

/* ---------- cas ambigu ---------- */
SFA.sim({
  id:"m4-c07-cas-ambigu", ch:"c07", tag:"Piège",
  titre:"Le cas ambigu SSA : 0, 1 ou 2 triangles ?",
  resume:"On connaît b, l'angle A et le côté a : combien de triangles existent ?",
  but:"Fixe l'angle A et le côté b, puis fais varier le côté a (curseur, ou glisse le point du cercle, ou le repère sur la règle du bas). Le côté a est un « balancier » centré en C : il coupe la droite de base 0, 1 ou 2 fois. Trouve la valeur de a qui donne exactement un triangle rectangle.",
  aRetenir:"Avec A aigu et h = b·sin A : a < h → aucun triangle ; a = h → un triangle rectangle ; h < a < b → DEUX triangles ; a ≥ b → un seul triangle. Avec A obtus ou droit : un triangle si a > b, sinon aucun.",
  piege:"Sans l'angle compris entre les deux côtés connus, la loi des sinus donne sin B, donc B ou 180° − B : il faut tester si 180° − B est aussi possible.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, D2R=Math.PI/180;
    var c=k.canvas(0,{ratio:.8});
    var Aa=k.slider("Angle A",20,150,1,30,"°");
    var b=k.slider("Côté b = AC",3,8,0.5,5,"");
    var a=k.slider("Côté a = BC",1,10,0.1,3.5,"");
    var ro=k.readouts(["Hauteur h = b·sin A","Nombre de triangles","Angle(s) B possible(s)"]);
    var nt=k.note("","");
    var geo={};
    M.grab(c,function(){ if(!geo.sc) return []; var Av=Aa.value*D2R, Cx=b.value*Math.cos(Av), Cy=b.value*Math.sin(Av);
        return [{id:"C",x:geo.X(Cx),y:geo.Y(Cy),r:24},{id:"a",x:geo.X(Cx+a.value*Math.cos(-.5)),y:geo.Y(Cy+a.value*Math.sin(-.5)),r:22},{id:"r",x:geo.RX(a.value),y:geo.ry,r:24}]; },
      function(id,px,py){
        if(id==="C"){ var x=geo.ix(px), y=geo.iy(py); var ang=Math.atan2(y,x)/D2R; Aa.set(M.clamp(Math.round(ang),20,150)); b.set(M.clamp(Math.round(Math.hypot(x,y)*2)/2,3,8)); }
        else if(id==="a"){ var Av=Aa.value*D2R, Cx=b.value*Math.cos(Av), Cy=b.value*Math.sin(Av); a.set(M.clamp(Math.round(Math.hypot(geo.ix(px)-Cx,geo.iy(py)-Cy)*10)/10,1,10)); }
        else a.set(M.clamp(Math.round((px-geo.rx0)/geo.rs*10*10)/10,1,10));
        k.redraw(); });
    k.draw(function(){
      M.adapt(c,.95,.78,520);
      var Av=Aa.value*D2R, bv=b.value, av=Math.round(a.value*10)/10, W=c.W,H=c.H, ctx=c.ctx; c.clear();
      var stripH=54, top=8, sc=Math.min((W-24)/13,(H-stripH-top-8)/9.6);
      var ox=12+1.5*sc, oy=H-stripH-14-1.2*sc;
      geo.sc=sc; geo.X=function(x){return ox+x*sc;}; geo.Y=function(y){return oy-y*sc;}; geo.ix=function(px){return (px-ox)/sc;}; geo.iy=function(py){return (oy-py)/sc;};
      var X=geo.X,Y=geo.Y, Cx=bv*Math.cos(Av), Cy=bv*Math.sin(Av), h=bv*Math.sin(Av);
      /* fond léger */
      S.draw.line(c,X(-1.4),Y(0),X(11.2),Y(0),P.axis,1.6);
      var sols=[], disc=av*av-h*h; if(Math.abs(disc)<1e-9) disc=0;
      if(disc>=0){ var rt=Math.sqrt(disc); [Cx-rt,Cx+rt].forEach(function(x,i){ if(x>1e-9 && !(i===1&&rt<1e-9)) sols.push(x); }); }
      var cols=[P.red,P.teal];
      /* triangles solutions */
      sols.forEach(function(x,i){ M.poly(c,[[X(0),Y(0)],[X(Cx),Y(Cy)],[X(x),Y(0)]],S.draw.tint(cols[i],.10)); });
      /* cercle de rayon a (balancier) */
      ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,Y(0)+10); ctx.clip(); ctx.strokeStyle=P.violet; ctx.lineWidth=1.6; ctx.setLineDash([6,5]); ctx.beginPath(); ctx.arc(X(Cx),Y(Cy),av*sc,0,2*Math.PI); ctx.stroke(); ctx.restore();
      /* hauteur */
      S.draw.line(c,X(Cx),Y(Cy),X(Cx),Y(0),P.grey,1.3,[3,3]); if(h>.6) M.lab(c,"h = "+F(h,2),X(Cx)+(Cx>10?-36:34),Y(h/2),P.grey,{size:11});
      S.draw.line(c,X(0),Y(0),X(Cx),Y(Cy),P.green,3.4);
      M.arc(c,X(0),Y(0),26,0,Av,P.amber,2.6); S.draw.text(c,"A = "+F(Aa.value,0)+"°",X(0)+(Aa.value>100?-4:50),Y(0)-(Aa.value>100?36:12),{size:11.5,color:P.amber});
      M.lab(c,"b = "+F(bv,1),(X(0)+X(Cx))/2-(Aa.value<60?18:-0)-14,(Y(0)+Y(Cy))/2-12,P.green,{size:11});
      sols.forEach(function(x,i){ S.draw.line(c,X(Cx),Y(Cy),X(x),Y(0),cols[i],2.8); S.draw.line(c,X(0),Y(0),X(x),Y(0),cols[i],4); S.draw.dot(c,X(x),Y(0),6.5,cols[i]); });
      var Bs=sols.map(function(x){ var cosB=(av*av+x*x-bv*bv)/(2*av*x); return Math.acos(Math.max(-1,Math.min(1,cosB)))/D2R; });
      sols.forEach(function(x,i){ M.lab(c,"B"+(sols.length>1?(i?"₂":"₁"):"")+" "+F(Bs[i],1)+"°",X(x),Y(0)+(i?30:17),cols[i],{size:11}); });
      S.draw.dot(c,X(0),Y(0),6,P.ink); S.draw.text(c,"A",X(0)-12,Y(0)+13,{size:13,color:P.ink});
      M.handle(c,X(Cx),Y(Cy),P.green,8); S.draw.text(c,"C",X(Cx)+(Cx<5?-13:13),Y(Cy)-11,{size:13,color:P.ink});
      M.handle(c,X(Cx+av*Math.cos(-.5)),Y(Cy+av*Math.sin(-.5)),P.violet,6.5);
      M.lab(c,"a = "+F(av,1),X(Cx+av*Math.cos(-.5))+22,Y(Cy+av*Math.sin(-.5))+2,P.violet,{size:11});
      /* règle des régimes */
      var rx0=16, rs=(W-32)/10, ry=H-24, RX=function(v){return rx0+v*rs;}; geo.rx0=rx0-rs*0; geo.rs=rs; geo.RX=function(v){return rx0+v*rs;}; geo.ry=ry;
      geo.rx0=rx0; var obtus=Aa.value>=90;
      var zones=obtus?[[0,bv,P.red,"aucun"],[bv,10,P.blue,"1"]]:[[0,h,P.red,"aucun"],[h,bv,P.green,"2"],[bv,10,P.blue,"1"]];
      zones.forEach(function(z){ var x0=RX(Math.max(0,z[0])),x1=RX(Math.min(10,z[1])); if(x1>x0){ ctx.fillStyle=S.draw.tint(z[2],.28); ctx.fillRect(x0,ry-7,x1-x0,14); S.draw.text(c,z[3],(x0+x1)/2,ry,{size:10.5,color:z[2]}); } });
      S.draw.text(c,"a  →  nombre de triangles",rx0,ry-19,{size:10.5,color:P.grey,align:"left"});
      for(var v=0;v<=10;v+=2) S.draw.text(c,String(v),RX(v),ry+15,{size:10,color:P.grey});
      if(!obtus&&Math.abs(av-h)<.05) { S.draw.dot(c,RX(h),ry,3.5,P.ink); }
      M.handle(c,RX(av),ry,P.violet,7);
      ro.set(0,F(h,3)); ro.set(1,String(sols.length));
      ro.set(2,Bs.length?Bs.map(function(v,i){return "B"+(Bs.length>1?(i?"₂":"₁"):"")+" ≈ "+F(v,1)+"°";}).join(" ; "):"—");
      var msg,kind="";
      if(Aa.value<90){
        if(Math.abs(av-h)<1e-9){ msg="a = h : un seul triangle, rectangle en B (le cercle est tangent à la base)."; kind="ok"; }
        else if(av<h){ msg="a < h : le cercle de rayon a ne touche pas la base : aucun triangle."; kind="warn"; }
        else if(av<bv){ msg="h < a < b : le cercle coupe la base en deux points : DEUX triangles (cas ambigu). Les angles B valent B et 180° − B."; kind="ok"; }
        else { msg="a ≥ b : un seul triangle (l'autre point serait derrière A)."; kind="ok"; }
      } else { msg = av>bv ? "A obtus : un seul triangle est possible (a > b)." : "A obtus et a ≤ b : aucun triangle (le plus grand côté est opposé au plus grand angle)."; kind=av>bv?"ok":"warn"; }
      nt.set(msg,kind);
    });
  }
});

/* ---------- triangulation ---------- */
SFA.sim({
  id:"m4-c07-triangulation", ch:"c07", tag:"Topographie",
  titre:"Mesurer une distance inaccessible",
  resume:"Deux observateurs A et B visent un arbre T de l'autre côté d'une rivière : la loi des sinus donne les distances.",
  but:"Glisse l'arbre T de l'autre côté de la rivière. Les angles α (en A) et β (en B) sont « mesurés » ; la loi des sinus calcule AT et BT. Ajoute une erreur de visée sur α : la croix orange montre où tu crois que l'arbre se trouve.",
  aRetenir:"Dans le triangle ABT, l'angle en T vaut 180° − α − β. Loi des sinus : AT = AB·sin β / sin(α + β) et BT = AB·sin α / sin(α + β). Seul AB (la base) est mesuré au mètre ; le reste vient des angles.",
  piege:"Une petite erreur d'angle peut donner une grosse erreur de distance, surtout quand l'angle en T est très petit (arbre loin et base courte). Une base trop courte est un mauvais choix.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, D2R=Math.PI/180;
    var c=k.canvas(0,{ratio:.78});
    var d=k.slider("Base AB",40,200,10,100,"m");
    var er=k.slider("Erreur de visée sur α",-3,3,0.5,0,"°");
    var T={x:25,y:90}, geo={};
    var ro=k.readouts(["α (en A) ; β (en B)","Angle en T","AT calculé","BT calculé","AT réel","Erreur sur AT"]);
    var nt=k.note("","");
    M.grab(c,function(){ return geo.sc?[{id:"T",x:geo.X(T.x),y:geo.Y(T.y),r:28}]:[]; },
      function(id,px,py){ T.x=M.clamp(Math.round(geo.ix(px)/5)*5,-150,150); T.y=M.clamp(Math.round(geo.iy(py)/5)*5,35,140); k.redraw(); });
    function tree(x,y,s,col){ var ctx=c.ctx; ctx.save(); ctx.fillStyle="#7a5230"; ctx.fillRect(x-2.5*s,y-4*s,5*s,12*s); ctx.fillStyle=col||"#2f8a56"; ctx.beginPath(); ctx.arc(x,y-11*s,11*s,0,2*Math.PI); ctx.arc(x-7*s,y-5*s,8*s,0,2*Math.PI); ctx.arc(x+7*s,y-5*s,8*s,0,2*Math.PI); ctx.fill(); ctx.restore(); }
    function person(x,y,col){ var ctx=c.ctx; ctx.save(); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y-17,5,0,2*Math.PI); ctx.fill(); ctx.fillRect(x-4,y-11,8,12); ctx.restore(); }
    k.draw(function(){
      M.adapt(c,.95,.78,520);
      var W=c.W,H=c.H,ctx=c.ctx; c.clear();
      var sc=Math.min((W-16)/330,(H-34)/160); geo.sc=sc;
      var X=function(x){return W/2+x*sc;}, Y=function(y){return H-30-y*sc;};
      geo.X=X; geo.Y=Y; geo.ix=function(px){return (px-W/2)/sc;}; geo.iy=function(py){return (H-30-py)/sc;};
      var dv=d.value, A={x:-dv/2,y:0}, B={x:dv/2,y:0};
      /* décor : ciel, rive, rivière, rive */
      var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,"#f3f9fc"); g.addColorStop(1,"#eaf3e6"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      ctx.fillStyle="#dcebd0"; ctx.fillRect(0,Y(0),W,H-Y(0));
      ctx.fillStyle="#b9dcee"; ctx.fillRect(0,Y(26),W,Y(5)-Y(26)); ctx.strokeStyle="rgba(255,255,255,.7)"; ctx.lineWidth=1.5; for(var i=0;i<7;i++){ var wx=(i+.5)*W/7, wy=Y(15.5); ctx.beginPath(); ctx.moveTo(wx-10,wy); ctx.quadraticCurveTo(wx-5,wy-4,wx,wy); ctx.quadraticCurveTo(wx+5,wy+4,wx+10,wy); ctx.stroke(); }
      S.draw.text(c,"rivière",W-36,Y(15.5),{size:11.5,color:P.teal});
      var tA=Math.atan2(T.y-A.y,T.x-A.x), tB=Math.atan2(T.y-B.y,T.x-B.x);
      var alpha=tA/D2R, beta=180-tB/D2R, am=alpha+er.value, bm=beta, Tm=180-am-bm, truth=Math.hypot(T.x-A.x,T.y-A.y);
      /* lignes de visée */
      S.draw.line(c,X(A.x),Y(A.y),X(T.x),Y(T.y),P.red,2); S.draw.line(c,X(B.x),Y(B.y),X(T.x),Y(T.y),P.green,2);
      S.draw.line(c,X(A.x),Y(A.y),X(B.x),Y(B.y),P.amber,4);
      var est=null;
      if(Tm>0.05&&Math.abs(er.value)>1e-9){ var at0=dv*Math.sin(bm*D2R)/Math.sin((am+bm)*D2R); est={x:A.x+at0*Math.cos(am*D2R),y:at0*Math.sin(am*D2R)};
        S.draw.line(c,X(A.x),Y(A.y),X(est.x),Y(est.y),P.orange,1.8,[6,4]); }
      M.arc(c,X(A.x),Y(A.y),24,0,am*D2R,P.red,2.2); S.draw.text(c,"α",X(A.x)+34*Math.cos(am*D2R/2),Y(A.y)-34*Math.sin(am*D2R/2),{size:13,color:P.red});
      M.arc(c,X(B.x),Y(B.y),24,Math.PI-bm*D2R,Math.PI,P.green,2.2); S.draw.text(c,"β",X(B.x)-34*Math.cos(bm*D2R/2),Y(B.y)-34*Math.sin(bm*D2R/2),{size:13,color:P.green});
      person(X(A.x),Y(A.y)+8,P.red); person(X(B.x),Y(B.y)+8,P.green);
      S.draw.text(c,"A",X(A.x),Y(0)+22,{size:13}); S.draw.text(c,"B",X(B.x),Y(0)+22,{size:13});
      M.lab(c,"AB = "+F(dv,0)+" m",W/2,Y(0)+22,P.amber,{size:11});
      tree(X(T.x),Y(T.y)+6,Math.max(.8,sc*.5),"#2f8a56"); M.handle(c,X(T.x),Y(T.y)-2,P.green,6);
      M.lab(c,"T (arbre)",X(T.x)+(T.x>60?-46:46),Y(T.y)-6,P.green,{size:11});
      if(est){ var ex=X(est.x),ey=Y(est.y); S.draw.line(c,ex-7,ey-7,ex+7,ey+7,P.orange,3); S.draw.line(c,ex-7,ey+7,ex+7,ey-7,P.orange,3); M.lab(c,"T estimé",ex+(est.x>T.x?44:-44),ey+14,P.orange,{size:11}); }
      ro.set(0,F(am,1)+"° ; "+F(bm,1)+"°");
      if(Tm<=0.05){ ro.set(1,"—"); ro.set(2,"—"); ro.set(3,"—"); ro.set(4,F(truth,1)+" m"); ro.set(5,"—"); nt.set("Avec cette erreur, les deux visées ne se croisent plus : mesure impossible.","warn"); return; }
      var at=dv*Math.sin(bm*D2R)/Math.sin((am+bm)*D2R), bt=dv*Math.sin(am*D2R)/Math.sin((am+bm)*D2R);
      ro.set(1,F(Tm,1)+"°"); ro.set(2,F(at,1)+" m"); ro.set(3,F(bt,1)+" m"); ro.set(4,F(truth,1)+" m"); ro.set(5,F(at-truth,1)+" m ("+F(100*(at-truth)/truth,1)+" %)");
      nt.set(Math.abs(er.value)<1e-9?"Sans erreur de visée, la loi des sinus redonne exactement la distance réelle AT.":(Tm<20?"L'angle en T est petit : la mesure est très sensible à l'erreur. Allonge la base AB.":"Une erreur de "+F(Math.abs(er.value),1)+"° sur α fausse AT de "+F(Math.abs(at-truth),1)+" m."),Math.abs(er.value)<1e-9?"ok":"");
    });
  }
});

/* ---------- forces concourantes ---------- */
SFA.sim({
  id:"m4-c07-forces", ch:"c07", tag:"Manipuler",
  titre:"Deux forces, une résultante : tir à la corde",
  resume:"Deux forces F₁ et F₂ avec un angle φ entre elles : la résultante se calcule avec la loi des cosinus.",
  but:"Glisse la pointe de F₂ pour changer l'angle φ (et sa force), la pointe de F₁ pour changer F₁. Observe la résultante R (diagonale du parallélogramme) et la courbe R(φ) à côté. Pour quel angle R est-elle maximale ? Minimale ? Nulle ?",
  aRetenir:"R² = F₁² + F₂² + 2·F₁·F₂·cos φ (loi des cosinus dans le triangle des forces, où l'angle opposé à R vaut 180° − φ). R est maximale (F₁ + F₂) pour φ = 0° et minimale (|F₁ − F₂|) pour φ = 180°. Pour φ = 90°, c'est Pythagore.",
  piege:"R n'est pas F₁ + F₂ sauf si les forces sont alignées (φ = 0°). On additionne des vecteurs, pas des normes.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, D2R=Math.PI/180;
    var c=k.canvas(0,{ratio:.62});
    var f1=k.slider("Force F₁",50,500,10,300,"N");
    var f2=k.slider("Force F₂",50,500,10,400,"N");
    var ph=k.slider("Angle φ entre F₁ et F₂",0,180,1,60,"°");
    var ro=k.readouts(["R = √(F₁² + F₂² + 2F₁F₂cos φ)","Angle de R avec F₁","F₁ + F₂ (somme des normes)"]);
    var nt=k.note("","");
    var geo={};
    function Rf(A,B,p){ return Math.sqrt(Math.max(0,A*A+B*B+2*A*B*Math.cos(p*D2R))); }
    M.grab(c,function(){ if(!geo.sc) return []; var A=f1.value,B=f2.value,p=ph.value*D2R;
        return [{id:"f1",x:geo.ox+A*geo.sc,y:geo.oy,r:26},{id:"f2",x:geo.ox+B*geo.sc*Math.cos(p),y:geo.oy-B*geo.sc*Math.sin(p),r:26},{id:"g",x:geo.G(ph.value),y:geo.Y(Rf(f1.value,f2.value,ph.value)),r:24}]; },
      function(id,px,py){
        if(id==="f1") f1.set(M.clamp(Math.round((px-geo.ox)/geo.sc/10)*10,50,500));
        else if(id==="f2"){ var dx=px-geo.ox, dy=geo.oy-py; var ang=Math.atan2(dy,dx)/D2R; ph.set(M.clamp(Math.round(ang),0,180)); f2.set(M.clamp(Math.round(Math.hypot(dx,dy)/geo.sc/10)*10,50,500)); }
        else ph.set(M.clamp(Math.round((px-geo.gx0)/geo.gs),0,180));
        k.redraw(); });
    k.draw(function(){
      M.adapt(c,1.25,.62,560);
      var A=f1.value,B=f2.value,p=ph.value*D2R, W=c.W,H=c.H, narrow=W<560, ctx=c.ctx; c.clear();
      var dx0=0, dw=narrow?W:W*.6, dy0=0, dh=narrow?H*.56:H;
      var Rx=A+B*Math.cos(p), Ry=B*Math.sin(p), R=Math.hypot(Rx,Ry);
      var xmin=Math.min(0,B*Math.cos(p)), xmax=Math.max(A,Rx), ymax=Math.max(Ry,40);
      var sc=Math.min((dw-70)/(xmax-xmin),(dh-86)/ymax); sc=Math.min(sc,0.5);
      var ox=34-xmin*sc, oy=dh-34;
      geo.sc=sc; geo.ox=ox; geo.oy=oy;
      /* parallélogramme */
      var f1p=[ox+A*sc,oy], f2p=[ox+B*sc*Math.cos(p),oy-B*sc*Math.sin(p)], rp=[ox+Rx*sc,oy-Ry*sc];
      M.poly(c,[[ox,oy],f1p,rp,f2p],S.draw.tint(P.acc,.07));
      S.draw.line(c,f1p[0],f1p[1],rp[0],rp[1],P.grey,1.3,[4,4]); S.draw.line(c,f2p[0],f2p[1],rp[0],rp[1],P.grey,1.3,[4,4]);
      S.draw.arrow(c,ox,oy,f1p[0],f1p[1],P.red,3.4); S.draw.arrow(c,ox,oy,f2p[0],f2p[1],P.green,3.4);
      if(R>1e-6) S.draw.arrow(c,ox,oy,rp[0],rp[1],P.acc,4.8);
      S.draw.dot(c,ox,oy,4.5,P.ink);
      M.arc(c,ox,oy,30,0,p,P.amber,2.2); S.draw.text(c,"φ",ox+44*Math.cos(p/2),oy-44*Math.sin(p/2)-2,{size:13,color:P.amber});
      M.handle(c,f1p[0],f1p[1],P.red,7); M.handle(c,f2p[0],f2p[1],P.green,7);
      M.lab(c,"F₁ = "+F(A,0)+" N",f1p[0]-8,f1p[1]+22,P.red,{size:11.5}); M.lab(c,"F₂ = "+F(B,0)+" N",f2p[0]-(Math.cos(p)<0.2?0:0),f2p[1]-20,P.green,{size:11.5});
      if(R>1e-6) M.lab(c,"R",rp[0]+14,rp[1]-14,P.acc,{size:13});
      /* dynamomètre */
      S.draw.display(c,F(R,0),dw-62,dh-48,{w:104,h:50,caption:"R (newtons)"});
      /* courbe R(φ) */
      var gx0,gx1,gy0,gy1;
      if(!narrow){ gx0=dw+36; gx1=W-14; gy0=26; gy1=H-44; } else { gx0=44; gx1=W-14; gy0=dh+22; gy1=H-36; }
      var ymaxG=A+B, Y=function(v){return gy1-(v/ymaxG)*(gy1-gy0);}, gs=(gx1-gx0)/180, G=function(d){return gx0+d*gs;};
      geo.G=G; geo.Y=Y; geo.gx0=gx0; geo.gs=gs;
      S.draw.panel(c,gx0-34,gy0-22,gx1-gx0+46,gy1-gy0+58,{shadow:false});
      S.draw.text(c,"R en fonction de φ",gx0-26,gy0-10,{size:11,color:P.grey,align:"left"});
      S.draw.line(c,gx0,gy1,gx1,gy1,P.axis,1.3); S.draw.line(c,gx0,gy0,gx0,gy1,P.axis,1.3);
      [0,45,90,135,180].forEach(function(d){ S.draw.line(c,G(d),gy1-3,G(d),gy1+3,P.axis,1); S.draw.text(c,d+"°",G(d),gy1+14,{size:10.5,color:P.grey}); });
      S.draw.text(c,F(A+B,0),gx0-6,Y(A+B),{size:10.5,color:P.grey,align:"right"}); S.draw.text(c,F(Math.abs(A-B),0),gx0-6,Y(Math.abs(A-B)),{size:10.5,color:P.grey,align:"right"});
      S.draw.line(c,gx0,Y(A+B),gx1,Y(A+B),P.grid,1,[3,3]); S.draw.line(c,gx0,Y(Math.abs(A-B)),gx1,Y(Math.abs(A-B)),P.grid,1,[3,3]);
      ctx.save(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.6; ctx.beginPath(); for(var d=0;d<=180;d+=2){ var yy=Y(Rf(A,B,d)); d?ctx.lineTo(G(d),yy):ctx.moveTo(G(d),yy); } ctx.stroke(); ctx.restore();
      S.draw.line(c,G(ph.value),Y(R),G(ph.value),gy1,S.draw.tint(P.amber,.7),1.3,[3,3]);
      M.handle(c,G(ph.value),Y(R),P.red,7);
      var ang=Math.atan2(Ry,Rx)/D2R;
      ro.set(0,F(R,1)+" N"); ro.set(1,R<1e-6?"—":F(ang,1)+"°"); ro.set(2,F(A+B,0)+" N");
      var msg;
      if(ph.value===0) msg="φ = 0° : forces alignées dans le même sens. R = F₁ + F₂, c'est le tir à la corde d'une même équipe.";
      else if(ph.value===180) msg="φ = 180° : forces opposées. R = |F₁ − F₂| = "+F(Math.abs(A-B),0)+" N"+(A===B?" : équilibre, R = 0.":" : l'équipe la plus forte l'emporte.");
      else if(ph.value===90) msg="φ = 90° : R² = F₁² + F₂² (théorème de Pythagore).";
      else msg="R < F₁ + F₂ : les forces « se gênent » dès qu'elles ne sont pas alignées.";
      nt.set(msg,ph.value===0?"ok":"");
    });
  }
});
})();
