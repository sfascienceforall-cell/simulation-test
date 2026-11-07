/* Chimie 4e · chapitre 2 · La mole */
function q2_bag(x,y,w,h,lab,col,fill){ctx.fillStyle=fill||'#fdf1e3';ctx.strokeStyle=col||ORANGE;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x-w*.3,y-h/2);ctx.lineTo(x+w*.3,y-h/2);ctx.quadraticCurveTo(x+w*.62,y-h*.1,x+w/2,y+h*.3);ctx.quadraticCurveTo(x+w*.45,y+h/2,x,y+h/2);ctx.quadraticCurveTo(x-w*.45,y+h/2,x-w/2,y+h*.3);ctx.quadraticCurveTo(x-w*.62,y-h*.1,x-w*.3,y-h/2);ctx.fill();ctx.stroke();
 if(lab)TB(lab,x,y-h*.08,dk(col||ORANGE),Math.max(10,Math.round(w/6.5)));}
function q2_dots(x,y,w,h,n,col,seed){var s=seed||3;for(var i=0;i<n;i++){s=(s*9301+49297)%233280;var a=s/233280;s=(s*9301+49297)%233280;var b=s/233280;DOT(x-w/2+w*a,y-h/2+h*b,2.4,col);}}
function q2_fmt(n){return (n*6.02).toFixed(2).replace('.',',');}
SFA.theo("c02",{
 icon:function(){TB('N = n · Nₐ',W*.5,H*.42,BLUE_D,36);TB('6,02·10²³ mol⁻¹',W*.5,H*.68,ORANGE,22);},
 anim:function(t){var P=900,k=(t%P)/P,n=1+Math.floor(k*4);if(n>4)n=4;var f=k*4-Math.floor(k*4);
  TB('1 mole = un paquet de 6,02·10²³ entités',W*.5,H*.1,BLUE_D,16);
  var bw=Math.min(100,W*.17),y=H*.42;for(var i=0;i<4;i++){var on=i<n;var a=on?(i===n-1?qr(f,0,.3):1):.12;qal(a);q2_bag(W*.2+i*(bw+W*.04),y+(on&&i===n-1?(1-a)*-14:0),bw,H*.3,on?'6,02·10²³':'',ORANGE);if(on)q2_dots(W*.2+i*(bw+W*.04),y+H*.2*.7,bw*.6,H*.07,14,ORANGE,i+2);qal(1);}
  TB('n = '+n+' mol',W*.5,H*.68,INK,18);TB('N = n · Nₐ = '+n+' × 6,02·10²³ = '+q2_fmt(n)+'·10²³ entités',W*.5,H*.85,DGREEN,16);},
 th:'<div class="tcard"><b class="h">La mole : compter par paquets</b><p>Un atome est bien trop petit pour être compté un à un. Les chimistes comptent donc par <b>paquets</b>, comme on compte des œufs par douzaines. Une <b>mole</b> (mol) est le paquet de <b>N<sub>A</sub> = 6,02·10<sup>23</sup> entités</b> (atomes, molécules, ions…). N<sub>A</sub> s’appelle le <b>nombre d’Avogadro</b>.</p><ul><li>La mole est l’unité de la <b>quantité de matière</b>, notée <b>n</b>.</li><li>1 mol d’atomes de fer et 1 mol d’atomes de cuivre contiennent le <b>même nombre</b> d’atomes… mais n’ont pas la même masse.</li></ul></div>'+
 '<div class="tcard"><b class="h">La formule à retenir</b><p><b>N = n · N<sub>A</sub></b> donc <b>n = N / N<sub>A</sub></b></p><ul><li>N : nombre d’entités (sans unité) ; n : quantité de matière en mol ; N<sub>A</sub> = 6,02·10<sup>23</sup> mol<sup>−1</sup>.</li><li>Exemple : 2,0 mol d’eau → N = 2,0 × 6,02·10<sup>23</sup> = <b>1,2·10<sup>24</sup> molécules</b>.</li><li>Exemple inverse : 3,01·10<sup>22</sup> atomes de carbone → n = 3,01·10<sup>22</sup> / 6,02·10<sup>23</sup> = <b>0,0500 mol</b>.</li></ul></div>'+
 '<div class="tcard"><b class="h">Compter les atomes d’une molécule</b><p>Il faut préciser <b>de quoi</b> on parle : dans 1 mol de H<sub>2</sub>O, il y a 1 mol de <b>molécules</b>, mais 2 mol d’atomes H et 1 mol d’atomes O, soit 3 mol d’atomes au total.</p><ul><li>0,50 mol d’eau → 1,0 mol d’atomes H.</li><li>1 mol de CO<sub>2</sub> → 3 mol d’atomes.</li></ul></div>'+
 '<div class="tcard"><b class="h">Puissances de 10 : les règles utiles</b><ul><li>(a·10<sup>x</sup>) × (b·10<sup>y</sup>) = (a·b)·10<sup>x+y</sup> ; on divise : on <b>soustrait</b> les exposants.</li><li>On écrit en notation scientifique : un nombre entre 1 et 10 fois une puissance de 10 (12·10<sup>22</sup> = 1,2·10<sup>23</sup>).</li><li>Les ordres de grandeur : une mole d’atomes est <b>énorme</b> : à raison d’une particule par seconde, il faudrait environ 1,9·10<sup>16</sup> ans (l’Univers a ≈ 1,4·10<sup>10</sup> ans).</li><li>Piège : 1 mol ne pèse pas 6,02 g ; la masse d’une mole dépend de la substance (chapitre suivant).</li></ul></div>'
});
SFA.figs("c02",[
 function(p){qtitle('2,0 mol de H₂O');for(var i=0;i<2;i++){q2_bag(W*(.3+i*.4),H*.42,W*.3,H*.4,'6,02·10²³',ORANGE);qmol(W*(.3+i*.4),H*.3,'H2O',1.1);}
  qal(qr(p,0,.5));TB('N = n · Nₐ = 2,0 × 6,02·10²³',W*.5,H*.8,INK,17);qal(1);qal(qr(p,.4,1));TB('≈ 1,2·10²⁴ molécules',W*.5,H*.93,ORANGE,22);qal(1);if(p<=0)TB('N = ?',W*.5,H*.85,GREY,22);},
 function(p){qtitle('3,01·10²² atomes de carbone');var x=W*.5,y=H*.5,w=W*.5,h=H*.34;q2_bag(x,y,w,h,'',ORANGE,'#fdf1e3');
  var fr=.05;ctx.save();ctx.beginPath();ctx.rect(x-w/2,y+h/2-h*fr*2.2,w,h*fr*2.2+4);ctx.clip();ctx.fillStyle='#5f6368';ctx.fillRect(0,0,W,H);ctx.restore();
  TB('1 mol = 6,02·10²³',x,y-h*.1,ORANGE,16);TB('C',x,y+h*.12,INK,16);
  qal(qr(p,0,.6));TB('3,01·10²² / 6,02·10²³',W*.5,H*.84,INK,17);qal(1);qal(qr(p,.5,1));TB('n = 0,0500 mol',W*.5,H*.95,DGREEN,21);qal(1);if(p<=0)TB('n = ?',W*.5,H*.9,GREY,22);},
 function(p){qtitle('1 mol de fer, 1 mol de cuivre');[['Fe','56 g',ORA2,.27],['Cu','63,5 g',ORANGE,.73]].forEach(function(a){var x=W*a[3];qbal(x,H*.62,W*.28,a[1],DGREEN);for(var i=0;i<12;i++)DOT(x-W*.1+(i%6)*W*.04,H*.5-Math.floor(i/6)*18,8,qatCol(a[0]));TB(a[0],x,H*.8,INK,16);TB('1 mol',x,H*.9,GREY,14);});
  TB('=',W*.5,H*.62,INK,24);qal(qr(p,0,.6));TB('m différentes, même nombre N',W*.5,H*.2,DGREEN,16);qal(1);if(p>0)TB('≠ masses',W*.5,H*.72,DRED,15);},
 function(p){qtitle('0,50 mol de H₂O');var s=H*.007*(W/460>1?1:1);qmol(W*.25,H*.45,'H2O',1.8);TB('0,50 mol de molécules',W*.25,H*.78,INK,15);
  qal(qr(p,0,.5));A(W*.4,H*.42,W*.2,0,ORANGE,'',3);TB('× 2',W*.5,H*.35,ORANGE,18);qat(W*.78,H*.38,H*.1,'H');qat(W*.9,H*.38,H*.1,'H');TB('1,0 mol d’atomes H',W*.76,H*.78,DGREEN,18);qal(1);if(p<=0)TB('? mol H',W*.76,H*.55,GREY,20);},
 function(p){qtitle('1 mol comptée à 1 particule par seconde');var x0=W*.12,w=W*.76,y=H*.35;var lg=function(v){return (Math.log10(v)-9)/(17-9);};
  LN(x0,H*.78,x0+w,H*.78,AX,1.5);[10,12,14,16].forEach(function(e){var x=x0+w*(e-9)/8;LN(x,H*.76,x,H*.8,GREY,1.2);TB('10^'+e,x,H*.9,GREY,12);});
  qbar(x0,y,w*lg(1.4e10),16,1,BLUE);TB('Univers : 1,4·10¹⁰ ans',x0,y-7,BLUE_D,13,'left');
  var a=qr(p,0,.7);qbar(x0,y+H*.2,w*lg(1.9e16)*a,16,1,RED);if(p>0){qal(a);TB('1 mol : 1,9·10¹⁶ ans',x0,y+H*.2-7,DRED,13,'left');qal(1);qal(qr(p,.6,1));TB('≈ 1,4 million de fois l’âge de l’Univers',W*.5,H*.7,ORANGE,15);qal(1);}else TB('1 mol : ?',x0,y+H*.2-7,GREY,14,'left');},
 function(p){qtitle('1,5·10²⁴ molécules de O₂');ctx.fillStyle='#fdece4';ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(W*.25,H*.42,H*.24,H*.28,0,0,7);ctx.fill();ctx.stroke();for(var i=0;i<5;i++)qmol(W*.25+Math.cos(i*1.3)*H*.1*(i%2+.5),H*.42+Math.sin(i*1.3)*H*.12*(1+i%2*.4),'O2',.7);
  var nb=2.5*qr(p,0,.7);for(var j=0;j<3;j++){var f=Math.max(0,Math.min(1,nb-j));if(f>0)q2_bag(W*(.55+j*.14),H*.45,W*.12,H*.22*(f<1?.6+.4*f:1),'1 mol',ORANGE);}
  TB('N / Nₐ = 1,5·10²⁴ / 6,02·10²³',W*.5,H*.82,INK,15);qal(qr(p,.6,1));TB('≈ 2,5 mol',W*.5,H*.95,DGREEN,22);qal(1);if(p<=0)TB('n = ?',W*.5,H*.95,GREY,20);},
 function(p){qtitle('Film d’acide oléique (1 molécule d’épaisseur)');var y=H*.62;ctx.fillStyle='rgba(55,138,221,.22)';ctx.fillRect(W*.08,y,W*.84,H*.28);LN(W*.08,y,W*.92,y,BLUE,2);
  for(var i=0;i<14;i++){var x=W*.12+i*W*.057;LN(x,y,x,y-H*.19,ORANGE,3);DOT(x,y-H*.2,3.5,RED);}
  qal(qr(p,0,.5));LN(W*.06,y-H*.2,W*.06,y,DRED,2);TB('e',W*.04,y-H*.09,DRED,16);qal(1);
  qal(qr(p,.4,1));TB('e = V / S ≈ 2,6 nm',W*.5,H*.3,DRED,18);TB('N ≈ 1,1·10¹⁷ ; 0,20 nm² par molécule',W*.5,H*.42,ORANGE,15);qal(1);if(p<=0)TB('e = ?   N = ?',W*.5,H*.25,GREY,18);},
 function(p){qtitle('Un souffle : 0,50 L d’air (20 °C, 1 atm)');ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(W*.25,H*.45,H*.25,H*.3,0,0,7);ctx.fill();ctx.stroke();TB('0,50 L',W*.25,H*.5,BLUE_D,20);
  qal(qr(p,0,.4));TB('n = V / Vₘ = 0,50 / 24',W*.66,H*.36,INK,16);TB('≈ 2,1·10⁻² mol',W*.66,H*.5,INK,16);qal(1);qal(qr(p,.4,1));TB('N = n·Nₐ ≈ 1,3·10²²',W*.66,H*.72,ORANGE,20);qal(1);if(p<=0)TB('N = ?',W*.66,H*.5,GREY,22);},
 function(p){qtitle('Bague : 5,0 g d’or pur');ctx.strokeStyle='#d4a62a';ctx.lineWidth=9;ctx.beginPath();ctx.arc(W*.25,H*.52,H*.2,0,7);ctx.stroke();ctx.fillStyle='#d4a62a';DOT(W*.25,H*.52-H*.2-2,9,'#e8c040');TB('Au  5,0 g',W*.25,H*.57,'#8a6a10',15);
  var L=[['n = m / M = 5,0 / 197 ≈ 2,5·10⁻² mol',INK],['N ≈ 1,5·10²² atomes',ORANGE],['m(atome) ≈ 3,3·10⁻²² g',DGREEN],['≈ 1,9·10¹² atomes / personne',DRED]];
  L.forEach(function(l,i){qal(qr(p,i*.22,i*.22+.2));TB(l[0],W*.46,H*.28+i*H*.18,l[1],W<400?12:14,'left');qal(1);});if(p<=0)TB('n ? N ? m ?',W*.7,H*.5,GREY,20);},
 function(p){qtitle('18 g d’eau + 44 g de CO₂');qmol(W*.25,H*.4,'H2O',1.6);qmol(W*.7,H*.4,'CO2',1.6);qbal(W*.25,H*.62,W*.28,'18 g',DGREEN);qbal(W*.7,H*.62,W*.28,'44 g',DGREEN);
  TB('1 mol × 3 atomes',W*.25,H*.9,INK,14);TB('1 mol × 3 atomes',W*.7,H*.9,INK,14);qal(qr(p,0,.6));TB('+',W*.475,H*.4,INK,26);qal(1);qal(qr(p,.4,1));TB('6 mol d’atomes ≈ 3,6·10²⁴',W*.5,H*.2,ORANGE,18);qal(1);}
]);
