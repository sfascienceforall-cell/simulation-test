/* Maths 4e · chapitre 9 : lieux géométriques, cercle et tangentes */
function m4_circ(f,cx,cy,r,col,w,dash,fill){ctx.beginPath();ctx.ellipse(f.X(cx),f.Y(cy),r*f.sx,r*f.sy,0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}
 ctx.strokeStyle=col;ctx.lineWidth=w||3;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function m4_seg(f,P,Q,col,w,dash){LN(f.X(P[0]),f.Y(P[1]),f.X(Q[0]),f.Y(Q[1]),col,w||2.4,dash);}
function m4_raxis(f){LN(f.L,f.Y(0),f.R,f.Y(0),AX,1.4);LN(f.X(0),f.T,f.X(0),f.B,AX,1.4);}
SFA.theo("c09", {
 icon: function () {
  var R=Math.min(H*.34,W*.18),cx=W*.27,cy=H*.54,pt=function(a){return {x:cx+R*Math.cos(a*D2R),y:cy-R*Math.sin(a*D2R)};};
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3.4;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  var T=pt(50),A=pt(215),B=pt(325),M=pt(110);
  LN(cx,cy,T.x,T.y,GREY,1.8,[4,3]);var dx=-Math.sin(50*D2R),dy=-Math.cos(50*D2R);LN(T.x-dx*R*.9,T.y-dy*R*.9,T.x+dx*R*.9,T.y+dy*R*.9,RED,2.6);
  LN(A.x,A.y,M.x,M.y,ORANGE,2.2);LN(B.x,B.y,M.x,M.y,ORANGE,2.2);LN(A.x,A.y,B.x,B.y,ORANGE,2.2);
  DOT(cx,cy,4,INK);DOT(T.x,T.y,5,RED);DOT(M.x,M.y,5,ORANGE);
  var x0=W*.5;
  TB('lieu : MA = MB',x0,H*.2,BLUE_D,22,'left');TB('(x − a)² + (y − b)² = r²',x0,H*.42,ORANGE,17,'left');TB('centre = 2 × inscrit',x0,H*.62,DRED,17,'left');TB('tangente ⟂ rayon',x0,H*.82,DGREEN,19,'left');
 },
 anim: function (t) {
  var R=Math.min(H*.36,W*.19),cx=R+46,cy=H*.52,pt=function(a){return {x:cx+R*Math.cos(a*D2R),y:cy-R*Math.sin(a*D2R)};};
  var A=pt(130),B=pt(50),ang=(t*.55)%360,major=(ang>130&&ang<410-0)?false:true;
  var m=(((ang+180)%360)+360)%360;/* position de M : parcourt tout le cercle */
  var phi=m, onMinor=(phi>50&&phi<130);
  var M=pt(phi);
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,R,-50*D2R,-130*D2R,true);ctx.stroke();
  LN(cx,cy,A.x,A.y,GREY,1.6,[4,3]);LN(cx,cy,B.x,B.y,GREY,1.6,[4,3]);
  DOT(cx,cy,3.5,INK);
  m4_ang({X:function(x){return x;},Y:function(y){return y;}},[cx,cy],50,130,R*.28,VIOLET,'',1);
  tag('80°',cx,cy-R*.42,VIO_D,14);
  var a1=Math.atan2(-(A.y-M.y),A.x-M.x)/D2R,a2=Math.atan2(-(B.y-M.y),B.x-M.x)/D2R;
  LN(A.x,A.y,M.x,M.y,ORANGE,2.6);LN(B.x,B.y,M.x,M.y,ORANGE,2.6);
  var d1=((a1%360)+360)%360,d2=((a2%360)+360)%360,lo=Math.min(d1,d2),hi=Math.max(d1,d2);if(hi-lo>180){var tmp=lo;lo=hi;hi=tmp+360;}
  m4_ang({X:function(x){return x;},Y:function(y){return y;}},[M.x,M.y],lo,hi,24,ORANGE,'',1);
  DOT(A.x,A.y,6,RED);DOT(B.x,B.y,6,RED);DOT(M.x,M.y,7,ORANGE);
  TB('A',A.x-14,A.y-6,INK,15);TB('B',B.x+14,B.y-6,INK,15);TB('M',M.x+(M.x>cx?14:-14),M.y+(M.y>cy?18:-8),ORANGE,15);
  var val=onMinor?140:40;
  var x0=cx+R+56;
  TB('Angle inscrit et angle au centre',x0,28,BLUE_D,16,'left');
  TB('angle au centre ÂOB = 80°',x0,68,VIO_D,16,'left');
  TB('angle inscrit ÂMB = '+val+'°',x0,100,ORANGE,18,'left');
  TB(onMinor?'M sur le petit arc : 180° − 40° = 140°':'M sur le grand arc : 80° / 2 = 40°',x0,134,onMinor?DRED:DGREEN,14,'left');
  TB('quand M parcourt le grand arc,',x0,190,GREY,14,'left');TB('l\'angle ÂMB ne change pas :',x0,210,GREY,14,'left');TB('lieu = arc de cercle',x0,230,DGREEN,15,'left');
 },
 th: '<div class="tcard"><b class="h">Lieu géométrique</b><p>Un lieu est l\'ensemble de <b>tous</b> les points qui vérifient une condition, et d\'eux seuls. Trois lieux de base : la <b>médiatrice</b> de [AB] (points équidistants de A et B : MA = MB), la <b>bissectrice</b> d\'un angle (équidistants des deux côtés), le <b>cercle</b> de centre O et de rayon r (OM = r).</p><p>Exemple : A(1 ; 2), B(5 ; 2). MA = MB ⇔ (x − 1)² + (y − 2)² = (x − 5)² + (y − 2)² ⇔ −2x + 1 = −10x + 25 ⇔ <b>x = 3</b> : la médiatrice est la droite verticale x = 3.</p></div>'+
 '<div class="tcard"><b class="h">Équation d\'un cercle</b><p>Centre C(a ; b), rayon r : <b>(x − a)² + (y − b)² = r²</b>. Un point est sur le cercle si ses coordonnées vérifient l\'équation. Pour reconnaître un cercle dans x² + y² + dx + ey + f = 0, on <b>complète les carrés</b> : x² + y² − 4x + 6y − 12 = 0 ⇔ (x − 2)² + (y + 3)² = 25 : centre (2 ; −3), rayon 5. Si le second membre est négatif, il n\'y a pas de point ; s\'il est nul, un seul.</p></div>'+
 '<div class="tcard"><b class="h">Angle au centre et angle inscrit</b><p>Un <b>angle au centre</b> vaut le <b>double</b> de tout angle inscrit qui intercepte le même arc : un angle au centre de 80° correspond à un angle inscrit de 40° (si M est sur le grand arc). Tous les angles inscrits qui interceptent le même arc sont égaux ; un angle inscrit dans un demi-cercle est <b>droit</b>. Donc le lieu des points M tels que ÂMB = 90° est le <b>cercle de diamètre [AB]</b> (privé de A et B).</p><p>Triangle ABC inscrit, Â = 35° : l\'angle au centre BÔC vaut 70° et OBC (isocèle) mesure (180° − 70°)/2 = <b>55°</b>.</p></div>'+
 '<div class="tcard"><b class="h">Tangentes à un cercle</b><p>La tangente en T est <b>perpendiculaire au rayon [OT]</b>. D\'un point P extérieur partent deux tangentes de même longueur : <b>PT² = OP² − r²</b>. Exemple : OP = 13 et PT = 12 donnent r² = 169 − 144 = 25, r = 5. Pour le cercle x² + y² = r², la tangente en T(x₀ ; y₀) a pour équation <b>x₀x + y₀y = r²</b>.</p><p>Exemple : r = 5, P(10 ; 0) : PT = √75 = 5√3, T(2,5 ; 2,5√3), et l\'angle entre les tangentes vaut 60° (car sin(θ/2) = r/OP = 1/2).</p></div>'+
 '<div class="tcard"><b class="h">Lieux par les coordonnées</b><p>On pose M(x ; y), on traduit la condition par une équation et on la met en forme. Apollonius : MA = 2·MB avec A(0 ; 0), B(3 ; 0) : x² + y² = 4[(x − 3)² + y²] ⇔ x² + y² − 8x + 12 = 0 ⇔ <b>(x − 4)² + y² = 4</b> : cercle de centre (4 ; 0), rayon 2. <b>Prolongement</b> : l\'ensemble des points avec MF₁ + MF₂ = 10 (F₁(−3 ; 0), F₂(3 ; 0)) est l\'ellipse x²/25 + y²/16 = 1. <b>Pièges</b> : oublier d\'élever au carré des deux côtés ; oublier d\'exclure A et B ; confondre arc et angle.</p></div>'
});
SFA.figs("c09", [
 function (p) { /* 0 médiatrice */
  var f=m4_fr(-1,7,-1.3,5.5,{});
  m4_grid(f,1,1,true);
  m4_P(f,1,2,'A(1 ; 2)',BLUE,0,18);m4_P(f,5,2,'B(5 ; 2)',BLUE,0,18);
  m4_seg(f,[1,2],[5,2],'#b9bdc4',1.6,[5,4]);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_seg(f,[3,-1],[3,5.3],RED,3.6);m4_P(f,3,4,'M',RED,14,-10);m4_seg(f,[1,2],[3,4],ORANGE,2.2);m4_seg(f,[5,2],[3,4],ORANGE,2.2);
   tag('MA = MB = 2√2',f.X(5.2),f.Y(4.5),DRED,14);tag('x = 3',f.X(3)+30,f.Y(-.4),DRED,15);ctx.globalAlpha=1;}
  else tag('MA = MB ?',f.X(3),f.Y(4.6),GREY,16);
 },
 function (p) { /* 1 angle inscrit */
  var R=Math.min(H*.36,W*.22),cx=W*.4,cy=H*.5,pt=function(a){return {x:cx+R*Math.cos(a*D2R),y:cy-R*Math.sin(a*D2R)};};
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  var A=pt(130),B=pt(50),M=pt(250);DOT(cx,cy,4,INK);TB('O',cx+12,cy+16,INK,15);
  LN(cx,cy,A.x,A.y,VIOLET,2.6);LN(cx,cy,B.x,B.y,VIOLET,2.6);tag('80°',cx,cy-R*.42,VIO_D,15);
  LN(M.x,M.y,A.x,A.y,ORANGE,2.6);LN(M.x,M.y,B.x,B.y,ORANGE,2.6);
  [[A,'A'],[B,'B'],[M,'M']].forEach(function(q){DOT(q[0].x,q[0].y,6,INK);});TB('A',A.x-14,A.y-8,INK,15);TB('B',B.x+14,B.y-8,INK,15);TB('M',M.x,M.y+20,INK,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ang({X:function(x){return x;},Y:function(y){return y;}},[M.x,M.y],Math.atan2(-(A.y-M.y),A.x-M.x)/D2R,Math.atan2(-(B.y-M.y),B.x-M.x)/D2R,34,ORANGE,'40°',1.5);
   TB('angle inscrit = 80° / 2',W*.8,H*.4,DRED,16);TB('= 40°',W*.8,H*.56,DRED,24);ctx.globalAlpha=1;}
  else TB('ÂMB = ?',W*.8,H*.5,GREY,22);
 },
 function (p) { /* 2 équation cercle */
  var f=m4_fr(-3,8,-5,4,{eq:true,t:20,b:14});
  m4_grid(f,1,1,true);
  m4_circ(f,2,-1,3,BLUE,3.4);m4_P(f,2,-1,'C(2 ; −1)',BLUE,-6,-18);m4_seg(f,[2,-1],[5,-1],ORANGE,2.2);tag('r = 3',f.X(3.5),f.Y(-1)+16,DRED,14);
  tag('(x − 2)² + (y + 1)² = 9',f.X(2),f.Y(3.6),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_P(f,5,-1,'(5 ; −1) ✓',GREEN,10,-18);m4_P(f,2,3,'(2 ; 3) ✗',RED,42,2);tag('distance 4 > 3',f.X(2)-46,f.Y(1.6),DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 centre rayon */
  var f=m4_fr(-4,9,-9.5,4.5,{eq:true,t:20,b:14});
  m4_grid(f,1,1,true);
  tag('x² + y² − 4x + 6y − 12 = 0',f.X(2),f.Y(3.2),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_circ(f,2,-3,5,BLUE,3.4);m4_P(f,2,-3,'(2 ; −3)',RED,0,18);m4_seg(f,[2,-3],[7,-3],ORANGE,2.4);tag('r = 5',f.X(4.5),f.Y(-3)-14,DRED,15);
   tag('(x − 2)² + (y + 3)² = 25',f.X(5.2),f.Y(-8.8),DGREEN,14);ctx.globalAlpha=1;}
  else m4_circ(f,2,-3,5,'#c5ccd6',2.6,[6,5]);
 },
 function (p) { /* 4 rayon et tangente */
  var u=Math.min((W*.9)/18,(H*.8)/10),ox=W*.05+5*u,oy=H*.5;var X=function(x){return ox+x*u;},Y=function(y){return oy-y*u;};
  var T=[25/13,60/13];
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();ctx.arc(X(0),Y(0),5*u,0,7);ctx.stroke();
  LN(X(0),Y(0),X(13),Y(0),GREY,1.8,[5,4]);LN(X(0),Y(0),X(T[0]),Y(T[1]),ORANGE,2.8);LN(X(13),Y(0),X(T[0]),Y(T[1]),RED,3);
  DOT(X(0),Y(0),4,INK);DOT(X(13),Y(0),6,INK);DOT(X(T[0]),Y(T[1]),6,RED);TB('O',X(0)-12,Y(0)+16,INK,15);TB('P',X(13),Y(0)+20,INK,15);TB('T',X(T[0])-4,Y(T[1])-12,DRED,15);
  tag('OP = 13',X(7),Y(0)+16,INK,14);tag('PT = 12',X(7.8),Y(2.7)-2,DRED,14);
  rmark({x:X(T[0]),y:Y(T[1])},{x:-(X(0)-X(T[0]))/Math.hypot(X(0)-X(T[0]),Y(0)-Y(T[1])),y:-(Y(0)-Y(T[1]))/Math.hypot(X(0)-X(T[0]),Y(0)-Y(T[1]))},{x:(X(13)-X(T[0]))/(12*u),y:(Y(13)-Y(T[1]))/(12*u)},10,DRED);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('OT = r',X(.7),Y(2.6),DGREEN,15);tag('r² = 13² − 12² = 25',W*.5,H*.1,DGREEN,16);tag('r = 5',W*.5,H*.92,DRED,20);ctx.globalAlpha=1;}
  else tag('r = ?',W*.5,H*.92,GREY,18);
 },
 function (p) { /* 5 lieu angle droit */
  var f=m4_fr(-5,5,-3.8,3.8,{eq:true,t:14,b:14});
  m4_grid(f,1,1,true);
  m4_P(f,-3,0,'A',BLUE,0,20);m4_P(f,3,0,'B',BLUE,0,20);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_circ(f,0,0,3,RED,3.4);var M=[3*Math.cos(65*D2R),3*Math.sin(65*D2R)];
   m4_seg(f,[-3,0],M,ORANGE,2.4);m4_seg(f,[3,0],M,ORANGE,2.4);m4_P(f,M[0],M[1],'M',RED,12,-12);
   var dA={x:(f.X(-3)-f.X(M[0])),y:(f.Y(0)-f.Y(M[1]))},dB={x:(f.X(3)-f.X(M[0])),y:(f.Y(0)-f.Y(M[1]))},la=Math.hypot(dA.x,dA.y),lb=Math.hypot(dB.x,dB.y);
   rmark({x:f.X(M[0]),y:f.Y(M[1])},{x:dA.x/la,y:dA.y/la},{x:dB.x/lb,y:dB.y/lb},12,DRED);
   tag('AMB = 90° : x² + y² = 9',f.X(0),f.Y(-2.2),DRED,15);ctx.globalAlpha=1;}
  else{m4_seg(f,[-3,0],[3,0],'#b9bdc4',1.6,[5,4]);tag('lieu des M tels que AMB = 90° ?',f.X(0),f.Y(2.6),GREY,14);}
 },
 function (p) { /* 6 triangle inscrit */
  var R=Math.min(H*.38,W*.22),cx=W*.38,cy=H*.52,pt=function(a){return {x:cx+R*Math.cos(a*D2R),y:cy-R*Math.sin(a*D2R)};};
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  var A=pt(100),B=pt(250),C=pt(320);DOT(cx,cy,4,INK);TB('O',cx+4,cy-10,INK,14);
  ctx.fillStyle='rgba(55,138,221,.10)';ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.fill();ctx.strokeStyle=BLUE_D;ctx.lineWidth=2.6;ctx.stroke();
  [[A,'A'],[B,'B'],[C,'C']].forEach(function(q){DOT(q[0].x,q[0].y,5,INK);});TB('A',A.x,A.y-12,INK,15);TB('B',B.x-14,B.y+16,INK,15);TB('C',C.x+14,C.y+14,INK,15);
  var I={X:function(x){return x;},Y:function(y){return y;}};
  m4_ang(I,[A.x,A.y],Math.atan2(-(B.y-A.y),B.x-A.x)/D2R,Math.atan2(-(C.y-A.y),C.x-A.x)/D2R,30,ORANGE,'35°',1.6);
  LN(cx,cy,B.x,B.y,GREY,1.8,[4,3]);LN(cx,cy,C.x,C.y,GREY,1.8,[4,3]);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(cx,cy,B.x,B.y,RED,2.4);LN(cx,cy,C.x,C.y,RED,2.4);tag('70°',cx+4,cy+R*.36,VIO_D,15);
   m4_ang(I,[B.x,B.y],Math.atan2(-(cy-B.y),cx-B.x)/D2R,Math.atan2(-(C.y-B.y),C.x-B.x)/D2R,32,RED,'55°',1.7);
   TB('BÔC = 2 × 35° = 70°',W*.8,H*.34,VIO_D,15);TB('OBC = (180° − 70°)/2',W*.8,H*.5,DRED,15);TB('= 55°',W*.8,H*.66,DRED,24);ctx.globalAlpha=1;}
  else TB('OBC = ?',W*.8,H*.5,GREY,22);
 },
 function (p) { /* 7 Apollonius */
  var f=m4_fr(-2,8,-3.6,3.6,{eq:true,t:14,b:14});
  m4_grid(f,1,1,true);
  m4_P(f,0,0,'A',BLUE,0,20);m4_P(f,3,0,'B',BLUE,0,20);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_circ(f,4,0,2,RED,3.4);m4_P(f,4,0,'(4 ; 0)',RED,0,18);m4_P(f,4,2,'M',ORANGE,12,-12);
   m4_seg(f,[0,0],[4,2],ORANGE,2.2);m4_seg(f,[3,0],[4,2],GREEN,2.2);tag('MA = 2√5',f.X(1.8),f.Y(1.4),DRED,13);tag('MB = √5',f.X(3.1)+30,f.Y(1.2),DGREEN,13);
   tag('(x − 4)² + y² = 4',f.X(4),f.Y(-2.8),DRED,15);ctx.globalAlpha=1;}
  else tag('MA = 2·MB ?',f.X(4),f.Y(2.6),GREY,16);
 },
 function (p) { /* 8 deux tangentes */
  var f=m4_fr(-6,12,-6.5,6.5,{eq:true,t:12,b:12});
  m4_grid(f,1,1,false);m4_raxis(f);
  m4_circ(f,0,0,5,BLUE,3.4);m4_P(f,0,0,'O',BLUE,-12,16);m4_P(f,10,0,'P(10 ; 0)',INK,0,18);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);var y=2.5*Math.sqrt(3);
   m4_seg(f,[10,0],[2.5,y],RED,3);m4_seg(f,[10,0],[2.5,-y],RED,3);m4_seg(f,[0,0],[2.5,y],GREY,1.8,[4,3]);m4_seg(f,[0,0],[2.5,-y],GREY,1.8,[4,3]);
   m4_P(f,2.5,y,'T₁(2,5 ; 2,5√3)',RED,6,-14);m4_P(f,2.5,-y,'T₂',RED,-14,16);
   m4_ang(f,[10,0],150,210,34,ORANGE,'60°',1.9);tag('PT = 5√3',f.X(6.4),f.Y(3.2)+0,DRED,13);tag('x + √3·y = 10',f.X(6.6),f.Y(-5.3),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 ellipse */
  var f=m4_fr(-7,7,-5,5,{eq:true,t:12,b:12});
  m4_grid(f,1,1,true);
  m4_P(f,-3,0,'F₁',BLUE,0,20);m4_P(f,3,0,'F₂',BLUE,0,20);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);ctx.strokeStyle=RED;ctx.lineWidth=3.4;ctx.beginPath();for(var i=0;i<=100;i++){var a=i/100*2*Math.PI;i?ctx.lineTo(f.X(5*Math.cos(a)),f.Y(4*Math.sin(a))):ctx.moveTo(f.X(5*Math.cos(a)),f.Y(4*Math.sin(a)));}ctx.stroke();
   m4_seg(f,[-3,0],[0,4],ORANGE,2.2);m4_seg(f,[3,0],[0,4],ORANGE,2.2);m4_P(f,0,4,'(0 ; 4)',RED,0,-14);m4_P(f,5,0,'(5 ; 0)',RED,0,-16);
   tag('MF₁ + MF₂ = 10',f.X(0),f.Y(-2.3),DRED,15);tag('x²/25 + y²/16 = 1',f.X(0),f.Y(-3.6),DGREEN,15);ctx.globalAlpha=1;}
  else{m4_seg(f,[-3,0],[3,0],'#b9bdc4',1.6,[5,4]);tag('ficelle de longueur 10',f.X(0),f.Y(3),GREY,15);}
 }
]);
