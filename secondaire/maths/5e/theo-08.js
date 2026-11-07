/* Maths 5e · chapitre 8 · trigonométrie */
function m5_pit(c,step,sz){/* graduations en multiples de π/2 (step = 1) ou π/6 (step = 'six') sur l'axe des abscisses */var ay=m5_cl(0,c.ya,c.yb),k=1,x;
 if(step==='six'){for(k=1;k*PI/6<=c.xb+1e-9;k++){if(k%3===0)continue;}}
 for(k=1;k*PI/2<=c.xb+1e-9;k++){x=k*PI/2;var lab=k%2===0?(k===2?'π':(k/2)+'π'):(k===1?'π/2':k+'π/2');TB(lab,c.X(x),c.Y(ay)+(c.Y(ay)>c.Y(c.ya)-16?-8:15),GREY,sz||12);}}
function m5_sinG(xb,ya,yb,o){o=o||{};o.sx=PI/2;o.lbx=1000;o.sy=o.sy||1;o.lby=o.lby||1;var c=m5_G(-.25,xb,ya,yb,o);m5_pit(c,1,o.fs);return c;}
function m5_ucirc(cx,cy,R,col){ctx.strokeStyle=col||'#aab0b6';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(cx,cy,R,0,2*PI);ctx.stroke();LN(cx-R-14,cy,cx+R+14,cy,AX,1.3);LN(cx,cy-R-14,cx,cy+R+14,AX,1.3);}
function m5_fr2(v){return nfmt(v.toFixed(3).replace('.',','));}

SFA.theo("c08", {
 icon: function () { TB('sin(a + b)', W*.5, H*.36, BLUE_D, 30); TB('= sin a cos b + cos a sin b', W*.5, H*.55, ORA2, 21); TB('formules · sinusoïdes · équations', W*.5, H*.82, ORANGE, 15); },
 sub: [
  {t:"Formules d’addition",
   anim: function (t) {
    var a=45*D2R,b=(30+22*Math.sin(t*.02))*D2R,R=Math.min(H*.4,W*.2),cx=W*.27,cy=H*.54;
    m5_ucirc(cx,cy,R);var P=function(th){return {x:cx+R*Math.cos(th),y:cy-R*Math.sin(th)};};
    var Pa=P(a),Pab=P(a+b);
    LN(cx,cy,Pa.x,Pa.y,BLUE,2.2);LN(cx,cy,Pab.x,Pab.y,ORA2,2.8);arcA({x:cx,y:cy},R*.35,0,-a,'',BLUE);arcA({x:cx,y:cy},R*.5,-a,-(a+b),'',ORA2);
    TB('a',cx+R*.42*Math.cos(a/2),cy-R*.42*Math.sin(a/2)+4,BLUE_D,13);TB('b',cx+R*.62*Math.cos(a+b/2),cy-R*.62*Math.sin(a+b/2)+4,DRED,13);
    LN(Pab.x,Pab.y,Pab.x,cy,VIOLET,2.4,[4,3]);DOT(Pab.x,Pab.y,6,ORA2);DOT(Pa.x,Pa.y,4,BLUE);
    var tx=W*.56,s1=Math.sin(a+b),s2=Math.sin(a)*Math.cos(b)+Math.cos(a)*Math.sin(b);
    TB('a = 45°   b = '+nfmt((b/D2R).toFixed(1).replace('.',','))+'°',tx,H*.2,INK,15,'left');
    TB('sin(a + b) = '+m5_fr2(s1),tx,H*.4,DRED,16,'left');
    TB('sin a·cos b + cos a·sin b',tx,H*.55,BLUE_D,15,'left');TB('= '+m5_fr2(s2),tx,H*.55+22,BLUE_D,16,'left');
    TB('Les deux nombres sont égaux.',tx,H*.82,DGREEN,14,'left');
   },
   th: "<div class='tcard'><b class='h'>Formules d’addition</b><p><b>sin(a ± b) = sin a cos b ± cos a sin b</b><br><b>cos(a ± b) = cos a cos b ∓ sin a sin b</b><br>tan(a + b) = (tan a + tan b)/(1 − tan a tan b).</p><p><b>Exemple.</b> sin 75° = sin(45° + 30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4 ≈ 0,966. Attention : sin(a + b) n’est <b>pas</b> sin a + sin b.</p></div>"
   +"<div class='tcard'><b class='h'>Duplication</b><p>En posant b = a : <b>sin 2a = 2 sin a cos a</b> ; <b>cos 2a = cos²a − sin²a = 2cos²a − 1 = 1 − 2sin²a</b>.</p><p><b>Exemple.</b> a aigu avec sin a = 3/5 : cos a = 4/5 (car sin² + cos² = 1), sin 2a = 2·(3/5)(4/5) = 24/25, cos 2a = 16/25 − 9/25 = 7/25. Vérification : 1 − 2·9/25 = 7/25.</p></div>"
   +"<div class='tcard'><b class='h'>Triplication et méthode</b><p>cos 3x = cos(2x + x) = (2cos²x − 1)cos x − 2sin²x cos x = <b>4cos³x − 3cos x</b>. Pour une valeur exacte, décomposer l’angle en somme ou différence d’angles usuels (30°, 45°, 60°). Toujours contrôler avec sin² + cos² = 1. (6 h : formules de Simpson, transformation de produits en sommes.)</p></div>"},
  {t:"Fonctions sinusoïdales",
   anim: function (t) {
    var a=1.6+.9*Math.sin(t*.013),b=1+.35*Math.sin(t*.009+1),d=.4*Math.sin(t*.011+2),c0=.6*Math.sin(t*.01+4);
    var W0=W;var c=m5_sinG(4*PI,-4.2,4.2,{sy:1,lby:2,top:16,left:30,bot:22});
    m5_sg(c,-.25,d,4*PI,d,GREY,1.2,[5,4]);m5_fn(c,function(x){return Math.sin(x);},0,4*PI,'#d3dae3',1.6);
    var f=function(x){return a*Math.sin(b*x+c0)+d;};m5_fn(c,f,0,4*PI,ORA2,3.2,false,null,400);
    var per=2*PI/b,x0=-c0/b;while(x0<0)x0+=per;m5_sg(c,x0,d+a+.35,x0+per,d+a+.35,VIOLET,2);m5_t(c,'période',x0+per/2,d+a+.9,'#5249B5',11);
    m5_sg(c,-.15,d,-.15,d+a,GREEN,2.5);
    TB('a = '+nfmt(a.toFixed(2).replace('.',',')),W*.03+36,H*.93,DGREEN,12,'left');TB('période = '+nfmt(per.toFixed(2).replace('.',',')),W*.03+120,H*.93,'#5249B5',12,'left');TB('d = '+nfmt(d.toFixed(2).replace('.',',')),W*.03+270,H*.93,GREY,12,'left');
    TB('y = a·sin(bx + c) + d',W*.97,H*.07,BLUE_D,13,'right');
   },
   th: "<div class='tcard'><b class='h'>Lire a·sin(bx + c) + d</b><p><b>Amplitude</b> |a| ; <b>période</b> 2π/|b| ; <b>déphasage</b> −c/b (décalage horizontal) ; <b>valeur moyenne</b> d ; maximum d + |a|, minimum d − |a|.</p><p><b>Exemple.</b> f(x) = 3 sin(2x) − 1 : amplitude 3, période π, moyenne −1, maximum 2, minimum −4.</p></div>"
   +"<div class='tcard'><b class='h'>Modéliser un phénomène périodique</b><p>Marée entre 2 m et 8 m, période 12 h, 5 m à t = 0 en montant : d = (2 + 8)/2 = 5, a = (8 − 2)/2 = 3, b = 2π/12 = π/6, pas de déphasage : <b>h(t) = 5 + 3 sin(πt/6)</b>. Elle dépasse 6,5 m lorsque sin(πt/6) > 1/2, soit pour t entre 1 h et 5 h : pendant 4 heures.</p></div>"
   +"<div class='tcard'><b class='h'>Pièges</b><p>La période de sin(3x) est 2π/3 (et non 6π) : multiplier x par 3 « accélère » la fonction. Le déphasage de sin(2x + π/3) est −π/6, pas −π/3. Régler la calculatrice en radians.</p></div>"},
  {t:"Équations trigonométriques",
   anim: function (t) {
    var k=.85*Math.sin(t*.012),W0=W;var c=m5_sinG(4*PI,-1.5,1.5,{sy:.5,lby:.5,top:16,left:34,bot:22});
    m5_fn(c,Math.sin,0,4*PI,BLUE,3.2);m5_sg(c,-.25,k,4*PI,k,ORA2,2,[6,4]);
    var a=Math.asin(k),sols=[a,PI-a,2*PI+a,3*PI-a].map(function(x){return (x%(4*PI)+4*PI)%(4*PI);}).filter(function(x){return x<4*PI-1e-9;});
    sols.forEach(function(x){m5_pt(c,x,k,RED,6);});
    TB('sin x = '+nfmt(k.toFixed(2).replace('.',',')),W*.03+40,H*.12,DRED,15,'left');TB(sols.length+' solutions dans [0 ; 4π[',W*.97,H*.12,DGREEN,15,'right');
    TB('x = α + 2nπ  ou  x = π − α + 2nπ',W*.97,H*.93,INK,13,'right');
   },
   th: "<div class='tcard'><b class='h'>Équations de base</b><p><b>sin x = k</b> : x = α + 2nπ ou x = π − α + 2nπ (α = arcsin k). <b>cos x = k</b> : x = ±α + 2nπ. <b>tan x = k</b> : x = α + nπ. Il n’y a aucune solution si |k| > 1 pour sin et cos.</p><p>Dans [0 ; 2π[ : sin x = 1/2 donne π/6 et 5π/6 ; cos x = −√2/2 donne 3π/4 et 5π/4 ; tan x = 1 donne π/4 et 5π/4.</p></div>"
   +"<div class='tcard'><b class='h'>Se ramener à une équation de base</b><p>Équation du second degré : on pose s = sin x. Exemple : 2sin²x − sin x − 1 = 0 ⇔ (2s + 1)(s − 1) = 0, donc sin x = 1 (x = π/2) ou sin x = −1/2 (x = 7π/6 ou 11π/6). Pour sin(bx) = k, on résout bx = … puis on divise par b : plus de solutions sur le même intervalle.</p></div>"
   +"<div class='tcard'><b class='h'>Compter les solutions</b><p>Sur un intervalle de longueur 2π, sin x = k et cos x = k (|k| < 1) ont deux solutions : cos x = 0,3 en a donc 4 sur [0 ; 4π[. Exemple avec cos 3x = 0 sur [0 ; π] : 3x = π/2 + nπ donne x = π/6, π/2, 5π/6. Pièges : oublier la deuxième famille de solutions ; mélanger radians et degrés ; ne pas retenir les solutions hors intervalle.</p></div>"}
 ]
});

SFA.figs("c08", [
 /* 0 sin 75° */
 function (p) {
  var R=Math.min(H*.36,W*.22),cx=W*.3,cy=H*.6,a=45*D2R,b=30*D2R;m5_cap('sin 75° = sin(45° + 30°)',BLUE_D);m5_ucirc(cx,cy,R);
  var P=function(th){return {x:cx+R*Math.cos(th),y:cy-R*Math.sin(th)};},P1=P(a),P2=P(a+b);
  LN(cx,cy,P1.x,P1.y,BLUE,2.4);LN(cx,cy,P2.x,P2.y,ORA2,2.8);arcA({x:cx,y:cy},R*.35,0,-a,'',BLUE);arcA({x:cx,y:cy},R*.5,-a,-(a+b),'',ORA2);
  TB('45°',cx+R*.55*Math.cos(a/2)+14,cy-R*.4*Math.sin(a/2),BLUE_D,13);TB('30°',cx+R*.7*Math.cos(a+b/2)-8,cy-R*.7*Math.sin(a+b/2)-6,DRED,13);DOT(P2.x,P2.y,6,ORA2);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;LN(P2.x,P2.y,P2.x,cy,VIOLET,2.6,[4,3]);TB('sin 75°',P2.x+8,(P2.y+cy)/2,'#5249B5',14,'left');ctx.globalAlpha=1;
   var tx=W*.56;TB('sin45°cos30°',tx,H*.28,BLUE_D,14,'left');TB('+ cos45°sin30°',tx,H*.28+20,BLUE_D,14,'left');TB('= (√6 + √2)/4',tx,H*.5,DRED,19,'left');TB('≈ 0,966',tx,H*.66,DGREEN,19,'left');}
 },
 /* 1 lire une sinusoïde */
 function (p) {
  var c=m5_sinG(2*PI+.2,-5,3,{sy:1,lby:2,top:34,left:32});m5_cap('f(x) = 3 sin(2x) − 1',BLUE_D);m5_fn(c,function(x){return 3*Math.sin(2*x)-1;},0,2*PI,BLUE,3.2);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-.25,-1,2*PI+.2,-1,GREY,1.4,[5,4]);m5_sg(c,-.25,2,2*PI+.2,2,GREEN,1.2,[4,3]);m5_sg(c,-.25,-4,2*PI+.2,-4,GREEN,1.2,[4,3]);
   m5_sg(c,PI/4,2.9,PI/4+PI,2.9,VIOLET,2);m5_tag(c,'période π',PI*.75,2.7-.05,'#5249B5',12);m5_tag(c,'max 2',5.2,2.0,DGREEN,12);m5_tag(c,'min −4',5.2,-4,DGREEN,12);m5_tag(c,'moyenne −1',1.2,-1,GREY,11);m5_tag(c,'a = 3',.4,.9,DRED,11);ctx.globalAlpha=1;}
 },
 /* 2 duplication */
 function (p) {
  var c=m5_sinG(2*PI+.2,-1.5,1.5,{sy:.5,lby:.5,top:34,left:34});m5_cap('sin 2x = 2 sin x cos x',BLUE_D);
  m5_fn(c,Math.sin,0,2*PI,'#9bbfe8',2);m5_fn(c,Math.cos,0,2*PI,'#f0b49c',2);m5_fn(c,function(x){return Math.sin(2*x);},0,2*PI,RED,3.2);
  m5_t(c,'sin x',1.9,1.15,BLUE_D,11);m5_t(c,'cos x',.35,1.15,'#c8541f',11);m5_t(c,'sin 2x',3.8,-1.2,DRED,12);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_pt(c,PI/4,1,RED,6);m5_tag(c,'x = π/4 : 2·(√2/2)² = 1',4.7,1.22,DRED,12);ctx.globalAlpha=1;}
 },
 /* 3 duplication à partir de sin a */
 function (p) {
  var c=m5_G(-1,6.4,-.8,6.2,{eq:true,sx:1,sy:1,lbx:100,lby:100,top:34,left:16});m5_cap('sin a = 3/5, a aigu',BLUE_D);
  ctx.strokeStyle='#d5dae0';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(c.X(0),c.Y(0),5*c.kx,0,PI/2*1.0,true);ctx.stroke();
  m5_sg(c,0,0,4,3,BLUE,2.6);m5_sg(c,4,0,4,3,GREEN,2.2);m5_sg(c,0,0,4,0,GREEN,2.2);m5_pt(c,4,3,BLUE,5);
  m5_t(c,'5',1.6,1.8,BLUE_D,13);m5_t(c,'3',4.35,1.5,DGREEN,14);m5_t(c,'4',2,-.45,DGREEN,14);m5_t(c,'a',1.1,.3,DRED,13);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_sg(c,0,0,1.4,4.8,RED,2.6);m5_pt(c,1.4,4.8,RED,6);m5_sg(c,1.4,4.8,1.4,0,'#f0b49c',1.3,[3,3]);m5_t(c,'2a',.5,2.4,DRED,13);
   m5_tag(c,'sin 2a = 24/25',4.7,5.6,DRED,12);m5_tag(c,'cos 2a = 7/25',4.7,4.7,DRED,12);m5_tag(c,'cos a = 4/5',5.0,.9,DGREEN,12);ctx.globalAlpha=1;}
 },
 /* 4 équations de base */
 function (p) {
  var R=Math.min(H*.36,W*.2),cx=W*.36,cy=H*.56;m5_cap('x ∈ [0 ; 2π[',INK);m5_ucirc(cx,cy,R);var q=m5_fd(p,0,.5);
  var P=function(d){return {x:cx+R*Math.cos(d*D2R),y:cy-R*Math.sin(d*D2R)};};
  LN(cx-R-10,cy-R*.5,cx+R+10,cy-R*.5,BLUE,1.6,[5,4]);LN(cx-R*Math.SQRT1_2,cy-R-10,cx-R*Math.SQRT1_2,cy+R+10,ORA2,1.6,[5,4]);LN(cx-R-8,cy+R+8,cx+R+8,cy-R-8,GREEN,1.6,[5,4]);
  TB('sin x = 1/2',W*.72,H*.3,BLUE_D,15,'left');TB('cos x = −√2/2',W*.72,H*.5,'#c8541f',15,'left');TB('tan x = 1',W*.72,H*.7,DGREEN,15,'left');
  if(q>0){ctx.globalAlpha=q;[[30,BLUE,'π/6',14,-8],[150,BLUE,'5π/6',-6,-10],[135,ORA2,'3π/4',-8,-10],[225,ORA2,'5π/4',-10,18],[45,GREEN,'π/4',10,-8]].forEach(function(S){var pt=P(S[0]);DOT(pt.x,pt.y,6,S[1]);TB(S[2],pt.x+S[3]+(S[3]<0?-8:8),pt.y+S[4]+4,dk(S[1]),13,S[3]<0?'right':'left');});DOT(P(225).x,P(225).y,3,GREEN);ctx.globalAlpha=1;}
 },
 /* 5 période sin 3x */
 function (p) {
  var c=m5_sinG(2*PI+.2,-1.5,1.5,{sy:.5,lby:.5,top:34,left:34});m5_cap('f(x) = sin(3x)',BLUE_D);
  m5_fn(c,Math.sin,0,2*PI,'#c9d3e0',1.8,false,[5,4]);m5_fn(c,function(x){return Math.sin(3*x);},0,2*PI,BLUE,3.2,false,null,400);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,0,1.25,2*PI/3,1.25,RED,2.6);m5_sg(c,2*PI/3,1.25,4*PI/3,1.25,ORA2,2.6);m5_sg(c,4*PI/3,1.25,2*PI,1.25,GREEN,2.6);m5_tag(c,'période 2π/3',PI/3,1.25,DRED,12);ctx.globalAlpha=1;}
 },
 /* 6 second degré en sin */
 function (p) {
  var c=m5_sinG(2*PI+.2,-1.5,1.5,{sy:.5,lby:.5,top:34,left:34});m5_cap('2 sin²x − sin x − 1 = 0',BLUE_D);m5_fn(c,Math.sin,0,2*PI,BLUE,3.2);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-.25,1,2*PI+.2,1,RED,1.4,[5,4]);m5_sg(c,-.25,-.5,2*PI+.2,-.5,ORA2,1.4,[5,4]);[PI/2,7*PI/6,11*PI/6].forEach(function(x,i){m5_pt(c,x,i?-.5:1,i?ORA2:RED,6.5);});
   m5_tag(c,'sin x = 1',1.2,1.25,DRED,12);m5_tag(c,'sin x = −1/2',1.2,-.8,'#c8541f',12);m5_t(c,'π/2',PI/2,-.22,DRED,11);m5_tag(c,'7π/6',7*PI/6,-.2,'#c8541f',11);m5_tag(c,'11π/6',11*PI/6,-.2,'#c8541f',11);ctx.globalAlpha=1;}
 },
 /* 7 combien de solutions */
 function (p) {
  var c=m5_sinG(4*PI+.2,-1.5,1.5,{sy:.5,lby:.5,top:34,left:34});m5_cap('cos x = 0,3 sur [0 ; 4π[',BLUE_D);m5_fn(c,Math.cos,0,4*PI,BLUE,3.2,false,null,500);m5_sg(c,-.25,.3,4*PI+.2,.3,ORA2,1.6,[5,4]);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;var a=Math.acos(.3);[a,2*PI-a,2*PI+a,4*PI-a].forEach(function(x){m5_pt(c,x,.3,RED,6.5);});m5_tag(c,'4 solutions',PI*3.1,1.2,DRED,15);ctx.globalAlpha=1;}
 },
 /* 8 marée */
 function (p) {
  var c=m5_G(0,12.4,0,9.5,{sx:1,sy:1,lbx:3,lby:2,top:34,left:30,lx:'t (h)',ly:'h (m)'});m5_cap('h(t) = 5 + 3 sin(πt/6)',BLUE_D);var h=function(t){return 5+3*Math.sin(PI*t/6);},q=m5_fd(p,0,.6);
  if(q>0){ctx.globalAlpha=q*.35;ctx.fillStyle=GREEN;ctx.beginPath();ctx.moveTo(c.X(1),c.Y(6.5));for(var t=1;t<=5.001;t+=.05)ctx.lineTo(c.X(t),c.Y(h(t)));ctx.lineTo(c.X(5),c.Y(6.5));ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
  m5_fn(c,h,0,12,BLUE,3.2);m5_sg(c,0,6.5,12.4,6.5,ORA2,1.5,[5,4]);m5_t(c,'6,5 m',11.3,6.0,'#c8541f',11,'left');
  m5_pt(c,3,8,BLUE_D,5);m5_pt(c,9,2,BLUE_D,5);m5_t(c,'8 m',3,8.7,BLUE_D,11);m5_t(c,'2 m',9,1.2,BLUE_D,11);
  if(q>0){ctx.globalAlpha=q;m5_pt(c,1,6.5,RED,6);m5_pt(c,5,6.5,RED,6);m5_tag(c,'de 1 h à 5 h : 4 heures',9,6.9+.7,DRED,13);ctx.globalAlpha=1;}
 },
 /* 9 triplication */
 function (p) {
  var c=m5_G(-.15,PI+.15,-1.5,1.5,{sx:PI/6,sy:.5,lbx:1000,lby:.5,top:34,left:34});m5_cap('cos 3x = 4cos³x − 3cos x',BLUE_D);
  [['0',0],['π/6',PI/6],['π/3',PI/3],['π/2',PI/2],['2π/3',2*PI/3],['5π/6',5*PI/6],['π',PI]].forEach(function(L){if(L[1]>0)TB(L[0],c.X(L[1]),c.Y(0)+15,GREY,11);});
  m5_fn(c,function(x){return Math.cos(3*x);},0,PI,BLUE,3.2,false,null,400);m5_fn(c,function(x){return 4*Math.pow(Math.cos(x),3)-3*Math.cos(x);},0,PI,'#f0b49c',1.8,false,[4,4],400);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;[PI/6,PI/2,5*PI/6].forEach(function(x){m5_pt(c,x,0,RED,6.5);});m5_tag(c,'zéros : π/6, π/2, 5π/6',PI*.52,1.2,DRED,13);ctx.globalAlpha=1;}
 }
]);
