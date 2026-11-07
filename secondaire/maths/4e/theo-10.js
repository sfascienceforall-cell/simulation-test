/* Maths 4e · chapitre 10 : statistique descriptive */
function m4_nl(f,y,col){LN(f.L,y,f.R,y,col||AX,2);var v;ctx.font='11px system-ui';ctx.fillStyle=GREY;ctx.textAlign='center';
 var st=Math.max(1,Math.ceil(34/(f.sx)));for(v=Math.ceil(f.x0/st)*st;v<=f.x1+1e-9;v+=st){LN(f.X(v),y-3,f.X(v),y+3,GREY,1.2);ctx.fillText(String(v),f.X(v),y+16);}}
function m4_dots(f,y,vals,col,r){vals.forEach(function(v,i){var c=0;for(var j=0;j<i;j++)if(vals[j]===v)c++;DOT(f.X(v),y-(r||6)*(1+2*c)+(r||6),r||6,col||BLUE);});}
function m4_mean(f,y,m,col,lab,up){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(f.X(m),y+2);ctx.lineTo(f.X(m)-8,y+16);ctx.lineTo(f.X(m)+8,y+16);ctx.closePath();ctx.fill();if(lab)tag(lab,f.X(m),y+(up?-8:32),col,13);}
function m4_bar(f,x0,x1,h,col,fill){ctx.fillStyle=fill||'rgba(55,138,221,.35)';ctx.fillRect(f.X(x0),f.Y(h),f.X(x1)-f.X(x0),f.Y(0)-f.Y(h));ctx.strokeStyle=col||BLUE_D;ctx.lineWidth=2;ctx.strokeRect(f.X(x0),f.Y(h),f.X(x1)-f.X(x0),f.Y(0)-f.Y(h));}
SFA.theo("c10", {
 icon: function () {
  var f=m4_fr(0,12,0,5,{l:40,r:W*.5,t:30,b:30});
  [[0,2,2],[2,4,4],[4,6,3.2],[6,8,1.8]].forEach(function(b){m4_bar(f,b[0]+.4,b[1]+.4,b[2],BLUE_D);});
  LN(f.L,f.B,f.R,f.B,AX,2);
  var x0=f.R+18,by=H*.28;
  TB('x̄ , σ',x0,H*.2,BLUE_D,30,'left');
  var bx=function(v){return x0+v*(W-x0-16)/10;};
  LN(bx(0),H*.5,bx(10),H*.5,AX,1.4);ctx.fillStyle='rgba(216,90,48,.25)';ctx.fillRect(bx(2.5),H*.42,bx(7)-bx(2.5),H*.16);ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.strokeRect(bx(2.5),H*.42,bx(7)-bx(2.5),H*.16);
  LN(bx(5),H*.42,bx(5),H*.58,ORA2,3);LN(bx(.8),H*.5,bx(2.5),H*.5,ORA2,2.2);LN(bx(7),H*.5,bx(9.4),H*.5,ORA2,2.2);
  TB('médiane · quartiles',x0,H*.74,ORANGE,15,'left');TB('histogramme',f.L,H*.93,GREY,14,'left');
 },
 anim: function (t) {
  var x=3+2*0+ (13+28*(.5-.5*Math.cos(t/110)));
  var vals=[3,5,6,8,x];
  var f=m4_fr(0,45,0,10,{l:30,r:30,t:20,b:H*.4});
  var y=f.B-8;
  m4_nl(f,y+8);
  vals.forEach(function(v,i){DOT(f.X(v),y-6,i===4?8:6,i===4?RED:BLUE);});
  var mean=(3+5+6+8+x)/5,med=6;
  LN(f.X(med),y-34,f.X(med),y+8,BLUE_D,3);tag('médiane = 6',f.X(med),y-44,BLUE_D,14);
  m4_mean(f,y+8,mean,ORANGE,'moyenne = '+m4_n(Math.round(mean*10)/10),false);
  ctx.strokeStyle=VIOLET;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(f.X(3),y-62);ctx.lineTo(f.X(3),y-56);ctx.lineTo(f.X(x),y-56);ctx.lineTo(f.X(x),y-62);ctx.stroke();
  TB('étendue = '+m4_n(Math.round(x-3)),(f.X(3)+f.X(x))/2,y-66,VIO_D,14);
  TB('Une valeur extrême : la moyenne la suit, la médiane reste en place',W*.5,26,BLUE_D,15);
  TB('série 3 ; 5 ; 6 ; 8 ; x  (la dernière valeur x se déplace)',W*.5,50,GREY,13);
  TB('moyenne : sensible aux valeurs extrêmes',W*.5,H-8,DRED,13);
 },
 th: '<div class="tcard"><b class="h">Position : moyenne, médiane, mode</b><p><b>Moyenne</b> x̄ = (somme des valeurs)/n. <b>Médiane</b> : valeur qui partage la série ordonnée en deux moitiés (la valeur centrale si n est impair ; la moyenne des deux valeurs centrales si n est pair). <b>Mode</b> : valeur la plus fréquente. <b>Étendue</b> = max − min.</p><p>Exemple : 3 ; 5 ; 6 ; 8 ; 13 : moyenne 35/5 = 7, médiane 6, étendue 10. Une valeur extrême déplace beaucoup la moyenne mais peu la médiane.</p></div>'+
 '<div class="tcard"><b class="h">Tableau d\'effectifs</b><p>Avec des effectifs nᵢ pour les valeurs xᵢ : <b>x̄ = Σ nᵢxᵢ / n</b> où n = Σ nᵢ. Exemple : notes 5 (2 élèves), 6 (5), 7 (8), 8 (3), 9 (2) : n = 20 et x̄ = (10 + 30 + 56 + 24 + 18)/20 = <b>6,9</b>. La médiane est la moyenne des 10ᵉ et 11ᵉ valeurs ; les effectifs cumulés (2, 7, 15, …) montrent qu\'elles valent toutes deux 7. Mode : 7.</p></div>'+
 '<div class="tcard"><b class="h">Quartiles et boîte à moustaches</b><p>Après avoir ordonné la série : <b>Q₁</b> = médiane de la moitié inférieure, <b>Q₃</b> = médiane de la moitié supérieure (médiane exclue si n est impair). <b>Écart interquartile</b> = Q₃ − Q₁ : il contient la moitié centrale des données. La <b>boîte à moustaches</b> montre min, Q₁, médiane, Q₃, max.</p><p>Exemple : 2 ; 3 ; 5 ; 6 ; 8 ; 9 ; 12 ; 14 ; 15 : médiane 8, Q₁ = 4, Q₃ = 13, écart interquartile 9.</p></div>'+
 '<div class="tcard"><b class="h">Variance et écart-type</b><p><b>Variance</b> σ² = (1/n)·Σ(xᵢ − x̄)² = (moyenne des carrés) − x̄². <b>Écart-type</b> σ = √σ² (même unité que les données) : il mesure la dispersion autour de la moyenne.</p><p>Exemple : 3 ; 5 ; 5 ; 7 ; 10, x̄ = 6 : écarts −3, −1, −1, 1, 4, carrés 9, 1, 1, 1, 16, somme 28, σ² = 5,6 et <b>σ ≈ 2,37</b>. Deux séries de même moyenne : la plus régulière est celle de plus petit écart-type (11 ; 12 ; 12 ; 12 ; 13 a σ ≈ 0,63, 6 ; 9 ; 12 ; 15 ; 18 a σ ≈ 4,24).</p></div>'+
 '<div class="tcard"><b class="h">Classes, histogramme et esprit critique</b><p>Données regroupées : on utilise les <b>centres de classes</b> pour estimer la moyenne ; la classe modale est celle de plus grande <b>densité</b>. Dans un histogramme, c\'est l\'<b>aire</b> des barres qui est proportionnelle à l\'effectif : pour des classes d\'amplitudes inégales, <b>hauteur = effectif / amplitude</b>.</p><p>Exemple : [0 ; 10[ : 4, [10 ; 20[ : 10, [20 ; 30[ : 16, [30 ; 50[ : 10 : n = 40, moyenne ≈ (5·4 + 15·10 + 25·16 + 40·10)/40 = 24,25.</p><p><b>Pièges</b> : axe tronqué, échelle déformée, effectifs en guise de hauteurs ; le <b>paradoxe de Simpson</b> (une méthode meilleure dans chaque catégorie peut être moins bonne au total si les groupes n\'ont pas la même composition).</p></div>'
});
SFA.figs("c10", [
 function (p) { /* 0 position */
  var f=m4_fr(0,15,0,10,{l:30,r:30,t:20,b:H*.38});
  var y=f.B-8;m4_nl(f,y+8);m4_dots(f,y,[3,5,6,8,13],BLUE,7);
  TB('3 ; 5 ; 6 ; 8 ; 13',W*.5,34,BLUE_D,18);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_mean(f,y+8,7,ORANGE,'moyenne 7',false);LN(f.X(6),y-36,f.X(6),y+8,BLUE_D,3);tag('médiane 6',f.X(6)-34,y-46,BLUE_D,14);
   ctx.strokeStyle=VIOLET;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(f.X(3),y-64);ctx.lineTo(f.X(3),y-58);ctx.lineTo(f.X(13),y-58);ctx.lineTo(f.X(13),y-64);ctx.stroke();tag('étendue 10',f.X(8),y-70,VIO_D,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 1 valeur extrême */
  var f=m4_fr(0,45,0,10,{l:30,r:30,t:10,b:10});
  var y1=H*.34,y2=H*.74;
  m4_nl(f,y1+10);m4_dots(f,y1,[4,5,6,7,8],BLUE,7);TB('4 ; 5 ; 6 ; 7 ; 8',f.L,y1-34,BLUE_D,14,'left');
  m4_nl(f,y2+10);m4_dots(f,y2,[4,5,6,7,8],BLUE,7);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);DOT(f.X(40),y2,8,RED);TB('+ 40',f.X(40),y2-18,DRED,14);
   m4_mean(f,y1+10,6,ORANGE,'',false);tag('moy 6 · méd 6',f.X(20),y1-6,DGREEN,13);
   m4_mean(f,y2+10,70/6,ORANGE,'moyenne ≈ 11,7',false);LN(f.X(6.5),y2-30,f.X(6.5),y2+10,BLUE_D,3);tag('médiane 6,5',f.X(6.5)+4,y2-40,BLUE_D,13);
   tag('étendue 4 → 36',f.X(30),y2-40,VIO_D,13);ctx.globalAlpha=1;}
  else{m4_mean(f,y1+10,6,ORANGE,'moyenne 6',false);TB('et si on ajoute 40 ?',W*.5,H*.68,GREY,16);}
 },
 function (p) { /* 2 tableau d'effectifs */
  var f=m4_fr(4,10,0,10,{l:36,r:20,t:24,b:28});
  var ef=[2,5,8,3,2];
  [5,6,7,8,9].forEach(function(v,i){m4_bar(f,v-.35,v+.35,ef[i],i===2?ORANGE:BLUE_D,i===2?'rgba(216,90,48,.4)':null);TB(String(ef[i]),f.X(v),f.Y(ef[i])-6,INK,14);TB(String(v),f.X(v),f.B+16,GREY,13);});
  LN(f.L,f.B,f.R,f.B,AX,2);TB('notes (effectif en haut des barres)',f.R,f.T-6,GREY,12,'right');
  tag('n = 20',f.X(9.3),f.Y(8.8),INK,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(6.9),f.T+6,f.X(6.9),f.B,RED,2.6,[6,4]);tag('moyenne 6,9',f.X(6.9)-58,f.Y(9.2),DRED,14);tag('médiane = mode = 7',f.X(8.5),f.Y(5.6),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 quartiles */
  var f=m4_fr(0,16,0,10,{l:30,r:30,t:H*.25,b:20});
  var y=f.Y(0)-8;m4_nl(f,y+8);m4_dots(f,y,[2,3,5,6,8,9,12,14,15],BLUE,6);
  var by=H*.52,bh=44;
  LN(f.X(2),by,f.X(4),by,INK,2.2);LN(f.X(13),by,f.X(15),by,INK,2.2);
  ctx.fillStyle='rgba(216,90,48,.25)';ctx.fillRect(f.X(4),by-bh/2,f.X(13)-f.X(4),bh);ctx.strokeStyle=ORA2;ctx.lineWidth=2.6;ctx.strokeRect(f.X(4),by-bh/2,f.X(13)-f.X(4),bh);
  LN(f.X(8),by-bh/2,f.X(8),by+bh/2,ORA2,4);LN(f.X(2),by-10,f.X(2),by+10,INK,2.2);LN(f.X(15),by-10,f.X(15),by+10,INK,2.2);
  TB('2 ; 3 ; 5 ; 6 ; 8 ; 9 ; 12 ; 14 ; 15',W*.5,28,BLUE_D,16);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('Q₁ = 4',f.X(4),by-bh/2-14,DRED,14);tag('médiane 8',f.X(8),by+bh/2+16,DRED,14);tag('Q₃ = 13',f.X(13),by-bh/2-14,DRED,14);
   tag('écart interquartile = 9',f.X(8.5),by-bh/2-42,VIO_D,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 4 écart-type */
  var f=m4_fr(0,12,0,10,{l:30,r:30,t:20,b:H*.58});
  var y=f.B-8;m4_nl(f,y+8);var v=[3,5,5,7,10];m4_dots(f,y,v,BLUE,7);
  LN(f.X(6),y-50,f.X(6),y+8,ORANGE,3);tag('moyenne 6',f.X(6),y-60,ORANGE,14);
  TB('3 ; 5 ; 5 ; 7 ; 10',W*.5,30,BLUE_D,17);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);[3,5,7,10].forEach(function(d,i){LN(f.X(6),y+34+i*9,f.X(d),y+34+i*9,RED,2.6);});
   TB('écarts : −3 ; −1 ; −1 ; 1 ; 4',W*.5,H*.8,DRED,14);TB('σ² = 28/5 = 5,6   σ ≈ 2,37',W*.5,H*.93,DGREEN,16);ctx.globalAlpha=1;}
 },
 function (p) { /* 5 deux joueurs */
  var f=m4_fr(4,20,0,10,{l:30,r:30,t:10,b:10});
  var y1=H*.3,y2=H*.7;
  m4_nl(f,y1+10);m4_dots(f,y1,[11,12,12,12,13],BLUE,6);TB('A',f.L-4,y1-28,BLUE_D,16,'left');
  m4_nl(f,y2+10);m4_dots(f,y2,[6,9,12,15,18],GREEN,6);TB('B',f.L-4,y2-28,DGREEN,16,'left');
  m4_mean(f,y1+10,12,ORANGE,'',false);m4_mean(f,y2+10,12,ORANGE,'',false);tag('moyennes 12 et 12',f.X(16.5),y1-14,DRED,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);ctx.fillStyle='rgba(55,138,221,.18)';ctx.fillRect(f.X(12-.632),y1-24,f.X(12.632)-f.X(11.368),30);ctx.fillStyle='rgba(29,158,117,.18)';ctx.fillRect(f.X(12-4.243),y2-24,f.X(16.243)-f.X(7.757),30);
   tag('σ ≈ 0,63',f.X(15),y1+8,BLUE_D,14);tag('σ ≈ 4,24',f.X(12),y2+34,DGREEN,14);tag('A plus régulier',f.X(16.5),y2-14,DRED,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 histogramme classes inégales */
  var f=m4_fr(0,40,0,4,{l:36,r:20,t:24,b:28});
  m4_bar(f,0,10,2,BLUE_D);m4_bar(f,10,20,3,p>0?ORANGE:BLUE_D,p>0?'rgba(216,90,48,.4)':null);m4_bar(f,20,40,2,BLUE_D);
  LN(f.L,f.B,f.R,f.B,AX,2);[0,10,20,40].forEach(function(v){TB(String(v),f.X(v),f.B+16,GREY,13);});
  TB('effectif 20',f.X(5),f.Y(1),INK,14);TB('effectif 30',f.X(15),f.Y(1.5),INK,14);TB('effectif 40',f.X(30),f.Y(1),INK,14);
  TB('hauteur = effectif / amplitude',f.X(40),f.T-8,GREY,12,'right');
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);tag('2',f.X(5),f.Y(2)-12,DGREEN,14);tag('3',f.X(15),f.Y(3)-12,DRED,16);tag('2',f.X(30),f.Y(2)-12,DGREEN,14);tag('barre la plus haute : [10 ; 20[',f.X(30),f.Y(3.5),DRED,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 classes */
  var f=m4_fr(0,50,0,2,{l:36,r:20,t:24,b:28});
  m4_bar(f,0,10,.4,BLUE_D);m4_bar(f,10,20,1,BLUE_D);m4_bar(f,20,30,1.6,p>0?ORANGE:BLUE_D,p>0?'rgba(216,90,48,.4)':null);m4_bar(f,30,50,.5,BLUE_D);
  LN(f.L,f.B,f.R,f.B,AX,2);[0,10,20,30,50].forEach(function(v){TB(String(v),f.X(v),f.B+16,GREY,13);});
  TB('4',f.X(5),f.Y(.2),INK,14);TB('10',f.X(15),f.Y(.5),INK,14);TB('16',f.X(25),f.Y(.8),INK,14);TB('10',f.X(40),f.Y(.25),INK,14);
  TB('durées en minutes ; n = 40',f.L,f.T-8,GREY,12,'left');
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(24.25),f.T,f.X(24.25),f.B,RED,2.6,[6,4]);tag('moyenne ≈ 24,25',f.X(24.25)-70,f.Y(1.9),DRED,14);tag('classe modale [20 ; 30[',f.X(37),f.Y(1.4),DGREEN,13);tag('médiane ∈ [20 ; 30[',f.X(8),f.Y(1.4),VIO_D,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 8 Simpson */
  var f=m4_fr(0,9,0,110,{l:36,r:20,t:24,b:34});
  var G=[['faciles',95,90],['difficiles',45,40],['total',55,80]];
  m4_grid(f,1,20,false);
  G.forEach(function(g,i){var x=i*3+.7;m4_bar(f,x,x+1.1,g[1],BLUE_D);m4_bar(f,x+1.1,x+2.2,g[2],ORANGE,'rgba(216,90,48,.4)');TB(g[0],f.X(x+1.1),f.B+18,INK,14);
   if(p>0){ctx.globalAlpha=m4_ap(p,0,1);TB(g[1]+' %',f.X(x+.55),f.Y(g[1])-6,BLUE_D,14);TB(g[2]+' %',f.X(x+1.65),f.Y(g[2])-6,DRED,14);ctx.globalAlpha=1;}});
  ctx.fillStyle=BLUE_D;ctx.fillRect(f.R-190,f.T-12,12,12);TB('X',f.R-172,f.T-2,BLUE_D,14,'left');ctx.fillStyle=ORANGE;ctx.fillRect(f.R-140,f.T-12,12,12);TB('Y',f.R-122,f.T-2,DRED,14,'left');
  if(p>0){ctx.globalAlpha=m4_ap(p,.4,1);tag('X gagne partout, Y gagne au total',f.X(4.5),f.Y(104),DGREEN,14);ctx.globalAlpha=1;}
  else TB('taux de réussite',f.L,f.T-6,GREY,12,'left');
 },
 function (p) { /* 9 ajouter une donnée */
  var f=m4_fr(3,21,0,1.25,{l:30,r:30,t:26,b:34});
  m4_cv(f,function(x){return Math.exp(-(x-11)*(x-11)/8);},3,21,BLUE,3.4);
  LN(f.L,f.B,f.R,f.B,AX,2);var v;for(v=5;v<=17;v+=2){TB(String(v),f.X(v),f.B+16,GREY,12);}
  LN(f.X(11),f.Y(0),f.X(11),f.Y(1.05),ORANGE,3);tag('moyenne 11',f.X(11),f.Y(1.12),ORANGE,14);
  [-3,-2,-1,1,2,3].forEach(function(k){LN(f.X(11+2*k),f.B-4,f.X(11+2*k),f.B+4,VIOLET,2);});
  tag('σ = 2',f.X(14.6),f.Y(.62),VIO_D,14);
  DOT(f.X(17),f.Y(0)-0,8,RED);tag('17 = 3σ de 11',f.X(17),f.Y(.18),DRED,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);LN(f.X(11.24),f.Y(0),f.X(11.24),f.Y(.9),GREEN,2.4,[5,4]);tag('nouvelle moyenne 11,24',f.X(16),f.Y(.95),DGREEN,13);tag('nouvel écart-type ≈ 2,29',f.X(6.3),f.Y(.45),DGREEN,14);ctx.globalAlpha=1;}
 }
]);
