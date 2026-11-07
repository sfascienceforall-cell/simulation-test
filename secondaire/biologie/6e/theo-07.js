/* SFA · Biologie 6e · théorie animée et devantures (chapitre 07) */
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
function lerpc(a,b,u){function h(s){return [parseInt(s.substr(1,2),16),parseInt(s.substr(3,2),16),parseInt(s.substr(5,2),16)];}var A=h(a),B=h(b);return 'rgb('+Math.round(A[0]+(B[0]-A[0])*u)+','+Math.round(A[1]+(B[1]-A[1])*u)+','+Math.round(A[2]+(B[2]-A[2])*u)+')';}
function mount(x,y,w,h){ctx.fillStyle='#8a8f96';ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x,y-h);ctx.lineTo(x+w/2,y);ctx.closePath();ctx.fill();ctx.fillStyle='#f3f6f9';ctx.beginPath();ctx.moveTo(x-w*.12,y-h*.76);ctx.lineTo(x,y-h);ctx.lineTo(x+w*.12,y-h*.76);ctx.closePath();ctx.fill();}
function limb(x,y,s,kind,on){var cH=on?BLUE:GREY,cR=on?ORANGE:'#b9bdc2',cM=on?GREEN:'#d3d6da';
 var L=kind===1?1.25:1,ang=kind===0?.0:kind===1?-.15:.1;ctx.save();ctx.translate(x,y);ctx.rotate(ang);
 LN(0,0,0,48*s,cH,7*s);LN(-3*s,50*s,-3*s,(50+44*L)*s,cR,4*s);LN(4*s,50*s,4*s,(50+44*L)*s,cR,4*s);
 var y0=(52+44*L)*s;
 if(kind===0){for(var i=-2;i<=2;i++)LN(i*3.5*s,y0,i*5*s,y0+22*s,cM,2.6*s);}
 else if(kind===1){for(var i=-2;i<=2;i++){LN(0,y0,i*14*s,y0+(46-Math.abs(i)*6)*s,cM,2.2*s);}ctx.fillStyle='rgba(120,90,60,.18)';ctx.beginPath();ctx.moveTo(-28*s,y0+34*s);ctx.lineTo(0,y0);ctx.lineTo(28*s,y0+34*s);ctx.closePath();ctx.fill();}
 else{ctx.fillStyle=on?'rgba(55,138,221,.12)':'rgba(150,150,150,.12)';ctx.beginPath();ctx.ellipse(0,y0+22*s,13*s,28*s,0,0,7);ctx.fill();for(var i=-2;i<=2;i++)LN(i*3.5*s,y0,i*4*s,y0+(44-Math.abs(i)*5)*s,cM,2.4*s);}
 ctx.restore();}
var TR=[['ver de terre',40],['perche',95],['salamandre',150],['chien',205],['moineau',260]];
SFA.theo("c07", {
 icon: function () {
  var x0=W*.1,y0=H*.5;LN(x0,y0,x0+40,y0,INK,3);LN(x0+40,H*.2,x0+40,H*.8,INK,3);LN(x0+40,H*.2,W*.5,H*.2,INK,3);LN(x0+40,H*.8,x0+40+30,H*.8,INK,3);LN(x0+70,H*.62,x0+70,H*.9,INK,3);LN(x0+70,H*.62,W*.5,H*.62,INK,3);LN(x0+70,H*.9,W*.5,H*.9,INK,3);
  ['A','B','C'].forEach(function(l,i){DOT(W*.5+8,[H*.2,H*.62,H*.9][i],7,[BLUE,GREEN,ORANGE][i]);});
  TB('ancêtre commun',x0+6,y0-14,GREY,12,'left');
  TB('arbre · horloge · datation',W*.74,H*.35,BLUE_D,20);TB('T½',W*.74,H*.62,ORANGE,38);
  TB('spéciation · phylogénie · datation',W*.5,H*.95,BLUE_D,15);
 },
 sub: [
 {t:"Spéciation et preuves", anim: G(function (t) {
  var ph=(t%900)/900,bar=sg(ph,.12,.3)*(1-sg(ph,.78,.86)),dv=sg(ph,.3,.72),meet=sg(ph,.78,.9);
  TB(ph<.12?'une population':ph<.3?'isolement géographique':ph<.72?'divergence (mutations, dérive, sélection)':ph<.9?'contact : plus de reproduction possible':'deux espèces',350,28,INK,17);
  ctx.fillStyle='#eaf3e6';ctx.fillRect(20,60,660,200);
  if(bar>0){mount(350,260,200*bar,190*bar);}
  for(var k=0;k<24;k++){var left=k<12,sp=1-sg(ph,.12,.3);
   var cx0=350+((k%6)-2.5)*22,cy0=150+(((k/6)|0)-1.5)*26;
   var tx=left?200+((k%6)-2.5)*22:500+((k%6)-2.5)*22,ty=cy0;
   var mv=sg(ph,.14,.3),mm=sg(ph,.78,.9);
   var x=cx0+(tx-cx0)*mv;x=x+(350+((k%6)-2.5)*22-x)*mm*(left?.35:.35)*0;
   if(meet>0)x=x+((left?290:410)+((k%6)-2.5)*12-x)*meet;
   var col=lerpc('#7F77DD',left?'#1D9E75':'#D85A30',dv);
   DOT(x,ty+Math.sin(t*.05+k)*2,8,col);}
  ga(meet);TB('✕',350,150,RED,50);TB('descendants stériles ou pas de reproduction',350,216,DRED,14);g1();
  ga(sg(ph,.88,1));TB('isolement reproductif = espèces distinctes',350,250,DGREEN,16);g1();
 }),
 th:'<div class="tcard"><b class="h">Qu\'est-ce qu\'une espèce ? La spéciation</b><p>Une <b>espèce</b> (au sens biologique) est un ensemble de populations dont les individus peuvent se reproduire entre eux et donner des descendants <b>féconds</b>. La <b>spéciation</b> est l\'apparition de nouvelles espèces. Dans le cas le plus simple (spéciation <b>allopatrique</b>), une barrière géographique (montagne, mer, rivière) sépare une population en deux : le <b>flux de gènes</b> cesse, chaque population accumule ses propres mutations, subit une dérive et une sélection différentes (milieux distincts), jusqu\'à l\'<b>isolement reproductif</b>.</p></div>'
 +'<div class="tcard"><b class="h">Flux de gènes et isolement</b><p>Quelques migrants par génération (plus d\'un) suffisent à maintenir deux populations génétiquement très proches : le flux de gènes contrebalance la dérive. Pour que deux populations divergent, il faut un isolement efficace (très peu de migrants) ou une forte sélection différente dans chaque milieu. L\'isolement reproductif peut être <b>avant la fécondation</b> (saisons, comportements, anatomie différents) ou <b>après</b> (hybrides stériles, comme le mulet).</p></div>'
 +'<div class="tcard"><b class="h">Les preuves de l\'évolution</b><p><b>Fossiles</b> (formes de transition, succession dans les couches), <b>homologies</b> anatomiques (membres des vertébrés), <b>embryologie</b> comparée, <b>biogéographie</b> (espèces proches sur des îles voisines), <b>organes vestigiaux</b>, <b>ADN</b> (plus deux espèces sont proches, plus leurs séquences se ressemblent), observation directe (résistance aux antibiotiques, pinsons). Elles convergent toutes vers l\'idée d\'une parenté entre les êtres vivants.</p></div>'},
 {t:"Arbres et horloge moléculaire", anim: G(function (t) {
  var ph=(t%960)/960,k=Math.floor(ph/.17);
  var X=[40,150,260,370,480],yl=[40,95,150,205,260],yD=232,yC=(150+yD)/2,yB=(95+yC)/2,yA=(40+yB)/2;
  var tx=60;
  function seg(x1,y1,x2,y2,c,w){LN(x1,y1,x2,y2,c||INK,w||3);}
  var st=[];
  /* squelette */
  seg(20,yA,X[0],yA);seg(X[0],yl[0],X[0],yB);seg(X[0],yl[0],X[4]+0,yl[0]);
  seg(X[0],yB,X[1],yB);seg(X[1],yl[1],X[1],yC);seg(X[1],yl[1],X[4],yl[1]);
  seg(X[1],yC,X[2],yC);seg(X[2],yl[2],X[2],yD);seg(X[2],yl[2],X[4],yl[2]);
  seg(X[2],yD,X[3],yD);seg(X[3],yl[3],X[3],yl[4]);seg(X[3],yl[3],X[4],yl[3]);seg(X[3],yl[4],X[4],yl[4]);
  TR.forEach(function(q,i){TB(q[0],X[4]+10,q[1]+5,INK,15,'left');});
  var marks=[[95,yB,'vertèbres',BLUE],[205,yC,'poumons',GREEN],[315,yD,'amnios',ORANGE],[425,yl[3],'poils',VIOLET],[425,yl[4],'plumes',RED]];
  marks.forEach(function(m,i){var a=sg(ph,i*.17,i*.17+.1);if(a>0){ga(a);LN(m[0],m[1]-12,m[0],m[1]+12,m[3],5);TB(m[2],m[0],m[1]-18,dk(m[3]),13);g1();}});
  ga(sg(ph,.7,.82));DOT(X[3],yD,16,'rgba(0,0,0,0)');ctx.strokeStyle=RED;ctx.lineWidth=3;ctx.beginPath();ctx.arc(X[3],yD,13,0,7);ctx.stroke();TB('ancêtre commun le plus récent',X[3]+20,yD+40,DRED,13,'right');g1();
  ga(sg(ph,.86,1));TB('(ver, (perche, (salamandre, (chien, moineau))))',230,292,INK,15);g1();
  /* horloge */
  ga(1);box(600,60,90,150,AX,'#fbfcfd',10);TB('horloge',645,84,GREY,13);TB('moléculaire',645,100,GREY,13);TB('T = d /',645,140,BLUE_D,15);TB('(2 × v)',645,162,BLUE_D,15);TB('d : différences',645,190,GREY,11);TB('par site',645,204,GREY,11);
 }),
 th:'<div class="tcard"><b class="h">Homologie et analogie</b><p>Des structures <b>homologues</b> ont la même organisation de base héritée d\'un ancêtre commun, même si leur fonction diffère (bras, aile de chauve-souris, nageoire de baleine). Elles signalent une parenté. Des structures <b>analogues</b> ont la même fonction mais une organisation différente (aile d\'oiseau et aile de papillon) : elles résultent d\'une <b>convergence</b> et ne prouvent aucune parenté proche. Un organe <b>vestigial</b> est réduit et sans fonction (bassin de la baleine).</p></div>'
 +'<div class="tcard"><b class="h">Construire un arbre phylogénétique</b><p>On regroupe les organismes qui partagent un <b>caractère dérivé</b> (une innovation héritée d\'un ancêtre commun). Les groupes sont <b>emboîtés</b>. Méthode : 1) choisir un <b>groupe extérieur</b> (ici le ver de terre) ; 2) pour chaque caractère, repérer le groupe qui le possède ; 3) emboîter : vertèbres ⊃ poumons ⊃ amnios ; 4) un caractère propre à un seul organisme (poils, plumes) n\'établit aucune parenté. Notation entre parenthèses : <b>(ver, (perche, (salamandre, (chien, moineau))))</b>. L\'ancêtre commun le plus récent du chien et du moineau est l\'ancêtre des amniotes.</p></div>'
 +'<div class="tcard"><b class="h">Séquences et distances</b><p>On compte les différences entre deux séquences alignées : ATGCCGTA et ATGACGTT diffèrent en 2 sites sur 8 : <b>25 %</b>. Plus deux espèces sont apparentées, moins leurs séquences diffèrent. Pour construire un arbre : regrouper d\'abord la paire la plus proche, puis recalculer les distances par <b>moyenne</b> (A–B = 4, (AB)–C = (12 + 12)/2 = 12, ((AB)C)–D = 20) : (((A,B),C),D).</p></div>'
 +'<div class="tcard"><b class="h">L\'horloge moléculaire</b><p>Si les substitutions s\'accumulent à vitesse v par site et par an <b>sur chaque lignée</b>, deux espèces séparées depuis T ans diffèrent de d = 2vT par site : <b>T = d / (2v)</b>. <i>Exemple</i> : 18 différences sur 1 000 sites, v = 0,5·10<sup>−9</sup> : T = 0,018 / 10<sup>−9</sup> = 1,8·10<sup>7</sup> ans = 18 millions d\'années. Si la vitesse réelle est deux fois plus faible, toutes les dates <b>doublent</b> ; la forme de l\'arbre, elle, ne change pas. L\'horloge doit être calibrée par des fossiles datés.</p></div>'},
 {t:"Datation radiométrique", anim: G(function (t) {
  var P=150,n=Math.min(5,((t/P)|0)%7),u=(t%P)/P,N=((t/P)|0)%7;if(N>5)N=5;
  TB('carbone 14 : demi-vie 5 730 ans',200,26,INK,16);
  var order=[];for(var k=0;k<64;k++)order.push(k);
  var alive=Math.round(64/Math.pow(2,N));var nextAlive=Math.round(64/Math.pow(2,N+1));
  for(var k=0;k<64;k++){var i=k%8,j=(k/8)|0,x=60+i*32,y=62+j*26,al=k<alive;var fading=k>=nextAlive&&k<alive&&N<5;
   var v=al?(fading?1-sg(u,.55,.9):1):0;DOT(x,y,9,al?'#378ADD':'#e3e6ea');if(fading&&u>.55){DOT(x,y,9,'#e3e6ea');ga(1-sg(u,.55,.9));DOT(x,y,9,'#378ADD');g1();}}
  TB(N+' demi-vie'+(N>1?'s':'')+' = '+nfmt(N*5730)+' ans',200,286,ORANGE,16);
  var gx=400,gy=250,gw=270,gh=180;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh-8,AX,1.6);TB('quantité restante',gx+10,gy-gh-14,GREY,12,'left');TB('demi-vies',gx+gw,gy+30,GREY,12,'right');
  ctx.strokeStyle=ORANGE;ctx.lineWidth=2.6;ctx.beginPath();for(var s=0;s<=5;s+=.1){var x=gx+s/5*gw,y=gy-Math.pow(.5,s)*gh;s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(var s=0;s<=N;s++){var x=gx+s/5*gw,y=gy-Math.pow(.5,s)*gh;DOT(x,y,6,RED);TB(String(100/Math.pow(2,s)).replace('.',',')+' %',x+8,y-8,DRED,13,'left');TB(String(s),x,gy+16,GREY,12);}
 }),
 th:'<div class="tcard"><b class="h">Demi-vie et décroissance</b><p>La <b>demi-vie</b> T½ d\'un isotope radioactif est la durée au bout de laquelle la moitié des noyaux s\'est désintégrée, quelle que soit la quantité de départ. Après n demi-vies il reste <b>N = N₀ / 2<sup>n</sup></b>, soit 100 %, 50 %, 25 %, 12,5 %, 6,25 %… <b>Âge = n × T½</b>, avec n = log<sub>2</sub>(N₀/N). C\'est une propriété du noyau : aucun facteur extérieur (chaleur, fossilisation) ne la modifie.</p></div>'
 +'<div class="tcard"><b class="h">Choisir le bon isotope</b><p><b>Carbone 14</b> (T½ = 5 730 ans) : restes organiques jusqu\'à environ 50 000 ans. <i>Exemple</i> : 12,5 % = (1/2)<sup>3</sup> → 3 × 5 730 = 17 190 ans ; 6,25 % → 4 × 5 730 = 22 920 ans. Pour des millions d\'années : <b>potassium 40</b> (T½ = 1,25 milliard d\'années), <b>uranium 238</b> (T½ ≈ 4,5 milliards d\'années). Un os de dinosaure de 70 millions d\'années ne peut donc pas être daté au carbone 14 : il en reste (1/2)<sup>12 000</sup> ≈ 0, et un signal mesurable vient d\'une contamination.</p></div>'
 +'<div class="tcard"><b class="h">Dater un fossile : l\'encadrer</b><p>Le fossile lui-même contient rarement l\'isotope adapté ; on date les <b>roches volcaniques</b> qui l\'encadrent. Principe de <b>superposition</b> : une couche est plus récente que celle qui est dessous. Âge = T½ × log<sub>2</sub>(1/f), f étant la fraction restante. Potassium 40 : 94 % → 1 250 × 0,0893 ≈ 112 Ma (couche inférieure) ; 96 % → 1 250 × 0,0589 ≈ 74 Ma (couche supérieure) : le fossile a entre 74 et 112 Ma.</p></div>'}
 ]
});
SFA.figs("c07", [
 F(function(p){ /* 1 homologues */
  var on=p>.15,a=sg(p,.1,.8);
  limb(80,50,.9,0,on);TB('humain',80,236,INK,14);limb(230,50,.9,1,on);TB('chauve-souris',230,236,INK,14);limb(380,50,.9,2,on);TB('baleine',380,236,INK,14);
  ga(a);TB('humérus',80,36,BLUE_D,12);TB('radius + cubitus',20,150,ORANGE,11,'left');TB('main',150,206,DGREEN,12);g1();
  ga(a);box(100,8,260,28,DGREEN,'#e8f7f1',8);TB('structures homologues',230,28,DGREEN,16);g1();
  ga(1-a);TB('nom de ces structures ?',230,29,GREY,15);g1();
 }),
 F(function(p){ /* 2 compter les différences */
  var s1='ATGCCGTA',s2='ATGACGTT';TB('séquence 1',20,70,GREY,13,'left');TB('séquence 2',20,150,GREY,13,'left');
  for(var i=0;i<8;i++){var x=100+i*44,d=s1[i]!==s2[i],a=sg(p,i*.06,i*.06+.2);
   box(x,50,38,40,AX,'#fff',6);TB(s1[i],x+19,78,INK,22);box(x,130,38,40,d&&p>0?RED:AX,d&&p>0?'#fdecec':'#fff',6,d&&p>0?3:2);TB(s2[i],x+19,158,d&&p>0?DRED:INK,22);
   if(d&&p>0){ga(a);crs(x+19,110,DRED,8);g1();}else if(p>0){ga(a);LN(x+19,94,x+19,126,GREEN,2);g1();}}
  var a=sg(p,.5,1);ga(a);box(100,196,340,56,ORANGE,'#fdf5e9',10);TB('2 différences / 8 sites = 25 %',270,232,DRED,20);g1();
  ga(1-a);TB('combien de différences ?',270,230,GREY,16);g1();
 }),
 F(function(p){ /* 3 C14 */
  var gx=50,gy=224,gw=370,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh-8,AX,1.6);TB('C-14 restant',gx,gy-gh-14,GREY,12,'left');TB('demi-vies (5 730 ans)',gx+gw,gy+30,GREY,12,'right');
  ctx.strokeStyle=ORANGE;ctx.lineWidth=2.8;ctx.beginPath();for(var s=0;s<=5;s+=.1){var x=gx+s/5*gw,y=gy-Math.pow(.5,s)*gh;s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(var s=0;s<=5;s++){TB(String(s),gx+s/5*gw,gy+16,GREY,12);}
  var a=sg(p,0,.6);[[3,'12,5 % → 17 190 ans',RED],[4,'6,25 % → 22 920 ans',BLUE]].forEach(function(q,i){var x=gx+q[0]/5*gw,y=gy-Math.pow(.5,q[0])*gh;ga(a);LN(x,gy,x,y,q[2],1.8,[4,3]);LN(gx,y,x,y,q[2],1.8,[4,3]);DOT(x,y,6,q[2]);TB(q[1],x-12,y-12-(i?0:6),dk(q[2]),14,'right');g1();});
  ga(1-a);TB('âge ?',300,100,GREY,26);g1();
 }),
 F(function(p){ /* 4 date divergence */
  var a=sg(p,0,.6);LN(230,230,230,150,INK,3);LN(230,150,120,40,INK,3);LN(230,150,340,40,INK,3);
  TB('espèce 1',120,28,INK,14);TB('espèce 2',340,28,INK,14);TB('ancêtre commun',230,246,GREY,13);
  ga(a);TB('T',160,110,ORANGE,22);TB('T',300,110,ORANGE,22);ctx.strokeStyle=ORANGE;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(40,150);ctx.lineTo(420,150);ctx.stroke();ctx.setLineDash([]);g1();
  TB('18 différences / 1 000 sites',230,270,INK,14);
  ga(sg(p,.5,1));box(20,174,150,64,ORANGE,'#fdf5e9',10);TB('T = 0,018',95,198,INK,14);TB('/ (2 × 0,5·10⁻⁹)',95,220,INK,13);box(300,174,150,64,DRED,'#fdecec',10);TB('≈ 18 millions',375,200,DRED,18);TB('d\'années',375,222,DRED,16);g1();
 }),
 F(function(p){ /* 5 construire un arbre */
  function y0r(i){return 30+i*40;}var org=['ver','perche','salam.','chien','moineau'],ch=['vert.','poum.','amn.','poils','plum.'],M=[[0,1,1,1,1],[0,0,1,1,1],[0,0,0,1,1],[0,0,0,1,0],[0,0,0,0,1]];
  var rowl=['ver','perche','salam.','chien','moin.'];for(var j=0;j<5;j++)TB(ch[j],86+j*28,20,GREY,10);
  for(var i=0;i<5;i++){TB(rowl[i],8,y0r(i)+20,GREY,11,'left');for(var j=0;j<5;j++){var x=72+j*28,y=30+i*40;box(x,y,24,30,M[j][i]?GREEN:AX,M[j][i]?'#e8f7f1':'#fff',4,1.8);TB(M[j][i]?'+':'−',x+13,y+22,M[j][i]?DGREEN:GREY,16);}}
  var X=[190,240,290,340],yl=[50,90,130,170,210],a=sg(p,0,.8);
  TB('(ver, (perche, (salamandre, (chien, moineau))))',330,264,INK,1);
  ctx.globalAlpha=a;var yA=40,yB=(90+150)/2;
  function s(x1,y1,x2,y2){LN(x1,y1,x2,y2,INK,2.6);}
  var xs=[225,265,305,345],lx=385,yy=[44,90,136,182,228],yD=205,yC=(136+yD)/2,yB2=(90+yC)/2,yA2=(44+yB2)/2;
  s(205,yA2,xs[0],yA2);s(xs[0],yy[0],xs[0],yB2);s(xs[0],yy[0],lx,yy[0]);s(xs[0],yB2,xs[1],yB2);s(xs[1],yy[1],xs[1],yC);s(xs[1],yy[1],lx,yy[1]);s(xs[1],yC,xs[2],yC);s(xs[2],yy[2],xs[2],yD);s(xs[2],yy[2],lx,yy[2]);s(xs[2],yD,xs[3],yD);s(xs[3],yy[3],xs[3],yy[4]);s(xs[3],yy[3],lx,yy[3]);s(xs[3],yy[4],lx,yy[4]);
  for(var i=0;i<5;i++)TB(org[i],lx+6,yy[i]+5,INK,12,'left');
  ga(1);g1();
  ga(1-a);TB('arbre ?',300,140,GREY,22);g1();
 }),
 F(function(p){ /* 6 ailes */
  /* aile d'oiseau */
  ctx.fillStyle='#d9c3a0';ctx.beginPath();ctx.moveTo(40,150);ctx.quadraticCurveTo(100,30,210,70);ctx.quadraticCurveTo(160,100,120,160);ctx.closePath();ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();
  for(var i=0;i<7;i++){LN(70+i*18,120-i*6,95+i*20,150-i*3,'rgba(90,60,20,.5)',2);}LN(40,150,200,72,'#7f6a4a',5);TB('oiseau',120,190,INK,14);TB('os + plumes',120,208,GREY,12);
  /* aile de papillon */
  var cx=330;ctx.fillStyle='#f0b25a';ctx.beginPath();ctx.ellipse(cx-40,100,48,40,-.4,0,7);ctx.ellipse(cx-34,150,34,26,.2,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx-40,100,48,40,-.4,0,7);ctx.stroke();
  for(var i=0;i<6;i++)LN(cx,125,cx-80+i*14,70+i*8,'rgba(120,60,0,.5)',1.6);LN(cx+6,60,cx+6,170,INK,4);TB('papillon',cx-10,190,INK,14);TB('membranes + nervures',cx-10,208,GREY,12);
  var a=sg(p,.2,.8);ga(a);box(60,224,350,46,DGREEN,'#e8f7f1',10);TB('structures analogues (convergence)',235,254,DGREEN,16);g1();
  ga(1-a);TB('homologues ou analogues ?',235,254,GREY,16);g1();
   }),
 F(function(p){ /* 7 encadrer fossile */
  var L=[['#d8c9a3',0],['#ccb88a',1],['#8d8f94',2],['#c9b98f',3],['#a8987a',4],['#8d8f94',5],['#b9a77d',6]];
  var y0=24,hh=34;for(var i=0;i<7;i++){ctx.fillStyle=L[i][0];ctx.fillRect(30,y0+i*hh,250,hh);}
  ctx.fillStyle='#6e7076';ctx.fillRect(30,y0+1*hh,250,hh*.7);ctx.fillRect(30,y0+5*hh,250,hh*.7);
  TB('cendres supérieures',155,y0+hh+22,'#fff',12);TB('cendres inférieures',155,y0+5*hh+22,'#fff',12);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(155,y0+3.5*hh,22,10,0,0,7);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.stroke();TB('fossile',155,y0+3.5*hh+4,INK,11);
  var a=sg(p,0,.6);ga(a);TB('96 % de K-40 : 74 Ma',300,y0+hh+22,DRED,14,'left');TB('94 % de K-40 : 112 Ma',300,y0+5*hh+22,DRED,14,'left');
  box(300,y0+2.5*hh,150,50,DGREEN,'#e8f7f1',8);TB('74 – 112 Ma',375,y0+2.5*hh+31,DGREEN,18);g1();
  ga(1-a);TB('?',375,y0+3.5*hh,GREY,30);g1();
 }),
 F(function(p){ /* 8 dinosaure C14 */
  var gx=30,gw=400,y=150;function X(v){return gx+(Math.log10(v)-3)/5*gw;}
  LN(gx,y,gx+gw,y,INK,2.5);for(var e=3;e<=8;e++){LN(X(Math.pow(10,e)),y-5,X(Math.pow(10,e)),y+5,INK,1.6);TB('10'+['','','','³','⁴','⁵','⁶','⁷','⁸'][e],X(Math.pow(10,e)),y+22,GREY,12);}
  TB('âge (ans, échelle log)',230,y+46,GREY,12);
  ctx.fillStyle='rgba(29,158,117,.28)';ctx.fillRect(X(1e3),y-14,X(5e4)-X(1e3),14);TB('C-14 utilisable (< 50 000 ans)',X(1e4)+20,y-24,DGREEN,12);
  DOT(X(3e4),y,7,RED);TB('« 30 000 ans »',X(3e4),y+70,DRED,13);
  DOT(X(7e7),y,7,BLUE);TB('70 millions d\'années',X(7e7)-4,y-18,BLUE_D,13,'right');
  var a=sg(p,.2,.9);ga(a);A(X(3e4)+10,y+80,0,0,RED,'',2);box(40,200,380,60,DRED,'#fdecec',10);TB('≈ 12 000 demi-vies : il ne reste plus de C-14',230,226,INK,14);TB('→ contamination ; utiliser K-40 ou U-238',230,248,DRED,14);g1();
  ga(1-a);TB('interprétation ?',230,236,GREY,18);g1();
 }),
 F(function(p){ /* 9 arbre dates vitesse */
  var lx=300,yy=[50,100,150,200],xs=[140,90,40],yAB=75,yC=150,yD=200;
  var a=sg(p,0,.7);
  function s(x1,y1,x2,y2){LN(x1,y1,x2,y2,INK,3);}
  var xA=190,xB=120,xC=60;/* nœuds : (A,B)=1 Ma -> x ; ((AB)C)=3 ; ((ABC)D)=5 */
  var yN1=(50+100)/2,yN2=(yN1+150)/2,yN3=(yN2+200)/2;
  s(xA,50,xA,100);s(xA,50,lx,50);s(xA,100,lx,100);s(xB,yN1,xA,yN1);s(xB,yN1,xB,150);s(xB,150,lx,150);s(xC,yN2,xB,yN2);s(xC,yN2,xC,200);s(xC,200,lx,200);s(xC-30,yN3,xC,yN3);
  ['A','B','C','D'].forEach(function(l,i){TB(l,lx+14,yy[i]+5,INK,16,'left');});
  ga(a);[[xA,yN1,'1 Ma'],[xB,yN2,'3 Ma'],[xC,yN3,'5 Ma']].forEach(function(q){DOT(q[0],q[1],6,RED);TB(q[2],q[0]-10,q[1]-8,DRED,15,'right');});g1();
  TB('(((A,B),C),D)',230,26,INK,15);
  ga(sg(p,.6,1));box(300,180,150,70,ORANGE,'#fdf5e9',10);TB('vitesse ÷ 2',375,206,INK,14);TB('2 · 6 · 10 Ma',375,236,DRED,18);g1();
  ga(1-a);TB('dates ?',150,230,GREY,22);g1();
 }),
 F(function(p){ /* 10 montagne */
  ctx.fillStyle='#eaf3e6';ctx.fillRect(10,40,440,170);mount(230,210,110,150);
  var cs=[BLUE,ORANGE];for(var k=0;k<14;k++){var x=40+(k%5)*34+(k>6?0:0),y=90+((k/5)|0)*34;DOT(x,y+0,9,cs[(k*7)%3<2?0:1]);}
  for(var k=0;k<14;k++){var x=300+(k%5)*34,y=90+((k/5)|0)*34;DOT(x,y,9,cs[(k*5)%3<2?0:1]);}
  TB('100 individus',100,196,GREY,12);TB('100 individus',370,196,GREY,12);
  var a=sg(p,0,.5);ga(.3+.7*a);A(190,110,60,0,GREEN,'',2.6);A(270,140,-60,0,GREEN,'',2.6);TB('5 / génération',230,60,DGREEN,14);g1();
  var b=sg(p,.4,1);ga(b);box(40,222,380,46,DGREEN,'#e8f7f1',10);TB('flux de gènes : populations qui restent semblables',230,251,DGREEN,15);g1();
  ga(1-b);TB('divergence ou non ?',230,251,GREY,16);g1();
 })
]);
})();
