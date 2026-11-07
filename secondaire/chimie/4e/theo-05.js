/* Chimie 4e · chapitre 5 · Lire une équation */
function q5_n2h3(x,y,s,a){qal(a);qmol(x,y,'N2',s);qal(1);}
function q5_stack(x,y,w,h,segs,sc){var xx=x;segs.forEach(function(g){var ww=g[0]*sc;ctx.fillStyle=g[2]+'33';ctx.strokeStyle=g[2];ctx.lineWidth=2;ctx.fillRect(xx,y,ww,h);ctx.strokeRect(xx,y,ww,h);TB(g[1],xx+ww/2,y+h/2+5,dk(g[2]),15);xx+=ww;});return xx;}
SFA.theo("c05",{
 icon:function(){TB('N₂ + 3 H₂ → 2 NH₃',W*.5,H*.45,BLUE_D,30);TB('coefficients = moles',W*.5,H*.68,ORANGE,20);},
 anim:function(t){var P=720,k=(t%P)/P,ar=1-qr(k,.3,.5),pr=qr(k,.45,.65);TB('N₂ + 3 H₂  →  2 NH₃',W*.5,H*.1,BLUE_D,19);
  var y=H*.36;qal(ar);qmol(W*.09,y,'N2',1.1);for(var i=0;i<3;i++)qmol(W*(.19+i*.075),y+(i%2?10:-10),'H2',1.1);qal(1);
  qal(pr);for(var j=0;j<2;j++)qmol(W*(.66+j*.14),y,'NH3',1.2);qal(1);
  var cx=W*.46+W*.06*Math.sin(k*20)*(ar>0&&ar<1?1:0);A(W*.43,y,W*.1,0,ORANGE,'',3);
  var rows=[['molécules','1  +  3  →  2'],['moles','1 mol  +  3 mol  →  2 mol'],['masses','28 g  +  6 g  →  34 g'],['atomes','2 N + 6 H  →  2 N + 6 H']];
  rows.forEach(function(r,i){qal(qr(k,.62+i*.07,.7+i*.07));TB(r[0],W*.12,H*.62+i*H*.1,GREY,14,'left');TB(r[1],W*.3,H*.62+i*H*.1,i===2?DGREEN:i===1?ORANGE:INK,16,'left');qal(1);});
  TB(k>.95?'':'',W*.5,H*.97,INK,14);},
 th:'<div class="tcard"><b class="h">Que dit une équation équilibrée ?</b><p>Les <b>coefficients</b> devant les formules donnent les proportions de <b>molécules</b>, donc de <b>moles</b>, qui réagissent. N<sub>2</sub> + 3 H<sub>2</sub> → 2 NH<sub>3</sub> : 1 molécule de N<sub>2</sub> réagit avec 3 molécules de H<sub>2</sub> pour en faire 2 de NH<sub>3</sub> ; ou 1 mol + 3 mol → 2 mol.</p><ul><li>Les coefficients ne sont <b>pas</b> des masses : « 2 H<sub>2</sub> + O<sub>2</sub> » ne veut pas dire 2 g de H<sub>2</sub> pour 1 g de O<sub>2</sub>.</li><li>Pour les <b>gaz</b> (même T et p), les coefficients sont aussi des rapports de <b>volumes</b>.</li></ul></div>'+
 '<div class="tcard"><b class="h">Loi de Lavoisier : rien ne se perd</b><p>Au cours d’une réaction, les atomes ne disparaissent pas : ils se réarrangent. <b>La masse totale se conserve</b> : somme des masses des réactifs = somme des masses des produits.</p><ul><li>N<sub>2</sub> + 3 H<sub>2</sub> → 2 NH<sub>3</sub> : 28 g + 6 g = 34 g. Mais le <b>nombre de moles</b> ne se conserve pas : 4 mol → 2 mol.</li><li>Si la masse semble varier, un gaz est entré ou sorti : un clou qui rouille s’alourdit (il capte O<sub>2</sub>) ; un flacon ouvert de calcaire + acide s’allège (CO<sub>2</sub> s’échappe).</li></ul></div>'+
 '<div class="tcard"><b class="h">Rapports stœchiométriques</b><p>Pour une réaction a A + b B → c C, les quantités de matière sont dans les proportions des coefficients : <b>n(A)/a = n(B)/b = n(C)/c</b>.</p><ul><li>2 Mg + O<sub>2</sub> → 2 MgO avec 2,4 g de Mg : n(Mg) = 2,4/24 = 0,10 mol ; n(MgO) = 0,10 mol → m = 0,10 × 40 = <b>4,0 g</b> ; n(O<sub>2</sub>) = 0,050 mol → 1,6 g. Contrôle : 2,4 + 1,6 = 4,0 ✓.</li><li>Méthode : masse → moles (÷ M) → rapport des coefficients → masse (× M).</li></ul></div>'+
 '<div class="tcard"><b class="h">Tableau d’avancement</b><p>L’<b>avancement ξ</b> (en mol) mesure combien de fois « l’équation s’est produite ». Chaque réactif perd (coefficient × ξ), chaque produit gagne (coefficient × ξ). La réaction s’arrête quand un réactif est épuisé : <b>ξ<sub>max</sub></b>.</p><p>Exemple : 2,0 mol de N<sub>2</sub> et 3,0 mol de H<sub>2</sub> : N<sub>2</sub> : 2,0 − ξ ; H<sub>2</sub> : 3,0 − 3ξ ; NH<sub>3</sub> : 2ξ. H<sub>2</sub> est épuisé si ξ = 1,0 mol (2,0 − ξ ≥ 0 permettrait 2,0) donc <b>ξ<sub>max</sub> = 1,0 mol</b> : il reste 1,0 mol de N<sub>2</sub> et il se forme 2,0 mol de NH<sub>3</sub>, soit 34 g.</p></div>'
});
SFA.figs("c05",[
 function(p){qtitle('N₂ + 3 H₂ → 2 NH₃',BLUE_D);for(var i=0;i<2;i++)qmol(W*(.2+i*.2),H*.4,'N2',1.5);TB('2 mol de N₂',W*.3,H*.58,INK,16);
  for(var j=0;j<6;j++){var a=j<3?1:qr(p,(j-3)*.12,(j-3)*.12+.25);if(p<=0&&j>=3)a=.15;qal(a);qmol(W*(.58+(j%3)*.12),H*.34+Math.floor(j/3)*H*.2,'H2',1.3);qal(1);}
  qal(qr(p,.4,1));TB('6,0 mol de H₂',W*.7,H*.8,ORANGE,20);qal(1);if(p<=0)TB('? mol de H₂',W*.7,H*.8,GREY,20);},
 function(p){qtitle('2 H₂ + O₂ → 2 H₂O');var n=3;for(var i=0;i<3;i++){q2_bag(W*(.12+i*.13),H*.4,W*.11,H*.2,'',BLUE,'#e6f1fb');}TB('3,0 mol H₂',W*.28,H*.62,BLUE_D,16);A(W*.5,H*.4,W*.08,0,ORANGE,'',3);
  for(var j=0;j<3;j++){qal(qr(p,j*.15,j*.15+.25)||(p<=0?.15:0));q2_bag(W*(.66+j*.1),H*.4,W*.09,H*.2,'',DGREEN,'#e3f4ee');qal(1);}
  qal(qr(p,.5,1));TB('3,0 mol H₂O  (même coefficient)',W*.5,H*.85,DGREEN,19);qal(1);if(p<=0)TB('? mol H₂O',W*.5,H*.85,GREY,19);},
 function(p){qtitle('2 H₂ + O₂ → 2 H₂O');var cols=[W*.22,W*.5,W*.78],M=[['2 mol','1 mol','2 mol'],['4 g','32 g','36 g']];qmol(cols[0],H*.28,'H2',1.2);qmol(cols[1],H*.28,'O2',1.2);qmol(cols[2],H*.28,'H2O',1.2);
  TB('moles',W*.05,H*.5,GREY,13,'left');TB('masses',W*.05,H*.7,GREY,13,'left');for(var c=0;c<3;c++){qal(qr(p,0,.3));TB(M[0][c],cols[c],H*.5,ORANGE,19);qal(1);qal(qr(p,.25,.55));TB(M[1][c],cols[c],H*.7,DGREEN,19);qal(1);}
  qal(qr(p,.6,1));TB('les coefficients = des moles, pas des grammes',W*.5,H*.92,INK,15);qal(1);},
 function(p){qtitle('2 Mg + O₂ → 2 MgO',BLUE_D);var sc=W*.7/4.0,x0=W*.15;TB('avant',x0,H*.3,GREY,14,'left');q5_stack(x0,H*.34,0,H*.14,[[2.4,'2,4 g Mg','#6bb26b'],[1.6,p>0?'1,6 g O₂':'? O₂',RED]],sc);
  TB('après',x0,H*.62,GREY,14,'left');var a=qr(p,0,.6);qal(a||.15);ctx.save();q5_stack(x0,H*.66,0,H*.14,[[4.0,'4,0 g MgO',ORANGE]],sc);ctx.restore();qal(1);if(p<=0)TB('?',x0+W*.35,H*.74,GREY,22);
  qal(qr(p,.5,1));TB('2,4 + 1,6 = 4,0 g',W*.5,H*.94,DGREEN,20);qal(1);},
 function(p){qtitle('CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂');var x=W*.3,y=H*.62;qflask(x,y,W*.2,H*.34,.45,'rgba(186,117,23,.25)','');qbal(x,y+4,W*.3,p>0?'−2,2 g':'5,0 g',p>0?DRED:DGREEN);
  for(var i=0;i<4;i++){var f=(p*3+i*.25)%1;qal(p>0?.8*(1-f):0);ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+(i-1.5)*8,y-H*.4-f*H*.25,5,0,7);ctx.stroke();qal(1);}
  qal(qr(p,0,.5));TB('CO₂ s’échappe',W*.62,H*.3,GREY,16,'left');qal(1);qal(qr(p,.3,1));TB('n = 5,0/100 = 0,050 mol',W*.62,H*.5,INK,15,'left');TB('m(CO₂) = 0,050 × 44 = 2,2 g',W*.62,H*.65,ORANGE,15,'left');qal(1);if(p<=0)TB('perte ?',W*.72,H*.6,GREY,20);},
 function(p){qtitle('CH₄ + 2 O₂ → CO₂ + 2 H₂O(liq)');var u=W*.12,y=H*.45;var b=[['CH₄',1,BLUE],['O₂',2,RED],['CO₂',1,GREEN]];var x=W*.08;b.forEach(function(q,i){var show=i===0||qr(p,i*.2-.1,i*.2+.3)>0||false;var a=i===0?1:(p>0?qr(p,i*.2-.1,i*.2+.3):.15);qal(a);qbox(x+q[1]*u/2+W*.0,y,q[1]*u-6,H*.3,'',q[2],12,q[2]+'22');TB(q[0],x+q[1]*u/2,y-4,dk(q[2]),16);TB(p>0||i===0?q[1]+',0 L':'? L',x+q[1]*u/2,y+H*.1,dk(q[2]),17);qal(1);x+=q[1]*u+(i===0?W*.1:W*.09)+0;if(i===0)TB('+',x-W*.05,y+5,INK,22);if(i===1)TB('→',x-W*.045,y+5,INK,22);});
  qal(qr(p,.5,1));TB('même T et p : coefficients = volumes',W*.5,H*.88,ORANGE,17);qal(1);},
 function(p){qtitle('4 Fe + 3 O₂ → 2 Fe₂O₃');var sc=W*.55/16,x0=W*.1;TB('clou 11,2 g',x0,H*.28,INK,14,'left');qbox(x0+11.2*sc/2,H*.4,11.2*sc,H*.12,'11,2 g Fe',ORA2,14,'#fdece4');
  var a=qr(p,0,.6);qal(a);qbox(x0+4.8*sc/2+11.2*sc,H*.4,4.8*sc,H*.12,'+4,8',BLUE,14,'#e6f1fb');qal(1);if(p<=0){qal(.5);TB('+ ?',x0+11.2*sc+22,H*.43,GREY,18);qal(1);}
  TB('rouille',x0,H*.62,INK,14,'left');qal(qr(p,.3,.8)||.12);qbox(x0+16*sc/2,H*.74,16*sc,H*.12,'16,0 g Fe₂O₃',ORANGE,15,'#fdf1e3');qal(1);
  qal(qr(p,.6,1));TB('O₂ capté : 4,8 g',W*.5,H*.95,BLUE_D,16);qal(1);},
 function(p){qtitle('N₂ + 3 H₂ → 2 NH₃');qmol(W*.08,H*.28,'N2',.8);for(var i=0;i<3;i++)qmol(W*(.18+i*.07),H*.28,'H2',.8);TB('→',W*.46,H*.3,INK,20);for(var j=0;j<2;j++)qmol(W*(.62+j*.12),H*.28,'NH3',.9);
  var a=qr(p,0,.5);TB('moles',W*.05,H*.55,GREY,14,'left');TB('masses',W*.05,H*.78,GREY,14,'left');
  qal(.3+.7*a);TB('4 mol  →  2 mol',W*.45,H*.55,DRED,20);qal(1);qal(.3+.7*a);TB('34 g  =  34 g',W*.45,H*.78,DGREEN,22);qal(1);qal(qr(p,.5,1));TB('masse conservée, moles non',W*.5,H*.95,ORANGE,16);qal(1);},
 function(p){qtitle('Tableau d’avancement (mol)');var x0=W*.06,cw=W*.22,y0=H*.2,rh=H*.16;var hd=['','N₂','H₂','NH₃'];var R=[['départ','2,0','3,0','0'],['à l’état ξ','2,0 − ξ','3,0 − 3ξ','2ξ'],['final','1,0','0','2,0']];
  hd.forEach(function(h,j){TB(h,x0+cw*(j+.5)+(j?W*.04:0),y0,BLUE_D,18);});R.forEach(function(r,i){var y=y0+rh*(i+1);LN(x0,y-rh*.45,W*.97,y-rh*.45,AX,1.2);var a=i<2?1:qr(p,0,.6);if(i===2&&p<=0)a=.18;r.forEach(function(c,j){qal(a);TB(c,x0+cw*(j+.5)+(j?W*.04:0),y+4,i===2&&j>0?ORANGE:INK,j===0?14:16,'center');qal(1);});});
  qal(qr(p,.5,1));TB('ξ_max = 1,0 mol  ·  m(NH₃) = 34 g',W*.5,H*.88,DGREEN,18);qal(1);if(p<=0)TB('ξ_max = ?',W*.5,H*.88,GREY,18);},
 function(p){qtitle('C + O₂ → CO₂ (barbecue)');var sc=W*.7/11,x0=W*.15;qbox(x0+1.5*sc,H*.34,3*sc,H*.14,'3,0 kg C',GREY,15,'#eceef1');var a=qr(p,0,.5);qal(a||.12);qbox(x0+3*sc+4*sc,H*.34,8*sc,H*.14,p>0?'8,0 kg O₂':'? O₂',RED,15,'#fcebeb');qal(1);
  var b=qr(p,.3,.8);qal(b||.12);qbox(x0+5.5*sc,H*.62,11*sc,H*.14,p>0?'11 kg CO₂':'? CO₂',ORANGE,16,'#fdf1e3');qal(1);
  qal(qr(p,.5,1));TB('250 mol C → 250 mol CO₂ (× 44 g)',W*.5,H*.9,DGREEN,16);qal(1);}
]);
