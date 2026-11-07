/* SFA · Chimie 3e · chapitre 05 : théorie animée et devantures */
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
function ion(x,y,r,col,sym,ch){ball(x,y,r,col);TB(sym,x-2,y+5,'#fff',Math.round(r*.8));if(ch)TB(ch,x+r*.62,y-r*.45,'#fff',Math.round(r*.7),'left');}
function lat(x0,y0,n,m,cs,r,anim,t){for(var i=0;i<n;i++)for(var j=0;j<m;j++){var pos=(i+j)%2===0;var ox=anim?Math.sin(t*.05+i*2+j)*1.4:0,oy=anim?Math.cos(t*.06+i+j*3)*1.4:0;
 ball(x0+i*cs+ox,y0+j*cs+oy,pos?r*.8:r*1.1,pos?VIOLET:GREEN,pos?'+':'−');}}
function bond(x1,y1,x2,y2){LN(x1,y1,x2,y2,INK,3.4);}
function nucl(cx,cy,Z,e,sc,lab,eCol){ // atome: noyau + électrons
 DOT(cx,cy,sc*.28,RED);TB(Z+'+',cx,cy+4,'#fff',Math.round(sc*.24));var sh=[2,8,8],k=0;
 for(var s=0;s<3&&k<e;s++){var r=sc*(.55+.42*s),m=Math.min(sh[s],e-k);ctx.strokeStyle='#d5dae0';ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
  for(var j=0;j<m;j++){var a=j*6.283/m+s*.5-1.2;DOT(cx+Math.cos(a)*r,cy+Math.sin(a)*r,sc*.085,BLUE);}k+=m;}
 if(lab)TB(lab,cx,cy-sc*(.55+.42*(shells2(e)-1))-10,INK,14);}
function shells2(e){return e<=2?1:(e<=10?2:3);}
SFA.theo("c05", {
 icon: function () {
  var y=H*.4;ion(W*.28,y,30,VIOLET,'Na','+');ion(W*.44,y,34,GREEN,'Cl','−');
  TB('⇒',W*.58,y+8,GREY,30);
  lat(W*.64,y-24,3,3,30,13,false,0);
  TB('ions · molécules',W*.5,H*.82,BLUE_D,20);
 },
 anim: function (t) {
  var u=(t%520)/520,cy=H*.46,xN0=W*.3,xC0=W*.7;
  var move=sg(u,.18,.5),att=sg(u,.7,1);var xN=xN0+(W*.5-xN0-30)*att,xC=xC0+(W*.5-xC0+36)*att;
  var rN=u<.5?44:(44-14*move),rC=34+8*move;
  if(u>=.5)rN=30;
  // Na
  ctx.fillStyle=u>.5?'#e8e5fb':'#f3f1fd';ctx.strokeStyle=VIOLET;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(xN,cy,rN,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle=u>.5?'#d6efe5':'#e8f6f0';ctx.strokeStyle=GREEN;ctx.beginPath();ctx.arc(xC,cy,rC,0,7);ctx.fill();ctx.stroke();
  DOT(xN,cy,5,RED);DOT(xC,cy,5,RED);
  TB('Na',xN,cy+rN+22,VIOLET,16);TB('Cl',xC,cy+rC+22,DGREEN,16);
  // électron qui voyage
  var ex=xN+rN*.9+(xC-rC*.9-(xN+rN*.9))*move,ey=cy-40*Math.sin(move*3.14);
  if(u<.18)DOT(xN+rN*.9,cy,5,BLUE);else if(u<.5)DOT(ex,ey,5.5,BLUE);else DOT(xC-rC*.9,cy,5,BLUE);
  if(u<.5){TB('11 p · 11 e⁻',xN,cy-rN-12,INK,14);TB('17 p · 17 e⁻',xC,cy-rC-12,INK,14);TB('atomes neutres',W*.5,H*.1,GREY,15);}
  else{TB('Na⁺ : 11 p · 10 e⁻',xN,cy-rN-12,VIOLET,14);TB('Cl⁻ : 17 p · 18 e⁻',xC,cy-rC-12,DGREEN,14);TB('cation',xN,cy+rN+42,GREY,14);TB('anion',xC,cy+rC+42,GREY,14);
   TB('les protons n\'ont pas bougé : seul un électron est transféré',W*.5,H*.1,DRED,15);}
  if(u>.7){var a=sg(u,.7,.85);ga(a);TB('+  et  −  s\'attirent',W*.5,H*.92,BLUE_D,16);g1();}
 },
 th:
 '<div class="tcard"><b class="h">Atomes et ions</b><p>Un atome neutre a autant de protons que d\'électrons. Il devient un <b>ion</b> en <b>gagnant ou perdant des électrons</b> (jamais des protons : l\'élément ne change pas).</p><p>• <b>Cation</b> (charge +) : atome qui a <b>perdu</b> des électrons : Na → Na<sup>+</sup> + 1 e<sup>−</sup>.<br>• <b>Anion</b> (charge −) : atome qui a <b>gagné</b> des électrons : Cl + 1 e<sup>−</sup> → Cl<sup>−</sup>.</p><p><code>charge = nombre de protons − nombre d\'électrons</code></p><p>Les atomes cherchent à avoir, comme un gaz noble, une couche externe complète (8 électrons, 2 pour la première couche). Les <b>métaux</b> (groupes 1, 2, 13) perdent 1, 2, 3 électrons : Na<sup>+</sup>, Mg<sup>2+</sup>, Al<sup>3+</sup>. Les <b>non-métaux</b> (groupes 16, 17) gagnent 2, 1 électrons : O<sup>2−</sup>, Cl<sup>−</sup>. Mg<sup>2+</sup>, O<sup>2−</sup> et Al<sup>3+</sup> ont tous 10 électrons comme le néon.</p></div>' +
 '<div class="tcard"><b class="h">Composés ioniques</b><p>Un métal et un non-métal forment un <b>composé ionique</b> : des cations et des anions s\'alternent dans un <b>cristal</b>, tenus par les forces d\'attraction électrique. Il n\'y a pas de molécules : on parle de <b>formule</b> (rapport le plus simple entre ions), pas de molécule NaCl.</p><p>Le composé est <b>électriquement neutre</b> : somme des charges = 0. On « croise » les charges : Mg<sup>2+</sup> + 2 Cl<sup>−</sup> → MgCl<sub>2</sub> ; 2 Al<sup>3+</sup> + 3 O<sup>2−</sup> → Al<sub>2</sub>O<sub>3</sub> ; 2 K<sup>+</sup> + S<sup>2−</sup> → K<sub>2</sub>S.</p><p>Chaque ion est fortement attiré par ses voisins de charge opposée : les solides ioniques sont durs, cassants, et fondent à température élevée (NaCl : 801 °C).</p></div>' +
 '<div class="tcard"><b class="h">Molécules</b><p>Des atomes de <b>non-métaux</b> se lient en <b>partageant des électrons</b> : liaison covalente. Le nombre de liaisons d\'un atome : <b>H 1, Cl 1, O 2, N 3, C 4</b> (8 − nombre d\'électrons de valence). D\'où CH<sub>4</sub>, NH<sub>3</sub>, H<sub>2</sub>O, HCl.</p><p>Dans l\'eau, l\'atome d\'oxygène a 2 liaisons et <b>2 doublets non liants</b> (6 électrons de valence = 2 liaisons × 1 + 2 doublets × 2).</p><p>Entre molécules, les forces sont faibles : les composés moléculaires fondent et bouillent à basse température (diiode I<sub>2</sub> : fusion à 114 °C ; CO<sub>2</sub> : gaz).</p></div>' +
 '<div class="tcard"><b class="h">Exemple chiffré</b><p>Particule de 16 protons, 16 neutrons, 18 électrons : Z = 16 : soufre ; A = 32 ; charge = 16 − 18 = −2 → <b>S<sup>2−</sup></b>, 18 électrons comme l\'argon. Avec Mg<sup>2+</sup> : MgS ; avec Na<sup>+</sup> : Na<sub>2</sub>S.</p><p>Oxyde d\'aluminium : Al (2, 8, 3) perd 3 e<sup>−</sup> ; O (2, 6) gagne 2 e<sup>−</sup> ; il faut 2 Al<sup>3+</sup> (+6) et 3 O<sup>2−</sup> (−6) : Al<sub>2</sub>O<sub>3</sub>, avec 2 × 3 = 6 électrons transférés.</p></div>'
});

SFA.figs("c05", [
 // 0 Na -> Na+
 F(function(p){
  nucl(110,135,11,11,38,'Na',0);TB('Na : 11 p · 11 e⁻',110,236,INK,14);
  A(180,135,100,0,GREY,'',3);
  nucl(350,135,11,10,38,'',0);
  if(p>0){ga(sg(p,0,.5));var a=sg(p,0,.6);DOT(380+a*40,70-a*20,5.5,BLUE);TB('e⁻ perdu',440,48,BLUE_D,13,'right');g1();
   ga(sg(p,.3,.8));TB('Na⁺ : 11 p · 10 e⁻',350,236,VIOLET,15);tag('cation, charge +1',350,262,DRED,14);g1();}
  else TB('Na⁺ ?',350,236,GREY,16);
  TB('perd 1 électron',230,112,GREY,14);
 }),
 // 1 ce qui change
 F(function(p){
  nucl(110,140,17,17,38,'',0);nucl(350,140,17,18,38,'',0);A(180,140,100,0,GREY,'',3);
  TB('Cl',110,232,INK,16);TB('?',350,232,GREY,22);
  var rows=[['protons','17','17'],['neutrons','18','18'],['électrons','17','18']];
  rows.forEach(function(r,i){var y=252+i*0;});
  if(p>0){ga(sg(p,0,.4));TB('Cl⁻',350,232,DGREEN,20);g1();
   ga(sg(p,.3,.7));tag('protons et neutrons : inchangés',230,40,DGREEN,14);ga(sg(p,.6,1));tag('+1 électron : seul changement',230,270,DRED,14);g1();}
  else{TB('Qu\'est-ce qui change ?',230,40,BLUE_D,16);}
 }),
 // 2 quel ion
 F(function(p){
  var d=[['Mg',12,'Mg²⁺',10,'néon',VIOLET],['O',8,'O²⁻',10,'néon',RED],['Cl',17,'Cl⁻',18,'argon',GREEN],['Al',13,'Al³⁺',10,'néon',VIOLET]];
  d.forEach(function(r,i){var x=8+i*113;box(x,40,106,200,AX,'#fafcfe',8);TB(r[0]+' (Z = '+r[1]+')',x+53,64,INK,14);ball(x+53,112,26,r[5],r[0]);
   var a=sg(p,i*.2,i*.2+.3);if(a>0){ga(a);TB(r[2],x+53,170,r[5]===VIOLET?'#5249B5':(r[5]===RED?DRED:DGREEN),22);TB(r[3]+' e⁻',x+53,196,INK,15);TB('→ '+r[4],x+53,220,DGREEN,15);g1();}else TB('?',x+53,185,GREY,36);});
 }),
 // 3 équilibrer charges
 F(function(p){
  var d=[['Na⁺',1,'Cl⁻',1,'NaCl'],['Mg²⁺',1,'Cl⁻',2,'MgCl₂'],['K⁺',2,'S²⁻',1,'K₂S'],['Ca²⁺',1,'O²⁻',1,'CaO']];
  d.forEach(function(r,i){var y=34+i*60;TB(r[0],36,y+24,VIOLET,16,'left');TB('×'+r[1],86,y+24,GREY,15,'left');
   for(var k=0;k<r[1];k++)ball(150+k*30,y+18,11,VIOLET,'+');
   TB(r[2],236,y+24,DGREEN,16,'left');for(var k2=0;k2<r[3];k2++)ball(330+k2*30,y+18,11,GREEN,'−');
   TB('×'+r[3],282,y+24,GREY,15,'left');
   var a=sg(p,i*.2,i*.2+.25);if(a>0){ga(a);box(386,y+2,66,34,DGREEN,'#e3f5ee',10);TB(r[4],419,y+26,DGREEN,16);g1();}});
 }),
 // 4 sel de cuisine
 F(function(p){
  lat(60,50,7,5,34,15,true,p*100);
  TB('cristal de NaCl',200,244,INK,15);
  if(p>0){ga(sg(p,0,.6));box(320,70,130,92,DGREEN,'#e3f5ee',10);TB('Na⁺ : Cl⁻',385,100,INK,16);TB('= 1 pour 1',385,126,DGREEN,18);TB('pas de molécule',385,150,DRED,14);g1();}
  else TB('?',385,120,GREY,50);
 }),
 // 5 liaisons
 F(function(p){
  var d=[['CH₄','C',4,GREY,'carbone'],['NH₃','N',3,BLUE,'azote'],['H₂O','O',2,RED,'oxygène'],['HCl','Cl',1,GREEN,'chlore']];
  d.forEach(function(r,i){var cx=58+i*114,cy=110;
   var a=sg(p,i*.2,i*.2+.3);
   ball(cx,cy,18,r[3]===GREY?'#555':r[3],r[1]);
   var n=r[2],ang={4:[0,1.57,3.14,4.71],3:[-1.57,.52,2.62],2:[2.4,.74],1:[0]}[n];
   if(n===4)ang=[.785,2.356,3.93,5.5];
   ang.forEach(function(an){var hx=cx+Math.cos(an)*44,hy=cy+Math.sin(an)*44;ctx.globalAlpha=.25+.75*a;bond(cx,cy,hx,hy);ball(hx,hy,10,'#e8ecef','H',INK);ctx.globalAlpha=1;});
   TB(r[1]+' : '+n+' liaison'+(n>1?'s':''),cx,196,INK,14);
   if(a>0){ga(a);TB(r[0],cx,230,DGREEN,22);g1();}else TB('?',cx,232,GREY,24);});
  TB('Avec l\'hydrogène (1 liaison)',230,28,BLUE_D,16);
  if(p>0){ga(sg(p,.6,1));tag('O : 2 liaisons + 2 doublets non liants',230,262,DRED,13);g1();}
 }),
 // 6 moléculaire ou ionique
 F(function(p){
  var nm=['CO₂','NaCl','MgO','CaF₂'];
  nm.forEach(function(s,i){var x=8+i*113;box(x,50,106,150,p>0&&i===0?DGREEN:AX,'#fafcfe',8);TB(s,x+53,76,INK,18);
   if(i===0){ball(x+53,130,13,'#555','C');ball(x+22,130,10,RED,'O');ball(x+84,130,10,RED,'O');bond(x+32,130,x+40,130);bond(x+66,130,x+74,130);}
   else lat(x+20,112,3,3,32,13,false,0);});
  TB('Laquelle est formée de molécules ?',230,30,BLUE_D,16);
  if(p>0){ga(sg(p,0,.6));tag('non-métaux',60,226,DGREEN,14);tag('→ molécules',60,248,DGREEN,14);tag('métal + non-métal',290,226,DRED,14);tag('→ ions : cristaux',290,248,DRED,14);g1();}
 }),
 // 7 particule 16/16/18
 F(function(p){
  nucl(120,140,16,18,38,'',0);TB('16 p · 16 n · 18 e⁻',120,236,INK,14);
  var rows=[['élément','Z = 16 : soufre S',0],['nombre de masse','A = 16 + 16 = 32',.2],['charge','16 − 18 = −2 → S²⁻',.4],['gaz noble','argon (18 e⁻)',.6],['avec Mg²⁺ / Na⁺','MgS / Na₂S',.8]];
  rows.forEach(function(r,i){var y=60+i*44;TB(r[0],240,y,GREY,13,'left');var a=sg(p,r[2],r[2]+.2);if(a>0){ga(a);TB(r[1],240,y+19,i===2?DRED:INK,15,'left');g1();}else TB('?',240,y+19,GREY,15,'left');});
 }),
 // 8 NaCl vs I2
 F(function(p){
  box(8,36,214,180,AX,'#fafcfe',8);box(238,36,214,180,AX,'#fafcfe',8);
  lat(46,70,5,4,34,14,true,p*100);TB('NaCl : cristal d\'ions',115,236,INK,14);
  for(var i=0;i<4;i++)for(var j=0;j<3;j++){var x=272+i*46+(j%2)*12,y=76+j*44;ball(x,y,9,VIOLET);ball(x+18,y,9,VIOLET);bond(x+8,y,x+10,y);}
  TB('I₂ : molécules séparées',345,236,INK,14);
  if(p>0){ga(sg(p,0,.6));box(40,252,170,26,DRED,'#fcebeb',12);TB('fusion : 801 °C',125,271,DRED,15);box(260,252,170,26,BLUE_D,'#eef4fb',12);TB('fusion : 114 °C',345,271,BLUE_D,15);g1();
   ga(sg(p,.5,1));tag('forces fortes (+/−)',115,200,DRED,13);tag('forces faibles',345,200,BLUE_D,13);g1();}
 }),
 // 9 Al2O3
 F(function(p){
  [[70,'Al'],[70,'Al']].forEach(function(r,i){});
  var al=[[80,90],[80,190]],ox=[[290,60],[290,140],[290,220]];
  al.forEach(function(q){ion(q[0],q[1],24,VIOLET,'Al',p>0?'3+':'');});
  ox.forEach(function(q){ion(q[0],q[1],20,RED,'O',p>0?'2−':'');});
  if(p<=0){TB('Al (2, 8, 3)',80,50,INK,13);TB('O (2, 6)',290,26,INK,13);TB('formule ?',420,140,GREY,16,'right');}
  if(p>0){ga(sg(p,0,.5));var k=0;[[0,0],[0,1],[1,2]].forEach(function(m,i){A(112,al[m[0]][1],150,ox[m[1]][1]-al[m[0]][1],BLUE,'',2.2);});g1();
   ga(sg(p,.4,1));box(330,90,120,100,DGREEN,'#e3f5ee',10);TB('Al₂O₃',390,124,DGREEN,24);TB('2 × (+3) = +6',390,150,VIOLET,13);TB('3 × (−2) = −6',390,170,DRED,13);g1();
   ga(sg(p,.6,1));tag('6 électrons transférés',230,264,DRED,14);g1();}
 }),
 // 10 grand tri
 F(function(p){
  var d=[['A','11 p · 12 n · 10 e','Na⁺',VIOLET],['B','17 p · 18 n · 18 e','Cl⁻',GREEN],['C','11 p · 12 n · 11 e','Na',GREY],['D','10 p · 10 n · 10 e','Ne',ORANGE]];
  d.forEach(function(r,i){var x=8+i*113;box(x,40,106,200,AX,'#fafcfe',8);TB('particule '+r[0],x+53,64,GREY,14);ball(x+53,110,24,r[3],r[0]);
   TB(r[1].split(' · ')[0]+' · '+r[1].split(' · ')[1],x+53,160,INK,13);TB(r[1].split(' · ')[2],x+53,180,INK,13);
   var a=sg(p,i*.2,i*.2+.3);if(a>0){ga(a);box(x+10,194,86,36,r[3],'#fff',10);TB(r[2],x+53,220,r[3]===GREY?INK:r[3],20);g1();}else TB('?',x+53,222,GREY,26);});
 })
]);
})();
