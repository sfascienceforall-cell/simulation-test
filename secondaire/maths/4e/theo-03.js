/* Maths 4e · chapitre 3 : fonction du second degré */
SFA.theo("c03", {
 icon: function () {
  var f=m4_fr(-1,7,-5,6,{l:30,r:W*.46,t:20,b:20});
  m4_grid(f,1,1,false);
  m4_vl(f,3,GREY);
  m4_cv(f,function(x){return (x-3)*(x-3)-4;},-1,7,BLUE,3.6);
  DOT(f.X(3),f.Y(-4),6,ORANGE);DOT(f.X(1),f.Y(0),5,RED);DOT(f.X(5),f.Y(0),5,RED);
  var x0=f.R+18;
  TB('ax² + bx + c',x0,H*.3,BLUE_D,24,'left');
  TB('a(x − h)² + k',x0,H*.5,ORANGE,24,'left');
  TB('a(x − x₁)(x − x₂)',x0,H*.7,DRED,22,'left');
 },
 anim: function (t) {
  var f=m4_fr(-1,7,-5,8,{l:26,r:W*.43,t:16,b:22});
  m4_grid(f,1,1,true);
  var Q=function(x){return (x-3)*(x-3)-4;};
  m4_vl(f,3,GREY);tag('axe x = 3',f.X(3),f.T+12,GREY,13);
  m4_cv(f,Q,-1,7,BLUE,3.6);
  var seg=Math.floor(t/200)%3,pu=.5+.5*Math.sin(t/12);
  var xp=3+2.7*Math.sin(t/55),xm=6-xp;
  LN(f.X(xp),f.Y(Q(xp)),f.X(xm),f.Y(Q(xp)),VIOLET,1.8,[4,4]);
  DOT(f.X(xp),f.Y(Q(xp)),6,VIOLET);DOT(f.X(xm),f.Y(Q(xp)),6,VIOLET);
  DOT(f.X(3),f.Y(-4),6+(seg===1?3*pu:0),ORANGE);
  [1,5].forEach(function(r){DOT(f.X(r),f.Y(0),5+(seg===2?3*pu:0),RED);});
  var x0=f.R+22,w=W-x0-6;
  var hl=function(i){return seg===i?1:.45;};
  ctx.globalAlpha=hl(0);TB('développée',x0,32,GREY,13,'left');TB('f(x) = x² − 6x + 5',x0,56,BLUE_D,18,'left');ctx.globalAlpha=1;
  ctx.globalAlpha=hl(1);TB('canonique',x0,98,GREY,13,'left');TB('f(x) = (x − 3)² − 4',x0,122,ORANGE,18,'left');TB('sommet S(3 ; −4)',x0,146,ORANGE,15,'left');ctx.globalAlpha=1;
  ctx.globalAlpha=hl(2);TB('factorisée',x0,188,GREY,13,'left');TB('f(x) = (x − 1)(x − 5)',x0,212,DRED,18,'left');TB('zéros 1 et 5',x0,236,DRED,15,'left');ctx.globalAlpha=1;
  TB('f(3 + d) = f(3 − d) : symétrie',x0,272,VIO_D,13,'left');
 },
 th: '<div class="tcard"><b class="h">La parabole f(x) = ax² + bx + c (a ≠ 0)</b><p>Si <b>a &gt; 0</b>, elle est ouverte vers le haut (elle a un <b>minimum</b>) ; si <b>a &lt; 0</b>, vers le bas (elle a un <b>maximum</b>). Elle est symétrique par rapport à l\'<b>axe x = −b/(2a)</b>. Le <b>sommet</b> est S(−b/(2a) ; f(−b/(2a))). Elle coupe l\'axe Oy en (0 ; c).</p></div>'+
 '<div class="tcard"><b class="h">Forme canonique : f(x) = a(x − h)² + k</b><p>Le sommet est S(h ; k), l\'axe est x = h. On passe de la forme développée à la forme canonique en <b>complétant le carré</b> : h = −b/(2a) et k = f(h) = −Δ/(4a), avec Δ = b² − 4ac.</p><p>Exemple : x² + 8x + 3 = (x + 4)² − 16 + 3 = <b>(x + 4)² − 13</b>. Minimum −13, atteint en x = −4.</p></div>'+
 '<div class="tcard"><b class="h">Forme factorisée : f(x) = a(x − x₁)(x − x₂)</b><p>x₁ et x₂ sont les <b>zéros</b> (abscisses des points d\'intersection avec Ox). L\'axe de symétrie passe au milieu : h = (x₁ + x₂)/2. Exemple : x² − 6x + 5 = (x − 1)(x − 5), axe x = 3, sommet S(3 ; −4).</p><p>Il n\'y a pas toujours de forme factorisée dans ℝ : la parabole peut ne pas couper Ox.</p></div>'+
 '<div class="tcard"><b class="h">Trouver l\'équation d\'une parabole</b><p>• Sommet S(h ; k) et un point : y = a(x − h)² + k, puis a avec le point. Ex. : S(2 ; −3) et (4 ; 5) donnent 5 = a·4 − 3, a = 2.<br>• Deux zéros et un point : y = a(x − x₁)(x − x₂), puis a.<br>• Trois points : système de trois équations en a, b, c.</p></div>'+
 '<div class="tcard"><b class="h">Optimisation et pièges</b><p>Un extremum d\'un problème se trouve <b>au sommet</b> : on exprime la grandeur en fonction d\'une seule variable (par exemple A = x(120 − 3x)), puis on lit le sommet. Réponds toujours à la question posée (dimensions, valeur, unité).</p><p><b>Pièges</b> : le signe de h (x + 4 donne h = −4) ; confondre a &lt; 0 (maximum) et a &gt; 0 (minimum) ; donner l\'abscisse du sommet alors qu\'on demande l\'extremum lui-même.</p></div>'
});
SFA.figs("c03", [
 function (p) { /* 0 x²-6x+5 */
  var f=m4_fr(-1,7,-5.5,8,{});
  m4_grid(f,1,1,true);
  var Q=function(x){return x*x-6*x+5;};
  m4_cv(f,Q,-1,7,BLUE,3.4);tag('f(x) = x² − 6x + 5',f.X(0.2),f.Y(7.4),BLUE_D,14);
  m4_pt(f,0,5,GREY,'',0,0,4);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,3,ORANGE);m4_pt(f,3,-4,ORANGE,'S(3 ; −4)',0,22,6);tag('axe x = 3',f.X(4.3),f.Y(6.5),DRED,13);
   m4_pt(f,1,0,RED,'',0,0,6);m4_pt(f,5,0,RED,'',0,0,6);tag('1',f.X(1)-14,f.Y(0)-16,DRED,13);tag('5',f.X(5)+14,f.Y(0)-16,DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 1 sommet forme canonique */
  var f=m4_fr(-1,7,-7,7,{});
  m4_grid(f,1,1,true);
  var Q=function(x){return -2*(x-3)*(x-3)+5;};
  m4_cv(f,Q,-1,7,BLUE,3.4);tag('y = −2(x − 3)² + 5',f.X(5),f.Y(-5.5),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,3,ORANGE);m4_pt(f,3,5,ORANGE,'S(3 ; 5)',46,-6,6);tag('a = −2 < 0 : maximum',f.X(.6),f.Y(5.8),DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 2 compléter le carré */
  var f=m4_fr(-9.5,1.5,-15,9,{});
  m4_grid(f,1,2,true);
  var Q=function(x){return x*x+8*x+3;};
  m4_cv(f,Q,-9.5,1.5,BLUE,3.4);tag('f(x) = x² + 8x + 3',f.X(-2),f.Y(8),BLUE_D,14);
  m4_pt(f,0,3,GREY,'',0,0,4);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,-4,ORANGE);m4_hl(f,-13,ORANGE);m4_pt(f,-4,-13,ORANGE,'S(−4 ; −13)',0,24,6);
   tag('(x + 4)² − 13',f.X(-7.3),f.Y(-4),DGREEN,16);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 sommet + point */
  var f=m4_fr(-1.5,6,-5,10,{});
  m4_grid(f,1,1,true);
  var Q=function(x){return 2*(x-2)*(x-2)-3;};
  if(p>0)m4_cv(f,Q,-1.5,6,BLUE,3.4);
  m4_vl(f,2,GREY);
  m4_pt(f,2,-3,ORANGE,'S(2 ; −3)',0,22,6);m4_pt(f,4,5,RED,'(4 ; 5)',20,-14,6);
  if(p>0){ctx.globalAlpha=m4_ap(p,.2,1);tag('y = 2(x − 2)² − 3',f.X(4.3),f.Y(-2.4),BLUE_D,15);tag('= 2x² − 8x + 5',f.X(4.3),f.Y(-4),DGREEN,15);m4_pt(f,0,5,GREY,'',0,0,4);ctx.globalAlpha=1;}
  else tag('a = ?',f.X(4.3),f.Y(-2.4),GREY,16);
 },
 function (p) { /* 4 max ou min */
  var f=m4_fr(-2.5,6.5,-5,11,{});
  m4_grid(f,1,1,true);
  var Q=function(x){return -x*x+4*x+5;};
  m4_cv(f,Q,-2.5,6.5,BLUE,3.4);tag('f(x) = −x² + 4x + 5',f.X(4.6),f.Y(-3),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,2,ORANGE);m4_pt(f,2,9,ORANGE,'maximum 9',0,-16,6);
   m4_pt(f,-1,0,RED,'',0,0,5);m4_pt(f,5,0,RED,'',0,0,5);tag('x = 2',f.X(2),f.Y(0)+18,DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 5 par ses zéros */
  var f=m4_fr(-1,5,-5.5,3,{});
  m4_grid(f,1,1,true);
  var Q=function(x){return -x*x+4*x-3;};
  m4_pt(f,1,0,RED,'',0,0,6);m4_pt(f,3,0,RED,'',0,0,6);m4_pt(f,0,-3,BLUE,'A(0 ; −3)',36,12,6);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_cv(f,Q,-1,5,BLUE,3.4);m4_vl(f,2,ORANGE);m4_pt(f,2,1,ORANGE,'S(2 ; 1)',34,-6,6);
   tag('y = −x² + 4x − 3',f.X(3.7),f.Y(-2.2),BLUE_D,15);ctx.globalAlpha=1;}
  else tag('y = a(x − 1)(x − 3)',f.X(3.4),f.Y(-2.2),GREY,15);
 },
 function (p) { /* 6 enclos */
  var wl=W*.44,x0=22,y0=56,wd=wl-34,hd=H*.46;
  LN(x0,y0-12,x0+wd+10,y0-12,INK,4);TB('mur',x0+wd/2,y0-22,GREY,13);
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3.4;ctx.strokeRect(x0,y0,wd,hd);LN(x0+wd/2,y0,x0+wd/2,y0+hd,BLUE_D,3.4);
  ctx.fillStyle='rgba(55,138,221,.10)';ctx.fillRect(x0,y0,wd,hd);
  TB('x',x0-10,y0+hd/2+5,DRED,17);TB('x',x0+wd/2-9,y0+hd/2+5,DRED,17);TB('x',x0+wd+10,y0+hd/2+5,DRED,17);
  TB('L',x0+wd/2,y0+hd+22,ORANGE,18);TB('3x + L = 120',x0+wd/2,y0+hd+48,INK,14);
  var f=m4_fr(0,40,-100,1500,{l:wl+50,r:14,t:22,b:30});
  m4_grid(f,10,500,true);TB('A (m²)',f.L-6,f.T-8,GREY,12,'left');
  var A=function(x){return x*(120-3*x);};
  m4_cv(f,A,0,40,BLUE,3.4);tag('A = x(120 − 3x)',f.X(30),f.Y(1350),BLUE_D,13);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,20,ORANGE);m4_hl(f,1200,ORANGE);m4_pt(f,20,1200,ORANGE,'1 200 m²',0,-16,6);
   TB('x = 20 m ; L = 60 m',x0+wd/2,H-12,DRED,15);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 ballon */
  var f=m4_fr(-.5,5,-3,25,{});
  m4_grid(f,1,5,true);TB('t (s)',f.R-12,f.Y(0)-8,GREY,12);TB('h (m)',f.L+6,f.T+10,GREY,12,'left');
  var h=function(t){return -5*t*t+20*t+1.5;};
  m4_clip(f);ctx.fillStyle='#eaf6f0';ctx.fillRect(f.L,f.Y(0),f.R-f.L,f.B-f.Y(0));ctx.restore();
  m4_cv(f,h,0,4.0736,BLUE,3.4);
  m4_pt(f,0,1.5,GREY,'1,5 m',30,4,5);
  tag('h(t) = −5t² + 20t + 1,5',f.X(3.8),f.Y(23.5),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_vl(f,2,ORANGE);m4_pt(f,2,21.5,ORANGE,'sommet (2 ; 21,5)',0,-16,6);
   m4_pt(f,2+Math.sqrt(4.3),0,RED,'',0,0,6);tag('t ≈ 4,1 s',f.X(4.07)-10,f.Y(0)-20,DRED,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 8 famille */
  var f=m4_fr(-2.5,4,-1.5,8,{});
  m4_grid(f,1,1,true);
  var ms=[-1,0,.5,1,2],cols=['#b9c8e0','#9fb6d9','#378ADD','#9fb6d9','#b9c8e0'];
  ms.forEach(function(m,i){m4_cv(f,function(x){return x*x-2*m*x+m+2;},-2.5,4,cols[i],2.2);});
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_cv(f,function(x){return -x*x+x+2;},-2.5,3,ORANGE,3.4);
   ms.forEach(function(m){m4_pt(f,m,-m*m+m+2,ORANGE,'',0,0,5);});
   m4_pt(f,.5,2.25,RED,'S(½ ; 9/4)',46,-12,7);tag('sommets : y = −x² + x + 2',f.X(-.2),f.Y(7.3),DRED,14);ctx.globalAlpha=1;}
  else tag('f_m(x) = x² − 2mx + m + 2',f.X(0),f.Y(7.3),BLUE_D,14);
 },
 function (p) { /* 9 droite tangente */
  var f=m4_fr(-1,6,-8.5,8.5,{});
  m4_grid(f,1,2,true);
  var Q=function(x){return x*x-4*x+3;};
  m4_cv(f,Q,-1,6,BLUE,3.4);tag('f(x) = x² − 4x + 3',f.X(.8),f.Y(7),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);
   m4_cv(f,function(x){return 2*x;},-1,6,'#c5c9cf',2,[5,4]);
   m4_cv(f,function(x){return 2*x-6;},-1,6,ORANGE,3.4);m4_pt(f,3,0,RED,'(3 ; 0)',-8,-18,7);
   tag('d : y = 2x − 6',f.X(4.7),f.Y(-3.4),DRED,14);tag('y = 2x + p : p > −6 → 2 points',f.X(3),f.Y(-7.4),GREY,13);ctx.globalAlpha=1;}
 }
]);
