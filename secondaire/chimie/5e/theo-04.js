/* Chimie 5e · chapitre 4 : théorie animée et devantures */
/* molécule d'eau : O en (x,y), axe de symétrie dirigé vers ang (entre les deux H), échelle s */
function k5_h2o(x,y,ang,s,lab){var a=52*D2R,d=17*s,h1=[x+Math.cos(ang-a)*d,y+Math.sin(ang-a)*d],h2=[x+Math.cos(ang+a)*d,y+Math.sin(ang+a)*d];
 LN(x,y,h1[0],h1[1],INK,1.8*s);LN(x,y,h2[0],h2[1],INK,1.8*s);
 k5_at(h1[0],h1[1],6.5*s,BLUE,'',9);k5_at(h2[0],h2[1],6.5*s,BLUE,'',9);k5_at(x,y,9.5*s,RED,lab?'O':'',11*s);
 return [h1,h2];}
function k5_beaker(x,y,w,h,col,lvl){ /* bécher : coin haut-gauche (x,y) ; lvl = hauteur du liquide (0-1) */
 if(lvl>0){ctx.fillStyle=col||'#dbe9f7';ctx.fillRect(x+2,y+h*(1-lvl),w-4,h*lvl-2);}
 ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.stroke();}

SFA.theo("c04", {
 icon: function () {
  k5_h2o(W*.5,H*.38,PI/2,1.9);TB('H₂O',W*.5,H*.1,BLUE_D,20);
  k5_h2o(W*.26,H*.72,-PI*.5,1.2);k5_h2o(W*.74,H*.72,-PI*.5,1.2);
  LN(W*.32,H*.7,W*.46,H*.58,ORANGE,2.4,[4,4]);LN(W*.68,H*.7,W*.54,H*.58,ORANGE,2.4,[4,4]);
  TB('liaison H',W*.5,H*.92,ORANGE,16);},
 anim: function (t) {
  var w=Math.sin(t*.04)*.12;
  TB('liaisons hydrogène',W*.25,H*.09,ORANGE,Math.min(16,W*.026));TB('dissolution de NaCl',W*.74,H*.09,BLUE_D,Math.min(16,W*.026));
  LN(W*.5,H*.12,W*.5,H*.92,AX,1.2,[4,4]);
  /* réseau de molécules d'eau reliées par des liaisons H */
  var P=[[.14,.32,.9],[.30,.28,2.4],[.2,.6,-.5],[.38,.58,3.6],[.12,.82,1.2],[.32,.84,2.2]];
  var pos=P.map(function(q,i){return {x:W*q[0]+Math.sin(t*.03+i)*3,y:H*q[1]+Math.cos(t*.025+i*2)*3,a:q[2]+w*(i%2?1:-1)};});
  var pairs=[[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,5]];
  pairs.forEach(function(pr){var a=pos[pr[0]],b=pos[pr[1]],pu=.5+.5*Math.sin(t*.08+pr[0]);ctx.strokeStyle='rgba(186,117,23,'+(.45+.45*pu)+')';ctx.lineWidth=2.4;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);});
  pos.forEach(function(q){k5_h2o(q.x,q.y,q.a,1.25);});
  TB('δ⁻ O',W*.44,H*.3,DRED,13);TB('δ⁺ H',W*.44,H*.4,BLUE_D,13);
  /* ions entourés d'eau */
  var cx=W*.64,cy=H*.55,cx2=W*.86;
  k5_at(cx,cy,15,VIOLET,'Na⁺',12);k5_at(cx2,cy,18,GREEN,'Cl⁻',12);
  for(var i=0;i<6;i++){var a=i*PI/3+t*.01,r=48+Math.sin(t*.05+i)*3;var x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;k5_h2o(x,y,a,1.1);}
  for(var j=0;j<6;j++){var b=j*PI/3-t*.01+.5,r2=52+Math.sin(t*.05+j)*3;var x2=cx2+Math.cos(b)*r2,y2=cy+Math.sin(b)*r2;k5_h2o(x2,y2,b+PI,1.1);}
  TB('O (δ⁻) vers Na⁺',cx,H*.93,DRED,12);TB('H (δ⁺) vers Cl⁻',cx2,H*.93,BLUE_D,12);},
 th: '<div class="tcard"><b class="h">L\'eau, une molécule polaire</b><p>Dans O–H : ΔEN = 3,4 − 2,2 = 1,2, la liaison est polaire (δ⁻ sur O, δ⁺ sur H). Comme H₂O est <b>coudée</b> (≈ 104,5°), les deux dipôles ne s\'annulent pas : la molécule est <b>polaire</b>. Le côté O est négatif, le côté H positif.</p></div><div class="tcard"><b class="h">Liaison intramoléculaire et liaison intermoléculaire</b><p>Les <b>liaisons covalentes</b> (O–H) tiennent la molécule et sont fortes. Les <b>forces intermoléculaires</b> agissent entre molécules et sont beaucoup plus faibles ; ce sont elles qui décident de l\'état, de T<sub>eb</sub> et de la solubilité. Quand l\'eau bout, on sépare les molécules, on ne casse pas O–H.</p><p>La <b>liaison hydrogène</b> s\'établit entre un H lié à N, O ou F (δ⁺) et un doublet non liant d\'un N, O ou F voisin. Exemples : H₂O, NH₃, HF, CH₃OH oui ; CH₄ non (C–H est presque apolaire). Voilà pourquoi H₂O bout à 100 °C alors que H₂S, plus lourd, bout à −60 °C ; et pourquoi l\'éthanol (78 °C) bout bien plus haut que le diméthyléther (−25 °C), de même masse molaire.</p></div><div class="tcard"><b class="h">Solubilité : qui se ressemble s\'assemble</b><p>Un solvant <b>polaire</b> (eau) dissout les composés ioniques (les molécules d\'eau entourent chaque ion : O vers les cations, H vers les anions) et les molécules polaires capables de liaisons H (sucre, éthanol). Un solvant <b>apolaire</b> (cyclohexane) dissout les molécules apolaires (I₂).</p><p>Équation : CaCl₂ → Ca²⁺ + 2 Cl⁻. <i>Exemple :</i> 10,0 g de CaCl₂ (M = 111 g/mol) dans 250 mL : n = 10,0/111 = 0,0901 mol ; [Ca²⁺] = 0,0901/0,250 = 0,360 mol/L ; [Cl⁻] = 2 × 0,360 = 0,721 mol/L.</p></div><div class="tcard"><b class="h">Conséquences : tension superficielle, huile, glace</b><p>Les liaisons H rendent la surface de l\'eau « élastique » : la <b>tension superficielle</b> γ = 72,8 mN/m permet à une aiguille de flotter ; la force maximale est F = 2·γ·L (aiguille de 4,0 cm : 5,82 mN, soit 0,59 g). Le savon abaisse γ.</p><p>Huile et eau ne se mélangent pas (huile apolaire), et l\'huile flotte parce que sa masse volumique (0,92 g/cm³) est inférieure à celle de l\'eau : deux propriétés indépendantes. La glace (0,917 g/cm³) flotte : 91,7 % du glaçon sont immergés en eau douce (ρ_glace/ρ_eau), 89,5 % en eau de mer (1,025 g/cm³). Un glaçon qui fond ne change pas le niveau du verre : il déplace une masse d\'eau égale à sa masse.</p></div>'
});

SFA.figs("c04", [
 /* 0 · O–H polaire */
 function (p) {
  var k=k5_seg(p,0,.6),cx=W*.38,cy=H*.36,s=3.1;
  var h=k5_h2o(cx,cy,PI/2,s);
  TB('O',cx,cy+5,'#fff',16);
  TB('3,4',cx,cy-34,GREY,14);TB('2,2',h[0][0],h[0][1]+36,GREY,14);TB('2,2',h[1][0],h[1][1]+36,GREY,14);
  TB('EN',W*.1,H*.12,BLUE_D,15);
  if(p>0){ctx.globalAlpha=k;TB('δ⁻',cx+36,cy-14,DRED,22);TB('δ⁺',h[0][0]+(h[0][0]>cx?34:-34),h[0][1]+4,BLUE_D,20);TB('δ⁺',h[1][0]+(h[1][0]>cx?34:-34),h[1][1]+4,BLUE_D,20);
   A(cx,H*.97,0,-H*.17*k,GREEN,'',3.6);TB('Σ ≠ 0',cx+34,H*.86,DGREEN,16,'left');
   TB('ΔEN(O–H) = 1,2',W*.8,H*.35,INK,15);TB('molécule coudée',W*.8,H*.5,INK,14);TB('H₂O polaire',W*.8,H*.68,DGREEN,20);ctx.globalAlpha=1;}
  else{TB('H₂O est-elle polaire ?',W*.8,H*.5,GREY,15);}
 },
 /* 1 · liaisons H */
 function (p) {
  var f=[['CH₄','C–H',false],['NH₃','N–H',true],['HF','H–F',true],['CH₃OH','O–H',true]],bw=W*.2,gx=W*.04,x0=W*.07;
  TB('H lié à N, O ou F ?',W*.5,H*.1,BLUE_D,16);
  f.forEach(function(q,i){var x=x0+i*(bw+gx),k=k5_seg(p,i*.15,i*.15+.3);
   k5_rr(x,H*.22,bw,H*.5,'#f4f8fc',p>0?(q[2]?GREEN:RED):GREY,2);
   TB(q[0],x+bw/2,H*.42,INK,Math.min(20,bw*.28));TB(q[1],x+bw/2,H*.56,GREY,13);
   if(p>0){ctx.globalAlpha=k;TB(q[2]?'✔':'✘',x+bw/2,H*.7,q[2]?GREEN:RED,22);TB(q[2]?'liaison H':'non',x+bw/2,H*.84,q[2]?DGREEN:DRED,13);ctx.globalAlpha=1;}});
  if(p<=0)TB('lesquelles se lient entre elles ?',W*.5,H*.9,GREY,14);
 },
 /* 2 · eau ou cyclohexane */
 function (p) {
  var k=k5_seg(p,0,.8),bw=W*.26,bh=H*.5,by=H*.2;
  k5_beaker(W*.05,by,bw,bh,'#dbe9f7',.6);k5_beaker(W*.69,by,bw,bh,'#f6f0d0',.6);
  TB('eau (polaire)',W*.05+bw/2,H*.1,BLUE_D,14);TB('cyclohexane (apolaire)',W*.69+bw/2,H*.1,ORANGE,13);
  var chips=[['NaCl',0,.35],['sucre',0,.52],['I₂',1,.45]];
  chips.forEach(function(c,i){var sx=W*.5,sy=H*.3+i*H*.18,tx=c[1]?W*.69+bw/2:W*.05+bw/2,ty=by+bh*.7-(i%2?0:0)+(c[1]?0:(i?-8:-30));
   var x=sx+(tx-sx)*k,y=sy+(ty+ (c[1]?-16:(i?-12:-52)) -sy)*k;
   k5_rr(x-26,y-13,52,26,'#fff',p>0?(c[1]?ORANGE:BLUE_D):GREY,2,13);TB(c[0],x,y+5,INK,14);});
  if(p>0){ctx.globalAlpha=k;TB('NaCl, sucre → eau',W*.05+bw/2,H*.88,DGREEN,13);TB('I₂ → cyclohexane',W*.69+bw/2,H*.88,DGREEN,13);ctx.globalAlpha=1;}
  else TB('qui va où ?',W*.5,H*.92,GREY,15);
 },
 /* 3 · T eb de l'eau et de H2S */
 function (p) {
  var k=k5_seg(p,0,.6),x0=W*.1,yb=H*.84,yt=H*.12,Tmin=-80,Tmax=120;
  var Y=function(T){return yb-(T-Tmin)/(Tmax-Tmin)*(yb-yt);};
  LN(x0,yt-6,x0,yb+4,AX,1.6);LN(x0,Y(0),x0+W*.4,Y(0),AX,1.2,[4,4]);TB('T_eb (°C)',x0+6,yt,GREY,13,'left');TB('0',x0-6,Y(0)+4,GREY,12,'right');
  var bars=[['H₂S',-60,GREY,W*.2],['H₂O',100,BLUE,W*.34]];
  bars.forEach(function(b){var x=b[3],top=Y(b[1]),base=Y(0),h=(base-top)*(p>0?k:.0);
   if(p>0){ctx.fillStyle=b[2]+'55';ctx.fillRect(x,b[1]>0?base-(base-top)*k:base,W*.1,(b[1]>0?(base-top)*k:(top-base)*k));ctx.strokeStyle=b[2];ctx.lineWidth=2;ctx.strokeRect(x,b[1]>0?base-(base-top)*k:base,W*.1,(b[1]>0?(base-top)*k:(top-base)*k));
    TB(b[1]+' °C',x+W*.05,b[1]>0?top-8:top+18,b[2]===BLUE?BLUE_D:INK,14);}
   TB(b[0],x+W*.05,yb+22,INK,15);});
  if(p<=0)TB('?',W*.3,H*.4,GREY,34);
  /* molécules reliées */
  var mx=W*.72;
  k5_h2o(mx-34,H*.4,PI*.5,1.5);k5_h2o(mx+34,H*.4,-PI*.5,1.5);k5_h2o(mx,H*.68,-PI*.3,1.5);
  if(p>0){ctx.globalAlpha=k;[[mx-34,H*.4+20,mx,H*.68-20],[mx+34,H*.4-20,mx,H*.68-20],[mx-34+16,H*.4+4,mx+34-16,H*.4-4]].forEach(function(l){LN(l[0],l[1],l[2],l[3],ORANGE,2.6,[5,4]);});
   TB('liaisons H à vaincre',mx,H*.9,ORANGE,14);ctx.globalAlpha=1;}
  else TB('même famille, mais…',mx,H*.9,GREY,14);
 },
 /* 4 · huile et eau */
 function (p) {
  var k=k5_seg(p,0,.7),x=W*.1,w=W*.34,y=H*.12,h=H*.7;
  ctx.fillStyle='#dbe9f7';ctx.fillRect(x+2,y+h*.45,w-4,h*.55-2);ctx.fillStyle='#f7e29a';ctx.fillRect(x+2,y+h*.18,w-4,h*.27);
  LN(x+2,y+h*.45,x+w-2,y+h*.45,ORANGE,1.4);
  k5_beaker(x,y,w,h,null,0);
  TB('huile',x+w/2,y+h*.32,'#8a6a00',15);TB('eau',x+w/2,y+h*.75,BLUE_D,15);
  if(p>0){ctx.globalAlpha=k;TB('ρ = 0,92 g/cm³',W*.7,H*.28,'#8a6a00',15);TB('ρ = 1,00 g/cm³',W*.7,H*.6,BLUE_D,15);TB('huile apolaire : pas de mélange',W*.7,H*.8,INK,13);TB('moins dense : en haut',W*.7,H*.9,DGREEN,14);ctx.globalAlpha=1;}
  else{TB('pourquoi cette superposition ?',W*.72,H*.5,GREY,15);}
 },
 /* 5 · aiguille sur l'eau */
 function (p) {
  var k=k5_seg(p,0,.7),cx=W*.3,cy=H*.46,ws=H*.5;
  ctx.fillStyle='#dbe9f7';ctx.fillRect(W*.02,cy+8,W*.56,H*.42);
  ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(W*.02,cy);ctx.lineTo(cx-30,cy);ctx.quadraticCurveTo(cx-18,cy+14,cx,cy+14);ctx.quadraticCurveTo(cx+18,cy+14,cx+30,cy);ctx.lineTo(W*.58,cy);ctx.stroke();
  k5_at(cx,cy+2,9,'#7f8790','',10);
  A(cx-14,cy+2,-14,-26,GREEN,'',3);A(cx+14,cy+2,14,-26,GREEN,'',3);A(cx,cy-6,0,44,RED,'',3);
  TB('γ',cx-34,cy-34,DGREEN,15);TB('γ',cx+34,cy-34,DGREEN,15);TB('P = m·g',cx+22,cy+54,DRED,13,'left');
  TB('L = 4,0 cm · F = 2·γ·L',cx,H*.1,BLUE_D,15);
  var bx=W*.66,bw=W*.1,yb=H*.84,sc=H*.5/0.6;
  LN(bx-10,yb,W*.98,yb,AX,1.5);TB('m max (g)',W*.8,H*.1,GREY,13);
  [[0.594,'eau',BLUE],[0.31,'savon',ORANGE]].forEach(function(b,i){var x=bx+i*(bw+10),h=b[0]*sc*k;
   if(p>0){ctx.fillStyle=b[2]+'55';ctx.fillRect(x,yb-h,bw,h);ctx.strokeStyle=b[2];ctx.lineWidth=2;ctx.strokeRect(x,yb-h,bw,h);if(k>.7)TB(b[0].toFixed(2).replace('.',','),x+bw/2,yb-h-6,b[2]===BLUE?BLUE_D:DRED,13);}
   TB(b[1],x+bw/2,yb+18,INK,13);});
  LN(bx-10,yb-0.40*sc,W*.98,yb-0.40*sc,RED,1.8,[5,4]);TB('0,40 g',W*.97,yb-0.40*sc-6,DRED,12,'right');
  if(p>.8){ctx.globalAlpha=k5_seg(p,.8,1);TB('flotte sur l\'eau, coule avec savon',W*.5,H*.97,DGREEN,13);ctx.globalAlpha=1;}
 },
 /* 6 · glaçon et iceberg */
 function (p) {
  var k=k5_seg(p,0,.7),by=H*.18,bh=H*.62,bw=W*.34;
  var drawG=function(x,imm,col,lab,sub,ho){
   ctx.fillStyle=col;ctx.fillRect(x+2,by+bh*.4,bw-4,bh*.6-2);
   var cw=bw*.42,ch=bh*.38,top=by+bh*.4-ch*(1-imm);
   ctx.fillStyle='rgba(235,245,252,.95)';ctx.fillRect(x+bw/2-cw/2,top,cw,ch);ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.strokeRect(x+bw/2-cw/2,top,cw,ch);
   ctx.fillStyle=col;ctx.globalAlpha=.55;ctx.fillRect(x+bw/2-cw/2+1,by+bh*.4,cw-2,top+ch-(by+bh*.4)-1);ctx.globalAlpha=1;
   LN(x+2,by+bh*.4,x+bw-2,by+bh*.4,BLUE,2);k5_beaker(x,by,bw,bh,null,0);TB(lab,x+bw/2,by-8,BLUE_D,14);
   if(p>0){ctx.globalAlpha=k;TB(sub,x+bw/2,by+bh+20,INK,13);TB(ho,x+bw/2,by+bh+37,DRED,13);ctx.globalAlpha=1;}};
  drawG(W*.07,.917,'#cfe3f5','eau douce','91,7 % immergé','≈ 4,2 cm³ dehors');
  drawG(W*.55,.895,'#b9d5ee','eau de mer','89,5 % immergé','≈ 5,3 cm³ dehors');
  if(p<=0)TB('glaçon de 50,0 cm³ : quelle part dépasse ?',W*.5,H*.95,GREY,14);
  else{ctx.globalAlpha=k;TB('iceberg : ≈ 10,5 % visible',W*.5,H*.07,DGREEN,15);ctx.globalAlpha=1;}
 },
 /* 7 · niveau constant */
 function (p) {
  var k=k5_seg(p,0,.7),bw=W*.3,bh=H*.6,by=H*.2,ly=by+bh*.22;
  [[W*.1,true],[W*.58,false]].forEach(function(g){var x=g[0],ice=g[1];
   ctx.fillStyle='#cfe3f5';ctx.fillRect(x+2,ly,bw-4,by+bh-ly-2);
   if(ice){var cw=bw*.4,ch=bh*.34,top=ly-ch*.083;ctx.fillStyle='rgba(235,245,252,.95)';ctx.fillRect(x+bw/2-cw/2,top,cw,ch);ctx.strokeStyle=BLUE_D;ctx.lineWidth=2;ctx.strokeRect(x+bw/2-cw/2,top,cw,ch);}
   LN(x+2,ly,x+bw-2,ly,BLUE,2);k5_beaker(x,by,bw,bh,null,0);});
  TB('avant',W*.1+bw/2,by-10,BLUE_D,15);TB('après fonte',W*.58+bw/2,by-10,BLUE_D,15);
  LN(W*.1+bw+6,ly,W*.58-6,ly,RED,1.6,[4,4]);
  if(p>0){ctx.globalAlpha=k;TB('=',W*.5,ly-8,DRED,26);TB('même',W*.5,ly+24,DRED,13);TB('niveau',W*.5,ly+40,DRED,13);TB('m déplacée = m du glaçon',W*.5,H*.92,DGREEN,15);ctx.globalAlpha=1;}
  else{TB('?',W*.5,ly+8,GREY,30);TB('le verre déborde-t-il ?',W*.5,H*.92,GREY,15);}
 },
 /* 8 · éthanol, éther, propane */
 function (p) {
  var k=k5_seg(p,0,.7),items=[['éthanol','CH₃CH₂OH',78,BLUE],['éther','CH₃OCH₃',-25,ORANGE],['propane','C₃H₈',-42,GREY]];
  var yb=H*.7,yt=H*.14,Tmin=-60,Tmax=90,Y=function(T){return yb-(T-Tmin)/(Tmax-Tmin)*(yb-yt);},bw=W*.17;
  LN(W*.06,Y(0),W*.96,Y(0),AX,1.2,[4,4]);TB('0 °C',W*.04,Y(0)-6,GREY,12,'left');
  items.forEach(function(it,i){var x=W*.12+i*W*.3,v=it[2];
   if(p>0){var y0=Y(0),y1=Y(0)+(Y(v)-Y(0))*k;ctx.fillStyle=it[3]+'55';ctx.fillRect(x,Math.min(y0,y1),bw,Math.abs(y1-y0));ctx.strokeStyle=it[3];ctx.lineWidth=2;ctx.strokeRect(x,Math.min(y0,y1),bw,Math.abs(y1-y0));
    if(k>.7)TB(v+' °C',x+bw/2,v>0?Y(v)-8:Y(v)+18,it[3]===GREY?INK:dk(it[3]),14);}
   else TB('T_eb ?',x+bw/2,Y(0)-10,GREY,14);
   TB(it[0],x+bw/2,H*.84,INK,14);TB(it[1],x+bw/2,H*.94,GREY,13);});
  if(p>.7){ctx.globalAlpha=k5_seg(p,.7,1);TB('liaisons H',W*.12+bw/2,H*.07,DGREEN,13);TB('dipôle',W*.42+bw/2,H*.07,ORANGE,13);TB('forces faibles',W*.72+bw/2,H*.07,GREY,13);ctx.globalAlpha=1;}
 },
 /* 9 · CaCl2 dissous */
 function (p) {
  var k=k5_seg(p,0,.7),x=W*.07,y=H*.16,w=W*.4,h=H*.62;
  k5_beaker(x,y,w,h,'#dbe9f7',.75);LN(x,y+h*.25,x+w*.18,y+h*.25,GREY,1.4);TB('250 mL',x+w*.28,y+h*.25+4,GREY,12,'left');
  if(p<=0){ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(x+w/2,y+h-8,w*.28,9,0,0,7);ctx.fill();ctx.stroke();TB('10,0 g CaCl₂',x+w/2,y+h+24,INK,14);}
  else{var seed=[[.2,.4],[.5,.35],[.75,.45],[.3,.6],[.65,.62],[.45,.8],[.8,.78],[.18,.82],[.55,.52]];
   var n=Math.round(9*k);seed.slice(0,n).forEach(function(q,i){var px=x+w*q[0],py=y+h*q[1];if(i%3===0)k5_at(px,py,9,VIOLET,'',10);else k5_at(px,py,7,GREEN,'',10);});
   TB('Ca²⁺ (violet) · Cl⁻ (vert)',x+w/2,y+h+22,INK,13);}
  var bx=W*.56;
  if(p>0){ctx.globalAlpha=k;TB('CaCl₂ → Ca²⁺ + 2 Cl⁻',W*.74,H*.14,BLUE_D,14);
   TB('n = 10,0 / 111 = 0,0901 mol',W*.74,H*.34,INK,13);
   k5_bar(bx,H*.5,W*.11*k,H*.12,'#c9bdf2',VIOLET);TB('0,360 mol/L',bx+W*.11+8,H*.58,'#5249B5',14,'left');TB('Ca²⁺',bx,H*.48,GREY,12,'left');
   k5_bar(bx,H*.72,W*.22*k,H*.12,'#bfe7d8',GREEN);TB('0,721 mol/L',bx+W*.22+8,H*.8,DGREEN,14,'left');TB('Cl⁻',bx,H*.7,GREY,12,'left');ctx.globalAlpha=1;}
  else TB('[Ca²⁺] et [Cl⁻] ?',W*.74,H*.5,GREY,16);
 }
]);
