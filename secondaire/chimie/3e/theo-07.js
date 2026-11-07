/* SFA · Chimie 3e · chapitre 07 : théorie animée et devantures */
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
var CH_H='#7aa7d9',CH_O='#d9534f',CH_M='#8c96a0';
function sq(x,y,s){ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=1.3;ctx.fillRect(x,y,s,s);ctx.strokeRect(x,y,s,s);}
function mH2(x,y,r){ball(x-r*.8,y,r*.72,CH_H,'H','#fff');ball(x+r*.8,y,r*.72,CH_H,'H','#fff');}
function mO2(x,y,r){ball(x-r*.95,y,r,CH_O,'O','#fff');ball(x+r*.95,y,r,CH_O,'O','#fff');}
function mH2O(x,y,r){ball(x-r*1.15,y+r*.95,r*.72,CH_H,'H','#fff');ball(x+r*1.15,y+r*.95,r*.72,CH_H,'H','#fff');ball(x,y,r,CH_O,'O','#fff');}
SFA.theo("c07", {
 icon: function () {
  TB('2 H₂ + O₂ → 2 H₂O',W*.5,H*.44,BLUE_D,30);TB('masse avant = masse après',W*.5,H*.66,ORANGE,18);
 },
 anim: function (t) {
  var u=(t%540)/540,e=u<.3?0:(u<.62?(u-.3)/.32:1);e=e*e*(3-2*e);
  var r=Math.min(H*.06,16),L=function(a,b){return a+(b-a)*e;};
  var AT=[
   [W*.13-r*.8,H*.22,W*.72-r*1.15,H*.22+r*.95,CH_H,'H',.72],[W*.13+r*.8,H*.22,W*.72+r*1.15,H*.22+r*.95,CH_H,'H',.72],
   [W*.13-r*.8,H*.50,W*.72-r*1.15,H*.50+r*.95,CH_H,'H',.72],[W*.13+r*.8,H*.50,W*.72+r*1.15,H*.50+r*.95,CH_H,'H',.72],
   [W*.30-r*.95,H*.36,W*.72,H*.22,CH_O,'O',1],[W*.30+r*.95,H*.36,W*.72,H*.50,CH_O,'O',1]];
  var br=1-Math.min(1,e*6),bp=Math.max(0,(e-.8)*5);
  var P=AT.map(function(a){return [L(a[0],a[2]),L(a[1],a[3])];});
  ga(br);LN(P[0][0],P[0][1],P[1][0],P[1][1],GREY,4);LN(P[2][0],P[2][1],P[3][0],P[3][1],GREY,4);LN(P[4][0],P[4][1],P[5][0],P[5][1],GREY,4);
  ga(bp);LN(P[0][0],P[0][1],P[4][0],P[4][1],GREY,4);LN(P[1][0],P[1][1],P[4][0],P[4][1],GREY,4);LN(P[2][0],P[2][1],P[5][0],P[5][1],GREY,4);LN(P[3][0],P[3][1],P[5][0],P[5][1],GREY,4);g1();
  AT.forEach(function(a,i){ball(P[i][0],P[i][1],r*a[6],a[4],a[5],'#fff');});
  TB('2 H₂ + O₂',W*.22,H*.08,INK,18);TB('2 H₂O',W*.72,H*.08,INK,18);
  A(W*.42-30,H*.36,60,0,GREY,'',3);
  var ph=e<.05?'avant':(e>.95?'après':'les atomes se réarrangent');
  TB(ph,W*.5,H*.66,e>.05&&e<.95?ORANGE:GREY,16);
  TB('atomes H : 4 → 4      atomes O : 2 → 2',W*.5,H*.80,DGREEN,18);
  TB('masse : 4 g + 32 g = 36 g  →  36 g',W*.5,H*.94,BLUE_D,18);
 },
 th:
 '<div class="tcard"><b class="h">Transformation physique ou chimique ?</b><p>Dans une transformation <b>physique</b> (fusion, dissolution, mélange), les substances restent les mêmes : seul l\'état ou la dispersion change, on peut revenir en arrière facilement. Dans une transformation <b>chimique</b>, de <b>nouvelles substances</b> apparaissent. Indices : changement de couleur, dégagement de gaz, dépôt solide, chaleur ou lumière, odeur nouvelle.</p><p>Exemples : un glaçon qui fond ou du sucre qui se dissout = physique ; un clou qui rouille, une bougie qui brûle, du lait qui tourne = chimique.</p></div>' +
 '<div class="tcard"><b class="h">Réactifs, produits, équation</b><p>Les substances qui disparaissent sont les <b>réactifs</b>, celles qui apparaissent sont les <b>produits</b>. On écrit <code>réactifs → produits</code>. En mots : magnésium + dioxygène → oxyde de magnésium ; en formules : <code>2 Mg + O₂ → 2 MgO</code>. Les nombres devant les formules sont les <b>coefficients</b> ; les petits nombres dans les formules sont les <b>indices</b>.</p></div>' +
 '<div class="tcard"><b class="h">Loi de Lavoisier : rien ne se perd, rien ne se crée</b><p>Lors d\'une transformation chimique, les atomes sont seulement <b>réarrangés</b> : leur nombre (pour chaque élément) et la <b>masse totale</b> sont conservés. Donc <code>m(réactifs) = m(produits)</code> dans un système <b>fermé</b>. Le nombre de molécules, lui, peut changer (2 H₂ + O₂ : 3 molécules → 2 H₂O : 2 molécules).</p><p><b style="color:#a32d2d">Piège :</b> dans un récipient <b>ouvert</b>, un gaz peut s\'échapper (la balance baisse) ou entrer (la laine d\'acier qui brûle fixe du dioxygène et sa masse augmente). La masse n\'est pas perdue : elle est dans le gaz.</p></div>' +
 '<div class="tcard"><b class="h">Équilibrer et calculer des masses</b><p><b>Méthode :</b> (1) écrire les formules correctes ; (2) compter les atomes de chaque élément de chaque côté ; (3) ajuster les <b>coefficients</b>, jamais les indices (changer un indice change la substance : H₂O₂ n\'est pas de l\'eau) ; (4) vérifier. Exemple : CH₄ + 2 O₂ → CO₂ + 2 H₂O (C : 1 = 1 ; H : 4 = 4 ; O : 4 = 4).</p><p><b>Masses :</b> elles sont proportionnelles. Mg : O₂ : MgO = 3 : 2 : 5 en masse. Pour 6,0 g de Mg : 4,0 g de O₂ et 10,0 g de MgO. Le réactif <b>limitant</b> est celui qui disparaît le premier : il fixe la quantité de produit.</p></div>'
});
SFA.figs("c07", [
 // 0 physique ou chimique
 F(function(p){
  var rows=[['Un glaçon fond','P'],['Un clou rouille','C'],['Du sucre dans le café','P'],['Une bougie brûle','C'],['Le lait tourne','C']];
  rows.forEach(function(r,i){var y=14+i*52,ph=r[1]=='P';
   box(16,y,300,42,AX,'#fff',10);TB(String.fromCharCode(97+i)+'.  '+r[0],62,y+27,INK,15,'left');
   if(i==0){ctx.fillStyle='#d9ecfa';ctx.fillRect(28,y+11,20,20);ctx.strokeStyle=BLUE;ctx.strokeRect(28,y+11,20,20);}
   if(i==1){LN(28,y+10,48,y+32,'#a0522d',5);DOT(28,y+10,4,'#8a4a2a');}
   if(i==2){sq(28,y+16,10);sq(39,y+16,10);}
   if(i==3){LN(38,y+34,38,y+20,'#e9d9a6',6);ctx.fillStyle=ORANGE;ctx.beginPath();ctx.ellipse(38,y+12,5,9,0,0,7);ctx.fill();}
   if(i==4){ctx.fillStyle='#f4f1e8';ctx.fillRect(30,y+10,16,22);ctx.strokeStyle=GREY;ctx.strokeRect(30,y+10,16,22);}
   if(p>0){ga(sg(p,i*.15,i*.15+.3));box(330,y,116,42,ph?BLUE_D:DRED,ph?'#e6f1fb':'#fcebeb',10);TB(ph?'physique':'chimique',388,y+27,ph?BLUE_D:DRED,16);g1();}
   else TB('?',388,y+30,GREY,22);});
 }),
 // 1 ce qui se conserve
 F(function(p){
  mH2(45,70,18);mH2(45,140,18);mO2(125,105,20);TB('2 H₂ + O₂',85,205,INK,16);TB('3 molécules',85,228,GREY,14);
  A(180,105,60,0,GREY,'',3);
  mH2O(310,80,20);mH2O(400,150,20);TB('2 H₂O',355,205,INK,16);TB('2 molécules',355,228,GREY,14);
  if(p>0){ga(sg(p,0,.5));box(40,243,380,32,DGREEN,'#e3f5ee',8);TB('4 H et 2 O → 4 H et 2 O · 36 g = 36 g',230,264,DGREEN,14);g1();}
  else TB('que se conserve-t-il ?',230,268,GREY,16);
 }),
 // 2 réactifs et produits
 F(function(p){
  ball(40,70,17,CH_M,'Mg','#fff');ball(40,125,17,CH_M,'Mg','#fff');mO2(115,98,17);
  A(165,98,60,0,GREY,'',3);
  [[290,70],[290,125]].forEach(function(q){ball(q[0],q[1],17,CH_M,'Mg','#fff');ball(q[0]+36,q[1],17,CH_O,'O','#fff');});
  TB('réactifs',78,30,DRED,16);TB('produit',320,30,DGREEN,16);
  TB('2 Mg + O₂',78,170,INK,17);TB('2 MgO',320,170,INK,17);
  if(p>0){ga(sg(p,0,.4));TB('magnésium + dioxygène → oxyde de magnésium',230,205,BLUE_D,14);g1();
   ga(sg(p,.4,1));box(90,222,280,46,DGREEN,'#e3f5ee',10);TB('Mg : 2 = 2      O : 2 = 2',230,252,DGREEN,16);g1();}
  else TB('atomes conservés ?',230,240,GREY,16);
 }),
 // 3 équilibrer
 F(function(p){
  var E=[['H₂ + Cl₂ → HCl','H₂ + Cl₂ → 2 HCl'],['Na + Cl₂ → NaCl','2 Na + Cl₂ → 2 NaCl'],['CH₄ + O₂ → CO₂ + H₂O','CH₄ + 2 O₂ → CO₂ + 2 H₂O']];
  E.forEach(function(e,i){var y=70+i*70,a=p>0?sg(p,i*.25,i*.25+.3):0;
   ga(1-a);TB(e[0],230,y,INK,22);g1();ga(a);TB(e[1],230,y,DGREEN,22);g1();
   if(a>.5){ga(a);chk(430,y-6,DGREEN,10);g1();}});
  TB('on ajuste les coefficients, jamais les indices',230,262,GREY,14);
 }),
 // 4 fer qui s'alourdit
 F(function(p){
  ctx.fillStyle='#bbb';ctx.fillRect(30,190,150,12);ctx.fillRect(270,190,150,12);
  box(70,214,70,26,INK,'#e9ecef',6);TB('m₁',105,233,INK,16);box(310,214,70,26,INK,'#e9ecef',6);TB(p>0?'m₂ > m₁':'m₂ ?',345,233,p>0?DRED:GREY,16);
  for(var i=0;i<14;i++){ctx.strokeStyle='#8a9096';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(105+rnd(i)*40-20,170-rnd(i+3)*28,10+rnd(i+7)*8,rnd(i)*6,rnd(i)*6+4);ctx.stroke();}
  for(var j=0;j<14;j++){ctx.strokeStyle=p>0?'#9a5a3a':'#8a9096';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(345+rnd(j+30)*40-20,170-rnd(j+33)*28,10+rnd(j+37)*8,rnd(j)*6,rnd(j)*6+4);ctx.stroke();}
  TB('avant',105,30,INK,16);TB('après combustion',345,30,INK,16);A(160,110,100,0,ORANGE,'',3);
  if(p>0){ga(sg(p,0,.5));for(var k=0;k<3;k++){mO2(300+k*30,76+(k%2)*10,6);A(300+k*30,88+(k%2)*10,0,24,BLUE_D,'',1.6);}TB("O₂ de l'air fixé",345,56,BLUE_D,13);g1();
   ga(sg(p,.5,1));TB('Fe + O₂ → oxyde de fer',230,268,DGREEN,15);g1();}
  else TB("d'où vient la masse en plus ?",230,268,GREY,15);
 }),
 // 5 balance du bicarbonate
 F(function(p){
  ctx.fillStyle='#bbb';ctx.fillRect(20,206,180,12);scale(55,176,110,'250,0 g');glass(80,100,60,70,.5,'#d9ecfa');TB('au départ',110,30,INK,15);
  ctx.fillStyle='#bbb';ctx.fillRect(250,206,190,12);glass(300,100,60,70,.4,'#d9ecfa');scale(285,176,110,p>0?'247,9 g':'… g');TB('à la fin (flacon ouvert)',335,30,INK,14);
  if(p>0){for(var i=0;i<6;i++){var yy=95-((i*17+p*40)%45);ga(.8);ball(310+rnd(i)*40,yy,6,'#9aa4ad','',null);g1();}
   ga(sg(p,.2,.7));TB("CO₂ qui s'échappe",335,50,DGREEN,13);g1();
   ga(sg(p,.5,1));box(30,230,400,42,DRED,'#fcebeb',8);TB('m(CO₂) = 4,0 × 44 ÷ 84 ≈ 2,1 g · fermé : 250,0 g',230,257,DRED,14);g1();}
  else {TB('+ 4,0 g de bicarbonate',110,60,GREY,13);TB('masse finale ?',335,70,GREY,16);}
 }),
 // 6 coefficients ou indices
 F(function(p){
  TB('élève :',50,50,GREY,15);TB('H₂ + O₂ → H₂O₂',250,50,INK,24);
  TB('H₂O₂ = eau oxygénée',250,84,GREY,14);
  if(p>0){ga(sg(p,0,.4));LN(110,30,390,70,RED,5);g1();
   ga(sg(p,.3,.7));TB('indice modifié = autre substance',250,118,DRED,16);g1();
   ga(sg(p,.6,1));box(40,142,380,60,DGREEN,'#e3f5ee',12);TB('2 H₂ + O₂ → 2 H₂O',230,182,DGREEN,26);g1();
   ga(sg(p,.8,1));TB('H : 4 = 4      O : 2 = 2',230,240,DGREEN,16);g1();}
  else TB("où est l'erreur ?",230,180,GREY,20);
 }),
 // 7 combustion de 6 g de magnésium
 F(function(p){
  var k=36,x=40;
  TB('réactifs',x,36,GREY,14,'left');
  ctx.fillStyle=CH_M;ctx.fillRect(x,46,6*k,36);ctx.fillStyle=CH_O;ctx.fillRect(x+6*k,46,4*k,36);
  TB('Mg 6,0 g',x+3*k,70,'#fff',16);TB('O₂ 4,0 g',x+8*k,70,'#fff',16);
  if(p>0){ga(sg(p,0,.4));TB('produit',x,112,GREY,14,'left');ctx.fillStyle=ORANGE;ctx.fillRect(x,122,10*k,36);TB('MgO 10,0 g',x+5*k,146,'#fff',17);g1();
   ga(sg(p,.5,1));box(30,178,400,92,DGREEN,'#e3f5ee',12);TB("enceinte fermée, 5 L d'air",230,200,INK,14);
   TB('O₂ : 5 × 0,28 = 1,4 g → Mg : 1,4 × 3 ÷ 2 = 2,1 g',230,226,INK,14);TB('il reste 6,0 − 2,1 = 3,9 g de Mg',230,254,DGREEN,16);g1();}
  else {TB('rapport 3 g Mg : 2 g O₂ : 5 g MgO',230,150,GREY,16);TB("masse d'oxyde ?",230,200,GREY,20);}
 }),
 // 8 équation de l'alumine
 F(function(p){
  var i;
  for(i=0;i<4;i++)ball(30+i*34,60,13,CH_M,'Al','#fff');
  for(i=0;i<3;i++)mO2(40+i*60,120,11);
  A(210,90,40,0,GREY,'',3);
  for(i=0;i<2;i++){ball(290+i*90,50,12,CH_M,'Al','#fff');ball(320+i*90,50,12,CH_M,'Al','#fff');for(var j=0;j<3;j++)ball(285+i*90+j*22,90,10,CH_O,'O','#fff');}
  TB('4 Al + 3 O₂',100,175,INK,18);TB('2 Al₂O₃',345,175,INK,18);
  if(p>0){ga(sg(p,0,.5));TB('4 Al + 3 O₂ → 2 Al₂O₃',230,215,DGREEN,22);g1();ga(sg(p,.4,1));TB('Al : 4 = 4      O : 6 = 6',230,255,DGREEN,17);g1();}
  else TB('Al + O₂ → Al₂O₃  équilibrée ?',230,235,GREY,18);
 }),
 // 9 combustion du propane
 F(function(p){
  var y0=262,k=3.4;
  ctx.fillStyle=ORA2;ctx.fillRect(40,y0-11*k,90,11*k);TB('propane',85,y0-11*k/2+5,'#fff',14);TB('11 g',85,y0+14,INK,14);
  ctx.fillStyle=BLUE;ctx.fillRect(40,y0-51*k,90,40*k);TB('O₂ 40 g',85,y0-11*k-40*k/2+5,'#fff',15);
  TB('réactifs',85,y0-51*k-10,GREY,14);
  if(p>0){ga(sg(p,0,.5));ctx.fillStyle=GREEN;ctx.fillRect(230,y0-33*k,100,33*k);TB('CO₂ 33 g',280,y0-33*k/2+5,'#fff',15);
   ctx.fillStyle=VIOLET;ctx.fillRect(230,y0-51*k,100,18*k);TB('H₂O 18 g',280,y0-51*k+18*k/2+5,'#fff',15);TB('produits',280,y0-51*k-10,GREY,14);g1();
   ga(sg(p,.5,1));box(350,100,100,70,DGREEN,'#e3f5ee',10);TB('51 g = 51 g',400,128,DGREEN,16);TB('11 = 44 ÷ 4',400,152,INK,14);g1();A(135,150,90,0,GREY,'',2);}
  else {TB('?',280,150,GREY,40);TB('masses des produits ?',280,60,GREY,14);}
 }),
 // 10 réactif limitant
 F(function(p){
  var k=1900,x=90;
  TB('NaHCO₃',x-6,53,INK,14,'right');ctx.fillStyle=BLUE;ctx.fillRect(x,34,.100*k,26);TB('0,100 mol',x+.100*k/2,53,'#fff',14);
  TB('CH₃COOH',x-6,103,INK,14,'right');ctx.fillStyle=ORANGE;ctx.fillRect(x,84,.083*k,26);TB('0,083 mol',x+.083*k/2,103,'#fff',14);
  if(p>0){ga(sg(p,0,.4));ctx.strokeStyle=DRED;ctx.lineWidth=2.4;ctx.strokeRect(x,84,.083*k,26);tag('limitant',x+.083*k+50,98,DRED,14);
   ctx.fillStyle='#d9ecfa';ctx.fillRect(x+.083*k,34,(.100-.083)*k,26);g1();
   ga(sg(p,.4,1));box(30,138,400,130,DGREEN,'#e3f5ee',12);
   TB('n(CO₂) = 0,083 mol → 3,7 g → 2,0 L',230,168,INK,16);TB('reste : 0,100 − 0,083 = 0,017 mol',230,198,INK,16);TB('0,017 × 84 ≈ 1,4 g de bicarbonate',230,228,DGREEN,17);TB('(le vinaigre est le réactif limitant)',230,254,GREY,13);g1();}
  else TB('quel réactif manque en premier ?',230,190,GREY,20);
 })
]);
})();
