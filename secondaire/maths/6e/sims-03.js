/* Chapitre 3 : primitives */
SFA.sim({
  id:"m6-c03-famille", ch:"c03", tag:"Classique",
  titre:"Une fonction, une infinité de primitives",
  resume:"Change la constante C : les courbes glissent verticalement, mais les tangentes restent parallèles.",
  but:"Choisis f, puis glisse la courbe bleue vers le haut ou le bas (ou règle C). Observe que toutes les primitives ont la même pente à la même abscisse : les tangentes sont parallèles.",
  aRetenir:"Si F est une primitive de f, alors toutes les primitives de f sont F + C (C constante réelle). Elles se déduisent l'une de l'autre par translation verticale, et leurs tangentes en une même abscisse sont parallèles, de pente f(x).",
  piege:"Oublier « + C » : sans la constante, on n'écrit qu'<i>une</i> primitive et pas la famille. Pour vérifier ta primitive, dérive-la : tu dois retrouver f.",
  build:function(k,S){
    var c=M6.canvas(k,.78,330), P=S.draw.palette;
    var D={
      a:{lab:"f(x) = 2x",f:function(x){return 2*x;},F:function(x){return x*x;},ex:"x²"},
      b:{lab:"f(x) = x² − 1",f:function(x){return x*x-1;},F:function(x){return x*x*x/3-x;},ex:"x³/3 − x"},
      c:{lab:"f(x) = cos x",f:function(x){return Math.cos(x);},F:function(x){return Math.sin(x);},ex:"sin x"},
      d:{lab:"f(x) = eˣ",f:function(x){return Math.exp(x);},F:function(x){return Math.exp(x);},ex:"eˣ"}
    };
    var sel=k.select("Fonction f",[["a","2x"],["b","x² − 1"],["c","cos x"],["d","eˣ"]],"a");
    var C=k.slider("Constante C",-4,4,0.5,0,"",null);
    var xt=k.slider("Abscisse des tangentes",-2,2,0.1,1,"",null);
    var fam=k.toggle("Montrer d'autres primitives (C = −3 … 3)",true);
    var ro=k.readouts(["Primitive","F(x) en x","Pente = f(x)","Tangentes"]);
    var ax=null;
    k.draw(function(){
      c.clear(); var d=D[sel.value], cc=C.value, x0=xt.value, fs=M6.fs(c,12);
      ax=S.draw.axes(c,{x0:-3,x1:3,y0:-6,y1:6,xl:"x",yl:"y",stepX:1,stepY:2});
      if(fam.value){ for(var j=-3;j<=3;j++){ if(j===cc) continue; S.draw.fn(c,ax,function(x){return d.F(x)+j;},"#c3cde6",1.5); } }
      S.draw.fn(c,ax,d.f,P.green,2,[6,4]);
      S.draw.fn(c,ax,function(x){return d.F(x)+cc;},P.mat,3.4);
      var m=d.f(x0), dxp=ax.X(x0+1)-ax.X(x0), dyp=-(ax.Y(m)-ax.Y(0)), nrm=Math.hypot(dxp,dyp)||1, ux=dxp/nrm*26, uy=dyp/nrm*26;
      S.draw.line(c,ax.X(x0),ax.T,ax.X(x0),ax.B,"#9aa5b5",1,[3,4]);
      var list=fam.value?[-3,-2,-1,0,1,2,3]:[cc]; if(list.indexOf(cc)<0) list.push(cc);
      list.forEach(function(j){ var y=d.F(x0)+j, px=ax.X(x0), py=ax.Y(y); if(py<ax.T||py>ax.B) return; S.draw.line(c,px-ux,py-uy,px+ux,py+uy,P.red,1.8); S.draw.dot(c,px,py,j===cc?0:3,P.red); });
      M6.handle(S,c,ax.X(x0),ax.Y(d.F(x0)+cc),P.mat,false,8);
      S.draw.legend(c,[[P.green,"f (pointillés)",true],[P.mat,"F + C (gras)"],[P.red,"tangentes : même pente"]],ax.L+8,ax.T+6);
      ro.set(0,"F(x) = "+d.ex+(cc===0?"":(cc>0?" + ":" − ")+S.fmt(Math.abs(cc),1)));
      ro.set(1,S.fmt(d.F(x0)+cc,3)); ro.set(2,S.fmt(m,3)); ro.set(3,fam.value?"parallèles":"une seule");
    });
    M6.drag(c,function(){ if(!ax) return []; var d=D[sel.value]; return [{x:ax.X(xt.value),y:ax.Y(d.F(xt.value)+C.value)}]; },function(i,p){ var d=D[sel.value], x=M6.clamp(Math.round(ax.ix(p.x)*10)/10,-2,2); xt.set(x); C.set(M6.clamp(Math.round((ax.iy(p.y)-d.F(x))*2)/2,-4,4)); k.redraw(); },{r:30});
  }
});

SFA.sim({
  id:"m6-c03-reconstruire", ch:"c03", tag:"Classique",
  titre:"Dessine f, la primitive F se construit toute seule",
  resume:"Déplace les points de la courbe f : F monte quand f est positive, descend quand f est négative.",
  but:"Fais glisser les points rouges verticalement (en haut). En bas, la primitive F (de valeur initiale réglable) se recalcule instantanément. Défi : rends l'aire algébrique de 0 à 6 égale à 0.",
  aRetenir:"F'(x) = f(x) : F augmente là où f &gt; 0, diminue là où f &lt; 0, et possède un extremum là où f change de signe. La valeur F(b) − F(a) est l'aire algébrique entre f et l'axe de a à b.",
  piege:"Le signe de f donne le <i>sens de variation</i> de F, pas le signe de F. F peut être négative alors que f est positive (si F part de très bas).",
  build:function(k,S){
    var c=M6.canvas(k,1.05,420), P=S.draw.palette;
    var F0=k.slider("Valeur initiale F(0)",-3,3,0.5,0,"",null);
    var xc=k.slider("Curseur x (aire cumulée)",0,6,0.1,3,"",null);
    var pre={s:[1,2,2,0.5,-1,-2,-1],c:[0,1.6,2,1.6,0,-1.6,-2],p:[0.5,1,1.5,2,2,1.5,1],z:[1.5,1.5,1.5,-1.5,-1.5,-1.5,-1.5]};
    var ys=pre.s.slice();
    k.button("Courbe d'origine",function(){ ys=pre.s.slice(); });
    k.button("Aire totale nulle",function(){ ys=pre.z.slice(); });
    k.button("Toujours positive",function(){ ys=pre.p.slice(); });
    var ro=k.readouts(["F(x) au curseur","Aire algébrique de 0 à x","F(6)","Extremums de F"]);
    var nt=k.note("","warn"), drag=-1, g=null;
    function f(x){ var i=Math.min(5,Math.max(0,Math.floor(x))); var t=x-i; return ys[i]*(1-t)+ys[i+1]*t; }
    var FS=[];
    function build(){ var h=0.05, s=F0.value; FS=[s]; for(var i=0;i<120;i++){ s+=(f(i*h)+f((i+1)*h))/2*h; FS.push(s); } }
    function Fv(x){ var i=M6.clamp(x/0.05,0,120), a=Math.floor(i), b=Math.min(120,a+1); return FS[a]+(FS[b]-FS[a])*(i-a); }
    function sub(off,h){ return {W:c.W,H:h,ctx:c.ctx,clear:c.clear}; }
    k.draw(function(){
      build(); c.clear(); var ctx=c.ctx, H=c.H, W=c.W, h1=Math.round(H*0.44), h2=H-h1-6, fs=M6.fs(c,12), X=xc.value;
      /* panneau du haut : f */
      var s1=sub(0,h1), axf=S.draw.axes(s1,{x0:0,x1:6,y0:-3,y1:3,xl:"x",yl:"f(x)",stepX:1,stepY:1,b:26});
      var n=Math.max(4,Math.round(X/0.05)), i;
      [[1,P.green,0.3],[-1,P.red,0.28]].forEach(function(q){ ctx.save(); ctx.beginPath(); if(q[0]>0) ctx.rect(axf.L,axf.T,axf.R-axf.L,axf.Y(0)-axf.T); else ctx.rect(axf.L,axf.Y(0),axf.R-axf.L,axf.B-axf.Y(0)); ctx.clip();
        ctx.beginPath(); ctx.moveTo(axf.X(0),axf.Y(0)); for(i=0;i<=n;i++){ var xx=X*i/n; ctx.lineTo(axf.X(xx),axf.Y(f(xx))); } ctx.lineTo(axf.X(X),axf.Y(0)); ctx.closePath(); ctx.fillStyle=S.draw.tint(q[1],q[2]); ctx.fill(); ctx.restore(); });
      for(i=0;i<6;i++) S.draw.line(c,axf.X(i),axf.Y(ys[i]),axf.X(i+1),axf.Y(ys[i+1]),P.green,3.2);
      ys.forEach(function(y,i){ M6.handle(S,c,axf.X(i),axf.Y(y),P.red,drag===i,8); });
      S.draw.label(c,"tire les points rouges",axf.R-6,axf.T+10,{align:"right",size:fs,color:P.red});
      /* panneau du bas : F */
      ctx.save(); ctx.translate(0,h1+6);
      var s2=sub(0,h2), fl=Math.min.apply(null,FS), fh=Math.max.apply(null,FS), fp=(fh-fl)*0.1+0.5;
      var axF=S.draw.axes(s2,{x0:0,x1:6,y0:Math.min(-2,fl-fp),y1:Math.max(2,fh+fp),xl:"x",yl:"F(x)",stepX:1,b:26});
      S.draw.area(s2,axF,function(x){return Fv(x);},0,X,P.mat,0.1);
      S.draw.fn(s2,axF,function(x){return Fv(x);},P.mat,3.2);
      var ext=[];
      for(var j=0;j<6;j++){ var a=ys[j],b=ys[j+1]; if(a*b<0){ var z=j+a/(a-b); ext.push({x:z,y:Fv(z),mx:a>0}); } else if(a===0&&j>0&&ys[j-1]*b<0){ ext.push({x:j,y:Fv(j),mx:ys[j-1]>0}); } }
      ext.forEach(function(e){ S.draw.dot(s2,axF.X(e.x),axF.Y(e.y),7,P.violet); S.draw.label(s2,e.mx?"max":"min",axF.X(e.x)+9,axF.Y(e.y)+(e.mx?-14:16),{size:fs,color:P.violet,align:"left"}); });
      M6.handle(S,s2,axF.X(X),axF.Y(Fv(X)),P.amber,false,7);
      S.draw.line(s2,axF.X(0),axF.Y(F0.value),axF.X(X),axF.Y(F0.value),P.grey,1,[3,3]);
      ctx.restore();
      /* trait de liaison entre les deux panneaux */
      S.draw.line(c,axf.X(X),axf.Y(f(X)),axf.X(X),h1+6+axF.Y(Fv(X)),P.amber,1.4,[4,4]); M6.handle(S,c,axf.X(X),axf.Y(f(X)),P.amber,false,6);
      g={axf:axf,axF:axF,h1:h1};
      var area=Fv(6)-F0.value;
      ro.set(0,S.fmt(Fv(X),2)); ro.set(1,S.fmt(Fv(X)-F0.value,2)); ro.set(2,S.fmt(Fv(6),2)); ro.set(3,ext.length?ext.map(function(e){return (e.mx?"max ":"min ")+"en x ≈ "+S.fmt(e.x,2);}).join(" ; "):"aucun");
      if(Math.abs(area)<0.05) nt.set("Défi réussi : l'aire algébrique de 0 à 6 vaut "+S.fmt(area,2)+" : les parties vertes et rouges se compensent exactement, donc F(6) = F(0).","ok");
      else nt.set("Défi : rends l'aire algébrique de 0 à 6 égale à 0 (actuellement "+S.fmt(area,2)+"). Les aires vertes comptent +, les rouges −.","warn");
    });
    c.pointer(function(type,p){
      if(!g) return;
      if(type==="down"){ var best=-1,bd=34; ys.forEach(function(y,i){ var d=Math.hypot(g.axf.X(i)-p.x,g.axf.Y(y)-p.y); if(d<bd){bd=d;best=i;} }); drag=best; if(best<0&&p.y<g.h1){ xc.set(M6.clamp(Math.round(g.axf.ix(p.x)*10)/10,0,6)); k.redraw(); } }
      if((type==="down"||type==="drag")&&drag>=0){ ys[drag]=M6.clamp(Math.round(g.axf.iy(p.y)*10)/10,-3,3); k.redraw(); }
      if((type==="drag")&&drag<0){ xc.set(M6.clamp(Math.round((p.y<g.h1?g.axf.ix(p.x):g.axF.ix(p.x))*10)/10,0,6)); k.redraw(); }
      if(type==="up") drag=-1;
      if(type==="move"){ var near=ys.some(function(y,i){ return Math.hypot(g.axf.X(i)-p.x,g.axf.Y(y)-p.y)<30; }); c.cv.style.cursor=near?"ns-resize":"default"; }
    });
  }
});

SFA.sim({
  id:"m6-c03-condition-initiale", ch:"c03", tag:"Condition initiale",
  titre:"Une seule primitive passe par ton point",
  resume:"Clique pour choisir un point : la constante C est calculée et une seule courbe est retenue.",
  but:"Choisis f, puis clique ou glisse sur le graphique pour placer le point A(x₀ ; y₀). La primitive F qui passe par A est tracée en gras.",
  aRetenir:"Pour trouver la primitive qui vérifie F(x₀) = y₀ : 1) trouve une primitive G ; 2) écris F = G + C ; 3) résous G(x₀) + C = y₀, donc C = y₀ − G(x₀). Il y a toujours une seule solution quand f est continue sur un intervalle.",
  piege:"Pour f(x) = 1/x, la primitive est ln|x| + C : sur ]0 ; +∞[ on écrit ln x + C. Ici la simulation reste sur x &gt; 0.",
  build:function(k,S){
    var c=M6.canvas(k,.78,330), P=S.draw.palette;
    var D={
      a:{lab:"2x + 1",F:function(x){return x*x+x;},ex:"x² + x",x0:-3,x1:3,y0:-6,y1:8},
      b:{lab:"cos x",F:function(x){return Math.sin(x);},ex:"sin x",x0:-3,x1:3,y0:-4,y1:4},
      c:{lab:"e^(−x)",F:function(x){return -Math.exp(-x);},ex:"−e^(−x)",x0:-1,x1:4,y0:-5,y1:3},
      d:{lab:"1/x (x > 0)",F:function(x){return Math.log(x);},ex:"ln x",x0:0,x1:6,y0:-4,y1:4}
    };
    var sel=k.select("Fonction f",[["a","2x + 1"],["b","cos x"],["c","e^(−x)"],["d","1/x (x > 0)"]],"a");
    var ro=k.readouts(["Point A","Primitive G","Constante C","F(x) complète"]);
    var pt={x:1,y:1}, ax=null, nt=k.note("Clique dans le graphique pour déplacer A.","ok");
    k.button("Placer A en (0 ; 0)",function(){ pt.x=sel.value==="d"?1:0; pt.y=0; });
    k.draw(function(){
      c.clear(); var d=D[sel.value], fs=M6.fs(c,12);
      ax=S.draw.axes(c,{x0:d.x0,x1:d.x1,y0:d.y0,y1:d.y1,xl:"x",yl:"y"});
      if(sel.value==="d"&&pt.x<=0.05) pt.x=0.05;
      pt.x=Math.max(d.x0+(sel.value==="d"?0.05:0),Math.min(d.x1,pt.x)); pt.y=Math.max(d.y0,Math.min(d.y1,pt.y));
      for(var j=-8;j<=8;j++){ S.draw.fn(c,ax,function(x){return d.F(x)+j;},"#d3dbee",1.4); }
      var C=pt.y-d.F(pt.x);
      S.draw.fn(c,ax,function(x){return d.F(x)+C;},P.mat,3.6);
      S.draw.line(c,ax.X(pt.x),ax.Y(pt.y),ax.X(pt.x),ax.Y(0),P.red,1,[3,3]); S.draw.line(c,ax.X(pt.x),ax.Y(pt.y),ax.X(0<d.x0?d.x0:0),ax.Y(pt.y),P.red,1,[3,3]);
      M6.handle(S,c,ax.X(pt.x),ax.Y(pt.y),P.red,false,8);
      S.draw.label(c,"A ("+S.fmt(pt.x,1)+" ; "+S.fmt(pt.y,1)+")",ax.X(pt.x)+14,ax.Y(pt.y)-16,{color:P.red,align:"left",size:fs});
      var sg=C<0?" − ":" + ", Cs=S.fmt(Math.abs(C),2);
      S.draw.label(c,"F(x) = "+d.ex+(Math.abs(C)<0.005?"":sg+Cs),ax.R-6,ax.B-16,{color:P.mat,align:"right",size:M6.fs(c,13),math:true});
      ro.set(0,"("+S.fmt(pt.x,2)+" ; "+S.fmt(pt.y,2)+")"); ro.set(1,d.ex); ro.set(2,S.fmt(C,3));
      ro.set(3,"F(x) = "+d.ex+(Math.abs(C)<0.005?"":sg+Cs));
      nt.set("Vérification : G(x₀) + C = "+S.fmt(d.F(pt.x),3)+" "+(C<0?"−":"+")+" "+S.fmt(Math.abs(C),3)+" = "+S.fmt(d.F(pt.x)+C,3)+" = y₀ ✓","ok");
    });
    function put(p){ var d=D[sel.value]; pt.x=Math.round(ax.ix(p.x)*10)/10; pt.y=Math.round(ax.iy(p.y)*10)/10; if(sel.value==="d"&&pt.x<0.1) pt.x=0.1; pt.x=Math.max(d.x0,Math.min(d.x1,pt.x)); pt.y=Math.max(d.y0,Math.min(d.y1,pt.y)); k.redraw(); }
    c.pointer(function(type,p){ if((type==="down"||type==="drag")&&ax) put(p); if(type==="move") c.cv.style.cursor="crosshair"; });
  }
});

SFA.sim({
  id:"m6-c03-vitesse-trajet", ch:"c03", tag:"Niche utile",
  titre:"Du compteur de vitesse à la distance parcourue",
  resume:"La distance parcourue est la primitive de la vitesse : anime le trajet et lis l'aire sous v(t).",
  but:"Choisis un profil de vitesse et lance le trajet. L'aire colorée sous v(t) est la distance parcourue. Défi : appuie sur « Stop » au moment où la voiture franchit la ligne des 100 m.",
  aRetenir:"Position s(t) = primitive de la vitesse v(t) : s'(t) = v(t), et la distance entre t₁ et t₂ est s(t₂) − s(t₁) = aire sous la courbe de v. La vitesse est elle-même la dérivée de la position.",
  piege:"Un compteur de vitesse qui n'affiche jamais de valeur négative cache le sens du déplacement : ici v ≥ 0 donc la distance parcourue égale le déplacement. Avec une vitesse algébrique, les deux peuvent différer.",
  build:function(k,S){
    var c=M6.canvas(k,.9,370), P=S.draw.palette;
    var prof=k.select("Profil de vitesse",[["p1","Démarrage puis arrêt : v = 0,04·t·(30 − t)"],["p2","Vitesse constante puis freinage"],["p3","Trafic fluide : v = 8 + 4·sin(2πt/30)"]],"p1");
    var t=k.slider("Temps t",0,30,0.1,0,"s",null);
    var nt=k.note("","warn"), msg=null;
    var run=k.loop(function(dt){ var v=t.value+dt*3; if(v>=30){ v=30; run.pause(); } t.set(Math.round(v*100)/100); k.redraw(); });
    k.button("Départ / pause",function(){ if(run.running) run.pause(); else { if(t.value>=30) t.set(0); msg=null; run.play(); } },true);
    k.button("Stop sur la ligne !",function(){ if(run.running){ run.pause(); var e=S1()-100; msg="Tu t'es arrêté à "+S.fmt(S1(),1)+" m : "+(Math.abs(e)<1?"bravo, à moins de 1 m de la ligne !":(e<0?S.fmt(-e,1)+" m avant la ligne.":S.fmt(e,1)+" m après la ligne.")); } });
    var ro=k.readouts(["v(t)","Distance s(t)","Distance totale à 30 s","Reste à 100 m"]);
    function v(tt){ var p=prof.value; if(p==="p1") return 0.04*tt*(30-tt); if(p==="p2") return tt<=15?10:10-(tt-15)*10/15; return 8+4*Math.sin(2*Math.PI*tt/30); }
    function s(tt){ var n=Math.max(1,Math.round(tt/0.02)), h=tt/n, a=0; for(var i=0;i<n;i++){ a+=(v(i*h)+v((i+1)*h))/2*h; } return a; }
    function S1(){ return s(t.value); }
    function car(ctx,x,y,w){ /* petite voiture vue de côté, x = avant-gauche, y = sol */
      var h=w*0.36; ctx.save(); ctx.fillStyle=P.amber; rrectP(ctx,x,y-h*0.62,w,h*0.5,5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+w*0.2,y-h*0.6); ctx.lineTo(x+w*0.32,y-h); ctx.lineTo(x+w*0.7,y-h); ctx.lineTo(x+w*0.82,y-h*0.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#dbeafe"; ctx.beginPath(); ctx.moveTo(x+w*0.28,y-h*0.64); ctx.lineTo(x+w*0.36,y-h*0.92); ctx.lineTo(x+w*0.68,y-h*0.92); ctx.lineTo(x+w*0.76,y-h*0.64); ctx.closePath(); ctx.fill();
      [0.22,0.76].forEach(function(f){ ctx.fillStyle="#13233a"; ctx.beginPath(); ctx.arc(x+w*f,y-h*0.1,h*0.2,0,6.2832); ctx.fill(); ctx.fillStyle="#cbd5e1"; ctx.beginPath(); ctx.arc(x+w*f,y-h*0.1,h*0.08,0,6.2832); ctx.fill(); }); ctx.restore(); }
    function rrectP(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
    k.draw(function(){
      c.clear(); var T=t.value, ctx=c.ctx, W=c.W, H=c.H, fs=M6.fs(c,12), rh=Math.round(H*0.3);
      var st=s(T), tot=s(30), span=Math.max(tot,110)*1.04;
      /* route */
      var rx0=24, rx1=W-24, ry=rh-18, RX=function(m){ return rx0+(rx1-rx0)*m/span; };
      ctx.fillStyle="#e7ebf1"; ctx.fillRect(rx0-10,ry-6,rx1-rx0+20,16); ctx.fillStyle="#cdd5df"; ctx.fillRect(rx0-10,ry+8,rx1-rx0+20,3);
      ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.setLineDash([10,9]); ctx.beginPath(); ctx.moveTo(rx0-10,ry+1); ctx.lineTo(rx1+10,ry+1); ctx.stroke(); ctx.setLineDash([]);
      for(var m=0;m<=span;m+=20){ ctx.fillStyle="#7b8694"; ctx.fillRect(RX(m)-0.5,ry+11,1,5); S.draw.text(c,String(m),RX(m),ry+24,{size:10.5,color:"#7b8694",weight:600}); }
      ctx.fillStyle=P.red; ctx.fillRect(RX(100)-1.5,ry-34,3,40); ctx.beginPath(); ctx.moveTo(RX(100)+1.5,ry-34); ctx.lineTo(RX(100)+22,ry-27); ctx.lineTo(RX(100)+1.5,ry-20); ctx.fill();
      S.draw.text(c,"100 m",RX(100)-6,ry-40,{size:fs,color:P.red,align:"right"});
      var cw=Math.min(54,(rx1-rx0)*0.17); car(ctx,RX(st)-cw*0.75,ry+2,cw);
      /* graphique v(t) */
      ctx.save(); ctx.translate(0,rh+22); var sub={W:W,H:H-rh-22,ctx:ctx,clear:c.clear};
      var ax=S.draw.axes(sub,{x0:0,x1:30,y0:0,y1:14,xl:"t (s)",yl:"v (m/s)",stepX:5,stepY:2,b:30});
      S.draw.area(sub,ax,v,0,T,P.mat,0.22);
      S.draw.fn(sub,ax,v,P.mat,3);
      S.draw.line(sub,ax.X(T),ax.Y(0),ax.X(T),ax.Y(v(T)),P.red,1.6); S.draw.dot(sub,ax.X(T),ax.Y(v(T)),6,P.red);
      if(T>2) S.draw.label(sub,"aire = "+S.fmt(st,1)+" m",ax.X(T/2),ax.Y(Math.max(v(T/2)*0.4,1)),{size:fs,color:P.mat});
      ctx.restore();
      ro.set(0,S.fmt(v(T),2)+" m/s"); ro.set(1,S.fmt(st,1)+" m"); ro.set(2,S.fmt(tot,0)+" m"); ro.set(3,tot>=100?S.fmt(100-st,1)+" m":"100 m non atteints");
      if(msg&&!run.running) nt.set(msg,Math.abs(st-100)<1?"ok":"warn");
      else if(tot<100) nt.set("Avec ce profil, la voiture ne parcourt que "+S.fmt(tot,0)+" m en 30 s : elle n'atteindra jamais la ligne.","warn");
      else if(Math.abs(st-100)<1) nt.set("Tu y es : s(t) ≈ 100 m à t ≈ "+S.fmt(T,1)+" s.","ok");
      else nt.set("Défi : lance le trajet et appuie sur « Stop » quand la voiture franchit la ligne (ou règle t au curseur à 1 m près).","warn");
    });
  }
});
