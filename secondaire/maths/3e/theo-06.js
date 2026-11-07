(function(){
/* aides locales du chapitre (préfixe m3) */
function cl(v){return Math.max(0,Math.min(1,v));}
function sg(p,a,b){return cl((p-a)/(b-a));}
var BL='rgba(55,138,221,.22)',RL='rgba(226,75,74,.20)',GL='rgba(29,158,117,.22)',OL='rgba(186,117,21,.25)',VL='rgba(127,119,221,.22)';
function RC(x,y,w,h,f,s,lw){ctx.beginPath();ctx.rect(x,y,w,h);if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||2;ctx.stroke();}}
function PG(pts,f,s,lw){ctx.beginPath();pts.forEach(function(q,i){i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.closePath();if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||2;ctx.lineJoin='round';ctx.stroke();}}
function GR(x0,x1,y0,y1,l,r,t,b,sx,sy){
 var X=function(x){return l+(x-x0)/(x1-x0)*(r-l);},Y=function(y){return b-(y-y0)/(y1-y0)*(b-t);};
 sx=sx||1;sy=sy||1;ctx.lineWidth=1;ctx.strokeStyle='#eceef1';
 var i;for(i=Math.ceil(x0/sx)*sx;i<=x1+1e-9;i+=sx){ctx.beginPath();ctx.moveTo(X(i),t);ctx.lineTo(X(i),b);ctx.stroke();}
 for(i=Math.ceil(y0/sy)*sy;i<=y1+1e-9;i+=sy){ctx.beginPath();ctx.moveTo(l,Y(i));ctx.lineTo(r,Y(i));ctx.stroke();}
 var ax=x0<=0&&x1>=0?X(0):l,ay=y0<=0&&y1>=0?Y(0):b;
 LN(l,ay,r+8,ay,'#9aa0a6',1.6);LN(ax,b,ax,t-8,'#9aa0a6',1.6);
 ctx.fillStyle='#9aa0a6';ctx.beginPath();ctx.moveTo(r+12,ay);ctx.lineTo(r+4,ay-4);ctx.lineTo(r+4,ay+4);ctx.fill();
 ctx.beginPath();ctx.moveTo(ax,t-12);ctx.lineTo(ax-4,t-4);ctx.lineTo(ax+4,t-4);ctx.fill();
 for(i=Math.ceil(x0/sx)*sx;i<=x1+1e-9;i+=sx){if(Math.abs(i)<1e-9)continue;TB(String(Math.round(i*100)/100).replace('.',',').replace('-','−'),X(i),ay+15,GREY,12);}
 for(i=Math.ceil(y0/sy)*sy;i<=y1+1e-9;i+=sy){if(Math.abs(i)<1e-9)continue;TB(String(Math.round(i*100)/100).replace('.',',').replace('-','−'),ax-6,Y(i)+4,GREY,12,'right');}
 return {X:X,Y:Y};}
function FP(g,f,a,b,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||3;ctx.lineJoin='round';ctx.beginPath();var n=120;for(var i=0;i<=n;i++){var x=a+(b-a)*i/n,y=f(x);i?ctx.lineTo(g.X(x),g.Y(y)):ctx.moveTo(g.X(x),g.Y(y));}ctx.stroke();}
function PT(g,x,y,col,r,lab,dx,dy,s){DOT(g.X(x),g.Y(y),r||5,col);if(lab)tag(lab,g.X(x)+(dx||0),g.Y(y)+(dy||-16),col,s||13);}
function SG(g,x1,y1,x2,y2,col,w,d){LN(g.X(x1),g.Y(y1),g.X(x2),g.Y(y2),col,w||2,d);}
function ARCD(x,y,r,a0,a1,col,w){ctx.strokeStyle=col;ctx.lineWidth=w||2;ctx.beginPath();ctx.arc(x,y,r,a0,a1);ctx.stroke();}
function RANG(x,y,ux,uy,vx,vy,s,col){ctx.strokeStyle=col||GREY;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+ux*s,y+uy*s);ctx.lineTo(x+(ux+vx)*s,y+(uy+vy)*s);ctx.lineTo(x+vx*s,y+vy*s);ctx.stroke();}
function FR(n){return String(Math.round(n*100)/100).replace('.',',').replace('-','−');}
function FA(a,f){if(a<=0)return;ctx.globalAlpha=Math.min(1,a);f();ctx.globalAlpha=1;}
function ARW(x1,y1,x2,y2,c,w){arrow(x1,y1,x2-x1,y2-y1,c,'',w||2.5);}
function NL(x0,x1,l,r,y,st,col){var X=function(v){return l+(v-x0)/(x1-x0)*(r-l);};LN(l-6,y,r+10,y,col||'#9aa0a6',2);
 ctx.fillStyle='#9aa0a6';ctx.beginPath();ctx.moveTo(r+14,y);ctx.lineTo(r+6,y-4);ctx.lineTo(r+6,y+4);ctx.fill();
 for(var v=Math.ceil(x0/st)*st;v<=x1+1e-9;v+=st){LN(X(v),y-5,X(v),y+5,'#9aa0a6',1.5);TB(FR(v),X(v),y+22,GREY,13);}return X;}
function RAY(X,y,a,dir,closed,col,lim){var e=dir>0?X(lim)+8:X(lim)-8;LN(X(a),y,e,y,col,6);
 if(dir>0){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(e+8,y);ctx.lineTo(e-2,y-8);ctx.lineTo(e-2,y+8);ctx.fill();}else{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(e-8,y);ctx.lineTo(e+2,y-8);ctx.lineTo(e+2,y+8);ctx.fill();}
 DOT(X(a),y,8,'#fff');DOT(X(a),y,8,col,!closed?false:true);if(!closed){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(X(a),y,6,0,7);ctx.fill();}}
function SEGI(X,y,a,b,ca,cb,col,w){LN(X(a),y,X(b),y,col,w||6);[[a,ca],[b,cb]].forEach(function(q){DOT(X(q[0]),y,8,col);if(!q[1]){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(X(q[0]),y,5.2,0,7);ctx.fill();}});}
function LG(g,f,x0,x1,col,w,d){ctx.save();ctx.beginPath();ctx.rect(g.X(x0)-1,0,g.X(x1)-g.X(x0)+2,H);ctx.clip();ctx.strokeStyle=col;ctx.lineWidth=w||3.5;if(d)ctx.setLineDash(d);ctx.beginPath();ctx.moveTo(g.X(x0),g.Y(f(x0)));ctx.lineTo(g.X(x1),g.Y(f(x1)));ctx.stroke();ctx.restore();}
function CROSS(g,p,x,y,lab,dx,dy){FA(sg(p,.1,.6),function(){var q=sg(p,.1,.4);ctx.strokeStyle='rgba(226,75,74,.5)';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(g.X(x),g.Y(y));ctx.lineTo(g.X(x),g.Y(0));ctx.moveTo(g.X(x),g.Y(y));ctx.lineTo(g.X(0),g.Y(y));ctx.stroke();ctx.setLineDash([]);DOT(g.X(x),g.Y(y),7+3*(1-q),RED);tag(lab,g.X(x)+(dx||0),g.Y(y)+(dy||-20),DRED,16);});}
function TWO(p,b,f1,f2,l1,l2,sol,lab,t1,t2){var g=GR(b[0],b[1],b[2],b[3],W*.1,W*.94,H*.07,H*.88,b[4],b[5]);
 LG(g,f1,b[0],b[1],BLUE,3.5);LG(g,f2,b[0],b[1],GREEN,3.5);
 tag(l1,g.X(t1[0]),g.Y(t1[1]),BLUE_D,15);tag(l2,g.X(t2[0]),g.Y(t2[1]),DGREEN,15);
 DOT(g.X(sol[0]),g.Y(sol[1]),0.1,RED);
 if(p>0)CROSS(g,p,sol[0],sol[1],lab,sol[2]||0,sol[3]||-22);return g;}
SFA.theo("c06", {
 icon: function () {
  var g=GR(-1,5,-1,5,W*.62,W*.96,H*.12,H*.88,1,1);LG(g,function(x){return x+1;},-1,5,BLUE,3);LG(g,function(x){return 5-x;},-1,5,GREEN,3);DOT(g.X(2),g.Y(3),7,RED);
  TB('{ x + y = 5',W*.3,H*.36,BLUE_D,Math.min(26,W*.056));TB('{ x − y = −1',W*.3,H*.58,DGREEN,Math.min(26,W*.056));TB('→ (2 ; 3)',W*.3,H*.82,RED,Math.min(24,W*.052));
 },
 anim: function (t) {
  var g=GR(-1,7,-1,9,W*.08,W*.55,H*.06,H*.86,1,1),T=t%1080,ph=T<540?0:T<780?1:2;
  var f1=function(x){return x+1;};LG(g,f1,-1,7,BLUE,3.5);tag('y = x + 1',g.X(5.6),g.Y(7.2),BLUE_D,14);
  var rx=W*.62;
  if(ph===0){var m=-2+2*(0.5-0.5*Math.cos(T/540*Math.PI*2)),xs=4/(1-m),ys=xs+1;
   LG(g,function(x){return m*x+5;},-1,7,GREEN,3.5);DOT(g.X(0),g.Y(5),5,ORANGE);tag('pivot (0 ; 5)',g.X(0)+50,g.Y(5)-14,ORANGE,12);
   DOT(g.X(xs),g.Y(ys),8,RED);
   TB('Les droites se coupent',rx,H*.2,DGREEN,17,'left');TB('en un seul point',rx,H*.2+22,DGREEN,17,'left');
   TB('y = '+FR(Math.round(m*10)/10)+' x + 5',rx,H*.46,DGREEN,16,'left');TB('solution : ('+FR(Math.round(xs*10)/10)+' ; '+FR(Math.round(ys*10)/10)+')',rx,H*.62,RED,17,'left');
  }else if(ph===1){LG(g,function(x){return x+5;},-1,7,GREEN,3.5);tag('y = x + 5',g.X(1.6),g.Y(7.4),DGREEN,14);
   TB('Même pente,',rx,H*.2,DRED,17,'left');TB('ordonnées différentes',rx,H*.2+22,DRED,17,'left');TB('parallèles : aucun point',rx,H*.52,DRED,17,'left');TB('commun → impossible',rx,H*.52+22,DRED,17,'left');
  }else{LG(g,f1,-1,7,ORANGE,3.5,[10,9]);
   TB('Même droite !',rx,H*.2,ORANGE,17,'left');TB('confondues : une infinité',rx,H*.52,ORANGE,17,'left');TB('de solutions → indéterminé',rx,H*.52+22,ORANGE,17,'left');}
 },
 th: '<div class="tcard"><b class="h">Un système, deux droites</b><p>Un système de deux équations du 1<sup>er</sup> degré à deux inconnues, par exemple { x + y = 5 ; 2x − y = 1 }, demande un <b>couple</b> (x ; y) qui vérifie les deux équations à la fois. Chaque équation est une droite : la solution est leur <b>point d\'intersection</b>. Un couple s\'écrit toujours (x ; y), dans cet ordre.</p></div>' +
  '<div class="tcard"><b class="h">Substitution</b><p>On isole une inconnue dans une équation, puis on la remplace dans l\'autre. <i>Exemple :</i> { y = 2x − 1 ; x + y = 8 } : x + (2x − 1) = 8, donc 3x = 9, x = 3, puis y = 2 × 3 − 1 = 5. Solution (3 ; 5).</p></div>' +
  '<div class="tcard"><b class="h">Combinaison (addition)</b><p>On multiplie les équations pour que les coefficients d\'une inconnue soient opposés, puis on additionne. <b>Attention : on multiplie aussi le second membre.</b></p><p><i>Exemple :</i> { 2x + 3y = 13 ; x − y = −1 }. Équation 2 × 3 : 3x − 3y = −3. On additionne : 5x = 10, x = 2, puis y = 3. Toujours <b>vérifier</b> dans les deux équations.</p></div>' +
  '<div class="tcard"><b class="h">Trois cas possibles</b><p><b>Une solution</b> : pentes différentes, droites sécantes. <b>Aucune</b> : même pente, ordonnées différentes (parallèles), on arrive à une égalité fausse comme 6 = 10. <b>Une infinité</b> : équations équivalentes (droites confondues), on arrive à 0 = 0.</p><p><i>Problèmes :</i> choisis tes deux inconnues, écris deux équations, résous, puis réponds par une phrase avec les unités.</p></div>'
});
SFA.figs("c06", [
 function (p) {TWO(p,[-1,6,-2,7,1,1],function(x){return 5-x;},function(x){return 2*x-1;},'x + y = 5','2x − y = 1',[2,3,10,-22],'(2 ; 3)',[0.5,5.2],[4.6,6.4]);if(p>0)FA(sg(p,.5,1),function(){TB('2 + 3 = 5 ✓   4 − 3 = 1 ✓',W*.62,H*.95,DGREEN,16);});},
 function (p) {TWO(p,[-1,8,-3,10,1,1],function(x){return 2*x-1;},function(x){return 8-x;},'y = 2x − 1','x + y = 8',[3,5,18,-18],'(3 ; 5)',[5.5,10],[0.4,8.4]);},
 function (p) {TWO(p,[-3,6,-1,8,1,1],function(x){return (13-2*x)/3;},function(x){return x+1;},'2x + 3y = 13','x − y = −1',[2,3,20,-22],'(2 ; 3)',[3.7,4.6],[-1.2,0.2]);},
 function (p) {TWO(p,[-1,6,-2,9,1,1],function(x){return (16-3*x)/2;},function(x){return 2.5*x;},'3x + 2y = 16','5x − 2y = 0',[2,5,-52,-20],'(2 ; 5)',[4.2,5],[3.4,8.4]);},
 function (p) {
  var h=W/2,k,i;for(i=0;i<2;i++){ctx.save();ctx.translate(i*h,0);var Wsave=W;
   var g=GR(-1,5,-1,5,h*.18,h*.9,H*.2,H*.78,1,1);
   if(i===0){LG(g,function(x){return (3-x)/2;},-1,5,BLUE,4);LG(g,function(x){return (3-x)/2;},-1,5,ORANGE,3,[9,9]);TB('A',h*.5,H*.1,BLUE_D,22);TB('droites confondues',h*.5,H*.96,ORANGE,15);FA(sg(p,.2,.7),function(){TB('∞ solutions',h*.5,H*.84,DRED,18);});}
   else{LG(g,function(x){return (3-x)/2;},-1,5,BLUE,3.5);LG(g,function(x){return (5-x)/2;},-1,5,GREEN,3.5);TB('B',h*.5,H*.1,DGREEN,22);TB('droites parallèles',h*.5,H*.96,DGREEN,15);FA(sg(p,.2,.7),function(){TB('aucune solution',h*.5,H*.84,DRED,18);});}
   ctx.restore();}
  LN(h,H*.1,h,H*.9,AX,1.5,[4,4]);
 },
 function (p) {var g=GR(-1,5,-2,5,W*.1,W*.94,H*.07,H*.88,1,1);LG(g,function(x){return 3*x-2;},-1,5,BLUE,6);LG(g,function(x){return 3*x-2;},-1,5,ORANGE,3,[10,10]);
  tag('6x − 2y = 4  et  3x − y = 2',g.X(1.9),g.Y(4.6),BLUE_D,15);
  FA(sg(p,.1,.6),function(){tag('même droite : y = 3x − 2',g.X(3.6),g.Y(1.6),DRED,16);});
  FA(sg(p,.5,1),function(){[[0,-2],[1,1],[2,4]].forEach(function(q){DOT(g.X(q[0]),g.Y(q[1]),6,RED);});TB('une infinité de solutions',W*.62,H*.9,DRED,17);});},
 function (p) {TWO(p,[-0.5,4,-0.5,5,1,1],function(c){return (9.4-3*c)/2;},function(c){return (8.6-2*c)/3;},'3c + 2k = 9,40','2c + 3k = 8,60',[2.2,1.4,24,-22],'(2,20 ; 1,40)',[0.6,4.1],[3.1,2.6]);TB('c : prix du café (€)   k : prix du croissant (€)',W*.5,H*.97,GREY,13);},
 function (p) {TWO(p,[0,16,-1,19,2,3],function(a){return (55-5*a)/3;},function(a){return (36-2*a)/4;},'5a + 3e = 55','2a + 4e = 36',[8,5,22,-22],'adulte 8 € · enfant 5 €',[3,16],[12.5,13]);},
 function (p) {
  var g=GR(-1,22,-1,22,W*.1,W*.94,H*.07,H*.86,5,5);LG(g,function(x){return 20-x;},-1,22,BLUE,3.5);LG(g,function(x){return (4.4-0.1*x)/0.3;},-1,22,GREEN,3.5);
  tag('x + y = 20',g.X(3),g.Y(18),BLUE_D,15);tag('0,1x + 0,3y = 4,4',g.X(12),g.Y(15.5),DGREEN,15);
  var ty=H*.95;TB('x : L à 10 %   y : L à 30 %',W*.5,H*.97,GREY,13);
  if(p>0)CROSS(g,p,8,12,'8 L et 12 L',34,-18);
  FA(sg(p,.5,1),function(){var u=W*.3/20,x0=W*.62,y0=H*.12;RC(x0,y0,8*u,22,BL,BLUE,1.5);RC(x0+8*u,y0,12*u,22,GL,GREEN,1.5);TB('8',x0+4*u,y0+16,BLUE_D,13);TB('12',x0+14*u,y0+16,DGREEN,13);TB('20 L à 22 %',x0+10*u,y0-8,DRED,13);});
 },
 function (p) {var g=GR(-8,4,-10,10,W*.1,W*.94,H*.07,H*.88,2,5);
  LG(g,function(x){return 2*x+1;},-8,4,BLUE,3.5);LG(g,function(x){return 3*x+5;},-8,4,GREEN,3.5);LG(g,function(x){return 2*x+5;},-8,4,RED,3,[8,6]);
  tag('y = 2x + 1',g.X(-5.4),g.Y(-6.5),BLUE_D,14);tag('m = 3',g.X(-1.6),g.Y(-4),DGREEN,14);tag('m = 2 : parallèle',g.X(-3.2),g.Y(1.2),DRED,13);
  if(p>0)CROSS(g,p,-4,-7,'(−4 ; −7)',-6,22);FA(sg(p,.5,1),function(){TB('m ≠ 2 : un point',W*.58,H*.78,DGREEN,15,'left');TB('m = 2 : aucun',W*.58,H*.78+20,DRED,15,'left');});}
]);
})();
