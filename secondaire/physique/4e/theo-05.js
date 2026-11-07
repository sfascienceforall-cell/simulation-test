/* Physique 4e · chapitre 5 : travail, puissance et rendement (aides q_* de theo-01.js / theo-02.js) */
function q5_crate(x,y,w,h,lab,col){ctx.fillStyle='#d9ecff';ctx.strokeStyle=col||BLUE;ctx.lineWidth=2.4;ctx.fillRect(x-w/2,y-h,w,h);ctx.strokeRect(x-w/2,y-h,w,h);if(lab)TB(lab,x,y-h/2+5,BLUE_D,14);}
function q5_rule(x0,x1,y,n,lab){LN(x0,y,x1,y,INK,2);for(var i=0;i<=n;i++){var x=x0+(x1-x0)*i/n;LN(x,y-4,x,y+4,INK,1.5);}TB(lab,(x0+x1)/2,y+22,INK,15);}
function q5_man(x,gy,h,col){var r=h*.11;DOT(x,gy-h+r,r,'#fde2d3');LN(x,gy-h+2*r,x,gy-h*.45,col||GREEN,3.4);LN(x,gy-h*.45,x-h*.14,gy,col||GREEN,3.4);LN(x,gy-h*.45,x+h*.14,gy,col||GREEN,3.4);}

SFA.theo("c05", {
 icon: function(){TB('W = F · d',W*.5,H*.4,BLUE_D,36);TB('P = W / t   η = Wutile / Wreçu',W*.5,H*.68,ORANGE,17);},
 anim: function(t){
  var tau=Math.min(4,(t%300)/60),d=2*tau,x0=W*.08,x1=W*.74,gy=H*.5,u=(x1-x0)/8;
  floor(W*.02,W*.8,gy);q5_rule(x0,x1,gy+30,8,'');for(var k=0;k<=8;k+=2)T(k+' m',x0+k*u,gy+54,GREY,12);
  var cx=x0+d*u+20;q5_crate(cx,gy,56,40,'');A(cx-60,gy-20,52,0,RED,'',3.8);TB('F = 150 N',cx-62,gy-36,DRED,15,'left');
  LN(x0+20,gy-62,cx,gy-62,GREY,2);TB('d = '+d.toFixed(1).replace('.',',')+' m',(x0+20+cx)/2,gy-70,INK,14);
  var Wk=150*d;ctx.fillStyle='rgba(55,138,221,.3)';ctx.fillRect(W*.08,H*.8,Math.max(2,Wk/1200*W*.66),20);ctx.strokeStyle=BLUE;ctx.lineWidth=1.6;ctx.strokeRect(W*.08,H*.8,W*.66,20);
  TB('W = F · d = '+String(Math.round(Wk)).replace(/\B(?=(\d{3})+$)/g,' ')+' J',W*.08,H*.8-8,BLUE_D,16,'left');
  TB('P = W / t',W*.84,H*.2,INK,17);TB('= 300 W',W*.84,H*.2+28,ORANGE,18);TB('(4 s)',W*.84,H*.2+52,GREY,14);
 },
 th: '<div class="tcard"><b class="h">Le travail d\'une force</b><p>Une force dont le point d\'application se déplace transfère de l\'énergie : <b>W = F · d</b> (F en N, d en m, W en <b>joules</b> : 1 J = 1 N·m), quand la force est <b>dans le sens du déplacement</b>. Exemple : 150 N sur 8 m : 1 200 J. Si la force est <b>perpendiculaire</b> au déplacement, W = 0 (le serveur qui porte un plateau à vitesse constante ne lui fournit aucun travail). Si elle est oblique, seule la composante dans le sens du déplacement compte : W = F·d·cos α (80 N, 60°, 15 m : 600 J).</p></div>'+
 '<div class="tcard"><b class="h">La puissance</b><p><b>P = W / t</b> (en <b>watts</b> : 1 W = 1 J/s). Elle dit à quelle vitesse l\'énergie est transférée. 1 200 J en 20 s : 60 W. À travail égal, plus c\'est rapide, plus la puissance est grande. 1 kWh = 3,6 MJ est une énergie (puissance × durée), pas une puissance.</p></div>'+
 '<div class="tcard"><b class="h">Le rendement</b><p><b>η = énergie utile / énergie reçue</b> (nombre sans unité, ≤ 1, souvent en %). 500 J reçus, 400 J utiles : η = 80 % ; les 100 J restants deviennent de la chaleur. Dans une <b>chaîne</b>, les rendements se <b>multiplient</b> : 0,40 × 0,90 × 0,80 = 0,288, soit 28,8 %.</p></div>'+
 '<div class="tcard"><b class="h">Machines simples</b><p>Rampe, levier, poulie : elles permettent d\'exercer une <b>force plus petite</b> mais sur une <b>distance plus grande</b>. Le travail reste le même (sans frottement) : soulever 20 kg de 1,0 m demande 196 J ; avec une rampe de 4,0 m, F = 196 / 4 = 49 N. On ne gagne jamais d\'énergie.</p></div>'+
 '<div class="tcard"><b class="h">Pièges</b><p>Travail ≠ puissance ≠ énergie à ne pas confondre : deux personnes qui montent le même escalier font le même travail à masse égale, mais celle qui monte le plus vite développe la plus grande puissance. Convertis les durées en secondes, et prends bien la hauteur <b>verticale</b> (pas la longueur de l\'escalier) pour m·g·h.</p></div>'
});

SFA.figs("c05", [
 /* 1 pousser une caisse */ function(p){
  var gy=H*.62,x0=W*.1,x1=W*.86,u=(x1-x0)/8,s=q_r(p,0,.7);floor(W*.03,W*.97,gy);
  var cx=x0+30+(x1-x0-60)*s*0;DOT(0,0,0,'#fff');var xx=x0+40+(8*u-40)*s;
  q5_crate(xx,gy,60,44,'');A(xx-72,gy-22,56,0,RED,'',4);TB('F = 150 N',xx-72,gy-40,DRED,15,'left');
  q5_rule(x0+10,x0+10+8*u,gy+30,8,'d = 8 m');
  ctx.globalAlpha=q_r(p,.6,1);q_ok('W = 150 × 8 = 1 200 J',W*.5,H*.14,18);ctx.globalAlpha=1;
 },
 /* 2 puissance */ function(p){
  var y=H*.45;ctx.fillStyle='#e6e9ee';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.12,y-34,86,68,10);ctx.fill();ctx.stroke();TB('moteur',W*.12+43,y+5,INK,15);
  A(W*.12+90,y,W*.2,0,BLUE,'',3.4);TB('W = 1 200 J',W*.46,y-18,BLUE_D,16);q_clock(W*.74,y,32,20/60,ORANGE);TB('20 s',W*.74,y+56,ORANGE,16);
  var a=q_r(p,0,.6);ctx.globalAlpha=a;q_ok('P = 1 200 / 20 = 60 W',W*.5,H*.82,19);TB('comme une petite ampoule',W*.5,H*.95,GREY,14);ctx.globalAlpha=1;
 },
 /* 3 Sankey rendement */ function(p){
  var y=H*.44,x0=W*.06,xm=W*.36,x1=W*.64,k=.2;
  ctx.fillStyle='rgba(55,138,221,.35)';ctx.fillRect(x0,y-500*k/2,xm-x0,500*k);TB('500 J',x0+6,y-500*k/2-8,BLUE_D,16,'left');TB('énergie électrique',x0+4,y+500*k/2+20,BLUE_D,13,'left');
  var s=q_r(p,0,.7);ctx.fillStyle='rgba(29,158,117,.4)';ctx.beginPath();ctx.moveTo(xm,y-250*k);ctx.lineTo(xm+(x1-xm)*s,y-250*k);ctx.lineTo(xm+(x1-xm)*s,y-250*k+400*k);ctx.lineTo(xm,y-250*k+400*k);ctx.fill();
  ctx.fillStyle='rgba(226,75,74,.4)';ctx.beginPath();ctx.moveTo(xm,y+150*k);ctx.lineTo(xm+(x1-xm)*s*.9,y+150*k+(60*s));ctx.lineTo(xm+(x1-xm)*s*.9,y+150*k+(60*s)+100*k);ctx.lineTo(xm,y+250*k);ctx.fill();
  if(s>.99){TB('400 J utiles',x1+8,y-250*k+400*k/2+5,DGREEN,15,'left');TB('100 J',x1+8,y+150*k+60+50*k-8,DRED,15,'left');TB('chaleur',x1+8,y+150*k+60+50*k+10,DRED,14,'left');ctx.globalAlpha=q_r(p,.7,1);q_ok('η = 400 / 500 = 80 %',W*.5,H*.92,17);ctx.globalAlpha=1;}
 },
 /* 4 rampe */ function(p){
  var xa=W*.1,xb=W*.62,gy=H*.84,top=H*.3;ctx.fillStyle='#eef0f3';ctx.beginPath();ctx.moveTo(xa,gy);ctx.lineTo(xb,gy);ctx.lineTo(xb,top);ctx.closePath();ctx.fill();LN(xa,gy,xb,top,INK,3);LN(xa,gy,xb,gy,INK,2.5);LN(xb,top,xb,gy,GREY,1.6,[5,4]);
  TB('4,0 m',(xa+xb)/2-16,(gy+top)/2-26,INK,15);TB('1,0 m',xb+8,(gy+top)/2,INK,15,'left');
  var s=q_r(p,0,.7),f=.15+.55*s,px=xa+(xb-xa)*f,py=gy+(top-gy)*f,an=Math.atan2(top-gy,xb-xa);
  ctx.save();ctx.translate(px,py);ctx.rotate(an);ctx.fillStyle='#d9ecff';ctx.strokeStyle=BLUE;ctx.lineWidth=2.2;ctx.fillRect(-18,-34,36,34);ctx.strokeRect(-18,-34,36,34);ctx.restore();
  A(px,py-18,Math.cos(an)*64,Math.sin(an)*64,RED,'',3.6);TB('20 kg',px-18,py-50,BLUE_D,14);
  ctx.globalAlpha=q_r(p,.6,1);q_ok('W = 20 × 9,8 × 1,0 = 196 J',W*.5,H*.1,15);q_ok('F = 196 / 4,0 = 49 N',W*.8,H*.74,15);ctx.globalAlpha=1;
 },
 /* 5 serveur */ function(p){
  var gy=H*.86,x=W*.3;floor(W*.03,W*.97,gy);q5_man(x,gy,H*.6,GREEN);LN(x-10,gy-H*.34,x+40,gy-H*.34,INK,4);ctx.fillStyle='#fff';ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+16,gy-H*.34-8,8,0,PI,true);ctx.stroke();
  A(x+16,gy-H*.34-14,0,-52,BLUE,'F',3.6);A(x+60,gy-H*.2,90,0,DGREEN,'d',3.6);TB('F : vers le haut',x+34,gy-H*.34-50,BLUE_D,14,'left');TB('déplacement : horizontal',x+104,gy-H*.2+26,DGREEN,14);
  rmark({x:x+16,y:gy-H*.34-14},{x:1,y:0},{x:0,y:-1},12,GREY);
  var a=q_r(p,0,.5);ctx.globalAlpha=a;q_ok('F ⟂ d : W = 0',W*.7,H*.2,19);ctx.globalAlpha=1;
 },
 /* 6 valise */ function(p){
  var gy=H*.78,x=W*.36,s=q_r(p,0,.7);floor(W*.03,W*.97,gy);q5_crate(x,gy-2,64,44,'');var an=-60*D2R;
  A(x+20,gy-24,Math.cos(an)*86,Math.sin(an)*86,RED,'',3.8);TB('F = 80 N',x+78,gy-96,DRED,15,'left');arcA({x:x+20,y:gy-24},38,0,an,'60°',GREY);
  LN(x+20,gy-24,x+20+43,gy-24,'#9aa0a6',1.2,[4,4]);
  A(x+20,gy-24,43*s,0,BLUE,'',3.2);if(s>.5)TB('F·cos 60° = 40 N',x+66,gy-12,BLUE_D,13,'left');
  q5_rule(W*.1,W*.1+W*.58,gy+30,15,'d = 15 m');
  ctx.globalAlpha=q_r(p,.6,1);q_ok('W = 80 × 15 × cos 60° = 600 J',W*.5,H*.1,16);q_ok('P = 600 / 10 = 60 W',W*.8,H*.5,15);ctx.globalAlpha=1;
 },
 /* 7 quatre étages */ function(p){
  var bx=W*.08,bw=W*.3,gy=H*.9,fh=(gy-H*.12)/4;ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.fillStyle='#eef0f3';ctx.fillRect(bx,gy-4*fh,bw,4*fh);ctx.strokeRect(bx,gy-4*fh,bw,4*fh);for(var i=1;i<4;i++)LN(bx,gy-i*fh,bx+bw,gy-i*fh,GREY,1.4);
  var s=q_r(p,0,.7);q5_man(bx+bw*.5,gy-4*fh*s,34,GREEN);
  A(bx+bw+22,gy,0,-4*fh,GREY,'',2);TB('12 m',bx+bw+32,gy-2*fh,INK,14,'left');TB('70 kg · 30 s',W*.7,H*.1,INK,14);
  if(p>0){ctx.globalAlpha=q_r(p,.5,1);q_ok('W = 70 × 9,8 × 12 ≈ 8 230 J',W*.74,H*.3,14);q_ok('P ≈ 274 W (≈ 4,6 ampoules)',W*.74,H*.5,14);q_ok('puissance chimique ≈ 1 100 W',W*.74,H*.7,14);ctx.globalAlpha=1;}
 },
 /* 8 chaîne */ function(p){
  var y=H*.3,bw=W*.2,xs=[W*.06,W*.4,W*.74],L=[['centrale','40 %'],['ligne','90 %'],['moteur','80 %']],kk=H*.0044,base=H*.9;
  L.forEach(function(o,i){ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(xs[i],y-30,bw,60,10);ctx.fill();ctx.stroke();TB(o[0],xs[i]+bw/2,y-4,BLUE_D,15);TB('η = '+o[1],xs[i]+bw/2,y+18,DRED,15);});
  [0,1,2].forEach(function(i){A(xs[i]+bw+2,y,W*.34-bw-4,0,GREY,'',2);});
  var vals=[100,40,36,28.8],lab=['100 %','40 %','36 %','28,8 %'],xx=[W*.14,W*.38,W*.62,W*.86],s=q_r(p,0,.8);
  for(var i=0;i<4;i++){var a=i==0?1:q_r(s,(i-1)*.33,(i-1)*.33+.33);ctx.globalAlpha=a;ctx.fillStyle=i==3?'rgba(29,158,117,.5)':'rgba(55,138,221,.4)';var h=vals[i]*kk;ctx.fillRect(xx[i]-20,base-h,40,h);TB(lab[i],xx[i],base+16,i==3?DGREEN:BLUE_D,14);ctx.globalAlpha=1;}
  ctx.globalAlpha=q_r(p,.8,1);q_ok('0,40 × 0,90 × 0,80 = 28,8 %',W*.5,H*.58,16);ctx.globalAlpha=1;
 },
 /* 9 treuil */ function(p){
  var cx=W*.3,cy=H*.2,r=24;LN(cx-60,cy-r-8,cx+60,cy-r-8,INK,4);DOT(cx,cy,r,'#eef4fb');ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();DOT(cx,cy,4,INK);
  var s=q_r(p,0,.75),by=H*.84-(H*.84-H*.4)*s;LN(cx+r,cy,cx+r,by,INK,2.4);q5_crate(cx+r,H*.9-(H*.9-H*.46)*s,40,34,'10 kg');
  A(W*.1,H*.9,0,-(H*.9-H*.46)*.0,GREY,'');A(W*.12,H*.9,0,-(H*.9-H*.46),GREY,'',2);TB('6,0 m',W*.14,H*.68,INK,14,'left');
  TB('12 V · 5,0 A',W*.7,H*.16,BLUE_D,16);
  if(p>.2){ctx.globalAlpha=q_r(p,.4,1);TB('P électrique = 60 W',W*.52,H*.3,BLUE_D,15,'left');TB('P utile = 29,4 W',W*.52,H*.4,DGREEN,15,'left');q_ok('η = 29,4 / 60 = 49 %',W*.72,H*.55,16);TB('chaleur : 612 J',W*.52,H*.72,DRED,15,'left');ctx.globalAlpha=1;}
 },
 /* 10 travail vs puissance */ function(p){
  var x0=W*.12,y0=H*.9,k=.0;var s=q_r(p,0,.7);
  TB('travail (J)',W*.28,H*.1,INK,15);TB('puissance (W)',W*.74,H*.1,INK,15);
  var bw=48,hmax=H*.5;
  [[W*.15,4900,'A',BLUE],[W*.3,7840,'B',ORA2]].forEach(function(o){var h=o[1]/7840*hmax*s;ctx.fillStyle=o[3];ctx.fillRect(o[0],y0-h,bw,h);TB(o[2],o[0]+bw/2,y0+18,INK,15);if(s>.99)TB(o[1].toLocaleString('fr-FR').replace(/ | /g,' ')+' J',o[0]+bw/2,y0-h-8,INK,13);});
  [[W*.6,245,'A',BLUE],[W*.75,196,'B',ORA2]].forEach(function(o){var h=o[1]/245*hmax*s;ctx.fillStyle=o[3];ctx.fillRect(o[0],y0-h,bw,h);TB(o[2],o[0]+bw/2,y0+18,INK,15);if(s>.99)TB(o[1]+' W',o[0]+bw/2,y0-h-8,INK,13);});
  TB('A : 50 kg, 20 s   ·   B : 80 kg, 40 s',W*.5,H*.99,GREY,13);
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('B : plus de travail, moins de puissance',W*.5,H*.2,14);ctx.globalAlpha=1;}
 }
]);
