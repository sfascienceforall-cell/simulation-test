/* SFA · Chimie 5e · chapitre 10 : théorie animée et devantures */
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
var SB='₀₁₂₃₄₅₆₇₈₉';
function sub(n){return String(n).split('').map(function(d){return SB[+d];}).join('');}
function zz(n){var P=[];for(var i=0;i<n;i++)P.push([i,i%2]);return P;}
function chainB(a,b){var B=[];for(var i=a;i<b;i++)B.push([i,i+1]);return B;}
function skel(ox,oy,dx,dy,P,B,col,lw,dots){ctx.strokeStyle=col||INK;ctx.lineWidth=lw||3.2;ctx.lineJoin='round';ctx.beginPath();B.forEach(function(b){ctx.moveTo(ox+P[b[0]][0]*dx,oy+P[b[0]][1]*dy);ctx.lineTo(ox+P[b[1]][0]*dx,oy+P[b[1]][1]*dy);});ctx.stroke();
 if(dots)P.forEach(function(q){DOT(ox+q[0]*dx,oy+q[1]*dy,dots,col||INK);});}
function cnum(ox,oy,dx,dy,P,idx,lab,col,off){var q=P[idx];TB(lab,ox+q[0]*dx,oy+q[1]*dy+(off||-12),col||DRED,15);}
function atomC(x,y){DOT(x,y,12,'#6b7580');TB('C',x,y+5,'#fff',14);}
function atomH(x,y){DOT(x,y,9,'#fff');ctx.strokeStyle=GREY;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.stroke();TB('H',x,y+5,INK,13);}
var NAMES=['méthane','éthane','propane','butane','pentane','hexane','heptane','octane'],TEB=[-162,-89,-42,-1,36,69,98,126];
SFA.theo("c10", {
 icon: function () {
  TB('CₙH₂ₙ₊₂',W*.5,H*.4,BLUE_D,36);TB('alcanes · combustion',W*.5,H*.66,ORANGE,19);
 },
 anim: function (t) {
  var n=Math.floor(t/130)%8+1,u=(t%130)/130,i;
  var ox=W*.06,oy=H*.45,dx=Math.min(W*.075,40),dy=Math.min(H*.12,34),P=zz(n);
  var nb=Math.min(n,Math.floor(u*18)+1);
  skel(ox,oy,dx,dy,P.slice(0,nb),chainB(0,nb-1),BLUE_D,5,6);
  TB('C'+sub(n)+'H'+sub(2*n+2)+'  ·  '+NAMES[n-1],W*.06,H*.12,INK,22,'left');
  TB('M = '+(14*n+2)+' g/mol',W*.06,H*.77,GREY,17,'left');
  TB('T éb = '+String(TEB[n-1]).replace('-','−')+' °C',W*.06,H*.86,TEB[n-1]>20?DGREEN:DRED,17,'left');
  TB(TEB[n-1]>20?'liquide à 20 °C':'gaz à 20 °C',W*.06,H*.95,TEB[n-1]>20?DGREEN:DRED,17,'left');
  var bx=W*.62,bw=W*.34,by=H*.18,bh=H*.62,bb=by+bh;
  LN(bx,bb,bx+bw,bb,AX,1.6);
  for(i=0;i<8;i++){var h=(TEB[i]+170)/300*bh,x=bx+i*bw/8+3;ctx.fillStyle=i+1==n?ORANGE:'#d4d9de';ctx.fillRect(x,bb-h,bw/8-6,h);}
  TB('T éb selon la longueur de chaîne',bx+bw/2,by-6,GREY,13);
  TB('n = '+n,bx+(n-.5)*bw/8,bb+16,ORA2,14);
 },
 th:
 '<div class="tcard"><b class="h">Les alcanes</b><p>La chimie organique est la chimie des composés du carbone. Les <b>alcanes</b> sont des hydrocarbures (C et H seulement) à liaisons simples, de formule <code>CₙH₂ₙ₊₂</code>. Noms : méthane (n = 1), éthane, propane, butane, pentane, hexane, heptane, octane (n = 8)… Exemples : C₃H₈ (propane), C₇H₁₆ (heptane, M = 7 × 12 + 16 × 1 = 100 g/mol). C₅H₁₀ n\'est pas un alcane (2n + 2 = 12).</p><p>Représentations : formule brute (C₃H₈), semi-développée (CH₃–CH₂–CH₃ : 2 liaisons C–C et 8 liaisons C–H), topologique (zigzag de carbones).</p></div>' +
 '<div class="tcard"><b class="h">Nommer un alcane ramifié</b><p>1) repérer la <b>chaîne carbonée la plus longue</b> (nom de base) ; 2) nommer les <b>ramifications</b> (CH₃ = méthyl, C₂H₅ = éthyl) ; 3) numéroter la chaîne pour que les <b>numéros</b> des ramifications soient les plus petits ; 4) assembler : <code>2-méthylpentane</code>, <code>3-éthylpentane</code>, <code>2,2-diméthylbutane</code>.</p><p>Des molécules de même formule brute mais de structure différente sont des <b>isomères de chaîne</b> : le butane et le 2-méthylpropane sont des isomères de C₄H₁₀ ; C₆H₁₄ a 5 isomères de chaîne.</p></div>' +
 '<div class="tcard"><b class="h">Température d\'ébullition</b><p>Plus la chaîne est longue, plus les molécules s\'attirent (forces entre molécules) et plus la température d\'ébullition est élevée : méthane −162 °C, éthane −89, propane −42, butane −1, pentane 36, hexane 69, heptane 98, octane 126 °C. À 20 °C : gaz jusqu\'au butane, liquides ensuite. À nombre de carbones égal, une molécule <b>plus ramifiée</b> est plus compacte, a moins de contacts : sa T<sub>éb</sub> est <b>plus basse</b> (hexane 69 °C, 2,2-diméthylbutane 50 °C).</p></div>' +
 '<div class="tcard"><b class="h">Combustion et énergie</b><p><b>Complète</b> (assez de O₂) : <code>CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → n CO₂ + (n+1) H₂O</code>. Heptane : C₇H₁₆ + 11 O₂ → 7 CO₂ + 8 H₂O ; 100 g (1 mol) donnent 7 × 44 = 308 g de CO₂ et libèrent 4 817 kJ. <b>Incomplète</b> : il se forme du <b>CO</b> (toxique, incolore, inodore) ou de la suie C : C₃H₈ + 7/2 O₂ → 3 CO + 4 H₂O.</p><p>Énergie par kg : octane 5 470 ÷ 0,114 ≈ 48,0 MJ/kg ; éthanol 1 367 ÷ 0,046 ≈ 29,7 MJ/kg. Les deux émettent ≈ 64 g de CO₂ par MJ : il faut 1,6 fois plus d\'éthanol, en masse, pour la même énergie.</p></div>'
});
SFA.figs("c10", [
 // 0 heptane
 F(function(p){
  var P=zz(7);skel(48,100,56,32,P,chainB(0,6),INK,4,6);TB('7 atomes de carbone',230,40,GREY,16);
  if(p>0){ga(sg(p,0,.4));TB('C₇H₁₆ : heptane',230,180,DGREEN,22);g1();
   ga(sg(p,.3,.7));TB('M = 7 × 12 + 16 × 1 = 100 g/mol',230,214,INK,16);g1();
   ga(sg(p,.6,1));box(60,230,340,38,DRED,'#fcebeb',10);TB('C₅H₁₀ : 2n + 2 = 12 ≠ 10 → pas un alcane',230,255,DRED,14);g1();}
  else {TB('formule ? nom ? M ?',230,200,GREY,20);}
 }),
 // 1 propane
 F(function(p){
  var xs=[100,230,360],y=120;
  LN(100,y,360,y,INK,3);
  xs.forEach(function(x,i){var hu=[x,y-46],hd=[x,y+46];LN(x,y,hu[0],hu[1],INK,2.4);LN(x,y,hd[0],hd[1],INK,2.4);atomH(hu[0],hu[1]);atomH(hd[0],hd[1]);});
  LN(100,y,54,y,INK,2.4);atomH(54,y);LN(360,y,406,y,INK,2.4);atomH(406,y);
  xs.forEach(function(x){atomC(x,y);});
  TB('CH₃–CH₂–CH₃',230,24,INK,18);
  if(p>0){ga(sg(p,0,.5));TB('2 liaisons C–C · 8 liaisons C–H',230,208,DGREEN,16);g1();
   ga(sg(p,.4,1));box(40,224,380,46,DRED,'#fcebeb',10);TB('T éb = −42 °C < 20 °C : gaz à 20 °C',230,254,DRED,16);g1();}
  else TB('liaisons ? état physique à 20 °C ?',230,230,GREY,17);
 }),
 // 2 nom
 F(function(p){
  var P=zz(5);P.push([1,2]);var B=chainB(0,4);B.push([1,5]);
  TB('CH₃–CH(CH₃)–CH₂–CH₂–CH₃',230,28,INK,16);
  skel(80,100,70,34,P,B,INK,5,0);
  if(p>0){skel(80,100,70,34,P,chainB(0,4),BLUE,6,0);skel(80,100,70,34,P,[[1,5]],RED,6,0);
   ga(sg(p,0,.5));for(var i=0;i<5;i++)cnum(80,100,70,34,P,i,String(i+1),BLUE_D,i%2?24:-12);TB('chaîne la plus longue : 5 C → pentane',230,206,BLUE_D,15);TB('CH₃ en position 2',175,186,DRED,15,'left');g1();
   ga(sg(p,.5,1));box(80,222,300,44,DGREEN,'#e3f5ee',10);TB('2-méthylpentane',230,252,DGREEN,22);g1();}
  else {TB('2-méthylpentane ? 4-méthylpentane ?',230,214,GREY,15);TB('2-méthylbutane ? hexane ?',230,238,GREY,15);}
 }),
 // 3 butane / isobutane
 F(function(p){
  var P1=zz(4),P2=[[0,0],[1,1],[2,0],[1,2]];
  skel(30,90,48,32,P1,chainB(0,3),INK,5,6);TB('butane',102,190,INK,16);TB('T éb ≈ −1 °C',102,212,BLUE_D,15);
  skel(270,76,48,32,P2,[[0,1],[1,2],[1,3]],INK,5,6);TB('2-méthylpropane',318,190,INK,16);TB('T éb ≈ −12 °C',318,212,BLUE_D,15);
  if(!(p>0))TB('C₄H₁₀ ?',230,36,GREY,18);
  if(p>0){ga(sg(p,0,.4));TB('C₄H₁₀ : isomères de chaîne',230,36,DGREEN,18);g1();ga(sg(p,.4,1));box(30,226,400,44,DGREEN,'#e3f5ee',10);TB('ramifié = plus compact : T éb plus basse',230,254,DGREEN,16);g1();}
 }),
 // 4 combustion heptane
 F(function(p){
  var a=p>0?sg(p,0,.4):0;
  ga(1-a);TB('C₇H₁₆ + O₂ → CO₂ + H₂O',230,52,INK,22);g1();ga(a);TB('C₇H₁₆ + 11 O₂ → 7 CO₂ + 8 H₂O',230,52,DGREEN,22);g1();
  ctx.fillStyle=ORANGE;ctx.beginPath();ctx.moveTo(60,200);ctx.quadraticCurveTo(40,150,70,110);ctx.quadraticCurveTo(75,150,90,130);ctx.quadraticCurveTo(110,170,100,200);ctx.fill();ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.moveTo(72,200);ctx.quadraticCurveTo(66,170,80,150);ctx.quadraticCurveTo(92,175,88,200);ctx.fill();
  TB('100 g = 1 mol',80,226,INK,14);
  if(p>0){ga(sg(p,.3,.7));box(150,96,290,64,DGREEN,'#e3f5ee',10);TB('CO₂ : 7 × 44 = 308 g',295,124,INK,16);TB('7 mol de CO₂ par mol d\'heptane',295,148,GREY,13);g1();
   ga(sg(p,.6,1));box(150,172,290,64,DRED,'#fcebeb',10);TB('énergie libérée',295,198,INK,15);TB('4 817 kJ',295,226,DRED,20);g1();}
  else {TB('masse de CO₂ ? énergie ?',300,150,GREY,20);}
 }),
 // 5 éthyle
 F(function(p){
  var P=zz(5);P.push([2,-1]);P.push([3,-2]);var B=chainB(0,4);B.push([2,5]);B.push([5,6]);
  TB('CH₃–CH₂–CH(CH₂–CH₃)–CH₂–CH₃',230,24,INK,15);
  skel(80,150,70,30,P,B,INK,5,0);
  if(p>0){skel(80,150,70,30,P,chainB(0,4),BLUE,6,0);skel(80,150,70,30,P,[[2,5],[5,6]],RED,6,0);
   ga(sg(p,0,.5));TB('chaîne de 5 C : pentane',230,224,BLUE_D,15);TB('éthyle en 3',304,84,DRED,15,'left');g1();
   ga(sg(p,.5,1));box(80,236,300,36,DGREEN,'#e3f5ee',10);TB('3-éthylpentane',230,262,DGREEN,20);g1();}
  else {TB('3-éthylpentane ? 2-éthylpentane ?',230,232,GREY,15);TB('3-méthylhexane ? heptane ?',230,256,GREY,15);}
 }),
 // 6 isomères de l'hexane
 F(function(p){
  var S=[['hexane','','69',zz(6),chainB(0,5)],['3-méthyl','pentane','63',zz(5).concat([[2,-1]]),chainB(0,4).concat([[2,5]])],['2-méthyl','pentane','60',zz(5).concat([[1,2]]),chainB(0,4).concat([[1,5]])],['2,3-diméthyl','butane','58',zz(4).concat([[1,2],[2,-1]]),chainB(0,3).concat([[1,4],[2,5]])],['2,2-diméthyl','butane','50',zz(4).concat([[.3,1.9],[1.7,1.9]]),chainB(0,3).concat([[1,4],[1,5]])]];
  S.forEach(function(s,i){var cx=48+i*91;box(cx-44,34,88,180,AX,'#fff',10);
   var P=s[3],mx=0,Mx=0,my=9,My=-9;P.forEach(function(q){mx=Math.min(mx,q[0]);Mx=Math.max(Mx,q[0]);});
   skel(cx-(Mx*13)/2,110,13,14,P,s[4],INK,3.2,0);
   TB(s[0],cx,168,INK,13);TB(s[1],cx,186,INK,13);
   if(p>0){ga(sg(p,i*.12,i*.12+.3));TB(s[2]+' °C',cx,206,i<2?DRED:BLUE_D,15);g1();}});
  TB('même formule C₆H₁₄ · 5 isomères',230,20,GREY,14);
  if(p>0){ga(sg(p,.6,1));box(40,230,380,40,DGREEN,'#e3f5ee',10);TB('plus ramifié → T éb plus basse',230,256,DGREEN,16);A(60,222,340,0,GREY,'',1.5);g1();}
  else TB('classe-les par T éb croissante',230,250,GREY,16);
 }),
 // 7 combustion incomplète du propane
 F(function(p){
  var Q=[['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O','complète : donne du CO₂',0],['C₃H₈ + 7/2 O₂ → 3 CO + 4 H₂O','équilibrée : CO et H₂O',1],['C₃H₈ + 3 O₂ → 3 CO + 4 H₂O','non équilibrée (O : 6 ≠ 7)',0],['C₃H₈ + 7/2 O₂ → 3 CO₂ + 4 H₂O','non équilibrée (O : 7 ≠ 10)',0]];
  Q.forEach(function(q,i){var y=8+i*66,ok=q[2]==1,on=p>0?sg(p,i*.15,i*.15+.3):0;
   box(8,y,444,60,on>.5?(ok?DGREEN:AX):AX,on>.5&&ok?'#e3f5ee':'#fff',10);DOT(30,y+30,13,on>.5?(ok?DGREEN:GREY):GREY);TB(String.fromCharCode(65+i),30,y+36,'#fff',15);
   TB(q[0],54,y+26,INK,16,'left');if(p>0){ga(on);TB(q[1],54,y+49,ok?DGREEN:DRED,13,'left');g1();}});
  if(!(p>0))TB('laquelle est la bonne ?',230,279,GREY,13);
 }),
 // 8 chauffe-eau mal ventilé
 F(function(p){
  var k=52,x0=60;TB('1 mol de C₄H₁₀ : C₄H₁₀ + 13/2 O₂ → 4 CO₂ + 5 H₂O',230,20,INK,14);
  TB('O₂',30,70,GREY,14);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(x0,52,6.5*k,26);ctx.fillStyle=CA();ctx.fillRect(x0,52,4.875*k,26);
  TB('4,875 mol (75 %)',x0+2.4*k,70,'#fff',14);TB('6,5 mol (complète)',x0+6.5*k,46,GREY,13,'right');
  if(p>0){ga(sg(p,0,.4));TB('H₂O',30,120,GREY,14);ctx.fillStyle=VIOLET;ctx.fillRect(x0,102,2.5*k,26);TB('2,5',x0+1.25*k,120,'#fff',14);ctx.fillStyle=ORANGE;ctx.fillRect(x0+2.5*k,102,2.375*k,26);TB('2,375 pour C',x0+3.7*k,120,'#fff',14);g1();
   ga(sg(p,.3,.7));TB('C',30,170,GREY,14);ctx.fillStyle=GREEN;ctx.fillRect(x0,152,.75*k,26);ctx.fillStyle=RED;ctx.fillRect(x0+.75*k,152,3.25*k,26);TB('CO₂ 0,75',x0+.375*k+20,146,DGREEN,13,'center');TB('CO 3,25 mol',x0+2.4*k,170,'#fff',14);g1();
   ga(sg(p,.6,1));box(20,192,420,80,DRED,'#fcebeb',10);TB('énergie : 2 877 − 3,25 × 283 ≈ 1 957 kJ (68 %)',230,218,INK,15);TB('100 g de butane → 1,72 mol → 157 g de CO',230,243,DRED,15);TB('CO : toxique, incolore, inodore',230,264,GREY,13);g1();}
  else TB('combien de CO se forme ?',230,160,GREY,20);
 }),
 // 9 essence ou éthanol
 F(function(p){
  TB('octane C₈H₁₈',16,48,INK,15,'left');TB('ΔHc = −5 470 kJ/mol · 114 g/mol',16,70,GREY,13,'left');
  TB('éthanol C₂H₅OH',16,128,INK,15,'left');TB('ΔHc = −1 367 kJ/mol · 46 g/mol',16,150,GREY,13,'left');
  if(p>0){ga(sg(p,0,.4));ctx.fillStyle=ORANGE;ctx.fillRect(250,34,48*3.5,28);TB('48,0 MJ/kg',250+48*1.75,54,'#fff',15);ctx.fillStyle=GREEN;ctx.fillRect(250,114,29.7*3.5,28);TB('29,7 MJ/kg',250+29.7*1.75,134,'#fff',15);g1();
   ga(sg(p,.4,.8));TB('CO₂ émis : 64,4 g/MJ dans les deux cas',230,196,INK,15);g1();
   ga(sg(p,.7,1));box(40,214,380,52,DGREEN,'#e3f5ee',10);TB('48,0 ÷ 29,7 ≈ 1,6 fois plus d\'éthanol en masse',230,246,DGREEN,16);g1();}
  else TB('énergie par kg ? CO₂ par MJ ?',230,230,GREY,18);
 })
]);
function CA(){return '#4a90d9';}
})();
