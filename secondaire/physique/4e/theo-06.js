/* Physique 4e · chapitre 6 : conservation et dégradation de l'énergie (aides q_* de theo-01.js / theo-02.js) */
function q6_stack(x,y,w,h,parts,minLab){var cx=x;parts.forEach(function(o){var ww=w*o[0];ctx.fillStyle=o[2];ctx.fillRect(cx,y,ww,h);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(cx,y,ww,h);if(ww>(minLab||34))TB(o[1],cx+ww/2,y+h/2+5,'#fff',13);cx+=ww;});}
function q6_ramp(xl,xr,yt,R,fl){ctx.strokeStyle=INK;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(xl,yt);ctx.arc(xl+R,yt,R,PI,PI/2,true);ctx.lineTo(xr-R,fl);ctx.arc(xr-R,yt,R,PI/2,0,true);ctx.stroke();}

SFA.theo("c06", {
 icon: function(){TB('Eᵢ = Ef + Q',W*.5,H*.42,BLUE_D,34);TB('rien ne se perd, tout se dégrade',W*.5,H*.66,ORANGE,17);},
 anim: function(t){
  var c=60,hs=[1],k;for(k=1;k<=5;k++)hs.push(Math.pow(.8,k));
  var T=[c*1];for(k=1;k<=5;k++)T.push(2*c*Math.sqrt(hs[k]));var tot=0;T.forEach(function(v){tot+=v;});
  var tt=t%(tot+70),h=0,n=0,acc=0,done=false;
  if(tt>=tot){h=0;n=5;}else{for(k=0;k<=5;k++){if(tt<acc+T[k]){var u=(tt-acc)/T[k];h=k==0?hs[0]*(1-u*u):hs[k]*(1-(2*u-1)*(2*u-1));n=k;done=true;break;}acc+=T[k];}}
  var Hh=H*.74,top=H*.1,gy=top+Hh,x=W*.2;floor(x-70,x+70,gy+12);
  LN(x-60,top,x+60,top,ORANGE,1.5,[5,4]);TB('Em initiale',x+64,top+4,ORANGE,12,'left');
  for(k=1;k<=n&&k<=5;k++){LN(x-40,gy-hs[k]*Hh,x+40,gy-hs[k]*Hh,'#d8dce0',1.4,[4,4]);}
  BALL(x,gy-h*Hh-10,10);
  var Em=n==0?1-(1-1)*0:Math.pow(.8,n);if(tt>=tot)Em=Math.pow(.8,5);if(n==0)Em=1;
  var bx=W*.5,by=H*.86,bh=H*.62;ctx.fillStyle='rgba(55,138,221,.45)';ctx.fillRect(bx,by-bh*Em,70,bh*Em);ctx.fillStyle='rgba(226,75,74,.45)';ctx.fillRect(bx,by-bh,70,bh*(1-Em));ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(bx,by-bh,70,bh);
  TB('Em',bx+35,by-bh*Em/2+5,BLUE_D,15);if(Em<.9)TB('Q',bx+35,by-bh+(bh*(1-Em))/2+5,DRED,15);
  TB('énergie totale = constante',bx+35,by-bh-10,INK,14);
  TB('Em + Q = Einitiale',W*.72,H*.3,INK,16,'left');TB('Em ↘ (frottements, chocs)',W*.72,H*.3+28,BLUE_D,14,'left');TB('Q ↗ (énergie thermique)',W*.72,H*.3+52,DRED,14,'left');TB('0,8 de l\'énergie conservée',W*.72,H*.3+84,GREY,13,'left');TB('à chaque rebond',W*.72,H*.3+102,GREY,13,'left');
 },
 th: '<div class="tcard"><b class="h">L\'énergie se conserve</b><p>Dans un système isolé, l\'énergie <b>ne se crée pas et ne se perd pas</b> : elle <b>se transforme</b> (cinétique, potentielle, thermique, électrique, lumineuse…) et se <b>transfère</b>. Un bilan s\'écrit toujours : <b>énergie initiale = énergie finale + énergie dissipée</b>. Quand l\'énergie mécanique « disparaît », elle est devenue de l\'énergie thermique.</p></div>'+
 '<div class="tcard"><b class="h">La dégradation</b><p>Les frottements, les chocs, la résistance de l\'air et l\'effet Joule transforment l\'énergie utile en <b>énergie thermique</b> dispersée, qu\'on ne peut plus récupérer pour le même usage : l\'énergie se <b>dégrade</b>. C\'est pourquoi un skateur remonte moins haut à chaque traversée, qu\'une balle rebondit de moins en moins, et qu\'un <b>perpétuel mobile</b> est impossible : tout appareil a un rendement inférieur à 1 et demande un apport d\'énergie extérieur.</p></div>'+
 '<div class="tcard"><b class="h">Bilan d\'un rebond (exemple chiffré)</b><p>Balle de 0,2 kg lâchée de 1,5 m, qui remonte à 0,9 m : E<sub>m</sub> avant = 0,2 × 9,8 × 1,5 = 2,94 J ; après = 0,2 × 9,8 × 0,9 = 1,76 J. Énergie transformée en chaleur : 2,94 − 1,76 = <b>1,18 J</b>, soit 40 %. Fraction conservée : 0,9/1,5 = 0,6. Si cette fraction est constante, la hauteur est multipliée par elle à chaque rebond : après n rebonds, h = h<sub>0</sub> × f<sup>n</sup>.</p></div>'+
 '<div class="tcard"><b class="h">Sources d\'énergie</b><p><b>Renouvelables</b> (à l\'échelle d\'une vie humaine) : soleil, vent, marées, eau, biomasse. <b>Non renouvelables</b> : charbon, pétrole, gaz, uranium. Elles diffèrent par leur <b>émission de CO₂</b> par kWh (gaz 450 g ; nucléaire et éolien ≈ 12 g ; solaire 45 g), leur disponibilité (le solaire est nul la nuit) et leur coût. Une émission moyenne se calcule en pondérant par la part de chaque source : 0,30 × 450 + 0,40 × 12 + 0,20 × 12 + 0,10 × 45 ≈ 147 g/kWh.</p></div>'+
 '<div class="tcard"><b class="h">Unités et pièges</b><p>1 kWh = 3,6 × 10⁶ J ; 1 TWh = 10⁹ kWh. Une <b>puissance</b> (W) n\'est pas une énergie (kWh) : énergie = puissance × durée. Une éolienne de 5 GW installés avec un facteur de charge de 30 % fournit en moyenne 1,5 GW, soit 36 GWh par jour. Une lampe de 60 W allumée 5 h consomme 0,3 kWh, dont seulement 5 % en lumière.</p></div>'
});

SFA.figs("c06", [
 /* 1 balle qui rebondit */ function(p){
  var x=W*.28,gy=H*.88,top=H*.1,sc=(gy-top)/1.5;floor(x-60,x+60,gy+8);
  LN(x-50,gy-1.5*sc,x+50,gy-1.5*sc,BLUE,2,[5,4]);TB('1,5 m',x-56,gy-1.5*sc+5,BLUE_D,14,'right');LN(x-50,gy-.9*sc,x+50,gy-.9*sc,ORA2,2,[5,4]);TB('0,9 m',x-56,gy-.9*sc+5,DRED,14,'right');
  var s=q_r(p,0,.8),h=s<.5?1.5*(1-(s/.5)*(s/.5)):.9*(1-Math.pow(1-(s-.5)/.5,2));BALL(x+(s>.5?10:0),gy-h*sc-10,10);
  ctx.globalAlpha=q_r(p,.6,1);TB('Em avant = 2,94 J',W*.56,H*.2,BLUE_D,16,'left');TB('Em après = 1,76 J',W*.56,H*.34,DRED,16,'left');q_ok('chaleur : 1,18 J',W*.7,H*.56,17);ctx.globalAlpha=1;
 },
 /* 2 renouvelable ou non */ function(p){
  var gy=H*.5,a=q_r(p,0,.7);ctx.fillStyle='rgba(29,158,117,.08)';ctx.fillRect(W*.02,H*.08,W*.46,H*.84);ctx.fillStyle='rgba(226,75,74,.07)';ctx.fillRect(W*.52,H*.08,W*.46,H*.84);
  TB('renouvelables',W*.25,H*.17,DGREEN,16);TB('non renouvelables',W*.75,H*.17,DRED,16);
  /* soleil */ var sx=W*.1,sy=gy-8;DOT(sx,sy,13,'#f5c443');for(var i=0;i<8;i++){var an=i*PI/4;LN(sx+Math.cos(an)*18,sy+Math.sin(an)*18,sx+Math.cos(an)*26,sy+Math.sin(an)*26,'#e0a418',2.4);}TB('soleil',sx,sy+46,INK,13);
  /* éolienne */ var ex=W*.26,ey=gy+10;LN(ex,ey,ex,ey+36,INK,3);var rot=a*6;for(var i=0;i<3;i++){var an=rot+i*2*PI/3;LN(ex,ey,ex+Math.cos(an)*26,ey+Math.sin(an)*26,BLUE,3);}DOT(ex,ey,3,INK);TB('vent',ex,ey+58,INK,13);
  /* marées */ var mx=W*.4;ctx.strokeStyle=BLUE;ctx.lineWidth=2.6;ctx.beginPath();for(var i=0;i<=24;i++){var xx=mx-20+i*1.7,yy=gy+6+5*Math.sin(i*.8);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();TB('marées',mx,gy+54,INK,13);
  /* charbon, pétrole, gaz, uranium */ ctx.fillStyle='#3a3a3a';ctx.beginPath();ctx.moveTo(W*.58-12,gy+12);ctx.lineTo(W*.58-4,gy-8);ctx.lineTo(W*.58+12,gy-2);ctx.lineTo(W*.58+14,gy+14);ctx.fill();TB('charbon',W*.58,gy+46,INK,12);
  ctx.fillStyle='#2e2a24';ctx.beginPath();ctx.moveTo(W*.7,gy-12);ctx.quadraticCurveTo(W*.7+16,gy+8,W*.7,gy+16);ctx.quadraticCurveTo(W*.7-16,gy+8,W*.7,gy-12);ctx.fill();TB('pétrole',W*.7,gy+46,INK,12);
  ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(W*.82,gy-14);ctx.quadraticCurveTo(W*.82+14,gy+4,W*.82,gy+16);ctx.quadraticCurveTo(W*.82-14,gy+4,W*.82,gy-14);ctx.fill();TB('gaz',W*.82,gy+46,INK,12);
  ctx.strokeStyle=VIOLET;ctx.lineWidth=2;[0,1,2].forEach(function(i){ctx.beginPath();ctx.ellipse(W*.92,gy,16,6,i*PI/3,0,7);ctx.stroke();});DOT(W*.92,gy,3,VIOLET);TB('uranium',W*.92,gy+46,INK,12);
  ctx.globalAlpha=a;q_ok('3 renouvelables',W*.25,H*.86,15);q_pill('4 non renouvelables',W*.75,H*.86,DRED,15,'#fdecec');ctx.globalAlpha=1;
 },
 /* 3 lampe */ function(p){
  var cx=W*.2,cy=H*.4;DOT(cx,cy,28,'#fff7d6');ctx.strokeStyle=INK;ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(cx,cy,28,0,7);ctx.stroke();ctx.strokeStyle=ORANGE;ctx.beginPath();ctx.moveTo(cx-10,cy+10);ctx.lineTo(cx-6,cy-4);ctx.lineTo(cx+6,cy-4);ctx.lineTo(cx+10,cy+10);ctx.stroke();ctx.fillStyle=GREY;ctx.fillRect(cx-12,cy+28,24,14);TB('60 W · 5 h',cx,H*.82,INK,14);
  A(cx+34,cy-8,W*.3,-14,'#e0a418','',5);TB('lumière 5 %',W*.56,cy-34,'#b8860b',14,'left');A(cx+34,cy+10,W*.3,26,RED,'',12);TB('chaleur 95 %',W*.56,cy+66,DRED,14,'left');
  ctx.globalAlpha=q_r(p,0,.6);q_ok('E = 0,060 × 5 = 0,30 kWh',W*.5,H*.1,16);TB('lumière : 0,015 kWh',W*.6,H*.82,'#b8860b',14,'left');TB('chaleur : 0,285 kWh',W*.6,H*.93,DRED,14,'left');ctx.globalAlpha=1;
 },
 /* 4 rebonds successifs */ function(p){
  var g=q_gr(W*.12,H*.86,W*.8,H*.62,8.6,2.2,'rebond n','h (m)',[],[0.5,1,1.5,2]),s=q_r(p,0,.6);
  for(var n=0;n<=7;n++){var h=2*Math.pow(.8,n);ctx.fillStyle=(n==3&&s>0)?'rgba(29,158,117,.6)':'rgba(55,138,221,.45)';ctx.fillRect(g.X(n+.6)-14,g.Y(h),28,g.Y(0)-g.Y(h));T(String(n),g.X(n+.6),g.Y(0)+16,GREY,12);}
  LN(g.X(0),g.Y(.1),g.X(8.6),g.Y(.1),RED,1.6,[4,3]);TB('10 cm',g.X(8.5),g.Y(.1)-6,DRED,12,'right');
  if(s>0){ctx.globalAlpha=s;TB('1,02 m',g.X(3.6),g.Y(1.024)-8,DGREEN,14);q_ok('3e rebond : 1,02 m ; < 10 cm au 14e',W*.58,H*.1,15);ctx.globalAlpha=1;}
 },
 /* 5 freinage */ function(p){
  var gy=H*.74;floor(W*.03,W*.97,gy+26);car(W*.2,gy-4,BLUE);A(W*.2-36,gy-20,-50,0,GREY,'');TB('50 km/h',W*.2,gy-50,BLUE_D,14);
  var wx=W*.62,wy=gy-6,a=q_r(p,0,.7);DOT(wx,wy,44,'#555');DOT(wx,wy,34,'#999');ctx.fillStyle='rgba(226,75,74,'+(.15+.6*a)+')';ctx.beginPath();ctx.arc(wx,wy,24,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(wx,wy,24,0,7);ctx.stroke();ctx.fillStyle=BLUE;ctx.fillRect(wx+14,wy-26,16,34);
  TB('disque + plaquettes',wx,wy+66,INK,13);
  if(a>0){ctx.globalAlpha=a;ctx.strokeStyle=RED;ctx.lineWidth=2.4;[-24,0,24].forEach(function(dx){ctx.beginPath();for(var i=0;i<=14;i++){var xx=wx+dx+4*Math.sin(i*.9+dx),yy=wy-52-i*3;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});q_ok('Ec → énergie thermique',W*.5,H*.1,17);ctx.globalAlpha=1;}
 },
 /* 6 mix électrique */ function(p){
  var x=W*.06,w=W*.88;TB('part de l\'électricité (100 TWh)',W*.5,H*.1,INK,14);
  q6_stack(x,H*.16,w,34,[[.3,'gaz 30 %',ORA2],[.4,'nucléaire 40 %',BLUE],[.2,'éol. 20 %',GREEN],[.1,'10 %',YEL]],30);
  var s=q_r(p,0,.7);TB('part du CO₂ émis',W*.5,H*.46,INK,14);
  var parts=[[135,ORA2],[4.8,BLUE],[2.4,GREEN],[4.5,YEL]],tot=146.7,cx=x;
  parts.forEach(function(o){var ww=w*(o[0]/tot)*s;ctx.fillStyle=o[1];ctx.fillRect(cx,H*.52,ww,34);cx+=ww;});
  if(s>.99){TB('gaz : 92 %',x+w*.46,H*.52+22,'#fff',15);ctx.globalAlpha=q_r(p,.7,1);q_ok('≈ 147 g/kWh',W*.3,H*.82,18);q_ok('≈ 14,7 Mt de CO₂ par an',W*.72,H*.82,16);ctx.globalAlpha=1;}
 },
 /* 7 skateur */ function(p){
  var R=H*.5,xl=W*.1,xr=W*.9,yt=H*.18,fl=yt+R;q6_ramp(xl,xr,yt,R,fl);
  var s=q_r(p,0,.9),ys=[2,1.5,1.125,.84375],sc=R/2;
  LN(xl-10,yt,xl+30,yt,ORANGE,2);TB('2,0 m',xl+34,yt+4,ORANGE,13,'left');
  var xs=[xl+R,xr-R];
  [1.5,1.125,.84375].forEach(function(h,i){var a=q_r(s,(i)*.3,(i)*.3+.3);if(a>0){ctx.globalAlpha=a;var yy=fl-h*sc;var side=i%2==0;var xx=side?xr-R+Math.sqrt(R*R-(yy-yt)*(yy-yt)):xl+R-Math.sqrt(R*R-(yy-yt)*(yy-yt));DOT(xx,yy,5,i==2?GREEN:ORA2);LN(side?xr-R:xl+R,yy,xx,yy,GREY,1,[3,3]);TB(String(h.toFixed(2)).replace('.',',')+' m',xx+(side?10:-10),yy+4,DGREEN,12,side?'left':'right');ctx.globalAlpha=1;}});
  ctx.globalAlpha=q_r(p,.7,1);q_ok('245 J dissipés · 75 % conservés',W*.5,H*.7,14);q_ok('3 traversées : 0,84 m',W*.5,H*.86,14);ctx.globalAlpha=1;
 },
 /* 8 perpétuel mobile */ function(p){
  var cx=W*.36,cy=H*.48,r=H*.3;ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();for(var i=0;i<8;i++){var an=i*PI/4;LN(cx,cy,cx+Math.cos(an)*r,cy+Math.sin(an)*r,GREY,2);DOT(cx+Math.cos(an+.5)*r*.8,cy+Math.sin(an+.5)*r*.8,6,BLUE);}DOT(cx,cy,6,INK);
  A(cx+r*.6,cy-r-6,26,14,GREY,'',2);
  var a=q_r(p,0,.6);if(a>0){ctx.globalAlpha=a;ctx.strokeStyle=RED;ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,r+18,0,7);ctx.stroke();LN(cx-r-12,cy-r-12,cx+r+12,cy+r+12,RED,7);
   TB('Eutile < Ereçue',W*.76,H*.34,DRED,15);TB('frottements',W*.76,H*.46,DRED,15);TB('→ chaleur',W*.76,H*.58,DRED,15);ctx.globalAlpha=1;}
  if(a<.1)TB('?',W*.76,H*.5,GREY,60);
 },
 /* 9 journée d'électricité */ function(p){
  var x=W*.05,w=W*.9,tot=240;TB('demande : 10 GW × 24 h = 240 GWh',W*.5,H*.1,INK,15);
  var segs=[[86.4,'nucléaire',BLUE],[24,'sol.',YEL],[36,'éolien',GREEN],[93.6,'gaz',ORA2]],cx=x,s=q_r(p,0,.6);
  segs.forEach(function(o){var ww=w*o[0]/tot;ctx.fillStyle=o[2];ctx.fillRect(cx,H*.2,ww,40);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(cx,H*.2,ww,40);TB(String(o[0]).replace('.',','),cx+ww/2,H*.2+25,'#fff',13);TB(o[1],cx+ww/2,H*.2+58,INK,12);cx+=ww;});
  ctx.globalAlpha=s;TB('GWh',x,H*.2-8,GREY,12,'left');q_ok('renouvelable : 25 %',W*.3,H*.58,15);q_ok('sans gaz : 61 %',W*.74,H*.58,15);q_ok('gaz : 37 400 t de CO₂',W*.35,H*.76,15);q_pill('sans nucléaire : 72 000 t',W*.72,H*.9,DRED,14,'#fdecec');ctx.globalAlpha=1;
 },
 /* 10 part de chaleur */ function(p){
  var x=W*.28,gy=H*.88,top=H*.1,sc=(gy-top)/2;floor(x-60,x+60,gy+8);
  LN(x-50,gy-2*sc,x+50,gy-2*sc,BLUE,2,[5,4]);TB('2,0 m',x-56,gy-2*sc+5,BLUE_D,14,'right');LN(x-50,gy-1.28*sc,x+50,gy-1.28*sc,ORA2,2,[5,4]);TB('1,28 m',x-56,gy-1.28*sc+5,DRED,14,'right');
  A(x+70,gy-2*sc,0,(2-1.28)*sc,RED,'',2.4);TB('0,72 m',x+80,gy-1.64*sc+5,DRED,13,'left');TB('0,5 kg',x,gy+26,INK,14);
  BALL(x,gy-1.28*sc-10+((q_r(p,0,.7))<1?0:0),10);
  ctx.globalAlpha=q_r(p,0,.6);q_ok('conservé : 1,28 / 2,0 = 64 %',W*.7,H*.28,15);q_ok('chaleur : 36 %',W*.7,H*.46,17);q_ok('0,5 × 9,8 × 0,72 ≈ 3,5 J',W*.7,H*.64,14);ctx.globalAlpha=1;
 }
]);
