/* SFA · Chimie 3e · chapitre 08 : théorie animée et devantures */
(function(){
function sg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ga(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function g1(){ctx.globalAlpha=1;}
function rnd(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
function F(fn){return function(p){ctx.save();var s=Math.min(W/460,H/280);ctx.translate((W-460*s)/2,(H-280*s)/2);ctx.scale(s,s);ctx.lineCap='round';fn(p||0);ctx.restore();};}
function glass(x,y,w,h,lvl,col){if(lvl>0){ctx.fillStyle=col||'#cfe6f8';ctx.fillRect(x+1.5,y+h*(1-lvl),w-3,h*lvl-1.5);}
 ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-4,y-4);ctx.lineTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.lineTo(x+w+4,y-4);ctx.stroke();}
function ball(x,y,r,col,lab,tc){DOT(x,y,r,col);ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();if(lab)TB(lab,x,y+r*.36,tc||'#fff',Math.round(Math.max(10,r*1.0)));}
function box(x,y,w,h,col,fill,r){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||AX;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,r||8);ctx.fill();ctx.stroke();}
function chk(x,y,c,s){s=s||9;ctx.strokeStyle=c||DGREEN;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*.3,y+s*.7);ctx.lineTo(x+s,y-s*.8);ctx.stroke();}
function scale(x,y,w,val,col){ctx.fillStyle='#e9ecef';ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.roundRect(x,y,w,26,6);ctx.fill();ctx.stroke();
 ctx.fillStyle='#10202a';ctx.fillRect(x+w/2-34,y+4,68,18);TB(val,x+w/2,y+18,col||'#7ee0a8',14);}
function H2(x,y,r){ball(x-r*.8,y,r*.7,'#8fa3b8');ball(x+r*.8,y,r*.7,'#8fa3b8');}
var CH_O2='#d9534f';
var SUP={'1+':'⁺','2+':'²⁺','3+':'³⁺','1-':'⁻','2-':'²⁻','3-':'³⁻'};
function cs(q){return SUP[Math.abs(q)+(q>0?'+':'-')];}
function ion(x,y,r,s,q,sz){ball(x,y,r,q>0?'#e8806f':'#6fa6e0',s,'#fff');TB((Math.abs(q)>1?Math.abs(q):'')+(q>0?'+':'−'),x+r*.95,y-r*.6,q>0?DRED:BLUE_D,Math.round(Math.max(14,r*.75)));}
function ohm(x,y,r){ball(x,y,r,'#6fa6e0','OH','#fff');TB('−',x+r*.95,y-r*.6,BLUE_D,16);}
SFA.theo("c08", {
 icon: function () {
  TB('Na⁺ + Cl⁻ → NaCl',W*.5,H*.42,BLUE_D,30);TB('Al₂O₃ · Ca(OH)₂ · H₂SO₄',W*.5,H*.66,ORANGE,18);
 },
 anim: function (t) {
  var C=[{c:['Na',1,1],a:['Cl',1,1],f:'NaCl'},{c:['Mg',2,1],a:['Cl',1,2],f:'MgCl₂'},{c:['Al',3,2],a:['O',2,3],f:'Al₂O₃'},{c:['Ca',2,3],a:['PO₄',3,2],f:'Ca₃(PO₄)₂'}];
  var k=Math.floor(t/330)%4,u=(t%330)/330,e=u<.2?0:(u<.55?(u-.2)/.35:1);e=e*e*(3-2*e);
  var c=C[k],r=Math.min(H*.085,24),sp=Math.min(H*.2,56),L=function(a,b){return a+(b-a)*e;};
  var i,cy=H*.46;
  for(i=0;i<c.c[2];i++){var y=cy+(i-(c.c[2]-1)/2)*sp;ion(L(W*.14,W*.40),y,r,c.c[0],c.c[1]);}
  for(i=0;i<c.a[2];i++){var y2=cy+(i-(c.a[2]-1)/2)*sp;ion(L(W*.86,W*.60),y2,c.a[0]=='PO₄'?r*1.15:r,c.a[0],-c.a[1]);}
  TB(c.c[0]+cs(c.c[1]),W*.14,H*.12,DRED,20);TB(c.a[0]+cs(-c.a[1]),W*.86,H*.12,BLUE_D,20);
  if(e>.95){TB(c.f,W*.5,H*.1,INK,26);}
  else TB('+  →  ←',W*.5,H*.1,GREY,18);
  ga(sg(e,.8,1));
  TB(c.c[2]+' × (+'+c.c[1]+') = +'+(c.c[2]*c.c[1]),W*.25,H*.9,DRED,18);TB(c.a[2]+' × (−'+c.a[1]+') = −'+(c.a[2]*c.a[1]),W*.75,H*.9,BLUE_D,18);
  TB('= 0 : composé neutre',W*.5,H*.76,DGREEN,16);g1();
 },
 th:
 '<div class="tcard"><b class="h">Ions et charges à connaître</b><p>Cations : Na⁺, K⁺, Ag⁺ (1+) ; Mg²⁺, Ca²⁺, Zn²⁺, Cu²⁺ (2+) ; Al³⁺ (3+) ; Fe²⁺ et Fe³⁺. Anions : Cl⁻ (chlorure), F⁻, Br⁻, I⁻ ; O²⁻ (oxyde), S²⁻ (sulfure).</p><p>Ions composés (un groupe d\'atomes chargé, qui reste ensemble) : OH⁻ hydroxyde ; NO₃⁻ nitrate ; SO₄²⁻ sulfate ; CO₃²⁻ carbonate ; HCO₃⁻ hydrogénocarbonate ; PO₄³⁻ phosphate ; ClO₃⁻ chlorate ; NH₄⁺ ammonium.</p></div>' +
 '<div class="tcard"><b class="h">Écrire la formule d\'un composé ionique</b><p>Un composé ionique est <b>électriquement neutre</b> : la somme des charges positives égale la somme des charges négatives. <b>Méthode du croisement :</b> la charge de l\'un devient l\'indice de l\'autre, puis on simplifie. Al³⁺ + O²⁻ : 2 Al³⁺ (+6) et 3 O²⁻ (−6) → <code>Al₂O₃</code>. Si l\'ion composé doit être répété, on le met <b>entre parenthèses</b> : Ca²⁺ + PO₄³⁻ → <code>Ca₃(PO₄)₂</code> ; Al³⁺ + SO₄²⁻ → <code>Al₂(SO₄)₃</code>.</p><p><b>Retrouver une charge :</b> dans Al₂(SO₄)₃, 3 × (−2) = −6, donc 2 ions Al portent +6 : chacun est Al³⁺.</p></div>' +
 '<div class="tcard"><b class="h">Les quatre familles</b><p><b>Oxydes</b> : contiennent O²⁻ (MgO, Fe₂O₃, CO₂). <b>Bases (hydroxydes)</b> : contiennent OH⁻ (NaOH, Ca(OH)₂). <b>Acides</b> : de l\'hydrogène H lié à un anion, qui libère H⁺ dans l\'eau (HCl, HNO₃, H₂SO₄). <b>Sels</b> : cation métallique (ou NH₄⁺) + anion autre que O²⁻ et OH⁻ (NaCl, CaCO₃, KNO₃, CuSO₄).</p><p>Nom d\'un composé ionique : « nom de l\'anion de nom du cation » : chlorure de sodium, hydroxyde de calcium, sulfate de cuivre(II). Si le métal a plusieurs ions (fer, cuivre), on précise la charge en chiffres romains : FeCl₂ chlorure de fer(II), FeCl₃ chlorure de fer(III).</p></div>' +
 '<div class="tcard"><b class="h">Pièges, sécurité, neutralisation</b><p><b style="color:#a32d2d">Piège :</b> chlorure (Cl⁻, NaCl) n\'est pas chlorate (ClO₃⁻, NaClO₃, qui contient de l\'oxygène). Ne confonds pas le nom de l\'ion et sa formule.</p><p><b>Danger :</b> eau de Javel (NaClO) + acide (détartrant HCl) : NaClO + 2 HCl → Cl₂ + NaCl + H₂O. Le dichlore Cl₂ est un gaz toxique et irritant : ne jamais mélanger ces produits.</p><p><b>Neutralisation :</b> acide + base → sel + eau. Ca(OH)₂ + 2 HCl → CaCl₂ + 2 H₂O (atomes : Ca 1, O 2, H 4, Cl 2 de chaque côté).</p></div>'
});
SFA.figs("c08", [
 // 0 écrire des formules
 F(function(p){
  var Q=[['chlorure de potassium','K⁺ + Cl⁻','KCl'],['oxyde de magnésium','Mg²⁺ + O²⁻','MgO'],['hydroxyde de sodium','Na⁺ + OH⁻','NaOH'],['sulfate de sodium','Na⁺ + SO₄²⁻','Na₂SO₄']];
  Q.forEach(function(q,i){var x=10+(i%2)*226,y=10+Math.floor(i/2)*135;box(x,y,214,124,AX,'#fff',12);
   TB(q[0],x+107,y+26,INK,14);TB(q[1],x+107,y+56,GREY,16);
   if(p>0){ga(sg(p,i*.15,i*.15+.35));TB(q[2],x+107,y+104,DGREEN,30);g1();}else TB('?',x+107,y+104,GREY,30);});
 }),
 // 1 lire un nom
 F(function(p){
  TB('Ca(OH)₂',230,56,INK,38);
  if(p>0){ga(sg(p,0,.4));ion(120,130,24,'Ca',2);TB('+',170,138,GREY,22);ohm(222,130,22);ohm(290,130,22);TB('2 OH⁻',256,176,BLUE_D,14);TB('Ca²⁺',120,176,DRED,14);g1();
   ga(sg(p,.4,1));box(80,196,300,64,DGREEN,'#e3f5ee',12);TB('hydroxyde de calcium',230,226,DGREEN,22);TB('famille : base',230,250,INK,14);g1();}
  else {TB('quel nom ?',230,150,GREY,22);TB('oxyde · hydroxyde · chlorure · carbonate ?',230,200,GREY,14);}
 }),
 // 2 aluminium
 F(function(p){
  ion(60,60,24,'Al',3);ion(160,60,24,'O',-2);TB('Al³⁺',60,108,DRED,15);TB('O²⁻',160,108,BLUE_D,15);
  if(p>0){ga(sg(p,0,.4));A(76,74,70,30,GREY,'',2);A(144,74,-70,30,GREY,'',2);
   TB('Al₂O₃',110,170,DGREEN,34);g1();
   ga(sg(p,.4,.8));TB('2 × (+3) = +6',110,204,DRED,15);TB('3 × (−2) = −6',110,226,BLUE_D,15);g1();
   ga(sg(p,.6,1));box(250,24,196,232,DGREEN,'#e3f5ee',12);TB('chlorure',348,52,GREY,14);TB('AlCl₃',348,78,INK,22);TB('sulfure',348,108,GREY,14);TB('Al₂S₃',348,134,INK,22);TB('hydroxyde',348,164,GREY,14);TB('Al(OH)₃',348,190,INK,22);TB('oxyde : Al₂O₃',348,236,DGREEN,16);g1();}
  else {TB('Al³⁺ + O²⁻ → ?',230,170,GREY,26);}
 }),
 // 3 nommer des sels
 F(function(p){
  var Q=[['KNO₃','nitrate de potassium'],['CaCO₃','carbonate de calcium'],['Na₂SO₄','sulfate de sodium'],['MgCl₂','chlorure de magnésium'],['NH₄Cl',"chlorure d'ammonium"]];
  Q.forEach(function(q,i){var y=12+i*53;box(14,y,150,42,AX,'#fff',10);TB(q[0],89,y+29,INK,20);
   if(p>0){ga(sg(p,i*.14,i*.14+.3));box(178,y,268,42,DGREEN,'#e3f5ee',10);TB(q[1],312,y+28,DGREEN,16);g1();}
   else TB('?',312,y+30,GREY,22);});
 }),
 // 4 phosphate de calcium
 F(function(p){
  ion(60,90,20,'Ca',2);TB('+',110,98,GREY,22);ion(170,90,28,'PO₄',-3);
  TB('Ca²⁺',60,134,DRED,14);TB('PO₄³⁻',170,134,BLUE_D,14);
  if(p>0){ga(sg(p,0,.5));ion(60,170,20,'Ca',2);ion(60,220,20,'Ca',2);ion(170,196,28,'PO₄',-3);TB('3 × (+2) = +6',60,262,DRED,14);TB('2 × (−3) = −6',185,262,BLUE_D,14);g1();
   ga(sg(p,.5,1));box(260,60,190,110,DGREEN,'#e3f5ee',12);TB('Ca₃(PO₄)₂',355,120,DGREEN,28);TB('+6 = −6',355,152,INK,15);g1();}
  else {TB('CaPO₄ ?  Ca₃(PO₄)₂ ?',355,110,GREY,16);TB('charges à équilibrer',230,230,GREY,16);}
 }),
 // 5 oxyde, acide, base ou sel
 F(function(p){
  var Q=[['HNO₃','acide','acide nitrique',BLUE_D,'#e6f1fb'],['Fe₂O₃','oxyde','oxyde de fer(III)',ORA2,'#fdf0e4'],['KOH','base','hydroxyde de potassium',DGREEN,'#e3f5ee'],['CuSO₄','sel','sulfate de cuivre(II)',VIOLET,'#efeaf8'],['Mg(OH)₂','base','hydroxyde de magnésium',DGREEN,'#e3f5ee'],['CO₂','oxyde','dioxyde de carbone',ORA2,'#fdf0e4']];
  Q.forEach(function(q,i){var x=10+(i%2)*226,y=8+Math.floor(i/2)*90;
   var on=p>0?sg(p,i*.12,i*.12+.3):0;box(x,y,214,80,on>.5?q[3]:AX,on>.5?q[4]:'#fff',12);
   TB(q[0],x+107,y+36,INK,24);
   if(p>0){ga(on);TB(q[1]+' : '+q[2],x+107,y+64,q[3],13);g1();}else TB('?',x+107,y+64,GREY,16);});
 }),
 // 6 chlorure ou chlorate
 F(function(p){
  box(10,10,214,230,AX,'#fff',12);box(236,10,214,230,AX,'#fff',12);
  TB('NaCl',117,46,INK,26);ion(80,120,22,'Na',1);ion(156,120,22,'Cl',-1);
  TB('NaClO₃',343,46,INK,26);ion(300,120,22,'Na',1);
  ball(388,120,20,'#6fa6e0','Cl','#fff');for(var i=0;i<3;i++){var a=-1.57+i*2.09;ball(388+Math.cos(a)*32,120+Math.sin(a)*32+4,10,CH_O2,'O','#fff');}
  TB('−',422,92,BLUE_D,18);
  if(p>0){ga(sg(p,0,.5));TB('anion chlorure',117,190,DGREEN,16);TB('Cl⁻ : sans oxygène',117,214,INK,13);TB('anion chlorate',343,190,DRED,16);TB('ClO₃⁻ : avec oxygène',343,214,INK,13);g1();
   ga(sg(p,.5,1));TB('deux composés différents',230,268,DGREEN,16);g1();}
  else TB('même chose ?',230,266,GREY,18);
 }),
 // 7 les deux ions du fer
 F(function(p){
  ion(60,50,20,'Fe',2);ion(250,50,20,'Fe',3);TB('Fe²⁺',60,92,DRED,14);TB('Fe³⁺',250,92,DRED,14);
  var Q=[[10,'FeCl₂','chlorure de fer(II)'],[236,'FeCl₃','chlorure de fer(III)'],[10,'Fe₂O₃','oxyde de fer(III)'],[236,'FeSO₄','sulfate de fer(II)']];
  Q.forEach(function(q,i){var x=q[0],y=106+Math.floor(i/2)*84;box(x,y,214,74,AX,'#fff',12);
   if(p>0){ga(sg(p,i*.15,i*.15+.3));TB(q[1],x+107,y+36,DGREEN,26);TB(q[2],x+107,y+62,INK,13);g1();}else TB('?',x+107,y+46,GREY,26);});
  TB('(II) ou (III) :',375,48,GREY,13);TB('charge du fer',375,68,GREY,13);
 }),
 // 8 retrouver la charge
 F(function(p){
  TB('Al₂(SO₄)₃',230,50,INK,36);
  ball(90,120,24,'#e8806f','Al','#fff');ball(160,120,24,'#e8806f','Al','#fff');TB(p>0?'3+':'?',125,76,p>0?DRED:GREY,18);
  for(var i=0;i<3;i++)ion(250+i*70,120,24,'SO₄',-2);
  TB('2 ions',125,170,INK,14);TB('3 ions SO₄²⁻',320,170,INK,14);
  if(p>0){ga(sg(p,0,.5));box(40,190,380,74,DGREEN,'#e3f5ee',12);TB('3 × (−2) = −6  →  2 × x = +6',230,222,INK,18);TB('x = +3 : Al³⁺',230,252,DGREEN,22);g1();}
  else TB('2 × (?) + 3 × (−2) = 0',230,230,GREY,20);
 }),
 // 9 Javel + détartrant
 F(function(p){
  box(40,110,90,120,AX,'#fff',10);TB('Javel',85,160,INK,16);TB('NaClO',85,184,BLUE_D,15);
  box(150,110,90,120,AX,'#fff',10);TB('détartrant',195,160,INK,14);TB('HCl',195,184,BLUE_D,15);
  A(240,150,40,0,GREY,'',2);
  if(p>0){ga(sg(p,0,.6));for(var i=0;i<7;i++){var yy=100-i*5;ctx.fillStyle='rgba(190,205,40,.38)';ctx.beginPath();ctx.arc(330+rnd(i)*80-20,60+rnd(i+9)*60,24+rnd(i+3)*12,0,7);ctx.fill();}
   TB('Cl₂',350,100,'#6d7a00',24);g1();}
  ga(1-(p>0?sg(p,.3,.8):0));TB('NaClO + HCl → Cl₂ + NaCl + H₂O',230,22,INK,16);g1();
  if(p>0){ga(sg(p,.3,.8));TB('NaClO + 2 HCl → Cl₂ + NaCl + H₂O',230,22,DGREEN,16);g1();
   ga(sg(p,.6,1));box(40,244,380,32,DRED,'#fcebeb',8);TB('Cl₂ toxique : ne jamais mélanger · aérer',230,266,DRED,14);g1();}
  else TB('gaz ?',350,100,GREY,20);
 }),
 // 10 neutraliser
 F(function(p){
  var E=[['Ca(OH)₂ + HCl → CaCl₂ + H₂O','Ca(OH)₂ + 2 HCl → CaCl₂ + 2 H₂O','sel : chlorure de calcium'],['NaOH + H₂SO₄ → Na₂SO₄ + H₂O','2 NaOH + H₂SO₄ → Na₂SO₄ + 2 H₂O','sel : sulfate de sodium']];
  E.forEach(function(e,i){var y=60+i*100,a=p>0?sg(p,i*.3,i*.3+.4):0;
   ga(1-a);TB(e[0],230,y,INK,20);g1();ga(a);TB(e[1],230,y,DGREEN,20);TB(e[2],230,y+30,DRED,15);g1();});
  TB('(a)',24,60,GREY,15);TB('(b)',24,160,GREY,15);
  if(p>0){ga(sg(p,.6,1));TB('Na 2 · S 1 · O 6 · H 4 de chaque côté',230,262,DGREEN,15);g1();}
  else TB('acide + base → sel + eau',230,262,GREY,15);
 })
]);
})();
