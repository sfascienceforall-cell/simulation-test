/* Physique 4e · chapitre 7 : lumière, ombres et éclipses (aides q_* de theo-01.js / theo-02.js) */
function q7_lamp(x,y,r,col){for(var i=0;i<10;i++){var an=i*PI/5;LN(x+Math.cos(an)*(r+4),y+Math.sin(an)*(r+4),x+Math.cos(an)*(r+11),y+Math.sin(an)*(r+11),'#e0a418',2);}DOT(x,y,r,col||'#f5d56a');ctx.strokeStyle='#e0a418';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();}
function q7_ray(x1,y1,x2,y2,col,w,d){LN(x1,y1,x2,y2,col||'#e0a418',w||1.5,d);}
function q7_sun(x,y,r){DOT(x,y,r,'#f5c443');for(var i=0;i<12;i++){var an=i*PI/6;LN(x+Math.cos(an)*(r+3),y+Math.sin(an)*(r+3),x+Math.cos(an)*(r+r*.4),y+Math.sin(an)*(r+r*.4),'#e0a418',2.4);}}
function q7_moonHalf(x,y,r,ang){ /* disque gris, moitié éclairée du côté ang (rad) */ DOT(x,y,r,'#5b6470');ctx.fillStyle='#fbe9a6';ctx.beginPath();ctx.arc(x,y,r,ang-PI/2,ang+PI/2);ctx.closePath();ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();}

SFA.theo("c07", {
 icon: function(){q7_lamp(W*.22,H*.4,16);ctx.fillStyle='#3d3d3a';ctx.fillRect(W*.45,H*.28,10,H*.24);ctx.fillStyle='rgba(60,60,60,.25)';ctx.fillRect(W*.78,H*.2,10,H*.4);q7_ray(W*.22+14,H*.4,W*.78,H*.2,'#e0a418',1.5);q7_ray(W*.22+14,H*.4,W*.78,H*.6,'#e0a418',1.5);TB('E = I / d²',W*.5,H*.82,BLUE_D,24);},
 anim: function(t){
  var a=11*(1+Math.sin(t*.025))/2,b=24,y0=H*.5,xs=W*.1,xo=W*.42,xe=W*.78,k=(xe-xs)/(xo-xs);
  var um=(b-a)*k+a,pe=(b+a)*k-a;
  ctx.fillStyle='rgba(60,60,60,.12)';ctx.fillRect(xe,y0-pe,14,2*pe);ctx.fillStyle='rgba(30,30,30,.55)';ctx.fillRect(xe,y0-Math.max(0,um),14,2*Math.max(0,um));
  ctx.fillStyle='rgba(255,230,140,.12)';ctx.beginPath();ctx.moveTo(xs,y0-a);ctx.lineTo(xo,y0-b);ctx.lineTo(xe,y0-pe);ctx.lineTo(xe,y0+pe);ctx.lineTo(xo,y0+b);ctx.lineTo(xs,y0+a);ctx.fill();
  [-1,0,1].forEach(function(f){var sy=y0+f*a;q7_ray(xs,sy,xo,y0-b,'#e0a418',1.3);q7_ray(xs,sy,xo,y0+b,'#e0a418',1.3);});
  q7_ray(xs,y0+a,xe,y0-um*(a>1?1:1)-0*0,'#e0a418',1.3,[4,4]);
  ctx.fillStyle='#e0a418';ctx.fillRect(xs-6,y0-a-3,12,2*a+6);TB('source',xs,y0+a+30,INK,14);
  ctx.fillStyle=INK;ctx.fillRect(xo-5,y0-b,10,2*b);TB('objet',xo,y0+b+22,INK,14);
  LN(xe,y0-pe-14,xe,y0+pe+14,INK,2);TB('écran',xe+6,y0+pe+30,INK,14);
  TB(a<2?'source ponctuelle : ombre nette':'source étendue : ombre + pénombre',W*.5,H*.1,BLUE_D,16);
  if(a>3){TB('ombre',xe+24,y0+4,INK,14,'left');TB('pénombre',xe+24,y0-(um+pe)/2+4,GREY,13,'left');}
  TB('propagation rectiligne',W*.5,H*.92,GREY,14);
 },
 th: '<div class="tcard"><b class="h">Sources et objets éclairés</b><p>Une <b>source primaire</b> produit sa lumière (Soleil, bougie, écran allumé). Un <b>objet éclairé</b> renvoie (diffuse) la lumière reçue (Lune, page, miroir) : on le voit parce que cette lumière entre dans notre œil. La lumière se propage <b>en ligne droite</b> dans un milieu transparent homogène, à la vitesse c = 3,0 × 10⁸ m/s dans le vide : celle du Soleil met 1,5 × 10¹¹ / 3,0 × 10⁸ = 500 s, soit 8 min 20 s, pour nous atteindre.</p></div>'+
 '<div class="tcard"><b class="h">Ombre et pénombre</b><p>Avec une source <b>ponctuelle</b>, l\'ombre est nette : sa taille se déduit de la propagation rectiligne (triangles semblables) : <b>h<sub>ombre</sub> = h × D / d<sub>1</sub></b> (D : source–écran, d<sub>1</sub> : source–objet). Exemple : lampe à 2,0 m d\'un objet de 0,20 m, écran à 1,0 m derrière : 0,20 × 3,0 / 2,0 = 0,30 m. Avec une source <b>étendue</b>, une zone d\'ombre complète est entourée d\'une <b>pénombre</b> (éclairée par une partie seulement de la source). Source 10 cm, obstacle 20 cm, mêmes distances : ombre 30 cm, ombre + pénombre 50 cm.</p></div>'+
 '<div class="tcard"><b class="h">Phases de la Lune et éclipses</b><p>La Lune est toujours éclairée sur <b>une moitié</b> (celle qui fait face au Soleil) ; selon sa position par rapport à la Terre et au Soleil, on en voit une part plus ou moins grande : ce sont les <b>phases</b> (et non l\'ombre de la Terre !). <b>Éclipse de Soleil</b> : la Lune passe entre le Soleil et la Terre (nouvelle lune). <b>Éclipse de Lune</b> : la Lune entre dans l\'ombre de la Terre (pleine lune). Elles n\'ont pas lieu chaque mois car l\'orbite de la Lune est inclinée d\'environ 5° sur celle de la Terre.</p></div>'+
 '<div class="tcard"><b class="h">Diamètre apparent</b><p>Le Soleil (1,392 × 10⁶ km à 1,496 × 10⁸ km) sous-tend 9,31 × 10⁻³ rad ; la Lune (3 474 km à 384 400 km) 9,04 × 10⁻³ rad : presque la même taille apparente. À distance moyenne la Lune est un peu trop « petite » : éclipse <b>annulaire</b> ; plus proche (périgée), elle cache tout le Soleil : éclipse <b>totale</b>. Le <b>sténopé</b> (chambre noire) forme une image renversée : h\' / h = d\' / d.</p></div>'+
 '<div class="tcard"><b class="h">Éclairement</b><p>L\'éclairement d\'une surface perpendiculaire aux rayons est <b>E = I / d²</b> (I : intensité lumineuse en candelas, d en m, E en <b>lux</b>). Il diminue comme le <b>carré</b> de la distance : distance × 3, éclairement ÷ 9 (90 lx → 10 lx). Exemple : 200 cd à 2,0 m : 200 / 4 = 50 lx ; pour 500 lx il faut d = √(200/500) ≈ 0,63 m.</p></div>'
});

SFA.figs("c07", [
 /* 1 source ou objet éclairé */ function(p){
  var a=q_r(p,0,.6),items=[['Soleil',1],['Lune',0],['bougie',1],['page',0],['écran',1],['miroir',0]];
  items.forEach(function(it,i){var cx=W*(.2+(i%3)*.3),cy=H*(.28+Math.floor(i/3)*.42),col=it[1]?DGREEN:BLUE_D;
   if(i==0)q7_sun(cx,cy-4,14);else if(i==1){DOT(cx,cy-4,15,'#d6dae0');DOT(cx-5,cy-8,4,'#c2c7cf');}else if(i==2){ctx.fillStyle='#f2efe6';ctx.fillRect(cx-6,cy-6,12,28);ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.strokeRect(cx-6,cy-6,12,28);ctx.fillStyle='#f5a623';ctx.beginPath();ctx.ellipse(cx,cy-14,4,9,0,0,7);ctx.fill();}
   else if(i==3){ctx.fillStyle='#fff';ctx.strokeStyle=INK;ctx.lineWidth=1.8;ctx.fillRect(cx-16,cy-16,32,36);ctx.strokeRect(cx-16,cy-16,32,36);for(var k=0;k<4;k++)LN(cx-10,cy-8+k*8,cx+10,cy-8+k*8,GREY,1.4);}
   else if(i==4){ctx.fillStyle='#fff7c2';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx-12,cy-20,24,40,4);ctx.fill();ctx.stroke();}
   else{ctx.fillStyle='#e9f4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(cx-16,cy-18,32,36);ctx.strokeRect(cx-16,cy-18,32,36);LN(cx-10,cy+8,cx+6,cy-10,'#fff',3);}
   TB(it[0],cx,cy+40,INK,14);if(a>0){ctx.globalAlpha=a;q_pill(it[1]?'source':'objet éclairé',cx,cy+66,col,12,it[1]?'#e8f7f1':'#eef4fb');ctx.globalAlpha=1;}});
 },
 /* 2 temps de la lumière */ function(p){
  var y=H*.45;q7_sun(W*.1,y,22);DOT(W*.86,y,9,BLUE);DOT(W*.86-3,y-3,3,GREEN);A(W*.2,y+34,W*.62,0,GREY,'',2);TB('150 millions de km',W*.51,y+58,INK,15);TB('c = 3,0 × 10⁸ m/s',W*.51,y-40,ORANGE,15);
  var s=q_r(p,0,.8);DOT(W*.2+W*.62*s,y,6,'#e0a418');LN(W*.2,y,W*.2+W*.62*s,y,'#f5d56a',2);
  ctx.globalAlpha=q_r(p,.6,1);q_ok('t = 1,5×10¹¹ / 3,0×10⁸ = 500 s',W*.5,H*.8,16);q_ok('≈ 8 min 20 s',W*.5,H*.93,16);ctx.globalAlpha=1;
 },
 /* 3 ombre d'un objet */ function(p){
  var y0=H*.58,xs=W*.1,xo=W*.1+W*.8*2/3,xe=W*.9,h=H*.12;
  q7_lamp(xs,y0,7);ctx.fillStyle=INK;ctx.fillRect(xo-4,y0-h,8,h);LN(xe,H*.1,xe,H*.9,INK,2.5);
  LN(xs,H*.9,xo,H*.9,GREY,1.4);A(xs,H*.9,xo-xs,0,GREY,'',1.4);TB('2,0 m',(xs+xo)/2,H*.9-6,INK,14);A(xo,H*.9,xe-xo,0,GREY,'',1.4);TB('1,0 m',(xo+xe)/2,H*.9-6,INK,14);TB('0,20 m',xo-8,y0-h-8,INK,13,'right');
  var s=q_r(p,0,.7),ye=y0-h*1.5;q7_ray(xs+6,y0,xo,y0-h,'#e0a418',2);q7_ray(xo,y0-h,xo+(xe-xo)*s,y0-h-(ye-(y0-h))*0+(y0-h-y0)*0.5*s*1.0,'#e0a418',2);
  q7_ray(xs+6,y0,xe,y0,'#e0a418',1,[3,3]);
  ctx.fillStyle='rgba(30,30,30,.7)';ctx.fillRect(xe-4,y0-h*1.5*s,8,h*1.5*s);
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);TB('0,30 m',xe-12,y0-h*.75,DRED,14,'right');q_ok('h = 0,20 × 3,0 / 2,0 = 0,30 m',W*.5,H*.1,15);q_ok('(b) lampe à 0,50 m',W*.28,H*.3,14);ctx.globalAlpha=1;}
 },
 /* 4 éclairement */ function(p){
  var x=W*.3,top=H*.14,gy=H*.84;q7_lamp(x,top,10);LN(x-W*.2,gy,x+W*.2,gy,INK,4);A(x,top+16,0,gy-top-18,GREY,'',1.6);TB('d = 2,0 m',x+10,(top+gy)/2,INK,15,'left');TB('200 cd',x+24,top+4,ORANGE,14,'left');
  ctx.fillStyle='rgba(245,213,106,.2)';ctx.beginPath();ctx.moveTo(x,top+12);ctx.lineTo(x-W*.17,gy);ctx.lineTo(x+W*.17,gy);ctx.fill();
  ctx.globalAlpha=q_r(p,0,.6);q_ok('E = 200 / 2,0² = 50 lx',W*.74,H*.34,15);q_ok('500 lx : d = √(200/500)',W*.74,H*.54,14);q_ok('≈ 0,63 m',W*.74,H*.72,17);ctx.globalAlpha=1;
 },
 /* 5 phases de la Lune */ function(p){
  var cx=W*.58,cy=H*.5,R=H*.3;q7_sun(W*.08,cy,18);for(var i=-2;i<=2;i++)A(W*.2,cy+i*22,W*.12,0,'#e0a418','',2);
  DOT(cx,cy,14,BLUE);DOT(cx-3,cy-3,5,GREEN);ctx.strokeStyle=GREY;ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();ctx.setLineDash([]);
  [PI,-PI/2,0,PI/2].forEach(function(an){q7_moonHalf(cx+R*Math.cos(an),cy+R*Math.sin(an),10,PI);});
  TB('Terre',cx,cy+30,BLUE_D,13);var a=q_r(p,0,.6);ctx.globalAlpha=a;q_ok('toujours une moitié éclairée',W*.62,H*.1,14);q_ok('position Lune–Terre–Soleil',W*.62,H*.94,14);ctx.globalAlpha=1;
 },
 /* 6 éloigner la lampe */ function(p){
  var y=H*.45,xs=W*.08;q7_lamp(xs,y,9);var xa=W*.36,xb=W*.76;
  ctx.fillStyle='rgba(245,213,106,.22)';ctx.beginPath();ctx.moveTo(xs,y);ctx.lineTo(xb,y-H*.36);ctx.lineTo(xb,y+H*.36);ctx.fill();
  LN(xa,y-H*.12,xa,y+H*.12,INK,3);LN(xb,y-H*.36,xb,y+H*.36,INK,3);
  ctx.fillStyle='rgba(245,166,35,.55)';ctx.fillRect(xa-2,y-H*.12,5,H*.24);
  A(xs,H*.9,xa-xs,0,GREY,'d',1.8);A(xs,H*.96,xb-xs,0,GREY,'3d',1.8);
  var a=q_r(p,0,.6);ctx.globalAlpha=a;TB('90 lx',xa+8,y-H*.16,DRED,15,'left');q_ok('aire × 9 → 90 / 9 = 10 lx',W*.4,H*.78,15);TB('10 lx',xb-8,y-H*.38,DGREEN,15,'right');ctx.globalAlpha=1;
 },
 /* 7 ombre et pénombre */ function(p){
  var y0=H*.5,xs=W*.1,xo=W*.1+W*.78/2,xe=W*.88,k=2,sc=H*.012,a=5*sc,b=10*sc,um=((b-a)*k+a),pe=((b+a)*k-a);
  ctx.fillStyle='rgba(255,230,140,.15)';ctx.beginPath();ctx.moveTo(xs,y0-a);ctx.lineTo(xo,y0-b);ctx.lineTo(xe,y0-pe);ctx.lineTo(xe,y0+pe);ctx.lineTo(xo,y0+b);ctx.lineTo(xs,y0+a);ctx.fill();
  ctx.fillStyle='#e0a418';ctx.fillRect(xs-5,y0-a,10,2*a);ctx.fillStyle=INK;ctx.fillRect(xo-4,y0-b,8,2*b);LN(xe,y0-pe-10,xe,y0+pe+10,INK,2);
  q7_ray(xs,y0-a,xo,y0-b,'#e0a418',1.3);q7_ray(xo,y0-b,xe,y0-(b-a)*k-a,'#e0a418',1.3);q7_ray(xs,y0+a,xo,y0-b,'#e0a418',1.3);q7_ray(xo,y0-b,xe,y0-pe,'#e0a418',1.3);
  var s=q_r(p,0,.6);ctx.fillStyle='rgba(120,120,120,.4)';ctx.fillRect(xe-4,y0-pe*s,8,2*pe*s);ctx.fillStyle='rgba(20,20,20,.85)';ctx.fillRect(xe-4,y0-um*s,8,2*um*s);
  TB('10 cm',xs,y0+a+24,INK,13);TB('20 cm',xo,y0+b+22,INK,13);TB('50 cm',(xs+xo)/2,H*.93,GREY,13);TB('50 cm',(xo+xe)/2,H*.93,GREY,13);
  if(s>.99){ctx.globalAlpha=q_r(p,.6,1);q_ok('ombre : 30 cm',W*.3,H*.12,16);q_ok('ombre + pénombre : 50 cm',W*.7,H*.12,15);ctx.globalAlpha=1;}
 },
 /* 8 éclipses */ function(p){
  var y=H*.5,ex=W*.06;DOT(ex,y,7,BLUE);
  var a=q_r(p,0,.7),xL=W*.4,rL=H*.075*(9.04/9.31)*1.0,xS=W*.85,rS=(xS-ex)*(rL/(xL-ex))*(9.31/9.04);
  rS=Math.min(rS,H*.38);var rL2=rS*(xL-ex)/(xS-ex)*(9.04/9.31);
  DOT(xS,y,rS,'#f5c443');q7_ray(ex,y,xS,y-rS,GREY,1.2,[4,3]);q7_ray(ex,y,xS,y+rS,GREY,1.2,[4,3]);
  DOT(xL,y,rL2,'#5b6470');TB('Lune',xL,y+rL2+18,INK,14);TB('Soleil',xS,y+rS+18,INK,14);
  if(a>0){ctx.globalAlpha=a;ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(xS,y,rS,0,7);ctx.stroke();ctx.globalAlpha=1;
   ctx.globalAlpha=q_r(p,.4,1);q_ok('Soleil : 9,31 × 10⁻³ rad',W*.55,H*.1,15);q_ok('Lune : 9,04 × 10⁻³ rad',W*.55,H*.24,15);q_ok('éclipse annulaire',W*.5,H*.93,16);ctx.globalAlpha=1;}
 },
 /* 9 chambre noire */ function(p){
  var y0=H*.52,xt=W*.1,xp=W*.58,xe=W*.88;LN(xp,H*.12,xp,y0-4,INK,3);LN(xp,y0+4,xp,H*.9,INK,3);LN(xe,H*.2,xe,H*.85,INK,2.5);
  LN(xt,y0+36,xt,y0-36,GREEN,6);DOT(xt,y0-46,12,'#9fd9bf');TB('arbre',xt,y0+60,INK,13);
  var s=q_r(p,0,.7);q7_ray(xt,y0-54,xp,y0,'#e0a418',1.6);q7_ray(xt,y0+36,xp,y0,'#e0a418',1.6);
  q7_ray(xp,y0,xp+(xe-xp)*s,y0+(.62*(xe-xp)*s/(xe-xp))*0+(54/(xp-xt))*(xe-xp)*s,'#e0a418',1.6);q7_ray(xp,y0,xp+(xe-xp)*s,y0-(36/(xp-xt))*(xe-xp)*s,'#e0a418',1.6);
  A(xt+0,H*.9,xp-xt,0,GREY,'',1.4);TB('30 m',(xt+xp)/2,H*.9-6,INK,13);A(xp,H*.9,xe-xp,0,GREY,'',1.4);TB('15 cm',(xp+xe)/2,H*.9-6,INK,13);
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('h\' = 12 × 0,15 / 30 = 6,0 cm',W*.5,H*.08,15);q_ok('renversée',W*.82,H*.3,14);TB('Soleil : 1,4 mm ; 1,08 m pour 1 cm',W*.5,H*.97,GREY,12);ctx.globalAlpha=1;}
 },
 /* 10 pleine lune sans éclipse */ function(p){
  var cx=W*.4,cy=H*.78,sc=H*.2;DOT(cx,cy,1.28*sc,'rgba(120,120,120,.25)');DOT(cx,cy,.72*sc,'rgba(30,30,30,.55)');ctx.strokeStyle=GREY;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,1.28*sc,0,7);ctx.stroke();
  TB('ombre',cx,cy+6,'#fff',13);TB('pénombre',cx+1.0*sc*.0,cy+1.28*sc*.0-1.1*sc,GREY,12);
  var a=q_r(p,0,.6);ctx.globalAlpha=Math.max(.6,a);var my=cy-3.0*sc;DOT(cx,my,.27*sc,'#f4efd8');ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,my,.27*sc,0,7);ctx.stroke();ctx.globalAlpha=1;
  A(cx+1.8*sc,cy,0,-3.0*sc,GREY,'',1.8);TB('3,0 RT',cx+1.8*sc+10,(cy+my)/2,INK,14,'left');
  if(a>0){ctx.globalAlpha=a;LN(cx,my+.27*sc,cx,cy-1.28*sc,RED,2.4);TB('2,73 > 1,28 RT',cx+8,(my+cy)/2-sc*1.1,DRED,13,'left');q_ok('pas d\'éclipse',W*.76,H*.7,16);ctx.globalAlpha=1;}
  TB('Terre → ombre',W*.74,H*.9,GREY,12);
 }
]);
