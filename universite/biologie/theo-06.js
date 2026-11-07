/* Biologie BA1 · chapitre 6 : théorie animée et devantures */
function b6_mitoframe(x,y,w,h){ctx.fillStyle='#fdf3ee';ctx.strokeStyle=ORA2;ctx.lineWidth=2.6;ctx.beginPath();ctx.roundRect(x,y,w,h,h*.4);ctx.fill();ctx.stroke();ctx.fillStyle='#fff7f3';ctx.strokeStyle='#e8a98f';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x+h*.14,y+h*.14,w-h*.28,h-h*.28,h*.28);ctx.fill();ctx.stroke();}
function b6_c6(x,y,s,cols,lab){for(var i=0;i<6;i++){DOT(x+i*s*1.15,y,s*.5,cols?cols[i]:'#fdece4');ctx.strokeStyle=ORA2;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+i*s*1.15,y,s*.5,0,7);ctx.stroke();TB(String(i+1),x+i*s*1.15,y+s*.17,DRED,s*.45);}if(lab)TB(lab,x+2.5*s*1.15,y-s*.9,INK,13);}
function b6_cplx(x,y,w,h,col,lab){ctx.fillStyle='#eef4fb';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,6);ctx.fill();ctx.stroke();TB(lab,x,y+4,dk(col),12);}
function b6_synth(x,y,rot){ctx.fillStyle='#eeedfe';ctx.strokeStyle=VIOLET;ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(x-14,y-14,28,28,5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y+34,22,PI,0);ctx.fill();ctx.stroke();ctx.strokeStyle=VIO_D;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y+14);ctx.lineTo(x+Math.cos(rot)*10,y+34+Math.sin(rot)*10);ctx.stroke();TB('F₀',x,y+4,VIO_D,11);TB('F₁',x,y+46,VIO_D,11);}

SFA.theo("c06",{
 icon:function(){b6_mitoframe(W*.14,H*.14,W*.72,H*.48);LN(W*.2,H*.38,W*.8,H*.38,ORA2,2);
  TB('glucose → 32 ATP',W*.5,H*.8,BLUE_D,24);TB('Δp · chimiosmose · glycolyse',W*.5,H*.95,ORANGE,14);},
 sub:[
 {t:"Chimiosmose et phosphorylation oxydative",
  anim:function(t){
   var ym=H*.5,mh=18;TB('Chimiosmose : les électrons pompent les H⁺, les H⁺ font tourner l\'ATP synthase',W*.5,20,BLUE_D,13);
   ctx.fillStyle='rgba(226,75,74,.07)';ctx.fillRect(W*.04,ym-mh-80,W*.92,80);ctx.fillStyle='rgba(55,138,221,.07)';ctx.fillRect(W*.04,ym+mh,W*.92,80);
   TB('espace intermembranaire (H⁺ nombreux, pH 7,2)',W*.06,ym-mh-66,DRED,12,'left');TB('matrice (pH 7,8)',W*.06,ym+mh+72,BLUE_D,12,'left');
   ctx.fillStyle='#faeeda';ctx.fillRect(W*.04,ym-mh/2,W*.92,mh);ctx.strokeStyle=ORANGE;ctx.lineWidth=1.8;ctx.strokeRect(W*.04,ym-mh/2,W*.92,mh);
   var cx=[W*.2,W*.36,W*.52],labs=['I','III','IV'];cx.forEach(function(x,i){b6_cplx(x,ym,40,mh+22,BLUE,labs[i]);
    for(var k=0;k<3;k++){var ph=((t*.011+k/3+i*.2)%1);var yy=ym+mh/2+10-ph*(mh+60);ctx.globalAlpha=ph<.1||ph>.9?.4:1;DOT(x+(k-1)*9,yy,4,RED);ctx.globalAlpha=1;}});
   LN(W*.1,ym+4,W*.6,ym+4,ORA2,1.5,[3,3]);var ep=((t*.012)%1);DOT(W*.1+ep*W*.5,ym+4,4,ORA2);TB('e⁻',W*.1+ep*W*.5,ym-5,DRED,10);
   TB('NADH',W*.1,ym+mh+20,GREEN,11);TB('O₂ → H₂O',W*.6,ym+mh+20,DGREEN,11);
   var sx=W*.8;b6_synth(sx,ym-8,t*.08);for(var k=0;k<3;k++){var ph2=((t*.01+k/3)%1);DOT(sx-6+k*6,ym-mh-70+ph2*(mh+85),4,RED);}
   var n=Math.floor(t*.012)%99;TB('ATP synthase',sx,ym+mh+55,VIO_D,12);TB('ADP + Pi → ATP',sx,ym+mh+72,VIO_D,12);
   TB('Δp = ΔΨ + 61,5·ΔpH = 160 + 61,5·0,6 ≈ 197 mV',W*.5,H*.97,INK,13);},
  th:'<div class="tcard"><b class="h">Chaîne respiratoire et force protonmotrice</b><p>NADH et FADH<sub>2</sub> cèdent leurs électrons aux complexes de la membrane interne ; leur passage jusqu\'à l\'O<sub>2</sub> (accepteur final, réduit en H<sub>2</sub>O par le complexe IV) fait <b>pomper des H<sup>+</sup></b> de la matrice vers l\'espace intermembranaire. Il en résulte la <b>force protonmotrice</b> : <b>Δp = ΔΨ + 61,5·ΔpH</b> (mV, à 37 °C ; ΔΨ en valeur absolue). Exemple : ΔΨ = 160 mV, pH 7,8 (matrice) et 7,2 : Δp = 160 + 61,5 × 0,6 = <b>197 mV</b>.</p><p>Les H<sup>+</sup> reviennent par l\'<b>ATP synthase</b> (F<sub>0</sub>F<sub>1</sub>, dans la membrane interne), dont le rotor fabrique l\'ATP. Énergie par ATP : n·F·Δp = 3,7 × 96,485 × 0,197 ≈ 70 kJ/mol, supérieure aux 55 kJ/mol nécessaires : la synthèse est possible.</p></div><div class="tcard"><b class="h">Perturber le système</b><ul><li><b>Cyanure</b> (inhibe le complexe IV) : plus de flux d\'électrons, plus de pompage, Δp s\'effondre, la consommation d\'O<sub>2</sub> cesse, NADH s\'accumule, l\'ATP chute ; la glycolyse (fermentation) survit un temps.</li><li><b>Découplant</b> (DNP, UCP1) : les H<sup>+</sup> fuient sans passer par l\'ATP synthase ; Δp baisse, la chaîne s\'emballe (<b>plus d\'O<sub>2</sub> consommé</b>), moins d\'ATP, plus de chaleur. UCP1 dans le tissu adipeux brun : thermogenèse.</li><li><b>Inhibiteur de l\'ATP synthase</b> (oligomycine) : Δp augmente, la chaîne ralentit.</li></ul><p><b>Rendement</b> : 32 ATP × 50 kJ/mol (ΔG réel de synthèse) ≈ 1 600 kJ sur 2 870 kJ libérés (≈ 56 %) ; avec la valeur standard 30,5 kJ/mol on trouverait 34 %, valeur moins réaliste.</p></div>'},
 {t:"Bilan du glucose, fermentation, régulation",
  anim:function(t){
   var st=Math.min(4,Math.floor((t%520)/100)),k=((t%520)%100)/100;
   TB('Bilan de l\'oxydation complète d\'un glucose',W*.5,20,BLUE_D,14);
   var rows=[['Glycolyse (cytosol)','+2 ATP · 2 NADH',BLUE],['Pyruvate → acétyl-CoA (×2)','2 NADH · 2 CO₂',GREEN],['Cycle de Krebs (2 tours)','2 ATP · 6 NADH · 2 FADH₂ · 4 CO₂',ORANGE],['Chaîne respiratoire','10 NADH × 2,5 + 2 FADH₂ × 1,5 = 28',VIOLET]];
   rows.forEach(function(r,i){var on=st>i;var y=54+i*38;ctx.globalAlpha=on?1:.22;bio_rb(W*.22,y,W*.38,28,r[2],r[0],11);TB(r[1],W*.44,y+4,dk(r[2]),12,'left');ctx.globalAlpha=1;});
   var tot=[0,2,2,4,32][st];var bx=W*.12,bw=W*.76,by=H*.8;ctx.fillStyle='#eceef1';ctx.fillRect(bx,by,bw,18);var cur=[0,2,2,4,32][Math.max(0,st-1)];var shown=cur+(tot-cur)*Math.min(1,k*1.6);ctx.fillStyle=GREEN;ctx.fillRect(bx,by,bw*shown/32,18);
   TB('ATP formés : '+shown.toFixed(0),W*.5,by+36,DGREEN,15);TB('total 32 ATP (malate-aspartate) ou 30 (glycérol-phosphate)',W*.5,by+56,GREY,12);},
  th:'<div class="tcard"><b class="h">Bilan par glucose</b><p><b>Glycolyse</b> (cytosol) : glucose (C<sub>6</sub>) → 2 pyruvates (C<sub>3</sub>), consomme 2 ATP, en forme 4 : <b>net 2 ATP + 2 NADH</b>. <b>Pyruvate déshydrogénase</b> (matrice) : pyruvate → acétyl-CoA + CO<sub>2</sub> + NADH (×2). <b>Cycle de Krebs</b> (par tour : 2 CO<sub>2</sub>, 3 NADH, 1 FADH<sub>2</sub>, 1 GTP/ATP) ×2 tours.</p><p>Total : <b>6 CO<sub>2</sub></b> (2 + 4), 10 NADH, 2 FADH<sub>2</sub>, 4 ATP de substrat. Avec 2,5 ATP/NADH et 1,5 ATP/FADH<sub>2</sub> : 4 + 25 + 3 = <b>32 ATP</b> (navette malate-aspartate) ; avec la navette glycérol-phosphate (les 2 NADH cytosoliques donnent des FADH<sub>2</sub>) : 4 + 20 + 6 = <b>30 ATP</b>. Suivre le carbone : les C3 et C4 du glucose forment le carboxyle du pyruvate, donc le CO<sub>2</sub> de la pyruvate déshydrogénase ; C1 ne l\'est pas.</p></div><div class="tcard"><b class="h">Fermentation</b><p>Sans O<sub>2</sub> (ou sans mitochondrie), le pyruvate est réduit (lactate chez le muscle, éthanol + CO<sub>2</sub> chez la levure) pour <b>régénérer le NAD<sup>+</sup></b> sans lequel la glycéraldéhyde-3-phosphate déshydrogénase, donc la glycolyse, s\'arrête. Bilan : <b>2 ATP par glucose</b> (16 fois moins que la respiration). Ex. : 64 mmol d\'ATP demandent 32 mmol de glucose par fermentation (et 64 mmol de lactate), 2 mmol par respiration. Sprint : 60 % fermentation, 40 % respiration pour 120 mmol d\'ATP : 36 + 1,5 = 37,5 mmol de glucose (6,75 g), 10 fois plus qu\'en aérobie.</p></div><div class="tcard"><b class="h">Photosynthèse et régulation</b><p><b>Photosynthèse</b> : 6 CO<sub>2</sub> + 6 H<sub>2</sub>O → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6 O<sub>2</sub>. Phase lumineuse (thylakoïdes) : l\'eau est oxydée (source de l\'O<sub>2</sub>), production d\'ATP (même principe chimiosmotique) et de NADPH ; cycle de Calvin (stroma) : RuBisCO fixe le CO<sub>2</sub>.</p><p><b>Régulation</b> : à l\'état nourri, l\'<b>insuline</b> favorise la glycolyse, la synthèse de glycogène et de lipides. À jeun, le <b>glucagon</b> déclenche la glycogénolyse hépatique (réserve épuisée en ≈ 24 h), puis la <b>néoglucogenèse</b> (lactate, glycérol, acides aminés ; pas à partir des acides gras) et la production de corps cétoniques (le cerveau en utilise mais garde un besoin de glucose). Le glycogène musculaire, sans glucose-6-phosphatase, ne donne pas de glucose sanguin.</p></div>'}
 ]
});
SFA.figs("c06",[
 function(p){ /* 0 glycolyse */
  bio_cap('Glycolyse : 1 glucose → 2 pyruvates',22);
  b6_c6(W*.12,H*.3,24,null,'glucose (C₆)');
  A(W*.5,H*.42,0,30,GREY,'',2);
  for(var i=0;i<2;i++){for(var j=0;j<3;j++){DOT(W*.3+i*W*.4+j*28,H*.68,11,'#fdece4');ctx.strokeStyle=ORA2;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(W*.3+i*W*.4+j*28,H*.68,11,0,7);ctx.stroke();}TB('pyruvate',W*.3+i*W*.4+28,H*.68+28,DRED,12);}
  TB('− 2 ATP',W*.86,H*.34,DRED,14);TB('+ 4 ATP',W*.86,H*.44,DGREEN,14);TB('+ 2 NADH',W*.86,H*.54,GREEN,14);
  bio_pop(p,function(){TB('net : 2 ATP et 2 NADH',W*.5,H*.92,DGREEN,17);});},
 function(p){ /* 1 décarboxylations */
  bio_cap('Où part le carbone du glucose ?',22);
  b6_c6(W*.1,H*.22,18,null,'');TB('glucose (6 C)',W*.5,H*.22+4,INK,13,'left');
  A(W*.3,H*.3,0,22,GREY,'',2);TB('glycolyse',W*.42,H*.36,GREY,12,'left');
  TB('2 pyruvates',W*.3,H*.5,DRED,13);A(W*.3,H*.54,0,18,GREY,'',2);TB('2 acétyl-CoA',W*.3,H*.78,GREEN,13);TB('2 CO₂ (pyruvate déshydrogénase)',W*.5,H*.62,DGREEN,12,'left');
  A(W*.58,H*.72,40,0,GREY,'',2);TB('Krebs ×2 : 4 CO₂',W*.82,H*.74,ORA2,13);
  bio_pop(p,function(){TB('2 + 4 = 6 CO₂',W*.5,H*.94,DRED,20);});},
 function(p){ /* 2 localisation synthase */
  bio_cap('Où se trouve l\'ATP synthase ?',22);
  b6_mitoframe(W*.16,H*.2,W*.68,H*.6);
  TB('matrice',W*.5,H*.58,GREY,14);TB('membrane externe',W*.84,H*.24,GREY,11,'left');TB('(espace intermembranaire entre les deux membranes)',W*.5,H*.9,GREY,12);
  var xs=[.3,.42,.6,.72];xs.forEach(function(x,i){ctx.fillStyle=p>0?'#eeedfe':'#f6f6f8';ctx.strokeStyle=p>0?VIOLET:GREY;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(W*x-7,H*.2+H*.6*.14-6,14,14,3);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(W*x,H*.2+H*.6*.14+8,10,0,PI);ctx.fill();ctx.stroke();});
  bio_pop(p,function(){TB('F₀F₁ : dans la membrane interne',W*.5,H*.97,VIO_D,15);TB('membrane interne',W*.16,H*.15,DRED,12,'left');});},
 function(p){ /* 3 rendement navettes */
  bio_cap('ATP par glucose selon la navette',22);
  var y0=H*.84,h=H*.6,sc=h/32;
  function stack(x,parts,lab){var yy=y0;parts.forEach(function(q){var hh=q[0]*sc;ctx.fillStyle=q[2];ctx.fillRect(x,yy-hh,80,hh);ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(x,yy-hh,80,hh);TB(q[1],x+40,yy-hh/2+4,'#fff',12);yy-=hh;});TB(lab,x+40,y0+18,INK,13);}
  LN(W*.06,y0,W*.94,y0,INK,1.6);
  stack(W*.14,[[4,'4 substrat',GREY],[25,'10 NADH · 25',GREEN],[3,'3',ORANGE]],'malate-aspartate');
  stack(W*.58,[[4,'4',GREY],[20,'8 NADH · 20',GREEN],[6,'4 FADH₂ · 6',ORANGE]],'glycérol-phosphate');
  bio_pop(p,function(){TB('32 ATP',W*.14+40,y0-32*sc-8,DGREEN,16);TB('30 ATP',W*.58+40,y0-30*sc-8,DRED,16);});},
 function(p){ /* 4 même ATP, autre voie */
  bio_cap('Régénérer 64 mmol d\'ATP',22);
  var y0=H*.82,h=H*.56;LN(W*.06,y0,W*.94,y0,INK,1.6);
  function bar(x,v,c,lab,lab2){var hh=v/32*h;ctx.fillStyle=c;ctx.fillRect(x,y0-hh,70,hh);TB(lab,x+35,y0-hh-6,dk(c),15);TB(lab2,x+35,y0+18,INK,12);}
  bar(W*.12,32,'#fdece4','32 mmol','fermentation lactique');
  bio_pop(p,function(){bar(W*.38,2,'#e1f5ee','2 mmol','respiration');});
  bio_pop(p,function(){TB('lactate : 64 mmol',W*.8,H*.4,DRED,14);TB('(2 par glucose)',W*.8,H*.5,GREY,12);TB('16 fois moins de glucose',W*.5,H*.95,DGREEN,15);});
  TB('glucose consommé',W*.62,H*.2,GREY,13);},
 function(p){ /* 5 DNP */
  bio_cap('Découplant (DNP) : fuite de protons',22);
  var ym=H*.5;ctx.fillStyle='#faeeda';ctx.fillRect(W*.06,ym-8,W*.88,16);ctx.strokeStyle=ORANGE;ctx.lineWidth=1.6;ctx.strokeRect(W*.06,ym-8,W*.88,16);
  b6_cplx(W*.2,ym,34,36,BLUE,'I');b6_cplx(W*.34,ym,34,36,BLUE,'III');b6_cplx(W*.48,ym,34,36,BLUE,'IV');
  for(var i=0;i<3;i++)A(W*.2+i*W*.14,ym-14,0,-40,RED,'',2.4);TB('H⁺ pompés',W*.34,ym-70,DRED,12);
  b6_synth(W*.76,ym-6,0);A(W*.76,ym-60,0,30,GREY,'',2);TB('ATP',W*.76,ym+80,VIO_D,13);
  TB('espace intermembranaire',W*.06,ym-86,GREY,11,'left');TB('matrice',W*.06,ym+86,GREY,11,'left');
  bio_pop(p,function(){ctx.strokeStyle=ORA2;ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(W*.58,ym-40);ctx.quadraticCurveTo(W*.6,ym,W*.58,ym+40);ctx.stroke();ctx.setLineDash([]);A(W*.58,ym+22,0,22,ORA2,'',3);TB('fuite',W*.62,ym-30,DRED,13,'left');TB('Δp ↓ · O₂ consommé ↑ · ATP ↓ · chaleur ↑',W*.5,H*.95,DRED,14);});},
 function(p){ /* 6 force protonmotrice */
  bio_cap('Δp = ΔΨ + 61,5 · ΔpH',22);
  var x0=W*.08,y0=H*.66,sc=W*.5/200;
  ctx.fillStyle='#fdece4';ctx.fillRect(x0,y0-30,160*sc,30);ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.strokeRect(x0,y0-30,160*sc,30);TB('ΔΨ = 160 mV',x0+80*sc,y0-10,DRED,13);
  ctx.fillStyle='#e6f1fb';ctx.fillRect(x0+160*sc,y0-30,37*sc,30);ctx.strokeStyle=BLUE;ctx.strokeRect(x0+160*sc,y0-30,37*sc,30);TB('37',x0+178*sc,y0-10,BLUE_D,12);
  TB('61,5 × 0,6 = 37 mV (pH 7,8 / 7,2)',x0+160*sc,y0+22,BLUE_D,12,'left');
  bio_pop(p,function(){LN(x0,y0-44,x0+197*sc,y0-44,DGREEN,3);TB('Δp ≈ 197 mV',x0+98*sc,y0-52,DGREEN,16);TB('3,7 × 96,485 × 0,197 ≈ 70 kJ/mol',W*.5,H*.84,INK,14);TB('> 55 kJ/mol : suffisant',W*.5,H*.94,DGREEN,16);});},
 function(p){ /* 7 suivre le carbone */
  bio_cap('Glucose marqué au ¹⁴C : le CO₂ de la PDH ?',22);
  var cols=[];for(var i=0;i<6;i++)cols.push(p>0&&(i===2||i===3)?'#f7c1c1':'#fdece4');
  b6_c6(W*.12,H*.3,26,cols,'glucose : C1 à C6');
  A(W*.5,H*.42,0,28,GREY,'',2);
  [[W*.2,'C3 → C1 du pyruvate',2],[W*.6,'C4 → C1 du pyruvate',3]].forEach(function(q,k){DOT(q[0],H*.68,13,'#fdece4');ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.beginPath();ctx.arc(q[0],H*.68,13,0,7);ctx.stroke();TB(k?'C4':'C3',q[0],H*.68+4,DRED,12);TB('carboxyle',q[0],H*.68+30,GREY,12);});
  bio_pop(p,function(){TB('→ CO₂ de la PDH',W*.2,H*.68-26,DRED,13);TB('→ CO₂ de la PDH',W*.6,H*.68-26,DRED,13);TB('(a) C3,C4 : radioactif · (b) C1 : non',W*.5,H*.94,DGREEN,15);});},
 function(p){ /* 8 pourquoi fermenter */
  bio_cap('Le muscle en hypoxie',22);
  bio_rb(W*.18,H*.4,W*.26,40,BLUE,'glucose',13);bio_rb(W*.5,H*.4,W*.2,40,BLUE,'pyruvate',13);bio_rb(W*.82,H*.4,W*.2,40,ORA2,'lactate',13);
  A(W*.3,H*.4,34,0,GREY,'',2);A(W*.61,H*.4,36,0,GREY,'',2);
  TB('NAD⁺ → NADH',W*.34,H*.3,GREEN,12);
  bio_pop(p,function(){ctx.strokeStyle=GREEN;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.74,H*.52);ctx.quadraticCurveTo(W*.5,H*.82,W*.34,H*.52);ctx.stroke();A(W*.34,H*.52,-1,-6,GREEN,'',3);TB('NADH → NAD⁺ (LDH)',W*.55,H*.8,DGREEN,14);TB('rôle : régénérer le NAD⁺, pas fabriquer de l\'ATP',W*.5,H*.95,DGREEN,13);});},
 function(p){ /* 9 sprint */
  bio_cap('120 mmol d\'ATP : 60 % fermentation · 40 % respiration',22);
  var x0=W*.1,w=W*.8,y=H*.4;ctx.fillStyle='#fdece4';ctx.fillRect(x0,y,w*.6,38);ctx.fillStyle='#e1f5ee';ctx.fillRect(x0+w*.6,y,w*.4,38);ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.strokeRect(x0,y,w,38);
  TB('72 mmol ATP',x0+w*.3,y+24,DRED,14);TB('48 mmol',x0+w*.8,y+24,DGREEN,14);
  bio_pop(p,function(){TB('72 / 2 = 36 mmol',x0+w*.3,y+66,DRED,14);TB('48 / 32 = 1,5 mmol',x0+w*.8,y+66,DGREEN,13);TB('total : 37,5 mmol = 6,75 g de glucose',W*.5,H*.74,INK,16);TB('lactate : 72 mmol · 10 fois plus de glucose qu\'en aérobie',W*.5,H*.88,DRED,13);});},
 function(p){ /* 10 cyanure */
  bio_cap('Cyanure : blocage du complexe IV',22);
  var y=H*.5;['NADH','I','Q','III','c','IV','O₂'].forEach(function(l,i){var x=W*.08+i*W*.135;var c=l==='IV'?RED:BLUE;bio_rb(x,y,W*.11,34,c,l,12);if(i<6)A(x+W*.058,y,W*.02,0,l==='IV'?GREY:GREY,'',2);});
  ctx.strokeStyle=RED;ctx.lineWidth=5;var x=W*.08+5*W*.135;ctx.beginPath();ctx.moveTo(x-W*.07,y-28);ctx.lineTo(x+W*.07,y+28);ctx.moveTo(x+W*.07,y-28);ctx.lineTo(x-W*.07,y+28);ctx.stroke();TB('CN⁻',x,y-44,DRED,14);
  bio_pop(p,function(){TB('Δp s\'effondre',W*.3,H*.76,DRED,14);TB('NADH s\'accumule',W*.3,H*.86,DRED,14);TB('O₂ non consommé · ATP ↓',W*.7,H*.76,DRED,14);TB('lactate ↑ (glycolyse seule)',W*.7,H*.86,DRED,14);});},
 function(p){ /* 11 jeûne 36 h */
  bio_cap('Source du glucose sanguin à jeun',22);
  var x0=W*.1,y0=H*.8,w=W*.82,h=H*.56;bio_ax(x0,y0,w,h,'t (h)','contribution');
  [0,12,24,36,48].forEach(function(v){TB(''+v,x0+v/48*w,y0+15,GREY,11);});
  var X=function(v){return x0+v/48*w;};
  bio_fn(function(t){return .95*Math.exp(-t/16);},0,48,X,function(v){return y0-v*h;},BLUE,2.8);TB('glycogénolyse hépatique',X(2),y0-h*.92,BLUE_D,12,'left');
  bio_fn(function(t){return .05+.7*(1-Math.exp(-t/16));},0,48,X,function(v){return y0-v*h;},RED,2.8);TB('néoglucogenèse',X(30),y0-h*.76-8,DRED,12,'left');
  LN(X(36),y0,X(36),y0-h,GREY,1.4,[4,4]);
  bio_pop(p,function(){TB('36 h : néoglucogenèse dominante',X(36),y0-h-6,DGREEN,13);TB('(lactate, glycérol, acides aminés)',W*.6,H*.9,DGREEN,12);});},
 function(p){ /* 12 rendement */
  bio_cap('Glucose : 2 870 kJ libérés · 32 ATP',22);
  var x0=W*.12,w=W*.76,y=H*.34;ctx.fillStyle='#eceef1';ctx.fillRect(x0,y,w,34);ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.strokeRect(x0,y,w,34);TB('2 870 kJ/mol',x0+w/2,y+22,INK,14);
  function seg(yy,e,lab,c){ctx.fillStyle=c;ctx.fillRect(x0,yy,w*e/2870,34);ctx.strokeRect(x0,yy,w,34);TB(lab,e>1000?x0+8:x0+w*e/2870+8,yy+22,INK,13,'left');}
  seg(y+54,976,'32 × 30,5 = 976 kJ (34 %)','#e6f1fb');
  bio_pop(p,function(){seg(y+108,1600,'32 × 50 = 1 600 kJ (56 %)','#e1f5ee');TB('valeur réaliste : 50 kJ/mol (ΔG réel)',W*.5,H*.95,DGREEN,14);});},
 function(p){ /* 13 UCP1 */
  bio_cap('Tissu adipeux brun : 100 mmol d\'ATP à régénérer',22);
  var y0=H*.8,h=H*.5,x0=W*.14;LN(W*.06,y0,W*.94,y0,INK,1.6);
  function bar(x,v,c,lab,l2){var hh=v/5*h;ctx.fillStyle=c;ctx.fillRect(x,y0-hh,90,hh);ctx.strokeStyle=INK;ctx.strokeRect(x,y0-hh,90,hh);TB(lab,x+45,y0-hh-6,INK,15);TB(l2,x+45,y0+18,INK,12);}
  bar(x0,3.125,'#e1f5ee','3,125 mmol','sans fuite (32 ATP/glc)');
  bio_pop(p,function(){bar(W*.56,4.81,'#fdece4','4,81 mmol','40 % de fuite (20,8 ATP/glc)');TB('+ 54 % de glucose',W*.3,H*.26,DRED,16);TB('énergie en plus libérée en chaleur',W*.5,H*.95,DRED,13);});}
]);
