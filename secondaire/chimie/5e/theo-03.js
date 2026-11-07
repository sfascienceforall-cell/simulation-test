/* Chimie 5e · chapitre 3 : théorie animée et devantures */
function k5_p3(x,y,z,az,el){var ca=Math.cos(az),sa=Math.sin(az),X=x*ca-y*sa,Y=x*sa+y*ca;return {x:X,y:z*Math.cos(el)+Y*Math.sin(el),d:Y};}
/* molécule en perspective : items = {v:[x,y,z], lab, col, r} (atome) ou {v, lp:true} (doublet non liant) */
function k5_mol3(cx,cy,s,az,el,cLab,cCol,items,showB){
 var L=items.map(function(it){return {it:it,q:k5_p3(it.v[0],it.v[1],it.v[2],az,el)};});
 L.push({c:true,q:{x:0,y:0,d:0}});L.sort(function(a,b){return a.q.d-b.q.d;});
 L.forEach(function(o){
  if(o.c){k5_at(cx,cy,15,cCol||BLUE,cLab,14);return;}
  var it=o.it,px=cx+o.q.x*s,py=cy-o.q.y*s;
  if(it.lp){var ang=Math.atan2(-(o.q.y),o.q.x),mx=cx+o.q.x*s*.55,my=cy-o.q.y*s*.55;
   ctx.save();ctx.translate(mx,my);ctx.rotate(ang);ctx.fillStyle='rgba(226,75,74,.16)';ctx.strokeStyle=RED;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(0,0,s*.34,s*.2,0,0,7);ctx.fill();ctx.stroke();ctx.restore();
   DOT(mx-4*Math.sin(ang),my+4*Math.cos(ang),3,RED);DOT(mx+4*Math.sin(ang),my-4*Math.cos(ang),3,RED);return;}
  if(showB!==false){var dx=px-cx,dy=py-cy,l=Math.hypot(dx,dy)||1;LN(cx+dx/l*14,cy+dy/l*14,px-dx/l*(it.r||12),py-dy/l*(it.r||12),INK,2.6);}
  k5_at(px,py,it.r||12,it.col||GREEN,it.lab||'',12);});
}
var K5_TET=[[0,0,1],[0,.943,-.333],[-.816,-.471,-.333],[.816,-.471,-.333]];
function k5_tri(i){var a=i*2*PI/3+PI/2;return [Math.cos(a),Math.sin(a),0];}

SFA.theo("c03", {
 icon: function () {
  var s=60,cx=W*.5,cy=H*.52;
  k5_mol3(cx,cy,s,.6,.35,'C',INK,[{v:K5_TET[0],lab:'H',col:BLUE,r:11},{v:K5_TET[1],lab:'H',col:BLUE,r:11},{v:K5_TET[2],lab:'H',col:BLUE,r:11},{v:K5_TET[3],lab:'H',col:BLUE,r:11}]);
  TB('VSEPR',W*.5,H*.1,BLUE_D,20);TB('109,5°',W*.82,H*.88,ORANGE,18);},
 anim: function (t) {
  var ph=Math.floor(t/220)%5,loc=(t%220)/220;
  var az=t*.012,el=ph===1?1.0:.4,s=Math.min(H*.34,95),cx=W*.3,cy=H*.52,it=[],ttl,ang,info;
  var H1=function(v,l,c){return {v:v,lab:l||'H',col:c||BLUE,r:11};},Lp=function(v){return {v:v,lp:true};};
  if(ph===0){it=[H1([1,0,0],'O',RED),H1([-1,0,0],'O',RED)];ttl='CO₂ : 2 doublets';ang='180° · linéaire';info='AX₂ : 2 liaisons, 0 doublet libre';}
  else if(ph===1){it=[0,1,2].map(function(i){return H1(k5_tri(i),'F',GREEN);});ttl='BF₃ : 3 doublets';ang='120° · triangulaire plane';info='AX₃ : 3 liaisons, 0 doublet libre';}
  else if(ph===2){it=K5_TET.map(function(v){return H1(v);});ttl='CH₄ : 4 doublets';ang='109,5° · tétraédrique';info='AX₄ : 4 liaisons, 0 doublet libre';}
  else if(ph===3){it=[Lp(K5_TET[0]),H1(K5_TET[1]),H1(K5_TET[2]),H1(K5_TET[3])];ttl='NH₃ : 4 doublets';ang='≈ 107° · pyramidale';info='AX₃E : 3 liaisons + 1 doublet libre';}
  else{it=[Lp(K5_TET[0]),Lp(K5_TET[1]),H1(K5_TET[2]),H1(K5_TET[3])];ttl='H₂O : 4 doublets';ang='≈ 104,5° · coudée';info='AX₂E₂ : 2 liaisons + 2 doublets libres';}
  ctx.globalAlpha=Math.min(1,loc*6,(1-loc)*6);
  k5_mol3(cx,cy,s,az,el,ph===0?'C':ph===1?'B':ph===2?'C':ph===3?'N':'O',BLUE,it);
  TB(ttl,W*.66,H*.26,BLUE_D,Math.min(22,W*.034));TB(ang,W*.66,H*.44,DRED,Math.min(20,W*.03));TB(info,W*.66,H*.6,INK,Math.min(15,W*.023));
  ctx.globalAlpha=1;
  TB('les doublets se repoussent : ils se placent le plus loin possible',W*.5,H*.94,GREY,14);
  for(var i=0;i<5;i++)DOT(W*.1+i*14,H*.08,4,i===ph?ORANGE:'#d7dbe0');},
 th: '<div class="tcard"><b class="h">La méthode VSEPR</b><p>Les doublets d\'électrons de la couche externe de l\'atome central (<b>doublets liants</b> et <b>doublets non liants</b>) se repoussent et se placent le plus loin possible les uns des autres. On compte donc les doublets autour de l\'atome central, puis on regarde seulement la position des <b>atomes</b> pour nommer la forme.</p><p>Nombre de doublets non liants : (électrons de valence − nombre de liaisons simples) / 2. Exemples : N dans NH₃ : (5 − 3)/2 = 1 ; O dans H₂O : (6 − 2)/2 = 2 ; Xe dans XeF₄ : (8 − 4)/2 = 2 ; S dans SF₄ : (6 − 4)/2 = 1.</p></div><div class="tcard"><b class="h">Les formes à retenir</b><ul><li>2 doublets (AX₂) : <b>linéaire</b>, 180° (CO₂) ;</li><li>3 doublets : AX₃ <b>triangulaire plane</b>, 120° (BF₃) ;</li><li>4 doublets : AX₄ <b>tétraédrique</b>, 109,5° (CH₄) ; AX₃E <b>pyramidale</b>, ≈ 107° (NH₃) ; AX₂E₂ <b>coudée</b>, ≈ 104,5° (H₂O) ;</li><li>5 doublets : AX₅ bipyramide trigonale ; AX₄E <b>en bascule</b> (SF₄) ;</li><li>6 doublets : AX₆ octaèdre ; AX₄E₂ <b>plane carrée</b> (XeF₄).</li></ul><p>Piège : un doublet non liant occupe de la place et comprime légèrement l\'angle : 109,5° → 107° → 104,5°. L\'eau n\'est pas linéaire parce que O porte 2 doublets non liants.</p></div><div class="tcard"><b class="h">Polarité d\'une molécule</b><p>Chaque liaison polaire a un <b>moment dipolaire</b> (un vecteur dirigé vers l\'atome le plus électronégatif). La molécule est <b>polaire</b> si la somme vectorielle des dipôles n\'est pas nulle, <b>apolaire</b> si elle est nulle (molécule symétrique).</p><ul><li>Apolaires malgré des liaisons polaires : CO₂, BF₃, CCl₄, XeF₄ ;</li><li>Polaires : H₂O, NH₃, CH₃Cl, SF₄.</li></ul><p>Pour AB₂ coudée avec deux dipôles μ et un angle θ : <b>R = 2μ·cos(θ/2)</b>. Avec μ = 1,2 : θ = 180° → 0 ; θ = 104,5° → 1,47 ; θ = 90° → 1,70.</p></div><div class="tcard"><b class="h">Les quatre types de solides</b><ul><li><b>Ionique</b> (NaCl) : dur, cassant, T de fusion élevée (801 °C), non conducteur solide, conducteur fondu ou dissous ;</li><li><b>Métallique</b> (Cu) : malléable, conducteur solide (électrons délocalisés) ;</li><li><b>Covalent réticulaire</b> (diamant, quartz) : très dur, T de fusion très élevée, non conducteur (sauf le graphite : 4ᵉ électron délocalisé dans le plan) ;</li><li><b>Moléculaire</b> (I₂, glace) : mou, T de fusion basse, non conducteur.</li></ul></div><div class="tcard"><b class="h">Exemple chiffré : un carat de carbone</b><p>0,200 g de C : n = 0,200/12 = 0,0167 mol, soit N = 0,0167 × 6,02·10²³ ≈ 1,00·10²² atomes. Volume du diamant : 0,200/3,51 ≈ 0,0570 cm³ ; du graphite : 0,200/2,26 ≈ 0,0885 cm³. Le graphite occupe ≈ 1,55 fois plus de place : ses atomes sont moins serrés (couches séparées).</p></div>'
});

SFA.figs("c03", [
 /* 0 · BF3 et CH4 */
 function (p) {
  var k=k5_seg(p,0,.7),s=Math.min(H*.3,70);
  k5_mol3(W*.26,H*.5,s,0,1.35,'B',VIOLET,[0,1,2].map(function(i){return {v:k5_tri(i),lab:'F',col:GREEN,r:11};}));
  k5_mol3(W*.74,H*.5,s,.5,.3,'C',INK,K5_TET.map(function(v){return {v:v,lab:'H',col:BLUE,r:10};}));
  TB('BF₃',W*.26,H*.12,BLUE_D,16);TB('CH₄',W*.74,H*.12,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;TB('120°',W*.26,H*.5+Math.min(H*.3,70)*.62,DRED,16);TB('triangulaire plane',W*.26,H*.9,DGREEN,14);TB('109,5°',W*.74,H*.9-16,DRED,16);TB('tétraédrique',W*.74,H*.9+3,DGREEN,14);ctx.globalAlpha=1;}
  else{TB('3 doublets',W*.26,H*.9,GREY,14);TB('4 doublets',W*.74,H*.9,GREY,14);}
 },
 /* 1 · eau coudée */
 function (p) {
  var k=k5_seg(p,0,.6),s=Math.min(H*.4,100),cx=W*.4,cy=H*.5;
  var it=[{v:K5_TET[2],lab:'H',col:BLUE,r:11},{v:K5_TET[3],lab:'H',col:BLUE,r:11}];
  if(p>0){it.push({v:K5_TET[0],lp:true});it.push({v:K5_TET[1],lp:true});}
  /* orientation : les deux H en bas, doublets en haut */
  var a=.0,e=.55;
  ctx.save();
  k5_mol3(cx,cy,s,.5,e,'O',RED,it);
  ctx.restore();
  TB('H₂O',W*.4,H*.1,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;TB('4 doublets autour de O',W*.78,H*.3,INK,14);TB('2 liants + 2 non liants',W*.78,H*.42,DRED,14);TB('≈ 104,5°',W*.78,H*.58,DGREEN,20);TB('forme coudée',W*.78,H*.72,DGREEN,16);ctx.globalAlpha=1;}
  else{TB('O : 6 e⁻ de valence',W*.78,H*.4,GREY,14);TB('2 liaisons O–H',W*.78,H*.52,GREY,14);}
 },
 /* 2 · NH3 */
 function (p) {
  var k=k5_seg(p,0,.6),s=Math.min(H*.38,95),cx=W*.4,cy=H*.54;
  var it=[1,2,3].map(function(i){return {v:K5_TET[i],lab:'H',col:BLUE,r:11};});
  it.push({v:K5_TET[0],lp:true});
  if(p<=0)it.pop();
  k5_mol3(cx,cy,s,.5,.4,'N',VIOLET,it);
  TB('NH₃ : quelle forme ?',W*.4,H*.1,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;TB('(5 − 3)/2 = 1 doublet libre',W*.8,H*.28,INK,13);TB('3 + 1 = 4 doublets',W*.8,H*.42,INK,14);TB('tétraèdre',W*.8,H*.56,GREY,15);TB('pyramidale',W*.8,H*.72,DGREEN,20);TB('H–N–H ≈ 107°',W*.8,H*.86,DRED,15);ctx.globalAlpha=1;}
  else{TB('3 liaisons N–H',W*.8,H*.45,GREY,14);}
 },
 /* 3 · CO2 / H2O dipôles */
 function (p) {
  var k=k5_seg(p,0,.6),y=H*.42;
  /* CO2 */
  var cx=W*.26;
  LN(cx-50,y,cx+50,y,INK,2.4);k5_at(cx,y,15,'#8a8f98','C',14);k5_at(cx-52,y,15,RED,'O',14);k5_at(cx+52,y,15,RED,'O',14);
  A(cx,y-30,-40,0,DRED,'',2.6);A(cx,y-30,40,0,DRED,'',2.6);
  TB('CO₂',cx,H*.1,BLUE_D,16);
  /* H2O */
  var wx=W*.72,wy=H*.34,ang=52*D2R;
  var h1=[wx-Math.sin(ang)*60,wy+Math.cos(ang)*60],h2=[wx+Math.sin(ang)*60,wy+Math.cos(ang)*60];
  LN(wx,wy,h1[0],h1[1],INK,2.4);LN(wx,wy,h2[0],h2[1],INK,2.4);
  k5_at(wx,wy,16,RED,'O',14);k5_at(h1[0],h1[1],12,BLUE,'H',12);k5_at(h2[0],h2[1],12,BLUE,'H',12);
  A((wx+h1[0])/2-14,(wy+h1[1])/2-8,(wx-h1[0])*.45,(wy-h1[1])*.45,DRED,'',2.4);A((wx+h2[0])/2+14,(wy+h2[1])/2-8,(wx-h2[0])*.45,(wy-h2[1])*.45,DRED,'',2.4);
  TB('H₂O',wx,H*.1,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;
   TB('Σ = 0',cx,H*.72,DGREEN,20);TB('apolaire',cx,H*.84,DGREEN,15);
   A(wx,wy+64+8,0,-52*k,GREEN,'',3.4);TB('Σ ≠ 0',wx,H*.85,DGREEN,20);TB('polaire',wx,H*.95,DGREEN,15);ctx.globalAlpha=1;}
  else{TB('dipôles C→O',cx,H*.72,GREY,14);TB('dipôles H→O',wx,H*.88,GREY,14);}
 },
 /* 4 · CCl4 apolaire */
 function (p) {
  var k=k5_seg(p,0,.6),s=Math.min(H*.3,75),az=.5,el=.35;
  var mk=function(cx,cy,items,lab){k5_mol3(cx,cy,s,az,el,'C',INK,items);
   items.forEach(function(it){var q=k5_p3(it.v[0],it.v[1],it.v[2],az,el);A(cx+q.x*s*.35,cy-q.y*s*.35,q.x*s*.4,-q.y*s*.4,DRED,'',2.4);});};
  mk(W*.26,H*.5,K5_TET.map(function(v){return {v:v,lab:'Cl',col:GREEN,r:13};}));
  mk(W*.7,H*.5,[{v:K5_TET[0],lab:'Cl',col:GREEN,r:13},{v:K5_TET[1],lab:'H',col:BLUE,r:10},{v:K5_TET[2],lab:'H',col:BLUE,r:10},{v:K5_TET[3],lab:'H',col:BLUE,r:10}]);
  TB('CCl₄',W*.26,H*.1,BLUE_D,16);TB('CH₃Cl',W*.7,H*.1,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;TB('4 dipôles identiques',W*.26,H*.84,INK,13);TB('Σ = 0 : apolaire',W*.26,H*.95,DGREEN,16);
   var q=k5_p3(K5_TET[0][0],K5_TET[0][1],K5_TET[0][2],az,el);A(W*.7+s*1.25,H*.5+34,0,-96*k,GREEN,'',3.6);TB('Σ',W*.7+s*1.25+14,H*.5-70,DGREEN,15);
   TB('Σ ≠ 0 : polaire',W*.7,H*.95,DGREEN,16);ctx.globalAlpha=1;}
  else{TB('lequel est apolaire ?',W*.5,H*.95,GREY,15);}
 },
 /* 4 solides */
 function (p) {
  var xs=[W*.14,W*.38,W*.62,W*.86],y0=H*.12,bw=W*.2,bh=H*.5,k=k5_seg(p,0,.7),t=Date.now()/400;
  var lab=['A','B','C','D'];
  xs.forEach(function(x,i){k5_rr(x-bw/2,y0,bw,bh,'#f4f8fc',GREY,1.4);TB(lab[i],x,y0-6,BLUE_D,16);});
  /* A moléculaire : paires I2 */
  for(var i=0;i<3;i++)for(var j=0;j<3;j++){var x=xs[0]-bw*.3+i*bw*.3,y=y0+bh*.2+j*bh*.3;LN(x-5,y,x+5,y,INK,2);DOT(x-6,y,5,VIOLET);DOT(x+6,y,5,VIOLET);}
  /* B métallique : cations + électrons */
  for(var i=0;i<3;i++)for(var j=0;j<3;j++){var x=xs[1]-bw*.3+i*bw*.3,y=y0+bh*.2+j*bh*.3;DOT(x,y,7,ORANGE+'cc');TB('+',x,y+4,'#fff',11);}
  for(var e=0;e<8;e++)DOT(xs[1]-bw*.4+((e*37+t*10)%(bw*.8)),y0+bh*.12+((e*53)%(bh*.76)),2.6,BLUE);
  /* C réticulaire : maillage */
  for(var i=0;i<3;i++)for(var j=0;j<3;j++){var x=xs[2]-bw*.3+i*bw*.3,y=y0+bh*.2+j*bh*.3;if(i<2)LN(x,y,x+bw*.3,y,INK,2.2);if(j<2)LN(x,y,x,y+bh*.3,INK,2.2);if(i<2&&j<2)LN(x,y,x+bw*.3,y+bh*.3,INK,1.4);}
  for(var i=0;i<3;i++)for(var j=0;j<3;j++)DOT(xs[2]-bw*.3+i*bw*.3,y0+bh*.2+j*bh*.3,5,'#555');
  /* D ionique */
  for(var i=0;i<3;i++)for(var j=0;j<3;j++){var x=xs[3]-bw*.3+i*bw*.3,y=y0+bh*.2+j*bh*.3,pos=(i+j)%2===0;k5_at(x,y,8,pos?VIOLET:GREEN,pos?'+':'−',10);}
  var data=[['114 °C · mou','non conducteur'],['1 085 °C · malléable','conducteur'],['> 3 000 °C','très dur · isolant'],['801 °C · cassant','conduit dissous']];
  data.forEach(function(d,i){TB(d[0],xs[i],y0+bh+18,GREY,12);TB(d[1],xs[i],y0+bh+34,GREY,12);});
  if(p>0){ctx.globalAlpha=k;[['moléculaire','I₂'],['métallique','Cu'],['réticulaire','diamant'],['ionique','NaCl']].forEach(function(d,i){TB(d[0],xs[i],H*.84,DGREEN,14);TB(d[1],xs[i],H*.95,BLUE_D,15);});ctx.globalAlpha=1;}
  else TB('associe chaque solide à son type',W*.5,H*.9,GREY,15);
 },
 /* 6 · R = 2 mu cos(theta/2) */
 function (p) {
  var x0=W*.14,x1=W*.9,yb=H*.8,yt=H*.14,mu=1.2;
  var X=function(th){return x0+(th-60)/(180-60)*(x1-x0);},Y=function(R){return yb-R/2.6*(yb-yt);};
  LN(x0,yb,x1+6,yb,AX,1.6);LN(x0,yb+4,x0,yt-6,AX,1.6);TB('R',x0+8,yt,GREY,13,'left');TB('θ (°)',x1,yb+30,GREY,13,'right');
  [60,90,120,150,180].forEach(function(th){LN(X(th),yb,X(th),yb+4,GREY,1.2);TB(String(th),X(th),yb+17,GREY,12);});
  [0,1,2].forEach(function(r){LN(x0-4,Y(r),x0,Y(r),GREY,1.2);TB(String(r),x0-8,Y(r)+4,GREY,12,'right');});
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();for(var th=60;th<=180;th+=2){var R=2*mu*Math.cos(th*D2R/2);th===60?ctx.moveTo(X(th),Y(R)):ctx.lineTo(X(th),Y(R));}ctx.stroke();
  var pts=[[180,0,'180°'],[104.5,2*mu*Math.cos(104.5*D2R/2),'104,5°'],[90,2*mu*Math.cos(45*D2R),'90°']];
  pts.forEach(function(q,i){var a=k5_seg(p,i*.25,i*.25+.3);DOT(X(q[0]),Y(q[1]),5+3*a,a>0?RED:GREY);
   if(p>0){ctx.globalAlpha=a;LN(X(q[0]),Y(q[1]),X(q[0]),yb,RED,1.2,[3,3]);
    TB(i===0?'R = 0':'R = '+q[1].toFixed(2).replace('.',','),X(q[0])+(i===0?-10:8),Y(q[1])-12,DRED,14,i===0?'right':'left');ctx.globalAlpha=1;}});
  TB('R = 2μ·cos(θ/2) , μ = 1,2',W*.5,H*.07,BLUE_D,15);
  if(p>.7){ctx.globalAlpha=k5_seg(p,.7,1);TB('R = 0 : apolaire ; sinon polaire',W*.62,H*.66,DGREEN,15);ctx.globalAlpha=1;}
 },
 /* 7 · graphite et diamant */
 function (p) {
  var t=Date.now()/500,k=k5_seg(p,0,.6);
  k5_rr(W*.04,H*.16,W*.44,H*.6,'#f4f8fc',GREY,1.4);k5_rr(W*.52,H*.16,W*.44,H*.6,'#f4f8fc',GREY,1.4);
  TB('diamant',W*.26,H*.1,BLUE_D,16);TB('graphite',W*.74,H*.1,BLUE_D,16);
  /* diamant : chaque C a 4 liaisons (tétraèdre) */
  var dc=W*.26,dy=H*.46,dd=Math.min(W*.075,H*.14);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){var nx=dc+q[0]*dd,ny=dy+q[1]*dd;LN(dc,dy,nx,ny,INK,2.4);
   [[q[0]*2,q[1]],[q[0],q[1]*2],[q[0]*2,q[1]*2]].forEach(function(o){LN(nx,ny,dc+o[0]*dd,dy+o[1]*dd,INK,1.8);DOT(dc+o[0]*dd,dy+o[1]*dd,3.4,'#777');});DOT(nx,ny,5,'#555');});
  DOT(dc,dy,6,'#222');
  /* graphite : hexagones */
  var hr=Math.min(W*.065,H*.12);
  for(var r=0;r<2;r++)for(var c=0;c<2;c++){var hx=W*.64+c*hr*1.75+(r?hr*.87:0),hy=H*.34+r*hr*1.5;
   ctx.strokeStyle=INK;ctx.lineWidth=2.2;ctx.beginPath();for(var a=0;a<6;a++){var an=a*PI/3+PI/6;a?ctx.lineTo(hx+hr*Math.cos(an),hy+hr*Math.sin(an)):ctx.moveTo(hx+hr*Math.cos(an),hy+hr*Math.sin(an));}ctx.closePath();ctx.stroke();
   for(var a=0;a<6;a++){var an=a*PI/3+PI/6;DOT(hx+hr*Math.cos(an),hy+hr*Math.sin(an),4,'#555');}
   if(p>0){ctx.globalAlpha=k;k5_ring(hx,hy,hr*.5,BLUE,2,[3,3]);for(var e=0;e<3;e++){var ae=t*(r?-1:1)+e*2.1;DOT(hx+hr*.5*Math.cos(ae),hy+hr*.5*Math.sin(ae),3.4,BLUE);}ctx.globalAlpha=1;}}
  if(p>0){ctx.globalAlpha=k;TB('4 liaisons par C : e⁻ bloqués',W*.26,H*.88,DRED,13);TB('3 liaisons : e⁻ délocalisé → conduit',W*.74,H*.88,DGREEN,13);ctx.globalAlpha=1;}
  else TB('pourquoi le graphite conduit-il ?',W*.5,H*.9,GREY,15);
 },
 /* 8 · XeF4 / SF4 */
 function (p) {
  var k=k5_seg(p,0,.6),r=52;
  var x1=W*.26,y1=H*.5;
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(q){var x=x1+q[0]*r,y=y1+q[1]*r;LN(x1+q[0]*15,y1+q[1]*15,x-q[0]*12,y-q[1]*12,INK,2.6);k5_at(x,y,12,GREEN,'F',12);});
  k5_at(x1,y1,16,VIOLET,'Xe',12);
  TB('XeF₄',x1,H*.1,BLUE_D,16);
  var x2=W*.74,y2=H*.5;
  [[0,-1],[0,1]].forEach(function(q){var x=x2+q[0]*r,y=y2+q[1]*r;LN(x2+q[0]*15,y2+q[1]*15,x-q[0]*12,y-q[1]*12,INK,2.6);k5_at(x,y,12,GREEN,'F',12);});
  [[-.9,.42],[-.9,-.42]].forEach(function(q){var x=x2+q[0]*r*1.0,y=y2+q[1]*r*1.3;LN(x2-15,y2+q[1]*14,x+8,y-q[1]*0,INK,2.6);k5_at(x,y,12,GREEN,'F',12);});
  k5_at(x2,y2,15,ORANGE,'S',13);
  TB('SF₄',x2,H*.1,BLUE_D,16);
  if(p>0){ctx.globalAlpha=k;
   /* XeF4 : 2 doublets au-dessus et au-dessous du plan */
   [[1,-1],[-1,1]].forEach(function(q){ctx.save();ctx.translate(x1+q[0]*30,y1+q[1]*30);ctx.rotate(-PI/4*q[0]*q[1]*-1);ctx.fillStyle='rgba(226,75,74,.16)';ctx.strokeStyle=RED;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(0,0,13,8,0,0,7);ctx.fill();ctx.stroke();DOT(-4,0,3,RED);DOT(4,0,3,RED);ctx.restore();});
   TB('2 doublets libres',x1,H*.84,DRED,13);TB('Σ = 0 : apolaire',x1,H*.95,DGREEN,15);
   /* SF4 : doublet à droite */
   k5_lp(x2,y2,0,30,RED,5);TB('1 doublet libre',x2,H*.84,DRED,13);A(x2+22,y2+74,-52*k,0,GREEN,'',3);TB('polaire',x2,H*.95,DGREEN,15);ctx.globalAlpha=1;}
  else{TB('plane carrée ? en bascule ?',W*.5,H*.95,GREY,15);}
 },
 /* 9 · un carat */
 function (p) {
  var k=k5_seg(p,0,.8),wd=W*.2,base=H*.82,sc=H*.5/0.0885;
  var items=[[W*.26,.0570,'diamant','3,51 g/cm³',BLUE_D],[W*.62,.0885,'graphite','2,26 g/cm³',GREY]];
  items.forEach(function(it){var x=it[0],h=it[1]*sc;
   k5_rr(x-wd/2,base-.0885*sc-6,wd,.0885*sc+6,'#fafbfc',AX,1.2,3);
   if(p>0){ctx.fillStyle=it[4]===BLUE_D?'#cfe0f3':'#d9dce0';ctx.fillRect(x-wd/2+2,base-h*k,wd-4,h*k);ctx.strokeStyle=it[4];ctx.lineWidth=2;ctx.strokeRect(x-wd/2+2,base-h*k,wd-4,h*k);}
   else {TB('?',x,base-.0885*sc*.5,GREY,28);}
   TB(it[2],x,base+20,INK,15);TB(it[3],x,base+37,GREY,12);
   if(p>.8)TB('V = '+(it[1]).toFixed(4).replace('.',',')+' cm³',x,base-h-10,it[4]===BLUE_D?BLUE_D:INK,13);});
  TB('0,200 g de carbone',W*.44,H*.07,INK,16);TB('≈ 1,00·10²² atomes',W*.44,H*.15,ORANGE,15);
  if(p>.8){ctx.globalAlpha=k5_seg(p,.8,1);TB('× 1,55',W*.87,H*.5,DRED,22);TB('graphite',W*.87,H*.62,DRED,13);TB('plus aéré',W*.87,H*.7,DRED,13);ctx.globalAlpha=1;}
 }
]);
