/* Chapitre 1 · Électrostatique */
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
META["p3-c01-frottement"]={
  id:"p3-c01-frottement", ch:"c01", tag:"Classique",
  titre:"Frotter deux matériaux : qui prend les électrons ?",
  resume:"Choisis deux matériaux et une durée de frottement : compte les électrons transférés et regarde les papiers.",
  but:"Frotte deux matériaux l'un contre l'autre. Observe le sens du transfert d'électrons, les charges obtenues et l'effet sur des bouts de papier.",
  aRetenir:"Le frottement ne crée aucune charge : il arrache des électrons à un matériau et les donne à l'autre. Le matériau qui gagne des électrons devient négatif, celui qui en perd devient positif, et la somme des charges reste nulle.",
  piege:"« Frotter crée de l'électricité » est faux : les charges existaient déjà dans les atomes. Le sens du transfert dépend des deux matériaux (série triboélectrique simplifiée ici).",};
META["p3-c01-deux-boules"]={
  id:"p3-c01-deux-boules", ch:"c01", tag:"Interaction",
  titre:"Deux boules chargées suspendues",
  resume:"Règle le signe et la valeur des deux charges : les fils s'écartent, se rapprochent ou se touchent.",
  but:"Change la charge de chaque boule. Observe l'angle des fils. Que se passe-t-il quand elles se touchent ?",
  aRetenir:"Charges de même signe : répulsion. Charges de signes contraires : attraction. La force diminue vite quand la distance augmente. Après un contact, les charges se partagent.",
  piege:"La boule la plus chargée n'exerce pas une force plus grande que l'autre : les deux forces ont la même valeur (action-réaction), même si les charges sont différentes.",};
META["p3-c01-electroscope"]={
  id:"p3-c01-electroscope", ch:"c01", tag:"Mesure",
  titre:"L'électroscope à feuilles",
  resume:"Approche une tige chargée, touche le chapeau, relie à la terre : suis les charges et l'écartement.",
  but:"Approche la tige sans toucher, puis touche, puis relie à la terre. Observe les feuilles et les charges.",
  aRetenir:"Sans contact, la tige repousse ou attire les électrons mobiles du métal (influence) : l'électroscope reste neutre au total, mais ses feuilles s'écartent. Avec un contact, il reçoit de la charge du même signe que la tige. Relier à la terre permet de charger par influence avec le signe contraire.",
  piege:"Des feuilles écartées ne disent pas le signe de la charge ! Pour le connaître, il faut voir si l'écartement augmente ou diminue quand on approche un objet de signe connu. (Modèle simplifié : charges ramenées aux feuilles et au chapeau.)",};
META["p3-c01-polarisation"]={
  id:"p3-c01-polarisation", ch:"c01", tag:"Niche utile",
  titre:"Pourquoi un objet neutre est attiré",
  resume:"Un bâton chargé attire un petit objet neutre : regarde les charges se réorganiser à l'intérieur.",
  but:"Approche le bâton chargé d'une boule neutre. Change le signe du bâton et le matériau de la boule (isolant ou conducteur).",
  aRetenir:"Un objet neutre n'est pas « sans charges » : il contient autant de + que de −. Près d'un objet chargé, les charges se déplacent un peu : le côté proche prend le signe contraire du bâton, il est plus proche, donc plus attiré que le côté éloigné repoussé. Résultat : toujours une attraction, quel que soit le signe du bâton.",
  piege:"Si une boule est attirée, elle n'est pas forcément chargée : elle peut être neutre. Seule une répulsion prouve qu'elle est chargée.",};
/* ---------- 1 · Frottement : qui prend les électrons ? ---------- */
var SERIE = ["Fourrure de lapin","Verre","Laine","Soie","Coton","Ballon de baudruche","Polystyrène","PVC (tuyau)","Téflon"];
var SOPT = SERIE.map(function(n,i){ return [i,n]; });
var MATC = ["#efe3d4","#dcebf2","#e9dfe9","#f1e4ee","#f2efe6","#f6d9d9","#eef0f3","#dfe8d6","#e8e8ec"];
function vband(c,x,y,w,h,a,b){ var g=c.ctx, gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,a); gr.addColorStop(1,b); g.fillStyle=gr; g.fillRect(x,y,w,h); }
/* matériaux dessinés : (x, y) = coin haut gauche ; ph = temps (reflets) */
function matObj(c,i,x,y,w,h,ph){
  var g=c.ctx, j, r=Math.min(h/2,14);
  g.save(); g.lineJoin="round";
  function rr(rad){ g.beginPath(); if(g.roundRect) g.roundRect(x,y,w,h,rad); else g.rect(x,y,w,h); }
  function vgrad(a,b,cc){ var gr=g.createLinearGradient(0,y,0,y+h); gr.addColorStop(0,a); gr.addColorStop(0.5,b); gr.addColorStop(1,cc); return gr; }
  if(i===0){ /* fourrure de lapin */
    rr(r); g.fillStyle=vgrad("#f3e6d3","#dcc3a2","#b89670"); g.fill(); g.strokeStyle="rgba(120,90,60,.45)"; g.lineWidth=1.2;
    for(j=0;j<w*h/90;j++){ var fx=x+4+((j*37.3)%1)*0+((j*53.7)%(w-8)), fy=y+4+((j*29.1)%(h-8)), an=-0.6+((j*7)%5)*0.12; g.beginPath(); g.moveTo(fx,fy); g.lineTo(fx+Math.cos(an)*6,fy+Math.sin(an)*6+2); g.stroke(); }
    g.strokeStyle="rgba(150,115,80,.8)"; g.lineWidth=1.4; for(j=0;j<w;j+=5){ g.beginPath(); g.moveTo(x+j,y+2); g.lineTo(x+j-2,y-4); g.moveTo(x+j,y+h-2); g.lineTo(x+j+2,y+h+4); g.stroke(); } }
  else if(i===1||i===7||i===8){ /* tiges : verre, PVC, téflon */
    var cols=i===1?["rgba(225,242,255,.9)","rgba(170,210,240,.75)","rgba(110,160,210,.85)"]:i===7?["#c7ced8","#8e99a8","#5d6878"]:["#ffffff","#eceef2","#c4c9d2"];
    g.beginPath(); g.ellipse(x+w-h*0.22,y+h/2,h*0.22,h/2,0,0,PI2); g.fillStyle=cols[2]; g.fill();
    g.beginPath(); g.moveTo(x+h*0.22,y); g.lineTo(x+w-h*0.22,y); g.lineTo(x+w-h*0.22,y+h); g.lineTo(x+h*0.22,y+h); g.ellipse(x+h*0.22,y+h/2,h*0.22,h/2,0,Math.PI/2,Math.PI*1.5); g.closePath();
    g.fillStyle=vgrad(cols[0],cols[1],cols[2]); g.fill(); g.strokeStyle=i===1?"rgba(70,120,170,.7)":"rgba(70,80,95,.6)"; g.lineWidth=1.4; g.stroke();
    g.beginPath(); g.ellipse(x+h*0.22,y+h/2,h*0.22,h/2,0,0,PI2); g.fillStyle=i===7?"#4a5463":i===1?"rgba(150,200,240,.8)":"#dde1e7"; g.fill(); g.stroke();
    if(i===7){ g.fillStyle="#2c333d"; g.beginPath(); g.ellipse(x+h*0.22,y+h/2,h*0.13,h*0.34,0,0,PI2); g.fill(); }
    g.fillStyle="rgba(255,255,255,.65)"; g.fillRect(x+h*0.3,y+h*0.16,w-h*0.7,Math.max(2,h*0.1)); }
  else if(i===2){ /* laine tricotée */
    rr(r*0.6); g.fillStyle=vgrad("#d77fa1","#c25d86","#9a3f66"); g.fill(); g.strokeStyle="rgba(255,220,235,.45)"; g.lineWidth=1.6;
    for(var yy=y+6;yy<y+h-3;yy+=8) for(var xx=x+5;xx<x+w-4;xx+=8){ g.beginPath(); g.moveTo(xx,yy); g.lineTo(xx+4,yy+5); g.lineTo(xx+8,yy); g.stroke(); } }
  else if(i===3){ /* soie */
    rr(r*0.6); g.fillStyle=vgrad("#f6e2f2","#e2b8dc","#b985b2"); g.fill(); g.strokeStyle="rgba(255,255,255,.7)"; g.lineWidth=2;
    for(j=0;j<3;j++){ g.beginPath(); for(var u=0;u<=w;u+=6){ var yy2=y+h*(0.25+0.25*j)+Math.sin(u*0.05+ph*1.5+j)*3; if(u) g.lineTo(x+u,yy2); else g.moveTo(x+u,yy2); } g.stroke(); } }
  else if(i===4){ /* coton */
    rr(r*0.5); g.fillStyle=vgrad("#fbf8f0","#efe9da","#d6ceb8"); g.fill(); g.strokeStyle="rgba(160,150,120,.28)"; g.lineWidth=1;
    for(j=x+3;j<x+w;j+=4){ g.beginPath(); g.moveTo(j,y+1); g.lineTo(j,y+h-1); g.stroke(); } for(j=y+3;j<y+h;j+=4){ g.beginPath(); g.moveTo(x+1,j); g.lineTo(x+w-1,j); g.stroke(); } }
  else if(i===5){ /* ballon de baudruche */
    g.beginPath(); g.ellipse(x+w*0.48,y+h/2,w*0.46,h/2,0,0,PI2); var gr=g.createRadialGradient(x+w*0.35,y+h*0.25,h*0.05,x+w*0.48,y+h/2,w*0.5); gr.addColorStop(0,"#ffd0d0"); gr.addColorStop(0.3,"#f0566a"); gr.addColorStop(1,"#a21c33"); g.fillStyle=gr; g.fill();
    g.fillStyle="#a21c33"; g.beginPath(); g.moveTo(x+w*0.94,y+h/2); g.lineTo(x+w,y+h/2-6); g.lineTo(x+w,y+h/2+6); g.closePath(); g.fill();
    g.fillStyle="rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(x+w*0.3,y+h*0.26,w*0.1,h*0.08,-0.2,0,PI2); g.fill(); }
  else { /* polystyrène */
    rr(4); g.fillStyle=vgrad("#ffffff","#f1f3f6","#d9dde4"); g.fill(); g.strokeStyle="#b7bfcb"; g.lineWidth=1.2; g.stroke(); g.fillStyle="rgba(170,180,195,.35)";
    for(j=0;j<w*h/60;j++){ g.beginPath(); g.arc(x+4+((j*41.7)%(w-8)),y+4+((j*23.3)%(h-8)),2.2,0,PI2); g.fill(); } }
  g.restore();
}
/* main qui tient le morceau A (vue de face) : (x, y) = milieu du bord supérieur */
function handA(c,x,y,w,hA,tilt){
  var g=c.ctx; g.save(); g.lineCap="round"; g.lineJoin="round";
  var sx=x+Math.min(140,w*0.7)+tilt, sy=-30; var gr=g.createLinearGradient(sx-22,0,sx+22,0); gr.addColorStop(0,"#2a5fb8"); gr.addColorStop(1,"#1d4690");
  g.strokeStyle=gr; g.lineWidth=40; g.beginPath(); g.moveTo(sx,sy); g.quadraticCurveTo(sx-10,(sy+y)/2,x+6,y-30); g.stroke();
  g.strokeStyle="#183c7a"; g.lineWidth=36; g.lineCap="butt"; g.beginPath(); g.moveTo(x+8,y-34); g.lineTo(x+4,y-24); g.stroke(); g.lineCap="round";
  var sk=g.createLinearGradient(0,y-24,0,y+hA*0.5); sk.addColorStop(0,"#f6d2ae"); sk.addColorStop(1,"#e2ad80");
  g.fillStyle=sk; g.beginPath(); g.ellipse(x,y-10,Math.min(w*0.32,34),15,0,0,PI2); g.fill();
  for(var f=0;f<4;f++){ var fx=x-Math.min(w*0.26,27)+f*Math.min(w*0.17,18); g.beginPath(); if(g.roundRect) g.roundRect(fx-5,y-12,10,hA*0.55+8,5); else g.rect(fx-5,y-12,10,hA*0.55+8); g.fill(); g.strokeStyle="rgba(150,90,50,.35)"; g.lineWidth=1; g.stroke(); }
  g.beginPath(); g.ellipse(x+Math.min(w*0.34,36),y-6,7,12,-0.6,0,PI2); g.fill();
  g.restore();
}
SIM("p3-c01-frottement", function(k,S){
  var c = mkc(k,0.86,1.15);
  var A = k.select("Matériau A (celui qui frotte)", SOPT, 0);
  var B = k.select("Matériau B (celui qui est frotté)", SOPT, 7);
  var t = k.slider("Durée du frottement", 0, 10, 0.5, 4, "s");
  k.button("Frotter (rejouer)", function(){ cur = 0; }, true);
  var ro = k.readouts(["Électrons transférés","Charge de A","Charge de B","Total A + B"]);
  var nt = k.note("", "");
  var cur = 0, ph = 0, ax = 0, dragA = false, px0 = 0, el = [], bits = [0.9,0.4,1,0.6,0.3,0.8,0.5,1,0.7,0.55,0.95,0.35], sparks = [];
  var lp = k.loop(function(dt){
    ph += dt; var d = t.value - cur, rub = Math.abs(d) > 1e-3;
    cur += Math.sign(d) * Math.min(Math.abs(d), dt * 2.5);
    var a = +A.value, b = +B.value, sp = a === b ? 0 : (Math.abs(a - b) / 8) * 26;
    if ((rub || dragA) && sp > 0 && Math.random() < sp * dt) el.push({u:0, x:Math.random(), h:0.6 + Math.random() * 0.6});
    if ((rub || dragA) && Math.random() < dt * 14) sparks.push({x:Math.random(), t:0});
    el.forEach(function(e){ e.u += dt * 1.3; }); el = el.filter(function(e){ return e.u < 1; });
    sparks.forEach(function(s){ s.t += dt; }); sparks = sparks.filter(function(s){ return s.t < 0.35; });
    if (rub) ax = Math.sin(ph * 10) * 0.16 * c.W; else if (!dragA) ax *= 0.85;
    k.redraw();
  });
  lp.play();
  c.pointer(function(ty,p){
    if (ty === "down"){ dragA = p.y < c.H * 0.5; px0 = p.x; }
    else if (ty === "drag" && dragA){ var dx = p.x - px0; px0 = p.x; ax = clamp(p.x - c.W / 2, -c.W * 0.28, c.W * 0.28); t.set(Math.min(10, t.value + Math.abs(dx) * 0.012)); cur = t.value; }
    else if (ty === "up"){ dragA = false; }
  });
  k.draw(function(){
    var W = c.W, H = c.H, f = fs(c), g = c.ctx;
    var a = +A.value, b = +B.value, dlt = Math.abs(a - b);
    var frac = (dlt / 8) * (1 - Math.exp(-cur / 2.5)), N = frac * 5e10, q = N * 1.602e-10;
    /* neg > 0 : B gagne les électrons → B négatif, A positif (correction du signe, nov. 2026) */
    var neg = a === b ? 0 : (b > a ? 1 : -1), qa = neg * q, qb = -neg * q, n = Math.min(10, Math.round(frac * 16));
    /* décor : mur de classe, tableau, table en bois */
    paper(c, "#e9eef5", "#dbe3ee");
    rect(c, W * 0.55, H * 0.04, W * 0.42, H * 0.2, "#2f4a3e", "#7a5a3a", 5, 4);
    T(c, "e⁻  →", W * 0.66, H * 0.1, {size: 15, color: "rgba(255,255,255,.75)", weight: 700}); T(c, "+ / −", W * 0.84, H * 0.16, {size: 14, color: "rgba(255,255,255,.6)", weight: 700});
    var tab = H * 0.88; vband(c, 0, tab, W, H - tab, "#c08a56", "#8e5f35"); rect(c, 0, tab, W, 5, "#d9a774");
    g.save(); g.strokeStyle = "rgba(90,55,25,.25)"; g.lineWidth = 1; for (var wv = 0; wv < 4; wv++){ g.beginPath(); for (var xx = 0; xx <= W; xx += 10) g.lineTo(xx, tab + 12 + wv * 8 + Math.sin(xx * 0.03 + wv) * 2); g.stroke(); } g.restore();
    /* B posé sur deux cales, A tenu à la main */
    var bx0 = W * 0.06, bw0 = W * 0.88, bh = H * 0.17, by0 = H * 0.52, aw = W * 0.38, ah = H * 0.13, axp = clamp(W / 2 + ax - aw / 2, 2, W - aw - 2);
    [bx0 + bw0 * 0.15, bx0 + bw0 * 0.85].forEach(function(x){ rect(c, x - 16, by0 + bh - 2, 32, tab - by0 - bh + 2, "#a8784a", "#7a5230", 1.5, 3); });
    /* papiers attirés par B quand il est chargé */
    var lift = Math.min(1, q / 3.5), top = by0 + bh;
    for (var i = 0; i < 12; i++){ var bx = bx0 + 40 + i * (bw0 - 80) / 11, up = lift * bits[i] * (tab - top - 12) * (neg ? 1 : 0), wob = Math.sin(ph * 6 + i) * 1.5 * (up > 2 ? 1 : 0);
      g.save(); g.fillStyle = "rgba(60,40,20,.18)"; g.beginPath(); g.ellipse(bx, tab + 1, 7, 2, 0, 0, PI2); g.fill(); g.translate(bx, tab - 4 - up + wob); g.rotate(up > 2 ? Math.sin(ph * 4 + i * 2) * 0.4 : (i % 3 - 1) * 0.3); rect(c, -7, -3, 14, 6, "#fffef8", "#a9b2bf", 1, 1); g.restore(); }
    T(c, "petits papiers", W - 10, tab + 18, {size: f - 1.5, color: "#fff", align: "right", weight: 800});
    function glowQ(x, y, w, h, qv){ if (Math.abs(qv) < 0.05) return; g.save(); g.shadowColor = qv > 0 ? "rgba(224,80,60,.55)" : "rgba(47,107,220,.55)"; g.shadowBlur = 8 + 10 * Math.min(1, Math.abs(qv) / 6); rect(c, x + 4, y + 4, w - 8, h - 8, qv > 0 ? "rgba(224,80,60,.15)" : "rgba(47,107,220,.15)", null, 0, 10); g.restore(); }
    glowQ(bx0, by0, bw0, bh, qb);
    matObj(c, b, bx0, by0, bw0, bh, ph);
    T(c, SERIE[b], bx0 + bw0 / 2, by0 + bh * 0.62, {size: f + 1.5, color: "#1d2b44", halo: "rgba(255,255,255,.85)"});
    /* charges en excès : électrons (−) sur celui qui gagne, + sur celui qui perd */
    function charges(x, y, w, sign, cnt){ cnt = Math.min(cnt, Math.floor((w - 36) / 15) + 1); var stp = (w - 36) / Math.max(1, Math.min(9, Math.floor((w - 36) / 15))); for (var j = 0; j < cnt; j++){ var X = x + 18 + j * stp; if (sign < 0){ circ(c, X, y, 6, "#2f6bdc", "#fff", 1.6); T(c, "−", X, y, {size: 12, color: "#fff"}); } else { circ(c, X, y, 6.5, "#fff", P.red, 1.6); T(c, "+", X, y + 0.5, {size: 13, color: P.red, weight: 800}); } } }
    var ox = axp;
    if (neg){ charges(neg > 0 ? ox : bx0 + 6, by0 + 12, neg > 0 ? aw : bw0 - 12, neg > 0 ? -1 : 1, n); }
    /* électrons qui sautent d'un matériau à l'autre */
    if (neg){ el.forEach(function(e){ var x = ox + 16 + e.x * (aw - 32), yA = by0 - ah * 0.45, yB = by0 + bh * 0.45, u = e.u, y = neg > 0 ? yA + (yB - yA) * u : yB + (yA - yB) * u, xo = Math.sin(u * Math.PI) * 18 * e.h;
      circ(c, x + xo, y, 5.5, "#2f6bdc", "#fff", 1.4); T(c, "−", x + xo, y, {size: 11, color: "#fff"}); }); }
    glowQ(axp, by0 - ah, aw, ah, qa);
    matObj(c, a, axp, by0 - ah, aw, ah, ph);
    if (neg){ charges(neg > 0 ? axp : axp, by0 - ah + 12, aw, neg > 0 ? 1 : -1, n); }
    sparks.forEach(function(s){ var sx = axp + 10 + s.x * (aw - 20), sy = by0, r2 = 3 + 9 * s.t; g.save(); g.globalAlpha = 1 - s.t / 0.35; g.strokeStyle = "#f4c542"; g.lineWidth = 1.6; for (var k2 = 0; k2 < 4; k2++){ var an = k2 * Math.PI / 4 + s.x * 3; g.beginPath(); g.moveTo(sx + Math.cos(an) * r2 * 0.3, sy + Math.sin(an) * r2 * 0.3); g.lineTo(sx + Math.cos(an) * r2, sy + Math.sin(an) * r2); g.stroke(); } g.restore(); });
    handA(c, axp + aw / 2, by0 - ah, aw, ah, -ax * 0.25);
    T(c, SERIE[a], axp + aw / 2, by0 - ah * 0.3, {size: f, color: "#1d2b44", halo: "rgba(255,255,255,.85)"});
    chip(c, "A : " + F(qa, 2) + " nC", clamp(axp + aw + 46, 50, W - 50), by0 - ah * 0.5, qa > 0.01 ? P.red : qa < -0.01 ? P.acc : P.grey);
    chip(c, "B : " + F(qb, 2) + " nC", W / 2, by0 + bh + 14, qb > 0.01 ? P.red : qb < -0.01 ? P.acc : P.grey);
    if (neg && q > 0.05) chip(c, "les électrons passent vers : " + SERIE[neg > 0 ? b : a].split(" (")[0], W * 0.28, H * 0.06, P.amber, {size: f});
    else chip(c, "Attrape A et frotte-le sur B", W * 0.28, H * 0.06, P.grey, {size: f});
    ro.set(0, N < 1 ? "0" : S.sci(N, 2)); ro.set(1, F(qa, 2) + " nC"); ro.set(2, F(qb, 2) + " nC"); ro.set(3, "0 nC");
    if (a === b) nt.set("Même matériau : aucun transfert (valeurs : ordres de grandeur, modèle simplifié).", "warn");
    else nt.set("<b>" + SERIE[neg > 0 ? b : a] + "</b> gagne des électrons et devient négatif ; <b>" + SERIE[neg > 0 ? a : b] + "</b> en perd et devient positif. Plus les deux matériaux sont éloignés dans la série, plus le transfert est grand. Total des charges : toujours 0.", "ok");
  });
});

/* ---------- 2 · Deux boules suspendues ---------- */
SIM("p3-c01-deux-boules", function(k,S){
  var c = mkc(k,0.56,0.7);
  var q1 = k.slider("Charge boule 1", -100, 100, 2.5, 60, "nC");
  var q2 = k.slider("Charge boule 2", -100, 100, 2.5, 60, "nC");
  var ro = k.readouts(["Angle d'un fil","Distance entre les boules","Force électrique"]);
  var nt = k.note("", "");
  var tg = 0, tgs = [5,7,9,11,13];
  function newTg(){ tg = tgs[Math.floor(Math.random() * tgs.length)]; }
  k.button("Partager les charges (contact)", function(){ var m = (q1.value + q2.value) / 2; q1.set(m); q2.set(m); });
  k.button("Défi : règle l'angle", function(){ newTg(); q1.set(0); q2.set(0); });
  var KK = 9e9, Mg = 0.0005 * 9.81, L = 0.30, s0 = 0.10, Dm = 0.02;
  function solve(a, b){
    var qq = KK * Math.abs(a * b) * 1e-18, rep = a * b > 0, sg = rep ? 1 : -1;
    if (a * b === 0) return {th:0, d:s0, F:0};
    for (var th = 0.0005; th < 1.45; th += 0.0005){
      var d = s0 + sg * 2 * L * Math.sin(th);
      if (d <= Dm) return {contact:true, th:Math.asin((s0 - Dm) / (2 * L)), d:Dm, F:qq / (Dm * Dm)};
      if (Mg * Math.tan(th) - qq / (d * d) >= 0) return {th:th, d:d, F:qq / (d * d)};
    }
    var dd = s0 + sg * 2 * L * Math.sin(1.45); return {th:sg * 1.45, d:dd, F:qq / (dd * dd), lim:true};
  }
  var ph = 0; var lp = k.loop(function(dt){ ph += dt; if (ph > 1e6) ph = 0; });
  k.draw(function(){
    paper(c,"#fbfcfe","#eaeff7"); var W = c.W, H = c.H, f = fs(c), a = q1.value, b = q2.value;
    var r = solve(a, b), rep = a * b > 0, th = r.th;
    var sc = Math.min((W - 60) / (s0 + 2 * L), (H - 120) / (L + 0.03)), cx = W / 2, y0 = 34;
    var x1 = cx - s0 / 2 * sc, x2 = cx + s0 / 2 * sc, neutral = (a * b === 0);
    var off = neutral ? 0.012 * sc : L * Math.sin(Math.abs(th)) * sc, dy = L * Math.cos(neutral ? 0.04 : th) * sc, by = y0 + dy;
    var bx1 = neutral ? x1 + off * (a !== 0 || b !== 0 ? 1 : 0) : (rep ? x1 - off : x1 + off), bx2 = neutral ? x2 - off * (a !== 0 || b !== 0 ? 1 : 0) : (rep ? x2 + off : x2 - off);
    /* potence */
    rect(c, x1 - 30, y0 - 12, (x2 - x1) + 60, 8, "#7c8aa0", null, 0, 4); ln(c, [x1 - 20, y0 - 4], [x1 - 20, y0 + 6], "#7c8aa0", 3); ln(c, [x2 + 20, y0 - 4], [x2 + 20, y0 + 6], "#7c8aa0", 3);
    ln(c, [x1, y0 - 4], [bx1, by], "#8895aa", 1.8); ln(c, [x2, y0 - 4], [bx2, by], "#8895aa", 1.8);
    /* règle verticale en pointillés et arc d'angle */
    ln(c, [x1, y0], [x1, by + 22], "#c3ccda", 1, [4, 4]);
    if (!neutral && Math.abs(th) > 0.02){ var g = c.ctx; g.save(); g.strokeStyle = P.violet; g.lineWidth = 2; g.beginPath(); var an = Math.PI / 2; g.arc(x1, y0, 46, an - Math.abs(th) * (bx1 < x1 ? -1 : 1) * 0 , an, bx1 < x1 ? false : true); g.stroke(); g.restore();
      chip(c, F(Math.abs(th) * 180 / Math.PI, 1) + "°", x1 + (bx1 < x1 ? -30 : 34), y0 + 50, P.violet); }
    function ball(x, q){ var col = q > 0 ? P.red : q < 0 ? P.acc : P.grey; if (q !== 0) D.glow(c, x, by, 30, col, 0.28 * Math.min(1, Math.abs(q) / 60 + 0.3));
      var gg = c.ctx.createRadialGradient(x - 5, by - 5, 2, x, by, 16); gg.addColorStop(0, "#fff"); gg.addColorStop(1, q > 0 ? "#f2a9a0" : q < 0 ? "#a6bff0" : "#d9dee7"); circ(c, x, by, 16, gg, col, 2.4);
      T(c, q > 0 ? "+" : q < 0 ? "−" : "0", x, by + 1, {size: 18, color: col, weight: 800}); }
    ball(bx1, a); ball(bx2, b);
    /* forces égales (3e loi) */
    if (r.F > 0){ var len = clamp(14 + Math.sqrt(r.F * 1e3) * 26, 16, 70), o = rep ? 1 : -1, ya = by + 40;
      D.arrow(c, bx1, ya, bx1 - o * len, ya, P.green, 3.5); D.arrow(c, bx2, ya, bx2 + o * len, ya, P.green, 3.5);
      chip(c, "F₁→₂", bx2 + o * len / 2 + (rep ? 6 : 0), ya + 20, P.green); chip(c, "F₂→₁", bx1 - o * len / 2 - (rep ? 6 : 0), ya + 20, P.green); }
    /* cote de la distance */
    var dd = Math.abs(bx2 - bx1), ym = by - 30;
    ln(c, [Math.min(bx1, bx2), ym], [Math.max(bx1, bx2), ym], "#9aa6b8", 1.4); chip(c, F((dd) / sc * 100, 1) + " cm", (bx1 + bx2) / 2, ym - 14, P.grey);
    lab(c, "fils 30 cm · boules de 0,5 g · points d'attache à 10 cm", W / 2, H - 14, P.grey, {weight: 600, size: f - 0.5});
    if (tg){ var ang = Math.abs(th) * 180 / Math.PI, ok = !neutral && !r.contact && Math.abs(ang - tg) <= 1;
      chip(c, "Défi : " + tg + "° (±1°)" + (ok ? "  ✓" : ""), W / 2, H - 38, ok ? P.green : P.violet); }
    ro.set(0, F(Math.abs(th) * 180 / Math.PI, 1) + "°"); ro.set(1, F(Math.abs(bx2 - bx1) / sc * 100, 1) + " cm"); ro.set(2, r.F > 0 ? S.sci(r.F * 1e3, 2) + " mN" : "0");
    if (neutral && (a !== 0 || b !== 0)){ ro.set(0, "≈ 2° (schéma)"); ro.set(2, "très faible"); }
    if (a === 0 && b === 0) nt.set("Les deux boules sont neutres : aucune force.", "");
    else if (neutral) nt.set("Une boule neutre est tout de même un peu attirée par la boule chargée (polarisation, voir la simulation 4). Ici elle est dessinée à peine attirée, sans calcul.", "warn");
    else if (r.contact) nt.set("<b>Contact !</b> Les boules attirées se touchent : les charges se partagent (bouton). Chacune porte alors (q₁ + q₂)/2" + ((a + b) === 0 ? " = 0 : elles se neutralisent." : ", de même signe : elles se repoussent."), "warn");
    else if (r.lim) nt.set("Fils presque horizontaux : la répulsion est très forte.", "warn");
    else if (tg){ var an2 = Math.abs(th) * 180 / Math.PI; nt.set(Math.abs(an2 - tg) <= 1 ? "<b>Défi réussi !</b> " + F(an2, 1) + "° pour " + F(a, 0) + " nC et " + F(b, 0) + " nC." : "Défi : obtiens " + tg + "° (±1°) avec des charges de même signe. Actuellement " + F(an2, 1) + "°.", Math.abs(an2 - tg) <= 1 ? "ok" : "warn"); }
    else nt.set(rep ? "Même signe : <b>répulsion</b>. Les deux forces ont la même valeur, même si les charges sont différentes." : "Signes contraires : <b>attraction</b>.", "ok");
  });
});

/* ---------- 3 · Électroscope ---------- */
SIM("p3-c01-electroscope", function(k,S){
  var c = mkc(k,0.92,1.2);
  var qr = k.slider("Charge de la tige", -4, 4, 0.5, 3, "u");
  var dist = k.slider("Distance tige – pommeau", 0, 12, 0.5, 12, "cm", function(){ goal = null; });
  var terre = k.toggle("Relier l'électroscope à la terre (doigt)", false);
  var goal = null, t0 = 0;
  var ro = k.readouts(["Charge totale de l'électroscope","Charge des feuilles","Écartement"]);
  var nt = k.note("", "");
  var Q = 0, touched = false, flash = 0;
  function touch(){ var tr = qr.value / 2; Q += tr; qr.set(qr.value - tr); dist.set(12); touched = true; flash = 0.5; goal = null; }
  k.button("▶ Approcher / éloigner la tige", function(){ goal = dist.value > 6 ? 1.5 : 12; }, true);
  k.button("Toucher le pommeau avec la tige", function(){ touch(); });
  k.button("Tout remettre à zéro", function(){ Q = 0; qr.set(3); dist.set(12); terre.set(false); touched = false; goal = null; });
  function ind(){ return 0.8 * Math.abs(qr.value) / (1 + Math.pow(dist.value / 4, 2)); }
  var geo = {}, ph = 0, flow = [], capPrev = null, drag = false;
  c.pointer(function(ty,p){
    if (ty === "down") drag = Math.abs(p.x - geo.rodX) <= geo.rodW + 40 && Math.abs(p.y - geo.ky) < 70;
    if ((ty === "down" || ty === "drag") && drag){ goal = null;
      var d = clamp((p.x - geo.kx - geo.kr - 8) / geo.px, 0, 12); dist.set(Math.round(d * 2) / 2);
      if (d <= 0.3 && !touched && qr.value !== 0) touch(); else if (d > 1.5) touched = false; k.redraw(); }
    if (ty === "up") drag = false;
  });
  var th0 = 0, lp = k.loop(function(dt){
    ph += dt; t0 += dt; flash = Math.max(0, flash - dt);
    if (t0 > 0.6 && t0 - dt <= 0.6 && dist.value === 12 && Q === 0) goal = 1.5;   /* à l'ouverture : la tige s'approche */
    if (goal != null){ var d = goal - dist.value; if (Math.abs(d) < 0.05){ dist.set(goal); goal = null; } else dist.set(dist.value + Math.sign(d) * Math.min(Math.abs(d), dt * 6)); }
    flow.forEach(function(e){ e.u += dt * 1.4; }); flow = flow.filter(function(e){ return e.u < 1; });
    k.redraw();
  }); lp.play();
  k.draw(function(){
    var W = c.W, H = c.H, f = fs(c), g = c.ctx, s = Math.sign(qr.value), ID = ind();
    if (terre.value) Q = -s * ID;
    var leaf = Q + s * ID, cap = -s * ID;
    var target = (leaf === 0 ? 0 : 72 * (1 - Math.exp(-Math.abs(leaf) / 2.5))) * Math.PI / 180; th0 += (target - th0) * 0.2; var th = th0;
    /* électrons mobiles qui montent ou descendent dans la tige métallique quand la répartition change */
    var ce = cap; if (capPrev != null && Math.abs(ce - capPrev) > 1e-3){ var nn = Math.min(4, Math.ceil(Math.abs(ce - capPrev) * 6)); for (var e = 0; e < nn; e++) flow.push({u: -e * 0.12, up: ce < capPrev}); } capPrev = ce;
    /* décor : mur, paillasse */
    paper(c, "#edf1f7", "#dde4ee");
    var bench = H * 0.9; vband(c, 0, bench, W, H - bench, "#5b6678", "#394354"); rect(c, 0, bench, W, 4, "#7d889a");
    var ph2 = W < 430, kx = W * (ph2 ? 0.34 : 0.33), ky = H * 0.15, kr = Math.min(30, W * 0.065), jt = H * 0.38, jb = bench - 4, jw = Math.min(W * (ph2 ? 0.5 : 0.42), 250);
    geo.ky = ky;
    /* bocal en verre (volume : fonds elliptiques, reflets) */
    var ex = jw / 2, ey = Math.min(16, jw * 0.08);
    g.save(); g.fillStyle = "rgba(15,27,45,.18)"; g.beginPath(); g.ellipse(kx + 6, jb + 2, ex + 10, ey * 0.7, 0, 0, PI2); g.fill(); g.restore();
    g.save(); var gg = g.createLinearGradient(kx - ex, 0, kx + ex, 0); gg.addColorStop(0, "rgba(170,200,235,.55)"); gg.addColorStop(0.25, "rgba(235,244,255,.25)"); gg.addColorStop(0.75, "rgba(220,235,252,.2)"); gg.addColorStop(1, "rgba(150,185,225,.55)");
    g.beginPath(); g.ellipse(kx, jt, ex, ey, 0, Math.PI, 0); g.lineTo(kx + ex, jb - ey); g.ellipse(kx, jb - ey, ex, ey, 0, 0, Math.PI); g.closePath(); g.fillStyle = gg; g.fill(); g.strokeStyle = "rgba(100,130,170,.8)"; g.lineWidth = 2; g.stroke();
    g.beginPath(); g.ellipse(kx, jt, ex, ey, 0, 0, PI2); g.strokeStyle = "rgba(100,130,170,.6)"; g.lineWidth = 1.5; g.stroke(); g.restore();
    rect(c, kx - ex - 8, jb - 8, jw + 16, 14, "#6b7787", null, 0, 4); rect(c, kx - ex - 8, jb - 8, jw + 16, 4, "#8d98a9", null, 0, 2);
    var ly = jt + (jb - jt) * 0.2, ll = (jb - ly) * 0.74;
    /* tige métallique, bouchon isolant, pommeau */
    var sg = g.createLinearGradient(kx - 4, 0, kx + 4, 0); sg.addColorStop(0, "#8d98a6"); sg.addColorStop(0.5, "#e1e6ec"); sg.addColorStop(1, "#6b7685");
    g.fillStyle = sg; g.fillRect(kx - 4, ky + kr - 2, 8, ly - ky - kr + 4);
    rect(c, kx - 20, jt - ey - 6, 40, 20, "#3a3f47", "#202429", 1.5, 6); rect(c, kx - 16, jt - ey - 4, 32, 5, "rgba(255,255,255,.15)", null, 0, 2);
    var gr = g.createRadialGradient(kx - kr * 0.35, ky - kr * 0.4, kr * 0.1, kx, ky, kr); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.5, "#c9d1db"); gr.addColorStop(1, "#7f8a99"); circ(c, kx, ky, kr, gr, "#5f6b7a", 1.8);
    if (Math.abs(cap) > 0.05) D.glow(c, kx, ky, kr * 2.2, cap > 0 ? "#e0503c" : "#2f6bdc", Math.min(0.45, Math.abs(cap) * 0.15));
    /* feuilles d'or (volume : dégradé, frémissement) */
    function leafAt(sgn){ var a = th + Math.sin(ph * 7 + sgn) * 0.012 * (th > 0.05 ? 1 : 0); g.save(); g.translate(kx, ly); g.rotate(-sgn * a);
      var lg = g.createLinearGradient(-6, 0, 6, 0); lg.addColorStop(0, "#b8860b"); lg.addColorStop(0.45, "#ffe58a"); lg.addColorStop(1, "#c99a1e");
      g.fillStyle = lg; g.beginPath(); g.moveTo(-5, 0); g.lineTo(5, 0); g.quadraticCurveTo(7 + sgn * 2, ll * 0.5, 6, ll); g.lineTo(-6, ll); g.quadraticCurveTo(-7 + sgn * 2, ll * 0.5, -5, 0); g.closePath(); g.fill(); g.strokeStyle = "rgba(140,100,10,.7)"; g.lineWidth = 1; g.stroke(); g.restore(); }
    leafAt(-1); leafAt(1); rect(c, kx - 7, ly - 6, 14, 10, "#8d98a6", "#5f6b7a", 1.2, 2);
    function signs(val, x, y, dx, dy, nmax){ var n = Math.min(nmax, Math.round(Math.abs(val) * 1.6)); for (var i = 0; i < n; i++){ var X = x + dx * (i - (n - 1) / 2), Y = y + dy * (i - (n - 1) / 2); if (val < 0){ circ(c, X, Y, 6, "#2f6bdc", "#fff", 1.4); T(c, "−", X, Y, {size: 11, color: "#fff"}); } else { circ(c, X, Y, 6.5, "#fff", P.red, 1.5); T(c, "+", X, Y + 0.5, {size: 12, color: P.red, weight: 800}); } } }
    signs(cap, kx, ky - kr - 13, 15, 0, 6);
    var nl = Math.min(5, Math.round(Math.abs(leaf) * 1.4));
    for (var i = 0; i < nl; i++){ var u = (i + 1) / (nl + 1); [-1, 1].forEach(function(sgn){ var X = kx + sgn * (ll * Math.sin(th) * u + 15), Y = ly + ll * Math.cos(th) * u; if (leaf < 0){ circ(c, X, Y, 6, "#2f6bdc", "#fff", 1.4); T(c, "−", X, Y, {size: 11, color: "#fff"}); } else { circ(c, X, Y, 6.5, "#fff", P.red, 1.5); T(c, "+", X, Y + 0.5, {size: 12, color: P.red, weight: 800}); } }); }
    /* flux d'électrons dans la tige */
    flow.forEach(function(e){ if (e.u < 0) return; var y = e.up ? ly - (ly - ky - kr) * e.u : ky + kr + (ly - ky - kr) * e.u; circ(c, kx, y, 5, "#2f6bdc", "#fff", 1.4); T(c, "−", kx, y, {size: 10, color: "#fff"}); });
    /* tige chargée tenue à la main, glissable */
    var px = Math.max(8, (W - kx - kr - 8 - 150) / 12); geo.kx = kx; geo.kr = kr; geo.px = px;
    var rx = kx + kr + 8 + dist.value * px, rw = Math.min(170, W - rx + 40), rh = 22;
    geo.rodX = rx + rw / 2; geo.rodW = rw / 2;
    if (qr.value !== 0){ var col = qr.value > 0 ? P.red : P.acc;
      D.glow(c, rx + 20, ky, 36, col, Math.min(0.5, Math.abs(qr.value) * 0.1));
      var rg = g.createLinearGradient(0, ky - rh / 2, 0, ky + rh / 2);
      if (qr.value > 0){ rg.addColorStop(0, "rgba(235,245,255,.95)"); rg.addColorStop(0.5, "rgba(180,210,240,.85)"); rg.addColorStop(1, "rgba(120,160,205,.95)"); } else { rg.addColorStop(0, "#5c6370"); rg.addColorStop(0.45, "#2a2f38"); rg.addColorStop(1, "#111419"); }
      rect(c, rx, ky - rh / 2, rw, rh, rg, qr.value > 0 ? "#6f93bd" : "#0b0d10", 1.5, rh / 2); rect(c, rx + 8, ky - rh / 2 + 4, rw - 50, 3, "rgba(255,255,255,.55)", null, 0, 2);
      for (i = 0; i < 3; i++){ var X = rx + 16 + i * 22; if (qr.value > 0){ circ(c, X, ky, 6.5, "#fff", P.red, 1.5); T(c, "+", X, ky + 0.5, {size: 12, color: P.red, weight: 800}); } else { circ(c, X, ky, 6, "#2f6bdc", "#fff", 1.4); T(c, "−", X, ky, {size: 11, color: "#fff"}); } }
      /* main */
      var hx = rx + rw - 30; g.save(); g.fillStyle = "#1f4b9e"; g.beginPath(); g.moveTo(hx + 18, ky - 16); g.lineTo(W + 40, ky - 40); g.lineTo(W + 40, ky + 20); g.lineTo(hx + 18, ky + 16); g.closePath(); g.fill();
      var sk = g.createLinearGradient(0, ky - 18, 0, ky + 18); sk.addColorStop(0, "#f6d2ae"); sk.addColorStop(1, "#dca577"); g.fillStyle = sk;
      g.beginPath(); g.ellipse(hx + 6, ky, 20, 17, 0, 0, PI2); g.fill(); for (i = 0; i < 4; i++){ g.beginPath(); g.ellipse(hx - 10 + i * 8, ky + 12, 5, 7, 0, 0, PI2); g.fill(); } g.beginPath(); g.ellipse(hx - 12, ky - 9, 9, 5, 0.3, 0, PI2); g.fill(); g.restore();
      chip(c, (qr.value > 0 ? "tige de verre +" : "tige d'ébonite −") + " (glisse-la)", clamp(rx + rw / 2, 90, W - 90), ky - 36, col); }
    else chip(c, "tige neutre", Math.min(rx + 50, W - 50), ky - 4, P.grey);
    if (flash > 0) D.glow(c, kx + kr, ky, 40 * flash * 2, "#ffe58a", 0.9 * flash * 2);
    if (dist.value > 0.4 && dist.value < 11.5){ ln(c, [kx + kr + 4, ky + 32], [rx - 2, ky + 32], "#9aa6b8", 1.3); chip(c, F(dist.value, 1) + " cm", (kx + kr + rx) / 2, ky + 46, P.grey); }
    if (terre.value){ var gx2 = kx - ex - 30; g.save(); g.strokeStyle = P.green; g.lineWidth = 3; g.lineJoin = "round"; g.beginPath(); g.moveTo(kx - kr * 0.7, ky + kr * 0.6); g.quadraticCurveTo(gx2, ky + kr * 2, gx2, jt); g.lineTo(gx2, bench - 2); g.stroke();
      for (i = 0; i < 3; i++) ln(c, [gx2 - 14 + i * 4, bench + 6 + i * 6], [gx2 + 14 - i * 4, bench + 6 + i * 6], P.green, 2.6); g.restore(); chip(c, "terre", gx2, jt - 14, P.green); }
    chip(c, "feuilles d'or", kx + ex - 46, jb - 30, "#a37a10", {size: f - 1});
    ro.set(0, F(Q, 2) + " u"); ro.set(1, F(leaf, 2) + " u"); ro.set(2, F(th * 180 / Math.PI, 0) + "° / feuille");
    var msg;
    if (qr.value === 0 && Q === 0) msg = "Rien n'est chargé : les feuilles pendent.";
    else if (Math.abs(leaf) < 0.05) msg = terre.value ? "Les électrons ont fui vers la terre (ou en viennent) : feuilles retombées. Si tu coupes la terre puis éloignes la tige, l'électroscope reste chargé du signe contraire à la tige." : "Feuilles fermées.";
    else if (Math.abs(Q) < 0.05) msg = "Électroscope <b>neutre</b> au total mais feuilles écartées : les charges mobiles se sont déplacées (influence).";
    else msg = "Électroscope <b>chargé " + (Q > 0 ? "positivement" : "négativement") + "</b> : la charge est restée sur le métal.";
    nt.set(msg, "ok");
  });
});

/* ---------- 4 · Polarisation ---------- */
SIM("p3-c01-polarisation", function(k,S){
  var c = mkc(k,0.88,1.12);
  var sgnSel = k.seg("Signe du bâton", [["1","+"],["-1","−"]], "1");
  var mat = k.seg("Matériau de la boule", [["iso","Isolant"],["cond","Conducteur"]], "iso");
  var d = k.slider("Distance bâton – boule", 3, 20, 0.5, 4, "cm");
  var ro = k.readouts(["Force sur la boule"]);
  var nt = k.note("", "");
  var geo = {tip3: 0, px: 10}, ph = 0;
  c.pointer(function(ty,p){ if (ty === "down" || ty === "drag"){ if (ty === "down" && p.y > c.H * 0.42) return; var v = clamp(3 + (geo.tip3 - (p.x + 50)) / geo.px, 3, 20); d.set(Math.round(v * 2) / 2); k.redraw(); } });
  var lp = k.loop(function(dt){ ph += dt; k.redraw(); }); lp.play();
  k.draw(function(){
    paper(c); var W = c.W, H = c.H, f = fs(c), s = +sgnSel.value, cond = mat.value === "cond", col = s > 0 ? P.red : P.acc, dir = s > 0 ? 1 : -1;
    var F0 = Math.pow(3 / d.value, 5), lvl = F0 > 1 ? "forte" : F0 > 0.15 ? "moyenne" : F0 > 0.02 ? "faible" : "négligeable";
    var ty = H * 0.2, R = Math.min(30, W * 0.065), shift = Math.min(12, 12 * Math.sqrt(F0));
    /* vue d'ensemble (haut) : bâton glissable, boule suspendue */
    var bxb = W - R - 30, px = (bxb - R - 6 - 100 - 14) / 17, tip = bxb - R - 6 - (d.value - 3) * px, bx = bxb - shift;
    geo = {tip3: bxb - R - 6, px: px};
    ln(c, [bx, ty - R], [bx, 8], "#9aa6b8", 1.6);
    rect(c, tip - 100, ty - 13, 100, 26, s > 0 ? "#f7d3cd" : "#cfdcf6", col, 2.4, 13);
    for (var i = 0; i < 3; i++) T(c, s > 0 ? "+" : "−", tip - 80 + i * 30, ty, {size: 18, color: col, weight: 800});
    var bgr = c.ctx.createRadialGradient(bx - 8, ty - 8, 3, bx, ty, R); bgr.addColorStop(0, "#fff"); bgr.addColorStop(1, cond ? "#aab6c6" : "#e6eaf0"); circ(c, bx, ty, R, bgr, "#76849a", 2.2);
    D.arrow(c, bx - R - 2, ty + R + 16, bx - R - 12 - Math.min(40, F0 * 40 + 14), ty + R + 16, P.green, 3.5);
    chip(c, "attraction : " + lvl, bx - R - 24, ty + R + 38, P.green);
    chip(c, "bâton " + (s > 0 ? "+" : "−") + " · " + F(d.value, 1) + " cm", tip - 60, ty - 32, col, {size: f - 1});
    /* zoom sur la boule */
    var zr = Math.min(H * 0.24, W * 0.28), zx = W * 0.5, zy = H * 0.6;
    ln(c, [bx, ty + R], [zx + zr * 0.75, zy - zr * 0.66], "#c4cddb", 1.4, [5, 4]); ln(c, [bx - R * 0.9, ty + R * 0.5], [zx - zr * 0.75, zy - zr * 0.66], "#c4cddb", 1.4, [5, 4]);
    var g = c.ctx; g.save(); g.beginPath(); g.arc(zx, zy, zr, 0, PI2); g.clip(); g.fillStyle = cond ? "#e4e9f1" : "#f3f1ea"; g.fillRect(zx - zr, zy - zr, zr * 2, zr * 2);
    var sat = Math.min(1, 0.25 + F0 * 1.1), cols = 5, rows = 4, cw = zr * 1.9 / cols, rh = zr * 1.9 / rows, r, q, X, Y;
    for (r = 0; r < rows; r++) for (q = 0; q < cols; q++){ X = zx - zr * 0.95 + (q + 0.5) * cw; Y = zy - zr * 0.95 + (r + 0.5) * rh;
      if (!cond) circ(c, X + dir * cw * 0.2 * sat, Y, cw * 0.4, "rgba(110,150,235,.2)", "rgba(90,130,220,.55)", 1.3);
      T(c, "+", X, Y, {size: 18, color: "#d2685c", weight: 800}); }
    if (cond){ var sl = Math.min(1, 0.2 + F0 * 0.9) * zr * 0.55;
      for (i = 0; i < 30; i++){ var ex = zx + (((i * 37) % 17) / 17 - 0.5) * zr * 1.5, ey = zy + (((i * 53) % 19) / 19 - 0.5) * zr * 1.55;
        ex = clamp(ex + dir * sl + Math.sin(ph * 3 + i) * 2, zx - zr * 0.82, zx + zr * 0.82); circ(c, ex, ey + Math.cos(ph * 2.4 + i) * 2, 3.8, "#2f6bdc", "#fff", 1); } }
    g.restore(); circ(c, zx, zy, zr, null, "#76849a", 2.6);
    var near = dir > 0 ? "−" : "+", far = dir > 0 ? "+" : "−";
    for (i = 0; i < 4; i++){ var yy = zy + (i - 1.5) * zr * 0.36;
      T(c, near, zx + zr - 15, yy, {size: 20, color: near === "+" ? P.red : P.acc, weight: 800, halo: "#fff"}); T(c, far, zx - zr + 15, yy, {size: 20, color: far === "+" ? P.red : P.acc, weight: 800, halo: "#fff"}); }
    chip(c, "côté proche du bâton : " + near + "   ·   côté éloigné : " + far, zx, zy + zr + 18, P.ink, {size: f - 1});
    chip(c, cond ? "zoom : métal, électrons libres (bleus)" : "zoom : isolant, nuages déformés", zx, zy + zr + 40, P.grey, {size: f - 1});
    ro.set(0, lvl + " (attraction)");
    var m1 = s > 0 ? "Bâton <b>+</b> : les électrons de la boule sont attirés vers le bâton ; le côté proche devient <b>−</b>, le côté éloigné <b>+</b>." : "Bâton <b>−</b> : les électrons de la boule sont repoussés ; le côté proche devient <b>+</b>. Attraction aussi !";
    var m2 = cond ? " Dans un conducteur, les électrons libres se déplacent beaucoup : la séparation est grande." : " Dans un isolant, les électrons restent liés à leur atome : on a seulement de petites déformations.";
    nt.set(m1 + m2 + " (Échelle de la force qualitative ; elle diminue très vite avec la distance.)", "ok");
  });
});

})();
