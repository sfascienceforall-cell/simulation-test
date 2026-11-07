/* Physique 4e · chapitre 9 : réfraction, réflexion totale, dispersion (aides q_*, q7_*, q8_* des fichiers précédents) */
function q9_medium(y,x1,x2,y2,col){ctx.fillStyle=col||'rgba(120,180,235,.28)';ctx.fillRect(x1,y,x2-x1,y2-y);LN(x1,y,x2,y,INK,2);}
function q9_snell(n1,n2,i){var s=n1*Math.sin(i)/n2;return s>1?null:Math.asin(s);}
/* interface horizontale en O ; le milieu 1 est en haut ; rayon incident arrivant de la gauche */
function q9_scene(O,n1,n2,i,L,a,opts){
 opts=opts||{};var r=q9_snell(n1,n2,i);
 LN(O.x,O.y-L,O.x,O.y+L,GREY,1.5,[5,4]);
 q8_ray(O.x-L*Math.sin(i),O.y-L*Math.cos(i),O.x,O.y,'#e0a418',3);
 if(r!==null){var ex=O.x+L*Math.sin(r)*a,ey=O.y+L*Math.cos(r)*a;if(a>0)q8_ray(O.x,O.y,ex,ey,'#e0a418',3);}
 if(r===null||opts.refl){var f=r===null?a:a*.35;ctx.globalAlpha=r===null?1:.45;if(a>0)q8_ray(O.x,O.y,O.x+L*Math.sin(i)*f,O.y-L*Math.cos(i)*f,'#e0a418',r===null?3:2);ctx.globalAlpha=1;}
 return r;}

SFA.theo("c09", {
 icon: function(){TB('n₁·sin i = n₂·sin r',W*.5,H*.42,BLUE_D,28);TB('réfraction · réflexion totale',W*.5,H*.66,ORANGE,17);},
 anim: function(t){
  var ph=(t%840)/840,total=ph>=.5,u=total?(ph-.5)/.5:ph/.5;
  var iDeg=total?10+70*(.5-.5*Math.cos(u*PI)):10+60*(.5-.5*Math.cos(u*PI)),i=iDeg*D2R;
  var O={x:W*.4,y:H*.5},L=H*.38;
  ctx.fillStyle='rgba(120,180,235,.28)';ctx.fillRect(0,O.y,W*.8,H-O.y);LN(0,O.y,W*.8,O.y,INK,2);
  TB(total?'air n = 1,00':'air n = 1,00',W*.04,H*.1,INK,14,'left');TB('verre n = 1,50',W*.04,H*.93,INK,14,'left');
  var n1=total?1.5:1,n2=total?1:1.5,sg=total?-1:1,r=q9_snell(n1,n2,i);
  LN(O.x,O.y-L,O.x,O.y+L,GREY,1.5,[5,4]);
  /* rayon incident : en haut (air) ou en bas (verre) */
  q8_ray(O.x-L*Math.sin(i),O.y-sg*L*Math.cos(i)*(total?-1:1)*1*(total?-1:1)*0+(total?L*Math.cos(i):-L*Math.cos(i)),O.x,O.y,'#e0a418',3);
  if(r!==null){q8_ray(O.x,O.y,O.x+L*Math.sin(r),O.y+(total?-1:1)*L*Math.cos(r),'#e0a418',3);ctx.globalAlpha=.4;LN(O.x,O.y,O.x+L*.7*Math.sin(i),O.y+(total?1:-1)*L*.7*Math.cos(i),'#e0a418',1.8);ctx.globalAlpha=1;}
  else{q8_ray(O.x,O.y,O.x+L*Math.sin(i),O.y+L*Math.cos(i),'#e0a418',3);}
  TB('i = '+iDeg.toFixed(0)+'°',W*.84,H*.28,BLUE_D,20,'left');
  TB(r===null?'pas de rayon réfracté':'r = '+(r/D2R).toFixed(0)+'°',W*.84,H*.28+30,DRED,r===null?14:20,'left');
  if(r===null)q_pill('réflexion totale',W*.84+52,H*.28+64,DRED,14,'#fdecec');
  TB(total?'verre → air : θc = 41,8°':'air → verre : r < i',W*.84,H*.72,GREY,13,'left');
  TB('n₁·sin i = n₂·sin r',W*.84,H*.84,INK,14,'left');
 },
 th: '<div class="tcard"><b class="h">Indice de réfraction</b><p>L\'indice d\'un milieu transparent est <b>n = c / v</b> (c = 3,0 × 10⁸ m/s dans le vide). n ≥ 1 : vide 1 ; air ≈ 1,00 ; eau 1,33 ; verre 1,50 ; diamant 2,42. Plus n est grand, plus la lumière y est lente : v<sub>eau</sub> = 3,0 × 10⁸ / 1,33 ≈ 2,26 × 10⁸ m/s. Un milieu d\'indice plus grand est dit plus <b>réfringent</b>.</p></div>'+
 '<div class="tcard"><b class="h">La loi de la réfraction (Snell-Descartes)</b><p>À la surface séparant deux milieux, le rayon change de direction : <b>n₁·sin i = n₂·sin r</b> (angles par rapport à la <b>normale</b>). Vers un milieu plus réfringent (n₂ &gt; n₁), le rayon <b>se rapproche de la normale</b> (r &lt; i) ; dans l\'autre sens il s\'en éloigne. Exemple : air → eau, i = 40° : sin r = sin 40° / 1,33 = 0,483, donc <b>r ≈ 28,9°</b>. Incidence normale (i = 0) : pas de déviation.</p></div>'+
 '<div class="tcard"><b class="h">Angle limite et réflexion totale</b><p>Quand la lumière passe vers un milieu <b>moins</b> réfringent (n₁ &gt; n₂), r devient 90° pour une incidence <b>θ<sub>c</sub></b> telle que <b>sin θ<sub>c</sub> = n₂ / n₁</b>. Eau → air : 48,8° ; verre → air : 41,8° ; diamant → air : 24,4°. Au-delà de θ<sub>c</sub> il n\'y a plus de rayon réfracté : la lumière est <b>totalement réfléchie</b>. Condition : n₁ &gt; n₂ <i>et</i> i &gt; θ<sub>c</sub>. Si tu trouves sin r &gt; 1, c\'est qu\'il y a réflexion totale.</p></div>'+
 '<div class="tcard"><b class="h">Applications : fenêtre de Snell et fibre optique</b><p>Au fond d\'une piscine, une lampe à 2,0 m de profondeur n\'éclaire l\'extérieur que dans un disque de rayon R = h·tan θ<sub>c</sub> = 2,0 × tan 48,8° ≈ 2,28 m. Dans une <b>fibre optique</b> (cœur n₁ = 1,48, gaine n₂ = 1,46), la lumière est guidée par réflexions totales : θ<sub>c</sub> = arcsin(1,46/1,48) ≈ 80,6°, donc le rayon doit rester à moins de 9,4° de l\'axe, ce qui limite l\'angle d\'entrée dans l\'air à 14,0°.</p></div>'+
 '<div class="tcard"><b class="h">Dispersion de la lumière blanche</b><p>L\'indice dépend de la couleur : dans le verre, <b>n<sub>violet</sub> &gt; n<sub>rouge</sub></b> (1,53 contre 1,52 pour ce verre). Le violet est donc <b>plus dévié</b> que le rouge : un prisme décompose la lumière blanche en spectre (arc-en-ciel). Exemple : prisme A = 60°, i = 50° : déviation 38,9° pour le rouge, 39,8° pour le violet, soit un écart d\'environ 0,9°.</p></div>'
});

SFA.figs("c09", [
 /* 1 vitesse dans un milieu */ function(p){
  var x0=W*.28,u=(W*.62)/3.2,s=q_r(p,0,.7);TB('vitesse de la lumière (× 10⁸ m/s)',W*.5,H*.1,INK,14);
  [['vide',3.0,GREY],['eau (1,33)',2.26,BLUE],['verre (1,50)',2.0,GREEN]].forEach(function(o,i){var y=H*.26+i*H*.22;TB(o[0],x0-8,y+20,INK,14,'right');ctx.fillStyle=o[2];ctx.fillRect(x0,y,o[1]*u*s,32);if(s>.99)TB(String(o[1]).replace('.',',')+(i==1?' (≈ 2,26)':''),x0+o[1]*u+8,y+22,INK,14,'left');});
  if(s>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('v = c / n',W*.5,H*.93,16);ctx.globalAlpha=1;}
 },
 /* 2 air → eau 40° */ function(p){
  var O={x:W*.45,y:H*.5},a=q_r(p,0,.7),i=40*D2R;q9_medium(O.y,0,W*.9,H);TB('air  n = 1,00',W*.04,H*.1,INK,14,'left');TB('eau  n = 1,33',W*.04,H*.93,BLUE_D,14,'left');
  var r=q9_scene(O,1,1.33,i,H*.4,a);q8_arc(O.x,O.y,56,-PI/2-i,-PI/2,BLUE,'40°',76);
  if(a>.99){q8_arc(O.x,O.y,56,PI/2-r,PI/2,RED,'',0);TB('28,9°',O.x+86*Math.sin(r/2)+8,O.y+86*Math.cos(r/2),DRED,15,'left');ctx.globalAlpha=q_r(p,.7,1);q_ok('sin r = sin 40° / 1,33',W*.76,H*.2,14);q_ok('r ≈ 28,9°',W*.8,H*.35,16);ctx.globalAlpha=1;}
 },
 /* 3 air → verre 60° */ function(p){
  var O={x:W*.45,y:H*.5},a=q_r(p,0,.7),i=60*D2R;q9_medium(O.y,0,W*.9,H,'rgba(150,210,190,.3)');TB('air',W*.04,H*.1,INK,14,'left');TB('verre  n = 1,50',W*.04,H*.93,DGREEN,14,'left');
  var r=q9_scene(O,1,1.5,i,H*.4,a);q8_arc(O.x,O.y,50,-PI/2-i,-PI/2,BLUE,'60°',70);
  if(a>.99){q8_arc(O.x,O.y,50,PI/2-r,PI/2,RED,'',0);TB('35,3°',O.x+78*Math.sin(r/2)+8,O.y+78*Math.cos(r/2),DRED,15,'left');
   LN(O.x,O.y,O.x+H*.4*Math.sin(i),O.y+H*.4*Math.cos(i)*-1*-1*0+H*.4*Math.cos(i),GREY,1.5,[4,4]);ctx.globalAlpha=q_r(p,.7,1);q_ok('r ≈ 35,3°',W*.8,H*.24,16);q_ok('déviation : 60° − 35,3° ≈ 24,7°',W*.62,H*.93,14);ctx.globalAlpha=1;}
 },
 /* 4 angles limites */ function(p){
  var a=q_r(p,0,.7);[['eau',1.33,'48,8°',BLUE],['verre',1.5,'41,8°',GREEN],['diamant',2.42,'24,4°',VIOLET]].forEach(function(o,k){
   var O={x:W*(.17+k*.33),y:H*.55},th=Math.asin(1/o[1]),L=H*.3;
   ctx.fillStyle='rgba(120,180,235,.25)';ctx.fillRect(O.x-W*.14,O.y,W*.28,H*.3);LN(O.x-W*.14,O.y,O.x+W*.14,O.y,INK,2);LN(O.x,O.y-L*.3,O.x,O.y+L*.9,GREY,1.2,[4,4]);
   q8_ray(O.x-L*Math.sin(th),O.y+L*Math.cos(th),O.x,O.y,'#e0a418',2.6);
   LN(O.x,O.y,O.x+W*.13*a,O.y,'#e0a418',2.6);TB(o[0],O.x,H*.2,o[3],15);TB('n = '+String(o[1]).replace('.',','),O.x,H*.2+20,GREY,13);
   if(a>.99)TB('θc = '+o[2],O.x,O.y+H*.3+22,DRED,15);});
  if(a>.99){ctx.globalAlpha=q_r(p,.7,1);q_ok('plus n est grand, plus θc est petit',W*.5,H*.07,14);ctx.globalAlpha=1;}
 },
 /* 5 se rapprocher de la normale (pic dans l'eau) */ function(p){
  var wy=H*.46;ctx.fillStyle='rgba(120,180,235,.28)';ctx.fillRect(W*.1,wy,W*.8,H*.44);LN(W*.1,wy,W*.9,wy,INK,2);TB('eau n = 1,33',W*.88,H*.86,BLUE_D,14,'right');TB('air',W*.88,H*.12,INK,14,'right');
  var ex=W*.5,ty=wy+H*.34,tx=ex-(ty-wy)*Math.tan(40*D2R);LN(ex+(ex-tx)*.9,wy-(ty-wy)*.9,ex,wy,'#8a5a2b',7);
  var a=q_r(p,0,.6);ctx.globalAlpha=.9;LN(ex,wy,tx,ty,'#8a5a2b',7);ctx.globalAlpha=1;
  /* apparent */ var d2=(ty-wy)/1.33;ctx.globalAlpha=.35*(1-a)+.1;ctx.strokeStyle='#8a5a2b';ctx.lineWidth=7;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(ex,wy);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  LN(ex,wy-H*.3,ex,wy+H*.3,GREY,1.2,[4,4]);
  var i=50*D2R,r=Math.asin(Math.sin(i)/1.33);q8_ray(ex-H*.3*Math.sin(i),wy-H*.3*Math.cos(i),ex,wy,'#e0a418',2.6);if(a>0)q8_ray(ex,wy,ex+H*.3*Math.sin(r)*a,wy+H*.3*Math.cos(r)*a,'#e0a418',2.6);
  if(a>0){q8_arc(ex,wy,36,-PI/2-i,-PI/2,BLUE,'i',50);q8_arc(ex,wy,36,PI/2-r,PI/2,RED,'r',54);}
  if(a>.99){ctx.globalAlpha=q_r(p,.6,1);q_ok('r < i : vers la normale',W*.32,H*.1,16);ctx.globalAlpha=1;}
 },
 /* 6 réflexion totale */ function(p){
  var a=q_r(p,0,.7);[[W*.26,30],[W*.74,60]].forEach(function(o,k){var O={x:o[0],y:H*.4},i=o[1]*D2R;ctx.fillStyle='rgba(120,180,235,.28)';ctx.fillRect(O.x-W*.22,O.y,W*.44,H*.5);LN(O.x-W*.22,O.y,O.x+W*.22,O.y,INK,2);
   var L=H*.34;LN(O.x,O.y-L*.9,O.x,O.y+L,GREY,1.2,[4,4]);q8_ray(O.x-L*Math.sin(i),O.y+L*Math.cos(i),O.x,O.y,'#e0a418',2.8);
   var r=q9_snell(1.33,1,i);if(a>0){if(r!==null){q8_ray(O.x,O.y,O.x+L*Math.sin(r)*a,O.y-L*Math.cos(r)*a,'#e0a418',2.8);ctx.globalAlpha=.4;q8_ray(O.x,O.y,O.x+L*Math.sin(i)*a*.6,O.y+L*Math.cos(i)*a*.6,'#e0a418',1.6);ctx.globalAlpha=1;}else{q8_ray(O.x,O.y,O.x+L*Math.sin(i)*a,O.y+L*Math.cos(i)*a,'#e0a418',2.8);}}
   TB('i = '+o[1]+'°',O.x,H*.93,BLUE_D,15);TB('eau → air',O.x,H*.1,GREY,13);});
  if(a>.99){ctx.globalAlpha=q_r(p,.7,1);TB('réfraction',W*.26,H*.2,DGREEN,14);q_ok('réflexion totale',W*.74,H*.2,15);TB('θc = 48,8°',W*.5,H*.58,DRED,14);ctx.globalAlpha=1;}
 },
 /* 7 fenêtre de Snell */ function(p){
  var sy=H*.2,by=H*.82,cx=W*.4,R=2.28,u=(by-sy)/2;ctx.fillStyle='rgba(120,180,235,.28)';ctx.fillRect(W*.03,sy,W*.8,by-sy);LN(W*.03,sy,W*.83,sy,INK,2.4);TB('air',W*.8,sy-8,INK,14,'right');TB('eau',W*.8,by-8,BLUE_D,14,'right');
  DOT(cx,by-6,7,'#f5d56a');A(W*.9,by-6,0,-(by-sy-6),GREY,'',1.6);TB('2,0 m',W*.9+6,(sy+by)/2,INK,14,'left');
  var a=q_r(p,0,.7),th=48.75*D2R;[-1,1].forEach(function(sg){q8_ray(cx,by-6,cx+sg*(by-sy-6)*Math.tan(th)*a,by-6-(by-sy-6)*a,'#e0a418',2.4);});
  LN(cx,by-6,cx,sy,GREY,1.2,[4,4]);
  [-1,1].forEach(function(sg){var ex=cx+sg*(by-sy-6)*Math.tan(th);var ang=sg*70*D2R;if(a>.99){q8_ray(ex,sy,ex+sg*30,sy+(by-sy)*.25,'#e0a418',1.8);}});
  if(a>.99){ctx.fillStyle='rgba(245,213,106,.55)';var rr=(by-sy-6)*Math.tan(th);ctx.fillRect(cx-rr,sy-5,2*rr,6);ctx.globalAlpha=q_r(p,.7,1);q_ok('θc = 48,8° ; R = 2,0 × tan θc ≈ 2,28 m',W*.52,H*.08,14);TB('au-delà : réflexion totale',cx+rr+4,sy+34,DRED,13,'left');ctx.globalAlpha=1;}
 },
 /* 8 fibre optique */ function(p){
  var y0=H*.5,hc=H*.12,hg=H*.2,x0=W*.1,x1=W*.9;ctx.fillStyle='rgba(120,180,235,.2)';ctx.fillRect(x0,y0-hg,x1-x0,2*hg);ctx.fillStyle='rgba(230,240,255,.9)';ctx.fillRect(x0,y0-hc,x1-x0,2*hc);ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.strokeRect(x0,y0-hc,x1-x0,2*hc);
  TB('gaine n₂ = 1,46',W*.5,y0-hg-8,BLUE_D,14);TB('cœur n₁ = 1,48',W*.5,y0+hg+20,DGREEN,14);
  var s=q_r(p,0,.8),ang=9*D2R,dx=hc*2/Math.tan(ang)*.5;var path=[[x0,y0-hc*.6]];var x=x0,y=y0-hc*.6,dir=1;
  var segs=[];while(x<x1-10){var ty=dir>0?y0+hc:y0-hc,t=(ty-y)/(Math.tan(ang)*dir);var nx=Math.min(x1,x+Math.abs(ty-y)/Math.tan(ang));segs.push([x,y,nx,y+dir*(nx-x)*Math.tan(ang)]);x=nx;y=y+dir*(nx-segs[segs.length-1][0]+0)*0;y=segs[segs.length-1][3];dir=-dir;}
  var tot=segs.length,cur=s*tot;segs.forEach(function(g,i){var f=Math.max(0,Math.min(1,cur-i));if(f>0)LN(g[0],g[1],g[0]+(g[2]-g[0])*f,g[1]+(g[3]-g[1])*f,'#e0a418',3);});
  var ax=x0,ay=y0-hc*.6;q8_ray(x0-W*.07,ay-H*.1,x0,ay,'#e0a418',2.6);
  if(s>.99){ctx.globalAlpha=q_r(p,.8,1);q_ok('θc = arcsin(1,46/1,48) ≈ 80,6°',W*.5,H*.1,14);q_ok('entrée max : 14,0° dans l\'air',W*.5,H*.93,14);ctx.globalAlpha=1;}
 },
 /* 9 prisme */ function(p){
  var A={x:W*.46,y:H*.16},B={x:W*.3,y:H*.8},C={x:W*.62,y:H*.8};
  ctx.fillStyle='rgba(180,210,240,.35)';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.fill();ctx.stroke();
  var P1={x:(A.x+B.x)/2+.0,y:(A.y+B.y)/2+H*.06},Q={x:(A.x+C.x)/2-.0,y:(A.y+C.y)/2+H*.06};
  P1={x:A.x+(B.x-A.x)*.55,y:A.y+(B.y-A.y)*.55};Q={x:A.x+(C.x-A.x)*.55,y:A.y+(C.y-A.y)*.55};
  q8_ray(W*.04,P1.y+H*.12,P1.x,P1.y,'#c8ccd0',3.4);LN(P1.x,P1.y,Q.x,Q.y,'#e0a418',2.4);
  var s=q_r(p,0,.7);var ex=W*.96,dy=(ex-Q.x);[[RED,0],[GREEN,.5],[VIOLET,1]].forEach(function(o){var an=(-8+ (o[1])*10+ -.0)*D2R*1;var sl=Math.tan((12+o[1]*6)*D2R);LN(Q.x,Q.y,Q.x+(ex-Q.x)*s,Q.y+(ex-Q.x)*s*sl,o[0],3);});
  TB('blanche',W*.1,P1.y+H*.12-10,INK,14);
  if(s>.99){TB('rouge',ex-4,Q.y+dy*Math.tan(12*D2R)-8,DRED,14,'right');TB('violet',ex-4,Q.y+dy*Math.tan(18*D2R)+20,VIO_D,14,'right');ctx.globalAlpha=q_r(p,.7,1);q_ok('D rouge ≈ 38,9° ; D violet ≈ 39,8°',W*.5,H*.07,14);q_ok('écart ≈ 0,9°',W*.76,H*.93,14);ctx.globalAlpha=1;}
 },
 /* 10 indice, vitesse et couleur */ function(p){
  var g=q_gr(W*.16,H*.7,W*.74,H*.45,320,0,'λ (nm)','n',[400,500,600,700].map(function(v){return v;}),[]);
  g=(function(){var x0=W*.16,y0=H*.7,w=W*.74,h=H*.45;LN(x0,y0,x0+w,y0,AX,1.6);LN(x0,y0,x0,y0-h-10,AX,1.6);TB('n',x0+8,y0-h-12,GREY,13,'left');TB('λ (nm)',x0+w,y0+34,GREY,12,'right');
   return {X:function(l){return x0+(l-400)/300*w*.9;},Y:function(n){return y0-(n-1.51)/.03*h;},x0:x0,y0:y0,w:w,h:h};})();
  var gr=ctx.createLinearGradient(g.x0,0,g.x0+g.w,0);gr.addColorStop(0,'#7f2bd6');gr.addColorStop(.25,'#2b6be0');gr.addColorStop(.45,'#2fb344');gr.addColorStop(.65,'#e6d22b');gr.addColorStop(1,'#e23b2b');ctx.fillStyle=gr;ctx.fillRect(g.x0,g.y0+6,g.w*.9,12);
  [400,500,600,700].forEach(function(l){TB(String(l),g.X(l),g.y0+34,GREY,11);});
  [[1.51,'1,51'],[1.52,'1,52'],[1.53,'1,53'],[1.54,'1,54']].forEach(function(o){LN(g.x0-4,g.Y(o[0]),g.x0,g.Y(o[0]),GREY,1);T(o[1],g.x0-6,g.Y(o[0])+4,GREY,11,'right');});
  var pts=[[400,1.5330],[450,1.5270],[500,1.5230],[550,1.5210],[600,1.5195],[650,1.5185],[700,1.5175]];ctx.strokeStyle=BLUE;ctx.lineWidth=2.8;ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(g.X(q[0]),g.Y(q[1])):ctx.moveTo(g.X(q[0]),g.Y(q[1]));});ctx.stroke();
  var a=q_r(p,0,.6);if(a>0){ctx.globalAlpha=a;DOT(g.X(400),g.Y(1.533),7,VIOLET);DOT(g.X(700),g.Y(1.5175),7,RED);TB('violet : n = 1,53',g.X(400)+10,g.Y(1.533)-10,VIO_D,14,'left');TB('rouge : n = 1,52',g.X(700)-6,g.Y(1.5175)-12,DRED,14,'right');ctx.globalAlpha=1;}
  if(a>.99){ctx.globalAlpha=q_r(p,.6,1);q_ok('n plus grand → v plus petite → plus dévié',W*.5,H*.1,13);ctx.globalAlpha=1;}
 }
]);
