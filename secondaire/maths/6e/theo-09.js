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
/* ===== Chapitre 9 : probabilités ===== */
(function(){
var R=SFA;
/* arbre pondéré : nodes {x,y,t,c} (x,y en fractions), edges {a,b,l,h} (h : couleur de mise en valeur ou null) */
function tree(nodes,edges,fs,rad){var X=function(n){return W*n.x;},Y=function(n){return H*n.y;};
 edges.forEach(function(e){var a=nodes[e.a],b=nodes[e.b];LN(X(a),Y(a),X(b),Y(b),e.h||AX,e.h?4:2);});
 edges.forEach(function(e){var a=nodes[e.a],b=nodes[e.b];tag(e.l,(X(a)+X(b))/2,(Y(a)+Y(b))/2,e.h?dk(e.h):INK,fs);});
 nodes.forEach(function(n){if(n.leaf){TB(n.t,X(n)+rad+6,Y(n)+fs*.36,n.c||INK,fs+1,'left');}else{DOT(X(n),Y(n),rad,n.c?n.c+'33':'#eef4fb');ctx.strokeStyle=n.c||BLUE;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(X(n),Y(n),rad,0,7);ctx.stroke();if(n.t)TB(n.t,X(n),Y(n)+fs*.36,dk(n.c||BLUE),fs);}});}

R.theo("c09",{
 icon:function(){
  var nd=[{x:.08,y:.5},{x:.3,y:.28,t:'A'},{x:.3,y:.72,t:'B'},{x:.5,y:.15,leaf:1},{x:.5,y:.4,leaf:1},{x:.5,y:.62,leaf:1},{x:.5,y:.87,leaf:1}];
  tree(nd,[{a:0,b:1,l:'0,6',h:BLUE},{a:0,b:2,l:'0,4'},{a:1,b:3,l:'0,02',h:BLUE},{a:1,b:4,l:'0,98'},{a:2,b:5,l:'0,05'},{a:2,b:6,l:'0,95'}],13,11);
  TB('P(A | B)',W*.8,H*.4,BLUE_D,28);TB('= P(A ∩ B) / P(B)',W*.8,H*.6,ORANGE,20);TB('arbres · Bayes · hasard',W*.8,H*.82,GREY,13);},
 anim:function(t){
  var leaves=[[.6,.02,'A ∩ D','0,012'],[.6,.98,'A ∩ non D','0,588'],[.4,.05,'B ∩ D','0,020'],[.4,.95,'B ∩ non D','0,380']];
  var idx=Math.floor(t/170)%4,loc=(t%170)/170,u=Math.min(W*.62,H*2.2);
  /* arbre sur la gauche, dans un repère local */
  ctx.save();var sx=u/W;ctx.scale(1,1);
  var nd=[{x:.07,y:.5},{x:.33,y:.27,t:'A',c:BLUE},{x:.33,y:.73,t:'B',c:ORA2},{x:.6,y:.14,leaf:1},{x:.6,y:.38,leaf:1},{x:.6,y:.62,leaf:1},{x:.6,y:.86,leaf:1}];
  var sav=W;W=u;
  var ed=[[0,1,'0,6'],[0,2,'0,4'],[1,3,'0,02'],[1,4,'0,98'],[2,5,'0,05'],[2,6,'0,95']].map(function(e){return {a:e[0],b:e[1],l:e[2]};});
  var path=idx<2?[0,idx===0?2:3]:[1,idx===2?4:5];
  var leafNode=3+idx,first=idx<2?0:1;var edgeIdx=[first,2+idx];
  ed[edgeIdx[0]].h=GREEN;if(loc>.5)ed[edgeIdx[1]].h=GREEN;
  nd.forEach(function(n,i){if(n.leaf){var L=leaves[i-3];n.t=L[2]+' : '+L[3];n.c=i-3===idx?DGREEN:GREY;}});
  tree(nd,ed,13,13);
  /* jeton */
  var a=nd[0],b=nd[first===0?1:2],c=nd[leafNode];var pr=Math.min(1,loc*2.2),q;
  if(pr<.5){var k=pr*2;q={x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k};}else{var k2=(pr-.5)*2;q={x:b.x+(c.x-b.x)*k2,y:b.y+(c.y-b.y)*k2};}
  DOT(W*q.x,H*q.y,8,RED);
  W=sav;ctx.restore();
  var tx=u+30,L=leaves[idx];
  TB('Le long d\'une branche :',tx,56,INK,16,'left');TB('on multiplie',tx,80,INK,16,'left');
  TB(L[0]===.6?'0,6':'0,4',tx,128,BLUE_D,22,'left');
  var line=M6.f(L[0],1)+' × '+M6.f(L[1],2)+' = '+L[3];
  TB(loc>.5?line:M6.f(L[0],1)+' × …',tx,128,loc>.5?DGREEN:BLUE_D,22,'left');
  TB('Entre branches : on additionne',tx,186,INK,16,'left');
  TB('P(D) = 0,012 + 0,020 = 0,032',tx,214,(idx===0||idx===2)?DRED:GREY,17,'left');
  TB('Somme des 4 feuilles = 1',tx,262,GREY,15,'left');},
 th:'<div class="tcard"><b class="h">Univers, événements, règles de calcul</b><p>Une expérience aléatoire a un <b>univers</b> Ω (issues possibles) ; un <b>événement</b> est une partie de Ω. Si les issues sont équiprobables : P(A) = |A| / |Ω| (cas favorables / cas possibles). Règles : 0 ≤ P ≤ 1 ; P(Ω) = 1 ; P(Ā) = 1 − P(A) ; P(A ∪ B) = P(A) + P(B) − P(A ∩ B), et simplement P(A) + P(B) si A et B sont <b>incompatibles</b> (A ∩ B = ∅).</p><p><b>Exemple chiffré.</b> Deux dés : somme 8 → (2;6), (3;5), (4;4), (5;3), (6;2) : 5/36 ; somme ≤ 3 → (1;1), (1;2), (2;1) : 3/36 = 1/12. <b>Loi des grands nombres</b> : la fréquence observée d\'un événement se rapproche de sa probabilité quand le nombre d\'essais augmente.</p></div>'+
 '<div class="tcard"><b class="h">Probabilité conditionnelle et indépendance</b><p>P(A | B) = P(A ∩ B) / P(B) (si P(B) &gt; 0) : probabilité de A sachant que B est réalisé. D\'où P(A ∩ B) = P(B)·P(A | B). A et B sont <b>indépendants</b> si P(A ∩ B) = P(A)·P(B), ce qui équivaut à P(A | B) = P(A).</p><p><b>Exemple.</b> P(A) = 0,5 ; P(B) = 0,4 ; P(A ∩ B) = 0,2 : 0,5 × 0,4 = 0,2, donc indépendants ; P(A | B) = 0,2/0,4 = 0,5. <b>Pièges</b> : « incompatibles » ≠ « indépendants » (deux événements incompatibles de probabilités non nulles sont même dépendants) ; P(A | B) ≠ P(B | A).</p></div>'+
 '<div class="tcard"><b class="h">Arbres pondérés, probabilités totales, Bayes</b><p>Dans un arbre : on <b>multiplie</b> les probabilités le long d\'une branche, on <b>additionne</b> les branches qui mènent à l\'événement (formule des probabilités totales : P(B) = Σ P(Aᵢ)·P(B | Aᵢ)). <b>Formule de Bayes</b> : P(A | B) = P(A)·P(B | A) / P(B).</p><p><b>Exemple chiffré.</b> Machine A : 60 % des pièces, 2 % défectueuses ; machine B : 40 %, 5 %. P(D) = 0,6·0,02 + 0,4·0,05 = 0,012 + 0,020 = 0,032. Une pièce est défectueuse : P(A | D) = 0,012/0,032 = 0,375. Sans remise : 2 boules rouges parmi 5 rouges et 3 bleues : 5/8 × 4/7 = 5/14.</p></div>'+
 '<div class="tcard"><b class="h">Tests, dénombrement et contre-intuitions</b><p><b>Test médical</b> (prévalence 2 %, sensibilité 90 %, spécificité 95 %) : P(+) = 0,02·0,9 + 0,98·0,05 = 0,067 ; P(malade | +) = 0,018/0,067 ≈ 26,9 % — bien plus faible que 90 %, car les malades sont rares. Un second test positif indépendant donne ≈ 86,9 %. <b>Dénombrement</b> : en situation d\'équiprobabilité, P = C(·)/C(·) (ex. une paire au poker : 1 098 240 / 2 598 960 ≈ 0,423).</p><p><b>Monty Hall à 10 portes</b> : on choisit une porte (1/10) ; l\'animateur ouvre 8 chèvres ; la porte restante porte la probabilité 9/10 : il faut changer.</p></div>'
});

R.figs("c09",[
 /* 0 : deux des */
 function(p){p=M6.pp(p);var cs=Math.min(W*.075,H*.115),x0=W*.07,y0=H*.18,a=M6.seg(p,0,.7);
  TB('dé 2',W*.04,y0-12,GREY,13,'left');
  for(var i=1;i<=6;i++){TB(String(i),x0-W*.02+i*cs*1.0-cs*.45,y0-4,GREY,13);TB(String(i),x0-16,y0+i*cs-cs*.3,GREY,13);}
  for(var d1=1;d1<=6;d1++)for(var d2=1;d2<=6;d2++){var s=d1+d2,x=x0+(d1-1)*cs+cs*.0,y=y0+(d2-1)*cs;var hi8=a>0&&s===8,hi3=a>0&&s<=3;ctx.fillStyle=hi8?'#fdece4':hi3?'#e7f6f0':'#f6f7f9';ctx.strokeStyle=hi8?ORA2:hi3?GREEN:AX;ctx.lineWidth=hi8||hi3?2.4:1;ctx.beginPath();ctx.rect(x,y,cs,cs);ctx.fill();ctx.stroke();TB(String(s),x+cs/2,y+cs*.65,hi8?DRED:hi3?DGREEN:GREY,Math.round(cs*.42));}
  TB('dé 1 →',x0+3*cs,y0-14,GREY,13);
  var tx=x0+6*cs+W*.06;TB('somme 8',tx,H*.32,DRED,Math.round(H*.065),'left');TB(a>0?'5 / 36':'?',tx,H*.44,DRED,Math.round(H*.08),'left');
  TB('somme ≤ 3',tx,H*.62,DGREEN,Math.round(H*.065),'left');TB(a>0?'3 / 36 = 1 / 12':'?',tx,H*.74,DGREEN,Math.round(H*.08),'left');},
 /* 1 : incompatibles */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.07,W*.038));M6.box(W*.06,H*.1,W*.88,H*.65,'#fbfbfc',AX,2);TB('Ω',W*.1,H*.19,GREY,fs+4);
  var r=H*.22;[[W*.3,BLUE,'A','0,30'],[W*.7,ORA2,'B','0,45']].forEach(function(c){ctx.fillStyle=c[1]+(a>0?'55':'22');ctx.strokeStyle=c[1];ctx.lineWidth=3;ctx.beginPath();ctx.arc(c[0],H*.43,r,0,7);ctx.fill();ctx.stroke();TB(c[2],c[0],H*.4,dk(c[1]),fs+8);TB('P = '+c[3],c[0],H*.52,dk(c[1]),fs+1);});
  TB('A ∩ B = ∅ : incompatibles',W*.5,H*.84,GREY,fs);TB(a>0?'P(A ∪ B) = 0,30 + 0,45 = 0,75':'P(A ∪ B) = ?',W*.5,H*.95,a>0?DRED:GREY,fs+4);},
 /* 2 : trois lancers */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.07,W*.036));var a=M6.seg(p,0,.7);var seq=[];['P','F'].forEach(function(x){['P','F'].forEach(function(y){['P','F'].forEach(function(z){seq.push(x+y+z);});});});
  seq.forEach(function(s,i){var col=i%4,row=Math.floor(i/4);var x=W*.06+col*W*.17,y=H*.16+row*H*.22;var np=s.split('').filter(function(c){return c==='P';}).length;
   var atl=a>0&&np>=1,ex2=a>0&&np===2;ctx.fillStyle=atl?'#e7f6f0':(a>0?'#fcebeb':'#f4f8fd');ctx.strokeStyle=ex2?ORA2:(atl?GREEN:(a>0?RED:BLUE));ctx.lineWidth=ex2?4:2;ctx.beginPath();ctx.roundRect(x,y,W*.15,H*.17,7);ctx.fill();ctx.stroke();TB(s,x+W*.075,y+H*.17*.65,INK,fs+3);});
  TB('2³ = 8 issues équiprobables',W*.04,H*.07,GREY,fs,'left');
  if(a>0){ctx.globalAlpha=a;TB('a) au moins un pile : 7/8',W*.04,H*.7,DGREEN,fs+3,'left');TB('b) exactement 2 piles (cadre orange) : 3/8',W*.04,H*.82,DRED,fs+3,'left');TB('seule FFF est exclue en a)',W*.04,H*.93,GREY,fs-1,'left');ctx.globalAlpha=1;}},
 /* 3 : tirage sans remise */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.055,W*.03));
  var nd=[{x:.07,y:.5},{x:.33,y:.27,t:'R',c:RED},{x:.33,y:.73,t:'B',c:BLUE},{x:.6,y:.14,leaf:1,t:'RR'},{x:.6,y:.38,leaf:1,t:'RB'},{x:.6,y:.62,leaf:1,t:'BR'},{x:.6,y:.86,leaf:1,t:'BB'}];
  var ed=[[0,1,'5/8'],[0,2,'3/8'],[1,3,'4/7'],[1,4,'3/7'],[2,5,'5/7'],[2,6,'2/7']].map(function(e){return {a:e[0],b:e[1],l:e[2]};});
  if(a>0){ed[0].h=GREEN;ed[2].h=GREEN;ed[3].h=ORA2;ed[1].h=ORA2;ed[4].h=ORA2;ed[0].h=GREEN;nd[3].c=DGREEN;nd[4].c=DRED;nd[5].c=DRED;}
  if(a>0){ed[3].h=ORA2;ed[0].h=GREEN;}
  tree(nd,ed,fs,12);
  if(a>0){ctx.globalAlpha=a;TB('a) RR : 5/8 × 4/7 = 5/14',W*.62,H*.3,DGREEN,fs+2,'left');TB('b) RB + BR :',W*.62,H*.55,DRED,fs+2,'left');TB('5/8×3/7 + 3/8×5/7 = 15/28',W*.62,H*.66,DRED,fs+1,'left');ctx.globalAlpha=1;}
  else TB('5 rouges, 3 bleues, sans remise',W*.62,H*.3,GREY,fs+1,'left');},
 /* 4 : independance */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.065,W*.034));var s=Math.min(H*.7,W*.4),x0=W*.08,y0=H*.12;
  var wA=s*.5,hB=s*.4;ctx.fillStyle='#f4f8fd';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.rect(x0,y0,s,s);ctx.fill();ctx.stroke();
  ctx.fillStyle=a>0?'rgba(29,158,117,.4)':'rgba(55,138,221,.25)';ctx.fillRect(x0,y0+s-hB,wA,hB);ctx.strokeStyle=a>0?GREEN:BLUE;ctx.lineWidth=2.4;ctx.strokeRect(x0,y0+s-hB,wA,hB);
  LN(x0+wA,y0,x0+wA,y0+s,BLUE,2,[6,4]);LN(x0,y0+s-hB,x0+s,y0+s-hB,ORA2,2,[6,4]);
  TB('A : 0,5',x0+wA/2,y0+s+fs+2,BLUE_D,fs);TB('B : 0,4',x0-8,y0+s-hB/2,DRED,fs,'right');TB('A ∩ B',x0+wA/2,y0+s-hB/2+fs*.3,a>0?DGREEN:BLUE_D,fs);
  var tx=x0+s+W*.08;TB('P(A ∩ B) = 0,2',tx,H*.3,INK,fs+3,'left');TB('P(A)·P(B) = 0,5×0,4',tx,H*.44,INK,fs+1,'left');
  if(a>0){ctx.globalAlpha=a;TB('= 0,2 : indépendants',tx,H*.58,DGREEN,fs+2,'left');TB('P(A | B) = 0,2 / 0,4 = 0,5',tx,H*.74,DGREEN,fs+2,'left');ctx.globalAlpha=1;}else TB('indépendants ?',tx,H*.6,GREY,fs+3,'left');},
 /* 5 : deux machines */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.055,W*.03));
  var nd=[{x:.07,y:.5},{x:.3,y:.27,t:'A',c:BLUE},{x:.3,y:.73,t:'B',c:ORA2},{x:.52,y:.14,leaf:1,t:'D'},{x:.52,y:.38,leaf:1,t:'D̄'},{x:.52,y:.62,leaf:1,t:'D'},{x:.52,y:.86,leaf:1,t:'D̄'}];
  var ed=[[0,1,'0,6'],[0,2,'0,4'],[1,3,'0,02'],[1,4,'0,98'],[2,5,'0,05'],[2,6,'0,95']].map(function(e){return {a:e[0],b:e[1],l:e[2]};});
  if(a>0){ed[2].h=RED;ed[4].h=RED;ed[0].h=RED;ed[1].h=RED;nd[3].c=DRED;nd[5].c=DRED;}
  tree(nd,ed,fs,12);
  var tx=W*.66;if(a>0){ctx.globalAlpha=a;TB('0,012 + 0,020',tx,H*.28,DRED,fs+1,'left');TB('P(D) = 0,032',tx,H*.4,DRED,fs+4,'left');TB('P(A | D) = 0,012 / 0,032',tx,H*.62,DGREEN,fs,'left');TB('= 3/8 = 0,375',tx,H*.74,DGREEN,fs+3,'left');ctx.globalAlpha=1;}
  else{TB('pièce défectueuse D',tx,H*.3,GREY,fs+1,'left');TB('P(D) = ?   P(A | D) = ?',tx,H*.45,GREY,fs+1,'left');}},
 /* 6 : depistage en frequences naturelles */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.055,W*.03));var cols=40,rows=25,cs=Math.min((W-W*.1)/cols,(H*.62)/rows),x0=(W-cols*cs)/2,y0=H*.14;
  for(var i=0;i<1000;i++){var x=x0+(i%cols)*cs,y=y0+Math.floor(i/cols)*cs,c;var mal=i<20,pos=mal?i<18:(i-20)<49;
   if(mal)c=a>0?(pos?RED:'#7a1f1f'):RED;else c=a>0?(pos?ORA2:'#dfe3e7'):'#dfe3e7';ctx.fillStyle=c;ctx.fillRect(x+.6,y+.6,cs-1.2,cs-1.2);}
  TB('1 000 personnes : 20 malades (rouge)',W*.5,H*.07,INK,fs+1);
  var yb=y0+rows*cs+fs*1.8;if(a>0){ctx.globalAlpha=a;TB('positifs : 18 malades + 49 sains = 67',W*.5,yb,DGREEN,fs+1);TB('P(malade | +) = 18/67 ≈ 26,9 %',W*.5,yb+fs*1.7,DRED,fs+3);ctx.globalAlpha=1;}
  else TB('sensibilité 90 % · spécificité 95 %',W*.5,yb,GREY,fs+1);},
 /* 7 : Monty Hall 10 portes */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.06,W*.03));var dw=W*.07,dh=H*.4,gap=(W-10*dw)/11;
  for(var i=0;i<10;i++){var x=gap+i*(dw+gap),y=H*.28;var mine=i===0,other=i===6,open=a>0&&!mine&&!other;
   ctx.fillStyle=open?'#f0f1f3':'#fdf3dc';ctx.strokeStyle=mine?BLUE:(other&&a>0?GREEN:'#8a7a4a');ctx.lineWidth=mine||(other&&a>0)?4:2;ctx.beginPath();ctx.rect(x,y,dw,dh);ctx.fill();ctx.stroke();
   if(open){TB('×',x+dw/2,y+dh*.55,GREY,fs+14);}else{DOT(x+dw*.8,y+dh*.55,3.5,'#8a7a4a');}
   TB(String(i+1),x+dw/2,y-8,GREY,fs-1);}
  var x1=gap+dw/2;TB('ton choix',x1,H*.82,BLUE_D,fs);TB('1/10',x1,H*.92,BLUE_D,fs+4);
  if(a>0){ctx.globalAlpha=a;var x2=gap+6*(dw+gap)+dw/2;TB('si tu changes',x2,H*.82,DGREEN,fs);TB('9/10',x2,H*.92,DGREEN,fs+4);TB('8 chèvres révélées',W*.5,H*.1,GREY,fs);ctx.globalAlpha=1;}
  else TB('1 voiture, 9 chèvres : l\'animateur va en ouvrir 8',W*.5,H*.1,GREY,fs);},
 /* 8 : une main avec une paire */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.055,W*.03));var cw=Math.min(W*.13,H*.26),ch=cw*1.4;var cards=[['K','♥'],['K','♠'],['7','♦'],['3','♣'],['J','♠']];
  cards.forEach(function(c,i){var x=W*.5+(i-2)*cw*1.2-cw/2,y=H*.2;var red=c[1]==='♥'||c[1]==='♦';var pair=i<2&&a>0;ctx.fillStyle='#fff';ctx.strokeStyle=pair?ORA2:'#9aa0a6';ctx.lineWidth=pair?4:2;ctx.beginPath();ctx.roundRect(x,y,cw,ch,8);ctx.fill();ctx.stroke();
   TB(c[0],x+cw*.5,y+ch*.4,red?DRED:INK,Math.round(cw*.42));TB(c[1],x+cw*.5,y+ch*.78,red?RED:INK,Math.round(cw*.38));});
  TB('5 cartes parmi 52 : exactement une paire',W*.5,H*.08,BLUE_D,fs+1);
  if(a>0){ctx.globalAlpha=a;TB('13 · C(4;2) · C(12;3) · 4³ = 1 098 240',W*.5,H*.66,INK,fs+1);TB('C(52 ; 5) = 2 598 960',W*.5,H*.76,INK,fs+1);TB('P ≈ 0,423',W*.5,H*.92,DRED,fs+10);ctx.globalAlpha=1;}
  else TB('combien de mains ? ',W*.5,H*.7,GREY,fs+2);},
 /* 9 : deux tests positifs */
 function(p){p=M6.pp(p);var a=M6.seg(p,0,.7);var fs=Math.round(Math.min(H*.06,W*.03));var m=M6.map(0,4,0,1.0,{l:54,b:46,t:26});LN(m.L,m.Y(0),m.L+m.w,m.Y(0),AX,1.6);LN(m.L,m.T,m.L,m.Y(0),AX,1.6);
  [.25,.5,.75,1].forEach(function(v){LN(m.L,m.Y(v),m.L+m.w,m.Y(v),'#eceef1',1);TB(M6.f(v*100)+' %',m.L-6,m.Y(v)+4,GREY,12,'right');});
  var bars=[[1,.02,'avant',GREY,'2 %'],[2,.269,'1 test +',ORA2,'26,9 %'],[3,.869,'2 tests +',RED,'86,9 %']];var bw=m.w/4*.62;
  bars.forEach(function(b,i){var h=b[1]*(i===2?a:1),x=m.X(b[0]);ctx.fillStyle=b[3]+'55';ctx.strokeStyle=b[3];ctx.lineWidth=2.4;ctx.beginPath();ctx.rect(x-bw/2,m.Y(h),bw,m.Y(0)-m.Y(h));ctx.fill();ctx.stroke();TB(b[2],x,m.Y(0)+22,INK,fs);
   if(i<2||a>.9)TB(b[4],x,m.Y(b[1])-8,dk(b[3]===GREY?INK:b[3]),fs+3);});
  TB('P(malade | résultats) , prévalence 2 %',W*.5,H*.06,BLUE_D,fs+1);}
]);
})();
