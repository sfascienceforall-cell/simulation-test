/* Biologie 4e · chapitre 8 · ADN, chromosomes et réplication */
function b4bc(b){return {A:RED,T:ORANGE,U:GREEN,G:BLUE,C:VIOLET}[b]||GREY;}
function b4comp(b){return {A:'T',T:'A',G:'C',C:'G'}[b];}
function b4base(x,y,b,s){s=s||1;ctx.fillStyle=b4bc(b)+'33';ctx.strokeStyle=b4bc(b);ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-13*s,y-13*s,26*s,26*s,6);ctx.fill();ctx.stroke();TB(b,x,y+5*s,dk(b4bc(b)),Math.round(16*s));}
function b4chrom(x,y,h,dbl,col){/* chromosome : une ou deux chromatides (en X) */col=col||BLUE;ctx.lineCap='round';ctx.strokeStyle=col;ctx.lineWidth=9;if(dbl){LN(x-7,y-h/2,x-7,y+h/2,col,8);LN(x+7,y-h/2,x+7,y+h/2,col,8);DOT(x,y,6,'#fff');ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.stroke();}else{LN(x,y-h/2,x,y+h/2,col,9);}ctx.lineCap='butt';}
function b4ladder(x0,x1,y,hw,c1,c2,n,seed){var st=(x1-x0)/n;for(var i=0;i<=n;i++){var x=x0+i*st,b=['A','T','G','C'][Math.floor(b4rnd(i,seed||1)*4)];if(c1&&c2)LN(x,y-hw,x,y+hw,b4bc(b)+'aa',2.2);}
 if(c1)LN(x0,y-hw,x1,y-hw,c1,4);if(c2)LN(x0,y+hw,x1,y+hw,c2,4);}
SFA.theo("c08",{
 icon:function(){var cx=W*.5,cy=H*.5,hh=Math.min(H*.26,60);ctx.lineWidth=5;for(var k=0;k<2;k++){ctx.strokeStyle=k?ORANGE:BLUE;ctx.beginPath();for(var i=0;i<=80;i++){var x=W*.2+i*W*.6/80,y=cy+Math.sin(i*.2+k*3.1416)*hh;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  for(var j=2;j<80;j+=4){var x2=W*.2+j*W*.6/80,y1=cy+Math.sin(j*.2)*hh,y2=cy-Math.sin(j*.2)*hh;LN(x2,y1,x2,y2,['#e24b4a88','#7f77dd88','#378add88'][j%3],2.2);}},
 anim:function(t){var cy=H*.52,hw=Math.min(18,H*.07),fx=W*.12+((t*.6)%(W*.72)),dy=H*.2,x0=W*.04,x1=W*.96;TB('Réplication semi-conservative : chaque molécule fille = un brin ancien + un brin neuf',W*.5,H*.08,BLUE_D,Math.max(12,Math.min(15,W/48)));
  var n=Math.floor((x1-x0)/14);
  for(var i=0;i<=n;i++){var x=x0+i*14,b=['A','T','G','C'][Math.floor(b4rnd(i,3)*4)],g=Math.max(0,Math.min(1,(x-fx)/(W*.16)));
   if(x<=fx){LN(x,cy-hw,x,cy+hw,b4bc(b)+'aa',2.4);}
   else{var y1=cy-hw-dy*g,y3=cy+hw+dy*g,y2=y1+1.9*hw*g,y4=y3-1.9*hw*g;LN(x,y1,x,y2,b4bc(b)+'aa',2.2);LN(x,y3,x,y4,b4bc(b)+'aa',2.2);}}
  LN(x0,cy-hw,fx,cy-hw,BLUE,4);LN(x0,cy+hw,fx,cy+hw,BLUE,4);
  ctx.lineWidth=4;[[-1,BLUE],[1,BLUE]].forEach(function(q){ctx.strokeStyle=q[1];ctx.beginPath();for(var x=fx;x<=x1;x+=4){var g=Math.max(0,Math.min(1,(x-fx)/(W*.16)));ctx.lineTo(x,cy+q[0]*(hw+dy*g));}ctx.stroke();});
  [[-1,1.9*hw],[1,-1.9*hw]].forEach(function(q){ctx.strokeStyle=ORANGE;ctx.lineWidth=4;ctx.beginPath();for(var x=fx;x<=x1;x+=4){var g=Math.max(0,Math.min(1,(x-fx)/(W*.16)));ctx.lineTo(x,cy+q[0]*(hw+dy*g)+q[1]*Math.max(0,Math.min(1,(x-fx)/(W*.16))));}ctx.stroke();});
  DOT(fx,cy,5,GREEN);TB('fourche de réplication',fx,cy+H*.38,DGREEN,13);
  TB('brin ancien',W*.1,cy-hw-9,BLUE_D,13);TB('brin neuf',W*.88,cy-hw-dy+1.9*hw+18,'#8a5a17',13);TB('brin ancien',W*.88,cy-hw-dy-8,BLUE_D,13);},
 th:'<div class="tcard"><b class="h">La double hélice</b><p>L\'ADN est formé de deux brins de <b>nucléotides</b> (sucre + phosphate + une base : A, T, G ou C) enroulés en double hélice. Les brins sont <b>complémentaires</b> et <b>antiparallèles</b> : <b>A–T</b> (2 liaisons hydrogène) et <b>G–C</b> (3 liaisons hydrogène). <b>Règle de Chargaff</b> : %A = %T et %G = %C.</p><div class="tip"><b class="h">Exemples chiffrés</b><br>5\'-ATGCCGTA-3\' → brin complémentaire <b>3\'-TACGGCAT-5\'</b>. Si A = 22 % : T = 22 %, G + C = 56 %, donc G = C = <b>28 %</b>. Brin GGCATTAC : 4 paires G–C (12 liaisons) + 4 paires A–T (8) = <b>20 liaisons</b> H.</div></div>'+
 '<div class="tcard"><b class="h">Réplication semi-conservative</b><p>Avant chaque division (phase S), l\'ADN est copié. Les deux brins se séparent ; chacun sert de <b>matrice</b> pour fabriquer un brin neuf complémentaire. Résultat : <b>2 molécules identiques, chacune avec 1 brin ancien + 1 brin neuf</b>. Les enzymes (hélicase, ADN polymérase) agissent à la <b>fourche de réplication</b>.</p></div>'+
 '<div class="tcard"><b class="h">Preuve : Meselson et Stahl (¹⁵N / ¹⁴N)</b><p>Bactéries cultivées dans ¹⁵N (ADN lourd) puis transférées dans ¹⁴N (léger). Après 1 génération : <b>une seule bande intermédiaire</b> → le modèle conservatif est écarté ; après 2 générations : une bande intermédiaire + une bande légère → le modèle dispersif est écarté. Seul le semi-conservatif convient.</p><div class="tip"><b class="h">Comptage</b><br>Après n divisions : 2<sup>n</sup> molécules dont <b>2 hybrides</b> (les 2 brins lourds d\'origine) : n = 3 → 8 (2 + 6 légères) ; n = 5 → 32 (2 + 30).</div></div>'+
 '<div class="tcard"><b class="h">Gène, chromosome, chromatide, caryotype</b><ul><li>Un <b>gène</b> : portion d\'ADN codant une information (souvent une protéine).</li><li>Un <b>chromosome</b> : une molécule d\'ADN très compactée avec des protéines. Après la réplication, il possède <b>2 chromatides sœurs</b> identiques reliées au centromère.</li><li>Cellule humaine : 46 chromosomes (23 paires : 22 autosomes + 1 paire sexuelle XX ou XY). Avant réplication : 46 chromosomes à 1 chromatide ; après : 46 chromosomes, <b>92 chromatides</b>.</li><li><b>Caryotype</b> : classement des paires. 47,XY,+21 = garçon, trisomie 21 (45 autosomes).</li></ul></div>'+
 '<div class="warn"><b class="h">Ordres de grandeur</b><br>6,2·10<sup>9</sup> paires de bases × 0,34 nm ≈ <b>2,1 m</b> d\'ADN par cellule dans un noyau de 6 µm : compaction ≈ 3,5·10<sup>5</sup>. Pour 3,7·10<sup>13</sup> cellules : ≈ 7,8·10<sup>10</sup> km, soit ≈ 520 fois la distance Terre–Soleil. Un ADN de 1 000 paires avec 30 % d\'adénine : 600 A–T (1 200 liaisons) + 400 G–C (1 200) = <b>2 400</b> liaisons.</div>'
});
SFA.figs("c08",[
 /* 0 brin complémentaire */
 function(p){var s='ATGCCGTA',n=8,x0=W*.14,dx=(W*.8-W*.1)/n*1.0,y1=H*.32,y2=H*.68;TB("5'",W*.07,y1+5,GREY,16);TB("3'",W*.94,y1+5,GREY,16);TB("3'",W*.07,y2+5,GREY,16);TB("5'",W*.94,y2+5,GREY,16);
  for(var i=0;i<n;i++){var x=x0+i*dx+dx/2;b4base(x,y1,s[i],1.15);if(p<=0){ctx.setLineDash([3,3]);ctx.strokeStyle=GREY;ctx.strokeRect(x-14,y2-14,28,28);ctx.setLineDash([]);TB('?',x,y2+6,GREY,18);}else{var a=b4r(p,i*.07,i*.07+.3);b4al(a);LN(x,y1+16,x,y2-16,GREY,1.6,[3,3]);b4base(x,y2,b4comp(s[i]),1.15);b4al(1);}}
  b4ans(p,"3'-TACGGCAT-5'",GREEN,H-20);},
 /* 1 Chargaff */
 function(p){var cx=W*.4,cy=H*.5,R=Math.min(H*.38,W*.24),v=[['A',22,RED],['T',22,ORANGE],['G',28,BLUE],['C',28,VIOLET]],a0=-1.5708;
  v.forEach(function(q,i){var show=i===0||p>0,f=i===0?1:b4r(p,i*.12,i*.12+.35);var a1=a0+q[1]/100*6.2832;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,a0,show?a0+(a1-a0)*f:a0);ctx.closePath();if(show){ctx.fillStyle=q[2]+'66';ctx.fill();ctx.strokeStyle=q[2];ctx.lineWidth=2.4;ctx.stroke();}
   if(show&&f>.9){var am=(a0+a1)/2;TB(q[0]+' '+q[1]+' %',cx+Math.cos(am)*R*.62,cy+Math.sin(am)*R*.62+5,dk(q[2]),15);}a0=a1;});
  if(p<=0){ctx.setLineDash([5,5]);ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,R,-1.5708+22/100*6.2832,4.712);ctx.stroke();ctx.setLineDash([]);TB('T, G, C ?',cx+R*.1,cy+R*.2,GREY,20);}
  b4box(W*.82,H*.42,W*.26,H*.34,GREY,'#f6f7f9',1.5);TB('A = T',W*.82,H*.35,INK,16);TB('G = C',W*.82,H*.43,INK,16);TB('total 100 %',W*.82,H*.52,GREY,13);
  if(p>0){b4ans(p,'T = 22 % · G = C = 28 %',GREEN,H-20);}},
 /* 2 semi-conservatif */
 function(p){var hw=Math.min(12,H*.05);b4ladder(W*.06,W*.3,H*.5,hw,BLUE,BLUE,10,2);TB('molécule mère',W*.18,H*.5+hw+22,INK,13);A(W*.34,H*.5,W*.1,0,GREY,'',3);TB('réplication',W*.39,H*.43,GREY,13);
  if(p<=0){TB('?',W*.7,H*.5,GREY,48);}else{b4al(b4r(p,0,.5));b4ladder(W*.5,W*.74,H*.28,hw,BLUE,ORANGE,10,2);b4ladder(W*.5,W*.74,H*.72,hw,BLUE,ORANGE,10,2);TB('ancien + neuf',W*.87,H*.28+4,'#8a5a17',13);TB('ancien + neuf',W*.87,H*.72+4,'#8a5a17',13);b4al(1);b4ans(p,'1 brin ancien + 1 brin neuf',GREEN,H-20);}},
 /* 3 liaisons H */
 function(p){var s='GGCATTAC',n=8,x0=W*.1,dx=W*.8/n,y1=H*.25,y2=H*.62,tot=0;TB("5'",W*.05,y1+5,GREY,15);TB("3'",W*.95,y1+5,GREY,15);
  for(var i=0;i<n;i++){var x=x0+i*dx+dx/2,b=s[i],c=b4comp(b),k=(b==='G'||b==='C')?3:2;b4base(x,y1,b,1);b4base(x,y2,c,1);if(p>0){var a=b4r(p,i*.07,i*.07+.3);b4al(a);for(var j=0;j<k;j++)LN(x-6+j*6*(k===2?2:1)-(k===2?0:0)+(k===2?0:0),y1+16,x-6+j*6*(k===2?2:1),y2-16,k===3?RED:BLUE,2.4,[2,3]);b4al(1);}}
  if(p<=0){TB('(a) % G + C ?     (b) nombre de liaisons H ?',W*.5,H*.9-10,GREY,15);}
  if(p>0){b4al(b4r(p,.5,1));TB('4 G–C × 3 = 12   +   4 A–T × 2 = 8',W*.5,H*.85,DGREEN,15);b4al(1);b4ans(p,'(a) 50 % · (b) 20 liaisons',GREEN,H-20+8);}},
 /* 4 générations */
 function(p){var gens=[0,1,2,3,5],lab=['n = 0','1','2','3','5'];var y0=H*.14,dy=H*.155,x0=W*.14,w=W*.8;
  gens.forEach(function(g,r){var n=Math.pow(2,g),y=y0+r*dy,cw=w/32;TB(lab[r],W*.07,y+5,GREY,13);for(var i=0;i<n;i++){var xc=x0+w*(i+.5)/n,ww=Math.min(w/n*.8,26);var col=GREY,fill='#f6f7f9';if(p>0){var hy=(g===0)?'l':(i<2?'h':'g');if(g===0){fill='#e8c9c9';col=DRED;}else if(i<2){fill='#fdd9b8';col=ORANGE;}else{fill='#dbe9f8';col=BLUE;}}
   ctx.fillStyle=fill;ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.beginPath();ctx.roundRect(xc-ww/2,y-10,ww,20,4);ctx.fill();ctx.stroke();}});
  if(p<=0)TB('hybrides ? légères ?',W*.5,H*.96,GREY,15);
  if(p>0){b4al(b4r(p,0,.4));TB('8 = 2 + 6',W*.88,H*.14+3*dy-16,DGREEN,14);TB('32 = 2 + 30',W*.84,H*.14+4*dy+26,DGREEN,14);TB('lourd',W*.88,H*.14+5,DRED,13);b4al(1);b4ans(p,'3 : 8 (2 + 6) · 5 : 32 (2 + 30)',GREEN,H-20+4);}},
 /* 5 Meselson */
 function(p){function tube(x,y,h,bands,lab){ctx.fillStyle='#fff';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(x-18,y,36,h,[2,2,16,16]);ctx.fill();ctx.stroke();bands.forEach(function(b){ctx.fillStyle=b[1];ctx.fillRect(x-16,y+h*b[0]-4,32,8);});TB(lab,x,y+h+20,INK,13);}
  var h=H*.5,y=H*.22;tube(W*.12,y,h,[[.3,'#a8a2ea'],[.7,'#a8a2ea']],'');TB('observé',W*.12,y+h+20,INK,14);TB('1 bande',W*.12,y+h+38,GREY,13);
  ['conservatif','semi-conservatif','dispersif'].forEach(function(nm,i){var x=W*(.4+i*.24);var bands=i===0?[[.3,'#d9a0a0'],[.7,'#a8a2ea']]:[[.5,'#a8a2ea']];if(p<=0)bands=[];tube(x,y,h,bands,'');TB(nm,x,y+h+20,INK,13);if(p<=0)TB('?',x,y+h/2+8,GREY,26);});
  TB('lourd',W*.4-34,y+h*.3+4,GREY,12,'right');TB('léger',W*.4-34,y+h*.7+4,GREY,12,'right');
  if(p>0){b4al(b4r(p,0,.5));var x=W*.4;LN(x-24,y+h*.1,x+24,y+h*.9,RED,5);LN(x+24,y+h*.1,x-24,y+h*.9,RED,5);b4al(1);b4ans(p,'le modèle conservatif est écarté',GREEN,H-20+4);}else TB('quel modèle est écarté ?',W*.5,H*.1,GREY,16);},
 /* 6 chromosomes et chromatides */
 function(p){var xs=[.15,.25,.65,.75];b4chrom(W*.18,H*.46,H*.4,false,BLUE);b4chrom(W*.3,H*.46,H*.4,false,VIOLET);TB('avant S',W*.24,H*.8,INK,14);TB('46 chromosomes',W*.24,H*.88,GREY,13);
  A(W*.4,H*.46,W*.1,0,GREY,'',3);TB('réplication',W*.45,H*.38,GREY,13);b4chrom(W*.62,H*.46,H*.4,true,BLUE);b4chrom(W*.82,H*.46,H*.4,true,VIOLET);TB('après S',W*.72,H*.8,INK,14);
  if(p<=0){TB('? chromosomes · ? chromatides',W*.72,H*.9,GREY,14);}
  if(p>0){b4al(b4r(p,0,.5));TB('46 chromosomes',W*.72,H*.88,DGREEN,14);TB('92 chromatides',W*.72,H*.95,DRED,14);TB('chromatides sœurs',W*.62-30,H*.18,DGREEN,13);LN(W*.62-6,H*.23,W*.62-8,H*.3,GREEN,1.4);b4al(1);}},
 /* 7 caryotype */
 function(p){var k=0,rows=[12,11],y0=H*.2,dy=H*.34;rows.forEach(function(nr,r){for(var i=0;i<nr;i++){var n=r*12+i+1,x=W*(.08+(i+.5)*.84/12),y=y0+r*dy,isX=n===23,h=H*.2*(1-n*.02);var cnt=n===21?3:2;var col=n===21?(p>0?RED:BLUE):BLUE;
   if(n===23){b4chrom(x-6,y+10,h*.8,false,GREEN);b4chrom(x+8,y+10,h*.55,false,ORANGE);TB('XY',x,y+h*.9+20,GREY,12);}
   else{for(var j=0;j<cnt;j++)LN(x-(cnt-1)*4+j*8,y-h/2+10,x-(cnt-1)*4+j*8,y+h/2+10,col,6);TB(String(n),x,y+h*.5+30,GREY,12);}}});
  if(p<=0){TB('formule ? autosomes ? sexe ?',W*.5,H*.1,GREY,16);}
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.08+20.5*.84/12*W-24,y0-14,48,H*.2+44,8);ctx.stroke();TB('trisomie 21',W*.08+20.5*.84/12*W,H*.14,DRED,14);b4al(1);b4ans(p,'47,XY,+21 · 45 autosomes · garçon',GREEN,H-20);}},
 /* 8 ADN bout à bout */
 function(p){b4ell(W*.1,H*.35,8,8,'#e4e0fa',VIOLET,2);TB('noyau : 6 µm',W*.1,H*.35+28,VIOLET,13);
  var x0=W*.2,x1=W*.9,y=H*.35;ctx.strokeStyle=ORANGE;ctx.lineWidth=4;ctx.beginPath();for(var i=0;i<=60;i++){var x=x0+(x1-x0)*i/60;i?ctx.lineTo(x,y+Math.sin(i*.9)*5):ctx.moveTo(x,y);}ctx.stroke();TB('ADN d\'une cellule : 6,2·10⁹ pb × 0,34 nm ≈ 2,1 m',(x0+x1)/2,y-20,'#8a5a17',14);
  if(p<=0){TB('compaction ? · longueur du corps ?',W*.5,H*.7,GREY,17);}
  if(p>0){b4al(b4r(p,0,.4));TB('÷ 6 µm → ≈ 3,5·10⁵ fois',W*.5,H*.55,DGREEN,16);b4al(1);b4al(b4r(p,.4,.9));TB('× 3,7·10¹³ cellules ≈ 7,8·10¹⁰ km',W*.5,H*.67,DGREEN,16);TB('≈ 520 × distance Terre–Soleil',W*.5,H*.78,DRED,16);b4al(1);}},
 /* 9 liaisons H 1000 pb */
 function(p){var x0=W*.1,w=W*.8,y=H*.3,h=H*.16,seg=[['A',30],['T',30],['G',20],['C',20]],xx=x0;
  seg.forEach(function(q){var ww=w*q[1]/100;ctx.fillStyle=b4bc(q[0])+'55';ctx.fillRect(xx,y,ww,h);ctx.strokeStyle=b4bc(q[0]);ctx.lineWidth=2;ctx.strokeRect(xx,y,ww,h);TB(q[0]+' '+q[1]+' %',xx+ww/2,y+h*.62,dk(b4bc(q[0])),15);xx+=ww;});
  TB('1 000 paires de bases',W*.5,y-12,INK,15);
  if(p<=0){TB('? liaisons hydrogène',W*.5,H*.7,GREY,22);}
  if(p>0){b4al(b4r(p,0,.5));TB('A–T : 600 paires × 2 = 1 200',W*.5,H*.62,RED,15);TB('G–C : 400 paires × 3 = 1 200',W*.5,H*.72,BLUE_D,15);b4al(1);b4ans(p,'1 200 + 1 200 = 2 400 liaisons',GREEN,H-20);}}
]);
