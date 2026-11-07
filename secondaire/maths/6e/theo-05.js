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
/* ===== Chapitre 5 : droites et plans dans l'espace ===== */
(function(){
var R=SFA;
function nrm(v){var l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function add(a,b,k){k=k==null?1:k;return [a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];}
function corners(c,u,v,a,b){return [[-1,-1],[1,-1],[1,1],[-1,1]].map(function(k){return add(add(c,u,k[0]*a),v,k[1]*b);});}
/* vue 3D ajustée automatiquement aux points donnés */
function view(pts,az,el,mx,my,txt){var Q=M6.rot(0,0,1,az,el),x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
 pts.forEach(function(q){var r=Q(q[0],q[1],q[2]);x0=Math.min(x0,r.x);x1=Math.max(x1,r.x);y0=Math.min(y0,r.y);y1=Math.max(y1,r.y);});
 var rw=W-(txt||0)-2*mx,s=Math.min(rw/(x1-x0||1),(H-2*my)/(y1-y0||1));
 return M6.rot(mx+(txt||0)+rw/2-s*(x0+x1)/2,H/2-s*(y0+y1)/2,s,az,el);}
function PL(P,c,u,v,a,b,col,al){var q=corners(c,nrm(u),nrm(v),a,b).map(function(w){return P(w[0],w[1],w[2]);});M6.poly(q,M6.rgba(col,al==null?.2:al),col,1.8);}
function SEG(P,a,b,col,w,dash){M6.L3(P,a,b,col,w,dash);}
function PT(P,a,col,r){var q=P(a[0],a[1],a[2]);DOT(q.x,q.y,r||5.5,col);return q;}
function ARR(P,a,b,col,lab,w){var A1=P(a[0],a[1],a[2]),B1=P(b[0],b[1],b[2]);arrow(A1.x,A1.y,B1.x-A1.x,B1.y-A1.y,col,lab||'',w||3);}
function LAB(P,a,s,col,dx,dy,size,al){var q=P(a[0],a[1],a[2]);TB(s,q.x+(dx||0),q.y+(dy||0),col||INK,size||15,al||'center');}

R.theo("c05",{
 icon:function(){
  var P=view([[-3,-3,0],[3,-3,0],[3,3,0],[-3,3,0],[0,0,3.5]],.55,.5,W*.04,H*.1,0);
  var P2=M6.rot(W*.27,H*.62,H*.075,.55,.5);
  PL(P2,[0,0,0],[1,0,0],[0,1,0],3,3,BLUE,.18);ARR(P2,[0,0,0],[0,0,3.6],RED,'');SEG(P2,[-2,-2,2.3],[2.4,2.4,-.6],GREEN,3);PT(P2,[0,0,0],INK,5);
  TB('n',W*.27+8,H*.14+4,DRED,20);
  TB('ax + by + cz = d',W*.7,H*.4,BLUE_D,24);TB('M = A + t·u',W*.7,H*.6,ORANGE,24);TB('droites et plans de l\'espace',W*.7,H*.82,GREY,14);},
 anim:function(t){
  var c=[.75,2.25,-.75],n=[1,2,-1],u1=[2,-1,0],u2=[-1,-2,-5],A=[1,2,0],dir=[1,-1,3];
  var tx=W*.40;
  var corn=corners(c,nrm(u1),nrm(u2),3.4,3.4);
  var pts=corn.concat([add(A,dir,-1.9),add(A,dir,1.6)]);var P0=view(pts.map(function(q){return add(q,c,-1);}),.0,.5,10,14,0);
  /* vue qui tourne lentement */
  var az=.9+.5*Math.sin(t*.012);var Q=view(pts.map(function(q){return add(q,c,-1);}),az,.5,14,18,W*.0);
  var P=function(x,y,z){return Q(x-c[0],y-c[1],z-c[2]);};
  /* décalage à gauche pour laisser la place au texte */
  ctx.save();ctx.translate(-W*.13,0);
  PL(P,c,u1,u2,3.4,3.4,BLUE,.18);
  var s=.5-.5*Math.cos(t*.02),tt=-1.9+3.5*s,M=add(A,dir,tt);
  SEG(P,add(A,dir,-1.9),add(A,dir,1.6),ORA2,3);
  var I=add(A,dir,-.25);ARR(P,I,add(I,nrm(n),2.2),RED,'',3);LAB(P,add(I,nrm(n),2.7),'n',DRED,0,0,18);
  PT(P,I,GREEN,7);PT(P,M,ORA2,6);ctx.restore();
  var x=W*.60;
  TB('d : M(t) = (1 + t ; 2 − t ; 3t)',x,40,DRED,17,'left');TB('π : x + 2y − z = 6   n = (1 ; 2 ; −1)',x,70,BLUE_D,16,'left');
  TB('(1 + t) + 2(2 − t) − 3t = 6',x,118,INK,16,'left');TB('5 − 4t = 6  ⇒  t = −1/4',x,146,INK,16,'left');
  TB('M(−1/4) = (3/4 ; 9/4 ; −3/4)',x,186,DGREEN,17,'left');TB('t = '+M6.f(tt,2),x,240,ORANGE,16,'left');
  TB(Math.abs(tt+.25)<.12?'le point mobile traverse le plan':'le point mobile suit la droite',x,268,GREY,14,'left');},
 th:'<div class="tcard"><b class="h">Repère, vecteurs, droites</b><p>Dans un repère orthonormé, A(x<sub>A</sub> ; y<sub>A</sub> ; z<sub>A</sub>) et AB = (x<sub>B</sub> − x<sub>A</sub> ; y<sub>B</sub> − y<sub>A</sub> ; z<sub>B</sub> − z<sub>A</sub>) ; ‖AB‖ = √(Δx² + Δy² + Δz²). Une droite d est déterminée par un point A et un <b>vecteur directeur</b> u : M ∈ d ⇔ AM = t·u. D\'où les <b>équations paramétriques</b> x = x<sub>A</sub> + a·t, y = y<sub>A</sub> + b·t, z = z<sub>A</sub> + c·t (t ∈ ℝ).</p><p><b>Exemple.</b> A(1 ; 2 ; −1), B(4 ; 0 ; 3) : u = AB = (3 ; −2 ; 4). Pour savoir si M(x ; y ; z) est sur d, on cherche un même t qui vérifie les trois équations.</p></div>'+
 '<div class="tcard"><b class="h">Plans : équation cartésienne et vecteur normal</b><p>Un plan a une équation <b>ax + by + cz = d</b> ; le vecteur n = (a ; b ; c) est un <b>vecteur normal</b> (perpendiculaire à tout vecteur du plan). Plan passant par P(x₀ ; y₀ ; z₀) et perpendiculaire à n : a(x − x₀) + b(y − y₀) + c(z − z₀) = 0.</p><p><b>Exemple chiffré.</b> P(1 ; 2 ; 3), n = (2 ; −1 ; 4) : 2(x − 1) − (y − 2) + 4(z − 3) = 0, soit 2x − y + 4z = 12. Pour un plan défini par trois points, on écrit que les trois points vérifient ax + by + cz = d (système 3 × 3).</p></div>'+
 '<div class="tcard"><b class="h">Positions relatives</b><p><b>Droite et plan</b> : on remplace x, y, z de la droite (en t) dans l\'équation du plan. Une seule solution t : la droite perce le plan en un point. Équation impossible (0 = k, k ≠ 0) : droite parallèle sans point commun. Équation toujours vraie (0 = 0) : droite contenue dans le plan.</p><p><b>Deux plans</b> : si les normales sont colinéaires, les plans sont parallèles (confondus si les équations sont proportionnelles, y compris le second membre) ; sinon ils sont sécants suivant une droite, qu\'on obtient en résolvant le système et en exprimant deux inconnues en fonction de la troisième.</p></div>'+
 '<div class="tcard"><b class="h">Un calcul complet, et la distance (6 h)</b><p><b>Exemple chiffré.</b> d : x = 1 + t, y = 2 − t, z = 3t et π : x + 2y − z = 6. On remplace : (1 + t) + 2(2 − t) − 3t = 6, donc 5 − 4t = 6 et t = −1/4. Le point d\'intersection est (3/4 ; 9/4 ; −3/4).</p><p><b>Extension 6 h : distance d\'un point à un plan.</b> d(M ; π) = |ax₀ + by₀ + cz₀ − d| / √(a² + b² + c²). Exemple : M(1 ; 2 ; 3), π : 2x − y + 2z = 1 : |2 − 2 + 6 − 1| / 3 = 5/3. Le pied H de la perpendiculaire est M − t·n avec t = 5/9 : H(−1/9 ; 23/9 ; 17/9).</p></div>'
});

R.figs("c05",[
 /* 0 : vecteur directeur AB */
 function(p){p=M6.pp(p);var A1=[1,2,-1],B1=[4,0,3];var P=view([[0,0,0],[5,0,0],[0,3,0],[0,0,4],[0,0,-1.5],A1,B1],.6,.45,40,44,0);
  M6.ax3(P,3.6,AX);
  var E=add(A1,add(B1,A1,-1),-.35),F=add(B1,add(B1,A1,-1),.35);SEG(P,E,F,GREY,1.6,[6,4]);
  var a=M6.seg(p,0,.7);if(a>0){var q=add(A1,add(B1,A1,-1),a);ARR(P,A1,q,ORA2,'',3.6);}
  PT(P,A1,BLUE,7);PT(P,B1,BLUE,7);LAB(P,A1,'A(1 ; 2 ; −1)',BLUE_D,-6,22,15,'right');LAB(P,B1,'B(4 ; 0 ; 3)',BLUE_D,10,-12,15,'left');
  if(a>.9){var mid=add(A1,add(B1,A1,-1),.5);var q2=P(mid[0],mid[1],mid[2]);tag('AB = (3 ; −2 ; 4)',q2.x+60,q2.y+34,DRED,17);}},
 /* 1 : vecteur normal */
 function(p){p=M6.pp(p);var n=[2,-3,1],u=[3,2,0],v=cross(n,u),c=[2.5,0,0];
  var P=view(corners(c,nrm(u),nrm(v),3,3).concat([add(c,nrm(n),3.6),add(c,nrm(n),-.3)]),.7,.5,40,30,0);
  PL(P,c,u,v,3,3,BLUE,.2);var q=PT(P,c,INK,5);
  var a=M6.seg(p,0,.7);if(a>0){ARR(P,c,add(c,nrm(n),3.4*a),RED,'',3.8);if(a>.9)LAB(P,add(c,nrm(n),3.4),'n = (2 ; −3 ; 1)',DRED,12,-8,17,'left');}
  var q2=P(c[0],c[1],c[2]);var a2=P(add(c,nrm(u),-2.6)[0],add(c,nrm(u),-2.6)[1],add(c,nrm(u),-2.6)[2]);
  TB('π : 2x − 3y + z = 5',W*.5,H*.95,BLUE_D,17);},
 /* 2 : equations parametriques */
 function(p){p=M6.pp(p);var A1=[1,-2,3],u=[2,1,-1],M=[5,0,1];var P=view([A1,M,add(A1,u,-.8),add(A1,u,2.8),[0,0,0],[0,0,4],[5,0,0]],.55,.45,36,30,0);
  M6.ax3(P,2,AX);SEG(P,add(A1,u,-.8),add(A1,u,2.8),ORA2,2.6);ARR(P,A1,add(A1,u),RED,'',3.4);PT(P,A1,BLUE,7);LAB(P,A1,'A',BLUE_D,-14,18,17);LAB(P,add(A1,u,.5),'u',DRED,-4,-14,17);
  var a=M6.seg(p,0,.7);var q=P(M[0],M[1],M[2]);
  if(a<=0){DOT(q.x,q.y,8,'#fff');DOT(q.x,q.y,8,GREY,false);TB('M ?',q.x+12,q.y-8,GREY,16,'left');}
  else{PT(P,M,GREEN,8);TB('M = A + 2u  ∈ d',q.x+12,q.y-10,DGREEN,16,'left');}
  TB('x = 1 + 2t · y = −2 + t · z = 3 − t',W*.5,H*.94,DRED,15);},
 /* 3 : plan perpendiculaire a un vecteur */
 function(p){p=M6.pp(p);var Pp=[1,2,3],n=[2,-1,4],u=[1,2,0],v=cross(n,u);
  var P=view(corners(Pp,nrm(u),nrm(v),3,3).concat([add(Pp,nrm(n),3.4),add(Pp,nrm(n),-.5)]),.7,.5,40,30,0);
  var a=M6.seg(p,0,.7);if(a>0){PL(P,Pp,u,v,3,3,BLUE,.2*a);}
  ARR(P,Pp,add(Pp,nrm(n),3.1),RED,'',3.8);PT(P,Pp,INK,6);LAB(P,Pp,'P(1 ; 2 ; 3)',INK,-10,22,15,'right');LAB(P,add(Pp,nrm(n),3.1),'n = (2 ; −1 ; 4)',DRED,10,-6,16,'left');
  if(a>.9)TB('2x − y + 4z = 12',W*.5,H*.95,BLUE_D,18);},
 /* 4 : droite et plan secants */
 function(p){p=M6.pp(p);var c=[.75,2.25,-.75],n=[1,2,-1],u1=[2,-1,0],u2=[-1,-2,-5],A1=[1,2,0],dir=[1,-1,3];
  var P=view(corners(c,nrm(u1),nrm(u2),3.4,3.4).concat([add(A1,dir,-1.9),add(A1,dir,1.6)]),.9,.5,34,28,0);
  PL(P,c,u1,u2,3.4,3.4,BLUE,.18);SEG(P,add(A1,dir,-1.9),add(A1,dir,1.6),ORA2,3);
  LAB(P,add(A1,dir,1.6),'d',DRED,12,0,18);var q=P(c[0]+1.6,c[1]-.3,c[2]-1);TB('π',q.x+40,q.y+30,BLUE_D,18);
  var a=M6.seg(p,0,.7);if(a>0){var I=P(c[0],c[1],c[2]);DOT(I.x,I.y,8*a,GREEN);if(a>.9)tag('t = −1/4  →  (3/4 ; 9/4 ; −3/4)',I.x+10,I.y-26,DGREEN,16);}},
 /* 5 : droite parallele ou contenue */
 function(p){p=M6.pp(p);var n=[1,2,0],u=[2,-1,0],z=[0,0,1],c1=[5,0,0],c2=[1,0,0],A1=[1,0,2],dir=[2,-1,1];
  var P=view(corners(c1,nrm(u),z,3.4,2.6).concat(corners(c2,nrm(u),z,3.4,2.6)).concat([add(A1,dir,-1.5),add(A1,dir,1.5)]),.9,.4,30,26,0);
  PL(P,c1,u,z,3.4,2.6,RED,.14);PL(P,c2,u,z,3.4,2.6,GREEN,.2);SEG(P,add(A1,dir,-1.5),add(A1,dir,1.5),ORA2,3.4);
  var q1=P(c1[0],c1[1],c1[2]+2.1),q2=P(c2[0],c2[1],c2[2]+2.1);TB('π₁ : x + 2y = 5',W*.74,H*.08,DRED,16);TB('π₂ : x + 2y = 1',W*.26,H*.08,DGREEN,16);LAB(P,add(A1,dir,1.5),'d',DRED,10,-6,18);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;tag('d ⊂ π₂',W*.3,H*.9,DGREEN,17);tag('d // π₁ (aucun point commun)',W*.7,H*.9,DRED,16);ctx.globalAlpha=1;}},
 /* 6 : intersection de deux plans */
 function(p){p=M6.pp(p);var c=[1,1,1],n1=[1,1,1],n2=[2,-1,1],u1=[1,-1,0],v1=[1,1,-2],u2=[0,1,1],v2=[-2,-2,2],dir=[2,1,-3];
  var P=view(corners(c,nrm(u1),nrm(v1),3,3).concat(corners(c,nrm(u2),nrm(v2),3,3)),.8,.5,34,26,0);
  PL(P,c,u1,v1,3,3,BLUE,.18);PL(P,c,u2,v2,3,3,VIOLET,.2);
  var q1=P(c[0]+1.5,c[1]-1.5,c[2]+.5),q2=P(c[0]-1.4,c[1]-1.6,c[2]+2.1);TB('π₁ : x + y + z = 3',W*.04,H*.1,BLUE_D,15,'left');TB('π₂ : 2x − y + z = 2',W*.04,H*.18,VIOLET==='#7F77DD'?'#5249B5':VIOLET,15,'left');
  var a=M6.seg(p,0,.7);if(a>0){SEG(P,add(c,dir,-1.4*a),add(c,dir,1.4*a),ORA2,4.2);if(a>.9){var e=P(c[0]+dir[0]*1.4,c[1]+dir[1]*1.4,c[2]+dir[2]*1.4);tag('d : (−1 + 2t ; t ; 4 − 3t)',W*.62,H*.93,DRED,16);}}},
 /* 7 : plans confondus ? */
 function(p){p=M6.pp(p);var n=[2,-1,3],u=[1,2,0],v=cross(n,u),c=[2,0,0];
  var P=view(corners(c,nrm(u),nrm(v),3,3).concat([add(c,nrm(n),3.4),add(c,nrm(n),-3.4)]),.7,.5,40,30,0);
  PL(P,c,u,v,3,3,BLUE,.2);ARR(P,c,add(c,nrm(n),2.8),RED,'',3.6);LAB(P,add(c,nrm(n),2.8),'nα = (2 ; −1 ; 3)',DRED,8,-8,15,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;var qq=add(c,nrm(n),-3.0);ARR(P,c,add(c,nrm(n),-3.0*a),GREEN,'',3.6);LAB(P,add(c,nrm(n),-3.0),'nβ = (−4 ; 2 ; −6)',DGREEN,-8,20,15,'right');
   PL(P,c,u,v,3.3,3.3,GREEN,.0);ctx.setLineDash([6,4]);ctx.strokeStyle=GREEN;ctx.lineWidth=2.4;var q4=corners(c,nrm(u),nrm(v),3.25,3.25).map(function(w){return P(w[0],w[1],w[2]);});ctx.beginPath();q4.forEach(function(w,i){i?ctx.lineTo(w.x,w.y):ctx.moveTo(w.x,w.y);});ctx.closePath();ctx.stroke();ctx.setLineDash([]);
   tag('β = −2 × α : plans confondus',W*.5,H*.94,DGREEN,17);ctx.globalAlpha=1;}
  TB('α : 2x − y + 3z = 4',W*.04,H*.08,BLUE_D,15,'left');TB('β : −4x + 2y − 6z = −8',W*.04,H*.16,DGREEN,15,'left');},
 /* 8 : distance point-plan */
 function(p){p=M6.pp(p);var n=[2,-1,2],u=[1,2,0],v=cross(n,u),H0=[-1/9,23/9,17/9],M=[1,2,3];
  var P=view(corners(H0,nrm(u),nrm(v),3,3).concat([M]),.7,.5,40,30,0);
  PL(P,H0,u,v,3,3,BLUE,.2);PT(P,M,RED,7);LAB(P,M,'M(1 ; 2 ; 3)',DRED,12,-6,16,'left');
  var a=M6.seg(p,0,.7);if(a>0){var Hq=add(M,add(H0,M,-1),a);SEG(P,M,Hq,GREEN,3.4);PT(P,Hq,GREEN,6.5);
   if(a>.9){LAB(P,H0,'H',DGREEN,-14,20,17);var m2=add(M,add(H0,M,-1),.5),q=P(m2[0],m2[1],m2[2]);tag('d = 5/3',q.x+46,q.y,DGREEN,18);}}
  TB('π : 2x − y + 2z = 1',W*.5,H*.95,BLUE_D,16);},
 /* 9 : cube et diagonale */
 function(p){p=M6.pp(p);var V=function(x,y,z){return [x,y,z];};var pts=[];for(var i=0;i<8;i++)pts.push([(i&1)*4,((i>>1)&1)*4,((i>>2)&1)*4]);
  var P=view(pts,.75,.38,40,40,0);var ed=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
  ed.forEach(function(e){SEG(P,pts[e[0]],pts[e[1]],GREY,1.6);});
  var B1=[4,0,0],D1=[0,4,0],E1=[0,0,4],G1=[4,4,4],O=[0,0,0];
  var a=M6.seg(p,0,.6);if(a>0){M6.poly([B1,D1,E1].map(function(w){return P(w[0],w[1],w[2]);}),'rgba(55,138,221,'+(.28*a)+')',BLUE,2);}
  SEG(P,O,G1,ORA2,3.4);[['A',O,-14,16],['B',B1,12,10],['D',D1,-12,-8],['E',E1,-12,-6],['G',G1,12,-6]].forEach(function(r){PT(P,r[1],INK,4.5);LAB(P,r[1],r[0],INK,r[2],r[3],16);});
  if(a>.9){var I=[4/3,4/3,4/3];PT(P,I,GREEN,7.5);var q=P(I[0],I[1],I[2]);tag('I(4/3 ; 4/3 ; 4/3) · AI/AG = 1/3',W*.5,H*.06,DGREEN,16);}}
]);
})();
