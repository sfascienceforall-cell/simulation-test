/* Chimie 5e · chapitre 7 : théorie animée et devantures */
var k7_S=null;
function k7_rand(){k7_S.s=(k7_S.s*1664525+1013904223)%4294967296;return k7_S.s/4294967296;}
function k7_init(speed){k7_S={s:12345,last:0,n:0,P:[],speed:speed};for(var i=0;i<26;i++){var a=k7_rand()*2*PI;k7_S.P.push({x:.05+.9*k7_rand(),y:.05+.9*k7_rand(),vx:Math.cos(a),vy:Math.sin(a),k:i%2,done:false,fl:0});}}
/* profil énergétique : réactifs à la hauteur 0, sommet Ea, produits ΔH ; E en kJ/mol sur une échelle Emax */
function k5_prof(x0,x1,Y,Ea,dH,col,lw,dash){ctx.strokeStyle=col;ctx.lineWidth=lw||3;if(dash)ctx.setLineDash(dash);ctx.beginPath();var xm=(x0+x1)/2;
 ctx.moveTo(x0,Y(0));ctx.lineTo(x0+(x1-x0)*.2,Y(0));ctx.bezierCurveTo(x0+(x1-x0)*.36,Y(0),x0+(x1-x0)*.36,Y(Ea),xm,Y(Ea));ctx.bezierCurveTo(x1-(x1-x0)*.36,Y(Ea),x1-(x1-x0)*.36,Y(dH),x1-(x1-x0)*.2,Y(dH));ctx.lineTo(x1,Y(dH));ctx.stroke();ctx.setLineDash([]);}

SFA.theo("c07", {
 icon: function () {
  TB('v = Δ[A] / Δt',W*.5,H*.34,BLUE_D,28);
  var Y=function(E){return H*.86-E*H*.34/100;};k5_prof(W*.2,W*.8,Y,100,-20,ORANGE,3.4);k5_prof(W*.2,W*.8,Y,55,-20,GREEN,3,[5,4]);TB('catalyseur',W*.5,H*.97,DGREEN,14);},
 anim: function (t) {
  var ph=Math.floor(t/480)%2,tl=t%480;
  if(!k7_S||t<k7_S.last||k7_S.speed!==ph){k7_init(ph);}
  var S=k7_S,bx=W*.04,by=H*.14,bw=W*.5,bh=H*.68,sp=(ph?3.2:1.2)*.004,sub=Math.max(0,Math.floor(t-S.last)),i,j;
  S.last=t;if(sub>4)sub=4;
  for(var st=0;st<sub;st++){S.P.forEach(function(q){q.x+=q.vx*sp*(bh/bw*1.0);q.y+=q.vy*sp;if(q.x<0||q.x>1)q.vx*=-1;if(q.y<0||q.y>1)q.vy*=-1;q.x=Math.max(0,Math.min(1,q.x));q.y=Math.max(0,Math.min(1,q.y));if(q.fl>0)q.fl--;});
   for(i=0;i<S.P.length;i++)for(j=i+1;j<S.P.length;j++){var a=S.P[i],b=S.P[j];if(a.done||b.done||a.k===b.k)continue;var dx=(a.x-b.x)*bw,dy=(a.y-b.y)*bh;if(dx*dx+dy*dy<110){var rel=Math.hypot(a.vx-b.vx,a.vy-b.vy)*(ph?3.2:1.2);if(rel>2.5){a.done=b.done=true;a.fl=b.fl=18;S.n++;}}}}
  k5_rr(bx,by,bw,bh,'#fafbfc',INK,2.2,6);
  S.P.forEach(function(q){var x=bx+q.x*bw,y=by+q.y*bh;if(q.fl>0)DOT(x,y,13,'rgba(255,215,90,.6)');DOT(x,y,6,q.done?GREEN:(q.k?ORANGE:BLUE));});
  TB(ph?'T élevée : chocs rapides':'T basse : chocs lents',bx+bw/2,by-8,ph?DRED:BLUE_D,Math.min(15,W*.024));
  TB('chocs efficaces : '+S.n,bx+bw/2,by+bh+22,DGREEN,15);
  /* profil */
  var px0=W*.6,px1=W*.96,Y=function(E){return H*.78-E*H*.5/100;};
  LN(px0-6,H*.14,px0-6,H*.82,AX,1.5);TB('énergie',px0,H*.12,GREY,12,'left');
  k5_prof(px0,px1,Y,80,-20,ORANGE,3.4);TB('Eₐ',(px0+px1)/2,Y(80)-8,DRED,15);
  var u=(t%240)/240,bxp=px0+(px1-px0)*u;var yy=u<.2?Y(0):u>.8?Y(-20):null;
  if(yy===null){var s=u<.5?(u-.2)/.3:(u-.5)/.3;var e=u<.5?80*k5_ez(s)*1:80-100*k5_ez(s);yy=Y(e);}
  DOT(bxp,yy-8,6,ph?DRED:BLUE);
  TB('seuls les chocs d\'énergie ≥ Eₐ',W*.78,H*.94,GREY,Math.min(12,W*.019));
 },
 th: '<div class="tcard"><b class="h">Vitesse d\'une réaction</b><p>La <b>vitesse moyenne de disparition</b> d\'un réactif A est v = −Δ[A]/Δt (mol/(L·s)) ; pour un produit, v = +Δ[P]/Δt. Sur une courbe [A](t), c\'est (l\'opposé de) la pente : elle est maximale au début, puis diminue car les réactifs se raréfient.</p><p><i>Exemple :</i> 2 H₂O₂ → 2 H₂O + O₂, [H₂O₂] passe de 0,80 à 0,60 mol/L en 40 s : v = 0,20/40 = 5,0·10⁻³ mol/(L·s). Autre exemple : [A] = 1,00 ; 0,67 ; 0,45 ; 0,30 mol/L à 0, 10, 20, 30 s : v = 0,033 ; 0,022 ; 0,015 mol/(L·s) sur chaque intervalle de 10 s.</p></div><div class="tcard"><b class="h">Théorie des collisions et facteurs cinétiques</b><p>Pour réagir, deux particules doivent se <b>rencontrer</b> avec une <b>énergie suffisante</b> (≥ énergie d\'activation E<sub>a</sub>) et une bonne orientation : ce sont les chocs efficaces. Plus ils sont nombreux, plus la réaction est rapide.</p><ul><li><b>Concentration</b> ↑ : plus de chocs par seconde ;</li><li><b>Température</b> ↑ : chocs plus violents, donc beaucoup plus de chocs d\'énergie ≥ E<sub>a</sub> ;</li><li><b>Surface de contact</b> ↑ (solide divisé) : plus de particules exposées ;</li><li><b>Catalyseur</b> : chemin avec une E<sub>a</sub> plus basse.</li></ul><p>Règle des 10 degrés : la vitesse double environ tous les 10 K. Réaction de 80 s à 20 °C : 10 s à 50 °C (3 doublements), 320 s à 0 °C. Surface : un cube de 2,0 cm (24 cm²) coupé en cubes de 1 mm (480 cm²) offre 20 fois plus de surface : dissolution en ≈ 5 s au lieu de 100 s.</p></div><div class="tcard"><b class="h">Profil énergétique et catalyseur</b><p>Le profil montre l\'énergie des réactifs, le <b>sommet de la barrière</b> (E<sub>a</sub> au-dessus des réactifs) et celle des produits (ΔH). Un <b>catalyseur</b> offre un chemin à E<sub>a</sub> plus basse pour les <b>deux sens</b> : il accélère la réaction directe et inverse, est retrouvé intact et ne figure pas dans le bilan. Il ne change <b>ni ΔH, ni K, ni la composition finale</b> : seulement le temps pour l\'atteindre.</p><p><i>Exemple :</i> E<sub>a</sub> directe 90 kJ/mol, ΔH = −30 kJ/mol : E<sub>a</sub> inverse = 90 + 30 = 120 kJ/mol. Avec catalyseur (60 kJ/mol) : 60 + 30 = 90 kJ/mol ; les deux vitesses sont multipliées par ≈ 3·10⁴ à 350 K.</p></div><div class="tcard"><b class="h">Quantifier l\'effet de T et de E<sub>a</sub></b><p>La constante de vitesse suit <b>k ∝ e<sup>−E<sub>a</sub>/RT</sub></b> (R = 8,31 J/(mol·K), T en K). Pour E<sub>a</sub> = 60 kJ/mol, de 300 à 310 K, k est multiplié par e<sup>0,78</sup> ≈ 2,2. Un catalyseur qui ramène E<sub>a</sub> de 60 à 40 kJ/mol multiplie k par e<sup>20 000/(8,31 × 300)</sup> ≈ 3·10³ à 300 K.</p><p>Pour une loi v = k[A][B] (ordre 1 en chaque réactif), doubler [I⁻] double v : le délai d\'une horloge à iode est divisé par 2 (40 s → 20 s) ; à 45 °C au lieu de 25 °C (v × 4) : 10 s.</p><p><b>Piège :</b> une réaction très exothermique (papier qui brûle) n\'est pas pour autant rapide : ΔH (thermodynamique) et vitesse (cinétique, E<sub>a</sub>) sont indépendants.</p></div>'
});

SFA.figs("c07", [
 /* 0 · vitesse moyenne de disparition */
 function (p) {
  var k=k5_seg(p,0,.7),gx=W*.14,gw=W*.78,gy=H*.1,gh=H*.68;
  var Y=function(c){return gy+gh-(c/.9)*gh;},X=function(t){return gx+t/60*gw;};
  LN(gx,gy,gx,gy+gh,AX,1.6);LN(gx,gy+gh,gx+gw,gy+gh,AX,1.6);TB('[H₂O₂] (mol/L)',gx+4,gy-2,GREY,12,'left');TB('t (s)',gx+gw,gy+gh+16,GREY,12,'right');
  [0,.2,.4,.6,.8].forEach(function(v){LN(gx-4,Y(v),gx,Y(v),GREY,1);TB(k5_tf(v,1),gx-7,Y(v)+4,GREY,11,'right');});
  [0,20,40,60].forEach(function(v){LN(X(v),gy+gh,X(v),gy+gh+4,GREY,1);TB(String(v),X(v),gy+gh+16,GREY,11);});
  var kk=Math.log(.8/.6)/40;ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();for(var t=0;t<=60;t+=1){t?ctx.lineTo(X(t),Y(.8*Math.exp(-kk*t))):ctx.moveTo(X(t),Y(.8));}ctx.stroke();
  DOT(X(0),Y(.8),5,RED);DOT(X(40),Y(.6),5,RED);tag('0,80',X(0)+30,Y(.8)-10,DRED,13);tag('0,60',X(40)+30,Y(.6)-12,DRED,13);
  if(p>0){ctx.globalAlpha=k;LN(X(0),Y(.8),X(40),Y(.6),RED,2.4,[6,4]);LN(X(0),Y(.8),X(40),Y(.8),GREY,1.4,[3,3]);LN(X(40),Y(.8),X(40),Y(.6),GREY,1.4,[3,3]);
   tag('Δt = 40 s',X(20),Y(.8)-12,INK,13);tag('Δc = −0,20',X(40)+44,Y(.7),INK,13);tag('v = 0,20 / 40 = 5,0·10⁻³ mol/(L·s)',X(36),Y(.28),DGREEN,15);ctx.globalAlpha=1;}
  else tag('v moyenne entre 0 et 40 s ?',X(38),Y(.3),GREY,14);
 },
 /* 1 · quel facteur */
 function (p) {
  var bw=W*.22,gx=W*.03,x0=W*.04,y=H*.1,h=H*.6,names=['surface de contact','température','concentration','catalyseur'];
  for(var i=0;i<4;i++){var x=x0+i*(bw+gx),cx=x+bw/2;k5_rr(x,y,bw,h,'#f6f8fb',p>0?GREEN:GREY,2);
   if(i===0){ctx.fillStyle='#e4e8ee';ctx.fillRect(cx-34,y+30,22,22);ctx.strokeStyle=GREY;ctx.strokeRect(cx-34,y+30,22,22);for(var a=0;a<12;a++)DOT(cx+4+(a%4)*8,y+30+Math.floor(a/4)*8+3,2.4,GREY);TB('sucre',cx,y+84,INK,13);}
   if(i===1){k5_thermo(cx,y+h*.62,h*.42,5,0,100,false);TB('frigo',cx,y+h*.78,INK,13);}
   if(i===2){for(var a=0;a<14;a++)DOT(x+14+(a*37%(bw-28)),y+26+(a*53%60),3.4,a%2?BLUE:ORANGE);TB('+ de O₂',cx,y+h*.78,INK,13);}
   if(i===3){var Y=function(E){return y+h*.62-E*h*.0045;};k5_prof(x+8,x+bw-8,Y,100,-20,GREY,2.4);k5_prof(x+8,x+bw-8,Y,50,-20,GREEN,2.4,[4,3]);TB('MnO₂',cx,y+h*.78,INK,13);}
   if(p>0){ctx.globalAlpha=k5_seg(p,i*.15,i*.15+.3);TB(names[i],cx,H*.82,DGREEN,12);TB('('+'abcd'[i]+')',cx,H*.93,GREY,13);ctx.globalAlpha=1;}
   else TB('('+'abcd'[i]+')',cx,H*.82,GREY,13);}
  if(p<=0)TB('quel facteur cinétique ?',W*.5,H*.95,GREY,14);
 },
 /* 2 · règle des 10 degrés */
 function (p) {
  var k=k5_seg(p,0,.8),x0=W*.2,sc=W*.72/320,rows=[['0 °C',320,BLUE],['20 °C',80,GREEN],['50 °C',10,RED]];
  TB('durée de la réaction',W*.5,H*.1,BLUE_D,15);
  rows.forEach(function(r,i){var y=H*.22+i*H*.22,w=r[1]*sc*(p>0||i===1?(i===1?1:k):0);
   TB(r[0],x0-10,y+22,INK,15,'right');
   ctx.fillStyle=r[2]+'55';ctx.fillRect(x0,y,Math.max(w,2),30);ctx.strokeStyle=r[2];ctx.lineWidth=2;ctx.strokeRect(x0,y,Math.max(w,2),30);
   if(i===1)TB('80 s',x0+w+8,y+21,INK,15,'left');
   else if(p>0&&k>.7)TB(r[1]+' s',x0+w+8,y+21,r[2]===RED?DRED:BLUE_D,15,'left');
   else TB('?',x0+12,y+22,GREY,18,'left');});
  TB(p>0?'× 2 tous les 10 K : 3 doublements → 80 / 8 = 10 s':'vitesse × 2 pour + 10 K',W*.5,H*.92,p>0?DGREEN:GREY,14);
 },
 /* 3 · catalyseur */
 function (p) {
  var k=k5_seg(p,0,.7),x0=W*.1,x1=W*.9,Y=function(E){return H*.8-E*H*.0058;};
  LN(x0-6,H*.1,x0-6,H*.84,AX,1.5);TB('énergie',x0,H*.08,GREY,12,'left');TB('avancement',x1,H*.93,GREY,12,'right');
  k5_prof(x0,x1,Y,100,-30,ORANGE,3.4);TB('sans catalyseur',x1-6,Y(100)-8,DRED,13,'right');
  TB('réactifs',x0+W*.06,Y(0)+18,INK,13);TB('produits',x1-W*.06,Y(-30)+18,INK,13);
  if(p>0){ctx.globalAlpha=k;k5_prof(x0,x1,Y,55,-30,GREEN,3.4,[7,5]);tag('Eₐ plus basse',W*.5,Y(55)-14,DGREEN,14);TB('ΔH identique',x1-W*.06,Y(-30)-12,INK,13);
   TB('retrouvé intact, accélère les deux sens',W*.5,H*.97,DGREEN,13);ctx.globalAlpha=1;}
  else TB('que fait un catalyseur ?',W*.5,H*.45,GREY,16);
 },
 /* 4 · couper un cube */
 function (p) {
  var k=k5_seg(p,0,.8),xs=[W*.17,W*.5,W*.83],sz=[70,70,70],y=H*.3,data=[['24 cm²','100 s'],['48 cm²','50 s'],['480 cm²','≈ 5 s']];
  for(var i=0;i<3;i++){var x=xs[i];var n=[1,2,10][i],c=sz[i]/n;
   for(var a=0;a<n;a++)for(var b=0;b<n;b++){ctx.fillStyle=i===2?'#dde5ee':'#eaf0f7';ctx.fillRect(x-35+a*c+(i?.6:0),y-35+b*c+(i?.6:0),c-(i?1.2:0),c-(i?1.2:0));if(i<2){ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.strokeRect(x-35+a*c,y-35+b*c,c,c);}}
   if(i===2){ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.strokeRect(x-35,y-35,70,70);}
   TB(['1 cube de 2 cm','8 cubes de 1 cm','cubes de 1 mm'][i],x,y+58,INK,13);
   if(p>0){ctx.globalAlpha=k5_seg(p,i*.2,i*.2+.3);TB('S = '+data[i][0],x,y+82,DRED,15);TB('dissolution : '+data[i][1],x,y+102,DGREEN,13);ctx.globalAlpha=1;}
   else TB('S = ?',x,y+82,GREY,16);
   if(i<2)A(x+48,y,W*.16-24,0,GREY,'',2);}
  TB('surface totale et vitesse de dissolution',W*.5,H*.1,BLUE_D,15);
  if(p>.8){ctx.globalAlpha=k5_seg(p,.8,1);TB('S × 20  →  durée ÷ 20',W*.5,H*.93,DGREEN,16);ctx.globalAlpha=1;}
 },
 /* 5 · lire une courbe de concentration */
 function (p) {
  var k=k5_seg(p,0,.8),gx=W*.12,gw=W*.82,gy=H*.1,gh=H*.68;
  var Y=function(c){return gy+gh-c*gh/1.1;},X=function(t){return gx+t/36*gw;};
  LN(gx,gy,gx,gy+gh,AX,1.6);LN(gx,gy+gh,gx+gw,gy+gh,AX,1.6);TB('[A] (mol/L)',gx+4,gy-2,GREY,12,'left');TB('t (s)',gx+gw,gy+gh+16,GREY,12,'right');
  var d=[[0,1],[10,.67],[20,.45],[30,.30]];
  [0,.5,1].forEach(function(v){LN(gx-4,Y(v),gx,Y(v),GREY,1);TB(k5_tf(v,1),gx-7,Y(v)+4,GREY,11,'right');});
  d.forEach(function(q){LN(X(q[0]),gy+gh,X(q[0]),gy+gh+4,GREY,1);TB(String(q[0]),X(q[0]),gy+gh+16,GREY,11);});
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();for(var t=0;t<=30;t+=.5){var c=1*Math.pow(.3,t/30)*(1);t?ctx.lineTo(X(t),Y(c)):ctx.moveTo(X(t),Y(1));}ctx.stroke();
  d.forEach(function(q){DOT(X(q[0]),Y(q[1]),5,RED);});
  if(p>0){var cols=[RED,ORANGE,GREEN],v=['0,033','0,022','0,015'];for(var i=0;i<3;i++){ctx.globalAlpha=k5_seg(p,i*.22,i*.22+.3);LN(X(d[i][0]),Y(d[i][1]),X(d[i+1][0]),Y(d[i+1][1]),cols[i],3.4);tag('v = '+v[i],(X(d[i][0])+X(d[i+1][0]))/2+30,(Y(d[i][1])+Y(d[i+1][1]))/2-18,dk(cols[i]),13);ctx.globalAlpha=1;}
   ctx.globalAlpha=k5_seg(p,.7,1);tag('pente la plus raide au début',X(22),Y(.95),DGREEN,14);ctx.globalAlpha=1;}
  else tag('où la vitesse est-elle maximale ?',X(21),Y(.92),GREY,14);
 },
 /* 6 · Eₐ et température */
 function (p) {
  var k=k5_seg(p,0,.8),gx=W*.08,gw=W*.86,gy=H*.1,gh=H*.66,x1=gx+gw;
  var X=function(E){return gx+E/10*gw;},f=function(E,kT){return E*Math.exp(-E/kT);};
  LN(gx,gy+gh,x1,gy+gh,AX,1.6);LN(gx,gy,gx,gy+gh,AX,1.6);TB('nombre de molécules',gx+4,gy-2,GREY,12,'left');TB('énergie',x1,gy+gh+16,GREY,12,'right');
  var Ea=6,fy=function(E,kT){return gy+gh-f(E,kT)/(1.0*.9)*gh*.9;};
  var m1=f(1.3,1.3),m2=f(1.35,1.35);
  var curve=function(kT,col,fill){ctx.beginPath();for(var E=0;E<=10;E+=.1){var y=gy+gh-f(E,kT)/m2*gh*.8;E?ctx.lineTo(X(E),y):ctx.moveTo(X(E),y);}ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();
   if(fill){ctx.lineTo(X(10),gy+gh);ctx.lineTo(X(Ea),gy+gh);ctx.closePath();}};
  /* aire sous la queue */
  var tail=function(kT,col){ctx.beginPath();ctx.moveTo(X(Ea),gy+gh);for(var E=Ea;E<=10;E+=.1)ctx.lineTo(X(E),gy+gh-f(E,kT)/m2*gh*.8);ctx.lineTo(X(10),gy+gh);ctx.closePath();ctx.fillStyle=col;ctx.fill();};
  if(p>0){ctx.globalAlpha=k;tail(1.0,'rgba(55,138,221,.35)');tail(1.15,'rgba(226,75,74,.35)');ctx.globalAlpha=1;}
  curve(1.0,BLUE,false);curve(1.15,RED,false);
  LN(X(Ea),gy+gh,X(Ea),gy+8,INK,2,[5,4]);TB('Eₐ',X(Ea),gy+2,INK,15);
  TB('300 K',X(2.6),gy+gh*.12,BLUE_D,14);TB('310 K',X(3.1),gy+gh*.36,DRED,14);
  if(p>0){ctx.globalAlpha=k;tag('k × 2,2 pour + 10 K',W*.72,H*.4,DRED,15);tag('catalyseur (40 kJ/mol) : × 3·10³',W*.62,H*.55,DGREEN,13);ctx.globalAlpha=1;}
  else tag('part des chocs d\'énergie ≥ Eₐ ?',W*.7,H*.4,GREY,14);
  TB('Eₐ = 60 kJ/mol',W*.5,H*.95,GREY,13);
 },
 /* 7 · papier exothermique mais lent */
 function (p) {
  var k=k5_seg(p,0,.8),x0=W*.08,x1=W*.62,Y=function(E){return H*.62-E*H*.0043;};
  LN(x0-6,H*.1,x0-6,H*.84,AX,1.5);TB('énergie',x0,H*.08,GREY,12,'left');
  k5_prof(x0,x1,Y,100,-90,ORANGE,3.4);TB('papier + O₂',x0+W*.06,Y(0)+18,INK,13);TB('CO₂ + H₂O',x1-W*.04,Y(-90)+18,INK,13);
  A(x1+10,Y(0),0,Y(-90)-Y(0),GREEN,'',3);TB('très exo',x1+18,Y(-40),DGREEN,13,'left');tag('barrière Eₐ élevée',(x0+x1)/2,Y(100)-14,DRED,13);
  /* feuille et allumette */
  var px=W*.78,py=H*.62;ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.fillRect(px-26,py-40,52,60);ctx.strokeRect(px-26,py-40,52,60);for(var i=0;i<4;i++)LN(px-18,py-26+i*12,px+18,py-26+i*12,AX,2);
  if(p>0){ctx.globalAlpha=k;ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(px,py-84);ctx.quadraticCurveTo(px+20,py-48,px,py-40);ctx.quadraticCurveTo(px-20,py-48,px,py-84);ctx.fill();
   LN(px-52,py-24,px-30,py-42,'#8a6a00',4);DOT(px-54,py-22,4,RED);TB('allumette : fournit Eₐ',W*.78,H*.88,DGREEN,12);ctx.globalAlpha=1;}
  else TB('à froid : rien ne se passe',W*.78,H*.88,GREY,12);
 },
 /* 8 · horloge à iode */
 function (p) {
  var k=k5_seg(p,0,.8),gx=W*.12,gw=W*.8,gy=H*.1,gh=H*.66;
  var Y=function(c){return gy+gh-c/1.2e-3*gh;},X=function(t){return gx+t/50*gw;};
  LN(gx,gy,gx,gy+gh,AX,1.6);LN(gx,gy+gh,gx+gw,gy+gh,AX,1.6);TB('[I₂] formé (10⁻³ mol/L)',gx+4,gy-2,GREY,12,'left');TB('t (s)',gx+gw,gy+gh+16,GREY,12,'right');
  [0,.5e-3,1e-3].forEach(function(v){LN(gx-4,Y(v),gx,Y(v),GREY,1);TB(k5_tf(v*1000,1),gx-7,Y(v)+4,GREY,11,'right');});
  [0,10,20,30,40,50].forEach(function(v){LN(X(v),gy+gh,X(v),gy+gh+4,GREY,1);TB(String(v),X(v),gy+gh+16,GREY,11);});
  LN(gx,Y(1e-3),gx+gw,Y(1e-3),BLUE,1.6,[5,4]);tag('1,0·10⁻³ : bleu (S₂O₃²⁻ épuisé)',X(30),Y(1e-3)-12,BLUE_D,13);
  var L=[[40,BLUE_D,'v = 2,5·10⁻⁵ → 40 s'],[20,GREEN,'[I⁻] × 2 → 20 s'],[10,RED,'45 °C → 10 s']];
  L.forEach(function(l,i){var ok=i===0||p>0,a=i===0?1:k5_seg(p,(i-1)*.35,(i-1)*.35+.4);if(!ok)return;ctx.globalAlpha=a;ctx.strokeStyle=l[1];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X(0),Y(0));ctx.lineTo(X(l[0]),Y(1e-3));ctx.stroke();DOT(X(l[0]),Y(1e-3),5,l[1]);
   tag(l[2],X(l[0])+(i?-6:70),Y(1e-3)+(i===0?64:i===1?36:14)+(i===2?10:0),dk(l[1]),12);ctx.globalAlpha=1;});
  if(p<=0)tag('délai avant le virage ?',X(34),Y(.3e-3),GREY,14);
 },
 /* 9 · catalyseur, deux sens */
 function (p) {
  var k=k5_seg(p,0,.7),x0=W*.1,x1=W*.88,Y=function(E){return H*.82-E*H*.0058-0;};
  LN(x0-6,H*.08,x0-6,H*.86,AX,1.5);TB('énergie (kJ/mol)',x0,H*.07,GREY,12,'left');
  k5_prof(x0,x1,Y,90,-30,ORANGE,3.4);TB('A',x0+W*.06,Y(0)+18,INK,14);TB('B',x1-W*.06,Y(-30)+18,INK,14);
  if(p>0){ctx.globalAlpha=k;k5_prof(x0,x1,Y,60,-30,GREEN,3.4,[7,5]);
   A(W*.3,Y(0),0,Y(90)-Y(0)+3,RED,'',2.6);tag('Eₐ = 90',W*.22,Y(45),DRED,13);
   A(W*.56,Y(60),0,Y(-30)-Y(60)-3,VIOLET,'',2.6);tag('Eₐ inv = 120',W*.7,Y(25),'#5249B5',13);
   tag('catalyseur : 60 et 90',W*.5,Y(60)-16,DGREEN,13);TB('× 3·10⁴ dans les deux sens · même équilibre',W*.5,H*.96,DGREEN,12);ctx.globalAlpha=1;}
  else{TB('Eₐ inverse ? effet du catalyseur ?',W*.5,H*.35,GREY,15);}
 }
]);
