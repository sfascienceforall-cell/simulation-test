/* Maths 4e · chapitre 4 : équations du second degré */
SFA.theo("c04", {
 icon: function () {
  TB('Δ = b² − 4ac',W*.5,H*.2,ORANGE,28);
  TB('x = (−b ± √Δ) / 2a',W*.5,H*.46,BLUE_D,32);
  var y=H*.8,k=W/6;
  [['Δ > 0','2 solutions',GREEN],['Δ = 0','1 solution',ORANGE],['Δ < 0','aucune',RED]].forEach(function(c,i){
   TB(c[0],k*(1+i*2),y-12,dk(c[2]),19);TB(c[1],k*(1+i*2),y+14,GREY,15);});
 },
 anim: function (t) {
  var c=4+4*Math.sin(t/95),D=16-4*c;
  var f=m4_fr(-1,5,-5,9,{l:26,r:W*.42,t:16,b:22});
  m4_grid(f,1,1,true);
  var Q=function(x){return x*x-4*x+c;};
  m4_cv(f,Q,-1,5,BLUE,3.6);
  var near=Math.abs(D)<.12;
  if(D>.12){var r=Math.sqrt(D)/2;[2-r,2+r].forEach(function(x){DOT(f.X(x),f.Y(0),7,RED);});}
  else if(near)DOT(f.X(2),f.Y(0),8,ORANGE);
  DOT(f.X(2),f.Y(c-4),5,GREY);
  var x0=f.R+22;
  TB('x² − 4x + c = 0',x0,34,BLUE_D,19,'left');
  TB('c = '+m4_n(Math.round(c*100)/100).replace('.',','),x0,64,INK,16,'left');
  TB('Δ = 16 − 4c = '+m4_n(Math.round(D*100)/100),x0,94,ORANGE,17,'left');
  var col=near?ORANGE:D>0?DGREEN:DRED,msg=near?'Δ = 0 : solution double':D>0?'Δ > 0 : 2 solutions':'Δ < 0 : aucune solution';
  TB(msg,x0,134,col,17,'left');
  if(D>.12){var s=Math.sqrt(D)/2;TB('x₁ = '+m4_n(Math.round((2-s)*100)/100),x0,166,DRED,15,'left');TB('x₂ = '+m4_n(Math.round((2+s)*100)/100),x0,188,DRED,15,'left');
   TB('x₁ + x₂ = 4  et  x₁·x₂ = c',x0,226,VIO_D,14,'left');}
  else if(near)TB('x = −b/2a = 2',x0,166,DRED,15,'left');
  else TB('la parabole ne coupe pas Ox',x0,166,GREY,14,'left');
  TB('la parabole monte avec c',x0,264,GREY,13,'left');
 },
 th: '<div class="tcard"><b class="h">Équation ax² + bx + c = 0 (a ≠ 0)</b><p>On commence par chercher les cas simples. <b>ax² + c = 0</b> : x² = −c/a, deux solutions opposées si −c/a &gt; 0. <b>ax² + bx = 0</b> : on met x en évidence, x(ax + b) = 0, donc x = 0 ou x = −b/a. Sinon, on factorise (x² − 5x + 6 = (x − 2)(x − 3)) ou on utilise le discriminant.</p></div>'+
 '<div class="tcard"><b class="h">Le discriminant Δ = b² − 4ac</b><p>• <b>Δ &gt; 0</b> : deux solutions x = (−b ± √Δ)/(2a).<br>• <b>Δ = 0</b> : une solution double x = −b/(2a).<br>• <b>Δ &lt; 0</b> : aucune solution réelle.</p><p>Exemple : 2x² − x − 3 = 0 : Δ = 1 + 24 = 25 ; x = (1 ± 5)/4, soit <b>x = 3/2</b> ou <b>x = −1</b>. Vérification : 2·(9/4) − 3/2 − 3 = 0.</p><p>Graphiquement, Δ &gt; 0 : la parabole coupe l\'axe Ox deux fois ; Δ = 0 : elle le touche ; Δ &lt; 0 : elle ne le coupe pas.</p></div>'+
 '<div class="tcard"><b class="h">Somme et produit des solutions</b><p>Si Δ ≥ 0 : <b>S = x₁ + x₂ = −b/a</b> et <b>P = x₁·x₂ = c/a</b>. Alors ax² + bx + c = a(x − x₁)(x − x₂). Utile pour calculer sans résoudre : x₁² + x₂² = S² − 2P et 1/x₁ + 1/x₂ = S/P.</p><p>Exemple : 2x² − 10x + 7 = 0 (Δ = 44 &gt; 0) : S = 5, P = 7/2, x₁² + x₂² = 25 − 7 = <b>18</b>. Deux nombres de somme S et de produit P sont les solutions de x² − Sx + P = 0.</p></div>'+
 '<div class="tcard"><b class="h">Se ramener au second degré</b><p><b>Bicarrée</b> ax⁴ + bx² + c = 0 : on pose X = x² (avec X ≥ 0), on résout en X, puis x = ±√X. Ex. : x⁴ − 5x² − 36 = 0 donne X = 9 ou X = −4 (rejeté) ; x = ±3.</p><p><b>Fractionnaire</b> : on cherche d\'abord les valeurs interdites, on réduit au même dénominateur, on résout, puis on <b>rejette</b> les solutions interdites.</p><p><b>Problème</b> : on choisit l\'inconnue, on met en équation, on résout, on vérifie dans l\'énoncé.</p></div>'+
 '<div class="tcard"><b class="h">Pièges</b><p>Oublier le signe moins dans −b ; utiliser b² − 4ac avec c négatif sans parenthèses ; diviser par x (on perd la solution x = 0) ; oublier de rejeter une valeur interdite ; ne garder qu\'une solution de l\'équation en X.</p></div>'
});
SFA.figs("c04", [
 function (p) { /* 0 factoriser */
  var f=m4_fr(-1,5,-2,8,{});
  m4_grid(f,1,1,true);
  m4_cv(f,function(x){return x*x-5*x+6;},-1,5,BLUE,3.4);
  tag('y = x² − 5x + 6',f.X(.4),f.Y(7.2),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_pt(f,2,0,RED,'x = 2',-14,-20,6);m4_pt(f,3,0,RED,'x = 3',16,-20,6);
   tag('(x − 2)(x − 3) = 0',f.X(2.5),f.Y(-1.2),DGREEN,16);ctx.globalAlpha=1;}
 },
 function (p) { /* 1 discriminant */
  var f=m4_fr(-3,4,-8.5,8,{});
  m4_grid(f,1,2,true);
  m4_cv(f,function(x){return 2*x*x-3*x-5;},-3,4,BLUE,3.4);
  tag('y = 2x² − 3x − 5',f.X(-1.4),f.Y(7),BLUE_D,15);
  tag('Δ = b² − 4ac',f.X(2.3),f.Y(-5.8),ORANGE,16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('= 9 + 40 = 49',f.X(2.3),f.Y(-7.3),DRED,16);
   m4_pt(f,-1,0,RED,'−1',-4,-18,6);m4_pt(f,2.5,0,RED,'5/2',10,-18,6);ctx.globalAlpha=1;}
 },
 function (p) { /* 2 incomplètes */
  var f=m4_fr(-5,4,-13,10,{});
  m4_grid(f,1,2,true);
  m4_cv(f,function(x){return 3*x*x-12;},-5,4,BLUE,3.2);m4_cv(f,function(x){return x*x+4*x;},-5,4,ORANGE,3.2);
  tag('a) 3x² − 12',f.X(-3.5),f.Y(9),BLUE_D,15);tag('b) x² + 4x',f.X(2.2),f.Y(-8),DRED,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);[-2,2].forEach(function(x){m4_pt(f,x,0,BLUE,'',0,0,6);});[-4,0].forEach(function(x){m4_pt(f,x,0,ORANGE,'',0,0,6);});
   tag('±2',f.X(2.7),f.Y(0)-18,BLUE_D,14);tag('−4 et 0',f.X(-3.2),f.Y(0)+20,DRED,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 2x²-x-3 */
  var f=m4_fr(-2.5,3,-4.5,6,{});
  m4_grid(f,1,1,true);
  m4_cv(f,function(x){return 2*x*x-x-3;},-2.5,3,BLUE,3.4);
  tag('2x² − x − 3 = 0',f.X(-1.3),f.Y(5),BLUE_D,15);
  tag('Δ = 1 + 24 = 25',f.X(1.9),f.Y(-3.9),ORANGE,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_pt(f,-1,0,RED,'−1',-4,-18,6);m4_pt(f,1.5,0,RED,'3/2',10,-18,6);m4_vl(f,.25,GREY);ctx.globalAlpha=1;}
 },
 function (p) { /* 4 solution double */
  var f=m4_fr(-6.5,6.5,-2.5,12,{});
  m4_grid(f,1,2,true);
  m4_cv(f,function(x){return x*x+9;},-6.5,6.5,'#c5c9cf',2.4);tag('m = 0 : Δ < 0',f.X(0),f.Y(10.8),GREY,13);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_cv(f,function(x){return (x+3)*(x+3);},-6.5,6.5,BLUE,3.4);m4_cv(f,function(x){return (x-3)*(x-3);},-6.5,6.5,ORANGE,3.4);
   m4_pt(f,-3,0,RED,'',0,0,6);m4_pt(f,3,0,RED,'',0,0,6);tag('m = 6',f.X(-4.9),f.Y(5.2),BLUE_D,15);tag('m = −6',f.X(4.9),f.Y(5.2),DRED,15);
   tag('Δ = m² − 36 = 0',f.X(0),f.Y(-1.4),DGREEN,14);ctx.globalAlpha=1;}
  else tag('x² + mx + 9 = 0',f.X(0),f.Y(6),BLUE_D,16);
 },
 function (p) { /* 5 somme produit */
  var f=m4_fr(-1,6,-6.5,8,{});
  m4_grid(f,1,2,true);
  m4_cv(f,function(x){return 2*x*x-10*x+7;},-1,6,BLUE,3.4);
  tag('2x² − 10x + 7 = 0',f.X(.9),f.Y(7),BLUE_D,15);
  var r=Math.sqrt(44)/4,x1=2.5-r,x2=2.5+r;
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,2.5,GREY);m4_pt(f,x1,0,RED,'x₁',-10,-18,6);m4_pt(f,x2,0,RED,'x₂',10,-18,6);
   tag('S = x₁ + x₂ = 5',f.X(4.3),f.Y(-3),DRED,15);tag('P = x₁·x₂ = 7/2',f.X(4.3),f.Y(-4.6),DGREEN,15);tag('x₁² + x₂² = 18',f.X(4.3),f.Y(-6.1),VIO_D,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 bicarrée */
  var f=m4_fr(-3.8,3.8,-46,72,{});
  m4_grid(f,1,20,true);
  m4_cv(f,function(x){return Math.pow(x,4)-5*x*x-36;},-3.8,3.8,BLUE,3.4);
  tag('y = x⁴ − 5x² − 36',f.X(0),f.Y(62),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_pt(f,-3,0,RED,'−3',-4,-18,6);m4_pt(f,3,0,RED,'3',4,-18,6);
   tag('X = x² : X = 9 ✓  X = −4 ✗',f.X(0),f.Y(-27),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 fractionnaire */
  var f=m4_fr(-5,4,-6.5,8,{});
  m4_grid(f,1,2,true);
  m4_vl(f,-1,'#e8a4a3');m4_vl(f,1,'#e8a4a3');
  tag('x = −1',f.X(-1)-24,f.T+12,DRED,13);tag('x = 1',f.X(1)+22,f.T+12,DRED,13);
  var g=function(x){return (2*x+3)/(x+1);};
  m4_cv(f,g,-5,-1.02,BLUE,3.4);m4_cv(f,g,-.98,4,BLUE,3.4);
  tag('LHS − RHS',f.X(-4,5)+0,f.Y(-4.8),BLUE_D,14);
  DOT(f.X(1),f.Y(2.5),6,'#fff');DOT(f.X(1),f.Y(2.5),6,RED,false);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_pt(f,-1.5,0,GREEN,'−3/2',-4,-20,7);tag('x = 1 rejetée',f.X(2.4),f.Y(4.5),DRED,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 8 rectangle */
  var u=Math.min((W-90)/12,(H-130)/5),rw=12*u,rh=5*u,x0=(W-rw)/2,y0=H*.2;
  ctx.fillStyle='rgba(55,138,221,.12)';ctx.fillRect(x0,y0,rw,rh);ctx.strokeStyle=BLUE_D;ctx.lineWidth=3.4;ctx.strokeRect(x0,y0,rw,rh);
  TB('x',x0+rw/2,y0-8,BLUE_D,19);TB('y',x0-14,y0+rh/2+6,BLUE_D,19);
  TB('x + y = 17   ;   x² + y² = 169',W*.5,H*.1,INK,15);
  var a=m4_ap(p,0,.6);
  LN(x0,y0+rh,x0+rw*a,y0+rh-rh*a,RED,3.2);
  if(a>.95){tag('13',x0+rw*.5,y0+rh*.5,DRED,17);}
  ctx.globalAlpha=m4_ap(p,.5,1);
  TB('12',x0+rw/2,y0+rh+22,DGREEN,18);TB('5',x0+rw+16,y0+rh/2+6,DGREEN,18);
  TB('x² − 17x + 60 = 0  →  12 cm sur 5 cm',W*.5,H-22,DRED,17);ctx.globalAlpha=1;
 },
 function (p) { /* 9 paramètre */
  var f=m4_fr(-3,4,-3,8,{});
  m4_grid(f,1,1,true);
  m4_cv(f,function(x){return (x-1)*(x-1);},-3,4,ORANGE,3.4);
  tag('(E) : (x − 1)(x − m)',f.X(-1.1),f.Y(7.2),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_cv(f,function(x){return (x-1)*(x+2);},-3,4,BLUE,3);m4_cv(f,function(x){return (x-1)*(x-2);},-3,4,GREEN,3);
   m4_pt(f,1,0,RED,'',0,0,7);m4_pt(f,-2,0,BLUE,'',0,0,5);m4_pt(f,2,0,GREEN,'',0,0,5);
   tag('m = −2',f.X(-2.2),f.Y(1.2),BLUE_D,14);tag('m = 2',f.X(3.2),f.Y(3),DGREEN,14);tag('m = 1 : double',f.X(2.9),f.Y(5.6),DRED,14);ctx.globalAlpha=1;}
  else tag('Δ = (m − 1)²',f.X(2.1),f.Y(-1.8),GREY,14);
 }
]);
