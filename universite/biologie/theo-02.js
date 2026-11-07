/* Biologie BA1 · chapitre 2 : théorie animée et devantures */
function b2_mito(x,y,w,h,lab){ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,h/2);ctx.fill();ctx.stroke();
 ctx.strokeStyle='#e8a98f';ctx.lineWidth=1.6;ctx.beginPath();ctx.roundRect(x-w/2+5,y-h/2+5,w-10,h-10,(h-10)/2);ctx.stroke();
 ctx.strokeStyle=ORA2;ctx.lineWidth=1.4;ctx.beginPath();for(var i=1;i<5;i++){var cx=x-w/2+i*w/5;var up=i%2;ctx.moveTo(cx,up?y-h/2+5:y+h/2-5);ctx.lineTo(cx,up?y+h*.12:y-h*.12);}ctx.stroke();if(lab)TB(lab,x,y+h/2+16,DRED,12);}
function b2_tube(x,y,w,h,fill){ctx.fillStyle=fill||'#eef4fb';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x-w/2,y+h-w/2);ctx.arc(x,y+h-w/2,w/2,PI,0,true);ctx.lineTo(x+w/2,y);ctx.fill();ctx.stroke();}

SFA.theo("c02",{
 icon:function(){bio_cell(W*.2,H*.45,34,GREEN,'#f2fbf7');DOT(W*.2,H*.45,10,'#fdece4');
  TB('S/V = 3/r',W*.62,H*.42,BLUE_D,32);TB('d = 0,61 λ / NA',W*.62,H*.64,ORANGE,18);TB('organites · microscopie',W*.5,H*.9,GREY,14);},
 anim:function(t){
  var r=1+4*(0.5+0.5*Math.sin(t*.015)),cx=W*.2,cy=H*.52,k=34;
  TB('Plus la cellule grandit, plus S/V diminue',W*.5,24,BLUE_D,15);
  bio_cell(cx,cy,r*k*.7,GREEN,'#f2fbf7');DOT(cx,cy,r*k*.18,'#fdece4');
  TB('r = '+r.toFixed(1).replace('.',',')+' µm',cx,H*.9,DGREEN,14);
  var x0=W*.46,y0=H*.8,w=W*.46,h=H*.56;var sx=function(v){return x0+(v-.5)/(5.5-.5)*w;},sy=function(v){return y0-v/3*h;};
  bio_ax(x0,y0,w,h,'r (µm)','S/V (µm⁻¹)');
  [1,2,3,4,5].forEach(function(v){TB(String(v),sx(v),y0+15,GREY,11);});[1,2,3].forEach(function(v){TB(String(v),x0-12,sy(v)+4,GREY,11);});
  bio_fn(function(x){return 3/x;},.5,5.5,sx,sy,BLUE,2.6);
  var sv=3/r;DOT(sx(r),sy(sv),7,RED);LN(sx(r),sy(sv),sx(r),y0,RED,1.2,[3,3]);LN(sx(r),sy(sv),x0,sy(sv),RED,1.2,[3,3]);
  TB('S/V = 3/r = '+sv.toFixed(2).replace('.',','),sx(r)+10,sy(sv)-12,DRED,13,'left');},
 th:'<div class="tcard"><b class="h">Échelles et grossissement</b><p>Bactérie : 1 à 5 µm ; cellule eucaryote : 10 à 100 µm ; mitochondrie : 0,5 à 1 µm ; ribosome : 25 nm. <b>1 µm = 10<sup>3</sup> nm = 10<sup>−6</sup> m.</b></p><p><b>Grossissement</b> G = taille sur l\'image / taille réelle. Avec une barre d\'échelle : G = (longueur de la barre sur l\'image) / (valeur de la barre). Exemple : barre de 500 nm mesurant 25 mm → G = 25 mm / 500 nm = 50 000 ; un objet de 40 mm sur l\'image mesure 40 / 50 000 mm = 800 nm. Convertir <b>toujours</b> dans la même unité avant de diviser.</p></div><div class="tcard"><b class="h">Résolution : ce que le grossissement ne change pas</b><p>La <b>limite de résolution</b> d = 0,61·λ / NA (λ longueur d\'onde, NA ouverture numérique de l\'objectif) est la plus petite distance entre deux points encore séparés. En lumière verte (550 nm) avec NA = 1,4 : d ≈ 240 nm. Une mitochondrie (0,5 µm) se voit, pas un ribosome (25 nm) : il faut le microscope électronique.</p><p><b>Pièges</b> : agrandir l\'image n\'améliore pas d (grossissement vide) ; une lumière plus courte (bleu) ou une NA plus grande diminue d ; formule avec λ au numérateur et NA au dénominateur.</p></div><div class="tcard"><b class="h">Surface, volume et taille des cellules</b><p>Sphère de rayon r : S = 4πr², V = (4/3)πr³, donc <b>S/V = 3/r</b>. Si r double, S/V est divisé par 2 : un grand volume est mal alimenté par sa surface. Pour doubler le volume, r est multiplié par ∛2 ≈ 1,26.</p><p>Les cellules contournent la limite : division (qui restaure S/V), forme aplatie ou allongée, <b>microvillosités</b> (entérocyte : surface apicale × 20), replis membranaires. Exemple : r = 5 µm → S = 314 µm², V = 524 µm³, S/V = 0,60 µm<sup>−1</sup>.</p></div><div class="tcard"><b class="h">Organites, endosymbiose et voie de sécrétion</b><p><b>Endosymbiose</b> : les mitochondries (et les chloroplastes) descendent de bactéries incorporées. Preuves : double membrane, ADN circulaire sans histones, ribosomes de type bactérien (70S), division par scission. Le noyau a une enveloppe double à pores et un ADN linéaire.</p><p><b>Voie de sécrétion</b> : ribosomes du RE rugueux → lumière du RE → vésicules → Golgi (maturation, étiquette mannose-6-phosphate pour les enzymes lysosomales) → vésicules de sécrétion → exocytose. Bloquer RE → Golgi (brefeldine A) retient la protéine dans le RE.</p></div><div class="tcard"><b class="h">Centrifugation différentielle</b><p>On centrifuge l\'homogénat à vitesse croissante : le culot de chaque étape contient les particules les plus lourdes restantes. Ordre habituel : <b>noyaux et débris</b> (≈ 1 000 g) → <b>mitochondries, lysosomes, peroxysomes</b> (≈ 15 000 g) → <b>microsomes</b> (RE, Golgi fragmentés ; ≈ 100 000 g) → <b>ribosomes</b> (plus fort) → <b>cytosol</b> dans le surnageant final.</p><p>Vitesse de Stokes : v = 2r²(ρ<sub>p</sub> − ρ<sub>m</sub>)·a / (9η) : elle croît comme r² et comme l\'accélération a. Passer de 1 000 g à 10 000 g divise le temps par 10. Un <b>enzyme marqueur</b> repère l\'organite ; l\'enrichissement = % d\'activité / % de protéine.</p></div>'
});
SFA.figs("c02",[
 function(p){ /* 0 taille réelle */
  bio_cap('Micrographie · grossissement × 7 000',22);
  ctx.fillStyle='#f4f5f7';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.fillRect(W*.1,48,W*.8,H*.5);ctx.strokeRect(W*.1,48,W*.8,H*.5);
  ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;ctx.beginPath();ctx.ellipse(W*.5,48+H*.25,W*.3,H*.2,0,0,7);ctx.fill();ctx.stroke();DOT(W*.5,48+H*.25,W*.07,'#fdece4');
  LN(W*.2,H*.74,W*.8,H*.74,RED,3);LN(W*.2,H*.74-6,W*.2,H*.74+6,RED,3);LN(W*.8,H*.74-6,W*.8,H*.74+6,RED,3);TB('35 mm sur l\'image',W*.5,H*.74+22,DRED,14);
  bio_pop(p,function(){TB('35 mm ÷ 7 000 = 0,005 mm = 5 µm',W*.5,H*.93,DGREEN,16);});},
 function(p){ /* 1 S/V sphère */
  bio_cap('Cellule sphérique · r = 5 µm',22);
  var cx=W*.28,cy=H*.54,r=H*.3;bio_cell(cx,cy,r,GREEN,'#f2fbf7');LN(cx,cy,cx+r,cy,RED,2.4);TB('r = 5 µm',cx+r/2,cy-8,DRED,14);
  TB('S = 4πr²',W*.52,H*.32,BLUE_D,16,'left');TB('V = 4πr³/3',W*.52,H*.5,ORA2,16,'left');TB('S/V = 3/r',W*.52,H*.68,INK,16,'left');
  bio_pop(p,function(){TB('≈ 314 µm²',W*.97,H*.32,DGREEN,15,'right');TB('≈ 524 µm³',W*.97,H*.5,DGREEN,15,'right');TB('0,60 µm⁻¹',W*.97,H*.68,DGREEN,15,'right');});},
 function(p){ /* 2 endosymbiose */
  bio_cap('Mitochondrie : une bactérie devenue organite',22);
  b2_mito(W*.5,H*.5,W*.56,H*.46,'');
  ctx.strokeStyle=BLUE;ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(W*.5,H*.58,16,0,7);ctx.stroke();TB('ADN circulaire',W*.5,H*.58+38,BLUE_D,13);
  for(var i=0;i<4;i++)DOT(W*.34+i*14,H*.42,3,VIOLET);TB('ribosomes 70S',W*.3,H*.34,VIO_D,12);
  TB('double membrane',W*.84,H*.4,DRED,13);LN(W*.78,H*.43,W*.76,H*.48,DRED,1.4);
  bio_pop(p,function(){TB('ancêtre : α-protéobactérie',W*.5,H*.9,DGREEN,15);});},
 function(p){ /* 3 résolution : échelle log */
  bio_cap('Résolution d = 0,61 · 550 / 1,4',22);
  var x0=W*.06,x1=W*.94,y=H*.55;var X=function(nm){return x0+(Math.log(nm)/Math.LN10-1)/(5-1)*(x1-x0);};
  LN(x0,y,x1,y,INK,2);[10,100,1000,10000,100000].forEach(function(v){LN(X(v),y-5,X(v),y+5,INK,1.5);TB(v>=1000?(v/1000)+' µm':v+' nm',X(v),y+22,GREY,12);});
  DOT(X(25),y-26,7,VIOLET);TB('ribosome 25 nm',X(25),y-44,VIO_D,12);DOT(X(500),y-26,9,ORA2);TB('mitochondrie 0,5 µm',X(500)+34,y-44,DRED,12);
  bio_pop(p,function(){LN(X(240),y-70,X(240),y+8,RED,2.5);TB('d ≈ 240 nm',X(240),y-78,DRED,15);ctx.fillStyle='rgba(226,75,74,.12)';ctx.fillRect(x0,y-70,X(240)-x0,78);TB('invisible',X(40),y+50,DRED,14);TB('visible',X(3000),y+50,DGREEN,14);});},
 function(p){ /* 4 barre d'échelle */
  bio_cap('Micrographie électronique',22);
  ctx.fillStyle='#e9ebee';ctx.fillRect(W*.06,40,W*.88,H*.62);
  b2_mito(W*.5,40+H*.31,W*.62,H*.3,'');
  LN(W*.5-W*.31,40+H*.31+H*.22,W*.5+W*.31,40+H*.31+H*.22,BLUE_D,2);TB('40 mm',W*.5,40+H*.31+H*.22+16,BLUE_D,13);
  LN(W*.1,H*.82,W*.1+W*.22,H*.82,INK,4);TB('500 nm = 25 mm',W*.21,H*.82+20,INK,13);
  bio_pop(p,function(){TB('G = 25 mm / 500 nm = × 50 000',W*.7,H*.86,DGREEN,14);TB('40 mm → 800 nm',W*.7,H*.95,DRED,15);});},
 function(p){ /* 5 centrifugation différentielle */
  bio_cap('Centrifugation différentielle',22);
  b2_tube(W*.16,60,40,150,'#fdf5e6');ctx.fillStyle='#d9b26a';ctx.beginPath();ctx.arc(W*.16,60+150-20,20,0,PI);ctx.fill();TB('1 000 g · 10 min',W*.16,H*.95,GREY,12);TB('noyaux',W*.16,H*.84,DRED,12);
  LN(W*.25,130,W*.37,130,INK,2.5);TB('surnageant',W*.31,118,GREY,11);
  b2_tube(W*.46,60,40,150,'#fdf5e6');ctx.fillStyle=p>0?ORA2:'#c98a6a';ctx.beginPath();ctx.arc(W*.46,60+150-20,20,0,PI);ctx.fill();TB('15 000 g · 20 min',W*.46,H*.95,GREY,12);
  LN(W*.55,130,W*.65,130,INK,2.5);
  b2_tube(W*.74,60,40,150,'#fdf5e6');ctx.fillStyle='#9ab';ctx.beginPath();ctx.arc(W*.74,60+150-14,20,0,PI);ctx.fill();TB('100 000 g',W*.74,H*.95,GREY,12);
  bio_pop(p,function(){TB('mitochondries,',W*.46,H*.84,DRED,12);TB('lysosomes, peroxysomes',W*.46,H*.84+14,DRED,11);TB('microsomes',W*.74,H*.84,GREY,12);});},
 function(p){ /* 6 Stokes */
  bio_cap('Sédimentation d\'une mitochondrie à 10 000 g',22);
  b2_tube(W*.25,46,60,H*.7,'#f3f8fd');
  var y=p>0?46+H*.62:46+14;b2_mito(W*.25,y-0,24,14,'');LN(W*.25+50,46+14,W*.25+50,46+H*.62,BLUE,2.2);A(W*.25+50,46+H*.5,0,26,BLUE,'',2.4);TB('6 cm',W*.25+78,46+H*.3,BLUE_D,13);
  TB('v = 2r²(ρp − ρm)·a / (9η)',W*.7,H*.3,INK,15);TB('r = 0,4 µm · Δρ = 160 kg/m³',W*.7,H*.42,GREY,13);
  bio_pop(p,function(){TB('v ≈ 2,8·10⁻⁴ m/s',W*.7,H*.58,DGREEN,16);TB('t = 0,06 / v ≈ 3,6 min',W*.7,H*.7,DGREEN,16);TB('(36 min à 1 000 g)',W*.7,H*.82,DRED,14);});},
 function(p){ /* 7 microvillosités */
  bio_cap('Entérocyte · face apicale × 20',22);
  var x=W*.3,y=H*.42,w=W*.4,h=H*.34;ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);
  for(var i=0;i<=14;i++){var xx=x+i*w/14;LN(xx,y,xx,y-34,p>0?GREEN:AX,p>0?3:1.5);}
  TB('face apicale',W*.5,y-44,p>0?DGREEN:GREY,13);DOT(W*.5,y+h*.55,12,'#fdece4');TB('10 µm',x+w+8,y+h/2,GREY,12,'left');
  bio_pop(p,function(){TB('S = 5 × 100 + 20 × 100 = 2 500 µm²',W*.5,H*.86,DGREEN,14);TB('S/V = 2,5 µm⁻¹ (0,60 sans villosités)',W*.5,H*.95,DRED,14);});
  if(p<=0)TB('S/V = 600 / 1 000 = 0,60 µm⁻¹',W*.5,H*.9,INK,14);},
 function(p){ /* 8 brefeldine */
  bio_cap('Sécrétion bloquée entre RE et Golgi',22);
  var y=H*.5;ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.06,y-40,W*.26,80,14);ctx.fill();ctx.stroke();TB('RE',W*.19,y-48,BLUE_D,13);
  for(var i=0;i<4;i++){ctx.strokeStyle=GREY;ctx.beginPath();ctx.moveTo(W*.54,y-34+i*18);ctx.quadraticCurveTo(W*.64,y-40+i*18,W*.74,y-34+i*18);ctx.stroke();}TB('Golgi',W*.64,y-50,GREY,13);
  DOT(W*.9,y,10,'#faeeda');TB('exocytose',W*.9,y+30,GREY,12);
  LN(W*.33,y,W*.53,y,GREEN,3);LN(W*.74,y,W*.84,y,GREEN,3);
  ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(W*.4,y-22);ctx.lineTo(W*.46,y+22);ctx.moveTo(W*.46,y-22);ctx.lineTo(W*.4,y+22);ctx.stroke();TB('brefeldine A',W*.43,y+46,DRED,13);
  var n=p>0?9:3;for(var j=0;j<n;j++){DOT(W*.1+(j%3)*30+8,y-16+Math.floor(j/3)*22,5,ORANGE);}
  bio_pop(p,function(){TB('l\'hormone s\'accumule dans le RE',W*.5,H*.88,DRED,15);});
  if(p<=0)TB('où s\'accumule l\'hormone ?',W*.5,H*.88,GREY,15);},
 function(p){ /* 9 croissance et S/V */
  bio_cap('Croissance puis division',22);
  var y=H*.5;bio_cell(W*.12,y,36,GREEN,'#f2fbf7');TB('r = 8 µm',W*.12,y+60,INK,12);TB('S/V = 0,375',W*.12,y+78,DGREEN,12);
  A(W*.12+44,y,34,0,GREY,'',2);bio_cell(W*.4,y,45.4,ORANGE,'#fbf3e4');TB('V × 2 : r = 10,1 µm',W*.4,y+68,INK,12);
  bio_pop(p,function(){TB('S/V ≈ 0,298',W*.4,y+86,DRED,13);A(W*.4+54,y,34,0,GREY,'',2);bio_cell(W*.7,y-38,32,GREEN,'#f2fbf7');bio_cell(W*.7,y+38,32,GREEN,'#f2fbf7');TB('chaque fille',W*.7+40,y-6,DGREEN,12,'left');TB('S/V = 0,375',W*.7+40,y+12,DGREEN,12,'left');});
  if(p<=0)TB('après la division ?',W*.8,y,GREY,13);},
 function(p){ /* 10 enzymes lysosomales */
  bio_cap('Activité d\'une hydrolase lysosomale (% )',22);
  function bar(x,a,b,lab){var h=H*.46,y0=H*.76;ctx.fillStyle='#e1f5ee';ctx.fillRect(x,y0-h*a/100,50,h*a/100);ctx.fillStyle='#fdece4';ctx.fillRect(x+54,y0-h*b/100,50,h*b/100);ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.strokeRect(x,y0-h*a/100,50,h*a/100);ctx.strokeRect(x+54,y0-h*b/100,50,h*b/100);TB(a+'',x+25,y0-h*a/100-5,DGREEN,12);TB(b+'',x+79,y0-h*b/100-5,DRED,12);TB(lab,x+52,y0+17,INK,13);TB('cellules',x+25,y0+32,GREY,11);TB('milieu',x+79,y0+32,GREY,11);}
  bar(W*.08,95,5,'sain');bar(W*.55,10,90,'patient');
  bio_pop(p,function(){TB('étiquette M6P absente : enzymes sécrétées par défaut',W*.5,H*.2+4,DRED,13);TB('rapport milieu/cellules : 0,053 → 9,0',W*.5,H*.97,INK,12);});},
 function(p){ /* 11 pièges microscopie */
  bio_cap('Deux structures distantes de 100 nm · d = 244 nm',22);
  var cy=H*.52,s=2.2;/* 1 nm = 2,2 px / 1,2 */
  var k=W*.9/420;var c1=W*.5-50*k,c2=W*.5+50*k;
  var g=ctx.createRadialGradient(W*.5,cy,4,W*.5,cy,122*k+20);g.addColorStop(0,'rgba(55,138,221,.5)');g.addColorStop(1,'rgba(55,138,221,0)');ctx.fillStyle=g;ctx.fillRect(W*.1,cy-110,W*.8,220);
  DOT(c1,cy,6,RED);DOT(c2,cy,6,RED);LN(c1,cy+26,c2,cy+26,INK,2);TB('100 nm',W*.5,cy+44,INK,13);
  bio_pop(p,function(){LN(W*.5-122*k,cy-66,W*.5+122*k,cy-66,DGREEN,2.6);TB('d = 0,61 × 500 / 1,25 = 244 nm',W*.5,cy-78,DGREEN,14);TB('100 nm < 244 nm : confondues',W*.5,H*.93,DRED,15);});},
 function(p){ /* 12 taille maximale */
  bio_cap('Approvisionnement / consommation = 3PΔC / (q·r)',22);
  var x0=W*.14,y0=H*.8,w=W*.78,h=H*.58,l0=Math.log(.7)/Math.LN10,l1=2;var sx=function(v){return x0+(Math.log(v)/Math.LN10-l0)/(l1-l0)*w;},sy=function(v){return y0-(Math.log(v)/Math.LN10+.5)/(2.2)*h;};
  bio_ax(x0,y0,w,h,'r (µm), échelle log','rapport (log)');
  [1,10,100].forEach(function(v){TB(''+v,sx(v),y0+15,GREY,11);});[1,10,50].forEach(function(v){TB(''+v,x0-12,sy(v)+4,GREY,11);});
  bio_fn(function(x){return 50/x;},.8,100,sx,sy,BLUE,2.6,60);
  LN(x0,sy(1),x0+w,sy(1),RED,1.6,[5,4]);TB('rapport = 1',x0+6,sy(1)-6,DRED,12,'left');
  bio_pop(p,function(){[[1,50],[12,50/12],[60,50/60]].forEach(function(q){DOT(sx(q[0]),sy(q[1]),6,q[1]<1?RED:GREEN);});TB('bactérie : 50',sx(1)+10,sy(50)+14,DGREEN,12,'left');TB('hépatocyte : 4,2',sx(12)+10,sy(50/12)-8,DGREEN,12,'left');TB('ovocyte : 0,83',sx(60)+8,sy(50/60)+20,DRED,12);LN(sx(50),y0,sx(50),sy(1),DRED,1.4,[3,3]);TB('rmax = 50 µm',sx(50)-6,y0-14,DRED,13,'right');});},
 function(p){ /* 13 enzymes marqueurs */
  bio_cap('Culot 15 000 g : 12 % de la protéine',22);
  var data=[['cyt c oxydase',72,DRED],['catalase',35,ORANGE],['G6Pase',15,BLUE],['LDH',4,GREY]];
  var y0=H*.8,h=H*.55;LN(W*.08,y0,W*.95,y0,INK,1.6);
  LN(W*.08,y0-12/100*h,W*.95,y0-12/100*h,GREEN,1.6,[5,4]);TB('- - -  12 % de la protéine : seuil d\'enrichissement',W*.5,44,DGREEN,12);
  data.forEach(function(d,i){var x=W*.12+i*W*.22,bh=d[1]/100*h;ctx.fillStyle=d[2]===GREY?'#e3e6ea':(d[2]===DRED?'#fdece4':(d[2]===ORANGE?'#faeeda':'#e6f1fb'));ctx.fillRect(x,y0-bh,56,bh);ctx.strokeStyle=d[2];ctx.lineWidth=2;ctx.strokeRect(x,y0-bh,56,bh);TB(d[1]+' %',x+28,y0-bh-6,dk(d[2]),13);TB(d[0],x+28,y0+16,INK,11);
   bio_pop(p,function(){TB('× '+(d[1]/12).toFixed(2).replace('.',',').replace(/,00$/,''),x+28,y0-bh-22,dk(d[2]),14);});});
  if(p<=0)TB('activité / protéine = enrichissement',W*.5,H*.94,GREY,13);},
]);
