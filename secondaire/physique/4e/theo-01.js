/* Physique 4e · chapitre 1 : mouvement et vitesse.
   Ce fichier définit aussi les petites aides q_* partagées par theo-02 … theo-10. */
function q_r(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function q_gr(x0,y0,w,h,tm,ym,xl,yl,tt,yt,grid){
 var X=function(t){return x0+t/tm*w;},Y=function(v){return y0-v/ym*h;};
 if(grid){ctx.strokeStyle='#eceef1';ctx.lineWidth=1;(tt||[]).forEach(function(v){ctx.beginPath();ctx.moveTo(X(v),y0);ctx.lineTo(X(v),y0-h);ctx.stroke();});(yt||[]).forEach(function(v){ctx.beginPath();ctx.moveTo(x0,Y(v));ctx.lineTo(x0+w,Y(v));ctx.stroke();});}
 LN(x0,y0,x0+w+8,y0,AX,1.6);LN(x0,y0+4,x0,y0-h-8,AX,1.6);
 TB(xl,x0+w+10,y0-8,GREY,12,'right');TB(yl,x0+6,y0-h-10,GREY,12,'left');
 (tt||[]).forEach(function(v){LN(X(v),y0,X(v),y0+4,GREY,1);T(String(v).replace('.',','),X(v),y0+16,GREY,11);});
 (yt||[]).forEach(function(v){LN(x0-4,Y(v),x0,Y(v),GREY,1);T(String(v).replace('.',','),x0-6,Y(v)+4,GREY,11,'right');});
 return {X:X,Y:Y};}
function q_plot(g,f,a,b,col,w,n){ctx.strokeStyle=col;ctx.lineWidth=w||2.6;ctx.beginPath();n=n||80;for(var i=0;i<=n;i++){var t=a+(b-a)*i/n,v=f(t);i?ctx.lineTo(g.X(t),g.Y(v)):ctx.moveTo(g.X(t),g.Y(v));}ctx.stroke();}
function q_seg(g,t1,v1,t2,v2,col,w,d){LN(g.X(t1),g.Y(v1),g.X(t2),g.Y(v2),col,w||2.6,d);}
function q_dash(g,t,v,col){LN(g.X(t),g.Y(v),g.X(t),g.Y(0),col||GREY,1.2,[4,4]);LN(g.X(t),g.Y(v),g.X(0),g.Y(v),col||GREY,1.2,[4,4]);}
function q_road(y,x1,x2){ctx.fillStyle='#e6e8eb';ctx.fillRect(x1,y,x2-x1,9);LN(x1,y,x2,y,INK,2);for(var x=x1+6;x<x2-10;x+=26)LN(x,y+5,x+12,y+5,'#fff',2);}
function q_pill(txt,x,y,col,size,bg){var s=size||14;ctx.font='600 '+s+'px system-ui';var w=ctx.measureText(txt).width+18;ctx.fillStyle=bg||'#fff';ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.beginPath();ctx.roundRect(x-w/2,y-s*.95,w,s*1.9,s);ctx.fill();ctx.stroke();TB(txt,x,y+s*.36,col,s);}
function q_clock(x,y,r,frac,col){DOT(x,y,r,'#fff');ctx.strokeStyle=col||INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();var a=-PI/2+frac*2*PI;LN(x,y,x+r*.75*Math.cos(a),y+r*.75*Math.sin(a),col||INK,2.4);DOT(x,y,2.5,col||INK);}

SFA.theo("c01", {
 icon: function(){TB('v = d / t',W*.5,H*.45,BLUE_D,36);TB('72 km/h = 20 m/s',W*.5,H*.68,ORANGE,18);},
 anim: function(t){
  var tau=(t%360)/60,x0=W*.07,x1=W*.93,yr=H*.36,xs=function(d){return x0+(x1-x0)*d/50;};
  q_road(yr,x0-10,x1+10);
  for(var k=0;k<=5;k++){LN(xs(k*10),yr+9,xs(k*10),yr+22,GREY,1.5);T(k*10+' m',xs(k*10),yr+36,GREY,12);}
  var d=tau*10;car(xs(d),yr-20,BLUE);
  TB('v = 10 m/s',xs(d),yr-52,BLUE_D,14);
  var g=q_gr(W*.12,H*.94,W*.5,H*.40,5,50,'t (s)','x (m)',[1,2,3,4,5],[10,30,50]);
  q_seg(g,0,0,tau,d,BLUE,3);DOT(g.X(tau),g.Y(d),6,ORANGE);
  q_dash(g,tau,d,'#c9ced4');
  if(tau>2.2){var ta=1,tb=3;LN(g.X(ta),g.Y(10),g.X(tb),g.Y(10),RED,2);LN(g.X(tb),g.Y(10),g.X(tb),g.Y(30),RED,2);
   TB('Δt = 2 s',g.X(2),g.Y(10)+16,DRED,13);TB('Δx = 20 m',g.X(tb)+8,g.Y(20),DRED,13,'left');}
  TB('pente de x(t)',W*.70,H*.62,INK,14,'left');TB('= vitesse',W*.70,H*.62+20,INK,14,'left');
  TB('v = Δx / Δt',W*.70,H*.62+50,BLUE_D,20,'left');TB('= 20 / 2 = 10 m/s',W*.70,H*.62+76,ORANGE,15,'left');
 },
 th: '<div class="tcard"><b class="h">Référentiel et trajectoire</b><p>Un mouvement se décrit <b>par rapport à un référentiel</b> (le quai, la route, le train…). Un passager est <i>immobile</i> dans le train mais <i>en mouvement</i> par rapport au quai : le repos et le mouvement sont relatifs. La <b>trajectoire</b> est la ligne que suit l\'objet (rectiligne, circulaire, courbe).</p></div>'+
 '<div class="tcard"><b class="h">Vitesse moyenne</b><p><b>v = d / t</b> (distance parcourue divisée par la durée). Unités : m/s (SI) ou km/h. <b>1 m/s = 3,6 km/h</b> : pour passer de km/h à m/s on <b>divise par 3,6</b>, dans l\'autre sens on multiplie. Exemple : 72 km/h = 72 / 3,6 = 20 m/s. Attention aux durées : 2 h 30 min = 2,5 h, pas 2,30 h.</p></div>'+
 '<div class="tcard"><b class="h">Le graphique position-temps x(t)</b><p>Une <b>droite</b> = vitesse constante (MRU). La <b>pente</b> vaut la vitesse : v = Δx / Δt. Droite horizontale : le mobile est immobile. Droite qui descend : v est <b>négative</b> (le mobile revient vers l\'origine). Une courbe qui se redresse : le mobile accélère. Deux mobiles se croisent là où leurs courbes se coupent.</p></div>'+
 '<div class="tcard"><b class="h">Composer les vitesses</b><p>On choisit un sens positif puis on additionne les vitesses <b>dans le même référentiel</b>. Passager marchant à 1 m/s dans un train à 25 m/s : 26 m/s par rapport au quai. Pour un rattrapage, c\'est l\'écart de vitesse qui compte : une moto à 15 m/s derrière un vélo à 6 m/s gagne 15 − 6 = 9 m chaque seconde.</p></div>'+
 '<div class="tcard"><b class="h">Piège : la moyenne des vitesses</b><p>Aller de 180 km à 90 km/h (2 h), retour à 60 km/h (3 h) : v<sub>moy</sub> = 360 km / 5 h = <b>72 km/h</b>, et non (90 + 60)/2 = 75 km/h. On ne moyenne jamais les vitesses : on divise la distance <b>totale</b> par la durée <b>totale</b>.</p></div>'
});

SFA.figs("c01", [
 /* 1. convertir 72 km/h */
 function(p){
  var yr=H*.5;q_road(yr,W*.04,W*.96);car(W*.22,yr-20,ORA2);
  A(W*.22+34,yr-20,60,0,BLUE,'',3);
  q_pill('72 km/h',W*.58,H*.2,BLUE_D,24);
  var a=q_r(p,0,.5);ctx.globalAlpha=a;
  TB('÷ 3,6',W*.5,H*.72,ORANGE,22);
  q_pill('20 m/s',W*.5,H*.88,DGREEN,26,'#e8f7f1');ctx.globalAlpha=1;
  TB('1 m/s = 3,6 km/h',W*.5,H*.38,GREY,14);
 },
 /* 2. train 150 km en 2 h 30 */
 function(p){
  var y=H*.46,x0=W*.1,x1=W*.9;LN(x0,y,x1,y,INK,3);
  for(var x=x0;x<=x1;x+=(x1-x0)/10)LN(x,y-6,x,y+6,INK,2);
  DOT(x0,y,8,BLUE);DOT(x1,y,8,RED);TB('départ',x0,y+30,BLUE_D,14);TB('arrivée',x1,y+30,DRED,14);
  A(x0,y-34,x1-x0,0,GREY,'',2);TB('d = 150 km',W*.5,y-50,INK,18);
  q_clock(W*.5,y+68,24,.5,ORANGE);TB('2 h 30 min = 2,5 h',W*.5+40,y+74,ORANGE,15,'left');
  var xt=x0+(x1-x0)*q_r(p,0,.8);car(xt,y-20+0,BLUE);
  ctx.globalAlpha=q_r(p,.5,1);q_pill('v = 150 / 2,5 = 60 km/h',W*.5,H*.1,DGREEN,17,'#e8f7f1');ctx.globalAlpha=1;
 },
 /* 3. lire x(t) : (0;10) -> (4;30) */
 function(p){
  var g=q_gr(W*.14,H*.84,W*.74,H*.68,5,40,'t (s)','x (m)',[1,2,3,4,5],[10,20,30,40],true);
  q_seg(g,0,10,5,35,BLUE,3);DOT(g.X(0),g.Y(10),6,ORANGE);DOT(g.X(4),g.Y(30),6,ORANGE);
  TB('(0 ; 10)',g.X(0)+10,g.Y(10)+20,ORANGE,13,'left');TB('(4 ; 30)',g.X(4)-8,g.Y(30)-12,ORANGE,13,'right');
  var a=q_r(p,0,.7);if(a>0){var tx=g.X(0)+(g.X(4)-g.X(0))*a;LN(g.X(0),g.Y(10),tx,g.Y(10),RED,2.4);
   if(a>.99){LN(g.X(4),g.Y(10),g.X(4),g.Y(30),RED,2.4);TB('Δt = 4 s',g.X(2),g.Y(10)+18,DRED,14);TB('Δx = 20 m',g.X(4)+8,g.Y(20),DRED,14,'left');q_pill('v = 20 / 4 = 5 m/s',W*.34,H*.16,DGREEN,16,'#e8f7f1');}}
 },
 /* 4. rattraper un cycliste */
 function(p){
  var g=q_gr(W*.14,H*.86,W*.78,H*.70,60,400,'t (s)','x (m)',[10,20,30,40,50,60],[100,200,300,400],true);
  q_seg(g,0,0,60,360,BLUE,3);q_seg(g,30,0,60,450,ORA2,3);
  TB('cycliste 6 m/s',g.X(24),g.Y(144)-14,BLUE_D,13);TB('moto 15 m/s',g.X(52),g.Y(330)-30,DRED,13);
  var a=q_r(p,0,.7);if(a>0){ctx.globalAlpha=a;q_dash(g,50,300,DGREEN);DOT(g.X(50),g.Y(300),8,GREEN);
   TB('t = 50 s, x = 300 m',g.X(50)-10,g.Y(300)-14,DGREEN,14,'right');ctx.globalAlpha=1;}
  TB('30 s plus tard →',g.X(30),g.Y(0)-8,GREY,12,'left');
 },
 /* 5. train et tunnel */
 function(p){
  var y=H*.55,xt0=W*.3,xt1=W*.72;
  ctx.fillStyle='#d8dde3';ctx.beginPath();ctx.roundRect(xt0,y-48,xt1-xt0,48,[24,24,0,0]);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();
  TB('tunnel 1,2 km',(xt0+xt1)/2,y-30,INK,15);LN(W*.03,y,W*.97,y,INK,2.5);
  var L=W*.14,s=q_r(p,0,1);var front=W*.1+(xt1-W*.1)*s+0*L; /* position de l'avant */
  var xf=W*.12+(xt1-W*.12)*s;ctx.fillStyle='#378ADD';ctx.fillRect(xf-L,y-22,L,18);DOT(xf-L*.2,y-1,5,'#555');DOT(xf-L*.8,y-1,5,'#555');
  ctx.fillStyle=ORA2;ctx.fillRect(xf-8,y-22,8,18);TB('300 m',xf-L/2,y+22,BLUE_D,14);
  A(W*.12,y+50,xt1-W*.12,0,DGREEN,'',3);TB('1 200 + 300 = 1 500 m',(W*.12+xt1)/2,y+76,DGREEN,16);
  ctx.globalAlpha=q_r(p,.6,1);q_pill('t = 1 500 / 35 ≈ 43 s',W*.5,H*.14,DGREEN,17,'#e8f7f1');ctx.globalAlpha=1;
  T('126 km/h = 35 m/s',W*.5,H*.3,GREY,13);
 },
 /* 6. droite descendante */
 function(p){
  var g=q_gr(W*.14,H*.84,W*.74,H*.68,14,70,'t (s)','x (m)',[2,4,6,8,10,12],[20,40,60],true);
  q_seg(g,0,60,12,0,BLUE,3);DOT(g.X(0),g.Y(60),6,ORANGE);DOT(g.X(12),g.Y(0),6,ORANGE);
  TB('(0 ; 60)',g.X(0)+12,g.Y(60)-8,ORANGE,13,'left');TB('(12 ; 0)',g.X(12),g.Y(0)-12,ORANGE,13);
  var a=q_r(p,0,.8);if(a>0){ctx.globalAlpha=a;LN(g.X(0),g.Y(60),g.X(12),g.Y(60),RED,2,[5,4]);LN(g.X(12),g.Y(60),g.X(12),g.Y(0),RED,2,[5,4]);
   TB('Δx = −60 m',g.X(12)+6,g.Y(30),DRED,14,'left');TB('Δt = 12 s',g.X(6),g.Y(60)-8,DRED,14);
   q_pill('v = −60 / 12 = −5 m/s',W*.62,H*.46,DGREEN,16,'#e8f7f1');ctx.globalAlpha=1;}
 },
 /* 7. aller-retour */
 function(p){
  var x0=W*.12,x1=W*.88,y1=H*.34,y2=H*.62;
  DOT(x0,H*.48,7,BLUE);DOT(x1,H*.48,7,RED);
  A(x0+10,y1,x1-x0-20,0,BLUE,'',3.4);TB('aller : 180 km à 90 km/h → 2 h',W*.5,y1-14,BLUE_D,15);
  A(x1-10,y2,-(x1-x0-20),0,ORA2,'',3.4);TB('retour : 180 km à 60 km/h → 3 h',W*.5,y2+26,DRED,15);
  var a=q_r(p,0,.7);ctx.globalAlpha=a;
  q_pill('360 km / 5 h = 72 km/h',W*.5,H*.9,DGREEN,18,'#e8f7f1');
  T('et non (90 + 60)/2 = 75',W*.5,H*.1,GREY,14);ctx.globalAlpha=1;
 },
 /* 8. référentiels */
 function(p){
  var gy=H*.68;floor(W*.02,W*.98,gy);
  ctx.fillStyle='#dbe7ff';ctx.strokeStyle=BLUE;ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(W*.12,gy-62,W*.46,46,8);ctx.fill();ctx.stroke();
  DOT(W*.2,gy-10,8,'#555');DOT(W*.5,gy-10,8,'#555');
  pers(W*.38,gy-16,38,GREEN,1,'');A(W*.38+14,gy-46,46,0,DGREEN,'',3);TB('+1',W*.38+68,gy-42,DGREEN,14);
  A(W*.13,gy-80,70,0,BLUE,'',3.2);TB('train : +25 m/s',W*.13,gy-92,BLUE_D,14,'left');
  pers(W*.84,gy,54,ORA2,-1,'');A(W*.84-20,gy-32,-50,0,ORA2,'',3);TB('coureur : −4 m/s',W*.84,gy-92,DRED,14);
  var a=q_r(p,0,.6);ctx.globalAlpha=a;
  q_pill('/ quai : 25 + 1 = 26 m/s',W*.5,H*.82,BLUE_D,14);q_pill('/ coureur : 26 − (−4) = 30 m/s',W*.5,H*.93,DGREEN,14,'#e8f7f1');ctx.globalAlpha=1;
 },
 /* 9. contrôle de vitesse sur tronçon */
 function(p){
  var y=H*.5,xa=W*.14,xb=W*.86;q_road(y,W*.03,W*.97);
  [xa,xb].forEach(function(x,i){LN(x,y,x,y-60,INK,3);ctx.fillStyle=i?DRED:BLUE_D;ctx.beginPath();ctx.roundRect(x-16,y-84,32,26,5);ctx.fill();DOT(x,y-71,7,'#fff');DOT(x,y-71,3.5,INK);});
  A(xa,y+40,xb-xa,0,GREY,'',2);TB('2,0 km',W*.5,y+34,INK,16);
  var s=q_r(p,0,.8);car(xa+(xb-xa)*s,y-20,BLUE);
  q_clock(W*.4,H*.2,20,100/360,ORANGE);TB('1 min 40 s = 100 s',W*.4+30,H*.2+5,ORANGE,14,'left');
  ctx.globalAlpha=q_r(p,.5,1);q_pill('2 000 / 100 = 20 m/s = 72 km/h > 70',W*.5,H*.88,DRED,16,'#fdecec');ctx.globalAlpha=1;
 },
 /* 10. rencontre de deux trains */
 function(p){
  var g=q_gr(W*.14,H*.86,W*.78,H*.70,1.25,100,'t (h)','x (km)',[0.25,0.5,0.75,1,1.25],[25,50,75,100],true);
  TB('Liège',g.X(0)-6,g.Y(100)-2,DRED,13,'right');TB('Bxl',g.X(0)-6,g.Y(0)+4,BLUE_D,13,'right');
  q_seg(g,0,0,1,100,BLUE,3);q_seg(g,.25,100,1.25,20,ORA2,3);
  TB('A : 100 km/h',g.X(.3),g.Y(42),BLUE_D,13);TB('B : 80 km/h',g.X(1.0),g.Y(52),DRED,13);TB('t = 0 : 8 h 00',g.X(0)+8,g.Y(0)-30,GREY,12,'left');
  var a=q_r(p,0,.7);if(a>0){ctx.globalAlpha=a;q_dash(g,2/3,66.7,DGREEN);DOT(g.X(2/3),g.Y(66.7),8,GREEN);q_pill('8 h 40 · 66,7 km',g.X(2/3)-20,g.Y(66.7)+30,DGREEN,14,'#e8f7f1');ctx.globalAlpha=1;}
 }
]);
