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
function slopeTri(g,x1,y1,x2,y2,col,l1,l2){var c=g.X(x2),r=g.Y(y1);LN(g.X(x1),g.Y(y1),c,r,col,2.5,[5,4]);LN(c,r,g.X(x2),g.Y(y2),col,2.5,[5,4]);
 if(l1)tag(l1,(g.X(x1)+c)/2,r+(y2<y1?-14:18),col,15);if(l2)tag(l2,g.X(x2)+(x2>x1?30:-30),(r+g.Y(y2))/2,col,15);}
SFA.theo("c03", {
 icon: function () {
  var g=GR(-2,4,-2,5,W*.06,W*.46,H*.1,H*.84,1,1);
  FP(g,function(x){return x+1;},-2,4,BLUE,3);SG(g,-2,.2,4,2.6,ORANGE,2.5,[6,4]);
  TB('y = ax + b',W*.74,H*.42,BLUE_D,Math.min(34,W*.075));TB('pente · ordonnée à l\'origine',W*.74,H*.6,ORANGE,Math.min(16,W*.036));
 },
 anim: function (t) {
  var ph=t%720,a,b,m;
  if(ph<360){m=0;a=2.4*Math.sin(ph/360*2*PI);b=1;}else{m=1;a=1;b=1.8*Math.sin((ph-360)/360*2*PI);}
  var g=GR(-4,4,-4,5,W*.06,W*.5,H*.06,H*.92,1,1),f=function(x){return a*x+b;};
  ctx.save();ctx.beginPath();ctx.rect(g.X(-4),g.Y(5),g.X(4)-g.X(-4),g.Y(-4)-g.Y(5));ctx.clip();FP(g,f,-4,4,BLUE,3.5);ctx.restore();
  DOT(g.X(0),g.Y(b),7,RED);
  if(Math.abs(a)>.15){LN(g.X(1),g.Y(b),g.X(1),g.Y(a+b),ORANGE,2.5);LN(g.X(0),g.Y(b),g.X(1),g.Y(b),ORANGE,2.5,[4,3]);}
  var rx=W*.78;TB('y = ax + b',rx,H*.14,BLUE_D,24);
  TB('a = '+FR(Math.round(a*10)/10),rx,H*.36,m?GREY:ORANGE,m?18:24);TB('b = '+FR(Math.round(b*10)/10),rx,H*.52,m?RED:GREY,m?24:18);
  TB(m?'b : la droite glisse':'a : la droite pivote',rx,H*.72,m?DRED:ORA2,16);
  TB(m?'(le point rouge monte et descend)':'(autour du point (0 ; 1))',rx,H*.82,GREY,14);
  TB(a>.15?'croissante':a<-.15?'décroissante':'constante',rx,H*.92,DGREEN,16);
 },
 th: '<div class="tcard"><b class="h">La fonction affine f(x) = ax + b</b><p><b>a</b> est la <b>pente</b> (le coefficient de x), <b>b</b> est l\'<b>ordonnée à l\'origine</b> (la valeur de y quand x = 0). Si b = 0, la fonction est <b>linéaire</b> : f(x) = ax, la droite passe par l\'origine. Le graphique est toujours une <b>droite</b>.</p></div>' +
  '<div class="tcard"><b class="h">Lire la pente</b><p>a = (variation de y) ÷ (variation de x). Si a &gt; 0 la droite monte (fonction <b>croissante</b>), si a &lt; 0 elle descend (<b>décroissante</b>), si a = 0 elle est horizontale (<b>constante</b>). La droite coupe l\'axe des x au <b>zéro</b> de la fonction : ax + b = 0, donc x = −b/a.</p><p><i>Exemple :</i> f(x) = 4x − 12 s\'annule pour x = 3 : la droite coupe les axes en (3 ; 0) et (0 ; −12).</p></div>' +
  '<div class="tcard"><b class="h">Équation d\'une droite par deux points</b><p>1) a = (y<sub>B</sub> − y<sub>A</sub>) ÷ (x<sub>B</sub> − x<sub>A</sub>). 2) On remplace x et y par les coordonnées d\'un des points pour trouver b. 3) On vérifie avec l\'autre point.</p><p><i>Exemple :</i> A(1 ; 3) et B(4 ; −3) : a = (−3 − 3) ÷ (4 − 1) = −2 ; 3 = −2 × 1 + b donne b = 5, donc y = −2x + 5. Contrôle : −2 × 4 + 5 = −3 ✓.</p></div>' +
  '<div class="tcard"><b class="h">Parallèles et comparaison de tarifs</b><p>Deux droites sont <b>parallèles</b> si elles ont la <b>même pente</b> (et des ordonnées à l\'origine différentes). Pour comparer deux tarifs, on écrit les deux fonctions, on cherche le point où elles sont égales (intersection), puis on regarde quelle droite est en dessous.</p><p><b>Piège :</b> « à partir de » : si l\'égalité a lieu pour n = 6, le tarif B est strictement plus avantageux à partir de n = 7.</p></div>'
});
SFA.figs("c03", [
 /* 0 : −2x+5 */
 function (p) {
  var g=GR(-1,4,-3,8,W*.1,W*.92,H*.08,H*.9,1,1),f=function(x){return -2*x+5;};
  FP(g,f,-1,4,BLUE,3.5);tag('f(x) = −2x + 5',g.X(2.7),g.Y(6.8),BLUE_D,17);
  FA(sg(p,0,.4),function(){PT(g,0,5,RED,6,'b = 5',-34,-14,15);});
  FA(sg(p,.3,.7),function(){slopeTri(g,0,5,1,3,ORANGE,'+1','−2');tag('a = −2 : décroissante',g.X(2.2),g.Y(-1.8),ORA2,15);});
  FA(sg(p,.7,1),function(){SG(g,3,0,3,-1,GREY,1.5,[5,4]);PT(g,3,-1,DRED,6,'f(3) = −1',-6,-18,15);});
 },
 /* 1 : par (0;1) et (2;5) */
 function (p) {
  var g=GR(-1,4,-1,8,W*.1,W*.92,H*.08,H*.9,1,1);
  PT(g,0,1,BLUE,7,'(0 ; 1)',-32,16,15);PT(g,2,5,BLUE,7,'(2 ; 5)',-36,-8,15);
  FA(sg(p,0,.3),function(){FP(g,function(x){return 2*x+1;},-1,4,BLUE,3);PT(g,0,1,BLUE,7);PT(g,2,5,BLUE,7);});
  FA(sg(p,.3,.7),function(){slopeTri(g,0,1,2,5,ORANGE,'Δx = 2','Δy = 4');});
  FA(sg(p,.7,1),function(){tag('a = 4 ÷ 2 = 2   b = 1',g.X(2.6),g.Y(2),DGREEN,16);tag('y = 2x + 1',g.X(3),g.Y(7.2),RED,19);});
 },
 /* 2 : pente A(1;3) B(4;−3) */
 function (p) {
  var g=GR(-1,6,-5,6,W*.1,W*.92,H*.08,H*.9,1,1);
  SG(g,1,3,4,-3,BLUE,3);PT(g,1,3,BLUE_D,7,'A(1 ; 3)',-38,-12,15);PT(g,4,-3,BLUE_D,7,'B(4 ; −3)',48,10,15);
  FA(sg(p,0,.5),function(){slopeTri(g,1,3,4,-3,ORANGE,'Δx = 3','Δy = −6');});
  FA(sg(p,.5,1),function(){tag('a = −6 ÷ 3 = −2',g.X(1.2),g.Y(-3.2),RED,19);});
 },
 /* 3 : zéro 4x−12 */
 function (p) {
  var g=GR(-2,6,-14,6,W*.1,W*.92,H*.08,H*.9,1,2),f=function(x){return 4*x-12;};
  FP(g,f,-.5,4.5,BLUE,3.5);tag('f(x) = 4x − 12',g.X(4.4),g.Y(-3),BLUE_D,16);
  FA(sg(p,0,.45),function(){PT(g,3,0,RED,7,'(3 ; 0)',22,-16,16);tag('4x − 12 = 0 ⇒ x = 3',g.X(-.3),g.Y(4),DRED,15);});
  FA(sg(p,.45,.9),function(){PT(g,0,-12,DGREEN,7,'(0 ; −12)',50,0,16);});
 },
 /* 4 : par A(−1;4) et B(3;−4) */
 function (p) {
  var g=GR(-3,5,-6,7,W*.1,W*.92,H*.08,H*.9,1,1);
  PT(g,-1,4,BLUE_D,7,'A(−1 ; 4)',-44,-6,15);PT(g,3,-4,BLUE_D,7,'B(3 ; −4)',44,12,15);SG(g,-1,4,3,-4,BLUE,3);
  FA(sg(p,0,.4),function(){slopeTri(g,-1,4,3,-4,ORANGE,'Δx = 4','Δy = −8');});
  FA(sg(p,.4,.8),function(){PT(g,0,2,RED,6,'b = 2',26,-12,15);tag('a = −8 ÷ 4 = −2',g.X(-1.8),g.Y(-2),DRED,16);});
  FA(sg(p,.8,1),function(){tag('y = −2x + 2',g.X(-1.5),g.Y(6),RED,19);});
 },
 /* 5 : parallèle */
 function (p) {
  var g=GR(-2,4,-6,10,W*.1,W*.92,H*.08,H*.9,1,2);
  FP(g,function(x){return 3*x-1;},-2,3.6,GREY,3);tag('y = 3x − 1',g.X(3.1),g.Y(6.5),GREY,16);PT(g,1,5,ORANGE,7,'(1 ; 5)',-34,-6,16);
  FA(sg(p,0,.5),function(){FP(g,function(x){return 3*x+2;},-2,2.6,RED,3.5);tag('y = 3x + 2',g.X(-.9),g.Y(-1),DRED,17);PT(g,1,5,ORANGE,7);});
  FA(sg(p,.4,.8),function(){slopeTri(g,0,2,1,5,ORANGE,'1','3');tag('même pente 3, b = 2',g.X(2.6),g.Y(1.2),ORA2,15);});
 },
 /* 6 : salles de sport */
 function (p) {
  var g=GR(0,12,0,150,W*.1,W*.92,H*.08,H*.86,2,25);
  FP(g,function(n){return 12*n;},0,12,BLUE,3.5);FP(g,function(n){return 45+4.5*n;},0,12,GREEN,3.5);
  tag('A : 12 n',g.X(9.2),g.Y(128),BLUE_D,16);tag('B : 45 + 4,5 n',g.X(10.2),g.Y(78),DGREEN,16);TB('n (séances)',g.X(12),g.Y(0)+30,GREY,13,'right');TB('coût (€)',g.X(0)+8,g.Y(150)-6,GREY,13,'left');
  FA(sg(p,0,.5),function(){SG(g,6,0,6,72,GREY,1.5,[5,4]);PT(g,6,72,RED,7,'n = 6 : 72 €',-8,-18,16);});
  FA(sg(p,.5,1),function(){ctx.fillStyle='rgba(29,158,117,.10)';ctx.fillRect(g.X(6),g.Y(150),g.X(12)-g.X(6),g.Y(0)-g.Y(150));tag('B moins chère dès n = 7',g.X(8.9),g.Y(30),DGREEN,15);});
 },
 /* 7 : Celsius / Fahrenheit */
 function (p) {
  var g=GR(-60,20,-80,70,W*.1,W*.92,H*.08,H*.88,20,20);
  FP(g,function(x){return x;},-60,20,GREY,2.5);FP(g,function(x){return 1.8*x+32;},-60,20,BLUE,3.5);
  tag('F = C',g.X(-12),g.Y(-34),GREY,15);tag('F = 1,8 C + 32',g.X(-30),g.Y(20),BLUE_D,16);TB('C (°C)',g.X(20),g.Y(0)+30,GREY,13,'right');TB('F (°F)',g.X(0)+8,g.Y(70)-6,GREY,13,'left');
  FA(sg(p,0,.6),function(){SG(g,-40,0,-40,-40,GREY,1.5,[5,4]);SG(g,0,-40,-40,-40,GREY,1.5,[5,4]);PT(g,-40,-40,RED,7,'(−40 ; −40)',2,34,17);});
 },
 /* 8 : ressort */
 function (p) {
  var g=GR(0,800,0,32,W*.1,W*.92,H*.08,H*.86,200,8),f=function(m){return .02*m+15;};
  FA(sg(p,0,.5),function(){FP(g,f,0,600,BLUE,3.5);ctx.setLineDash([6,4]);FP(g,f,600,750,RED,3);ctx.setLineDash([]);tag('l = 0,02 m + 15',g.X(200),g.Y(26),BLUE_D,16);});
  PT(g,100,17,BLUE_D,7,'(100 ; 17)',10,-16,14);PT(g,300,21,BLUE_D,7,'(300 ; 21)',10,-16,14);
  SG(g,600,0,600,32,GREY,1.5,[5,4]);tag('600 g : limite',g.X(600)-4,g.Y(3.2),GREY,14);TB('m (g)',g.X(800),g.Y(0)+30,GREY,13,'right');TB('l (cm)',g.X(0)+8,g.Y(32)-6,GREY,13,'left');
  FA(sg(p,.5,.8),function(){PT(g,0,15,GREEN,6,'à vide : 15 cm',72,-12,15);});
  FA(sg(p,.8,1),function(){PT(g,750,30,RED,7,'30 cm → 750 g (hors domaine)',-92,-14,14);});
 },
 /* 9 : droite et axes */
 function (p) {
  var g=GR(-1,6,-2,8,W*.1,W*.92,H*.08,H*.9,1,1);
  FA(sg(p,.2,.7),function(){PG([[g.X(0),g.Y(0)],[g.X(4),g.Y(0)],[g.X(0),g.Y(6)]],'rgba(55,138,221,.2)',null);TB('aire = 4 × 6 ÷ 2 = 12',g.X(.15),g.Y(.9),BLUE_D,16,'left');});
  FP(g,function(x){return -1.5*x+6;},-.5,5,BLUE,3.5);
  PT(g,0,6,BLUE_D,7,'A(0 ; 6)',44,-4,15);PT(g,4,0,BLUE_D,7,'B(4 ; 0)',8,-16,15);
  DOT(g.X(2),g.Y(3),7,p>.3?GREEN:ORANGE);TB('C',g.X(2)+14,g.Y(3)-8,INK,15);DOT(g.X(5),g.Y(-2),7,p>.3?RED:ORANGE);TB('D',g.X(5)+14,g.Y(-2)-8,INK,15);
  FA(sg(p,0,.4),function(){tag('y = −1,5x + 6',g.X(4.2),g.Y(5.6),RED,17);tag('C : −3 + 6 = 3 ✓',g.X(3.6),g.Y(3.2),DGREEN,14);tag('D : y devrait valoir −1,5',g.X(2.9),g.Y(-1.1),DRED,14);});
 }
]);
})();
