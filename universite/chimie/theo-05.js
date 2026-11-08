/* Chimie BA1 · c05 · théorie animée et devantures d'exercices — contenu SFA original. */
/* ---- aides locales (préfixe uh_) ---- */
function uh_e(p,a,b){return Math.max(0,Math.min(1,(p-a)/((b-a)||1)));}
function uh_al(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function uh_ttl(s){TB(s,W*.5,20,GREY,13);}
function uh_ax(x0,y0,w,h,xa,xb,ya,yb,xl,yl){LN(x0,y0,x0+w+8,y0,GREY,1.5);LN(x0,y0+4,x0,y0-h-8,GREY,1.5);
 if(xl)TB(xl,x0+w+8,y0+33,GREY,12,'right');if(yl)TB(yl,x0+6,y0-h-12,GREY,12,'left');
 return {X:function(x){return x0+(x-xa)/(xb-xa)*w;},Y:function(y){return y0-(y-ya)/(yb-ya)*h;}};}
function uh_fn(m,f,a,b,col,lw,upto,dash){var n=120,e=upto==null?b:a+(b-a)*upto;ctx.strokeStyle=col;ctx.lineWidth=lw||2.5;if(dash)ctx.setLineDash(dash);ctx.beginPath();
 for(var i=0;i<=n;i++){var x=a+(e-a)*i/n,y=f(x);i?ctx.lineTo(m.X(x),m.Y(y)):ctx.moveTo(m.X(x),m.Y(y));}ctx.stroke();ctx.setLineDash([]);}
function uh_rr(x,y,w,h,fill,stroke,lw,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r==null?8:r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function uh_atom(x,y,s,col,r){r=r||14;DOT(x,y,r,'#fff');ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(s,x,y+r*.36,col,Math.round(r*.95));}
function uh_bd(x1,y1,x2,y2,n,col,w){var dx=y2-y1,dy=x1-x2,l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;var o=(n-1)*2.6;
 for(var i=0;i<n;i++){var k=-o+i*5.2;LN(x1+dx*k,y1+dy*k,x2+dx*k,y2+dy*k,col||INK,w||2.2);}}
function uh_wave(x0,y0,len,amp,lam,ph,col,lw){ctx.strokeStyle=col;ctx.lineWidth=lw||2.4;ctx.beginPath();for(var i=0;i<=len;i+=2){var y=y0-amp*Math.sin(2*PI*i/lam-ph);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.stroke();}
function uh_wl(l){var r=0,g=0,b=0;if(l<380)return '#7F77DD';if(l<440){r=(440-l)/60;b=1;}else if(l<490){g=(l-440)/50;b=1;}else if(l<510){g=1;b=(510-l)/20;}else if(l<580){r=(l-510)/70;g=1;}else if(l<645){r=1;g=(645-l)/65;}else if(l<=750){r=1;}else return '#a32d2d';
 return 'rgb('+Math.round(r*220)+','+Math.round(g*190)+','+Math.round(b*220)+')';}
function uh_nuc(x,y,A,Z,s,col,sz){sz=sz||20;TB(String(A),x-sz*.55,y-sz*.25,col,sz*.55,'right');TB(String(Z),x-sz*.55,y+sz*.4,col,sz*.55,'right');TB(s,x-sz*.45,y+sz*.35,col,sz,'left');}
function uh_f(v,d){return Number(v).toFixed(d==null?2:d).replace('.',',').replace('-','−');}
function uh_tag(s,x,y,col,sz,a){if(a!=null)uh_al(a);tag(s,x,y,col,sz||13);ctx.globalAlpha=1;}
function c5_beaker(x,y,w,h,fill,col){ctx.fillStyle=fill;ctx.fillRect(x+2,y+h*.3,w-4,h*.7-2);ctx.strokeStyle=col||INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.stroke();}
function c5_th(x,y,h,frac,col){uh_rr(x-5,y,10,h,'#fff',INK,2,5);DOT(x,y+h+6,9,col);ctx.fillStyle=col;ctx.fillRect(x-2.5,y+h*(1-frac),5,h*frac);}
function c5_lv(x,y,w,col,lab,val,al){LN(x,y,x+w,y,col,3.4);TB(lab,x+w+8,y+5,dk(col),13,'left');}
SFA.theo("c05",{
 icon:function(){TB('ΔG = ΔH − TΔS',W*.5,H*.4,BLUE_D,32);TB('Hess · Born–Haber · ATP',W*.5,H*.58,ORANGE,18);LN(W*.2,H*.74,W*.45,H*.74,RED,4);LN(W*.55,H*.88,W*.8,H*.88,GREEN,4);A(W*.78,H*.76,0,H*.1,ORANGE,'',3);},
 anim:function(t){var Tm=100+1400*(.5-.5*Math.cos(t*.012)),dH=178.3,dS=.1605,gx=60,gw=W*.5,gy=H-50,gh=H-100;var m=uh_ax(gx,gy,gw,gh,0,1500,-100,300,'T (K)','kJ/mol');
  var Y0=m.Y(0);LN(gx,Y0,gx+gw,Y0,AX,1.4);uh_fn(m,function(x){return dH;},0,1500,ORANGE,2.6);uh_fn(m,function(x){return x*dS;},0,1500,BLUE,2.6);uh_fn(m,function(x){return dH-x*dS;},0,1500,RED,3.2);
  TB('ΔH',m.X(60),m.Y(dH)-8,ORANGE,14,'left');TB('TΔS',m.X(1400),m.Y(1400*dS)-8,BLUE_D,14,'right');TB('ΔG',m.X(1400),m.Y(dH-1400*dS)+18,DRED,14,'right');
  var G=dH-Tm*dS;LN(m.X(Tm),gy,m.X(Tm),m.Y(Math.max(dH,Tm*dS)),GREY,1.4,[4,4]);DOT(m.X(Tm),m.Y(G),7,G<0?GREEN:RED);LN(m.X(1111),gy,m.X(1111),gy+6,GREEN,2);TB('1 111 K',m.X(1111),gy+16,DGREEN,12);
  var bx=W*.66;TB('CaCO₃ → CaO + CO₂',bx+90,H*.1,BLUE_D,15);TB('T = '+Math.round(Tm)+' K',bx+90,H*.24,INK,18);
  var sc=.35,y0=H*.62;LN(bx,y0,bx+200,y0,GREY,1.5);[['ΔH',dH,ORANGE],['TΔS',Tm*dS,BLUE]].forEach(function(b,i){var h=b[1]*sc;uh_rr(bx+14+i*60,y0-h,44,h,b[2]+'44',b[2],2,3);TB(b[0],bx+36+i*60,y0+16,dk(b[2]),13);TB(Math.round(b[1]),bx+36+i*60,y0-h-6,dk(b[2]),13);});
  var gh2=Math.abs(G)*sc;uh_rr(bx+134,G>0?y0-gh2:y0,44,Math.max(gh2,2),(G<0?GREEN:RED)+'44',G<0?GREEN:RED,2,3);TB('ΔG',bx+156,y0+(G>0?16:gh2+16),G<0?DGREEN:DRED,13);TB(Math.round(G),bx+156,(G>0?y0-gh2:y0+gh2)+(G>0?-6:30),G<0?DGREEN:DRED,13);
  TB(G<0?'spontanée':'non spontanée',bx+100,H*.9,G<0?DGREEN:DRED,19);},
 th:'<div class="tcard"><b class="h">Enthalpie, loi de Hess, ΔfH°</b><p>À pression constante, la chaleur échangée vaut ΔH (ΔH &lt; 0 : exothermique). <b>H est une fonction d\'état</b> : ΔH ne dépend pas du chemin (<b>loi de Hess</b>) ; on peut additionner des réactions (et leurs ΔH) et changer le signe si on inverse.</p><p>Avec les enthalpies standard de formation (corps simples = 0) : <b>ΔH°<sub>r</sub> = Σ ν·ΔfH°(produits) − Σ ν·ΔfH°(réactifs)</b>. <b>Exemple</b> : 2 NO + O₂ → 2 NO₂ : 2 × 33,2 − 2 × 90,3 = <b>−114,2 kJ</b>. Hess : C + ½O₂ → CO = (−393,5) − (−283,0) = <b>−110,5 kJ</b>.</p></div>'+
 '<div class="tcard"><b class="h">Calorimétrie et énergies de liaison</b><p><b>q = m·c·ΔT</b> (c eau = 4,184 J/(g·K)). Chauffer 250 g d\'eau de 20 à 37 °C : 250 × 4,184 × 17 = 17,8 kJ. Si la solution se refroidit en dissolvant un sel, la dissolution est <b>endothermique</b> (ΔH &gt; 0) : elle n\'a lieu que parce que ΔS &gt; 0. NH₄NO₃ : 20 g = 0,250 mol × 25,7 kJ/mol = 6,42 kJ ; ΔT ≈ −12,8 K pour 120 g de solution.</p><p><b>ΔH ≈ Σ E(liaisons rompues) − Σ E(liaisons formées)</b>. Ex. C₂H₄ + HCl : (614 + 431) − (347 + 413 + 339) = −54 kJ ; la valeur par ΔfH° est −72 kJ : les énergies moyennes ne donnent que des ordres de grandeur.</p></div>'+
 '<div class="tcard"><b class="h">Cycle de Born–Haber</b><p>Il décompose la formation d\'un solide ionique : sublimation du métal, ionisations successives, atomisation du non-métal, affinité électronique, puis <b>énergie réticulaire U</b> (formation du cristal à partir des ions gazeux). <b>ΔfH° = ΔH<sub>sub</sub> + ΣI + ΔH<sub>atom</sub> + ΣAE − U</b>.</p><p><b>MgCl₂</b> : −641,3 = 147,7 + 737,7 + 1 450,7 + 2 × 121,3 + 2 × (−349,0) − U, donc <b>U = 2 522 kJ/mol</b> (beaucoup plus que NaCl, 787 : charges 2+ et 2−, ions plus petits). La forte I₂ est compensée par U : MgCl₂ stable, MgCl (ΔfH° ≈ −92) se dismute (≈ −457 kJ).</p></div>'+
 '<div class="tcard"><b class="h">Spontanéité : ΔG, K, Q</b><p><b>ΔG° = ΔH° − TΔS°</b> (T en K) ; la réaction est spontanée si ΔG &lt; 0. Température de bascule T = ΔH°/ΔS° : ΔH &lt; 0 et ΔS &lt; 0 → spontanée à basse T ; ΔH &gt; 0 et ΔS &gt; 0 → à haute T (CaCO₃ : 178,3/0,1605 = 1 111 K). <b>ΔG° = −RT ln K</b> ; <b>ΔG = ΔG° + RT ln Q</b> : le sens est donné par Q comparé à K, non par le signe de ΔG°.</p><p><b>Exemples</b> : ΔG° = −5,7 kJ/mol à 298 K → K = exp(5700/2 478) ≈ 10. Pour N₂ + 3 H₂ ⇌ 2 NH₃ (ΔG° = −33,0 ; Q = 10⁷) : ΔG = −33,0 + 2,479 × ln 10⁷ = +7 kJ/mol : la réaction inverse est spontanée.</p></div>'+
 '<div class="tcard"><b class="h">Couplage et ATP</b><p>Une réaction défavorable (ΔG &gt; 0) est rendue possible en la couplant à l\'hydrolyse de l\'ATP (ΔG°′ = −30,5 kJ/mol), dont ΔG dépend des concentrations : ΔG = ΔG°′ + RT ln([ADP][P<sub>i</sub>]/[ATP]). Cellule saine ([ATP] 3 mM, [ADP] 0,3 mM, [P<sub>i</sub>] 3 mM) : ΔG(ATP) = −51,4 kJ/mol ; phosphorylation du glucose (+13,8) couplée : <b>−37,6 kJ/mol</b>. Les ΔG s\'additionnent ; en ischémie ([ATP] baisse) le couplage reste possible mais moins favorable (−28,1).</p></div>'
});
SFA.figs("c05",[
 /* 0 ΔfH */
 function(p){var q=uh_e(p,0,.6),x0=70,w=130,k=(H-70)/220,y0=H-34;var Y=function(v){return y0-(v)*k*.9;};
  c5_lv(x0,Y(0),w,GREY,'N₂ + 2 O₂ (corps simples) 0');c5_lv(x0,Y(180.6),w,RED,'2 NO + O₂ : +180,6');c5_lv(x0,Y(66.4),w,BLUE,'2 NO₂ : +66,4');
  A(x0+30,Y(0)-4,0,-(Y(0)-Y(180.6))+10,GREY,'',2.2);A(x0+100,Y(0)-4,0,-(Y(0)-Y(66.4))+8,GREY,'',2.2);TB('H (kJ)',x0-6,16,GREY,12,'left');
  uh_al(q);A(x0+w-14,Y(180.6)+4,0,Y(66.4)-Y(180.6)-8,ORANGE,'',3.6);uh_tag('ΔH° = −114,2 kJ',W*.8,(Y(180.6)+Y(66.4))/2-4,DRED,16);ctx.globalAlpha=1;},
 /* 1 chauffer l'eau */
 function(p){var q=uh_e(p,0,.6);c5_beaker(W*.14,H*.28,W*.3,H*.5,'#d7e9f9',INK);TB('250 g d\'eau',W*.29,H*.56,BLUE_D,14);for(var i=0;i<4;i++){var fx=W*.18+i*W*.07;ctx.fillStyle=ORA2;ctx.beginPath();ctx.moveTo(fx,H*.9);ctx.quadraticCurveTo(fx+9,H*.82,fx+4,H*.78);ctx.quadraticCurveTo(fx-2,H*.84,fx,H*.9);ctx.fill();}
  c5_th(W*.6,H*.14,H*.5,.3+.4*q,RED);TB('20 °C',W*.74,H*.62,GREY,14,'left');uh_al(q);TB('37 °C',W*.74,H*.3,DRED,16,'left');ctx.globalAlpha=1;TB('q = m·c·ΔT',W*.5,H*.1,BLUE_D,16);uh_al(q);uh_rr(W*.14,H*.84,W*.72,28,'#fff7ea',ORANGE,2);TB('250 × 4,184 × 17 = 17,8 kJ',W*.5,H*.84+20,ORANGE,16);ctx.globalAlpha=1;},
 /* 2 dissolution qui refroidit */
 function(p){var q=uh_e(p,0,.6);c5_beaker(W*.12,H*.3,W*.32,H*.5,'#d7e9f9',BLUE_D);for(var i=0;i<6;i++){DOT(W*.17+i*W*.045,H*.7+(i%2)*10,4,'#fff');}TB('sel + eau',W*.28,H*.55,BLUE_D,14);c5_th(W*.62,H*.14,H*.5,.7-.45*q,BLUE);TB(q>.5?'T baisse':'T',W*.74,H*.5,BLUE_D,15,'left');
  A(W*.5,H*.9,-W*.12+0,0,0,'',1);uh_al(q);A(W*.05,H*.55,W*.05,0,ORANGE,'',3);TB('chaleur absorbée',W*.5,H*.14,ORANGE,15);TB('ΔH > 0  (endothermique)',W*.5,H*.86,DRED,16);TB('spontanée grâce à ΔS > 0',W*.5,H*.95,DGREEN,14);ctx.globalAlpha=1;},
 /* 3 calcaire */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H*.74,W-100,H*.56,0,1500,-60,200,'T (K)','ΔG° (kJ/mol)');var f=function(T){return 178.3-.1605*T;};uh_fn(m,f,0,1500,RED,3);LN(m.X(0),m.Y(0),m.X(1500),m.Y(0),GREY,1.4);
  [0,500,1000,1500].forEach(function(v){TB(v,m.X(v),H*.74+16,GREY,11);});uh_al(q);DOT(m.X(298),m.Y(f(298)),6,ORANGE);uh_tag('298 K : +130,5',m.X(298)+55,m.Y(f(298))-18,ORANGE,13);DOT(m.X(1111),m.Y(0),7,GREEN);uh_tag('T = 1 111 K',m.X(1111)-50,m.Y(0)-22,DGREEN,15);DOT(m.X(1200),m.Y(f(1200)),6,DGREEN);uh_tag('1 200 K : −14,3',m.X(1200)-10,m.Y(f(1200))+26,DGREEN,13);ctx.globalAlpha=1;TB('CaCO₃ → CaO + CO₂',W*.5,H*.1,GREY,13);},
 /* 4 Hess */
 function(p){var q=uh_e(p,0,.6),x0=80,w=130,Y=function(v){return 40-v*.52;};c5_lv(x0,Y(0),w,GREY,'C + O₂  0');c5_lv(x0,Y(-110.5),w,BLUE,'CO + ½ O₂');c5_lv(x0,Y(-393.5),w,GREEN,'CO₂ : −393,5');
  A(x0+110,Y(0)+4,0,Y(-393.5)-Y(0)-10,GREEN,'',3);TB('−393,5',x0+120,Y(-250),DGREEN,14,'left');A(x0+40,Y(-110.5)+4,0,Y(-393.5)-Y(-110.5)-10,BLUE,'',3);TB('−283,0',x0+48,Y(-300),BLUE_D,14,'left');uh_al(q);A(x0+40,Y(0)+4,0,Y(-110.5)-Y(0)-10,ORANGE,'',3.4);uh_tag('x = −110,5 kJ',x0+6,Y(-55)+0,DRED,16);ctx.globalAlpha=1;TB('C + ½ O₂ → CO ?',W*.74,H*.2,BLUE_D,16);},
 /* 5 ΔG -> K */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(70,H-48,W-110,H-90,-12,6,-2,3,'ΔG° (kJ/mol)','log K');uh_fn(m,function(x){return -x/5.708;},-12,6,BLUE,3);LN(m.X(-12),m.Y(0),m.X(6),m.Y(0),AX,1.2);LN(m.X(0),H-48,m.X(0),m.Y(3),AX,1.2);
  uh_al(q);LN(m.X(-5.7),H-48,m.X(-5.7),m.Y(1),ORANGE,1.6,[4,3]);LN(m.X(-12),m.Y(1),m.X(-5.7),m.Y(1),ORANGE,1.6,[4,3]);DOT(m.X(-5.7),m.Y(1),7,ORANGE);uh_tag('K ≈ 10',m.X(-5.7)+50,m.Y(1)-14,DRED,18);ctx.globalAlpha=1;TB('−5,7',m.X(-5.7),H-30,GREY,12);TB('K = e^(−ΔG°/RT)',W*.72,H*.14,GREY,14);},
 /* 6 Born–Haber */
 function(p){var q=uh_e(p,0,.6),x0=30,bw=44,gap=8,Y=function(v){return H-40-(v+700)*(H-80)/3300;};var st=[['sub',147.7,RED],['I₁',737.7,RED],['I₂',1450.7,RED],['2 at.',242.6,RED],['2 AE',-698,GREEN]],cum=0;
  var lab=['Mg(s)→Mg(g)','I₁','I₂','2 Cl','2 AE'];st.forEach(function(s,i){var a=cum,b=cum+s[1];cum=b;var x=x0+i*(bw+gap);uh_rr(x,Y(Math.max(a,b)),bw,Math.abs(Y(a)-Y(b)),s[2]+'44',s[2],2,3);TB(s[0],x+bw/2,H-22,INK,12);TB(uh_f(s[1],0),x+bw/2,Y(Math.max(a,b))-6,dk(s[2]),12);});
  var x=x0+5*(bw+gap);uh_al(q);uh_rr(x,Y(cum),bw,Y(-641.3)-Y(cum),'#e6f1fb',BLUE,2,3);TB('−U',x+bw/2,H-22,BLUE_D,12);TB('−2 522',x+bw/2,Y(cum)+16,BLUE_D,12);ctx.globalAlpha=1;
  LN(x0,Y(0),x0+7*(bw+gap),Y(0),GREY,1.2);LN(x0,Y(-641.3),x0+7*(bw+gap),Y(-641.3),GREEN,1.6,[5,4]);TB('ΔfH° = −641,3',W-12,Y(-641.3)-6,DGREEN,13,'right');uh_al(q);uh_tag('U = 2 522 kJ/mol',W*.78,H*.2,DRED,17);ctx.globalAlpha=1;TB('MgCl₂',W*.9,H*.52,BLUE_D,16);},
 /* 7 HCl + éthène */
 function(p){var q=uh_e(p,0,.6),bx=70,by=H-50,k=(H-100)/1100;TB('kJ/mol',bx-6,20,GREY,12,'left');LN(bx-8,by,W-40,by,GREY,1.5);
  uh_rr(bx,by-1045*k,120,1045*k,RED+'33',RED,2,4);TB('rompues',bx+60,by+18,INK,13);TB('C=C + H–Cl',bx+60,by-1045*k/2,DRED,13);TB('+1 045',bx+60,by-1045*k-6,DRED,15);
  uh_rr(bx+150,by-1099*k,120,1099*k,GREEN+'33',GREEN,2,4);TB('formées',bx+210,by+18,INK,13);TB('C–C + C–H + C–Cl',bx+210,by-1099*k/2,DGREEN,11);TB('1 099',bx+210,by-1099*k-6,DGREEN,15);
  uh_al(q);uh_tag('ΔH ≈ −54 kJ',W*.86,H*.3,DRED,17);TB('(ΔfH° : −72 kJ)',W*.86,H*.4,GREY,14);ctx.globalAlpha=1;},
 /* 8 ΔH<0 ΔS<0 */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H*.78,W-100,H*.6,0,1000,-80,80,'T (K)','ΔG°');var f=function(T){return -50+.1*T;};uh_fn(m,f,0,1000,RED,3);LN(m.X(0),m.Y(0),m.X(1000),m.Y(0),GREY,1.4);
  uh_al(q);ctx.fillStyle='rgba(29,158,117,.14)';ctx.fillRect(m.X(0),m.Y(80),m.X(500)-m.X(0),m.Y(-80)-m.Y(80));ctx.fillStyle='rgba(226,75,74,.10)';ctx.fillRect(m.X(500),m.Y(80),m.X(1000)-m.X(500),m.Y(-80)-m.Y(80));
  DOT(m.X(500),m.Y(0),7,ORANGE);TB('T = ΔH°/ΔS°',m.X(500),m.Y(0)-14,ORANGE,15);TB('spontanée',m.X(250),m.Y(60),DGREEN,18);TB('non spontanée',m.X(750),m.Y(60),DRED,16);ctx.globalAlpha=1;TB('ΔH° < 0 et ΔS° < 0',W*.5,H*.1,BLUE_D,16);},
 /* 9 ATP */
 function(p){var q=uh_e(p,0,.6),x0=60,by=H*.42,k=(H*.34)/55;LN(x0-10,by,W-20,by,GREY,1.4);
  var B=[['glucose + Pi',13.8,RED],['hydrolyse ATP',-51.4,BLUE],['couplée',-37.6,GREEN]];B.forEach(function(b,i){var x=x0+i*112,h=Math.abs(b[1])*k*(i===2?q:1);var y=b[1]>0?by-h:by;uh_rr(x,y,80,Math.max(h,1),b[2]+'44',b[2],2,3);TB(b[0],x+40,b[1]>0?by+18:by-8,INK,13);if(i<2||q>.3){TB((b[1]>0?'+':'−')+uh_f(Math.abs(b[1]),1),x+40,b[1]>0?y-8:y+h+18,dk(b[2]),16);}});
  TB('ΔG (kJ/mol)',x0-8,18,GREY,12,'left');uh_al(q);TB('ischémie : ΔG(ATP) = −41,9 · couplée −28,1',W*.5,H*.96,GREY,13);ctx.globalAlpha=1;},
 /* 10 sachet de froid */
 function(p){var q=uh_e(p,0,.6);uh_rr(W*.1,H*.34,W*.34,H*.4,'#e9f2fb',BLUE_D,3,14);TB('NH₄NO₃',W*.27,H*.52,BLUE_D,16);TB('20,0 g + 100 g eau',W*.27,H*.64,GREY,13);c5_th(W*.62,H*.14,H*.5,.7-.4*q,BLUE);
  uh_al(q);A(W*.78,H*.3,0,H*.28,BLUE,'',3.4);TB('ΔT ≈ −12,8 K',W*.8,H*.2,DRED,18);ctx.globalAlpha=1;TB('q = 0,250 mol × 25,7 = 6,42 kJ',W*.5,H*.9,ORANGE,14);},
 /* 11 ΔG ou ΔG° */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H*.78,W-100,H*.66,0,9,-40,20,'log Q','ΔG (kJ/mol)');var f=function(l){return -33+2.479*Math.log(10)*l;};uh_fn(m,f,0,9,RED,3);LN(m.X(0),m.Y(0),m.X(9),m.Y(0),GREY,1.4);[0,3,6,9].forEach(function(v){TB(v,m.X(v),H*.78+16,GREY,11);});
  DOT(m.X(0),m.Y(-33),6,BLUE);TB('ΔG° = −33,0',m.X(0)+8,m.Y(-33)-8,BLUE_D,13,'left');DOT(m.X(5.78),m.Y(0),6,GREEN);TB('Q = K',m.X(5.78),m.Y(0)-12,DGREEN,14);
  uh_al(q);DOT(m.X(7),m.Y(f(7)),8,ORANGE);uh_tag('Q = 10⁷ : ΔG ≈ +7 kJ/mol',m.X(7)-30,m.Y(f(7))-26,ORANGE,15);ctx.globalAlpha=1;},
 /* 12 de ΔG° à P */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H-50,W-100,H-100,300,420,-8,8,'T (K)','ΔG° (kJ/mol)');var f=function(T){return (40650-T*108.9)/1000;};uh_fn(m,f,300,420,RED,3);LN(m.X(300),m.Y(0),m.X(420),m.Y(0),GREY,1.4);[300,350,400].forEach(function(v){TB(v,m.X(v),H-32,GREY,11);});DOT(m.X(373.3),m.Y(0),7,GREEN);TB('373,3 K : ébullition',m.X(373.3)+10,m.Y(0)-14,DGREEN,14,'left');
  uh_al(q);DOT(m.X(363.15),m.Y(f(363.15)),7,ORANGE);uh_tag('90 °C : ΔG° = +1,1 kJ → P ≈ 69,4 kPa',m.X(363.15)-40,m.Y(f(363.15))-36,ORANGE,13);ctx.globalAlpha=1;TB('H₂O(l) ⇌ H₂O(g)  ·  K = P/P°',W*.62,H*.1,GREY,13);},
 /* 13 MgCl vs MgCl2 */
 function(p){var q=uh_e(p,0,.6),x0=80,by=H*.2,k=(H*.6)/700;LN(x0-10,by,W-30,by,GREY,1.4);TB('ΔfH° (kJ/mol)',x0-8,14,GREY,12,'left');
  [['MgCl',-92.3,ORANGE],['MgCl₂',-641.3,GREEN]].forEach(function(b,i){var x=x0+i*140,h=-b[1]*k*(i?q+.0:1);if(i===0)h=-b[1]*k;uh_rr(x,by,80,h,b[2]+'44',b[2],2,3);TB(b[0],x+40,by-8,INK,15);TB(uh_f(b[1],1),x+40,by+h+18,dk(b[2]),16);});
  uh_al(q);uh_tag('2 MgCl → MgCl₂ + Mg : ΔH ≈ −457 kJ',W*.5,H*.9,DRED,14);TB('Mg²⁺ : cœur de',W*.82,H*.45,DGREEN,13);TB('gaz noble',W*.82,H*.52,DGREEN,13);ctx.globalAlpha=1;}
]);
