/* Chimie BA1 · c10 · Alcools, carbonyles, acides et dérivés — théorie animée et devantures, contenu SFA original. */
/* ---- aides locales (préfixe uh_) ---- */
function uh_e(p,a,b){return Math.max(0,Math.min(1,(p-a)/((b-a)||1)));}
function uh_al(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function uh_ttl(s){TB(s,W*.5,20,GREY,13);}
function uh_ax(x0,y0,w,h,xa,xb,ya,yb,xl,yl){LN(x0,y0,x0+w+8,y0,GREY,1.5);LN(x0,y0+4,x0,y0-h-8,GREY,1.5);
 if(xl)TB(xl,x0+w+8,y0+33,GREY,12,'right');if(yl)TB(yl,x0+6,y0-h-12,GREY,12,'left');
 return {X:function(x){return x0+(x-xa)/(xb-xa)*w;},Y:function(y){return y0-(y-ya)/(yb-ya)*h;}};}
function uh_fn(m,f,a,b,col,lw,upto,dash){var n=120,e=upto==null?b:a+(b-a)*upto;ctx.strokeStyle=col;ctx.lineWidth=lw||2.5;if(dash)ctx.setLineDash(dash);ctx.beginPath();
 for(var i=0;i<=n;i++){var x=a+(e-a)*i/n,y=f(x);i?ctx.lineTo(m.X(x),m.Y(y)):ctx.moveTo(m.X(x),m.Y(y));}ctx.stroke();ctx.setLineDash([]);}
function uh_rr(x,y,w,h,fill,stroke,lw,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r==null?8:r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function uh_atom(x,y,s,col,r){r=r||14;DOT(x,y,r,'#fff');ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(s,x,y+r*.36,col,Math.round(r*.95));}
function uh_bd(x1,y1,x2,y2,n,col,w){var dx=y2-y1,dy=x1-x2,l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;var o=(n-1)*2.6;
 for(var i=0;i<n;i++){var k=-o+i*5.2;LN(x1+dx*k,y1+dy*k,x2+dx*k,y2+dy*k,col||INK,w||2.2);}}
function uh_wave(x0,y0,len,amp,lam,ph,col,lw){ctx.strokeStyle=col;ctx.lineWidth=lw||2.4;ctx.beginPath();for(var i=0;i<=len;i+=2){var y=y0-amp*Math.sin(2*PI*i/lam-ph);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.stroke();}
function uh_wl(l){var r=0,g=0,b=0;if(l<380)return '#7F77DD';if(l<440){r=(440-l)/60;b=1;}else if(l<490){g=(l-440)/50;b=1;}else if(l<510){g=1;b=(510-l)/20;}else if(l<580){r=(l-510)/70;g=1;}else if(l<645){r=1;g=(645-l)/65;}else if(l<=750){r=1;}else return '#a32d2d';
 return 'rgb('+Math.round(r*220)+','+Math.round(g*190)+','+Math.round(b*220)+')';}
function uh_nuc(x,y,A,Z,s,col,sz){sz=sz||20;TB(String(A),x-sz*.55,y-sz*.25,col,sz*.55,'right');TB(String(Z),x-sz*.55,y+sz*.4,col,sz*.55,'right');TB(s,x-sz*.45,y+sz*.35,col,sz,'left');}
function uh_f(v,d){return Number(v).toFixed(d==null?2:d).replace('.',',').replace('-','−');}
function uh_tag(s,x,y,col,sz,a){if(a!=null)uh_al(a);tag(s,x,y,col,sz||13);ctx.globalAlpha=1;}

/* ---- c10 : aides ---- */
function c10_at(s,x,y,col,sz,al){sz=sz||17;ctx.font='600 '+sz+'px system-ui';var w=ctx.measureText(s).width;var x0=al=='left'?x:al=='right'?x-w:x-w/2;ctx.fillStyle='#fff';ctx.fillRect(x0-3,y-sz*.78,w+6,sz*1.05);TB(s,x,y,col||INK,sz,al||'center');}
function c10_dbl(x1,y1,x2,y2,col){uh_bd(x1,y1,x2,y2,2,col||INK,2.4);}
function c10_chain(parts,cx,y,sz){ctx.font='600 '+sz+'px system-ui';var ws=parts.map(function(p){return ctx.measureText(p[0]).width;}),tot=ws.reduce(function(a,b){return a+b;},0),x=cx-tot/2;
 parts.forEach(function(p,i){if(p[2]){ctx.fillStyle=p[2];ctx.globalAlpha=.18;ctx.fillRect(x-3,y-sz*.85,ws[i]+6,sz*1.2);ctx.globalAlpha=1;ctx.strokeStyle=p[2];ctx.lineWidth=1.6;ctx.strokeRect(x-3,y-sz*.85,ws[i]+6,sz*1.2);}TB(p[0],x,y,p[1]||INK,sz,'left');x+=ws[i];});}
function c10_steps(q,rows,labs){var n=rows.length,h=44,gap=(H-n*h)/(n+.3);rows.forEach(function(r,i){var a=i==0?1:uh_e(q,(i-1)/(n-1)*.8,(i-1)/(n-1)*.8+.3);var y=gap*.5+i*(h+gap);
  if(a<=0){uh_rr(46,y,368,h,'#f6f7f8','#e2e4e7',1.6);return;}uh_al(a);uh_rr(46,y,368,h,'#fff',r[2],2.4);TB(r[0],W*.5,y+21,INK,17);TB(r[1],W*.5,y+37,dk(r[2]),12.5);
  if(i>0){var yy=y-gap+4;A(66,yy,0,gap-10,GREY,'',2);TB(labs[i-1],78,yy+gap*.5+4,GREY,13,'left');}ctx.globalAlpha=1;});}
SFA.theo("c10",{
 icon:function(){TB('R–CH₂OH → R–CHO → R–COOH',W*.5,H*.4,BLUE_D,24);TB('RMgX · LiAlH₄ · estérification',W*.5,H*.62,ORANGE,18);TB('amides et peptides',W*.5,H*.82,GREY,16);},
 anim:function(t){var st=Math.floor(t/110)%4,f=(t%110)/110,xs=[W*.16,W*.5,W*.84],nm=[['R–CH₂–OH','alcool 1°'],['R–CHO','aldéhyde'],['R–COOH','acide carboxylique']],no=['−I','+I','+III'],cs=[BLUE,GREEN,ORA2];
  TB('oxydation d’un alcool primaire : le carbone perd des électrons',W*.5,24,GREY,14);
  for(var i=0;i<3;i++){var on=st>=i,x=xs[i];uh_rr(x-70,56,140,74,on?'#fff':'#f6f7f8',on?cs[i]:'#d8dbde',on?3:1.6);TB(nm[i][0],x,88,on?INK:GREY,20);TB(nm[i][1],x,114,on?dk(cs[i]):GREY,14);uh_atom(x,160,no[i],on?cs[i]:GREY,22);TB('n.o. du carbone',x,206,GREY,13);}
  for(var j=0;j<2;j++){var xa=xs[j]+74,xb=xs[j+1]-74,act=st==j+1;LN(xa,93,xb-4,93,act?ORA2:'#d8dbde',3);A(xb-14,93,12,0,act?ORA2:'#d8dbde','',3);TB(j==0?'PCC':'CrO₃/H₂SO₄',(xa+xb)/2,80,act?DRED:GREY,13);
   if(act){for(var k=0;k<3;k++){var u=(f+k/3)%1;DOT(xa+(xb-xa)*u,102,4,BLUE);}TB('−2 e⁻',(xa+xb)/2,124,BLUE_D,14);}}
  uh_rr(40,236,300,40,'#fff',GREEN,2);TB('alcool 2° → cétone : n.o. 0 → +II, on s’arrête là',190,261,DGREEN,13);uh_rr(360,236,300,40,'#fff',RED,2);TB('alcool 3° : pas de H sur C–OH, pas d’oxydation',510,261,DRED,13);},
 th:'<div class="tcard"><b class="h">Alcools : oxydation, déshydratation, substitution</b><p>Un alcool est <b>primaire, secondaire ou tertiaire</b> selon le nombre de carbones liés au C–OH. <b>Oxydation</b> : 1° → aldéhyde (oxydant ménagé, PCC dans CH₂Cl₂) puis → <b>acide carboxylique</b> (CrO₃/H₂SO₄, KMnO₄, oxydant fort) ; 2° → <b>cétone</b> (arrêt : plus de H sur le carbone) ; 3° → <b>aucune oxydation</b>. Le n.o. du carbone passe de −I à +I puis +III (1°), de 0 à +II (2°).</p><p><b>Déshydratation</b> (H₂SO₄ concentré, chaleur, mécanisme E1 pour 2° et 3°) : l’alcène <b>le plus substitué</b> domine (règle de Zaitsev) ; facilité 3° &gt; 2° &gt; 1°. <b>Substitution</b> par HX : passe par le carbocation (3° &gt; 2°). <b>Exemple</b> : butan-2-ol → but-2-ène (majoritaire) par H₂SO₄ ; → butanone par PCC (la 2,4-DNPH réagit, la liqueur de Fehling non : c’est une cétone).</p></div>'+
 '<div class="tcard"><b class="h">Acidité et ionisation</b><p>pKa approximatifs : <b>acide carboxylique ≈ 4–5</b> (éthanoïque 4,76) ; phénol ≈ 10 ; eau 15,7 ; alcool ≈ 16. Le <b>carboxylate</b> est stabilisé par <b>résonance</b> (charge répartie sur deux O) : c’est pourquoi un acide carboxylique est bien plus acide qu’un alcool. L’<b>effet inductif attracteur</b> d’un halogène renforce l’acidité, d’autant plus qu’il est proche du COOH : butanoïque (≈ 4,8) &lt; 4-chloro (≈ 4,5) &lt; 3-chloro (≈ 4,1) &lt; 2-chloro (≈ 2,9).</p><p><b>Henderson–Hasselbalch</b> : fraction neutre = 1/(1 + 10<sup>pH−pKa</sup>). <b>Aspirine</b> (pKa 3,5) : pH 1,5 → 99,0 % neutre (1 % ionisée) ; pH 7,4 → 99,99 % ionisée. Seule la forme neutre traverse bien les membranes : en <b>alcalinisant l’urine</b> (pH 5,0 → 8,0), la fraction neutre passe de 3,1 % à 0,0032 %, la réabsorption chute d’un facteur ≈ 10³ (piégeage ionique).</p></div>'+
 '<div class="tcard"><b class="h">Esters : estérification, hydrolyse, saponification</b><p><b>Fischer</b> : RCOOH + R′OH ⇌ RCOOR′ + H₂O, catalysée par H⁺, équilibre de constante K ≈ 4 (ΔH° ≈ 0 : la température ne déplace pas K, le catalyseur ne change que la vitesse). Rendement : 1 mol/1 mol → x/(1 − x) = 2, soit <b>67 %</b> ; avec 5 mol d’alcool : 3x² − 24x + 20 = 0, <b>94,5 %</b>. Pour déplacer l’équilibre : <b>excès d’un réactif</b> ou <b>retrait de l’eau</b> (Dean–Stark). L’hydrolyse acide est la réaction inverse (excès d’eau).</p><p><b>Saponification</b> : RCOOR′ + OH⁻ → RCOO⁻ + R′OH, <b>quasi totale</b> car le carboxylate formé est déprotoné (K ≈ 10⁹). Loi v = k[ester][OH⁻] ; avec [ester]₀ = [OH⁻]₀ = 0,050 mol/L et k = 0,11 L/(mol·s) : t½ = 1/(k[ester]₀) = 182 s ; avec OH⁻ en grand excès (1,00 mol/L), pseudo-ordre 1 : k′ = 0,11 s⁻¹, t½ = 6,3 s.</p></div>'+
 '<div class="tcard"><b class="h">Carbonyles : réduction et Grignard</b><p>Réactivité vis-à-vis des nucléophiles : <b>aldéhyde &gt; cétone &gt; ester &gt; acide carboxylique</b> (le doublet de l’O de l’ester ou de l’acide diminue le δ⁺ du carbone par résonance). <b>NaBH₄</b> (doux, dans un alcool) réduit aldéhydes et cétones en alcools 1° et 2°, <b>pas les esters</b> ; <b>LiAlH₄</b> (éther anhydre puis H₃O⁺) réduit aussi esters et acides en alcools primaires.</p><p><b>RMgX</b> (solvant éther <b>anhydre aprotique</b> : un solvant protique le détruit) : aldéhyde → alcool 2° ; cétone → alcool 3° ; <b>ester + 2 RMgX → alcool tertiaire</b> à deux groupes R identiques + R′OH. <b>Exemples</b> : éthanoate d’éthyle + 2 CH₃MgBr → 2-méthylpropan-2-ol + éthanol ; le 3-méthylpentan-3-ol s’obtient par pentan-3-one + CH₃MgBr, butanone + C₂H₅MgBr, ou éthanoate d’éthyle + 2 C₂H₅MgBr. <b>Cyanhydrine</b> : HCN s’additionne en R₂C(OH)–CN.</p></div>'+
 '<div class="tcard"><b class="h">Amides et peptides</b><p>La liaison <b>amide</b> R–CO–NR′₂ est stabilisée par <b>résonance</b> (N–C=O ↔ N⁺=C–O⁻) : elle est <b>plane</b>, la rotation autour de C–N est freinée, et l’azote n’est pratiquement pas basique. Le groupe amide est le moins réactif des dérivés d’acide (chlorure d’acyle &gt; anhydride &gt; ester &gt; amide), ce qui assure la stabilité des protéines.</p><p><b>Dipeptide</b> : deux acides aminés se condensent avec <b>perte d’une molécule d’eau</b> (liaison peptidique). Gly + Ala → Gly-Ala + H₂O : M = 75,07 + 89,09 − 18,015 = <b>146,14 g/mol</b>. En général M(peptide) = ΣM(acides aminés) − (n − 1) × 18,015.</p></div>'
});
SFA.figs("c10",[
 /* 0 oxydation propan-2-ol */
 function(p){var q=uh_e(p,0,.7),cx=90,cy=150;LN(cx,cy,cx-42,cy+26,INK,2.4);LN(cx,cy,cx+42,cy+26,INK,2.4);LN(cx,cy,cx,cy-44,INK,2.4);c10_at('OH',cx,cy-52,DRED,19);c10_at('H',cx+16,cy-6,GREY,14);TB('propan-2-ol',cx,230,GREY,13);TB('C : n.o. 0',cx,252,BLUE_D,14);
  TB('CrO₃ / H₂SO₄',W*.5,114,ORANGE,15);A(165,130,100,0,ORANGE,'',3);
  if(q>0){uh_al(q);var dx=370;LN(dx,cy,dx-42,cy+26,INK,2.4);LN(dx,cy,dx+42,cy+26,INK,2.4);c10_dbl(dx,cy,dx,cy-44,DRED);c10_at('O',dx,cy-52,DRED,19);TB('propanone',dx,230,GREY,13);TB('C : n.o. +II',dx,252,DRED,14);TB('−2 e⁻',W*.5,160,BLUE_D,14);TB('plus de H sur C : arrêt',W*.5,190,DRED,13);ctx.globalAlpha=1;}else TB('?',370,150,GREY,34);},
 /* 1 dipeptide */
 function(p){var q=uh_e(p,0,.7);TB('Gly',70,34,BLUE_D,18);TB('M = 75,07',70,56,GREY,14);TB('+',140,48,INK,22);TB('Ala',210,34,GREEN,18);TB('M = 89,09',210,56,GREY,14);A(262,44,70,0,ORANGE,'',3);TB('− H₂O (18,015)',330,30,ORANGE,14);
  c10_chain([['H₂N–CH₂–',INK],['C(=O)–NH',DRED,ORA2],['–CH(CH₃)–COOH',INK]],W*.5,130,17);TB('Gly-Ala',W*.5,100,INK,16);TB('liaison amide (peptidique)',W*.5,166,DRED,14);
  uh_al(q);uh_rr(60,196,340,56,'#fff7ea',ORANGE,2);TB('M = 75,07 + 89,09 − 18,015',W*.5,220,INK,15);TB('= 146,14 g/mol',W*.5,242,ORANGE,18);ctx.globalAlpha=1;},
 /* 2 plus acide */
 function(p){var q=uh_e(p,0,.7),X=function(v){return 40+v/18*(W-70);},y=130;LN(40,y,W-30,y,GREY,2.4);for(var v=0;v<=18;v+=2){LN(X(v),y-4,X(v),y+4,GREY,1.4);TB(v,X(v),y+22,GREY,12);}TB('pKa',40,y+40,GREY,13,'left');
  [[4.76,'éthanoïque',GREEN,'u'],[10,'phénol',ORANGE,'u'],[15.7,'eau',BLUE,'d'],[16,'éthanol',VIOLET,'u']].forEach(function(r){var x=X(r[0]),al=r[3]=='d'?'right':(r[0]>15?'left':'center'),dx=r[0]>15?(r[3]=='d'?4:-4):0;DOT(x,y,8,r[2]);var v='≈ '+uh_f(r[0],r[0]%1?(r[0]>15?1:2):0);
   if(r[3]=='u'){TB(r[1],x+dx,y-50,dk(r[2]),14,al);TB(v,x+dx,y-34,GREY,13,al);}else{TB(r[1]+' '+v,x+dx,y+46,dk(r[2]),13,al);}});
  A(W*.6,y+62,-W*.4,0,DGREEN,'',2.6);TB('plus acide',W*.4,y+86,DGREEN,15);uh_al(q);ctx.strokeStyle=GREEN;ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(4.76),y,17,0,7);ctx.stroke();uh_tag('carboxylate stabilisé par résonance',W*.5,236,DRED,14);ctx.globalAlpha=1;},
 /* 3 rendement estérification */
 function(p){var q=uh_e(p,0,.7),m=uh_ax(64,H-46,W-100,H-90,0,10,0,1.0,'n(alcool) / n(acide)','rendement'),f=function(r){return (4*(1+r)-Math.sqrt(16*(1+r)*(1+r)-48*r))/6;};uh_fn(m,f,.3,10,BLUE,3);
  [0,2,4,6,8,10].forEach(function(v){TB(v,m.X(v),H-28,GREY,12);});[0,.5,1].forEach(function(v){TB(v*100+' %',58,m.Y(v)+4,GREY,12,'right');});
  [[1,GREEN,'67 %',24,24],[5,ORANGE,'94,5 %',20,24]].forEach(function(P,i){DOT(m.X(P[0]),m.Y(f(P[0])),7,P[1]);if(q>i*.4){uh_al(Math.min(1,(q-i*.4)*4));LN(m.X(P[0]),H-46,m.X(P[0]),m.Y(f(P[0])),P[1],1.4,[4,3]);uh_tag(P[2],m.X(P[0])+P[3],m.Y(f(P[0]))+(i?-22:30),dk(P[1]),15);ctx.globalAlpha=1;}});
  TB('K = 4',W*.7,m.Y(.35),GREY,15);},
 /* 4 aspirine pH */
 function(p){var q=uh_e(p,0,.7),m=uh_ax(64,H-46,W-100,H-90,0,9,0,1,'pH','% ionisé'),f=function(h){return 1/(1+Math.pow(10,3.5-h));};uh_fn(m,f,0,9,BLUE,3);[0,2,4,6,8].forEach(function(v){TB(v,m.X(v),H-28,GREY,12);});[0,50,100].forEach(function(v){TB(v+' %',58,m.Y(v/100)+4,GREY,12,'right');});
  LN(m.X(3.5),H-46,m.X(3.5),m.Y(.5),GREY,1.4,[4,3]);TB('pKa = 3,5',m.X(3.5)+6,H-52,GREY,13,'left');DOT(m.X(3.5),m.Y(.5),5,GREY);
  [[1.5,GREEN,'estomac pH 1,5 : 1 % ionisé',16,-26],[7.4,RED,'sang pH 7,4 : 99,99 % ionisé',-30,30]].forEach(function(P,i){var v=f(P[0]);DOT(m.X(P[0]),m.Y(v),7,P[1]);if(q>i*.4){uh_al(Math.min(1,(q-i*.4)*4));uh_tag(P[2],m.X(P[0])+(i?-40:90),m.Y(v)+P[4],dk(P[1]),13);ctx.globalAlpha=1;}});},
 /* 5 réducteur ester */
 function(p){var q=uh_e(p,0,.6),cols=['aldéhyde','cétone','ester'],rows=[['NaBH₄',[1,1,0]],['LiAlH₄',[1,1,1]]],x0=140,cw=100,y0=80,rh=62;
  cols.forEach(function(c,i){TB(c,x0+i*cw+cw/2,60,INK,16);});rows.forEach(function(r,j){TB(r[0],x0-14,y0+j*rh+rh/2+6,INK,18,'right');r[1].forEach(function(v,i){var x=x0+i*cw,y=y0+j*rh,hl=(j==1&&i==2);uh_rr(x+6,y+6,cw-12,rh-12,v?'rgba(29,158,117,.13)':'rgba(226,75,74,.1)',v?GREEN:RED,2);TB(v?'✓':'✗',x+cw/2,y+rh/2+9,v?DGREEN:DRED,26);});});
  uh_al(q);uh_rr(x0+2*cw+2,y0+rh+2,cw-4,rh-4,null,ORANGE,4);ctx.globalAlpha=1;TB('réduire un ester',W*.5,24,GREY,14);uh_al(q);TB('LiAlH₄ (éther anhydre), puis H₃O⁺',W*.5,y0+2*rh+34,DRED,15);TB('→ deux alcools primaires',W*.5,y0+2*rh+56,GREY,13);ctx.globalAlpha=1;},
 /* 6 trois voies Grignard */
 function(p){var q=uh_e(p,0,.8),cx=382,cy=140;LN(cx,cy,cx,cy-42,INK,2.4);LN(cx,cy,cx+42,cy+8,INK,2.4);LN(cx,cy,cx-34,cy+8,INK,2.4);LN(cx,cy,cx,cy+44,INK,2.4);c10_at('OH',cx,cy-50,DRED,17);c10_at('CH₃',cx+60,cy+14,INK,15);c10_at('CH₃CH₂',cx-52,cy+14,INK,15);c10_at('CH₂CH₃',cx,cy+62,INK,15);TB('3-méthylpentan-3-ol',cx,H-10,GREY,13);
  [['pentan-3-one + CH₃MgBr',BLUE],['butanone + C₂H₅MgBr',GREEN],['CH₃COOEt + 2 C₂H₅MgBr',ORA2]].forEach(function(r,i){var y=26+i*84,a=uh_e(q,i*.28,i*.28+.3);if(a<=0){uh_rr(10,y,236,50,'#f6f7f8','#e2e4e7',1.6);return;}uh_al(a);uh_rr(10,y,236,50,'#fff',r[1],2.4);TB(r[0],128,y+22,dk(r[1]),14.5);TB(['cétone','cétone','ester'][i],128,y+40,GREY,12.5);A(252,y+25,40+(i==1?24:0)*0,(140-(y+25))*.42,r[1],'',2.4);ctx.globalAlpha=1;});
  TB('puis H₃O⁺',282,H-34,GREY,13);},
 /* 7 identifier C4H10O */
 function(p){var q=uh_e(p,0,.7),it=[['CH₃CH₂CH₂CH₂OH','butan-1-ol · 1°'],['CH₃CH₂CH(OH)CH₃','butan-2-ol · 2°'],['(CH₃)₂CHCH₂OH','2-méthylpropan-1-ol · 1°'],['(CH₃)₃COH','2-méthylpropan-2-ol · 3°']];
  it.forEach(function(r,i){var x=10+(i%2)*226,y=14+Math.floor(i/2)*84,hl=i==1,dim=q>.3&&!hl;uh_al(dim?.35:1);uh_rr(x,y,214,70,'#fff',hl&&q>.3?GREEN:'#c8ccd0',hl&&q>.3?3:1.8);TB(r[0],x+107,y+30,INK,16);TB(r[1],x+107,y+54,GREY,13);ctx.globalAlpha=1;});
  uh_al(q);A(118,186,0,22,GREEN,'',2.6);A(342,186,0,0,GREEN,'',2.6);uh_rr(10,212,214,56,'#fff',ORANGE,2);TB('A + PCC → butanone (B)',117,236,DRED,14);TB('2,4-DNPH ✓ · Fehling ✗',117,256,GREY,13);uh_rr(236,212,214,56,'#fff',BLUE,2);TB('A + H₂SO₄, Δ → but-2-ène',343,236,BLUE_D,14);TB('Zaitsev : alcène substitué',343,256,GREY,13);ctx.globalAlpha=1;},
 /* 8 acidité Cl */
 function(p){var q=uh_e(p,0,.7),d=[['butanoïque',4.82,GREY],['4-chloro',4.52,'#7fb3e6'],['3-chloro',4.05,BLUE],['2-chloro',2.86,RED]],m=uh_ax(60,H-50,W-90,H-100,0,4,0,6);
  LN(60,m.Y(0),W-30,m.Y(0),GREY,1.5);TB('pKa',40,30,GREY,13);d.forEach(function(r,i){var x=96+i*92,v=6*.0+(5.2-(6-0)*0);var h=(r[1]-0)/6*(H-100)*(1-.0);var hh=(H-100)*(r[1]/5.2*.0+ (r[1]/5.2));ctx.fillStyle=r[2];ctx.globalAlpha=.85;ctx.fillRect(x-26,H-50-hh,52,hh);ctx.globalAlpha=1;TB(r[0],x,H-30,INK,13);TB('≈ '+uh_f(r[1],2),x,H-50-hh-8,dk(r[2]),14);});
  uh_al(q);A(70,22,W-120,0,DGREEN,'',2.6);TB('acidité croissante',W*.5,16,DGREEN,14);TB('Cl de plus en plus proche du COOH (effet inductif)',W*.5,H-8,DRED,13);ctx.globalAlpha=1;},
 /* 9 piégeage ionique */
 function(p){var q=uh_e(p,0,.7),d=[['estomac','pH 1,5',99,GREEN],['intestin','pH 6,5',.10,BLUE],['urine acide','pH 5,0',3.1,ORANGE],['urine alcaline','pH 8,0',.0032,RED]],base=H-56,top=48,Y=function(v){return base-(Math.log(v)/Math.LN10+3)/5*(base-top);};
  LN(60,base,W-20,base,GREY,2);[.001,.01,.1,1,10,100].forEach(function(v){LN(56,Y(v),W-20,Y(v),'#eceef1',1);TB(uh_f(v,3).replace(/,?0+$/,'')+' %',52,Y(v)+4,GREY,11,'right');});
  d.forEach(function(r,i){var x=106+i*88,h=base-Y(r[2]);ctx.fillStyle=r[3];ctx.globalAlpha=.85;ctx.fillRect(x-24,Y(r[2]),48,h);ctx.globalAlpha=1;TB(r[0],x,base+16,INK,13);TB(r[1],x,base+34,GREY,12);TB(uh_f(r[2],r[2]<.01?4:r[2]<1?2:1)+' %',x,Y(r[2])-8,dk(r[3]),13);});
  TB('forme neutre (échelle logarithmique)',W*.5,14,GREY,13);uh_al(q);A(106+2*88+28,Y(3.1)+6,50,Y(.0032)-Y(3.1)-44,RED,'',2.4);uh_tag('÷ ≈ 10³',106+2*88+60,Y(.12),DRED,16);ctx.globalAlpha=1;},
 /* 10 améliorer le rendement */
 function(p){var q=uh_e(p,0,.6);c10_chain([['RCOOH + R′OH  ⇌  RCOOR′ + H₂O',INK]],W*.5,40,17);TB('K ≈ 4 : 67 % d’ester',W*.5,66,GREY,14);
  uh_rr(12,92,206,92,'#f6f7f8','#d0d4d8',1.8);TB('✗  catalyseur',115,116,GREY,14);TB('✗  durée plus longue',115,140,GREY,14);TB('✗  température (ΔH° ≈ 0)',115,164,GREY,14);
  uh_al(q);uh_rr(238,92,210,92,'rgba(29,158,117,.1)',GREEN,2.6);TB('✓  5 éq. d’alcool',343,120,DGREEN,15);TB('✓  retirer H₂O',343,152,DGREEN,15);A(343,196,0,26,DGREEN,'',2.6);uh_tag('67 % → 94,5 %',343,252,DRED,17);ctx.globalAlpha=1;
  TB('ne changent pas K',115,206,GREY,13);},
 /* 11 ester + Grignard */
 function(p){var q=uh_e(p,0,.8);c10_steps(q,[['CH₃COOEt  +  CH₃MgBr','ester',BLUE],['CH₃–CO–CH₃  +  EtO⁻','propanone : plus réactive, non isolée',ORA2],['(CH₃)₃C–O⁻  (2e CH₃MgBr)','alcoolate tertiaire',GREEN],['(CH₃)₃C–OH  +  EtOH','après H₃O⁺ : 2 produits',VIOLET]],['addition puis perte de EtO⁻','2e addition de CH₃MgBr','hydrolyse acide']);},
 /* 12 saponification */
 function(p){var q=uh_e(p,0,.7),m=uh_ax(64,H-46,W-100,H-90,0,200,0,1.05,'t (s)','[ester]/[ester]₀');uh_fn(m,function(t){return 1/(1+.0055*t);},0,200,BLUE,3);uh_fn(m,function(t){return Math.exp(-.11*t);},0,200,ORA2,3);
  [0,50,100,150,200].forEach(function(v){TB(v,m.X(v),H-28,GREY,12);});TB('0,5',58,m.Y(.5)+4,GREY,12,'right');TB('1',58,m.Y(1)+4,GREY,12,'right');LN(64,m.Y(.5),W-36,m.Y(.5),GREY,1.2,[4,4]);
  TB('0,050 mol/L chacun (ordre 2)',W-30,m.Y(.62),BLUE_D,14,'right');TB('OH⁻ = 1,00 mol/L (pseudo-ordre 1)',m.X(24),m.Y(.2),DRED,13,'left');
  if(q>0){uh_al(q);DOT(m.X(182),m.Y(.5),7,BLUE);uh_tag('t½ = 182 s',m.X(182)-34,m.Y(.5)+30,BLUE_D,14);DOT(m.X(6.3),m.Y(.5),7,ORA2);uh_tag('t½ = 6,3 s',m.X(6.3)+50,m.Y(.5)-18,DRED,14);ctx.globalAlpha=1;}},
 /* 13 alcoolémie */
 function(p){var q=uh_e(p,0,.7),x0=40,w=380;TB('Cr₂O₇²⁻ introduit : 0,0500 mmol',W*.5,24,INK,15);ctx.fillStyle='#e07b2a';ctx.fillRect(x0,34,w*.0268/.05,30);ctx.fillStyle=ORANGE;ctx.globalAlpha=.35+.65*q;ctx.fillRect(x0+w*.0268/.05,34,w*.0232/.05,30);ctx.globalAlpha=1;TB('restant 0,0268',x0+w*.0268/.1,55,'#fff',13);TB(q>.4?'consommé 0,0232':'',x0+w*(.0268+.0116)/.05,55,'#fff',13);
  TB('restant : 16,1 × 0,0100 / 6 = 0,0268 mmol',W*.5,92,GREY,14);uh_al(q);TB('éthanol : 0,0232 × 3/2 = 0,0347 mmol → 1,60 mg dans 2,00 mL',W*.5,116,INK,13);ctx.globalAlpha=1;
  var gx=40,gw=380,gy=190,X=function(v){return gx+v/1.2*gw;};ctx.fillStyle='#e9edf0';ctx.fillRect(gx,gy,gw,16);ctx.fillStyle='rgba(226,75,74,.25)';ctx.fillRect(X(.5),gy,X(1.2)-X(.5),16);[0,.2,.4,.6,.8,1,1.2].forEach(function(v){TB(uh_f(v,1),X(v),gy+34,GREY,12);});TB('g/L',gx+gw,gy+52,GREY,12,'right');LN(X(.5),gy-12,X(.5),gy+20,DRED,2.4);TB('limite 0,50',X(.5)-6,gy-16,DRED,13,'right');
  if(q>0){uh_al(q);DOT(X(.8),gy+8,9,BLUE_D);A(X(.8),gy-52,0,36,BLUE_D,'',2.6);uh_tag('0,80 g/L',X(.8)+36,gy-48,DRED,17);ctx.globalAlpha=1;}else TB('?',X(.8),gy-30,GREY,26);}
]);
