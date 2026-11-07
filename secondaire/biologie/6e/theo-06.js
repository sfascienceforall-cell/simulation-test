/* SFA · Biologie 6e · théorie animée et devantures (chapitre 06) */
(function(){
/* aides locales (portée de ce fichier) */
function sg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ga(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function g1(){ctx.globalAlpha=1;}
function F(fn){return function(p){ctx.save();var s=Math.min(W/460,H/280);ctx.translate((W-460*s)/2,(H-280*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(p||0);ctx.restore();};}
function G(fn){return function(t){ctx.save();var s=Math.min(W/700,H/300);ctx.translate((W-700*s)/2,(H-300*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(t||0);ctx.restore();};}
function box(x,y,w,h,col,fill,r,lw){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||AX;ctx.lineWidth=lw||2;ctx.beginPath();ctx.roundRect(x,y,w,h,r===undefined?8:r);ctx.fill();ctx.stroke();}
function ell(x,y,rx,ry,fill,st,lw,rot){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(st){ctx.strokeStyle=st;ctx.lineWidth=lw||2;ctx.stroke();}}
function chk(x,y,c,s){s=s||9;ctx.strokeStyle=c||DGREEN;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*.3,y+s*.7);ctx.lineTo(x+s,y-s*.8);ctx.stroke();}
function crs(x,y,c,s){s=s||8;ctx.strokeStyle=c||DRED;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y+s);ctx.moveTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.stroke();}
/* texte avec exposant : base puis petit texte relevé */
function sup(base,s,x,y,col,size,al){size=size||14;ctx.font='700 '+size+'px system-ui';var w1=ctx.measureText(base).width;ctx.font='700 '+(size*.62)+'px system-ui';var w2=ctx.measureText(s).width;
 var x0=al==='left'?x:al==='right'?x-w1-w2:x-(w1+w2)/2;ctx.fillStyle=col||INK;ctx.textAlign='left';ctx.font='700 '+size+'px system-ui';ctx.fillText(base,x0,y);ctx.font='700 '+(size*.62)+'px system-ui';ctx.fillText(s,x0+w1+1,y-size*.38);}
/* échiquier de Punnett : colonnes cx[], lignes, cases remplies selon p */
function pun(x,y,cw,top,side,cells,cols,pp,size){var n=top.length,m=side.length;size=size||17;
 for(var i=0;i<n;i++)TB(top[i],x+cw*(i+1.5),y+cw*.62,BLUE_D,size);
 for(var j=0;j<m;j++)TB(side[j],x+cw*.5,y+cw*(j+1)+cw*.62,DRED,size);
 for(var j=0;j<m;j++)for(var i=0;i<n;i++){var k=j*n+i,a=pp===undefined?1:sg(pp,k*.12,k*.12+.25);
  box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,AX,'#fafbfc',6);
  if(a>0){ga(a);box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,cols[k]||AX,(cols[k]||'#ccc')+'33',6);TB(cells[k],x+cw*(i+1.5),y+cw*(j+1.5)+size*.36,INK,size);g1();}}
}
function bar(x,y,w,h,col,lab,val,vs){ctx.fillStyle=col;ctx.fillRect(x,y-h,w,h);if(lab)TB(lab,x+w/2,y+16,INK,13);if(val!=null)TB(val,x+w/2,y-h-6,INK,vs||13);}
/* cellule de gamète : disque avec lettre */
function gam(x,y,r,c,l){DOT(x,y,r,c+'33');ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(l,x,y+r*.36,dk(c),Math.round(r*1.05));}
function drop(x,y,s,col,lab,fs){ctx.beginPath();ctx.moveTo(x,y-s*1.5);ctx.bezierCurveTo(x+s*.3,y-s*.8,x+s,y-s*.3,x+s,y+s*.35);ctx.arc(x,y+s*.35,s,0,PI,false);ctx.bezierCurveTo(x-s,y-s*.3,x-s*.3,y-s*.8,x,y-s*1.5);ctx.fillStyle=col+'33';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.stroke();if(lab)TB(lab,x,y+s*.55,dk(col),fs||Math.round(s*.95));}
function chX(x,y,s,col){LN(x-s*.5,y-s,x+s*.5,y+s,col,s*.3);LN(x+s*.5,y-s,x-s*.5,y+s,col,s*.3);}
function chY(x,y,s,col){LN(x-s*.5,y-s,x,y,col,s*.3);LN(x+s*.5,y-s,x,y,col,s*.3);LN(x,y,x,y+s,col,s*.3);}
function hsh(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function moth(x,y,s,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ell(-7*s,0,8*s,5*s,col,'rgba(0,0,0,.45)',1.2,.4);ell(7*s,0,8*s,5*s,col,'rgba(0,0,0,.45)',1.2,-.4);ell(0,0,2.2*s,6*s,'#555',null);ctx.restore();}
function bark(x,y,w,h){ctx.fillStyle='#5b4d3f';ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=2;for(var i=0;i<w/22;i++){ctx.beginPath();ctx.moveTo(x+i*22+hsh(i)*10,y);ctx.bezierCurveTo(x+i*22+8,y+h*.3,x+i*22-6,y+h*.6,x+i*22+hsh(i+5)*10,y+h);ctx.stroke();}}
function gs(x,mu,s){return Math.exp(-(x-mu)*(x-mu)/(2*s*s));}
function curve(x0,y0,w,h,mu,s,lo,hi,col,fill,lw){ctx.beginPath();for(var i=0;i<=w;i+=2){var v=lo+(hi-lo)*i/w,y=y0-h*gs(v,mu,s);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}
 if(fill){ctx.lineTo(x0+w,y0);ctx.lineTo(x0,y0);ctx.closePath();ctx.fillStyle=fill;ctx.fill();}ctx.strokeStyle=col;ctx.lineWidth=lw||2.4;ctx.stroke();}
function giraffe(x,y,s,neck,col){LN(x+8*s,y-6*s,x+14*s,y-6*s-neck*s,col,6*s);ell(x+16*s,y-neck*s-10*s,6*s,4*s,col,null);ell(x,y,14*s,8*s,col,null);LN(x-6*s,y+6*s,x-6*s,y+20*s,col,3*s);LN(x+6*s,y+6*s,x+6*s,y+20*s,col,3*s);}
var DRFT=(function(){function run(N,seed){var f=.5,out=[f],i;for(var g=1;g<=60;g++){var k=0,n=2*N;for(i=0;i<n;i++)if(hsh(seed*977+g*131+i*7.3)<f)k++;f=k/n;out.push(f);}return out;}
 var A=[],B=[];for(var r=0;r<8;r++){A.push(run(10,r+1));B.push(run(100,r+21));}return {A:A,B:B};})();
var PM=[.2];for(var q=1;q<8;q++){var pp=PM[q-1];PM.push(pp*.9/(pp*.9+(1-pp)*.6));}
SFA.theo("c06", {
 icon: function () {
  bark(W*.08,H*.1,W*.5,H*.7);var pos=[[.18,.25,'#2e2a26'],[.3,.5,'#efe9dc'],[.42,.3,'#2e2a26'],[.2,.65,'#efe9dc'],[.4,.68,'#2e2a26']];
  pos.forEach(function(q){moth(W*q[0]+W*.08,H*q[1]+H*.06,2.2,q[2],hsh(q[0]*9)-.5);});
  TB('variation',W*.8,H*.3,BLUE_D,19);TB('+ tri par le milieu',W*.8,H*.3+28,ORANGE,16);TB('= évolution',W*.8,H*.3+60,DRED,22);
  TB('sélection naturelle · dérive',W*.5,H*.93,BLUE_D,16);
 },
 sub: [
 {t:"Sélection naturelle", anim: G(function (t) {
  var P=140,g=((t/P)|0)%7,u=(t%P)/P,p0=PM[g],p1=PM[g+1];
  bark(20,40,380,230);TB('génération '+g,210,26,INK,16);
  var n=40,dark=Math.round(p0*n),eat=sg(u,.45,.75);
  for(var k=0;k<n;k++){var i=k%8,j=(k/8)|0,x=50+i*44,y=72+j*42,isd=k<dark;
   var surv=isd?1:1-eat*.6*(hsh(k*3.3)<.65?1:0);if(!isd&&hsh(k*3.3)<.65&&eat>.5){ga(.25);}else ga(1);moth(x,y,1.5,isd?'#26231f':'#efe9dc',hsh(k)*1.2-.6);g1();}
  /* oiseau */
  var bx=-60+eat*520;if(u>.45&&u<.8){ctx.fillStyle=RED;ctx.beginPath();ctx.moveTo(bx,130);ctx.lineTo(bx-22,118);ctx.lineTo(bx-12,132);ctx.lineTo(bx-26,146);ctx.closePath();ctx.fill();}
  /* graphique */
  var gx=440,gy=250,gw=230,gh=180;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh-8,AX,1.6);TB('part de foncées',gx,gy-gh-14,GREY,12,'left');TB('génération',gx+gw,gy+22,GREY,12,'right');
  for(var q=0;q<=7;q++){var x=gx+q/7*gw,show=q<g||(q===g);if(q<=g){ga(1);DOT(x,gy-PM[q]*gh/.7,5,DRED);if(q>0)LN(gx+(q-1)/7*gw,gy-PM[q-1]*gh/.7,x,gy-PM[q]*gh/.7,DRED,2);TB(String(q),x,gy+16,GREY,11);}}
  TB(Math.round(p0*100)+' %',gx+g/7*gw+4,gy-p0*gh/.7-12,DRED,15);
  TB('écorce noircie : survie 0,9 (foncées) · 0,6 (claires)',210,288,GREY,12);
 }),
 th:'<div class="tcard"><b class="h">Lamarck et Darwin</b><p><b>Lamarck</b> pensait que l\'usage ou le non-usage d\'un organe le modifie au cours de la vie et que ces <b>caractères acquis</b> se transmettent : c\'est faux (ils ne modifient pas l\'ADN des gamètes). <b>Darwin</b> : dans une population, les individus <b>varient</b> ; une partie de cette variation est <b>héréditaire</b> ; tous ne laissent pas le même nombre de descendants. Les variants avantageux dans leur milieu se reproduisent davantage et deviennent plus fréquents. L\'évolution est un changement de la <b>composition d\'une population</b>, pas la transformation d\'individus, et elle n\'a <b>pas de but</b> (pas de raisonnement finaliste).</p></div>'
 +'<div class="tcard"><b class="h">Les trois conditions de la sélection naturelle</b><p>1) <b>Variation</b> des caractères. 2) <b>Hérédité</b> : cette variation est liée aux gènes et se transmet. 3) <b>Reproduction (ou survie) différentielle</b> selon le phénotype et le milieu. Si elles sont réunies, la fréquence des caractères avantageux augmente de génération en génération : c\'est l\'<b>adaptation</b>. La mutation est la source de la variation ; elle est aléatoire, non dirigée par le milieu. La sélection <b>artificielle</b> suit le même principe, mais le « tri » est fait par l\'humain.</p></div>'
 +'<div class="tcard"><b class="h">Calculer l\'évolution d\'une fréquence : les phalènes</b><p>Si la forme foncée a la fréquence p et une survie w<sub>f</sub>, la claire w<sub>c</sub> : <b>p\' = p·w<sub>f</sub> / (p·w<sub>f</sub> + (1 − p)·w<sub>c</sub>)</b>. <i>Exemple</i> : p = 0,20, w<sub>f</sub> = 0,9, w<sub>c</sub> = 0,6 : p\' = 0,18 / 0,66 ≈ 0,273 puis p\'\' = 0,36. Autre forme : le rapport foncées/claires est multiplié à chaque génération par r = w<sub>f</sub>/w<sub>c</sub> ; il vaut (p/(1 − p))·r<sup>n</sup> après n générations. Pour passer de 1 % à 50 % avec r = 1,1875 : n = ln 99 / ln 1,1875 ≈ 27 générations.</p></div>'
 +'<div class="tcard"><b class="h">Résistance aux antibiotiques</b><p>Parmi 10<sup>9</sup> bactéries, 1 sur 10<sup>8</sup> est <b>déjà</b> résistante (mutation aléatoire) : 10 résistantes. Un antibiotique qui tue 99,99 % des sensibles en laisse 10<sup>5</sup> : la proportion de résistantes passe de 10<sup>−8</sup> à environ 10<sup>−4</sup> (× 10 000). L\'antibiotique n\'a <b>pas créé</b> la résistance, il a éliminé la concurrence ; en répétant, la souche résistante devient majoritaire. D\'où l\'importance de respecter les traitements.</p></div>'},
 {t:"Réponse à la sélection", anim: G(function (t) {
  var P=300,k=((t/P)|0)%3,u=(t%P)/P,h2=[.5,.2,0][k],mv=sg(u,.35,.75);
  var x0=40,w=620,y0=210,lo=7,hi=14.5;function X(v){return x0+(v-lo)/(hi-lo)*w;}
  LN(x0,y0,x0+w,y0,AX,1.6);for(var v=8;v<=14;v+=2){TB(String(v),X(v),y0+16,GREY,12);}TB('longueur du bec (mm)',x0+w/2,y0+36,GREY,12);
  curve(x0,y0,w,110,10,1,lo,hi,GREY,'rgba(154,160,166,.12)');
  /* reproducteurs sélectionnés */
  ctx.save();ctx.beginPath();ctx.rect(X(10.9),0,X(14.5)-X(10.9),y0);ctx.clip();curve(x0,y0,w,110,10,1,lo,hi,BLUE,'rgba(55,138,221,.35)');ctx.restore();
  LN(X(10),y0,X(10),y0-130,GREY,1.6,[4,4]);LN(X(11.2),y0,X(11.2),y0-130,BLUE,1.6,[4,4]);
  TB('moyenne 10,0',X(10)-8,y0-122,GREY,13,'right');TB('reproducteurs : 11,2',X(11.2)+8,y0-122,BLUE_D,13,'left');
  A(X(10),y0-60,X(11.2)-X(10),0,BLUE,'',2.4);TB('S = 1,2',(X(10)+X(11.2))/2,y0-68,BLUE_D,14);
  var mu=10+h2*1.2*mv;if(mv>0){curve(x0,y0,w,110,mu,1,lo,hi,ORANGE,null,3);LN(X(mu),y0,X(mu),y0-110,ORANGE,2);}
  TB('h² = '+String(h2).replace('.',','),40,34,INK,24,'left');
  ga(mv);TB('R = h² × S = '+String(+(h2*1.2).toFixed(2)).replace('.',',')+' mm',200,32,ORANGE,19,'left');TB('moyenne de la génération suivante : '+String(+(10+h2*1.2).toFixed(2)).replace('.',',')+' mm',200,56,DRED,15,'left');g1();
 }),
 th:'<div class="tcard"><b class="h">Combien le caractère change-t-il ?</b><p>Le <b>différentiel de sélection</b> S est l\'écart entre la moyenne des reproducteurs et celle de la population : S = 11,2 − 10,0 = 1,2 mm. L\'<b>héritabilité</b> h² (de 0 à 1) mesure la part de la variation due aux gènes. La <b>réponse à la sélection</b> est <b>R = h² × S</b> et la nouvelle moyenne vaut moyenne + R. Pour h² = 0,5 : R = 0,6 mm → 10,6 mm ; pour h² = 0,2 : 10,24 mm ; pour h² = 0 : aucun changement, trier les parents ne sert à rien.</p></div>'
 +'<div class="tcard"><b class="h">Plus sélectif, plus rapide ?</b><p>Pour une sélection par troncature, S = i × σ, où i dépend de la part retenue : i = 1,755 pour 10 % et 0,798 pour 50 %. Poules (σ = 4 g, h² = 0,4) : à 10 %, S = 7,02 g et R ≈ 2,81 g par génération ; à 50 %, S = 3,19 g et R ≈ 1,28 g. Après 5 générations à 10 % : 55 + 5 × 2,81 ≈ 69 g (modèle idéalisé). Mais retenir peu de reproducteurs <b>réduit la diversité génétique</b>.</p></div>'
 +'<div class="tcard"><b class="h">Vitesse d\'une sélection : le nombre de générations</b><p>Quand le rapport des fréquences est multiplié par r à chaque génération, il faut <b>n = ln(rapport visé / rapport initial) / ln r</b> générations. Phalènes : r = 0,95/0,80 = 1,1875, de 1 % à 50 % : ln 99 / ln 1,1875 ≈ 27 ; jusqu\'à 95 % (rapport 19) : ln 1 881 / ln 1,1875 ≈ 44. Si le milieu s\'inverse, la sélection joue en sens contraire à la même vitesse : l\'évolution est <b>réversible</b>. Les pinsons de Darwin illustrent une sélection naturelle observée : après une sécheresse, les becs plus profonds, héréditaires, deviennent plus fréquents.</p></div>'},
 {t:"Dérive génétique", anim: G(function (t) {
  var gmax=Math.min(60,(t%720)/720*70);
  function panel(x0,N,runs,title){var w=300,h=200,y0=250;TB(title,x0+w/2,20,INK,15);LN(x0,y0,x0+w,y0,AX,1.6);LN(x0,y0,x0,y0-h,AX,1.6);TB('fréquence de l\'allèle',x0+4,y0-h-6,GREY,11,'left');TB('génération',x0+w,y0+16,GREY,11,'right');
   TB('0',x0-8,y0+4,GREY,11,'right');TB('1',x0-8,y0-h+4,GREY,11,'right');LN(x0,y0-h/2,x0+w,y0-h/2,'#e3e6ea',1,[3,3]);
   var cs=[RED,BLUE,GREEN,ORANGE,VIOLET,GREY,DRED,DGREEN];
   runs.forEach(function(r,i){ctx.strokeStyle=cs[i];ctx.lineWidth=2;ctx.beginPath();for(var g=0;g<=Math.min(60,gmax);g++){var x=x0+g/60*w,y=y0-r[g]*h;g?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});}
  panel(30,10,DRFT.A,'petite population (N = 10)');panel(380,100,DRFT.B,'grande population (N = 100)');
 }),
 th:'<div class="tcard"><b class="h">Le hasard dans les petites populations</b><p>À chaque génération, les gamètes qui forment la génération suivante sont un <b>échantillon aléatoire</b> des copies de gènes. Dans une petite population, les fréquences des allèles fluctuent au hasard : c\'est la <b>dérive génétique</b>. Elle ne dépend pas de l\'avantage d\'un allèle : un allèle neutre, voire légèrement désavantageux, peut se <b>fixer</b> (fréquence 1) ou <b>disparaître</b> (fréquence 0). La fréquence 0 est « absorbante » : sans mutation, l\'allèle ne revient pas.</p></div>'
 +'<div class="tcard"><b class="h">Taille de la population et diversité</b><p>La diversité génétique d\'une population de N individus (2N copies du gène) diminue en moyenne d\'un facteur <b>(1 − 1/(2N))</b> par génération. Après 100 générations : N = 50 → 0,99<sup>100</sup> ≈ 0,37 (37 % restent) ; N = 500 → 0,999<sup>100</sup> ≈ 0,90 (90 %). La dérive est donc <b>beaucoup plus forte dans les petites populations</b>, ce qui réduit leur capacité d\'adaptation (enjeu majeur pour les espèces menacées).</p></div>'
 +'<div class="tcard"><b class="h">Dérive ou sélection ?</b><p>La sélection naturelle est <b>orientée</b> par le milieu (les allèles avantageux augmentent), la dérive est <b>aveugle</b> (changements au hasard). Deux cas typiques : le <b>goulot d\'étranglement</b> (la population chute à quelques individus) et l\'<b>effet fondateur</b> (quelques individus colonisent une île). Un résultat rapide et orienté dans une population nombreuse évoque la sélection ; une disparition d\'allèle sans effet connu dans une petite population évoque la dérive.</p></div>'}
 ]
});
SFA.figs("c06", [
 F(function(p){ /* 1 long cou */
  TB('génération 1',70,22,GREY,13);var necks=[18,26,34,22,30],a=sg(p,.1,.7);
  for(var i=0;i<5;i++)giraffe(34+i*38,100,1.4,necks[i],i===2||i===4?'#c9953a':'#d8b36a');
  TB('génération 2',70,152,GREY,13);var n2=[30,34,38,32,36];
  for(var i=0;i<5;i++){ga(a);giraffe(34+i*38,238,1.4,necks[i]*(1-a)+n2[i]*a,'#c9953a');g1();}
  ga(1-a);TB('?',130,206,GREY,30);g1();
  ga(a);A(130,128,0,14,GREY,'',2.6);box(250,50,196,84,DGREEN,'#e8f7f1',10);TB('Darwin : tri de la variation',348,82,DGREEN,14);TB('héréditaire',348,102,DGREEN,14);TB('(cou long = plus de descendants)',348,122,GREY,11);
  box(250,160,196,84,DRED,'#fdecec',10);TB('Lamarck : caractère acquis',348,192,DRED,14);TB('non transmis',348,212,DRED,14);crs(430,172,DRED,8);g1();
 }),
 F(function(p){ /* 2 conditions */
  var tit=['Variation','Hérédité','Reproduction','différentielle'];
  var cs=[BLUE,ORANGE,GREEN,RED,VIOLET];
  for(var c=0;c<3;c++){var x=24+c*144;box(x,20,128,170,AX,'#fbfcfd',12);
   if(c===0)for(var i=0;i<9;i++)DOT(x+30+(i%3)*34,60+((i/3)|0)*38,11,cs[i%5]);
   if(c===1){DOT(x+36,60,13,BLUE);DOT(x+36,100,13,GREEN);A(x+54,60,40,0,GREY,'',2.2);A(x+54,100,40,0,GREY,'',2.2);DOT(x+108,60,13,BLUE);DOT(x+108,100,13,GREEN);TB('parent → enfant',x+64,150,GREY,12);}
   if(c===2){for(var i=0;i<2;i++)DOT(x+34,70+i*50,11,i?GREY:RED);for(var k=0;k<5;k++)DOT(x+66+k*10,70,6,RED);DOT(x+70,120,6,GREY);TB('5 descendants / 1',x+64,160,GREY,11);}
   var a=sg(p,c*.2,c*.2+.4);ga(a);box(x,200,128,50,DGREEN,'#e8f7f1',10);TB(c===2?'Reproduction diff.':tit[c],x+64,230,DGREEN,c===2?13:16);g1();}
  ga(1-sg(p,0,.4));TB('3 conditions ?',230,232,GREY,18);g1();
 }),
 F(function(p){ /* 3 phalènes */
  bark(20,20,150,200);moth(60,70,2.2,'#26231f',.2);moth(110,90,2.2,'#efe9dc',-.3);moth(70,140,2.2,'#26231f',.5);moth(125,170,2.2,'#26231f',-.1);moth(55,195,2.2,'#efe9dc',.4);
  TB('écorce noircie',95,238,GREY,12);
  var v=[20,27.3,36],lb=['gén. 0','gén. 1','gén. 2'],a=sg(p,0,.8);LN(200,220,440,220,AX,1.6);
  for(var i=0;i<3;i++){var x=210+i*76,h=v[i]*4.2*(i===0?1:a);bar(x,220,56,h,i===0?GREY:DRED,lb[i],null);ga(i===0?1:sg(p,.4,.9));TB(String(v[i]).replace('.',',')+' %',x+28,212-h,INK,17);g1();}
  TB('part de foncées',320,24,INK,15);
  ga(1-sg(p,0,.3));TB('0,9 · 0,6 ?',320,130,GREY,18);g1();
 }),
 F(function(p){ /* 4 réponse à la sélection */
  var x0=30,w=400,y0=170,lo=7,hi=14.5;function X(v){return x0+(v-lo)/(hi-lo)*w;}
  LN(x0,y0,x0+w,y0,AX,1.6);for(var v=8;v<=14;v+=2)TB(String(v),X(v),y0+16,GREY,12);TB('mm',x0+w+8,y0+16,GREY,12);
  curve(x0,y0,w,100,10,1,lo,hi,GREY,'rgba(154,160,166,.15)');
  ctx.save();ctx.beginPath();ctx.rect(X(10.9),0,X(14.5)-X(10.9),y0);ctx.clip();curve(x0,y0,w,100,10,1,lo,hi,BLUE,'rgba(55,138,221,.35)');ctx.restore();
  TB('10,0',X(10),y0-106,GREY,13);TB('11,2',X(11.2)+12,y0-106,BLUE_D,13);LN(X(10),y0,X(10),y0-100,GREY,1.4,[3,3]);LN(X(11.2),y0,X(11.2),y0-100,BLUE,1.4,[3,3]);
  var a=sg(p,.2,.9),r=[[10.6,'h² = 0,5  →  10,6 mm',ORANGE],[10.24,'h² = 0,2  →  10,24 mm',GREEN],[10,'h² = 0  →  10,0 mm',GREY]];
  r.forEach(function(q,i){ga(a);DOT(X(q[0]),y0,6,q[2]);DOT(40,204+i*22,6,q[2]);TB(q[1],54,209+i*22,dk(q[2]),15,'left');g1();});
  ga(a);TB('R = h² × S, S = 1,2 mm',350,44,ORANGE,17);g1();
  ga(1-a);TB('moyenne à la génération suivante ?',230,236,GREY,15);g1();
 }),
 F(function(p){ /* 5 résistantes */
  var bx=130,bw=220;function L(v){return Math.max(0,Math.log10(v))/9*bw;}
  TB('échelle logarithmique',230,18,GREY,12);
  TB('avant',24,66,INK,14,'left');TB('sensibles : 10⁹',24,90,BLUE_D,13,'left');ctx.fillStyle=BLUE;ctx.fillRect(bx,76,L(1e9),20);TB('résistantes : 10',24,128,DRED,13,'left');ctx.fillStyle=RED;ctx.fillRect(bx,112,Math.max(L(10),6),20);
  var a=sg(p,.1,.8);ga(a);TB('après',24,180,INK,14,'left');TB('sensibles : 10⁵',24,204,BLUE_D,13,'left');ctx.fillStyle=BLUE;ctx.fillRect(bx,190,L(1e5)*a+(1-a)*L(1e9)*0+0,20);TB('résistantes : 10',24,240,DRED,13,'left');ctx.fillStyle=RED;ctx.fillRect(bx,226,L(10),20);
  box(366,172,86,74,ORANGE,'#fdf5e9',10);TB('part de',409,196,GREY,12);TB('résistantes',409,212,GREY,12);TB('× 10 000',409,236,DRED,16);g1();
  ga(1-a);TB('traitement ?',230,200,GREY,18);g1();
 }),
 F(function(p){ /* 6 allèle qui disparaît */
  var gx=40,gy=230,gw=380,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh,AX,1.6);TB('génération',gx+gw,gy+20,GREY,12,'right');TB('fréquence',gx+4,gy-gh-6,GREY,12,'left');
  TB('0',gx-8,gy+4,GREY,11,'right');TB('1',gx-8,gy-gh+4,GREY,11,'right');LN(gx,gy-gh/2,gx+gw,gy-gh/2,'#e3e6ea',1,[3,3]);
  var main=[.5,.45,.5,.38,.33,.35,.28,.25,.2,.15,.18,.1,.08,.05,.025,0],oth=[[.5,.55,.6,.52,.58,.65,.7,.68,.74,.8,.85,.82,.9,.95,.97,1],[.5,.5,.45,.5,.55,.5,.52,.48,.5,.45,.5,.55,.5,.52,.5,.48]];
  var a=sg(p,0,.8),m=Math.floor(15*a);
  [[oth[1],GREY],[oth[0],BLUE],[main,RED]].forEach(function(q,qi){ctx.strokeStyle=q[1];ctx.lineWidth=qi===2?3.6:1.8;ctx.beginPath();for(var g=0;g<=m;g++){var x=gx+g/15*gw,y=gy-q[0][g]*gh;g?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});
  TB('20 oiseaux : dérive',230,22,INK,15);
  ga(sg(p,.7,1));DOT(gx+gw,gy,6,RED);TB('allèle perdu par hasard',gx+gw-16,gy-34,DRED,13,'right');g1();
  ga(1-sg(p,0,.3));TB('?',230,120,GREY,40);g1();
 }),
 F(function(p){ /* 7 plus fort */
  var x0=20,w=230,y0=130,lo=-3,hi=3;function X(v){return x0+(v-lo)/(hi-lo)*w;}
  LN(x0,y0,x0+w,y0,AX,1.6);curve(x0,y0,w,90,0,1,lo,hi,GREY,'rgba(154,160,166,.15)');
  ctx.save();ctx.beginPath();ctx.rect(X(1.282),0,w,y0);ctx.clip();curve(x0,y0,w,90,0,1,lo,hi,RED,'rgba(226,75,74,.4)');ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(X(0),0,w,y0);ctx.clip();ctx.restore();
  TB('10 % retenus',X(1.9),y0-70,DRED,12);LN(X(0),y0,X(0),y0-92,GREY,1.4,[3,3]);TB('55 g',X(0),y0+16,GREY,12);
  var a=sg(p,.2,.9);ga(a);TB('S = 1,755 × 4 = 7,02 g',135,170,INK,14);TB('R = 0,4 × 7,02 ≈ 2,8 g',135,192,DRED,15);g1();
  /* barres R */
  var bx=300;LN(bx-6,230,bx+150,230,AX,1.5);
  var vv=[[2.81,'10 %',RED],[1.28,'50 %',BLUE]];vv.forEach(function(q,i){var x=bx+i*70,h=q[0]*34*a;bar(x,230,48,h,q[2],q[1],null);ga(a);TB(String(q[0]).replace('.',',')+' g',x+24,222-h,INK,16);g1();});
  TB('R par génération',bx+70,70,INK,14);TB('(5 gén. à 10 % : ≈ 69 g)',230,262,GREY,13);
 }),
 F(function(p){ /* 8 pinsons */
  var x0=30,w=400,y0=150;LN(x0,y0,x0+w,y0,AX,1.6);TB('profondeur du bec',x0+w/2,y0+24,GREY,12);
  curve(x0,y0,w,100,6,1.2,2,12,GREY,'rgba(154,160,166,.16)');TB('avant',X0(5)-0,y0-104,GREY,13);
  function X0(v){return x0+(v-2)/10*w;}
  var a=sg(p,.2,.9);ga(a);curve(x0,y0,w,100,7.2,1.2,2,12,ORANGE,'rgba(186,117,23,.2)',3);TB('après la sécheresse',X0(8.6),y0-104,ORANGE,13);A(X0(6),y0-60,(X0(7.2)-X0(6)),0,ORANGE,'',3);g1();
  /* graines */
  for(var i=0;i<5;i++){ell(70+i*14,206,6,5,'#c9b27a',INK,1.2);}TB('graines tendres : rares',110,238,GREY,12);
  for(var i=0;i<4;i++){ell(310+i*18,206,9,8,'#8a6a3a',INK,1.6);}TB('graines dures : abondantes',360,238,GREY,12);
  ga(a);TB('survie différentielle + hérédité',230,24,DGREEN,15);g1();
  ga(1-a);TB('interprétation ?',230,24,GREY,15);g1();
 }),
 F(function(p){ /* 9 combien de générations */
  var gx=44,gy=230,gw=380,gh=180;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh-8,AX,1.6);TB('génération',gx+gw,gy+32,GREY,12,'right');TB('part de foncées',gx+4,gy-gh-14,GREY,12,'left');
  TB('50 %',gx-6,gy-gh/2+4,GREY,11,'right');TB('95 %',gx-6,gy-gh*.95+4,GREY,11,'right');TB('0',gx-6,gy+4,GREY,11,'right');
  LN(gx,gy-gh/2,gx+gw,gy-gh/2,'#e3e6ea',1,[3,3]);LN(gx,gy-gh*.95,gx+gw,gy-gh*.95,'#e3e6ea',1,[3,3]);
  var a=sg(p,0,.8),nmax=50*a;ctx.strokeStyle=DRED;ctx.lineWidth=3;ctx.beginPath();
  for(var n=0;n<=nmax;n+=.5){var rr=Math.pow(1.1875,n)/99,pp=rr/(1+rr);var x=gx+n/50*gw,y=gy-pp*gh;n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(var n=0;n<=50;n+=10)TB(String(n),gx+n/50*gw,gy+16,GREY,11);
  ga(sg(p,.6,1));DOT(gx+27/50*gw,gy-gh/2,6,RED);TB('27 générations',gx+27/50*gw+12,gy-gh/2+22,DRED,14,'left');DOT(gx+44/50*gw,gy-gh*.95,6,RED);TB('44 générations',gx+44/50*gw-12,gy-gh*.95-12,DRED,14,'right');
  TB('retour à 50 % : 18 générations',gx+14,gy-gh*.8,GREY,13,'left');g1();
  TB('1 % au départ · r = 0,95 / 0,80',230,20,INK,14);
 }),
 F(function(p){ /* 10 perte de diversité */
  var gx=44,gy=230,gw=380,gh=170;LN(gx,gy,gx+gw,gy,AX,1.6);LN(gx,gy,gx,gy-gh-8,AX,1.6);TB('génération',gx+gw,gy+32,GREY,12,'right');TB('diversité restante',gx+4,gy-gh-14,GREY,12,'left');
  TB('0',gx-6,gy+4,GREY,11,'right');TB('1',gx-6,gy-gh+4,GREY,11,'right');for(var n=0;n<=100;n+=25)TB(String(n),gx+n/100*gw,gy+16,GREY,11);
  var a=sg(p,0,.8);[[50,RED],[500,BLUE]].forEach(function(q){ctx.strokeStyle=q[1];ctx.lineWidth=3;ctx.beginPath();for(var n=0;n<=100*a;n+=2){var v=Math.pow(1-1/(2*q[0]),n);var x=gx+n/100*gw,y=gy-v*gh;n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();});
  ga(sg(p,.6,1));DOT(gx+gw,gy-.366*gh,5,RED);TB('A (N = 50) : 37 %',gx+gw-8,gy-.366*gh+22,DRED,14,'right');DOT(gx+gw,gy-.905*gh,5,BLUE);TB('B (N = 500) : 90 %',gx+gw-8,gy-.905*gh-10,BLUE_D,14,'right');g1();
  TB('(1 − 1/2N)ⁿ après 100 générations',230,20,INK,14);
 })
]);
})();
