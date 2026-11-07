/* Biologie BA1 · chapitre 7 : théorie animée et devantures */
function b7_nt(x,y,ch,col,s){s=s||11;ctx.fillStyle='#fff';ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.beginPath();ctx.roundRect(x-s,y-s,2*s,2*s,4);ctx.fill();ctx.stroke();TB(ch,x,y+s*.38,dk(col),s*1.15);}
var B7C={A:GREEN,T:RED,U:RED,G:BLUE,C:ORANGE};
function b7_fork(x,y,len,ang,okaz){ /* fourche de réplication, ouverte vers la droite */
 var d=ang||.45;LN(x-len*.55,y,x,y,INK,3.4);LN(x-len*.55,y+6,x,y+6,INK,3.4);
 var ux=Math.cos(d),uy=Math.sin(d);LN(x,y,x+len*ux,y-len*uy,BLUE,3);LN(x,y+6,x+len*ux,y+6+len*uy,ORANGE,3);
 A(x+len*ux*.2,y-len*uy*.2-6,len*ux*.6,-len*uy*.6,GREEN,'',2.4);
 if(okaz){for(var k=0;k<3;k++){var q=.25+k*.26;var px=x+len*ux*q,py=y+6+len*uy*q;var q2=q+.2;LN(px,py+7,x+len*ux*q2,y+6+len*uy*q2+7,GREEN,2.6);}}
}
function b7_logaxes(x0,y0,w,h,xmax,lo,hi,xl,yl){bio_ax(x0,y0,w,h,xl,yl);for(var e=lo;e<=hi;e+=2){var Y=y0-(e-lo)/(hi-lo)*h;LN(x0-3,Y,x0+3,Y,INK,1.2);TB('10'+String(e).split('').map(function(c){return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c];}).join(''),x0-6,Y+4,GREY,10,'right');}
 return {x:function(n){return x0+n/xmax*w;},y:function(v){return y0-(Math.log(v)/Math.LN10-lo)/(hi-lo)*h;}};}

SFA.theo("c07",{
 icon:function(){var y=H*.3;'ATGGCTGAA'.split('').forEach(function(c,i){b7_nt(W*.12+i*38,y,c,B7C[c],13);});
  A(W*.5,H*.42,0,26,GREY,'',2.6);'AUGGCUGAA'.split('').forEach(function(c,i){b7_nt(W*.12+i*38,H*.66,c,B7C[c],13);});
  TB('ADN → ARN → protéine',W*.5,H*.9,BLUE_D,22);},
 sub:[
 {t:"Du gène à la protéine",
  anim:function(t){
   var tpl='TACCGACTTGCATTTATC',mr='AUGGCUGAACGUAAAUAG',aa=['Met','Ala','Glu','Arg','Lys','stop'];
   var n=Math.min(18,Math.floor(t%1100/22)),c=Math.max(0,Math.min(6,Math.floor(((t%1100)-18*22-40)/60)));
   var x0=W*.5-9*30+15,yT=56,yR=yT+34;
   TB('Transcription : ARN polymérase, brin matrice lu 3′→5′, ARN synthétisé 5′→3′',W*.5,18,BLUE_D,13);
   TB('3′',x0-26,yT+5,GREY,12);TB('5′',x0+18*30-4,yT+5,GREY,12);
   for(var i=0;i<18;i++){b7_nt(x0+i*30,yT,tpl[i],B7C[tpl[i]],11);if(i<n){b7_nt(x0+i*30,yR,mr[i],B7C[mr[i]],11);LN(x0+i*30,yT+11,x0+i*30,yR-11,'#c8ccd0',1.2);}}
   if(n<18){ctx.fillStyle='rgba(127,119,221,.25)';ctx.strokeStyle=VIOLET;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x0+n*30,yT+16,26,30,0,0,7);ctx.fill();ctx.stroke();TB('ARN pol',x0+n*30,yT+19,VIO_D,10);}
   if(n>=18){TB('ARNm 5′→3′ obtenu',W*.5,yR+28,DGREEN,12);
    var y2=H*.76;TB('Traduction : le ribosome lit un codon à la fois (AUG = départ)',W*.5,y2-82,BLUE_D,13);
    for(var k=0;k<6;k++){var cx=x0+k*90+30;var on=k<c;ctx.fillStyle=k===c?'#fdece4':'#fff';ctx.strokeStyle=k===c?ORA2:AX;ctx.lineWidth=k===c?3:1.6;ctx.beginPath();ctx.roundRect(cx-40,y2-14,80,28,6);ctx.fill();ctx.stroke();TB(mr.slice(k*3,k*3+3),cx,y2+5,INK,14);
     if(on){bio_cell(cx,y2-44,16,k===5?RED:BLUE,k===5?'#fcebeb':'#eef4fb');TB(aa[k],cx,y2-40,k===5?DRED:BLUE_D,11);}}
    var rx=x0+Math.min(c,5)*90+30;ctx.strokeStyle=VIOLET;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(rx-46,y2-22,92,44,10);ctx.stroke();TB('ribosome',rx,y2+38,VIO_D,11);}},
  th:'<div class="tcard"><b class="h">Transcription et traduction</b><p><b>ADN → ARN → protéine.</b> L\'ARN polymérase lit le <b>brin matrice</b> (brin transcrit) de 3′ vers 5′ et synthétise l\'ARN de 5′ vers 3′, par appariement complémentaire avec <b>U à la place de T</b>. Matrice 3′-TACCGACTTG-5′ → ARNm 5′-AUGGCUGAAC-3′ (même séquence que le brin codant, en U). Toutes les polymérases allongent en ajoutant un nucléotide au <b>3′-OH</b>.</p><p>La traduction lit l\'ARNm par <b>codons</b> (triplets) : départ AUG (Met), arrêt UAA, UAG, UGA. AUG GCU GAA CGU AAA UAG → Met-Ala-Glu-Arg-Lys puis stop (5 acides aminés). Coût : environ 4 liaisons riches en énergie par liaison peptidique : 149 liaisons × 4 = 596 ATP-équivalents pour 150 aa, soit ≈ 19 glucoses par respiration contre 298 par fermentation.</p></div><div class="tcard"><b class="h">Maturation chez les eucaryotes</b><p>Le transcrit primaire reçoit une <b>coiffe en 5′</b> (ajoutée pendant la transcription, favorise l\'initiation de la traduction), subit l\'<b>épissage</b> (introns retirés de l\'ARN, pas de l\'ADN ; exons raccordés) et reçoit une <b>queue poly(A)</b> en 3′ ajoutée après coupure, non codée par une séquence poly(T). L\'<b>épissage alternatif</b> produit plusieurs protéines d\'un gène. Ex. exons de 120, 90, 100, 60 et 209 nt, les exons 2, 3 et 4 sautables : le cadre est conservé si la somme sautée est multiple de 3 : 4 combinaisons sur 8.</p></div><div class="tcard"><b class="h">Mutations ponctuelles</b><p><b>Silencieuse</b> : même acide aminé (dégénérescence du code). <b>Faux-sens</b> : autre acide aminé (GAG → GUG : Glu → Val, drépanocytose). <b>Non-sens</b> : codon stop (CAG → UAG). <b>Décalage du cadre</b> : insertion ou délétion non multiple de 3, qui change tous les codons suivants. Pour GAG, parmi les 9 substitutions : 1 silencieuse, 7 faux-sens, 1 non-sens.</p></div><div class="tcard"><b class="h">Régulation : l\'opéron lac</b><p>En l\'absence de lactose, le <b>répresseur</b> se fixe sur l\'<b>opérateur</b> : pas de transcription. Le lactose (via l\'allolactose) inactive le répresseur. Mais l\'activation forte exige aussi le complexe <b>CAP–AMPc</b>, présent seulement quand le glucose est absent (répression catabolique). Glucose + lactose : répresseur inactivé mais CAP–AMPc absent : <b>faible expression</b>. Lactose seul : forte expression.</p></div>'},
 {t:"Réplication, PCR et électrophorèse",
  anim:function(t){
   var cyc=Math.floor((t%700)/50),N=Math.pow(2,Math.min(cyc,12));
   TB('PCR : chaque cycle double le nombre de copies (efficacité 100 %)',W*.5,20,BLUE_D,14);
   var x0=W*.08,y0=H*.8,w=W*.84,h=H*.55;LN(x0,y0,x0+w,y0,INK,1.6);
   for(var i=0;i<=12;i++){var bh=Math.pow(2,i)/4096*h;var on=i<=cyc;ctx.fillStyle=on?(i===cyc?'#fdece4':'#e6f1fb'):'#f4f5f7';var bx=x0+i*w/13+4;ctx.fillRect(bx,y0-Math.max(bh,2),w/13-8,Math.max(bh,2));ctx.strokeStyle=on?(i===cyc?ORA2:BLUE):AX;ctx.lineWidth=1.6;ctx.strokeRect(bx,y0-Math.max(bh,2),w/13-8,Math.max(bh,2));TB(String(i),bx+(w/13-8)/2,y0+15,GREY,11);if(on)TB(String(Math.pow(2,i)),bx+(w/13-8)/2,y0-Math.max(bh,2)-5,i===cyc?DRED:BLUE_D,10);}
   TB('cycle',x0+w,y0+30,GREY,12,'right');
   TB('cycle '+Math.min(cyc,12)+' : '+N+' copie'+(N>1?'s':'')+' = 2^'+Math.min(cyc,12),W*.3,H*.3,DRED,16);
   var ph=(t%50)/50;TB(ph<.33?'dénaturation 95 °C':(ph<.66?'hybridation des amorces ≈ 55 °C':'élongation 72 °C (polymérase thermostable)'),W*.3,H*.42,INK,13);
   TB('N = N₀ · (1 + E)ⁿ',W*.75,H*.3,BLUE_D,15);},
  th:'<div class="tcard"><b class="h">Réplication</b><p>Semi-conservative, à partir d\'<b>origines</b> bidirectionnelles : deux fourches partent de chaque origine. L\'ADN polymérase allonge en 5′→3′ à partir d\'une amorce d\'ARN (primase) : <b>brin avancé</b> continu, <b>brin retardé</b> en <b>fragments d\'Okazaki</b> (chacun avec son amorce, reliés par la ligase). Hélicase : ouvre la double hélice.</p><p><b>Calculs</b> : E. coli, 4,6·10<sup>6</sup> pb, 1 origine, 2 fourches à 1 000 nt/s : durée = 2,3·10<sup>6</sup> / 1 000 = 2 300 s ≈ 38 min ; fragments de 1 500 nt : 2 × 2,3·10<sup>6</sup>/1 500 ≈ 3 070. Une fourche eucaryote à 50 nt/s pendant 40 min : 120 000 pb, 600 fragments de 200 nt, 601 amorces. Génome humain 6,4·10<sup>9</sup> pb, phase S de 8 h : 6,4·10<sup>9</sup>/(2 × 50 × 28 800) ≈ 2 223 origines minimum ; avec 40 000 origines : 6,4·10<sup>9</sup>/(2 × 40 000 × 50) = 1 600 s ≈ 27 min.</p></div><div class="tcard"><b class="h">PCR et gel</b><p>Cycle : dénaturation (≈ 95 °C), hybridation des amorces, élongation (≈ 72 °C, polymérase thermostable). Avec une efficacité E : <b>N = N<sub>0</sub>(1 + E)<sup>n</sup></b>. 1 000 copies, 25 cycles : E = 1 → 3,4·10<sup>10</sup> ; E = 0,9 → 9,3·10<sup>9</sup>. Cycles pour atteindre 10<sup>9</sup> copies depuis 10 : n = log(10<sup>8</sup>)/log 2 = 26,6 → 27 cycles (100 %) ; log(10<sup>8</sup>)/log 1,9 = 28,7 → 29 cycles (90 %) : l\'écart de cycles permet de comparer des quantités initiales (qPCR).</p><p><b>Électrophorèse</b> : l\'ADN, chargé négativement, migre vers l\'anode (+) ; les <b>petits fragments migrent plus loin</b>. Lecture : comparer à une échelle de tailles.</p></div>'}
 ]
});
SFA.figs("c07",[
 function(p){ /* 0 transcription */
  bio_cap('Brin matrice 3′-TACCGACTTG-5′',22);
  var tpl='TACCGACTTG',mr='AUGGCUGAAC',x0=W*.5-4.5*38;
  TB('3′',x0-28,H*.36+5,GREY,13);TB('5′',x0+10*38-18,H*.36+5,GREY,13);
  for(var i=0;i<10;i++){b7_nt(x0+i*38,H*.36,tpl[i],B7C[tpl[i]],14);LN(x0+i*38,H*.36+14,x0+i*38,H*.6-14,'#c8ccd0',1.4);if(p>0)bio_pop(p,function(){b7_nt(x0+i*38,H*.6,mr[i],B7C[mr[i]],14);});}
  TB('matrice (brin transcrit)',W*.5,H*.2+8,GREY,13);
  bio_pop(p,function(){TB('ARNm 5′-AUGGCUGAAC-3′',W*.5,H*.86,DGREEN,17);TB('A→U · T→A · C→G · G→C',W*.5,H*.95,GREY,12);});},
 function(p){ /* 1 traduction */
  bio_cap('ARNm 5′-AUG GCU GAA CGU AAA UAG-3′',22);
  var cod=['AUG','GCU','GAA','CGU','AAA','UAG'],aa=['Met','Ala','Glu','Arg','Lys','stop'],dx=W*.145;
  cod.forEach(function(c,i){var x=W*.1+i*dx+dx/2-8;bio_rb(x,H*.62,dx-8,34,i===5?RED:INK,c,14);bio_pop(p,function(){bio_cell(x,H*.34,19,i===5?RED:BLUE,i===5?'#fcebeb':'#eef4fb');TB(aa[i],x,H*.34+4,i===5?DRED:BLUE_D,12);if(i<4)LN(x+19,H*.34,x+dx-19,H*.34,INK,2.4);A(x,H*.52,0,-14,GREY,'',1.6);});});
  bio_pop(p,function(){TB('5 acides aminés, puis arrêt',W*.5,H*.9,DGREEN,16);});},
 function(p){ /* 2 sens de synthèse */
  bio_cap('Où la polymérase ajoute-t-elle un nucléotide ?',22);
  var x0=W*.12,y=H*.5;for(var i=0;i<7;i++)b7_nt(x0+i*34,y,'ATGCATG'[i],BLUE,12);
  TB('5′',x0-26,y+5,DRED,15);TB('3′-OH',x0+6*34,y+34,DRED,13);
  ctx.strokeStyle=VIOLET;ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.strokeRect(x0+7*34-12,y-14,28,28);ctx.setLineDash([]);TB('+N',x0+7*34+2,y+5,VIO_D,13);
  A(x0+7*34-14,y-34,24,0,GREEN,'',3);
  bio_pop(p,function(){TB('synthèse 5′ → 3′ : le nucléotide se lie au 3′-OH',W*.5,H*.82,DGREEN,16);TB('(ADN pol. comme ARN pol.)',W*.5,H*.92,GREY,13);});},
 function(p){ /* 3 PCR 25 cycles */
  bio_cap('1 000 copies · 25 cycles',22);
  var G=b7_logaxes(W*.16,H*.8,W*.76,H*.58,25,3,11,'cycles','copies');[0,5,10,15,20,25].forEach(function(v){TB(''+v,G.x(v),H*.8+15,GREY,11);});
  bio_fn(function(n){return 1000*Math.pow(2,n);},0,25,G.x,G.y,BLUE,2.8,50);
  bio_pop(p,function(){bio_fn(function(n){return 1000*Math.pow(1.9,n);},0,25,G.x,G.y,RED,2.8,50);TB('E = 100 % : 3,4·10¹⁰',G.x(1),G.y(5e10),BLUE_D,13,'left');TB('E = 90 % : 9,3·10⁹',G.x(1),G.y(7e9),DRED,13,'left');});},
 function(p){ /* 4 E. coli */
  bio_cap('Chromosome d\'E. coli : 4,6·10⁶ pb · 1 origine',22);
  var cx=W*.3,cy=H*.56,r=H*.3;ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
  DOT(cx,cy-r,7,GREEN);TB('origine',cx,cy-r-12,DGREEN,12);
  bio_pop(p,function(){ctx.strokeStyle=ORANGE;ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,r,-PI/2,PI*.4,false);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r,-PI/2,-PI*.9,true);ctx.stroke();DOT(cx+r*Math.cos(PI*.4),cy+r*Math.sin(PI*.4),7,RED);DOT(cx+r*Math.cos(-PI*.9),cy+r*Math.sin(-PI*.9),7,RED);});
  TB('2 fourches × 1 000 nt/s',W*.72,H*.32,INK,13);TB('chacune : 2,3·10⁶ nt',W*.72,H*.44,INK,13);
  bio_pop(p,function(){TB('t = 2 300 s ≈ 38 min',W*.72,H*.62,DRED,16);TB('Okazaki (1 500 nt) :',W*.72,H*.76,GREY,12);TB('≈ 3 070 fragments',W*.72,H*.86,DGREEN,15);});},
 function(p){ /* 5 type de mutation */
  bio_cap('CAG (Gln) → UAG',22);
  bio_rb(W*.25,H*.4,W*.28,46,BLUE,'CAG',20);TB('Gln',W*.25,H*.4+46,BLUE_D,14);A(W*.42,H*.4,W*.14,0,GREY,'',3);bio_rb(W*.75,H*.4,W*.28,46,RED,'UAG',20);TB('codon stop',W*.75,H*.4+46,DRED,14);
  TB('1 substitution : C → U',W*.5,H*.2+8,GREY,13);
  bio_pop(p,function(){TB('protéine tronquée : mutation non-sens',W*.5,H*.82,DRED,17);});},
 function(p){ /* 6 neuf substitutions */
  bio_cap('Codon GAG (Glu) : 9 substitutions possibles',22);
  var rows=[['AAG Lys','CAG Gln','UAG stop'],['GCG Ala','GGG Gly','GUG Val'],['GAA Glu','GAC Asp','GAU Asp']];var kind=[[1,1,2],[1,1,1],[0,1,1]];
  var cols=['#e1f5ee','#fdece4','#fcebeb'];var bc=[GREEN,ORA2,RED];
  var x0=W*.2,cw=W*.22,ch=H*.17;
  rows.forEach(function(r,i){TB('position '+(i+1),W*.09,H*.3+i*(ch+6)+ch*.5+5,GREY,11);r.forEach(function(c,j){var x=x0+j*(cw+6),y=H*.26+i*(ch+6);var hi=(i===1&&j===2&&p>0);ctx.fillStyle=cols[kind[i][j]];ctx.strokeStyle=hi?VIOLET:bc[kind[i][j]];ctx.lineWidth=hi?4:2;ctx.beginPath();ctx.roundRect(x,y,cw,ch,6);ctx.fill();ctx.stroke();TB(c,x+cw/2,y+ch*.62,dk(bc[kind[i][j]]),13);});});
  TB('silencieuse 1 · faux-sens 7 · non-sens 1',W*.5,H*.9,INK,14);
  bio_pop(p,function(){TB('GAG → GUG (Glu → Val) : drépanocytose',W*.5,H*.97,VIO_D,13);});},
 function(p){ /* 7 une fourche 40 min */
  bio_cap('Une fourche eucaryote : 50 nt/s pendant 40 min',22);
  b7_fork(W*.34,H*.5,W*.4,.5,true);TB('brin avancé',W*.8,H*.3,DGREEN,12);TB('retardé : Okazaki',W*.97,H*.7,DGREEN,12,'right');
  bio_pop(p,function(){TB('50 × 2 400 s = 120 000 pb',W*.28,H*.86,INK,15);TB('600 fragments de 200 nt',W*.28,H*.93,DGREEN,14);TB('≈ 601 amorces d\'ARN',W*.75,H*.93,DRED,14);});},
 function(p){ /* 8 glucose + lactose */
  bio_cap('Glucose + lactose : opéron lac',22);
  var y=H*.5,X=function(f){return W*f;};var parts=[['CAP',.1,.1,VIOLET],['P',.22,.08,GREY],['O',.32,.08,ORANGE],['lacZ',.5,.2,BLUE],['lacY',.7,.15,BLUE],['lacA',.86,.15,BLUE]];
  LN(W*.04,y,W*.96,y,INK,2);parts.forEach(function(q){ctx.fillStyle='#fff';ctx.strokeStyle=q[3];ctx.lineWidth=2.4;ctx.fillRect(X(q[1])-W*q[2]/2,y-14,W*q[2],28);ctx.strokeRect(X(q[1])-W*q[2]/2,y-14,W*q[2],28);TB(q[0],X(q[1]),y+5,dk(q[3]),12);});
  TB('répresseur inactivé (allolactose)',W*.62,y-48,GREEN,12);b7_nt(W*.32,y-42,'R',GREY,11);
  TB('glucose présent : pas de CAP–AMPc',W*.14,y+46,DRED,12,'left');
  bio_pop(p,function(){TB('expression faible',W*.5,H*.86,DRED,18);TB('(CAP–AMPc absent : activation nulle)',W*.5,H*.94,GREY,12);});},
 function(p){ /* 9 seuil virus */
  bio_cap('Seuil de détection : 10⁹ copies · départ 10 copies',22);
  var G=b7_logaxes(W*.14,H*.8,W*.8,H*.58,32,1,9,'cycles','copies');[0,10,20,30].forEach(function(v){TB(''+v,G.x(v),H*.8+15,GREY,11);});
  LN(G.x(0),G.y(1e9),G.x(32),G.y(1e9),GREY,1.4,[5,4]);
  bio_fn(function(n){return Math.max(1,10*Math.pow(2,n));},0,29,G.x,G.y,BLUE,2.8,58);bio_fn(function(n){return 10*Math.pow(1.9,n);},0,31,G.x,G.y,RED,2.8,62);
  bio_pop(p,function(){LN(G.x(26.6),H*.8,G.x(26.6),G.y(1e9),BLUE,1.4,[3,3]);LN(G.x(28.7),H*.8,G.x(28.7),G.y(1e9),RED,1.4,[3,3]);TB('27 cycles (100 %)',G.x(1),G.y(1e9)+40,BLUE_D,13,'left');TB('29 cycles (90 %)',G.x(1),G.y(1e9)+60,DRED,13,'left');});},
 function(p){ /* 10 eucaryote */
  bio_cap('ARN pré-messager eucaryote',22);
  var y=H*.5;DOT(W*.07,y,10,p>0?GREEN:AX);ctx.strokeStyle=p>0?GREEN:AX;ctx.lineWidth=2;ctx.beginPath();ctx.arc(W*.07,y,10,0,7);ctx.stroke();
  var ex=[[.12,.14],[.34,.12],[.54,.16]];LN(W*.1,y,W*.78,y,GREY,3);
  ex.forEach(function(q,i){ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(W*q[0],y-18,W*q[1],36);ctx.strokeRect(W*q[0],y-18,W*q[1],36);TB('exon '+(i+1),W*q[0]+W*q[1]/2,y+5,BLUE_D,12);});
  TB('intron',W*.31,y-26,GREY,12);TB('intron',W*.5,y-26,GREY,12);
  for(var k=0;k<4;k++)TB('A',W*.8+k*14,y+5,p>0?DGREEN:GREY,14);
  TB('coiffe 5′',W*.07,y+36,p>0?DGREEN:GREY,12);TB('poly(A) 3′',W*.86,y+36,p>0?DGREEN:GREY,12);
  bio_pop(p,function(){TB('coiffe : ajoutée pendant la transcription',W*.5,H*.8,DGREEN,15);TB('introns retirés de l\'ARN (épissage), pas de l\'ADN',W*.5,H*.9,GREY,13);});},
 function(p){ /* 11 épissage alternatif */
  bio_cap('5 exons : 120 · 90 · 100 · 60 · 209 nt',22);
  var ex=[120,90,100,60,209],tot=579,x0=W*.07,w=W*.86,y=H*.2;var x=x0;
  ex.forEach(function(e,i){var ww=w*e/tot;var sk=i>=1&&i<=3;ctx.fillStyle=sk?'#faeeda':'#e6f1fb';ctx.strokeStyle=sk?ORANGE:BLUE;ctx.lineWidth=2;ctx.fillRect(x,y,ww-3,32);ctx.strokeRect(x,y,ww-3,32);TB(e+'',x+ww/2,y+21,sk?DRED:BLUE_D,12);x+=ww;});
  var combos=[['aucun saut',0],['sans 90',90],['sans 100',100],['sans 60',60],['sans 90 + 100',190],['sans 90 + 60',150],['sans 100 + 60',160],['sans 90 + 100 + 60',250]];
  bio_pop(p,function(){combos.forEach(function(c,i){var col=i<4?0:1,row=i%4;var xx=W*.07+col*W*.48,yy=H*.46+row*30;var ok=c[1]%3===0;ctx.fillStyle=ok?'#e1f5ee':'#fcebeb';ctx.fillRect(xx,yy,W*.44,24);ctx.strokeStyle=ok?GREEN:RED;ctx.lineWidth=1.6;ctx.strokeRect(xx,yy,W*.44,24);TB(c[0]+' : '+c[1]+' nt '+(ok?'✓':'✗'),xx+8,yy+16,ok?DGREEN:DRED,12,'left');});TB('cadre conservé : 4 combinaisons sur 8',W*.5,H*.95,DGREEN,15);});
  if(p<=0)TB('lesquelles gardent le cadre de lecture ?',W*.5,H*.62,GREY,15);},
 function(p){ /* 12 coût protéine */
  bio_cap('Protéine de 150 aa : 149 liaisons peptidiques',22);
  for(var i=0;i<8;i++)bio_cell(W*.1+i*34,H*.3,13,BLUE,'#eef4fb');TB('· · ·',W*.1+8*34+10,H*.3+5,GREY,16);
  TB('4 liaisons riches en énergie par liaison',W*.5,H*.5,INK,14);TB('(2 charge de l\'ARNt · 1 EF-Tu · 1 EF-G)',W*.5,H*.58,GREY,12);
  bio_pop(p,function(){TB('149 × 4 = 596 ATP-équivalents',W*.5,H*.72,DRED,18);TB('≈ 19 glucoses (respiration) · 298 (fermentation)',W*.5,H*.86,DGREEN,14);});},
 function(p){ /* 13 origines */
  bio_cap('Génome diploïde : 6,4·10⁹ pb · fourches à 50 nt/s',22);
  var y=H*.4;LN(W*.06,y,W*.94,y,INK,4);for(var i=0;i<6;i++){var x=W*.12+i*W*.15;ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,W*.05,12,0,0,7);ctx.fill();ctx.stroke();DOT(x,y,4,GREEN);}
  TB('origines bidirectionnelles',W*.5,y-28,GREEN,13);
  TB('8 h = 28 800 s · une origine couvre 2 × 50 × 28 800 = 2,88·10⁶ pb',W*.5,H*.6,INK,12);
  bio_pop(p,function(){TB('(a) 6,4·10⁹ / 2,88·10⁶ ≈ 2 223 origines',W*.5,H*.74,DRED,15);TB('(b) 40 000 origines : 8·10⁴ pb par fourche',W*.5,H*.85,DGREEN,14);TB('→ 1 600 s ≈ 27 min',W*.5,H*.94,DGREEN,15);});}
]);
