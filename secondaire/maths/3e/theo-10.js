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
function RTB(Ax,Ay,a,b){/* triangle rectangle en B : A à gauche, B à droite de A (distance a), C au-dessus de B (hauteur b) */var A=[Ax,Ay],B=[Ax+a,Ay],C=[Ax+a,Ay-b];TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);RANG(B[0],B[1],-1,0,0,-1,12,GREY);return {A:A,B:B,C:C};}
function F1(v,d){return FR(Math.round(v*Math.pow(10,d))/Math.pow(10,d)).replace(/^(−?\d+)$/,function(m){return d?m+','+Array(d+1).join('0'):m;});}
SFA.theo("c10", {
 icon: function () {var q=RTB(W*.14,H*.8,W*.5,H*.5);ANG(q.A,q.B,q.C,48,ORANGE,'α',20);
  TB('sin α = opposé / hypoténuse',W*.7,H*.28,BLUE_D,Math.min(17,W*.036),'center');TB('cos α = adjacent / hypoténuse',W*.7,H*.4,DGREEN,Math.min(17,W*.036),'center');TB('tan α = opposé / adjacent',W*.7,H*.52,DRED,Math.min(17,W*.036),'center');},
 anim: function (t) {
  var al=8+74*(.5-.5*Math.cos(t/130)),a=al*Math.PI/180,r=Math.min(H*.7,W*.38),O=[W*.1,H*.86];
  ctx.strokeStyle='#dfe3e7';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(O[0],O[1],r,-Math.PI/2,0);ctx.stroke();
  LN(O[0]-6,O[1],O[0]+r+14,O[1],AX,1.5);LN(O[0],O[1]+4,O[0],O[1]-r-12,AX,1.5);
  var P=[O[0]+r*Math.cos(a),O[1]-r*Math.sin(a)],F=[P[0],O[1]];
  PG([O,F,P],'rgba(55,138,221,.10)',null);LNP(O,P,INK,3);LNP(O,F,GREEN,5);LNP(F,P,RED,5);RANG(F[0],F[1],-1,0,0,-1,11,GREY);DOT(P[0],P[1],6,ORANGE);
  ANG(O,[O[0]+r,O[1]],P,r*.28,ORANGE,'α',16);TB('1',(O[0]+P[0])/2-14,(O[1]+P[1])/2-6,INK,14);
  TB('cos α',(O[0]+F[0])/2,O[1]+20,DGREEN,15);TB('sin α',F[0]+30,(F[1]+P[1])/2,DRED,15);
  var fx=W*.6;TB('α = '+Math.round(al)+'°',fx,H*.16,ORANGE,20,'left');
  TB('sin α = '+F1(Math.sin(a),2),fx,H*.36,DRED,18,'left');TB('cos α = '+F1(Math.cos(a),2),fx,H*.5,DGREEN,18,'left');TB('tan α = '+F1(Math.tan(a),2),fx,H*.64,BLUE_D,18,'left');
  TB('hypoténuse = 1',fx,H*.82,GREY,14,'left');
 },
 th: '<div class="tcard"><b class="h">Les trois rapports</b><p>Dans un triangle <b>rectangle</b>, pour un angle aigu α : <b>sin α = côté opposé / hypoténuse</b> ; <b>cos α = côté adjacent / hypoténuse</b> ; <b>tan α = côté opposé / côté adjacent</b>. Ces rapports ne dépendent que de α, pas de la taille du triangle (triangles semblables).</p><p><i>Exemple :</i> triangle 3-4-5 rectangle en B, avec α en A : sin A = 4/5 = 0,8 ; cos A = 3/5 = 0,6 ; tan A = 4/3.</p></div>' +
  '<div class="tcard"><b class="h">Calculatrice (en degrés !)</b><p>Vérifie que la calculatrice est en <b>degrés</b>. sin 25° ≈ 0,423 ; cos 60° = 0,5 ; tan 45° = 1. Valeurs utiles : sin 30° = 1/2 = cos 60°. Pour retrouver l\'angle, on utilise les touches <b>sin⁻¹, cos⁻¹, tan⁻¹</b> : si tan α = 5/12, α = tan⁻¹(5/12) ≈ 22,6°.</p></div>' +
  '<div class="tcard"><b class="h">Calculer un côté ou un angle</b><p>1) Repère l\'angle connu, nomme les côtés (opposé, adjacent, hypoténuse). 2) Choisis le rapport qui relie <b>la donnée et l\'inconnue</b>. 3) Résous.</p><p><i>Exemple :</i> hypoténuse 12 cm, angle 35° : opposé = 12 × sin 35° ≈ 6,88 cm ; adjacent = 12 × cos 35° ≈ 9,83 cm. Arbre vu sous 38° à 20 m : h = 20 × tan 38° + 1,6 ≈ 17,2 m (n\'oublie pas la hauteur des yeux).</p></div>' +
  '<div class="tcard"><b class="h">Pente et angles de visée</b><p>Une pente de 12 % veut dire tan α = 0,12 : α ≈ 6,8°. Sur 2,5 km horizontaux, le dénivelé est 0,12 × 2 500 = 300 m. Un <b>angle de dépression</b> se mesure à partir de l\'horizontale vers le bas : il est égal à l\'angle d\'élévation vu depuis le bas.</p></div>'
});
SFA.figs("c10", [
 function (p) {var q=RTB(W*.14,H*.78,W*.27*1.0,W*.27*4/3);ANG(q.A,q.B,q.C,34,ORANGE,'A',16);
  TB('3',(q.A[0]+q.B[0])/2,q.A[1]+22,BLUE_D,16);TB('4',q.B[0]+16,(q.B[1]+q.C[1])/2,BLUE_D,16);TB('5',(q.A[0]+q.C[0])/2-14,(q.A[1]+q.C[1])/2-6,BLUE_D,16);TB('A',q.A[0]-10,q.A[1]+6,INK,15);TB('B',q.B[0]+12,q.B[1]+16,INK,15);TB('C',q.C[0]+4,q.C[1]-8,INK,15);
  FA(sg(p,.1,.8),function(){TB('sin A = 4/5 = 0,8',W*.68,H*.3,DRED,Math.min(18,W*.038),'left');TB('cos A = 3/5 = 0,6',W*.68,H*.45,DGREEN,Math.min(18,W*.038),'left');TB('tan A = 4/3',W*.68,H*.6,BLUE_D,Math.min(18,W*.038),'left');});},
 function (p) {var x=W*.22,w=W*.56,y=H*.08,h=H*.84;ctx.fillStyle='#f1f3f5';ctx.beginPath();ctx.roundRect(x,y,w,h,14);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#e3efe6';ctx.beginPath();ctx.roundRect(x+14,y+14,w-28,h*.34,6);ctx.fill();TB('mode : DEG',x+w-22,y+34,DGREEN,13,'right');
  TB('sin(25)',x+26,y+h*.2,INK,18,'left');FA(sg(p,.1,.4),function(){TB('0,423',x+w-26,y+h*.3,DRED,22,'right');});
  var rows=[['sin','cos','tan'],['sin⁻¹','cos⁻¹','tan⁻¹']];rows.forEach(function(rw,i){rw.forEach(function(k,j){var bx=x+20+j*(w-40)/3,by=y+h*.5+i*h*.22,bw=(w-40)/3-8;RC(bx,by,bw,h*.17,'#fff',GREY,2);TB(k,bx+bw/2,by+h*.11,i?ORANGE:BLUE_D,16);});});
  FA(sg(p,.4,1),function(){TB('sin 25° ≈ 0,423  ·  cos 60° = 0,5  ·  tan 45° = 1',W*.5,H*.985,DRED,Math.min(14,W*.03));});},
 function (p) {var k=Math.min(1,(H*.6)/(W*.62*Math.tan(35*Math.PI/180))),q=RTB(W*.12,H*.88,W*.62*k,W*.62*k*Math.tan(35*Math.PI/180));
  ANG(q.A,q.B,q.C,44,ORANGE,'35°',15);TB('12',(q.A[0]+q.C[0])/2-18,(q.A[1]+q.C[1])/2-8,DRED,17);
  FA(sg(p,.1,.5),function(){TB('opposé = 12 sin 35° ≈ 6,88 cm',W*.5,H*.1,DRED,Math.min(16,W*.034));TB('6,88',q.B[0]+30,(q.B[1]+q.C[1])/2,DRED,16);});
  FA(sg(p,.4,.9),function(){TB('adjacent = 12 cos 35° ≈ 9,83 cm',W*.5,H*.1+24,DGREEN,Math.min(16,W*.034));TB('9,83',(q.A[0]+q.B[0])/2,q.A[1]+22,DGREEN,16);});},
 function (p) {var a=W*.5,b=a*5/12;var q=RTB(W*.14,H*.78,a*1.2,b*1.2);ANG(q.A,q.B,q.C,50,ORANGE,'α',18);TB('12',(q.A[0]+q.B[0])/2,q.A[1]+22,BLUE_D,16);TB('5',q.B[0]+16,(q.B[1]+q.C[1])/2,BLUE_D,16);
  FA(sg(p,.1,.8),function(){TB('tan α = 5/12',W*.5,H*.1,DGREEN,19);TB('α = tan⁻¹(5/12) ≈ 22,6°',W*.5,H*.1+28,DRED,20);});},
 function (p) {var gy=H*.88,ex=W*.1,s=Math.min(W*.6/20,H*.62/15.6),tx=ex+20*s,ey=1.6*s,h=17.2*s;floor(W*.02,W*.96,gy);
  LN(tx,gy,tx,gy-h,DGREEN,10);DOT(tx,gy-h-14,16,'rgba(29,158,117,.45)');
  LN(ex,gy,ex,gy-ey,BLUE,5);DOT(ex,gy-ey,6,BLUE);TB('yeux : 1,6 m',ex-8,gy-ey-12,BLUE_D,13,'left');var eye=[ex,gy-ey],top=[tx,eye[1]-20*s*Math.tan(38*Math.PI/180)];
  LN(ex,eye[1],tx,eye[1],GREY,1.6,[6,5]);
  FA(sg(p,.05,.5),function(){LNP(eye,top,RED,2.5);ANG(eye,[eye[0]+80,eye[1]],top,60,ORANGE,'38°',15);});
  TB('20 m',(ex+tx)/2,gy+22,GREY,15);if(p===0)TB('h = ?',tx+14,gy-h/2,GREY,20,'left');
  FA(sg(p,.4,1),function(){TB('h = 20 tan 38° + 1,6',tx+16,H*.3,DGREEN,Math.min(16,W*.034),'left');TB('h ≈ 17,2 m',tx+16,H*.3+26,DRED,22,'left');});},
 function (p) {var gx=W*.08,gy=H*.86,hy=H*.12,wx=gx,L=W*.0,wall0=gx;LN(W*.04,gy,W*.96,gy,INK,2);wall(wx,hy,gy,1);
  var foot=wx+(W*.62)/1,top=[wx,gy-Math.sqrt(36-4)*(W*.62)/2];var sc=(W*.62)/2;var tp=[wx,gy-Math.sqrt(32)*sc*.0+0];var hh=Math.min(Math.sqrt(32)*sc,H*.74),k2=hh/(Math.sqrt(32));var fx=wx+2*k2;
  LN(fx,gy,wx,gy-hh,ORANGE,5);LN(wx,gy,fx,gy,BLUE,2,[5,4]);TB('2 m',(wx+fx)/2,gy+20,BLUE_D,15);TB('6 m',(wx+fx)/2+34,gy-hh/2,DRED,17);ANG([fx,gy],[wx,gy],[wx,gy-hh],40,ORANGE,'α',16);
  FA(sg(p,.1,.8),function(){TB('cos α = 2/6 = 1/3',W*.58,H*.3,DGREEN,Math.min(19,W*.04),'left');TB('α = cos⁻¹(1/3) ≈ 70,5°',W*.58,H*.3+30,DRED,Math.min(19,W*.04),'left');});},
 function (p) {var C=[W*.14,H*.8],a=W*.62,b=a*5/12*1.0;var A=[C[0]+a,C[1]],B=[C[0],C[1]-b];
  TRI(B,C,A,'rgba(55,138,221,.10)',BLUE_D,3);RANG(C[0],C[1],1,0,0,-1,12,GREY);TB('A',A[0]+12,A[1]+16,INK,15);TB('B',B[0]-4,B[1]-10,INK,15);TB('C',C[0]-12,C[1]+14,INK,15);
  TB('12',(C[0]+A[0])/2,C[1]+22,BLUE_D,16);TB('5',C[0]-16,(C[1]+B[1])/2,BLUE_D,16);
  FA(sg(p,.1,.5),function(){LNP(A,B,RED,3.5);TB('13',(A[0]+B[0])/2+16,(A[1]+B[1])/2-8,DRED,18);ANG(A,C,B,36,ORANGE,'22,6°',14);});
  FA(sg(p,.5,1),function(){ANG(B,A,C,36,GREEN,'67,4°',14);TB('AB = 13 ; A ≈ 22,6° ; B ≈ 67,4°',W*.5,H*.97,DRED,Math.min(15,W*.032));});},
 function (p) {var s=Math.min(W*.2,H*.4),C=[W*.12,H*.85],a=W*.3,B=[C[0]+a,C[1]],A=[C[0]+a,C[1]-a*Math.sqrt(3)];
  if(C[1]-A[1]>H*.7){var k=H*.7/(C[1]-A[1]);a*=k;B=[C[0]+a,C[1]];A=[C[0]+a,C[1]-a*Math.sqrt(3)];}
  TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);RANG(B[0],B[1],-1,0,0,-1,12,GREY);ANG(C,B,A,34,ORANGE,'30°',14);ANG(A,C,B,34,GREEN,'60°',14);
  TB('1',(C[0]+A[0])/2-12,(C[1]+A[1])/2,BLUE_D,16);TB('1/2',(C[0]+B[0])/2,C[1]+22,BLUE_D,15);
  FA(sg(p,.1,.7),function(){TB('sin 30° = 1/2',W*.56,H*.2,DGREEN,18,'left');TB('cos 60° = 1/2',W*.56,H*.2+28,DGREEN,18,'left');TB('égaux  ✓',W*.56,H*.2+60,DRED,20,'left');});},
 function (p) {var C=[W*.1,H*.82],a=W*.62,b=a*.12*1.0;b=a*.12*2.2;var B2=[C[0]+a,C[1]],T=[C[0]+a,C[1]-b];
  var q=[C,B2,T];TRI(T,C,B2,'rgba(55,138,221,.10)',BLUE_D,3);RANG(B2[0],B2[1],-1,0,0,-1,12,GREY);
  TB('2,5 km',(C[0]+B2[0])/2,C[1]+22,BLUE_D,15);TB('?',B2[0]+14,(B2[1]+T[1])/2,DRED,18);
  FA(sg(p,.1,.5),function(){TB('dénivelé 0,12 × 2 500 = 300 m',W*.5,H*.1,DGREEN,Math.min(16,W*.034));});
  FA(sg(p,.4,.8),function(){ANG(C,B2,T,50,ORANGE,'6,8°',14);TB('tan α = 0,12 → α ≈ 6,8°',W*.5,H*.1+24,DRED,Math.min(16,W*.034));});
  FA(sg(p,.7,1),function(){TB('longueur ≈ 2 518 m ≈ 2,52 km',W*.5,H*.1+48,DRED,Math.min(16,W*.034));});},
 function (p) {var gy=H*.9,cx=W*.12,hh=H*.62,top=[cx,gy-hh],k=hh/60,d1=60/Math.tan(15*Math.PI/180),d2=60/Math.tan(25*Math.PI/180);var sc=(W*.8)/d1,sx=Math.min(1,0);
  var xs=function(d){return cx+d*sc;};ctx.fillStyle='rgba(55,138,221,.12)';ctx.fillRect(cx,gy,W*.9,H*.1);LN(cx,gy,W*.98,gy,BLUE,2);
  ctx.fillStyle='#d9d4c8';ctx.fillRect(cx-W*.06,top[1],W*.06,hh);ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.strokeRect(cx-W*.06,top[1],W*.06,hh);TB('60 m',cx-W*.03,gy-hh/2,'#555',14);
  var pts=[[d2,25,GREEN],[d1,15,ORANGE]];pts.forEach(function(q){var x=xs(q[0]);LN(top[0],top[1],x,gy,q[2],2.5);DOT(x,gy,7,q[2]);LN(top[0],top[1],cx+W*.5,top[1],GREY,1.2,[5,4]);});
  ANG(top,[top[0]+80,top[1]],[xs(d1),gy],60,ORANGE,'15°',14);ANG(top,[top[0]+80,top[1]],[xs(d2),gy],34,GREEN,'25°',14);
  FA(sg(p,.1,.8),function(){TB('60/tan 15° ≈ 223,9 m',W*.55,H*.2,DGREEN,Math.min(15,W*.032),'left');TB('60/tan 25° ≈ 128,7 m',W*.55,H*.3,DGREEN,Math.min(15,W*.032),'left');TB('distance ≈ 95,3 m',W*.55,H*.45,DRED,19,'left');LN(xs(d2),gy-14,xs(d1),gy-14,RED,4);});}
]);
})();
