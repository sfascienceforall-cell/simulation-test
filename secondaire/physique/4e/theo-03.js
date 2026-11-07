/* Physique 4e · chapitre 3 : chute libre et graphes du mouvement (aides q_* de theo-01.js / theo-02.js) */
SFA.theo("c03", {
 icon: function(){TB('g = 9,8 m/s²',W*.5,H*.42,BLUE_D,34);TB('h = ½·g·t²',W*.5,H*.66,ORANGE,20);},
 anim: function(t){
  var tau=Math.min(2,(t%200)/60);var gg=9.8,d=.5*gg*tau*tau,v=gg*tau;
  var x0=W*.1,top=H*.1,bot=H*.9,sc=(bot-top)/19.6;
  LN(x0-30,top,x0+30,top,GREY,2);TB('0',x0-40,top+4,GREY,12,'right');floor(x0-34,x0+34,bot+10);
  for(var k=0;k*.5<=tau+1e-6;k++){var dd=.5*gg*(k*.5)*(k*.5);DOT(x0,top+dd*sc,7,'#fde2d3');if(k>0)TB((k*.5).toFixed(1).replace('.',',')+' s',x0+22,top+dd*sc+4,GREY,12,'left');}
  BALL(x0,top+d*sc,9);A(x0+0,top+d*sc+12,0,v*3.2,RED,'',3);TB('v = '+v.toFixed(1).replace('.',',')+' m/s',x0+34,top+d*sc+22+0,DRED,13,'left');
  var g=q_gr(W*.4,H*.9,W*.34,H*.7,2,20,'t (s)','v (m/s)',[.5,1,1.5,2],[5,10,15,20]);
  q_seg(g,0,0,tau,v,BLUE,3.2);DOT(g.X(tau),g.Y(v),6,ORANGE);q_dash(g,tau,v,'#c9ced4');
  TB('pente = g',g.X(.9),g.Y(14),BLUE_D,15);
  TB('Chute libre',W*.8,H*.2,INK,17);TB('seul le poids agit',W*.8,H*.2+24,GREY,14);
  TB('a = g = 9,8 m/s²',W*.8,H*.2+60,RED,17);TB('v = g·t',W*.8,H*.2+90,BLUE_D,16);TB('h = ½·g·t² = '+d.toFixed(1).replace('.',',')+' m',W*.8,H*.2+118,ORANGE,15);
 },
 th: '<div class="tcard"><b class="h">Chute libre</b><p>Un objet en <b>chute libre</b> n\'est soumis qu\'à son poids (on néglige l\'air). Son accélération est <b>g = 9,8 m/s²</b> (≈ 10), la <b>même pour tous les objets</b>, quelle que soit leur masse : un marteau et une plume tombent ensemble dans le vide. Depuis le repos : <b>v = g·t</b>, <b>h = ½·g·t²</b>, donc t = √(2h/g). Exemple : 20 m de haut → t = √(40/9,8) ≈ 2,0 s.</p></div>'+
 '<div class="tcard"><b class="h">Avec l\'air : la résistance</b><p>L\'air exerce une force de frottement qui <b>augmente avec la vitesse</b> et dépend de la forme. L\'accélération diminue alors peu à peu jusqu\'à s\'annuler : la vitesse se stabilise à une <b>vitesse limite</b>. Une feuille à plat tombe lentement, la même feuille en boule bien plus vite. Un parachutiste mesure ainsi des accélérations de 9,7 m/s² au début puis de 3,6 m/s² après 5 s.</p></div>'+
 '<div class="tcard"><b class="h">Lancer vertical vers le haut</b><p>Pendant toute la montée <b>et</b> la descente, a = −g. Au sommet, <b>v = 0 mais a = −g</b> (toujours dirigée vers le bas). Temps de montée : <b>t = v₀ / g</b> ; hauteur maximale : <b>h = v₀² / 2g</b> ; durée totale = 2 × temps de montée. Exemple : v₀ = 20 m/s → 2,04 s, 20,4 m, 4,08 s au total.</p></div>'+
 '<div class="tcard"><b class="h">Relier les trois graphes</b><p><b>x(t)</b> : parabole (chute libre). <b>v(t)</b> : droite de pente g. <b>a(t)</b> : horizontale à g. On passe de l\'un à l\'autre ainsi : la <b>pente</b> de x(t) est v, la <b>pente</b> de v(t) est a ; inversement, l\'<b>aire</b> sous a(t) donne Δv et l\'aire sous v(t) donne Δx. Au sommet d\'un lancer, x(t) a son maximum (pente nulle) : v = 0.</p></div>'+
 '<div class="tcard"><b class="h">Ailleurs dans le Système solaire</b><p>Seul g change : 9,8 m/s² sur Terre, 1,6 m/s² sur la Lune. Sur la Lune, 1,8 m de chute prennent √(3,6/1,6) = 1,5 s contre 0,61 s sur Terre : 2,5 fois plus longtemps, mais toujours la même loi h = ½·g·t². Le poids change, la masse non.</p></div>'
});

function q_drop(x,y0,y1,r,f,col){var y=y0+(y1-y0)*f;DOT(x,y,r,col||'#fdece4');ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();return y;}

SFA.figs("c03", [
 /* 1 pierre lâchée 2 s */ function(p){
  var x=W*.3,top=H*.1,bot=H*.9,sc=(bot-top)/19.6;LN(x-70,top,x+70,top,INK,3);ctx.fillStyle='#e3e6ea';ctx.fillRect(x-70,top-2,70,H*.0);
  floor(x-60,x+60,bot+10);
  [0,1,2].forEach(function(k){var d=4.9*k*k;DOT(x,top+d*sc,9,'#fde2d3');TB(k+' s',x-24,top+d*sc+5,GREY,14,'right');TB(String(d.toFixed(1)).replace('.',',')+' m',x+22,top+d*sc+5,GREY,13,'left');});
  var s=q_r(p,0,.7),d2=19.6*s;BALL(x,top+d2*sc,10);
  if(s>.99){A(x,bot,0,-0,RED,'');A(x+80,top+19.6*sc-60,0,55,RED,'',3.4);TB('v = 19,6 m/s',x+95,top+19.6*sc-30,DRED,15,'left');ctx.globalAlpha=q_r(p,.7,1);q_ok('v = 9,8 × 2 = 19,6 m/s',W*.7,H*.28,15);q_ok('d = ½ × 9,8 × 2² = 19,6 m',W*.7,H*.42,15);ctx.globalAlpha=1;}
 },
 /* 2 temps de chute */ function(p){
  var x=W*.3,top=H*.16,bot=H*.88;ctx.fillStyle='#e6e9ee';ctx.fillRect(W*.06,top,W*.14,bot-top);ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(W*.06,top,W*.14,bot-top);
  LN(W*.06,top,W*.26,top,INK,4);floor(W*.04,W*.5,bot);
  A(W*.4,top,0,bot-top,GREY,'',2);TB('20 m',W*.4+12,(top+bot)/2,INK,16,'left');
  var s=q_r(p,0,.7);q_drop(x,top-12,bot-12,10,s*s);
  q_clock(W*.74,H*.3,24,.2,ORANGE);
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('t = √(2 × 20 / 9,8)',W*.7,H*.58,16);q_ok('≈ 2,0 s',W*.7,H*.74,18);ctx.globalAlpha=1;}
 },
 /* 3 lancer vertical */ function(p){
  var g=q_gr(W*.12,H*.86,W*.78,H*.68,4.4,24,'t (s)','h (m)',[1,2,3,4],[10,20],true);
  q_plot(g,function(t){return 20*t-4.9*t*t;},0,4.0816,BLUE,3.2);
  var s=q_r(p,0,.7);if(s>0){ctx.globalAlpha=s;q_dash(g,2.0408,20.408,DGREEN);DOT(g.X(2.0408),g.Y(20.408),7,ORANGE);TB('2,04 s ; 20,4 m',g.X(2.0408),g.Y(20.408)-14,ORANGE,14);DOT(g.X(4.0816),g.Y(0),7,GREEN);TB('4,08 s',g.X(4.0816)-4,g.Y(0)-14,DGREEN,14,'right');ctx.globalAlpha=1;}
  TB('v₀ = 20 m/s',g.X(.15),g.Y(22),BLUE_D,14,'left');
 },
 /* 4 Lune */ function(p){
  var top=H*.14,bot=H*.84,s=q_r(p,0,1)*1.5,hL=Math.min(1,.5*1.6*s*s/1.8),hT=Math.min(1,.5*9.8*s*s/1.8);
  [['LUNE  g = 1,6',W*.27,hL,'1,5 s',GREY,'#cfd3d8'],['TERRE  g = 9,8',W*.73,hT,'0,61 s',BLUE,'#bcd9f5']].forEach(function(o,i){
   var x=o[1];ctx.fillStyle=i?'#c8e0f7':'#e0e2e6';ctx.fillRect(x-60,bot,120,H*.1);LN(x-60,bot,x+60,bot,INK,2.5);TB(o[0],x,H*.08,i?BLUE_D:INK,15);
   LN(x-50,top,x-50,bot,GREY,1.4,[4,4]);TB('1,8 m',x-54,(top+bot)/2,GREY,13,'right');
   ctx.fillStyle=ORA2;var y=top+(bot-top-18)*o[2];ctx.fillRect(x-4,y,8,22);ctx.fillRect(x-16,y-6,32,12);});
  if(p>0){ctx.globalAlpha=q_r(p,.5,1);q_ok('1,5 s',W*.27,H*.96,16);q_ok('0,61 s',W*.73,H*.96,16);ctx.globalAlpha=1;}
 },
 /* 5 plume et marteau */ function(p){
  var cx=W*.5,top=H*.18,bot=H*.8;ctx.strokeStyle=BLUE;ctx.lineWidth=2.5;ctx.fillStyle='rgba(55,138,221,.06)';ctx.beginPath();ctx.moveTo(cx-W*.32,bot+8);ctx.lineTo(cx-W*.32,top+22);ctx.arc(cx,top+22,W*.32,PI,0);ctx.lineTo(cx+W*.32,bot+8);ctx.fill();ctx.stroke();
  floor(cx-W*.4,cx+W*.4,bot+8);TB('vide',cx,top-6,BLUE_D,15);
  var s=q_r(p,0,.8),y=top+30+(bot-top-60)*s*s;
  ctx.fillStyle=ORA2;ctx.fillRect(cx-W*.14-3,y,6,26);ctx.fillRect(cx-W*.14-15,y-6,30,13);
  ctx.strokeStyle=GREEN;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx+W*.14,y+22);ctx.quadraticCurveTo(cx+W*.14+14,y+8,cx+W*.14+2,y-6);ctx.moveTo(cx+W*.14,y+22);ctx.quadraticCurveTo(cx+W*.14-12,y+8,cx+W*.14-2,y-6);ctx.stroke();
  TB('marteau',cx-W*.14,bot+30,INK,14);TB('plume',cx+W*.14,bot+30,DGREEN,14);
  if(s>.99){ctx.globalAlpha=q_r(p,.8,1);q_ok('arrivée simultanée',cx,H*.5,17);ctx.globalAlpha=1;}
 },
 /* 6 sommet */ function(p){
  var x0=W*.12,y0=H*.84,x1=W*.88;ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,y0-2*(y0-H*.28),x1,y0);ctx.stroke();ctx.setLineDash([]);
  var bx=(x0+x1)/2,by=H*.28;BALL(bx,by,11);A(bx,by+14,0,70,DRED,'g',3.4);TB('poids',bx+14,by+60,DRED,14,'left');
  DOT(bx,by,3,INK);TB('point le plus haut',bx,by-24,INK,15);
  var a=q_r(p,0,.6);if(a>0){ctx.globalAlpha=a;q_ok('v = 0',W*.26,H*.5,18);q_ok('a = −g ≠ 0',W*.74,H*.5,18);ctx.globalAlpha=1;}
 },
 /* 7 puits */ function(p){
  var x=W*.3,top=H*.2,bot=H*.88;ctx.fillStyle='#e3e6ea';ctx.fillRect(W*.05,top,x-W*.1-W*.05+W*.1,H*.0);
  ctx.fillStyle='#eef1f4';ctx.fillRect(W*.05,top,W*.5,bot-top);ctx.fillStyle='#fff';ctx.fillRect(x-W*.06,top,W*.12,bot-top);
  LN(x-W*.06,top,x-W*.06,bot,INK,3);LN(x+W*.06,top,x+W*.06,bot,INK,3);LN(x-W*.06,bot,x+W*.06,bot,INK,3);
  ctx.fillStyle='#9ec5ea';ctx.fillRect(x-W*.06+1,bot-14,W*.12-2,13);
  var s=q_r(p,0,.55),y=top+(bot-top-30)*s*s;BALL(x,y,9);
  A(x+W*.2,top,0,bot-top,GREY,'',2);TB('h ?',x+W*.2+12,(top+bot)/2,INK,18,'left');
  q_clock(W*.74,H*.22,22,.5,ORANGE);TB('3,0 s en tout',W*.74+30,H*.22+5,ORANGE,14,'left');
  var r=q_r(p,.55,.8);if(r>0){ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;for(var k=0;k<3;k++){ctx.globalAlpha=1-k*.25;ctx.beginPath();ctx.arc(x,bot-14,10+k*8+(1-r)*0,PI*1.15,PI*1.85);ctx.stroke();}ctx.globalAlpha=1;A(x,bot-30,0,-(bot-top-50)*r,BLUE,'',2);}
  if(p>.8){ctx.globalAlpha=q_r(p,.8,1);q_ok('chute 2,88 s + son 0,12 s',W*.72,H*.6,14);q_ok('h ≈ 41 m (pas 44 m)',W*.72,H*.76,16);ctx.globalAlpha=1;}
 },
 /* 8 feuille froissée */ function(p){
  var top=H*.14,bot=H*.84,s=q_r(p,0,.8);
  var yF=top+(bot-top-24)*(s*.45),yB=top+(bot-top-24)*(s*s*(2-s));
  floor(W*.05,W*.95,bot+8);TB('3 m',W*.06,H*.5,GREY,13,'left');
  var xa=W*.32,xb=W*.68;
  ctx.fillStyle='#fff';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(xa-40,yF,80,6,2);ctx.fill();ctx.stroke();
  A(xa,yF+10,0,34,DRED,'',3);A(xa-22,yF-4,0,-30,GREEN,'',3);A(xa+22,yF-4,0,-30,GREEN,'',3);
  DOT(xb,yB+10,11,'#fff');ctx.strokeStyle=BLUE;ctx.beginPath();ctx.arc(xb,yB+10,11,0,7);ctx.stroke();ctx.beginPath();ctx.arc(xb-3,yB+8,6,.5,4);ctx.stroke();
  A(xb,yB+24,0,34,DRED,'',3);A(xb,yB-4,0,-14,GREEN,'',3);
  TB('à plat',xa,bot+32,INK,14);TB('en boule',xb,bot+32,INK,14);
  if(p>.7){ctx.globalAlpha=q_r(p,.7,1);q_ok('la boule gagne',W*.5,H*.1,16);ctx.globalAlpha=1;}
 },
 /* 9 deux balles */ function(p){
  var x0=W*.34,top=H*.1,bot=H*.9,sc=(bot-top)/40;var Y=function(h){return bot-h*sc;};
  LN(x0,top,x0,bot,AX,2);floor(x0-40,x0+40,bot+8);for(var h=0;h<=40;h+=10){LN(x0-5,Y(h),x0+5,Y(h),GREY,1.5);T(h+' m',x0-10,Y(h)+4,GREY,12,'right');}
  var s=q_r(p,0,.7),t=s,hA=20*t-4.9*t*t,hB=20-4.9*t*t;
  BALL(x0+26,Y(hA),9);TB('A',x0+44,Y(hA)+5,BLUE_D,15,'left');DOT(x0-26,Y(hB),9,'#e6f1fb');ctx.strokeStyle=BLUE;ctx.beginPath();ctx.arc(x0-26,Y(hB),9,0,7);ctx.stroke();TB('B',x0-42,Y(hB)+5,BLUE_D,15,'right');
  A(x0+26,Y(hA),0,-20*(1-s)*sc*.8,GREEN,'',2.4);
  if(s>.99){DOT(x0,Y(15.1),5,GREEN);ctx.globalAlpha=q_r(p,.7,1);q_ok('t = 20 / 20 = 1,0 s',W*.72,H*.22,16);q_ok('h = 15,1 m',W*.72,H*.4,16);TB('A : 10,2 m/s ↑',W*.72,H*.58,BLUE_D,15);TB('B : 9,8 m/s ↓',W*.72,H*.7,DRED,15);ctx.globalAlpha=1;}
 },
 /* 10 parachutiste */ function(p){
  var g=q_gr(W*.12,H*.86,W*.78,H*.68,7,50,'t (s)','v (m/s)',[1,2,3,4,5,6],[10,20,30,40,50],true);
  q_seg(g,0,0,6,58.8,GREY,1.6,[5,4]);TB('sans air',g.X(4.6),g.Y(46)-4,GREY,13);
  var D=[[0,0],[1,9.7],[2,18.6],[3,26.4],[4,32.8],[5,37.7],[6,41.3]];ctx.strokeStyle=BLUE;ctx.lineWidth=2.6;ctx.beginPath();D.forEach(function(q,i){i?ctx.lineTo(g.X(q[0]),g.Y(q[1])):ctx.moveTo(g.X(q[0]),g.Y(q[1]));});ctx.stroke();D.forEach(function(q){DOT(g.X(q[0]),g.Y(q[1]),5,BLUE);});
  var s=q_r(p,0,.6);if(s>0){ctx.globalAlpha=s;q_seg(g,0,0,1,9.7,RED,3.4);TB('a ≈ 9,7',g.X(1)+8,g.Y(5),DRED,14,'left');q_seg(g,5,37.7,6,41.3,RED,3.4);TB('a ≈ 3,6 m/s²',g.X(6)-6,g.Y(37.7)+22,DRED,14,'right');q_ok('a diminue : vitesse limite',W*.5,H*.1,15);ctx.globalAlpha=1;}
 }
]);
