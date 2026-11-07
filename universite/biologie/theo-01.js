/* Biologie BA1 · chapitre 1 : théorie animée et devantures */
/* ---- aides communes à tous les theo-NN.js de biologie (préfixe bio_) ---- */
function bio_cap(t,y,c){TB(t,W*.5,y||20,c||BLUE_D,14);}
function bio_pop(p,fn){if(p>0){ctx.globalAlpha=Math.min(1,p*1.8);fn();ctx.globalAlpha=1;}}
function bio_rb(x,y,w,h,col,txt,ts,fill){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,7);ctx.fill();ctx.stroke();if(txt)TB(txt,x,y+(ts||13)*.35,dk(col),ts||13);}
function bio_ax(x0,y0,w,h,xl,yl,xs,ys){LN(x0,y0,x0+w,y0,INK,1.6);LN(x0,y0,x0,y0-h,INK,1.6);if(xl)TB(xl,x0+w,y0+30,GREY,12,'right');if(yl)TB(yl,x0+4,y0-h-7,GREY,12,'left');}
function bio_fn(f,xa,xb,sx,sy,col,lw,n){n=n||80;ctx.strokeStyle=col;ctx.lineWidth=lw||2.4;ctx.beginPath();for(var i=0;i<=n;i++){var x=xa+(xb-xa)*i/n,X=sx(x),Y=sy(f(x));i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.stroke();}
function bio_cell(x,y,r,col,fill){ctx.fillStyle=fill||'#eef4fb';ctx.strokeStyle=col||BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();}
function bio_drop(x,y,r,col){ctx.fillStyle=col||BLUE;ctx.beginPath();ctx.moveTo(x,y-r*1.5);ctx.quadraticCurveTo(x+r*1.1,y,x,y+r);ctx.quadraticCurveTo(x-r*1.1,y,x,y-r*1.5);ctx.fill();}
function bio_phscale(x0,x1,y,lo,hi,val,col,lab){ /* échelle de pH horizontale avec zone normale 7,35-7,45 */
 var X=function(v){return x0+(v-lo)/(hi-lo)*(x1-x0);};
 ctx.fillStyle='#fcebeb';ctx.fillRect(x0,y-9,X(7.35)-x0,18);ctx.fillStyle='#e1f5ee';ctx.fillRect(X(7.35),y-9,X(7.45)-X(7.35),18);ctx.fillStyle='#e6f1fb';ctx.fillRect(X(7.45),y-9,x1-X(7.45),18);
 LN(x0,y,x1,y,INK,1.4);for(var v=Math.ceil(lo*10)/10;v<=hi+1e-9;v+=.1){var big=Math.abs(v*10-Math.round(v*10))<1e-6&&Math.round(v*10)%2===0;LN(X(v),y-(big?7:4),X(v),y+(big?7:4),GREY,1);if(big)TB(String(v.toFixed(1)).replace('.',','),X(v),y+24,GREY,11);}
 if(val!=null){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(X(val),y-10);ctx.lineTo(X(val)-7,y-24);ctx.lineTo(X(val)+7,y-24);ctx.closePath();ctx.fill();if(lab)TB(lab,X(val),y-30,dk(col),13);}
 return X;}
function bio_fa(x,y,n,kinks,col,lw){ /* chaîne d'acide gras en zigzag ; kinks = positions des doubles liaisons cis (coude) */
 var px=x,py=y,ang=0,pts=[[x,y]],st=Math.min(15,(W*.5)/(n+2));for(var i=0;i<n;i++){var z=(i%2?1:-1)*.5;var a=ang+z;if(kinks.indexOf(i)>=0)ang+=(kinks.indexOf(i)%2?-.75:.75);px+=Math.cos(a)*st;py+=Math.sin(a)*st;pts.push([px,py]);}
 ctx.strokeStyle=col;ctx.lineWidth=lw||2.6;ctx.lineJoin='round';ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();return pts;}

SFA.theo("c01",{
 icon:function(){
  var cx=W*.5,cy=H*.4;
  for(var i=0;i<5;i++){DOT(cx-96+i*48,cy,14,['#e6f1fb','#fdece4','#e1f5ee','#eeedfe','#faeeda'][i]);ctx.strokeStyle=[BLUE,ORA2,GREEN,VIOLET,ORANGE][i];ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(cx-96+i*48,cy,14,0,7);ctx.stroke();if(i<4)LN(cx-82+i*48,cy,cx-62+i*48,cy,INK,2.4);}
  bio_drop(cx+30,cy-38,5,BLUE);bio_drop(cx-66,cy-38,5,BLUE);
  TB('pH = pKa + log([A⁻]/[HA])',cx,H*.72,BLUE_D,22);TB('condensation · tampons · structure',cx,H*.9,ORANGE,15);},
 sub:[
 {t:"Macromolécules et condensation",
  anim:function(t){
   var n=8,ph=t%720,nb,fr,cond=ph<360;
   if(cond){nb=Math.min(7,Math.floor(ph/45));fr=(ph%45)/45;}else{nb=7-Math.floor((ph-360)/45);fr=((ph-360)%45)/45;}
   var x0=W*.5-3.5*52,y=H*.46;
   TB(cond?'CONDENSATION : monomère + monomère → polymère + H₂O':'HYDROLYSE : polymère + H₂O → monomères',W*.5,26,cond?DGREEN:DRED,15);
   for(var i=0;i<n;i++){var x=x0+i*52;var col=[BLUE,ORA2,GREEN,VIOLET,ORANGE,BLUE,ORA2,GREEN][i];
    if(i<n-1){var bonded=i<nb||(false);
     if(bonded)LN(x+16,y,x+36,y,INK,3.5);else LN(x+18,y,x+34,y,AX,1.5,[3,3]);}
    DOT(x,y,17,'#fff');ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(x,y,17,0,7);ctx.stroke();TB(String(i+1),x,y+4,dk(col),12);}
   if(cond&&nb<=7){var j=Math.min(7,nb);var xx=x0+j*52+26;var yy=y-14-fr*58;ctx.globalAlpha=1-fr*.6;bio_drop(xx,yy,7,BLUE);TB('H₂O',xx,yy-16,BLUE_D,12);ctx.globalAlpha=1;}
   if(!cond){var j2=Math.max(0,nb);var xx2=x0+j2*52+26;var yy2=y-72+fr*58;ctx.globalAlpha=.4+fr*.6;bio_drop(xx2,yy2,7,BLUE);TB('H₂O',xx2,yy2-16,BLUE_D,12);ctx.globalAlpha=1;}
   var cnt=cond?Math.min(7,Math.floor(ph/45)):Math.max(0,7-Math.floor((ph-360)/45));
   TB('liaisons : '+cnt+'   ·   eau '+(cond?'libérée':'consommée')+' : '+cnt,W*.5,H*.78,INK,15);
   TB('n monomères → n − 1 liaisons → n − 1 molécules d\'eau',W*.5,H*.92,GREY,13);},
  th:'<div class="tcard"><b class="h">Quatre familles, une même logique</b><p>Les <b>glucides</b> (monomère : monosaccharide, liaison glycosidique), les <b>protéines</b> (acide aminé, liaison peptidique), les <b>acides nucléiques</b> (nucléotide, liaison phosphodiester) et les <b>lipides</b> (assemblages non covalents d\'acides gras, glycérol, phosphate…) sont bâtis par assemblage de petites unités. Les lipides ne sont pas de vrais polymères, mais les triglycérides et les phospholipides se forment aussi par estérification (une H<sub>2</sub>O libérée par liaison).</p></div><div class="tcard"><b class="h">Condensation et hydrolyse</b><p>Relier deux monomères <b>libère une molécule d\'eau</b> (condensation, déshydratation), et coûte de l\'énergie. L\'inverse, l\'<b>hydrolyse</b>, consomme une molécule d\'eau par liaison rompue.</p><p><b>Règle de comptage</b> : pour une chaîne linéaire de n monomères, il y a <b>n − 1 liaisons</b> et n − 1 H<sub>2</sub>O libérées. Une chaîne circulaire a n liaisons.</p><p><b>Masse du polymère</b> : M = Σ M(monomères) − (n − 1) × 18,02 g/mol.</p></div><div class="tcard"><b class="h">Exemple chiffré</b><p>Maltotriose = 3 glucoses (180,16 g/mol) reliés par 2 liaisons glycosidiques : M = 3 × 180,16 − 2 × 18,02 = <b>504,44 g/mol</b>.</p><p><b>Piège</b> : oublier de retirer l\'eau, ou retirer n molécules d\'eau au lieu de n − 1. Autre piège : l\'insuline a deux chaînes (21 + 30 aa) : 51 − 2 = 49 liaisons peptidiques, auxquelles s\'ajoutent 3 ponts disulfure (liaisons covalentes entre cystéines, qui ne sont pas des liaisons peptidiques).</p></div>'},
 {t:"pH, tampons et gaz du sang",
  anim:function(t){
   var pco2=40+20*Math.sin(t*.02),hco=24,co=.03*pco2,ratio=hco/co,ph=6.1+Math.log(ratio)/Math.LN10;
   var cx=W*.5,by=H*.5;
   TB('pH = 6,1 + log([HCO₃⁻] / (0,03 · pCO₂))',cx,24,BLUE_D,15);
   var tilt=Math.max(-.35,Math.min(.35,(Math.log(ratio/20)/Math.LN10)*1.6));
   ctx.save();ctx.translate(cx,by);ctx.rotate(-tilt);LN(-150,0,150,0,INK,4);
   var hl=hco*1.6,hr=co*32;
   ctx.fillStyle='#e1f5ee';ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-150,-hl,60,hl,4);ctx.fill();ctx.stroke();
   ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.beginPath();ctx.roundRect(90,-hr,60,hr,4);ctx.fill();ctx.stroke();
   TB('HCO₃⁻',-120,-hl-6,DGREEN,12);TB('CO₂',120,-hr-6,ORA2,12);ctx.restore();
   LN(cx,by,cx-24,by+46,INK,3);LN(cx,by,cx+24,by+46,INK,3);
   TB('HCO₃⁻ = 24 mmol/L',W*.2,H*.7,DGREEN,12);TB('pCO₂ = '+pco2.toFixed(0)+' mmHg  (CO₂ dissous '+co.toFixed(1).replace('.',',')+')',W*.74,H*.7,ORA2,12);
   bio_phscale(W*.1,W*.9,H*.9,6.9,7.9,ph,ph<7.35?RED:(ph>7.45?BLUE:GREEN),'pH '+ph.toFixed(2).replace('.',','));},
  th:'<div class="tcard"><b class="h">Henderson-Hasselbalch et pouvoir tampon</b><p>Pour un couple acide faible / base conjuguée : <b>pH = pKa + log([A<sup>−</sup>]/[HA])</b>. Quand [A<sup>−</sup>] = [HA], pH = pKa. Un tampon est efficace pour <b>pH = pKa ± 1</b> ; il est maximal à pH = pKa.</p><p>Le tampon phosphate (pKa 6,8) agit dans le cytoplasme ; le couple <b>CO<sub>2</sub>/HCO<sub>3</sub><sup>−</sup></b> (pKa apparent 6,1) agit dans le sang.</p></div><div class="tcard"><b class="h">Le tampon bicarbonate du sang</b><p>pH = 6,1 + log([HCO<sub>3</sub><sup>−</sup>] / (0,03 × pCO<sub>2</sub>)) avec [HCO<sub>3</sub><sup>−</sup>] en mmol/L et pCO<sub>2</sub> en mmHg. Valeurs normales : HCO<sub>3</sub><sup>−</sup> 22 à 26 mmol/L, pCO<sub>2</sub> 35 à 45 mmHg, pH 7,35 à 7,45.</p><p>Exemple : 24 / (0,03 × 40) = 24 / 1,2 = 20 ; log 20 = 1,30 ; pH = <b>7,40</b>. Le rapport normal est donc 20 pour 1.</p></div><div class="tcard"><b class="h">Lire un trouble acide-base</b><ul><li><b>pH &lt; 7,35</b> : acidose ; <b>pH &gt; 7,45</b> : alcalose.</li><li>Cause <b>respiratoire</b> si c\'est la pCO<sub>2</sub> qui explique le sens (acidose : pCO<sub>2</sub> élevée) ; <b>métabolique</b> si c\'est HCO<sub>3</sub><sup>−</sup> (acidose : HCO<sub>3</sub><sup>−</sup> bas).</li><li>La <b>compensation</b> va dans le même sens que le trouble pour ramener le rapport vers 20 : le rein modifie HCO<sub>3</sub><sup>−</sup> (lent, jours), le poumon modifie la pCO<sub>2</sub> (rapide, minutes).</li></ul><p>Piège : oublier le facteur 0,03 (on trouverait un pH aberrant autour de 6,1).</p></div><div class="tcard"><b class="h">Structure des protéines et fluidité des membranes</b><p><b>Primaire</b> : séquence (liaisons peptidiques). <b>Secondaire</b> : hélices α et feuillets β, par liaisons hydrogène entre C=O et N–H du squelette (C=O du résidu i avec N–H du résidu i + 4 dans l\'hélice α). <b>Tertiaire</b> : repliement 3D (effet hydrophobe, liaisons ioniques, ponts disulfure). <b>Quaternaire</b> : assemblage de plusieurs chaînes.</p><p><b>Lipides</b> : plus la chaîne est longue et saturée, plus le point de fusion est haut (stéarique 18:0 ≈ 69 °C). Une double liaison <b>cis</b> coude la chaîne, empêche le tassement et fluidifie (oléique ≈ 13 °C, linoléique ≈ −5 °C). La double liaison <b>trans</b> garde la chaîne presque droite (élaïdique ≈ 45 °C).</p></div>'}
 ]
});
SFA.figs("c01",[
 function(p){ /* 0 compter les liaisons */
  bio_cap('Polypeptide de 120 acides aminés',22);
  var n=9,x0=W*.5-(n-1)*22,y=H*.5;
  for(var i=0;i<n;i++){var x=x0+i*44;var mid=(i===4);
   if(i<n-1){LN(x+14,y,x+30,y,p>0?GREEN:INK,p>0?4:2.6);}
   if(mid){TB('· · ·',x,y+5,GREY,18);continue;}
   DOT(x,y,14,'#eef4fb');ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,14,0,7);ctx.stroke();TB(i<4?String(i+1):String(120-(n-1-i)),x,y+4,BLUE_D,11);}
  TB('NH₂',x0-34,y+5,GREY,12);TB('COOH',x0+(n-1)*44+40,y+5,GREY,12);
  TB('n = 120 monomères',W*.5,H*.76,INK,15);
  bio_pop(p,function(){TB('n − 1 = 119 liaisons peptidiques',W*.5,H*.35,DGREEN,16);for(var k=0;k<4;k++){bio_drop(x0+22+k*88,y+42+(k%2)*6,6,BLUE);}TB('119 H₂O libérées',W*.5,H*.92,BLUE_D,16);});},
 function(p){ /* 1 rapport bicarbonate / CO2 */
  bio_cap('pH = 6,1 + log( [HCO₃⁻] / (0,03 · pCO₂) )',22);
  var by=H*.78,k=7.2;
  ctx.fillStyle='#e1f5ee';ctx.strokeStyle=GREEN;ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(W*.2,by-24*k*.6,80,24*k*.6,4);ctx.fill();ctx.stroke();
  ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.beginPath();ctx.roundRect(W*.62,by-1.2*k*.6*20,80,1.2*k*.6*20,4);ctx.fill();ctx.stroke();
  TB('HCO₃⁻ 24 mmol/L',W*.2+40,by+18,DGREEN,13);TB('0,03 × 40 = 1,2',W*.62+40,by+18,ORA2,13);
  TB('÷',W*.5,by-40,GREY,26);
  bio_pop(p,function(){TB('rapport 24 / 1,2 = 20',W*.5,H*.2,INK,15);TB('pH = 6,1 + log 20 = 7,40',W*.5,H*.3,RED,20);});},
 function(p){ /* 2 hélice alpha */
  bio_cap('Hélice α : liaisons H entre résidus i et i + 4',22);
  var cx=W*.5,n=14,R=48,dy=(H-70)/n,pts=[];
  for(var i=0;i<n;i++){pts.push({x:cx+R*Math.sin(i*1.75),y:46+i*dy,z:Math.cos(i*1.75)});}
  ctx.strokeStyle='#9aa0a6';ctx.lineWidth=2;ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.stroke();
  for(var i=0;i+4<n;i++){ctx.strokeStyle=p>0?RED:'#c9ced4';ctx.lineWidth=p>0?2.2:1.2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[i+4].x,pts[i+4].y);ctx.stroke();ctx.setLineDash([]);}
  pts.forEach(function(q,i){DOT(q.x,q.y,q.z>0?9:7,q.z>0?'#e6f1fb':'#f1f3f5');ctx.strokeStyle=BLUE;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(q.x,q.y,q.z>0?9:7,0,7);ctx.stroke();});
  TB('squelette',W*.16,H*.5,GREY,13);TB('C=O ··· H–N',W*.82,H*.5,p>0?DRED:GREY,15);
  bio_pop(p,function(){TB('liaisons hydrogène = structure secondaire',W*.5,H-12,DRED,14);});},
 function(p){ /* 3 trisaccharide */
  bio_cap('3 glucoses → maltotriose',22);
  var y=H*.46;
  for(var i=0;i<3;i++){var x=W*.2+i*W*.3;ctx.strokeStyle=ORA2;ctx.lineWidth=2.6;ctx.fillStyle='#fdece4';ctx.beginPath();for(var k=0;k<6;k++){var a=k*PI/3+PI/6;var X=x+34*Math.cos(a),Y=y+34*Math.sin(a);k?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}ctx.closePath();ctx.fill();ctx.stroke();TB('180,16',x,y+5,DRED,13);
   if(i<2){LN(x+34,y,x+W*.3-34,y,p>0?GREEN:INK,p>0?4:2.4);TB('O',x+W*.15,y-8,GREY,12);}}
  TB('3 × 180,16 = 540,48 g/mol',W*.5,H*.78,INK,14);
  bio_pop(p,function(){for(var k=0;k<2;k++){var xx=W*.35+k*W*.3;bio_drop(xx,y-66,7,BLUE);TB('− H₂O (18,02)',xx,y-92,BLUE_D,12);}TB('M = 540,48 − 2 × 18,02 = 504,44 g/mol',W*.5,H*.92,DGREEN,15);});},
 function(p){ /* 4 acidose respiratoire */
  bio_cap('HCO₃⁻ = 30 mmol/L · pCO₂ = 60 mmHg',22);
  TB('CO₂ dissous = 0,03 × 60 = 1,8 mmol/L',W*.5,52,ORA2,14);
  bio_phscale(W*.08,W*.92,H*.55,6.9,7.9,p>0?7.32:null,RED,'pH 7,32');
  TB('zone normale 7,35 – 7,45',W*.5,H*.55+48,DGREEN,12);
  bio_pop(p,function(){TB('30 / 1,8 = 16,7 ; log 16,7 = 1,22',W*.5,H*.78,INK,14);TB('acidose respiratoire (partiellement compensée)',W*.5,H*.9,DRED,15);});
  if(p<=0)TB('où se place le pH ?',W*.5,H*.8,GREY,15);},
 function(p){ /* 5 fluidité */
  bio_cap('Forme des chaînes et fluidité',22);
  var rows=[['stéarique 18:0',[],INK,'69 °C'],['élaïdique 18:1 trans',[],BLUE,'45 °C'],['oléique 18:1 cis',[5],GREEN,'13 °C'],['linoléique 18:2 cis',[4,8],ORA2,'−5 °C']];
  rows.forEach(function(r,i){var y=58+i*54;bio_fa(W*.08,y,13,r[1],r[2],3);TB(r[0],W*.5+30,y+4,dk(r[2]),13,'left');
   bio_pop(p,function(){TB(r[3],W*.92,y+4,DRED,14,'right');});});
  bio_pop(p,function(){TB('coude cis = chaînes mal tassées = plus fluide',W*.5,H-6,DGREEN,13);});},
 function(p){ /* 6 tampon phosphate */
  bio_cap('Tampon phosphate 20 mmol/L · pKa 6,8',22);
  var by=H*.8,k=H*.036;
  function pair(x,b,a,lab,col){ctx.fillStyle='#e1f5ee';ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,by-b*k,56,b*k,3);ctx.fill();ctx.stroke();ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.beginPath();ctx.roundRect(x+64,by-a*k,56,a*k,3);ctx.fill();ctx.stroke();TB(b.toFixed(1).replace('.',','),x+28,by-b*k-6,DGREEN,12);TB(a.toFixed(1).replace('.',','),x+92,by-a*k-6,DRED,12);TB(lab,x+60,by+18,col,13);}
  pair(W*.1,14.3,5.7,'pH 7,2',INK);TB('HPO₄²⁻   H₂PO₄⁻',W*.1+60,by+36,GREY,11);
  bio_pop(p,function(){pair(W*.58,10.3,9.7,'pH 6,83',DRED);TB('+ 4 mmol/L H⁺',W*.5,H*.4,BLUE_D,14);LN(W*.42,H*.5,W*.54,H*.5,BLUE,3);TB('eau pure : pH 2,40',W*.8,H*.3,GREY,12);});},
 function(p){ /* 7 insuline */
  bio_cap('Insuline : chaîne A (21 aa) et chaîne B (30 aa)',22);
  var ya=H*.36,yb=H*.68,xa=W*.3,xb=W*.12,wa=W*.4,wb=W*.76;
  ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(xa,ya-12,wa,24,12);ctx.fill();ctx.stroke();TB('A · 21',xa+wa/2,ya+5,BLUE_D,13);
  ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.beginPath();ctx.roundRect(xb,yb-12,wb,24,12);ctx.fill();ctx.stroke();TB('B · 30',xb+wb/2,yb+5,DRED,13);
  var br=[[xa+wa*.2,xb+wb*.25],[xa+wa*.9,xb+wb*.6]];
  br.forEach(function(b){LN(b[0],ya+12,b[1],yb-12,YEL,4);TB('S–S',(b[0]+b[1])/2+18,(ya+yb)/2+4,YEL,12);});
  ctx.strokeStyle=YEL;ctx.lineWidth=4;ctx.beginPath();ctx.arc(xa+wa*.38,ya-12,16,PI,0);ctx.stroke();TB('S–S',xa+wa*.38,ya-38,YEL,12);
  bio_pop(p,function(){TB('(21 − 1) + (30 − 1) = 49 liaisons peptidiques',W*.5,H*.14+8,DGREEN,14);TB('3 ponts disulfure · 49 H₂O pour hydrolyser',W*.5,H-10,BLUE_D,14);});},
 function(p){ /* 8 hyperventilation */
  bio_cap('Hyperventilation : pCO₂ 40 → 25 mmHg',22);
  TB('HCO₃⁻ reste 24 mmol/L',W*.5,50,DGREEN,13);
  var X=bio_phscale(W*.08,W*.92,H*.52,7.2,7.8,7.40,BLUE,'7,40');
  bio_pop(p,function(){var x2=X(7.605);LN(X(7.40),H*.52-44,x2,H*.52-44,RED,3);ctx.fillStyle=RED;ctx.beginPath();ctx.moveTo(x2+8,H*.52-44);ctx.lineTo(x2-2,H*.52-50);ctx.lineTo(x2-2,H*.52-38);ctx.fill();TB('7,61',x2,H*.52-52,DRED,15);
   TB('0,03 × 25 = 0,75 ; 24 / 0,75 = 32 ; log 32 = 1,51',W*.5,H*.8,INK,13);TB('alcalose respiratoire',W*.5,H*.92,DRED,15);});},
 function(p){ /* 9 diarrhée */
  bio_cap('Perte de HCO₃⁻ puis compensation respiratoire',22);
  var X=bio_phscale(W*.07,W*.93,H*.55,7.0,7.5,7.40,GREEN,'7,40');
  bio_pop(1,function(){});
  var pts=[[7.10,'(a) 7,10',RED],[7.29,'(b) 7,29',ORANGE]];
  TB('HCO₃⁻ 12 · pCO₂ 40',X(7.10),H*.55+50,DRED,12);
  bio_pop(p,function(){pts.forEach(function(q){DOT(X(q[0]),H*.55,6,q[2]);TB(q[1],X(q[0]),H*.55-14,q[2],13);});LN(X(7.10),H*.55+8,X(7.29),H*.55+8,GREEN,3);TB('pCO₂ 26 : 12 / 0,78 = 15,4',X(7.29)-4,H*.55+50,DGREEN,12);TB('chute 0,30 → 0,11 : environ 63 % corrigés',W*.5,H*.9,INK,14);});},
 function(p){ /* 10 évaporation */
  bio_cap('600 W à évacuer par la sueur',22);
  pers(W*.2,H*.88,H*.55,BLUE,1,'',null);
  for(var k=0;k<6;k++){var a=-PI/2+(k-2.5)*.35;A(W*.2,H*.45,Math.cos(a)*52,Math.sin(a)*52-6,RED,'',2.2);}
  TB('600 W',W*.2,H*.18,DRED,15);
  var bx=W*.55,by=H*.82,bh=H*.5;ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.strokeRect(bx,by-bh,70,bh);
  var f1=.89/2;ctx.fillStyle='#cfe3f7';ctx.fillRect(bx+1,by-bh*f1,68,bh*f1);TB('0,89 L',bx+35,by-bh*f1+16,BLUE_D,13);
  TB('600 W × 3 600 s ÷ 2,42 kJ/g',W*.72,H*.28,INK,12);
  bio_pop(p,function(){ctx.fillStyle='#e6f1fb';ctx.fillRect(bx+1,by-bh*.895,68,bh*.895-bh*f1);TB('1,79 L',bx+35,by-bh*.895+14,BLUE_D,13);TB('sécrété (50 % ruisselle)',W*.72,H*.92,DRED,13);});},
 function(p){ /* 11 gaz du sang */
  bio_cap('Compensation : pCO₂ attendue = 1,5 × HCO₃⁻ + 8 (± 2)',22);
  var x0=W*.14,y0=H*.84,w=W*.76,h=H*.62;var sx=function(v){return x0+(v-5)/(35-5)*w;},sy=function(v){return y0-(v-15)/(50-15)*h;};
  bio_ax(x0,y0,w,h,'HCO₃⁻ (mmol/L)','pCO₂ (mmHg)');
  ctx.fillStyle='rgba(29,158,117,.18)';ctx.beginPath();ctx.moveTo(sx(8),sy(1.5*8+8+2));ctx.lineTo(sx(30),sy(1.5*30+8+2));ctx.lineTo(sx(30),sy(1.5*30+8-2));ctx.lineTo(sx(8),sy(1.5*8+8-2));ctx.fill();
  bio_fn(function(x){return 1.5*x+8;},8,30,sx,sy,GREEN,2.4,2);
  [10,20,30].forEach(function(v){TB(String(v),sx(v),y0+14,GREY,11);});[20,30,40].forEach(function(v){TB(String(v),x0-16,sy(v)+4,GREY,11);});
  DOT(sx(13),sy(28),7,RED);TB('(13 ; 28)',sx(13)+8,sy(28)-12,DRED,13,'left');
  bio_pop(p,function(){LN(sx(13),sy(28),sx(13),sy(27.5),RED,2);TB('attendu 27,5 ± 2 : dans la zone',W*.66,H*.7,DGREEN,13);TB('acidose métabolique compensée',W*.66,H*.78,DGREEN,14);});},
 function(p){ /* 12 bactérie */
  bio_cap('Bactérie sphérique de 1,00 µm³',22);
  var cx=W*.36,cy=H*.54,r=H*.3;bio_cell(cx,cy,r,GREEN,'#f2fbf7');
  for(var i=0;i<46;i++){var a=i*2.399,rr=r*.86*Math.sqrt((i+.5)/46);DOT(cx+rr*Math.cos(a),cy+rr*Math.sin(a),i%3?2.4:4,i%3?BLUE:ORA2);}
  LN(cx,cy,cx+r,cy,RED,2.2);TB('r',cx+r/2,cy-6,DRED,13);
  TB('2,0·10⁶ protéines',W*.72,H*.3,ORA2,13);TB('40 000 g/mol',W*.72,H*.4,INK,12);TB('70 % d\'eau',W*.72,H*.5,BLUE_D,13);
  bio_pop(p,function(){TB('r = 0,62 µm',W*.72,H*.64,DRED,15);TB('S/V = 3/r ≈ 4,8 µm⁻¹',W*.72,H*.76,DRED,15);TB('≈ 133 mg/mL de protéines',W*.5,H*.94,DGREEN,14);});},
 function(p){ /* 13 pH et site actif */
  bio_cap('Fraction active = COO⁻ déprotoné × NH₃⁺ protoné',22);
  var x0=W*.12,y0=H*.84,w=W*.78,h=H*.6;var sx=function(v){return x0+(v-2)/(11-2)*w;},sy=function(v){return y0-v*h;};
  bio_ax(x0,y0,w,h,'pH','fraction');
  [2,4,6,8,10].forEach(function(v){TB(String(v),sx(v),y0+16,GREY,11);});
  bio_fn(function(x){return 1/(1+Math.pow(10,4-x));},2,11,sx,sy,BLUE,2);
  bio_fn(function(x){return 1/(1+Math.pow(10,x-8));},2,11,sx,sy,ORA2,2);
  bio_fn(function(x){return 1/(1+Math.pow(10,4-x))/(1+Math.pow(10,x-8));},2,11,sx,sy,GREEN,3.2);
  TB('carboxylate (pKa 4)',sx(2.1),sy(.62),BLUE_D,12,'left');TB('amine (pKa 8)',sx(10.9),sy(.62),DRED,12,'right');
  bio_pop(p,function(){LN(sx(7),y0,sx(7),sy(.908),DRED,1.6,[4,3]);DOT(sx(7),sy(.908),5,RED);TB('pH 7 : 0,999 × 0,909 = 0,91',sx(7)+10,sy(.78),DRED,13,'left');LN(sx(6),y0,sx(6),sy(.99),DGREEN,1.4,[4,3]);TB('optimum pH 6',sx(6),sy(1)-9,DGREEN,12,'right');});}
]);
