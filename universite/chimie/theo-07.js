/* Chimie BA1 · c07 · théorie animée et devantures d'exercices — contenu SFA original. */
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
function c7_prof(x0,w,y0,h,pts,col,lw){/* profil énergétique : pts [[xrel,E]], lissage par gaussiennes simples */ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.beginPath();for(var i=0;i<=w;i+=2){var xr=i/w,E=0;var Ew=0,Wt=0;/* interpolation cosinus entre points */for(var k=0;k<pts.length-1;k++){if(xr>=pts[k][0]&&xr<=pts[k+1][0]){var u=(xr-pts[k][0])/(pts[k+1][0]-pts[k][0]);var s=(1-Math.cos(PI*u))/2;E=pts[k][1]+(pts[k+1][1]-pts[k][1])*s;}}i?ctx.lineTo(x0+i,y0-E*h):ctx.moveTo(x0+i,y0-E*h);}ctx.stroke();}
function c7_dec(m,k,col,upto,a,b){uh_fn(m,function(t){return Math.exp(-k*t);},a,b,col,3,upto);}
SFA.theo("c07",{
 icon:function(){var m=uh_ax(W*.08,H*.8,W*.4,H*.56,0,4,0,1.05);uh_fn(m,function(t){return Math.exp(-.8*t);},0,4,BLUE,4);TB('v = k[A]ᵐ[B]ⁿ',W*.74,H*.34,BLUE_D,24);TB('k = A·e^(−Ea/RT)',W*.74,H*.56,ORANGE,18);TB('Michaelis–Menten',W*.74,H*.78,GREY,15);},
 anim:function(t){var tau=1+.34*(.5-.5*Math.cos(t*.012)),Ea=8,gx=50,gw=W*.55,gy=H-52,gh=H-110;var m=uh_ax(gx,gy,gw,gh,0,22,0,.36,'énergie cinétique des molécules','');
  var f=function(e){return e*Math.exp(-e/tau)/(tau*tau);};uh_fn(m,f,0,22,BLUE,3);
  ctx.fillStyle='rgba(216,90,48,.35)';ctx.beginPath();ctx.moveTo(m.X(Ea),m.Y(0));for(var e=Ea;e<=22;e+=.25)ctx.lineTo(m.X(e),m.Y(f(e)));ctx.lineTo(m.X(22),m.Y(0));ctx.closePath();ctx.fill();
  LN(m.X(Ea),gy,m.X(Ea),m.Y(.34),RED,2,[6,4]);TB('Ea',m.X(Ea),gy+16,DRED,14);var fr=(1+Ea/tau)*Math.exp(-Ea/tau),fr0=(1+Ea)*Math.exp(-Ea);
  var T=Math.round(300*tau);TB('T = '+T+' K',gx+gw*.72,H*.14,INK,17);TB('molécules plus énergétiques que Ea',m.X(14),m.Y(.12),DRED,12);
  var bx=W*.7,by=H-60,bh=H-130;TB('vitesse relative k(T)/k(300 K)',bx+80,22,GREY,13);var ratio=fr/fr0;uh_rr(bx+30,by-Math.min(bh,ratio/60*bh),44,Math.min(bh,ratio/60*bh),ORANGE+'44',ORANGE,2,3);TB('×'+uh_f(ratio,1),bx+52,by-Math.min(bh,ratio/60*bh)-8,DRED,16);LN(bx,by,bx+110,by,GREY,1.5);TB('k = A·e^(−Ea/RT)',bx+80,by+22,BLUE_D,14);},
 th:'<div class="tcard"><b class="h">Vitesse et loi de vitesse</b><p>La vitesse d\'une réaction est v = −d[A]/dt (réactif) = +d[P]/dt (produit), en mol/(L·s), à diviser par le coefficient stœchiométrique. La <b>loi de vitesse</b> v = k[A]<sup>m</sup>[B]<sup>n</sup> s\'établit par l\'expérience : m et n sont les <b>ordres partiels</b> (pas les coefficients de l\'équation, sauf étape élémentaire), m + n l\'ordre global, k la constante de vitesse (unité selon l\'ordre).</p><p><b>Exemple</b> : v = k[A][B]², k = 3,0·10⁻³ L²/(mol²·s), [A] = 0,20, [B] = 0,10 : v = 6,0·10⁻⁶ mol/(L·s).</p></div>'+
 '<div class="tcard"><b class="h">Méthode des vitesses initiales</b><p>On compare deux expériences où <b>un seul</b> réactif change : si [A] ×2 donne v ×2<sup>m</sup>. <b>Exemple</b> : [A] 0,10 → 0,20 fait passer v de 2,4·10⁻⁴ à 9,6·10⁻⁴ (×4) : m = 2 ; [B] ×3 donne v ×3 : n = 1. Donc v = k[A]²[B] avec k = 2,4·10⁻⁴/(0,10² × 0,10) = 0,24 L²/(mol²·s). Pour [A] = 0,15 et [B] = 0,25 : v = 1,35·10⁻³ mol/(L·s).</p></div>'+
 '<div class="tcard"><b class="h">Lois intégrées et demi-vies</b><ul><li><b>Ordre 0</b> : [A] = [A]₀ − kt ; t½ = [A]₀/2k.</li><li><b>Ordre 1</b> : <b>ln[A] = ln[A]₀ − kt</b> ; <b>t½ = ln 2/k</b>, <b>constante</b> (indépendante de [A]₀). ln[A] en fonction de t est une droite.</li><li><b>Ordre 2</b> : <b>1/[A] = 1/[A]₀ + kt</b> ; t½ = 1/(k[A]₀) : dépend de [A]₀.</li></ul><p><b>Exemples</b> : k = 0,0231 min⁻¹ → t½ = 30 min ; 90 % consommés = 3,32 demi-vies : avec t½ = 20 min, 66 min. Ordre 2 : k = 0,50 L/(mol·s), [A]₀ = 0,20 : 1/[A] = 5 + 0,5 × 30 = 20, [A] = 0,050 mol/L. Pour trancher entre ordres on teste quelle courbe (ln[A] ou 1/[A] en fonction de t) est une droite.</p></div>'+
 '<div class="tcard"><b class="h">Mécanismes</b><p>Un mécanisme est une suite d\'<b>étapes élémentaires</b> (molécularité 1, 2, rarement 3) dont la somme donne le bilan ; un <b>intermédiaire</b> est formé puis consommé (absent du bilan). La vitesse globale est celle de l\'<b>étape lente</b> (déterminante). Si cette étape contient un intermédiaire, on l\'exprime via un <b>pré-équilibre rapide</b>.</p><p><b>Exemple</b> : A + B ⇌ C (rapide, K), C + B → D (lente, k₂) : v = k₂[C][B] avec [C] = K[A][B], donc <b>v = k₂K[A][B]²</b>. Fluoration de NO₂ : étape lente NO₂ + F₂ → NO₂F + F, v = k[NO₂][F₂] ; [NO₂] ×3 et [F₂] ×2 : v ×6.</p></div>'+
 '<div class="tcard"><b class="h">Arrhenius et catalyse</b><p><b>k = A·exp(−E<sub>a</sub>/RT)</b> ; avec deux températures : <b>ln(k₂/k₁) = (E<sub>a</sub>/R)(1/T₁ − 1/T₂)</b>. Exemple : k = 2,0·10⁻³ s⁻¹ à 300 K et 1,6·10⁻² à 320 K : E<sub>a</sub> = 8,314 × ln 8/(1/300 − 1/320) ≈ 83 kJ/mol. Un <b>catalyseur</b> abaisse E<sub>a</sub> dans les deux sens (ici 50 → 35 kJ/mol direct, 80 → 65 inverse) mais <b>ne change ni ΔH ni K</b>.</p></div>'+
 '<div class="tcard"><b class="h">Applications : pharmacocinétique et enzymes</b><p><b>Doses répétées</b> (IV rapide, ordre 1) : après chaque dose C₀ = D/V ; avec t½ et un intervalle τ, le facteur d\'accumulation est 1/(1 − 2<sup>−τ/t½</sup>) ; C<sub>max,éq</sub> = C₀/(1 − 2<sup>−τ/t½</sup>), C<sub>min,éq</sub> = C<sub>max,éq</sub>·2<sup>−τ/t½</sup>. 300 mg/30 L toutes les 8 h (t½ 4 h) : C₀ = 10 mg/L, facteur 1,33, C<sub>max</sub> = 13,3 et C<sub>min</sub> = 3,3 mg/L, plateau après ≈ 4–5 t½ (≈ 18 h).</p><p><b>Michaelis–Menten</b> : v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]) ; Lineweaver–Burk : 1/v = (K<sub>m</sub>/V<sub>max</sub>)(1/[S]) + 1/V<sub>max</sub>. Inhibiteur <b>compétitif</b> : K<sub>m</sub>′ = K<sub>m</sub>(1 + [I]/K<sub>i</sub>), V<sub>max</sub> inchangée (surmontable par plus de substrat) ; <b>non compétitif</b> : V<sub>max</sub>′ = V<sub>max</sub>/(1 + [I]/K<sub>i</sub>), K<sub>m</sub> inchangée (non surmontable).</p></div>'
});
SFA.figs("c07",[
 /* 0 demi-vie ordre 1 */
 function(p){var q=uh_e(p,0,.7),k=.0231,m=uh_ax(60,H-48,W-100,H-90,0,120,0,1.05,'t (min)','[A]/[A]₀');uh_fn(m,function(t){return Math.exp(-k*t);},0,120,BLUE,3);[0,30,60,90,120].forEach(function(v){TB(v,m.X(v),H-31,GREY,11);});
  [[30,.5],[60,.25],[90,.125]].forEach(function(P,i){if(q<i*.3)return;uh_al(Math.min(1,(q-i*.25)*3));LN(m.X(P[0]),H-48,m.X(P[0]),m.Y(P[1]),ORANGE,1.6,[4,3]);LN(60,m.Y(P[1]),m.X(P[0]),m.Y(P[1]),ORANGE,1.2,[4,3]);DOT(m.X(P[0]),m.Y(P[1]),6,ORANGE);ctx.globalAlpha=1;});
  uh_al(q);uh_tag('t½ = ln 2 / k = 30 min',W*.62,H*.22,DRED,17);ctx.globalAlpha=1;TB('k = 0,0231 min⁻¹',W*.62,H*.1,GREY,13);},
 /* 1 vitesse */
 function(p){var q=uh_e(p,0,.6);TB('v = k [A] [B]²',W*.5,H*.22,BLUE_D,30);var y=H*.5;[[W*.18,'A',BLUE,.20],[W*.5,'B',ORANGE,.10]].forEach(function(r){uh_atom(r[0],y,r[1],r[2],20);TB('['+r[1]+'] = '+uh_f(r[3],2)+' mol/L',r[0],y+44,dk(r[2]),13);});uh_atom(W*.62,y,'B',ORANGE,20);TB('ordre 1 en A',W*.18,y-34,GREY,13);TB('ordre 2 en B',W*.56,y-34,GREY,13);
  TB('k = 3,0·10⁻³ L²/(mol²·s)',W*.5,H*.745,INK,13);uh_al(q);uh_rr(W*.12,H*.8,W*.76,38,'#fff7ea',ORANGE,2);TB('v = 3,0·10⁻³ × 0,20 × 0,10² = 6,0·10⁻⁶ mol/(L·s)',W*.5,H*.8+25,ORANGE,14);ctx.globalAlpha=1;},
 /* 2 ordre 1 */
 function(p){var q=uh_e(p,0,.6),k=Math.LN2/10,m=uh_ax(40,H-48,W*.42,H-90,0,35,0,1.05,'t','[A]'),m2=uh_ax(W*.58,H-48,W*.36,H-90,0,35,-3,.2,'t','ln [A]');uh_fn(m,function(t){return Math.exp(-k*t);},0,35,BLUE,3);uh_fn(m2,function(t){return -k*t;},0,35,GREEN,3);
  [10,20,30].forEach(function(t,i){LN(m.X(t),H-48,m.X(t),m.Y(Math.exp(-k*t)),GREY,1.2,[3,3]);});uh_al(q);[[0,10],[10,20],[20,30]].forEach(function(r){A(m.X(r[0]),H-62,m.X(r[1])-m.X(r[0])-4,0,ORANGE,'',2);TB('t½',(m.X(r[0])+m.X(r[1]))/2,H-68,DRED,13);});TB('t½ constante',W*.3,H*.2,DRED,15);TB('droite de pente −k',W*.79,H*.2,DGREEN,15);ctx.globalAlpha=1;TB('ordre 1',W*.5,H*.06,GREY,13);},
 /* 3 ordres partiels */
 function(p){var q=uh_e(p,0,.6),rows=[['1','0,10','0,10','2,4·10⁻⁴'],['2','0,20','0,10','9,6·10⁻⁴'],['3','0,10','0,30','7,2·10⁻⁴']],x=[W*.1,W*.28,W*.46,W*.7];['exp.','[A]','[B]','v₀'].forEach(function(h,i){TB(h,x[i],H*.12,GREY,14);});
  rows.forEach(function(r,j){var y=H*.26+j*H*.15;r.forEach(function(c,i){TB(c,x[i],y,INK,16);});});LN(W*.04,H*.16,W*.9,H*.16,AX,1.4);
  uh_al(q);A(W*.28-34,H*.26+4,0,H*.15-22,BLUE,'',2.4);TB('×2',W*.28-42,H*.26+H*.075+4,BLUE_D,15,'right');A(W*.7-46,H*.26+4,0,H*.15-22,RED,'',2.4);TB('×4',W*.7-54,H*.26+H*.075+4,DRED,15,'right');TB('m = 2',W*.7+66,H*.26+H*.075+4,DRED,15);
  TB('[B] ×3 → v ×3 : n = 1',W*.5,H*.69,DGREEN,15);uh_rr(W*.1,H*.77,W*.8,38,'#fff7ea',ORANGE,2);TB('v = k[A]²[B] , k = 0,24 L²/(mol²·s)',W*.5,H*.77+25,ORANGE,16);ctx.globalAlpha=1;},
 /* 4 Arrhenius */
 function(p){var q=uh_e(p,0,.6),x1=1/300,x2=1/320,m=uh_ax(64,H-50,W-100,H-90,.0030,.0034,-7.5,-3.5,'1/T (K⁻¹)','ln k');var y1=Math.log(2e-3),y2=Math.log(1.6e-2),sl=(y2-y1)/(x2-x1);uh_fn(m,function(x){return y1+sl*(x-x1);},.0030,.0034,RED,3,null);
  [[x1,y1,'300 K · 2,0·10⁻³ s⁻¹',-1],[x2,y2,'320 K · 1,6·10⁻² s⁻¹',1]].forEach(function(P){DOT(m.X(P[0]),m.Y(P[1]),7,BLUE);tag(P[2],m.X(P[0])+(P[3]>0?18:-84),m.Y(P[1])+(P[3]>0?-24:26),BLUE_D,13);});
  uh_al(q);TB('pente = −Ea/R',W*.62,H*.4,GREY,14);uh_tag('Ea ≈ '+uh_f(-sl*8.314/1000,1)+' kJ/mol',W*.76,H*.14,DRED,18);ctx.globalAlpha=1;},
 /* 5 90 % */
 function(p){var q=uh_e(p,0,.7),k=Math.LN2/20,m=uh_ax(60,H-48,W-100,H-90,0,120,0,1.05,'t (min)','[A]/[A]₀');uh_fn(m,function(t){return Math.exp(-k*t);},0,120,BLUE,3);[0,20,40,60,80,100].forEach(function(v){TB(v,m.X(v),H-31,GREY,11);});
  LN(60,m.Y(.1),W-30,m.Y(.1),GREY,1.4,[5,4]);TB('10 % restants',W-30,m.Y(.1)-8,GREY,13,'right');var tt=20*Math.log2(10);uh_al(q);LN(m.X(tt),H-48,m.X(tt),m.Y(.1),ORANGE,2,[4,3]);DOT(m.X(tt),m.Y(.1),7,ORANGE);uh_tag('t = 20 × log₂10 ≈ 66 min',m.X(tt)-20,m.Y(.1)-34,DRED,15);ctx.globalAlpha=1;TB('t½ = 20 min',W*.62,H*.12,GREY,14);},
 /* 6 ordre 1 ou 2 */
 function(p){var q=uh_e(p,0,.6),T=[0,10,20,30,40],A_=[.8,.536,.359,.241,.162],m1=uh_ax(44,H-48,W*.38,H-100,0,40,-2.1,0,'t (min)','ln [A]'),m2=uh_ax(W*.58,H-48,W*.36,H-100,0,40,0,7,'t (min)','1/[A]');
  T.forEach(function(t,i){DOT(m1.X(t),m1.Y(Math.log(A_[i])),5,BLUE);DOT(m2.X(t),m2.Y(1/A_[i]),5,BLUE);});uh_fn(m1,function(t){return Math.log(.8)-.04*t;},0,40,GREEN,2.4,null,[5,4]);ctx.strokeStyle=RED;ctx.lineWidth=2.4;ctx.setLineDash([5,4]);ctx.beginPath();T.forEach(function(t,i){i?ctx.lineTo(m2.X(t),m2.Y(1/A_[i])):ctx.moveTo(m2.X(t),m2.Y(1/A_[i]));});ctx.stroke();ctx.setLineDash([]);
  uh_al(q);TB('droite : ordre 1 ✓',W*.25,H*.1,DGREEN,16);TB('courbe : pas ordre 2',W*.76,H*.1,DRED,16);uh_tag('k ≈ 0,040 min⁻¹ · t½ ≈ 17 min',W*.5,H*.2+4,ORANGE,14);ctx.globalAlpha=1;},
 /* 7 fluoration */
 function(p){var q=uh_e(p,0,.6),x0=40,w=W-80,y0=H*.66,h=H*.42/60;c7_prof(x0,w,y0,h,[[0,0],[.25,0],[.4,50],[.55,10],[.7,22],[.8,-30],[1,-30]],BLUE,3.4);TB('NO₂ + F₂',x0+8,y0+22,INK,13,'left');TB('NO₂F + F (intermédiaire)',x0+w*.5,y0-10*h+30,INK,13);TB('2 NO₂F',x0+w-4,y0+30*h+20,INK,13,'right');TB('étape 1 (lente)',x0+w*.4,y0-50*h-10,DRED,14);TB('étape 2 (rapide)',x0+w*.7,y0-22*h-10,DGREEN,13);
  uh_al(q);uh_rr(W*.08,H*.06,W*.5,36,'#fff7ea',ORANGE,2);TB('v = k[NO₂][F₂]',W*.33,H*.06+25,ORANGE,18);TB('[NO₂] ×3 , [F₂] ×2 → v ×6',W*.78,H*.2,DRED,14);ctx.globalAlpha=1;},
 /* 8 mécanisme pré-équilibre */
 function(p){var q=uh_e(p,0,.6),x0=40,w=W-80,y0=H*.66,h=H*.42/60;c7_prof(x0,w,y0,h,[[0,0],[.2,0],[.3,14],[.4,8],[.55,8],[.7,50],[.85,-20],[1,-20]],BLUE,3.4);TB('A + B',x0+8,y0+22,INK,13,'left');TB('C',x0+w*.45,y0-8*h+22,INK,15);TB('D',x0+w-4,y0+20*h+18,INK,15,'right');TB('rapide, K',x0+w*.3,y0-14*h-10,DGREEN,13);TB('lente, k₂',x0+w*.7,y0-50*h-10,DRED,14);
  uh_al(q);uh_rr(W*.08,H*.06,W*.56,36,'#fff7ea',ORANGE,2);TB('v = k₂ K [A][B]²',W*.36,H*.06+25,ORANGE,18);ctx.globalAlpha=1;},
 /* 9 doses répétées */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(50,H-46,W-80,H-84,0,72,0,22,'t (h)','C (mg/L)');ctx.fillStyle='rgba(29,158,117,.13)';ctx.fillRect(m.X(0),m.Y(20),m.X(72)-m.X(0),m.Y(3)-m.Y(20));TB('fenêtre 3–20',m.X(70),m.Y(20)+14,DGREEN,12,'right');
  var C=function(t){var s=0,n=Math.floor(t/8);for(var i=0;i<=n;i++)s+=10*Math.pow(.5,(t-8*i)/4);return s;};ctx.strokeStyle=BLUE;ctx.lineWidth=2.6;ctx.beginPath();var first=true;for(var t=0;t<=72;t+=.25){var x=m.X(t),y=m.Y(C(t));first?ctx.moveTo(x,y):ctx.lineTo(x,y);first=false;}ctx.stroke();
  [0,24,48,72].forEach(function(v){TB(v,m.X(v),H-29,GREY,11);});LN(m.X(0),m.Y(13.33),m.X(72),m.Y(13.33),ORANGE,1.4,[5,4]);LN(m.X(0),m.Y(3.33),m.X(72),m.Y(3.33),ORANGE,1.4,[5,4]);
  uh_al(q);TB('Cmax = 13,3',m.X(72),m.Y(13.33)-6,DRED,14,'right');TB('Cmin = 3,3',m.X(72),m.Y(3.33)+16,DRED,14,'right');uh_tag('accumulation ×1,33 · plateau ≈ 18 h',W*.4,H*.18,ORANGE,14);ctx.globalAlpha=1;TB('300 mg toutes les 8 h',W*.25,H*.07,GREY,13);},
 /* 10 ordre 2 */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H-48,W-100,H-90,0,40,0,24,'t (s)','1/[A] (L/mol)');uh_fn(m,function(t){return 5+.5*t;},0,40,BLUE,3);[0,10,20,30,40].forEach(function(v){TB(v,m.X(v),H-31,GREY,11);});DOT(m.X(0),m.Y(5),6,BLUE);TB('5',m.X(0)-8,m.Y(5)+4,BLUE_D,13,'right');
  uh_al(q);DOT(m.X(30),m.Y(20),8,ORANGE);LN(m.X(30),H-48,m.X(30),m.Y(20),ORANGE,1.6,[4,3]);uh_tag('1/[A] = 5 + 0,5×30 = 20',m.X(30)-80,m.Y(20)-22,ORANGE,14);TB('[A] = 0,050 mol/L',W*.7,H*.62,DRED,17);ctx.globalAlpha=1;TB('pente = k = 0,50',W*.3,H*.2,GREY,14);},
 /* 11 catalyseur */
 function(p){var q=uh_e(p,0,.6),x0=40,w=W-80,y0=H*.76,h=H*.5/90;c7_prof(x0,w,y0,h,[[0,0],[.2,0],[.5,50],[.8,-30],[1,-30]],GREY,3);uh_al(.4+.6*q);c7_prof(x0,w,y0,h,[[0,0],[.2,0],[.5,35],[.8,-30],[1,-30]],GREEN,3.4);ctx.globalAlpha=1;
  TB('Ea = 50',x0+w*.5+8,y0-50*h-8,GREY,13,'left');TB('Ea = 35 (catalysé)',x0+w*.5+8,y0-35*h-8+22,DGREEN,13,'left');TB('ΔH = −30',x0+w*.9,y0+10*h,INK,13,'right');uh_al(q);uh_tag('Ea(inverse) = 65 · K inchangée',W*.5,H*.1,DRED,15);ctx.globalAlpha=1;},
 /* 12 inhibition */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H-48,W-100,H-90,0,8,0,90,'[S] (mmol/L)','v (µmol/L/min)');var f=function(S,V,K){return V*S/(K+S);};uh_fn(m,function(S){return f(S,80,2);},0,8,BLUE,3);uh_fn(m,function(S){return f(S,80,8);},0,8,ORANGE,3);uh_fn(m,function(S){return f(S,20,2);},0,8,RED,3);
  [0,2,4,6,8].forEach(function(v){TB(v,m.X(v),H-31,GREY,11);});TB('sans inhibiteur',m.X(5),m.Y(f(5,80,2))-10,BLUE_D,13);TB('compétitif (Km′ = 8)',m.X(8),m.Y(f(8,80,8))-10,dk(ORANGE),13,'right');TB('non compétitif (Vmax′ = 20)',m.X(8),m.Y(f(8,20,2))+22,DRED,13,'right');
  uh_al(q);LN(m.X(0),m.Y(26.67),m.X(8),m.Y(26.67),GREY,1.3,[4,4]);DOT(m.X(1),m.Y(26.67),6,BLUE);DOT(m.X(4),m.Y(26.67),7,ORANGE);uh_tag('S = 4 mmol/L : surmonté',m.X(4.2),m.Y(6),DGREEN,13);TB('jamais atteint',m.X(.2),m.Y(26.67)-8,DRED,13,'left');ctx.globalAlpha=1;},
 /* 13 équilibre réversible */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H-48,W-100,H-90,0,1500,0,1,'t (s)','fraction de B');[[2.05e-3,.976,BLUE,'300 K'],[2.756e-2,.931,RED,'330 K']].forEach(function(r){uh_fn(m,function(t){return .5*0+r[1]*(1-Math.exp(-r[0]*t));},0,1500,r[2],3);});
  [0,500,1000,1500].forEach(function(v){TB(v,m.X(v),H-31,GREY,11);});LN(60,m.Y(.976),W-40,m.Y(.976),BLUE,1.2,[4,4]);LN(60,m.Y(.931),W-40,m.Y(.931),RED,1.2,[4,4]);
  TB('300 K : 97,6 %',m.X(1500),m.Y(.976)-8,BLUE_D,14,'right');TB('330 K : 93,1 %',m.X(1500),m.Y(.931)+18,DRED,14,'right');uh_al(q);uh_tag('t½ : 338 s → 25 s',W*.62,H*.62,DRED,16);TB('plus rapide mais moins favorable',W*.62,H*.76,GREY,13);ctx.globalAlpha=1;}
]);
