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
/* ===== Chapitre 10 : variables aléatoires, binomiale, normale ===== */
(function(){
var R=SFA,M=M6;
function sg(p,a,b){return M.seg(p,a,b);}
function FA(a,f){if(a<=0)return;ctx.globalAlpha=Math.min(1,a);f();ctx.globalAlpha=1;}
function lc(n,k){var r=0,i;for(i=1;i<=k;i++)r+=Math.log(n-k+i)-Math.log(i);return r;}
function pm(n,k,p){if(k<0||k>n)return 0;if(p<=0)return k===0?1:0;if(p>=1)return k===n?1:0;return Math.exp(lc(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p));}
function nd(x,mu,s){var z=(x-mu)/s;return Math.exp(-z*z/2)/(s*Math.sqrt(2*Math.PI));}
function BARS(m,n,p,hl,col,hc,k0,k1){var k,w=(m.X(1)-m.X(0))*.78;for(k=k0==null?0:k0;k<=(k1==null?n:k1);k++){var v=pm(n,k,p),x=m.X(k),y=m.Y(v),on=hl&&hl(k);ctx.fillStyle=on?M.rgba(hc||RED,.75):M.rgba(col||BLUE,.5);ctx.fillRect(x-w/2,y,w,m.Y(0)-y);ctx.strokeStyle=on?(hc||RED):(col||BLUE);ctx.lineWidth=1.4;ctx.strokeRect(x-w/2,y,w,m.Y(0)-y);}}
function DISC(m,vals,ps,hl,cols,lab){var w=(m.X(1)-m.X(0))*.5;vals.forEach(function(v,i){var x=m.X(v),y=m.Y(ps[i]),c=hl&&hl(i)?RED:BLUE;ctx.fillStyle=M.rgba(c,.55);ctx.fillRect(x-w/2,y,w,m.Y(0)-y);ctx.strokeStyle=c;ctx.lineWidth=1.6;ctx.strokeRect(x-w/2,y,w,m.Y(0)-y);TB(lab?lab[i]:M.f(ps[i],2),x,y-6,dk(c),14);});}
function BELLFILL(m,mu,s,a,b,col){ctx.beginPath();ctx.moveTo(m.X(a),m.Y(0));var n=60,i;for(i=0;i<=n;i++){var x=a+(b-a)*i/n;ctx.lineTo(m.X(x),m.Y(nd(x,mu,s)));}ctx.lineTo(m.X(b),m.Y(0));ctx.closePath();ctx.fillStyle=col;ctx.fill();}
function BELL(m,mu,s,col,w,d){M.curve(m,function(x){return nd(x,mu,s);},m.x0,m.x1,col||BLUE,w||3,d);}
R.theo("c10",{
 icon:function(){var m=M.map(-3.4,3.4,0,.45,{l:W*.05,r:W*.05,t:H*.1,b:H*.2});
  BELLFILL(m,0,1,-1,1,'rgba(55,138,221,.28)');BELL(m,0,1,BLUE,3.2);LN(m.X(-3.4),m.Y(0),m.X(3.4),m.Y(0),AX,1.6);
  [-1,0,1].forEach(function(z){M.vl(m,z,GREY,0,nd(z,0,1));});TB('μ − σ',m.X(-1),m.Y(0)+20,GREY,13);TB('μ',m.X(0),m.Y(0)+20,GREY,13);TB('μ + σ',m.X(1),m.Y(0)+20,GREY,13);
  TB('68 %',m.X(0),m.Y(.17),BLUE_D,22);TB('N(μ ; σ)  ·  B(n ; p)',W*.5,H*.96,ORANGE,Math.min(22,W*.048));},
 anim:function(t){
  var n=Math.max(2,Math.round(2+58*(.5-.5*Math.cos(t/160)))),p=.5,mu=n*p,s=Math.sqrt(n*p*(1-p)),hw=Math.max(4.6,4.2*s),x0=mu-hw,x1=mu+hw,top=1.18*Math.max(nd(mu,mu,s),pm(n,Math.round(mu),p));
  var m=M.map(x0,x1,0,top,{l:30,r:14,t:34,b:34});var st=n<=10?1:n<=30?5:10,tk=[],k;for(k=0;k<=n;k+=st)if(k>=x0&&k<=x1)tk.push(k);M.axes(m,{xt:tk,nozero:false});
  BARS(m,n,p,function(k){return Math.abs(k-mu)<=s;},BLUE,GREEN,Math.max(0,Math.floor(x0)),Math.min(n,Math.ceil(x1)));
  M.curve(m,function(x){return nd(x,mu,s);},x0,x1,RED,3);
  TB('B('+n+' ; 0,5)',W*.04,22,BLUE_D,18,'left');TB('barres vertes : μ ± σ',W*.97,18,DGREEN,13,'right');TB('courbe rouge : N('+M.f(mu,1)+' ; '+M.f(s,2)+')',W*.97,36,DRED,13,'right');
  TB('n grandit : la binomiale devient une cloche',W*.5,H-6,GREY,Math.min(14,W*.021));
 },
 th:'<div class="tcard"><b class="h">Variable aléatoire, espérance, écart-type</b><p>Une variable aléatoire discrète X prend des valeurs x<sub>i</sub> avec des probabilités p<sub>i</sub> (somme = 1). <b>E(X) = Σ x<sub>i</sub> p<sub>i</sub></b> (la moyenne « à long terme »), <b>V(X) = E(X²) − E(X)²</b>, σ = √V(X).</p><p><i>Deux lancers de pièce, X = nombre de piles :</i> P(0) = 1/4, P(1) = 1/2, P(2) = 1/4 ; E(X) = 1 ; E(X²) = 1,5 ; V(X) = 0,5. Un jeu est <b>équitable</b> si l\'espérance du gain est nulle : 10 × 1/6 − 2 × 5/6 = 0.</p></div>' +
  '<div class="tcard"><b class="h">Loi binomiale B(n ; p)</b><p>On répète n fois, de façon <b>indépendante</b>, une épreuve à deux issues (succès de probabilité p). Le nombre de succès X suit B(n ; p) : <b>P(X = k) = C(n,k) p<sup>k</sup> (1 − p)<sup>n−k</sup></b>, <b>E(X) = np</b>, <b>V(X) = np(1 − p)</b>.</p><p><i>Exemple :</i> B(5 ; 0,3) : P(X = 2) = 10 × 0,09 × 0,343 ≈ 0,309 ; E = 1,5 ; σ = √1,05 ≈ 1,02. « Au moins un succès » : 1 − P(X = 0), soit 1 − 0,8<sup>10</sup> ≈ 0,893 pour 10 tirs à 0,2.</p></div>' +
  '<div class="tcard"><b class="h">Loi normale N(μ ; σ)</b><p>Courbe en cloche symétrique autour de μ ; aire totale 1. Environ <b>68 %</b> des valeurs sont dans [μ − σ ; μ + σ], <b>95 %</b> dans ±2σ, <b>99,7 %</b> dans ±3σ. On <b>centre et réduit</b> : Z = (X − μ)/σ suit N(0 ; 1) et on lit la table (Φ).</p><p><i>QI ~ N(100 ; 15) :</i> P(X ≤ 115) = Φ(1) ≈ 0,841 ; P(X &gt; 130) = 1 − Φ(2) ≈ 0,023. Plus σ est grand, plus la cloche est étalée et basse.</p></div>' +
  '<div class="tcard"><b class="h">Approximations</b><p>Si <b>np ≥ 5</b> et <b>n(1 − p) ≥ 5</b>, B(n ; p) ≈ N(np ; √(np(1 − p))), avec <b>correction de continuité</b> : P(X ≥ 60) ≈ P(Y ≥ 59,5). 100 lancers de pièce : μ = 50, σ = 5, z = 1,9, P ≈ 0,029.</p><p>Si p est très petit (événements rares), la normale est à éviter : on utilise la loi de <b>Poisson</b> de paramètre λ = np, P(X = k) = e<sup>−λ</sup> λ<sup>k</sup>/k!. Pour n = 200, p = 0,01 : P(X = 0) ≈ 0,134 (exact) et e<sup>−2</sup> ≈ 0,135 (Poisson).</p></div>'
});
R.figs("c10",[
 function(p){var m=M.map(-.6,2.6,0,.7,{l:46,r:20,t:30,b:44});M.axes(m,{xt:[0,1,2],nozero:false,yt:[.25,.5],yd:2});DISC(m,[0,1,2],[.25,.5,.25],null,null,['1/4','1/2','1/4']);TB('X = nombre de piles',W*.5,20,BLUE_D,16);
  FA(sg(p,.1,.6),function(){M.vl(m,1,GREEN,.54,.68);TB('E(X) = 1',m.X(1)+14,m.Y(.66),DGREEN,17,'left');});FA(sg(p,.5,1),function(){TB('V(X) = 1,5 − 1 = 0,5',W*.8,H*.4,DRED,15,'center');});},
 function(p){var m=M.map(-4,12,0,1,{l:20,r:20,t:34,b:44});LN(m.X(-4),m.Y(0),m.X(12),m.Y(0),AX,1.6);var w=(m.X(1)-m.X(0))*1.6;
  [[-2,5/6,RED],[10,1/6,GREEN]].forEach(function(q){var x=m.X(q[0]),y=m.Y(q[1]*.9);ctx.fillStyle=M.rgba(q[2],.5);ctx.fillRect(x-w/2,y,w,m.Y(0)-y);ctx.strokeStyle=q[2];ctx.lineWidth=2;ctx.strokeRect(x-w/2,y,w,m.Y(0)-y);TB(q[0]>0?'+10 €':'−2 €',x,m.Y(0)+22,dk(q[2]),16);TB(q[0]>0?'1/6':'5/6',x,y-8,dk(q[2]),16);});
  TB('dé : 6 gagne 10 €, sinon −2 €',W*.5,22,BLUE_D,16);FA(sg(p,.1,.8),function(){TB('E = 10 × 1/6 − 2 × 5/6 = 0',W*.5,H*.42,DRED,Math.min(17,W*.036));TB('jeu équitable',W*.5,H*.42+28,DGREEN,20);});},
 function(p){var m=M.map(-.6,5.6,0,.42,{l:44,r:14,t:30,b:36});M.axes(m,{xt:[0,1,2,3,4,5],nozero:false});BARS(m,5,.3,function(k){return k===2&&p>0;},BLUE,RED);
  TB('B(5 ; 0,3)',W*.5,20,BLUE_D,17);[0,1,2,3,4,5].forEach(function(k){TB(M.f(pm(5,k,.3),3),m.X(k),m.Y(pm(5,k,.3))-5,GREY,11);});
  FA(sg(p,.1,.7),function(){TB('P(X = 2) ≈ 0,309',W*.97,H*.3,DRED,16,'right');TB('E = 1,5',W*.97,H*.3+24,DGREEN,15,'right');TB('σ ≈ 1,02',W*.97,H*.3+46,DGREEN,15,'right');});},
 function(p){var m=M.map(-.6,10.6,0,.4,{l:44,r:14,t:30,b:36});M.axes(m,{xt:[0,2,4,6,8,10],nozero:false});BARS(m,10,.2,function(k){return k>=1&&p>0;},BLUE,GREEN);
  TB('B(10 ; 0,2) : P(X = 0) = 0,8¹⁰ ≈ 0,107',W*.5,20,BLUE_D,Math.min(16,W*.034));FA(sg(p,.1,.8),function(){TB('P(X ≥ 1) = 1 − 0,107 ≈ 0,893',W*.97,H*.42,DGREEN,Math.min(16,W*.034),'right');});},
 function(p){var m=M.map(-.6,10.6,0,.3,{l:44,r:14,t:30,b:36});M.axes(m,{xt:[0,2,4,6,8,10],nozero:false});BARS(m,20,.15,function(k){return k>=3&&p>0;},BLUE,GREEN,0,10);
  TB('B(20 ; 0,15)',W*.5,20,BLUE_D,16);FA(sg(p,.1,.8),function(){TB('P(X ≥ 3) = 1 − (0,0388 + 0,1368 + 0,2293)',W*.97,H*.34,DRED,Math.min(13,W*.028),'right');TB('= 1 − 0,4049 ≈ 0,595',W*.97,H*.34+22,DGREEN,17,'right');});},
 function(p){var m=M.map(55,145,0,.03,{l:20,r:20,t:30,b:44});LN(m.X(55),m.Y(0),m.X(145),m.Y(0),AX,1.6);
  FA(sg(p,.1,.9),function(){BELLFILL(m,100,15,85,115,'rgba(55,138,221,.28)');BELLFILL(m,100,15,130,145,'rgba(226,75,74,.45)');});BELL(m,100,15,BLUE,3);
  [70,85,100,115,130].forEach(function(v){TB(String(v),m.X(v),m.Y(0)+20,GREY,13);LN(m.X(v),m.Y(0),m.X(v),m.Y(0)+5,GREY,1.2);});TB('QI ~ N(100 ; 15)',W*.5,20,BLUE_D,16);
  FA(sg(p,.3,1),function(){TB('P(X ≤ 115) ≈ 0,841',W*.03,H*.2,DGREEN,14,'left');TB('P(85 ≤ X ≤ 115) ≈ 0,683',W*.03,H*.31,BLUE_D,14,'left');TB('P(X > 130) ≈ 0,023',W*.03,H*.42,DRED,14,'left');});},
 function(p){var m=M.map(38,62,0,.085,{l:20,r:20,t:30,b:40});M.axes(m,{xt:[40,45,50,55,60],nozero:false});BARS(m,100,.5,function(k){return k>=60&&p>0;},BLUE,RED,38,62);
  M.curve(m,function(x){return nd(x,50,5);},38,62,GREEN,2.5);TB('X ~ B(100 ; 0,5) ≈ N(50 ; 5)',W*.5,20,BLUE_D,16);
  FA(sg(p,.1,.8),function(){LN(m.X(59.5),m.Y(0),m.X(59.5),m.Y(.045),ORANGE,2.5,[5,4]);TB('59,5',m.X(59.5),m.Y(0)+22,DGREEN,13);TB('z = 1,9',W*.97,H*.2,DGREEN,16,'right');TB('P ≈ 1 − 0,9713',W*.97,H*.3,DRED,15,'right');TB('= 0,029',W*.97,H*.4,DRED,17,'right');});},
 function(p){var m=M.map(30,70,0,.11,{l:20,r:20,t:30,b:40});LN(m.X(30),m.Y(0),m.X(70),m.Y(0),AX,1.6);BELL(m,50,4,BLUE,3);BELL(m,50,8,ORANGE,3);
  FA(sg(p,.1,.8),function(){BELLFILL(m,50,8,46,54,'rgba(186,117,21,.3)');BELLFILL(m,50,4,46,54,'rgba(55,138,221,.3)');});
  [34,42,50,58,66].forEach(function(v){TB(String(v),m.X(v),m.Y(0)+20,GREY,13);});TB('σ = 4 (bleu)  ·  σ = 8 (orange)',W*.5,20,BLUE_D,15);
  FA(sg(p,.4,1),function(){TB('≈ 0,683',m.X(50),m.Y(.085),BLUE_D,16);TB('≈ 0,383',W*.82,H*.5,'#8a5a10',17);TB('(z = ±0,5)',W*.82,H*.5+20,GREY,13);});},
 function(p){var m=M.map(82,106.5,0,.14,{l:20,r:20,t:30,b:40});LN(m.X(82),m.Y(0),m.X(106.5),m.Y(0),AX,1.6);
  BARS(m,105,.9,function(k){return k>=101&&p>0;},BLUE,RED,82,105);BELL(m,94.5,Math.sqrt(9.45),GREEN,2.5);[85,90,95,100,105].forEach(function(v){TB(String(v),m.X(v),m.Y(0)+20,GREY,13);});
  TB('X ~ B(105 ; 0,9) ≈ N(94,5 ; 3,07)',W*.5,20,BLUE_D,Math.min(15,W*.032));
  FA(sg(p,.1,.8),function(){LN(m.X(100.5),m.Y(0),m.X(100.5),m.Y(.09),ORANGE,2.5,[5,4]);TB('100,5',m.X(100.5)-14,m.Y(0)+36,'#8a5a10',13);TB('z ≈ 1,95  →  P ≈ 0,026',W*.04,H*.34,DRED,Math.min(16,W*.034),'left');TB('(exact ≈ 0,017)',W*.04,H*.34+22,GREY,14,'left');});},
 function(p){var m=M.map(-.6,8.6,0,.5,{l:44,r:14,t:30,b:36});M.axes(m,{xt:[0,1,2,3,4,5,6,7,8],nozero:false});var k,w=(m.X(1)-m.X(0))*.36;
  for(k=0;k<=8;k++){var b=pm(200,k,.01),q=Math.exp(-2)*Math.pow(2,k)/M.fact(k);var x=m.X(k);ctx.fillStyle=M.rgba(BLUE,.55);ctx.fillRect(x-w-1,m.Y(b),w,m.Y(0)-m.Y(b));ctx.fillStyle=M.rgba(ORANGE,.6);ctx.fillRect(x+1,m.Y(q),w,m.Y(0)-m.Y(q));}
  TB('B(200 ; 0,01) en bleu  ·  Poisson(2) en orange',W*.5,20,BLUE_D,Math.min(15,W*.032));
  FA(sg(p,.1,.8),function(){TB('P(X = 0) ≈ 0,134  vs  e⁻² ≈ 0,135',W*.97,H*.38,DGREEN,Math.min(15,W*.032),'right');TB('P(X ≥ 3) = 1 − 5e⁻² ≈ 0,323',W*.97,H*.38+24,DRED,Math.min(15,W*.032),'right');});}
]);
})();
