/* Biologie 4e · chapitre 6 · Respiration cellulaire et fermentation */
function b4mitoB(x,y,w,h){b4ell(x,y,w/2,h/2,'#fdece4',ORA2,3);b4ell(x,y,w/2-5,h/2-5,null,ORA2,1.2);ctx.strokeStyle=ORA2;ctx.lineWidth=2.4;ctx.beginPath();
 var n=6;for(var i=0;i<n;i++){var xx=x-w*.4+i*w*.8/(n-1),u=(xx-x)/(w/2),e=h/2*Math.sqrt(Math.max(0,1-u*u))-5,top=i%2===0;ctx.moveTo(xx,top?y-e:y+e);ctx.lineTo(xx,top?y+e*.35:y-e*.35);}ctx.stroke();}
function b4hex(x,y,r,col,lab){ctx.fillStyle=col||'#fdece4';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();for(var i=0;i<6;i++){var a=i*1.0472+.5236;ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));}ctx.closePath();ctx.fill();ctx.stroke();if(lab)TB(lab,x,y+4,INK,Math.max(11,Math.round(r*.7)));}
function b4flask(x,y,w,h,col,lvl){var nw=w*.28;ctx.beginPath();ctx.moveTo(x-nw/2,y-h);ctx.lineTo(x-nw/2,y-h*.55);ctx.lineTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+nw/2,y-h*.55);ctx.lineTo(x+nw/2,y-h);
 ctx.save();ctx.clip();ctx.fillStyle=col||'rgba(246,201,70,.35)';ctx.fillRect(x-w,y-h*lvl,2*w,h);ctx.restore();ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-nw/2,y-h);ctx.lineTo(x-nw/2,y-h*.55);ctx.lineTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+nw/2,y-h*.55);ctx.lineTo(x+nw/2,y-h);ctx.stroke();}
SFA.theo("c06",{
 icon:function(){b4mitoB(W*.5,H*.5,Math.min(W*.5,220),Math.min(H*.55,120));TB('≈ 30 ATP',W*.5,H*.55,DGREEN,Math.min(26,W/14));TB('glucose + O₂',W*.5,H*.14,INK,15);},
 anim:function(t){var P=900,k=(t%P)/P;TB('Du glucose à l\'ATP : trois étapes',W*.5,H*.07,BLUE_D,Math.max(14,Math.min(17,W/42)));
  var cx=W*.64,cy=H*.52,mw=W*.5,mh=H*.62;ctx.fillStyle='#faf8f4';ctx.fillRect(W*.02,H*.14,W*.96,H*.82);ctx.strokeStyle=GREY;ctx.lineWidth=1.5;ctx.strokeRect(W*.02,H*.14,W*.96,H*.82);TB('cytoplasme',W*.1,H*.2,GREY,13,'left');
  b4mitoB(cx,cy,mw,mh);TB('mitochondrie',cx,cy-mh/2-6,DRED,13);
  var s1=b4r(k,.02,.3),s2=b4r(k,.3,.55),s3=b4r(k,.55,.9);
  /* glycolyse */
  b4al(1-b4r(k,.2,.3));b4hex(W*.1+s1*W*.1,H*.5,Math.min(20,H*.07),'#fdece4','C₆');b4al(1);
  b4al(b4r(k,.2,.3));b4hex(W*.2,H*.4,12,'#fff3e0','C₃');b4hex(W*.2,H*.6,12,'#fff3e0','C₃');b4al(1);
  TB('1  glycolyse',W*.15,H*.8,k>.02&&k<.3?ORANGE:INK,14);
  /* pyruvate entre */
  if(k>.3){var u=Math.min(1,s2*1.5);b4hex(W*.2+u*(cx-mw*.3-W*.2),H*.4+u*(cy-H*.4)-0,12,'#fff3e0','C₃');b4hex(W*.2+u*(cx-mw*.3-W*.2),H*.6+u*(cy-H*.6)+10,12,'#fff3e0','C₃');}
  TB('2  Krebs (matrice)',cx-mw*.12,cy-mh*.24,k>.3&&k<.55?ORANGE:INK,13);TB('3  chaîne respiratoire',cx+mw*.1,cy+mh*.34,k>.55?ORANGE:INK,13);
  if(k>.35&&k<.7){for(var i=0;i<3;i++){var v=((k-.35)*3+i/3)%1;DOT(cx+mw*.1+v*mw*.3,cy-mh*.1-v*mh*.5,4,GREY);}TB('CO₂',cx+mw*.45,cy-mh*.45,INK,13);}
  if(k>.6){for(var j=0;j<3;j++){var w2=((k-.6)*3+j/3)%1;b4o2(cx+mw*.1+w2*0-mw*.05,cy+mh*.6-w2*mh*.25,.7,RED);}TB('O₂',cx,cy+mh*.62,DRED,13);}
  /* compteur ATP */
  var atp=Math.round(2*b4r(k,.1,.3)+2*b4r(k,.35,.55)+26*b4r(k,.6,.9));var bx=W*.06,by=H*.9,bw=W*.88;ctx.fillStyle='#eceef1';ctx.fillRect(bx,by,bw,10);ctx.fillStyle=VIOLET;ctx.fillRect(bx,by,bw*atp/30,10);TB('ATP : '+atp,bx+bw*atp/30+(atp<20?8:-8),by-5,VIOLET,15,atp<20?'left':'right');
 },
 th:'<div class="tcard"><b class="h">Les trois étapes de la respiration cellulaire</b><ul><li><b>Glycolyse</b> (cytoplasme) : glucose (C<sub>6</sub>) → 2 pyruvates (C<sub>3</sub>). Bilan : <b>2 ATP</b>. Sans dioxygène.</li><li><b>Cycle de Krebs</b> (matrice de la mitochondrie) : le pyruvate est oxydé, le carbone part en <b>CO<sub>2</sub></b>. Bilan : ≈ <b>2 ATP</b>, et des transporteurs réduits (NADH, FADH<sub>2</sub>).</li><li><b>Chaîne respiratoire</b> (crêtes, membrane interne) : les électrons de NADH et FADH<sub>2</sub> aboutissent sur <b>O<sub>2</sub></b>, réduit en <b>H<sub>2</sub>O</b>. Bilan : ≈ <b>26 ATP</b>.</li></ul><p>Équation bilan : <code>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6 O<sub>2</sub> → 6 CO<sub>2</sub> + 6 H<sub>2</sub>O + ≈ 30 ATP</code> (plus de la chaleur). Le CO<sub>2</sub> libéré vient du glucose ; l\'O<sub>2</sub> n\'est consommé qu\'à la fin.</p></div>'+
 '<div class="tcard"><b class="h">Fermentations (sans dioxygène)</b><p>Seule la glycolyse fonctionne ; la fermentation régénère le NAD<sup>+</sup> et rapporte <b>2 ATP</b> par glucose.</p><ul><li><b>Lactique</b> (muscle, bactéries) : glucose → 2 lactate.</li><li><b>Alcoolique</b> (levures) : <code>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> → 2 C<sub>2</sub>H<sub>5</sub>OH + 2 CO<sub>2</sub></code>.</li></ul><div class="tip"><b class="h">Exemple chiffré</b><br>36 g de glucose = 0,20 mol → éthanol : 0,40 mol = 0,40 × 46 = <b>18,4 g</b> ; CO<sub>2</sub> : 0,40 mol = <b>17,6 g</b> ; ATP : 0,40 mol. Contrôle : 18,4 + 17,6 = 36 g.</div></div>'+
 '<div class="tcard"><b class="h">Rendement</b><p>Oxydation complète d\'1 mol de glucose : ≈ 2 870 kJ ; hydrolyse d\'1 mol d\'ATP : ≈ 30,5 kJ. Respiration : 30 × 30,5 = 915 kJ → <b>≈ 32 %</b>. Fermentation : 2 × 30,5 = 61 kJ → <b>≈ 2 %</b>. Il faut donc fermenter <b>15 fois</b> plus de glucose pour la même quantité d\'ATP. Le reste part en chaleur ou reste dans le lactate / l\'éthanol.</p></div>'+
 '<div class="tcard"><b class="h">À l\'effort</b><p>Quand la puissance P demandée dépasse la capacité aérobie A, la fermentation lactique complète : le lactate monte. Modèle du cours : <code>lactate = 1 + 0,06 × (P − A) ÷ 0,4</code> (mmol/L) ; épuisement vers 12 mmol/L.</p><div class="tip"><b class="h">Exemple</b><br>A = 160 W, P = 220 W : fermentation 60 W ; lactate = 1 + 0,06 × 60 ÷ 0,4 = <b>10 mmol/L</b> (tenable). P = 260 W : 1 + 0,06 × 100 ÷ 0,4 = <b>16 mmol/L</b> &gt; 12 : épuisement.</div></div>'+
 '<div class="warn"><b class="h">Pièges</b><br>• Respiration : autant de CO<sub>2</sub> libéré que d\'O<sub>2</sub> consommé (6 pour 6 ; 0,60 mol d\'O<sub>2</sub> → 0,10 mol de glucose → 3,0 mol d\'ATP).<br>• La glycolyse n\'a pas lieu dans la mitochondrie et ne demande pas d\'O<sub>2</sub>.<br>• Une chaîne respiratoire défaillante (cyanure, maladie mitochondriale) force la fermentation lactique : le lactate s\'accumule.</div>'
});
SFA.figs("c06",[
 /* 0 glycolyse */
 function(p){ctx.fillStyle='#faf8f4';ctx.fillRect(W*.03,H*.1,W*.94,H*.8);ctx.strokeStyle=GREY;ctx.lineWidth=1.5;ctx.strokeRect(W*.03,H*.1,W*.94,H*.8);TB('cytoplasme',W*.1,H*.18,GREY,13,'left');
  b4mitoB(W*.78,H*.5,W*.34,H*.5);TB('mitochondrie',W*.78,H*.2,DRED,13);
  var r=Math.min(24,H*.09);b4hex(W*.15,H*.5,r,'#fdece4','C₆');TB('glucose',W*.15,H*.5+r+18,INK,13);A(W*.24,H*.5,W*.1,0,GREY,'',3);b4hex(W*.42,H*.4,r*.65,'#fff3e0','C₃');b4hex(W*.42,H*.6,r*.65,'#fff3e0','C₃');TB('2 pyruvates',W*.42,H*.78,INK,13);
  if(p<=0)TB('où ? combien d\'ATP ? O₂ ?',W*.5,H*.07,GREY,15);
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=GREEN;ctx.lineWidth=3.5;ctx.setLineDash([8,5]);ctx.strokeRect(W*.07,H*.24,W*.46,H*.6);ctx.setLineDash([]);TB('glycolyse : + 2 ATP',W*.3,H*.32,DGREEN,15);TB('sans O₂',W*.3,H*.9-8,DGREEN,14);b4al(1);b4ans(p,'cytoplasme · 2 ATP · sans dioxygène',GREEN,H-20);}},
 /* 1 équation */
 function(p){var y=H*.3;TB('C₆H₁₂O₆ + 6 O₂',W*.27,y,DGREEN,Math.min(22,W/19));A(W*.46,y-8,W*.08,0,INK,'',3);
  if(p<=0)TB('?',W*.78,y,GREY,36);else{b4al(b4r(p,0,.4));TB('6 CO₂ + 6 H₂O + ATP',W*.77,y,ORANGE,Math.min(22,W/19));b4al(1);}
  b4mitoB(W*.5,H*.68,W*.34,H*.34);if(p>0){b4al(b4r(p,.3,.8));TB('≈ 30 ATP',W*.5,H*.7,VIOLET,18);TB('+ chaleur',W*.82,H*.7,DRED,15);b4al(1);}b4ans(p,'respiration · ATP + chaleur',GREEN,H-20);},
 /* 2 où va O2 */
 function(p){b4ell(W*.5,H*.5,W*.46,H*.42,'#faf8f4',GREY,2);b4nuc(W*.12,H*.5,H*.1);TB('D noyau',W*.12,H*.72,VIOLET,13);TB('A cytoplasme (glycolyse)',W*.28,H*.28,INK,13);
  b4mitoB(W*.62,H*.52,W*.4,H*.5);TB('B matrice (Krebs)',W*.55,H*.4,INK,13);TB('C crêtes (chaîne)',W*.7,H*.68,INK,13);
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=RED;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(W*.7,H*.62,W*.12,H*.09,0,0,7);ctx.stroke();b4o2(W*.9,H*.85,1,RED);A(W*.88,H*.8,-W*.1,-H*.12,RED,'',2.5);TB('O₂ → H₂O',W*.86,H*.93,DRED,14);b4al(1);b4ans(p,'C : chaîne respiratoire',GREEN,H-20);}},
 /* 3 fermentation alcoolique */
 function(p){var x0=W*.12,w=W*.76,y1=H*.2,h=H*.14,y2=H*.52;ctx.fillStyle='#fdece4';ctx.fillRect(x0,y1,w,h);ctx.strokeStyle=ORA2;ctx.lineWidth=2.4;ctx.strokeRect(x0,y1,w,h);TB('36 g de glucose  (0,20 mol)',x0+w/2,y1+h*.62,DRED,16);
  A(W*.5,y1+h+4,0,H*.1,GREY,'',3);TB('levures, sans air',W*.62,y1+h+H*.07,GREY,13,'left');
  if(p<=0){ctx.setLineDash([5,5]);ctx.strokeStyle=GREY;ctx.strokeRect(x0,y2,w,h);ctx.setLineDash([]);TB('? éthanol    + ? CO₂    + ? ATP',x0+w/2,y2+h*.62,GREY,16);}
  else{var f=b4r(p,0,.6),a=18.4/36;ctx.fillStyle='#e6f1fb';ctx.fillRect(x0,y2,w*a*f,h);ctx.fillStyle='#e9ecef';ctx.fillRect(x0+w*a,y2,w*(1-a)*f,h);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(x0,y2,w*f,h);if(f>.9){TB('éthanol 18,4 g',x0+w*a/2,y2+h*.62,BLUE_D,14);TB('CO₂ 17,6 g',x0+w*(a+(1-a)/2),y2+h*.62,INK,14);TB('0,40 mol',x0+w*a/2,y2+h+20,BLUE_D,14);TB('0,40 mol',x0+w*(a+(1-a)/2),y2+h+20,INK,14);TB('+ 0,40 mol d\'ATP',W*.5,y2+h+46,VIOLET,15);}}
  b4ans(p,'18,4 + 17,6 = 36 g',GREEN,H-20);},
 /* 4 rendement */
 function(p){var x0=W*.12,w=W*.76,h=H*.14;var rows=[['respiration',30,DGREEN,'30 ATP = 915 kJ  →  32 %'],['fermentation',2,ORANGE,'2 ATP = 61 kJ  →  2 %']];
  rows.forEach(function(r,i){var y=H*.28+i*H*.3;ctx.fillStyle='#eceef1';ctx.fillRect(x0,y,w,h);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(x0,y,w,h);TB(r[0],x0,y-10,INK,14,'left');TB('2 870 kJ',x0+w,y-10,GREY,14,'right');
   var fr=r[1]*30.5/2870*(p>0?b4r(p,i*.2,i*.2+.5):0);ctx.fillStyle=r[2];ctx.fillRect(x0,y,Math.max(0,w*fr),h);
   if(p>0&&b4r(p,i*.2,i*.2+.5)>.9)TB(r[3],x0+w*.4,y+h+22,dk(r[2]),14,'left');else if(p<=0)TB('? %',x0+w*.5,y+h*.64,GREY,18);});
  if(p>0){b4al(b4r(p,.5,1));TB('15 fois plus de glucose',W*.5,H*.9,DRED,16);b4al(1);}},
 /* 5 cyanure */
 function(p){var y=H*.42;b4hex(W*.1,y,Math.min(20,H*.08),'#fdece4','C₆');TB('glucose',W*.1,y+H*.14,INK,13);A(W*.17,y,W*.07,0,GREY,'',2.5);b4box(W*.34,y,W*.17,H*.16,GREEN,'#fff',2);TB('glycolyse',W*.34,y+5,DGREEN,14);A(W*.44,y,W*.07,0,GREY,'',2.5);
  b4box(W*.66,y,W*.2,H*.16,ORANGE,'#fff',2);TB('Krebs + chaîne',W*.66,y+5,ORANGE,14);A(W*.77,y,W*.06,0,GREY,'',2.5);TB('30 ATP',W*.9,y+5,VIOLET,15);
  TB('cyanure',W*.66,y-H*.16,DRED,15);
  if(p<=0){TB('?',W*.66,H*.78,GREY,34);}
  if(p>0){b4al(b4r(p,0,.5));LN(W*.57,y-H*.1,W*.75,y+H*.1,RED,5);LN(W*.75,y-H*.1,W*.57,y+H*.1,RED,5);TB('+ 2 ATP',W*.34,y-H*.14,DGREEN,15);ctx.strokeStyle=ORANGE;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(W*.34,y+H*.08);ctx.lineTo(W*.34,H*.72);ctx.lineTo(W*.5,H*.72);ctx.stroke();A(W*.46,H*.72,W*.05,0,ORANGE,'',2.5);TB('lactate',W*.62,H*.72+5,DRED,16);b4al(1);b4ans(p,'2 ATP seulement · lactate qui s\'accumule',GREEN,H-20);}},
 /* 6 muscle sous effort */
 function(p){var M=b4ax(W*.12,H*.8,W*.78,H*.62,[100,300],[0,24],'puissance P (W)','lactate (mmol/L)');M.xl=W*.12;M.yb=H*.8;b4tick(M,[160,220,260],[1,10,12,16]);
  b4curve(M,function(P){return P<=160?1:1+.15*(P-160);},100,300,BLUE,3.2,200);LN(M.x(100),M.y(12),M.x(300),M.y(12),RED,2,[6,4]);TB('épuisement 12',M.x(298),M.y(12)-8,DRED,14,'right');LN(M.x(160),M.y(0),M.x(160),M.y(24),GREEN,1.5,[4,4]);TB('A = 160 W',M.x(158),M.y(21),DGREEN,14,'right');
  if(p>0){b4al(b4r(p,0,.5));[[220,10,GREEN],[260,16,RED]].forEach(function(q){LN(M.x(q[0]),M.y(0),M.x(q[0]),M.y(q[1]),GREY,1,[3,3]);DOT(M.x(q[0]),M.y(q[1]),7,q[2]);TB(String(q[1]),M.x(q[0])-12,M.y(q[1])-6,dk(q[2]),15,'right');});b4al(1);b4ans(p,'10 mmol/L (tenable) · 16 mmol/L (épuisement)',GREEN,H-20);}},
 /* 7 levures */
 function(p){var fx=[W*.25,W*.7],fh=H*.5,fw=W*.2,gb=H*.78;
  b4flask(fx[0],gb,fw,fh,'rgba(246,201,70,.4)',.4);ctx.fillStyle=INK;ctx.fillRect(fx[0]-fw*.14,gb-fh-6,fw*.28,10);for(var i=0;i<5;i++)DOT(fx[0]-fw*.15+i*fw*.08,gb-fh*.3-(i%2)*14,3.5,'#fff');
  b4flask(fx[1],gb,fw,fh,'rgba(246,201,70,.4)',.4);LN(fx[1]-fw*.14,gb-fh-2,fx[1]+fw*.14,gb-fh-2,GREY,2,[3,3]);A(fx[1]+fw*.45,gb-fh-30,-fw*.3,26,BLUE,'',2.4);TB('air',fx[1]+fw*.55,gb-fh-34,BLUE_D,13,'left');
  TB('A : fermé, sans air',fx[0],gb+22,INK,14);TB('B : ouvert, agité',fx[1],gb+22,INK,14);
  if(p>0){b4al(b4r(p,0,.5));TB('éthanol + CO₂',fx[0],H*.1,DGREEN,15);TB('2 ATP',fx[0],H*.18,VIOLET,14);TB('CO₂ + H₂O',fx[1],H*.1,DGREEN,15);TB('≈ 30 ATP · pas d\'éthanol',fx[1],H*.19,VIOLET,14);b4al(1);b4ans(p,'A : fermentation · B : respiration',GREEN,H-20);}
  else TB('?',W*.48,H*.5,GREY,34);},
 /* 8 bilan muscle */
 function(p){var items=[['0,60 mol O₂','',DRED],['0,10 mol glucose','18 g',ORANGE],['0,60 mol CO₂','15,3 L à 37 °C',GREY],['3,0 mol ATP','',VIOLET]],xs=[.13,.38,.63,.87];
  items.forEach(function(it,i){var x=W*xs[i],y=H*.45;b4box(x,y,W*.21,H*.34,it[2]===GREY?INK:it[2],'#fff',2.2);if(i===0||p>0||i===1&&false){b4al(i===0?1:b4r(p,i*.15,i*.15+.35));TB(it[0],x,y-6,dk(it[2]===GREY?INK:it[2]),Math.max(12,Math.min(15,W/32)));if(it[1])TB(it[1],x,y+18,GREY,13);b4al(1);}else TB('?',x,y+8,GREY,28);if(i<3)A(W*(xs[i]+.115),y,W*.025,0,GREY,'',2.5);});
  if(p>0){b4al(b4r(p,.5,1));TB('CO₂ ÷ O₂ = 1',W*.5,H*.8,DGREEN,17);b4al(1);}},
 /* 9 maladie mito */
 function(p){b4ell(W*.3,H*.5,W*.25,H*.36,'#faf8f4',GREY,2);b4mitoB(W*.3,H*.52,W*.26,H*.34);LN(W*.2,H*.38,W*.4,H*.66,RED,5);LN(W*.4,H*.38,W*.2,H*.66,RED,5);TB('chaîne altérée',W*.3,H*.2,DRED,14);
  TB('glycolyse + fermentation lactique',W*.3,H*.92,ORANGE,13);
  ctx.fillStyle='#fcebeb';ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.62,H*.2,W*.32,H*.6,10);ctx.fill();ctx.stroke();TB('sang',W*.78,H*.16,DRED,14);
  var n=p<=0?2:2+Math.round(14*p);for(var i=0;i<n;i++)DOT(W*.65+b4rnd(i,2)*W*.26,H*.24+b4rnd(i,3)*H*.5,5,ORANGE);TB(p>0?'lactate ↑':'lactate : ?',W*.78,H*.88,p>0?DRED:GREY,15);
  A(W*.56,H*.5,W*.05,0,ORANGE,'',3);
  b4ans(p,'fermentation lactique de compensation',GREEN,H-20);}
]);
