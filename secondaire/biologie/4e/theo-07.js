/* Biologie 4e · chapitre 7 · ATP et bilan énergétique de la cellule */
function b4atp(x,y,n,s,lab,hl){/* adénosine + n phosphates, horizontale */s=s||1;b4box(x,y,34*s,26*s,BLUE,'#e6f1fb',2);TB('A',x,y+5*s,BLUE_D,Math.round(15*s));
 for(var i=0;i<n;i++){var px=x+30*s+i*22*s;LN(px-20*s+4*s,y,px-9*s,y,GREY,2);DOT(px,y,10*s,i===n-1&&hl?'#f6c946':'#f2c879');TB('P',px,y+4*s,'#7a5a00',Math.round(12*s));}}
SFA.theo("c07",{
 icon:function(){b4atp(W*.28,H*.45,3,Math.min(1.5,W/330));TB('ATP ⇄ ADP + Pi',W*.5,H*.78,ORANGE,Math.min(26,W/14));},
 anim:function(t){var P=700,k=(t%P)/P,s=Math.min(1.3,W/560);TB('Le cycle ATP – ADP : une monnaie qu\'on régénère sans cesse',W*.5,H*.08,BLUE_D,Math.max(13,Math.min(16,W/44)));
  var ay=H*.5,ax=W*.12;b4atp(ax,ay,2,s,'',false);
  var atpx=W*.64;TB('ADP',ax+30*s,ay+30*s,INK,14);TB('ATP',atpx+52*s,ay+30*s,INK,14);
  var pa=ax+30*s+2*22*s,pb=atpx+30*s+2*22*s,ph=k<.5?0:1,u=k<.5?k/.5:(k-.5)/.5,e=u*u*(3-2*u);
  var cx,cy;b4atp(atpx,ay,(ph===0?(e>.97?3:2):(e<.03?3:2)),s,'',false);
  if(ph===0){/* phosphate monte de ADP vers ATP en passant par le haut */cx=pa+(pb-pa)*e;cy=ay-Math.sin(e*3.14159)*H*.22;}else{cx=pb-(pb-pa)*e;cy=ay+Math.sin(e*3.14159)*H*.22;}
  /* ADP + Pi libre au départ, ATP complet à l'arrivée */
  if(ph===0&&e<.02||ph===1&&e>.98){/*Pi libre*/}
  DOT(cx,cy,10*s,'#f6c946');TB('P',cx,cy+4*s,'#7a5a00',Math.round(12*s));
  if(ph===0){TB('énergie du catabolisme (respiration, glycolyse…)',W*.5,H*.2,DGREEN,14);TB('ADP + Pi + énergie → ATP',W*.5,H*.88,DGREEN,15);}
  else{TB('énergie libérée pour le travail',W*.5,H*.8,ORANGE,14);TB('synthèses · contraction · transport actif',W*.5,H*.88,ORANGE,14);TB('ATP + H₂O → ADP + Pi + énergie',W*.5,H*.28,ORANGE,15);}
 },
 th:'<div class="tcard"><b class="h">L\'ATP : une monnaie d\'échange énergétique</b><p><b>ATP</b> = adénosine triphosphate. En réagissant avec l\'eau, l\'ATP libère de l\'énergie utilisable immédiatement : <code>ATP + H<sub>2</sub>O → ADP + Pi + énergie</code> (≈ 30,5 kJ/mol en conditions standard, ≈ 50 kJ/mol dans la cellule). Il est <b>régénéré</b> à partir d\'ADP + Pi grâce à l\'énergie des nutriments (respiration dans les mitochondries, glycolyse et fermentation dans le cytoplasme, phase lumineuse dans les chloroplastes).</p><p>Ce n\'est <b>pas une réserve</b> : le stock suffit pour quelques minutes (≈ 50 g dans le corps) ; les réserves durables sont les lipides et le glycogène. Il est consommé par la synthèse de protéines, la contraction musculaire, le transport actif…</p></div>'+
 '<div class="tcard"><b class="h">Anabolisme et catabolisme</b><ul><li><b>Catabolisme</b> : dégradation de molécules, libère de l\'énergie (stockée dans l\'ATP) : respiration, fermentation.</li><li><b>Anabolisme</b> : construction de molécules, consomme de l\'ATP : synthèse de protéines, photosynthèse, formation de glycogène.</li></ul><p>Le <b>métabolisme</b> est l\'ensemble des deux.</p></div>'+
 '<div class="tcard"><b class="h">Besoins énergétiques</b><p><b>Métabolisme de base</b> (Mifflin–St Jeor, garçon) : <code>MB = 10 × masse + 6,25 × taille − 5 × âge + 5</code> (kcal/jour ; 1 kcal = 4,184 kJ). Besoins totaux = MB × facteur d\'activité.</p><div class="tip"><b class="h">Exemple chiffré</b><br>Garçon de 16 ans, 170 cm, 60 kg : MB = 600 + 1 062,5 − 80 + 5 = <b>1 587,5 kcal</b> ≈ 6 642 kJ ; activité modérée × 1,55 → <b>≈ 2 461 kcal</b>.</div><p>Énergie des aliments : glucides et protéines ≈ <b>17 kJ/g</b>, lipides ≈ <b>37 kJ/g</b>. Repas de 90 g de glucides, 30 g de lipides, 25 g de protéines : 1 530 + 1 110 + 425 = <b>3 065 kJ</b> ≈ 733 kcal ; lipides : 36 %.</p></div>'+
 '<div class="tcard"><b class="h">Bilan énergétique</b><p>Bilan = apports − dépenses. Un excès est stocké (≈ 32 000 kJ par kg de graisse), un déficit entame les réserves. Ex. : +2 500 kJ/jour pendant 60 jours = 150 000 kJ ≈ <b>4,7 kg</b> de graisse. Pendant l\'hibernation, le métabolisme est réduit à quelques pour cent : très peu d\'ATP consommé, donc peu de réserves brûlées.</p><div class="tip"><b class="h">Recyclage</b><br>8 400 kJ/jour × 40 % passent par l\'ATP = 3 360 kJ ÷ 50 kJ/mol = 67,2 mol × 507 g/mol ≈ <b>34 kg d\'ATP</b> régénéré par jour.</div></div>'+
 '<div class="tcard"><b class="h">Bilan carboné d\'un végétal</b><p>Jour : photosynthèse (O<sub>2</sub> produit) et respiration ; nuit : respiration seule. Exemple : brute 8 µmol/m²/s pendant 14 h ; respiration 1,5 µmol/m²/s pendant 24 h. Produit : 8 × 14 × 3 600 = 403,2 mmol ; consommé : 1,5 × 24 × 3 600 = 129,6 mmol ; <b>net : 273,6 mmol/m²</b> → 273,6 ÷ 6 = 45,6 mmol de glucose ≈ 8,2 g. Avec un jour de 10 h : 288 − 129,6 = <b>158,4 mmol/m²</b> (jour plus court, croissance plus faible).</p></div>'
});
SFA.figs("c07",[
 /* 0 ATP */
 function(p){var s=Math.min(1.7,W/300);b4atp(W*.2,H*.3,3,s,'',true);TB('adénosine',W*.2,H*.3-30*s,BLUE_D,13);TB('3 phosphates',W*.2+30*s+22*s,H*.3-24*s,'#7a5a00',13);
  A(W*.55,H*.4,0,H*.1,GREY,'',3);TB('+ H₂O',W*.66,H*.45,BLUE_D,15);b4atp(W*.2,H*.65,2,s,'',false);TB('+',W*.2+30*s+22*s*2+22,H*.65+5,INK,20);DOT(W*.62,H*.65,10*s,'#f2c879');TB('P',W*.62,H*.65+4*s,'#7a5a00',12*s);TB('ADP',W*.2+30*s+22,H*.65+30*s,INK,14);TB('Pi',W*.62,H*.65+26*s,INK,14);
  if(p<=0)TB('ATP ?',W*.8,H*.35,GREY,28);
  if(p>0){b4al(b4r(p,0,.5));TB('adénosine triphosphate',W*.7,H*.3,DGREEN,16);TB('énergie libérée',W*.84,H*.45,ORANGE,15);TB('resynthèse : respiration, fermentation, photosynthèse',W*.5,H*.87,DGREEN,13);b4al(1);}},
 /* 1 ana ou cata */
 function(p){var it=[['a','respiration','c'],['b','synthèse de protéine','a'],['c','photosynthèse','a'],['d','fermentation lactique','c'],['e','glycogène','a']];
  b4box(W*.27,H*.62,W*.46,H*.5,GREEN,'#f2fbf7',2);b4box(W*.75,H*.62,W*.46,H*.5,ORANGE,'#fff8ef',2);TB('anabolisme',W*.27,H*.42,DGREEN,16);TB('construire · consomme de l\'ATP',W*.27,H*.48,DGREEN,12);TB('catabolisme',W*.75,H*.42,'#8a5a17',16);TB('dégrader · libère de l\'énergie',W*.75,H*.48,'#8a5a17',12);
  var ia=0,ic=0;it.forEach(function(q,i){var x0=W*(.12+i*.19),y0=H*(i%2?.2:.1),x1,y1;if(q[2]==='a'){x1=W*.27;y1=H*.57+ia*H*.1;ia++;}else{x1=W*.75;y1=H*.57+ic*H*.1;ic++;}
   var e=b4r(p,i*.1,i*.1+.45);e=e*e*(3-2*e);var x=x0+(x1-x0)*e,y=y0+(y1-y0)*e;b4box(x,y,W*.2+((e>0)?W*.06*e:0),H*.075,q[2]==='a'?GREEN:ORANGE,'#fff',2);TB(q[0]+'  '+q[1],x,y+5,INK,Math.max(11,Math.min(13,W/36)));});
  b4ans(p,'a, d : catabolisme · b, c, e : anabolisme',GREEN,H-14);},
 /* 2 réserve */
 function(p){var x0=W*.24,w=W*.6,rows=[['ATP',.05,'quelques minutes',VIOLET],['glycogène',.4,'quelques heures',ORANGE],['lipides',.8,'des semaines',DGREEN]];
  rows.forEach(function(r,i){var y=H*.28+i*H*.2;TB(r[0],x0-12,y+6,INK,15,'right');ctx.fillStyle='#eceef1';ctx.fillRect(x0,y-10,w,22);var f=p<=0?(i===0?.05:0):b4r(p,i*.15,i*.15+.4)*r[1];ctx.fillStyle=r[3];ctx.fillRect(x0,y-10,w*Math.max(f,i===0?.05:0),22);
   if(p>0&&f>=r[1]*.95)TB(r[2],x0+w*r[1]+8,y+6,dk(r[3]),14,'left');});
  TB('durée de la réserve (ordres de grandeur)',x0+w/2,H*.12,GREY,13);if(p<=0)TB('réserve ou monnaie ?',W*.5,H*.9,GREY,17);
  b4ans(p,'monnaie : régénérée en permanence',GREEN,H-14);},
 /* 3 métabolisme de base */
 function(p){var M=b4ax(W*.1,H*.82,W*.8,H*.62,[0,6],[0,1800],'','kcal/jour');M.xl=W*.1;M.yb=H*.82;
  var bars=[['10×60',0,600,BLUE],['6,25×170',600,1062.5,BLUE],['−5×16',1582.5,-80,RED],['+ 5',1582.5,5,BLUE]];
  bars.forEach(function(b,i){var x=M.x(i+.6),a=b[1],c=b[1]+b[2];var y1=M.y(Math.max(a,c)),y2=M.y(Math.min(a,c));ctx.fillStyle=b[3]+'44';ctx.strokeStyle=b[3];ctx.lineWidth=2;ctx.fillRect(x-W*.06,y1,W*.12,Math.max(2,y2-y1));ctx.strokeRect(x-W*.06,y1,W*.12,Math.max(2,y2-y1));TB(b[0],x,M.y(0)+18,INK,13);TB(String(b[2]).replace('.',',').replace('-','−'),x,y1-6,dk(b[3]),13);});
  if(p<=0){TB('MB ?',M.x(5.3),M.y(900),GREY,26);}
  if(p>0){b4al(b4r(p,0,.5));var x=M.x(4.6);ctx.fillStyle='#d8f1e6';ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.fillRect(x-W*.06,M.y(1587.5),W*.12,M.y(0)-M.y(1587.5));ctx.strokeRect(x-W*.06,M.y(1587.5),W*.12,M.y(0)-M.y(1587.5));TB('MB',x,M.y(0)+18,INK,13);TB('1 587,5',x,M.y(1587.5)-6,DGREEN,14);TB('× 1,55 → 2 461 kcal',M.x(3.2),M.y(1000),DGREEN,13);b4al(1);b4ans(p,'1 587,5 kcal ≈ 6 642 kJ · 2 461 kcal',GREEN,H-14);}},
 /* 4 repas */
 function(p){var it=[['glucides','90 g','1 530 kJ',BLUE],['lipides','30 g','1 110 kJ',ORANGE],['protéines','25 g','425 kJ',VIOLET]],x0=W*.1,w=W*.8;
  it.forEach(function(q,i){var x=W*(.2+i*.3);b4box(x,H*.25,W*.24,H*.22,q[3],'#fff',2.2);TB(q[0],x,H*.23,dk(q[3]),15);TB(q[1],x,H*.31,INK,16);if(p>0){b4al(b4r(p,i*.12,i*.12+.3));TB(q[2],x,H*.55,dk(q[3]),15);b4al(1);}});
  var tot=3065,vals=[1530,1110,425],cols=[BLUE,ORANGE,VIOLET],xx=x0,y=H*.68,h=H*.12;if(p>0){vals.forEach(function(v,i){var f=b4r(p,.3+i*.1,.6+i*.1),ww=w*v/tot*f;ctx.fillStyle=cols[i]+'88';ctx.fillRect(xx,y,ww,h);ctx.strokeStyle=cols[i];ctx.lineWidth=2;ctx.strokeRect(xx,y,ww,h);xx+=ww;});if(p>.8){b4al(b4r(p,.8,1));TB('lipides : 36 %',x0+w*(1530+555)/tot,y+h+20,DRED,14);TB('3 065 kJ ≈ 733 kcal',W*.5,y-10,DGREEN,16);b4al(1);}}else{ctx.setLineDash([5,5]);ctx.strokeStyle=GREY;ctx.strokeRect(x0,y,w,h);ctx.setLineDash([]);TB('énergie totale ?',W*.5,y+h*.65,GREY,16);}
  },
 /* 5 ATP recyclé */
 function(p){var st=[['8 400 kJ','par jour',INK],['× 40 %','3 360 kJ',BLUE],['÷ 50 kJ/mol','67,2 mol',VIOLET],['× 507 g/mol','≈ 34 kg',DGREEN]];
  st.forEach(function(q,i){var x=W*(.13+i*.25),y=H*.4;b4box(x,y,W*.21,H*.3,q[2]===INK?GREY:q[2],'#fff',2.2);TB(q[0],x,y-8,dk(q[2]),Math.max(12,Math.min(15,W/32)));if(i===0||p>0&&b4r(p,i*.2,i*.2+.3)>0){b4al(i===0?1:b4r(p,i*.2,i*.2+.3));TB(q[1],x,y+18,INK,Math.max(12,Math.min(15,W/32)));b4al(1);}else TB('?',x,y+18,GREY,18);if(i<3)A(W*(.13+i*.25)+W*.12,H*.4,W*.01,0,GREY,'',2.5);});
  if(p>0){b4al(b4r(p,.7,1));TB('stock du corps ≈ 50 g : ≈ 700 recyclages par jour',W*.5,H*.75,DRED,14);b4al(1);}},
 /* 6 bilan masse */
 function(p){var M=b4ax(W*.12,H*.74,W*.78,H*.58,[0,60],[-3,6],'jours','masse de graisse (kg)');M.xl=W*.12;M.yb=H*.74;LN(M.x(0),M.y(0),M.x(60),M.y(0),AX,1.4);b4tick(M,[30,60],[-2,2,4.7]);
  LN(M.x(0),M.y(0),M.x(60),M.y(4.7),ORANGE,3.2);TB('+ 2 500 kJ/jour',M.x(30),M.y(2.35)-18,'#8a5a17',14);
  LN(M.x(0),M.y(0),M.x(30),M.y(-2),BLUE,3.2);TB('perdre 2 kg en 30 jours',M.x(34),M.y(-2),BLUE_D,14,'left');
  if(p>0){b4al(b4r(p,0,.5));DOT(M.x(60),M.y(4.7),7,RED);TB('4,7 kg',M.x(58),M.y(4.7)-10,DRED,15,'right');DOT(M.x(30),M.y(-2),7,GREEN);TB('déficit ≈ 2 130 kJ/jour',M.x(34),M.y(-2)+22,DGREEN,14,'left');b4al(1);b4ans(p,'(a) ≈ 4,7 kg · (b) ≈ 2 130 kJ/jour',GREEN,H-14);}},
 /* 7 hiberner */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.56,[0,100],[0,100],'temps (jours)','réserves de graisse');M.xl=W*.12;M.yb=H*.76;
  LN(M.x(0),M.y(90),M.x(15),M.y(0),RED,3.2);TB('actif',M.x(8)+10,M.y(60),DRED,14,'left');LN(M.x(0),M.y(90),M.x(100),M.y(60),BLUE,3.2);TB('hibernation',M.x(55),M.y(78)-12,BLUE_D,14);
  if(p<=0)TB('quel avantage ?',M.x(60),M.y(30),GREY,18);
  if(p>0){b4al(b4r(p,0,.5));TB('métabolisme réduit à quelques %',M.x(52),M.y(30),INK,14);TB('→ très peu d\'ATP consommé',M.x(52),M.y(20),INK,14);b4al(1);b4ans(p,'survie des mois sans manger',GREEN,H-14);}},
 /* 8 bilan carboné */
 function(p){var M=b4ax(W*.12,H*.78,W*.78,H*.58,[0,5],[0,450],'','mmol O₂ / m²');M.xl=W*.12;M.yb=H*.78;var vals=[['produit 14 h',403.2,GREEN],['respiration 24 h',129.6,RED],['net 14 h',273.6,BLUE],['net 10 h',158.4,VIOLET]];
  vals.forEach(function(v,i){var x=M.x(i+.6),f=p<=0?(i<2?1:0):b4r(p,(i-1)*.12,(i-1)*.12+.4);if(i>=2&&p<=0){ctx.setLineDash([4,4]);ctx.strokeStyle=GREY;ctx.strokeRect(x-W*.06,M.y(250),W*.12,M.y(0)-M.y(250));ctx.setLineDash([]);TB('?',x,M.y(120),GREY,24);}else{var hh=(M.y(0)-M.y(v[1]))*(i<2?1:f);ctx.fillStyle=v[2]+'44';ctx.strokeStyle=v[2];ctx.lineWidth=2;ctx.fillRect(x-W*.06,M.y(0)-hh,W*.12,hh);ctx.strokeRect(x-W*.06,M.y(0)-hh,W*.12,hh);if(f>.9||i<2)TB(String(v[1]).replace('.',','),x,M.y(0)-hh-6,dk(v[2]),14);}TB(v[0],x,M.y(0)+18,INK,Math.max(11,Math.min(13,W/36)));});
  b4ans(p,'273,6 mmol (≈ 8,2 g) · 10 h : 158,4 mmol',GREEN,H-14);},
 /* 9 phrase exacte */
 function(p){var s=Math.min(1.4,W/420);b4atp(W*.14,H*.45,3,s,'',true);A(W*.3,H*.45,W*.1,0,ORANGE,'',3);TB('ATP → ADP + Pi',W*.2,H*.28,ORANGE,13);
  b4box(W*.62,H*.2,W*.34,H*.16,GREEN,'#fff',2);TB('synthèse de protéines',W*.62,H*.2+5,DGREEN,13);b4box(W*.62,H*.45,W*.34,H*.16,GREEN,'#fff',2);TB('contraction musculaire',W*.62,H*.45+5,DGREEN,13);b4box(W*.62,H*.7,W*.34,H*.16,GREEN,'#fff',2);TB('transport actif',W*.62,H*.7+5,DGREEN,13);
  [.2,.45,.7].forEach(function(y){A(W*.4,H*.45,W*.04,(y-.45)*H*.9,ORANGE,'',2.2);});
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=VIOLET;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.14,H*.62);ctx.lineTo(W*.14,H*.82);ctx.lineTo(W*.4,H*.82);ctx.stroke();TB('régénéré à partir d\'ADP + Pi',W*.28,H*.93,VIOLET,14);b4al(1);b4ans(p,'phrase 3 : l\'ATP transfère l\'énergie',GREEN,H-14);}}
]);
