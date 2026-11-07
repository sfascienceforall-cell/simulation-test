/* Biologie 4e · chapitre 10 · Cycle cellulaire et mitose */
/* cellule à 4 chromosomes (2n = 4, schématique). stage : 0 G1, 1 S (f = avancement), 2 G2, 3 prophase, 4 métaphase, 5 anaphase, 6 télophase */
function b4cellS(cx,cy,r,stage,f){f=f||0;var cols=[BLUE,BLUE,VIOLET,VIOLET],ch=r*.42,sp=r*.2;
 if(stage===6){var d=Math.max(0,Math.min(1,f)),sq=.78+.22*(1-d);b4ell(cx-r*.5,cy,r*.6,r*.78*sq,'#fdf3ee',ORA2,2.2);b4ell(cx+r*.5,cy,r*.6,r*.78*sq,'#fdf3ee',ORA2,2.2);
  [-1,1].forEach(function(sg){b4ell(cx+sg*r*.55,cy,r*.34,r*.38,'#e4e0fa',VIOLET,1.8);for(var i=0;i<4;i++)LN(cx+sg*r*.55+(i-1.5)*sp*.6,cy-ch*.3,cx+sg*r*.55+(i-1.5)*sp*.6,cy+ch*.3,cols[i],3);});return;}
 b4ell(cx,cy,r,r*.82,'#fdf3ee',ORA2,2.4);
 if(stage<=2||stage===3){ctx.setLineDash(stage===3?[4,4]:[]);b4ell(cx,cy,r*.56,r*.56,'#e4e0fa',VIOLET,stage===3?1.4:2);ctx.setLineDash([]);}
 if(stage>=3){DOT(cx-r*.9,cy,4,GREEN);DOT(cx+r*.9,cy,4,GREEN);}
 for(var i=0;i<4;i++){var col=cols[i];
  if(stage<=2){var x=cx+(i-1.5)*sp*1.1,y=cy+((i%2)?-1:1)*r*.1,dbl=stage===2||(stage===1&&f>(i+.5)/4);var h=ch*.9;if(dbl){LN(x-2.5,y-h/2,x-2.5,y+h/2,col,4);LN(x+2.5,y-h/2,x+2.5,y+h/2,col,4);}else LN(x,y-h/2,x,y+h/2,col,4);}
  else if(stage===3){var x2=cx+(i-1.5)*sp*1.3,y2=cy+((i%2)?-1:1)*r*.2;LN(x2-3,y2-ch/2,x2-3,y2+ch/2,col,5);LN(x2+3,y2-ch/2,x2+3,y2+ch/2,col,5);}
  else if(stage===4){var y3=cy+(i-1.5)*sp*1.5;LN(cx,y3-sp*.6,cx,y3+sp*.6,'rgba(0,0,0,0)',1);LN(cx-r*.9,cy,cx,y3,'#cfd3d8',1);LN(cx+r*.9,cy,cx,y3,'#cfd3d8',1);LN(cx-3,y3-ch*.28,cx-3,y3+ch*.28,col,5);LN(cx+3,y3-ch*.28,cx+3,y3+ch*.28,col,5);}
  else if(stage===5){var y4=cy+(i-1.5)*sp*1.5,dd=r*.12+f*r*.55;LN(cx-r*.9,cy,cx-dd,y4,'#cfd3d8',1);LN(cx+r*.9,cy,cx+dd,y4,'#cfd3d8',1);LN(cx-dd,y4-ch*.28,cx-dd,y4+ch*.28,col,5);LN(cx+dd,y4-ch*.28,cx+dd,y4+ch*.28,col,5);}}}
var b4_PH=['G1','S','G2','prophase','métaphase','anaphase','télophase'];
function b4wheel(cx,cy,R,ang,hl){/* G1 .45, S .25, G2 .2, M .1 */var seg=[['G1',.45,BLUE],['S',.25,ORANGE],['G2',.2,GREEN],['M',.1,RED]],a=-1.5708;seg.forEach(function(s,i){var a1=a+s[1]*6.2832;ctx.beginPath();ctx.arc(cx,cy,R,a,a1);ctx.strokeStyle=(hl==null||hl===i)?s[2]:'#d8dbe0';ctx.lineWidth=R*.28;ctx.stroke();var am=(a+a1)/2;TB(s[0],cx+Math.cos(am)*R*1.45,cy+Math.sin(am)*R*1.45+5,dk(s[2]),14);a=a1;});
 if(ang!=null){var aa=-1.5708+ang*6.2832;DOT(cx+Math.cos(aa)*R,cy+Math.sin(aa)*R,R*.17,INK);}}
SFA.theo("c10",{
 icon:function(){var R=Math.min(H*.3,W*.16);b4wheel(W*.32,H*.5,R,null,null);b4cellS(W*.72,H*.5,Math.min(H*.3,W*.14),4);},
 anim:function(t){var P=1400,k=(t%P)/P,cx=W*.2,cy=H*.54,R=Math.min(H*.26,W*.12);TB('Le cycle cellulaire : interphase (G1, S, G2) puis mitose (M)',W*.5,H*.07,BLUE_D,Math.max(13,Math.min(16,W/44)));
  b4wheel(cx,cy,R,k,null);
  var stage,f=0;if(k<.45){stage=0;}else if(k<.7){stage=1;f=(k-.45)/.25;}else if(k<.9){stage=2;}else{var m=(k-.9)/.1;if(m<.4){stage=3;}else if(m<.55){stage=4;}else if(m<.7){stage=5;f=(m-.55)/.15;}else{stage=6;f=(m-.7)/.3;}}
  if(k>=.9&&stage===5){}
  var rr=Math.min(H*.32,W*.17);b4cellS(W*.62,cy,rr,stage,f);TB(b4_PH[stage],W*.62,H*.93,INK,16);
  var dna=stage===0?2:stage===1?2+2*f:stage<6?4:(f>.6?2:4);var bx=W*.84,by=H*.78,bh=H*.5;TB('ADN',bx,H*.2,GREY,13);ctx.fillStyle='#eceef1';ctx.fillRect(bx-12,by-bh,24,bh);ctx.fillStyle=VIOLET;ctx.fillRect(bx-12,by-bh*dna/4,24,bh*dna/4);TB((dna>=3.99?'4C':dna<=2.01?'2C':'2C → 4C'),bx,by+22,VIOLET,14);},
 th:'<div class="tcard"><b class="h">Le cycle cellulaire</b><p><b>Interphase</b> (la plus longue) : <b>G1</b> (croissance, quantité d\'ADN 2C), <b>S</b> (<b>réplication de l\'ADN</b> : 2C → 4C ; chaque chromosome passe à 2 chromatides sœurs), <b>G2</b> (préparation, 4C). Puis la <b>mitose</b> (M) et la cytocinèse : le cytoplasme se partage.</p></div>'+
 '<div class="tcard"><b class="h">Les phases de la mitose</b><ul><li><b>Prophase</b> : les chromosomes (2 chromatides) se condensent, l\'enveloppe nucléaire disparaît, le fuseau se forme.</li><li><b>Métaphase</b> : les chromosomes s\'alignent au centre (plaque équatoriale).</li><li><b>Anaphase</b> : les chromatides sœurs se séparent et migrent vers les pôles ; chaque chromatide devient un chromosome.</li><li><b>Télophase</b> : deux noyaux se reforment, les chromosomes se décondensent ; la cytocinèse sépare les cellules.</li></ul><p>Résultat : 2 cellules filles <b>génétiquement identiques</b> entre elles et à la cellule mère (46 chromosomes chez l\'humain). Rôles : croissance, renouvellement, réparation.</p></div>'+
 '<div class="tcard"><b class="h">Compter chromosomes, chromatides, ADN</b><table><tr><td>2n = 8</td><td>chromosomes</td><td>chromatides</td><td>ADN</td></tr><tr><td>G1</td><td>8</td><td>8</td><td>2C</td></tr><tr><td>G2, prophase, métaphase</td><td>8</td><td>16</td><td>4C</td></tr><tr><td>Anaphase</td><td>16</td><td>16</td><td>4C</td></tr><tr><td>Cellule fille</td><td>8</td><td>8</td><td>2C</td></tr></table><p>La réplication double les chromatides, pas les chromosomes.</p></div>'+
 '<div class="tcard"><b class="h">Indice mitotique et durée des phases</b><p><code>indice mitotique = cellules en mitose ÷ cellules comptées</code> ; <code>durée d\'une phase = (effectif de la phase ÷ total) × durée du cycle</code>.</p><div class="tip"><b class="h">Exemple chiffré</b><br>200 cellules, 14 en mitose (8 prophase, 2 métaphase, 1 anaphase, 3 télophase), cycle de 18 h : indice = 14 ÷ 200 = <b>7 %</b> ; mitose = 0,07 × 18 = <b>1,26 h</b> ; prophase 0,72 h, métaphase 0,18 h, anaphase 0,09 h, télophase 0,27 h. Histogramme d\'ADN : 60 % à 2C → G1 = 0,60 × 20 h = <b>12 h</b> (cycle de 20 h).</div></div>'+
 '<div class="tcard"><b class="h">Contrôle du cycle et cancer</b><p>Des <b>points de contrôle</b> arrêtent le cycle si l\'ADN est abîmé. La protéine <b>p53</b> (gène suppresseur de tumeur) déclenche la réparation ou l\'<b>apoptose</b>. Si elle est inactive, les cellules à l\'ADN altéré se divisent et accumulent des mutations : <b>cancer</b>. La croissance est exponentielle : 2<sup>30</sup> ≈ 10<sup>9</sup> cellules (≈ 1 cm³) après ≈ 30 doublements ; à 60 jours par doublement : 1 800 jours ≈ 4,9 ans pour 10<sup>9</sup>, puis seulement 600 jours pour atteindre 10<sup>12</sup> (≈ 1 kg). La chimiothérapie vise les cellules en cycle (g) : survie par cure = 1 − g × E ; avec E = 0,9, tumeur (g = 0,8) 28 %, moelle (g = 0,5) 55 % ; après 3 cures 2,2 % et 16,6 %.</p></div>'
});
SFA.figs("c10",[
 /* 0 ordre des phases */
 function(p){var order=[['anaphase',5,3],['prophase',3,1],['télophase',6,4],['métaphase',4,2]],r=Math.min(H*.26,W*.11);
  order.forEach(function(o,i){var x=W*(.14+i*.24);b4cellS(x,H*.45,o[1]===6?r*.7:r,o[1],o[1]===5?.7:o[1]===6?.8:0);TB(o[0],x,H*.8,INK,15);if(p>0){b4al(b4r(p,o[2]*.12,o[2]*.12+.3));DOT(x,H*.12,14,GREEN);TB(String(o[2]),x,H*.12+6,'#fff',18);b4al(1);}});
  if(p<=0)TB('dans quel ordre ?',W*.5,H*.08,GREY,18);
  b4ans(p,'prophase, métaphase, anaphase, télophase · ADN : phase S',GREEN,H-20);},
 /* 1 cellules filles */
 function(p){var r=Math.min(H*.3,W*.14);b4cellS(W*.2,H*.45,r,0);TB('cellule mère 2n = 46',W*.2,H*.85,INK,14);A(W*.35,H*.45,W*.1,0,GREY,'',3);TB('mitose',W*.4,H*.38,GREY,13);
  if(p<=0){TB('?',W*.7,H*.45,GREY,48);}else{b4al(b4r(p,0,.4));b4cellS(W*.62,H*.45,r*.8,0);b4cellS(W*.86,H*.45,r*.8,0);TB('46',W*.62,H*.45+r*.8+22,DGREEN,16);TB('46',W*.86,H*.45+r*.8+22,DGREEN,16);TB('identiques',W*.74,H*.15,DGREEN,15);b4al(1);b4ans(p,'46 chromosomes · cellules identiques',GREEN,H-20);}},
 /* 2 quand se réplique */
 function(p){var R=Math.min(H*.25,W*.12);b4wheel(W*.3,H*.5,R,null,p>0?1:null);
  var op=[['A','prophase'],['B','phase S'],['C','anaphase'],['D','cytocinèse']];op.forEach(function(o,i){var y=H*.22+i*H*.18;b4box(W*.76,y,W*.3,H*.12,i===1&&p>0?GREEN:GREY,i===1&&p>0?'#f2fbf7':'#fff',2);TB(o[0]+'  '+o[1],W*.76,y+5,i===1&&p>0?DGREEN:INK,14);});
  if(p>0){b4al(b4r(p,0,.5));TB('2C → 4C',W*.3,H*.5+5,VIOLET,17);b4al(1);b4ans(p,'phase S de l\'interphase',GREEN,H-20);}},
 /* 3 compter */
 function(p){var st=[['G1',8,8,'2C'],['G2',8,16,'4C'],['métaphase',8,16,'4C'],['anaphase',16,16,'4C'],['fille',8,8,'2C']],M=b4ax(W*.1,H*.74,W*.84,H*.56,[0,5],[0,18],'','');M.xl=W*.1;M.yb=H*.74;
  st.forEach(function(s,i){var x=M.x(i+.5);if(p<=0){ctx.setLineDash([4,4]);ctx.strokeStyle=GREY;ctx.strokeRect(x-W*.06,M.y(8),W*.12,M.y(0)-M.y(8));ctx.setLineDash([]);TB('?',x,M.y(4)+8,GREY,22);}else{var f=b4r(p,i*.1,i*.1+.4);[[s[1],BLUE,-W*.032],[s[2],ORANGE,W*.032]].forEach(function(q){var hh=(M.y(0)-M.y(q[0]))*f;ctx.fillStyle=q[1]+'66';ctx.strokeStyle=q[1];ctx.lineWidth=2;ctx.fillRect(x+q[2]-W*.03,M.y(0)-hh,W*.06,hh);ctx.strokeRect(x+q[2]-W*.03,M.y(0)-hh,W*.06,hh);if(f>.9)TB(String(q[0]),x+q[2],M.y(q[0])-6,dk(q[1]),14);});if(f>.9)TB(s[3],x,M.y(0)+34,VIOLET,14);}
   TB(s[0],x,M.y(0)+18,INK,13);});
  TB('chromosomes',W*.2,H*.08,BLUE_D,14);TB('chromatides',W*.4,H*.08,'#8a5a17',14);
  b4ans(p,'8/8/2C · 8/16/4C · 8/16/4C · 16/16/4C · 8/8/2C',GREEN,H-20);},
 /* 4 indice mitotique */
 function(p){var cols=20,rows=10,x0=W*.1,y0=H*.12,dx=W*.5/cols,dy=H*.5/rows;var ph=[[8,RED,'prophase'],[2,ORANGE,'métaphase'],[1,GREEN,'anaphase'],[3,VIOLET,'télophase']];var k=0,cs=[];ph.forEach(function(q){for(var i=0;i<q[0];i++)cs.push(q[1]);});
  for(var i=0;i<200;i++){var c=Math.floor(i/rows),r=i%rows;var col=(p>0&&i<14)?cs[i]:(i<14?'#c8ccd0':'#dfe3e7');DOT(x0+c*dx+dx/2,y0+r*dy+dy/2,Math.min(dx,dy)*.36,col);}
  TB('200 cellules comptées · 14 en mitose',W*.35,H*.8,INK,14);
  if(p<=0)TB('indice ? durées ?',W*.8,H*.4,GREY,20);
  if(p>0){b4al(b4r(p,0,.5));var ty=H*.18;TB('indice = 7 %',W*.82,ty,DGREEN,17);TB('mitose : 1,26 h',W*.82,ty+H*.1,DGREEN,15);ph.forEach(function(q,i){TB(q[2]+' '+String(q[0]*18/200).replace('.',',')+' h',W*.82,ty+H*.22+i*H*.1,dk(q[1]),14);});b4al(1);b4ans(p,'7 % · 1,26 h · prophase la plus longue',GREEN,H-20);}},
 /* 5 histogramme ADN */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.58,[0,3],[0,70],'quantité d\'ADN','% des cellules');M.xl=W*.12;M.yb=H*.76;var b=[['2C',60,BLUE,'G1'],['2C → 4C',15,ORANGE,'S'],['4C',25,GREEN,'G2 + M']];
  b.forEach(function(q,i){var x=M.x(i+.5),hh=M.y(0)-M.y(q[1]);ctx.fillStyle=q[2]+'55';ctx.strokeStyle=q[2];ctx.lineWidth=2;ctx.fillRect(x-W*.09,M.y(0)-hh,W*.18,hh);ctx.strokeRect(x-W*.09,M.y(0)-hh,W*.18,hh);TB(q[1]+' %',x,M.y(q[1])-8,dk(q[2]),15);TB(q[0],x,M.y(0)+18,INK,13);if(p>0){b4al(b4r(p,i*.2,i*.2+.3));TB(q[3]+' : '+String(q[1]*.2).replace('.',',')+' h'.replace('.',','),x,M.y(q[1])+24,dk(q[2]),15);b4al(1);}});
  if(p<=0)TB('durée de G1 ? (cycle 20 h)',W*.7,H*.12,GREY,16);
  b4ans(p,'G1 = 0,60 × 20 h = 12 h',GREEN,H-20);},
 /* 6 doublements */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.58,[0,40],[0,12],'doublements','nombre de cellules');M.xl=W*.12;M.yb=H*.76;b4tick(M,[10,20,30,40],[],null,null);
  [3,6,9,12].forEach(function(v){var y=M.y(v);LN(M.x(0)-4,y,M.x(0),y,GREY,1);T('10'+(v===3?'³':v===6?'⁶':v===9?'⁹':'¹²'),M.x(0)-8,y+4,GREY,12,'right');LN(M.x(0),y,M.x(40),y,'#eceef1',1);});
  b4curve(M,function(n){return n*Math.log10(2);},0,40,BLUE,3.2,40);LN(M.x(0),M.y(9),M.x(30),M.y(9),RED,1.6,[5,4]);
  if(p<=0){DOT(M.x(30),M.y(9),0,RED);TB('n = ?',M.x(20),M.y(10.8),GREY,18);}
  if(p>0){b4al(b4r(p,0,.5));LN(M.x(30),M.y(9),M.x(30),M.y(0),RED,1.6,[5,4]);DOT(M.x(30),M.y(9),7,RED);TB('2³⁰ ≈ 10⁹',M.x(30)-10,M.y(9)-12,DRED,15,'right');TB('≈ 30',M.x(30),M.y(0)+32,DRED,15);b4al(1);b4ans(p,'≈ 30 doublements',GREEN,H-20);}},
 /* 7 tumeur silencieuse */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.58,[0,2400],[0,1],'jours','N / 10¹²');M.xl=W*.12;M.yb=H*.76;b4tick(M,[600,1200,1800,2400],[]);
  b4curve(M,function(t){return Math.pow(2,t/60)/Math.pow(2,40);},0,2400,BLUE,3.2,200);TB('1 cellule',M.x(0)+8,M.y(0)-10,GREY,13,'left');
  if(p<=0)TB('tumeur : ×2 tous les 60 jours',M.x(900),M.y(.6),GREY,17);
  if(p>0){b4al(b4r(p,0,.5));LN(M.x(1800),M.y(0),M.x(1800),M.y(.5),RED,1.6,[4,4]);DOT(M.x(1800),M.y(0.0009),6,RED);TB('10⁹ à 1 800 j (≈ 4,9 ans)',M.x(1800)-8,M.y(.5),DRED,14,'right');DOT(M.x(2400),M.y(1.0),6,GREEN);TB('10¹² : + 600 j',M.x(2400)-10,M.y(1)+4,DGREEN,14,'right');b4al(1);b4ans(p,'1 800 j + 600 j : détection tardive',GREEN,H-20);}},
 /* 8 chimio */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.58,[0,4],[0,100],'','% de cellules survivantes');M.xl=W*.12;M.yb=H*.76;var d=[['tumeur 1 cure',28,ORANGE],['moelle 1 cure',55,BLUE],['tumeur 3 cures',2.2,ORANGE],['moelle 3 cures',16.6,BLUE]];
  d.forEach(function(q,i){var x=M.x(i+.5);if(i>=2&&p<=0){ctx.setLineDash([4,4]);ctx.strokeStyle=GREY;ctx.strokeRect(x-W*.06,M.y(30),W*.12,M.y(0)-M.y(30));ctx.setLineDash([]);TB('?',x,M.y(15)+8,GREY,22);}else{var f=i<2?1:b4r(p,(i-2)*.15,(i-2)*.15+.4);var hh=(M.y(0)-M.y(q[1]))*f;ctx.fillStyle=q[2]+'55';ctx.strokeStyle=q[2];ctx.lineWidth=2;ctx.fillRect(x-W*.06,M.y(0)-hh,W*.12,hh);ctx.strokeRect(x-W*.06,M.y(0)-hh,W*.12,hh);if(f>.9)TB(String(q[1]).replace('.',',')+' %',x,M.y(q[1])-8,dk(q[2]),15);}TB(q[0],x,M.y(0)+18,INK,12);});
  b4ans(p,'E = 0,9 · 72 % / 45 % détruits · 2,2 % / 16,6 %',GREEN,H-20);},
 /* 9 p53 */
 function(p){var rows=[['p53 active',GREEN,0],['p53 inactive',RED,1]];rows.forEach(function(r,i){var y=H*.28+i*H*.42;if(i===1&&p<=0){TB('p53 mutée : ?',W*.5,y,GREY,22);return;}if(i===1)b4al(b4r(p,0,.5));
   TB(r[0],W*.1,y-H*.16,dk(r[1]),15,'left');var x1=W*.14;b4ell(x1,y,W*.07,H*.1,'#fdf3ee',ORA2,2.2);b4ell(x1,y,W*.025,H*.04,'#e4e0fa',VIOLET,1.6);LN(x1-8,y-4,x1+4,y+6,RED,2.4);TB('ADN abîmé',x1,y+H*.15,GREY,12);A(W*.24,y,W*.1,0,GREY,'',3);
   b4box(W*.45,y,W*.14,H*.2,r[1],'#fff',2.6);TB('p53',W*.45,y+5,dk(r[1]),16);if(i===1){LN(W*.39,y-H*.1,W*.51,y+H*.1,RED,5);LN(W*.51,y-H*.1,W*.39,y+H*.1,RED,5);}A(W*.56,y,W*.08,0,GREY,'',3);
   if(i===0){b4box(W*.8,y-H*.08,W*.24,H*.1,GREEN,'#f2fbf7',2);TB('arrêt, réparation',W*.8,y-H*.08+5,DGREEN,13);b4box(W*.8,y+H*.07,W*.24,H*.1,GREEN,'#f2fbf7',2);TB('ou apoptose',W*.8,y+H*.07+5,DGREEN,13);}
   else{b4cellS(W*.76,y,H*.1,0);b4cellS(W*.9,y,H*.1,0);TB('division + mutations',W*.83,y+H*.17,DRED,13);}b4al(1);});
  b4ans(p,'divisions sans frein : risque de cancer',GREEN,H-20);}
]);
