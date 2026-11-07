/* Biologie 4e · chapitre 3 · Membrane, diffusion et osmose */
function b4rnd(i,s){var v=Math.sin(i*12.9898+(s||0)*78.233)*43758.5453;return v-Math.floor(v);}
function b4dots(x,y,w,h,n,seed,r,col,t,amp){for(var i=0;i<n;i++){var jx=t?Math.sin(t*.05+i*1.7)*(amp||3):0,jy=t?Math.cos(t*.045+i*2.3)*(amp||3):0;DOT(x+(.06+.88*b4rnd(i,seed))*w+jx,y+(.06+.88*b4rnd(i,seed+9))*h+jy,r,col);}}
function b4bilayer(x0,x1,y,gap,o){o=o||{};var n=Math.floor((x1-x0)/13);for(var i=0;i<=n;i++){var x=x0+i*13;
  [[y-gap/2,-1],[y+gap/2,1]].forEach(function(q){ctx.strokeStyle='#c9a46a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-2,q[0]+q[1]*5);ctx.lineTo(x-2,q[0]+q[1]*gap*.42);ctx.moveTo(x+2,q[0]+q[1]*5);ctx.lineTo(x+2,q[0]+q[1]*gap*.42);ctx.stroke();DOT(x,q[0],5,'#f2c879');ctx.strokeStyle='#c9a46a';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,q[0],5,0,7);ctx.stroke();});}}
function b4glass(x,y,w,h,lvl,col){/* bécher : y = fond ; lvl en 0..1 */ if(lvl>0){ctx.fillStyle=col||'rgba(55,138,221,.22)';ctx.fillRect(x-w/2+2,y-h*lvl,w-4,h*lvl-2);}ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-w/2,y-h);ctx.lineTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2,y-h);ctx.stroke();}
function b4cellC(x,y,r,vol,crenate){/* cellule ronde de rayon r*vol^.5 */ var rr=r*Math.sqrt(vol);ctx.beginPath();if(crenate){for(var i=0;i<=40;i++){var a=i/40*6.2832,k=rr*(1+.13*Math.sin(a*9)*crenate);i?ctx.lineTo(x+k*Math.cos(a),y+k*Math.sin(a)):ctx.moveTo(x+k,y);}ctx.closePath();}else ctx.arc(x,y,rr,0,7);ctx.fillStyle='#fcebeb';ctx.fill();ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.stroke();b4ell(x,y,rr*.4,rr*.35,'#f7d3d2');}
function b4pump(x,y,s,col){ctx.fillStyle='#d8d4f7';ctx.strokeStyle=VIOLET;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-11*s,y-17*s,22*s,34*s,6);ctx.fill();ctx.stroke();}
SFA.theo("c03",{
 icon:function(){b4bilayer(W*.12,W*.88,H*.5,H*.14);A(W*.3,H*.2,0,H*.18,BLUE,'',3);A(W*.7,H*.84,0,-H*.18,ORANGE,'',3);TB('ATP',W*.5,H*.26,VIOLET,16);b4pump(W*.5,H*.5,1.2);},
 anim:function(t){var P=420,ph=Math.floor(t/P)%3,k=(t%P)/P,cx=W*.5,mx=cx,top=H*.2,bot=H*.84,hh=bot-top,e=k<.15?0:k>.85?1:(k-.15)/.7;e=e*e*(3-2*e);
  var tit=['Diffusion : du plus concentré vers le moins concentré, sans énergie','Osmose : l\'eau va vers le côté le plus concentré en solutés','Transport actif : contre le gradient, avec de l\'ATP'][ph];TB(tit,W*.5,H*.08,BLUE_D,Math.max(13,Math.min(16,W/44)));
  var x0=W*.12,x1=W*.88;
  if(ph===0){ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.rect(x0,top,x1-x0,hh);ctx.stroke();LN(mx,top,mx,bot,GREY,2,[6,5]);
   for(var i=0;i<46;i++){var sx=x0+(.03+.44*b4rnd(i,1))*(x1-x0),tx=x0+(.03+.94*b4rnd(i,2))*(x1-x0),sy=top+(.05+.9*b4rnd(i,3))*hh,ty=top+(.05+.9*b4rnd(i,4))*hh;DOT(sx+(tx-sx)*e+Math.sin(t*.07+i)*3,sy+(ty-sy)*e+Math.cos(t*.06+i*2)*3,5,ORANGE);}
   TB('concentré',x0+(x1-x0)*.25,bot+20,GREY,13);TB('dilué',x0+(x1-x0)*.75,bot+20,GREY,13);A(W*.42,H*.14+10,W*.16,0,ORANGE,'',2.5);}
  else if(ph===1){var wA=W*.26,xa=W*.3,xb=W*.7,vA=1-.43*e,vB=1+.43*e,lv=.5;b4glass(xa,bot,wA*1.3,hh,.5*vA,'rgba(55,138,221,.25)');b4glass(xb,bot,wA*1.3,hh,.5*vB,'rgba(55,138,221,.25)');
   ctx.setLineDash([6,5]);LN(mx,top+hh*.3,mx,bot,GREY,3);ctx.setLineDash([]);
   b4dots(xa-wA*.65+3,bot-hh*.5*vA+4,wA*1.3-6,hh*.5*vA-8,5,5,5,ORANGE,t);b4dots(xb-wA*.65+3,bot-hh*.5*vB+4,wA*1.3-6,hh*.5*vB-8,14,6,5,ORANGE,t);
   TB('A  0,2 mol/L',xa,bot+20,INK,13);TB('B  0,5 mol/L',xb,bot+20,INK,13);
   if(e>0&&e<1)for(var j=0;j<5;j++){var u=((t*.012+j*.2)%1);DOT(xa+wA*.65+u*(xb-xa-wA*1.3),H*.52+Math.sin(j*3)*H*.13,3.5,BLUE);}A(W*.44,H*.15,W*.12,0,BLUE,'eau',2.5);}
  else{LN(x0,H*.52,x1,H*.52,'#fff',1);b4bilayer(x0,x1,H*.52,H*.1);TB('milieu extérieur : Na⁺ élevé',W*.5,H*.2,GREY,13);TB('cytoplasme : Na⁺ faible',W*.5,H*.9,GREY,13);
   b4dots(x0,H*.24,x1-x0,H*.2,14,3,5,BLUE,t);b4dots(x0,H*.63,x1-x0,H*.2,3,4,5,BLUE,t);
   b4pump(W*.5,H*.52,1.3);var u=e;DOT(W*.5,H*.7-u*H*.34,7,BLUE);TB('Na⁺',W*.5+18,H*.7-u*H*.34+4,BLUE_D,13,'left');if(k>.15&&k<.85){TB('ATP → ADP + Pi',W*.74,H*.52,VIOLET,14);}}
 },
 th:'<div class="tcard"><b class="h">La membrane : un modèle en mosaïque fluide</b><p>La membrane cellulaire est une <b>bicouche de phospholipides</b> (têtes hydrophiles vers l\'extérieur, queues hydrophobes à l\'intérieur) dans laquelle flottent des <b>protéines</b> (canaux, transporteurs, pompes, récepteurs) ; des glycoprotéines et du cholestérol complètent le tableau. Elle est <b>sélective</b> : l\'eau, le dioxygène et le CO<sub>2</sub> passent facilement ; les ions et les grosses molécules (glucose, amidon) ne passent que par des protéines, ou pas du tout.</p></div>'+
 '<div class="tcard"><b class="h">Diffusion : transport passif</b><p>Des particules se déplacent du milieu où elles sont <b>le plus concentrées</b> vers celui où elles le sont <b>le moins</b> (sens du gradient), jusqu\'à égaliser. Elle vient de l\'agitation des particules et <b>ne coûte aucune énergie</b>. Elle peut se faire directement à travers la bicouche (O<sub>2</sub>) ou par des canaux/transporteurs (diffusion facilitée : Na<sup>+</sup>, glucose).</p></div>'+
 '<div class="tcard"><b class="h">Osmose et tonicité</b><p>L\'<b>osmose</b> est la diffusion de l\'<b>eau</b> à travers une membrane qui laisse passer l\'eau mais pas (ou mal) les solutés : l\'eau va du milieu <b>le moins concentré</b> en solutés (hypotonique) vers le <b>plus concentré</b> (hypertonique).</p><table><tr><td>Bain</td><td>Eau</td><td>Cellule animale</td><td>Cellule végétale</td></tr><tr><td>hypotonique</td><td>entre</td><td>gonfle, peut éclater</td><td>turgescente</td></tr><tr><td>isotonique</td><td>équilibre</td><td>inchangée</td><td>flasque</td></tr><tr><td>hypertonique</td><td>sort</td><td>se ratatine</td><td>plasmolyse</td></tr></table><div class="tip"><b class="h">Exemple chiffré</b><br>A : 100 mL à 0,2 mol/L ; B : 100 mL à 0,5 mol/L ; seul l\'eau passe. n<sub>A</sub> = 0,020 mol, n<sub>B</sub> = 0,050 mol ; c finale = 0,070 ÷ 0,200 = <b>0,35 mol/L</b> ; V<sub>A</sub> = 0,020 ÷ 0,35 ≈ <b>57 mL</b>, V<sub>B</sub> ≈ <b>143 mL</b>.</div></div>'+
 '<div class="tcard"><b class="h">Transport actif</b><p>Faire passer une substance <b>contre son gradient</b> demande de l\'énergie : une protéine <b>pompe</b> utilise de l\'<b>ATP</b>. Exemple : la pompe Na<sup>+</sup>/K<sup>+</sup> rejette le Na<sup>+</sup> (12 mmol/L dedans, 145 dehors). Si l\'ATP manque, la pompe s\'arrête, le Na<sup>+</sup> fuit vers l\'intérieur et le gradient disparaît.</p></div>'+
 '<div class="warn"><b class="h">Pièges</b><br>• L\'eau va vers le côté le <i>plus</i> concentré en solutés (pas l\'inverse).<br>• Pour une particule qui se dissocie, compte les ions : NaCl donne 2 particules (9 g/L ÷ 58,5 = 0,154 mol/L → 0,31 mol/L de particules).<br>• Diffusion et osmose = passives ; seul le transport actif consomme de l\'ATP.</div>'
});
SFA.figs("c03",[
 /* 0 goutte d'encre */
 function(p){var gx=W*.3,gw=W*.4,gt=H*.18,gb=H*.88,gh=gb-gt;ctx.fillStyle='rgba(55,138,221,.08)';ctx.fillRect(gx+2,gt+gh*.1,gw-4,gh*.9-2);
  var R=8+p*Math.min(gw,gh)*.75;var g=ctx.createRadialGradient(gx+gw/2,gt+gh*.3,0,gx+gw/2,gt+gh*.3,R);g.addColorStop(0,'rgba(30,30,120,'+(.9-.45*p)+')');g.addColorStop(1,'rgba(30,30,120,0)');ctx.save();ctx.beginPath();ctx.rect(gx+2,gt+gh*.1,gw-4,gh*.9-2);ctx.clip();ctx.fillStyle=g;ctx.fillRect(gx,gt,gw,gh);ctx.restore();
  b4glass(gx+gw/2,gb,gw,gh,0);ctx.fillStyle='rgba(30,30,120,1)';DOT(gx+gw/2,gt+gh*.3,p>0?0:5,'#1e1e78');
  if(p>0){b4al(b4r(p,.2,.7));for(var i=0;i<8;i++){var a=i*.785;A(gx+gw/2+Math.cos(a)*22,gt+gh*.3+Math.sin(a)*22,Math.cos(a)*28,Math.sin(a)*28,ORANGE,'',2);}b4al(1);}
  TB('goutte d\'encre',W*.16,H*.3,INK,14);TB('eau',W*.16,H*.6,BLUE_D,14);
  b4ans(p,'diffusion · concentré → dilué · sans énergie',GREEN,H-18);},
 /* 1 hypo iso hyper */
 function(p){var c=[.3,.9,2],nm=['0,3 %','0,9 %','2 %'],lab=['hypotonique','isotonique','hypertonique'],vol=[1.25,1,.7],col=[BLUE,GREEN,ORANGE];
  c.forEach(function(v,i){var x=W*(.18+i*.32),gb=H*.82,gw=W*.26,gh=H*.55;b4glass(x,gb,gw,gh,.9,'rgba(55,138,221,'+(.08+v*.1)+')');
   b4cellC(x,gb-gh*.4,Math.min(gw,gh)*.26,p>0?(1+(vol[i]-1)*p):1,0);TB(nm[i]+' NaCl',x,gb+22,INK,14);
   if(p>0){b4al(b4r(p,0,.5));TB(lab[i],x,H*.12,dk(col[i]),15);if(i===0)A(x-gw*.4,gb-gh*.8,gw*.2,gh*.3,BLUE,'',3);if(i===2)A(x-gw*.2,gb-gh*.45,-gw*.2,-gh*.25,ORANGE,'',3);TB(i===0?'eau entre':i===1?'équilibre':'eau sort',x,H*.2,dk(col[i]),13);b4al(1);}});
  TB('cellule : 0,9 %',W*.5,H*.07,GREY,14);},
 /* 2 où va l'eau */
 function(p){var xa=W*.28,xb=W*.72,gb=H*.82,gw=W*.3,gh=H*.55,la=.5-.14*b4r(p,0,1),lb=.5+.14*b4r(p,0,1);
  b4glass(xa,gb,gw,gh,la,'rgba(55,138,221,.22)');b4glass(xb,gb,gw,gh,lb,'rgba(55,138,221,.22)');ctx.setLineDash([6,5]);LN(W*.5,gb-gh*.8,W*.5,gb,GREY,3);ctx.setLineDash([]);
  b4dots(xa-gw/2+4,gb-gh*la+6,gw-8,gh*la-12,5,2,5,ORANGE,0);b4dots(xb-gw/2+4,gb-gh*lb+6,gw-8,gh*lb-12,13,3,5,ORANGE,0);
  TB('A : 0,2 mol/L',xa,gb+22,INK,14);TB('B : 0,5 mol/L',xb,gb+22,INK,14);TB('saccharose',W*.5,H*.1,ORANGE,14);TB('(ne traverse pas)',W*.5,H*.17,GREY,12);
  if(p>0){b4al(b4r(p,0,.4));A(W*.42,gb-gh*.82,W*.16,0,BLUE,'eau',3.4);b4al(1);}
  if(p<=0)TB('?',W*.5,gb-gh*.35,GREY,30);
  b4ans(p,'A → B : l\'eau va vers le plus concentré',GREEN,H-20);},
 /* 3 niveaux */
 function(p){var xa=W*.28,xb=W*.72,gb=H*.8,gw=W*.3,gh=H*.52,e=b4r(p,0,.9),la=.5*(1-.43*e),lb=.5*(1+.43*e);
  b4glass(xa,gb,gw,gh,la,'rgba(55,138,221,.22)');b4glass(xb,gb,gw,gh,lb,'rgba(55,138,221,.22)');ctx.setLineDash([6,5]);LN(W*.5,gb-gh*.8,W*.5,gb,GREY,3);ctx.setLineDash([]);
  LN(xa-gw/2-8,gb-gh*.5,xb+gw/2+8,gb-gh*.5,GREY,1,[2,4]);
  b4dots(xa-gw/2+4,gb-gh*la+6,gw-8,gh*la-12,5,2,5,ORANGE,0);b4dots(xb-gw/2+4,gb-gh*lb+6,gw-8,gh*lb-12,13,3,5,ORANGE,0);
  TB(p>0?'57 mL':'100 mL',xa,gb+22,p>0?DGREEN:INK,15);TB(p>0?'143 mL':'100 mL',xb,gb+22,p>0?DGREEN:INK,15);TB('0,2 mol/L',xa,H*.1,ORANGE,14);TB('0,5 mol/L',xb,H*.1,ORANGE,14);
  if(p>0){b4al(b4r(p,.5,1));TB('0,35 mol/L partout',W*.5,H*.1,DGREEN,15);b4al(1);}
  b4ans(p,'V_A ≈ 57 mL · V_B ≈ 143 mL',GREEN,H-20);},
 /* 4 globule rouge : courbe */
 function(p){var M=b4ax(W*.12,H*.78,W*.78,H*.62,[0.3,2],[0,2.6],'','V / V₀   (c en % de NaCl)');M.xl=W*.12;M.yb=H*.78;b4tick(M,[.5,1,1.5,2],[0,1,1.6,2]);
  b4curve(M,function(c){return .25+.75*.9/c;},.3,2,BLUE,3.2,100);
  LN(M.x(.3),M.y(1.6),M.x(2),M.y(1.6),RED,2,[6,4]);TB('éclate',M.x(1.95),M.y(1.6)-8,DRED,14,'right');LN(M.x(.3),M.y(1),M.x(2),M.y(1),GREY,1.5,[3,4]);
  var pts=[[.45,1.75,'a'],[.6,1.375,'b'],[1.8,.625,'c']];pts.forEach(function(q,i){var a=b4r(p,i*.2,i*.2+.3);LN(M.x(q[0]),M.y(0),M.x(q[0]),M.y(q[1]),GREY,1,[3,3]);if(p<=0){DOT(M.x(q[0]),M.y(0),4,GREY);TB(q[0]+' %',M.x(q[0]),M.y(0)+32,INK,13);return;}b4al(.3+.7*a);DOT(M.x(q[0]),M.y(q[1]),6.5,i?GREEN:RED);TB(String(q[1]).replace('.',','),M.x(q[0])+(i===2?0:12),M.y(q[1])-12,i?DGREEN:DRED,14,i===2?'center':'left');b4al(1);});
  b4ans(p,'(a) éclate · (b) gonfle · (c) se ratatine',GREEN,H-20);},
 /* 5 salade */
 function(p){var cx=W*.36,cy=H*.5,w=W*.44,h=H*.56,e=p;ctx.strokeStyle=DGREEN;ctx.lineWidth=6;ctx.fillStyle='#eaf6ee';ctx.beginPath();ctx.roundRect(cx-w/2,cy-h/2,w,h,12);ctx.fill();ctx.stroke();
  var vw=w*(.86-.28*e),vh=h*(.86-.3*e);ctx.fillStyle='#d9ecfb';ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx-vw/2,cy-vh/2,vw,vh,16);ctx.fill();ctx.stroke();b4nuc(cx-vw*.25,cy,Math.min(w,h)*.07);
  TB('vacuole',cx+vw*.15,cy,BLUE_D,14);TB('paroi',cx+w/2+4,cy-h/2+10,DGREEN,13,'left');
  for(var i=0;i<9;i++){var gx=W*.7+b4rnd(i,3)*W*.24,gy=H*.18+b4rnd(i,4)*H*.64;ctx.fillStyle='#fff';ctx.strokeStyle='#9aa0a6';ctx.lineWidth=1.3;ctx.fillRect(gx-3,gy-3,6,6);ctx.strokeRect(gx-3,gy-3,6,6);}
  TB('sel dissous',W*.83,H*.12,GREY,14);TB('hypertonique',W*.83,H*.9,ORANGE,14);
  if(p<=0)TB('turgescente',cx,H*.93,GREEN,14);
  if(p>0){b4al(b4r(p,0,.5));A(cx+vw/2,cy-8,w*.55,0,BLUE,'',3);TB('eau',cx+w*.78,cy-18,BLUE_D,14);b4al(1);b4ans(p,'osmose : l\'eau sort, la feuille perd sa turgescence',GREEN,H-20);}},
 /* 6 eau de mer */
 function(p){var cx=W*.4,cy=H*.5,R=Math.min(W,H)*.24;ctx.fillStyle='rgba(55,138,221,.15)';ctx.fillRect(W*.04,H*.08,W*.64,H*.84);
  for(var i=0;i<16;i++){var gx=W*.07+b4rnd(i,5)*W*.58,gy=H*.1+b4rnd(i,6)*H*.8;if(Math.hypot(gx-cx,gy-cy)>R*1.4){ctx.fillStyle='#fff';ctx.strokeStyle='#9aa0a6';ctx.lineWidth=1.2;ctx.fillRect(gx-3,gy-3,6,6);ctx.strokeRect(gx-3,gy-3,6,6);}}
  b4cellC(cx,cy,R,1-.35*p,p);TB('eau de mer ≈ 3 %',W*.36,H*.08+16,BLUE_D,14);TB('cellule ≈ 0,9 %',cx,cy+R*1.2+24,RED,14);
  TB('cellules du naufragé',W*.84,H*.35,INK,14);
  if(p>0){b4al(b4r(p,0,.5));for(var j=0;j<6;j++){var a=j*1.047;A(cx+Math.cos(a)*R*.75,cy+Math.sin(a)*R*.75,Math.cos(a)*30,Math.sin(a)*30,BLUE,'',2.4);}b4al(1);TB('l\'eau sort',W*.84,H*.55,BLUE_D,15);b4ans(p,'hypertonique : cellules ratatinées',GREEN,H-20);}},
 /* 7 sodium */
 function(p){b4bilayer(W*.06,W*.94,H*.52,H*.1);TB('extérieur : 145 mmol/L',W*.3,H*.12,BLUE_D,15);TB('intérieur : 12 mmol/L',W*.3,H*.9,BLUE_D,15);
  b4dots(W*.06,H*.16,W*.88,H*.28,16,7,5,BLUE,0);b4dots(W*.06,H*.62,W*.88,H*.2,2,8,5,BLUE,0);
  b4pump(W*.3,H*.52,1.4);ctx.fillStyle='#d8f1e6';ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(W*.62,H*.4,W*.07,H*.24,6);ctx.fill();ctx.stroke();TB('canal',W*.655,H*.72+0,DGREEN,13);TB('pompe',W*.3,H*.72,VIOLET,14);
  if(p<=0)TB('?',W*.5,H*.52,GREY,34);
  if(p>0){b4al(b4r(p,0,.4));A(W*.655,H*.32,0,H*.3,GREEN,'',3.4);tag('entre (passif)',W*.8,H*.3,DGREEN,14);A(W*.3,H*.62,0,-H*.3,ORANGE,'',3.4);tag('ATP : sort (actif)',W*.3,H*.12+22,ORANGE,14);b4al(1);b4ans(p,'diffusion en entrée · pompe en sortie',GREEN,H-18);}},
 /* 8 perfusions */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.56,[0,3],[0,.4],'','mol/L de particules');M.xl=W*.12;M.yb=H*.76;var v=[.308,.278,.05],nm=['A NaCl 9 g/L','B glucose 50 g/L','C glucose 9 g/L'],col=[GREEN,GREEN,ORANGE];
  v.forEach(function(q,i){var x=M.x(i+.5),f=p<=0?1:b4r(p,i*.15,i*.15+.5);var h=M.y(0)-M.y(q*(p>0?f:1));if(p<=0){ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;}else{ctx.fillStyle=col[i]===GREEN?'#d8f1e6':'#fdece4';ctx.strokeStyle=col[i];}ctx.lineWidth=2;ctx.beginPath();ctx.rect(x-W*.08,M.y(0)-(p<=0?M.y(0)-M.y(.15):h),W*.16,p<=0?M.y(0)-M.y(.15):h);ctx.fill();ctx.stroke();TB(nm[i],x,M.y(0)+22,INK,13);
   if(p>0&&f>.9)TB(String(q).replace('.',','),x,M.y(q)-8,dk(col[i]),15);else if(p<=0)TB('?',x,M.y(.075)+8,BLUE_D,26);});
  LN(M.x(0),M.y(.3),M.x(3),M.y(.3),RED,2.2,[6,4]);TB('plasma 0,30',M.x(3),M.y(.3)-8,DRED,14,'right');
  b4ans(p,'A et B isotoniques · C hypotonique',GREEN,H-18);},
 /* 9 boudin de dialyse */
 function(p){var x0=W*.28,x1=W*.72,y0=H*.3,y1=H*.7;ctx.fillStyle='rgba(186,117,23,.15)';ctx.fillRect(W*.05,H*.1,W*.9,H*.8);ctx.fillStyle=p>0?'rgba(30,30,100,'+(.18+.32*p)+')':'#fff';ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x0,y0,x1-x0,y1-y0,y1/9);ctx.fill();ctx.stroke();
  for(var i=0;i<7;i++){var ax=x0+14+b4rnd(i,1)*(x1-x0-28),ay=y0+12+b4rnd(i,2)*(y1-y0-24);b4ell(ax,ay,9,6,'#3d3d6a','#25254a',1.5,b4rnd(i,3)*3);}
  for(var j=0;j<6;j++){DOT(x0+14+b4rnd(j,4)*(x1-x0-28),y0+14+b4rnd(j,5)*(y1-y0-28),3.5,GREEN);}
  for(var k=0;k<12;k++){var ox=W*.08+b4rnd(k,6)*W*.84,oy=H*.14+b4rnd(k,7)*H*.72;if(ox>x0-12&&ox<x1+12&&oy>y0-12&&oy<y1+12)continue;DOT(ox,oy,3.5,'#8a5a17');}
  TB('amidon ●',W*.2,H*.06,'#3d3d6a',14);TB('glucose ●',W*.5,H*.06,DGREEN,14);TB('iode ●',W*.8,H*.06,'#8a5a17',14);
  if(p>0){b4al(b4r(p,0,.5));A(x0-30,H*.5,24,0,'#8a5a17','',3);A(x1+6,H*.38,26,0,GREEN,'',3);A(x1+6,H*.38,26,0,GREEN,'',3);TB('✗',W*.5,y0-8,DRED,18);b4al(1);b4ans(p,'iode et glucose passent · l\'amidon reste',GREEN,H-14);}}
]);
