/* SFA · Chimie 3e · chapitre 01 : théorie animée et devantures */
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
function strip(x,w,top,base,col){ctx.fillStyle='#fbf8ef';ctx.strokeStyle=GREY;ctx.lineWidth=1.5;ctx.fillRect(x,top,w,base-top+14);ctx.strokeRect(x,top,w,base-top+14);}
function spot(x,y,r,col){ctx.fillStyle=col;ctx.globalAlpha=.85;ctx.beginPath();ctx.ellipse(x,y,r,r*.8,0,0,7);ctx.fill();ctx.globalAlpha=1;}
function funnel(cx,top,apex,w){ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx-w/2,top);ctx.lineTo(cx-4,apex);ctx.lineTo(cx-4,apex+16);ctx.moveTo(cx+w/2,top);ctx.lineTo(cx+4,apex);ctx.lineTo(cx+4,apex+16);ctx.stroke();}
function paper(cx,top,mid,w){ctx.strokeStyle=ORANGE;ctx.lineWidth=2;ctx.setLineDash([5,3]);ctx.beginPath();ctx.moveTo(cx-w/2+8,top+6);ctx.lineTo(cx,mid);ctx.lineTo(cx+w/2-8,top+6);ctx.stroke();ctx.setLineDash([]);}
function flask(cx,cy,r,lvl,col){ctx.fillStyle=col||'#cfe6f8';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.save();ctx.clip();ctx.fillRect(cx-r,cy+r-2*r*lvl,2*r,2*r*lvl);ctx.restore();
 ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(cx,cy,r,-1.2,PI+1.2-PI+PI,false);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
 ctx.fillStyle='#fff';ctx.fillRect(cx-9,cy-r-8,18,14);ctx.strokeStyle=INK;ctx.beginPath();ctx.moveTo(cx-9,cy-r-18);ctx.lineTo(cx-9,cy-r+4);ctx.moveTo(cx+9,cy-r-18);ctx.lineTo(cx+9,cy-r+4);ctx.stroke();}
function flame(cx,y,t){var h=14+4*Math.sin(t*.2);ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(cx-7,y);ctx.quadraticCurveTo(cx-6,y-h/2,cx,y-h);ctx.quadraticCurveTo(cx+6,y-h/2,cx+7,y);ctx.fill();ctx.fillStyle='#f6c445';ctx.beginPath();ctx.moveTo(cx-3,y);ctx.quadraticCurveTo(cx-3,y-h/3,cx,y-h*.6);ctx.quadraticCurveTo(cx+3,y-h/3,cx+3,y);ctx.fill();}

SFA.theo("c01", {
 icon: function () {
  var cx=W*.5, y=H*.4;
  // mélange à gauche
  var x0=W*.12;
  ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(x0,y-42,76,84);
  var cs=[BLUE,ORA2,GREEN];
  for(var i=0;i<18;i++){DOT(x0+10+rnd(i)*56,y-32+rnd(i+40)*64,5,cs[i%3]);}
  A(x0+90,y,50,0,GREY,'',3);
  // trois corps purs
  for(var k=0;k<3;k++){var bx=W*.5+k*(W*.14)+8;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(bx,y-30+k*0,50,60);
   for(var j=0;j<7;j++)DOT(bx+9+rnd(j+k*9)*32,y-20+rnd(j+k*9+5)*40,5,cs[k]);}
  TB('mélange',x0+38,y+64,BLUE_D,15);TB('corps purs',W*.5+W*.14+33,y+64,ORANGE,15);
  TB('séparer pour identifier',W*.5,H*.88,INK,19);
 },
 anim: function (t) {
  var cx=W*.42,top=H*.1,apex=H*.5,fw=Math.min(W*.34,230),yF=H*.34;
  funnel(cx,top,apex,fw);
  // papier filtre
  paper(cx,top,apex-2,fw*.78);
  // verre récepteur
  var gw=70,gx=cx-gw/2,gy=H*.6,gh=H*.25;
  var accu=0;
  // grains de sable (retenus)
  var N=9;
  for(var i=0;i<N;i++){var per=300,u=((t+i*(per/N))%per)/per,sx=cx-fw*.3+rnd(i)*fw*.6;
   var fy=apex-14-(i%4)*5-Math.floor(i/4)*0, rx=cx-22+(i%5)*11;
   var y=top+10+(fy-top-10)*Math.min(1,u/.5),x=sx+(rx-sx)*Math.min(1,u/.5);
   ga(u>.85?(1-u)/.15:1);ball(x,y,5.5,'#d4a94a');g1();}
  // eau + sel dissous (passent)
  var M=26;
  for(var j=0;j<M;j++){var per2=260,u2=((t+j*(per2/M))%per2)/per2,xs=cx-fw*.34+rnd(j+60)*fw*.68;
   var xx=cx+(xs-cx)*(1-sg(u2,.15,.5))*.85+Math.sin(u2*9+j)*2,yy=top+8+(gy+gh-8-top-8)*u2;
   if(yy<apex-4&&Math.abs(xx-cx)>fw/2*(1-(yy-top)/(apex-top))+0)xx=cx+(xx-cx)*.7;
   ga(u2<.06?u2/.06:1);
   if(j%4===0){DOT(xx,yy,3.2,j%8===0?VIOLET:ORA2);}else DOT(xx,yy,2.6,BLUE);
   g1();}
  glass(gx,gy,gw,gh,.28+.12*Math.sin(t*.02)*0,'#cfe6f8');
  // légende
  var lx=W*.68;
  ball(lx,H*.2,6,'#d4a94a');TB('sable : grains trop gros',lx+14,H*.2+5,INK,14,'left');TB('→ retenus par le filtre',lx+14,H*.2+23,DRED,14,'left');
  DOT(lx,H*.48,3,BLUE);DOT(lx+8,H*.48,3.2,VIOLET);TB('eau + sel dissous',lx+22,H*.48+5,INK,14,'left');TB('→ traversent',lx+22,H*.48+23,DGREEN,14,'left');
  TB('On exploite une différence de TAILLE',W*.5,H*.97,BLUE_D,15);
 },
 th:
 '<div class="tcard"><b class="h">Corps pur ou mélange ?</b><p>Un <b>corps pur</b> ne contient qu\'une seule espèce de particules (eau distillée, sucre, fer, dioxygène). Un <b>mélange</b> en contient plusieurs. Dans un mélange <b>homogène</b> on ne distingue qu\'une seule phase à l\'œil (eau salée, air, eau minérale, sirop) ; dans un mélange <b>hétérogène</b> on voit plusieurs phases ou constituants (eau + huile, sable + eau, lait vu au microscope).</p><p><b style="color:#a32d2d">Piège :</b> « transparent », « naturel » ou « minéral » ne veut pas dire « pur ». Une eau claire peut contenir beaucoup de sels dissous.</p></div>' +
 '<div class="tcard"><b class="h">Les techniques de séparation</b><p>On choisit la technique d\'après ce qui <b>distingue</b> les constituants :</p><p>• <b>Tri / aimant</b> : grains visibles, ou fer attiré par un aimant.<br>• <b>Filtration</b> : solide non dissous (grains plus gros que les pores du filtre) + liquide.<br>• <b>Décantation</b> : liquides non miscibles ou solide qui se dépose ; la différence de <b>masse volumique</b> fait le travail.<br>• <b>Évaporation</b> : récupérer un solide dissous ; l\'eau est perdue.<br>• <b>Distillation</b> : séparer les liquides d\'un mélange par leurs <b>températures d\'ébullition</b> ; on récupère aussi le liquide (condensation).<br>• <b>Chromatographie</b> : séparer des substances dissoutes (colorants) par leur <b>vitesse de migration</b> sur un support.</p><p>Un sel <b>dissous</b> traverse un filtre : on ne le retient que par évaporation ou distillation.</p></div>' +
 '<div class="tcard"><b class="h">Identifier un corps pur : ses constantes physiques</b><p>Un corps pur a des constantes bien définies : <b>température de fusion</b>, <b>température d\'ébullition</b>, <b>masse volumique</b>. Sous pression normale, l\'eau fond à 0 °C et bout à 100 °C ; l\'éthanol bout à 78 °C.</p><p>• Pendant un changement d\'état d\'un <b>corps pur</b>, la température reste <b>constante</b> : c\'est un <b>palier</b>.<br>• Pour un <b>mélange</b>, la température continue à monter pendant le changement d\'état.</p><p>Chromatographie : <code>R<sub>f</sub> = d(tache) ÷ d(front du solvant)</code>, sans unité. R<sub>f</sub> dépend du colorant et du solvant, pas de la hauteur du front : des taches de même R<sub>f</sub> = même colorant.</p></div>' +
 '<div class="tcard"><b class="h">Exemple chiffré</b><p>Le solvant a parcouru 8,0 cm ; une tache se trouve à 6,0 cm de la ligne de dépôt. R<sub>f</sub> = 6,0 ÷ 8,0 = <b>0,75</b>. Avec un front à 10,0 cm, cette même tache serait à 0,75 × 10,0 = 7,5 cm.</p><p>Eau de mer à 35 g/L : 0,5 L contient 35 × 0,5 = <b>17,5 g</b> de sel. La filtration ne le retient pas ; la distillation recueille l\'eau pure et laisse le sel dans le ballon.</p><p><b style="color:#0f6e56">Méthode :</b> 1) qu\'est-ce qui diffère entre les constituants (taille, solubilité, densité, T d\'ébullition, vitesse) ? 2) choisis la technique qui exploite cette différence ; 3) enchaîne les étapes dans le bon ordre.</p></div>'
});

SFA.figs("c01", [
 // 0 corps pur ou mélange
 F(function(p){
  var names=['eau distillée','air','eau de mer','sucre','lait'],pur=[1,0,0,1,0];
  for(var i=0;i<5;i++){var x=6+i*91,y=44,w=82,h=120;box(x,y,w,h,AX,'#fafcfe',6);
   for(var k=0;k<16;k++){var px=x+11+rnd(k+i*20)*(w-22),py=y+11+rnd(k+i*20+7)*(h-22);
    if(i===0)ball(px,py,6,BLUE);
    else if(i===1){ball(px,py,5.5,k<11?BLUE:(k<14?RED:GREEN));}
    else if(i===2){if(k<12)ball(px,py,4.5,'#9cc7ee');else ball(px,py,5.5,k%2?VIOLET:ORA2);}
    else if(i===3){ctx.fillStyle=ORANGE;ctx.fillRect(px-5,py-5,10,10);}
    else{ctx.fillStyle='#eef0f2';ctx.strokeStyle=GREY;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(px,py,k%3?7:10,0,7);ctx.fill();ctx.stroke();}
   }
   TB(names[i],x+w/2,y+h+22,INK,14);
   var a=sg(p,i*.1,i*.1+.3);if(a>0){ga(a);var c=pur[i]?DGREEN:DRED;box(x+3,y+h+34,w-6,26,c,pur[i]?'#e3f5ee':'#fcebeb',13);TB(pur[i]?'corps pur':'mélange',x+w/2,y+h+52,c,14);g1();}}
  TB('Combien de sortes de particules ?',230,24,BLUE_D,16);
 }),
 // 1 sable et eau
 F(function(p){
  glass(40,100,90,110,.7,'#cfe6f8');
  for(var i=0;i<26;i++){var x=48+rnd(i)*74,y=170+rnd(i+30)*34;DOT(x,y,3.6,'#d4a94a');}
  for(var i=0;i<10;i++){DOT(52+rnd(i+90)*66,118+rnd(i+70)*40,2,'#b9d6ef');}
  TB('sable + eau',85,236,INK,14);
  A(140,130,60,0,GREY,'',3);
  funnel(240,50,130,110);paper(240,50,128,110);
  var gl=sg(p,.2,.7);
  glass(210,180,60,62,.18+.42*gl,'#d9ecfa');
  // gouttes
  if(p>.05&&p<.99){for(var d=0;d<3;d++){var u=((p*3+d/3)%1);DOT(240,150+u*60,2.6,BLUE);}}
  // sable retenu
  var sa=sg(p,0,.4);
  ctx.fillStyle='#d4a94a';ctx.globalAlpha=Math.max(.15,sa);ctx.beginPath();ctx.moveTo(222,112);ctx.lineTo(240,127);ctx.lineTo(258,112);ctx.quadraticCurveTo(240,100,222,112);ctx.fill();g1();
  A(150,130,0,0,GREY);
  TB('filtre',240,36,ORANGE,14);
  if(p>.6){ga(sg(p,.6,.9));tag('sable retenu',360,100,DRED,15);tag('eau claire',340,214,DGREEN,15);chk(414,214,DGREEN,9);
   box(300,130,150,34,BLUE_D,'#eef4fb',17);TB('La filtration',375,152,BLUE_D,16);g1();}
  else{TB('?',360,160,GREY,40);}
 }),
 // 2 rapport frontal
 F(function(p){
  var k=24,base=245;
  function st(x,front,sp){strip(x,80,base-front*k-14,base,0);LN(x-8,base,x+88,base,INK,1.5,[4,3]);TB('ligne de dépôt',x+40,base+14,GREY,13);
   LN(x,base-front*k,x+80,base-front*k,BLUE,2,[5,3]);TB('front '+String(front.toFixed(1)).replace('.',',')+' cm',x+40,base-front*k-6,BLUE_D,13);
   spot(x+40,base-sp*k,9,RED);}
  st(34,6,3.6);
  // règle
  LN(26,base,26,base-6*k,GREY,1.2);for(var c=0;c<=6;c++){LN(22,base-c*k,26,base-c*k,GREY,1.2);}
  var a=sg(p,0,.4);
  if(a>0){ga(a);A(150,base,0,-3.6*k*a,RED,'',2.4);TB('3,6 cm',136,base-1.8*k,DRED,13,'right');g1();}
  var b2=sg(p,.4,.8);
  st(210,8,4.8);ga(1);
  ctx.globalAlpha=1;
  if(p<.4){ctx.fillStyle='rgba(255,255,255,.85)';ctx.fillRect(196,10,110,260);TB('même encre,',251,140,GREY,13);TB('front à 8,0 cm ?',251,158,GREY,13);}
  TB('Rf = 3,6 ÷ 6,0',380,60,INK,15);
  if(p>.15){ga(sg(p,.15,.4));TB('= 0,60',380,84,DRED,20);g1();}
  if(p>.5){ga(sg(p,.5,.8));TB('Rf ne change pas',380,130,BLUE_D,14);TB('0,60 × 8,0 cm',380,160,INK,14);TB('= 4,8 cm',380,184,DRED,18);g1();}
 }),
 // 3 palier
 F(function(p){
  var X=function(t){return 60+t*50},Y=function(T){return 240-T*2};
  LN(52,240,440,240,AX,1.6);LN(52,240,52,34,AX,1.6);
  TB('t (min)',430,262,GREY,13,'right');TB('T (°C)',58,28,GREY,13,'left');
  for(var t=0;t<=7;t++){LN(X(t),240,X(t),245,GREY,1);TB(String(t),X(t),258,GREY,12);}
  [[100,'eau 100 °C','right',BLUE],[78,'éthanol 78 °C','left',GREEN],[56,'acétone 56 °C','left',ORANGE]].forEach(function(r){
   LN(52,Y(r[0]),440,Y(r[0]),r[3],1.2,[5,4]);TB(r[1],r[2]==='right'?436:62,Y(r[0])-5,r[3]===GREEN?DGREEN:(r[3]===BLUE?BLUE_D:ORANGE),13,r[2]);});
  var pts=[[0,20],[1,35],[2,50],[3,65],[4,78],[5,78],[6,78],[7,78]];
  ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1]));});ctx.stroke();
  pts.forEach(function(q){DOT(X(q[0]),Y(q[1]),4.5,INK);});
  if(p>0){var a=sg(p,0,.5);ctx.strokeStyle=RED;ctx.lineWidth=6;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(X(4),Y(78));ctx.lineTo(X(4+3*a),Y(78));ctx.stroke();ctx.globalAlpha=1;
   if(a>.9){tag('palier à 78 °C',X(5.5),Y(78)+30,DRED,15);tag('= éthanol',X(5.5),Y(78)+54,DGREEN,15);}}
 }),
 // 4 eau minérale
 F(function(p){
  // bouteille
  ctx.fillStyle='#dcecf8';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(86,46);ctx.lineTo(86,70);ctx.quadraticCurveTo(52,90,52,120);ctx.lineTo(52,246);ctx.quadraticCurveTo(52,258,66,258);ctx.lineTo(112,258);ctx.quadraticCurveTo(126,258,126,246);ctx.lineTo(126,120);ctx.quadraticCurveTo(126,90,92,70);ctx.lineTo(92,46);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#378ADD';ctx.fillRect(82,36,14,12);
  box(58,130,62,96,GREEN,'#fff',4);TB('Eau',89,148,DGREEN,13);
  ['Ca 78','Mg 24','Na 5','HCO₃ 357'].forEach(function(s,i){TB(s,89,168+i*15,INK,11);});
  // loupe
  LN(126,150,226,110,GREY,1.4,[4,4]);LN(126,190,226,200,GREY,1.4,[4,4]);
  var cx=330,cy=150,r=100;ctx.fillStyle='#eef6fc';ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.stroke();
  for(var i=0;i<34;i++){var a=rnd(i)*6.28,d=Math.sqrt(rnd(i+50))*(r-14);DOT(cx+Math.cos(a)*d,cy+Math.sin(a)*d,4,'#9cc7ee');}
  var io=[[ORA2,'Ca²⁺'],[GREEN,'Mg²⁺'],[VIOLET,'Na⁺'],[RED,'HCO₃⁻']];
  for(var j=0;j<10;j++){var a2=rnd(j+100)*6.28,d2=Math.sqrt(rnd(j+130))*(r-26),q=io[j%4];ball(cx+Math.cos(a2)*d2,cy+Math.sin(a2)*d2,j%4===3?9:7.5,q[0]);}
  TB('zoom',cx,cy-r-6,BLUE_D,13);
  if(p>0){ga(sg(p,0,.5));tag('un seul aspect : homogène',330,270,DGREEN,15);tag('plusieurs substances : mélange',cx,cy+r+0,DRED,13);g1();}
 }),
 // 5 trois solides
 F(function(p){
  for(var s=0;s<3;s++){var x=8+s*151;box(x,30,142,200,AX,'#fafcfe',8);TB((s+1)+' · '+['Aimant','Eau + filtre','Évaporation'][s],x+71,54,BLUE_D,15);}
  // 1 aimant
  ctx.fillStyle=RED;ctx.fillRect(40,70,34,16);ctx.fillStyle=BLUE;ctx.fillRect(74,70,34,16);TB('N',57,83,'#fff',12);TB('S',91,83,'#fff',12);
  var a1=sg(p,0,.35);
  for(var i=0;i<22;i++){var gx=26+rnd(i)*90,gy=200-rnd(i+9)*24;var yy=gy+(92-gy)*a1*(i%2?1:.0)+0;
   var colr=(i%2)?'#555':(i%3?'#d4a94a':'#fff');
   if(i%2){ctx.strokeStyle='#444';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx+(57-gx)*a1*.8,gy+(92-gy)*a1);ctx.lineTo(gx+(57-gx)*a1*.8+5,gy+(92-gy)*a1+3);ctx.stroke();}
   else{DOT(gx,gy,3,i%4?'#d4a94a':'#f2f2f2');ctx.strokeStyle=GREY;ctx.lineWidth=.8;ctx.beginPath();ctx.arc(gx,gy,3,0,7);ctx.stroke();}}
  // 2 filtre
  funnel(236,80,130,70);paper(236,80,128,70);
  glass(206,170,60,44,.35,'#d9ecfa');
  var a2=sg(p,.3,.65);ctx.fillStyle='#d4a94a';ctx.globalAlpha=.4+.6*a2;ctx.beginPath();ctx.moveTo(220,114);ctx.lineTo(236,127);ctx.lineTo(252,114);ctx.quadraticCurveTo(236,104,220,114);ctx.fill();g1();
  // 3 évaporation
  ctx.fillStyle='#eef1f4';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(342,160);ctx.quadraticCurveTo(387,205,432,160);ctx.closePath();ctx.fill();ctx.stroke();
  var a3=sg(p,.6,1);for(var c=0;c<8;c++){ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=1;var cx=362+rnd(c)*50;ctx.globalAlpha=.3+.7*a3;ctx.fillRect(cx,168+rnd(c+5)*3,7,7);ctx.strokeRect(cx,168+rnd(c+5)*3,7,7);}g1();
  flame(387,214,p*60);
  if(p<1){for(var w=0;w<3;w++){ctx.strokeStyle=BLUE;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(360+w*27,150);ctx.quadraticCurveTo(366+w*27,138,360+w*27,126);ctx.stroke();g1();}}
  var lab=[['fer',DGREEN],['sable',DGREEN],['sel',DGREEN]];
  [[0,'fer'],[.3,'sable'],[.6,'sel']].forEach(function(r,i){var a=sg(p,r[0],r[0]+.3);if(a>0){ga(a);box(30+i*151,244,100,28,DGREEN,'#e3f5ee',14);TB(r[1]+' récupéré',80+i*151,263,DGREEN,14);g1();}});
 }),
 // 6 chromatogramme X / Y
 F(function(p){
  var base=240,top=40,L=200;
  function R(r){return base-r*L;}
  function st(x,sp){strip(x,80,top,base,0);LN(x,base,x+80,base,INK,1.4,[4,3]);LN(x,top+10,x+80,top+10,BLUE,1.6,[5,3]);
   sp.forEach(function(q){spot(x+40,R(q[0]),9,q[1]);});}
  var cs={a:YEL,b:RED,c:BLUE};
  st(130,[[.8,cs.a],[.55,cs.b],[.25,cs.c]]);st(270,[[.8,cs.a],[.25,cs.c]]);
  TB('encre X',170,28,INK,16);TB('encre Y',310,28,INK,16);
  [.8,.55,.25].forEach(function(r){TB(String(r.toFixed(2)).replace('.',','),108,R(r)+5,GREY,13,'right');});
  TB('Rf',100,60,GREY,13,'right');
  if(p>0){var a=sg(p,0,.6);[.8,.25].forEach(function(r){ctx.strokeStyle=DGREEN;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.globalAlpha=a;ctx.beginPath();ctx.moveTo(210,R(r));ctx.lineTo(210+60*a,R(r));ctx.stroke();ctx.setLineDash([]);g1();});
   ga(sg(p,.5,.9));TB('X : 3 colorants',410,100,INK,14,'right');TB('Y : 2 colorants,',410,150,INK,14,'right');TB('les mêmes que dans X',410,168,DGREEN,14,'right');g1();}
 }),
 // 7 température qui monte
 F(function(p){
  var X=function(t){return 60+t*50},Y=function(T){return 240-(T-20)*2.4};
  LN(52,240,440,240,AX,1.6);LN(52,240,52,34,AX,1.6);TB('t (min)',430,262,GREY,13,'right');TB('T (°C)',58,28,GREY,13,'left');
  [20,40,60,80,100].forEach(function(T){LN(48,Y(T),52,Y(T),GREY,1);TB(String(T),44,Y(T)+4,GREY,12,'right');});
  var pts=[[0,20],[1,40],[2,61],[3,82],[4,84.5],[5,86.5],[6,89],[7,91]];
  ctx.fillStyle='rgba(55,138,221,.1)';ctx.fillRect(X(3),34,X(7)-X(3),206);TB('liquide qui bout',X(5),52,BLUE_D,14);
  ctx.strokeStyle=INK;ctx.lineWidth=2.6;ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1]));});ctx.stroke();
  pts.forEach(function(q){DOT(X(q[0]),Y(q[1]),4.2,INK);});
  TB('82 °C',X(3)-8,Y(82)-10,INK,13,'right');TB('91 °C',X(7)+4,Y(91)-10,INK,13,'right');
  if(p>0){var a=sg(p,0,.4);ga(a);LN(X(3),Y(82),X(7),Y(82),GREY,2,[6,4]);TB('corps pur : palier',X(5),Y(82)+22,GREY,13);g1();
   if(p>.4){ga(sg(p,.4,.8));A(X(5.2),Y(82)+2,0,-0.1,RED);ctx.strokeStyle=RED;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(X(7)+14,Y(82));ctx.lineTo(X(7)+14,Y(91));ctx.stroke();tag('T monte : mélange',X(5),Y(55),DRED,15);g1();}}
 }),
 // 8 distillation
 F(function(p){
  var cx=80,cy=150;
  flask(cx,cy,42,.55,'#e3eef9');flame(cx,cy+68,p*70);
  TB('250 mL',cx,cy+14,INK,13);TB('12 %',cx,cy+30,BLUE_D,14);
  // col + tête
  LN(cx,cy-60,cx,cy-84,INK,2.4);LN(cx,cy-84,150,cy-84,INK,2.4);
  ctx.save();ctx.translate(150,66);ctx.rotate(.33);ctx.fillStyle='#e8f1fa';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.fillRect(0,-9,170,18);ctx.strokeRect(0,-9,170,18);ctx.restore();
  TB('condenseur',250,50,GREY,13);
  // thermomètre
  LN(cx+10,cy-84,cx+10,cy-100,RED,3);
  // tube récepteur
  var tx=330,ty=150;ctx.fillStyle='#e9f7f0';ctx.fillRect(tx,ty,34,70);ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(tx,ty,34,70);
  ctx.fillStyle='#bfe5d3';ctx.fillRect(tx+1,ty+70-26,32,25);
  var dr=(p*0+0);
  TB('40 mL',tx+17,ty+90,INK,13);TB('60 %',tx+17,ty+106,DGREEN,14);
  LN(320,102,tx+17,ty-4,GREY,2,[4,3]);
  // résultats
  if(p>0){var a=sg(p,0,1);ga(sg(p,0,.3));TB('30 mL',410,70,DRED,15);TB('12 % × 250',410,88,INK,13);g1();
   ga(sg(p,.3,.6));TB('24 mL',410,130,DRED,15);TB('60 % × 40',410,148,INK,13);g1();
   ga(sg(p,.6,1));box(380,170,76,60,DGREEN,'#e3f5ee',10);TB('24 ÷ 30',418,194,INK,15);TB('= 80 %',418,218,DGREEN,18);g1();}
  else{TB('volume d\'éthanol ?',410,70,GREY,13);}
 }),
 // 9 dessaler
 F(function(p){
  box(6,30,214,200,AX,'#fafcfe',8);box(240,30,214,200,AX,'#fafcfe',8);
  TB('filtre à café',113,52,BLUE_D,15);TB('distillation',347,52,BLUE_D,15);
  funnel(113,70,120,80);paper(113,70,118,80);
  for(var i=0;i<14;i++){var q=((i/14)+.05*i)%1;DOT(88+rnd(i)*50,75+rnd(i+9)*26,2.6,BLUE);}
  glass(84,160,58,50,.5,'#d9ecfa');
  for(var j=0;j<8;j++){DOT(92+rnd(j+20)*42,184+rnd(j+30)*20,3.3,j%2?VIOLET:ORA2);}
  TB('sel dissous',113,226,GREY,13);
  // distillation
  flask(290,128,26,.6,'#e3eef9');LN(290,102,290,86,INK,2.4);LN(290,86,320,86,INK,2.4);
  ctx.save();ctx.translate(320,86);ctx.rotate(.4);ctx.fillStyle='#e8f1fa';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.fillRect(0,-6,90,12);ctx.strokeRect(0,-6,90,12);ctx.restore();
  glass(398,150,40,50,.35,'#d9ecfa');flame(290,168,p*70);
  for(var m=0;m<5;m++){DOT(274+m*8,132+((m*7)%11),2.6,m%2?VIOLET:ORA2);}
  TB('sel resté',290,196,GREY,13);TB('eau pure',418,222,DGREEN,13);
  if(p>0){ga(sg(p,0,.4));ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(60,70);ctx.lineTo(166,190);ctx.moveTo(166,70);ctx.lineTo(60,190);ctx.stroke();g1();
   ga(sg(p,.35,.7));chk(358,70,DGREEN,10);g1();
   ga(sg(p,.6,1));box(100,240,260,34,BLUE_D,'#eef4fb',17);TB('0,5 L × 35 g/L = 17,5 g de sel',230,263,BLUE_D,16);g1();}
  else TB('35 g de sel par litre',230,262,INK,15);
 }),
 // 10 identifier colorants
 F(function(p){
  var base=240,L=180,k=20;function R(r){return base-r*L;}
  strip(120,70,base-L-14,base,0);LN(120,base,190,base,INK,1.4,[4,3]);LN(120,R(1),190,R(1),BLUE,1.8,[5,3]);
  TB('front 9,0 cm',155,R(1)-7,BLUE_D,13);TB('encre',155,base+28,INK,14);
  spot(155,base-7.2*k,9,YEL);spot(155,base-4.5*k,9,RED);spot(155,base-2.25*k,9,BLUE);
  // échelle de référence
  LN(300,base,300,R(1),AX,1.8);
  var refs=[[.8,'J',YEL,'jaune 0,80'],[.65,'V',GREEN,'vert 0,65'],[.5,'R',RED,'rouge 0,50'],[.25,'B',BLUE,'bleu 0,25']];
  refs.forEach(function(r){LN(294,R(r[0]),306,R(r[0]),r[2],3);TB(r[3],314,R(r[0])+5,INK,13,'left');});
  TB('Rf de référence',350,28,GREY,13);
  if(p>0){var a=sg(p,0,.6);[[.8,0],[.5,2],[.25,3]].forEach(function(q){var yy=R(q[0]);ctx.strokeStyle=DGREEN;ctx.lineWidth=1.8;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(165,yy);ctx.lineTo(165+(135)*a,yy);ctx.stroke();ctx.setLineDash([]);});
   TB('0,80',115,R(.8)+5,DGREEN,13,'right');TB('0,50',115,R(.5)+5,DGREEN,13,'right');TB('0,25',115,R(.25)+5,DGREEN,13,'right');
   ga(sg(p,.5,1));tag('vert absent',412,R(.65),DRED,13);g1();}
 })
]);
})();
