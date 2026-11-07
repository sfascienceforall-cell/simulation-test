/* Biologie BA1 · chapitre 4 : théorie animée et devantures */
function b4_ss(x){return x<=0?0:(x>=1?1:x*x*(3-2*x));}
function b4_ap(u){if(u<0)return -70;if(u<.5)return -70+15*(u/.5);if(u<1.2)return -55+95*b4_ss((u-.5)/.7);if(u<2.5)return 40-115*b4_ss((u-1.2)/1.3);if(u<5)return -75+5*b4_ss((u-2.5)/2.5);return -70;}
function b4_trace(x0,y0,w,h,u0,u1,vlo,vhi,fn,col,lw,upto){ /* trace V(t) */
 ctx.strokeStyle=col;ctx.lineWidth=lw||2.6;ctx.beginPath();var first=true;for(var i=0;i<=120;i++){var u=u0+(u1-u0)*i/120;if(upto!=null&&u>upto)break;var X=x0+(u-u0)/(u1-u0)*w,Y=y0-(fn(u)-vlo)/(vhi-vlo)*h;first?ctx.moveTo(X,Y):ctx.lineTo(X,Y);first=false;}ctx.stroke();}
function b4_vax(x0,y0,w,h,vlo,vhi,u1,thr){bio_ax(x0,y0,w,h,'t (ms)','Vm (mV)');[-70,-55,0,40].forEach(function(v){var Y=y0-(v-vlo)/(vhi-vlo)*h;LN(x0-3,Y,x0+3,Y,INK,1.2);TB((''+v).replace('-','−'),x0-6,Y+4,GREY,10,'right');});
 if(thr!==false){var Yt=y0-(-55-vlo)/(vhi-vlo)*h;LN(x0,Yt,x0+w,Yt,RED,1.4,[5,4]);TB('seuil −55',x0+w,Yt-5,DRED,11,'right');}}
function b4_neuron(x,y,s){DOT(x,y,12*s,'#eef4fb');ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,12*s,0,7);ctx.stroke();}

SFA.theo("c04",{
 icon:function(){var y=H*.4;b4_vax&&0;var x0=W*.12,w=W*.76,h=H*.45,y0=H*.68;b4_trace(x0,y0,w,h,-1,6,-80,50,b4_ap,BLUE,3.4);LN(x0,y0-(15/130)*h*0,x0+w,y0-(25/130)*h,RED,0);
  TB('potentiel d\'action',W*.5,H*.88,BLUE_D,18);TB('seuil −55 mV · tout ou rien',W*.5,H*.97,ORANGE,13);
  LN(x0,y0-(25/130)*h,x0+w,y0-(25/130)*h,RED,1.4,[5,4]);},
 sub:[
 {t:"Potentiel d'action et conduction",
  anim:function(t){
   var ph=t%420,u=-.8+ph/420*7.5;var x0=W*.08,y0=H*.66,w=W*.54,h=H*.44,vlo=-90,vhi=50;
   TB('Potentiel d\'action : tout ou rien, puis période réfractaire',W*.5,20,BLUE_D,14);
   var Yr=y0-(40+90)/(vhi-vlo)*h;
   ctx.fillStyle='rgba(226,75,74,.08)';var xr0=x0+(1-(-.8))/7.5*w,xr1=x0+(3.5+.8)/7.5*w;ctx.fillRect(xr0,y0-h-6,xr1-xr0,h+6);TB('réfractaire',(xr0+xr1)/2,y0-h+6,DRED,11);
   b4_vax(x0,y0,w,h,vlo,vhi,7,true);
   b4_trace(x0,y0,w,h,-.8,6.7,vlo,vhi,b4_ap,BLUE,2.8,u);
   var cu=Math.min(u,6.7),cx=x0+(cu+.8)/7.5*w,cy=y0-(b4_ap(cu)-vlo)/(vhi-vlo)*h;DOT(cx,cy,5,RED);
   var na=u>.3&&u<1.6?Math.sin((u-.3)/1.3*PI):0,kk=u>1.1&&u<3.8?Math.sin((u-1.1)/2.7*PI):0;
   var bx=W*.68;TB('canaux',bx+60,82,GREY,12);
   [['Na⁺ (entrée)',na,DRED],['K⁺ (sortie)',kk,BLUE_D]].forEach(function(q,i){var yy=100+i*38;TB(q[0],bx,yy+10,q[2],12,'left');ctx.fillStyle='#eceef1';ctx.fillRect(bx+90,yy,70,14);ctx.fillStyle=i?BLUE:RED;ctx.fillRect(bx+90,yy,70*q[1],14);});
   var lab=u<0?'repos : −70 mV':(u<.5?'stimulus : on approche du seuil':(u<1.2?'dépolarisation : Na⁺ entre':(u<2.5?'repolarisation : K⁺ sort':(u<4.5?'hyperpolarisation : retour au repos':'repos'))));
   TB(lab,W*.5,42,INK,14);
   var ay=H*.88;LN(W*.08,ay,W*.92,ay,'#bbb',10);ctx.fillStyle='#fff';
   for(var k=0;k<6;k++){var mx=W*.14+k*W*.13;ctx.fillStyle='#faeeda';ctx.fillRect(mx,ay-8,W*.09,16);ctx.strokeStyle=ORANGE;ctx.lineWidth=1.5;ctx.strokeRect(mx,ay-8,W*.09,16);}
   var pos=W*.1+((t*.012)%1)*W*.8;var nodeAt=Math.round((pos-W*.14)/(W*.13));var snap=W*.1+((nodeAt)*W*.13)+W*.115;DOT(Math.max(W*.1,Math.min(W*.9,pos)),ay,6,RED);TB('myéline : l\'influx saute de nœud en nœud',W*.5,ay+26,GREY,12);},
  th:'<div class="tcard"><b class="h">Le potentiel d\'action</b><p>Repos : Vm ≈ −70 mV. Un stimulus dépolarise la membrane ; si le <b>seuil</b> (≈ −55 mV) est atteint, les canaux Na<sup>+</sup> voltage-dépendants s\'ouvrent (entrée de Na<sup>+</sup>, <b>dépolarisation</b> jusqu\'à ≈ +40 mV), puis ils s\'<b>inactivent</b> et les canaux K<sup>+</sup> s\'ouvrent (<b>repolarisation</b>, puis hyperpolarisation passagère).</p><p><b>Tout ou rien</b> : sous le seuil, pas de potentiel d\'action ; au-dessus, il a toujours la même amplitude (8 µA/cm² donnent +38 mV, 20 µA/cm² donnent +41 mV). L\'intensité du stimulus est codée par la <b>fréquence</b> des potentiels d\'action. La <b>période réfractaire</b> (canaux Na<sup>+</sup> inactivés) empêche un deuxième potentiel d\'action immédiat et force la propagation dans un seul sens.</p><p><b>Pièges</b> : la repolarisation n\'est pas due à Cl<sup>−</sup> ; la tétrodotoxine (TTX) bloque les canaux Na<sup>+</sup> voltage-dépendants : il ne reste qu\'une petite dépolarisation passive, aucun potentiel d\'action.</p></div><div class="tcard"><b class="h">Propagation, myéline et vitesse</b><p>Le potentiel d\'action se régénère de proche en proche. Dans une fibre <b>myélinisée</b>, il saute d\'un <b>nœud de Ranvier</b> à l\'autre (conduction saltatoire) : v ≈ 6·d (v en m/s, d en µm), nœuds espacés d\'environ 100·d. Pour d = 12 µm : 72 m/s, nœuds tous les 1,2 mm. Fibre amyélinique : v ≈ 1,1·√d (1,1 m/s pour d = 1 µm).</p><p><b>Latence</b> = distance / vitesse : sur 0,9 m, 12,5 ms en fibre myélinisée contre 0,82 s en fibre amyélinique (≈ 65 fois plus lent). En clinique, on stimule un nerf en deux points : v = (distance) / (différence des latences), ce qui élimine le temps de transmission neuromusculaire. Ex. 21 cm, 3,4 et 7,0 ms : v = 0,21 / 3,6 ms ≈ 58 m/s (normal ≥ 50) ; 4,1 et 11,9 ms : 27 m/s, évoque une démyélinisation.</p></div>'},
 {t:"Signalisation, synapses et rétroaction",
  anim:function(t){
   var ph=t%480,st=Math.min(5,Math.floor(ph/70));
   TB('Cascade de transduction : amplification à chaque étage',W*.5,20,BLUE_D,14);
   var y=H*.5;ctx.fillStyle='#faeeda';ctx.fillRect(W*.06,y-10,W*.88,20);ctx.strokeStyle=ORANGE;ctx.lineWidth=1.6;ctx.strokeRect(W*.06,y-10,W*.88,20);TB('membrane',W*.12,y+4,DRED,11);
   var cols=[W*.12,W*.32,W*.52,W*.72,W*.9];var labs=['ligand','récepteur','protéines G','adénylate cyclase','AMPc'];var nums=['× 1','× 1','× 20','× 20','× 2 000'];
   for(var i=0;i<5;i++){var on=i<=st;ctx.globalAlpha=on?1:.25;var n=[1,1,5,5,12][i];
    TB(labs[i],cols[i]-(i==4?10:0),i<2?y-72:y+50,i<2?BLUE_D:DGREEN,12);
    for(var j=0;j<n;j++){var xx=cols[i]-(i==4?10:0)+((j%4)-1.5)*11,yy=(i<2?y-48:y+74)+Math.floor(j/4)*12;DOT(xx,yy,4.5,[BLUE,VIOLET,GREEN,ORANGE,RED][i]);}
    TB(nums[i],cols[i]-(i==4?10:0),i<2?y-26:y+122,INK,13);ctx.globalAlpha=1;}
   TB('1 ligand → 2 000 AMPc ; 50 ligands → 100 000 AMPc',W*.5,H*.97,DRED,13);
   if(ph%70<40&&st>0){var a=(ph%70)/40;ctx.globalAlpha=1-a;DOT(cols[st-1]+(cols[st]-cols[st-1])*a,y,5,RED);ctx.globalAlpha=1;}},
  th:'<div class="tcard"><b class="h">Cascades de transduction (exemple de l\'AMPc)</b><p>Ligand → récepteur couplé aux protéines G → G<sub>α</sub> (échange GDP/GTP) → adénylate cyclase → <b>AMPc</b> (second messager) → protéine kinase A. À chaque étage, une enzyme active traite plusieurs substrats : c\'est l\'<b>amplification</b>. Exemple : 1 ligand active 20 protéines G, chacune produisant 100 AMPc : 2 000 AMPc ; 50 ligands : 100 000 AMPc.</p><p>Le signal s\'arrête quand G<sub>α</sub> hydrolyse son GTP et que la <b>phosphodiestérase</b> (PDE) dégrade l\'AMPc : d[AMPc]/dt = production − k·[AMPc]. Plateau = production / k (0,5 / 0,2 = 2,5 µmol/L) ; demi-vie = ln 2 / k = 3,5 s ; [AMPc](t) = plateau·(1 − e<sup>−kt</sup>) (2,16 µmol/L à 10 s). La caféine inhibe la PDE : k divisé par 2, plateau 5,0 µmol/L, demi-vie 6,9 s. La toxine cholérique bloque l\'hydrolyse du GTP de G<sub>αs</sub> : AMPc élevé en permanence.</p></div><div class="tcard"><b class="h">Synapse et sommation</b><p>Une synapse excitatrice produit un PPSE (dépolarisant), une inhibitrice un PPSI (hyperpolarisant). Le neurone <b>additionne</b> dans le temps et l\'espace. Modèle d\'intégrateur à fuite : dépolarisation moyenne = (Σ n·f·a)·τ (f en ms<sup>−1</sup>, τ constante de temps). Exemple : 20 synapses à 50 Hz (0,05 ms<sup>−1</sup>) de 1 mV avec τ = 10 ms → 20 × 0,05 × 1 × 10 = 10 mV, sous le seuil de 15 mV. Avec 40 excitatrices et 10 inhibitrices (−1 mV) : 20 − 5 = 15 mV, seuil juste atteint ; si les PPSI passent à −1,5 mV : 20 − 7,5 = 12,5 mV, plus de décharge.</p></div><div class="tcard"><b class="h">Homéostasie : rétroaction négative et positive</b><p>Une boucle de <b>rétroaction négative</b> (thermostat, glycémie) corrige un écart. Avec un gain G, un écart de perturbation D/a devient <b>x = D / [a(1 + G)]</b> et la constante de temps 1/[a(1 + G)]. Exemple glycémie : D = 0,06 g/L/min, a = 0,1 min<sup>−1</sup> ; G = 0 : écart 0,6 g/L → 1,6 g/L ; G = 9 : écart 0,06 → 1,06 g/L, τ = 1 min au lieu de 10 min ; gain divisé par 5 (G = 1,8, type diabète) : 1,21 g/L. La <b>rétroaction positive</b> amplifie (ex. dépolarisation et ouverture de canaux Na<sup>+</sup> dans le potentiel d\'action) et s\'arrête par un mécanisme externe.</p></div>'}
 ]
});
SFA.figs("c04",[
 function(p){ /* 0 amplification */
  bio_cap('1 ligand → récepteur → 20 protéines G → AMPc',22);
  var y=H*.5;DOT(W*.1,y,9,BLUE);TB('1 ligand',W*.1,y+24,BLUE_D,12);A(W*.1+12,y,24,0,GREY,'',2);
  ctx.fillStyle='#eeedfe';ctx.strokeStyle=VIOLET;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.2,y-20,34,40,8);ctx.fill();ctx.stroke();TB('R',W*.2+17,y+5,VIO_D,14);
  for(var i=0;i<6;i++){var yy=y-50+i*20;LN(W*.2+36,y,W*.44,yy,GREY,1.2);DOT(W*.44,yy,8,GREEN);}TB('20 protéines G',W*.44,y+82,DGREEN,12);
  for(var j=0;j<6;j++){for(var k=0;k<3;k++)DOT(W*.66+k*13,y-50+j*20,4.5,ORANGE);LN(W*.44+10,y-50+j*20,W*.66-8,y-50+j*20,GREY,1);}TB('100 AMPc chacune',W*.7,y+82,DRED,12);
  bio_pop(p,function(){TB('1 ligand → 20 × 100 = 2 000',W*.5,H*.9,DRED,16);TB('50 ligands → 100 000',W*.5,H*.98,DRED,14);});},
 function(p){ /* 1 myélinisée */
  bio_cap('Fibre myélinisée de 12 µm · v ≈ 6·d',22);
  var y=H*.5,n=4;LN(W*.04,y,W*.96,y,BLUE,4);
  for(var i=0;i<n;i++){var x=W*.1+i*W*.22;ctx.fillStyle='#faeeda';ctx.strokeStyle=ORANGE;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y-18,W*.18,36,12);ctx.fill();ctx.stroke();TB('myéline',x+W*.09,y+4,DRED,11);
   if(i<n-1){DOT(x+W*.2,y,5,RED);}}
  TB('nœud de Ranvier',W*.31,y+40,DRED,12);
  bio_pop(p,function(){for(var i=0;i<2;i++){ctx.strokeStyle=GREEN;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(W*.31+i*W*.22+W*.11,y-12,W*.11,PI*1.1,PI*1.9);ctx.stroke();}TB('v = 6 × 12 = 72 m/s',W*.5,H*.8,DGREEN,17);TB('nœuds : 100 × 12 µm = 1,2 mm',W*.5,H*.92,DGREEN,15);});},
 function(p){ /* 2 tout ou rien */
  bio_cap('Amplitude du potentiel d\'action selon le stimulus',22);
  var x0=W*.14,y0=H*.8,w=W*.76,h=H*.56;bio_ax(x0,y0,w,h,'stimulus','pic de Vm (mV)');
  var sx=function(v){return x0+v/25*w;},sy=function(v){return y0-(v+10)/60*h;};
  LN(sx(5),y0,sx(5),y0-h,RED,1.4,[5,4]);TB('seuil',sx(5)+5,y0-h+12,DRED,12,'left');
  ctx.strokeStyle=BLUE;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,sy(-8));ctx.lineTo(sx(5),sy(-3));ctx.lineTo(sx(5),sy(38));ctx.lineTo(x0+w,sy(41));ctx.stroke();
  TB('sous le seuil : aucun potentiel d\'action',W*.3,y0-30,GREY,12,'left');
  bio_pop(p,function(){TB('+ 38 mV (8 µA/cm²)',sx(8),sy(38)-16,DRED,13,'left');TB('+ 41 mV (20 µA/cm²)',sx(14),sy(41)+22,DRED,13,'left');TB('même amplitude : tout ou rien',W*.5,H*.95,DGREEN,15);});},
 function(p){ /* 3 latence */
  bio_cap('0,9 m à parcourir',22);
  var x0=W*.1,x1=W*.9;
  [['myélinisée 12 µm · 72 m/s',H*.38,GREEN,1],['amyélinique 1 µm · 1,1 m/s',H*.68,ORANGE,0]].forEach(function(r){LN(x0,r[1],x1,r[1],AX,8);TB(r[0],x0,r[1]-18,dk(r[2]),13,'left');DOT(x0,r[1],6,r[2]);DOT(x1,r[1],6,'#fff');ctx.strokeStyle=r[2];ctx.lineWidth=2;ctx.beginPath();ctx.arc(x1,r[1],6,0,7);ctx.stroke();});
  bio_pop(p,function(){TB('12,5 ms',x1,H*.38+26,DGREEN,16);TB('0,82 s',x1,H*.68+26,DRED,16);DOT(x0+.0152*(x1-x0),H*.68,7,ORA2);DOT(x1,H*.38,7,GREEN);TB('à t = 12,5 ms',W*.5,H*.86,INK,13);TB('≈ 65 fois plus rapide',W*.5,H*.95,DGREEN,15);});},
 function(p){ /* 4 AMPc plateau */
  bio_cap('d[AMPc]/dt = 0,5 − k · [AMPc]',22);
  var x0=W*.14,y0=H*.8,w=W*.76,h=H*.58;var sx=function(t){return x0+t/25*w;},sy=function(v){return y0-v/6*h;};
  bio_ax(x0,y0,w,h,'t (s)','[AMPc] µmol/L');[5,10,15,20].forEach(function(v){TB(''+v,sx(v),y0+15,GREY,11);});[2.5,5].forEach(function(v){TB((''+v).replace('.',','),x0-16,sy(v)+4,GREY,11);});
  bio_fn(function(t){return 2.5*(1-Math.exp(-.2*t));},0,25,sx,sy,BLUE,2.8);LN(x0,sy(2.5),x0+w,sy(2.5),BLUE,1.2,[5,4]);TB('k = 0,2 s⁻¹ : plateau 2,5 · t½ = 3,5 s',x0+w,sy(1.1),BLUE_D,12,'right');
  bio_pop(p,function(){bio_fn(function(t){return 5*(1-Math.exp(-.1*t));},0,25,sx,sy,ORA2,2.8);LN(x0,sy(5),x0+w,sy(5),ORA2,1.2,[5,4]);TB('caféine, k = 0,1 : plateau 5,0 · t½ = 6,9 s',x0+w,sy(5)-6,DRED,12,'right');DOT(sx(10),sy(2.16),5,RED);LN(sx(10),sy(2.16),sx(10),sy(.6),RED,1.2,[3,3]);TB('2,16 à 10 s',sx(10)+4,sy(.4),DRED,12,'left');});},
 function(p){ /* 5 TTX */
  bio_cap('Stimulation d\'un axone · témoin et TTX',22);
  var x0=W*.12,y0=H*.8,w=W*.76,h=H*.55;bio_ax(x0,y0,w,h,'t','Vm');
  var f=function(u){return b4_ap(u);};b4_trace(x0,y0,w,h,-1,6,-90,50,f,BLUE,2.8);TB('témoin : potentiel d\'action',x0+w*.48,y0-h*.95,BLUE_D,12,'left');
  var Yr=y0-(-70+90)/140*h;LN(x0,y0-(-55+90)/140*h,x0+w,y0-(-55+90)/140*h,RED,1.2,[5,4]);TB('seuil',x0+w,y0-(-55+90)/140*h-4,DRED,11,'right');
  bio_pop(p,function(){b4_trace(x0,y0,w,h,-1,6,-90,50,function(u){return u<0?-70:-70+9*Math.exp(-(u)/1.2)*(u<.1?u/.1:1);},RED,2.8);TB('avec TTX : dépolarisation passive seule',x0+w*.45,y0-h*.4,DRED,12,'left');TB('Na⁺ voltage-dépendants bloqués',W*.5,H*.95,DRED,14);});},
 function(p){ /* 6 sommation */
  bio_cap('Intégrateur à fuite · τ = 10 ms · seuil +15 mV',22);
  var x0=W*.2,y0=H*.84,h=H*.58,sc=h/20;LN(W*.1,y0,W*.95,y0,INK,1.6);var thr=y0-15*sc;LN(W*.1,thr,W*.95,thr,RED,1.6,[5,4]);TB('seuil 15 mV',W*.95,thr-6,DRED,12,'right');
  ctx.fillStyle='#e1f5ee';ctx.fillRect(x0,y0-10*sc,60,10*sc);ctx.strokeStyle=GREEN;ctx.lineWidth=2;ctx.strokeRect(x0,y0-10*sc,60,10*sc);TB('20 PPSE',x0+30,y0+16,DGREEN,12);TB('10 mV',x0+30,y0-10*sc-6,DGREEN,13);
  bio_pop(p,function(){var xx=x0+120;ctx.fillStyle='#fdece4';ctx.fillRect(xx,y0-7.5*sc,60,7.5*sc);ctx.strokeStyle=ORA2;ctx.strokeRect(xx,y0-7.5*sc,60,7.5*sc);TB('+ 5 PPSI',xx+30,y0+16,DRED,12);TB('10 − 2,5 = 7,5',xx+30,y0-7.5*sc-6,DRED,13);TB('τ = 20 ms → 15 mV',W*.78,H*.5,DGREEN,14);});},
 function(p){ /* 7 glycémie */
  bio_cap('Glycémie après un repas : x = D / [a(1 + G)]',22);
  var x0=W*.12,y0=H*.84,w=W*.8,h=H*.6;var sx=function(t){return x0+t/40*w;},sy=function(v){return y0-(v-.9)/.8*h;};
  bio_ax(x0,y0,w,h,'t (min)','g/L');[10,20,30,40].forEach(function(v){TB(''+v,sx(v),y0+15,GREY,11);});[1,1.2,1.4,1.6].forEach(function(v){TB((''+v).replace('.',','),x0-16,sy(v)+4,GREY,11);});
  LN(x0,sy(1),x0+w,sy(1),GREEN,1.4,[5,4]);TB('consigne 1,0',x0+w,sy(1)+16,DGREEN,12,'right');
  bio_fn(function(t){return 1+.6*(1-Math.exp(-t/10));},0,40,sx,sy,RED,2.8);TB('G = 0 : 1,6 g/L (τ = 10 min)',sx(40),sy(1.6)-8,DRED,12,'right');
  bio_pop(p,function(){bio_fn(function(t){return 1+.06*(1-Math.exp(-t/1));},0,40,sx,sy,BLUE,2.8);TB('G = 9 : 1,06 (τ = 1 min)',sx(40),sy(1.06)-12,BLUE_D,12,'right');bio_fn(function(t){return 1+.214*(1-Math.exp(-t/3.57));},0,40,sx,sy,ORA2,2.8);TB('G ÷ 5 : 1,21',sx(40),sy(1.214)-8,DRED,12,'right');});},
 function(p){ /* 8 toxine cholérique */
  bio_cap('Toxine cholérique : Gαs ne peut plus hydrolyser son GTP',22);
  var y=H*.5;var labs=[['récepteur',W*.12,VIOLET],['Gαs-GTP',W*.34,GREEN],['adénylate\ncyclase',W*.56,ORANGE],['AMPc',W*.78,RED]];
  labs.forEach(function(l,i){bio_rb(l[1],y,W*.17,44,l[2],l[0].split('\n')[0],12);if(i<3)A(l[1]+W*.09,y,W*.05,0,GREY,'',2);});
  TB('cyclase',W*.56,y+30,DRED,11);
  ctx.strokeStyle=RED;ctx.lineWidth=4;var xx=W*.34;ctx.beginPath();ctx.moveTo(xx-16,y+50);ctx.lineTo(xx+16,y+80);ctx.moveTo(xx+16,y+50);ctx.lineTo(xx-16,y+80);ctx.stroke();TB('GTP → GDP bloqué',xx,y+98,DRED,13);
  bio_pop(p,function(){TB('Gαs reste active',W*.34,y-46,DRED,14);TB('AMPc élevé en permanence',W*.76,y-46,DRED,13);TB('sécrétion de Cl⁻ et d\'eau : diarrhée',W*.5,H*.93,DGREEN,14);});},
 function(p){ /* 9 conduction nerveuse */
  bio_cap('Deux sites de stimulation · 21 cm',22);
  var y=H*.4;LN(W*.08,y,W*.78,y,BLUE,5);DOT(W*.14,y,8,RED);TB('proximal',W*.14,y-16,DRED,12);DOT(W*.14+W*.45,y,8,RED);TB('distal',W*.14+W*.45,y-16,DRED,12);
  ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(W*.78,y-22,W*.16,44,12);ctx.fill();ctx.stroke();TB('muscle',W*.86,y+5,DRED,12);
  LN(W*.14,y+30,W*.14+W*.45,y+30,INK,1.6);TB('21 cm',W*.14+W*.225,y+48,INK,13);
  TB('A : 7,0 − 3,4 = 3,6 ms',W*.28,H*.76,INK,13);TB('B : 11,9 − 4,1 = 7,8 ms',W*.72,H*.76,INK,13);
  bio_pop(p,function(){TB('v = 0,21 / 3,6 ms ≈ 58 m/s',W*.28,H*.88,DGREEN,14);TB('27 m/s : démyélinisation',W*.72,H*.88,DRED,14);TB('v = distance / Δ latence',W*.5,H*.97,GREY,12);});},
 function(p){ /* 10 inhibition renforcée */
  bio_cap('40 PPSE (+1 mV) et 10 PPSI à 50 Hz · τ = 10 ms',22);
  var x0=W*.12,y0=H*.84,h=H*.6,sc=h/22;LN(W*.08,y0,W*.95,y0,INK,1.6);var thr=y0-15*sc;LN(W*.08,thr,W*.95,thr,RED,1.6,[5,4]);TB('seuil 15 mV',W*.95,thr-6,DRED,12,'right');
  function col(x,e,i,lab,c){ctx.fillStyle='#e1f5ee';ctx.fillRect(x,y0-e*sc,50,e*sc);ctx.fillStyle='#fdece4';ctx.fillRect(x+54,y0-e*sc,50,i*sc);ctx.strokeStyle=INK;ctx.lineWidth=1.4;ctx.strokeRect(x,y0-e*sc,50,e*sc);ctx.strokeRect(x+54,y0-e*sc,50,i*sc);TB('+'+e,x+25,y0-e*sc-5,DGREEN,12);TB('−'+String(i).replace('.',','),x+79,y0-e*sc-5,DRED,12);TB('= '+String(e-i).replace('.',',')+' mV',x+79,y0-e*sc+i*sc+16,INK,12);TB(lab,x+52,y0+17,c,13);}
  col(W*.12,20,5,'PPSI −1 mV : 15 mV',INK);
  bio_pop(p,function(){col(W*.56,20,7.5,'PPSI −1,5 mV : 12,5 mV',DRED);});},
 function(p){ /* 11 piège PA */
  bio_cap('Deux stimulus de 20 µA/cm², séparés de 5 ms',22);
  var x0=W*.1,y0=H*.8,w=W*.8,h=H*.52;bio_ax(x0,y0,w,h,'t (ms)','Vm');
  var f=function(u){return b4_ap(u);};b4_trace(x0,y0,w,h,-1,9,-90,50,f,BLUE,2.8);
  var X=function(u){return x0+(u+1)/10*w;};
  A(X(0),y0-h-8,0,22,GREY,'',2);TB('1',X(0),y0-h-14,GREY,12);A(X(5),y0-h-8,0,22,GREY,'',2);TB('2',X(5),y0-h-14,GREY,12);
  LN(X(5),y0-(-70+90)/140*h,X(5)+0,y0-(-70+90)/140*h,RED,2);
  bio_pop(p,function(){ctx.fillStyle='rgba(226,75,74,.1)';ctx.fillRect(X(.8),y0-h,X(4.2)-X(.8),h);TB('Na⁺ inactivés',(X(.8)+X(4.2))/2,y0-h+16,DRED,12);TB('pas de 2e potentiel d\'action',W*.95,y0-h*.4,DRED,13,'right');TB('→ période réfractaire (canaux Na⁺ inactivés)',W*.5,H*.95,DGREEN,13);});},
 function(p){ /* 12 hyperkaliémie */
  bio_cap('Potentiel de repos et seuil (−55 mV)',22);
  var x0=W*.14,w=W*.78;var X=function(v){return x0+(v+72)/(20)*w;};var y=H*.5;
  LN(x0,y,x0+w,y,INK,2);[-70,-65,-60,-55].forEach(function(v){LN(X(v),y-5,X(v),y+5,INK,1.4);TB((v+'').replace('-','−'),X(v),y+20,GREY,12);});
  LN(X(-55),y-60,X(-55),y+8,RED,2.4,[5,4]);TB('seuil',X(-55),y-68,DRED,13);
  [[-68.6,'K⁺ 5',GREEN],[-62.0,'K⁺ 8',ORANGE],[-55.2,'K⁺ 12',RED]].forEach(function(q,i){DOT(X(q[0]),y,7,q[2]);TB(q[1],X(q[0]),y-18-i*0,dk(q[2]),13);});
  bio_pop(p,function(){[[-68.6,13.6],[-62.0,7.0],[-55.2,.2]].forEach(function(q,i){var yy=y+46+i*20;LN(X(q[0]),yy,X(-55),yy,GREY,2);TB(String(q[1]).replace('.',',')+' mV',X(q[0])-6,yy+4,INK,12,'right');});TB('distance au seuil : 13,6 · 7,0 · 0,2 mV',W*.5,H*.97,DRED,13);});},
 function(p){ /* 13 AMPc PDE caféine */
  bio_cap('Signal arrêté à t = 25 s : décroissance de l\'AMPc',22);
  var x0=W*.12,y0=H*.8,w=W*.8,h=H*.56;var sx=function(t){return x0+t/50*w;},sy=function(v){return y0-v/6*h;};
  bio_ax(x0,y0,w,h,'t (s)','AMPc µmol/L');
  var f=function(k){return function(t){var pl=.5/k;return t<25?pl*(1-Math.exp(-k*t)):pl*(1-Math.exp(-k*25))*Math.exp(-k*(t-25));};};
  bio_fn(f(.2),0,50,sx,sy,BLUE,2.8,200);TB('PDE seule',sx(8),sy(2.5)-8,BLUE_D,12);LN(sx(25),y0,sx(25),y0-h,AX,1.2,[4,4]);
  bio_pop(p,function(){bio_fn(f(.1),0,50,sx,sy,ORA2,2.8,200);TB('+ caféine (Km × 2)',sx(14),sy(4.1)-8,DRED,12);TB('plateau 5,0 · demi-vie 6,9 s',x0+w,y0-h*.97,DRED,13,'right');});}
]);
