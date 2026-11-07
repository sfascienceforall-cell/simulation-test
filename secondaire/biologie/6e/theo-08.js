/* SFA · Biologie 6e · théorie animée et devantures (chapitre 08) */
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
function mlr(x,y,s,spark,aa,t){/* appareil de Miller schématique, origine (x,y) = coin haut-gauche, largeur 200*s */
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineWidth=3;ctx.strokeStyle=INK;
 /* ballon */ctx.fillStyle='#e3f0fb';ctx.beginPath();ctx.arc(30,150,28,0,7);ctx.fill();ctx.stroke();
 /* tuyau */ctx.beginPath();ctx.moveTo(30,122);ctx.lineTo(30,30);ctx.lineTo(70,30);ctx.moveTo(130,30);ctx.lineTo(180,30);ctx.lineTo(180,160);ctx.moveTo(180,190);ctx.lineTo(180,214);ctx.lineTo(30,214);ctx.lineTo(30,178);ctx.stroke();
 /* sphère */ctx.fillStyle='#f6f9fc';ctx.beginPath();ctx.arc(100,30,32,0,7);ctx.fill();ctx.stroke();
 /* condenseur */ctx.strokeStyle=BLUE;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(172,70);ctx.lineTo(172,140);ctx.moveTo(188,70);ctx.lineTo(188,140);ctx.stroke();
 /* piège */ctx.fillStyle='#fdf5e9';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(180,176,16,0,PI,false);ctx.lineTo(164,160);ctx.lineTo(196,160);ctx.closePath();ctx.fill();ctx.stroke();
 if(spark){ctx.strokeStyle=YEL;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(80,18);ctx.lineTo(96,28);ctx.lineTo(88,34);ctx.lineTo(108,46);ctx.stroke();LN(74,16,80,18,INK,3);LN(116,44,122,48,INK,3);}
 for(var i=0;i<(aa||0);i++)DOT(170+(i%4)*7,172+Math.floor(i/4)*-6+2,3,GREEN);
 ctx.restore();}
function cellp(x,y,kind,s){s=s||1;
 if(kind==='coli'){ctx.fillStyle='#e8f1fb';ctx.beginPath();ctx.roundRect(x-34*s,y-14*s,68*s,28*s,14*s);ctx.fill();ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.stroke();ctx.strokeStyle=VIOLET;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,12*s,6*s,0,0,7);ctx.stroke();}
 if(kind==='levure'){ell(x,y,28*s,22*s,'#fdf5e9',ORANGE,2.4);ell(x+34*s,y-12*s,10*s,9*s,'#fdf5e9',ORANGE,2.2);ell(x,y,10*s,9*s,'#e6d8f7',VIOLET,2);}
 if(kind==='archee'){ell(x,y,26*s,26*s,'#eaf6f0',GREEN,2.4);for(var i=0;i<6;i++)DOT(x+Math.cos(i)*12*s,y+Math.sin(i)*12*s,2.6,DGREEN);}
 if(kind==='feuille'){ctx.fillStyle='#eaf6e6';ctx.beginPath();ctx.roundRect(x-32*s,y-24*s,64*s,48*s,8*s);ctx.fill();ctx.strokeStyle=DGREEN;ctx.lineWidth=2.4;ctx.stroke();ell(x+4*s,y,12*s,10*s,'#e6d8f7',VIOLET,2);for(var i=0;i<4;i++)ell(x-20*s+i*3*s,y-12*s+i*8*s,7*s,4*s,GREEN,null);}}
function clockp(cx,cy,r){ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fillStyle='#fbfcfd';ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.stroke();
 for(var h=0;h<24;h++){var a=h/24*6.2832-1.5708,l=h%6===0?12:6;LN(cx+Math.cos(a)*(r-l),cy+Math.sin(a)*(r-l),cx+Math.cos(a)*r,cy+Math.sin(a)*r,INK,h%6===0?2.4:1.2);}
 [[0,'0 h'],[6,'6 h'],[12,'12 h'],[18,'18 h']].forEach(function(q){var a=q[0]/24*6.2832-1.5708;TB(q[1],cx+Math.cos(a)*(r-26),cy+Math.sin(a)*(r-26)+4,GREY,12);});}
function hp(age){return (4.54-age)/4.54*24;}
function clkpt(cx,cy,r,h){var a=h/24*6.2832-1.5708;return {x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r};}
SFA.theo("c08", {
 icon: function () {
  mlr(W*.06,H*.08,.86,true,6);TB('CH₄ · NH₃ · H₂ · H₂O',W*.28,H*.93,GREY,13);
  var cx=W*.74,cy=H*.5,r=Math.min(H*.38,W*.2);clockp(cx,cy,r);var a=clkpt(cx,cy,r-18,14.5);LN(cx,cy,a.x,a.y,RED,3);DOT(cx,cy,4,INK);TB('4,54 Ga en 24 h',cx,cy+r+22,ORANGE,15);
 },
 sub: [
 {t:"Origine de la vie", anim: G(function (t) {
  /* appareil grand format */
  var ph=(t%900)/900,aa=Math.floor(ph*22);
  mlr(130,24,1.18,Math.floor(t/12)%3!==0,aa);
  TB('CH₄  NH₃  H₂',240,128,GREY,13);TB('vapeur d\'eau',70,240,BLUE_D,13);
  /* bulles + vapeur */
  for(var i=0;i<5;i++){var u=((t*.02+i*.2)%1);DOT(164+Math.sin(u*9+i)*6,250-u*80,3,'rgba(55,138,221,.5)');}
  ga(.9);TB('décharges électriques',250,12,YEL,14);g1();
  TB('condenseur',420,150,BLUE_D,13,'left');TB('piège : acides aminés',420,258,DGREEN,14,'left');
  var d=sg(ph,0,.9);TB('après quelques jours :',500,60,GREY,13,'left');TB(aa+' molécules organiques',500,84,DGREEN,16,'left');
 }),
 th:'<div class="tcard"><b class="h">Des briques de la vie à la cellule</b><p>La Terre s\'est formée il y a 4,54 milliards d\'années (Ga) ; les premières traces de vie datent d\'environ 3,5 à 3,8 Ga. La vie est apparue <b>progressivement</b> : formation de molécules organiques simples, assemblage en polymères, apparition d\'un système capable de se copier et de varier, puis de cellules délimitées par une membrane. On ignore le détail : ce sont des <b>hypothèses</b> testées par l\'expérience.</p></div>'
 +'<div class="tcard"><b class="h">L\'expérience de Miller (1953)</b><p>Dans un appareil <b>stérile</b>, de l\'eau chauffée (vapeur) circule avec un mélange de <b>méthane CH<sub>4</sub>, d\'ammoniac NH<sub>3</sub> et de dihydrogène H<sub>2</sub></b> (sans dioxygène, comme dans l\'atmosphère primitive supposée) soumis à des étincelles (éclairs). Après quelques jours, le piège contient des <b>acides aminés</b>. Un montage fiable exige : stérilisation (pas de contamination), <b>témoin sans étincelles</b> (l\'énergie est-elle la cause ?), vérification des réactifs, analyse chimique identifiant les molécules.</p></div>'
 +'<div class="tcard"><b class="h">Ce que montre — et ne montre pas — l\'expérience</b><p>Elle montre que des molécules organiques peuvent se former <b>spontanément</b> dans des conditions prébiotiques. Elle ne montre ni comment apparaissent la réplication, le métabolisme et les cellules, ni que l\'atmosphère primitive avait exactement cette composition. Les sources hydrothermales et les météorites sont d\'autres sources possibles de molécules organiques.</p></div>'
 +'<div class="tcard"><b class="h">Le monde à ARN</b><p>Problème « de l\'œuf et de la poule » : l\'information (ADN) est copiée par des protéines, mais les protéines sont codées par l\'ADN. Hypothèse : l\'<b>ARN</b> a joué les deux rôles à la fois, <b>support d\'information</b> (séquence de nucléotides, copiable) et <b>catalyseur</b> (les <b>ribozymes</b>, comme le ribosome). L\'ARN aurait précédé l\'ADN et les protéines. C\'est un modèle de travail, non une certitude (l\'ARN est plutôt fragile).</p></div>'},
 {t:"Classification et trois domaines", anim: G(function (t) {
  var P=170,k=((t/P)|0)%4,u=(t%P)/P;
  /* arbre */
  var rx=40,ry=150;LN(20,ry,rx,ry,INK,3);
  TB('ancêtre commun',20,ry-12,GREY,12,'left');
  LN(rx,60,rx,205,INK,3);LN(rx,60,260,60,INK,3);LN(rx,205,120,205,INK,3);LN(120,150,120,250,INK,3);LN(120,150,260,150,INK,3);LN(120,250,260,250,INK,3);
  var nm=['Bactéries','Archées','Eucaryotes'],yy=[60,150,250],cc=[BLUE,GREEN,ORANGE];
  var hi=[[0,0,1],[0,1,1],[1,1,0],[0,1,0]][k];
  yy.forEach(function(y,i){var on=hi[i];ga(on?1:.35);box(270,y-20,120,40,cc[i],cc[i]+'22',10,on?3:2);TB(nm[i],330,y+6,dk(cc[i]),17);g1();});
  ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.globalAlpha=.6;if(k===1){LN(120,150,120,250,RED,6);LN(120,150,260,150,RED,6);LN(120,250,260,250,RED,6);}ctx.globalAlpha=1;
  /* caractères */
  var ch=['noyau','histones','ribosomes','lipides'],val=[['non','non','oui'],['non','oui','oui'],['70S','70S','80S'],['ester','éther','ester']];
  var tx=420;TB('caractère',tx+60,24,GREY,13);for(var j=0;j<3;j++)TB(nm[j].slice(0,5)+'.',tx+170+j*0+0,24,GREY,1);
  ['B','A','E'].forEach(function(l,j){TB(l,tx+130+j*40,24,dk(cc[j]),15);});
  for(var i=0;i<4;i++){var on=i===[0,1,1,3][k]&&true;var y=50+i*40;ga(i===k?1:.45);box(tx-4,y,260,32,i===k?RED:AX,i===k?'#fdecec':'#fff',8,i===k?2.6:1.6);TB(ch[i],tx+6,y+22,INK,14,'left');for(var j=0;j<3;j++)TB(val[i][j],tx+130+j*40,y+22,dk(cc[j]),14);g1();}
  TB(['le noyau : propre aux Eucaryotes','les histones rapprochent Archées et Eucaryotes','ribosomes 70S : tous les procaryotes','lipides à liaison éther : propres aux Archées'][k],350,286,ORANGE,15);
 }),
 th:'<div class="tcard"><b class="h">Procaryotes et eucaryotes</b><p>Les <b>procaryotes</b> (bactéries, archées) n\'ont <b>pas de noyau</b> : leur ADN (souvent circulaire) est dans le cytoplasme ; ils n\'ont pas de mitochondries. Les <b>eucaryotes</b> (animaux, végétaux, champignons, protistes) ont un <b>noyau</b> délimité par une membrane, des mitochondries (et des chloroplastes chez les végétaux). Une levure et une cellule de feuille sont eucaryotes ; E. coli est une bactérie, procaryote.</p></div>'
 +'<div class="tcard"><b class="h">Les trois domaines</b><p>Les analyses moléculaires distinguent trois domaines : <b>Bactéries</b>, <b>Archées</b>, <b>Eucaryotes</b>. Archées et Bactéries sont toutes deux procaryotes, mais très différentes : les archées ont des <b>lipides à liaison éther</b>, des <b>histones</b> associées à l\'ADN et une machinerie de transcription proche de celle des eucaryotes ; les ribosomes sont 70S chez les procaryotes et 80S chez les eucaryotes. <i>Exemple</i> : un organisme sans noyau, ribosomes 70S, lipides éther, histones → <b>archée</b>.</p></div>'
 +'<div class="tcard"><b class="h">Classer selon la parenté</b><p>« Procaryote » désigne un niveau d\'organisation (pas de noyau), pas un groupe de parenté : l\'absence de noyau est un état ancestral. On classe selon les <b>caractères dérivés partagés</b> : les archées partagent plus de caractères moléculaires avec les eucaryotes qu\'avec les bactéries, donc elles leur sont <b>plus proches parentes</b>. Les mitochondries et les chloroplastes proviennent de bactéries intégrées dans une cellule hôte (<b>endosymbiose</b>).</p></div>'},
 {t:"Histoire de la Terre et des hominidés", anim: G(function (t) {
  var ph=(t%800)/800,cx=190,cy=150,r=120,hh=ph*24;
  clockp(cx,cy,r);
  var ev=[[4.54,'formation de la Terre',INK],[3.8,'premières traces de vie',GREEN],[2.4,'dioxygène (photosynthèse)',BLUE],[1.8,'premiers eucaryotes',VIOLET],[0.57,'animaux pluricellulaires',ORANGE],[0.23,'dinosaures',DRED]];
  ev.forEach(function(e,i){var h=hp(e[0]);if(hh>=h-.01){var p1=clkpt(cx,cy,r-6,h);DOT(p1.x,p1.y,6,e[2]);ga(1);box(420,26+i*38,262,30,e[2],'#fff',8,2);TB(e[1],430,46+i*38,dk(e[2]),13,'left');TB(String(Math.round(h*10)/10).replace('.',',')+' h',676,46+i*38,GREY,13,'right');g1();}});
  var a=clkpt(cx,cy,r-14,hh);LN(cx,cy,a.x,a.y,RED,3);DOT(cx,cy,5,INK);
  ga(sg(ph,.9,1));TB('Homo sapiens : 5,7 s avant minuit',cx,cy+r+26,DRED,15);g1();
  TB('4,54 Ga = 24 h',cx,16,ORANGE,15);
 }),
 th:'<div class="tcard"><b class="h">Se repérer dans les temps géologiques</b><p>Pour comprendre la durée, on ramène 4,54 milliards d\'années à 24 h : <b>heure = (4,54 − âge en Ga) / 4,54 × 24</b>. <i>Exemples</i> : premiers eucaryotes (1,8 Ga) à (4,54 − 1,8) / 4,54 × 24 ≈ 14 h 29 ; animaux pluricellulaires (0,57 Ga) vers 21 h ; Homo sapiens (0,0003 Ga) à environ 5,7 secondes avant minuit. Sur une année de 365 jours : l\'explosion cambrienne (0,54 Ga) tombe vers le 18 novembre, les dinosaures durent environ 13 jours, le genre Homo apparaît environ 5,4 h avant la fin de l\'année. Une grande part de l\'histoire de la Terre (≈ 87 % avant les animaux pluricellulaires) est celle de la vie unicellulaire.</p></div>'
 +'<div class="tcard"><b class="h">Dater : l\'uranium 238</b><p>Pour les roches très anciennes : uranium 238 (T½ = 4,47 Ga). Âge = T½ × log<sub>2</sub>(1/f). <i>Exemple</i> : 80 % restant → 0,322 × 4,47 ≈ 1,44 Ga. Quand f > 50 %, il s\'est écoulé moins d\'une demi-vie.</p></div>'
 +'<div class="tcard"><b class="h">Le buisson des hominidés</b><p>L\'évolution humaine n\'est pas une ligne droite mais un <b>buisson</b> d\'espèces qui ont parfois coexisté. Le volume crânien augmente globalement mais pas régulièrement : H. habilis (610 cm³, 1,9 Ma), H. erectus (950 cm³, 1,2 Ma), H. heidelbergensis (1 200 cm³, 0,4 Ma) : (950 − 610) / 0,7 ≈ 486 cm³/Ma puis (1 200 − 950) / 0,8 ≈ 313 cm³/Ma. H. floresiensis (420 cm³, 0,06 Ma) vivait récemment avec un petit cerveau : il n\'existe pas de tendance universelle « toujours plus grand ».</p></div>'}
 ]
});
SFA.figs("c08", [
 F(function(p){ /* 1 gaz de Miller */
  mlr(100,10,1.05,true,Math.floor(sg(p,.2,1)*14));
  TB('ballon',60,250,GREY,12);TB('éclairs',142,12,YEL,13);TB('piège',350,200,DGREEN,13,'left');
  var a=sg(p,.2,.8);ga(1-a);TB('mélange de gaz ?',350,80,GREY,17,'left');g1();
  ga(a);box(300,40,150,92,DGREEN,'#e8f7f1',10);TB('CH₄ · NH₃ · H₂',375,76,INK,15);TB('+ vapeur d\'eau',375,100,INK,14);TB('→ acides aminés',375,122,DGREEN,14);g1();
 }),
 F(function(p){ /* 2 procaryote ou eucaryote */
  var K=[['coli','a  E. coli',20,12,0],['levure','b  levure de boulanger',240,12,1],['archee','c  archée (source chaude)',20,146,0],['feuille','d  cellule de feuille de chêne',240,146,1]];
  K.forEach(function(k,i){box(k[2],k[3],200,122,AX,'#fbfcfd',10);cellp(k[2]+62,k[3]+54,k[0],1.15);TB(k[1],k[2]+100,k[3]+108,INK,12);
   var a=sg(p,i*.15,i*.15+.3);ga(a);var c=k[4]?ORANGE:BLUE;box(k[2]+128,k[3]+10,64,24,c,c+'22',6);TB(k[4]?'eucaryote':'procaryote',k[2]+160,k[3]+27,dk(c),11);g1();});
 }),
 F(function(p){ /* 3 Terre en 24 h */
  var cx=150,cy=140,r=105;clockp(cx,cy,r);
  var a=sg(p,0,.7);var h1=hp(1.8)*a;var q=clkpt(cx,cy,r-12,h1);LN(cx,cy,q.x,q.y,RED,3);DOT(cx,cy,4,INK);
  ga(sg(p,.5,1));var q2=clkpt(cx,cy,r,hp(1.8));DOT(q2.x,q2.y,7,RED);var q3=clkpt(cx,cy,r,hp(.0003));DOT(q3.x,q3.y,6,BLUE);
  box(290,40,160,64,RED,'#fdecec',10);TB('eucaryotes',370,64,INK,13);TB('≈ 14 h 29',370,92,DRED,20);
  box(290,126,160,64,BLUE,'#e6f1fb',10);TB('Homo sapiens',370,150,INK,13);TB('5,7 s avant 24 h',370,178,BLUE_D,15);g1();
  TB('4,54 Ga = 24 h',150,264,GREY,13);
 }),
 F(function(p){ /* 4 uranium */
  var gx=50,gy=224,gw=360,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh-8,AX,1.6);TB('U-238 restant',gx+10,gy-gh-12,GREY,12,'left');TB('temps (Ga)',gx+gw,gy+30,GREY,12,'right');
  function Y(f){return gy-f*gh;}ctx.strokeStyle=ORANGE;ctx.lineWidth=2.8;ctx.beginPath();for(var s=0;s<=9;s+=.2){var x=gx+s/9*gw,y=Y(Math.pow(.5,s/4.47));s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(var s=0;s<=9;s+=3)TB(String(s),gx+s/9*gw,gy+16,GREY,12);TB('4,47',gx+4.47/9*gw,gy+16,GREY,1);
  LN(gx+4.47/9*gw,gy,gx+4.47/9*gw,Y(.5),GREY,1.2,[3,3]);LN(gx,Y(.5),gx+4.47/9*gw,Y(.5),GREY,1.2,[3,3]);TB('50 %',gx-6,Y(.5)+4,GREY,11,'right');TB('T½',gx+4.47/9*gw,gy+30,GREY,12);
  var a=sg(p,0,.6),x8=gx+1.44/9*gw;ga(a);LN(gx,Y(.8),x8,Y(.8),RED,2,[4,3]);LN(x8,Y(.8),x8,gy,RED,2,[4,3]);DOT(x8,Y(.8),6,RED);TB('80 %',gx-6,Y(.8)+4,DRED,12,'right');TB('≈ 1,4 Ga',x8+10,Y(.8)-12,DRED,16,'left');g1();
  ga(1-a);TB('âge ?',250,110,GREY,26);g1();
 }),
 F(function(p){ /* 5 cerveau */
  var gx=50,gy=230,gw=360,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('volume crânien (cm³)',gx+8,gy-gh-8,GREY,12,'left');TB('âge (Ma)',gx+gw,gy+32,GREY,12,'right');
  function X(t){return gx+(1.9-t)/1.9*gw*.97;}function Y(v){return gy-(v-300)/1000*gh;}
  var P=[[1.9,610,'habilis'],[1.2,950,'erectus'],[.4,1200,'heidelb.'],[.06,420,'floresiensis']];
  [0,.5,1,1.5].forEach(function(v){TB(String(v).replace('.',','),X(v),gy+16,GREY,11);});
  var a=sg(p,0,.7);ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(1.9),Y(610));ctx.lineTo(X(1.2),Y(610)+(Y(950)-Y(610))*Math.min(1,a*2));if(a>.5){ctx.lineTo(X(1.2)+(X(.4)-X(1.2))*Math.min(1,(a-.5)*2),Y(950)+(Y(1200)-Y(950))*Math.min(1,(a-.5)*2));}ctx.stroke();
  P.slice(0,3).forEach(function(q){DOT(X(q[0]),Y(q[1]),6,BLUE);TB(q[2],X(q[0]),Y(q[1])-12,BLUE_D,12);});
  DOT(X(.06),Y(420),6,RED);TB('floresiensis 420',X(.06)-6,Y(420)-12,DRED,12,'right');
  ga(sg(p,.5,1));TB('≈ 486 cm³/Ma',X(1.55),Y(780)-4,DGREEN,14);TB('≈ 313 cm³/Ma',X(.8),Y(1075)-14,DGREEN,14);g1();
 }),
 F(function(p){ /* 6 archées */
  LN(30,140,60,140,INK,3);LN(60,70,60,210,INK,3);LN(60,70,260,70,INK,3);LN(60,210,130,210,INK,3);LN(130,170,130,250,INK,3);LN(130,170,260,170,INK,3);LN(130,250,260,250,INK,3);
  [['Bactéries',70,BLUE],['Archées',170,GREEN],['Eucaryotes',250,ORANGE]].forEach(function(q){box(270,q[1]-20,130,40,q[2],q[2]+'22',10);TB(q[0],335,q[1]+6,dk(q[2]),17);});
  var a=sg(p,.2,.9);ga(a);LN(130,170,130,250,RED,6);LN(130,170,260,170,RED,6);LN(130,250,260,250,RED,6);TB('plus proches parentes',150,204,DRED,13,'left');DOT(130,210,6,RED);g1();
  ga(a);TB('histones, ARN polymérases',220,28,DGREEN,13);g1();
  ga(1-a);TB('?',150,210,GREY,30);g1();
 }),
 F(function(p){ /* 7 montage fiable */
  TB('témoin',100,18,GREY,13);
  mlr(14,30,.8,true,Math.floor(sg(p,.2,1)*8));TB('avec étincelles',100,236,INK,13);
  mlr(240,30,.8,false,0);TB('sans étincelles',330,236,INK,13);
  var a=sg(p,.3,.9);ga(a);chk(190,246,DGREEN,10);crs(420,246,DRED,9);TB('acides aminés',100,258,DGREEN,12);TB('rien : l\'énergie est la cause',330,258,DRED,12);g1();
  TB('appareil stérilisé',230,18,GREY,13);
 }),
 F(function(p){ /* 8 quel domaine */
  var cr=['pas de noyau','ribosomes 70S','lipides à liaison éther','ADN + histones'];
  cr.forEach(function(c,i){box(14,16+i*54,190,44,AX,'#fff',8);TB(c,24,44+i*54,INK,14,'left');});
  var cc=[BLUE,GREEN,ORANGE],nm=['Bactéries','Archées','Eucaryotes'],a=sg(p,0,.7);
  nm.forEach(function(n,i){var y=30+i*72,on=i===1;ga(on?1:1-a*.7);box(250,y,190,56,cc[i],cc[i]+(on&&a>.5?'55':'22'),10,on&&a>.5?3.4:2);TB(n,345,y+36,dk(cc[i]),18);g1();});
  ga(a);A(210,120,34,0,GREEN,'',3);chk(425,56,DGREEN,8);g1();
  ga(1-a);TB('?',345,130,GREY,34);g1();
 }),
 F(function(p){ /* 9 année terrestre */
  var x0=20,w=420,y=104;function X(d){return x0+d/365*w;}
  ctx.fillStyle='#eef1f4';ctx.fillRect(x0,y-14,w,28);var mn=['J','F','M','A','M','J','J','A','S','O','N','D'],ds=[0,31,59,90,120,151,181,212,243,273,304,334];
  ds.forEach(function(d,i){LN(X(d),y-14,X(d),y+14,GREY,1);TB(mn[i],X(d)+w/24,y+5,GREY,12);});
  var a=sg(p,0,.7);ga(a);
  var c=hp?0:0;DOT(X(321.6),y,7,RED);LN(X(321.6),y-12,X(321.6),y-52,RED,1.6);TB('explosion cambrienne',X(321.6)-8,y-56,DRED,12,'right');TB('≈ 18 nov.',X(321.6)-8,y-40,DRED,12,'right');
  ctx.fillStyle=BLUE;ctx.fillRect(X(346.5),y-14,X(359.7)-X(346.5),28);TB('dinosaures : 13 jours',X(359.7)+6,y+36,BLUE_D,13,'right');
  DOT(X(364.78),y,7,ORANGE);TB('Homo : 5,4 h avant la fin',X(364.78)+8,y+58,ORANGE,12,'right');g1();
  ga(sg(p,.5,1));box(30,196,400,56,DGREEN,'#e8f7f1',10);TB('animaux pluricellulaires : 87 % de l\'histoire déjà écoulée',230,230,DGREEN,14);g1();
  ga(1-a);TB('quand ?',230,226,GREY,20);g1();
 }),
 F(function(p){ /* 10 monde à ARN */
  TB('cercle de l\'œuf et de la poule',130,22,GREY,13);
  box(40,50,90,40,BLUE,'#e6f1fb',8);TB('ADN',85,76,BLUE_D,18);box(40,160,90,40,ORANGE,'#fdf5e9',8);TB('protéines',85,186,ORANGE,15);
  A(60,96,0,58,GREY,'',2.4);A(110,156,0,-58,GREY,'',2.4);TB('codent',54,130,GREY,11,'right');TB('copient',118,130,GREY,11,'left');
  var a=sg(p,.2,.9);ga(a);ell(340,125,96,84,'#f1f0fc',VIOLET,3);TB('ARN',340,108,VIOLET,30);TB('information',340,138,INK,15);TB('+ catalyse (ribozymes)',340,160,INK,15);
  A(170,125,80,0,GREY,'',2.4);g1();
  ga(1-a);TB('?',340,140,GREY,40);g1();
  TB('hypothèse du monde à ARN',230,262,GREY,13);
 })
]);
})();
