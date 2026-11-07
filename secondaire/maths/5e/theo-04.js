/* Maths 5e · chapitre 4 · asymptotes et continuité */
function m5_two(c,f,xa,xb,pole,col,w,dash){var e=(xb-xa)/400;m5_fn(c,f,xa,pole-e*2.5,col,w,false,dash,300);m5_fn(c,f,pole+e*2.5,xb,col,w,false,dash,300);}
function m5_av(c,x,col,lab,y){m5_sg(c,x,c.ya,x,c.yb,col||RED,1.6,[6,4]);if(lab)m5_tag(c,lab,x,y==null?c.yb-1:y,dk(col||RED),12);}
function m5_ah(c,y,col,lab,x){m5_sg(c,c.xa,y,c.xb,y,col||RED,1.6,[6,4]);if(lab)m5_tag(c,lab,x==null?c.xb-1:x,y,dk(col||RED),12);}

SFA.theo("c04", {
 icon: function () { TB('x = a', W*.22, H*.4, RED, 28); TB('y = b', W*.5, H*.4, GREEN, 28); TB('y = mx + p', W*.8, H*.4, ORA2, 24); TB('asymptotes et continuité', W*.5, H*.72, ORANGE, 17); },
 anim: function (t) {
  var W0=W;W=W0*.6;
  var c=m5_G(-4,10,-10,16,{sx:1,sy:2,lbx:2,lby:4,top:16,left:34,lx:'x',ly:'y'});
  var f=function(x){return x+2+5/(x-1);};m5_av(c,1,RED,'x = 1',-8.2);m5_sg(c,-4,-2,10,12,GREEN,1.6,[6,4]);m5_tag(c,'y = x + 2',-1.6,.1,DGREEN,12);
  m5_two(c,f,-4,10,1,BLUE,3);
  var ph=(t%420)/420,x=1.35+Math.pow(ph,1.6)*8.4,y=f(x);
  m5_sg(c,x,y,x,x+2,ORA2,3);m5_pt(c,x,y,BLUE,6);m5_pt(c,x,x+2,GREEN,4);
  W=W0;var tx=W*.62;TB('écart vertical = 5/(x − 1)',tx,H*.2,ORA2,14,'left');TB('x = '+nfmt(x.toFixed(2).replace('.',','))+'  →  écart = '+nfmt((5/(x-1)).toFixed(2).replace('.',',')),tx,H*.2+22,DRED,14,'left');
  TB('x → +∞ : la courbe colle à la droite',tx,H*.52,DGREEN,14,'left');TB('x → 1⁺ : f(x) → +∞',tx,H*.62,DRED,14,'left');
 },
 th: "<div class='tcard'><b class='h'>Asymptote verticale</b><p>La droite <b>x = a</b> est asymptote verticale si lim<sub>x→a</sub> f(x) = ±∞ (d’un seul côté suffit). Pour une fraction rationnelle, on cherche les zéros du dénominateur <b>après simplification</b>. Exemple : 3/(x + 2) a pour asymptote x = −2.</p></div>"
 +"<div class='tcard'><b class='h'>Asymptote horizontale</b><p>Si lim<sub>x→±∞</sub> f(x) = b (nombre fini), la droite <b>y = b</b> est asymptote horizontale en ±∞. Exemple : f(x) = (4x − 1)/(2x + 5) → 4/2 = 2, donc y = 2 ; l’asymptote verticale est x = −5/2. Une courbe <b>peut couper</b> son asymptote horizontale ou oblique (au contraire d’une asymptote verticale).</p></div>"
 +"<div class='tcard'><b class='h'>Asymptote oblique</b><p>Droite <b>y = mx + p</b> telle que lim (f(x) − (mx + p)) = 0. On calcule m = lim f(x)/x (fini non nul), puis p = lim (f(x) − mx). Pour une fraction rationnelle dont le degré du numérateur dépasse de 1 celui du dénominateur, on fait la <b>division euclidienne</b>.</p><p><b>Exemple.</b> (x² + x + 3)/(x − 1) = x + 2 + 5/(x − 1) : asymptote oblique y = x + 2 ; le reste 5/(x − 1) donne la position : courbe au-dessus de la droite si x > 1, en dessous si x < 1.</p></div>"
 +"<div class='tcard'><b class='h'>Continuité et prolongement</b><p>f est <b>continue en a</b> si f(a) existe, si lim<sub>x→a</sub> f(x) existe et si lim<sub>x→a</sub> f(x) = f(a). Graphiquement : on trace la courbe sans lever le crayon. Polynômes, fractions rationnelles et racines sont continus sur leur domaine. Pour raccorder deux morceaux en a : limite à gauche = limite à droite = f(a).</p><p><b>Prolongement par continuité</b> : si f n’est pas définie en a mais lim<sub>x→a</sub> f(x) = L est finie, on pose f(a) = L (le « trou » est comblé). Exemple : (x² − 9)/(x − 3) = x + 3 pour x ≠ 3 ; on pose f(3) = 6.</p></div>"
 +"<div class='tcard'><b class='h'>Pièges</b><p>Un trou n’est pas une asymptote : (x² − 4)/(x − 2) est la droite y = x + 2 privée du point (2 ; 4). Ne pas oublier les deux côtés (−∞ et +∞) : √(x² + 2x) a y = x + 1 en +∞ mais y = −x − 1 en −∞. (6 h : théorème des valeurs intermédiaires — une fonction continue qui passe de −1 à 3 s’annule.)</p></div>"
});

SFA.figs("c04", [
 /* 0 */
 function (p) {
  var c=m5_G(-7,4,-7,7,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = 3/(x + 2)',BLUE_D);
  m5_two(c,function(x){return 3/(x+2);},-7,4,-2,BLUE,3);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_av(c,-2,RED,'x = −2',-6);m5_tag(c,'+∞',-1.2,5.6,DRED,14);m5_tag(c,'−∞',-2.9,-5.6,DRED,14);ctx.globalAlpha=1;}
 },
 /* 1 */
 function (p) {
  var c=m5_G(-10,8,-8,10,{sx:2,sy:2,lbx:4,lby:4,top:34});m5_cap('f(x) = (4x − 1)/(2x + 5)',BLUE_D);
  m5_two(c,function(x){return (4*x-1)/(2*x+5);},-10,8,-2.5,BLUE,3);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_av(c,-2.5,RED,'x = −5/2',-6.8);m5_ah(c,2,GREEN,'y = 2',6);ctx.globalAlpha=1;}
 },
 /* 2 trou */
 function (p) {
  var c=m5_G(-3,6,-1,8,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = (x² − 4)/(x − 2)',BLUE_D);
  m5_fn(c,function(x){return x+2;},-3,6,BLUE,3);m5_hole(c,2,4,BLUE_D,6.5);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_tag(c,'trou en (2 ; 4)',3.8,2.7,DRED,14);m5_tag(c,'y = x + 2 (x ≠ 2)',-1,6.6,BLUE_D,12);ctx.globalAlpha=1;}
 },
 /* 3 oblique */
 function (p) {
  var c=m5_G(-4,8,-10,14,{sx:1,sy:2,lbx:2,lby:4,top:34});m5_cap('f(x) = (x² + x + 3)/(x − 1)',BLUE_D);
  var f=function(x){return (x*x+x+3)/(x-1);},q=m5_fd(p,0,.5);
  if(q>0){ctx.globalAlpha=q;m5_sg(c,-4,-2,8,10,GREEN,1.6,[6,4]);m5_av(c,1,RED,'x = 1',-9);m5_tag(c,'y = x + 2',-1.5,.3,DGREEN,12);m5_tag(c,'au-dessus pour x > 1',5.4,12.3,DRED,12);ctx.globalAlpha=1;}
  m5_two(c,f,-4,8,1,BLUE,3);
 },
 /* 4 prolongement */
 function (p) {
  var c=m5_G(-2,7,0,10,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('f(x) = (x² − 9)/(x − 3)',BLUE_D);
  m5_fn(c,function(x){return x+3;},-2,7,BLUE,3);var q=m5_fd(p,0,.5);
  if(q>0){m5_pt(c,3,6,GREEN,7);m5_sg(c,-2,6,3,6,GREEN,1.4,[5,4]);m5_tag(c,'on pose f(3) = 6',-.1,7.1,DGREEN,14);}else m5_hole(c,3,6,BLUE_D,6.5);
 },
 /* 5 raccord */
 function (p) {
  var q=m5_fd(p,0,.8),a=1.5*q,c=m5_G(-3,4,-3,13,{sx:1,sy:1,lbx:1,lby:4,top:34});m5_cap('x² + a·x  (x < 2)  |  3x + 1  (x ≥ 2)',BLUE_D);
  m5_fn(c,function(x){return x*x+a*x;},-3,2,ORA2,3);m5_fn(c,function(x){return 3*x+1;},2,4,BLUE,3);
  m5_pt(c,2,7,BLUE,6);m5_pt(c,2,4+2*a,ORA2,6,Math.abs(4+2*a-7)>.01);
  if(q>=1){m5_tag(c,'a = 3/2 : raccord en (2 ; 7)',-.4,10.5,DGREEN,13);}else m5_tag(c,'saut : a = '+m5_fr(a,2),-.4,10.5,GREY,13);
 },
 /* 6 branches infinies */
 function (p) {
  var c=m5_G(-6,6,-6,8,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = (2x² − 3x + 1)/(x² − 1)',BLUE_D);
  var f=function(x){return (2*x-1)/(x+1);},q=m5_fd(p,0,.5);
  if(q>0){ctx.globalAlpha=q;m5_av(c,-1,RED,'x = −1',-5);m5_ah(c,2,GREEN,'y = 2',5);ctx.globalAlpha=1;}
  m5_two(c,f,-6,6,-1,BLUE,3);if(q>0){ctx.globalAlpha=q;m5_hole(c,1,.5,BLUE_D,6);m5_tag(c,'trou (1 ; 1/2)',3.2,-.9,DRED,13);ctx.globalAlpha=1;}
 },
 /* 7 */
 function (p) {
  var c=m5_G(-5,5,-7,7,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = (x² + 1)/x',BLUE_D);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_av(c,0,RED,'x = 0',-6);m5_sg(c,-5,-5,5,5,GREEN,1.6,[6,4]);m5_tag(c,'y = x',3.4,2.4,DGREEN,13);ctx.globalAlpha=1;}
  m5_two(c,function(x){return x+1/x;},-5,5,0,BLUE,3);
 },
 /* 8 racine */
 function (p) {
  var c=m5_G(-7,6,-1,7,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = √(x² + 2x)',BLUE_D);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-1,0,6,7,GREEN,1.6,[6,4]);m5_sg(c,-7,6,-1,0,GREEN,1.6,[6,4]);m5_tag(c,'y = x + 1',4,3.1,DGREEN,12);m5_tag(c,'y = −x − 1',-5.6,3.6,DGREEN,12);ctx.globalAlpha=1;}
  var f=function(x){return Math.sqrt(x*x+2*x);};m5_fn(c,f,-7,-2,BLUE,3);m5_fn(c,f,0,6,BLUE,3);
  ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(c.X(-2),c.Y(0));ctx.lineTo(c.X(0),c.Y(0));ctx.stroke();m5_t(c,'hors domaine',-1,-.7,DRED,10);
 },
 /* 9 retrouver f */
 function (p) {
  var c=m5_G(-4,6,-10,18,{sx:1,sy:2,lbx:2,lby:4,top:34});m5_cap('asymptote y = 2x + 3 ; passe par (2 ; 10)',BLUE_D);
  m5_sg(c,-4,-5,6,15,GREEN,1.6,[6,4]);m5_pt(c,2,10,ORA2,6);m5_t(c,'(2 ; 10)',2.15,9.4,DRED,11,'left');
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_av(c,1,RED,'x = 1',-9);m5_two(c,function(x){return (2*x*x+x)/(x-1);},-4,6,1,BLUE,3);m5_tag(c,'f = (2x² + x)/(x − 1)',-.9,13,DGREEN,12);ctx.globalAlpha=1;}
 }
]);
