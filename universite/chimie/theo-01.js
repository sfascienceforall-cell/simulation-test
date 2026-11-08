/* Chimie BA1 · c01 · théorie animée et devantures d'exercices — contenu SFA original. */
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
function c1_Y(n,y0,y1){return y0+(y1-y0)/n;}
function c1_lv(x0,x1,ns,y0,y1,labx){ns.forEach(function(n){var y=c1_Y(n,y0,y1);LN(x0,y,x1,y,INK,2);if(n<=4)TB('n = '+n,x0-6,y+4,GREY,12,'right');});}
function c1_pk(x0,x1,y,lam,amp,col,ph){ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.beginPath();for(var x=x0;x<=x1;x+=2){var yy=y-amp*Math.sin(2*PI*(x-ph)/lam);x===x0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
function c1_spec(x0,x1,y,h,lines,lab){for(var l=380;l<=750;l+=2){var x=x0+(l-380)/370*(x1-x0);ctx.globalAlpha=.28;LN(x,y,x,y+h,uh_wl(l),3);}ctx.globalAlpha=1;
 lines.forEach(function(L){var x=x0+(L[0]-380)/370*(x1-x0);uh_al(L[1]==null?1:L[1]);LN(x,y-3,x,y+h+3,L[2]||INK,3);if(L[3])TB(L[3],x,y-9,L[2]||INK,12);ctx.globalAlpha=1;});
 [400,500,600,700].forEach(function(l){var x=x0+(l-380)/370*(x1-x0);LN(x,y+h,x,y+h+4,GREY,1);TB(l,x,y+h+17,GREY,11);});TB('λ (nm)',x1,y+h+31,GREY,11,'right');}
SFA.theo("c01",{
 icon:function(){var cx=W*.27,cy=H*.5;[28,52,76].forEach(function(r){ctx.strokeStyle='#d5d9de';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();});
  DOT(cx,cy,8,RED);DOT(cx+52*Math.cos(-.7),cy+52*Math.sin(-.7),6,BLUE);DOT(cx-76*Math.cos(.5),cy-76*Math.sin(.5),6,BLUE);
  uh_wave(cx+84,cy+50,110,12,38,0,VIOLET,3);TB('E = hc/λ',W*.72,H*.3,BLUE_D,30);TB('N = N₀·2^(−t/T½)',W*.72,H*.58,ORANGE,19);TB('spectre · radioactivité',W*.62,H*.9,GREY,14);},
 anim:function(t){var x0=70,x1=240,top=26,bot=H-26,Ts=150,k=Math.floor(t/Ts)%4,ph=t%Ts,ni=[3,4,5,6][k],lam=[656.1,486.0,434.0,410.1][k],col=uh_wl(lam);
  LN(x0,top,x1,top,GREY,1.4,[4,4]);TB('E = 0 (échelle non respectée)',x1+6,top+4,GREY,11,'left');c1_lv(x0,x1,[1,2,3,4,5,6],top,bot);
  var ye;var yi=c1_Y(ni,top,bot),y2=c1_Y(2,top,bot);
  if(ph<30)ye=yi;else if(ph<70)ye=yi+(y2-yi)*uh_e(ph,30,70);else ye=y2;
  var xe=x0+(x1-x0)*.5+(ph<30?4*Math.sin(t*.4):0);
  A(xe-14,yi+0,0,0,col);DOT(xe,ye,7,BLUE);
  if(ph<30){TB('absorbé : e⁻ excité (n = '+ni+')',x1+12,yi+4-10,GREY,12,'left');}
  var head=175+(ph-50)*3.2,tail=Math.max(175,head-80);
  if(ph>50&&tail<W*.5-12){c1_pk(tail,Math.min(head,W*.5-12),y2,lam/486*30,11,col,t*1.8);}
  var sx0=W*.52,sx1=W-26,lines=[];[656.1,486.0,434.0,410.1].forEach(function(l,j){var on=Math.floor(t/Ts)>3||j<k||(j===k&&ph>110);if(on)lines.push([l,Math.min(1,(j===k&&Math.floor(t/Ts)<=3)?uh_e(ph,110,125):1),uh_wl(l),Math.round(l)]);});
  c1_spec(sx0,sx1,H*.52,34,lines);TB('Série de Balmer : n → 2',(sx0+sx1)/2,H*.3,BLUE_D,15);
  TB('ΔE = E(n) − E(2) = hc/λ',(sx0+sx1)/2,H*.88,INK,14);
  TB('E(n) = −13,6/n² eV',x0,H-6,GREY,12,'left');},
 th:'<div class="tcard"><b class="h">Le noyau et les isotopes</b><p>Un nucléide s\'écrit <sup>A</sup><sub>Z</sub>X : <b>Z</b> = nombre de protons (numéro atomique, identifie l\'élément), <b>A</b> = nombre de nucléons = Z + N, avec N le nombre de neutrons. Des <b>isotopes</b> ont le même Z mais des N différents (¹²C, ¹³C, ¹⁴C).</p><p>Pour un ion, le nombre d\'électrons vaut Z − charge : l\'ion chlorure <sup>35</sup><sub>17</sub>Cl⁻ a 17 protons, 18 neutrons et <b>18</b> électrons. La masse molaire d\'un élément est la moyenne pondérée de ses isotopes naturels.</p></div>'+
 '<div class="tcard"><b class="h">Photon, niveaux d\'énergie et modèle de Bohr</b><p>La lumière est faite de photons d\'énergie <b>E = hν = hc/λ</b> (h = 6,626·10⁻³⁴ J·s ; c = 2,998·10⁸ m/s ; 1 eV = 1,602·10⁻¹⁹ J, d\'où <b>hc ≈ 1 239,84 eV·nm</b>). Dans l\'atome d\'hydrogène (ou un ion à un électron, charge Z), l\'énergie est quantifiée : <b>E<sub>n</sub> = −13,606·Z²/n² eV</b>.</p><p>Une transition n<sub>i</sub> → n<sub>f</sub> émet (n<sub>i</sub> &gt; n<sub>f</sub>) ou absorbe (n<sub>i</sub> &lt; n<sub>f</sub>) un photon avec <b>1/λ = R<sub>H</sub>·Z²·(1/n<sub>f</sub>² − 1/n<sub>i</sub>²)</b>, R<sub>H</sub> = 1,0974·10⁷ m⁻¹.</p><ul><li><b>Lyman</b> : n<sub>f</sub> = 1, ultraviolet (121,5 nm pour 2 → 1) ;</li><li><b>Balmer</b> : n<sub>f</sub> = 2, visible (656 ; 486 ; 434 ; 410 nm) ;</li><li><b>Paschen</b> : n<sub>f</sub> = 3, infrarouge.</li></ul><p><b>Exemple</b> : 4 → 2 : 1/λ = 1,0974·10⁷ × (1/4 − 1/16) = 2,058·10⁶ m⁻¹, soit λ = 486 nm, E = 1 239,84/486 = 2,55 eV. <b>Piège</b> : l\'absorption 1 → 3 donne 102,5 nm, pas 656 nm (qui est l\'émission 3 → 2).</p></div>'+
 '<div class="tcard"><b class="h">Les désintégrations et leurs équations</b><p>Dans une équation nucléaire, <b>A et Z se conservent</b> des deux côtés.</p><ul><li><b>α</b> (noyau d\'hélium ⁴₂He) : A − 4, Z − 2. Ex. ²²⁶₈₈Ra → ²²²₈₆Rn + ⁴₂He.</li><li><b>β⁻</b> (un neutron devient proton) : A inchangé, Z + 1, émission de e⁻ et d\'un antineutrino.</li><li><b>β⁺</b> (un proton devient neutron) : A inchangé, Z − 1, émission d\'un positon e⁺ et d\'un neutrino. Ex. ¹⁸₉F → ¹⁸₈O + e⁺ + ν.</li><li><b>Capture électronique</b> : Z − 1, A inchangé. <b>γ</b> : désexcitation, rien ne change.</li></ul><p>Pour une chaîne (¹²³⁸U → ²⁰⁶Pb) : le nombre de α vaut ΔA/4 = 32/4 = 8 ; ces 8 α font baisser Z de 16 au lieu des 10 observés, donc 6 β⁻.</p></div>'+
 '<div class="tcard"><b class="h">Décroissance radioactive, datation, demi-vie effective</b><p>Chaque noyau a la même probabilité de se désintégrer par unité de temps : <b>N = N₀·e<sup>−λt</sup> = N₀·2<sup>−t/T½</sup></b>, avec <b>λ = ln 2 / T½</b>. L\'activité (en Bq = désintégrations par seconde) vaut <b>A = λN</b> et suit la même loi. Après 3 demi-vies, il reste ½³ = 12,5 %.</p><p><b>Datation au ¹⁴C</b> (T½ = 5 730 ans) : t = T½·ln(A₀/A)/ln 2. Ex. A/A₀ = 4,2/15,3 : t = 5 730 × ln 3,643 / 0,693 ≈ 10 700 ans (hypothèse : le taux de ¹⁴C atmosphérique était constant).</p><p>Un radiotraceur disparaît aussi par élimination biologique : <b>1/T<sub>eff</sub> = 1/T<sub>p</sub> + 1/T<sub>b</sub></b>. T<sub>eff</sub> est toujours plus courte que chacune (6 h et 3 h donnent 2 h, pas 4,5 h). Pour ¹³¹I : 1/T<sub>eff</sub> = 1/8,02 + 1/80, T<sub>eff</sub> ≈ 7,3 jours.</p></div>'+
 '<div class="tcard"><b class="h">Défaut de masse et énergie de liaison</b><p>Un noyau pèse moins que ses nucléons séparés : <b>Δm = Z·m<sub>p</sub> + N·m<sub>n</sub> − m<sub>noyau</sub></b> (m<sub>p</sub> = 1,00728 u ; m<sub>n</sub> = 1,00866 u). Cette masse « manquante » correspond à l\'énergie de liaison <b>E = Δm·c²</b>, avec 1 u ≙ 931,5 MeV.</p><p><b>Exemple ⁴He</b> (m = 4,00151 u) : Δm = 2 × 1,00728 + 2 × 1,00866 − 4,00151 = 0,03037 u, soit 28,3 MeV, donc <b>7,07 MeV par nucléon</b>. L\'énergie par nucléon est maximale vers le fer-56 (≈ 8,8 MeV) : fusionner les noyaux légers ou fissionner les très lourds libère de l\'énergie. Une réaction nucléaire libère des millions de fois plus d\'énergie par kg qu\'une réaction chimique.</p></div>'
});
SFA.figs("c01",[
 /* 0 énergie d'un photon */
 function(p){uh_ttl('Raie émise par une lampe à vapeur');var col=uh_wl(486),a=36,lam=96,y=H*.42;uh_wave(24,y,W-48,a,lam,0,col,3.4);
  LN(24+lam*.25,y-a-14,24+lam*1.25,y-a-14,INK,1.6);LN(24+lam*.25,y-a-20,24+lam*.25,y-a-8,INK,1.6);LN(24+lam*1.25,y-a-20,24+lam*1.25,y-a-8,INK,1.6);
  TB('λ = 486 nm',24+lam*.75,y-a-26,DGREEN,15);TB('E = hc/λ',W*.5,H*.76,BLUE_D,24);
  var a2=uh_e(p,0,.5);if(a2>0){uh_al(a2);uh_rr(W*.12,H*.82,W*.76,36,'#fff7ea',ORANGE,2);TB('4,09·10⁻¹⁹ J  =  2,55 eV',W*.5,H*.82+24,ORANGE,18);ctx.globalAlpha=1;}},
 /* 1 symbole nucléaire Cl- */
 function(p){var cx=W*.3,cy=H*.52,i;for(i=0;i<35;i++){var r=3.9*Math.sqrt(i+.5),an=i*2.39996;DOT(cx+r*Math.cos(an),cy+r*Math.sin(an),3.8,i<17?RED:BLUE);}
  [[52,2],[78,8],[104,8]].forEach(function(s){ctx.strokeStyle='#e1e4e8';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,s[0],0,7);ctx.stroke();for(var k=0;k<s[1];k++){var a=k/s[1]*2*PI+s[0];DOT(cx+s[0]*Math.cos(a),cy+s[0]*Math.sin(a),4.4,ORANGE);}});
  uh_nuc(W*.78,H*.34,35,17,'Cl⁻',BLUE_D,46);
  var a=uh_e(p,0,.6);uh_al(a);TB('17 protons',W*.6,H*.56,RED,15,'left');TB('18 neutrons',W*.6,H*.68,BLUE,15,'left');TB('18 électrons',W*.6,H*.8,ORANGE,15,'left');ctx.globalAlpha=1;},
 /* 2 demi-vies successives */
 function(p){var m=uh_ax(60,H-48,W-100,H-100,0,3.4,0,105,'t (en T½)','N / N₀ (%)');var f=function(x){return 100*Math.pow(.5,x);};uh_fn(m,f,0,3.4,BLUE,2.8);
  for(var k=0;k<=3;k++){var show=k<3||p>0;var ac=k<3?1:uh_e(p,0,.5);if(!show)continue;uh_al(ac);LN(m.X(k),m.Y(0),m.X(k),m.Y(f(k)),GREY,1.2,[4,4]);LN(m.X(0),m.Y(f(k)),m.X(k),m.Y(f(k)),GREY,1.2,[4,4]);DOT(m.X(k),m.Y(f(k)),k===3?7:5,k===3?ORANGE:BLUE);
   TB(k,m.X(k),H-31,GREY,12);TB(uh_f(f(k),k===3?1:0)+' %',m.X(k)+8,m.Y(f(k))-10,k===3?ORANGE:BLUE_D,k===3?16:13,'left');ctx.globalAlpha=1;}},
 /* 3 raie de Balmer */
 function(p){var x0=70,x1=220,top=24,bot=H-26;c1_lv(x0,x1,[1,2,3,4,5],top,bot);LN(x0,top,x1,top,GREY,1.2,[4,4]);var xa=150,y4=c1_Y(4,top,bot),y2=c1_Y(2,top,bot);A(xa,y4,0,y2-y4-6,RED,'',3);DOT(xa,y4,6,BLUE);TB('4 → 2',xa+10,(y4+y2)/2,RED,15,'left');
  var col=uh_wl(486);uh_wave(xa+16,y2,0,0,1,0,col);c1_pk(xa+30,W-24,y2-4,34,13,col,0);
  var a=uh_e(p,0,.5);uh_al(a);TB('λ = 486,0 nm',W*.72,H*.58,DGREEN,18);TB('visible (Balmer)',W*.72,H*.7,INK,15);TB('E = 2,55 eV',W*.72,H*.83,ORANGE,17);ctx.globalAlpha=1;
  if(a===0){TB('λ = ?',W*.72,H*.58,GREY,18);}},
 /* 4 équations nucléaires */
 function(p){var ro=[[226,88,'Ra',222,86,'Rn',4,2,'He'],[131,53,'I',131,54,'Xe',0,-1,'e⁻'],[18,9,'F',18,8,'O',0,1,'e⁺']];
  ro.forEach(function(r,i){var y=H*.25+i*H*.27;uh_nuc(W*.12,y,r[0],r[1],r[2],BLUE_D,28);TB('→',W*.3,y+8,GREY,24);
   var a=uh_e(p,i*.2,i*.2+.4);if(a<1){uh_al(1-a);TB('?',W*.42,y+8,GREY,28);ctx.globalAlpha=1;}uh_al(a);uh_nuc(W*.46,y,r[3],r[4],r[5],GREEN,28);ctx.globalAlpha=1;
   TB('+',W*.66,y+8,GREY,22);uh_nuc(W*.8,y,r[6],r[7],r[8],ORANGE,26);});
  TB('α',W*.93,H*.25+8,ORANGE,15);TB('β⁻',W*.93,H*.52+8,ORANGE,15);TB('β⁺',W*.93,H*.79+8,ORANGE,15);},
 /* 5 absorption 1 -> 3 */
 function(p){var x0=70,x1=220,top=24,bot=H-26;c1_lv(x0,x1,[1,2,3,4,5],top,bot);LN(x0,top,x1,top,GREY,1.2,[4,4]);var xa=130,y1=c1_Y(1,top,bot),y3=c1_Y(3,top,bot);
  c1_pk(xa+40,W-28,y1-4,28,12,VIOLET,0);A(W-30,y1-4,-3,0,VIOLET,'',1);A(xa,y1,0,y3-y1+6,RED,'',3);DOT(xa,y1,6,BLUE);TB('1 → 3',xa+12,(y1+y3)/2+30,RED,15,'left');TB('photon absorbé',W*.7,y1-24,INK,14);
  var a=uh_e(p,0,.5);uh_al(a);TB('λ = 102,5 nm',W*.7,H*.34,VIOLET,19);TB('ultraviolet (Lyman)',W*.7,H*.46,INK,14);ctx.globalAlpha=1;if(!a)TB('λ = ?',W*.7,H*.34,GREY,19);},
 /* 6 âge du bois */
 function(p){var T=5730,tt=T*Math.log(15.3/4.2)/Math.log(2),m=uh_ax(60,H-48,W-100,H-100,0,16000,0,17,'t (ans)','A (dés./min/g)');var f=function(x){return 15.3*Math.pow(.5,x/T);};uh_fn(m,f,0,16000,BLUE,2.8);
  [0,5000,10000,15000].forEach(function(v){LN(m.X(v),H-48,m.X(v),H-44,GREY,1);TB(v/1000+' k',m.X(v),H-30,GREY,11);});
  LN(m.X(0),m.Y(4.2),m.X(16000),m.Y(4.2),RED,1.6,[5,4]);TB('4,2',m.X(0)-6,m.Y(4.2)+5,RED,13,'right');TB('15,3',m.X(0)-6,m.Y(15.3)+5,BLUE_D,13,'right');
  var a=uh_e(p,0,.6);if(a>0){var x=m.X(tt*a);LN(x,m.Y(4.2),x,H-48,ORANGE,2,[4,3]);DOT(m.X(tt),m.Y(4.2),6,ORANGE);uh_al(a);uh_tag('t ≈ 10 700 ans',m.X(tt),m.Y(4.2)-26,ORANGE,15);ctx.globalAlpha=1;}},
 /* 7 He+ */
 function(p){var x0=70,x1=230,top=26,bot=H-26;[1,2,3,4].forEach(function(n){var y=c1_Y(n,top,bot);LN(x0,y,x1,y,INK,2);TB('n = '+n,x0-6,y+4,GREY,12,'right');TB(uh_f(-54.42/(n*n),1)+' eV',x1+6,y+4,BLUE_D,12,'left');});
  LN(x0,top,x1,top,GREY,1.2,[4,4]);TB('0 (ionisé)',x1+6,top+4,GREY,12,'left');TB('He⁺',W*.8,H*.18,VIOLET,22);
  var xa=150;A(xa,c1_Y(1,top,bot),0,-(bot-top)+6,RED,'',3.4);var a=uh_e(p,0,.5);uh_al(a);TB('E = 54,4 eV',W*.78,H*.44,ORANGE,18);TB('= 5,25·10³ kJ/mol',W*.78,H*.56,ORANGE,15);TB('λ max = 22,8 nm (UV)',W*.78,H*.7,DGREEN,15);ctx.globalAlpha=1;},
 /* 8 chaîne U -> Pb */
 function(p){var m=uh_ax(54,H-44,W-84,H-84,204,240,80,94,'A','Z');for(var A_=206;A_<=238;A_+=8)TB(A_,m.X(A_),H-27,GREY,11);[82,86,90].forEach(function(z){TB(z,40,m.Y(z)+4,GREY,11,'right');});
  var P=[[238,92],[234,90],[234,91],[234,92],[230,90],[226,88],[222,86],[218,84],[214,82],[214,83],[214,84],[210,82],[210,83],[210,84],[206,82]],n=(P.length-1)*uh_e(p,0,.9);
  for(var i=0;i<P.length-1;i++){var f=Math.max(0,Math.min(1,n-i));var a=P[i],b=P[i+1],al=b[0]!==a[0];if(f<=0&&p>0)continue;var tx=a[0]+(b[0]-a[0])*(p>0?f:1),ty=a[1]+(b[1]-a[1])*(p>0?f:1);
   LN(m.X(a[0]),m.Y(a[1]),m.X(tx),m.Y(ty),al?ORANGE:BLUE,3);DOT(m.X(a[0]),m.Y(a[1]),3.5,al?ORANGE:BLUE);}
  DOT(m.X(238),m.Y(92),6,DRED);TB('²³⁸U',m.X(238)+8,m.Y(92)-8,DRED,14,'left');DOT(m.X(206),m.Y(82),6,DGREEN);TB('²⁰⁶Pb',m.X(206)+10,m.Y(82)+4,DGREEN,14,'left');
  if(p>.85){uh_al(uh_e(p,.85,1));TB('8 α',W*.3,H*.22,ORANGE,22);TB('6 β⁻',W*.46,H*.22,BLUE,22);ctx.globalAlpha=1;}},
 /* 9 iode 131 */
 function(p){var Tp=8.02,Te=1/(1/8.02+1/80),m=uh_ax(54,H-46,W-90,H-96,0,40,0,105,'t (jours)','A (MBq)');
  uh_fn(m,function(x){return 100*Math.pow(.5,x/Tp);},0,40,GREY,2,null,[6,4]);uh_fn(m,function(x){return 100*Math.pow(.5,x/Te);},0,40,BLUE,3);
  [0,10,20,30,40].forEach(function(v){TB(v,m.X(v),H-29,GREY,11);});TB('physique seule',m.X(18),m.Y(100*Math.pow(.5,18/Tp))-10,GREY,12,'left');TB('effective',m.X(8),m.Y(100*Math.pow(.5,8/Te))+22,BLUE_D,13,'left');
  var a=uh_e(p,0,.6);if(a>0){uh_al(a);var v=100*Math.pow(.5,30/Te);LN(m.X(30),H-46,m.X(30),m.Y(v),ORANGE,1.8,[4,3]);DOT(m.X(30),m.Y(v),6,ORANGE);uh_tag('T eff = '+uh_f(Te,1)+' j',W*.62,H*.22,BLUE_D,15);uh_tag(uh_f(v,1)+' MBq à 30 j',m.X(30)-20,m.Y(v)-24,ORANGE,15);ctx.globalAlpha=1;}},
 /* 10 FDG */
 function(p){var T=109.8,m=uh_ax(54,H-46,W-90,H-96,0,300,0,2.2,'heure','A (GBq)');uh_fn(m,function(x){return 2*Math.pow(.5,x/T);},0,300,BLUE,3);
  [[0,'8 h'],[120,'10 h'],[240,'12 h']].forEach(function(v){LN(m.X(v[0]),H-46,m.X(v[0]),H-42,GREY,1);TB(v[1],m.X(v[0]),H-29,GREY,12);});
  LN(m.X(0),m.Y(.37),m.X(300),m.Y(.37),RED,1.6,[5,4]);TB('370 MBq',m.X(300),m.Y(.37)-8,RED,13,'right');
  var tc=T*Math.log(2/.37)/Math.log(2),a=uh_e(p,0,.6);if(a>0){uh_al(a);LN(m.X(tc),m.Y(.37),m.X(tc),H-46,ORANGE,2,[4,3]);DOT(m.X(tc),m.Y(.37),6,ORANGE);uh_tag('≈ 12 h 27',m.X(tc)-8,m.Y(.37)-30,ORANGE,15);
   var v=2*Math.pow(.5,150/T);DOT(m.X(150),m.Y(v),5,DGREEN);uh_tag('0,78 GBq à 10 h 30',m.X(150)+60,m.Y(v)-20,DGREEN,13);ctx.globalAlpha=1;}
  TB('¹⁸F-FDG (T½ = 109,8 min)',W*.5,22,GREY,13);},
 /* 11 T effective */
 function(p){var rows=[['T physique',6,BLUE],['T biologique',3,ORANGE],['T effective',2,GREEN]],x0=120,k=(W-x0-60)/6.5;
  rows.forEach(function(r,i){var y=H*.22+i*H*.2,len=r[1]*k*(i===2?uh_e(p,0,.6):1);TB(r[0],x0-8,y+27,INK,14,'right');uh_rr(x0,y+8,len,26,r[2]+'33',r[2],2,5);if(i<2||p>.3)TB(r[1]+' h',x0+len+8,y+28,dk(r[2]),15,'left');});
  TB('1/T eff = 1/T p + 1/T b',W*.5,H-18,BLUE_D,19);},
 /* 12 chimique vs nucléaire */
 function(p){var m=uh_ax(40,H-50,W-70,H-110,6,15,0,1,'','');var X=function(l){return 40+(l-6)/9*(W-70);};
  for(var e=7;e<=15;e+=2){LN(X(e),H-50,X(e),H-45,GREY,1);TB('10'+({7:'⁷',9:'⁹',11:'¹¹',13:'¹³',15:'¹⁵'})[e],X(e),H-30,GREY,12);}TB('énergie libérée (J/kg)',W-30,H-12,GREY,12,'right');
  var rows=[['combustion du CH₄',7.7,ORANGE,'5,0·10⁷'],['fusion D–T',14.53,VIOLET,'3,4·10¹⁴']];
  rows.forEach(function(r,i){var y=H*.2+i*H*.3,l=r[1];if(i===1)l=6+(r[1]-6)*uh_e(p,0,.7);uh_rr(X(6),y,X(l)-X(6),34,r[2]+'33',r[2],2,5);TB(r[0],X(6)+8,y-8,dk(r[2]),14,'left');if(i===0||p>.6)TB(r[3]+' J/kg',Math.min(X(l)+8,W-120),y+23,dk(r[2]),15,'left');});
  if(p>.75){uh_al(uh_e(p,.75,1));uh_tag('rapport ≈ 7·10⁶',W*.5,H*.74,DRED,19);ctx.globalAlpha=1;}},
 /* 13 raie 434 nm */
 function(p){var col=uh_wl(434);c1_spec(40,W-40,H*.14,26,[[434,1,col,'434 nm']]);
  function pan(x0,Z,ni,nf,nm,cc){var top=H*.5,bot=H-20,ns=ni>5?[1,2,3,4,10]:[1,2,3,5];
   var Y=function(n){return top+(bot-top)/n;};ns.forEach(function(n){var y=Y(n);LN(x0,y,x0+140,y,n===ni||n===nf?INK:'#cfd3d8',n===ni||n===nf?2.2:1.2);});
   TB(nm,x0+70,top-10,cc,17);A(x0+90,Y(nf),0,0,cc);A(x0+70,Y(ni),0,Y(nf)-Y(ni)-6,cc,'',3);TB(ni+' → '+nf,x0+84,(Y(ni)+Y(nf))/2+14,cc,14,'left');}
  pan(40,1,5,2,'H : 5 → 2',BLUE_D);pan(W-190,2,10,4,'He⁺ : 10 → 4',VIOLET);
  var a=uh_e(p,0,.5);if(a>0){uh_al(a);TB('433,9 nm',W*.5-5,H*.7,DGREEN,17);TB('les deux !',W*.5-5,H*.82,DRED,16);ctx.globalAlpha=1;}}
]);
