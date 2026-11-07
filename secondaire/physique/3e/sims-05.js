/* Chapitre 5 · Circuits en série et en dérivation */
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
META["p3-c05-serie-derivation"]={
  id:"p3-c05-serie-derivation", ch:"c05", tag:"Classique",
  titre:"Série ou dérivation : ajoute des lampes",
  resume:"Ajoute des lampes identiques et compare l'éclat, la tension et l'intensité dans les deux montages.",
  but:"Choisis le montage, ajoute des lampes et observe la luminosité, la tension aux bornes de chaque lampe et les intensités.",
  aRetenir:"En série : même intensité partout, les tensions se partagent (U = U₁ + U₂ + …) : plus on ajoute de lampes, moins chacune brille. En dérivation : même tension aux bornes de chaque branche, les intensités s'additionnent (I = I₁ + I₂ + …) : chaque lampe brille comme si elle était seule, mais la pile débite davantage.",
  piege:"En dérivation, la tension n'est pas divisée : chaque lampe reçoit toute la tension de la pile. Et l'intensité ne se partage « moitié-moitié » que si les branches sont identiques. (Pile idéale de 6 V ; lampes de 10 Ω.)",};
META["p3-c05-devisser"]={
  id:"p3-c05-devisser", ch:"c05", tag:"Interactif",
  titre:"Dévisser une lampe : les autres s'éteignent-elles ?",
  resume:"Clique sur une lampe pour la dévisser, en série puis en dérivation.",
  but:"Clique sur une lampe (ou coche la case) pour la dévisser ou la revisser. Compare les deux montages.",
  aRetenir:"En série, une lampe dévissée coupe toute la boucle : tout s'éteint. En dérivation, chaque branche est indépendante : les autres lampes continuent de briller (c'est le montage des prises et des lampes d'une maison).",
  piege:"En dérivation, quand on dévisse une lampe, les autres ne brillent ni plus ni moins : leur tension est inchangée. Seule l'intensité débitée par la pile diminue.",};
META["p3-c05-equivalente"]={
  id:"p3-c05-equivalente", ch:"c05", tag:"Graphique",
  titre:"Résistance équivalente de deux résistances",
  resume:"Combine R₁ et R₂ en série ou en dérivation et lis la résistance équivalente sur le graphique.",
  but:"Règle R₁ et R₂, choisis le montage. Observe la résistance équivalente et sa courbe en fonction de R₂.",
  aRetenir:"En série : R = R₁ + R₂ (toujours plus grande que chacune). En dérivation : 1/R = 1/R₁ + 1/R₂, soit R = R₁R₂ / (R₁ + R₂) : toujours plus petite que la plus petite des deux.",
  piege:"En dérivation, la résistance équivalente diminue quand on ajoute une branche, même si cette branche a une très grande résistance : on ajoute un chemin de plus pour le courant.",};
META["p3-c05-panne"]={
  id:"p3-c05-panne", ch:"c05", tag:"Jeu d'enquête",
  titre:"Chasse à la panne : trouve la coupure en peu de mesures",
  resume:"Un circuit en série ne marche pas : un élément est coupé. Localise-le avec un voltmètre.",
  but:"Un élément du circuit est coupé. Place le voltmètre entre deux points et note le résultat. Trouve la panne avec le moins de mesures possible, puis donne ton diagnostic.",
  aRetenir:"Dans une boucle en série interrompue, la tension de la pile apparaît entièrement aux bornes de la coupure et nulle part ailleurs (les éléments sains n'ont pas de courant, donc pas de tension). Un voltmètre qui affiche 6 V entoure donc la panne : on coupe le circuit en deux (recherche par dichotomie).",
  piege:"Un élément sain en circuit coupé affiche 0 V : ce n'est pas lui qui est en cause. Ne conclus pas sur la lampe qui ne brille pas : aucune lampe ne brille quand la boucle est coupée.",};
var E=6, RL=10, PN=0.6;
function bri(I){ return Math.min(1.3, I*I*RL/PN); }
/* socle de lampe : sert à montrer une lampe dévissée */
function socket(c,x,y,open){ rect(c,x-12,y-8,24,16,"#d5dbe5","#7c8aa0",1.6,3); if(open){ circ(c,x-12,y,3,"#fff",WC,1.8); circ(c,x+12,y,3,"#fff",WC,1.8); } }

/* ---------- 1 · Série ou dérivation ---------- */
SIM("p3-c05-serie-derivation", function(k,S){
  var c = mkc(k,0.78,0.98);
  var n = k.slider("Nombre de lampes", 1, 5, 1, 2, "");
  var mt = k.seg("Montage", [["s","En série"],["p","En dérivation"]], "s");
  var ro = k.readouts(["Intensité dans la pile","Tension par lampe","Intensité par lampe","Éclat de chaque lampe"]);
  var nt = k.note("","");
  var ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), N=n.value, ser=mt.value==="s";
    var I = ser ? E/(RL*N) : N*E/RL, Il = ser ? I : E/RL, Ul = ser ? E/N : E, b = bri(Il);
    var x0=W*0.13,x1=W*0.9,y0=H*0.22,y1=H*0.72, cy=(y0+y1)/2, spd=0.1+Math.min(0.5,Il*0.5), dots=Math.round(clamp(I*14,4,24));
    wire(c,[[x0,y1],[x0,y0]],WC,3.4); pile(c,x0,cy,-Math.PI/2,true); chip(c,"6 V",x0+34,cy,P.grey,{size:f-1});
    if (ser){
      var path=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]; wire(c,path,WC,3.4);
      for (var i=0;i<N;i++){ var lx=x0+(x1-x0)*(i+1)/(N+1); rect(c,lx-20,y0-20,40,40,BG); lamp(c,lx,y0,15,b,false); chip(c,F(Ul,1)+" V",lx,y0-32,P.amber,{size:f-1}); }
      pile(c,x0,cy,-Math.PI/2,true); flow(c,path,-ph*spd,dots,"#3d78e0",3);
      chip(c,"même intensité I = "+F(I,2)+" A partout",(x0+x1)/2,y1+30,P.ink);
    } else {
      wire(c,[[x0,y0],[x1,y0]],WC,3.4); wire(c,[[x0,y1],[x1,y1]],WC,3.4);
      flow(c,[[x0,y1],[x0,y0],[x1-6,y0]],-ph*spd,Math.round(dots/2),"#3d78e0",3);
      for (i=0;i<N;i++){ var bx=x0+(x1-x0)*(i+1)/(N+1)+(N===1?0:0); wire(c,[[bx,y0],[bx,y1]],WC,3.4); rect(c,bx-20,cy-20,40,40,BG); lamp(c,bx,cy,15,b,false); chip(c,F(Ul,1)+" V",bx,cy-32,P.amber,{size:f-1});
        flow(c,[[bx,y0],[bx,y1]],-ph*spd,Math.max(2,Math.round(dots/(N+1))),"#3d78e0",3); circ(c,bx,y0,3.6,WC); circ(c,bx,y1,3.6,WC); }
      chip(c,"même tension U = 6 V sur chaque branche",(x0+x1)/2,y1+30,P.ink);
    }
    chip(c,(ser?"En série":"En dérivation")+" · "+N+" lampe"+(N>1?"s":"")+" · I pile = "+F(I,2)+" A",W/2,H*0.07,P.grey,{size:f-0.5});
    var bx0=W/2-70; lab(c,"éclat",bx0-10,H*0.92,P.grey,{size:f,align:"right",weight:700}); bar(c,bx0,H*0.92-6,120,12,Math.min(1,b),P.amber);
    lab(c,F(Math.min(1,b)*100,0)+" %",bx0+132,H*0.92,P.amber,{size:f,align:"left",weight:800});
    ro.set(0,F(I,2)+" A"); ro.set(1,F(Ul,2)+" V"); ro.set(2,F(Il,2)+" A"); ro.set(3,F(Math.min(1,b)*100,0)+" %");
    nt.set(ser?"En série avec "+N+" lampe"+(N>1?"s":"")+" : chacune reçoit "+F(E,0)+" / "+N+" = "+F(Ul,2)+" V. Éclat relatif : (U/6)² = "+F(b*100,0)+" %.":"En dérivation : chaque lampe reçoit les 6 V, donc brille à 100 %, mais la pile fournit "+N+" × 0,6 = "+F(I,1)+" A. (Pile idéale de 6 V ; lampes de 10 Ω.)","ok");
  });
});

/* ---------- 2 · Dévisser une lampe ---------- */
SIM("p3-c05-devisser", function(k,S){
  var c = mkc(k,0.78,0.98);
  var mt = k.seg("Montage", [["s","En série"],["p","En dérivation"]], "s");
  var st=[false,false,false], tg=[];
  for (var i=0;i<3;i++) (function(i){ tg[i]=k.toggle("Lampe "+(i+1)+" dévissée", false, function(v){ st[i]=v; }); })(i);
  var ro = k.readouts(["Intensité dans la pile","Lampes allumées"]);
  var nt = k.note("","");
  var pos=[], ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(t,p){ if(t!=="down") return; pos.forEach(function(q,i){ if(Math.hypot(p.x-q[0],p.y-q[1])<34){ st[i]=!st[i]; tg[i].set(st[i]); k.redraw(); } }); });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), ser=mt.value==="s";
    var x0=W*0.13,x1=W*0.9,y0=H*0.26,y1=H*0.74,cy=(y0+y1)/2, nOn=st.filter(function(s){return !s;}).length, I, Il=[0,0,0];
    if (ser){ I = nOn===3 ? E/(3*RL) : 0; Il=[I,I,I]; } else { I = nOn*E/RL; Il=st.map(function(s){return s?0:E/RL;}); }
    wire(c,[[x0,y1],[x0,y0]],WC,3.4); pile(c,x0,cy,-Math.PI/2,true); chip(c,"6 V",x0+34,cy,P.grey,{size:f-1});
    pos=[]; var spd=0.1+Math.min(0.5,I*0.4);
    if (ser){
      var path=[[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]; wire(c,path,WC,3.4);
      for (i=0;i<3;i++){ var lx=x0+(x1-x0)*(i+1)/4; pos.push([lx,y0]); rect(c,lx-24,y0-26,48,54,BG);
        if(st[i]){ socket(c,lx,y0+6,true); lamp(c,lx,y0-22,14,0,false); chip(c,"dévissée",lx,y0+30,P.red,{size:f-1}); } else lamp(c,lx,y0,15,bri(Il[i]),false);
        chip(c,"L"+(i+1),lx,y0-42,P.grey,{size:f-1}); }
      if (I>0) flow(c,path,-ph*spd,14,"#3d78e0",3);
    } else {
      wire(c,[[x0,y0],[x1,y0]],WC,3.4); wire(c,[[x0,y1],[x1,y1]],WC,3.4);
      flow(c,[[x0,y1],[x0,y0],[x1,y0]],-ph*spd,Math.max(0,Math.round(nOn*3)),"#3d78e0",3);
      for (i=0;i<3;i++){ var bx=x0+(x1-x0)*(i+1)/4; pos.push([bx,cy]); wire(c,[[bx,y0],[bx,y1]],st[i]?"#c9d1dc":WC,3.4); rect(c,bx-24,cy-28,48,56,BG);
        if(st[i]){ socket(c,bx,cy+6,true); lamp(c,bx,cy-24,14,0,false); chip(c,"dévissée",bx,cy+32,P.red,{size:f-1}); } else { lamp(c,bx,cy,15,bri(Il[i]),false); flow(c,[[bx,y0],[bx,y1]],-ph*spd,3,"#3d78e0",3); }
        chip(c,"L"+(i+1),bx,y0+(W<430?-16:-16)-4,P.grey,{size:f-1}); }
    }
    chip(c,"clique sur une lampe pour la dévisser",W/2,H*0.07,P.grey,{size:f-1});
    ro.set(0,F(I,2)+" A"); ro.set(1,(ser?(I>0?3:0):nOn)+" sur 3");
    nt.set(ser?(nOn<3?"<b>Boucle coupée</b> : plus aucun courant, toutes les lampes sont éteintes.":"Les 3 lampes en série : chacune reçoit 2 V, elles brillent peu ("+F(bri(E/(3*RL))*100,0)+" %)."):(nOn===3?"Les 3 branches fonctionnent, chacune reçoit 6 V : I = 3 × 0,6 = 1,8 A.":nOn===0?"Toutes les lampes sont dévissées : plus de courant.":"Les lampes encore vissées continuent de briller à 100 % (6 V chacune). La pile ne débite plus que "+nOn+" × 0,6 = "+F(I,1)+" A."),"ok");
  });
});

/* ---------- 3 · Résistance équivalente ---------- */
SIM("p3-c05-equivalente", function(k,S){
  var c = mkc(k,1.0,1.1);
  var r1 = k.slider("R₁", 1, 100, 1, 30, "Ω");
  var r2 = k.slider("R₂", 1, 100, 1, 60, "Ω");
  var mt = k.seg("Montage", [["s","En série"],["p","En dérivation"]], "p");
  var ro = k.readouts(["Résistance équivalente","Intensité sous 12 V","Plus petite des deux"]);
  var nt = k.note("","");
  var ax=null, ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  function req(a,b,ser){ return ser?a+b:a*b/(a+b); }
  c.pointer(function(t,p){ if((t==="down"||t==="drag")&&ax&&p.y>ax.T-10){ r2.set(Math.round(clamp(ax.ix(p.x),1,100))); k.redraw(); } });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), ser=mt.value==="s", a=r1.value, b=r2.value, r=req(a,b,ser), I=12/r;
    /* schéma en haut */
    var sy0=H*0.06, sy1=H*0.3, sx0=W*0.1, sx1=W*0.9, scy=(sy0+sy1)/2, spd=0.1+Math.min(0.4,I*0.15);
    var path=[[sx0,sy0],[sx1,sy0],[sx1,sy1],[sx0,sy1],[sx0,sy0]]; wire(c,[[sx0,sy1],[sx0,sy0]],WC,3.2); pile(c,sx0,scy,-Math.PI/2,true); chip(c,"12 V",sx0+34,scy,P.grey,{size:f-1});
    if (ser){ wire(c,[[sx0,sy0],[sx1,sy0],[sx1,sy1],[sx0,sy1]],WC,3.2); resis(c,sx0+(sx1-sx0)*0.35,sy0,50,F(a,0)+" Ω",P.red); resis(c,sx0+(sx1-sx0)*0.7,sy0,50,F(b,0)+" Ω",P.acc); flow(c,path,-ph*spd,12,"#3d78e0",2.8); }
    else { wire(c,[[sx0,sy0],[sx1,sy0]],WC,3.2); wire(c,[[sx0,sy1],[sx1,sy1]],WC,3.2); var bx1=sx0+(sx1-sx0)*0.45, bx2=sx0+(sx1-sx0)*0.8;
      wire(c,[[bx1,sy0],[bx1,sy1]],WC,3.2); wire(c,[[bx2,sy0],[bx2,sy1]],WC,3.2); rect(c,bx1-12,scy-26,24,52,BG); rect(c,bx2-12,scy-26,24,52,BG);
      rect(c,bx1-10,scy-24,20,48,"#fff",P.red,2.6,3); rect(c,bx2-10,scy-24,20,48,"#fff",P.acc,2.6,3);
      chip(c,F(a,0)+" Ω",bx1+36,scy,P.red,{size:f-1}); chip(c,F(b,0)+" Ω",bx2+(W<430?-34:36),scy,P.acc,{size:f-1});
      flow(c,[[sx0,sy1],[sx0,sy0],[sx1,sy0]],-ph*spd,6,"#3d78e0",2.8); flow(c,[[bx1,sy0],[bx1,sy1]],-ph*spd,3,"#3d78e0",2.8); flow(c,[[bx2,sy0],[bx2,sy1]],-ph*spd,3,"#3d78e0",2.8); }
    chip(c,"R équivalente = "+F(r,1)+" Ω",W/2,sy1+26,ser?P.acc:P.red);
    /* graphique */
    ax=D.axes(c,{x0:0,x1:100,y0:0,y1:200,xl:"R₂ (Ω)",yl:"R équivalente (Ω)",stepX:20,stepY:40,l:50,r:16,t:H*0.42,b:38});
    D.fn(c,ax,function(x){ return req(a,x,true); },P.acc,2.8); D.fn(c,ax,function(x){ return req(a,x,false); },P.red,2.8);
    D.line(c,ax.X(0),ax.Y(a),ax.X(100),ax.Y(a),P.grey,1.3,[5,4]); chip(c,"R₁ = "+F(a,0)+" Ω",ax.X(84),ax.Y(a)-12,P.grey,{size:f-1.5});
    chip(c,"série",ax.X(68),ax.Y(a+68)-18,P.acc,{size:f-1}); chip(c,"dérivation",ax.X(70),ax.Y(req(a,70,false))+18,P.red,{size:f-1});
    D.line(c,ax.X(b),ax.Y(r),ax.X(b),ax.Y(0),ser?P.acc:P.red,1.3,[4,3]);
    circ(c,ax.X(b),ax.Y(r),9,"#fff",ser?P.acc:P.red,3.4); chip(c,"glisse le point pour changer R₂",ax.X(52),ax.Y(176),P.grey,{size:f-1.5});
    ro.set(0,F(r,1)+" Ω"); ro.set(1,F(12/r,2)+" A"); ro.set(2,F(Math.min(a,b),0)+" Ω");
    nt.set(ser?"Série : "+F(a,0)+" + "+F(b,0)+" = <b>"+F(r,1)+" Ω</b>, plus grande que chacune.":"Dérivation : "+F(a,0)+" × "+F(b,0)+" / ("+F(a,0)+" + "+F(b,0)+") = <b>"+F(r,1)+" Ω</b>, plus petite que "+F(Math.min(a,b),0)+" Ω. Si R₁ = R₂, on obtient la moitié.","ok");
  });
});

/* ---------- 4 · Chasse à la panne ---------- */
var ELEM=["Lampe 1","Interrupteur","Lampe 2","Fil de liaison","Lampe 3"];
SIM("p3-c05-panne", function(k,S){
  var c = mkc(k,0.72,0.95);
  var opt=[0,1,2,3,4,5].map(function(i){ return [i,"Point "+i]; });
  var a = k.select("Voltmètre : borne 1",opt,0), b = k.select("Voltmètre : borne 2",opt,5);
  var res = k.note("Aucune mesure pour l'instant.","");
  var dg = k.select("Mon diagnostic : l'élément coupé est…",ELEM.map(function(e,i){return [i,e];}),0);
  var ro = k.readouts(["Mesures effectuées","Dernière lecture"]);
  var fault=Math.floor(Math.random()*5), n=0, last="—", lastV=null, log=[], solved=false, nextProbe=0, px=[];
  function measure(){ var i=+a.value, j=+b.value; if (i===j){ last="0 V (même point)"; lastV=0; return; }
    var lo=Math.min(i,j), hi=Math.max(i,j); n++; var v=(fault>=lo&&fault<hi)?E:0; last=F(v,1)+" V"; lastV=v; log.push("n°"+n+" : points "+lo+"–"+hi+" → "+F(v,1)+" V"); }
  k.button("Mesurer entre les deux points", function(){ measure(); }, true);
  k.button("Proposer ce diagnostic", function(){ solved=true; });
  k.button("Nouvelle panne", function(){ fault=Math.floor(Math.random()*5); n=0; last="—"; lastV=null; log=[]; solved=false; });
  c.pointer(function(t,p){ if(t!=="down") return; var best=-1,bd=1e9; px.forEach(function(q,i){ var d=Math.hypot(q[0]-p.x,q[1]-p.y); if(d<bd){bd=d;best=i;} }); if(best>=0&&bd<30){ (nextProbe===0?a:b).set(best); nextProbe=1-nextProbe; if(nextProbe===0) measure(); k.redraw(); } });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c);
    var x0=30,x1=W-30, step=(x1-x0)/5, y=H*0.42, py=H*0.78; px=[];
    wire(c,[[x0,y],[x1,y],[x1,py],[x0,py],[x0,y]],WC,3.4); pile(c,W/2,py,Math.PI,true); chip(c,"pile 6 V",W/2,py+30,P.grey,{size:f-1});
    for (var i=0;i<5;i++){ var mx=x0+step*(i+0.5), t=(i===0||i===2||i===4)?"l":i===1?"s":"f"; rect(c,mx-step*0.36,y-20,step*0.72,40,BG);
      if (t==="l") lamp(c,mx,y,Math.min(15,step*0.3),0,false);
      else if (t==="s") sw(c,mx,y,false,Math.min(44,step*0.7));
      else { ln(c,[mx-step*0.3,y],[mx+step*0.3,y],WC,3.4); }
      chip(c,step<68?["L1","Int.","L2","Fil","L3"][i]:ELEM[i],mx,y-32,P.grey,{size:f-1});
      if (solved && i===fault){ circ(c,mx,y,Math.min(24,step*0.45),null,P.red,3.4); chip(c,"coupure",mx,y+36,P.red,{size:f-1}); } }
    for (i=0;i<6;i++){ var pxx=x0+step*i, on=(i===+a.value||i===+b.value); px.push([pxx,y]); circ(c,pxx,y,on?7:5.5,on?(i===+a.value?P.red:P.acc):"#fff",on?"#fff":"#8795ab",2); lab(c,String(i),pxx,y+20,on?P.ink:P.grey,{size:f,weight:800}); }
    /* voltmètre et sondes */
    var pa=x0+step*(+a.value), pb=x0+step*(+b.value);
    ln(c,[pa,y-8],[pa,H*0.2],P.red,2.4); ln(c,[pb,y-8],[pb,H*0.2],P.acc,2.4);
    lcd(c,lastV===null?"– – –":F(lastV,1)+" V",W/2,H*0.115,Math.min(150,W*0.4),42,lastV===E?"#b3261e":"#13233a","voltmètre");
    ln(c,[pa,H*0.2],[W/2-30,H*0.18],P.red,2.4); ln(c,[pb,H*0.2],[W/2+30,H*0.18],P.acc,2.4);
    chip(c,"clique deux points du circuit pour mesurer",W/2,H*0.95,P.grey,{size:f-1});
    ro.set(0,String(n)); ro.set(1,last);
    var m=log.slice(-4).join("<br>"), verdict="";
    if (solved){ var ok=+dg.value===fault; verdict=ok?"<br><b>Bien joué : "+ELEM[fault]+" est coupé.</b> "+(n<=3?"Maximum d'efficacité : "+n+" mesures.":"Trouvé en "+n+" mesures (3 suffisent avec la dichotomie)."):"<br><b>Ce n'est pas "+ELEM[+dg.value]+".</b> La coupure était : "+ELEM[fault]+". Rejoue avec « Nouvelle panne »."; }
    res.set((log.length?m:"Aucune mesure pour l'instant.")+verdict, solved?(+dg.value===fault?"ok":"warn"):"");
  });
});

})();
