/* Chapitre 7 · Forces, poids et masse */
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
/* flèche de force : de (x,y) vers (x2,y2), avec étiquette */
function fArrow(c,x,y,x2,y2,col,txt,o){ o=o||{}; if(Math.hypot(x2-x,y2-y)<3) return; D.arrow(c,x,y,x2,y2,col,o.w||3.4); if(txt){ var a=Math.atan2(y2-y,x2-x); chip(c,txt,x2+Math.cos(a)*(o.dx==null?16:o.dx),y2+Math.sin(a)*(o.dy==null?12:o.dy),col,{size:o.size}); } }
function grad(c,x,y,w,h,a,b){ var g=c.ctx, gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,a); gr.addColorStop(1,b); g.fillStyle=gr; g.fillRect(x,y,w,h); }
function spring(c,x,y0,y1,n,amp,col,lw){ var g=c.ctx; g.save(); g.strokeStyle=col||"#5d6b82"; g.lineWidth=lw||2.4; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); g.moveTo(x,y0); var s=y1-y0; g.lineTo(x,y0+s*0.08);
  for(var i=0;i<n*2;i++){ var t=0.08+0.84*(i+0.5)/(n*2); g.lineTo(x+(i%2?-amp:amp),y0+s*t); } g.lineTo(x,y0+s*0.92); g.lineTo(x,y1); g.stroke(); g.restore(); }

var META={};
META["p3-c07-dynamometre"]={
  id:"p3-c07-dynamometre", ch:"c07", tag:"Classique",
  titre:"Le dynamomètre : le poids change, la masse non",
  resume:"Accroche une masse et change d'astre : le poids varie, la masse reste la même.",
  but:"Choisis une masse et un astre. Lis le poids sur le dynamomètre (en N) et compare à la masse (en kg).",
  aRetenir:"La masse m (en kg) mesure la quantité de matière : elle ne change pas d'un astre à l'autre. Le poids P (en N) est la force d'attraction de l'astre : P = m·g, où g est l'intensité de la pesanteur (en N/kg). Sur la Lune, g est environ 6 fois plus petit que sur Terre.",
  piege:"Sur la Lune, on ne « perd » pas de masse : on pèse moins. Le poids se mesure avec un dynamomètre (en newtons), la masse avec une balance (en kilogrammes). Le kilogramme n'est pas une unité de poids."};
META["p3-c07-dessiner-force"]={
  id:"p3-c07-dessiner-force", ch:"c07", tag:"Géométrie",
  titre:"Représente la force : point, direction, sens, valeur",
  resume:"Trace à la souris (ou au doigt) la flèche qui représente la force, avec la bonne échelle.",
  but:"Lis la situation. Appuie sur le point d'application, glisse pour dessiner la flèche, relâche, puis vérifie les quatre caractéristiques.",
  aRetenir:"Une force est un vecteur : on la représente par une flèche qui indique son point d'application (où elle s'exerce), sa direction (la droite), son sens et sa valeur (longueur de la flèche selon l'échelle, par exemple 1 cm pour 10 N).",
  piege:"Le poids s'applique au centre de gravité et pointe vers le bas ; la réaction du support s'applique au contact et pointe vers le haut. Sur un objet au repos, ces deux forces ont la même valeur : une flèche trop courte ou trop longue est une erreur de valeur."};
META["p3-c07-ressort"]={
  id:"p3-c07-ressort", ch:"c07", tag:"Mesure",
  titre:"Allongement d'un ressort : la loi de Hooke",
  resume:"Accroche des masses : l'allongement est proportionnel à la force, jusqu'à la limite d'élasticité.",
  but:"Choisis un ressort, accroche des masses, note les mesures et observe que le graphe F = f(allongement) est une droite.",
  aRetenir:"Pour un ressort élastique, la force F est proportionnelle à l'allongement Δℓ : F = k·Δℓ, où k est la raideur (en N/m). C'est le principe du dynamomètre. Au-delà de la limite d'élasticité (ici 4,5 N), le ressort ne revient plus à sa longueur initiale et la proportionnalité n'est plus vraie.",
  piege:"On proportionne la force à l'allongement (longueur en plus), pas à la longueur totale du ressort. Un ressort plus raide (k plus grand) s'allonge moins pour la même force."};
META["p3-c07-balance-orbite"]={
  id:"p3-c07-balance-orbite", ch:"c07", tag:"Niche utile",
  titre:"Peser un astronaute : quelle balance fonctionne où ?",
  resume:"Même astronaute, quatre lieux, quatre instruments : que lit-on ?",
  but:"Choisis un lieu, un instrument et une masse. Compare la lecture avec la vraie masse et le poids.",
  aRetenir:"La masse ne change jamais. Un pèse-personne ou un dynamomètre mesurent la force exercée sur eux : sur la Lune, un pèse-personne étalonné sur Terre indique 6 fois trop peu de « kilogrammes ». Dans la station spatiale, tout tombe en même temps (chute libre) : les instruments qui utilisent le poids n'indiquent rien. Seule la balance d'inertie marche partout.",
  piege:"Dans la station, l'astronaute n'est pas « sans pesanteur » : la Terre l'attire presque autant qu'au sol (g ≈ 8,7 N/kg). Il flotte parce qu'il est en chute libre avec la station, pas parce que l'attraction a disparu."};
function wrap(c,txt,x,y,maxW,col,size,lh){ var g=c.ctx; g.save(); g.font="700 "+size+"px Mulish, sans-serif"; var words=txt.split(" "),line="",ys=y; var out=[]; words.forEach(function(w){ var t=line?line+" "+w:w; if(g.measureText(t).width>maxW&&line){ out.push(line); line=w; } else line=t; }); out.push(line); g.restore();
  out.forEach(function(l,i){ T(c,l,x,y+i*lh,{size:size,color:col,align:"center"}); }); return out.length*lh; }
var ASTRES=[["terre","Terre",9.81,"#3b82c4"],["lune","Lune",1.62,"#aeb4bd"],["mars","Mars",3.71,"#c4663a"],["venus","Vénus",8.87,"#d9a441"],["jup","Jupiter",24.79,"#c9a27a"]];
function planet(c,x,y,r,col,sel){ var g=c.ctx, gr=g.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r); gr.addColorStop(0,"#fff"); gr.addColorStop(0.25,col); gr.addColorStop(1,"#26364d"); circ(c,x,y,r,gr,sel?P.red:"#26364d",sel?3:1.2); if(sel) D.glow(c,x,y,r*1.9,P.red,0.25); }

/* ---------- 1 · Dynamomètre ---------- */
SIM("p3-c07-dynamometre", function(k,S){
  var c = mkc(k,0.95,1.2);
  var m = k.slider("Masse accrochée",100,2000,50,500,"g");
  var as = k.select("Astre",ASTRES.map(function(a){return [a[0],a[1]+" (g = "+F(a[2],2)+" N/kg)"];}),"terre");
  var ro = k.readouts(["Masse","Poids (en N)","Rapport au poids sur Terre"]);
  var nt = k.note("","");
  var hitP=[], dragM=false;
  c.pointer(function(ty,p){ if(ty==="down"){ for(var i=0;i<hitP.length;i++){ var h=hitP[i]; if(Math.hypot(p.x-h[0],p.y-h[1])<h[2]){ as.set(ASTRES[i][0]); k.redraw(); return; } } if(p.x<c.W*0.5) dragM=true; }
    if((ty==="down"||ty==="drag")&&dragM){ var f=clamp((p.y-c.H*0.45)/(c.H*0.45),0,1); m.set(Math.round((100+f*1900)/50)*50); k.redraw(); } if(ty==="up") dragM=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    var A=ASTRES.filter(function(a){return a[0]===as.value;})[0], mk=m.value/1000, Pw=mk*A[2];
    var cal=[1,2,5,10,20,50].filter(function(v){return v>=Pw*1.05;})[0]||50;
    var narrow=W<520, x=narrow?W*0.3:W*0.24, top=40, tube=H*0.34, tx0=top+12, tx1=top+tube-12;
    lab(c,"calibre 0 – "+cal+" N",x,16,P.grey,{size:f-2});
    /* dynamomètre */
    rect(c,x-26,top,52,tube,"#fff","#26364d",2.6,10); rect(c,x-26,top,52,tube,null,"#26364d",2.6,10);
    var step=cal<=2?0.5:cal<=10?1:cal<=20?5:10; if(cal===1) step=0.2;
    for(var v=0;v<=cal+1e-9;v+=step){ var yy=tx0+(tx1-tx0)*v/cal; ln(c,[x+26,yy],[x+13,yy],P.ink,1.8); lab(c,F(v,step<1?1:0),x+30,yy,P.grey,{size:f-2,align:"left",bg:false}); }
    var ind=tx0+(tx1-tx0)*Math.min(1,Pw/cal); rect(c,x-26,ind-2.5,52,5,P.red); chip(c,"N",x-40,top+10,P.grey,{size:f-1});
    /* ressort intérieur + crochet + masse */
    var s0=top+tube, ext=14+Math.min(1,Pw/cal)*34, s1=s0+ext+16; ln(c,[x,top-14],[x,top],P.ink,3); circ(c,x,top-16,5,"#fff",P.ink,2.2);
    spring(c,x,s0-6,s1,5,9,"#5d6b82"); ln(c,[x,s1],[x,s1+10],P.ink,2.6);
    var sz=24+Math.sqrt(mk)*26, my=s1+10; rect(c,x-sz/2,my,sz,sz*0.9,"#b9c3d3","#26364d",2.2,6); lab(c,F(mk,2)+" kg",x,my+sz*0.45,P.ink,{size:f,bg:false});
    hitP=[]; 
    /* flèche poids */
    fArrow(c,x+sz/2+16,my+sz*0.45,x+sz/2+16,my+sz*0.45+Math.min(H*0.2,Pw*3+14),P.red,"P = "+F(Pw,1)+" N",{dx:0,dy:16});
    chip(c,"tire la masse ↕ · clique un astre →",W*0.5,H-10,P.grey,{size:f-2.5});
    /* astres */
    var bx=narrow?W*0.52:W*0.5, bw=W-bx-14, rowH=(H-50)/5;
    lab(c,"Poids sur chaque astre",bx,16,P.grey,{size:f-2,align:"left"});
    ASTRES.forEach(function(a,j){ var yy=48+j*rowH+rowH/2, p=mk*a[2], sel=a[0]===as.value, r=Math.min(14,rowH*0.38);
      planet(c,bx+r,yy,r,a[3],sel); hitP.push([bx+r,yy,r+8]); lab(c,a[1],bx+2*r+8,yy-rowH*0.28,sel?P.red:P.ink,{align:"left",size:f-1.5,bg:false});
      var x0=bx+2*r+8, ww=(bw-2*r-10), w=ww*Math.min(1,p/50); rect(c,x0,yy-3,ww,12,"#e5eaf2",null,0,6); rect(c,x0,yy-3,Math.max(6,w),12,sel?P.red:"#8fa7d4",null,0,6);
      lab(c,F(p,1)+" N",x0+Math.max(6,w)+4>x0+ww-40?x0+ww:x0+Math.max(6,w)+5,yy+rowH*0.32,sel?P.red:P.ink,{align:x0+Math.max(6,w)+4>x0+ww-40?"right":"left",size:f-2,bg:false}); });
    ro.set(0,F(mk,2)+" kg"); ro.set(1,F(Pw,1)+" N"); ro.set(2,F(A[2]/9.81,2)+" ×");
    nt.set("Masse : "+F(mk,2)+" kg sur tous les astres. Poids : "+F(mk,2)+" × "+F(A[2],2)+" = <b>"+F(Pw,2)+" N</b> sur "+A[1]+".","ok");
  });
});

/* ---------- 2 · Représenter une force ---------- */
var SCEN=[
 {n:"Poids d'une caisse de 4 kg posée sur le sol (g = 9,81 N/kg)", sc:10, F:4*9.81, ang:90, org:function(b){return [b.cx,b.cy];}, lab:"centre de gravité de la caisse"},
 {n:"Réaction du sol sur la même caisse (au repos)", sc:10, F:4*9.81, ang:-90, org:function(b){return [b.cx,b.by];}, lab:"point de contact avec le sol"},
 {n:"Une personne tire un traîneau avec une corde horizontale : force de 25 N vers la droite", sc:10, F:25, ang:0, org:function(b){return [b.rx,b.cy];}, lab:"point d'attache de la corde"},
 {n:"Poids de la même caisse de 4 kg sur la Lune (g = 1,62 N/kg)", sc:2, F:4*1.62, ang:90, org:function(b){return [b.cx,b.cy];}, lab:"centre de gravité de la caisse"}
];
SIM("p3-c07-dessiner-force", function(k,S){
  var c = mkc(k,0.8,1.0);
  var sel = k.select("Situation",SCEN.map(function(s,i){return [i,"Situation "+(i+1)];}),0);
  var res = k.note("","");
  k.button("Effacer la flèche", function(){ ar=null; ok=null; });
  k.button("Vérifier", function(){ check(); }, true);
  var ar=null, ok=null, box={}, CM=36, shown=false;
  function sc(){ return SCEN[+sel.value]; }
  c.pointer(function(t,p){ if(t==="down"){ ar={x0:p.x,y0:p.y,x1:p.x,y1:p.y}; ok=null; shown=false; }
    else if(t==="drag"&&ar){ ar.x1=p.x; ar.y1=p.y; k.redraw(); } else if(t==="up"&&ar){ ar.x1=p.x; ar.y1=p.y; k.redraw(); } });
  function check(){
    var s=sc(); if(!ar||Math.hypot(ar.x1-ar.x0,ar.y1-ar.y0)<8){ ok={msg:"Dessine d'abord une flèche.",kind:"warn"}; return; }
    var o=s.org(box), dx=ar.x1-ar.x0, dy=ar.y1-ar.y0, len=Math.hypot(dx,dy)/CM*s.sc, ang=Math.atan2(dy,dx)*180/Math.PI;
    var okPt=Math.hypot(ar.x0-o[0],ar.y0-o[1])<24, diff=Math.abs(((ang-s.ang)%360+540)%360-180);
    var okDir=diff<=10||diff>=170, okSens=diff<=10, okVal=Math.abs(len-s.F)/s.F<=0.12, ms=[]; shown=true;
    ms.push((okPt?"✓":"✗")+" point d'application"+(okPt?"":" : cherche le "+s.lab));
    ms.push((okDir?"✓":"✗")+" direction"+(okDir?"":" : la force est "+(s.ang===0?"horizontale":"verticale")));
    ms.push((okSens?"✓":"✗")+" sens");
    ms.push((okVal?"✓":"✗")+" valeur : ta flèche représente "+F(len,1)+" N, attendu "+F(s.F,1)+" N ("+F(s.F/s.sc,1)+" cm)");
    ok={msg:ms.join("<br>"),kind:(okPt&&okDir&&okSens&&okVal)?"ok":"warn"};
  }
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), s=sc(), g=c.ctx;
    /* quadrillage léger */
    g.save(); g.strokeStyle="rgba(120,140,170,.14)"; g.lineWidth=1; for(var x=0;x<W;x+=CM){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); } for(var y=0;y<H;y+=CM){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); } g.restore();
    var gy=H*0.72; rect(c,0,gy,W,H-gy,"#e4dccb"); ln(c,[0,gy],[W,gy],"#8a6d3b",3);
    var bw=Math.min(110,W*0.26), bx=W/2-bw/2-(+sel.value===2?W*0.12:0);
    box={cx:bx+bw/2,cy:gy-bw/2,by:gy,rx:bx+bw};
    if(+sel.value===2){ rect(c,bx,gy-bw*0.5,bw*1.25,bw*0.5,"#c9a36b","#6b4f26",2.4,6); ln(c,[bx-6,gy+2],[bx+bw*1.35,gy+2],"#6b4f26",4); box.rx=bx+bw*1.25; box.cy=gy-bw*0.25; lab(c,"traîneau",bx+bw*0.62,box.cy,P.ink,{size:f,bg:false}); wire(c,[[box.rx,box.cy],[box.rx+36,box.cy]],"#7a5a2e",3); }
    else { rect(c,bx,gy-bw,bw,bw,"#d9b98a","#6b4f26",2.4,6); ln(c,[bx,gy-bw],[bx+bw,gy],"rgba(107,79,38,.25)",2); ln(c,[bx+bw,gy-bw],[bx,gy],"rgba(107,79,38,.25)",2); lab(c,"4 kg",bx+bw/2,gy-bw/2,P.ink,{size:f+1,bg:false}); }
    /* énoncé */
    D.panel(c,8,8,W-16,W<430?58:44,{shadow:false}); wrap(c,s.n,W/2,W<430?24:30,W-40,P.ink,f,f+4);
    chip(c,"échelle : 1 cm ↔ "+s.sc+" N",W/2,W<430?82:68,P.acc,{size:f-1});
    /* règle */
    D.line(c,16,H-24,16+CM,H-24,P.ink,3); ln(c,[16,H-30],[16,H-18],P.ink,2); ln(c,[16+CM,H-30],[16+CM,H-18],P.ink,2); lab(c,"1 cm",16+CM+30,H-24,P.grey,{size:f-1,bg:false});
    if(shown){ var o=s.org(box), L=s.F/s.sc*CM, a=s.ang*Math.PI/180; D.arrow(c,o[0],o[1],o[0]+Math.cos(a)*L,o[1]+Math.sin(a)*L,"rgba(36,119,90,.55)",5); lab(c,"attendu",o[0]+Math.cos(a)*L*0.5+14,o[1]+Math.sin(a)*L*0.5-10,P.green,{size:f-1}); }
    if(ar){ circ(c,ar.x0,ar.y0,5,P.red); var dl=Math.hypot(ar.x1-ar.x0,ar.y1-ar.y0); if(dl>6){ D.arrow(c,ar.x0,ar.y0,ar.x1,ar.y1,P.red,3.4); chip(c,F(dl/CM*s.sc,1)+" N",(ar.x0+ar.x1)/2+16,(ar.y0+ar.y1)/2-12,P.red,{size:f}); } }
    else chip(c,"Appuie, glisse, relâche",W/2,H*0.3,P.grey,{size:f});
    res.set(ok?ok.msg:"La flèche part de l'endroit où tu appuies. Longueur attendue = valeur ÷ échelle. La valeur de ta flèche s'affiche en direct.",ok?ok.kind:"");
  });
});

/* ---------- 3 · Ressort et loi de Hooke ---------- */
SIM("p3-c07-ressort", function(k,S){
  var c = mkc(k,0.9,1.3);
  var kk = k.select("Ressort",[["20","Ressort mou : k = 20 N/m"],["40","Ressort moyen : k = 40 N/m"],["80","Ressort raide : k = 80 N/m"]],"40");
  var m = k.slider("Masse accrochée",0,600,50,200,"g");
  var ro = k.readouts(["Force exercée (poids)","Allongement","Raideur (force ÷ allongement)"]);
  var nt = k.note("","");
  var pts=[], dragM=false;
  k.button("Noter la mesure",function(){ if(m.value>0 && m.value*0.00981<=4.5) pts.push({F:m.value*0.00981,k:+kk.value}); },true);
  k.button("Effacer les mesures",function(){ pts=[]; });
  c.pointer(function(ty,p){ if(ty==="down") dragM=p.x<c.W*0.4; if((ty==="down"||ty==="drag")&&dragM){ m.set(Math.round(clamp((p.y-c.H*0.35)/(c.H*0.5),0,1)*600/50)*50); k.redraw(); } if(ty==="up") dragM=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), K=+kk.value, Fn=m.value/1000*9.81, dl=Fn/K, over=Fn>4.5;
    var narrow=W<520, x=narrow?W*0.17:W*0.15, top=18, pxm=(H-top-70)/0.40, y0=top+0.10*pxm, y1=top+(0.10+dl)*pxm;
    rect(c,x-30,top-8,60,10,"#9aa7ba",null,0,3); ln(c,[x,top],[x,top+4],P.ink,3); spring(c,x,top+2,y1,10,13,over?P.red:"#5d6b82",2.8);
    /* règle graduée */
    var rx=x+46; rect(c,rx,top,13,0.4*pxm,"#fff","#8795ab",1.2,2); for(var i=0;i<=40;i+=2){ var yy=top+i/100*pxm; ln(c,[rx,yy],[rx+(i%10===0?9:5),yy],P.grey,1); if(i%10===0&&i>0) lab(c,String(i),rx+16,yy,P.grey,{size:f-2.5,align:"left",bg:false}); }
    var sz=22+Math.sqrt(m.value/1000)*26; if(m.value>0){ rect(c,x-sz/2,y1,sz,sz*0.85,"#b9c3d3","#26364d",2.2,6); lab(c,F(m.value,0)+" g",x,y1+sz*0.42,P.ink,{size:f-1,bg:false}); }
    ln(c,[x-24,y0],[rx+13,y0],P.grey,1.3,[3,3]);
    if(dl>0.002){ D.arrow(c,x-30,y0,x-30,y1,P.green,2.4); chip(c,"Δℓ = "+F(dl*100,1)+" cm",x+10,H-12,P.green,{size:f-1}); }
    if(m.value===0) chip(c,"tire la masse ↕",x,top+0.3*pxm,P.grey,{size:f-2});
    /* graphe */
    var gx=narrow?W*0.52:W*0.34, ax=D.axes(c,{x0:0,x1:0.30,y0:0,y1:6,xl:"Δℓ (m)",yl:"F (N)",stepX:0.1,stepY:1,l:gx+34,r:14,t:20,b:38});
    D.fn(c,ax,function(x2){ return x2<=4.5/K?K*x2:NaN; },P.acc,3); D.fn(c,ax,function(x2){ return x2>4.5/K?K*x2:NaN; },P.red,2.4,[5,4]);
    ln(c,[ax.X(0),ax.Y(4.5)],[ax.X(0.3),ax.Y(4.5)],"rgba(192,50,29,.4)",1.4,[4,4]); chip(c,"limite 4,5 N",ax.X(0.3),ax.Y(4.5)-12,P.red,{align:"right",size:f-2});
    pts.forEach(function(p){ circ(c,ax.X(p.F/p.k),ax.Y(p.F),5,p.k===K?P.acc:P.grey,"#fff",1.5); });
    ln(c,[ax.X(dl),ax.Y(Fn)],[ax.X(dl),ax.Y(0)],P.acc,1.2,[3,3]); ln(c,[ax.X(0),ax.Y(Fn)],[ax.X(dl),ax.Y(Fn)],P.acc,1.2,[3,3]);
    circ(c,ax.X(Math.min(dl,0.3)),ax.Y(Math.min(Fn,6)),7,"#fff",over?P.red:P.acc,3.2);
    ro.set(0,F(Fn,2)+" N"); ro.set(1,F(dl*100,1)+" cm"); ro.set(2,Fn>0?F(Fn/dl,0)+" N/m":"—");
    nt.set(over?"<b>Limite d'élasticité dépassée</b> (F &gt; 4,5 N) : le ressort s'étire de façon permanente, F = k·Δℓ n'est plus valable. Le pointillé est hors modèle.":"F = "+F(Fn,2)+" N ; Δℓ = F / k = "+F(Fn,2)+" / "+K+" = "+F(dl*100,1)+" cm. Note plusieurs mesures : les points sont alignés sur une droite passant par l'origine.","ok");
  });
});

/* ---------- 4 · Balances en orbite ---------- */
var LIEUX=[["terre","Sur la Terre",9.81,false],["lune","Sur la Lune",1.62,false],["iss","Dans la station spatiale (400 km)",8.69,true],["loin","Très loin de tout astre",0.0,true]];
var INSTR=[["pese","Pèse-personne à ressort (étalonné sur Terre)"],["dyn","Dynamomètre"],["plat","Balance à plateaux"],["iner","Balance d'inertie (oscillations)"]];
SIM("p3-c07-balance-orbite", function(k,S){
  var c = mkc(k,0.8,1.05);
  var lieu = k.select("Lieu",LIEUX.map(function(l){return [l[0],l[1]];}),"terre");
  var ins = k.select("Instrument",INSTR,"pese");
  var m = k.slider("Masse de l'astronaute",20,100,5,70,"kg");
  var ro = k.readouts(["Attraction de l'astre","Lecture de l'instrument","Vraie masse"]);
  var nt = k.note("","");
  var ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  k.draw(function(){
    var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    var L=LIEUX.filter(function(l){return l[0]===lieu.value;})[0], mk=m.value, att=mk*L[2], fall=L[3], id=lieu.value, iv=ins.value;
    var read, msg, kind="ok";
    if(iv==="pese"){ read=fall?"0 kg":F(att/9.81,1)+" kg"; msg=fall?"En chute libre, l'astronaute n'appuie plus sur le pèse-personne : il indique 0.":(id==="terre"?"Sur Terre, l'étalonnage est bon : lecture = masse.":"Il mesure la force d'appui, étalonnée pour g = 9,81 N/kg : sur la Lune il indique "+F(att/9.81,1)+" kg au lieu de "+F(mk,0)+" kg. La masse, elle, n'a pas changé."); if(!fall&&id!=="terre") kind="warn"; }
    else if(iv==="dyn"){ read=fall?"0 N":F(att,0)+" N"; msg=fall?"Le dynamomètre mesure la force de traction : en chute libre, rien ne tire sur lui.":"Le dynamomètre indique le poids : "+F(mk,0)+" kg × "+F(L[2],2)+" N/kg = "+F(att,0)+" N. Le poids dépend du lieu."; }
    else if(iv==="plat"){ read=fall?"ne fonctionne pas":F(mk,0)+" kg"; msg=fall?(id==="loin"?"Sans attraction, aucune force ne fait pencher la balance : impossible de comparer.":"Les plateaux sont aussi en chute libre : rien ne les fait pencher. La balance ne fonctionne pas."):"La balance à plateaux compare des masses (le poids change de la même façon des deux côtés) : lecture = masse, partout où il y a de la pesanteur."; }
    else { read=F(mk,0)+" kg"; msg="La balance d'inertie mesure la période d'oscillation d'un siège sur ressort : elle dépend de la masse, pas du poids. Elle fonctionne même en apesanteur : c'est l'instrument des astronautes."; }
    /* décor */
    var space=(id==="loin"), iss=(id==="iss");
    if(space){ grad(c,0,0,W,H,"#0b1226","#141d3a"); for(var i=0;i<40;i++) circ(c,(i*97)%(W-10)+5,(i*53)%(H-10)+5,1+(i%3)*0.5,"rgba(255,255,255,"+(0.4+(i%4)*0.15)+")"); }
    else if(iss){ grad(c,0,0,W,H,"#dfe8f6","#cbd8ee"); rect(c,0,0,W,H*0.1,"#b6c4dd"); rect(c,0,H*0.9,W,H*0.1,"#b6c4dd"); for(i=0;i<5;i++) rect(c,W*(0.1+i*0.2),H*0.1,6,H*0.8,"#c2cfe4"); var wx=W*0.62; circ(c,wx,H*0.3,H*0.14,"#0b1226","#8795ab",5); planet(c,wx+H*0.02,H*0.34,H*0.1,"#3b82c4",false); }
    else if(id==="lune"){ grad(c,0,0,W,H,"#0b1226","#1c2748"); for(i=0;i<25;i++) circ(c,(i*97)%(W-10)+5,(i*53)%(H*0.5)+5,1.2,"rgba(255,255,255,.7)"); planet(c,W*0.82,H*0.2,H*0.07,"#3b82c4",false); rect(c,0,H*0.78,W,H*0.22,"#9a9da4"); circ(c,W*0.3,H*0.85,14,"#85888f"); circ(c,W*0.7,H*0.9,9,"#85888f"); }
    else { grad(c,0,0,W,H,"#cfe6fb","#eaf5ff"); rect(c,0,H*0.78,W,H*0.22,"#9fcf8e"); }
    var inkc=space?"#fff":"#13233a", gy=H*0.78;
    var cx=W*0.26, bob=fall?Math.sin(ph*1.2)*8:0, ay=fall?H*0.5+bob:gy-70;
    /* astronaute */
    var suit=(id==="terre")?"#ec8b3a":"#f4f6fa";
    rect(c,cx-14,ay-8,28,48,suit,"#26364d",2,9); circ(c,cx,ay-24,13,"#e8edf5","#26364d",2.2); rect(c,cx-8,ay-30,16,10,"#2d3e5c",null,0,4);
    ln(c,[cx-12,ay+4],[cx-26,ay+(fall?-10:24)],suit==="#f4f6fa"?"#9aa7ba":"#c46a1c",5); ln(c,[cx+12,ay+4],[cx+26,ay+(fall?-6:24)],suit==="#f4f6fa"?"#9aa7ba":"#c46a1c",5);
    ln(c,[cx-6,ay+40],[cx-9,ay+(fall?66:70)],"#8795ab",5); ln(c,[cx+6,ay+40],[cx+9,ay+(fall?66:70)],"#8795ab",5);
    if(!fall){ lab(c,id==="lune"?"sol lunaire":"sol terrestre",W-10,gy+16,P.grey,{align:"right",size:f-1,bg:false}); }
    if(att>0.5){ var al=Math.min(H*0.22,att/6); D.arrow(c,cx+44,ay+10,cx+44,ay+10+al,P.red,3.6); chip(c,F(att,0)+" N",cx+52,ay+10+al/2,P.red,{align:"left",size:f-1}); }
    if(fall){ chip(c,iss?"chute libre avec la station":"attraction ≈ 0",cx,ay+92,space?"#9db0d4":P.grey,{size:f-1,color:null}); }
    /* instrument */
    var dx=W*0.56, dw=W*0.38, dy=H*0.4, dh=H*0.4, name=INSTR.filter(function(q){return q[0]===iv;})[0][1].split(" (")[0];
    D.panel(c,dx,dy-30,dw,dh+40,{shadow:true}); lab(c,name.replace("Pèse-personne à ressort","Pèse-personne").replace("Balance d'inertie","B. d'inertie").replace("Balance à plateaux","B. à plateaux"),dx+dw/2,dy-14,P.ink,{size:f-2,bg:false});
    if(iv==="plat"){ var pcx=dx+dw/2, py=dy+10, tilt=fall?0:0; ln(c,[pcx,py],[pcx,py+dh*0.7],"#5d6b82",4); ln(c,[pcx-dw*0.38,py+8],[pcx+dw*0.38,py+8],"#5d6b82",4);
      rect(c,pcx-dw*0.46,py+16,dw*0.3,6,"#b9c3d3","#26364d",1.6,2); rect(c,pcx+dw*0.16,py+16,dw*0.3,6,"#b9c3d3","#26364d",1.6,2); rect(c,pcx-dw*0.40,py-2,dw*0.18,14,"#d9b98a","#6b4f26",1.6,2); rect(c,pcx+dw*0.22,py-2,dw*0.18,14,"#d9b98a","#6b4f26",1.6,2);
      lab(c,"astronaute",pcx-dw*0.31,py-10,P.grey,{size:f-3,bg:false}); lab(c,"étalons",pcx+dw*0.31,py-10,P.grey,{size:f-3,bg:false}); D.display(c,read,pcx,dy+dh-4,{w:dw*0.8,h:34,size:fall?12:16,color:fall?"#9b2314":"#13233a"}); }
    else if(iv==="iner"){ var pcx2=dx+dw/2, sw=Math.sin(ph*(Math.sqrt(100/mk)*3))*dw*0.2; rect(c,pcx2-dw*0.3,dy+dh*0.62,dw*0.6,8,"#8795ab",null,0,3); spring(c,pcx2-dw*0.3,dy+dh*0.66,pcx2-dw*0.3+sw-0.001,6,6,"#5d6b82",2); wire(c,[[pcx2-dw*0.3,dy+dh*0.5],[pcx2+sw,dy+dh*0.5]],"#5d6b82",2); rect(c,pcx2-14+sw,dy+dh*0.4,28,22,"#b9c3d3","#26364d",2,5);
      D.display(c,read,pcx2,dy+dh-4,{w:dw*0.8,h:34,size:16}); lab(c,"période T → masse",pcx2,dy+10,P.grey,{size:f-2,bg:false}); }
    else { /* cadran */
      var ccx=dx+dw/2, ccy=dy+dh*0.52, R=Math.min(dw*0.38,dh*0.42); circ(c,ccx,ccy,R,"#fff","#26364d",2.6);
      var mx=iv==="pese"?100:1000; for(i=0;i<=10;i++){ var an=Math.PI*0.75+Math.PI*1.5*i/10; ln(c,[ccx+Math.cos(an)*R*0.82,ccy+Math.sin(an)*R*0.82],[ccx+Math.cos(an)*R*0.95,ccy+Math.sin(an)*R*0.95],P.ink,1.6); if(i%2===0) lab(c,F(mx*i/10,0),ccx+Math.cos(an)*R*0.66,ccy+Math.sin(an)*R*0.66,P.grey,{size:f-3.5,bg:false}); }
      var val=iv==="pese"?(fall?0:att/9.81):(fall?0:att), an2=Math.PI*0.75+Math.PI*1.5*clamp(val/mx,0,1); wire(c,[[ccx,ccy],[ccx+Math.cos(an2)*R*0.8,ccy+Math.sin(an2)*R*0.8]],P.red,3.2); circ(c,ccx,ccy,4,P.ink);
      lab(c,iv==="pese"?"kg":"N",ccx,ccy+R*0.4,P.grey,{size:f-1,bg:false}); D.display(c,read,ccx,dy+dh+8,{w:dw*0.7,h:30,size:14}); }
    ro.set(0,id==="loin"?"≈ 0 N":F(att,0)+" N"); ro.set(1,read); ro.set(2,F(mk,0)+" kg"); nt.set(msg,kind);
  });
});

})();
