/* SFA · Chimie 3e · chapitre 09 : théorie animée et devantures */
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
var CR='#e8806f',CB='#6fa6e0',CHO='#d9534f',CHH='#7aa7d9';
function ib(x,y,r,s,q){DOT(x,y,r,q>0?CR:CB);ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(s,x,y+r*.36,'#fff',Math.round(Math.max(11,r*(s.length>2?.72:1))));TB((Math.abs(q)>1?Math.abs(q):'')+(q>0?'+':'−'),x+r*.95,y-r*.6,q>0?DRED:BLUE_D,Math.max(13,Math.round(r*.8)));}
function lamp(x,y,r,on){if(on>0){ga(.5*on);DOT(x,y,r*1.9,'#ffe27a');g1();}ctx.fillStyle=on>0?'rgba(255,214,60,'+(.35+.65*on)+')':'#eceff2';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(x-r*.5,y+r*.5);ctx.lineTo(x-r*.2,y-r*.1);ctx.lineTo(x+r*.2,y+r*.4);ctx.lineTo(x+r*.5,y-r*.5);ctx.stroke();}
function wm(x,y,a,s){ s=s||1;ctx.strokeStyle=GREY;ctx.lineWidth=1;var h1=a-.92,h2=a+.92;
 var x1=x+Math.cos(h1)*8*s,y1=y+Math.sin(h1)*8*s,x2=x+Math.cos(h2)*8*s,y2=y+Math.sin(h2)*8*s;LN(x,y,x1,y1,GREY,1.2);LN(x,y,x2,y2,GREY,1.2);
 DOT(x1,y1,3*s,CHH);DOT(x2,y2,3*s,CHH);DOT(x,y,5*s,CHO);}
function hyd(x,y,r,s,q,n,rad,rot){for(var k=0;k<n;k++){var a=rot+k*6.2832/n,wx=x+Math.cos(a)*rad,wy=y+Math.sin(a)*rad;wm(wx,wy,q>0?a:a+3.1416,1);}ib(x,y,r,s,q);}
function elec(x,y,h,sg_){ctx.fillStyle='#8a9096';ctx.fillRect(x-3,y,6,h);TB(sg_,x,y-6,sg_=='+'?DRED:BLUE_D,16);}
function ionsIn(x,y,w,h,n,seed,sh,rr){for(var i=0;i<n;i++){var c=i%2==0,px=x+8+rnd(i+seed)*(w-16)+(c?sh:-sh),py=y+8+rnd(i+seed+40)*(h-16);px=Math.max(x+6,Math.min(x+w-6,px));ball(px,py,rr||6,c?CR:CB,'',null);}}
function inLegend(){}
SFA.theo("c09", {
 icon: function () {
  TB('NaCl → Na⁺ + Cl⁻',W*.5,H*.42,BLUE_D,30);TB('ions libres = courant',W*.5,H*.66,ORANGE,19);
 },
 anim: function (t) {
  var u=(t%620)/620,prog=Math.min(1,u/.6),n=Math.round(prog*28);if(u>.93)n=Math.round(28*(1-(u-.93)/.07));
  var bx=W*.27,bw=W*.46,by=H*.34,bh=H*.52,x1=bx+bw*.12,x2=bx+bw*.88;
  glass(bx,by,bw,bh,.8,'#e3f0fb');
  elec(x1,by-H*.14,bh*.85+H*.14,'+');elec(x2,by-H*.14,bh*.85+H*.14,'−');
  LN(x1,by-H*.14,x1,H*.1,INK,2);LN(x2,by-H*.14,x2,H*.1,INK,2);LN(x1,H*.1,W*.5-H*.09,H*.1,INK,2);LN(x2,H*.1,W*.5+H*.09,H*.1,INK,2);
  lamp(W*.5,H*.1,Math.min(H*.065,18),n/28);
  var span=(x2-x1)-16,i;
  var cs_=Math.max(0,1-prog)*Math.min(bw*.22,60);
  for(i=0;i<6;i++)for(var j=0;j<3;j++){if((i+j)%3<3&&i*3+j<Math.round((1-prog)*18)){ctx.fillStyle='#fbfbfb';ctx.strokeStyle=GREY;ctx.fillRect(bx+bw/2-18+i*7,by+bh-14-j*7,6,6);ctx.strokeRect(bx+bw/2-18+i*7,by+bh-14-j*7,6,6);}}
  for(i=0;i<n;i++){var c=i%2==0,off=rnd(i+3)*span,xx=c?x1+8+((off+t*.4)%span):x2-8-((off+t*.4)%span),yy=by+bh*.15+rnd(i+60)*bh*.6+Math.sin(t*.05+i)*3;
   ball(xx,yy,6.5,c?CR:CB,'',null);}
  TB('Na⁺ vers −',W*.75,H*.55,DRED,15,'left');TB('Cl⁻ vers +',W*.25,H*.66,BLUE_D,15,'right');
  TB('ions libres : '+n,W*.04,H*.26,INK,17,'left');TB('σ ≈ '+(n/28*8).toFixed(1).replace('.',',')+' mS/cm',W*.96,H*.26,DGREEN,17,'right');
  TB('le sel se dissout : plus d\'ions, plus de courant',W*.5,H*.96,GREY,15);
 },
 th:
 '<div class="tcard"><b class="h">Qui transporte le courant ?</b><p>Dans un fil métallique, ce sont les <b>électrons</b> libres. Dans une solution, ce sont les <b>ions</b> mobiles : les cations (+) vont vers l\'électrode négative, les anions (−) vers l\'électrode positive. Pas d\'ions libres, pas de courant : l\'eau distillée et l\'eau sucrée (molécules neutres) ne conduisent pas, l\'eau salée conduit.</p></div>' +
 '<div class="tcard"><b class="h">Dissociation d\'un composé ionique dans l\'eau</b><p>Le cristal ionique est formé d\'ions serrés par attraction électrique. Dans l\'eau, les molécules d\'eau (polaires : O légèrement − et H légèrement +) s\'orientent : l\'O vers les cations, les H vers les anions. Elles arrachent les ions un à un et les entourent (<b>hydratation</b>). Les ions sont alors libres.</p><p>Équations (atomes et charges se conservent) : <code>NaCl → Na⁺ + Cl⁻</code> ; <code>CaCl₂ → Ca²⁺ + 2 Cl⁻</code> (3 ions) ; <code>Al₂(SO₄)₃ → 2 Al³⁺ + 3 SO₄²⁻</code> (5 ions).</p></div>' +
 '<div class="tcard"><b class="h">Électrolytes et non-électrolytes</b><p>Un <b>électrolyte</b> donne des ions en solution (sels, bases fortes comme NaOH, acides) : la solution conduit. Un <b>non-électrolyte</b> reste en molécules neutres (sucre, éthanol) : pas de conduction. L\'eau pure est faite de molécules H₂O neutres et ne contient presque pas d\'ions : elle conduit très mal. L\'eau du robinet conduit un peu : elle contient des ions dissous (Ca²⁺, Mg²⁺, HCO₃⁻, Cl⁻…).</p></div>' +
 '<div class="tcard"><b class="h">Conductibilité et concentration</b><p>La conductibilité σ (en mS/cm, mesurée au conductimètre) augmente avec le <b>nombre d\'ions</b> par litre : pour une solution diluée, σ est <b>proportionnelle</b> à la concentration (σ = k × ρ). On trace une <b>courbe d\'étalonnage</b> σ en fonction de ρ avec des solutions connues, puis on lit la concentration d\'un échantillon.</p><p>Exemples : diluer 50 mL à 100 mL divise σ par 2 (4 → 2 mS/cm). Eau de mer 50 mS/cm → 0,5 mS/cm : dilution × 100, soit 5 mL complétés à 500 mL. À même concentration massique, un composé qui libère plus d\'ions par gramme conduit mieux (NaCl, 0,171 mol d\'ions/L, conduit mieux que KNO₃, 0,099 mol d\'ions/L).</p></div>'
});
SFA.figs("c09", [
 // 0 pourquoi l'eau salée conduit
 F(function(p){
  var bx=120,bw=220,by=100,bh=130;glass(bx,by,bw,bh,.75,'#e3f0fb');elec(bx+30,by-40,bh*.9+40,'+');elec(bx+bw-30,by-40,bh*.9+40,'−');
  LN(bx+30,by-40,bx+30,28,INK,2);LN(bx+bw-30,by-40,bx+bw-30,28,INK,2);LN(bx+30,28,200,28,INK,2);LN(bx+bw-30,28,260,28,INK,2);lamp(230,28,18,p>0?sg(p,0,.5):0);
  for(var i=0;i<14;i++){var c=i%2==0;ball(bx+44+rnd(i)*(bw-88)+(c?p*16:-p*16),by+30+rnd(i+30)*(bh-60),6.5,c?CR:CB,'',null);}
  if(p>0){ga(sg(p,.3,1));TB('Na⁺ →',420,150,DRED,15,'right');TB('← Cl⁻',40,150,BLUE_D,15,'left');TB('ions libres mobiles = courant',230,262,DGREEN,16);g1();}
  else TB('lampe allumée ? pourquoi ?',230,262,GREY,16);
 }),
 // 1 équations de dissociation
 F(function(p){
  var Q=[['NaCl','Na⁺ + Cl⁻',[['Na',1],['Cl',-1]]],['KNO₃','K⁺ + NO₃⁻',[['K',1],['NO₃',-1]]],['CaCl₂','Ca²⁺ + 2 Cl⁻',[['Ca',2],['Cl',-1],['Cl',-1]]]];
  Q.forEach(function(q,i){var y=62+i*88;TB(q[0],60,y+8,INK,24);A(105,y,40,0,GREY,'',2.4);
   if(p>0){ga(sg(p,i*.25,i*.25+.35));q[2].forEach(function(b,j){ib(200+j*58,y,b[0]=='NO₃'?19:17,b[0],b[1]);});TB(q[1],392,y+6,DGREEN,16);g1();}
   else TB('?',250,y+8,GREY,26);});
 }),
 // 2 conduit ou pas
 F(function(p){
  var N=[['sucre',0,'non',0],['sel',12,'oui',1],['distillée',0,'non',0],['robinet',3,'un peu',.3],['soude',20,'très bien',1]];
  N.forEach(function(n,i){var x=8+i*90;glass(x+6,110,66,100,.7,'#e3f0fb');
   if(i==0)for(var k=0;k<9;k++){ctx.strokeStyle=GREY;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x+16+rnd(k)*46,140+rnd(k+9)*58,4,0,7);ctx.stroke();}
   else ionsIn(x+6,130,66,80,n[1],i*7,p*6,4.5);
   TB(n[0],x+39,232,INK,14);
   lamp(x+39,66,15,p>0?n[3]*sg(p,i*.1,i*.1+.4):0);
   if(p>0){ga(sg(p,i*.1+.3,i*.1+.7));TB(n[2],x+39,264,n[3]>.5?DGREEN:DRED,14);g1();}else TB('?',x+39,264,GREY,16);});
 }),
 // 3 combien d'ions
 F(function(p){
  var Q=[['MgCl₂','Mg²⁺ + 2 Cl⁻',[['Mg',2],['Cl',-1],['Cl',-1]],3],['Na₂SO₄','2 Na⁺ + SO₄²⁻',[['Na',1],['Na',1],['SO₄',-2]],3],['Al₂(SO₄)₃','2 Al³⁺ + 3 SO₄²⁻',[['Al',3],['Al',3],['SO₄',-2],['SO₄',-2],['SO₄',-2]],5]];
  Q.forEach(function(q,i){var y=44+i*86;TB(q[0],14,y+26,INK,19,'left');
   if(p>0){ga(sg(p,i*.25,i*.25+.35));TB(q[1],140,y-14,DGREEN,14,'left');q[2].forEach(function(b,j){ib(158+j*52,y+18,b[0]=='SO₄'?17:14,b[0],b[1]);});box(380,y-2,66,46,DRED,'#fcebeb',10);TB(q[3]+' ions',413,y+28,DRED,15);g1();}
   else TB('? ions',300,y+30,GREY,20);});
 }),
 // 4 diluer et conductibilité
 F(function(p){
  glass(40,90,90,110,.8,'#e3f0fb');ionsIn(40,100,90,100,16,3,0,5.5);TB('4 mS/cm',85,226,BLUE_D,16);TB('50 mL',85,250,INK,14);
  A(150,120,60,0,GREY,'',3);TB('+ eau',180,104,BLUE_D,14);
  glass(250,70,130,130,.85,'#eef5fc');ionsIn(250,90,130,110,16,3,0,5.5);TB('100 mL',315,226,INK,14);
  if(p>0){ga(sg(p,0,.6));box(120,14,220,36,DGREEN,'#e3f5ee',10);TB('4 × 50 ÷ 100 = 2 mS/cm',230,38,DGREEN,15);g1();TB('2 mS/cm',315,250,DRED,18);}
  else TB('? mS/cm',315,250,GREY,18);
 }),
 // 5 courbe d'étalonnage
 F(function(p){
  var X=function(c){return 60+c*42;},Y=function(s){return 240-s*13;};
  LN(60,240,440,240,AX,1.6);LN(60,240,60,22,AX,1.6);TB('ρ (g/L)',440,276,GREY,13,'right');TB('σ (mS/cm)',66,20,GREY,13,'left');
  for(var c=0;c<=8;c+=2){LN(X(c),240,X(c),245,GREY,1);TB(String(c),X(c),258,GREY,12);}
  [0,5,10,15].forEach(function(s){LN(55,Y(s),60,Y(s),GREY,1);TB(String(s),52,Y(s)+4,GREY,12,'right');});
  var P=[[0,0],[2,3.9],[4,7.6],[6,11],[8,14.3]];ctx.strokeStyle=BLUE;ctx.lineWidth=2.6;ctx.beginPath();P.forEach(function(q,i){i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1]));});ctx.stroke();
  P.forEach(function(q){DOT(X(q[0]),Y(q[1]),5,BLUE_D);});
  TB('σ ÷ ρ ≈ 1,8 à 1,95 : presque constant',80,40,INK,14,'left');
  if(p>0){ga(sg(p,0,.4));LN(60,Y(9.3),X(5),Y(9.3),RED,2,[4,3]);TB('9,3',52,Y(9.3)-6,DRED,14,'right');g1();
   ga(sg(p,.4,.8));LN(X(5),Y(9.3),X(5),240,RED,2,[4,3]);DOT(X(5),Y(9.3),6,RED);g1();
   ga(sg(p,.6,1));box(300,150,146,74,DRED,'#fcebeb',10);TB('ρ ≈ 5,0 g/L',373,178,DRED,18);TB('250 mL → 1,25 g',373,206,INK,14);g1();}
  else TB('échantillon : 9,3 mS/cm',300,205,GREY,14);
 }),
 // 6 eau du robinet
 F(function(p){
  ctx.fillStyle='#8a9096';ctx.fillRect(70,20,110,20);ctx.fillRect(150,40,24,28);
  ctx.fillStyle='#bfe0f7';ctx.fillRect(158,68,8,48);
  glass(100,116,130,120,.7,'#e3f0fb');
  var I=[['Ca',2,CR],['Mg',2,CR],['HCO₃',-1,CB],['Cl',-1,CB]];
  if(p>0){ga(sg(p,0,.5));[[135,170,0],[190,160,1],[160,206,2],[205,208,3]].forEach(function(q){var b=I[q[2]];ib(q[0],q[1],q[2]==2?21:14,b[0],b[1]);});g1();
   ga(sg(p,.4,1));lamp(350,70,16,.3);TB('conduit un peu',350,120,DGREEN,15);TB('quelques ions dissous',350,150,INK,14);TB('Ca²⁺ Mg²⁺ HCO₃⁻ Cl⁻',350,176,GREY,14);g1();}
  else {TB('eau du robinet',350,100,INK,16);TB('conduit légèrement',350,128,GREY,15);TB('pourquoi ?',350,170,GREY,22);}
 }),
 // 7 raconter la dissolution
 F(function(p){
  var T=['1 contact','2 attraction','3 dissociation','4 ions hydratés'];
  for(var i=0;i<4;i++){var x=4+i*115,cx=x+54,cy=120,on=i==0?1:(p>0?sg(p,i*.2-.2,i*.2+.15):0);
   box(x,34,108,170,on>.5?BLUE_D:AX,'#fff',10);TB(T[i],cx,22,on>.5?BLUE_D:GREY,13);
   if(on<.5){TB('?',cx,130,GREY,30);continue;}
   ga(on);
   if(i==0){ib(cx-12,cy-12,12,'Na',1);ib(cx+12,cy-12,12,'Cl',-1);ib(cx-12,cy+12,12,'Cl',-1);ib(cx+12,cy+12,12,'Na',1);[[-40,-38,2],[44,-40,5],[-46,44,1],[46,46,4],[0,-52,3],[2,56,6]].forEach(function(q){wm(cx+q[0],cy+q[1],q[2],1);});}
   if(i==1){ib(cx-12,cy,12,'Na',1);ib(cx+12,cy,12,'Cl',-1);wm(cx-12,cy-34,-1.57,1.2);wm(cx+12,cy-34,1.57,1.2);wm(cx-34,cy+8,3.14,1.1);wm(cx+36,cy+8,0,1.1);}
   if(i==2){ib(cx-24,cy,12,'Na',1);ib(cx+24,cy,12,'Cl',-1);wm(cx-24,cy-32,-1.57,1.2);wm(cx-24,cy+32,1.57,1.2);wm(cx+24,cy-32,1.57,1.2);wm(cx+24,cy+32,-1.57,1.2);}
   if(i==3){hyd(cx-22,cy,11,'Na',1,3,21,.5);hyd(cx+24,cy+2,11,'Cl',-1,3,21,.2);}
   g1();}
  if(p>0){ga(sg(p,.7,1));TB('NaCl → Na⁺ + Cl⁻',230,246,DGREEN,20);TB('O vers Na⁺ · H vers Cl⁻',230,270,INK,14);g1();}
  else TB('que se passe-t-il à l\'échelle des particules ?',230,250,GREY,15);
 }),
 // 8 l'eau pure conduit-elle ?
 F(function(p){
  glass(30,100,150,110,.75,'#eef5fc');for(var i=0;i<12;i++)wm(48+rnd(i)*114,128+rnd(i+20)*70,rnd(i+5)*6.28,1.1);
  TB('eau pure : H₂O neutres',105,234,INK,13);
  glass(280,100,150,110,.75,'#e3f0fb');ionsIn(280,112,150,98,16,9,0,6);TB('eau salée : ions',355,234,INK,14);
  lamp(105,60,17,0);lamp(355,60,17,p>0?1:0);
  if(p>0){ga(sg(p,0,.5));TB('presque aucun ion',105,34,DGREEN,13);TB('ions libres',355,28,DGREEN,13);g1();
   ga(sg(p,.5,1));box(40,246,380,28,DGREEN,'#e3f5ee',8);TB('H₂O est neutre : l\'eau pure conduit très mal',230,266,DGREEN,14);g1();}
  else TB('« H₂O contient H⁺ et O²⁻ » ?',230,266,GREY,15);
 }),
 // 9 dessaler
 F(function(p){
  glass(30,80,80,110,.9,'#c9e2f5');ionsIn(30,90,80,100,16,2,0,5);TB('eau de mer',70,214,INK,14);TB('50 mS/cm · 35 g/L',70,236,BLUE_D,13);
  A(120,120,60,0,GREY,'',3);TB('5 mL',150,106,DRED,15);
  glass(250,50,150,140,.9,'#eef5fc');if(true)ionsIn(250,70,150,120,2,2,0,5);TB('500 mL',325,214,INK,14);TB('0,5 mS/cm',325,236,DRED,16);
  if(p>0){ga(sg(p,0,.5));TB('× 100',150,152,DGREEN,20);g1();ga(sg(p,.4,1));box(20,248,420,28,DGREEN,'#e3f5ee',8);TB('0,35 g/L · 0,175 g · 100 fois moins conducteur',230,268,DGREEN,14);g1();}
  else TB('facteur ?',150,152,GREY,15);
 }),
 // 10 NaCl contre KNO3
 F(function(p){
  TB('n(ions) dans 1 L (mol)',110,22,GREY,14);TB('σ (mS/cm)',340,22,GREY,14);
  var base=212,kN=120/.171,kS=120/9.3;
  ctx.fillStyle=BLUE;ctx.fillRect(50,base-.171*kN,50,.171*kN);ctx.fillStyle=ORANGE;ctx.fillRect(120,base-.099*kN,50,.099*kN);
  TB('0,171',75,base-.171*kN-6,INK,14);TB('0,099',145,base-.099*kN-6,INK,14);
  ctx.fillStyle=BLUE;ctx.fillRect(280,base-9.3*kS,50,9.3*kS);ctx.fillStyle=ORANGE;ctx.fillRect(350,base-5.8*kS,50,5.8*kS);
  TB('9,3',305,base-9.3*kS-6,INK,14);TB('5,8',375,base-5.8*kS-6,INK,14);
  TB('NaCl',75,base+18,INK,14);TB('KNO₃',145,base+18,INK,14);TB('NaCl',305,base+18,INK,14);TB('KNO₃',375,base+18,INK,14);
  LN(220,40,220,240,AX,1,[3,3]);
  if(p>0){ga(sg(p,0,.5));TB('rapport 1,7',110,56,DRED,16);TB('rapport 1,6',340,56,DRED,16);g1();
   ga(sg(p,.5,1));box(30,250,400,26,DGREEN,'#e3f5ee',8);TB('σ suit le nombre d\'ions libérés',230,269,DGREEN,15);g1();}
  else TB('?',230,150,GREY,34);
 })
]);
})();
