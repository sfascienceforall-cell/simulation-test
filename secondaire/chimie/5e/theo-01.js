/* Chimie 5e · chapitre 1 : théorie animée et devantures */
/* ---- aides communes au cours (préfixe k5_) ---- */
function k5_ez(p){return p<=0?0:p>=1?1:p*p*(3-2*p);}
function k5_seg(p,a,b){return k5_ez((p-a)/(b-a));}
function k5_rr(x,y,w,h,f,s,lw,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r==null?7:r);if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||1.6;ctx.stroke();}}
function k5_ring(x,y,r,col,lw,dash){ctx.strokeStyle=col;ctx.lineWidth=lw||1.6;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();ctx.setLineDash([]);}
function k5_at(x,y,r,col,lab,sz,tc){DOT(x,y,r,col+'38');k5_ring(x,y,r,col,2);if(lab)TB(lab,x,y+(sz||14)*.36,tc||dk(col),sz||14);}
function k5_el(x,y,col){DOT(x,y,3.6,col||BLUE);}
function k5_sup(n){var m={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻","+":"⁺"};return String(n).split("").map(function(c){return m[c]||c;}).join("");}
function k5_sub(n){var m={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉"};return String(n).split("").map(function(c){return m[c]||c;}).join("");}
/* couches : arr = électrons par couche ; dessine le noyau (symbole) et les couches avec électrons répartis */
function k5_shells(x,y,r0,dr,arr,col,sym,t,symCol){
 var k;for(k=0;k<arr.length;k++){k5_ring(x,y,r0+k*dr,'#cfd4da',1.3);
  var n=arr[k];for(var i=0;i<n;i++){var a=-PI/2+2*PI*i/n+(t||0)*(k%2?-1:1)*.004*(1+.3*k);k5_el(x+(r0+k*dr)*Math.cos(a),y+(r0+k*dr)*Math.sin(a),col||BLUE);}}
 if(sym)TB(sym,x,y+5,symCol||INK,Math.max(13,r0*.62));}
/* photon : ondulation entre deux points */
function k5_wave(x1,y1,x2,y2,col,amp,n,w){var L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,nx=-uy,ny=ux;ctx.strokeStyle=col;ctx.lineWidth=w||2.4;ctx.beginPath();
 for(var i=0;i<=60;i++){var s=i/60,o=amp*Math.sin(s*n*2*PI);var px=x1+ux*L*s+nx*o,py=y1+uy*L*s+ny*o;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
/* lumière visible : longueur d'onde → couleur */
function k5_rgb(nm){var r=0,g=0,b=0,f=1;
 if(nm>=380&&nm<440){r=-(nm-440)/60;b=1;}else if(nm<490){g=(nm-440)/50;b=1;}else if(nm<510){g=1;b=-(nm-510)/20;}
 else if(nm<580){r=(nm-510)/70;g=1;}else if(nm<645){r=1;g=-(nm-645)/65;}else if(nm<=780){r=1;}
 if(nm<420)f=.3+.7*(nm-380)/40;else if(nm>700)f=.3+.7*(780-nm)/80;
 return 'rgb('+Math.round(255*r*f)+','+Math.round(255*g*f)+','+Math.round(255*b*f)+')';}
function k5_spec(x,y,w,h,lines,dark){ /* bande 380-780 nm : continue (lines=null) ou raies */
 if(!lines){for(var i=0;i<w;i++){ctx.fillStyle=k5_rgb(380+400*i/w);ctx.fillRect(x+i,y,1.5,h);}}
 else{ctx.fillStyle='#14171c';ctx.fillRect(x,y,w,h);lines.forEach(function(l){var xx=x+(l-380)/400*w;ctx.fillStyle=k5_rgb(l);ctx.fillRect(xx-1.5,y,3,h);});}
 ctx.strokeStyle=INK;ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);}
/* échelle de cases quantiques : 1 case = (x,y), taille s, n électrons (0-2) */
function k5_qbox(x,y,s,n,col){k5_rr(x,y,s,s*1.15,n?'#eef4fb':'#fff',n?col||BLUE_D:AX,1.6,4);
 if(n>=1)A(x+s*.32,y+s*1.02,0,-s*.85,col||BLUE_D,'',1.8);if(n>=2)A(x+s*.68,y+s*.18,0,s*.85,col||BLUE_D,'',1.8);}
/* sous-couches dans l'ordre de remplissage, pour ne électrons */
var K5_SUBS=[['1s',1],['2s',1],['2p',3],['3s',1],['3p',3],['4s',1],['3d',5],['4p',3]];
function k5_fill(ne,subs){var out=[],left=ne;subs.forEach(function(s){var c=Math.min(left,s[1]*2);out.push(c);left-=c;});return out;}
function k5_orbs(x0,y,sz,ne,subs,col,gap,lab){ /* dessine les cases ; renvoie x de fin */
 var cnt=(ne instanceof Array)?ne:k5_fill(ne,subs),x=x0;
 subs.forEach(function(s,i){var nb=s[1],c=cnt[i];
  for(var b=0;b<nb;b++){var up=c>b?1:0,dn=c>nb+b?1:0;k5_qbox(x+b*(sz+2),y,sz,up+dn,col);}
  if(lab!==false)TB(s[0],x+(nb*(sz+2)-2)/2,y+sz*1.15+16,GREY,13);
  x+=nb*(sz+2)+(gap==null?12:gap);});
 return x;}
function k5_confStr(ne,subs){var cnt=(ne instanceof Array)?ne:k5_fill(ne,subs),o=[];subs.forEach(function(s,i){if(cnt[i])o.push(s[0]+k5_sup(cnt[i]));});return o.join(' ');}

/* niveaux de l'hydrogène : y de E(n) = -13,6/n² sur une échelle de 0 eV (yTop) à -13,6 eV (yBot) */
function k5_hy(yTop,yBot){return function(n){return yTop+(yBot-yTop)/(n*n);};}
function k5_hlevels(x,wd,Y,nmax,hl,col){ /* traits de niveaux n=1..nmax + n=infini */
 for(var n=1;n<=nmax;n++){var on=hl&&hl.indexOf(n)>=0;LN(x,Y(n),x+wd,Y(n),on?(col||BLUE_D):GREY,on?3:1.6);
  if(n<=3||on){TB('n = '+n,x-8,Y(n)+4,on?(col||BLUE_D):GREY,13,'right');
   var E=-13.6/(n*n);T((E.toFixed(2)).replace('.',',')+' eV',x+wd+6,Y(n)-6,on?(col||BLUE_D):GREY,11,'left');}}
 LN(x,Y(1e6),x+wd,Y(1e6),AX,1.4,[5,4]);TB('0',x-8,Y(1e6)+4,GREY,12,'right');}
var K5_SYM="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr".split(" ");
function k5_cnt(Z){var c=k5_fill(Z,K5_SUBS);if(Z===24){c=k5_fill(24,K5_SUBS);c[5]=1;c[6]=5;}if(Z===29){c=k5_fill(29,K5_SUBS);c[5]=1;c[6]=10;}return c;}

SFA.theo("c01", {
 icon: function () {
  TB('1s² 2s² 2p⁶',W*.5,H*.42,BLUE_D,32);
  k5_shells(W*.5,H*.74,22,17,[2,8],BLUE,'Ne',0,INK);
  TB('Lewis',W*.2,H*.78,ORANGE,18);TB('octet',W*.8,H*.78,ORANGE,18);},
 anim: function (t) {
  var Z=Math.min(36,1+Math.floor(t/26)%44);var cnt=k5_cnt(Z);
  var sz=Math.max(14,Math.min(24,(W-40-7*10)/18-2)),tot=18*(sz+2)+7*10-2,x0=(W-tot)/2,y=H*.30;
  TB('Z = '+Z+'   '+K5_SYM[Z-1],W*.5,H*.12,BLUE_D,Math.min(22,W*.04));
  k5_orbs(x0,y,sz,cnt,K5_SUBS,BLUE_D,10);
  var cf=k5_confStr(cnt,K5_SUBS);TB(cf,W*.5,H*.68,INK,Math.min(20,W*.032));
  /* électrons de valence = couche de plus grand n */
  var nmax=0,nv=0;K5_SUBS.forEach(function(s,i){if(cnt[i]){var n=+s[0][0];if(n>nmax)nmax=n;}});
  K5_SUBS.forEach(function(s,i){if(cnt[i]&&+s[0][0]===nmax&&s[0][1]!=='d')nv+=cnt[i];});
  if(Z>=19&&Z<=30){K5_SUBS.forEach(function(s,i){if(s[0]==='3d')nv+=0;});}
  var Zn=Z>=21&&Z<=30;
  TB(Zn?'métal de transition : on remplit 3d après 4s':'couche externe n = '+nmax+' : '+nv+' électron'+(nv>1?'s':'')+' de valence',W*.5,H*.82,ORANGE,Math.min(16,W*.026));
  TB('l\'ordre de remplissage : 1s 2s 2p 3s 3p 4s 3d 4p',W*.5,H*.94,GREY,13);},
 th: '<div class="tcard"><b class="h">Couches, sous-couches et ordre de remplissage</b><p>Les électrons d\'un atome occupent des <b>couches</b> (n = 1, 2, 3…) divisées en <b>sous-couches</b> s, p, d. Une case quantique (orbitale) accueille <b>au plus 2 électrons</b> de spins opposés (principe de Pauli) : s = 1 case = 2 e⁻ ; p = 3 cases = 6 e⁻ ; d = 5 cases = 10 e⁻.</p><p>Ordre de remplissage : <b>1s 2s 2p 3s 3p 4s 3d 4p</b>. Attention, 4s se remplit <i>avant</i> 3d. Dans une sous-couche, on place d\'abord un électron par case (règle de Hund) avant d\'apparier.</p><p>Exceptions à connaître : <b>Cr</b> (4s¹ 3d⁵) et <b>Cu</b> (4s¹ 3d¹⁰), car une sous-couche d à moitié ou entièrement pleine est plus stable.</p></div><div class="tcard"><b class="h">Période et électrons de valence</b><p>La <b>période</b> est le plus grand n occupé. Les <b>électrons de valence</b> sont ceux de la couche externe (n le plus grand) ; ce sont eux qui font les liaisons. Pour les groupes 13 à 18 : électrons de valence = numéro du groupe − 10.</p><p><i>Exemple :</i> le soufre (Z = 16) : 1s² 2s² 2p⁶ 3s² 3p⁴. Total 2 + 2 + 6 + 2 + 4 = 16 ✔. Plus grand n = 3 : période 3, et 2 + 4 = 6 électrons de valence.</p></div><div class="tcard"><b class="h">Schéma de Lewis et règle de l\'octet</b><p>Dans le <b>schéma de Lewis</b> d\'un atome, on écrit le symbole entouré de ses électrons de valence par paires (<b>doublets</b>) et seuls (<b>électrons célibataires</b>). Un atome cherche à avoir <b>8 électrons</b> sur sa couche externe (2 pour H et He) : c\'est la règle de l\'<b>octet</b>.</p><p>Nombre de liaisons covalentes d\'un non-métal = 8 − (électrons de valence) : Cl (7 e⁻) → 1 liaison ; O (6 e⁻) → 2 ; N (5 e⁻) → 3 ; C (4 e⁻) → 4.</p><p>Un cation a perdu des électrons, un anion en a gagné : <b>Mg²⁺ et O²⁻ ont tous deux 10 électrons</b>, comme le néon (ions isoélectroniques).</p></div><div class="tcard"><b class="h">Niveaux d\'énergie et spectres de raies</b><p>L\'énergie de l\'électron est <b>quantifiée</b> : seules certaines valeurs sont permises. Pour l\'hydrogène : <b>E(n) = −13,6 eV / n²</b>. Quand l\'électron descend de n<sub>i</sub> à n<sub>f</sub>, il émet un photon d\'énergie <b>ΔE = E(n<sub>i</sub>) − E(n<sub>f</sub>)</b>, de longueur d\'onde <b>λ = 1240 / ΔE</b> (λ en nm, ΔE en eV).</p><p><i>Exemple :</i> 4 → 2 : ΔE = 13,6 × (1/2² − 1/4²) = 2,55 eV, λ = 1240 / 2,55 ≈ 486 nm (visible, bleu-vert). Seules quelques énergies existent : on observe des <b>raies</b> et non un arc-en-ciel continu.</p><p>Piège : plus la longueur d\'onde est grande, plus l\'énergie du photon est petite (on divise par λ, on ne multiplie pas).</p></div>'
});

SFA.figs("c01", [
 /* 0 · configuration du soufre */
 function (p) {
  var subs=K5_SUBS.slice(0,5),sz=Math.max(18,Math.min(30,(W-30-4*12)/9-2)),tot=9*(sz+2)+4*12-2,x0=(W-tot)/2,y=H*.30;
  var ne=Math.round(16*k5_seg(p,0,.8));
  TB('Z = 16 : 16 électrons à placer',W*.5,H*.12,BLUE_D,17);
  var xe=k5_orbs(x0,y,sz,ne,subs,BLUE_D,12);
  var cf=ne?k5_confStr(ne,subs):'1s  2s  2p  3s  3p';
  TB(cf,W*.5,H*.66,INK,Math.min(20,W*.045));
  if(p>.8){var a=k5_seg(p,.8,1);ctx.globalAlpha=a;var xs=x0+(sz+2)*5+12*3;
   LN(xs,y-10,x0+tot,y-10,ORANGE,3);
   TB('6 e⁻ de valence (n = 3)',(xs+x0+tot)/2,y-18,ORANGE,14);
   TB('période 3',W*.5,H*.92,DGREEN,16);ctx.globalAlpha=1;}
 },
 /* 1 · Lewis du chlore */
 function (p) {
  var cx=W*.3,cy=H*.5;
  k5_shells(cx,cy,26,20,[2,8,7],BLUE,'Cl',0,INK);
  TB('Cl : Z = 17',cx,H*.14,BLUE_D,16);TB('2 · 8 · 7',cx,H*.9,GREY,14);
  var lx=W*.72,ly=H*.5,r=42;
  TB('Cl',lx,ly+9,INK,30);
  var pos=[[0,-1],[1,0],[0,1],[-1,0]];  /* 4 côtés */
  var n=Math.round(7*k5_seg(p,0,.7)),k=0;
  for(var s=0;s<4;s++){for(var j=0;j<2;j++){if(k>=n){k++;continue;}var off=j?7:-7;
    var dx=pos[s][0]?pos[s][0]*r:off,dy=pos[s][1]?pos[s][1]*r:off;
    var single=(s===1&&j===1);DOT(lx+dx,ly+dy,5,single?RED:BLUE);k++;}}
  if(p<=0){TB('?',lx,ly-r-6,GREY,22);}
  if(p>.7){var a=k5_seg(p,.7,1);ctx.globalAlpha=a;TB('3 doublets + 1 e⁻ seul',lx,H*.9,DRED,15);
   TB('→ 1 liaison',lx+r+30,ly-26,DGREEN,15);ctx.globalAlpha=1;}
  TB('Lewis',lx,H*.14,BLUE_D,16);
 },
 /* 2 · isoélectroniques */
 function (p) {
  var xs=[W*.2,W*.8],ys=H*.45;
  /* Mg : 12 e -> Mg2+ (2,8) ; O : 8 e -> O2- (2,8) */
  var a=k5_seg(p,0,.6);
  k5_shells(xs[0],ys,16,17,[2,8,2*(1-a)],BLUE,'',0);TB(a<.5?'Mg':'Mg²⁺',xs[0],ys+5,a<.5?INK:DRED,15);
  k5_shells(xs[1],ys,16,17,[2,6+Math.round(2*a)],RED,'',0);TB(a<.5?'O':'O²⁻',xs[1],ys+5,a<.5?INK:BLUE_D,15);
  TB('Z = 12',xs[0],H*.12,BLUE_D,15);TB('Z = 8',xs[1],H*.12,DRED,15);
  if(p>0){ctx.globalAlpha=a;A(xs[0]+55,ys-60,70,-6,DRED,'',2);TB('perd 2 e⁻',xs[0]+100,ys-76,DRED,13);
   A(xs[1]-55,ys-60,-70,-6,BLUE_D,'',2);TB('gagne 2 e⁻',xs[1]-100,ys-76,BLUE_D,13);ctx.globalAlpha=1;}
  var b=k5_seg(p,.6,1);ctx.globalAlpha=b;
  k5_rr(W*.36,H*.33,W*.28,H*.28,'#e8f7f1',GREEN,2);TB('10 électrons',W*.5,H*.46,DGREEN,16);TB('1s² 2s² 2p⁶',W*.5,H*.56,DGREEN,15);
  TB('comme le néon',W*.5,H*.9,DGREEN,16);ctx.globalAlpha=1;
  TB('2 · 8 · 2',xs[0],H*.88,GREY,13);TB('2 · 6',xs[1],H*.88,GREY,13);
 },
 /* 3 · raie 4 -> 2 */
 function (p) {
  var Y=k5_hy(H*.1,H*.88),x=W*.18,wd=W*.34;
  k5_hlevels(x,wd,Y,5,[4,2],BLUE_D);
  var a=k5_seg(p,0,.5);
  var xa=x+wd*.5;
  A(xa,Y(4)+3,0,(Y(2)-Y(4)-14)*Math.max(.001,a),RED,'',3);
  if(p>.5){var b=k5_seg(p,.5,1);ctx.globalAlpha=b;k5_wave(xa+10,Y(2)+8,W*.9,Y(2)+80,k5_rgb(486),8,5,3.2);
   TB('ΔE = 2,55 eV',W*.76,H*.80,DRED,17);TB('λ ≈ 486 nm',W*.76,H*.93,BLUE_D,18);ctx.globalAlpha=1;}
  else{TB('n = 4 → n = 2 : quel photon ?',W*.72,H*.4,GREY,15);}
 },
 /* 4 · potassium */
 function (p) {
  var subs=K5_SUBS.slice(0,7),names=subs.map(function(s){return s[0];});
  var ne=Math.round(19*k5_seg(p,0,.85));var cnt=k5_fill(ne,subs);
  /* échelle d'énergie : 1s en bas, 3d tout en haut (au-dessus de 4s) */
  var order=[0,1,2,3,4,5,6],ys=[.88,.74,.62,.48,.37,.24,.14];
  var xl=W*.2,xr=W*.62;
  subs.forEach(function(s,i){var y=H*ys[i],full=cnt[i]===s[1]*2;
   LN(xl,y,xr,y,cnt[i]?BLUE_D:AX,cnt[i]?3:2);TB(s[0],xl-10,y+5,INK,15,'right');
   for(var e=0;e<cnt[i];e++)DOT(xl+14+e*(xr-xl-24)/Math.max(1,s[1]*2-1)*(s[1]*2>1?1:0)+ (s[1]*2===1?(xr-xl)/2:0),y-10,5,BLUE);
   if(cnt[i])TB(s[0]+k5_sup(cnt[i]),xr+12,y+5,full?GREY:DRED,15,'left');});
  A(W*.9,H*.88,0,-H*.7,GREY,'',2);TB('énergie',W*.9,H*.97,GREY,13);
  if(p>.85){var a=k5_seg(p,.85,1);ctx.globalAlpha=a;TB('le 19ᵉ e⁻ va en 4s, pas en 3d',W*.62,H*.06,DRED,14);ctx.globalAlpha=1;}
 },
 /* 5 · photon sodium 589 nm */
 function (p) {
  var x=W*.08,w=W*.84,y=H*.38,h=H*.2;
  TB('lumière visible',W*.5,H*.14,INK,16);
  k5_spec(x,y,w,h,null);
  [[380,'380 nm'],[500,'500'],[600,'600'],[700,'700'],[780,'780']].forEach(function(l){var xx=x+(l[0]-380)/400*w;LN(xx,y+h,xx,y+h+6,GREY,1.2);TB(l[1],xx,y+h+22,GREY,13);});
  var xs=x+(589-380)/400*w;
  A(xs,y-6,0,-6,INK,'',1);
  LN(xs,y-2,xs,y+h+4,INK,3);TB('589 nm',xs,y-12,INK,15);
  if(p>0){var a=k5_seg(p,0,.7);ctx.globalAlpha=a;
   TB('ΔE = 1240 / 589',W*.5,H*.8,DRED,18);
   ctx.globalAlpha=k5_seg(p,.5,1);TB('≈ 2,1 eV   (jaune-orangé)',W*.5,H*.92,DGREEN,18);ctx.globalAlpha=1;}
  else TB('énergie du photon ?',W*.5,H*.85,GREY,17);
 },
 /* 6 · cuivre */
 function (p) {
  var sz=Math.min(36,W*.07),y=H*.38,xs=W*.1,xd=xs+sz*2.3;
  TB('Cu : Z = 29',W*.5,H*.1,BLUE_D,17);
  var m=k5_seg(p,0,.7); /* un e- passe de 4s vers 3d */
  var n4=2-(m>.5?1:0),n3=9+(m>.5?1:0);
  k5_qbox(xs,y,sz,n4,BLUE_D);TB('4s',xs+sz/2,y+sz*1.15+18,GREY,14);
  for(var b=0;b<5;b++){var c=n3,up=c>b?1:0,dn=c>5+b?1:0;k5_qbox(xd+b*(sz+3),y,sz,up+dn,BLUE_D);}
  TB('3d',xd+(5*(sz+3)-3)/2,y+sz*1.15+18,GREY,14);
  if(p>0&&p<.8){var ax=xs+sz*.5,bx=xd+4*(sz+3)+sz*.5;ctx.strokeStyle=RED;ctx.lineWidth=2.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(ax,y-8);ctx.quadraticCurveTo((ax+bx)/2,y-60,bx,y-8);ctx.stroke();ctx.setLineDash([]);}
  TB(p<.35?'attendu : 4s² 3d⁹':'observé : 4s¹ 3d¹⁰',W*.5,H*.78,p<.35?GREY:DGREEN,18);
  if(p>.7){ctx.globalAlpha=k5_seg(p,.7,1);TB('3d pleine = plus stable · 1 e⁻ célibataire (4s)',W*.5,H*.92,ORANGE,14);ctx.globalAlpha=1;}
 },
 /* 7 · pourquoi des raies */
 function (p) {
  var x=W*.1,w=W*.8,h=H*.18;
  TB('lampe à incandescence',W*.5,H*.1,GREY,14);k5_spec(x,H*.14,w,h,null);
  TB('hydrogène excité',W*.5,H*.5,INK,14);
  var a=k5_seg(p,0,.6);
  k5_spec(x,H*.54,w,h,[410,434,486,656]);
  if(p<=0){ctx.fillStyle='rgba(20,23,28,.9)';ctx.fillRect(x+2,H*.54+2,w-4,h-4);TB('?',W*.5,H*.54+h*.7,'#fff',26);}
  else{[[410,'410'],[434,'434'],[486,'486'],[656,'656 nm']].forEach(function(l){var xx=x+(l[0]-380)/400*w;ctx.globalAlpha=a;TB(l[1],xx,H*.54+h+(l[0]===434?38:20),INK,13);ctx.globalAlpha=1;});
   ctx.globalAlpha=k5_seg(p,.4,1);TB('niveaux d\'énergie quantifiés → quelques photons seulement',W*.5,H*.92,DGREEN,14);ctx.globalAlpha=1;}
 },
 /* 8 · quel est cet élément */
 function (p) {
  k5_shells(W*.17,H*.45,12,15,[2,8,8],BLUE,'',0);TB('X²⁺',W*.17,H*.45+5,INK,14);
  TB('18 e⁻',W*.17,H*.88,BLUE_D,15);
  var a=k5_seg(p,0,.4);ctx.globalAlpha=a;
  A(W*.3,H*.45,W*.12,0,DRED,'',2.4);TB('+ 2 e⁻',W*.36,H*.38,DRED,14);
  k5_shells(W*.55,H*.45,12,15,[2,8,8,2],BLUE,'',0);TB('Ca',W*.55,H*.45+5,INK,14);TB('Z = 20',W*.55,H*.9,DGREEN,15);
  ctx.globalAlpha=1;
  var b=k5_seg(p,.5,1);ctx.globalAlpha=b;
  k5_rr(W*.7,H*.22,W*.27,H*.52,'#e8f7f1',GREEN,2);
  TB('Ca²⁺ + 2 Cl⁻',W*.835,H*.38,DGREEN,15);TB('CaCl₂',W*.835,H*.54,DGREEN,24);TB('2 × (−1) + 2 = 0',W*.835,H*.68,GREY,13);ctx.globalAlpha=1;
  if(p<=0)TB('?',W*.55,H*.45+10,GREY,34);
 },
 /* 9 · raie 434 nm */
 function (p) {
  var Y=k5_hy(H*.1,H*.88),x=W*.14,wd=W*.3;
  k5_hlevels(x,wd,Y,6,p>0?[5,2]:[2],BLUE_D);
  var a=k5_seg(p,0,.5);
  if(p>0)A(x+wd*.5,Y(5)+3,0,(Y(2)-Y(5)-14)*Math.max(.001,a),RED,'',3);
  var sx=W*.62,sw=W*.34;
  TB('raie violette',sx+sw/2,H*.2,INK,15);
  k5_spec(sx,H*.28,sw,H*.14,[410,434,486,656]);
  var xx=sx+(434-380)/400*sw;LN(xx,H*.24,xx,H*.46,YEL,2);
  TB('434 nm',xx,H*.55,VIOLET,15);
  if(p>.5){ctx.globalAlpha=k5_seg(p,.5,1);TB('ΔE = 1240 / 434 ≈ 2,86 eV',sx+sw/2,H*.72,DRED,15);TB('5 → 2',sx+sw/2,H*.86,DGREEN,22);ctx.globalAlpha=1;}
 }
]);
