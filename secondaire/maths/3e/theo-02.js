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
SFA.theo("c02", {
 icon: function () {
  var g=GR(-1,4,-1,4,W*.08,W*.4,H*.14,H*.78,1,1);
  FP(g,function(x){return .25*x*x+.4*x-.3;},-1,4,BLUE,3);
  TB('x ↦ f(x)',W*.7,H*.42,BLUE_D,Math.min(34,W*.075));
  TB('image · antécédent',W*.7,H*.6,ORANGE,Math.min(18,W*.04));
  TB('tableau · graphique · formule',W*.5,H*.93,GREY,15);
 },
 anim: function (t) {
  var ph=(t%420)/420,x=-1+5*(ph<.85?ph/.85:1),f=function(v){return 3*v-2;},y=f(x);
  var g=GR(-1,5,-4,14,W*.07,W*.5,H*.08,H*.9,1,4);
  FP(g,f,-1,5,BLUE,3);
  SG(g,x,0,x,y,ORANGE,2,[5,4]);SG(g,0,y,x,y,ORANGE,2,[5,4]);DOT(g.X(x),g.Y(y),7,RED);
  TB('x = '+FR(x),g.X(x),g.Y(0)+(y>0?30:-14),ORANGE,14);TB('y = '+FR(y),g.X(0)+8,g.Y(y)-8,ORANGE,14,'left');
  var mx=W*.6,mw=W*.34,my=H*.34,mh=H*.28;
  RC(mx,my,mw,mh,BL,BLUE,2.5);TB('f',mx+mw/2,my+mh*.42,BLUE_D,26);TB('× 3 puis − 2',mx+mw/2,my+mh*.8,BLUE_D,15);
  ARW(mx-W*.04,my+mh/2,mx,my+mh/2,GREY,2.5);ARW(mx+mw,my+mh/2,mx+mw+W*.03,my+mh/2,GREY,2.5);
  TB('x = '+FR(x),mx-W*.01,my-10,ORANGE,16);TB('f(x) = '+FR(y),mx+mw-6,my+mh+24,RED,16);
  TB('un seul y pour chaque x',mx+mw/2,H*.12,INK,16);TB('image de '+FR(x)+' : '+FR(y),mx+mw/2,H*.86,DGREEN,15);
 },
 th: '<div class="tcard"><b class="h">Qu\'est-ce qu\'une fonction ?</b><p>Une fonction f associe à chaque nombre x <b>une seule</b> valeur f(x), appelée son <b>image</b>. On note x ↦ f(x). Un même x ne peut jamais avoir deux images différentes ; en revanche, deux x différents peuvent avoir la même image.</p><p>Sur un graphique, une droite verticale coupe la courbe en <b>au plus un</b> point.</p></div>' +
  '<div class="tcard"><b class="h">Trois façons de la décrire</b><p><b>Formule</b> : f(x) = 3x − 2. <b>Tableau</b> : une liste de couples (x ; y). <b>Graphique</b> : les points (x ; f(x)) dans un repère. On passe de l\'une à l\'autre en calculant des images (formule → tableau → points).</p><p><i>Exemple :</i> pour f(x) = 3x − 2, f(0) = −2, f(1) = 1, f(2) = 4 : les points (0 ; −2), (1 ; 1), (2 ; 4) sont sur le graphique.</p></div>' +
  '<div class="tcard"><b class="h">Image et antécédent</b><p><b>Image</b> de 4 : on remplace x par 4 : f(4) = 3 × 4 − 2 = 10. <b>Antécédent</b> de 7 : on cherche x tel que f(x) = 7, donc on résout 3x − 2 = 7, d\'où x = 3.</p><p>Si le point (3 ; −1) est sur la courbe, alors f(3) = −1 : 3 est l\'antécédent, −1 est l\'image. <b>Piège :</b> ne pas inverser abscisse et ordonnée. Un nombre peut avoir 0, 1 ou plusieurs antécédents.</p></div>' +
  '<div class="tcard"><b class="h">Valeurs interdites et évolution</b><p>On ne peut pas diviser par 0 : pour f(x) = 12/(x − 2), le nombre 2 n\'a pas d\'image. Pour décrire un graphique, on dit où la fonction <b>croît</b>, <b>décroît</b> ou reste <b>constante</b> (palier horizontal).</p><p><i>Méthode :</i> pour un problème, nomme la variable, écris la formule, puis lis le graphique ou résous l\'équation selon la question (image → on calcule ; antécédent → on résout).</p></div>'
});
SFA.figs("c02", [
 /* 0 */
 function (p) {
  var g=GR(-1,5,-4,14,W*.1,W*.92,H*.08,H*.9,1,2),f=function(x){return 3*x-2;};
  FP(g,f,-1,5,BLUE,3);tag('f(x) = 3x − 2',g.X(1.2),g.Y(11),BLUE_D,16);
  FA(sg(p,0,.4),function(){SG(g,4,0,4,10,ORANGE,2,[5,4]);SG(g,0,10,4,10,ORANGE,2,[5,4]);PT(g,4,10,RED,6,'f(4) = 10',-38,-14,15);});
  FA(sg(p,.4,.8),function(){SG(g,0,7,3,7,GREEN,2,[5,4]);SG(g,3,7,3,0,GREEN,2,[5,4]);PT(g,3,7,DGREEN,6,'',0,0);tag('antécédent : 3',g.X(3)+4,g.Y(0)-14,DGREEN,15);});
 },
 /* 1 : tableau → formule */
 function (p) {
  var cw=W*.15,x0=W*.14,y0=H*.2,rh=H*.16,i,xs=[0,1,2,3],ys=[5,8,11,14];
  TB('x',x0-W*.06,y0+rh/2+6,BLUE_D,20);TB('y',x0-W*.06,y0+rh*1.5+6,DRED,20);
  for(i=0;i<4;i++){RC(x0+i*cw,y0,cw,rh,BL,BLUE,2);RC(x0+i*cw,y0+rh,cw,rh,RL,RED,2);TB(String(xs[i]),x0+i*cw+cw/2,y0+rh/2+7,BLUE_D,22);TB(String(ys[i]),x0+i*cw+cw/2,y0+rh*1.5+7,DRED,22);}
  FA(sg(p,0,.5),function(){for(i=0;i<3;i++){var a=x0+i*cw+cw/2,b=a+cw;ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a+10,y0-4);ctx.quadraticCurveTo((a+b)/2,y0-28,b-10,y0-4);ctx.stroke();TB('+1',(a+b)/2,y0-22,BLUE_D,15);
   ctx.strokeStyle=RED;ctx.beginPath();ctx.moveTo(a+10,y0+2*rh+4);ctx.quadraticCurveTo((a+b)/2,y0+2*rh+30,b-10,y0+2*rh+4);ctx.stroke();TB('+3',(a+b)/2,y0+2*rh+38,DRED,15);}});
  FA(sg(p,.5,.8),function(){TB('x = 0  →  y = 5',W*.5,H*.72,DGREEN,17);});
  FA(sg(p,.7,1),function(){TB('y = 3x + 5',W*.5,H*.9,RED,Math.min(32,W*.07));});
 },
 /* 2 : lire un point */
 function (p) {
  var g=GR(-3,6,-4,5,W*.1,W*.92,H*.08,H*.9,1,1);
  FP(g,function(x){return (x-1)*(x-1)/2-3;},-2.5,5.5,BLUE,3);tag('courbe de f',g.X(-1.6),g.Y(2.6),BLUE_D,15);
  SG(g,3,0,3,-1,GREY,1.5,[5,4]);SG(g,0,-1,3,-1,GREY,1.5,[5,4]);PT(g,3,-1,RED,6,'(3 ; −1)',44,-14,15);
  TB('3',g.X(3),g.Y(0)-8,ORANGE,15);TB('−1',g.X(0)-8,g.Y(-1)+5,ORANGE,15,'right');
  FA(sg(p,.1,.6),function(){tag('f(3) = −1',W*.76,H*.2,DRED,19);tag('3 : antécédent de −1',W*.76,H*.3,DGREEN,15);tag('−1 : image de 3',W*.76,H*.39,DRED,15);});
 },
 /* 3 : g(x)=x²−4 */
 function (p) {
  var g=GR(-4,4,-6,8,W*.1,W*.92,H*.08,H*.9,1,2),f=function(x){return x*x-4;};
  FP(g,f,-3.5,3.5,BLUE,3);tag('g(x) = x² − 4',g.X(2.3),g.Y(-4.6),BLUE_D,16);
  PT(g,0,-4,RED,5,'g(0) = −4',58,6,14);
  FA(sg(p,0,.4),function(){SG(g,-3.8,5,3.8,5,GREEN,2,[6,4]);PT(g,-3,5,DGREEN,6,'−3',-4,-14,15);PT(g,3,5,DGREEN,6,'3',4,-14,15);tag('y = 5 : deux antécédents',g.X(0),g.Y(6.6),DGREEN,15);});
  FA(sg(p,.4,.8),function(){SG(g,-3.8,-5,3.8,-5,RED,2,[6,4]);tag('y = −5 : aucun point',g.X(-1.6),g.Y(-5.4)+4,DRED,14);});
 },
 /* 4 : taxi */
 function (p) {
  var g=GR(0,16,0,32,W*.11,W*.92,H*.08,H*.86,2,8),f=function(d){return 3.2+1.8*d;};
  FP(g,f,0,16,BLUE,3);PT(g,0,3.2,ORANGE,5,'prise en charge 3,20 €',92,-12,13);
  tag('C(d) = 3,20 + 1,80 d',g.X(3.5),g.Y(23),BLUE_D,16);TB('d (km)',g.X(16),g.Y(0)+30,GREY,13,'right');TB('C (€)',g.X(0)+8,g.Y(32)-4,GREY,13,'left');
  FA(sg(p,0,.4),function(){SG(g,14,0,14,28.4,GREY,1.5,[5,4]);SG(g,0,28.4,14,28.4,GREY,1.5,[5,4]);PT(g,14,28.4,RED,6,'14 km → 28,40 €',-60,-16,15);});
  FA(sg(p,.4,.8),function(){SG(g,0,21.2,10,21.2,GREEN,1.5,[5,4]);SG(g,10,21.2,10,0,GREEN,1.5,[5,4]);PT(g,10,21.2,DGREEN,6,'21,20 € → 10 km',-76,16,15);});
 },
 /* 5 : pas une fonction */
 function (p) {
  var xs=[1,2,3],ys=[4,6,7,9],lx=W*.22,rx=W*.72,i;
  function yL(i){return H*.22+i*H*.27;}function yR(i){return H*.14+i*H*.22;}
  ctx.beginPath();ctx.ellipse(lx,H*.5,W*.1,H*.42,0,0,7);ctx.fillStyle=BL;ctx.fill();ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.ellipse(rx,H*.5,W*.1,H*.42,0,0,7);ctx.fillStyle=OL;ctx.fill();ctx.strokeStyle=ORANGE;ctx.stroke();
  TB('x',lx,H*.07,BLUE_D,16);TB('y',rx,H*.07,ORANGE,16);
  [[0,0],[1,1],[1,2],[2,3]].forEach(function(a,k){var bad=a[0]===1;var c=bad&&p>0?RED:GREY;ARW(lx+W*.04,yL(a[0]),rx-W*.05,yR(a[1]),c,bad&&p>0?3.2:2);});
  xs.forEach(function(v,i){DOT(lx,yL(i),4,BLUE);TB(String(v),lx-W*.04-4,yL(i)+6,BLUE_D,18,'right');});
  ys.forEach(function(v,i){DOT(rx,yR(i),4,ORANGE);TB(String(v),rx+W*.04+4,yR(i)+6,ORANGE,18,'left');});
  FA(sg(p,.1,.6),function(){TB('x = 2 a deux images : 6 et 7',W*.5,H*.95,DRED,17);TB('pas une fonction',W*.5,H*.07,DRED,18);});
 },
 /* 6 : cycliste */
 function (p) {
  var g=GR(0,80,0,12,W*.1,W*.93,H*.1,H*.82,15,2);
  TB('t (min)',g.X(80),g.Y(0)+30,GREY,13,'right');TB('distance (km)',g.X(0)+6,g.Y(12)-8,GREY,13,'left');
  var pts=[[0,0],[30,10],[45,10],[75,0]],cols=[BLUE,ORANGE,GREEN],lab=['aller : 10 km','arrêt 15 min','retour : 10 km'],q=sg(p,0,.8)*3;
  for(var i=0;i<3;i++){var f=cl(q-i);if(f<=0)continue;var a=pts[i],b=pts[i+1];SG(g,a[0],a[1],a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,cols[i],4);}
  if(q>1)tag(lab[0],g.X(14),g.Y(7)-8,DGREEN==cols[0]?BLUE_D:BLUE_D,14);
  if(q>2)tag(lab[1],g.X(37.5),g.Y(10)-16,ORANGE,14);
  if(q>2.7)tag(lab[2],g.X(63),g.Y(6),DGREEN,14);
  FA(sg(p,.8,1),function(){SG(g,45,10,60,0,GREY,2,[5,4]);tag('trop rapide',g.X(54),g.Y(2.4),GREY,13);PT(g,75,0,RED,6,'75 min',0,-16,14);});
  if(p===0){tag('10 km en 30 min, arrêt 15 min,',W*.62,H*.28,INK,15);tag('retour à la même vitesse',W*.62,H*.37,INK,15);}
 },
 /* 7 : 12/(x−2) */
 function (p) {
  var g=GR(-2,8,-6,12,W*.1,W*.92,H*.08,H*.88,2,3),f=function(x){return 12/(x-2);};
  ctx.save();ctx.beginPath();ctx.rect(g.X(-2),g.Y(12),g.X(8)-g.X(-2),g.Y(-6)-g.Y(12));ctx.clip();FP(g,f,-2,1.99,BLUE,3);FP(g,f,2.01,8,BLUE,3);ctx.restore();
  SG(g,2,-6,2,12,RED,2,[6,4]);tag('x = 2 interdit',g.X(2)+6,g.Y(-4),DRED,15);tag('f(x) = 12/(x − 2)',g.X(6),g.Y(10),BLUE_D,16);
  FA(sg(p,0,.4),function(){SG(g,0,4,5,4,GREY,1.5,[5,4]);SG(g,5,4,5,0,GREY,1.5,[5,4]);PT(g,5,4,RED,6,'f(5) = 4',8,-14,15);});
  FA(sg(p,.4,.7),function(){SG(g,0,3,6,3,GREEN,1.5,[5,4]);PT(g,6,3,DGREEN,6,'antécédent de 3 : 6',10,14,15);});
  FA(sg(p,.7,1),function(){tag('y = 0 jamais atteint',g.X(5.5),g.Y(0)-22,DRED,14);});
 },
 /* 8 : jardin */
 function (p) {
  var g=GR(0,20,0,110,W*.1,W*.93,H*.08,H*.86,5,25),f=function(x){return x*(20-x);};
  FP(g,f,0,20,BLUE,3);tag('A(x) = x(20 − x)',g.X(14.5),g.Y(100),BLUE_D,16);TB('x (m)',g.X(20),g.Y(0)+30,GREY,13,'right');TB('A (m²)',g.X(0)+8,g.Y(110)-6,GREY,13,'left');
  FA(sg(p,0,.4),function(){SG(g,0,75,20,75,GREEN,1.5,[6,4]);PT(g,5,75,DGREEN,6,'x = 5',-8,-16,15);PT(g,15,75,DGREEN,6,'x = 15',8,-16,15);});
  FA(sg(p,.4,.8),function(){PT(g,10,100,RED,6,'A(10) = 100',0,-18,15);SG(g,10,0,10,100,RED,1.5,[5,4]);});
 },
 /* 9 : affine ou non */
 function (p) {
  var g=GR(0,8,0,30,W*.1,W*.92,H*.08,H*.88,1,5),f=function(x){return 3*x+4;};
  FA(sg(p,0,.5),function(){FP(g,f,0,8,BLUE,2.5);tag('y = 3x + 4',g.X(1.2),g.Y(24),BLUE_D,16);});
  [[1,7],[3,13],[5,19]].forEach(function(q){DOT(g.X(q[0]),g.Y(q[1]),7,p>0?GREEN:BLUE);});
  DOT(g.X(7),g.Y(26),7,p>0?RED:ORANGE);
  TB('(1 ; 7)',g.X(1)+8,g.Y(7)+22,INK,13,'left');TB('(3 ; 13)',g.X(3)+8,g.Y(13)+22,INK,13,'left');TB('(5 ; 19)',g.X(5)+8,g.Y(19)+22,INK,13,'left');TB('(7 ; 26)',g.X(7)-10,g.Y(26)-10,INK,13,'right');
  FA(sg(p,.4,.9),function(){SG(g,7,25,7,26,RED,3);tag('25 ≠ 26',g.X(7)-48,g.Y(24),DRED,15);tag('taux constant : 3',g.X(5.8),g.Y(10),DGREEN,15);});
 }
]);
})();
