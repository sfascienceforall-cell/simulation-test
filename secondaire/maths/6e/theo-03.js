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
/* ===== Chapitre 3 : primitives ===== */
(function(){
var R=SFA;
/* fabrique de devanture : f (orange) toujours visible, la primitive F (bleu) apparaît avec p */
function gen(o){return function(p){p=M6.pp(p);var m=M6.map(o.x0,o.x1,o.y0,o.y1,{l:o.l||34,b:30,t:o.t||18});
  M6.axes(m,{xt:o.xt,yt:o.yt,grid:true,xd:o.xd||0,yd:o.yd||0,xl:o.xl,yl:o.yl});
  if(o.pre)o.pre(m);
  M6.curve(m,o.f,o.fa==null?o.x0:o.fa,o.fb==null?o.x1:o.fb,ORA2,3.2);TB(o.fl,m.X(o.flx),m.Y(o.fly),DRED,16,o.fal||'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;
   if(o.fam)o.fam.forEach(function(c){M6.curve(m,function(x){return o.F(x)+c;},o.Fa==null?o.x0:o.Fa,o.Fb==null?o.x1:o.Fb,BLUE+'55',2,[6,4]);});
   if(o.F)M6.curve(m,o.F,o.Fa==null?o.x0:o.Fa,o.Fb==null?o.x1:o.Fb,BLUE,3.4);
   if(o.Fl)TB(o.Fl,m.X(o.Flx),m.Y(o.Fly),BLUE_D,16,o.Fal||'left');
   if(o.post)o.post(m);ctx.globalAlpha=1;}
  if(o.show)o.show(m);};}

R.theo("c03",{
 icon:function(){
  TB('∫ f(x) dx = F(x) + C',W*.5,H*.42,BLUE_D,30);TB('F′ = f',W*.5,H*.66,ORANGE,24);TB('remonter de la dérivée à la fonction',W*.5,H*.86,GREY,14);},
 anim:function(t){
  var m=M6.map(-3,3,-3.2,6.2,{l:20,r:W-20-300,t:14,b:14});
  /* zone de graphe à gauche (environ 300 px), texte à droite */
  var u=Math.min(W*.5,H*1.3);m=M6.map(-3,3,-3,6,{l:16,r:W-16-u,t:12,b:12});
  var s=.5-.5*Math.cos(t*.016),x0=-2.2+4.4*s;M6.axes(m,{xt:[-2,-1,1,2],yt:[-2,2,4]});
  var F=function(C){return function(x){return x*x/2+C;};};
  var cs=[-1.6,0,1.6],cols=[BLUE,BLUE_D,BLUE],c4=2.2*Math.sin(t*.03);
  cs.forEach(function(c,i){M6.curve(m,F(c),-3,3,cols[i]+'99',2.4);});
  M6.curve(m,F(c4),-3,3,ORA2,3.2);
  M6.vl(m,x0,GREY,m.y0,m.y1,[4,4]);
  var all=cs.concat([c4]);all.forEach(function(c,i){var y0=x0*x0/2+c;M6.line(m,x0-.9,y0-.9*x0,x0+.9,y0+.9*x0,i==3?ORA2:RED,2.4);M6.pt(m,x0,y0,i==3?ORA2:BLUE_D,5);});
  var tx=m.L+m.w+26;
  TB('F(x) = x²/2 + C',tx,40,BLUE_D,19,'left');TB('F′(x) = x = f(x)',tx,70,DRED,17,'left');
  TB('x₀ = '+M6.f(x0,2),tx,112,GREY,16,'left');TB('pente de toutes les tangentes',tx,140,INK,15,'left');TB('= f(x₀) = '+M6.f(x0,2),tx,162,DRED,17,'left');
  TB('Même dérivée : les courbes',tx,205,ORANGE,15,'left');TB('ne diffèrent que d\'une',tx,225,ORANGE,15,'left');TB('translation verticale (C).',tx,245,ORANGE,15,'left');
  TB('C = '+M6.f(c4,2)+' (courbe orange)',tx,280,GREY,14,'left');},
 th:'<div class="tcard"><b class="h">Primitive d\'une fonction</b><p>F est une <b>primitive</b> de f sur un intervalle si F′ = f. Si F en est une, toutes les autres sont F + C (C constante réelle) : on écrit ∫ f(x) dx = F(x) + C. Géométriquement, ce sont les courbes de F translatées verticalement : elles ont la même pente au même x.</p><p><b>Linéarité</b> : ∫ (af + bg) = a∫f + b∫g. <b>Piège</b> : ne pas oublier « + C » ; et on vérifie toujours une primitive en la dérivant.</p></div>'+
 '<div class="tcard"><b class="h">Primitives usuelles</b><p>∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1) &nbsp;·&nbsp; ∫ (1/x) dx = ln|x| + C &nbsp;·&nbsp; ∫ eˣ dx = eˣ + C &nbsp;·&nbsp; ∫ aˣ dx = aˣ/ln a + C &nbsp;·&nbsp; ∫ cos x dx = sin x + C &nbsp;·&nbsp; ∫ sin x dx = −cos x + C &nbsp;·&nbsp; (6 h) ∫ dx/(1 + x²) = arctan x + C, ∫ dx/√(1 − x²) = arcsin x + C.</p><p><b>Fonction composée linéaire</b> : si F′ = f, alors une primitive de f(ax + b) est F(ax + b)/a. Exemple : ∫ (2x + 1)³ dx = (2x + 1)⁴/8 + C ; ∫ dx/(2x + 3) = ½ ln(2x + 3) + C (si 2x + 3 &gt; 0).</p><p><b>Changement de variable simple</b> : ∫ u′·uⁿ = uⁿ⁺¹/(n + 1) ; ∫ u′/u = ln|u| ; ∫ u′·e<sup>u</sup> = e<sup>u</sup>. Exemple : ∫ x/(x² + 1) dx = ½ ln(x² + 1) + C (u = x² + 1, u′ = 2x).</p></div>'+
 '<div class="tcard"><b class="h">Primitive passant par un point (condition initiale)</b><p>Une condition F(a) = b fixe la constante C. <b>Méthode</b> : 1) trouver une primitive générale F(x) + C ; 2) écrire F(a) + C = b ; 3) en déduire C.</p><p><b>Exemple chiffré.</b> f(x) = 3x² − 2x, courbe passant par (1 ; 3). Primitives : x³ − x² + C. En x = 1 : 1 − 1 + C = 3, donc C = 3 et F(x) = x³ − x² + 3. Contrôle : F′(x) = 3x² − 2x ✓ et F(1) = 3 ✓.</p></div>'+
 '<div class="tcard"><b class="h">Vitesse, position, applications</b><p>Si s′(t) = v(t), alors s(t) = ∫ v(t) dt avec la condition initiale s(0). Le mobile change de sens quand v s\'annule en changeant de signe.</p><p><b>Exemple chiffré.</b> v(t) = 3t² − 12t + 9 = 3(t − 1)(t − 3), s(0) = 2. Alors s(t) = t³ − 6t² + 9t + 2. Demi-tours en t = 1 (s = 6) et t = 3 (s = 2) ; s(4) = 6. Pour une vitesse limite (chute avec frottements v = 20(1 − e<sup>−0,5t</sup>)), s(t) = 20t + 40e<sup>−0,5t</sup> − 40.</p><p>(6 h) <b>Intégration par parties</b> : ∫ u′v = uv − ∫ uv′. Exemple : ∫ x·eˣ dx = (x − 1)eˣ + C, car ((x − 1)eˣ)′ = eˣ + (x − 1)eˣ = x·eˣ.</p></div>'
});

R.figs("c03",[
 /* 0 */
 gen({x0:-1.5,x1:2.2,y0:-15,y1:20,xt:[-1,1,2],yt:[-10,10,20],f:function(x){return 6*x*x-4*x+1;},fl:'f(x) = 6x² − 4x + 1',flx:-1.4,fly:18,
  F:function(x){return 2*x*x*x-2*x*x+x;},fam:[-4,4],Fl:'F(x) = 2x³ − 2x² + x + C',Flx:-1.4,Fly:-12}),
 /* 1 */
 gen({x0:-2.2,x1:2.2,y0:-5,y1:15,xt:[-2,-1,1,2],yt:[5,10],f:function(x){return 3*x*x;},fl:'f(x) = 3x²',flx:-2.1,fly:12.5,
  F:function(x){return x*x*x+5;},Fl:'x³ + 5 : (x³ + 5)′ = 3x²',Flx:-2.1,Fly:-3.3,fam:[-5,-10]}),
 /* 2 */
 gen({x0:-3,x1:2,y0:-4,y1:23,xt:[-3,-2,-1,1,2],yt:[5,10,15,20],f:function(x){return 3*Math.exp(x)+Math.cos(x);},fl:'f(x) = 3eˣ + cos x',flx:-2.9,fly:20,
  F:function(x){return 3*Math.exp(x)+Math.sin(x)-2;},Fl:'F(x) = 3eˣ + sin x − 2',Flx:-2.9,Fly:16,post:function(m){M6.pt(m,0,1,GREEN,7.5);TB('F(0) = 1',m.X(.1),m.Y(1)+20,DGREEN,15,'left');}}),
 /* 3 */
 gen({x0:-2.2,x1:1.4,y0:-30,y1:34,xt:[-2,-1,1],yt:[-20,-10,10,20,30],f:function(x){return Math.pow(2*x+1,3);},fl:'f(x) = (2x + 1)³',flx:-2.1,fly:-20,
  F:function(x){return Math.pow(2*x+1,4)/8;},Fl:'F(x) = (2x + 1)⁴ / 8',Flx:-2.1,Fly:28,post:function(m){M6.pt(m,-.5,0,GREEN,7);TB('f = 0 : minimum de F',m.X(-.3),m.Y(-9),DGREEN,14,'left');}}),
 /* 4 */
 gen({x0:-1.6,x1:2.2,y0:-4,y1:10,xt:[-1,1,2],yt:[2,4,6,8],f:function(x){return 3*x*x-2*x;},fl:'f(x) = 3x² − 2x',flx:-1.5,fly:8.8,
  F:function(x){return x*x*x-x*x+3;},fam:[-3,3],Fl:'F(x) = x³ − x² + 3',Flx:-1.5,Fly:-3.2,show:function(m){M6.pt(m,1,3,INK,5.5);TB('(1 ; 3)',m.X(1)+9,m.Y(3)+20,INK,15,'left');}}),
 /* 5 */
 gen({x0:-2.6,x1:4.2,y0:-2,y1:4,xt:[-2,-1,1,2,3,4],yt:[-1,1,2,3],f:function(x){return 1/(2*x+3);},fa:-1.46,fl:'f(x) = 1 / (2x + 3)',flx:1.1,fly:2.6,
  F:function(x){return .5*Math.log(2*x+3);},Fa:-1.49,Fl:'F(x) = ½·ln(2x + 3)',Flx:1.1,Fly:-1.2,
  pre:function(m){M6.vl(m,-1.5,RED,m.y0,m.y1);TB('x = −3/2',m.X(-1.5)-6,m.Y(-1.5),DRED,14,'right');}}),
 /* 6 */
 gen({x0:0,x1:4.6,y0:-4.5,y1:10.5,xt:[1,2,3,4],yt:[-3,3,6,9],xl:'t (s)',f:function(t){return 3*t*t-12*t+9;},fl:'v(t) = 3t² − 12t + 9',flx:2.0,fly:9.6,
  F:function(t){return t*t*t-6*t*t+9*t+2;},Fl:'s(t) = t³ − 6t² + 9t + 2',Flx:2.2,Fly:-3.7,
  post:function(m){M6.pt(m,1,6,GREEN,7);M6.pt(m,3,2,GREEN,7);M6.pt(m,4,6,GREEN,7);TB('t = 1 : 6 m',m.X(1)-4,m.Y(6)-12,DGREEN,14,'right');TB('t = 3 : 2 m',m.X(3)+9,m.Y(2)+19,DGREEN,14,'left');TB('s(4) = 6 m',m.X(4)-9,m.Y(6)-12,DGREEN,14,'right');}}),
 /* 7 */
 gen({x0:-5.2,x1:5.2,y0:-1.4,y1:5.6,xt:[-4,-2,2,4],yt:[1,2,3,4,5],f:function(x){return x/(x*x+1);},fl:'f(x) = x / (x² + 1)',flx:1.2,fly:-1.0,
  F:function(x){return .5*Math.log(x*x+1)+3;},Fl:'F(x) = ½·ln(x² + 1) + 3',Flx:-5,Fly:5.1,post:function(m){M6.pt(m,0,3,GREEN,7.5);TB('F(0) = 3',m.X(.3),m.Y(3)+20,DGREEN,15,'left');}}),
 /* 8 */
 gen({x0:-4.5,x1:2.2,y0:-3,y1:15,xt:[-4,-3,-2,-1,1,2],yt:[5,10],f:function(x){return x*Math.exp(x);},fl:'f(x) = x·eˣ',flx:-4.4,fly:-1.4,
  F:function(x){return (x-1)*Math.exp(x);},Fl:'F(x) = (x − 1)·eˣ',Flx:-4.4,Fly:12.5,post:function(m){M6.pt(m,0,-1,GREEN,7.5);TB('F′(x) = eˣ + (x − 1)eˣ = x·eˣ',m.X(-4.4),m.Y(10),DGREEN,14,'left');}}),
 /* 9 */
 function(p){p=M6.pp(p);var v=function(t){return 20*(1-Math.exp(-.5*t));};var m=M6.map(0,12,-1.5,24.5,{l:40,b:30});M6.axes(m,{xt:[0,2,4,6,8,10,12],yt:[5,10,15,20],grid:true,xl:'t (s)',yl:'m/s'});
  var a=M6.seg(p,0,.7);if(a>0){var tb=10*a;M6.fill(m,v,null,0,tb,'rgba(55,138,221,.25)');if(a>.9){TB('aire = s(10) ≈ 160,27 m',m.X(5.8),m.Y(6),BLUE_D,16);}}
  M6.curve(m,v,0,12,ORA2,3.4);TB('v(t) = 20(1 − e^(−0,5t))',m.X(5.6),m.Y(10.3)-0,DRED,16,'left');
  var b=M6.seg(p,.2,.8);if(b>0){ctx.globalAlpha=b;M6.hl(m,20,GREEN,0,12);TB('v → 20 m/s',m.X(11.9),m.Y(20)-8,DGREEN,15,'right');var t95=Math.log(20)/.5;M6.vl(m,t95,GREEN,0,19,[4,3]);M6.pt(m,t95,19,GREEN,7);TB('95 % à t ≈ 5,99 s',m.X(t95)+8,m.Y(16.8),DGREEN,14,'left');ctx.globalAlpha=1;}},
 /* 10 */
 gen({x0:.6,x1:16.5,y0:-1.4,y1:5,xt:[2,4,6,8,10,12,14,16],yt:[1,2,3,4],f:function(x){return 1/(x*Math.log(x));},fa:1.0001,fl:'f(x) = 1 / (x·ln x)',flx:5.5,fly:.55,
  F:function(x){return Math.log(Math.log(x))+2;},Fa:1.0001,Fl:'F(x) = ln(ln x) + 2',Flx:6,Fly:3.8,
  pre:function(m){M6.vl(m,1,RED,m.y0,m.y1);},post:function(m){M6.pt(m,Math.E,2,GREEN,7);M6.pt(m,Math.exp(Math.E),3,GREEN,7);TB('F(e) = 2',m.X(Math.E)+8,m.Y(2)+20,DGREEN,15,'left');TB('F(eᵉ) = 3',m.X(Math.exp(Math.E))-8,m.Y(3)-12,DGREEN,15,'right');}})
]);
})();
