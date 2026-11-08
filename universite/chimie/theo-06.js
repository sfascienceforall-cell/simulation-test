/* Chimie BA1 · c06 · théorie animée et devantures d'exercices — contenu SFA original. */
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
function c6_pw(e){var s={'-12':'⁻¹²','-10':'⁻¹⁰','-8':'⁻⁸','-9':'⁻⁹','-7':'⁻⁷','-5':'⁻⁵','-6':'⁻⁶','-4':'⁻⁴','-3':'⁻³','-2':'⁻²','-1':'⁻¹','-11':'⁻¹¹','-13':'⁻¹³','-14':'⁻¹⁴','-15':'⁻¹⁵','-16':'⁻¹⁶','-17':'⁻¹⁷','0':'⁰'};return '10'+(s[String(e)]||String(e));}
function c6_lx(x0,y0,w,a,b,xl){LN(x0,y0,x0+w+8,y0,GREY,1.5);var X=function(e){return x0+(e-a)/(b-a)*w;};for(var e=Math.ceil(a);e<=b;e+=2){LN(X(e),y0,X(e),y0+5,GREY,1);TB(c6_pw(e),X(e),y0+19,GREY,11);}if(xl)TB(xl,x0+w+8,y0+36,GREY,12,'right');return X;}
function c6_beaker(x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x+2,y+h*.25,w-4,h*.75-2);ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.stroke();}
function c6_pts(x,y,w,h,n,col,seed,r){for(var i=0;i<n;i++){var a=((i*7919+seed*131)%1000)/1000,b=((i*104729+seed*17)%1000)/1000;DOT(x+6+a*(w-12),y+6+b*(h-12),r||3.6,col);}}
SFA.theo("c06",{
 icon:function(){c6_beaker(W*.08,H*.3,W*.24,H*.5,'#e6f1fb');c6_beaker(W*.36,H*.3,W*.24,H*.5,'#e6f1fb');uh_rr(W*.4,H*.72,W*.16,H*.07,'#f0f0f0',GREY,1.5,3);TB('Q  vs  Ks',W*.8,H*.4,BLUE_D,26);TB('K = [P]/[R]',W*.8,H*.6,ORANGE,18);TB('ICE · précipitation',W*.8,H*.8,GREY,14);},
 anim:function(t){var Tc=520,k=Math.floor(t/Tc)%2,ph=t%Tc,K=4,xe=K/(1+K),x0=k?.96:.04,xB=xe+(x0-xe)*Math.exp(-ph/90),N=60;
  var bx=22,by=40,bw=W*.36,bh=H-80;uh_rr(bx,by,bw,bh,'#fff',GREY,2,8);var nb=Math.round(xB*N);
  for(var i=0;i<N;i++){var a=((i*7919)%1000)/1000,b=((i*104729)%1000)/1000,x=bx+14+a*(bw-28)+7*Math.sin(t*.05+i),y=by+14+b*(bh-28)+7*Math.cos(t*.06+i*1.7);var isB=i<nb;DOT(x,y,6,isB?ORANGE:BLUE);}
  TB('A ⇌ B   K = [B]/[A] = 4',bx+bw/2,by-12,BLUE_D,15);TB('● A',bx+20,by+bh+22,BLUE,14,'left');TB('● B',bx+80,by+bh+22,ORANGE,14,'left');
  var Q=xB/(1-xB),gx=W*.5,gw=W*.46,gy=H-56,gh=H-110;var m=uh_ax(gx,gy,gw,gh,0,Tc,-1.5,1.8,'temps','log Q');uh_fn(m,function(tt){var xx=xe+(x0-xe)*Math.exp(-tt/90);return Math.log10(xx/(1-xx));},0,Tc,BLUE,2.4,ph/Tc);
  LN(m.X(0),m.Y(Math.log10(K)),m.X(Tc),m.Y(Math.log10(K)),RED,1.8,[6,4]);TB('log K',m.X(Tc),m.Y(Math.log10(K))-6,DRED,13,'right');DOT(m.X(ph),m.Y(Math.log10(Q)),6,ORANGE);
  var verdict=Math.abs(Math.log10(Q/K))<.04?'Q = K : équilibre':(Q<K?'Q < K : sens direct →':'Q > K : sens inverse ←');TB('Q = '+uh_f(Q,2),gx+gw*.5,H*.12,INK,17);TB(verdict,gx+gw*.5,H*.2,Q<K?DGREEN:DRED,16);},
 th:'<div class="tcard"><b class="h">Constante d\'équilibre</b><p>Pour a A + b B ⇌ c C + d D : <b>K<sub>c</sub> = [C]<sup>c</sup>[D]<sup>d</sup>/([A]<sup>a</sup>[B]<sup>b</sup>)</b> à l\'équilibre (concentrations en mol/L ; solides et solvant absents). Avec les pressions : K<sub>p</sub>. <b>K<sub>p</sub> = K<sub>c</sub>·(RT)<sup>Δn</sup></b> avec Δn = Σ moles gazeuses (produits) − Σ (réactifs), R = 0,0821 L·atm/(mol·K) si P en atm.</p><p><b>Exemple</b> : 2 SO₂ + O₂ ⇌ 2 SO₃, K<sub>c</sub> = 280 à 1 000 K : Δn = −1 ; K<sub>p</sub> = 280/(0,0821 × 1 000) = 3,41. Le quotient <b>Q</b> a la même forme que K avec les concentrations du moment : Q &lt; K → la réaction avance dans le sens direct ; Q &gt; K → sens inverse ; Q = K → équilibre.</p></div>'+
 '<div class="tcard"><b class="h">Tableau ICE</b><p>Initial, Change, Équilibre : on pose x l\'avancement en concentration et on écrit K<sub>c</sub> en fonction de x. On peut négliger x devant c₀ (c₀ − x ≈ c₀) <b>seulement si x/c₀ &lt; 5 %</b> ; on le vérifie toujours après.</p><p><b>Exemple</b> : N₂O₄ ⇌ 2 NO₂, K<sub>c</sub> = 4,6·10⁻³, c₀ = 0,020 mol/L : 4x²/(0,020 − x) = 4,6·10⁻³ → x = 4,26·10⁻³, soit 21 % de c₀ : l\'approximation est <b>interdite</b> (équation du second degré). [N₂O₄] = 0,0158 ; [NO₂] = 8,5·10⁻³ mol/L.</p></div>'+
 '<div class="tcard"><b class="h">Produit de solubilité K<sub>s</sub> et solubilité s</b><p>Pour A<sub>m</sub>B<sub>n</sub>(s) ⇌ m A<sup>n+</sup> + n B<sup>m−</sup> : <b>K<sub>s</sub> = [A]<sup>m</sup>[B]<sup>n</sup></b>. La solubilité molaire s s\'obtient en posant [A] = m·s, [B] = n·s : AgCl : K<sub>s</sub> = s² ; PbI₂ : K<sub>s</sub> = 4s³ (s = 1,35·10⁻³ → 9,8·10⁻⁹) ; Ca₃(PO₄)₂ : K<sub>s</sub> = (3s)³(2s)² = <b>108 s⁵</b>.</p><p><b>Piège</b> : on ne compare des solubilités par K<sub>s</sub> que pour des sels de même stœchiométrie. AgCl (K<sub>s</sub> = 1,8·10⁻¹⁰, s = 1,3·10⁻⁵) est moins soluble que Ag₂CrO₄ (K<sub>s</sub> = 1,1·10⁻¹², s = 6,5·10⁻⁵) bien que son K<sub>s</sub> soit plus grand ; l\'ordre croissant des s est AgI &lt; AgCl &lt; Ag₂CrO₄.</p></div>'+
 '<div class="tcard"><b class="h">Précipiter ou non ? Ion commun, sélectivité</b><p>Après mélange (volumes ajoutés, concentrations divisées), on calcule Q = Π[ions]. <b>Q &gt; K<sub>s</sub> : précipité</b> ; Q &lt; K<sub>s</sub> : solution limpide. Exemple : 50 mL + 50 mL de AgNO₃ et NaCl à 3,0·10⁻⁵ mol/L : [Ag⁺] = [Cl⁻] = 1,5·10⁻⁵ ; Q = 2,25·10⁻¹⁰ &gt; 1,8·10⁻¹⁰ : AgCl précipite.</p><p><b>Effet d\'ion commun</b> : AgCl dans NaCl 0,010 mol/L : s = K<sub>s</sub>/[Cl⁻] = 1,8·10⁻⁸ mol/L (au lieu de 1,3·10⁻⁵). <b>Sélectivité</b> : avec Cl⁻ et CrO₄²⁻ à 0,010 mol/L, AgCl précipite dès [Ag⁺] = 1,8·10⁻⁸ ; Ag₂CrO₄ seulement à 1,05·10⁻⁵ ; à ce moment il ne reste que 0,17 % des ions Cl⁻.</p></div>'+
 '<div class="tcard"><b class="h">pH, complexation, température</b><p>Les sels d\'<b>anions basiques</b> (OH⁻, CO₃²⁻, C₂O₄²⁻) deviennent plus solubles en milieu acide car l\'anion est protoné : CaCO₃ + 2 H⁺ → Ca²⁺ + CO₂ + H₂O. Mg(OH)₂ (K<sub>s</sub> = 5,6·10⁻¹²) : s = 1,1·10⁻⁴ mol/L dans l\'eau pure (pH 10,35), 5,6·10⁻⁴ à pH 10,00 ; il neutralise l\'acidité gastrique. AgCl, PbI₂, AgI (anions de bases très faibles) ne sont pas affectés. Un <b>ligand</b> qui complexe le cation augmente aussi la solubilité. BaSO₄ est inerte dans l\'estomac, BaCO₃ s\'y dissout (poison).</p><p><b>Van \'t Hoff</b> : ln(K₂/K₁) = −(ΔH°/R)(1/T₂ − 1/T₁) ; ΔG° = −RT ln K. Réaction endothermique (ΔH° = +60 kJ/mol) : K passe de 1,0·10⁻³ (300 K) à 3,1·10⁻² (350 K). Synthèse de NH₃ (exothermique) : K = 6·10⁵ à 298 K, 3,2·10⁻⁴ à 700 K.</p></div>'
});
SFA.figs("c06",[
 /* 0 Kp Kc */
 function(p){var q=uh_e(p,0,.6),y=H*.42;[[W*.08,[['SO₂',BLUE],['SO₂',BLUE],['O₂',GREEN]],'3 mol gaz'],[W*.6,[['SO₃',ORANGE],['SO₃',ORANGE]],'2 mol gaz']].forEach(function(g,gi){g[1].forEach(function(m,i){uh_atom(g[0]+i*50+16,y,m[0],m[1],19);});TB(g[2],g[0]+g[1].length*25,y+46,GREY,14);});TB('⇌',W*.5,y+6,GREY,34);TB('2 SO₂ + O₂ ⇌ 2 SO₃',W*.5,H*.14,BLUE_D,18);
  uh_al(q);uh_rr(W*.08,H*.76,W*.84,50,'#fff7ea',ORANGE,2);TB('Δn = −1 :  Kp = 280 / (0,0821 × 1000) = 3,41',W*.5,H*.76+22,ORANGE,15);TB('(Kp = Kc·(RT)^Δn)',W*.5,H*.76+42,GREY,12);ctx.globalAlpha=1;},
 /* 1 PbI2 */
 function(p){var q=uh_e(p,0,.6);c6_beaker(W*.08,H*.2,W*.4,H*.62,'#e9f2fb');uh_rr(W*.12,H*.74,W*.32,H*.07,'#f3e4a0',YEL,1.5,3);TB('PbI₂(s)',W*.28,H*.71,YEL,12);c6_pts(W*.1,H*.3,W*.36,H*.38,6,GREY,1,5);for(var i=0;i<4;i++){uh_atom(W*.15+i*W*.08,H*.42+(i%2)*28,'Pb²⁺',BLUE_D,13);}for(var j=0;j<4;j++){uh_atom(W*.19+j*W*.08,H*.58-(j%2)*10,'I⁻',ORANGE,11);}
  TB('PbI₂ ⇌ Pb²⁺ + 2 I⁻',W*.74,H*.2,BLUE_D,15);TB('s = 1,35·10⁻³ mol/L',W*.74,H*.34,INK,14);uh_al(q);TB('[Pb²⁺] = s ; [I⁻] = 2s',W*.74,H*.52,GREEN,14);TB('Ks = s·(2s)² = 4s³',W*.74,H*.66,ORANGE,15);TB('= 9,8·10⁻⁹',W*.74,H*.8,DRED,20);ctx.globalAlpha=1;},
 /* 2 Ca3(PO4)2 */
 function(p){var q=uh_e(p,0,.6);uh_atom(W*.14,H*.44,'Ca₃(PO₄)₂',INK,0.1);uh_rr(W*.04,H*.34,W*.2,H*.2,'#f0f0f0',GREY,2,6);TB('Ca₃(PO₄)₂',W*.14,H*.46,INK,15);TB('→',W*.32,H*.46,GREY,26);
  for(var i=0;i<3;i++)uh_atom(W*.42+i*38,H*.36,'Ca²⁺',BLUE_D,16);for(var j=0;j<2;j++)uh_atom(W*.44+j*52,H*.58,'PO₄³⁻',ORANGE,20);TB('3 Ca²⁺ + 2 PO₄³⁻',W*.55,H*.2,BLUE_D,16);
  uh_al(q);uh_rr(W*.12,H*.76,W*.76,38,'#fff7ea',ORANGE,2);TB('Ks = (3s)³(2s)² = 108 s⁵',W*.5,H*.76+26,ORANGE,18);ctx.globalAlpha=1;},
 /* 3 précipite-t-on */
 function(p){var q=uh_e(p,0,.6);c6_beaker(W*.04,H*.2,W*.22,H*.5,'#e9f2fb');c6_beaker(W*.3,H*.2,W*.22,H*.5,'#e9f2fb');TB('AgNO₃',W*.15,H*.8,BLUE_D,13);TB('NaCl',W*.41,H*.8,BLUE_D,13);TB('50 mL, 3,0·10⁻⁵ M',W*.28,H*.12,GREY,12);
  TB('+',W*.28,H*.46,GREY,22);TB('→',W*.58,H*.46,GREY,26);c6_beaker(W*.66,H*.2,W*.3,H*.5,'#e9f2fb');uh_al(q);for(var i=0;i<10;i++)DOT(W*.7+i*W*.02,H*.66+(i%2)*3,4,'#fff');ctx.strokeStyle=GREY;ctx.lineWidth=1;ctx.globalAlpha=q;uh_rr(W*.68,H*.64,W*.26,H*.05,'#f4f4f4',GREY,1.4,3);ctx.globalAlpha=1;uh_al(q);TB('AgCl(s)',W*.81,H*.58,GREY,13);
  uh_rr(W*.14,H*.86,W*.72,26,'#fff7ea',ORANGE,2);TB('Q = 2,25·10⁻¹⁰ > Ks = 1,8·10⁻¹⁰ : précipité',W*.5,H*.86+19,ORANGE,13);ctx.globalAlpha=1;if(!q)TB('Q ? Ks',W*.81,H*.46,GREY,20);},
 /* 4 N2O4 */
 function(p){var q=uh_e(p,0,.7),bx=70,by=H-50,k=(H-100)/.022;LN(bx-8,by,W-40,by,GREY,1.5);TB('mol/L',bx-6,18,GREY,12,'left');
  [['N₂O₄',.020,.01575,BLUE],['NO₂',0,.00851,ORANGE]].forEach(function(s,i){var x=bx+16+i*150,h0=s[1]*k,h1=(s[1]+(s[2]-s[1])*q)*k;uh_rr(x,by-h0,50,h0,s[3]+'22',s[3],1.6,3);ctx.setLineDash([4,3]);ctx.setLineDash([]);uh_rr(x+56,by-h1,50,Math.max(h1,1),s[3]+'55',s[3],2.4,3);TB(s[0],x+53,by+18,INK,14);TB('I',x+25,by-h0-6,GREY,12);TB('E',x+81,by-h1-6,dk(s[3]),13);});
  uh_al(q);uh_tag('x/c₀ = 21 % > 5 %',W*.76,H*.26,DRED,16);TB('approximation interdite',W*.76,H*.38,DRED,14);ctx.globalAlpha=1;TB('N₂O₄ ⇌ 2 NO₂ · Kc = 4,6·10⁻³',W*.5,H*.07,GREY,13);},
 /* 5 ion commun */
 function(p){var q=uh_e(p,0,.6),X=c6_lx(60,H*.64,W-100,-10,-4,'');var y=H*.2;
  TB('s (mol/L), échelle logarithmique',W*.5,H*.1,GREY,13);var s1=Math.log10(1.34e-5),s2=Math.log10(1.8e-8);uh_rr(60,y,X(s1)-60,34,BLUE+'33',BLUE,2,4);TB('AgCl, eau pure : 1,3·10⁻⁵',X(s1)-6,y+22,BLUE_D,13,'right');
  var l2=-10+(s2+10)*uh_e(p,0,.6)*0+(s2+10);uh_rr(60,y+60,Math.max(X(s2)-60,2),34,ORANGE+'33',ORANGE,2,4);uh_al(q);TB('dans NaCl 0,010 M : 1,8·10⁻⁸',X(s2)+10,y+82,DRED,14,'left');ctx.globalAlpha=1;
  TB('Ks = [Ag⁺][Cl⁻]  →  s = Ks/[Cl⁻]',W*.5,H*.86,GREY,14);},
 /* 6 sélective */
 function(p){var q=uh_e(p,0,.6),X=c6_lx(50,H*.5,W-90,-9,-4,'[Ag⁺] (mol/L)');TB('on ajoute Ag⁺ goutte à goutte →',W*.5,H*.14,GREY,13);
  var a=Math.log10(1.8e-8),b=Math.log10(1.05e-5);DOT(X(a),H*.5,8,GREY);TB('AgCl apparaît',X(a),H*.5-24,INK,14);TB('1,8·10⁻⁸',X(a),H*.5-42,GREY,12);DOT(X(b),H*.5,8,DRED);TB('Ag₂CrO₄ (rouge)',X(b),H*.5-24,DRED,14);TB('1,05·10⁻⁵',X(b),H*.5-42,GREY,12);
  uh_al(q);uh_tag('il reste 0,17 % de Cl⁻',W*.5,H*.84,DGREEN,17);ctx.globalAlpha=1;},
 /* 7 Mg(OH)2 */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(64,H-50,W-100,H-90,9,12,-5,0,'pH','log s');var f=function(pH){return Math.log10(5.6e-12*Math.pow(10,2*(14-pH)));};uh_fn(m,f,9,11.2,BLUE,3);[9,10,11,12].forEach(function(v){TB(v,m.X(v),H-32,GREY,11);});
  DOT(m.X(10.35),m.Y(f(10.35)),6,GREEN);TB('eau pure : pH 10,35 · s = 1,1·10⁻⁴',m.X(10.35)+12,m.Y(f(10.35))+22,DGREEN,12,'left');uh_al(q);DOT(m.X(10),m.Y(f(10)),7,ORANGE);uh_tag('pH 10,00 : s = 5,6·10⁻⁴',m.X(10)-4,m.Y(f(10))-26,ORANGE,14);ctx.globalAlpha=1;TB('Mg(OH)₂ : plus le pH baisse, plus il se dissout',W*.6,H*.07,GREY,13);},
 /* 8 sel soluble en acide */
 function(p){var q=uh_e(p,0,.7),names=['AgCl','PbI₂','CaCO₃','AgI'],sol=['#f4f4f4','#f3e4a0','#f4f4f4','#f6efb0'];names.forEach(function(n,i){var x=W*(.12+i*.24);uh_rr(x-22,H*.28,44,H*.5,'#eef5fc',INK,2.4,6);var h=i===2?(1-q*.85)*14:14;uh_rr(x-18,H*.78-6-h,36,h,sol[i],GREY,1,3);TB(n,x,H*.2,BLUE_D,15);if(i===2&&q>.1){for(var b=0;b<4;b++){var yy=H*.74-((tGlob*1.4+b*22)%80);if(q>.2)DOT(x-10+b*7,H*.74-((b*21+q*60)%60),3,'#bcd7f0');}}
   uh_al(i===2?q:1);TB(i===2?'se dissout':'inchangé',x,H*.9,i===2?DGREEN:GREY,13);ctx.globalAlpha=1;});TB('+ HCl (pH ≈ 2)',W*.5,H*.07,DRED,15);if(q>.3){uh_al(q);TB('CO₃²⁻ + 2 H⁺ → CO₂ + H₂O',W*.5,H*.97-2,DGREEN,12);ctx.globalAlpha=1;}},
 /* 9 stoechio piège */
 function(p){var q=uh_e(p,0,.6),X=c6_lx(60,H*.78,W-100,-9,-4,'s (mol/L)');var d=[['AgI',9.2e-9,GREEN,'Ks 8,5·10⁻¹⁷'],['AgCl',1.34e-5,BLUE,'Ks 1,8·10⁻¹⁰'],['Ag₂CrO₄',6.5e-5,ORANGE,'Ks 1,1·10⁻¹²']];
  d.forEach(function(r,i){var y=H*.12+i*H*.22,e=Math.log10(r[1]),w=(X(e)-60)*uh_e(p,i*.1,i*.1+.5);TB(r[0],54,y+22,INK,14,'right');uh_rr(60,y,Math.max(w,2),32,r[2]+'44',r[2],2,4);TB(r[3],64,y+46,GREY,11,'left');if(q>0){uh_al(q);TB('s = '+uh_f(r[1]*Math.pow(10,-Math.floor(Math.log10(r[1]))),1)+'·'+c6_pw(Math.floor(Math.log10(r[1]))),60+Math.max(w,2)+8,y+22,dk(r[2]),14,'left');ctx.globalAlpha=1;}});},
 /* 10 K(T) */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(64,H-50,W-100,H-90,290,360,-4,0,'T (K)','log K');var f=function(T){return Math.log10(1e-3)+(-60000/8.314*(1/T-1/300))/Math.LN10;};uh_fn(m,f,290,360,RED,3);[300,320,340,360].forEach(function(v){TB(v,m.X(v),H-32,GREY,11);});DOT(m.X(300),m.Y(-3),6,BLUE);tag('300 K : 1,0·10⁻³',m.X(300)+40,m.Y(-3)+26,BLUE_D,14);
  uh_al(q);DOT(m.X(350),m.Y(f(350)),7,ORANGE);uh_tag('350 K : K = 3,1·10⁻²',m.X(350)-50,m.Y(f(350))-24,ORANGE,15);ctx.globalAlpha=1;TB('ΔH° = +60 kJ/mol : K augmente avec T',W*.5,H*.08,GREY,13);},
 /* 11 calculs rénaux */
 function(p){var q=uh_e(p,0,.6),X=c6_lx(130,H*.62,W-170,-10,-5,'produit [Ca²⁺][ox] (mol²/L²)');var rows=[['Ks (CaC₂O₄)',2.3e-9,GREY],['Q urine',5.0e-7,RED],['Q urine diluée ×2',1.25e-7,ORANGE]];
  rows.forEach(function(r,i){var y=H*.1+i*H*.15,e=Math.log10(r[1]);if(i===2&&q<=0)return;uh_al(i===2?q:1);TB(r[0],124,y+19,INK,12,'right');uh_rr(130,y,X(e)-130,26,r[2]+'44',r[2],2,4);TB(uh_f(r[1]/Math.pow(10,Math.floor(e)),2)+'·'+c6_pw(Math.floor(e)),X(e)+6,y+19,dk(r[2]),13,'left');ctx.globalAlpha=1;});
  uh_al(q);uh_tag('Q/Ks ≈ 220 : sursaturée',W*.62,H*.84,DRED,15);ctx.globalAlpha=1;},
 /* 12 BaSO4 vs BaCO3 */
 function(p){var q=uh_e(p,0,.7);[['BaSO₄',W*.27,false,'poudre opaque, inerte'],['BaCO₃',W*.73,true,'se dissout : Ba²⁺ toxique']].forEach(function(t,i){var x=t[1];uh_rr(x-34,H*.26,68,H*.5,'#eef5fc',INK,2.4,8);var h=t[2]?(1-q*.9)*18:18;uh_rr(x-28,H*.76-6-h,56,h,'#f4f4f4',GREY,1,3);TB(t[0],x,H*.18,BLUE_D,16);if(t[2]&&q>.2){for(var b=0;b<5;b++)DOT(x-18+b*9,H*.7-((b*17+q*80)%70),3.4,'#bcd7f0');}
   TB(t[3],x,H*.88,t[2]?DRED:DGREEN,12);});TB('estomac : pH 1,5',W*.5,H*.07,GREY,13);uh_al(q);TB('BaCO₃ + 2 H⁺ → Ba²⁺ + CO₂ + H₂O',W*.73,H*.96,DRED,11);ctx.globalAlpha=1;},
 /* 13 Haber */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(64,H-50,W-100,H-90,290,800,-5,8,'T (K)','log K');var f=function(T){return (-(-92200-T*(-198.7))/(8.314*T))/Math.LN10;};uh_fn(m,f,290,800,RED,3);LN(m.X(290),m.Y(0),m.X(800),m.Y(0),GREY,1.2);[300,500,700].forEach(function(v){TB(v,m.X(v),H-32,GREY,11);});
  DOT(m.X(298),m.Y(f(298)),6,BLUE);TB('298 K : 6·10⁵',m.X(298)+10,m.Y(f(298))-8,BLUE_D,14,'left');uh_al(q);DOT(m.X(700),m.Y(f(700)),7,ORANGE);uh_tag('700 K : 3,2·10⁻⁴',m.X(700)-30,m.Y(f(700))-24,ORANGE,15);ctx.globalAlpha=1;TB('N₂ + 3 H₂ ⇌ 2 NH₃ (exothermique)',W*.62,H*.08,GREY,13);}
]);
