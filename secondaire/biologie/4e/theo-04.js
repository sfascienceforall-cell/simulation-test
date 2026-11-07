/* Biologie 4e · chapitre 4 · Enzymes et catalyse biologique */
function b4enz(x,y,r,o){o=o||{};ctx.fillStyle=o.fill||'#d9e8f7';ctx.strokeStyle=o.col||BLUE_D;ctx.lineWidth=2.4;ctx.beginPath();
 if(o.bad){for(var i=0;i<=36;i++){var a=i/36*6.2832,k=r*(1+.14*Math.sin(a*5+1)+.1*Math.cos(a*3));i?ctx.lineTo(x+k*1.1*Math.cos(a),y+k*.85*Math.sin(a)):ctx.moveTo(x+k*1.1,y);}ctx.closePath();ctx.fill();ctx.stroke();return;}
 ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();
 ctx.fillStyle='#fff';ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y-r*.1);ctx.lineTo(x-r*.34,y-r*1.15);ctx.lineTo(x+r*.34,y-r*1.15);ctx.closePath();ctx.fill();
 ctx.strokeStyle=o.col||BLUE_D;ctx.lineWidth=2.4;ctx.beginPath();var h=Math.sqrt(r*r-Math.pow(r*.34*.9,2));ctx.moveTo(x-r*.34*.93,y-r*.93);ctx.lineTo(x,y-r*.1);ctx.lineTo(x+r*.34*.93,y-r*.93);ctx.stroke();}
function b4sub(x,y,r,col,half){ctx.fillStyle=col||'#fdece4';ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.beginPath();
 if(half===-1){ctx.moveTo(x,y);ctx.lineTo(x-r*.3,y-r*.8);ctx.lineTo(x,y-r*.8);ctx.closePath();}else if(half===1){ctx.moveTo(x,y);ctx.lineTo(x+r*.3,y-r*.8);ctx.lineTo(x,y-r*.8);ctx.closePath();}
 else{ctx.moveTo(x,y);ctx.lineTo(x-r*.3,y-r*.8);ctx.lineTo(x+r*.3,y-r*.8);ctx.closePath();}ctx.fill();ctx.stroke();}
function b4mm(S,V,K){return V*S/(K+S);}
SFA.theo("c04",{
 icon:function(){var r=Math.min(H*.2,48);b4enz(W*.35,H*.62,r);b4sub(W*.35,H*.62-r*.12-0,r*.9,'#fdece4');TB('v = V   [S]',W*.7,H*.5,BLUE_D,24);TB('max',W*.7-33,H*.56,BLUE_D,12);TB('K + [S]',W*.7+22,H*.72,ORANGE,22);TB('m',W*.7+2,H*.78,ORANGE,12);LN(W*.6,H*.585,W*.88,H*.585,INK,2);},
 anim:function(t){var P=480,k=(t%P)/P,ex=W*.22,ey=H*.58,r=Math.min(H*.2,W*.1);
  TB('Clé et serrure : l\'enzyme se fixe au substrat et ressort intacte',W*.5,H*.07,BLUE_D,Math.max(13,Math.min(16,W/44)));
  var dy,dx=0,bound=false,split=0;
  if(k<.3){dy=-(1-k/.3)*H*.34;dx=(1-k/.3)*W*.1;}else if(k<.6){dy=0;bound=true;}else if(k<.85){dy=0;split=(k-.6)/.25;}else{dy=0;split=1;}
  var glow=bound?.35+.2*Math.sin(t*.12):0;if(glow){ctx.fillStyle='rgba(55,138,221,'+glow+')';ctx.beginPath();ctx.arc(ex,ey,r*1.2,0,7);ctx.fill();}
  b4enz(ex,ey,r);
  var sx=ex+dx,sy=ey-r*.12+dy;
  if(split<=0)b4sub(sx,sy,r*.95);else{b4sub(sx-split*W*.12,sy-split*H*.12,r*.95,'#fff3e0',-1);b4sub(sx+split*W*.1,sy-split*H*.2,r*.95,'#fdece4',1);}
  TB('enzyme',ex,ey+r+22,BLUE_D,14);if(k<.3)TB('substrat',sx+r*1.6,sy-r*.3,ORANGE,14,'left');if(bound)TB('site actif occupé',ex+r*1.2,ey-r*.9,DGREEN,13,'left');if(split>.4)TB('produits',ex+W*.14,ey-r*1.2-H*.1,DRED,14,'left');
  /* courbe de saturation */
  var gx=W*.55,gb=H*.82,gw=W*.38,gh=H*.55,M=b4ax(gx,gb,gw,gh,[0,50],[0,90],'[S]','v');M.xl=gx;M.yb=gb;
  LN(M.x(0),M.y(80),M.x(50),M.y(80),GREEN,1.6,[5,4]);TB('Vmax',M.x(50),M.y(80)-6,DGREEN,13,'right');b4curve(M,function(s){return b4mm(s,80,5);},0,50,BLUE,3,60);
  var s=25+24*Math.sin(t*.012-1.57);if(s<.5)s=.5;DOT(M.x(s),M.y(b4mm(s,80,5)),6,RED);LN(M.x(s),M.y(b4mm(s,80,5)),M.x(s),gb,RED,1,[3,3]);
  TB('plateau : toutes les enzymes sont occupées',gx+gw*.5,H*.97,GREY,12);
 },
 th:'<div class="tcard"><b class="h">Qu\'est-ce qu\'une enzyme ?</b><p>Une enzyme est une <b>protéine</b> qui joue le rôle de <b>catalyseur biologique</b> : elle accélère une réaction <b>précise</b> sans être consommée. Elle se lie au <b>substrat</b> sur son <b>site actif</b> (forme complémentaire, modèle <b>clé-serrure</b>), forme un complexe enzyme-substrat, libère le(s) <b>produit(s)</b> et ressort <b>intacte</b>, prête à recommencer. Chaque enzyme est spécifique d\'un substrat.</p></div>'+
 '<div class="tcard"><b class="h">Température et pH</b><p>Chaque enzyme a une <b>température optimale</b> (≈ 37 °C pour l\'homme) et un <b>pH optimal</b> (amylase salivaire pH ≈ 7, pepsine pH ≈ 2). En dessous, la réaction est lente ; au-delà, la chaleur ou un pH extrême rompent les liaisons faibles qui maintiennent la forme de la protéine : le site actif se déforme, c\'est la <b>dénaturation</b>, <b>irréversible</b>. Le froid ralentit sans détruire.</p></div>'+
 '<div class="tcard"><b class="h">Vitesse et quantité de substrat</b><p><code>v = V<sub>max</sub> · [S] ÷ (K<sub>m</sub> + [S])</code></p><ul><li>V<sub>max</sub> : vitesse maximale (toutes les enzymes occupées) ; elle est <b>proportionnelle à la quantité d\'enzyme</b>.</li><li>K<sub>m</sub> : la concentration de substrat pour laquelle v = V<sub>max</sub>/2.</li><li>La courbe monte puis <b>sature</b> : doubler [S] ne double plus v.</li></ul><div class="tip"><b class="h">Exemple chiffré</b><br>V<sub>max</sub> = 80 µmol/min, K<sub>m</sub> = 5 mmol/L : [S] = 5 → v = 80 × 5 ÷ 10 = <b>40</b> ; [S] = 15 → 80 × 15 ÷ 20 = <b>60</b> ; [S] = 45 → 80 × 45 ÷ 50 = <b>72</b>. Avec le double d\'enzyme (V<sub>max</sub> = 160) : v(15) = <b>120</b>. Pour 90 % de V<sub>max</sub> : [S] = 9 K<sub>m</sub> = 45 mmol/L.</div></div>'+
 '<div class="tcard"><b class="h">Inhibition compétitive</b><p>Un inhibiteur compétitif ressemble au substrat et occupe le site actif. <b>V<sub>max</sub> est inchangé</b> (un grand excès de substrat le chasse) mais le K<sub>m</sub> apparent augmente : <code>K<sub>m</sub>′ = K<sub>m</sub> × (1 + [I] ÷ K<sub>i</sub>)</code>.</p><div class="tip"><b class="h">Exemple</b><br>K<sub>m</sub> = 10, [I] = 20, K<sub>i</sub> = 10 : K<sub>m</sub>′ = 10 × 3 = <b>30</b>. À [S] = 10, v/V<sub>max</sub> passe de 10 ÷ 20 = 0,50 à 10 ÷ 40 = 0,25.</div></div>'+
 '<div class="warn"><b class="h">Pièges</b><br>• Une enzyme n\'est pas consommée et ne « meurt » pas : elle est dénaturée (forme perdue) à haute température.<br>• Pour le lactose : 1 lactose + H<sub>2</sub>O → 1 glucose + 1 galactose, rapport 1 : 1 : 1 en moles (n = m ÷ M ; 12 g ÷ 342 g/mol = 0,0351 mol).</div>'
});
SFA.figs("c04",[
 /* 0 qu'est-ce qu'une enzyme */
 function(p){var r=Math.min(H*.16,W*.08),y=H*.5,xs=[W*.13,W*.42,W*.72];
  b4enz(xs[0],y,r);b4sub(xs[0]+r*1.8,y-r*.1,r*.8);TB('enzyme + substrat',xs[0]+r*.9,y+r*1.9,INK,13);
  ctx.fillStyle='rgba(55,138,221,.3)';ctx.beginPath();ctx.arc(xs[1],y,r*1.2,0,7);ctx.fill();b4enz(xs[1],y,r);b4sub(xs[1],y-r*.12,r*.95);TB('complexe',xs[1],y+r*1.9,INK,13);
  b4enz(xs[2],y,r,{});b4sub(xs[2]+r*1.5,y-r*.1,r*.9,'#fff3e0',-1);b4sub(xs[2]+r*2.2,y-r*.4,r*.9,'#fdece4',1);TB('enzyme + produits',xs[2]+r*.9,y+r*1.9,INK,13);
  A(W*.3,y,W*.08,0,GREY,'',2.5);A(W*.62,y,W*.08,0,GREY,'',2.5);
  if(p<=0)TB('protéine ?',xs[0],H*.14,BLUE_D,14);
  if(p>0){b4al(b4r(p,0,.5));ctx.strokeStyle=GREEN;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(xs[2],y,r*1.3,0,7);ctx.stroke();TB('intacte',xs[2],H*.18,DGREEN,15);TB('protéine · catalyseur',xs[0],H*.14,BLUE_D,15);b4al(1);}
  b4ans(p,'protéine · accélère · non consommée',GREEN,H-20);},
 /* 1 clé et serrure */
 function(p){var r=Math.min(H*.2,W*.1),ex=W*.38,ey=H*.58;b4enz(ex,ey,r);b4sub(ex,ey-r*.12-H*.2,r*.95);b4sub(W*.8,ey-r*.2,r*.8,'#fff3e0',-1);b4sub(W*.8+r*.75,ey-r*.2,r*.8,'#fdece4',1);
  var L=[['1',ex-r*.7,ey+r*.3,W*.1,H*.82],['2',ex+r*.3,ey-r*.12-H*.2-r*.3,W*.58,H*.12],['3',ex,ey-r*.45,W*.66,H*.4],['4',W*.84,ey-r*.55,W*.9,H*.3]];
  L.forEach(function(q,i){LN(q[1],q[2],q[3],q[4],GREY,1.3);ctx.fillStyle='#fff';DOT(q[3],q[4],14,'#fff');ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.arc(q[3],q[4],14,0,7);ctx.stroke();TB(q[0],q[3],q[4]+5,BLUE_D,15);});
  if(p>0){var nm=['enzyme','substrat','site actif','produit'];L.forEach(function(q,i){b4al(b4r(p,i*.15,i*.15+.3));TB(nm[i],q[3],q[4]+(i===0?32:i===3?32:-22),dk(i===0?BLUE:i===1?ORA2:i===2?GREEN:RED),14);b4al(1);});b4ans(p,'1-d · 2-a · 3-b · 4-c',GREEN,H-20);}},
 /* 2 courbe qui retombe */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.56,[0,70],[0,1.1],'température (°C)','activité');M.xl=W*.12;M.yb=H*.76;b4tick(M,[0,20,37,50,65],[],null,null);
  function f(T){return T<=37?Math.pow(T/37,2.2):Math.max(0,1-Math.pow((T-37)/28,1.5));}
  b4curve(M,f,0,70,BLUE,3.2,100);DOT(M.x(37),M.y(1),6,GREEN);DOT(M.x(65),M.y(f(65)),6,RED);
  if(p>0){b4al(b4r(p,0,.5));ctx.fillStyle='rgba(226,75,74,.1)';ctx.fillRect(M.x(50),M.y(1.1),M.x(70)-M.x(50),M.y(0)-M.y(1.1));b4enz(M.x(37)-30,M.y(1)-30,14);b4enz(M.x(65)-12,M.y(.5)-38,14,{bad:true,fill:'#fcebeb',col:RED});TB('dénaturée',M.x(60),M.y(.5)-10,DRED,14);b4al(1);b4ans(p,'structure 3D détruite · irréversible',GREEN,H-20);}},
 /* 3 Vmax Km */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.6,[0,50],[0,90],'[S] (mmol/L)','v (µmol/min)');M.xl=W*.12;M.yb=H*.76;b4tick(M,[5,15,45],[40,60,72,80]);
  LN(M.x(0),M.y(80),M.x(50),M.y(80),GREEN,1.8,[6,4]);TB('Vmax',M.x(49),M.y(80)-8,DGREEN,14,'right');b4curve(M,function(s){return b4mm(s,80,5);},0,50,BLUE,3.2,100);
  [[5,40],[15,60],[45,72]].forEach(function(q,i){var a=b4r(p,i*.2,i*.2+.3);LN(M.x(q[0]),M.y(0),M.x(q[0]),M.y(q[1]),GREY,1,[3,3]);if(p<=0){DOT(M.x(q[0]),M.y(0),4,GREY);return;}b4al(.2+.8*a);LN(M.x(0),M.y(q[1]),M.x(q[0]),M.y(q[1]),GREY,1,[3,3]);DOT(M.x(q[0]),M.y(q[1]),6.5,RED);b4al(1);});
  b4ans(p,'40 · 60 · 72 → plateau vers 80',GREEN,H-20);},
 /* 4 doubler l'enzyme */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.6,[0,50],[0,180],'[S] (mmol/L)','v (µmol/min)');M.xl=W*.12;M.yb=H*.76;b4tick(M,[15,45],[60,120,144]);
  b4curve(M,function(s){return b4mm(s,80,5);},0,50,BLUE,3,80);TB('80',M.x(50),M.y(78)+18,BLUE_D,13,'right');
  LN(M.x(0),M.y(80),M.x(50),M.y(80),BLUE,1.2,[5,4]);
  DOT(M.x(15),M.y(60),5.5,BLUE);if(p<=0){TB('? double d\'enzyme',M.x(25),M.y(165),GREY,16);}
  if(p>0){b4al(b4r(p,0,.5));b4curve(M,function(s){return b4mm(s,160,5);},0,50,ORANGE,3.2,80);LN(M.x(0),M.y(160),M.x(50),M.y(160),ORANGE,1.2,[5,4]);TB('Vmax = 160',M.x(49),M.y(160)-8,ORANGE,13,'right');
   LN(M.x(15),M.y(0),M.x(15),M.y(120),GREY,1,[3,3]);DOT(M.x(15),M.y(120),6.5,RED);TB('120',M.x(15)+10,M.y(120)-8,DRED,14,'left');
   LN(M.x(0),M.y(144),M.x(45),M.y(144),GREEN,1.5,[4,4]);DOT(M.x(45),M.y(144),6.5,GREEN);TB('90 % : 45 mmol/L',M.x(30),M.y(144)-8,DGREEN,13,'left');b4al(1);b4ans(p,'(a) 120 µmol/min · (b) 45 mmol/L',GREEN,H-20);}},
 /* 5 amylase estomac */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.56,[0,10],[0,1.1],'pH','activité');M.xl=W*.12;M.yb=H*.76;b4tick(M,[0,2,4,7,10],[]);
  function g(x,c,s){return Math.exp(-Math.pow((x-c)/s,2));}
  b4curve(M,function(x){return g(x,7,1.9);},0,10,BLUE,3.2,100);TB('amylase',M.x(8.5),M.y(.8)-6,BLUE_D,14);
  LN(M.x(2),M.y(0),M.x(2),M.y(1.1),RED,1.6,[4,4]);TB('estomac',M.x(2),M.y(1.1)-6,DRED,14);LN(M.x(7),M.y(0),M.x(7),M.y(1),GREEN,1.6,[4,4]);TB('bouche',M.x(7),M.y(1)-8,DGREEN,14);
  DOT(M.x(7),M.y(1),6,GREEN);
  if(p<=0)TB('?',M.x(2),M.y(.3),GREY,32);
  if(p>0){b4al(b4r(p,0,.5));DOT(M.x(2),M.y(g(2,7,1.9)),6.5,RED);b4curve(M,function(x){return g(x,2,1.5);},0,10,ORANGE,2.4,100);TB('pepsine',M.x(3.6),M.y(.75),ORANGE,14,'left');b4al(1);b4ans(p,'l\'amylase est inactive à pH 2',GREEN,H-20);}},
 /* 6 chasser l'inhibiteur */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.58,[0,100],[0,1.1],'[S] (mmol/L)','v / Vmax');M.xl=W*.12;M.yb=H*.76;b4tick(M,[10,30,50,100],[.25,.5,1]);
  function f(s,K){return s/(K+s);}b4curve(M,function(s){return f(s,10);},0,100,BLUE,3,100);TB('Km = 10',M.x(75),M.y(.89)+0,BLUE_D,14);DOT(M.x(10),M.y(.5),6,BLUE);LN(M.x(0),M.y(.5),M.x(30),M.y(.5),GREY,1.2,[4,4]);
  if(p>0){b4al(b4r(p,0,.5));b4curve(M,function(s){return f(s,30);},0,100,ORANGE,3.2,100);TB('Km′ = 30',M.x(75),M.y(.7)+22,ORANGE,14);DOT(M.x(10),M.y(.25),6.5,RED);DOT(M.x(30),M.y(.5),6.5,GREEN);LN(M.x(30),M.y(.5),M.x(30),M.y(0),GREEN,1.2,[3,3]);TB('0,25',M.x(10)+8,M.y(.25)+18,DRED,14,'left');b4al(1);b4ans(p,'30 · 0,50 → 0,25 · [S] = 30 mmol/L',GREEN,H-20);}
  else TB('+ inhibiteur compétitif : ?',M.x(60),M.y(.25),GREY,15);},
 /* 7 quel type d'inhibiteur */
 function(p){var M=b4ax(W*.12,H*.76,W*.78,H*.58,[0,100],[0,120],'[S]','v (µmol/min)');M.xl=W*.12;M.yb=H*.76;b4tick(M,[],[50,100]);
  b4curve(M,function(s){return 100*s/(8+s);},0,100,BLUE,3,100);b4curve(M,function(s){return 100*s/(32+s);},0,100,ORANGE,3,100);TB('sans M',M.x(40),M.y(100*40/48)-12,BLUE_D,14);TB('avec M',M.x(80),M.y(100*80/112)+22,ORANGE,14);
  LN(M.x(0),M.y(100),M.x(100),M.y(100),GREEN,1.4,[5,4]);TB('Vmax = 100 (inchangé)',M.x(100),M.y(100)-8,DGREEN,13,'right');
  if(p>0){b4al(b4r(p,0,.5));LN(M.x(0),M.y(50),M.x(32),M.y(50),GREY,1.2,[4,4]);DOT(M.x(8),M.y(50),6,BLUE);DOT(M.x(32),M.y(50),6,ORANGE);LN(M.x(8),M.y(50),M.x(8),M.y(0),BLUE,1.2,[3,3]);LN(M.x(32),M.y(50),M.x(32),M.y(0),ORANGE,1.2,[3,3]);TB('Km',M.x(8),M.y(0)+32,BLUE_D,14);TB('4 Km',M.x(32),M.y(0)+32,ORANGE,14);b4al(1);b4ans(p,'compétitif : Vmax inchangé, Km × 4',GREEN,H-20);}},
 /* 8 lactose */
 function(p){var gx=W*.13,gb=H*.8,gw=W*.2,gh=H*.55;b4glass(gx,gb,gw,gh,.8,'#fff4d6');TB('250 mL',gx,gb+22,INK,14);TB('4,8 g / 100 mL',gx,H*.1,GREY,13);
  function hexa(x,y,r,col){ctx.fillStyle=col;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();for(var i=0;i<6;i++){var a=i*1.0472+.5236;ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));}ctx.closePath();ctx.fill();ctx.stroke();}
  var mx=W*.5,my=H*.27,r=Math.min(H*.08,W*.045),e=b4r(p,.1,.6);
  hexa(mx-r*.95-e*r*.8,my,r,'#fdece4');hexa(mx+r*.95+e*r*.8,my,r,'#e6f1fb');if(e<.3)LN(mx-r*.1,my,mx+r*.1,my,INK,3);
  TB('lactose',mx,my-r*1.5,INK,14);TB('+ H₂O',W*.74,my+5,BLUE_D,15);A(W*.6,my,W*.06,0,GREY,'',2.5);TB('lactase',W*.66,my-r*1.4,VIOLET,13);
  hexa(W*.58,H*.55,r*.9,'#fdece4');TB('glucose',W*.58,H*.55+r*1.7,INK,13);hexa(W*.82,H*.55,r*.9,'#e6f1fb');TB('galactose',W*.82,H*.55+r*1.7,INK,13);
  if(p<=0){TB('12 g ? · n ? · 25 % digéré ?',W*.65,H*.88,GREY,15);}
  if(p>0){b4al(b4r(p,.3,.8));TB('12 g → 0,0351 mol de lactose',W*.65,H*.76,DGREEN,14);TB('→ 0,0351 mol (6,3 g) de chaque',W*.65,H*.84,DGREEN,14);TB('25 % digéré : 9 g au côlon',W*.65,H*.93,DRED,14);b4al(1);}},
 /* 9 lessive */
 function(p){var T=[5,40,90],xs=[.2,.5,.8],col=[BLUE,GREEN,RED];
  T.forEach(function(t,i){var x=W*xs[i],gb=H*.64,gh=H*.4;ctx.fillStyle='#fff';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(x-8,gb-gh,16,gh,8);ctx.stroke();DOT(x,gb+4,13,col[i]);ctx.fillStyle=col[i];ctx.fillRect(x-4,gb-gh*t/100,8,gh*t/100);TB(t+' °C',x,gb+34,dk(col[i]),16);
   if(p>0){b4al(b4r(p,i*.15,i*.15+.35));if(i===1){b4enz(x+34,H*.26,11,{});b4sub(x+34,H*.26-1,10);TB('✓',x,H*.14,DGREEN,26);}else if(i===0){b4enz(x+34,H*.26,11,{});TB('lent',x,H*.14,BLUE_D,16);}else{b4enz(x+34,H*.28,11,{bad:true,fill:'#fcebeb',col:RED});TB('dénaturée',x,H*.14,DRED,16);}b4al(1);}});
  if(p<=0)TB('quel programme ?',W*.5,H*.12,GREY,18);
  b4ans(p,'40 °C : proche de l\'optimum',GREEN,H-20);}
]);
