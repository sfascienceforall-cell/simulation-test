/* SFA · Chimie 5e · chapitre 08 : théorie animée et devantures */
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
var CA='#4a90d9',CBc='#e08a3c';
function fr(x,y,num,den,col,sz){var w=Math.max(num.length,den.length)*sz*.56+8;TB(num,x,y-5,col,sz);LN(x-w/2,y,x+w/2,y,col,2);TB(den,x,y+sz+3,col,sz);}
function bar(x,base,w,h,col,lab,val,sz){ctx.fillStyle=col;ctx.fillRect(x,base-h,w,h);TB(val,x+w/2,base-h-6,INK,sz||13);TB(lab,x+w/2,base+17,INK,sz||13);}
function ax(x0,y0,x1,y1){LN(x0,y0,x1,y0,AX,1.6);LN(x0,y0,x0,y1,AX,1.6);}
SFA.theo("c08", {
 icon: function () {
  TB('K = [C]ᶜ[D]ᵈ',W*.5,H*.3,BLUE_D,28);LN(W*.28,H*.38,W*.72,H*.38,BLUE_D,2.5);TB('[A]ᵃ[B]ᵇ',W*.5,H*.58,BLUE_D,28);TB('A + B ⇌ C + D',W*.5,H*.85,ORANGE,19);
 },
 anim: function (t) {
  var u=(t%660)/660,s=u*7,tau=.9,Bq=.75*(1-Math.exp(-s/tau)),Bf=Math.min(Bq,.75),A=1-Bf,Q=Bf/Math.max(A,.001);
  var gx=W*.07,gw=W*.5,gy=H*.1,gh=H*.56,gb=gy+gh;
  LN(gx,gb,gx+gw,gb,AX,1.6);LN(gx,gb,gx,gy,AX,1.6);TB('temps',gx+gw,gb+18,GREY,13,'right');TB('concentration',gx+4,gy-4,GREY,13,'left');
  var xe=gx+gw*(.9/ 7*1.7);
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();var i;for(i=0;i<=Math.min(s,7)*40;i++){var ss=i/40,b=.75*(1-Math.exp(-ss/tau)),x=gx+gw*ss/7,y=gb-gh*(1-b)*.95;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  ctx.strokeStyle=ORANGE;ctx.beginPath();for(i=0;i<=s*40;i++){var s2=i/40,b2=.75*(1-Math.exp(-s2/tau)),x2=gx+gw*s2/7,y2=gb-gh*b2*.95;i?ctx.lineTo(x2,y2):ctx.moveTo(x2,y2);}ctx.stroke();
  DOT(gx+gw*s/7,gb-gh*(1-Bf)*.95,5,BLUE_D);DOT(gx+gw*s/7,gb-gh*Bf*.95,5,ORA2);
  TB('[A]',gx+gw+4,gb-gh*.25*.95+4,BLUE_D,15,'left');TB('[B]',gx+gw+4,gb-gh*.75*.95+4,ORA2,15,'left');
  var px=W*.68,pw=W*.27,py=H*.14,ph=H*.46,N=40;
  ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(px,py,pw,ph);
  for(i=0;i<N;i++){var r=u<.55?rnd(i):rnd(i*3+Math.floor(t/40));var isB=r<Bf/.75*.75+(u<.55?0:0);
   var xx=px+8+rnd(i+80)*(pw-16)+Math.sin(t*.05+i)*3,yy=py+8+rnd(i+120)*(ph-16)+Math.cos(t*.04+i*2)*3;
   ball(xx,yy,5.5,isB?CBc:CA,'',null);}
  TB('● A  ● B',px+pw/2,py+ph+20,GREY,13);
  var eq=Math.abs(Q-3)<.08;
  TB('Q = [B] ÷ [A] = '+(Q).toFixed(1).replace('.',',')+'   ·   K = 3,0',W*.5,H*.95,eq?DGREEN:INK,19);
  TB(eq?'Q = K : équilibre dynamique (les particules changent de couleur)':'Q < K : évolution vers la droite (produits)',W*.5,H*.84,eq?DGREEN:DRED,16);
 },
 th:
 '<div class="tcard"><b class="h">Réaction complète ou équilibre</b><p>Certaines réactions s\'arrêtent quand un réactif est épuisé (complètes). D\'autres sont <b>limitées</b> : réactifs et produits coexistent. On écrit alors <code>⇌</code>. À l\'<b>équilibre chimique</b>, la réaction directe et la réaction inverse se poursuivent à la <b>même vitesse</b> : les concentrations restent constantes mais rien n\'est « arrêté » : l\'équilibre est <b>dynamique</b>.</p></div>' +
 '<div class="tcard"><b class="h">Constante d\'équilibre K</b><p>Pour <code>a A + b B ⇌ c C + d D</code> : <code>K = [C]ᶜ·[D]ᵈ ÷ ([A]ᵃ·[B]ᵇ)</code> (concentrations à l\'équilibre en mol/L, coefficients en exposants). Exemples : N₂O₄ ⇌ 2 NO₂ : K = [NO₂]² ÷ [N₂O₄] ; N₂ + 3 H₂ ⇌ 2 NH₃ : K = [NH₃]² ÷ ([N₂][H₂]³).</p><p>Les solides et le <b>solvant</b> (l\'eau, ~55 mol/L, quasi constante) n\'apparaissent pas : pour CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺, K = [CH₃COO⁻][H₃O⁺] ÷ [CH₃COOH]. <b>K ne dépend que de la température</b>, pas des quantités de départ.</p><p>Exemple : 2 NO₂ ⇌ N₂O₄ avec [NO₂] = 0,20 et [N₂O₄] = 0,40 mol/L : K = 0,40 ÷ 0,20² = 10.</p></div>' +
 '<div class="tcard"><b class="h">Quotient Q : dans quel sens ça évolue ?</b><p>Q a la même forme que K mais avec les concentrations du moment. <b>Q &lt; K</b> : trop de réactifs, évolution vers la <b>droite</b> (produits). <b>Q &gt; K</b> : évolution vers la <b>gauche</b>. <b>Q = K</b> : équilibre. Exemple : H₂ + I₂ ⇌ 2 HI, K = 50, [H₂] = [I₂] = 0,50 et [HI] = 2,0 : Q = 2,0² ÷ (0,50 × 0,50) = 16 &lt; 50 : vers la droite.</p><p><b style="color:#a32d2d">Piège :</b> K grand (2·10⁵) = produits largement majoritaires à l\'équilibre (réaction quasi complète), mais cela ne dit <b>rien sur la vitesse</b>.</p></div>' +
 '<div class="tcard"><b class="h">Calculer un équilibre</b><p><b>Méthode :</b> tableau d\'avancement (x), exprimer chaque concentration, écrire K, résoudre. H₂ + I₂ ⇌ 2 HI avec 1,0 mol/L de chaque (K = 50) : K = (2x)² ÷ (1 − x)² = 50 → 2x ÷ (1 − x) = 7,07 → x = 0,78 : [HI] = 1,56 et [H₂] = [I₂] = 0,22 mol/L. Si l\'équation est du second degré, on retient la racine physique (0 &lt; x &lt; réactif limitant).</p><p>Estérification (K = 4) : avec 1 mol d\'acide + 1 mol d\'alcool, 0,67 mol d\'ester (67 %) ; avec 2 mol d\'alcool, 0,845 mol (≈ 85 %) : un excès de réactif améliore le rendement.</p></div>'
});
SFA.figs("c08", [
 // 0 expression de K
 F(function(p){
  var Q=[['N₂O₄ ⇌ 2 NO₂','[NO₂]²','[N₂O₄]'],['N₂ + 3 H₂ ⇌ 2 NH₃','[NH₃]²','[N₂][H₂]³'],['H₂ + I₂ ⇌ 2 HI','[HI]²','[H₂][I₂]']];
  Q.forEach(function(q,i){var y=56+i*84;box(8,y-40,444,72,AX,'#fff',10);TB(q[0],20,y+8,INK,17,'left');
   if(p>0){ga(sg(p,i*.2,i*.2+.35));TB('K =',290,y+8,DGREEN,18);fr(375,y+2,q[1],q[2],DGREEN,16);g1();}else TB('K = ?',340,y+8,GREY,22);});
 }),
 // 1 calculer K
 F(function(p){
  TB('2 NO₂ ⇌ N₂O₄',230,30,INK,20);
  bar(110,200,70,.20*300,CBc,'NO₂','0,20 mol/L');bar(260,200,70,.40*300,CA,'N₂O₄','0,40 mol/L');
  if(p>0){ga(sg(p,0,.5));box(340,70,112,100,DGREEN,'#e3f5ee',10);TB('K = [N₂O₄]',396,96,INK,14);TB('÷ [NO₂]²',396,116,INK,14);TB('0,40 ÷ 0,04',396,142,INK,14);TB('= 10',396,164,DGREEN,18);g1();}
  else TB('K = ?',396,120,GREY,26);
 }),
 // 2 sens d'évolution
 F(function(p){
  TB('H₂ + I₂ ⇌ 2 HI',230,28,INK,20);
  var X=function(v){return 40+v*6.8;};LN(40,150,440,150,AX,2);for(var v=0;v<=60;v+=10){LN(X(v),145,X(v),155,AX,1.4);TB(String(v),X(v),174,GREY,13);}
  DOT(X(16),150,9,ORANGE);TB('Q = 16',X(16),122,ORA2,17);DOT(X(50),150,9,BLUE_D);TB('K = 50',X(50),122,BLUE_D,17);
  TB('[H₂] = [I₂] = 0,50 · [HI] = 2,0 mol/L',230,70,GREY,14);
  if(p>0){ga(sg(p,0,.5));A(X(16)+12,150,X(50)-X(16)-26,0,RED,'',4);g1();ga(sg(p,.4,1));box(60,200,340,60,DGREEN,'#e3f5ee',12);TB('Q < K : évolution vers la droite',230,226,DGREEN,18);TB('Q = 2,0² ÷ (0,50 × 0,50) = 16',230,250,INK,14);g1();}
  else TB('Q ? K',230,230,GREY,24);
 }),
 // 3 équilibre dynamique
 F(function(p){
  var X=function(v){return 50+v*250;},Y=function(v){return 210-v*170;};
  ax(50,210,430,20);TB('temps',430,232,GREY,13,'right');TB('vitesse',58,18,GREY,13,'left');
  var vd=function(x){return .4+.6*Math.exp(-4*x);},vi=function(x){return .4*(1-Math.exp(-4*x));};
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();for(var x=0;x<=1.5;x+=.02){var px=X(x),py=Y(vd(x));x?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  ctx.strokeStyle=ORANGE;ctx.beginPath();for(x=0;x<=1.5;x+=.02){px=X(x);py=Y(vi(x));x?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  TB('réaction directe',200,Y(.95),BLUE_D,14,'left');TB('réaction inverse',210,Y(.2),ORA2,14,'left');
  if(p>0){ga(sg(p,0,.5));LN(X(1.05),20,X(1.05),210,GREY,1.6,[4,4]);TB('équilibre',X(1.05)+6,40,GREY,14,'left');TB('vd = vi',X(1.35),Y(.4)-10,DGREEN,16);g1();
   ga(sg(p,.5,1));box(80,236,300,34,DGREEN,'#e3f5ee',8);TB('les deux réactions continuent',230,259,DGREEN,16);g1();}
  else TB('que se passe-t-il à l\'équilibre ?',250,262,GREY,16);
 }),
 // 4 H2 + I2
 F(function(p){
  var k=75,base=204;TB('H₂ + I₂ ⇌ 2 HI · K = 50',230,24,INK,18);
  TB('départ',70,52,GREY,14);bar(30,base,30,1.0*k,CA,'H₂','1,0',13);bar(66,base,30,1.0*k,CBc,'I₂','1,0',13);bar(102,base,30,2,GREY,'HI','0',13);
  if(p>0){ga(sg(p,0,.6));TB('équilibre',310,52,GREY,14);bar(220,base,38,.22*k,CA,'H₂','0,22',13);bar(268,base,38,.22*k,CBc,'I₂','0,22',13);bar(316,base,38,1.56*k,VIOLET,'HI','1,56',13);g1();
   ga(sg(p,.5,1));box(30,232,400,40,DGREEN,'#e3f5ee',8);TB('(2x)² ÷ (1 − x)² = 50 → x = 0,78',230,258,DGREEN,16);g1();}
  else TB('équilibre ?',310,130,GREY,24);
 }),
 // 5 K très grand
 F(function(p){
  TB('K = 2·10⁵',230,34,BLUE_D,30);
  ctx.fillStyle='#8a9096';ctx.beginPath();ctx.moveTo(220,190);ctx.lineTo(240,190);ctx.lineTo(230,170);ctx.fill();LN(60,170,400,170,INK,3);
  ctx.fillStyle=ORANGE;ctx.fillRect(310,100,70,70);ctx.fillStyle=CA;ctx.fillRect(80,160,60,10);TB('produits',345,92,INK,14);TB('réactifs',110,150,INK,14);
  if(p>0){ga(sg(p,0,.5));TB('produits largement majoritaires',230,222,DGREEN,16);g1();
   ga(sg(p,.5,1));box(60,236,340,36,DRED,'#fcebeb',10);TB('K ne dit rien de la vitesse (⏱ ?)',230,260,DRED,16);g1();}
  else TB('« K grand = réaction rapide » ?',230,240,GREY,18);
 }),
 // 6 NO2 / N2O4 second degré
 F(function(p){
  TB('2 NO₂ ⇌ N₂O₄ · K ≈ 220',230,26,INK,18);
  ctx.fillStyle='rgba(150,80,30,.75)';ctx.fillRect(40,70,100,100);ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(40,70,100,100);TB('1,00 mol NO₂',90,196,INK,14);
  A(150,120,50,0,GREY,'',3);
  ctx.fillStyle=p>0?'rgba(150,80,30,.12)':'rgba(150,80,30,.5)';ctx.fillRect(210,70,100,100);ctx.strokeRect(210,70,100,100);
  if(p>0){ga(sg(p,0,.5));TB('[NO₂] ≈ 0,047',260,196,CBc,14);TB('[N₂O₄] ≈ 0,48',260,216,CA,14);g1();
   ga(sg(p,.4,1));box(326,70,126,100,DGREEN,'#e3f5ee',10);TB('K = x ÷ (1 − 2x)²',389,96,INK,13);TB('880x² − 881x',389,120,INK,14);TB('+ 220 = 0',389,140,INK,14);TB('x ≈ 0,48',389,162,DGREEN,16);g1();}
  else TB('concentrations ?',260,200,GREY,16);
 }),
 // 7 que mettre dans K
 F(function(p){
  TB('CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺',230,30,INK,17);
  var a=p>0?sg(p,0,.5):0;
  ga(1-a);TB('K =',60,130,GREY,22);fr(250,126,'[CH₃COO⁻][H₃O⁺]','[CH₃COOH][H₂O]',INK,18);g1();
  if(p>0){ga(a);TB('K =',60,130,DGREEN,22);fr(250,126,'[CH₃COO⁻][H₃O⁺]','[CH₃COOH]',DGREEN,18);g1();
   ga(sg(p,.4,1));box(40,196,380,66,DRED,'#fcebeb',12);TB('[H₂O] ≈ 55 mol/L, constante : le solvant',230,224,DRED,15);TB('n\'apparaît pas dans K',230,248,DRED,15);g1();}
  else TB('quelle expression ?',230,240,GREY,18);
 }),
 // 8 ajouter du produit
 F(function(p){
  var k=46,base=190,Y=function(v){return base-v*k;};TB('A ⇌ B · K = 3,0',230,24,INK,18);
  bar(30,base,32,.5*k,CA,'A','0,50',13);bar(68,base,32,1.5*k,CBc,'B','1,5',13);TB('équilibre',84,222,GREY,14);
  if(p>0){ga(sg(p,0,.4));bar(176,base,32,.5*k,CA,'A','0,50',13);bar(214,base,32,2.5*k,CBc,'B','2,5',13);TB('+ 1,0 mol/L de B',195,222,DRED,14);g1();
   ga(sg(p,.6,1));bar(322,base,32,.75*k,CA,'A','0,75',13);bar(360,base,32,2.25*k,CBc,'B','2,25',13);TB('nouvel équilibre',356,222,DGREEN,14);g1();
   ga(sg(p,.3,.7));A(256,100,52,0,DRED,'',3);g1();TB('Q = 2,5 ÷ 0,50 = 5,0 > K : vers la gauche',230,258,DRED,15);}
  else TB('Q ? vers où ?',330,110,GREY,22);
 }),
 // 9 estérification
 F(function(p){
  TB('acide + alcool ⇌ ester + eau · K = 4,0',230,24,INK,16);
  var base=210,k=1.5;
  ctx.fillStyle=CA;ctx.fillRect(90,base-66.7*k,80,66.7*k);TB('67 %',130,base-66.7*k-6,INK,16);TB('1 mol + 1 mol',130,base+20,INK,14);TB('0,67 mol d\'ester',130,base+40,GREY,13);
  if(p>0){ga(sg(p,0,.6));ctx.fillStyle=CBc;ctx.fillRect(280,base-84.5*k,80,84.5*k);TB('≈ 85 %',320,base-84.5*k-6,INK,16);TB('1 mol + 2 mol',320,base+20,INK,14);TB('0,845 mol d\'ester',320,base+40,GREY,13);g1();
   ga(sg(p,.5,1));box(20,236,420,34,DGREEN,'#e3f5ee',8);TB('un excès d\'alcool améliore le rendement',230,259,DGREEN,15);g1();}
  else TB('avec 2 mol d\'alcool ?',320,140,GREY,20);
 })
]);
})();
