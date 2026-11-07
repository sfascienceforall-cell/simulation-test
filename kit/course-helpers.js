/* SFA · aides de dessin partagées (ctx, W, H, TB, DOT, A, LN, arrow, tag, grid…) reprises de la page d'exercices de chimie. */
/* ================= helpers ================= */
var BLUE='#378ADD',BLUE_D='#185fa5',RED='#E24B4A',DRED='#a32d2d',GREEN='#1D9E75',DGREEN='#0F6E56',ORANGE='#BA7517',ORA2='#D85A30',VIOLET='#7F77DD',GREY='#9aa0a6',AX='#c8ccd0',INK='#3d3d3a',YEL='#BA9614';
var ctx=null,W=0,H=0,view='home',ci=0,ei=0,ti=0,reveal=false,p=0,tG=0;
var PI=Math.PI,D2R=PI/180;
var ORB={a:.7,b:.45},dragT=false;
function LN(x1,y1,x2,y2,c,w,d){ctx.strokeStyle=c||INK;ctx.lineWidth=w||1.5;if(d)ctx.setLineDash(d);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);}
function DOT(x,y,r,c,f){ctx.beginPath();ctx.arc(x,y,r,0,7);if(f!==false){ctx.fillStyle=c;ctx.fill();}else{ctx.strokeStyle=c;ctx.lineWidth=2.2;ctx.stroke();}}
function BALL(x,y,r){DOT(x,y,r,'#fdece4');ctx.strokeStyle=ORA2;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();}
function A(x,y,vx,vy,col,lab,w){var l=Math.hypot(vx,vy);if(l<2)return;var ex=x+vx,ey=y+vy;ctx.strokeStyle=col;ctx.lineWidth=w||2.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();
 var hs=(w||2.6)*3,an=Math.atan2(vy,vx);ctx.fillStyle=col;ctx.save();ctx.translate(ex,ey);ctx.rotate(an);ctx.beginPath();ctx.moveTo(hs,0);ctx.lineTo(-hs*.7,-hs*.55);ctx.lineTo(-hs*.7,hs*.55);ctx.closePath();ctx.fill();ctx.restore();
 if(lab){ctx.font='600 13px Mulish,system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle=col;ctx.fillText(lab,ex+vx/l*16,ey+vy/l*16+5);}}
function T(t,x,y,c,s,al){ctx.fillStyle=c||INK;ctx.font=(s||12)+'px ui-monospace,monospace';ctx.textAlign=al||'center';ctx.fillText(t,x,y);}
function TB(t,x,y,c,s,al){ctx.fillStyle=c||INK;ctx.font='600 '+(s||12)+'px system-ui';ctx.textAlign=al||'center';ctx.fillText(t,x,y);}
function wall(x,y1,y2,side){LN(x,y1,x,y2,INK,3);ctx.strokeStyle='#bbb';ctx.lineWidth=1;for(var h=y1+2;h<y2;h+=9){ctx.beginPath();ctx.moveTo(x,h);ctx.lineTo(x+7*(side||-1),h+7);ctx.stroke();}}
function floor(x1,x2,y){LN(x1,y,x2,y,INK,2.5);ctx.strokeStyle='#bbb';ctx.lineWidth=1;for(var h=x1+4;h<x2;h+=13){ctx.beginPath();ctx.moveTo(h,y);ctx.lineTo(h-8,y+9);ctx.stroke();}}
function blockR(x,y,w2,h2,c){ctx.fillStyle='#eef4fb';ctx.strokeStyle=c||BLUE;ctx.lineWidth=2.3;ctx.beginPath();ctx.roundRect(x-w2,y-h2,2*w2,2*h2,5);ctx.fill();ctx.stroke();}
function spring(x1,x2,y,n){var seg=(x2-x1)/n;ctx.strokeStyle='#7f8790';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y);for(var i=0;i<n;i++){ctx.lineTo(x1+seg*(i+.5),y+(i%2?11:-11));}ctx.lineTo(x2,y);ctx.stroke();}
function car(cx,cy,c){blockR(cx,cy,26,12,c||BLUE);DOT(cx-16,cy+12,7,'#555');DOT(cx+16,cy+12,7,'#555');}
/* --- helpers portés de la page « exercices-projection » --- */
var C_X='#D85A30',axesChoice=0;
function f1(x){return x.toFixed(1);}
function tag(txt,x,y,col,size){var s=size||12;ctx.font='600 '+s+'px system-ui';ctx.textAlign='center';
 var w=ctx.measureText(txt).width+10;
 ctx.fillStyle='rgba(255,255,255,0.93)';ctx.beginPath();ctx.roundRect(x-w/2,y-s*0.86,w,s*1.55,5);ctx.fill();
 ctx.fillStyle=col||INK;ctx.fillText(txt,x,y+s*0.36);}
function arrow(x,y,vx,vy,col,lab,w,dash){const len=Math.hypot(vx,vy);if(len<3)return;const ex=x+vx,ey=y+vy;
  ctx.strokeStyle=col;ctx.lineWidth=w||2.5;ctx.lineCap='round';if(dash)ctx.setLineDash(dash);
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  const hs=(w||2.5)*3.2,ang=Math.atan2(vy,vx);ctx.fillStyle=col;ctx.save();ctx.translate(ex,ey);ctx.rotate(ang);
  ctx.beginPath();ctx.moveTo(hs,0);ctx.lineTo(-hs*0.7,-hs*0.55);ctx.lineTo(-hs*0.7,hs*0.55);ctx.closePath();ctx.fill();ctx.restore();
  if(lab){ctx.font='600 13px Mulish,system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle=col;ctx.fillText(lab,ex+vx/len*16,ey+vy/len*16+5);}}

function axes2(O,kF,name1,name2){
  ctx.strokeStyle=AX;ctx.lineWidth=1.5;
  const xr=Math.min(W-16-O.x,12.5*kF),xl=Math.min(O.x-16,12.5*kF);
  const yu=Math.min(O.y-16,12.5*kF),yd=Math.min(H-16-O.y,12.5*kF);
  ctx.beginPath();ctx.moveTo(O.x-xl,O.y);ctx.lineTo(O.x+xr,O.y);ctx.moveTo(O.x,O.y+yd);ctx.lineTo(O.x,O.y-yu);ctx.stroke();
  ctx.fillStyle=AX;
  ctx.beginPath();ctx.moveTo(O.x+xr,O.y);ctx.lineTo(O.x+xr-8,O.y-4);ctx.lineTo(O.x+xr-8,O.y+4);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(O.x,O.y-yu);ctx.lineTo(O.x-4,O.y-yu+8);ctx.lineTo(O.x+4,O.y-yu+8);ctx.closePath();ctx.fill();
  ctx.fillStyle=GREY;ctx.font='600 12px Mulish,system-ui,sans-serif';ctx.textAlign='left';
  ctx.fillText(name1||'x',O.x+xr-12,O.y+16);ctx.fillText(name2||'y',O.x+10,O.y-yu+12);
  ctx.font='9px Mulish,system-ui,sans-serif';ctx.textAlign='center';
  [-10,-5,5,10].forEach(t=>{const px=O.x+t*kF;if(px>O.x-xl&&px<O.x+xr){ctx.strokeStyle='#dfe3e7';ctx.beginPath();ctx.moveTo(px,O.y-3);ctx.lineTo(px,O.y+3);ctx.stroke();ctx.fillStyle=GREY;ctx.fillText(t,px,O.y+13);}
    const py=O.y-t*kF;if(py>O.y-yu&&py<O.y+yd){ctx.strokeStyle='#dfe3e7';ctx.beginPath();ctx.moveTo(O.x-3,py);ctx.lineTo(O.x+3,py);ctx.stroke();ctx.fillStyle=GREY;ctx.fillText(t,O.x-11,py+3);}});
}
function axesU(O,kF,u1,u2,name1,name2,len){
  const L=len||11*kF;
  [[u1,name1],[u2,name2]].forEach(A=>{const u=A[0];
    const sx=u.x,sy=-u.y;
    ctx.strokeStyle=AX;ctx.lineWidth=1.5;ctx.beginPath();
    ctx.moveTo(O.x-sx*L*0.55,O.y-sy*L*0.55);ctx.lineTo(O.x+sx*L,O.y+sy*L);ctx.stroke();
    ctx.fillStyle=AX;const ang=Math.atan2(sy,sx);ctx.save();ctx.translate(O.x+sx*L,O.y+sy*L);ctx.rotate(ang);
    ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-4,-5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle=GREY;ctx.font='600 12px Mulish,system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText(A[1],O.x+sx*(L+14),O.y+sy*(L+14)+4);});
}
function projAnim(O,kF,vx,vy,u1,u2,pp,lab1,lab2){
  const c1=vx*u1.x+vy*u1.y,c2=vx*u2.x+vy*u2.y;
  const S=v=>({x:O.x+v.x*kF,y:O.y-v.y*kF});
  const tip=S({x:vx,y:vy}),F1=S({x:c1*u1.x,y:c1*u1.y}),F2=S({x:c2*u2.x,y:c2*u2.y});
  if(pp>0){
    ctx.strokeStyle='#b9bdc4';ctx.setLineDash([4,4]);ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(tip.x+(F1.x-tip.x)*pp,tip.y+(F1.y-tip.y)*pp);ctx.stroke();
    ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(tip.x+(F2.x-tip.x)*pp,tip.y+(F2.y-tip.y)*pp);ctx.stroke();ctx.setLineDash([]);
    arrow(O.x,O.y,(F1.x-O.x)*pp,(F1.y-O.y)*pp,C_X,pp>0.75?lab1:'',3);
    arrow(O.x,O.y,(F2.x-O.x)*pp,(F2.y-O.y)*pp,VIOLET,pp>0.75?lab2:'',3);
  }
  return {c1,c2};
}
function arcA(O,r,a0,a1,lab,col){ctx.strokeStyle=col||GREY;ctx.lineWidth=1.4;
  ctx.beginPath();ctx.arc(O.x,O.y,r,a0,a1,a1<a0);ctx.stroke();
  if(lab){const am=(a0+a1)/2;ctx.fillStyle=col||GREY;ctx.font='600 12px Mulish,system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText(lab,O.x+(r+13)*Math.cos(am),O.y+(r+13)*Math.sin(am)+4);}}

function incline(th){
  const gy=H*0.80,x0=W*0.10;
  const Lb=Math.min(W*0.62,(H*0.58)/Math.tan(th));
  const A={x:x0,y:gy},B={x:x0+Lb,y:gy-Lb*Math.tan(th)};
  ctx.strokeStyle=AX;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0-8,gy);ctx.lineTo(x0+Lb+50,gy);ctx.stroke();
  ctx.lineWidth=1;for(let hx=x0;hx<x0+Lb+50;hx+=15){ctx.beginPath();ctx.moveTo(hx,gy);ctx.lineTo(hx-8,gy+9);ctx.stroke();}
  ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();
  arcA(A,34,0,-th,'θ');
  const fr=0.55,P={x:A.x+(B.x-A.x)*fr,y:A.y+(B.y-A.y)*fr};
  const dir={x:Math.cos(th),y:-Math.sin(th)},ns={x:dir.y,y:-dir.x};
  const b=16,C={x:P.x+ns.x*b,y:P.y+ns.y*b};
  ctx.save();ctx.translate(P.x,P.y);ctx.rotate(-th);
  ctx.fillStyle='#eef4fb';ctx.strokeStyle='#185fa5';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(-b,-2*b,2*b,2*b,5);ctx.fill();ctx.stroke();ctx.restore();
  return {C:C,u:{x:Math.cos(th),y:Math.sin(th)},n:{x:-Math.sin(th),y:Math.cos(th)},kF:H*0.0145};
}
function pendule(th){
  const PV={x:W*0.5,y:H*0.10},Lp=H*0.42;
  ctx.strokeStyle=INK;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(PV.x-56,PV.y);ctx.lineTo(PV.x+56,PV.y);ctx.stroke();
  ctx.strokeStyle='#bbb';ctx.lineWidth=1;for(let hx=PV.x-50;hx<PV.x+56;hx+=10){ctx.beginPath();ctx.moveTo(hx,PV.y);ctx.lineTo(hx-7,PV.y-7);ctx.stroke();}
  ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(PV.x,PV.y);ctx.lineTo(PV.x,PV.y+Lp+26);ctx.stroke();ctx.setLineDash([]);
  const B={x:PV.x+Lp*Math.sin(th),y:PV.y+Lp*Math.cos(th)};
  ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(PV.x,PV.y);ctx.lineTo(B.x,B.y);ctx.stroke();
  arcA(PV,40,Math.PI/2,Math.PI/2-th,'θ');
  ctx.fillStyle='#eef4fb';ctx.strokeStyle=BLUE;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(B.x,B.y,12,0,7);ctx.fill();ctx.stroke();
  return {C:B,ut:{x:Math.cos(th),y:Math.sin(th)},ur:{x:-Math.sin(th),y:Math.cos(th)},kF:H*0.012};
}
// --- 3D orbitable ---
let az3=0.7,el3=0.5,tGlob=0;
function pr3(x,y,z,cx,cy,sc){const ca=Math.cos(az3),sa=Math.sin(az3),ce=Math.cos(el3),se=Math.sin(el3);
  const X=x*ca-y*sa,Y=x*sa+y*ca;return {x:cx+X*sc,y:cy-(Y*se+z*ce)*sc};}
function arr3(o,tip,col,lab,w,cx,cy,sc){const A=pr3(o[0],o[1],o[2],cx,cy,sc),B=pr3(tip[0],tip[1],tip[2],cx,cy,sc);arrow(A.x,A.y,B.x-A.x,B.y-A.y,col,lab,w);}
function comp2(O,kF,vx,vy,pp){
  ctx.strokeStyle='#b9bdc4';ctx.setLineDash([3,3]);ctx.lineWidth=1.1;
  ctx.beginPath();ctx.moveTo(O.x+vx*kF,O.y-vy*kF);ctx.lineTo(O.x+vx*kF,O.y);ctx.moveTo(O.x+vx*kF,O.y-vy*kF);ctx.lineTo(O.x,O.y-vy*kF);ctx.stroke();ctx.setLineDash([]);
  arrow(O.x,O.y,vx*kF*pp,0,C_X,'',2.3);arrow(O.x,O.y,0,-vy*kF*pp,VIOLET,'',2.3);}
function drawBlockRot(P,angle,lab){ctx.save();ctx.translate(P.x,P.y);ctx.rotate(angle);
  ctx.fillStyle='#eef4fb';ctx.strokeStyle='#185fa5';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-14,-28,28,28,5);ctx.fill();ctx.stroke();ctx.restore();
  ctx.fillStyle='#185fa5';ctx.font='600 11px Mulish,system-ui,sans-serif';ctx.textAlign='center';ctx.fillText(lab,P.x,P.y-13);}

// ================= LES EXERCICES =================

function sinCurve(x0,y0,w2,amp,k,ph,col,lw){ctx.strokeStyle=col;ctx.lineWidth=lw||2.3;ctx.beginPath();for(var i=0;i<=w2;i+=2){var y=y0-amp*Math.sin(k*i-ph);i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.stroke();}
function gv(id,d){var e=document.getElementById(id);return e?parseFloat(e.value):d;}
function P3(x,y,z,cx,cy,s){var ca=Math.cos(ORB.a),sa=Math.sin(ORB.a),cb=Math.cos(ORB.b),sb=Math.sin(ORB.b);
 var u=x*ca-y*sa,v=x*sa+y*ca;return {x:cx+s*u,y:cy-s*(z*cb+v*sb)};}
function pivotTri(x,y){ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(x-15,y+24);ctx.lineTo(x+15,y+24);ctx.lineTo(x,y);ctx.closePath();ctx.fill();}
function chg(x,y,r,sg){DOT(x,y,r,sg>0?'#fcebeb':'#e6f1fb');ctx.strokeStyle=sg>0?RED:BLUE;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();TB(sg>0?'+':'\u2212',x,y+r*.4,sg>0?DRED:BLUE_D,Math.round(r*1.15));}
function xfield(x0,y0,x1,y1,st){ctx.strokeStyle='#b7bdc4';ctx.lineWidth=1.4;for(var x=x0;x<=x1;x+=st)for(var y=y0;y<=y1;y+=st){ctx.beginPath();ctx.moveTo(x-4,y-4);ctx.lineTo(x+4,y+4);ctx.moveTo(x+4,y-4);ctx.lineTo(x-4,y+4);ctx.stroke();}}

/* --- aides : quantité de mouvement, produits de vecteurs, solutions pas à pas ---
   solT(e) : secondes écoulées depuis « Voir la solution » (−1 avant, et dans les vignettes)
   stA(k,i) : opacité de l’étape i (une étape toutes les 1,1 s) ; stx : ligne de texte d’une étape */
function solT(e){if(ctx!==cxE)return -1;if(!reveal){e._k=0;return -1;}e._k=(e._k||0)+1;return e._k/60;}
function stA(k,i){return Math.max(0,Math.min(1,(k-i*1.1)/.45));}
function stx(k,i,txt,col,y,x){var a=stA(k,i);if(a<=0)return;ctx.globalAlpha=a;TB(txt,x||W*.04,y,dk(col||INK),W<520?11:13,'left');ctx.globalAlpha=1;}
function panel(y){ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(0,y,W,H-y);}
var VIO_D='#5249B5';
function dk(c){return c===BLUE?BLUE_D:c===RED?DRED:c===GREEN?DGREEN:c===VIOLET?VIO_D:c;}
function wag(x,gy,w,h,col,lab){var y=gy-11-h/2;ctx.fillStyle=col+'22';ctx.strokeStyle=col;ctx.lineWidth=2.3;ctx.beginPath();ctx.roundRect(x-w/2,y-h/2,w,h,5);ctx.fill();ctx.stroke();
 DOT(x-w*.3,gy-6,6,'#555');DOT(x+w*.3,gy-6,6,'#555');if(lab)TB(lab,x,y+4,dk(col),11);}
function pers(x,gy,h,col,dir,lab,al){var r=h*.12,hy=gy-h+r,b=hy+r+3;ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.fillStyle=col+'2a';
 ctx.beginPath();ctx.arc(x,hy,r,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.roundRect(x-h*.13,b,h*.26,h*.4,6);ctx.fill();ctx.stroke();
 LN(x-h*.06,b+h*.4,x-h*.12,gy,col,2.6);LN(x+h*.06,b+h*.4,x+h*.12,gy,col,2.6);LN(x+dir*h*.1,b+h*.1,x+dir*h*.3,b+h*.14,col,2.6);
 if(lab)TB(lab,x+(al==='right'?8:al==='left'?-8:0),gy+16,dk(col),11,al);}
function zsym(x,y,r,col,out){ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke();
 if(out)DOT(x,y,Math.max(2,r*.28),col);else{var q=r*.6;LN(x-q,y-q,x+q,y+q,col,2.2);LN(x+q,y-q,x-q,y+q,col,2.2);}}
function rmark(P,u,v,s,col){ctx.strokeStyle=col||GREY;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(P.x+u.x*s,P.y+u.y*s);ctx.lineTo(P.x+u.x*s+v.x*s,P.y+u.y*s+v.y*s);ctx.lineTo(P.x+v.x*s,P.y+v.y*s);ctx.stroke();}
function grid(O,k,x0,x1,y0,y1){ctx.strokeStyle='#eceef1';ctx.lineWidth=1;
 for(var i=x0;i<=x1;i++){ctx.beginPath();ctx.moveTo(O.x+i*k,O.y-y0*k);ctx.lineTo(O.x+i*k,O.y-y1*k);ctx.stroke();}
 for(var j=y0;j<=y1;j++){ctx.beginPath();ctx.moveTo(O.x+x0*k,O.y-j*k);ctx.lineTo(O.x+x1*k,O.y-j*k);ctx.stroke();}
 LN(O.x+x0*k-6,O.y,O.x+x1*k+10,O.y,AX,1.4);LN(O.x,O.y-y0*k+6,O.x,O.y-y1*k-10,AX,1.4);
 T('x',O.x+x1*k+16,O.y+4,GREY,11);T('y',O.x-10,O.y-y1*k-8,GREY,11);}
function nfmt(v){return String(v).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,' ');}
function fgraph(gx,gb,gw,gh,tmax,Fmax,tt,ft){LN(gx,gb,gx+gw+8,gb,AX,1.4);LN(gx,gb+5,gx,gb-gh-10,AX,1.4);ctx.fillStyle=AX;
 ctx.beginPath();ctx.moveTo(gx+gw+13,gb);ctx.lineTo(gx+gw+5,gb-4);ctx.lineTo(gx+gw+5,gb+4);ctx.fill();
 ctx.beginPath();ctx.moveTo(gx,gb-gh-15);ctx.lineTo(gx-4,gb-gh-7);ctx.lineTo(gx+4,gb-gh-7);ctx.fill();
 TB('F (N)',gx+9,gb-gh-8,GREY,11,'left');TB('t (ms)',gx+gw+10,gb-8,GREY,11,'right');
 tt.forEach(function(v){var x=gx+v/tmax*gw;LN(x,gb,x,gb+4,GREY,1);T(nfmt(v),x,gb+15,GREY,10);});
 ft.forEach(function(v){var y=gb-v/Fmax*gh;LN(gx-4,y,gx,y,GREY,1);T(nfmt(v),gx-6,y+4,GREY,10,'right');});
 return {x:function(t){return gx+t/tmax*gw;},y:function(F){return gb-F/Fmax*gh;}};}
function hrow(x,y,v,kp,col,lab,ly){/* flèche horizontale de quantité de mouvement, étiquette au-dessus */
 if(Math.abs(v)>1e-9)A(x,y,v*kp,0,col,'',3);if(lab)TB(lab,x+v*kp/2,y-(ly||9),dk(col),11);}

/* --- exercices portés de la page « exercices-moment » : aides en portée locale
   (arrow y diffère d'un seuil de celle du moteur ; pivot/foot/rot/cle restent privées) --- */
