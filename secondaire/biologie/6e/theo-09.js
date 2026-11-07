/* SFA · Biologie 6e · théorie animée et devantures (chapitre 09) */
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
function rk(r,a,e,m,x,y,n,dt){var X=[x],Y=[y];function f(x,y){return [r*x-a*x*y,e*a*x*y-m*y];}for(var i=0;i<n;i++){var k1=f(x,y),k2=f(x+dt/2*k1[0],y+dt/2*k1[1]),k3=f(x+dt/2*k2[0],y+dt/2*k2[1]),k4=f(x+dt*k3[0],y+dt*k3[1]);x+=dt/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);y+=dt/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);X.push(x);Y.push(y);}return {x:X,y:Y};}
var PP=rk(.4,.008,.5,.2,70,40,2400,.05);
function axs(gx,gy,gw,gh,lx,ly){LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);if(lx)TB(lx,gx+gw,gy+30,GREY,12,'right');if(ly)TB(ly,gx+6,gy-gh-10,GREY,12,'left');}
function tree(x,y,s){ctx.fillStyle='#8a6a3a';ctx.fillRect(x-7*s,y-60*s,14*s,60*s);ell(x,y-84*s,46*s,38*s,'#cfe6c4',DGREEN,2.4);LN(x,y-50*s,x-30*s,y-84*s,'#8a6a3a',4);LN(x,y-50*s,x+30*s,y-84*s,'#8a6a3a',4);}
function bird(x,y,s,col){ell(x,y,12*s,8*s,col,INK,1.6);ell(x+11*s,y-5*s,6*s,5*s,col,INK,1.6);ctx.fillStyle=ORANGE;ctx.beginPath();ctx.moveTo(x+16*s,y-5*s);ctx.lineTo(x+23*s,y-3*s);ctx.lineTo(x+16*s,y-2*s);ctx.fill();}
SFA.theo("c09", {
 icon: function () {
  var gx=W*.1,gy=H*.8,gw=W*.5,gh=H*.6;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);
  ctx.strokeStyle=GREY;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(gx,gy-gh*.8);ctx.lineTo(gx+gw,gy-gh*.8);ctx.stroke();ctx.setLineDash([]);TB('K',gx-10,gy-gh*.8+4,GREY,14);
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3.4;ctx.beginPath();for(var i=0;i<=gw;i+=3){var tt=i/gw*10-5,y=gy-gh*.8/(1+Math.exp(-tt));i?ctx.lineTo(gx+i,y):ctx.moveTo(gx+i,y);}ctx.stroke();
  TB('dN/dt = rN(1 − N/K)',W*.8,H*.4,BLUE_D,15);TB('niches',W*.8,H*.62,GREEN,18);TB('proies · prédateurs',W*.8,H*.8,VIOLET,15);
 },
 sub: [
 {t:"Croissance d'une population", anim: G(function (t) {
  var T=(t%800)/800*16,gx=50,gy=260,gw=420,gh=210,K=500,r=.5;
  axs(gx,gy,gw,gh,'temps (années)','effectif N');
  ctx.strokeStyle=GREY;ctx.setLineDash([5,4]);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(gx,gy-K/600*gh);ctx.lineTo(gx+gw,gy-K/600*gh);ctx.stroke();ctx.setLineDash([]);TB('K = 500',gx+gw,gy-K/600*gh-6,GREY,13,'right');
  function Y(n){return gy-Math.min(n,610)/600*gh;}
  var cur=function(f,col,lw){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();for(var s=0;s<=T;s+=.1){var x=gx+s/16*gw,y=Y(f(s));s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();};
  cur(function(s){return 10*Math.exp(r*s);},'#c8ccd0',2.2);cur(function(s){return K/(1+49*Math.exp(-r*s));},ORANGE,3.2);
  var N=K/(1+49*Math.exp(-r*T)),v=r*N*(1-N/K);DOT(gx+T/16*gw,Y(N),7,RED);
  TB('exponentielle',gx+gw*.45,gy-gh+6,GREY,13,'left');TB('logistique',gx+gw*.5,gy-K/600*gh+22,ORANGE,14,'left');
  /* vitesse */
  var bx=530;TB('vitesse dN/dt',bx+60,60,INK,15);ctx.fillStyle='#eef1f4';ctx.fillRect(bx+40,80,40,160);ctx.fillStyle=BLUE;var hv=v/62.5*160;ctx.fillRect(bx+40,240-hv,40,hv);
  TB(String(Math.round(v)).replace('.',',')+' / an',bx+60,262,BLUE_D,15);TB('max à N = K/2',bx+60,282,GREY,12);
  TB('N = '+Math.round(N),bx+60,40,RED,15);
 }),
 th:'<div class="tcard"><b class="h">Croissance exponentielle et logistique</b><p>Sans limite de ressources, une population croît de façon <b>exponentielle</b> : <b>N = N₀·e<sup>rt</sup></b> (r : taux de croissance). Dans un milieu réel, des <b>facteurs limitants</b> (nourriture, espace, prédateurs, maladies) freinent la croissance : elle est <b>logistique</b>, <b>dN/dt = r·N·(1 − N/K)</b>, avec K la <b>capacité d\'accueil</b> du milieu. La courbe en S monte presque exponentiellement puis se stabilise à K ; la vitesse est maximale pour N = K/2.</p></div>'
 +'<div class="tcard"><b class="h">Calculs</b><p>r = 0,4 par an, K = 1 000, N = 200 : dN/dt = 0,4 × 200 × (1 − 0,2) = <b>64 individus par an</b>. Solution logistique : <b>N(t) = K / (1 + ((K − N₀)/N₀)·e<sup>−rt</sup>)</b>. Pour N₀ = 10, r = 0,5, K = 500 et t = 10 : exponentielle 10 × e<sup>5</sup> ≈ 1 484 (absurde, bien au-dessus de K) ; logistique 500 / (1 + 49 × 0,00674) ≈ <b>376</b>.</p></div>'
 +'<div class="tcard"><b class="h">Prélèvement durable (pêche, chasse)</b><p>Si l\'on prélève chaque année une fraction h : à l\'équilibre N* = K(1 − h/r) et le rendement vaut h × N*. Il est <b>maximal pour h = r/2</b>, avec N* = K/2 et un rendement r·K/4 (r = 0,6, K = 5 000 : 30 %, 2 500 poissons, 750 par an). Si h ≥ r, la population s\'effondre jusqu\'à l\'<b>extinction</b>. Viser le maximum est risqué : une mauvaise année, et le prélèvement devient excessif. On vise donc un prélèvement plus prudent.</p></div>'},
 {t:"Niches, compétition et interactions", anim: G(function (t) {
  var ph=(t%800)/800,d=.9+(1+Math.sin(ph*6.2832-1.57))*.5*1.5;/* distance entre niches (en σ) 0.9..3.9 */
  var gx=50,gy=230,gw=600,gh=150,sg2=1;function X(v){return gx+(v+4)/12*gw;}
  LN(gx,gy,gx+gw,gy,AX,1.6);TB('ressource utilisée (taille des proies, hauteur dans l\'arbre…)',gx+gw/2,gy+32,GREY,12);
  var m1=-d/2+2,m2=d/2+2;
  function curveN(m,col,fill){ctx.beginPath();for(var i=0;i<=gw;i+=3){var v=-4+i/gw*12,y=gy-gh*Math.exp(-(v-m)*(v-m)/2);i?ctx.lineTo(gx+i,y):ctx.moveTo(gx+i,y);}ctx.lineTo(gx+gw,gy);ctx.lineTo(gx,gy);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();}
  curveN(m1,BLUE,'rgba(55,138,221,.15)');curveN(m2,ORANGE,'rgba(186,117,23,.15)');
  /* chevauchement */
  ctx.beginPath();for(var i=0;i<=gw;i+=3){var v=-4+i/gw*12,y=gy-gh*Math.min(Math.exp(-(v-m1)*(v-m1)/2),Math.exp(-(v-m2)*(v-m2)/2));i?ctx.lineTo(gx+i,y):ctx.moveTo(gx+i,y);}ctx.lineTo(gx+gw,gy);ctx.lineTo(gx,gy);ctx.closePath();ctx.fillStyle='rgba(226,75,74,.45)';ctx.fill();
  TB('espèce 1',X(m1)-0,gy-gh-8,BLUE_D,14);TB('espèce 2',X(m2),gy-gh-8,ORANGE,14);
  var ov=2*B6.Phi(-d/2);TB('chevauchement des niches : '+Math.round(ov*100)+' %',350,28,DRED,16);
  TB(ov>.5?'forte compétition : l\'une peut éliminer l\'autre':ov>.25?'compétition modérée':'niches séparées : coexistence',350,52,ov>.5?DRED:DGREEN,15);
 }),
 th:'<div class="tcard"><b class="h">Habitat et niche écologique</b><p>L\'<b>habitat</b> est le lieu où vit une espèce (forêt, mare) : c\'est son « adresse ». La <b>niche écologique</b> est l\'ensemble des conditions et des ressources qu\'elle utilise et de son rôle dans l\'écosystème (ce qu\'elle mange, à quel moment, par qui elle est mangée) : son « métier ». Deux espèces peuvent partager un habitat avec des niches différentes (deux mésanges, l\'une sur le tronc, l\'autre au bout des rameaux) : la <b>partition des ressources</b> réduit la compétition.</p></div>'
 +'<div class="tcard"><b class="h">Les interactions entre espèces</b><p><b>Compétition</b> (− −) ; <b>prédation</b> (+ −, la proie est tuée) ; <b>parasitisme</b> (+ −, l\'hôte est affaibli, en général sans être tué d\'emblée) ; <b>mutualisme</b> (+ +) ; <b>commensalisme</b> (+ 0). Le <b>principe d\'exclusion compétitive</b> : deux espèces de niches identiques ne coexistent pas durablement.</p></div>'
 +'<div class="tcard"><b class="h">Modèle de compétition de Lotka–Volterra</b><p>Soit K<sub>1</sub>, K<sub>2</sub> les capacités d\'accueil et α<sub>12</sub> (effet de 2 sur 1), α<sub>21</sub> (effet de 1 sur 2). L\'espèce 1 peut s\'installer si <b>K<sub>1</sub> &gt; α<sub>12</sub>·K<sub>2</sub></b>, l\'espèce 2 si <b>K<sub>2</sub> &gt; α<sub>21</sub>·K<sub>1</sub></b>. Si les deux conditions sont vraies : <b>coexistence</b> ; si une seule : exclusion de l\'autre espèce ; si aucune : issue dépendant des effectifs de départ. <i>Exemple</i> : K<sub>1</sub> = 100, K<sub>2</sub> = 60, α<sub>12</sub> = 0,8, α<sub>21</sub> = 0,4 : 100 &gt; 48 et 60 &gt; 40 → coexistence, avec N<sub>1</sub>* = (100 − 48)/0,68 ≈ 76,5 et N<sub>2</sub>* = (60 − 40)/0,68 ≈ 29,4. Avec α<sub>21</sub> = 1,2 : 60 &lt; 120, l\'espèce 2 est exclue.</p></div>'},
 {t:"Proies et prédateurs", anim: G(function (t) {
  var n=Math.min(2400,Math.floor((t%1200)/1200*2400));
  var gx=40,gy=250,gw=360,gh=200,X0=1,vm=130;
  axs(gx,gy,gw,gh,'temps','effectif');
  function Y(v){return gy-v/vm*gh;}
  function line(arr,col){ctx.strokeStyle=col;ctx.lineWidth=2.8;ctx.beginPath();for(var i=0;i<=n;i+=6){var x=gx+i/2400*gw,y=Y(arr[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  line(PP.x,BLUE);line(PP.y,RED);
  LN(gx,Y(50),gx+gw,Y(50),'#c8ccd0',1.2,[4,4]);TB('— proies',gx+gw-4,Y(125),BLUE_D,14,'right');TB('— prédateurs',gx+gw-4,Y(125)+20,DRED,14,'right');
  /* portrait de phase */
  var px=430,py=250,pw=240,ph=200;LN(px,py,px+pw,py,AX,1.6);LN(px,py,px,py-ph,AX,1.6);TB('proies',px+pw,py+30,GREY,12,'right');TB('prédateurs',px+6,py-ph-10,GREY,12,'left');
  ctx.strokeStyle=VIOLET;ctx.lineWidth=2.4;ctx.beginPath();for(var i=0;i<=n;i+=4){var x=px+PP.x[i]/vm*pw,y=py-PP.y[i]/vm*ph;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  DOT(px+50/vm*pw,py-50/vm*ph,5,GREY);TB('équilibre (50 ; 50)',px+50/vm*pw+8,py-50/vm*ph+18,GREY,12,'left');DOT(px+PP.x[Math.min(n,2399)]/vm*pw,py-PP.y[Math.min(n,2399)]/vm*ph,6,RED);
 }),
 th:'<div class="tcard"><b class="h">Un cycle décalé</b><p>Dans le modèle de Lotka–Volterra proie–prédateur : <b>x\' = r·x − a·x·y</b> et <b>y\' = e·a·x·y − m·y</b> (r : croissance des proies, a : efficacité de capture, e : rendement de conversion, m : mortalité des prédateurs). Les effectifs <b>oscillent</b> : les proies augmentent, puis les prédateurs, qui font décroître les proies, puis les prédateurs décroissent faute de nourriture, et le cycle recommence. Les pics de prédateurs sont <b>décalés</b> par rapport à ceux des proies.</p></div>'
 +'<div class="tcard"><b class="h">Équilibre et période</b><p>Effectifs d\'équilibre : <b>x* = m / (e·a)</b> et <b>y* = r / a</b> ; période des petites oscillations : <b>T ≈ 2π / √(r·m)</b>. Avec r = 0,4, a = 0,008, e = 0,5, m = 0,2 : x* = 0,2 / 0,004 = 50, y* = 50, T ≈ 6,28 / 0,283 ≈ <b>22 ans</b>. Si m double (0,4) : x* = <b>100</b>, y* = 50 (inchangé), T ≈ 6,28 / 0,4 ≈ <b>15,7 ans</b> : il faut deux fois plus de proies pour entretenir les prédateurs, et le cycle est plus rapide.</p></div>'
 +'<div class="tcard"><b class="h">Interpréter</b><p>Sur une courbe d\'effectifs, repérer les pics, le décalage et la période. Dans le plan (proies, prédateurs), une oscillation est une boucle autour du point d\'équilibre. Le modèle est <b>simplifié</b> : pas de capacité d\'accueil, pas de refuge pour les proies ; dans la nature, les cycles sont aussi influencés par le milieu et d\'autres espèces.</p></div>'}
 ]
});
SFA.figs("c09", [
 F(function(p){ /* 1 vitesse logistique */
  var gx=50,gy=230,gw=380,gh=170;axs(gx,gy,gw,gh,'N','dN/dt');ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();for(var n=0;n<=1000;n+=20){var v=.4*n*(1-n/1000),x=gx+n/1000*gw,y=gy-v/100*gh;n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  [0,500,1000].forEach(function(n){TB(String(n),gx+n/1000*gw,gy+16,GREY,12);});TB('K',gx+gw,gy+16,GREY,1);
  var a=sg(p,0,.7),x=gx+.2*gw,y=gy-64/100*gh;ga(a);LN(x,gy,x,y,RED,2,[4,3]);LN(gx,y,x,y,RED,2,[4,3]);DOT(x,y,6,RED);TB('N = 200',x,gy+32,DRED,13);TB('64 / an',x+12,y-10,DRED,17,'left');g1();
  TB('r = 0,4 · K = 1 000',230,24,INK,14);
  ga(1-a);TB('vitesse ?',330,100,GREY,20);g1();
 }),
 F(function(p){ /* 2 habitat / niche */
  box(14,24,200,200,AX,'#fbfcfd',12);tree(70,200,1);tree(150,205,.8);bird(100,130,1.2,BLUE);TB('habitat',114,248,INK,15);TB('le lieu (« adresse »)',114,266,GREY,12);
  var a=sg(p,.1,.8);ga(.35+.65*a);box(246,24,200,200,VIOLET,'#f6f5fd',12);
  ['ce qu\'elle mange','quand elle est active','conditions (température…)','par qui elle est mangée'].forEach(function(s,i){DOT(264,64+i*38,6,VIOLET);TB(s,278,69+i*38,INK,13,'left');});
  TB('niche',346,248,VIOLET,15);TB('le rôle (« métier »)',346,266,GREY,12);g1();
  ga(1-a);TB('≠',230,130,GREY,34);g1();
 }),
 F(function(p){ /* 3 prélèvement durable */
  var gx=50,gy=230,gw=380,gh=170;axs(gx,gy,gw,gh,'h (fraction prélevée)','rendement');
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();for(var h=0;h<=.6;h+=.01){var y=gy-h*5000*(1-h/.6)/800*gh,x=gx+h/.6*gw;h?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  [0,.3,.6].forEach(function(h){TB(String(h*100)+' %',gx+h/.6*gw,gy+16,GREY,12);});
  var a=sg(p,0,.7),x=gx+.5*gw,y=gy-750/800*gh;ga(a);LN(x,gy,x,y,RED,2,[4,3]);DOT(x,y,7,RED);TB('h = r/2 = 30 %',x,gy+32,DRED,14);box(x+16,y-6,150,52,ORANGE,'#fdf5e9',8);TB('N* = 2 500',x+91,y+14,INK,13);TB('750 / an',x+91,y+36,DRED,16);g1();
  ga(1-a);TB('maximum ?',330,120,GREY,20);g1();
 }),
 F(function(p){ /* 4 exponentielle vs logistique */
  var gx=50,gy=232,gw=370,gh=190,K=500;axs(gx,gy,gw,gh,'t (ans)','N');
  function Y(n){return gy-n/650*gh;}ctx.strokeStyle=GREY;ctx.setLineDash([5,4]);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(gx,Y(K));ctx.lineTo(gx+gw,Y(K));ctx.stroke();ctx.setLineDash([]);TB('K = 500',gx+4,Y(K)-6,GREY,12,'left');
  var T=10*sg(p,0,.8)+(p===0?10:0);
  ctx.strokeStyle='#9aa0a6';ctx.lineWidth=2.4;ctx.beginPath();for(var s=0;s<=10;s+=.1){var n=10*Math.exp(.5*s);if(n>650)break;var x=gx+s/10*gw;s?ctx.lineTo(x,Y(n)):ctx.moveTo(x,Y(n));}ctx.stroke();
  ctx.strokeStyle=ORANGE;ctx.lineWidth=3.2;ctx.beginPath();for(var s=0;s<=10;s+=.1){var n=K/(1+49*Math.exp(-.5*s));var x=gx+s/10*gw;s?ctx.lineTo(x,Y(n)):ctx.moveTo(x,Y(n));}ctx.stroke();
  for(var s=0;s<=10;s+=5)TB(String(s),gx+s/10*gw,gy+16,GREY,12);
  ga(sg(p,.5,1));TB('exponentielle : 1 484',gx+gw*.78-10,gy-gh+14,'#6b7078',14,'right');DOT(gx+gw,Y(376),6,RED);TB('logistique : 376',gx+gw-10,Y(376)+22,DRED,15,'right');g1();
 }),
 F(function(p){ /* 5 deux espèces compétition */
  var gx=50,gy=232,gw=380,gh=190,xm=150,ym=130;axs(gx,gy,gw,gh,'N₁','N₂');
  function X(n){return gx+n/xm*gw;}function Y(n){return gy-n/ym*gh;}
  LN(X(100),Y(0),X(0),Y(125),BLUE,3);TB('espèce 1 stable',X(36),Y(88),BLUE_D,12,'left');
  LN(X(0),Y(60),X(150),Y(0),ORANGE,3);TB('α₂₁ = 0,4',X(120),Y(14)-6,ORANGE,12);
  LN(X(0),Y(60),X(50),Y(0),'#c8a46b',2,[5,4]);TB('α₂₁ = 1,2',X(50)+4,Y(0)-8,GREY,11,'left');
  var a=sg(p,.2,.9);ga(a);DOT(X(76.5),Y(29.4),7,RED);TB('(76,5 ; 29,4)',X(76.5)+10,Y(29.4)-12,DRED,14,'left');TB('coexistence',X(110),Y(70),DGREEN,15);g1();
  TB('K₁ = 100 · K₂ = 60 · α₁₂ = 0,8',230,22,INK,13);
 }),
 F(function(p){ /* 6 parasitisme */
  var P=[['prédation',BLUE],['parasitisme',DRED],['mutualisme',GREEN]],a=sg(p,0,.7);
  /* parasitisme */
  ell(230,110,64,44,'#f3e7d6',INK,2.4);TB('hôte',230,114,INK,16);ell(262,76,13,9,'#c4a1d9',INK,2);
  A(250,60,-18,-18,GREY,'',2);TB('parasite',296,56,VIOLET,13,'left');
  box(30,16,90,26,BLUE,'#e6f1fb',8);TB('prédation',75,34,BLUE_D,12);TB('+  −',75,60,BLUE_D,16);TB('proie tuée',75,80,GREY,11);
  box(340,16,100,26,GREEN,'#e8f7f1',8);TB('mutualisme',390,34,DGREEN,12);TB('+  +',390,60,DGREEN,16);TB('bénéfice mutuel',390,80,GREY,11);
  ga(a);box(110,176,240,64,DRED,'#fdecec',10);TB('parasitisme : + −',230,204,DRED,18);TB('hôte affaibli, pas tué d\'emblée',230,228,INK,13);g1();
  ga(1-a);TB('quel type ?',230,212,GREY,18);g1();
 }),
 F(function(p){ /* 7 période et équilibre */
  var gx=40,gy=232,gw=390,gh=170,vm=120;axs(gx,gy,gw,gh,'temps (ans)','effectif');
  function Y(v){return gy-v/vm*gh;}
  function line(arr,col){ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.beginPath();for(var i=0;i<=1200;i+=6){var x=gx+i/1200*gw,y=Y(arr[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
  line(PP.x,BLUE);line(PP.y,RED);TB('— proies',gx+gw-4,Y(112),BLUE_D,13,'right');TB('— prédateurs',gx+gw-4,Y(112)+18,DRED,13,'right');
  var a=sg(p,0,.8);ga(a);LN(gx,Y(50),gx+gw,Y(50),GREY,1.4,[4,4]);TB('x* = y* = 50',gx+8,Y(50)-6,GREY,12,'left');
  var t0=gx+0*gw/60,x1=gx+22/60*gw;A(gx+6,gy-14,x1-gx-6,0,ORANGE,'',2.4);A(x1,gy-14,-(x1-gx-6),0,ORANGE,'',2.4);TB('T ≈ 22 ans',(gx+x1)/2,gy-22,ORANGE,15);g1();
  ga(sg(p,.5,1));box(40,10,230,30,DGREEN,'#e8f7f1',8);TB('si m = 0,4 : x* = 100 · T ≈ 15,7 ans',155,30,DGREEN,13);g1();
 }),
 F(function(p){ /* 8 deux mésanges */
  tree(120,230,1.6);ctx.fillStyle='#8a6a3a';bird(112,150,1.3,BLUE);bird(190,92,1.3,ORANGE);
  TB('tronc',112,174,BLUE_D,12);TB('rameaux',190,118,ORANGE,12);TB('même forêt',120,258,GREY,13);
  var x0=270,gy=130;LN(x0,gy,440,gy,AX,1.5);var a=sg(p,0,.7);ga(a);
  [[330,BLUE],[385,ORANGE]].forEach(function(q){ctx.beginPath();for(var i=0;i<=170;i+=3){var v=(i+270-q[0])/30,y=gy-70*Math.exp(-v*v/2);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.strokeStyle=q[1];ctx.lineWidth=3;ctx.stroke();});
  g1();ga(sg(p,.4,1));box(256,160,196,84,DGREEN,'#e8f7f1',10);TB('même habitat,',354,188,INK,14);TB('niches différentes',354,208,DGREEN,16);TB('→ coexistence',354,230,GREY,13);g1();
  ga(1-sg(p,0,.4));TB('?',354,200,GREY,30);g1();
 }),
 F(function(p){ /* 9 rendement pêcherie */
  var gx=50,gy=232,gw=380,gh=180;axs(gx,gy,gw,gh,'h (fraction prélevée)','rendement / an');
  function X(h){return gx+h/.7*gw;}function Y(v){return gy-v/300*gh;}
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();for(var h=0;h<=.5;h+=.01){var v=h*2000*(1-h/.5);h?ctx.lineTo(X(h),Y(v)):ctx.moveTo(X(h),Y(v));}ctx.stroke();
  ctx.strokeStyle=RED;ctx.lineWidth=3;LN(X(.5),Y(0),X(.7),Y(0),RED,4);
  [0,.25,.5,.7].forEach(function(h){TB(String(Math.round(h*100))+' %',X(h),gy+16,GREY,12);});
  var a=sg(p,0,.8);ga(a);[[.25,250,'N* = 1 000 · 250',GREEN],[.4,160,'N* = 400 · 160',ORANGE]].forEach(function(q,i){DOT(X(q[0]),Y(q[1]),7,q[3]);TB(q[2],X(q[0])+(i?16:-10),Y(q[1])-12,dk(q[3]),13,i?'left':'right');});
  DOT(X(.6),Y(0),7,RED);crs(X(.6),Y(0)-24,DRED,8);TB('60 % : extinction',X(.6),Y(0)-42,DRED,14);g1();
 }),
 F(function(p){ /* 10 qui l'emporte */
  var gx=50,gy=232,gw=380,gh=190,xm=150,ym=115;axs(gx,gy,gw,gh,'N_A','N_B');
  function X(n){return gx+n/xm*gw;}function Y(n){return gy-n/ym*gh;}
  LN(X(100),Y(0),X(0),Y(76.9),BLUE,3);TB('isocline de A',X(84),Y(5),BLUE_D,12,'left');
  LN(X(0),Y(100),X(142.9),Y(0),ORANGE,3);TB('isocline de B',X(100),Y(42),ORANGE,12,'left');
  var a=sg(p,.1,.9);ga(a);A(X(60),Y(30),-(X(60)-X(10))*a,-(Y(30)-Y(88))*a,RED,'',3);DOT(X(0),Y(100),8,DGREEN);TB('B seule : N_B = 100',X(0)+14,Y(100)-8,DGREEN,14,'left');g1();
  TB('α_AB = 1,3 · α_BA = 0,7 · K = 100',230,22,INK,13);
  ga(sg(p,.5,1));TB('B élimine A',X(95),Y(100),DRED,18);g1();
 })
]);
})();
