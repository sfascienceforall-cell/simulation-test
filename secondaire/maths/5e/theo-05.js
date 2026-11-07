/* Maths 5e · chapitre 5 · dérivée : définition, tangente, règles */
function m5_line(c,m,y0,x0,x1,col,w,dash){/* droite y = y0 + m (x − x0) sur [x0..] ; x0,x1 bornes d'affichage */m5_sg(c,x0,y0+m*(x0-x0),x1,y0+m*(x1-x0),col,w||2,dash);}
function m5_tg(c,a,fa,m,xa,xb,col,w,dash){m5_sg(c,xa,fa+m*(xa-a),xb,fa+m*(xb-a),col,w||2.2,dash);}

SFA.theo("c05", {
 icon: function () { TB("f ′(a) = lim", W*.5, H*.36, BLUE_D, 30); TB('f(a + h) − f(a)', W*.5, H*.54, ORA2, 20); TB('h', W*.5, H*.72, ORA2, 20); LN(W*.28,H*.585,W*.72,H*.585,INK,2); TB('h → 0', W*.82, H*.55, GREY, 15); },
 anim: function (t) {
  var W0=W;W=W0*.6;
  var c=m5_G(-1,3.2,-.5,6.2,{sx:1,sy:1,lbx:1,lby:1,top:14,left:30});
  m5_fn(c,function(x){return x*x;},-1,2.5,BLUE,3);m5_tg(c,1,1,2,-1,3.2,GREEN,1.8,[6,4]);
  var ph=(t%300)/300,h=1.7*Math.pow(1-ph,2)+.03,xb=1+h,yb=xb*xb,m=2+h;
  m5_sg(c,1,1,xb,yb,ORA2,1.5);m5_tg(c,1,1,m,-.2,3.2,ORA2,2.4);m5_pt(c,1,1,BLUE_D,6);m5_pt(c,xb,yb,ORA2,6);
  m5_sg(c,1,1,xb,1,'#d8b9a8',1.3,[3,3]);m5_sg(c,xb,1,xb,yb,'#d8b9a8',1.3,[3,3]);m5_t(c,'h',1+h/2,.62,DRED,12);
  W=W0;
  var tx=W*.62;TB('f(x) = x² ; point A(1 ; 1)',tx,H*.2,BLUE_D,14,'left');TB('h = '+nfmt(h.toFixed(3).replace('.',',')),tx,H*.34,DRED,15,'left');
  TB('pente de la sécante = 2 + h',tx,H*.46,ORA2,14,'left');TB('= '+nfmt(m.toFixed(3).replace('.',',')),tx,H*.46+22,ORA2,15,'left');
  TB('quand h → 0 : pente = f ′(1) = 2',tx,H*.74,DGREEN,14,'left');TB('(la sécante devient la tangente)',tx,H*.74+20,GREY,13,'left');
 },
 th: "<div class='tcard'><b class='h'>Nombre dérivé et tangente</b><p>Le <b>taux d’accroissement</b> de f entre a et a + h est (f(a + h) − f(a))/h : c’est la pente de la sécante. Le <b>nombre dérivé</b> est sa limite : <b>f ′(a) = lim<sub>h→0</sub> (f(a + h) − f(a))/h</b> (s’il existe). C’est la pente de la <b>tangente</b> en (a ; f(a)), d’équation <b>y = f(a) + f ′(a)(x − a)</b>.</p><p><b>Exemple.</b> f(x) = x² en a = 3 : f ′(3) = 6, f(3) = 9, donc y = 9 + 6(x − 3) = 6x − 9.</p></div>"
 +"<div class='tcard'><b class='h'>Fonction dérivée et règles</b><p>(k)′ = 0 ; (xⁿ)′ = n·xⁿ⁻¹ ; (k·f)′ = k·f ′ ; (f + g)′ = f ′ + g′ ; (√x)′ = 1/(2√x).</p><p><b>Produit</b> : (u·v)′ = u′v + uv′. <b>Quotient</b> : (u/v)′ = (u′v − uv′)/v². Exemple : ((2x + 1)/(x − 3))′ = (2(x − 3) − (2x + 1))/(x − 3)² = −7/(x − 3)².</p></div>"
 +"<div class='tcard'><b class='h'>Composée</b><p>(f(g(x)))′ = f ′(g(x))·g′(x) : on dérive « l’extérieur » sans toucher l’intérieur, puis on multiplie par la dérivée de l’intérieur. Exemple : ((2x − 1)⁵)′ = 5(2x − 1)⁴ · 2 = 10(2x − 1)⁴. Cas particulier : (f(ax + b))′ = a·f ′(ax + b).</p></div>"
 +"<div class='tcard'><b class='h'>Méthode et interprétations</b><p>Tangente en a : calculer f(a), f ′(x), f ′(a), puis y = f(a) + f ′(a)(x − a). Tangente <b>horizontale</b> : f ′(x) = 0. Tangente de pente donnée m : résoudre f ′(x) = m. Si x(t) ou s(t) est une position, s′(t) est la <b>vitesse instantanée</b> : s(t) = 5t² + 2t donne s′(3) = 10·3 + 2 = 32 m/s.</p></div>"
 +"<div class='tcard'><b class='h'>Pièges</b><p>(uv)′ n’est pas u′v′ ; ne pas oublier le facteur g′(x) d’une composée ; (x²·(3x + 1))′ se calcule après développement ou avec la règle du produit (9x² + 2x). Une tangente issue d’un point extérieur se cherche avec le <b>point de contact</b> inconnu. (6 h : théorème des accroissements finis, règle de l’Hospital pour les 0/0.)</p></div>"
});

SFA.figs("c05", [
 /* 0 dériver un polynôme */
 function (p) {
  m5_pane(0,2,function(){var c=m5_G(-1.8,1.8,-10,10,{sx:1,sy:5,lbx:1,lby:10,top:34,left:34});m5_cap('f(x) = 3x⁴ − 5x² + x − 7',BLUE_D);
   m5_fn(c,function(x){return 3*Math.pow(x,4)-5*x*x+x-7;},-1.8,1.8,BLUE,3);});
  var rows=[['3x⁴','12x³'],['−5x²','−10x'],['x','1'],['−7','0']],cols=[BLUE,ORA2,GREEN,VIOLET];
  rows.forEach(function(r,i){var y=H*.28+i*H*.17,a=m5_fd(p,i*.18,i*.18+.25);TB(r[0],W*.56,y,dk(cols[i]),19,'right');arrow(W*.58,y-6,W*.07,0,GREY,'',2);ctx.globalAlpha=a;TB(r[1],W*.68,y,dk(cols[i]),19,'left');ctx.globalAlpha=1;});
  var q=m5_fd(p,.8,1);if(q>0){ctx.globalAlpha=q;TB('f ′(x) = 12x³ − 10x + 1',W*.52,H*.93,DRED,17,'left');ctx.globalAlpha=1;}
 },
 /* 1 tangente x² */
 function (p) {
  var c=m5_G(-1,5,-3,16,{sx:1,sy:2,lbx:1,lby:4,top:34});m5_cap('f(x) = x²   en x = 3',BLUE_D);
  m5_fn(c,function(x){return x*x;},-1,4,BLUE,3);m5_pt(c,3,9,BLUE_D,6);m5_t(c,'(3 ; 9)',3.2,8.2,BLUE_D,12,'left');
  var q=m5_fd(p,0,.6);if(q>0){m5_tg(c,3,9,6,1.5-1.5*q,1.5+(4.5-1.5)*q,RED,2.6);ctx.globalAlpha=q;m5_tag(c,'y = 6x − 9',.5,-1.8,DRED,14);m5_t(c,'pente 6',1.4,3.7,DRED,12,'left');ctx.globalAlpha=1;m5_t(c,'',0,0);}
 },
 /* 2 produit : rectangle */
 function (p) {
  m5_cap('(x²(3x + 1))′ en x = 1 : (uv)′ = u′v + uv′',BLUE_D);
  var x0=W*.12,yb=H-30,su=W*.2,sv=H*.14,u=1,v=4,du=.45,dv=1.35,q=m5_fd(p,0,.7);
  var w1=u*su,h1=v*sv*.6;/* échelle verticale réduite */ var hs=sv*.6;
  ctx.fillStyle=BLUE+'22';ctx.strokeStyle=BLUE;ctx.lineWidth=2.2;ctx.fillRect(x0,yb-v*hs,w1,v*hs);ctx.strokeRect(x0,yb-v*hs,w1,v*hs);TB('u v = 1 × 4',x0+w1/2,yb-v*hs/2,BLUE_D,16);
  TB('u = x² = 1',x0+w1/2,yb+16,BLUE_D,14);TB('v = 4',x0-6,yb-v*hs/2,BLUE_D,14,'right');
  if(q>0){ctx.globalAlpha=q;var wa=du*su*q,ha=dv*hs*q;
   ctx.fillStyle=ORA2+'44';ctx.strokeStyle=ORA2;ctx.fillRect(x0+w1,yb-v*hs,wa,v*hs);ctx.strokeRect(x0+w1,yb-v*hs,wa,v*hs);
   ctx.fillStyle=GREEN+'44';ctx.strokeStyle=GREEN;ctx.fillRect(x0,yb-v*hs-ha,w1,ha);ctx.strokeRect(x0,yb-v*hs-ha,w1,ha);
   ctx.fillStyle='#ccc';ctx.fillRect(x0+w1,yb-v*hs-ha,wa,ha);ctx.globalAlpha=1;
   TB('u′·v',x0+w1+wa+8,yb-v*hs/2,DRED,15,'left');TB('u·v′',x0+w1+6,yb-v*hs-ha/2+5,DGREEN,15,'left');}
  var tx=W*.56;if(q>=1){TB('u′ = 2, v′ = 3',tx,H*.28,INK,15,'left');TB('(uv)′ = 2·4 + 1·3 = 11',tx,H*.44,DRED,17,'left');TB('9x² + 2x = 11 en x = 1',tx,H*.58,DGREEN,16,'left');}
 },
 /* 3 définition */
 function (p) {
  var c=m5_G(-1,5,-4,6,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('f(x) = x² − 3x   en a = 2',BLUE_D);
  m5_fn(c,function(x){return x*x-3*x;},-1,5,BLUE,3);m5_pt(c,2,-2,BLUE_D,6);
  var f=function(x){return x*x-3*x;};[[3,ORA2,'pente 2'],[2.5,VIOLET,'pente 1,5']].forEach(function(S){var xb=S[0],m=(f(xb)-f(2))/(xb-2);m5_tg(c,2,-2,m,.6,4.4,S[1],1.7,[5,3]);m5_pt(c,xb,f(xb),S[1],4);});
  m5_t(c,'h = 1 : pente 2',4.4,3.6,'#c8541f',11,'right');m5_t(c,'h = 0,5 : pente 1,5',4.4,1.6,'#5249B5',11,'right');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_tg(c,2,-2,1,-.8,4.8,RED,2.8);m5_tag(c,'f ′(2) = 1',.3,-3.3,DRED,15);ctx.globalAlpha=1;}
 },
 /* 4 quotient */
 function (p) {
  var c=m5_G(1,9,-6,24,{sx:1,sy:2,lbx:2,lby:6,top:34});m5_cap('f(x) = (2x + 1)/(x − 3)   en x = 4',BLUE_D);
  m5_sg(c,3,-6,3,24,'#bcd0ea',1.3,[5,4]);m5_sg(c,1,2,9,2,'#bcd0ea',1.3,[5,4]);m5_fn(c,function(x){return (2*x+1)/(x-3);},3.04,9,BLUE,3);
  m5_pt(c,4,9,BLUE_D,6);m5_t(c,'(4 ; 9)',4.2,10.6,BLUE_D,12,'left');
  var q=m5_fd(p,0,.6);if(q>0){m5_tg(c,4,9,-7,3.3,3.3+(5.4-3.3)*q,RED,2.6);ctx.globalAlpha=q;m5_tag(c,'y = −7x + 37',6.5,12,DRED,14);m5_tag(c,'f ′(4) = −7',6.7,6,DRED,13);ctx.globalAlpha=1;}
 },
 /* 5 composée */
 function (p) {
  m5_cap('f(x) = (2x − 1)⁵ = u⁵ avec u = 2x − 1',BLUE_D);var y=H*.42;
  TB('x',W*.07,y+8,INK,24);m5_ar(W*.11,y,W*.22,y,GREY);m5_bx(W*.35,y,W*.2,40,BLUE,'u = 2x − 1',17);m5_ar(W*.46,y,W*.57,y,GREY);m5_bx(W*.69,y,W*.19,40,ORA2,'u⁵',19);m5_ar(W*.79,y,W*.9,y,GREY);TB('f',W*.94,y+8,INK,24);
  TB('u′ = 2',W*.35,y+46,BLUE_D,17);TB('(u⁵)′ = 5u⁴',W*.69,y+46,DRED,17);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;TB('f ′(x) = 5(2x − 1)⁴ × 2',W*.5,H*.8,DRED,19);TB('= 10(2x − 1)⁴',W*.5,H*.93,DGREEN,21);ctx.globalAlpha=1;}
 },
 /* 6 */
 function (p) {
  var c=m5_G(-2,4,-6,8,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('f(x) = x³ − 3x² + 2',BLUE_D);
  m5_fn(c,function(x){return x*x*x-3*x*x+2;},-1.2,3.5,BLUE,3);
  var q=m5_fd(p,0,.5),r=m5_fd(p,.4,1);
  if(q>0){ctx.globalAlpha=q;m5_tg(c,0,2,0,-1.2,1.4,GREEN,2.4);m5_tg(c,2,-2,0,.6,3.4,GREEN,2.4);m5_pt(c,0,2,DGREEN,5);m5_pt(c,2,-2,DGREEN,5);m5_tag(c,'y = 2',-1.2,3.1,DGREEN,12);m5_tag(c,'y = −2',3.1,-3.2,DGREEN,12);ctx.globalAlpha=1;}
  if(r>0){ctx.globalAlpha=r;m5_tg(c,3,2,9,2.5,3.45,RED,2.4);m5_tg(c,-1,-2,9,-1.45,-.55,RED,2.4);m5_pt(c,3,2,RED,5);m5_pt(c,-1,-2,RED,5);m5_tag(c,'y = 9x − 25',2.2,5.6,DRED,11);m5_tag(c,'y = 9x + 7',-1.0,-4.6,DRED,11);ctx.globalAlpha=1;}
 },
 /* 7 vitesse */
 function (p) {
  var c=m5_G(0,5,0,140,{sx:1,sy:20,lbx:1,lby:40,top:34,left:36,lx:'t (s)',ly:'s (m)'});m5_cap('s(t) = 5t² + 2t',BLUE_D);
  m5_fn(c,function(t){return 5*t*t+2*t;},0,5,BLUE,3);m5_pt(c,3,51,BLUE_D,6);m5_t(c,'t = 3 s : s = 51 m',2.8,59,BLUE_D,12,'right');
  var q=m5_fd(p,0,.6);if(q>0){m5_tg(c,3,51,32,3-1.6*q,3+1.6*q,RED,2.6);ctx.globalAlpha=q;m5_tag(c,'v(3) = s′(3) = 32 m/s',1.6,112,DRED,14);ctx.globalAlpha=1;}
 },
 /* 8 tangentes issues d'un point */
 function (p) {
  var c=m5_G(-3,5,-6,12,{sx:1,sy:2,lbx:1,lby:4,top:34});m5_cap('tangentes à y = x² issues de P(1 ; −3)',BLUE_D);
  m5_fn(c,function(x){return x*x;},-3,3.4,BLUE,3);m5_pt(c,1,-3,INK,6);m5_t(c,'P(1 ; −3)',1.2,-4.2,INK,12,'left');
  var q=m5_fd(p,0,.7);if(q>0){m5_tg(c,3,9,6,1+(3-1)*(1-q),1+(3.6-1)*q+0,RED,2.4);m5_tg(c,-1,1,-2,1-(2.3)*q,1,GREEN,2.4);ctx.globalAlpha=q;m5_pt(c,3,9,DRED,5);m5_pt(c,-1,1,DGREEN,5);m5_t(c,'(3 ; 9)',3.2,9.8,DRED,12,'left');m5_t(c,'(−1 ; 1)',-1.2,2.4,DGREEN,12,'right');m5_tag(c,'y = 6x − 9',3.9,5.4,DRED,11);m5_tag(c,'y = −2x − 1',-1.9,-3.4,DGREEN,11);ctx.globalAlpha=1;}
 },
 /* 9 paramètres */
 function (p) {
  var c=m5_G(-3,3,-6,10,{sx:1,sy:2,lbx:1,lby:4,top:34});m5_cap('x³ + ax + b   tangente y = 2x + 1 en x = 1',BLUE_D);
  m5_tg(c,1,3,2,-2,2.3,RED,2.4);m5_pt(c,1,3,DRED,6);m5_t(c,'y = 2x + 1',-2.2,-2.3,DRED,12,'left');m5_t(c,'x = 1',1.1,2,GREY,11,'left');
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_fn(c,function(x){return x*x*x-x+3;},-2.4,2.2,BLUE,3);m5_tag(c,'a = −1 ; b = 3',-1.2,7.6,DGREEN,14);m5_t(c,'f(1) = 3 ; f ′(1) = 2',1.6,-3.8,BLUE_D,12,'right');ctx.globalAlpha=1;}
 }
]);
