/* Biologie BA1 · chapitre 9 : théorie animée et devantures */
function b9_pun(x,y,cw,ch,top,left,cells,hi){ /* échiquier de Punnett : cells[i][j]={t,c} */
 top.forEach(function(g,j){TB(g,x+(j+1.5)*cw,y+ch*.62,INK,13);});left.forEach(function(g,i){TB(g,x+cw*.5,y+(i+1)*ch+ch*.62,INK,13);});
 cells.forEach(function(r,i){r.forEach(function(q,j){var X=x+(j+1)*cw,Y=y+(i+1)*ch;ctx.fillStyle=q.f||'#fff';ctx.strokeStyle=q.c||AX;ctx.lineWidth=q.w||1.8;ctx.beginPath();ctx.roundRect(X+2,Y+2,cw-4,ch-4,5);ctx.fill();ctx.stroke();TB(q.t,X+cw/2,Y+ch*.62,q.k||INK,cw>50?13:11);});});}
function b9_ped(x,y,sex,st,lab){ /* st 0 sain, 1 atteint, 2 porteur, 3 inconnu */
 var r=15;ctx.lineWidth=2.4;ctx.strokeStyle=INK;ctx.fillStyle=st===1?'#3d3d3a':'#fff';ctx.beginPath();if(sex==='M')ctx.rect(x-r,y-r,2*r,2*r);else ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();
 if(st===2)DOT(x,y,4.5,INK);if(st===3)TB('?',x,y+6,DRED,17);if(lab)TB(lab,x,y+r+16,INK,11);}
function b9_gauss(x0,y0,w,h,mu,sd,lo,hi,col,thr,fillRight){var X=function(v){return x0+(v-lo)/(hi-lo)*w;},f=function(v){return Math.exp(-(v-mu)*(v-mu)/(2*sd*sd));};
 ctx.fillStyle=col;ctx.globalAlpha=.22;ctx.beginPath();var st=thr;var a=fillRight?thr:lo,b=fillRight?hi:thr;ctx.moveTo(X(a),y0);for(var v=a;v<=b+1e-9;v+=(hi-lo)/120)ctx.lineTo(X(v),y0-f(v)*h);ctx.lineTo(X(b),y0);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
 ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.beginPath();for(var u=lo;u<=hi+1e-9;u+=(hi-lo)/120){var xx=X(u),yy=y0-f(u)*h;u===lo?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();return X;}

SFA.theo("c09",{
 icon:function(){var cs=[['AB',BLUE],['Ab',GREEN],['aB',ORANGE],['ab',RED]];for(var i=0;i<4;i++)for(var j=0;j<4;j++){var a=(i<2||j<2),b=(i%2===0||j%2===0);var c=(i<2||j<2)?((i%2===0||j%2===0)?BLUE:GREEN):((i%2===0||j%2===0)?ORANGE:RED);ctx.fillStyle=c;ctx.globalAlpha=.75;ctx.fillRect(W*.1+j*28,H*.12+i*28,25,25);ctx.globalAlpha=1;}
  TB('9 : 3 : 3 : 1',W*.66,H*.36,BLUE_D,26);TB('χ² · liaison · cM',W*.66,H*.58,ORANGE,18);TB('génétique mendélienne',W*.5,H*.92,GREY,14);},
 sub:[
 {t:"Croisements, probabilités et χ²",
  anim:function(t){
   var gam=['AB','Ab','aB','ab'],n=Math.min(16,Math.floor((t%520)/24)),x=W*.06,y=26,cw=44,ch=40;
   TB('AaBb × AaBb : 16 combinaisons de gamètes',W*.5,18,BLUE_D,14);
   var cnt=[0,0,0,0];
   for(var i=0;i<4;i++)for(var j=0;j<4;j++){var k=i*4+j;var a=(i<2||j<2),b=(i%2===0||j%2===0);var ph=a?(b?0:1):(b?2:3);var col=[BLUE,GREEN,ORANGE,RED][ph];if(k<n){cnt[ph]++;ctx.fillStyle=col;ctx.globalAlpha=.75;ctx.fillRect(x+(j+1)*cw+2,y+(i+1)*ch+2,cw-4,ch-4);ctx.globalAlpha=1;TB(['A_B_','A_bb','aaB_','aabb'][ph],x+(j+1.5)*cw,y+(i+1.5)*ch+4,'#fff',11);}else{ctx.strokeStyle=AX;ctx.lineWidth=1.4;ctx.strokeRect(x+(j+1)*cw+2,y+(i+1)*ch+2,cw-4,ch-4);}}
   gam.forEach(function(g,j){TB(g,x+(j+1.5)*cw,y+ch*.7,INK,12);TB(g,x+cw*.5,y+(j+1)*ch+ch*.62,INK,12);});
   var bx=W*.56,by=H*.82,bw=60;var names=[['A_B_ 9/16',BLUE,9],['A_bb 3/16',GREEN,3],['aaB_ 3/16',ORANGE,3],['aabb 1/16',RED,1]];
   names.forEach(function(q,i){var yy=by-i*0+0;});
   names.forEach(function(q,i){var yy=60+i*34;ctx.fillStyle=q[1];ctx.fillRect(bx,yy,Math.max(4,cnt[i]*20),22);TB(q[0],bx+190,yy+16,dk(q[1]),12,'left');TB(String(cnt[i]),bx-8,yy+16,INK,13,'right');});
   TB('observé après '+n+' / 16 cases',W*.7,H*.9,GREY,12);},
  th:'<div class="tcard"><b class="h">Monohybridisme et dihybridisme</b><p>Aa × Aa : 1/4 AA, 1/2 Aa, 1/4 aa ; phénotypes 3 : 1 (dominant : récessif). Si a est responsable d\'une maladie autosomique récessive : 1/4 atteint, 1/2 porteur sain. <b>Dihybridisme</b> (gènes indépendants) : AaBb × AaBb donne 16 combinaisons, 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb ; on multiplie les probabilités des gènes indépendants (A_B_ = 3/4 × 3/4 = 9/16 ; aabb = 1/16).</p><p><b>Règles</b> : « et » → produit, « ou » (exclusifs) → somme, « au moins un » → 1 − P(aucun). Couple Aa × Aa, 3 enfants : P(au moins un atteint) = 1 − (3/4)<sup>3</sup> = 37/64 ≈ 58 % ; P(les 2 premiers atteints) = 1/16. Piège : les naissances sont indépendantes, le « hasard » n\'a pas de mémoire.</p></div><div class="tcard"><b class="h">Test du χ²</b><p><b>χ² = Σ (O − E)² / E</b>, ddl = nombre de classes − 1 (3 : 1 → 1 ddl ; 9:3:3:1 → 3 ddl). Seuils à 5 % : <b>3,84</b> (1 ddl), 7,81 (3 ddl) ; à 0,1 % : 10,83 (1 ddl). Exemple : 152 dominants et 48 récessifs sur 200 (attendu 150 et 50) : χ² = 4/150 + 4/50 = 0,11 &lt; 3,84 : compatible avec 3 : 1.</p><p>χ² &lt; seuil : on <b>ne rejette pas</b> l\'hypothèse (cela ne la démontre pas) ; χ² &gt; seuil : on la rejette (liaison, létalité, effectifs trop petits…). Utiliser les effectifs, jamais les pourcentages.</p></div><div class="tcard"><b class="h">Groupes sanguins, liaison à l\'X, arbres</b><p><b>ABO</b> : allèles I<sup>A</sup> et I<sup>B</sup> codominants, i récessif. Père AB × mère O (ii) : enfants A (I<sup>A</sup>i) ou B (I<sup>B</sup>i) seulement. Rhésus : D dominant (Rh+), dd = Rh−. Mère AO dd × père BO Dd : P(O et Rh−) = 1/4 × 1/2 = <b>1/8</b>.</p><p><b>Récessif lié à l\'X</b> (hémophilie) : mère porteuse X<sup>H</sup>X<sup>h</sup> × père sain : la moitié des garçons atteints, la moitié des filles porteuses, aucune fille atteinte. Dans un arbre, une maladie récessive saute des générations ; avec un frère atteint, la probabilité d\'être porteur pour une personne saine est 2/3. Exemple (mucoviscidose, q = 0,02, porteurs 2pq ≈ 3,9 %) : risque = 2/3 × 0,039 × 1/4 ≈ 0,65 %, soit ≈ 16 fois le risque de la population.</p></div><div class="tcard"><b class="h">Caractères polygéniques, pénétrance, hérédité</b><p>Génotype ≠ phénotype : la <b>pénétrance</b> est la proportion de porteurs du génotype qui expriment le caractère. Parent Dd (dominante, pénétrance 80 %) × dd : 50 % Dd, 40 % exprimant, 10 % Dd sans expression. Un caractère polygénique additif a une distribution en cloche ; <b>héritabilité au sens large h² = V<sub>g</sub>/(V<sub>g</sub> + V<sub>e</sub>)</b> : V<sub>g</sub> = 4 et σ = 2 (V<sub>e</sub> = 4) → h² = 0,50. Seuil à 12 : pour g = 14, P(atteint) = P(E &gt; −2) = P(Z &gt; −1) ≈ 84 % ; pour g = 10, P(Z &gt; 1) ≈ 16 % : le génotype ne détermine pas le phénotype.</p></div>'},
 {t:"Liaison génétique et cartographie",
  anim:function(t){
   var ph=(t%800)/800,r=.5*(0.5-0.5*Math.cos(ph*2*PI));
   TB('Croisement-test AB/ab × ab/ab : fréquence des gamètes selon la distance',W*.5,18,BLUE_D,13);
   var x0=W*.1,y0=H*.78,h=H*.5,bw=W*.095;var cls=[['AB',(1-r)/2,BLUE],['ab',(1-r)/2,BLUE],['Ab',r/2,ORANGE],['aB',r/2,ORANGE]];LN(x0-10,y0,x0+4*(bw+8)+2,y0,INK,1.6);
   cls.forEach(function(q,i){var bh=q[1]/.5*h;var xx=x0+i*(bw+8);ctx.fillStyle=q[2];ctx.globalAlpha=.55;ctx.fillRect(xx,y0-bh,bw,bh);ctx.globalAlpha=1;ctx.strokeStyle=q[2];ctx.lineWidth=2;ctx.strokeRect(xx,y0-bh,bw,bh);TB(q[0],xx+bw/2,y0+16,INK,13);TB((q[1]*100).toFixed(1).replace('.',',')+' %',xx+bw/2,y0-bh-5,dk(q[2]),12);});
   TB('parentaux',x0+bw+4,y0+34,BLUE_D,12);TB('recombinés',x0+3*(bw+8)-4,y0+34,DRED,12);
   var cx=W*.79;TB('r = '+(r*100).toFixed(0)+' % = '+(r*100).toFixed(0)+' cM',cx,H*.34,DRED,18);
   LN(cx-70,H*.52,cx+70,H*.52,INK,6);DOT(cx-60,H*.52,7,BLUE);DOT(cx-60+120*(r/.5),H*.52,7,ORANGE);TB('A',cx-60,H*.52-14,BLUE_D,12);TB('B',cx-60+120*(r/.5),H*.52-14,DRED,12);
   TB(r>.47?'r = 50 % : gènes indépendants (1:1:1:1)':'gènes liés : parentaux > recombinés',cx,H*.7,DGREEN,12);},
  th:'<div class="tcard"><b class="h">Liaison et recombinaison</b><p>Deux gènes sur le même chromosome sont <b>liés</b> : ils tendent à être transmis ensemble. Le <b>crossing-over</b> (méiose I) les sépare. Dans un croisement-test dihybride, la <b>fréquence de recombinants</b> r = (nombre de recombinés)/(total) ; <b>1 % de recombinants = 1 centimorgan (cM)</b>. r = 50 % : gènes indépendants (1 : 1 : 1 : 1). Distance maximale mesurable : 50 cM.</p><p>Exemple : 440 + 440 parentaux, 60 + 60 recombinés sur 1 000 : r = 12 % → 12 cM. Autre exemple : 430 + 420 parentaux, 80 + 70 recombinés : χ² contre 1:1:1:1 = 490 (liaison très significative), distance 15 cM, et ≈ 30 % des méioses portent un crossing-over entre les deux locus (un crossing-over n\'engendre que 50 % de gamètes recombinés).</p></div><div class="tcard"><b class="h">Croisement-test à trois points</b><p>Pour un triple hétérozygote : les deux classes les plus fréquentes sont les <b>parentales</b> ; les deux plus rares sont les <b>doubles recombinants</b>. L\'allèle qui change entre une parentale et un double recombinant est celui du <b>gène du milieu</b>. Exemple (2 000 descendants : 704 + 704 parentaux ; 96 + 96 ; 196 + 196 ; 4 + 4) : la double recombinaison R S t / r s T différe de R S T par T : T est au milieu, ordre S–T–R. Distance S–T = (96 + 96 + 4 + 4)/2 000 = 10 cM ; T–R = (196 + 196 + 4 + 4)/2 000 = 20 cM (on ajoute les doubles à chaque intervalle).</p><p><b>Coïncidence</b> = doubles observés / doubles attendus = 8 / (0,10 × 0,20 × 2 000 = 40) = 0,2 ; interférence = 1 − 0,2 = 0,8.</p></div>'}
 ]
});
SFA.figs("c09",[
 function(p){ /* 0 Aa x Aa */
  bio_cap('Aa × Aa · maladie autosomique récessive',22);
  var c=function(t,f,k){return {t:t,f:f,k:k};};
  b9_pun(W*.08,H*.16,W*.13,H*.2,['A','a'],['A','a'],[[c('AA','#e1f5ee',DGREEN),c('Aa','#faeeda',DRED)],[c('Aa','#faeeda',DRED),c('aa',p>0?'#fcebeb':'#fff',DRED)]]);
  TB('porteurs sains ?',W*.8,H*.4,GREY,13);
  bio_pop(p,function(){TB('atteint (aa) : 1/4',W*.8,H*.3,DRED,15);TB('porteur sain (Aa) : 1/2',W*.8,H*.5,DRED,15);});},
 function(p){ /* 1 dihybride */
  bio_cap('AaBb × AaBb (gènes indépendants)',22);
  var g=['AB','Ab','aB','ab'],cells=[];for(var i=0;i<4;i++){cells.push([]);for(var j=0;j<4;j++){var a=(i<2||j<2),b=(i%2===0||j%2===0);var ph=a?(b?0:1):(b?2:3);var f=['#e6f1fb','#e1f5ee','#faeeda','#fcebeb'][ph];cells[i].push({t:'',f:p>0?f:'#fff',c:p>0?[BLUE,GREEN,ORANGE,RED][ph]:AX});}}
  b9_pun(W*.1,H*.1,W*.1,H*.15,g,g,cells);
  TB('9 A_B_',W*.74,H*.3,p>0?BLUE_D:GREY,15);TB('3 A_bb',W*.74,H*.42,p>0?DGREEN:GREY,15);TB('3 aaB_',W*.74,H*.54,p>0?ORANGE:GREY,15);TB('1 aabb',W*.74,H*.66,p>0?DRED:GREY,15);
  bio_pop(p,function(){TB('A_B_ : 9/16 · aabb : 1/16',W*.5,H*.95,DGREEN,15);});},
 function(p){ /* 2 AB x O */
  bio_cap('Père AB (IᴬIᴮ) × mère O (ii)',22);
  var c=function(t,f,k){return {t:t,f:f,k:k};};
  b9_pun(W*.08,H*.16,W*.13,H*.2,['i','i'],['Iᴬ','Iᴮ'],[[c('Iᴬi','#e6f1fb',BLUE_D),c('Iᴬi','#e6f1fb',BLUE_D)],[c('Iᴮi','#faeeda',DRED),c('Iᴮi','#faeeda',DRED)]]);
  TB('groupes possibles ?',W*.8,H*.4,GREY,14);bio_pop(p,function(){TB('A ou B',W*.8,H*.3,DGREEN,20);TB('(1/2 A · 1/2 B)',W*.8,H*.45,GREY,13);TB('ni AB, ni O',W*.8,H*.6,DRED,14);});},
 function(p){ /* 3 chi2 */
  bio_cap('152 dominants · 48 récessifs · attendu 3 : 1',22);
  var y0=H*.78,h=H*.44;LN(W*.08,y0,W*.52,y0,INK,1.6);
  [[152,150,'dominants'],[48,50,'récessifs']].forEach(function(q,i){var x=W*.14+i*W*.2;var bh=q[0]/152*h,eh=q[1]/152*h;ctx.fillStyle='#e6f1fb';ctx.fillRect(x,y0-bh,50,bh);ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.strokeRect(x,y0-bh,50,bh);LN(x-6,y0-eh,x+56,y0-eh,RED,2.4,[4,3]);TB(q[0]+'',x+25,y0-bh-14,BLUE_D,13);TB(q[2],x+25,y0+16,INK,12);});
  TB('- - attendu : 150 et 50',W*.3,H*.22,DRED,12);
  bio_pop(p,function(){TB('χ² = 4/150 + 4/50',W*.76,H*.3,INK,14);TB('≈ 0,11',W*.76,H*.42,DRED,20);LN(W*.6,H*.62,W*.94,H*.62,INK,2);LN(W*.6+(W*.34)*.11/6,H*.62-8,W*.6+(W*.34)*.11/6,H*.62+8,RED,3);LN(W*.6+(W*.34)*3.84/6,H*.62-10,W*.6+(W*.34)*3.84/6,H*.62+10,DGREEN,3);TB('3,84',W*.6+(W*.34)*3.84/6,H*.62+26,DGREEN,12);TB('0,11',W*.6+(W*.34)*.11/6+6,H*.62-14,DRED,12);TB('0,11 < 3,84 : compatible avec 3 : 1',W*.5,H*.95,DGREEN,14);});},
 function(p){ /* 4 plusieurs enfants */
  bio_cap('Aa × Aa : 3 enfants prévus',22);
  for(var i=0;i<3;i++){var x=W*.2+i*W*.3;b9_ped(x,H*.35,i%2?'F':'M',p>0&&i<2?3:3,'');TB('enfant '+(i+1),x,H*.35+36,GREY,12);}
  TB('chaque enfant : 1/4 atteint (indépendants)',W*.5,H*.62,INK,14);
  bio_pop(p,function(){TB('au moins un atteint : 1 − (3/4)³ = 37/64 ≈ 58 %',W*.5,H*.78,DRED,15);TB('les 2 premiers atteints : 1/4 × 1/4 = 1/16',W*.5,H*.9,DGREEN,15);});},
 function(p){ /* 5 distance génétique */
  bio_cap('Croisement-test dihybride · 1 000 descendants',22);
  var x0=W*.12,y0=H*.7,h=H*.4;LN(W*.08,y0,W*.55,y0,INK,1.6);
  [[440,BLUE,'AB'],[440,BLUE,'ab'],[60,ORANGE,'Ab'],[60,ORANGE,'aB']].forEach(function(q,i){var x=x0+i*W*.1;var bh=q[0]/440*h;ctx.fillStyle=q[1];ctx.globalAlpha=.55;ctx.fillRect(x,y0-bh,W*.08,bh);ctx.globalAlpha=1;ctx.strokeStyle=q[1];ctx.lineWidth=2;ctx.strokeRect(x,y0-bh,W*.08,bh);TB(q[0]+'',x+W*.04,y0-bh-5,dk(q[1]),12);TB(q[2],x+W*.04,y0+16,INK,12);});
  TB('parentaux',x0+W*.1,y0+34,BLUE_D,12);TB('recombinés',x0+W*.25,y0+34,DRED,12);
  bio_pop(p,function(){TB('(60 + 60) / 1 000',W*.78,H*.34,INK,14);TB('= 12 %',W*.78,H*.46,DRED,18);TB('12 cM',W*.78,H*.62,DGREEN,22);});},
 function(p){ /* 6 hémophilie */
  bio_cap('Mère XᴴXʰ × père XᴴY',22);
  var c=function(t,f,k){return {t:t,f:f,k:k};};
  b9_pun(W*.06,H*.16,W*.13,H*.2,['Xᴴ','Y'],['Xᴴ','Xʰ'],[[c('XᴴXᴴ','#fff',INK),c('XᴴY','#fff',INK)],[c('XᴴXʰ','#fff',INK),c('XʰY','#fff',INK)]]);
  bio_pop(p,function(){TB('1/2 des garçons atteints',W*.78,H*.3,DRED,14);TB('(XʰY)',W*.78,H*.42,DRED,14);TB('filles : jamais atteintes,',W*.78,H*.62,GREY,12);TB('1/2 porteuses',W*.78,H*.72,GREY,12);});},
 function(p){ /* 7 pénétrance */
  bio_cap('Dd × dd · pénétrance 80 %',22);
  b9_ped(W*.2,H*.3,'M',1,'Dd');b9_ped(W*.4,H*.3,'F',0,'dd');LN(W*.2+15,H*.3,W*.4-15,H*.3,INK,2);LN(W*.3,H*.3,W*.3,H*.5,INK,2);
  var x0=W*.12,w=W*.76,y=H*.64;ctx.fillStyle='#fdece4';ctx.fillRect(x0,y,w*.4,30);ctx.fillStyle='#faeeda';ctx.fillRect(x0+w*.4,y,w*.1,30);ctx.fillStyle='#e1f5ee';ctx.fillRect(x0+w*.5,y,w*.5,30);ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.strokeRect(x0,y,w,30);
  TB('Dd',x0+w*.25,y+20,DRED,13);TB('dd',x0+w*.75,y+20,DGREEN,13);
  bio_pop(p,function(){TB('Dd exprimant 40 %',x0+w*.2,y+52,DRED,13);TB('Dd non exprimant 10 %',x0+w*.45,y+72,ORANGE,13);TB('50 % Dd × 0,8 = 40 % atteints',W*.7,H*.34,DGREEN,14);});},
 function(p){ /* 8 O Rh- */
  bio_cap('Mère AO dd × père BO Dd : enfant O et Rh− ?',22);
  var c=function(t,f,k){return {t:t,f:f,k:k};};
  b9_pun(W*.05,H*.14,W*.1,H*.15,['B','O'],['A','O'],[[c('AB'),c('AO')],[c('BO'),c('OO','#e1f5ee',DGREEN)]]);
  b9_pun(W*.52,H*.14,W*.1,H*.15,['D','d'],['d','d'],[[c('Dd'),c('dd','#e1f5ee',DGREEN)],[c('Dd'),c('dd','#e1f5ee',DGREEN)]]);
  TB('groupe O : 1/4',W*.2,H*.62,DGREEN,14);TB('Rh− (dd) : 1/2',W*.68,H*.62,DGREEN,14);
  bio_pop(p,function(){TB('1/4 × 1/2 = 1/8',W*.5,H*.84,DRED,22);});},
 function(p){ /* 9 trois points */
  bio_cap('Ordre des gènes : double recombinant R S t / r s T',22);
  var y=H*.4,x0=W*.12,w=W*.76;LN(x0,y,x0+w,y,INK,5);var pos=[['S',0],['T',.33],['R',1]];
  pos.forEach(function(q){DOT(x0+w*q[1],y,9,BLUE);TB(q[0],x0+w*q[1],y-18,BLUE_D,16);});
  bio_pop(p,function(){TB('10 cM',x0+w*.165,y+30,DRED,15);TB('20 cM',x0+w*.66,y+30,DRED,15);TB('gène du milieu : T (change dans les doubles)',W*.5,H*.66,DGREEN,13);TB('S–T = (96+96+4+4)/2 000 = 10 cM',W*.5,H*.76,INK,13);TB('T–R = (196+196+4+4)/2 000 = 20 cM',W*.5,H*.85,INK,13);TB('coïncidence = 8 / (0,10 × 0,20 × 2 000) = 0,2',W*.5,H*.95,DRED,14);});
  if(p<=0)TB('parentales : 704 + 704 · doubles : 4 + 4',W*.5,H*.7,GREY,14);},
 function(p){ /* 10 interpréter χ² */
  bio_cap('χ² = 5,2 · 3 ddl · n = 320',22);
  var x0=W*.1,w=W*.8,y=H*.55;LN(x0,y,x0+w,y,INK,2);var X=function(v){return x0+v/12*w;};[0,2,4,6,8,10,12].forEach(function(v){LN(X(v),y-4,X(v),y+4,INK,1.4);TB(''+v,X(v),y+20,GREY,12);});
  ctx.fillStyle='rgba(29,158,117,.14)';ctx.fillRect(X(0),y-34,X(7.81)-X(0),34);ctx.fillStyle='rgba(226,75,74,.12)';ctx.fillRect(X(7.81),y-34,X(12)-X(7.81),34);
  LN(X(7.81),y-44,X(7.81),y+8,RED,2.4,[5,4]);TB('seuil 7,81',X(7.81),y-52,DRED,13);DOT(X(5.2),y,8,BLUE);TB('5,2',X(5.2),y-44,BLUE_D,15);
  bio_pop(p,function(){TB('5,2 < 7,81 : on ne rejette pas 9:3:3:1',W*.5,H*.82,DGREEN,15);TB('(ce n\'est pas une preuve d\'indépendance)',W*.5,H*.92,GREY,13);});},
 function(p){ /* 11 pénétrance / hérédité */
  bio_cap('Seuil de maladie : phénotype > 12 (σ = 2)',22);
  var x0=W*.06,w=W*.88,y0=H*.76,h=H*.4;var X=b9_gauss(x0,y0,w,h,14,2,6,20,BLUE,12,true);b9_gauss(x0,y0,w,h,10,2,6,20,ORA2,12,true);
  LN(x0,y0,x0+w,y0,INK,1.6);LN(X(12),y0+4,X(12),y0-h-10,RED,2.4,[5,4]);TB('seuil 12',X(12),y0-h-14,DRED,13);
  TB('g = 14',X(14)+14,y0-h-6,BLUE_D,13);TB('g = 10',X(10)-4,y0-h-6,DRED,13,'right');
  bio_pop(p,function(){TB('g = 14 : 84 % atteints',W*.98,H*.3,BLUE_D,14,'right');TB('g = 10 : 16 % atteints',W*.98,H*.4,DRED,14,'right');TB('h² = 4 / (4 + 4) = 0,50',W*.5,H*.95,DGREEN,15);});},
 function(p){ /* 12 risque frère atteint */
  bio_cap('Mucoviscidose (1/2 500) · une femme dont le frère est atteint',22);
  b9_ped(W*.2,H*.22,'M',2,'');b9_ped(W*.34,H*.22,'F',2,'');LN(W*.2+15,H*.22,W*.34-15,H*.22,INK,2);LN(W*.27,H*.22,W*.27,H*.34,INK,2);LN(W*.17,H*.34,W*.37,H*.34,INK,2);
  b9_ped(W*.17,H*.5,'M',1,'frère');b9_ped(W*.37,H*.5,'F',3,'sa sœur');
  b9_ped(W*.62,H*.5,'M',3,'partenaire');LN(W*.37+15,H*.5,W*.62-15,H*.5,INK,2);LN(W*.5,H*.5,W*.5,H*.66,INK,2);b9_ped(W*.5,H*.76,'F',3,'enfant');
  bio_pop(p,function(){TB('2/3',W*.37+20,H*.5-22,DRED,14,'left');TB('2pq ≈ 3,9 %',W*.62+20,H*.5-22,DRED,14,'left');TB('× 1/4',W*.5+22,H*.66+8,DRED,13,'left');TB('2/3 × 0,039 × 1/4 ≈ 0,65 %',W*.78,H*.78,DRED,13);TB('≈ 16 × le risque de la population',W*.78,H*.88,DGREEN,12);});},
 function(p){ /* 13 liaison et fréquence de crossing-over */
  bio_cap('Croisement-test : 430 · 420 parentaux · 80 · 70 recombinés',22);
  var x0=W*.12,y0=H*.68,h=H*.42;LN(W*.08,y0,W*.6,y0,INK,1.6);
  [[430,BLUE],[420,BLUE],[80,ORANGE],[70,ORANGE]].forEach(function(q,i){var x=x0+i*W*.11;var bh=q[0]/430*h;ctx.fillStyle=q[1];ctx.globalAlpha=.55;ctx.fillRect(x,y0-bh,W*.09,bh);ctx.globalAlpha=1;ctx.strokeStyle=q[1];ctx.lineWidth=2;ctx.strokeRect(x,y0-bh,W*.09,bh);TB(q[0]+'',x+W*.045,y0-bh-5,dk(q[1]),12);});
  LN(W*.08,y0-h*250/430,W*.6,y0-h*250/430,RED,1.6,[5,4]);TB('attendu si indépendants : 250',W*.6,y0-h*250/430-6,DRED,11,'right');
  bio_pop(p,function(){TB('χ² ≈ 490 : liaison',W*.8,H*.32,DRED,15);TB('r = 150/1 000 = 15 cM',W*.8,H*.46,DGREEN,15);TB('≈ 30 % des méioses',W*.8,H*.62,DGREEN,14);TB('avec crossing-over',W*.8,H*.72,DGREEN,14);});}
]);
