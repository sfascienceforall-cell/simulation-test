/* Maths 5e · chapitre 7 · étude complète de fonction */
/* tableau de variations : xs = étiquettes des nœuds, zs = marque en f′ ('0','‖' ou ''), sg = signes entre nœuds, vs = valeurs de f aux nœuds (étiquettes), al = opacité des lignes f′ et f */
function m5_tab(x0,y0,w,h,xs,zs,sg,vs,al){var n=xs.length,r1=h*.22,r2=h*.26,r3=h-r1-r2,dx=w/(n-1),lb=34;
 ctx.strokeStyle='#b9bec5';ctx.lineWidth=1.5;ctx.strokeRect(x0,y0,w+lb+8,h);LN(x0,y0+r1,x0+w+lb+8,y0+r1,'#b9bec5',1.5);LN(x0,y0+r1+r2,x0+w+lb+8,y0+r1+r2,'#b9bec5',1.5);LN(x0+lb,y0,x0+lb,y0+h,'#b9bec5',1.5);
 var sz=Math.max(13,Math.min(17,w/n/3.2));TB('x',x0+lb/2,y0+r1*.68,INK,sz+1);TB('f ′',x0+lb/2,y0+r1+r2*.62,INK,sz+1);TB('f',x0+lb/2,y0+r1+r2+r3*.55,INK,sz+1);
 var px=function(i){return x0+lb+8+dx*i-(i===n-1?10:0)+(i===0?10:0);};
 for(var i=0;i<n;i++)TB(xs[i],px(i),y0+r1*.68,INK,sz);
 ctx.globalAlpha=al==null?1:al;
 for(i=0;i<n;i++){if(zs[i]==='0')TB('0',px(i),y0+r1+r2*.66,INK,sz);else if(zs[i]==='‖'){LN(px(i)-2,y0+r1,px(i)-2,y0+h,INK,1.6);LN(px(i)+2,y0+r1,px(i)+2,y0+h,INK,1.6);}}
 for(i=0;i<n-1;i++)TB(sg[i],(px(i)+px(i+1))/2,y0+r1+r2*.66,sg[i]==='+'?DGREEN:DRED,sz+2);
 var hi=y0+r1+r2+r3*.24,lo=y0+r1+r2+r3*.8,py=[];
 for(i=0;i<n;i++){var a=i>0?sg[i-1]:null,b=i<n-1?sg[i]:null,up;
  if(a&&b)up=(a==='+'&&b==='-')?true:(a==='-'&&b==='+')?false:(a==='+');else if(b)up=(b==='-');else up=(a==='+');
  py.push(up?hi:lo);}
 for(i=0;i<n-1;i++){var ya=py[i]+(sg[i]==='+'?12:-12)*0,x1=px(i)+(zs[i]==='‖'?10:sz*1.6),x2=px(i+1)-(zs[i+1]==='‖'?10:sz*1.6),yy1=sg[i]==='+'?lo:hi,yy2=sg[i]==='+'?hi:lo;
  if(sg[i]==='+'){yy1=py[i]+9;yy2=py[i+1]-9;}else{yy1=py[i]-9;yy2=py[i+1]+9;}
  arrow(x1,yy1,x2-x1,yy2-yy1,sg[i]==='+'?GREEN:RED,'',2.2);}
 for(i=0;i<n;i++)if(vs[i])TB(vs[i],px(i),py[i]+(py[i]===hi?-1:7)+ (py[i]===hi?0:0),INK,sz,'center');
 ctx.globalAlpha=1;}

SFA.theo("c07", {
 icon: function () { TB('étude de fonction', W*.5, H*.24, BLUE_D, 26); var x0=W*.2,y0=H*.36,w=W*.56,h=H*.5;m5_tab(x0,y0,w,h,['−∞','−1','1','+∞'],['','0','0',''],['+','−','+'],['−∞','2','−2','+∞'],1); },
 anim: function (t) {
  var s=Math.floor((t/150)%6),W0=W;W=W0*.62;var c=m5_G(-2.6,2.6,-4.5,4.5,{sx:1,sy:1,lbx:1,lby:2,top:14,left:30});W=W0;
  var f=function(x){return x*x*x-3*x;},r3=Math.sqrt(3),loc=(t%150)/150;
  var xr=s>=4?2.45:(s===3?-2.45+4.9*Math.min(1,loc*1.4):-3);
  if(s>=4){m5_fn(c,f,-2.45,2.45,BLUE,3.2);}else if(s===3){m5_fn(c,f,-2.45,xr,BLUE,3.2);}
  ctx.save();
  if(s>=1){[-r3,0,r3].forEach(function(x){m5_pt(c,x,0,ORA2,6);});m5_t(c,'zéros',r3+.1,-.7,DRED,11,'left');}
  if(s>=2){m5_pt(c,-1,2,RED,6);m5_pt(c,1,-2,GREEN,6);m5_t(c,'max',-1,2.7,DRED,11);m5_t(c,'min',1,-2.9,DGREEN,11);}
  if(s===0){m5_t(c,'symétrie par rapport à O',0,3.3,VIOLET,12);ctx.fillStyle=VIOLET;m5_pt(c,0,0,VIOLET,5);}
  ctx.restore();
  var steps=['1  Domaine, parité (impaire)','2  Zéros : 0 et ±√3','3  Limites : ∓∞ en ∓∞','4  f ′(x) = 3x² − 3 ; extrema','5  Tableau de variations','6  Courbe'];
  var tx=W*.64;steps.forEach(function(L,i){var on=(i===s||(s===3&&i===3)||(s===4&&i===4)),dn=i<s;TB(L,tx,H*.14+i*H*.135,on?DRED:(dn?DGREEN:GREY),on?15:13,'left');});
  if(s===5){TB('f impaire : courbe symétrique de centre O',tx,H*.14+6*H*.135,VIOLET,12,'left');}
 },
 th: "<div class='tcard'><b class='h'>Le plan d’étude</b><p>1) <b>Domaine</b> (dénominateur ≠ 0, radicande ≥ 0). 2) <b>Parité</b> : f(−x) = f(x) (paire, courbe symétrique par rapport à l’axe y) ou f(−x) = −f(x) (impaire, symétrique par rapport à l’origine) : on étudie alors une moitié. 3) <b>Zéros</b> et signe de f. 4) <b>Limites</b> aux bornes du domaine et en ±∞ : asymptotes. 5) <b>Dérivée</b>, signe de f ′. 6) <b>Tableau de variations</b>, extrema. 7) Quelques points et <b>courbe</b>.</p></div>"
 +"<div class='tcard'><b class='h'>Exemple : f(x) = x³ − 3x</b><p>Domaine ℝ ; impaire. Zéros : x(x² − 3) = 0, donc 0 et ±√3 ≈ ±1,73. Limites : −∞ en −∞, +∞ en +∞. f ′(x) = 3x² − 3 = 3(x − 1)(x + 1). Tableau : f croît jusqu’en −1, décroît entre −1 et 1, croît ensuite. Maximum local f(−1) = 2, minimum local f(1) = −2.</p></div>"
 +"<div class='tcard'><b class='h'>Exemple rationnel : f(x) = (x² + 1)/(x − 1)</b><p>Domaine ℝ \\ {1}. Pas de zéro (x² + 1 > 0). Division : f(x) = x + 1 + 2/(x − 1) : asymptote verticale x = 1, asymptote oblique y = x + 1. f ′(x) = (x² − 2x − 1)/(x − 1)², nulle en x = 1 ± √2. Maximum local f(1 − √2) = 2 − 2√2 ≈ −0,83 ; minimum local f(1 + √2) = 2 + 2√2 ≈ 4,83. Pour une racine : domaine par radicande ≥ 0 ; f(x) = x√(4 − x²) vit sur [−2 ; 2].</p></div>"
 +"<div class='tcard'><b class='h'>Lire un tableau, lire f ′</b><p>Le nombre de solutions de f(x) = k se lit sur le tableau : sur chaque intervalle où f est continue et strictement monotone, il y a au plus une solution, et exactement une si k est entre les valeurs aux extrémités. Lien courbe de f ↔ courbe de f ′ : f ′ s’annule aux extrema de f, est positive là où f monte, négative là où f descend.</p></div>"
 +"<div class='tcard'><b class='h'>Pièges</b><p>f ′ < 0 sur un domaine en deux morceaux ne signifie pas f décroissante sur tout le domaine : f(x) = 1/x décroît sur ]−∞ ; 0[ et sur ]0 ; +∞[ séparément, mais f(−1) = −1 < f(1) = 1. Ne pas oublier les asymptotes dans le tableau (barres doubles). Famille f<sub>m</sub>(x) = x + m/x : deux extrema si m > 0, aucun si m < 0. (6 h : points d’inflexion et concavité par f ″.)</p></div>"
});

SFA.figs("c07", [
 /* 0 domaine et zéros */
 function (p) {
  var c=m5_G(-7,7,-3,3,{sx:1,sy:1,lbx:2,lby:1,top:34});m5_cap('f(x) = (x + 1)/(x² − 9)',BLUE_D);var f=function(x){return (x+1)/(x*x-9);};
  m5_fn(c,f,-7,-3.08,BLUE,3,false,null,200);m5_fn(c,f,-2.92,2.92,BLUE,3,false,null,300);m5_fn(c,f,3.08,7,BLUE,3,false,null,200);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_av(c,-3,RED,'x = −3',-2.6);m5_av(c,3,RED,'x = 3',-2.6);m5_pt(c,-1,0,GREEN,6);m5_tag(c,'zéro : x = −1',-1.9,.75,DGREEN,12);m5_tag(c,'domaine ℝ \\ {−3 ; 3}',2.5,2.4,DRED,12);ctx.globalAlpha=1;}
 },
 /* 1 parité */
 function (p) {
  var q=m5_fd(p,0,.5);m5_cap('paire, impaire ou ni l’une ni l’autre ?',BLUE_D);
  m5_pane(0,3,function(){var c=m5_G(-1.8,1.8,0,8,{sx:1,sy:2,lbx:1,lby:4,top:56,left:22,bot:20});m5_fn(c,function(x){return Math.pow(x,4)-2*x*x+3;},-1.8,1.8,BLUE,3);TB('(a) x⁴ − 2x² + 3',W/2,46,BLUE_D,13);
   if(q>0){ctx.globalAlpha=q;m5_sg(c,0,0,0,8,VIOLET,1.6,[5,4]);m5_tag(c,'paire',.9,6.8,DGREEN,13);ctx.globalAlpha=1;}});
  m5_pane(1,3,function(){var c=m5_G(-1.8,1.8,-5,5,{sx:1,sy:2,lbx:1,lby:4,top:56,left:22,bot:20});m5_fn(c,function(x){return x*x*x-x;},-1.8,1.8,ORA2,3);TB('(b) x³ − x',W/2,46,DRED,13);
   if(q>0){ctx.globalAlpha=q;m5_pt(c,0,0,VIOLET,6);m5_tag(c,'impaire',-.8,3.6,DGREEN,13);ctx.globalAlpha=1;}});
  m5_pane(2,3,function(){var c=m5_G(-2.2,1.6,-1,5,{sx:1,sy:1,lbx:1,lby:2,top:56,left:22,bot:20});m5_fn(c,function(x){return x*x+x;},-2.2,1.6,GREEN,3);TB('(c) x² + x',W/2,46,DGREEN,13);
   if(q>0){ctx.globalAlpha=q;m5_tag(c,'ni l’une',.6,4,DRED,12);m5_tag(c,'ni l’autre',.6,3.1,DRED,12);ctx.globalAlpha=1;}});
 },
 /* 2 lire f′ */
 function (p) {
  m5_cap('f ′ > 0 avant 2, f ′ < 0 après',BLUE_D);
  var c=m5_G(-1,5,-1,3.6,{sx:1,sy:1,lbx:5,lby:5,top:38,bot:H*.48,left:20});
  m5_fn(c,function(x){return 2.6-.5*(x-2)*(x-2);},-.6,4.6,BLUE,3);var q=m5_fd(p,0,.5);
  if(q>0){ctx.globalAlpha=q;m5_pt(c,2,2.6,RED,6.5);m5_tag(c,'maximum local en x = 2',3.5,2.9,DRED,12);ctx.globalAlpha=1;}
  var x0=W*.12,w=W*.7;m5_tab(x0,H*.56,w,H*.4,['−∞','2','+∞'],['','0',''],['+','−'],['','',''],1);
 },
 /* 3 x³ − 3x */
 function (p) {
  var c=m5_G(-2.6,2.6,-5,5,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('f(x) = x³ − 3x',BLUE_D);var f=function(x){return x*x*x-3*x;};
  var q=m5_fd(p,0,.6);if(q>0)m5_signed(c,f,function(x){return 3*x*x-3;},-2.45,2.45,3.2);else m5_fn(c,f,-2.45,2.45,BLUE,3.2);
  m5_pt(c,0,0,ORA2,5);if(q>0){ctx.globalAlpha=q;[-Math.sqrt(3),Math.sqrt(3)].forEach(function(x){m5_pt(c,x,0,ORA2,5);});m5_pt(c,-1,2,RED,6.5);m5_pt(c,1,-2,DGREEN,6.5);m5_tag(c,'(−1 ; 2)',-1.7,2.7,DRED,13);m5_tag(c,'(1 ; −2)',1.8,-2.7,DGREEN,13);m5_tag(c,'±√3',1.9,.7,DRED,12);ctx.globalAlpha=1;}
 },
 /* 4 rationnelle */
 function (p) {
  var c=m5_G(-5,7,-10,12,{sx:1,sy:2,lbx:2,lby:4,top:34});m5_cap('f(x) = (x² + 1)/(x − 1)',BLUE_D);var f=function(x){return (x*x+1)/(x-1);},q=m5_fd(p,0,.5);
  if(q>0){ctx.globalAlpha=q;m5_av(c,1,RED,'x = 1',-9);m5_sg(c,-5,-4,7,8,GREEN,1.6,[6,4]);m5_tag(c,'y = x + 1',-3.2,-2.7,DGREEN,12);ctx.globalAlpha=1;}
  m5_two(c,f,-5,7,1,BLUE,3);
  if(q>0){ctx.globalAlpha=q;m5_pt(c,1-Math.SQRT2,2-2*Math.SQRT2,RED,6);m5_pt(c,1+Math.SQRT2,2+2*Math.SQRT2,GREEN,6);m5_tag(c,'max local −0,83',-2.2,1.3,DRED,12);m5_tag(c,'min local 4,83',4.8,6.7,DGREEN,12);ctx.globalAlpha=1;}
 },
 /* 5 combien de solutions */
 function (p) {
  var c=m5_G(-3.5,4.5,-6,8,{sx:1,sy:2,lbx:1,lby:2,top:34});m5_cap('f(−1) = 3 ; f(2) = −1',BLUE_D);var k=8/9,C=53/27,f=function(x){return k*(x*x*x/3-x*x/2-2*x)+C;};
  m5_fn(c,f,-3.1,4.1,BLUE,3.2);m5_pt(c,-1,3,BLUE_D,5);m5_pt(c,2,-1,BLUE_D,5);m5_t(c,'3',-.8,3.7,BLUE_D,12);m5_t(c,'−1',2.2,-1.8,BLUE_D,12,'left');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;var roots=[];[[-3.1,-1],[-1,2],[2,4.1]].forEach(function(I){var a=I[0],b=I[1];for(var i=0;i<40;i++){var m=(a+b)/2;if(f(a)*f(m)<=0)b=m;else a=m;}roots.push((a+b)/2);});
   roots.forEach(function(r){m5_pt(c,r,0,RED,6.5);});m5_tag(c,'3 solutions de f(x) = 0',2.2,5.6,DRED,13);ctx.globalAlpha=1;}
 },
 /* 6 irrationnelle */
 function (p) {
  var c=m5_G(-2.4,2.4,-2.6,2.6,{sx:1,sy:1,lbx:1,lby:1,top:34});m5_cap('f(x) = x√(4 − x²)',BLUE_D);var f=function(x){return x*Math.sqrt(4-x*x);};
  m5_fn(c,f,-2,2,BLUE,3.2,false,null,400);m5_pt(c,-2,0,BLUE_D,4);m5_pt(c,2,0,BLUE_D,4);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_pt(c,Math.SQRT2,2,RED,6);m5_pt(c,-Math.SQRT2,-2,DGREEN,6);m5_sg(c,-2.4,1,2.4,1,ORA2,1.5,[5,4]);
   var a=Math.sqrt(2-Math.sqrt(3)),b=Math.sqrt(2+Math.sqrt(3));m5_pt(c,a,1,ORA2,6);m5_pt(c,b,1,ORA2,6);m5_tag(c,'f = 1 : 2 solutions',-.9,1.45,DRED,12);m5_tag(c,'max 2',1.0,2.4,DRED,12);m5_tag(c,'min −2',-1.0,-2.4,DGREEN,12);ctx.globalAlpha=1;}
 },
 /* 7 1/x */
 function (p) {
  var c=m5_G(-4,4,-4,4,{eq:true,sx:1,sy:1,lbx:1,lby:1,top:34});m5_cap('f(x) = 1/x : f ′(x) = −1/x² < 0',BLUE_D);
  m5_two(c,function(x){return 1/x;},-4,4,0,BLUE,3);m5_pt(c,-1,-1,RED,6);m5_pt(c,1,1,GREEN,6);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-1,-1,1,-1,GREY,1.3,[4,3]);m5_sg(c,1,-1,1,1,GREY,1.3,[4,3]);m5_tag(c,'f(−1) = −1 < f(1) = 1',.2,-2.6,DRED,12);m5_tag(c,'décroissante sur chaque branche',0,3.6,DGREEN,11);ctx.globalAlpha=1;}
 },
 /* 8 famille */
 function (p) {
  var c=m5_G(-6,6,-10,10,{sx:1,sy:2,lbx:2,lby:5,top:34});m5_cap('f_m(x) = x + m/x',BLUE_D);var q=m5_fd(p,0,.5);
  m5_two(c,function(x){return x+1/x;},-6,6,0,'#b9c8dc',1.8);m5_two(c,function(x){return x-2/x;},-6,6,0,'#e6bba8',1.8);
  m5_two(c,function(x){return x+4/x;},-6,6,0,BLUE,3.2);m5_t(c,'m = 4',4.6,6.9,BLUE_D,12,'left');m5_t(c,'m = −2',4.9,2.8,'#c8541f',11,'left');
  if(q>0){ctx.globalAlpha=q;m5_av(c,0,RED,'x = 0',-9);m5_sg(c,-6,-6,6,6,GREEN,1.5,[6,4]);m5_pt(c,-2,-4,RED,6);m5_pt(c,2,4,DGREEN,6);m5_tag(c,'max (−2 ; −4)',-3.4,-6.2,DRED,11);m5_tag(c,'min (2 ; 4)',3.2,1.9,DGREEN,11);ctx.globalAlpha=1;}
 },
 /* 9 racines selon k */
 function (p) {
  var c=m5_G(-2.6,2.6,-4.5,4.5,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('x³ − 3x + k = 0 ⇔ 3x − x³ = k',BLUE_D);var g=function(x){return 3*x-x*x*x;};
  m5_fn(c,g,-2.2,2.2,BLUE,3.2);m5_pt(c,-1,-2,BLUE_D,4.5);m5_pt(c,1,2,BLUE_D,4.5);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;[[3,RED,'k = 3 : 1 solution'],[2,ORA2,'k = 2 : 2 solutions'],[0,GREEN,'k = 0 : 3 solutions']].forEach(function(L,i){m5_sg(c,-2.6,L[0],2.6,L[0],L[1],1.5,[5,4]);});
   m5_tag(c,'k = 3 : 1 solution',-1.2,3.4,DRED,11);m5_tag(c,'k = 2 : 2 solutions',-1.6,2.3,'#c8541f',11);m5_tag(c,'k = 0 : 3 solutions',-1.6,-.5,DGREEN,11);ctx.globalAlpha=1;
   m5_pt(c,0,0,GREEN,5);m5_pt(c,Math.sqrt(3),0,GREEN,5);m5_pt(c,-Math.sqrt(3),0,GREEN,5);m5_pt(c,1,2,ORA2,6);m5_pt(c,-2,2,ORA2,6);}
 }
]);
