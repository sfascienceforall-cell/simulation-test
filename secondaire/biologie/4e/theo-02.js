/* Biologie 4e · chapitre 2 · Organites et leurs fonctions */
function b4rer(x,y,w,h,dots){ctx.strokeStyle=BLUE;ctx.lineWidth=2;for(var i=0;i<3;i++){var yy=y-h/2+h*(i+.5)/3;ctx.beginPath();for(var k=0;k<=16;k++){var xx=x-w/2+w*k/16;k?ctx.lineTo(xx,yy+Math.sin(k*1.1+i)*h*.06):ctx.moveTo(xx,yy);}ctx.stroke();
 if(dots)for(var j=1;j<16;j+=2){DOT(x-w/2+w*j/16,yy-h*.09,2,VIOLET);}}}
function b4golgi(x,y,w,h){ctx.strokeStyle=ORANGE;ctx.lineWidth=3.2;ctx.lineCap='round';for(var i=0;i<4;i++){var yy=y-h/2+h*i/3,ww=w*(1-.1*Math.abs(i-1.5));ctx.beginPath();ctx.moveTo(x-ww/2,yy+h*.08);ctx.quadraticCurveTo(x,yy-h*.12,x+ww/2,yy+h*.08);ctx.stroke();}ctx.lineCap='butt';}
function b4lyso(x,y,r){b4ell(x,y,r,r,'#fcebeb',RED,2);DOT(x-r*.3,y-r*.2,2,DRED);DOT(x+r*.25,y+r*.1,2,DRED);DOT(x,y+r*.4,2,DRED);}
function b4chloro(x,y,s){b4ell(x,y,13*s,7*s,'#e8f6ee',DGREEN,1.8);for(var i=-1;i<=1;i++)b4ell(x+i*6*s,y,2.4*s,3.6*s,'#9fd9bf',DGREEN,1);}
function b4ribo(x,y,s){b4ell(x,y+2*s,6*s,4.4*s,VIOLET);b4ell(x,y-3.5*s,4*s,3*s,'#a8a2ea');}
/* cellule sécrétrice : f = avancement (0..1) d'une protéine le long du trajet noyau→RER→Golgi→vésicule→membrane→extérieur */
function b4secr(f,hl){var cx=W*.42,cy=H*.5,rx=W*.4,ry=H*.4;b4ell(cx,cy,rx,ry,'#fdf3ee',ORA2,2.6);
 b4ell(W*.19,H*.5,H*.2,H*.2,'#e4e0fa',VIOLET,2.4);b4ell(W*.19,H*.5,H*.085,H*.085,'#b9b3ee');TB('noyau',W*.19,H*.79,VIOLET,13);
 b4rer(W*.4,H*.33,W*.2,H*.2,true);TB('réticulum rugueux',W*.4,H*.14+4,BLUE_D,13);
 b4golgi(W*.58,H*.64,W*.14,H*.2);TB('Golgi',W*.58,H*.84,ORANGE,13);
 b4mito(W*.38,H*.7,1.3,.3);
 LN(W*.82,H*.15,W*.82,H*.85,GREY,1,[2,4]);TB('extérieur',W*.93,H*.1,GREY,13);
 var path=[[W*.27,H*.44],[W*.36,H*.35],[W*.52,H*.52],[W*.6,H*.6],[W*.7,H*.55],[W*.82,H*.5],[W*.92,H*.5]];
 var seg=f*(path.length-1),i=Math.min(path.length-2,Math.floor(seg)),u=seg-i,px=path[i][0]+(path[i+1][0]-path[i][0])*u,py=path[i][1]+(path[i+1][1]-path[i][1])*u;
 for(var k=0;k<path.length-1;k++)if(f*(path.length-1)>k){LN(path[k][0],path[k][1],path[k+1][0],path[k+1][1],GREEN,2,[4,4]);}
 var st=Math.floor(seg+.15);if(f<=0)return;
 if(st>=3&&st<5)b4ell(px,py,9,9,'#fff',GREEN,2.4);DOT(px,py,5.5,RED);
}
function b4cmp(x,y,s,type){if(type==='mito')b4mito(x,y,s*2.2,.3);else if(type==='ribo')b4ribo(x,y,s*2.4);else if(type==='lyso')b4lyso(x,y,s*13);else b4chloro(x,y,s*2);}
SFA.theo("c02",{
 icon:function(){var cx=W*.5,cy=H*.5;b4ell(cx,cy,Math.min(W*.34,130),Math.min(H*.38,90),'#fdf3ee',ORA2,3);b4nuc(cx-W*.08,cy-H*.04,Math.min(H*.13,34));b4mito(cx+W*.14,cy-H*.12,2.3,.4);b4mito(cx+W*.1,cy+H*.16,2.1,-.3);b4golgi(cx+W*.1,cy-H*.0+2,W*.08,H*.12);b4rer(cx-W*.16,cy+H*.17,W*.1,H*.1,true);},
 anim:function(t){var P=720,k=(t%P)/P,f=b4r(k,.06,.86);b4secr(f);
  var steps=['1 ARNm quitte le noyau','2 ribosome : synthèse (RER)','3 Golgi : modification, tri','4 vésicule de sécrétion','5 exocytose'];var cur=f<=0?-1:Math.min(4,Math.floor(f*5));
  TB('Le trajet d\'une protéine exportée',W*.5,H*.07,BLUE_D,Math.max(14,Math.min(17,W/42)));
  if(cur>=0)TB(steps[cur],W*.5,H*.95,GREEN===0?INK:DGREEN,Math.max(13,Math.min(16,W/44)));},
 th:'<div class="tcard"><b class="h">La cellule eucaryote est compartimentée</b><p>Les organites sont des compartiments entourés d\'une membrane : chacun réunit des enzymes pour une tâche précise.</p><ul><li><b>Noyau</b> : contient l\'ADN (les « plans »), fournit des copies de travail (ARN messagers) qui sortent par les pores. Il ne « pense » pas.</li><li><b>Ribosomes</b> : assemblent les acides aminés en protéines (libres dans le cytoplasme ou fixés au réticulum).</li><li><b>Réticulum rugueux</b> (avec ribosomes) : protéines destinées à l\'export ou aux membranes ; <b>réticulum lisse</b> : lipides.</li><li><b>Appareil de Golgi</b> : modifie, trie et emballe les protéines dans des vésicules.</li><li><b>Mitochondries</b> : respiration cellulaire, production d\'ATP. <b>Chloroplastes</b> (végétaux) : photosynthèse.</li><li><b>Lysosomes</b> : enzymes digestives ; <b>vacuole</b> : réserve d\'eau et de solutés (grande chez les végétaux).</li></ul></div>'+
 '<div class="tcard"><b class="h">La voie de sécrétion</b><p>Gène (noyau) → ARNm → <b>ribosome du réticulum rugueux</b> → réticulum → <b>Golgi</b> → <b>vésicule de sécrétion</b> → fusion avec la membrane (<b>exocytose</b>) → l\'extérieur. Exemple : l\'insuline des cellules du pancréas.</p><div class="tip"><b class="h">Méthode : lire un marquage</b><br>Des acides aminés radioactifs donnés 3 minutes « marquent » un paquet de protéines. On suit ce paquet dans le temps : réticulum (5 min) → Golgi (25 min) → vésicules (60 min) → extérieur (150 min). L\'ordre d\'apparition donne l\'ordre du trajet.</div></div>'+
 '<div class="tcard"><b class="h">Cellules spécialisées</b><p>Une cellule est riche en organites utiles à sa fonction : cellule musculaire → très nombreuses <b>mitochondries</b> ; cellule sécrétrice (pancréas) → <b>réticulum rugueux</b> et Golgi abondants ; cellule de feuille → <b>chloroplastes</b> <i>et</i> mitochondries (la plante respire aussi, surtout la nuit) ; globule rouge mature : ni noyau ni mitochondrie, il tire son ATP de la glycolyse et rejette du lactate.</p></div>'+
 '<div class="tcard"><b class="h">Mitochondries et capacité d\'énergie (modèle du cours)</b><p>Demande en ATP = <code>10 + 0,9 × effort</code> (effort en %). Capacité aérobie = <code>100 × (part de mitochondries) × (part saines)</code>. Quand la demande dépasse la capacité aérobie, la fermentation complète (jusqu\'à 15 unités ici).</p><div class="tip"><b class="h">Exemple chiffré</b><br>70 % des mitochondries, dont 40 % défaillantes : capacité = 100 × 0,70 × 0,60 = <b>42</b>. 10 + 0,9·e = 42 donne e ≈ <b>35,6 %</b> : au-delà, fermentation. Capacité maximale 42 + 15 = 57 ; à 60 %, demande = 64 &gt; 57 : effort non tenable.</div></div>'+
 '<div class="warn"><b class="h">À retenir</b><br>• Les mitochondries et chloroplastes ont deux membranes, un ADN circulaire propre, de petits ribosomes et se divisent seuls : c\'est l\'argument de l\'<b>endosymbiose</b> (anciennes bactéries englobées).<br>• Le Golgi ne <i>fabrique</i> pas les protéines : il les transforme et les trie.</div>'
});
SFA.figs("c02",[
 /* 0 associer */
 function(p){var L=[['1 mitochondrie','mito'],['2 ribosome','ribo'],['3 lysosome','lyso'],['4 chloroplaste','chl']],R=['a assemble les protéines','b digère des déchets','c réalise la photosynthèse','d fabrique l\'ATP'],ord=[3,0,1,2];
  var y0=H*.16,dy=H*.22;L.forEach(function(o,i){var y=y0+i*dy;b4box(W*.2,y,W*.34,dy*.8,BLUE,'#fff',2);b4cmp(W*.06,y,1.1,o[1]);TB(o[0],W*.12,y+5,INK,14,'left');b4box(W*.78,y,W*.38,dy*.8,GREEN,'#fff',2);TB(R[i],W*.6,y+5,INK,13,'left');});
  if(p>0)L.forEach(function(o,i){var a=b4r(p,i*.15,i*.15+.3);if(a<=0)return;b4al(a);var y1=y0+i*dy,y2=y0+ord[i]*dy;LN(W*.37,y1,W*.59,y2,ORANGE,3);b4al(1);});
  b4ans(p,'1-d · 2-a · 3-b · 4-c',GREEN,H-20);},
 /* 1 cellule de feuille */
 function(p){b4plant(W*.4,H*.5,W*.58,H*.66,{chloro:true});if(p<=0){TB('chloroplastes ? mitochondries ?',W*.4,H*.94,GREY,16);return;}
  b4al(b4r(p,0,.5));b4lab('chloroplaste',W*.2,H*.19,W*.84,H*.2,DGREEN,15,'left');b4lab('mitochondrie',W*.2,H*.8,W*.84,H*.8,ORA2,15,'left');
  b4al(1);b4ans(p,'les deux : photosynthèse et respiration',GREEN,H-20);},
 /* 2 trajet */
 function(p){var f=p<=0?.0:p;b4secr(f);if(p<=0){TB('A, B, C ou D ?',W*.5,H*.97,GREY,16);}
  var nm=['1 noyau','2 ribosome du RER','3 Golgi','4 vésicule','5 membrane'];if(p>0)b4ans(p,'ribosome du RER → Golgi → vésicule → membrane',GREEN,H-20);},
 /* 3 noyau */
 function(p){var cx=W*.22,cy=H*.5,R=H*.28;b4ell(cx,cy,R,R,'#e4e0fa',VIOLET,3);ctx.strokeStyle=VIOLET;ctx.lineWidth=2;ctx.beginPath();for(var i=0;i<30;i++){ctx.lineTo(cx-R*.5+i*R/30*1.0,cy+Math.sin(i*.9)*R*.35);}ctx.stroke();
  TB('ADN',cx,cy+R*.62,VIOLET,14);for(var j=0;j<3;j++)b4ell(cx+R*Math.cos(-.6+j*.6),cy+R*Math.sin(-.6+j*.6),4,7,'#fff',VIOLET,2,-.6+j*.6);
  b4rer(W*.72,H*.4,W*.2,H*.24,true);b4ribo(W*.66,H*.7,3);b4ribo(W*.8,H*.72,3);TB('ribosomes',W*.74,H*.82,VIOLET,13);
  if(p<=0){TB('« le cerveau de la cellule » ?',W*.5,H*.1,GREY,18);}
  if(p>0){var f=b4r(p,0,.8);b4al(b4r(p,0,.3));TB('ADN = plans',cx,H*.14,VIOLET,15);b4al(1);
   var x=cx+R+f*(W*.7-cx-R-20);DOT(x,cy-R*.4+f*(H*.4-cy+R*.4),6,RED);LN(cx+R,cy-R*.4,x,cy-R*.4+f*(H*.4-cy+R*.4),RED,2,[4,4]);b4al(b4r(p,.4,.8));TB('ARNm = copie de travail',W*.5,H*.26,RED,14);b4al(1);
   b4ans(p,'conserve l\'ADN · pas de « décision »',GREEN,H-20);}},
 /* 4 muscle et effort */
 function(p){var M=b4ax(W*.12,H*.78,W*.78,H*.62,[0,100],[0,100],'effort (%)','unités d\'ATP');M.xl=W*.12;M.yb=H*.78;b4tick(M,[0,25,50,75,100],[0,25,50,75,100]);
  b4curve(M,function(e){return 10+.9*e;},0,100,BLUE,3.2,50);TB('demande',M.x(88),M.y(95)-4,BLUE_D,14);
  LN(M.x(0),M.y(60),M.x(100),M.y(60),GREEN,2.4,[6,4]);TB('aérobie 60',M.x(8),M.y(60)-8,DGREEN,14,'left');
  if(p>0){var a=b4r(p,0,.5);b4al(a);var e1=50/.9,e2=65/.9;LN(M.x(0),M.y(75),M.x(100),M.y(75),ORANGE,2.4,[6,4]);TB('total 75',M.x(8),M.y(75)-8,ORANGE,14,'left');
   LN(M.x(e1),M.y(60),M.x(e1),M.y(0),DGREEN,1.6,[3,3]);DOT(M.x(e1),M.y(60),6,GREEN);LN(M.x(e2),M.y(75),M.x(e2),M.y(0),ORANGE,1.6,[3,3]);DOT(M.x(e2),M.y(75),6,ORANGE);
   TB('56 %',M.x(e1),M.y(0)+34,DGREEN,14);TB('72 %',M.x(e2),M.y(0)+34,ORANGE,14);b4al(1);b4ans(p,'(a) 60 · (b) ≈ 56 % · (c) ≈ 72 %',GREEN,H-20);}},
 /* 5 marquage */
 function(p){var n=['RER','Golgi','vésicules','extérieur'],tm=['5 min','25 min','60 min','150 min'],xs=[.14,.38,.62,.86];
  b4box(W*.5,H*.27,W*.8,H*.2,GREY,'#f6f7f9',1.5);TB('3 min d\'acides aminés radioactifs, puis rinçage',W*.5,H*.3,INK,14);
  xs.forEach(function(x,i){var y=H*.62;if(i===0)b4rer(W*x,y,W*.15,H*.16,true);else if(i===1)b4golgi(W*x,y,W*.12,H*.16);else if(i===2){b4ell(W*x,y,16,16,'#fff',GREEN,2.4);DOT(W*x,y,5,RED);b4ell(W*x-30,y+14,10,10,'#fff',GREEN,2.4);}else{LN(W*x-30,y-40,W*x-30,y+40,GREY,2);}
   TB(n[i],W*x,H*.85,INK,14);TB(tm[i],W*x,H*.45+8,GREY,14);if(i<3)A(W*x+W*.08,y,W*.07,0,GREY,'',2);});
  if(p>0){xs.forEach(function(x,i){var a=b4r(p,i*.2,i*.2+.25);if(a<=0)return;b4al(a);DOT(W*x+(i===3?10:0),H*.62-(i===3?0:0),i===3?8:6,RED);if(i<3)A(W*x+W*.08,H*.62,W*.07,0,RED,'',3);b4al(1);});b4ans(p,'RER → Golgi → vésicules → extérieur',GREEN,H-20);}},
 /* 6 bloquer */
 function(p){b4rer(W*.2,H*.5,W*.22,H*.34,true);b4golgi(W*.8,H*.5,W*.16,H*.3);TB('réticulum',W*.2,H*.8,BLUE_D,14);TB('Golgi',W*.8,H*.8,ORANGE,14);
  A(W*.36,H*.5,W*.28,0,GREY,'',3);ctx.strokeStyle=RED;ctx.lineWidth=7;ctx.lineCap='round';LN(W*.5,H*.36,W*.5,H*.64,RED,7);ctx.lineCap='butt';TB('médicament',W*.5,H*.28,DRED,14);
  var n=p<=0?3:3+Math.round(p*14);for(var i=0;i<n;i++){var a=i*2.4;DOT(W*.2+Math.cos(a)*W*.08*(.4+(i%5)/6),H*.5+Math.sin(a*1.7)*H*.13*(.5+(i%4)/6),4,RED);}
  if(p<=0)TB('que se passe-t-il ?',W*.5,H*.12,GREY,18);
  b4ans(p,'accumulation dans le réticulum, sécrétion arrêtée',GREEN,H-20);},
 /* 7 endosymbiose */
 function(p){function mt(x,y,s){b4ell(x,y,45*s,28*s,'#fdece4',ORA2,2.4);b4ell(x,y,40*s,23*s,null,ORA2,1.4);ctx.strokeStyle=ORA2;ctx.lineWidth=1.3;for(var i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(x+i*13*s,y+(i%2?-22:22)*s);ctx.lineTo(x+i*13*s,y+(i%2?2:-2)*s);ctx.stroke();}ctx.strokeStyle=VIOLET;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+10*s,y-8*s,6*s,0,7);ctx.stroke();}
  var s=Math.min(W/330,H/200);mt(W*.24,H*.4,s*1.3);b4bact(W*.76,H*.4,W*.3,H*.2,0,{nonuc:true});ctx.strokeStyle=VIOLET;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(W*.76,H*.4,W*.03,0,7);ctx.stroke();
  TB('mitochondrie',W*.24,H*.72,DRED,15);TB('bactérie',W*.76,H*.72,BLUE_D,15);TB('?',W*.5,H*.42,GREY,40);
  if(p>0){var tr=['2 membranes','ADN circulaire','petits ribosomes','division en deux'];tr.forEach(function(s2,i){b4al(b4r(p,i*.18,i*.18+.25));TB('✓ '+s2,W*.53,H*.12+i*H*.075,DGREEN,14);b4al(1);});b4ans(p,'endosymbiose',GREEN,H-20);}},
 /* 8 maladie mito */
 function(p){var M=b4ax(W*.12,H*.78,W*.78,H*.62,[0,100],[0,100],'effort (%)','ATP');M.xl=W*.12;M.yb=H*.78;b4tick(M,[0,25,50,75,100],[0,25,50,75,100]);
  b4curve(M,function(e){return 10+.9*e;},0,100,BLUE,3.2,50);LN(M.x(0),M.y(42),M.x(100),M.y(42),GREEN,2.4,[6,4]);TB('aérobie 42',M.x(2),M.y(42)+18,DGREEN,14,'left');
  LN(M.x(0),M.y(57),M.x(100),M.y(57),ORANGE,2.4,[6,4]);TB('total 57',M.x(2),M.y(57)-8,ORANGE,14,'left');
  LN(M.x(60),M.y(0),M.x(60),M.y(64),GREY,1.6,[3,3]);TB('60 %',M.x(60),M.y(0)+30,INK,14);
  if(p>0){b4al(b4r(p,0,.5));DOT(M.x(35.6),M.y(42),6,GREEN);TB('36 %',M.x(35.6),M.y(0)+30,DGREEN,14);ctx.fillStyle='rgba(226,75,74,.3)';ctx.fillRect(M.x(60)-5,M.y(64),10,M.y(57)-M.y(64));DOT(M.x(60),M.y(64),6,RED);TB('64 > 57',M.x(60)+10,M.y(64)-10,DRED,14,'left');b4al(1);b4ans(p,'42 · 36 % · non : il manque 7',GREEN,H-20);}},
 /* 9 globule rouge */
 function(p){var cx=W*.26,cy=H*.46,R=Math.min(H*.3,W*.17);b4ell(cx,cy,R,R*.9,'#fcebeb',RED,3);b4ell(cx,cy,R*.45,R*.4,'#f7d3d2',null);TB('globule rouge',cx,cy+R+26,DRED,14);TB('ni noyau, ni mitochondrie',cx,cy+R+46,GREY,13);
  if(p<=0){TB('ATP ?',W*.7,H*.45,GREY,34);return;}
  var a=b4r(p,0,.5);b4al(a);TB('glucose',W*.55,H*.28,INK,15);A(W*.62,H*.3,W*.1,0,GREY,'',2.5);TB('glycolyse',W*.77,H*.3,DGREEN,15);A(W*.77,H*.36,0,H*.12,GREY,'',2.5);TB('2 ATP',W*.7,H*.62,GREEN,18);TB('+ lactate',W*.86,H*.62,ORANGE,16);TB('cytoplasme : aucun O₂ requis',W*.7,H*.74,GREY,13);b4al(1);
  b4ans(p,'glycolyse + fermentation lactique',GREEN,H-20);}
]);
