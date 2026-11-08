/* Chimie BA1 · c03 · théorie animée et devantures d'exercices — contenu SFA original. */
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
function c3_lp(x,y,ang,col){var dx=Math.cos(ang*D2R),dy=-Math.sin(ang*D2R),px=-dy,py=dx;DOT(x+dx*26+px*4,y+dy*26+py*4,2.8,col||BLUE);DOT(x+dx*26-px*4,y+dy*26-py*4,2.8,col||BLUE);}
/* forme schématique : ligands à des angles (deg), doublets libres à des angles */
function c3_sh(cx,cy,L,ligs,lps,cc,lc,r){ligs.forEach(function(a){var x=cx+L*Math.cos(a*D2R),y=cy-L*Math.sin(a*D2R);LN(cx,cy,x,y,INK,2.8);});lps.forEach(function(a){c3_lp(cx,cy,a);});
 ligs.forEach(function(a){var x=cx+L*Math.cos(a*D2R),y=cy-L*Math.sin(a*D2R);uh_atom(x,y,lc||'X',GREY,r||10);});uh_atom(cx,cy,cc||'A',BLUE_D,(r||10)+3);}
function c3_arr(x1,y1,x2,y2,col,w){var vx=x2-x1,vy=y2-y1;A(x1,y1,vx,vy,col,'',w||2.6);}
SFA.theo("c03",{
 icon:function(){var cx=W*.28,cy=H*.54;c3_sh(cx,cy,64,[210,330,90],[270],'O','H',17);c3_arr(cx,cy+26,cx,cy+80,ORANGE,3.4);
  TB('AXₙEₘ',W*.72,H*.32,BLUE_D,32);TB('μ = Σ μ liaisons',W*.72,H*.54,ORANGE,19);TB('VSEPR · polarité',W*.72,H*.78,GREY,16);},
 anim:function(t){var ang=125-55*Math.cos(t*.018),th=ang*D2R,m=1.51,mu=2*m*Math.cos(th/2);
  var cx=W*.27,cy=H*.66,L=108;var hs=[[cx-L*Math.sin(th/2),cy-L*Math.cos(th/2)],[cx+L*Math.sin(th/2),cy-L*Math.cos(th/2)]];
  hs.forEach(function(h){LN(cx,cy,h[0],h[1],INK,3);});uh_atom(cx,cy,'O',RED,16);hs.forEach(function(h){uh_atom(h[0],h[1],'H',GREY,13);});
  hs.forEach(function(h){var vx=cx-h[0],vy=cy-h[1],l=Math.hypot(vx,vy);A(h[0]+vx/l*18,h[1]+vy/l*18,vx/l*(L*.55),vy/l*(L*.55),BLUE,'',2.6);});
  var S=34;A(cx,cy+28,0,mu*S,ORANGE,'',4.6);TB('μ',cx+14,cy+28+mu*S/2+4,DORA(),18,'left');
  ctx.strokeStyle=GREY;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(cx,cy,44,-PI/2-th/2,-PI/2+th/2);ctx.stroke();TB(Math.round(ang)+'°',cx,cy-52,GREY,15);
  TB('chaque liaison O–H : 1,51 D (vecteur bleu)',W*.27,H*.1,BLUE_D,14);
  var gx=W*.55,gw=W*.4,gy=H-52,gh=H-120;var m2=uh_ax(gx,gy,gw,gh,60,180,0,3.2,'angle H–O–H (°)','μ (D)');uh_fn(m2,function(a){return 2*m*Math.cos(a*D2R/2);},60,180,ORANGE,3);
  [90,104.5,180].forEach(function(a){TB(a,m2.X(a),gy+16,GREY,11);});DOT(m2.X(ang),m2.Y(mu),7,DRED);TB('μ = 2·m·cos(θ/2) = '+uh_f(mu,2)+' D',gx+gw*.5,H*.1,DRED,16);
  LN(m2.X(104.5),gy,m2.X(104.5),m2.Y(2*m*Math.cos(104.5*D2R/2)),GREY,1.2,[4,4]);TB('eau',m2.X(104.5),m2.Y(1.85)-10,GREY,13);
  TB('180° → vecteurs opposés : μ = 0 (CO₂)',gx+gw*.5,H-8,GREY,12);function DORA(){return ORANGE;}},
 th:'<div class="tcard"><b class="h">Lewis et charges formelles</b><p>On place les électrons de valence en liaisons et doublets libres (octet, ou plus pour P, S, Cl… de la 3<sup>e</sup> période). La <b>charge formelle</b> d\'un atome vaut : <b>FC = e⁻ de valence − e⁻ des doublets libres − nombre de liaisons</b>. On choisit la formule où les charges formelles sont les plus petites, les négatives sur les atomes les plus électronégatifs.</p><p><b>Exemples</b> : N dans NH₄⁺ : 5 − 0 − 4 = +1 ; B dans BF₄⁻ : 3 − 0 − 4 = −1 ; dans H₂PO₄⁻ (une P=O, deux P–OH, une P–O⁻) : P 0, O 0 (×3), O⁻ −1. La charge de l\'ion est la somme des charges formelles.</p></div>'+
 '<div class="tcard"><b class="h">VSEPR : notation AXₙEₘ</b><p>Les <b>domaines électroniques</b> (liaisons, simples ou multiples, et doublets libres E) autour de l\'atome central se repoussent et se placent le plus loin possible. On compte n + m domaines pour la géométrie de base, puis on nomme la forme de la molécule d\'après les seuls atomes.</p><ul><li>2 domaines : AX₂ linéaire 180° (CO₂) ; 3 : AX₃ plane 120° (BF₃), AX₂E coudée (SO₂ ≈ 119°)</li><li>4 : AX₄ tétraédrique 109,5° (CH₄), AX₃E pyramidale ≈ 107° (NH₃), AX₂E₂ coudée ≈ 104,5° (H₂O), 92° (H₂S)</li><li>5 : AX₅ bipyramide trigonale, AX₄E bascule (SF₄), AX₃E₂ en T, AX₂E₃ linéaire (XeF₂)</li><li>6 : AX₆ octaèdre 90°, AX₅E pyramide carrée, AX₄E₂ carré plan (XeF₄)</li></ul><p>Un doublet libre repousse plus qu\'un doublet liant : les angles diminuent : CH₄ 109,5° &gt; NH₃ 107° &gt; H₂O 104,5°.</p></div>'+
 '<div class="tcard"><b class="h">Polarité : moments dipolaires</b><p>Une liaison est polaire si Δχ ≠ 0 : le vecteur moment de liaison pointe vers l\'atome le plus électronégatif. Le <b>moment de la molécule est la somme vectorielle</b> des moments de liaison (et des doublets libres). Une molécule dont les vecteurs s\'annulent par symétrie est <b>apolaire</b> malgré ses liaisons polaires : CO₂, BF₃, CH₄, CCl₄, XeF₄, SF₆. Sont polaires : H₂O, NH₃, SO₂, SF₄, CHCl₃.</p><p><b>Exemple</b> : deux liaisons C–Cl de 1,5 D formant un angle θ : μ = 2·1,5·cos(θ/2) ; ortho (60°) 2,6 D ; méta (120°) 1,5 D ; para (180°) 0. Eau : 1,85 D = 2·m·cos(52,25°), donc m(O–H) = 1,51 D. <b>Piège</b> : même avec Δχ = 0, une molécule coudée comme O₃ a un petit moment (0,53 D) car la charge est répartie inégalement (+1 au centre, −½ aux bouts).</p></div>'+
 '<div class="tcard"><b class="h">Charge partielle et caractère ionique</b><p>1 D = 3,336·10⁻³⁰ C·m. Pour une liaison de longueur d : <b>μ = δ·e·d</b>, donc δ = μ/(e·d). Le pourcentage ionique est δ × 100 %. <b>Exemple HCl</b> : μ = 1,11 D = 3,70·10⁻³⁰ C·m ; e·d = 1,602·10⁻¹⁹ × 127,4·10⁻¹² = 2,04·10⁻²⁹ C·m ; δ = 0,18, soit 18 % ionique (Pauling : 1 − exp(−Δχ²/4) = 21 % avec Δχ = 0,96).</p></div>'+
 '<div class="tcard"><b class="h">Dipôle dans un champ électrique</b><p>Un dipôle μ placé dans un champ E s\'oriente (énergie −μE cos θ) mais l\'agitation thermique s\'y oppose. Le degré d\'orientation moyen est <b>⟨cos θ⟩ = coth x − 1/x</b> avec <b>x = μE/kT</b> (≈ x/3 si x est petit). Dans une membrane : E ≈ 10⁷ V/m, T = 310 K (kT = 4,28·10⁻²¹ J) : une molécule d\'eau (x = 0,014) n\'est orientée qu\'à 0,5 %, une hélice α de 70 D (x = 0,55) à 18 %. <b>Ordre de grandeur des interactions</b> : la liaison hydrogène (éthanol, ΔH<sub>vap</sub> 38,6 kJ/mol) pèse bien plus que l\'interaction dipôle–dipôle (éther, 21,5 kJ/mol) à masse égale.</p></div>'
});
SFA.figs("c03",[
 /* 0 H2S */
 function(p){var cx=W*.4,cy=H*.4;c3_sh(cx,cy,92,[222,318],[90,45+0,135+0],'S','H',16);var q=uh_e(p,0,.6);
  
  uh_al(q);TB('≈ 92°',cx,cy+80,DRED,19);TB('AX₂E₂',W*.82,H*.3,BLUE_D,28);TB('coudée',W*.82,H*.46,INK,18);TB('4 domaines : 2 liaisons',W*.82,H*.62,GREY,13);TB('+ 2 doublets libres',W*.82,H*.72,GREY,13);ctx.globalAlpha=1;TB('H₂S',W*.1,H*.14,BLUE_D,22);},
 /* 1 NH4+ / BF4- */
 function(p){var q=uh_e(p,0,.6);[[W*.27,'N','H','NH₄⁺',BLUE_D,'+1'],[W*.73,'B','F','BF₄⁻',GREEN,'−1']].forEach(function(o,i){c3_sh(o[0],H*.46,62,[45,135,225,315],[],o[1],o[2],i?13:12);TB(o[3],o[0],H*.1+4,o[4],20);uh_al(q);tag('FC = '+o[5],o[0],H*.9,i?DGREEN:DRED,20);ctx.globalAlpha=1;});
  uh_al(q);TB('5 − 0 − 4',W*.27,H*.8,GREY,14);TB('3 − 0 − 4',W*.73,H*.8,GREY,14);ctx.globalAlpha=1;},
 /* 2 NH3 */
 function(p){var cx=W*.4,cy=H*.5,q=uh_e(p,0,.6);uh_atom(cx,cy,'N',BLUE_D,18);[[-70,56],[-10,64],[66,50]].forEach(function(h){LN(cx,cy,cx+h[0],cy+h[1],INK,3);uh_atom(cx+h[0],cy+h[1],'H',GREY,13);});
  c2lp(cx,cy);function c2lp(x,y){ctx.save();ctx.beginPath();ctx.ellipse(x,y-40,13,24,0,0,7);ctx.fillStyle='#e6f1fb';ctx.fill();ctx.strokeStyle=BLUE;ctx.lineWidth=2;ctx.stroke();ctx.restore();DOT(x-4,y-44,2.6,BLUE);DOT(x+4,y-44,2.6,BLUE);}
  uh_al(q);TB('AX₃E',W*.8,H*.3,BLUE_D,28);TB('pyramidale',W*.8,H*.47,INK,19);TB('≈ 107°',W*.8,H*.63,DRED,19);ctx.globalAlpha=1;TB('NH₃',W*.1,H*.14,BLUE_D,22);},
 /* 3 HCl */
 function(p){var cy=H*.46,q=uh_e(p,0,.6),x1=W*.25,x2=W*.62;LN(x1,cy,x2,cy,INK,4);uh_atom(x1,cy,'H',GREY,20);uh_atom(x2,cy,'Cl',GREEN,24);TB('δ+',x1,cy-32,DRED,18);TB('δ−',x2,cy-38,BLUE_D,18);A(x1,cy+54,x2-x1,0,ORANGE,'',3.6);TB('μ = 1,11 D · d = 127,4 pm',W*.43,cy+84,INK,15);
  uh_al(q);uh_rr(W*.08,H*.8,W*.84,36,'#fff7ea',ORANGE,2);TB('δ = μ/(e·d) = 0,18 → 18 % ionique (Pauling 21 %)',W*.5,H*.8+24,ORANGE,15);ctx.globalAlpha=1;},
 /* 4 polaire/apolaire */
 function(p){var q=uh_e(p,0,.6),Ls=30,xs=[W*.1,W*.3,W*.5,W*.7,W*.9],y=H*.42,names=['CO₂','SO₂','SF₄','XeF₄','BF₃'],pol=[0,1,1,0,0];
  c3_sh(xs[0],y,Ls,[0,180],[],'C','O',9);c3_sh(xs[1],y,Ls,[240,300],[90],'S','O',9);c3_sh(xs[2],y,Ls,[0,180,240,300],[90],'S','F',8);c3_sh(xs[3],y,Ls,[0,90,180,270],[],'Xe','F',8);c3_sh(xs[4],y,Ls,[90,210,330],[],'B','F',9);
  names.forEach(function(n,i){TB(n,xs[i],H*.14,BLUE_D,16);uh_al(q);if(pol[i]){A(xs[i],y+56,0,28,ORANGE,'',3.4);TB('polaire',xs[i],H*.9,DRED,15);}else TB('apolaire',xs[i],H*.9,DGREEN,15);ctx.globalAlpha=1;});},
 /* 5 CCl4 */
 function(p){var cx=W*.4,cy=H*.5,q=uh_e(p,0,.6);var an=[45,135,225,315];an.forEach(function(a){var x=cx+88*Math.cos(a*D2R),y=cy-88*Math.sin(a*D2R);LN(cx,cy,x,y,INK,3);A(cx+Math.cos(a*D2R)*30,cy-Math.sin(a*D2R)*30,Math.cos(a*D2R)*34,-Math.sin(a*D2R)*34,BLUE,'',2.6);uh_atom(x,y,'Cl',GREEN,15);});uh_atom(cx,cy,'C',INK,16);
  TB('CCl₄',W*.1,H*.14,BLUE_D,22);uh_al(q);TB('Σ μ = 0',W*.82,H*.4,DGREEN,30);TB('liaisons polaires',W*.82,H*.55,GREY,15);TB('molécule apolaire',W*.82,H*.67,DGREEN,16);ctx.globalAlpha=1;if(!q){TB('Σ μ ?',W*.82,H*.4,GREY,30);}},
 /* 6 dichlorobenzène */
 function(p){var q=uh_e(p,0,.6),r=32,vals=[[0,1,'ortho',2.598,'2,6 D (mesuré 2,5)',60],[0,2,'méta',1.5,'1,5 D (mesuré 1,7)',120],[0,3,'para',0,'0 D (mesuré 0)',180]];
  vals.forEach(function(v,i){var cx=W*(.17+i*.33),cy=H*.5;ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();for(var k=0;k<6;k++){var a=(90+60*k)*D2R;k?ctx.lineTo(cx+r*Math.cos(a),cy-r*Math.sin(a)):ctx.moveTo(cx+r*Math.cos(a),cy-r*Math.sin(a));}ctx.closePath();ctx.stroke();
   var ux=0,uy=0;[v[0],v[1]].forEach(function(k){var a=(90+60*k)*D2R,x=cx+r*Math.cos(a),y=cy-r*Math.sin(a),dx=Math.cos(a),dy=-Math.sin(a);LN(x,y,x+dx*22,y+dy*22,INK,2.4);uh_atom(x+dx*34,y+dy*34,'Cl',GREEN,11);A(x+dx*12,y+dy*12,dx*0+dx*0,0,BLUE,'',1);A(x+dx*44,y+dy*44,-dx*30,-dy*30,BLUE,'',2.2);ux+=dx;uy+=dy;});
   TB(v[2],cx,H*.09,BLUE_D,16);uh_al(q);if(v[3]>0)A(cx,cy,ux*v[3]*12,uy*v[3]*12,ORANGE,'',4);TB(v[4],cx,H*.86,ORANGE,13);ctx.globalAlpha=1;});},
 /* 7 O–H eau */
 function(p){var cx=W*.4,cy=H*.6,q=uh_e(p,0,.6),th=104.5*D2R,L=100;var hs=[[cx-L*Math.sin(th/2),cy-L*Math.cos(th/2)],[cx+L*Math.sin(th/2),cy-L*Math.cos(th/2)]];hs.forEach(function(h){LN(cx,cy,h[0],h[1],INK,3);A(h[0]+(cx-h[0])*.15,h[1]+(cy-h[1])*.15,(cx-h[0])*.5,(cy-h[1])*.5,BLUE,'',2.8);});uh_atom(cx,cy,'O',RED,17);hs.forEach(function(h){uh_atom(h[0],h[1],'H',GREY,13);});
  uh_al(q);A(cx,cy+30,0,76,ORANGE,'',4.4);TB('μ = 1,85 D',cx+12,cy+68,ORANGE,16,'left');TB('m(O–H) = 1,51 D',W*.8,H*.3,BLUE_D,16);TB('linéaire : μ = 0',W*.8,H*.5,GREY,15);TB('90° : μ = 2,14 D',W*.8,H*.62,GREY,15);ctx.globalAlpha=1;TB('104,5°',cx,cy-L*.35,GREY,14);},
 /* 8 angles */
 function(p){var q=uh_e(p,0,.6),L=[['CH₄',109.5,BLUE],['NH₃',107,GREEN],['H₂O',104.5,ORANGE]];L.forEach(function(l,i){var cx=W*(.18+i*.32),cy=H*.38,a=l[1]*D2R,len=70;var ax1=cx-len*Math.sin(a/2),ay1=cy+len*Math.cos(a/2),ax2=cx+len*Math.sin(a/2),ay2=ay1;
   LN(cx,cy,ax1,ay1+0,l[2],4);LN(cx,cy,ax2,ay1,l[2],4);ctx.strokeStyle=GREY;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(cx,cy,34,PI/2-a/2,PI/2+a/2);ctx.stroke();uh_atom(cx,cy,l[0][0],INK,13);TB(l[0],cx,H*.14,BLUE_D,18);uh_al(q);TB(String(l[1]).replace('.',',')+'°',cx,H*.86,dk(l[2]),20);ctx.globalAlpha=1;});
  uh_al(q);TB('0 doublet libre  <  1  <  2 : l\'angle se referme',W*.5,H*.97-4,GREY,13);ctx.globalAlpha=1;},
 /* 9 membrane */
 function(p){var q=uh_e(p,0,.6),mx=W*.06,mw=W*.52;uh_rr(mx,H*.3,mw,H*.4,'#fdf0dc',null);for(var i=0;i<=4;i++){LN(mx,H*.3+i*H*.1,mx+mw,H*.3+i*H*.1,'#f1d8ae',1);}TB('membrane (≈ 7 nm)',mx+mw/2,H*.24,GREY,13);
  A(mx+mw+14,H*.2,0,H*.6,DRED,'',3);TB('E = 10⁷ V/m',mx+mw+18,H*.88,DRED,13,'left');
  var seed=7;for(var k=0;k<14;k++){seed=(seed*9301+49297)%233280;var r1=seed/233280;seed=(seed*9301+49297)%233280;var r2=seed/233280;var ang=r1*2*PI*(1-q*.35)+PI/2*q*.35*0+(q*.35)*(PI/2),x=mx+20+r2*(mw-40),y=H*.34+(k%4)*H*.09+8;A(x-Math.cos(ang)*10,y-Math.sin(ang)*10,Math.cos(ang)*20,Math.sin(ang)*20,BLUE,'',2);}
  var bx=W*.7,by=H*.7,bh=H*.4;TB('⟨cos θ⟩',bx+40,H*.18,GREY,13);LN(bx,by,bx+100,by,GREY,1.4);[['eau',.005,BLUE],['hélice α',.18,ORANGE]].forEach(function(b,i){var x=bx+8+i*50,h=b[1]*bh*3.5*q;uh_rr(x,by-Math.max(h,1),34,Math.max(h,1),b[2]+'55',b[2],2,3);TB(b[0],x+17,by+16,INK,12);uh_al(q);TB(uh_f(b[1],b[1]<.01?3:2),x+17,by-h-8,dk(b[2]),14);ctx.globalAlpha=1;});},
 /* 10 H2PO4- */
 function(p){var q=uh_e(p,0,.6),cx=W*.4,cy=H*.52;var os=[[0,-86,'O',0,true],[-80,40,'OH',0],[80,40,'OH',0],[0,86,'O⁻',-1]];os.forEach(function(o,i){LN(cx,cy,cx+o[0]*.8,cy+o[1]*.7,INK,3);if(o[4])LN(cx+4,cy,cx+o[0]*.8+4,cy+o[1]*.7,INK,3);uh_atom(cx+o[0],cy+o[1]*.9,o[2],o[3]?BLUE_D:RED,o[2].length>1?17:15);});uh_atom(cx,cy,'P',ORANGE,18);
  uh_al(q);TB('FC : P 0 · O 0 · O⁻ −1',W*.77,H*.3,DRED,13);TB('tétraèdre',W*.77,H*.5,INK,17);TB('≈ 109,5°',W*.77,H*.62,GREEN,18);TB('H₂PO₄⁻',W*.77,H*.15,BLUE_D,20);ctx.globalAlpha=1;},
 /* 11 linéaire */
 function(p){var q=uh_e(p,0,.6),xs=[W*.14,W*.38,W*.62,W*.86],y=H*.45,nm=['H₂O','SO₂','XeF₂','NO₂⁻'];c3_sh(xs[0],y,40,[232,308],[90,45+0],'O','H',11);c3_sh(xs[1],y,40,[240,300],[90],'S','O',11);c3_sh(xs[2],y,40,[0,180],[90,270,225,315,45],'Xe','F',11);c3_sh(xs[3],y,40,[240,300],[90],'N','O',11);
  nm.forEach(function(n,i){TB(n,xs[i],H*.14,BLUE_D,18);var lin=i===2;uh_al(q);TB(lin?'linéaire':'coudée',xs[i],H*.84,lin?DGREEN:GREY,lin?18:15);ctx.globalAlpha=1;});if(q>0){uh_al(q);ctx.strokeStyle=GREEN;ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(xs[2]-60,H*.22,120,H*.6,10);ctx.stroke();TB('AX₂E₃',xs[2],H*.3,GREEN,14);ctx.globalAlpha=1;}},
 /* 12 ébullition */
 function(p){var q=uh_e(p,0,.6),L=[['propane',231,.08,19.0,GREY],['CH₃OCH₃',248,1.30,21.5,BLUE],['éthanol',351.5,1.69,38.6,ORANGE]],x0=30,bw=104,by=H-50,k=(H-100)/380;
  LN(x0-6,by,W-20,by,GREY,1.4);L.forEach(function(l,i){var x=x0+i*(bw+22),h=l[1]*k;uh_rr(x,by-h,bw,h,l[4]+'33',l[4],2,4);TB(l[0],x+bw/2,by+17,INK,14);TB(l[1]+' K',x+bw/2,by-h-8,dk(l[4]),14);TB('μ = '+uh_f(l[2])+' D',x+bw/2,by-h/2,GREY,13);uh_al(q);TB(uh_f(l[3]*1000/l[1],1)+' J/(mol·K)',x+bw/2,by-h/2+20,DRED,12);ctx.globalAlpha=1;});
  TB('T éb (K)',W*.5,18,GREY,13);if(q>0){uh_al(q);uh_tag('éthanol : liaison hydrogène',W*.3,H*.2,DRED,14);TB('Trouton ≈ 85–88 J/(mol·K)',W*.3,H*.3,GREY,13);ctx.globalAlpha=1;}},
 /* 13 ozone */
 function(p){var q=uh_e(p,0,.6),cx=W*.4,cy=H*.4,th=116.8*D2R,L=96;var hs=[[cx-L*Math.sin(th/2),cy+L*Math.cos(th/2)*.6+30],[cx+L*Math.sin(th/2),cy+L*Math.cos(th/2)*.6+30]];hs.forEach(function(h){LN(cx,cy,h[0],h[1],INK,3);});uh_atom(cx,cy,'O',BLUE_D,16);hs.forEach(function(h){uh_atom(h[0],h[1],'O',RED,15);});
  uh_al(q);TB('+1',cx,cy-30,BLUE_D,18);hs.forEach(function(h,i){TB('−½',h[0]+(i?20:-20),h[1]+30,DRED,17);});A(cx,cy+22,0,64,ORANGE,'',4);TB('μ = 0,53 D',cx,cy+112,ORANGE,15);TB('charges inégales',W*.8,H*.3,BLUE_D,15);TB('polaire malgré',W*.8,H*.42,DRED,15);TB('Δχ = 0',W*.8,H*.52,DRED,15);ctx.globalAlpha=1;TB('O₃',W*.1,H*.14,BLUE_D,22);}
]);
