/* Biologie 4e · chapitre 5 · Photosynthèse : phases et facteurs */
function b4chlpl(cx,cy,rx,ry,o){o=o||{};b4ell(cx,cy,rx,ry,'#eaf6ee',DGREEN,3);b4ell(cx,cy,rx*.93,ry*.9,null,GREEN,1.2);
 var gs=[[-.5,-.3],[-.45,.25],[-.12,-.05]];gs.forEach(function(g){for(var i=0;i<4;i++)b4ell(cx+rx*g[0],cy+ry*g[1]-i*ry*.1+ry*.15,rx*.14,ry*.045,'#9fd9bf',DGREEN,1.4);});}
function b4sun(x,y,r){DOT(x,y,r,'#f6c946');for(var i=0;i<10;i++){var a=i*.628;LN(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r*1.3,x+Math.cos(a)*r*1.8,y+Math.sin(a)*r*1.8,'#f6c946',3);}}
function b4o2(x,y,s,col){DOT(x-5*s,y,5*s,col||RED);DOT(x+5*s,y,5*s,col||RED);}
function b4lcurve(L,Pm,K){return Pm*L/(K+L);}
SFA.theo("c05",{
 icon:function(){TB('6 CO₂ + 6 H₂O',W*.5,H*.4,DGREEN,Math.min(30,W/11));TB('→ C₆H₁₂O₆ + 6 O₂',W*.5,H*.68,ORANGE,Math.min(30,W/11));b4sun(W*.9,H*.17,Math.min(14,H*.06));},
 anim:function(t){var cx=W*.5,cy=H*.55,rx=W*.4,ry=H*.36;TB('Phase lumineuse (thylacoïdes) puis cycle de Calvin (stroma)',W*.5,H*.07,BLUE_D,Math.max(13,Math.min(16,W/44)));
  b4chlpl(cx,cy,rx,ry);b4sun(W*.08,H*.2,Math.min(16,H*.06));
  for(var i=0;i<4;i++){var u=((t*.008+i/4)%1);var sx=W*.14+u*(cx-rx*.5-W*.14),sy=H*.24+u*(cy-H*.07-H*.24);DOT(sx,sy,3.5,'#f6c946');LN(sx,sy,sx-14,sy-8,'#f6c946',2);}
  var gx=cx-rx*.48,gy=cy;TB('thylacoïdes',gx,cy+ry*.78,DGREEN,13);TB('stroma',cx+rx*.42,cy+ry*.78,DGREEN,13);
  /* H2O entre, O2 sort */
  for(var j=0;j<3;j++){var v=((t*.007+j/3)%1);DOT(W*.1+v*(gx-W*.1-rx*.2),cy+ry*.9+0*v-v*H*.18,4,BLUE);var w=((t*.007+j/3+.5)%1);b4o2(gx-rx*.15+w*0,cy-ry*.35-w*H*.28,.8,RED);}
  TB('H₂O',W*.1,cy+ry*.95,BLUE_D,13);TB('O₂',gx,H*.15,DRED,13);
  /* ATP, NADPH vers Calvin */
  for(var k=0;k<3;k++){var q=((t*.008+k/3)%1);DOT(gx+rx*.25+q*rx*.55,cy-ry*.1-Math.sin(q*3.14)*ry*.25,4,VIOLET);}
  TB('ATP + NADPH',cx+rx*.05,cy-ry*.55,VIOLET,13);
  /* cycle de Calvin */
  var cc={x:cx+rx*.5,y:cy};ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cc.x,cc.y,ry*.34,.3,5.6);ctx.stroke();var a0=5.6;A(cc.x+Math.cos(a0)*ry*.34,cc.y+Math.sin(a0)*ry*.34,Math.cos(a0+1.57)*10,Math.sin(a0+1.57)*10,ORANGE,'',3);
  var ang=t*.03;DOT(cc.x+Math.cos(ang)*ry*.34,cc.y+Math.sin(ang)*ry*.34,5,ORANGE);TB('Calvin',cc.x,cc.y+4,ORANGE,14);
  for(var m=0;m<3;m++){var r2=((t*.006+m/3)%1);DOT(W*.97-r2*(W*.97-cc.x-ry*.3),H*.9-r2*(H*.9-cc.y-ry*.15),4,GREY);}TB('CO₂',W*.95,H*.9-12,INK,13,'right');
  TB('glucose',cc.x+ry*.5,cc.y-ry*.5,DGREEN,13,'left');
 },
 th:'<div class="tcard"><b class="h">Équation bilan</b><p><code>6 CO<sub>2</sub> + 6 H<sub>2</sub>O + énergie lumineuse → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6 O<sub>2</sub></code></p><p>Elle a lieu dans les <b>chloroplastes</b> des cellules végétales (et algues), grâce à la <b>chlorophylle</b> qui capte la lumière. Les coefficients donnent les rapports de moles : 1 glucose pour 6 CO<sub>2</sub> et 6 O<sub>2</sub>.</p><div class="tip"><b class="h">Exemple chiffré</b><br>18 g de glucose (M = 180 g/mol) : n = 0,10 mol → CO<sub>2</sub> : 0,60 mol = 0,60 × 44 = <b>26,4 g</b> ; O<sub>2</sub> : 0,60 mol = 0,60 × 32 = <b>19,2 g</b> ; H<sub>2</sub>O : 0,60 × 18 = 10,8 g. Contrôle : 26,4 + 10,8 = 37,2 g = 18 + 19,2.</div></div>'+
 '<div class="tcard"><b class="h">Deux phases</b><ul><li><b>Phase lumineuse</b> (membranes des <b>thylacoïdes</b>) : les pigments captent la lumière, l\'eau est coupée (<b>photolyse</b>) : libération de <b>O<sub>2</sub></b>, production d\'<b>ATP</b> et de <b>NADPH</b>.</li><li><b>Cycle de Calvin</b> (<b>stroma</b>) : le CO<sub>2</sub> est fixé et réduit en sucre grâce à l\'ATP et au NADPH. Il n\'exige pas la lumière <i>directement</i> mais dépend de ses produits.</li></ul><p>Preuve : avec de l\'eau marquée au <sup>18</sup>O, c\'est O<sub>2</sub> qui est marqué ; l\'oxygène du glucose vient du CO<sub>2</sub>. Équation détaillée : 6 CO<sub>2</sub> + 12 H<sub>2</sub>O → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6 O<sub>2</sub> + 6 H<sub>2</sub>O.</p></div>'+
 '<div class="tcard"><b class="h">Pigments et spectres</b><p>La chlorophylle <b>absorbe</b> surtout le <b>bleu-violet</b> (≈ 430-450 nm) et le <b>rouge</b> (≈ 660-680 nm) ; elle <b>réfléchit le vert</b> (d\'où la couleur des feuilles). Le <b>spectre d\'action</b> (activité photosynthétique selon la couleur) ressemble au spectre d\'absorption : c\'est ce qu\'a montré Engelmann, dont les bactéries aérobies se rassemblent là où l\'O<sub>2</sub> est produit (bleu-violet et rouge).</p></div>'+
 '<div class="tcard"><b class="h">Facteurs limitants</b><p>L\'intensité photosynthétique dépend de la <b>lumière</b>, du <b>CO<sub>2</sub></b> et de la <b>température</b>. La courbe lumière-échange net d\'O<sub>2</sub> part de la valeur négative de la <b>respiration</b> (obscurité), croise 0 au <b>point de compensation</b>, puis <b>sature</b> : un autre facteur (CO<sub>2</sub>, température) devient limitant.</p><div class="tip"><b class="h">Méthode</b><br><b>Photosynthèse brute = échange net + respiration.</b> Net : 0 % → −2 ; 10 % → 0 ; 50 % → +9 ; 100 % → +12. Respiration = 2 ; brute à 50 % = 9 + 2 = <b>11</b>, à 100 % = 12 + 2 = <b>14</b> µmol/m²/s.</div></div>'+
 '<div class="warn"><b class="h">Bilan jour-nuit</b><br>14 µmol/m²/s × 12 h × 3 600 s = 604 800 µmol ≈ 605 mmol d\'O<sub>2</sub> produit ; respiration : 2 × 24 × 3 600 = 172 800 µmol ≈ 173 mmol. Net : <b>432 mmol</b> d\'O<sub>2</sub> → 432 ÷ 6 = 72 mmol de glucose ≈ 13 g par m² et par jour. La plante respire jour et nuit : seul le surplus sert à croître.</div>'
});
SFA.figs("c05",[
 /* 0 équation */
 function(p){b4sun(W*.5,H*.14,Math.min(14,H*.055));A(W*.5,H*.26,0,H*.08,'#f6c946','',3);
  TB('6 CO₂ + 6 H₂O',W*.25,H*.52,DGREEN,Math.min(24,W/17));A(W*.45,H*.48,W*.1,0,INK,'',3);
  if(p<=0){TB('?',W*.75,H*.52,GREY,36);}else{b4al(b4r(p,0,.4));TB('C₆H₁₂O₆ + 6 O₂',W*.75,H*.52,ORANGE,Math.min(24,W/17));b4al(1);}
  if(p>0){b4al(b4r(p,.3,.8));b4chlpl(W*.5,H*.75,W*.1,H*.09);TB('chloroplaste',W*.5,H*.93,DGREEN,13);TB('chlorophylle · lumière',W*.78,H*.8,DGREEN,14);b4al(1);}
  },
 /* 1 phases */
 function(p){var cx=W*.5,cy=H*.52,rx=W*.4,ry=H*.38;b4chlpl(cx,cy,rx,ry);
  var gx=cx-rx*.48;ctx.fillStyle='#fff';[['1',gx,cy-ry*.65],['2',cx+rx*.45,cy-ry*.05]].forEach(function(q){DOT(q[1],q[2],15,'#fff');ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(q[1],q[2],15,0,7);ctx.stroke();TB(q[0],q[1],q[2]+6,BLUE_D,18);});
  TB('(a) (b) ?',W*.5,H*.1,GREY,16);
  if(p>0){b4al(b4r(p,0,.5));TB('1 → (b) thylacoïdes',gx+W*.02,cy+ry*.75,DGREEN,14);TB('2 → (a) stroma',cx+rx*.45,cy+ry*.55,ORANGE,14);TB('lumière · O₂ · ATP · NADPH',gx,H*.09+0,DGREEN,13);b4al(1);b4ans(p,'1-b · 2-a',GREEN,H-18);}},
 /* 2 d'où vient O2 */
 function(p){var y=H*.4;TB('H₂¹⁸O',W*.14,y-H*.2,BLUE_D,18);DOT(W*.1,y,9,RED);DOT(W*.1+13,y+8,5,'#fff');DOT(W*.1+13,y+8,5,GREY,false);DOT(W*.1-13,y+8,5,'#fff');DOT(W*.1-13,y+8,5,GREY,false);
  TB('CO₂',W*.16,y+H*.3,INK,18);DOT(W*.09,y+H*.42,9,GREY);DOT(W*.09-16,y+H*.42,8,'#c9ccd0');DOT(W*.09+16,y+H*.42,8,'#c9ccd0');
  b4chlpl(W*.5,H*.5,W*.16,H*.2);A(W*.3,y+H*.05,W*.08,0,GREY,'',2.5);A(W*.68,y+H*.05,W*.08,0,GREY,'',2.5);
  TB('O₂',W*.84,y-H*.2,INK,18);if(p<=0){TB('¹⁸O où ?',W*.84,y+H*.05,GREY,22);TB('glucose',W*.84,y+H*.3,INK,16);}
  if(p>0){b4al(b4r(p,0,.5));b4o2(W*.84,y+H*.02,1.7,RED);TB('¹⁸O',W*.84,y+H*.22-6,DRED,18);TB('glucose : pas marqué',W*.84,y+H*.42,GREY,14);b4al(1);b4ans(p,'dans O₂ : il vient de l\'eau',GREEN,H-18);}},
 /* 3 quantités */
 function(p){var y=H*.45,xs=[.14,.37,.63,.86],nm=['6 CO₂','6 H₂O','1 C₆H₁₂O₆','6 O₂'],v=[['0,60 mol','26,4 g'],['0,60 mol','10,8 g'],['0,10 mol','18 g'],['0,60 mol','19,2 g']];
  xs.forEach(function(x,i){b4box(W*x,y,W*.2,H*.34,i<2?GREEN:ORANGE,'#fff',2.2);TB(nm[i],W*x,y-H*.08,INK,Math.max(14,Math.min(17,W/28)));
   if(i===2||p>0||i===2){var show=(i===2);if(show||p>0){b4al(show?1:b4r(p,i*.12,i*.12+.3));TB(v[i][0],W*x,y+H*.04,DGREEN,14);TB(v[i][1],W*x,y+H*.12,ORANGE,14);b4al(1);}}else{TB('? mol',W*x,y+H*.04,GREY,14);TB('? g',W*x,y+H*.12,GREY,14);}
   if(i===1)TB('+',W*(x+.13),y,INK,22);if(i===0)TB('+',W*(x+.115),y,INK,22);if(i===2)TB('+',W*(x+.125),y,INK,22);});
  A(W*.485,y-H*.28,0,0,INK);TB('→',W*.5,y-H*.26,INK,22);
  b4ans(p,'0,10 mol · 0,60 mol (26,4 g) · 0,60 mol (19,2 g)',GREEN,H-18);},
 /* 4 courbe lumière */
 function(p){var M=b4ax(W*.12,H*.84,W*.78,H*.7,[0,100],[-4,16],'éclairement (%)','O₂ net (µmol/m²/s)');M.xl=W*.12;M.yb=H*.84;b4tick(M,[10,25,50,100],[-2,0,5,9,12]);LN(M.x(0),M.y(0),M.x(100),M.y(0),AX,1.4);
  var pts=[[0,-2],[10,0],[25,5],[50,9],[100,12]];ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(M.x(q[0]),M.y(q[1])):ctx.moveTo(M.x(q[0]),M.y(q[1]));});ctx.stroke();pts.forEach(function(q){DOT(M.x(q[0]),M.y(q[1]),5,BLUE_D);});
  TB('net',M.x(75),M.y(10.5)-8,BLUE_D,14);
  if(p>0){b4al(b4r(p,0,.5));LN(M.x(0),M.y(-2),M.x(100),M.y(-2),RED,1.6,[5,4]);TB('respiration 2',M.x(60),M.y(-2)+18,DRED,14);DOT(M.x(10),M.y(0),8,GREEN);TB('compensation : 10 %',M.x(14),M.y(0)-22,DGREEN,14,'left');
   ctx.strokeStyle=GREEN;ctx.lineWidth=2.4;ctx.setLineDash([6,4]);ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(M.x(q[0]),M.y(q[1]+2)):ctx.moveTo(M.x(q[0]),M.y(q[1]+2));});ctx.stroke();ctx.setLineDash([]);
   DOT(M.x(50),M.y(11),5.5,GREEN);DOT(M.x(100),M.y(14),5.5,GREEN);TB('11',M.x(50),M.y(11)-10,DGREEN,14);TB('14',M.x(100)-8,M.y(14)-10,DGREEN,14);TB('brute',M.x(80),M.y(14)-26,DGREEN,14);b4al(1);}},
 /* 5 Engelmann */
 function(p){var x0=W*.08,w=W*.84,y=H*.42,h=H*.2;var g=ctx.createLinearGradient(x0,0,x0+w,0);['#7a3cff','#3c5cff','#2cc5ff','#2fd36a','#e8e03c','#ff9a2f','#ff3b30'].forEach(function(c,i){g.addColorStop(i/6,c);});ctx.fillStyle=g;ctx.globalAlpha=.55;ctx.fillRect(x0,y,w,h);ctx.globalAlpha=1;
  ctx.strokeStyle='#2f8a4a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x0,y+h/2);ctx.lineTo(x0+w,y+h/2);ctx.stroke();
  function den(u){return .12+.88*Math.max(Math.exp(-Math.pow((u-.1)/.1,2)),Math.exp(-Math.pow((u-.9)/.1,2)));}
  for(var i=0;i<90;i++){var u=b4rnd(i,1),d=den(u)*b4rnd(i,2)*1.0;if(b4rnd(i,2)<den(u)){DOT(x0+u*w,y-8-b4rnd(i,3)*H*.14*den(u)*1.4,3,DRED);}}
  TB('400 nm',x0,y+h+18,GREY,13,'left');TB('700 nm',x0+w,y+h+18,GREY,13,'right');TB('filament d\'algue + bactéries aérobies',W*.5,H*.1,INK,15);
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=DGREEN;ctx.lineWidth=3;ctx.beginPath();for(var k=0;k<=100;k++){var uu=k/100,v=.15+.85*Math.max(Math.exp(-Math.pow((uu-.12)/.1,2)),.85*Math.exp(-Math.pow((uu-.9)/.08,2)));k?ctx.lineTo(x0+uu*w,H*.9-v*H*.2):ctx.moveTo(x0+uu*w,H*.9-v*H*.2);}ctx.stroke();TB('absorption de la chlorophylle',W*.5,H*.73,DGREEN,13);b4al(1);b4ans(p,'photosynthèse maximale : bleu-violet et rouge',GREEN,H-14);}},
 /* 6 saturation */
 function(p){var M=b4ax(W*.12,H*.78,W*.78,H*.62,[0,100],[0,16],'éclairement (%)','O₂ net');M.xl=W*.12;M.yb=H*.78;b4tick(M,[25,50,80,100],[]);
  b4curve(M,function(L){return b4lcurve(L,13,22)-1.5*0;},0,100,BLUE,3.2,100);DOT(M.x(80),M.y(b4lcurve(80,13,22)),6,RED);DOT(M.x(100),M.y(b4lcurve(100,13,22)),6,RED);TB('80 → 100 %',M.x(90),M.y(b4lcurve(90,13,22))+30,DRED,14);
  if(p<=0)TB('plateau ? pourquoi',M.x(30),M.y(14),GREY,16);
  if(p>0){b4al(b4r(p,0,.5));b4curve(M,function(L){return b4lcurve(L,22,40);},0,100,GREEN,3,100);TB('+ CO₂ (ou T)',M.x(60),M.y(b4lcurve(60,22,40))-10,DGREEN,14);TB('limite : CO₂ / température',M.x(62),M.y(5),ORANGE,14);b4al(1);b4ans(p,'un autre facteur devient limitant',GREEN,H-18);}},
 /* 7 éteindre la lumière */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.56,[-10,40],[0,1.2],'temps (s)','activité');M.xl=W*.12;M.yb=H*.76;b4tick(M,[-10,0,20,40],[]);
  ctx.fillStyle='rgba(246,201,70,.3)';ctx.fillRect(M.x(-10),M.y(1.2),M.x(0)-M.x(-10),M.y(0)-M.y(1.2));ctx.fillStyle='rgba(60,60,80,.12)';ctx.fillRect(M.x(0),M.y(1.2),M.x(40)-M.x(0),M.y(0)-M.y(1.2));TB('lumière',M.x(-5),M.y(.1),'#8a6a00',14);TB('obscurité',M.x(20),M.y(1.2)+16,GREY,14);
  ctx.strokeStyle=RED;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(M.x(-10),M.y(1));ctx.lineTo(M.x(0),M.y(1));ctx.lineTo(M.x(0),M.y(0));ctx.lineTo(M.x(40),M.y(0));ctx.stroke();TB('dégagement d\'O₂',M.x(-9.5),M.y(1)+18,DRED,13,'left');
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(M.x(-10),M.y(.85));ctx.lineTo(M.x(0),M.y(.85));ctx.lineTo(M.x(20),M.y(0));ctx.lineTo(M.x(40),M.y(0));ctx.stroke();TB('fixation du CO₂',M.x(8),M.y(.55),ORANGE,14,'left');
  if(p>0){b4al(b4r(p,0,.5));DOT(M.x(20),M.y(0),6,ORANGE);TB('≈ 20 s',M.x(20),M.y(0)+32,ORANGE,14);TB('photolyse : lumière directe',M.x(1),M.y(1)-8,DRED,13,'left');TB('réserve d\'ATP + NADPH',M.x(21),M.y(.3),'#8a5a17',13,'left');b4al(1);b4ans(p,'O₂ : lumière directe · Calvin : réserves ATP/NADPH',GREEN,H-18);}},
 /* 8 bilan 24 h */
 function(p){var x0=W*.08,w=W*.84,y=H*.2,h=H*.12;ctx.fillStyle='#fdf3c8';ctx.fillRect(x0,y,w/2,h);ctx.fillStyle='#c9ccd6';ctx.fillRect(x0+w/2,y,w/2,h);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(x0,y,w,h);TB('jour 12 h',x0+w/4,y+h*.62,'#8a6a00',15);TB('nuit 12 h',x0+w*.75,y+h*.62,INK,15);
  TB('brute : 14 µmol/m²/s',x0+w/4,y-8,DGREEN,13);TB('respiration : 2 µmol/m²/s, jour et nuit',x0+w*.62,y+h+18,DRED,13);
  var M=b4ax(W*.14,H*.9,W*.7,H*.42,[0,4],[0,700],'','mmol/m²');M.xl=W*.14;M.yb=H*.9;
  var vals=[605,173,432],nm=['produit','respiration','net'],col=[GREEN,RED,BLUE];
  vals.forEach(function(v,i){var x=M.x(i+.5),f=p<=0?.0:b4r(p,i*.15,i*.15+.4);if(p<=0){ctx.setLineDash([4,4]);ctx.strokeStyle=GREY;ctx.strokeRect(x-W*.06,M.y(300),W*.12,M.y(0)-M.y(300));ctx.setLineDash([]);TB('?',x,M.y(150)+6,GREY,24);}else{ctx.fillStyle=col[i]+'44';ctx.strokeStyle=col[i];ctx.lineWidth=2;var hh=(M.y(0)-M.y(v))*f;ctx.fillRect(x-W*.06,M.y(0)-hh,W*.12,hh);ctx.strokeRect(x-W*.06,M.y(0)-hh,W*.12,hh);if(f>.9)TB(String(v),x,M.y(v)-6,dk(col[i]),14);}TB(nm[i],x,M.y(0)+18,INK,13);});
  if(p>0){b4al(b4r(p,.5,1));TB('432 ÷ 6 = 72 mmol',W*.9,H*.58,DGREEN,14,'right');TB('≈ 13 g de glucose',W*.9,H*.66,DGREEN,14,'right');b4al(1);}},
 /* 9 double marquage */
 function(p){var bx=[[.1,'6 CO₂',12,0],[.3,'12 H₂O',12,1],[.57,'C₆H₁₂O₆',6,0],[.75,'6 O₂',12,1],[.92,'6 H₂O',6,0]];
  bx.forEach(function(b,i){var x=W*b[0],y=H*.42;b4box(x,y,W*(i===0?.16:.16),H*.4,i<2?GREEN:ORANGE,'#fff',2);TB(b[1],x,y-H*.14,INK,Math.max(13,Math.min(15,W/32)));
   for(var k=0;k<b[2];k++){var cx=x-W*.05+(k%4)*W*.033,cy=y-H*.04+Math.floor(k/4)*H*.1;var marked=(i===1)||(i>=3&&b[3]&&p>0&&i===3);var col=(i<2)?(b[3]?RED:'#b9bec6'):(p<=0?'#e6e8eb':(i===3?RED:'#b9bec6'));DOT(cx,cy,Math.min(9,W*.012+3),col);}
   if(i===1)TB('(¹⁸O)',x,y+H*.24,DRED,13);if(i===0)TB('(¹⁶O)',x,y+H*.24,GREY,13);});
  TB('→',W*.44,H*.42,INK,22);TB('+',W*.2,H*.42,INK,20);TB('+',W*.665,H*.42,INK,20);TB('+',W*.835,H*.42,INK,20);
  if(p<=0)TB('où est le ¹⁸O ?',W*.5,H*.12,GREY,18);
  b4ans(p,'seul O₂ contient le ¹⁸O',GREEN,H-18);}
]);
