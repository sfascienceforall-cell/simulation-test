/* Maths 4e · chapitre 5 : signe, inéquations et domaine */
function m4_cv2(f,fn,xa,xb,cp,cn,w){var y0=f.Y(0);
 ctx.save();ctx.beginPath();ctx.rect(f.L,f.T,f.R-f.L,Math.max(0,Math.min(f.B,y0)-f.T));ctx.clip();m4_cv(f,fn,xa,xb,cp,w);ctx.restore();
 ctx.save();ctx.beginPath();ctx.rect(f.L,Math.max(f.T,y0),f.R-f.L,Math.max(0,f.B-Math.max(f.T,y0)));ctx.clip();m4_cv(f,fn,xa,xb,cn,w);ctx.restore();}
function m4_ivl(f,a,b,col,oa,ob,y){/* intervalle sur l'axe Ox ; a ou b infinis allowed */
 var ya=y==null?f.Y(0):y,xa=isFinite(a)?f.X(a):f.L,xb=isFinite(b)?f.X(b):f.R;
 LN(xa,ya,xb,ya,col,6);
 if(isFinite(a)){DOT(xa,ya,6,'#fff');DOT(xa,ya,6,col,oa?false:true);if(oa){DOT(xa,ya,4.5,'#fff');}}
 if(isFinite(b)){DOT(xb,ya,6,'#fff');DOT(xb,ya,6,col,ob?false:true);if(ob){DOT(xb,ya,4.5,'#fff');}}}
function m4_signband(f,roots,signs,y,h,upto){/* bande de signes colorée : roots triées, signs = n+1 signes */
 var xs=[f.x0].concat(roots,[f.x1]),i;
 for(i=0;i<signs.length;i++){var a=xs[i],b=Math.min(xs[i+1],upto==null?1e9:upto);if(b<=a)continue;
  ctx.fillStyle=signs[i]>0?'rgba(29,158,117,.35)':'rgba(226,75,74,.32)';ctx.fillRect(f.X(a),y,f.X(b)-f.X(a),h);
  if(f.X(b)-f.X(a)>16)TB(signs[i]>0?'+':'−',(f.X(a)+f.X(b))/2,y+h*.72,signs[i]>0?DGREEN:DRED,Math.round(h*.8));}
 roots.forEach(function(r){if(r<=(upto==null?1e9:upto)){LN(f.X(r),y-3,f.X(r),y+h+3,INK,1.6);}});
}
SFA.theo("c05", {
 icon: function () {
  var x0=W*.12,w=W*.76,y=H*.18,rh=H*.2;
  TB('Tableau de signes',W*.5,H*.1,BLUE_D,22);
  ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.strokeRect(x0,y,w,rh*3);LN(x0,y+rh,x0+w,y+rh,INK,2);LN(x0,y+2*rh,x0+w,y+2*rh,INK,2);LN(x0+w*.2,y,x0+w*.2,y+rh*3,INK,2);
  var c1=x0+w*.2+(w*.8)*.33,c2=x0+w*.2+(w*.8)*.7;
  TB('x',x0+w*.1,y+rh*.62,INK,18);TB('f(x)',x0+w*.1,y+rh*1.62,INK,18);TB('g(x)',x0+w*.1,y+rh*2.62,INK,18);
  TB('−2',c1,y+rh*.62,INK,17);TB('3/2',c2,y+rh*.62,INK,17);
  [[c1,'0'],[c2,'0']].forEach(function(c){TB(c[1],c[0],y+rh*1.62,DRED,17);});
  TB('+',x0+w*.2+w*.8*.15,y+rh*1.62,DGREEN,20);TB('−',(c1+c2)/2,y+rh*1.62,DRED,20);TB('+',x0+w*.2+w*.8*.88,y+rh*1.62,DGREEN,20);
  TB('−',x0+w*.2+w*.8*.15,y+rh*2.62,DRED,20);TB('−',(c1+c2)/2,y+rh*2.62,DRED,20);TB('+',x0+w*.2+w*.8*.88,y+rh*2.62,DGREEN,20);
  TB('f(x) > 0 ,  f(x) ≤ 0 ,  √f(x) ,  f/g',W*.5,H*.93,GREY,16);
 },
 anim: function (t) {
  var f=m4_fr(-1,5,-2.5,5,{l:26,r:W*.36,t:14,b:H*.36});
  m4_grid(f,1,1,true);
  var Q=function(x){return x*x-4*x+3;};
  var xc=-.8+5.6*m4_cl((t%420)/330,0,1);
  m4_cv2(f,Q,-1,5,'#d6dbe0','#d6dbe0',3);
  m4_clip(f);ctx.beginPath();ctx.rect(f.L,f.T,Math.max(0,f.X(xc)-f.L),f.B-f.T);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(f.L,f.T,Math.max(0,f.X(xc)-f.L),f.B-f.T+60);ctx.clip();m4_cv2(f,Q,-1,5,GREEN,RED,4);ctx.restore();
  DOT(f.X(xc),f.Y(Q(xc)),7,ORANGE);
  LN(f.X(xc),f.Y(Q(xc)),f.X(xc),f.Y(0),ORANGE,2,[4,3]);
  [1,3].forEach(function(r){DOT(f.X(r),f.Y(0),5,INK);});
  var by=f.B+26,bh=34;
  TB('signe de f(x) = x² − 4x + 3',f.L,by-8,GREY,13,'left');
  m4_signband(f,[1,3],[1,-1,1],by,bh,xc);
  [1,3].forEach(function(r){TB(String(r),f.X(r),by+bh+16,INK,13);});
  var x0=f.R+22;
  TB('f(x) = (x − 1)(x − 3)',x0,36,BLUE_D,16,'left');
  TB('a = 1 > 0, Δ = 4 > 0',x0,62,GREY,14,'left');
  TB('+ à l\'extérieur des racines',x0,108,DGREEN,14,'left');TB('− entre les racines',x0,132,DRED,14,'left');
  TB('f(x) > 0 : ]−∞ ; 1[ ∪ ]3 ; +∞[',x0,174,INK,13,'left');TB('f(x) < 0 : ]1 ; 3[',x0,196,INK,13,'left');
  var s=Q(xc),sg=Math.abs(s)<.03?'0':s>0?'> 0':'< 0';TB('x = '+m4_n(Math.round(xc*10)/10)+' : f(x) '+sg,x0,244,ORANGE,15,'left');
 },
 th: '<div class="tcard"><b class="h">Signe d\'un trinôme ax² + bx + c</b><p>On calcule Δ = b² − 4ac.<br>• <b>Δ &gt; 0</b> : signe de <b>a</b> à l\'extérieur des racines, signe <b>contraire</b> entre les racines.<br>• <b>Δ = 0</b> : signe de a partout, sauf en la racine où il vaut 0.<br>• <b>Δ &lt; 0</b> : signe de a pour tout x (jamais nul).</p><p>Exemple : x² − 4x + 3 = (x − 1)(x − 3) : positif sur ]−∞ ; 1[ ∪ ]3 ; +∞[, négatif sur ]1 ; 3[.</p></div>'+
 '<div class="tcard"><b class="h">Tableau de signes d\'un produit ou d\'un quotient</b><p>On factorise, on place sur la première ligne les valeurs qui annulent chaque facteur (dans l\'ordre croissant), on donne une ligne de signes par facteur, puis on applique la <b>règle des signes</b> dans la dernière ligne. Pour un quotient, une valeur qui annule le dénominateur est notée par une double barre ‖ : l\'expression n\'y existe pas.</p><p>Exemple : (x + 3)(x − 1)(2 − x) ≤ 0. Racines −3, 1, 2 ; le coefficient dominant est négatif, donc le signe est + avant −3, − sur ]−3 ; 1[, + sur ]1 ; 2[, − après 2. Solution : <b>[−3 ; 1] ∪ [2 ; +∞[</b>.</p></div>'+
 '<div class="tcard"><b class="h">Résoudre une inéquation</b><p>1. Tout mettre d\'un côté pour avoir 0 de l\'autre. 2. Factoriser. 3. Tableau de signes. 4. Lire la réponse avec les bons crochets : ≤ et ≥ donnent des crochets fermés (sauf pour une valeur interdite, toujours ouverte).</p><p><b>Ne jamais</b> multiplier par une expression dont le signe est inconnu. Exemple : (x − 1)/(x + 2) ≥ 0 donne ]−∞ ; −2[ ∪ [1 ; +∞[ (−2 est interdit, 1 est permis).</p></div>'+
 '<div class="tcard"><b class="h">Domaine de définition</b><p>• Racine carrée : √A existe si <b>A ≥ 0</b>. • Quotient : A/B existe si <b>B ≠ 0</b>. On combine les conditions.</p><p>Exemple : f(x) = √(x² − 2x − 8). On étudie x² − 2x − 8 = (x + 2)(x − 4) ≥ 0 : domaine ]−∞ ; −2] ∪ [4 ; +∞[. Autre exemple : √(x − 1)/(x² − x − 2) : x ≥ 1 et x ≠ 2 (et x ≠ −1, déjà exclu) : [1 ; 2[ ∪ ]2 ; +∞[.</p></div>'+
 '<div class="tcard"><b class="h">Pièges</b><p>Simplifier un quotient en oubliant la valeur interdite (dans (x² − x − 6)/(x² − 4), x = −2 reste exclu) ; oublier les crochets ouverts pour un dénominateur ; se tromper de signe à cause de 2 − x ; croire qu\'un trinôme de Δ &lt; 0 est « négatif ».</p></div>'
});
SFA.figs("c05", [
 function (p) { /* 0 signe trinôme */
  var f=m4_fr(-1,5,-2.2,5,{t:16,b:H*.3});
  m4_grid(f,1,1,true);
  var Q=function(x){return x*x-4*x+3;};
  if(p>0)m4_cv2(f,Q,-1,5,GREEN,RED,3.6);else m4_cv(f,Q,-1,5,BLUE,3.6);
  tag('f(x) = x² − 4x + 3',f.X(3.8),f.Y(4.2),BLUE_D,14);
  m4_pt(f,1,0,INK,'',0,0,5);m4_pt(f,3,0,INK,'',0,0,5);
  var by=f.B+22;
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_signband(f,[1,3],[1,-1,1],by,32,null);TB('1',f.X(1),by+50,INK,14);TB('3',f.X(3),by+50,INK,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 1 x²-9<0 */
  var f=m4_fr(-5,5,-11,8,{});
  m4_grid(f,1,2,true);
  m4_cv(f,function(x){return x*x-9;},-5,5,BLUE,3.4);
  tag('y = x² − 9',f.X(3.4),f.Y(5.5),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_fill(f,function(x){return 0;},function(x){return x*x-9;},-3,3,RED,.2);m4_ivl(f,-3,3,RED,true,true);
   tag('x² − 9 < 0 : ]−3 ; 3[',f.X(0),f.Y(-4),DRED,16);ctx.globalAlpha=1;}
 },
 function (p) { /* 2 2x²+x-6>=0 */
  var f=m4_fr(-4,3,-8,8,{});
  m4_grid(f,1,2,true);
  var Q=function(x){return 2*x*x+x-6;};
  m4_cv(f,Q,-4,3,BLUE,3.4);tag('y = 2x² + x − 6',f.X(1.6),f.Y(-6.5),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ivl(f,-Infinity,-2,GREEN,false,false);m4_ivl(f,1.5,Infinity,GREEN,false,false);
   tag('−2',f.X(-2),f.Y(0)+20,DGREEN,14);tag('3/2',f.X(1.5),f.Y(0)+20,DGREEN,14);tag('≥ 0',f.X(-3.2),f.Y(0)-16,DGREEN,14);tag('≥ 0',f.X(2.5),f.Y(0)-16,DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 3 domaine racine */
  var f=m4_fr(-5,7,-9.5,8,{});
  m4_grid(f,1,2,true);
  var Q=function(x){return x*x-2*x-8;};
  m4_cv(f,Q,-5,7,'#b9c8e0',2.4,[5,4]);
  tag('x² − 2x − 8',f.X(1),f.Y(-9),GREY,13);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_cv(f,function(x){return Math.sqrt(Q(x));},-5,-2,ORANGE,3.6);m4_cv(f,function(x){return Math.sqrt(Q(x));},4,7,ORANGE,3.6);
   m4_ivl(f,-Infinity,-2,GREEN);m4_ivl(f,4,Infinity,GREEN);tag('domaine',f.X(-3.7),f.Y(0)+20,DGREEN,14);ctx.globalAlpha=1;}
  else tag('f(x) = √(x² − 2x − 8)',f.X(1),f.Y(6),BLUE_D,15);
 },
 function (p) { /* 4 quotient crochets */
  var f=m4_fr(-6,5,-6,6,{});
  m4_grid(f,1,2,true);
  var g=function(x){return (x-1)/(x+2);};
  m4_vl(f,-2,'#e8a4a3');m4_hl(f,1,'#c5c9cf');
  m4_cv(f,g,-6,-2.02,BLUE,3.4);m4_cv(f,g,-1.98,5,BLUE,3.4);
  tag('(x − 1)/(x + 2)',f.X(3),f.Y(-4.2),BLUE_D,15);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ivl(f,-Infinity,-2,GREEN,false,true);m4_ivl(f,1,Infinity,GREEN,false,false);
   tag('−2',f.X(-2)-14,f.Y(0)+18,DRED,14);tag('1',f.X(1),f.Y(0)+18,DGREEN,14);tag('≥ 0',f.X(-4,0),f.Y(0)-16,DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 5 produit */
  var f=m4_fr(-4.5,3.5,-14,10,{});
  m4_grid(f,1,2,true);
  var P=function(x){return (x+3)*(x-1)*(2-x);};
  m4_cv(f,P,-4.5,3.5,BLUE,3.4);tag('(x + 3)(x − 1)(2 − x)',f.X(1.8),f.Y(8.5),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ivl(f,-3,1,RED);m4_ivl(f,2,Infinity,RED);
   tag('≤ 0',f.X(-1),f.Y(0)-16,DRED,14);tag('≤ 0',f.X(2.9),f.Y(0)-16,DRED,14);[-3,1,2].forEach(function(r){tag(String(r),f.X(r),f.Y(0)+20,INK,13);});ctx.globalAlpha=1;}
 },
 function (p) { /* 6 quotient à simplifier */
  var f=m4_fr(-5,6,-5,6,{});
  m4_grid(f,1,1,true);
  var g=function(x){return (x-3)/(x-2);};
  m4_vl(f,2,'#e8a4a3');
  m4_cv(f,g,-5,1.98,BLUE,3.4);m4_cv(f,g,2.02,6,BLUE,3.4);
  tag('(x² − x − 6)/(x² − 4)',f.X(-2.2),f.Y(4.6),BLUE_D,14);
  DOT(f.X(-2),f.Y(1.25),6,'#fff');DOT(f.X(-2),f.Y(1.25),6,RED,false);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ivl(f,-Infinity,-2,GREEN,false,true);m4_ivl(f,-2,2,GREEN,true,true);m4_ivl(f,3,Infinity,GREEN,false,false);
   tag('−2 exclu',f.X(-2),f.Y(0)+20,DRED,13);tag('2 exclu',f.X(2)+4,f.Y(0)-30,DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 7 domaine expression */
  var f=m4_fr(-2,6.5,-3,3,{});
  m4_grid(f,1,1,true);
  var h=function(x){return Math.sqrt(x-1)/((x-2)*(x+1));};
  m4_vl(f,2,'#e8a4a3');
  m4_cv(f,h,1,1.97,BLUE,3.4);m4_cv(f,h,2.03,6.5,BLUE,3.4);
  tag('√(x − 1) / (x² − x − 2)',f.X(3.8),f.Y(2.3),BLUE_D,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_ivl(f,1,2,GREEN,false,true);m4_ivl(f,2,Infinity,GREEN,true,false);tag('1',f.X(1),f.Y(0)+18,DGREEN,13);tag('2',f.X(2)+10,f.Y(0)+18,DRED,13);
   tag('[1 ; 2[ ∪ ]2 ; +∞[',f.X(.6),f.Y(-2.4),DGREEN,14);ctx.globalAlpha=1;}
 },
 function (p) { /* 8 distance d'arrêt */
  var f=m4_fr(0,90,0,110,{l:42});
  m4_grid(f,10,20,true);TB('v (km/h)',f.R-30,f.B-8,GREY,12);TB('d (m)',f.L+4,f.T+8,GREY,12,'left');
  var d=function(v){return v/4+v*v/100;};
  m4_cv(f,d,0,90,BLUE,3.6);tag('d(v) = v/4 + v²/100',f.X(25),f.Y(95),BLUE_D,14);
  m4_pt(f,40,26,GREY,'d(40) = 26 m',-8,-20,5);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_hl(f,21,ORANGE);m4_hl(f,51,RED);m4_pt(f,35,21,ORANGE,'35',-4,20,6);m4_pt(f,60,51,RED,'60',16,20,6);
   tag('visibilité 21 m',f.X(72),f.Y(21)+16,DRED,13);tag('51 m',f.X(80),f.Y(51)-14,DRED,13);ctx.globalAlpha=1;}
 },
 function (p) { /* 9 toujours positif */
  var f=m4_fr(-2,6,-3,9,{});
  m4_grid(f,1,1,true);
  m4_cv(f,function(x){return x*x+2;},-2,6,GREEN,3.2);tag('m = 0',f.X(-1.2),f.Y(6.8),DGREEN,14);
  if(p>0){ctx.globalAlpha=m4_ap(p,0,1);m4_cv(f,function(x){return (x-2)*(x-2);},-2,6,ORANGE,3.4);m4_cv(f,function(x){return x*x-6*x+5;},-2,6,RED,3.2);
   m4_pt(f,2,0,ORANGE,'',0,0,6);tag('m = 2 : f(2) = 0',f.X(3.4),f.Y(.9),DRED,13);tag('m = 3 : 2 racines',f.X(4.6),f.Y(-2),DRED,13);
   tag('f_m > 0 pour −1 < m < 2',f.X(2),f.Y(8.3),DGREEN,15);ctx.globalAlpha=1;}
  else tag('f_m(x) = x² − 2mx + m + 2',f.X(2),f.Y(8.3),BLUE_D,15);
 }
]);
