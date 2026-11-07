(function(){
var P = SFA.draw.palette, F = SFA.fmt, PI=Math.PI;
function gcd(a,b){ return b?gcd(b,a%b):a; }
function radStr(d){
  var n=Math.round(d/15);
  if(Math.abs(d-n*15)<1e-9){ var neg=n<0; n=Math.abs(n); if(n===0) return "0"; var g=gcd(n,12), num=n/g, den=12/g;
    return (neg?"−":"")+(num===1?"":num)+"π"+(den===1?"":"/"+den); }
  return F(d*PI/180,3)+" rad";
}
function quad(d){ var m=((d%360)+360)%360; if(m===0||m===90||m===180||m===270) return "sur un axe"; return m<90?"1er quadrant":(m<180?"2e quadrant":(m<270?"3e quadrant":"4e quadrant")); }
function arcAt(c,cx,cy,r,a0,a1,col,w){ var ctx=c.ctx; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=w||2; ctx.beginPath(); ctx.arc(cx,cy,r,-a0,-a1,a1>a0); ctx.stroke(); ctx.restore(); }

SFA.sim({
  id:"m4-c06-cercle", ch:"c06", tag:"Classique",
  titre:"Le cercle trigonométrique : cos et sin sont des coordonnées",
  resume:"Fais tourner un point sur le cercle de rayon 1 : ses coordonnées sont (cos θ ; sin θ).",
  but:"Fais glisser le point sur le cercle (ou le curseur). Lis cos θ sur l'axe horizontal, sin θ sur l'axe vertical. Quand sin θ vaut-il 1/2 ? Et cos θ ?",
  aRetenir:"Sur le cercle de rayon 1, le point d'angle θ a pour coordonnées (cos θ ; sin θ). Donc cos² θ + sin² θ = 1, et −1 ≤ cos θ, sin θ ≤ 1. La tangente tan θ = sin θ / cos θ se lit sur la droite x = 1.",
  piege:"cos est l'abscisse (horizontal) et sin l'ordonnée (vertical), pas l'inverse. tan θ n'existe pas pour θ = 90° et 270° (cos θ = 0).",
  build:function(k,S){
    var M=window.M4, c=k.canvas(0,{ratio:.9});
    var th=k.slider("Angle θ",0,360,1,30,"°");
    var mg=k.toggle("Aimanter aux angles remarquables (multiples de 15°)",false);
    var tg=k.toggle("Montrer la tangente (droite x = 1)",false);
    var ro=k.readouts(["θ en radians","cos θ","sin θ","tan θ","Quadrant","cos² + sin²"]);
    var nt=k.note("Fais glisser le point sur le cercle.","");
    var geo={}, goal=null, won=0;
    var GL=[["sin",0.5],["cos",0.5],["sin",-0.5],["cos",-0.5],["sin",0.866],["cos",0],["sin",1],["cos",-1],["sin",-0.707]];
    k.button("Défi : trouve θ",function(){ goal=GL[Math.floor(Math.random()*GL.length)]; },true);
    k.button("Arrêter le défi",function(){ goal=null; });
    c.pointer(function(t,p){ if(t==="move"||!geo.r) return; var a=Math.atan2(-(p.y-geo.cy),p.x-geo.cx)*180/PI; if(a<0)a+=360; if(mg.value) a=Math.round(a/15)*15%360; th.set(Math.round(a)); k.redraw(); });
    k.draw(function(){
      var d=th.value, a=d*PI/180, W=c.W,H=c.H, r=Math.min(W*.36,H*.4), cx=W/2-(tg.value?W*.06:0), cy=H/2; geo={cx:cx,cy:cy,r:r};
      c.clear(); var ctx=c.ctx;
      /* disque et quadrants */
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.fillStyle="#f2f5fb"; ctx.fill(); ctx.restore();
      var qd=Math.floor(((d%360)+360)%360/90); if(d%90!==0) M.sector(c,cx,cy,r,qd*90*PI/180,(qd+1)*90*PI/180,P.acc,.07);
      S.draw.line(c,cx-r*1.3,cy,cx+r*1.5,cy,P.grey,1.3); S.draw.line(c,cx,cy-r*1.3,cx,cy+r*1.3,P.grey,1.3);
      /* repères tous les 30° */
      for(var q=0;q<360;q+=30){ var qa=q*PI/180, big=q%90===0; ctx.strokeStyle=big?P.grey:"#b9c3d0"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx+r*Math.cos(qa)*.95,cy-r*Math.sin(qa)*.95); ctx.lineTo(cx+r*Math.cos(qa)*1.04,cy-r*Math.sin(qa)*1.04); ctx.stroke();
        if(c.W>420||big){ S.draw.text(c,radStr(q),cx+r*Math.cos(qa)*1.17,cy-r*Math.sin(qa)*1.17,{size:c.W<420?9.5:10.5,color:P.grey,weight:700}); } }
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.8; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.stroke();
      var px=cx+r*Math.cos(a), py=cy-r*Math.sin(a);
      if(tg.value){ S.draw.line(c,cx+r,cy-r*1.3,cx+r,cy+r*1.3,P.violet,1.5,[5,4]);
        if(Math.abs(Math.cos(a))>0.02){ var ty=cy-r*Math.tan(a); if(Math.abs(ty-cy)<r*1.3){ S.draw.line(c,cx,cy,cx+r,ty,P.violet,1.3,[3,3]); S.draw.line(c,cx+r,cy,cx+r,ty,P.violet,3); S.draw.dot(c,cx+r,ty,5,P.violet); } } }
      M.sector(c,cx,cy,r*.24,0,a,P.amber,.35); arcAt(c,cx,cy,r*.24,0,a,P.amber,2.5);
      S.draw.line(c,cx,cy,px,py,P.ink,2);
      S.draw.line(c,px,py,px,cy,P.red,3.2); S.draw.line(c,cx,cy,px,cy,P.green,3.2);
      var cs=Math.cos(a), sn=Math.sin(a); if(Math.abs(cs)<1e-12)cs=0; if(Math.abs(sn)<1e-12)sn=0;
      S.draw.line(c,ax0(px,cx),py,px,py,P.red,1,[3,3]);
      M.handle(c,px,py,P.ink,7);
      M.lab(c,"cos = "+F(cs,3),(cx+px)/2,cy+(sn>=0?16:-16),P.green,{size:11});
      M.lab(c,"sin = "+F(sn,3),px+(cs>=0?(c.W<420?44:52):-(c.W<420?44:52)),(py+cy)/2,P.red,{size:11});
      function ax0(a1,b1){ return b1; }
      S.draw.panel(c,8,8,128,28,{shadow:false});
      S.draw.text(c,"θ = "+d+"°  ("+radStr(d)+")",72,22,{size:12,weight:800,color:P.amber,align:"center"});
      ro.set(0,radStr(d)+(Math.abs(d-Math.round(d/15)*15)<1e-9?" ("+F(a,3)+")":"")); ro.set(1,F(cs,3)); ro.set(2,F(sn,3));
      ro.set(3,(d%180===90)?"non définie":F(sn/cs,3)); ro.set(4,quad(d)); ro.set(5,F(cs*cs+sn*sn,3));
      if(goal){ var v=goal[0]==="sin"?sn:cs, hit=Math.abs(v-goal[1])<0.012; if(hit&&!geo.done){} 
        nt.set("Défi : place le point pour que "+goal[0]+" θ = "+F(goal[1],goal[1]===0.866?3:(goal[1]===-0.707?3:1))+(hit?"  ✓ Bien vu ! Il y a souvent une 2e position : la trouves-tu ?":""),hit?"ok":"warn"); }
      else nt.set("cos θ est l'abscisse (vert), sin θ l'ordonnée (rouge). Active l'aimantation pour retrouver les valeurs remarquables.","");
    });
  }
});

/* ---------- enroulement ---------- */
SFA.sim({
  id:"m4-c06-enroulement", ch:"c06", tag:"Animation",
  titre:"Enrouler la droite réelle autour du cercle",
  resume:"Un nombre t sur la droite devient un arc de longueur t sur le cercle : c'est l'angle en radians.",
  but:"Fais varier t (curseur, ou glisse le repère sur la droite graduée). Le bouton « Dérouler / enrouler » montre la droite qui s'enroule : l'arc du cercle a pour longueur t. Quand fait-on un demi-tour ? Un tour complet ? Que se passe-t-il pour t négatif ?",
  aRetenir:"1 radian = angle qui intercepte un arc de longueur 1 sur le cercle de rayon 1. Un tour complet mesure 2π rad = 360°, donc π rad = 180° et 1 rad ≈ 57,3°. Le sens positif est antihoraire ; t et t + 2π désignent le même point.",
  piege:"π rad = 180°, pas 3,14°. Pour convertir : degrés = radians × 180/π. Ne confonds pas t = 2 (rad) avec un angle de 2°.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, PI=Math.PI, TW=2*PI;
    var c=k.canvas(0,{ratio:1});
    var t=k.slider("Nombre t",-7,14,0.05,4,"");
    var wr=k.slider("Enroulement",0,100,1,100,"%");
    var dir=1, lp=k.loop(function(dt){ var v=wr.value+dir*45*dt; if(v>=100){ v=100; lp.pause(); } if(v<=0){ v=0; lp.pause(); } wr.set(v); k.redraw(); });
    k.button("Dérouler / enrouler",function(){ if(wr.value>=99.9) dir=-1; else if(wr.value<=0.1) dir=1; else dir=dir; lp.play(); },true);
    k.button("t = π/2",function(){ t.set(PI/2); }); k.button("t = π",function(){ t.set(PI); }); k.button("t = 2π",function(){ t.set(TW); }); k.button("t = −π",function(){ t.set(-PI); });
    var ro=k.readouts(["t (rad)","Angle en degrés","Nombre de tours","t modulo 2π"]);
    var geo={};
    M.grab(c,function(){ if(!geo.r) return []; var T=t.value, a=T;
        return [{id:"line",x:geo.NX(T),y:geo.ny,r:26},{id:"pt",x:geo.cx+geo.r*Math.cos(a),y:geo.cy-geo.r*Math.sin(a),r:22}]; },
      function(id,px,py){ var T;
        if(id==="line") T=Math.round((px-geo.x0)/geo.sc*20)/20-7;
        else { var a=Math.atan2(-(py-geo.cy),px-geo.cx); T=a+TW*Math.round((t.value-a)/TW); }
        t.set(M.clamp(T,-7,14)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,1.08,.9,520);
      var T=t.value, w=wr.value/100, W=c.W,H=c.H, ctx=c.ctx; c.clear();
      var ny=H-30, r=Math.min(W*.27,(ny-52)*.34), cx=W*.42, cy=(ny-30)*.5+4;
      var x0=16, x1=W-16, sc=(x1-x0)/21, NX=function(v){return x0+(v+7)*sc;};
      geo={r:r,cx:cx,cy:cy,ny:ny,x0:x0,sc:sc,NX:NX};
      /* cercle et axes */
      S.draw.line(c,cx-r*1.35,cy,cx+r*1.6,cy,P.axis,1.2); S.draw.line(c,cx,cy-r*1.35,cx,cy+r*1.35,P.axis,1.2);
      ctx.save(); ctx.strokeStyle="#cfd6e0"; ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(cx,cy,r,0,TW); ctx.stroke(); ctx.restore();
      [[0,"0"],[PI/2,"π/2"],[PI,"π"],[3*PI/2,"3π/2"]].forEach(function(m){ var a=m[0], px=cx+(r+15)*Math.cos(a), py=cy-(r+13)*Math.sin(a); S.draw.line(c,cx+(r-4)*Math.cos(a),cy-(r-4)*Math.sin(a),cx+(r+4)*Math.cos(a),cy-(r+4)*Math.sin(a),P.grey,1.5);
        S.draw.text(c,m[1],px+(m[0]===0?6:0),py,{size:11,color:P.grey,math:true}); });
      S.draw.text(c,"1",cx+r/2,cy+11,{size:11,color:P.grey});
      /* corde qui s'enroule : arc de longueur w·|t| puis tangente de longueur (1 − w)·|t| */
      var sg=T>=0?1:-1, th=w*T, steps=Math.max(2,Math.ceil(Math.abs(th)/0.05));
      ctx.save(); ctx.strokeStyle=P.acc; ctx.lineWidth=4.2; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.beginPath();
      for(var i=0;i<=steps;i++){ var a=th*i/steps, rr=r*(1+0.035*Math.abs(a)/TW); i?ctx.lineTo(cx+rr*Math.cos(a),cy-rr*Math.sin(a)):ctx.moveTo(cx+rr,cy); } ctx.stroke(); ctx.restore();
      var rend=r*(1+0.035*Math.abs(th)/TW), ex=cx+rend*Math.cos(th), ey=cy-rend*Math.sin(th), rest=(1-w)*Math.abs(T)*r;
      var tx=-Math.sin(th)*sg, ty=-Math.cos(th)*sg*-1; /* direction dans le repère écran (y vers le bas) */
      var dX=-Math.sin(th)*sg, dY=-Math.cos(th)*sg;
      var px2=ex+dX*rest, py2=ey+dY*rest;
      if(rest>0.5){ ctx.save(); ctx.beginPath(); ctx.rect(0,0,W,ny-22); ctx.clip(); S.draw.line(c,ex,ey,px2,py2,P.acc,4.2); ctx.restore(); }
      /* le point */
      var onc=[cx+rend*Math.cos(th),cy-rend*Math.sin(th)];
      S.draw.line(c,cx,cy,onc[0],onc[1],P.ink,1.5);
      M.sector(c,cx,cy,r*.28,0,th*1,P.amber,.25); M.arc(c,cx,cy,r*.28,0,Math.max(-9,Math.min(9,th)),P.amber,2);
      var P0=[cx+r*Math.cos(T),cy-r*Math.sin(T)];
      if(w>=0.999) M.handle(c,P0[0],P0[1],P.red,8); else S.draw.dot(c,Math.max(8,Math.min(W-8,px2)),Math.max(8,Math.min(ny-30,py2)),6,P.red);
      M.lab(c,"arc = "+F(Math.abs(T)*w,2),cx,cy+r+28,P.acc,{size:11.5});
      /* droite réelle */
      S.draw.line(c,x0,ny,x1,ny,P.ink,2);
      for(var v=-7;v<=14;v++){ S.draw.line(c,NX(v),ny-4,NX(v),ny+4,P.ink,1); if(v%2===0) S.draw.text(c,String(v).replace("-","−"),NX(v),ny+16,{size:11,color:P.grey}); }
      [[PI,"π"],[TW,"2π"],[3*PI,"3π"],[4*PI,"4π"],[-PI,"−π"]].forEach(function(m){ S.draw.line(c,NX(m[0]),ny-9,NX(m[0]),ny+9,P.amber,2.4); S.draw.text(c,m[1],NX(m[0]),ny-19,{size:11.5,color:P.amber,math:true}); });
      S.draw.line(c,NX(0),ny,NX(T),ny,P.acc,5); M.handle(c,NX(T),ny,P.red,8);
      M.lab(c,"t = "+F(T,2),NX(T),ny-38,P.red,{size:11.5});
      ro.set(0,F(T,2)); ro.set(1,F(T*180/PI,1)+"°"); ro.set(2,F(T/TW,2)+" tour"+(Math.abs(T/TW)>=2?"s":""));
      var m=((T%TW)+TW)%TW; ro.set(3,F(m,2)+" ("+F(m*180/PI,1)+"°)");
    });
  }
});

/* ---------- angles associés ---------- */
SFA.sim({
  id:"m4-c06-angles-associes", ch:"c06", tag:"Symétries",
  titre:"Angles associés : π − x, π + x, −x, π/2 − x",
  resume:"Glisse le point x : ses quatre symétriques suivent, avec leurs cos et sin. Puis réponds au quiz.",
  but:"Fais glisser le point rouge x (entre 5° et 85°). Les points orange, violet, vert et turquoise sont ses images par des symétries : compare leurs coordonnées à celles de x. Ensuite, teste-toi avec le quiz : à quoi est égal cos ou sin de l'angle associé ?",
  aRetenir:"cos(π − x) = −cos x et sin(π − x) = sin x ; cos(π + x) = −cos x et sin(π + x) = −sin x ; cos(−x) = cos x et sin(−x) = −sin x ; cos(π/2 − x) = sin x et sin(π/2 − x) = cos x.",
  piege:"sin(π − x) = + sin x (et pas −sin x) : les deux angles ont la même ordonnée. Et sin(π + x) = −sin x. Dessine toujours le point avant d'écrire le signe.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, PI=Math.PI;
    var c=k.canvas(0,{ratio:.95});
    var x=k.slider("Angle x",5,85,1,30,"°");
    var sy=k.toggle("Montrer les symétries",true);
    var NAMES=["x","π − x","π + x","−x","π/2 − x"], COLS=[P.red,P.amber,P.violet,P.green,P.teal];
    var REL=[["cos x","sin x"],["−cos x","sin x"],["−cos x","−sin x"],["cos x","−sin x"],["sin x","cos x"]];
    var OPT=["cos x","−cos x","sin x","−sin x"];
    var q=null, score=0, tries=0, geo={};
    var nt=k.note("","");
    var qn=k.note("","");
    function newQ(){ q={i:1+Math.floor(Math.random()*4),f:Math.random()<.5?0:1,done:false}; }
    function ans(label){ if(!q||q.done) return; tries++; var good=REL[q.i][q.f]===label; if(good){ score++; q.done=true; } else q.wrong=label; }
    OPT.forEach(function(o){ k.button(o,function(){ ans(o); }); });
    k.button("Question suivante",function(){ newQ(); },true);
    newQ();
    M.grab(c,function(){ return geo.r?[{id:"x",x:geo.cx+geo.r*Math.cos(x.value*PI/180),y:geo.cy-geo.r*Math.sin(x.value*PI/180)}]:[]; },
      function(id,px,py){ var a=Math.atan2(-(py-geo.cy),px-geo.cx)*180/PI; if(a<0) a+=360; if(a>180) a=a>270?5:85; x.set(M.clamp(Math.round(a),5,85)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,1.02,.82,520);
      var X=x.value*PI/180, W=c.W,H=c.H, r=Math.min(W*.36,H*.38), cx=W/2, cy=H/2+2; geo={cx:cx,cy:cy,r:r};
      c.clear(); var ctx=c.ctx;
      var ang=[X,PI-X,PI+X,-X,PI/2-X];
      var pt=function(a){ return [cx+r*Math.cos(a),cy-r*Math.sin(a)]; };
      /* axes et cercle */
      S.draw.line(c,cx-r*1.22,cy,cx+r*1.22,cy,P.axis,1.3); S.draw.line(c,cx,cy-r*1.22,cx,cy+r*1.22,P.axis,1.3);
      ctx.save(); ctx.fillStyle="rgba(30,63,143,.04)"; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.fill(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.4; ctx.stroke(); ctx.restore();
      S.draw.text(c,"1",cx+r+8,cy+11,{size:11,color:P.grey}); S.draw.text(c,"−1",cx-r-10,cy+11,{size:11,color:P.grey}); S.draw.text(c,"1",cx-9,cy-r-3,{size:11,color:P.grey}); S.draw.text(c,"−1",cx-12,cy+r+4,{size:11,color:P.grey});
      /* symétries */
      if(sy.value){ var a0=pt(ang[0]);
        [[1,"axe des y"],[3,"axe des x"],[2,"centre O"]].forEach(function(m){ var b=pt(ang[m[0]]); S.draw.line(c,a0[0],a0[1],b[0],b[1],S.draw.tint(COLS[m[0]],.45),1.4,[4,4]); });
        var b4=pt(ang[4]); S.draw.line(c,a0[0],a0[1],b4[0],b4[1],S.draw.tint(COLS[4],.45),1.4,[4,4]); S.draw.line(c,cx-r*1.05,cy+r*1.05,cx+r*1.05,cy-r*1.05,"rgba(14,127,150,.35)",1,[2,4]);
        S.draw.text(c,"y = x",cx+r*1.05+2,cy-r*1.05-2,{size:10.5,color:P.teal,align:"left"}); }
      /* point mis en évidence (quiz) : projections */
      var hi=q?q.i:0, hp=pt(ang[hi]);
      var hc=COLS[hi], co=Math.cos(ang[hi]), si=Math.sin(ang[hi]);
      S.draw.line(c,hp[0],hp[1],hp[0],cy,hc,2,[5,3]); S.draw.line(c,hp[0],hp[1],cx,hp[1],hc,2,[5,3]);
      S.draw.line(c,cx,cy,hp[0],cy,P.green,4.5); S.draw.line(c,cx,cy,cx,hp[1],P.red,4.5);
      M.lab(c,"cos = "+F(co,3),(cx+hp[0])/2,cy+(si>=0?17:-17),P.green,{size:11}); M.lab(c,"sin = "+F(si,3),cx+(co>=0?-8:8)+(co>=0?-34:34),(cy+hp[1])/2,P.red,{size:11});
      /* rayons et points */
      ang.forEach(function(a,i){ var p=pt(a); S.draw.line(c,cx,cy,p[0],p[1],COLS[i],i?1.5:2.4,i?[4,3]:null); });
      ang.forEach(function(a,i){ var p=pt(a); if(i===0) M.handle(c,p[0],p[1],COLS[0],8); else S.draw.dot(c,p[0],p[1],6.5,COLS[i]);
        var dx=Math.cos(a)>=0?1:-1, dy=Math.sin(a)>=0?-1:1; M.lab(c,NAMES[i],p[0]+dx*26,p[1]+dy*14,COLS[i],{size:11.5}); });
      S.draw.dot(c,cx,cy,3.5,P.ink);
      /* tableau */
      var rows="<table style='width:100%;border-collapse:collapse;font-size:12.5px;line-height:1.5'><tr style='text-align:left;color:#5f6b7a'><th>Angle</th><th>cos</th><th>sin</th><th>cos =</th><th>sin =</th></tr>";
      ang.forEach(function(a,i){ rows+="<tr><td style='color:"+COLS[i]+";font-weight:800'>"+NAMES[i]+"</td><td>"+F(Math.cos(a),3)+"</td><td>"+F(Math.sin(a),3)+"</td><td><b>"+REL[i][0]+"</b></td><td><b>"+REL[i][1]+"</b></td></tr>"; });
      nt.set(rows+"</table>","");
      /* quiz */
      var f=q.f?"sin":"cos", html="<b>Quiz ("+score+" bonne"+(score>1?"s":"")+" / "+tries+")</b> — le point "+"<b style='color:"+COLS[q.i]+"'>"+NAMES[q.i]+"</b> : "+f+"("+NAMES[q.i]+") = ?";
      if(q.done) qn.set(html+"<br>✅ Oui : "+f+"("+NAMES[q.i]+") = "+REL[q.i][q.f]+". Regarde la longueur colorée sur l'axe, elle l'illustre.","ok");
      else if(q.wrong) qn.set(html+"<br>❌ Pas "+q.wrong+". Regarde le signe de la coordonnée du point "+NAMES[q.i]+" sur le cercle, puis réessaie.","bad");
      else qn.set(html,"");
    });
  }
});

/* ---------- sinusoïde ---------- */
SFA.sim({
  id:"m4-c06-sinusoide", ch:"c06", tag:"Animation",
  titre:"La sinusoïde naît du cercle",
  resume:"Un point tourne : sa hauteur trace la courbe de sin θ. La période est 2π.",
  but:"Regarde le point tourner (ou fais-le glisser sur le cercle, ou sur la courbe). À gauche, le point tourne sur le cercle ; à droite, sa hauteur (sin θ) est reportée en fonction de θ. Active cos pour comparer : même courbe, décalée.",
  aRetenir:"La courbe de sin θ se répète tous les 2π (période 2π) ; ses valeurs restent entre −1 et 1. cos a la même forme, décalée de π/2 : cos θ = sin(θ + π/2).",
  piege:"Ne confonds pas l'angle (axe horizontal du graphe, en radians) et la valeur sin θ (axe vertical). La période se lit sur l'axe des angles : 2π ≈ 6,28.",
  build:function(k,S){
    var M=window.M4, P=S.draw.palette, F=S.fmt, PI=Math.PI;
    var c=k.canvas(0,{ratio:.52});
    var NARROW=.68;
    var th=k.slider("Angle θ",0,720,1,40,"°");
    var tc=k.toggle("Afficher aussi cos θ (vert)",false);
    var lp=k.loop(function(dt){ var v=th.value+55*dt; if(v>720) v=0; th.set(v); k.redraw(); });
    k.button("Animer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    var ro=k.readouts(["θ (rad)","sin θ","cos θ","Période"]);
    var geo={};
    M.grab(c,function(){ if(!geo.r) return []; var a=th.value*PI/180; return [{id:"c",x:geo.cx+geo.r*Math.cos(a),y:geo.cy-geo.r*Math.sin(a)},{id:"g",x:geo.G(a),y:geo.Y(Math.sin(a))}]; },
      function(id,px,py){ lp.pause(); var d;
        if(id==="c"){ var a=Math.atan2(-(py-geo.cy),px-geo.cx)*180/PI; if(a<0) a+=360; var cur=th.value; d=a+360*Math.round((cur-a)/360); }
        else d=(px-geo.gx0)/geo.gs*180/PI;
        th.set(M.clamp(Math.round(d),0,720)); k.redraw(); });
    k.draw(function(){
      M.adapt(c,NARROW,.52,520);
      var d=th.value, a=d*PI/180, W=c.W,H=c.H, narrow=W<520;
      var r=Math.min(W*(narrow?.15:.15),H*.33), cx=r+22, cy=H/2-8; c.clear(); var ctx=c.ctx;
      var gx0=cx+r*1.45+(narrow?16:34), gx1=W-12, gs=(gx1-gx0)/(4*PI), Y=function(v){return cy-v*r;}, G=function(u){return gx0+u*gs;};
      geo={r:r,cx:cx,cy:cy,gx0:gx0,gs:gs,Y:Y,G:G};
      /* cercle */
      ctx.save(); ctx.fillStyle="rgba(30,63,143,.05)"; ctx.beginPath(); ctx.arc(cx,cy,r,0,2*PI); ctx.fill(); ctx.strokeStyle=P.acc; ctx.lineWidth=2.2; ctx.stroke(); ctx.restore();
      S.draw.line(c,cx-r*1.2,cy,cx+r*1.2,cy,P.axis,1.2); S.draw.line(c,cx,cy-r*1.25,cx,cy+r*1.25,P.axis,1.2);
      M.sector(c,cx,cy,r*.3,0,a%(2*PI),P.amber,.3);
      /* graphe */
      for(var v=-1;v<=1;v+=0.5) S.draw.line(c,gx0,Y(v),gx1,Y(v),v===0?P.axis:P.grid,v===0?1.3:1);
      for(var m=1;m<=4;m++){ S.draw.line(c,G(m*PI),cy-r*1.2,G(m*PI),cy+r*1.2,P.grid,1); }
      S.draw.line(c,gx0,Y(1.3),gx0,Y(-1.3),P.axis,1.3);
      [0,1,2,3,4].forEach(function(mm){ S.draw.text(c,mm===0?"0":(mm===1?"π":mm+"π"),G(mm*PI),cy+r*1.32+4,{size:11,color:P.grey,math:true}); });
      S.draw.text(c,"1",gx0-8,Y(1),{size:11,color:P.grey}); S.draw.text(c,"−1",gx0-11,Y(-1),{size:11,color:P.grey});
      /* période */
      var yb=Y(-1.62); S.draw.line(c,G(0),yb,G(2*PI),yb,P.amber,1.6); S.draw.line(c,G(0),yb-4,G(0),yb+4,P.amber,1.6); S.draw.line(c,G(2*PI),yb-4,G(2*PI),yb+4,P.amber,1.6);
      S.draw.text(c,"période 2π",G(PI),yb+(narrow?11:12),{size:11,color:P.amber,math:true});
      function plot(fn,col,fill){ ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=2.8; ctx.lineJoin="round"; ctx.beginPath(); for(var u=0;u<=a+1e-9;u+=0.03){ var xx=G(u), yy=Y(fn(u)); u===0?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy); } ctx.lineTo(G(a),Y(fn(a))); ctx.stroke(); ctx.restore(); }
      if(tc.value) plot(Math.cos,P.green);
      plot(Math.sin,P.red);
      var px=cx+r*Math.cos(a), py=Y(Math.sin(a));
      /* projection sur l'axe vertical puis lien horizontal vers la courbe */
      S.draw.line(c,cx,cy,px,py,P.ink,1.6);
      S.draw.line(c,px,py,px,cy,"rgba(36,119,90,.55)",1.4,[3,3]);
      S.draw.line(c,cx,cy,cx,py,P.red,4); 
      S.draw.line(c,px,py,G(a),py,P.red,1.4,[4,3]);
      if(tc.value) { S.draw.line(c,cx,cy,px,cy,P.green,4); S.draw.dot(c,G(a),Y(Math.cos(a)),5.5,P.green); }
      M.handle(c,px,py,P.ink,7); M.handle(c,G(a),py,P.red,7);
      M.lab(c,"sin θ = "+F(Math.sin(a),2),G(a)+(a>PI*3.4?-50:56),py+(Math.sin(a)>=0?-17:17),P.red,{size:11});
      ro.set(0,F(a,2)); ro.set(1,F(Math.sin(a),3)); ro.set(2,F(Math.cos(a),3)); ro.set(3,"2π ≈ 6,283");
    });
    lp.play();
  }
});

/* ---------- manège ---------- */
SFA.sim({
  id:"m4-c06-manege", ch:"c06", tag:"Niche",
  titre:"Manège : vitesse angulaire, arc et hauteur",
  resume:"Une nacelle tourne à ω rad/s : angle θ = ωt, arc s = R·θ, hauteur h(t) = R(1 − cos θ).",
  but:"Règle la vitesse angulaire ω et le rayon R, puis lance le manège. Observe l'angle en radians, la longueur d'arc parcourue et la hauteur de la nacelle au cours du temps.",
  aRetenir:"Angle θ = ω·t (en rad). Longueur de l'arc s = R·θ (θ en radians !). Vitesse linéaire v = ω·R. Période T = 2π/ω. Hauteur au-dessus du point bas : h = R(1 − cos θ).",
  piege:"La formule s = R·θ n'est vraie qu'avec θ en radians. Avec θ en degrés, il faut d'abord convertir : s = R·θ·π/180.",
  build:function(k,S){
    var c=k.canvas(0,{ratio:1.1});
    var w=k.slider("Vitesse angulaire ω",0.2,3,0.1,1,"rad/s");
    var R=k.slider("Rayon R",2,8,1,5,"m");
    var t=k.slider("Temps t",0,20,0.1,0,"s");
    var lp=k.loop(function(dt){ var v=t.value+dt; if(v>20) v=0; t.set(v); k.redraw(); });
    k.button("Lancer / pause",function(){ if(lp.running) lp.pause(); else lp.play(); },true);
    var ro=k.readouts(["θ = ωt","Arc s = R·θ","Vitesse v = ω·R","Période T = 2π/ω","Hauteur h"]);
    k.draw(function(){
      var Om=w.value,Rr=R.value,T=t.value, th=Om*T, W=c.W,H=c.H; c.clear(); var ctx=c.ctx;
      var rp=Math.min(W*.3,H*.2), cx=W/2, cy=H*.24;
      ctx.strokeStyle=P.acc; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(cx,cy,rp,0,2*PI); ctx.stroke();
      S.draw.line(c,cx-rp*1.3,cy+rp,cx+rp*1.3,cy+rp,P.grey,1.5);
      /* angle mesuré depuis le point bas, sens antihoraire */
      var a=th-PI/2; var px=cx+rp*Math.cos(a), py=cy-rp*Math.sin(a)*-1; /* sin(a) sens écran */
      px=cx+rp*Math.sin(th); py=cy+rp*Math.cos(th);
      var thm=th%(2*PI); ctx.save(); ctx.strokeStyle=P.amber; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(cx,cy,rp,PI/2,PI/2-thm,true); ctx.stroke(); ctx.restore();
      S.draw.line(c,cx,cy,px,py,P.ink,1.5); S.draw.dot(c,px,py,8,P.red);
      S.draw.text(c,"point bas",cx,cy+rp+14,{size:12,color:P.grey});
      /* graphe h(t) */
      var ax=S.draw.axes(c,{x0:0,x1:20,y0:0,y1:2*Rr*1.1,xl:"t (s)",yl:"h (m)",t:H*.5,b:30,stepX:5});
      S.draw.fn(c,ax,function(u){return Rr*(1-Math.cos(Om*u));},P.acc,2.4);
      var h=Rr*(1-Math.cos(th)); S.draw.dot(c,ax.X(T),ax.Y(h),7,P.red);
      ro.set(0,F(th,2)+" rad"); ro.set(1,F(Rr*th,1)+" m"); ro.set(2,F(Om*Rr,2)+" m/s"); ro.set(3,F(2*PI/Om,2)+" s"); ro.set(4,F(h,2)+" m");
    });
  }
});
})();
