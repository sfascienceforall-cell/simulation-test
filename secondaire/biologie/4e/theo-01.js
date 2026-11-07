/* Biologie 4e · chapitre 1 · Niveaux d'organisation et observation de la cellule.
   Ce fichier définit aussi les aides de dessin « b4… » partagées par theo-02 … theo-10. */
function b4r(v,a,b){return Math.max(0,Math.min(1,(v-a)/(b-a)));}
function b4al(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function b4box(x,y,w,h,col,fill,lw){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||BLUE;ctx.lineWidth=lw||2;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,8);ctx.fill();ctx.stroke();}
function b4ell(x,y,rx,ry,fill,stroke,lw,rot){ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot||0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function b4nuc(x,y,r){b4ell(x,y,r,r,'#e4e0fa',VIOLET,2);b4ell(x+r*.2,y-r*.15,r*.32,r*.32,'#b9b3ee');}
function b4mito(x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);b4ell(0,0,9*s,5*s,'#fdece4',ORA2,1.6);ctx.strokeStyle=ORA2;ctx.lineWidth=1.1;ctx.beginPath();
 for(var i=-2;i<=2;i++){var u=i*3.2*s,q=(i%2?-1:1);ctx.moveTo(u,q*4*s);ctx.lineTo(u,-q*.5*s);}ctx.stroke();ctx.restore();}
function b4lab(txt,x,y,tx,ty,col,size,al){LN(x,y,tx,ty,col||GREY,1.2);DOT(x,y,2.5,col||GREY);TB(txt,tx,ty+4,dk(col||INK),size||13,al||'center');}
function b4ans(p,txt,col,y){var a=b4r(p,0,.35);if(a<=0)return;b4al(a);var s=Math.max(13,Math.min(17,W/26)),yy=y==null?H-26:y;ctx.font='700 '+s+'px system-ui';var w=ctx.measureText(txt).width+26;
 b4box(W/2,yy,w,s+16,col||GREEN,'#f2fbf7',2);TB(txt,W/2,yy+s*.36,dk(col||GREEN),s);b4al(1);}
function b4dim(x1,y1,x2,y2,txt,col,off){col=col||INK;A(x1,y1,0,0,col);var dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,o=off||0;
 LN(x1+nx*o,y1+ny*o,x2+nx*o,y2+ny*o,col,1.6);LN(x1+nx*(o-5),y1+ny*(o-5),x1+nx*(o+5),y1+ny*(o+5),col,1.6);LN(x2+nx*(o-5),y2+ny*(o-5),x2+nx*(o+5),y2+ny*(o+5),col,1.6);
 if(txt)tag(txt,(x1+x2)/2+nx*(o+(o<0?-12:12)),(y1+y2)/2+ny*(o+(o<0?-12:12)),dk(col),13);}
/* repère de graphe : renvoie les fonctions de conversion. xr=[xmin,xmax], yr=[ymin,ymax] */
function b4ax(x0,y0,w,h,xr,yr,xl,yl){LN(x0,y0,x0+w+6,y0,INK,1.8);LN(x0,y0+4,x0,y0-h-8,INK,1.8);
 ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(x0+w+11,y0);ctx.lineTo(x0+w+3,y0-4);ctx.lineTo(x0+w+3,y0+4);ctx.fill();ctx.beginPath();ctx.moveTo(x0,y0-h-13);ctx.lineTo(x0-4,y0-h-5);ctx.lineTo(x0+4,y0-h-5);ctx.fill();
 if(xl)TB(xl,x0+w,y0+Math.min(30,H*.1),GREY,13,'right');if(yl)TB(yl,x0+6,y0-h-16,GREY,13,'left');
 return {x:function(v){return x0+(v-xr[0])/(xr[1]-xr[0])*w;},y:function(v){return y0-(v-yr[0])/(yr[1]-yr[0])*h;}};}
function b4tick(M,xs,ys,fx,fy){xs=xs||[];ys=ys||[];var y0=M.y(0),x0=M.x(0);xs.forEach(function(v){var x=M.x(v);LN(x,M.yb,x,M.yb+4,GREY,1);T(fx?fx(v):String(v).replace('.',','),x,M.yb+17,GREY,11);});ys.forEach(function(v){var y=M.y(v);LN(M.xl-4,y,M.xl,y,GREY,1);T(fy?fy(v):String(v).replace('.',','),M.xl-7,y+4,GREY,11,'right');});}
function b4curve(M,f,a,b,col,lw,n,upto){ctx.strokeStyle=col;ctx.lineWidth=lw||2.5;ctx.beginPath();n=n||80;var m=upto==null?n:Math.floor(n*upto);for(var i=0;i<=m;i++){var v=a+(b-a)*i/n,px=M.x(v),py=M.y(f(v));i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
/* cellule animale / végétale */
function b4animal(x,y,rx,ry,o){o=o||{};b4ell(x,y,rx,ry,'#fdf3ee',ORA2,2.2);b4nuc(x-rx*.1,y,Math.min(rx,ry)*.34);b4mito(x+rx*.45,y-ry*.3,Math.min(rx,ry)/38,.5);b4mito(x+rx*.35,y+ry*.5,Math.min(rx,ry)/38,-.4);b4mito(x-rx*.6,y+ry*.35,Math.min(rx,ry)/38,.2);}
function b4plant(x,y,w,h,o){o=o||{};ctx.fillStyle='#eaf6ee';ctx.strokeStyle=DGREEN;ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,10);ctx.fill();ctx.stroke();
 ctx.strokeStyle=GREEN;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x-w/2+4,y-h/2+4,w-8,h-8,8);ctx.stroke();
 ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;ctx.lineWidth=1.6;ctx.beginPath();ctx.roundRect(x-w*.12,y-h*.32,w*.5,h*.64,16);ctx.fill();ctx.stroke();
 b4nuc(x-w*.31,y-h*.1,Math.min(w,h)*.1);b4mito(x-w*.33,y+h*.28,Math.min(w,h)/60,.3);b4mito(x+w*.38,y-h*.36+4,Math.min(w,h)/70,0);
 if(o.chloro)for(var i=0;i<4;i++)b4ell(x-w*.4+i*w*.2,y-h*.38+((i%2)?w*.03:0),Math.min(w,h)*.06,Math.min(w,h)*.035,'#b9e3cf',DGREEN,1.5);}
function b4bact(x,y,L,Wd,rot,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.fillStyle=o.fill||'#fdf3ee';ctx.strokeStyle=o.col||ORA2;ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(-L/2,-Wd/2,L,Wd,Wd/2);ctx.fill();ctx.stroke();
 if(!o.nonuc){ctx.strokeStyle=VIOLET;ctx.lineWidth=1.6;ctx.beginPath();for(var i=0;i<=24;i++){var u=-L*.3+L*.6*i/24;ctx.lineTo(u,Math.sin(i*1.3)*Wd*.2);}ctx.stroke();}
 if(o.flag){ctx.strokeStyle=INK;ctx.lineWidth=1.3;ctx.beginPath();for(var j=0;j<=20;j++){ctx.lineTo(L/2+j*L*.03,Math.sin(j*.8)*Wd*.18);}ctx.stroke();}
 if(o.thyl){ctx.strokeStyle=DGREEN;ctx.lineWidth=1.3;for(var k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(k*L*.1-L*.02,-Wd*.35);ctx.quadraticCurveTo(k*L*.1+L*.04,0,k*L*.1-L*.02,Wd*.35);ctx.stroke();}}
 ctx.restore();}
function b4scope(cx,cy,s,o){o=o||{};/* microscope schématique : tube, oculaire (haut), objectif (bas), lame */
 ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);
 ctx.fillStyle='#e9ecef';ctx.strokeStyle=INK;ctx.lineWidth=2.2/s;
 ctx.beginPath();ctx.roundRect(-4,-62,8,20,2);ctx.fill();ctx.stroke(); /* oculaire fin */
 ctx.fillStyle='#d9e8f7';ctx.strokeStyle=BLUE_D;ctx.beginPath();ctx.roundRect(-9,-44,18,52,3);ctx.fill();ctx.stroke(); /* tube */
 ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.beginPath();ctx.roundRect(-6,8,12,18,2);ctx.fill();ctx.stroke(); /* objectif */
 ctx.fillStyle='#bfc5cc';ctx.strokeStyle=INK;ctx.beginPath();ctx.roundRect(-34,40,68,5,2);ctx.fill();ctx.stroke(); /* platine */
 ctx.fillStyle='#dcdfe3';ctx.fillRect(-4,28,8,3);
 ctx.strokeStyle=INK;ctx.beginPath();ctx.moveTo(26,-46);ctx.lineTo(34,-46);ctx.lineTo(34,64);ctx.lineTo(-34,64);ctx.lineTo(-34,46);ctx.stroke();
 ctx.restore();}
function b4sphere(x,y,r,fill,stroke){var g=ctx.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(1,fill);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}

/* ---------- chapitre 1 ---------- */
var b4_sizes=[ /* [log10(taille en m), nom, taille texte, couleur] */
 [-9,'glucose','1 nm',GREY],[-7.6,'ribosome','25 nm',VIOLET],[-7,'virus','100 nm',RED],[-6,'mitochondrie','1 µm',ORA2],[-5.15,'globule rouge','7 µm',DRED],[-4.7,'cellule animale','20 µm',BLUE],[-4,'ovule','100 µm',DGREEN]];
SFA.theo("c01",{
 icon:function(){b4ell(W*.5,H*.42,Math.min(W*.3,110),Math.min(H*.3,70),'#e6f1fb',BLUE_D,3);b4nuc(W*.5,H*.42,Math.min(H*.12,28));TB('G = G',W*.46,H*.88,BLUE_D,28,'right');TB('obj',W*.46+1,H*.93,BLUE_D,13,'left');TB('× G',W*.5+2,H*.88,ORANGE,28,'left');TB('oc',W*.5+64,H*.93,ORANGE,13,'left');},
 anim:function(t){var P=900,k=(t%P)/P,x0=W*.07,w=W*.86,ya=H*.52;
  function X(l){return x0+(l+9)/6*w;}
  TB('Ce que chaque instrument permet de distinguer',W*.5,H*.09,BLUE_D,Math.max(14,Math.min(17,W/40)));
  LN(x0,ya,x0+w,ya,INK,2);
  [-9,-8,-7,-6,-5,-4,-3].forEach(function(l){LN(X(l),ya-5,X(l),ya+5,INK,1.5);var s={'-9':'1 nm','-8':'10 nm','-7':'100 nm','-6':'1 µm','-5':'10 µm','-4':'100 µm','-3':'1 mm'}[l];TB(s,X(l),ya+20,GREY,12);});
  var bars=[['œil nu',-4,'#fff3e0',ORANGE,0,.2],['microscope optique',-6.7,'#e6f1fb',BLUE,.2,.45],['microscope électronique',-9,'#f2fbf7',GREEN,.45,.7]];
  bars.forEach(function(b,i){var f=b4r(k,b[4],b[5]),xr=X(-3),xl=X(b[1]),yy=ya+44+i*26;var xs=xr-(xr-xl)*f;ctx.fillStyle=b[2];ctx.strokeStyle=b[3];ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(xs,yy-9,xr-xs,18,9);ctx.fill();ctx.stroke();
   if(f>.99){LN(xl,ya,xl,yy-9,b[3],1.3,[3,3]);TB(b[0],Math.max(xl+8,x0),yy+4,dk(b[3]),12,'left');}});
  var sc=Math.min(1,W/700);
  b4_sizes.forEach(function(o,i){var a=b4r(k,.05+i*.04,.15+i*.04);if(a<=0)return;b4al(a);var x=X(o[0]),vis=o[0]>=-4?0:o[0]>=-6.7?1:2,hi=k>.72&&Math.floor((k-.72)/.28*7)===i;
   var yy=ya-30-(i%2)*38-(1-a)*10;DOT(x,ya,4,o[3]);LN(x,ya-4,x,yy+14,o[3],1.2);TB(o[1],x,yy,dk(o[3]),Math.round(12*Math.max(.9,sc)));TB(o[2],x,yy-14,GREY,11);b4al(1);});
  if(k>.72){TB('Un objet plus petit que la limite de résolution reste invisible, même très agrandi.',W*.5,H*.97,INK,Math.max(12,Math.min(14,W/50)));}
 },
 th:'<div class="tcard"><b class="h">Des niveaux d\'organisation emboîtés</b><p>Le vivant s\'étudie à plusieurs échelles : <b>molécule → organite → cellule → tissu → organe → appareil (ou système) → organisme</b>. La <b>cellule</b> est la plus petite unité du vivant : un <b>tissu</b> est un ensemble de cellules semblables (muscle, épithélium) ; plusieurs tissus forment un <b>organe</b> (estomac) ; des organes qui coopèrent forment un <b>appareil</b> (digestif).</p></div>'+
 '<div class="tcard"><b class="h">Grossissement et taille réelle</b><p>Au microscope, le grossissement total est le produit des deux lentilles : <code>G = G<sub>objectif</sub> × G<sub>oculaire</sub></code>. Pour une image ou une photographie :</p><p><code>G = taille de l\'image ÷ taille réelle</code> &nbsp;donc&nbsp; <code>taille réelle = taille de l\'image ÷ G</code></p><ul><li>Convertis toujours dans la <b>même unité</b> : 1 mm = 1 000 µm ; 1 µm = 1 000 nm.</li><li>Avec une <b>barre d\'échelle</b> : G = longueur de la barre sur l\'image ÷ longueur réelle qu\'elle représente.</li></ul><div class="tip"><b class="h">Exemple chiffré</b><br>Une cellule mesure 3,2 cm sur une photo à ×400 : 3,2 cm = 32 mm ; 32 ÷ 400 = 0,08 mm = <b>80 µm</b>. Oculaire ×10 et objectif ×40 : G = 10 × 40 = <b>× 400</b>.</div></div>'+
 '<div class="tcard"><b class="h">Grossir n\'est pas distinguer : le pouvoir de résolution</b><p>La <b>résolution</b> est la plus petite distance entre deux points qu\'on voit encore séparés. En lumière visible, <code>d ≈ 0,61 × λ ÷ ON</code> (λ : longueur d\'onde, ON : ouverture numérique de l\'objectif). Avec λ = 550 nm et ON = 1,25 : d ≈ 0,61 × 550 ÷ 1,25 ≈ 270 nm, soit environ <b>0,2 µm</b>.</p><ul><li>Œil nu : ≈ 0,1 mm (100 µm). Microscope optique : ≈ 0,2 µm. Microscope électronique : de l\'ordre du nanomètre.</li><li>Un oculaire plus fort agrandit mais ne change pas d : c\'est un <b>grossissement vide</b>. Pour mieux séparer, il faut une lumière de plus petite λ, un objectif d\'ON plus grande, ou un autre type de microscope.</li></ul></div>'+
 '<div class="tcard"><b class="h">Procaryote, cellule animale, cellule végétale</b><table><tr><td></td><td>Procaryote</td><td>Animale</td><td>Végétale</td></tr><tr><td>Noyau (enveloppe)</td><td>non</td><td>oui</td><td>oui</td></tr><tr><td>Mitochondries</td><td>non</td><td>oui</td><td>oui</td></tr><tr><td>Paroi</td><td>oui (bactérie)</td><td>non</td><td>cellulose</td></tr><tr><td>Chloroplastes</td><td>non</td><td>non</td><td>oui*</td></tr><tr><td>Grande vacuole</td><td>non</td><td>non</td><td>oui</td></tr></table><p>*Absents dans les parties non éclairées (racine). Les bactéries, cyanobactéries comprises, sont toutes procaryotes : leur ADN flotte dans le cytoplasme (nucléoïde). Levures et champignons sont des eucaryotes.</p></div>'+
 '<div class="warn"><b class="h">Pièges</b><br>• Ne pas confondre grossissement (l\'image est x fois plus grande) et résolution (finesse des détails).<br>• Quand le grossissement est multiplié par 4, le champ est 4 fois plus étroit : on voit moins de cellules, mais plus en détail.<br>• Pour des formes semblables, un rapport de longueurs <i>k</i> donne un rapport de surfaces <i>k</i>² et de volumes <i>k</i>³.</div>'
});
SFA.figs("c01",[
 /* 0 grossissement total */
 function(p){var cx=W*.3,cy=H*.5,s=Math.min(H/150,W/330);b4scope(cx,cy,s,{});
  b4lab('oculaire',cx+10*s,cy-52*s,cx+75*s,cy-62*s,BLUE_D,14,'left');TB('× 10',cx+75*s,cy-44*s,BLUE_D,18,'left');
  b4lab('objectif',cx+8*s,cy+17*s,cx+75*s,cy+3*s,ORA2,14,'left');TB('× 40',cx+75*s,cy+21*s,DRED,18,'left');
  if(p<=0)TB('G = ?',W*.76,cy+56*s,GREY,20);
  if(p>0){b4al(b4r(p,0,.5));TB('10 × 40',W*.76,cy+56*s,INK,17);b4al(1);}
  b4ans(p,'G = × 400',GREEN);},
 /* 1 niveaux */
 function(p){var n=['cellule','tissu','organe','appareil','organisme'],hh=[34,50,66,82,98],c=[BLUE,VIOLET,GREEN,ORANGE,RED];var w=W/5.4,x0=W*.1;
  n.forEach(function(s,i){var x=x0+i*(W*.8/4),h=hh[i]*H/280,y=H*.55;
   var shuffle=p<=0; b4box(x,y,w*.92,h,c[i],'#fff',2.4);TB(s,x,y+4,dk(c[i]),Math.max(13,Math.min(15,W/32)));
   if(i<4)A(x+w*.5,y,W*.8/4-w*.96,0,GREY,'',2);
   if(p>0){b4al(b4r(p,i*.12,i*.12+.2));DOT(x,y-h/2-14,12,c[i]);TB(String(i+1),x,y-h/2-9,'#fff',14);b4al(1);}});
  if(p<=0){TB('Dans quel ordre ?',W*.5,H*.2,GREY,18);}
  b4ans(p,'du plus petit au plus grand',GREEN);},
 /* 2 taille réelle */
 function(p){b4animal(W*.33,H*.48,W*.24,H*.3);b4dim(W*.09,H*.2,W*.57,H*.2,'3,2 cm sur la photo',BLUE_D,0);TB('× 400',W*.33,H*.88,GREY,16);
  b4animal(W*.8,H*.5,W*.012+W*.02*p,H*.012+H*.025*p);
  if(p>0){b4al(b4r(p,.1,.5));TB('÷ 400',W*.66,H*.4,ORANGE,20);A(W*.6,H*.5,W*.1,0,ORANGE,'',2.5);b4al(1);}
  b4ans(p,'80 µm',GREEN);},
 /* 3 procaryote ou eucaryote */
 function(p){var L=['A','B','C','D'],xs=[.14,.38,.62,.86],yy=H*.5;
  b4bact(W*xs[0],yy,W*.18,H*.16,.4,{});
  b4ell(W*xs[1],yy,W*.085,W*.085,'#fff7e0',YEL,2.4);b4ell(W*(xs[1]+.07),yy-H*.15,W*.03,W*.03,'#fff7e0',YEL,2);b4nuc(W*xs[1]-W*.01,yy+2,W*.035);
  b4bact(W*xs[2],yy,W*.18,H*.16,-.3,{thyl:true,fill:'#eaf6ee',col:DGREEN,nonuc:true});
  b4bact(W*xs[3],yy,W*.17,H*.14,.2,{flag:true,fill:'#e6f1fb',col:BLUE});
  xs.forEach(function(x,i){TB(L[i],W*x,H*.2,GREY,22);});
  TB('lactobacille',W*xs[0],H*.82,INK,13);TB('levure',W*xs[1],H*.82,INK,13);TB('cyanobactérie',W*xs[2],H*.82,INK,13);TB('E. coli',W*xs[3],H*.82,INK,13);
  if(p>0){b4al(b4r(p,0,.4));ctx.strokeStyle=GREEN;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(W*xs[1]+W*.015,yy-H*.03,W*.125,0,7);ctx.stroke();TB('noyau + enveloppe',W*xs[1],H*.745,DGREEN,13);b4al(1);}
  b4ans(p,'B : la levure est eucaryote',GREEN,H-20);},
 /* 4 barre d'échelle */
 function(p){var cx=W*.4,cy=H*.46,R=Math.min(H*.36,W*.3);b4ell(cx,cy,R*1.25,R,'#fdf3ee',ORA2,2.4);b4ell(cx,cy,R*.6,R*.6,'#e4e0fa',VIOLET,2.4);b4ell(cx+R*.12,cy-R*.1,R*.2,R*.2,'#b9b3ee');
  var bl=R*1.2*25/60;LN(W*.72,H*.35,W*.72+bl,H*.35,INK,5);TB('25 mm = 5 µm',W*.72+bl/2,H*.27,INK,14);
  
  b4dim(cx-R*.6,cy+R*.7,cx+R*.6,cy+R*.7,'60 mm',VIOLET,0);
  if(p>0){b4al(b4r(p,0,.5));var f=b4r(p,0,.6);LN(W*.72,H*.35,W*.72+bl,H*.35,INK,5);TB('60 ÷ 25 = 2,4 barres',W*.76,H*.55,VIOLET,14);TB('2,4 × 5 µm',W*.76,H*.64,ORANGE,15);b4al(1);
   b4ans(p,'G = × 5 000  ;  noyau = 12 µm',GREEN);}},
 /* 5 deux points confondus */
 function(p){var M=b4ax(W*.1,H*.76,W*.8,H*.5,[-1.2,1.2],[0,1.1],'position (µm)','');M.yb=H*.76;
  function g(x,c,s){return Math.exp(-Math.pow((x-c)/s,2)/2);}
  var a=.075,s1=.27/1.6;
  b4curve(M,function(x){return .9*(g(x,-a,.17)+g(x,a,.17))/1.9*1.05;},-1.2,1.2,BLUE,3,120);
  TB('lumière : 0,27 µm',M.x(0),H*.24,BLUE_D,14);
  [-a,a].forEach(function(c){LN(M.x(c),H*.76,M.x(c),H*.76+8,RED,2.5);});
  TB('0,15 µm',M.x(0),H*.76+28,RED,13);
  if(p>0){b4al(b4r(p,0,.4));b4curve(M,function(x){return .9*(g(x,-a,.016)+g(x,a,.016))*.62;},-1.2,1.2,GREEN,3,600);TB('électrons : ≈ 1 nm',M.x(.62),H*.44,DGREEN,14);b4al(1);}
  b4ans(p,'microscope électronique',GREEN,H-20);},
 /* 6 champ du microscope */
 function(p){var R=Math.min(H*.33,W*.22),cx=W*.3,cy=H*.44,n=6,d=2*R/n;ctx.fillStyle='#f6f7f9';ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();ctx.stroke();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R-1,0,7);ctx.clip();for(var i=0;i<n;i++){b4ell(cx-R+d*(i+.5),cy,d/2*.94,d/2*.94,'#fdf3ee',ORA2,1.8);}for(var j=-1;j<=1;j+=2)for(var i=0;i<n;i++){b4ell(cx-R+d*(i+.5)+d/2*(j<0?0:0),cy+j*d,d/2*.94,d/2*.94,'#fdf3ee',ORA2,1.2);}ctx.restore();
  b4dim(cx-R,cy+R+14,cx+R,cy+R+14,'×10 : 1,8 mm, 6 cellules',BLUE_D,0);
  var r4=R/4;if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=RED;ctx.lineWidth=2.8;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(cx,cy,r4,0,7);ctx.stroke();ctx.setLineDash([]);
   var bx=W*.74,by=H*.5,BR=Math.min(H*.36,W*.2);ctx.fillStyle='#fff';ctx.strokeStyle=RED;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(bx,by,BR,0,7);ctx.fill();ctx.stroke();
   ctx.save();ctx.beginPath();ctx.arc(bx,by,BR-1,0,7);ctx.clip();var cd=2*BR/1.5;b4ell(bx-BR+cd/2,by,cd/2*.94,cd/2*.94,'#fdf3ee',ORA2,2);b4ell(bx-BR+cd*1.5,by,cd/2*.94,cd/2*.94,'#fdf3ee',ORA2,2);ctx.restore();
   LN(cx+r4*.7,cy-r4*.7,bx-BR*.7,by-BR*.7,RED,1.2,[4,4]);TB('×40 : 450 µm',bx,by+BR+20,DRED,14);b4al(1);}
  b4ans(p,'300 µm  ;  1,5 cellule',GREEN);},
 /* 7 cellule de racine */
 function(p){b4plant(W*.4,H*.5,W*.56,H*.62,{});var a=b4r(p,0,.5);
  if(p<=0){TB('?',W*.86,H*.5,GREY,56);}
  else{b4al(a);var pts=[['paroi',W*.68,H*.3,W*.74,H*.16],['grande vacuole',W*.5,H*.4,W*.74,H*.33],['noyau',W*.25,H*.5,W*.74,H*.5],['mitochondrie',W*.4,H*.77,W*.74,H*.67]];
   pts.forEach(function(q){LN(q[1],q[2],q[3]-12,q[4],GREEN,1.3);TB(q[0],q[3]+0,q[4]+4,DGREEN,14,'left');});TB('pas de chloroplaste',W*.74,H*.82,DRED,14,'left');b4al(1);}
  b4ans(p,'cellule végétale (racine)',GREEN,H-20);},
 /* 8 micrographie électronique */
 function(p){var L=W*.82,x0=W*.09,y=H*.4;b4bact(W/2,y,L,H*.3,0,{});b4ell(W*.3,y+H*.03,3,3,VIOLET);for(var i=0;i<9;i++)DOT(W*.4+i*W*.04,y+Math.sin(i*2)*H*.07,2.2,VIOLET);
  b4dim(x0,y+H*.26,x0+L,y+H*.26,'40 mm sur l\'image  (× 20 000)',BLUE_D,0);
  if(p<=0)TB('ribosome : 25 nm',W*.5,H*.9,VIOLET,15);
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=RED;ctx.lineWidth=2;ctx.beginPath();ctx.arc(W*.3,y+H*.03,12,0,7);ctx.stroke();TB('0,5 mm',W*.3,y-H*.1,DRED,14);b4al(1);
   b4ans(p,'2 µm  ;  0,5 mm  ;  électronique',GREEN,H-20);}},
 /* 9 virus et bactérie */
 function(p){var R=Math.min(H*.36,W*.2),r=R/20;b4sphere(W*.3,H*.48,R,'#fdf3ee',ORA2);TB('bactérie : 2 µm',W*.3,H*.48+R+24,DRED,14);
  b4sphere(W*.72,H*.48,Math.max(r,3),'#e6f1fb',BLUE);TB('virus : 100 nm',W*.72,H*.48+30,BLUE_D,14);
  
  if(p>0){b4al(b4r(p,0,.4));TB('diamètre × 20',W*.55,H*.2,INK,15);TB('volume × 20³',W*.55,H*.28,INK,15);b4al(1);}
  b4ans(p,'× 8 000',GREEN);}
]);
