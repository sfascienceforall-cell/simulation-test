/* Maths 5e · chapitre 9 · espace : perspective cavalière, sections */
var M9_KX=.433,M9_KY=.25;
function m9_P(ox,oy,s){return function(x,y,z){return {x:ox+s*(x+M9_KX*y),y:oy-s*(z+M9_KY*y)};};}
function m9_poly(pts,fill,stroke,w,dash){ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=w||2;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}}
function m9_seg(P,a,b,col,w,dash){var A=P(a[0],a[1],a[2]),B=P(b[0],b[1],b[2]);LN(A.x,A.y,B.x,B.y,col,w||2,dash||null);}
var M9_V={A:[0,0,0],B:[1,0,0],C:[1,1,0],D:[0,1,0],E:[0,0,1],F:[1,0,1],G:[1,1,1],H:[0,1,1]};
/* cube de côté 1 (coordonnées échelle s) ; labels : afficher les sommets */
function m9_cube(P,lab,col){var V=M9_V,vis=[['A','B'],['B','C'],['A','E'],['B','F'],['C','G'],['E','F'],['F','G'],['G','H'],['H','E']],hid=[['A','D'],['D','C'],['D','H']];
 hid.forEach(function(e){m9_seg(P,V[e[0]],V[e[1]],'#aab0b6',1.5,[5,4]);});vis.forEach(function(e){m9_seg(P,V[e[0]],V[e[1]],col||INK,2.2);});
 if(lab){var off={A:[-11,12],B:[11,12],C:[12,4],D:[-12,-2],E:[-10,-6],F:[10,-6],G:[12,-5],H:[-11,-8]};for(var k in V){var q=P(V[k][0],V[k][1],V[k][2]);TB(k,q.x+off[k][0],q.y+off[k][1]+3,GREY,lab===true?13:lab);}}}
/* section plan n·x = d du cube unité : sommets ordonnés */
function m9_sect(n,d){var V=M9_V,ed=[['A','B'],['B','C'],['C','D'],['D','A'],['E','F'],['F','G'],['G','H'],['H','E'],['A','E'],['B','F'],['C','G'],['D','H']],pts=[];
 ed.forEach(function(e){var a=V[e[0]],b=V[e[1]],fa=n[0]*a[0]+n[1]*a[1]+n[2]*a[2]-d,fb=n[0]*b[0]+n[1]*b[1]+n[2]*b[2]-d;if(Math.abs(fa)<1e-9){pts.push(a.slice());}else if(fa*fb<0){var t=fa/(fa-fb);pts.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1]),a[2]+t*(b[2]-a[2])]);}});
 var u=[];pts.forEach(function(q){if(!u.some(function(r){return Math.hypot(r[0]-q[0],r[1]-q[1],r[2]-q[2])<1e-6;}))u.push(q);});
 if(u.length<3)return u;var c=[0,0,0];u.forEach(function(q){c[0]+=q[0]/u.length;c[1]+=q[1]/u.length;c[2]+=q[2]/u.length;});
 var nl=Math.hypot(n[0],n[1],n[2]),nn=[n[0]/nl,n[1]/nl,n[2]/nl],e1=[u[0][0]-c[0],u[0][1]-c[1],u[0][2]-c[2]],l1=Math.hypot(e1[0],e1[1],e1[2]);e1=e1.map(function(v){return v/l1;});
 var e2=[nn[1]*e1[2]-nn[2]*e1[1],nn[2]*e1[0]-nn[0]*e1[2],nn[0]*e1[1]-nn[1]*e1[0]];
 u.sort(function(p,q){var a=Math.atan2((p[0]-c[0])*e2[0]+(p[1]-c[1])*e2[1]+(p[2]-c[2])*e2[2],(p[0]-c[0])*e1[0]+(p[1]-c[1])*e1[1]+(p[2]-c[2])*e1[2]),b=Math.atan2((q[0]-c[0])*e2[0]+(q[1]-c[1])*e2[1]+(q[2]-c[2])*e2[2],(q[0]-c[0])*e1[0]+(q[1]-c[1])*e1[1]+(q[2]-c[2])*e1[2]);return a-b;});
 return u;}
function m9_fillSect(P,pts,fill,stroke){m9_poly(pts.map(function(q){return P(q[0],q[1],q[2]);}),fill,stroke,2.4);}
function m9_dot(P,q,col,r,lab,dx,dy){var o=P(q[0],q[1],q[2]);DOT(o.x,o.y,r||5,col);if(lab)TB(lab,o.x+(dx||0),o.y+(dy||0),dk(col),13);}
function m9_geom(){var s=Math.min(W*.46,H*.62)/1.45,ox=W*.06+s*.1,oy=H*.9;return {s:s,P:m9_P(ox,oy-s*.02,s)};}

SFA.theo("c09", {
 icon: function () { var s=Math.min(W*.3,H*.52),P=m9_P(W*.3,H*.82,s);m9_cube(P,false,BLUE_D);m9_fillSect(P,m9_sect([1,1,1],1.5),ORA2+'88',ORA2);TB('sections',W*.74,H*.4,ORA2,22);TB('de l’espace',W*.74,H*.58,BLUE_D,19); },
 anim: function (t) {
  var s=Math.min(H*.66,W*.3)/1.25,P=m9_P(W*.1,H*.88,s),c=1.5+1.38*Math.sin(t*.014);m9_cube(P,true,BLUE_D);
  var pts=m9_sect([1,1,1],c);if(pts.length>=3)m9_fillSect(P,pts,ORA2+'66',ORA2);
  var tx=W*.56;TB('plan x + y + z = '+nfmt(c.toFixed(2).replace('.',',')),tx,H*.22,INK,15,'left');
  var nm={3:'triangle',4:'quadrilatère',5:'pentagone',6:'hexagone'};TB('section : '+(nm[pts.length]||'—'),tx,H*.4,DRED,18,'left');TB(pts.length+' côtés',tx,H*.55,DRED,16,'left');
  TB(pts.length===6&&Math.abs(c-1.5)<.05?'hexagone régulier au centre !':'le plan coupe le cube en 3 à 6 points',tx,H*.75,DGREEN,14,'left');TB('un cube : au plus 6 côtés (6 faces)',tx,H*.87,GREY,13,'left');
 },
 th: "<div class='tcard'><b class='h'>Positions relatives</b><p><b>Deux droites</b> de l’espace sont : <b>sécantes</b> (un point commun), <b>parallèles</b> (même direction, coplanaires) ou <b>gauches</b> (aucun point commun et non coplanaires). Dans un cube ABCDEFGH : (AB) // (EF) ; (AB) et (AD) sécantes en A ; (AB) et (CG) gauches. Deux droites sans point commun sont donc parallèles <b>ou</b> gauches, pas forcément parallèles.</p><p><b>Droite et plan</b> : incluse, parallèle ou sécante en un point. <b>Deux plans</b> : parallèles ou sécants selon une droite.</p></div>"
 +"<div class='tcard'><b class='h'>Parallélisme</b><p>Deux droites parallèles à une même troisième sont parallèles. Une droite parallèle à une droite d’un plan est parallèle à ce plan. Si deux plans parallèles sont coupés par un troisième, les droites d’intersection sont parallèles : on s’en sert pour construire des sections.</p></div>"
 +"<div class='tcard'><b class='h'>Perspective cavalière</b><p>On dessine en vraie grandeur les faces de face ; la profondeur est tracée en oblique avec un coefficient (souvent 1/2), arêtes cachées en pointillés. <b>Conservés</b> : parallélisme, rapports de longueurs sur une même droite (donc les milieux), alignement. <b>Non conservés</b> : angles (hors faces de face), longueurs en profondeur.</p></div>"
 +"<div class='tcard'><b class='h'>Sections planes</b><p>Méthode : relier deux points du plan situés sur une même face ; sur deux faces parallèles, les côtés sont parallèles. Un cube a 6 faces : sa section est un polygone d’au plus <b>6 côtés</b> (triangle, quadrilatère, pentagone, hexagone).</p><p>Cube d’arête a : le plan (ACG) donne le rectangle ACGE de côtés a et a√2 (a = 4 : aire 16√2 ≈ 22,63 cm²). Le plan (BDE) donne un triangle équilatéral de côté a√2, d’aire a²√3/2 (a = 6 : 18√3 ≈ 31,18 cm²), qui isole un coin de volume a³/6.</p></div>"
 +"<div class='tcard'><b class='h'>Volumes et sections parallèles</b><p>Pyramide : V = (aire de la base × hauteur)/3 ; carré de 6 cm et hauteur 9 cm : V = 108 cm³. Formule d’Euler : S − A + F = 2 (5 − 8 + 5). Un plan parallèle à la base découpe une section homothétique de rapport k : longueurs × k, aires × k², volumes × k³. Pyramide de base 12 cm et hauteur 18 cm coupée à 6 cm de la base : rapport 12/18 = 2/3, section de côté 8 cm, petite pyramide 256 cm³, tronc 864 − 256 = 608 cm³. (6 h : orthogonalité, plan médiateur.)</p></div>"
});

SFA.figs("c09", [
 /* 0 positions relatives */
 function (p) {
  var g=m9_geom(),P=g.P,V=M9_V;m9_cube(P,true);
  m9_seg(P,V.A,V.B,BLUE,4);m9_seg(P,V.E,V.F,BLUE,4);m9_seg(P,V.A,V.D,GREEN,4);m9_seg(P,V.C,V.G,ORA2,4);
  var tx=W*.56,q=m5_fd(p,0,.5);m5_cap('Droites d’un cube',INK);
  TB('(a) (AB) et (EF)',tx,H*.3,BLUE_D,15,'left');TB('(b) (AB) et (AD)',tx,H*.5,DGREEN,15,'left');TB('(c) (AB) et (CG)',tx,H*.7,'#c8541f',15,'left');
  if(q>0){ctx.globalAlpha=q;TB('parallèles',tx+10,H*.3+22,BLUE_D,15,'left');TB('sécantes en A',tx+10,H*.5+22,DGREEN,15,'left');TB('gauches',tx+10,H*.7+22,'#c8541f',15,'left');ctx.globalAlpha=1;}
 },
 /* 1 pyramide */
 function (p) {
  m5_cap('base carrée de 6 cm, hauteur 9 cm',BLUE_D);var s=Math.min(W*.4,H*.5)/1.3,P=m9_P(W*.08,H*.86,s),h=1.2;
  var A=P(0,0,0),B=P(1,0,0),C=P(1,1,0),D=P(0,1,0),S=P(.5,.5,h),Ct=P(.5,.5,0);
  LN(D.x,D.y,A.x,A.y,'#aab0b6',1.5,[5,4]);LN(D.x,D.y,C.x,C.y,'#aab0b6',1.5,[5,4]);LN(D.x,D.y,S.x,S.y,'#aab0b6',1.5,[5,4]);
  m9_poly([A,B,S],BLUE+'18',BLUE,2.2);m9_poly([B,C,S],BLUE+'10',BLUE,2.2);LN(A.x,A.y,B.x,B.y,INK,2.4);LN(B.x,B.y,C.x,C.y,INK,2.4);
  LN(Ct.x,Ct.y,S.x,S.y,ORA2,2,[4,3]);TB('S',S.x,S.y-9,INK,14);TB('9 cm',(Ct.x+S.x)/2+6,(Ct.y+S.y)/2,'#c8541f',13,'left');TB('6 cm',(A.x+B.x)/2,A.y+17,DGREEN,13);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;var tx=W*.58;TB('V = (6 × 6 × 9)/3',tx,H*.36,BLUE_D,15,'left');TB('= 108 cm³',tx,H*.5,DRED,20,'left');TB('S = 5 ; A = 8 ; F = 5',tx,H*.68,DGREEN,14,'left');TB('5 − 8 + 5 = 2',tx,H*.8,DGREEN,16,'left');ctx.globalAlpha=1;}
 },
 /* 2 sans point commun */
 function (p) {
  var q=m5_fd(p,0,.5);m5_cap('deux droites sans point commun',INK);
  [[0,'parallèles',['A','B'],['H','G']],[1,'gauches',['A','B'],['C','G']]].forEach(function(S){m5_pane(S[0],2,function(){var s=Math.min(W*.5,H*.62)/1.45,P=m9_P(W*.14,H*.9,s),V=M9_V;m9_cube(P,12);m9_seg(P,V[S[2][0]],V[S[2][1]],BLUE,4.5);m9_seg(P,V[S[3][0]],V[S[3][1]],ORA2,4.5);
    if(q>0){ctx.globalAlpha=q;TB(S[1],W*.5,H*.18+18,S[0]?DRED:DGREEN,17);ctx.globalAlpha=1;}});});
 },
 /* 3 plan ACG */
 function (p) {
  var g=m9_geom(),P=g.P,V=M9_V;m9_cube(P,true);var q=m5_fd(p,0,.5);m5_cap('section du cube (arête 4 cm) par (ACG)',BLUE_D);
  m9_poly([V.A,V.C,V.G,V.E].map(function(k){return P(k[0],k[1],k[2]);}),ORA2+(q>0?'66':'22'),ORA2,2.8);
  var tx=W*.56;TB('plan (ACG)',tx,H*.32,INK,15,'left');if(q>0){ctx.globalAlpha=q;TB('rectangle ACGE',tx,H*.46,DRED,17,'left');TB('4 × 4√2 = 16√2',tx,H*.62,DRED,16,'left');TB('≈ 22,63 cm²',tx,H*.76,DGREEN,19,'left');ctx.globalAlpha=1;}
 },
 /* 4 coin coupé */
 function (p) {
  var g=m9_geom(),P=g.P,V=M9_V;m9_cube(P,true);var q=m5_fd(p,0,.5);m5_cap('cube d’arête 6 cm, plan (BDE)',BLUE_D);
  m9_poly([V.B,V.D,V.E].map(function(k){return P(k[0],k[1],k[2]);}),ORA2+(q>0?'77':'22'),ORA2,2.8);m9_seg(P,V.A,V.B,BLUE,3.4);m9_seg(P,V.A,V.E,BLUE,3.4);m9_seg(P,V.A,V.D,BLUE,3.4,[5,3]);
  var tx=W*.56;TB('(a) triangle BDE',tx,H*.3,INK,15,'left');if(q>0){ctx.globalAlpha=q;TB('équilatéral, côté 6√2',tx,H*.42,DRED,15,'left');TB('(b) aire 18√3 ≈ 31,18 cm²',tx,H*.56,DRED,15,'left');TB('(c) V(ABDE) = 36 cm³',tx,H*.72,DGREEN,15,'left');TB('= 1/6 du cube',tx,H*.85,DGREEN,15,'left');ctx.globalAlpha=1;}
 },
 /* 5 perspective cavalière */
 function (p) {
  var s=Math.min(W*.4,H*.5)/1.3,P=m9_P(W*.1,H*.84,s),V=M9_V,q=m5_fd(p,0,.5);m5_cap('perspective cavalière',BLUE_D);
  m9_cube(P,12,BLUE_D);ctx.fillStyle=GREEN+'22';var f=[V.A,V.B,V.F,V.E].map(function(k){return P(k[0],k[1],k[2]);});m9_poly(f,GREEN+'22',null);
  var M=P(0,.5,0);DOT(M.x,M.y,5,ORA2);TB('milieu',M.x-12,M.y+18,'#c8541f',12,'right');
  var tx=W*.57;TB('face de face : vraie grandeur',tx,H*.3,DGREEN,14,'left');TB('profondeur : × 1/2, à 30°',tx,H*.42,'#c8541f',14,'left');
  if(q>0){ctx.globalAlpha=q;TB('conservés :',tx,H*.6,DRED,15,'left');TB('parallélisme, milieux',tx,H*.72,DRED,14,'left');TB('perdus : angles, profondeurs',tx,H*.86,GREY,14,'left');ctx.globalAlpha=1;}
 },
 /* 6 hexagone régulier */
 function (p) {
  var g=m9_geom(),P=g.P,V=M9_V;m9_cube(P,true);var q=m5_fd(p,0,.5);m5_cap('plan (IJK) : I, J, K milieux',BLUE_D);
  var I=[.5,0,0],J=[1,.5,0],K=[1,1,.5],hex=m9_sect([1,-1,1],.5);m9_fillSect(P,hex,ORA2+(q>0?'66':'22'),ORA2);
  m9_dot(P,I,RED,5,'I',-4,18);m9_dot(P,J,RED,5,'J',12,6);m9_dot(P,K,RED,5,'K',12,4);
  var tx=W*.58;if(q>0){ctx.globalAlpha=q;TB('hexagone régulier',tx,H*.34,DRED,17,'left');TB('côté √2/2',tx,H*.5,INK,16,'left');TB('aire 3√3/4 ≈ 1,30',tx,H*.66,DGREEN,17,'left');ctx.globalAlpha=1;}
  else TB('quelle section ?',tx,H*.45,GREY,17,'left');
 },
 /* 7 nombre max de côtés */
 function (p) {
  var q=m5_fd(p,0,.5);m5_cap('sections d’un cube par un plan',INK);
  var pl=[[[1,1,1],.6,'3 côtés'],[[1,1,0],1,'4 côtés'],[[1,.6,.35],.9,'5 côtés ?'],[[1,-1,1],.5,'6 côtés']];
  pl.forEach(function(S,i){m5_pane(i,4,function(){var s=Math.min(W*.62,H*.5)/1.45,P=m9_P(W*.1,H*.78,s);m9_cube(P,false,GREY);var pts=m9_sect(S[0],S[1]);m9_fillSect(P,pts,(i===3?RED:ORA2)+'66',i===3?RED:ORA2);
    TB(pts.length+' côtés',W*.5,H*.9,i===3?DRED:INK,16);});});
 },
 /* 8 tronc de pyramide */
 function (p) {
  m5_cap('pyramide de base 12 cm, hauteur 18 cm',BLUE_D);var s=Math.min(W*.38,H*.42)/1.3,P=m9_P(W*.08,H*.86,s),h=1.5,k=2/3;
  var A=P(0,0,0),B=P(1,0,0),C=P(1,1,0),D=P(0,1,0),S=P(.5,.5,h);
  LN(D.x,D.y,A.x,A.y,'#aab0b6',1.5,[5,4]);LN(D.x,D.y,C.x,C.y,'#aab0b6',1.5,[5,4]);LN(D.x,D.y,S.x,S.y,'#aab0b6',1.5,[5,4]);
  m9_poly([A,B,S],BLUE+'14',BLUE,2.2);m9_poly([B,C,S],BLUE+'10',BLUE,2.2);LN(A.x,A.y,B.x,B.y,INK,2.4);LN(B.x,B.y,C.x,C.y,INK,2.4);
  var z=h/3,m=1-z/h;var a2=P(.5-m/2,.5-m/2,z),b2=P(.5+m/2,.5-m/2,z),c2=P(.5+m/2,.5+m/2,z),d2=P(.5-m/2,.5+m/2,z);
  var q=m5_fd(p,0,.5);m9_poly([a2,b2,c2,d2],ORA2+(q>0?'77':'33'),ORA2,2.6);
  TB('12 cm',(A.x+B.x)/2,A.y+17,DGREEN,13);
  var tx=W*.6;TB('section parallèle à la base',tx,H*.28,'#c8541f',13,'left');
  if(q>0){ctx.globalAlpha=q;TB('carré de côté 8 cm',tx,H*.42,DRED,16,'left');TB('V pyramide = 864 cm³',tx,H*.58,BLUE_D,14,'left');TB('V petite = 256 cm³',tx,H*.7,DRED,14,'left');TB('V tronc = 608 cm³',tx,H*.82,DGREEN,16,'left');ctx.globalAlpha=1;}
 },
 /* 9 distance sommet-plan */
 function (p) {
  var g=m9_geom(),P=g.P,V=M9_V;m9_cube(P,true);m5_cap('distance de A au plan (BDE), arête 1',BLUE_D);var q=m5_fd(p,0,.5);
  m9_poly([V.B,V.D,V.E].map(function(k){return P(k[0],k[1],k[2]);}),ORA2+'55',ORA2,2.6);m9_seg(P,V.A,V.B,BLUE,3.2);m9_seg(P,V.A,V.E,BLUE,3.2);m9_seg(P,V.A,V.D,BLUE,3.2,[5,3]);
  if(q>0){ctx.globalAlpha=q;m9_seg(P,[0,0,0],[1/3,1/3,1/3],RED,3.4);m9_dot(P,[1/3,1/3,1/3],RED,5.5,'H',10,-6);m9_seg(P,[1/3,1/3,1/3],[1,1,1],'#e8b4b3',1.5,[4,4]);ctx.globalAlpha=1;
   var tx=W*.58;TB('AH ⟂ plan (BDE)',tx,H*.36,INK,15,'left');TB('V(ABDE) = 1/6',tx,H*.5,BLUE_D,15,'left');TB('d = 1/√3 = √3/3',tx,H*.66,DRED,19,'left');TB('≈ 0,577',tx,H*.8,DGREEN,17,'left');}
 }
]);
