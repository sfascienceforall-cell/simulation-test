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
/* balance : cx,cy centre du fléau, w demi-longueur, tilt en pixels (côté gauche plus bas si >0) */
function bal(cx,cy,w,tilt){
 var pw=Math.min(84,w*.7),lx=cx-w,ly=cy+tilt,rx=cx+w,ry=cy-tilt;
 pivotTri(cx,cy+2);LN(lx,ly,rx,ry,INK,5);DOT(cx,cy,6,INK);
 [[lx,ly],[rx,ry]].forEach(function(q){LN(q[0],q[1],q[0]-pw,q[1]+66,'#c9cdd2',1.4);LN(q[0],q[1],q[0]+pw,q[1]+66,'#c9cdd2',1.4);
  ctx.fillStyle='#e9edf1';ctx.strokeStyle=GREY;ctx.lineWidth=1.8;ctx.beginPath();ctx.roundRect(q[0]-pw,q[1]+66,2*pw,9,4);ctx.fill();ctx.stroke();});
 return {lx:lx,ly:ly+66,rx:rx,ry:ry+66,pw:pw};}
function frc(n,d,x,y,col,s){TB(n,x,y-s*.22,col,s);LN(x-s*.9,y-s*.1+2,x+s*.9,y-s*.1+2,col,2);TB(d,x,y+s*.9,col,s);}
SFA.theo("c04", {
 icon: function () {
  var b=bal(W*.5,H*.4,W*.26,0);
  RC(b.lx-34,b.ly-38,68,38,BL,BLUE,2);TB('3x + 7',b.lx,b.ly-14,BLUE_D,17);RC(b.rx-34,b.ry-38,68,38,OL,ORANGE,2);TB('22',b.rx,b.ry-14,ORANGE,18);
  TB('3x + 7 = 22',W*.5,H*.2,BLUE_D,Math.min(30,W*.066));TB('x = 5',W*.5,H*.92,RED,26);
 },
 anim: function (t) {
  var T=t%720,ph=T<150?0:T<300?1:T<450?2:3,fr=(T%150)/150;
  var cx=W*.5,cy=H*.4,w=W*.28,bb=bal(cx,cy,w,0),X=32,U=14;
  function xbox(x,y,a){FA(a,function(){RC(x,y-X,X,X,BL,BLUE,2.5);TB('x',x+X/2,y-X/2+7,BLUE_D,19);});}
  function ubox(x,y,a){FA(a,function(){RC(x,y-U,U,U,OL,ORANGE,1.8);});}
  var gone1=ph===0?0:ph===1?sg(fr,.2,.7):1,gone2=ph<2?0:ph===2?sg(fr,.2,.7):1,k,
   sl=bb.lx-bb.pw+4,sr=bb.rx-bb.pw+4,yb=bb.ly-1;
  xbox(sl,yb,1);xbox(sl+X+4,yb,1-gone1);
  for(k=0;k<3;k++)ubox(sl+2*X+14+k*(U+3),yb,1-gone2);
  xbox(sr,yb,1-gone1);
  for(k=0;k<7;k++)ubox(sr+X+8+k*(U+3),yb,k<3?1-gone2:1);
  var eq=ph===0?'2x + 3 = x + 7':ph===1?'x + 3 = 7':'x = 4';
  TB(eq,cx,H*.1,BLUE_D,Math.min(32,W*.06));
  var op=ph===0?'La balance est en \u00e9quilibre':ph===1?'On retire un x des deux c\u00f4t\u00e9s':ph===2?'On retire 3 unit\u00e9s des deux c\u00f4t\u00e9s':'x vaut 4 : contr\u00f4le 2\u00d74 + 3 = 4 + 7 = 11';
  TB(op,cx,H*.9,ph===3?DGREEN:ORANGE,17);
 },
 th: '<div class="tcard"><b class="h">Une équation est une balance</b><p>Résoudre une équation, c\'est trouver la valeur de x qui rend l\'égalité vraie. La balance reste en équilibre si on fait <b>la même opération des deux côtés</b> : ajouter, soustraire, multiplier ou diviser par un nombre <b>non nul</b>.</p></div>' +
  '<div class="tcard"><b class="h">Méthode en quatre temps</b><p>1) Développe et réduis chaque membre (attention au signe − devant une parenthèse). 2) Regroupe les x d\'un côté et les nombres de l\'autre en <b>ajoutant ou soustrayant</b> des deux côtés. 3) Divise par le coefficient de x. 4) <b>Vérifie</b> en remplaçant x dans l\'équation de départ.</p><p><i>Exemple :</i> 5x − 3 = 2x + 9 ⇒ 3x = 12 ⇒ x = 4. Contrôle : 5 × 4 − 3 = 17 et 2 × 4 + 9 = 17 ✓.</p></div>' +
  '<div class="tcard"><b class="h">Fractions, cas particuliers</b><p>Avec des fractions, on multiplie les deux membres par un dénominateur commun : (x + 4)/2 + (x − 1)/3 = 5, × 6 : 3(x + 4) + 2(x − 1) = 30, donc x = 4. Si on arrive à <b>0x = nombre non nul</b> (par ex. 1 = 4), l\'équation est <b>impossible</b> : aucune solution (droites parallèles). Si on arrive à <b>0 = 0</b>, elle est vraie pour <b>tout</b> x.</p></div>' +
  '<div class="tcard"><b class="h">Mettre un problème en équation</b><p>1) Choisis l\'inconnue et écris-la (« soit x l\'âge du fils »). 2) Traduis l\'énoncé par une équation. 3) Résous. 4) Vérifie avec l\'énoncé et réponds par une phrase avec l\'unité.</p><p><i>Exemple :</i> un père a 40 ans, son fils 12. Dans x ans : 40 + x = 3(12 + x), donc 4 = 2x et x = 2. Dans 2 ans : 42 ans et 14 ans, 42 = 3 × 14 ✓.</p><p><b>Piège :</b> quand un terme change de membre, il change de signe : 2x − 3 = 7 donne 2x = 7 + 3, pas 7 − 3.</p></div>'
});
SFA.figs("c04", [
 /* 0 : 3x+7=22 */
 function (p) {
  var cx=W*.5,cy=H*.34,b=bal(cx,cy,W*.26,0),w=W*.26;
  RC(b.lx-38,b.ly-40,76,40,BL,BLUE,2);TB('3x + 7',b.lx,b.ly-14,BLUE_D,19);RC(b.rx-38,b.ry-40,76,40,OL,ORANGE,2);TB('22',b.rx,b.ry-14,ORANGE,20);
  TB('3x + 7 = 22',cx,H*.1,BLUE_D,Math.min(28,W*.06));
  FA(sg(p,.1,.4),function(){TB('− 7 des deux côtés :  3x = 15',cx,H*.78,DGREEN,18);});
  FA(sg(p,.4,.7),function(){TB('÷ 3 des deux côtés :  x = 5',cx,H*.89,RED,22);});
  FA(sg(p,.75,1),function(){TB('3×5 + 7 = 22 ✓',cx,H*.65,DGREEN,16);});
 },
 /* 1 : 5x−3=2x+9 */
 function (p) {
  var cx=W*.5,cy=H*.34,b=bal(cx,cy,W*.26,0);
  RC(b.lx-40,b.ly-40,80,40,BL,BLUE,2);TB('5x − 3',b.lx,b.ly-14,BLUE_D,19);RC(b.rx-40,b.ry-40,80,40,GL,GREEN,2);TB('2x + 9',b.rx,b.ry-14,DGREEN,19);
  TB('5x − 3 = 2x + 9',cx,H*.1,BLUE_D,Math.min(28,W*.06));
  FA(sg(p,.1,.35),function(){TB('− 2x :  3x − 3 = 9',cx,H*.7,DGREEN,18);});
  FA(sg(p,.35,.6),function(){TB('+ 3 :  3x = 12',cx,H*.8,DGREEN,18);});
  FA(sg(p,.6,.85),function(){TB('x = 4',cx,H*.92,RED,26);});
 },
 /* 2 : 2(x−3)=4x+10 */
 function (p) {
  var g=GR(-12,2,-30,14,W*.1,W*.92,H*.08,H*.9,2,10);
  FP(g,function(x){return 2*x-6;},-12,2,BLUE,3.5);FP(g,function(x){return 4*x+10;},-12,2,GREEN,3.5);
  tag('y = 2(x − 3)',g.X(-3),g.Y(-14),BLUE_D,15);tag('y = 4x + 10',g.X(-10),g.Y(-24),DGREEN,15);
  FA(sg(p,0,.6),function(){SG(g,-8,-22,-8,0,GREY,1.5,[5,4]);PT(g,-8,-22,RED,7,'x = −8',50,10,18);});
 },
 /* 3 : signe moins */
 function (p) {
  var fs=Math.min(28,W*.06);ctx.font='600 '+fs+'px system-ui';
  var parts=[['3(x + 2)',BLUE_D],[' − ',DRED],['(x − 4)',DRED],[' = 18',INK]],ws=parts.map(function(q){return ctx.measureText(q[0]).width;}),tot=ws.reduce(function(a,b){return a+b;},0),x=W/2-tot/2;
  parts.forEach(function(q,i){ctx.font='600 '+fs+'px system-ui';ctx.fillStyle=q[1];ctx.textAlign='left';ctx.fillText(q[0],x,H*.2);x+=ws[i];});
  TB('le − change les deux signes : −x et +4',W/2,H*.31,DRED,15);
  FA(sg(p,.05,.3),function(){TB('3x + 6 − x + 4 = 18',W/2,H*.5,INK,fs);});
  FA(sg(p,.3,.55),function(){TB('2x + 10 = 18',W/2,H*.66,DGREEN,fs);});
  FA(sg(p,.55,.8),function(){TB('x = 4',W/2,H*.82,RED,fs+4);});
  FA(sg(p,.8,1),function(){TB('contrôle : 3 × 6 − 0 = 18 ✓',W/2,H*.95,DGREEN,15);});
 },
 /* 4 : fractions */
 function (p) {
  var s=Math.min(24,W*.05),y=H*.3,cx=W/2;
  frc('x + 4','2',cx-W*.24,y,BLUE_D,s);TB('+',cx-W*.1,y+s*.2,INK,s);frc('x − 1','3',cx+W*.04,y,DGREEN,s);TB('= 5',cx+W*.2,y+s*.2,INK,s);
  FA(sg(p,0,.3),function(){TB('× 6 des deux côtés (dénominateur commun)',cx,H*.55,ORANGE,16);});
  FA(sg(p,.3,.6),function(){TB('3(x + 4) + 2(x − 1) = 30',cx,H*.68,INK,s);});
  FA(sg(p,.6,.8),function(){TB('5x + 10 = 30  ⇒  5x = 20',cx,H*.8,DGREEN,s*.9);});
  FA(sg(p,.8,1),function(){TB('x = 4',cx,H*.94,RED,s+6);});
 },
 /* 5 : âges */
 function (p) {
  var d=2*sg(p,0,.6),x0=Math.max(W*.1,74),u=Math.min((W-x0-24)/44,9),y1=H*.28,hh=H*.14,k;
  TB(d<.05?'Aujourd\'hui':d>1.95?'Dans 2 ans':'Dans '+FR(Math.round(d*10)/10)+' an'+(d>=2?'s':''),W/2,H*.1,ORANGE,18);
  TB('père',x0-8,y1+hh/2+6,BLUE_D,16,'right');RC(x0,y1,(40+d)*u,hh,BL,BLUE,2.5);TB(String(Math.round(40+d)),x0+(40+d)*u/2,y1+hh/2+7,BLUE_D,20);
  TB('fils × 3',x0-8,H*.58+hh/2+6,DGREEN,16,'right');
  for(k=0;k<3;k++){RC(x0+k*(12+d)*u,H*.58,(12+d)*u,hh,GL,GREEN,2.5);TB(String(Math.round(12+d)),x0+k*(12+d)*u+(12+d)*u/2,H*.58+hh/2+7,DGREEN,18);}
  var gap=(40+d)-3*(12+d);
  if(gap>.05){RC(x0+3*(12+d)*u,H*.58,gap*u,hh,null,RED,2);TB('manque '+FR(Math.round(gap*10)/10),x0+3*(12+d)*u+gap*u/2,H*.58+hh+20,DRED,15);}
  FA(sg(p,.6,1),function(){TB('40 + x = 3(12 + x)  ⇒  x = 2',W/2,H*.93,RED,20);TB('42 = 3 × 14',W*.8,H*.46,DGREEN,16);});
 },
 /* 6 : erreur */
 function (p) {
  var fs=Math.min(26,W*.056),cx=W/2;
  TB('2x − 3 = 7',cx,H*.14,BLUE_D,fs+2);
  RC(W*.08,H*.24,W*.84,H*.2,RL,RED,2);TB('« 2x = 7 − 3 = 4, donc x = 2 »',cx,H*.34,DRED,fs*.8);TB('le −3 a changé de côté sans changer de signe',cx,H*.41,DRED,14);
  TB('✗',W*.88,H*.35,RED,28);
  FA(sg(p,.1,.5),function(){RC(W*.08,H*.52,W*.84,H*.2,GL,GREEN,2);TB('+ 3 : 2x = 7 + 3 = 10',cx,H*.62,DGREEN,fs*.8);TB('x = 5',cx,H*.69,DGREEN,fs*.8);TB('✓',W*.88,H*.64,GREEN,28);});
  FA(sg(p,.6,1),function(){TB('x = 2 : 2×2 − 3 = 1 ≠ 7     x = 5 : 2×5 − 3 = 7 ✓',cx,H*.9,INK,15);});
 },
 /* 7 : impossible */
 function (p) {
  var g=GR(-3,3,-8,14,W*.1,W*.92,H*.08,H*.9,1,4);
  FP(g,function(x){return 3*x+1;},-3,3,BLUE,3.5);FP(g,function(x){return 3*x+4;},-3,3,ORANGE,3.5);
  tag('y = 3x + 1',g.X(1.7),g.Y(2.2),BLUE_D,16);tag('y = 3x + 4',g.X(-.9),g.Y(4.5),ORA2,16);
  FA(sg(p,0,.5),function(){LN(g.X(1),g.Y(4),g.X(1),g.Y(7),RED,3);tag('toujours 3 d\'écart',g.X(1)+66,g.Y(5.5),DRED,15);});
  FA(sg(p,.5,1),function(){tag('parallèles : aucun point commun',g.X(-.2),g.Y(-6),DRED,16);tag('1 = 4 est faux',g.X(-.2),g.Y(-3.8),DRED,15);});
 },
 /* 8 : rectangle */
 function (p) {
  var u=Math.min(W*.5/15,H*.5/10),x0=W*.1,y0=H*.2;
  RC(x0,y0,15*u,10*u,BL,BLUE,3);
  TB(p>.2?'x = 10':'x',x0+7.5*u,y0+10*u+20,p>.2?DGREEN:BLUE_D,18);TB(p>.2?'x + 5 = 15':'x + 5',x0+7.5*u,y0-10,p>.2?DGREEN:BLUE_D,18);
  FA(sg(p,0,.3),function(){});
  var rx=W*.78;TB('P = 50 cm',rx,H*.25,INK,17);TB('2x + 2(x + 5) = 50',rx,H*.38,INK,15);
  
  FA(sg(p,.2,.6),function(){TB('4x = 40',rx,H*.52,DGREEN,17);TB('x = 10',rx,H*.64,DGREEN,19);});
  FA(sg(p,.6,1),function(){TB('aire 150 cm²',x0+7.5*u,y0+5*u+8,RED,24);TB('10 × 15',rx,H*.82,RED,17);});
 },
 /* 9 : rattrapage */
 function (p) {
  var g=GR(0,3,0,50,W*.1,W*.92,H*.08,H*.86,.5,10);
  FP(g,function(t){return 15*t;},0,3,BLUE,3.5);FP(g,function(t){return 20*(t-.5);},.5,3,RED,3.5);
  tag('Lina : 15 km/h',g.X(2.45),g.Y(26),BLUE_D,15);tag('Tom : départ à 0,5 h',g.X(1.15),g.Y(25),DRED,15);TB('t (h)',g.X(3),g.Y(0)+30,GREY,13,'right');TB('d (km)',g.X(0)+8,g.Y(50)-6,GREY,13,'left');
  FA(sg(p,0,.6),function(){SG(g,2,0,2,30,GREY,1.5,[5,4]);SG(g,0,30,2,30,GREY,1.5,[5,4]);PT(g,2,30,DGREEN,8,'rattrapage : t = 2 h, d = 30 km',-92,-18,15);});
 },
 /* 10 : paramètre */
 function (p) {
  var g=GR(0,9,0,45,W*.1,W*.92,H*.08,H*.86,1,10);
  FP(g,function(x){return 3*x+8;},0,9,BLUE,3.5);FP(g,function(x){return 5*x-4;},.8,9,GREEN,3.5);
  tag('y = 3x + m',g.X(7.4),g.Y(26),BLUE_D,15);tag('y = 5x − 4',g.X(6.6),g.Y(41),DGREEN,15);
  FA(sg(p,0,.5),function(){SG(g,6,0,6,26,GREY,1.5,[5,4]);PT(g,6,26,RED,7,'x = 6',-6,-18,17);tag('m = 8',g.X(2.6),g.Y(24),DRED,17);});
  FA(sg(p,.5,1),function(){tag('2x + k = 2(x + 3) : k = 6 ⇒ droites confondues',W*.5,H*.95,DGREEN,14);});
 }
]);
})();
