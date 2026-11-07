/* Maths 4e · chapitre 7 : triangles quelconques et trigonométrie */
function m4_T(f,P,names,col){var i,c={x:(P[0][0]+P[1][0]+P[2][0])/3,y:(P[0][1]+P[1][1]+P[2][1])/3};
 ctx.fillStyle='rgba(55,138,221,.10)';ctx.beginPath();P.forEach(function(q,k){k?ctx.lineTo(f.X(q[0]),f.Y(q[1])):ctx.moveTo(f.X(q[0]),f.Y(q[1]));});ctx.closePath();ctx.fill();
 ctx.strokeStyle=col||BLUE_D;ctx.lineWidth=3;ctx.lineJoin='round';ctx.stroke();
 for(i=0;i<3;i++){var q=P[i],dx=f.X(q[0])-f.X(c.x),dy=f.Y(q[1])-f.Y(c.y),l=Math.hypot(dx,dy)||1;
  TB(names[i],f.X(q[0])+dx/l*16,f.Y(q[1])+dy/l*16+5,INK,17);}}
function m4_sd(f,P,Q,txt,col,off,sz){var mx=(P[0]+Q[0])/2,my=(P[1]+Q[1])/2,dx=f.X(Q[0])-f.X(P[0]),dy=f.Y(Q[1])-f.Y(P[1]),l=Math.hypot(dx,dy)||1;
 tag(txt,f.X(mx)+(-dy/l)*off,f.Y(my)+(dx/l)*off,col||INK,sz||14);}
function m4_ang(f,V,a0,a1,r,col,lab,lk){/* a0,a1 en degrés (repère mathématique) */
 var x=f.X(V[0]),y=f.Y(V[1]);ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,r,-a0*D2R,-a1*D2R,a1>a0);ctx.stroke();
 if(lab){var m=(a0+a1)/2*D2R,k=lk||1.7;tag(lab,x+r*k*Math.cos(m),y-r*k*Math.sin(m),col,13);}}
SFA.theo("c07", {
 icon: function () {
  var f=m4_fr(-.5,10,-.5,7.5,{l:20,r:W*.46,t:40,b:18,eq:true});
  var A=[1,0],B=[9,0],C=[3.4,6.2];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,A,0,Math.atan2(6.2,2.4)/D2R,26,ORANGE,'',1);
  var x0=W*.52;
  TB('a / sin A = b / sin B',x0,H*.3,BLUE_D,19,'left');TB('= c / sin C',x0+78,H*.3+24,BLUE_D,19,'left');
  TB('a² = b² + c² − 2bc·cos A',x0,H*.6,ORANGE,18,'left');
  TB('aire = ½ · b · c · sin A',x0,H*.82,DRED,18,'left');
 },
 anim: function (t) {
  var R=Math.min(H*.32,W*.18),cx=R+40,cy=H*.54;
  var phi=90+62*Math.sin(t/95),pt=function(a){return {x:cx+R*Math.cos(a*D2R),y:cy-R*Math.sin(a*D2R)};};
  var B=pt(210),C=pt(330),A=pt(phi);
  ctx.strokeStyle='#c5ccd6';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  DOT(cx,cy,3,GREY);
  ctx.fillStyle='rgba(55,138,221,.10)';ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.fill();
  LN(B.x,B.y,C.x,C.y,RED,3.6);LN(A.x,A.y,C.x,C.y,GREEN,3.6);LN(A.x,A.y,B.x,B.y,ORANGE,3.6);
  [[A,'A'],[B,'B'],[C,'C']].forEach(function(q){DOT(q[0].x,q[0].y,5,INK);var dx=q[0].x-cx,dy=q[0].y-cy,l=Math.hypot(dx,dy);TB(q[1],q[0].x+dx/l*16,q[0].y+dy/l*16+5,INK,16);});
  var Bd=(phi+30)/2,Cd=(210-phi)/2,Ad=60,s=3/R;
  var a=2*3*Math.sin(Ad*D2R),b=2*3*Math.sin(Bd*D2R),c=2*3*Math.sin(Cd*D2R),r2=function(v,n){return m4_n(v.toFixed(n==null?2:n));};
  var x0=cx+R+54;
  TB('Loi des sinus : le cercle circonscrit',x0,26,BLUE_D,16,'left');
  TB('a = BC = '+r2(a)+'   Â = 60°',x0,64,DRED,15,'left');
  TB('b = AC = '+r2(b)+'   B̂ = '+r2(Bd,0)+'°',x0,92,DGREEN,15,'left');
  TB('c = AB = '+r2(c)+'   Ĉ = '+r2(Cd,0)+'°',x0,120,ORANGE,15,'left');
  TB('a / sin Â = '+r2(a/Math.sin(Ad*D2R),1),x0,166,DRED,16,'left');
  TB('b / sin B̂ = '+r2(b/Math.sin(Bd*D2R),1),x0,192,DGREEN,16,'left');
  TB('c / sin Ĉ = '+r2(c/Math.sin(Cd*D2R),1),x0,218,ORANGE,16,'left');
  TB('toujours égaux à 2R = 6,0',x0,252,VIO_D,15,'left');
 },
 th: '<div class="tcard"><b class="h">Notations</b><p>Dans le triangle ABC, a = BC est le côté opposé à Â, b = AC à B̂, c = AB à Ĉ. On a Â + B̂ + Ĉ = 180°. « Résoudre » un triangle, c\'est calculer tous ses côtés et tous ses angles à partir de trois données.</p></div>'+
 '<div class="tcard"><b class="h">Loi des sinus</b><p><b>a / sin Â = b / sin B̂ = c / sin Ĉ</b> (= 2R, R rayon du cercle circonscrit). On l\'utilise quand on connaît <b>un côté et son angle opposé</b> (cas ASA, AAS, SSA).</p><p>Exemple : Â = 40°, B̂ = 60°, a = 7 cm. Alors b = a·sin B̂ / sin Â = 7 × 0,8660 / 0,6428 ≈ <b>9,4 cm</b>.</p></div>'+
 '<div class="tcard"><b class="h">Loi des cosinus</b><p><b>a² = b² + c² − 2bc·cos Â</b> (et les deux autres par permutation). On l\'utilise avec <b>deux côtés et l\'angle compris</b> (SAS) ou avec <b>trois côtés</b> (SSS) : cos Â = (b² + c² − a²)/(2bc). Pour Â = 90°, on retrouve Pythagore.</p><p>Exemples : c = 8, b = 5, Â = 60° : a² = 64 + 25 − 40 = 49, donc <b>a = 7</b>. Côtés 5, 7, 8 : l\'angle opposé à 7 vérifie cos θ = (25 + 64 − 49)/80 = 1/2, donc <b>θ = 60°</b>.</p></div>'+
 '<div class="tcard"><b class="h">Aire</b><p><b>Aire = ½·b·c·sin Â</b> (deux côtés et l\'angle compris). La hauteur issue de A s\'obtient ensuite par aire = ½·a·h. Exemple : 5 cm, 8 cm et 30° donnent ½ × 5 × 8 × 0,5 = <b>10 cm²</b>.</p></div>'+
 '<div class="tcard"><b class="h">Cas ambigu (SSA) et applications</b><p>Avec Â, b et a donnés, on pose h = b·sin Â : si a &lt; h aucun triangle ; si a = h un seul (rectangle) ; si <b>h &lt; a &lt; b deux triangles</b> (B̂ aigu ou obtus : sin B̂ = b·sin Â / a donne B̂ et 180° − B̂) ; si a ≥ b un seul. Exemple : Â = 30°, b = 10, a = 6 : h = 5, donc deux triangles.</p><p><b>Forces</b> : deux forces F₁, F₂ faisant un angle φ ont une résultante de norme R² = F₁² + F₂² + 2F₁F₂ cos φ. <b>Pièges</b> : calculatrice en degrés ; sin B̂ = 0,83 ne donne pas qu\'un seul angle ; vérifier que la somme des angles vaut 180°.</p></div>'
});
SFA.figs("c07", [
 function (p) { /* 0 loi des sinus */
  var f=m4_fr(-1,13,-1.5,11,{eq:true,t:20,b:14});
  var cB=10.72,A=[cB*Math.cos(60*D2R),cB*Math.sin(60*D2R)],B=[0,0],C=[7,0];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,B,0,60,26,ORANGE,'60°',1.9);m4_ang(f,A,240,280,30,BLUE,'40°',2.0);
  m4_sd(f,B,C,'a = 7 cm',DRED,-22,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(A[0]),f.Y(A[1]),f.X(C[0]),f.Y(C[1]),RED,4.2);m4_sd(f,A,C,'b ≈ 9,4 cm',DRED,22,15);
   tag('b / sin 60° = 7 / sin 40°',W*.5,H*.95,DGREEN,14);ctx.globalAlpha=1;}
  else m4_sd(f,A,C,'b = ?',GREY,22,15);
 },
 function (p) { /* 1 quelle loi */
  var f=m4_fr(-1,11,-1,8,{eq:true,t:30,b:14});
  var A=[0,0],B=[10,.5],C=[3,6.3];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,A,3,64,28,ORANGE,'Â',1.9);
  m4_sd(f,A,B,'c',INK,-14,15);m4_sd(f,A,C,'b',INK,14,15);
  LN(f.X(B[0]),f.Y(B[1]),f.X(C[0]),f.Y(C[1]),p>0?RED:GREY,4,p>0?null:[6,5]);m4_sd(f,B,C,'a = ?',p>0?DRED:GREY,16,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('a² = b² + c² − 2bc cos Â',W*.5,H*.1,DGREEN,16);tag('2 côtés + angle compris',W*.5,H*.9,DRED,14);ctx.globalAlpha=1;}
  else tag('2 côtés + l\'angle compris',W*.5,H*.1,GREY,15);
 },
 function (p) { /* 2 aire */
  var f=m4_fr(-1,9,-1,5,{eq:true,t:24,b:20});
  var A=[0,0],C=[8,0],B=[5*Math.cos(30*D2R),2.5];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,A,0,30,30,ORANGE,'30°',1.9);m4_sd(f,A,B,'5 cm',INK,-14,14);m4_sd(f,A,C,'8 cm',INK,16,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(B[0]),f.Y(B[1]),f.X(B[0]),f.Y(0),RED,2.4,[5,4]);tag('h = 5 sin 30° = 2,5',f.X(B[0])+80,f.Y(1.2),DRED,14);
   tag('aire = ½ · 5 · 8 · sin 30° = 10 cm²',W*.5,H*.92,DGREEN,16);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 loi des cosinus côté */
  var f=m4_fr(-1,9.5,-1,5.5,{eq:true,t:24,b:20});
  var A=[0,0],B=[8,0],C=[2.5,5*Math.sin(60*D2R)];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,A,0,60,30,ORANGE,'60°',1.9);m4_sd(f,A,B,'8 cm',INK,16,14);m4_sd(f,A,C,'5 cm',INK,-14,14);
  LN(f.X(B[0]),f.Y(B[1]),f.X(C[0]),f.Y(C[1]),p>0?RED:GREY,4,p>0?null:[6,5]);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_sd(f,B,C,'BC = 7 cm',DRED,18,15);tag('BC² = 64 + 25 − 2·8·5·cos 60° = 49',W*.5,H*.92,DGREEN,15);ctx.globalAlpha=1;}
  else m4_sd(f,B,C,'BC = ?',GREY,18,15);
 },
 function (p) { /* 4 angle SSS */
  var f=m4_fr(-1,9.5,-1,5.5,{eq:true,t:24,b:20});
  var V=[0,0],P=[8,0],Q=[2.5,5*Math.sin(60*D2R)];
  m4_T(f,[V,P,Q],['A','B','C']);
  m4_sd(f,V,P,'8',INK,16,15);m4_sd(f,V,Q,'5',INK,-14,15);m4_sd(f,P,Q,'7',INK,16,15);
  m4_ang(f,V,0,60,30,p>0?RED:GREY,p>0?'60°':'θ = ?',1.9);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('cos θ = (25 + 64 − 49) / 80 = 1/2',W*.5,H*.92,DGREEN,15);ctx.globalAlpha=1;}
  else tag('angle opposé au côté 7',W*.5,H*.92,GREY,14);
 },
 function (p) { /* 5 ASA */
  var f=m4_fr(-1.5,14,-1.5,11.5,{eq:true,t:18,b:14});
  var c=13.02,B=[0,0],C=[12,0],A=[c*Math.cos(50*D2R),c*Math.sin(50*D2R)];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,B,0,50,28,ORANGE,'50°',1.9);m4_ang(f,C,110,180,28,BLUE,'70°',1.9);m4_sd(f,B,C,'a = 12 cm',INK,-16,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ang(f,A,230,290,26,RED,'60°',1.9);m4_sd(f,A,C,'b ≈ 10,61',DRED,22,14);m4_sd(f,A,B,'c ≈ 13,02',DRED,-20,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 cas ambigu */
  var f=m4_fr(-1,13,-1,8,{eq:true,t:24,b:14});
  var A=[0,0],C=[10,0],t1=5.34,t2=11.98,c30=Math.cos(30*D2R),s30=.5;
  var B1=[t1*c30,t1*s30],B2=[t2*c30,t2*s30];
  LN(f.X(0),f.Y(0),f.X(13*c30),f.Y(13*s30),GREY,1.8,[6,4]);LN(f.X(A[0]),f.Y(0),f.X(C[0]),f.Y(0),INK,3);
  ctx.strokeStyle='#c5ccd6';ctx.lineWidth=1.8;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(f.X(10),f.Y(0),6*f.sx,0,Math.PI,true);ctx.stroke();ctx.setLineDash([]);
  LN(f.X(C[0]),f.Y(0),f.X(B1[0]),f.Y(B1[1]),BLUE,3.2);DOT(f.X(B1[0]),f.Y(B1[1]),6,BLUE);
  TB('A',f.X(0)-14,f.Y(0)+16,INK,16);TB('C',f.X(10)+4,f.Y(0)+20,INK,16);TB('B₁',f.X(B1[0])-14,f.Y(B1[1])-10,BLUE_D,16);
  m4_ang(f,A,0,30,32,ORANGE,'30°',1.9);tag('AC = 10',f.X(5),f.Y(0)+20,INK,13);tag('CB = 6',f.X(7.6),f.Y(1.4),DRED,13);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(C[0]),f.Y(0),f.X(B2[0]),f.Y(B2[1]),RED,3.2);DOT(f.X(B2[0]),f.Y(B2[1]),6,RED);TB('B₂',f.X(B2[0])+4,f.Y(B2[1])-10,DRED,16);
   tag('h = 10 sin 30° = 5 < 6 < 10 : deux triangles',W*.5,H*.07,DGREEN,14);ctx.globalAlpha=1;}
  else tag('combien de triangles ?',W*.5,H*.07,GREY,15);
 },
 function (p) { /* 7 rivière */
  var f=m4_fr(-20,125,-12,85,{eq:true,t:14,b:10});
  ctx.fillStyle='#e6f1fb';ctx.fillRect(f.L,f.Y(60),f.R-f.L,f.Y(0)-f.Y(60));
  LN(f.L,f.Y(0),f.R,f.Y(0),GREEN,3);LN(f.L,f.Y(60),f.R,f.Y(60),GREEN,3);TB('rivière',f.R-40,f.Y(30),BLUE_D,15);
  var AT=79.08,T=[AT*Math.cos(62*D2R),AT*Math.sin(62*D2R)],A=[0,0],B=[100,0];
  LN(f.X(0),f.Y(0),f.X(100),f.Y(0),INK,3);
  [A,B].forEach(function(q,i){DOT(f.X(q[0]),f.Y(q[1]),6,INK);TB(i?'B':'A',f.X(q[0]),f.Y(q[1])+22,INK,16);});
  LN(f.X(0),f.Y(0),f.X(T[0]),f.Y(T[1]),BLUE,2.4);LN(f.X(100),f.Y(0),f.X(T[0]),f.Y(T[1]),BLUE,2.4);
  DOT(f.X(T[0]),f.Y(T[1]),8,GREEN);TB('T (arbre)',f.X(T[0])-12,f.Y(T[1])-8,DGREEN,15,'right');
  m4_ang(f,A,0,62,34,ORANGE,'62°',1.8);m4_ang(f,B,118,180,34,RED,'48°',1.9);tag('AB = 100 m',f.X(50),f.Y(0)+22,INK,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(T[0]),f.Y(T[1]),f.X(T[0]),f.Y(0),RED,2.4,[5,4]);tag('70 m',f.X(T[0])+30,f.Y(35),DRED,15);
   tag('AT ≈ 79 m',f.X(14),f.Y(38),DRED,13);tag('BT ≈ 94 m',f.X(88),f.Y(38),DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 8 remorqueurs */
  var ox=W*.16,oy=H*.82,F1=3000,F2=4000,a1=10*D2R,a2=70*D2R,k=Math.min(W*.5,H*.6)/6100;
  var v1={x:F1*Math.cos(a1)*k,y:-F1*Math.sin(a1)*k},v2={x:F2*Math.cos(a2)*k,y:-F2*Math.sin(a2)*k};
  ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE_D;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(ox,oy,28,13,0,0,7);ctx.fill();ctx.stroke();TB('bateau',ox,oy+34,GREY,13);
  arrow(ox,oy,v1.x,v1.y,ORANGE,'',3.6);arrow(ox,oy,v2.x,v2.y,GREEN,'',3.6);
  TB('3 000 N',ox+v1.x+10,oy+v1.y+16,ORANGE,15,'left');TB('4 000 N',ox+v2.x-8,oy+v2.y-4,DGREEN,15,'right');
  m4_ang({X:function(x){return x;},Y:function(y){return y;}},[ox,oy],10,70,60,VIOLET,'60°',1.4);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(ox+v1.x,oy+v1.y,ox+v1.x+v2.x,oy+v1.y+v2.y,'#b9bdc4',1.6,[5,4]);LN(ox+v2.x,oy+v2.y,ox+v1.x+v2.x,oy+v1.y+v2.y,'#b9bdc4',1.6,[5,4]);
   arrow(ox,oy,v1.x+v2.x,v1.y+v2.y,RED,'',4);tag('R ≈ 6 083 N',ox+(v1.x+v2.x)*.5+50,oy+(v1.y+v2.y)*.5+6,DRED,16);
   TB('R² = F₁² + F₂² + 2F₁F₂ cos 60°',W*.5,H*.07,DGREEN,15);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 parcelle */
  var f=m4_fr(-12,132,-10,80,{eq:true,t:14,b:14});
  var A=[0,0],B=[120,0],C=[90*Math.cos(50*D2R),90*Math.sin(50*D2R)];
  m4_T(f,[A,B,C],['A','B','C']);
  m4_ang(f,A,0,50,36,ORANGE,'50°',1.7);m4_sd(f,A,B,'AB = 120 m',INK,-16,13);m4_sd(f,A,C,'AC = 90 m',INK,16,13);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(B[0]),f.Y(0),f.X(C[0]),f.Y(C[1]),RED,3.6);m4_sd(f,B,C,'BC ≈ 92,8 m',DRED,16,14);
   m4_ang(f,B,132,180,34,GREEN,'48°',1.9);m4_ang(f,C,230,312,26,BLUE,'82°',1.9);
   tag('aire ≈ 4 137 m²',f.X(55),f.Y(18),DGREEN,15);ctx.globalAlpha=1;}
 }
]);
