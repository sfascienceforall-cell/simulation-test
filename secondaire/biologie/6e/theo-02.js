/* SFA · Biologie 6e · théorie animée et devantures (chapitre 02) */
(function(){
/* aides locales (portée de ce fichier) */
function sg(p,a,b){return Math.max(0,Math.min(1,(p-a)/(b-a)));}
function ga(a){ctx.globalAlpha=Math.max(0,Math.min(1,a));}
function g1(){ctx.globalAlpha=1;}
function F(fn){return function(p){ctx.save();var s=Math.min(W/460,H/280);ctx.translate((W-460*s)/2,(H-280*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(p||0);ctx.restore();};}
function G(fn){return function(t){ctx.save();var s=Math.min(W/700,H/300);ctx.translate((W-700*s)/2,(H-300*s)/2);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';fn(t||0);ctx.restore();};}
function box(x,y,w,h,col,fill,r,lw){ctx.fillStyle=fill||'#fff';ctx.strokeStyle=col||AX;ctx.lineWidth=lw||2;ctx.beginPath();ctx.roundRect(x,y,w,h,r===undefined?8:r);ctx.fill();ctx.stroke();}
function ell(x,y,rx,ry,fill,st,lw,rot){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot||0,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(st){ctx.strokeStyle=st;ctx.lineWidth=lw||2;ctx.stroke();}}
function chk(x,y,c,s){s=s||9;ctx.strokeStyle=c||DGREEN;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*.3,y+s*.7);ctx.lineTo(x+s,y-s*.8);ctx.stroke();}
function crs(x,y,c,s){s=s||8;ctx.strokeStyle=c||DRED;ctx.lineWidth=3.2;ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y+s);ctx.moveTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.stroke();}
/* texte avec exposant : base puis petit texte relevé */
function sup(base,s,x,y,col,size,al){size=size||14;ctx.font='700 '+size+'px system-ui';var w1=ctx.measureText(base).width;ctx.font='700 '+(size*.62)+'px system-ui';var w2=ctx.measureText(s).width;
 var x0=al==='left'?x:al==='right'?x-w1-w2:x-(w1+w2)/2;ctx.fillStyle=col||INK;ctx.textAlign='left';ctx.font='700 '+size+'px system-ui';ctx.fillText(base,x0,y);ctx.font='700 '+(size*.62)+'px system-ui';ctx.fillText(s,x0+w1+1,y-size*.38);}
/* échiquier de Punnett : colonnes cx[], lignes, cases remplies selon p */
function pun(x,y,cw,top,side,cells,cols,pp,size){var n=top.length,m=side.length;size=size||17;
 for(var i=0;i<n;i++)TB(top[i],x+cw*(i+1.5),y+cw*.62,BLUE_D,size);
 for(var j=0;j<m;j++)TB(side[j],x+cw*.5,y+cw*(j+1)+cw*.62,DRED,size);
 for(var j=0;j<m;j++)for(var i=0;i<n;i++){var k=j*n+i,a=pp===undefined?1:sg(pp,k*.12,k*.12+.25);
  box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,AX,'#fafbfc',6);
  if(a>0){ga(a);box(x+cw*(i+1)+2,y+cw*(j+1)+2,cw-4,cw-4,cols[k]||AX,(cols[k]||'#ccc')+'33',6);TB(cells[k],x+cw*(i+1.5),y+cw*(j+1.5)+size*.36,INK,size);g1();}}
}
function bar(x,y,w,h,col,lab,val,vs){ctx.fillStyle=col;ctx.fillRect(x,y-h,w,h);if(lab)TB(lab,x+w/2,y+16,INK,13);if(val!=null)TB(val,x+w/2,y-h-6,INK,vs||13);}
/* cellule de gamète : disque avec lettre */
function gam(x,y,r,c,l){DOT(x,y,r,c+'33');ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(l,x,y+r*.36,dk(c),Math.round(r*1.05));}
function drop(x,y,s,col,lab,fs){ctx.beginPath();ctx.moveTo(x,y-s*1.5);ctx.bezierCurveTo(x+s*.3,y-s*.8,x+s,y-s*.3,x+s,y+s*.35);ctx.arc(x,y+s*.35,s,0,PI,false);ctx.bezierCurveTo(x-s,y-s*.3,x-s*.3,y-s*.8,x,y-s*1.5);ctx.fillStyle=col+'33';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.stroke();if(lab)TB(lab,x,y+s*.55,dk(col),fs||Math.round(s*.95));}
function chX(x,y,s,col){LN(x-s*.5,y-s,x+s*.5,y+s,col,s*.3);LN(x+s*.5,y-s,x-s*.5,y+s,col,s*.3);}
function chY(x,y,s,col){LN(x-s*.5,y-s,x,y,col,s*.3);LN(x+s*.5,y-s,x,y,col,s*.3);LN(x,y,x,y+s,col,s*.3);}
function hsh(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
var CA=BLUE,CB=ORANGE,CC=GREEN,CD=RED;/* A_B_ , A_bb , aaB_ , aabb */
function gtype(t,s){var a=[t[0],s[0]].sort(),b=[t[1],s[1]].sort();return a.join('')+b.join('');}
function pcol(g){var A=g.indexOf('A')>=0,B=g.indexOf('B')>=0;return A&&B?CA:A?CB:B?CC:CD;}
function seed(x,y,r,col,wr){ctx.beginPath();for(var i=0;i<=36;i++){var a=i/36*6.2832,k=wr?1+.1*Math.sin(a*6):1;ctx.lineTo(x+k*r*Math.cos(a),y+k*r*Math.sin(a));}ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.stroke();if(!wr)ell(x-r*.3,y-r*.3,r*.28,r*.18,'rgba(255,255,255,.5)');}
function chrom(x,y,h,col,lab){ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x-4,y-h/2,8,h,4);ctx.fill();TB(lab,x,y+h/2+14,dk(col),13);}
SFA.theo("c02", {
 icon: function () {
  var g=['AB','Ab','aB','ab'],cw=40,x0=W*.5-cw*2-70,y0=H*.12,cells=[],cols=[];
  for(var j=0;j<4;j++)for(var i=0;i<4;i++){var q=gtype(g[i],g[j]);cells.push('');cols.push(pcol(q));}
  for(var k=0;k<16;k++){var i=k%4,j=(k/4)|0;box(x0+i*(cw+3),y0+j*(cw+3),cw,cw,cols[k],cols[k]+'55',6);}
  TB('9 : 3 : 3 : 1',W*.5+120,H*.4,ORANGE,32);TB('deux gènes indépendants',W*.5+120,H*.4+24,GREY,13);
  TB('AaBb × AaBb',W*.5-70,H*.1,INK,18);TB('échiquier 4 × 4 · règle du produit · χ²',W*.5,H*.94,BLUE_D,17);
 },
 anim: G(function (t) {
  var ph=(t%900)/900,cw=46,px=60,py=12,g=['AB','Ab','aB','ab'];
  TB('AaBb × AaBb',px+cw*3,py+12,INK,14);
  var fl=sg(ph,.04,.18),tp=g;
  ga(sg(ph,0,.06));
  for(var i=0;i<4;i++){TB(g[i],px+cw*(i+1.5),py+cw*.85,BLUE_D,15);TB(g[i],px+cw*.5,py+cw*(i+1)+cw*.62,DRED,15);}
  g1();
  for(var k=0;k<16;k++){var i=k%4,j=(k/4)|0,gt=gtype(g[i],g[j]),c=pcol(gt),a=sg(ph,.2+k*.028,.2+k*.028+.06);
   box(px+cw*(i+1)+2,py+cw*(j+1)+2,cw-4,cw-4,AX,'#fafbfc',5);
   if(a>0){ga(a);box(px+cw*(i+1)+2,py+cw*(j+1)+2,cw-4,cw-4,c,c+'44',5);TB(gt,px+cw*(i+1.5),py+cw*(j+1.5)+4,INK,12);g1();}}
  /* bilan */
  var bx=380,b=sg(ph,.72,.9),lab=['rond jaune','rond vert','ridé jaune','ridé vert'],pc=[CA,CB,CC,CD],n=[9,3,3,1],gn=['A–B–','A–bb','aaB–','aabb'];
  TB('phénotypes',bx+150,30,INK,15);
  for(var k=0;k<4;k++){var y=48+k*56;ga(b);box(bx,y,300,44,pc[k],pc[k]+'22',8);TB(gn[k],bx+14,y+27,dk(pc[k]),16,'left');TB(lab[k],bx+84,y+27,GREY,13,'left');
   ctx.fillStyle=pc[k];ctx.fillRect(bx+170,y+12,n[k]*8*b,20);TB(n[k]+'/16',bx+285,y+27,INK,15,'right');g1();}
  ga(sg(ph,.88,.98));TB('9 : 3 : 3 : 1',bx+150,285,ORANGE,18);g1();
 }),
 th: '<div class="tcard"><b class="h">Deux gènes indépendants, des gamètes variés</b><p>Quand deux gènes sont portés par des <b>chromosomes différents</b>, les chromosomes de chaque paire se répartissent indépendamment dans les gamètes lors de la méiose. Un individu AaBb produit donc <b>4 types de gamètes</b> en proportions égales : AB, Ab, aB, ab (1/4 chacun). Un individu AaBB n\'en produit que 2 : AB et aB (1/2 chacun). Avec n gènes hétérozygotes indépendants, il y a 2<sup>n</sup> types de gamètes.</p></div>'
 +'<div class="tcard"><b class="h">L\'échiquier 4 × 4 et le 9 : 3 : 3 : 1</b><p>AaBb × AaBb : 16 cases, chacune de probabilité 1/16. Phénotypes (dominance complète) : 9/16 dominant pour les deux gènes (A–B–), 3/16 dominant A et récessif b (A–bb), 3/16 récessif a et dominant B (aaB–), 1/16 récessif pour les deux (aabb).</p><p><i>Exemple</i> : 1 600 graines → une part vaut 1 600 / 16 = 100 : 900 ronds jaunes, 300 ronds verts, 300 ridés jaunes, 100 ridés verts. <b>Test-cross dihybride</b> AaBb × aabb : 1 : 1 : 1 : 1 si les gènes sont indépendants.</p></div>'
 +'<div class="tcard"><b class="h">La règle du produit (gènes indépendants)</b><p>Plutôt que de dresser un échiquier géant, on raisonne gène par gène puis on <b>multiplie</b>. Pour des parents Aa × Aa : P(phénotype dominant) = 3/4, P(récessif) = 1/4, P(AA) = 1/4, P(Aa) = 1/2, P(aa) = 1/4. <i>Exemple</i> : pour AaBbCc × AaBbCc, P(aabbcc) = (1/4)<sup>3</sup> = 1/64 ; P(AaBbCc) = (1/2)<sup>3</sup> = 1/8.</p><p><b>Retrouver les parents</b> : analyse chaque gène séparément (3 : 1 donne Aa × Aa ; 1 : 1 donne Aa × aa), puis recombine. <b>Au moins un</b> : passe par l\'événement contraire, 1 − (1 − p)<sup>n</sup>.</p></div>'
 +'<div class="tcard"><b class="h">Tester un résultat : le χ² et les gènes liés</b><p>Pour confronter des effectifs observés (O) à des effectifs attendus (E) : <b>χ² = Σ (O − E)² / E</b>, avec <b>ddl = nombre de classes − 1</b>. Seuils à 5 % : 3,84 (1 ddl), 5,99 (2 ddl), 7,81 (3 ddl). Si χ² dépasse le seuil, on rejette le modèle : l\'écart n\'est plus attribuable au seul hasard.</p><p><i>Exemple</i> : test-cross avec 88, 84, 16, 12 descendants (attendu 50 chacun) : χ² = 28,88 + 23,12 + 23,12 + 28,88 = 104 &gt; 7,81. Les gènes ne sont pas indépendants : ils sont <b>liés</b>. Les classes rares (Aabb, aaBb) sont les recombinés : (16 + 12) / 200 = 14 %.</p></div>',
});
SFA.figs("c02", [
 F(function(p){ /* 1 gamètes */
  var rows=[[75,'AaBb',['AB','Ab','aB','ab'],true],[200,'AaBB',['AB','aB'],false]];
  rows.forEach(function(r,ri){var y=r[0];ell(70,y,50,44,'#f3f7fc',BLUE,2.4);
   chrom(48,y,44,BLUE,'A');chrom(60,y,44,BLUE,'a');chrom(80,y,34,ORANGE,'B');chrom(92,y,34,ORANGE,r[1]==='AaBb'?'b':'B');
   TB(r[1],70,y+68,INK,17);A(130,y,26,0,GREY,'',2.4);
   var n=r[2].length;for(var i=0;i<n;i++){var a=sg(p,i*.12,i*.12+.3);if(a>0){ga(a);gam(180+i*68,y,24,[BLUE,ORANGE,GREEN,RED][i],r[2][i]);TB(n===4?'1/4':'1/2',180+i*68,y+42,GREY,13);g1();}}
  });
  ga(1-sg(p,0,.3));TB('gamètes ?',300,75,GREY,20);TB('gamètes ?',260,200,GREY,20);g1();
 }),
 F(function(p){ /* 2 test-cross dihybride */
  TB('AaBb × aabb',230,28,INK,22);
  var g=['AB','Ab','aB','ab'],cells=['AaBb','Aabb','aaBb','aabb'],cols=[CA,CB,CC,CD];
  pun(40,36,72,g,['ab'],cells,cols,p,17);
  TB('gamètes de aabb : ab seulement',230,196,GREY,13);
  var a=sg(p,.5,.9);ga(a);box(120,215,220,48,ORANGE,'#fdf5e9',10);TB('1 : 1 : 1 : 1',230,248,DRED,26);g1();
  ga(1-a);TB('rapport des phénotypes ?',230,246,GREY,16);g1();
 }),
 F(function(p){ /* 3 pois */
  var cols=['#e9d36b','#8cc34b','#e9d36b','#8cc34b'],wr=[0,0,1,1],lab=['rond jaune','rond vert','ridé jaune','ridé vert'],n=[900,300,300,100],bc=[CA,CB,CC,CD];
  TB('AaBb × AaBb : 1 600 graines',230,28,INK,16);
  var a=sg(p,0,.8);
  for(var i=0;i<4;i++){var x=40+i*100;seed(x+30,66,20,cols[i],wr[i]);TB(lab[i],x+30,108,GREY,12);
   bar(x+8,248,44,n[i]/900*110*a,bc[i],null,null);ga(sg(p,.4,.9));TB(String(n[i]),x+30,240-n[i]/900*110*a,INK,17);g1();}
  LN(30,248,440,248,AX,1.5);
  ga(1-sg(p,0,.4));TB('9   :   3   :   3   :   1',230,200,GREY,20);g1();
  ga(sg(p,.5,1));TB('1 part = 100 graines',230,268,ORANGE,13);g1();
 }),
 F(function(p){ /* 4 règle du produit */
  TB('AaBbCc × AaBbCc',230,26,INK,18);
  var rows=[[70,'A–  B–  cc',['3/4','3/4','1/4'],'9/64'],[170,'aa  Bb  CC',['1/4','1/2','1/4'],'1/32']],cl=[BLUE,ORANGE,GREEN],gl=['A','B','C'];
  rows.forEach(function(r,ri){TB(['(a)','(b)'][ri]+' '+r[1],20,r[0]-24,INK,15,'left');
   for(var i=0;i<3;i++){var x=30+i*92;box(x,r[0]-8,70,50,cl[i],cl[i]+'22',8);ga(sg(p,ri*.1+i*.1,ri*.1+i*.1+.25));TB(r[2][i],x+35,r[0]+26,dk(cl[i]),22);g1();ga(1-sg(p,0,.3));TB('?',x+35,r[0]+26,GREY,20);g1();
    if(i<2)TB('×',x+81,r[0]+24,GREY,22);}
   ga(sg(p,.45+ri*.1,.8+ri*.1));TB('=',318,r[0]+26,GREY,26);box(335,r[0]-8,100,50,ORANGE,'#fdf5e9',8);TB(r[3],385,r[0]+26,DRED,24);g1();});
  ga(sg(p,.8,1));TB('≈ 14 %',385,128,GREY,13);TB('≈ 3,1 %',385,228,GREY,13);g1();
  TB('on multiplie gène par gène',230,262,GREY,13);
 }),
 F(function(p){ /* 5 retrouver les parents */
  seed(40,50,20,'#e9d36b',0);TB('rond jaune',40,88,GREY,12);TB('×',90,56,GREY,22);seed(140,50,20,'#8cc34b',0);TB('rond vert',140,88,GREY,12);
  var a=sg(p,0,.4);ga(a);TB('AaBb',40,112,BLUE_D,18);TB('Aabb',140,112,BLUE_D,18);g1();ga(1-a);TB('?',40,112,GREY,20);TB('?',140,112,GREY,20);g1();
  var v=[3,3,1,1],cl=[CA,CB,CC,CD],lb=['rond jaune','rond vert','ridé jaune','ridé vert'];
  for(var i=0;i<4;i++){var x=250+(i%2)*100,y=24+((i/2)|0)*72;box(x,y,92,60,cl[i],cl[i]+'22',8);TB(v[i]+'/8',x+46,y+30,INK,22);TB(lb[i],x+46,y+50,GREY,11);}
  TB('descendance',296,18,GREY,12,'left');
  var b=sg(p,.4,.9);ga(b);box(30,150,400,100,ORANGE,'#fdf5e9',10);
  TB('forme : 3/4 ronds · 1/4 ridés  →  Aa × Aa',44,184,INK,15,'left');TB('couleur : 1/2 jaunes · 1/2 verts  →  Bb × bb',44,218,INK,15,'left');g1();
  ga(1-b);TB('descendance connue, parents inconnus',230,205,GREY,16);g1();
 }),
 F(function(p){ /* 6 homozygotes */
  var g=['AB','Ab','aB','ab'],cw=48,x0=60,y0=20;
  TB('AaBb × AaBb',230,16,INK,13);
  for(var i=0;i<4;i++){TB(g[i],x0+cw*(i+.5),y0+16,BLUE_D,13);TB(g[i],x0-12,y0+cw*(i+1)+cw*.62-14,DRED,13,'right');}
  for(var k=0;k<16;k++){var i=k%4,j=(k/4)|0,q=gtype(g[i],g[j]),h=(q[0]===q[1]&&q[2]===q[3]);
   var a=h?sg(p,0,.6):0;box(x0+i*cw+1,y0+24+j*cw*.9+1,cw-3,cw*.9-3,h&&p>0?DGREEN:AX,h&&p>0?'#e1f4ec':'#fafbfc',5,h&&p>0?2.6:1.6);TB(q,x0+i*cw+cw/2,y0+24+j*cw*.9+cw*.5+1,h&&p>0?DGREEN:GREY,12);}
  var a=sg(p,.4,.9);ga(a);box(285,70,155,100,DGREEN,'#e8f7f1',10);TB('4 cases / 16',362,108,INK,17);TB('= 1/4',362,146,DGREEN,32);g1();
  ga(1-a);TB('homozygotes ?',362,128,GREY,16);g1();
  ga(a);TB('(1/2) × (1/2)',362,200,GREY,15);g1();
 }),
 F(function(p){ /* 7 gènes liés */
  var obs=[88,84,16,12],lb=['AaBb','aabb','Aabb','aaBb'],cl=[BLUE,BLUE,ORANGE,ORANGE];
  TB('test-cross : 200 descendants',230,22,INK,15);
  var a=sg(p,0,.7);LN(40,230,260,230,AX,1.5);
  for(var i=0;i<4;i++){var x=52+i*52;bar(x,230,38,obs[i]*1.5*a,cl[i],lb[i],null);ga(sg(p,.3,.9));TB(String(obs[i]),x+19,222-obs[i]*1.5*a,INK,15);g1();}
  ctx.strokeStyle=INK;ctx.setLineDash([5,4]);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(44,230-75);ctx.lineTo(256,230-75);ctx.stroke();ctx.setLineDash([]);TB('attendu : 50',250,230-82,GREY,12,'right');
  var b=sg(p,.5,.95);ga(b);box(285,50,160,84,DRED,'#fdecec',10);TB('χ² = 104',365,92,DRED,26);TB('seuil 7,81 → rejet',365,118,GREY,13);
  box(285,150,160,84,ORANGE,'#fdf5e9',10);TB('recombinés',365,176,INK,14);TB('28 / 200 = 14 %',365,212,ORANGE,20);g1();
  TB('parentaux',100,262,BLUE_D,12);TB('recombinés',208,262,ORANGE,12);
 }),
 F(function(p){ /* 8 lire un χ² */
  var x0=30,k=45,y=150;function X(v){return x0+v*k;}
  TB('χ² avec 1 ddl (2 classes)',230,28,INK,16);
  ctx.fillStyle='#e1f4ec';ctx.fillRect(X(0),y-30,X(3.84)-X(0),50);ctx.fillStyle='#fdecec';ctx.fillRect(X(3.84),y-30,X(9)-X(3.84),50);
  LN(X(0),y+20,X(9)+6,y+20,INK,2);for(var v=0;v<=9;v+=1){LN(X(v),y+20,X(v),y+26,INK,1.5);TB(String(v),X(v),y+42,GREY,13);}
  TB('hasard plausible',X(1.9),y-4,DGREEN,13);TB('rejet',X(6.4),y-4,DRED,16);
  LN(X(3.84),y-42,X(3.84),y+20,ORANGE,3);TB('seuil 3,84',X(3.84)-8,y-50,ORANGE,15,'right');
  var a=sg(p,0,.7),vx=X(5.2)*a+X(0)*(1-a);
  LN(vx,y-34,vx,y+20,RED,4);DOT(vx,y-34,6,RED);ga(a);TB('χ² = 5,2',vx+12,y-76,DRED,17,'left');g1();
  var b=sg(p,.7,1);ga(b);box(100,214,260,46,DRED,'#fdecec',10);TB('5,2 > 3,84 : on rejette 3 : 1',230,244,DRED,17);g1();
  ga(1-b);TB('que conclure ?',230,244,GREY,17);g1();
 }),
 F(function(p){ /* 9 chiot aabbcc */
  var cl=[BLUE,ORANGE,GREEN],gl=['A','B','C'];
  for(var i=0;i<3;i++){var x=24+i*88;TB('Aa × Aa',x+34,18,GREY,11);
   for(var k=0;k<4;k++){var r=k%2,c=(k/2)|0,aa=k===3;box(x+r*34,24+c*30,32,28,aa&&p>0?cl[i]:AX,aa&&p>0?cl[i]+'55':'#fafbfc',4,aa&&p>0?2.4:1.4);TB(['AA','Aa','Aa','aa'][k].replace(/A|a/g,function(m){return m==='A'?gl[i]:gl[i].toLowerCase();}),x+r*34+16,24+c*30+19,aa&&p>0?dk(cl[i]):GREY,11);}
   if(i<2)TB('×',x+78,56,GREY,20);}
  /* grille 8x8 */
  var gx=300,gy=20,cs=15;for(var k=0;k<64;k++){var i=k%8,j=(k/8)|0,last=k===63;ctx.fillStyle=last&&p>0?RED:'#e6eaee';ctx.fillRect(gx+i*(cs+1),gy+j*(cs+1),cs,cs);}
  TB('64 chiots',gx+64,gy+144,GREY,13);
  var a=sg(p,.3,.8);ga(a);TB('P(aabbcc) = (1/4)³ = 1/64',130,135,INK,15);box(20,150,260,92,ORANGE,'#fdf5e9',10);TB('portée de 8 : au moins un',150,176,INK,14);TB('1 − (63/64)⁸ ≈ 12 %',150,210,DRED,22);TB('95 % : environ 191 chiots',150,236,GREY,13);g1();
  ga(1-a);TB('P = ?',150,200,GREY,24);g1();
 }),
 F(function(p){ /* 10 identique aux parents */
  var gl=['A','B','C','D','E'];
  TB('AaBbCcDdEe × AaBbCcDdEe',230,24,INK,16);
  for(var i=0;i<5;i++){var x=24+i*86;ell(x+34,94,32,38,'#f3f7fc',BLUE,2.2);chrom(x+26,92,36,BLUE,gl[i]);chrom(x+42,92,36,ORANGE,gl[i].toLowerCase());
   var a=sg(p,i*.1,i*.1+.25);ga(a);
   DOT(x+34,170,22,'#e6eaee');ctx.fillStyle=GREEN;ctx.beginPath();ctx.moveTo(x+34,170);ctx.arc(x+34,170,22,-1.5708,1.5708,false);ctx.closePath();ctx.fill();TB('1/2',x+34,214,INK,15);if(i<4)TB('×',x+77,176,GREY,18);g1();}
  var b=sg(p,.55,1);ga(b);box(110,232,240,40,ORANGE,'#fdf5e9',10);TB('(1/2)⁵ = 1/32 ≈ 3 %',230,259,DRED,20);g1();
  ga(1-sg(p,0,.3));TB('P(Aa) par gène ?',230,176,GREY,16);g1();
 })
]);
})();
