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
SIM("p3-c01-frottement", function(k,S){
  var c = mkc(k,0.72,0.95);
  var A = k.select("Matériau A (celui qui frotte)", SOPT, 0);
  var B = k.select("Matériau B (celui qui est frotté)", SOPT, 7);
  var t = k.slider("Durée du frottement", 0, 10, 0.5, 4, "s");
  k.button("Frotter (rejouer)", function(){ cur = 0; }, true);
  var ro = k.readouts(["Électrons transférés","Charge de A","Charge de B","Total A + B"]);
  var nt = k.note("", "");
  var cur = 4, ph = 0, ax = 0, dragA = false, px0 = 0, el = [], bits = [0.9,0.4,1,0.6,0.3,0.8,0.5,1,0.7,0.55,0.95,0.35];
  var lp = k.loop(function(dt){
    ph += dt; var d = t.value - cur, rub = Math.abs(d) > 1e-3;
    cur += Math.sign(d) * Math.min(Math.abs(d), dt * 2.5);
    var a = +A.value, b = +B.value, sp = a === b ? 0 : (Math.abs(a - b) / 8) * 26;
    if (rub && sp > 0 && Math.random() < sp * dt) el.push({u:0, x:Math.random()});
    el.forEach(function(e){ e.u += dt * 1.5; }); el = el.filter(function(e){ return e.u < 1; });
    if (rub) ax = Math.sin(ph * 10) * 0.16 * c.W; else if (!dragA) ax *= 0.85;
    k.redraw();
  });
  lp.play();
  c.pointer(function(ty,p){
    if (ty === "down"){ dragA = p.y < c.H * 0.46; px0 = p.x; }
    else if (ty === "drag" && dragA){ var dx = p.x - px0; px0 = p.x; ax = clamp(p.x - c.W / 2, -c.W * 0.28, c.W * 0.28); t.set(Math.min(10, t.value + Math.abs(dx) * 0.012)); }
    else if (ty === "up"){ dragA = false; }
  });
  k.draw(function(){
    paper(c); var W = c.W, H = c.H, f = fs(c);
    var a = +A.value, b = +B.value, dlt = Math.abs(a - b);
    var frac = (dlt / 8) * (1 - Math.exp(-cur / 2.5)), N = frac * 5e10, q = N * 1.602e-10;
    var neg = a === b ? 0 : (b > a ? 1 : -1), qa = -neg * q, qb = neg * q, n = Math.min(10, Math.round(frac * 16));
    /* table et papiers */
    var by0 = H * 0.44, bh = H * 0.27, bx0 = W * 0.06, bw0 = W * 0.88, tab = H * 0.92;
    rect(c, 0, tab, W, H - tab, "#e5e9f0"); ln(c, [0, tab], [W, tab], "#c6cdd8", 2);
    var lift = Math.min(1, q / 3.5);
    for (var i = 0; i < 12; i++){ var bx = bx0 + 18 + i * (bw0 - 36) / 11, up = lift * bits[i] * (tab - by0 - bh - 14) * (neg ? 1 : 0), wob = Math.sin(ph * 6 + i) * 1.5 * (up > 2 ? 1 : 0);
      c.ctx.save(); c.ctx.translate(bx, tab - 5 - up + wob); c.ctx.rotate(up > 2 ? Math.sin(ph * 4 + i * 2) * 0.35 : 0); rect(c, -6, -2.5, 12, 5, "#fff", "#9aa6b6", 1.2, 1); c.ctx.restore(); }
    chip(c, "papiers", W - 38, tab + 13, P.grey, {size: f - 1});
    /* bloc B (frotté) puis bloc A (qui frotte) */
    function block(x, y, w, h, i, qv, name){
      var col = qv > 0.02 ? "#fbe6e3" : qv < -0.02 ? "#e2eaf9" : MATC[i];
      rect(c, x, y, w, h, col, "#8795ab", 2, 12);
      var cols = Math.max(4, Math.round(w / 46)), rows = Math.max(2, Math.round(h / 40));
      for (var r = 0; r < rows; r++) for (var q2 = 0; q2 < cols; q2++){ var X = x + (q2 + 0.5) * w / cols, Y = y + (r + 0.5) * h / rows;
        T(c, "+", X - 5, Y, {size: 15, color: "#d9857b", weight: 800}); circ(c, X + 7, Y, 3.2, "#6e92e6"); }
      T(c, name, x + w / 2, y + h / 2 + 1, {size: f + 1.5, color: "#1d2b44", halo: col});
    }
    var aw = W * 0.4, ah = H * 0.24, axp = W / 2 + ax - aw / 2;
    block(bx0, by0, bw0, bh, b, qb, SERIE[b]);
    /* échange d'électrons à l'interface */
    if (neg){ var ox = clamp(axp, bx0, bx0 + bw0 - aw);
      el.forEach(function(e){ var x = ox + 14 + e.x * (aw - 28), y1 = by0 - 26, y2 = by0 + 26, y = neg > 0 ? y1 + (y2 - y1) * e.u : y2 + (y1 - y2) * e.u;
        circ(c, x, y, 5, "#2f6bdc", "#fff", 1.4); T(c, "−", x, y, {size: 11, color: "#fff"}); }); }
    block(clamp(axp, 2, W - aw - 2), by0 - ah, aw, ah, a, qa, SERIE[a]);
    var gx = neg > 0 ? bx0 : clamp(axp, 2, W - aw - 2), gw = neg > 0 ? bw0 : aw, gy = neg > 0 ? by0 + 10 : by0 - 10;
    for (i = 0; i < n; i++){ circ(c, gx + 16 + i * (gw - 32) / Math.max(1, 9), gy, 5.2, "#2f6bdc", "#fff", 1.5); T(c, "−", gx + 16 + i * (gw - 32) / Math.max(1, 9), gy, {size: 11, color: "#fff"}); }
    var lx = neg > 0 ? clamp(axp, 2, W - aw - 2) : bx0, lw2 = neg > 0 ? aw : bw0, ly = neg > 0 ? by0 - 10 : by0 + 10;
    for (i = 0; i < n; i++) T(c, "+", lx + 16 + i * (lw2 - 32) / 9, ly, {size: 16, color: P.red, weight: 800});
    chip(c, "A : " + F(qa, 2) + " nC", clamp(axp, 2, W - aw - 2) + aw / 2, by0 - ah - 16, qa > 0.01 ? P.red : qa < -0.01 ? P.acc : P.grey);
    chip(c, "B : " + F(qb, 2) + " nC", W / 2, by0 + bh + 14, qb > 0.01 ? P.red : qb < -0.01 ? P.acc : P.grey);
    if (neg && q > 0.05) lab(c, "les électrons passent vers : " + SERIE[neg > 0 ? b : a].split(" (")[0], W / 2, H * 0.05, P.amber, {weight: 800});
    else lab(c, "Glisse le bloc A sur B pour frotter", W / 2, H * 0.045, P.grey, {weight: 700});
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
  var c = mkc(k,0.8,1.05);
  var qr = k.slider("Charge de la tige", -4, 4, 0.5, 3, "u");
  var dist = k.slider("Distance tige – pommeau", 0, 12, 0.5, 12, "cm");
  var terre = k.toggle("Relier l'électroscope à la terre (doigt)", false);
  var ro = k.readouts(["Charge totale de l'électroscope","Charge des feuilles","Écartement"]);
  var nt = k.note("", "");
  var Q = 0, touched = false;
  function touch(){ var tr = qr.value / 2; Q += tr; qr.set(qr.value - tr); dist.set(12); touched = true; }
  k.button("Toucher le pommeau avec la tige", function(){ touch(); });
  k.button("Tout remettre à zéro", function(){ Q = 0; qr.set(3); dist.set(12); terre.set(false); touched = false; });
  function ind(){ return 0.8 * Math.abs(qr.value) / (1 + Math.pow(dist.value / 4, 2)); }
  var geo = {};
  c.pointer(function(ty,p){
    if (ty === "down" || ty === "drag"){ if (ty === "down" && Math.abs(p.x - geo.rodX) > geo.rodW + 40) return;
      var d = clamp((p.x - geo.kx - geo.kr - 8) / geo.px, 0, 12); dist.set(Math.round(d * 2) / 2);
      if (d <= 0.3 && !touched && qr.value !== 0) touch(); else if (d > 1.5) touched = false; k.redraw(); }
  });
  var th0 = 0, lp = k.loop(function(dt){ k.redraw(); }); lp.play();
  k.draw(function(){
    paper(c); var W = c.W, H = c.H, f = fs(c), s = Math.sign(qr.value), ID = ind();
    if (terre.value) Q = -s * ID;
    var leaf = Q + s * ID, cap = -s * ID;
    var target = (leaf === 0 ? 0 : 72 * (1 - Math.exp(-Math.abs(leaf) / 2.5))) * Math.PI / 180; th0 += (target - th0) * 0.35; var th = th0;
    var kx = W * 0.4, ky = H * 0.13, kr = Math.min(22, W * 0.05), jt = H * 0.34, jb = H * 0.9, jw = Math.min(W * 0.34, 150);
    /* bocal en verre */
    rect(c, kx - jw / 2, jt, jw, jb - jt, "rgba(205,224,244,.35)", "#8fa8c6", 2.5, 16);
    rect(c, kx - jw / 2 + 8, jt + 8, 7, jb - jt - 30, "rgba(255,255,255,.7)", null, 0, 3);
    rect(c, kx - jw / 2 - 6, jb - 4, jw + 12, 10, "#aab4c3", null, 0, 5);
    rect(c, kx - 15, jt - 6, 30, 14, "#6b4f3a", null, 0, 4);                 /* bouchon */
    var ly = jt + (jb - jt) * 0.26, ll = (jb - ly) * 0.7;
    ln(c, [kx, ky + kr], [kx, ly], "#5b6778", 5);
    var gr = c.ctx.createRadialGradient(kx - 6, ky - 6, 3, kx, ky, kr); gr.addColorStop(0, "#fff"); gr.addColorStop(1, "#b7c0cc"); circ(c, kx, ky, kr, gr, "#6c7889", 2);
        function leafAt(sg){ var ex = kx + sg * ll * Math.sin(th), ey = ly + ll * Math.cos(th); c.ctx.save(); c.ctx.strokeStyle = "#e0a91a"; c.ctx.lineWidth = 9; c.ctx.lineCap = "round"; c.ctx.beginPath(); c.ctx.moveTo(kx, ly); c.ctx.lineTo(ex, ey); c.ctx.stroke(); c.ctx.strokeStyle = "#ffe58a"; c.ctx.lineWidth = 3.5; c.ctx.stroke(); c.ctx.restore(); return [ex, ey]; }
    leafAt(-1); leafAt(1); circ(c, kx, ly, 4, "#5b6778");
    function signs(val, x, y, dx, dy, nmax){ var n = Math.min(nmax, Math.round(Math.abs(val) * 1.6)); for (var i = 0; i < n; i++) T(c, val > 0 ? "+" : "−", x + dx * (i - (n - 1) / 2), y + dy * (i - (n - 1) / 2), {size: 16, color: val > 0 ? P.red : P.acc, weight: 800, halo: "#fff"}); }
    signs(cap, kx, ky - kr - 12, 12, 0, 6);
    var nl = Math.min(5, Math.round(Math.abs(leaf) * 1.4));
    for (var i = 0; i < nl; i++){ var u = (i + 1) / (nl + 1); [-1, 1].forEach(function(sg){ T(c, leaf > 0 ? "+" : "−", kx + sg * (ll * Math.sin(th) * u + 12), ly + ll * Math.cos(th) * u, {size: 15, color: leaf > 0 ? P.red : P.acc, weight: 800, halo: "#fff"}); }); }
    if (Math.abs(leaf) > 0.02) signs(leaf * 0.4, kx + 16, jt + 30, 0, 10, 3);
    /* tige chargée : à droite, glissable */
    var px = Math.max(8, (W - kx - kr - 8 - 125) / 12); geo = {kx: kx, kr: kr, px: px};
    var rx = kx + kr + 8 + dist.value * px, rw = Math.min(120, W - rx - 8);
    geo.rodX = rx + rw / 2; geo.rodW = rw / 2;
    if (qr.value !== 0 && rw > 30){ var col = qr.value > 0 ? P.red : P.acc;
      rect(c, rx, ky - 12, rw, 24, qr.value > 0 ? "#f7d3cd" : "#cfdcf6", col, 2.4, 12);
      for (i = 0; i < 3; i++) T(c, qr.value > 0 ? "+" : "−", rx + 18 + i * (rw - 36) / 2, ky, {size: 17, color: col, weight: 800});
      chip(c, "tige " + (qr.value > 0 ? "+" : "−") + " (glisse-la)", clamp(rx + rw / 2 - 6, 70, W - 70), ky - 32, col); }
    else chip(c, "tige neutre", rx + 40, ky - 4, P.grey);
    if (dist.value > 0.4 && dist.value < 11) { ln(c, [kx + kr + 4, ky + 32], [rx - 2, ky + 32], "#9aa6b8", 1.3); chip(c, F(dist.value, 1) + " cm", (kx + kr + rx) / 2, ky + 48, P.grey); }
    if (terre.value){ ln(c, [kx, ly], [kx, jb + 8], P.green, 3, [5, 4]); chip(c, "terre", kx + 30, jb - 6, P.green); }
    chip(c, "feuilles", kx + jw / 2 - 34, jb - 24, P.grey, {size: f - 1});
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
