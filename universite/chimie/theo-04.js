/* Chimie BA1 · c04 · théorie animée et devantures d'exercices — contenu SFA original. */
/* ---- aides locales (préfixe uh_) ---- */
function uh_e(p,a,b){return Math.max(0,Math.min(1,(p-a)/((b-a)||1)));}
function uh_al(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function uh_ttl(s){TB(s,W*.5,20,GREY,13);}
function uh_ax(x0,y0,w,h,xa,xb,ya,yb,xl,yl){LN(x0,y0,x0+w+8,y0,GREY,1.5);LN(x0,y0+4,x0,y0-h-8,GREY,1.5);
 if(xl)TB(xl,x0+w+8,y0+33,GREY,12,'right');if(yl)TB(yl,x0+6,y0-h-12,GREY,12,'left');
 return {X:function(x){return x0+(x-xa)/(xb-xa)*w;},Y:function(y){return y0-(y-ya)/(yb-ya)*h;}};}
function uh_fn(m,f,a,b,col,lw,upto,dash){var n=120,e=upto==null?b:a+(b-a)*upto;ctx.strokeStyle=col;ctx.lineWidth=lw||2.5;if(dash)ctx.setLineDash(dash);ctx.beginPath();
 for(var i=0;i<=n;i++){var x=a+(e-a)*i/n,y=f(x);i?ctx.lineTo(m.X(x),m.Y(y)):ctx.moveTo(m.X(x),m.Y(y));}ctx.stroke();ctx.setLineDash([]);}
function uh_rr(x,y,w,h,fill,stroke,lw,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r==null?8:r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}}
function uh_atom(x,y,s,col,r){r=r||14;DOT(x,y,r,'#fff');ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(s,x,y+r*.36,col,Math.round(r*.95));}
function uh_bd(x1,y1,x2,y2,n,col,w){var dx=y2-y1,dy=x1-x2,l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;var o=(n-1)*2.6;
 for(var i=0;i<n;i++){var k=-o+i*5.2;LN(x1+dx*k,y1+dy*k,x2+dx*k,y2+dy*k,col||INK,w||2.2);}}
function uh_wave(x0,y0,len,amp,lam,ph,col,lw){ctx.strokeStyle=col;ctx.lineWidth=lw||2.4;ctx.beginPath();for(var i=0;i<=len;i+=2){var y=y0-amp*Math.sin(2*PI*i/lam-ph);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.stroke();}
function uh_wl(l){var r=0,g=0,b=0;if(l<380)return '#7F77DD';if(l<440){r=(440-l)/60;b=1;}else if(l<490){g=(l-440)/50;b=1;}else if(l<510){g=1;b=(510-l)/20;}else if(l<580){r=(l-510)/70;g=1;}else if(l<645){r=1;g=(645-l)/65;}else if(l<=750){r=1;}else return '#a32d2d';
 return 'rgb('+Math.round(r*220)+','+Math.round(g*190)+','+Math.round(b*220)+')';}
function uh_nuc(x,y,A,Z,s,col,sz){sz=sz||20;TB(String(A),x-sz*.55,y-sz*.25,col,sz*.55,'right');TB(String(Z),x-sz*.55,y+sz*.4,col,sz*.55,'right');TB(s,x-sz*.45,y+sz*.35,col,sz,'left');}
function uh_f(v,d){return Number(v).toFixed(d==null?2:d).replace('.',',').replace('-','−');}
function uh_tag(s,x,y,col,sz,a){if(a!=null)uh_al(a);tag(s,x,y,col,sz||13);ctx.globalAlpha=1;}
function c4_P(T){return 101.325*Math.exp(-40650/8.314*(1/T-1/373.15));}
function c4_cube(x,y,s,off,col){/* face avant (x,y)=coin bas-gauche, arrière décalé (off,-off) */var P=function(i,j,k){return [x+i*s+k*off,y-j*s-k*off];};var e=[[[0,0,0],[1,0,0]],[[1,0,0],[1,1,0]],[[1,1,0],[0,1,0]],[[0,1,0],[0,0,0]],[[0,0,1],[1,0,1]],[[1,0,1],[1,1,1]],[[1,1,1],[0,1,1]],[[0,1,1],[0,0,1]],[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[1,1,0],[1,1,1]],[[0,1,0],[0,1,1]]];
 e.forEach(function(a,i){var A_=P(a[0][0],a[0][1],a[0][2]),B=P(a[1][0],a[1][1],a[1][2]);LN(A_[0],A_[1],B[0],B[1],col||GREY,i<4||i>7?1.8:1.4,i>3&&i<8||i===8?null:null);});return P;}
function c4_alv(cx,cy,r,col){DOT(cx,cy,r,col+'22');ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();}
SFA.theo("c04",{
 icon:function(){var cx=W*.25,cy=H*.6,s=70;var P=c4_cube(cx-s/2,cy+s/2,s,28,BLUE_D);[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]].forEach(function(v){var q=P(v[0],v[1],v[2]);DOT(q[0],q[1],7,ORANGE);});var q=P(.5,.5,.5);DOT(q[0],q[1],7,RED);
  TB('forces',W*.7,H*.3,BLUE_D,28);TB('intermoléculaires',W*.7,H*.46,BLUE_D,22);TB('P = P₀·e^(−ΔH/RT)',W*.7,H*.68,ORANGE,18);TB('mailles cristallines',W*.7,H*.86,GREY,15);},
 anim:function(t){var Tm=340+38*Math.sin(t*.012),N=48,xv=Math.min(.9,c4_P(Tm)/c4_P(380)*.8),bx=22,bw=W*.42,by0=24,by1=H-24,liqY=by0+(by1-by0)*.55;
  uh_rr(bx,by0,bw,by1-by0,'#fff',GREY,2,10);ctx.fillStyle='#e6f1fb';ctx.beginPath();ctx.roundRect(bx+2,liqY,bw-4,by1-liqY-2,[0,0,9,9]);ctx.fill();
  for(var i=0;i<N;i++){var u=(i%N+.5)/N,s=Math.max(0,Math.min(1,(xv-u)/.06+.5)),lx=bx+16+(i%8)*((bw-32)/7)+3*Math.sin(t*.1+i),ly=liqY+14+Math.floor(i/8)*((by1-liqY-28)/5)+3*Math.cos(t*.12+i*1.3);
   var vx=bx+16+((i*37)%100)/100*(bw-32)+16*Math.sin(t*.03*(1+i%3)+i),vy=by0+16+((i*53)%100)/100*(liqY-by0-40)+14*Math.cos(t*.04*(1+i%2)+i*2);DOT(lx+(vx-lx)*s,ly+(vy-ly)*s,5.5,s>.5?ORANGE:BLUE);}
  TB('T = '+Math.round(Tm-273.15)+' °C',bx+bw/2,by1+0,GREY,0.1);
  var gx=W*.6,gw=W*.34,gy=H-56,gh=H-110;var m=uh_ax(gx,gy,gw,gh,300,380,0,110,'T (K)','P vap (kPa)');uh_fn(m,c4_P,300,380,BLUE,3);DOT(m.X(Tm),m.Y(c4_P(Tm)),7,DRED);LN(m.X(Tm),gy,m.X(Tm),m.Y(c4_P(Tm)),GREY,1.2,[4,4]);[300,340,380].forEach(function(v){TB(v,m.X(v),gy+16,GREY,11);});
  TB('P = '+Math.round(c4_P(Tm))+' kPa  ·  T = '+Math.round(Tm)+' K',gx+gw*.5,H*.1,DRED,15);TB('chauffer → plus de molécules dans la vapeur',gx+gw*.5,H-8,GREY,12);},
 th:'<div class="tcard"><b class="h">Les forces intermoléculaires</b><p>Entre molécules (et non à l\'intérieur) s\'exercent des forces bien plus faibles que les liaisons covalentes (≈ 0,1–40 kJ/mol contre 150–900 kJ/mol).</p><ul><li><b>London</b> (dipôles instantanés) : toutes les molécules ; croît avec le <b>nombre d\'électrons</b> (masse) et la surface de contact.</li><li><b>Dipôle–dipôle</b> : molécules polaires, s\'ajoute à London.</li><li><b>Liaison hydrogène</b> : X–H···Y avec X, Y = N, O, F (H lié à N, O ou F et doublet libre d\'un autre). La plus forte des forces intermoléculaires.</li><li><b>Ion–dipôle</b> : dissolution des sels dans l\'eau.</li></ul><p><b>Conséquences</b> : H₂O (373 K) bout bien plus haut que H₂S (213 K), H₂Se, H₂Te à cause de la liaison H ; pour des isomères, la chaîne droite (pentane 36 °C) bout plus haut que la chaîne ramifiée compacte (néopentane 9,5 °C). Le méthanol fait des liaisons H, pas le CH₃OCH₃ (aucun H lié à O).</p></div>'+
 '<div class="tcard"><b class="h">Pression de vapeur et Clausius–Clapeyron</b><p>À l\'équilibre liquide ⇌ vapeur, la pression de vapeur saturante croît exponentiellement avec T. <b>ln(P₂/P₁) = −(ΔH<sub>vap</sub>/R)·(1/T₂ − 1/T₁)</b>. Un liquide bout quand sa pression de vapeur égale la pression extérieure.</p><p><b>Exemple</b> (eau, ΔH<sub>vap</sub> = 40,65 kJ/mol, 101,325 kPa à 373,15 K) : à 363,15 K, ln(P/101,325) = −4 889 × (1/363,15 − 1/373,15) = −0,361, P ≈ 70,7 kPa. À 55 kPa, l\'eau bout vers 356,5 K (83 °C) ; dans un autoclave à 121 °C il faut 204 kPa absolus. Avec deux mesures (P, T) on retrouve ΔH<sub>vap</sub> par la pente de ln P en fonction de 1/T (éthanol : ≈ 42 kJ/mol). Les températures sont en kelvins.</p></div>'+
 '<div class="tcard"><b class="h">Tension superficielle et loi de Laplace</b><p>Les molécules de surface perdent des voisins : le liquide tend à minimiser sa surface. La <b>tension superficielle</b> γ (N/m) en résulte (eau 72 mN/m à 25 °C). Pour une bulle ou un alvéole sphérique de rayon r : <b>ΔP = 2γ/r</b> (une seule interface : 2γ/r ; une bulle de savon à deux faces : 4γ/r).</p><p><b>Exemple</b> : alvéole de 50 µm, γ = 50 mN/m : ΔP = 2 × 0,050/50·10⁻⁶ = 2 000 Pa ≈ 20 cmH₂O ; avec le <b>surfactant</b> (γ ≈ 5 mN/m) : 200 Pa ≈ 2 cmH₂O. À γ égale, le <b>petit alvéole</b> (pression plus grande) se vide dans le grand : le surfactant, plus concentré dans le petit, évite cet effondrement.</p></div>'+
 '<div class="tcard"><b class="h">Types de solides</b><ul><li><b>Ionique</b> (NaCl) : dur, cassant, T<sub>fus</sub> élevée, isolant solide, conducteur fondu ou dissous.</li><li><b>Covalent</b> (diamant, SiO₂) : très dur, T<sub>fus</sub> très élevée, isolant.</li><li><b>Métallique</b> (Cu, Fe) : conducteur, malléable.</li><li><b>Moléculaire</b> (glace, I₂) : mou, T<sub>fus</sub> basse, isolant.</li></ul></div>'+
 '<div class="tcard"><b class="h">Mailles cubiques</b><p>Atomes par maille (sommets 1/8, faces 1/2, centre 1) : <b>cs 1</b> (8 × 1/8) ; <b>cc 2</b> (8 × 1/8 + 1) ; <b>cfc 4</b> (8 × 1/8 + 6 × 1/2). Contact : cs a = 2r ; cc a√3 = 4r (diagonale du cube) ; cfc a√2 = 4r (diagonale d\'une face). Coordinence 6 ; 8 ; 12. Compacité 0,52 ; 0,68 ; 0,74. <b>Masse volumique ρ = Z·M/(N<sub>A</sub>·a³)</b>.</p><p><b>Exemple Cu</b> (cfc, a = 361,5 pm, M = 63,55 g/mol) : r = a√2/4 = 127,8 pm ; ρ = 4 × 63,55/(6,022·10²³ × (3,615·10⁻⁸ cm)³) = 8,93 g/cm³. La distance entre voisins en cfc est a√2/2. <b>NaCl</b> : Cl⁻ cfc + Na⁺ dans les sites octaédriques, 4 NaCl par maille, a = 2(r⁺ + r⁻).</p></div>'
});
SFA.figs("c04",[
 /* 0 liaisons H */
 function(p){var q=uh_e(p,0,.6),y=H*.5;var C1=[W*.1,y+26],O1=[W*.27,y-8],H1=[W*.42,y+16],O2=[W*.62,y-8],H2=[W*.77,y+16],C2=[W*.9,y-8+34];
  LN(C1[0],C1[1],O1[0],O1[1],INK,3);LN(O1[0],O1[1],H1[0],H1[1],INK,3);LN(O2[0],O2[1],H2[0],H2[1],INK,3);LN(O2[0],O2[1],W*.62,y+40,INK,3);
  uh_atom(C1[0],C1[1],'CH₃',INK,17);uh_atom(O1[0],O1[1],'O',RED,15);uh_atom(H1[0],H1[1],'H',GREY,12);uh_atom(O2[0],O2[1],'O',RED,15);uh_atom(H2[0],H2[1],'H',GREY,12);uh_atom(W*.62,y+44,'CH₃',INK,17);
  uh_al(q);ctx.strokeStyle=ORANGE;ctx.lineWidth=3.4;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(H1[0]+14,H1[1]-2);ctx.lineTo(O2[0]-17,O2[1]+4);ctx.stroke();ctx.setLineDash([]);uh_tag('liaison hydrogène O–H···O',(H1[0]+O2[0])/2,y-62,ORANGE,15);ctx.globalAlpha=1;TB('2 CH₃OH',W*.5,H*.14,BLUE_D,18);TB('CH₃OCH₃, CH₃Cl, CH₄ : aucun H lié à O, N ou F',W*.5,H*.92,GREY,13);},
 /* 1 mailles */
 function(p){var q=uh_e(p,0,.6),s=64,names=['cubique simple','cubique centrée','cubique à faces centrées'],res=['8 × ⅛ = 1','8 × ⅛ + 1 = 2','8 × ⅛ + 6 × ½ = 4'];
  [0,1,2].forEach(function(k){var x=W*(.1+k*.31),y=H*.62,P=c4_cube(x,y,s,24,BLUE_D);[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]].forEach(function(v){var a=P(v[0],v[1],v[2]);DOT(a[0],a[1],6,ORANGE);});
   if(k===1){var a=P(.5,.5,.5);DOT(a[0],a[1],7,RED);}if(k===2){[[.5,.5,0],[.5,.5,1],[.5,0,.5],[.5,1,.5],[0,.5,.5],[1,.5,.5]].forEach(function(v){var a=P(v[0],v[1],v[2]);DOT(a[0],a[1],6,GREEN);});}
   TB(names[k],x+s*.7,H*.12,BLUE_D,12);uh_al(q);TB(res[k],x+s*.6,y+36,DRED,13);TB(['1 atome','2 atomes','4 atomes'][k],x+s*.6,y+56,DRED,16);ctx.globalAlpha=1;});},
 /* 2 hydrures */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H-48,W-100,H-90,1.5,5.5,180,400,'période du chalcogène','T éb (K)');var d=[[2,373,'H₂O',BLUE],[3,213,'H₂S',GREY],[4,231.6,'H₂Se',GREY],[5,271,'H₂Te',GREY]];
  [3,4,5].forEach(function(k,i){LN(m.X(d[i+1][0]),m.Y(d[i+1][1]),m.X(d[i+1][0]),m.Y(d[i+1][1]),GREY);if(i)LN(m.X(d[i][0]),m.Y(d[i][1]),m.X(d[i+1][0]),m.Y(d[i+1][1]),GREY,2);});
  d.forEach(function(v){var x=m.X(v[0]),y=m.Y(v[1]);if(v[0]===2){uh_al(.35+.65*q);}DOT(x,y,7,v[3]===BLUE?ORANGE:BLUE);TB(v[2],x,y-14,INK,14);TB(Math.round(v[1])+' K',x,y+22,GREY,12);ctx.globalAlpha=1;});
  uh_al(q);uh_tag('liaison hydrogène : +100 K',W*.55,H*.2,DRED,15);ctx.globalAlpha=1;},
 /* 3 pression de vapeur */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(60,H-48,W-100,H-90,300,390,0,150,'T (K)','P (kPa)');uh_fn(m,c4_P,300,390,BLUE,3);[300,330,360,390].forEach(function(v){TB(v,m.X(v),H-32,GREY,11);});
  LN(m.X(300),m.Y(101.325),m.X(373.15),m.Y(101.325),GREY,1.2,[4,4]);DOT(m.X(373.15),m.Y(101.325),6,BLUE);TB('101,3 kPa · 100 °C',m.X(300)+6,m.Y(101.325)-8,GREY,13,'left');
  uh_al(q);var P90=c4_P(363.15);DOT(m.X(363.15),m.Y(P90),7,ORANGE);LN(m.X(363.15),H-48,m.X(363.15),m.Y(P90),ORANGE,1.4,[4,3]);uh_tag('90 °C : '+uh_f(P90,1)+' kPa',m.X(363.15)-60,m.Y(P90)+30,ORANGE,14);
  var T55=1/(1/373.15+Math.log(101.325/55)*8.314/40650);DOT(m.X(T55),m.Y(55),7,GREEN);uh_tag('55 kPa : '+uh_f(T55-273.15,1)+' °C',m.X(T55)-10,m.Y(55)-24,DGREEN,14);ctx.globalAlpha=1;},
 /* 4 cuivre cfc */
 function(p){var q=uh_e(p,0,.6),s=110,x=W*.12,y=H*.8;var P=c4_cube(x,y,s,36,BLUE_D);LN(x,y,x+s,y,BLUE_D,2.4);LN(x,y-s,x+s,y-s,BLUE_D,2.4);LN(x,y,x,y-s,BLUE_D,2.4);LN(x+s,y,x+s,y-s,BLUE_D,2.4);
  var r=s*Math.SQRT2/4;[[0,0],[1,0],[0,1],[1,1]].forEach(function(v){DOT(x+v[0]*s,y-v[1]*s,r*.98,'#f3d9bf');});DOT(x+s/2,y-s/2,r*.98,'#f3d9bf');
  [[0,0],[1,0],[0,1],[1,1],[.5,.5]].forEach(function(v){DOT(x+v[0]*s,y-v[1]*s,3,INK);});LN(x,y,x+s,y-s,RED,2,[6,4]);TB('a',x+s/2,y+18,BLUE_D,16);TB('a',x-12,y-s/2,BLUE_D,16);
  uh_al(q);TB('4r = a√2',x+s*.5,y-s-46,DRED,15);TB('Cu : cfc',W*.78,H*.2,BLUE_D,20);TB('r = 127,8 pm',W*.78,H*.45,ORANGE,18);TB('ρ = 4M/(N_A·a³)',W*.78,H*.6,INK,14);TB('= 8,93 g/cm³',W*.78,H*.72,ORANGE,20);ctx.globalAlpha=1;},
 /* 5 type de solide */
 function(p){var q=uh_e(p,0,.6),T=[['ionique',0],['covalent',1],['métallique',2],['moléculaire',3]];T.forEach(function(t,i){var cx=W*(.14+i*.24),cy=H*.45,hl=(i===0&&q>0);uh_rr(cx-48,cy-62,96,124,hl?'#fff7ea':'#fff',hl?ORANGE:AX,hl?3:1.6,10);TB(t[0],cx,cy-70+0,hl?ORANGE:INK,13);
   for(var a=0;a<3;a++)for(var b=0;b<3;b++){var x=cx-28+a*28,y=cy-26+b*28;if(i===0){uh_atom(x,y,(a+b)%2?'−':'+',(a+b)%2?BLUE_D:DRED,9);}else if(i===1){DOT(x,y,6,INK);if(a<2)LN(x,y,x+28,y,INK,2);if(b<2)LN(x,y,x,y+28,INK,2);}else if(i===2){DOT(x,y,9,'#cfd6de');DOT(x+4,y+6,1.6,BLUE);DOT(x-6,y-4,1.6,BLUE);}else{if(a<2&&b<2&&(a+b)%2===0){LN(x,y,x+12,y+8,INK,2);DOT(x,y,5,GREY);DOT(x+12,y+8,5,GREY);}}}});
  TB('dur, cassant · fond à 800 °C · isolant solide, conducteur fondu',W*.5,H*.91,GREY,12);uh_al(q);TB('→ solide ionique',W*.5,H*.14,DRED,20);ctx.globalAlpha=1;},
 /* 6 fer alpha */
 function(p){var q=uh_e(p,0,.6),s=130,x=W*.1,y=H*.84,P=c4_cube(x,y,s,36,BLUE_D);var r=s*Math.sqrt(3)/4*0+s*.43;[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]].forEach(function(v){var a=P(v[0],v[1],v[2]);DOT(a[0],a[1],8,ORANGE);});var c=P(.5,.5,.5);DOT(c[0],c[1],10,RED);var a0=P(0,0,0),a1=P(1,1,1);LN(a0[0],a0[1],a1[0],a1[1],RED,2,[6,4]);
  uh_al(q);TB('4r = a√3',x+s*.5+20,H*.1,DRED,15);TB('Fe α : cc',W*.78,H*.2,BLUE_D,20);TB('r = 124,1 pm',W*.78,H*.4,ORANGE,18);TB('ρ = 7,87 g/cm³',W*.78,H*.55,ORANGE,18);TB('cfc : +9 % au plus',W*.78,H*.72,GREY,14);ctx.globalAlpha=1;},
 /* 7 Clausius-Clapeyron éthanol */
 function(p){var q=uh_e(p,0,.6),m=uh_ax(64,H-48,W-100,H-90,.00305,.0034,1.5,4,'1/T (K⁻¹)','ln P (kPa)');var x1=1/298.15,x2=1/323.15,y1=Math.log(7.9),y2=Math.log(29.5),sl=(y2-y1)/(x2-x1);uh_fn(m,function(x){return y1+sl*(x-x1);},.00305,.0034,GREY,2,null,[5,4]);
  [[x1,y1,'25 °C · 7,9 kPa'],[x2,y2,'50 °C · 29,5 kPa']].forEach(function(v){DOT(m.X(v[0]),m.Y(v[1]),7,BLUE);tag(v[2],m.X(v[0])+(v[0]===x1?-40:50),m.Y(v[1])+(v[0]===x1?-24:-24),BLUE_D,13);});
  var dH=-sl*8.314/1000,Tb=1/(x2-(Math.log(101.325)-y2)/sl*-1*-1);var xb=x2+(Math.log(101.325)-y2)/sl;uh_al(q);LN(m.X(xb),H-48,m.X(xb),m.Y(Math.log(101.325)),ORANGE,1.4,[4,3]);DOT(m.X(xb),m.Y(Math.log(101.325)),7,ORANGE);uh_tag('ΔH vap = '+uh_f(dH,1)+' kJ/mol',W*.62,H*.2,DRED,16);uh_tag('T éb ≈ '+uh_f(1/xb-273.15,0)+' °C',m.X(xb)+10,m.Y(Math.log(101.325))-22,ORANGE,14);TB('pente = −ΔH/R',W*.62,H*.32,GREY,13);ctx.globalAlpha=1;},
 /* 8 isomères pentane */
 function(p){var q=uh_e(p,0,.6),iso=[['pentane',36.1],['2-méthylbutane',27.7],['néopentane',9.5]];
  function ch(pts,cx,cy,sc){ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();pts.forEach(function(P,i){var x=cx+P[0]*sc,y=cy-P[1]*sc;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();}
  function seg(a,b,cx,cy,sc){LN(cx+a[0]*sc,cy-a[1]*sc,cx+b[0]*sc,cy-b[1]*sc,BLUE_D,3);}
  var s=24;ch([[-2,0],[-1,.6],[0,0],[1,.6],[2,0]],W*.17,H*.34,s);ch([[-1.5,0],[-.5,.6],[.5,0],[1.5,.6]],W*.5,H*.34,s);seg([-.5,.6],[-.5,1.7],W*.5,H*.34,s);
  seg([-1,0],[0,.6],W*.83,H*.34,s);seg([0,.6],[1,0],W*.83,H*.34,s);seg([0,.6],[0,1.7],W*.83,H*.34,s);seg([0,.6],[-.4,-.5],W*.83,H*.34,s);
  iso.forEach(function(v,i){var x=W*(.17+i*.33);TB(v[0],x,H*.1,BLUE_D,14);var h=(v[1]+10)*2.2*q,bx=x-30;uh_rr(bx,H*.9-Math.max(h,2),60,Math.max(h,2),ORANGE+'33',ORANGE,2,3);uh_al(q);TB(uh_f(v[1],1)+' °C',x,H*.9-h-8,DRED,14);ctx.globalAlpha=1;});},
 /* 9 surfactant */
 function(p){var q=uh_e(p,0,.6),x1=W*.22,x2=W*.58;c4_alv(x1,H*.46,36,BLUE);c4_alv(x2,H*.46,72,GREEN);LN(x1+36,H*.46,x2-72,H*.46,GREY,10);TB('50 µm',x1,H*.46+5,BLUE_D,14);TB('100 µm',x2,H*.46+5,DGREEN,15);
  uh_al(q);TB('ΔP = 2γ/r',x1,H*.12,BLUE_D,15);TB('2 kPa',x1,H*.46+60,DRED,16);TB('1 kPa',x2,H*.46+100,DGREEN,16);A(x1+40,H*.46-2,x2-72-x1-44,0,ORANGE,'',3);TB('le petit alvéole se vide dans le grand',W*.5,H*.2,ORANGE,13);
  TB('r = 50 µm : sans surfactant 20 cmH₂O',W*.04,H*.8,DRED,13,'left');TB('avec surfactant (5 mN/m) : 2 cmH₂O',W*.04,H*.88,DGREEN,13,'left');ctx.globalAlpha=1;TB('γ = 50 mN/m',W*.8,H*.12,GREY,14);},
 /* 10 autoclave */
 function(p){var q=uh_e(p,0,.7),ax=W*.08,ay=H*.3,aw=W*.4,ah=H*.55;uh_rr(ax,ay,aw,ah,'#f4f6f8',INK,3,18);ctx.fillStyle='#e6f1fb';ctx.beginPath();ctx.roundRect(ax+4,ay+ah*.68,aw-8,ah*.32-4,[0,0,14,14]);ctx.fill();for(var i=0;i<6;i++){var t=tGlob=0;DOT(ax+20+i*(aw-40)/5,ay+ah*.4+8*Math.sin(i*2)+ (q>0?0:0),4,'#bcd7f0');}
  TB('121 °C',ax+aw/2,ay+ah*.45,DRED,20);var gx=W*.72,gy=H*.45,gr=64;DOT(gx,gy,gr,'#fff');ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.arc(gx,gy,gr,0,7);ctx.stroke();for(var k=0;k<=8;k++){var a=(225-k*33.75)*D2R;LN(gx+Math.cos(a)*(gr-10),gy-Math.sin(a)*(gr-10),gx+Math.cos(a)*(gr-3),gy-Math.sin(a)*(gr-3),INK,2);}
  var val=102*q,a=(225-val/150*270)*D2R;LN(gx,gy,gx+Math.cos(a)*(gr-14),gy-Math.sin(a)*(gr-14),RED,3.4);DOT(gx,gy,5,INK);TB('kPa',gx,gy+34,GREY,12);TB('manomètre',gx,gy-gr-8,GREY,13);
  uh_al(q);TB('P abs ≈ 204 kPa',gx,gy+gr+24,ORANGE,16);TB('surpression ≈ 102 kPa',gx,gy+gr+44,DRED,16);ctx.globalAlpha=1;LN(ax+aw,ay+20,gx-gr,gy,GREY,3);},
 /* 11 distance voisins cfc */
 function(p){var q=uh_e(p,0,.6),s=150,x=W*.2,y=H*.86;ctx.strokeStyle=BLUE_D;ctx.lineWidth=2.6;ctx.strokeRect(x,y-s,s,s);[[0,0],[1,0],[0,1],[1,1]].forEach(function(v){DOT(x+v[0]*s,y-v[1]*s,16,'#f3d9bf');});DOT(x+s/2,y-s/2,16,'#bfdcb5');LN(x,y,x+s,y-s,GREY,1.6,[6,4]);TB('a',x+s/2,y+18,BLUE_D,16);
  uh_al(q);A(x+4,y-4,s/2-12,-(s/2-12),RED,'',3.6);TB('d = a√2/2',x+s*.62,y-s*.28,DRED,17,'left');ctx.globalAlpha=1;TB('cfc : atomes en contact sur la diagonale',W*.62,H*.12,GREY,13);},
 /* 12 chauffage de la glace */
 function(p){var q=uh_e(p,0,.7);var seg=[[1.045,'glace −10→0',GREY],[16.68,'fusion',BLUE],[20.92,'eau 0→100',GREEN],[112.8,'vaporisation',RED],[0,'',ORANGE]];var x0=54,w=W-90,tot=151.4,y0=H-48,h=H-100,cum=0;LN(x0,y0,x0+w+6,y0,GREY,1.5);LN(x0,y0,x0,y0-h-8,GREY,1.5);TB('T',x0+6,y0-h-12,GREY,12,'left');TB('chaleur Q',x0+w,y0+30,GREY,12,'right');
  var pts=[[0,-10],[1.045,0],[1.045+16.68,0],[1.045+16.68+20.92,100],[tot,100]],Y=function(T){return y0-(T+10)/130*h;};var X=function(Q){return x0+Q/tot*w*0.98;};
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3.4;ctx.beginPath();pts.forEach(function(P,i){i?ctx.lineTo(X(P[0]),Y(P[1])):ctx.moveTo(X(P[0]),Y(P[1]));});ctx.stroke();
  uh_al(q);TB('fusion 16,7 kJ',X(19),Y(0)+22,BLUE,13,'left');TB('20,9 kJ',X(28)+10,Y(60),DGREEN,13,'left');TB('112,8 kJ (74 %)',X(92),Y(100)-10,DRED,15);uh_tag('Q total ≈ 151 kJ',W*.42,H*.5,ORANGE,17);ctx.globalAlpha=1;TB('0 °C',x0-6,Y(0)+4,GREY,11,'right');TB('100 °C',x0-6,Y(100)+4,GREY,11,'right');},
 /* 13 NaCl */
 function(p){var q=uh_e(p,0,.6),y=H*.46,x0=W*.05+181*(W*.9)/926,k=(W*.9)/926,rCl=181*k,rNa=102*k;LN(x0,y+60,x0+564*k,y+60,GREY,1.6);LN(x0,y+54,x0,y+66,GREY,1.6);LN(x0+564*k,y+54,x0+564*k,y+66,GREY,1.6);TB('a = 564 pm',x0+282*k,y+82,BLUE_D,15);
  [[0,rCl,'Cl⁻',GREEN],[282,rNa,'Na⁺',RED],[564,rCl,'Cl⁻',GREEN]].forEach(function(v){DOT(x0+v[0]*k,y,v[1],v[3]+'33');ctx.strokeStyle=v[3];ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x0+v[0]*k,y,v[1],0,7);ctx.stroke();TB(v[2],x0+v[0]*k,y+5,dk(v[3]),15);});
  uh_al(q);TB('181 + 102 = 283 pm ≈ a/2 = 282 pm',W*.5,H*.12,DRED,15);TB('4 NaCl par maille · ρ = 2,16 g/cm³',W*.5,H*.92,ORANGE,16);ctx.globalAlpha=1;}
]);
