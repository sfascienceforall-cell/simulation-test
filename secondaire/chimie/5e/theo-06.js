/* Chimie 5e · chapitre 6 : théorie animée et devantures */
function k5_Tcal(t){ /* courbe de calorimétrie : réaction à t = 60 s, ΔT corrigé 4,7 K, pertes −0,00333 K/s */
 if(t<60)return 20;var u=t-60;return 20+4.7*(1-Math.exp(-u/15))-.00333*u;}
function k5_calo(x,y,w,h,T,t,lab){ /* calorimètre : vase isolé, agitateur, thermomètre */
 k5_rr(x-8,y-6,w+16,h+14,'#f1f3f5',GREY,1.6,10);k5_rr(x,y,w,h,'#fff',INK,2.2,8);
 ctx.fillStyle='rgba(120,170,230,.22)';ctx.fillRect(x+2,y+h*.3,w-4,h*.7-3);
 k5_part(x+2,y+h*.3,w-4,h*.7,10,T,t||0);
 LN(x+w*.3,y-14,x+w*.3,y+h*.7+Math.sin((t||0)*.1)*4,'#7f8790',2.4);LN(x+w*.3-12,y+h*.7+Math.sin((t||0)*.1)*4,x+w*.3+12,y+h*.7+Math.sin((t||0)*.1)*4,'#7f8790',2.4);
 LN(x+w*.72,y-18,x+w*.72,y+h*.62,INK,3);ctx.fillStyle=k5_tcol((T-15)*4);ctx.fillRect(x+w*.72-1.5,y+h*.62-Math.max(6,(T-15)*3.2),3,Math.max(6,(T-15)*3.2));
 if(lab)TB(lab,x+w/2,y+h+26,INK,13);}

SFA.theo("c06", {
 icon: function () {
  k5_calo(W*.3,H*.22,W*.4,H*.42,22,0,'');TB('ΔH = −Q / n',W*.5,H*.86,BLUE_D,24);TB('Hess',W*.5,H*.1,ORANGE,18);},
 anim: function (t) {
  var tt=(t*1.1)%700,gx=W*.46,gw=W*.5,gy=H*.1,gh=H*.66;
  var Y=function(T){return gy+gh-(T-19)/(26-19)*gh;},X=function(s){return gx+s/480*gw;};
  var T=k5_Tcal(Math.min(tt,480));
  k5_calo(W*.08,H*.18,W*.22,H*.5,T,t,'calorimètre agité');TB(k5_tf(T,1)+' °C',W*.19,H*.1,DRED,15);
  LN(gx,gy,gx,gy+gh,AX,1.6);LN(gx,gy+gh,gx+gw,gy+gh,AX,1.6);TB('T (°C)',gx+4,gy-2,GREY,12,'left');TB('t (s)',gx+gw,gy+gh+16,GREY,12,'right');
  [20,22,24].forEach(function(v){LN(gx-4,Y(v),gx,Y(v),GREY,1);TB(String(v),gx-7,Y(v)+4,GREY,11,'right');});
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();for(var s=0;s<=Math.min(tt,480);s+=4){s?ctx.lineTo(X(s),Y(k5_Tcal(s))):ctx.moveTo(X(s),Y(k5_Tcal(s)));}ctx.stroke();
  LN(X(60),gy+gh,X(60),gy,GREY,1.2,[4,4]);TB('mélange',X(60),gy+gh+16,GREY,11);
  if(tt>300){var a=k5_seg(tt,300,420);ctx.globalAlpha=a;ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(X(60),Y(24.7));ctx.lineTo(X(480),Y(24.7-.00333*420));ctx.stroke();ctx.setLineDash([]);
   A(X(60)-10,Y(20),0,Y(24.7)-Y(20)+3,GREEN,'',2.6);tag('ΔT corrigé',X(60)+46,Y(22.4),DGREEN,13);ctx.globalAlpha=1;}
  TB('Q = (m·c + C)·ΔT  ;  ΔH = −Q / n',W*.5,H*.96,INK,Math.min(15,W*.023));},
 th: '<div class="tcard"><b class="h">Mesurer un effet thermique</b><p>Dans un <b>calorimètre</b> (récipient isolé et agité), l\'énergie échangée par la réaction est absorbée par l\'eau et par le calorimètre : <b>Q = (m·c + C)·ΔT</b>, où C est la capacité thermique du calorimètre (J/K). Si on néglige C, Q = m·c·ΔT.</p><p>L\'enthalpie molaire de réaction est <b>ΔH = −Q / n</b> (n en mol, n = m/M) : un échauffement (Q &gt; 0 reçue par le milieu) donne ΔH &lt; 0.</p><p><i>Exemples :</i> 0,050 mol de NaOH dans 100 g d\'eau, ΔT = +5,0 K : Q = 100 × 4,18 × 5,0 = 2 090 J, ΔH = −2 090 / 0,050 ≈ −41,8 kJ/mol. Avec 4,0 g de NaOH (0,10 mol) dans 200 g d\'eau, C = 25 J/K, ΔT = 5,1 K : Q = (200 × 4,18 + 25) × 5,1 ≈ 4 391 J, ΔH ≈ −43,9 kJ/mol. Oublier C fausse le résultat.</p></div><div class="tcard"><b class="h">Lire une courbe de calorimétrie</b><p>Après le mélange, le calorimètre perd lentement de la chaleur : la température redescend. On <b>extrapole la droite de refroidissement jusqu\'à l\'instant du mélange</b> pour trouver le vrai ΔT, plus grand que le maximum lu. Exemple : T(180 s) = 24,3 °C, T(300 s) = 23,9 °C, T(420 s) = 23,5 °C : pente −0,0033 K/s, extrapolation à 60 s : 24,7 °C, soit ΔT = 4,7 K (et non 4,3 K), ce qui change ΔH d\'environ 8 %.</p></div><div class="tcard"><b class="h">Pouvoir calorifique et combustibles</b><p>Le <b>pouvoir calorifique</b> est l\'énergie libérée par kg (MJ/kg) ou par volume. Charbon ≈ 33 MJ/kg ; essence ≈ 48 MJ/kg ; hydrogène ≈ 143 MJ/kg. Piège : l\'hydrogène gazeux gagne par kg mais perd de très loin par litre (≈ 0,012 MJ/L contre ≈ 34 MJ/L pour l\'essence).</p><p>Chaîne de calcul avec ΔH<sub>c</sub> : E = n·|ΔH<sub>c</sub>| ; 17 MJ de méthane (890 kJ/mol) : n = 17 000/890 = 19,1 mol, m = 306 g, CO₂ = 19,1 × 44 ≈ 0,84 kg, V = 19,1 × 24 ≈ 458 L (à 20 °C). Le <b>rendement</b> est η = énergie utile / énergie libérée : réchaud à butane, 20 g (0,345 mol × 2 877 = 992 kJ) pour 355 kJ reçus par l\'eau, η ≈ 36 %.</p></div><div class="tcard"><b class="h">Loi de Hess</b><p>ΔH ne dépend que de l\'état initial et de l\'état final, pas du chemin : on peut <b>additionner</b> des équations et leurs ΔH. Inverser une équation change le signe de ΔH ; la multiplier par k multiplie ΔH par k.</p><p><i>Exemple :</i> formation de l\'éthane 2 C + 3 H₂ → C₂H₆ = 2 × (1) + 3 × (2) − (3) avec (1) C + O₂ → CO₂ (−394), (2) H₂ + ½ O₂ → H₂O (−286), (3) combustion de C₂H₆ (−1 560) : ΔH = 2(−394) + 3(−286) − (−1 560) = −788 − 858 + 1 560 = <b>−86 kJ/mol</b>. Et 2 H₂O(l) → 2 H₂ + O₂ : ΔH = 2 × (+286) = +572 kJ.</p></div>'
});

SFA.figs("c06", [
 /* 0 · NaOH dans un calorimètre */
 function (p) {
  var k=k5_seg(p,0,.7),T=20+5*(p>0?k:0),t=Date.now()/16;
  k5_calo(W*.1,H*.22,W*.3,H*.52,T,t,'100 g d\'eau + 0,050 mol NaOH');
  TB('ΔT = +5,0 K',W*.25,H*.1,DRED,16);
  if(p>0){ctx.globalAlpha=k;TB('Q = 100 × 4,18 × 5,0',W*.72,H*.3,INK,15);TB('= 2 090 J',W*.72,H*.44,INK,17);TB('ΔH = −Q / n',W*.72,H*.62,INK,15);TB('≈ −41,8 kJ/mol',W*.72,H*.78,DGREEN,20);ctx.globalAlpha=1;}
  else TB('ΔH molaire ?',W*.72,H*.5,GREY,20);
 },
 /* 1 · tas de charbon */
 function (p) {
  var k=k5_seg(p,0,.7);
  ctx.fillStyle='#3a3d42';ctx.beginPath();ctx.moveTo(W*.06,H*.78);ctx.lineTo(W*.14,H*.5);ctx.lineTo(W*.22,H*.58);ctx.lineTo(W*.3,H*.46);ctx.lineTo(W*.38,H*.78);ctx.closePath();ctx.fill();
  TB('2,0 kg de charbon',W*.22,H*.9,INK,14);TB('33 MJ/kg',W*.22,H*.1,ORANGE,15);
  A(W*.4,H*.62,W*.12,0,ORANGE,'',3.4);
  if(p>0){ctx.globalAlpha=k;TB('E = 66 MJ',W*.46,H*.5,DRED,17);
   k5_rr(W*.62,H*.3,W*.28,H*.46,'#e4f0fb',BLUE,2.4,12);ctx.fillStyle='rgba(226,75,74,.25)';ctx.fillRect(W*.62+3,H*.3+3,W*.28-6,H*.46-6);
   TB('≈ 790 kg d\'eau',W*.76,H*.54,INK,15);TB('+ 20 K',W*.76,H*.66,DRED,16);
   TB('m = 66·10⁶ / (4,18 × 20)',W*.62,H*.9,GREY,13,'left');ctx.globalAlpha=1;}
  else{TB('?',W*.75,H*.55,GREY,40);TB('quelle masse d\'eau (+ 20 K) ?',W*.76,H*.9,GREY,13);}
 },
 /* 2 · correction du calorimètre */
 function (p) {
  var k=k5_seg(p,0,.7),T=20+5.1*(p>0?k:0),t=Date.now()/16;
  k5_calo(W*.08,H*.22,W*.3,H*.5,T,t,'200 g d\'eau + 4,0 g NaOH');
  TB('C = 25 J/K',W*.23,H*.12,ORANGE,15);
  if(p>0){ctx.globalAlpha=k;TB('n = 4,0 / 40 = 0,10 mol',W*.7,H*.2,INK,14);TB('Q = (200 × 4,18 + 25) × 5,1',W*.7,H*.36,INK,14);TB('≈ 4 391 J',W*.7,H*.52,INK,17);TB('ΔH ≈ −43,9 kJ/mol',W*.7,H*.74,DGREEN,19);ctx.globalAlpha=1;}
  else TB('ΔH molaire ?',W*.7,H*.5,GREY,20);
 },
 /* 3 · nitrate d'ammonium */
 function (p) {
  var k=k5_seg(p,0,.7),T=20-4*(p>0?k:0),t=Date.now()/16;
  k5_calo(W*.1,H*.22,W*.3,H*.5,T,t,'NH₄NO₃ dans l\'eau');
  TB('20 °C → 16 °C',W*.25,H*.1,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;A(W*.52,H*.32,0,H*.2,BLUE,'',4);TB('T baisse',W*.6,H*.48,BLUE_D,16,'left');
   TB('le milieu perd de l\'énergie',W*.72,H*.66,INK,13);TB('absorbée par la dissolution',W*.72,H*.76,INK,13);TB('ΔH > 0 : endothermique',W*.72,H*.9,DGREEN,16);ctx.globalAlpha=1;}
  else TB('signe de ΔH ?',W*.72,H*.5,GREY,22);
 },
 /* 4 · gaz méthane */
 function (p) {
  var k=k5_seg(p,0,.8),bx=[W*.04,W*.27,W*.5,W*.73],bw=W*.2,y=H*.34,h=H*.3;
  var d=[['n','19,1 mol','17 000 / 890'],['m','≈ 306 g','× 16 g/mol'],['CO₂','≈ 0,84 kg','19,1 × 44'],['V','≈ 458 L','× 24 L/mol']],ti=['CH₄','CH₄','émis','CH₄'];
  TB('17 MJ avec du méthane (890 kJ/mol)',W*.5,H*.12,BLUE_D,15);
  d.forEach(function(q,i){var a=p>0?k5_seg(p,i*.2,i*.2+.3):0;k5_rr(bx[i],y,bw,h,'#f4f8fc',a>0?GREEN:GREY,2);TB(q[0],bx[i]+bw/2,y+h*.3,INK,16);
   if(a>0){ctx.globalAlpha=a;TB(q[1],bx[i]+bw/2,y+h*.62,DGREEN,15);TB(q[2],bx[i]+bw/2,y+h+20,GREY,12);ctx.globalAlpha=1;}else TB('?',bx[i]+bw/2,y+h*.7,GREY,22);
   if(i<3)A(bx[i]+bw+2,y+h/2,W*.03-4,0,GREY,'',2);});
  var fx=W*.5,fy=H*.88;ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(fx,fy-26);ctx.quadraticCurveTo(fx+14,fy,fx,fy+8);ctx.quadraticCurveTo(fx-14,fy,fx,fy-26);ctx.fill();
 },
 /* 5 · hydrogène contre essence */
 function (p) {
  var k=k5_seg(p,0,.8),yb=H*.78;
  TB('énergie par kg (MJ/kg)',W*.25,H*.1,BLUE_D,14);TB('énergie par litre (MJ/L)',W*.74,H*.1,BLUE_D,14);
  LN(W*.04,yb,W*.46,yb,AX,1.5);LN(W*.54,yb,W*.96,yb,AX,1.5);
  var b=[[W*.08,143,'H₂',BLUE,143,W*.16,H*.5/143,'143'],[W*.28,48,'essence',ORANGE,48,W*.16,H*.5/143,'48'],[W*.58,0.012,'H₂ gaz',BLUE,0.012,W*.16,H*.5/34,'0,012'],[W*.78,33.6,'essence',ORANGE,33.6,W*.16,H*.5/34,'≈ 34']];
  b.forEach(function(q){var h=q[4]*q[6]*(p>0?k:0);if(p>0){ctx.fillStyle=q[3]+'55';ctx.fillRect(q[0],yb-h,q[5],h);ctx.strokeStyle=q[3];ctx.lineWidth=2;ctx.strokeRect(q[0],yb-Math.max(h,1.5),q[5],Math.max(h,1.5));if(k>.7)TB(q[7],q[0]+q[5]/2,yb-h-8,q[3]===BLUE?BLUE_D:DRED,15);}
   TB(q[2],q[0]+q[5]/2,yb+20,INK,14);});
  if(p<=0)TB('?',W*.25,H*.45,GREY,34),TB('?',W*.74,H*.45,GREY,34);
  if(p>.8){ctx.globalAlpha=k5_seg(p,.8,1);TB('H₂ gagne par kg…',W*.25,H*.95,DGREEN,13);TB('…l\'essence gagne par litre (× 3 000)',W*.74,H*.95,DRED,13);ctx.globalAlpha=1;}
 },
 /* 6 · Hess : éthane */
 function (p) {
  var k=k5_seg(p,0,.7),top=H*.12,bot=H*.84,E0=0,E1=-1646;
  var Y=function(E){return top+(E0-E)/(E0-E1)*(bot-top);};
  var xA=W*.1,xB=W*.5,xC=W*.74;
  LN(xA,Y(0),xA+W*.22,Y(0),INK,3.4);TB('2 C + 3 H₂ + 7/2 O₂',xA+W*.11,Y(0)-8,INK,13);
  LN(xA+W*.3,Y(-86),xA+W*.52,Y(-86),ORANGE,3.4);TB('C₂H₆ + 7/2 O₂',xA+W*.41,Y(-86)+18,ORANGE,13);
  LN(xA,Y(-1646),xA+W*.52,Y(-1646),GREEN,3.4);TB('2 CO₂ + 3 H₂O',xA+W*.26,Y(-1646)+20,DGREEN,14);
  if(p<=0){TB('?',xA+W*.41,Y(-86)+54,GREY,28);}
  A(xA+W*.04,Y(0),0,Y(-1646)-Y(0),RED,'',3);tag('−1 646',xA+W*.04+34,Y(-800),DRED,14);
  A(xA+W*.48,Y(-86),0,(Y(-1646)-Y(-86)),BLUE,'',3);tag('−1 560',xA+W*.48-34,Y(-900),BLUE_D,14);
  if(p>0){ctx.globalAlpha=k;A(xA+W*.34,Y(0),0,Y(-86)-Y(0),DGREEN,'',3.4);TB('ΔH = −1 646 − (−1 560)',W*.8,H*.4,INK,13);TB('= −86 kJ/mol',W*.8,H*.52,DGREEN,18);ctx.globalAlpha=1;}
  else TB('ΔH de formation ?',W*.8,H*.45,GREY,16);
 },
 /* 7 · inverser et multiplier */
 function (p) {
  var k=k5_seg(p,0,.4),k2=k5_seg(p,.4,.9);
  k5_rr(W*.06,H*.1,W*.88,H*.22,'#eef4fb',BLUE,2);TB('H₂ + ½ O₂ → H₂O(l)',W*.35,H*.24,INK,16);TB('ΔH = −286 kJ',W*.78,H*.24,DRED,16);
  A(W*.5,H*.35,0,H*.12,GREY,'',2.4);TB('inverser',W*.58,H*.42,GREY,13,'left');
  if(p>0){ctx.globalAlpha=k;k5_rr(W*.06,H*.5,W*.88,H*.18,'#fbf2e2',ORANGE,2);TB('H₂O(l) → H₂ + ½ O₂',W*.35,H*.62,INK,16);TB('ΔH = +286 kJ',W*.78,H*.62,DGREEN,16);ctx.globalAlpha=1;}
  else TB('?',W*.5,H*.6,GREY,30);
  if(p>0){ctx.globalAlpha=k2;A(W*.5,H*.7,0,H*.07,GREY,'',2.4);TB('× 2',W*.58,H*.75,GREY,13,'left');k5_rr(W*.06,H*.8,W*.88,H*.17,'#e8f7f1',GREEN,2);TB('2 H₂O → 2 H₂ + O₂',W*.35,H*.91,INK,16);TB('ΔH = +572 kJ',W*.78,H*.91,DGREEN,17);ctx.globalAlpha=1;}
 },
 /* 8 · réchaud */
 function (p) {
  var k=k5_seg(p,0,.8),t=Date.now()/90;
  /* casserole + flamme */
  k5_rr(W*.06,H*.26,W*.22,H*.28,'#e4f0fb',INK,2.2,6);TB('1,0 L',W*.17,H*.43,BLUE_D,14);TB('15 → 100 °C',W*.17,H*.18,DRED,13);
  var fx=W*.17;ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(fx,H*.6+Math.sin(t)*2);ctx.quadraticCurveTo(fx+16,H*.72,fx,H*.78);ctx.quadraticCurveTo(fx-16,H*.72,fx,H*.6);ctx.fill();TB('20 g de butane',W*.17,H*.92,INK,13);
  /* diagramme de Sankey */
  var x0=W*.34,x1=W*.64,y0=H*.18,hh=H*.62;
  ctx.fillStyle='rgba(216,90,48,.25)';ctx.fillRect(x0,y0,W*.1,hh);ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.strokeRect(x0,y0,W*.1,hh);TB('992 kJ',x0+W*.05,y0-8,DRED,15);
  if(p>0){var h1=hh*.358*k;ctx.fillStyle='rgba(55,138,221,.3)';ctx.beginPath();ctx.moveTo(x0+W*.1,y0);ctx.lineTo(x1,y0);ctx.lineTo(x1,y0+h1);ctx.lineTo(x0+W*.1,y0+hh*.358);ctx.closePath();ctx.fill();ctx.strokeStyle=BLUE;ctx.stroke();
   ctx.globalAlpha=k;TB('355 kJ utiles',x1+8,y0+hh*.18,BLUE_D,14,'left');TB('η ≈ 36 %',x1+8,y0+hh*.3,DGREEN,16,'left');
   ctx.fillStyle='rgba(154,160,166,.25)';ctx.beginPath();ctx.moveTo(x0+W*.1,y0+hh*.358);ctx.lineTo(x1-W*.06,y0+hh*.55);ctx.lineTo(x1-W*.06,y0+hh);ctx.lineTo(x0+W*.1,y0+hh);ctx.closePath();ctx.fill();
   TB('pertes ≈ 637 kJ',x1-W*.04,y0+hh*.8,GREY,13,'left');TB('CO₂ ≈ 61 g · à 70 % : ≈ 10 g',W*.5,H*.97,INK,13);ctx.globalAlpha=1;}
  else{TB('rendement ?',W*.78,H*.45,GREY,20);}
 },
 /* 9 · courbe de calorimétrie */
 function (p) {
  var k=k5_seg(p,0,.8),gx=W*.12,gw=W*.8,gy=H*.1,gh=H*.66;
  var Y=function(T){return gy+gh-(T-19)/(26-19)*gh;},X=function(s){return gx+s/480*gw;};
  LN(gx,gy,gx,gy+gh,AX,1.6);LN(gx,gy+gh,gx+gw,gy+gh,AX,1.6);TB('T (°C)',gx+4,gy-2,GREY,12,'left');TB('t (s)',gx+gw,gy+gh+16,GREY,12,'right');
  [20,22,24].forEach(function(v){LN(gx-4,Y(v),gx,Y(v),GREY,1);TB(String(v),gx-7,Y(v)+4,GREY,11,'right');});
  [60,180,300,420].forEach(function(v){LN(X(v),gy+gh,X(v),gy+gh+4,GREY,1);TB(String(v),X(v),gy+gh+16,GREY,11);});
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();for(var s=0;s<=480;s+=4){s?ctx.lineTo(X(s),Y(k5_Tcal(s))):ctx.moveTo(X(s),Y(k5_Tcal(s)));}ctx.stroke();
  [[180,24.3],[300,23.9],[420,23.5]].forEach(function(q){DOT(X(q[0]),Y(q[1]),5,RED);});
  if(p>0){ctx.globalAlpha=k;ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(X(60),Y(24.7));ctx.lineTo(X(480),Y(24.7-.00333*420));ctx.stroke();ctx.setLineDash([]);
   A(X(60)-12,Y(20),0,Y(24.7)-Y(20)+3,GREEN,'',2.6);tag('ΔT = 4,7 K',X(60)+60,Y(22.2),DGREEN,14);
   tag('ΔH ≈ −77 kJ/mol',X(300),Y(21.6),DGREEN,15);tag('sans extrapolation : −71 (écart 8,5 %)',X(300),Y(20.6),GREY,12);ctx.globalAlpha=1;}
  else{tag('ΔT ? (réaction à t = 60 s)',X(300),Y(21.4),GREY,14);}
 }
]);
