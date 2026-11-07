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
SFA.theo("c05", {
 icon: function () {
  var X=NL(-3,7,W*.08,W*.92,H*.62,1,GREY);RAY(X,H*.62,2,1,false,BLUE,7);
  TB('2x + 3 < 11',W*.5,H*.2,BLUE_D,Math.min(30,W*.066));TB('x < 4   ⇔   x ∈ ]−∞ ; 4[',W*.5,H*.4,ORANGE,Math.min(20,W*.044));
 },
 anim: function (t) {
  var T=t%600,x=-3+9*(T<500?T/500:1),v=2*x+3,ok=v<11,X=NL(-4,7,W*.07,W*.93,H*.36,1);
  RAY(X,H*.36,4,-1,false,'rgba(55,138,221,.45)',-4);
  DOT(X(x),H*.36,10,ok?GREEN:RED);TB('x = '+FR(Math.round(x*10)/10),X(x),H*.36-20,ok?DGREEN:DRED,16);
  TB('2x + 3 = '+FR(Math.round(v*10)/10)+(ok?'  <  11 : vrai':'  ≥  11 : faux'),W*.5,H*.12,ok?DGREEN:DRED,Math.min(22,W*.036));
  TB('2x + 3 < 11  ⇔  x < 4',W*.5,H*.54,BLUE_D,17);
  var ph=sg((t%600)/600,.1,.7),y1=H*.66,y2=H*.86;
  var Y=NL(-4,4,W*.2,W*.8,y1,1),Z=NL(-4,4,W*.2,W*.8,y2,1);
  [1,3].forEach(function(a){DOT(Y(a),y1,6,BLUE);var xx=Y(a)+(Z(-a)-Y(a))*ph,yy=y1+(y2-y1)*ph;DOT(xx,yy,7,ORANGE);});
  TB('1 < 3',W*.1,y1+5,BLUE_D,16);TB('−1 > −3',W*.1,y2+5,ORANGE,16);
  TB('× (−1) : l\'ordre s\'inverse',W*.5,(y1+y2)/2+6,DRED,15);
 },
 th: '<div class="tcard"><b class="h">Inégalités et intervalles</b><p>Une inéquation a pour solution tout un <b>ensemble</b> de nombres. On l\'écrit en inégalité, en intervalle ou sur la droite numérique :<br>x &lt; 4 ⇔ ]−∞ ; 4[ (cercle <b>ouvert</b> en 4) ; x ≥ −1 ⇔ [−1 ; +∞[ (cercle <b>fermé</b> en −1).<br>Le crochet est <b>tourné vers l\'extérieur</b> quand la borne est exclue, vers l\'intérieur quand elle est incluse ; ±∞ a toujours un crochet ouvert.</p></div>' +
  '<div class="tcard"><b class="h">Les règles</b><p>On peut <b>ajouter ou soustraire</b> un même nombre des deux côtés, ou <b>multiplier / diviser par un nombre positif</b> : le sens ne change pas. Mais si on <b>multiplie ou divise par un nombre négatif</b>, le sens de l\'inégalité <b>s\'inverse</b> : 1 &lt; 3 mais −1 &gt; −3.</p><p><i>Exemple :</i> −3x + 5 &gt; 11 ⇒ −3x &gt; 6 ⇒ x &lt; −2 (on divise par −3 : on retourne le signe).</p></div>' +
  '<div class="tcard"><b class="h">Méthode et contrôle</b><p>Résous comme une équation (développer, regrouper, diviser) en surveillant le signe du dernier coefficient. Puis <b>teste</b> un nombre de chaque côté de la borne dans l\'inéquation de départ.</p><p><i>Exemple :</i> 4 − x &lt; 1 ⇒ −x &lt; −3 ⇒ x &gt; 3, soit ]3 ; +∞[. Test : x = 5 donne 4 − 5 = −1 &lt; 1 ✓ ; x = 0 donne 4 &lt; 1 faux.</p></div>' +
  '<div class="tcard"><b class="h">Problèmes de seuil et deux conditions</b><p>« Au plus » = ≤, « au moins » = ≥, « strictement moins » = &lt;. Quand la solution doit être un entier (nombre de personnes, de caisses), on prend la valeur entière qui convient : 25n ≤ 320 donne n ≤ 12,8, donc au plus 12 caisses.</p><p>Si deux conditions doivent être vraies en même temps, la solution est l\'<b>intersection</b> des deux intervalles : x ≤ 7 <b>et</b> x ≥ 4 donne [4 ; 7].</p></div>'
});
SFA.figs("c05", [
 /* 0 */
 function (p) {
  var X=NL(-2,8,W*.08,W*.92,H*.62,1);TB('2x + 3 < 11',W/2,H*.2,BLUE_D,Math.min(32,W*.07));
  FA(sg(p,.1,.4),function(){TB('2x < 8   ⇒   x < 4',W/2,H*.38,DGREEN,Math.min(22,W*.048));});
  if(p===0)TB('?',W*.5,H*.5,GREY,24);
  FA(sg(p,.4,1),function(){RAY(X,H*.62,4,-1,false,BLUE,-2);TB(']−∞ ; 4[',W/2,H*.88,RED,22);});
 },
 /* 1 */
 function (p) {
  var X=NL(-4,6,W*.3,W*.95,H*.3,1),Y=NL(-4,6,W*.3,W*.95,H*.72,1);
  RAY(X,H*.3,-1,1,true,GREEN,6);RAY(Y,H*.72,3,-1,true,ORANGE,-4);
  TB('x ≥ −1',W*.14,H*.3+6,DGREEN,20);TB(']−∞ ; 3]',W*.14,H*.72+6,ORA2,20);
  FA(sg(p,.2,.6),function(){TB('[−1 ; +∞[',W*.14,H*.3+34,RED,19);});
  FA(sg(p,.5,.9),function(){TB('x ≤ 3',W*.14,H*.72+34,RED,19);});
 },
 /* 2 */
 function (p) {
  var cx=W/2,fs=Math.min(30,W*.065),X=NL(-6,2,W*.12,W*.88,H*.8,1);
  TB('−3x + 5 > 11',cx,H*.12,BLUE_D,fs);
  FA(sg(p,0,.3),function(){TB('−3x > 6',cx,H*.3,INK,fs);});
  FA(sg(p,.3,.6),function(){TB('÷ (−3) : le sens change !',cx,H*.4,DRED,17);var f=sg(p,.35,.55);TB((f<.5?'x > ':'x < ')+'−2',cx,H*.56,RED,fs+4);});
  FA(sg(p,.6,1),function(){RAY(X,H*.8,-2,-1,false,BLUE,-6);TB(']−∞ ; −2[',cx,H*.68,DGREEN,18);});
 },
 /* 3 : −2x ≤ 8 */
 function (p) {
  var X=NL(-8,4,W*.07,W*.93,H*.6,1);TB('−2x ≤ 8',W/2,H*.14,BLUE_D,Math.min(30,W*.065));
  DOT(X(0),H*.6,6,INK);DOT(X(-6),H*.6,6,INK);
  TB('x = 0',X(0),H*.6-34,DGREEN,15);TB('0 ≤ 8',X(0),H*.6-16,DGREEN,15);TB('x = −6',X(-6),H*.6-34,DRED,15);TB('12 ≤ 8 ?',X(-6),H*.6-16,DRED,15);
  FA(sg(p,.2,.7),function(){RAY(X,H*.6,-4,1,true,BLUE,4);TB('✓',X(0),H*.6+48,GREEN,24);TB('✗',X(-6),H*.6+48,RED,24);TB('÷ (−2) : x ≥ −4',W/2,H*.9,RED,22);});
 },
 /* 4 : graphe 3(x−1) ≥ 5x+7 */
 function (p) {
  var g=GR(-9,3,-40,20,W*.1,W*.92,H*.08,H*.88,2,10);
  FP(g,function(x){return 3*(x-1);},-9,3,BLUE,3.5);FP(g,function(x){return 5*x+7;},-9,3,GREEN,3.5);
  tag('y = 3(x − 1)',g.X(-1.3),g.Y(-12),BLUE_D,15);tag('y = 5x + 7',g.X(-.4),g.Y(16),DGREEN,15);
  FA(sg(p,0,.6),function(){SG(g,-5,-18,-5,0,GREY,1.5,[5,4]);PT(g,-5,-18,RED,7,'x = −5',-6,24,16);LN(g.X(-9),g.Y(0),g.X(-5),g.Y(0),RED,7);DOT(g.X(-5),g.Y(0),7,RED);tag('x ≤ −5',g.X(-7),g.Y(-6),DRED,17);});
 },
 /* 5 : 4−x<1 */
 function (p) {
  var g=GR(-1,7,-3,6,W*.1,W*.92,H*.08,H*.88,1,1);
  FP(g,function(x){return 4-x;},-1,7,BLUE,3.5);SG(g,-1,1,7,1,GREEN,2.5,[6,4]);tag('y = 4 − x',g.X(.6),g.Y(4.8),BLUE_D,16);tag('y = 1',g.X(6.3),g.Y(1.7),DGREEN,16);
  PT(g,3,1,RED,7,'(3 ; 1)',-30,-16,15);
  FA(sg(p,.2,.8),function(){LN(g.X(3),g.Y(0),g.X(7),g.Y(0),RED,7);DOT(g.X(3),g.Y(0),7,'#fff');ctx.strokeStyle=RED;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(g.X(3),g.Y(0),7,0,7);ctx.stroke();tag('x > 3 : ]3 ; +∞[',g.X(5),g.Y(-1.4),DRED,17);});
 },
 /* 6 : budget */
 function (p) {
  var u=W*.84/50,x0=W*.08,y0=H*.34,h=H*.2,n=Math.floor(sg(p,.05,.75)*16+1e-9);
  RC(x0,y0,12*u,h,OL,ORANGE,2);TB('12 €',x0+6*u,y0+h/2+6,ORANGE,15);
  for(var k=0;k<16;k++){var xx=x0+(12+2.5*k)*u,ok=k<15;if(k<n){RC(xx,y0,2.5*u,h,ok?BL:RL,ok?BLUE:RED,1.5);}}
  LN(x0+50*u,y0-24,x0+50*u,y0+h+24,DRED,3);TB('50 €',x0+50*u,y0-30,DRED,16);
  TB('abonnement',x0+6*u,y0-12,ORANGE,14);TB('2,50 € par entrée',x0+31*u,y0+h+22,BLUE_D,15);
  TB('12 + 2,5 n ≤ 50',W/2,H*.12,BLUE_D,Math.min(28,W*.06));
  FA(sg(p,.7,1),function(){TB('n ≤ 15,2  ⇒  15 entrées',W/2,H*.82,RED,22);TB('16 entrées : 52 € > 50',W/2,H*.93,DRED,15);});
 },
 /* 7 : ascenseur */
 function (p) {
  var cw=W*.36,ch=H*.74,cx0=W*.08,cy0=H*.12,k;
  RC(cx0,cy0,cw,ch,'#f6f8fa',INK,3);LN(cx0+cw/2,cy0,cx0+cw/2,cy0-8,INK,3);
  for(k=0;k<4;k++)pers(cx0+cw*.12+k*cw*.2,cy0+ch-4,ch*.32,[BLUE,GREEN,VIOLET,ORA2][k],1,'');
  var n=Math.floor(sg(p,.05,.7)*13+1e-9),cs=Math.min(cw*.16,ch*.12);LN(cx0+cw*.05,cy0+ch*.6+2,cx0+cw*.95,cy0+ch*.6+2,GREY,3);
  for(k=0;k<13;k++){if(k>=n)break;var r=Math.floor(k/5),c=k%5,ok=k<12;RC(cx0+cw*.08+c*(cs+4),cy0+ch*.6-r*(cs+4)-cs,cs,cs,ok?OL:RL,ok?ORANGE:RED,2);}
  var rx=W*.58;TB('4 × 70 + 25 n ≤ 600',rx+W*.17,H*.2,BLUE_D,Math.min(20,W*.045));
  TB('280 + 25 n ≤ 600',rx+W*.17,H*.34,INK,17);TB('25 n ≤ 320',rx+W*.17,H*.46,INK,17);
  FA(sg(p,.6,1),function(){TB('n ≤ 12,8',rx+W*.17,H*.6,DGREEN,19);TB('12 caisses : 580 kg ✓',rx+W*.17,H*.76,RED,19);TB('13 caisses : 605 kg ✗',rx+W*.17,H*.88,DRED,16);});
 },
 /* 8 : deux conditions */
 function (p) {
  var X=NL(0,10,W*.07,W*.93,H*.72,1);TB('x ≤ 7   et   x ≥ 4',W/2,H*.12,BLUE_D,Math.min(26,W*.058));
  RAY(X,H*.32,7,-1,true,'rgba(55,138,221,.7)',0);RAY(X,H*.5,4,1,true,'rgba(186,117,21,.7)',10);
  TB('P ≤ 36 : x ≤ 7',W*.07,H*.32-16,BLUE_D,15,'left');TB('x ≥ (x + 4) / 2 : x ≥ 4',W*.07,H*.5-16,ORANGE,15,'left');
  FA(sg(p,.3,.9),function(){SEGI(X,H*.72,4,7,true,true,GREEN,8);[4,5,6,7].forEach(function(v){DOT(X(v),H*.72,5,DGREEN);});TB('[4 ; 7]  →  4, 5, 6, 7',W/2,H*.93,RED,20);});
 },
 /* 9 : droites et inéquations */
 function (p) {
  var g=GR(-1,5,-3,7,W*.1,W*.92,H*.08,H*.86,1,1);
  FP(g,function(x){return 2*x-1;},-1,5,BLUE,3.5);FP(g,function(x){return -x+5;},-1,5,GREEN,3.5);
  tag('f(x) = 2x − 1',g.X(3.6),g.Y(6.1),BLUE_D,15);tag('g(x) = −x + 5',g.X(.2),g.Y(5.9),DGREEN,15);
  FA(sg(p,0,.4),function(){PT(g,2,3,RED,7,'(2 ; 3)',34,-12,16);SG(g,2,0,2,3,GREY,1.5,[5,4]);});
  FA(sg(p,.4,1),function(){LN(g.X(.5),g.Y(0),g.X(2),g.Y(0),RED,8);DOT(g.X(.5),g.Y(0),7,RED);DOT(g.X(2),g.Y(0),7,'#fff');ctx.strokeStyle=RED;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(g.X(2),g.Y(0),7,0,7);ctx.stroke();tag('[0,5 ; 2[',g.X(1.25),g.Y(-1.2),DRED,17);});
 }
]);
})();
