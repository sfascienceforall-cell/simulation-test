/* Physique 4e · chapitre 8 : réflexion de la lumière (aides q_* de theo-01.js / theo-02.js, q7_ray de theo-07.js) */
function q8_mir(x1,y1,x2,y2,bx,by,n){ /* miroir : trait épais et hachures du côté (bx,by) */
 LN(x1,y1,x2,y2,'#7f8790',5);LN(x1,y1,x2,y2,'#cfd6dd',2);var L=Math.hypot(x2-x1,y2-y1);n=n||Math.round(L/10);for(var i=0;i<=n;i++){var u=i/n,x=x1+(x2-x1)*u,y=y1+(y2-y1)*u;LN(x,y,x+bx,y+by,'#b5bbc2',1.2);}}
function q8_ray(x1,y1,x2,y2,col,w){LN(x1,y1,x2,y2,col||'#e0a418',w||2.6);var an=Math.atan2(y2-y1,x2-x1),mx=(x1+x2)/2,my=(y1+y2)/2;ctx.fillStyle=col||'#e0a418';ctx.save();ctx.translate(mx,my);ctx.rotate(an);ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,-4.5);ctx.lineTo(-5,4.5);ctx.fill();ctx.restore();}
function q8_arc(x,y,r,a0,a1,col,lab,lr){ctx.strokeStyle=col||GREY;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x,y,r,a0,a1,a1<a0);ctx.stroke();if(lab){var am=(a0+a1)/2;TB(lab,x+(lr||r+16)*Math.cos(am),y+(lr||r+16)*Math.sin(am)+5,col||GREY,14);}}

SFA.theo("c08", {
 icon: function(){var x=W*.5,y=H*.7;q8_mir(W*.2,y,W*.8,y,0,10);LN(x,y,x,H*.15,GREY,1.6,[5,4]);q8_ray(x-W*.2,y-H*.5*.7,x,y,'#e0a418',3);q8_ray(x,y,x+W*.2,y-H*.5*.7,'#e0a418',3);TB('i = r',W*.5,H*.9,BLUE_D,28);},
 anim: function(t){
  var i=(45+25*Math.sin(t*.02))*D2R,x=W*.38,y=H*.72,L=H*.5;
  q8_mir(W*.06,y,W*.7,y,0,12);LN(x,y,x,y-L-10,GREY,1.6,[5,4]);TB('normale',x+6,y-L-10,GREY,13,'left');
  var ix=x-L*Math.sin(i),iy=y-L*Math.cos(i),rx=x+L*Math.sin(i),ry=iy;
  q8_ray(ix,iy,x,y,'#e0a418',3);q8_ray(x,y,rx,ry,'#e0a418',3);
  q8_arc(x,y,50,-PI/2-i,-PI/2,BLUE,'',0);q8_arc(x,y,62,-PI/2,-PI/2+i,RED,'',0);
  TB('i',x-(70)*Math.sin(i/2),y-70*Math.cos(i/2),BLUE_D,16);TB('r',x+70*Math.sin(i/2),y-70*Math.cos(i/2),DRED,16);
  TB('rayon incident',ix-4,iy-10,INK,13,'right');TB('rayon réfléchi',rx+4,ry-10,INK,13,'left');
  var d=Math.round(i/D2R);TB('i = '+d+'°',W*.8,H*.3,BLUE_D,22,'left');TB('r = '+d+'°',W*.8,H*.3+32,DRED,22,'left');TB('r = i',W*.8,H*.3+72,INK,20,'left');
  TB('angles mesurés avec la normale',W*.38,H*.95,GREY,13);
 },
 th: '<div class="tcard"><b class="h">La loi de la réflexion</b><p>Un rayon <b>incident</b> frappe un miroir au point d\'incidence. La <b>normale</b> est la droite perpendiculaire au miroir en ce point. Le rayon réfléchi est dans le même plan et <b>l\'angle de réflexion est égal à l\'angle d\'incidence : r = i</b>. Les angles se mesurent <b>par rapport à la normale</b>, jamais par rapport à la surface. Piège : un rayon qui fait 25° avec la surface a un angle d\'incidence de 90° − 25° = <b>65°</b> ; l\'angle entre le rayon incident et le rayon réfléchi vaut 2i = 130°.</p></div>'+
 '<div class="tcard"><b class="h">L\'image dans un miroir plan</b><p>Un miroir plan donne une image <b>virtuelle</b> (les rayons ne s\'y croisent pas vraiment : leurs prolongements, si), <b>de même taille</b>, <b>symétrique</b> de l\'objet par rapport au miroir : à 1,5 m devant le miroir, ton image est à 1,5 m derrière, donc à 3,0 m de toi. Si tu avances à 1 m/s vers le miroir, l\'image s\'approche aussi de 1 m/s : elle s\'approche de toi à 2 m/s.</p></div>'+
 '<div class="tcard"><b class="h">Réflexion spéculaire et diffuse</b><p>Sur une surface <b>lisse</b> (miroir, eau calme) les rayons parallèles restent parallèles : réflexion <b>spéculaire</b>, on voit une image. Sur une surface <b>rugueuse</b> (papier, mur) chaque petit morceau obéit à la même loi i = r, mais les normales sont dans tous les sens : la lumière est renvoyée dans toutes les directions, réflexion <b>diffuse</b>. C\'est elle qui permet de voir les objets sous tous les angles.</p></div>'+
 '<div class="tcard"><b class="h">Miroir qui tourne</b><p>Si on tourne un miroir d\'un angle θ (le rayon incident restant fixe), la normale tourne de θ et le rayon réfléchi tourne de <b>2θ</b>. Exemple : miroir tourné de 5°, mur à 4,0 m : le spot se déplace de 4,0 × tan(10°) ≈ 0,71 m. Avec un rayon réfléchi qui « se retourne » deux fois plus vite, on mesure de très petits angles (galvanomètre, laser).</p></div>'+
 '<div class="tcard"><b class="h">Deux miroirs et se voir en entier</b><p>Deux miroirs plans formant un angle α donnent <b>360° / α − 1</b> images (α = 60° : 5 images). À angle droit, un rayon qui se réfléchit sur les deux ressort <b>parallèle au rayon d\'entrée et en sens inverse</b> : c\'est le principe du coin réflecteur (catadioptre de vélo, réflecteurs de la Lune). Pour se voir en entier, un miroir vertical de <b>la moitié de la taille</b> suffit (0,80 m pour 1,60 m), quelle que soit la distance, si son bord bas est à mi-hauteur des yeux.</p></div>'
});

SFA.figs("c08", [
 /* 1 i = 30° */ function(p){
  var x=W*.5,y=H*.78,L=H*.55,i=30*D2R;q8_mir(W*.1,y,W*.9,y,0,12);LN(x,y,x,y-L-8,GREY,1.6,[5,4]);
  var ix=x-L*Math.sin(i),iy=y-L*Math.cos(i);q8_ray(ix,iy,x,y,'#e0a418',3.2);
  q8_arc(x,y,60,-PI/2-i,-PI/2,BLUE,'30°',80);TB('incident',ix-6,iy-8,INK,13,'right');
  var a=q_r(p,0,.7);if(a>0){var rx=x+L*Math.sin(i)*a,ry=y-L*Math.cos(i)*a;q8_ray(x,y,rx,ry,'#e0a418',3.2);if(a>.99){q8_arc(x,y,60,-PI/2,-PI/2+i,RED,'30°',80);
   ctx.globalAlpha=q_r(p,.7,1);q_ok('r = 30°',W*.78,H*.3,16);q_ok('avec le miroir : 60°',W*.2,H*.93,14);q_ok('entre les rayons : 60°',W*.76,H*.93,14);ctx.globalAlpha=1;}}
 },
 /* 2 25° avec la surface */ function(p){
  var x=W*.5,y=H*.78,L=H*.6,s=25*D2R,i=90*D2R-s;q8_mir(W*.1,y,W*.9,y,0,12);LN(x,y,x,y-L*.8,GREY,1.6,[5,4]);
  var ix=x-L*Math.cos(s),iy=y-L*Math.sin(s);q8_ray(ix,iy,x,y,'#e0a418',3.2);
  q8_arc(x,y,70,-PI,-PI+s,GREY,'25°',92);
  var a=q_r(p,0,.6);if(a>0){q8_ray(x,y,x+L*Math.cos(s)*a,y-L*Math.sin(s)*a,'#e0a418',3.2);if(a>.99){q8_arc(x,y,48,-PI/2-i,-PI/2,BLUE,'',0);TB('65°',x-28,y-60,BLUE_D,15);TB('65°',x+34,y-60,DRED,15);ctx.globalAlpha=q_r(p,.6,1);q_ok('i = 90° − 25° = 65° = r',W*.5,H*.1,16);q_ok('entre les rayons : 130°',W*.5,H*.93,15);ctx.globalAlpha=1;}}
 },
 /* 3 miroir qui tourne */ function(p){
  var O={x:W*.4,y:H*.7},L=H*.55,i0=20*D2R,s=q_r(p,0,.8),ph=10*D2R*s;
  var Lm=W*.3,mx1=O.x-Lm*Math.cos(0),my1=O.y;q8_mir(O.x-Lm,O.y,O.x+Lm,O.y,0,10);
  var d={x:Math.sin(i0),y:Math.cos(i0)};var S={x:O.x-d.x*L,y:O.y-d.y*L};q8_ray(S.x,S.y,O.x,O.y,'#e0a418',3);
  var r0={x:d.x,y:-d.y};LN(O.x,O.y,O.x+r0.x*L,O.y+r0.y*L,'#c9ced4',2.2,[5,4]);
  if(s>0){ctx.save();ctx.translate(O.x,O.y);ctx.rotate(ph);ctx.clearRect(0,0,0,0);ctx.restore();
   var n={x:Math.sin(ph),y:-Math.cos(ph)},dn=d.x*n.x+d.y*n.y,r={x:d.x-2*dn*n.x,y:d.y-2*dn*n.y};
   /* miroir tourné */ ctx.save();ctx.translate(O.x,O.y);ctx.rotate(ph);ctx.lineWidth=5;LN(-Lm,0,Lm,0,'#7f8790',5);LN(-Lm,0,Lm,0,'#cfd6dd',2);ctx.restore();
   LN(O.x,O.y,O.x+n.x*L*.6,O.y+n.y*L*.6,GREY,1.4,[4,4]);q8_ray(O.x,O.y,O.x+r.x*L,O.y+r.y*L,RED,3);
   if(s>.99){var a0=Math.atan2(r0.y,r0.x),a1=Math.atan2(r.y,r.x);q8_arc(O.x,O.y,L*.7,a1,a0,GREEN,'',0);TB('20°',O.x+L*.78*Math.cos((a0+a1)/2),O.y+L*.78*Math.sin((a0+a1)/2)+5,DGREEN,15);
    ctx.globalAlpha=q_r(p,.8,1);q_ok('miroir tourné de 10°',W*.78,H*.2,14);q_ok('rayon réfléchi : 2 × 10° = 20°',W*.72,H*.93,14);ctx.globalAlpha=1;}}
  TB('i = 20°',O.x-L*Math.sin(i0)-4,O.y-L*Math.cos(i0)-8,BLUE_D,14,'right');
 },
 /* 4 position de l'image */ function(p){
  var mx=W*.5,gy=H*.84,top=H*.2;LN(mx,top,mx,gy,'#7f8790',5);LN(mx,top,mx,gy,'#cfd6dd',2);for(var y=top;y<gy;y+=10)LN(mx,y,mx+9,y+8,'#b5bbc2',1.2);
  q5_man(W*.22,gy,H*.5,BLUE);var a=q_r(p,0,.6);ctx.globalAlpha=.25+.55*a;ctx.setLineDash([4,4]);q5_man(W*.78,gy,H*.5,BLUE);ctx.setLineDash([]);ctx.globalAlpha=1;
  A(W*.22,gy+16,mx-W*.22,0,GREY,'',1.6);TB('1,5 m',(W*.22+mx)/2,gy+34,INK,14);
  if(a>0){ctx.globalAlpha=a;A(mx,gy+16,W*.28,0,BLUE,'',1.6);TB('1,5 m',(mx+W*.78)/2,gy+34,BLUE_D,14);TB('image virtuelle',W*.78,top+8,BLUE_D,13);ctx.globalAlpha=1;
   ctx.globalAlpha=q_r(p,.5,1);q_ok('image à 3,0 m de toi',W*.5,H*.1,16);q_ok('2 m/s',W*.5,H*.62,16);ctx.globalAlpha=1;}
 },
 /* 5 se voir en entier */ function(p){
  var gy=H*.88,hs=H*.62/1.6,xp=W*.2,mx=W*.55;floor(W*.04,W*.96,gy);
  LN(mx,gy-1.55*hs,mx,gy-.75*hs,'#7f8790',6);LN(mx,gy-1.55*hs,mx,gy-.75*hs,'#cfd6dd',2.4);
  q5_man(xp,gy,1.6*hs,GREEN);var ex=xp+6,ey=gy-1.5*hs;DOT(ex,ey,3,INK);
  ctx.globalAlpha=.3;ctx.setLineDash([4,4]);q5_man(2*mx-xp,gy,1.6*hs,GREEN);ctx.setLineDash([]);ctx.globalAlpha=1;
  var a=q_r(p,0,.6);if(a>0){var fx=2*mx-xp,fy=gy,hx=2*mx-xp,hy=gy-1.6*hs;
   [[fy,'#e0a418'],[hy,'#e0a418']].forEach(function(o){var iy=o[0],ty=ey+(iy-ey)*((mx-ex)/(fx-ex));LN(ex,ey,ex+(mx-ex)*a,ey+(ty-ey)*a,o[1],2);if(a>.99)LN(mx,ty,fx,iy,o[1],1.4,[4,4]);if(a>.99)LN(mx,ty,xp+(a>.99?0:0),ty<ey?ey:ey,o[1],0);});
   if(a>.99){ctx.globalAlpha=q_r(p,.6,1);var ya=ey+(gy-ey)*((mx-ex)/(fx-ex)),yb=ey+(gy-1.6*hs-ey)*((mx-ex)/(fx-ex));TB('0,80 m',mx+10,(gy-.75*hs+gy-1.55*hs)/2,DRED,15,'left');q_ok('miroir = la moitié de la taille',W*.52,H*.08,15);ctx.globalAlpha=1;}}
 },
 /* 6 deux miroirs à 60° */ function(p){
  var cx=W*.36,cy=H*.74,R=H*.5,th=20*D2R;
  var P=function(a,r){return {x:cx+r*Math.cos(a),y:cy-r*Math.sin(a)};};
  q8_mir(cx,cy,P(0,R*1.5).x,P(0,R*1.5).y,0,10);var e=P(60*D2R,R*1.2);q8_mir(cx,cy,e.x,e.y,-8,-8);
  ctx.strokeStyle='#e5e7ea';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(cx,cy,R*.7,0,7);ctx.stroke();ctx.setLineDash([]);
  var o=P(th,R*.7);BALL(o.x,o.y,8);TB('objet',o.x+10,o.y-10,DRED,13,'left');
  var imgs=[th+120*D2R,th+240*D2R,-th,-th+120*D2R,-th+240*D2R],s=q_r(p,0,.7);
  imgs.forEach(function(a,i){var f=q_r(s,i*.15,i*.15+.3);if(f<=0)return;ctx.globalAlpha=f*.9;var q=P(a,R*.7);DOT(q.x,q.y,8,'#e6f1fb');ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(q.x,q.y,8,0,7);ctx.stroke();ctx.setLineDash([]);TB(String(i+1),q.x,q.y+5,BLUE_D,12);ctx.globalAlpha=1;});
  TB('60°',cx+46,cy-14,GREY,14,'left');q8_arc(cx,cy,34,-60*D2R,0,GREY);
  ctx.globalAlpha=q_r(p,.7,1);q_ok('360° / 60° − 1 = 5 images',W*.74,H*.4,16);ctx.globalAlpha=1;
 },
 /* 7 spot du miroir tournant */ function(p){
  var wx=W*.1,my=H*.5,mx=W*.82,s=q_r(p,0,.7),ph=5*D2R*s;LN(wx,H*.1,wx,H*.9,INK,4);for(var y=H*.1;y<H*.9;y+=10)LN(wx,y,wx-8,y+7,'#bbb',1);
  DOT(wx+6,my,5,RED);q8_ray(wx+8,my,mx,my,RED,2.2);
  ctx.save();ctx.translate(mx,my);ctx.rotate(ph);LN(0,-34,0,34,'#7f8790',6);LN(0,-34,0,34,'#cfd6dd',2.4);ctx.restore();
  var ang=2*ph,L=mx-wx,ty=my+L*Math.tan(ang);LN(mx,my,wx,ty,RED,2.2,[5,3]);DOT(wx,ty,5,ORANGE);
  A(wx+14,H*.88,mx-wx-20,0,GREY,'',1.4);TB('4,0 m',(wx+mx)/2,H*.88-6,INK,14);
  if(s>.99){var yy=my+L*Math.tan(10*D2R);A(wx-16,my,0,yy-my,DGREEN,'',2);TB('≈ 0,71 m',wx+10,yy+20,DGREEN,14,'left');ctx.globalAlpha=q_r(p,.7,1);q_ok('miroir 5° → rayon 10°',W*.55,H*.12,15);q_ok('4,0 × tan 10° ≈ 0,71 m',W*.6,H*.76,15);ctx.globalAlpha=1;}
 },
 /* 8 le rayon touche le mur */ function(p){
  var wx=W*.6,gy=H*.9,u=W*.1,hs=H*.45;LN(wx,H*.05,wx,gy,'#7f8790',6);LN(wx,H*.05,wx,gy,'#cfd6dd',2);floor(W*.03,W*.97,gy);
  var lx=wx-3*u,ly=gy-.5*hs,ex=wx-2*u,ey=gy-1.5*hs;DOT(lx,ly,8,'#f5d56a');TB('lampe',lx,ly+24,INK,13);DOT(ex,ey,7,'#fde2d3');ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ex,ey,7,0,7);ctx.stroke();TB('œil',ex,ey-14,INK,13);
  var ix=wx+3*u,iy=ly,ty=ey+(iy-ey)*((wx-ex)/(ix-ex)),a=q_r(p,0,.7);
  DOT(ix,iy,8,'rgba(245,213,106,.4)');
  if(a>0){q8_ray(lx+8,ly,lx+8+(wx-lx-8)*a,ly+(ty-ly)*a,'#e0a418',2.4);if(a>.99){q8_ray(wx,ty,ex,ey,'#e0a418',2.4);LN(ex,ey,ix,iy,GREY,1.4,[4,4]);DOT(wx,ty,5,RED);TB('1,1 m',wx+10,ty+4,DRED,14,'left');
   A(W*.93,gy,0,-(gy-ty),GREY,'',1.6);ctx.globalAlpha=q_r(p,.7,1);q_ok('image de la lampe à 3,0 m derrière',W*.5,H*.07,13);q_ok('h = 1,1 m',W*.8,H*.3,16);ctx.globalAlpha=1;}}
 },
 /* 9 coin réflecteur */ function(p){
  var Ym=H*.8,Xm=W*.82,s=35*D2R,P1x=W*.5,L=(Ym-H*.34)/Math.sin(s),Sx=P1x-L*Math.cos(s),Sy=Ym-L*Math.sin(s);
  q8_mir(W*.1,Ym,Xm,Ym,0,10);q8_mir(Xm,Ym,Xm,H*.1,10,0);
  var t2=(Xm-P1x)/Math.cos(s),P2y=Ym-t2*Math.sin(s),a=q_r(p,0,.8);
  var seg=[[Sx,Sy,P1x,Ym],[P1x,Ym,Xm,P2y],[Xm,P2y,Xm-(P2y-H*.14)/Math.sin(s)*Math.cos(s),H*.14]];
  var tot=3,cur=a*tot;seg.forEach(function(g,i){var f=Math.max(0,Math.min(1,cur-i));if(f>0)q8_ray(g[0],g[1],g[0]+(g[2]-g[0])*f,g[1]+(g[3]-g[1])*f,'#e0a418',3);});
  TB('35°',P1x-62,Ym-8,GREY,14);TB('M₁',W*.15,Ym+22,GREY,13);TB('M₂',Xm+16,H*.2,GREY,13,'left');
  if(a>.99){ctx.globalAlpha=q_r(p,.8,1);q_ok('i₁ = 55° · i₂ = 35°',W*.46,H*.1,15);q_ok('sortie ∥ entrée, sens opposé',W*.42,H*.95,14);ctx.globalAlpha=1;}
 },
 /* 10 papier et miroir */ function(p){
  var a=q_r(p,0,.7);
  var y1=H*.7;TB('miroir (lisse)',W*.25,H*.1,BLUE_D,14);q8_mir(W*.04,y1,W*.46,y1,0,8);
  [W*.12,W*.2,W*.28].forEach(function(x){LN(x-30,y1-90,x,y1,'#e0a418',2);LN(x,y1,x+30*a,y1-90*a,'#e0a418',2);});
  TB('papier (rugueux)',W*.75,H*.1,DRED,14);ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();var pts=[[.54,0],[.58,-4],[.62,3],[.66,-5],[.7,2],[.74,-4],[.78,4],[.82,-3],[.86,3],[.9,-2],[.96,0]];pts.forEach(function(q,i){i?ctx.lineTo(W*q[0],y1+q[1]*2.4):ctx.moveTo(W*q[0],y1+q[1]*2.4);});ctx.stroke();
  var nrm=[-.6,.5,-.8,.3,-.4,.7,-.5,.6];[.56,.62,.68,.74,.8,.86].forEach(function(x,i){var an=nrm[i]*.7,hx=W*x;LN(hx-26,y1-80,hx,y1,'#e0a418',2);var d={x:Math.sin(0.4),y:Math.cos(0.4)};var n={x:Math.sin(an),y:-Math.cos(an)};var dd=d.x*n.x+d.y*n.y;var r={x:d.x-2*dd*n.x,y:d.y-2*dd*n.y};LN(hx,y1,hx+r.x*56*a,y1+r.y*56*a,'#e0a418',2);});
  if(a>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('même loi i = r en chaque point',W*.5,H*.93,15);ctx.globalAlpha=1;}
 }
]);
