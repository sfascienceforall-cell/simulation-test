/* Maths 4e · chapitre 1 : fonctions de référence et transformations. Aides m4_* réutilisées par les autres theo-NN.js */
function m4_cl(v,a,b){return Math.max(a,Math.min(b,v));}
function m4_ss(u){u=m4_cl(u,0,1);return u*u*(3-2*u);}
function m4_fr(x0,x1,y0,y1,o){o=o||{};var l=o.l==null?30:o.l,r=o.r==null?14:o.r,t=o.t==null?26:o.t,b=o.b==null?22:o.b;
 var w=W-l-r,h=H-t-b,sx=w/(x1-x0),sy=h/(y1-y0),ox=l,oy=t;
 if(o.eq){var s=Math.min(sx,sy);sx=sy=s;ox=l+(w-(x1-x0)*s)/2;oy=t+(h-(y1-y0)*s)/2;}
 return {x0:x0,x1:x1,y0:y0,y1:y1,sx:sx,sy:sy,L:ox,T:oy,R:ox+(x1-x0)*sx,B:oy+(y1-y0)*sy,
  X:function(x){return ox+(x-x0)*sx;},Y:function(y){return oy+(y1-y)*sy;}};}
function m4_grid(f,gx,gy,lab){gx=gx||1;gy=gy||1;var i,v;ctx.lineWidth=1;ctx.strokeStyle='#eceef1';
 for(v=Math.ceil(f.x0/gx)*gx;v<=f.x1+1e-9;v+=gx){ctx.beginPath();ctx.moveTo(f.X(v),f.T);ctx.lineTo(f.X(v),f.B);ctx.stroke();}
 for(v=Math.ceil(f.y0/gy)*gy;v<=f.y1+1e-9;v+=gy){ctx.beginPath();ctx.moveTo(f.L,f.Y(v));ctx.lineTo(f.R,f.Y(v));ctx.stroke();}
 var ax=(f.y0<=0&&f.y1>=0)?f.Y(0):f.B,ay=(f.x0<=0&&f.x1>=0)?f.X(0):f.L;
 LN(f.L,ax,f.R,ax,AX,1.6);LN(ay,f.T,ay,f.B,AX,1.6);
 if(lab){ctx.font='11px system-ui';ctx.fillStyle=GREY;ctx.textAlign='center';
  var kx=Math.max(gx,Math.ceil(28/(f.sx*gx))*gx),ky=Math.max(gy,Math.ceil(18/(f.sy*gy))*gy);
  for(v=Math.ceil(f.x0/kx)*kx;v<=f.x1+1e-9;v+=kx){if(Math.abs(v)<1e-9)continue;ctx.fillText(String(Math.round(v*100)/100).replace('.',','),f.X(v),Math.min(f.B+13,ax+13));}
  ctx.textAlign='right';for(v=Math.ceil(f.y0/ky)*ky;v<=f.y1+1e-9;v+=ky){if(Math.abs(v)<1e-9)continue;ctx.fillText(String(Math.round(v*100)/100).replace('.',','),Math.max(f.L-3,ay-4),f.Y(v)+4);}}}
function m4_clip(f){ctx.save();ctx.beginPath();ctx.rect(f.L-1,f.T-1,f.R-f.L+2,f.B-f.T+2);ctx.clip();}
function m4_cv(f,fn,xa,xb,col,w,dash){m4_clip(f);ctx.strokeStyle=col||BLUE;ctx.lineWidth=w||2.6;if(dash)ctx.setLineDash(dash);ctx.beginPath();
 var n=320,pen=false,py=0,i,x,y;for(i=0;i<=n;i++){x=xa+(xb-xa)*i/n;y=fn(x);if(!isFinite(y)||Math.abs(y)>1e4||(pen&&Math.abs(y-py)>(f.y1-f.y0)*3)){pen=false;py=y;continue;}
  if(!pen){ctx.moveTo(f.X(x),f.Y(y));pen=true;}else ctx.lineTo(f.X(x),f.Y(y));py=y;}
 ctx.stroke();ctx.setLineDash([]);ctx.restore();}
function m4_fill(f,fa,fb,xa,xb,col,al){m4_clip(f);ctx.globalAlpha=al==null?.22:al;ctx.fillStyle=col;ctx.beginPath();var n=160,i,x;
 for(i=0;i<=n;i++){x=xa+(xb-xa)*i/n;i?ctx.lineTo(f.X(x),f.Y(fa(x))):ctx.moveTo(f.X(x),f.Y(fa(x)));}
 for(i=n;i>=0;i--){x=xa+(xb-xa)*i/n;ctx.lineTo(f.X(x),f.Y(fb(x)));}ctx.closePath();ctx.fill();ctx.restore();ctx.globalAlpha=1;}
function m4_pt(f,x,y,col,lab,dx,dy,r,hollow){DOT(f.X(x),f.Y(y),r||5,col,hollow?false:true);if(lab)tag(lab,f.X(x)+(dx||0),f.Y(y)+(dy==null?-16:dy),dk(col),13);}
function m4_ap(p,a,b){return m4_cl((p-a)/(b-a),0,1);}
function m4_vl(f,x,col,dash){LN(f.X(x),f.T,f.X(x),f.B,col||GREY,1.4,dash||[5,4]);}
function m4_hl(f,y,col,dash){LN(f.L,f.Y(y),f.R,f.Y(y),col||GREY,1.4,dash||[5,4]);}
function m4_wrap(txt,x,y,w,col,sz,lh,al){var ws=txt.split(' '),ln='',i,yy=y;ctx.font='600 '+sz+'px system-ui';
 for(i=0;i<ws.length;i++){var t2=ln?ln+' '+ws[i]:ws[i];if(ctx.measureText(t2).width>w&&ln){TB(ln,x,yy,col,sz,al||'left');yy+=lh;ln=ws[i];}else ln=t2;}
 if(ln)TB(ln,x,yy,col,sz,al||'left');return yy;}

SFA.theo("c01", {
 icon: function () {
  var f=m4_fr(-4,4,-1,5,{l:60,r:60,t:92,b:14});
  TB('a · f(x − h) + k',W*.5,50,BLUE_D,32);
  m4_grid(f,1,1,false);
  m4_cv(f,function(x){return x*x*.3;},-4,4,GREY,2,[5,4]);
  m4_cv(f,function(x){return .3*(x-1)*(x-1)+1.2;},-4,4,BLUE,3.4);
  m4_cv(f,function(x){return 3.5-.5*Math.abs(x+1.8);},-4,4,ORANGE,3);
  DOT(f.X(1),f.Y(1.2),5,BLUE_D);DOT(f.X(-1.8),f.Y(3.5),5,ORANGE);
  TB('x²  ·  |x|  ·  √x  ·  1/x',W*.5,H-4,GREY,15);
 },
 anim: function (t) {
  var S=[[0,0,1],[-2,0,1],[-2,-3,1],[-2,-3,2],[-2,-3,-1],[0,0,1]],
   N=S.length-1,L=170,k=Math.floor(t/L)%N,u=m4_ss(((t%L)/L-.12)/.6);
  var A=S[k],B=S[k+1],h=A[0]+(B[0]-A[0])*u,kk=A[1]+(B[1]-A[1])*u,a=A[2]+(B[2]-A[2])*u;
  var f=m4_fr(-5,5,-7,7,{l:30,r:W*.42,t:20,b:24});
  m4_grid(f,1,1,true);
  m4_cv(f,function(x){return x*x;},-5,5,GREY,2,[5,4]);
  m4_cv(f,function(x){return a*(x-h)*(x-h)+kk;},-5,5,BLUE,3.4);
  DOT(f.X(h),f.Y(kk),6,ORANGE);
  if(Math.abs(h)>.05)LN(f.X(0),f.Y(0),f.X(h),f.Y(0),ORANGE,3);
  if(Math.abs(kk)>.05)LN(f.X(h),f.Y(0),f.X(h),f.Y(kk),VIOLET,3);
  var x0=f.R+26,w=W-x0-8;
  TB('g(x) = a·f(x − h) + k',x0,52,BLUE_D,Math.min(19,w/9),'left');
  TB('f(x) = x²  (en gris)',x0,78,GREY,14,'left');
  var r1=function(v){return String(Math.round(v*10)/10).replace('.',',').replace('-','−');};
  TB('h = '+r1(h)+'   k = '+r1(kk),x0,116,ORANGE,16,'left');
  TB('a = '+r1(a),x0,142,VIOLET,16,'left');
  TB('sommet S('+r1(h)+' ; '+r1(kk)+')',x0,168,DRED,15,'left');
  var msg=["h : glissement horizontal (signe inversé : x − h)","k : glissement vertical","|a| > 1 : étirement vertical","a < 0 : retournement (axe Ox)","retour à la fonction de base"][k];
  m4_wrap(msg,x0,206,w,INK,14,19);
 },
 th: '<div class="tcard"><b class="h">Les six fonctions de base</b><p>Ce sont les « briques » : <b>x</b> (droite), <b>x²</b> (parabole), <b>x³</b>, <b>1/x</b> (hyperbole), <b>√x</b> et <b>|x|</b>.</p><table><tr><td>fonction</td><td>domaine</td><td>image</td><td>parité</td></tr><tr><td>x²</td><td>ℝ</td><td>[0 ; +∞[</td><td>paire</td></tr><tr><td>x³ et x</td><td>ℝ</td><td>ℝ</td><td>impaire</td></tr><tr><td>1/x</td><td>ℝ \\ {0}</td><td>ℝ \\ {0}</td><td>impaire</td></tr><tr><td>√x</td><td>[0 ; +∞[</td><td>[0 ; +∞[</td><td>ni l\'une ni l\'autre</td></tr><tr><td>|x|</td><td>ℝ</td><td>[0 ; +∞[</td><td>paire</td></tr></table></div>'+
 '<div class="tcard"><b class="h">Lire un graphe</b><p><b>Domaine</b> : abscisses où la courbe existe. <b>Image</b> : ordonnées atteintes. <b>Zéros</b> : f(x) = 0 (la courbe coupe l\'axe Ox). <b>Signe</b> : où la courbe est au-dessus (f &gt; 0) ou en dessous (f &lt; 0) de Ox.</p><p><b>Parité</b> : f est <b>paire</b> si f(−x) = f(x) (courbe symétrique par rapport à Oy) ; <b>impaire</b> si f(−x) = −f(x) (symétrique par rapport à l\'origine). Pour le prouver, il faut calculer f(−x) pour tout x, pas seulement pour une valeur.</p><p>Une fonction est <b>croissante</b> sur un intervalle si, quand x augmente, f(x) augmente ; un <b>extremum</b> est le plus grand (maximum) ou le plus petit (minimum) de ses valeurs.</p></div>'+
 '<div class="tcard"><b class="h">Transformer un graphe : g(x) = a·f(x − h) + k</b><p>• <b>h</b> : glissement horizontal de h unités vers la droite (attention : <i>x − h</i>, donc x + 2 décale vers la <b>gauche</b>).<br>• <b>k</b> : glissement vertical de k unités vers le haut.<br>• <b>a</b> : étirement vertical de rapport |a| ; si a &lt; 0, la courbe est retournée par rapport à l\'axe Ox.</p><p>Un point (u ; v) de la courbe de f devient le point <b>(u + h ; a·v + k)</b> sur celle de g.</p></div>'+
 '<div class="tcard"><b class="h">Exemple chiffré</b><p>g(x) = −2·|x − 1| + 6. Ici h = 1, k = 6, a = −2 : le sommet (0 ; 0) de |x| devient <b>(1 ; 6)</b>, la courbe est retournée et deux fois plus raide. Zéros : |x − 1| = 3, donc x = −2 ou x = 4. Image : ]−∞ ; 6].</p></div>'+
 '<div class="tcard"><b class="h">Résoudre avec les graphes et pièges</b><p>f(x) = g(x) : abscisses des points d\'intersection. f(x) &gt; g(x) : abscisses où la courbe de f est <b>au-dessus</b> de celle de g. On vérifie toujours par le calcul (passer tout d\'un côté, factoriser, tableau de signes).</p><p><b>Pièges</b> : inverser le signe de h ; tester la parité avec un seul nombre ; oublier que le domaine de √(x + 4) est x ≥ −4 (et non x ≥ 4).</p></div>'
});
SFA.figs("c01", [
 function (p) { /* 0 sommet translaté */
  var f=m4_fr(-8,6,-8,6,{l:14,r:14,t:16,b:16});
  m4_grid(f,1,1,false);
  m4_cv(f,function(x){return x*x;},-8,6,GREY,2.4,[5,4]);
  tag('f(x) = x²',f.X(3.6),f.Y(3.2),GREY,14);
  DOT(f.X(0),f.Y(0),5,GREY);
  var q=m4_ap(p,0,.5);
  if(q>0){m4_cv(f,function(x){return (x+2)*(x+2)-5;},-8,6,BLUE,3.4);
   arrow(f.X(0),f.Y(0),(f.X(-2)-f.X(0))*q,(f.Y(-5)-f.Y(0))*q,ORANGE,'',3.2);}
  if(p>.5){var a=m4_ap(p,.5,1);ctx.globalAlpha=a;m4_pt(f,-2,-5,ORANGE,'S(−2 ; −5)',-4,22);tag('g(x) = (x + 2)² − 5',f.X(-4.6),f.Y(4.4),BLUE_D,15);ctx.globalAlpha=1;}
  else tag('g(x) = (x + 2)² − 5 ?',f.X(-4.6),f.Y(4.4),BLUE_D,15);
 },
 function (p) { /* 1 parité x³ − x */
  var f=m4_fr(-2.4,2.4,-4.5,4.5,{});
  m4_grid(f,1,1,true);
  var g=function(x){return x*x*x-x;};
  m4_cv(f,g,-2.4,2.4,BLUE,3.4);
  TB('f(x) = x³ − x',f.X(-1.5),f.Y(3.7),BLUE_D,15);
  DOT(f.X(0),f.Y(0),5,ORANGE);
  var a=1.6,q=m4_ap(p,0,.6);
  if(q>0){var pa={x:f.X(a),y:f.Y(g(a))},pb={x:f.X(-a),y:f.Y(g(-a))};
   LN(pa.x,pa.y,pa.x+(pb.x-pa.x)*q,pa.y+(pb.y-pa.y)*q,ORANGE,2.2,[6,4]);
   DOT(pa.x,pa.y,5,GREEN);if(q>.9){DOT(pb.x,pb.y,5,GREEN);tag('f(−x) = −f(x)',f.X(.6),f.Y(-2.9),DGREEN,14);tag('impaire',f.X(1.3),f.Y(-3.8),DGREEN,15);}}
 },
 function (p) { /* 2 g=-2|x-1|+6 */
  var f=m4_fr(-5,7,-6,8,{});
  m4_grid(f,1,1,true);
  var g=function(x){return -2*Math.abs(x-1)+6;};
  m4_cv(f,function(x){return Math.abs(x);},-5,7,GREY,2,[5,4]);
  m4_cv(f,g,-5,7,BLUE,3.4);
  TB('g(x) = −2|x − 1| + 6',f.X(-4.8),f.Y(7.1),BLUE_D,15,'left');
  var a=m4_ap(p,0,1);ctx.globalAlpha=a;
  m4_vl(f,1,ORANGE);m4_pt(f,1,6,ORANGE,'S(1 ; 6)',34,-2);
  m4_pt(f,-2,0,RED,'−2',0,-18);m4_pt(f,4,0,RED,'4',0,-18);
  tag('image ]−∞ ; 6]',f.X(5),f.Y(7.1),DRED,14);ctx.globalAlpha=1;
 },
 function (p) { /* 3 point image */
  var f=m4_fr(-5,6,-6,8,{});
  m4_grid(f,1,1,true);
  var F=function(x){return 3+.9*(x-2)-.3*(x-2)*(x-2);},G=function(x){return -2*F(x+1)+4;};
  m4_cv(f,F,-5,6,BLUE,3.2);m4_cv(f,G,-5,6,p>0?ORANGE:'rgba(0,0,0,0)',3.2);
  TB('f',f.X(5.3),f.Y(F(5.3))-8,BLUE_D,16);
  m4_pt(f,2,3,BLUE,'A(2 ; 3)',-8,-18);
  if(p>0){var a=m4_ap(p,.2,1);ctx.globalAlpha=a;TB('g',f.X(-3.1),f.Y(G(-3.1))+4,DRED,16);
   m4_pt(f,1,G(1),ORANGE,'(1 ; −2)',0,22);
   arrow(f.X(2)-4,f.Y(3)+4,(f.X(1)-f.X(2))*.8,(f.Y(G(1))-f.Y(3))*.8,VIOLET,'',2.4,[6,4]);ctx.globalAlpha=1;}
  TB('g(x) = −2·f(x + 1) + 4',f.X(2.2),f.Y(7.1),INK,14,'left');
 },
 function (p) { /* 4 sqrt(x+4)-2 */
  var f=m4_fr(-6,8,-3.5,4,{});
  m4_grid(f,1,1,true);
  m4_cv(f,function(x){return Math.sqrt(x);},0,8,GREY,2,[5,4]);
  m4_cv(f,function(x){return Math.sqrt(x+4)-2;},-4,8,BLUE,3.4);
  TB('h(x) = √(x + 4) − 2',f.X(-5.8),f.Y(3.3),BLUE_D,15,'left');
  m4_pt(f,-4,-2,ORANGE,'',0,0);
  var a=m4_ap(p,0,1);ctx.globalAlpha=a;
  m4_vl(f,-4,ORANGE);tag('domaine x ≥ −4',f.X(-2.6),f.Y(-2.9),DRED,14);
  m4_pt(f,0,0,RED,'zéro : x = 0',46,-17);ctx.globalAlpha=1;
 },
 function (p) { /* 5 x² vs 2x+3 */
  var f=m4_fr(-3,5,-2,12,{});
  m4_grid(f,1,1,true);
  var q=function(x){return x*x;},d=function(x){return 2*x+3;};
  if(p>0){var a=m4_ap(p,0,.7);ctx.globalAlpha=a;m4_fill(f,q,d,-3,-1,GREEN,.3);m4_fill(f,q,d,3,5,GREEN,.3);ctx.globalAlpha=1;}
  m4_cv(f,q,-3,5,BLUE,3.2);m4_cv(f,d,-3,5,ORANGE,3.2);
  tag('f(x) = x²',f.X(-1.2),f.Y(11),BLUE_D,15);tag('g(x) = 2x + 3',f.X(.9),f.Y(8.6),DRED,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,.3,1);m4_pt(f,-1,1,RED,'(−1 ; 1)',30,14);m4_pt(f,3,9,RED,'(3 ; 9)',-34,-8);
   tag('f ≥ g',f.X(-2.2),f.Y(1.6),DGREEN,14);tag('f ≥ g',f.X(3.9),f.Y(11),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 paire x impaire */
  var f=m4_fr(-4.5,4.5,-6.5,8,{});
  m4_grid(f,1,1,true);
  var F=function(x){return 5*x*x/9;},G=function(x){return -x/3;},Hh=function(x){return F(x)*G(x);};
  m4_cv(f,F,-4.5,4.5,BLUE,3);m4_cv(f,G,-4.5,4.5,ORANGE,3);
  tag('f paire',f.X(-3.5),f.Y(-4),BLUE_D,15);tag('g impaire',f.X(-3.3),f.Y(-5.4),DRED,15);
  m4_pt(f,3,5,BLUE,'',0,0,4);m4_pt(f,-3,5,BLUE,'',0,0,4);m4_pt(f,3,-1,ORANGE,'',0,0,4);m4_pt(f,-3,1,ORANGE,'',0,0,4);
  if(p>0){var a=m4_ap(p,0,1);ctx.globalAlpha=a;m4_cv(f,Hh,-4.5,4.5,GREEN,3);
   m4_pt(f,-3,5,GREEN,'h(−3) = 5',-6,24,6);m4_pt(f,3,-5,GREEN,'h(3) = −5',-34,18,6);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 arche */
  var f=m4_fr(-30,30,-4,15,{l:22,r:22,t:22,b:12});
  ctx.fillStyle='#e6f1fb';ctx.fillRect(f.L,f.Y(0),f.R-f.L,f.B-f.Y(0));
  LN(f.L,f.Y(0),f.R,f.Y(0),BLUE,2);TB('eau',f.R-20,f.Y(0)+15,BLUE_D,13);
  var y=function(x){return -.02*x*x+12.5;};
  m4_fill(f,y,function(x){return 0;},-25,25,'#cbd5df',.55);
  m4_cv(f,y,-25,25,BLUE_D,3.6);
  TB('y = −0,02x² + 12,5',f.X(0),f.Y(7),INK,15);
  var a=m4_ap(p,0,1);ctx.globalAlpha=a;
  LN(f.X(0),f.Y(0),f.X(0),f.Y(12.5),ORANGE,2,[5,4]);m4_pt(f,0,12.5,ORANGE,'12,5 m',44,-4);
  LN(f.X(-25),f.Y(-1.8),f.X(25),f.Y(-1.8),RED,2.4);tag('50 m',f.X(0),f.Y(-1.8)+2,DRED,14);
  m4_pt(f,15,8,GREEN,'8 m (x = 15)',44,-13);LN(f.X(-20),f.Y(4.5),f.X(20),f.Y(4.5),VIOLET,2);tag('40 m à 4,5 m',f.X(0),f.Y(4.5),VIO_D,13);
  ctx.globalAlpha=1;
 },
 function (p) { /* 8 racine = droite */
  var f=m4_fr(-2,6,-1,9,{});
  m4_grid(f,1,1,true);
  var g=function(x){return 2*Math.sqrt(x+1)+2;},d=function(x){return x+3;};
  if(p>0){ctx.globalAlpha=m4_ap(p,0,.7);m4_fill(f,g,d,-1,3,GREEN,.28);ctx.globalAlpha=1;}
  m4_cv(f,g,-1,6,BLUE,3.4);m4_cv(f,d,-2,6,ORANGE,3);
  tag('g(x) = 2√(x + 1) + 2',f.X(1.2),f.Y(8.2),BLUE_D,15);tag('y = x + 3',f.X(4.7),f.Y(6.4),DRED,14);
  m4_pt(f,-1,2,GREY,'départ (−1 ; 2)',34,22);
  if(p>0){ctx.globalAlpha=m4_ap(p,.3,1);m4_pt(f,-1,2,RED,'',0,0,6);m4_pt(f,3,6,RED,'(3 ; 6)',22,-16,6);tag('g > droite',f.X(1),f.Y(5.6),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 écart maximal */
  var f=m4_fr(-2,4,-3,9.5,{});
  m4_grid(f,1,1,true);
  var F=function(x){return x*x;},G=function(x){return -x*x+4*x+4;};
  if(p>0){ctx.globalAlpha=m4_ap(p,0,.6);m4_fill(f,G,F,1-Math.sqrt(3),1+Math.sqrt(3),GREEN,.22);ctx.globalAlpha=1;}
  m4_cv(f,F,-2,4,BLUE,3.2);m4_cv(f,G,-2,4,ORANGE,3.2);
  tag('f(x) = x²',f.X(-1.1),f.Y(8.9),BLUE_D,15);tag('g(x) = −(x − 2)² + 8',f.X(-.5),f.Y(7.5),DRED,15);
  if(p>0){var a=m4_ap(p,.3,1);ctx.globalAlpha=a;
   m4_pt(f,1-Math.sqrt(3),F(1-Math.sqrt(3)),RED,'1 − √3',-10,-16,5);m4_pt(f,1+Math.sqrt(3),F(1+Math.sqrt(3)),RED,'1 + √3',14,-16,5);
   LN(f.X(1),f.Y(1),f.X(1),f.Y(7),VIOLET,3.4);tag('6',f.X(1)+14,f.Y(4),VIO_D,16);ctx.globalAlpha=1;}
 }
]);
