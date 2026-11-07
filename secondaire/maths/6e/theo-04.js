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
/* ===== Chapitre 4 : intégrale définie, aires et volumes ===== */
(function(){
var R=SFA;
var BL='rgba(55,138,221,.28)',GR='rgba(29,158,117,.28)',RD='rgba(226,75,74,.28)';
function base(x0,x1,y0,y1,xt,yt,o){o=o||{};var m=M6.map(x0,x1,y0,y1,{l:o.l||34,b:30});M6.axes(m,{xt:xt,yt:yt,grid:true,xd:o.xd||0,yd:o.yd||0});return m;}

R.theo("c04",{
 icon:function(){
  var m=M6.map(-.3,3.2,-.4,4.2,{l:10,r:W*.5,t:14,b:26});LN(m.L,m.Y(0),m.L+m.w,m.Y(0),AX,1.5);
  var f=function(x){return .3+x*x*.38;};M6.fill(m,f,null,.5,2.5,'rgba(55,138,221,.3)');M6.curve(m,f,-.3,3.2,BLUE,3.2);
  M6.vl(m,.5,BLUE,0,f(.5),[4,3]);M6.vl(m,2.5,BLUE,0,f(2.5),[4,3]);TB('a',m.X(.5),m.Y(0)+16,GREY,14);TB('b',m.X(2.5),m.Y(0)+16,GREY,14);
  TB('∫ₐᵇ f(x) dx',W*.76,H*.4,BLUE_D,28);TB('= F(b) − F(a)',W*.76,H*.6,ORANGE,24);TB('aires · volumes',W*.76,H*.8,GREY,15);},
 anim:function(t){
  var u=Math.min(W*.62,H*2.1);var m=M6.map(-.2,2.4,-.35,4.7,{l:28,r:W-28-u,t:14,b:26});
  var phase=Math.floor(t/110)%6,ns=[2,4,8,16,32,64],n=ns[phase],f=function(x){return x*x;};
  var loc=(t%110)/110,grow=Math.min(1,loc*3);
  M6.axes(m,{xt:[1,2],yt:[1,2,3,4],grid:true});
  var dx=2/n,S=0,i;
  for(i=0;i<n;i++){var x=i*dx,h=f(x);S+=h*dx;var hh=h*grow,px=m.X(x),py=m.Y(hh),pw=m.X(x+dx)-m.X(x);
   ctx.fillStyle='rgba(55,138,221,.30)';ctx.strokeStyle=BLUE;ctx.lineWidth=n>16?.8:1.4;ctx.beginPath();ctx.rect(px,py,pw,m.Y(0)-py);ctx.fill();ctx.stroke();}
  M6.curve(m,f,-.2,2.4,ORA2,3.2);TB('f(x) = x²',m.X(1.2),m.Y(4.35),DRED,16,'left');
  var tx=m.L+m.w+30;
  TB('Somme de rectangles',tx,40,BLUE_D,19,'left');TB('n = '+n+' rectangles',tx,78,INK,18,'left');
  TB('Σ f(xᵢ)·Δx = '+M6.f(S,3),tx,110,BLUE_D,18,'left');
  TB('Quand n augmente, la somme',tx,160,GREY,15,'left');TB('tend vers l\'intégrale :',tx,180,GREY,15,'left');
  TB('∫₀² x² dx = [x³/3]₀² = 8/3',tx,222,DRED,18,'left');TB('≈ '+M6.f(8/3,3),tx,250,DRED,18,'left');
  TB('écart : '+M6.f(8/3-S,3),tx,282,ORANGE,15,'left');},
 th:'<div class="tcard"><b class="h">L\'intégrale définie comme aire algébrique</b><p>Pour f continue sur [a ; b], l\'intégrale ∫<sub>a</sub><sup>b</sup> f(x) dx est la limite des sommes de rectangles Σ f(xᵢ)·Δx quand leur nombre tend vers l\'infini. C\'est une <b>aire algébrique</b> : comptée positivement là où f ≥ 0, <b>négativement</b> là où f ≤ 0. L\'<b>aire géométrique</b> du domaine entre la courbe et l\'axe vaut ∫<sub>a</sub><sup>b</sup> |f(x)| dx : il faut découper aux zéros de f.</p></div>'+
 '<div class="tcard"><b class="h">Calcul par une primitive et propriétés</b><p><b>Formule fondamentale</b> : ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) = [F(x)]<sub>a</sub><sup>b</sup>, où F′ = f.</p><p>Propriétés : linéarité ∫(αf + βg) = α∫f + β∫g ; <b>Chasles</b> ∫<sub>a</sub><sup>c</sup> f = ∫<sub>a</sub><sup>b</sup> f + ∫<sub>b</sub><sup>c</sup> f ; ∫<sub>b</sub><sup>a</sup> f = −∫<sub>a</sub><sup>b</sup> f ; ∫<sub>a</sub><sup>a</sup> f = 0 ; si f ≥ 0 sur [a ; b] et a ≤ b, alors ∫ f ≥ 0.</p><p><b>Exemple chiffré.</b> ∫<sub>0</sub><sup>2</sup> (3x² + 1) dx = [x³ + x]<sub>0</sub><sup>2</sup> = (8 + 2) − 0 = 10. (6 h) Le théorème fondamental : G(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt est dérivable et G′ = f.</p></div>'+
 '<div class="tcard"><b class="h">Aire entre deux courbes</b><p>Si f ≥ g sur [a ; b], l\'aire du domaine limité par les deux courbes vaut ∫<sub>a</sub><sup>b</sup> (f(x) − g(x)) dx. <b>Méthode</b> : 1) trouver les abscisses d\'intersection (f = g) ; 2) déterminer quelle courbe est au-dessus ; 3) intégrer la différence.</p><p><b>Exemple chiffré.</b> f(x) = x² et g(x) = 2x se coupent en 0 et 2, et 2x ≥ x² sur [0 ; 2] : A = ∫<sub>0</sub><sup>2</sup> (2x − x²) dx = [x² − x³/3]<sub>0</sub><sup>2</sup> = 4 − 8/3 = 4/3.</p><p><b>Aire et signe.</b> ∫<sub>0</sub><sup>3</sup> (x² − 4) dx = −3, mais l\'aire géométrique vaut ∫<sub>0</sub><sup>2</sup> (4 − x²) dx + ∫<sub>2</sub><sup>3</sup> (x² − 4) dx = 16/3 + 7/3 = 23/3 ≈ 7,67.</p></div>'+
 '<div class="tcard"><b class="h">Valeur moyenne et volume de révolution</b><p><b>Valeur moyenne</b> de f sur [a ; b] : μ = (1/(b − a))·∫<sub>a</sub><sup>b</sup> f(x) dx. C\'est la hauteur du rectangle de base [a ; b] qui a la même aire que le domaine sous la courbe. Exemple : x² sur [0 ; 3] : μ = (1/3)·9 = 3.</p><p><b>Volume de révolution</b> : en faisant tourner autour de l\'axe des x la région sous la courbe de f ≥ 0 entre a et b, on obtient V = π·∫<sub>a</sub><sup>b</sup> [f(x)]² dx (somme de disques de rayon f(x)). Exemple : f(x) = √x sur [0 ; 4] : V = π·∫<sub>0</sub><sup>4</sup> x dx = π·[x²/2]<sub>0</sub><sup>4</sup> = 8π. <b>Piège</b> : ne pas oublier le carré ni le facteur π.</p><p><b>Intervalle infini</b> : ∫<sub>0</sub><sup>b</sup> x·e<sup>−x</sup> dx = 1 − (b + 1)e<sup>−b</sup> → 1 quand b → +∞ : une aire peut rester finie.</p></div>'
});

R.figs("c04",[
 /* 0 : int_0^2 (3x^2+1) */
 function(p){p=M6.pp(p);var f=function(x){return 3*x*x+1;};var m=base(-.4,2.8,-2,17,[1,2],[5,10,15]);
  M6.vl(m,0,GREY,0,13,[4,3]);M6.vl(m,2,GREY,0,13,[4,3]);var a=M6.seg(p,0,.7);if(a>0){M6.fill(m,f,null,0,2*a,BL);}
  M6.curve(m,f,-.4,2.8,ORA2,3.4);TB('f(x) = 3x² + 1',m.X(-.3),m.Y(15.2),DRED,16,'left');TB('a = 0',m.X(0),m.Y(0)+16,GREY,13);TB('b = 2',m.X(2),m.Y(0)+16,GREY,13);
  if(a>.9){TB('[x³ + x]₀² = 10',m.X(1.0),m.Y(3.2),BLUE_D,18);}},
 /* 1 : int_1^e 1/x */
 function(p){p=M6.pp(p);var f=function(x){return 1/x;};var m=base(-.2,3.6,-.6,3.2,[1,2,3],[1,2,3]);
  M6.vl(m,1,GREY,0,1,[4,3]);M6.vl(m,Math.E,GREY,0,1/Math.E,[4,3]);var a=M6.seg(p,0,.7);if(a>0){M6.fill(m,f,null,1,1+(Math.E-1)*a,BL);}
  M6.curve(m,f,.28,3.6,ORA2,3.4);TB('f(x) = 1/x',m.X(1.9),m.Y(2.1),DRED,16,'left');TB('1',m.X(1),m.Y(0)+16,GREY,13);TB('e',m.X(Math.E),m.Y(0)+16,GREY,13);
  if(a>.9)TB('[ln x]₁ᵉ = 1 − 0 = 1',m.X(1.9),m.Y(.28),BLUE_D,17);},
 /* 2 : sinus sur une période */
 function(p){p=M6.pp(p);var m=M6.map(-.4,6.9,-1.7,1.9,{l:30,b:30});M6.axes(m,{xt:[1,2,3,4,5,6],yt:[-1,1],grid:true});
  var a=M6.seg(p,0,.7);if(a>0){M6.fill(m,Math.sin,null,0,Math.PI*Math.min(1,a*1.4),BL);if(a>.5)M6.fill(m,Math.sin,null,Math.PI,Math.PI+Math.PI*M6.seg(a,.5,1),RD);}
  M6.curve(m,Math.sin,-.4,6.9,ORA2,3.4);TB('f(x) = sin x',m.X(-.3),m.Y(1.5),DRED,16,'left');TB('π',m.X(Math.PI),m.Y(0)+16,GREY,13);TB('2π',m.X(2*Math.PI),m.Y(0)+16,GREY,13);
  if(a>.95){TB('+2',m.X(Math.PI/2),m.Y(.3),BLUE_D,20);TB('−2',m.X(1.5*Math.PI),m.Y(-.3),DRED,20);TB('∫ de 0 à 2π = 0 ; aire géométrique = 4',m.X(3.3),m.Y(-1.45),DGREEN,15);}},
 /* 3 : proprietes (diagramme d'intervalles) */
 function(p){p=M6.pp(p);var L=W*.08,Rr=W*.92,X=function(v){return L+(Rr-L)*v/5;};var y0=H*.72;
  LN(L-8,y0,Rr+8,y0,AX,2);[0,3,5].forEach(function(v){LN(X(v),y0-5,X(v),y0+5,INK,2);TB(String(v),X(v),y0+22,INK,15);});
  function bar(a,b,y,col,lab,val){ctx.fillStyle=col+'33';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(X(a),y,X(b)-X(a),H*.1,5);ctx.fill();ctx.stroke();TB(lab,(X(a)+X(b))/2,y+H*.072,dk(col),Math.round(H*.052));}
  bar(0,5,H*.1,BLUE,'∫₀⁵ f = 8');bar(0,3,H*.26,GREEN,'∫₀³ f = 5');
  var a=M6.seg(p,0,.5);ctx.globalAlpha=.35+.65*a;bar(3,5,H*.26,ORA2,a>0?'∫₃⁵ f = 3':'∫₃⁵ f = ?');ctx.globalAlpha=1;
  TB('Chasles',W*.5,H*.5,GREY,Math.round(H*.05));
  var b=M6.seg(p,.5,1);if(b>0){ctx.globalAlpha=b;TB('∫₀⁵ (2f − 3g) = 2·8 − 3·(−2) = 22',W*.5,H*.86,DGREEN,Math.round(H*.052));TB('∫₅⁰ f = −8',W*.5,H*.95,DRED,Math.round(H*.052));ctx.globalAlpha=1;}},
 /* 4 : aire entre parabole et droite */
 function(p){p=M6.pp(p);var m=base(-.6,3,-1,5,[1,2],[1,2,3,4]);var f=function(x){return x*x;},g=function(x){return 2*x;};
  var a=M6.seg(p,0,.7);if(a>0)M6.fill(m,g,f,0,2*a,GR);
  M6.curve(m,f,-.6,2.3,BLUE,3.4);M6.curve(m,g,-.6,2.6,ORA2,3.4);TB('x²',m.X(2.15),m.Y(4.9),BLUE_D,18);TB('2x',m.X(2.6),m.Y(4.1),DRED,18);
  M6.pt(m,0,0,INK,5.5);M6.pt(m,2,4,INK,5.5);if(a>.85){TB('A = ∫₀² (2x − x²) dx = 4/3',m.X(.75),m.Y(-.65),DGREEN,16,'left');}},
 /* 5 : valeur moyenne de x^2 sur [0;3] */
 function(p){p=M6.pp(p);var f=function(x){return x*x;};var m=base(-.5,3.8,-1.2,10.5,[1,2,3],[3,6,9]);
  M6.fill(m,f,null,0,3,'rgba(55,138,221,.18)');M6.vl(m,3,GREY,0,9,[4,3]);M6.curve(m,f,-.5,3.5,ORA2,3.4);TB('f(x) = x²',m.X(-.4),m.Y(9.6),DRED,16,'left');TB('∫₀³ x² dx = 9',m.X(1.2),m.Y(1.7),BLUE_D,15);
  var a=M6.seg(p,0,.7);if(a>0){ctx.strokeStyle=GREEN;ctx.lineWidth=3;ctx.fillStyle='rgba(29,158,117,.16)';ctx.beginPath();ctx.rect(m.X(0),m.Y(3*a),m.X(3)-m.X(0),m.Y(0)-m.Y(3*a));ctx.fill();ctx.stroke();
   if(a>.9){TB('μ = 9 / 3 = 3',m.X(3.05),m.Y(3)-8,DGREEN,17,'left');}}},
 /* 6 : x^2 - 4 */
 function(p){p=M6.pp(p);var f=function(x){return x*x-4;};var m=base(-.6,3.6,-5.4,6,[1,2,3],[-4,-2,2,4]);
  var a=M6.seg(p,0,.7);if(a>0){M6.fill(m,f,null,0,2*Math.min(1,a*1.5),RD);if(a>.5)M6.fill(m,f,null,2,2+M6.seg(a,.5,1),GR);}
  M6.vl(m,3,GREY,0,5,[4,3]);M6.curve(m,f,-.6,3.6,ORA2,3.4);TB('f(x) = x² − 4',m.X(-.5),m.Y(5.2),DRED,16,'left');
  if(a>.95){TB('−16/3',m.X(1),m.Y(-1.2),DRED,17);TB('+7/3',m.X(2.6),m.Y(.8),DGREEN,17);TB('∫ = −3 ; aire = 23/3',m.X(3.5),m.Y(-4.6),INK,16,'right');}},
 /* 7 : volume de revolution */
 function(p){p=M6.pp(p);var m=M6.map(-.5,5.4,-3.2,3.2,{l:30,b:20,t:20});M6.axes(m,{xt:[1,2,3,4],yt:[],grid:false});
  var f=Math.sqrt,a=M6.seg(p,0,.7);M6.fill(m,f,null,0,4,'rgba(55,138,221,.28)');
  if(a>0){ctx.globalAlpha=a;M6.fill(m,function(x){return -f(x);},null,0,4,'rgba(55,138,221,.16)');
   for(var i=1;i<=9;i++){var x=i*.4,r=f(x);ctx.strokeStyle=BLUE_D+'';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(m.X(x),m.Y(0),(m.X(.5)-m.X(0))*.12,(m.Y(0)-m.Y(r)),0,0,7);ctx.stroke();}
   M6.curve(m,function(x){return -f(x);},0,4,BLUE_D,2.6);ctx.globalAlpha=1;}
  M6.curve(m,f,0,4,ORA2,3.4);M6.vl(m,4,GREY,-2,2,[4,3]);TB('f(x) = √x',m.X(.3),m.Y(2.55),DRED,16,'left');TB('x = 4',m.X(4),m.Y(-2.4),GREY,14);
  if(a>.9)TB('V = π ∫₀⁴ x dx = 8π',m.X(2.9),m.Y(-2.85),DGREEN,18,'left');},
 /* 8 : x e^-x sur intervalle infini */
 function(p){p=M6.pp(p);var f=function(x){return x*Math.exp(-x);},A=function(b){return 1-(b+1)*Math.exp(-b);};var m=base(-.4,8.4,-.12,1.25,[1,2,3,4,5,6,7,8],[.5,1],{yd:1});
  var a=M6.seg(p,0,.6);if(a>0){M6.fill(m,f,null,0,5*a,BL);}
  M6.curve(m,f,-.4,8.4,ORA2,3.4);TB('f(x) = x·e⁻ˣ',m.X(2.3),m.Y(.4),DRED,16,'left');
  var b=M6.seg(p,.3,1);if(b>0){ctx.globalAlpha=b;M6.curve(m,A,0,8.4,BLUE,3.4);M6.hl(m,1,GREEN,0,8.4);TB('A(b) → 1',m.X(8.3),m.Y(1)-9,DGREEN,16,'right');M6.pt(m,5,A(5),BLUE_D,6.5);TB('A(5) ≈ 0,9596',m.X(5)-6,m.Y(A(5))+24,BLUE_D,15,'right');ctx.globalAlpha=1;}},
 /* 9 : aire et valeur moyenne de ln */
 function(p){p=M6.pp(p);var m=base(-.2,3.4,-1.3,1.7,[1,2,3],[-1,1],{});
  var a=M6.seg(p,0,.7);if(a>0){M6.fill(m,Math.log,null,1,1+(Math.E-1)*a,BL);}
  M6.curve(m,Math.log,.04,3.4,ORA2,3.4);TB('ln x',m.X(3.1),m.Y(1.35),DRED,17);M6.vl(m,Math.E,GREY,0,1,[4,3]);TB('e',m.X(Math.E),m.Y(0)+16,GREY,13);TB('1',m.X(1),m.Y(0)+16,GREY,13);
  var b=M6.seg(p,.3,1);if(b>0){ctx.globalAlpha=b;TB('aire sous ln de 1 à e = 1',m.X(1.5),m.Y(-.7),BLUE_D,16,'left');M6.hl(m,1/(Math.E-1),GREEN,1,Math.E,[6,3]);TB('valeur moyenne ≈ 0,582',m.X(.2),m.Y(.9),DGREEN,15,'left');ctx.globalAlpha=1;}}
]);
})();
