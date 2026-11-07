/* Biologie BA1 · chapitre 5 : théorie animée et devantures */
function b5_mm(S,V,K){return V*S/(K+S);}
function b5_plot(x0,y0,w,h,xmax,ymax,xl,yl,xt,yt){bio_ax(x0,y0,w,h,xl,yl);(xt||[]).forEach(function(v){TB((''+v).replace('.',','),x0+v/xmax*w,y0+15,GREY,11);LN(x0+v/xmax*w,y0,x0+v/xmax*w,y0+4,INK,1);});(yt||[]).forEach(function(v){TB((''+v).replace('.',','),x0-6,y0-v/ymax*h+4,GREY,11,'right');LN(x0-4,y0-v/ymax*h,x0,y0-v/ymax*h,INK,1);});
 return {x:function(v){return x0+v/xmax*w;},y:function(v){return y0-v/ymax*h;}};}
function b5_lb(x0,y0,w,h,xlo,xhi,ylo,yhi,xl,yl){ /* repère double inverse avec axes croisés en (0,0) */
 var X=function(v){return x0+(v-xlo)/(xhi-xlo)*w;},Y=function(v){return y0-(v-ylo)/(yhi-ylo)*h;};
 LN(x0,Y(0),x0+w,Y(0),INK,1.6);LN(X(0),y0,X(0),y0-h,INK,1.6);TB(xl,x0+w,Y(0)+16,GREY,12,'right');TB(yl,X(0)+6,y0-h+10,GREY,12,'left');return {x:X,y:Y};}
function b5_line(G,a,b,xa,xb,col,lw,dash){LN(G.x(xa),G.y(a*xa+b),G.x(xb),G.y(a*xb+b),col,lw||2.8,dash);}

SFA.theo("c05",{
 icon:function(){TB('v = Vmax·[S] / (Km + [S])',W*.5,H*.38,BLUE_D,24);TB('ΔG = ΔG°′ + RT ln Q',W*.5,H*.62,ORANGE,22);TB('enzymes · ATP · inhibiteurs',W*.5,H*.88,GREY,14);},
 sub:[
 {t:"Énergie : ΔG et couplage à l'ATP",
  anim:function(t){
   var ph=t%600,lq=-4+ph/600*8,Q=Math.exp(lq),dg=7+2.58*lq,x0=W*.1,y0=H*.76,w=W*.8,h=H*.52;
   TB('A → B : ΔG°′ = +7 kJ/mol ; ΔG = ΔG°′ + RT ln([B]/[A])',W*.5,22,BLUE_D,14);
   var X=function(v){return x0+(v+4)/8*w;},Y=function(v){return y0-(v+10)/30*h;};
   LN(x0,Y(0),x0+w,Y(0),INK,1.6);LN(x0,y0,x0,y0-h,INK,1.6);
   ctx.fillStyle='rgba(29,158,117,.1)';ctx.fillRect(x0,Y(0),w,y0-Y(0));ctx.fillStyle='rgba(226,75,74,.08)';ctx.fillRect(x0,y0-h,w,Y(0)-(y0-h));
   TB('spontanée (ΔG < 0)',x0+w-4,y0-6,DGREEN,12,'right');TB('non spontanée (ΔG > 0)',x0+w-4,y0-h+14,DRED,12,'right');
   bio_fn(function(l){return 7+2.58*l;},-4,4,X,Y,BLUE,2.8,40);
   var zl=-7/2.58;LN(X(zl),Y(0)-5,X(zl),Y(0)+5,INK,2);TB('ΔG = 0',X(zl),Y(0)+22,GREY,11);
   DOT(X(lq),Y(dg),7,dg<0?GREEN:RED);TB('ln([B]/[A]) = '+lq.toFixed(1).replace('.',',').replace('-','−'),X(lq),y0+22,INK,12);
   TB('ΔG = '+dg.toFixed(1).replace('.',',').replace('-','−')+' kJ/mol',W*.5,50,dg<0?DGREEN:DRED,16);
   TB('[B]/[A] = 0,01 (B consommé) : ΔG ≈ −4,9 kJ/mol',W*.5,H*.95,GREY,12);},
  th:'<div class="tcard"><b class="h">ΔG réel et spontanéité</b><p>Une réaction est <b>spontanée</b> si ΔG &lt; 0, à l\'équilibre si ΔG = 0. C\'est le <b>ΔG réel</b> qui décide, pas ΔG°′ : <b>ΔG = ΔG°′ + RT ln Q</b>, avec RT = 2,58 kJ/mol à 37 °C et Q = [produits]/[réactifs] (dans les conditions de la cellule).</p><p>Exemple : A → B, ΔG°′ = +7 kJ/mol, mais [B]/[A] = 0,01 car B est consommé : ΔG = 7 + 2,58·ln 0,01 = 7 − 11,9 = <b>−4,9 kJ/mol</b> : la réaction avance. Piège : mettre le mauvais signe devant RT ln Q, ou inverser produits et réactifs. Une enzyme accélère mais ne change ni ΔG ni l\'équilibre.</p></div><div class="tcard"><b class="h">ATP et couplage</b><p>ΔG°′(ATP → ADP + Pi) = −30,5 kJ/mol, mais dans la cellule ([ATP] = 5, [ADP] = 0,5, [Pi] = 5 mmol/L) : ΔG = −30,5 + 2,58·ln(0,5·10<sup>−3</sup>) ≈ <b>−50 kJ/mol</b> : le rapport ATP/ADP est maintenu très haut, loin de l\'équilibre.</p><p><b>Couplage</b> : une réaction défavorable (ΔG &gt; 0) devient possible si elle est couplée à l\'hydrolyse de l\'ATP : on additionne les ΔG ; la somme doit être négative. L\'ATP est un transporteur d\'énergie, pas une réserve (renouvelé en ≈ 1 min).</p></div>'},
 {t:"Cinétique, inhibition et régulation",
  anim:function(t){
   var mode=Math.floor(t/300)%4,ph=t%300;var V=100,K=10;var modes=[['sans inhibiteur',V,K,GREEN],['inhibiteur compétitif : Km ×2, Vmax inchangé',V,2*K,RED],['non compétitif : Vmax ÷2, Km inchangé',V/2,K,ORA2],['incompétitif : Vmax ÷2 et Km ÷2',V/2,K/2,VIOLET]];
   var m=modes[mode];var x0=W*.1,y0=H*.8,w=W*.8,h=H*.58;var G=b5_plot(x0,y0,w,h,100,100,'[S]','v',[25,50,75,100],[50,100]);
   TB(m[0],W*.5,22,dk(m[3]),14);
   bio_fn(function(s){return b5_mm(s,V,K);},0,100,G.x,G.y,'#c9ced4',2.2);
   bio_fn(function(s){return b5_mm(s,m[1],m[2]);},0,100,G.x,G.y,m[3],3);
   LN(x0,G.y(m[1]),x0+w,G.y(m[1]),m[3],1.2,[5,4]);TB('Vmax = '+m[1],x0+w,G.y(m[1])-5,dk(m[3]),12,'right');
   LN(G.x(m[2]),y0,G.x(m[2]),G.y(m[1]/2),m[3],1.2,[5,4]);LN(x0,G.y(m[1]/2),G.x(m[2]),G.y(m[1]/2),m[3],1.2,[5,4]);TB('Km = '+m[2],G.x(m[2]),y0-6,dk(m[3]),12,'left');
   var s=2+98*(0.5-0.5*Math.cos(ph/300*2*PI));DOT(G.x(s),G.y(b5_mm(s,m[1],m[2])),6,RED);
   TB('[S] = '+s.toFixed(0)+'  →  v = '+b5_mm(s,m[1],m[2]).toFixed(0),W*.5,H*.95,INK,13);},
  th:'<div class="tcard"><b class="h">Michaelis-Menten</b><p><b>v = V<sub>max</sub>·[S] / (K<sub>m</sub> + [S])</b>. V<sub>max</sub> = k<sub>cat</sub>·[E]<sub>total</sub> (doubler [E] double V<sub>max</sub>). K<sub>m</sub> est la <b>[S] pour laquelle v = V<sub>max</sub>/2</b> (pas une vitesse, pas une [E]). À [S] ≪ K<sub>m</sub> : v ≈ (V<sub>max</sub>/K<sub>m</sub>)[S] (ordre 1) ; à [S] ≫ K<sub>m</sub> : v ≈ V<sub>max</sub> (ordre 0).</p><p>Exemple : V<sub>max</sub> = 80, K<sub>m</sub> = 5, [S] = 15 : v = 80·15/20 = <b>60 µmol/L/min</b>. Efficacité catalytique : <b>k<sub>cat</sub>/K<sub>m</sub></b> (k<sub>cat</sub> = 200 s<sup>−1</sup>, K<sub>m</sub> = 10 µmol/L : 2·10<sup>7</sup> L·mol<sup>−1</sup>·s<sup>−1</sup>).</p></div><div class="tcard"><b class="h">Double inverse (Lineweaver-Burk)</b><p><b>1/v = (K<sub>m</sub>/V<sub>max</sub>)·(1/[S]) + 1/V<sub>max</sub></b> : droite de pente K<sub>m</sub>/V<sub>max</sub>, d\'ordonnée à l\'origine 1/V<sub>max</sub>, coupant l\'axe des abscisses en −1/K<sub>m</sub>. Ex. 1/v = 0,40·(1/[S]) + 0,050 : V<sub>max</sub> = 20, K<sub>m</sub> = 0,40 × 20 = 8.</p></div><div class="tcard"><b class="h">Reconnaître l\'inhibition</b><ul><li><b>Compétitive</b> : même site que S ; K<sub>m</sub>\' = α·K<sub>m</sub>, α = 1 + [I]/K<sub>i</sub> ; V<sub>max</sub> inchangé. Droites qui se coupent <b>sur l\'axe 1/v</b>. Surmontée par un excès de S.</li><li><b>Non compétitive</b> : V<sub>max</sub> / α, K<sub>m</sub> inchangé ; droites qui se coupent sur l\'axe 1/[S]. Non surmontée par S.</li><li><b>Incompétitive</b> : se fixe sur ES ; V<sub>max</sub> et K<sub>m</sub> divisés par α ; droites <b>parallèles</b> (même pente).</li></ul><p>Exemple compétitif : V<sub>max</sub> = 100, K<sub>m</sub> = 10, [I] = 8, K<sub>i</sub> = 4 : α = 3, K<sub>m</sub>\' = 30 ; à [S] = 30, v passe de 75 à 50 (−33 %) ; à 300, de 96,8 à 90,9 (−6 %).</p></div><div class="tcard"><b class="h">pH, température, allostérie</b><p>Chaque enzyme a un <b>pH optimal</b> (ionisation des groupes du site actif : fraction active = produit des fractions protonée/déprotonée requises). La vitesse intrinsèque croît avec la température (Q<sub>10</sub> ≈ 2), puis chute par <b>dénaturation</b> : l\'optimum est un compromis (ex. 47 °C : 120 × 2 × 0,9 = 216 unités).</p><p>Les enzymes <b>allostériques</b> ont une courbe <b>sigmoïde</b> (coopérativité, coefficient de Hill n &gt; 1). Un effecteur déplace la courbe (effet Bohr de l\'hémoglobine : P50 de 26 à 32 mmHg à pH plus bas, plus d\'O<sub>2</sub> libéré). La <b>rétro-inhibition</b> : le produit final inhibe la première enzyme de sa voie.</p></div>'}
 ]
});
SFA.figs("c05",[
 function(p){ /* 0 MM */
  bio_cap('Vmax = 80 · Km = 5 · [S] = 15 (µmol/L)',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.58,40,100,'[S]','v',[10,20,30,40],[40,80]);
  bio_fn(function(s){return b5_mm(s,80,5);},0,40,G.x,G.y,BLUE,2.8);LN(G.x(0),G.y(80),G.x(40),G.y(80),AX,1.4,[5,4]);TB('Vmax',G.x(40),G.y(80)-5,GREY,12,'right');
  bio_pop(p,function(){LN(G.x(15),H*.8,G.x(15),G.y(60),RED,1.6,[4,3]);LN(G.x(0),G.y(60),G.x(15),G.y(60),RED,1.6,[4,3]);DOT(G.x(15),G.y(60),6,RED);TB('v = 80 × 15 / 20 = 60',G.x(15)+10,G.y(60)+22,DRED,14,'left');});},
 function(p){ /* 1 LB */
  bio_cap('1/v = 0,40 · (1/[S]) + 0,050',22);
  var G=b5_lb(W*.1,H*.82,W*.8,H*.62,-.3,1,-.02,.5,'1/[S]','1/v');
  b5_line(G,.4,.05,-.125,.95,BLUE,3);DOT(G.x(0),G.y(.05),6,RED);TB('0,050',G.x(0)+8,G.y(.05)+4,DRED,12,'left');DOT(G.x(-.125),G.y(0),6,RED);TB('−1/Km',G.x(-.125),G.y(0)+18,DRED,12);
  bio_pop(p,function(){TB('1/Vmax = 0,050 → Vmax = 20',W*.7,H*.66,DGREEN,14);TB('−1/Km = −0,125 → Km = 8',W*.7,H*.76,DGREEN,14);});},
 function(p){ /* 2 signification Km */
  bio_cap('Que représente Km ?',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.58,10,110,'[S]','v',[],[]);
  bio_fn(function(s){return b5_mm(s,100,1.5);},0,10,G.x,G.y,BLUE,2.8);LN(G.x(0),G.y(100),G.x(10),G.y(100),AX,1.4,[5,4]);TB('Vmax',G.x(10),G.y(100)-5,GREY,12,'right');
  LN(G.x(0),G.y(50),G.x(1.5),G.y(50),GREY,1.4,[4,3]);TB('Vmax / 2',G.x(0)+4,G.y(50)-6,GREY,12,'left');
  bio_pop(p,function(){LN(G.x(1.5),G.y(50),G.x(1.5),H*.8,RED,2,[4,3]);DOT(G.x(1.5),G.y(50),6,RED);TB('Km = [S] pour v = Vmax/2',G.x(1.5)+10,H*.72,DRED,14,'left');});},
 function(p){ /* 3 ΔG ATP */
  bio_cap('ATP → ADP + Pi à 37 °C',22);
  var x0=W*.12,top=H*.26,bot=H*.74;
  TB('ATP',W*.22,top-12,DGREEN,16);LN(W*.12,top,W*.34,top,INK,3);
  LN(W*.58,bot,W*.84,bot,INK,3);TB('ADP + Pi',W*.71,bot+22,DGREEN,15);
  A(W*.27,top+6,0,bot-top-14,GREY,'',2);
  TB('ΔG°′ = −30,5 kJ/mol',W*.64,H*.26,GREY,14);TB('[ADP][Pi]/[ATP] = 5·10⁻⁴ mol/L',W*.64,H*.37,INK,13);
  bio_pop(p,function(){TB('ΔG = −30,5 + 2,58 · ln(5·10⁻⁴)',W*.64,H*.5,DGREEN,14);TB('ΔG ≈ −50 kJ/mol',W*.64,H*.63,DRED,20);});},
 function(p){ /* 4 kcat */
  bio_cap('kcat = 200 s⁻¹ · Km = 10 µmol/L · [E] = 5 nmol/L',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.56,100,2.2,'[S] (µmol/L)','v (µmol/L/s)',[20,40,60,80,100],[1,2]);
  bio_fn(function(s){return b5_mm(s,1,10);},0,100,G.x,G.y,BLUE,2.8);TB('[E]',G.x(80),G.y(.9)+16,BLUE_D,13);
  LN(G.x(40),H*.8,G.x(40),G.y(.8),GREY,1.4,[4,3]);DOT(G.x(40),G.y(.8),5,BLUE);
  bio_pop(p,function(){bio_fn(function(s){return b5_mm(s,2,10);},0,100,G.x,G.y,RED,2.8);TB('2 [E]',G.x(80),G.y(1.8)-8,DRED,13);DOT(G.x(40),G.y(1.6),5,RED);TB('Vmax : 1,0 → 2,0 · v(40) : 0,80 → 1,6',W*.62,H*.58,DRED,13);TB('kcat/Km = 2·10⁷ L/mol/s',W*.62,H*.68,DGREEN,13);});},
 function(p){ /* 5 signature d'inhibiteur */
  bio_cap('Lineweaver-Burk : deux droites sécantes sur l\'axe 1/v',22);
  var G=b5_lb(W*.1,H*.82,W*.8,H*.62,-.3,1,-.02,.5,'1/[S]','1/v');
  b5_line(G,.2,.1,-.45+.0,.95,BLUE,2.8);TB('sans inhibiteur',G.x(.95),G.y(.29)+16,BLUE_D,12,'right');
  bio_pop(p,function(){b5_line(G,.4,.1,-.25,.95,RED,2.8);TB('avec inhibiteur',G.x(.95),G.y(.48)-6,DRED,12,'right');DOT(G.x(0),G.y(.1),6,GREEN);TB('même 1/Vmax',G.x(0)-8,G.y(.1)-10,DGREEN,12,'right');TB('pente plus grande : Km apparent ↑',W*.72,H*.88,DRED,13);});},
 function(p){ /* 6 compétitive chiffrée */
  bio_cap('Vmax = 100 · Km = 10 · [I] = 8 · Ki = 4',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.58,300,110,'[S] (µmol/L)','v',[100,200,300],[50,100]);
  bio_fn(function(s){return b5_mm(s,100,10);},0,300,G.x,G.y,BLUE,2.8,150);
  bio_pop(p,function(){bio_fn(function(s){return b5_mm(s,100,30);},0,300,G.x,G.y,RED,2.8,150);DOT(G.x(30),G.y(75),5,BLUE);DOT(G.x(30),G.y(50),5,RED);TB('75',G.x(30)+8,G.y(75)-8,BLUE_D,12,'left');TB('50',G.x(30)+8,G.y(50)+16,DRED,12,'left');TB('α = 3 · Km\' = 30',W*.62,H*.5,DRED,14);TB('à 300 : 96,8 → 90,9',W*.62,H*.62,GREY,13);});},
 function(p){ /* 7 comp vs non comp */
  bio_cap('[I] = Ki (α = 2) · Vmax = 100 · Km = 10',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.56,100,110,'[S] (µmol/L)','v',[25,50,75,100],[50,100]);
  bio_fn(function(s){return b5_mm(s,100,10);},0,100,G.x,G.y,'#9aa0a6',2.4);TB('témoin',G.x(100),G.y(100)-8,GREY,12,'right');
  bio_pop(p,function(){bio_fn(function(s){return b5_mm(s,100,20);},0,100,G.x,G.y,RED,2.8);bio_fn(function(s){return b5_mm(s,50,10);},0,100,G.x,G.y,ORA2,2.8);TB('compétitive : rejoint Vmax (98,0)',G.x(100),G.y(72),DRED,12,'right');TB('non compétitive : 49,5',G.x(100),G.y(49.5)-8,ORA2,12,'right');DOT(G.x(10),G.y(33.3),5,RED);DOT(G.x(10),G.y(25),5,ORA2);TB('33,3',G.x(10)+8,G.y(33.3)-6,DRED,12,'left');TB('25',G.x(10)+8,G.y(25)+14,ORA2,12,'left');});},
 function(p){ /* 8 ΔG spontanéité */
  bio_cap('A → B · ΔG°′ = +7 kJ/mol · [B]/[A] = 0,01',22);
  var x0=W*.12;var y0=H*.55;var sc=H*.022;
  LN(x0,y0,W*.9,y0,INK,1.6);TB('ΔG = 0',W*.9,y0-6,GREY,12,'right');
  ctx.fillStyle='#fdece4';ctx.fillRect(W*.2,y0-7*sc,60,7*sc);ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.strokeRect(W*.2,y0-7*sc,60,7*sc);TB('+7',W*.2+30,y0-7*sc-6,DRED,15);TB('ΔG°′',W*.2+30,y0+18,GREY,13);
  bio_pop(p,function(){ctx.fillStyle='#e1f5ee';ctx.fillRect(W*.55,y0,60,4.9*sc);ctx.strokeStyle=GREEN;ctx.strokeRect(W*.55,y0,60,4.9*sc);TB('−4,9',W*.55+30,y0+4.9*sc+16,DGREEN,15);TB('ΔG réel',W*.55+30,y0-8,GREY,13);TB('7 + 2,58 · ln 0,01 = 7 − 11,9',W*.5,H*.93,INK,13);});
  if(p<=0)TB('ΔG réel ?',W*.67,y0+30,GREY,16);},
 function(p){ /* 9 température */
  bio_cap('Activité d\'une amylase selon la température',22);
  var T=[27,37,47,57,67],A_=[60,120,216,96,1];var x0=W*.12,y0=H*.8,w=W*.8,h=H*.58;
  LN(x0,y0,x0+w,y0,INK,1.6);
  T.forEach(function(t,i){var x=x0+(i+.5)*w/5;TB(t+' °C',x,y0+18,INK,12);bio_pop(p,function(){var bh=A_[i]/290*h;ctx.fillStyle=i===2?'#e1f5ee':'#e6f1fb';ctx.fillRect(x-24,y0-bh,48,bh);ctx.strokeStyle=i===2?GREEN:BLUE;ctx.lineWidth=2;ctx.strokeRect(x-24,y0-bh,48,bh);TB(String(A_[i]===1?'≈ 1':A_[i]),x,y0-bh-6,i===2?DGREEN:BLUE_D,14);});});
  if(p<=0){TB('A = 120 × 2^((T−37)/10) × fraction native',W*.5,H*.5,GREY,14);}
  bio_pop(p,function(){TB('optimum à 47 °C : l\'activité intrinsèque monte, l\'enzyme se dénature',W*.5,H*.2+10,DGREEN,13);});},
 function(p){ /* 10 médicament compétitif */
  bio_cap('Inhibiteur compétitif · Ki = 0,5 · [I] = 2 µmol/L',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.56,8,1.1,'[S] / Km','v / Vmax',[2,4,6,8],[.5,1]);
  bio_fn(function(s){return s/(1+s);},0,8,G.x,G.y,BLUE,2.8);
  bio_pop(p,function(){bio_fn(function(s){return s/(5+s);},0,8,G.x,G.y,RED,2.8);DOT(G.x(1),G.y(.5),5,BLUE);DOT(G.x(1),G.y(1/6),5,RED);DOT(G.x(5),G.y(5/6),5,BLUE);DOT(G.x(5),G.y(.5),5,RED);TB('0,50 → 0,167',G.x(1)+8,G.y(1/6)+18,DRED,12,'left');TB('à 5 Km : 0,83 → 0,50',G.x(5)+8,G.y(.5)+16,DRED,12,'left');TB('α = 1 + 2/0,5 = 5',W*.62,H*.34,DRED,15);});},
 function(p){ /* 11 deux droites parallèles */
  bio_cap('Même pente 0,40 : parallèles, pas « même Km »',22);
  var G=b5_lb(W*.1,H*.82,W*.8,H*.62,-.15,.55,-.02,.3,'1/[S]','1/v');
  b5_line(G,.4,.02,-.05,.5,BLUE,2.8);TB('sans I',G.x(.5)+4,G.y(.22),BLUE_D,13,'left');
  b5_line(G,.4,.04,-.1,.5,RED,2.8);TB('avec I',G.x(.5)+4,G.y(.24)-16,DRED,13,'left');
  bio_pop(p,function(){DOT(G.x(0),G.y(.02),5,BLUE);DOT(G.x(0),G.y(.04),5,RED);TB('Vmax 50 → 25',G.x(0)+8,G.y(.02)+16,DRED,12,'left');TB('Km 20 → 10',G.x(0)-8,G.y(.06),DRED,12,'right');TB('inhibition incompétitive',W*.6,H*.9,DGREEN,15);});},
 function(p){ /* 12 transporteur : LB */
  bio_cap('Transport facilité : v mesurée à 1, 2, 4, 8 mmol/L',22);
  var G=b5_lb(W*.1,H*.82,W*.8,H*.6,-.4,1.1,-.01,.2,'1/[S]','1/v');
  [[1,.08],[.5,.05],[.25,.035],[.125,.0275]].forEach(function(q){DOT(G.x(q[0]),G.y(q[1]),5,BLUE);});
  b5_line(G,.06,.02,-.2,1.05,BLUE,2.4);
  bio_pop(p,function(){TB('Vmax = 50 · Km = 3',W*.62,H*.3,DGREEN,14);b5_line(G,.18,.02,-.1,.6,RED,2.4);TB('compétiteur : Km\' = 9',W*.62,H*.42,DRED,14);DOT(G.x(0),G.y(.02),5,GREEN);});},
 function(p){ /* 13 hémoglobine */
  bio_cap('Hémoglobine · Hill n = 2,7 · acidose (pH 7,21) : P50 26 → 32',22);
  var G=b5_plot(W*.14,H*.8,W*.76,H*.58,100,1.05,'pO₂ (mmHg)','saturation',[20,40,60,80,100],[.5,1]);
  bio_fn(function(x){return Math.pow(x,2.7)/(Math.pow(26,2.7)+Math.pow(x,2.7));},0,100,G.x,G.y,BLUE,2.8);LN(G.x(26),H*.8,G.x(26),G.y(.5),BLUE,1.2,[4,3]);TB('26',G.x(26),H*.8+28,BLUE_D,12);
  bio_pop(p,function(){bio_fn(function(x){return Math.pow(x,2.7)/(Math.pow(32,2.7)+Math.pow(x,2.7));},0,100,G.x,G.y,RED,2.8);LN(G.x(32),H*.8,G.x(32),G.y(.5),RED,1.2,[4,3]);TB('32',G.x(32),H*.8+28,DRED,12);TB('courbe vers la droite : plus d\'O₂ libéré',W*.68,H*.56,DRED,13);TB('pH = 6,1 + log(14/1,08) = 7,21',W*.68,H*.66,DGREEN,13);});}
]);
