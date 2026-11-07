/* Chimie 4e · chapitre 1 · Nomenclature. Ce fichier définit aussi les petites aides de dessin « q… » partagées par theo-02 … theo-10. */
function qr(v,a,b){return Math.max(0,Math.min(1,(v-a)/(b-a)));}
function qatCol(e){return {H:'#dfe5ec',C:'#5f6368',N:BLUE,O:RED,Na:VIOLET,Cl:GREEN,S:YEL,Mg:'#6bb26b',Ca:ORANGE,Fe:ORA2,Cu:'#c9743a',Zn:'#8a93a0',Ag:'#b7bdc4',K:VIOLET,Al:'#8a93a0',P:ORA2}[e]||ORANGE;}
function qat(x,y,r,e,lab){DOT(x,y,r,qatCol(e));ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();
 if(r>=7)TB(lab||e,x,y+Math.min(r*.36,6),e==='H'?INK:'#fff',Math.max(9,Math.round(Math.min(r*.95,15))));}
function qion(x,y,r,lab,z){var neg=z<0,pos=z>0;ctx.fillStyle=pos?'#fcebeb':neg?'#e6f1fb':'#f1efe8';ctx.strokeStyle=pos?RED:neg?BLUE:GREY;ctx.lineWidth=2.2;
 ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();TB(lab,x,y+r*.17,pos?DRED:neg?BLUE_D:INK,Math.max(10,Math.round(r*.8)));
 if(z){var s=(Math.abs(z)>1?Math.abs(z):'')+(pos?'+':'−');TB(s,x+r*.82,y-r*.78,pos?DRED:BLUE_D,Math.max(10,Math.round(r*.62)));}}
function qbox(x,y,w,h,txt,col,fs,fill){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,8);ctx.fill();ctx.stroke();
 if(txt)TB(txt,x,y+(fs||14)*.35,dk(col||BLUE),fs||14);}
function qbeak(x,y,w,h,lvl,col,lab){if(lvl>0){ctx.fillStyle=col||'rgba(55,138,221,.25)';ctx.fillRect(x-w/2+2,y-h*lvl,w-4,h*lvl-2);}
 ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-w/2,y-h);ctx.lineTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w/2,y-h);ctx.stroke();
 if(lab)TB(lab,x,y+16,INK,12);}
function qflask(x,y,w,h,lvl,col,lab){var nw=w*.2,bh=h*.62,top=y-h;ctx.beginPath();ctx.moveTo(x-nw/2,top);ctx.lineTo(x-nw/2,y-bh);ctx.quadraticCurveTo(x-w/2,y-bh+h*.06,x-w/2,y-bh*.45);
 ctx.quadraticCurveTo(x-w/2,y,x-w*.25,y);ctx.lineTo(x+w*.25,y);ctx.quadraticCurveTo(x+w/2,y,x+w/2,y-bh*.45);ctx.quadraticCurveTo(x+w/2,y-bh+h*.06,x+nw/2,y-bh);ctx.lineTo(x+nw/2,top);
 if(lvl>0){ctx.save();ctx.clip();ctx.fillStyle=col||'rgba(55,138,221,.28)';var ly=lvl<=1?y-bh*lvl*1.0:y-bh-(lvl-1)*(h-bh);ctx.fillRect(x-w,ly,2*w,h);ctx.restore();ctx.beginPath();
  ctx.moveTo(x-nw/2,top);ctx.lineTo(x-nw/2,y-bh);ctx.quadraticCurveTo(x-w/2,y-bh+h*.06,x-w/2,y-bh*.45);ctx.quadraticCurveTo(x-w/2,y,x-w*.25,y);ctx.lineTo(x+w*.25,y);ctx.quadraticCurveTo(x+w/2,y,x+w/2,y-bh*.45);ctx.quadraticCurveTo(x+w/2,y-bh+h*.06,x+nw/2,y-bh);ctx.lineTo(x+nw/2,top);}
 ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.stroke();LN(x-nw/2-4,y-bh-(h-bh)*.5,x+nw/2+4,y-bh-(h-bh)*.5,RED,1.8);if(lab)TB(lab,x,y+16,INK,12);}
function qmol(x,y,type,s){s=s||1;var B=function(a,b){LN(a[0],a[1],b[0],b[1],'#8a8f96',3*s);},o;
 if(type==='H2O'){o=[x,y-4*s];var h1=[x-17*s,y+11*s],h2=[x+17*s,y+11*s];B(o,h1);B(o,h2);qat(h1[0],h1[1],7*s,'H');qat(h2[0],h2[1],7*s,'H');qat(o[0],o[1],11*s,'O');}
 else if(type==='CO2'){B([x-24*s,y],[x+24*s,y]);qat(x-24*s,y,10*s,'O');qat(x+24*s,y,10*s,'O');qat(x,y,10*s,'C');}
 else if(type==='O2'){B([x-11*s,y],[x+11*s,y]);qat(x-11*s,y,10*s,'O');qat(x+11*s,y,10*s,'O');}
 else if(type==='N2'){B([x-11*s,y],[x+11*s,y]);qat(x-11*s,y,10*s,'N');qat(x+11*s,y,10*s,'N');}
 else if(type==='H2'){B([x-8*s,y],[x+8*s,y]);qat(x-8*s,y,7*s,'H');qat(x+8*s,y,7*s,'H');}
 else if(type==='NH3'){var n=[x,y-3*s];[[-17,11],[0,16],[17,11]].forEach(function(d){B(n,[x+d[0]*s,y+d[1]*s]);});[[-17,11],[0,16],[17,11]].forEach(function(d){qat(x+d[0]*s,y+d[1]*s,6*s,'H');});qat(n[0],n[1],10*s,'N');}
 else if(type==='CH4'){var c=[x,y];[[-17,-13],[17,-13],[-17,15],[17,15]].forEach(function(d){B(c,[x+d[0]*s,y+d[1]*s]);});[[-17,-13],[17,-13],[-17,15],[17,15]].forEach(function(d){qat(x+d[0]*s,y+d[1]*s,6*s,'H');});qat(c[0],c[1],10*s,'C');}}
function qbal(x,y,w,txt,col){ctx.fillStyle='#e9ecef';ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-w/2,y,w,34,6);ctx.fill();ctx.stroke();
 ctx.fillStyle='#fff';ctx.fillRect(x-w*.22,y+8,w*.44,18);TB(txt,x,y+22,col||DGREEN,13);LN(x-w*.4,y-4,x+w*.4,y-4,INK,3);}
function qbar(x,y,w,h,frac,col){ctx.fillStyle='#eceef1';ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fill();if(frac>0){ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x,y,Math.max(h,w*frac),h,h/2);ctx.fill();}}
function qal(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function qtitle(s,col){TB(s,W*.5,H*.1,col||BLUE_D,Math.max(13,Math.round(W/34)));}
/* chaîne pas à pas : affiche les lignes l'une après l'autre au fil de p */
function qsteps(p,lines,y0,dy,x,fs){lines.forEach(function(L,i){var a=qr(p,.08+i*.2,.28+i*.2);if(a<=0)return;qal(a);TB(L[0],x==null?W*.5:x,y0+i*dy,L[1]||INK,fs||14,x==null?'center':'left');qal(1);});}

/* ---------- chapitre 1 ---------- */
var q1_C=[ // [cation, zc, nc, anion, za, na, formule, nom]
 ['Na',1,1,'Cl',-1,1,'NaCl','chlorure de sodium'],['Ca',2,1,'Cl',-1,2,'CaCl₂','chlorure de calcium'],['Al',3,2,'SO₄',-2,3,'Al₂(SO₄)₃','sulfate d’aluminium']];
function q1_row(x0,x1,y,n,lab,z,r,k){var step=(x1-x0)/Math.max(1,n);for(var i=0;i<n;i++){var a=qr(k,i,i+.7);if(a<=0)continue;qal(a);qion(x0+step*(i+.5),y-(1-a)*14,r,lab,z);qal(1);}}
SFA.theo("c01",{
 icon:function(){TB('Ca²⁺ + 2 Cl⁻',W*.5,H*.42,BLUE_D,30);TB('→ CaCl₂',W*.5,H*.68,ORANGE,26);},
 anim:function(t){var P=520,i=Math.floor(t/P)%3,k=(t%P)/P,c=q1_C[i],r=Math.min(26,H*.1);
  var nA=c[2],nB=c[5],tot=nA+nB,s=qr(k,0,.7)*tot,sh=Math.min(tot,Math.floor(s+.001));
  TB('Une formule = des ions qui s’annulent',W*.5,H*.1,BLUE_D,16);
  var w=W*.8,x0=W*.1;
  var cs=Math.min(nA,s),as=Math.max(0,Math.min(nB,s-nA)); // apparition : cations d'abord, puis anions
  q1_row(x0,x0+w*.45,H*.4,nA,c[0],c[1],r+4,cs);q1_row(x0+w*.5,x0+w,H*.4,nB,c[3],c[4],r+4,as);
  var charge=c[1]*Math.min(nA,Math.floor(cs+.001))+c[4]*Math.min(nB,Math.floor(as+.001));
  TB(nA+' × ('+(c[1]>0?'+':'')+c[1]+')',x0+w*.225,H*.6,DRED,15);TB(nB+' × ('+c[4]+')',x0+w*.75,H*.6,BLUE_D,15);
  qbar(W*.2,H*.72,W*.6,12,0,GREY);LN(W*.5,H*.7,W*.5,H*.78,INK,2);
  var tot2=c[1]*nA+c[4]*nB;var q=Math.max(-1,Math.min(1,charge/6));
  ctx.fillStyle=charge>0?RED:BLUE;ctx.fillRect(W*.5,H*.72,W*.3*q,12);
  TB('charge totale : '+(charge>0?'+':charge<0?'−':'')+Math.abs(charge),W*.5,H*.84,charge===0&&k>.7?DGREEN:INK,15);
  if(k>.72){qal(qr(k,.72,.8));TB(c[6]+'  :  '+c[7],W*.5,H*.95,ORANGE,17);qal(1);}
 },
 th:'<div class="tcard"><b class="h">Ions et charges</b><p>Un <b>cation</b> (charge +) est un atome de métal qui a perdu des électrons : Na<sup>+</sup>, Mg<sup>2+</sup>, Ca<sup>2+</sup>, Al<sup>3+</sup>, NH<sub>4</sub><sup>+</sup>. Un <b>anion</b> (charge −) a gagné des électrons : Cl<sup>−</sup>, O<sup>2−</sup>, OH<sup>−</sup>, NO<sub>3</sub><sup>−</sup>, SO<sub>4</sub><sup>2−</sup>, CO<sub>3</sub><sup>2−</sup>, PO<sub>4</sub><sup>3−</sup>. Un ion <b>polyatomique</b> (SO<sub>4</sub><sup>2−</sup>, OH<sup>−</sup>…) reste un seul bloc : on ne le découpe jamais.</p><ul><li>Anions simples : terminaison <b>-ure</b> (chlorure, sulfure) sauf l’oxygène : <b>oxyde</b>.</li><li>Ions fréquents à connaître par cœur : les ions listés ci-dessus, avec leur charge.</li></ul></div>'+
 '<div class="tcard"><b class="h">Écrire une formule : la neutralité</b><p>Un composé ionique est <b>neutre</b> : la somme des charges vaut 0. Méthode : on <b>croise les charges</b> (l’indice d’un ion est la valeur de la charge de l’autre), on simplifie, puis on contrôle.</p><ul><li>Al<sup>3+</sup> et SO<sub>4</sub><sup>2−</sup> : 2 Al (+6) et 3 SO<sub>4</sub> (−6) → <b>Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub></b>.</li><li>Un ion polyatomique présent plus d’une fois se met entre <b>parenthèses</b> : Ca(OH)<sub>2</sub>, mais NaOH.</li><li>On écrit les <b>plus petits indices entiers</b> : MgO et non Mg<sub>2</sub>O<sub>2</sub>.</li></ul></div>'+
 '<div class="tcard"><b class="h">Nommer un composé</b><p>On nomme d’abord l’<b>anion</b>, puis le <b>cation</b> : « sulfate de potassium » pour K<sub>2</sub>SO<sub>4</sub>. Aucun préfixe devant le cation : on ne dit pas « sulfate de dipotassium ».</p><ul><li>Pour les métaux à plusieurs charges, on indique la charge en chiffres romains : Fe<sup>2+</sup> → fer (II), Fe<sup>3+</sup> → fer (III). Fe<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub> : 3 × (−2) = −6, donc chaque Fe porte +3 : <b>sulfate de fer (III)</b>.</li><li>Piège : <b>sulfate</b> SO<sub>4</sub><sup>2−</sup> (4 O) ≠ <b>sulfite</b> SO<sub>3</sub><sup>2−</sup> (3 O) ≠ <b>sulfure</b> S<sup>2−</sup> (pas d’O).</li></ul></div>'+
 '<div class="tcard"><b class="h">Les grandes familles</b><ul><li><b>Oxydes</b> : métal + O<sup>2−</sup> (Al<sub>2</sub>O<sub>3</sub>, K<sub>2</sub>O).</li><li><b>Hydroxydes</b> (bases) : métal + OH<sup>−</sup> (NaOH, Ca(OH)<sub>2</sub>).</li><li><b>Acides</b> : H<sup>+</sup> + anion (HCl, H<sub>2</sub>SO<sub>4</sub>, H<sub>3</sub>PO<sub>4</sub>).</li><li><b>Sels</b> : cation métallique + anion (NaCl, CaCO<sub>3</sub>).</li></ul><p><b>Acide + base → sel + eau.</b> Exemple : 2 H<sub>3</sub>PO<sub>4</sub> + 3 Mg(OH)<sub>2</sub> → Mg<sub>3</sub>(PO<sub>4</sub>)<sub>2</sub> + 6 H<sub>2</sub>O (6 H<sup>+</sup> cédés = 6 OH<sup>−</sup> captés).</p></div>'
});
/* devantures : une par exercice, dans l’ordre de exos-01.js */
function q1_set(xc,y,n,lab,z,r,dx){for(var i=0;i<n;i++)qion(xc+(i-(n-1)/2)*dx,y,r,lab,z);}
function q1_sum(txt,col){TB(txt,W*.5,H*.9,col,16);}
SFA.figs("c01",[
 function(p){ // CaCl2
  var r=Math.min(34,H*.13);qion(W*.3,H*.45,r+6,'Ca',2);TB('+2',W*.3,H*.72,DRED,18);
  qion(W*.58,H*.45,r,'Cl',-1);qal(.25+.75*qr(p,0,.4));qion(W*.78,H*.45,r,'Cl',-1);qal(1);TB('−1',W*.58,H*.72,BLUE_D,18);
  TB('−1',W*.78,H*.72,BLUE_D,18,'center');qal(qr(p,.4,.9));TB('+2 − 2 = 0   →   CaCl₂',W*.5,H*.92,ORANGE,22);qal(1);if(p<=0)TB('Ca²⁺ + Cl⁻ → ?',W*.5,H*.92,GREY,18);},
 function(p){ // K2SO4
  var r=Math.min(30,H*.12);qion(W*.2,H*.42,r,'K',1);qion(W*.38,H*.42,r,'K',1);qion(W*.68,H*.42,r+8,'SO₄',-2);
  TB('K₂SO₄',W*.5,H*.8,INK,22);qal(qr(p,0,.5));TB('sulfate de potassium',W*.5,H*.93,ORANGE,18);qal(1);
  qal(qr(p,.2,.7));TB('2×(+1) + (−2) = 0',W*.5,H*.17,DGREEN,15);qal(1);},
 function(p){ // Al(OH)3
  var r=Math.min(28,H*.11);qion(W*.2,H*.42,r+8,'Al',3);for(var i=0;i<3;i++){var a=i===0?1:.25+.75*qr(p,i*.2-.2,i*.2+.15);qal(a);qion(W*.45+i*W*.17,H*.42,r,'OH',-1);qal(1);}
  TB('+3',W*.2,H*.72,DRED,16);TB('3 × (−1)',W*.62,H*.72,BLUE_D,16);
  qal(qr(p,.4,.9));TB('Al(OH)₃',W*.5,H*.92,ORANGE,24);qal(1);if(p<=0)TB('Al³⁺ + OH⁻ → ?',W*.5,H*.92,GREY,18);},
 function(p){ // Ca3(PO4)2 bilan 6 / 6
  var cx=W*.5;TB('Ca₃(PO₄)₂ ?',cx,H*.14,INK,20);
  for(var i=0;i<3;i++)qion(W*.12+i*W*.13,H*.42,H*.09,'Ca',2);for(var j=0;j<2;j++)qion(W*.6+j*W*.16,H*.42,H*.1,'PO₄',-3);
  var a=qr(p,0,.6);ctx.fillStyle=RED;ctx.fillRect(W*.1,H*.68,W*.3*a,16);ctx.fillStyle=BLUE;ctx.fillRect(W*.9-W*.3*a,H*.8,W*.3*a,16);
  if(p>0){qal(a);TB('+6',W*.12,H*.665,DRED,14,'left');TB('−6',W*.88,H*.78,BLUE_D,14,'right');qal(1);}else{TB('charges ?',W*.5,H*.8,GREY,15);}
  qal(qr(p,.6,1));TB('3 × (+2) = 2 × (−3)',W*.5,H*.95,DGREEN,16);qal(1);},
 function(p){ // Fe2(SO4)3
  var r=Math.min(24,H*.1);for(var i=0;i<3;i++)qion(W*.5+(i-1)*W*.2,H*.4,r+4,'SO₄',-2);TB('3 × (−2) = −6',W*.5,H*.62,BLUE_D,17);
  TB('Fe₂(SO₄)₃',W*.5,H*.14,INK,20);
  if(p<=0)TB('2 Fe : ?',W*.5,H*.88,GREY,18);qal(qr(p,0,.6));TB('2 Fe = +6  →  Fe³⁺',W*.5,H*.88,DRED,18);qal(1);qal(qr(p,.6,1));TB('fer (III)',W*.84,H*.88,ORANGE,18);qal(1);},
 function(p){ // sulfate / sulfite
  var cx1=W*.28,cx2=W*.72,y=H*.5;function oxo(cx,n){qat(cx,y,H*.1,'S');for(var i=0;i<n;i++){var a=-Math.PI/2+i*2*Math.PI/n+(n===3?Math.PI/3:Math.PI/4);var ox=cx+Math.cos(a)*H*.2,oy=y+Math.sin(a)*H*.2;LN(cx,y,ox,oy,'#8a8f96',3);qat(ox,oy,H*.07,'O');}}
  oxo(cx1,4);oxo(cx2,3);TB('SO₄²⁻',cx1,H*.17,INK,16);TB('SO₃²⁻',cx2,H*.17,INK,16);
  var a=qr(p,0,.6);qal(a);TB('sulfate',cx1,H*.88,DGREEN,17);TB('sulfite',cx2,H*.88,ORANGE,17);qal(1);if(p<=0){TB('4 O',cx1,H*.88,GREY,16);TB('3 O',cx2,H*.88,GREY,16);}
  TB('Na₂SO₃ ?',W*.5,H*.97,INK,14);},
 function(p){ // H3PO4 + Mg(OH)2
  TB('H₃PO₄ + Mg(OH)₂ → sel + H₂O',W*.5,H*.14,INK,17);
  var a=qr(p,0,.5);var nA=p>0?2:1,nB=p>0?3:1;
  for(var i=0;i<6;i++){var show=i<3*nA;if(show)qion(W*.1+i*W*.065,H*.38,H*.045,'H',1);}
  for(var j=0;j<6;j++){var sh=j<2*nB;if(sh)qion(W*.57+j*W*.065,H*.38,H*.045,'OH',-1);}
  TB(3*nA+' H⁺',W*.28,H*.58,DRED,17);TB(2*nB+' OH⁻',W*.75,H*.58,BLUE_D,17);
  qal(qr(p,.3,.8));TB('2 H₃PO₄ + 3 Mg(OH)₂ → Mg₃(PO₄)₂ + 6 H₂O',W*.5,H*.8,ORANGE,Math.round(W/31));TB('6 H⁺ = 6 OH⁻',W*.5,H*.93,DGREEN,16);qal(1);},
 function(p){ // chasse formule fausse
  var F=['Al₂O₃','K₂O','Mg₂O₂','Ca(OH)₂'];for(var i=0;i<4;i++){var x=W*(.27+(i%2)*.46),y=H*(.3+Math.floor(i/2)*.36);var bad=i===2&&p>0;qbox(x,y,W*.38,H*.26,F[i],bad?RED:BLUE,Math.round(W/16),bad?'#fcebeb':'#fff');
   if(bad){qal(qr(p,0,.4));LN(x-W*.15,y-H*.09,x+W*.15,y+H*.09,RED,3.5);qal(1);}}
  qal(qr(p,.4,.9));TB('÷ 2  →  MgO',W*.5,H*.93,ORANGE,19);qal(1);if(p<=0)TB('laquelle est fausse ?',W*.5,H*.93,GREY,16);},
 function(p){ // quel métal
  var x0=W*.08,w=W*.84,y=H*.38,h=H*.2;TB('M₃(PO₄)₂ : 310 g/mol',W*.5,H*.16,INK,18);
  var w1=w*190/310;ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.lineWidth=2;ctx.fillRect(x0,y,w1,h);ctx.strokeRect(x0,y,w1,h);TB('2 PO₄ : 190',x0+w1/2,y+h*.6,ORA2,16);
  var a=qr(p,0,.6);ctx.fillStyle=a>0?'#e6f1fb':'#f6f7f9';ctx.strokeStyle=BLUE;ctx.fillRect(x0+w1,y,w-w1,h);ctx.strokeRect(x0+w1,y,w-w1,h);TB(a>0?'3 M : 120':'3 M : ?',x0+w1+(w-w1)/2,y+h*.6,BLUE_D,16);
  qal(qr(p,.4,.9));TB('M = 120 / 3 = 40 g/mol',W*.5,H*.8,DGREEN,19);TB('M = Ca',W*.5,H*.93,ORANGE,22);qal(1);},
 function(p){ // quel chlorure de fer
  TB('1,625 g  ÷  0,0100 mol',W*.5,H*.16,INK,19);var x0=W*.2,w=W*.55;var sc=w/180;
  [['FeCl₂',127,BLUE],['FeCl₃',162.5,GREEN]].forEach(function(r,i){var y=H*(.34+i*.2);qbar(x0,y,w,16,r[1]*sc/w,i&&p>0?GREEN:'#b9c4d0');TB(r[0],x0-2,y+13,INK,15,'right');TB(String(r[1]).replace('.',',')+' g/mol',x0+r[1]*sc+8,y+13,GREY,14,'left');});
  var xm=x0+162.5*sc;if(p>0){qal(qr(p,0,.5));LN(xm,H*.28,xm,H*.7,RED,2.2,[5,4]);TB('M = 162,5',xm,H*.78,DRED,16);qal(1);}
  qal(qr(p,.5,1));TB('FeCl₃ : chlorure de fer (III)',W*.5,H*.93,ORANGE,19);qal(1);if(p<=0)TB('M = m / n = ?',W*.5,H*.93,GREY,17);}
]);
