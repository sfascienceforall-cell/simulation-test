/* Chimie 4e · chapitre 3 · Masse molaire */
function q3_pie(cx,cy,R,r,parts,cols,k){var a0=-Math.PI/2,tot=parts.reduce(function(a,b){return a+b;},0),used=0;parts.forEach(function(v,i){var f=v/tot,s=Math.max(0,Math.min(f,k*1-used));used+=f;if(s<=0)return;var a1=a0+s*2*Math.PI;ctx.beginPath();ctx.arc(cx,cy,R,a0,a1);ctx.arc(cx,cy,r,a1,a0,true);ctx.closePath();ctx.fillStyle=cols[i];ctx.fill();a0=a1+0;
  /* position correcte : on repart du bon angle */});}
SFA.theo("c03",{
 icon:function(){TB('n = m / M',W*.5,H*.42,BLUE_D,36);TB('g ÷ g/mol = mol',W*.5,H*.68,ORANGE,22);},
 anim:function(t){var S=[['H₂O',18],['CO₂',44],['NaCl',58.5]],P=700,i=Math.floor(t/P)%3,k=(t%P)/P,s=S[i],n=2*qr(k,.08,.8);
  var m=n*s[1];TB('m = n · M',W*.25,H*.1,BLUE_D,18);
  var bx=W*.24,by=H*.62;qbal(bx,by,W*.3,m.toFixed(1).replace('.',',')+' g',DGREEN);
  var cnt=Math.floor(n*10);for(var j=0;j<cnt;j++)DOT(bx-W*.1+(j%10)*W*.022,by-8-Math.floor(j/10)*10,5,i===2?VIOLET:i===1?'#5f6368':BLUE);
  TB(s[0],bx,by+58,INK,16);TB('M = '+String(s[1]).replace('.',',')+' g/mol',bx,by+76,GREY,14);
  var gx=W*.55,gw=W*.38,gy=H*.82,gh=H*.6;LN(gx,gy,gx+gw,gy,AX,1.5);LN(gx,gy,gx,gy-gh,AX,1.5);TB('n (mol)',gx+gw,gy+16,GREY,12,'right');TB('m (g)',gx+4,gy-gh-4,GREY,12,'left');
  var mmax=2*58.5,sc=gh/mmax;LN(gx,gy,gx+gw,gy-2*s[1]*sc*(gw/gw)*1,BLUE,2.5);ctx.save();ctx.restore();
  var px=gx+gw*n/2,py=gy-m*sc;LN(px,gy,px,py,GREY,1,[4,4]);LN(gx,py,px,py,GREY,1,[4,4]);DOT(px,py,6,ORANGE);
  TB('pente = M',gx+gw*.55,gy-s[1]*sc*1.1-12,BLUE_D,14);
  TB(n.toFixed(2).replace('.',',')+' mol × '+String(s[1]).replace('.',',')+' = '+m.toFixed(1).replace('.',',')+' g',W*.5,H*.97,INK,14);},
 th:'<div class="tcard"><b class="h">La masse molaire M</b><p>La <b>masse molaire</b> M est la masse d’<b>une mole</b> d’entités : elle s’exprime en <b>g/mol</b>. Pour un atome, c’est la valeur du tableau périodique (M(C) = 12, M(O) = 16 g/mol). Pour une molécule ou un composé, on <b>additionne</b> les masses des atomes de la formule.</p><ul><li>M(H<sub>2</sub>O) = 2 × 1 + 16 = <b>18 g/mol</b></li><li>M(Ca(OH)<sub>2</sub>) = 40 + 2 × (16 + 1) = <b>74 g/mol</b> (les parenthèses multiplient tout ce qu’elles contiennent).</li></ul></div>'+
 '<div class="tcard"><b class="h">La relation centrale : n = m / M</b><p><b>m = n · M</b> &nbsp;;&nbsp; <b>n = m / M</b> &nbsp;;&nbsp; <b>M = m / n</b></p><ul><li>m en grammes, M en g/mol, n en mol. Vérifie toujours les unités : g ÷ (g/mol) = mol.</li><li>36 g d’eau : n = 36 / 18 = <b>2,0 mol</b>.</li><li>0,25 mol de NaCl (M = 58,5) : m = 0,25 × 58,5 ≈ <b>14,6 g</b>.</li><li>Sur un graphique m en fonction de n, on obtient une droite passant par l’origine, de pente M.</li></ul></div>'+
 '<div class="tcard"><b class="h">Pourcentage massique (composition centésimale)</b><p>Le pourcentage massique d’un élément X dans un composé vaut : <b>% X = (nombre d’atomes X × M(X)) / M(composé) × 100</b>.</p><ul><li>NH<sub>4</sub>NO<sub>3</sub> : M = 14 + 4 + 14 + 48 = 80 g/mol ; N : 28/80 = <b>35,0 %</b> ; H : 4/80 = <b>5,0 %</b> ; O : 48/80 = <b>60,0 %</b>. Total : 100 %.</li><li>À l’envers : avec les % et M, on retrouve la formule. Dans 100 g : n = m / M pour chaque élément, puis on divise par le plus petit pour obtenir les rapports entiers (formule empirique) ; la formule moléculaire s’obtient avec M du composé.</li></ul></div>'+
 '<div class="tcard"><b class="h">Hydrates : l’eau dans le cristal</b><p>Un sel hydraté contient de l’eau : CuSO<sub>4</sub>·<b>x</b>H<sub>2</sub>O. En chauffant, l’eau s’évapore et il reste le sel anhydre.</p><ul><li>12,5 g d’hydrate → 8,0 g de CuSO<sub>4</sub> : l’eau perdue vaut 12,5 − 8,0 = 4,5 g, soit 4,5 / 18 = 0,25 mol.</li><li>n(CuSO<sub>4</sub>) = 8,0 / 159,5 ≈ 0,050 mol → x = 0,25 / 0,050 = <b>5</b> : CuSO<sub>4</sub>·5H<sub>2</sub>O.</li><li>Piège : <b>ne pas confondre</b> la masse en grammes et la quantité en moles ; on divise toujours par M avant de comparer.</li></ul></div>'
});
SFA.figs("c03",[
 function(p){qtitle('M(Ca(OH)₂) = ?');var x0=W*.08,w=W*.84,y=H*.38,h=H*.2,sc=w/74;var P=[['Ca',40,ORANGE],['2 O',32,RED],['2 H',2,GREY]];
  var x=x0;P.forEach(function(q,i){qbox(x+q[1]*sc/2,y+h/2,Math.max(q[1]*sc-3,26),h,'',q[2],12,q[2]+'33');TB(q[0],x+q[1]*sc/2,y-6,dk(q[2]),14);qal(qr(p,i*.15,i*.15+.2));TB(String(q[1]),x+q[1]*sc/2,y+h/2+6,dk(q[2]),15);qal(1);x+=q[1]*sc;});
  TB('Ca (OH)₂',W*.5,H*.2,INK,16);qal(qr(p,.5,1));LN(x0,H*.7,x0+w,H*.7,INK,2);TB('M = 40 + 32 + 2 = 74 g/mol',W*.5,H*.84,ORANGE,20);qal(1);if(p<=0)TB('M = ?',W*.5,H*.8,GREY,22);},
 function(p){qtitle('36 g d’eau');qbal(W*.25,H*.6,W*.3,'36 g',DGREEN);for(var i=0;i<12;i++)qmol(W*.25-W*.1+(i%4)*W*.065,H*.52-Math.floor(i/4)*20,'H2O',.5);
  qal(qr(p,0,.5));TB('M = 18 g/mol',W*.65,H*.3,GREY,16);q2b(W*.58,H*.42,'18 g',qr(p,0,.5));q2b(W*.76,H*.42,'18 g',qr(p,.2,.6));qal(1);
  qal(qr(p,.5,1));TB('n = 36 / 18 = 2,0 mol',W*.6,H*.82,DGREEN,20);qal(1);if(p<=0)TB('n = ?',W*.65,H*.5,GREY,24);},
 function(p){qtitle('0,25 mol de NaCl');var x0=W*.1,w=W*.8,y=H*.35,h=H*.2;qbox(W*.5,y+h/2,w,h,'',VIOLET,12,'#f1efff');TB('1 mol de NaCl = 58,5 g',W*.5,y+h*.58,VIOLET,16);
  var a=qr(p,0,.5);ctx.fillStyle='rgba(127,119,221,.45)';ctx.fillRect(x0,y,w*.25*a,h);if(p>0){TB('¼',x0+w*.125*a,y+h*.35,VIOLET,16);}
  qal(qr(p,.4,1));TB('m = n·M = 0,25 × 58,5',W*.5,H*.72,INK,17);TB('≈ 14,6 g',W*.5,H*.88,DGREEN,22);qal(1);if(p<=0)TB('m = ?',W*.5,H*.8,GREY,22);},
 function(p){qtitle('4,0 g de NaOH (M = 40 g/mol)');qbal(W*.3,H*.62,W*.3,'4,0 g',DGREEN);for(var i=0;i<8;i++){ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(W*.3-W*.09+(i%4)*W*.06,H*.57-Math.floor(i/4)*10,12,6,0,0,7);ctx.fill();ctx.stroke();}
  q2b(W*.7,H*.45,'1 mol = 40 g',1);ctx.fillStyle='rgba(55,138,221,.4)';ctx.fillRect(W*.7-W*.2,H*.45+H*.18,W*.4*.1*qr(p,0,.5),8);
  qal(qr(p,.3,1));TB('n = 4,0 / 40 = 0,10 mol',W*.6,H*.9,DGREEN,20);qal(1);if(p<=0)TB('n = ?',W*.7,H*.8,GREY,24);},
 function(p){qtitle('NH₄NO₃ : % en masse');var cx=W*.3,cy=H*.55,R=Math.min(H*.33,W*.2);var k=qr(p,0,.7);
  ctx.beginPath();ctx.arc(cx,cy,R,0,6.2832);ctx.arc(cx,cy,R*.55,0,6.2832,true);ctx.fillStyle='#eceef1';ctx.fill();
  var parts=[[35,BLUE,'N'],[5,GREY,'H'],[60,RED,'O']],a0=-Math.PI/2,used=0;parts.forEach(function(q){var f=q[0]/100,s=Math.max(0,Math.min(f,k-used));used+=f;if(s<=0)return;var a1=a0+s*2*Math.PI;ctx.beginPath();ctx.arc(cx,cy,R,a0,a1);ctx.arc(cx,cy,R*.55,a1,a0,true);ctx.closePath();ctx.fillStyle=q[1];ctx.fill();a0=a1;});
  TB('80 g/mol',cx,cy+5,INK,14);
  var L=[['N : 28 / 80',BLUE,'35,0 %'],['H : 4 / 80',GREY,'5,0 %'],['O : 48 / 80',RED,'60,0 %']];L.forEach(function(l,i){var y=H*.35+i*H*.2;DOT(W*.58,y,7,l[1]);TB(l[0],W*.62,y+5,INK,15,'left');qal(qr(p,i*.2,i*.2+.3));TB(l[2],W*.97,y+5,dk(l[1]===GREY?GREY:l[1]),16,'right');qal(1);});if(p<=0)TB('% = ?',W*.82,H*.88,GREY,18);},
 function(p){qtitle('0,0100 mol de saccharose');qbal(W*.28,H*.62,W*.3,'3,42 g',DGREEN);ctx.fillStyle='#fff';ctx.strokeStyle=GREY;ctx.lineWidth=2;for(var i=0;i<3;i++){ctx.fillRect(W*.28-26+i*18,H*.56-i*4-14,18,14);ctx.strokeRect(W*.28-26+i*18,H*.56-i*4-14,18,14);}
  TB('C₁₂H₂₂O₁₁',W*.7,H*.3,INK,17);qal(qr(p,0,.5));TB('M = 144 + 22 + 176 = 342 g/mol',W*.65,H*.5,INK,14);qal(1);qal(qr(p,.4,1));TB('m = 0,0100 × 342 = 3,42 g',W*.65,H*.72,ORANGE,19);qal(1);if(p<=0)TB('m = ?',W*.68,H*.55,GREY,24);},
 function(p){qtitle('CuSO₄·xH₂O chauffé');var cx=W*.35,cy=H*.68;ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx-50,cy-30);ctx.lineTo(cx-34,cy+4);ctx.lineTo(cx+34,cy+4);ctx.lineTo(cx+50,cy-30);ctx.stroke();
  var f=qr(p,0,.6);ctx.fillStyle=f<.5?'#4aa3e0':'#e8f1f8';ctx.beginPath();ctx.moveTo(cx-40,cy-12);ctx.lineTo(cx-30,cy+3);ctx.lineTo(cx+30,cy+3);ctx.lineTo(cx+40,cy-12);ctx.fill();
  TB(f<.5?'12,5 g':'8,0 g',cx,cy+28,INK,16);for(var i=0;i<3;i++){var a=Math.min(1,f*2)*(1-(((p*80+i*30)%60)/60)*.5);qal(f>0?.6:0);ctx.strokeStyle=GREY;ctx.lineWidth=2;ctx.beginPath();var y0=cy-34-(((Date.now()/30)%40+i*20)%40);ctx.arc(cx-20+i*20,y0,5,0,7);ctx.stroke();qal(1);}
  var y=H*.5;qal(qr(p,.3,.8));TB('− 4,5 g d’eau = 0,25 mol',W*.78,H*.32,BLUE_D,15);TB('8,0 g / 159,5 = 0,050 mol',W*.78,H*.47,INK,15);qal(1);qal(qr(p,.6,1));TB('x = 0,25 / 0,050 = 5',W*.78,H*.66,DGREEN,18);TB('CuSO₄·5H₂O',W*.78,H*.82,ORANGE,19);qal(1);if(p<=0)TB('x = ?',W*.78,H*.5,GREY,24);},
 function(p){qtitle('49 g de H₂SO₄');var cx=W*.27,cy=H*.5;qat(cx,cy,H*.1,'S');[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(d,i){var x=cx+d[0]*H*.17,y=cy+d[1]*H*.17;LN(cx,cy,x,y,'#8a8f96',3);var hl=p>0;qat(x,y,H*.065,'O');if(hl){qal(qr(p,i*.1,i*.1+.3));ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,H*.085,0,7);ctx.stroke();qal(1);}});
  qat(cx-H*.3,cy-H*.3,H*.04,'H');qat(cx+H*.3,cy-H*.3,H*.04,'H');
  var L=['M = 98 g/mol','n = 49 / 98 = 0,50 mol','1 mol H₂SO₄ → 4 mol O','n(O) = 4 × 0,50 = 2,0 mol'];L.forEach(function(l,i){qal(qr(p,i*.2-.1,i*.2+.15));TB(l,W*.47,H*.3+i*H*.17,i===3?ORANGE:INK,i===3?17:14,'left');qal(1);});if(p<=0)TB('n(O) = ?',W*.65,H*.55,GREY,22);},
 function(p){qtitle('Urée ou nitrate : m(N) identique');var x0=W*.12,w=W*.7,y1=H*.3,y2=H*.62;var sc=w/66.7;
  TB('50 kg d’urée (46,7 % N)',x0,y1-10,INK,14,'left');qbar(x0,y1,50*sc,18,1,'#b9c4d0');qbar(x0,y1,23.3*sc,18,1,BLUE);TB('23,3 kg N',x0+23.3*sc/2,y1+14,'#fff',12);
  var b=qr(p,0,.7);TB('NH₄NO₃ (35 % N)',x0,y2-10,INK,14,'left');qbar(x0,y2,66.7*sc*b+.1,18,1,'#b9c4d0');qbar(x0,y2,23.3*sc,18,1,BLUE);TB('23,3 kg N',x0+23.3*sc/2,y2+14,'#fff',12);
  qal(qr(p,.5,1));TB('m = 23,3 / 0,35 ≈ 66,7 kg',W*.5,H*.9,ORANGE,20);qal(1);if(p<=0)TB('? kg de NH₄NO₃',x0+w*.5,y2+14,GREY,15);},
 function(p){qtitle('C 40,0 % · H 6,7 % · O 53,3 %');qbox(W*.5,H*.3,W*.34,H*.18,'CH₂O',BLUE,22);TB('M = 30 g/mol',W*.5,H*.47,GREY,15);
  TB('M(composé) = 180 g/mol',W*.5,H*.58,INK,16);var n=p>0?6:1;for(var i=0;i<6;i++){qal(i<n?1:.0);qbox(W*(.12+i*.15),H*.76,W*.12,H*.13,'CH₂O',ORANGE,12);qal(1);}
  qal(qr(p,.2,1));TB('180 / 30 = 6  →  C₆H₁₂O₆',W*.5,H*.95,DGREEN,19);qal(1);}
]);
function q2b(x,y,lab,a){qal(a);ctx.fillStyle='#e6f1fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-W*.12,y-H*.07,W*.24,H*.14,6);ctx.fill();ctx.stroke();TB(lab,x,y+5,BLUE_D,12);qal(1);}
