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
SFA.theo("c07", {
 icon: function () {
  var A=[W*.5,H*.2],B=[W*.22,H*.78],C=[W*.8,H*.78];TRI(A,B,C,'rgba(55,138,221,.12)',BLUE_D,3);
  ANG(A,B,C,34,RED,'',14);ANG(B,C,A,34,GREEN,'',14);ANG(C,A,B,34,ORANGE,'',14);
  TB('A + B + C = 180°',W*.5,H*.97,BLUE_D,Math.min(26,W*.056));
 },
 anim: function (t) {
  var y=H*.2+0,xb=W*.22,xc=W*.78,yb=H*.78,ax=W*.3+W*.4*(.5+.5*Math.sin(t/110)),A=[ax,y],B=[xb,yb],C=[xc,yb];
  LN(W*.08,y,W*.92,y,GREY,1.6,[7,5]);TB('parallèle à (BC) passant par A',W*.88,y-9,GREY,13,'right');
  TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);
  var a=ANG(A,B,C,34,RED,'',14),b=ANG(B,C,A,34,GREEN,'',14),c=ANG(C,A,B,34,ORANGE,'',14);
  ANG(A,[W*.08,y],B,34,GREEN,'',14);ANG(A,C,[W*.92,y],34,ORANGE,'',14);
  TB('B = '+FR(Math.round(b))+'°',B[0]+10,yb+24,DGREEN,16,'center');TB('C = '+FR(Math.round(c))+'°',C[0]-10,yb+24,'#8a5a10',16);TB('A = '+FR(Math.round(a))+'°',A[0],A[1]-34+(a>90?-2:0),DRED,16);
  TB('A + B + C = '+Math.round(a)+' + '+Math.round(b)+' + '+Math.round(c)+' = 180°',W*.5,H*.97,BLUE_D,Math.min(22,W*.04));
  TB('alternes-internes',W*.08,y+36,DGREEN,13,'left');TB('égaux',W*.08,y+52,DGREEN,13,'left');
 },
 th: '<div class="tcard"><b class="h">Angles et droites</b><p>Deux droites sécantes forment des angles <b>opposés par le sommet</b> (égaux) et des angles <b>adjacents supplémentaires</b> (somme 180°) : si un angle vaut 52°, les autres valent 128°, 52°, 128°.</p><p>Avec deux <b>parallèles coupées par une sécante</b> : les angles <b>correspondants</b> sont égaux, les <b>alternes-internes</b> sont égaux. Réciproquement, si deux angles alternes-internes ou correspondants sont égaux, les droites sont parallèles.</p></div>' +
  '<div class="tcard"><b class="h">Somme des angles</b><p>Dans un triangle : A + B + C = <b>180°</b>. Preuve : on trace par A la parallèle à (BC) ; les angles alternes-internes en A valent B et C, et avec l\'angle A ils forment un angle plat.</p><p><i>Exemple :</i> 47° et 68° donnent 180 − 115 = 65°. Pour un polygone à n côtés, la somme vaut (n − 2) × 180° : 720° pour l\'hexagone, soit 120° par angle si il est régulier.</p></div>' +
  '<div class="tcard"><b class="h">Cas d\'isométrie</b><p>Deux triangles sont <b>isométriques</b> (superposables) s\'ils ont : <b>CCC</b> trois côtés égaux ; <b>CAC</b> deux côtés et l\'<b>angle compris</b> égaux ; <b>ACA</b> un côté et les deux angles adjacents égaux.</p><p>Attention : <b>CCA</b> (deux côtés et un angle <b>non compris</b>) ne suffit pas : il peut y avoir deux triangles différents. Et trois angles égaux donnent seulement des triangles semblables.</p></div>' +
  '<div class="tcard"><b class="h">Méthode</b><p>Pour un angle inconnu : repère le type d\'angles (opposés, correspondants, alternes-internes, somme 180°), écris une équation (ex. x + 2x + (3x + 30) = 180 donne x = 25), résous, puis vérifie la somme.</p></div>'
});
SFA.figs("c07", [
 function (p) {var c=[W*.5,H*.5],r=Math.min(W,H)*.36,u=EXT(c,25,r*1.15),v=EXT(c,25+128,r*1.15);
  LNP(u[0],u[1],BLUE,3.2);LNP(v[0],v[1],GREEN,3.2);
  var d=[ROT(c,r,25),ROT(c,r,153),ROT(c,r,205),ROT(c,r,333)];
  ANG(c,d[0],d[1],r*.4,RED,'',13);TB('52°',c[0]+r*.7*Math.cos(1.0*0+(-(25+64)*Math.PI/180))*0+ROT(c,r*.6,38)[0]-c[0]+0,0,RED,1);
  var q=ROT(c,r*.62,25+64);TB('128°',q[0],q[1],DGREEN,15);q=ROT(c,r*.62,25+64+180);TB('128°',q[0],q[1],DGREEN,15);
  q=ROT(c,r*.62,38.5);tag('52°',q[0],q[1]+5,DRED,16);
  q=ROT(c,r*.62,38.5+180);FA(sg(p,.2,.6),function(){tag('52°',q[0],q[1]+5,DRED,16);});
  FA(sg(p,.5,.9),function(){ANG(c,d[1],d[2],r*.34,GREEN,'',13);});DOT(c[0],c[1],4,INK);},
 function (p) {var A=[W*.5,H*.14],B=[W*.14,H*.82],C=[W*.84,H*.82];TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);
  ANG(B,C,A,40,GREEN,'47°',15);ANG(C,A,B,40,ORANGE,'68°',15);FA(sg(p,.2,.7),function(){ANG(A,B,C,40,RED,'65°',16);TB('47° + 68° + 65° = 180°',W*.5,H*.97,DRED,16);});if(p===0)TB('?',A[0],A[1]+44,GREY,22);},
 function (p) {var ys=PAR(p,H*.3,H*.72,W*.08,W*.92,60);var a=ys.P1,b=ys.P2;
  ANG(a,[a[0]-60,a[1]],ys.T1,38,RED,'70°',14);
  FA(sg(p,.15,.6),function(){ANG(b,[b[0]+60,b[1]],ys.T0,38,GREEN,'70°',14);TB('alternes-internes : égaux',W*.04,H*.08,DGREEN,16,'left');});
  if(p===0)TB('?',b[0]+52,b[1]-16,GREY,22);},
 function (p) {var A=[W*.5,H*.2],B=[W*.1,H*.84],C=[W*.9,H*.84];
  /* triangle aux angles 25,50,105 : B=25 C=50 A=105 */
  var bb=[W*.1,H*.84],cc=[W*.9,H*.84],L=cc[0]-bb[0],sB=Math.sin(25*Math.PI/180),sC=Math.sin(50*Math.PI/180),sA=Math.sin(105*Math.PI/180),ab=L*sC/sA;
  var a=[bb[0]+ab*Math.cos(25*Math.PI/180),bb[1]-ab*sB],k=Math.min(1,(H*.62)/(bb[1]-a[1]));
  var A2=[bb[0]+(a[0]-bb[0])*k,bb[1]-(bb[1]-a[1])*k],C2=[bb[0]+(cc[0]-bb[0])*k,bb[1]];
  TRI(A2,bb,C2,'rgba(55,138,221,.10)',BLUE_D,3);
  ANG(bb,C2,A2,42,GREEN,'x',16);ANG(C2,A2,bb,36,ORANGE,'2x',16);ANG(A2,bb,C2,34,RED,'3x+30',15);
  FA(sg(p,.1,.7),function(){TB('x + 2x + 3x + 30 = 180  ⇒  x = 25',W*.5,H*.07,DRED,Math.min(17,W*.036));TB('25°',bb[0]+82,bb[1]-5,DGREEN,15);TB('50°',C2[0]-70,C2[1]-4,'#8a5a10',15);TB('105°',A2[0],A2[1]-44,DRED,15);});},
 function (p) {var ys=PAR(p,H*.3,H*.72,W*.08,W*.92,62);var a=ys.P1,b=ys.P2;
  ANG(a,[a[0]+60,a[1]],ys.T1,38,RED,'3x+10',13);ANG(b,[b[0]+60,b[1]],ys.T1,38,GREEN,'5x−30',13);
  FA(sg(p,.1,.7),function(){TB('correspondants égaux : 3x + 10 = 5x − 30',W*.04,H*.07,DRED,Math.min(16,W*.034),'left');TB('x = 20  →  70°',W*.5,H*.95,DGREEN,18);});},
 function (p) {var h=W/2,B1=[W*.08,H*.78],C1=[W*.4,H*.78],A1=[W*.08+(W*.32)*.35,H*.2];
  function T(o){var B=[B1[0]+o,B1[1]],C=[C1[0]+o,C1[1]],A=[A1[0]+o+W*.0,A1[1]];return [A,B,C];}
  var t1=T(0),t2=T(W*.5);TRI(t1[0],t1[1],t1[2],'rgba(55,138,221,.10)',BLUE_D,3);TRI(t2[0],t2[1],t2[2],'rgba(29,158,117,.10)',DGREEN,3);
  ANG(t1[1],t1[2],t1[0],30,RED,'40°',13);ANG(t2[1],t2[2],t2[0],30,RED,'40°',13);
  [['A',t1[0],-12,-8],['B',t1[1],-14,10],['C',t1[2],12,10]].forEach(function(q){TB(q[0],q[1][0]+q[2],q[1][1]+q[3],BLUE_D,15);});[['D',t2[0],-12,-8],['E',t2[1],-14,10],['F',t2[2],12,10]].forEach(function(q){TB(q[0],q[1][0]+q[2],q[1][1]+q[3],DGREEN,15);});
  TB('5',(t1[0][0]+t1[1][0])/2-12,(t1[0][1]+t1[1][1])/2,BLUE_D,14);TB('7',(t1[1][0]+t1[2][0])/2,t1[1][1]+20,BLUE_D,14);TB('5',(t2[0][0]+t2[1][0])/2-12,(t2[0][1]+t2[1][1])/2,DGREEN,14);TB('7',(t2[1][0]+t2[2][0])/2,t2[1][1]+20,DGREEN,14);
  FA(sg(p,.2,.7),function(){TB('CAC : l\'angle B est compris entre AB et BC → isométriques',W*.5,H*.95,DRED,Math.min(15,W*.031));});},
 function (p) {var cx=W*.5,cy=H*.48,r=Math.min(W,H)*.19,hexc=[[0,0],[1,0],[.5,1]],i;
  function HX(x,y,col,rr){var pts=[];for(var k=0;k<6;k++){var a=(30+60*k)*Math.PI/180;pts.push([x+rr*Math.cos(a),y-rr*Math.sin(a)]);}PG(pts,col,INK,2);return pts;}
  var s=r*1.02,v=[cx,cy],cols=['rgba(55,138,221,.2)','rgba(29,158,117,.2)','rgba(186,117,21,.22)'];
  /* trois hexagones autour du sommet v : centres à distance s dans les directions 90, 210, 330 */
  [90,210,330].forEach(function(d,k){var c=ROT(v,s,d);HX(c[0],c[1],cols[k],s);});
  [[30,150],[150,270],[270,30]].forEach(function(q,k){var a1=q[0]*Math.PI/180,a2=(q[1]<q[0]?q[1]+360:q[1])*Math.PI/180;ctx.strokeStyle=[BLUE_D,DGREEN,'#8a5a10'][k];ctx.lineWidth=3;ctx.beginPath();ctx.arc(v[0],v[1],s*.32,-a2,-a1);ctx.stroke();var m=((q[0]+(q[1]<q[0]?q[1]+360:q[1]))/2)*Math.PI/180;});
  TB('120°',cx+s*.42*Math.cos(-90*Math.PI/180+0)*0,cy-s*.58,DGREEN,14);TB('120°',cx-s*.5,cy+s*.34,'#8a5a10',14);TB('120°',cx+s*.5,cy+s*.34,BLUE_D,14);DOT(cx,cy,4,INK);
  FA(sg(p,.1,.6),function(){TB('hexagone : (6 − 2) × 180° = 720°  →  720° ÷ 6 = 120°',W*.5,H*.06,DRED,Math.min(15,W*.031));});
  FA(sg(p,.5,1),function(){TB('3 × 120° = 360° : trois hexagones',W*.5,H*.96,DGREEN,16);});},
 function (p) {var s=Math.min(W*.075,H*.085),A=[W*.1,H*.82];function Q(x,y){return [A[0]+x*s,A[1]-y*s];}
  var C=Q(8*Math.cos(Math.PI/6),4),B1=Q(8*Math.cos(Math.PI/6)-3,0),B2=Q(8*Math.cos(Math.PI/6)+3,0),Ap=Q(0,0);
  LNP(Q(0,0),Q(13,0),GREY,2);ctx.strokeStyle='rgba(55,138,221,.5)';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(C[0],C[1],5*s,0,7);ctx.stroke();ctx.setLineDash([]);
  LNP(Ap,C,BLUE,3.2);DOT(C[0],C[1],5,INK);DOT(Ap[0],Ap[1],5,INK);TB('A',Ap[0]-6,Ap[1]+20,INK,15);TB('C',C[0],C[1]-12,INK,15);TB('8',(Ap[0]+C[0])/2-12,(Ap[1]+C[1])/2-6,BLUE_D,14);TB('5',C[0]+22,C[1]+34,BLUE_D,14);
  ANG(Ap,Q(5,0),C,38,RED,'30°',13);
  FA(sg(p,.1,.5),function(){LNP(C,B1,GREEN,3.2);DOT(B1[0],B1[1],6,GREEN);TB('B₁',B1[0],B1[1]+20,DGREEN,15);});
  FA(sg(p,.4,.8),function(){LNP(C,B2,ORANGE,3.2);DOT(B2[0],B2[1],6,ORANGE);TB('B₂',B2[0],B2[1]+20,'#8a5a10',15);});
  FA(sg(p,.7,1),function(){TB('deux triangles différents',W*.7,H*.2,DRED,18,'center');TB('(CCA ne suffit pas)',W*.7,H*.2+22,DRED,15);});},
 function (p) {var A=[W*.62,H*.22],B=[W*.2,H*.8],C=[W*.86,H*.8];TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);LN(W*.05,A[1],W*.95,A[1],GREY,1.8,[7,5]);
  TB('(BC)',W*.93,C[1]+20,GREY,13);TB('A',A[0],A[1]-12,INK,15);TB('B',B[0]-12,B[1]+8,INK,15);TB('C',C[0]+12,C[1]+8,INK,15);
  ANG(A,[W*.05,A[1]],B,34,GREEN,'',13);ANG(B,C,A,34,GREEN,'B',15);
  ANG(A,C,[W*.95,A[1]],34,ORANGE,'',13);ANG(C,A,B,34,ORANGE,'C',15);ANG(A,B,C,34,RED,'A',15);
  FA(sg(p,.2,.8),function(){TB('B (alt.-int.) + A + C (alt.-int.) = angle plat = 180°',W*.5,H*.08,DRED,Math.min(15,W*.031));});},
 function (p) {var apx=W*.5,ay=H*.14,by=H*.82,hb=W*.34,A=[apx,ay];
  var a=110,b=35,hh=(by-ay),hx=hh*Math.tan(55*Math.PI/180);var sc=Math.min(1,hb/hx),dxx=hx*sc,B=[apx-dxx,by],C=[apx+dxx,by];
  TRI(A,B,C,'rgba(55,138,221,.10)',BLUE_D,3);ANG(A,B,C,36,RED,'4x+10',14);ANG(B,C,A,40,GREEN,'x+10',14);ANG(C,A,B,40,GREEN,'x+10',14);
  TB('A',A[0],A[1]-10,INK,15);TB('B',B[0]-10,B[1]+16,INK,15);TB('C',C[0]+10,C[1]+16,INK,15);
  FA(sg(p,.1,.6),function(){TB('4x + 10 + 2(x + 10) = 180  ⇒  x = 25',W*.5,H*.96,DRED,Math.min(15,W*.031));TB('110°',A[0],A[1]+92,DRED,16);TB('35°',B[0]+48,B[1]-8,DGREEN,15);TB('35°',C[0]-48,C[1]-8,DGREEN,15);});
  FA(sg(p,.6,1),function(){TB('obtusangle',W*.86,H*.4,DRED,15);});}
]);
})();
