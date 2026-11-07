/* Maths 5e · chapitre 1 · théorie animée + devantures (helpers m5_* partagés par theo-02 … theo-10) */
function m5_cl(v,a,b){return Math.max(a,Math.min(b,v));}
function m5_fd(p,a,b){return m5_cl((p-a)/(b-a),0,1);}
/* repère : renvoie c avec X(x), Y(y). o: {eq:true repère orthonormé, top, st (pas de grille), lab (pas des graduations), lx, ly} */
function m5_G(xa,xb,ya,yb,o){o=o||{};var L=o.left!=null?o.left:26,R=12,Tp=o.top!=null?o.top:30,B=o.bot!=null?o.bot:22;
 var pw=W-L-R,ph=H-Tp-B,kx=pw/(xb-xa),ky=ph/(yb-ya);
 if(o.eq){var k=Math.min(kx,ky);kx=ky=k;}
 var wx=(xb-xa)*kx,wy=(yb-ya)*ky,x0=L+(pw-wx)/2-xa*kx,y0=Tp+(ph-wy)/2+yb*ky;
 var c={kx:kx,ky:ky,xa:xa,xb:xb,ya:ya,yb:yb,X:function(x){return x0+x*kx;},Y:function(y){return y0-y*ky;}};
 var st=o.st||1,lab=o.lab||st*2,sx=o.sx||st,sy=o.sy||st,lx=o.lbx||lab,ly=o.lby||lab;
 ctx.lineWidth=1;ctx.strokeStyle='#eceef1';
 for(var i=Math.ceil(xa/sx-1e-9);i<=Math.floor(xb/sx+1e-9);i++){ctx.beginPath();ctx.moveTo(c.X(i*sx),c.Y(ya));ctx.lineTo(c.X(i*sx),c.Y(yb));ctx.stroke();}
 for(var j=Math.ceil(ya/sy-1e-9);j<=Math.floor(yb/sy+1e-9);j++){ctx.beginPath();ctx.moveTo(c.X(xa),c.Y(j*sy));ctx.lineTo(c.X(xb),c.Y(j*sy));ctx.stroke();}
 var ax=m5_cl(0,xa,xb),ay=m5_cl(0,ya,yb);
 LN(c.X(xa),c.Y(ay),c.X(xb)+8,c.Y(ay),'#aab0b6',1.5);LN(c.X(ax),c.Y(ya),c.X(ax),c.Y(yb)-8,'#aab0b6',1.5);
 TB(o.lx||'x',c.X(xb)+4,c.Y(ay)+15,GREY,12,'right');TB(o.ly||'y',c.X(ax)+9,c.Y(yb)-1,GREY,12,'left');
 for(i=Math.ceil(xa/lx-1e-9);i<=Math.floor(xb/lx+1e-9);i++){if(i*lx!==0)TB(nfmt(+(i*lx).toFixed(2)),c.X(i*lx),c.Y(ay)+14,GREY,13);}
 for(j=Math.ceil(ya/ly-1e-9);j<=Math.floor(yb/ly+1e-9);j++){if(j*ly!==0)TB(nfmt(+(j*ly).toFixed(2)),c.X(ax)-6,c.Y(j*ly)+4,GREY,13,'right');}
 return c;}
/* courbe y=f(x) (ou x=f(y) si sw) sur [a,b], coupée au cadre */
function m5_fn(c,f,a,b,col,w,sw,dash,n){n=n||240;ctx.save();ctx.beginPath();ctx.rect(c.X(c.xa),c.Y(c.yb),c.X(c.xb)-c.X(c.xa),c.Y(c.ya)-c.Y(c.yb));ctx.clip();
 ctx.strokeStyle=col;ctx.lineWidth=w||2.6;ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();var st=false;
 for(var i=0;i<=n;i++){var x=a+(b-a)*i/n,y=f(x);if(!isFinite(y)){st=false;continue;}var px=sw?c.X(y):c.X(x),py=sw?c.Y(x):c.Y(y);if(st)ctx.lineTo(px,py);else{ctx.moveTo(px,py);st=true;}}
 ctx.stroke();ctx.setLineDash([]);ctx.restore();}
function m5_pt(c,x,y,col,r,open){var px=c.X(x),py=c.Y(y);r=r||5;if(open){DOT(px,py,r,'#fff');DOT(px,py,r,col,false);}else{DOT(px,py,r+1.5,'#fff');DOT(px,py,r,col);}}
function m5_sg(c,x1,y1,x2,y2,col,w,dash){LN(c.X(x1),c.Y(y1),c.X(x2),c.Y(y2),col,w||1.5,dash||null);}
function m5_t(c,s,x,y,col,sz,al){TB(s,c.X(x),c.Y(y),col||INK,Math.round((sz||13)*1.4),al||'center');}
function m5_tag(c,s,x,y,col,sz){tag(s,c.X(x),c.Y(y),col||INK,Math.round((sz||13)*1.4));}
function m5_cap(s,col,al){TB(s,al==='right'?W-12:12,24,col||INK,19,al||'left');}
function m5_bx(x,y,w,h,col,txt,sz){ctx.fillStyle='#f4f8fd';ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,8);ctx.fill();ctx.stroke();TB(txt,x,y+(sz||14)*.35,dk(col),sz||14);}
function m5_ar(x1,y1,x2,y2,col,w){var vx=x2-x1,vy=y2-y1;arrow(x1,y1,vx,vy,col||GREY,'',w||2);}
/* chaîne de boîtes : items [{n:nombre ou null, b:boîte ou null}] alternés ; progression pp (0..1) */
function m5_chain(y,xs,col,lab){/* xs = [x1..] positions ; lab = textes */}
/* machine : valeurs v0 -> [f] -> v1 -> [g] -> v2 ; p révèle les valeurs de gauche à droite */
function m5_flow(y,v0,b1,v1,b2,v2,pp,c1,c2){var x=[W*.1,W*.3,W*.5,W*.7,W*.9];
 TB(v0,x[0],y+8,INK,25);m5_ar(x[0]+26,y,x[1]-w2(b1),y,GREY);m5_bx(x[1],y,w2(b1)*2,38,c1||BLUE,b1,18);
 m5_ar(x[1]+w2(b1),y,x[2]-28,y,GREY);ctx.globalAlpha=m5_fd(pp,.0,.3);TB(v1,x[2],y+8,dk(c1||BLUE),25);ctx.globalAlpha=1;
 m5_ar(x[2]+28,y,x[3]-w2(b2),y,GREY);m5_bx(x[3],y,w2(b2)*2,38,c2||ORA2,b2,18);m5_ar(x[3]+w2(b2),y,x[4]-32,y,GREY);
 ctx.globalAlpha=m5_fd(pp,.35,.7);TB(v2,x[4],y+8,dk(c2||ORA2),28);ctx.globalAlpha=1;
 function w2(s){return 16+s.length*6;}}

SFA.theo("c01", {
 icon: function () { TB('f ∘ g', W*.32, H*.47, BLUE_D, 34); TB('f⁻¹', W*.72, H*.47, ORA2, 34); TB('composer et réciproque', W*.5, H*.72, ORANGE, 17); },
 anim: function (t) {
  var s=Math.min(H-34,W*.52),k=s/3.4,cx=W*.38,cy=H*.5+s/2-16,O={x:cx-s/2,y:cy};
  var c={xa:0,xb:3.4,ya:0,yb:3.4,X:function(x){return O.x+x*k;},Y:function(y){return O.y-y*k;},kx:k,ky:k};
  ctx.strokeStyle='#eceef1';ctx.lineWidth=1;for(var i=0;i<=3;i++){m5_sg(c,i,0,i,3.4,'#eceef1',1);m5_sg(c,0,i,3.4,i,'#eceef1',1);}
  LN(c.X(0),c.Y(0),c.X(3.4)+8,c.Y(0),'#aab0b6',1.5);LN(c.X(0),c.Y(0),c.X(0),c.Y(3.4)-8,'#aab0b6',1.5);
  m5_sg(c,0,0,3.3,3.3,GREY,1.6,[6,5]);m5_t(c,'y = x',3.05,2.75,GREY,13);
  m5_fn(c,function(x){return x*x;},0,1.8,BLUE,3);m5_fn(c,Math.sqrt,0,3.4,ORA2,3);
  var a=.45+1.25*(.5+.5*Math.sin(t*.022)),b=a*a;
  m5_sg(c,a,0,a,b,'#9bbfe8',1.3,[3,3]);m5_sg(c,0,b,a,b,'#9bbfe8',1.3,[3,3]);m5_sg(c,b,0,b,a,'#f0b49c',1.3,[3,3]);m5_sg(c,0,a,b,a,'#f0b49c',1.3,[3,3]);
  m5_sg(c,a,b,b,a,VIOLET,1.4,[2,3]);m5_pt(c,a,b,BLUE,6);m5_pt(c,b,a,ORA2,6);
  m5_t(c,'f(x) = x²',1.55,3.0,BLUE_D,14,'left');m5_t(c,'f⁻¹(x) = √x',2.2,.55,DRED,14,'left');
  var tx=W*.7;TB('Point de f',tx,H*.28,BLUE_D,15,'left');TB('('+nfmt(a.toFixed(2).replace('.',','))+' ; '+nfmt(b.toFixed(2).replace('.',','))+')',tx,H*.28+22,BLUE_D,15,'left');
  TB('Point de f⁻¹',tx,H*.55,DRED,15,'left');TB('('+nfmt(b.toFixed(2).replace('.',','))+' ; '+nfmt(a.toFixed(2).replace('.',','))+')',tx,H*.55+22,DRED,15,'left');
  TB('on échange x et y',tx,H*.8,VIOLET,14,'left');TB('symétrie d’axe y = x',tx,H*.8+20,VIOLET,14,'left');
 },
 th: "<div class='tcard'><b class='h'>Opérations sur les fonctions</b><p>(f + g)(x) = f(x) + g(x) ; (f·g)(x) = f(x)·g(x) ; (f/g)(x) = f(x)/g(x) avec g(x) ≠ 0. Le domaine est l’<b>intersection</b> des domaines de f et de g (et on retire les zéros de g pour un quotient).</p></div>"
 +"<div class='tcard'><b class='h'>Composée f∘g</b><p>(f∘g)(x) = f(g(x)) : on applique <b>g d’abord</b>, puis f. Domaine : les x du domaine de g tels que g(x) soit dans le domaine de f. En général f∘g ≠ g∘f.</p><p><b>Exemple.</b> f(x) = 3x − 1 et g(x) = x² + 1 : (f∘g)(2) = f(5) = 14, tandis que (g∘f)(2) = g(5) = 26.</p></div>"
 +"<div class='tcard'><b class='h'>Fonction réciproque</b><p>f est <b>injective</b> si deux x différents ont toujours deux images différentes (test : toute droite horizontale coupe la courbe au plus une fois). Alors f⁻¹ existe, avec f⁻¹(f(x)) = x et f(f⁻¹(y)) = y. Sa courbe est la <b>symétrique</b> de celle de f par rapport à la droite y = x. Le domaine de f⁻¹ est l’image de f.</p><p><b>Méthode :</b> poser y = f(x), isoler x en fonction de y, puis renommer la variable. Exemple : y = 4x − 7 donne x = (y + 7)/4, donc f⁻¹(x) = (x + 7)/4.</p></div>"
 +"<div class='tcard'><b class='h'>Restreindre pour inverser</b><p>x² n’est pas injective sur ℝ. On la restreint : sur [0 ; +∞[ sa réciproque est √x ; sur ]−∞ ; 0] c’est −√x. Pour f(x) = x² + 2 sur ]−∞ ; 0] : f⁻¹(x) = −√(x − 2), définie pour x ≥ 2.</p></div>"
 +"<div class='tcard'><b class='h'>Homographiques et pièges</b><p>f(x) = (ax + b)/(cx + d) a pour asymptotes x = −d/c et y = a/c ; sa réciproque est encore homographique. Exemple : f(x) = (2x + 1)/(x − 3) donne f⁻¹(x) = (3x + 1)/(x − 2). Elle est sa propre réciproque quand a = −d.</p><p><b>Pièges :</b> ne pas confondre f⁻¹(x) avec 1/f(x) ; vérifier le domaine d’une composée ; ne pas intervertir l’ordre. (6 h : |x − a| est la distance entre x et a.)</p></div>"
});

SFA.figs("c01", [
 /* 0 composées en un point */
 function (p) {
  m5_cap('(f∘g)(2) et (g∘f)(2)',INK);TB('f(x) = 3x − 1',W*.06,H*.2+24,BLUE_D,16,'left');TB('g(x) = x² + 1',W*.94,H*.2+24,DRED,16,'right');
  TB('f ∘ g : on applique g d’abord',W*.5,H*.36,GREY,16);m5_flow(H*.46,'2','g',p>0?'5':'5','f','14',p,RED,BLUE);
  TB('g ∘ f : on applique f d’abord',W*.5,H*.66,GREY,16);m5_flow(H*.77,'2','f','5','g','26',p,BLUE,RED);
 },
 /* 1 réciproque affine */
 function (p) {
  var c=m5_G(-1,8,-1,8,{eq:true,top:30});m5_sg(c,-1,-1,8,8,GREY,1.4,[6,5]);
  m5_fn(c,function(x){return 4*x-7;},-1,3.8,BLUE,3);m5_t(c,'f',2.6,5.2,BLUE_D,15);
  m5_fn(c,function(x){return (x+7)/4;},-1,8,ORA2,ctx.lineWidth&&3);m5_t(c,'f⁻¹',6.6,1.7,DRED,14);
  m5_pt(c,3,5,BLUE,5);m5_t(c,'(3 ; 5)',3.0,5.8,BLUE_D,13,'right');
  var q=m5_fd(p,0,.6);if(q>0){m5_sg(c,3,5,3+2*q,5-2*q,VIOLET,1.4,[3,3]);if(q>=1){m5_pt(c,5,3,ORA2,5);m5_t(c,'(5 ; 3)',5.1,2.2,DRED,13,'left');}}
  m5_cap('f(x) = 4x − 7',BLUE_D);
 },
 /* 2 domaine d'une composée */
 function (p) {
  var c=m5_G(0,12,-1,3.5,{st:1,lab:2,top:30});m5_cap('f∘g(x) = √(x − 5)',INK);
  m5_fn(c,function(x){return Math.sqrt(x-5);},5,12,BLUE,3);m5_pt(c,5,0,BLUE,5);
  m5_fn(c,function(x){return x-5;},0,6.4,GREY,1.5,false,[5,4]);m5_t(c,'g',1.2,-.9,GREY,13);
  var q=m5_fd(p,0,.8);if(q>0){var xe=5+(12-5)*q;ctx.strokeStyle=GREEN;ctx.lineWidth=7;ctx.lineCap='butt';ctx.beginPath();ctx.moveTo(c.X(5),c.Y(0));ctx.lineTo(c.X(xe),c.Y(0));ctx.stroke();
   m5_t(c,'[ 5 ; +∞[',8.8,-.6,DGREEN,15);}
 },
 /* 3 composer et résoudre */
 function (p) {
  var c=m5_G(-4.5,1.5,-2,10,{st:1,lab:2,top:30,ky:1});m5_cap('f∘g(x) = 4x² + 12x + 8',BLUE_D);
  m5_fn(c,function(x){return 2*x*x+1;},-3,1.2,GREY,1.8,false,[5,4]);m5_t(c,'g∘f',1.0,5.6,GREY,13,'left');
  m5_fn(c,function(x){return 4*x*x+12*x+8;},-4.3,1.4,BLUE,3);m5_t(c,'f∘g',-3.7,8.8,BLUE_D,14);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_pt(c,-2,0,RED,6);m5_pt(c,-1,0,RED,6);m5_t(c,'−2',-2.0,-1.0,DRED,14);m5_t(c,'−1',-1.0,-1.0,DRED,14);ctx.globalAlpha=1;}
 },
 /* 4 homographique */
 function (p) {
  var c=m5_G(-3,11,-3,11,{eq:true,st:1,lab:2,top:30});
  m5_sg(c,-3,-3,11,11,GREY,1.3,[6,5]);m5_sg(c,3,-3,3,11,'#9bbfe8',1.3,[5,4]);m5_sg(c,-3,2,11,2,'#9bbfe8',1.3,[5,4]);
  var f=function(x){return (2*x+1)/(x-3);};m5_fn(c,f,-3,2.9,BLUE,3);m5_fn(c,f,3.06,11,BLUE,3);m5_t(c,'f',-2.2,.4,BLUE_D,15);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_sg(c,2,-3,2,11,'#f0b49c',1.3,[5,4]);m5_sg(c,-3,3,11,3,'#f0b49c',1.3,[5,4]);
   var g=function(x){return (3*x+1)/(x-2);};m5_fn(c,g,-3,1.94,ORA2,3);m5_fn(c,g,2.06,11,ORA2,3);m5_t(c,'f⁻¹',-1.9,2.4,DRED,15);ctx.globalAlpha=1;
   if(q>=1){m5_pt(c,4,9,BLUE,5);m5_pt(c,9,4,ORA2,5);m5_t(c,'(4 ; 9)',4.3,9.8,BLUE_D,12,'left');m5_t(c,'(9 ; 4)',9.2,3.1,DRED,12,'left');}}
  m5_cap('f(x) = (2x + 1)/(x − 3)',BLUE_D);
 },
 /* 5 réciproque sur une branche */
 function (p) {
  var c=m5_G(-4,9,-4,9,{eq:true,st:1,lab:2,top:30});m5_sg(c,-4,-4,9,9,GREY,1.3,[6,5]);
  m5_fn(c,function(x){return x*x+2;},0,3,'#c9d6e6',2.4);m5_fn(c,function(x){return x*x+2;},-3,0,BLUE,3.2);m5_t(c,'f',-2.7,7.6,BLUE_D,15);
  var q=m5_fd(p,0,.7);if(q>0){ctx.globalAlpha=q;m5_fn(c,function(x){return x*x+2;},-3,0,ORA2,3.2,true);m5_pt(c,2,0,ORA2,5);m5_t(c,'f⁻¹',7.6,-2.3,DRED,15);ctx.globalAlpha=1;}
  m5_cap('f(x) = x² + 2 sur ]−∞ ; 0]',BLUE_D);
 },
 /* 6 prix */
 function (p) {
  m5_cap('Remise de 10 € et TVA de 20 % (p = 50 €)',INK);
  TB('Magasin A : remise puis TVA',W*.5,H*.3,GREY,16);m5_flow(H*.4,'50','−10','40','×1,2','48',p,RED,BLUE);
  TB('Magasin B : TVA puis remise',W*.5,H*.62,GREY,16);m5_flow(H*.72,'50','×1,2','60','−10','50',p,BLUE,RED);
  var q=m5_fd(p,.7,1);if(q>0){ctx.globalAlpha=q;TB('l’ordre change le prix : 48 € ≠ 50 €',W*.5,H*.92,DGREEN,17);ctx.globalAlpha=1;}
 },
 /* 7 valeur d'une réciproque */
 function (p) {
  var c=m5_G(-1,6,-1,6,{eq:true,st:1,lab:1,top:30});m5_sg(c,-1,-1,6,6,GREY,1.3,[6,5]);
  m5_fn(c,function(x){return x*x-2*x;},1,3.7,BLUE,3);m5_pt(c,1,-1,BLUE,4);m5_t(c,'f',3.4,4.8,BLUE_D,15,'left');
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_fn(c,function(x){return x*x-2*x;},1,3.7,ORA2,3,true);m5_t(c,'f⁻¹',5.4,2.8,DRED,15);
   m5_sg(c,-1,3,3,3,VIOLET,1.4,[3,3]);m5_sg(c,3,3,3,-1,VIOLET,1.4,[3,3]);m5_pt(c,3,3,VIOLET,6);m5_t(c,'f(3) = 3',3.3,3.6,'#5249B5',13,'left');ctx.globalAlpha=1;}
  m5_cap('f(x) = x² − 2x sur [1 ; +∞[',BLUE_D);
 },
 /* 8 involution */
 function (p) {
  var c=m5_G(-4,6,-4,6,{eq:true,st:1,lab:2,top:30});m5_sg(c,-4,-4,6,6,GREY,1.3,[6,5]);
  m5_sg(c,1,-4,1,6,'#bcd0ea',1.3,[5,4]);m5_sg(c,-4,1,6,1,'#bcd0ea',1.3,[5,4]);
  var f=function(x){return (x+1)/(x-1);};m5_fn(c,f,-4,.93,BLUE,3);m5_fn(c,f,1.07,6,BLUE,3);
  m5_t(c,'f = f⁻¹',-3.5,-.6,BLUE_D,14,'left');
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;var r=1+Math.SQRT2,s=1-Math.SQRT2;m5_pt(c,r,r,RED,6);m5_pt(c,s,s,RED,6);m5_t(c,'1 + √2',r+.25,r-.9,DRED,13,'left');m5_t(c,'1 − √2',s-.3,s-.9,DRED,13,'right');ctx.globalAlpha=1;}
  m5_cap('f(x) = (x + 1)/(x − 1)',BLUE_D);
 },
 /* 9 paramètre */
 function (p) {
  var c=m5_G(-3,9,-3,9,{eq:true,st:1,lab:2,top:30});m5_sg(c,-3,-3,9,9,GREY,1.3,[6,5]);
  m5_sg(c,2,-3,2,9,'#bcd0ea',1.3,[5,4]);m5_sg(c,-3,2,9,2,'#bcd0ea',1.3,[5,4]);
  var f=function(x){return (2*x+1)/(x-2);};m5_fn(c,f,-3,1.93,BLUE,3);m5_fn(c,f,2.07,9,BLUE,3);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_pt(c,3,7,BLUE,5);m5_pt(c,7,3,ORA2,5);m5_sg(c,3,7,7,3,VIOLET,1.4,[3,3]);m5_t(c,'f(3) = 7',3.3,7.6,BLUE_D,13,'left');m5_t(c,'f(7) = 3',7.3,2.1,DRED,13,'left');
   m5_tag(c,'a = 2',6.3,6.6,DGREEN,16);ctx.globalAlpha=1;}
  m5_cap('f(x) = (ax + 1)/(x − 2)',BLUE_D);
 }
]);
