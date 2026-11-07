/* Chapitre 9 · Pression */
(function(){
/* aides de dessin communes à ce chapitre (nov. 2026) : palette SFA, fond, composants de circuit, tracés animés */
var D = SFA.draw, P = D.palette, T = D.text, F = SFA.fmt, PI2 = 6.2832, G = 9.81;
var BG = "#f6f8fc", WC = "#34445c";
function rect(c,x,y,w,h,fill,stroke,lw,r){ var g=c.ctx; g.save(); g.beginPath(); if(g.roundRect&&r) g.roundRect(x,y,w,h,r); else g.rect(x,y,w,h); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.5;g.stroke();} g.restore(); }
function circ(c,x,y,r,fill,stroke,lw){ var g=c.ctx; g.beginPath(); g.arc(x,y,r,0,PI2); if(fill){g.fillStyle=fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke();} }
function ln(c,a,b,col,w,dash){ D.line(c,a[0],a[1],b[0],b[1],col||WC,w||3,dash); }
/* canvas à hauteur proportionnelle : rd (grand écran), rm (téléphone) */
function mkc(k,rd,rm){ var c=k.canvas(300), b=c.resize; c.resize=function(){ c.ratio=(c.cv.parentNode&&c.cv.parentNode.clientWidth<500)?(rm||rd):rd; b(); }; c.resize(); return c; }
function paper(c,top,bot){ var g=c.ctx; if(top){ var gr=g.createLinearGradient(0,0,0,c.H); gr.addColorStop(0,top); gr.addColorStop(1,bot||top); g.fillStyle=gr; } else g.fillStyle=BG; g.fillRect(0,0,c.W,c.H); }
function fs(c){ return c.W<430?11.5:12.5; }
function lab(c,s,x,y,col,o){ o=o||{}; o.color=col||P.ink; o.size=o.size||fs(c); T(c,s,x,y,o); }
function chip(c,s,x,y,col,o){ o=o||{}; o.color=col||P.ink; o.size=o.size||fs(c); D.label(c,s,x,y,o); }
/* fil (polyligne) et déplacement le long d'un chemin */
function wire(c,pts,col,w){ var g=c.ctx; g.save(); g.strokeStyle=col||WC; g.lineWidth=w||3; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); pts.forEach(function(p,i){ if(i) g.lineTo(p[0],p[1]); else g.moveTo(p[0],p[1]); }); g.stroke(); g.restore(); }
function plen(pts){ var s=0; for(var i=1;i<pts.length;i++) s+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); return s; }
function ppos(pts,s){ for(var i=1;i<pts.length;i++){ var dx=pts[i][0]-pts[i-1][0],dy=pts[i][1]-pts[i-1][1],l=Math.hypot(dx,dy)||1e-6; if(s<=l||i===pts.length-1){ var u=Math.min(1,s/l); return [pts[i-1][0]+dx*u,pts[i-1][1]+dy*u,Math.atan2(dy,dx)]; } s-=l; } return [pts[0][0],pts[0][1],0]; }
function flow(c,pts,ph,n,col,r){ var L=plen(pts); for(var i=0;i<n;i++){ var u=(((i/n+ph)%1)+1)%1, p=ppos(pts,u*L); circ(c,p[0],p[1],r||3,col); } }
/* lampe (symbole normalisé) : b = éclat 0..1,3 */
function lamp(c,x,y,r,b,burn){ b=Math.max(0,Math.min(b||0,1.4)); var g=c.ctx, a=Math.min(1,b);
  if(b>0.03) D.glow(c,x,y,r*(2+b*1.6),"#ffc933",Math.min(0.9,0.2+0.5*b));
  var gr=g.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r); gr.addColorStop(0,"rgb(255,"+Math.round(255-4*a)+","+Math.round(255-95*a)+")"); gr.addColorStop(1,"rgb("+Math.round(236+19*a)+","+Math.round(240-34*a)+","+Math.round(246-150*a)+")");
  circ(c,x,y,r,gr,burn?P.red:"#26364d",2.2);
  g.save(); g.strokeStyle=burn?P.red:"#26364d"; g.lineWidth=1.8; g.lineCap="round"; var d=r*0.68; g.beginPath(); g.moveTo(x-d,y-d); g.lineTo(x+d,y+d); g.moveTo(x+d,y-d); g.lineTo(x-d,y+d); g.stroke(); g.restore(); }
/* pile : le trait long (+) est du côté de l'angle 0 ; ang tourne le symbole */
function pile(c,x,y,ang,show){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang||0); rect(c,-16,-22,32,44,BG);
  g.strokeStyle=WC; g.lineCap="round"; g.lineWidth=2.6; g.beginPath(); g.moveTo(5,-16); g.lineTo(5,16); g.stroke();
  g.lineWidth=6; g.beginPath(); g.moveTo(-5,-9); g.lineTo(-5,9); g.stroke(); g.lineWidth=3; g.beginPath(); g.moveTo(-26,0); g.lineTo(-5,0); g.moveTo(5,0); g.lineTo(26,0); g.stroke(); g.restore();
  var ca=Math.cos(ang||0), sa=Math.sin(ang||0); if(show!==false) T(c,"+",x+ca*14+sa*14,y+sa*14-ca*14,{size:14,color:P.red}); }
function meter(c,x,y,sym,col,r){ circ(c,x,y,r||16,"#fff",col||P.ink,2.6); T(c,sym,x,y+1,{size:(r||16)*0.95,color:col||P.ink}); }
/* interrupteur horizontal centré en (x,y) */
function sw(c,x,y,closed,w){ w=w||44; rect(c,x-w/2,y-12,w,24,BG); ln(c,[x-w/2,y],[x-w*0.3,y]); ln(c,[x+w*0.3,y],[x+w/2,y]);
  if(closed) ln(c,[x-w*0.3,y],[x+w*0.3,y]); else ln(c,[x-w*0.3,y],[x+w*0.22,y-w*0.3]); circ(c,x-w*0.3,y,3.4,"#fff",WC,2); circ(c,x+w*0.3,y,3.4,"#fff",WC,2); }
function resis(c,x,y,w,txt,col){ rect(c,x-w/2,y-9,w,18,"#fff",col||WC,2.4,3); if(txt) T(c,txt,x,y+1,{size:11.5,color:col||WC}); }
/* appareil de mesure rectangulaire (afficheur) */
function lcd(c,s,x,y,w,h,col,cap){ D.display(c,s,x,y,{w:w,h:h,color:col||"#13233a",caption:cap}); }
function bar(c,x,y,w,h,u,col,bg){ rect(c,x,y,w,h,bg||"#e4e9f1",null,0,h/2); if(u>0) rect(c,x,y,Math.max(h,w*Math.min(1,u)),h,col||P.acc,null,0,h/2); }
function at(c,x,y,ang,fn){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); fn(); g.restore(); }
function rectPath(x0,y0,x1,y1){ return [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]]; }
function arrowAt(c,x,y,ang,col,sz){ var g=c.ctx; g.save(); g.translate(x,y); g.rotate(ang); g.fillStyle=col||P.ink; g.beginPath(); g.moveTo(sz||9,0); g.lineTo(-(sz||9)*0.6,-(sz||9)*0.62); g.lineTo(-(sz||9)*0.6,(sz||9)*0.62); g.closePath(); g.fill(); g.restore(); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function SIM(id,fn){ var m=META[id]; if(!m) throw new Error("meta "+id); m.build=fn; SFA.sim(m); }
/* flèche de force : de (x,y) vers (x2,y2), avec étiquette */
function fArrow(c,x,y,x2,y2,col,txt,o){ o=o||{}; if(Math.hypot(x2-x,y2-y)<3) return; D.arrow(c,x,y,x2,y2,col,o.w||3.4); if(txt){ var a=Math.atan2(y2-y,x2-x); chip(c,txt,x2+Math.cos(a)*(o.dx==null?16:o.dx),y2+Math.sin(a)*(o.dy==null?12:o.dy),col,{size:o.size}); } }
function grad(c,x,y,w,h,a,b){ var g=c.ctx, gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,a); gr.addColorStop(1,b); g.fillStyle=gr; g.fillRect(x,y,w,h); }
function spring(c,x,y0,y1,n,amp,col,lw){ var g=c.ctx; g.save(); g.strokeStyle=col||"#5d6b82"; g.lineWidth=lw||2.4; g.lineJoin="round"; g.lineCap="round"; g.beginPath(); g.moveTo(x,y0); var s=y1-y0; g.lineTo(x,y0+s*0.08);
  for(var i=0;i<n*2;i++){ var t=0.08+0.84*(i+0.5)/(n*2); g.lineTo(x+(i%2?-amp:amp),y0+s*t); } g.lineTo(x,y0+s*0.92); g.lineTo(x,y1); g.stroke(); g.restore(); }

var META={};
META["p3-c09-brique"]={
  id:"p3-c09-brique", ch:"c09", tag:"Classique",
  titre:"Brique sur le sable : force, surface, pression",
  resume:"Pose une brique sur sa grande ou sa petite face : la force est la même, l'enfoncement non.",
  but:"Change la face de contact, la masse et le nombre de briques empilées. Compare la force, la surface et la pression, et l'enfoncement dans le sable.",
  aRetenir:"La pression est la force pressante par unité de surface : p = F / S. Avec F en newtons et S en m², p est en pascals (1 Pa = 1 N/m²). À force égale, plus la surface est petite, plus la pression est grande : on s'enfonce avec des talons aiguilles, pas avec des skis.",
  piege:"Le poids de la brique est le même, quelle que soit la face posée : ce n'est pas la force qui change, mais la surface sur laquelle elle se répartit. 1 cm² = 0,0001 m² (pas 0,01 m²)."};
META["p3-c09-liquide"]={
  id:"p3-c09-liquide", ch:"c09", tag:"Interaction",
  titre:"Pression dans un liquide : profondeur et jets",
  resume:"Plonge une sonde dans un bidon percé : la pression augmente avec la profondeur, pas avec la forme.",
  but:"Descends la sonde de pression. Compare les liquides. Observe la portée des trois jets du bidon percé.",
  aRetenir:"Dans un liquide au repos, la pression augmente avec la profondeur h et avec la masse volumique ρ du liquide : Δp = ρ·g·h. Elle s'exerce dans toutes les directions et ne dépend pas de la forme du récipient. La pression totale s'obtient en ajoutant la pression atmosphérique.",
  piege:"La pression ne dépend ni de la quantité de liquide, ni de la largeur du récipient, seulement de la profondeur. Les jets ont la même portée quel que soit le liquide : leur vitesse ne dépend que de la profondeur du trou."};
META["p3-c09-presse"]={
  id:"p3-c09-presse", ch:"c09", tag:"Pascal",
  titre:"La presse hydraulique : multiplier une force",
  resume:"Un petit piston que l'on pousse, un grand piston qui soulève : la force est multipliée, la course divisée.",
  but:"Règle les surfaces des pistons et la force sur le petit piston. Observe la force sur le grand piston, puis enfonce le petit piston d'une distance donnée.",
  aRetenir:"Principe de Pascal : une pression exercée sur un liquide enfermé se transmet intégralement dans tout le liquide. Donc F₁/S₁ = F₂/S₂, soit F₂ = F₁·S₂/S₁. Mais le liquide est incompressible : le grand piston monte moins que le petit ne descend, d₂ = d₁·S₁/S₂ : le travail reste le même (F₁d₁ = F₂d₂).",
  piege:"La presse ne « crée » pas d'énergie : on gagne en force mais on perd en distance. Modèle idéal (sans frottement ni fuite)."};
META["p3-c09-atmosphere"]={
  id:"p3-c09-atmosphere", ch:"c09", tag:"Expérience",
  titre:"Le baromètre de Torricelli et l'altitude",
  resume:"Monte en altitude : la colonne de mercure descend. Avec de l'eau, il faudrait un tube de plus de 10 m !",
  but:"Règle l'altitude et la pression au niveau de la mer (météo). Lis la hauteur de la colonne de mercure ou d'eau.",
  aRetenir:"L'air a un poids : il exerce une pression, environ 101 300 Pa (1 013 hPa) au niveau de la mer. Ce n'est pas le vide qui « aspire » le mercure : la pression de l'air sur la cuvette pousse le liquide dans le tube, jusqu'à ce que ρ·g·h équilibre la pression atmosphérique : 760 mm de mercure ou 10,3 m d'eau. La pression diminue avec l'altitude.",
  piege:"1 013 hPa, ce sont environ 10 tonnes sur chaque m² ! On ne les sent pas car la pression s'exerce dans toutes les directions et de l'intérieur de notre corps. (Pression de l'air calculée avec un modèle d'atmosphère standard.)"};
function fp(p){ return p>=1e5 ? F(p/1e3,0)+" kPa" : p>=1e3 ? F(p/1e3,2)+" kPa" : F(p,0)+" Pa"; }
function sandGrains(c,x0,y0,x1,y1,n,seed){ var g=c.ctx; g.save(); for(var i=0;i<n;i++){ var a=Math.sin(seed*17+i*12.9898)*43758.5453; a-=Math.floor(a); var b=Math.sin(seed*31+i*78.233)*12345.678; b-=Math.floor(b); g.fillStyle=(i%3?"rgba(176,140,80,.35)":"rgba(255,245,220,.5)"); g.fillRect(x0+a*(x1-x0),y0+b*(y1-y0),2,2); } g.restore(); }

/* ---------- 1 · Brique sur le sable ---------- */
var FACES=[["200","Grande face (20 × 10 cm = 200 cm²)"],["100","Face moyenne (20 × 5 cm = 100 cm²)"],["50","Petite face (10 × 5 cm = 50 cm²)"]];
SIM("p3-c09-brique", function(k,S){
  var c = mkc(k,1.0,1.15);
  var face = k.select("Face posée sur le sable",FACES,"200");
  var mb = k.slider("Masse d'une brique",1,3,0.5,2,"kg");
  var nb = k.slider("Nombre de briques empilées",1,4,1,1,"");
  var ro = k.readouts(["Force F = poids","Surface S","Pression (force ÷ surface)","Enfoncement"]);
  var nt = k.note("","");
  var cur=0, lp=k.loop(function(dt){ var Fn=mb.value*nb.value*G, p=Fn/(+face.value*1e-4), tgt=30*(1-Math.exp(-p/5000)); cur+=(tgt-cur)*Math.min(1,dt*5); k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down"){ var order=["200","100","50"], i=order.indexOf(face.value); face.set(order[(i+1)%3]); cur=0; k.redraw(); } });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, Fn=mb.value*nb.value*G, Sm=+face.value*1e-4, p=Fn/Sm, tgt=30*(1-Math.exp(-p/5000)), dep=cur;
    var fc=+face.value, gy=H*0.62, cx=W*0.42, u=Math.min(6.5,(gy-70)/((fc===200?5:fc===100?10:20)*nb.value),(W*0.55)/(fc===50?10:20));
    var bw=(fc===50?10:20)*u, bh=(fc===200?5:fc===100?10:20)*u, dpx=dep*2.2;
    grad(c,0,gy,W,H-gy,"#ead9ae","#cfb77a"); sandGrains(c,0,gy,W,H,160,2);
    g.fillStyle="#d3bb84"; g.beginPath(); g.moveTo(cx-bw/2-14,gy); g.quadraticCurveTo(cx-bw/2-2,gy+dpx*0.2,cx-bw/2,gy+dpx); g.lineTo(cx+bw/2,gy+dpx); g.quadraticCurveTo(cx+bw/2+2,gy+dpx*0.2,cx+bw/2+14,gy); g.closePath(); g.fill();
    for(var i=0;i<nb.value;i++){ var yy=gy+dpx-bh*(i+1); rect(c,cx-bw/2,yy,bw,bh,"#c9552b","#7a2d12",2,3); ln(c,[cx-bw/2+4,yy+bh*0.35],[cx+bw/2-4,yy+bh*0.35],"rgba(255,255,255,.18)",2); }
    lab(c,F(mb.value*nb.value,1)+" kg",cx,gy+dpx-bh*nb.value/2,"#fff",{size:f,bg:false});
    /* pression sous la brique : flèches serrées */
    var na=Math.max(2,Math.round(bw/9)), ap=clamp(p/9000,0.25,1)*28; for(i=0;i<na;i++){ var ax2=cx-bw/2+(i+0.5)*bw/na; D.arrow(c,ax2,gy+dpx+4+ap,ax2,gy+dpx+4,P.red,2); }
    var topY=gy+dpx-bh*nb.value; var fx=Math.max(48,cx-bw/2-26); fArrow(c,fx,topY-44,fx,topY+4,P.red,"",{}); chip(c,"F = "+F(Fn,0)+" N",fx+8,topY-54,P.red,{size:f-1,align:"left"});
    D.line(c,6,gy,W-6,gy,"#8a7a4a",1.5,[5,4]);
    /* règle d'enfoncement */
    var rx=W-34; ln(c,[rx,gy],[rx,gy+30*2.2],"#6b5a2e",2); for(var d=0;d<=30;d+=10){ ln(c,[rx-6,gy+d*2.2],[rx+6,gy+d*2.2],"#6b5a2e",2); lab(c,d+"",rx+10,gy+d*2.2,"#6b5a2e",{size:f-2.5,align:"left",bg:false}); } circ(c,rx,gy+dpx,5,P.red,"#fff",1.5); chip(c,"mm",rx,gy-12,"#6b5a2e",{size:f-2.5});
    chip(c,"Enfoncement : "+F(dep,0)+" mm",W/2,H-14,"#6b5a2e",{size:f});
    chip(c,"clique la brique : change de face",W/2,16,P.grey,{size:f-2});
    ro.set(0,F(Fn,1)+" N"); ro.set(1,F(Sm*1e4,0)+" cm² = "+F(Sm,4)+" m²"); ro.set(2,fp(p)); ro.set(3,F(tgt,0)+" mm");
    nt.set("p = "+F(Fn,1)+" N / "+F(Sm,4)+" m² = <b>"+fp(p)+"</b>. "+(fc===200?"Essaie la petite face : même force, surface 4 fois plus petite.":"Par rapport à la grande face (200 cm²), la surface est "+F(200/fc,0)+" fois plus petite : la pression est "+F(200/fc,0)+" fois plus grande. Enfoncement : ordre de grandeur qualitatif."),"ok");
  });
});

/* ---------- 2 · Pression dans un liquide ---------- */
var LIQ=[["1000","Eau douce (1 000 kg/m³)"],["1030","Eau de mer (1 030 kg/m³)"],["920","Huile d'olive (920 kg/m³)"],["13600","Mercure (13 600 kg/m³)"]];
SIM("p3-c09-liquide", function(k,S){
  var c = mkc(k,1.05,1.2);
  var lq = k.select("Liquide",LIQ,"1000");
  var h = k.slider("Profondeur de la sonde",0,40,1,20,"cm");
  var ro = k.readouts(["Pression due au liquide","Pression totale (avec l'air)","Pression en plus à 5 m de profondeur"]);
  var nt = k.note("","");
  var ph=0, geo={}, drag=false, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down") drag=Math.abs(p.x-geo.sx)<44&&p.y>geo.by-30; if((ty==="down"||ty==="drag")&&drag){ h.set(Math.round(clamp((p.y-geo.by)/geo.sc,0,40))); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, rho=+lq.value, hm=h.value/100, dp=rho*G*hm, pt=101325+dp;
    var Dc=40, bx=W*0.05, bw=W*0.4, sc=Math.min(5.6,(H-96)/Dc), gy=H-34, by=gy-Dc*sc; geo={sx:bx+bw*0.5,by:by,sc:sc};
    var cl=rho>5000?["#cfd5de","#9aa5b5"]:rho<950?["#f6e58a","#e4c850"]:rho>1020?["#9cc0ee","#4b7fc4"]:["#b4d6f8","#4f8fd8"];
    var gr=g.createLinearGradient(0,by,0,gy); gr.addColorStop(0,cl[0]); gr.addColorStop(1,cl[1]); g.fillStyle=gr; g.fillRect(bx,by,bw,Dc*sc);
    ln(c,[bx,by-10],[bx,gy],P.ink,3); ln(c,[bx+bw,by-10],[bx+bw,gy],P.ink,3); ln(c,[bx,gy],[bx+bw,gy],P.ink,3); chip(c,"niveau "+Dc+" cm",bx+bw/2,by-16,P.grey,{size:f-2});
    rect(c,0,gy,W,H-gy,"#d9c9a6"); ln(c,[0,gy],[W,gy],"#8a6d3b",3);
    /* jets */
    [5,15,30].forEach(function(hh){ var yy=by+hh*sc; circ(c,bx+bw,yy,3.4,P.ink); var xr=2*Math.sqrt(hh*(Dc-hh));
      g.save(); g.strokeStyle=cl[1]; g.lineWidth=3; g.lineCap="round"; g.beginPath(); g.moveTo(bx+bw,yy); for(var s=0;s<=xr+0.01;s+=0.5){ g.lineTo(bx+bw+s*sc*0.8,yy+s*s/(4*hh)*sc); } g.stroke(); g.restore();
      for(var i=0;i<4;i++){ var s2=((i/4+ph*0.7)%1)*xr; circ(c,bx+bw+s2*sc*0.8,yy+s2*s2/(4*hh)*sc,2.4,"rgba(255,255,255,.85)"); }
      chip(c,F(xr,0)+" cm",bx+bw+xr*sc*0.8-2,gy+(hh===15?-16:-4),P.acc,{size:f-2.5,align:"right"}); lab(c,hh+" cm",bx+bw+8,yy-8,P.grey,{size:f-3,align:"left",bg:false}); });
    chip(c,"portées",W-8,H-6,P.grey,{size:f-3,align:"right"});
    /* sonde (glissable) */
    var sx=bx+bw*0.45, py=by+h.value*sc; ln(c,[sx,by-24],[sx,py],P.ink,2.5); circ(c,sx,py,10,"#fff",P.red,3.4);
    var L=Math.min(30,6+dp/1500*30); [[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]].forEach(function(d){ D.arrow(c,sx+d[0]*13,py+d[1]*13,sx+d[0]*(13+L),py+d[1]*(13+L),P.red,2); });
    chip(c,"h = "+h.value+" cm",sx+34,py-16,P.red,{size:f-1,align:"left"});
    /* manomètre */
    D.display(c,fp(dp),W*0.76,32,{w:Math.min(120,W*0.34),h:46,caption:"MANOMÈTRE"});
    chip(c,"tire la sonde ↕",bx+bw/2,gy-8,P.ink,{size:f-2.5});
    ro.set(0,fp(dp)); ro.set(1,fp(pt)); ro.set(2,fp(rho*G*5));
    nt.set("Δp = ρ·g·h = "+F(rho,0)+" × 9,81 × "+F(hm,2)+" = <b>"+fp(dp)+"</b>. "+(rho>5000?"Le mercure est 13,6 fois plus dense que l'eau : même profondeur, pression 13,6 fois plus grande. ":"")+"La pression s'exerce dans toutes les directions et ne dépend que de la profondeur. Les trois jets ont la même portée quel que soit le liquide.","ok");
  });
});

/* ---------- 3 · Presse hydraulique ---------- */
SIM("p3-c09-presse", function(k,S){
  var c = mkc(k,0.95,1.2);
  var s1 = k.slider("Surface du petit piston S₁",1,10,1,2,"cm²");
  var s2 = k.slider("Surface du grand piston S₂",10,200,10,100,"cm²");
  var f1 = k.slider("Force sur le petit piston F₁",10,200,10,100,"N");
  var d1 = k.slider("Enfoncement du petit piston d₁",0,20,1,10,"cm");
  var mc = k.slider("Masse à soulever",100,3000,100,300,"kg");
  var ro = k.readouts(["Pression dans le liquide","Force sur le grand piston","Montée du grand piston","Travail du petit puis du grand piston"]);
  var nt = k.note("","");
  var geo={}, drag=false;
  c.pointer(function(ty,p){ if(ty==="down") drag=Math.abs(p.x-geo.x1)<geo.w1+20&&p.y<geo.base+60; if((ty==="down"||ty==="drag")&&drag){ d1.set(Math.round(clamp((p.y-geo.y0)/geo.k,0,20))); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    var p=f1.value/(s1.value*1e-4), F2=f1.value*s2.value/s1.value, d2=d1.value*s1.value/s2.value, W1=f1.value*d1.value/100, W2=F2*d2/100, lifts=F2>=mc.value*G;
    var w1=16+s1.value*4, w2=22+Math.sqrt(s2.value)*9, gy=H-48, x1=Math.max(w1/2+14,W*0.24), x2=W*0.7, base=H*0.5, kk=3.2*(H/330), a=d1.value*kk, b=d2*kk;
    geo={x1:x1,w1:w1,base:base,y0:base-10,k:kk};
    /* canalisation en U */
    var liq="rgba(79,143,216,.55)"; g.fillStyle=liq; g.fillRect(x1-w1/2,base+a,w1,gy-base-a); g.fillRect(x2-w2/2,base-b,w2,gy-base+b); g.fillRect(x1-w1/2,gy-26,x2-x1+w2/2+w1/2,26);
    g.strokeStyle=P.ink; g.lineWidth=3; g.lineJoin="round"; g.beginPath(); g.moveTo(x1-w1/2,base-40); g.lineTo(x1-w1/2,gy); g.lineTo(x2-w2/2-0,gy); g.lineTo(x2-w2/2,base-70); g.moveTo(x1+w1/2,base-40); g.lineTo(x1+w1/2,gy-26); g.lineTo(x2+w2/2-w2,gy-26); g.stroke();
    g.beginPath(); g.moveTo(x2+w2/2,base-70); g.lineTo(x2+w2/2,gy); g.lineTo(x2-w2/2,gy); g.stroke(); g.beginPath(); g.moveTo(x1+w1/2,gy-26); g.lineTo(x2-w2/2,gy-26); g.stroke();
    rect(c,x1-w1/2-3,base+a-9,w1+6,9,"#8a95a3",P.ink,1.8,2); ln(c,[x1,base+a-9],[x1,base+a-34],P.ink,4);
    rect(c,x2-w2/2-3,base-b-9,w2+6,9,"#8a95a3",P.ink,1.8,2);
    fArrow(c,x1,base+a-82,x1,base+a-38,P.red,"",{}); chip(c,"F₁ = "+F(f1.value,0)+" N",x1+6,base+a-96,P.red,{size:f-1.5,align:"left"});
    var mw=Math.min(w2*0.95,30+Math.sqrt(mc.value)*1.3), mh=30+Math.sqrt(mc.value)*0.6; rect(c,x2-mw/2,base-b-9-mh,mw,mh,lifts?"#a5d2ab":"#e0aaa4",P.ink,2.4,5); lab(c,F(mc.value,0)+" kg",x2,base-b-9-mh/2,P.ink,{size:f-1,bg:false});
    fArrow(c,x2+w2/2+14,base-b-30,x2+w2/2+14,base-b-30-Math.min(70,F2/60),P.green,"",{});
    chip(c,"F₂ = "+F(F2,0)+" N",clamp(x2,50,W-50),Math.max(18,base-b-9-mh-Math.min(70,F2/60)-14),P.green,{size:f-1});
    chip(c,"S₁ = "+F(s1.value,0)+" cm²",x1,gy+22,P.grey,{size:f-2}); chip(c,"S₂ = "+F(s2.value,0)+" cm²",x2,gy+22,P.grey,{size:f-2});
    chip(c,"p = "+fp(p),(x1+x2)/2,gy-9,P.acc,{size:f-1.5});
    chip(c,"tire le petit piston ↕",x1,16,P.grey,{size:f-2});
    ro.set(0,fp(p)); ro.set(1,F(F2,0)+" N"); ro.set(2,F(d2,2)+" cm"); ro.set(3,F(W1,1)+" J = "+F(W2,1)+" J");
    nt.set("F₂ = F₁ × S₂/S₁ = "+F(f1.value,0)+" × "+F(s2.value/s1.value,0)+" = <b>"+F(F2,0)+" N</b>. Poids de la charge : "+F(mc.value*G,0)+" N : "+(lifts?"la charge est soulevée. Mais pour la monter de "+F(d2,2)+" cm, il faut descendre le petit piston de "+F(d1.value,0)+" cm : le travail est conservé.":"la force est insuffisante, elle ne bouge pas. Pour monter de 1 cm, il faudrait descendre le petit piston de "+F(s2.value/s1.value,0)+" cm."),lifts?"ok":"warn");
  });
});

/* ---------- 4 · Torricelli ---------- */
function patm(p0,h){ return p0*Math.pow(1-2.25577e-5*h,5.25588); }
SIM("p3-c09-atmosphere", function(k,S){
  var c = mkc(k,1.0,1.2);
  var alt = k.slider("Altitude",0,9000,100,0,"m");
  var p0 = k.slider("Pression au niveau de la mer (météo)",980,1040,1,1013,"hPa");
  var lq = k.seg("Liquide du baromètre",[["13595","Mercure"],["1000","Eau"]],"13595");
  var ro = k.readouts(["Pression atmosphérique","Hauteur de la colonne","Force de l'air sur 1 dm²"]);
  var nt = k.note("","");
  k.button("Botrange (≈ 700 m)",function(){ alt.set(700); }); k.button("Mont Blanc (≈ 4 800 m)",function(){ alt.set(4800); }); k.button("Everest (≈ 8 800 m)",function(){ alt.set(8800); });
  var geo={}, drag=false, ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty==="down") drag=p.x>c.W*0.5; if((ty==="down"||ty==="drag")&&drag){ alt.set(Math.round(clamp((geo.y1-p.y)/(geo.y1-geo.y0),0,1)*9000/100)*100); k.redraw(); } if(ty==="up") drag=false; });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx, rho=+lq.value, p=patm(p0.value*100,alt.value), col=p/(rho*9.80665), merc=rho>5000;
    /* montagne à droite : on la gravit en glissant */
    var mx0=W*0.5, y0=36, y1=H-36; geo={y0:y0,y1:y1};
    var sky=g.createLinearGradient(0,0,0,H); sky.addColorStop(0,"#d9ecff"); sky.addColorStop(1,"#f1f7ff"); g.fillStyle=sky; g.fillRect(mx0,0,W-mx0,H);
    g.fillStyle="#7f8aa0"; g.beginPath(); g.moveTo(mx0,y1); g.lineTo(mx0+(W-mx0)*0.55,y0+6); g.lineTo(W,y1); g.closePath(); g.fill(); g.fillStyle="#fff"; g.beginPath(); g.moveTo(mx0+(W-mx0)*0.55,y0+6); g.lineTo(mx0+(W-mx0)*0.43,y0+(y1-y0)*0.2); g.lineTo(mx0+(W-mx0)*0.55,y0+(y1-y0)*0.15); g.lineTo(mx0+(W-mx0)*0.65,y0+(y1-y0)*0.22); g.closePath(); g.fill();
    g.fillStyle="#6c9a5a"; g.fillRect(mx0,y1,W-mx0,H-y1);
    var tt=alt.value/9000, sx0=mx0+(W-mx0)*0.55, ay=y1-(y1-y0-6)*tt, px=mx0+(sx0-mx0)*tt;
    /* densité de l'air : points */
    var dens=p/101325; for(var i=0;i<46;i++){ var xx=mx0+8+((i*57)%(W-mx0-16)), yy=8+((i*89)%(H-16)); if(((i*37)%100)/100<dens*0.8) circ(c,xx,yy,1.5,"rgba(60,90,140,.35)"); }
    circ(c,px,ay,8,"#fff",P.acc,3.2); chip(c,F(alt.value,0)+" m",px+14,ay-4,P.acc,{size:f-1,align:"left"}); geo.px=px; chip(c,"glisse pour monter",(mx0+W)/2,H-10,P.grey,{size:f-3});
    /* baromètre */
    var Hmax=merc?1.0:12, top=26, bot=H-70, scl=(bot-top)/Hmax, cx=W*0.22, tw=Math.min(24,W*0.07), liqc=merc?"#aeb7c4":"#5a9be0";
    rect(c,cx-52,bot,104,34,merc?"rgba(150,160,175,.65)":"rgba(90,160,240,.4)",P.ink,2.4,8);
    rect(c,cx-tw/2,top,tw,bot-top+10,"rgba(255,255,255,.5)",P.ink,2.6,6);
    g.fillStyle=liqc; g.fillRect(cx-tw/2+1.5,bot-col*scl,tw-3,col*scl+10); g.fillStyle="rgba(255,255,255,.5)"; g.fillRect(cx-tw/2+3,bot-col*scl,3,col*scl+6);
    lab(c,"vide",cx,top+Math.max(12,(bot-col*scl-top)/2),P.grey,{size:f-1,bg:false});
    [-34,34].forEach(function(dx){ D.arrow(c,cx+dx,bot-34,cx+dx,bot-6,P.red,2.6); });
    ln(c,[cx+tw/2,bot-col*scl],[cx+tw/2+16,bot-col*scl],P.green,1.6,[4,3]); chip(c,"h = "+(col<2?F(col*1000,0)+" mm":F(col,2)+" m"),cx+tw/2+18,bot-col*scl,P.green,{size:f-1,align:"left"});
    chip(c,F(p/100,0)+" hPa",cx,H-14,P.ink,{size:f-0.5});
    ro.set(0,F(p/100,0)+" hPa"); ro.set(1,col<2?F(col*1000,0)+" mm":F(col,2)+" m"); ro.set(2,F(p*0.01,0)+" N");
    nt.set("p = ρ·g·h : h = "+F(p,0)+" / ("+F(rho,0)+" × 9,81) = <b>"+(col<2?F(col*1000,0)+" mm":F(col,2)+" m")+"</b> de "+(merc?"mercure":"eau")+"."+(lq.value==="1000"?" Un tube de plus de 10 m serait nécessaire : c'est pourquoi on utilise le mercure, 13,6 fois plus dense.":" La colonne est plus basse en altitude : il y a moins d'air au-dessus de toi.")+" (Atmosphère standard.)","ok");
  });
});

})();
