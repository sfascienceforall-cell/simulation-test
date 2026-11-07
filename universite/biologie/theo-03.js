/* Biologie BA1 · chapitre 3 : théorie animée et devantures */
function b3_mem(x,y1,y2,w){ /* membrane verticale (bicouche stylisée) */
 w=w||14;ctx.fillStyle='#faeeda';ctx.fillRect(x-w/2,y1,w,y2-y1);ctx.strokeStyle=ORANGE;ctx.lineWidth=1.6;ctx.strokeRect(x-w/2,y1,w,y2-y1);}
function b3_ion(x,y,lab,col,r){r=r||9;DOT(x,y,r,'#fff');ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(lab,x,y+r*.4,dk(col),r*1.1);}
function b3_rbc(x,y,rx,ry,fill,col){ctx.fillStyle=fill||'#fcebeb';ctx.strokeStyle=col||RED;ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(226,75,74,.45)';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x,y,rx*.45,ry*.45,0,0,7);ctx.stroke();}
function b3_vbar(x,y1,y2,vmin,vmax,pts){ /* axe vertical de potentiel en mV ; pts=[[v,lab,col]] */
 var Y=function(v){return y2-(v-vmin)/(vmax-vmin)*(y2-y1);};LN(x,y1,x,y2,INK,1.8);
 for(var v=Math.ceil(vmin/50)*50;v<=vmax;v+=50){LN(x-4,Y(v),x+4,Y(v),INK,1.2);TB(v+'',x-8,Y(v)+4,GREY,11,'right');}
 pts.forEach(function(q){LN(x,Y(q[0]),x+34,Y(q[0]),q[2],3);TB(q[1],x+40,Y(q[0])+4,dk(q[2]),13,'left');});return Y;}

SFA.theo("c03",{
 icon:function(){var x=W*.5;b3_mem(x,22,H-60,16);for(var i=0;i<5;i++)b3_ion(x-60-(i%2)*34,50+i*28,'K⁺',BLUE,9);b3_ion(x+60,H*.4,'K⁺',BLUE,9);A(x-30,H*.44,60,0,RED,'',3);
  TB('E = (61,5/z) · log([X]ₒ/[X]ᵢ)',W*.5,H*.86,BLUE_D,19);TB('Nernst · Fick · osmose',W*.5,H*.97,ORANGE,13);},
 sub:[
 {t:"Diffusion, osmose et transport",
  anim:function(t){
   var mx=W*.5;TB('Le flux net va du plus concentré vers le moins concentré',W*.5,22,BLUE_D,14);
   b3_mem(mx,40,H-50,16);ctx.fillStyle='#fff';ctx.fillRect(mx-4,H*.42,8,H*.16);
   var i;for(i=0;i<16;i++){var x=mx-30-((i*37)%7)*30-12+Math.sin(t*.03+i)*8,y=60+((i*53)%9)*22+Math.cos(t*.025+i*1.3)*8;b3_ion(x,Math.min(H-66,y),'',BLUE,6);}
   for(i=0;i<4;i++){var x2=mx+36+((i*41)%6)*34+Math.sin(t*.03+i*2)*8,y2=70+((i*61)%8)*24+Math.cos(t*.03+i)*8;b3_ion(x2,Math.min(H-66,y2),'',BLUE,6);}
   for(i=0;i<4;i++){var ph=((t*.012+i*.25)%1);var cx=mx-70+ph*140;b3_ion(cx,H*.5,'',RED,6);}
   var ph2=((t*.012+.1)%1);b3_ion(mx+70-ph2*140,H*.5-0,'',GREY,5);
   A(mx-90,H-22,60,0,RED,'',3);TB('J = P · ΔC (flux net)',mx+100,H-18,DRED,13);
   TB('concentré',mx-110,H-52,BLUE_D,12);TB('dilué',mx+110,H-52,BLUE_D,12);},
  th:'<div class="tcard"><b class="h">Diffusion simple et loi de Fick</b><p>Les particules se déplacent au hasard, mais le flux net va des régions concentrées vers les régions diluées. À travers une membrane : <b>J = P · ΔC</b> avec la perméabilité <b>P = D·K/ε</b> (D : diffusion dans la membrane, K : coefficient de partage lipides/eau, ε : épaisseur).</p><p>Exemple : D = 2·10<sup>−12</sup> m²/s, K = 0,1, ε = 5 nm → P = 4·10<sup>−5</sup> m/s ; avec ΔC = 2 mol/m³, J = 8·10<sup>−5</sup> mol·m<sup>−2</sup>·s<sup>−1</sup>. Une membrane deux fois plus épaisse divise J par 2. Attention : 1 mmol/L = 1 mol/m³.</p></div><div class="tcard"><b class="h">Osmose : osmolarité et tonicité</b><p>L\'<b>osmolarité</b> compte toutes les particules dissoutes : 9,0 g/L de NaCl (58,44 g/mol) = 154 mmol/L, soit 308 mOsm/L car NaCl se dissocie en 2 particules. Le glucose à 50 g/L (180,16 g/mol) vaut 278 mOsm/L.</p><p>La <b>tonicité</b> ne compte que les solutés <b>qui ne traversent pas</b> la membrane. Le globule rouge (≈ 300 mOsm/L de solutés non pénétrants) gonfle dans un milieu hypotonique et se rétracte dans un milieu hypertonique. Modèle d\'osmomètre : V/V<sub>0</sub> = 300 / tonicité. « Isoosmotique » n\'est pas « isotonique » : l\'urée, qui traverse librement la membrane, compte dans l\'osmolarité mais pas dans la tonicité. Le glucose à 5 % est isoosmotique ; il devient de l\'eau pure une fois métabolisé.</p></div><div class="tcard"><b class="h">Trois façons de traverser</b><ul><li><b>Diffusion simple</b> (gaz, petites molécules apolaires) : flux proportionnel à ΔC, pas de saturation.</li><li><b>Transport facilité</b> (canal, transporteur GLUT) : dans le sens du gradient, sans ATP, mais <b>saturable</b> : J = J<sub>max</sub>·C/(K<sub>m</sub> + C). Un compétiteur augmente le K<sub>m</sub> apparent : K<sub>m</sub>\' = K<sub>m</sub>(1 + [I]/K<sub>i</sub>).</li><li><b>Transport actif</b> : contre le gradient, avec de l\'énergie. La pompe <b>Na<sup>+</sup>/K<sup>+</sup>-ATPase</b> sort 3 Na<sup>+</sup> et fait entrer 2 K<sup>+</sup> par ATP hydrolysé (transport actif primaire).</li></ul><p>Exemple : J<sub>max</sub> = 100, K<sub>m</sub> = 2 mmol/L : J(10 mmol/L) = 83,3 ; avec un compétiteur à 4 mmol/L (K<sub>i</sub> = 2) : K<sub>m</sub>\' = 6 et J = 62,5.</p></div>'},
 {t:"Potentiels d'équilibre et de repos",
  anim:function(t){
   var ph=t%600,s=1-Math.exp(-ph/130),Vm=-89*s,cx=W*.3,cy=H*.52;
   TB('Le K⁺ sort jusqu\'à ce que la force électrique équilibre la force chimique',W*.5,22,BLUE_D,14);
   bio_cell(cx,cy,H*.32,BLUE,'#f4f9fe');
   for(var i=0;i<9;i++){var a=i*2.4,rr=H*.2*Math.sqrt((i+.5)/9);b3_ion(cx+rr*Math.cos(a),cy+rr*Math.sin(a),'K⁺',BLUE,9);}
   TB('K⁺ 140 mmol/L',cx,cy+H*.32+18,BLUE_D,12);TB('extérieur : K⁺ 5 mmol/L',cx,cy-H*.32-8,GREY,12);
   var rate=1-s;for(var k=0;k<4;k++){var p2=((ph*.012*(0.4+rate)+k*.25)%1);if(rate>.04){ctx.globalAlpha=Math.min(1,rate*3);b3_ion(cx+H*.28+p2*60,cy,'K⁺',BLUE,8);ctx.globalAlpha=1;}}
   TB('−',cx-H*.3,cy-H*.05,DRED,20);TB('+',cx+H*.36,cy-H*.14,DRED,20);
   var x0=W*.66;var Y=b3_vbar(x0,50,H-30,-100,0,[[-89,'E(K⁺) = −89 mV',GREEN]]);
   DOT(x0,Y(Vm),7,RED);TB('Vm = '+Vm.toFixed(0).replace('-','−')+' mV',x0+14,Y(Vm)-8,DRED,13,'left');
   A(W*.5,H-14,60,0,ORA2,'',3);A(W*.5+62,H-14,-60*s,0,RED,'',3);TB('chimique',W*.5+30,H-26,ORA2,11);TB('électrique',W*.5+62-30*s,H-26,DRED,11);},
  th:'<div class="tcard"><b class="h">Équation de Nernst</b><p>Pour un ion X de charge z perméable seul, le potentiel pour lequel flux chimique et flux électrique s\'annulent est : <b>E<sub>X</sub> = (61,5 mV / z) · log<sub>10</sub>([X]<sub>ext</sub>/[X]<sub>int</sub>)</b> à 37 °C (RT/F = 26,7 mV, ×2,303).</p><p>Exemples : K<sup>+</sup> (140 int, 5 ext) → −89 mV ; Cl<sup>−</sup> (10 int, 110 ext, z = −1) → −64 mV ; Ca<sup>2+</sup> (0,1 µmol/L int, 2 mmol/L ext, z = 2) → +132 mV. <b>Piège</b> : ne pas oublier z (et son signe) ni l\'ordre ext/int.</p></div><div class="tcard"><b class="h">Force motrice et potentiel de repos</b><p>La <b>force motrice</b> d\'un ion est Vm − E<sub>X</sub> : elle donne le sens du flux. Pour Ca<sup>2+</sup> à Vm = −70 mV : −70 − 132 = −202 mV, très négatif : Ca<sup>2+</sup> entre massivement dès qu\'un canal s\'ouvre. Pour Cl<sup>−</sup> (E = −64 mV) à Vm = −70 mV, Cl<sup>−</sup> sort légèrement.</p><p>Le <b>potentiel de repos</b> est un compromis pondéré par les perméabilités (<b>Goldman-Hodgkin-Katz</b>) : Vm = 61,5·log[(K<sub>o</sub> + 0,04·Na<sub>o</sub>)/(K<sub>i</sub> + 0,04·Na<sub>i</sub>)] avec pNa/pK = 0,04. Pour K<sub>o</sub> = 5 mmol/L : Vm ≈ −68,6 mV (proche de E<sub>K</sub>).</p></div><div class="tcard"><b class="h">Hyperkaliémie et pompe</b><p>Si K<sub>o</sub> passe de 5 à 10 mmol/L, Vm passe de −68,6 à −58,4 mV (+10,2 mV) : la cellule se dépolarise et se rapproche du seuil. E<sub>K</sub> varie de +18,5 mV : Vm suit E<sub>K</sub> mais amorti, car Na<sup>+</sup> contribue aussi.</p><p>Si la pompe Na<sup>+</sup>/K<sup>+</sup> est bloquée (ouabaïne), les gradients s\'effondrent lentement : K<sub>i</sub> 140 → 100 et Na<sub>i</sub> 12 → 52 mmol/L donnent Vm ≈ −60 mV. La pompe est <b>électrogénique</b> (3 charges sortent, 2 entrent) mais son rôle essentiel est d\'entretenir les gradients.</p></div>'}
 ]
});
SFA.figs("c03",[
 function(p){ /* 0 E(K+) */
  bio_cap('Cellule : K⁺ 140 mmol/L · milieu : K⁺ 5 mmol/L',22);
  var cx=W*.3,cy=H*.55,r=H*.3;bio_cell(cx,cy,r,BLUE,'#f4f9fe');for(var i=0;i<7;i++){var a=i*2.4,rr=r*.7*Math.sqrt((i+.5)/7);b3_ion(cx+rr*Math.cos(a),cy+rr*Math.sin(a),'K⁺',BLUE,10);}
  b3_ion(cx+r+40,cy-30,'K⁺',BLUE,10);A(cx+r*.55,cy,70,0,RED,'',2.6);
  TB('E = 61,5 · log(5/140)',W*.74,H*.34,INK,14);
  bio_pop(p,function(){TB('log(0,0357) = −1,447',W*.74,H*.5,GREY,13);TB('E(K⁺) ≈ −89 mV',W*.74,H*.7,DRED,20);});},
 function(p){ /* 1 osmolarité */
  bio_cap('NaCl 9,0 g/L · M = 58,44 g/mol',22);
  var x=W*.3,y=H*.28,w=110,h=150;ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(x-w/2,y,w,h);ctx.fillStyle='#e6f1fb';ctx.fillRect(x-w/2+1,y+30,w-2,h-31);
  for(var i=0;i<8;i++){var xx=x-38+(i%4)*25,yy=y+60+Math.floor(i/4)*50;b3_ion(xx,yy,'Na⁺',BLUE,10);b3_ion(xx+12,yy+24,'Cl⁻',GREEN,10);}
  TB('1 L',x,y+h+18,GREY,13);TB('9,0 g / 58,44',W*.72,H*.32,INK,15);TB('= 154 mmol/L',W*.72,H*.44,BLUE_D,16);
  bio_pop(p,function(){TB('× 2 particules (Na⁺ + Cl⁻)',W*.72,H*.62,GREY,14);TB('308 mOsm/L',W*.72,H*.8,DRED,22);});},
 function(p){ /* 2 pompe Na/K */
  bio_cap('Qui déplace des ions contre leur gradient avec de l\'ATP ?',22);
  var y=H*.52;b3_mem(W*.5,y-12,y+12,W*.5);ctx.fillStyle='#eeedfe';ctx.strokeStyle=VIOLET;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.5-36,y-48,72,96,16);ctx.fill();ctx.stroke();TB('pompe',W*.5,y+5,VIO_D,13);
  TB('extérieur',W*.12,y-60,GREY,12);TB('cytosol',W*.12,y+80,GREY,12);
  A(W*.5-18,y-30,0,-46,RED,'',3);for(var i=0;i<3;i++)b3_ion(W*.5-38+i*20,y-96,'Na⁺',RED,8);
  A(W*.5+18,y-56,0,50,BLUE,'',3);for(var j=0;j<2;j++)b3_ion(W*.5+60+j*22,y+56,'K⁺',BLUE,8);
  bio_pop(p,function(){TB('3 Na⁺ sortent',W*.5+34,y-92,DRED,13,'left');TB('2 K⁺ entrent',W*.5+96,y+92,BLUE_D,13);TB('ATP → ADP + Pi',W*.06,y+44,VIO_D,14,'left');});},
 function(p){ /* 3 flux membrane */
  bio_cap('J = P · ΔC avec P = D·K/ε',22);
  var x=W*.5,y1=50,y2=H*.62;b3_mem(x,y1,y2,36);TB('ε = 5 nm',x,y2+18,DRED,13);
  ctx.fillStyle='#d8e8f7';ctx.fillRect(W*.08,y1,x-18-W*.08,y2-y1);ctx.fillStyle='#eef4fb';ctx.fillRect(x+18,y1,W*.42-18,y2-y1);
  TB('2 mmol/L',W*.26,(y1+y2)/2,BLUE_D,15);TB('0',W*.76,(y1+y2)/2,GREY,15);A(W*.38,y1+12,60,0,RED,'',3);
  bio_pop(p,function(){TB('P = 2·10⁻¹² × 0,1 / 5·10⁻⁹ = 4·10⁻⁵ m/s',W*.5,H*.82,INK,14);TB('J = P·ΔC = 8·10⁻⁵ mol·m⁻²·s⁻¹  (÷2 si ε × 2)',W*.5,H*.94,DGREEN,14);});},
 function(p){ /* 4 globule rouge */
  bio_cap('Globule rouge : 300 mOsm/L de solutés non pénétrants',22);
  var y=H*.46,x=[W*.18,W*.5,W*.82];
  b3_rbc(x[0],y,48,48*.8,'#fcebeb');TB('0,45 % NaCl',x[0],y+72,INK,13);TB('154 mOsm/L',x[0],y+90,GREY,12);
  b3_rbc(x[1],y,34,34*.8);TB('0,9 % NaCl',x[1],y+72,INK,13);TB('(repère)',x[1],y+90,GREY,12);
  b3_rbc(x[2],y,22,22*.8,'#f6d9d9');TB('1,8 % NaCl',x[2],y+72,INK,13);TB('616 mOsm/L',x[2],y+90,GREY,12);
  bio_pop(p,function(){TB('V/V₀ ≈ 1,95',x[0],y-62,DRED,15);TB('hémolyse',x[0],y+112,DRED,14);TB('V/V₀ ≈ 0,49',x[2],y-42,DRED,15);TB('crénelé',x[2],y+112,DRED,14);TB('V/V₀ = 300 / tonicité',W*.5,H*.97,DGREEN,13);});},
 function(p){ /* 5 chlorure */
  bio_cap('Neurone : Cl⁻ 10 mmol/L (int) · 110 mmol/L (ext)',22);
  var cx=W*.2,cy=H*.55,r=H*.26;bio_cell(cx,cy,r,GREEN,'#f2fbf7');b3_ion(cx-10,cy,'Cl⁻',GREEN,10);for(var i=0;i<6;i++)b3_ion(cx+r+22+(i%2)*26,cy-70+i*26,'Cl⁻',GREEN,10);
  TB('z = −1',W*.76,H*.34,GREY,14);TB('E = (61,5 / −1) · log(110/10)',W*.76,H*.46,INK,14);
  bio_pop(p,function(){TB('= −61,5 × 1,041',W*.76,H*.6,GREY,13);TB('E(Cl⁻) ≈ −64 mV',W*.76,H*.78,DRED,20);});},
 function(p){ /* 6 transporteur */
  bio_cap('J = Jmax · C / (Km + C)',22);
  var x0=W*.14,y0=H*.8,w=W*.78,h=H*.58;var sx=function(v){return x0+v/40*w;},sy=function(v){return y0-v/100*h;};
  bio_ax(x0,y0,w,h,'C (mmol/L)','J (µmol/min)');
  [10,20,30,40].forEach(function(v){TB(''+v,sx(v),y0+15,GREY,11);});[50,100].forEach(function(v){TB(''+v,x0-14,sy(v)+4,GREY,11);});
  LN(x0,sy(100),x0+w,sy(100),AX,1.4,[5,4]);
  bio_fn(function(c){return 100*c/(2+c);},0,40,sx,sy,BLUE,2.8);
  bio_pop(p,function(){bio_fn(function(c){return 100*c/(6+c);},0,40,sx,sy,RED,2.8);DOT(sx(10),sy(83.3),6,BLUE);DOT(sx(10),sy(62.5),6,RED);DOT(sx(30),sy(83.3),6,RED);TB('83,3',sx(10)-6,sy(83.3)-9,BLUE_D,12,'right');TB('62,5',sx(10)+8,sy(62.5)+18,DRED,12,'left');TB('C = 30',sx(30),sy(83.3)+20,DRED,12);TB('+ compétiteur : Km\' = 6',sx(40),sy(30),DRED,12,'right');});
  TB('Km = 2',sx(30),sy(60),BLUE_D,12,'left');},
 function(p){ /* 7 hyperkaliémie */
  bio_cap('Vm (GHK) et E(K⁺) en fonction de [K⁺]ₒ',22);
  var x0=W*.14,y0=H*.84,w=W*.78,h=H*.62;var sx=function(v){return x0+(v-3)/(14-3)*w;},sy=function(v){return y0-(v+105)/65*h;};
  bio_ax(x0,y0,w,h,'[K⁺]ₒ (mmol/L)','Vm (mV)');
  [4,6,8,10,12,14].forEach(function(v){TB(''+v,sx(v),y0+15,GREY,11);});[-90,-70,-50].forEach(function(v){TB(''+v,x0-16,sy(v)+4,GREY,11);});
  bio_fn(function(k){return 61.54*Math.log((k+5.8)/(140.48))/Math.LN10;},3,14,sx,sy,BLUE,2.8);
  bio_fn(function(k){return 61.5*Math.log(k/140)/Math.LN10;},3,14,sx,sy,GREEN,2.4);
  TB('E(K⁺)',sx(13.5),sy(-61.5*Math.log10(140/13.5))+22,DGREEN,12,'right');TB('Vm',sx(13.5),sy(61.54*Math.log10((13.5+5.8)/140.48))-8,BLUE_D,12,'right');
  bio_pop(p,function(){[[5,-68.6],[10,-58.4]].forEach(function(q){DOT(sx(q[0]),sy(q[1]),6,RED);TB(q[1].toFixed(1).replace('.',',').replace('-','−'),sx(q[0]),sy(q[1])+20,DRED,12);});TB('Vm : + 10,2 mV   (E(K⁺) : + 18,5 mV)',W*.5,44,DRED,13);});},
 function(p){ /* 8 isoosmotique */
  bio_cap('NaCl 90 mmol/L + urée 120 mmol/L (perméante)',22);
  var cx=W*.28,cy=H*.54;b3_rbc(cx,cy,p>0?58:44,p>0?47:36);TB('300',cx,cy+4,DRED,13);
  for(var i=0;i<4;i++){A(cx-100+(i%2)*10,cy-52+i*34,26,0,BLUE,'',2);}TB('urée entre',cx-60,cy-72,BLUE_D,12);
  for(var j=0;j<3;j++)A(cx+88,cy-36+j*36,-24,0,ORA2,'',2);TB('eau',cx+90,cy-52,DRED,12);
  TB('total : 180 + 120 = 300 mOsm/L',W*.77,H*.3,INK,12);TB('NaCl : 2 × 90 = 180 mOsm/L',W*.77,H*.45,BLUE_D,13);TB('urée : 120 (traverse)',W*.77,H*.6,GREY,13);
  bio_pop(p,function(){TB('tonicité 180 < 300 : l\'eau entre',W*.74,H*.8,DRED,13);TB('gonflement, voire lyse',W*.74,H*.92,DRED,13);});},
 function(p){ /* 9 glucose 5 % */
  bio_cap('Perfusion de glucose à 5 % (50 g/L)',22);
  ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.08,48,70,100,14);ctx.fill();ctx.stroke();TB('3 L',W*.08+35,104,BLUE_D,14);TB('278 mOsm/L',W*.08+35,168,INK,12);
  var x0=W*.46,y0=H*.8,h=H*.52;LN(x0-10,y0,W*.95,y0,INK,1.6);
  ctx.fillStyle='#e1f5ee';ctx.fillRect(x0,y0-140/160*h,60,140/160*h);ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.strokeRect(x0,y0-140/160*h,60,140/160*h);TB('140',x0+30,y0-140/160*h-6,DGREEN,13);TB('avant',x0+30,y0+16,INK,12);
  bio_pop(p,function(){var hh=130.7/160*h;ctx.fillStyle='#fdece4';ctx.fillRect(x0+110,y0-hh,60,hh);ctx.strokeStyle=ORA2;ctx.strokeRect(x0+110,y0-hh,60,hh);TB('130,7',x0+140,y0-hh-6,DRED,13);TB('après',x0+140,y0+16,INK,12);TB('140 × 42 / 45 = 130,7 mmol/L',W*.62,H*.2+6,DRED,13);});
  TB('[Na⁺] plasmatique (mmol/L)',W*.7,H*.95,GREY,12);},
 function(p){ /* 10 calcium */
  bio_cap('Ca²⁺ : 0,1 µmol/L (int) · 2 mmol/L (ext)',22);
  var Y=b3_vbar(W*.2,44,H-24,-100,150,[[-70,'Vm = −70 mV',BLUE],[132,'E(Ca²⁺) = +132 mV',RED]]);
  bio_pop(p,function(){A(W*.2+20,Y(-70)-4,0,Y(132)-Y(-70)+14,ORA2,'',3);TB('force motrice',W*.62,Y(30)-6,DRED,14);TB('−70 − 132 = −202 mV',W*.62,Y(30)+14,DRED,14);TB('→ entrée de Ca²⁺',W*.62,Y(30)+34,DGREEN,14);TB('à 1 µmol/L : E = +102 mV',W*.62,Y(-40),GREY,13);});
  TB('E = 30,8 · log(2/0,0001)',W*.62,Y(92),INK,13);},
 function(p){ /* 11 piège chlorure */
  bio_cap('Canaux Cl⁻ ouverts · Vm = −70 mV · E(Cl⁻) = −64 mV',22);
  var x0=W*.1,x1=W*.9,y=H*.5;var X=function(v){return x0+(v+80)/(30)*(x1-x0)*.8;};
  LN(x0,y,x1,y,INK,2);[-80,-70,-60,-50].forEach(function(v){LN(X(v),y-5,X(v),y+5,INK,1.4);TB(v+' mV',X(v),y+22,GREY,12);});
  DOT(X(-70),y,8,BLUE);TB('Vm',X(-70),y-16,BLUE_D,14);DOT(X(-64),y,8,GREEN);TB('E(Cl⁻)',X(-64)+12,y-30,DGREEN,14);
  bio_pop(p,function(){A(X(-70)+10,y+44,X(-64)-X(-70)-16,0,RED,'',3);TB('Vm → E(Cl⁻)',W*.5,y+82,DRED,14);b3_ion(W*.2,y-70,'Cl⁻',GREEN,10);A(W*.2+16,y-70,30,0,GREEN,'',2);TB('Cl⁻ sort légèrement',W*.5,H*.92,DGREEN,15);});},
 function(p){ /* 12 lysosome */
  bio_cap('Lysosome pH 5,0 · cytosol pH 7,2',22);
  var cx=W*.64,cy=H*.54;bio_cell(W*.3,cy,H*.34,BLUE,'#f4f9fe');TB('cytosol pH 7,2',W*.3,cy-H*.34-8,BLUE_D,13);
  bio_cell(cx+30,cy,H*.22,ORANGE,'#fbf3e4');TB('lysosome pH 5,0',cx+30,cy-H*.22-8,DRED,13);
  b3_ion(W*.34,cy-10,'B',GREEN,9);A(W*.34+12,cy-10,70,0,GREEN,'',2);b3_ion(cx+30,cy-10,'B',GREEN,9);
  bio_pop(p,function(){for(var i=0;i<6;i++)b3_ion(cx+8+(i%3)*22,cy+14+Math.floor(i/3)*24,'BH⁺',RED,10);TB('[H⁺] ×158 · E = +135 mV',W*.5,H*.94,INK,13);TB('base piégée × 156',cx+30,cy+H*.22+20,DRED,14);});},
 function(p){ /* 13 ouabaïne */
  bio_cap('Ouabaïne : la pompe Na⁺/K⁺ est bloquée',22);
  var x0=W*.16,y0=H*.82,h=H*.54;
  function pr(x,lab,ki,nai,vm){ctx.fillStyle='#e6f1fb';ctx.fillRect(x,y0-ki/150*h,46,ki/150*h);ctx.fillStyle='#fdece4';ctx.fillRect(x+54,y0-nai/150*h,46,nai/150*h);TB(''+ki,x+23,y0-ki/150*h-5,BLUE_D,12);TB(''+nai,x+77,y0-nai/150*h-5,DRED,12);TB(lab,x+50,y0+18,INK,13);TB('K⁺i   Na⁺i',x+50,y0+34,GREY,11);TB('Vm = '+vm,x+50,y0-h-8,DRED,14);}
  LN(W*.08,y0,W*.95,y0,INK,1.6);pr(W*.1,'avant',140,12,'−68,6 mV');
  bio_pop(p,function(){pr(W*.56,'après qq heures',100,52,'−60 mV');TB('→',W*.5,y0-h/2,GREY,26);TB('dépolarisation',W*.8,H*.2+30,DRED,13);});
  if(p<=0)TB('→',W*.5,y0-h/2,GREY,26);}
]);
