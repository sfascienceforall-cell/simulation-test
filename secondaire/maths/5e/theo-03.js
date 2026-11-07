/* Maths 5e · chapitre 3 · limites */
function m5_pane(i,n,fn){var w0=W;ctx.save();ctx.translate(i*w0/n,0);W=w0/n;try{fn();}finally{W=w0;ctx.restore();}}
function m5_hole(c,x,y,col,r){m5_pt(c,x,y,col,r||5.5,true);}

SFA.theo("c03", {
 icon: function () { TB('lim  f(x)', W*.5, H*.45, BLUE_D, 34); TB('x → a', W*.5, H*.64, ORA2, 20); TB('limites de fonctions', W*.5, H*.85, ORANGE, 16); },
 anim: function (t) {
  var W0=W;W=W0*.6;
  var c=m5_G(-.4,2.6,0,3.6,{st:.5,lbx:1,lby:1,top:20,left:40,eq:false});
  m5_fn(c,function(x){return x+1;},-.4,2.6,'#9bbfe8',2.8);m5_hole(c,1,2,BLUE_D,6);
  var ph=(t%360)/360,d=1.3*Math.pow(1-ph,2)+.03,xl=1-d,xr=1+d;
  m5_sg(c,1,0,1,3.6,'#e5e7ea',1,[4,4]);m5_sg(c,-.4,2,2.6,2,'#f0b49c',1.4,[6,4]);
  [[xl,BLUE],[xr,ORA2]].forEach(function(P){var x=P[0],y=x+1;m5_sg(c,x,0,x,y,P[1]+'88',1.3,[3,3]);m5_sg(c,x,y,-.4,y,P[1]+'88',1.3,[3,3]);m5_pt(c,x,y,P[1],6);m5_pt(c,-.4,y,P[1],3);});
  m5_t(c,'f(x) tend vers 2',2.5,1.7,DRED,12,'right');m5_t(c,'f(1) n’existe pas',1.05,.4,GREY,11,'left');
  W=W0;
  var tx=W*.66,f=function(v){return nfmt(v.toFixed(3).replace('.',','));};
  TB('f(x) = (x² − 1)/(x − 1)',tx,H*.2,BLUE_D,15,'left');
  TB('x = '+f(xl)+' → f = '+f(xl+1),tx,H*.4,BLUE_D,14,'left');TB('x = '+f(xr)+' → f = '+f(xr+1),tx,H*.52,DRED,14,'left');
  TB('lim f(x) = 2 quand x → 1',tx,H*.75,DGREEN,15,'left');TB('(à gauche comme à droite)',tx,H*.75+20,GREY,13,'left');
 },
 th: "<div class='tcard'><b class='h'>Idée et notation</b><p>lim<sub>x→a</sub> f(x) = L signifie : f(x) s’approche aussi près qu’on veut de L quand x s’approche de a (x ≠ a). Seuls les x <b>voisins</b> de a comptent : la valeur f(a) est sans importance (elle peut même ne pas exister). On distingue la limite <b>à gauche</b> (x → a⁻) et <b>à droite</b> (x → a⁺) ; la limite existe si et seulement si les deux existent et sont égales.</p><p>Exemple : f(x) = (x² − 1)/(x − 1) = x + 1 pour x ≠ 1 : lim<sub>x→1</sub> f(x) = 2, alors que f(1) n’existe pas.</p></div>"
 +"<div class='tcard'><b class='h'>Calculs de base</b><p><b>Polynômes</b> : on remplace (lim<sub>x→2</sub> (x² − 3x + 1) = −1). <b>Fraction</b> k/(x − a) avec k ≠ 0 : on obtient ±∞ ; le signe dépend du côté (1/(x − 2) → +∞ si x → 2⁺, −∞ si x → 2⁻). Un dénominateur au carré garde le signe de k des deux côtés.</p><p><b>En ±∞</b> : un polynôme se comporte comme son terme de plus haut degré (−2x³ + 5x → −∞ en +∞). Une fraction rationnelle : on compare les degrés. Degré du numérateur plus petit : limite 0 ; degrés égaux : quotient des coefficients dominants (3x²/5x² → 3/5) ; plus grand : ±∞.</p></div>"
 +"<div class='tcard'><b class='h'>Formes indéterminées</b><p>0/0, ∞/∞, ∞ − ∞, 0·∞ : on ne peut pas conclure sans travailler l’expression.</p><p><b>0/0</b> : factoriser et simplifier, ou multiplier par le <b>conjugué</b> (√(x + 4) − 2)/x = 1/(√(x + 4) + 2) → 1/4. <b>∞/∞</b> : diviser par la plus haute puissance de x. <b>∞ − ∞</b> avec racine : conjugué, par exemple √(x² + x) − x = x/(√(x² + x) + x) → 1/2.</p></div>"
 +"<div class='tcard'><b class='h'>Méthode et pièges</b><p>1) Substituer et regarder la forme obtenue. 2) Si elle est déterminée (4/0⁺ = +∞, 5/∞ = 0), conclure ; sinon lever l’indétermination. 3) Si la limite semble différer à gauche et à droite, calculer les deux séparément.</p><p>Pièges : 0/0 n’est ni 0 ni 1 ; ∞ − ∞ n’est pas 0 ; la limite en a ne dit rien de f(a). La limite en +∞ d’une fraction donne une <b>asymptote horizontale</b> (chapitre suivant). (6 h : définition rigoureuse avec ε et η.)</p></div>"
});

SFA.figs("c03", [
 /* 0 polynômes */
 function (p) {
  m5_cap('(a) en x = 2          (b) en +∞',INK);
  m5_pane(0,2,function(){var c=m5_G(-.5,4,-3,5,{st:1,lbx:1,lby:2,top:34,left:30});m5_fn(c,function(x){return x*x-3*x+1;},-.5,4,BLUE,3);m5_sg(c,2,0,2,-1,'#9bbfe8',1.3,[3,3]);m5_pt(c,2,-1,p>0?RED:BLUE,6);
   if(p>0){m5_sg(c,-.5,-1,2,-1,'#f0b49c',1.4,[4,3]);m5_tag(c,'−1',.4,-1.0,DRED,14);}});
  m5_pane(1,2,function(){var c=m5_G(-2.6,2.6,-22,22,{st:1,sy:5,lbx:1,lby:10,top:34,left:34});m5_fn(c,function(x){return -2*x*x*x+5*x;},-2.6,2.6,ORA2,3);
   if(p>0){m5_tag(c,'−∞',2.0,-14,DRED,15);arrow(c.X(1.6),c.Y(-8),c.X(2.3)-c.X(1.6),c.Y(-20)-c.Y(-8),RED,'',2.5);}});
 },
 /* 1 tableau */
 function (p) {
  var c=m5_G(-.3,2.4,0,3.3,{st:.5,lbx:1,lby:1,top:34});m5_cap('f(x) = (x² − 1)/(x − 1)',BLUE_D);
  m5_fn(c,function(x){return x+1;},-.3,2.4,'#9bbfe8',2.8);m5_hole(c,1,2,BLUE_D,6.5);
  [.9,.99,1.01,1.1].forEach(function(x,i){m5_pt(c,x,x+1,i<2?BLUE:ORA2,i===1||i===2?3.5:4.8);});
  m5_t(c,'0,9 → 1,9',.85,2.75,BLUE_D,11,'right');m5_t(c,'1,1 → 2,1',1.2,1.35,DRED,11,'left');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-.3,2,2.4,2,RED,1.6,[6,4]);m5_tag(c,'limite = 2',1.9,2.45,DRED,13);m5_tag(c,'f(1) : n’existe pas',1.7,.5,GREY,11);ctx.globalAlpha=1;}
 },
 /* 2 1/(x-2) à droite */
 function (p) {
  var c=m5_G(0,4.2,-6,6,{st:1,lbx:1,lby:2,top:34});m5_cap('lim 1/(x − 2)   quand x → 2, x > 2',BLUE_D);
  m5_sg(c,2,-6,2,6,'#bcd0ea',1.4,[5,4]);var f=function(x){return 1/(x-2);};
  m5_fn(c,f,0,1.9,'#b7c4d6',2.4);m5_fn(c,f,2.1,4.2,BLUE,3.2);
  [2.5,2.25,2.12].forEach(function(x){m5_pt(c,x,f(x),ORA2,4);});
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_tag(c,'+∞',2.7,5.2,DRED,16);arrow(c.X(2.3),c.Y(3)-0,0,-0,RED,'');arrow(c.X(2.62),c.Y(3.6),0,-1,RED,'');ctx.globalAlpha=1;}
  m5_t(c,'à gauche : −∞',.2,-4.6,GREY,11,'left');
 },
 /* 3 fractions en +inf */
 function (p) {
  var c=m5_G(0,20,-.3,4,{sx:2,sy:1,lbx:5,lby:1,top:34});m5_cap('x → +∞',INK);
  m5_fn(c,function(x){return (3*x*x-x+1)/(5*x*x+2);},0,20,BLUE,3);
  m5_fn(c,function(x){return (x*x*x+1)/(2*x*x+x);},.2,20,ORA2,3);
  m5_fn(c,function(x){return (2*x+1)/(x*x+3);},0,20,GREEN,3);
  m5_t(c,'(b)',16.6,3.7,DRED,13);m5_t(c,'(a)',14,1.1,BLUE_D,13);m5_t(c,'(c)',14,.55,DGREEN,13);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,0,.6,20,.6,BLUE,1.4,[6,4]);m5_tag(c,'3/5',19,.9,BLUE_D,13);m5_tag(c,'0',19,.2,DGREEN,13);m5_tag(c,'+∞',19.0,3.6,DRED,13);ctx.globalAlpha=1;}
 },
 /* 4 0/0 racine */
 function (p) {
  var c=m5_G(-3.5,6.5,0,.6,{sx:1,sy:.1,lbx:2,lby:.2,top:34,left:40});m5_cap('f(x) = (√(x + 4) − 2)/x',BLUE_D);
  m5_fn(c,function(x){return (Math.sqrt(x+4)-2)/x;},-3.5,6.5,BLUE,3);m5_hole(c,0,.25,BLUE_D,6.5);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-3.5,.25,6.5,.25,RED,1.5,[6,4]);m5_tag(c,'1/(√(x + 4) + 2) → 1/4',3.2,.4,DRED,12);ctx.globalAlpha=1;}
  else m5_tag(c,'0/0 : forme indéterminée',3.2,.4,GREY,12);
 },
 /* 5 inf - inf */
 function (p) {
  var c=m5_G(0,20,0,.75,{sx:2,sy:.25,lbx:5,lby:.25,top:34,left:40});m5_cap('f(x) = √(x² + x) − x',BLUE_D);
  m5_fn(c,function(x){return Math.sqrt(x*x+x)-x;},0,20,BLUE,3);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,0,.5,20,.5,RED,1.5,[6,4]);m5_tag(c,'→ 1/2',16,.58,DRED,14);m5_tag(c,'x/(√(x² + x) + x)',10,.18,DGREEN,12);ctx.globalAlpha=1;}
  else m5_tag(c,'∞ − ∞ : indéterminée',10,.62,GREY,12);
 },
 /* 6 coût moyen */
 function (p) {
  var c=m5_G(0,1400,0,30,{sx:250,sy:5,lbx:500,lby:10,top:34,left:34});m5_cap('M(q) = (500 + 8q)/q',BLUE_D);
  m5_fn(c,function(x){return (500+8*x)/x;},8,1400,BLUE,3);m5_sg(c,0,8,1400,8,GREEN,1.4,[6,4]);m5_t(c,'8 €',1300,6,DGREEN,13);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,0,8.5,1400,8.5,RED,1.3,[3,3]);m5_pt(c,1000,8.5,RED,6);m5_tag(c,'q = 1 000',1000,14,DRED,13);m5_tag(c,'+∞ si q → 0',350,26,DRED,12);ctx.globalAlpha=1;}
 },
 /* 7 carré au dénominateur */
 function (p) {
  var c=m5_G(-3,5,-7,8,{sx:1,sy:1,lbx:1,lby:2,top:34});m5_cap('(x² − 1)/(x − 1)² = (x + 1)/(x − 1)',BLUE_D);
  m5_sg(c,1,-7,1,8,'#bcd0ea',1.4,[5,4]);var f=function(x){return (x+1)/(x-1);};
  var q=m5_fd(p,0,.5);m5_fn(c,f,-3,.93,q>0?RED:BLUE,3);m5_fn(c,f,1.07,5,q>0?GREEN:BLUE,3);
  if(q>0){ctx.globalAlpha=q;m5_tag(c,'−∞',.45,-5.5,DRED,15);m5_tag(c,'+∞',1.7,6.5,DGREEN,15);m5_tag(c,'la limite n’existe pas',-1.2,5.6,INK,12);ctx.globalAlpha=1;}
 },
 /* 8 asymptote oblique */
 function (p) {
  var c=m5_G(-5,5,-1,11,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = √(4x² + x + 1)',BLUE_D);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_fn(c,function(x){return 2*x+.25;},-.12,5,RED,1.8,false,[6,4]);ctx.globalAlpha=1;}
  m5_fn(c,function(x){return Math.sqrt(4*x*x+x+1);},-5,5,BLUE,3);
  if(q>0){ctx.globalAlpha=q;m5_tag(c,'y = 2x + 1/4',-1.8,9.2,DRED,13);m5_tag(c,'f(x) − 2x → 1/4',1.6,1.6,DGREEN,12);ctx.globalAlpha=1;}
 },
 /* 9 paramètres */
 function (p) {
  var c=m5_G(-4,6,-2,9,{sx:1,sy:1,lbx:2,lby:2,top:34});m5_cap('f(x) = (x² + ax + b)/(x − 2)',BLUE_D);
  m5_fn(c,function(x){return x+3;},-4,6,BLUE,3);m5_hole(c,2,5,BLUE_D,6.5);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_sg(c,-4,5,2,5,RED,1.4,[5,4]);m5_tag(c,'limite = 5',-2,5.7,DRED,13);m5_tag(c,'a = 1 ; b = −6',3.6,1.2,DGREEN,14);m5_tag(c,'(x + 3)(x − 2)/(x − 2)',3.6,7.9,GREY,11);ctx.globalAlpha=1;}
  else m5_tag(c,'numérateur = 0 en x = 2 : 4 + 2a + b = 0',2,8.2,GREY,11);
 }
]);
