/* SFA · Biologie 6e · théorie animée et devantures (chapitre 03) */
(function(){
/* aides locales (portée de ce fichier) */
function sg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ga(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function g1(){ctx.globalAlpha=1;}
function F(fn){return function(p){ctx.save();var s=Math.min(W/460,H/280);ctx.translate((W-460*s)/2,(H-280*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(p||0);ctx.restore();};}
function G(fn){return function(t){ctx.save();var s=Math.min(W/700,H/300);ctx.translate((W-700*s)/2,(H-300*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(t||0);ctx.restore();};}
function box(x,y,w,h,col,fill,r,lw){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||AX;ctx.lineWidth=lw||2;ctx.beginPath();ctx.roundRect(x,y,w,h,r===undefined?8:r);ctx.fill();ctx.stroke();}
function ell(x,y,rx,ry,fill,st,lw,rot){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(st){ctx.strokeStyle=st;ctx.lineWidth=lw||2;ctx.stroke();}}
function chk(x,y,c,s){s=s||9;ctx.strokeStyle=c||DGREEN;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*.3,y+s*.7);ctx.lineTo(x+s,y-s*.8);ctx.stroke();}
function crs(x,y,c,s){s=s||8;ctx.strokeStyle=c||DRED;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y+s);ctx.moveTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.stroke();}
/* texte avec exposant : base puis petit texte relevé */
function sup(base,s,x,y,col,size,al){size=size||14;ctx.font='700 '+size+'px system-ui';var w1=ctx.measureText(base).width;ctx.font='700 '+(size*.62)+'px system-ui';var w2=ctx.measureText(s).width;
 var x0=al==='left'?x:al==='right'?x-w1-w2:x-(w1+w2)/2;ctx.fillStyle=col||INK;ctx.textAlign='left';ctx.font='700 '+size+'px system-ui';ctx.fillText(base,x0,y);ctx.font='700 '+(size*.62)+'px system-ui';ctx.fillText(s,x0+w1+1,y-size*.38);}
/* échiquier de Punnett : colonnes cx[], lignes, cases remplies selon p */
function pun(x,y,cw,top,side,cells,cols,pp,size){var n=top.length,m=side.length;size=size||17;
 for(var i=0;i<n;i++)TB(top[i],x+cw*(i+1.5),y+cw*.62,BLUE_D,size);
 for(var j=0;j<m;j++)TB(side[j],x+cw*.5,y+cw*(j+1)+cw*.62,DRED,size);
 for(var j=0;j<m;j++)for(var i=0;i<n;i++){var k=j*n+i,a=pp===undefined?1:sg(pp,k*.12,k*.12+.25);
  box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,AX,'#fafbfc',6);
  if(a>0){ga(a);box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,cols[k]||AX,(cols[k]||'#ccc')+'33',6);TB(cells[k],x+cw*(i+1.5),y+cw*(j+1.5)+size*.36,INK,size);g1();}}
}
function bar(x,y,w,h,col,lab,val,vs){ctx.fillStyle=col;ctx.fillRect(x,y-h,w,h);if(lab)TB(lab,x+w/2,y+16,INK,13);if(val!=null)TB(val,x+w/2,y-h-6,INK,vs||13);}
/* cellule de gamète : disque avec lettre */
function gam(x,y,r,c,l){DOT(x,y,r,c+'33');ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(l,x,y+r*.36,dk(c),Math.round(r*1.05));}
function drop(x,y,s,col,lab,fs){ctx.beginPath();ctx.moveTo(x,y-s*1.5);ctx.bezierCurveTo(x+s*.3,y-s*.8,x+s,y-s*.3,x+s,y+s*.35);ctx.arc(x,y+s*.35,s,0,PI,false);ctx.bezierCurveTo(x-s,y-s*.3,x-s*.3,y-s*.8,x,y-s*1.5);ctx.fillStyle=col+'33';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.stroke();if(lab)TB(lab,x,y+s*.55,dk(col),fs||Math.round(s*.95));}
function chX(x,y,s,col){LN(x-s*.5,y-s,x+s*.5,y+s,col,s*.3);LN(x+s*.5,y-s,x-s*.5,y+s,col,s*.3);}
function chY(x,y,s,col){LN(x-s*.5,y-s,x,y,col,s*.3);LN(x+s*.5,y-s,x,y,col,s*.3);LN(x,y,x,y+s,col,s*.3);}
function hsh(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function al1(a,x,y,size,col){if(a==='Y')TB('Y',x,y,col||INK,size);else sup('X',a,x,y,col||INK,size,'center');}
function xg(m,d,cx,cy,size,col){al1(m,cx-size*.55,cy,size,col);al1(d,cx+size*.6,cy,size,col);}
function isrec(a){return a!=='Y'&&a===a.toLowerCase();}
function xcol(m,d){if(d==='Y')return isrec(m)?RED:BLUE;return isrec(m)&&isrec(d)?RED:(isrec(m)||isrec(d))?VIOLET:BLUE;}
function xlab(m,d){if(d==='Y')return isrec(m)?'♂ atteint':'♂ sain';return isrec(m)&&isrec(d)?'♀ atteinte':(isrec(m)||isrec(d))?'♀ porteuse':'♀ saine';}
function xpun(x,y,cw,top,side,pp,size,fs){size=size||17;
 for(var i=0;i<top.length;i++)al1(top[i],x+cw*(i+1.5),y+cw-12,size+2,BLUE_D);
 for(var j=0;j<side.length;j++)al1(side[j],x+cw*.5,y+cw*(j+1.5)+7,size+2,DRED);
 for(var j=0;j<side.length;j++)for(var i=0;i<top.length;i++){var k=j*top.length+i,a=pp===undefined?1:sg(pp,k*.14,k*.14+.28),c=xcol(side[j],top[i]);
  box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,AX,'#fafbfc',6);
  if(a>0){ga(a);box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,c,c+'2e',6);xg(side[j],top[i],x+cw*(i+1.5),y+cw*(j+1.5)-2,size,INK);TB(xlab(side[j],top[i]),x+cw*(i+1.5),y+cw*(j+1.5)+size*.9,dk(c),fs||11);g1();}}
}
function ped(x,y,woman,state,lab,r){r=r||15;var f=state==='aff',c=state==='por';
 ctx.beginPath();if(woman)ctx.arc(x,y,r,0,7);else ctx.rect(x-r,y-r,2*r,2*r);ctx.fillStyle=f?'#3d3d3a':'#fff';ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.stroke();
 if(c)DOT(x,y,r*.34,INK);if(lab)TB(lab,x,y+r+16,INK,13);}
function cat(x,y,s,pat){ell(x,y,34*s,20*s,pat?'#f2f0ea':'#e6a24a',INK,2.2);ell(x+34*s,y-12*s,16*s,14*s,pat?'#f2f0ea':'#e6a24a',INK,2.2);
 ctx.fillStyle='#e6a24a';ctx.beginPath();ctx.moveTo(x+26*s,y-22*s);ctx.lineTo(x+30*s,y-34*s);ctx.lineTo(x+36*s,y-24*s);ctx.fill();ctx.beginPath();ctx.moveTo(x+38*s,y-24*s);ctx.lineTo(x+46*s,y-34*s);ctx.lineTo(x+48*s,y-20*s);ctx.fill();
 if(pat){var P=[[-18,-4,'#2c2c2c'],[4,6,'#e6a24a'],[-4,-8,'#e6a24a'],[16,-2,'#2c2c2c'],[-26,6,'#e6a24a'],[30,-18,'#2c2c2c'],[40,-8,'#e6a24a'],[22,10,'#2c2c2c']];P.forEach(function(q){ell(x+q[0]*s,y+q[1]*s,8*s,6*s,q[2]);});}
 DOT(x+38*s,y-14*s,2*s,INK);DOT(x+47*s,y-14*s,2*s,INK);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-34*s,y-4*s);ctx.quadraticCurveTo(x-52*s,y-20*s,x-48*s,y-34*s);ctx.stroke();LN(x-20*s,y+18*s,x-20*s,y+30*s,INK,2.4);LN(x+18*s,y+18*s,x+18*s,y+30*s,INK,2.4);}
SFA.theo("c03", {
 icon: function () {
  chX(W*.2,H*.4,36,BLUE);chX(W*.2+52,H*.4,36,RED);TB('XᴰXᵈ',W*.2+26,H*.78,INK,18);
  chX(W*.62,H*.4,36,BLUE);chY(W*.62+50,H*.4+4,28,GREY);TB('XᴰY',W*.62+25,H*.78,INK,18);TB('×',W*.46,H*.44,GREY,30);
  TB('liés à X · gènes liés · recombinaison',W*.5,H*.95,BLUE_D,16);
 },
 sub: [
 {t:"Hérédité liée à X", anim: G(function (t) {
  var ph=(t%800)/800,cw=74,px=250,py=16;
  TB('mère XᴰXᵈ',100,30,DRED,16);chX(70,80,30,BLUE);chX(130,80,30,RED);TB('Xᴰ',70,130,BLUE_D,14);TB('Xᵈ',130,130,DRED,14);
  TB('père XᴰY',100,175,BLUE_D,16);chX(70,225,30,BLUE);chY(130,230,26,GREY);TB('Xᴰ',70,272,BLUE_D,14);TB('Y',130,272,GREY,14);
  ga(sg(ph,0,.08));TB('gamètes du père',px+cw*2,py+8,BLUE_D,13);g1();
  ga(sg(ph,0,.08));xpun(px,py+8,cw,['D','Y'],['D','d'],sg(ph,.12,.7),19,12);g1();
  var a=sg(ph,.75,.92);ga(a);box(455,50,230,86,RED,'#fdecec',10);TB('garçons : 1/2 atteints',570,86,DRED,17);TB('(Xᵈ vient de la mère)',570,112,GREY,13);
  box(455,150,230,86,VIOLET,'#f1f0fc',10);TB('filles : jamais atteintes',570,186,'#5249B5',17);TB('(le père donne Xᴰ)',570,212,GREY,13);g1();
  ga(sg(ph,.9,1));TB('1 enfant sur 4 = garçon atteint',570,270,ORANGE,15);g1();
 }),
 th:'<div class="tcard"><b class="h">Les chromosomes sexuels</b><p>La femme a deux chromosomes X (XX), l\'homme un X et un Y (XY). Un gène porté par X mais absent de Y est <b>lié au sexe</b> : l\'homme n\'en possède qu\'un exemplaire (il est <i>hémizygote</i>) et exprime donc son allèle même s\'il est récessif. Daltonisme et hémophilie sont des maladies <b>récessives liées à X</b> : X<sup>d</sup> (ou X<sup>h</sup>) est l\'allèle de la maladie.</p></div>'
 +'<div class="tcard"><b class="h">Qui transmet quoi ?</b><p>Un <b>père</b> transmet son X à toutes ses filles et son Y à tous ses fils : il ne transmet jamais son X à un fils. Une <b>mère</b> transmet un de ses deux X, au hasard (1/2), à chacun de ses enfants. Une fille atteinte (X<sup>d</sup>X<sup>d</sup>) a donc un père atteint ; une femme X<sup>D</sup>X<sup>d</sup> est <b>porteuse</b> saine.</p><p><i>Exemple</i> : X<sup>D</sup>X<sup>d</sup> × X<sup>D</sup>Y donne 1/4 fille saine, 1/4 fille porteuse, 1/4 garçon sain, 1/4 garçon atteint : parmi les garçons 1/2 sont atteints, parmi les filles aucune.</p></div>'
 +'<div class="tcard"><b class="h">Fréquences dans une population</b><p>Si l\'allèle récessif a la fréquence <b>q</b> : hommes atteints = <b>q</b> ; femmes atteintes = <b>q²</b> ; femmes porteuses = <b>2q(1 − q)</b>. Avec q = 0,08 : 8 % des hommes, 0,64 % des femmes atteints, 14,7 % de porteuses. Une maladie liée à X touche donc bien plus d\'hommes que de femmes.</p></div>'
 +'<div class="tcard"><b class="h">Lire un arbre généalogique</b><p>Carré = homme, rond = femme, plein = atteint. Un père atteint ne transmet pas à son fils par X : si père et fils sont atteints, la maladie n\'est pas liée à X récessive (l\'X du fils vient de sa mère). Pour une maladie récessive liée à X : des garçons atteints nés de parents sains, et des oncles maternels atteints. Méthode : 1) repérer le caractère récessif (parents sains, enfant atteint) ; 2) tester « autosomique » et « lié à X » ; 3) vérifier avec les génotypes. Pour une probabilité en chaîne, on multiplie : 1/2 (mère porteuse) × 1/4 (garçon atteint) = 1/8.</p></div>'},
 {t:"Gènes liés et crossing-over", anim: G(function (t) {
  var ph=(t%900)/900,cx1=110,cx2=170,top=40,mid=130,bot=225;
  var u=sg(ph,.22,.5),sep=sg(ph,.5,.62);
  TB('prophase de méiose I : deux homologues',140,22,INK,13);
  function seg(x,y0,y1,c){ctx.strokeStyle=c;ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();}
  var offB=(cx2-cx1)*u;
  seg(cx1,top,mid,BLUE);seg(cx2,top,mid,RED);
  seg(cx1+offB,mid+4,bot,BLUE);seg(cx2-offB,mid+4,bot,RED);
  if(u>0&&u<1){ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx1+offB,mid+4);ctx.lineTo(cx2-offB,mid+4);ctx.stroke();}
  TB('A',cx1-24,78,BLUE_D,16);TB('a',cx2+24,78,DRED,16);TB('B',cx1-24,196,BLUE_D,16);TB('b',cx2+24,196,DRED,16);
  ctx.fillStyle='#fff';ctx.fillRect(cx1-6,72,12,4);ctx.fillRect(cx2-6,72,12,4);ctx.fillRect(cx1-6,190,12,4);ctx.fillRect(cx2-6,190,12,4);
  ga(sg(ph,.2,.3)*(1-sg(ph,.5,.6)));TB('crossing-over',140,258,ORANGE,15);g1();
  A(240,130,34,0,GREY,'',3);
  /* gamètes */
  var b=sg(ph,.6,.82),gx=[320,380,440,500],cols=[[BLUE,BLUE],[RED,RED],[BLUE,RED],[RED,BLUE]],lb=['AB','ab','Ab','aB'],pc=[40,40,10,10];
  for(var i=0;i<4;i++){ga(b);seg(gx[i],top+20,mid,cols[i][0]);seg(gx[i],mid+6,bot-20,cols[i][1]);TB(lb[i],gx[i],bot+8,INK,16);
   var h=pc[i]*2.2;ctx.fillStyle=i<2?'#9fc4ea':'#f0c28a';ctx.fillRect(gx[i]-14,285-h*0,28,0);g1();}
  ga(sg(ph,.78,.95));TB('parentaux : 80 %',350,262,BLUE_D,13);TB('recombinés : 20 %',470,262+0,ORANGE,13);
  box(560,70,130,140,ORANGE,'#fdf5e9',10);TB('20 % de',625,112,INK,15);TB('recombinés',625,134,INK,15);TB('=',625,160,GREY,16);TB('20 u.g.',625,192,DRED,22);g1();
 }),
 th:'<div class="tcard"><b class="h">Gènes liés</b><p>Deux gènes situés sur le <b>même chromosome</b> sont <b>liés</b> : ils ont tendance à être transmis ensemble. Chez un individu AB/ab, les gamètes <b>parentaux</b> AB et ab sont majoritaires. Un test-cross AB/ab × ab/ab ne donne alors pas 1 : 1 : 1 : 1, mais deux classes abondantes et deux classes rares.</p></div>'
 +'<div class="tcard"><b class="h">Crossing-over et recombinaison</b><p>Pendant la prophase de la méiose I, les chromosomes homologues échangent des segments : c\'est le <b>crossing-over</b>. Il crée des chromosomes <b>recombinés</b> (Ab et aB) ; plus deux gènes sont éloignés, plus l\'échange entre eux est fréquent. À la limite (gènes très éloignés ou sur des chromosomes différents), la fréquence de recombinants atteint 50 % : c\'est l\'indépendance.</p></div>'
 +'<div class="tcard"><b class="h">Carte génétique</b><p><b>Fréquence de recombinants = (recombinés / total) × 100</b>, et 1 % de recombinants = 1 <b>unité génétique</b> (u.g.). <i>Exemple</i> : 168 AB, 164 ab, 36 Ab, 32 aB sur 400 descendants : recombinés = 68 / 400 = 17 % → 17 u.g.</p><p><b>Ordre de trois gènes</b> : la plus grande distance sépare les deux gènes extrêmes, et elle vaut (à peu près) la somme des deux autres. A–B = 12, B–C = 8, A–C = 4 : l\'ordre est A – C – B (4 + 8 = 12).</p></div>'
 +'<div class="tcard"><b class="h">Pièges</b><p>Ne confonds pas « fréquence de recombinants » (au plus 50 %) et proportion de parentaux (au moins 50 %). Les classes parentales sont les plus nombreuses. Pour un résultat qui s\'écarte de 1 : 1 : 1 : 1, on le prouve avec un χ² (voir chapitre 2) avant de conclure à la liaison.</p></div>'},
 {t:"Inactivation d'un chromosome X", anim: G(function (t) {
  var ph=(t%700)/700;
  TB('une cellule de chatte XOXN',150,26,INK,14);
  ell(150,130,100,90,'#fbfaf6',INK,2.4);
  var a=sg(ph,.15,.5),pick=ph>.5?1:0;
  chX(115,126,40,'#e6a24a');chX(185,126,40,pick?'#2c2c2c':'#2c2c2c');
  if(a>0&&a<=1){ctx.globalAlpha=a;/* un X devient compact */ctx.fillStyle='#fff';ctx.fillRect(100,100,30,60);ctx.globalAlpha=1;}
  ctx.clearRect(0,0,0,0);
  if(ph>.5){/* X orange inactivé : petit corpuscule de Barr */ctx.fillStyle='#fbfaf6';ctx.fillRect(92,90,48,72);DOT(110,150,8,'#bfa070');TB('X inactivé',110,190,GREY,12);}
  TB('XN actif → poils noirs',185,230,INK,12);
  TB('1 X inactivé au hasard par cellule',150,274,ORANGE,14);
  /* mosaïque */
  var n=sg(ph,.55,.95),cols=['#e6a24a','#2c2c2c'],gx=330,gy=60,cs=34;
  TB('mosaïque de cellules : pelage écaille de tortue',510,34,INK,14);
  for(var k=0;k<50;k++){var i=k%10,j=(k/10)|0,on=k/50<n;ctx.fillStyle=on?cols[hsh(k)>.5?1:0]:'#eceef1';ctx.beginPath();ctx.roundRect(gx+i*cs,gy+j*cs,cs-4,cs-4,6);ctx.fill();}
  ga(sg(ph,.85,1));TB('un patch = les descendants d\'une même cellule',510,262,GREY,13);g1();
 }),
 th:'<div class="tcard"><b class="h">Pourquoi inactiver un X ?</b><p>Les femelles de mammifères ont deux X, les mâles un seul. Pour équilibrer la dose de gènes, <b>un des deux X est inactivé</b> au hasard dans chaque cellule, très tôt dans le développement ; il devient très compact (<b>corpuscule de Barr</b>) et la plupart de ses gènes ne s\'expriment plus. L\'inactivation est transmise à toutes les cellules filles.</p></div>'
 +'<div class="tcard"><b class="h">Le chat écaille de tortue</b><p>Le gène de la couleur orange (X<sup>O</sup>) / noire (X<sup>N</sup>) est porté par X. Une chatte X<sup>O</sup>X<sup>N</sup> est une <b>mosaïque</b> : dans chaque cellule, un X est inactivé ; les descendants d\'une cellule forment des plages orange ou noires. Un <b>mâle écaille de tortue</b> est exceptionnel : il est XXY (X<sup>O</sup>X<sup>N</sup>Y), comme l\'homme du syndrome de Klinefelter, et souvent stérile.</p></div>'
 +'<div class="tcard"><b class="h">À retenir</b><p>L\'inactivation est <b>au hasard</b> mais <b>définitive</b> dans une lignée de cellules. Une femme porteuse X<sup>D</sup>X<sup>d</sup> est donc elle aussi mosaïque pour le daltonisme (certaines cellules de la rétine expriment X<sup>d</sup>), ce qui explique que certaines porteuses aient une vision des couleurs légèrement altérée.</p></div>'}
 ]
});
SFA.figs("c03", [
 F(function(p){ /* 1 mère porteuse, père normal */
  TB('XᴰXᵈ × XᴰY',230,24,INK,18);
  xpun(24,22,76,['D','Y'],['D','d'],p,19,12);
  var a=sg(p,.5,.9);ga(a);box(300,60,140,130,ORANGE,'#fdf5e9',10);TB('garçon : 1/2',370,100,DRED,16);TB('enfant : 1/4',370,140,DRED,16);TB('(garçon Xᵈ Y)',370,172,GREY,13);g1();
  ga(1-a);TB('garçon daltonien ?',370,128,GREY,14);g1();
 }),
 F(function(p){ /* 2 père daltonien */
  TB('XᵈY × XᴰXᴰ',230,24,INK,18);
  xpun(72,18,70,['d','Y'],['D','D'],p,18,12);
  var a=sg(p,.5,.9);ga(a);box(60,232,340,38,VIOLET,'#f1f0fc',10);TB('toutes les filles : XᴰXᵈ (porteuses)',230,257,'#5249B5',16);g1();
  ga(1-a);TB('filles ?',230,257,GREY,16);g1();
 }),
 F(function(p){ /* 3 hémophilie */
  var a=sg(p,0,.5);
  ped(60,44,false,'aff','');TB('père hémophile',84,49,GREY,12,'left');LN(60,60,60,108,INK,2);
  ped(60,124,true,a>.1?'por':'ok','');ped(170,124,false,'ok','');LN(76,124,154,124,INK,2);
  TB('femme saine',60,160,GREY,12);TB('homme sain',170,160,GREY,12);
  ga(a);TB('XᴴXʰ',60,182,BLUE_D,17);g1();TB('XᴴY',170,182,GREY,15);
  LN(115,124,115,214,INK,2);ctx.setLineDash([4,3]);ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.beginPath();ctx.arc(115,232,15,0,7);ctx.stroke();ctx.setLineDash([]);TB('1er enfant ?',115,270,GREY,13);
  var b=sg(p,.5,1);ga(b);box(240,50,200,70,ORANGE,'#fdf5e9',10);TB('enfant hémophile : 1/4',340,82,DRED,17);TB('si c\'est un garçon : 1/2',340,106,DRED,15);g1();
  ga(1-b);TB('probabilités ?',340,92,GREY,18);g1();
  ga(a);TB('filles : jamais atteintes',340,172,GREY,14);g1();
 }),
 F(function(p){ /* 4 daltonisme population */
  TB('q = 0,08',230,26,ORANGE,22);
  var v=[8,0.64,14.72],lb=['hommes\natteints','femmes\natteintes','femmes\nporteuses'],cl=[RED,DRED,VIOLET],tx=['8 %','0,64 %','14,7 %'],a=sg(p,0,.8);
  LN(40,230,430,230,AX,1.5);
  for(var i=0;i<3;i++){var x=60+i*125;bar(x,230,70,v[i]*10*a,cl[i],null,null);var l=lb[i].split('\n');TB(l[0],x+35,248,INK,13);TB(l[1],x+35,264,INK,13);
   ga(sg(p,.4,.9));TB(tx[i],x+35,222-v[i]*10*a,INK,19);g1();}
  ga(sg(p,.6,1));TB('pour 1 000 : 80 hommes · ≈ 6 femmes',230,52,GREY,14);g1();
  ga(1-sg(p,0,.4));TB('proportions ?',230,130,GREY,20);g1();
 }),
 F(function(p){ /* 5 fratrie */
  var a=sg(p,0,.6);
  ped(90,50,false,'aff','oncle');ped(170,50,true,a>.1?'por':'ok','mère');ped(260,50,false,'ok','père');
  LN(185,50,245,50,INK,2);LN(215,50,215,100,INK,2);LN(160,100,270,100,INK,2);LN(160,100,160,118,INK,2);LN(270,100,270,118,INK,2);
  LN(100,36,150,36,GREY,1.4,[3,3]);
  ped(160,136,false,'aff','');ped(270,136,true,a>.1?'por':'ok','');TB('garçon',160,172,GREY,12);TB('sœur',270,172,GREY,12);
  ga(a);TB('XᴺXᵐ',170,20,BLUE_D,15);g1();
  ga(1-a);TB('?',270,140,GREY,16);g1();
  var b=sg(p,.4,1);ga(b);box(330,30,116,64,ORANGE,'#fdf5e9',10);TB('sœur porteuse',388,56,INK,13);TB('1/2',388,84,DRED,22);
  box(330,110,116,64,ORANGE,'#fdf5e9',10);TB('1er enfant : ♂ atteint',388,136,INK,12);TB('1/2 × 1/4 = 1/8',388,160,DRED,17);g1();
  TB('maladie récessive liée à X',230,232,GREY,14);
 }),
 F(function(p){ /* 6 distance */
  ctx.fillStyle='#dfe6f3';ctx.fillRect(40,60,380,18);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(40,60,380,18);
  LN(130,52,130,86,BLUE_D,4);LN(330,52,330,86,DRED,4);TB('A',130,44,BLUE_D,18);TB('B',330,44,DRED,18);
  var a=sg(p,0,.6);ga(a);A(130,102,200*a,0,ORANGE,'',3);A(330,102,-200*a,0,ORANGE,'',3);TB('17 u.g.',230,122,ORANGE,18);g1();
  var n=[168,164,36,32],lb=['AB','ab','Ab','aB'],cl=[BLUE,BLUE,ORANGE,ORANGE];LN(40,240,420,240,AX,1.5);
  for(var i=0;i<4;i++){var x=70+i*90;bar(x,240,50,n[i]*.42,cl[i],lb[i],String(n[i]),15);}
  ga(sg(p,.4,1));TB('recombinés : 36 + 32 = 68  →  68 / 400 = 17 %',230,146,INK,14);g1();
  TB('parentaux (332)',160,274,BLUE_D,12);TB('recombinés (68)',340,274,ORANGE,12);
 }),
 F(function(p){ /* 7 ordre de trois gènes */
  TB('A–B : 12 %   B–C : 8 %   A–C : 4 %',230,26,INK,15);
  var a=sg(p,0,.8);
  var pos={A:60,C:60+4*28,B:60+12*28},pre={A:90,B:200,C:330};
  var ord=['A','C','B'],cl={A:BLUE,B:RED,C:GREEN};
  ctx.fillStyle='#dfe6f3';ctx.fillRect(40,110,390,10);
  ord.forEach(function(g){var x=pre[g]*(1-a)+pos[g]*a;LN(x,96,x,134,cl[g],5);TB(g,x,86,dk(cl[g]),22);});
  ga(sg(p,.6,1));A(116,166,-54,0,ORANGE,'',2.4);A(116,166,54,0,ORANGE,'',2.4);A(284,166,-110,0,ORANGE,'',2.4);A(284,166,110,0,ORANGE,'',2.4);A(228,206,-166,0,ORANGE,'',2.4);A(228,206,166,0,ORANGE,'',2.4);
  TB('4',116,156,ORANGE,15);TB('8',284,156,ORANGE,15);TB('12',228,196,ORANGE,15);TB('ordre : A – C – B',230,256,DRED,22);g1();
  ga(1-sg(p,0,.4));TB('ordre ?',230,210,GREY,22);g1();
 }),
 F(function(p){ /* 8 chat mâle écaille */
  cat(120,100,1.5,true);TB('mâle écaille de tortue',130,190,INK,14);
  var a=sg(p,0,.6);
  ell(340,100,70,60,'#fbfaf6',INK,2.4);chX(310,100,26,'#e6a24a');chX(345,100,26,'#2c2c2c');chY(378,104,20,GREY);
  TB('XᴼXᴺY',340,196,BLUE_D,18);
  ga(a);DOT(310,138,6,'#bfa070');TB('X inactivé',310,158,GREY,11);g1();
  var b=sg(p,.4,1);ga(b);box(250,216,200,46,ORANGE,'#fdf5e9',10);TB('XXY : 2 X → mosaïque',350,246,DRED,16);g1();
  ga(1-b);TB('2 allèles différents = 2 X',350,246,GREY,14);g1();
 }),
 F(function(p){ /* 9 fille d'un père daltonien */
  ped(60,40,false,'aff','');TB('père daltonien',84,45,GREY,12,'left');LN(60,56,60,84,INK,2);ped(60,100,true,'por','');ped(160,100,false,'ok','');LN(78,100,142,100,INK,2);
  TB('XᴰXᵈ',60,142,BLUE_D,16);TB('XᴰY',160,142,BLUE_D,16);
  LN(110,100,110,170,INK,2);ped(110,190,false,'ok','');ped(190,190,true,'ok','');LN(60,170,190,170,INK,2);LN(60,170,60,176,INK,2);
  var a=sg(p,0,.4),b=sg(p,.3,.7),c=sg(p,.6,1);
  var it=[['(b) garçon daltonien',"1/4",DRED,a],['(c) fille daltonienne','impossible',DGREEN,b],['(d) 3 enfants sains','27/64 ≈ 42 %',ORANGE,c]];
  it.forEach(function(q,i){var y=26+i*72;ga(q[3]);box(250,y,196,60,q[2],q[2]+'14',10);TB(q[0],348,y+24,INK,13);TB(q[1],348,y+48,dk(q[2]),20);g1();});
  ga(1-a);TB('?',348,126,GREY,40);g1();
 }),
 F(function(p){ /* 10 père atteint, fils atteint */
  ped(60,40,false,'aff','père');ped(170,40,true,'ok','mère');LN(76,40,154,40,INK,2);LN(115,40,115,86,INK,2);ped(115,112,false,'aff','fils');
  TB('père',290,20,GREY,13);chX(270,52,18,BLUE);chY(310,56,15,GREY);
  TB('mère',400,20,GREY,13);chX(380,52,18,GREEN);chX(420,52,18,GREEN);
  A(310,78,24,52,GREY,'',2.6);A(380,78,-16,52,GREEN,'',2.6);
  TB('fils',345,176,GREY,13);chY(325,150,15,GREY);chX(365,148,18,GREEN);
  TB('Y du père',250,160,GREY,12,'right');TB('X de la mère',425,160,DGREEN,12);
  var a=sg(p,0,.6);
  ga(a);box(190,196,252,68,DGREEN,'#e8f7f1',10);TB('autosomique dominante',316,226,DGREEN,17);TB('(les modes liés à X sont exclus)',316,250,GREY,12);g1();
  ga(1-a);TB('quel mode de transmission ?',316,236,GREY,16);g1();
 })
]);
})();
