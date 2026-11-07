/* SFA · Biologie 6e · théorie animée et devantures (chapitre 04) */
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
function rod(x,y,h,col,w){ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x-(w||4),y-h/2,(w||4)*2,h,w||4);ctx.fill();}
function cod(x,y,w,h,txt,col,fs){box(x,y,w,h,col||AX,(col||'#e6eaee')+'22',8,2.2);TB(txt,x+w/2,y+h/2+(fs||18)*.34,col?dk(col):INK,fs||18);}
function chip(x,y,w,h,txt,col){ctx.fillStyle=col+'33';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fill();ctx.stroke();TB(txt,x+w/2,y+h/2+5,dk(col),15);}
var M4=[
 {n:'ARNm normal',cod:['AUG','GAA','CUU','AAA','UAA'],aa:['Met','Glu','Leu','Lys','Stop'],mut:[],note:'protéine : Met – Glu – Leu – Lys'},
 {n:'mutation silencieuse (GAA → GAG)',cod:['AUG','GAG','CUU','AAA','UAA'],aa:['Met','Glu','Leu','Lys','Stop'],mut:[1],note:'même acide aminé : protéine inchangée'},
 {n:'mutation faux-sens (GAA → GUA)',cod:['AUG','GUA','CUU','AAA','UAA'],aa:['Met','Val','Leu','Lys','Stop'],mut:[1],note:'un acide aminé change : Glu → Val'},
 {n:'mutation non-sens (GAA → UAA)',cod:['AUG','UAA','CUU','AAA','UAA'],aa:['Met','Stop','','',''],mut:[1],note:'la traduction s\'arrête : protéine tronquée'},
 {n:'délétion d\'une base (décalage)',cod:['AUG','AAC','UUA','AAU','AA…'],aa:['Met','Asn','Leu','Asn','?'],mut:[1,2,3,4],note:'tout ce qui suit est modifié'},
 {n:'délétion de 3 bases (un codon)',cod:['AUG','CUU','AAA','UAA',''],aa:['Met','Leu','Lys','Stop',''],mut:[],note:'cadre conservé : un acide aminé en moins'}];
SFA.theo("c04", {
 icon: function () {
  var cs=['AUG','GAA','UAA'],y=H*.28,w=W*.2;
  for(var i=0;i<3;i++){var x=W*.12+i*(w+W*.06);cod(x,y,w,44,cs[i],i===2?RED:BLUE,20);var aa=['Met','Glu','Stop'][i];chip(x+w*.12,y+70,w*.76,30,aa,i===2?RED:BLUE);}
  TB('→',W*.5,y+90,GREY,1);TB('mutation · risque · dépistage',W*.5,H*.86,BLUE_D,17);
  TB('ARNm',W*.06,y+26,GREY,12,'left');
 },
 sub: [
 {t:"Mutations et protéine", anim: G(function (t) {
  var P=240,k=((t/P)|0)%M4.length,u=(t%P)/P,S=M4[k];
  TB(S.n,350,28,k?DRED:INK,19);
  var rd=sg(u,.05,.7)*5;
  for(var i=0;i<5;i++){var x=24+i*132;var c=S.cod[i];if(c===''){continue;}var m=S.mut.indexOf(i)>=0;
   cod(x,60,114,50,c,m?RED:(i===4&&k!==4?GREY:BLUE),22);
   var a=sg(rd,i,i+.8);ga(a);A(x+57,114,0,26,GREY,'',2);if(S.aa[i]){chip(x+10,146,94,36,S.aa[i],S.aa[i]==='Stop'?RED:(m?ORANGE:BLUE));}g1();}
  var r=Math.min(4.99,rd);ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(20+Math.floor(r)*132,54,122,62,10);ctx.stroke();
  TB('ARNm lu codon par codon (5′ → 3′)',24,50,GREY,12,'left');
  ga(sg(u,.7,.85));TB(S.note,350,236,k?DRED:DGREEN,18);g1();
  for(var j=0;j<M4.length;j++)DOT(260+j*20,274,5,j===k?ORANGE:AX);
 }),
 th:'<div class="tcard"><b class="h">De l\'ADN à la protéine</b><p>L\'ADN d\'un gène est transcrit en <b>ARNm</b>, lu ensuite par les ribosomes <b>codon par codon</b> (3 nucléotides = 1 codon = 1 acide aminé). Le code génétique est <b>redondant</b> (plusieurs codons pour un même acide aminé : GAA et GAG codent Glu), AUG est le codon d\'initiation (Met) et UAA, UAG, UGA sont des codons <b>Stop</b>. Une <b>mutation</b> est une modification de la séquence d\'ADN, transmise aux cellules filles ; elle crée un nouvel allèle.</p></div>'
 +'<div class="tcard"><b class="h">Les types de mutations ponctuelles</b><p><b>Silencieuse</b> : la substitution ne change pas l\'acide aminé (GAA → GAG, Glu → Glu). <b>Faux-sens</b> : un autre acide aminé (GAG → GUG : Glu → Val, drépanocytose). <b>Non-sens</b> : un codon Stop apparaît (GAA → UAA) : protéine tronquée, souvent inactive. <b>Décalage du cadre de lecture</b> : insertion ou délétion d\'un nombre de bases <b>non multiple de 3</b> ; tous les codons suivants sont modifiés. Une délétion de 3 bases (un codon entier) conserve le cadre et ne retire qu\'un acide aminé (mucoviscidose, ΔF508).</p></div>'
 +'<div class="tcard"><b class="h">Du gène au phénotype</b><p>Mutation → protéine modifiée (forme, activité) → fonction altérée → symptôme. Même une mutation qui ne change qu\'un acide aminé peut modifier le repliement de la protéine. Seules les mutations des <b>cellules germinales</b> se transmettent à la descendance. Beaucoup de mutations sont neutres ; quelques-unes sont favorables : elles alimentent l\'évolution.</p></div>'
 +'<div class="tcard"><b class="h">Méthode</b><p>1) Découper l\'ARNm en codons de 3 lettres à partir de AUG. 2) Traduire avec le tableau du code. 3) Comparer l\'ARNm normal et muté codon par codon. 4) Classer : acide aminé inchangé → silencieuse ; changé → faux-sens ; Stop → non-sens ; nombre de bases perdues non multiple de 3 → décalage.</p></div>'},
 {t:"Calculer un risque génétique", anim: G(function (t) {
  var ph=(t%800)/800,cw=70,px=30,py=24;
  TB('Nm × Nm',px+cw*2,py+10,INK,16);
  pun(px,py+8,cw,['N','m'],['N','m'],['NN','Nm','Nm','mm'],[GREEN,VIOLET,VIOLET,RED],sg(ph,.05,.45),18);
  var a=sg(ph,.5,.65);
  ga(a);crs(px+cw*2.5,py+8+cw*2.5,DRED,20);g1();
  ga(a);TB('mm : atteint',px+cw*2.5,py+8+cw*3.25,DRED,13);g1();
  var b=sg(ph,.55,.8);
  ga(b);box(330,40,340,52,GREEN,'#e8f7f1',10);TB('2e enfant atteint : 1/4',500,74,DGREEN,19);
  box(330,110,340,64,VIOLET,'#f1f0fc',10);TB('frère sain (3 cases) : porteur ?',500,138,INK,15);TB('2 cases sur 3 = 2/3',500,162,'#5249B5',17);g1();
  var c=sg(ph,.8,.95);
  ga(c);box(330,192,340,80,ORANGE,'#fdf5e9',10);TB('couple au hasard (f = 1/30)',500,216,INK,14);TB('1/30 × 1/30 × 1/4 = 1/3 600',500,246,DRED,18);g1();
 }),
 th:'<div class="tcard"><b class="h">Maladie autosomique récessive</b><p>Deux parents sains qui ont un enfant atteint (mm) sont forcément <b>porteurs</b> (Nm × Nm). À chaque naissance, indépendamment des précédentes : 1/4 atteint (mm), 1/2 porteur sain (Nm), 1/4 non porteur (NN). Un enfant <b>sain</b> d\'un tel couple est porteur avec la probabilité <b>2/3</b> (2 cases sur les 3 qui restent, car mm est exclu).</p></div>'
 +'<div class="tcard"><b class="h">Risque dans la population</b><p>Si une personne sur 30 est porteuse (f = 1/30), un couple pris au hasard a le risque : P(deux porteurs) × 1/4 = (1/30)<sup>2</sup> × 1/4 = <b>1/3 600</b> (≈ 28 enfants atteints sur 100 000 naissances). Dans une famille à antécédents, une femme saine dont le frère est atteint est porteuse avec la probabilité 2/3 : son risque devient 2/3 × 1/30 × 1/4 = <b>1/180</b>, soit 20 fois plus.</p></div>'
 +'<div class="tcard"><b class="h">Enchaîner les probabilités</b><p>On <b>multiplie</b> les probabilités d\'événements successifs et indépendants (être porteur, transmettre l\'allèle, recevoir m). Attention à l\'information : « sain » exclut mm et modifie les probabilités (2/3, pas 1/2). <i>Exemple</i> : fille saine d\'un couple Nm × Nm, conjoint non porteur : P(enfant porteur) = 2/3 × 1/2 = <b>1/3</b>, et l\'enfant ne peut pas être atteint.</p></div>'},
 {t:"Caryotype et anomalies chromosomiques", anim: G(function (t) {
  var ph=(t%900)/900;
  TB('méiose I : non-disjonction des chromosomes 21',350,24,INK,16);
  var sp=sg(ph,.2,.5),f=sg(ph,.58,.85);
  ga(1-sp);ell(90,130,58,58,'#f3f7fc',BLUE,2.4);rod(80,130,40,BLUE);rod(100,130,40,RED);TB('cellule en méiose I',90,210,GREY,12);g1();
  if(sp>0){ga(sp);var gx=190+140*f;ell(gx,86,36,36,f>.5?'#fdecec':'#f3f7fc',f>.5?RED:BLUE,2.4);rod(gx-10,86,30,BLUE);rod(gx+10,86,30,RED);TB(f>.5?'ovule : 24 chr':'24 chr',gx,138,DRED,13);
   ga(1-f);ell(190,200,36,36,'#f3f7fc',GREY,2.4);TB('22 chr',190,252,GREY,13);g1();g1();}
  if(f>0){ga(sg(ph,.58,.68));ell(330,200,34,34,'#f3f7fc',GREEN,2.4);rod(330,200,30,GREEN);TB('spermatozoïde : 23 chr',330,252,DGREEN,13);g1();
   ga(f);ell(540,150,64,64,'#fff8ec',ORANGE,2.6);rod(522,150,40,BLUE);rod(540,150,40,RED);rod(558,150,40,GREEN);g1();
   ga(f);A(374,100,90,38,GREY,'',2.4);A(374,196,90,-38,GREY,'',2.4);g1();}
  var r=sg(ph,.82,.98);ga(r);TB('zygote : 47 chromosomes',540,234,DRED,15);TB('trisomie 21',540,258,ORANGE,18);g1();
 }),
 th:'<div class="tcard"><b class="h">Le caryotype</b><p>Le <b>caryotype</b> classe les chromosomes d\'une cellule en paires homologues. L\'espèce humaine compte <b>46 chromosomes</b> : 22 paires d\'autosomes et 1 paire de chromosomes sexuels (XX chez la femme, XY chez l\'homme). On l\'écrit « 46,XX » ou « 46,XY ».</p></div>'
 +'<div class="tcard"><b class="h">Anomalies de nombre</b><p><b>Trisomie 21</b> : trois chromosomes 21, soit <b>47 chromosomes</b> (47,XX,+21). <b>Syndrome de Klinefelter</b> : 47,XXY. <b>Syndrome de Turner</b> : 45,X (monosomie). Ces anomalies viennent d\'une <b>non-disjonction</b> lors de la méiose : deux chromosomes homologues (méiose I) ou deux chromatides sœurs (méiose II) restent ensemble. Un gamète a alors 24 chromosomes et l\'autre 22 ; la fécondation par un gamète normal (23) donne 47 ou 45 chromosomes.</p></div>'
 +'<div class="tcard"><b class="h">Raisonner sur les gamètes</b><p>Un gamète normal contient 23 chromosomes, dont <b>un seul</b> chromosome sexuel. Pour un enfant 47,XXY de parents normaux : soit ovule XX (24) + spermatozoïde Y (erreur maternelle, méiose I ou II), soit ovule X + spermatozoïde XY (erreur paternelle, méiose I, car X et Y sont homologues). Le caryotype seul ne permet pas de trancher. La fréquence des non-disjonctions maternelles augmente avec l\'âge de la mère.</p></div>'
 +'<div class="tcard"><b class="h">À ne pas confondre</b><p>Anomalie <b>chromosomique</b> (nombre ou structure des chromosomes, visible au caryotype) ≠ mutation <b>génique</b> (changement dans la séquence d\'un gène, invisible au caryotype). Une trisomie n\'est pas héréditaire au sens mendélien : elle résulte d\'un accident de méiose.</p></div>'},
 {t:"Dépistage et valeur prédictive", anim: G(function (t) {
  var ph=(t%800)/800,cs=9,gx=20,gy=34,cols=40;
  TB('1 000 personnes : 1 malade (1 / 1 000)',210,22,INK,14);
  var fp=[37,152,288,341,463,577,604,729,815,933];
  var test=sg(ph,.25,.5);
  for(var k=0;k<1000;k++){var i=k%cols,j=(k/cols)|0,sick=k===500,col=sick?RED:'#c7d2e0';
   var pos=sick||fp.indexOf(k)>=0;
   var showpos=test>0&&pos;
   DOT(gx+i*cs+cs/2,gy+j*cs+cs/2,showpos?4.2:3.2,showpos?(sick?RED:ORANGE):col);}
  if(test>0){var yy=gy+test*25*cs;ctx.fillStyle='rgba(55,138,221,.18)';ctx.fillRect(gx,gy,cols*cs,test*25*cs);LN(gx,yy,gx+cols*cs,yy,BLUE,2);}
  TB('test de dépistage (sensibilité 99 %, spécificité 99 %)',210,gy+25*cs+22,GREY,13);
  var b=sg(ph,.55,.75);ga(b);box(420,40,260,52,RED,'#fdecec',10);TB('1 vrai positif',550,72,DRED,19);
  box(420,104,260,52,ORANGE,'#fdf5e9',10);TB('≈ 10 faux positifs',550,136,ORANGE,19);g1();
  var c=sg(ph,.78,.95);ga(c);box(420,176,260,78,DGREEN,'#e8f7f1',10);TB('malade si test positif',550,204,INK,14);TB('1 / 11 ≈ 9 %',550,236,DGREEN,24);g1();
 }),
 th:'<div class="tcard"><b class="h">Sensibilité et spécificité</b><p>La <b>sensibilité</b> est la proportion de malades dont le test est positif (vrais positifs / malades). La <b>spécificité</b> est la proportion de non-malades dont le test est négatif. Un test peut avoir 99 % pour chacune et pourtant poser problème : tout dépend de la <b>fréquence de la maladie</b>.</p></div>'
 +'<div class="tcard"><b class="h">La méthode des effectifs</b><p>Pour interpréter un test positif, on raisonne sur un grand nombre de personnes. <i>Exemple</i> : maladie 1/1 000, sensibilité et spécificité 99 %, 100 000 personnes testées. Malades : 100 → vrais positifs : 99. Non-malades : 99 900 → faux positifs : 999. Tests positifs : 1 098, dont 99 malades : <b>99 / 1 098 ≈ 9 %</b>. Quand la maladie est rare, la plupart des positifs sont de faux positifs.</p></div>'
 +'<div class="tcard"><b class="h">La valeur d\'un test positif dépend de la population</b><p>Trisomie 21, sensibilité 99 %, spécificité 99,9 %. À 30 ans (1/950) : ≈ 104 vrais et ≈ 100 faux positifs pour 100 000 grossesses, soit ≈ 51 % de vrais. À 40 ans (1/105) : ≈ 943 vrais et ≈ 99 faux, soit ≈ 90 %. Le nombre de faux positifs reste voisin ; celui de vrais positifs augmente avec la fréquence.</p></div>'
 +'<div class="tcard"><b class="h">Conséquences</b><p>Un test de <b>dépistage</b> n\'est pas un <b>diagnostic</b> : un test positif se confirme par un examen de référence (amniocentèse, caryotype). Le résultat doit être communiqué avec nuance, car il entraîne une anxiété et des décisions lourdes. Les enjeux éthiques (consentement, information, conseil génétique) font partie de la réponse attendue.</p></div>'}
 ]
});
SFA.figs("c04", [
 F(function(p){ /* 1 silencieuse */
  TB('ARNm',34,70,GREY,12);cod(70,40,110,52,'GAA',BLUE,24);TB('→',215,76,GREY,26);
  var a=sg(p,0,.5);cod(250,40,110,52,'GAA',BLUE,24);if(a>0){box(250,40,110,52,'#fff','#fff',8,0);ga(a);cod(250,40,110,52,'GAG',ORANGE,24);g1();}
  A(125,100,0,26,GREY,'',2.2);A(305,100,0,26,GREY,'',2.2);
  chip(85,134,80,34,'Glu',BLUE);chip(265,134,80,34,'Glu',a>.5?GREEN:BLUE);
  ga(sg(p,.4,1));TB('=',215,158,DGREEN,34);box(100,200,260,50,DGREEN,'#e8f7f1',10);TB('mutation silencieuse',230,232,DGREEN,20);g1();
  ga(1-sg(p,0,.4));TB('conséquence ?',230,232,GREY,18);g1();
  TB('avant',125,28,GREY,13);TB('après',305,28,GREY,13);
 }),
 F(function(p){ /* 2 compter chromosomes */
  TB('cellule de la peau — trisomie 21',230,22,INK,15);
  for(var i=0;i<23;i++){var r=(i/12)|0,c=i%12,x=30+c*36+(r?18:0),y=64+r*76,t=i===20;
   var n=t?3:2;for(var k=0;k<n;k++)rod(x+k*8-(n-1)*4,y,t?44:30+((i*7)%5)*4,t?RED:'#8da3bd',3.2);
   TB(String(i+1),x,y+36,t?DRED:GREY,t?14:11);}
  rod(30+11*36+18-6,64+76,26,'#8da3bd',3.2);
  var a=sg(p,.1,.7);ga(a);box(130,228,200,40,ORANGE,'#fdf5e9',10);TB('46 + 1 = 47 chromosomes',230,255,DRED,17);g1();
  ga(1-a);TB('nombre de chromosomes ?',230,255,GREY,17);g1();
 }),
 F(function(p){ /* 3 deux parents porteurs */
  TB('Nm × Nm',150,20,INK,17);
  pun(20,22,66,['N','m'],['N','m'],['NN','Nm','Nm','mm'],[GREEN,VIOLET,VIOLET,RED],p,19);
  var a=sg(p,.4,.9);ga(a);box(280,44,164,64,RED,'#fdecec',10);TB('2e enfant atteint',362,70,INK,14);TB('1/4',362,98,DRED,24);
  box(280,126,164,76,VIOLET,'#f1f0fc',10);TB('frère sain : porteur',362,152,INK,14);TB('2/3',362,186,'#5249B5',28);
  ctx.strokeStyle=VIOLET;ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.strokeRect(20+66+2,22+66+2,66*2-4,66-4);ctx.strokeRect(20+66+2,22+132+2,66-4,66-4);ctx.setLineDash([]);g1();
  ga(1-a);TB('?',362,128,GREY,40);g1();
 }),
 F(function(p){ /* 4 ARNm */
  var rows=[['AUG GAA CUU AAA UAA',['Met','Glu','Leu','Lys','Stop'],'normal',[]],['AUG UAA CUU AAA UAA',['Met','Stop','','',''],'GAA → UAA',[1]],['AUG AAC UUA AAU AA…',['Met','Asn','Leu','Asn','?'],'sans la 4ᵉ base',[1,2,3,4]]];
  rows.forEach(function(r,i){var y=14+i*84,a=i===0?1:sg(p,(i-1)*.45,(i-1)*.45+.45);if(i>0&&a<=0){ga(.0);}
   ga(i===0?1:Math.max(.0,a));TB(r[2],16,y+18,i?DRED:GREY,12,'left');var cs=r[0].split(' ');
   for(var k=0;k<5;k++){var m=r[3].indexOf(k)>=0;cod(16+k*86,y+24,78,26,cs[k],m?RED:BLUE,14);if(r[1][k])chip(22+k*86,y+54,66,22,r[1][k],r[1][k]==='Stop'?RED:(m?ORANGE:BLUE));}
   g1();});
  ga(1-sg(p,0,.4));TB('?',230,150,GREY,1);g1();
 }),
 F(function(p){ /* 5 couple au hasard */
  TB('(a) couple au hasard',20,30,INK,15,'left');
  var r1=[['1/30',BLUE],['1/30',BLUE],['1/4',GREEN]],r2=[['2/3',VIOLET],['1/30',BLUE],['1/4',GREEN]];
  [r1,r2].forEach(function(r,ri){var y=44+ri*100;if(ri)TB('(c) sœur d\'un enfant atteint',20,y-14,INK,15,'left');
   for(var i=0;i<3;i++){var x=20+i*84;box(x,y,64,44,r[i][1],r[i][1]+'22',8);TB(r[i][0],x+32,y+30,dk(r[i][1]),20);if(i<2)TB('×',x+74,y+30,GREY,20);}
   ga(sg(p,ri*.3,ri*.3+.4));TB('=',282,y+30,GREY,24);box(300,y,140,44,ORANGE,'#fdf5e9',8);TB(ri?'1/180':'1/3 600',370,y+31,DRED,22);g1();});
  var a=sg(p,.7,1);ga(a);box(150,200,160,44,DRED,'#fdecec',22);TB('20 fois plus',230,230,DRED,20);g1();
  TB('1er : porteur  ·  2e : porteur  ·  enfant mm',230,268,GREY,12);
 }),
 F(function(p){ /* 6 faux positifs */
  var cs=7,gx=18,gy=22,cols=40,fp={};[37,152,288,341,463,577,604,729,815,933].forEach(function(v){fp[v]=1;});
  for(var k=0;k<1000;k++){var i=k%cols,j=(k/cols)|0,sick=k===500,pos=sick||fp[k],sh=p>0&&pos;DOT(gx+i*cs+3,gy+j*cs+3,sh?3.6:2.6,sh?(sick?RED:ORANGE):'#c7d2e0');}
  TB('1 000 personnes testées (1 malade)',160,16,GREY,12);
  ga(sg(p,0,.5));ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.strokeRect(gx-4,gy-4,cols*cs+4,25*cs+4);g1();
  var a=sg(p,.4,1);ga(a);box(318,28,128,56,RED,'#fdecec',10);TB('vrais : 99',382,62,DRED,18);
  box(318,96,128,56,ORANGE,'#fdf5e9',10);TB('faux : 999',382,130,ORANGE,18);
  box(318,164,128,70,DGREEN,'#e8f7f1',10);TB('99 / 1 098',382,194,INK,15);TB('≈ 9 %',382,222,DGREEN,22);g1();
  TB('(pour 100 000 personnes)',230,268,GREY,12);
  ga(1-sg(p,0,.4));TB('?',382,130,GREY,40);g1();
 }),
 F(function(p){ /* 7 deux âges */
  var d=[['30 ans',104,100,'51 %'],['40 ans',943,99,'90 %']],k=140/1042;LN(40,230,430,230,AX,1.5);
  TB('pour 100 000 grossesses',230,20,GREY,13);
  d.forEach(function(q,i){var x=80+i*190,a=sg(p,0,.8),h1=q[1]*k*a,h2=q[2]*k*a;ctx.fillStyle=RED;ctx.fillRect(x,230-h1,80,h1);ctx.fillStyle=ORANGE;ctx.fillRect(x,230-h1-h2,80,h2);
   TB(q[0],x+40,250,INK,15);ga(sg(p,.5,1));TB(q[1]+' vrais',x+40,230-h1/2+5,'#fff',14);if(h2>14)TB(q[2]+' faux',x+40,230-h1-h2/2+5,'#fff',13);TB(q[3],x+40,230-h1-h2-10,DGREEN,22);g1();});
  ga(sg(p,.6,1));TB('1 042 positifs',270,70,GREY,1);g1();
  ga(1-sg(p,0,.4));TB('?  proportion de vrais positifs',230,130,GREY,18);g1();
 }),
 F(function(p){ /* 8 perdre trois bases */
  var aa=['Met','Ile','Phe','Gly','Val'],co=['AUG','AUU','UUU','GGU','GUC'],s=sg(p,.15,.8);
  TB('délétion de 3 bases = 1 codon',230,22,INK,15);
  for(var i=0;i<5;i++){var x0=26+i*86,x=i>2?x0-86*s:x0,del=i===2,al=del?1-sg(p,0,.4):1;ga(al);cod(x,50-del*(-1)*s*20,78,40,co[i],del?RED:BLUE,18);chip(x+6,104,66,28,aa[i],del?RED:BLUE);g1();}
  ga(sg(p,.5,1));TB('Met – Ile – Gly – Val',230,176,INK,18);box(70,196,320,46,DGREEN,'#e8f7f1',10);TB('cadre conservé : 1 acide aminé en moins',230,225,DGREEN,16);g1();
  ga(1-sg(p,0,.4));TB('conséquence ?',230,225,GREY,18);g1();
 }),
 F(function(p){ /* 9 XXY */
  TB('enfant 47,XXY',230,20,INK,16);
  function game(x,y,ch,lab,col){ell(x,y,46,34,col+'18',col,2.2);ch.forEach(function(c,i){var cx=x+(i-(ch.length-1)/2)*26;if(c==='X')chX(cx,y,14,BLUE);else chY(cx,y+2,12,GREY);});TB(lab,x,y+56,GREY,12);}
  /* possibilité 1 */
  TB('possibilité 1',100,50,DRED,13);game(60,100,['X','X'],'ovule 24',RED);TB('+',118,106,GREY,20);game(170,100,['Y'],'spz 23',BLUE);
  TB('possibilité 2',340,50,DRED,13);game(290,100,['X'],'ovule 23',RED);TB('+',346,106,GREY,20);game(396,100,['X','Y'],'spz 24',BLUE);
  var a=sg(p,0,.6);ga(a);box(20,180,200,70,DRED,'#fdecec',10);TB('erreur de la mère',120,206,INK,14);TB('méiose I ou II',120,232,DRED,16);
  box(240,180,200,70,BLUE,'#e6f1fb',10);TB('erreur du père',340,206,INK,14);TB('méiose I',340,232,BLUE_D,16);g1();
  ga(1-a);TB('quel parent ? quelle division ?',230,222,GREY,16);g1();
 }),
 F(function(p){ /* 10 enfant porteur */
  TB('Nm × Nm',90,20,INK,15);
  pun(10,20,50,['N','m'],['N','m'],['NN','Nm','Nm','mm'],[GREEN,VIOLET,VIOLET,RED],undefined,15);
  crs(10+75,20+75,DRED,14);
  A(190,100,36,0,GREY,'',2.4);
  box(236,50,100,52,VIOLET,'#f1f0fc',10);TB('fille saine',286,70,GREY,12);TB('Nm : 2/3',286,92,'#5249B5',17);
  TB('×',350,82,GREY,20);box(364,50,80,52,BLUE,'#e6f1fb',10);TB('transmet m',404,72,GREY,12);TB('1/2',404,94,BLUE_D,17);
  var a=sg(p,.2,.8);ga(a);A(286,110,0,40,GREY,'',2.4);box(150,156,220,56,ORANGE,'#fdf5e9',10);TB('enfant porteur : 1/3',260,192,DRED,22);g1();
  TB('père NN : ne donne que N',260,244,GREY,13);
  ga(1-a);TB('?',260,190,GREY,30);g1();
 })
]);
})();
