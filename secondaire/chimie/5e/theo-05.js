/* Chimie 5e · chapitre 5 : théorie animée et devantures */
function k5_tcol(T){var f=Math.max(0,Math.min(1,(T-0)/100));return 'rgb('+Math.round(70+185*f)+','+Math.round(140-60*f)+','+Math.round(230-170*f)+')';}
/* thermomètre : base (x,yb), hauteur h, graduations Tmin..Tmax, valeur T */
function k5_thermo(x,yb,h,T,Tmin,Tmax,lab){var f=Math.max(0,Math.min(1,(T-Tmin)/(Tmax-Tmin)));
 k5_rr(x-6,yb-h,12,h,'#fff',INK,1.8,6);ctx.fillStyle=k5_tcol(T);ctx.fillRect(x-3,yb-h*f-2,6,h*f+2);DOT(x,yb+7,9,k5_tcol(T));k5_ring(x,yb+7,9,INK,1.8);
 if(lab!==false)TB(Math.round(T*10)/10+' °C'.replace('.',','),x,yb-h-8,k5_tcol(T)===0?INK:dk(RED),13);}
function k5_tf(v,d){return (d==null?1:d)===0?String(Math.round(v)):v.toFixed(d).replace('.',',');}
/* particules : n points qui s'agitent avec une vitesse liée à la température */
function k5_part(x,y,w,h,n,T,t,col){for(var i=0;i<n;i++){var sp=.012+T*.00055,a=i*2.399+t*sp*(1+(i%3)*.3),b=i*1.7+t*sp*1.3*(1+(i%2)*.2);
  var px=x+w*(.5+.42*Math.sin(a+Math.sin(b)*.6)),py=y+h*(.5+.42*Math.sin(b*1.1+i));DOT(px,py,3.6,col||k5_tcol(T));}}
function k5_glass(x,y,w,h,T,t,n,lvl){var lv=lvl==null?.7:lvl;ctx.fillStyle=k5_tcol(T)+'33';ctx.fillStyle='rgba(120,170,230,.18)';
 ctx.fillRect(x+2,y+h*(1-lv),w-4,h*lv-2);k5_beaker(x,y,w,h,null,0);k5_part(x+2,y+h*(1-lv),w-4,h*lv,n||10,T,t);}

SFA.theo("c05", {
 icon: function () {
  TB('Q = m·c·ΔT',W*.5,H*.42,BLUE_D,30);TB('ΔH < 0 · ΔH > 0',W*.5,H*.68,ORANGE,18);
  k5_thermo(W*.12,H*.82,H*.5,70,0,100,false);k5_thermo(W*.88,H*.82,H*.5,25,0,100,false);},
 anim: function (t) {
  var s=(t%520)/520,k=k5_seg(s,.25,.75),Th=80-24*k,Tc=20+36*k;
  var bw=Math.min(W*.24,150),bh=H*.52,by=H*.2;
  var xh=W*.12,xc=W*.64;
  k5_glass(xh,by,bw,bh,Th,t,12);k5_glass(xc,by,bw,bh,Tc,t,12);
  TB('300 g',xh+bw/2,by-8,INK,14);TB('200 g',xc+bw/2,by-8,INK,14);
  k5_thermo(xh+bw+34,by+bh-4,bh*.8,Th,0,100);k5_thermo(xc-34,by+bh-4,bh*.8,Tc,0,100);
  var ax=xh+bw+70,bx=xc-70;
  if(k<.98){A(ax,H*.45,(bx-ax)*(1-k*.7),0,RED,'',3.4);TB('Q',(ax+bx)/2,H*.4,DRED,18);}
  TB('chaleur : de chaud vers froid',W*.5,H*.1,BLUE_D,Math.min(16,W*.026));
  TB(k<.05?'Q perdue = Q gagnée':k>.95?'équilibre : T = 56 °C':'les températures se rapprochent',W*.5,H*.9,k>.95?DGREEN:GREY,15);
  TB('m·c·(80 − T) = m·c·(T − 20)',W*.5,H*.97,GREY,12);},
 th: '<div class="tcard"><b class="h">Chaleur et température</b><p>La <b>température</b> T mesure l\'agitation moyenne des particules (en K : T = θ + 273,15). La <b>chaleur</b> Q est de l\'énergie qui passe spontanément du corps chaud vers le corps froid (en J ou kJ). Deux corps à la même température n\'échangent pas de chaleur. Piège : un corps ne « contient » pas de la chaleur, il a une énergie interne.</p></div><div class="tcard"><b class="h">Q = m·c·ΔT</b><p>Pour échauffer une masse m (g) de chaleur massique c (J/(g·K)) de ΔT = T<sub>f</sub> − T<sub>i</sub> : <b>Q = m·c·ΔT</b>. Pour l\'eau, c = 4,18 J/(g·K). Un échauffement en K et en °C est le même nombre.</p><p><i>Exemple :</i> 250 g d\'eau de 20 °C à 60 °C : Q = 250 × 4,18 × 40 = 41 800 J = 41,8 kJ.</p><p>À Q égal, ΔT = Q/(m·c) est <b>inversement proportionnel à c</b> : 500 J donnent +130 K à 10 g de cuivre (c = 0,385) mais seulement +12 K à 10 g d\'eau.</p><p><b>Mélange sans perte</b> : Q<sub>perdue</sub> = Q<sub>gagnée</sub>. Avec 300 g à 80 °C et 200 g à 20 °C : 300 (80 − T) = 200 (T − 20), d\'où T = 56 °C ; Q = 300 × 4,18 × 24 = 30 096 J des deux côtés. Pour un changement d\'état, on ajoute m·L (glace : L = 334 J/g, à température constante).</p></div><div class="tcard"><b class="h">Effet thermique d\'une transformation : ΔH</b><p>Une transformation <b>exothermique</b> libère de l\'énergie : ΔH &lt; 0, la température du milieu monte (combustion, poche chauffante). Une transformation <b>endothermique</b> en absorbe : ΔH &gt; 0, la température baisse (poche de froid, dissolution de NH₄NO₃, décomposition de CaCO₃).</p><p>Au niveau des liaisons : <b>ΔH = Σ E(liaisons rompues) − Σ E(liaisons formées)</b>. Avec 1 500 kJ rompus et 1 700 kJ formés : ΔH = −200 kJ, exothermique.</p></div><div class="tcard"><b class="h">Diagramme énergétique</b><p>On trace l\'énergie le long de la réaction : réactifs, <b>sommet de la barrière</b> (état de transition), produits. L\'<b>énergie d\'activation</b> E<sub>a</sub> est la hauteur de la barrière à partir des réactifs ; <b>ΔH = H(produits) − H(réactifs)</b>. La réaction inverse a E<sub>a,inv</sub> = E<sub>a</sub> − ΔH.</p><p><i>Exemple :</i> produits à +120 kJ/mol, sommet à +200 kJ/mol : ΔH = +120 (endothermique), E<sub>a</sub> = 200, E<sub>a,inv</sub> = 200 − 120 = 80 kJ/mol.</p></div>'
});

SFA.figs("c05", [
 /* 0 · chauffer 250 g d'eau */
 function (p) {
  var k=k5_seg(p,0,.8),T=20+40*k,bx=W*.2,bw=W*.28,by=H*.2,bh=H*.52;
  ctx.fillStyle='rgba(120,170,230,.22)';ctx.fillRect(bx+2,by+bh*.25,bw-4,bh*.75-2);k5_beaker(bx,by,bw,bh,null,0);
  TB('250 g',bx+bw/2,by+bh*.62,BLUE_D,15);
  /* flamme */
  var fx=bx+bw/2,fy=by+bh+22;ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(fx,fy-24);ctx.quadraticCurveTo(fx+14,fy,fx,fy+6);ctx.quadraticCurveTo(fx-14,fy,fx,fy-24);ctx.fill();
  ctx.fillStyle=YEL;ctx.beginPath();ctx.moveTo(fx,fy-12);ctx.quadraticCurveTo(fx+7,fy,fx,fy+4);ctx.quadraticCurveTo(fx-7,fy,fx,fy-12);ctx.fill();
  k5_thermo(bx+bw+36,by+bh-6,bh*.85,T,0,80,false);TB(k5_tf(T,0)+' °C',bx+bw+36,by+bh*.12,k5_tcol(T)==='x'?INK:DRED,14);
  TB('20 °C → 60 °C',W*.78,H*.2,BLUE_D,15);
  if(p>0){ctx.globalAlpha=k5_seg(p,.3,1);TB('Q = m · c · ΔT',W*.78,H*.4,INK,16);TB('= 250 × 4,18 × 40',W*.78,H*.54,INK,15);TB('= 41 800 J',W*.78,H*.7,DGREEN,22);TB('= 41,8 kJ',W*.78,H*.84,DGREEN,16);ctx.globalAlpha=1;}
  else TB('Q = ?',W*.78,H*.5,GREY,28);
 },
 /* 1 · exo ou endo */
 function (p) {
  var cards=[['ΔH = −57','réaction',true],['NH₄NO₃','poche de froid',false],['poche','chauffante',true],['CaCO₃','décomposition',false]];
  var bw=W*.21,gx=W*.03,x0=W*.04,y=H*.1,h=H*.6;
  cards.forEach(function(c,i){var x=x0+i*(bw+gx),k=k5_seg(p,i*.12,i*.12+.35),ex=c[2];
   k5_rr(x,y,bw,h,'#f6f8fb',p>0?(ex?RED:BLUE):GREY,2);
   TB(c[0],x+bw/2,y+28,INK,14);TB(c[1],x+bw/2,y+46,GREY,12);
   var ty=y+h*.5;
   k5_thermo(x+bw/2,y+h-22,h*.38,ex?(p>0?70:40):(p>0?10:40),0,80,false);
   if(p>0){ctx.globalAlpha=k;A(x+bw/2+22,y+h*.8,0,ex?-34:34,ex?RED:BLUE,'',3);ctx.globalAlpha=1;}});
  [['+',-57],['+',26],['',0],['',178]];
  if(p>0){var lab=[['exo','ΔH < 0','T ↑'],['endo','ΔH > 0','T ↓'],['exo','ΔH < 0','T ↑'],['endo','ΔH > 0','T ↓']];
   lab.forEach(function(l,i){var x=x0+i*(bw+gx);ctx.globalAlpha=k5_seg(p,i*.12,i*.12+.35);TB(l[0]+'thermique',x+bw/2,H*.8,cards[i][2]?DRED:BLUE_D,14);TB(l[2]+' du milieu',x+bw/2,H*.92,GREY,12);ctx.globalAlpha=1;});}
  else TB('exothermique ou endothermique ?',W*.5,H*.88,GREY,15);
  if(p<=0){TB('(a)',x0+bw/2,H*.8,GREY,13);TB('(b)',x0+bw*1.5+gx,H*.8,GREY,13);TB('(c)',x0+bw*2.5+gx*2,H*.8,GREY,13);TB('(d)',x0+bw*3.5+gx*3,H*.8,GREY,13);}
 },
 /* 2 · cuivre contre eau */
 function (p) {
  var k=k5_seg(p,0,.8),yb=H*.8,sc=H*.6/130;
  LN(W*.1,yb,W*.9,yb,AX,1.6);TB('ΔT (K) pour 500 J',W*.5,H*.08,BLUE_D,15);
  [[W*.25,129.9,'10 g de cuivre','c = 0,385',ORANGE],[W*.65,11.96,'10 g d\'eau','c = 4,18',BLUE]].forEach(function(b){var h=p>0?b[1]*sc*k:0,x=b[0],w=W*.16;
   if(p>0){ctx.fillStyle=b[4]+'55';ctx.fillRect(x,yb-h,w,h);ctx.strokeStyle=b[4];ctx.lineWidth=2;ctx.strokeRect(x,yb-h,w,h);if(k>.8)TB('≈ '+(b[1]>100?'130':'12,0')+' K',x+w/2,yb-h-8,b[4]===ORANGE?DRED:BLUE_D,16);}
   else TB('?',x+w/2,yb-60,GREY,30);
   TB(b[2],x+w/2,yb+20,INK,14);TB(b[3],x+w/2,yb+37,GREY,12);});
  if(p>.8){ctx.globalAlpha=k5_seg(p,.8,1);TB('rapport ≈ 11',W*.45,H*.35,DRED,18);ctx.globalAlpha=1;}
 },
 /* 3 · eau ou fer */
 function (p) {
  var k=k5_seg(p,0,.8),bw=W*.22;
  [[W*.2,'100 g d\'eau','c = 4,18',BLUE,4.18],[W*.62,'100 g de fer','c = 0,45',ORANGE,0.45]].forEach(function(b,i){var x=b[0];
   k5_rr(x,H*.4,bw,H*.3,b[3]+'22',b[3],2);TB(b[1],x+bw/2,H*.58,INK,14);
   A(x+bw/2,H*.92,0,-H*.2,RED,'',3.4);TB('même Q',x+bw/2+34,H*.85,DRED,13,'left');
   var T=20+(i?(p>0?70*k:0):(p>0?7.5*k:0));k5_thermo(x+bw+22,H*.72,H*.46,T,15,95,false);
   if(p>0&&k>.6){TB(i?'+ 9 × plus':'petit ΔT',x+bw/2,H*.3,i?DRED:BLUE_D,15);}});
  TB('lequel s\'échauffe le plus ?',W*.5,H*.1,BLUE_D,16);
  if(p>.8){ctx.globalAlpha=k5_seg(p,.8,1);TB('ΔT = Q/(m·c) : c petit → ΔT grand',W*.5,H*.2,DGREEN,14);ctx.globalAlpha=1;}
 },
 /* 4 · mélange */
 function (p) {
  var k=k5_seg(p,0,.7),bw=W*.2,by=H*.2,bh=H*.45;
  k5_glass(W*.05,by,bw,bh,80,0,9);k5_glass(W*.3,by,bw,bh,20,0,7,.5);TB('300 g · 80 °C',W*.05+bw/2,by-8,DRED,13);TB('200 g · 20 °C',W*.3+bw/2,by-8,BLUE_D,13);
  A(W*.52,by+bh*.4,W*.08,0,GREY,'',2.4);
  var ex=W*.7;k5_glass(ex,by,bw*1.3,bh,56,0,14,.8);
  TB(p>0?'56 °C':'T = ?',ex+bw*.65,by-8,p>0?DGREEN:GREY,16);
  if(p>0){ctx.globalAlpha=k;TB('Q perdue = 300 × 4,18 × 24',W*.5,H*.78,DRED,14);TB('Q gagnée = 200 × 4,18 × 36',W*.5,H*.88,BLUE_D,14);TB('= 30 096 J',W*.5,H*.97,DGREEN,16);ctx.globalAlpha=1;}
  else TB('température d\'équilibre ?',W*.5,H*.88,GREY,15);
 },
 /* 5 · diagramme énergétique */
 function (p) {
  var k=k5_seg(p,0,.7),x0=W*.12,top=H*.08,bot=H*.88,Y=function(E){return bot-(E/200)*(bot-top)*.9-6;};
  LN(x0,top,x0,bot+4,AX,1.6);LN(x0,bot,W*.95,bot,AX,1.6);TB('énergie (kJ/mol)',x0+6,top+8,GREY,12,'left');TB('avancement',W*.95,bot+16,GREY,12,'right');
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x0+4,Y(0));ctx.lineTo(W*.3,Y(0));ctx.bezierCurveTo(W*.42,Y(0),W*.4,Y(200),W*.55,Y(200));ctx.bezierCurveTo(W*.7,Y(200),W*.66,Y(120),W*.78,Y(120));ctx.lineTo(W*.93,Y(120));ctx.stroke();
  TB('réactifs',W*.2,Y(0)+18,INK,14);TB('produits',W*.84,Y(120)-12,INK,14);TB('sommet',W*.55,Y(200)-10,INK,13);
  LN(W*.22,Y(0),W*.95,Y(0),GREY,1,[3,3]);
  if(p>0){ctx.globalAlpha=k;A(W*.9,Y(0),0,Y(120)-Y(0)+4,DGREEN,'',3);tag('ΔH = +120',W*.78,(Y(0)+Y(120))/2+4,DGREEN,15);
   A(W*.36,Y(0),0,Y(200)-Y(0)+4,RED,'',3);tag('Eₐ = 200',W*.25,Y(100),DRED,15);
   A(W*.66,Y(200),0,Y(120)-Y(200)-4,VIOLET,'',3);tag('Eₐ inv = 80',W*.76,Y(170),'#5249B5',14);ctx.globalAlpha=1;}
  else TB('ΔH ? Eₐ inverse ?',W*.5,H*.5,GREY,16);
 },
 /* 6 · métal mystère */
 function (p) {
  var k=k5_seg(p,0,.7),yb=H*.84,sc=H*.6/1.0,x0=W*.1;
  LN(x0,yb,W*.95,yb,AX,1.6);TB('c (J/(g·K))',W*.1,H*.1,BLUE_D,14,'left');
  var m=[['Al',.90],['Fe',.45],['Cu',.385],['Pb',.129]],bw=W*.12;
  m.forEach(function(q,i){var x=W*.12+i*(bw+W*.04),h=q[1]*sc,hl=p>0&&q[0]==='Fe';
   ctx.fillStyle=hl?'#bfe7d8':'#e4e8ee';ctx.fillRect(x,yb-h,bw,h);ctx.strokeStyle=hl?GREEN:GREY;ctx.lineWidth=hl?3:1.6;ctx.strokeRect(x,yb-h,bw,h);
   TB(q[0],x+bw/2,yb+18,INK,15);tag(k5_tf(q[1],q[1]===.45?2:q[1]===.9?2:3),x+bw/2,yb-h-10,hl?DGREEN:GREY,13);});
  var my=yb-.4516*sc;
  if(p>0){ctx.globalAlpha=k;LN(x0,my,W*.74,my,RED,2.2,[5,4]);TB('c ≈ 0,45',W*.76,my+5,DRED,15,'left');
   TB('(200 × 4,18 × 4,1) / (100 × 75,9)',W*.5,H*.07,INK,13);TB('avec C = 40 J/K : c ≈ 0,47 → toujours le fer',W*.5,H*.96,DGREEN,12);ctx.globalAlpha=1;}
  else{TB('100 g à 100 °C → 200 g d\'eau à 20 °C',W*.5,H*.05,GREY,13);TB('T_eq = 24,1 °C : quel métal ?',W*.7,H*.5,GREY,14);}
 },
 /* 7 · bilan des liaisons */
 function (p) {
  var k=k5_seg(p,0,.8),yb=H*.5,sc=H*.34/1500,bw=W*.16;
  var Y=function(E){return yb-E*sc;};
  LN(W*.06,yb,W*.94,yb,AX,1.4,[4,4]);TB('0',W*.05,yb+4,GREY,12,'right');
  var x1=W*.1,x2=W*.4,x3=W*.7;
  ctx.fillStyle='#fcebeb';ctx.fillRect(x1,Y(1500),bw,Y(0)-Y(1500));ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.strokeRect(x1,Y(1500),bw,Y(0)-Y(1500));
  TB('liaisons rompues',x1+bw/2,Y(1500)-24,DRED,13);TB('+1 500 kJ',x1+bw/2,Y(1500)-8,DRED,15);
  if(p>0){var h2=(Y(-200)-Y(1500))*k;ctx.fillStyle='#e6f1fb';ctx.fillRect(x2,Y(1500),bw,h2);ctx.strokeStyle=BLUE;ctx.strokeRect(x2,Y(1500),bw,h2);TB('liaisons formées',x2+bw/2,Y(1500)-24,BLUE_D,13);TB('−1 700 kJ',x2+bw/2,Y(1500)-8,BLUE_D,15);
   var c=k5_seg(p,.6,1);ctx.globalAlpha=c;ctx.fillStyle='#e8f7f1';ctx.fillRect(x3,Y(0),bw,Y(-200)-Y(0));ctx.strokeStyle=GREEN;ctx.strokeRect(x3,Y(0),bw,Y(-200)-Y(0));
   TB('ΔH = −200 kJ',x3+bw/2,Y(-200)+20,DGREEN,16);TB('exothermique',x3+bw/2,Y(-200)+38,DGREEN,13);ctx.globalAlpha=1;}
  else{TB('?',x2+bw/2,yb-40,GREY,30);TB('?',x3+bw/2,yb+10,GREY,30);}
  TB('ΔH = rompues − formées',W*.5,H*.95,GREY,14);
 },
 /* 8 · chauffe-eau solaire */
 function (p) {
  var k=k5_seg(p,0,.7);
  /* soleil */
  var sx=W*.14,sy=H*.2;DOT(sx,sy,18,'#ffd75a');for(var i=0;i<10;i++){var a=i*PI/5;LN(sx+Math.cos(a)*24,sy+Math.sin(a)*24,sx+Math.cos(a)*34,sy+Math.sin(a)*34,ORANGE,3);}
  A(sx+30,sy+24,70,46,ORANGE,'',2.4);TB('600 W/m²',sx+66,sy+20,ORANGE,13,'left');
  /* capteur */
  ctx.save();ctx.translate(W*.34,H*.58);ctx.rotate(-.35);ctx.fillStyle='#2a4f7c';ctx.fillRect(-48,-8,96,16);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(-48,-8,96,16);ctx.restore();TB('3,0 m² · 50 %',W*.34,H*.78,BLUE_D,13);
  /* ballon */
  var bx=W*.6,by=H*.34,bw=W*.16,bh=H*.46;k5_rr(bx,by,bw,bh,'#eaf2fb',INK,2.2,16);
  ctx.fillStyle='rgba(226,75,74,'+(.12+.3*(p>0?k:0))+')';ctx.beginPath();ctx.roundRect(bx+3,by+3,bw-6,bh-6,14);ctx.fill();TB('200 L',bx+bw/2,by+bh/2,INK,15);
  LN(W*.4,H*.6,bx,H*.6,RED,3);
  k5_thermo(bx+bw+26,by+bh-6,bh*.7,15+40*(p>0?k:0),0,60,false);TB('15 → 55 °C',bx+bw+26,by-8,DRED,13);
  if(p>0){ctx.globalAlpha=k;TB('E = 33,4 MJ ≈ 9,29 kWh',W*.5,H*.07,DGREEN,14);TB('P utile = 3,0 × 600 × 0,5 = 900 W → ≈ 10,3 h',W*.5,H*.93,INK,13);TB('résistance 2 kW : ≈ 4,6 h',W*.5,H*.99,GREY,12);ctx.globalAlpha=1;}
  else TB('combien d\'heures ?',W*.5,H*.93,GREY,15);
 },
 /* 9 · glaçon dans un verre */
 function (p) {
  var k=k5_seg(p,0,.7),bx=W*.06,bw=W*.3,by=H*.22,bh=H*.55;
  ctx.fillStyle='rgba(120,170,230,.2)';ctx.fillRect(bx+2,by+bh*.25,bw-4,bh*.75-2);k5_beaker(bx,by,bw,bh,null,0);
  var cs=W*.1*(1-(p>0?k:0));ctx.fillStyle='rgba(235,245,252,.97)';ctx.fillRect(bx+bw/2-cs/2,by+bh*.25-cs*.8,cs,cs);ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.strokeRect(bx+bw/2-cs/2,by+bh*.25-cs*.8,cs,cs);
  TB('20 g · 0 °C',bx+bw/2,by-8,BLUE_D,13);TB('200 g · 25 °C',bx+bw/2,by+bh+20,DRED,13);
  /* énergies */
  var x0=W*.5,yb=H*.74,sc=H*.5/20900,w1=W*.12;
  LN(x0-6,yb,W*.97,yb,AX,1.4);
  ctx.fillStyle='#fcebeb';ctx.fillRect(x0+4,yb-20900*sc,w1,20900*sc);ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.strokeRect(x0+4,yb-20900*sc,w1,20900*sc);TB('eau → 0 °C',x0+4+w1/2,yb+17,DRED,12);TB('20 900 J',x0+4+w1/2,yb-20900*sc-6,DRED,13);
  ctx.fillStyle='#e6f1fb';ctx.fillRect(x0+w1+24,yb-6680*sc,w1,6680*sc);ctx.strokeStyle=BLUE;ctx.strokeRect(x0+w1+24,yb-6680*sc,w1,6680*sc);TB('fusion',x0+w1+24+w1/2,yb+17,BLUE_D,12);TB('6 680 J',x0+w1+24+w1/2,yb-6680*sc-6,BLUE_D,13);
  if(p>0){ctx.globalAlpha=k;TB('20 900 > 6 680 :',W*.77,H*.06,DGREEN,13);TB('toute la glace fond',W*.77,H*.13,DGREEN,13);TB('T_f ≈ 15,5 °C',W*.77,H*.93,DGREEN,18);ctx.globalAlpha=1;}
  else TB('toute la glace fond-elle ?',W*.5,H*.95,GREY,15);
 }
]);
