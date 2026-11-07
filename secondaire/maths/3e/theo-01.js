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
SFA.theo("c01", {
 icon: function () {
  var s=Math.min(H*.5,W*.3),x0=W*.5-s/2-W*.2,y0=H*.14,a=s*.58;
  RC(x0,y0,a,a,BL,BLUE,2);RC(x0+a,y0,s-a,a,OL,ORANGE,2);RC(x0,y0+a,a,s-a,OL,ORANGE,2);RC(x0+a,y0+a,s-a,s-a,GL,GREEN,2);
  TB('a²',x0+a/2,y0+a/2+6,BLUE_D,20);TB('b²',x0+a+(s-a)/2,y0+a+(s-a)/2+5,DGREEN,15);
  TB('ab',x0+a+(s-a)/2,y0+a/2+5,ORANGE,15);TB('ab',x0+a/2,y0+a+(s-a)/2+5,ORANGE,15);
  TB('(a + b)²',W*.7,H*.4,BLUE_D,Math.min(34,W*.075));
  TB('= a² + 2ab + b²',W*.7,H*.58,ORANGE,Math.min(22,W*.05));
  TB('développer · factoriser',W*.5,H*.92,GREY,16);
 },
 anim: function (t) {
  var a=3,b=2+1.5*Math.sin(t/45),s=a+b,u=Math.min(H-70,W*.46)/6.5,x0=W*.07,y0=34;
  function R(x,y,w,h,f,c,tx,tc){RC(x0+x*u,y0+y*u,w*u,h*u,f,c,2);if(tx&&w*u>26&&h*u>20)TB(tx,x0+(x+w/2)*u,y0+(y+h/2)*u+5,tc,15);}
  R(0,0,a,a,BL,BLUE,'a²',BLUE_D);R(a,0,b,a,OL,ORANGE,'ab',ORANGE);R(0,a,a,b,OL,ORANGE,'ab',ORANGE);R(a,a,b,b,GL,GREEN,'b²',DGREEN);
  TB('a = 3',x0+a*u/2,y0-12,BLUE_D,15);TB('b = '+FR(b),x0+(a+b/2)*u,y0-12,DGREEN,15);
  LN(x0,y0-4,x0+s*u,y0-4,GREY,1);
  var rx=W*.58;
  TB('(a + b)² = a² + 2ab + b²',rx+W*.17,H*.2,BLUE_D,Math.min(22,W*.032));
  TB('(3 + '+FR(b)+')² = '+FR(s*s),rx+W*.17,H*.42,INK,17);
  TB('9 + '+FR(2*a*b)+' + '+FR(b*b)+' = '+FR(s*s),rx+W*.17,H*.54,INK,17);
  TB('a² + b² = '+FR(a*a+b*b)+'  (faux !)',rx+W*.17,H*.72,RED,17);
  TB('il manque 2ab = '+FR(2*a*b),rx+W*.17,H*.84,ORANGE,17);
 },
 th: '<div class="tcard"><b class="h">Priorités et signes</b><p>On calcule dans cet ordre : <b>parenthèses</b>, puis <b>puissances</b>, puis <b>× et ÷</b> (de gauche à droite), enfin <b>+ et −</b>. Un produit de deux nombres de même signe est positif, de signes différents il est négatif.</p><p><b>Piège :</b> −3² = −(3 × 3) = −9, alors que (−3)² = 9. De même (−2)³ = −8.</p><p><i>Exemple :</i> −3² + (−2)³ = −9 + (−8) = −17.</p></div>' +
  '<div class="tcard"><b class="h">Développer et réduire</b><p>Distributivité : k(a + b) = ka + kb et (a + b)(c + d) = ac + ad + bc + bd. Un signe − devant une parenthèse change <b>tous</b> les signes à l\'intérieur. On ne réduit que les termes <b>semblables</b> : 3x + 5x = 8x, mais x et x² ne s\'additionnent pas.</p><p><i>Exemple :</i> 3(2x − 1) − 2(x − 4) = 6x − 3 − 2x + 8 = 4x + 5.</p></div>' +
  '<div class="tcard"><b class="h">Les trois identités remarquables</b><p>(a + b)² = a² + 2ab + b²<br>(a − b)² = a² − 2ab + b²<br>(a + b)(a − b) = a² − b²</p><p><b>Piège :</b> (a + b)² ≠ a² + b² : il manque les deux rectangles ab (voir le schéma). Quand a est un produit, on met tout au carré : (2x − 3)² = 4x² − 12x + 9.</p></div>' +
  '<div class="tcard"><b class="h">Factoriser</b><p>C\'est l\'opération inverse de développer. Méthode : 1) cherche un <b>facteur commun</b> (6x² + 9x = 3x(2x + 3)) ; 2) reconnais une <b>différence de carrés</b> (x² − 49 = (x − 7)(x + 7)) ou un <b>carré parfait</b> (x² + 10x + 25 = (x + 5)²) ; 3) vérifie en redéveloppant.</p><p><i>Exemple :</i> 4x² − 36 = 4(x² − 9) = 4(x − 3)(x + 3).</p></div>' +
  '<div class="tcard"><b class="h">Valeur numérique</b><p>On remplace la lettre par le nombre <b>entre parenthèses</b>, puis on applique les priorités.</p><p><i>Exemple :</i> 2x² − 3x + 1 pour x = −2 : 2 × (−2)² − 3 × (−2) + 1 = 2 × 4 + 6 + 1 = 15.</p></div>'
});
SFA.figs("c01", [
 /* 0 : −3² + (−2)³ */
 function (p) {
  var fs=Math.min(38,W*.085),bw=W*.4,bh=H*.36,by=H*.4,lx=W*.05,rx=W*.55;
  TB('−3² + (−2)³',W/2,H*.24,BLUE_D,fs);
  RC(lx,by,bw,bh,BL,BLUE,2.5);RC(rx,by,bw,bh,GL,GREEN,2.5);TB('+',W/2,by+bh/2+10,INK,32);
  TB('−3²',lx+bw/2,by+26,BLUE_D,20);TB('(−2)³',rx+bw/2,by+26,DGREEN,20);
  FA(sg(p,.05,.3),function(){TB('= −(3 × 3)',lx+bw/2,by+bh*.55,BLUE_D,16);TB('= (−2)(−2)(−2)',rx+bw/2,by+bh*.55,DGREEN,15);});
  FA(sg(p,.3,.5),function(){TB('−9',lx+bw/2,by+bh*.88,BLUE_D,26);TB('−8',rx+bw/2,by+bh*.88,DGREEN,26);});
  if(p<.3){TB('?',lx+bw/2,by+bh*.7,GREY,26);TB('?',rx+bw/2,by+bh*.7,GREY,26);}
  FA(sg(p,.6,.85),function(){TB('= −9 + (−8) = −17',W/2,H*.94,RED,24);});
 },
 /* 1 : (x+4)² */
 function (p) {
  var S=Math.min(H-70,W*.5),x0=W*.07,y0=36,a=S*.6,b=S-a;
  TB('(x + 4)²',W*.77,H*.2,BLUE_D,Math.min(30,W*.07));
  RC(x0,y0,a,a,sg(p,0,.2)>0?BL:null,BLUE,2);RC(x0+a,y0,b,a,sg(p,.2,.4)>0?OL:null,ORANGE,2);RC(x0,y0+a,a,b,sg(p,.2,.4)>0?OL:null,ORANGE,2);RC(x0+a,y0+a,b,b,sg(p,.4,.6)>0?GL:null,GREEN,2);
  TB('x',x0+a/2,y0-10,BLUE_D,16);TB('4',x0+a+b/2,y0-10,DGREEN,16);TB('x',x0-12,y0+a/2+5,BLUE_D,16);TB('4',x0-12,y0+a+b/2+5,DGREEN,16);
  FA(sg(p,0,.2),function(){TB('x²',x0+a/2,y0+a/2+7,BLUE_D,22);});
  FA(sg(p,.2,.4),function(){TB('4x',x0+a+b/2,y0+a/2+6,ORANGE,17);TB('4x',x0+a/2,y0+a+b/2+6,ORANGE,17);});
  FA(sg(p,.4,.6),function(){TB('16',x0+a+b/2,y0+a+b/2+6,DGREEN,17);});
  FA(sg(p,.65,.9),function(){TB('x² + 8x + 16',W*.77,H*.5,RED,Math.min(22,W*.05));});
 },
 /* 2 : 3(2x−1) − 2(x−4) */
 function (p) {
  var fs=Math.min(30,W*.065);ctx.font='600 '+fs+'px system-ui';
  var parts=[['3',BLUE_D],['(2x − 1)',INK],[' − ',INK],['2',DRED],['(x − 4)',INK]],ws=parts.map(function(q){return ctx.measureText(q[0]).width;}),tot=ws.reduce(function(a,b){return a+b;},0),x=W/2-tot/2,y=H*.28,cx=[];
  parts.forEach(function(q,i){ctx.font='600 '+fs+'px system-ui';ctx.fillStyle=q[1];ctx.textAlign='left';ctx.fillText(q[0],x,y);cx.push(x+ws[i]/2);x+=ws[i];});
  function arc(x1,x2,c){var a=sg(p,0,.01)>=0?1:1;ctx.strokeStyle=c;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x1,y+8);ctx.quadraticCurveTo((x1+x2)/2,y+44,x2-8,y+10);ctx.stroke();}
  arc(cx[0],cx[1],BLUE);arc(cx[3],cx[4],RED);
  TB('× chaque terme',cx[1],y+52,BLUE_D,14);TB('× (−2) : les signes changent',cx[4],y+52,DRED,14);
  FA(sg(p,.1,.4),function(){TB('= 6x − 3  − 2x + 8',W/2,H*.62,INK,Math.min(26,W*.055));});
  FA(sg(p,.5,.8),function(){TB('= 4x + 5',W/2,H*.86,RED,Math.min(32,W*.07));});
 },
 /* 3 : (2x−3)² */
 function (p) {
  var S=Math.min(H-70,W*.5),x0=W*.08,y0=38,d=S*.26,m=S-d;
  RC(x0,y0,m,m,sg(p,0,.25)>0?BL:null,BLUE,2.5);
  RC(x0+m,y0,d,m,sg(p,.25,.5)>0?RL:null,RED,2);RC(x0,y0+m,m,d,sg(p,.25,.5)>0?RL:null,RED,2);RC(x0+m,y0+m,d,d,sg(p,.5,.7)>0?OL:null,ORANGE,2);
  ctx.setLineDash([6,4]);RC(x0,y0,S,S,null,GREY,1.5);ctx.setLineDash([]);
  TB('2x',x0+S/2,y0-12,INK,16);TB('3',x0+m+d/2,y0-12,DRED,16);TB('2x − 3',x0+m/2,y0+m/2+6,BLUE_D,18);
  FA(sg(p,0,.25),function(){});
  FA(sg(p,.25,.5),function(){TB('3',x0+m+d/2,y0+m/2,DRED,16);TB('3',x0+m/2,y0+m+d/2+5,DRED,16);});
  FA(sg(p,.5,.7),function(){TB('9',x0+m+d/2,y0+m+d/2+5,ORANGE,16);});
  var rx=W*.78;TB('(2x − 3)²',rx,H*.2,BLUE_D,22);
  FA(sg(p,.7,1),function(){TB('= 4x²',rx,H*.4,INK,19);TB('− 12x',rx,H*.52,DRED,19);TB('+ 9',rx,H*.64,ORANGE,19);});
 },
 /* 4 : factoriser 4x²−36 */
 function (p) {
  var fs=Math.min(30,W*.065),w=W*.62,x=W*.19;
  function row(y,txt,col,fill){RC(x,y,w,H*.17,fill,col,2);TB(txt,x+w/2,y+H*.17/2+fs*.35,col,fs);}
  row(H*.08,'4x² − 36',BLUE_D,BL);
  TB('facteur commun 4 ?',x+w+W*.01,H*.31,GREY,13,'right');
  FA(sg(p,.05,.3),function(){ARW(W/2,H*.26,W/2,H*.35,GREY,2);row(H*.37,'= 4(x² − 9)',DGREEN,GL);});
  FA(sg(p,.3,.6),function(){ARW(W/2,H*.55,W/2,H*.64,GREY,2);row(H*.66,'= 4(x − 3)(x + 3)',RED,RL);TB('x² − 3² = (x − 3)(x + 3)',W/2,H*.6,GREY,13);});
  FA(sg(p,.7,1),function(){TB('contrôle x = 5 : 4×25 − 36 = 64  et  4×2×8 = 64',W/2,H*.94,DGREEN,14);});
 },
 /* 5 : 2x²−3x+1 en x=−2 */
 function (p) {
  var g=GR(-3,4,-3,30,W*.1,W*.92,H*.12,H*.88,1,5),f=function(x){return 2*x*x-3*x+1;};
  FP(g,f,-3,4,BLUE,3);
  tag('f(x) = 2x² − 3x + 1',g.X(1.9),g.Y(26),BLUE_D,15);
  SG(g,-2,0,-2,15,GREY,1.5,[5,4]);TB('x = −2',g.X(-2),g.Y(0)-8,DRED,14);
  FA(sg(p,.1,.5),function(){SG(g,-3,15,-2,15,ORANGE,2,[5,4]);PT(g,-2,15,RED,6,'f(−2) = 15',46,-6,15);});
 },
 /* 6 : 1001² − 999² */
 function (p) {
  var S=Math.min(H-80,W*.4),x0=W*.07,y0=40,d=S*.1,m=S-d;
  RC(x0,y0,m,m,BL,BLUE,2);RC(x0+m,y0,d,m,OL,ORANGE,2);RC(x0,y0+m,m,d,OL,ORANGE,2);RC(x0+m,y0+m,d,d,OL,ORANGE,2);
  TB('999',x0+m/2,y0+m/2+6,BLUE_D,22);TB('1001',x0+S/2,y0-12,INK,16);
  TB('anneau de largeur 2',x0+S/2,y0+S+26,ORANGE,14);
  TB('1001² − 999²',W*.74,H*.15,BLUE_D,Math.min(24,W*.055));
  FA(sg(p,.1,.5),function(){var bx=W*.5,bw=W*.44,by=H*.43;RC(bx,by,bw,d,OL,ORANGE,2);TB('2000',bx+bw/2,by-8,INK,15);TB('2',bx-10,by+d/2+5,DRED,14);TB('anneau déroulé : 2 × 2000',bx+bw/2,by+d+22,ORANGE,15);});
  FA(sg(p,.6,.9),function(){TB('= (1001−999)(1001+999)',W*.74,H*.74,INK,15);TB('= 4000',W*.74,H*.9,RED,28);});
 },
 /* 7 : le tapis */
 function (p) {
  var u=Math.min(W*.5/17,(H-70)/12.8),x0=W*.07,yb=H-30;
  function X(v){return x0+v*u;}function Y(v){return yb-v*u;}
  RC(X(0),Y(12),12*u,12*u,BL,BLUE,2.5);
  RC(X(0),Y(7),17*u,7*u,null,ORANGE,3);
  FA(sg(p,.1,.4),function(){RC(X(0),Y(12),12*u,5*u,RL,RED,0);RC(X(12),Y(7),5*u,7*u,GL,GREEN,0);TB('− 60',X(6),Y(9.3),DRED,17);TB('+ 35',X(14.5),Y(3.3),DGREEN,17);});
  TB('x = 12',X(6),Y(3.5),BLUE_D,16);
  TB('x + 5',X(8.5),Y(-.0)+20,ORANGE,15);TB('x − 5',X(17)+20,Y(3.5)+5,ORANGE,15,'left');
  var rx=W*.8;TB('carré : x² = 144',rx,H*.2,BLUE_D,15);TB('rectangle : 17 × 7 = 119',rx,H*.32,ORANGE,15);
  FA(sg(p,.6,.9),function(){TB('144 − 119 = 25',rx,H*.55,RED,18);TB('(x²) − (x² − 25)',rx,H*.68,INK,14);});
 },
 /* 8 : x²+kx+16 carré parfait */
 function (p) {
  var g=GR(-7,.5,-3,21,W*.1,W*.92,H*.1,H*.88,1,5);
  ctx.save();ctx.beginPath();ctx.rect(g.X(-7),g.Y(21),g.X(.5)-g.X(-7),g.Y(-3)-g.Y(21));ctx.clip();
  ctx.setLineDash([6,5]);FP(g,function(x){return x*x+4*x+16;},-7,.5,GREY,2.5);ctx.setLineDash([]);
  FP(g,function(x){return x*x+8*x+16;},-7,.5,BLUE,3.5);ctx.restore();
  tag('k = 4 : ne touche pas l\'axe',g.X(-5.4),g.Y(19.5),GREY,13);tag('k = 8',g.X(-6),g.Y(5),BLUE_D,15);
  FA(sg(p,.1,.5),function(){PT(g,-4,0,RED,7,'(x + 4)² : un seul zéro',60,-24,14);tag('x² + 8x + 16',g.X(-1.4),g.Y(2),RED,14);});
 },
 /* 9 : carrés consécutifs */
 function (p) {
  var u=Math.min((H-60)/6,W*.4/6),x0=W*.07,y0=34,n=5,i,cnt=Math.floor(sg(p,0,.7)*11+1e-9);
  for(i=0;i<5;i++)for(var j=0;j<5;j++)RC(x0+i*u,y0+(j+1)*u,u,u,BL,'#fff',1.5);
  RC(x0,y0+u,5*u,5*u,null,BLUE,2.5);
  var cells=[];for(i=0;i<6;i++)cells.push([i,0]);for(j=1;j<6;j++)cells.push([5,j]);
  cells.forEach(function(c,k){if(k<cnt){RC(x0+c[0]*u,y0+c[1]*u,u,u,'rgba(186,117,21,.45)','#fff',1.5);TB(String(k+1),x0+c[0]*u+u/2,y0+c[1]*u+u/2+5,'#7a4b08',14);}});
  ctx.setLineDash([6,4]);RC(x0,y0,6*u,6*u,null,GREY,1.5);ctx.setLineDash([]);
  TB('n²',x0+2.5*u,y0+3.5*u+7,BLUE_D,24);TB('n + 1',x0+3*u,y0-10,INK,15);
  var rx=W*.76;TB('(n+1)² − n²',rx,H*.22,BLUE_D,22);TB('n = 5 : 36 − 25',rx,H*.4,INK,17);
  FA(sg(p,.7,1),function(){TB('= 11 = 2n + 1',rx,H*.6,RED,20);TB('2026² − 2025² = 4051',rx,H*.78,DGREEN,15);});
 },
 /* 10 : regroupement */
 function (p) {
  var u=Math.min((W-110)/15.5,(H-90)/6.2),x0=W*.05,y0=H*.3;
  PG([[x0,y0],[x0+3*u,y0],[x0+3*u,y0+3*u],[x0+6*u,y0+3*u],[x0+6*u,y0+6*u],[x0,y0+6*u]],BL,BLUE,2.5);
  RC(x0+3*u,y0,3*u,3*u,null,RED,2);ctx.setLineDash([5,4]);ctx.strokeStyle=RED;ctx.strokeRect(x0+3*u,y0,3*u,3*u);ctx.setLineDash([]);
  TB('9',x0+4.5*u,y0+1.5*u+6,DRED,18);TB('(x − y)² = 36',x0+2.5*u,y0+4.5*u,BLUE_D,15);
  TB('x² − 2xy + y² − 9',W*.5,H*.1,INK,Math.min(24,W*.055));TB('x − y = 6',x0+3*u,y0+6*u+22,INK,15);
  FA(sg(p,.1,.6),function(){var rx=x0+6*u+W*.07;RC(rx,y0,9*u*sg(p,.1,.5),3*u,GL,GREEN,2.5);TB('9 = 6 + 3',rx+4.5*u,y0-10,DGREEN,15);TB('3 \u00d7 9 = 27',rx+4.5*u,y0+1.5*u+6,DGREEN,20);TB('hauteur 3 = 6 \u2212 3',rx+4.5*u,y0+3*u+20,DGREEN,14);});
  FA(sg(p,.6,1),function(){TB('(x\u2212y\u22123)(x\u2212y+3) = 3 \u00d7 9',W*.66,y0+5.3*u,RED,16);});
 }
]);
})();
