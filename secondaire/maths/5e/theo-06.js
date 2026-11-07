/* Maths 5e · chapitre 6 · monotonie, extrema, optimisation */
/* courbe colorée selon le signe de la dérivée : vert croissante, rouge décroissante */
function m5_signed(c,f,df,a,b,w){var n=300,pc=null;for(var i=0;i<n;i++){var x0=a+(b-a)*i/n,x1=a+(b-a)*(i+1)/n,s=df((x0+x1)/2)>=0?GREEN:RED;m5_fn(c,f,x0,x1+(b-a)/n*.3,s,w||3,false,null,3);}}

SFA.theo("c06", {
 icon: function () { TB('f ′ > 0  ↗', W*.3, H*.4, DGREEN, 26); TB('f ′ < 0  ↘', W*.72, H*.4, DRED, 26); TB('f ′ = 0 : max ou min ?', W*.5, H*.64, ORA2, 19); TB('monotonie · extrema · optimisation', W*.5, H*.86, ORANGE, 15); },
 anim: function (t) {
  var W0=W;W=W0*.62;var c=m5_G(-2.5,2.5,-4,4,{sx:1,sy:1,lbx:1,lby:2,top:14,left:30});
  var f=function(x){return x*x*x-3*x;},df=function(x){return 3*x*x-3;};
  m5_signed(c,f,df,-2.4,2.4,3.2);
  var x=2.1*Math.sin(t*.011),y=f(x),m=df(x);
  var dx=.8/Math.sqrt(1+m*m)*1.4;m5_sg(c,x-dx,y-m*dx,x+dx,y+m*dx,m>=0?GREEN:RED,2.2,[5,3]);m5_pt(c,x,y,m>=0?DGREEN:DRED,6.5);
  W=W0;var tx=W*.66;TB('f(x) = x³ − 3x',tx,H*.16,BLUE_D,14,'left');TB('f ′(x) = 3x² − 3',tx,H*.28,INK,14,'left');
  TB('x = '+nfmt(x.toFixed(2).replace('.',',')),tx,H*.44,INK,15,'left');
  TB('f ′(x) = '+nfmt(m.toFixed(2).replace('.',',')),tx,H*.56,m>=0?DGREEN:DRED,16,'left');
  TB(Math.abs(m)<.15?'f ′ ≈ 0 : tangente horizontale':(m>0?'f ′ > 0 : f croît ↗':'f ′ < 0 : f décroît ↘'),tx,H*.7,m>=0?DGREEN:DRED,15,'left');
  TB('extrema en x = −1 (max) et 1 (min)',tx,H*.88,GREY,13,'left');
 },
 th: "<div class='tcard'><b class='h'>Signe de f′ et variations</b><p>Sur un intervalle : f ′ > 0 ⇒ f <b>croissante</b> ; f ′ < 0 ⇒ f <b>décroissante</b> ; f ′ = 0 partout ⇒ f constante. Méthode : calculer f ′, étudier son signe (zéros, tableau de signes), puis résumer dans un <b>tableau de variations</b> (flèches ↗ ↘ et valeurs de f aux points charnières).</p><p>Exemple : f(x) = x² − 4x + 1, f ′(x) = 2x − 4 : négative pour x < 2, positive pour x > 2. f décroît sur ]−∞ ; 2], croît sur [2 ; +∞[, minimum f(2) = −3.</p></div>"
 +"<div class='tcard'><b class='h'>Extrema locaux</b><p>Si f ′(a) = 0 <b>et</b> f ′ change de signe en a, il y a un extremum local : de + à − un <b>maximum</b>, de − à + un <b>minimum</b>. f ′(a) = 0 ne suffit pas : pour f(x) = x³, f ′(0) = 0 mais f ′ ≥ 0 partout, donc f est croissante et il n’y a pas d’extremum.</p><p>Exemple : f(x) = x³ − 12x, f ′ = 3(x − 2)(x + 2) : maximum local f(−2) = 16, minimum local f(2) = −16.</p></div>"
 +"<div class='tcard'><b class='h'>Extrema sur un intervalle fermé</b><p>Sur [a ; b], le maximum et le minimum <b>globaux</b> sont à chercher parmi les valeurs de f aux <b>bornes</b> et aux points où f ′ = 0. On compare toutes ces valeurs. Exemple : f(x) = x³ − 3x sur [−2 ; 3] : f(−2) = −2, f(−1) = 2, f(1) = −2, f(3) = 18. Maximum 18 en x = 3 ; minimum −2 atteint en x = −2 et en x = 1.</p></div>"
 +"<div class='tcard'><b class='h'>Optimisation : la méthode</b><p>1) Choisir la variable x et faire un schéma. 2) Exprimer la quantité à optimiser en fonction de x seul (utiliser la contrainte). 3) Donner le <b>domaine</b> de x. 4) Dériver, chercher f ′ = 0, tableau de variations. 5) Conclure avec les unités.</p><p><b>Exemple.</b> 60 m de grillage contre un mur : côtés x, x et 60 − 2x ; aire A(x) = x(60 − 2x), A′ = 60 − 4x = 0 en x = 15 : 15 m × 30 m, aire 450 m². Boîte : V(x) = x(30 − 2x)² est maximal pour x = 5 cm, V = 2 000 cm³.</p></div>"
 +"<div class='tcard'><b class='h'>Pièges</b><p>Un maximum peut être <b>au bord</b> du domaine : A(x) = x(40 − x) sur [0 ; 15] est maximal en x = 15 (375) bien que A′ = 0 en 20. Vérifier que la solution est dans le domaine ; ne pas confondre la valeur de x et la valeur maximale. (6 h : la dérivée seconde et la concavité confirment max/min.)</p></div>"
});

SFA.figs("c06", [
 /* 0 parabole */
 function (p) {
  var c=m5_G(-1,5,-4,6,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('f(x) = x² − 4x + 1',BLUE_D);var f=function(x){return x*x-4*x+1;},q=m5_fd(p,0,.5);
  if(q>0)m5_signed(c,f,function(x){return 2*x-4;},-1,5,3.2);else m5_fn(c,f,-1,5,BLUE,3.2);
  if(q>0){ctx.globalAlpha=q;m5_pt(c,2,-3,RED,6);m5_tag(c,'minimum f(2) = −3',3.9,-2.5,DRED,13);m5_tag(c,'f ′ < 0 ↘',-.1,4.5,DRED,13);m5_tag(c,'f ′ > 0 ↗',4.4,4.5,DGREEN,13);ctx.globalAlpha=1;}
 },
 /* 1 cubique */
 function (p) {
  var c=m5_G(-4.5,4.5,-22,22,{sx:1,sy:5,lbx:2,lby:10,top:34});m5_cap('f(x) = x³ − 12x',BLUE_D);var f=function(x){return x*x*x-12*x;},q=m5_fd(p,0,.5);
  if(q>0)m5_signed(c,f,function(x){return 3*x*x-12;},-4.4,4.4,3.2);else m5_fn(c,f,-4.4,4.4,BLUE,3.2);
  if(q>0){ctx.globalAlpha=q;m5_pt(c,-2,16,RED,6);m5_pt(c,2,-16,DGREEN,6);m5_tag(c,'max local 16',-2.6,19.3,DRED,13);m5_tag(c,'min local −16',2.7,-19.5,DGREEN,13);ctx.globalAlpha=1;}
 },
 /* 2 x³ */
 function (p) {
  var c=m5_G(-2,2,-4,4,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('f(x) = x³ : f ′(0) = 0',BLUE_D);
  m5_fn(c,function(x){return x*x*x;},-1.58,1.58,BLUE,3.2);m5_sg(c,-1,0,1,0,GREY,1.6,[5,4]);m5_pt(c,0,0,ORA2,6);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_tag(c,'f ′ ≥ 0 partout : croissante',.1,-3.0,DGREEN,12);m5_tag(c,'ni max ni min',-.9,2.3,DRED,15);ctx.globalAlpha=1;}
  else m5_t(c,'tangente horizontale',0,.9,GREY,11);
 },
 /* 3 intervalle fermé */
 function (p) {
  var c=m5_G(-2.6,3.6,-5,20,{sx:1,sy:5,lbx:1,lby:5,top:34,left:30});m5_cap('f(x) = x³ − 3x sur [−2 ; 3]',BLUE_D);var f=function(x){return x*x*x-3*x;};
  m5_fn(c,f,-2,3,BLUE,3.2);[-2,-1,1,3].forEach(function(x){m5_pt(c,x,f(x),BLUE_D,5);});
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-2.6,-2,3.6,-2,GREEN,1.4,[5,4]);m5_pt(c,3,18,RED,7);m5_pt(c,-2,-2,DGREEN,7);m5_pt(c,1,-2,DGREEN,7);m5_tag(c,'max 18 (x = 3)',1.1,17,DRED,13);m5_tag(c,'min −2',-.5,-3.7,DGREEN,13);m5_tag(c,'(x = −2 et x = 1)',1.7,-3.7,DGREEN,11);ctx.globalAlpha=1;}
 },
 /* 4 enclos */
 function (p) {
  var q=m5_fd(p,0,.6);m5_cap('60 m de grillage contre un mur',BLUE_D);
  m5_pane(0,2,function(){var x0=W*.12,x1=W*.9,yw=H*.32;ctx.strokeStyle=INK;ctx.lineWidth=3;LN(x0-6,yw,x1+6,yw,INK,3);ctx.strokeStyle='#bbb';ctx.lineWidth=1;for(var h=x0;h<x1;h+=10){ctx.beginPath();ctx.moveTo(h,yw);ctx.lineTo(h-7,yw-8);ctx.stroke();}
   var ww=(x1-x0)*.8,hh=H*.38,xr=x0+(x1-x0)*.1;ctx.fillStyle=GREEN+'22';ctx.strokeStyle=GREEN;ctx.lineWidth=2.5;ctx.fillRect(xr,yw,ww,hh);ctx.strokeRect(xr,yw,ww,hh);
   TB(q>=1?'15 m':'x',xr-6,yw+hh/2+5,DGREEN,16,'right');TB(q>=1?'30 m':'60 − 2x',xr+ww/2,yw+hh+19,DGREEN,16);TB('mur',x1-14,yw-14,INK,13);
   if(q>=1)TB('A = 450 m²',xr+ww/2,yw+hh/2+6,DRED,18);});
  m5_pane(1,2,function(){var c=m5_G(0,30,0,520,{sx:5,sy:100,lbx:10,lby:200,top:50,left:36,bot:24});m5_fn(c,function(x){return x*(60-2*x);},0,30,BLUE,3);m5_t(c,'A(x) = x(60 − 2x)',15,495,BLUE_D,11);
   if(q>0){ctx.globalAlpha=q;m5_sg(c,15,0,15,450,RED,1.4,[4,3]);m5_pt(c,15,450,RED,6);m5_tag(c,'15 ; 450',23,400,DRED,12);ctx.globalAlpha=1;}});
 },
 /* 5 aire périmètre */
 function (p) {
  var c=m5_G(0,10,0,30,{sx:1,sy:5,lbx:2,lby:10,top:34});m5_cap('périmètre 20 cm : A(x) = x(10 − x)',BLUE_D);
  m5_fn(c,function(x){return x*(10-x);},0,10,BLUE,3.2);m5_pt(c,3,21,ORA2,5);m5_t(c,'x = 3 : 21 cm²',3.2,17.5,ORA2,11,'left');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,5,0,5,25,RED,1.4,[4,3]);m5_pt(c,5,25,RED,7);m5_tag(c,'carré 5 × 5 : 25 cm²',5,28.8,DRED,13);ctx.globalAlpha=1;}
 },
 /* 6 boîte */
 function (p) {
  var q=m5_fd(p,0,.6);m5_cap('feuille 30 cm × 30 cm, coins x',BLUE_D);
  m5_pane(0,2,function(){var s=Math.min(W*.74,H*.62),x0=(W-s)/2,y0=H*.2,k=s/30,xx=q>0?5:3.4;
   ctx.fillStyle='#f4f8fd';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(x0,y0,s,s);ctx.strokeRect(x0,y0,s,s);
   [[0,0],[1,0],[0,1],[1,1]].forEach(function(P){var cx=x0+P[0]*(s-xx*k),cy=y0+P[1]*(s-xx*k);ctx.fillStyle=ORA2+'55';ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.fillRect(cx,cy,xx*k,xx*k);ctx.strokeRect(cx,cy,xx*k,xx*k);});
   TB(q>0?'x = 5':'x',x0+xx*k/2,y0+xx*k+17,DRED,15);TB('30 − 2x',x0+s/2,y0+s/2+5,BLUE_D,16);});
  m5_pane(1,2,function(){var c=m5_G(0,15,0,2400,{sx:5,sy:500,lbx:5,lby:1000,top:40,left:42,bot:24});m5_fn(c,function(x){return x*Math.pow(30-2*x,2);},0,15,BLUE,3);m5_t(c,'V(x)',12.3,1950,BLUE_D,12);
   if(q>0){ctx.globalAlpha=q;m5_sg(c,5,0,5,2000,RED,1.4,[4,3]);m5_pt(c,5,2000,RED,6);m5_tag(c,'2 000 cm³',9,2200,DRED,12);ctx.globalAlpha=1;}});
 },
 /* 7 intervalle limité */
 function (p) {
  var c=m5_G(0,40,0,450,{sx:5,sy:50,lbx:10,lby:100,top:34,left:38});m5_cap('A(x) = x(40 − x) sur [0 ; 15]',BLUE_D);var f=function(x){return x*(40-x);};
  m5_fn(c,f,15,40,'#c5d0de',2,false,[5,4]);m5_fn(c,f,0,15,BLUE,3.4);m5_pt(c,15,375,p>0?RED:BLUE,6);
  ctx.fillStyle=GREEN;ctx.fillRect(c.X(0),c.Y(0)-3,c.X(15)-c.X(0),6);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,15,0,15,375,RED,1.4,[4,3]);m5_sg(c,0,375,15,375,RED,1.4,[4,3]);m5_tag(c,'maximum en x = 15 : 375',24,330,DRED,13);m5_t(c,'A′ = 0 en 20 : hors intervalle',20,430,GREY,11);ctx.globalAlpha=1;}
 },
 /* 8 canette */
 function (p) {
  var q=m5_fd(p,0,.6);m5_cap('500 cm³ : minimiser S = 2πr² + 2πrh',BLUE_D);
  m5_pane(0,2,function(){var r=Math.min(W*.2,H*.17),h=q>0?2*r:2.3*r,cx=W*.5,yt=H*.42-h/2;ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;
   ctx.beginPath();ctx.moveTo(cx-r,yt);ctx.lineTo(cx-r,yt+h);ctx.ellipse(cx,yt+h,r,r*.3,0,PI,0,true);ctx.lineTo(cx+r,yt);ctx.ellipse(cx,yt,r,r*.3,0,0,PI,true);ctx.closePath();ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.ellipse(cx,yt,r,r*.3,0,0,2*PI);ctx.stroke();LN(cx,yt,cx+r,yt,ORA2,2);TB('r',cx+r/2,yt-7,DRED,15);LN(cx+r+10,yt,cx+r+10,yt+h,GREEN,2);TB(q>0?'h = 2r':'h',cx+r+16,yt+h/2+5,DGREEN,15,'left');
   if(q>0){TB('r ≈ 4,30 cm',cx,yt+h+r*.3+32,DRED,15);TB('h ≈ 8,60 cm',cx,yt+h+r*.3+52,DGREEN,15);}});
  m5_pane(1,2,function(){var c=m5_G(1,9,300,700,{sx:1,sy:50,lbx:2,lby:100,top:40,left:38,bot:24});m5_fn(c,function(r){return 2*PI*r*r+1000/r;},1.5,9,BLUE,3);m5_t(c,'S(r)',8,640,BLUE_D,12);
   if(q>0){var r0=Math.cbrt(250/PI),s0=2*PI*r0*r0+1000/r0;ctx.globalAlpha=q;m5_pt(c,r0,s0,RED,6);m5_tag(c,'S ≈ 348,7 cm²',r0+1.8,s0-60,DRED,12);ctx.globalAlpha=1;}});
 },
 /* 9 point le plus proche */
 function (p) {
  var c=m5_G(-2,5,-2,6,{eq:true,sx:1,sy:1,lbx:1,lby:1,top:34});m5_cap('point de y = x² le plus proche de P(3 ; 0)',BLUE_D);
  m5_fn(c,function(x){return x*x;},-1.5,2.45,BLUE,3);m5_pt(c,3,0,INK,6);m5_t(c,'P',3.2,-.55,INK,13,'left');
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;ctx.strokeStyle=RED;ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(c.X(3),c.Y(0),Math.sqrt(5)*c.kx,0,2*PI);ctx.stroke();ctx.setLineDash([]);
   m5_sg(c,3,0,1,1,RED,2.6);m5_pt(c,1,1,RED,6.5);m5_tag(c,'(1 ; 1) : d = √5 ≈ 2,24',1.1,3.5,DRED,13);ctx.globalAlpha=1;}
 }
]);
