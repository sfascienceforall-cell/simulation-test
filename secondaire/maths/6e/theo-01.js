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
/* ===== Chapitre 1 : exponentielles et logarithmes ===== */
(function(){
var R=SFA;
function ln2(x){return Math.log(x)/Math.LN2;}
function ease(s){return s*s*(3-2*s);}

R.theo("c01",{
 icon:function(){
  var u=H/8.2,ox=W*.34,oy=H*.52;
  LN(ox-3.2*u,oy,ox+4.4*u,oy,AX,1.6);LN(ox,oy+3.2*u,ox,oy-3.4*u,AX,1.6);
  LN(ox-2.6*u,oy+2.6*u,ox+3.4*u,oy-3.4*u,GREY,1.4,[5,4]);
  var i,x,y;ctx.lineWidth=3;ctx.strokeStyle=BLUE;ctx.beginPath();
  for(i=0;i<=60;i++){x=-3+i*.1;y=Math.exp(x);var px=ox+x*u,py=oy-y*u;if(py<oy-3.4*u)break;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
  ctx.strokeStyle=RED;ctx.beginPath();var f=0;
  for(i=0;i<=80;i++){x=.06+i*.1;y=Math.log(x);var qx=ox+x*u,qy=oy-y*u;if(qy>oy+3.2*u||qx>ox+4.4*u)break;f?ctx.lineTo(qx,qy):ctx.moveTo(qx,qy);f=1;}ctx.stroke();
  TB('eˣ',ox+1.2*u,oy-3*u,BLUE_D,22);TB('ln x',ox+3.1*u,oy+1.3*u,DRED,22);
  TB('e^x ⇄ ln x',W*.78,H*.4,BLUE_D,28);TB('fonctions réciproques',W*.78,H*.58,ORANGE,15);},
 anim:function(t){
  var Tm=14,u=(H-2*Tm)/7.4,m=M6.map(-3,8,-2,5.4,{l:16,r:W-16-11*u,t:Tm,b:Tm});
  var s=.5-.5*Math.cos(t*.022),x0=-2+4.4*s,y0=Math.pow(2,x0);
  LN(m.X(-3),m.Y(-3),m.X(8),m.Y(8),GREY,1.4,[6,5]);
  M6.axes(m,{xt:[-2,-1,1,2,3,4,5],yt:[-1,1,2,3,4,5]});
  M6.curve(m,function(x){return Math.pow(2,x);},-3,3,BLUE,3);
  M6.curve(m,ln2,.001,8,RED,3);
  TB('2ˣ',m.X(2.55),m.Y(5.0),BLUE_D,17);TB('log₂ x',m.X(5.6),m.Y(2.8),DRED,17);TB('y = x',m.X(4.7),m.Y(5.0),GREY,14);
  LN(m.X(x0),m.Y(y0),m.X(y0),m.Y(x0),ORANGE,1.6,[3,4]);
  M6.vl(m,x0,BLUE,0,y0,[3,3]);M6.hl(m,y0,BLUE,0,x0,[3,3]);
  M6.vl(m,y0,RED,0,x0,[3,3]);M6.hl(m,x0,RED,0,y0,[3,3]);
  M6.pt(m,x0,y0,BLUE_D,6.5);M6.pt(m,y0,x0,DRED,6.5);
  var px=m.X(8.3);
  TB('(x ; y) sur 2ˣ',px,m.Y(4.6),BLUE_D,15,'left');
  TB('( '+M6.f(x0,2)+' ; '+M6.f(y0,2)+' )',px,m.Y(4.0),BLUE_D,16,'left');
  TB('(y ; x) sur log₂',px,m.Y(2.9),DRED,15,'left');
  TB('( '+M6.f(y0,2)+' ; '+M6.f(x0,2)+' )',px,m.Y(2.3),DRED,16,'left');
  TB('on échange x et y : symétrie',px,m.Y(.9),ORANGE,14,'left');TB('par rapport à y = x',px,m.Y(.35),ORANGE,14,'left');},
 th:'<div class="tcard"><b class="h">Les fonctions exponentielles et logarithmes</b><p><b>Exponentielle de base a</b> (a &gt; 0, a ≠ 1) : f(x) = aˣ. Domaine ℝ, image ]0 ; +∞[, graphe passant par (0 ; 1), asymptote horizontale y = 0. Croissante si a &gt; 1, décroissante si 0 &lt; a &lt; 1. La base e ≈ 2,718 est celle dont la tangente en (0 ; 1) a pour pente 1.</p><p><b>Logarithme de base a</b> : log<sub>a</sub> x = y ⇔ aʸ = x. Domaine ]0 ; +∞[, graphe passant par (1 ; 0), asymptote verticale x = 0. Le logarithme est l\'exposant à donner à a pour obtenir x. Cas particuliers : ln x = log<sub>e</sub> x (népérien) et log x = log<sub>10</sub> x (décimal).</p><p>Les deux fonctions sont <b>réciproques</b> : log<sub>a</sub>(aˣ) = x et a<sup>log<sub>a</sub> x</sup> = x ; leurs graphes sont symétriques par rapport à la droite y = x.</p></div>'+
 '<div class="tcard"><b class="h">Règles de calcul</b><p><b>Puissances</b> : aˣ·aʸ = aˣ⁺ʸ ; aˣ / aʸ = aˣ⁻ʸ ; (aˣ)ʸ = aˣʸ ; (ab)ˣ = aˣbˣ ; a⁻ˣ = 1/aˣ.</p><p><b>Logarithmes</b> (x, y &gt; 0) : log(xy) = log x + log y ; log(x/y) = log x − log y ; log(xʳ) = r·log x ; log 1 = 0 ; log<sub>a</sub> a = 1.</p><p><b>Changement de base</b> : log<sub>a</sub> x = ln x / ln a. Exemple : log<sub>2</sub> 40 = ln 40 / ln 2 ≈ 3,689 / 0,693 ≈ 5,32.</p><p><b>Pièges</b> : ln(x + y) ≠ ln x + ln y ; (ln x)² ≠ ln(x²) ; ln n\'existe que pour un argument strictement positif.</p></div>'+
 '<div class="tcard"><b class="h">Résoudre équations et inéquations</b><p><b>Exponentielle</b> : on écrit les deux membres avec la même base (aᵘ = aᵛ ⇒ u = v) ou on prend le logarithme : aˣ = b ⇒ x = log<sub>a</sub> b = ln b / ln a (si b &gt; 0). Si l\'équation contient aˣ et a²ˣ, on pose u = aˣ (u &gt; 0) et on résout un trinôme.</p><p><b>Logarithme</b> : 1) écrire les conditions d\'existence (arguments &gt; 0) ; 2) regrouper en un seul logarithme ; 3) égaler les arguments ; 4) <b>rejeter</b> les solutions hors domaine.</p><p><b>Inéquations</b> : si a &gt; 1, les fonctions aˣ et log<sub>a</sub> sont croissantes et conservent le sens de l\'inégalité ; si 0 &lt; a &lt; 1, elles le renversent.</p></div>'+
 '<div class="tcard"><b class="h">Modèles de croissance et de décroissance</b><p><b>Croissance exponentielle</b> : N(t) = N₀·aᵗ = N₀·e<sup>kt</sup> avec k = ln a. <b>Décroissance</b> : N(t) = N₀·e<sup>−kt</sup> ; <b>demi-vie</b> T : N(t) = N₀·(1/2)<sup>t/T</sup>, donc k = ln 2 / T. <b>Temps de doublement</b> : ln 2 / k. <b>Refroidissement</b> : T(t) = T<sub>pièce</sub> + (T₀ − T<sub>pièce</sub>)·e<sup>−kt</sup>, asymptote T<sub>pièce</sub>.</p><p><b>Exemple chiffré.</b> Un capital de 2 000 € placé à 3 % composés est multiplié par 1,03 chaque année. Il atteint 3 000 € quand 1,03ⁿ = 1,5, donc n = ln 1,5 / ln 1,03 ≈ 0,4055 / 0,02956 ≈ 13,7 : après 14 années entières (contrôle : 1,03¹³ ≈ 1,469 &lt; 1,5 et 1,03¹⁴ ≈ 1,513 &gt; 1,5).</p></div>'
});

R.figs("c01",[
 /* 0 : logarithmes sans calculatrice */
 function(p){p=M6.pp(p);var rows=[['log₂ 32','2⁵ = 32','5',BLUE],['log₃ 81','3⁴ = 81','4',GREEN],['log 1000','10³ = 1000','3',ORANGE]];
  var rh=H*.2,y0=H*.1,bw=W*.2;
  rows.forEach(function(r,i){var y=y0+i*(rh+H*.04),a=M6.seg(p,i*.2,i*.2+.3);
   M6.box(W*.06,y,bw*1.15,rh,'#f4f8fd',r[3],2.2);TB(r[0]+' = ?',W*.06+bw*.575,y+rh*.62,dk(r[3]),Math.round(H*.065));
   arrow(W*.06+bw*1.15+8,y+rh/2,W*.1,0,GREY,'',2);
   TB('quel exposant ?',W*.47,y+rh*.4,GREY,13);TB(r[1],W*.47,y+rh*.78,INK,Math.round(H*.058));
   if(a>0){ctx.globalAlpha=a;M6.box(W*.72,y,W*.2,rh,r[3]+'22',r[3],2.2);TB(r[2],W*.82,y+rh*.7,dk(r[3]),Math.round(H*.1));ctx.globalAlpha=1;}});
  var a=M6.seg(p,.65,.95);if(a>0){ctx.globalAlpha=a;TB('5 + 4 − 3 = 6',W*.5,H*.95,DRED,Math.round(H*.085));ctx.globalAlpha=1;}},
 /* 1 : domaine de ln(x-3) */
 function(p){p=M6.pp(p);var m=M6.map(-1,9,-4,4,{l:30,b:34});M6.axes(m,{xt:[-1,1,2,3,4,5,6,7,8],yt:[-3,-2,-1,1,2,3],grid:true});
  M6.vl(m,3,RED,m.y0,m.y1);TB('x = 3',m.X(3)-6,m.Y(3.5),DRED,14,'right');
  M6.curve(m,function(x){return Math.log(x-3);},3.0001,9,BLUE,3.2);TB('f(x) = ln(x − 3)',m.X(6.6),m.Y(1.9),BLUE_D,16);
  var a=M6.seg(p,0,.7);if(a>0){var ya=m.Y(0);ctx.save();ctx.strokeStyle=GREEN;ctx.lineWidth=7;ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(m.X(3),ya);ctx.lineTo(m.X(3)+(m.X(9)-m.X(3))*a,ya);ctx.stroke();ctx.restore();
   DOT(m.X(3),ya,6,'#fff');DOT(m.X(3),ya,6,GREEN,false);if(a>.9)TB('D = ]3 ; +∞[',m.X(6),m.Y(-.7),DGREEN,16);}},
 /* 2 : 2^(2x-1)=32 */
 function(p){p=M6.pp(p);var m=M6.map(-.5,4.5,-4,40,{l:38,b:32});M6.axes(m,{xt:[0,1,2,3,4],yt:[8,16,24,32],grid:true});
  var f=function(x){return Math.pow(2,2*x-1);};M6.curve(m,f,-.5,4.5,BLUE,3.2);TB('y = 2^(2x−1)',m.X(2.35),m.Y(8),BLUE_D,15);
  M6.hl(m,32,ORA2,0,4.5);TB('y = 32',m.X(.3),m.Y(34.5),DRED,15,'left');
  var a=M6.seg(p,0,.8);if(a>0){var yy=32*a;M6.vl(m,3,GREEN,0,yy,[4,3]);ctx.globalAlpha=Math.min(1,a*2);M6.pt(m,3,32,GREEN,7);ctx.globalAlpha=1;if(a>.85){TB('x = 3',m.X(3),m.Y(-3.2),DGREEN,16);}}},
 /* 3 : cascade de logarithmes */
 function(p){p=M6.pp(p);var m=M6.map(0,5,-2.4,4.4,{l:30,b:20,t:30});
  var v=[2*Math.log(3),Math.log(4),-Math.log(6)],lab=['2 ln 3','+ ln 4','− ln 6'],col=[BLUE,GREEN,RED];
  var bw=(m.w/5)*.62,cum=0;LN(m.L,m.Y(0),m.L+m.w,m.Y(0),AX,1.6);
  for(var i=0;i<3;i++){var x=m.X(i+.5)-bw/2,ya=m.Y(cum),yb=m.Y(cum+v[i]);ctx.fillStyle=col[i]+'44';ctx.strokeStyle=col[i];ctx.lineWidth=2.2;ctx.beginPath();ctx.rect(x,Math.min(ya,yb),bw,Math.abs(yb-ya));ctx.fill();ctx.stroke();
   TB(lab[i],x+bw/2,(v[i]>0?Math.min(ya,yb)-8:Math.max(ya,yb)+18),dk(col[i]),15);TB(M6.f(v[i],2),x+bw/2,(ya+yb)/2+5,INK,14);
   if(i<2)LN(x+bw,yb,x+bw+(m.w/5)*.38,yb,GREY,1.2,[4,3]);cum+=v[i];}
  var a=M6.seg(p,0,.6);if(a>0){var x=m.X(3.5)-bw/2;LN(m.X(2.5)+bw/2,m.Y(cum),x,m.Y(cum),GREY,1.2,[4,3]);ctx.fillStyle='rgba(216,90,48,.28)';ctx.strokeStyle=ORA2;ctx.lineWidth=2.4;ctx.beginPath();ctx.rect(x,m.Y(cum*a),bw,m.Y(0)-m.Y(cum*a));ctx.fill();ctx.stroke();
   if(a>.9){TB('= ln 6',x+bw/2,m.Y(cum)-10,DRED,17);TB('≈ '+M6.f(cum,3),x+bw/2,m.Y(cum/2)+5,INK,14);}}
  TB('2 ln 3 + ln 4 − ln 6',W*.5,H*.07,INK,15);},
 /* 4 : ln x + ln(x-2) = ln 3 */
 function(p){p=M6.pp(p);var m=M6.map(-2,6,-3,3,{l:30,b:30});M6.axes(m,{xt:[-1,1,2,3,4,5],yt:[-2,-1,1,2],grid:true});
  M6.vl(m,2,RED,m.y0,m.y1);TB('x = 2',m.X(2)-6,m.Y(-2.4),DRED,14,'right');
  M6.curve(m,function(x){return Math.log(x)+Math.log(x-2);},2.0001,6,BLUE,3.2);TB('ln x + ln(x − 2)',m.X(4.3),m.Y(2.35),BLUE_D,15);
  M6.hl(m,Math.log(3),ORA2,-2,6);TB('ln 3',m.X(-1.6),m.Y(1.5),DRED,15);
  ctx.fillStyle='rgba(226,75,74,.08)';ctx.fillRect(m.L,m.T,m.X(2)-m.L,m.h);TB('hors domaine',m.X(.0),m.Y(-1.2),DRED,13);
  var a=M6.seg(p,0,.6);if(a>0){M6.vl(m,3,GREEN,0,Math.log(3)*a,[4,3]);M6.pt(m,3,Math.log(3),GREEN,7);TB('x = 3',m.X(3),m.Y(-.35),DGREEN,16);}
  var b=M6.seg(p,.5,.9);if(b>0){ctx.globalAlpha=b;var cx=m.X(-1),cy=m.Y(0);LN(cx-9,cy-9,cx+9,cy+9,RED,3.2);LN(cx+9,cy-9,cx-9,cy+9,RED,3.2);TB('−1 rejeté',cx,cy-16,DRED,14);ctx.globalAlpha=1;}},
 /* 5 : bactéries */
 function(p){p=M6.pp(p);var m=M6.map(0,20,-2500,36000,{l:50,b:32});M6.axes(m,{xt:[0,3,6,9,12,15,18],yt:[10000,20000,30000],grid:true,yf:function(v){return (v/1000)+' k';},xl:'t (h)',yl:'N'});
  M6.curve(m,function(t){return 500*Math.pow(2,t/3);},0,20,BLUE,3.2);TB('N(t) = 500·2^(t/3)',m.X(2.2),m.Y(27000),BLUE_D,15,'left');
  M6.pt(m,0,500,BLUE_D,5);M6.hl(m,20000,ORA2,0,20);TB('20 000',m.X(.2),m.Y(21800),DRED,15,'left');
  var t=3*Math.log(40)/Math.LN2,a=M6.seg(p,0,.8);if(a>0){M6.vl(m,t,GREEN,0,20000*a,[4,3]);M6.pt(m,t,20000,GREEN,7);if(a>.85)TB('t ≈ '+M6.f(t,2)+' h',m.X(t)-8,m.Y(9000),DGREEN,16,'right');}},
 /* 6 : capital */
 function(p){p=M6.pp(p);var m=M6.map(0,30,.8,2.8,{l:42,b:32});M6.axes(m,{xt:[0,5,10,15,20,25,30],yt:[1,1.5,2,2.5],grid:true,yd:1,xl:'années'});
  M6.curve(m,function(n){return Math.pow(1.035,n);},0,30,BLUE,3.2);TB('1,035ⁿ',m.X(26),m.Y(2.55),BLUE_D,16);
  M6.hl(m,2,ORA2,0,30);TB('2×',m.X(.5),m.Y(2.1),DRED,16,'left');
  var a=M6.seg(p,0,.7);if(a>0){var n0=Math.log(2)/Math.log(1.035);M6.vl(m,n0,GREEN,.8,.8+(2-.8)*a,[4,3]);
   if(a>.5){M6.pt(m,20,Math.pow(1.035,20),GREY,6);M6.pt(m,21,Math.pow(1.035,21),GREEN,7);TB('20 ans : 1,99',m.X(20)-6,m.Y(1.55),GREY,14,'right');TB('21 ans : 2,06',m.X(21)+8,m.Y(1.3),DGREEN,15,'left');}}},
 /* 7 : 4^x - 3*2^x - 4 = 0 */
 function(p){p=M6.pp(p);var m=M6.map(-2.5,5.5,-8,8,{l:30,b:30});M6.axes(m,{xt:[-2,-1,1,2,3,4,5],yt:[-6,-3,3,6],grid:true,xl:'u'});
  ctx.fillStyle='rgba(226,75,74,.08)';ctx.fillRect(m.L,m.T,m.X(0)-m.L,m.h);TB('u = 2ˣ > 0 seulement',m.X(-2.4),m.Y(6.6),DRED,13,'left');
  M6.curve(m,function(u){return u*u-3*u-4;},-2.5,5.5,BLUE,3.2);TB('u² − 3u − 4',m.X(4.6),m.Y(3.6),BLUE_D,16);TB('(avec u = 2ˣ)',m.X(3.5),m.Y(-6.5),GREY,14);
  var a=M6.seg(p,0,.6);if(a>0){ctx.globalAlpha=a;M6.pt(m,4,0,GREEN,7.5);TB('u = 4 ⇒ x = 2',m.X(4),m.Y(-1.7),DGREEN,16);
   var cx=m.X(-1),cy=m.Y(0);LN(cx-8,cy-8,cx+8,cy+8,RED,3.2);LN(cx+8,cy-8,cx-8,cy+8,RED,3.2);TB('u = −1',cx-12,cy-14,DRED,15,'right');ctx.globalAlpha=1;}},
 /* 8 : thé qui refroidit */
 function(p){p=M6.pp(p);var k=Math.log(7/3)/10,f=function(t){return 20+70*Math.exp(-k*t);};var m=M6.map(0,60,0,100,{l:46,b:32});
  M6.axes(m,{xt:[0,10,20,30,40,50,60],yt:[20,40,60,80,100],grid:true,xl:'t (min)',yl:'°C'});
  M6.hl(m,20,GREY,0,60);TB('pièce : 20 °C',m.X(59),m.Y(12),GREY,14,'right');
  M6.curve(m,f,0,60,BLUE,3.2);M6.pt(m,0,90,BLUE_D,6);TB('90 °C',m.X(1.5),m.Y(95),BLUE_D,14,'left');M6.pt(m,10,50,BLUE_D,6);TB('50 °C à 10 min',m.X(11.5),m.Y(56),BLUE_D,14,'left');
  var a=M6.seg(p,0,.8);if(a>0){var t=Math.log(14)/k;M6.hl(m,25,GREEN,0,t*a,[4,3]);M6.vl(m,t,GREEN,0,25*a,[4,3]);if(a>.85){M6.pt(m,t,25,GREEN,7);TB('25 °C à '+M6.f(t,1)+' min',m.X(t)-4,m.Y(37),DGREEN,15,'right');}}},
 /* 9 : piège du facteur commun */
 function(p){p=M6.pp(p);var m=M6.map(-3.5,4.5,-3.5,3,{l:30,b:30});M6.axes(m,{xt:[-3,-2,-1,1,2,3,4],yt:[-3,-2,-1,1,2],grid:true});
  M6.vl(m,1,RED,m.y0,m.y1);M6.vl(m,-1,RED,m.y0,m.y1,[2,4]);
  M6.curve(m,function(x){return Math.log(x*x-1);},-3.5,-1.0001,BLUE,3.2);M6.curve(m,function(x){return Math.log(x*x-1);},1.0001,4.5,BLUE,3.2);
  M6.curve(m,function(x){return Math.log(3*(x-1));},1.0001,4.5,ORA2,3.2,[7,4]);
  TB('ln(x² − 1)',m.X(-3.4),m.Y(2.1),BLUE_D,15,'left');TB('ln 3 + ln(x − 1)',m.X(2.5),m.Y(-2.6),DRED,15,'left');
  var a=M6.seg(p,0,.6);if(a>0){ctx.globalAlpha=a;M6.pt(m,2,Math.log(3),GREEN,7.5);TB('x = 2 ✓',m.X(2)+8,m.Y(Math.log(3))+22,DGREEN,16,'left');
   DOT(m.X(1),m.Y(0),7,'#fff');DOT(m.X(1),m.Y(0),7,RED,false);TB('x = 1 exclu',m.X(1)-9,m.Y(0)-14,DRED,14,'right');ctx.globalAlpha=1;}}
]);
})();
