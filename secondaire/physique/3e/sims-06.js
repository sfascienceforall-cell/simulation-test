/* Chapitre 6 · Puissance, énergie et sécurité */
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
META["p3-c06-facture"]={
  id:"p3-c06-facture", ch:"c06", tag:"Classique",
  titre:"Du watt au kWh : calcule ta facture d'électricité",
  resume:"Règle le temps d'utilisation de chaque appareil : lis l'énergie du mois et le coût.",
  but:"Pour chaque appareil, règle la durée d'utilisation par jour. Observe quels appareils pèsent le plus sur la consommation d'énergie et sur la facture.",
  aRetenir:"Énergie E = P × t. Avec P en kW et t en h, E s'exprime en kWh (1 kWh = 1 kW pendant 1 h = 3,6 MJ). Un appareil puissant utilisé peu de temps peut consommer autant qu'un petit appareil utilisé longtemps.",
  piege:"Le watt est une puissance (un rythme) ; le kWh est une énergie (une quantité) : le compteur mesure des kWh, pas des kW. Prix du kWh réglable : valeur d'exemple, à vérifier sur ta facture."};
META["p3-c06-disjoncteur"]={
  id:"p3-c06-disjoncteur", ch:"c06", tag:"Sécurité",
  titre:"Surcharge d'une prise : le disjoncteur déclenche",
  resume:"Branche des appareils sur le même circuit : l'intensité totale monte jusqu'au déclenchement.",
  but:"Allume des appareils sur un même circuit 230 V. Observe l'intensité totale, comparée au calibre du disjoncteur.",
  aRetenir:"Les appareils d'une maison sont en dérivation sous 230 V : leurs intensités s'additionnent, I = P / U pour chacun. Un circuit protégé par un disjoncteur de 16 A supporte au maximum 230 × 16 = 3 680 W. Au-delà, le disjoncteur coupe pour éviter un échauffement dangereux des fils.",
  piege:"Une multiprise ne crée pas de puissance : brancher quatre gros appareils sur un seul circuit provoque la même surcharge. Ne jamais remplacer un fusible par un calibre plus grand ou par un fil : les câbles chaufferaient sans protection."};
META["p3-c06-joule"]={
  id:"p3-c06-joule", ch:"c06", tag:"Chaleur",
  titre:"L'effet Joule : un fil qui chauffe",
  resume:"Fais varier l'intensité, la résistance et le temps : la température du fil monte.",
  but:"Règle l'intensité I, la résistance R du fil et la durée. Observe la puissance dissipée P = R·I², l'énergie et l'échauffement d'un fil de cuivre de 10 g.",
  aRetenir:"Un courant dans un conducteur dégage de la chaleur : P = R·I² (effet Joule), E = R·I²·t. Doubler l'intensité multiplie la chaleur par 4. C'est utile (bouilloire, grille-pain) mais dangereux dans un câble trop fin ou surchargé.",
  piege:"La chaleur dépend du carré de I : 20 A chauffent 4 fois plus que 10 A, pas 2 fois. Modèle simplifié : toute la chaleur reste dans le fil (aucune perte vers l'air), valable seulement quelques secondes."};
META["p3-c06-terre"]={
  id:"p3-c06-terre", ch:"c06", tag:"Niche utile",
  titre:"Défaut d'isolement : terre et différentiel",
  resume:"Un fil de phase touche le boîtier métallique d'un appareil : que se passe-t-il selon la protection ?",
  but:"Un défaut met le boîtier sous tension. Active ou non le fil de terre, le disjoncteur différentiel 30 mA, et fais toucher (ou non) le boîtier. Regarde la tension, le courant dans le corps, le déclenchement.",
  aRetenir:"Le fil de terre relie le boîtier au sol : en cas de défaut, un courant de fuite s'écoule par la terre et le disjoncteur différentiel (30 mA) le détecte et coupe en moins de 0,3 s. Avec une prise de terre ordinaire (quelques dizaines d'ohms), ni fusible ni disjoncteur classique ne déclenchent : seul le différentiel protège. Plus de 30 mA dans le corps humain est dangereux.",
  piege:"Le fil de terre seul ne coupe pas l'alimentation : le boîtier peut rester dangereusement sous tension. Un fusible ou disjoncteur classique (16 A) ne protège pas des personnes : une fuite de 0,1 A ne le fait pas déclencher. (Modèle simplifié d'une installation belge ; valeurs d'ordre de grandeur.)"};
/* ---------- 1 · Compteur et facture : on tire sur les barres ---------- */
var APP=[["Ampoule LED",9,5,"#f4c542"],["Ampoule à incandescence",60,0,"#e8a33a"],["Télévision",100,3,"#6a7a95"],["Ordinateur portable",50,4,"#5b8dd6"],["Bouilloire",2000,0.3,"#c0321d"],["Sèche-cheveux",1800,0.1,"#c43a7a"]];
SIM("p3-c06-facture", function(k,S){
  var c = mkc(k,0.95,1.3);
  var sl = APP.map(function(a){ return k.slider(a[0]+" ("+F(a[1],0)+" W)", 0, a[1]>=1000?3:12, a[1]>=1000?0.1:0.5, a[2], "h/jour"); });
  var pr = k.slider("Prix du kWh (exemple)", 0.15, 0.50, 0.01, 0.30, "€");
  var ro = k.readouts(["Énergie par mois","Coût par mois"]);
  var nt = k.note("","");
  var MX=70, sel=-1, goal=15;
  var geo=null;
  function setFromX(i,x){ var u=clamp((x-geo.bx)/geo.bw,0,1), E=u*MX, h=E*1000/(APP[i][1]*30); var s=sl[i], st=APP[i][1]>=1000?0.1:0.5; s.set(Math.round(h/st)*st); k.redraw(); }
  c.pointer(function(ty,p){ if(!geo) return;
    if(ty==="down"){ sel=-1; for(var i=0;i<APP.length;i++){ var y=geo.y0+i*geo.rh; if(p.y>=y&&p.y<y+geo.rh){ sel=i; break; } } if(sel>=0) setFromX(sel,p.x); }
    else if(ty==="drag"&&sel>=0) setFromX(sel,p.x);
    else if(ty==="up") sel=-1; });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c);
    var E=APP.map(function(a,i){ return a[1]*sl[i].value*30/1000; }), tot=E.reduce(function(x,y){return x+y;},0), cost=tot*pr.value;
    /* afficheur de compteur et facture */
    var hh=Math.min(58,H*0.13);
    D.panel(c,10,8,W-20,hh+14,{shadow:false});
    D.display(c,F(tot,1)+" kWh",W*0.27,8+(hh+14)/2,{w:Math.min(150,W*0.42),h:hh,caption:"COMPTEUR · 30 JOURS"});
    var ok=cost<=goal; D.display(c,F(cost,2)+" €",W*0.73,8+(hh+14)/2,{w:Math.min(150,W*0.42),h:hh,caption:"FACTURE DU MOIS",color:ok?"#155c43":"#9b2314",screen:ok?"#e4f4ea":"#fbe9e5"});
    var y0=hh+34, rh=(H-y0-28)/APP.length, bx=14, bw=W-28-(W<430?0:20); geo={y0:y0,rh:rh,bx:bx,bw:bw};
    APP.forEach(function(a,i){ var y=y0+i*rh, w=bw*Math.min(1,E[i]/MX), hot=a[1]>=1000;
      lab(c,a[0]+" · "+F(a[1],0)+" W × "+F(sl[i].value,1)+" h/j",bx,y+9,P.ink,{align:"left",size:f-0.5});
      var bh2=Math.min(22,rh-24), by2=y+17+(rh-24-bh2)/2; rect(c,bx,by2,bw,bh2,"#e8edf4",null,0,bh2/2);
      if(w>0) rect(c,bx,by2,Math.max(10,w),bh2,hot?P.red:P.acc,null,0,bh2/2);
      if(w>0) circ(c,bx+Math.max(10,w),by2+bh2/2,bh2/2+3,"#fff",hot?P.red:P.acc,2.8);
      var tx=Math.max(10,w)+bx+bh2/2+10, txt=F(E[i],1)+" kWh · "+F(E[i]*pr.value,2)+" €";
      if(tx+90>bx+bw+10) T(c,txt,bx+Math.max(10,w)-bh2/2-8,by2+bh2/2,{size:f-0.5,color:"#fff",align:"right"}); else T(c,txt,tx,by2+bh2/2,{size:f-0.5,color:P.ink,align:"left"}); });
    lab(c,"Tire une barre pour régler la durée · échelle 0 → "+MX+" kWh",W/2,H-12,P.grey,{size:f-1});
    ro.set(0,F(tot,1)+" kWh"); ro.set(1,F(cost,2)+" €");
    var im=E.indexOf(Math.max.apply(null,E));
    nt.set(tot>0?"<b>Objectif : facture ≤ "+goal+" €</b> "+(ok?"(atteint !). ":"(pas encore). ")+"Plus gros poste : <b>"+APP[im][0]+"</b> ("+F(E[im],1)+" kWh, "+F(E[im]/tot*100,0)+" % du total). Bouilloire : 2 000 W × 0,3 h × 30 j = 18 kWh.":"Règle au moins une durée.",ok?"ok":"warn");
  });
});

/* ---------- 2 · Disjoncteur : clique les appareils ---------- */
var APP2=[["Lampe",60,"#f4c542"],["Téléviseur",120,"#6a7a95"],["Aspirateur",1000,"#2f7fd1"],["Bouilloire",2200,"#c0321d"],["Radiateur",2000,"#e07a1f"],["Four",2500,"#8b5cf6"]];
SIM("p3-c06-disjoncteur", function(k,S){
  var c = mkc(k,0.8,1.05);
  var tg = APP2.map(function(a,i){ return k.toggle(a[0]+" ("+F(a[1],0)+" W)", i<2); });
  var cal = k.seg("Calibre du disjoncteur", [["10","10 A"],["16","16 A"],["20","20 A"]], "16");
  var ro = k.readouts(["Puissance totale","Intensité totale","Seuil de coupure"]);
  var nt = k.note("","");
  k.button("Réarmer le disjoncteur", function(){ st.tripped=false; st.heat=0; }, true);
  var st={heat:0,tripped:false}, tiles=[], ph=0;
  function demand(){ var P=0; APP2.forEach(function(a,i){ if(tg[i].value) P+=a[1]; }); return P; }
  var lp=k.loop(function(dt){ ph+=dt; var I=demand()/230, C=+cal.value;
    if(!st.tripped){ if(I>C) st.heat+=dt*Math.min(2.5,(I/C-1)*3+0.15); else st.heat=Math.max(0,st.heat-dt*0.6); if(st.heat>=1){ st.tripped=true; } }
    k.redraw(); }); lp.play();
  c.pointer(function(ty,p){ if(ty!=="down") return; tiles.forEach(function(t,i){ if(p.x>=t[0]&&p.x<=t[0]+t[2]&&p.y>=t[1]&&p.y<=t[1]+t[3]){ tg[i].set(!tg[i].value); if(!tg[i].value||true) st.heat=Math.min(st.heat,0.9); } }); k.redraw(); });
  k.draw(function(){
    paper(c); var W=c.W,H=c.H,f=fs(c), C=+cal.value, Pd=demand(), Ireq=Pd/230, I=st.tripped?0:Ireq;
    /* tableau électrique */
    var bw=Math.min(W-20,340), bx=(W-bw)/2, by=10, bh=H*0.4;
    rect(c,bx,by,bw,bh,"#e9edf3","#9aa7ba",2,12);
    chip(c,"TABLEAU · "+C+" A",bx+60,by+16,P.grey,{size:f-1});
    /* levier */
    var lx=bx+bw*0.2, ly=by+bh*0.42; rect(c,lx-22,ly-24,44,64,"#cfd7e3","#8795ab",1.6,6);
    var lev=st.tripped?1:Math.min(0.5,st.heat*0.5); rect(c,lx-12,ly-18+lev*34,24,26,st.tripped?P.red:P.green,"#13233a",1.6,5);
    chip(c,st.tripped?"COUPÉ":"ON",lx,ly+52,st.tripped?P.red:P.green,{size:f});
    /* cadran d'intensité */
    var cx=bx+bw*0.64, cy=by+bh*0.72, R=Math.min(bw*0.3,bh*0.55), g=c.ctx, Imax=Math.max(25,C*1.5);
    g.save(); g.lineWidth=12; g.lineCap="round";
    function ang(v){ return Math.PI*(1+clamp(v/Imax,0,1)); }
    g.strokeStyle="#dde3ec"; g.beginPath(); g.arc(cx,cy,R,Math.PI,2*Math.PI); g.stroke();
    g.strokeStyle=P.green; g.beginPath(); g.arc(cx,cy,R,Math.PI,ang(C*0.8)); g.stroke();
    g.strokeStyle=P.amber; g.beginPath(); g.arc(cx,cy,R,ang(C*0.8),ang(C)); g.stroke();
    g.strokeStyle=P.red; g.beginPath(); g.arc(cx,cy,R,ang(C),2*Math.PI); g.stroke(); g.restore();
    var a=ang(Math.min(Ireq,Imax)); wire(c,[[cx,cy],[cx+Math.cos(a)*(R-6),cy+Math.sin(a)*(R-6)]],P.ink,3.4); circ(c,cx,cy,5,P.ink);
    lab(c,F(Ireq,1)+" A",cx,cy+18,Ireq>C?P.red:P.ink,{size:f+3});
    lab(c,"0",cx-R,cy+14,P.grey,{size:f-1}); lab(c,F(Imax,0),cx+R,cy+14,P.grey,{size:f-1});
    /* barre de chauffe (bilame) */
    if(Ireq>C&&!st.tripped){ rect(c,bx+10,by+bh-16,bw-20,7,"#fff",null,0,4); rect(c,bx+10,by+bh-16,(bw-20)*Math.min(1,st.heat),7,P.red,null,0,4); }
    /* appareils : tuiles cliquables */
    tiles=[]; var cols=3, tw=(W-20)/cols-8, th=Math.min(92,(H-bh-50)/2-8), y0=by+bh+22;
    lab(c,"Clique un appareil pour le brancher / débrancher",W/2,y0-8,P.grey,{size:f-1});
    APP2.forEach(function(a,i){ var col=i%cols, row=Math.floor(i/cols), x=10+col*(tw+8)+4, y=y0+6+row*(th+8), on=tg[i].value&&!st.tripped, want=tg[i].value;
      tiles.push([x,y,tw,th]); rect(c,x,y,tw,th,want?(on?"#fff":"#f6e3df"):"#f1f3f7",want?a[2]:"#c9d1dd",2.2,10);
      if(on) D.glow(c,x+tw/2,y+th*0.4,th*0.7,a[2],0.35);
      circ(c,x+tw/2,y+th*0.36,th*0.2,want?a[2]:"#c9d1dd");
      lab(c,a[0],x+tw/2,y+th*0.68,P.ink,{size:f-1.5,weight:700}); lab(c,F(a[1]/230,1)+" A",x+tw/2,y+th*0.88,want?a[2]:P.grey,{size:f-2}); });
    ro.set(0,F(Pd,0)+" W"); ro.set(1,F(Ireq,1)+" A"); ro.set(2,F(230*C,0)+" W");
    if(st.tripped) nt.set("<b>Surcharge :</b> "+F(Ireq,1)+" A &gt; "+C+" A, le bilame a chauffé et le disjoncteur a <b>coupé</b>. Débranche des appareils, puis réarme. (Vrai disjoncteur : de quelques secondes à quelques minutes selon le dépassement.)","warn");
    else if(Ireq>C) nt.set("<b>Surcharge !</b> "+F(Ireq,1)+" A &gt; "+C+" A : les fils chauffent, le disjoncteur va couper.","warn");
    else nt.set("I = P / U = "+F(Pd,0)+" W / 230 V = <b>"+F(Ireq,1)+" A</b>, inférieure à "+C+" A : le circuit fonctionne. Les intensités des appareils en dérivation s'additionnent.","ok");
  });
});

/* ---------- 3 · Effet Joule : fil qui rougit, animé ---------- */
SIM("p3-c06-joule", function(k,S){
  var c = mkc(k,0.62,0.9);
  var I = k.slider("Intensité", 0, 20, 0.5, 10, "A");
  var R = k.slider("Résistance du fil", 0.1, 5, 0.1, 1, "Ω");
  var t = k.slider("Durée", 0, 60, 1, 10, "s");
  var ro = k.readouts(["Puissance dissipée","Énergie dissipée","Température du fil"]);
  var nt = k.note("","");
  var ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  function heat(Tc){ return Tc<300?"#8a95a3":Tc<550?"#a46a62":Tc<750?"#b4302a":Tc<950?"#ee6a1f":"#ffc83d"; }
  c.pointer(function(ty,p){ if(ty==="down"||ty==="drag"){ if(p.y>c.H*0.62){ var u=clamp((p.x-20)/(c.W-40),0,1); t.set(Math.round(u*60)); k.redraw(); } else { I.set(Math.round(clamp(20*(1-(p.y-c.H*0.1)/(c.H*0.5)),0,20)*2)/2); k.redraw(); } } });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    var Pw=R.value*I.value*I.value, Q=Pw*t.value, dT=Q/(0.010*385), Tf=20+dT, melt=Tf>=1085, Tc=Math.min(Tf,1085);
    var y=H*0.34, x0=36, x1=W-36, col=heat(Tc);
    if(Tc>400){ var a=Math.min(0.55,(Tc-400)/1200); D.glow(c,W/2,y,W*0.5,"#ff8a3d",a); }
    /* bornes */
    rect(c,x0-24,y-18,24,36,"#cfd7e3","#7c8aa0",1.8,4); rect(c,x1,y-18,24,36,"#cfd7e3","#7c8aa0",1.8,4);
    g.save(); g.strokeStyle=col; g.lineWidth=8; g.lineCap="round"; g.lineJoin="round"; g.beginPath();
    var amp=9, n=36;
    if(melt){ g.moveTo(x0,y); for(var i=0;i<=16;i++){ var xx=x0+(x1-x0)*0.47*i/16; g.lineTo(xx,y+Math.sin(i*1.0)*amp); } g.moveTo(x1-(x1-x0)*0.47,y+14); for(i=0;i<=16;i++){ xx=x1-(x1-x0)*0.47+(x1-x0)*0.47*i/16; g.lineTo(xx,y+14+Math.sin(i*1.0)*amp); } }
    else { for(i=0;i<=n;i++){ xx=x0+(x1-x0)*i/n; var yy=y+Math.sin(i*0.9)*amp; i?g.lineTo(xx,yy):g.moveTo(xx,yy); } }
    g.stroke(); g.restore();
    /* électrons qui circulent (plus rapides si I grand) */
    if(!melt&&I.value>0){ var m=Math.round(8+I.value); for(i=0;i<m;i++){ var u=(((i/m+ph*(0.1+I.value*0.04))%1)+1)%1; circ(c,x0+(x1-x0)*u,y+Math.sin(u*n*0.9)*amp,3,"#3d78e0","#fff",1); } }
    if(melt){ for(i=0;i<6;i++){ var sp=(ph*1.4+i*0.37)%1; circ(c,W/2+Math.sin(i*2.1)*18,y+16+sp*40,2.6,"#ffc83d"); } chip(c,"le fil a fondu",W/2,y-34,P.red,{size:f+1}); }
    else if(Tc>550) chip(c,"le fil rougit",W/2,y-34,P.red,{size:f});
    /* thermomètre horizontal */
    var ty=H*0.7, tw=W-40; rect(c,20,ty,tw,16,"#e2e7ef",null,0,8);
    var gr=g.createLinearGradient(20,0,20+tw,0); gr.addColorStop(0,"#8a95a3"); gr.addColorStop(0.35,"#b4302a"); gr.addColorStop(0.7,"#ee6a1f"); gr.addColorStop(1,"#ffc83d");
    g.save(); g.beginPath(); g.rect(20,ty,tw*Math.min(1,Tc/1085),16); g.clip(); rect(c,20,ty,tw,16,gr,null,0,8); g.restore();
    circ(c,20+tw*Math.min(1,Tc/1085),ty+8,11,"#fff",P.ink,2.4);
    lab(c,"20 °C",20,ty+30,P.grey,{align:"left",size:f-1}); lab(c,"1 085 °C : fusion du cuivre",20+tw,ty+30,P.red,{align:"right",size:f-1});
    lab(c,melt?"≥ 1 085 °C":F(Tf,0)+" °C",clamp(20+tw*Math.min(1,Tc/1085),50,W-50),ty-14,P.ink,{size:f+1});
    lab(c,"Tire en haut : I · tire en bas : durée",W/2,H-10,P.grey,{size:f-1.5});
    ro.set(0,F(Pw,0)+" W"); ro.set(1,F(Q,0)+" J"); ro.set(2,melt?"≥ 1 085 °C":F(Tf,0)+" °C");
    nt.set(Pw===0?"Aucun courant, aucune chaleur.":"E = R·I²·t = "+F(R.value,1)+" × "+F(I.value,1)+"² × "+F(t.value,0)+" = "+F(Q,0)+" J. Pour 10 g de cuivre (385 J/kg/K) : ΔT = E / (m·c) "+(melt?"dépasserait 1 000 °C : le cuivre atteint 1 085 °C et fond (calcul invalide après). Un fusible fonctionne ainsi.":"= "+F(dT,0)+" °C. Double I : la chaleur est multipliée par 4."),melt?"warn":"ok");
  });
});

/* ---------- 4 · Terre et différentiel : on touche le boîtier ---------- */
SIM("p3-c06-terre", function(k,S){
  var c = mkc(k,0.9,1.25);
  var terre = k.toggle("Fil de terre relié au boîtier", true);
  var diff = k.toggle("Disjoncteur différentiel 30 mA", false);
  var touch = k.toggle("Une personne touche le boîtier", true);
  var peau = k.seg("Peau", [["3000","Sèche (≈ 3 kΩ)"],["1000","Mouillée (≈ 1 kΩ)"]], "3000");
  var ra = k.slider("Résistance de la prise de terre", 5, 100, 5, 30, "Ω");
  var ro = k.readouts(["Tension du boîtier","Courant dans le corps","Courant de fuite total","Différentiel"]);
  var nt = k.note("","");
  var U=230, RB=2, ph=0, lp=k.loop(function(dt){ ph+=dt; k.redraw(); }); lp.play();
  var hit=null;
  c.pointer(function(ty,p){ if(ty==="down"&&hit&&p.x>hit[0]&&p.x<hit[0]+hit[2]&&p.y>hit[1]&&p.y<hit[1]+hit[3]){ touch.set(!touch.value); k.redraw(); } });
  k.draw(function(){
    paper(c,"#f9fafd","#eef2f8"); var W=c.W,H=c.H,f=fs(c), g=c.ctx;
    var Rb=+peau.value, Ra=ra.value, t=touch.value, e=terre.value, Rpar, Itot, Uc, Ib;
    if(e&&t){ Rpar=Ra*Rb/(Ra+Rb); Itot=U/(RB+Rpar); Uc=Itot*Rpar; Ib=Uc/Rb; }
    else if(e){ Itot=U/(RB+Ra); Uc=Itot*Ra; Ib=0; }
    else if(t){ Itot=U/(RB+Rb); Uc=Itot*Rb; Ib=Itot; }
    else { Itot=0; Uc=U; Ib=0; }
    var tripD=diff.value&&Itot>=0.03, tripF=Itot>16, cut=tripD||tripF;
    var gy=H*0.86; rect(c,0,gy,W,H-gy,"#d9c9a6"); ln(c,[0,gy],[W,gy],"#8a6d3b",3);
    var bx=W*0.1, bw=W*0.34, by=H*0.22, bh=H*0.42;
    /* boîtier : teinte rouge si sous tension */
    var live=!cut&&(!e||Uc>50); rect(c,bx,by,bw,bh,live?"#f7d7d1":"#dde3ec",live?P.red:P.ink,3,12);
    if(live) D.glow(c,bx+bw/2,by+bh/2,bw*0.9,"#ff5a3c",0.25);
    lab(c,"lave-linge",bx+bw/2,by+bh*0.55,P.grey,{size:f}); lab(c,"boîtier métallique",bx+bw/2,by-12,P.grey,{size:f-1});
    circ(c,bx+bw/2,by+bh*0.32,16,"#fff","#8795ab",2.4);
    /* fil de phase défaillant */
    wire(c,[[bx-12,by-40],[bx-12,by+bh*0.25],[bx+14,by+bh*0.25]],cut?P.grey:P.red,3.4);
    chip(c,"phase 230 V",bx-12,by-52,cut?P.grey:P.red,{align:"left",size:f-1}); if(!cut) chip(c,"défaut",bx+30,by+bh*0.25-12,P.red,{align:"left",size:f-1});
    /* terre */
    if(e){ var tp=[[bx+bw/2,by+bh],[bx+bw/2,gy+8]]; wire(c,tp,P.green,3.4); for(var i=0;i<3;i++) ln(c,[bx+bw/2-14+i*4,gy+10+i*5],[bx+bw/2+14-i*4,gy+10+i*5],P.green,3);
      chip(c,"terre "+F(Ra,0)+" Ω",bx+bw/2+8,by+bh+26,P.green,{align:"left",size:f-1});
      if(!cut&&Itot>0){ var L=gy-(by+bh), m=Math.min(6,Math.max(2,Math.round(Itot*0.5)+2)); for(i=0;i<m;i++){ var u=((i/m+ph*0.6)%1); circ(c,bx+bw/2,by+bh+u*L,3.2,"#ffb020","#fff",1); } } }
    /* personne (cliquable) */
    var px=W*0.78, py=by+bh*0.2;
    hit=[px-40,py-20,80,gy-py+20];
    var col=(t&&!cut)?(Ib*1000>30?P.red:P.amber):P.ink;
    circ(c,px,py,13,"#f3d6b8",col,2.6); ln(c,[px,py+13],[px,py+68],col,4); ln(c,[px,py+68],[px-16,gy-2],col,4); ln(c,[px,py+68],[px+16,gy-2],col,4);
    if(t){ ln(c,[px,py+28],[bx+bw+2,by+bh*0.45],col,4); if(!cut&&Ib>0.001){ D.glow(c,bx+bw,by+bh*0.45,24,Ib*1000>30?"#ff3b30":"#ffb020",0.7); chip(c,F(Ib*1000,0)+" mA",px+8,py+40,Ib*1000>30?P.red:P.amber,{align:"left",size:f}); } }
    else ln(c,[px,py+28],[px+30,py+50],col,4);
    chip(c,t?"touche : clique pour lâcher":"clique pour toucher",px,py-26,P.grey,{size:f-1.5});
    /* différentiel */
    var dw=Math.min(150,W*0.4); rect(c,W-dw-10,8,dw,32,diff.value?(cut?"#fbe1dc":"#ecf6f1"):"#eef0f3",diff.value?(cut?P.red:P.green):P.grey,2,8);
    lab(c,diff.value?(tripD?"DIFFÉRENTIEL : COUPÉ":"différentiel 30 mA"):"pas de différentiel",W-dw/2-10,24,diff.value?(tripD?P.red:P.green):P.grey,{size:f-1});
    ro.set(0,cut?"coupé":F(Uc,0)+" V"); ro.set(1,Ib>0?F(Ib*1000,0)+" mA":"0 mA"); ro.set(2,Itot>0?(Itot>1?F(Itot,1)+" A":F(Itot*1000,0)+" mA"):"0"); ro.set(3,diff.value?(Itot>=0.03?"déclenche":"ne déclenche pas"):"absent");
    var msg,kind;
    if(tripD){ msg="Le différentiel détecte une fuite de "+(Itot>1?F(Itot,1)+" A":F(Itot*1000,0)+" mA")+" (≥ 30 mA) et <b>coupe</b> en moins de 0,3 s : la personne est protégée."; kind="ok"; }
    else if(tripF){ msg="Le courant de défaut ("+F(Itot,1)+" A) dépasse 16 A : le disjoncteur ordinaire coupe aussi."; kind="ok"; }
    else if(Ib>0.03){ msg="<b>Danger de mort :</b> "+F(Ib*1000,0)+" mA traversent le corps (&gt; 30 mA) et rien ne coupe"+(e?" : le fil de terre dérive une partie du courant, mais le boîtier reste à "+F(Uc,0)+" V et le courant de défaut ("+F(Itot,1)+" A) est inférieur à 16 A.":"."); kind="warn"; }
    else if(!t&&!e){ msg="Le boîtier est à 230 V mais aucun courant ne circule : le danger est <b>caché</b>, il frappera au premier contact."; kind="warn"; }
    else if(!t&&e){ msg="Un courant de défaut de "+F(Itot,1)+" A passe par la terre, le boîtier reste à "+F(Uc,0)+" V, et le disjoncteur ordinaire (16 A) ne coupe pas. Il faut un différentiel."; kind="warn"; }
    else { msg="Courant dans le corps : "+F(Ib*1000,0)+" mA (moins de 30 mA)."; kind="warn"; }
    nt.set(msg,kind);
  });
});

})();
