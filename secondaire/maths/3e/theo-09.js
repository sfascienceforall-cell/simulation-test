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
function TH(A,B,C,k,fc,col){var D=[A[0]+k*(B[0]-A[0]),A[1]+k*(B[1]-A[1])],E=[A[0]+k*(C[0]-A[0]),A[1]+k*(C[1]-A[1])];
 PG([A,D,E],fc||'rgba(226,75,74,.14)',null);TRI(A,B,C,'rgba(55,138,221,.07)',BLUE_D,3);LNP(D,E,col||RED,3.4);DOT(D[0],D[1],4.5,col||RED);DOT(E[0],E[1],4.5,col||RED);return {D:D,E:E};}
function PT2(t,P,dx,dy,c){TB(t,P[0]+dx,P[1]+dy,c||INK,16);}
SFA.theo("c09", {
 icon: function () {var A=[W*.5,H*.14],B=[W*.14,H*.86],C=[W*.86,H*.86];TH(A,B,C,.45);TB('AD/AB = AE/AC = DE/BC',W*.5,H*.97,BLUE_D,Math.min(22,W*.048));},
 anim: function (t) {
  var A=[W*.3,H*.1],B=[W*.06,H*.84],C=[W*.56,H*.84],k=.25+.6*(.5-.5*Math.cos(t/150));
  var q=TH(A,B,C,k);PT2('A',A,0,-10);PT2('B',B,-12,14);PT2('C',C,12,14);PT2('D',q.D,-14,5,DRED);PT2('E',q.E,14,5,DRED);
  var fx=W*.62,AB=9,AC=12,BC=15;
  TB('Thalès : (DE) // (BC)',fx,H*.14,BLUE_D,Math.min(19,W*.03),'left');
  TB('AB = 9   AC = 12   BC = 15',fx,H*.27,GREY,15,'left');
  var ad=k*AB,ae=k*AC,de=k*BC;
  TB('AD = '+FR(Math.round(ad*100)/100),fx,H*.41,DRED,16,'left');TB('AE = '+FR(Math.round(ae*100)/100),fx,H*.5,DRED,16,'left');TB('DE = '+FR(Math.round(de*100)/100),fx,H*.59,DRED,16,'left');
  TB('AD/AB = AE/AC = DE/BC = '+FR(Math.round(k*100)/100),fx,H*.78,DGREEN,Math.min(16,W*.026),'left');
  TB('(même rapport k)',fx,H*.88,GREY,14,'left');
 },
 th: '<div class="tcard"><b class="h">Le théorème de Thalès</b><p>Si D est sur [AB], E sur [AC] et si (DE) est <b>parallèle</b> à (BC), alors les côtés des deux triangles sont <b>proportionnels</b> : <b>AD/AB = AE/AC = DE/BC</b>. Le triangle ADE est une réduction du triangle ABC de rapport k = AD/AB.</p><p><i>Exemple :</i> AD = 3, AB = 9, AE = 4, BC = 15 : k = 1/3, donc AC = 4 × 3 = 12 et DE = 15 ÷ 3 = 5.</p></div>' +
  '<div class="tcard"><b class="h">Bien choisir les rapports, la configuration papillon</b><p>Écris toujours « petit côté / grand côté » d\'un même triangle, en gardant le même ordre. Attention : AD/DB n\'est pas AD/AB. Avec AD = 4, DB = 2 : AB = 6, AE/AC = 4/6, donc si AE = 5 alors AC = 7,5 et EC = 2,5.</p><p>Si (AB) // (DE) et que (AD) et (BE) se coupent en O : OA/OD = OB/OE = AB/DE. <i>Exemple :</i> OA = 4, OD = 10, OB = 6, AB = 5 donnent OE = 15 et DE = 12,5.</p></div>' +
  '<div class="tcard"><b class="h">Réciproque</b><p>Si AD/AB = AE/AC (points alignés dans le même ordre), alors (DE) // (BC). Si les rapports sont différents, les droites <b>ne sont pas</b> parallèles : AD/AB = 2/8 = 0,25 et AE/AC = 3/11 ≈ 0,27, donc non parallèles.</p></div>' +
  '<div class="tcard"><b class="h">Échelles, rapport d\'agrandissement</b><p>Un agrandissement de rapport k multiplie les <b>longueurs</b> par k, les <b>aires</b> par <b>k²</b> et les volumes par k³. Échelle 1 : 50 000 : 4 cm sur la carte = 200 000 cm = 2 km. Photocopie à 200 % : k = 2, aires × 4. Triangle de périmètre 24 cm et d\'aire 30 cm² agrandi de 2,5 : périmètre 60 cm, aire 30 × 6,25 = 187,5 cm².</p></div>'
});
SFA.figs("c09", [
 function (p) {var A=[W*.4,H*.1],B=[W*.1,H*.86],C=[W*.78,H*.86],q=TH(A,B,C,1/3);PT2('A',A,0,-10);PT2('B',B,-12,14);PT2('C',C,12,14);PT2('D',q.D,-14,6,DRED);PT2('E',q.E,14,6,DRED);
  tag('3',(A[0]+q.D[0])/2-12,(A[1]+q.D[1])/2,DRED,15);tag('9',(A[0]+B[0])/2-12,(A[1]+B[1])/2+30,BLUE_D,15);tag('4',(A[0]+q.E[0])/2+12,(A[1]+q.E[1])/2,DRED,15);tag('15',(B[0]+C[0])/2,B[1]+0,BLUE_D,15);
  FA(sg(p,.1,.7),function(){TB('k = 3/9 = 1/3',W*.76,H*.3,DGREEN,17);TB('AC = 12',W*.76,H*.42,DRED,18);TB('DE = 5',W*.76,H*.54,DRED,18);});},
 function (p) {var x0=W*.12,x1=W*.88,y=H*.5;LN(x0,y,x1,y,INK,2);for(var i=0;i<=4;i++){LN(x0+(x1-x0)*i/4,y-9,x0+(x1-x0)*i/4,y+9,INK,2);TB(i+' cm',x0+(x1-x0)*i/4,y+28,GREY,14);}
  DOT(x0,y,9,BLUE);DOT(x1,y,9,RED);TB('ville A',x0,y-22,BLUE_D,16);TB('ville B',x1,y-22,DRED,16);TB('échelle 1 : 50 000',W*.5,H*.14,BLUE_D,Math.min(22,W*.048));TB('1 cm → 50 000 cm = 500 m',W*.5,H*.28,GREY,15);
  FA(sg(p,.1,.8),function(){LN(x0,y+48,x1,y+48,GREEN,4);TB('4 × 500 m = 2 km',W*.5,y+80,DGREEN,22);});},
 function (p) {var A=[W*.42,H*.1],B=[W*.1,H*.86],C=[W*.84,H*.86],k=4/6,q=TH(A,B,C,k);PT2('A',A,0,-10);PT2('B',B,-12,14);PT2('C',C,12,14);PT2('D',q.D,-14,6,DRED);PT2('E',q.E,14,6,DRED);
  tag('4',(A[0]+q.D[0])/2-14,(A[1]+q.D[1])/2,DRED,15);tag('2',(q.D[0]+B[0])/2-14,(q.D[1]+B[1])/2,BLUE_D,15);tag('5',(A[0]+q.E[0])/2+14,(A[1]+q.E[1])/2,DRED,15);
  FA(sg(p,.1,.7),function(){TB('AD/AB = 4/6 = AE/AC',W*.78,H*.3,DGREEN,Math.min(15,W*.032),'center');TB('AC = 7,5',W*.78,H*.42,DGREEN,16);TB('EC = 2,5',W*.78,H*.54,DRED,20);tag('2,5',(q.E[0]+C[0])/2+16,(q.E[1]+C[1])/2,DRED,15);});},
 function (p) {var gy=H*.86,s=Math.min(W*.033,H*.054),tx=W*.36,sx0=W*.08,hh=12*s,sh=16*s;floor(W*.02,W*.96,gy);
  LN(sx0,gy,sx0,gy-1.5*s,BLUE_D,6);LN(sx0,gy,sx0+2*s,gy,GREY,6);LN(sx0,gy-1.5*s,sx0+2*s,gy,ORANGE,2.5,[7,5]);TB('2 m',sx0+s,gy+20,GREY,14);TB('1,5 m',sx0-8,gy-1.5*s-8,BLUE_D,14,'center');
  LN(tx,gy,tx,gy-hh,DGREEN,10);DOT(tx,gy-hh-16,18,'rgba(29,158,117,.45)');LN(tx,gy,tx+sh,gy,GREY,6);LN(tx,gy-hh,tx+sh,gy,ORANGE,2.5,[7,5]);TB('16 m',tx+sh/2,gy+20,GREY,14);TB('?',tx-14,gy-hh/2,DRED,24,'right');
  FA(sg(p,.1,.7),function(){TB('1,5/2 = h/16',W*.04,H*.12,DGREEN,19,'left');TB('h = 12 m',W*.04,H*.12+28,DRED,22,'left');});},
 function (p) {var O=[W*.55,H*.62],a=-50*Math.PI/180,b=-130*Math.PI/180,s=H*.034;function Q(d,r){return [O[0]+r*s*Math.cos(d),O[1]+r*s*Math.sin(d)];}
  var A=Q(a+Math.PI,4),D=Q(a,10),B=Q(b+Math.PI,6),E=Q(b,15);
  LNP(A,D,BLUE,3);LNP(B,E,GREEN,3);LNP(A,B,RED,3);LNP(D,E,RED,3);
  PG([O,A,B],'rgba(226,75,74,.12)',null);PG([O,D,E],'rgba(226,75,74,.08)',null);
  DOT(O[0],O[1],5,INK);TB('O',O[0],O[1]-12,INK,16);PT2('A',A,-12,-6);PT2('B',B,12,-6);PT2('D',D,12,12);PT2('E',E,-12,12);
  tag('5',(A[0]+B[0])/2,(A[1]+B[1])/2-14,DRED,15);
  FA(sg(p,.1,.7),function(){TB('k = OD/OA = 10/4 = 2,5',W*.04,H*.1,DGREEN,Math.min(16,W*.034),'left');TB('OE = 6 × 2,5 = 15',W*.04,H*.1+22,DGREEN,16,'left');TB('DE = 5 × 2,5 = 12,5',W*.04,H*.1+44,DRED,18,'left');});},
 function (p) {var A=[W*.4,H*.1],B=[W*.1,H*.86],C=[W*.8,H*.86];var k=.25,D=[A[0]+k*(B[0]-A[0]),A[1]+k*(B[1]-A[1])],E=[A[0]+(3/11)*(C[0]-A[0]),A[1]+(3/11)*(C[1]-A[1])];
  TRI(A,B,C,'rgba(55,138,221,.07)',BLUE_D,3);LNP(D,E,RED,3.4);LNP(D,[D[0]+(C[0]-B[0])*(1-k)+0,D[1]],GREY,1.6,[6,5]);DOT(D[0],D[1],4.5,RED);DOT(E[0],E[1],4.5,RED);PT2('A',A,0,-10);PT2('B',B,-12,14);PT2('C',C,12,14);PT2('D',D,-14,5,DRED);PT2('E',E,14,5,DRED);
  FA(sg(p,.1,.7),function(){TB('AD/AB = 2/8 = 0,25',W*.78,H*.28,DGREEN,16);TB('AE/AC = 3/11 ≈ 0,27',W*.78,H*.4,DRED,16);TB('≠ : pas parallèles',W*.76,H*.56,DRED,20);});},
 function (p) {var A=[W*.18,H*.12],B=[W*.03,H*.8],C=[W*.36,H*.8],A2=[W*.62,H*.12-0],B2=[W*.5,H*.8],C2=[W*.5+(W*.33)*1.0,H*.8];
  var s1=.45,a1=[W*.2,H*.82],b1=[a1[0]+W*.22,a1[1]],c1=[a1[0]+W*.06,a1[1]-H*.34];TRI(c1,a1,b1,'rgba(55,138,221,.12)',BLUE_D,3);
  var k=2.5,a2=[W*.48,H*.88],b2=[a2[0]+W*.22*1.0*1.0*(W*.5/(W*.22*2.5)),a2[1]];
  var f=Math.min(1.15,(W*.46)/(W*.22*2.5)*1,(H*.8)/(H*.34*2.5)*1);var a3=[W*.44,H*.9],b3=[a3[0]+W*.22*2.5*f,a3[1]],c3=[a3[0]+W*.06*2.5*f,a3[1]-H*.34*2.5*f];
  TRI(c3,a3,b3,'rgba(29,158,117,.12)',DGREEN,3);TB('P = 24 cm · A = 30 cm²',a1[0]+W*.08,H*.97,BLUE_D,13);
  TB('× 2,5',W*.37,H*.5,ORANGE,22);
  FA(sg(p,.1,.7),function(){TB('P = 60 cm',a3[0]+W*.22,a3[1]-H*.2,DRED,Math.min(18,W*.04));TB('A = 187,5 cm²',a3[0]+W*.22,a3[1]-H*.2+24,DRED,Math.min(18,W*.04));TB('(2,5² = 6,25)',a3[0]+W*.22,a3[1]-H*.2+46,GREY,14);});},
 function (p) {var s=Math.min(W*.2,H*.4),x0=W*.12,y0=H*.5;RC(x0,y0,s,s,'rgba(55,138,221,.15)',BLUE_D,3);TB('1',x0+s/2,y0+s/2+6,BLUE_D,18);TB('100 %',x0+s/2,y0+s+22,GREY,14);
  var x1=W*.44,s2=2*s*.9;s2=Math.min(s2,H*.8);var ss=s2/2;var yy=y0+s-s2;RC(x1,yy,s2,s2,'rgba(29,158,117,.12)',DGREEN,3);TB('200 %',x1+s2/2,y0+s+22,GREY,14);
  TB('× 2',W*.33,y0+s/2,ORANGE,24);
  FA(sg(p,.1,.5),function(){LN(x1+ss,yy,x1+ss,yy+s2,DGREEN,2,[6,4]);LN(x1,yy+ss,x1+s2,yy+ss,DGREEN,2,[6,4]);[[0,0],[1,0],[0,1],[1,1]].forEach(function(q,i){TB('1',x1+ss*(q[0]+.5),yy+ss*(q[1]+.5)+6,DGREEN,16);});});
  FA(sg(p,.5,1),function(){TB('aire × 4  (2²)',W*.04,H*.14,DRED,Math.min(20,W*.04),'left');});},
 function (p) {var gy=H*.86,ax=W*.8/30,by=H*.72/25.6,ox=W*.06,ey=1.6*by;LN(W*.02,gy,W*.98,gy,INK,2);
  var ex=ox,eyY=gy-ey,px=ox+3*ax,py=gy-4*by,bx=ox+30*ax,bh=25.6*by;
  LN(px,gy,px,py,ORANGE,6);LN(bx,gy,bx,gy-bh,GREY,10);DOT(ex,eyY,6,BLUE);LN(ex,gy,ex,eyY,BLUE,4);
  LN(ex,eyY,px,py,RED,2.5);FA(sg(p,.1,.5),function(){LN(px,py,bx,gy-bh,RED,2.5);LN(ex,eyY,px,py,RED,2.5);});
  TB('1,6 m',ex+4,eyY-12,BLUE_D,13,'left');TB('4 m',px+10,gy-2*by,'#8a5a10',13,'left');TB('3 m',(ex+px)/2,gy+18,GREY,13);TB('27 m',(px+bx)/2,gy+18,GREY,13);
  if(p===0)TB('?',bx-16,gy-bh/2,GREY,26);
  FA(sg(p,.5,1),function(){TB('(h − 1,6)/(4 − 1,6) = 30/3',W*.36,H*.2,DGREEN,Math.min(16,W*.034),'left');TB('h = 25,6 m',W*.36,H*.2+26,DRED,22,'left');LN(bx+14,gy,bx+14,gy-bh,DRED,3);});},
 function (p) {var A=[W*.4,H*.1],B=[W*.08,H*.86],C=[W*.78,H*.86],q=TH(A,B,C,2/3,'rgba(55,138,221,.28)',DGREEN);PT2('A',A,0,-10);PT2('B',B,-12,14);PT2('C',C,12,14);PT2('D',q.D,-14,6,DGREEN);PT2('E',q.E,14,6,DGREEN);
  TB('72 cm²',W*.4,H*.78,BLUE_D,16);
  FA(sg(p,.1,.7),function(){TB('k² = 4/9',W*.8,H*.24,DGREEN,18);TB('ADE : 32 cm²',W*.78,H*.38,DRED,18);TB('DBCE : 40 cm²',W*.78,H*.52,DGREEN,18);});}
]);
})();
