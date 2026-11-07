/* Chapitre 8 · Résultante et équilibre */
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
META["p3-c08-colineaires"]={
  id:"p3-c08-colineaires", ch:"c08", tag:"Classique",
  titre:"Deux forces sur un chariot : la résultante",
  resume:"Règle deux forces de même direction et lance le chariot : repos, accélération, ou vitesse constante ?",
  but:"Règle les forces F₁ et F₂ (positives vers la droite) et la vitesse de départ. Lance le chariot et regarde la vitesse évoluer.",
  aRetenir:"Pour des forces de même direction : on additionne les forces de même sens et on soustrait celles de sens contraires. La résultante R = F₁ + F₂ (en comptant les signes). Si R = 0, la vitesse ne change pas : un chariot lancé continue en ligne droite à vitesse constante, sans qu'aucune force ne soit nécessaire pour « le maintenir ».",
  piege:"« Il faut une force pour maintenir un mouvement » est faux : sans frottement, R = 0 donne une vitesse constante. C'est la résultante non nulle qui change la vitesse (ici : a = R / m, sans frottement)."};
META["p3-c08-parallelogramme"]={
  id:"p3-c08-parallelogramme", ch:"c08", tag:"Géométrie",
  titre:"Composer deux forces : le parallélogramme",
  resume:"Fais varier l'angle entre deux forces : la résultante est la diagonale du parallélogramme.",
  but:"Règle F₁, F₂ et l'angle α entre elles (ou glisse la pointe de F₂ à la souris). Compare la valeur de la résultante.",
  aRetenir:"La résultante de deux forces appliquées au même point est la diagonale du parallélogramme construit sur elles. Sa valeur dépend de l'angle : elle est maximale (F₁ + F₂) quand les forces ont même sens, minimale (|F₁ − F₂|) quand elles sont opposées. À 90° : R² = F₁² + F₂².",
  piege:"On ne peut pas additionner les valeurs « simplement » : 30 N + 40 N ne donnent 70 N que si les forces ont même direction et même sens. À 90°, on obtient 50 N."};
META["p3-c08-deux-fils"]={
  id:"p3-c08-deux-fils", ch:"c08", tag:"Surprenant",
  titre:"Un objet suspendu à deux fils : la tension explose",
  resume:"Écarte les fils : la tension de chaque fil dépasse vite le poids de l'objet.",
  but:"Règle la masse et l'angle entre les deux fils. Observe la tension de chaque fil et le triangle de forces. Jusqu'où les fils résistent-ils ?",
  aRetenir:"L'objet est en équilibre : la résultante des deux tensions compense le poids. Chaque fil porte T = P / (2·cos(α/2)) : à 0°, T = P/2 ; à 120°, T = P ; au-delà, T dépasse P. Plus les fils sont écartés, plus la tension est grande, et il est impossible de tendre les fils parfaitement horizontaux.",
  piege:"Deux fils ne portent pas « la moitié chacun » en général : seulement quand ils sont verticaux. Un fil presque horizontal supporte une tension bien supérieure au poids."};
META["p3-c08-equilibre-plan"]={
  id:"p3-c08-equilibre-plan", ch:"c08", tag:"Animation",
  titre:"Tirer une caisse : quand bouge-t-elle ?",
  resume:"Augmente la force de traction : le frottement s'oppose jusqu'à une valeur maximale.",
  but:"Règle la force de traction, la masse et la surface. Regarde les quatre forces et la résultante : la caisse reste immobile tant que la résultante est nulle.",
  aRetenir:"Une caisse immobile est en équilibre : poids et réaction du sol se compensent verticalement, traction et frottement se compensent horizontalement. Elle ne démarre que si la traction dépasse le frottement maximal f<sub>max</sub> = μ·m·g. Ensuite, la résultante n'est plus nulle : sa vitesse augmente.",
  piege:"Tant que la caisse ne bouge pas, le frottement vaut exactement la traction (il s'adapte) ; il ne vaut pas toujours μ·m·g. Modèle simplifié : frottement en mouvement = frottement maximal."};
function wheel(c,x,y,r,ph){ circ(c,x,y,r,"#fff",P.ink,2.5); ln(c,[x,y],[x+r*Math.cos(ph),y+r*Math.sin(ph)],P.ink,2); ln(c,[x,y],[x-r*Math.cos(ph),y-r*Math.sin(ph)],P.ink,2); }
function handle(c,x,y,col){ circ(c,x,y,9,"#fff",col,3); circ(c,x,y,3,col); }

/* ---------- 1 · Chariot : deux forces colinéaires ---------- */
SIM("p3-c08-colineaires", function(k,S){
  var c = mkc(k,1.05,1.25);
  var f1 = k.slider("Force F₁ (> 0 : vers la droite)",-40,40,5,20,"N");
  var f2 = k.slider("Force F₂ (> 0 : vers la droite)",-40,40,5,-20,"N");
  var m = k.slider("Masse du chariot",1,10,1,2,"kg");
  var v0 = k.slider("Vitesse de départ",-2,2,0.5,1,"m/s");
  var ro = k.readouts(["Résultante R","Accélération (sans frottement)","Vitesse"]);
  var nt = k.note("","");
  var st={t:0,x:0,v:0,run:false,hist:[]}, drag=null, geo={};
  function reset(){ st.t=0; st.x=0; st.v=v0.value; st.hist=[[0,v0.value]]; }
  reset();
  var lp=k.loop(function(dt){ if(!st.run) return; var a=(f1.value+f2.value)/m.value; st.v+=a*dt; st.x+=st.v*dt; st.t+=dt; st.hist.push([st.t,st.v]); if(st.t>=6) st.run=false; k.redraw(); });
  k.button("Lancer",function(){ reset(); st.run=true; },true);
  k.button("Réinitialiser",function(){ st.run=false; reset(); });
  lp.play();
  c.pointer(function(ty,p){ if(ty==="down"){ drag=null; var best=24; [[f1,geo.y1],[f2,geo.y2]].forEach(function(h,i){ var d=Math.hypot(p.x-(geo.cx+h[0].value*geo.k),p.y-h[1]); if(d<best){ best=d; drag=h[0]; } }); }
    if((ty==="down"||ty==="drag")&&drag){ drag.set(Math.round(clamp((p.x-geo.cx)/geo.k,-40,40)/5)*5); if(!st.run) reset(); k.redraw(); } if(ty==="up") drag=null; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, R=f1.value+f2.value, a=R/m.value;
    /* graphique v(t) */
    var gh=H*0.4, vm=Math.max(3,Math.abs(v0.value)+Math.abs(a)*6)*1.1;
    var ax=D.axes(c,{x0:0,x1:6,y0:-vm,y1:vm,xl:"t (s)",yl:"v (m/s)",stepX:1,l:44,r:14,t:14,b:H-14-gh,hideZero:false});
    D.line(c,ax.X(0),ax.Y(v0.value),ax.X(6),ax.Y(v0.value+a*6),"#bccae3",2,[5,4]);
    g.save(); g.strokeStyle=P.acc; g.lineWidth=3.2; g.lineJoin="round"; g.beginPath(); st.hist.forEach(function(p,i){ i?g.lineTo(ax.X(p[0]),ax.Y(p[1])):g.moveTo(ax.X(p[0]),ax.Y(p[1])); }); g.stroke(); g.restore();
    var last=st.hist[st.hist.length-1]; circ(c,ax.X(last[0]),ax.Y(last[1]),5.5,P.acc,"#fff",2);
    chip(c,"pointillé : vitesse prévue",ax.X(6),ax.Y(-vm)-8,P.grey,{align:"right",size:f-2});
    /* piste et chariot */
    var gy=H-40, cx=W/2, cw=Math.min(100,W*0.3);
    grad(c,0,gy,W,H-gy,"#dfe5ee","#cdd5e1"); ln(c,[0,gy],[W,gy],"#8795ab",3);
    for(var i=-8;i<=8;i++){ var tx=(((cx+i*60-st.x*40)%(W+120))+(W+120))%(W+120)-60; ln(c,[tx,gy],[tx,gy+9],"#8795ab",2); }
    rect(c,cx-cw/2,gy-48,cw,34,"#c9d1de","#26364d",2.6,6); rect(c,cx-cw/2+6,gy-44,cw-12,8,"#e8edf5",null,0,3); lab(c,F(m.value,0)+" kg",cx,gy-26,P.ink,{size:f,bg:false});
    wheel(c,cx-cw*0.28,gy-9,9,st.x*3); wheel(c,cx+cw*0.28,gy-9,9,st.x*3);
    var kk=Math.min(2.4,(W/2-30)/42); geo={cx:cx,k:kk,y1:gy-62,y2:gy-98};
    function arr(Fx,y,col,name){ if(Math.abs(Fx)>0.1){ D.arrow(c,cx,y,cx+Fx*kk,y,col,4); } handle(c,cx+Fx*kk,y,col); chip(c,name+" = "+F(Fx,0)+" N",cx+Fx*kk+(Fx>=0?-4:4),y-16,col,{size:f-1,align:Fx>=0?"right":"left"}); }
    arr(f1.value,geo.y1,P.red,"F₁"); arr(f2.value,geo.y2,P.violet,"F₂");
    var yr=gy-136; if(Math.abs(R)>0.1){ D.arrow(c,cx,yr,cx+R*kk,yr,P.green,5); chip(c,"R = "+F(R,0)+" N",cx+R*kk+(R>=0?-4:4),yr-16,P.green,{size:f,align:R>=0?"right":"left"}); } else chip(c,"R = 0",cx,yr-4,P.green,{size:f+1});
    chip(c,"tire les pointes des flèches ↔",W/2,H*0.4+20,P.grey,{size:f-2});
    ro.set(0,F(R,0)+" N"); ro.set(1,F(a,1)+" m/s²"); ro.set(2,F(st.v,1)+" m/s");
    nt.set(R===0?(v0.value===0&&st.v===0?"R = 0 et vitesse nulle : le chariot reste <b>au repos</b>.":"R = 0 : la vitesse reste constante, le chariot continue <b>en ligne droite à vitesse constante</b>, sans aucune force pour l'entretenir."):"R = "+F(f1.value,0)+" + ("+F(f2.value,0)+") = <b>"+F(R,0)+" N</b>, dirigée vers "+(R>0?"la droite":"la gauche")+" : la vitesse varie de "+F(a,1)+" m/s à chaque seconde. (Sans frottement.)","ok");
  });
});

/* ---------- 2 · Parallélogramme ---------- */
SIM("p3-c08-parallelogramme", function(k,S){
  var c = mkc(k,0.9,1.1);
  var f1 = k.slider("F₁",0,100,5,30,"N"), f2 = k.slider("F₂",0,100,5,40,"N"), al = k.slider("Angle α entre F₁ et F₂",0,180,5,90,"°");
  var eq = k.toggle("Montrer la force équilibrante",false);
  var ro = k.readouts(["Résultante R","Angle de R avec F₁","Cas particulier"]);
  var nt = k.note("","");
  var O=[0,0], sc=1, frozen=null, Ofr=null, dragW=null;
  c.pointer(function(ty,p){
    if(ty==="down"){ frozen=sc; Ofr=O.slice(); var a=al.value*Math.PI/180, p1=[O[0]+f1.value*sc,O[1]], p2=[O[0]+f2.value*Math.cos(a)*sc,O[1]-f2.value*Math.sin(a)*sc];
      var d1=Math.hypot(p.x-p1[0],p.y-p1[1]), d2=Math.hypot(p.x-p2[0],p.y-p2[1]); dragW=d1<26&&d1<=d2?1:(d2<26?2:null); }
    if(ty==="up"){ frozen=null; Ofr=null; dragW=null; k.redraw(); return; }
    if((ty==="down"||ty==="drag")&&dragW){ var dx=p.x-O[0], dy=O[1]-p.y;
      if(dragW===1){ f1.set(Math.round(clamp(dx/sc,0,100)/5)*5); } else { f2.set(Math.round(clamp(Math.hypot(dx,dy)/sc,0,100)/5)*5); al.set(Math.round(clamp(Math.atan2(dy,dx)*180/Math.PI,0,180)/5)*5); } k.redraw(); }
  });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, a=al.value*Math.PI/180, A=f1.value, B=f2.value;
    var rx=A+B*Math.cos(a), ry=B*Math.sin(a), R=Math.hypot(rx,ry), beta=Math.atan2(ry,rx)*180/Math.PI;
    var xs=[0,A,B*Math.cos(a),rx].concat(eq.value?[-rx]:[]), mnx=Math.min.apply(null,xs), mxx=Math.max.apply(null,xs), mxy=Math.max(10,ry);
    sc=Math.min(4,(W-100)/Math.max(30,mxx-mnx),(H-110)/Math.max(30,mxy+(eq.value?ry:0))); O=[(W-(mxx-mnx)*sc)/2-mnx*sc,H-56-(eq.value?ry*sc:0)];
    if(frozen){ sc=frozen; O=Ofr; }
    function pt(x,y){ return [O[0]+x*sc,O[1]-y*sc]; }
    ln(c,[8,O[1]],[W-8,O[1]],"#dfe5ee",1.5);
    var p1=pt(A,0), p2=pt(B*Math.cos(a),B*Math.sin(a)), pr=pt(rx,ry);
    g.save(); g.beginPath(); g.moveTo(O[0],O[1]); g.lineTo(p1[0],p1[1]); g.lineTo(pr[0],pr[1]); g.lineTo(p2[0],p2[1]); g.closePath(); g.fillStyle="rgba(36,119,90,.09)"; g.fill(); g.restore();
    D.line(c,p1[0],p1[1],pr[0],pr[1],P.grey,1.6,[5,4]); D.line(c,p2[0],p2[1],pr[0],pr[1],P.grey,1.6,[5,4]);
    if(eq.value) D.arrow(c,O[0],O[1],O[0]-rx*sc,O[1]+ry*sc,P.amber,3.4);
    D.arrow(c,O[0],O[1],p1[0],p1[1],P.red,3.8); D.arrow(c,O[0],O[1],p2[0],p2[1],P.violet,3.8); D.arrow(c,O[0],O[1],pr[0],pr[1],P.green,5);
    circ(c,O[0],O[1],6,P.ink); handle(c,p1[0],p1[1],P.red); handle(c,p2[0],p2[1],P.violet);
    chip(c,"F₁ = "+F(A,0)+" N",p1[0]+8,p1[1]+18,P.red,{size:f-1,align:"center"}); chip(c,"F₂ = "+F(B,0)+" N",p2[0],p2[1]-18,P.violet,{size:f-1}); chip(c,"R = "+F(R,1)+" N",pr[0]+(pr[0]>W*0.7?-6:6),pr[1]-18,P.green,{size:f,align:pr[0]>W*0.7?"right":"left"});
    if(eq.value) chip(c,"F₃ = −R",O[0]-rx*sc,O[1]+ry*sc+16,P.amber,{size:f-1});
    if(a>0.01){ g.save(); g.strokeStyle=P.grey; g.lineWidth=2; g.beginPath(); g.arc(O[0],O[1],28,-a,0); g.stroke(); g.restore(); chip(c,"α = "+F(al.value,0)+"°",O[0]+44,O[1]-14-Math.sin(a/2)*20,P.grey,{size:f-1.5,align:"left"}); }
    chip(c,"tire la pointe de F₁ ou de F₂",W/2,14,P.grey,{size:f-2});
    var cas = al.value===0?"même sens : R = F₁ + F₂":al.value===180?"sens opposés : R = |F₁ − F₂|":al.value===90?"angle droit : R² = F₁² + F₂²":"—";
    ro.set(0,F(R,1)+" N"); ro.set(1,R<0.05?"— (R = 0)":F(beta,0)+"°"); ro.set(2,cas);
    nt.set("R = "+F(R,1)+" N. Somme des valeurs F₁ + F₂ = "+F(A+B,0)+" N : "+(Math.abs(R-(A+B))<0.05?"égales car même sens.":"R est plus petite, car les forces ne sont pas alignées dans le même sens.")+" Glisse une pointe pour changer la force.","ok");
  });
});

/* ---------- 3 · Deux fils ---------- */
SIM("p3-c08-deux-fils", function(k,S){
  var c = mkc(k,1.0,1.3);
  var m = k.slider("Masse suspendue",0.5,10,0.5,3,"kg");
  var al = k.slider("Angle entre les deux fils",10,170,5,90,"°");
  var tm = k.select("Résistance maximale de chaque fil",[["30","30 N"],["60","60 N"],["100","100 N"]],"60");
  var ro = k.readouts(["Poids P","Tension T de chaque fil","T / P"]);
  var nt = k.note("","");
  var geo={}, drag=false, fall=0, ph=0, wasBrk=false;
  var lp=k.loop(function(dt){ ph+=dt; var Pw=m.value*G, a=al.value*Math.PI/180, T2=Pw/(2*Math.cos(a/2)), brk=T2>+tm.value; if(brk){ fall+=dt*200+fall*dt*2; } else fall=0; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down") drag=Math.hypot(p.x-geo.xr,p.y-geo.top)<26; if((ty==="down"||ty==="drag")&&drag){ var d=clamp(Math.abs(p.x-geo.cx)/geo.Lw,0.087,0.996); al.set(Math.round(2*Math.asin(d)*180/Math.PI/5)*5); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, Pw=m.value*G, a=al.value*Math.PI/180, Tn=Pw/(2*Math.cos(a/2)), brk=Tn>(+tm.value), u=clamp(Tn/(+tm.value),0,1);
    var cx=W/2, top=34, Lw=Math.min(W*0.44,H*0.46); geo={cx:cx,top:top,Lw:Lw};
    var xl=cx-Lw*Math.sin(a/2), xr=cx+Lw*Math.sin(a/2), ky=top+Lw*Math.cos(a/2)+(brk?fall:0);
    rect(c,6,top-16,W-12,16,"#b8c2d3","#7c8aa0",1.6,4); for(var i=0;i<W;i+=14) ln(c,[i+8,top-16],[i+2,top-4],"rgba(100,116,139,.35)",1.5);
    geo.xr=xr;
    var wcol=brk?P.red:"hsl("+Math.round(140-110*u)+",55%,38%)";
    if(!brk){ ln(c,[xl,top],[cx,ky],wcol,4); ln(c,[xr,top],[cx,ky],wcol,4); }
    else { ln(c,[xl,top],[xl+(cx-xl)*0.5,top+(ky-top)*0.0+22],wcol,3,[5,4]); ln(c,[xr,top],[xr+(cx-xr)*0.5,top+22],wcol,3,[5,4]); chip(c,"les fils ont cassé !",cx,top+34,P.red,{size:f}); }
    circ(c,xl,top,5,P.ink); handle(c,xr,top,P.violet); chip(c,"tire ↔",xr+4,top-26,P.grey,{size:f-2});
    var bw=34+m.value*3.2; rect(c,cx-bw/2,ky+6,bw,bw*0.85,"#b9c3d3","#26364d",2.4,6); lab(c,F(m.value,1)+" kg",cx,ky+6+bw*0.42,P.ink,{size:f-1,bg:false});
    if(!brk){ circ(c,cx,ky,6,P.ink);
      var s=Math.min(2.4,(H*0.2)/Math.max(Pw,Tn,1));
      D.arrow(c,cx,ky,cx,ky+Pw*s*0.9+bw,P.red,3.6); chip(c,"P",cx+14,ky+bw+Pw*s*0.5,P.red,{size:f});
      var tx=Tn*s*Math.sin(a/2), ty=Tn*s*Math.cos(a/2); D.arrow(c,cx,ky,cx-tx,ky-ty,P.violet,3.6); D.arrow(c,cx,ky,cx+tx,ky-ty,P.violet,3.6);
      chip(c,"T₁",cx-tx-10,ky-ty-6,P.violet,{size:f-1}); chip(c,"T₂",cx+tx+10,ky-ty-6,P.violet,{size:f-1}); }
    /* triangle des forces */
    var pw=Math.min(W*0.42,170), ph2=Math.min(H*0.34,150), px=W-pw-8, py=H-ph2-8; D.panel(c,px,py,pw,ph2,{shadow:false,title:"Triangle des forces"});
    var s2=Math.min((pw-36)/Math.max(0.1,2*Tn*Math.sin(a/2)+0.1),(ph2-48)/Math.max(0.1,Pw))*0.95; if(!isFinite(s2)) s2=1;
    var tx2=Tn*Math.sin(a/2)*s2, tyy=Pw*s2, ox=px+pw/2+tx2*0.5, oy=py+22;
    D.arrow(c,ox,oy,ox,oy+tyy,P.red,2.6); D.arrow(c,ox,oy+tyy,ox-tx2,oy+tyy/2,P.violet,2.6); D.arrow(c,ox-tx2,oy+tyy/2,ox,oy,P.violet,2.6);
    lab(c,"P",ox+10,oy+tyy*0.7,P.red,{size:f-2,align:"left",bg:false}); lab(c,"T₁",ox-tx2-6,oy+tyy*0.8,P.violet,{size:f-2,align:"right",bg:false}); lab(c,"T₂",ox-tx2*0.5-10,oy+tyy*0.2,P.violet,{size:f-2,bg:false});
    ro.set(0,F(Pw,1)+" N"); ro.set(1,F(Tn,1)+" N"); ro.set(2,F(Tn/Pw,2));
    nt.set(brk?"<b>Les fils cassent !</b> T = "+F(Tn,1)+" N dépasse "+tm.value+" N. Diminue l'angle ou la masse.":"Équilibre : T = P / (2 cos "+F(al.value/2,0)+"°) = "+F(Pw,1)+" / "+F(2*Math.cos(a/2),2)+" = <b>"+F(Tn,1)+" N</b>"+(Tn>Pw?" : plus que le poids !":"."),brk?"warn":"ok");
  });
});

/* ---------- 4 · Tirer une caisse ---------- */
var SURF=[["0.03","Acier sur glace (μ = 0,03)","#d6ecf7"],["0.4","Bois sur bois (μ = 0,40)","#d8c19a"],["0.8","Caoutchouc sur béton (μ = 0,80)","#b9bcc2"]];
SIM("p3-c08-equilibre-plan", function(k,S){
  var c = mkc(k,1.0,1.05);
  var ft = k.slider("Force de traction F",0,100,1,0,"N");
  var m = k.slider("Masse de la caisse",1,10,1,5,"kg");
  var su = k.select("Surface",SURF.map(function(s){return [s[0],s[1]];}),"0.4");
  var ro = k.readouts(["Frottement f","Résultante horizontale","État"]);
  var nt = k.note("","");
  var st={x:0,v:0}, geo={}, drag=false;
  var lp=k.loop(function(dt){ var N=m.value*G, fm=+su.value*N, Fv=ft.value; if(st.v<=1e-6&&Fv<=fm){ st.v=0; } else { st.v=Math.max(0,st.v+(Fv-fm)/m.value*dt); } st.x+=st.v*dt; k.redraw(); });
  k.button("Arrêter la caisse",function(){ st.v=0; }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down") drag=Math.hypot(p.x-geo.hx,p.y-geo.hy)<28; if((ty==="down"||ty==="drag")&&drag){ ft.set(Math.round(clamp((p.x-geo.bx)/geo.ks,0,100))); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    var W=c.W,H=c.H,f=fs(c), g=c.ctx, N=m.value*G, mu=+su.value, fm=mu*N, Fv=ft.value, sf=SURF.filter(function(s){return s[0]===su.value;})[0];
    var moving=st.v>1e-6, fr=moving?fm:Math.min(Fv,fm), Rh=Fv-fr;
    paper(c,"#f9fafd","#eef2f8");
    var gy=H*0.7, cx=W*0.34, bw=54+m.value*4, bh=40+m.value*3;
    rect(c,0,gy,W,H-gy,sf[2]); ln(c,[0,gy],[W,gy],"#6b7a90",3);
    for(var i=-8;i<=8;i++){ var tx=(((cx+i*46-st.x*30)%(W+100))+(W+100))%(W+100)-50; ln(c,[tx,gy],[tx,gy+8],"rgba(60,70,90,.45)",2); }
    rect(c,cx-bw/2,gy-bh,bw,bh,"#d9b98a","#6b4f26",2.6,5); ln(c,[cx-bw/2,gy-bh],[cx+bw/2,gy],"rgba(107,79,38,.22)",2); ln(c,[cx+bw/2,gy-bh],[cx-bw/2,gy],"rgba(107,79,38,.22)",2); lab(c,F(m.value,0)+" kg",cx,gy-bh/2,P.ink,{size:f+1,bg:false});
    var ks=Math.min(0.9,(W*0.5-30)/100*1.0), kv=Math.min(0.6,(gy-bh/2-30)/Math.max(N,1)*0.5);
    D.arrow(c,cx,gy-bh/2,cx,gy-bh/2+N*kv,P.red,3.4); chip(c,"P",cx+12,gy-bh/2+N*kv*0.85+4,P.red,{align:"left",size:f-2});
    D.arrow(c,cx+bw*0.22,gy,cx+bw*0.22,gy-N*kv,P.green,3.4); chip(c,"N",cx+bw*0.22+12,gy-N*kv-4,P.green,{align:"left",size:f-2}); chip(c,"P = N = "+F(N,0)+" N",W-10,36,P.ink,{align:"right",size:f-2});
    var ky=gy-bh*0.55; geo={bx:cx+bw/2,hx:cx+bw/2+Fv*ks,hy:ky,ks:ks};
    wire(c,[[cx+bw/2,ky],[cx+bw/2+Math.max(Fv*ks,20),ky]],"#7a5a2e",2.6);
    if(Fv>0) D.arrow(c,cx+bw/2,ky,cx+bw/2+Fv*ks,ky,P.violet,4); handle(c,geo.hx+(Fv===0?20:0)-(Fv===0?20:0),ky,P.violet); chip(c,"F = "+F(Fv,0)+" N",clamp(geo.hx,40,W-40),ky-bh*0.5-14,P.violet,{size:f-1});
    if(fr>0){ D.arrow(c,cx-bw/2,gy-6,cx-bw/2-fr*ks,gy-6,P.amber,4); chip(c,"f = "+F(fr,1)+" N",cx-bw/2-fr*ks,gy-22,P.amber,{size:f-1,align:"right"}); }
    /* jauge F / f_max */
    var jx=14, jw=W-28, jy=H-26; rect(c,jx,jy-6,jw,12,"#e2e7ef",null,0,6); rect(c,jx,jy-6,jw*Math.min(1,Fv/100),12,Fv>fm?P.violet:"#9aa7ba",null,0,6);
    var mx=jx+jw*Math.min(1,fm/100); ln(c,[mx,jy-14],[mx,jy+14],P.amber,3); chip(c,"f max = "+F(fm,0)+" N",clamp(mx,60,W-60),jy-24,P.amber,{size:f-2});
    chip(c,"tire la poignée violette →",W/2,16,P.grey,{size:f-2});
    ro.set(0,F(fr,1)+" N"); ro.set(1,F(Rh,1)+" N"); ro.set(2,moving?"en mouvement":(Fv>fm?"va démarrer":"à l'arrêt (équilibre)"));
    nt.set(moving?"Résultante = "+F(Fv,0)+" − "+F(fm,1)+" = "+F(Rh,1)+" N : "+(Rh>0.05?"la vitesse augmente.":Rh<-0.05?"la vitesse diminue : la caisse va s'arrêter.":"la vitesse reste constante."):(Fv<=fm?"Équilibre : f = F = "+F(Fv,0)+" N ≤ f<sub>max</sub> = μ·m·g = "+F(fm,1)+" N. Résultante nulle, la caisse ne bouge pas.":"F dépasse f<sub>max</sub> = "+F(fm,1)+" N : la caisse démarre."),"ok");
  });
});

})();
