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
/* ===== Chapitre 7 : statistique à deux variables ===== */
(function(){
var R=SFA;
function stats(x,y){var n=x.length,mx=0,my=0,i;for(i=0;i<n;i++){mx+=x[i];my+=y[i];}mx/=n;my/=n;var sxx=0,sxy=0,syy=0;for(i=0;i<n;i++){sxx+=(x[i]-mx)*(x[i]-mx);sxy+=(x[i]-mx)*(y[i]-my);syy+=(y[i]-my)*(y[i]-my);}
 return {n:n,mx:mx,my:my,sxx:sxx,sxy:sxy,syy:syy,a:sxy/sxx,b:my-sxy/sxx*mx,r:sxy/Math.sqrt(sxx*syy)};}
function frame(x0,x1,y0,y1,xt,yt,o){o=o||{};var m=M6.map(x0,x1,y0,y1,{l:o.l||34,b:30,t:o.t||18,r:o.r});M6.axes(m,{xt:xt,yt:yt,grid:true,xl:o.xl,yl:o.yl,xd:o.xd||0,yd:o.yd||0});return m;}
function pts(m,x,y,col,r){for(var i=0;i<x.length;i++)M6.pt(m,x[i],y[i],col||BLUE,r||6);}
var X5=[1,2,3,4,5],Y5=[2,4,5,4,5];

R.theo("c07",{
 icon:function(){
  var m=M6.map(0,7,0,7,{l:12,r:W*.5,t:12,b:20});var x=[1,1.6,2.4,3,3.8,4.4,5.2,6],y=[1.4,2.4,2,3.6,3.2,4.8,4.4,5.8];
  LN(m.L,m.Y(0),m.L+m.w,m.Y(0),AX,1.5);LN(m.L,m.Y(0),m.L,m.T,AX,1.5);var s=stats(x,y);M6.line(m,.4,s.a*.4+s.b,6.6,s.a*6.6+s.b,ORA2,3.2);pts(m,x,y,BLUE,6);M6.pt(m,s.mx,s.my,RED,8);
  TB('y = ax + b',W*.76,H*.36,BLUE_D,26);TB('r = −1 … 1',W*.76,H*.57,ORANGE,24);TB('nuage · régression · corrélation',W*.76,H*.8,GREY,13);},
 anim:function(t){
  var s0=stats(X5,Y5),u=Math.min(H-50,W*.55),m=M6.map(0,6.4,0,6.4,{l:34,r:W-34-u,t:16,b:30});
  M6.axes(m,{xt:[1,2,3,4,5,6],yt:[1,2,3,4,5,6],grid:true});
  var a=s0.a+.9*Math.sin(t*.022),Gx=s0.mx,Gy=s0.my,sse=0,i;
  var best=Math.abs(a-s0.a)<.05;
  var X=function(v){return m.X(v);};
  for(i=0;i<5;i++){var yh=Gy+a*(X5[i]-Gx),e=Y5[i]-yh,side=Math.abs(e);sse+=e*e;
   var x1=m.X(X5[i]),x2=m.X(X5[i]+side*(e>=0?1:1)),ya=m.Y(Y5[i]),yb=m.Y(yh);ctx.fillStyle=best?'rgba(29,158,117,.22)':'rgba(216,90,48,.2)';ctx.strokeStyle=best?GREEN:ORA2;ctx.lineWidth=1.4;ctx.beginPath();ctx.rect(x1,Math.min(ya,yb),x2-x1,Math.abs(ya-yb));ctx.fill();ctx.stroke();}
  M6.line(m,0,Gy-a*Gx,6.4,Gy+a*(6.4-Gx),best?GREEN:BLUE,3.2);
  pts(m,X5,Y5,BLUE_D,6);M6.pt(m,Gx,Gy,RED,8);TB('G',m.X(Gx)+10,m.Y(Gy)-10,DRED,16,'left');
  var tx=m.L+m.w+30;
  TB('Droite par G, pente a = '+M6.f(a,2),tx,48,best?DGREEN:BLUE_D,18,'left');
  TB('Somme des carrés des écarts :',tx,100,INK,15,'left');TB('S = '+M6.f(sse,2),tx,132,best?DGREEN:DRED,24,'left');
  TB('minimum : 2,40 pour a = 0,60',tx,168,GREY,15,'left');
  TB(best?'droite des moindres carrés !':'on peut faire mieux : bouge a',tx,214,best?DGREEN:ORANGE,16,'left');
  TB('y − ȳ = a(x − x̄) avec a = sxy / sxx',tx,262,GREY,14,'left');},
 th:'<div class="tcard"><b class="h">Nuage de points et point moyen</b><p>Une série statistique double associe à chaque individu deux valeurs (xᵢ ; yᵢ). Le <b>nuage de points</b> les représente. Le <b>point moyen</b> est G(x̄ ; ȳ). On note s<sub>xx</sub> = Σ(xᵢ − x̄)², s<sub>yy</sub> = Σ(yᵢ − ȳ)² et s<sub>xy</sub> = Σ(xᵢ − x̄)(yᵢ − ȳ) (la « covariance » à un facteur 1/n près).</p><p><b>Exemple.</b> x : 2 ; 4 ; 6 ; 8 et y : 3 ; 5 ; 4 ; 8 : x̄ = 5, ȳ = 5, donc G(5 ; 5).</p></div>'+
 '<div class="tcard"><b class="h">Droite de régression (moindres carrés)</b><p>La droite de régression de y en x est y = ax + b avec <b>a = s<sub>xy</sub> / s<sub>xx</sub></b> et <b>b = ȳ − a·x̄</b> : elle passe par G et rend minimale la somme des carrés des écarts verticaux (résidus) entre les points et la droite. (6 h : on le démontre en dérivant la somme des carrés.) Si l\'on échange les rôles, la droite de régression de x en y est différente.</p><p><b>Exemple chiffré.</b> x : 1 ; 2 ; 3 ; 4 ; 5 et y : 2 ; 4 ; 5 ; 4 ; 5. x̄ = 3, ȳ = 4, s<sub>xx</sub> = 10, s<sub>xy</sub> = 6. Donc a = 0,6 et b = 4 − 0,6·3 = 2,2 : y = 0,6x + 2,2. Prévision pour x = 6 : y = 0,6·6 + 2,2 = 5,8.</p></div>'+
 '<div class="tcard"><b class="h">Coefficient de corrélation linéaire</b><p>r = s<sub>xy</sub> / √(s<sub>xx</sub>·s<sub>yy</sub>), toujours compris entre −1 et 1. |r| proche de 1 : les points sont presque alignés (r &gt; 0 : y croît avec x ; r &lt; 0 : y décroît). r proche de 0 : pas de lien <b>linéaire</b>. Le produit des pentes des deux droites de régression vaut r².</p><p><b>Exemple.</b> Avec s<sub>yy</sub> = 6 : r = 6 / √(10·6) = 6/√60 ≈ 0,775 : corrélation positive assez forte. <b>Pièges</b> : r = 0 ne veut pas dire « indépendants » (y = x² sur −2 ; …; 2 donne r = 0) ; un seul point aberrant peut tout changer (six points dont (6 ; 0) : r passe de 1 à 0).</p></div>'+
 '<div class="tcard"><b class="h">Prévision, limites, causalité, modèles exponentiels</b><p><b>Interpolation</b> (dans l\'intervalle observé) : raisonnable. <b>Extrapolation</b> (hors de l\'intervalle) : dangereuse. Un modèle y = 6,2x + 75 (taille d\'enfants de 2 à 10 ans) donnerait 261 cm à 30 ans : absurde.</p><p><b>Corrélation ≠ causalité</b> : r = 0,95 entre le nombre de pompiers envoyés et les dégâts ne signifie pas que les pompiers causent les dégâts : une <b>variable cachée</b> (la taille de l\'incendie) agit sur les deux.</p><p><b>Ajustement exponentiel</b> : si (t ; ln N) est presque aligné, N = A·e<sup>kt</sup> ; on fait la régression de ln N en t. Ex. : 100 ; 150 ; 230 ; 340 ; 510 → ln N ≈ 0,408t + 4,61, soit N ≈ 100·e<sup>0,408t</sup>.</p></div>'
});

R.figs("c07",[
 /* 0 : point moyen */
 function(p){p=M6.pp(p);var x=[2,4,6,8],y=[3,5,4,8];var m=frame(0,10,0,10,[2,4,6,8,10],[2,4,6,8,10]);pts(m,x,y,BLUE,7);
  var a=M6.seg(p,0,.7);if(a>0){M6.vl(m,5,GREEN,0,5*a);M6.hl(m,5,GREEN,0,5*a);M6.pt(m,5,5,RED,9);if(a>.9){TB('G(5 ; 5)',m.X(5)+12,m.Y(5)-12,DRED,18,'left');TB('x̄ = 5',m.X(5),m.Y(0)-8,DGREEN,15);TB('ȳ = 5',m.X(.2),m.Y(5)-8,DGREEN,15,'left');}}
  TB('x : 2 ; 4 ; 6 ; 8  ·  y : 3 ; 5 ; 4 ; 8',m.X(10),m.Y(9.4),GREY,14,'right');},
 /* 1 : lire r = -0,92 */
 function(p){p=M6.pp(p);var x=[1,2,3,4,5,6,7,8,9,10],y=[9.0,7.2,8.6,5.7,6.9,4.5,5.3,3.2,4.2,2.0];var s=stats(x,y);var m=frame(0,11,0,11,[2,4,6,8,10],[2,4,6,8,10]);pts(m,x,y,BLUE,6.5);
  TB('r = −0,92',m.X(10.8),m.Y(10.2),BLUE_D,24,'right');var a=M6.seg(p,0,.7);
  if(a>0){M6.line(m,.3,s.a*.3+s.b,10.7,s.a*10.7+s.b,ORA2,3.4);if(a>.9){TB('lien linéaire fort',m.X(5.2),m.Y(.9),DGREEN,16,'left');TB('y diminue quand x augmente',m.X(5.2),m.Y(.3)-0,DGREEN,15,'left');}}},
 /* 2 : droite de regression */
 function(p){p=M6.pp(p);var m=frame(0,7,0,7.2,[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]);pts(m,X5,Y5,BLUE,7);
  var a=M6.seg(p,0,.7);if(a>0){M6.line(m,0,2.2,7*a,.6*7*a+2.2,ORA2,3.4);M6.pt(m,3,4,RED,8);
   if(a>.9){TB('y = 0,6x + 2,2',m.X(.2),m.Y(2.2)-14,DRED,17,'left');TB('G(3 ; 4)',m.X(3)+10,m.Y(4)+22,DRED,15,'left');M6.vl(m,6,GREEN,0,5.8,[4,3]);M6.pt(m,6,5.8,GREEN,8);TB('x = 6 → 5,8',m.X(6)-8,m.Y(5.8)-14,DGREEN,16,'right');}}},
 /* 3 : coefficient de correlation */
 function(p){p=M6.pp(p);var m=M6.map(0,7,0,7,{l:34,b:104,t:12,r:200});M6.axes(m,{xt:[1,2,3,4,5,6],yt:[1,2,3,4,5,6],grid:true});pts(m,X5,Y5,BLUE,7);M6.line(m,0,2.2,6.5,6.1,ORA2,3);
  var gx=W*.12,gw=W*.76,gy=H*.9;LN(gx,gy,gx+gw,gy,AX,6);[[-1,'−1'],[0,'0'],[1,'1']].forEach(function(v){var x=gx+(v[0]+1)/2*gw;LN(x,gy-9,x,gy+9,INK,2);TB(v[1],x,gy+26,INK,15);});
  TB('r',gx-16,gy+5,GREY,16,'right');var a=M6.seg(p,0,.7);var rv=6/Math.sqrt(60);
  if(a>0){var x=gx+(rv+1)/2*gw;ctx.globalAlpha=a;DOT(x,gy,10,GREEN);TB('r ≈ 0,775',x,gy-20,DGREEN,17);ctx.globalAlpha=1;TB('corrélation positive assez forte',W*.62,H*.4,DGREEN,16);}
  else TB('r = s_xy / √(s_xx · s_yy)',W*.5,H*.75,GREY,16);},
 /* 4 : r = 0 pour y = x^2 */
 function(p){p=M6.pp(p);var m=frame(-3,3,-.8,5,[-2,-1,1,2],[1,2,3,4]);var f=function(x){return x*x;};M6.curve(m,f,-2.6,2.6,GREY+'88',2,[4,4]);
  [-2,-1,0,1,2].forEach(function(v){M6.pt(m,v,v*v,BLUE,7);});TB('y = x²',m.X(2.1),m.Y(4.6),BLUE_D,17,'left');
  var a=M6.seg(p,0,.7);if(a>0){M6.line(m,-3,2,-3+6*a,2,ORA2,3.4);if(a>.9){TB('droite : y = 2 (pente nulle)',m.X(-2.9),m.Y(2)-12,DRED,16,'left');TB('r = 0, mais y dépend de x !',m.X(0),m.Y(-.5),DGREEN,17);}}},
 /* 5 : prevoir sans exagerer */
 function(p){p=M6.pp(p);var f=function(x){return 6.2*x+75;};var m=M6.map(0,32,50,285,{l:44,b:30});M6.axes(m,{xt:[2,10,20,30],yt:[100,150,200,250],grid:true,xl:'âge'});
  ctx.fillStyle='rgba(55,138,221,.12)';ctx.fillRect(m.X(2),m.T,m.X(10)-m.X(2),m.h);TB('données : 2 à 10 ans',m.X(6),m.Y(268),BLUE_D,15);
  M6.line(m,2,f(2),10,f(10),BLUE,4);M6.pt(m,8,f(8),RED,7);TB('8 ans : 124,6 cm',m.X(8)+8,m.Y(f(8))+22,DRED,15,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.line(m,10,f(10),10+20*a,f(10+20*a),RED,3,[7,5]);if(a>.9){M6.pt(m,30,f(30),RED,8);TB('30 ans : 261 cm ?!',m.X(30)-8,m.Y(f(30))-12,DRED,17,'right');TB('extrapolation non valable',m.X(31),m.Y(140),DRED,15,'right');}ctx.globalAlpha=1;}},
 /* 6 : un seul point change tout */
 function(p){p=M6.pp(p);var m=frame(0,7.4,-.8,7,[1,2,3,4,5,6,7],[1,2,3,4,5,6]);
  M6.line(m,0,1,7,8,GREY,3);TB('5 points : y = x + 1, r = 1',m.X(.2),m.Y(6.2),GREY,16,'left');
  pts(m,[1,2,3,4,5],[2,3,4,5,6],BLUE,7);M6.pt(m,6,0,RED,9);TB('(6 ; 0)',m.X(6),m.Y(0)-14,DRED,16);
  var a=M6.seg(p,0,.7);if(a>0){M6.line(m,0,10/3,7.4*a,10/3,ORA2,4);if(a>.9){TB('6 points : y = 10/3, r = 0',m.X(.2),m.Y(10/3)-13,DRED,17,'left');}}},
 /* 7 : pompiers et degats */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.065,W*.034));function node(x,y,w,s,col,al){ctx.globalAlpha=al;M6.box(x-w/2,y-fs*1.1,w,fs*2.2,col+'18',col,2.4);TB(s,x,y+fs*.35,dk(col),fs+1);ctx.globalAlpha=1;}
  node(W*.2,H*.72,W*.38,'nombre de pompiers',BLUE,1);node(W*.8,H*.72,W*.38,'montant des dégâts',ORA2,1);
  ctx.setLineDash([7,5]);arrow(W*.41,H*.72,W*.18,0,GREY,'',3);arrow(W*.59,H*.72,-W*.18,0,GREY,'',3);ctx.setLineDash([]);TB('r = 0,95',W*.5,H*.66,INK,fs+3);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;node(W*.5,H*.2,W*.44,'taille de l\'incendie',RED,a);arrow(W*.42,H*.3,-W*.15,H*.3,RED,'',3.4);arrow(W*.58,H*.3,W*.15,H*.3,RED,'',3.4);TB('variable cachée : elle agit sur les deux',W*.5,H*.92,DRED,fs+1);ctx.globalAlpha=1;}
  else TB('lien causal ?',W*.5,H*.4,GREY,fs+3);},
 /* 8 : exponentiel et logarithme */
 function(p){p=M6.pp(p);var t=[0,1,2,3,4],N=[100,150,230,340,510],L=N.map(Math.log);var s=stats(t,L);
  var hw=W/2;var m1=M6.map(-.3,4.6,0,560,{l:44,r:hw+6,t:30,b:30});M6.axes(m1,{xt:[0,1,2,3,4],yt:[100,300,500],grid:true,xl:'t'});
  var m2=M6.map(-.3,4.6,4.3,6.5,{l:hw+40,r:12,t:30,b:30});M6.axes(m2,{xt:[0,1,2,3,4],yt:[5,6],grid:true,xl:'t'});
  TB('N (courbée)',m1.L+m1.w/2,20,BLUE_D,15);TB('ln N (alignés)',m2.L+m2.w/2,20,BLUE_D,15);
  M6.curve(m1,function(x){return 100*Math.exp(.408*x);},0,4.6,GREY+'99',2,[4,4]);pts(m1,t,N,BLUE,6);pts(m2,t,L,BLUE,6);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.line(m2,0,s.b,4.6,s.a*4.6+s.b,ORA2,3.4);TB('ln N ≈ 0,408t + 4,61',m2.X(.1),m2.Y(6.3),DRED,15,'left');TB('N ≈ 100·e^(0,408t)',m1.X(.1),m1.Y(500),DGREEN,15,'left');TB('doublement ≈ 1,7 h',m1.X(.1),m1.Y(400),DGREEN,15,'left');ctx.globalAlpha=1;}},
 /* 9 : deux droites de regression */
 function(p){p=M6.pp(p);var m=frame(0,6.4,0,7.4,[1,2,3,4,5,6],[1,2,3,4,5,6,7]);pts(m,X5,Y5,BLUE,7);M6.line(m,0,2.2,6.4,.6*6.4+2.2,ORA2,3.4);TB('y en x : y = 0,6x + 2,2',m.X(4.2),m.Y(4.35),DRED,15,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.line(m,0,1,6.4,7.4,VIOLET,3.4);TB('x en y : x = y − 1',m.X(.2),m.Y(1.9),VIO_D,15,'left');M6.pt(m,3,4,RED,9);TB('G(3 ; 4)',m.X(3)+10,m.Y(4)+24,DRED,16,'left');
   if(a>.9)TB('0,6 × 1 = 0,6 = r²',m.X(6.3),m.Y(.5),DGREEN,18,'right');ctx.globalAlpha=1;}}
]);
})();
