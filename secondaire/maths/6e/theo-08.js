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
/* ===== Chapitre 8 : analyse combinatoire et binôme de Newton ===== */
(function(){
var R=SFA;
function C(n,k){return M6.C(n,k);}
function tile(x,y,w,h,s,col,size,fill){M6.box(x-w/2,y-h/2,w,h,fill||col+'1f',col,2.2);TB(s,x,y+size*.36,dk(col),size);}

R.theo("c08",{
 icon:function(){
  var rows=5,dy=H*.17,cx=W*.26;for(var r=0;r<rows;r++)for(var k=0;k<=r;k++){var x=cx+(k-r/2)*W*.12,y=H*.16+r*dy;DOT(x,y,W*.05,r==4&&k==2?'#fdece4':'#eef4fb');ctx.strokeStyle=r==4&&k==2?ORA2:BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,W*.05,0,7);ctx.stroke();TB(String(C(r,k)),x,y+5,r==4&&k==2?DRED:BLUE_D,15);}
  TB('C(n ; k)',W*.73,H*.4,BLUE_D,30);TB('n! / (k!(n−k)!)',W*.73,H*.62,ORANGE,20);TB('compter sans énumérer',W*.73,H*.82,GREY,13);},
 anim:function(t){
  var T=Math.floor(t%620),shown=Math.min(7,Math.floor(T/42)+1),hi=T>330;
  var u=Math.min(W*.6,H*2.2),cx=u*.5+10,dy=(H-50)/7.2,dx=u/8;
  TB('triangle de Pascal',cx,22,BLUE_D,16);
  function pos(r,k){return {x:cx+(k-r/2)*dx,y:46+r*dy};}
  var r,k,rad=Math.min(dx*.42,dy*.44),pulse=.5+.5*Math.sin(t*.12);
  for(r=0;r<shown;r++){var ap=r===shown-1?M6.seg(T-(shown-1)*42,0,24):1;
   for(k=0;k<=r;k++){var q=pos(r,k),sel=hi&&r===5&&k===2,par=hi&&r===4&&(k===1||k===2);
    ctx.globalAlpha=ap;if(r>0&&ap<1){var pa=k>0?pos(r-1,k-1):null,pb=k<r?pos(r-1,k):null;if(pa)LN(pa.x,pa.y,q.x,q.y,GREEN,2);if(pb)LN(pb.x,pb.y,q.x,q.y,GREEN,2);}
    ctx.fillStyle=sel?'#fdece4':par?'#e7f6f0':'#eef4fb';ctx.strokeStyle=sel?ORA2:par?GREEN:BLUE;ctx.lineWidth=sel||par?3:1.8;ctx.beginPath();ctx.arc(q.x,q.y,rad+(sel?pulse*2.5:0),0,7);ctx.fill();ctx.stroke();
    TB(String(C(r,k)),q.x,q.y+5,sel?DRED:par?DGREEN:BLUE_D,Math.round(rad*.95));ctx.globalAlpha=1;}
   var e=pos(r,r);TB('= 2'+['⁰','¹','²','³','⁴','⁵','⁶'][r],e.x+rad*2.2,e.y+5,GREY,14,'left');}
  var tx=u+34;
  TB('C(n ; k) = C(n−1 ; k−1) + C(n−1 ; k)',tx,60,INK,16,'left');
  TB('chaque nombre = somme des deux',tx,92,GREY,15,'left');TB('nombres au-dessus',tx,112,GREY,15,'left');
  if(hi){TB('C(5 ; 2) = C(4 ; 1) + C(4 ; 2)',tx,160,DRED,17,'left');TB('10 = 4 + 6',tx,188,DRED,20,'left');}
  TB('ligne n : coefficients de (a + b)ⁿ',tx,236,BLUE_D,16,'left');TB('(a + b)⁴ = a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴',tx,264,BLUE_D,14,'left');},
 th:'<div class="tcard"><b class="h">Principes de dénombrement et factorielle</b><p><b>Principe multiplicatif</b> : si un choix se fait en n₁ façons, puis un second en n₂ façons (quel que soit le premier), il y a n₁·n₂ possibilités en tout (un arbre le visualise). <b>Principe additif</b> : si deux cas s\'excluent, on additionne leurs nombres. <b>Factorielle</b> : n! = n·(n − 1)·…·2·1, avec 0! = 1. Exemple : 6! = 720 ; 7!/5! = 7·6 = 42.</p></div>'+
 '<div class="tcard"><b class="h">Arrangements, permutations, combinaisons</b><p>Choisir k objets parmi n :<br>• <b>avec ordre, sans répétition</b> : arrangements A(n ; k) = n!/(n − k)! — ex. podium de 8 coureurs : 8·7·6 = 336 ;<br>• <b>avec ordre, avec répétition</b> : nᵏ — ex. codes à 4 chiffres : 10⁴ = 10 000 ;<br>• <b>tous les objets, dans un ordre</b> : permutations n! ; avec lettres répétées, n!/(a!·b!…) — ex. MAMAN : 5!/(2!·2!) = 30 ;<br>• <b>sans ordre</b> : combinaisons C(n ; k) = n!/(k!·(n − k)!) — ex. Lotto : C(45 ; 6) = 8 145 060.</p><p><b>Méthode</b> : « l\'ordre compte-t-il ? y a-t-il répétition ? ». <b>Piège</b> : « au moins un » se traite par le complémentaire : C(12 ; 4) − C(7 ; 4) = 495 − 35 = 460.</p></div>'+
 '<div class="tcard"><b class="h">Propriétés des coefficients binomiaux</b><p>C(n ; 0) = C(n ; n) = 1 ; C(n ; k) = C(n ; n − k) (symétrie) ; <b>relation de Pascal</b> C(n ; k) = C(n − 1 ; k − 1) + C(n − 1 ; k) : le triangle de Pascal se construit par additions ; la somme de la ligne n vaut 2ⁿ (nombre de parties d\'un ensemble à n éléments).</p><p><b>Preuve de Pascal par dénombrement</b> : pour choisir k éléments parmi n, on fixe un élément e ; ou bien e est choisi (C(n − 1 ; k − 1) façons), ou bien il ne l\'est pas (C(n − 1 ; k) façons).</p></div>'+
 '<div class="tcard"><b class="h">Binôme de Newton</b><p>(a + b)ⁿ = Σ<sub>k=0</sub><sup>n</sup> C(n ; k)·aⁿ⁻ᵏ·bᵏ. Le terme de rang k + 1 est C(n ; k)·aⁿ⁻ᵏ·bᵏ ; les coefficients sont la ligne n du triangle de Pascal.</p><p><b>Exemple chiffré.</b> (x + 2)⁶ : le terme en x⁴ est C(6 ; 2)·x⁴·2² = 15·4·x⁴ = 60x⁴. Pour (2x − 3)⁴, on prend a = 2x et b = −3 : 16x⁴ − 96x³ + 216x² − 216x + 81 (coefficients 1 ; 4 ; 6 ; 4 ; 1, multipliés par 2⁴⁻ᵏ·(−3)ᵏ). <b>Piège</b> : ne pas oublier les signes quand b est négatif.</p></div>'
});

R.figs("c08",[
 /* 0 : factorielles et combinaisons */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.065,W*.034));var a=M6.seg(p,0,.6);
  TB('6! = 6·5·4·3·2·1',W*.05,H*.2,BLUE_D,fs+3,'left');if(a>0){ctx.globalAlpha=a;TB('= 720',W*.05,H*.3,DRED,fs+6,'left');ctx.globalAlpha=1;}
  TB('7! / 5! = 7·6',W*.05,H*.5,GREEN,fs+3,'left');if(a>0){ctx.globalAlpha=a;TB('= 42',W*.05,H*.6,DRED,fs+6,'left');ctx.globalAlpha=1;}
  TB('C(6 ; 2) = 6·5 / 2',W*.05,H*.8,ORANGE,fs+3,'left');if(a>0){ctx.globalAlpha=a;TB('= 15',W*.05,H*.9,DRED,fs+6,'left');ctx.globalAlpha=1;}
  var cx=W*.72,cy=H*.5,r=Math.min(W*.2,H*.36),pts=[];for(var i=0;i<6;i++){var an=-Math.PI/2+i*Math.PI/3;pts.push({x:cx+r*Math.cos(an),y:cy+r*Math.sin(an)});}
  var edges=[];for(i=0;i<6;i++)for(var j=i+1;j<6;j++)edges.push([i,j]);var shown=Math.floor(edges.length*a);
  edges.forEach(function(e,k){ctx.globalAlpha=k<shown?1:0;LN(pts[e[0]].x,pts[e[0]].y,pts[e[1]].x,pts[e[1]].y,ORANGE+'bb',1.8);});ctx.globalAlpha=1;
  pts.forEach(function(q){DOT(q.x,q.y,Math.min(10,r*.12),BLUE);});TB('choisir 2 parmi 6 :',cx,cy-r-14,GREY,fs);TB(a>.9?'15 paires':'?',cx,cy+r+22,a>.9?DRED:GREY,fs+3);},
 /* 1 : podium */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.07,W*.038));var bw=W*.22,x0=W*.5,base=H*.78;var steps=[[x0-bw*1.1,H*.14,'2e',7],[x0,H*.26,'1re',8],[x0+bw*1.1,H*.08,'3e',6]];
  steps=[[x0-bw*1.1,.24,'2e',7,'#9aa0a6'],[x0,.34,'1re',8,'#E2B21C'],[x0+bw*1.1,.16,'3e',6,'#BA7517']];
  var a=M6.seg(p,0,.7);
  steps.forEach(function(s){var h=H*s[1],x=s[0];ctx.fillStyle=s[4]+'44';ctx.strokeStyle=s[4];ctx.lineWidth=2.6;ctx.beginPath();ctx.rect(x-bw/2,base-h,bw,h);ctx.fill();ctx.stroke();TB(s[2],x,base-h/2+fs*.35,dk(s[4]===BLUE?BLUE:INK),fs+8);
   pers(x,base-h,H*.2,BLUE,1);ctx.globalAlpha=a;TB(a>0?s[3]+' choix':'',x,base+fs*1.6,DGREEN,fs+2);ctx.globalAlpha=1;});
  LN(W*.08,base,W*.92,base,INK,2.4);TB('8 coureurs, 3 places',W*.5,H*.07,BLUE_D,fs+2);
  if(a>.9)TB('A(8 ; 3) = 8 × 7 × 6 = 336',W*.5,H*.97,DRED,fs+4);},
 /* 2 : codes a quatre chiffres */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.07,W*.036));var a=M6.seg(p,0,.7);
  var rows=[['a) en tout',['10','10','10','10'],'10 000'],['b) tous différents',['10','9','8','7'],'5 040'],['c) tous différents, commence par 0',['1','9','8','7'],'504']];
  rows.forEach(function(r,i){var y=H*.28+i*H*.28;TB(r[0],W*.05,y-fs*1.5,INK,fs+1,'left');
   for(var k=0;k<4;k++){var x=W*.12+k*W*.15;M6.box(x-W*.055,y-fs*.9,W*.11,fs*2,'#f4f8fd',BLUE,2.2);TB(a>0?r[1][k]:'?',x,y+fs*.45,a>0?BLUE_D:GREY,fs+5);if(k<3)TB('×',x+W*.075,y+fs*.4,GREY,fs+3);}
   if(a>0){ctx.globalAlpha=a;TB('= '+r[2],W*.76,y+fs*.45,DRED,fs+5,'left');ctx.globalAlpha=1;}});},
 /* 3 : comite */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.06,W*.032));var r=Math.min(W*.03,H*.055);var a=M6.seg(p,0,.7);
  var sel=[0,1,7,8];
  for(var i=0;i<12;i++){var g=i<7;var x=W*.08+(i%6)*W*.085+(g?0:0),y=g?H*.2+Math.floor(i/6)*H*.17:0;
   if(!g){var j=i-7;x=W*.08+j*W*.085;y=H*.6;}
   var c=g?'#E8629C':BLUE;var chosen=a>0&&sel.indexOf(i)>=0;DOT(x,y,r,chosen?c:c+'33');ctx.strokeStyle=c;ctx.lineWidth=chosen?3.2:2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();}
  TB('7 filles',W*.08,H*.1,'#B03A75',fs+1,'left');TB('5 garçons',W*.08,H*.52,BLUE_D,fs+1,'left');
  TB('a) 2 filles et 2 garçons',W*.58,H*.2,INK,fs+1,'left');TB('C(7;2)·C(5;2) = 21·10',W*.58,H*.3,DRED,fs+2,'left');if(a>0){ctx.globalAlpha=a;TB('= 210',W*.58,H*.4,DRED,fs+6,'left');ctx.globalAlpha=1;}
  TB('b) au moins un garçon',W*.58,H*.6,INK,fs+1,'left');TB('C(12;4) − C(7;4) = 495 − 35',W*.58,H*.7,DRED,fs+2,'left');if(a>0){ctx.globalAlpha=a;TB('= 460',W*.58,H*.8,DRED,fs+6,'left');ctx.globalAlpha=1;}},
 /* 4 : MAMAN */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.09,W*.046));var L=['M','A','M','A','N'],col={M:BLUE,A:ORA2,N:GREEN};var w=W*.13;
  L.forEach(function(c,i){tile(W*.5+(i-2)*w*1.15,H*.3,w,w,c,col[c],fs+8);});TB('MAMAN',W*.5,H*.1,BLUE_D,fs);
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;TB('5! / (2! · 2!) = 120 / 4 = 30',W*.5,H*.62,DRED,fs+6);var ex=['AMMAN','NAMAM','MMAAN'];ex.forEach(function(s,k){var x0=W*.5+(k-1)*W*.3;s.split('').forEach(function(c,i){var xx=x0+(i-2)*w*.4;M6.box(xx-w*.17,H*.76,w*.34,w*.34,col[c]+'22',col[c],1.6);TB(c,xx,H*.76+w*.23,dk(col[c]),fs-3);});});TB('exemples d\'anagrammes',W*.5,H*.96,GREY,fs-4);ctx.globalAlpha=1;}
  else TB('lettres répétées : on divise',W*.5,H*.7,GREY,fs);},
 /* 5 : Lotto */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.06,W*.032));var a=M6.seg(p,0,.7);var cs=Math.min(W*.048,H*.085);var sel=[3,11,19,27,34,42];
  for(var i=0;i<45;i++){var x=W*.05+(i%9)*cs*1.15,y=H*.16+Math.floor(i/9)*cs*1.15;var s=sel.indexOf(i)>=0;ctx.fillStyle=s?'#fdece4':'#f4f6f8';ctx.strokeStyle=s?ORA2:AX;ctx.lineWidth=s?2.6:1;ctx.beginPath();ctx.roundRect(x,y,cs,cs,5);ctx.fill();ctx.stroke();TB(String(i+1),x+cs/2,y+cs*.65,s?DRED:GREY,Math.round(cs*.42));}
  TB('6 numéros parmi 45',W*.05,H*.08,BLUE_D,fs+2,'left');
  var x2=W*.55;TB('grilles possibles :',x2,H*.3,INK,fs+1,'left');TB('C(45 ; 6)',x2,H*.42,BLUE_D,fs+4,'left');
  if(a>0){ctx.globalAlpha=a;TB('= 8 145 060',x2,H*.55,DRED,fs+5,'left');TB('jackpot : 1 chance sur 8 145 060',x2,H*.68,DRED,fs-3,'left');TB('5 bons : C(6;5)·C(39;1) = 234',x2,H*.8,DGREEN,fs-2,'left');ctx.globalAlpha=1;}},
 /* 6 : (2x-3)^4 */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.06,W*.032));var co=[1,4,6,4,1],res=['16x⁴','−96x³','216x²','−216x','81'];var a=M6.seg(p,0,.7);var w=W*.17;
  TB('(2x − 3)⁴ = Σ C(4 ; k)·(2x)⁴⁻ᵏ·(−3)ᵏ',W*.5,H*.06,BLUE_D,fs+1);
  for(var k=0;k<5;k++){var x=W*.5+(k-2)*w*1.08;tile(x,H*.33,w*.8,w*.8,String(co[k]),BLUE,fs+8);TB('k = '+k,x,H*.33-w*.52,GREY,fs-2);
   if(a>0){ctx.globalAlpha=a;TB('×'+Math.pow(2,4-k)+'×('+(k%2?'−':'')+Math.pow(3,k)+')'.replace('(1)','(1)'),x,H*.58,ORANGE,fs-3);TB(res[k],x,H*.74,DRED,fs+4);ctx.globalAlpha=1;}}
  if(a>.9)TB('16x⁴ − 96x³ + 216x² − 216x + 81',W*.5,H*.93,DGREEN,fs+4);},
 /* 7 : coefficient de x^4 dans (x+2)^6 */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.06,W*.03));var co=[1,6,15,20,15,6,1];var real=[1,12,60,160,240,192,64];var a=M6.seg(p,0,.7);var w=W*.115;
  TB('(x + 2)⁶ : ligne 6 du triangle de Pascal',W*.5,H*.1,BLUE_D,fs+2);
  for(var k=0;k<7;k++){var x=W*.5+(k-3)*w*1.18,hi=k===2;tile(x,H*.38,w,w*.9,String(co[k]),hi?ORA2:BLUE,fs+6,hi?'#fdece4':null);TB('x'+['⁶','⁵','⁴','³','²','¹','⁰'][k],x,H*.38-w*.62,hi?DRED:GREY,fs);
   if(a>0){ctx.globalAlpha=a;TB(String(real[k]),x,H*.66,hi?DRED:INK,fs+(hi?6:1));ctx.globalAlpha=1;}}
  if(a>0){ctx.globalAlpha=a;TB('coefficient réel = C(6 ; k)·2ᵏ',W*.5,H*.8,GREY,fs);if(a>.9)TB('x⁴ : C(6 ; 2)·2² = 15·4 = 60',W*.5,H*.93,DRED,fs+5);ctx.globalAlpha=1;}},
 /* 8 : anniversaires */
 function(p){p=M6.pp(p);var pn=function(n){var q=1;for(var i=0;i<n;i++)q*=(365-i)/365;return 1-q;};var m=M6.map(0,60,0,1.05,{l:44,b:30});M6.axes(m,{xt:[0,10,20,30,40,50,60],yt:[.25,.5,.75,1],grid:true,yf:function(v){return M6.f(v*100)+' %';},xl:'n personnes'});
  var cv=[];M6.curve(m,function(x){var f=Math.floor(x);return pn(f)+(pn(f+1)-pn(f))*(x-f);},0,60,BLUE,3.4);M6.hl(m,.5,ORA2,0,60);TB('50 %',m.X(1),m.Y(.5)-8,DRED,14,'left');TB('p(n) = 1 − A(365 ; n) / 365ⁿ',m.X(25),m.Y(.2),BLUE_D,16,'left');
  var a=M6.seg(p,0,.7);if(a>0){ctx.globalAlpha=a;M6.vl(m,23,GREEN,0,pn(23),[4,3]);M6.pt(m,23,pn(23),GREEN,8);M6.pt(m,22,pn(22),GREY,6);TB('p(23) ≈ 0,507',m.X(23)-12,m.Y(pn(23))-18,DGREEN,16,'right');TB('p(22) ≈ 0,476',m.X(22)+12,m.Y(pn(22))+34,GREY,14,'left');ctx.globalAlpha=1;}},
 /* 9 : parties de taille paire */
 function(p){p=M6.pp(p);var fs=Math.round(Math.min(H*.055,W*.03));var m=M6.map(-.6,10.6,0,280,{l:30,b:44,t:30});LN(m.L,m.Y(0),m.L+m.w,m.Y(0),AX,1.6);var a=M6.seg(p,0,.7);
  for(var k=0;k<=10;k++){var v=C(10,k),x=m.X(k),bw=m.w/11*.72,ev=k%2===0,col=a>0?(ev?BLUE:ORA2):BLUE;ctx.fillStyle=col+'44';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.rect(x-bw/2,m.Y(v),bw,m.Y(0)-m.Y(v));ctx.fill();ctx.stroke();TB(String(v),x,m.Y(v)-6,dk(col),fs);TB(String(k),x,m.Y(0)+18,GREY,fs);}
  TB('C(10 ; k) : nombre de parties à k éléments (total 2¹⁰ = 1 024)',W*.5,H*.06,INK,fs+1);
  if(a>0){ctx.globalAlpha=a;TB('k pair : 512',W*.28,H*.28,DGREEN==='x'?BLUE_D:BLUE_D,fs+5);TB('k impair : 512',W*.74,H*.28,DRED,fs+5);ctx.globalAlpha=1;}}
]);
})();
