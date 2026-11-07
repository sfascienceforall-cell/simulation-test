/* SFA · Chimie 3e · chapitre 04 : théorie animée et devantures */
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
var SYM=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar'];
function has(r,c){if(r===1)return c===1||c===18;if(r<=3)return c<=2||c>=13;return true;}
function cat(r,c){if(c===18)return 'n';if(r===1)return 'x';var m=[[2,13],[3,14],[4,14],[4,15],[5,15],[5,16]];for(var i=0;i<m.length;i++)if(m[i][0]===r&&m[i][1]===c)return 'm';
 var nm=[[2,14],[2,15],[2,16],[2,17],[3,15],[3,16],[3,17],[4,16],[4,17],[5,17]];for(i=0;i<nm.length;i++)if(nm[i][0]===r&&nm[i][1]===c)return 'x';return 'M';}
var CC={M:'#cfe3f7',x:'#cdeede',m:'#e2dffa',n:'#fbefc2'};
function ptable(x,y,cs,rows,col,hl,colorAmt){var a=colorAmt===undefined?1:colorAmt;
 for(var r=1;r<=rows;r++)for(var c=1;c<=18;c++){if(!has(r,c))continue;var px=x+(c-1)*cs,py=y+(r-1)*cs;
  ctx.fillStyle=a>0?CC[cat(r,c)]:'#eef0f2';if(a>0&&a<1){ctx.fillStyle='#eef0f2';ctx.fillRect(px,py,cs-2,cs-2);ctx.globalAlpha=a;ctx.fillStyle=CC[cat(r,c)];}
  ctx.fillRect(px,py,cs-2,cs-2);ctx.globalAlpha=1;}
 if(hl)hl(function(r,c){return {x:x+(c-1)*cs,y:y+(r-1)*cs};},cs);}
function cellBox(P,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||3;ctx.strokeRect(P.x-1,P.y-1,P.cs,P.cs);}
function EL(sym,Z,A,x,y,w,h,col){box(x,y,w,h,INK,'#fff',5);TB(String(Z),x+7,y+18,GREY,13,'left');ctx.font='700 '+Math.round(h*.4)+'px system-ui';ctx.textAlign='center';ctx.fillStyle=col||ORANGE;ctx.fillText(sym,x+w/2,y+h*.62);TB(String(A).replace('.',','),x+w/2,y+h-10,INK,13);}
function grp(Z){if(Z<=2)return Z===1?1:18;var z=Z<=10?Z-2:Z-10;return z<=2?z:z+10;}
function bohr(cx,cy,Z,sc,t,rot){var sh=[2,8,8],k=0,R=sc;
 DOT(cx,cy,sc*.3,RED);TB(Z+'+',cx,cy+4,'#fff',Math.round(sc*.28));
 for(var s=0;s<3;s++){var r=sc*(.55+.5*s+.2);ctx.strokeStyle='#cfd5db';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
  var m=Math.min(sh[s],Z-k);for(var j=0;j<m;j++){var a=(rot?t*.02*(1-.2*s):0)+j*6.283/Math.max(m,1)+s*.7;DOT(cx+Math.cos(a)*r,cy+Math.sin(a)*r,sc*.095,BLUE);}k+=m;if(k>=Z)break;}}
function shells(Z){var sh=[2,8,8],o=[],k=0;for(var s=0;s<3&&k<Z;s++){var m=Math.min(sh[s],Z-k);o.push(m);k+=m;}return o;}
SFA.theo("c04", {
 icon: function () {
  var cs=Math.min(W*.85/18,(H*.6)/4);var x0=(W-18*cs)/2,y0=H*.12;
  ptable(x0,y0,cs,4,0,function(P,c){var a=P(3,17);a.cs=c;cellBox(a,RED,3);});
  TB('Z croissant · groupes · périodes',W*.5,H*.72,BLUE_D,20);TB('métaux  ·  non-métaux',W*.5,H*.88,ORANGE,18);
 },
 anim: function (t) {
  var Z=1+Math.floor((t/90)%18),sy=SYM[Z-1],o=shells(Z),val=o[o.length-1];
  var cx=W*.2,cy=H*.5,sc=Math.min(H*.3,60);
  bohr(cx,cy,Z,sc,t,true);
  TB(sy+'  (Z = '+Z+')',cx,H*.1,BLUE_D,20);
  // mini tableau
  var cs=Math.min((W*.62)/18,34),x0=W*.34,y0=H*.18;
  ptable(x0,y0,cs,3,0,function(P,c){var r=Z<=2?1:(Z<=10?2:3);var q=P(r,grp(Z));q.cs=c;cellBox(q,RED,3.4);});
  // symboles dans les cases
  for(var z=1;z<=18;z++){var r=z<=2?1:(z<=10?2:3),b=z<=2?0:(z<=10?2:10),c2=grp(z);TB(SYM[z-1],x0+(c2-1)*cs+cs/2-1,y0+(r-1)*cs+cs*.62,z===Z?DRED:INK,Math.round(cs*.42));}
  TB(o.length+' couche'+(o.length>1?'s':'')+' → période '+o.length,x0,y0+cs*3+34,BLUE_D,16,'left');
  TB(val+' électron'+(val>1?'s':'')+' de valence → groupe '+grp(Z),x0,y0+cs*3+60,DRED,16,'left');
  TB('colonne = mêmes électrons de valence',x0,y0+cs*3+84,GREY,13,'left');
 },
 th:
 '<div class="tcard"><b class="h">Comment est construit le tableau ?</b><p>Les éléments sont rangés par <b>numéro atomique Z croissant</b> (et non par masse : l\'argon, 39,95 u, précède le potassium, 39,10 u). Une <b>ligne</b> est une <b>période</b> (7 au total) : le numéro de la période = le nombre de <b>couches électroniques</b> occupées. Une <b>colonne</b> est un <b>groupe</b> (18 au total) : ses éléments ont des propriétés chimiques voisines car ils ont le <b>même nombre d\'électrons de valence</b> (électrons de la dernière couche).</p><p>Groupes 1 et 2 : électrons de valence = numéro du groupe. Groupes 13 à 18 : numéro du groupe − 10 (chlore, groupe 17 : 7 ; gaz nobles : 8, sauf l\'hélium : 2).</p><p>Mendeleïev (1869) classait par masse croissante et laissait des cases vides pour des éléments à découvrir (éka-aluminium → gallium, 1875).</p></div>' +
 '<div class="tcard"><b class="h">Métaux, non-métaux, métalloïdes</b><p>• <b>Métaux</b> (à gauche et au centre) : brillants, bons conducteurs de chaleur et d\'électricité, malléables, presque tous solides à 20 °C (le mercure est liquide). Ils forment des cations.<br>• <b>Non-métaux</b> (à droite, plus l\'hydrogène) : ternes, mauvais conducteurs, solides cassants ou gaz (le brome est liquide).<br>• <b>Métalloïdes</b> (B, Si, Ge, As, Sb, Te) : propriétés intermédiaires ; le silicium est un semi-conducteur.</p><p><b style="color:#a32d2d">Piège :</b> tous les métaux ne sont pas attirés par un aimant (seuls Fe, Co, Ni le sont).</p></div>' +
 '<div class="tcard"><b class="h">Les grandes familles</b><p>• <b>Alcalins</b> (groupe 1, Li, Na, K…) : métaux mous, 1 électron de valence, réagissent violemment avec l\'eau (dihydrogène + solution basique) ; la réactivité augmente en descendant.<br>• <b>Alcalino-terreux</b> (groupe 2) : 2 électrons de valence, moins réactifs.<br>• <b>Halogènes</b> (groupe 17) : 7 électrons de valence, forment des ions X<sup>−</sup> ; F<sub>2</sub> et Cl<sub>2</sub> gaz, Br<sub>2</sub> liquide, I<sub>2</sub> solide.<br>• <b>Gaz nobles</b> (groupe 18) : couche externe complète, très peu réactifs.<br>• <b>Métaux de transition</b> (groupes 3 à 12).</p></div>' +
 '<div class="tcard"><b class="h">Tendances et méthode</b><p>Dans une <b>période</b>, de gauche à droite, le rayon atomique <b>diminue</b> : la charge du noyau augmente et attire plus fort des électrons situés sur les mêmes couches (Na ≈ 180 pm, Cl ≈ 100 pm). Dans un <b>groupe</b>, en descendant, le rayon <b>augmente</b> (une couche de plus) et les températures d\'ébullition des halogènes augmentent.</p><p><b>Méthode :</b> à partir de Z, répartis les électrons (2, 8, 8…) : le nombre de couches donne la période, les électrons de la dernière donnent le groupe. Exemple : K (Z = 19) : 2, 8, 8, 1 → 4 couches, 1 électron de valence : <b>période 4, groupe 1</b>, alcalin. Autre exemple : 5 électrons de valence et 3<sup>e</sup> période → groupe 15 → phosphore.</p></div>'
});

SFA.figs("c04", [
 // 0 case du chlore
 F(function(p){
  var cs=21,x0=(460-18*cs)/2+0,y0=40;
  ptable(x0,y0,cs,7,0,function(P,c){var a=P(3,17);a.cs=c;cellBox(a,RED,3);
   if(p>0){var q=P(3,1);ctx.fillStyle='rgba(226,75,74,.28)';for(var cc=1;cc<=18;cc++)if(has(3,cc)){var z=P(3,cc);ctx.globalAlpha=.4*sg(p,0,.4);ctx.fillRect(z.x,z.y,c-2,c-2);}ctx.globalAlpha=1;
    for(var rr=1;rr<=7;rr++){var z2=P(rr,17);ctx.globalAlpha=.35*sg(p,0,.4);ctx.fillStyle=RED;ctx.fillRect(z2.x,z2.y,c-2,c-2);}ctx.globalAlpha=1;}});
  TB('Cl : Z = 17',230,24,BLUE_D,16);
  if(p>0){ga(sg(p,.2,.6));TB('période 3',x0+cs*9,y0+cs*7+18,DRED,15);ga(sg(p,.4,.8));TB('groupe 17 : halogènes',x0+cs*9,y0+cs*7+38,DRED,15);ga(sg(p,.6,1));TB('7 électrons de valence (17 − 10)',x0+cs*9,y0+cs*7+58,DGREEN,15);g1();}
 }),
 // 1 critère
 F(function(p){
  var d=[['H',1,'1,01'],['He',2,'4,00'],['Li',3,'6,94'],['Be',4,'9,01'],['B',5,'10,81']];
  d.forEach(function(r,i){EL(r[0],r[1],r[2],12+i*88,60,80,100,ORANGE);});
  A(20,200,400,0,BLUE,'',3);TB('Z croissant',230,236,BLUE_D,16);
  TB('Quel critère de rangement ?',230,32,GREY,16);
  if(p>0){ga(sg(p,0,.6));box(60,246,340,28,DGREEN,'#e3f5ee',14);TB('numéro atomique Z (protons)',230,266,DGREEN,15);g1();}
 }),
 // 2 métal / non-métal
 F(function(p){
  var cs=21,x0=41,y0=50;var pins={Mg:[3,2],S:[3,16],Si:[3,14],Cu:[4,11],Ne:[2,18],K:[4,1]};
  ptable(x0,y0,cs,5,0,function(P,c){for(var k in pins){var q=P(pins[k][0],pins[k][1]);DOT(q.x+c/2-1,q.y+c/2-1,7,INK);}},sg(p,0,.5));
  var lb={Mg:[3,2],S:[3,16],Si:[3,14],Cu:[4,11],Ne:[2,18],K:[4,1]};
  for(var k in pins){var xx=x0+(pins[k][1]-1)*cs+cs/2-1,yy=y0+(pins[k][0]-1)*cs;tag(k,xx,yy-9,INK,13);}
  var ky=[['métal',BLUE_D,'#cfe3f7'],['non-métal',DGREEN,'#cdeede'],['métalloïde','#5249B5','#e2dffa'],['gaz noble',YEL,'#fbefc2']];
  if(p>0){ga(sg(p,.3,.8));ky.forEach(function(q,i){ctx.fillStyle=q[2];ctx.fillRect(40+i*105,196,16,16);TB(q[0],62+i*105,210,q[1],14,'left');});g1();
   ga(sg(p,.6,1));TB('Mg, Cu, K : métaux · S : non-métal · Si : métalloïde · Ne : gaz noble',230,246,INK,13);g1();}
  else TB('métal, non-métal ou métalloïde ?',230,230,GREY,16);
 }),
 // 3 électrons de valence
 F(function(p){
  var d=[['Li',1,1],['Mg',2,2],['Al',13,3],['O',16,6],['F',17,7],['Ar',18,8]];
  d.forEach(function(r,i){var x=8+i*75,y=50;box(x,y,68,130,r[0]==='F'?RED:AX,'#fafcfe',8);TB(r[0],x+34,y+30,ORANGE,20);TB('gr. '+r[1],x+34,y+52,GREY,13);
   for(var j=0;j<r[2];j++){var a=j*.785-1.2;DOT(x+34+Math.cos(a)*22,y+90+Math.sin(a)*22,4.4,BLUE);}
   var al=sg(p,i*.1,i*.1+.2);if(al>0){ga(al);TB(String(r[2]),x+34,y+156,DRED,18);g1();}});
  TB('Électrons de valence',230,28,BLUE_D,16);
  if(p>0){ga(sg(p,.5,1));tag('F (7 e⁻, groupe 17) : même famille que Cl',230,222,DGREEN,14);tag('groupe − 10 pour 13 à 18',230,254,GREY,13);g1();}
 }),
 // 4 quel élément
 F(function(p){
  var cs=21,x0=62,y0=40;
  ptable(x0,y0,cs,5,0,function(P,c){
   for(var cc=1;cc<=18;cc++){var z=P(3,cc);if(has(3,cc)){ctx.fillStyle='rgba(55,138,221,.35)';ctx.fillRect(z.x,z.y,c-2,c-2);}}
   for(var rr=1;rr<=5;rr++){var z2=P(rr,15);ctx.fillStyle='rgba(29,158,117,.35)';ctx.fillRect(z2.x,z2.y,c-2,c-2);}
   if(p>0){var q=P(3,15);q.cs=c;ctx.globalAlpha=sg(p,0,.5);cellBox(q,RED,3.5);ctx.globalAlpha=1;}});
  TB('3e période',x0-6,y0+cs*2+cs*.65,BLUE_D,13,'right');
  TB('groupe 15 (5 e⁻ de valence)',x0+14*cs+cs/2,y0+cs*5+22,DGREEN,14);
  if(p>0){ga(sg(p,.3,.8));box(150,178,160,60,DRED,'#fcebeb',12);TB('P : phosphore',230,204,DRED,16);TB('3e ligne, 15e colonne',230,226,INK,13);g1();}
  else TB('?',230,215,GREY,40);
 }),
 // 5 halogènes
 F(function(p){
  var d=[['F₂',-188,GREEN],['Cl₂',-34,BLUE],['Br₂',59,ORA2],['I₂',null,GREY]];
  var Y=function(T){return 140-T*0.42};
  LN(40,Y(0),440,Y(0),AX,1.6);TB('0 °C',34,Y(0)+4,GREY,12,'right');TB('T d\'ébullition',230,26,GREY,14);
  d.forEach(function(r,i){var x=70+i*95;
   if(r[1]!==null){var y=Y(r[1]);ctx.fillStyle=r[2];ctx.fillRect(x-22,Math.min(y,Y(0)),44,Math.abs(y-Y(0)));TB(r[1]+' °C',x,r[1]>0?y-6:y+16,INK,13);}
   else{ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.setLineDash([5,4]);ctx.strokeRect(x-22,Y(140),44,Y(0)-Y(140));ctx.setLineDash([]);if(p<=0)TB('?',x,Y(60),GREY,30);}
   TB(r[0],x,254,INK,16);TB(['gaz','gaz','liquide','?'][i],x,272,GREY,13);});
  A(60,60,300,0,RED,'',0.01);
  if(p>0){ga(sg(p,0,.6));var x3=70+3*95;ctx.fillStyle='rgba(226,75,74,.18)';ctx.fillRect(x3-22,Y(140),44,Y(0)-Y(140));TB('> 59 °C',x3,Y(140)-8,DRED,14);tag('solide à 20 °C',x3-10,Y(0)+40,DRED,14);tag('moins réactif que Cl',230,52,DRED,14);g1();}
 }),
 // 6 vrai ou faux
 F(function(p){
  var d=[['(a) même période → même e⁻ de valence',0],['(b) tous les métaux sont aimantés',0],['(c) classé par masse croissante',0],['(d) le brome est un non-métal liquide',1],['(e) les gaz nobles sont très réactifs',0]];
  d.forEach(function(r,i){var y=34+i*46;box(10,y,440,38,AX,'#fff',8);TB(r[0],22,y+25,INK,15,'left');
   var a=sg(p,i*.15,i*.15+.2);if(a>0){ga(a);var c=r[1]?DGREEN:DRED;box(388,y+4,52,30,c,r[1]?'#e3f5ee':'#fcebeb',15);TB(r[1]?'VRAI':'FAUX',414,y+25,c,14);g1();}else TB('?',414,y+26,GREY,20);});
 }),
 // 7 rayon dans une période
 F(function(p){
  var el=['Na','Mg','Al','Si','P','S','Cl'],R=[180,160,143,118,110,103,100];
  el.forEach(function(s,i){var x=40+i*62,r=R[i]*.15;ctx.fillStyle='rgba(55,138,221,.2)';ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,130,r,0,7);ctx.fill();ctx.stroke();DOT(x,130,3,RED);
   TB(s,x,130+31+10,INK,15);TB('Z = '+(11+i),x,130+31+30,GREY,13);});
  TB('180 pm',40,76,BLUE_D,13);TB('100 pm',412,76,BLUE_D,13);
  TB('Rayon atomique de Na à Cl',230,26,BLUE_D,16);
  if(p>0){ga(sg(p,0,.6));A(60,52,330,0,DRED,'',2.6);box(40,214,380,50,DRED,'#fcebeb',10);TB('charge du noyau + : 11 → 17 ; mêmes couches',230,236,INK,14);TB('attraction plus forte : atome plus petit',230,256,DRED,15);g1();}
 }),
 // 8 éka-aluminium
 F(function(p){
  EL('Al',13,'26,98',20,50,100,110,ORANGE);box(180,50,100,110,RED,'#fff',5);if(p<.3)TB('?',230,120,RED,50);EL('In',49,'114,82',340,50,100,110,ORANGE);
  TB('2,70 g/cm³',70,180,INK,13);TB('7,31 g/cm³',390,180,INK,13);TB('moyenne ?',230,180,GREY,13);
  TB('Mendeleïev, 1869 : l\'élément manquant',230,28,BLUE_D,16);
  if(p>0){ga(sg(p,0,.4));TB('70,90 u',230,98,DRED,18);TB('5,0 g/cm³',230,134,DRED,17);g1();
   ga(sg(p,.4,1));box(60,192,340,76,DGREEN,'#e3f5ee',10);TB('gallium (1875) : 69,72 u · 5,91 g/cm³',230,216,INK,15);TB('écart : 1,7 % sur la masse, 15 % sur ρ',230,242,DGREEN,15);TB('(70,90 − 69,72) ÷ 69,72',230,260,GREY,13);g1();}
 }),
 // 9 potassium
 F(function(p){
  glass(70,110,120,110,.7,'#cfe6f8');
  ball(130,142,13,'#c4c9ce','K',INK);
  for(var i=0;i<9;i++){var u=((i*.13+p*0+i/9)%1);DOT(112+rnd(i)*40,200-u*80,3+rnd(i+3)*2,'#fff');ctx.strokeStyle=BLUE;ctx.lineWidth=1;ctx.beginPath();ctx.arc(112+rnd(i)*40,200-u*80,3+rnd(i+3)*2,0,7);ctx.stroke();}
  ctx.fillStyle=VIOLET;ctx.globalAlpha=.5;for(var f=0;f<3;f++){ctx.beginPath();ctx.arc(120+f*10,132,8,0,7);ctx.fill();}ctx.globalAlpha=1;
  TB('dans l\'eau : H₂ + base',130,244,INK,14);
  var rowsT=[['groupe 1 : alcalin',0],['Z = 19 : 2 · 8 · 8 · 1 → période 4',.2],['K : 19 p · 20 n · 19 e',.4],['KOH',.6],['K⁺ : 18 e⁻',.8]];
  rowsT.forEach(function(r,i){var y=70+i*40,a=sg(p,r[1],r[1]+.2);ga(.2+.8*a);TB(r[0],225,y,i===3?DRED:INK,15,'left');g1();});
 }),
 // 10 Ar / K
 F(function(p){
  EL('Ar',18,'39,95',50,60,140,130,GREEN);EL('K',19,'39,10',270,60,140,130,ORANGE);
  TB('Ar avant K ?',230,32,GREY,16);
  TB('plus lourd',120,212,DRED,14);TB('plus léger',340,212,BLUE_D,14);
  if(p>0){ga(sg(p,0,.6));A(190,125,70,0,DGREEN,'',3);TB('Z : 18 → 19',230,108,DGREEN,15);
   tag('gaz noble (groupe 18)',120,240,DGREEN,14);tag('alcalin (groupe 1)',340,240,DRED,14);
   box(60,250,340,26,BLUE_D,'#eef4fb',13);TB('on classe par Z, pas par masse',230,269,BLUE_D,14);g1();}
 })
]);
})();
