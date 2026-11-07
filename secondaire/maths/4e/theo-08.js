/* Maths 4e · chapitre 8 : calcul vectoriel dans le plan */
function m4_vec(f,P,Q,col,lab,w,off,dash){var x1=f.X(P[0]),y1=f.Y(P[1]),x2=f.X(Q[0]),y2=f.Y(Q[1]);
 arrow(x1,y1,x2-x1,y2-y1,col,'',w||3.2,dash);
 if(lab){var dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1,o=off==null?16:off;tag(lab,(x1+x2)/2+(-dy/l)*o,(y1+y2)/2+(dx/l)*o,dk(col),14);}}
function m4_P(f,x,y,lab,col,dx,dy){DOT(f.X(x),f.Y(y),5.5,col||INK);if(lab)tag(lab,f.X(x)+(dx||0),f.Y(y)+(dy==null?-16:dy),dk(col||INK),14);}
SFA.theo("c08", {
 icon: function () {
  var f=m4_fr(-.5,7,-.5,4.5,{l:20,r:W*.42,t:30,b:20,eq:true});
  m4_grid(f,1,1,false);
  m4_vec(f,[0,0],[3,1],BLUE,'u',3.4,-14);m4_vec(f,[3,1],[4,3],ORANGE,'v',3.4,-14);m4_vec(f,[0,0],[4,3],RED,'u + v',3.6,16);
  var x0=f.R+18;
  TB('AB + BC = AC',x0,H*.3,BLUE_D,22,'left');TB('AB(xB − xA ; yB − yA)',x0,H*.5,ORANGE,15,'left');TB('‖u‖ = √(x² + y²)',x0,H*.68,DRED,18,'left');TB('xy′ − x′y = 0',x0,H*.86,DGREEN,18,'left');
 },
 anim: function (t) {
  var f=m4_fr(-1,7,-1,5,{l:26,r:W*.36,t:14,b:18});
  m4_grid(f,1,1,true);
  var c=t%420,u=[3,1],v=[1,2];
  var a1=m4_ss(c/60),a2=m4_ss((c-70)/70),a3=m4_ss((c-170)/60),a4=m4_ss((c-250)/70);
  m4_vec(f,[0,0],[u[0]*a1,u[1]*a1],BLUE,a1>.95?'u':'',3.6,-14);
  if(c>70){var s=[u[0]+(0-u[0])*0,u[1]];var px=u[0]*a2,py=u[1]*a2;
   if(a2<.99)m4_vec(f,[0,0],v,'#c9b384','',2,0,[4,4]);
   m4_vec(f,[px,py],[px+v[0],py+v[1]],ORANGE,a2>.95?'v':'',3.6,-14);}
  if(c>170)m4_vec(f,[0,0],[(u[0]+v[0])*a3,(u[1]+v[1])*a3],RED,a3>.95?'u + v':'',4,18);
  if(c>250){ctx.globalAlpha=a4;LN(f.X(v[0]),f.Y(v[1]),f.X(u[0]+v[0]),f.Y(u[1]+v[1]),BLUE,1.8,[5,4]);LN(f.X(u[0]),f.Y(u[1]),f.X(u[0]+v[0]),f.Y(u[1]+v[1]),ORANGE,1.8,[5,4]);m4_vec(f,[0,0],v,ORANGE,'',2,0,[3,3]);ctx.globalAlpha=1;}
  var x0=f.R+22;
  TB('u(3 ; 1)  +  v(1 ; 2)',x0,34,BLUE_D,17,'left');
  TB('somme : on additionne les',x0,72,GREY,14,'left');TB('composantes une à une',x0,92,GREY,14,'left');
  ctx.globalAlpha=m4_ap(c,170,230);TB('u + v = (4 ; 3)',x0,134,DRED,19,'left');
  TB('‖u + v‖ = √(16 + 9) = 5',x0,166,DRED,16,'left');ctx.globalAlpha=1;
  ctx.globalAlpha=m4_ap(c,250,310);TB('‖u‖ + ‖v‖ = √10 + √5 ≈ 5,4',x0,206,GREY,14,'left');TB('5 ≤ 5,4 : ‖u + v‖ ≤ ‖u‖ + ‖v‖',x0,228,VIO_D,14,'left');
  TB('Chasles : AB + BC = AC',x0,262,DGREEN,15,'left');ctx.globalAlpha=1;
 },
 th: '<div class="tcard"><b class="h">Vecteur, composantes, norme</b><p>Un vecteur est défini par une <b>direction</b>, un <b>sens</b> et une <b>norme</b> (longueur). Pour A(x<sub>A</sub> ; y<sub>A</sub>) et B(x<sub>B</sub> ; y<sub>B</sub>) : <b>AB (x<sub>B</sub> − x<sub>A</sub> ; y<sub>B</sub> − y<sub>A</sub>)</b> et ‖AB‖ = √((x<sub>B</sub> − x<sub>A</sub>)² + (y<sub>B</sub> − y<sub>A</sub>)²). Deux vecteurs sont égaux s\'ils ont mêmes composantes ; ABCD est un parallélogramme ⇔ AB = DC.</p><p>Exemple : A(1 ; 2), B(4 ; −1) : AB(3 ; −3), ‖AB‖ = √18 = 3√2 ≈ 4,24. <b>Piège</b> : on soustrait « arrivée − départ » (pour A(2 ; 5), B(−1 ; 1) : AB(−3 ; −4)).</p></div>'+
 '<div class="tcard"><b class="h">Opérations et relation de Chasles</b><p><b>u + v</b> : on additionne les composantes (u(3 ; 1) + v(1 ; 2) = (4 ; 3)) ; <b>k·u</b> : on multiplie chaque composante par k (le sens change si k &lt; 0, la norme est multipliée par |k|). <b>Chasles</b> : AB + BC = AC pour tous points A, B, C.</p><p>La norme d\'une somme n\'est pas la somme des normes : ‖u + v‖ ≤ ‖u‖ + ‖v‖ (ici 5 ≤ √10 + √5 ≈ 5,4). Pour u(3 ; 4) et v(5 ; 12) : u + v = (8 ; 16), ‖u + v‖ = √320 ≈ 17,9, alors que 5 + 13 = 18.</p></div>'+
 '<div class="tcard"><b class="h">Milieu et parallélogramme</b><p>Le milieu de [AB] est <b>M((x<sub>A</sub> + x<sub>B</sub>)/2 ; (y<sub>A</sub> + y<sub>B</sub>)/2)</b> ; M est le milieu ⇔ AM = MB. Pour A(−2 ; 3), B(6 ; −1) : M(2 ; 1). Pour que ABCD soit un parallélogramme, on écrit AB = DC : avec A(1 ; 1), B(5 ; 2), C(6 ; 5) on trouve D(2 ; 4). Le <b>centre de gravité</b> d\'un triangle est G = ((x<sub>A</sub> + x<sub>B</sub> + x<sub>C</sub>)/3 ; (y<sub>A</sub> + y<sub>B</sub> + y<sub>C</sub>)/3) ; il vérifie GA + GB + GC = 0.</p></div>'+
 '<div class="tcard"><b class="h">Colinéarité</b><p>Deux vecteurs u(x ; y) et v(x′ ; y′) sont <b>colinéaires</b> (v = k·u) ⇔ <b>x·y′ − x′·y = 0</b>. Trois points A, B, C sont <b>alignés</b> ⇔ AB et AC sont colinéaires. Exemple : u(2 ; −3), v(k ; 6) : 2·6 − k·(−3) = 0 donne 12 + 3k = 0, donc <b>k = −4</b>. Pour A(−1 ; 2), B(2 ; 3), C(8 ; 5) : AB(3 ; 1), AC(9 ; 3) = 3·AB ; les points sont alignés.</p></div>'+
 '<div class="tcard"><b class="h">Décomposer, déplacer, naviguer</b><p>Décomposer w = α·u + β·v : on écrit deux équations (une par composante) et on résout le système. Une <b>translation</b> de vecteur u envoie M sur M′ tel que MM′ = u. En navigation, <b>vitesse sol = vitesse propre + vitesse du vent</b> (somme de vecteurs). Exemple : 200 km/h plein est et vent de 50 km/h vers le sud : composantes (200 ; −50), norme ≈ 206 km/h.</p></div>'
});
SFA.figs("c08", [
 function (p) { /* 0 composantes et norme */
  var f=m4_fr(-1,6,-3.5,4.5,{});
  m4_grid(f,1,1,true);
  m4_P(f,1,2,'A(1 ; 2)',BLUE,-10,-16);m4_P(f,4,-1,'B(4 ; −1)',BLUE,0,18);
  m4_vec(f,[1,2],[4,-1],RED,'AB',3.8,-16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(1),f.Y(2),f.X(4),f.Y(2),ORANGE,2.2,[5,4]);LN(f.X(4),f.Y(2),f.X(4),f.Y(-1),VIOLET,2.2,[5,4]);
   tag('+3',f.X(2.5),f.Y(2)-14,DRED,14);tag('−3',f.X(4)+22,f.Y(.5),VIO_D,14);tag('AB(3 ; −3) ; ‖AB‖ = 3√2 ≈ 4,24',f.X(1.2),f.Y(-2.6),DGREEN,15);ctx.globalAlpha=1;}
 },
 function (p) { /* 1 sens des composantes */
  var f=m4_fr(-3,5,-.5,7,{});
  m4_grid(f,1,1,true);
  m4_P(f,2,5,'A(2 ; 5)',BLUE,18,-14);m4_P(f,-1,1,'B(−1 ; 1)',BLUE,0,18);
  m4_vec(f,[2,5],[-1,1],RED,'AB',3.8,16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(2),f.Y(5),f.X(-1),f.Y(5),ORANGE,2.2,[5,4]);LN(f.X(-1),f.Y(5),f.X(-1),f.Y(1),VIOLET,2.2,[5,4]);
   tag('−1 − 2 = −3',f.X(.5),f.Y(5)-14,DRED,13);tag('1 − 5 = −4',f.X(-1)-44,f.Y(3),VIO_D,13);tag('AB(−3 ; −4) ; ‖AB‖ = 5',f.X(2.6),f.Y(1.2),DGREEN,15);ctx.globalAlpha=1;}
 },
 function (p) { /* 2 milieu */
  var f=m4_fr(-4,8,-3,5.5,{});
  m4_grid(f,1,1,true);
  m4_P(f,-2,3,'A(−2 ; 3)',BLUE,0,-16);m4_P(f,6,-1,'B(6 ; −1)',BLUE,0,18);LN(f.X(-2),f.Y(3),f.X(6),f.Y(-1),BLUE_D,3);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_P(f,2,1,'M(2 ; 1)',RED,34,-14);LN(f.X(-2),f.Y(1),f.X(2),f.Y(1),'#b9bdc4',1.4,[4,4]);
   tag('(−2 + 6)/2 = 2',f.X(0),f.Y(-1.2),DRED,13);tag('(3 − 1)/2 = 1',f.X(0),f.Y(-2.4),DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 parallélogramme */
  var f=m4_fr(-1,8,-1,7,{});
  m4_grid(f,1,1,true);
  var A=[1,1],B=[5,2],C=[6,5],D=[2,4];
  LN(f.X(1),f.Y(1),f.X(5),f.Y(2),BLUE_D,3);LN(f.X(5),f.Y(2),f.X(6),f.Y(5),BLUE_D,3);
  m4_P(f,1,1,'A(1 ; 1)',BLUE,-18,16);m4_P(f,5,2,'B(5 ; 2)',BLUE,20,14);m4_P(f,6,5,'C(6 ; 5)',BLUE,20,-12);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(6),f.Y(5),f.X(2),f.Y(4),BLUE_D,3);LN(f.X(2),f.Y(4),f.X(1),f.Y(1),BLUE_D,3);
   m4_vec(f,A,B,ORANGE,'',2.6);m4_vec(f,D,C,ORANGE,'',2.6);m4_P(f,2,4,'D(2 ; 4)',RED,-24,-12);
   LN(f.X(1),f.Y(1),f.X(6),f.Y(5),'#b9bdc4',1.4,[4,4]);LN(f.X(5),f.Y(2),f.X(2),f.Y(4),'#b9bdc4',1.4,[4,4]);
   tag('AB = DC = (4 ; 1)',f.X(3.5),f.Y(.2),DRED,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 4 colinéarité paramètre */
  var f=m4_fr(-6,5,-5,8,{});
  m4_grid(f,1,1,true);
  m4_hl(f,0,'rgba(0,0,0,0)');LN(f.X(-4),f.Y(6),f.X(2),f.Y(-3),'#d6dbe0',1.6,[6,4]);
  m4_vec(f,[0,0],[2,-3],BLUE,'u(2 ; −3)',3.8,16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vec(f,[0,0],[-4,6],RED,'v(k ; 6)',3.8,-16);tag('2·6 − k·(−3) = 0 : k = −4',f.X(2.2),f.Y(5.4),DGREEN,14);tag('v = −2u',f.X(-4.2),f.Y(-.9),DRED,15);ctx.globalAlpha=1;}
  else tag('u et v colinéaires ⇒ k ?',f.X(2.2),f.Y(5.4),GREY,14);
 },
 function (p) { /* 5 points alignés */
  var f=m4_fr(-2,9,0,6.2,{});
  m4_grid(f,1,1,true);
  LN(f.X(-1.5),f.Y(2-.5/3),f.X(8.5),f.Y(5+.5/3),'#d6dbe0',1.6,[6,4]);
  m4_P(f,-1,2,'A(−1 ; 2)',BLUE,0,18);m4_P(f,2,3,'B(2 ; 3)',BLUE,0,18);m4_P(f,8,5,'C(8 ; 5)',BLUE,0,18);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vec(f,[-1,2],[2,3],ORANGE,'AB(3 ; 1)',3.6,-16);m4_vec(f,[-1,2],[8,5],RED,'',2.4,0,[7,4]);
   tag('AC(9 ; 3) = 3·AB',f.X(5.2),f.Y(4.5)-4,DRED,14);tag('AB = ⅓ AC : alignés',f.X(1.8),f.Y(.9),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 décomposer */
  var f=m4_fr(-1,9,-3.5,4.5,{});
  m4_grid(f,1,1,true);
  m4_vec(f,[0,0],[1,2],BLUE,'u(1 ; 2)',3.6,-18);
  if(p>0){var a=m4_ap(p,0,.6);ctx.globalAlpha=a;m4_vec(f,[1,2],[4,1],ORANGE,'',3.4);m4_vec(f,[4,1],[7,0],ORANGE,'2·v = (6 ; −2)',3.4,-18);ctx.globalAlpha=1;
   ctx.globalAlpha=m4_ap(p,.5,1);m4_vec(f,[0,0],[7,0],RED,'w(7 ; 0)',4.2,16);tag('w = u + 2v ; ‖w‖ = 7',f.X(4.2),f.Y(-2.4),DGREEN,15);ctx.globalAlpha=1;}
  else{m4_vec(f,[0,0],[3,-1],ORANGE,'v(3 ; −1)',3.4,16);tag('w(7 ; 0) = α·u + β·v ?',f.X(5),f.Y(3.4),GREY,15);}
 },
 function (p) { /* 7 norme d'une somme */
  var f=m4_fr(-1,9,-1,17.5,{eq:true,t:14,b:14,l:20,r:W*.5});
  m4_vec(f,[0,0],[3,4],BLUE,'u(3 ; 4)',3.6,22);m4_vec(f,[3,4],[8,16],ORANGE,'v(5 ; 12)',3.6,-30);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vec(f,[0,0],[8,16],RED,'u + v',4,-26);TB('u + v = (8 ; 16)',W*.76,H*.4,DRED,16);TB('‖u + v‖ = √320 ≈ 17,9',W*.76,H*.56,DRED,16);TB('‖u‖ + ‖v‖ = 5 + 13 = 18',W*.76,H*.72,GREY,15);ctx.globalAlpha=1;}
  else{TB('‖u + v‖ = ?',W*.76,H*.5,GREY,18);}
 },
 function (p) { /* 8 avion et vent */
  var f=m4_fr(-25,235,-75,75,{eq:true,t:12,b:12,l:12,r:12});
  LN(f.X(0),f.Y(0),f.X(225),f.Y(0),'#d6dbe0',1.6,[6,4]);
  TB('N',f.X(-12),f.Y(55),GREY,14);arrow(f.X(-12),f.Y(40),0,-34,GREY,'',1.8);
  m4_vec(f,[0,0],[200,0],BLUE,'avion 200 km/h',3.6,-18);m4_vec(f,[200,0],[200,-50],VIOLET,'vent 50',3.4,-24);
  m4_vec(f,[0,0],[200,-50],RED,'sol ≈ 206 km/h',3.8,22);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);var vx=Math.sqrt(40000-2500);
   m4_vec(f,[0,0],[vx,50],GREEN,'cap 75,5°',3.6,-20);m4_vec(f,[vx,50],[vx,0],VIOLET,'',3.2);m4_vec(f,[0,0],[vx,0],DGREEN,'',3.6,0,[7,4]);
   tag('route plein est : sol ≈ 194 km/h',f.X(105),f.Y(66),DGREEN,13);tag('route ≈ 104°',f.X(170),f.Y(-62),DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 centre de gravité */
  var f=m4_fr(-3,9,0,8.5,{});
  m4_grid(f,1,1,true);
  var A=[1,7],B=[-2,1],C=[8,4];
  ctx.fillStyle='rgba(55,138,221,.10)';ctx.beginPath();ctx.moveTo(f.X(1),f.Y(7));ctx.lineTo(f.X(-2),f.Y(1));ctx.lineTo(f.X(8),f.Y(4));ctx.closePath();ctx.fill();
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.stroke();
  m4_P(f,1,7,'A(1 ; 7)',BLUE,0,-16);m4_P(f,-2,1,'B(−2 ; 1)',BLUE,0,18);m4_P(f,8,4,'C(8 ; 4)',BLUE,0,-16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(1),f.Y(7),f.X(3),f.Y(2.5),ORANGE,2.6);LN(f.X(-2),f.Y(1),f.X(4.5),f.Y(5.5),'#b9bdc4',1.6,[5,4]);LN(f.X(8),f.Y(4),f.X(-.5),f.Y(4),'#b9bdc4',1.6,[5,4]);
   m4_P(f,3,2.5,'I(3 ; 2,5)',ORANGE,34,12);m4_P(f,7/3,4,'G(7/3 ; 4)',RED,-14,-16);tag('AG = ⅔ AI',f.X(4.4),f.Y(7.4),DGREEN,14);tag('GA + GB + GC = 0',f.X(5),f.Y(1),DRED,14);ctx.globalAlpha=1;}
 }
]);
