/* SFA · Chimie 3e · chapitre 06 : théorie animée et devantures */
(function(){
/* aides locales (portée de ce fichier) */
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
function fiole(cx,top,h,lvl,col,lab){var w=70,nw=16,nh=h*.34;ctx.fillStyle=col||'#cfe6f8';var by=top+nh,bh=h-nh;
 // niveau (dans le corps)
 var ly=by+bh*(1-lvl);ctx.save();ctx.beginPath();ctx.moveTo(cx-nw/2,top);ctx.lineTo(cx-nw/2,by);ctx.quadraticCurveTo(cx-w/2,by+6,cx-w/2,by+22);ctx.lineTo(cx-w/2,top+h);ctx.lineTo(cx+w/2,top+h);ctx.lineTo(cx+w/2,by+22);ctx.quadraticCurveTo(cx+w/2,by+6,cx+nw/2,by);ctx.lineTo(cx+nw/2,top);ctx.closePath();
 ctx.save();ctx.clip();ctx.fillRect(cx-w/2,Math.max(top,Math.min(top+h,top+h-(h*lvl))),w,h);ctx.restore();ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
 LN(cx-nw/2-4,top+nh*.35,cx+nw/2+4,top+nh*.35,INK,1.5);if(lab)TB(lab,cx,top+h+18,INK,14);}
function sugar(x,y,s){ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=1.3;ctx.fillRect(x,y,s,s);ctx.strokeRect(x,y,s,s);}
function scale(x,y,w,val,col){ctx.fillStyle='#e9ecef';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(x,y,w,26,6);ctx.fill();ctx.stroke();
 ctx.fillStyle='#10202a';ctx.fillRect(x+w/2-34,y+4,68,18);TB(val,x+w/2,y+18,col||'#7ee0a8',14);}
function pt(x,y,c,r){DOT(x,y,r||5,c);}
SFA.theo("c06", {
 icon: function () {
  TB('ρ = m / V',W*.5,H*.4,BLUE_D,36);TB('g/L · dilution',W*.5,H*.62,ORANGE,20);
  var x=W*.5-30;fiole(W*.5,H*.7,H*.25,.6,'#cfe6f8');
 },
 anim: function (t) {
  var u=(t%720)/720,m=Math.min(500,u*1.15*500),S=360,V=1;
  var bx=W*.12,by=H*.14,bw=Math.min(W*.3,200),bh=H*.7;
  glass(bx,by,bw,bh,.8,'#d9ecfa');
  var d=Math.min(m,S),ex=Math.max(0,m-S);
  var nd=Math.round(d/S*60);
  for(var i=0;i<nd;i++){var x=bx+8+rnd(i)*(bw-16)+Math.sin(t*.04+i)*2,y=by+bh*.22+rnd(i+70)*(bh*.74)+Math.cos(t*.05+i*2)*2;DOT(x,y,2.8,BLUE_D);}
  var ng=Math.ceil(ex/140*10);
  for(var j=0;j<ng;j++){sugar(bx+8+(j%6)*((bw-24)/6),by+bh-14-Math.floor(j/6)*10,9);}
  TB('1 L d\'eau',bx+bw/2,by+bh+22,INK,14);
  // jauge
  var gx=W*.52,gy=H*.82,gw=W*.4,gh=Math.min(26,H*.1);
  ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(gx,gy,gw,gh);ctx.fillStyle=BLUE;ctx.fillRect(gx,gy,gw*d/500,gh);
  var sx=gx+gw*S/500;LN(sx,gy-8,sx,gy+gh+8,RED,2.4,[4,3]);TB('solubilité 360 g/L',sx,gy-14,DRED,13);
  TB('m ajoutée = '+Math.round(m)+' g',gx,H*.22,INK,18,'left');
  TB('ρ dissous = '+Math.round(d)+' g/L',gx,H*.36,BLUE_D,20,'left');
  if(m>S){TB('solution saturée',gx,H*.5,DRED,18,'left');TB('excès non dissous : '+Math.round(ex)+' g',gx,H*.6,DRED,15,'left');}
  else TB('solution non saturée',gx,H*.5,DGREEN,17,'left');
 },
 th:
 '<div class="tcard"><b class="h">Solvant, soluté, solution</b><p>Le <b>soluté</b> est la substance dissoute (sucre, sel), le <b>solvant</b> le liquide qui dissout (souvent l\'eau), la <b>solution</b> l\'ensemble. Dissoudre n\'est pas faire disparaître : les particules du soluté sont séparées et dispersées entre celles du solvant. La <b>masse se conserve</b> : <code>m(solution) = m(solvant) + m(soluté)</code> (200 g d\'eau + 30 g de sucre = 230 g). Le volume, lui, n\'est pas exactement additif.</p></div>' +
 '<div class="tcard"><b class="h">Concentration massique</b><p><code>ρ = m ÷ V</code> en g/L : masse de soluté par litre de <b>solution</b>. On en déduit <code>m = ρ × V</code> et <code>V = m ÷ ρ</code>.</p><p><b style="color:#a32d2d">Piège :</b> convertir le volume en <b>litres</b> avant de calculer (250 mL = 0,250 L ; 1 L = 1 000 mL).</p><p>Exemples : 20 g dans 0,50 L → ρ = 40 g/L. Sérum physiologique à 9 g/L, 250 mL : m = 9 × 0,250 = 2,25 g. 6 g à 30 g/L : V = 6 ÷ 30 = 0,20 L = 200 mL.</p></div>' +
 '<div class="tcard"><b class="h">Solubilité et saturation</b><p>La <b>solubilité</b> est la masse maximale de soluté qu\'on peut dissoudre dans un volume (ou une masse) de solvant, à une température donnée. Au-delà, la solution est <b>saturée</b> : l\'excès reste solide au fond. En général la solubilité des solides <b>augmente avec la température</b> : refroidir une solution saturée fait déposer des cristaux.</p><p>Exemple : nitrate de potassium : 32 g pour 100 g d\'eau à 20 °C, 110 g à 60 °C. Dans 250 g d\'eau à 60 °C : 2,5 × 110 = 275 g au maximum. 100 g dans 100 g d\'eau à 60 °C : non saturée ; refroidie à 20 °C : 100 − 32 = 68 g de cristaux.</p></div>' +
 '<div class="tcard"><b class="h">Dilution et mélange</b><p>Diluer = ajouter du solvant : la <b>masse de soluté ne change pas</b>, le volume augmente : <code>ρ₁ × V₁ = ρ₂ × V₂</code>. Facteur de dilution : <code>F = V₂ ÷ V₁ = ρ₁ ÷ ρ₂</code>. On prélève V₁ à la pipette, on le met dans une fiole jaugée de volume V₂ et on complète avec de l\'eau jusqu\'au trait.</p><p>Exemple : 50 mL de sirop à 600 g/L complétés à 500 mL : m = 600 × 0,050 = 30 g ; ρ₂ = 30 ÷ 0,500 = 60 g/L ; F = 10.</p><p>Mélange de deux solutions : on additionne masses et volumes : ρ = (ρ₁V₁ + ρ₂V₂) ÷ (V₁ + V₂), ce n\'est pas la moyenne simple des concentrations (100 mL à 20 g/L + 300 mL à 40 g/L : (2 + 12) ÷ 0,4 = 35 g/L).</p></div>'
});

SFA.figs("c06", [
 // 0
 F(function(p){
  fiole(120,40,190,.7,'#e7eef6','');TB('0,50 L',120,250,INK,15);
  for(var i=0;i<4;i++)sugar(20+i*13,60+(i%2)*12,11);TB('20 g de sel',44,100,INK,14);A(60,125,30,25,GREY,'',2);
  TB('ρ = m ÷ V',330,80,BLUE_D,20);
  if(p>0){ga(sg(p,0,.4));TB('= 20 g ÷ 0,50 L',330,120,INK,18);g1();ga(sg(p,.4,1));box(250,140,160,56,DRED,'#fcebeb',12);TB('40 g/L',330,180,DRED,28);g1();}
  else TB('ρ = ?',330,130,GREY,28);
 }),
 // 1 solvant ou soluté
 F(function(p){
  glass(150,80,110,130,.72,'#cfe6f8');sugar(176,52,14);sugar(194,46,14);
  for(var i=0;i<12;i++)DOT(165+rnd(i)*80,120+rnd(i+9)*80,3,ORA2);
  TB('boisson',205,236,INK,15);
  if(p>0){ga(sg(p,0,.4));tag('soluté : le sucre',350,56,DRED,15);A(300,62,-60,-4,DRED,'',2);g1();ga(sg(p,.3,.7));tag('solvant : l\'eau',80,150,BLUE_D,15);A(120,150,28,0,BLUE_D,'',2);g1();ga(sg(p,.6,1));tag('solution = les deux',350,200,DGREEN,15);g1();}
  else TB('solvant ?',80,150,GREY,18);
 }),
 // 2 peser
 F(function(p){
  fiole(110,40,190,.8,'#e7eef6','250 mL');
  TB('9 g/L',110,16,BLUE_D,16);
  ctx.fillStyle='#bbb';ctx.fillRect(230,180,190,14);scale(240,150,170,p>0?'2,25 g':'0,00 g');
  ctx.fillStyle='#fff';ctx.fillRect(300,134,60,14);ctx.strokeStyle=GREY;ctx.strokeRect(300,134,60,14);
  if(p>0){ga(sg(p,0,.5));TB('m = ρ × V',330,60,INK,18);TB('= 9 × 0,250',330,86,INK,18);TB('= 2,25 g',330,116,DRED,22);g1();}
  else TB('masse à peser ?',330,80,GREY,18);
 }),
 // 3 volume
 F(function(p){
  for(var i=0;i<6;i++)sugar(30+(i%3)*14,70+Math.floor(i/3)*14,12);TB('6 g de sucre',54,130,INK,14);
  A(110,100,60,0,GREY,'',2.4);
  fiole(250,40,190,p>0?.62:.4,'#e7eef6','');if(p>0){TB('200 mL',250,250,DRED,20);}else TB('? mL',250,250,GREY,20);
  TB('30 g/L',250,26,BLUE_D,16);
  if(p>0){ga(sg(p,0,.5));box(330,70,120,80,DRED,'#fcebeb',10);TB('V = m ÷ ρ',390,98,INK,16);TB('6 ÷ 30 = 0,20 L',390,122,INK,15);TB('= 200 mL',390,144,DRED,18);g1();}
 }),
 // 4 sucre a-t-il disparu
 F(function(p){
  ctx.fillStyle='#bbb';ctx.fillRect(40,200,190,14);scale(50,170,170,p>0?'230,0 g':'200,0 g');
  glass(95,100,80,70,.6,'#cfe6f8');
  if(p<=0){sugar(122,70,12);sugar(134,62,12);TB('+ 30 g de sucre',135,40,INK,15);}
  else {for(var i=0;i<10;i++)DOT(105+rnd(i)*60,125+rnd(i+5)*40,2.8,ORA2);TB('sucre dissous (invisible)',135,40,ORA2,14);}
  TB('200 g d\'eau',135,236,INK,14);
  TB(p>0?'200 + 30 = 230 g':'que lit-on ?',340,120,p>0?DRED:GREY,p>0?22:18);
  if(p>0){ga(sg(p,0,.6));TB('la masse se conserve',340,156,DGREEN,16);g1();}
 }),
 // 5 courbe de solubilité
 F(function(p){
  var X=function(T){return 70+T*5.2},Y=function(s){return 240-s*1.8};
  LN(60,240,440,240,AX,1.6);LN(60,240,60,30,AX,1.6);TB('θ (°C)',440,262,GREY,13,'right');TB('g de KNO₃ / 100 g d\'eau',66,24,GREY,13,'left');
  [20,40,60,80].forEach(function(T){LN(X(T),240,X(T),245,GREY,1);TB(String(T),X(T),258,GREY,12);});
  [0,50,100].forEach(function(s){LN(56,Y(s),60,Y(s),GREY,1);TB(String(s),52,Y(s)+4,GREY,12,'right');});
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(10),Y(32-5*(110-32)/40));ctx.lineTo(X(70),Y(110+(110-32)/40*10));ctx.stroke();
  TB('saturée',X(70)-4,Y(130)+18,BLUE_D,13,'right');
  DOT(X(20),Y(32),5,BLUE_D);DOT(X(60),Y(110),5,BLUE_D);TB('32',X(20)+8,Y(32)+16,BLUE_D,13,'left');TB('110',X(60)-8,Y(110)-8,BLUE_D,13,'right');
  if(p>0){ga(sg(p,0,.4));DOT(X(60),Y(100),6,GREEN);TB('100 g : non saturée',X(60)+8,Y(100)+20,DGREEN,13,'left');g1();
   ga(sg(p,.4,.8));A(X(60)-6,Y(100),-(X(60)-X(20))+12,Y(32)-Y(100)-4,RED,'',2);g1();
   ga(sg(p,.6,1));box(240,60,200,50,DRED,'#fcebeb',10);TB('refroidi à 20 °C :',340,82,INK,14);TB('100 − 32 = 68 g de cristaux',340,102,DRED,15);g1();}
 }),
 // 6 saturer le sel
 F(function(p){
  glass(60,60,140,150,.8,'#d9ecfa');for(var i=0;i<30;i++)DOT(70+rnd(i)*120,90+rnd(i+4)*100,2.6,BLUE_D);
  for(var j=0;j<14;j++)sugar(66+(j%7)*18,194-Math.floor(j/7)*11,10);
  TB('1 L d\'eau + 500 g de sel',130,236,INK,14);
  TB('solubilité : 360 g/L',330,70,BLUE_D,16);
  if(p>0){ga(sg(p,0,.5));box(250,90,190,50,DGREEN,'#e3f5ee',10);TB('360 g dissous',345,112,INK,16);TB('ρ = 360 g/L (saturée)',345,132,DGREEN,14);g1();
   ga(sg(p,.4,1));box(250,152,190,50,DRED,'#fcebeb',10);TB('500 − 360 = 140 g',345,174,INK,16);TB('restent au fond',345,194,DRED,14);g1();}
  else TB('que se passe-t-il ?',345,130,GREY,18);
 }),
 // 7 diluer
 F(function(p){
  fiole(90,60,150,.3,'#f6d9a4','');TB('sirop 600 g/L',90,236,INK,13);TB('50 mL',90,254,DRED,14);
  A(140,130,60,0,GREY,'',3);
  fiole(270,40,190,.85,'#fbecc9','');TB('500 mL',270,250,INK,14);
  if(p>0){ga(sg(p,0,.4));TB('m = 600 × 0,050 = 30 g',380,70,INK,13,'center');g1();ga(sg(p,.3,.7));TB('ρ = 30 ÷ 0,500',380,110,INK,15);TB('= 60 g/L',380,134,DRED,20);g1();ga(sg(p,.6,1));box(330,150,120,40,DGREEN,'#e3f5ee',10);TB('dilué 10 fois',390,176,DGREEN,16);g1();}
  else TB('+ eau jusqu\'au trait',380,130,GREY,14);
 }),
 // 8 mélange
 F(function(p){
  glass(20,90,70,90,.4,'#f6e0b4');TB('100 mL',55,208,INK,13);TB('20 g/L',55,226,BLUE_D,14);TB('+',104,140,GREY,26);
  glass(122,70,70,110,.8,'#f2c97a');TB('300 mL',157,208,INK,13);TB('40 g/L',157,226,BLUE_D,14);A(206,130,40,0,GREY,'',3);
  glass(272,70,86,110,.9,'#f3d391');TB('400 mL',315,208,INK,13);
  if(p>0){ga(sg(p,0,.5));TB('2 + 12 = 14 g',400,100,INK,14);TB('14 ÷ 0,400',400,124,INK,14);g1();ga(sg(p,.4,1));box(370,140,86,56,DRED,'#fcebeb',10);TB('35 g/L',413,178,DRED,20);g1();
   ga(sg(p,.5,1));tag('pas la moyenne (30 g/L)',230,258,DGREEN,13);g1();}
  else TB('ρ finale ?',400,130,GREY,18);
 }),
 // 9 solution bleue
 F(function(p){
  fiole(100,40,190,.8,'#8ec5f0','500 mL');TB('40 g/L CuSO₄',100,24,BLUE_D,14);
  A(160,150,0,0,GREY);
  fiole(260,40,190,.8,'#cbe6fa','500 mL');TB('25 mL → 500 mL',260,24,BLUE_D,14);
  A(150,120,40,0,GREY,'',2.6);
  if(p>0){ga(sg(p,0,.35));TB('m = 40 × 0,500 = 20 g',100,270,DRED,13);g1();
   ga(sg(p,.3,.7));box(340,50,110,54,DRED,'#fcebeb',10);TB('2 g/L',395,92,DRED,22);TB('F = 20',395,70,INK,13);g1();
   ga(sg(p,.6,1));box(330,120,125,68,DGREEN,'#e3f5ee',10);TB('non saturée',392,144,DGREEN,14);TB('max : 200 × 0,5',392,164,INK,13);TB('= 100 g',392,182,DGREEN,16);g1();}
  else TB('masse ? dilution ?',395,100,GREY,15);
 }),
 // 10 évaporer
 F(function(p){
  glass(30,60,70,150,1,'#d9ecfa');TB('1 L',65,236,INK,14);TB('12 g',65,252,BLUE_D,14);
  glass(140,60,70,150,.7,'#d9ecfa');TB('0,70 L',175,236,INK,14);
  for(var i=0;i<3;i++){ctx.strokeStyle=BLUE;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(150+i*20,70);ctx.quadraticCurveTo(156+i*20,56,150+i*20,44);ctx.stroke();g1();}
  glass(250,60,70,150,.0,'#d9ecfa');ctx.fillStyle='#d9ecfa';ctx.fillRect(252,203,66,6);for(var j=0;j<8;j++)sugar(256+(j%4)*14,194-Math.floor(j/4)*9,9);TB('33 mL',285,236,INK,14);
  A(106,130,28,0,GREY,'',2.4);A(216,130,28,0,GREY,'',2.4);
  if(p>0){ga(sg(p,0,.4));TB('17 g/L',175,50,DRED,15);g1();ga(sg(p,.3,.7));TB('saturée : 360 g/L',285,50,DRED,14);g1();
   ga(sg(p,.6,1));box(340,70,112,110,DGREEN,'#e3f5ee',10);TB('V = 12 ÷ 360',396,98,INK,14);TB('= 0,033 L',396,120,INK,14);TB('évaporer',396,146,DGREEN,14);TB('≈ 967 mL',396,168,DGREEN,16);g1();}
  else TB('300 mL s\'évaporent',390,130,GREY,14);
 })
]);
})();
