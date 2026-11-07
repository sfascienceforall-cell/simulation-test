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
/* ===== Chapitre 6 : systèmes linéaires 3 x 3 ===== */
(function(){
var R=SFA;
function nrm(v){var l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function add(a,b,k){k=k==null?1:k;return [a[0]+k*b[0],a[1]+k*b[1],a[2]+k*b[2]];}
function corners(c,u,v,a,b){return [[-1,-1],[1,-1],[1,1],[-1,1]].map(function(k){return add(add(c,u,k[0]*a),v,k[1]*b);});}
function view(pts,az,el,mx,my,txt){var Q=M6.rot(0,0,1,az,el),x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
 pts.forEach(function(q){var r=Q(q[0],q[1],q[2]);x0=Math.min(x0,r.x);x1=Math.max(x1,r.x);y0=Math.min(y0,r.y);y1=Math.max(y1,r.y);});
 var rw=W-(txt||0)-2*mx,s=Math.min(rw/(x1-x0||1),(H-2*my)/(y1-y0||1));
 return M6.rot(mx+(txt||0)+rw/2-s*(x0+x1)/2,H/2-s*(y0+y1)/2,s,az,el);}
function PL(P,c,u,v,a,b,col,al){var q=corners(c,nrm(u),nrm(v),a,b).map(function(w){return P(w[0],w[1],w[2]);});M6.poly(q,M6.rgba(col,al==null?.2:al),col,1.8);}
function PT(P,a,col,r){var q=P(a[0],a[1],a[2]);DOT(q.x,q.y,r||5.5,col);return q;}
function LAB(P,a,s,col,dx,dy,size,al){var q=P(a[0],a[1],a[2]);TB(s,q.x+(dx||0),q.y+(dy||0),col||INK,size||15,al||'center');}
var VD='#5249B5';
/* plan de normale n, passant par c, contenant la direction d (pour un faisceau autour d'une droite) */
function PLd(P,c,n,d,a,col,al){PL(P,c,d,cross(n,d),a,a,col,al);}
function eqrow(x,y,s,col,size){TB(s,x,y,col||INK,size||16,'left');}

R.theo("c06",{
 icon:function(){
  ctx.strokeStyle=BLUE;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(W*.1,H*.2);ctx.quadraticCurveTo(W*.04,H*.5,W*.1,H*.8);ctx.stroke();
  TB('x +  y +  z = 6',W*.15,H*.30,BLUE_D,24,'left');TB('2x −  y +  z = 3',W*.15,H*.52,BLUE_D,24,'left');TB('x + 2y −  z = 2',W*.15,H*.74,BLUE_D,24,'left');
  TB('→ (1 ; 2 ; 3)',W*.62,H*.93,ORANGE,22,'left');},
 anim:function(t){
  var cyc=Math.floor(t/260)%3,az=t*.012+.3,s=Math.min(H/5.6,W*.14),cx=W*.28,cy=H*.52;
  var P=M6.rot(cx,cy,s,az,.5),i,k;
  var titre=['Solution unique','Indéterminé','Impossible'],sous=['les trois plans se coupent en un point','les trois plans se coupent selon une droite','aucun point commun aux trois plans'];
  var tx=W*.56;
  if(cyc===0){PL(P,[0,0,0],[0,1,0],[0,0,1],2,2,BLUE,.18);PL(P,[0,0,0],[1,0,0],[0,0,1],2,2,GREEN,.18);PL(P,[0,0,0],[1,0,0],[0,1,0],2,2,ORA2,.18);PT(P,[0,0,0],RED,8);}
  else if(cyc===1){for(i=0;i<3;i++){var th=i*Math.PI/3;PL(P,[0,0,0],[Math.cos(th),Math.sin(th),0],[0,0,1],2.1,2.1,[BLUE,GREEN,ORA2][i],.17);}M6.L3(P,[0,0,-2.1],[0,0,2.1],RED,4.2);}
  else{for(i=0;i<3;i++){var ph=Math.PI/2+i*2*Math.PI/3,c0=[Math.cos(ph),Math.sin(ph),0];PL(P,c0,[-Math.sin(ph),Math.cos(ph),0],[0,0,1],2.4,2,[BLUE,GREEN,ORA2][i],.17);}
   for(i=0;i<3;i++){var a1=Math.PI/2+i*2*Math.PI/3,a2=a1+2*Math.PI/3,am=(a1+a2)/2,r=2;var vx=Math.cos(am)*2,vy=Math.sin(am)*2;M6.L3(P,[vx,vy,-1.9],[vx,vy,1.9],GREY,2.2,[5,4]);}}
  TB(titre[cyc],tx,60,[DGREEN,DRED,DRED][cyc]==='x'?INK:[DGREEN,ORANGE,DRED][cyc],24,'left');
  TB(sous[cyc],tx,92,INK,15,'left');
  var algebre=[['Après élimination :','x = a ; y = b ; z = c','une seule solution (a ; b ; c)'],['Après élimination :','une ligne devient 0 = 0','z = paramètre : x, y en dépendent'],['Après élimination :','une ligne devient 0 = k  (k ≠ 0)','le système n\'a aucune solution']][cyc];
  TB(algebre[0],tx,150,GREY,15,'left');TB(algebre[1],tx,180,BLUE_D,16,'left');TB(algebre[2],tx,208,DRED,15,'left');
  TB('(un plan = une équation)',tx,270,GREY,14,'left');
  for(i=0;i<3;i++){DOT(tx+6+i*20,246,6,[BLUE,GREEN,ORA2][i]);}},
 th:'<div class="tcard"><b class="h">Système 3 × 3 et opérations licites</b><p>Un système de trois équations à trois inconnues (x ; y ; z). On le transforme en un système <b>équivalent</b> (mêmes solutions) par les opérations sur les lignes : échanger deux lignes ; multiplier une ligne par k ≠ 0 ; ajouter à une ligne un multiple d\'une autre. Ces opérations s\'appliquent aux <b>deux membres</b> : L₂ ← L₂ − 2·L₁ modifie aussi le second membre. <b>Piège</b> : multiplier une ligne par 0 fait perdre de l\'information.</p></div>'+
 '<div class="tcard"><b class="h">Élimination de Gauss</b><p>But : obtenir un système <b>triangulaire</b> (x, y, z puis y, z puis z seul), puis « remonter » : on trouve z, puis y, puis x.</p><p><b>Exemple chiffré.</b> x + y + z = 6 ; 2x − y + z = 3 ; x + 2y − z = 2.<br>L₂ ← L₂ − 2L₁ : −3y − z = −9. L₃ ← L₃ − L₁ : y − 2z = −4.<br>L₃ ← 3L₃ + L₂ : −7z = −21, donc z = 3. Puis −3y − 3 = −9, donc y = 2. Enfin x + 2 + 3 = 6, donc x = 1. Solution (1 ; 2 ; 3). Vérification dans les trois équations de départ : 6, 3 et 2 ✓.</p></div>'+
 '<div class="tcard"><b class="h">Nature des solutions et interprétation géométrique</b><p>Chaque équation est un plan. Après élimination :<br>• <b>solution unique</b> : les trois plans se coupent en un point ;<br>• <b>indéterminé</b> (une ligne devient 0 = 0) : une infinité de solutions, une droite (deux inconnues liées) ou un plan (trois plans confondus) ;<br>• <b>impossible</b> (une ligne devient 0 = k avec k ≠ 0) : pas de solution (plans parallèles, ou disposés en « prisme »).</p><p><b>Exemple.</b> x + y + z = 2 ; x − y + z = 0 ; 2x + 2z = 2 : L₁ + L₂ donne exactement L₃. Il reste y = 1 et x + z = 1 : indéterminé, la droite (x ; 1 ; 1 − x), x ∈ ℝ. On paramètre en posant, par exemple, x = s : (s ; 1 ; 1 − s).</p></div>'+
 '<div class="tcard"><b class="h">Modéliser et discuter selon un paramètre</b><p><b>Modélisation</b> : on traduit les données par des équations (prix de fruits, courants d\'un circuit par les lois de Kirchhoff, parabole y = ax² + bx + c passant par trois points…) puis on résout.</p><p><b>Exemple chiffré.</b> Parabole par A(1 ; 2), B(2 ; 3), C(−1 ; 6) : a + b + c = 2 ; 4a + 2b + c = 3 ; a − b + c = 6. On trouve a = 1, b = −2, c = 3 : y = x² − 2x + 3.</p><p><b>Extension 6 h : discussion à paramètre.</b> Dans x + y + z = 2 ; x − y + z = 0 ; 2x + az = 2, on obtient y = 1 et x + z = 1, puis (a − 2)z = 0. Si a ≠ 2 : z = 0, solution unique (1 ; 1 ; 0). Si a = 2 : indéterminé. On dit que le déterminant du système est nul pour a = 2.</p></div>'
});

R.figs("c06",[
 /* 0 : systeme triangulaire */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.075,W*.04));var x=W*.07;
  var rows=[['x + y + z = 6',x],['y + 2z = 8',x+W*.07],['z = 3',x+W*.14]];
  rows.forEach(function(r,i){var y=H*.3+i*H*.2;M6.box(r[1]-8,y-fs*1.1,W*.34,fs*1.9,'#f4f8fd',BLUE,2);TB(r[0],r[1]+4,y+fs*.25,BLUE_D,fs+2,'left');});
  var sol=[['z = 3',2,DGREEN],['y = 8 − 2·3 = 2',1,DGREEN],['x = 6 − 2 − 3 = 1',0,DGREEN]];
  sol.forEach(function(s,k){var a=M6.seg(p,k*.28,k*.28+.3);if(a>0){ctx.globalAlpha=a;var y=H*.3+s[1]*.2*H;arrow(W*.55,y,W*.06,0,GREEN,'',3);M6.box(W*.64,y-fs*1.1,W*.3,fs*1.9,'#e7f6f0',GREEN,2);TB(s[0],W*.65,y+fs*.25,DGREEN,fs+1,'left');ctx.globalAlpha=1;}});
  TB('on remonte : z, puis y, puis x',W*.5,H*.93,GREY,14);if(M6.seg(p,.8,1)>0){ctx.globalAlpha=M6.seg(p,.8,1);TB('(x ; y ; z) = (1 ; 2 ; 3)',W*.5,H*.11,DRED,Math.round(fs*1.2));ctx.globalAlpha=1;}},
 /* 1 : operation licite */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.08,W*.042));
  function row(y,lab,txt,col,al){ctx.globalAlpha=al;M6.box(W*.06,y-fs*1.15,W*.6,fs*2.1,col+'18',col,2);TB(lab,W*.09,y+fs*.3,dk(col),fs+2,'left');TB(txt,W*.2,y+fs*.3,INK,fs+3,'left');ctx.globalAlpha=1;}
  row(H*.14,'L₁','x + y = 3',BLUE,1);row(H*.32,'L₂','2x + 3y = 8',BLUE,1);
  var a=M6.seg(p,0,.6);if(a>0){arrow(W*.72,H*.42,0,0,GREY,'',1);ctx.globalAlpha=a;TB('L₂ ← L₂ − 2·L₁',W*.5,H*.52,ORANGE,fs+2);TB('(2x − 2x) + (3y − 2y) = 8 − 2·3',W*.5,H*.62,INK,fs);ctx.globalAlpha=1;
   row(H*.78,'L₂′','y = 2',GREEN,a);}
  var b=M6.seg(p,.5,1);if(b>0){ctx.globalAlpha=b;TB('le second membre change aussi',W*.5,H*.95,DRED,fs);ctx.globalAlpha=1;}
  },
 /* 2 : Gauss : trois matrices */
 function(p){p=M6.pp(p);var mats=[[[1,1,1,6],[2,-1,1,3],[1,2,-1,2]],[[1,1,1,6],[0,-3,-1,-9],[0,1,-2,-4]],[[1,1,1,6],[0,-3,-1,-9],[0,0,-7,-21]]];
  var fs=Math.round(Math.min(H*.065,W*.033)),cw=fs*2.4,mw=cw*4+14,gap=(W-3*mw)/4;var labs=['départ','L₂−2L₁ ; L₃−L₁','3L₃+L₂'];
  mats.forEach(function(M,k){var a=k===0?1:M6.seg(p,(k-1)*.3,(k-1)*.3+.3);if(a<=0)return;ctx.globalAlpha=a;var x0=gap+k*(mw+gap),y0=H*.28;
   ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0+6,y0-fs);ctx.lineTo(x0,y0-fs);ctx.lineTo(x0,y0+fs*5.2);ctx.lineTo(x0+6,y0+fs*5.2);ctx.stroke();ctx.beginPath();ctx.moveTo(x0+mw-6,y0-fs);ctx.lineTo(x0+mw,y0-fs);ctx.lineTo(x0+mw,y0+fs*5.2);ctx.lineTo(x0+mw-6,y0+fs*5.2);ctx.stroke();
   LN(x0+cw*3+7,y0-fs*.8,x0+cw*3+7,y0+fs*5,GREY,1.2,[3,3]);
   M.forEach(function(r,i){r.forEach(function(v,j){var zero=(v===0&&j<3);TB(M6.f(v),x0+cw*(j+.5)+(j==3?14:6),y0+i*fs*2.2+fs*.9,zero?GREEN:INK,fs+3);});});
   TB(labs[k],x0+mw/2,y0+fs*6.8,GREY,fs-1);if(k<2)arrow(x0+mw+4,y0+fs*2.2,gap-10,0,GREY,'',2);ctx.globalAlpha=1;});
  var s=M6.seg(p,.65,1);if(s>0){ctx.globalAlpha=s;TB('−7z = −21 ⇒ z = 3 ; y = 2 ; x = 1',W*.5,H*.9,DGREEN,fs+4);ctx.globalAlpha=1;}
  TB('triangulariser (zéros en vert)',W*.5,H*.1,BLUE_D,fs+1);},
 /* 3 : prix au marche */
 function(p){p=M6.pp(p);var r=Math.min(H*.05,W*.025);var items=[['#E24B4A',0],['#1D9E75',1],['#E2B21C',2]];var rows=[[3,2,1,'5,30 €'],[1,4,2,'6,10 €'],[2,1,3,'5,60 €']];var fs=Math.round(Math.min(H*.06,W*.032));
  var yTop=H*.14;
  [['pomme','0,90 €'],['poire','0,80 €'],['banane','1,00 €']].forEach(function(f,i){var x=W*.12+i*W*.3;DOT(x,yTop,r*1.2,items[i][0]);var a=M6.seg(p,0,.5);TB(a>0?f[0]+' = '+f[1]:f[0]+' = ?',x+r*1.6,yTop+5,a>0?DGREEN:GREY,fs+1,'left');});
  rows.forEach(function(rw,i){var y=H*.36+i*H*.19;M6.box(W*.05,y-r*1.7,W*.9,r*3.4,'#f7f8fa',AX,1.5);var x=W*.09;
   for(var c=0;c<3;c++)for(var k=0;k<rw[c];k++){DOT(x,y,r,items[c][0]);x+=r*2.3;if(k==rw[c]-1)x+=r*1.2;}
   TB('= '+rw[3],W*.9,y+fs*.35,INK,fs+2,'right');});
  var b=M6.seg(p,.4,1);if(b>0){ctx.globalAlpha=b;TB('3×0,90 + 2×0,80 + 1,00 = 5,30 ✓',W*.5,H*.95,DGREEN,fs+1);ctx.globalAlpha=1;}},
 /* 4 : nature : faisceau (droite) */
 function(p){p=M6.pp(p);var c=[.5,1,.5],d=[1,0,-1],ns=[[1,1,1],[1,-1,1],[1,0,1]];var cols=[BLUE,GREEN,ORA2];
  var P=view(corners(c,nrm(d),[0,1,0],3.3,3.3),.8,.5,40,34,0);
  ns.forEach(function(n,i){PLd(P,c,n,d,3.1,cols[i],.17);});
  var a=M6.seg(p,0,.6);var e1=add(c,d,2.6),e2=add(c,d,-2.6);if(a>0){M6.L3(P,add(c,d,-2.6*a),add(c,d,2.6*a),RED,4.4);}
  TB('x + y + z = 2',W*.04,H*.07,BLUE_D,15,'left');TB('x − y + z = 0',W*.04,H*.15,DGREEN,15,'left');TB('2x + 2z = 2',W*.04,H*.23,DRED,15,'left');
  if(a>.9)tag('indéterminé : une droite de solutions',W*.5,H*.94,DRED,16);},
 /* 5 : parametrer les solutions */
 function(p){p=M6.pp(p);var c=[3,3,0],d=[-2,-1,3],ns=[[1,1,1],[2,-1,1],[3,0,2]];var cols=[BLUE,GREEN,ORA2];
  var P=view([add(c,d,-1.5),add(c,d,2.2),[0,0,0],[5,0,0],[0,4,0],[0,0,7]],.6,.45,40,34,0);
  M6.ax3(P,3.5,AX);ns.forEach(function(n,i){PLd(P,c,n,d,3.4,cols[i],.12);});
  M6.L3(P,add(c,d,-1.5),add(c,d,2.2),RED,3.4);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;[0,1,2].forEach(function(s){var q=add(c,d,s);PT(P,q,RED,6);var pq=P(q[0],q[1],q[2]);TB('s = '+s,pq.x+10,pq.y-8,DRED,15,'left');});
   tag('(x ; y ; z) = (3 − 2s ; 3 − s ; 3s)',W*.5,H*.95,DRED,16);ctx.globalAlpha=1;}},
 /* 6 : parabole par trois points */
 function(p){p=M6.pp(p);var f=function(x){return x*x-2*x+3;};var m=M6.map(-2,3.8,-.8,9.5,{l:34,b:30});M6.axes(m,{xt:[-1,1,2,3],yt:[2,4,6,8],grid:true});
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.curve(m,f,-2,3.8,BLUE,3.4);TB('y = x² − 2x + 3',m.X(-1.9),m.Y(8.9),BLUE_D,17,'left');ctx.globalAlpha=1;}
  [[1,2,'A(1 ; 2)',10,22],[2,3,'B(2 ; 3)',12,-10],[-1,6,'C(−1 ; 6)',12,-10]].forEach(function(q){M6.pt(m,q[0],q[1],RED,7);TB(q[2],m.X(q[0])+q[3],m.Y(q[1])+q[4],DRED,16,'left');});
  if(a>.9)TB('a = 1 · b = −2 · c = 3',m.X(3.7),m.Y(-.3),DGREEN,16,'right');},
 /* 7 : quand la solution est-elle unique */
 function(p){p=M6.pp(p);var m=M6.map(-1.4,3.4,-2.6,3,{l:34,b:30});M6.axes(m,{xt:[-1,1,2,3],yt:[-2,-1,1,2],grid:true,xl:'x',yl:'z'});
  M6.curve(m,function(x){return 1-x;},-1.4,3.4,ORA2,3.4);TB('x + z = 1',m.X(-1.3),m.Y(2.55),DRED,16,'left');
  [[1,'a = 1',BLUE,2.1],[-1,'a = −1',BLUE,-1.55],[4,'a = 4',BLUE,.2]].forEach(function(a){M6.curve(m,function(x){return (2-2*x)/a[0];},-1.4,3.4,BLUE+'aa',2.2);});
  TB('a = 1',m.X(-.2),m.Y(2.75),BLUE_D,14,'left');TB('a = −1',m.X(2.3),m.Y(2.75),BLUE_D,14,'left');TB('a = 4',m.X(-1.3),m.Y(1.25),BLUE_D,14,'left');TB('bleu : 2x + az = 2',m.X(-1.3),m.Y(-2.2),BLUE_D,14,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.pt(m,1,0,GREEN,8);TB('a ≠ 2 : (x ; z) = (1 ; 0)',m.X(1.15),m.Y(-.5),DGREEN,16,'left');
   M6.curve(m,function(x){return (2-2*x)/2;},-1.4,3.4,GREEN,4,[8,5]);TB('a = 2 : droites confondues',m.X(1.55),m.Y(-1.25),DGREEN,15,'left');ctx.globalAlpha=1;}},
 /* 8 : Kirchhoff */
 function(p){p=M6.pp(p);var L=W*.12,Rr=W*.88,T=H*.2,B=H*.8,xm=W*.55,xa=W*.5,xb=W*.76,fs=Math.round(Math.min(H*.06,W*.032));
  ctx.strokeStyle=INK;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(L,H*.44);ctx.lineTo(L,T);ctx.lineTo(W*.3,T);ctx.moveTo(W*.4,T);ctx.lineTo(xb,T);ctx.lineTo(xb,H*.4);ctx.moveTo(xb,H*.6);ctx.lineTo(xb,B);ctx.lineTo(L,B);ctx.lineTo(L,H*.56);ctx.moveTo(xa,T);ctx.lineTo(xa,H*.4);ctx.moveTo(xa,H*.6);ctx.lineTo(xa,B);ctx.stroke();
  LN(L-16,H*.44,L+16,H*.44,INK,3.6);LN(L-9,H*.56,L+9,H*.56,INK,3.6);TB('12 V',L-12,H*.5+5,BLUE_D,fs+2,'right');TB('+',L+22,H*.43,INK,fs);
  function resi(x1,y1,x2,y2,lab,col){var cx=(x1+x2)/2,cy=(y1+y2)/2,w=x1==x2?10:Math.abs(x2-x1)/2,h=x1==x2?Math.abs(y2-y1)/2:10;ctx.fillStyle='#fff';ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.beginPath();ctx.rect(cx-(x1==x2?9:w/2),cy-(x1==x2?h/2:9),x1==x2?18:w,x1==x2?h:18);ctx.fill();ctx.stroke();}
  resi(W*.3,T,W*.4,T,'',INK);TB('2 Ω',W*.35,T+30,INK,fs+2);
  ctx.fillStyle='#fff';ctx.strokeStyle=INK;ctx.lineWidth=2.6;[xa,xb].forEach(function(x){ctx.beginPath();ctx.rect(x-9,H*.4,18,H*.2);ctx.fill();ctx.stroke();});
  TB('4 Ω',xa-16,H*.52+5,INK,fs+2,'right');TB('6 Ω',xb+16,H*.52+5,INK,fs+2,'left');
  DOT(xa,T,4.5,INK);DOT(xa,B,4.5,INK);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;arrow(W*.42,T+0,36,0,RED,'',3);TB('I₁ = 30/11 ≈ 2,73 A',W*.3,T-16,DRED,fs+1,'left');arrow(xa,H*.27,0,30,RED,'',3);TB('I₂ ≈ 1,64 A',xa-12,H*.33,DRED,fs,'right');arrow(xb,H*.27,0,30,RED,'',3);TB('I₃ ≈ 1,09 A',xb-12,H*.33,DRED,fs,'right');ctx.globalAlpha=1;}
  TB('I₁ = I₂ + I₃ · 2I₁ + 4I₂ = 12 · 4I₂ = 6I₃',W*.5,H*.95,GREY,fs);},
 /* 9 : plan par trois points */
 function(p){p=M6.pp(p);var A1=[1,0,0],B1=[0,2,0],C1=[0,0,3],I=[6/11,6/11,6/11];var P=view([[0,0,0],[1.6,0,0],[0,2.6,0],[0,0,3.6],[1,1,1]],.65,.4,40,44,0);
  M6.ax3(P,1.9,AX);var q=[A1,B1,C1].map(function(w){return P(w[0],w[1],w[2]);});
  var a=M6.seg(p,0,.6);if(a>0)M6.poly(q,'rgba(55,138,221,'+(.26*a)+')',BLUE,2);else M6.poly(q,null,BLUE,2,[5,4]);
  PT(P,A1,BLUE,6);PT(P,B1,BLUE,6);PT(P,C1,BLUE,6);LAB(P,A1,'A',BLUE_D,10,14,16);LAB(P,B1,'B',BLUE_D,12,6,16);LAB(P,C1,'C',BLUE_D,-12,-4,16);
  M6.L3(P,[0,0,0],[1,1,1],ORA2,3);PT(P,[0,0,0],INK,5);LAB(P,[0,0,0],'O',INK,-12,14,15);
  if(a>.6){PT(P,I,GREEN,8);var qi=P(I[0],I[1],I[2]);tag('(6/11 ; 6/11 ; 6/11)',qi.x+70,qi.y+30,DGREEN,15);}
  TB(a>.9?'6x + 3y + 2z = 6':'ax + by + cz = d ?',W*.5,H*.07,a>.9?BLUE_D:GREY,17);}
]);
})();
