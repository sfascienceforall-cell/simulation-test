/* SFA · Biologie 6e · théorie animée et devantures (chapitre 01) */
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
function pig(x,y,s,col,eye){ell(x,y,26*s,16*s,col,INK,2);ell(x+25*s,y-5*s,12*s,10*s,col,INK,2);ell(x+30*s,y-15*s,4*s,6*s,col,INK,1.6,.4);DOT(x+29*s,y-7*s,2*s,eye||'#fff');DOT(x+36*s,y-3*s,1.8*s,INK);LN(x-14*s,y+16*s,x-14*s,y+22*s,INK,2);LN(x+10*s,y+16*s,x+10*s,y+22*s,INK,2);}
function flower(x,y,r,col){for(var i=0;i<5;i++){var a=i*1.2566-1.57;ell(x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,r*.5,r*.36,col,'rgba(0,0,0,.25)',1.4,a);}DOT(x,y,r*.22,'#f6c445');}
function mouse(x,y,s,col){ell(x,y,20*s,12*s,col,INK,2);ell(x+19*s,y-3*s,9*s,7*s,col,INK,2);ell(x+17*s,y-12*s,5*s,5*s,col,INK,1.6);DOT(x+22*s,y-5*s,1.8*s,INK);ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x-20*s,y);ctx.quadraticCurveTo(x-34*s,y-6*s,x-38*s,y+6*s);ctx.stroke();}
function rab(x,y,s,body,pts,eye){ell(x,y+8*s,22*s,15*s,body,INK,2);ell(x+20*s,y-4*s,12*s,10*s,body,INK,2);ell(x+17*s,y-24*s,4*s,12*s,body,INK,1.8,.1);ell(x+25*s,y-23*s,4*s,12*s,body,INK,1.8,-.1);
 if(pts){ell(x+17*s,y-30*s,3*s,6*s,pts);ell(x+25*s,y-29*s,3*s,6*s,pts);ell(x+27*s,y-1*s,4*s,3.5*s,pts);}DOT(x+24*s,y-6*s,2.2*s,eye||INK);DOT(x-22*s,y+4*s,5*s,'#fff');ctx.strokeStyle=INK;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x-22*s,y+4*s,5*s,0,7);ctx.stroke();}
function bal(x,y,w,h,vals,cols,labs,hi,vmax,fs){var n=vals.length,bw=w/n*.62;for(var i=0;i<n;i++){var bx=x+w*(i+.5)/n-bw/2,bh=h*vals[i]/vmax;ga(hi===undefined||hi===i?1:.45);bar(bx,y,bw,bh,cols[i],labs[i],null);g1();}}
var DOM=BLUE,REC=RED;
SFA.theo("c01", {
 icon: function () {
  var x=W*.5-92,y=H*.12,cw=62;
  TB('Aa × Aa',W*.5,H*.1,INK,24);
  pun(W*.5-120,H*.13,60,['A','a'],['A','a'],['AA','Aa','Aa','aa'],[DOM,DOM,DOM,REC],undefined,18);
  TB('3 : 1',W*.5+104,H*.5,ORANGE,34);
  TB('dominant : récessif',W*.5+104,H*.5+24,GREY,13);
  TB('gène · allèle · échiquier',W*.5,H*.93,BLUE_D,18);
 },
 anim: G(function (t) {
  var ph=(t%720)/720, cw=62, px=250, py=14;
  /* parents */
  TB('Parent 1',70,40,BLUE_D,15);gam(48,70,15,BLUE,'A');gam(92,70,15,BLUE,'a');TB('génotype Aa',70,106,INK,13);
  TB('Parent 2',70,175,DRED,15);gam(48,205,15,RED,'A');gam(92,205,15,RED,'a');TB('génotype Aa',70,241,INK,13);
  TB('gamètes',70,127,GREY,12);TB('gamètes',70,262,GREY,12);
  TB('gamètes du parent 1',px+cw*2,py+12,BLUE_D,13);
  var a=sg(ph,0,.08),fl=sg(ph,.12,.3),tp=fl>=1?['A','a']:['',''];
  var cells=['AA','Aa','Aa','aa'],cols=[DOM,DOM,DOM,REC];
  ga(a);pun(px-8,py+4,cw,tp,tp,cells,cols,sg(ph,.3,.72),19);g1();
  TB('parent 2',px-8+cw*.5,py+4+cw*.5,DRED,12);
  if(fl<1&&ph>.12){for(var k=0;k<2;k++){var l=k?'a':'A';
   gam(92-44*k+(px-8+cw*(k+1.5)-92+44*k)*fl,70-(70-(py+4+cw*.62))*fl,13,BLUE,l);
   gam(92-44*k+(px-8+cw*.5-92+44*k)*fl,205-(205-(py+4+cw*(k+1)+cw*.5))*fl,13,RED,l);}}
  /* bilan */
  var b=sg(ph,.74,.92), bx=500, by=250;
  ga(b);TB('génotypes',bx+80,40,INK,14);
  bar(bx+10,by-60,34,.25*130*b,BLUE,'AA','1/4',12);bar(bx+62,by-60,34,.5*130*b,BLUE,'Aa','1/2',12);bar(bx+114,by-60,34,.25*130*b,RED,'aa','1/4',12);
  g1();ga(sg(ph,.86,.98));TB('phénotypes : 3 dominants : 1 récessif',bx+80,by+8,ORANGE,14);TB('(75 %)          (25 %)',bx+80,by+28,GREY,12);g1();
 }),
 th: '<div class="tcard"><b class="h">Le vocabulaire à maîtriser</b><p>Un <b>gène</b> contrôle un caractère ; il existe en deux exemplaires (un par chromosome de la paire). Ses différentes versions sont des <b>allèles</b>. Le <b>génotype</b> est la combinaison d\'allèles (Aa) ; le <b>phénotype</b> est le caractère observable (graine lisse, groupe sanguin A). Un individu est <b>homozygote</b> si ses deux allèles sont identiques (AA ou aa), <b>hétérozygote</b> s\'ils diffèrent (Aa). Un allèle <b>dominant</b> s\'exprime dès qu\'il est présent ; un allèle <b>récessif</b> ne s\'exprime qu\'à l\'état homozygote.</p></div>'
 +'<div class="tcard"><b class="h">Prévoir un croisement avec l\'échiquier</b><p>1) Écris le génotype des parents. 2) Écris leurs gamètes : un seul allèle par gamète (Aa donne A et a, chacun avec la probabilité 1/2). 3) Place les gamètes d\'un parent en colonne, de l\'autre en ligne. 4) Remplis les cases, puis compte.</p><p><b>Aa × Aa</b> : 1/4 AA, 1/2 Aa, 1/4 aa, donc 3/4 de phénotype dominant et 1/4 de récessif (3 : 1). <i>Exemple</i> : sur 200 plantes, on attend 150 dominantes et 50 récessives.</p><p><b>Test-cross</b> : on croise un individu de phénotype dominant avec un homozygote récessif aa. Si tous les descendants sont dominants, il est AA ; s\'il y a 1/2 de récessifs (1 : 1), il est Aa.</p></div>'
 +'<div class="tcard"><b class="h">Quand la dominance n\'est pas complète</b><p><b>Dominance incomplète</b> : l\'hétérozygote a un phénotype intermédiaire (belle-de-nuit : RR rouge, RB rose, BB blanc). Le croisement F1 × F1 donne 1 : 2 : 1 en phénotypes. <b>Codominance</b> : les deux allèles s\'expriment ensemble (groupe AB : A et B). <b>Allèles multiples</b> : un gène a plus de deux allèles dans la population, mais chaque individu n\'en porte que deux. Groupes sanguins : A et B sont dominants sur O ; A = AA ou AO, B = BB ou BO, AB = AB, O = OO. Chez le lapin : C &gt; c<sup>ch</sup> &gt; c<sup>h</sup> &gt; c.</p></div>'
 +'<div class="tcard"><b class="h">Pièges et raisonnement</b><p>Les proportions de Mendel sont des <b>probabilités</b>, pas des obligations : elles ne se vérifient que sur de grands effectifs. Chaque naissance est indépendante (même après trois enfants dominants, la probabilité d\'un récessif reste 1/4). <i>Exemple</i> : pour deux parents Aa, P(4 enfants dominants) = (3/4)<sup>4</sup> ≈ 0,32. Un rapport 2 : 1 au lieu de 3 : 1 suggère un génotype létal. Pour retrouver un génotype caché, pars du phénotype récessif (aa) : il indique ce que chaque parent a transmis. En paternité, un groupe sanguin permet d\'<b>exclure</b> un homme, jamais de prouver qu\'il est le père.</p></div>'
});
SFA.figs("c01", [
 F(function(p){ /* 1 génotype / phénotype */
  box(14,14,432,252,AX,'#fbfcfd',12);
  /* graine lisse */
  ell(120,100,46,40,'#e9d36b',INK,2.4);ell(105,86,12,8,'rgba(255,255,255,.55)');TB('graine lisse',120,170,INK,15);
  /* graine ridée */
  ctx.beginPath();for(var i=0;i<=40;i++){var a=i/40*6.2832,r=1+.08*Math.sin(a*7);ctx.lineTo(340+r*46*Math.cos(a),100+r*38*Math.sin(a));}ctx.closePath();ctx.fillStyle='#d9bd4c';ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.stroke();
  ctx.strokeStyle='rgba(90,70,0,.4)';ctx.lineWidth=1.4;for(var k=0;k<4;k++){ctx.beginPath();ctx.moveTo(310+k*5,90+k*10);ctx.quadraticCurveTo(340,85+k*10,372-k*3,96+k*9);ctx.stroke();}
  TB('graine ridée',340,170,INK,15);
  TB('R > r',230,40,ORANGE,22);
  var a=sg(p,0,.4);ga(1-a);TB('génotype ?',120,208,GREY,18);TB('génotype ?',340,208,GREY,18);g1();
  ga(a);sup('RR','',92,215,BLUE_D,22);TB('ou',130,215,GREY,14);TB('Rr',160,215,BLUE_D,22);TB('rr',340,215,DRED,24);
  TB('au moins un R',120,241,GREY,13);TB('aucun R',340,241,GREY,13);g1();
 }),
 F(function(p){ /* 2 test-cross */
  TB('Aa × aa',230,32,INK,24);
  pun(70,42,66,['A','a'],['a','a'],['Aa','aa','Aa','aa'],[DOM,REC,DOM,REC],p,20);
  var a=sg(p,.5,.9);ga(a);box(300,80,138,92,ORANGE,'#fdf5e9',10);TB('1/2 aa',369,118,DRED,28);TB('1/2 Aa',369,152,BLUE_D,24);g1();
  ga(1-a);TB('proportion de aa ?',369,125,GREY,16);g1();
  TB('parent aa : gamètes a seulement',230,262,GREY,13);
 }),
 F(function(p){ /* 3 cobayes */
  pig(80,100,1.35,'#2c2c2c','#fff');pig(250,100,1.35,'#2c2c2c','#fff');pig(190,205,.95,'#fff');
  TB('noir',90,160,INK,14);TB('noir',262,160,INK,14);TB('blanc',200,248,INK,14);
  TB('×',172,104,GREY,28);A(172,125,0,50,GREY,'',2.6);
  var a=sg(p,0,.5);ga(a);TB('Nn',90,184,BLUE_D,22);TB('Nn',262,184,BLUE_D,22);TB('nn',275,226,DRED,22);g1();
  ga(1-a);TB('?',90,184,GREY,22);TB('?',262,184,GREY,22);g1();
  var b=sg(p,.5,1);ga(b);box(330,60,116,140,ORANGE,'#fdf5e9',10);TB('P(blanc)',388,92,INK,14);TB('1/4',388,130,DRED,32);TB('noirs : 1/3 NN',388,168,GREY,13);TB('2/3 Nn',388,186,GREY,13);g1();
 }),
 F(function(p){ /* 4 belle-de-nuit */
  TB('P',20,54,GREY,14);flower(70,50,24,'#e24b4a');TB('×',112,56,GREY,22);flower(154,50,24,'#f4f4f4');TB('RR',70,92,DRED,16);TB('BB',154,92,GREY,16);
  A(112,100,0,22,GREY,'',2.6);TB('F1',20,150,GREY,14);flower(112,150,24,'#f4a9b8');TB('RB (rose)',112,190,INK,13);
  A(150,150,66,0,GREY,'',2.6);
  TB('F2 : 200 plantes',330,26,INK,15);
  var cols=['#e24b4a','#f4a9b8','#f4f4f4'],labs=['rouges','roses','blanches'],v=[50,100,50];
  for(var i=0;i<3;i++){flower(262+i*70,60,16,cols[i]);TB(labs[i],262+i*70,100,GREY,12);}
  var a=sg(p,0,.8);for(var j=0;j<3;j++){bar(240+j*70,240,44,v[j]*1.1*a,cols[j]===  '#f4f4f4'?'#d5d8dc':cols[j],null);}
  ga(sg(p,.5,.9));for(var j=0;j<3;j++)TB(String(v[j]),262+j*70,232-v[j]*1.1-6,INK,20);TB('1 : 2 : 1',330,266,ORANGE,16);g1();
  LN(236,240,450,240,AX,1.5);
 }),
 F(function(p){ /* 5 lapins */
  var cs=[['#a08a6e',null,'C','agouti'],['#c9ccd0',null,'cch','chinchilla'],['#f6f4f0','#4a4a4a','ch','himalayen'],['#fbf8f8',null,'c','albinos']];
  for(var i=0;i<4;i++){rab(60+i*100,92,1.05,cs[i][0],cs[i][1],i===3?RED:INK);if(cs[i][2].length>1)sup('c',cs[i][2],60+i*100,150,INK,20);else TB(cs[i][2],60+i*100,150,INK,20);TB(cs[i][3],60+i*100,170,GREY,12);if(i<3)TB('>',110+i*100,92,ORANGE,24);}
  var a=sg(p,0,.6);ga(1-a);TB('c',0,0,'#fff',1);g1();
  box(30,190,400,76,ORANGE,'#fdf5e9',10);
  ga(1-a);TB('cch ch  ×  ch c   →   descendants ?',230,236,GREY,17);g1();
  ga(a);sup('c','ch',70,222,BLUE_D,18);sup('c','h',100,222,BLUE_D,18);TB('1/4 chinchilla  ·  1/4 chinchilla',250,222,INK,14);
  TB('1/4 himalayen  ·  1/4 himalayen',250,250,INK,14);TB('→ ½ – ½',405,236,ORANGE,15);g1();
 }),
 F(function(p){ /* 6 AB x OO */
  drop(70,70,30,VIOLET,'AB',22);TB('père',70,128,GREY,13);drop(200,70,30,GREY,'O',22);TB('mère',200,128,GREY,13);TB('×',135,80,GREY,24);
  pun(230,22,52,['A','B'],['O','O'],['AO','BO','AO','BO'],[RED,BLUE,RED,BLUE],p,17);
  var a=sg(p,.4,.9);ga(a);drop(95,215,24,RED,'A',20);drop(165,215,24,BLUE,'B',20);TB('ou',130,232,GREY,13);TB('groupes possibles',130,262,INK,13);
  TB('ni AB, ni O',360,238,DRED,17);g1();ga(1-a);TB('groupes des enfants ?',120,225,GREY,16);g1();
 }),
 F(function(p){ /* 7 souris jaunes */
  mouse(60,60,1.1,'#e0b020');mouse(150,60,1.1,'#e0b020');TB('×',105,64,GREY,22);TB('jaune × jaune',105,98,INK,13);
  pun(210,10,56,['Y','y'],['Y','y'],['YY','Yy','Yy','yy'],['#e0b020','#e0b020','#e0b020',GREY],p,18);
  var a=sg(p,.2,.7);ga(a);crs(210+56*1.5,10+56*1.5,DRED,22);TB('létal',210+56*1.5,10+56*1.5-26,DRED,12);g1();
  var b=sg(p,.6,1);ga(b);box(20,130,172,120,ORANGE,'#fdf5e9',10);TB('survivants',106,154,INK,14);TB('2/3 jaunes',106,186,'#8a6a00',20);TB('1/3 grises',106,214,GREY,20);TB('portée : 6 au lieu de 8',106,240,GREY,12);g1();
  ga(1-b);TB('jaune × jaune',106,200,GREY,1);TB('2 jaunes : 1 grise ?',106,200,GREY,15);g1();
  mouse(400,250,.8,GREY);TB('grise = yy',400,270,GREY,12);
 }),
 F(function(p){ /* 8 quatre sur quatre */
  for(var i=0;i<4;i++){DOT(60+i*48,40,13,DOM+'55');ctx.strokeStyle=DOM;ctx.lineWidth=2;ctx.beginPath();ctx.arc(60+i*48,40,13,0,7);ctx.stroke();TB('D',60+i*48,45,BLUE_D,14);}
  TB('4 enfants dominants (parents Aa)',240,45,INK,14,'left');
  var v=[1,12,54,108,81],f=[0.4,4.7,21.1,42.2,31.6],a=sg(p,0,.8);
  LN(40,240,440,240,AX,1.5);
  for(var k=0;k<5;k++){var bx=60+k*78;ga(k===4||p>0?1:.4);bar(bx,240,44,v[k]/108*130*a,k===4?ORANGE:'#b8c4d6',k+' / 4',null);g1();
   ga(sg(p,.4,.9));TB(String(f[k]).replace('.',',')+' %',bx+22,232-v[k]/108*130*a,k===4?DRED:INK,k===4?15:12);g1();}
  TB('nombre d\'enfants dominants',240,272,GREY,12);
  ga(1-sg(p,0,.4));TB('probabilité ?',330,110,GREY,18);g1();
 }),
 F(function(p){ /* 9 exactement 3 sur 4 */
  TB('3 dominants + 1 récessif : 4 positions',230,28,INK,15);
  for(var s=0;s<4;s++){for(var i=0;i<4;i++){var r=i===s;DOT(60+i*40,70+s*38,12,(r?RED:DOM)+'55');ctx.strokeStyle=r?RED:DOM;ctx.lineWidth=2;ctx.beginPath();ctx.arc(60+i*40,70+s*38,12,0,7);ctx.stroke();TB(r?'r':'D',60+i*40,75+s*38,r?DRED:BLUE_D,14);}
   ga(sg(p,s*.12,s*.12+.25));TB('27/256',250,76+s*38,INK,15);g1();}
  var a=sg(p,.55,.95);ga(a);LN(300,70,300,184,GREY,1.6);box(318,84,126,86,ORANGE,'#fdf5e9',10);TB('4 × 27/256',381,114,INK,15);TB('= 27/64',381,146,DRED,24);TB('≈ 42 %',381,166,GREY,13);g1();
  ga(1-a);TB('P = ?',381,134,GREY,22);g1();
  TB('(3/4)³ × (1/4) pour chaque séquence',230,262,GREY,13);
 }),
 F(function(p){ /* 10 paternité */
  drop(60,70,26,RED,'A',20);TB('mère (AO)',60,116,GREY,13);drop(60,200,22,GREY,'O',18);TB('enfant OO',60,238,GREY,13);A(60,126,0,36,GREY,'',2.4);
  var m=[['AB','A ou B'],['AA','A'],['BB','B'],['BO','B ou O']];
  for(var i=0;i<4;i++){var y=30+i*58,ok=i===3,a=sg(p,i*.15,i*.15+.3);
   box(140,y,300,46,ok&&a>.9?DGREEN:AX,ok&&a>.9?'#e8f7f1':'#fff',8,2.4);TB('homme '+m[i][0],162,y+29,INK,16,'left');
   ga(a);TB('gamètes : '+m[i][1],280,y+29,GREY,13,'left');if(ok)chk(420,y+23,DGREEN,10);else crs(420,y+23,DRED,8);g1();}
 })
]);
})();
