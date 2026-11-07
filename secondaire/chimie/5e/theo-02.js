/* Chimie 5e · chapitre 2 : théorie animée et devantures */
function k5_lp(x,y,ang,d,col,s){ /* doublet de points à la distance d dans la direction ang */
 var cx=x+Math.cos(ang)*d,cy=y+Math.sin(ang)*d,nx=-Math.sin(ang)*(s||4),ny=Math.cos(ang)*(s||4);DOT(cx+nx,cy+ny,3.4,col||BLUE);DOT(cx-nx,cy-ny,3.4,col||BLUE);}
function k5_sg(x,y,ang,d,col){DOT(x+Math.cos(ang)*d,y+Math.sin(ang)*d,3.6,col||BLUE);}
function k5_bar(x,y,wd,h,fill,stroke){ctx.fillStyle=fill;ctx.fillRect(x,y,wd,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.strokeRect(x,y,wd,h);}}
function k5_morse(r,D,r0){var a=3/r0;var q=1-Math.exp(-a*(r-r0));return D*(q*q-1);}
function k5_curve(xf,yf,r1,r2,D,r0,col,lw,dash){ctx.strokeStyle=col;ctx.lineWidth=lw||2.4;if(dash)ctx.setLineDash(dash);ctx.beginPath();
 for(var i=0;i<=80;i++){var r=r1+(r2-r1)*i/80,E=k5_morse(r,D,r0);i?ctx.lineTo(xf(r),yf(E)):ctx.moveTo(xf(r),yf(E));}ctx.stroke();ctx.setLineDash([]);}
/* cloud électronique d'une liaison entre deux atomes d'abscisses xa, xb : décalage s (-1..1) vers b */
function k5_cloud(xa,xb,y,s,col,ry){var xm=(xa+xb)/2+s*(xb-xa)*.28,rx=(xb-xa)*.5+8;
 ctx.fillStyle=(col||BLUE)+'33';ctx.beginPath();ctx.ellipse(xm,y,rx*(1-.15*Math.abs(s)),ry||22,0,0,7);ctx.fill();}

SFA.theo("c02", {
 icon: function () {
  TB('ΔEN',W*.5,H*.4,BLUE_D,34);
  k5_at(W*.3,H*.7,17,BLUE,'',14);k5_at(W*.7,H*.7,17,RED,'',14);
  LN(W*.3+18,H*.7,W*.7-18,H*.7,INK,3);TB('liaison',W*.5,H*.9,ORANGE,16);},
 anim: function (t) {
  var D=1,r0=1,x0=W*.14,x1=W*.9,rmin=.62,rmax=2.2;
  var xf=function(r){return x0+(r-rmin)/(rmax-rmin)*(x1-x0);},yTop=H*.06,yBot=H*.6;
  var yf=function(E){return yBot-(E+1.0)/2.6*(yBot-yTop);};
  LN(x0,yf(0),x1,yf(0),AX,1.2,[4,4]);TB('0',x0-8,yf(0)+4,GREY,12,'right');
  LN(x0,yTop,x0,yBot+4,AX,1.5);TB('énergie',x0+6,yTop+8,GREY,13,'left');TB('distance r',x1,yBot+16,GREY,13,'right');
  k5_curve(xf,yf,rmin,rmax,D,r0,BLUE_D,3);
  LN(x0,yf(-1),xf(r0),yf(-1),RED,1.4,[4,4]);LN(xf(r0),yf(-1),xf(r0),yBot+4,GREEN,1.4,[4,4]);
  TB('−D',x0-6,yf(-1)+4,DRED,13,'right');TB('D : énergie de liaison',xf(1.55),yf(-1)-2,DRED,13,'left');TB('r₀',xf(r0),yBot+18,DGREEN,14);
  var r=1.25+.6*Math.sin(t*.025)*(1+.0)-.0;if(r<.7)r=.7;
  var E=k5_morse(r,D,r0),ed=E>0?RED:(Math.abs(r-r0)<.08?GREEN:BLUE);
  DOT(xf(r),yf(E),7,ed);
  TB('répulsion',xf(.75),yf(.9)-6,DRED,13);TB('attraction',xf(1.9),yf(-.55)-10,BLUE_D,13);
  var ya=H*.86,cxm=W*.5,d=(r)*W*.12;
  k5_cloud(cxm-d/2,cxm+d/2,ya,0,BLUE,16);
  k5_at(cxm-d/2,ya,16,BLUE,'A',14);k5_at(cxm+d/2,ya,16,BLUE,'B',14);
  LN(cxm-d/2+16,ya,cxm+d/2-16,ya,INK,Math.abs(r-r0)<.1?3:1.4);
  TB(Math.abs(r-r0)<.08?'liaison stable : énergie minimale':(r<r0?'trop près : les noyaux se repoussent':'trop loin : attraction faible'),W*.5,H*.97,Math.abs(r-r0)<.08?DGREEN:GREY,14);},
 th: '<div class="tcard"><b class="h">Pourquoi une liaison se forme-t-elle ?</b><p>Quand deux atomes s\'approchent, l\'attraction noyau-électrons fait baisser l\'énergie ; trop près, les noyaux se repoussent. L\'énergie est minimale à la <b>longueur de liaison r₀</b>. La profondeur du creux est l\'<b>énergie de liaison D</b> : c\'est l\'énergie à fournir pour rompre la liaison (et celle libérée quand elle se forme).</p><p>Plus la liaison est multiple, plus elle est courte et forte : C–C 154 pm, 348 kJ/mol ; C=C 134 pm, 614 kJ/mol ; C≡C 120 pm, 839 kJ/mol. Attention : 614 &lt; 2 × 348, la seconde liaison est plus faible que la première.</p></div><div class="tcard"><b class="h">Électronégativité et type de liaison</b><p>L\'<b>électronégativité</b> EN mesure la capacité d\'un atome à attirer les électrons de la liaison. On calcule <b>ΔEN = |EN<sub>A</sub> − EN<sub>B</sub>|</b> (seuils indicatifs 0,5 et 1,7) :</p><ul><li>ΔEN &lt; 0,5 : liaison <b>covalente apolaire</b> (électrons partagés équitablement) ;</li><li>0,5 ≤ ΔEN ≤ 1,7 : <b>covalente polaire</b> (δ⁺ sur l\'atome le moins électronégatif, δ⁻ sur l\'autre) ;</li><li>ΔEN &gt; 1,7 : <b>ionique</b> (transfert d\'électrons, ions Na⁺ Cl⁻ attirés par la force électrique) ;</li><li>entre métaux : liaison <b>métallique</b> (électrons délocalisés).</li></ul><p><i>Exemple :</i> H–Cl : 3,2 − 2,2 = 1,0 → covalente polaire ; Na–F : 4,0 − 0,9 = 3,1 → ionique. Piège : HF (ΔEN = 1,8) est une molécule covalente très polaire ; les seuils ne sont qu\'indicatifs.</p></div><div class="tcard"><b class="h">Liaisons covalentes et octet</b><p>Une liaison covalente met en commun un <b>doublet</b> : simple (2 e⁻ partagés), double (4), triple (6). Un atome vise l\'octet : N (5 e⁻ de valence) forme 3 liaisons, d\'où N≡N dans N₂ ; O en forme 2 ; C en forme 4.</p><p>Exceptions : <b>BF₃</b> (6 e⁻ autour de B : octet incomplet), et à partir de la période 3 l\'octet peut être dépassé : dans <b>SF₄</b> le soufre est entouré de 10 e⁻ (4 liaisons + 1 doublet non liant), dans PCl₅ de 10 e⁻ aussi.</p><p>Composés ioniques : la formule rend le solide neutre. Mg (2 e⁻ de valence) perd 2 e⁻ → Mg²⁺ ; Cl gagne 1 e⁻ → Cl⁻ ; donc 1 × (+2) + 2 × (−1) = 0 : <b>MgCl₂</b>.</p></div><div class="tcard"><b class="h">Bilan énergétique d\'une réaction</b><p>Casser une liaison coûte de l\'énergie, en former une en libère. Pour 1 mol de réaction : <b>ΔH ≈ Σ E(liaisons rompues) − Σ E(liaisons formées)</b>.</p><p><i>Exemple :</i> H₂ + Cl₂ → 2 HCl. Rompues : 436 + 243 = 679 kJ. Formées : 2 × 431 = 862 kJ. ΔH = 679 − 862 = <b>−183 kJ/mol</b> : exothermique. Pour 2,5 mol de H₂ : 2,5 × (−183) ≈ −458 kJ.</p><p><b>Conduction</b> : un solide ionique ne conduit pas (ions bloqués) mais fondu ou dissous il conduit (ions mobiles) ; un métal conduit à l\'état solide grâce à ses électrons délocalisés.</p></div>'
});

SFA.figs("c02", [
 /* 0 · trois liaisons */
 function (p) {
  var cols=[W*.17,W*.5,W*.83],D=[['H','Cl',2.2,3.2,1.0,'covalente polaire',1],['C','H',2.6,2.2,0.4,'apolaire',0],['Na','F',0.9,4.0,3.1,'ionique',2]];
  var cA=[BLUE,'#8a8f98',VIOLET],cB=[GREEN,BLUE,RED],y=H*.42,sp=26;
  D.forEach(function(d,i){var x=cols[i],xa=x-sp,xb=x+sp,k=k5_seg(p,0,.6);
   var s=d[6]===0?0:d[6]===1?.9*k:0;
   if(d[6]<2)k5_cloud(xa,xb,y,s,ORANGE,20);
   var shift=d[6]===2?k*18:0;
   k5_at(xa,y,15,i===1?'#8a8f98':i===0?BLUE:VIOLET,d[0],12);
   k5_at(xb+shift*0,y,15,i===0?GREEN:i===1?BLUE:RED,d[1],12);
   if(d[6]===2&&k>.3){ctx.globalAlpha=k;TB('+',xa,y-24,DRED,16);TB('−',xb,y-24,BLUE_D,16);ctx.globalAlpha=1;}
   TB(d[2].toFixed(1).replace('.',',')+'   '+d[3].toFixed(1).replace('.',','),x,y+42,GREY,13);
   if(p>0){ctx.globalAlpha=k;TB('ΔEN = '+d[4].toFixed(1).replace('.',','),x,y+66,DRED,15);TB(d[5],x,y+88,i===1?DGREEN:i===0?ORANGE:BLUE_D,13);ctx.globalAlpha=1;}
  });
  TB('électronégativités EN',W*.5,H*.1,BLUE_D,15);
 },
 /* 1 · N2 */
 function (p) {
  var xa=W*.33,xb=W*.67,y=H*.5,k=k5_seg(p,0,.7);
  TB('N',xa,y+9,INK,28);TB('N',xb,y+9,INK,28);
  /* avant : 5 e- par atome : 1 doublet + 3 célibataires */
  k5_lp(xa,y,PI,34,BLUE);k5_lp(xb,y,0,34,BLUE);
  /* électrons célibataires : se rapprochent et forment 3 liaisons */
  for(var i=0;i<3;i++){var yy=y-8+i*8;var xa2=xa+20+k*((W*.5)-(xa+20)-5),xb2=xb-20-k*((xb-20)-(W*.5)-5);
   if(k<.99){DOT(xa+22,yy,3.4,RED);DOT(xb-22,yy,3.4,ORANGE);}}
  if(p>0){ctx.globalAlpha=k;for(var j=0;j<3;j++){LN(xa+20,y-8+j*8,xb-20,y-8+j*8,DGREEN,2.6);}ctx.globalAlpha=1;}
  TB('5 e⁻ de valence chacun',W*.5,H*.14,BLUE_D,15);
  if(p>.6){ctx.globalAlpha=k5_seg(p,.6,1);TB('N≡N : 3 liaisons + 1 doublet libre',W*.5,H*.86,DGREEN,17);TB('octet : 8 e⁻ autour de chaque N',W*.5,H*.95,GREY,13);ctx.globalAlpha=1;}
 },
 /* 2 · hydracides */
 function (p) {
  var names=['H–F','H–Cl','H–Br','H–I'],EN=[4.0,3.2,3.0,2.7],dEN=[1.8,1.0,.8,.5],x0=W*.12,bw=W*.14,gap=W*.07,yb=H*.78,sc=H*.42/2.0;
  var k=k5_seg(p,0,.7);
  LN(x0-12,yb,W*.94,yb,AX,1.6);
  names.forEach(function(n,i){var x=x0+i*(bw+gap);
   if(p<=0){var hh=EN[i]*H*.12;k5_bar(x,yb-hh,bw,hh,'#e4ecf6',GREY);TB(EN[i].toFixed(1).replace('.',','),x+bw/2,yb-hh-8,GREY,14);}
   else{var h=dEN[i]*sc*k;k5_bar(x,yb-h,bw,h,RED+'cc',DRED);if(k>.6)TB(dEN[i].toFixed(1).replace('.',','),x+bw/2,yb-h-8,DRED,15);}
   TB(n,x+bw/2,yb+20,INK,15);});
  TB(p<=0?'EN de l\'halogène (H = 2,2)':'ΔEN = EN(X) − 2,2',W*.5,H*.1,p<=0?GREY:BLUE_D,15);
  if(p>.7){ctx.globalAlpha=k5_seg(p,.7,1);TB('polarité décroissante →',W*.5,H*.95,DGREEN,15);TB('δ⁺ sur H',W*.82,H*.28,DRED,14);ctx.globalAlpha=1;}
 },
 /* 3 · MgCl2 */
 function (p) {
  var k=k5_seg(p,0,.6),y=H*.5,xm=W*.5,xl=W*.15,xr=W*.85;
  var q=function(s){return s;};
  k5_at(xm,y,26,VIOLET,p>.55?'Mg²⁺':'Mg',p>.55?15:17);
  k5_at(xl,y,26,GREEN,p>.55?'Cl⁻':'Cl',p>.55?15:17);k5_at(xr,y,26,GREEN,p>.55?'Cl⁻':'Cl',p>.55?15:17);
  /* électrons de valence de Mg (2) → vers Cl */
  if(p<=0){DOT(xm-12,y-34,4,VIOLET);DOT(xm+12,y-34,4,VIOLET);k5_sg(xl,y,-PI*.5,38,GREEN);k5_sg(xr,y,-PI*.5,38,GREEN);}
  else{var e1=xm-12+(xl+30-(xm-12))*k,e2=xm+12+(xr-30-(xm+12))*k;DOT(e1,y-34+(Math.sin(k*PI))*-10,4,VIOLET);DOT(e2,y-34+(Math.sin(k*PI))*-10,4,VIOLET);}
  TB('2 e⁻ de valence',xm,y-58,VIOLET,13);TB('1 e⁻ manque',xl,y-58,DGREEN,13);TB('1 e⁻ manque',xr,y-58,DGREEN,13);
  if(p>.55){ctx.globalAlpha=k5_seg(p,.55,1);TB('+2',xm,y+52,DRED,16);TB('−1',xl,y+52,BLUE_D,16);TB('−1',xr,y+52,BLUE_D,16);
   TB('1 × (+2) + 2 × (−1) = 0',W*.5,H*.84,DGREEN,16);TB('MgCl₂',W*.5,H*.95,DGREEN,22);ctx.globalAlpha=1;}
  else TB('formule du chlorure de magnésium ?',W*.5,H*.88,GREY,15);
 },
 /* 4 · SF4 */
 function (p) {
  var cx=W*.5,cy=H*.5,r=70;
  var angs=[-PI*.5-.0,PI*.5,PI*.0+.0,PI];
  /* S au centre, 4 F : haut, bas, gauche, droite ; le doublet est en diagonale */
  var pos=[[0,-1],[0,1],[-1,0],[1,0]];
  pos.forEach(function(q){var x=cx+q[0]*r*1.0,y=cy+q[1]*r*.9;LN(cx+q[0]*18,cy+q[1]*18,x-q[0]*13,y-q[1]*13,INK,3);k5_at(x,y,15,GREEN,'F',14);});
  TB('S',cx,cy+9,INK,28);
  var k=k5_seg(p,0,.6);
  if(p>0){ctx.globalAlpha=k;var a=-PI*.25;k5_lp(cx,cy,a,34,RED,5);ctx.globalAlpha=1;
   ctx.strokeStyle=RED;ctx.setLineDash([4,3]);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx+Math.cos(a)*34,cy+Math.sin(a)*34,15,10,a,0,7);ctx.stroke();ctx.setLineDash([]);
   ctx.globalAlpha=k5_seg(p,.5,1);TB('1 doublet non liant',W*.84,H*.18,DRED,14);TB('4 × 2 + 2 = 10 e⁻ autour de S',W*.5,H*.95,DGREEN,16);TB('octet dépassé (période 3)',W*.5,H*.07,ORANGE,14);ctx.globalAlpha=1;}
  else{TB('S : 6 e⁻ de valence · 4 liaisons S–F',W*.5,H*.95,GREY,15);}
 },
 /* 5 · HF */
 function (p) {
  var x0=W*.08,x1=W*.92,y=H*.22,h=H*.14,wd=x1-x0;
  var g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#e6f1fb');g.addColorStop(.5,'#fbeed8');g.addColorStop(1,'#f9d4d3');
  ctx.fillStyle=g;ctx.fillRect(x0,y,wd,h);ctx.strokeStyle=GREY;ctx.lineWidth=1.2;ctx.strokeRect(x0,y,wd,h);
  var xs=function(v){return x0+v/4*wd;};
  LN(xs(.5),y,xs(.5),y+h,GREY,1.4,[4,3]);LN(xs(1.7),y,xs(1.7),y+h,GREY,1.4,[4,3]);
  TB('apolaire',(xs(0)+xs(.5))/2+6,y+h/2+5,BLUE_D,12);TB('polaire',(xs(.5)+xs(1.7))/2,y+h/2+5,ORANGE,13);TB('ionique',(xs(1.7)+xs(4))/2,y+h/2+5,DRED,13);
  TB('0,5',xs(.5),y-6,GREY,12);TB('1,7',xs(1.7),y-6,GREY,12);TB('ΔEN',x1,y-6,GREY,12,'right');
  A(xs(1.8),y+h+26,0,-22,INK,'',2.4);TB('HF : 1,8',xs(1.8),y+h+44,INK,15);
  var xa=W*.38,xb=W*.62,ym=H*.72;
  var k=k5_seg(p,0,.7);
  k5_cloud(xa,xb,ym,.9*k,ORANGE,22);
  k5_at(xa,ym,16,BLUE,'H',14);k5_at(xb,ym,18,GREEN,'F',14);
  if(p>0){ctx.globalAlpha=k;TB('δ⁺',xa,ym-30,DRED,16);TB('δ⁻',xb,ym-30,BLUE_D,16);A(xa,ym+36,60*k,0,DGREEN,'',2.4);
   TB('covalente très polaire',W*.5,H*.95,DGREEN,16);ctx.globalAlpha=1;}
  else TB('liaison ionique ou covalente ?',W*.5,H*.92,GREY,15);
 },
 /* 6 · énergie H2 + Cl2 */
 function (p) {
  var x0=W*.06,wd=W*.2,top=H*.1,bot=H*.9,E0=-183,E1=679;
  var yE=function(E){return bot-(E-E0)/(E1-E0)*(bot-top);};
  var lv=[[x0,0,'H₂ + Cl₂',INK],[x0+W*.34,679,'2 H + 2 Cl',ORANGE],[x0+W*.68,-183,'2 HCl',GREEN]];
  lv.forEach(function(l){LN(l[0],yE(l[1]),l[0]+wd,yE(l[1]),l[3],3.5);TB(l[2],l[0]+wd/2,yE(l[1])+(l[1]>0?-8:20),l[3]===INK?INK:dk(l[3]),14);});
  TB('énergie (kJ/mol)',W*.02,H*.06,GREY,12,'left');
    if(p<=0){TB('?',x0+W*.1+wd*.5+24,yE(340),GREY,26);TB('?',x0+W*.34+wd*.5+24,yE(250),GREY,26);}
  var a=k5_seg(p,0,.4),b=k5_seg(p,.4,.8);
  if(p>0){A(x0+wd*.5+W*.04,yE(0),0,(yE(679)-yE(0))*a,RED,'',3);ctx.globalAlpha=a;TB('+679 (436 + 243)',x0+wd*.5+W*.04+8,yE(340),DRED,13,'left');ctx.globalAlpha=1;
   if(b>0){A(x0+W*.34+wd*.5,yE(679),0,(yE(-183)-yE(679))*b,BLUE,'',3);ctx.globalAlpha=b;TB('−862 (2 × 431)',x0+W*.34+wd*.5+10,yE(300),BLUE_D,13,'left');ctx.globalAlpha=1;}
   var c=k5_seg(p,.8,1);if(c>0){ctx.globalAlpha=c;LN(x0+wd,yE(0),x0+W*.68+wd+10,yE(0),AX,1.2,[4,4]);A(x0+W*.68+wd+8,yE(0),0,(yE(-183)-yE(0))*c,DGREEN,'',3);TB('ΔH = −183',x0+W*.68+wd*.5,yE(-183)-30,DGREEN,15);TB('exothermique',x0+W*.68+wd*.5,yE(-183)-14,DGREEN,12);ctx.globalAlpha=1;}}
 },
 /* 7 · sel solide / fondu */
 function (p) {
  var t=Date.now()/300,k=k5_seg(p,0,.6);
  [[W*.25,'NaCl solide',false],[W*.75,'NaCl fondu',true]].forEach(function(b){var cx=b[0],mel=b[2];
   k5_rr(cx-W*.19,H*.2,W*.38,H*.42,'#f4f8fc',GREY,1.6);
   for(var i=0;i<4;i++)for(var j=0;j<3;j++){var pos=((i+j)%2===0);
     var x=cx-W*.135+i*W*.09,y=H*.28+j*H*.12;
     if(mel){x+=Math.sin(t*1.7+i*2+j*3)*7;y+=Math.cos(t*1.3+i*5+j)*6;}
     k5_at(x,y,12,pos?VIOLET:GREEN,pos?'+':'−',13);}
   TB(b[1],cx,H*.14,INK,15);
   var on=mel&&p>0;
   /* lampe */
   DOT(cx,H*.8,15,on?'#ffe27a':'#e9ebee');k5_ring(cx,H*.8,15,on?ORANGE:GREY,2);
   if(on){for(var r=0;r<8;r++){var a=r*PI/4;LN(cx+Math.cos(a)*20,H*.8+Math.sin(a)*20,cx+Math.cos(a)*28,H*.8+Math.sin(a)*28,ORANGE,2);}}
   LN(cx,H*.62,cx,H*.8-15,INK,1.6);});
  if(p>0){ctx.globalAlpha=k;TB('ions bloqués : pas de courant',W*.25,H*.95,DRED,13);TB('ions mobiles : courant',W*.75,H*.95,DGREEN,13);ctx.globalAlpha=1;}
  else TB('qui conduit ?',W*.5,H*.95,GREY,15);
 },
 /* 8 · CaF2 */
 function (p) {
  var k=k5_seg(p,0,.7),x1=W*.22,x2=W*.46,base=H*.78,sc=H*.14;
  k5_bar(x1,base-1.0*sc,W*.15,1.0*sc,'#e6f1fb',BLUE);TB('Ca',x1+W*.075,base+18,INK,15);TB('1,0',x1+W*.075,base-1.0*sc-8,BLUE_D,15);
  k5_bar(x2,base-4.0*sc,W*.15,4.0*sc,'#fcebeb',RED);TB('F',x2+W*.075,base+18,INK,15);TB('4,0',x2+W*.075,base-4.0*sc-8,DRED,15);
  LN(x1-8,base,x2+W*.15+8,base,AX,1.6);
  if(p>0){ctx.globalAlpha=k;var xb=x2+W*.15+14;LN(x1+W*.15,base-sc,xb,base-sc,GREY,1.2,[4,3]);LN(xb-4,base-sc,xb+6,base-sc,GREY,1.2);
   A(xb,base-sc,0,-3.0*sc*k,DGREEN,'',2.6);TB('ΔEN',xb+8,base-2.2*sc,DGREEN,16,'left');TB('= 3,0',xb+8,base-1.7*sc,DGREEN,16,'left');ctx.globalAlpha=1;}
  var xr=W*.8;
  k5_at(xr+8,H*.68,22,VIOLET,'Ca²⁺',12);k5_at(xr-38,H*.68,15,GREEN,'F⁻',12);k5_at(xr+54,H*.68,15,GREEN,'F⁻',12);
  if(p>0){ctx.globalAlpha=k;TB('CaF₂ : ionique',xr,H*.84,DGREEN,16);TB('F₂ : ΔEN = 0 → apolaire',xr,H*.95,GREY,13);ctx.globalAlpha=1;}
  else TB('type de liaison ?',xr,H*.86,GREY,15);
  TB('électronégativité',W*.3,H*.08,BLUE_D,15);
 },
 /* 9 · simple, double ou triple */
 function (p) {
  var x0=W*.14,x1=W*.94,yTop=H*.08,yBot=H*.8,r1=95,r2=260;
  var xf=function(r){return x0+(r-r1)/(r2-r1)*(x1-x0);},yf=function(E){return yTop+(300-E)/(300+900)*(yBot-yTop);};
  LN(x0,yf(0),x1,yf(0),AX,1.2,[4,4]);LN(x0,yTop,x0,yBot+4,AX,1.5);LN(x0,yBot,x1,yBot,AX,1.5);
  TB('E (kJ/mol)',x0+6,yTop+10,GREY,12,'left');TB('r (pm)',x1,yBot+16,GREY,12,'right');
  var cs=[[348,154,'C–C',GREY],[614,134,'C=C',GREEN],[839,120,'C≡C',VIOLET]];
  cs.forEach(function(c,i){var hl=p>0&&i===1;k5_curve(xf,yf,Math.max(r1,c[1]*.78),r2,c[0],c[1],hl?GREEN:'#c4c9d0',hl?3.6:1.8);
   if(p>0||i!==1){TB(c[2],xf(c[1]),yf(-c[0])+(i===1?22:20),hl?DGREEN:GREY,13);}});
  var hx=xf(134),hy=yf(-614);
  DOT(hx,hy,6,RED);LN(x0,hy,hx,hy,RED,1.2,[3,3]);TB('−614',x0-4,hy+4,DRED,13,'right');
  TB('134 pm',hx+34,yBot+16,DRED,13);
  if(p>0){var k=k5_seg(p,0,1);ctx.globalAlpha=k;TB('C=C',W*.72,H*.58,DGREEN,22);TB('2 × 348 = 696 > 614',W*.72,H*.68,INK,14);TB('0,25 mol → 154 kJ',W*.72,H*.78,DGREEN,14);ctx.globalAlpha=1;}
  else TB('quelle liaison ?',W*.72,H*.66,GREY,17);
 }
]);
