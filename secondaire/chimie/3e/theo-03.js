/* SFA · Chimie 3e · chapitre 03 : théorie animée et devantures */
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
function nuc(cx,cy,p,n,s,seed){ // noyau en grappe
 var tot=p+n,idx=[];for(var i=0;i<tot;i++)idx.push(i);
 // ordre pseudo-aléatoire pour mélanger p et n
 idx.sort(function(a,b){return rnd(a+seed*13)-rnd(b+seed*13);});
 for(var k=0;k<tot;k++){var a=k*2.4,d=Math.sqrt((k+.5)/tot)*s*1.9;var isP=idx[k]<p;ball(cx+Math.cos(a)*d,cy+Math.sin(a)*d,s*.62,isP?RED:'#b4b9be');}}
function leg(x,y,p,n){ball(x,y,6,RED);TB('proton',x+11,y+5,INK,13,'left');ball(x+84,y,6,'#b4b9be');TB('neutron',x+95,y+5,INK,13,'left');}
function bars(x0,y0,w,h,xs,hs,xl,xr,cols,lab,mx){ // spectre
 LN(x0,y0,x0+w,y0,AX,1.8);var M=mx||Math.max.apply(null,hs);
 xs.forEach(function(v,i){var x=x0+(v-xl)/(xr-xl)*w,bh=hs[i]/M*h;ctx.fillStyle=cols[i];ctx.fillRect(x-14,y0-bh,28,bh);TB(String(v),x,y0+18,INK,14);TB(String(hs[i]).replace('.',','),x,y0-bh-6,cols[i]===BLUE?BLUE_D:DRED,14);});}
SFA.theo("c03", {
 icon: function () {
  ctx.font='700 62px system-ui';ctx.textAlign='left';ctx.fillStyle=BLUE_D;ctx.fillText('Cl',W*.44,H*.6);
  TB('35',W*.4,H*.42,DRED,26,'right');TB('17',W*.4,H*.62,DGREEN,26,'right');
  TB('isotopes',W*.5,H*.84,ORANGE,20);
 },
 anim: function (t) {
  var f=.5+.45*Math.sin(t*.012),n37=Math.round(f*100),m=35*(1-n37/100)+37*n37/100;
  // grille 10×10
  var gx=W*.08,gy=H*.12,cell=Math.min(22,(H*.5)/10);
  for(var i=0;i<100;i++){var c=i%10,r=Math.floor(i/10);var is37=i<n37;ball(gx+c*cell+cell/2,gy+r*cell+cell/2,cell*.38,is37?ORA2:BLUE);}
  TB('100 atomes de chlore',gx+cell*5,gy-8,INK,14);
  // légende
  var lx=gx+cell*10+30;
  ball(lx,gy+14,7,BLUE);TB('chlore 35 : '+(100-n37)+' %',lx+14,gy+19,BLUE_D,15,'left');
  ball(lx,gy+44,7,ORA2);TB('chlore 37 : '+n37+' %',lx+14,gy+49,DRED,15,'left');
  TB('m = '+(1-n37/100).toFixed(2).replace('.',',')+' × 35 + '+(n37/100).toFixed(2).replace('.',',')+' × 37',lx,gy+95,INK,16,'left');
  TB('= '+m.toFixed(2).replace('.',',')+' u',lx,gy+125,DRED,24,'left');
  // axe
  var ax0=W*.1,ax1=W*.9,ay=H*.82;LN(ax0,ay,ax1,ay,AX,2);
  function X(v){return ax0+(v-34)/(4)*(ax1-ax0);}
  [35,36,37].forEach(function(v){LN(X(v),ay-5,X(v),ay+5,GREY,2);TB(String(v),X(v),ay+22,GREY,14);});
  DOT(X(35),ay,7,BLUE);DOT(X(37),ay,7,ORA2);
  // marque nature
  var nat=35*.75+37*.25;LN(X(nat),ay-30,X(nat),ay+6,DGREEN,2,[4,3]);TB('chlore naturel : 35,5',X(nat),ay-36,DGREEN,13);
  ctx.fillStyle=RED;ctx.beginPath();ctx.moveTo(X(m),ay-4);ctx.lineTo(X(m)-9,ay-20);ctx.lineTo(X(m)+9,ay-20);ctx.fill();
  TB('masse moyenne',X(m),ay+42,DRED,13);
 },
 th:
 '<div class="tcard"><b class="h">Notation et isotopes</b><p>Un noyau s\'écrit <b><sup>A</sup><sub>Z</sub>X</b> : <b>Z</b> = numéro atomique (nombre de protons), <b>A</b> = nombre de masse (protons + neutrons), donc <code>N = A − Z</code>. Un atome neutre a <b>Z électrons</b>.</p><p><b>Isotopes</b> : atomes du <b>même élément</b> (même Z) mais de nombre de neutrons différent (donc A différent). Exemples : hydrogène 1, 2, 3 ; carbone 12, 13, 14 ; chlore 35 et 37. Ils ont le <b>même cortège électronique</b>, donc les <b>mêmes propriétés chimiques</b> ; seuls la masse (et parfois la stabilité) changent.</p><p><b style="color:#a32d2d">Piège :</b> même A mais Z différent (<sup>18</sup>O et <sup>18</sup>F) : ce ne sont pas des isotopes, ce sont deux éléments différents.</p></div>' +
 '<div class="tcard"><b class="h">Masse atomique moyenne</b><p>On exprime les masses en <b>unité de masse atomique</b> u (1 u ≈ 1,66·10<sup>−27</sup> kg, un proton ou un neutron pèse ≈ 1 u). Un atome donné a une masse presque entière (nombre de nucléons), mais la valeur du tableau périodique est la <b>moyenne pondérée</b> par l\'abondance naturelle :</p><p><code>m = f₁ × m₁ + f₂ × m₂ + …</code> (f = abondance en fraction, somme = 1)</p><p>C\'est pourquoi la masse atomique du chlore (35,5 u) ou du cuivre (63,55 u) n\'est pas entière : aucun atome ne pèse 35,5 u.</p></div>' +
 '<div class="tcard"><b class="h">Lire un spectre de masse</b><p>Le spectromètre de masse trie les particules selon leur masse. <b>Chaque pic = un isotope</b> : sa <b>position</b> donne la masse, sa <b>hauteur</b> l\'abondance relative.</p><p>Abondance (%) = hauteur ÷ somme des hauteurs × 100. Pour le cuivre : pics 63 (hauteur 69) et 65 (hauteur 31) : 69 % et 31 %.</p></div>' +
 '<div class="tcard"><b class="h">Isotopes radioactifs et demi-vie</b><p>Certains noyaux (carbone 14) sont instables : ils se désintègrent. La <b>demi-vie T</b> est la durée au bout de laquelle la moitié des noyaux a disparu : <code>fraction restante = (1/2)<sup>t/T</sup></code>. Pour le carbone 14, T = 5 730 ans : on date des restes organiques jusqu\'à environ 50 000 ans ; pour des durées bien plus longues on choisit un noyau de demi-vie très longue (uranium 238).</p></div>' +
 '<div class="tcard"><b class="h">Exemples chiffrés</b><p>Chlore : 75 % de Cl-35 et 25 % de Cl-37 → m = 0,75 × 35 + 0,25 × 37 = 26,25 + 9,25 = <b>35,5 u</b>.</p><p>Retrouver l\'abondance : bore, m = 10,8 u, isotopes 10 et 11. Si x = fraction de B-10 : 10x + 11(1 − x) = 10,8, d\'où x = 0,2 : <b>20 % de B-10 et 80 % de B-11</b>.</p><p>Datation : 12,5 % = (1/2)<sup>3</sup>, trois demi-vies : 3 × 5 730 = 17 190 ans.</p></div>'
});

SFA.figs("c03", [
 // 0 lire une notation
 F(function(p){
  ctx.font='700 130px system-ui';ctx.textAlign='left';ctx.fillStyle=BLUE_D;ctx.fillText('C',150,190);
  TB('13',146,110,DRED,50,'right');TB('6',146,190,DGREEN,50,'right');
  var rows=[['A = 13 (nucléons)',DRED,0],['Z = 6 (protons)',DGREEN,.2],['6 protons',DRED,.4],['N = 13 − 6 = 7 neutrons',INK,.6]];
  rows.forEach(function(r,i){var a=sg(p,r[2],r[2]+.25);ga(.25+.75*a);TB(r[0],290,80+i*40,r[1],15,'left');g1();});
  if(p>0){ga(sg(p,0,.4));A(180,106,95,-18,RED,'',2);g1();ga(sg(p,.2,.6));A(176,184,100,-60,GREEN,'',2);g1();}
  nuc(80,230,6,7,9,1);
 }),
 // 1 Cl35 vs Cl37
 F(function(p){
  nuc(115,125,17,18,8,3);nuc(345,125,17,20,8,5);
  TB('chlore 35',115,40,BLUE_D,16);TB('chlore 37',345,40,BLUE_D,16);
  TB('17 protons · 18 neutrons',115,220,INK,13);TB('17 protons · 20 neutrons',345,220,INK,13);
  TB('A = 35',115,242,GREY,14);TB('A = 37',345,242,GREY,14);
  if(p>0){ga(sg(p,0,.5));TB('≠',230,135,DRED,50);tag('même Z = 17',230,72,DGREEN,15);
   tag('2 neutrons de plus',230,190,DRED,15);ctx.strokeStyle=DGREEN;ctx.lineWidth=2;g1();}
  leg(150,268,0,0);
 }),
 // 2 qui sont isotopes
 F(function(p){
  var d=[['16','8','O',BLUE],['18','8','O',BLUE],['18','9','F',ORA2],['15','7','N',GREEN]];
  d.forEach(function(r,i){var x=10+i*113,y=60;box(x,y,100,120,AX,'#fafcfe',8);
   ctx.font='700 52px system-ui';ctx.textAlign='left';ctx.fillStyle=r[3]===BLUE?BLUE_D:(r[3]===ORA2?DRED:DGREEN);ctx.fillText(r[2],x+44,y+82);
   TB(r[0],x+40,y+52,INK,22,'right');TB(r[1],x+40,y+86,INK,22,'right');TB('('+'abcd'[i]+')',x+50,y+108,GREY,14);});
  TB('Qui est isotope de qui ?',230,32,BLUE_D,16);
  if(p>0){var a=sg(p,0,.6);ga(a);ctx.strokeStyle=DGREEN;ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(60,196);ctx.lineTo(60,212);ctx.lineTo(173,212);ctx.lineTo(173,196);ctx.stroke();
   tag('(a) et (b) : même Z = 8 → isotopes',116,236,DGREEN,14);g1();
   ga(sg(p,.5,1));tag('(c) : même A que (b), mais Z = 9 : fluor',230,262,DRED,14);g1();}
 }),
 // 3 masse moyenne Cl
 F(function(p){
  var gx=24,gy=34,c=20;
  // 75 bleus / 25 orange (colonnes 8-9 et deux lignes ~) : on remplit par ordre
  for(var k=0;k<100;k++){var r2=Math.floor(k/10),c2=k%10;ball(gx+c2*c+10,gy+r2*c+10,7.5,k<75?BLUE:ORA2);}
  TB('100 atomes',gx+100,gy-14,INK,14);
  TB('75 × Cl-35',250,70,BLUE_D,16,'left');TB('25 × Cl-37',250,98,DRED,16,'left');
  TB('moyenne pondérée ?',250,140,GREY,15,'left');
  if(p>0){ga(sg(p,0,.6));TB('0,75 × 35 = 26,25',250,172,BLUE_D,15,'left');TB('0,25 × 37 =  9,25',250,194,DRED,15,'left');g1();
   ga(sg(p,.5,1));box(246,206,200,48,DGREEN,'#e3f5ee',10);TB('m = 35,5 u',346,240,DGREEN,24);g1();}
 }),
 // 4 pourquoi pas un entier (cuivre)
 F(function(p){
  box(10,40,110,110,INK,'#fff',6);TB('29',22,62,GREY,15,'left');ctx.font='700 52px system-ui';ctx.textAlign='center';ctx.fillStyle=ORANGE;ctx.fillText('Cu',65,114);TB('63,55',65,140,INK,15);
  bars(190,170,240,90,[63,65],[69,31],62.2,65.8,[BLUE,ORA2],'',69);
  TB('abondance (%)',310,40,GREY,13);TB('masse (u)',310,214,GREY,13);
  if(p>0){var a=sg(p,0,.8);var x=190+(63.55-62.2)/(65.8-62.2)*240;ctx.fillStyle=RED;ctx.beginPath();ctx.moveTo(x,172);ctx.lineTo(x-9,188);ctx.lineTo(x+9,188);ctx.fill();
   ga(a);tag('63,55 = moyenne pondérée',x+10,236,DRED,14);box(24,170,150,80,DGREEN,'#e3f5ee',10);TB('0,69 × 63',99,196,INK,14);TB('+ 0,31 × 65',99,216,INK,14);TB('≈ 63,6 u',99,240,DGREEN,17);g1();}
  else TB('pourquoi pas un entier ?',99,215,GREY,14);
 }),
 // 5 bore
 F(function(p){
  var x0=40,x1=420,y=130;function X(v){return x0+(v-10)*(x1-x0);}
  LN(x0,y,x1,y,AX,2.4);
  ball(X(10),y,16,GREEN,'B',null);ball(X(11),y,16,ORA2,'B');
  TB('bore 10',X(10),y+44,DGREEN,15);TB('bore 11',X(11),y+44,DRED,15);
  ctx.fillStyle=RED;ctx.beginPath();ctx.moveTo(X(10.8),y-8);ctx.lineTo(X(10.8)-10,y-28);ctx.lineTo(X(10.8)+10,y-28);ctx.fill();TB('10,8 u',X(10.8),y-38,DRED,16);
  TB('x = fraction de B-10 ?',230,28,BLUE_D,16);
  if(p>0){ga(sg(p,0,.4));TB('10x + 11(1 − x) = 10,8',230,200,INK,16);g1();
   ga(sg(p,.4,.8));TB('x = 0,2',230,228,DRED,18);g1();
   ga(sg(p,.7,1));box(40,238,140,34,DGREEN,'#e3f5ee',10);TB('B-10 : 20 %',110,260,DGREEN,15);box(280,238,140,34,DRED,'#fcebeb',10);TB('B-11 : 80 %',350,260,DRED,15);g1();}
 }),
 // 6 spectre cuivre
 F(function(p){
  bars(70,220,330,150,[63,65],[69,31],62,66,[BLUE,ORA2],'',69);
  TB('hauteur = abondance',230,34,GREY,14);TB('masse (u)',230,258,GREY,13);
  if(p>0){
   ga(sg(p,.2,.8));box(250,60,200,64,DGREEN,'#e3f5ee',10);TB('69 ÷ 31 ≈ 2,2',350,88,INK,16);TB('Cu-63 : 2 fois plus abondant',350,110,DGREEN,13);g1();
   ga(sg(p,.6,1));TB('deux pics = deux isotopes',230,278,DRED,15);g1();}
 }),
 // 7 C12 / C14
 F(function(p){
  [['carbone 12',6,6,115],['carbone 14',6,8,345]].forEach(function(r,i){
   nuc(r[3],125,r[1],r[2],7.5,9+i);var R=36;ctx.strokeStyle='#cfd5db';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(r[3],125,R+14,0,7);ctx.stroke();
   for(var j=0;j<6;j++){var a=j*1.047+.3;DOT(r[3]+Math.cos(a)*(R+14),125+Math.sin(a)*(R+14),4.2,BLUE);}
   TB(r[0],r[3],40,BLUE_D,16);TB('6 p · '+r[2]+' n · 6 e',r[3],222,INK,14);});
  if(p>0){ga(sg(p,0,.5));tag('mêmes 6 électrons : même chimie',230,262,DGREEN,14);tag('radioactif',345,246,DRED,14);g1();}
  else TB('= ?',230,130,GREY,34);
 }),
 // 8 lithium
 F(function(p){
  nuc(100,110,3,3,12,2);nuc(330,110,3,4,12,4);
  TB('lithium 6',100,40,BLUE_D,16);TB('lithium 7',330,40,BLUE_D,16);
  TB('3 p · 3 n · 3 e',100,170,INK,14);TB('3 p · 4 n · 3 e',330,170,INK,14);
  TB('7,6 %',100,196,BLUE_D,18);TB('92,4 %',330,196,DRED,18);
  if(p>0){ga(sg(p,0,.5));box(20,214,420,54,DGREEN,'#e3f5ee',10);TB('0,076 × 6 + 0,924 × 7 = 6,924 ≈ 6,92 u',230,238,INK,15);TB('1 000 atomes : 76 de lithium 6',230,258,DGREEN,14);g1();}
  else TB('masse moyenne ?',230,250,GREY,16);
 }),
 // 9 datation
 F(function(p){
  var X=function(n){return 70+n*60},Y=function(f){return 230-f*190};
  LN(60,230,440,230,AX,1.6);LN(60,230,60,34,AX,1.6);TB('t (en demi-vies)',440,252,GREY,13,'right');TB('fraction de ¹⁴C',66,26,GREY,13,'left');
  [0,1,2,3,4,5].forEach(function(n){LN(X(n),230,X(n),236,GREY,1);TB(String(n),X(n),250,GREY,13);});
  ctx.strokeStyle=INK;ctx.lineWidth=2.6;ctx.beginPath();for(var i=0;i<=300;i++){var n=i/60,f=Math.pow(.5,n);i?ctx.lineTo(X(n),Y(f)):ctx.moveTo(X(n),Y(f));}ctx.stroke();
  [0,1,2,3].forEach(function(n){DOT(X(n),Y(Math.pow(.5,n)),5,BLUE);});
  TB('100 %',X(0)+8,Y(1)-4,GREY,13,'left');TB('50 %',X(1)+6,Y(.5)-6,GREY,13,'left');TB('25 %',X(2)+6,Y(.25)-6,GREY,13,'left');
  if(p>0){var a=sg(p,0,.7);ga(a);LN(60,Y(.125),X(3),Y(.125),RED,2,[5,4]);LN(X(3),Y(.125),X(3),230,RED,2,[5,4]);DOT(X(3),Y(.125),7,RED);
   TB('12,5 %',64,Y(.125)-6,DRED,14,'left');box(230,70,210,66,DRED,'#fcebeb',10);TB('3 demi-vies',335,96,INK,15);TB('3 × 5 730 = 17 190 ans',335,122,DRED,17);g1();}
 }),
 // 10 spectre du chlore
 F(function(p){
  bars(70,215,330,140,[35,37],[75.8,24.2],34,38,[BLUE,ORA2],'',75.8);
  TB('hauteur = abondance',230,30,GREY,14);TB('masse (u)',430,236,GREY,13,'right');
  if(p>0){var x=70+(35.48-34)/4*330;ga(sg(p,0,.6));ctx.fillStyle=RED;ctx.beginPath();ctx.moveTo(x,219);ctx.lineTo(x-9,235);ctx.lineTo(x+9,235);ctx.fill();
   TB('35,5 u',x+8,252,DRED,15,'left');
   box(250,48,196,64,DGREEN,'#e3f5ee',10);TB('75,8 % · 24,2 %',348,74,INK,15);TB('m ≈ 35,5 u',348,100,DGREEN,18);g1();
   ga(sg(p,.6,1));tag('aucun atome ne pèse 35,5 u',230,270,DRED,14);g1();}
 })
]);
})();
