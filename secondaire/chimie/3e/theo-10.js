/* SFA · Chimie 3e · chapitre 10 : théorie animée et devantures */
(function(){
function sg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ga(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function g1(){ctx.globalAlpha=1;}
function rnd(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function F(fn){return function(p){ctx.save();var s=Math.min(W/460,H/280);ctx.translate((W-460*s)/2,(H-280*s)/2);ctx.scale(s,s);ctx.lineCap='round';fn(p||0);ctx.restore();};}
function glass(x,y,w,h,lvl,col){if(lvl>0){ctx.fillStyle=col||'#cfe6f8';ctx.fillRect(x+1.5,y+h*(1-lvl),w-3,h*lvl-1.5);}
 ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-4,y-4);ctx.lineTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.lineTo(x+w+4,y-4);ctx.stroke();}
function ball(x,y,r,col,lab,tc){DOT(x,y,r,col);ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();if(lab)TB(lab,x,y+r*.36,tc||'#fff',Math.round(Math.max(10,r*1.0)));}
function box(x,y,w,h,col,fill,r){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||AX;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,r||8);ctx.fill();ctx.stroke();}
function chk(x,y,c,s){s=s||9;ctx.strokeStyle=c||DGREEN;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*.3,y+s*.7);ctx.lineTo(x+s,y-s*.8);ctx.stroke();}
function scale(x,y,w,val,col){ctx.fillStyle='#e9ecef';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(x,y,w,26,6);ctx.fill();ctx.stroke();
 ctx.fillStyle='#10202a';ctx.fillRect(x+w/2-34,y+4,68,18);TB(val,x+w/2,y+18,col||'#7ee0a8',14);}
function H2(x,y,r){ball(x-r*.8,y,r*.7,'#8fa3b8');ball(x+r*.8,y,r*.7,'#8fa3b8');}
var CR='#e8806f',CB='#6fa6e0';
function phbar(x,y,w,h){for(var i=0;i<w;i++){ctx.fillStyle='hsl('+(i/w*270)+',78%,62%)';ctx.fillRect(x+i,y,1.5,h);}ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.strokeRect(x,y,w,h);
 for(var k=0;k<=14;k+=2){var xx=x+k/14*w;LN(xx,y+h,xx,y+h+5,INK,1.4);TB(String(k),xx,y+h+19,GREY,13);}}
function mark(x,y,c){ctx.fillStyle=c||INK;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-7,y-12);ctx.lineTo(x+7,y-12);ctx.closePath();ctx.fill();}
function tube(x,y,w,h,col){ctx.fillStyle=col;ctx.fillRect(x+1.5,y+h*.3,w-3,h*.7-w/2);ctx.beginPath();ctx.arc(x+w/2,y+h-w/2,w/2-1.5,0,7);ctx.fill();
 ctx.strokeStyle=INK;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h-w/2);ctx.arc(x+w/2,y+h-w/2,w/2,Math.PI,0,true);ctx.lineTo(x+w,y);ctx.stroke();}
function bbt(pH){var Y=[242,217,74],G=[111,190,110],B=[58,111,216],a,b,u;if(pH<=6){a=Y;b=Y;u=0;}else if(pH<6.8){a=Y;b=G;u=(pH-6)/.8;}else if(pH<7.6){a=G;b=B;u=(pH-6.8)/.8;}else{a=B;b=B;u=0;}
 return 'rgb('+Math.round(a[0]+(b[0]-a[0])*u)+','+Math.round(a[1]+(b[1]-a[1])*u)+','+Math.round(a[2]+(b[2]-a[2])*u)+')';}
function pf(v){return v.toFixed(1).replace('.',',');}
SFA.theo("c10", {
 icon: function () {
  TB('pH',W*.5,H*.4,BLUE_D,44);phbar(W*.16,H*.52,W*.68,H*.1);TB('acide · neutre · base',W*.5,H*.93,ORANGE,16);
 },
 anim: function (t) {
  var pH=7+6.6*Math.sin(t*.011),bx=W*.06,bw=W*.88,by=H*.1,bh=H*.1;
  phbar(bx,by,bw,bh);mark(bx+pH/14*bw,by+bh+2,INK);
  var gx=W*.06,gw=W*.42,gy=H*.46,gh=H*.34;
  glass(gx,gy,gw,gh,.8,'#eef5fc');
  var nH=Math.round(Math.max(0,Math.min(14,7-(pH-7)*6/7))),nO=14-nH,i;
  for(i=0;i<14;i++){var yy=gy+gh*.25+rnd(i+30)*gh*.65+Math.sin(t*.04+i)*3,xx=gx+10+rnd(i)*(gw-20)+Math.cos(t*.03+i*2)*3;
   if(i<nH){ball(xx,yy,7,CR,'',null);}else {ball(xx,yy,7,CB,'',null);}}
  // légende : H+ rouge, OH- bleu (positions des boules : les deux espèces sont mélangées)
  var cH=0,cO=0;
  TB('H⁺ : '+nH,gx+gw*.2,gy+gh+24,DRED,16);TB('OH⁻ : '+nO,gx+gw*.8,gy+gh+24,BLUE_D,16);
  tube(W*.64,H*.42,30,H*.42,bbt(pH));TB('BBT',W*.64+15,H*.42-8,INK,14);
  TB('pH = '+pf(pH),W*.8,H*.55,INK,24);
  var d=pH<6.5?'acide : H⁺ en excès':(pH>7.5?'basique : OH⁻ en excès':'neutre : H⁺ = OH⁻');
  TB(d,W*.8,H*.70,pH<6.5?DRED:(pH>7.5?BLUE_D:DGREEN),15);
  TB('schéma qualitatif · 1 unité de pH = concentration en H⁺ × 10',W*.5,H*.97,GREY,13);
 },
 th:
 '<div class="tcard"><b class="h">Acide, neutre, basique : le pH</b><p>Toute solution aqueuse contient des ions <b>H⁺</b> (acidité) et <b>OH⁻</b> (basicité). Une solution <b>acide</b> a un excès de H⁺ (pH &lt; 7), une solution <b>neutre</b> autant de H⁺ que de OH⁻ (pH = 7, eau pure à 25 °C), une solution <b>basique</b> un excès de OH⁻ (pH &gt; 7).</p><p>L\'échelle va de 0 à 14 et elle est <b>logarithmique</b> : une unité de pH en moins, c\'est 10 fois plus de H⁺ (pH 3 est 10 fois plus acide que pH 4). Repères : citron 2,2 ; vinaigre 2,9 ; lait 6,5 ; eau pure 7 ; savon 10 ; ammoniaque 11,5.</p></div>' +
 '<div class="tcard"><b class="h">Mesurer le pH : indicateurs colorés</b><p>Le <b>papier pH</b> et le <b>pH-mètre</b> donnent une valeur. Un <b>indicateur coloré</b> change de couleur dans une zone de virage : le <b>bleu de bromothymol</b> (BBT) est jaune si pH &lt; 6, vert vers 7, bleu si pH &gt; 7,6 ; la <b>phénolphtaléine</b> est incolore si pH &lt; 8,2 et rose si pH &gt; 10.</p><p>On combine les indices : BBT bleu + phénolphtaléine incolore → 7,6 &lt; pH &lt; 8,2 (légèrement basique) ; BBT bleu + phénolphtaléine rose → pH &gt; 10 (très basique).</p></div>' +
 '<div class="tcard"><b class="h">Neutralisation : acide + base → sel + eau</b><p>Les ions H⁺ de l\'acide et OH⁻ de la base forment de l\'eau : <code>H⁺ + OH⁻ → H₂O</code>. Les autres ions forment le <b>sel</b>. <code>HCl + NaOH → NaCl + H₂O</code> ; <code>H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O</code>. Quand acide et base sont dans les proportions exactes d\'un acide fort et d\'une base forte, le pH final est 7 (NaCl neutre). Avec un acide <b>faible</b> (vinaigre) neutralisé par la soude, le pH à l\'équivalence est supérieur à 7 (≈ 8 à 9).</p><p><b>Dosage :</b> à l\'équivalence n(H⁺) = n(OH⁻), avec n = c × V. Exemple : 20 mL de HCl à 0,10 mol/L contiennent 2,0 mmol de H⁺ ; il faut 20 mL de soude à 0,10 mol/L ou 10 mL à 0,20 mol/L (soit 0,080 g de NaOH, M = 40 g/mol).</p></div>' +
 '<div class="tcard"><b class="h">Acides sur métaux et calcaire ; sécurité</b><p><b>Acide + métal → sel + H₂</b> : Mg + 2 HCl → MgCl₂ + H₂ (le dihydrogène « pop » à la flamme) ; le cuivre ne réagit pas. <b>Acide + calcaire → sel + eau + CO₂</b> : CaCO₃ + 2 HNO₃ → Ca(NO₃)₂ + H₂O + CO₂ (pluies acides, détartrage).</p><p>Calcul type : 0,12 g de Mg = 0,12 ÷ 24 = 0,0050 mol → 0,0050 mol de H₂ → 0,0050 × 24 = 0,12 L = 120 mL.</p><p><b>Sécurité :</b> acides et bases concentrés sont corrosifs (lunettes, gants, blouse) ; on verse l\'acide dans l\'eau, jamais l\'inverse. Renversement : prévenir, aérer, neutraliser avec une base faible (bicarbonate), absorber, rincer. Jamais de soude concentrée sur de l\'acide : réaction violente.</p></div>'
});
SFA.figs("c10", [
 // 0 acide, neutre ou basique
 F(function(p){
  var x0=30,w=400,X=function(v){return x0+v/14*w;};phbar(x0,120,w,30);
  var I=[['citron 2,2',2.2,1],['vinaigre 2,9',2.9,-1],['lait 6,5',6.5,1],['eau pure 7',7,-1],['savon 10',10,1],['ammoniaque 11,5',11.5,-1]];
  I.forEach(function(q){var x=X(q[1]);if(q[2]>0){LN(x,100,x,120,INK,1.6);DOT(x,98,4,INK);TB(q[0],x,84,INK,14);}else{LN(x,174,x,194,INK,1.6);DOT(x,196,4,INK);TB(q[0],x,216,INK,14);}});
  if(p>0){ga(sg(p,0,.5));TB('acide (pH < 7)',X(3.5),250,DRED,16);TB('basique (pH > 7)',X(10.5),250,BLUE_D,16);TB('neutre',X(7),250,DGREEN,15);g1();}
  else TB('classe chaque substance',230,40,GREY,18);
 }),
 // 1 pH 9
 F(function(p){
  glass(60,60,200,140,.8,'#eef5fc');
  var i;for(i=0;i<2;i++)ball(90+i*70,120+i*20,7,CR,'',null);for(i=0;i<10;i++)ball(80+rnd(i)*160,100+rnd(i+30)*85,7,CB,'',null);
  box(300,70,130,60,INK,'#10202a',10);TB('pH = 9',365,110,'#7ee0a8',26);
  TB('H⁺',258,35,DRED,15);TB('OH⁻',324,35,BLUE_D,15);ball(240,30,6,CR,'',null);ball(300,30,6,CB,'',null);
  if(p>0){ga(sg(p,0,.5));box(40,222,380,50,DGREEN,'#e3f5ee',12);TB('plus de OH⁻ que de H⁺ : basique',230,254,DGREEN,18);g1();}
  else TB('que contient la solution ?',230,250,GREY,18);
 }),
 // 2 lire des indicateurs
 F(function(p){
  var R=[['#f2d94a','#f4f6f8','pH < 6 · acide'],['#3a6fd8','#f4f6f8','7,6 < pH < 8,2 · basique faible'],['#3a6fd8','#e86aa5','pH > 10 · très basique']];
  R.forEach(function(r,i){var y=12+i*88;box(8,y,444,80,AX,'#fff',10);
   tube(50,y+6,26,50,r[0]);tube(120,y+6,26,50,r[1]);TB('BBT',63,y+72,GREY,13);TB('phénolphtaléine',133,y+72,GREY,13);
   TB(String.fromCharCode(97+i)+'.',18,y+44,INK,16,'left');
   if(p>0){ga(sg(p,i*.2,i*.2+.4));TB(r[2],305,y+46,i==0?DRED:BLUE_D,15);g1();}else TB('pH ?',305,y+48,GREY,22);});
 }),
 // 3 écrire des neutralisations
 F(function(p){
  var E=[['HCl + NaOH → ? + H₂O','HCl + NaOH → NaCl + H₂O','chlorure de sodium'],['HNO₃ + KOH → ? + H₂O','HNO₃ + KOH → KNO₃ + H₂O','nitrate de potassium'],['H₂SO₄ + NaOH → ? + H₂O','H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O','sulfate de sodium']];
  E.forEach(function(e,i){var y=52+i*84,a=p>0?sg(p,i*.25,i*.25+.35):0;
   ga(1-a);TB(e[0],230,y,INK,20);g1();ga(a);TB(e[1],230,y,DGREEN,20);TB('sel : '+e[2],230,y+30,DRED,15);g1();});
  TB('acide + base → sel + eau',230,272,GREY,14);
 }),
 // 4 HCl + NaOH en proportions exactes
 F(function(p){
  glass(20,80,70,90,.7,'#eef5fc');ball(40,120,7,CR,'',null);ball(70,140,7,CR,'',null);ball(50,150,7,CB,'',null);TB('HCl',55,196,INK,14);TB('H⁺ Cl⁻',55,216,GREY,13);
  TB('+',103,130,GREY,24);
  glass(120,80,70,90,.7,'#eef5fc');ball(140,125,7,CB,'',null);ball(165,145,7,CB,'',null);TB('NaOH',155,196,INK,14);TB('Na⁺ OH⁻',155,216,GREY,13);
  A(200,125,40,0,GREY,'',3);
  glass(250,70,100,100,.8,'#eef5fc');
  if(p>0){ga(sg(p,0,.5));[[275,120],[300,140],[325,115],[285,150],[315,100]].forEach(function(q,i){ball(q[0],q[1],7,i%2?CB:'#9fb0c0','',null);});g1();TB('NaCl',300,196,INK,14);}
  else TB('?',300,135,GREY,34);
  box(366,90,86,60,INK,'#10202a',10);TB(p>0?'pH = 7,0':'pH = ?',409,128,p>0?'#7ee0a8':GREY,20);
  if(p>0){ga(sg(p,.4,1));box(60,236,340,36,DGREEN,'#e3f5ee',10);TB('NaCl : ni H⁺ ni OH⁻ en excès → neutre',230,260,DGREEN,15);g1();}
 }),
 // 5 magnésium et acide
 F(function(p){
  tube(40,40,46,170,'#d9ecfa');LN(54,90,72,190,'#a9b2bb',5);TB('HCl en excès',63,238,INK,14);
  for(var i=0;i<6;i++){var yy=170-((i*29+p*30)%120);ga(.8);ball(56+rnd(i)*20,yy,4+rnd(i+2)*3,'#c5d0da','',null);g1();}
  ctx.lineWidth=3;LN(86,50,150,50,INK,3);LN(150,50,150,232,INK,3);LN(150,232,290,232,INK,3);LN(290,232,290,200,INK,3);
  ctx.fillStyle='#d9ecfa';ctx.fillRect(176,206,230,38);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(176,206,230,38);
  var gh=p>0?96:0;ctx.fillStyle='#d9ecfa';ctx.fillRect(272,70,36,150);ctx.fillStyle='#fff';ctx.fillRect(272,70,36,gh);
  ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(272,70,36,150);for(var k=0;k<6;k++)LN(272,70+k*25,280,70+k*25,INK,1.2);
  if(p>0)TB('H₂',290,70+gh/2+5,GREY,14);
  TB(p>0?'H₂ : 120 mL':'H₂ : ? mL',290,266,p>0?DRED:GREY,15);
  if(p>0){ga(sg(p,0,.5));TB('Mg + 2 HCl → MgCl₂ + H₂',250,24,DGREEN,14);g1();ga(sg(p,.3,1));box(330,66,122,96,DGREEN,'#e3f5ee',10);TB('n = 0,0050 mol',391,94,INK,14);TB('V = 0,0050 × 24',391,120,INK,14);TB('= 0,12 L',391,148,DGREEN,16);g1();
   ga(sg(p,.6,1));TB('Cu : rien',391,196,DRED,14);g1();}
  else TB('quel volume de gaz ?',391,120,GREY,15);
 }),
 // 6 renversement
 F(function(p){
  var S=[['1','Prévenir le professeur'],['2','Aérer · lunettes · gants'],['3','Bicarbonate par-dessus'],['4','Absorber puis rincer']];
  S.forEach(function(s,i){var x=8+(i%2)*228,y=12+Math.floor(i/2)*92,on=p>0?sg(p,i*.2,i*.2+.3):0;
   box(x,y,216,80,on>.5?DGREEN:AX,on>.5?'#e3f5ee':'#fff',12);DOT(x+26,y+40,16,on>.5?DGREEN:GREY);TB(s[0],x+26,y+47,'#fff',18);
   TB(s[1],x+50,y+46,INK,13,'left');if(on>.5){ga(on);chk(x+196,y+14,DGREEN,8);g1();}});
  if(p>0){ga(sg(p,.7,1));box(8,206,444,56,DRED,'#fcebeb',12);TB('✗ soude concentrée : réaction violente',230,240,DRED,17);g1();}
  else TB('HCl concentré renversé : que faire ?',230,238,GREY,17);
 }),
 // 7 vinaigre neutralisé
 F(function(p){
  var X=function(v){return 60+v*190;},Y=function(h){return 245-h*15.4;};
  LN(60,245,440,245,AX,1.6);LN(60,245,60,20,AX,1.6);TB('V(NaOH) ajouté',440,270,GREY,13,'right');TB('pH',48,18,GREY,13,'right');
  [0,7,14].forEach(function(h){LN(55,Y(h),60,Y(h),GREY,1);TB(String(h),50,Y(h)+4,GREY,12,'right');});
  LN(60,Y(7),440,Y(7),GREY,1,[4,4]);
  var f=function(v){return 2.9+10.4/(1+Math.exp(-(v-1)*7+(-.236)));};
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();for(var v=0;v<=2;v+=.02){var xx=X(v),yy=Y(f(v));v?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  TB('acide éthanoïque',360,Y(2.9)-24,BLUE_D,14);
  if(p>0){ga(sg(p,0,.5));LN(X(1),245,X(1),30,AX,1.4,[4,4]);TB('équivalence',X(1),262,GREY,13);DOT(X(1),Y(f(1)),7,RED);TB('pH ≈ 8 à 9 (> 7)',X(1)+12,Y(f(1))+22,DRED,15,'left');g1();
   ga(sg(p,.5,1));DOT(X(1),Y(7),5,GREY);TB('acide fort : 7',X(1)+12,Y(7)+20,GREY,13,'left');g1();}
  else TB('pH à l\'équivalence ?',330,195,GREY,18);
 }),
 // 8 combien de soude
 F(function(p){
  var bu=function(x,lab1,lab2,vol){ctx.fillStyle='#eef5fc';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.fillRect(x,18,20,112);ctx.strokeRect(x,18,20,112);LN(x+10,130,x+10,146,INK,3);
   TB(lab1,x+(x<200?30:-10),44,INK,13,x<200?'left':'right');TB(lab2,x+(x<200?30:-10),70,p>0?DRED:GREY,18,x<200?'left':'right');};
  bu(40,'NaOH 0,10 mol/L',p>0?'20 mL':'? mL');bu(400,'NaOH 0,20 mol/L',p>0?'10 mL':'? mL');
  ctx.fillStyle='#d9ecfa';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(215,142);ctx.lineTo(245,142);ctx.lineTo(282,210);ctx.lineTo(178,210);ctx.closePath();ctx.fill();ctx.stroke();
  for(var i=0;i<6;i++)ball(200+rnd(i)*50,185+rnd(i+9)*16,5,CR,'',null);TB('HCl 20 mL · 0,10 mol/L',230,232,INK,14);
  A(70,146,100,40,GREY,'',2);A(410,146,-100,40,GREY,'',2);
  if(p>0){ga(sg(p,0,.6));box(20,244,420,32,DGREEN,'#e3f5ee',8);TB('n(H⁺) = 2,0 mmol → 0,0020 × 40 = 0,080 g de NaOH',230,266,DGREEN,14);g1();}
  else TB('n(H⁺) = ?',230,262,GREY,16);
 }),
 // 9 pluies acides
 F(function(p){
  ctx.fillStyle='#b9c0c7';[[40,34,30],[78,24,34],[118,36,30],[70,44,34]].forEach(function(c){ctx.beginPath();ctx.arc(c[0],c[1],c[2],0,7);ctx.fill();});
  for(var i=0;i<8;i++){var yy=84+((i*23+p*30)%110);TB('H⁺',30+i*14,yy,BLUE_D,13);}
  ctx.fillStyle='#e3ddd0';ctx.strokeStyle=GREY;ctx.fillRect(50,150,70,90);ctx.strokeRect(50,150,70,90);ctx.fillRect(42,240,86,12);TB('CaCO₃',85,200,INK,14);
  if(p>0){ga(sg(p,0,.4));TB('CaCO₃ + 2 HNO₃ → Ca(NO₃)₂ + H₂O + CO₂',300,36,DGREEN,13);g1();ga(sg(p,.3,.7));box(168,52,284,100,DGREEN,'#e3f5ee',10);
   TB('0,10 mol HNO₃ → 0,050 mol CaCO₃',310,80,INK,14);TB('m = 0,050 × 100 = 5,0 g',310,106,INK,14);TB('V(CO₂) = 0,050 × 24 = 1,2 L',310,132,DGREEN,15);g1();
   ga(sg(p,.6,1));box(168,166,284,88,DRED,'#fcebeb',10);TB('pluie 5,6 → pluie acide 4,5',310,194,INK,14);TB('écart de 1,1 unité : × 13',310,220,DRED,14);TB('plus de H⁺ : la pluie acide',310,244,DRED,14);g1();}
  else {TB('équation ?',310,60,GREY,18);TB('quantité de calcaire attaquée ?',310,150,GREY,15);}
 }),
 // 10 détartrer une bouilloire
 F(function(p){
  ctx.fillStyle='#e6e9ec';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(40,70);ctx.lineTo(150,70);ctx.lineTo(160,200);ctx.lineTo(30,200);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(40,90);ctx.lineTo(10,60);ctx.lineTo(16,52);ctx.lineTo(48,80);ctx.stroke();ctx.beginPath();ctx.arc(160,120,34,-1.1,1.1);ctx.stroke();
  ctx.fillStyle='#f8f8f4';ctx.fillRect(33,184,124,14);for(var i=0;i<8;i++){ctx.fillRect(36+i*15,178+(i%3)*2,12,8);}TB('calcaire 5,0 g',95,236,INK,14);
  var S=[['5,0 g ÷ 100 = 0,050 mol'],['acide : 2 × 0,050 = 0,10 mol'],['× 60 g/mol = 6,0 g d\'acide pur'],['6,0 ÷ 0,05 = 120 g de vinaigre'],['CO₂ : 0,050 × 24 = 1,2 L']];
  S.forEach(function(s,i){var y=40+i*42;if(p>0){ga(sg(p,i*.17,i*.17+.3));box(215,y-18,236,34,DGREEN,'#e3f5ee',8);TB(s[0],333,y+5,INK,14);g1();}else{box(215,y-18,236,34,AX,'#fff',8);TB('?',333,y+6,GREY,18);}});
  TB('CaCO₃ + 2 CH₃COOH → Ca(CH₃COO)₂ + H₂O + CO₂',230,272,GREY,13);
 })
]);
})();
