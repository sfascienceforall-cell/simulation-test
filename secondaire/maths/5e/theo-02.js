/* Maths 5e · chapitre 2 · suites */
function m5_bar(c,x,w,v,col,base,a){base=base||0;var x1=c.X(x-w/2),x2=c.X(x+w/2),y1=c.Y(v),y2=c.Y(base);ctx.globalAlpha=a==null?1:a;ctx.fillStyle=col+'33';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.rect(x1,y1,x2-x1,y2-y1);ctx.fill();ctx.stroke();ctx.globalAlpha=1;}
function m5_fr(v,d){var x=(+v).toFixed(d==null?2:d);if(x.indexOf('.')>=0)x=x.replace(/0+$/,'').replace(/\.$/,'');return nfmt(x);}
function m5_eur(v){return String(v.toFixed(2)).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,' ');}

SFA.theo("c02", {
 icon: function () { TB('uₙ = u₀ + n·r', W*.5, H*.36, BLUE_D, 28); TB('uₙ = u₀ · qⁿ', W*.5, H*.58, ORA2, 28); TB('suites', W*.5, H*.8, ORANGE, 17); },
 anim: function (t) {
  var n=Math.floor((t/28)%11);if(n>9)n=9;
  var pw=W*.46,top=34,hb=H-30,k=(hb-top-14)/12.5;
  [[0,'Arithmétique : +1,5 à chaque pas',BLUE,function(i){return 1+1.5*i;},'+1,5'],[1,'Géométrique : ×1,4 à chaque pas',ORA2,function(i){return Math.pow(1.4,i)*1;},'×1,4']].forEach(function(P){
   var x0=W*.03+P[0]*W*.5,bw=pw/11;LN(x0,hb,x0+pw,hb,'#aab0b6',1.5);TB(P[1],x0+pw/2,22,dk(P[2]),W<560?13:15);
   for(var i=0;i<=9;i++){if(i>n)continue;var v=P[3](i),bx=x0+8+i*bw*1.08;
    ctx.fillStyle=P[2]+'33';ctx.strokeStyle=P[2];ctx.lineWidth=2;ctx.beginPath();ctx.rect(bx,hb-v*k,bw*.8,v*k);ctx.fill();ctx.stroke();
    if(i===n&&i>0){var pv=P[3](i-1);TB(P[4],bx-bw*.25,hb-Math.max(v,pv)*k-8,dk(P[2]),14);}
    if(i>=n-1||i===0)TB(m5_fr(v,1),bx+bw*.4,hb-v*k-(i===n&&i>0?26:8),INK,12);
    TB('u'+i,bx+bw*.4,hb+14,GREY,11);}
  });
 },
 th: "<div class='tcard'><b class='h'>Suites arithmétiques</b><p>On ajoute toujours la <b>raison r</b> : uₙ₊₁ = uₙ + r. Terme général : <b>uₙ = u₀ + n·r</b>, ou plus généralement uₙ = uₚ + (n − p)·r. Le graphe est formé de points alignés.</p><p><b>Exemple.</b> u₀ = 4, r = 3 : uₙ = 4 + 3n, donc u₁₀ = 34.</p></div>"
 +"<div class='tcard'><b class='h'>Suites géométriques</b><p>On multiplie toujours par la <b>raison q</b> : uₙ₊₁ = q·uₙ. Terme général : <b>uₙ = u₀·qⁿ</b> (ou uₙ = uₚ·qⁿ⁻ᵖ). Si q > 1 la suite explose, si 0 < q < 1 elle tend vers 0 ; si q < 0 elle alterne de signe.</p><p><b>Exemple.</b> u₀ = 5, q = 2 : u₆ = 5·2⁶ = 320.</p></div>"
 +"<div class='tcard'><b class='h'>Sommes</b><p>Arithmétique : <b>S = (nombre de termes) × (premier + dernier)/2</b>. Pour u₀ … uₙ il y a n + 1 termes : S = (n + 1)(u₀ + uₙ)/2.</p><p>Géométrique (q ≠ 1) : <b>S = (premier terme) × (1 − qᴺ)/(1 − q)</b>, où N est le nombre de termes : u₀ + … + uₙ = u₀(1 − qⁿ⁺¹)/(1 − q).</p><p><b>Exemple.</b> 1 + 4 + 7 + … + 88 : 30 termes, donc S = 30 × 89/2 = 1 335.</p></div>"
 +"<div class='tcard'><b class='h'>Applications financières</b><p>Intérêts <b>simples</b> au taux t : le capital augmente de C₀·t chaque année, donc Cₙ = C₀(1 + n·t) (suite arithmétique). Intérêts <b>composés</b> : Cₙ = C₀(1 + t)ⁿ (suite géométrique).</p><p><b>Exemple.</b> 2 000 € à 3 % pendant 5 ans : 2 000 × 1,03⁵ ≈ 2 318,55 €. Une hausse de 10 % puis une baisse de 10 % donne ×1,1 × 0,9 = ×0,99 : −1 % au total.</p></div>"
 +"<div class='tcard'><b class='h'>Pièges et limite</b><p>Compte bien les termes : si la suite commence à u₁, u₁₀ = u₁ + 9r (et non 10r). Une baisse de t % se traduit par ×(1 − t). Limite : (q)ⁿ → +∞ si q > 1, → 0 si |q| < 1. Un emprunt rembourse par annuités A : Dₖ = 1,06·Dₖ₋₁ − A. (6 h : démonstration par récurrence.)</p></div>"
});

SFA.figs("c02", [
 /* 0 */
 function (p) {
  var c=m5_G(-.7,10.9,0,38,{st:1,sy:5,lbx:2,lby:10,top:34});m5_cap('uₙ = 4 + 3n',BLUE_D);
  for(var i=0;i<=10;i++){var v=4+3*i;m5_pt(c,i,v,i===10&&p>0?RED:BLUE,i===10&&p>0?7:5);if(i>0&&i<10&&p<=0)m5_sg(c,i-1,4+3*(i-1),i,v,'#9bbfe8',1.3);}
  m5_sg(c,0,4,10,34,'#9bbfe8',1.4,[4,4]);m5_t(c,'+3',1.6,8.5,BLUE_D,13);m5_t(c,'u₀ = 4',.4,2,BLUE_D,12,'left');
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_t(c,'u₁₀ = 34',9.9,38,DRED,14,'right');ctx.globalAlpha=1;}
 },
 /* 1 */
 function (p) {
  var c=m5_G(-.7,6.9,0,350,{st:1,sy:50,lbx:1,lby:100,top:34,left:34});m5_cap('uₙ = 5·2ⁿ',ORA2);
  for(var i=0;i<=6;i++){var v=5*Math.pow(2,i);m5_bar(c,i,.62,v,i===6&&p>0?RED:ORA2);if(i<6||p>0)m5_t(c,m5_fr(v,0),i,v+16,INK,11);}
  m5_t(c,'×2',2.6,150,ORA2,14);m5_sg(c,1.6,40,3.4,40,ORA2,1.2);
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_tag(c,'u₆ = 320',3.6,300,DRED,15);ctx.globalAlpha=1;}
 },
 /* 2 décalage d'indice */
 function (p) {
  m5_cap('r = 4 ; premier terme u₁ = 7',BLUE_D);var y=H*.52,x0=W*.08,dx=(W*.84)/9;
  LN(x0-12,y,x0+9*dx+12,y,'#c8ccd0',1.5);
  for(var i=1;i<=10;i++){var x=x0+(i-1)*dx,v=7+4*(i-1),on=p>0||i<3;DOT(x,y,11,i===10&&p>0?RED:BLUE);TB('u'+String(i).replace(/./g,function(d){return '₀₁₂₃₄₅₆₇₈₉'[+d];}),x,y+34,GREY,13);
   if(on||i===1){TB(String(v),x,y-20,i===10&&p>0?DRED:BLUE_D,i===10?18:14);}}
  var q=m5_fd(p,0,.8);for(var i=1;i<10;i++){if(q>(i-1)/9){var xa=x0+(i-1)*dx;ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.beginPath();ctx.arc(xa+dx/2,y,dx/2,PI,0);ctx.stroke();}}
  if(p>0.1){TB('+4  ×  9 pas',W*.5,H*.82,ORA2,17);TB('u₁₀ = 7 + 9·4 = 43',W*.5,H*.93,DRED,17);}else{TB('u₁₀ = ?',W*.5,H*.85,GREY,17);}
 },
 /* 3 somme arithmétique */
 function (p) {
  m5_cap('1 + 4 + 7 + … + 88',BLUE_D);var n=30,x0=W*.07,bw=(W*.58)/n,hb=H-26,k=(H-80)/89,q=m5_fd(p,0,.6);
  LN(x0,hb,x0+n*bw,hb,'#aab0b6',1.5);
  for(var i=0;i<n;i++){var h=1+3*i;ctx.fillStyle=BLUE+'55';ctx.fillRect(x0+i*bw,hb-h*k,bw-1,h*k);
   if(q>0){var h2=89-h;ctx.fillStyle=ORA2+'55';ctx.fillRect(x0+i*bw,hb-89*k+ (1-q)*(h*k+30)*0,bw-1,h2*k*q);}}
  if(q>0){ctx.globalAlpha=q;ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.strokeRect(x0,hb-89*k,n*bw,89*k);ctx.globalAlpha=1;}
  var tx=W*.72;TB('30 termes',tx,H*.38,BLUE_D,17,'left');TB('1 + 88 = 89',tx,H*.38+26,ORA2,17,'left');
  if(q>=1){TB('S = 30 × 89 ÷ 2',tx,H*.7,DRED,17,'left');TB('= 1 335',tx,H*.7+28,DRED,22,'left');}
 },
 /* 4 retrouver une géométrique */
 function (p) {
  var c=m5_G(-.7,5.9,0,110,{st:1,sy:20,lbx:1,lby:40,top:34});m5_cap('u₂ = 12 ; u₅ = 96',BLUE_D);
  var u=[3,6,12,24,48,96];
  for(var i=0;i<=5;i++){var hi=i===2||i===5;m5_bar(c,i,.62,u[i],hi?BLUE:'#9aa7b8',0,(i<2&&p<=0)?.25:1);if(hi||p>0)m5_t(c,String(u[i]),i,u[i]+7,hi?BLUE_D:GREY,12);}
  m5_t(c,'u₂',2,-10,BLUE_D,12);m5_t(c,'u₅',5,-10,BLUE_D,12);
  m5_t(c,'×q³ = ×8',3.5,100,ORA2,14);m5_sg(c,2,92,5,92,ORA2,2);
  var q=m5_fd(p,0,.6);if(q>0){ctx.globalAlpha=q;m5_tag(c,'q = 2 ; u₀ = 3',1.3,70,DRED,14);m5_tag(c,'S₀…₉ = 3 069',1.6,46,DGREEN,13);ctx.globalAlpha=1;}
 },
 /* 5 capital */
 function (p) {
  var c=m5_G(-.7,5.9,0,2600,{st:1,sy:500,lbx:1,lby:1000,top:34,left:44});m5_cap('2 000 € à 3 % composés',BLUE_D);
  var q=m5_fd(p,0,.7);
  for(var i=0;i<=5;i++){var v=2000*Math.pow(1.03,i);m5_bar(c,i,.62,2000,BLUE,0);if(q>0&&i>0){ctx.globalAlpha=q;ctx.fillStyle=ORA2+'99';var y1=c.Y(v),y2=c.Y(2000);ctx.fillRect(c.X(i-.31),y1,c.X(i+.31)-c.X(i-.31),(y2-y1)*Math.min(1,q*1.2));ctx.globalAlpha=1;}
   if(i===5)m5_t(c,q>0?'2 318,55 €':'?',i,2000*Math.pow(1.03,5)+190,q>0?DRED:GREY,13);}
  m5_t(c,'capital',.5,1000,BLUE_D,12);if(q>0)m5_tag(c,'intérêts',3.2,2420,DRED,12);
 },
 /* 6 population */
 function (p) {
  var c=m5_G(0,12.8,48000,64000,{st:1,sy:2000,lbx:2,lby:4000,top:34,left:58});m5_cap('Pₙ = 50 000 · 1,02ⁿ',BLUE_D);
  m5_sg(c,0,60000,12.8,60000,GREY,1.5,[6,4]);m5_t(c,'60 000',.1,60500,GREY,12,'left');
  m5_fn(c,function(x){return 50000*Math.pow(1.02,x);},0,12.4,'#9bbfe8',2);
  for(var i=0;i<=12;i++){var v=50000*Math.pow(1.02,i),hi=p>0&&i===10;if(p>0&&i===9){m5_pt(c,i,v,GREY,5);continue;}m5_pt(c,i,v,hi?RED:BLUE,hi?7:4.5);}
  var q=m5_fd(p,0,.5);if(q>0){ctx.globalAlpha=q;m5_tag(c,'n = 10 : 60 950 hab.',8.6,52300,DRED,12);m5_tag(c,'n = 9 : 59 754',8.1,49800,GREY,11);ctx.globalAlpha=1;}
 },
 /* 7 +10 % -10 % */
 function (p) {
  var c=m5_G(-.6,3.2,0,125,{st:1,sy:25,lbx:5,lby:50,top:34});m5_cap('+10 % puis −10 %',INK);
  var q=m5_fd(p,0,.6);m5_bar(c,.4,.7,100,BLUE);m5_bar(c,1.5,.7,110,GREEN);if(q>0)m5_bar(c,2.6,.7,99,RED,0,q);
  m5_t(c,'100',.4,108,BLUE_D,13);m5_t(c,'110',1.5,118,DGREEN,13);m5_t(c,'×1,1',.95,70,GREEN,14);
  if(q>0){ctx.globalAlpha=q;m5_t(c,'99',2.6,107,DRED,15);m5_t(c,'×0,9',2.05,35,DRED,14);m5_tag(c,'−1 %',2.6,60,DRED,16);ctx.globalAlpha=1;}
  else m5_t(c,'?',2.6,60,GREY,22);
 },
 /* 8 emprunt */
 function (p) {
  var A=10000*.06/(1-Math.pow(1.06,-4)),D=[10000],i;for(i=1;i<=4;i++)D.push(D[i-1]*1.06-A);
  var c=m5_G(-.7,4.7,0,11500,{st:1,sy:2500,lbx:1,lby:5000,top:34,left:48});m5_cap('10 000 € à 6 % en 4 annuités',BLUE_D);
  var q=m5_fd(p,0,.8);
  for(i=0;i<=4;i++){var vis=i===0||q>=i/4;if(!vis)continue;var v=Math.max(0,D[i]);m5_bar(c,i,.6,i===4?60:v,i===4?GREEN:BLUE);m5_t(c,i===4?'0':m5_fr(v,0).replace(/\s/g,' '),i,(i===4?60:v)+650,i===4?DGREEN:BLUE_D,12);m5_t(c,'D'+'₀₁₂₃₄'[i],i,-900,GREY,12);}
  if(q>0){ctx.globalAlpha=q;m5_tag(c,'A ≈ '+m5_eur(A)+' €',2.5,9800,DRED,14);ctx.globalAlpha=1;}
  else m5_t(c,'A = ?',2.5,9800,GREY,16);
 },
 /* 9 nombres impairs */
 function (p) {
  m5_cap('1 + 3 + 5 + 7 + 9 = ?',BLUE_D);var n=5,s=Math.min(H-70,W*.5)/n,x0=W*.1,y0=H-18-n*s,cols=[BLUE,ORA2,GREEN,VIOLET,RED],q=m5_fd(p,0,.7);
  for(var k=0;k<n;k++){for(var i=0;i<=k;i++){for(var j=0;j<=k;j++){if(i<k&&j<k)continue;
    ctx.fillStyle=cols[k]+'44';ctx.strokeStyle=cols[k];ctx.lineWidth=1.5;ctx.beginPath();ctx.rect(x0+i*s,y0+(n-1-j)*s,s,s);ctx.fill();ctx.stroke();}}
   TB(String(2*k+1),x0+(k+.5)*s,y0+(n-1-k+.62)*s,dk(cols[k]),s>34?20:16);}
  var tx=W*.1+n*s+26;TB('couche k : 2k − 1 carrés',tx,H*.36,INK,15,'left');
  if(q>0){ctx.globalAlpha=q;TB('5 × 5 = 25 = 5²',tx,H*.56,DRED,18,'left');TB('1 + 3 + … + (2n − 1) = n²',tx,H*.7,DGREEN,16,'left');TB('n² = 2 025 ⇒ n = 45',tx,H*.84,DGREEN,16,'left');ctx.globalAlpha=1;}
 }
]);
