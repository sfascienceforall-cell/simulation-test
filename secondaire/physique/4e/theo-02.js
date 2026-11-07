/* Physique 4e · chapitre 2 : accélération et MRUA (utilise les aides q_* de theo-01.js) */
function q_poly(g,pts,fill,stroke){ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(g.X(q[0]),g.Y(q[1])):ctx.moveTo(g.X(q[0]),g.Y(q[1]));});ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
function q_ok(txt,x,y,s){q_pill(txt,x,y,DGREEN,s||16,'#e8f7f1');}

SFA.theo("c02", {
 icon: function(){TB('a = Δv / Δt',W*.5,H*.42,BLUE_D,34);TB('v = v₀ + a·t',W*.5,H*.66,ORANGE,20);},
 anim: function(t){
  var tau=(t%420)/60;if(tau>5)tau=5;var a=2,v=a*tau,x=.5*a*tau*tau;
  var x0=W*.06,x1=W*.94,yr=H*.3,xs=function(d){return x0+(x1-x0)*d/25;};
  q_road(yr,x0-10,x1+10);for(var k=0;k<=5;k++){LN(xs(k*5),yr+9,xs(k*5),yr+20,GREY,1.5);T(k*5+' m',xs(k*5),yr+34,GREY,12);}
  car(xs(x),yr-20,BLUE);A(xs(x)+36,yr-20,v*5.5,0,RED,'',3);TB('v = '+v.toFixed(1).replace('.',',')+' m/s',xs(x),yr-52,DRED,14);
  var g=q_gr(W*.1,H*.93,W*.5,H*.45,5,10,'t (s)','v (m/s)',[1,2,3,4,5],[2,4,6,8,10]);
  q_poly(g,[[0,0],[tau,0],[tau,v]],'rgba(55,138,221,.25)');q_seg(g,0,0,5,10,GREY,1.5,[4,4]);q_seg(g,0,0,tau,v,BLUE,3.2);DOT(g.X(tau),g.Y(v),6,ORANGE);
  TB('aire = distance',g.X(3.4),g.Y(1.2),BLUE_D,13);
  TB('pente de v(t) = a',W*.7,H*.58,INK,15,'left');TB('a = 2 m/s²',W*.7,H*.58+28,RED,20,'left');
  TB('v = a·t',W*.7,H*.58+58,BLUE_D,16,'left');TB('x = ½·a·t² = '+x.toFixed(1).replace('.',',')+' m',W*.7,H*.58+84,ORANGE,15,'left');
 },
 th: '<div class="tcard"><b class="h">Accélération</b><p>L\'accélération mesure <b>de combien la vitesse change chaque seconde</b> : <b>a = Δv / Δt</b>, en m/s². a = 3 m/s² signifie « +3 m/s à chaque seconde ». Si la vitesse diminue, a est <b>négative</b> (décélération). Elle peut être nulle alors que la vitesse ne l\'est pas : un mobile lancé à vitesse constante a a = 0.</p></div>'+
 '<div class="tcard"><b class="h">Le MRUA : accélération constante</b><p>Mouvement rectiligne uniformément accéléré : <b>v = v₀ + a·t</b> et <b>x = x₀ + v₀·t + ½·a·t²</b>. Depuis le repos (v₀ = 0, x₀ = 0) : v = a·t et x = ½·a·t². Sans le temps : <b>v² = v₀² + 2·a·d</b>. Exemple : a = 3 m/s² pendant 8 s depuis le repos : v = 24 m/s et d = ½ × 3 × 64 = 96 m.</p></div>'+
 '<div class="tcard"><b class="h">Le graphique v(t)</b><p>La <b>pente</b> de v(t) est l\'accélération : a = Δv / Δt. Une droite = a constante (MRUA). L\'<b>aire sous la courbe</b> est la distance parcourue (trapèze : (v₁ + v₂)/2 × Δt). Exemple : v passe de 4 à 16 m/s en 3 s : a = 12 / 3 = 4 m/s² et d = (4 + 16)/2 × 3 = 30 m.</p></div>'+
 '<div class="tcard"><b class="h">Freinage et distance d\'arrêt</b><p>Distance d\'arrêt = <b>distance de réaction</b> (v·t<sub>r</sub>, à vitesse constante) + <b>distance de freinage</b> (v² / 2a). Le freinage varie comme le <b>carré</b> de la vitesse : vitesse × 2 donne une distance × 4. À 90 km/h = 25 m/s avec t<sub>r</sub> = 1 s et a = 5 m/s² : 25 + 62,5 = 87,5 m.</p></div>'+
 '<div class="tcard"><b class="h">Pièges</b><p>Convertis tout en <b>m/s</b> avant de calculer. Une décélération se compte avec un signe − dans les formules (ou on écrit v² = v₀² − 2·a·d). Vitesse nulle ≠ accélération nulle : au sommet d\'un aller-retour, v = 0 mais a garde la même valeur.</p></div>'
});

SFA.figs("c02", [
 /* 1 */ function(p){
  var yr=H*.3;q_road(yr,W*.03,W*.97);car(W*.14,yr-20,GREY);TB('0 m/s',W*.14,yr-50,GREY,14);car(W*.82,yr-20,BLUE);TB('27 m/s',W*.82,yr-50,BLUE_D,14);A(W*.2,yr-20,W*.5,0,ORA2,'',3);TB('6 s',W*.45,yr-30,ORANGE,15);
  var g=q_gr(W*.14,H*.92,W*.5,H*.46,6,30,'t (s)','v',[2,4,6],[9,18,27]);var s=q_r(p,0,.7);q_seg(g,0,0,6*s,27*s,BLUE,3.2);
  if(s>.99){DOT(g.X(6),g.Y(27),6,ORANGE);ctx.globalAlpha=q_r(p,.7,1);q_ok('a = 27 / 6 = 4,5 m/s²',W*.76,H*.7,17);ctx.globalAlpha=1;}
 },
 /* 2 */ function(p){
  var cx=W*.2,gy=H*.46;DOT(cx-26,gy,13,INK,false);DOT(cx+26,gy,13,INK,false);LN(cx-26,gy,cx,gy-28,INK,3);LN(cx,gy-28,cx+26,gy,INK,3);LN(cx-6,gy-34,cx+10,gy-34,INK,4);
  TB('a = 1,2 m/s²',W*.2,H*.72,DRED,17);TB('départ arrêté',W*.2,H*.82,GREY,14);
  var g=q_gr(W*.46,H*.8,W*.48,H*.58,10,14,'t (s)','v (m/s)',[2,4,6,8,10],[4,8,12],true);var s=q_r(p,0,.7);q_seg(g,0,0,10*s,12*s,BLUE,3.2);
  if(s>.99){DOT(g.X(10),g.Y(12),6,ORANGE);ctx.globalAlpha=q_r(p,.7,1);q_ok('v = 1,2 × 10 = 12 m/s',W*.62,H*.1,16);q_ok('= 43,2 km/h',W*.62,H*.93,16);ctx.globalAlpha=1;}
 },
 /* 3 */ function(p){
  var g=q_gr(W*.14,H*.86,W*.7,H*.68,8,28,'t (s)','v (m/s)',[2,4,6,8],[8,16,24],true);
  var s=q_r(p,0,.75);q_poly(g,[[0,0],[8*s,0],[8*s,24*s]],'rgba(29,158,117,.28)');q_seg(g,0,0,8,24,BLUE,3.2);
  TB('a = 3 m/s²',g.X(2.6),g.Y(14),BLUE_D,15);
  if(s>.99){DOT(g.X(8),g.Y(24),6,ORANGE);TB('24 m/s',g.X(8)-8,g.Y(24)-10,ORANGE,14,'right');TB('aire = ½ × 8 × 24',g.X(5.4),g.Y(4),DGREEN,14);ctx.globalAlpha=q_r(p,.75,1);q_ok('x = 96 m ; v = 24 m/s',W*.5,H*.1,16);ctx.globalAlpha=1;}
 },
 /* 4 */ function(p){
  var g=q_gr(W*.12,H*.86,W*.78,H*.68,6,20,'t (s)','v (m/s)',[1,2,3,4,5,6],[4,8,12,16,20],true);
  q_seg(g,0,-2,6,22,BLUE,2,[5,4]);var s=q_r(p,0,.7);q_poly(g,[[2,0],[2+3*s,0],[2+3*s,4+12*s],[2,4]],'rgba(29,158,117,.28)');q_seg(g,2,4,5,16,BLUE,3.4);
  DOT(g.X(2),g.Y(4),6,ORANGE);DOT(g.X(5),g.Y(16),6,ORANGE);TB('4 m/s',g.X(2)-8,g.Y(4)-6,ORANGE,14,'right');TB('16 m/s',g.X(5)+8,g.Y(16)-8,ORANGE,14,'left');
  if(p>0){ctx.globalAlpha=q_r(p,.5,1);q_ok('a = 12 / 3 = 4 m/s²',W*.58,H*.14,16);q_ok('d = (4 + 16)/2 × 3 = 30 m',W*.62,H*.93,15);ctx.globalAlpha=1;}
 },
 /* 5 : a = 0 */ function(p){
  var yr=H*.42;q_road(yr,W*.03,W*.97);for(var i=0;i<5;i++){var x=W*.14+i*W*.17;car(x,yr-20,i<4?'#9fc4ea':BLUE);if(i<4)TB('t='+i,x,yr+34,GREY,13);}
  TB('mêmes écarts entre les images',W*.5,H*.1,INK,15);
  A(W*.1,H*.22,W*.8,0,GREY,'',2);
  var g=q_gr(W*.2,H*.95,W*.6,H*.2,5,10,'t (s)','v',[],[]);q_seg(g,0,6,5,6,BLUE,3.2);TB('v = constante ≠ 0',g.X(2.5),g.Y(6)-10,BLUE_D,14);
  if(p>0){ctx.globalAlpha=q_r(p,0,.6);q_ok('a = 0 : v ne change pas',W*.5,H*.56,17);ctx.globalAlpha=1;}
 },
 /* 6 */ function(p){
  var g=q_gr(W*.14,H*.86,W*.74,H*.68,22,34,'t (s)','v (m/s)',[5,10,15,20],[10,20,30],true);
  var s=q_r(p,0,.75);q_poly(g,[[0,0],[20*s,0],[20*s,30-1.5*20*s]],'rgba(29,158,117,.28)');q_seg(g,0,30,20,0,BLUE,3.2);DOT(g.X(0),g.Y(30),6,ORANGE);TB('30 m/s',g.X(0)+10,g.Y(30)-8,ORANGE,14,'left');
  TB('a = −1,5 m/s²',g.X(11),g.Y(18),BLUE_D,15);
  if(s>.99){DOT(g.X(20),g.Y(0),6,ORANGE);ctx.globalAlpha=q_r(p,.75,1);q_ok('t = 20 s ; d = ½ × 30 × 20 = 300 m',W*.6,H*.1,15);ctx.globalAlpha=1;}
 },
 /* 7 : doubler la vitesse */ function(p){
  var u=W*.62/80,x0=W*.28;
  TB('50 km/h',W*.05,H*.38,BLUE_D,15,'left');TB('100 km/h',W*.05,H*.66,DRED,15,'left');
  TB('distance de freinage',W*.5,H*.14,INK,15);
  ctx.fillStyle=BLUE;ctx.fillRect(x0,H*.32,20*u,28);TB('20 m',x0+10*u,H*.32+19,'#fff',14);
  var s=q_r(p,0,.7);ctx.fillStyle=RED;ctx.fillRect(x0,H*.6,80*u*s,28);
  if(p>0){TB('80 m',x0+80*u*s-6,H*.6+19,'#fff',14,'right');ctx.globalAlpha=q_r(p,.6,1);q_ok('vitesse × 2  →  distance × 4',W*.5,H*.9,17);ctx.globalAlpha=1;}
 },
 /* 8 : distance d'arret */ function(p){
  var g=q_gr(W*.12,H*.86,W*.78,H*.66,7,30,'t (s)','v (m/s)',[1,2,3,4,5,6],[10,20,25],true);
  var s=q_r(p,0,.7);q_poly(g,[[0,0],[1,0],[1,25],[0,25]],'rgba(186,117,23,.3)');q_poly(g,[[1,0],[1+5*s,0],[1+5*s,25-5*5*s]],'rgba(55,138,221,.3)');
  q_seg(g,0,25,1,25,BLUE,3.4);q_seg(g,1,25,6,0,BLUE,3.4);TB('réaction',g.X(.5),g.Y(12),ORANGE,13);TB('freinage',g.X(2.6),g.Y(8),BLUE_D,14);
  if(p>0){ctx.globalAlpha=q_r(p,.5,1);TB('25 m',g.X(.5),g.Y(25)-8,ORANGE,14);TB('62,5 m',g.X(3.4),g.Y(18),BLUE_D,14);q_ok('87,5 m au total',W*.66,H*.2,17);ctx.globalAlpha=1;}
 },
 /* 9 : feu rouge */ function(p){
  var yr=H*.5,x0=W*.08,u=W*.8/42;q_road(yr,W*.02,W*.98);car(x0,yr-20,BLUE);
  var xf=x0+40*u;LN(xf,yr,xf,yr-64,INK,3);DOT(xf,yr-72,9,RED);TB('40 m',xf,yr+34,INK,13);
  ctx.fillStyle='rgba(186,117,23,.35)';ctx.fillRect(x0,yr+44,12*u,20);TB('12 m',x0+6*u,yr+59,ORANGE,13);
  var s=q_r(p,0,.7);ctx.fillStyle='rgba(55,138,221,.35)';ctx.fillRect(x0+12*u,yr+44,28.125*u*s,20);
  TB('15 m/s = 54 km/h',x0+30,yr-50,BLUE_D,14,'left');
  if(s>.99){TB('28,1 m',x0+26*u,yr+59,BLUE_D,13);ctx.globalAlpha=q_r(p,.7,1);q_ok('il franchit le feu à 3,6 km/h',W*.5,H*.14,16);ctx.globalAlpha=1;}
 },
 /* 10 : aller-retour */ function(p){
  var g=q_gr(W*.12,H*.86,W*.78,H*.7,11,30,'t (s)','x (m)',[2,4,6,8,10],[10,20,25],true);
  q_plot(g,function(t){return 10*t-t*t;},0,10,BLUE,3.2);
  var s=q_r(p,0,.7);if(s>0){ctx.globalAlpha=s;DOT(g.X(5),g.Y(25),7,ORANGE);TB('sommet : t = 5 s, v = 0',g.X(5),g.Y(25)-14,ORANGE,14);DOT(g.X(10),g.Y(0),7,GREEN);TB('retour : t = 10 s, v = −10 m/s',g.X(10)-4,g.Y(0)-14,DGREEN,13,'right');ctx.globalAlpha=1;}
  TB('a = −2 m/s² tout le temps',g.X(3.2),g.Y(7),DRED,13,'left');
 }
]);
