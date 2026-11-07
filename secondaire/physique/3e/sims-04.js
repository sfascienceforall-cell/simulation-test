/* Chapitre 4 · Résistance et loi d'Ohm */
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
function rr(pts){ return pts; }
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
function drag(c,items,hit,onMove,onEnd){ /* gestion simple d'un glisser : items() -> liste de points ; hit(p,item) */ }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
var META_PATCH = {};
function SIM(id,fn){ var m=META[id]; if(!m) throw new Error("meta "+id); m.build=fn; SFA.sim(m); }

var META={};
META["p3-c04-caracteristique"]={
  id:"p3-c04-caracteristique", ch:"c04", tag:"Classique",
  titre:"Caractéristique d'un conducteur ohmique",
  resume:"Mesure plusieurs points (I, U) : ils s'alignent sur une droite dont la pente est la résistance.",
  but:"Choisis une résistance, règle la tension, ajoute des points de mesure. Change de résistance et compare les pentes.",
  aRetenir:"Pour un conducteur ohmique, U = R·I : la caractéristique U = f(I) est une droite passant par l'origine, de pente R (en Ω = V/A). Le rapport U/I est constant, la résistance ne dépend ni de U ni de I.",
  piege:"Si on double la tension, l'intensité double aussi, mais R reste la même. Une résistance plus grande donne une droite plus raide (pente plus forte), pas plus plate.",};
META["p3-c04-fil"]={
  id:"p3-c04-fil", ch:"c04", tag:"Défi",
  titre:"La résistance d'un fil : longueur, section, matériau",
  resume:"Règle le fil pour atteindre une résistance cible. R = ρ·L / S.",
  but:"Fais varier la longueur L, la section S et le matériau. Relève R. Relève ensuite un défi : atteins la résistance demandée à 5 % près.",
  aRetenir:"La résistance d'un fil est proportionnelle à sa longueur, inversement proportionnelle à sa section, et dépend du matériau (résistivité ρ) : R = ρ·L / S. Un fil long et fin résiste beaucoup ; un fil gros et court, très peu.",
  piege:"La résistance diminue quand la section augmente (comme un tuyau plus large). Doubler le diamètre multiplie la section par 4, pas par 2.",};
META["p3-c04-code-couleur"]={
  id:"p3-c04-code-couleur", ch:"c04", tag:"Défi",
  titre:"Lire le code couleur d'une résistance",
  resume:"Choisis les 4 bagues : lis la valeur et la tolérance, ou relève le défi.",
  but:"Choisis la couleur de chaque bague. Les deux premières donnent les chiffres, la troisième le multiplicateur, la quatrième la tolérance. Relève le défi : reproduis la valeur demandée.",
  aRetenir:"Valeur = (chiffre 1, chiffre 2) × multiplicateur. Ex. : marron-noir-rouge = 10 × 100 = 1 000 Ω = 1 kΩ. La tolérance (or = ±5 %) donne l'intervalle dans lequel se trouve la vraie valeur.",
  piege:"La troisième bague n'est pas un chiffre : c'est le nombre de zéros (multiplicateur). Rouge en 3e position = ×100, pas « + 2 ».",};
META["p3-c04-lampe-resistance"]={
  id:"p3-c04-lampe-resistance", ch:"c04", tag:"Comparaison",
  titre:"Résistance ou lampe : qui est ohmique ?",
  resume:"Compare la caractéristique d'une résistance (droite) et celle d'une lampe à filament (courbe).",
  but:"Augmente la tension de 0 à 6 V. Compare les courbes et le rapport U/I de chaque dipôle.",
  aRetenir:"Un dipôle est ohmique si sa caractéristique est une droite passant par l'origine : R constante. Le filament d'une lampe n'est pas ohmique : en chauffant (jusqu'à plus de 2 000 °C), sa résistance augmente, la courbe s'incurve.",
  piege:"Calculer « R = U/I » pour une lampe donne une valeur qui dépend de la tension : ce n'est pas une constante du dipôle. (Modèle simplifié : R passe d'environ 1,2 Ω à froid à 12 Ω sous 6 V.)",};
function fmtR(r){ return r>=1e6 ? F(r/1e6,2)+" MΩ" : r>=1e3 ? F(r/1e3,2)+" kΩ" : F(r,2)+" Ω"; }
/* projection perspective « maison » : rotation lacet (yaw) puis tangage (pitch) */
function rot3(p,ya,pi){ var x=p[0],y=p[1],z=p[2],c=Math.cos(ya),s=Math.sin(ya); var x1=x*c+z*s, z1=-x*s+z*c; var c2=Math.cos(pi),s2=Math.sin(pi); return [x1, y*c2-z1*s2, y*s2+z1*c2]; }
function pr3(p,ya,pi,cx,cy,dist){ var q=rot3(p,ya,pi), f=dist/(dist+q[2]); return [cx+q[0]*f, cy-q[1]*f, q[2], f]; }
function shade(hex,k){ var m=/^#(..)(..)(..)$/.exec(hex); if(!m) return hex; var r=parseInt(m[1],16),g=parseInt(m[2],16),b=parseInt(m[3],16); function a(v){ return Math.max(0,Math.min(255,Math.round(v*k))); } return "rgb("+a(r)+","+a(g)+","+a(b)+")"; }

/* ---------- 1 · Caractéristique d'un conducteur ohmique ---------- */
SIM("p3-c04-caracteristique", function(k,S){
  var c = mkc(k,0.9,1.05);
  var R = k.slider("Résistance du dipôle (ta droite)", 20, 200, 10, 60, "Ω");
  var U = k.slider("Tension appliquée", 0, 12, 0.5, 6, "V");
  var pen = k.toggle("Montrer le triangle de pente", false);
  var ro = k.readouts(["Intensité I","Rapport U / I","Pente de la droite"]);
  var nt = k.note("","");
  var pts = [], cols=[P.acc,P.red,P.green,P.violet,P.amber,P.teal,P.grey,"#8a2a1a"], mystery=null, ax=null;
  function Rtrue(){ return mystery ? mystery : R.value; }
  k.button("Ajouter le point de mesure", function(){ if (U.value>0) pts.push({U:U.value,I:U.value/Rtrue(),R:Rtrue(),m:!!mystery}); }, true);
  k.button("Effacer les points", function(){ pts=[]; });
  k.button("Défi : résistance mystère", function(){ mystery=[30,50,70,90,110,130,150,170][Math.floor(Math.random()*8)]; pts=[]; });
  k.button("Quitter le défi", function(){ mystery=null; pts=[]; });
  c.pointer(function(t,p){ if((t==="down"||t==="drag")&&ax){ var u=Math.round(clamp(ax.iy(p.y),0,12)*2)/2; U.set(u); k.redraw(); } });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c);
    ax = D.axes(c,{x0:0,x1:0.6,y0:0,y1:12,xl:"I (A)",yl:"U (V)",stepX:0.1,stepY:2,l:46,r:14,t:26,b:38});
    var r=R.value, rt=Rtrue();
    D.fn(c,ax,function(i){ return r*i; },mystery?P.violet:P.acc,3);
    pts.forEach(function(p){ var ci=p.m?P.red:cols[Math.round(p.R/10)%cols.length]; circ(c,ax.X(p.I),ax.Y(p.U),5.5,ci,"#fff",1.6); });
    var I=U.value/rt, Il=Math.min(0.6,I);
    var X=ax.X(I), Y=ax.Y(U.value);
    D.line(c,X,Y,X,ax.Y(0),P.red,1.4,[4,3]); D.line(c,X,Y,ax.X(0),Y,P.red,1.4,[4,3]);
    circ(c,X,Y,9,"#fff",P.red,3.4); circ(c,X,Y,3,P.red);
    if (pen.value){ var i1=Math.min(0.3,10.5/r), i0=i1/3, y0=r*i0, y1=r*i1;
      D.line(c,ax.X(i0),ax.Y(y0),ax.X(i1),ax.Y(y0),P.green,2.4); D.line(c,ax.X(i1),ax.Y(y0),ax.X(i1),ax.Y(y1),P.green,2.4);
      chip(c,"ΔI = "+F(i1-i0,2)+" A",ax.X((i0+i1)/2),ax.Y(y0)+16,P.green,{size:f-1}); chip(c,"ΔU = "+F(y1-y0,1)+" V",Math.min(W-50,ax.X(i1)+42),ax.Y((y0+y1)/2),P.green,{size:f-1}); }
    var iL=Math.min(0.55,10.5/r); chip(c,(mystery?"ta droite : ":"")+"R = "+F(r,0)+" Ω",clamp(ax.X(iL)+(W<430?-30:-44),70,W-60),ax.Y(r*iL)-18,mystery?P.violet:P.acc);
    lcd(c,F(U.value,1)+" V",ax.X(0.27),ax.Y(1.6),84,36,"#13233a","tension"); lcd(c,F(I*1000,0)+" mA",ax.X(0.27)+92,ax.Y(1.6),88,36,"#13233a","intensité");
    chip(c,"glisse le point",ax.X(0.5),ax.Y(11.3),P.grey,{size:f-1.5});
    ro.set(0,F(I*1000,0)+" mA"); ro.set(1,U.value>0?(mystery?"?":F(U.value/I,0)+" Ω"):"—"); ro.set(2,F(r,0)+" V/A");
    if (mystery){ var good=Math.abs(r-mystery)<=mystery*0.05 && pts.length>=2;
      nt.set(good?"<b>Réussi !</b> Ta droite (R = "+F(r,0)+" Ω) passe par les points : la résistance mystère vaut "+F(mystery,0)+" Ω.":"<b>Défi :</b> ajoute 2 points de mesure (change la tension), puis règle « Résistance » pour que ta droite passe par les points rouges. R = U / I pour chaque point.",good?"ok":"warn"); }
    else nt.set(pts.length>1?"Tous les points d'une même résistance sont alignés avec l'origine : U/I = "+F(r,0)+" Ω. Les couleurs distinguent les résistances.":"Ajoute plusieurs points avec des tensions différentes, puis change la résistance.","ok");
  });
});

/* ---------- 2 · La résistance d'un fil (cylindre 3D) ---------- */
var MATF=[["cuivre","Cuivre",0.0172,"#d9904f"],["alu","Aluminium",0.0282,"#c6ccd4"],["fer","Fer",0.10,"#8a929e"],["const","Constantan",0.49,"#c2a77a"],["nich","Nichrome",1.10,"#9aa0a8"]];
SIM("p3-c04-fil", function(k,S){
  var c = mkc(k,0.9,1.02);
  var m = k.select("Matériau",MATF.map(function(x){return [x[0],x[1]+" (ρ = "+F(x[2],4)+" Ω·mm²/m)"];}),"cuivre");
  var L = k.slider("Longueur L",1,20,1,5,"m");
  var Sx = k.slider("Section S",0.1,4,0.1,1,"mm²");
  var ro = k.readouts(["Résistance du fil","Par rapport à 1 m de cuivre de 1 mm²"]);
  var tg = {v:0};
  function newTarget(){ var l=[1,2,5,10,20,50]; tg.v=l[Math.floor(Math.random()*l.length)]*(1+Math.floor(Math.random()*2)*0.5); }
  newTarget();
  k.button("Nouveau défi", function(){ newTarget(); });
  var nt = k.note("","");
  var yaw=0.7, pit=0.3, auto=true, last=null;
  c.pointer(function(t,p){ if(t==="down"){ last=p; auto=false; } else if(t==="drag"&&last){ yaw+= (p.x-last.x)*0.012; pit=clamp(pit+(p.y-last.y)*0.01,-1.2,1.2); last=p; k.redraw(); } else if(t==="up"){ last=null; } });
  var lp=k.loop(function(dt){ if(auto){ yaw+=dt*0.35; k.redraw(); } }); lp.play();
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), mat=MATF.filter(function(x){return x[0]===m.value;})[0];
    var rho=mat[2], r=rho*L.value/Sx.value;
    var Lh=(90+(W*0.62-90)*Math.sqrt(L.value/20))/2, rad=7+Math.sqrt(Sx.value)*9, n=28, cx=W/2, cy=H*0.38, dist=620;
    /* sol d'ombre */
    var g=c.ctx;
    function P3(x,y,z){ return pr3([x,y,z],yaw,pit,cx,cy,dist); }
    var quads=[], i;
    for (i=0;i<n;i++){ var a0=i/n*PI2, a1=(i+1)/n*PI2, am=(a0+a1)/2, nrm=rot3([0,Math.cos(am),Math.sin(am)],yaw,pit);
      var v=[P3(-Lh,rad*Math.cos(a0),rad*Math.sin(a0)),P3(Lh,rad*Math.cos(a0),rad*Math.sin(a0)),P3(Lh,rad*Math.cos(a1),rad*Math.sin(a1)),P3(-Lh,rad*Math.cos(a1),rad*Math.sin(a1))];
      var light=0.55+0.55*Math.max(0,-nrm[1]*0.5+nrm[0]*0.35-nrm[2]*0.75); quads.push({v:v,z:(v[0][2]+v[1][2]+v[2][2]+v[3][2])/4,k:light}); }
    quads.sort(function(a,b){ return b.z-a.z; });
    var ax3=rot3([1,0,0],yaw,pit), nearSign=ax3[2]<0?1:-1;       /* extrémité la plus proche de l'observateur */
    function cap(sg,near){ var pts=[]; for (var j=0;j<n;j++){ var a=j/n*PI2; pts.push(P3(sg*Lh,rad*Math.cos(a),rad*Math.sin(a))); }
      g.save(); g.beginPath(); pts.forEach(function(p,j){ j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]); }); g.closePath(); g.fillStyle=near?shade(mat[3],1.12):shade(mat[3],0.7); g.fill(); g.strokeStyle="rgba(60,40,10,.55)"; g.lineWidth=1.4; g.stroke(); g.restore();
      return pts; }
    cap(-nearSign,false);
    quads.forEach(function(q){ g.save(); g.beginPath(); q.v.forEach(function(p,j){ j?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]); }); g.closePath(); g.fillStyle=shade(mat[3],q.k); g.fill(); g.strokeStyle=shade(mat[3],q.k); g.lineWidth=0.8; g.stroke(); g.restore(); });
    cap(nearSign,true);
    /* cote de la longueur */
    var dA=P3(-Lh,rad*1.7+8,0), dB=P3(Lh,rad*1.7+8,0);
    g.save(); g.strokeStyle=P.grey; g.lineWidth=1.4; g.setLineDash([]); g.beginPath(); g.moveTo(dA[0],dA[1]); g.lineTo(dB[0],dB[1]); g.stroke(); g.restore();
    D.arrow(c,(dA[0]+dB[0])/2,(dA[1]+dB[1])/2,dB[0],dB[1],P.grey,1.4); D.arrow(c,(dA[0]+dB[0])/2,(dA[1]+dB[1])/2,dA[0],dA[1],P.grey,1.4);
    chip(c,"L = "+F(L.value,0)+" m",(dA[0]+dB[0])/2,(dA[1]+dB[1])/2-16,P.ink);
    /* section agrandie */
    var sr=8+Math.sqrt(Sx.value)*13, sxp=W-sr-20, syp=H*0.14+sr;
    circ(c,sxp,syp,sr,shade(mat[3],1.1),"#6b4a22",2); for (i=0;i<8;i++){ var aa=i*2.4, rr2=sr*0.7*Math.sqrt((i+1)/8); circ(c,sxp+rr2*Math.cos(aa),syp+rr2*Math.sin(aa),2.4,"#2f56c4"); }
    chip(c,"section S = "+F(Sx.value,1)+" mm²",sxp-(W<430?18:0),syp+sr+17,P.ink,{size:f-1});
    /* jauge logarithmique de R */
    var gx=24, gw=W-48, gy=H*0.8, lg=function(v){ return clamp((Math.log10(Math.max(v,1e-3))+2)/4,0,1); };
    rect(c,gx,gy,gw,14,"#e4e9f1",null,0,7);
    var gr=g.createLinearGradient(gx,0,gx+gw,0); gr.addColorStop(0,"#5fa8e8"); gr.addColorStop(0.6,"#f0a640"); gr.addColorStop(1,"#d6361f");
    rect(c,gx,gy,Math.max(14,gw*lg(r)),14,gr,null,0,7);
    [0.01,0.1,1,10,100].forEach(function(v){ var X=gx+gw*lg(v); ln(c,[X,gy+14],[X,gy+19],"#8795ab",1.4); lab(c,String(v).replace(".",","),X,gy+30,P.grey,{size:f-1.5,weight:600}); });
    lab(c,"R (Ω), échelle logarithmique",gx+gw/2,gy+48,P.grey,{size:f-1.5,weight:600});
    var tx=gx+gw*lg(tg.v); g.save(); g.fillStyle=P.violet; g.beginPath(); g.moveTo(tx,gy-2); g.lineTo(tx-7,gy-12); g.lineTo(tx+7,gy-12); g.closePath(); g.fill(); g.restore(); chip(c,"cible "+F(tg.v,1)+" Ω",clamp(tx,50,W-50),gy-50,P.violet,{size:f-1});
    chip(c,"R = "+fmtR(r),clamp(gx+gw*lg(r),44,W-44),gy-26,P.ink,{size:f});
    chip(c,"glisse pour faire tourner le fil",W/2,H*0.035+8,P.grey,{size:f-1.5});
    ro.set(0,fmtR(r)); ro.set(1,"× "+S.sci(r/0.0172,3));
    var d=Math.abs(r-tg.v)/tg.v;
    nt.set("<b>Défi :</b> atteins R = "+F(tg.v,1)+" Ω (±5 %). "+(d<=0.05?"<b>Réussi !</b> R = "+F(r,2)+" Ω.":"Pour l'instant R = "+F(r,2)+" Ω ("+(r<tg.v?"trop petite : allonge ou affine le fil, ou change de matériau":"trop grande : raccourcis ou épaissis le fil")+")."),d<=0.05?"ok":"warn");
  });
});

/* ---------- 3 · Code couleur ---------- */
var CHIF=[["noir","#161616",0],["marron","#7b4a20",1],["rouge","#d1342b",2],["orange","#f08a1c",3],["jaune","#f2d21b",4],["vert","#3aa655",5],["bleu","#2f62d6",6],["violet","#8a3fc4",7],["gris","#8e949c",8],["blanc","#fafafa",9]];
var MULT=[["noir","#161616",1],["marron","#7b4a20",10],["rouge","#d1342b",100],["orange","#f08a1c",1e3],["jaune","#f2d21b",1e4],["vert","#3aa655",1e5],["bleu","#2f62d6",1e6],["or","#cda434",0.1],["argent","#c3c7cc",0.01]];
var TOL=[["marron","#7b4a20",1],["rouge","#d1342b",2],["or","#cda434",5],["argent","#c3c7cc",10]];
SIM("p3-c04-code-couleur", function(k,S){
  var c = mkc(k,0.8,1.12);
  var opt=function(a){ return a.map(function(x,i){ return [i,x[0]]; }); };
  var bs=[k.select("Bague 1 (chiffre)",opt(CHIF),1), k.select("Bague 2 (chiffre)",opt(CHIF),0), k.select("Bague 3 (multiplicateur)",opt(MULT),2), k.select("Bague 4 (tolérance)",opt(TOL),2)];
  var ro=k.readouts(["Valeur","Tolérance","Intervalle","Défis réussis"]);
  var nt=k.note("","");
  var tg=null, sel=0, score=0, tries=0, hits=[], chips=[], done=false;
  function newT(){ var d1=1+Math.floor(Math.random()*9), d2=Math.floor(Math.random()*10), mi=Math.floor(Math.random()*7); tg={v:(d1*10+d2)*MULT[mi][2]}; done=false; }
  k.button("Défi : nouvelle valeur à reproduire", function(){ newT(); }, true);
  k.button("Quitter le défi", function(){ tg=null; });
  var TAB=[CHIF,CHIF,MULT,TOL];
  c.pointer(function(t,p){ if(t!=="down") return; hits.forEach(function(h){ if(Math.abs(p.x-h[0])<h[2]&&p.y>h[1]&&p.y<h[3]) sel=h[4]; });
    chips.forEach(function(q){ if(Math.hypot(p.x-q[0],p.y-q[1])<q[2]){ bs[sel].set(q[3]); } }); k.redraw(); });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    var vals=bs.map(function(b){ return +b.value; });
    var v=(CHIF[vals[0]][2]*10+CHIF[vals[1]][2])*MULT[vals[2]][2], t=TOL[vals[3]][2];
    /* résistance */
    var bw=Math.min(W*0.78,360), bh=Math.min(62,W*0.14), x0=W/2-bw/2, cy=H*0.2;
    ln(c,[8,cy],[x0+10,cy],"#98a3b3",5); ln(c,[x0+bw-10,cy],[W-8,cy],"#98a3b3",5);
    var body=g.createLinearGradient(0,cy-bh/2,0,cy+bh/2); body.addColorStop(0,"#f6e3bd"); body.addColorStop(0.5,"#e8cc94"); body.addColorStop(1,"#c9a465");
    g.save(); g.beginPath(); g.moveTo(x0+bh*0.25,cy-bh*0.35); g.lineTo(x0+bw-bh*0.25,cy-bh*0.35); g.quadraticCurveTo(x0+bw+bh*0.1,cy-bh*0.35,x0+bw+bh*0.1,cy-bh*0.1); g.quadraticCurveTo(x0+bw+bh*0.1,cy,x0+bw-bh*0.25,cy);
    g.restore(); rect(c,x0,cy-bh/2,bw,bh,body,"#a58645",2,bh*0.42);
    var pos=[0.16,0.31,0.46,0.8]; hits=[];
    pos.forEach(function(q,i){ var col=TAB[i][vals[i]][1], bx=x0+bw*q-6, on=i===sel; rect(c,bx,cy-bh/2+1,13,bh-2,col,"rgba(0,0,0,.45)",1,2); if(on){ rect(c,bx-5,cy-bh/2-6,23,bh+12,null,P.acc,3,8); }
      hits.push([bx+6.5,cy-bh/2-8,Math.max(18,bw*0.07),cy+bh/2+8,i]);
      lab(c,["1er chiffre","2e chiffre","multiplicateur","tolérance"][i],bx+6.5,cy+bh/2+(i%2?26:15),on?P.acc:P.grey,{size:f-2,weight:on?800:600}); });
    /* palette de la bague choisie */
    var tab=TAB[sel], nn=tab.length, py=H*0.46; chips=[];
    lab(c,"Bague "+(sel+1)+" : "+tab[vals[sel]][0]+(sel<2?" = "+tab[vals[sel]][2]:sel===2?" = × "+S.sci(tab[vals[sel]][2],3):" = ± "+tab[vals[sel]][2]+" %"),W/2,py-30,P.ink,{size:f+0.5,weight:800});
    var rr0=Math.min(18,(W-24)/nn/2-2), stp=Math.min(46,(W-24)/nn);
    tab.forEach(function(q,i){ var X=W/2+(i-(nn-1)/2)*stp, on=i===vals[sel]; circ(c,X,py,rr0,q[1],on?P.acc:"rgba(0,0,0,.35)",on?3.5:1.3); chips.push([X,py,rr0+2,i]); if(sel<2) lab(c,String(q[2]),X,py+rr0+13,P.grey,{size:f-1.5,weight:700}); });
    chip(c,"Clique une bague, puis une couleur",W/2,py+rr0+(sel<2?36:20),P.grey,{size:f-1.5});
    /* lecture */
    var ry=H*0.7; rect(c,W/2-Math.min(W*0.44,200),ry-34,Math.min(W*0.88,400),68,"#fff","#d4dbe6",1.5,14);
    lab(c,"("+CHIF[vals[0]][2]+" "+CHIF[vals[1]][2]+") × "+S.sci(MULT[vals[2]][2],3)+" = ",W/2-6,ry-14,P.grey,{size:f,weight:700});
    lab(c,fmtR(v)+"  ± "+t+" %",W/2,ry+10,P.ink,{size:f+7,weight:800});
    /* défi */
    var ok=false;
    if (tg){ ok=Math.abs(v-tg.v)<tg.v*1e-6; if(ok&&!done){ done=true; score++; } if(!ok) done=false;
      chip(c,"Défi : reproduis "+fmtR(tg.v)+(ok?"   ✓":""),W/2,H*0.9,ok?P.green:P.violet,{size:f+1}); }
    else chip(c,"Mode libre : lis la valeur, ou lance un défi",W/2,H*0.9,P.grey,{size:f-0.5});
    ro.set(0,fmtR(v)); ro.set(1,"± "+t+" %"); ro.set(2,fmtR(v*(1-t/100))+" à "+fmtR(v*(1+t/100))); ro.set(3,String(score));
    var msg="Lecture : ("+CHIF[vals[0]][2]+CHIF[vals[1]][2]+") × "+S.sci(MULT[vals[2]][2],3)+" = "+fmtR(v)+".";
    if (tg) msg="<b>Défi :</b> reproduis "+fmtR(tg.v)+". "+(ok?"<b>Réussi !</b> ":"Ta valeur : "+fmtR(v)+". ")+msg;
    nt.set(msg,ok?"ok":"");
  });
});

/* ---------- 4 · Lampe ou résistance : qui est ohmique ? ---------- */
function lampR(U){ return 1.2+10.8*Math.pow(U/6,0.45); }
SIM("p3-c04-lampe-resistance", function(k,S){
  var c = mkc(k,0.9,1.05);
  var U = k.slider("Tension appliquée",0,6,0.1,3,"V");
  var ro = k.readouts(["Résistance fixe 12 Ω : I","Lampe : I","Lampe : U / I"]);
  var nt = k.note("","");
  var ax=null;
  c.pointer(function(t,p){ if((t==="down"||t==="drag")&&ax){ U.set(Math.round(clamp(ax.iy(p.y),0,6)*10)/10); k.redraw(); } });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    ax=D.axes(c,{x0:0,x1:0.6,y0:0,y1:6,xl:"I (A)",yl:"U (V)",stepX:0.1,stepY:1,l:46,r:14,t:24,b:38});
    D.fn(c,ax,function(i){ return 12*i; },P.acc,3);
    g.save(); g.beginPath(); g.rect(ax.L,ax.T,ax.R-ax.L,ax.B-ax.T); g.clip(); g.strokeStyle=P.red; g.lineWidth=3; g.lineJoin="round"; g.beginPath();
    for (var u=0.02;u<=6.001;u+=0.05){ var i=u/lampR(u); if (u<0.03) g.moveTo(ax.X(i),ax.Y(u)); else g.lineTo(ax.X(i),ax.Y(u)); } g.stroke(); g.restore();
    var Ir=U.value/12, Il=U.value>0?U.value/lampR(U.value):0;
    D.line(c,ax.L,ax.Y(U.value),ax.R,ax.Y(U.value),"#cdd5e0",1.2,[4,3]);
    if (U.value>0){ D.line(c,ax.X(0),ax.Y(0),ax.X(Il),ax.Y(U.value),P.red,1.6,[5,4]); chip(c,"pente = U/I",clamp(ax.X(Il)+62,70,W-50),ax.Y(U.value)-16,P.red,{size:f-1.5}); }
    circ(c,ax.X(Ir),ax.Y(U.value),8,"#fff",P.acc,3.2); circ(c,ax.X(Il),ax.Y(U.value),8,"#fff",P.red,3.2);
    chip(c,"résistance : droite",ax.X(0.44),ax.Y(1.1),P.acc,{size:f-1}); chip(c,"lampe : courbe",ax.X(0.13),ax.Y(4.6),P.red,{size:f-1});
    /* lampe dessinée : l'éclat suit la tension */
    var br=Math.pow(U.value/6,1.6), lx=W-40, ly=ax.T+64; lamp(c,lx,ly,17,br*1.1,false);
    lab(c,"à "+F(U.value,1)+" V",lx,ly+30,P.grey,{size:f-1,weight:700});
    lcd(c,F(U.value,1)+" V",ax.X(0.25),ax.Y(0.8),76,34,"#13233a","tension");
    chip(c,"glisse le point",ax.X(0.34),ax.Y(5.6),P.grey,{size:f-1.5});
    ro.set(0,F(Ir*1000,0)+" mA"); ro.set(1,F(Il*1000,0)+" mA"); ro.set(2,U.value>0?F(lampR(U.value),1)+" Ω":"—");
    nt.set(U.value>0?"À "+F(U.value,1)+" V : la résistance fixe vaut toujours 12 Ω ; la lampe vaut <b>"+F(lampR(U.value),1)+" Ω</b> : plus la tension est grande, plus le filament est chaud et plus sa résistance est grande.":"Règle une tension non nulle.","ok");
  });
});

})();
