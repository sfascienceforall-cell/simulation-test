/* Maths 5e · chapitre 10 · repère orthonormé et produit scalaire */
function m10_vec(c,x0,y0,x1,y1,col,lab,w){var a={x:c.X(x0),y:c.Y(y0)},b={x:c.X(x1),y:c.Y(y1)};arrow(a.x,a.y,b.x-a.x,b.y-a.y,col,'',w||3);if(lab){var l=Math.hypot(b.x-a.x,b.y-a.y)||1;TB(lab,b.x+(b.x-a.x)/l*16,b.y+(b.y-a.y)/l*16+5,dk(col),15);}}
function m10_ang(c,x,y,a0,a1,r,col,lab){/* arc d'angle autour de (x,y), angles en radians math, rayon r px */ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(c.X(x),c.Y(y),r,-a0,-a1,a1>a0);ctx.stroke();if(lab){var am=(a0+a1)/2;TB(lab,c.X(x)+(r+16)*Math.cos(am),c.Y(y)-(r+16)*Math.sin(am)+5,dk(col),14);}}
function m10_rt(c,x,y,ux,uy,vx,vy,s){/* marque d'angle droit en (x,y) entre directions u et v (unités math), côté s px */var o={x:c.X(x),y:c.Y(y)},lu=Math.hypot(ux,uy),lv=Math.hypot(vx,vy),a={x:ux/lu*s,y:-uy/lu*s},b={x:vx/lv*s,y:-vy/lv*s};ctx.strokeStyle=GREY;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(o.x+a.x,o.y+a.y);ctx.lineTo(o.x+a.x+b.x,o.y+a.y+b.y);ctx.lineTo(o.x+b.x,o.y+b.y);ctx.stroke();}

SFA.theo("c10", {
 icon: function () { TB('u · v = xx′ + yy′', W*.5, H*.36, BLUE_D, 28); TB('= ‖u‖ ‖v‖ cos θ', W*.5, H*.58, ORA2, 28); TB('produit scalaire', W*.5, H*.82, ORANGE, 17); },
 anim: function (t) {
  var W0=W;W=W0*.58;var c=m5_G(-3.5,4.5,-3.5,3.5,{eq:true,sx:1,sy:1,lbx:100,lby:100,top:14,left:14,bot:14});W=W0;
  var ux=3,uy=1,nu=Math.hypot(ux,uy),ph=t*.014+.4,nv=2.6,vx=nv*Math.cos(ph),vy=nv*Math.sin(ph);
  var dot=ux*vx+uy*vy,th=Math.acos(m5_cl(dot/(nu*nv),-1,1)),k=dot/(nu*nu),hx=k*ux,hy=k*uy,col=dot>0.05?DGREEN:(dot<-.05?DRED:'#c8541f');
  m5_sg(c,vx,vy,hx,hy,'#b9bdc4',1.5,[4,3]);m10_vec(c,0,0,hx,hy,col+'',null,5);ctx.globalAlpha=.4;m10_vec(c,0,0,hx,hy,col,null,7);ctx.globalAlpha=1;
  m10_vec(c,0,0,ux,uy,BLUE,'u',3);m10_vec(c,0,0,vx,vy,ORA2,'v',3);
  var a1=Math.atan2(uy,ux),a2=ph;m10_ang(c,0,0,Math.min(a1,a2),Math.max(a1,a2),26,VIOLET,'');
  var tx=W*.62,f=function(v){return nfmt(v.toFixed(2).replace('.',','));};
  TB('u = (3 ; 1)   ‖u‖ = √10',tx,H*.16,BLUE_D,13,'left');TB('θ = '+f(th/D2R)+'°',tx,H*.3,'#5249B5',15,'left');
  TB('‖u‖‖v‖cos θ = '+f(dot),tx,H*.46,col,15,'left');TB('3·x′ + 1·y′ = '+f(dot),tx,H*.58,col,15,'left');
  TB(dot>.05?'angle aigu : u·v > 0':(dot<-.05?'angle obtus : u·v < 0':'perpendiculaires : u·v = 0'),tx,H*.76,col,15,'left');TB('trait épais : projection de v sur u',tx,H*.9,GREY,12,'left');
 },
 th: "<div class='tcard'><b class='h'>Définitions</b><p>Dans un repère orthonormé, pour u = (x ; y) et v = (x′ ; y′) : <b>u·v = xx′ + yy′</b> (un nombre, pas un vecteur) ; norme <b>‖u‖ = √(x² + y²)</b> ; et <b>u·v = ‖u‖·‖v‖·cos θ</b>, où θ est l’angle entre u et v. Donc <b>cos θ = u·v/(‖u‖‖v‖)</b>.</p><p><b>Exemples.</b> u = (3 ; −2), v = (4 ; 5) : u·v = 12 − 10 = 2, ‖u‖ = √13, ‖v‖ = √41. Avec ‖u‖ = 3, ‖v‖ = 4 et θ = 60° : u·v = 3·4·½ = 6.</p></div>"
 +"<div class='tcard'><b class='h'>Signe, orthogonalité, normale</b><p>u·v > 0 : angle aigu ; u·v < 0 : angle obtus ; <b>u·v = 0 ⇔ u ⊥ v</b> (vecteurs non nuls). Une droite d’équation ax + by + c = 0 a pour <b>vecteur normal</b> n = (a ; b) : (2 ; −1) pour 2x − y + 3 = 0. Exemple : (3 ; t)·(4 ; −6) = 12 − 6t = 0 donne t = 2.</p></div>"
 +"<div class='tcard'><b class='h'>Projection et distance point-droite</b><p>u·v = ‖u‖ × (longueur de la projection de v sur u, comptée avec signe). La distance du point P(x₀ ; y₀) à la droite ax + by + c = 0 est <b>d = |ax₀ + by₀ + c|/√(a² + b²)</b>.</p><p><b>Exemple.</b> P(5 ; 2) et 3x − 4y + 5 = 0 : d = |15 − 8 + 5|/5 = 12/5 = 2,4. Le pied H de la perpendiculaire est P − (valeur/(a² + b²))·(a ; b) = (3,56 ; 3,92).</p></div>"
 +"<div class='tcard'><b class='h'>Travail d’une force</b><p>W = F·d = ‖F‖·‖d‖·cos θ (en joules si F en newtons, d en mètres). Exemple : traction de 80 N inclinée de 35° sur 25 m : W = 80·25·cos 35° ≈ 1 638 J ; frottement de 50 N opposé : −1 250 J ; travail total ≈ 388 J.</p></div>"
 +"<div class='tcard'><b class='h'>Pièges et lieux</b><p>u·v = u·w n’entraîne pas v = w : seulement u·(v − w) = 0, c’est-à-dire v − w ⊥ u. Ne pas écrire u·v comme un vecteur. Lieu : MA·MB = 0 décrit le <b>cercle de diamètre [AB]</b> (angle droit en M). Pour A(−1 ; 0) et B(3 ; 2) : (x − 1)² + (y − 1)² = 5. (6 h : produit scalaire dans l’espace, matrices et déterminants.)</p></div>"
});

SFA.figs("c10", [
 /* 0 */
 function (p) {
  var c=m5_G(-1.5,6.5,-3.5,6.5,{eq:true,sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('u = (3 ; −2) et v = (4 ; 5)',BLUE_D);
  m10_vec(c,0,0,3,-2,BLUE,'u',3.2);m10_vec(c,0,0,4,5,ORA2,'v',3.2);var q=m5_fd(p,0,.5);
  if(q>0){ctx.globalAlpha=q;var tx=W*.6;TB('u·v = 3·4 + (−2)·5',tx,H*.36,INK,14,'left');TB('= 2',tx,H*.5,DRED,22,'left');TB('‖u‖ = √13 ; ‖v‖ = √41',tx,H*.7,DGREEN,14,'left');ctx.globalAlpha=1;}
 },
 /* 1 orthogonalité */
 function (p) {
  var c=m5_G(-2,6,-7.5,4.5,{eq:true,sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('a = (3 ; t) et b = (4 ; −6)',BLUE_D);var q=m5_fd(p,0,.6),t=.8+1.2*q;
  m10_vec(c,0,0,4,-6,ORA2,'b',3.2);m10_vec(c,0,0,3,t,q>=1?GREEN:BLUE,'a',3.2);
  if(q>=1){m10_rt(c,0,0,3,2,4,-6,16);TB('12 − 6t = 0 : t = 2',W*.6,H*.3,DGREEN,16,'left');TB('a ⟂ b',W*.6,H*.44,DGREEN,20,'left');}else TB('a ⟂ b ?',W*.6,H*.3,GREY,18,'left');
 },
 /* 2 angle 60° */
 function (p) {
  var c=m5_G(-.5,5.5,-.8,4.2,{eq:true,sx:1,sy:1,lbx:100,lby:100,top:34});m5_cap('‖u‖ = 3, ‖v‖ = 4, θ = 60°',BLUE_D);
  var vx=4*Math.cos(PI/3),vy=4*Math.sin(PI/3);m10_vec(c,0,0,3,0,BLUE,'u',3.4);m10_vec(c,0,0,vx,vy,ORA2,'v',3.4);m10_ang(c,0,0,0,PI/3,38,VIOLET,'60°');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,vx,vy,vx,0,'#9aa0a6',1.4,[4,3]);ctx.strokeStyle=GREEN;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(c.X(0),c.Y(-.3));ctx.lineTo(c.X(2),c.Y(-.3));ctx.stroke();m5_t(c,'projection : 4 cos 60° = 2',2.9,-.55,DGREEN,11);
   var tx=W*.62;TB('u·v = 3 × 2',tx,H*.4,INK,16,'left');TB('= 6',tx,H*.56,DRED,24,'left');ctx.globalAlpha=1;}
 },
 /* 3 angle entre deux vecteurs */
 function (p) {
  var c=m5_G(-2.5,4,-1,4,{eq:true,sx:1,sy:1,lbx:1,lby:1,top:34});m5_cap('u = (1 ; 1) et v = (−1 ; 3)',BLUE_D);
  m10_vec(c,0,0,1,1,BLUE,'u',3.4);m10_vec(c,0,0,-1,3,ORA2,'v',3.4);m10_ang(c,0,0,PI/4,Math.atan2(3,-1),36,VIOLET,'');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;var tx=W*.6;TB('cos θ = 2/(√2·√10)',tx,H*.38,INK,14,'left');TB('= 1/√5',tx,H*.5,INK,14,'left');TB('θ ≈ 63,4°',tx,H*.7,DRED,24,'left');ctx.globalAlpha=1;}
 },
 /* 4 distance point-droite */
 function (p) {
  var c=m5_G(-3,8,-1,7,{eq:true,sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('d : 3x − 4y + 5 = 0 ; P(5 ; 2)',BLUE_D);
  m5_fn(c,function(x){return (3*x+5)/4;},-3,8,BLUE,3);m5_pt(c,5,2,INK,6);m5_t(c,'P',5.3,1.35,INK,13,'left');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;var H3={x:3.56,y:3.92};m5_sg(c,5,2,H3.x,H3.y,RED,2.8);m5_pt(c,H3.x,H3.y,RED,6);m5_t(c,'H',H3.x-.2,H3.y+.65,DRED,13);m10_rt(c,H3.x,H3.y,1,.75,1.44,-1.92,14);
   m5_tag(c,'d = 12/5 = 2,4',5.3,3.4,DRED,13);m5_tag(c,'H = (3,56 ; 3,92)',-.4,6.1,DGREEN,12);ctx.globalAlpha=1;}
 },
 /* 5 vecteur normal */
 function (p) {
  var c=m5_G(-4,5,-3,8,{eq:true,sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('d : 2x − y + 3 = 0',BLUE_D);
  m5_fn(c,function(x){return 2*x+3;},-3,2.6,BLUE,3);m10_vec(c,0,3,1,5,'#7aa7d6','',2.4);m5_t(c,'direction (1 ; 2)',-2.6,.2,BLUE_D,11,'left');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m10_vec(c,0,3,2,2,RED,'',3.4);m10_rt(c,0,3,1,2,2,-1,13);m5_tag(c,'n = (2 ; −1)',3.4,1.6,DRED,14);ctx.globalAlpha=1;}
 },
 /* 6 travail */
 function (p) {
  m5_cap('traction 80 N à 35°, frottement 50 N, 25 m',BLUE_D);var gy=H*.72,bx=W*.3,k=W*.0045,q=m5_fd(p,0,.5);floor(W*.05,W*.95,gy);
  ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(bx-34,gy-34,68,34,6);ctx.fill();ctx.stroke();
  var th=35*D2R,F=80*k*1.2;A(bx,gy-17,F*Math.cos(th),-F*Math.sin(th),ORA2,'',3.4);TB('F = 80 N',bx+F*Math.cos(th)+8,gy-17-F*Math.sin(th)-8,'#c8541f',14,'left');
  A(bx-34,gy-17,-50*k*1.2,0,RED,'',3.4);TB('f = 50 N',bx-34-50*k*1.2,gy-28,DRED,14,'left');
  A(bx-34,gy+22,25*k*3.6,0,GREEN,'',3);TB('d = 25 m',bx-34+25*k*1.8,gy+42,DGREEN,14);arcA({x:bx,y:gy-17},46,0,-th,'35°',VIOLET);
  if(q>0){ctx.globalAlpha=q;var tx=W*.6;TB('W(F) = 80·25·cos 35°',tx,H*.3,'#c8541f',14,'left');TB('≈ 1 638 J',tx,H*.3+22,'#c8541f',16,'left');TB('W(f) = −50·25 = −1 250 J',tx,H*.55,DRED,14,'left');TB('total ≈ 388 J',tx,H*.8,DGREEN,20,'left');ctx.globalAlpha=1;}
 },
 /* 7 simplifier par u ? */
 function (p) {
  var c=m5_G(-.8,5,-2.6,3.8,{eq:true,sx:1,sy:1,lbx:100,lby:100,top:34});m5_cap('u·v = u·w avec u ≠ 0',BLUE_D);
  m10_vec(c,0,0,3,0,BLUE,'u',3.4);m10_vec(c,0,0,2,2.2,ORA2,'v',3.2);m10_vec(c,0,0,2,-1.5,GREEN,'w',3.2);m5_sg(c,2,-2.3,2,3.3,'#9aa0a6',1.4,[5,4]);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m10_vec(c,2,-1.5,2,2.2,RED,'',2.6);TB('v − w ⟂ u',W*.62,H*.36,DRED,17,'left');TB('même projection sur u,',W*.62,H*.54,INK,14,'left');TB('mais v ≠ w',W*.62,H*.54+20,DRED,16,'left');ctx.globalAlpha=1;}
 },
 /* 8 triangle */
 function (p) {
  var c=m5_G(-1,7,-1,8,{eq:true,sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('A(1 ; 2), B(5 ; 1), C(3 ; 6)',BLUE_D);
  var A_=[1,2],B_=[5,1],C_=[3,6],q=m5_fd(p,0,.5);ctx.beginPath();ctx.moveTo(c.X(1),c.Y(2));ctx.lineTo(c.X(5),c.Y(1));ctx.lineTo(c.X(3),c.Y(6));ctx.closePath();ctx.fillStyle=BLUE+(q>0?'22':'11');ctx.fill();ctx.strokeStyle=BLUE;ctx.lineWidth=2.8;ctx.stroke();
  [[A_,'A',-.6,-.2],[B_,'B',.3,-.5],[C_,'C',.2,.5]].forEach(function(S){m5_pt(c,S[0][0],S[0][1],INK,5);m5_t(c,S[1],S[0][0]+S[2],S[0][1]+S[3],INK,13);});
  if(q>0){ctx.globalAlpha=q;m5_t(c,'77,5°',1.6,2.7,DRED,12,'left');m5_t(c,'54,2°',3.6,1.55,DRED,12,'left');m5_t(c,'48,4°',2.5,5.0,DRED,12,'left');var tx=W*.64;TB('aire = 9',tx,H*.4,DGREEN,22,'left');TB('pas d’angle droit',tx,H*.58,INK,14,'left');TB('Â + B̂ + Ĉ = 180°',tx,H*.72,GREY,13,'left');ctx.globalAlpha=1;}
 },
 /* 9 lieu */
 function (p) {
  var c=m5_G(-3,5,-2,4,{eq:true,sx:1,sy:1,lbx:1,lby:1,top:34});m5_cap('MA·MB = 0 pour A(−1 ; 0) et B(3 ; 2)',BLUE_D);var q=m5_fd(p,0,.6);
  if(q>0){ctx.globalAlpha=q;ctx.strokeStyle=ORA2;ctx.lineWidth=2.8;ctx.beginPath();ctx.arc(c.X(1),c.Y(1),Math.sqrt(5)*c.kx,0,2*PI);ctx.stroke();m5_sg(c,-1,0,3,2,'#e6bba8',1.5,[5,4]);
   var th=1.9,M={x:1+Math.sqrt(5)*Math.cos(th),y:1+Math.sqrt(5)*Math.sin(th)};m5_sg(c,-1,0,M.x,M.y,BLUE,1.8);m5_sg(c,3,2,M.x,M.y,BLUE,1.8);m5_pt(c,M.x,M.y,RED,5.5);m5_t(c,'M',M.x-.15,M.y+.5,DRED,13);
   m5_pt(c,1,1,GREY,3.5);m5_tag(c,'(x − 1)² + (y − 1)² = 5',3.3,3.5,DRED,12);ctx.globalAlpha=1;}
  m5_pt(c,-1,0,INK,5.5);m5_pt(c,3,2,INK,5.5);m5_t(c,'A',-1.4,-.55,INK,13);m5_t(c,'B',3.3,2.45,INK,13);
  if(q>=1){m5_pt(c,3,0,GREEN,5);m5_t(c,'(3 ; 0)',3.2,-.55,DGREEN,11,'left');}
 }
]);
