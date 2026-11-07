/* Maths 4e · chapitre 6 : cercle trigonométrique et radians */
function m4_uc(cx,cy,R,lab){var U={cx:cx,cy:cy,R:R,P:function(a,k){k=k==null?1:k;return {x:cx+R*k*Math.cos(a),y:cy-R*k*Math.sin(a)};}};
 ctx.strokeStyle='#eceef1';ctx.lineWidth=1;
 LN(cx-R*1.25,cy,cx+R*1.35,cy,AX,1.6);LN(cx,cy+R*1.25,cx,cy-R*1.3,AX,1.6);
 ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
 if(lab!==false){ctx.font='12px system-ui';ctx.fillStyle=GREY;ctx.textAlign='center';ctx.fillText('1',cx+R+8,cy+15);ctx.fillText('−1',cx-R-9,cy+15);ctx.fillText('1',cx+9,cy-R-4);ctx.fillText('−1',cx+13,cy+R+14);}
 return U;}
function m4_arc(U,r,a0,a1,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||3;ctx.beginPath();ctx.arc(U.cx,U.cy,r,-a0,-a1,a1>a0);ctx.stroke();}
function m4_rad(U,a,col,w,k){var P=U.P(a,k);LN(U.cx,U.cy,P.x,P.y,col||INK,w||2);return P;}
SFA.theo("c06", {
 icon: function () {
  var R=Math.min(H*.36,W*.2),U=m4_uc(W*.3,H*.52,R,false),a=Math.PI/3,P=U.P(a);
  m4_arc(U,R*.3,0,a,ORANGE,3);m4_arc(U,R,0,a,RED,5);m4_rad(U,a,BLUE,2.4);
  LN(P.x,P.y,P.x,U.cy,VIOLET,3);LN(U.cx,U.cy,P.x,U.cy,ORANGE,3);DOT(P.x,P.y,6,BLUE_D);
  TB('θ',U.cx+R*.42,U.cy-R*.12,ORANGE,18);
  TB('cos θ , sin θ',W*.72,H*.32,BLUE_D,26);TB('π rad = 180°',W*.72,H*.54,ORANGE,24);TB('sin² + cos² = 1',W*.72,H*.76,DRED,22);
 },
 anim: function (t) {
  var R=Math.min(H*.3,W*.17),cx=R+44,cy=H*.6,U=m4_uc(cx,cy,R),th=(t/75)%(2*Math.PI);
  var P=U.P(th);
  m4_arc(U,R*.28,0,th,ORANGE,2.5);m4_arc(U,R,0,th,RED,5);
  LN(U.cx,U.cy,P.x,P.y,BLUE,2.6);
  LN(P.x,P.y,P.x,U.cy,VIOLET,3.4);LN(U.cx,U.cy,P.x,U.cy,ORANGE,3.4);
  DOT(P.x,P.y,7,BLUE_D);
  var gx=cx+R*1.5+30,gw=W-gx-16,sx=gw/(2*Math.PI);
  LN(gx,cy,gx+gw,cy,AX,1.5);LN(gx,cy-R*1.1,gx,cy+R*1.1,AX,1.5);
  [Math.PI,2*Math.PI].forEach(function(v,i){LN(gx+v*sx,cy-4,gx+v*sx,cy+4,GREY,1.4);TB(i?'2π':'π',gx+v*sx,cy+18,GREY,13);});
  TB('sin θ',gx+gw,cy-R*1.1,VIOLET,13,'right');
  ctx.strokeStyle=VIOLET;ctx.lineWidth=3;ctx.beginPath();for(var a=0;a<=th;a+=.04){var yy=cy-R*Math.sin(a);a?ctx.lineTo(gx+a*sx,yy):ctx.moveTo(gx,yy);}ctx.stroke();
  var gp=gx+th*sx;LN(P.x,P.y,gp,P.y,'#b9bdc4',1.4,[4,4]);DOT(gp,P.y,6,VIOLET);
  var deg=th*180/Math.PI,r2=function(v){return m4_n(Math.round(v*100)/100);};
  TB('θ = '+r2(th)+' rad = '+Math.round(deg)+'°',gx,22,RED,15,'left');
  TB('cos θ = '+r2(Math.cos(th)),gx,44,ORANGE,15,'left');TB('sin θ = '+r2(Math.sin(th)),gx+gw*.5,44,VIO_D,15,'left');
  TB('longueur de l\'arc = θ (rayon 1)',cx,H-14,RED,13);
 },
 th: '<div class="tcard"><b class="h">Degrés et radians</b><p>Un angle de 1 radian intercepte sur le cercle de rayon 1 un arc de longueur 1. Un tour complet : 360° = 2π rad, donc <b>π rad = 180°</b>.</p><p>α(rad) = α(°) × π/180 et α(°) = α(rad) × 180/π. Exemples : 135° = 3π/4 rad ; 5π/6 rad = 150° ; 60° = π/3.</p><p><b>Longueur d\'un arc</b> : ℓ = θ·r (θ en radians). Pour r = 6 cm et 150° = 5π/6 : ℓ = 5π cm ≈ 15,7 cm.</p></div>'+
 '<div class="tcard"><b class="h">Cosinus, sinus, tangente</b><p>Sur le cercle de rayon 1, le point M associé à l\'angle θ a pour coordonnées <b>(cos θ ; sin θ)</b>. Donc −1 ≤ cos θ ≤ 1, −1 ≤ sin θ ≤ 1 et <b>cos² θ + sin² θ = 1</b>. On pose tan θ = sin θ / cos θ (cos θ ≠ 0) ; c\'est l\'ordonnée du point où la droite OM coupe la tangente x = 1. Cos et sin sont périodiques de période 2π ; tan, de période π.</p></div>'+
 '<div class="tcard"><b class="h">Valeurs remarquables</b><table><tr><td>θ</td><td>0</td><td>π/6</td><td>π/4</td><td>π/3</td><td>π/2</td></tr><tr><td>cos θ</td><td>1</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>0</td></tr><tr><td>sin θ</td><td>0</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>1</td></tr><tr><td>tan θ</td><td>0</td><td>√3/3</td><td>1</td><td>√3</td><td>—</td></tr></table><p>Pour les autres quadrants, on utilise les angles associés et le signe de chaque quadrant.</p></div>'+
 '<div class="tcard"><b class="h">Angles associés</b><p>cos(−x) = cos x ; sin(−x) = −sin x<br>cos(π − x) = −cos x ; <b>sin(π − x) = sin x</b><br>cos(π + x) = −cos x ; sin(π + x) = −sin x<br>cos(π/2 − x) = sin x ; sin(π/2 − x) = cos x</p><p>Exemples : cos(2π/3) = −cos(π/3) = −1/2 ; sin(7π/6) = −sin(π/6) = −1/2 ; tan(3π/4) = −1.</p></div>'+
 '<div class="tcard"><b class="h">Équations trigonométriques</b><p><b>sin x = a</b> (|a| ≤ 1) : si α est une solution, l\'autre est π − α ; sur [0 ; 2π[ il y a deux solutions (ex. sin x = 1/2 : x = π/6 ou 5π/6). <b>cos x = a</b> : α et −α. <b>tan x = a</b> : α + kπ.</p><p>On se ramène parfois au second degré : 2 sin² x − sin x − 1 = 0 avec s = sin x : s = 1 ou s = −1/2, donc x = π/2, 7π/6, 11π/6.</p><p><b>Pièges</b> : calculatrice en degrés au lieu de radians ; oublier la seconde solution ; signe selon le quadrant.</p></div>'
});
SFA.figs("c06", [
 function (p) { /* 0 degrés radians */
  var R=Math.min(H*.3,W*.2),U=m4_uc(W*.5,H*.58,R,false);
  var a=135*Math.PI/180,b=150*Math.PI/180;
  m4_arc(U,R*.45,0,a,ORANGE,3);m4_arc(U,R*.6,0,b,VIOLET,3);
  var P=m4_rad(U,a,ORANGE,2.6),Q=m4_rad(U,b,VIOLET,2.6);DOT(P.x,P.y,6,ORANGE);DOT(Q.x,Q.y,6,VIOLET);
  tag('135°',U.P(a,1.3).x-6,U.P(a,1.3).y-10,ORANGE,16);tag('5π/6',U.P(b,1.3).x-24,U.P(b,1.3).y+8,VIO_D,16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('= 3π/4',U.P(a,1.3).x-6,U.P(a,1.3).y-32,ORANGE,16);tag('= 150°',U.P(b,1.3).x-24,U.P(b,1.3).y+30,VIO_D,16);
   TB('π rad = 180°',W*.5,H*.95,DRED,17);ctx.globalAlpha=1;}
 },
 function (p) { /* 1 60° */
  var R=Math.min(H*.4,W*.2),U=m4_uc(W*.3,H*.54,R,false),a=Math.PI/3;
  m4_arc(U,R*.3,0,a,ORANGE,3);var P=m4_rad(U,a,BLUE,2.8);DOT(P.x,P.y,6,BLUE_D);
  TB('60°',U.cx+R*.52,U.cy-R*.12,ORANGE,17);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_arc(U,R,0,a,RED,5);LN(P.x,P.y,P.x,U.cy,VIOLET,2.6,[4,3]);
   TB('60° = π/3 rad',W*.74,H*.34,RED,22);TB('= 180°/3',W*.74,H*.48,GREY,16);TB('longueur d\'arc π/3 ≈ 1,05',W*.74,H*.62,DRED,14);ctx.globalAlpha=1;}
  else TB('60° = ? rad',W*.74,H*.4,GREY,22);
 },
 function (p) { /* 2 valeurs remarquables */
  var R=Math.min(H*.36,W*.2),U=m4_uc(W*.3,H*.52,R,false);
  LN(U.cx+R,U.cy-R*1.3,U.cx+R,U.cy+R*1.3,'#c5c9cf',1.6);TB('tan',U.cx+R+16,U.cy-R*1.2,GREY,13);
  var a=2*Math.PI/3,b=7*Math.PI/6,c=3*Math.PI/4;
  var A=m4_rad(U,a,BLUE),B=m4_rad(U,b,RED),C=m4_rad(U,c,GREEN);
  DOT(A.x,A.y,6,BLUE);DOT(B.x,B.y,6,RED);DOT(C.x,C.y,6,GREEN);
  TB('2π/3',A.x-8,A.y-10,BLUE_D,14,'right');TB('7π/6',B.x-8,B.y+18,DRED,14,'right');TB('3π/4',C.x-10,C.y+22,DGREEN,14,'right');
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);
   LN(A.x,A.y,A.x,U.cy,BLUE,3);tag('cos = −1/2',A.x-4,U.cy+22,BLUE_D,14);
   LN(B.x,B.y,U.cx,B.y,RED,3);tag('sin = −1/2',U.cx+R*.5,B.y+16,DRED,14);
   var T={x:U.cx+R,y:U.cy-R*Math.tan(c)};var ex=U.P(c,1.5);LN(C.x,C.y,T.x,T.y,GREEN,2,[5,4]);DOT(T.x,T.y,6,GREEN);tag('tan = −1',T.x+34,T.y,DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 longueur d'arc */
  var r=Math.min(H*.55,W*.3),cx=W*.33,cy=H*.8,a=150*Math.PI/180,a0=(180-150)/2*Math.PI/180+Math.PI*0;
  var s0=Math.PI/2-a/2,s1=Math.PI/2+a/2;
  ctx.fillStyle='rgba(55,138,221,.13)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r*.9,-s0,-s1,true);ctx.closePath();ctx.fill();
  var rr=r*.9;LN(cx,cy,cx+rr*Math.cos(s0),cy-rr*Math.sin(s0),INK,2.6);LN(cx,cy,cx+rr*Math.cos(s1),cy-rr*Math.sin(s1),INK,2.6);
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,rr,-s0,-s1,true);ctx.stroke();
  ctx.strokeStyle=ORANGE;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(cx,cy,rr*.28,-s0,-s1,true);ctx.stroke();
  TB('150°',cx,cy-rr*.35,ORANGE,16);TB('r = 6 cm',cx+rr*.45,cy-rr*.12,INK,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,rr,-s0,-s1,true);ctx.stroke();
   TB('ℓ = θ · r',W*.74,H*.28,DRED,22);TB('= 5π/6 × 6',W*.74,H*.44,INK,18);TB('= 5π cm',W*.74,H*.6,DRED,22);TB('≈ 15,7 cm',W*.74,H*.78,DRED,22);ctx.globalAlpha=1;}
 },
 function (p) { /* 4 sin = 1/2 */
  var R=Math.min(H*.4,W*.2),U=m4_uc(W*.3,H*.54,R,false);
  LN(U.cx-R*1.3,U.cy-R/2,U.cx+R*1.3,U.cy-R/2,ORANGE,2.4,[6,4]);tag('y = 1/2',U.cx,U.cy-R/2,ORANGE,14);
  if(p>0){var a=m4_ap(p,0,1);ctx.globalAlpha=a;
   var A=m4_rad(U,Math.PI/6,BLUE),B=m4_rad(U,5*Math.PI/6,RED);DOT(A.x,A.y,7,BLUE);DOT(B.x,B.y,7,RED);
   m4_arc(U,R*.3,0,Math.PI/6,BLUE,3);tag('π/6',A.x+34,A.y-4,BLUE_D,16);tag('5π/6',B.x-38,B.y-4,DRED,16);
   TB('sin x = 1/2',W*.74,H*.4,INK,17);TB('x = π/6 ou 5π/6',W*.74,H*.56,DRED,17);ctx.globalAlpha=1;}
  else TB('sin x = 1/2',W*.74,H*.5,GREY,18);
 },
 function (p) { /* 5 cos=3/5 */
  var R=Math.min(H*.36,W*.2),U=m4_uc(W*.3,H*.5,R,false),a=-Math.asin(.8);
  LN(U.cx+R,U.cy-R*1.5,U.cx+R,U.cy+R*1.5,'#c5c9cf',1.6);
  var P=m4_rad(U,a,BLUE,2.8);DOT(P.x,P.y,7,BLUE_D);
  LN(P.x,P.y,P.x,U.cy,ORANGE,3);tag('cos x = 3/5',P.x+2,U.cy-14,ORANGE,14);
  TB('x ∈ ]3π/2 ; 2π[',W*.74,H*.22,INK,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(U.cx,U.cy,U.cx,P.y,VIOLET,3);LN(U.cx,P.y,P.x,P.y,'#b9bdc4',1.4,[4,3]);tag('sin x = −4/5',U.cx-62,(U.cy+P.y)/2,VIO_D,14);
   var T={x:U.cx+R,y:U.cy-R*Math.tan(a)};LN(U.cx,U.cy,T.x,T.y,GREEN,1.8,[5,4]);DOT(T.x,T.y,6,GREEN);tag('tan x = −4/3',T.x+14,T.y+22,DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 angles associés */
  var R=Math.min(H*.4,W*.2),U=m4_uc(W*.3,H*.56,R,false),x=40*Math.PI/180;
  var M=U.P(x),N=U.P(Math.PI-x),Q=U.P(Math.PI/2-x);
  LN(N.x,M.y,M.x,M.y,'#b9bdc4',1.4,[4,3]);
  m4_rad(U,x,BLUE,2.4);DOT(M.x,M.y,6,BLUE);TB('x',M.x+14,M.y-8,BLUE_D,15);
  m4_rad(U,Math.PI-x,RED,2.4);DOT(N.x,N.y,6,RED);TB('π − x',N.x-8,N.y-10,DRED,14,'right');
  LN(M.x,M.y,M.x,U.cy,VIOLET,3.2);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_rad(U,Math.PI/2-x,GREEN,2.4);DOT(Q.x,Q.y,6,GREEN);TB('π/2 − x',Q.x+10,Q.y-10,DGREEN,14,'left');
   LN(Q.x,Q.y,Q.x,U.cy,GREEN,3.2);LN(N.x,N.y,N.x,U.cy,RED,3.2);
   tag('sin x',M.x+0,U.cy-R*.14,VIO_D,13);
   TB('sin(π − x) = sin x',W*.74,H*.3,DRED,15);TB('cos(π/2 − x) = sin x',W*.74,H*.46,DGREEN,15);TB('somme = 2 sin x',W*.74,H*.68,INK,19);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 2sin²-sin-1 */
  var R=Math.min(H*.4,W*.2),U=m4_uc(W*.3,H*.52,R,false);
  LN(U.cx-R*1.3,U.cy-R,U.cx+R*1.3,U.cy-R,ORANGE,2.2,[6,4]);LN(U.cx-R*1.3,U.cy+R/2,U.cx+R*1.3,U.cy+R/2,RED,2.2,[6,4]);
  tag('sin x = 1',U.cx,U.cy-R-14,ORANGE,14);tag('sin x = −1/2',U.cx,U.cy+R/2,DRED,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);var A=U.P(Math.PI/2),B=U.P(7*Math.PI/6),C=U.P(11*Math.PI/6);
   m4_rad(U,7*Math.PI/6,RED,2);m4_rad(U,11*Math.PI/6,RED,2);DOT(A.x,A.y,7,ORANGE);DOT(B.x,B.y,7,RED);DOT(C.x,C.y,7,RED);
   tag('π/2',A.x+28,A.y+2,ORANGE,15);tag('7π/6',B.x-30,B.y+14,DRED,15);tag('11π/6',C.x+36,C.y+14,DRED,15);ctx.globalAlpha=1;}
  else TB('2 sin² x − sin x − 1 = 0',W*.74,H*.3,GREY,15);
 },
 function (p) { /* 8 grande roue */
  var f=m4_fr(0,40,0,46,{l:36});
  m4_grid(f,10,10,true);TB('t (s)',f.R-14,f.B-8,GREY,12);TB('h (m)',f.L+4,f.T+8,GREY,12,'left');
  var h=function(t){return 22-20*Math.cos(Math.PI*t/20);};
  m4_cv(f,h,0,40,BLUE,3.6);tag('h(t) = 22 − 20 cos(πt/20)',f.X(20),f.Y(8),BLUE_D,14);
  m4_pt(f,0,2,GREY,'',0,0,5);m4_pt(f,10,22,GREY,'',0,0,5);m4_pt(f,20,42,GREY,'42 m',0,-16,5);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_hl(f,32,ORANGE);m4_pt(f,40/3,32,RED,'40/3 s',-6,-18,6);m4_pt(f,80/3,32,RED,'80/3 s',6,-18,6);tag('2 m',f.X(2.5),f.Y(2)-16,DGREEN,13);tag('22 m',f.X(10)+22,f.Y(22)+2,DGREEN,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 sin+cos */
  var R=Math.min(H*.4,W*.2),U=m4_uc(W*.3,H*.52,R,false);
  TB('cos x',U.cx+R*1.35,U.cy+16,GREY,13,'right');TB('sin x',U.cx+8,U.cy-R*1.3,GREY,13,'left');
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);var X=function(c){return U.cx+R*c;},Y=function(s){return U.cy-R*s;};
   LN(X(-.9),Y(1.4),X(1.4),Y(-.9),ORANGE,2.4);
   var t1=(.5+Math.sqrt(1.75))/2,t2=(.5-Math.sqrt(1.75))/2;
   DOT(X(t1),Y(t2),7,RED);DOT(X(t2),Y(t1),7,RED);
   tag('cos x + sin x = 1/2',X(.95),Y(1.2),DRED,13);TB('sin x·cos x = −3/8',W*.74,H*.3,DGREEN,16);TB('(sin x − cos x)² = 7/4',W*.74,H*.46,VIO_D,16);TB('Δ = 7/4 > 0 : possible',W*.74,H*.64,INK,16);ctx.globalAlpha=1;}
  else TB('sin x + cos x = 1/2 ?',W*.74,H*.4,GREY,17);
 }
]);
