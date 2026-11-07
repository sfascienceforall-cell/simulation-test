/* Physique 4e · chapitre 4 : énergie cinétique et potentielle (aides q_* de theo-01.js / theo-02.js) */
function q4_pend(px,py,L,th,r,col){var bx=px+L*Math.sin(th),by=py+L*Math.cos(th);LN(px,py,bx,by,INK,2);DOT(bx,by,r,'#eef4fb');ctx.strokeStyle=col||BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.stroke();return {x:bx,y:by};}
function q4_prof(x){var N=[[0,25],[.25,0],[.4,0],[.55,15],[.7,0],[.8,0],[.92,20],[1,20]];for(var i=0;i<N.length-1;i++){if(x<=N[i+1][0]){var u=(x-N[i][0])/(N[i+1][0]-N[i][0]);u=(1-Math.cos(PI*u))/2;return N[i][1]+(N[i+1][1]-N[i][1])*u;}}return 20;}
function q4_bars(x,y,w,h,Ep,Ec,E,s){ /* deux barres verticales Ep / Ec */
 var u=h/E;LN(x-6,y,x+w*2+16,y,INK,2);ctx.fillStyle=BLUE;ctx.fillRect(x,y-Ep*u,w,Ep*u);ctx.fillStyle=ORA2;ctx.fillRect(x+w+8,y-Ec*u,w,Ec*u);
 TB('Ep',x+w/2,y+18,BLUE_D,14);TB('Ec',x+w*1.5+8,y+18,DRED,14);LN(x-6,y-h,x+w*2+16,y-h,GREY,1.4,[4,4]);if(s)TB(s,x+w+4,y-h-6,GREY,13);}

SFA.theo("c04", {
 icon: function(){TB('Ec = ½·m·v²',W*.5,H*.4,BLUE_D,32);TB('Ep = m·g·h',W*.5,H*.66,ORANGE,28);},
 anim: function(t){
  var th=PI/3*Math.cos(t*.025),px=W*.3,py=H*.12,L=H*.62;
  LN(px-50,py,px+50,py,INK,3);LN(px-60,py+H*.0,px+60,py,'#fff',0);
  LN(px-70,py+L,px+70,py+L,AX,1.5,[5,5]);TB('h = 0',px-74,py+L+4,GREY,12,'right');
  var hh=(1-Math.cos(th)),Et=1;var Ep=hh/(1-Math.cos(PI/3)),Ec=1-Ep;
  q4_pend(px,py,L,th,13,BLUE);LN(px+90,py+L,px+90,py+L-L*hh,RED,2);TB('h',px+98,py+L-L*hh/2+4,DRED,13,'left');
  var bx=W*.58,by=H*.82,bh=H*.62;
  q4_bars(bx,by,46,bh,Ep,Ec,1,'Em = Ep + Ec = constante');
  TB('Ep max en haut',W*.8,H*.3,BLUE_D,14,'left');TB('Ec max en bas',W*.8,H*.4,DRED,14,'left');
  TB('(sans frottement)',W*.8,H*.5,GREY,13,'left');
 },
 th: '<div class="tcard"><b class="h">Énergie cinétique : l\'énergie du mouvement</b><p><b>E<sub>c</sub> = ½·m·v²</b> (m en kg, v en <b>m/s</b>, E en joules). Elle dépend du <b>carré</b> de la vitesse : vitesse × 2 donne énergie × 4. Exemple : cycliste de 80 kg à 10 m/s : ½ × 80 × 10² = 4 000 J.</p></div>'+
 '<div class="tcard"><b class="h">Énergie potentielle de pesanteur : l\'énergie de la hauteur</b><p><b>E<sub>p</sub> = m·g·h</b> avec g = 9,8 N/kg et h la hauteur par rapport à un <b>niveau de référence que l\'on choisit</b> (sol, table…). Exemple : livre de 1,5 kg à 2,0 m : 1,5 × 9,8 × 2,0 = 29,4 J. La valeur dépend du niveau de référence, mais la <b>variation</b> ΔE<sub>p</sub> n\'en dépend pas : c\'est elle qui compte.</p></div>'+
 '<div class="tcard"><b class="h">Énergie mécanique et conservation</b><p><b>E<sub>m</sub> = E<sub>c</sub> + E<sub>p</sub></b>. Sans frottement, E<sub>m</sub> reste constante : l\'énergie potentielle se transforme en énergie cinétique (et inversement) sans disparaître. En bas d\'une chute de hauteur h : m·g·h = ½·m·v², donc <b>v = √(2·g·h)</b>. La masse disparaît : une pierre de 2 kg et une de 20 kg lâchées de 5 m arrivent toutes deux à √98 ≈ 9,9 m/s.</p></div>'+
 '<div class="tcard"><b class="h">Méthode</b><p>1) Choisis le niveau de référence (h = 0). 2) Écris E<sub>m</sub> au départ et à l\'arrivée. 3) Égalise : m·g·h<sub>départ</sub> + ½·m·v<sub>départ</sub>² = m·g·h<sub>arrivée</sub> + ½·m·v<sub>arrivée</sub>². 4) Simplifie la masse et isole v. Montagnes russes : seule la <b>différence de hauteur</b> compte, pas la forme de la piste. Pour franchir une bosse, il faut arriver au sommet avec une hauteur de départ plus grande que la bosse.</p></div>'+
 '<div class="tcard"><b class="h">Pièges</b><p>Convertis les km/h en m/s avant de calculer E<sub>c</sub> (90 km/h = 25 m/s). N\'oublie pas le <b>carré</b> de v et le facteur ½. Un résultat en kJ = 1 000 J. Avec frottements, E<sub>m</sub> diminue (chapitre 6).</p></div>'
});

SFA.figs("c04", [
 /* 1 cycliste */ function(p){
  var gy=H*.62;floor(W*.03,W*.97,gy+16);var cx=W*.3;DOT(cx-26,gy,14,INK,false);DOT(cx+26,gy,14,INK,false);LN(cx-26,gy,cx,gy-30,INK,3);LN(cx,gy-30,cx+26,gy,INK,3);LN(cx-8,gy-38,cx+12,gy-38,INK,4);
  DOT(cx,gy-54,8,'#fde2d3');A(cx+46,gy-24,70,0,RED,'',3.4);TB('m = 80 kg',cx,gy-76,INK,15);TB('v = 10 m/s',cx+80,gy-32,DRED,15);
  var s=q_r(p,0,.7);ctx.fillStyle=ORA2;ctx.fillRect(W*.1,H*.86,W*.8*s*.9,16);TB('Ec',W*.06,H*.86+14,DRED,14,'right');
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('Ec = ½ × 80 × 10² = 4 000 J',W*.5,H*.14,16);ctx.globalAlpha=1;}
 },
 /* 2 livre */ function(p){
  var x=W*.34,gy=H*.9,sy=H*.3;floor(W*.04,W*.6,gy);LN(x-70,sy,x+70,sy,INK,5);LN(x-60,sy,x-60,gy,GREY,3);LN(x+60,sy,x+60,gy,GREY,3);
  ctx.fillStyle='#d9ecff';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(x-22,sy-20,44,18);ctx.strokeRect(x-22,sy-20,44,18);TB('1,5 kg',x,sy-28,BLUE_D,14);
  A(x+96,gy,0,-(gy-sy),GREY,'',2);TB('h = 2,0 m',x+108,(gy+sy)/2,INK,15,'left');
  if(p>0){ctx.globalAlpha=q_r(p,0,.6);q_ok('Ep = 1,5 × 9,8 × 2,0',W*.78,H*.3,15);q_ok('= 29,4 J',W*.78,H*.46,18);ctx.globalAlpha=1;}
 },
 /* 3 pierre */ function(p){
  var x=W*.25,top=H*.14,bot=H*.84;floor(x-40,x+40,bot+12);var s=q_r(p,0,.8),y=top+(bot-top)*s*s;DOT(x,y,12,'#e6e8eb');ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.stroke();
  A(x+40,top,0,bot-top,GREY,'',2);TB('5,0 m',x+52,(top+bot)/2,INK,14,'left');TB('2 kg',x-24,y+5,INK,13,'right');
  var Ep=98*(1-s*s),Ec=98*s*s;q4_bars(W*.52,H*.84,52,H*.6,Ep,Ec,98,'98 J');
  if(s>.99){ctx.globalAlpha=q_r(p,.8,1);q_ok('v = √(2 × 9,8 × 5) ≈ 9,9 m/s',W*.7,H*.1,15);ctx.globalAlpha=1;}
 },
 /* 4 voiture 90 km/h */ function(p){
  var gy=H*.86;floor(W*.03,W*.97,gy);car(W*.17,gy-22,BLUE);A(W*.17+34,gy-22,52,0,RED,'',3.4);TB('25 m/s',W*.17,gy-54,DRED,15);
  TB('1 200 kg',W*.17,gy+30,INK,14);
  var xb=W*.62;LN(xb-30,gy,xb+30,gy,INK,3);var hh=(gy-H*.12);A(xb+60,gy,0,-hh,GREY,'',2);TB('?',xb+74,(gy+H*.12)/2,INK,22,'left');
  var s=q_r(p,0,.7);var hp=hh*s;LN(xb-26,gy-hp,xb+26,gy-hp,ORANGE,3);BALL(xb,gy-hp-10,10);
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('h = v²/2g ≈ 31,9 m',W*.62,H*.1,15);q_ok('Ec = 375 kJ',W*.2,H*.4,17);ctx.globalAlpha=1;}
 },
 /* 5 doubler la vitesse */ function(p){
  var u=W*.12,x1=W*.14,x2=W*.46,yb=H*.74;
  ctx.fillStyle='rgba(55,138,221,.35)';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(x1,yb-u,u,u);ctx.strokeRect(x1,yb-u,u,u);TB('30 km/h',x1+u/2,yb+22,BLUE_D,14);TB('Ec',x1+u/2,yb-u/2+5,BLUE_D,15);
  ctx.strokeRect(x2,yb-2*u,2*u,2*u);TB('60 km/h',x2+u,yb+22,DRED,14);
  var s=q_r(p,0,.6);ctx.globalAlpha=.25+.75*s;[[0,0],[1,0],[0,1],[1,1]].forEach(function(c,i){ctx.fillStyle=i?'rgba(226,75,74,.32)':'rgba(55,138,221,.35)';ctx.fillRect(x2+c[0]*u,yb-(c[1]+1)*u,u,u);ctx.strokeStyle=RED;ctx.lineWidth=1.4;ctx.strokeRect(x2+c[0]*u,yb-(c[1]+1)*u,u,u);if(s>.5)TB('Ec',x2+c[0]*u+u/2,yb-(c[1]+1)*u+u/2+5,DRED,14);});ctx.globalAlpha=1;
  TB('Ec ∝ v²',W*.5,H*.1,INK,18);if(s>.99){ctx.globalAlpha=q_r(p,.6,1);q_ok('× 4',W*.84,H*.46,24);ctx.globalAlpha=1;}
 },
 /* 6 pendules */ function(p){
  var s=q_r(p,0,.8),th=PI/3*(1-s),L=H*.55,py=H*.12;
  [[W*.3,.5,9],[W*.7,2,16]].forEach(function(o){LN(o[0]-44,py,o[0]+44,py,INK,3);var b=q4_pend(o[0],py,L,th,o[2],BLUE);TB(o[1]+' kg',o[0],py+L+o[2]+22,INK,14);if(s>.99){A(b.x+o[2]+4,b.y,40,0,RED,'',3);}});
  LN(W*.1,py+L,W*.9,py+L,AX,1.4,[5,5]);TB('60°',W*.3+8,py+40,GREY,14,'left');
  if(s>.99){ctx.globalAlpha=q_r(p,.8,1);q_ok('même vitesse : 3,1 m/s',W*.5,H*.95,16);ctx.globalAlpha=1;}
 },
 /* 7 skateur */ function(p){
  var R=H*.52,xl=W*.16,yt=H*.2,fl=yt+R,xr=W*.84,xm=(xl+xr)/2,hm=(xr-xl)/2;
  ctx.strokeStyle=INK;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(xl,yt);ctx.arc(xl+R,yt,R,PI,PI/2,true);ctx.lineTo(xr-R,fl);ctx.arc(xr-R,yt,R,PI/2,0,true);ctx.stroke();
  LN(xl-20,yt,xr+20,yt,ORANGE,1.6,[6,5]);TB('1,8 m',W*.5,yt-6,ORANGE,14);LN(W*.03,fl,W*.97,fl,AX,1.4,[4,4]);
  var s=q_r(p,0,.9),pos;
  if(s<.5){var a1=s/.5*PI/2;pos={x:xl+R-R*Math.cos(a1),y:yt+R*Math.sin(a1)};}
  else{var a2=(s-.5)/.5*PI/2;pos={x:xr-R+R*Math.sin(a2),y:yt+R*Math.cos(a2)};}
  DOT(pos.x,pos.y-10,10,'#fde2d3');ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(pos.x,pos.y-10,10,0,7);ctx.stroke();
  TB('60 kg',xl+14,yt-14,INK,14,'left');
  if(s>.99){ctx.globalAlpha=q_r(p,.9,1);q_ok('bas : v = 5,9 m/s',W*.5,H*.62,15);q_ok('v₀ = 2 m/s : 6,3 m/s',W*.5,H*.76,14);q_ok('remonte à 1,8 m',W*.5,H*.9,14);ctx.globalAlpha=1;}
 },
 /* 8 niveau de référence */ function(p){
  var gy=H*.9,ty=gy-H*.26,sy=gy-H*.52;floor(W*.04,W*.62,gy);
  ctx.fillStyle='#e9d9c2';ctx.fillRect(W*.14,ty,W*.26,H*.26);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(W*.14,ty,W*.26,H*.26);TB('table',W*.27,ty+H*.15,INK,14);
  LN(W*.04,sy,W*.6,sy,INK,4);TB('étagère',W*.5,sy-8,INK,14);
  var s=q_r(p,0,.7),y=sy-(sy-ty)*0+(ty-sy)*s*s;ctx.fillStyle='#d9ecff';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.fillRect(W*.25,y-18,40,18);ctx.strokeRect(W*.25,y-18,40,18);
  A(W*.7,gy,0,-(gy-sy),GREY,'',2);TB('1,5 m',W*.7+10,(gy+sy)/2+36,INK,14,'left');A(W*.7,gy,0,-(gy-ty),BLUE,'',2.4);TB('0,75 m',W*.7-10,gy-(gy-ty)/2,BLUE_D,13,'right');
  if(p>0){ctx.globalAlpha=q_r(p,.3,1);TB('/ sol : 29,4 J',W*.78,H*.25,BLUE_D,14,'left');TB('/ table : 14,7 J',W*.78,H*.36,BLUE_D,14,'left');q_ok('ΔEp = −14,7 J (dans les deux cas)',W*.5,H*.1,14);q_ok('v = 3,8 m/s',W*.84,H*.58,15);ctx.globalAlpha=1;}
 },
 /* 9 montagnes russes */ function(p){
  var x0=W*.05,x1=W*.95,yb=H*.86,sc=H*.7/27,X=function(u){return x0+(x1-x0)*u;},Y=function(h){return yb-h*sc;};
  ctx.fillStyle='rgba(55,138,221,.08)';ctx.beginPath();ctx.moveTo(X(0),yb);for(var i=0;i<=100;i++)ctx.lineTo(X(i/100),Y(q4_prof(i/100)));ctx.lineTo(X(1),yb);ctx.fill();
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();for(var i=0;i<=100;i++){var u=i/100;i?ctx.lineTo(X(u),Y(q4_prof(u))):ctx.moveTo(X(u),Y(q4_prof(u)));}ctx.stroke();
  LN(X(0),Y(25),X(1),Y(25),ORANGE,1.5,[6,5]);TB('25 m',X(.03),Y(25)-8,ORANGE,13,'left');TB('15 m',X(.55),Y(15)-10,GREY,13);TB('20 m',X(.92),Y(20)-10,GREY,13);
  var s=q_r(p,0,.8),u=Math.min(.55,s*.55);var a=q_r(p,0,.4);var uu=a<1?a*.25:.25+q_r(p,.4,.8)*.3;var cy=Y(q4_prof(uu));DOT(X(uu),cy-10,9,'#fdece4');ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(X(uu),cy-10,9,0,7);ctx.stroke();
  if(p>.8){ctx.globalAlpha=q_r(p,.8,1);q_ok('bas : 22,1 m/s',X(.27),Y(7),14);q_ok('2e bosse : 14 m/s ; 49 kJ',X(.62),Y(23),13);ctx.globalAlpha=1;}
 },
 /* 10 Ec = Ep */ function(p){
  var g=q_gr(W*.14,H*.86,W*.74,H*.7,22,220,'h (m)','E (J par kg)',[5,10,15,20],[50,100,150,200],true);
  q_seg(g,0,200,20.4,200,GREY,2.4,[6,4]);TB('Em = 200 J/kg',g.X(15),g.Y(200)-8,GREY,13);
  q_seg(g,0,0,20.4,200,BLUE,3);TB('Ep',g.X(17),g.Y(160),BLUE_D,15);q_seg(g,0,200,20.4,0,RED,3);TB('Ec',g.X(17),g.Y(40),DRED,15);
  var s=q_r(p,0,.7);if(s>0){ctx.globalAlpha=s;q_dash(g,10.2,100,DGREEN);DOT(g.X(10.2),g.Y(100),8,GREEN);q_ok('h = 10,2 m',g.X(10.2)+30,g.Y(100)+34,16);ctx.globalAlpha=1;}
 }
]);
