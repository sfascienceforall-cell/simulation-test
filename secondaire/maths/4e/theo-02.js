/* Maths 4e · chapitre 2 : racines, radicaux et polynômes */
function m4_n(v){return String(v).replace('.',',').replace('-','−');}
function m4_horner(cx0,cy0,co,a,k,cw,rh,fs){
 var n=co.length,s=[co[0]],pr=[0],i;for(i=1;i<n;i++){pr[i]=a*s[i-1];s[i]=co[i]+pr[i];}
 var X=function(i){return cx0+(i+1)*cw;},al=function(st){return m4_cl(k-st+1,0,1);};
 fs=fs||20;
 ctx.fillStyle='#f6f9fd';ctx.fillRect(cx0-cw*.5,cy0-rh*.5,(n+1)*cw,rh*3);
 LN(cx0+cw*.5,cy0-rh*.5,cx0+cw*.5,cy0+rh*2.5,INK,2);LN(cx0-cw*.5,cy0+rh*1.5,cx0+cw*(n+.5),cy0+rh*1.5,INK,2);
 TB(m4_n(a),cx0,cy0+4+fs*.1,ORANGE,fs);
 for(i=0;i<n;i++)TB(m4_n(co[i]),X(i),cy0+fs*.35,INK,fs);
 ctx.globalAlpha=al(0);TB(m4_n(s[0]),X(0),cy0+2*rh+fs*.35,i===n?DRED:BLUE_D,fs);ctx.globalAlpha=1;
 for(i=1;i<n;i++){
  var a1=al(2*i-1),a2=al(2*i);
  if(a1>0){ctx.globalAlpha=a1;arrow(X(i-1)+fs*.5,cy0+2*rh-fs*.45,cw-fs,-(rh*1.1)+fs*.2,ORANGE,'',1.8);TB(m4_n(pr[i]),X(i),cy0+rh+fs*.35,ORANGE,fs);ctx.globalAlpha=1;}
  if(a2>0){ctx.globalAlpha=a2;TB(m4_n(s[i]),X(i),cy0+2*rh+fs*.35,i===n-1?DRED:BLUE_D,fs);ctx.globalAlpha=1;}}
 return {s:s,steps:2*n-1};}
function m4_polyfr(f,p,col){return f;}

SFA.theo("c02", {
 icon: function () {
  TB('√72 = 6√2',W*.5,H*.34,BLUE_D,38);
  TB('P(x) = (x − a)·Q(x) + P(a)',W*.5,H*.58,ORANGE,22);
  m4_horner(W*.5-100,H*.7,[1,-4,1,6],2,5,50,22,16);
 },
 anim: function (t) {
  var co=[1,-4,1,6],a=2,n=4,steps=2*n-1,per=58,cyc=per*(steps+4),k=Math.min(steps+.5,(t%cyc)/per);
  TB('Schéma de Horner : P(x) = x³ − 4x² + x + 6 divisé par (x − 2)',W*.5,28,BLUE_D,16);
  var cw=Math.min(78,W*.1),cx0=W*.5-cw*2.2;
  var r=m4_horner(cx0,70,co,a,k,cw,44,28);
  var st=Math.min(steps-1,Math.floor(k+.35)),msg;
  if(st<=0)msg='1. On abaisse le premier coefficient : 1';
  else if(st%2===1){var i=(st+1)/2;msg=(i+1)+'. On multiplie par a = 2 : 2 × '+m4_n(r.s[i-1])+' = '+m4_n(2*r.s[i-1]);}
  else{var j=st/2;msg=(j+1)+'. On additionne : '+m4_n(co[j])+' + ('+m4_n(2*r.s[j-1])+') = '+m4_n(r.s[j]);}
  TB(msg,W*.5,200,INK,16);
  if(k>=steps){TB('quotient : x² − 2x − 3     reste : 0',W*.5,236,DRED,18);
   TB('donc P(x) = (x − 2)(x² − 2x − 3) = (x − 2)(x − 3)(x + 1)',W*.5,266,DGREEN,16);}
  else TB('le dernier nombre est le reste = P(2)',W*.5,236,GREY,14);
 },
 th: '<div class="tcard"><b class="h">Radicaux</b><p>Pour a ≥ 0 et b ≥ 0 : <b>√(a·b) = √a·√b</b> et √(a/b) = √a/√b (b &gt; 0). Pour tout réel a : <b>√(a²) = |a|</b>.</p><p><b>Simplifier</b> : extraire le plus grand carré parfait. √72 = √(36·2) = <b>6√2</b>. <b>Piège</b> : √(a + b) ≠ √a + √b ; par exemple √(9 + 16) = 5 alors que √9 + √16 = 7.</p><p><b>Rendre le dénominateur rationnel</b> : on multiplie par le conjugué, car (√a − √b)(√a + √b) = a − b. Exemple : 5/(√7 − √2) = 5(√7 + √2)/(7 − 2) = <b>√7 + √2</b>.</p></div>'+
 '<div class="tcard"><b class="h">Polynômes et division</b><p>Un polynôme P(x) = aₙxⁿ + … + a₁x + a₀ a pour degré n (aₙ ≠ 0). On additionne et multiplie comme des expressions littérales ; le degré d\'un produit est la somme des degrés.</p><p><b>Division euclidienne</b> : P(x) = D(x)·Q(x) + R(x), avec deg R &lt; deg D. Si D(x) = x − a, le reste R est une constante.</p></div>'+
 '<div class="tcard"><b class="h">Horner (Ruffini) et théorème du reste</b><p>Pour diviser P par (x − a) : on écrit les coefficients de P <b>sans en oublier</b> (un 0 pour chaque terme manquant), on abaisse le premier, puis on répète « multiplier par a, additionner ». Le dernier nombre est le reste, les autres sont les coefficients du quotient.</p><p><b>Théorème du reste</b> : le reste de la division de P par x − a vaut <b>P(a)</b>. Donc : a est racine de P ⇔ P(a) = 0 ⇔ (x − a) divise P.</p><p>Exemple : P(x) = 2x³ − 3x + 1 par x + 2 (a = −2) : coefficients 2 ; 0 ; −3 ; 1 → 2 ; −4 ; 5 ; <b>−9</b>. On vérifie : P(−2) = −16 + 6 + 1 = −9.</p></div>'+
 '<div class="tcard"><b class="h">Factoriser</b><p>Les racines entières d\'un polynôme à coefficients entiers sont à chercher parmi les <b>diviseurs du terme constant</b>. On trouve une racine a (P(a) = 0), on divise par x − a, puis on recommence avec le quotient.</p><p>Exemple : P(x) = x³ − 2x² − 5x + 6. Diviseurs de 6 : P(1) = 0. Horner donne le quotient x² − x − 6 = (x − 3)(x + 2). Donc <b>P(x) = (x − 1)(x − 3)(x + 2)</b>, racines 1, 3 et −2.</p></div>'+
 '<div class="tcard"><b class="h">Identification des coefficients</b><p>Deux polynômes sont égaux si et seulement si leurs coefficients de même degré sont égaux. Pour que P soit divisible par (x − 1)(x + 2), il faut P(1) = 0 et P(−2) = 0 : on obtient un système en a et b.</p><p><b>Pièges</b> : oublier un coefficient nul dans Horner (x³ + 1 s\'écrit 1 ; 0 ; 0 ; 1) ; se tromper de signe avec x + 2, où a = −2 ; croire que √(a + b) = √a + √b.</p></div>'
});
SFA.figs("c02", [
 function (p) { /* 0 simplifier sqrt72 */
  TB('√72',W*.5,H*.2,BLUE_D,34);
  var a=m4_ap(p,0,.5);
  LN(W*.5,H*.28,W*.28,H*.46,GREY,2);LN(W*.5,H*.28,W*.72,H*.46,GREY,2);
  ctx.globalAlpha=.35+.65*a;TB('36',W*.28,H*.56,GREEN,30);TB('2',W*.72,H*.56,ORANGE,30);ctx.globalAlpha=1;
  TB('72 = 36 × 2',W*.5,H*.46,GREY,15);
  ctx.globalAlpha=m4_ap(p,.4,.8);TB('√36 = 6',W*.28,H*.68,DGREEN,16);TB('√2 reste',W*.72,H*.68,DRED,16);ctx.globalAlpha=1;
  ctx.globalAlpha=m4_ap(p,.7,1);TB('√72 = 6√2 ≈ 8,49',W*.5,H*.9,DRED,26);ctx.globalAlpha=1;
 },
 function (p) { /* 1 sqrt(9+16) */
  var u=(W-60)/8,x0=30,y1=H*.34,y2=H*.66;
  TB('√9 + √16',x0,y1-34,BLUE_D,18,'left');
  ctx.fillStyle=BLUE;ctx.fillRect(x0,y1-12,3*u,24);ctx.fillStyle=ORANGE;ctx.fillRect(x0+3*u,y1-12,4*u,24);
  TB('3',x0+1.5*u,y1+5,'#fff',16);TB('4',x0+5*u,y1+5,'#fff',16);TB('= 7',x0+7*u+8,y1+6,BLUE_D,17,'left');
  TB('√(9 + 16) = √25',x0,y2-34,DRED,18,'left');
  var a=m4_ap(p,0,.7);ctx.fillStyle=RED;ctx.fillRect(x0,y2-12,5*u*a,24);
  if(a>.95)TB('= 5',x0+5*u+8,y2+6,DRED,17,'left');
  ctx.globalAlpha=m4_ap(p,.7,1);TB('√(a + b) ≠ √a + √b',W*.5,H*.92,DGREEN,19);ctx.globalAlpha=1;
 },
 function (p) { /* 2 rationaliser */
  TB('5',W*.14,H*.2,INK,26);LN(W*.08,H*.27,W*.2,H*.27,INK,2.4);TB('√7 − √2',W*.14,H*.39,BLUE_D,22);
  TB('×',W*.25,H*.3,GREY,24);
  TB('√7 + √2',W*.37,H*.2,ORANGE,22);LN(W*.29,H*.27,W*.45,H*.27,INK,2.4);TB('√7 + √2',W*.37,H*.39,ORANGE,22);
  TB('conjugué',W*.37,H*.52,ORANGE,15);
  var a=m4_ap(p,0,.6);ctx.globalAlpha=a;
  TB('=',W*.5,H*.3,GREY,24);
  TB('5(√7 + √2)',W*.69,H*.2,INK,22);LN(W*.57,H*.27,W*.81,H*.27,INK,2.4);TB('7 − 2',W*.69,H*.39,INK,22);ctx.globalAlpha=1;
  ctx.globalAlpha=m4_ap(p,.5,1);TB('(√7 − √2)(√7 + √2) = 7 − 2 = 5',W*.5,H*.68,DGREEN,17);
  TB('A = √7 + √2 ≈ 4,06',W*.5,H*.88,DRED,28);ctx.globalAlpha=1;
 },
 function (p) { /* 3 Horner x-2 */
  var n=4,cw=Math.min(80,W*.14);
  TB('P(x) = x³ − 4x² + x + 6   par   x − 2',W*.5,34,BLUE_D,17);
  m4_horner(W*.5-cw*2.5,90,[1,-4,1,6],2,p*7,cw,44,28);
  ctx.globalAlpha=m4_ap(p,.85,1);
  TB('x² − 2x − 3  ,  reste 0',W*.5,H-34,DRED,22);ctx.globalAlpha=1;
 },
 function (p) { /* 4 théorème du reste -2 */
  var cw=Math.min(80,W*.14);
  TB('P(x) = 2x³ − 3x + 1   par   x + 2',W*.5,34,BLUE_D,17);
  TB('a = −2 (car x + 2 = x − (−2))',W*.5,62,ORANGE,14);
  m4_horner(W*.5-cw*2.5,110,[2,0,-3,1],-2,p*7,cw,44,28);
  ctx.globalAlpha=m4_ap(p,.85,1);
  TB('reste = P(−2) = −9',W*.5,H-34,DRED,24);ctx.globalAlpha=1;
 },
 function (p) { /* 5 factoriser x³-2x²-5x+6 */
  var f=m4_fr(-3.3,4.3,-9,10,{});
  m4_grid(f,1,2,true);
  var P=function(x){return x*x*x-2*x*x-5*x+6;};
  m4_cv(f,P,-3.3,4.3,BLUE,3.4);
  tag('P(x) = x³ − 2x² − 5x + 6',f.X(-.4),f.Y(9.2),BLUE_D,14);
  m4_pt(f,0,6,GREY,'',0,0,4);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);[-2,1,3].forEach(function(r){m4_pt(f,r,0,RED,'',0,0,6);tag('x = '+m4_n(r),f.X(r),f.Y(0)+(r===1?20:-18),DRED,14);});
   tag('(x − 1)(x − 3)(x + 2)',f.X(2.5),f.Y(-7),DGREEN,16);ctx.globalAlpha=1;}
 },
 function (p) { /* 6 coefficients indéterminés */
  var f=m4_fr(-4.2,2.4,-11,9,{});
  m4_grid(f,1,2,true);
  var P=function(x){return x*x*x+4*x*x+x-6;};
  m4_cv(f,P,-4.2,2.4,BLUE,3.4);
  tag('P(x) = x³ + ax² + bx − 6',f.X(-2.2),f.Y(8),BLUE_D,14);
  m4_pt(f,0,-6,ORANGE,'P(0) = −6',48,6,5);
  m4_pt(f,1,0,RED,'',0,0,6);m4_pt(f,-2,0,RED,'',0,0,6);
  tag('1',f.X(1),f.Y(0)+20,DRED,14);tag('−2',f.X(-2),f.Y(0)+20,DRED,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_pt(f,-3,0,RED,'',0,0,6);tag('−3',f.X(-3),f.Y(0)+20,DRED,14);
   tag('a = 4 ; b = 1',f.X(-2.6),f.Y(-8.5),DGREEN,17);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 x³+1 par x+1 */
  var cw=Math.min(80,W*.14);
  TB('x³ + 1   par   x + 1',W*.5,34,BLUE_D,18);
  TB('x³ + 0x² + 0x + 1 : on garde les zéros !',W*.5,62,ORANGE,14);
  m4_horner(W*.5-cw*2.5,110,[1,0,0,1],-1,p*7,cw,44,28);
  ctx.globalAlpha=m4_ap(p,.85,1);
  TB('quotient x² − x + 1 , reste 0',W*.5,H-34,DRED,22);ctx.globalAlpha=1;
 },
 function (p) { /* 8 racines irrationnelles */
  var f=m4_fr(-1.4,3.4,-4.5,5,{});
  m4_grid(f,1,1,true);
  var P=function(x){return x*x*x-3*x*x+x+1;};
  m4_cv(f,P,-1.4,3.4,BLUE,3.4);
  tag('P(x) = x³ − 3x² + x + 1',f.X(-.1),f.Y(4.4),BLUE_D,14);
  m4_pt(f,1,0,RED,'',0,0,6);tag('1',f.X(1),f.Y(0)+20,DRED,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);var r1=1+Math.SQRT2,r2=1-Math.SQRT2;
   m4_pt(f,r1,0,RED,'',0,0,6);m4_pt(f,r2,0,RED,'',0,0,6);
   tag('1 + √2 ≈ 2,41',f.X(r1)+6,f.Y(0)-20,DRED,13);tag('1 − √2 ≈ −0,41',f.X(r2)+6,f.Y(0)+22,DRED,13);
   tag('P(x) = (x − 1)(x − 1 − √2)(x − 1 + √2)',f.X(1.2),f.Y(-3.6),DGREEN,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 retrouver un polynôme */
  var f=m4_fr(-1,5,-9,9,{});
  m4_grid(f,1,2,true);
  var P=function(x){return (x-1)*(x-2)*(x-3);};
  m4_cv(f,P,-1,5,BLUE,3.4);
  tag('P(x) = x³ − 6x² + 11x − 6',f.X(1.1),f.Y(8.1),BLUE_D,14);
  m4_pt(f,1,0,RED,'',0,0,6);m4_pt(f,2,0,RED,'',0,0,6);m4_pt(f,0,-6,ORANGE,'P(0) = −6',44,6,5);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_pt(f,3,0,GREY,'',0,0,5);m4_pt(f,4,6,GREEN,'P(4) = 6',-4,-18,6);
   tag('P(−1) = −24 ↓',f.X(0),f.Y(-7.9),DGREEN,14);ctx.globalAlpha=1;}
 }
]);
