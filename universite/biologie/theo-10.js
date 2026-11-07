/* Biologie BA1 · chapitre 10 : théorie animée et devantures */
function b10_sq(x,y,s,q,lab){ /* carré de Hardy-Weinberg : colonnes (p,q) et lignes (p,q) */
 var p=1-q,w=[p*s,q*s],cols=[['AA','#e1f5ee',GREEN],['Aa','#faeeda',ORANGE],['Aa','#faeeda',ORANGE],['aa','#fcebeb',RED]];
 var xs=[x,x+w[0]],ys=[y,y+w[0]];var k=0;
 for(var i=0;i<2;i++)for(var j=0;j<2;j++){var c=cols[k++];var ww=w[j],hh=w[i];ctx.fillStyle=c[1];ctx.strokeStyle=c[2];ctx.lineWidth=2;ctx.fillRect(xs[j],ys[i],ww,hh);ctx.strokeRect(xs[j],ys[i],ww,hh);if(ww>26&&hh>16)TB(c[0],xs[j]+ww/2,ys[i]+hh/2+5,dk(c[2]),Math.min(14,Math.max(10,Math.min(ww,hh)*.3)));}
 TB('A (p)',x+w[0]/2,y-6,DGREEN,12);if(w[1]>20)TB('a (q)',x+w[0]+w[1]/2,y-6,DRED,12);else TB('a',x+w[0]+w[1]/2+4,y-6,DRED,12);}
var b10_seed=1;function b10_rnd(){b10_seed=(b10_seed*1664525+1013904223)%4294967296;return b10_seed/4294967296;}
function b10_norm(){var s=0;for(var i=0;i<12;i++)s+=b10_rnd();return s-6;}
var b10_lv=null;function b10_LV(x0,y0,T,dt){var a=.8,b=.04,g=.6,d=.02,x=x0,y=y0,out=[];function f(x,y){return [a*x-b*x*y,d*x*y-g*y];}
 for(var t=0;t<=T;t+=dt){out.push([t,x,y]);var k1=f(x,y),k2=f(x+dt/2*k1[0],y+dt/2*k1[1]),k3=f(x+dt/2*k2[0],y+dt/2*k2[1]),k4=f(x+dt*k3[0],y+dt*k3[1]);x+=dt/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);y+=dt/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);}return out;}

SFA.theo("c10",{
 icon:function(){b10_sq(W*.08,H*.14,H*.6,.3);TB('p² + 2pq + q² = 1',W*.64,H*.36,BLUE_D,24);TB('dN/dt = rN(1 − N/K)',W*.64,H*.56,ORANGE,18);TB('Hardy-Weinberg · sélection · Lotka-Volterra',W*.5,H*.93,GREY,13);},
 sub:[
 {t:"Hardy-Weinberg, sélection et dérive",
  anim:function(t){
   var q=.5+.47*Math.sin(t*.012),p=1-q;TB('Hardy-Weinberg : p² + 2pq + q² = 1',W*.5,20,BLUE_D,14);
   b10_sq(W*.06,H*.2,H*.66,q);
   var bx=W*.36,by=H*.82,bw=W*.07,hh=H*.5;LN(bx-10,by,bx+3*(bw+16),by,INK,1.6);
   [[p*p,'AA',GREEN],[2*p*q,'Aa',ORANGE],[q*q,'aa',RED]].forEach(function(r,i){var x=bx+i*(bw+16);ctx.fillStyle=r[2];ctx.globalAlpha=.55;ctx.fillRect(x,by-r[0]*hh,bw,r[0]*hh);ctx.globalAlpha=1;ctx.strokeStyle=r[2];ctx.lineWidth=2;ctx.strokeRect(x,by-r[0]*hh,bw,r[0]*hh);TB(r[1],x+bw/2,by+16,INK,13);TB(r[0].toFixed(3).replace('.',','),x+bw/2,by-r[0]*hh-5,dk(r[2]),12);});
   TB('q = '+q.toFixed(2).replace('.',','),W*.7,H*.3,DRED,18,'left');TB('porteurs 2pq : '+(2*p*q*100).toFixed(0)+' %',W*.7,H*.46,ORANGE,13,'left');TB('malades q² : '+(q*q*100).toFixed(1).replace('.',',')+' %',W*.7,H*.58,DRED,13,'left');TB('2pq maximal (50 %) à q = 0,5',W*.7,H*.74,GREY,11,'left');},
  th:'<div class="tcard"><b class="h">Équilibre de Hardy-Weinberg</b><p>Fréquences alléliques p (A) et q (a), p + q = 1. À l\'équilibre : AA = <b>p²</b>, Aa = <b>2pq</b>, aa = <b>q²</b>. Conditions : grande population, unions au hasard (panmixie), pas de sélection, de migration ni de mutation. <b>Pas</b> besoin que p = q = 0,5. Après une génération d\'unions au hasard, les fréquences ne changent plus.</p><p>Exemples : q = 0,3 → AA 0,49 ; Aa 0,42 ; aa 0,09. Maladie récessive 1/10 000 : q = √10<sup>−4</sup> = 0,01, porteurs 2pq ≈ 2q ≈ 2 % (1/50) ; 1/1 600 : q = 1/40, porteurs ≈ 1/20. Échantillon de 500 avec 45 aa : q² = 0,09, q = 0,3, 2pq = 0,42, soit 210 porteurs. <b>Piège</b> : q² est la fréquence des malades, <b>pas</b> celle de l\'allèle ; on ne peut pas utiliser 2pq = q².</p></div><div class="tcard"><b class="h">Tester l\'équilibre</b><p>On estime p̂ = (2·n<sub>AA</sub> + n<sub>Aa</sub>)/(2n), on calcule les effectifs attendus (np̂², 2np̂q̂, nq̂²) puis χ² = Σ(O − E)²/E avec <b>1 ddl</b> (3 classes − 1 − 1 paramètre estimé), seuil 3,84. Exemple : 420 AA, 380 Aa, 200 aa : p̂ = 0,61 ; attendus 372, 476, 152 ; χ² ≈ 40,5 : rejet. Indice de fixation <b>F = 1 − H<sub>obs</sub>/H<sub>att</sub> = 1 − 380/476 ≈ 0,20</b> : déficit d\'hétérozygotes (consanguinité, structure de population, ou allèles nuls).</p></div><div class="tcard"><b class="h">Sélection naturelle</b><p>Valeurs sélectives w(AA), w(Aa), w(aa) ; valeur moyenne w̄ = p²w<sub>AA</sub> + 2pq·w<sub>Aa</sub> + q²w<sub>aa</sub> ; p\' = (p²w<sub>AA</sub> + pq·w<sub>Aa</sub>)/w̄. Exemple : p = 0,5, w = 1 ; 1 ; 0,8 : w̄ = 0,95 ; p\' = 0,5/0,95 = <b>0,526</b>. Allèle récessif létal : q\' = q/(1 + q) ; pour q = 0,02 : 0,0196, il disparaît très lentement (les hétérozygotes le cachent).</p><p><b>Avantage de l\'hétérozygote</b> (drépanocytose et paludisme) : équilibre stable q̂ = s/(s + t), avec s = 1 − w(AA) et t = 1 − w(SS). Pour w = 0,9 ; 1 ; 0,3 : q̂ = 0,1/0,8 = <b>0,125</b>, AS ≈ 21,9 %, SS ≈ 1,6 %, w̄ ≈ 0,91. Mutation-sélection : q² ≈ μ/s (mucoviscidose 4·10<sup>−4</sup> exigerait μ = 4·10<sup>−4</sup>, 400 fois le taux réaliste de 10<sup>−6</sup> : autres causes, avantage de l\'hétérozygote, effet fondateur).</p></div><div class="tcard"><b class="h">Dérive génétique</b><p>Fluctuation aléatoire des fréquences, d\'autant plus forte que l\'effectif N est petit ; elle conduit à la fixation ou à la perte d\'un allèle et fait <b>perdre de la diversité</b>. Hétérozygotie : H<sub>t</sub> = H<sub>0</sub>(1 − 1/2N)<sup>t</sup>. Colonie fondatrice (N = 20, fréquences 0,4 et 0,6) : H<sub>0</sub> = 0,48 ; H<sub>30</sub> = 0,48 × 0,975<sup>30</sup> ≈ 0,22 ; la probabilité de fixation finale d\'un allèle est égale à sa fréquence initiale (0,4).</p></div>'},
 {t:"Croissance et dynamique proies-prédateurs",
  anim:function(t){
   if(!b10_lv)b10_lv=b10_LV(40,20,40,.02);var d=b10_lv,tt=((t*.012)%40),i=Math.min(d.length-1,Math.floor(tt/.02));
   TB('Lotka-Volterra : les cycles proies-prédateurs',W*.5,18,BLUE_D,14);
   var x0=W*.08,y0=H*.8,w=W*.52,h=H*.58;bio_ax(x0,y0,w,h,'t (années)','effectifs');
   var X=function(v){return x0+v/40*w;},Y=function(v){return y0-v/70*h;};
   ctx.lineWidth=2.4;[[1,BLUE],[2,RED]].forEach(function(q){ctx.strokeStyle=q[1];ctx.beginPath();for(var k=0;k<=i;k+=5){var xx=X(d[k][0]),yy=Y(d[k][q[0]]);k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});
   TB('proies',x0+w+4,Y(d[i][1]),BLUE_D,11,'left');TB('prédateurs',x0+w+4,Y(d[i][2])+14,DRED,11,'left');
   var px=W*.72,py=H*.76,pw=W*.24,ph=H*.52;LN(px,py,px+pw,py,INK,1.4);LN(px,py,px,py-ph,INK,1.4);TB('proies',px+pw,py+14,GREY,11,'right');TB('prédateurs',px+4,py-ph-4,GREY,11,'left');
   var PX=function(v){return px+(v-10)/40*pw;},PY=function(v){return py-(v-5)/35*ph;};ctx.strokeStyle='#c9ced4';ctx.lineWidth=1.6;ctx.beginPath();for(var k=0;k<d.length;k+=10){k?ctx.lineTo(PX(d[k][1]),PY(d[k][2])):ctx.moveTo(PX(d[k][1]),PY(d[k][2]));}ctx.stroke();
   DOT(PX(30),PY(20),4,GREEN);TB('(30 ; 20)',PX(30)+6,PY(20)+16,DGREEN,11,'left');DOT(PX(d[i][1]),PY(d[i][2]),6,RED);},
  th:'<div class="tcard"><b class="h">Croissance exponentielle et logistique</b><p>Exponentielle : dN/dt = rN, N = N<sub>0</sub>e<sup>rt</sup> (sans limite). <b>Logistique</b> : <b>dN/dt = rN(1 − N/K)</b>, K capacité d\'accueil du milieu ; N(t) = K/(1 + ((K − N<sub>0</sub>)/N<sub>0</sub>)·e<sup>−rt</sup>). La croissance est maximale pour <b>N = K/2</b> : (dN/dt)<sub>max</sub> = rK/4. Exemple : r = 0,4 h<sup>−1</sup>, K = 1 000, N<sub>0</sub> = 50 : vitesse maximale 100 cellules/h ; N = K/2 à t = ln 19/0,4 ≈ 7,4 h ; N(10 h) = 1 000/(1 + 19e<sup>−4</sup>) ≈ 742.</p></div><div class="tcard"><b class="h">Lotka-Volterra</b><p>Proies x, prédateurs y : <b>dx/dt = αx − βxy</b> ; <b>dy/dt = δxy − γy</b>. Équilibre non trivial : <b>x* = γ/δ, y* = α/β</b>. Avec α = 0,8, β = 0,04, γ = 0,6, δ = 0,02 : (30 ; 20). Autour de l\'équilibre, oscillations de période ≈ 2π/√(αγ) = 2π/√0,48 ≈ 9,1 ans, le pic de prédateurs suivant celui des proies d\'environ ¼ de période (≈ 2,3 ans).</p><p>Éliminer la moitié des prédateurs à l\'équilibre ne change pas l\'équilibre mais déclenche un cycle plus ample (les proies explosent puis les prédateurs suivent). Le modèle est simplifié : pas de capacité d\'accueil pour les proies, pas de refuge, environnement constant.</p></div>'}
 ]
});
SFA.figs("c10",[
 function(p){ /* 0 fréquences génotypiques */
  bio_cap('q(a) = 0,3 · à l\'équilibre de Hardy-Weinberg',22);
  b10_sq(W*.08,H*.2,H*.62,.3);
  TB('AA = p² = 0,7²',W*.62,H*.3,DGREEN,14,'left');TB('Aa = 2pq',W*.62,H*.46,ORANGE,14,'left');TB('aa = q² = 0,3²',W*.62,H*.62,DRED,14,'left');
  bio_pop(p,function(){TB('= 0,49',W*.94,H*.3,DGREEN,15,'right');TB('= 0,42',W*.94,H*.46,ORANGE,15,'right');TB('= 0,09',W*.94,H*.62,DRED,15,'right');});},
 function(p){ /* 1 malades → porteurs */
  bio_cap('1 naissance sur 10 000 atteinte (aa)',22);
  b10_sq(W*.08,H*.2,H*.62,.01);
  TB('q² = 10⁻⁴',W*.62,H*.32,DRED,15,'left');
  bio_pop(p,function(){TB('q = √10⁻⁴ = 0,01',W*.62,H*.46,DRED,15,'left');TB('2pq ≈ 2q ≈ 2 %',W*.62,H*.62,ORANGE,16,'left');TB('≈ 1 porteur sur 50',W*.62,H*.74,DGREEN,15,'left');});
  if(p<=0)TB('q ? porteurs ?',W*.62,H*.5,GREY,15,'left');},
 function(p){ /* 2 conditions */
  bio_cap('Conditions de Hardy-Weinberg',22);
  var it=[['grande population',1],['unions au hasard (panmixie)',1],['p = q = 0,5',0],['pas de sélection, de migration ni de mutation',1]];
  it.forEach(function(q,i){var y=H*.28+i*H*.17;bio_rb(W*.5,y,W*.8,36,p>0?(q[1]?GREEN:RED):INK,q[0],14,p>0?(q[1]?'#e1f5ee':'#fcebeb'):'#fff');bio_pop(p,function(){TB(q[1]?'✓':'✗',W*.14,y+7,q[1]?DGREEN:DRED,20);});});
  bio_pop(p,function(){TB('p = q = 0,5 n\'est PAS requis',W*.5,H*.95,DRED,14);});},
 function(p){ /* 3 porteurs */
  bio_cap('500 personnes · 45 atteintes (aa)',22);
  var cols=25,rows=20,x0=W*.06,y0=44,cs=Math.min((W*.58)/cols,(H-80)/rows);var N=0;
  for(var i=0;i<500;i++){var c=i<45?RED:(p>0&&i<255?ORANGE:(p>0?GREEN:'#c9ced4'));if(i<45)c=RED;else if(p>0)c=i<255?ORANGE:GREEN;else c='#d5d9de';var r=Math.floor(i/cols),cc=i%cols;DOT(x0+cc*cs+cs/2,y0+r*cs+cs/2,cs*.36,c);}
  TB('q² = 45/500 = 0,09',W*.8,H*.3,DRED,14);TB('q = 0,3',W*.8,H*.42,DRED,16);
  bio_pop(p,function(){TB('2pq = 2 × 0,7 × 0,3',W*.8,H*.56,ORANGE,13);TB('= 0,42',W*.8,H*.66,ORANGE,16);TB('210 porteurs',W*.8,H*.8,DGREEN,18);});},
 function(p){ /* 4 dérive */
  bio_cap('Dérive : fréquence de A au cours des générations',22);
  var x0=W*.12,y0=H*.8,w=W*.8,h=H*.58;bio_ax(x0,y0,w,h,'générations','p(A)');[0,25,50].forEach(function(v){TB(''+v,x0+v/50*w,y0+15,GREY,11);});[.5,1].forEach(function(v){TB((''+v).replace('.',','),x0-6,y0-v*h+4,GREY,11,'right');});
  b10_seed=7;function path(N,col){var pp=.5;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0-pp*h);for(var g=1;g<=50;g++){if(pp>0&&pp<1){pp+=Math.sqrt(pp*(1-pp)/(2*N))*b10_norm();pp=Math.max(0,Math.min(1,pp));}ctx.lineTo(x0+g/50*w,y0-pp*h);}ctx.stroke();}
  for(var k=0;k<5;k++)path(10,RED);for(var m=0;m<3;m++)path(500,BLUE);
  TB('N = 10 : dérive forte',x0+w,y0-h-4,DRED,12,'right');TB('N = 500 : faible',x0+w,y0-h*.62,BLUE_D,12,'right');
  bio_pop(p,function(){TB('fixation ou perte d\'un allèle : diversité perdue',W*.5,H*.97,DGREEN,13);});},
 function(p){ /* 5 une génération de sélection */
  bio_cap('w(AA) = 1 · w(Aa) = 1 · w(aa) = 0,8 · p = 0,5',22);
  var x0=W*.14,y0=H*.76,h=H*.5;LN(W*.08,y0,W*.92,y0,INK,1.6);
  function bar(x,v,lab,c){ctx.fillStyle=c;ctx.fillRect(x,y0-v*h,70,v*h);ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.strokeRect(x,y0-v*h,70,v*h);TB(String(v).replace('.',','),x+35,y0-v*h-6,INK,15);TB(lab,x+35,y0+18,INK,12);}
  bar(x0,.5,'p(A) génération 0','#e6f1fb');
  bio_pop(p,function(){bar(W*.5,.526,'p\'(A) génération 1','#e1f5ee');TB('w̄ = 0,25 + 0,50 + 0,25 × 0,8 = 0,95',W*.5,H*.2+16,DRED,13);TB('p\' = (0,25 + 0,25) / 0,95 = 0,526',W*.5,H*.2+36,DGREEN,14);});},
 function(p){ /* 6 logistique */
  bio_cap('r = 0,4 h⁻¹ · K = 1 000 · N₀ = 50',22);
  var x0=W*.13,y0=H*.8,w=W*.8,h=H*.58;bio_ax(x0,y0,w,h,'t (h)','N');[5,10,15,20].forEach(function(v){TB(''+v,x0+v/20*w,y0+15,GREY,11);});
  var N=function(t){return 1000/(1+19*Math.exp(-.4*t));},X=function(t){return x0+t/20*w;},Y=function(v){return y0-v/1100*h;};
  LN(x0,Y(1000),x0+w,Y(1000),GREY,1.2,[5,4]);TB('K = 1 000',x0+w,Y(1000)-5,GREY,12,'right');bio_fn(N,0,20,X,Y,BLUE,2.8,60);
  bio_pop(p,function(){DOT(X(7.36),Y(500),6,RED);LN(X(7.36),y0,X(7.36),Y(500),RED,1.4,[4,3]);TB('K/2 à 7,4 h : 100 cellules/h',X(7.36)+8,Y(500)+22,DRED,13,'left');DOT(X(10),Y(741.9),6,GREEN);TB('N(10 h) ≈ 742',X(10)+8,Y(741.9)+22,DGREEN,13,'left');});},
 function(p){ /* 7 polymorphisme équilibré */
  bio_cap('w̄(q) : valeur sélective moyenne · w = 0,9 ; 1 ; 0,3',22);
  var x0=W*.12,y0=H*.8,w=W*.8,h=H*.55;bio_ax(x0,y0,w,h,'q(S)','w̄');[.25,.5,.75,1].forEach(function(v){TB((''+v).replace('.',','),x0+v*w,y0+15,GREY,11);});
  var wb=function(q){return .9*(1-q)*(1-q)+2*q*(1-q)+.3*q*q;},X=function(q){return x0+q*w;},Y=function(v){return y0-(v-.3)/.7*h;};
  bio_fn(wb,0,1,X,Y,BLUE,2.8,80);
  bio_pop(p,function(){DOT(X(.125),Y(wb(.125)),6,RED);LN(X(.125),y0,X(.125),Y(wb(.125)),RED,1.4,[4,3]);TB('q̂ = 0,1/(0,1 + 0,7) = 0,125',W*.34,H*.62,DRED,14,'left');TB('w̄ ≈ 0,91',W*.34,H*.72,DGREEN,13,'left');TB('AS ≈ 21,9 % · SS ≈ 1,6 %',W*.34,H*.82-2,GREY,13,'left');});},
 function(p){ /* 8 porteurs 1/1600 */
  bio_cap('1 personne sur 1 600 est atteinte',22);
  b10_sq(W*.08,H*.2,H*.62,.025);
  TB('q² = 1/1 600',W*.62,H*.32,DRED,15,'left');
  bio_pop(p,function(){TB('q = 1/40',W*.62,H*.46,DRED,15,'left');TB('2pq ≈ 2q = 1/20',W*.62,H*.62,ORANGE,16,'left');TB('≈ 1 sur 20',W*.62,H*.76,DGREEN,16,'left');});
  if(p<=0)TB('porteurs ?',W*.62,H*.55,GREY,15,'left');},
 function(p){ /* 9 colonie fondatrice */
  bio_cap('N = 20 individus · H₀ = 2 × 0,4 × 0,6 = 0,48',22);
  var x0=W*.13,y0=H*.8,w=W*.8,h=H*.58;bio_ax(x0,y0,w,h,'générations','H');[10,20,30,40].forEach(function(v){TB(''+v,x0+v/40*w,y0+15,GREY,11);});[.25,.5].forEach(function(v){TB((''+v).replace('.',','),x0-6,y0-v/.5*h*.95+4,GREY,11,'right');});
  var X=function(t){return x0+t/40*w;},Y=function(v){return y0-v/.5*h*.95;};
  bio_fn(function(t){return .48*Math.pow(.975,t);},0,40,X,Y,BLUE,2.8,40);
  bio_pop(p,function(){DOT(X(30),Y(.2246),6,RED);LN(X(30),y0,X(30),Y(.2246),RED,1.4,[4,3]);TB('H₃₀ = 0,48 × 0,975³⁰ ≈ 0,22',W*.96,Y(.2246)+34,DRED,13,'right');TB('≈ 53 % de l\'hétérozygotie perdue',W*.5,H*.97,DGREEN,13);TB('fixation de l\'allèle 0,4 : probabilité 0,4',W*.5,H*.3,GREY,12);});},
 function(p){ /* 10 létal récessif */
  bio_cap('Allèle récessif létal : q = 0,02',22);
  var x0=W*.13,y0=H*.8,w=W*.8,h=H*.58;bio_ax(x0,y0,w,h,'générations','q');[25,50,75,100].forEach(function(v){TB(''+v,x0+v/100*w,y0+15,GREY,11);});[.01,.02].forEach(function(v){TB((''+v).replace('.',','),x0-6,y0-v/.022*h+4,GREY,11,'right');});
  var X=function(t){return x0+t/100*w;},Y=function(v){return y0-v/.022*h;};bio_fn(function(t){return .02/(1+.02*t);},0,100,X,Y,BLUE,2.8,50);
  bio_pop(p,function(){DOT(X(1),Y(.02/1.02),5,RED);TB('q\' = q/(1 + q) = 0,0196',W*.5,H*.42,DRED,14,'left');TB('élimination très lente : l\'allèle se cache chez les hétérozygotes',W*.5,H*.95,DGREEN,12);});},
 function(p){ /* 11 Lotka-Volterra */
  bio_cap('α = 0,8 · β = 0,04 · γ = 0,6 · δ = 0,02',22);
  if(!b10_lv)b10_lv=b10_LV(40,20,40,.02);var d=b10_lv;
  var x0=W*.1,y0=H*.8,w=W*.82,h=H*.56;bio_ax(x0,y0,w,h,'t (années)','effectifs');[10,20,30].forEach(function(v){TB(''+v,x0+v/30*w,y0+15,GREY,11);});
  var X=function(v){return x0+v/30*w;},Y=function(v){return y0-v/60*h;};
  [[1,BLUE],[2,RED]].forEach(function(q){ctx.strokeStyle=q[1];ctx.lineWidth=2.6;ctx.beginPath();for(var k=0;k<d.length&&d[k][0]<=30;k+=5){var xx=X(d[k][0]),yy=Y(d[k][q[0]]);k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});
  TB('— proies',W*.12,H*.17,BLUE_D,12,'left');TB('— prédateurs',W*.3,H*.17,DRED,12,'left');
  bio_pop(p,function(){LN(x0,Y(30),x0+w,Y(30),BLUE,1.2,[5,4]);LN(x0,Y(20),x0+w,Y(20),RED,1.2,[5,4]);TB('équilibre : 30 proies · 20 prédateurs',W*.55,H*.95,DGREEN,13);TB('période ≈ 9,1 ans · décalage ≈ 2,3 ans',W*.98,H*.17,DRED,12,'right');});},
 function(p){ /* 12 déficit d'hétérozygotes */
  bio_cap('1 000 personnes · p̂ = 0,61',22);
  var y0=H*.76,h=H*.5;LN(W*.08,y0,W*.7,y0,INK,1.6);
  [['AA',420,372,GREEN],['Aa',380,476,ORANGE],['aa',200,152,RED]].forEach(function(q,i){var x=W*.12+i*W*.19;ctx.fillStyle=q[3];ctx.globalAlpha=.5;ctx.fillRect(x,y0-q[1]/500*h,W*.07,q[1]/500*h);ctx.globalAlpha=1;ctx.strokeStyle=q[3];ctx.lineWidth=2;ctx.strokeRect(x,y0-q[1]/500*h,W*.07,q[1]/500*h);TB(q[1]+'',x+W*.035,y0-q[1]/500*h-5,dk(q[3]),12);
   bio_pop(p,function(){LN(x+W*.08,y0-q[2]/500*h,x+W*.15,y0-q[2]/500*h,INK,3);TB(q[2]+'',x+W*.115,y0-q[2]/500*h-5,INK,12);});TB(q[0],x+W*.075,y0+17,INK,13);});
  TB('observé',W*.2,H*.2+10,GREY,12);
  bio_pop(p,function(){TB('trait noir = attendu',W*.88,H*.2,INK,12);TB('χ² ≈ 40,5',W*.87,H*.4,DRED,16);TB('> 3,84',W*.87,H*.5,DRED,14);TB('F ≈ 0,20',W*.87,H*.64,DRED,15);TB('déficit en Aa',W*.87,H*.76,DGREEN,12);});},
 function(p){ /* 13 mutation-sélection */
  bio_cap('Incidence de la mucoviscidose : q² ≈ μ/s (s = 1)',22);
  var y0=H*.78,h=H*.46;LN(W*.1,y0,W*.9,y0,INK,1.6);
  ctx.fillStyle='#fcebeb';ctx.fillRect(W*.2,y0-h,W*.22,h);ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.strokeRect(W*.2,y0-h,W*.22,h);TB('observé 4·10⁻⁴',W*.31,y0-h-6,DRED,13);TB('= 1/2 500',W*.31,y0+17,INK,12);
  bio_pop(p,function(){var bh=h/400;ctx.fillStyle='#e6f1fb';ctx.fillRect(W*.58,y0-bh-1,W*.22,bh+1);ctx.strokeStyle=BLUE;ctx.strokeRect(W*.58,y0-bh-1,W*.22,bh+1);TB('μ = 10⁻⁶ : 400 fois moins',W*.69,y0-h*.4,BLUE_D,13);TB('mutation seule : insuffisant',W*.69,y0+17,INK,12);TB('→ avantage de l\'hétérozygote, effet fondateur',W*.5,H*.95,DGREEN,13);});}
]);
