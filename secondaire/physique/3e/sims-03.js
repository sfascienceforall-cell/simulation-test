/* Chapitre 3 · Intensité et tension */
(function(){
/* aides de dessin communes à ce chapitre (nov. 2026) : palette SFA, fond, composants de circuit, tracés animés */
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt, PI2 = 6.2832, G = 9.81;
var BG = "#f6f8fc", WC = "#34445c";
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,PI2); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||WC,w||3,dash); }
/* canvas à hauteur proportionnelle : rd (grand écran), rm (téléphone) */
function mkc(k,rd,rm){ var c=k.canvas(300), b=c.resize; c.resize=function(){ c.ratio=(c.cv.parentNode&&c.cv.parentNode.clientWidth<500)?(rm||rd):rd; b(); }; c.resize(); return c; }
function paper(c,top,bot){ var g=c.ctx; if(top){ var gr=g.createLinearGradient(0,0,0,c.H); gr.addColorStop(0,top); gr.addColorStop(1,bot||top); g.fillStyle=gr; } else g.fillStyle=BG; g.fillRect(0,0,c.W,c.H); }
function fs(c){ return c.W<430?11.5:12.5; }
function lab(c,s,x,y,col,o){ o=o||{}; o.color=col||P.ink; o.size=o.size||fs(c); T(c,s,x,y,o); }
function chip(c,s,x,y,col,o){ o=o||{}; o.color=col||P.ink; o.size=o.size||fs(c); D.label(c,s,x,y,o); }
/* fil (polyligne) et déplacement le long d'un chemin */
function wire(c,pts,col,w){ var g=c.ctx; g.save(); g.strokeStyle=col||WC; g.lineWidth=w||3; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); pts.forEach(function(p,i){ if(i) g.lineTo(p[0],p[1]); else g.moveTo(p[0],p[1]); }); g.stroke(); g.restore(); }
function plen(pts){ var s=0; for(var i=1;i<pts.length;i++) s+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); return s; }
function ppos(pts,s){ for(var i=1;i<pts.length;i++){ var dx=pts[i][0]-pts[i-1][0],dy=pts[i][1]-pts[i-1][1],l=Math.hypot(dx,dy)||1e-6; if(s<=l||i===pts.length-1){ var u=Math.min(1,s/l); return [pts[i-1][0]+dx*u,pts[i-1][1]+dy*u,Math.atan2(dy,dx)]; } s-=l; } return [pts[0][0],pts[0][1],0]; }
function flow(c,pts,ph,n,col,r){ var L=plen(pts); for(var i=0;i<n;i++){ var u=(((i/n+ph)%1)+1)%1, p=ppos(pts,u*L); circ(c,p[0],p[1],r||3,col); } }
/* lampe (symbole normalisé) : b = éclat 0..1,3 */
function lamp(c,x,y,r,b,burn){ b=Math.max(0,Math.min(b||0,1.4)); var g=c.ctx, a=Math.min(1,b);
  if(b>0.03) D.glow(c,x,y,r*(2+b*1.6),"#ffc933",Math.min(0.9,0.2+0.5*b));
  var gr=g.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r); gr.addColorStop(0,"rgb(255,"+Math.round(255-4*a)+","+Math.round(255-95*a)+")"); gr.addColorStop(1,"rgb("+Math.round(236+19*a)+","+Math.round(240-34*a)+","+Math.round(246-150*a)+")");
  circ(c,x,y,r,gr,burn?P.red:"#26364d",2.2);
  g.save(); g.strokeStyle=burn?P.red:"#26364d"; g.lineWidth=1.8; g.lineCap="round"; var d=r*0.68; g.beginPath(); g.moveTo(x-d,y-d); g.lineTo(x+d,y+d); g.moveTo(x+d,y-d); g.lineTo(x-d,y+d); g.stroke(); g.restore(); }
/* pile : le trait long (+) est du côté de l'angle 0 ; ang tourne le symbole */
function pile(c,x,y,ang,show){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang||0); rect(c,-16,-22,32,44,BG);
  g.strokeStyle=WC; g.lineCap="round"; g.lineWidth=2.6; g.beginPath(); g.moveTo(5,-16); g.lineTo(5,16); g.stroke();
  g.lineWidth=6; g.beginPath(); g.moveTo(-5,-9); g.lineTo(-5,9); g.stroke(); g.lineWidth=3; g.beginPath(); g.moveTo(-26,0); g.lineTo(-5,0); g.moveTo(5,0); g.lineTo(26,0); g.stroke(); g.restore();
  var ca=Math.cos(ang||0), sa=Math.sin(ang||0); if(show!==false) T(c,"+",x+ca*14+sa*14,y+sa*14-ca*14,{size:14,color:P.red}); }
function meter(c,x,y,sym,col,r){ circ(c,x,y,r||16,"#fff",col||P.ink,2.6); T(c,sym,x,y+1,{size:(r||16)*0.95,color:col||P.ink}); }
/* interrupteur horizontal centré en (x,y) */
function sw(c,x,y,closed,w){ w=w||44; rect(c,x-w/2,y-12,w,24,BG); ln(c,[x-w/2,y],[x-w*0.3,y]); ln(c,[x+w*0.3,y],[x+w/2,y]);
  if(closed) ln(c,[x-w*0.3,y],[x+w*0.3,y]); else ln(c,[x-w*0.3,y],[x+w*0.22,y-w*0.3]); circ(c,x-w*0.3,y,3.4,"#fff",WC,2); circ(c,x+w*0.3,y,3.4,"#fff",WC,2); }
function resis(c,x,y,w,txt,col){ rect(c,x-w/2,y-9,w,18,"#fff",col||WC,2.4,3); if(txt) T(c,txt,x,y+1,{size:11.5,color:col||WC}); }
/* appareil de mesure rectangulaire (afficheur) */
function lcd(c,s,x,y,w,h,col,cap){ D.display(c,s,x,y,{w:w,h:h,color:col||"#13233a",caption:cap}); }
function bar(c,x,y,w,h,u,col,bg){ rect(c,x,y,w,h,bg||"#e4e9f1",null,0,h/2); if(u>0) rect(c,x,y,Math.max(h,w*Math.min(1,u)),h,col||P.acc,null,0,h/2); }
function at(c,x,y,ang,fn){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); fn(); g.restore(); }
function rectPath(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]; }
function arrowAt(c,x,y,ang,col,sz){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); g.fillStyle=col||P.ink; g.beginPath(); g.moveTo(sz||9,0); g.lineTo(-(sz||9)*0.6,-(sz||9)*0.62); g.lineTo(-(sz||9)*0.6,(sz||9)*0.62); g.closePath(); g.fill(); g.restore(); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function SIM(id,fn){ var m=META[id]; if(!m) throw new Error("meta "+id); m.build=fn; SFA.sim(m); }

var META={};
META["p3-c03-multimetre"]={
  id:"p3-c03-multimetre", ch:"c03", tag:"Classique",
  titre:"Le multimètre : bien le brancher, bien le régler",
  resume:"Ampèremètre en série, voltmètre en dérivation : teste les bons et les mauvais branchements.",
  but:"Choisis l'appareil, son branchement et son calibre. Observe la lecture, l'état de la lampe et les messages (surcharge, fusible).",
  aRetenir:"L'ampèremètre se place EN SÉRIE (il laisse passer le courant) ; le voltmètre se place EN DÉRIVATION aux bornes du dipôle. Il faut choisir un calibre plus grand que la valeur à mesurer, puis descendre.",
  piege:"Un ampèremètre en dérivation est un court-circuit (fusible grillé). Un voltmètre en série indique à peu près la tension de la pile mais la lampe s'éteint : il ne laisse presque pas passer le courant.",};
META["p3-c03-hydraulique"]={
  id:"p3-c03-hydraulique", ch:"c03", tag:"Analogie",
  titre:"L'analogie hydraulique : tension, intensité, résistance",
  resume:"Une pompe, des tuyaux, un rétrécissement : visualise I = U / R comme un débit.",
  but:"Règle la « pression » de la pompe (la tension), le rétrécissement du tuyau (la résistance) et la vanne (l'interrupteur). Compare le débit d'eau et l'intensité.",
  aRetenir:"Tension = « pression » que fournit la pile ; intensité = débit de charges ; résistance = rétrécissement qui freine. Pour une même tension, plus la résistance est grande, plus l'intensité est faible : I = U / R.",
  piege:"L'eau (les charges) n'est pas consommée dans le rétrécissement : le débit est le même avant et après. Seule l'énergie est transférée. Et la tension ne « circule » pas : elle existe entre deux points, même quand la vanne est fermée.",};
META["p3-c03-points"]={
  id:"p3-c03-points", ch:"c03", tag:"Interactif",
  titre:"Intensité en différents points d'un circuit en série",
  resume:"Clique sur le circuit pour déplacer l'ampèremètre : la valeur change-t-elle ?",
  but:"Clique près d'un des points A, B, C, D pour y placer l'ampèremètre. Modifie les résistances des lampes.",
  aRetenir:"Dans un circuit en série, l'intensité est la même en tout point : le courant ne « s'use » pas. Ce sont les tensions qui se répartissent entre les lampes, et leur somme vaut la tension de la pile.",
  piege:"Une lampe ne consomme pas de courant : elle reçoit de l'énergie grâce au courant, mais la même intensité ressort de la lampe.",};
META["p3-c03-pile-citron"]={
  id:"p3-c03-pile-citron", ch:"c03", tag:"Niche utile",
  titre:"Une pile avec un citron : tension, montage, DEL",
  resume:"Choisis les métaux, le nombre de fruits et le montage : la DEL s'allume-t-elle ?",
  but:"Plante deux électrodes dans chaque fruit. Mesure la tension et vois si une DEL rouge (il lui faut environ 1,8 V) s'allume.",
  aRetenir:"La tension d'un fruit dépend des deux métaux (le plus réactif est le pôle −), pas de la taille du fruit. En série, les tensions s'additionnent ; en dérivation, la tension reste celle d'un seul fruit (mais l'intensité disponible augmente).",
  piege:"Deux électrodes identiques ne donnent aucune tension. Mettre les fruits en dérivation n'augmente pas la tension : la DEL ne s'allume pas. Valeurs : ordres de grandeur d'expériences en classe (± 0,2 V), pas des mesures exactes.",};
function lead(c,a,b,col,bend){ var g=c.ctx; g.save(); g.strokeStyle=col; g.lineWidth=3.2; g.lineCap="round"; g.beginPath(); g.moveTo(a[0],a[1]); g.bezierCurveTo(a[0],a[1]+bend,b[0],b[1]-bend*0.5,b[0],b[1]); g.stroke(); g.restore(); }

/* ---------- 1 · Le multimètre ---------- */
SIM("p3-c03-multimetre", function(k,S){
  var c = mkc(k,1.3,1.3);
  var fn = k.seg("Appareil", [["A","Ampèremètre (A)"],["V","Voltmètre (V)"]], "A");
  var br = k.seg("Branchement", [["s","En série"],["d","En dérivation aux bornes de la lampe"]], "s");
  var ca = k.select("Calibre ampèremètre", [["0.2","200 mA"],["2","2 A"],["10","10 A"]], "2");
  var cv = k.select("Calibre voltmètre", [["2","2 V"],["20","20 V"],["200","200 V"]], "20");
  var ro = k.readouts(["Lecture affichée","Lampe"]);
  var nt = k.note("","");
  var E=4.5, R=15, geo={}, ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(t,p){ if(t!=="down") return;
    if (geo.mx!==undefined && Math.hypot(p.x-geo.mx,p.y-geo.my)<geo.dr+24){ var sel=fn.value==="A"?ca:cv, vals=fn.value==="A"?["0.2","2","10"]:["2","20","200"]; sel.set(vals[(vals.indexOf(sel.value)+1)%3]); }
    else if (geo.px!==undefined && Math.hypot(p.x-geo.px,p.y-geo.py)<26) br.set(br.value==="s"?"d":"s");
    else if (geo.fx!==undefined && Math.abs(p.x-geo.fx)<44 && Math.abs(p.y-geo.fy)<20) fn.set(fn.value==="A"?"V":"A");
    k.redraw(); });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), wide=false;
    var isA=fn.value==="A", ser=br.value==="s";
    var cal=+(isA?ca.value:cv.value), val=0, disp="", lampB=1, msg="", kind="ok", dec=isA?3:(cal<5?3:cal<50?2:1);
    if (isA && ser) val=E/R; else if (isA) val=NaN; else if (ser){ val=E; lampB=0; } else val=E;
    if (isA && !ser){ disp="FUSE"; lampB=0; msg="<b>Fusible de l'ampèremètre grillé !</b> Branché en dérivation, l'ampèremètre (résistance presque nulle) court-circuite la lampe : courant énorme. À ne jamais faire : il se place en série."; kind="warn"; }
    else if (val>cal){ disp="OL"; msg="<b>Dépassement de calibre (OL)</b> : "+F(val,3)+(isA?" A":" V")+" dépasse "+(isA?(cal<1?"200 mA":cal+" A"):cal+" V")+". Choisis un calibre plus grand."; kind="warn"; }
    else { disp=F(val,dec)+(isA?" A":" V");
      if (isA) msg="Ampèremètre en série : il mesure l'intensité qui traverse la lampe ("+F(E/R,2)+" A = U/R avec U = 4,5 V et R = 15 Ω)."+(cal===10?" Calibre trop grand : peu de chiffres significatifs.":"");
      else if (ser){ msg="<b>Voltmètre en série</b> : il indique à peu près la tension de la pile ("+F(E,1)+" V) car il se trouve seul dans la boucle, mais il a une très grande résistance : le courant est quasi nul et la lampe reste éteinte. Mauvais branchement."; kind="warn"; }
      else msg="Voltmètre en dérivation aux bornes de la lampe : il mesure la tension de la lampe, "+F(E,1)+" V."+(cal===200?" Calibre trop grand : peu précis.":""); }
    /* zone du circuit */
    var cx0=W*0.08, cx1=wide?W*0.5:W*0.92, cy0=H*0.07, cy1=H*0.3, lx=(cx0+cx1)/2, my=(cy0+cy1)/2;
    wire(c,rectPath(cx0,cy0,cx1,cy1),WC,3.4);
    pile(c,cx0,my,-Math.PI/2,true); chip(c,"4,5 V",cx0+34,my,P.grey,{size:f-1});
    var lyy=my; rect(c,cx1-24,lyy-26,48,52,BG); ln(c,[cx1,lyy-34],[cx1,lyy-17]); ln(c,[cx1,lyy+17],[cx1,lyy+34]); lamp(c,cx1,lyy,16,lampB*0.9,false); chip(c,"lampe",cx1-(wide?0:0),lyy+36,P.grey,{size:f-1});
    var col=isA?P.red:P.acc, jackA=null, jackB=null;
    if (ser){ rect(c,lx-26,cy0-17,52,34,BG); ln(c,[lx-40,cy0],[lx-17,cy0]); ln(c,[lx+17,cy0],[lx+40,cy0]); meter(c,lx,cy0,isA?"A":"V",col,17); geo.px=lx; geo.py=cy0; jackA=[lx-14,cy0+10]; jackB=[lx+14,cy0+10]; }
    else { var xm=cx1-(wide?58:50), yt=lyy-30, yb=lyy+30; wire(c,[[cx1,yt],[xm,yt],[xm,lyy-17]],col,2.6); wire(c,[[cx1,yb],[xm,yb],[xm,lyy+17]],col,2.6); meter(c,xm,lyy,isA?"A":"V",col,17); geo.px=xm; geo.py=lyy; jackA=[xm-14,lyy]; jackB=[xm+14,lyy]; }
    if (lampB>0.1 && ser===true && isA){ var path=rectPath(cx0,cy0,cx1,cy1); flow(c,path,-ph*0.12,12,"#3d78e0",3); }
    if (isA && !ser && ((ph*4)%1)<0.5) D.glow(c,geo.px,geo.py,40,"#ff5b3a",0.5);
    /* multimètre */
    var mw=Math.min(W*0.86,330), mh=H*0.6, mx0=W/2-mw/2, my0=H*0.38;
    var gr=c.ctx.createLinearGradient(mx0,my0,mx0+mw,my0+mh); gr.addColorStop(0,"#ffd44d"); gr.addColorStop(1,"#f0aa00");
    rect(c,mx0,my0,mw,mh,gr,"#b07d00",2.5,18); rect(c,mx0+8,my0+8,mw-16,mh-16,null,"rgba(0,0,0,.12)",1.5,12);
    lcd(c,disp,mx0+mw/2,my0+mh*0.2,mw*0.74,mh*0.17,disp==="OL"||disp==="FUSE"?"#b3261e":"#13233a",isA?"A":"V");
    var dr=Math.min(mw*0.27,mh*0.19), dcx=mx0+mw/2, dcy=my0+mh*0.6; geo.mx=dcx; geo.my=dcy; geo.dr=dr; geo.fx=dcx; geo.fy=my0+mh*0.2;
    circ(c,dcx,dcy,dr+8,"#2a3342","#171e29",2.5); circ(c,dcx,dcy,dr-8,"#3b475a","#566379",1.5);
    var items=[["200mA",-135,"A","0.2"],["2A",-90,"A","2"],["10A",-45,"A","10"],["2V",45,"V","2"],["20V",90,"V","20"],["200V",135,"V","200"]];
    items.forEach(function(q){ var a=q[1]*Math.PI/180, on=q[2]===fn.value&&q[3]===String(cal), cc=q[2]==="A"?"#ff8d86":"#8fb8ff", rx=dcx+Math.sin(a)*(dr+22), ry=dcy-Math.cos(a)*(dr+22);
      ln(c,[dcx+Math.sin(a)*(dr-2),dcy-Math.cos(a)*(dr-2)],[dcx+Math.sin(a)*(dr+10),dcy-Math.cos(a)*(dr+10)],on?"#fff":"rgba(255,255,255,.4)",on?3:1.6);
      T(c,q[0],rx,ry,{size:f-1.5,color:on?"#1b2433":"#4a3a00",weight:on?800:700,bg:on?"#fff":null}); });
    var pa=(isA?{"0.2":-135,"2":-90,"10":-45}:{"2":45,"20":90,"200":135})[String(cal)]*Math.PI/180;
    ln(c,[dcx,dcy],[dcx+Math.sin(pa)*(dr-4),dcy-Math.cos(pa)*(dr-4)],"#fff",4); circ(c,dcx,dcy,6,"#fff"); chip(c,"clique pour changer de calibre",dcx,my0+mh*0.93,"#7a5800",{size:f-1.5,fill:"rgba(255,255,255,.7)"});
    var jy=my0+mh*0.07, jx=[mx0+mw*0.25,mx0+mw*0.5,mx0+mw*0.75], jn=["COM","V","A"];
    jx.forEach(function(x,i){ circ(c,x,jy,10,"#1b2433",i===0?"#555":(i===1?P.acc:P.red),3); T(c,jn[i],x,jy-17,{size:f-1.5,color:"#4a3a00"}); });
    var jc=isA?jx[2]:jx[1];
    if (ser||true){ lead(c,[jc,jy],jackA,P.red,-60); lead(c,[jx[0],jy],jackB,"#1b2433",-60); }
    ro.set(0,disp); ro.set(1,lampB>0.1?"allumée":"éteinte");
    nt.set(msg,kind);
  });
});

/* ---------- 2 · Analogie hydraulique ---------- */
SIM("p3-c03-hydraulique", function(k,S){
  var c = mkc(k,0.8,0.98);
  var U = k.slider("Tension de la pile (pression de la pompe)", 1.5, 12, 0.5, 6, "V");
  var R = k.slider("Résistance (rétrécissement)", 1, 50, 1, 10, "Ω");
  var sw2 = k.seg("Interrupteur (vanne)", [["1","Fermé"],["0","Ouvert"]], "1");
  var ro = k.readouts(["Intensité I = U / R","Tension aux bornes de la vanne","Tension aux bornes de R"]);
  var nt = k.note("","");
  var u=0, geo={};
  c.pointer(function(t,p){ if(t==="down"&&geo.vx&&Math.hypot(p.x-geo.vx,p.y-geo.vy)<34){ sw2.set(sw2.value==="1"?"0":"1"); k.redraw(); } });
  var lp=k.loop(function(dt){ var I=sw2.value==="1"?U.value/R.value:0; u=(u+dt*I*0.18)%1; k.redraw(); }); lp.play();
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), on=sw2.value==="1", I=on?U.value/R.value:0;
    var x0=W*0.14,x1=W*0.86,y0=H*0.2,y1=H*0.74, th=Math.min(22,W*0.04), cy=(y0+y1)/2, g=c.ctx;
    var nar=Math.max(3,th*(1-Math.min(0.9,R.value/55))), hi="#2f6fd0", lo="#bcd5f0", hv=Math.min(1,U.value/12);
    function pcol(high){ return high ? "rgba(47,111,208,"+(0.35+0.5*hv)+")" : "#dbe8f7"; }
    function pipe(a,b,high){ ln(c,a,b,"#7f95b3",th+8); ln(c,a,b,"#f4f8fd",th+2); ln(c,a,b,pcol(high),th-2); }
    /* sens de l'écoulement : pompe (gauche) → vanne (haut) → résistance (droite) → retour (bas) */
    pipe([x0,y1],[x0,y0],true); pipe([x0,y0],[x1,y0],on||true); if(!on){ ln(c,[(x0+x1)/2,y0],[x1,y0],"#7f95b3",th+8); ln(c,[(x0+x1)/2,y0],[x1,y0],"#f4f8fd",th+2); ln(c,[(x0+x1)/2,y0],[x1,y0],pcol(false),th-2); }
    pipe([x1,y0],[x1,cy-34],on); pipe([x1,cy+34],[x1,y1],false); pipe([x1,y1],[x0,y1],false);
    /* rétrécissement */
    g.save(); g.fillStyle="#7f95b3"; g.beginPath(); g.moveTo(x1-th/2-4,cy-34); g.lineTo(x1+th/2+4,cy-34); g.lineTo(x1+nar/2,cy); g.lineTo(x1+th/2+4,cy+34); g.lineTo(x1-th/2-4,cy+34); g.lineTo(x1-nar/2,cy); g.closePath(); g.fill();
    g.fillStyle=on?pcol(true):"#dbe8f7"; g.beginPath(); g.moveTo(x1-th/2+2,cy-34); g.lineTo(x1+th/2-2,cy-34); g.lineTo(x1+nar/2-1.5,cy); g.lineTo(x1+th/2-2,cy+34); g.lineTo(x1-th/2+2,cy+34); g.lineTo(x1-nar/2+1.5,cy); g.closePath(); g.fill(); g.restore();
    chip(c,"résistance",x1-58,cy-14,P.grey,{size:f-1}); chip(c,"R = "+F(R.value,0)+" Ω",x1-52,cy+16,"#2f6fd0",{size:f-1});
    /* vanne cliquable */
    var vx=(x0+x1)/2; geo.vx=vx; geo.vy=y0;
    rect(c,vx-18,y0-18,36,36,"#fff",P.ink,2.4,8); if(on) ln(c,[vx-11,y0],[vx+11,y0],P.ink,5); else ln(c,[vx,y0-12],[vx,y0+12],P.red,6);
    chip(c,on?"vanne ouverte (clique)":"vanne fermée (clique)",vx,y0-34,on?P.grey:P.red,{size:f-1});
    /* eau : points */
    var path=[[x0,y1],[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
    if(on) flow(c,path,u,Math.round(14+Math.min(20,I*4)),"#1f55b5",3.2);
    else flow(c,path,0,18,"#8aa3c8",2.6);
    /* pompe (par-dessus l'eau) */
    rect(c,x0-30,cy-28,60,56,"#fbe3df",P.red,2.4,12); lab(c,"pompe",x0,cy-10,P.red,{size:f-1,weight:800}); lab(c,F(U.value,1)+" V",x0,cy+10,P.red,{size:f+1,weight:800});
    /* légende analogie */
    lab(c,"pompe = pile · tuyau = fil · débit = intensité I",W/2,H*0.88,P.grey,{size:f-1,weight:700}); lab(c,"rétrécissement = résistance R · pression = tension U",W/2,H*0.88+18,P.grey,{size:f-1,weight:700});
    chip(c,on?"I = "+F(I,2)+" A":"I = 0",x0+(x1-x0)*0.5,cy+6,on?"#1f55b5":P.grey,{size:f+1});
    ro.set(0,F(I,2)+" A"); ro.set(1,on?"0 V":F(U.value,1)+" V"); ro.set(2,on?F(U.value,1)+" V":"0 V");
    nt.set(on?"Débit : "+F(I,2)+" A. Doubler la résistance divise l'intensité par 2 ; doubler la tension la multiplie par 2. Toute la « pression » de la pompe est perdue dans le rétrécissement (couleur plus claire après R).":"Vanne fermée : plus de débit (I = 0), mais la pression de la pompe est bien là : on mesure U = "+F(U.value,1)+" V aux bornes de l'interrupteur ouvert.","ok");
  });
});

/* ---------- 3 · Intensité en différents points ---------- */
SIM("p3-c03-points", function(k,S){
  var c = mkc(k,0.8,1.0);
  var r1=k.slider("Résistance lampe 1",5,40,1,10,"Ω"), r2=k.slider("Résistance lampe 2",5,40,1,20,"Ω"), r3=k.slider("Résistance lampe 3",5,40,1,30,"Ω");
  var pos=k.select("Position de l'ampèremètre",[["0","A : après le + de la pile"],["1","B : entre lampe 1 et lampe 2"],["2","C : entre lampe 2 et lampe 3"],["3","D : avant le − de la pile"]],"0");
  var ro=k.readouts(["Lecture de l'ampèremètre","U₁","U₂","U₃"]);
  var nt=k.note("","");
  var E=6, u=null, geo={}, ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  function nearest(p){ var pts=geo.path, best=0, bd=1e9, L=plen(pts); for (var s=0;s<L;s+=4){ var q=ppos(pts,s), d=Math.hypot(q[0]-p.x,q[1]-p.y); if(d<bd){bd=d;best=s;} } return best/L; }
  c.pointer(function(t,p){ if(t==="down"||t==="drag"){ u=nearest(p); /* aimantation sur les 4 repères */ var best=-1,bd=1e9; geo.marks.forEach(function(m,i){ var d=Math.abs(m-u); if(d<bd){bd=d;best=i;} }); if(bd<0.03){ u=null; pos.set(String(best)); } k.redraw(); } });
  pos.el.addEventListener("change",function(){ u=null; });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), Rt=r1.value+r2.value+r3.value, I=E/Rt;
    var x0=W*0.14,x1=W*0.86,y0=H*0.16,y1=H*0.66,cy=(y0+y1)/2, path=rectPath(x0,y0,x1,y1);
    geo.path=path; var Lp=plen(path), w=x1-x0, h=y1-y0;
    geo.marks=[(8)/Lp,(w+8)/Lp,(w+h+w-8)/Lp,(2*w+2*h-8)/Lp];
    wire(c,path,WC,3.4);
    pile(c,x0,cy,-Math.PI/2,true); chip(c,"6 V",x0+34,cy,P.grey,{size:f-1});
    var R=[r1.value,r2.value,r3.value], Us=R.map(function(r){return I*r;});
    var lp3=[[(x0+x1)/2,y0],[x1,cy],[(x0+x1)/2,y1]];
    rect(c,lp3[0][0]-24,y0-22,48,44,BG); rect(c,x1-22,cy-24,44,48,BG); rect(c,lp3[2][0]-24,y1-22,48,44,BG);
    var bl=[0,1,2].map(function(j){ return Math.min(1.3,Math.pow(I/0.3,2)*(R[j]/10)*0.6); });
    lamp(c,lp3[0][0],lp3[0][1],16,bl[0],false); lamp(c,lp3[1][0],lp3[1][1],16,bl[1],false); lamp(c,lp3[2][0],lp3[2][1],16,bl[2],false);
    chip(c,"L1 · "+F(Us[0],2)+" V",lp3[0][0],y0-34,P.amber,{size:f-1}); chip(c,"L2 · "+F(Us[1],2)+" V",x1-(W<430?8:0),cy-(W<430?42:44),P.amber,{size:f-1}); chip(c,"L3 · "+F(Us[2],2)+" V",lp3[2][0],y1+34,P.amber,{size:f-1});
    var q0=[[x0,y0+8],[x1,y0+8],[x1,y1-8],[x0,y1-8]], lab4=["A","B","C","D"], cur=u!==null?u:geo.marks[+pos.value];
    flow(c,path,-ph*0.1,16,"#3d78e0",2.8);
    for (var i=0;i<4;i++){ var m=ppos(path,geo.marks[i]*Lp); circ(c,m[0],m[1],8,"#fff","#9aa6b8",2); T(c,lab4[i],m[0]+(i===0||i===3?-17:17),m[1]+(i<2?-9:9),{size:f,color:P.grey,weight:800}); }
    var mp=ppos(path,cur*Lp); circ(c,mp[0],mp[1],21,BG); meter(c,mp[0],mp[1],"A",P.red,17);
    chip(c,F(I*1000,0)+" mA",mp[0]+(mp[0]>W/2?-46:46),mp[1]+(mp[1]>H/2?-28:28),P.red);
    /* tensions en barre empilée */
    var bw=Math.min(W*0.8,440), bx=W/2-bw/2, by=H*0.92; lab(c,"U₁ + U₂ + U₃ = tension de la pile (6 V)",W/2,by-20,P.grey,{size:f-1,weight:700});
    var acc=0; [P.red,P.green,P.violet].forEach(function(col,j){ var ww=bw*Us[j]/E; rect(c,bx+bw*acc/E,by-8,ww,16,col,"#fff",1.5,3); if(ww>34) lab(c,F(Us[j],1)+" V",bx+bw*acc/E+ww/2,by,"#fff",{size:f-1}); acc+=Us[j]; });
    ro.set(0,F(I*1000,0)+" mA"); ro.set(1,F(Us[0],2)+" V"); ro.set(2,F(Us[1],2)+" V"); ro.set(3,F(Us[2],2)+" V");
    nt.set("Où que soit l'ampèremètre (glisse-le sur le fil) : <b>"+F(I*1000,0)+" mA</b>, toujours la même. Tensions : "+F(Us[0],2)+" + "+F(Us[1],2)+" + "+F(Us[2],2)+" = "+F(Us[0]+Us[1]+Us[2],2)+" V = tension de la pile.","ok");
  });
});

/* ---------- 4 · Pile citron ---------- */
var METAL=[["Cu","Cuivre",0,"#d98a4f"],["Fe","Fer (clou)",0.55,"#7d8794"],["Zn","Zinc (clou galvanisé)",0.95,"#bfc7d2"],["Mg","Magnésium (ruban)",1.6,"#e6e9ee"]];
SIM("p3-c03-pile-citron", function(k,S){
  var c = mkc(k,0.72,0.98);
  var e1=k.select("Électrode 1 (reliée à la DEL, côté +)",METAL.map(function(m){return [m[0],m[1]];}),"Cu");
  var e2=k.select("Électrode 2",METAL.map(function(m){return [m[0],m[1]];}),"Zn");
  var n=k.slider("Nombre de fruits",1,6,1,3,"");
  var mt=k.seg("Montage",[["s","En série"],["p","En dérivation"]],"s");
  var fr=k.seg("Fruit",[["c","Citron"],["p","Pomme de terre"]],"c");
  var ro=k.readouts(["Tension disponible","Intensité dans la DEL","DEL rouge"]);
  var nt=k.note("","");
  function m(id){ return METAL.filter(function(x){return x[0]===id;})[0]; }
  var ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(t,p){ if(t==="down" && p.y>c.H*0.4 && p.y<c.H*0.75){ n.set(n.value>=6?1:n.value+1); k.redraw(); } });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), N=n.value, ser=mt.value==="s", cit=fr.value==="c";
    var d=m(e2.value)[2]-m(e1.value)[2], v=Math.abs(d)*(cit?1:0.9), rc=cit?1000:2500;
    var V=ser?N*v:v, r=ser?N*rc:rc/N, ok=d>0, I=ok?Math.max(0,(V-1.8)/(r+60)):0, lit=I>2e-4?2:I>2e-5?1:0;
    var gap=Math.min(86,(W-100)/N), sx=W/2-(N-1)*gap/2-(W<430?18:0), fy=H*0.56, rx=Math.min(34,gap*0.42), ry=rx*0.82, ey=fy-ry-8, lx=W-(W<430?34:50), ly=H*0.84;
    var xa=function(i){ return sx+i*gap-rx*0.45; }, xb=function(i){ return sx+i*gap+rx*0.45; };
    var top1=ey-16-(ser?0:0), top2=ey-34;
    var col="#3a4a60", gl=lit?"#e0482b":"#c9d1dc";
    /* fils (derrière les électrodes) */
    if (ser){
      for (var i=0;i<N-1;i++) wire(c,[[xb(i),ey],[xb(i),top1],[xa(i+1),top1],[xa(i+1),ey]],col,2.6);
      wire(c,[[xa(0),ey],[xa(0),top2],[12,top2],[12,ly],[lx-16,ly]],col,2.6);
      wire(c,[[xb(N-1),ey],[xb(N-1),top2-14],[W-10,top2-14],[W-10,ly+0],[lx+16,ly]],col,2.6);
    } else {
      for (i=0;i<N;i++){ wire(c,[[xa(i),ey],[xa(i),top1]],col,2.6); wire(c,[[xb(i),ey],[xb(i),top2-14]],col,2.6); }
      wire(c,[[xa(0),top1],[xa(N-1),top1]],col,2.6); wire(c,[[xb(0),top2-14],[xb(N-1),top2-14]],col,2.6);
      wire(c,[[xa(0),top1],[12,top1],[12,ly],[lx-16,ly]],col,2.6); wire(c,[[xb(N-1),top2-14],[W-10,top2-14],[W-10,ly],[lx+16,ly]],col,2.6);
    }
    /* fruits */
    for (i=0;i<N;i++){ var fx=sx+i*gap, gg=c.ctx.createRadialGradient(fx-rx*0.3,fy-ry*0.3,2,fx,fy,rx*1.1);
      gg.addColorStop(0,cit?"#fff3a0":"#e7cfa6"); gg.addColorStop(1,cit?"#e8c81a":"#b78c5c");
      c.ctx.save(); c.ctx.beginPath(); c.ctx.ellipse(fx,fy,rx,ry,0,0,PI2); c.ctx.fillStyle=gg; c.ctx.fill(); c.ctx.strokeStyle=cit?"#b79a00":"#8d6a45"; c.ctx.lineWidth=2; c.ctx.stroke(); c.ctx.restore();
      if (cit){ c.ctx.save(); c.ctx.fillStyle="#b79a00"; c.ctx.beginPath(); c.ctx.ellipse(fx+rx,fy,4,3,0,0,PI2); c.ctx.fill(); c.ctx.restore(); }
      rect(c,xa(i)-3.5,ey,7,ry+16,m(e1.value)[3],"#566174",1.2,2); rect(c,xb(i)-3.5,ey,7,ry+16,m(e2.value)[3],"#566174",1.2,2);
      T(c,"+",xa(i),ey-5,{size:12,color:P.red,weight:800}); T(c,"−",xb(i),ey-5,{size:13,color:P.acc,weight:800}); }
    chip(c,e1.value+"  |  "+e2.value,sx+(N-1)*gap/2,fy+ry+22,P.grey,{size:f-1});
    /* DEL */
    if (lit) D.glow(c,lx,ly,lit===2?58:26,"#ff5b3a",lit===2?0.7:0.3);
    circ(c,lx,ly,15,lit?(lit===2?"#ff6b5a":"#f0b0a8"):"#f4dcd9",P.red,2.4); var g=c.ctx; g.save(); g.fillStyle=P.red; g.beginPath(); g.moveTo(lx-6,ly-7); g.lineTo(lx-6,ly+7); g.lineTo(lx+6,ly); g.closePath(); g.fill(); g.fillRect(lx+6,ly-7,2,14); g.restore();
    chip(c,"DEL",lx,ly+28,P.red,{size:f-1});
    lcd(c,F(V,2)+" V",W/2,ly+4,Math.min(110,W*0.3),38,V>=1.8?"#13233a":"#9b5a2a","tension");
    chip(c,"fruits en "+(ser?"série":"dérivation")+" · clique pour en ajouter",W/2,H*0.04+4,P.grey,{size:f-1});
    ro.set(0,F(V,2)+" V"); ro.set(1,F(I*1000,2)+" mA"); ro.set(2,lit===2?"allumée":lit===1?"à peine lumineuse":"éteinte");
    var msg;
    if (d===0) msg="Électrodes identiques : <b>aucune tension</b>. Il faut deux métaux différents.";
    else if (!ok) msg="Branchement inversé : le pôle + est l'électrode <b>"+m(e2.value)[1].split(" ")[0]+"</b> (le moins réactif). La DEL est montée à l'envers et ne laisse pas passer le courant.";
    else if (V<1.8) msg="La tension disponible ("+F(V,2)+" V) est inférieure à environ 1,8 V : la DEL ne peut pas s'allumer."+(ser?" Ajoute des fruits en série.":" Les montages en dérivation n'augmentent pas la tension : passe en série.");
    else msg="Tension suffisante ("+F(V,2)+" V). Le courant est très faible car chaque fruit a une grande résistance interne (environ "+(cit?"1 kΩ":"2,5 kΩ")+") : lueur faible.";
    nt.set(msg,lit?"ok":"warn");
  });
});

})();
