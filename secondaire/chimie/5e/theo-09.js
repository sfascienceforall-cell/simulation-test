/* SFA · Chimie 5e · chapitre 09 : théorie animée et devantures */
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
var CA='#4a90d9',CBc='#e08a3c',CGr='#9aa4ad';
function bar(x,base,w,h,col,lab,val,sz){ctx.fillStyle=col;ctx.fillRect(x,base-h,w,h);TB(val,x+w/2,base-h-6,INK,sz||13);TB(lab,x+w/2,base+17,INK,sz||13);}
function ax(x0,y0,x1,y1){LN(x0,y0,x1,y0,AX,1.6);LN(x0,y0,x0,y1,AX,1.6);}
function flask(x,y,w,h,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x+w*.36,y);ctx.lineTo(x+w*.36,y+h*.35);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w*.64,y+h*.35);ctx.lineTo(x+w*.64,y);ctx.closePath();ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.stroke();}
SFA.theo("c09", {
 icon: function () {
  TB('Le Chatelier',W*.5,H*.38,BLUE_D,32);TB('⇌  perturbation → opposition',W*.5,H*.64,ORANGE,18);
 },
 anim: function (t) {
  var u=(t%720)/720,s=u*8,tau=.7,s0=3.2,B0=.75,Bn=1.125;
  var gx=W*.07,gw=W*.52,gy=H*.1,gh=H*.55,gb=gy+gh,k=gh/1.6,i,pert=s>=s0;
  LN(gx,gb,gx+gw,gb,AX,1.6);LN(gx,gb,gx,gy,AX,1.6);TB('temps',gx+gw,gb+16,GREY,13,'right');TB('concentration',gx+4,gy-3,GREY,13,'left');
  var AA=function(x){var b=x<s0?.75*(1-Math.exp(-x/.5)):B0+(Bn-B0)*(1-Math.exp(-(x-s0)/tau));return x<s0?1-b:1.5-b;};
  var BB=function(x){return x<s0?.75*(1-Math.exp(-x/.5)):B0+(Bn-B0)*(1-Math.exp(-(x-s0)/tau));};
  var ss;ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();for(i=0;i<=s*30;i++){ss=i/30;var xx=gx+gw*ss/8,yy=gb-AA(ss)*k;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  ctx.strokeStyle=ORANGE;ctx.beginPath();for(i=0;i<=s*30;i++){ss=i/30;var x2=gx+gw*ss/8,y2=gb-BB(ss)*k;i?ctx.lineTo(x2,y2):ctx.moveTo(x2,y2);}ctx.stroke();
  DOT(gx+gw*s/8,gb-AA(s)*k,5,BLUE_D);DOT(gx+gw*s/8,gb-BB(s)*k,5,ORA2);
  if(s>=s0){LN(gx+gw*s0/8,gb,gx+gw*s0/8,gy,RED,1.6,[4,3]);TB('+ A',gx+gw*s0/8,gy+12,DRED,15);}
  TB('[A]',gx+gw+4,gb-AA(Math.min(s,8))*k+4,BLUE_D,15,'left');TB('[B]',gx+gw+4,gb-BB(Math.min(s,8))*k+4,ORA2,15,'left');
  var Q=BB(s)/Math.max(AA(s),.01),K=3,tx=W*.8;
  TB('A ⇌ B   K = 3,0',tx,H*.14,INK,17);
  TB('Q = '+Q.toFixed(1).replace('.',','),tx,H*.34,Math.abs(Q-3)<.1?DGREEN:DRED,26);
  var msg=!pert?(Math.abs(Q-3)<.1?'équilibre':'vers l\'équilibre'):(Math.abs(Q-3)<.1?'nouvel équilibre':'Q < K : → droite');
  TB(msg,tx,H*.5,pert&&Math.abs(Q-3)>=.1?DRED:DGREEN,15);
  if(pert&&Math.abs(Q-3)>=.1)A(tx-40,H*.6,80,0,RED,'',4);
  TB('on ajoute A à l\'équilibre : le système consomme A',W*.5,H*.93,GREY,15);
 },
 th:
 '<div class="tcard"><b class="h">Principe de Le Chatelier</b><p>Quand on <b>perturbe</b> un système à l\'équilibre (concentration, température, pression), il évolue dans le sens qui <b>s\'oppose à la perturbation</b>, jusqu\'à un nouvel équilibre. Ajouter un réactif ou retirer un produit : l\'équilibre se déplace vers la <b>droite</b> (Q &lt; K). Ajouter un produit ou retirer un réactif : vers la <b>gauche</b> (Q &gt; K).</p><p>Exemple : H₂ + I₂ ⇌ 2 HI à l\'équilibre ([H₂] = [I₂] = 0,22 ; [HI] = 1,56 mol/L), on ajoute 0,50 mol/L de H₂ : Q ≈ 15 &lt; K = 50 → vers la droite ; [I₂] baisse, [HI] monte (≈ 1,79 mol/L).</p></div>' +
 '<div class="tcard"><b class="h">Pression et température</b><p><b>Pression</b> (équilibres gazeux, par réduction de volume) : le système évolue vers le côté qui a le <b>moins de moles de gaz</b>. N₂ + 3 H₂ ⇌ 2 NH₃ (4 → 2) : vers la droite ; N₂O₄ ⇌ 2 NO₂ (1 → 2) : vers la gauche ; H₂ + I₂ ⇌ 2 HI (2 → 2) : aucun effet.</p><p><b>Température</b> : chauffer favorise le sens <b>endothermique</b>, refroidir le sens exothermique. C\'est la <b>seule</b> perturbation qui modifie K. 2 NO₂ ⇌ N₂O₄ est exothermique (ΔH = −57 kJ/mol) : chauffer déplace vers NO₂ (plus brun), K diminue.</p></div>' +
 '<div class="tcard"><b class="h">Ce qui ne déplace pas l\'équilibre</b><p>Un <b>catalyseur</b> accélère les deux sens de la même façon : l\'équilibre est atteint plus vite, sans changer la composition ni K. Un <b>gaz inerte</b> ajouté à volume constant ne change aucune concentration : Q reste égal à K, pas de déplacement. (À pression constante, le volume augmente et les concentrations baissent : l\'effet est alors celui d\'une baisse de pression.)</p></div>' +
 '<div class="tcard"><b class="h">Applications : Haber et gaz dissous</b><p><b>Synthèse de l\'ammoniac</b> N₂ + 3 H₂ ⇌ 2 NH₃ (exothermique, 4 → 2 mol de gaz) : le rendement augmente quand T diminue et P augmente (62 % à 300 °C, 25 % à 450 °C, 8 % à 600 °C sous 200 bar). Mais à basse température la réaction est trop lente : on travaille à ≈ 450 °C, ≈ 200 bar avec un catalyseur au fer, et on recycle les réactifs non transformés (compromis vitesse / rendement / coût).</p><p><b>Loi de Henry</b> : c = k<sub>H</sub> · p. À 3,0 atm de CO₂ : c = 0,034 × 3,0 = 0,10 mol/L ; la solubilité d\'un gaz diminue quand la température augmente : une canette tiède mousse plus.</p></div>'
});
SFA.figs("c09", [
 // 0 ajouter, retirer
 F(function(p){
  [['H₂ ajouté',140],['NH₃ retiré',330]].forEach(function(r,i){var y0=8+i*138;box(8,y0,444,128,AX,'#fff',12);
   TB('(' + (i?'b':'a') + ')',24,y0+24,GREY,15,'left');TB(i?'− NH₃':'+ H₂',r[1],y0+30,DRED,17);
   TB('N₂ + 3 H₂',140,y0+70,INK,22);TB('⇌',230,y0+70,GREY,24);TB('2 NH₃',330,y0+70,INK,22);
   if(p>0){ga(sg(p,i*.25,i*.25+.4));A(150,y0+90,160,0,DGREEN,'',5);TB('vers la droite',230,y0+118,DGREEN,15);g1();}
   else TB('→ ou ← ?',230,y0+110,GREY,16);});
 }),
 // 1 pression
 F(function(p){
  var Q=[['N₂O₄ ⇌ 2 NO₂','1 → 2 mol de gaz','vers la gauche',DRED],['N₂ + 3 H₂ ⇌ 2 NH₃','4 → 2 mol de gaz','vers la droite',DGREEN],['H₂ + I₂ ⇌ 2 HI','2 → 2 mol de gaz','aucun déplacement',GREY]];
  TB('P ↑  (V ↓)',230,22,BLUE_D,16);
  Q.forEach(function(q,i){var y=34+i*80;box(8,y,444,70,AX,'#fff',10);TB(q[0],18,y+30,INK,16,'left');TB(q[1],18,y+54,GREY,14,'left');
   if(p>0){ga(sg(p,i*.2,i*.2+.35));box(250,y+10,190,50,q[3],'#f6f8fa',10);TB(q[2],345,y+42,q[3],16);g1();}else TB('?',345,y+44,GREY,26);});
 }),
 // 2 chauffer
 F(function(p){
  TB('2 NO₂ ⇌ N₂O₄ · exothermique',230,24,INK,16);
  flask(60,50,100,110,'rgba(150,80,30,.35)');TB('25 °C',110,198,INK,15);
  var a=p>0?sg(p,0,.6):0;flask(260,50,100,110,'rgba(150,80,30,'+(.35+.4*a)+')');TB('chauffé',310,198,INK,15);
  ctx.fillStyle=ORANGE;ctx.beginPath();ctx.ellipse(310,172,14,10,0,0,7);ctx.fill();ctx.fillStyle='#ffd34d';ctx.beginPath();ctx.ellipse(310,174,7,6,0,0,7);ctx.fill();
  A(170,105,70,0,GREY,'',3);
  if(p>0){ga(sg(p,.2,.8));box(30,210,400,58,DGREEN,'#e3f5ee',10);TB('vers la gauche (NO₂) · plus brun · K diminue',230,236,DGREEN,16);TB('on favorise le sens endothermique',230,258,INK,14);g1();}
  else TB('sens ? couleur ? K ?',230,242,GREY,18);
 }),
 // 3 catalyseur
 F(function(p){
  var Y=function(E){return 200-E*1.4;};
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(40,Y(0));ctx.lineTo(110,Y(0));ctx.bezierCurveTo(170,Y(0),180,Y(100),250,Y(100));ctx.bezierCurveTo(320,Y(100),330,Y(-20),390,Y(-20));ctx.lineTo(440,Y(-20));ctx.stroke();
  TB('sans catalyseur',270,Y(100)-8,ORA2,14);TB('réactifs',70,Y(0)-10,INK,14);TB('produits',405,Y(-20)-10,INK,14);TB('énergie',46,22,GREY,13,'left');
  if(p>0){ga(sg(p,0,.5));ctx.strokeStyle=GREEN;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(110,Y(0));ctx.bezierCurveTo(170,Y(0),180,Y(55),250,Y(55));ctx.bezierCurveTo(320,Y(55),330,Y(-20),390,Y(-20));ctx.stroke();TB('avec catalyseur',250,Y(55)-8,DGREEN,14);g1();
   ga(sg(p,.5,1));box(40,236,380,36,DGREEN,'#e3f5ee',8);TB('même ΔH, même K : équilibre atteint plus vite',230,260,DGREEN,15);g1();}
  else TB('le rendement augmente-t-il ?',230,250,GREY,18);
 }),
 // 4 ajout de H2
 F(function(p){
  var k=60,base=190;TB('H₂ + I₂ ⇌ 2 HI · K = 50',230,22,INK,17);
  bar(14,base,30,.22*k,CA,'H₂','0,22',13);bar(48,base,30,.22*k,CBc,'I₂','0,22',13);bar(82,base,30,1.56*k,VIOLET,'HI','1,56',13);TB('équilibre',63,222,GREY,14);
  bar(144,base,30,.72*k,CA,'H₂','0,72',13);bar(178,base,30,.22*k,CBc,'I₂','0,22',13);bar(212,base,30,1.56*k,VIOLET,'HI','1,56',13);TB('+ 0,50 H₂',193,222,DRED,14);
  if(p>0){ga(sg(p,0,.5));TB('Q ≈ 15 < K',144,48,DRED,15,'left');g1();
   ga(sg(p,.4,1));bar(284,base,30,.61*k,CA,'H₂','0,61',13);bar(318,base,30,.11*k,CBc,'I₂','0,11',13);bar(352,base,30,1.79*k,VIOLET,'HI','1,79',13);TB('nouvel équilibre',333,222,DGREEN,14);g1();
   ga(sg(p,.6,1));box(20,240,420,32,DGREEN,'#e3f5ee',8);TB('vers la droite : [I₂] ↓ · [HI] ↑',230,262,DGREEN,15);g1();}
  else {TB('Q = ?  sens ?',300,110,GREY,18);}
 }),
 // 5 boisson tiède
 F(function(p){
  [[80,'froide · 5 °C',4,.2],[290,'tiède · 25 °C',14,1]].forEach(function(g,gi){glass(g[0],90,90,110,.8,gi?'#e7c98f':'#d9e6c8');
   var nb=p>0?g[2]:2;for(var i=0;i<nb;i++){var yy=190-((i*23+p*50)%100);ga(.9);ball(g[0]+10+rnd(i+gi*9)*70,yy,gi?4.5:3.5,'#ffffff','',null);g1();}
   TB(g[1],g[0]+45,226,INK,14);});
  if(p>0){ga(sg(p,0,.5));for(var j=0;j<5;j++){var yy2=84-((j*9+p*30)%40);ball(310+rnd(j)*50,yy2,4,'#fff','',null);}g1();
   ga(sg(p,.4,1));box(20,242,420,32,DGREEN,'#e3f5ee',8);TB('solubilité du CO₂ ↓ quand T ↑ : le gaz s\'échappe',230,264,DGREEN,14);g1();}
  else TB('pourquoi la tiède mousse plus ?',230,40,GREY,18);
 }),
 // 6 Haber
 F(function(p){
  TB('NH₃ à l\'équilibre (%)',230,16,GREY,13);
  var XT=function(T){return 50+(T-300)/300*170;},XP=function(P){return 270+(P-100)/300*170;},Y=function(v){return 210-v*2.6;};
  ax(50,210,230,26);ax(270,210,450,26);TB('T (°C) à 200 bar',140,238,GREY,13);TB('P (bar) à 450 °C',360,238,GREY,13);
  var T=[[300,62],[400,35],[450,25],[600,8]],P=[[100,15.5],[200,25],[300,31],[400,36]];
  ctx.strokeStyle=BLUE;ctx.lineWidth=2.6;ctx.beginPath();T.forEach(function(q,i){i?ctx.lineTo(XT(q[0]),Y(q[1])):ctx.moveTo(XT(q[0]),Y(q[1]));});ctx.stroke();
  ctx.beginPath();P.forEach(function(q,i){i?ctx.lineTo(XP(q[0]),Y(q[1])):ctx.moveTo(XP(q[0]),Y(q[1]));});ctx.stroke();
  T.forEach(function(q){DOT(XT(q[0]),Y(q[1]),4,BLUE_D);TB(String(q[1]),XT(q[0])+10,Y(q[1])-6,GREY,12);TB(String(q[0]),XT(q[0]),224,GREY,12);});
  P.forEach(function(q){DOT(XP(q[0]),Y(q[1]),4,BLUE_D);TB(String(q[1]).replace('.',','),XP(q[0])+4,Y(q[1])-8,GREY,12);TB(String(q[0]),XP(q[0]),224,GREY,12);});
  if(p>0){ga(sg(p,0,.5));DOT(XT(450),Y(25),8,RED,false);DOT(XP(200),Y(25),8,RED,false);g1();
   ga(sg(p,.4,1));box(20,248,420,28,DGREEN,'#e3f5ee',8);TB('compromis : 450 °C · 200 bar · catalyseur Fe',230,268,DGREEN,14);g1();}
  else TB('quelles conditions ?',350,60,GREY,16);
 }),
 // 7 gaz inerte
 F(function(p){
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.strokeRect(40,40,230,170);
  var i,c=[CA,CBc,VIOLET];for(i=0;i<24;i++){ball(52+rnd(i)*206+Math.sin(i*3+p*3)*3,52+rnd(i+50)*146,5.5,c[i%3],'',null);}
  TB('N₂ · H₂ · NH₃ (V fixe)',155,232,INK,14);
  if(p>0){ga(sg(p,0,.6));for(i=0;i<10;i++)ball(56+rnd(i+200)*198,56+rnd(i+300)*138,6,CGr,'Ar','#fff');g1();TB('+ argon',155,28,GREY,15);}
  if(p>0){ga(sg(p,.4,1));box(290,60,160,110,DGREEN,'#e3f5ee',10);TB('concentrations',370,88,INK,13);TB('inchangées',370,108,INK,13);TB('Q = K',370,138,DGREEN,18);TB('pas de déplacement',370,160,DGREEN,13);g1();}
  else TB('l\'équilibre bouge-t-il ?',370,120,GREY,16);
 }),
 // 8 N2O4 chiffré
 F(function(p){
  TB('N₂O₄ ⇌ 2 NO₂ · ΔH = +57,2 kJ/mol',230,20,INK,15);
  var base=210,k=1.45;
  ctx.fillStyle=CA;ctx.fillRect(40,base-19*k,70,19*k);TB('19 %',75,base-19*k-6,INK,16);TB('298 K · 1 bar',75,base+18,INK,13);TB('Kp = 0,148',75,base+38,GREY,13);
  if(p>0){ga(sg(p,0,.5));ctx.fillStyle=CBc;ctx.fillRect(170,base-89*k,70,89*k);TB('89 %',205,base-89*k-6,INK,16);TB('373 K · 1 bar',205,base+18,INK,13);TB('Kp ≈ 15 bar',205,base+38,GREY,13);g1();
   ga(sg(p,.4,.9));ctx.fillStyle=VIOLET;ctx.fillRect(300,base-66*k,70,66*k);TB('66 %',335,base-66*k-6,INK,16);TB('373 K · 5 bar',335,base+18,INK,13);TB('Kp ≈ 15 bar',335,base+38,GREY,13);g1();
   ga(sg(p,.7,1));TB('T ↑ : α ↑ (endothermique) · P ↑ : α ↓',230,264,DGREEN,15);g1();}
  else TB('α ?',230,120,GREY,34);
  TB('taux de dissociation α',400,60,GREY,13,'right');
 }),
 // 9 CO2 dissous
 F(function(p){
  ctx.fillStyle='#d9ecfa';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(40,70,64,150,10);ctx.fill();ctx.stroke();ctx.fillRect(60,40,24,34);ctx.strokeRect(60,40,24,34);
  for(var i=0;i<9;i++){ga(.9);ball(52+rnd(i)*40,90+((i*29+p*60)%110),3.5,'#fff','',null);g1();}TB('CO₂ · 3,0 atm',72,244,INK,14);
  var X=function(v){return 190+v*80;},Y=function(c){return 220-c*1500;};
  ax(190,220,450,50);TB('p (atm)',450,252,GREY,13,'right');TB('c (mol/L)',196,44,GREY,13,'left');
  LN(190,220,X(3),Y(.102),BLUE,3);DOT(X(3),Y(.102),6,BLUE_D);[1,2,3].forEach(function(v){TB(String(v),X(v),236,GREY,12);});
  if(p>0){ga(sg(p,0,.4));TB('c = 0,034 × 3,0',200,80,INK,14,'left');TB('= 0,102 mol/L ≈ 4,5 g/L',200,102,DRED,14,'left');g1();
   ga(sg(p,.4,1));box(20,258,420,20,DGREEN,'#e3f5ee',6);TB('ouvert : 1,4·10⁻⁵ mol/L → ≈ 1,2 L de CO₂ libérés (0,50 L)',230,273,DGREEN,12);g1();}
  else TB('concentration dissoute ?',350,200,GREY,16);
 })
]);
})();
