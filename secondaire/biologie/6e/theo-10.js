/* SFA · Biologie 6e · théorie animée et devantures (chapitre 10) */
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
function sun(x,y,r){DOT(x,y,r,'#f6c445');for(var i=0;i<12;i++){var a=i/12*6.2832;LN(x+Math.cos(a)*(r+4),y+Math.sin(a)*(r+4),x+Math.cos(a)*(r+10),y+Math.sin(a)*(r+10),'#f6c445',2.4);}}
function nodeb(x,y,w,h,txt,col,fs){box(x-w/2,y-h/2,w,h,col,col+'22',10,2.4);TB(txt,x,y+(fs||15)*.34,dk(col),fs||15);}
function edge(x1,y1,x2,y2,col,lab,t,lx,ly,dash){LN(x1,y1,x2,y2,col,2.6,dash);var a=Math.atan2(y2-y1,x2-x1),e=x2-Math.cos(a)*0,f=y2;ctx.fillStyle=col;ctx.save();ctx.translate(x2,y2);ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-10,-5);ctx.lineTo(-10,5);ctx.closePath();ctx.fill();ctx.restore();
 if(t!==undefined){var u=(t*.012)%1;DOT(x1+(x2-x1)*u,y1+(y2-y1)*u,4,col);}if(lab)TB(lab,lx,ly,dk(col),12);}
function path10(h){return h;}
SFA.theo("c10", {
 icon: function () {
  sun(W*.12,H*.2,14);var lv=[[W*.3,H*.72,W*.4],[W*.34,H*.52,W*.32],[W*.38,H*.34,W*.24],[W*.42,H*.18,W*.16]];
  var lab=['producteurs','herbivores','carnivores 1','carnivores 2'],cl=[GREEN,BLUE,ORANGE,RED];
  lv.forEach(function(q,i){ctx.fillStyle=cl[i]+'66';ctx.fillRect(q[0],q[1],q[2],H*.14);ctx.strokeStyle=cl[i];ctx.lineWidth=2;ctx.strokeRect(q[0],q[1],q[2],H*.14);});
  TB('× 0,10',W*.76,H*.5,ORANGE,34);TB('à chaque maillon',W*.76,H*.5+24,GREY,13);
  TB('énergie · cycles · climat',W*.5,H*.95,BLUE_D,16);
 },
 sub: [
 {t:"Énergie et chaînes alimentaires", anim: G(function (t) {
  var P=420,u=(t%P)/P;sun(60,40,22);TB('Soleil',60,84,'#8a6a00',13);
  var lv=[['producteurs',50000,GREEN],['herbivores',5000,BLUE],['carnivores 1',500,ORANGE],['carnivores 2',50,RED]];
  var cx=300,w=[360,260,170,100];
  for(var i=0;i<4;i++){var y=232-i*58,a=sg(u,i*.14,i*.14+.12);ga(a);ctx.fillStyle=lv[i][2]+'55';ctx.fillRect(cx-w[i]/2,y-22,w[i],44);ctx.strokeStyle=lv[i][2];ctx.lineWidth=2.4;ctx.strokeRect(cx-w[i]/2,y-22,w[i],44);TB(lv[i][0],cx-w[i]/2+8,y-4,dk(lv[i][2]),14,'left');TB(nfmt(lv[i][1])+' kJ',cx-w[i]/2+8,y+14,INK,13,'left');g1();}
  /* paquets d'énergie : 10 points, 1 monte, 9 partent en chaleur */
  for(var i=0;i<3;i++){var uu=sg(u,.45+i*.1,.65+i*.1),y0=232-i*58-24,y1=232-(i+1)*58+24;
   if(uu>0){for(var k=0;k<10;k++){var x0=cx-60+k*13;if(k===0){DOT(x0+60-0,y0+(y1-y0)*uu,5,lv[i+1][2]);}else{ga(1-uu);DOT(x0+ (60+k*8)*uu*.9+60*0,y0-uu*10,3.2,'#e24b4a');g1();}}}}
  ga(sg(u,.6,.8));TB('90 % dissipés (chaleur, respiration, non consommé)',420,32,DRED,13,'left');TB('× 0,10 à chaque maillon',420,56,ORANGE,15,'left');g1();
  TB('échelle non respectée',cx,282,GREY,11);
 }),
 th:'<div class="tcard"><b class="h">Énergie : un flux à sens unique</b><p>L\'énergie lumineuse est captée par les <b>producteurs</b> (photosynthèse), transmise aux consommateurs (herbivores, carnivores…) puis aux décomposeurs. À chaque maillon, <b>environ 10 %</b> seulement de l\'énergie passe au niveau suivant ; le reste est dissipé (respiration, chaleur) ou non consommé. D\'où des chaînes courtes et une <b>pyramide d\'énergie</b> : 50 000 kJ/m²/an chez les producteurs → 5 000 (herbivores) → 500 (carnivores 1). L\'énergie ne se recycle pas : elle exige un apport continu du Soleil.</p></div>'
 +'<div class="tcard"><b class="h">Matière : un flux en cycle</b><p>Les atomes (C, N, P…) sont <b>recyclés</b> : producteurs → consommateurs → décomposeurs → sels minéraux → producteurs. La matière circule en cycle, l\'énergie à sens unique : c\'est la différence fondamentale entre les deux flux. Les réservoirs (atmosphère, océans, roches, sols) et les flux entre eux sont décrits par les cycles biogéochimiques.</p></div>'
 +'<div class="tcard"><b class="h">Bioaccumulation et bioamplification</b><p>Un polluant <b>persistant</b> (pesticide, métal lourd) n\'est ni dégradé ni éliminé : il s\'accumule dans les tissus (bioaccumulation) et sa concentration <b>augmente à chaque maillon</b> (bioamplification), car un prédateur mange beaucoup de proies. <i>Exemple</i> : 0,02 mg/kg chez les producteurs, ×4 à chaque transfert : 0,08 ; 0,32 ; 1,28 puis <b>5,12 mg/kg</b> au 5<sup>e</sup> niveau, soit 4<sup>4</sup> = 256 fois plus. Les superprédateurs (rapaces, humains) sont les plus exposés.</p></div>'},
 {t:"Cycles de la matière : azote", anim: G(function (t) {
  var N2=[120,48],NH=[120,160],NO=[350,160],PL=[590,160],AN=[590,252],DE=[350,252],EN=[350,48],EA=[590,48];
  nodeb(N2[0],N2[1],120,40,'N₂ (air)',GREY,15);nodeb(NH[0],NH[1]+0,110,40,'NH₄⁺',VIOLET,17);nodeb(NO[0],NO[1],110,40,'NO₃⁻',BLUE,17);nodeb(PL[0],PL[1],110,40,'plantes',GREEN,15);nodeb(AN[0],AN[1],110,40,'animaux',ORANGE,15);nodeb(DE[0],DE[1],130,40,'décomposeurs',DGREEN,14);nodeb(EN[0],EN[1],110,40,'engrais',RED,15);nodeb(EA[0],EA[1],130,40,'cours d\'eau',BLUE,14);
  edge(120,68,120,140,GREY,'',t);TB('fixation (bactéries)',130,106,GREY,12,'left');
  edge(175,160,295,160,VIOLET,'',t);TB('nitrification',235,150,VIOLET,12);
  edge(405,160,535,160,GREEN,'',t);TB('absorption',470,150,DGREEN,12);
  edge(590,180,590,232,ORANGE,'',t);TB('alimentation',600,208,ORANGE,12,'left');
  edge(525,252,415,252,DGREEN,'',t);edge(540,180,400,236,DGREEN,'',t);
  edge(285,252,150,182,DGREEN,'',t);TB('ammonification',170,234,DGREEN,12,'left');
  edge(300,142,160,60,GREY,'',t);TB('dénitrification',200,92,GREY,12,'left');
  edge(350,68,350,140,RED,'',t);TB('apport',360,106,DRED,12,'left');
  edge(395,142,535,60,RED,'',t,0,0,[5,4]);TB('lessivage',500,90,DRED,12,'left');
  ga(.9);TB('excès → eutrophisation',590,28,DRED,13);g1();
 }),
 th:'<div class="tcard"><b class="h">Le cycle de l\'azote</b><p>Le diazote N<sub>2</sub> de l\'air (78 %) n\'est pas utilisable par les plantes. Des <b>bactéries fixatrices</b> (Rhizobium des nodosités de légumineuses, cyanobactéries) le transforment en ammoniac/ammonium NH<sub>4</sub><sup>+</sup>. La <b>nitrification</b> (bactéries du sol) donne les <b>nitrates</b> NO<sub>3</sub><sup>−</sup>, absorbés par les plantes ; les animaux mangent les plantes ; les <b>décomposeurs</b> restituent NH<sub>4</sub><sup>+</sup> (ammonification) ; la <b>dénitrification</b> renvoie du N<sub>2</sub> à l\'atmosphère.</p></div>'
 +'<div class="tcard"><b class="h">Cycle du carbone</b><p>Le carbone circule entre l\'atmosphère (CO<sub>2</sub>), la végétation (<b>photosynthèse</b> : il est fixé), les animaux, les sols et les océans (<b>respiration</b>, décomposition : il retourne à l\'atmosphère). Dans ce cycle rapide, photosynthèse et respiration se compensent à peu près. Les <b>combustibles fossiles</b> sont du carbone stocké pendant des millions d\'années : leur combustion l\'ajoute en quelques décennies, sans compensation, à l\'atmosphère.</p></div>'
 +'<div class="tcard"><b class="h">Eutrophisation et nitrates</b><p>Un excès de <b>nitrates et de phosphates</b> (engrais, eaux usées) → prolifération d\'algues → mort des algues et décomposition par des bactéries aérobies qui <b>consomment le dioxygène</b> → asphyxie des poissons. <i>Calcul</i> : 90 kg N/ha de surplus, 60 % lessivés = 54 kg N ; × 62/14 ≈ 239 kg de nitrates ; dans 3 000 m³ d\'eau de drainage : 239·10<sup>6</sup> mg / 3·10<sup>6</sup> L ≈ <b>80 mg/L</b>, au-dessus de la norme de 50 mg/L ; il faudrait réduire le surplus d\'environ 34 kg N/ha.</p></div>'},
 {t:"Effet de serre et climat", anim: G(function (t) {
  var C=280+(t%700)/700*320,gx=50,gy=252,gw=400,gh=200;axs2(gx,gy,gw,gh);
  function X(c){return gx+(c-250)/400*gw;}function Y(f){return gy-f/7*gh;}
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3.2;ctx.beginPath();for(var c=280;c<=C;c+=4){var f=5.35*Math.log(c/280);c>280?ctx.lineTo(X(c),Y(f)):ctx.moveTo(X(c),Y(f));}ctx.stroke();
  [[420,'420 ppm (aujourd\'hui)'],[560,'560 ppm (× 2)']].forEach(function(q){var f=5.35*Math.log(q[0]/280);LN(X(q[0]),gy,X(q[0]),Y(f),GREY,1,[3,3]);TB(String(q[0]),X(q[0]),gy+16,GREY,12);});
  var F=5.35*Math.log(C/280);DOT(X(C),Y(F),7,RED);
  TB('ΔF = 5,35 × ln(C / 280)',470,52,INK,15,'left');TB('C = '+Math.round(C)+' ppm',470,98,DRED,18,'left');TB('ΔF = '+String((Math.round(F*100)/100).toFixed(2)).replace('.',',')+' W/m²',470,128,ORANGE,18,'left');TB('ΔT = 0,8 × ΔF = '+String((0.8*F).toFixed(1)).replace('.',',')+' K',470,158,DRED,18,'left');
  TB('(équilibre ; l\'océan retarde l\'effet)',470,190,GREY,12,'left');
  function axs2(gx,gy,gw,gh){LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('CO₂ (ppm)',gx+gw,gy+30,GREY,12,'right');TB('forçage ΔF (W/m²)',gx+6,gy-gh-8,GREY,12,'left');}
 }),
 th:'<div class="tcard"><b class="h">L\'effet de serre</b><p>Certains gaz de l\'atmosphère (vapeur d\'eau, <b>CO<sub>2</sub></b>, méthane, N<sub>2</sub>O) laissent passer la lumière solaire mais absorbent une partie du rayonnement infrarouge émis par la Terre, qu\'ils réémettent vers le sol : c\'est l\'<b>effet de serre naturel</b>, indispensable (sans lui, la Terre serait à environ −18 °C). L\'ajout de gaz par les activités humaines (combustibles fossiles, élevage, déforestation) <b>renforce</b> cet effet : réchauffement climatique.</p></div>'
 +'<div class="tcard"><b class="h">Quantifier : forçage et réchauffement</b><p>Le <b>forçage radiatif</b> dû au CO<sub>2</sub> est <b>ΔF = 5,35 × ln(C/C₀)</b> (W/m²). De 280 ppm à 420 ppm : ln 1,5 ≈ 0,405 → ΔF ≈ <b>2,17 W/m²</b>. Avec une sensibilité λ = 0,8 K par W/m² : ΔT = λ·ΔF ≈ <b>1,7 K</b> à l\'équilibre. Le logarithme montre que chaque doublement de la concentration ajoute le même forçage (≈ 3,7 W/m²). Le réchauffement observé est plus faible que l\'équilibre à cause de l\'inertie thermique des océans et des aérosols.</p></div>'
 +'<div class="tcard"><b class="h">Projection simple</b><p>Émissions constantes de 10 GtC/an, 45 % restant dans l\'atmosphère, 1 ppm = 2,12 GtC : 0,45 × 10 / 2,12 ≈ <b>2,1 ppm par an</b> ; de 425 ppm (2025) à ≈ <b>478 ppm</b> en 2050, soit ΔT ≈ 0,8 × 5,35 × ln(478/280) ≈ <b>2,3 K</b>. Des émissions <b>constantes</b> font encore augmenter la concentration : pour stabiliser le climat, il faut des émissions <b>nettes nulles</b>. Mesures : sobriété et efficacité énergétique, énergies renouvelables, reboisement, agriculture moins émettrice.</p></div>'},
 {t:"Perturbations et biodiversité", anim: G(function (t) {
  var P=400,k=((t/P)|0)%5,u=(t%P)/P,ds=[.005,.02,.049,.1,.02],d=ds[k];
  var d1=d;
  /* panneau gauche : âge des parcelles */
  var gx=40,gy=240,gw=290,gh=180;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('âge de la parcelle (ans)',gx+gw,gy+30,GREY,12,'right');TB('fraction plus âgée',gx+6,gy-gh-8,GREY,12,'left');
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();for(var a=0;a<=100;a+=2){var f=Math.exp(-d*a),x=gx+a/100*gw,y=gy-f*gh;a?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  [0,20,40,60,80,100].forEach(function(a){TB(String(a),gx+a/100*gw,gy+16,GREY,11);});
  var f80=Math.exp(-d*80);LN(gx+.8*gw,gy,gx+.8*gw,gy-f80*gh,DGREEN,2,[4,3]);DOT(gx+.8*gw,gy-f80*gh,6,DGREEN);TB('> 80 ans : '+(Math.round(f80*1000)/10).toFixed(1).replace('.',',')+' %',gx+.8*gw-8,gy-f80*gh-12,DGREEN,13,'right');
  var y4=1-Math.exp(-4*d);TB('< 4 ans : '+(Math.round(y4*1000)/10).toFixed(1).replace('.',',')+' %',gx+gw*.04,gy-gh+12,ORANGE,13,'left');
  TB('d = '+(Math.round(d*1000)/10).toFixed(1).replace('.',',')+' % par an',gx+gw*.5,24,INK,17);
  /* panneau droit */
  var rx=390,ry=240,rw=290,rh=160;LN(rx,ry,rx+rw,ry,AX,1.6);LN(rx,ry,rx,ry-rh,AX,1.6);TB('fréquence des perturbations d',rx+rw,ry+30,GREY,12,'right');TB('diversité',rx+6,ry-rh-8,GREY,12,'left');
  ctx.strokeStyle=VIOLET;ctx.lineWidth=3.2;ctx.beginPath();for(var q=0;q<=rw;q+=3){var dd=q/rw*.12,v=(dd>.0051&&dd<.049?1:0)*1;var s=Math.exp(-Math.pow((dd-.027)/.02,2));var y=ry-s*rh*.9;q?ctx.lineTo(rx+q,y):ctx.moveTo(rx+q,y);}ctx.stroke();
  ctx.fillStyle='rgba(29,158,117,.2)';ctx.fillRect(rx+.0051/.12*rw,ry-rh,(.049-.0051)/.12*rw,rh);TB('coexistence',rx+(.0051+.049)/2/.12*rw,ry-rh+14,DGREEN,12);
  var sx=rx+d/.12*rw,s2=Math.exp(-Math.pow((d-.027)/.02,2));DOT(sx,ry-s2*rh*.9,7,RED);
  TB('perturbation intermédiaire :',540,20,ORANGE,13);TB('diversité maximale',540,38,ORANGE,13);
 }),
 th:'<div class="tcard"><b class="h">Perturbation et succession</b><p>Une <b>perturbation</b> (incendie, tempête, coupe, labour) remet à zéro une partie de l\'écosystème. Le milieu se reconstitue ensuite par <b>succession écologique</b> : espèces pionnières (milieux jeunes) puis espèces de forêt ancienne. Une espèce a besoin de parcelles d\'un âge particulier : la diversité dépend de la <b>fréquence</b> des perturbations.</p></div>'
 +'<div class="tcard"><b class="h">Quantifier</b><p>Si une fraction d de la surface est perturbée chaque année, la fraction plus âgée que a ans vaut <b>e<sup>−d·a</sup></b>. <i>Exemple</i> : d = 2 % → e<sup>−1,6</sup> ≈ 20 % de la surface a plus de 80 ans ; d = 10 % → e<sup>−8</sup> ≈ 0,03 % : plus de vieille forêt. Une espèce de forêt ancienne (≥ 2 % de la surface âgée de plus de 80 ans) exige d ≤ ln 50 / 80 ≈ <b>4,9 % par an</b> ; une espèce pionnière (≥ 2 % de la surface de moins de 4 ans) exige d ≥ ln(1/0,98) / 4 ≈ <b>0,5 % par an</b>.</p></div>'
 +'<div class="tcard"><b class="h">Hypothèse de la perturbation intermédiaire</b><p>Entre 0,5 et 4,9 % par an, les deux espèces coexistent : la diversité est maximale pour une fréquence <b>intermédiaire</b>. Trop rare : les milieux jeunes manquent et les compétitrices dominent ; trop fréquente : la forêt ancienne disparaît. D\'où l\'intérêt d\'une <b>gestion</b> argumentée qui maintient une mosaïque de milieux d\'âges variés (aires protégées, corridors, sylviculture douce, réduction des intrants, limitation de l\'artificialisation). Une bonne réponse pèse les arguments scientifiques, économiques et sociaux.</p></div>'}
 ]
});
SFA.figs("c10", [
 F(function(p){ /* 1 pyramide */
  var lv=[['producteurs','50 000',GREEN,300],['herbivores','5 000',BLUE,210],['carnivores 1','500',ORANGE,130]];
  lv.forEach(function(q,i){var y=200-i*66,a=i===0?1:sg(p,(i-1)*.4,(i-1)*.4+.4);ga(a);ctx.fillStyle=q[2]+'55';ctx.fillRect(230-q[3]/2,y,q[3],52);ctx.strokeStyle=q[2];ctx.lineWidth=2.4;ctx.strokeRect(230-q[3]/2,y,q[3],52);TB(q[0],230,y+22,dk(q[2]),14);TB(q[1]+' kJ/m²/an',230,y+42,INK,14);g1();
   if(i>0){ga(a);TB('× 0,10',380,y+50,ORANGE,16,'left');A(372,y+64,0,-26,ORANGE,'',2.4);g1();}});
  sun(34,226,13);A(50,226,24,0,'#d4a010','',2.4);
  ga(1-sg(p,0,.3));TB('?',230,100,GREY,26);g1();
 }),
 F(function(p){ /* 2 azote */
  ctx.fillStyle='#e9d7bd';ctx.fillRect(0,180,460,100);ctx.strokeStyle='#8a6a3a';ctx.lineWidth=2;LN(0,180,460,180,'#8a6a3a',2);
  TB('N₂ (78 % de l\'air)',110,40,GREY,17);for(var i=0;i<5;i++){ctx.fillStyle=GREY;DOT(40+i*34,60+(i%2)*10,5,GREY);}
  LN(300,180,300,110,DGREEN,5);for(var k=0;k<3;k++){LN(300,110+k*18,330+k*8,98+k*18,DGREEN,3);ell(340+k*8,96+k*18,14,8,'#8fd1a8',DGREEN,1.6,-.4);}
  LN(300,180,260,230,'#8a6a3a',3);LN(300,180,340,230,'#8a6a3a',3);ell(268,214,10,8,'#f2e3a8',INK,1.8);ell(332,214,10,8,'#f2e3a8',INK,1.8);
  var a=sg(p,0,.7);ga(a);A(150,80,100,110,GREY,'',3);TB('bactéries des nodosités',210,258,ORANGE,13);TB('N₂ → NH₃ / NH₄⁺',215,150,VIOLET,15);box(300,28,140,36,DGREEN,'#e8f7f1',10);TB('fixation de l\'azote',370,52,DGREEN,14);g1();
  ga(1-a);TB('quel processus ?',370,52,GREY,15);g1();
 }),
 F(function(p){ /* 3 bioamplification */
  var v=['0,02','0,08','0,32','1,28','5,12'],nm=['producteurs','herbivores','carnivores 1','carnivores 2','carnivores 3'],cl=[GREEN,BLUE,ORANGE,RED,VIOLET];
  for(var i=0;i<5;i++){var x=24+i*86,a=sg(p,i*.15,i*.15+.3),h=24+i*20;box(x,60,76,150,AX,'#fbfcfd',8);ga(Math.max(.25,a));var hh=Math.max(6,Math.pow(4,i)/256*90*a+(i<2?6:0));ctx.fillStyle=cl[i]+'88';ctx.fillRect(x+8,200-hh,60,hh);g1();TB(nm[i],x+38,78,dk(cl[i]),10);
   ga(a);TB(v[i],x+38,194-hh-4,INK,14);g1();if(i<4){ga(a);TB('×4',x+81,52,ORANGE,12);g1();}}
  TB('mg/kg',230,22,GREY,12);
  ga(sg(p,.7,1));box(150,222,160,40,DRED,'#fdecec',10);TB('facteur 4⁴ = 256',230,248,DRED,17);g1();
 }),
 F(function(p){ /* 4 forçage */
  var gx=50,gy=232,gw=370,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('CO₂ (ppm)',gx+gw,gy+30,GREY,12,'right');TB('ΔF (W/m²)',gx+6,gy-gh-8,GREY,12,'left');
  function X(c){return gx+(c-250)/350*gw;}function Y(f){return gy-f/4*gh;}
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();for(var c=280;c<=600;c+=5){var f=5.35*Math.log(c/280);c>280?ctx.lineTo(X(c),Y(f)):ctx.moveTo(X(c),Y(f));}ctx.stroke();
  [280,420,560].forEach(function(c){TB(String(c),X(c),gy+16,GREY,12);});
  var a=sg(p,0,.7),f1=5.35*Math.log(1.5);ga(a);LN(X(420),gy,X(420),Y(f1),RED,2,[4,3]);LN(gx,Y(f1),X(420),Y(f1),RED,2,[4,3]);DOT(X(420),Y(f1),7,RED);TB('2,17 W/m²',gx+8,Y(f1)-8,DRED,15,'left');
  box(250,40,180,54,DRED,'#fdecec',10);TB('ΔT = 0,8 × 2,17',340,64,INK,14);TB('≈ 1,7 K',340,86,DRED,18);g1();
  ga(1-a);TB('280 → 420 ppm ?',320,150,GREY,18);g1();
 }),
 F(function(p){ /* 5 nitrates */
  var bx=[['90 kg N',GREEN],['54 kg N',BLUE],['239 kg NO₃⁻',ORANGE]];
  for(var i=0;i<3;i++){var x=8+i*112;box(x,20,86,44,bx[i][1],bx[i][1]+'22',8);TB(bx[i][0],x+43,48,dk(bx[i][1]),i===2?12:14);ga(sg(p,i*.2,i*.2+.3));if(i<2)TB(['× 0,60','× 62/14'][i],x+99,36,GREY,11);g1();}
  TB('÷ 3·10⁶ L',400,48,GREY,13);
  var gx=70,gy=244,gw=300;LN(gx,gy,gx+gw,gy,AX,1.6);var a=sg(p,.2,.9);
  ctx.fillStyle='#d8e6f6';ctx.fillRect(gx,gy-34,gw*50/100,34);TB('norme : 50 mg/L',gx+gw*.25,gy-12,BLUE_D,13);
  ga(a);ctx.fillStyle=RED;ctx.fillRect(gx,gy-80,gw*80/100*a,34);TB('≈ 80 mg/L',gx+gw*.8*a+8,gy-54,DRED,17,'left');g1();LN(gx+gw*.5,gy-90,gx+gw*.5,gy,INK,2,[4,3]);
  ga(sg(p,.7,1));TB('norme dépassée : −34 kg N/ha',230,150,DRED,15);g1();
 }),
 F(function(p){ /* 6 eutrophisation */
  var st=[['engrais',GREEN,'nitrates + phosphates'],['algues',DGREEN,'prolifération'],['décomposition',ORANGE,'O₂ consommé'],['asphyxie',RED,'poissons morts']];
  for(var i=0;i<4;i++){var x=18+i*110,a=sg(p,i*.22,i*.22+.3);box(x,40,100,130,AX,'#fbfcfd',10);ga(Math.max(.3,a));
   ctx.fillStyle=i<2?'#dff0e0':'#cfd9c4';ctx.fillRect(x+6,90,88,70);
   if(i===0){for(var k=0;k<6;k++)DOT(x+16+k*13,70+(k%2)*8,3.4,GREEN);}
   if(i===1){for(var k=0;k<14;k++)DOT(x+14+(k%7)*11,98+((k/7)|0)*10,4,DGREEN);}
   if(i===2){for(var k=0;k<6;k++)ell(x+20+k*12,138+(k%2)*8,5,3,ORANGE,null);TB('bactéries',x+50,124,ORANGE,11);}
   if(i===3){ell(x+50,130,18,8,'#9aa0a6',INK,1.4);crs(x+34,130,DRED,5);}
   TB((i+1)+'. '+st[i][0],x+50,60,dk(st[i][1]),13);TB(st[i][2],x+50,186,GREY,11);g1();
   if(i<3){ga(a);TB('→',x+105,110,GREY,22);g1();}}
  ga(sg(p,.8,1));TB('manque de dioxygène dissous',230,236,DRED,16);g1();
  ga(1-sg(p,0,.3));TB('quelle suite ?',230,246,GREY,16);g1();
 }),
 F(function(p){ /* 7 CO2 en 2050 */
  var gx=60,gy=232,gw=360,gh=160;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('CO₂ (ppm)',gx+6,gy-gh-8,GREY,12,'left');
  function X(a){return gx+(a-2025)/25*gw;}function Y(c){return gy-(c-400)/100*gh;}
  [2025,2035,2050].forEach(function(a){TB(String(a),X(a),gy+16,GREY,12);});[400,450,500].forEach(function(c){TB(String(c),gx-6,Y(c)+4,GREY,11,'right');LN(gx,Y(c),gx+gw,Y(c),'#eef1f4',1);});
  var a=sg(p,0,.8);ctx.strokeStyle=ORANGE;ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(X(2025),Y(425));ctx.lineTo(X(2025+25*a),Y(425+53*a));ctx.stroke();DOT(X(2025),Y(425),5,GREY);
  ga(sg(p,.5,1));DOT(X(2050),Y(478),7,RED);TB('≈ 478 ppm',X(2050)-10,Y(478)-12,DRED,15,'right');TB('+ 2,1 ppm / an',X(2037),Y(455)+34,ORANGE,14);
  box(240,16,200,40,DRED,'#fdecec',10);TB('ΔT ≈ 2,3 K (équilibre)',340,42,DRED,14);g1();
  TB('425',X(2025)+4,Y(425)-10,GREY,12,'left');
 }),
 F(function(p){ /* 8 matière et énergie */
  var cx=170,cy=140,r=78,nd=[['producteurs',GREEN,-1.57],['consommateurs',ORANGE,.52],['décomposeurs',DGREEN,2.62]];
  ctx.strokeStyle='#cfd6df';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
  nd.forEach(function(n,i){var x=cx+Math.cos(n[2])*r,y=cy+Math.sin(n[2])*r;DOT(x,y,15,n[1]+'44');ctx.strokeStyle=n[1];ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,15,0,7);ctx.stroke();});
  TB('producteurs',cx,cy-r-22,DGREEN,12);TB('consommateurs',cx+r+4,cy+r*.5+30,ORANGE,12,'left');TB('décomposeurs',cx-r-4,cy+r*.5+30,DGREEN,12,'right');
  for(var i=0;i<3;i++){var a0=nd[i][2]+.45,a1=nd[(i+1)%3][2]-.45+(i===2?6.2832:0);var am=(a0+a1)/2;A(cx+Math.cos(am-.1)*r,cy+Math.sin(am-.1)*r,-Math.sin(am)*22,Math.cos(am)*22,GREY,'',2.4);}
  TB('matière',cx,cy+4,GREY,16);TB('(en cycle)',cx,cy+22,GREY,12);
  var a=sg(p,.2,.8);ga(a);sun(330,50,16);A(348,66,40,60,'#d4a010','',3);box(330,126,116,44,DRED,'#fdecec',8);TB('chaleur',388,153,DRED,15);A(388,172,0,36,DRED,'',3);TB('énergie : sens unique',388,236,DRED,13);g1();
  ga(1-a);TB('?',388,130,GREY,34);g1();
 }),
 F(function(p){ /* 9 fréquence perturbation */
  var gx=50,gy=232,gw=380,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('d (fraction perturbée par an)',gx+gw,gy+32,GREY,12,'right');
  function X(d){return gx+d/.1*gw;}function Y(f){return gy-Math.min(f,.4)/.4*gh;}
  [0,.02,.05,.1].forEach(function(d){TB(String(Math.round(d*100))+' %',X(d),gy+16,GREY,12);});
  LN(gx,Y(.02),gx+gw,Y(.02),GREY,1.4,[4,3]);TB('2 %',gx-6,Y(.02)+4,GREY,11,'right');
  ctx.strokeStyle=DGREEN;ctx.lineWidth=3;ctx.beginPath();for(var d=0;d<=.1;d+=.002){var y=Y(Math.exp(-80*d)),x=X(d);d?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();TB('> 80 ans',X(.06),Y(.08),DGREEN,13,'left');
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();for(var d=0;d<=.1;d+=.002){var y=Y(1-Math.exp(-4*d)),x=X(d);d?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();TB('< 4 ans',X(.085),Y(.30)-10,ORANGE,13);
  var a=sg(p,0,.8);ga(a);ctx.fillStyle='rgba(29,158,117,.22)';ctx.fillRect(X(.0051),gy-gh,X(.049)-X(.0051),gh);TB('coexistence',(X(.0051)+X(.049))/2,gy-gh+16,DGREEN,13);TB('0,5 % ≤ d ≤ 4,9 %',(X(.0051)+X(.049))/2,gy-gh+34,INK,13);g1();
  ga(1-a);TB('d ?',230,100,GREY,28);g1();
 }),
 F(function(p){ /* 10 carbone fossile */
  box(130,16,200,44,BLUE,'#e6f1fb',10);TB('atmosphère : CO₂',230,44,BLUE_D,16);
  box(10,110,120,48,GREEN,'#e8f7f1',10);TB('végétation',70,140,DGREEN,15);box(330,110,120,48,BLUE,'#e6f1fb',10);TB('océans',390,140,BLUE_D,15);
  A(110,106,60,-40,GREEN,'',2.6);A(170,76,-62,40,GREEN,'',2.6);TB('photosynthèse',60,92,DGREEN,11);A(350,106,-60,-40,BLUE,'',2.6);A(300,76,62,40,BLUE,'',2.6);
  ctx.fillStyle='#8d8f94';ctx.fillRect(10,214,440,56);TB('combustibles fossiles : stockés pendant des millions d\'années',230,248,'#fff',14);
  var a=sg(p,.2,.9);ga(a);A(230,208,0,-140*a,RED,'',6);box(246,166,200,42,DRED,'#fdecec',8);TB('quelques décennies',346,184,DRED,13);TB('carbone ajouté, non compensé',346,200,DRED,11);g1();
  ga(1-a);TB('cycle rapide équilibré ?',230,182,GREY,14);g1();
 })
]);
})();
