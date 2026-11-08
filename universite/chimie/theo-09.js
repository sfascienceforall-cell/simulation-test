/* Chimie BA1 · c09 · Alcènes et composés aromatiques — devantures des exercices (la théorie de ce chapitre vient des anciens exercices), contenu SFA original. */
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

/* ---- c09 : aides de dessin moléculaire ---- */
function c9_at(s,x,y,col,sz,al){sz=sz||17;ctx.font='600 '+sz+'px system-ui';var w=ctx.measureText(s).width;var x0=al=='left'?x:al=='right'?x-w:x-w/2;ctx.fillStyle='#fff';ctx.fillRect(x0-3,y-sz*.78,w+6,sz*1.05);TB(s,x,y,col||INK,sz,al||'center');}
function c9_dbl(x1,y1,x2,y2,col){uh_bd(x1,y1,x2,y2,2,col||INK,2.4);}
function c9_wedge(x1,y1,x2,y2,col){var dx=y2-y1,dy=x1-x2,l=Math.hypot(dx,dy)||1;dx=dx/l*5;dy=dy/l*5;ctx.fillStyle=col||INK;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2+dx,y2+dy);ctx.lineTo(x2-dx,y2-dy);ctx.closePath();ctx.fill();}
function c9_dash(x1,y1,x2,y2,col){var dx=y2-y1,dy=x1-x2,l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;for(var i=1;i<=6;i++){var u=i/6,x=x1+(x2-x1)*u,y=y1+(y2-y1)*u,w=1+4.5*u;LN(x-dx*w,y-dy*w,x+dx*w,y+dy*w,col||INK,1.8);}}
function c9_hex(cx,cy,r){var v=[];for(var i=0;i<6;i++){var a=(-90+60*i)*D2R;v.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return v;}
function c9_ring(v,dbl,col){for(var i=0;i<6;i++){var a=v[i],b=v[(i+1)%6];if(dbl===i)c9_dbl(a[0],a[1],b[0],b[1],col);else LN(a[0],a[1],b[0],b[1],col||INK,2.4);}}
function c9_alk(cx,cy,col){/* 2-méthylpropène : C central en (cx,cy) */LN(cx,cy,cx-30,cy-26,INK,2.4);LN(cx,cy,cx-30,cy+26,INK,2.4);c9_dbl(cx,cy,cx+52,cy,col||BLUE_D);c9_at('CH₃',cx-48,cy-30,INK,16);c9_at('CH₃',cx-48,cy+40,INK,16);c9_at('CH₂',cx+72,cy+6,INK,16);}
function c9_fork(q,drawAlk,l1,f1,n1,c1,l2,f2,n2,c2){drawAlk();
 A(165,118,60,-46,c1,'',2.8);A(165,162,60,46,c2,'',2.8);TB(l1,150,70,dk(c1),14,'right');l2.split('|').forEach(function(t,i,a){TB(t,150,222-(a.length-1)*16+i*16,dk(c2),14,'right');});
 if(q>0){uh_al(q);[[f1,n1,c1,28],[f2,n2,c2,190]].forEach(function(r){uh_rr(238,r[3],212,66,'#fff',r[2],2.4);TB(r[0],344,r[3]+28,dk(r[2]),17);TB(r[1],344,r[3]+51,INK,13);});ctx.globalAlpha=1;}
 else{TB('?',344,70,GREY,24);TB('?',344,232,GREY,24);}}
function c9_steps(q,rows,labs){var n=rows.length,h=44,gap=(H-n*h)/(n+.3);rows.forEach(function(r,i){var a=i==0?1:uh_e(q,(i-1)/(n-1)*.8,(i-1)/(n-1)*.8+.3);var y=gap*.5+i*(h+gap);
  if(a<=0){uh_rr(46,y,368,h,'#f6f7f8','#e2e4e7',1.6);return;}uh_al(a);uh_rr(46,y,368,h,'#fff',r[2],2.4);TB(r[0],W*.5,y+21,INK,17);TB(r[1],W*.5,y+37,dk(r[2]),12.5);
  if(i>0){var yy=y-gap+4;A(66,yy,0,gap-10,GREY,'',2);TB(labs[i-1],78,yy+gap*.5+4,GREY,13,'left');}ctx.globalAlpha=1;});}
SFA.figs("c09",[
 /* 0 Markovnikov */
 function(p){var q=uh_e(p,0,.7);c9_alk(95,125,BLUE_D);TB('HBr',W*.5,102,ORANGE,18);A(190,125,90,0,ORANGE,'',3);
  TB('δ+',95,100,DRED,14);TB('δ−',160,100,BLUE_D,14);TB('2-méthylpropène',95,215,GREY,13);
  if(q>0){uh_al(q);var cx=360,cy=125;LN(cx,cy,cx-50,cy,INK,2.4);LN(cx,cy,cx+50,cy,INK,2.4);LN(cx,cy,cx,cy-45,INK,2.4);LN(cx,cy,cx,cy+45,INK,2.4);c9_at('CH₃',cx-62,cy+6,INK,16);c9_at('CH₃',cx+62,cy+6,INK,16);c9_at('CH₃',cx,cy-48,INK,16);c9_at('Br',cx,cy+60,DRED,20);
   uh_tag('Br sur le C le plus substitué',W*.5,248,DRED,14);TB('2-bromo-2-méthylpropane',cx,215,GREY,13);ctx.globalAlpha=1;}
  else TB('?',360,135,GREY,34);},
 /* 1 hydrogénation volume */
 function(p){var q=uh_e(p,0,.7),a=c9_hex(90,100,44),b=c9_hex(370,100,44);c9_ring(a,0,BLUE_D);c9_ring(b,-1,INK);TB('cyclohexène',90,176,GREY,13);TB('cyclohexane',370,176,GREY,13);
  TB('+ H₂',230,84,ORANGE,18);A(185,100,90,0,ORANGE,'',3);TB('Ni',230,124,GREY,14);
  TB('n = 2,0 / 82,14 = 0,0243 mol',W*.5,208,INK,15);uh_al(q);uh_rr(60,222,340,42,'#fff7ea',ORANGE,2);TB('V = nRT/P = 0,0243 × 0,0821 × 298 = 0,60 L',W*.5,248,ORANGE,14);ctx.globalAlpha=1;},
 /* 2 stabilité carbocations */
 function(p){var q=uh_e(p,0,.7),nm=['CH₃⁺','R–CH₂⁺','R₂CH⁺','R₃C⁺'],ty=['méthyle','primaire','secondaire','tertiaire'],hs=[40,75,110,150],cs=['#cfd8dc','#a5d6c3','#5fbf9d',GREEN];
  LN(40,222,W-20,222,GREY,2);for(var i=0;i<4;i++){var x=70+i*105,h=95+(hs[i]-95)*q;ctx.fillStyle=cs[i];ctx.fillRect(x-30,222-h,60,h);TB(nm[i],x,244,INK,16);TB(ty[i],x,264,GREY,13);TB(i+' alkyle'+(i>1?'s':''),x,222-h-8,dk(cs[i]==='#cfd8dc'?GREY:cs[i]),13);}
  TB('stabilité',26,28,GREY,13,'left');uh_al(q);A(150,22,200,0,DGREEN,'',2.6);TB('de plus en plus stable',250,16,DGREEN,14);ctx.globalAlpha=1;},
 /* 3 ΔH hydrogénation */
 function(p){var q=uh_e(p,0,.7),y1=230-127*1.3,y2=230-116*1.3;LN(30,y1,140,y1,BLUE_D,4);LN(320,y2,430,y2,ORA2,4);LN(170,230,290,230,INK,4);
  TB('but-1-ène',85,y1-10,BLUE_D,15);TB('trans-but-2-ène',375,y2-10,DRED,15);TB('butane',230,252,INK,15);
  A(110,y1+6,70,230-y1-16,BLUE,'',2.6);A(350,y2+6,-70,230-y2-16,ORA2,'',2.6);TB('−127',115,168,BLUE_D,15,'right');TB('−116',345,168,DRED,15,'left');
  uh_al(q);LN(140,y1,320,y1,GREY,1.4,[5,4]);LN(230,y1,230,y2,GREEN,3);DOT(230,y1,4,GREEN);DOT(230,y2,4,GREEN);uh_tag('ΔH° = −127 − (−116) = −11 kJ/mol',W*.5,y1-30,DGREEN,14);TB('trans plus stable',W*.5,y2+36,DGREEN,14);ctx.globalAlpha=1;},
 /* 4 deux réactifs */
 function(p){var q=uh_e(p,0,.7),cx=118,cy=140;LN(cx,cy,cx-36,cy-24,INK,2.4);LN(cx,cy,cx-36,cy+24,INK,2.4);c9_dbl(cx,cy,cx+46,cy-24,BLUE_D);LN(cx+46,cy-24,cx+92,cy,INK,2.4);c9_at('CH₃',cx-52,cy-28,INK,15);c9_at('CH₃',cx-52,cy+38,INK,15);c9_at('CH₃',cx+110,cy+6,INK,15);TB('2-méthylbut-2-ène',90,262,GREY,13);
  c9_fork(q,function(){},'HBr',  '(CH₃)₂CBr–CH₂CH₃','2-bromo-2-méthylbutane',BLUE,'HBr + ROOR','(CH₃)₂CH–CHBr–CH₃','2-bromo-3-méthylbutane',ORA2);
  TB('(a) Markovnikov',238+106,22,DGREEN,13);TB('(b) radicalaire',344,184,DRED,13);},
 /* 5 bromation cis */
 function(p){var q=uh_e(p,0,.7);LN(60,150,110,150,INK,2.4);c9_dbl(60,150,110,150,BLUE_D);LN(60,150,48,108,INK,2.4);LN(110,150,122,108,INK,2.4);c9_at('CH₃',48,98,INK,15);c9_at('CH₃',124,98,INK,15);TB('cis-but-2-ène',85,206,GREY,13);TB('Br₂',160,124,ORANGE,16);A(135,140,50,0,ORANGE,'',2.6);
  if(q>0){uh_al(q);LN(205,150,255,150,INK,2.4);LN(205,150,193,108,INK,2.4);LN(255,150,267,108,INK,2.4);c9_at('CH₃',193,98,INK,15);c9_at('CH₃',269,98,INK,15);LN(205,150,230,184,INK,2.2);LN(255,150,230,184,INK,2.2);c9_at('Br⁺',230,196,DRED,17);TB('ion bromonium',230,226,GREY,13);
   A(300,70,-30,60,BLUE,'',2.6);c9_at('Br⁻',312,62,BLUE_D,17);TB('attaque anti',322,100,DGREEN,13,'left');uh_rr(318,150,132,66,'#fff',GREEN,2.4);TB('(2R,3R)',384,176,DGREEN,16);TB('+ (2S,3S)',384,198,DGREEN,16);TB('racémique',384,236,GREY,13);ctx.globalAlpha=1;}
  else TB('?',384,190,GREY,34);},
 /* 6 indice d'iode */
 function(p){var q=uh_e(p,0,.7),y=96;ctx.strokeStyle=INK;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(26,y);for(var i=1;i<=14;i++)ctx.lineTo(26+i*28,y+(i%2?-18:18)*(i%2?1:1));ctx.stroke();
  [[3,'#7f1fa0'],[6,'#7f1fa0'],[9,'#7f1fa0']].forEach(function(r){var x1=26+r[0]*28,x2=26+(r[0]+1)*28;c9_dbl(x1,y+(r[0]%2?-18:18),x2,y+((r[0]+1)%2?-18:18),BLUE_D);if(q>0){uh_al(q);uh_atom(x1,y+(r[0]%2?-18:18)+(r[0]%2?-28:28),'I',r[1],12);uh_atom(x2,y+((r[0]+1)%2?-18:18)+((r[0]+1)%2?-28:28),'I',r[1],12);ctx.globalAlpha=1;}});
  TB('chaîne d’acide gras (3 C=C)',W*.5,20,GREY,13);
  uh_rr(40,156,170,40,'#fff',ORANGE,2);TB('huile : 2,50 g',125,182,INK,16);uh_rr(250,156,170,40,'#f4eafa','#7f1fa0',2);TB('I₂ fixé : 2,05 g',335,182,'#6a1b8a',16);
  TB('IV = 100 × m(I₂) / m(huile)',W*.5,222,GREY,14);uh_al(q);uh_tag('IV = 100 × 2,05/2,50 = 82  ;  ≈ 2,8 C=C par molécule',W*.5,256,DRED,15);ctx.globalAlpha=1;},
 /* 7 transposition */
 function(p){var q=uh_e(p,0,.8);c9_steps(q,[['CH₂=CH–C(CH₃)₃  +  HCl','3,3-diméthylbut-1-ène',BLUE],['CH₃–C⁺H–C(CH₃)₃','cation secondaire (moins stable)',ORA2],['(CH₃)₂C⁺–CH(CH₃)₂','cation tertiaire : un CH₃ a glissé',GREEN],['(CH₃)₂CCl–CH(CH₃)₂','2-chloro-2,3-diméthylbutane',VIOLET]],['H⁺ se fixe sur CH₂','migration 1,2 de CH₃','Cl⁻ attaque le C⁺']);},
 /* 8 hydroboration */
 function(p){var q=uh_e(p,0,.7);c9_fork(q,function(){c9_alk(80,140,BLUE_D);TB('2-méthylpropène',90,268,GREY,13);},'H₂O / H⁺','(CH₃)₃C–OH','2-méthylpropan-2-ol',BLUE,'1) BH₃·THF|2) H₂O₂, OH⁻','(CH₃)₂CH–CH₂OH','2-méthylpropan-1-ol',ORA2);
  TB('Markovnikov',344,22,DGREEN,13);TB('anti-Markovnikov',344,184,DRED,13);},
 /* 9 huile */
 function(p){var q=uh_e(p,0,.8),seg=[[10,'#cfd8dc','sat.'],[25,ORA2,'oléine'],[64,BLUE,'linoléine'],[1,VIOLET,'']],x=40;TB('composition (% en masse)',W*.5,22,GREY,13);
  seg.forEach(function(s){var w=s[0]*3.8;ctx.fillStyle=s[1];ctx.fillRect(x,32,w,30);if(s[0]>=10)TB(s[0]+' %',x+w/2,53,'#fff',14);x+=w;});
  TB('sat.',40+19,80,GREY,13);TB('3 C=C',40+38+47,80,DRED,13);TB('6 C=C',40+38+95+120,80,BLUE_D,13);
  TB('IV = 135',W*.5,114,INK,20);ctx.fillStyle='#e9edf0';ctx.fillRect(40,126,380,22);ctx.fillStyle=ORANGE;ctx.fillRect(40,126,380*.481*q,22);TB('C=C',50,142,'#fff',13,'left');TB(q>.3?'48 % hydrogénés, 52 % restent (IV = 70)':'quelle fraction hydrogéner ?',W*.5,166,q>.3?DRED:GREY,14);
  uh_al(q);TB('≈ 63 L de H₂ par kg d’huile',W*.5,192,DRED,15);
  ctx.strokeStyle=BLUE_D;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(60,248);ctx.lineTo(80,230);ctx.lineTo(100,248);ctx.lineTo(120,248);ctx.lineTo(140,230);ctx.lineTo(160,248);ctx.stroke();ctx.strokeStyle=DGREEN;ctx.beginPath();ctx.moveTo(250,248);ctx.lineTo(270,230);ctx.lineTo(290,248);ctx.lineTo(310,230);ctx.lineTo(330,248);ctx.lineTo(350,230);ctx.stroke();
  TB('cis (coudée)',110,270,BLUE_D,13);TB('trans (droite, plus stable)',300,270,DGREEN,13);A(176,238,56,0,ORANGE,'',2.4);ctx.globalAlpha=1;},
 /* 10 transposition d'hydrure */
 function(p){var q=uh_e(p,0,.8);c9_steps(q,[['CH₂=CH–CH(CH₃)₂  +  HBr','3-méthylbut-1-ène',BLUE],['CH₃–C⁺H–CH(CH₃)₂','cation secondaire',ORA2],['CH₃CH₂–C⁺(CH₃)₂','cation tertiaire : un H⁻ a glissé',GREEN],['CH₃CH₂–CBr(CH₃)₂','2-bromo-2-méthylbutane',VIOLET]],['H⁺ se fixe sur CH₂','glissement d’hydrure 1,2','Br⁻ attaque le C⁺']);},
 /* 11 halohydrine */
 function(p){var q=uh_e(p,0,.7),a=c9_hex(80,126,42);c9_ring(a,0,BLUE_D);LN(a[0][0],a[0][1],a[0][0]-6,a[0][1]-36,INK,2.4);c9_at('CH₃',a[0][0]-8,a[0][1]-42,INK,15);TB('1-méthylcyclohexène',80,208,GREY,13);
  TB('Br₂',205,90,ORANGE,15);TB('H₂O (excès)',205,110,ORANGE,13);A(168,126,76,0,ORANGE,'',2.8);
  if(q>0){uh_al(q);var b=c9_hex(360,126,42);c9_ring(b,-1,INK);LN(b[0][0],b[0][1],b[0][0]-30,b[0][1]-26,INK,2.4);c9_at('CH₃',b[0][0]-42,b[0][1]-32,INK,15);c9_wedge(b[0][0],b[0][1],b[0][0]+10,b[0][1]-44,DRED);c9_at('OH',b[0][0]+10,b[0][1]-50,DRED,17);c9_dash(b[1][0],b[1][1],b[1][0]+40,b[1][1]+14,BLUE_D);c9_at('Br',b[1][0]+56,b[1][1]+22,BLUE_D,17);
   TB('trans-2-bromo-1-méthylcyclohexan-1-ol',W*.5,246,DRED,14);TB('OH sur le C le plus substitué, anti',W*.5,268,GREY,13);ctx.globalAlpha=1;}else TB('?',360,140,GREY,34);},
 /* 12 hydratation propène */
 function(p){var q=uh_e(p,0,.7),m=uh_ax(64,H-44,W-100,H-90,250,600,-3,4,'T (K)','log K'),K=function(T){return (-(-51000-T*(-135))/(8.314*T))/Math.LN10;};uh_fn(m,function(T){return Math.log(Math.exp(-(-51000+T*135)/(8.314*T)))/Math.LN10;},250,600,BLUE,3);
  [300,400,500,600].forEach(function(v){TB(v,m.X(v),H-26,GREY,12);});[-2,0,2,4].forEach(function(v){TB(String(v).replace('-','−'),58,m.Y(v)+4,GREY,12,'right');});LN(64,m.Y(0),W-36,m.Y(0),GREY,1.3,[5,4]);TB('K = 1',W-38,m.Y(0)-6,GREY,13,'right');
  [[298,'K = 77 (298 K)',GREEN,18,-24],[523,'K = 1,1·10⁻² (523 K)',RED,-100,-24]].forEach(function(P,i){var l=Math.log(Math.exp(-(-51000+P[0]*135)/(8.314*P[0])))/Math.LN10;DOT(m.X(P[0]),m.Y(l),7,P[2]);if(q>i*.4){uh_al(Math.min(1,(q-i*.4)*4));LN(m.X(P[0]),H-44,m.X(P[0]),m.Y(l),P[2],1.4,[4,3]);uh_tag(P[1],m.X(P[0])+(i?-38:70),m.Y(l)+(i?-22:-14),dk(P[2]),13);ctx.globalAlpha=1;}});
  uh_al(q);TB('exothermique : K baisse quand T monte',W*.55,22,DRED,14);ctx.globalAlpha=1;},
 /* 13 iodométrie retour */
 function(p){var q=uh_e(p,0,.7),x0=40,w=380,tot=2.5;TB('I₂ introduit : 25,00 mL × 0,1000 = 2,500 mmol',W*.5,30,INK,15);ctx.fillStyle='#e9edf0';ctx.fillRect(x0,44,w,34);
  var wr=w*(.93/tot),wf=w-wr;ctx.fillStyle='#7f1fa0';ctx.globalAlpha=.85;ctx.fillRect(x0,44,wr*(q<.01?1:1),34);ctx.globalAlpha=1;ctx.fillStyle=ORANGE;ctx.fillRect(x0+wr,44,wf*q,34);ctx.fillStyle='#7f1fa0';ctx.globalAlpha=.85;ctx.fillRect(x0+wr+wf*q,44,wf*(1-q),34);ctx.globalAlpha=1;
  TB('restant',x0+wr/2,67,'#fff',14);TB(q>.5?'fixé':'',x0+wr+wf/2,67,'#fff',14);
  TB('I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻',W*.5,114,GREY,15);TB('n(I₂ restant) = 18,60 × 0,1000 / 2 = 0,930 mmol',W*.5,140,'#6a1b8a',15);
  uh_al(q);uh_tag('n(I₂ fixé) = 2,500 − 0,930 = 1,570 mmol',W*.5,182,DRED,15);uh_tag('IV = 1,570·10⁻³ × 253,81 / 0,5000 × 100 = 79,7',W*.5,222,DRED,14);TB('≈ 2,8 C=C par triglycéride',W*.5,260,DGREEN,15);ctx.globalAlpha=1;}
]);
