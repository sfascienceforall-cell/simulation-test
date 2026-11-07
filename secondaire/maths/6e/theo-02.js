/* aides de dessin communes au cours de maths 6e (préfixe M6, définies une seule fois) */
window.M6=window.M6||(function(){
 var M={};
 M.pp=function(p){return (typeof cxE!=='undefined'&&ctx===cxE)?(p||0):0;};
 M.cl=function(v,a,b){return Math.max(a,Math.min(b,v));};
 M.seg=function(p,a,b){return M.cl((p-a)/(b-a),0,1);};
 M.f=function(v,d){return (+v).toFixed(d==null?0:d).replace('.',',').replace('-','−');};
 M.map=function(x0,x1,y0,y1,o){o=o||{};var L=o.l==null?38:o.l,R=o.r==null?16:o.r,T=o.t==null?18:o.t,B=o.b==null?28:o.b;
  var w=W-L-R,h=H-T-B;
  return {x0:x0,x1:x1,y0:y0,y1:y1,L:L,T:T,w:w,h:h,
   X:function(x){return L+(x-x0)/(x1-x0)*w;},Y:function(y){return T+h-(y-y0)/(y1-y0)*h;},
   ix:function(px){return x0+(px-L)/w*(x1-x0);},iy:function(py){return y0+(T+h-py)/h*(y1-y0);}};};
 M.axes=function(m,o){o=o||{};var ox=(m.x0<0&&m.x1>0)?m.X(0):m.L,oy=(m.y0<0&&m.y1>0)?m.Y(0):m.T+m.h;
  ctx.save();
  if(o.grid){ctx.strokeStyle='#eceef1';ctx.lineWidth=1;(o.xt||[]).forEach(function(v){var x=m.X(v);ctx.beginPath();ctx.moveTo(x,m.T);ctx.lineTo(x,m.T+m.h);ctx.stroke();});(o.yt||[]).forEach(function(v){var y=m.Y(v);ctx.beginPath();ctx.moveTo(m.L,y);ctx.lineTo(m.L+m.w,y);ctx.stroke();});}
  LN(m.L-4,oy,m.L+m.w+8,oy,AX,1.6);LN(ox,m.T+m.h+4,ox,m.T-8,AX,1.6);
  ctx.fillStyle=AX;ctx.beginPath();ctx.moveTo(m.L+m.w+12,oy);ctx.lineTo(m.L+m.w+4,oy-4);ctx.lineTo(m.L+m.w+4,oy+4);ctx.fill();
  ctx.beginPath();ctx.moveTo(ox,m.T-12);ctx.lineTo(ox-4,m.T-4);ctx.lineTo(ox+4,m.T-4);ctx.fill();
  (o.xt||[]).forEach(function(v){if(v===0&&o.nozero)return;var x=m.X(v);LN(x,oy-3,x,oy+3,GREY,1);TB(o.xf?o.xf(v):M.f(v,o.xd||0),x,oy+16,GREY,12);});
  (o.yt||[]).forEach(function(v){if(v===0)return;var y=m.Y(v);LN(ox-3,y,ox+3,y,GREY,1);TB(o.yf?o.yf(v):M.f(v,o.yd||0),ox-7,y+4,GREY,12,'right');});
  if(o.xl)TB(o.xl,m.L+m.w+6,oy-8,GREY,13,'right');
  if(o.yl)TB(o.yl,ox+8,m.T-4,GREY,13,'left');
  ctx.restore();};
 M.curve=function(m,f,a,b,col,w,dash){ctx.save();ctx.beginPath();ctx.rect(m.L-2,m.T-6,m.w+4,m.h+12);ctx.clip();ctx.strokeStyle=col||BLUE;ctx.lineWidth=w||2.6;ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);
  var n=Math.max(60,Math.round(m.w/2)),pen=false;ctx.beginPath();
  for(var i=0;i<=n;i++){var x=a+(b-a)*i/n,y=f(x);if(!isFinite(y)||Math.abs(y)>1e6){pen=false;continue;}var px=m.X(x),py=m.Y(y);if(!pen){ctx.moveTo(px,py);pen=true;}else ctx.lineTo(px,py);}
  ctx.stroke();ctx.restore();};
 M.fill=function(m,f,g,a,b,col){ctx.save();ctx.beginPath();ctx.rect(m.L-2,m.T-6,m.w+4,m.h+12);ctx.clip();var n=80,i,x;ctx.beginPath();
  for(i=0;i<=n;i++){x=a+(b-a)*i/n;var px=m.X(x),py=m.Y(f(x));i?ctx.lineTo(px,py):ctx.moveTo(px,py);}
  for(i=n;i>=0;i--){x=a+(b-a)*i/n;ctx.lineTo(m.X(x),m.Y(g?g(x):0));}
  ctx.closePath();ctx.fillStyle=col||'rgba(55,138,221,.25)';ctx.fill();ctx.restore();};
 M.pt=function(m,x,y,col,r){DOT(m.X(x),m.Y(y),r||5.5,col||RED);};
 M.ring=function(m,x,y,col,r){DOT(m.X(x),m.Y(y),r||6,col||INK,false);};
 M.vl=function(m,x,col,y0,y1,dash){var a=y0==null?m.y0:y0,b=y1==null?m.y1:y1;LN(m.X(x),m.Y(a),m.X(x),m.Y(b),col||GREY,1.5,dash||[5,4]);};
 M.hl=function(m,y,col,x0,x1,dash){var a=x0==null?m.x0:x0,b=x1==null?m.x1:x1;LN(m.X(a),m.Y(y),m.X(b),m.Y(y),col||GREY,1.5,dash||[5,4]);};
 M.line=function(m,x1,y1,x2,y2,col,w,dash){LN(m.X(x1),m.Y(y1),m.X(x2),m.Y(y2),col,w||2,dash);};
 M.tx=function(m,s,x,y,col,size,al){TB(s,m.X(x),m.Y(y),col||INK,size||14,al||'center');};
 /* grosse formule centrée, avec légende */
 M.big=function(s,y,col,size){TB(s,W*.5,y,col||BLUE_D,size||34);};
 /* projection oblique « cabinet » : x vers l'observateur (bas-gauche), y à droite, z en haut */
 M.cab=function(cx,cy,s,az){var a=az==null?.5:az;return function(x,y,z){return {x:cx+s*(y-x*.5*Math.cos(a+.2)),y:cy-s*(z-x*.38*Math.sin(a+.9))};};};
 /* projection 3D avec rotation autour de l'axe vertical (az) et inclinaison (el) ; z vers le haut */
 M.rot=function(cx,cy,s,az,el){var ca=Math.cos(az),sa=Math.sin(az),ce=Math.cos(el),se=Math.sin(el);
  return function(x,y,z){var u=x*ca-y*sa,v=x*sa+y*ca;return {x:cx+s*u,y:cy-s*(z*ce+v*se)};};};
 M.poly=function(pts,fill,stroke,w,dash){ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w||1.6;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}};
 M.L3=function(P,a,b,col,w,dash){var A=P(a[0],a[1],a[2]),B=P(b[0],b[1],b[2]);LN(A.x,A.y,B.x,B.y,col,w||2,dash);};
 M.ax3=function(P,len,col){[[1,0,0,'x'],[0,1,0,'y'],[0,0,1,'z']].forEach(function(u){var O=P(0,0,0),E=P(u[0]*len,u[1]*len,u[2]*len);arrow(O.x,O.y,E.x-O.x,E.y-O.y,col||AX,'',1.8);var q=P(u[0]*len*1.12,u[1]*len*1.12,u[2]*len*1.12);TB(u[3],q.x,q.y+4,GREY,13);});};
 /* plan donné par un point c et deux directions u, v (demi-tailles a, b) */
 M.plane=function(P,c,u,v,a,b,fill,stroke){var q=[[-1,-1],[1,-1],[1,1],[-1,1]].map(function(k){return P(c[0]+k[0]*a*u[0]+k[1]*b*v[0],c[1]+k[0]*a*u[1]+k[1]*b*v[1],c[2]+k[0]*a*u[2]+k[1]*b*v[2]);});M.poly(q,fill,stroke,1.6);};
 /* bulle d'étiquette */
 M.tag=function(s,x,y,col,size){tag(s,x,y,col||INK,size||13);};
 M.bell=function(z){return Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);};
 M.fact=function(n){var r=1;for(var i=2;i<=n;i++)r*=i;return r;};
 M.C=function(n,k){if(k<0||k>n)return 0;var r=1;for(var i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r);};
 M.binom=function(n,k,p){return M.C(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);};
 /* rectangle arrondi plein */
 M.box=function(x,y,w,h,fill,stroke,lw){ctx.beginPath();ctx.roundRect(x,y,w,h,6);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}};
 M.rgba=function(c,a){var h=c.replace('#','');return 'rgba('+parseInt(h.substr(0,2),16)+','+parseInt(h.substr(2,2),16)+','+parseInt(h.substr(4,2),16)+','+a+')';};
 return M;
})();
/* ===== Chapitre 2 : dérivation de e^x et ln x, étude de fonctions ===== */
(function(){
var R=SFA;
R.theo("c02",{
 icon:function(){
  var m=M6.map(-2.4,2.4,-.4,5.6,{l:10,r:W*.5,t:12,b:20});
  LN(m.L,m.Y(0),m.L+m.w,m.Y(0),AX,1.5);M6.curve(m,Math.exp,-2.4,1.75,BLUE,3.2);
  var a=1;M6.line(m,a-1.3,Math.E*(1-1.3),a+1.2,Math.E*(1+1.2),ORA2,2.2);M6.pt(m,a,Math.E,RED,6);
  TB('(eˣ)′ = eˣ',W*.76,H*.36,BLUE_D,26);TB('(ln x)′ = 1/x',W*.76,H*.6,DRED,26);TB('dériver · étudier',W*.76,H*.8,ORANGE,15);},
 anim:function(t){
  var s=.5-.5*Math.cos(t*.02),a=-1.4+3.0*s,ea=Math.exp(a),b=ea;
  var hw=W/2;
  var m1=M6.map(-2.5,2.2,-.8,6.2,{l:26,r:hw+8,t:34,b:22});
  var m2=M6.map(-.3,5.6,-2.4,2.6,{l:hw+26,r:14,t:34,b:22});
  TB('y = eˣ : pente = hauteur',m1.L+m1.w/2,20,BLUE_D,15);TB('y = ln x : pente = 1/x',m2.L+m2.w/2,20,DRED,15);
  M6.axes(m1,{xt:[-2,-1,1,2],yt:[1,2,3,4,5,6]});M6.axes(m2,{xt:[1,2,3,4,5],yt:[-2,-1,1,2]});
  M6.curve(m1,Math.exp,-2.5,2.2,BLUE,3);M6.curve(m2,Math.log,.02,5.6,RED,3);
  function tang(m,x0,y0,sl,col){var dx=1.3/Math.sqrt(1+sl*sl)*(m.x1-m.x0)/4,x1=x0-dx*1.6,x2=x0+dx*1.6;M6.line(m,x1,y0+sl*(x1-x0),x2,y0+sl*(x2-x0),col,2.4);}
  tang(m1,a,ea,ea,ORA2);tang(m2,b,a,1/b,ORA2);
  M6.pt(m1,a,ea,BLUE_D,6.5);M6.pt(m2,b,a,DRED,6.5);
  M6.vl(m1,a,GREY,0,ea,[3,3]);M6.hl(m1,ea,GREY,m1.x0,a,[3,3]);
  M6.vl(m2,b,GREY,m2.y0,a,[3,3]);M6.hl(m2,a,GREY,0,b,[3,3]);
  TB('pente = eᵃ = '+M6.f(ea,2),m1.X(-2.4),m1.Y(5.5),ORANGE,15,'left');
  TB('pente = 1/'+M6.f(b,2)+' = '+M6.f(1/b,2),m2.X(.7),m2.Y(2.15),ORANGE,15,'left');
  TB('les deux pentes sont inverses : symétrie par rapport à y = x',W/2,H-6,GREY,13);},
 th:'<div class="tcard"><b class="h">Dérivées à connaître</b><p>(eˣ)′ = eˣ &nbsp;·&nbsp; (aˣ)′ = aˣ·ln a &nbsp;·&nbsp; (ln x)′ = 1/x (x &gt; 0) &nbsp;·&nbsp; (log<sub>a</sub> x)′ = 1/(x·ln a).</p><p><b>Fonctions composées</b> : (e<sup>u</sup>)′ = u′·e<sup>u</sup> et (ln u)′ = u′/u (là où u &gt; 0). Plus généralement (f∘u)′ = u′·(f′∘u).</p><p><b>Exemples.</b> (e<sup>2x</sup>)′ = 2e<sup>2x</sup> ; (e<sup>−x²</sup>)′ = −2x·e<sup>−x²</sup> ; (ln(x² + 1))′ = 2x/(x² + 1) ; (x·ln x − x)′ = ln x + 1 − 1 = ln x. <b>Piège</b> : (e<sup>2x</sup>)′ n\'est pas 2x·e<sup>2x−1</sup> (c\'est la règle des puissances, pas celle de l\'exponentielle).</p></div>'+
 '<div class="tcard"><b class="h">Limites et croissances comparées</b><p>lim<sub>x→−∞</sub> eˣ = 0 ; lim<sub>x→+∞</sub> eˣ = +∞ ; lim<sub>x→0⁺</sub> ln x = −∞ ; lim<sub>x→+∞</sub> ln x = +∞.</p><p><b>Croissances comparées</b> (n entier ≥ 1) : lim<sub>x→+∞</sub> eˣ/xⁿ = +∞ ; lim<sub>x→+∞</sub> xⁿ·e<sup>−x</sup> = 0 ; lim<sub>x→+∞</sub> (ln x)/xⁿ = 0 ; lim<sub>x→0⁺</sub> x·ln x = 0. Retiens : « l\'exponentielle l\'emporte sur toute puissance, toute puissance l\'emporte sur le logarithme ».</p><p><b>Exemple.</b> lim<sub>x→+∞</sub> (x³ − eˣ) = −∞, car eˣ finit toujours par dépasser x³ (à partir de x ≈ 4,5). Quand on tombe sur +∞ − ∞, on met le terme dominant en facteur.</p></div>'+
 '<div class="tcard"><b class="h">Méthode : étude complète d\'une fonction</b><p>1) Domaine. 2) Limites aux bornes, <b>asymptotes</b> (verticales, horizontales, obliques). 3) Dérivée f′ et son signe. 4) Tableau de variation, extremums. 5) (6 h : dérivée seconde, concavité, points d\'inflexion.) 6) Quelques points, tangentes y = f(a) + f′(a)(x − a), graphe.</p><p><b>Exemple chiffré.</b> f(x) = x²·e<sup>−x</sup>. f′(x) = (2x − x²)e<sup>−x</sup> = x(2 − x)e<sup>−x</sup>, du signe de x(2 − x). f décroît sur ]−∞ ; 0], croît sur [0 ; 2], décroît sur [2 ; +∞[. Minimum f(0) = 0, maximum f(2) = 4/e² ≈ 0,541. En +∞, f → 0 : asymptote y = 0.</p></div>'+
 '<div class="tcard"><b class="h">L\'équation y′ = k·y et ses modèles</b><p>Si la vitesse de variation est proportionnelle à la quantité (y′ = ky), alors y(t) = y₀·e<sup>kt</sup> : croissance si k &gt; 0, décroissance si k &lt; 0. Cela explique les modèles de population, de désintégration radioactive, d\'intérêts continus.</p><p><b>Modèle logistique</b> : y′ = k·y·(1 − y/M). La courbe est en « S », tend vers M, et la vitesse est maximale pour y = M/2 (point d\'inflexion).</p><p><b>Exemple chiffré.</b> Une population passe de 1 000 à 1 500 en 2 h : e<sup>2k</sup> = 1,5, donc k = ln 1,5 / 2 ≈ 0,203 h⁻¹. Après 6 h : y = 1 000·1,5³ = 3 375.</p></div>'
});

R.figs("c02",[
 /* 0 : derivee de e^(2x) */
 function(p){p=M6.pp(p);var m=M6.map(-2,1.2,-1,8,{l:30,b:30});M6.axes(m,{xt:[-2,-1,1],yt:[2,4,6,8],grid:true});
  M6.curve(m,function(x){return Math.exp(2*x);},-2,1.2,BLUE,3.2);TB('f(x) = e^(2x)',m.X(-1.9),m.Y(5.2),BLUE_D,16,'left');M6.pt(m,0,1,BLUE_D,6);
  var a=M6.seg(p,0,.6);if(a>0){ctx.globalAlpha=a;M6.curve(m,function(x){return 2*Math.exp(2*x);},-2,1.2,RED,3,[7,4]);TB("f ′(x) = 2e^(2x)",m.X(-.15),m.Y(7.4),DRED,16,'right');
   M6.line(m,-.6,1-1.2,.7,1+1.4,ORA2,2.2);TB('pente 2 en x = 0',m.X(.1),m.Y(-.5),ORANGE,14,'left');ctx.globalAlpha=1;}},
 /* 1 : 3e^x - x^2 */
 function(p){p=M6.pp(p);var f=function(x){return 3*Math.exp(x)-x*x;};var m=M6.map(-2.5,1.8,-4,14,{l:30,b:30});M6.axes(m,{xt:[-2,-1,1],yt:[-3,3,6,9,12],grid:true});
  M6.curve(m,f,-2.5,1.8,BLUE,3.2);TB('f(x) = 3eˣ − x²',m.X(-2.4),m.Y(11),BLUE_D,16,'left');M6.pt(m,0,3,BLUE_D,6);
  var a=M6.seg(p,0,.6);if(a>0){ctx.globalAlpha=a;M6.line(m,-1.2,3-3.6,1.1,3+3.3,ORA2,2.4);TB("f ′(x) = 3eˣ − 2x",m.X(-.4),m.Y(-3),DRED,16,'left');TB("f ′(0) = 3",m.X(.15),m.Y(5.6),ORANGE,17,'left');ctx.globalAlpha=1;}},
 /* 2 : ln(x^2+1) */
 function(p){p=M6.pp(p);var m=M6.map(-4.5,4.5,-1.6,3.4,{l:30,b:30});M6.axes(m,{xt:[-4,-3,-2,-1,1,2,3,4],yt:[-1,1,2,3],grid:true});
  M6.curve(m,function(x){return Math.log(x*x+1);},-4.5,4.5,BLUE,3.2);TB('g(x) = ln(x² + 1)',m.X(1.6),m.Y(3.1),BLUE_D,16,'left');
  var a=M6.seg(p,0,.6);if(a>0){ctx.globalAlpha=a;M6.curve(m,function(x){return 2*x/(x*x+1);},-4.5,4.5,RED,3,[7,4]);TB("g ′(x) = 2x / (x² + 1)",m.X(-4.4),m.Y(-1.15),DRED,16,'left');
   ctx.strokeStyle=GREEN;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(m.L,m.Y(-1.45));ctx.lineTo(m.L+m.w,m.Y(-1.45));ctx.stroke();TB('D = ℝ',m.X(3.6),m.Y(-1.2),DGREEN,16);ctx.globalAlpha=1;}},
 /* 3 : x ln x - x */
 function(p){p=M6.pp(p);var m=M6.map(-.2,5.2,-2,3.6,{l:30,b:30});M6.axes(m,{xt:[1,2,3,4,5],yt:[-1,1,2,3],grid:true});
  M6.curve(m,function(x){return x*Math.log(x)-x;},.0001,5.2,BLUE,3.2);TB('h(x) = x ln x − x',m.X(2.9),m.Y(.6),BLUE_D,16,'left');
  var a=M6.seg(p,0,.6);if(a>0){ctx.globalAlpha=a;M6.curve(m,Math.log,.0001,5.2,RED,3,[7,4]);TB("h ′(x) = ln x",m.X(3.6),m.Y(2.1),DRED,16,'left');M6.pt(m,1,-1,GREEN,7);TB('h′(1) = 0 : minimum h(1) = −1',m.X(1.15),m.Y(-1.55),DGREEN,14,'left');ctx.globalAlpha=1;}},
 /* 4 : croissances comparees */
 function(p){p=M6.pp(p);var m=M6.map(0,8,-100,1500,{l:46,b:30});M6.axes(m,{xt:[0,1,2,3,4,5,6,7,8],yt:[500,1000,1500],grid:true});
  M6.curve(m,Math.exp,0,8,BLUE,3.2);M6.curve(m,function(x){return x*x*x;},0,8,ORA2,3.2);TB('eˣ',m.X(7.2),m.Y(1250),BLUE_D,18);TB('x³',m.X(7.6),m.Y(470),DRED,18);
  M6.pt(m,4.536,Math.pow(4.536,3),GREY,5);M6.pt(m,1.857,Math.pow(1.857,3),GREY,5);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.fill(m,Math.exp,function(x){return x*x*x;},4.536,8,'rgba(55,138,221,.2)');TB('eˣ > x³',m.X(6.2),m.Y(150)-0,BLUE_D,15);TB('x³ − eˣ → −∞',m.X(.4),m.Y(1250),DGREEN,18,'left');TB('dès x ≈ 4,5',m.X(4.7),m.Y(-70),DGREEN,14,'left');ctx.globalAlpha=1;}},
 /* 5 : tangente a ln en e */
 function(p){p=M6.pp(p);var m=M6.map(-.5,6,-1.6,2.6,{l:30,b:30});M6.axes(m,{xt:[1,2,3,4,5],yt:[-1,1,2],grid:true});
  M6.curve(m,Math.log,.001,6,BLUE,3.2);TB('f(x) = ln x',m.X(4.7),m.Y(2.0),BLUE_D,16,'left');M6.pt(m,Math.E,1,BLUE_D,6);TB('(e ; 1)',m.X(Math.E)+8,m.Y(1)+22,BLUE_D,15,'left');
  M6.vl(m,Math.E,GREY,0,1,[3,3]);TB('e',m.X(Math.E),m.Y(0)+15,GREY,13);
  var a=M6.seg(p,0,.7);if(a>0){var x2=6*a;M6.line(m,0,0,x2,x2/Math.E,ORA2,2.6);if(a>.9){TB('y = x/e',m.X(1.5),m.Y(.5),ORANGE,17,'left');M6.pt(m,0,0,GREEN,7);TB('passe par O',m.X(.15),m.Y(-.5),DGREEN,15,'left');}}},
 /* 6 : x^2 e^-x */
 function(p){p=M6.pp(p);var f=function(x){return x*x*Math.exp(-x);};var m=M6.map(-1.2,7.5,-.5,2.9,{l:30,b:30});M6.axes(m,{xt:[-1,1,2,3,4,5,6,7],yt:[1,2],grid:true});
  M6.curve(m,f,-1.2,7.5,BLUE,3.2);TB('f(x) = x²·e⁻ˣ',m.X(-1.1),m.Y(2.55),BLUE_D,16,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.curve(m,f,-1.2,0,RED,4.6);M6.curve(m,f,0,2,GREEN,4.6);M6.curve(m,f,2,7.5,RED,4.6);M6.pt(m,0,0,DGREEN,7);M6.pt(m,2,f(2),DGREEN,7);
   TB('min f(0) = 0',m.X(.15),m.Y(-.33),DGREEN,15,'left');TB('max f(2) = 4/e² ≈ 0,54',m.X(2.2),m.Y(.95),DGREEN,15,'left');M6.hl(m,0,ORANGE,2,7.5,[2,3]);TB('y = 0',m.X(7.4),m.Y(.25),ORANGE,14,'right');ctx.globalAlpha=1;}},
 /* 7 : population y' = ky */
 function(p){p=M6.pp(p);var f=function(t){return 1000*Math.pow(1.5,t/2);};var m=M6.map(0,6.8,0,3900,{l:46,b:30});M6.axes(m,{xt:[0,1,2,3,4,5,6],yt:[1000,2000,3000],grid:true,xl:'t (h)'});
  M6.curve(m,f,0,6.8,BLUE,3.2);M6.pt(m,0,1000,BLUE_D,6);M6.pt(m,2,1500,BLUE_D,6);TB('1 000',m.X(.15),m.Y(1000)-12,BLUE_D,14,'left');TB('1 500',m.X(2)+8,m.Y(1500)+22,BLUE_D,14,'left');TB("y ′ = k·y",m.X(.3),m.Y(3400),INK,18,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.pt(m,4,2250,GREEN,6);M6.pt(m,6,3375,GREEN,7.5);TB('2 250',m.X(4)-8,m.Y(2250)-8,DGREEN,14,'right');TB('3 375 à 6 h',m.X(6)-8,m.Y(3375)-12,DGREEN,16,'right');
   [0,2,4].forEach(function(t){var y1=f(t),y2=f(t+2);TB('×1,5',m.X(t+1),m.Y((y1+y2)/2)+ (t==0?30:34),ORANGE,14);});ctx.globalAlpha=1;}},
 /* 8 : e^pi ou pi^e */
 function(p){p=M6.pp(p);var f=function(x){return Math.log(x)/x;};var m=M6.map(1.4,6.4,.24,.39,{l:46,b:30});M6.axes(m,{xt:[2,3,4,5,6],yt:[.25,.3,.35],grid:true,yd:2});
  M6.curve(m,f,1.4,6.4,BLUE,3.2);TB('f(x) = ln x / x',m.X(4.4),m.Y(.37),BLUE_D,16,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.pt(m,Math.E,f(Math.E),GREEN,7.5);M6.pt(m,Math.PI,f(Math.PI),ORA2,7.5);M6.hl(m,f(Math.E),GREEN,m.x0,Math.E,[4,3]);M6.hl(m,f(Math.PI),ORA2,m.x0,Math.PI,[4,3]);
   M6.vl(m,Math.E,GREEN,m.y0,f(Math.E),[3,3]);M6.vl(m,Math.PI,ORA2,m.y0,f(Math.PI),[3,3]);TB('e',m.X(Math.E)-9,m.Y(.25),DGREEN,16,'right');TB('π',m.X(Math.PI)+9,m.Y(.25),DRED,16,'left');
   TB('f(e) = 1/e ≈ 0,368 > f(π) ≈ 0,364',m.X(5.0),m.Y(.275),DGREEN,15);TB('donc e^π > π^e',m.X(5.0),m.Y(.255),DRED,17);ctx.globalAlpha=1;}},
 /* 9 : logistique */
 function(p){p=M6.pp(p);var f=function(t){return 100/(1+9*Math.exp(-.5*t));};var m=M6.map(0,14,-8,115,{l:46,b:30});M6.axes(m,{xt:[0,2,4,6,8,10,12,14],yt:[25,50,75,100],grid:true,xl:'t (ans)'});
  M6.curve(m,f,0,14,BLUE,3.2);M6.pt(m,0,10,BLUE_D,6);TB('y(0) = 10',m.X(.3),m.Y(10)-12,BLUE_D,15,'left');TB('y = 100/(1 + 9e^(−0,5t))',m.X(8.2),m.Y(35),BLUE_D,15,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.hl(m,100,ORA2,0,14);TB('limite 100',m.X(13.8),m.Y(105),DRED,15,'right');var t0=2*Math.log(9);M6.hl(m,50,GREEN,0,t0,[4,3]);M6.vl(m,t0,GREEN,-8,50,[4,3]);M6.pt(m,t0,50,GREEN,8);
   TB('t ≈ 4,39 : y = 50, vitesse max 12,5',m.X(t0)+10,m.Y(50)+22,DGREEN,15,'left');ctx.globalAlpha=1;}}
]);
})();
