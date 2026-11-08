/* Chimie BA1 · c02 · théorie animée et devantures d'exercices — contenu SFA original. */
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
function c2_lobe(cx,cy,ang,L,Wd,col,al){ctx.save();ctx.translate(cx,cy);ctx.rotate(-ang*D2R);uh_al(al);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(L*.3,-Wd,L*.95,-Wd*.8,L,0);ctx.bezierCurveTo(L*.95,Wd*.8,L*.3,Wd,0,0);ctx.fillStyle=col+'44';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();ctx.restore();ctx.globalAlpha=1;}
function c2_atoms(L){L.forEach(function(a){uh_atom(a[0],a[1],a[2],a[3]||INK,a[4]||13);});}
/* diagramme d'OM de O2 : fill = nb d'électrons par niveau */
function c2_mo(x0,y0,w,h,hl){var lv=[['σ*2p',.04,1,0],['π*2p',.2,2,2],['σ2p',.42,1,2],['π2p',.55,2,4],['σ*2s',.72,1,2],['σ2s',.88,1,2]];
 LN(x0-8,y0+h*.2,x0-8,y0-4,GREY,1.4);TB('E',x0-14,y0+h*.2-8,GREY,12,'right');
 lv.forEach(function(l){var y=y0+h*l[1],nb=l[2],e=l[3],wd=nb===2?w*.26:w*.3,cx=x0+w*.5;
  for(var k=0;k<nb;k++){var xs=cx+(nb===2?(k?1:-1)*w*.2:0)-wd/2;LN(xs,y,xs+wd,y,INK,2.4);
   var ne=nb===2?(e>=2*(k+1)?2:(e>k?1:0)):(e>=2?2:0);if(nb===2&&e===2)ne=k<2?1:0,ne=1;if(nb===2&&e===4)ne=2;
   var col=(hl&&l[0]==='π*2p')?ORA2:BLUE_D;
   if(ne>=1)LN(xs+wd*.35,y-3,xs+wd*.35,y-16,col,2.4);if(ne>=2)LN(xs+wd*.65,y-16,xs+wd*.65,y-3,col,2.4);}
  TB(l[0],x0+w+4,y+4,GREY,12,'left');});
}
SFA.theo("c02",{
 icon:function(){var cx=W*.28,cy=H*.5;c2_lobe(cx,cy,35,70,26,BLUE,1);c2_lobe(cx,cy,145,70,26,BLUE,1);c2_lobe(cx,cy,215,70,26,BLUE,1);c2_lobe(cx,cy,325,70,26,BLUE,1);DOT(cx,cy,5,INK);
  TB('sp³ · sp² · sp',W*.72,H*.34,BLUE_D,28);TB('σ, π, mésomérie',W*.72,H*.56,ORANGE,20);TB('O₂ : OM',W*.72,H*.78,GREY,17);},
 anim:function(t){var Tc=170,k=Math.floor(t/Tc)%3,pr=k===0?2:k-1,ph=t%Tc,f=ph<45?uh_e(ph,0,45):1;
  var cx=W*.3,cy=H*.52,L=96;
  var cfg=[{h:[35,145,225,315],a:[1,1,1,1],pp:[0,0],txt:['sp³','CH₄ · C–C de l\'éthane','4 liaisons σ','109,5°'],mol:'CH₄'},
           {h:[180,60,300,0],a:[1,1,1,0],pp:[1,0],txt:['sp²','C₂H₄ · benzène · C=O','3 σ + 1 π','120°'],mol:'C₂H₄'},
           {h:[180,0,60,300],a:[1,1,0,0],pp:[1,.55],txt:['sp','C₂H₂ · CO₂ · C≡N','2 σ + 2 π','180°'],mol:'C₂H₂'}];
  var c0=cfg[(k+2)%3],c1=cfg[k];
  for(var i=0;i<4;i++){var ang=c0.h[i]+(c1.h[i]-c0.h[i])*f,al=c0.a[i]+(c1.a[i]-c0.a[i])*f;if(al>.02)c2_lobe(cx,cy,ang,L,30,BLUE,al);}
  [0,1].forEach(function(j){var a=c0.pp[j]+(c1.pp[j]-c0.pp[j])*f;if(a>.02){var an=j?45:90;c2_lobe(cx,cy,an,L*.62,22,ORANGE,a);c2_lobe(cx,cy,an+180,L*.62,22,ORANGE,a);}});
  DOT(cx,cy,6,INK);TB('C',cx+12,cy+22,INK,15,'left');
  var x2=W*.62;TB(c1.txt[0],x2,H*.3,BLUE_D,48,'left');TB(c1.txt[1],x2,H*.44,INK,15,'left');TB(c1.txt[2],x2,H*.58,ORANGE,22,'left');TB('angles ≈ '+c1.txt[3],x2,H*.72,GREEN,18,'left');
  TB('lobes bleus : orbitales hybrides (σ)',x2,H*.86,BLUE_D,13,'left');TB('lobes orange : orbitales p pures (π)',x2,H*.93,ORANGE,13,'left');
  [0,1,2].forEach(function(j){DOT(W*.62+j*18,H*.12,5,j===k?BLUE_D:'#d5d9de');});},
 th:'<div class="tcard"><b class="h">σ, π et hybridation</b><p>Une <b>liaison simple</b> est une liaison <b>σ</b> (recouvrement axial). Une double liaison = 1 σ + 1 π ; une triple = 1 σ + 2 π. Les liaisons π (recouvrement latéral d\'orbitales p) sont plus faibles et empêchent la rotation.</p><p>Pour trouver l\'hybridation d\'un atome, compte ses <b>domaines électroniques σ</b> : liaisons σ + doublets libres. <b>4 domaines → sp³</b> (109,5°), <b>3 → sp²</b> (120°, plan, il reste une p pure pour π), <b>2 → sp</b> (180°, deux p pures). Ex. dans O=C=O, le C a 2 domaines : sp. Dans CH₃–CHO, le carbone du CHO est sp² et le CH₃ sp³ : 6 σ et 1 π.</p><p><b>Piège</b> : l\'azote d\'une amide (CH₃CONH₂) est sp² (son doublet est délocalisé dans la liaison C=O), alors que celui d\'une amine (CH₃NH₂) est sp³.</p></div>'+
 '<div class="tcard"><b class="h">Mésomérie (résonance)</b><p>Quand une seule formule de Lewis ne suffit pas, on écrit plusieurs <b>structures limites</b> reliées par ↔. Elles ne diffèrent que par la position des <b>électrons π ou des doublets</b> (jamais des atomes). La molécule réelle est un <b>hybride de résonance</b>, plus stable que chaque forme.</p><p>Règles : même nombre d\'électrons, octets respectés, charges formelles minimales, les formes les plus stables « pèsent » le plus. <b>Exemple</b> : nitrate NO₃⁻, trois formes équivalentes avec une N=O : ordre de liaison moyen N–O = (2 + 1 + 1)/3 = 4/3 et charge moyenne −2/3 sur chaque O. Ozone : ordre 1,5, charge −½ sur chaque O terminal.</p></div>'+
 '<div class="tcard"><b class="h">Ordre, longueur et énergie de liaison</b><p>L\'<b>ordre de liaison</b> compte les paires liantes entre deux atomes. Plus il est grand, plus la liaison est <b>courte et forte</b>. C–O : 143 pm (simple, méthanol) ; 127 pm (carboxylate, ordre 1,5) ; 116 pm (CO₂, double). La délocalisation donne des ordres fractionnaires : C–N de la liaison peptidique ≈ 1,25 (75 % simple + 25 % double), d\'où une rotation bloquée et un groupe peptidique <b>plan</b>.</p><p><b>Énergie de résonance du benzène</b> : ΔH(hydrogénation) attendue pour 3 C=C isolées = 3 × (−120) = −360 kJ/mol ; mesurée −208 : le benzène est stabilisé de <b>152 kJ/mol</b>.</p></div>'+
 '<div class="tcard"><b class="h">Orbitales moléculaires des diatomiques</b><p>Deux orbitales atomiques donnent une OM liante (plus basse) et une antiliante (*). <b>Ordre de liaison = (e⁻ liants − e⁻ antiliants)/2.</b> Ordre d\'énergie pour O₂ et F₂ : σ2s &lt; σ*2s &lt; σ2p &lt; π2p &lt; π*2p &lt; σ*2p. Pour B₂, C₂, N₂ (Z ≤ 7), π2p passe sous σ2p.</p><p>O₂ (12 e⁻ de valence) : (8 − 4)/2 = <b>2</b>, avec <b>2 électrons célibataires</b> dans les π* : O₂ est <b>paramagnétique</b>. Ions : O₂⁺ 2,5 ; O₂⁻ (superoxyde) 1,5 ; O₂²⁻ (peroxyde) 1. Longueurs : O₂⁺ &lt; O₂ &lt; O₂⁻ &lt; O₂²⁻. N₂ : ordre 3, diamagnétique ; B₂ : ordre 1, paramagnétique.</p></div>'+
 '<div class="tcard"><b class="h">Électronégativité et polarité de liaison</b><p>L\'électronégativité χ (Pauling) mesure l\'aptitude d\'un atome à attirer les électrons d\'une liaison. Règle pratique : Δχ &lt; 0,4 liaison apolaire ; 0,4–1,7 covalente polaire (δ+ / δ−) ; &gt; 1,7 plutôt ionique. Une résonance qui stabilise la base conjuguée augmente l\'acidité : CH₃COOH (pKa 4,76) est 10<sup>11</sup> fois plus acide que CH₃CH₂OH (pKa 15,9), soit RT·ln10·ΔpKa ≈ 64 kJ/mol de différence.</p></div>'
});
SFA.figs("c02",[
 /* 0 éthanal */
 function(p){var cy=H*.5,xs=[W*.22,W*.5],a=BLUE;uh_bd(xs[0],cy,xs[1],cy,1,BLUE,3.2);uh_bd(xs[1],cy,xs[1]+70,cy-50,2,BLUE,3.2);if(p>0){uh_al(uh_e(p,0,.5));LN(xs[1]+3,cy-4,xs[1]+66,cy-48,ORANGE,3);ctx.globalAlpha=1;}
  uh_bd(xs[1],cy,xs[1]+10,cy+62,1,BLUE,3.2);uh_bd(xs[0],cy,xs[0]-52,cy-40,1,BLUE,3.2);uh_bd(xs[0],cy,xs[0]-52,cy+40,1,BLUE,3.2);uh_bd(xs[0],cy,xs[0],cy-62,1,BLUE,3.2);
  uh_atom(xs[0],cy,'C',INK,15);uh_atom(xs[1],cy,'C',INK,15);uh_atom(xs[1]+78,cy-55,'O',RED,15);uh_atom(xs[1]+10,cy+72,'H',GREY,12);uh_atom(xs[0]-58,cy-44,'H',GREY,12);uh_atom(xs[0]-58,cy+44,'H',GREY,12);uh_atom(xs[0],cy-72,'H',GREY,12);
  TB('CH₃–CHO',W*.82,H*.78,BLUE_D,20);TB('liaisons σ',W*.32,H*.1,BLUE,15,'left');TB('liaison π',W*.32,H*.2,ORANGE,15,'left');
  var a2=uh_e(p,.3,.8);uh_al(a2);uh_tag('6 σ + 1 π',W*.78,H*.22,DRED,22);ctx.globalAlpha=1;},
 /* 1 nitrate */
 function(p){var cx=W*.38,cy=H*.54,r=70,pts=[[0,-1],[.866,.5],[-.866,.5]],q=uh_e(p,0,.6);
  pts.forEach(function(v,i){var x=cx+v[0]*r,y=cy+v[1]*r;LN(cx,cy,x,y,INK,3.2);if(i===0){uh_al(1-q);uh_bd(cx,cy,x,y,2,INK,2.6);ctx.globalAlpha=1;}uh_al(q);ctx.strokeStyle=ORANGE;ctx.lineWidth=2.6;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(cx+v[0]*14+v[1]*5,cy+v[1]*14-v[0]*5);ctx.lineTo(x*.95+cx*.05+v[1]*5,y*.95+cy*.05-v[0]*5);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;});
  pts.forEach(function(v,i){uh_atom(cx+v[0]*r*1.0,cy+v[1]*r*1.0,'O',RED,15);if(q>.3){uh_al(q);TB('−⅔',cx+v[0]*(r+36),cy+v[1]*(r+36)+5,DRED,15);ctx.globalAlpha=1;}});uh_atom(cx,cy,'N',BLUE_D,16);
  TB('NO₃⁻',W*.8,H*.3,BLUE_D,26);uh_al(q);TB('ordre N–O = 4/3',W*.8,H*.52,ORANGE,17);TB('3 formes équivalentes',W*.8,H*.66,INK,14);ctx.globalAlpha=1;if(q<1){uh_al(1-q);TB('1 forme (parmi 3)',W*.8,H*.52,GREY,15);ctx.globalAlpha=1;}},
 /* 2 CO2 */
 function(p){var cy=H*.46,cx=W*.5;uh_bd(cx-80,cy,cx,cy,2,INK,3);uh_bd(cx,cy,cx+80,cy,2,INK,3);c2_lobe(cx,cy,0,70,22,BLUE,.9);c2_lobe(cx,cy,180,70,22,BLUE,.9);c2_lobe(cx,cy,90,42,14,ORANGE,.8);c2_lobe(cx,cy,270,42,14,ORANGE,.8);
  uh_atom(cx-92,cy,'O',RED,16);uh_atom(cx,cy,'C',INK,16);uh_atom(cx+92,cy,'O',RED,16);TB('180°',cx,cy+60,GREEN,16);
  var a=uh_e(p,0,.6);uh_al(a);TB('2 domaines σ  →  sp',cx,H*.8,BLUE_D,22);TB('+ 2 liaisons π (p pures)',cx,H*.92,ORANGE,15);ctx.globalAlpha=1;if(!a)TB('hybridation du C ?',cx,H*.84,GREY,20);},
 /* 3 ozone */
 function(p){var q=uh_e(p,0,.6);function bent(cx,cy,l,type,al){uh_al(al);var a=[cx-60,cy+36],b=[cx,cy-14],c=[cx+60,cy+36];if(type===0){LN(a[0],a[1],b[0],b[1],INK,3);uh_bd(b[0],b[1],c[0],c[1],2,INK,2.6);}else if(type===1){uh_bd(a[0],a[1],b[0],b[1],2,INK,2.6);LN(b[0],b[1],c[0],c[1],INK,3);}else{LN(a[0],a[1],b[0],b[1],INK,3);LN(b[0],b[1],c[0],c[1],INK,3);ctx.strokeStyle=ORANGE;ctx.lineWidth=3;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(a[0]+3,a[1]-4);ctx.lineTo(b[0]-5,b[1]+3);ctx.moveTo(b[0]+5,b[1]+3);ctx.lineTo(c[0]-3,c[1]-4);ctx.stroke();ctx.setLineDash([]);}
  uh_atom(a[0],a[1],'O',RED,15);uh_atom(b[0],b[1],'O',BLUE_D,15);uh_atom(c[0],c[1],'O',RED,15);ctx.globalAlpha=1;return [a,b,c];}
  if(q<1){var u=bent(W*.25,H*.45,0,0,1-q);bent(W*.7,H*.45,0,1,1-q);uh_al(1-q);TB('↔',W*.475,H*.5,GREY,34);TB('−',u[0][0]-4,u[0][1]+34,DRED,18);TB('+',u[1][0],u[1][1]-30,BLUE_D,18);TB('−',W*.7+64,H*.45+70,DRED,18);ctx.globalAlpha=1;}
  if(q>0){var h=bent(W*.5,H*.42,0,2,q);uh_al(q);TB('−½',h[0][0]-4,h[0][1]+34,DRED,18);TB('−½',h[2][0]+4,h[2][1]+34,DRED,18);TB('+1',h[1][0],h[1][1]-30,BLUE_D,18);TB('ordre O–O = 1,5',W*.5,H*.86,ORANGE,19);ctx.globalAlpha=1;}
  TB('O₃',W*.1,H*.14,BLUE_D,24);},
 /* 4 OM O2 */
 function(p){c2_mo(60,28,150,H-60,false);var rows=[['O₂⁺','2,5'],['O₂','2'],['O₂⁻','1,5'],['O₂²⁻','1']];TB('ordre de liaison',W*.76,H*.14,GREY,14);
  rows.forEach(function(r,i){var y=H*.3+i*H*.17,a=uh_e(p,i*.15,i*.15+.35);TB(r[0],W*.6,y+8,INK,18,'left');uh_al(a);uh_rr(W*.76,y-14,80*Math.min(1,parseFloat(r[1].replace(',','.'))/2.5),28,ORANGE+'33',ORANGE,2,5);TB(r[1],W*.76+8,y+8,DRED,17,'left');ctx.globalAlpha=1;});
  TB('(liant − antiliant)/2',W*.72,H*.9,GREY,13);},
 /* 5 paramagnétique */
 function(p){c2_mo(60,28,150,H-60,p>0);var a=uh_e(p,0,.6);TB('O₂',W*.77,H*.2,BLUE_D,26);uh_al(a);TB('2 électrons célibataires',W*.77,H*.45,ORA2,16);TB('dans π*2p',W*.77,H*.56,ORA2,16);TB('→ paramagnétique',W*.77,H*.72,DRED,19);ctx.globalAlpha=1;if(a<1){uh_al(1-a);TB('N₂, C₂, F₂ : 0 célibataire',W*.77,H*.62,GREY,14);ctx.globalAlpha=1;}},
 /* 6 acidité */
 function(p){function box(x,lab,sub,loc){TB(lab,x,H*.2,BLUE_D,16);var y=H*.52;uh_bd(x-10,y,x-50,y+40,1,INK,3);uh_bd(x-10,y,x+34,y-30,loc?1:2,INK,3);if(!loc)uh_bd(x-10,y,x-10,y,1,INK,1);}
  var q=uh_e(p,0,.6),x1=W*.25,x2=W*.75,y=H*.55;
  uh_atom(x1,y,'C',INK,14);uh_bd(x1,y,x1+52,y-32,2,INK,2.6);uh_bd(x1,y,x1+52,y+32,1,INK,2.8);uh_atom(x1+60,y-37,'O',RED,14);uh_atom(x1+60,y+37,'O',RED,14);TB('CH₃',x1-40,y+6,INK,15);TB('−',x1+86,y+46,DRED,18);
  uh_al(q);TB('−½',x1+88,y-36,DRED,15);TB('−½',x1+88,y+46,DRED,15);ctx.globalAlpha=1;TB('CH₃COO⁻ (charge délocalisée)',x1,H*.2,BLUE_D,14);
  uh_atom(x2-10,y,'C',INK,14);uh_bd(x2-10,y,x2+34,y,1,INK,2.8);uh_atom(x2+46,y,'O',RED,14);TB('CH₃CH₂',x2-50,y+6,INK,14,'right');TB('−',x2+68,y-10,DRED,20);TB('CH₃CH₂O⁻ (localisée)',x2,H*.2,BLUE_D,14);
  uh_al(q);uh_rr(W*.14,H*.78,W*.72,38,'#fff7ea',ORANGE,2);TB('Ka ×1,4·10¹¹  ·  ΔΔG° ≈ 64 kJ/mol',W*.5,H*.78+25,ORANGE,17);ctx.globalAlpha=1;},
 /* 7 acrylonitrile */
 function(p){var y=H*.5,x=[W*.12,W*.32,W*.52,W*.72];uh_bd(x[0]+10,y,x[1],y,2,INK,2.6);uh_bd(x[1],y,x[2],y,1,INK,2.8);uh_bd(x[2],y,x[3],y,3,INK,2.4);
  uh_bd(x[0],y,x[0]-26,y-44,1,INK,2.6);uh_bd(x[0],y,x[0]-26,y+44,1,INK,2.6);uh_bd(x[1],y,x[1],y-56,1,INK,2.6);
  uh_atom(x[0],y,'C',INK,14);uh_atom(x[1],y,'C',INK,14);uh_atom(x[2],y,'C',INK,14);uh_atom(x[3]+8,y,'N',BLUE_D,14);[[x[0]-30,y-52],[x[0]-30,y+52],[x[1],y-66]].forEach(function(h){uh_atom(h[0],h[1],'H',GREY,11);});
  var a=uh_e(p,0,.6);uh_al(a);[['sp²',x[0]],['sp²',x[1]],['sp',x[2]],['sp',x[3]+8]].forEach(function(s,i){TB(s[0],s[1],y+(i===0?72:62),i<2?GREEN:ORANGE,17);});TB('120°',x[1]+4,y-84,GREY,13);TB('180°',(x[2]+x[3])/2,y-26,GREY,14);uh_tag('6 σ + 3 π',W*.5,H*.14,DRED,22);ctx.globalAlpha=1;
  if(!a)TB('CH₂=CH–C≡N',W*.5,H*.14,BLUE_D,22);},
 /* 8 longueurs C–O */
 function(p){var rows=[['C–O  méthanol',143,BLUE],['C–O  éthanoate',127,GREEN],['C=O  CO₂',116,ORANGE]],x0=W*.3,k=(W*.5)/150;
  rows.forEach(function(r,i){var y=H*.2+i*H*.22,a=uh_e(p,i*.12,i*.12+.4);TB(r[0],x0-10,y+20,INK,14,'right');var len=r[1]*k;uh_al(p>0?.25+.75*a:1);uh_rr(x0,y,len,28,r[2]+'33',r[2],2,5);if(i===0||p>0)TB(r[1]+' pm',x0+len+6,y+20,dk(r[2]),15,'left');ctx.globalAlpha=1;});
  TB('plus la liaison est forte, plus elle est courte',W*.5,H*.94,GREY,14);if(p>.3){uh_al(uh_e(p,.3,.8));uh_tag('ordre 1  <  1,5  <  2',W*.5,H*.76,DRED,16);ctx.globalAlpha=1;}},
 /* 9 liaison peptidique */
 function(p){var q=uh_e(p,0,.6);function pep(cx,cy,lim){var o=[cx-60,cy-40],c=[cx-10,cy],n=[cx+50,cy-8];uh_bd(c[0],c[1],o[0],o[1],lim?1:2,INK,2.6);uh_bd(c[0],c[1],n[0],n[1],lim?2:1,INK,2.6);uh_atom(o[0],o[1],'O',RED,13);uh_atom(c[0],c[1],'C',INK,13);uh_atom(n[0],n[1],'N',BLUE_D,13);TB(lim?'−':'',o[0]-16,o[1]-6,DRED,18);TB(lim?'+':'',n[0]+18,n[1]-12,BLUE_D,18);}
  pep(W*.2,H*.34,false);TB('↔',W*.47,H*.36,GREY,30);pep(W*.74,H*.34,true);TB('75 %',W*.2,H*.58,GREY,15);TB('25 %',W*.74,H*.58,GREY,15);
  uh_al(q);ctx.save();ctx.translate(W*.5,H*.8);uh_rr(-150,-24,300,48,'#fff7ea',ORANGE,2);ctx.restore();TB('ordre C–N = 0,75·1 + 0,25·2 = 1,25',W*.5,H*.8+6,ORANGE,16);uh_tag('groupe plan : ΔG‡ 75 kJ/mol',W*.5,H*.68,DRED,14);ctx.globalAlpha=1;},
 /* 10 superoxyde */
 function(p){var m=uh_ax(60,H-48,W-100,H-90,.8,2.2,100,160,'ordre de liaison','longueur O–O (pm)');var f=function(x){return 149-28*(x-1);};uh_fn(m,f,1,2,GREY,2,null,[5,4]);
  [[1,149,'O₂²⁻'],[2,121,'O₂']].forEach(function(P){DOT(m.X(P[0]),m.Y(P[1]),7,BLUE);TB(P[2]+'  '+P[1]+' pm',m.X(P[0])+(P[0]===1?8:-8),m.Y(P[1])-12,BLUE_D,14,P[0]===1?'left':'right');});
  [1,1.5,2].forEach(function(v){TB(uh_f(v,v===1.5?1:0),m.X(v),H-32,GREY,12);});var a=uh_e(p,0,.6);uh_al(a);LN(m.X(1.5),m.Y(135),m.X(1.5),H-48,ORANGE,1.6,[4,3]);LN(m.X(.8),m.Y(135),m.X(1.5),m.Y(135),ORANGE,1.6,[4,3]);DOT(m.X(1.5),m.Y(135),8,ORANGE);uh_tag('O₂⁻ : ordre 1,5 → 135 pm',m.X(1.5)+30,m.Y(135)-26,ORANGE,15);ctx.globalAlpha=1;},
 /* 11 azote sp2 ou sp3 */
 function(p){var q=uh_e(p,0,.6);function N(cx,cy,planar){uh_atom(cx,cy,'N',BLUE_D,16);if(planar){uh_bd(cx,cy,cx-56,cy+30,1,INK,2.6);uh_bd(cx,cy,cx+56,cy+30,1,INK,2.6);uh_bd(cx,cy,cx,cy-52,1,INK,2.6);c2_lobe(cx,cy+34,90,50,18,ORANGE,.9);c2_lobe(cx,cy-34,270,0,0,ORANGE,0);TB('p',cx+22,cy+40,ORANGE,15,'left');}else{uh_bd(cx,cy,cx-50,cy+42,1,INK,2.6);uh_bd(cx,cy,cx+50,cy+42,1,INK,2.6);uh_bd(cx,cy,cx+4,cy-54,1,INK,2.6);c2_lobe(cx,cy,300,0,0,BLUE,0);c2_lobe(cx-4,cy+8,265,44,16,BLUE,.9);}}
  TB('CH₃NH₂ (amine)',W*.25,H*.14,BLUE_D,15);TB('CH₃CONH₂ (amide)',W*.75,H*.14,BLUE_D,15);N(W*.25,H*.45,false);N(W*.75,H*.45,true);
  TB('doublet localisé',W*.25,H*.82,GREY,14);TB('doublet délocalisé (C=O)',W*.75,H*.82,GREY,14);uh_al(q);TB('sp³',W*.25,H*.94,DRED,22);TB('sp²',W*.75,H*.94,DRED,22);ctx.globalAlpha=1;},
 /* 12 énergie de résonance du benzène */
 function(p){var ax=70,y0=H-34,k=(H-70)/380;var lv=[['cyclohexane',0,GREEN],['benzène + 3 H₂',208,BLUE],['« cyclohexatriène » + 3 H₂',360,GREY]];
  lv.forEach(function(l){var y=y0-l[1]*k;LN(ax,y,ax+170,y,l[2],3.2);TB(l[0],ax+180,y+5,dk(l[2]),14,'left');TB(l[1]?'+'+l[1]:'0',ax-8,y+5,INK,13,'right');});
  TB('H (kJ/mol)',ax-8,18,GREY,12,'left');LN(ax-2,y0+6,ax-2,24,GREY,1.4);
  var a=uh_e(p,0,.6);uh_al(a);var yt=y0-360*k,yb=y0-208*k;A(ax+88,yt+2,0,yb-yt-8,RED,'',2.6);A(ax+88,yb-2,0,-(yb-yt-8),RED,'',0);uh_tag('152 kJ/mol',ax+88,(yt+yb)/2,DRED,18);TB('énergie de résonance',ax+160,(yt+yb)/2+6,DRED,14,'left');ctx.globalAlpha=1;
  TB('3 × (−120) = −360',ax+180,yt+22,GREY,13,'left');TB('mesuré : −208',ax+180,yb+22,BLUE_D,13,'left');},
 /* 13 acrylamide */
 function(p){var y=H*.5,q=uh_e(p,0,.6),x=[W*.26,W*.44,W*.62,W*.82];uh_bd(x[0],y+10,x[1],y-16,2,INK,2.6);uh_bd(x[1],y-16,x[2],y+10,1,INK,2.8);uh_bd(x[2],y+10,x[2],y-48,2,INK,2.6);uh_bd(x[2],y+10,x[3],y-16,1,INK,2.8);
  uh_atom(x[0],y+10,'CH₂',GREEN,17);uh_atom(x[1],y-16,'CH',INK,15);uh_atom(x[2],y+10,'C',INK,14);uh_atom(x[2],y-58,'O',RED,14);uh_atom(x[3],y-16,'NH₂',BLUE_D,17);
  [x[0],x[1],x[2],x[3]].forEach(function(xx,i){uh_al(.9);TB('sp²',xx,y+60,GREY,14);ctx.globalAlpha=1;});
  if(q>0){uh_al(q);uh_tag('δ+',x[0],y-40,DRED,18);TB('RS⁻',W*.05,y+66,DRED,16,'left');A(W*.1,y+52,x[0]-W*.1-22,-34,DRED,'',2.6);TB('thiol de cystéine',W*.05,y+88,DRED,13,'left');ctx.globalAlpha=1;}
  TB('CH₂=CH–C(=O)–NH₂',W*.5,H*.14,BLUE_D,18);uh_al(q);TB('9 σ + 2 π · tout plan',W*.5,H*.93,ORANGE,16);ctx.globalAlpha=1;}
]);
