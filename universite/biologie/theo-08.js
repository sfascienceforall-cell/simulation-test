/* Biologie BA1 · chapitre 8 : théorie animée et devantures */
function b8_chr(x,y,h,col,dup,ang){ /* chromosome ; dup = 2 chromatides (X) */
 ctx.save();ctx.translate(x,y);ctx.rotate(ang||0);ctx.lineCap='round';ctx.strokeStyle=col;ctx.lineWidth=Math.max(3,h*.12);
 if(dup){ctx.beginPath();ctx.moveTo(-h*.16,-h*.5);ctx.lineTo(0,0);ctx.lineTo(h*.16,h*.5);ctx.moveTo(h*.16,-h*.5);ctx.lineTo(0,0);ctx.lineTo(-h*.16,h*.5);ctx.stroke();}
 else{ctx.beginPath();ctx.moveTo(0,-h*.5);ctx.lineTo(0,h*.5);ctx.stroke();}
 ctx.fillStyle='#fff';ctx.strokeStyle=col;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,h*.07,0,7);ctx.fill();ctx.stroke();ctx.restore();ctx.lineCap='butt';}
function b8_cellw(x,y,rx,ry,col,fill){ctx.fillStyle=fill||'#f4f9fe';ctx.strokeStyle=col||BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill();ctx.stroke();}
function b8_cycle(cx,cy,r,hi,txt){var ph=[['G1',.45,BLUE],['S',.25,ORANGE],['G2',.18,GREEN],['M',.12,RED]],a=-PI/2;ph.forEach(function(q){var a1=a+q[1]*2*PI;ctx.strokeStyle=(hi==null||hi===q[0])?q[2]:'#d8dbe0';ctx.lineWidth=(hi===q[0])?18:13;ctx.beginPath();ctx.arc(cx,cy,r,a+.02,a1-.02);ctx.stroke();var am=(a+a1)/2;TB(q[0],cx+(r+24)*Math.cos(am),cy+(r+24)*Math.sin(am)+4,dk(q[2]),13);a=a1;});if(txt)TB(txt,cx,cy+5,INK,13);}

SFA.theo("c08",{
 icon:function(){b8_cellw(W*.2,H*.42,40,34,BLUE);b8_chr(W*.2-12,H*.42,34,RED,true);b8_chr(W*.2+12,H*.42,34,DGREEN,true);
  TB('2n → n',W*.62,H*.4,BLUE_D,32);TB('mitose · méiose · caryotype',W*.5,H*.8,ORANGE,16);TB('1c · 2c · 4c',W*.5,H*.94,GREY,13);},
 anim:function(t){
  var ph=(t%1000)/1000,br=ph<.5?0:1,u=(ph%.5)/.5;
  var st=br===0?[[0,'G1','46 chromosomes à 1 chromatide · 2c'],[1,'S (réplication)','46 chromosomes, 92 chromatides · 2c → 4c'],[2,'G2','46 chromosomes à 2 chromatides · 4c'],[3,'métaphase','46 chromosomes à 2 chromatides · 4c'],[4,'anaphase','92 chromosomes à 1 chromatide · 4c'],[5,'fin de mitose','46 chromosomes à 1 chromatide · 2c par cellule']]
   :[[0,'G1','46 chromosomes à 1 chromatide · 2c'],[1,'S (réplication)','46 chromosomes, 92 chromatides · 2c → 4c'],[2,'G2','46 chromosomes à 2 chromatides · 4c'],[3,'métaphase I','paires de chromosomes homologues · 4c'],[4,'anaphase I','46 chromatides ségrégées par cellule fille'],[5,'fin de méiose I','23 chromosomes à 2 chromatides · 2c'],[6,'métaphase II','23 chromosomes à 2 chromatides · 2c'],[7,'anaphase II','46 chromosomes à 1 chromatide · 2c'],[8,'gamètes','23 chromosomes à 1 chromatide · 1c']];
  var idx=Math.min(st.length-1,Math.floor(u*st.length));var cur=st[idx];
  TB(br===0?'MITOSE : 2n → 2n (cellules identiques)':'MÉIOSE : 2n → n (quatre gamètes)',W*.5,20,br===0?BLUE_D:DRED,15);
  var x0=W*.08,y0=H*.72,w=W*.52,h=H*.46;var X=function(s){return x0+s/8*w;},Y=function(c){return y0-c/4*h;};
  LN(x0,y0,x0+w+10,y0,INK,1.6);LN(x0,y0,x0,y0-h-6,INK,1.6);[1,2,4].forEach(function(c){TB(c+'c',x0-6,Y(c)+4,GREY,11,'right');LN(x0-3,Y(c),x0,Y(c),INK,1);});
  ctx.strokeStyle='#9aa0a6';ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(X(0),Y(2));ctx.lineTo(X(1),Y(2));ctx.lineTo(X(2),Y(4));ctx.lineTo(X(3),Y(4));ctx.stroke();
  ctx.save();ctx.translate(0,-3);ctx.strokeStyle=BLUE;ctx.beginPath();ctx.moveTo(X(3),Y(4));ctx.lineTo(X(4),Y(4));ctx.lineTo(X(5),Y(2));ctx.stroke();ctx.restore();
  ctx.save();ctx.translate(0,3);ctx.strokeStyle=RED;ctx.beginPath();ctx.moveTo(X(3),Y(4));ctx.lineTo(X(4),Y(4));ctx.lineTo(X(5),Y(2));ctx.lineTo(X(7),Y(2));ctx.lineTo(X(8),Y(1));ctx.stroke();ctx.restore();
  var pos=[[0,2],[1,3],[2,4],[3,4],[4,4],[5,2],[6,2],[7,2],[8,1]];var pp=pos[idx];if(br===0&&idx===5)pp=[5,2];
  DOT(X(pp[0]),Y(pp[1]),7,RED);TB('mitose (bleu) : 2c',X(5)+6,Y(2)-10,BLUE_D,11,'left');TB('méiose',X(8)-6,Y(1)+18,DRED,11);TB('ADN par cellule',x0+4,y0-h-10,GREY,11,'left');
  var cx=W*.8,cy=H*.4;TB(cur[1],cx,cy-70,INK,15);
  b8_cellw(cx,cy,48,44,br?RED:BLUE);
  var nchr=3;for(var i=0;i<nchr;i++){var dup=(idx>=2&&idx<=3)||(br===1&&idx>=4&&idx<=6&&true&&idx!==7)||(idx===1);var xx=cx+(i-1)*18;
   if(br===0){if(idx===4){b8_chr(xx,cy-12,26,[RED,GREEN,BLUE][i],false);b8_chr(xx,cy+12,26,[RED,GREEN,BLUE][i],false);}else b8_chr(xx,cy,30,[RED,GREEN,BLUE][i],idx>=1&&idx<=3);}
   else{if(idx===7){b8_chr(xx,cy-12,26,[RED,GREEN,BLUE][i],false);b8_chr(xx,cy+12,26,[RED,GREEN,BLUE][i],false);}else if(idx===8)b8_chr(xx,cy,26,[RED,GREEN,BLUE][i],false);else b8_chr(xx,cy,30,[RED,GREEN,BLUE][i],idx>=1&&idx<=6);}}
  TB(cur[2],cx,cy+70,DGREEN,11);TB('(3 paires dessinées sur 23)',cx,cy+90,GREY,11);},
 th:'<div class="tcard"><b class="h">Cycle cellulaire et points de contrôle</b><p>Interphase : <b>G1</b> (croissance), <b>S</b> (réplication de l\'ADN : de 2c à 4c), <b>G2</b> (préparation) ; puis <b>M</b> (mitose et cytocinèse). Exemple : G1 = 10 h, S = 8 h, G2 = 4 h, M = 1 h : 23 h par cycle ; 1 000 cellules à partir d\'une seule demandent 10 divisions (2<sup>10</sup> = 1 024), soit 230 h.</p><p><b>Points de contrôle</b> : G1/S (ADN intact ? taille ?), G2/M (réplication terminée ? ADN intact ?), métaphase (fuseau : tous les chromosomes attachés ?). La protéine <b>p53</b>, activée par des cassures de l\'ADN, bloque en G1/S (réparation) ou déclenche l\'apoptose ; sans p53 fonctionnelle, la cellule poursuit son cycle avec un ADN lésé : accumulation de mutations, cancer. Une tumeur de 10<sup>9</sup> cellules (≈ 1 cm<sup>3</sup>) correspond à 30 doublements (2<sup>30</sup> ≈ 10<sup>9</sup>) : 30 jours si une division par jour sans perte ; en réalité, quiescence et mort cellulaire allongent le temps de doublement.</p></div><div class="tcard"><b class="h">Compter : chromosomes, chromatides, quantité d\'ADN</b><p>Cellule humaine 2n = 46 ; 1c = ADN d\'un gamète. Un chromosome a 1 chromatide avant la phase S, 2 après. <b>G1 : 46 chromosomes, 46 chromatides, 2c. Après S : 46 chromosomes, 92 chromatides, 4c.</b></p><ul><li><b>Mitose</b> : anaphase (centromères clivés) = 92 chromosomes à 1 chromatide, 4c dans la cellule ; en fin : 2 cellules à 46 chromosomes, 2c.</li><li><b>Méiose I</b> (séparation des homologues) : fin = 23 chromosomes à 2 chromatides, 2c par cellule fille ; <b>méiose II</b> (séparation des chromatides) : métaphase II = 23 chromosomes, 46 chromatides, 2c ; anaphase II = 46 chromosomes à 1 chromatide, 2c ; fin : 23 chromosomes à 1 chromatide, 1c.</li></ul><p>Piège : la quantité d\'ADN ne change pas à l\'anaphase (la cellule ne se divise qu\'à la cytocinèse) et le nombre de chromosomes double en anaphase de mitose.</p></div><div class="tcard"><b class="h">Brassage génétique</b><p><b>Interchromosomique</b> : n paires hétérozygotes → <b>2<sup>n</sup></b> gamètes (3 paires : 8 ; la probabilité de n chromosomes tous maternels est 1/2<sup>n</sup>, soit 1/8 et ≈ 1,2·10<sup>−7</sup> pour 23). Deux parents identiques : 8 × 8 = 64 combinaisons de gamètes. <b>Intrachromosomique</b> : un crossing-over entre deux locus hétérozygotes double encore le nombre de gamètes : 23 paires dont 10 avec crossing-over → 2<sup>33</sup> ≈ 8,6·10<sup>9</sup> gamètes, 2<sup>66</sup> ≈ 7,4·10<sup>19</sup> zygotes.</p></div><div class="tcard"><b class="h">Non-disjonction et caryotype</b><p>Une paire (méiose I) ou des chromatides sœurs (méiose II) ne se séparent pas : gamètes n+1 et n−1. Après fécondation par un gamète normal : trisomie (2n+1, ex. 47,XX,+21) ou monosomie (2n−1, généralement non viable sauf X). Non-disjonction en <b>méiose I</b> : le gamète porte les <b>deux homologues</b> (maternel et paternel, donc deux allèles différents si hétérozygote) ; en <b>méiose II</b> : deux chromatides <b>identiques</b>. 47,XXY (Klinefelter) : non-disjonction maternelle en I ou II, ou paternelle en I ; paternelle en II donnerait XXX ou XYY, pas XXY. Le risque de trisomie 21 augmente avec l\'âge maternel (ovocytes bloqués en prophase I depuis la vie fœtale) : 0,05 % (&lt; 25 ans) contre 1 % (≥ 40 ans) dans l\'exemple, χ² ≈ 17,3 &gt; 10,83.</p></div><div class="tcard"><b class="h">Gamétogenèse et premiers jours</b><p><b>Spermatogenèse</b> : 1 spermatocyte I → 4 spermatozoïdes (continue après la puberté). <b>Ovogenèse</b> : 1 ovocyte I → 1 ovule + 2 ou 3 globules polaires ; ovocyte I bloqué en prophase I dès la vie fœtale, ovocyte II bloqué en métaphase II jusqu\'à la fécondation. <b>Fécondation</b> → zygote (2n) → clivages → morula (J3-J4) → blastocyste (≈ J5) → implantation (≈ J6-J7).</p></div>'
});
SFA.figs("c08",[
 function(p){ /* 0 après phase S */
  bio_cap('Cellule 2n = 46 juste après la phase S',22);
  b8_cellw(W*.3,H*.55,W*.2,H*.3,BLUE);var cs=[RED,GREEN,BLUE,ORANGE,VIOLET];for(var i=0;i<5;i++)b8_chr(W*.2+i*W*.05,H*.55+(i%2?10:-8),44,cs[i],true);TB('· · ·',W*.3,H*.55+50,GREY,16);
  TB('46 chromosomes',W*.74,H*.34,INK,15);bio_pop(p,function(){TB('chacun à 2 chromatides',W*.74,H*.46,DGREEN,13);TB('→ 92 chromatides',W*.74,H*.58,DGREEN,15);TB('quantité d\'ADN : 4c',W*.74,H*.74,DRED,17);});},
 function(p){ /* 1 métaphase II */
  bio_cap('Métaphase II de la méiose',22);
  b8_cellw(W*.27,H*.52,W*.2,H*.3,RED);LN(W*.27,H*.2,W*.27,H*.84,GREY,1.4,[4,4]);var cs=[RED,GREEN,BLUE,ORANGE,VIOLET];for(var i=0;i<5;i++)b8_chr(W*.27,H*.3+i*H*.1,34,cs[i],true,1.57);
  TB('plaque équatoriale',W*.27,H*.92,GREY,12);TB('chromosomes ? chromatides ?',W*.74,H*.4,GREY,14);
  bio_pop(p,function(){TB('23 chromosomes',W*.74,H*.55,DGREEN,16);TB('46 chromatides',W*.74,H*.67,DGREEN,16);});},
 function(p){ /* 2 réplication ADN : cycle */
  bio_cap('Quelle phase réplique l\'ADN ?',22);
  b8_cycle(W*.5,H*.55,H*.28,p>0?'S':null,'cycle');
  bio_pop(p,function(){TB('phase S : 2c → 4c',W*.5,H*.97,DRED,16);});},
 function(p){ /* 3 1000 cellules */
  bio_cap('G1 10 h · S 8 h · G2 4 h · M 1 h = 23 h',22);
  var x0=W*.12,y0=H*.8,w=W*.8,h=H*.58;bio_ax(x0,y0,w,h,'divisions','cellules');
  var X=function(n){return x0+n/10*w;},Y=function(v){return y0-v/1100*h;};
  for(var n=0;n<=10;n++){TB(''+n,X(n),y0+15,GREY,11);}
  bio_fn(function(n){return Math.pow(2,n);},0,10,X,Y,BLUE,2.8,40);
  [0,5,10].forEach(function(n){});TB('2¹⁰ = 1 024',X(10)-6,Y(1024)-6,DRED,13,'right');
  LN(x0,Y(1000),x0+w,Y(1000),GREY,1.2,[5,4]);TB('1 000',x0+4,Y(1000)-5,GREY,12,'left');
  bio_pop(p,function(){DOT(X(10),Y(1024),6,RED);TB('10 divisions × 23 h = 230 h',W*.5,H*.4,DGREEN,15);TB('≈ 9,6 jours',W*.5,H*.5,DGREEN,15);});},
 function(p){ /* 4 brassage */
  bio_cap('3 paires de chromosomes hétérozygotes (2n = 6)',22);
  var cs=[RED,GREEN,BLUE];for(var j=0;j<3;j++){var x=W*.1+j*W*.13;b8_chr(x,H*.34,40,cs[j],false);b8_chr(x+14,H*.34,40,'#8a8f98',false);TB('A/a'.replace('A',['A','B','C'][j]).replace('a',['a','b','c'][j]),x+7,H*.34+36,GREY,12);}
  TB('2 · 2 · 2 = 2³ = 8 gamètes',W*.72,H*.28,INK,15);TB('différents',W*.72,H*.38,GREY,13);
  bio_pop(p,function(){TB('(a) 8 types de gamètes',W*.5,H*.62,DGREEN,15);TB('(b) 8 × 8 = 64 combinaisons',W*.5,H*.74,DGREEN,15);TB('(c) 3 maternels : 1/8 · pour n = 23 : 1,2·10⁻⁷',W*.5,H*.87,DRED,15);});},
 function(p){ /* 5 fin de méiose I */
  bio_cap('Fin de la méiose I : une cellule fille',22);
  b8_cellw(W*.3,H*.52,W*.2,H*.3,RED);var cs=[RED,GREEN,BLUE];for(var i=0;i<3;i++)b8_chr(W*.2+i*W*.1,H*.52,52,cs[i],true);
  TB('23 chromosomes',W*.76,H*.34,INK,15);TB('à 2 chromatides',W*.76,H*.45,INK,15);
  bio_pop(p,function(){TB('ADN : 2c',W*.76,H*.62,DRED,18);TB('(la méiose I sépare les homologues)',W*.5,H*.92,GREY,12);});},
 function(p){ /* 6 non-disjonction MI */
  bio_cap('Non-disjonction de la paire 21 en méiose I (ovocyte)',22);
  b8_cellw(W*.22,H*.5,W*.14,H*.22,RED);b8_chr(W*.2,H*.5,34,BLUE,true);b8_chr(W*.25,H*.5,34,GREEN,true);
  A(W*.37,H*.5,32,0,GREY,'',2);
  b8_cellw(W*.62,H*.36,W*.12,H*.15,GREY,'#f1f3f5');b8_cellw(W*.62,H*.68,W*.12,H*.15,RED);
  b8_chr(W*.6,H*.68,28,BLUE,true);b8_chr(W*.65,H*.68,28,GREEN,true);TB('ovocyte II : 2 chr. 21',W*.62+W*.13,H*.68+4,DRED,11,'left');TB('globule polaire : 0',W*.62+W*.13,H*.36+4,GREY,11,'left');
  bio_pop(p,function(){TB('1/2 n+1 · 1/2 n−1 · 0 normal',W*.5,H*.9,DRED,15);TB('→ trisomie 21 ou monosomie 21',W*.5,H*.98,DGREEN,13);});},
 function(p){ /* 7 crossing-over */
  bio_cap('23 paires dont 10 avec crossing-over',22);
  var x=W*.2,y=H*.5;b8_chr(x,y,70,RED,true,0);b8_chr(x+34,y,70,BLUE,true,0);
  ctx.strokeStyle=GREEN;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x+17,y-12,10,0,7);ctx.stroke();TB('crossing-over',x+17,y-50,DGREEN,12);
  TB('chaque crossing-over entre',W*.42,H*.38,INK,13,'left');TB('locus hétérozygotes : × 2',W*.42,H*.48,INK,13,'left');
  bio_pop(p,function(){TB('2²³ × 2¹⁰ = 2³³ ≈ 8,6·10⁹ gamètes',W*.5,H*.76,DRED,17);TB('zygotes : 2⁶⁶ ≈ 7,4·10¹⁹',W*.5,H*.88,DGREEN,16);});},
 function(p){ /* 8 p53 absente */
  bio_cap('Dommages à l\'ADN · point de contrôle G1/S',22);
  b8_cycle(W*.3,H*.56,H*.26,'G1','');
  A(W*.3+H*.3,H*.28,12,0,RED,'',2);TB('ADN lésé',W*.3+H*.3+22,H*.28+4,DRED,12,'left');
  TB('avec p53 : arrêt, réparation',W*.76,H*.4,DGREEN,13);bio_pop(p,function(){TB('sans p53 : le cycle continue',W*.76,H*.58,DRED,14);TB('ADN lésé répliqué',W*.76,H*.68,DRED,13);TB('→ mutations, cancer',W*.76,H*.78,DRED,15);});},
 function(p){ /* 9 tumeur */
  bio_cap('Croissance d\'une tumeur · 1 division / 24 h',22);
  var x0=W*.14,y0=H*.74,w=W*.78,h=H*.54;bio_ax(x0,y0,w,h,'divisions (jours)','cellules (log)');
  var X=function(n){return x0+n/32*w;},Y=function(v){return y0-(Math.log(v)/Math.LN10)/10*h;};
  [0,10,20,30].forEach(function(n){TB(''+n,X(n),y0+15,GREY,11);});[1,3,6,9].forEach(function(e){TB('10'+'⁰¹²³⁴⁵⁶⁷⁸⁹'[e],x0-6,y0-e/10*h+4,GREY,11,'right');});
  LN(x0,Y(1e9),x0+w,Y(1e9),GREY,1.2,[5,4]);TB('10⁹ cellules (1 cm³)',x0+4,Y(1e9)-5,GREY,12,'left');
  bio_fn(function(n){return Math.pow(2,n);},0,30,X,Y,BLUE,2.8,40);
  bio_pop(p,function(){DOT(X(30),Y(1e9),6,RED);TB('30 divisions = 30 jours',x0+10,Y(1e9)+34,DRED,13,'left');TB('en réalité 100 jours : doublement 3,3 j (≈ 30 %)',W*.5,H*.97,DGREEN,13);});},
 function(p){ /* 10 anaphase II */
  bio_cap('Anaphase II',22);
  b8_cellw(W*.3,H*.52,W*.2,H*.3,RED);var cs=[RED,GREEN,BLUE];for(var i=0;i<3;i++){b8_chr(W*.22+i*W*.08,H*.52-26,30,cs[i],false);b8_chr(W*.22+i*W*.08,H*.52+26,30,cs[i],false);}
  A(W*.3,H*.44,0,-14,GREY,'',2);A(W*.3,H*.62,0,14,GREY,'',2);
  TB('46 chromosomes',W*.76,H*.34,INK,15);TB('à 1 chromatide',W*.76,H*.45,INK,15);
  bio_pop(p,function(){TB('ADN : encore 2c',W*.76,H*.62,DRED,16);TB('(la cellule n\'est pas encore divisée)',W*.5,H*.92,GREY,12);});},
 function(p){ /* 11 Klinefelter */
  bio_cap('Garçon 47,XXY : quelle non-disjonction ?',22);
  var items=[['(1) mère, méiose I','ovule XX + spz Y',1],['(2) mère, méiose II','ovule XX + spz Y',1],['(3) père, méiose I','spz XY + ovule X',1],['(4) père, méiose II','spz XX ou YY : XXX ou XYY',0]];
  items.forEach(function(it,i){var y=H*.26+i*H*.17;bio_rb(W*.24,y,W*.4,34,INK,it[0],12);bio_pop(p,function(){TB(it[1],W*.48,y+5,it[2]?DGREEN:DRED,12,'left');TB(it[2]?'✓':'✗',W*.94,y+6,it[2]?DGREEN:DRED,18);});});
  bio_pop(p,function(){TB('(1), (2) et (3)',W*.5,H*.95,DGREEN,15);});},
 function(p){ /* 12 âge maternel */
  bio_cap('Trisomie 21 : mères < 25 ans et ≥ 40 ans (2 000 chacune)',22);
  var y0=H*.8,h=H*.5;LN(W*.1,y0,W*.9,y0,INK,1.6);
  var d=[['< 25 ans',1,.05,GREEN],['≥ 40 ans',20,1,RED]];d.forEach(function(q,i){var x=W*.2+i*W*.34,bh=q[1]/20*h;ctx.fillStyle=i?'#fdece4':'#e1f5ee';ctx.fillRect(x,y0-bh,70,bh);ctx.strokeStyle=q[3];ctx.lineWidth=2;ctx.strokeRect(x,y0-bh,70,bh);TB(q[1]+' / 2 000',x+35,y0-bh-6,dk(q[3]),13);TB(q[0],x+35,y0+18,INK,13);});
  bio_pop(p,function(){TB('0,05 % → 1 % : × 20',W*.3,H*.3,DRED,15);TB('χ² ≈ 17,3 > 10,83',W*.3,H*.4,DRED,14);TB('p < 0,001',W*.3,H*.5,DRED,14);});},
 function(p){ /* 13 quelle non-disjonction */
  bio_cap('Mère A/a · père a/a · enfant A/a/a',22);
  var rows=[['mère, méiose I','ovule A/a + spz a','✓',1],['mère, méiose II','ovule a/a ou A/A','✗',0],['père, méiose I ou II','spz a/a + ovule A','✓',1]];
  rows.forEach(function(r,i){var y=H*.3+i*H*.2;bio_rb(W*.23,y,W*.38,36,INK,r[0],12);bio_pop(p,function(){TB(r[1],W*.46,y+5,r[3]?DGREEN:DRED,13,'left');TB(r[2],W*.94,y+6,r[3]?DGREEN:DRED,20);});});
  bio_pop(p,function(){TB('un 2e marqueur hétérozygote départage',W*.5,H*.93,DGREEN,14);});}
]);
