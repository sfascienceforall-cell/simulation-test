/* SFA · Biologie 6e · théorie animée et devantures (chapitre 05) */
(function(){
/* aides locales (portée de ce fichier) */
function sg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ga(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function g1(){ctx.globalAlpha=1;}
function F(fn){return function(p){ctx.save();var s=Math.min(W/460,H/280);ctx.translate((W-460*s)/2,(H-280*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(p||0);ctx.restore();};}
function G(fn){return function(t){ctx.save();var s=Math.min(W/700,H/300);ctx.translate((W-700*s)/2,(H-300*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(t||0);ctx.restore();};}
function box(x,y,w,h,col,fill,r,lw){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||AX;ctx.lineWidth=lw||2;ctx.beginPath();ctx.roundRect(x,y,w,h,r===undefined?8:r);ctx.fill();ctx.stroke();}
function ell(x,y,rx,ry,fill,st,lw,rot){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(st){ctx.strokeStyle=st;ctx.lineWidth=lw||2;ctx.stroke();}}
function chk(x,y,c,s){s=s||9;ctx.strokeStyle=c||DGREEN;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*.3,y+s*.7);ctx.lineTo(x+s,y-s*.8);ctx.stroke();}
function crs(x,y,c,s){s=s||8;ctx.strokeStyle=c||DRED;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y+s);ctx.moveTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.stroke();}
/* texte avec exposant : base puis petit texte relevé */
function sup(base,s,x,y,col,size,al){size=size||14;ctx.font='700 '+size+'px system-ui';var w1=ctx.measureText(base).width;ctx.font='700 '+(size*.62)+'px system-ui';var w2=ctx.measureText(s).width;
 var x0=al==='left'?x:al==='right'?x-w1-w2:x-(w1+w2)/2;ctx.fillStyle=col||INK;ctx.textAlign='left';ctx.font='700 '+size+'px system-ui';ctx.fillText(base,x0,y);ctx.font='700 '+(size*.62)+'px system-ui';ctx.fillText(s,x0+w1+1,y-size*.38);}
/* échiquier de Punnett : colonnes cx[], lignes, cases remplies selon p */
function pun(x,y,cw,top,side,cells,cols,pp,size){var n=top.length,m=side.length;size=size||17;
 for(var i=0;i<n;i++)TB(top[i],x+cw*(i+1.5),y+cw*.62,BLUE_D,size);
 for(var j=0;j<m;j++)TB(side[j],x+cw*.5,y+cw*(j+1)+cw*.62,DRED,size);
 for(var j=0;j<m;j++)for(var i=0;i<n;i++){var k=j*n+i,a=pp===undefined?1:sg(pp,k*.12,k*.12+.25);
  box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,AX,'#fafbfc',6);
  if(a>0){ga(a);box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,cols[k]||AX,(cols[k]||'#ccc')+'33',6);TB(cells[k],x+cw*(i+1.5),y+cw*(j+1.5)+size*.36,INK,size);g1();}}
}
function bar(x,y,w,h,col,lab,val,vs){ctx.fillStyle=col;ctx.fillRect(x,y-h,w,h);if(lab)TB(lab,x+w/2,y+16,INK,13);if(val!=null)TB(val,x+w/2,y-h-6,INK,vs||13);}
/* cellule de gamète : disque avec lettre */
function gam(x,y,r,c,l){DOT(x,y,r,c+'33');ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(l,x,y+r*.36,dk(c),Math.round(r*1.05));}
function drop(x,y,s,col,lab,fs){ctx.beginPath();ctx.moveTo(x,y-s*1.5);ctx.bezierCurveTo(x+s*.3,y-s*.8,x+s,y-s*.3,x+s,y+s*.35);ctx.arc(x,y+s*.35,s,0,PI,false);ctx.bezierCurveTo(x-s,y-s*.3,x-s*.3,y-s*.8,x,y-s*1.5);ctx.fillStyle=col+'33';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.stroke();if(lab)TB(lab,x,y+s*.55,dk(col),fs||Math.round(s*.95));}
function chX(x,y,s,col){LN(x-s*.5,y-s,x+s*.5,y+s,col,s*.3);LN(x+s*.5,y-s,x-s*.5,y+s,col,s*.3);}
function chY(x,y,s,col){LN(x-s*.5,y-s,x,y,col,s*.3);LN(x+s*.5,y-s,x,y,col,s*.3);LN(x,y,x,y+s,col,s*.3);}
function hsh(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function dish(cx,cy,r,lab){ell(cx,cy,r,r,'#fbf6e4','#8a7a4a',3);ell(cx,cy,r-5,r-5,null,'rgba(138,122,74,.35)',1.4);if(lab)TB(lab,cx,cy+r+18,INK,13);}
function cols(cx,cy,r,n,seed,col,pp,sz){var m=Math.round(n*(pp===undefined?1:pp));for(var k=0;k<m;k++){var a=hsh(k*3.1+seed)*6.2832,d=Math.sqrt(hsh(k*7.7+seed+9))*(r-10);DOT(cx+Math.cos(a)*d,cy+Math.sin(a)*d,sz||3.2,col);}}
function dbl(x,y,w,c1,c2,gap){LN(x,y-(gap||3),x+w,y-(gap||3),c1,2.6);LN(x,y+(gap||3),x+w,y+(gap||3),c2,2.6);}
function lane(x,y0,w,h){ctx.fillStyle='#eef1f4';ctx.fillRect(x,y0,w,h);}
function gelY(sz,top,H0){return top+(Math.log10(6000)-Math.log10(sz))/(Math.log10(6000)-Math.log10(200))*H0;}
SFA.theo("c05", {
 icon: function () {
  var gx=W*.1,gy=H*.1,gw=W*.36,gh=H*.66;ctx.fillStyle='#dfe9f5';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(gx,gy,gw,gh);
  var L=[[.2,.3,.55,.8],[.35,.6],[.15,.45,.7],[.5,.85]];
  for(var i=0;i<4;i++){var x=gx+gw*(.14+i*.22);ctx.fillStyle='#b9c6d8';ctx.fillRect(x-7,gy+4,14,5);L[i].forEach(function(v){ctx.fillStyle=i===0?GREY:(i%2?BLUE:RED);ctx.fillRect(x-8,gy+8+v*gh*.85,16,4);});}
  TB('−',gx+gw+14,gy+12,DRED,18);TB('+',gx+gw+14,gy+gh,BLUE_D,18);
  TB('2ⁿ',W*.74,H*.4,ORANGE,50);TB('copies après n cycles',W*.74,H*.4+26,GREY,13);
  TB('PCR · gel · plasmide · profil ADN',W*.5,H*.92,BLUE_D,16);
 },
 sub: [
 {t:"La PCR", anim: G(function (t) {
  var C=330,n=((t/C)|0)%4,u=(t%C)/C,ph=u<.33?0:u<.66?1:2,pu=u<.33?u/.33:u<.66?(u-.33)/.33:(u-.66)/.34;
  var N=Math.pow(2,n+(u>.95?1:0));
  /* courbe de température */
  var gx=30,gy=250,gw=360,gh=60;LN(gx,gy,gx+gw,gy,AX,1.5);
  var T=[[0,95],[.33,95],[.36,55],[.66,55],[.69,72],[1,72]];ctx.strokeStyle=ORANGE;ctx.lineWidth=2.4;ctx.beginPath();T.forEach(function(q,i){var x=gx+q[0]*gw,y=gy-(q[1]-50)/50*gh;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
  DOT(gx+u*gw,gy-((u<.33?95:u<.66?55:72)-50)/50*gh,6,RED);
  TB('95 °C',gx+gw*.16,gy-gh-8,DRED,13);TB('55 °C',gx+gw*.5,gy-18,BLUE_D,13);TB('72 °C',gx+gw*.84,gy-gh*.44-10,DGREEN,13);
  TB('cycle '+(n+1),gx,gy+22,INK,14,'left');
  /* molécule */
  var x0=50,w=300,y=100,sep=ph===0?pu:ph===1?1:1;
  var gap=ph===0?3+30*Math.min(1,pu*1.4):33;
  if(ph===0){dbl(x0,y,w,RED,BLUE,gap);TB('dénaturation : les brins se séparent',x0+w/2,50,DRED,15);}
  if(ph===1){dbl(x0,y,w,RED,BLUE,33);ctx.fillStyle=ORANGE;ctx.fillRect(x0+w-50,y-33-5,50,6);ctx.fillRect(x0,y+33-1,50,6);TB('amorces',x0+w-25,y-50,ORANGE,13);TB('amorces',x0+25,y+58,ORANGE,13);TB('hybridation des amorces',x0+w/2,50,BLUE_D,15);}
  if(ph===2){dbl(x0,y,w,RED,BLUE,33);var L=pu*(w-50);ctx.fillStyle=ORANGE;ctx.fillRect(x0+w-50,y-33-5,50,6);ctx.fillRect(x0,y+33-1,50,6);LN(x0+w-50,y-26,x0+w-50-L,y-26,GREEN,4);LN(x0+50,y+40,x0+50+L,y+40,GREEN,4);TB('élongation par l\'ADN polymérase',x0+w/2,50,DGREEN,15);}
  if(ph===2&&pu>.9){TB('→ 2 molécules',x0+w/2,176,DGREEN,16);}
  /* comptage */
  TB('N = N₀ × 2ⁿ',540,36,INK,18);
  for(var k=0;k<16;k++){var i=k%4,j=(k/4)|0,x=450+i*50,yy=70+j*36,lit=k<N;ga(lit?1:.18);dbl(x,yy,36,RED,BLUE,3);g1();}
  TB(nfmt(N)+' copie'+(N>1?'s':''),540,236,ORANGE,20);TB('(après '+(n+(u>.95?1:0))+' cycle'+((n+(u>.95?1:0))>1?'s':'')+')',540,258,GREY,13);
 }),
 th:'<div class="tcard"><b class="h">Principe de la PCR</b><p>La <b>PCR</b> (réaction en chaîne par polymérase) copie in vitro un fragment d\'ADN précis. Il faut : l\'<b>ADN matrice</b>, deux <b>amorces</b> qui encadrent la cible, des nucléotides libres et une <b>ADN polymérase thermostable</b> (Taq). Chaque cycle comprend trois étapes : <b>dénaturation</b> (95 °C : les deux brins se séparent), <b>hybridation</b> des amorces (environ 55 °C), <b>élongation</b> (72 °C : la polymérase synthétise les brins complémentaires).</p></div>'
 +'<div class="tcard"><b class="h">Une croissance exponentielle</b><p>À chaque cycle, le nombre de copies <b>double</b> : <b>N = N₀ × 2<sup>n</sup></b>. Une seule molécule donne 2<sup>10</sup> = 1 024 copies après 10 cycles et 2<sup>30</sup> ≈ 1,07·10<sup>9</sup> après 30 cycles. Si l\'efficacité est E (entre 0 et 1) : <b>N = N₀ × (1 + E)<sup>n</sup></b>. Avec E = 0,9 pendant 20 cycles, on n\'obtient que (1,9/2)<sup>20</sup> ≈ 36 % du maximum : de petites pertes s\'accumulent.</p></div>'
 +'<div class="tcard"><b class="h">Combien de cycles ?</b><p>On cherche n tel que N₀ × (1 + E)<sup>n</sup> = N, donc <b>n = ln(N / N₀) / ln(1 + E)</b>, arrondi au cycle supérieur. <i>Exemple</i> : de 10 à 10<sup>10</sup> copies, N/N₀ = 10<sup>9</sup>, ln = 20,72 : à 100 %, n = 20,72 / 0,693 ≈ 30 cycles ; à 90 %, n = 20,72 / 0,642 ≈ 33 cycles. Masse : 10<sup>10</sup> fragments de 800 pb (650 g/mol par pb) ≈ 8,6 ng, à peine visible sur un gel.</p></div>'
 +'<div class="tcard"><b class="h">Usages et limites</b><p>Diagnostic (virus, mutations), empreinte génétique, clonage de gènes. La PCR est très sensible : une <b>contamination</b> par quelques molécules étrangères est amplifiée aussi. En pratique la courbe exponentielle finit par un plateau (réactifs épuisés).</p></div>'},
 {t:"Enzymes et électrophorèse", anim: G(function (t) {
  var ph=(t%700)/700,cut=sg(ph,.08,.3),mig=sg(ph,.4,.85);
  /* ADN et coupures */
  var x0=30,w=300,y=70,k=w/5000;TB('ADN linéaire de 5 000 pb',x0+w/2,34,INK,15);
  var segs=[[0,1200,BLUE],[1200,3100,ORANGE],[3100,5000,GREEN]];
  segs.forEach(function(s,i){var off=(i-1)*18*cut;ctx.fillStyle=s[2];ctx.fillRect(x0+s[0]*k+off,y-8,(s[1]-s[0])*k-2,16);});
  ga(1-cut);LN(x0+1200*k,y-20,x0+1200*k,y+20,RED,2,[3,3]);LN(x0+3100*k,y-20,x0+3100*k,y+20,RED,2,[3,3]);TB('✂',x0+1200*k,y-24,DRED,16);TB('✂',x0+3100*k,y-24,DRED,16);g1();
  ga(cut);TB('1 200 pb',x0+600*k-9,y+36,DGREEN*0||BLUE_D,13);TB('1 900 pb',x0+2150*k,y+36,ORANGE,13);TB('1 900 pb',x0+4050*k+18,y+36,DGREEN,13);g1();
  /* gel */
  var gx=380,gy=20,gw=300,gh=260,top=gy+30,H0=gh-50;ctx.fillStyle='#dfe9f5';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(gx,gy,gw,gh);
  TB('−',gx+gw+14,gy+16,DRED,18);TB('+',gx+gw+14,gy+gh-4,BLUE_D,18);
  var lx=[gx+70,gx+150,gx+230];['marqueur','ADN coupé'].forEach(function(s,i){TB(s,lx[i]-0,gy-6+0,GREY,1);});
  TB('marqueur',lx[0],gy+14,GREY,12);TB('échantillon',lx[1]+0,gy+14,GREY,12);
  [lx[0],lx[1]].forEach(function(x){ctx.fillStyle='#b9c6d8';ctx.fillRect(x-20,gy+22,40,6);});
  var ladder=[5000,3000,2000,1000,500],sample=[[1900,2.2,ORANGE],[1200,1,BLUE]];
  ladder.forEach(function(s){var y2=top+(gelY(s,0,H0)*mig);ctx.fillStyle=GREY;ctx.fillRect(lx[0]-18,y2,36,4);TB(nfmt(s),lx[0]-26,y2+5,GREY,11,'right');});
  sample.forEach(function(s){var y2=top+gelY(s[0],0,H0)*mig;ctx.fillStyle=s[2];ctx.fillRect(lx[1]-18,y2,36,3+s[1]*3);});
  ga(sg(ph,.85,1));TB('petits fragments : plus loin',gx+gw/2+60,gy+gh-18,DGREEN,12);g1();
  TB('champ électrique',gx+gw-52,gy+60,GREY,1);
 }),
 th:'<div class="tcard"><b class="h">Enzymes de restriction et ligase</b><p>Une <b>enzyme de restriction</b> (EcoRI, BamHI…) reconnaît une courte séquence d\'ADN (souvent 4 à 8 nucléotides, palindromique) et <b>coupe</b> l\'ADN à cet endroit. L\'<b>ADN ligase</b> <b>relie</b> ensuite des fragments. Ces deux enzymes permettent de découper un gène et de l\'insérer dans un plasmide. Il ne faut pas les confondre avec l\'<b>ADN polymérase</b>, qui copie l\'ADN.</p></div>'
 +'<div class="tcard"><b class="h">L\'électrophorèse sur gel</b><p>L\'ADN est chargé <b>négativement</b> : dans un champ électrique, il migre dans le gel vers le pôle <b>+</b>. Les <b>petits fragments</b> migrent <b>plus loin</b> (le gel freine les grands). Un <b>marqueur de taille</b> (échelle de fragments connus) permet d\'estimer les tailles. L\'intensité d\'une bande est liée à la <b>quantité d\'ADN</b>.</p></div>'
 +'<div class="tcard"><b class="h">Méthode : lire un résultat de coupure</b><p>1) Placer les sites de coupure sur la molécule. 2) Les fragments sont les distances entre deux coupures successives (et les extrémités). 3) Vérifier que la somme donne la taille totale. 4) Les fragments de même taille forment une seule bande, plus intense. <i>Exemple</i> : 5 000 pb coupés à 1 200 et 3 100 → 1 200, 1 900 et 1 900 pb : <b>2 bandes</b> sur le gel (1 900 pb deux fois plus intense), la plus proche du pôle + étant celle de 1 200 pb. Pour un ADN circulaire (plasmide), n coupures donnent n fragments.</p></div>'},
 {t:"Transformation et criblage", anim: G(function (t) {
  var ph=(t%720)/720,pos=[[110,'sans antibiotique','2 000 colonies'],[350,'+ ampicilline','50 colonies'],[590,'+ ampicilline + X-gal','30 bleues · 20 blanches']];
  TB('2 000 bactéries étalées (2,5 % ont un plasmide)',350,24,INK,15);
  pos.forEach(function(q,i){var a=sg(ph,i*.28,i*.28+.12);dish(q[0],130,66);
   var g=sg(ph,i*.28+.08,i*.28+.3);
   if(i===0){cols(q[0],130,66,300,1,'#c9b27a',g,2.4);}
   if(i===1){cols(q[0],130,66,50,5,'#b49a52',g,3.6);}
   if(i===2){cols(q[0],130,66,30,11,BLUE,g,3.8);cols(q[0],130,66,20,23,'#fffef8',g,3.8);var m=Math.round(20*g);for(var k=0;k<m;k++){var aa=hsh(k*3.1+23)*6.2832,d=Math.sqrt(hsh(k*7.7+32))*56;ctx.strokeStyle='#8a7a4a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(q[0]+Math.cos(aa)*d,130+Math.sin(aa)*d,3.8,0,7);ctx.stroke();}}
   TB(q[1],q[0],218,INK,14);ga(g);TB(q[2],q[0],240,i===2?DRED:ORANGE,15);g1();});
  ga(sg(ph,.8,1));TB('blanc = plasmide recombinant (lacZ interrompu)',350,282,DGREEN,14);g1();
 }),
 th:'<div class="tcard"><b class="h">Cloner un gène dans une bactérie</b><p>1) Couper le gène d\'intérêt et le <b>plasmide</b> (petit ADN circulaire bactérien) avec la même enzyme de restriction. 2) <b>Ligaturer</b> : le gène s\'insère dans le plasmide (plasmide recombinant). 3) <b>Transformer</b> des bactéries : seule une petite fraction absorbe un plasmide. 4) <b>Sélectionner</b> les clones. Le plasmide porte un gène de <b>résistance à l\'ampicilline</b> et le gène <b>lacZ</b>, dans lequel on insère le gène d\'intérêt.</p></div>'
 +'<div class="tcard"><b class="h">Sélection et criblage</b><p>Avec <b>ampicilline</b>, seules les bactéries qui ont un plasmide (quel qu\'il soit) forment des colonies. Avec <b>X-gal</b>, une enzyme lacZ intacte transforme X-gal en colorant bleu : colonie <b>bleue</b> = plasmide sans insert ; colonie <b>blanche</b> = plasmide recombinant (lacZ interrompu). <i>Exemple</i> : 2 000 bactéries, 2,5 % transformées → 50 colonies sur ampicilline ; 40 % de plasmides recombinants → 20 blanches, 30 bleues. La couleur n\'est qu\'un criblage : on vérifie ensuite par PCR ou séquençage.</p></div>'
 +'<div class="tcard"><b class="h">Applications</b><p><b>OGM</b> : organisme dont le génome a été modifié par l\'ajout d\'un gène (insuline humaine produite par des bactéries ; plantes résistantes). <b>CRISPR-Cas9</b> : une enzyme (Cas9) guidée par un ARN guide coupe l\'ADN à un endroit choisi, ce qui permet d\'inactiver ou de corriger un gène. <b>Thérapie génique</b> : introduire une version correcte d\'un gène dans des cellules d\'un patient. <b>Clonage</b> (Dolly) : transfert d\'un noyau de cellule adulte dans un ovocyte énucléé ; ce n\'est pas un OGM, mais l\'ADN mitochondrial vient de l\'ovocyte et l\'environnement influence le phénotype.</p></div>'},
 {t:"Profil ADN et enjeux", anim: G(function (t) {
  var ph=(t%800)/800,fr=[0.10,0.20,0.05,0.10,0.10],lb=['0,10','0,20','0,05','0,10','0,10'],prod=1;
  TB('5 marqueurs indépendants : on multiplie',350,24,INK,16);
  var shown=Math.floor(ph/.14);
  for(var i=0;i<5;i++){var x=24+i*130,on=i<=shown;ga(on?1:.2);box(x,44,100,52,BLUE,'#e6f1fb',8);TB('marqueur '+(i+1),x+50,64,GREY,12);TB(lb[i],x+50,88,BLUE_D,22);if(i<4)TB('×',x+115,78,GREY,20);g1();}
  for(var i=0;i<=Math.min(shown,4);i++)prod*=fr[i];
  var bw=600*Math.min(1,Math.log10(1/prod)/5);
  TB('probabilité d\'avoir ce profil par hasard',350,142,INK,14);
  ctx.fillStyle='#eef1f4';ctx.fillRect(50,152,600,24);ctx.fillStyle=ORANGE;ctx.fillRect(50,152,bw,24);
  var tx=prod>=.0999?'0,10':prod>=.01?'1 sur '+Math.round(1/prod):'1 sur '+nfmt(Math.round(1/prod));TB(tx,350,200,DRED,30);
  var b=sg(ph,.75,.92);ga(b);box(150,220,400,54,ORANGE,'#fdf5e9',10);TB('ville de 500 000 habitants : 5 personnes',350,244,INK,15);TB('≠ probabilité que l\'accusé soit innocent',350,264,DRED,14);g1();
 }),
 th:'<div class="tcard"><b class="h">Le profil ADN (empreinte génétique)</b><p>On analyse des régions très variables du génome (répétitions en tandem, ou STR) en <b>plusieurs marqueurs</b>. La PCR amplifie ces régions et l\'électrophorèse compare les profils de deux échantillons. Deux jumeaux monozygotes ont le même profil ; deux apparentés se ressemblent plus que deux inconnus.</p></div>'
 +'<div class="tcard"><b class="h">La force d\'une preuve : le produit des fréquences</b><p>Pour des marqueurs indépendants, la probabilité qu\'une personne au hasard ait un profil donné est le <b>produit</b> des fréquences : 0,10 × 0,20 × 0,05 × 0,10 × 0,10 = 1,0·10<sup>−5</sup>, soit 1 chance sur 100 000. Dans une ville de 500 000 habitants : 500 000 × 10<sup>−5</sup> = <b>5 personnes</b> ont en moyenne ce profil. Avec 13 marqueurs, on atteint environ 1 sur 10<sup>15</sup> : le profil est quasi unique.</p></div>'
 +'<div class="tcard"><b class="h">Ne pas se tromper de probabilité</b><p><b>P(profil | innocent)</b> = 1/100 000 n\'est pas <b>P(innocent | profil)</b>. Si l\'accusé n\'était désigné que par ce profil, avec 5 autres porteurs attendus dans la ville, sa culpabilité ne serait que de l\'ordre de 1 chance sur 6 : il faut d\'autres éléments. Même avec 13 marqueurs, il reste à exclure une erreur de laboratoire, une contamination, un apparenté, et à établir <b>quand</b> et <b>comment</b> la trace a été déposée.</p></div>'
 +'<div class="tcard"><b class="h">Enjeux éthiques</b><p>Fichiers d\'empreintes génétiques et vie privée, consentement, usage des données par des assureurs ou employeurs, modification du génome humain (cellules germinales), brevetabilité du vivant, accès équitable aux thérapies. Une réponse argumentée distingue ce qui est <b>techniquement possible</b> de ce qui est <b>socialement souhaitable</b>.</p></div>'}
 ]
});
SFA.figs("c05", [
 F(function(p){ /* 1 copies après 10 cycles */
  var gx=50,gy=230,gw=330,gh=170;TB('copies',34,34,GREY,12);LN(gx,gy,gx+gw+10,gy,AX,1.6);LN(gx,gy,gx,gy-gh-10,AX,1.6);TB('cycles',gx+gw,gy+22,GREY,12);
  var a=sg(p,0,.8);ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();for(var n=0;n<=10*a;n+=.2){var x=gx+n/10*gw,y=gy-Math.pow(2,n)/1024*gh;n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(var n=0;n<=10;n+=2){TB(String(n),gx+n/10*gw,gy+16,GREY,11);}
  for(var n=0;n<=10*a;n++){DOT(gx+n/10*gw,gy-Math.pow(2,n)/1024*gh,3.4,RED);}
  ga(sg(p,.7,1));TB('10 cycles : 1 024',gx+gw*.55,gy-gh*.8,DRED,17,'right');TB('30 cycles : ≈ 1,07 · 10⁹',gx+gw*.55,gy-gh*.8+26,DRED,15,'right');g1();
  TB('N = 1 × 2ⁿ',90,70,INK,18,'left');
 }),
 F(function(p){ /* 2 enzyme de restriction */
  var s=sg(p,.2,.8),y=100;TB('enzyme de restriction : EcoRI',230,28,INK,16);
  var seq='ATGCGAATTCGGTAC'.split('');
  for(var i=0;i<seq.length;i++){var x=40+i*26,hi=i>=4&&i<=9,left=i<=4;var dx=(left?-1:1)*s*22;ctx.fillStyle=hi?'#fdf5e9':'#fff';ctx.fillRect(x-11+dx,y-18,22,36);ctx.strokeStyle=hi?ORANGE:AX;ctx.lineWidth=1.6;ctx.strokeRect(x-11+dx,y-18,22,36);TB(seq[i],x+dx,y+6,hi?DRED:INK,18);}
  ga(1-s);LN(40+4*26+13,y-34,40+4*26+13,y+34,RED,2.6,[4,3]);g1();
  TB('GAATTC',40+7*26,y+44,ORANGE,16);TB('site de reconnaissance',40+7*26,y+62,GREY,12);
  ga(sg(p,.5,1));box(70,190,320,56,DGREEN,'#e8f7f1',10);TB('coupe l\'ADN à une séquence précise',230,224,DGREEN,16);g1();
  ga(1-sg(p,0,.5));TB('rôle ?',230,224,GREY,18);g1();
 }),
 F(function(p){ /* 3 bandes sur le gel */
  var x0=20,w=240,y=50,k=w/5000;TB('5 000 pb',x0+w/2,28,INK,14);
  var segs=[[0,1200,BLUE],[1200,3100,ORANGE],[3100,5000,GREEN]],a=sg(p,0,.4);
  segs.forEach(function(s,i){ctx.fillStyle=s[2];ctx.fillRect(x0+s[0]*k+(i-1)*8*a,y-8,(s[1]-s[0])*k-2,16);});
  LN(x0+1200*k,y-16,x0+1200*k,y+16,RED,2,[3,3]);LN(x0+3100*k,y-16,x0+3100*k,y+16,RED,2,[3,3]);
  ga(a);TB('1 200',x0+600*k-4,y+34,BLUE_D,13);TB('1 900',x0+2150*k,y+34,ORANGE,13);TB('1 900',x0+4050*k+8,y+34,DGREEN,13);g1();
  var gx=290,gy=20,gw=150,gh=240;ctx.fillStyle='#dfe9f5';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(gx,gy,gw,gh);TB('−',gx+gw-12,gy+16,DRED,14);TB('+',gx+gw-12,gy+gh-6,BLUE_D,14);
  var b=sg(p,.4,1),top=gy+30,H0=gh-50;ctx.fillStyle='#b9c6d8';ctx.fillRect(gx+20,gy+14,36,5);ctx.fillRect(gx+80,gy+14,36,5);
  [[1000,GREY],[2000,GREY],[3000,GREY]].forEach(function(s){ctx.fillStyle=s[1];ctx.fillRect(gx+20,top+gelY(s[0],0,H0),36,3);});
  ctx.fillStyle=ORANGE;ctx.fillRect(gx+80,top+gelY(1900,0,H0)*b+(1-b)*0,36,10);ctx.fillStyle=BLUE;ctx.fillRect(gx+80,top+gelY(1200,0,H0)*b,36,5);
  ga(b);TB('1 900 (×2)',gx+130,top+gelY(1900,0,H0)+10,ORANGE,1);g1();
  ga(sg(p,.7,1));TB('2 bandes',230,150,INK,18,'right');TB('1 900 : intense',230,176,ORANGE,14,'right');TB('1 200 : plus loin',230,198,BLUE_D,14,'right');g1();
  ga(1-sg(p,0,.4));TB('?',150,150,GREY,40);g1();
 }),
 F(function(p){ /* 4 PCR moins efficace */
  var gx=50,gy=232,gw=300,gh=190;LN(gx,gy,gx+gw+20,gy,AX,1.6);LN(gx,gy,gx,gy-gh-20,AX,1.6);TB('cycles',gx+gw+10,gy+20,GREY,12);TB('copies',gx+10,gy-gh-26,GREY,12,'left');
  var a=sg(p,0,.8);
  [[2,RED],[1.9,BLUE]].forEach(function(q){ctx.strokeStyle=q[1];ctx.lineWidth=3.2;ctx.beginPath();for(var n=0;n<=20*a;n+=.5){var x=gx+n/20*gw,y=gy-100*Math.pow(q[0],n)/(100*Math.pow(2,20))*gh;n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});
  for(var n=0;n<=20;n+=5)TB(String(n),gx+n/20*gw,gy+16,GREY,11);
  ga(sg(p,.6,1));TB('100 % : 1,05·10⁸',gx+gw-6,gy-gh-8,DRED,14,'right');TB('90 % : 3,8·10⁷ (36 %)',gx+gw+16,gy-gh*.36-14,BLUE_D,14,'right');g1();
  TB('départ : 100 copies, 20 cycles',230,268,INK,14);
 }),
 F(function(p){ /* 5 compter les colonies */
  var pos=[[80,'sans antibiotique'],[230,'ampicilline'],[380,'amp. + X-gal']],r=62,y=96;
  pos.forEach(function(q,i){dish(q[0],y,r);TB(q[1],q[0],y+r+20,INK,13);});
  cols(80,y,r,300,1,'#c9b27a',1,2.4);TB('2 000',80,y+r+42,DRED,16);
  var a=sg(p,0,.8);cols(230,y,r,50,5,'#b49a52',a,3.6);cols(380,y,r,30,11,BLUE,a,3.8);
  var m=Math.round(20*a);for(var k=0;k<m;k++){var aa=hsh(k*3.1+23)*6.2832,d=Math.sqrt(hsh(k*7.7+32))*(r-10);DOT(380+Math.cos(aa)*d,y+Math.sin(aa)*d,3.8,'#fffef8');ctx.strokeStyle='#8a7a4a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(380+Math.cos(aa)*d,y+Math.sin(aa)*d,3.8,0,7);ctx.stroke();}
  ga(sg(p,.5,1));TB('50',230,y+r+42,DRED,16);TB('30 bleues · 20 blanches',380,y+r+42,DRED,13);g1();
  ga(1-sg(p,0,.4));TB('?',230,y+r+42,GREY,16);g1();
  TB('2 000 bactéries · 2,5 % transformées · 40 % recombinantes',230,20,GREY,12);
 }),
 F(function(p){ /* 6 colonie blanche */
  dish(110,110,80);cols(110,110,80,26,4,BLUE,1,4.2);
  for(var k=0;k<7;k++){var aa=hsh(k*3.1+9)*6.2832,d=Math.sqrt(hsh(k*7.7+13))*68;DOT(110+Math.cos(aa)*d,110+Math.sin(aa)*d,4.2,'#fffef8');ctx.strokeStyle='#8a7a4a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(110+Math.cos(aa)*d,110+Math.sin(aa)*d,4.2,0,7);ctx.stroke();}
  TB('ampicilline + X-gal',110,222,INK,13);
  var a=sg(p,.1,.8);
  ctx.strokeStyle=DRED;ctx.lineWidth=3;ctx.beginPath();ctx.arc(110+Math.cos(hsh(9)*6.2832)*Math.sqrt(hsh(13))*68,110+Math.sin(hsh(9)*6.2832)*Math.sqrt(hsh(13))*68,11,0,7);ctx.stroke();
  /* plasmide */
  var cx=340,cy=118,R=64;ctx.lineWidth=14;ctx.strokeStyle='#cfd6df';ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  ctx.strokeStyle=ORANGE;ctx.beginPath();ctx.arc(cx,cy,R,-2.9,-1.6);ctx.stroke();TB('ampᴿ',cx-62,cy-58,ORANGE,13);
  ctx.strokeStyle=BLUE;ctx.beginPath();ctx.arc(cx,cy,R,.2,2.6);ctx.stroke();
  ga(a);ctx.strokeStyle=GREEN;ctx.lineWidth=18;ctx.beginPath();ctx.arc(cx,cy,R,1.1,1.7);ctx.stroke();TB('insert',cx-8,cy+R+34,DGREEN,14);g1();
  TB('lacZ',cx+58,cy+52,BLUE_D,13);
  ga(a);box(250,196,200,56,DGREEN,'#e8f7f1',10);TB('lacZ interrompu',350,220,INK,13);TB('plasmide recombinant',350,242,DGREEN,15);g1();
  ga(1-a);TB('colonie blanche = ?',350,226,GREY,16);g1();
 }),
 F(function(p){ /* 7 produit des fréquences */
  var lb=['0,10','0,20','0,05','0,10','0,10'];
  for(var i=0;i<5;i++){var x=14+i*88;box(x,24,70,46,BLUE,'#e6f1fb',8);TB(lb[i],x+35,56,BLUE_D,20);if(i<4)TB('×',x+79,54,GREY,18);}
  TB('5 marqueurs indépendants',230,16,GREY,12);
  var a=sg(p,0,.6);ga(a);A(230,78,0,28,GREY,'',2.4);box(110,112,240,48,ORANGE,'#fdf5e9',10);TB('10⁻⁵ = 1 sur 100 000',230,144,DRED,20);g1();
  var b=sg(p,.5,1);ga(b);TB('500 000 habitants',230,188,INK,15);
  for(var k=0;k<5;k++)DOT(150+k*40,226,9,RED);TB('≈ 5 personnes',230,264,DRED,17);g1();
  ga(1-a);TB('?',230,140,GREY,34);g1();
 }),
 F(function(p){ /* 8 Dolly */
  function cell(x,y,r,nuc,mt){ell(x,y,r,r,'#f6f9fc',INK,2.2);if(nuc)ell(x-r*.15,y,r*.38,r*.38,nuc,INK,1.6);if(mt)for(var i=0;i<4;i++)ell(x+r*.45*Math.cos(i*1.6+.6),y+r*.55*Math.sin(i*1.6+.6),r*.12,r*.07,mt,null,0,i);}
  cell(60,60,38,BLUE,null);TB('cellule mammaire',60,118,GREY,12);TB('(donneuse)',60,134,GREY,12);
  cell(60,200,38,null,GREEN);TB('ovocyte énucléé',60,258,GREY,12);
  A(104,72,60,50,GREY,'',2.4);A(104,200,60,-48,GREY,'',2.4);
  cell(220,130,44,BLUE,GREEN);TB('embryon',220,190,GREY,12);
  A(268,130,50,0,GREY,'',2.4);TB('mère porteuse',350,96,GREY,12);ell(350,120,26,18,'#f6f9fc',INK,2);
  A(350,146,0,34,GREY,'',2.4);cell(350,210,32,BLUE,GREEN);TB('Dolly',350,262,INK,14);
  var a=sg(p,.2,.9);ga(a);TB('noyau : donneuse',220,76,BLUE_D,12);TB('mitochondries : ovocyte',220,206,DGREEN,12);g1();
  ga(a);TB('clone très proche, pas strictement identique, ni OGM',230,276,INK,12);g1();
 }),
 F(function(p){ /* 9 cycles pour un signal */
  var gx=50,gy=232,gw=330,gh=190;LN(gx,gy,gx+gw+10,gy,AX,1.6);LN(gx,gy,gx,gy-gh-10,AX,1.6);TB('cycles',gx+gw,gy+20,GREY,12);TB('copies (échelle log)',gx+8,gy-gh-20,GREY,12,'left');
  function Y(v){return gy-Math.log10(v)/10*gh;}
  for(var e=0;e<=10;e+=2){LN(gx-3,Y(Math.pow(10,e)),gx,Y(Math.pow(10,e)),GREY,1);TB('10'+['⁰','','²','','⁴','','⁶','','⁸','','¹⁰'][e],gx-6,Y(Math.pow(10,e))+4,GREY,11,'right');}
  LN(gx,Y(1e10),gx+gw,Y(1e10),INK,1.6,[5,4]);
  var a=sg(p,0,.8);
  [[2,30,RED],[1.9,33,BLUE]].forEach(function(q){var n1=q[1]*a;ctx.strokeStyle=q[2];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,Y(10));ctx.lineTo(gx+n1/35*gw,Y(10*Math.pow(q[0],n1)));ctx.stroke();});
  ga(sg(p,.7,1));DOT(gx+30/35*gw,Y(1e10),5,RED);DOT(gx+33/35*gw,Y(1e10),5,BLUE);TB('30 cycles',gx+30/35*gw-4,Y(1e10)+22,DRED,13,'right');TB('33 cycles',gx+33/35*gw+10,Y(1e10)+38,BLUE_D,13,'right');
  TB('10¹⁰ copies × 800 pb ≈ 8,6 ng',gx+gw*.68,gy-40,DGREEN,13);g1();
  TB('100 %',gx+80,Y(1e5)-20,DRED,13);TB('90 %',gx+gw*.55,Y(1e3)+10,BLUE_D,13);
 }),
 F(function(p){ /* 10 13 marqueurs */
  TB('suspect',20,70,GREY,12,'left');TB('trace',20,150,GREY,12,'left');
  for(var i=0;i<13;i++){var x=76+i*28,h1=14+hsh(i*3.3)*40;ctx.fillStyle='#8da3bd';ctx.fillRect(x,100-h1,16,h1);ctx.fillStyle='#8da3bd';ctx.fillRect(x,180-h1,16,h1);
   var a=sg(p,i*.04,i*.04+.2);ga(a);LN(x+8,102,x+8,134,GREEN,2,[3,3]);g1();}
  LN(70,100,444,100,AX,1.5);LN(70,180,444,180,AX,1.5);
  TB('13 marqueurs concordants',260,28,INK,16);
  var b=sg(p,.5,1);ga(b);box(40,200,380,64,ORANGE,'#fdf5e9',10);TB('P(profil | au hasard) = 1 / 10¹⁵',230,226,DRED,18);TB('à vérifier : contamination, erreur, apparenté, date du dépôt',230,250,GREY,12);g1();
  ga(1-b);TB('preuve ?',230,238,GREY,20);g1();
 })
]);
})();
