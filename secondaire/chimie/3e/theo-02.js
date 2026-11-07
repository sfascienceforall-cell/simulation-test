/* SFA · Chimie 3e · chapitre 02 : théorie animée et devantures */
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
var RUT=null;
function rutPaths(){if(RUT)return RUT;RUT=[];var bs=[-95,-70,-50,-34,-22,-12,-5,-1.5,6,16,28,44,64,88];
 bs.forEach(function(b){var x=-320,y=b,vx=1.6,vy=0,pts=[],k=14;for(var i=0;i<9000;i++){var r2=x*x+y*y,r=Math.sqrt(r2),a=k*1.6*1.6/r2,dt=.25*Math.min(1,r/12);
  vx+=a*x/r*dt;vy+=a*y/r*dt;x+=vx*dt;y+=vy*dt;if(i%6===0)pts.push([x,y]);if(Math.abs(x)>340||Math.abs(y)>230)break;}
  RUT.push(pts);});return RUT;}
function atom(cx,cy,p,n,e,sc,t){ // noyau + électrons
 var r=sc;ctx.strokeStyle='#cfd5db';ctx.lineWidth=1.2;[1,1.9,2.8].forEach(function(f){ctx.beginPath();ctx.arc(cx,cy,r*f,0,7);ctx.stroke();});
 var tot=p+n;for(var i=0;i<tot;i++){var a=i*2.4,d=Math.sqrt(i/tot)*r*.42;DOT(cx+Math.cos(a)*d,cy+Math.sin(a)*d,r*.11,i%2?'#bbb':RED);}
 var sh=[2,8,18],k=0;for(var s=0;s<3&&k<e;s++){var m=Math.min(sh[s],e-k);for(var j=0;j<m;j++){var a2=(t||0)*.02*(1-.25*s)+j*6.283/m+s;DOT(cx+Math.cos(a2)*r*(1+.9*s),cy+Math.sin(a2)*r*(1+.9*s),r*.12,BLUE);}k+=m;}}
function syr(x,y,w,h,pp){ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#d5dae0';ctx.fillRect(x+w,y+h*.3,10,h*.4);LN(x+w+10,y+h/2,x+w+60,y+h/2,INK,5);LN(x,y+h/2,x-34,y+h/2,INK,3);LN(x-34,y+4,x-34,y+h-4,INK,6);}
function flame(cx,y,t){var h=14+4*Math.sin(t*.2);ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(cx-7,y);ctx.quadraticCurveTo(cx-6,y-h/2,cx,y-h);ctx.quadraticCurveTo(cx+6,y-h/2,cx+7,y);ctx.fill();ctx.fillStyle='#f6c445';ctx.beginPath();ctx.moveTo(cx-3,y);ctx.quadraticCurveTo(cx-3,y-h/3,cx,y-h*.6);ctx.quadraticCurveTo(cx+3,y-h/3,cx+3,y);ctx.fill();}

SFA.theo("c02", {
 icon: function () {
  var cy=H*.46;atom(W*.3,cy,5,6,5,22,0);
  TB('→',W*.5,cy+8,GREY,30);
  // modèle particulaire
  for(var i=0;i<12;i++){ball(W*.62+(i%4)*24+((Math.floor(i/4))%2)*0,cy-24+Math.floor(i/4)*24,8,BLUE);}
  TB('particules',W*.69,H*.84,BLUE_D,15);TB('et atome',W*.3,H*.84,ORANGE,15);
  TB('modèles',W*.5,H*.12,INK,19);
 },
 anim: function (t) {
  var P=rutPaths(),cx=W*.58,cy=H*.5,s=Math.min(1,H/300);
  // feuille d'or
  ctx.fillStyle='rgba(222,190,70,.22)';ctx.fillRect(cx-40,H*.05,80,H*.9);
  ctx.strokeStyle=YEL;ctx.lineWidth=1;ctx.strokeRect(cx-40,H*.05,80,H*.9);
  TB('feuille d\'or',cx,H*.04+2,YEL,13);
  // nuage + noyau
  ctx.fillStyle='rgba(55,138,221,.10)';ctx.beginPath();ctx.arc(cx,cy,26,0,7);ctx.fill();
  DOT(cx,cy,3.5,RED);TB('noyau',cx+8,cy-8,DRED,13,'left');
  // canon
  ctx.fillStyle='#888';ctx.fillRect(18,cy-14,40,28);TB('source α',38,cy+32,GREY,13);
  // trajectoires
  P.forEach(function(pts,i){
   var n=pts.length,ph=((t*1.2+i*47)%(n+60)),idx=Math.min(n-1,Math.floor(ph));
   ctx.strokeStyle='rgba(55,138,221,.25)';ctx.lineWidth=1.4;ctx.beginPath();
   for(var q=0;q<n;q++){var X=cx+pts[q][0]*s*1+0,Y=cy+pts[q][1]*s;q?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();
   if(ph<n){var X=cx+pts[idx][0]*s,Y=cy+pts[idx][1]*s;
    var dev=Math.abs(Math.atan2(pts[n-1][1]-pts[n-4][1],pts[n-1][0]-pts[n-4][0]));
    DOT(X,Y,4.5,dev>.9?RED:BLUE);}
  });
  tag('presque toutes traversent',W*.86,H*.2,BLUE_D,14);
  tag('quelques-unes : fortement déviées',W*.8,H*.88,DRED,14);
  TB('un noyau minuscule, chargé +, concentre la masse',W*.5,H*.985,INK,13);
 },
 th:
 '<div class="tcard"><b class="h">Le modèle particulaire</b><p>La matière est faite de <b>particules</b> très petites, <b>séparées par du vide</b> et en <b>mouvement permanent</b>. L\'agitation augmente avec la température.</p><p>• <b>Solide</b> : particules ordonnées, serrées, qui <b>vibrent</b> sur place ; forme et volume propres.<br>• <b>Liquide</b> : désordonnées, serrées, qui <b>glissent</b> les unes sur les autres ; volume propre, forme variable.<br>• <b>Gaz</b> : désordonnées, <b>très éloignées</b>, rapides ; ni forme ni volume propres, compressible.</p><p>La pression d\'un gaz vient des chocs des particules sur les parois : si on chauffe à volume constant, elles vont plus vite, les chocs sont plus forts et plus fréquents, la pression augmente. Pendant un changement d\'état, l\'énergie reçue sert à écarter les particules et non à les agiter : la température reste constante.</p></div>' +
 '<div class="tcard"><b class="h">Des modèles qui évoluent</b><p>Un <b>modèle</b> est une représentation simplifiée qui explique des observations. On le remplace ou on l\'améliore quand une expérience le contredit ; il reste utile dans son domaine.</p><p>• <b>Dalton</b> (début du XIX<sup>e</sup> s.) : atome = sphère pleine, indivisible.<br>• <b>Thomson</b> (1897-1904) : « pudding » : charge positive étalée avec des électrons incrustés.<br>• <b>Rutherford</b> (1911) : feuille d\'or bombardée de particules α. Presque toutes passent, quelques-unes sont très déviées (parfois renvoyées en arrière) : l\'atome est surtout du <b>vide</b>, avec un <b>noyau</b> minuscule, positif, qui concentre la masse. Les électrons tournent autour.<br>• <b>Bohr</b> (1913) : électrons sur des couches (niveaux d\'énergie) précises ; le modèle actuel est un nuage électronique.</p></div>' +
 '<div class="tcard"><b class="h">Les particules de l\'atome</b><p>• <b>Proton</b> : charge +1, masse ≈ 1,67·10<sup>−27</sup> kg (1 u), dans le noyau.<br>• <b>Neutron</b> : charge 0, masse presque identique, dans le noyau.<br>• <b>Électron</b> : charge −1, masse ≈ 9,11·10<sup>−31</sup> kg (environ 1 800 fois moins), dans le nuage autour du noyau.</p><p><code>A = Z + N</code> (nombre de masse = protons + neutrons) · atome neutre : <code>nombre d\'électrons = Z</code> · charge d\'une particule = protons − électrons.</p><p>Ordres de grandeur : atome ≈ 10<sup>−10</sup> m, noyau ≈ 10<sup>−15</sup> m, soit 10<sup>5</sup> fois plus petit : si le noyau était une bille de 1 cm, l\'atome ferait 1 km. Plus de 99,9 % de la masse est dans le noyau.</p></div>' +
 '<div class="tcard"><b class="h">Exemple chiffré</b><p>Sodium Na : Z = 11, A = 23. Protons : 11. Neutrons : 23 − 11 = <b>12</b>. Atome neutre : 11 électrons. Masse des électrons : 11 × 9,11·10<sup>−31</sup> ≈ 1,0·10<sup>−29</sup> kg, contre 23 × 1,67·10<sup>−27</sup> ≈ 3,8·10<sup>−26</sup> kg pour le noyau : les électrons pèsent environ 0,03 % de la masse totale.</p><p><b style="color:#a32d2d">Piège :</b> un électron en plus ou en moins fait un <b>ion</b> (même élément, même Z) ; un neutron en plus fait un isotope. Les protons ne changent jamais sans changer d\'élément.</p></div>'
});

SFA.figs("c02", [
 // 0 trois états
 F(function(p){
  var nm=['solide','liquide','gaz'];
  for(var s=0;s<3;s++){var x=8+s*151,y=40,w=142,h=130;box(x,y,w,h,AX,'#fafcfe',8);
   for(var i=0;i<20;i++){var px,py;
    if(s===0){px=x+22+(i%5)*24.5+Math.sin(i*3)*2;py=y+22+Math.floor(i/5)*26;}
    else if(s===1){px=x+14+rnd(i+s*9)*(w-28);py=y+h*.4+rnd(i+30+s)*(h*.5);px=x+16+((i*29)%108)+(Math.floor(i/5)%2)*8;py=y+h-20-Math.floor(i/5)*21-(i%5)*0+(i%2)*3;}
    else{px=x+14+rnd(i)*(w-28);py=y+14+rnd(i+60)*(h-28);if(i>9)continue;}
    ball(px,py,s===2?7:9,[BLUE,'#5aa0e0','#1a6fc4'][s]);}
   TB(nm[s],x+71,y+h+22,INK,16);
   var a=sg(p,s*.2,s*.2+.3);if(a>0){ga(a);var t=[['ordre · serrées','vibrent'],['désordre · serrées','glissent'],['désordre · éloignées','très rapides']][s];
    TB(t[0],x+71,y+h+42,DGREEN,13);TB(t[1],x+71,y+h+60,DRED,14);
    var ar=[[0,0],[16,5],[26,-14]][s];if(s>0)for(var q=0;q<4;q++){var ax=x+30+q*30,ay=s===1?y+h-34-(q%2)*20:y+30+q*25;A(ax,ay,s===1?14:24,q%2?-9:9,RED,'',2);}
    else for(var q=0;q<3;q++){A(x+22+q*49,y+22,0,0,RED);}
    g1();}}
  TB('Trois états, trois dessins',230,22,BLUE_D,16);
 }),
 // 1 vide entre particules
 F(function(p){
  box(60,50,220,170,INK,'#fafcfe',6);
  for(var i=0;i<9;i++){var px=85+rnd(i)*170,py=75+rnd(i+20)*120;ball(px,py,9,BLUE,'N₂',null);ctx.fillStyle='#fff';}
  TB('gaz de diazote',170,244,INK,15);
  if(p>0){var a=sg(p,0,.6);ga(a);ctx.fillStyle='rgba(120,120,160,.12)';ctx.fillRect(62,52,216,166);
   ctx.strokeStyle=VIOLET;ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.strokeRect(62,52,216,166);ctx.setLineDash([]);
   for(var j=0;j<9;j++){ball(85+rnd(j)*170,75+rnd(j+20)*120,9,BLUE,'N₂');}
   box(300,100,150,90,VIOLET,'#f1efff',12);TB('entre les particules :',375,134,INK,14);TB('du VIDE',375,168,VIOLET,24);g1();
   ctx.strokeStyle=VIOLET;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(300,145);ctx.lineTo(268,130);ctx.stroke();}
  else{TB('?',375,160,GREY,60);}
 }),
 // 2 compter les particules
 F(function(p){
  atom(100,140,11,12,11,22,0);
  TB('Na  Z = 11  A = 23',100,252,INK,15);
  var rows=[['protons',DRED,'11  (= Z)',0],['neutrons',GREY,'23 − 11 = 12',.25],['électrons',BLUE_D,'11  (neutre)',.5],['charge du noyau',DRED,'+11',.75]];
  rows.forEach(function(r,i){var y=70+i*48;DOT(270,y-5,7,r[1]==='#9aa0a6'?'#bbb':(r[1]===DRED?RED:BLUE));TB(r[0],250,y,INK,15,'left');
   var a=sg(p,r[3],r[3]+.25);if(a>0){ga(a);TB(r[2],440,y,r[1]===GREY?INK:r[1],17,'right');g1();}else TB('?',440,y,GREY,17,'right');});
 }),
 // 3 Rutherford
 F(function(p){
  var P=rutPaths();var cx=290,cy=140;
  ctx.fillStyle='rgba(222,190,70,.3)';ctx.fillRect(cx-14,20,28,240);
  TB('or',cx,276,YEL,14);
  ctx.fillStyle='#888';ctx.fillRect(10,cy-12,34,24);
  var idx=[0,1,2,3,4,5,6,7,8,9,10,11,12,13];
  P.forEach(function(pts,i){var n=pts.length;ctx.strokeStyle=(i===6||i===7)?RED:'rgba(55,138,221,.55)';ctx.lineWidth=(i===6||i===7)?2.2:1.4;ctx.beginPath();
   for(var q=0;q<n;q++){var X=cx+pts[q][0]*.55,Y=cy+pts[q][1]*.55;if(X<46)continue;q?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();});
  DOT(cx,cy,3.5,RED);
  TB('9 998 sur 10 000 traversent',150,40,BLUE_D,14);
  TB('2 déviées de plus de 90°',340,262,DRED,14);
  if(p>0){ga(sg(p,0,.6));box(330,40,120,74,DRED,'#fcebeb',10);TB('2 ÷ 10 000',390,68,INK,15);TB('= 0,02 %',390,98,DRED,22);g1();}
 }),
 // 4 contre Thomson
 F(function(p){
  TB('Thomson',110,26,BLUE_D,16);TB('Rutherford',350,26,BLUE_D,16);
  ctx.fillStyle='rgba(226,75,74,.22)';ctx.beginPath();ctx.arc(110,140,80,0,7);ctx.fill();ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.stroke();
  for(var i=0;i<10;i++){var a=rnd(i)*6.28,d=Math.sqrt(rnd(i+9))*68;ball(110+Math.cos(a)*d,140+Math.sin(a)*d,6,BLUE,'−');}
  TB('+ étalé',110,252,DRED,14);
  A(10,140,60,0,BLUE,'',2.4);A(10,100,60,0,BLUE,'',2.4);
  // Rutherford
  ctx.strokeStyle='#d5dae0';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(350,140,80,0,7);ctx.stroke();DOT(350,140,6,RED);TB('+ concentré',350,252,DRED,14);
  for(var j=0;j<4;j++)ball(350+Math.cos(j*1.6+1)*80,140+Math.sin(j*1.6+1)*80,4.5,BLUE);
  var P=rutPaths();[3,6,7,10].forEach(function(k){var pts=P[k];ctx.strokeStyle=(k===6||k===7)?RED:'rgba(55,138,221,.8)';ctx.lineWidth=2;ctx.beginPath();var first=true;pts.forEach(function(q){var X=350+q[0]*.4,Y=140+q[1]*.4;if(X<250)return;first?ctx.moveTo(X,Y):ctx.lineTo(X,Y);first=false;});ctx.stroke();});
  if(p>0){ga(sg(p,0,.5));ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(40,70);ctx.lineTo(180,210);ctx.moveTo(180,70);ctx.lineTo(40,210);ctx.stroke();
   tag('forte déviation observée',350,276,DGREEN,14);g1();}
 }),
 // 5 ordres de grandeur
 F(function(p){
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=2.6;ctx.fillStyle='rgba(55,138,221,.1)';ctx.beginPath();ctx.arc(150,140,105,0,7);ctx.fill();ctx.stroke();
  DOT(150,140,3,RED);
  TB('atome ≈ 10⁻¹⁰ m',150,266,BLUE_D,15);
  LN(150,140,255,140,BLUE_D,1.6,[4,3]);
  TB('noyau ≈ 10⁻¹⁵ m',150,118,DRED,14);A(150,124,0,12,DRED);
  if(p>0){ga(sg(p,0,.5));box(290,60,160,70,DRED,'#fcebeb',10);TB('10⁻¹⁰ ÷ 10⁻¹⁵',370,88,INK,15);TB('= 10⁵ = 100 000',370,116,DRED,18);g1();
   ga(sg(p,.5,1));box(290,150,160,80,GREEN,'#e3f5ee',10);TB('noyau = bille 1 cm',370,178,INK,14);TB('atome = 1 km',370,208,DGREEN,20);g1();}
 }),
 // 6 chauffer un gaz
 F(function(p){
  syr(80,70,230,100,0);var hot=p;
  for(var i=0;i<14;i++){var px=96+rnd(i)*200,py=84+rnd(i+20)*72;ball(px,py,6,hot>0?ORA2:BLUE);
   var v=hot>0?30:12,an=rnd(i+50)*6.28;A(px,py,Math.cos(an)*v,Math.sin(an)*v*.8,hot>0?DRED:BLUE_D,'',2);}
  
  flame(195,230,p*100);flame(165,230,p*100+3);flame(225,230,p*100+6);
  TB('piston bloqué',16,56,GREY,13,'left');
  if(p>0){ga(sg(p,0,.5));tag('plus vite, chocs plus forts et plus fréquents',230,40,DRED,14);box(330,100,120,62,DRED,'#fcebeb',10);TB('pression ↑',390,128,DRED,18);TB('volume fixé',390,150,INK,13);g1();}
  else tag('air à 20 °C',230,40,BLUE_D,14);
 }),
 // 7 tableau de particules
 F(function(p){
  var d=[['Cl','17 p · 18 n · 18 e','−1','Cl⁻'],['Ca','20 p · 20 n · 18 e','+2','Ca²⁺'],['Mg','12 p · 12 n · 10 e','+2','Mg²⁺'],['F','9 p · 10 n · 10 e','−1','F⁻']];
  d.forEach(function(r,i){var x=8+i*113,y=40;box(x,y,106,200,AX,'#fafcfe',8);
   var cl=['#5aa0e0','#E24B4A','#1D9E75','#BA7517'][i];ball(x+53,y+46,28,cl,r[0],'#fff');
   TB(['A = 35, Z = 17','A = 40, Z = 20','A = 24, Z = 12','A = 19, Z = 9'][i],x+53,y+98,INK,13);
   TB(r[1],x+53,y+122,INK,13);
   var a=sg(p,i*.2,i*.2+.3);if(a>0){ga(a);box(x+10,y+140,86,44,r[2][0]==='+'?RED:BLUE,r[2][0]==='+'?'#fcebeb':'#e6f1fb',10);TB(r[3],x+53,y+170,r[2][0]==='+'?DRED:BLUE_D,22);g1();}
   else TB('?',x+53,y+172,GREY,30);});
  TB('Quelle charge ? quel ion ?',230,24,BLUE_D,16);
 }),
 // 8 modèles
 F(function(p){
  var nm=['Dalton','Thomson','Rutherford','Bohr'];
  for(var i=0;i<4;i++){var x=8+i*113,cx=x+53,cy=110;box(x,40,106,160,AX,'#fafcfe',8);TB(nm[i],cx,64,BLUE_D,14);
   if(i===0){ball(cx,cy+6,28,'#bbb');}
   if(i===1){ctx.fillStyle='rgba(226,75,74,.25)';ctx.beginPath();ctx.arc(cx,cy+6,30,0,7);ctx.fill();for(var k=0;k<6;k++)DOT(cx+Math.cos(k*1.1)*18,cy+6+Math.sin(k*1.7)*14,4,BLUE);}
   if(i===2){DOT(cx,cy+6,4,RED);ctx.strokeStyle='#cfd5db';ctx.beginPath();ctx.arc(cx,cy+6,30,0,7);ctx.stroke();DOT(cx+30,cy+6,3.5,BLUE);}
   if(i===3){DOT(cx,cy+6,4,RED);[14,24,34].forEach(function(r,j){ctx.strokeStyle='#cfd5db';ctx.beginPath();ctx.arc(cx,cy+6,r,0,7);ctx.stroke();DOT(cx+Math.cos(j*2)*r,cy+6+Math.sin(j*2)*r,3.5,BLUE);});}
   TB(['1803','1897','1911','1913'][i],cx,188,GREY,13);
   if(i<3){ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+108,118);ctx.lineTo(x+117,118);ctx.stroke();}}
  var a=sg(p,0,.6);if(a>0){ga(a);box(30,216,400,52,DGREEN,'#e3f5ee',12);TB('Un modèle est un outil : il évolue avec les expériences',230,238,DGREEN,15);TB('mais reste valable dans son domaine',230,258,INK,14);g1();}
  else TB('Faut-il oublier Rutherford ?',230,252,INK,16);
 }),
 // 9 palier de l'eau
 F(function(p){
  var X=function(t){return 60+t*38},Y=function(T){return 240-T*1.9};
  LN(52,240,440,240,AX,1.6);LN(52,240,52,34,AX,1.6);TB('t',436,258,GREY,13);TB('T (°C)',58,28,GREY,13,'left');
  TB('100',44,Y(100)+4,GREY,12,'right');TB('0',44,244,GREY,12,'right');
  LN(52,Y(100),440,Y(100),GREY,1,[4,4]);
  ctx.strokeStyle=INK;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(X(0),Y(20));ctx.lineTo(X(2),Y(100));ctx.lineTo(X(9.5),Y(100));ctx.stroke();
  TB('liquide',X(1),Y(100)+30,BLUE_D,13);TB('gaz',X(8.6),Y(100)+30,RED,13);
  if(p>0){var a=sg(p,0,.7);ctx.strokeStyle=RED;ctx.lineWidth=6;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(X(2),Y(100));ctx.lineTo(X(2+7.5*a),Y(100));ctx.stroke();ctx.globalAlpha=1;
   ga(sg(p,.4,1));TB('E = 100 × 2 260 = 226 kJ',250,Y(100)-10,DRED,15);box(170,150,200,56,DRED,'#fcebeb',10);TB('t = 226 000 ÷ 500',270,174,INK,15);TB('= 452 s ≈ 7,5 min',270,198,DRED,18);g1();}
 }),
 // 10 masse de l'atome
 F(function(p){
  TB('masse des nucléons',30,64,INK,15,'left');TB('masse des électrons',30,150,INK,15,'left');
  ctx.fillStyle=RED;ctx.fillRect(30,76,400,32);TB('3,84·10⁻²⁶ kg',230,98,'#fff',16);
  var w=400*(1.0e-29/3.84e-26);ctx.fillStyle=BLUE;ctx.fillRect(30,162,Math.max(2,w),32);
  TB('1,00·10⁻²⁹ kg',60,214,BLUE_D,15,'left');LN(33,196,33,205,BLUE,1.5);
  if(p>0){ga(sg(p,0,.6));box(180,226,260,44,DRED,'#fcebeb',10);TB('électrons ≈ 0,03 % de la masse',310,254,DRED,15);g1();}
  else TB('où est la masse ?',320,254,GREY,15);
 })
]);
})();
