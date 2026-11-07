(function(){
/* aides locales du chapitre (préfixe m3) */
function cl(v){return Math.max(0,Math.min(1,v));}
function sg(p,a,b){return cl((p-a)/(b-a));}
var BL='rgba(55,138,221,.22)',RL='rgba(226,75,74,.20)',GL='rgba(29,158,117,.22)',OL='rgba(186,117,21,.25)',VL='rgba(127,119,221,.22)';
function RC(x,y,w,h,f,s,lw){ctx.beginPath();ctx.rect(x,y,w,h);if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||2;ctx.stroke();}}
function PG(pts,f,s,lw){ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.closePath();if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||2;ctx.lineJoin='round';ctx.stroke();}}
function GR(x0,x1,y0,y1,l,r,t,b,sx,sy){
 var X=function(x){return l+(x-x0)/(x1-x0)*(r-l);},Y=function(y){return b-(y-y0)/(y1-y0)*(b-t);};
 sx=sx||1;sy=sy||1;ctx.lineWidth=1;ctx.strokeStyle='#eceef1';
 var i;for(i=Math.ceil(x0/sx)*sx;i<=x1+1e-9;i+=sx){ctx.beginPath();ctx.moveTo(X(i),t);ctx.lineTo(X(i),b);ctx.stroke();}
 for(i=Math.ceil(y0/sy)*sy;i<=y1+1e-9;i+=sy){ctx.beginPath();ctx.moveTo(l,Y(i));ctx.lineTo(r,Y(i));ctx.stroke();}
 var ax=x0<=0&&x1>=0?X(0):l,ay=y0<=0&&y1>=0?Y(0):b;
 LN(l,ay,r+8,ay,'#9aa0a6',1.6);LN(ax,b,ax,t-8,'#9aa0a6',1.6);
 ctx.fillStyle='#9aa0a6';ctx.beginPath();ctx.moveTo(r+12,ay);ctx.lineTo(r+4,ay-4);ctx.lineTo(r+4,ay+4);ctx.fill();
 ctx.beginPath();ctx.moveTo(ax,t-12);ctx.lineTo(ax-4,t-4);ctx.lineTo(ax+4,t-4);ctx.fill();
 for(i=Math.ceil(x0/sx)*sx;i<=x1+1e-9;i+=sx){if(Math.abs(i)<1e-9)continue;TB(String(Math.round(i*100)/100).replace('.',',').replace('-','−'),X(i),ay+15,GREY,12);}
 for(i=Math.ceil(y0/sy)*sy;i<=y1+1e-9;i+=sy){if(Math.abs(i)<1e-9)continue;TB(String(Math.round(i*100)/100).replace('.',',').replace('-','−'),ax-6,Y(i)+4,GREY,12,'right');}
 return {X:X,Y:Y};}
function FP(g,f,a,b,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||3;ctx.lineJoin='round';ctx.beginPath();var n=120;for(var i=0;i<=n;i++){var x=a+(b-a)*i/n,y=f(x);i?ctx.lineTo(g.X(x),g.Y(y)):ctx.moveTo(g.X(x),g.Y(y));}ctx.stroke();}
function PT(g,x,y,col,r,lab,dx,dy,s){DOT(g.X(x),g.Y(y),r||5,col);if(lab)tag(lab,g.X(x)+(dx||0),g.Y(y)+(dy||-16),col,s||13);}
function SG(g,x1,y1,x2,y2,col,w,d){LN(g.X(x1),g.Y(y1),g.X(x2),g.Y(y2),col,w||2,d);}
function ARCD(x,y,r,a0,a1,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||2;ctx.beginPath();ctx.arc(x,y,r,a0,a1);ctx.stroke();}
function RANG(x,y,ux,uy,vx,vy,s,col){ctx.strokeStyle=col||GREY;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+ux*s,y+uy*s);ctx.lineTo(x+(ux+vx)*s,y+(uy+vy)*s);ctx.lineTo(x+vx*s,y+vy*s);ctx.stroke();}
function FR(n){return String(Math.round(n*100)/100).replace('.',',').replace('-','−');}
function FA(a,f){if(a<=0)return;ctx.globalAlpha=Math.min(1,a);f();ctx.globalAlpha=1;}
function ARW(x1,y1,x2,y2,c,w){arrow(x1,y1,x2-x1,y2-y1,c,'',w||2.5);}
function NL(x0,x1,l,r,y,st,col){var X=function(v){return l+(v-x0)/(x1-x0)*(r-l);};LN(l-6,y,r+10,y,col||'#9aa0a6',2);
 ctx.fillStyle='#9aa0a6';ctx.beginPath();ctx.moveTo(r+14,y);ctx.lineTo(r+6,y-4);ctx.lineTo(r+6,y+4);ctx.fill();
 for(var v=Math.ceil(x0/st)*st;v<=x1+1e-9;v+=st){LN(X(v),y-5,X(v),y+5,'#9aa0a6',1.5);TB(FR(v),X(v),y+22,GREY,13);}return X;}
function RAY(X,y,a,dir,closed,col,lim){var e=dir>0?X(lim)+8:X(lim)-8;LN(X(a),y,e,y,col,6);
 if(dir>0){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(e+8,y);ctx.lineTo(e-2,y-8);ctx.lineTo(e-2,y+8);ctx.fill();}else{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(e-8,y);ctx.lineTo(e+2,y-8);ctx.lineTo(e+2,y+8);ctx.fill();}
 DOT(X(a),y,8,'#fff');DOT(X(a),y,8,col,!closed?false:true);if(!closed){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(X(a),y,6,0,7);ctx.fill();}}
function SEGI(X,y,a,b,ca,cb,col,w){LN(X(a),y,X(b),y,col,w||6);[[a,ca],[b,cb]].forEach(function(q){DOT(X(q[0]),y,8,col);if(!q[1]){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(X(q[0]),y,5.2,0,7);ctx.fill();}});}
function dg(a){return Math.round(a*10)/10;}
function ANG(P,Q1,Q2,r,col,lab,sz){var a1=Math.atan2(Q1[1]-P[1],Q1[0]-P[0]),a2=Math.atan2(Q2[1]-P[1],Q2[0]-P[0]),d=a2-a1;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
 ctx.fillStyle=col.replace('rgb','rgba').replace(')',',.18)');ctx.beginPath();ctx.moveTo(P[0],P[1]);ctx.arc(P[0],P[1],r,a1,a1+d,d<0);ctx.closePath();ctx.fillStyle='rgba(120,120,120,.12)';ctx.fill();
 ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(P[0],P[1],r,a1,a1+d,d<0);ctx.stroke();
 if(lab){var am=a1+d/2;TB(lab,P[0]+(r+(sz||13)*1.35)*Math.cos(am),P[1]+(r+(sz||13)*1.35)*Math.sin(am)+(sz||13)*.35,col,sz||14);}return Math.abs(d)*180/Math.PI;}
function TRI(A,B,C,f,s,lw){PG([A,B,C],f,s||INK,lw||2.6);}
function ROT(c,r,deg){var a=deg*Math.PI/180;return [c[0]+r*Math.cos(a),c[1]-r*Math.sin(a)];}
function LNP(a,b,c,w,d){LN(a[0],a[1],b[0],b[1],c,w,d);}
function EXT(c,deg,r){return [ROT(c,r,deg),ROT(c,r,deg+180)];}
function PAR(p,y1,y2,x1,x2,ang,sel){/* deux parallèles horizontales + sécante inclinée d'angle ang (deg) ; renvoie points d'intersection */
 LN(x1,y1,x2,y1,BLUE,3);LN(x1,y2,x2,y2,BLUE,3);var cx=(x1+x2)/2,dx=(y2-y1)/Math.tan(ang*Math.PI/180);
 var P1=[cx-dx/2,y1],P2=[cx+dx/2,y2];var e=(y2-y1)*.55,k=e/Math.sin(ang*Math.PI/180);
 var T0=[P1[0]-k*Math.cos(ang*Math.PI/180),y1-e],T1=[P2[0]+k*Math.cos(ang*Math.PI/180),y2+e];LNP(T0,T1,ORANGE,3);return {P1:P1,P2:P2,T0:T0,T1:T1};}
function SQR(P,Q,col,f,out){/* carré construit sur [PQ], côté opposé au point out */
 var dx=Q[0]-P[0],dy=Q[1]-P[1],nx=-dy,ny=dx;var m=[(P[0]+Q[0])/2+nx,(P[1]+Q[1])/2+ny],m2=[(P[0]+Q[0])/2-nx,(P[1]+Q[1])/2-ny];
 var d1=Math.hypot(m[0]-out[0],m[1]-out[1]),d2=Math.hypot(m2[0]-out[0],m2[1]-out[1]);if(d2>d1){nx=-nx;ny=-ny;}
 PG([P,Q,[Q[0]+nx,Q[1]+ny],[P[0]+nx,P[1]+ny]],f,col,2.2);return [(P[0]+Q[0])/2+nx/2,(P[1]+Q[1])/2+ny/2];}
function RT(cx,cy,a,b,col){/* triangle rectangle en C=(cx,cy), jambes horizontales a (vers la droite) et verticale b (vers le haut) en px */
 var C=[cx,cy],B=[cx+a,cy],A=[cx,cy-b];TRI(A,B,C,'rgba(55,138,221,.10)',col||BLUE_D,3);RANG(cx,cy,1,0,0,-1,13,GREY);return {A:A,B:B,C:C};}
function LAB(t,x,y,c,s){TB(t,x,y,c||BLUE_D,s||15);}
SFA.theo("c08", {
 icon: function () {var u=Math.min(W,H)*.075,C=[W*.5-u*1,H*.56],B=[C[0]+4*u,C[1]],A=[C[0],C[1]-3*u];
  TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);SQR(C,B,GREEN,'rgba(29,158,117,.2)',A);SQR(A,C,ORANGE,'rgba(186,117,21,.2)',B);SQR(B,A,RED,'rgba(226,75,74,.18)',C);
  TB('a² + b² = c²',W*.5,H*.1,BLUE_D,Math.min(30,W*.066));},
 anim: function (t) {
  var u=Math.min(W*.032,H*.07),ph=(t%700)/700,ang=.28+.5*(.5-.5*Math.cos(ph*Math.PI*2));
  var c=11*u,C=[W*.36-4*u,H*.62],ax=0;var a=Math.cos(ang)*8*u,b=Math.sin(ang)*8*u;/* jambes a (horizontale) et b (verticale) variables, hypoténuse 8u constante */
  C=[W*.34,H*.7];var B=[C[0]+a,C[1]],A=[C[0],C[1]-b];
  TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);SQR(C,B,GREEN,'rgba(29,158,117,.18)',A);SQR(A,C,ORANGE,'rgba(186,117,21,.18)',B);SQR(B,A,RED,'rgba(226,75,74,.16)',C);RANG(C[0],C[1],1,0,0,-1,13,GREY);
  var aa=a/u,bb=b/u,cc=8,fx=W*.66;
  TB('a² + b² = c²',fx,H*.18,BLUE_D,22,'left');TB('a = '+FR(Math.round(aa*10)/10),fx,H*.36,DGREEN,17,'left');TB('b = '+FR(Math.round(bb*10)/10),fx,H*.46,'#8a5a10',17,'left');TB('c = 8',fx,H*.56,DRED,17,'left');
  TB(FR(Math.round(aa*aa*10)/10)+' + '+FR(Math.round(bb*bb*10)/10)+' = 64',fx,H*.72,DGREEN,17,'left');TB('(côtés en unités u)',fx,H*.84,GREY,13,'left');
 },
 th: '<div class="tcard"><b class="h">Le théorème de Pythagore</b><p>Dans un triangle <b>rectangle</b>, le carré de l\'<b>hypoténuse</b> (le côté opposé à l\'angle droit, le plus long) est égal à la somme des carrés des deux autres côtés : <b>a² + b² = c²</b>. Les aires des deux petits carrés s\'additionnent pour faire celle du grand.</p><p><i>Exemple :</i> jambes 6 et 8 : c² = 36 + 64 = 100, donc c = 10. Si on cherche une jambe : b² = c² − a² (13 et 5 donnent b² = 169 − 25 = 144, b = 12).</p></div>' +
  '<div class="tcard"><b class="h">La réciproque</b><p>Pour savoir si un triangle est rectangle, compare le <b>carré du plus grand côté</b> à la somme des carrés des deux autres. S\'il y a égalité, le triangle est rectangle ; sinon, il ne l\'est pas.</p><p><i>Exemple :</i> 7, 24, 25 : 7² + 24² = 49 + 576 = 625 = 25². Le triangle est rectangle (l\'angle droit est en face du côté 25).</p></div>' +
  '<div class="tcard"><b class="h">Racines carrées et irrationnels</b><p>√a est le nombre positif dont le carré vaut a. Les <b>carrés parfaits</b> (1, 4, 9, 16, 25, 36, 49…) ont une racine entière. Les autres racines (√2, √12…) sont des <b>irrationnels</b> : leur écriture décimale est infinie et sans période, on ne peut pas les écrire comme une fraction. Les rationnels ont une écriture finie ou périodique (3,14 ; 0,333…).</p><p><i>Diagonale d\'un carré de côté 6 :</i> d² = 36 + 36 = 72, d = √72 = 6√2 ≈ 8,49.</p></div>' +
  '<div class="tcard"><b class="h">Encadrer et approcher</b><p>Pour √50 : 7² = 49 &lt; 50 &lt; 64 = 8², donc 7 &lt; √50 &lt; 8 (en fait ≈ 7,07). On affine avec la calculatrice ou par essais. Pythagore sert aussi en 3D : la diagonale d\'un parallélépipède vaut √(a² + b² + c²) (boîte 3 × 4 × 12 : √169 = 13).</p></div>'
});
SFA.figs("c08", [
 function (p) {var u=H*.032,C=[W*.22,H*.6],B=[C[0]+8*u,C[1]],A=[C[0],C[1]-6*u];TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);RANG(C[0],C[1],1,0,0,-1,12,GREY);
  SQR(C,B,GREEN,'rgba(29,158,117,.15)',A);SQR(A,C,ORANGE,'rgba(186,117,21,.15)',B);var q=SQR(B,A,RED,'rgba(226,75,74,.12)',C);
  TB('8',(C[0]+B[0])/2,C[1]+u*3.2,DGREEN,16);TB('6',C[0]-u*3,(A[1]+C[1])/2,'#8a5a10',16);TB('64',(C[0]+B[0])/2,C[1]+u*1.6*0+u*4,DGREEN,1);
  FA(sg(p,.1,.7),function(){TB('36 + 64 = 100',W*.64,H*.2,DRED,Math.min(20,W*.044));TB('c = √100 = 10',W*.64,H*.2+26,DRED,Math.min(20,W*.044));TB('10',q[0],q[1]+5,DRED,22);});
  if(p===0)TB('?',q[0],q[1]+5,GREY,26);},
 function (p) {var u=W*.058,C=[W*.28,H*.85],B=[C[0]+12*u,C[1]],A=[C[0],C[1]-5*u];A=[C[0],C[1]-12*u*0+0];
  var a=5*u,b=12*u;var Cc=[W*.1,H*.86];B=[Cc[0]+b,Cc[1]];A=[Cc[0],Cc[1]-a];A=[Cc[0],Cc[1]-Math.min(a,H*.6)];
  TRI(A,B,Cc,'rgba(55,138,221,.10)',BLUE_D,3);RANG(Cc[0],Cc[1],1,0,0,-1,12,GREY);
  TB('5',Cc[0]-14,(A[1]+Cc[1])/2,'#8a5a10',17);TB('13',(A[0]+B[0])/2+16,(A[1]+B[1])/2-8,DRED,17);
  FA(sg(p,.1,.7),function(){TB('?  →  12',(Cc[0]+B[0])/2,Cc[1]+22,DGREEN,17);TB('b² = 13² − 5² = 169 − 25 = 144',W*.5,H*.1,DRED,Math.min(18,W*.04));TB('b = 12',W*.5,H*.1+26,DRED,20);});if(p===0)TB('?',(Cc[0]+B[0])/2,Cc[1]+22,GREY,22);},
 function (p) {var u=Math.min(W*.0235,H*.0105*1.0),k=W*.0215;var C=[W*.1,H*.78],base=W*.8,B=[C[0]+base,C[1]],A=[C[0],C[1]-7*base/24];TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);
  TB('7',C[0]-12,(A[1]+C[1])/2,'#8a5a10',16);TB('24',(C[0]+B[0])/2,C[1]+20,DGREEN,16);TB('25',(A[0]+B[0])/2+6,(A[1]+B[1])/2-12,DRED,16);
  FA(sg(p,.1,.6),function(){TB('7² + 24² = 49 + 576 = 625',W*.5,H*.1,DGREEN,Math.min(19,W*.041));TB('25² = 625  ✓',W*.5,H*.1+26,DGREEN,19);RANG(C[0],C[1],1,0,0,-1,16,RED);TB('rectangle',W*.5,H*.95,DRED,20);});},
 function (p) {var gy=H*.88,wx=W*.14,hh=H*.74,sc=hh/4.8,foot=wx+1.4*sc;wall(wx,gy-hh-12,gy,1);floor(wx,W*.9,gy);
  LN(foot,gy,wx,gy-hh,ORANGE,5);LN(wx,gy,foot,gy,BLUE,2,[5,4]);TB('1,4 m',(wx+foot)/2,gy+22,BLUE_D,15);TB('5 m',(wx+foot)/2+38,gy-hh/2,DRED,17);RANG(wx,gy,1,0,0,-1,12,GREY);
  FA(sg(p,.1,.7),function(){LN(wx-10,gy,wx-10,gy-hh,GREEN,3);TB('h = √(25 − 1,96)',W*.62,H*.28,DRED,Math.min(19,W*.041));TB('= √23,04 = 4,8 m',W*.62,H*.28+26,DRED,Math.min(19,W*.041));});if(p===0)TB('h = ?',wx+36,gy-hh/2,GREY,20);},
 function (p) {var s=Math.min(W*.3,H*.62),x0=W*.2,y0=H*.14;var P1=[x0,y0],P2=[x0+s,y0],P3=[x0+s,y0+s],P4=[x0,y0+s];PG([P1,P2,P3,P4],'rgba(55,138,221,.10)',BLUE_D,3);TB('6',x0+s/2,y0-8,BLUE_D,16);TB('6',x0-12,y0+s/2,BLUE_D,16);
  FA(sg(p,.1,.6),function(){LNP(P1,P3,RED,3.5);TB('d',x0+s*.55,y0+s*.4,DRED,18);TB('d² = 36 + 36 = 72',W*.62,H*.3,DRED,Math.min(19,W*.04),'left');TB('d = √72 = 6√2',W*.62,H*.3+26,DRED,Math.min(19,W*.04),'left');TB('≈ 8,49 cm',W*.62,H*.3+52,DGREEN,19,'left');});},
 function (p) {var X=NL(5,10,W*.08,W*.9,H*.55,1);var v=Math.sqrt(50);TB('√50',W*.5,H*.2,BLUE_D,Math.min(32,W*.07));
  FA(sg(p,.1,.4),function(){TB('49 < 50 < 64',W*.5,H*.34,DGREEN,18);});
  FA(sg(p,.3,.8),function(){DOT(X(v),H*.55,8,RED);TB('√50 ≈ 7,07',X(v),H*.55-20,DRED,16);ctx.strokeStyle='rgba(55,138,221,.6)';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(X(7),H*.55);ctx.lineTo(X(8),H*.55);ctx.stroke();TB('7 < √50 < 8',W*.5,H*.9,DRED,20);});},
 function (p) {var x0=W*.1,y0=H*.18,w=W*.6,h=w*.75;if(h>H*.62){h=H*.62;w=h/.75;}PG([[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h]],'rgba(29,158,117,.10)',DGREEN,3);
  TB('40 m',x0+w/2,y0-8,DGREEN,16);TB('30 m',x0-6,y0+h/2,DGREEN,16,'right');LN(x0,y0+h,x0+w,y0+h,BLUE,5);LN(x0+w,y0+h,x0+w,y0,BLUE,5);
  FA(sg(p,.1,.6),function(){LN(x0,y0+h,x0+w,y0,RED,5);TB('50 m',x0+w*.35,y0+h*.38,DRED,17);});
  FA(sg(p,.5,1),function(){TB('40 + 30 = 70 m',x0+w+14,y0+h*.75,BLUE_D,16,'left');TB('√(1600+900) = 50 m',x0+w+14,y0+h*.35,DRED,16,'left');TB('on gagne 20 m',x0+w+14,y0+h*.55+0,DGREEN,18,'left');});},
 function (p) {var v=Math.sqrt(12);
  TB('0,333…   √49   √12   3,14',W*.5,H*.16,BLUE_D,Math.min(26,W*.056));
  FA(sg(p,.1,.5),function(){TB('0,333… = 1/3',W*.2,H*.34,DGREEN,14);TB('√49 = 7',W*.5,H*.34,DGREEN,14);TB('3,14 = 314/100',W*.8,H*.34,DGREEN,14);});
  FA(sg(p,.4,.9),function(){TB('√12 = 3,4641016…',W*.5,H*.56,DRED,Math.min(22,W*.048));TB('décimales infinies, sans période',W*.5,H*.7,DRED,16);TB('irrationnel',W*.5,H*.88,DRED,24);});},
 function (p) {var A=[W*.68,H*.1],B=[W*.46,H*.8],C=[W*.9,H*.8],M=[W*.68,H*.8];if(false){}
  PG([A,B,C],'rgba(55,138,221,.10)',BLUE_D,3);LN(A[0],A[1],M[0],M[1],ORANGE,3,[6,5]);RANG(M[0],M[1],-1,0,0,-1,12,GREY);
  TB('13',(A[0]+C[0])/2+14,(A[1]+C[1])/2-6,BLUE_D,16);TB('13',(A[0]+B[0])/2-14,(A[1]+B[1])/2-6,BLUE_D,16);TB('10',W*.68,B[1]+22,BLUE_D,16);
  FA(sg(p,.1,.6),function(){TB('h',M[0]+14,(A[1]+M[1])/2,'#8a5a10',18);TB('h² = 13² − 5² = 144',W*.04,H*.34,DRED,Math.min(16,W*.034),'left');TB('h = 12',W*.04,H*.34+24,DRED,18,'left');});
  FA(sg(p,.5,1),function(){TB('aire = 10×12/2 = 60 cm²',W*.04,H*.7,DGREEN,Math.min(15,W*.032),'left');TB('périmètre = 36 cm',W*.04,H*.7+24,DGREEN,Math.min(15,W*.032),'left');});},
 function (p) {var k=Math.min(W*.034,H*.045),o=[W*.16,H*.84];function Pq(x,y,z){return [o[0]+x*k+z*k*.55*.0+y*k*.9*.0,0];}
  /* boîte oblique : x vers la droite (12), z vers le haut (3), y en profondeur (4) */
  function Q(x,y,z){return [o[0]+x*k*.9+y*k*.9*.6,o[1]-z*k*.9*2.4-y*k*.9*.45];}
  var V=[[0,0,0],[12,0,0],[12,4,0],[0,4,0],[0,0,3],[12,0,3],[12,4,3],[0,4,3]].map(function(v){return Q(v[0],v[1],v[2]);});
  var ed=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];ed.forEach(function(e,i){LNP(V[e[0]],V[e[1]],BLUE_D,2.4,i===3||i===2||i===10?[5,4]:null);});
  TB('12',(V[0][0]+V[1][0])/2,V[0][1]+18,BLUE_D,15);TB('3',V[0][0]-12,(V[0][1]+V[4][1])/2,BLUE_D,15);TB('4',(V[1][0]+V[2][0])/2+14,(V[1][1]+V[2][1])/2+10,BLUE_D,15);
  FA(sg(p,.1,.6),function(){LNP(V[3],V[5],RED,4);DOT(V[3][0],V[3][1],5,RED);DOT(V[5][0],V[5][1],5,RED);TB('d',(V[3][0]+V[5][0])/2,(V[3][1]+V[5][1])/2-12,DRED,18);TB('d² = 9 + 16 + 144 = 169',W*.04,H*.1,DRED,Math.min(16,W*.034),'left');TB('d = 13 cm',W*.04,H*.1+24,DRED,18,'left');});}
]);
})();
