/* Chimie BA1 · c08 · Oxydoréduction et électrochimie — théorie animée et devantures, contenu SFA original. */
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

/* ---- c08 : aides ---- */
function c8_beaker(x,y,w,h,liq,a){ctx.fillStyle=liq;ctx.globalAlpha=a==null?.35:a;ctx.fillRect(x+2,y+h*.28,w-4,h*.72-2);ctx.globalAlpha=1;ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y);ctx.stroke();}
function c8_pile(o){var t=o.t,bw=W*.27,bh=H*.34,by=H*.56,lx=W*.1,rx=W*.63,ye=H*.24,cl=lx+bw*.5,cr=rx+bw*.5,mid=W*.5;
 var sh=o.sh==null?0:o.sh;
 /* pont salin */ ctx.lineJoin='round';ctx.lineCap='round';var yb=by-H*.06;ctx.strokeStyle='#d8c38a';ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(lx+bw*.82,by+bh*.45);ctx.lineTo(lx+bw*.82,yb);ctx.lineTo(rx+bw*.18,yb);ctx.lineTo(rx+bw*.18,by+bh*.45);ctx.stroke();
 ctx.strokeStyle='#fff7df';ctx.lineWidth=7;ctx.stroke();
 c8_beaker(lx,by,bw,bh,o.lliq,.38);c8_beaker(rx,by,bw,bh,o.rliq,o.ra==null?.38:o.ra);
 /* électrodes */ var hl=bh*.72*(1-.18*sh),hr=bh*.72*(1+.0*sh);
 ctx.fillStyle=o.lm;ctx.fillRect(cl-6,ye,12,by+bh*.78-ye-(sh*bh*.1));ctx.fillStyle=o.rm;ctx.fillRect(cr-6,ye,12,by+bh*.78-ye);
 if(sh>0){ctx.fillStyle=o.rm;ctx.globalAlpha=.9;ctx.fillRect(cr-6-sh*5,by+bh*.4,sh*5,bh*.38);ctx.fillRect(cr+6,by+bh*.4,sh*5,bh*.38);ctx.globalAlpha=1;}
 TB(o.lname,cl-22,by+bh*.62,dk(o.lcol||INK),15,'right');TB(o.rname,cr+24,by+bh*.62,dk(o.rcol||INK),15,'left');
 TB(o.ls,lx+bw*.5,by+bh+18,INK,13);TB(o.rs,rx+bw*.5,by+bh+18,INK,13);
 /* fil + voltmètre */ LN(cl,ye,mid-24,ye,INK,2.4);LN(mid+24,ye,cr,ye,INK,2.4);DOT(mid,ye,24,'#fff');ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(mid,ye,24,0,7);ctx.stroke();TB('V',mid,ye+6,INK,18);
 if(o.V!=null){uh_al(o.va==null?1:o.va);uh_tag(o.V,mid,ye-40,DRED,17);ctx.globalAlpha=1;}
 /* électrons */ if(t!=null){for(var k=0;k<6;k++){var u=((t*.006+k/6)%1);var x=cl+(cr-cl)*u;if(Math.abs(x-mid)<28)continue;DOT(x,ye,4.5,BLUE);}TB('e⁻ →',W*.27,ye-12,BLUE_D,14);}
 else if(o.arrow!==false){A(cl+16,ye-12,Math.max(30,mid-cl-70),0,BLUE,'',2.6);TB('e⁻',cl+(mid-cl)/2-8,ye-22,BLUE_D,14);}
 TB(o.ln1||'−',cl,ye-12,dk(RED),20);TB(o.rn1||'+',cr,ye-12,dk(BLUE),20);
 /* ions dans le pont */ if(t!=null){for(var j=0;j<4;j++){var u2=((t*.004+j/4)%1);if(j%2)u2=1-u2;var xx=lx+bw*.82+(rx+bw*.18-lx-bw*.82)*u2;uh_atom(xx,yb,j%2?'−':'+',j%2?BLUE:RED,7);}}
}
function c8_gain(p){return Math.max(0,Math.min(1,p));}
var C8_ZN='#9aa0a6',C8_CU='#c97b3c',C8_AG='#cfd2d6';
SFA.theo("c08",{
 icon:function(){TB('E = E° − (0,059/n)·log Q',W*.5,H*.42,BLUE_D,27);TB('ΔG° = −nFE°',W*.5,H*.64,ORANGE,22);TB('Nernst · piles · électrolyse',W*.5,H*.84,GREY,15);},
 anim:function(t){var sh=.5+.5*Math.sin(t*.01);
  c8_pile({t:t,sh:sh,lm:C8_ZN,rm:C8_CU,lliq:'#cfd8dc',rliq:BLUE,lname:'Zn',rname:'Cu',lcol:GREY,rcol:ORA2,ls:'Zn²⁺ (incolore)',rs:'Cu²⁺ (bleu)',V:'E° = 1,10 V'});
  TB('Anode (−) : Zn → Zn²⁺ + 2 e⁻',10,20,DRED,14,'left');TB('Cathode (+) : Cu²⁺ + 2 e⁻ → Cu',W-10,20,BLUE_D,14,'right');
  TB('oxydation',W*.24,H*.44,DRED,13);TB('réduction',W*.76,H*.44,BLUE_D,13);TB('pont salin',W*.5,H*.5-14,GREY,13);},
 th:'<div class="tcard"><b class="h">Nombres d’oxydation et demi-équations</b><p>Le <b>nombre d’oxydation</b> (n.o.) est la charge fictive d’un atome si tous les électrons de liaison allaient à l’atome le plus électronégatif. Règles : Σ n.o. = charge de l’espèce ; O = −II (sauf peroxydes), H = +I (sauf hydrures), corps simple = 0. <b>Oxydation</b> : le n.o. augmente (perte d’électrons) ; <b>réduction</b> : le n.o. diminue. L’oxydant gagne des électrons, le réducteur en cède.</p><p><b>Exemples</b> : MnO₄⁻ : x + 4(−2) = −1 ⟹ Mn +VII ; Cr₂O₇²⁻ : 2x − 14 = −2 ⟹ Cr +VI ; NH₄⁺ : N −III.</p><p><b>Équilibrer</b> : (1) demi-équations ; (2) atomes autres que O et H ; (3) O avec H₂O ; (4) H avec H⁺ (milieu acide) puis, en milieu basique, ajouter autant d’OH⁻ que de H⁺ de chaque côté ; (5) charges avec e⁻ ; (6) égaliser les électrons. Exemple basique : 2 Cr(OH)₃ + 3 ClO⁻ + 4 OH⁻ → 2 CrO₄²⁻ + 3 Cl⁻ + 5 H₂O (6 e⁻ échangés).</p></div>'+
 '<div class="tcard"><b class="h">Piles : E° et ΔG°</b><p>Dans une pile, l’<b>anode (−)</b> est le siège de l’<b>oxydation</b>, la <b>cathode (+)</b> celui de la <b>réduction</b> ; les électrons circulent de l’anode vers la cathode dans le fil, un pont salin ferme le circuit. <b>E°<sub>pile</sub> = E°<sub>cathode</sub> − E°<sub>anode</sub></b> ; la réaction est spontanée si E° &gt; 0.</p><p><b>ΔG° = −nFE°</b> (F = 96 485 C/mol) et <b>log K = nE°/0,0592</b> à 25 °C. <b>Daniell</b> (Zn | Zn²⁺ || Cu²⁺ | Cu) : E° = 0,34 − (−0,76) = 1,10 V ; ΔG° = −2 × 96 485 × 1,10 = −212 kJ/mol ; log K = 2 × 1,10/0,0592 ≈ 37 (K ≈ 10³⁷). Les potentiels standard ne se multiplient pas : ce sont les <b>ΔG° qui s’additionnent</b> : E°(Fe³⁺/Fe) = (1 × 0,77 + 2 × (−0,44))/3 = −0,04 V.</p></div>'+
 '<div class="tcard"><b class="h">Équation de Nernst</b><p><b>E = E° − (RT/nF) ln Q = E° − (0,0592/n) log Q</b> à 25 °C, Q étant le quotient de réaction (solides et solvant exclus, <b>chaque concentration élevée à son coefficient</b>). Une pile « s’use » : Q grandit, E diminue jusqu’à 0 à l’équilibre (Q = K).</p><p><b>Exemples</b> : Zn | Zn²⁺ (1,0) || Cu²⁺ (0,010) | Cu : Q = 1/0,010 = 100, E = 1,10 − (0,0592/2) × 2 = 1,04 V. Diluer 100 fois Cu²⁺ fait baisser E de 0,059 V. Pile Ni | Ni²⁺ (0,010) || Ag⁺ (0,10) | Ag : Q = 0,010/0,10² = 1, donc E = E° = 1,06 V (piège : Ag⁺ est au carré). Une <b>pile de concentration</b> (même couple des deux côtés) a E° = 0 : seul compte le rapport des concentrations.</p></div>'+
 '<div class="tcard"><b class="h">Électrolyse et loi de Faraday</b><p>L’électrolyse impose un courant pour forcer une réaction non spontanée : l’anode (+) oxyde, la cathode (−) réduit. <b>Q = I·t</b> ; <b>n(e⁻) = Q/F</b> ; m = (Q/nF)·M avec n le nombre d’électrons par ion. <b>Exemple</b> : 2,00 A pendant 30,0 min : Q = 3600 C ; n(e⁻) = 0,0373 mol ; Ag⁺ + e⁻ → Ag donne 0,0373 mol d’argent, soit 4,02 g.</p><p>En solution aqueuse, <b>l’eau entre en compétition</b> : Na⁺, K⁺, Ca²⁺ ne sont jamais réduits (c’est H₂O qui l’est : 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻), SO₄²⁻ n’est pas oxydé (2 H₂O → O₂ + 4 H⁺ + 4 e⁻). Avec Na₂SO₄ : H₂ à la cathode, O₂ à l’anode, et V(H₂)/V(O₂) = <b>2</b> (4 e⁻ pour 2 H₂ et 1 O₂).</p></div>'+
 '<div class="tcard"><b class="h">Dosages redox et applications au vivant</b><p><b>Dosage</b> : à l’équivalence, n(oxydant) × (e⁻ gagnés) = n(réducteur) × (e⁻ cédés). MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O ; le permanganate sert d’indicateur (rose persistant). 11,70 mL à 2,00·10⁻³ mol/L : n(MnO₄⁻) = 2,34·10⁻⁵ mol ; n(Fe²⁺) = 1,17·10⁻⁴ mol dans 25,00 mL, soit 4,68·10⁻³ mol/L et 65,3 mg de fer dans 250 mL.</p><p><b>Potentiel de membrane</b> (Nernst, 37 °C, RT/F = 26,7 mV) : E<sub>K</sub> = 26,7 ln([K⁺]<sub>ext</sub>/[K⁺]<sub>int</sub>) : 4,5 mmol/L donne −91,8 mV, 9,0 mmol/L donne −73,3 mV (hyperkaliémie : dépolarisation). <b>Chaîne respiratoire</b> : NADH + ½ O₂ → NAD⁺ + H₂O, E°′ = 0,82 − (−0,32) = 1,14 V ; ΔG°′ = −2 × 96 485 × 1,14 ≈ −220 kJ/mol, soit au plus 220/30,5 ≈ 7 ATP.</p></div>'
});
SFA.figs("c08",[
 /* 0 nombres d'oxydation */
 function(p){var it=[['MnO₄⁻','Mn','+VII',BLUE],['Cr₂O₇²⁻','Cr','+VI',ORA2],['SO₃²⁻','S','+IV',GREEN],['NH₄⁺','N','−III',VIOLET]];
  it.forEach(function(r,i){var x=W*(.27+.46*(i%2)),y=H*(.27+.44*(i>1?1:0)),a=uh_e(p,i*.12,i*.12+.4);uh_rr(x-98,y-48,196,98,'#fff',r[3],2.4);TB(r[0],x,y-6,INK,27);
   if(a<=0)TB(r[1]+' : ?',x,y+32,GREY,20);else{uh_al(a);TB(r[1]+' : '+r[2],x,y+32,dk(r[3]),22);ctx.globalAlpha=1;}});},
 /* 1 pile Zn/Cu */
 function(p){var q=uh_e(p,0,.6);c8_pile({lm:C8_ZN,rm:C8_CU,lliq:'#cfd8dc',rliq:BLUE,lname:'Zn',rname:'Cu',lcol:GREY,rcol:ORA2,ls:'Zn²⁺ 1 M',rs:'Cu²⁺ 1 M',V:'E° = 1,10 V',va:q});
  uh_al(q);uh_tag('ΔG° = −2 × 96 485 × 1,10 = −212 kJ/mol',W*.5,H*.4,DRED,14);ctx.globalAlpha=1;},
 /* 2 QCM lire une pile */
 function(p){var q=uh_e(p,0,.6);c8_pile({lm:C8_ZN,rm:C8_CU,lliq:'#cfd8dc',rliq:BLUE,lname:'Zn',rname:'Cu',lcol:GREY,rcol:ORA2,ls:'Zn²⁺',rs:'Cu²⁺',ln1:q>.5?'−':'?',rn1:q>.5?'+':'?'});
  TB('Anode',W*.24,H*.09,DRED,16);TB('Cathode',W*.76,H*.09,BLUE_D,16);
  if(q>0){uh_al(q);TB('oxydation',W*.24,H*.44,DRED,15);uh_rr(W*.6,H*.02,W*.34,H*.2,'rgba(29,158,117,.12)',GREEN,2);TB('réduction · pôle +',W*.76,H*.44,DGREEN,15);ctx.globalAlpha=1;}
  else{TB('?',W*.24,H*.44,GREY,20);TB('?',W*.76,H*.44,GREY,20);}},
 /* 3 Nernst */
 function(p){var q=uh_e(p,0,.6);c8_pile({lm:C8_ZN,rm:C8_CU,lliq:'#cfd8dc',rliq:BLUE,ra:.12+.26*(1-q),lname:'Zn',rname:'Cu',lcol:GREY,rcol:ORA2,ls:'Zn²⁺ 1,0 M',rs:'Cu²⁺ 0,010 M',V:q>.5?'E ≈ 1,04 V':'E° = 1,10 V'});
  uh_al(q);uh_tag('Q = 1,0/0,010 = 100 → −0,059 V',W*.5,H*.4,DRED,14);ctx.globalAlpha=1;},
 /* 4 argenture */
 function(p){var q=uh_e(p,0,.8),bx=W*.2,bw=W*.6,by=H*.42,bh=H*.46,xa=W*.36,xc=W*.64,ye=H*.2;ctx.fillStyle='rgba(55,138,221,.18)';ctx.fillRect(bx+2,by+10,bw-4,bh-12);ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx,by+bh);ctx.lineTo(bx+bw,by+bh);ctx.lineTo(bx+bw,by);ctx.stroke();
  ctx.fillStyle=C8_AG;ctx.fillRect(xa-5,ye,10,by+bh*.7-ye);ctx.fillStyle='#8d9299';ctx.fillRect(xc-9,by-8,18,bh*.72);ctx.fillStyle='#e8ecef';var th=2+10*q;ctx.fillRect(xc-9-th,by-8,th,bh*.72);ctx.fillRect(xc+9,by-8,th,bh*.72);
  LN(xa,ye,xa,H*.1,INK,2.4);LN(xc,by-8,xc,H*.1,INK,2.4);LN(xa,H*.1,W*.47,H*.1,INK,2.4);LN(xc,H*.1,W*.53,H*.1,INK,2.4);LN(W*.47,H*.05,W*.47,H*.15,INK,3);LN(W*.53,H*.07,W*.53,H*.13,INK,3);
  TB('+',xa-14,H*.17,DRED,20);TB('−',xc+22,H*.17,BLUE_D,20);TB('anode',xa,by-14,DRED,13);TB('objet = cathode',xc+10,by-26,BLUE_D,13);
  for(var k=0;k<5;k++){var u=((k/5+q*.8+Date.now()/6000)%1);uh_atom(xa+10+(xc-xa-34)*u,by+34+(k%3)*30,'+',BLUE,8);}
  TB('Ag⁺ + e⁻ → Ag',W*.5,by+bh-10,BLUE_D,15);TB('I = 2,00 A ; t = 30,0 min',W*.03,H*.07,GREY,13,'left');
  uh_al(q);uh_tag('Q = 3600 C → 0,0373 mol → 4,02 g d’argent',W*.5,H*.965,DRED,14);ctx.globalAlpha=1;},
 /* 5 QCM dilution */
 function(p){var q=uh_e(p,0,.7),m=uh_ax(70,H-48,W-110,H-100,-4,0,.96,1.12,'log [Cu²⁺]','E (V)'),E=function(l){return 1.10+.0296*l;};uh_fn(m,E,-4,0,BLUE,3);
  [-4,-3,-2,-1,0].forEach(function(v){TB(v,m.X(v),H-30,GREY,12);});[1.00,1.05,1.10].forEach(function(v){TB(uh_f(v,2),64,m.Y(v)+4,GREY,12,'right');});
  DOT(m.X(-1),m.Y(E(-1)),7,BLUE);TB('départ',m.X(-1)-34,m.Y(E(-1))-12,BLUE_D,13);
  if(q>0){uh_al(q);LN(m.X(-1),m.Y(E(-1)),m.X(-3),m.Y(E(-1)),ORANGE,1.6,[5,4]);A(m.X(-3)+30,m.Y(E(-1))+2,-28,0,ORANGE,'',2);DOT(m.X(-3),m.Y(E(-3)),7,ORA2);LN(m.X(-3),m.Y(E(-1)),m.X(-3),m.Y(E(-3)),RED,2.4);uh_tag('÷100 : ΔE = −0,059 V',m.X(-2),m.Y(E(-1))-30,DRED,15);ctx.globalAlpha=1;}
  TB('pente = 0,0592/2 = 29,6 mV par décade',W*.5,16,GREY,13);},
 /* 6 dosage fer */
 function(p){var q=uh_e(p,0,.75),cx=W*.5,lv=1-.6*q;ctx.fillStyle='rgba(127,0,160,.55)';ctx.fillRect(cx-7,12+(1-lv)*70+10,14,70*lv);ctx.strokeStyle=INK;ctx.lineWidth=2.2;ctx.strokeRect(cx-7,12,14,92);LN(cx-3,104,cx-3,118,INK,2);LN(cx+3,104,cx+3,118,INK,2);
  if(q<1&&q>0)DOT(cx,124+((Date.now()/150)%8),3.5,'#7f1fa0');
  var y0=146,y1=250,r=Math.min(255,Math.round(240-10*0)),cc=q>.85?'rgba(215,60,150,.55)':'rgba(236,220,120,.45)';ctx.fillStyle=cc;ctx.beginPath();ctx.moveTo(cx-34,y0+54);ctx.lineTo(cx+34,y0+54);ctx.lineTo(cx+55,y1);ctx.lineTo(cx-55,y1);ctx.closePath();ctx.fill();
  ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx-16,y0);ctx.lineTo(cx-16,y0+30);ctx.lineTo(cx-56,y1);ctx.lineTo(cx+56,y1);ctx.lineTo(cx+16,y0+30);ctx.lineTo(cx+16,y0);ctx.stroke();
  TB('KMnO₄',cx-40,40,'#7f1fa0',15,'right');TB('2,00·10⁻³ mol/L',cx-40,58,GREY,13,'right');TB('Fe²⁺ + H₂SO₄',cx-70,y1-30,DGREEN,14,'right');TB('25,00 mL',cx-70,y1-12,GREY,13,'right');
  TB('1 MnO₄⁻ ↔ 5 Fe²⁺',W*.8,70,BLUE_D,16);if(q>.85){uh_al((q-.85)*6.7);TB('rose persistant',cx+70,y1-30,'#b0307a',14,'left');ctx.globalAlpha=1;}
  uh_al(q);uh_tag('Véq = 11,70 mL',W*.8,110,DRED,15);uh_tag('[Fe²⁺] = 4,68·10⁻³ mol/L',W*.8,170,DRED,14);uh_tag('65,3 mg / comprimé',W*.8,200,DRED,14);ctx.globalAlpha=1;},
 /* 7 équilibrage basique */
 function(p){var q=uh_e(p,0,.7);TB('milieu basique',W*.5,18,GREY,14);
  [['Cr','+III','+VI','Cr(OH)₃','CrO₄²⁻','−3 e⁻  (× 2)',GREEN,'#e0b81c',H*.3],['Cl','+I','−I','ClO⁻','Cl⁻','+2 e⁻  (× 3)',VIOLET,'#cfd8dc',H*.58]].forEach(function(r){var y=r[8];uh_atom(W*.15,y,r[1],r[6],21);TB(r[3],W*.15,y+42,INK,14);A(W*.28,y,W*.3,0,r[6],'',3);TB(r[5],W*.43,y-14,dk(r[6]),14);
   DOT(W*.75,y,23,r[7]);ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(W*.75,y,23,0,7);ctx.stroke();TB(r[2],W*.75,y+5,INK,16);TB(r[4],W*.75,y+44,INK,14);});
  uh_al(q);uh_rr(W*.02,H*.8,W*.96,34,'#fff7ea',ORANGE,2);TB('2 Cr(OH)₃ + 3 ClO⁻ + 4 OH⁻ → 2 CrO₄²⁻ + 3 Cl⁻ + 5 H₂O',W*.5,H*.8+22,ORANGE,13);ctx.globalAlpha=1;},
 /* 8 électrolyse Na2SO4 */
 function(p){var q=uh_e(p,0,.8),g=q*58,bx=26,bw=W-52,by=H*.55;ctx.fillStyle='rgba(55,138,221,.16)';ctx.fillRect(bx,by,bw,H*.4);ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(bx,by-10);ctx.lineTo(bx,H*.95);ctx.lineTo(bx+bw,H*.95);ctx.lineTo(bx+bw,by-10);ctx.stroke();
  [[W*.3,2*g,'H₂','cathode (−)',RED,'2 vol'],[W*.7,g,'O₂','anode (+)',BLUE,'1 vol']].forEach(function(r){var x=r[0],top=36;ctx.fillStyle='rgba(55,138,221,.16)';ctx.fillRect(x-30,top+r[1],60,H*.8-top-r[1]-8);ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(x-30,top,60,r[1]);ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-30,H*.82);ctx.lineTo(x-30,top);ctx.lineTo(x+30,top);ctx.lineTo(x+30,H*.82);ctx.stroke();LN(x,top+4,x,H*.9,r[4]==RED?C8_ZN:C8_AG,5);
   if(q>0.05){TB(r[2],x,top+r[1]/2+6,dk(r[4]),r[1]>30?20:16);} TB(r[3],x,H*.93,dk(r[4]),14);});
  uh_al(q);TB('2 vol',W*.3+46,48+g,DRED,15,'left');TB('1 vol',W*.7+46,48+g/2,DRED,15,'left');TB('V(H₂)/V(O₂) = 2',W*.5,24,DRED,16);ctx.globalAlpha=1;TB('Na₂SO₄(aq)',W*.5,H*.8,GREY,13);},
 /* 9 Ni/Ag */
 function(p){var q=uh_e(p,0,.6);c8_pile({lm:C8_ZN,rm:C8_AG,lliq:'#bfe3cf',rliq:'#cfd8dc',ra:.3,lname:'Ni',rname:'Ag',lcol:DGREEN,rcol:GREY,ls:'Ni²⁺ 0,010 M',rs:'Ag⁺ 0,10 M',V:q>.4?'E = 1,06 V':'E = ?'});
  uh_al(q);uh_tag('Q = 0,010/0,10² = 1 → E = E°',W*.5,H*.4,DRED,14);ctx.globalAlpha=1;},
 /* 10 Fe3+/Fe2+/Fe */
 function(p){var q=uh_e(p,0,.7),xs=[W*.18,W*.5,W*.82],G=[0,-.77,.11],y0=H*.5,k=95,nm=['Fe³⁺','Fe²⁺','Fe'];
  xs.forEach(function(x,i){var y=y0-G[i]*k;LN(x-36,y,x+36,y,INK,4);TB(nm[i],x,y+(i==1?24:-12),INK,18);});
  A(xs[0]+40,y0+4,xs[1]-xs[0]-86,(-G[1]*k)-12,BLUE,'',2.6);TB('+0,77 V',W*.2,H*.74,BLUE_D,15);TB('n = 1',W*.2,H*.74+18,BLUE_D,13);
  A(xs[1]+40,y0-G[1]*k-4,xs[2]-xs[1]-86,-(G[2]-G[1])*k+12,ORA2,'',2.6);TB('−0,44 V',W*.8,H*.74,DRED,15);TB('n = 2',W*.8,H*.74+18,DRED,13);
  TB('E° de chaque étape',W*.5,H*.97,GREY,13);
  if(q>0){uh_al(q);var yb=H*.3;LN(xs[0],y0-14,xs[0],yb,GREEN,2,[6,4]);LN(xs[2],y0-G[2]*k-16,xs[2],yb,GREEN,2,[6,4]);LN(xs[0],yb,xs[2],yb,GREEN,2.4,[6,4]);TB('n = 3, E° = ?',W*.5,yb+18,DGREEN,14);
   uh_tag('3 E° = 1 × 0,77 + 2 × (−0,44) → E° = −0,04 V',W*.5,H*.1,DRED,14);ctx.globalAlpha=1;}},
 /* 11 hyperkaliémie */
 function(p){var q=uh_e(p,0,.7),m=uh_ax(64,H-46,W-100,H-90,3,10,-100,-60,'[K⁺]ext (mmol/L)','EK (mV)');uh_fn(m,function(x){return 26.7*Math.log(x/140);},3,10,BLUE,3);
  [4,6,8,10].forEach(function(v){TB(v,m.X(v),H-28,GREY,12);});[-100,-90,-80,-70,-60].forEach(function(v){TB(String(v).replace('-','−'),58,m.Y(v)+4,GREY,12,'right');});
  [[4.5,GREEN,'normale'],[7.5,ORANGE,'modérée'],[9,RED,'sévère']].forEach(function(P,i){var E=26.7*Math.log(P[0]/140);DOT(m.X(P[0]),m.Y(E),7,P[1]);if(q>i*.3){uh_al(Math.min(1,(q-i*.3)*4));LN(m.X(P[0]),H-46,m.X(P[0]),m.Y(E),P[1],1.5,[4,3]);uh_tag(uh_f(E,1)+' mV',m.X(P[0])+(i==0?24:0),m.Y(E)+(i==0?-26:30),dk(P[1]),13);ctx.globalAlpha=1;}});
  TB('hyperkaliémie → dépolarisation',W*.62,m.Y(-98),DRED,13);},
 /* 12 chaîne respiratoire */
 function(p){var q=uh_e(p,0,.5),q2=uh_e(p,.4,1),m=uh_ax(60,H-30,W*.46,H-64,-.4,.9,-.4,.9,'','E°′ (V)'),xa=60+W*.46;
  [[-.32,'NAD⁺/NADH',GREEN],[.82,'½ O₂/H₂O',BLUE]].forEach(function(r){var y=m.Y(r[0]);LN(80,y,xa-40,y,r[2],5);TB(r[1]+'  '+(r[0]>0?'+':'−')+uh_f(Math.abs(r[0]),2)+' V',80,y-10,dk(r[2]),14,'left');});
  A(xa-44,m.Y(-.32)-4,0,-(m.Y(-.32)-m.Y(.82))+14,ORA2,'',3);TB('e⁻',xa-54,m.Y(.25),DRED,15,'right');
  uh_al(q);uh_tag('ΔE°′ = 1,14 V',W*.27,m.Y(.25)+20,DRED,16);ctx.globalAlpha=1;
  for(var i=0;i<7;i++){var a=uh_e(q2,i/8,i/8+.2);if(a<=0)continue;uh_al(a);uh_rr(W*.7,H-44-i*29,70,24,'#fff7ea',ORANGE,2,6);TB('ATP',W*.7+35,H-44-i*29+17,ORANGE,14);ctx.globalAlpha=1;}
  uh_al(q2);TB('≤ 7 ATP',W*.7+35,24,DRED,17);TB('ΔG°′ = −220 kJ/mol',W*.27,m.Y(.25)+44,GREY,13);ctx.globalAlpha=1;},
 /* 13 Ks AgCl */
 function(p){var q=uh_e(p,0,.7),X=function(e){return 36+e/.9*(W-72);},y=H*.52;LN(36,y,W-30,y,GREY,2);[0,.2,.4,.6,.8].forEach(function(v){LN(X(v),y-4,X(v),y+4,GREY,1.5);TB(uh_f(v,1),X(v),y+22,GREY,12);});TB('E° (V)',W-30,y+22,GREY,12,'right');
  DOT(X(.222),y,8,GREEN);TB('AgCl/Ag, Cl⁻',X(.222),y-44,DGREEN,14);TB('0,222 V',X(.222),y-26,DGREEN,14);DOT(X(.8),y,8,BLUE);TB('Ag⁺/Ag',X(.8),y-44,BLUE_D,14);TB('0,800 V',X(.8),y-26,BLUE_D,14);
  TB('AgCl(s) → Ag⁺ + Cl⁻',W*.5,24,INK,16);
  uh_al(q);A(X(.8)-8,y+46,X(.222)-X(.8)+16,0,RED,'',2.6);TB('E° = 0,222 − 0,800 = −0,578 V',W*.5,y+74,DRED,14);uh_tag('log Ks = −0,578/0,0592 → Ks = 1,7·10⁻¹⁰',W*.5,H*.93,DRED,14);ctx.globalAlpha=1;}
]);
