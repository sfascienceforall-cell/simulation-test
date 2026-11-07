/* Physique 4e · chapitre 5 · Travail, puissance et rendement */
(function(){
var G = 9.8, D2R = Math.PI / 180;

SFA.sim({
  id:"p4-c05-valise", ch:"c05", tag:"Classique",
  titre:"Tirer une valise : le travail W = F·d·cos θ",
  resume:"Seule la partie de la force dans le sens du déplacement travaille.",
  but:"Règle la force, la distance et l'angle de la poignée (ou tire sur la poignée à la main). Lance l'animation : l'aire sous F·cos θ est le travail.",
  aRetenir:"Le travail d'une force constante est W = F·d·cos θ (joules). Dans le cas simple θ = 0° : W = F·d. Une force perpendiculaire au déplacement (θ = 90°) ne travaille pas. Sans déplacement, pas de travail.",
  piege:"« Plus je me fatigue, plus je travaille » : faux. Tenir une charge immobile fatigue les muscles, mais le travail physique de la force exercée sur la charge est nul (d = 0). Porter horizontalement : la force du bras est verticale, perpendiculaire au déplacement : W = 0.",
  build:function(k,S){
    var P = S.draw.palette, sc = PX.canvas(k, 0.5, 0.78), g1 = PX.canvas(k, 0.45, 0.62), st = {p:0.3, hint:true}, geo = {};
    var F = k.slider("Force F exercée", 10, 200, 10, 100, "N");
    var d = k.slider("Distance parcourue d", 1, 20, 1, 10, "m");
    var th = k.slider("Angle θ (force / déplacement)", 0, 90, 5, 30, "°", function(){ st.hint = false; });
    var ro = k.readouts(["Composante utile F·cos θ", "Travail W", "Part de F « perdue »"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.p = Math.min(1, st.p + dt / 3); if (st.p >= 1) lp.pause(); k.redraw(); });
    k.button("▶ Déplacer la valise", function(){ st.p = 0; st.hint = false; lp.play(); }, true);
    PX.drag(k, sc, function(){ return [{x:geo.hx, y:geo.hy, r:10, set:function(px, py){ st.hint = false; var a = Math.atan2(geo.ay - py, Math.max(1, px - geo.ax)) * 180 / Math.PI; th.set(Math.max(0, Math.min(90, Math.round(a / 5) * 5))); }}]; });
    k.draw(function(){
      var f = F.value, D = d.value, a = th.value, ar = a * D2R, Fx = a === 90 ? 0 : f * Math.cos(ar), Fy = f * Math.sin(ar), W = Fx * D, done = Fx * D * st.p, ph = PX.phone(sc);
      var u = ph ? 0.82 : 1, gy = sc.H - 34, Lh = 84 * u, run = sc.W - 200 * u, bx = 30 + st.p * run, ax = bx + 52 * u, ay = gy - 34 * u;
      var hx = ax + Lh * Math.cos(ar), hy = ay - Lh * Math.sin(ar);
      geo.ax = ax; geo.ay = ay; geo.hx = hx; geo.hy = hy;
      sc.clear(); var ctx = sc.ctx;
      PX.bg(sc, "#eef3fa", "#dde5f0");
      ctx.fillStyle = "#c3ccd8"; ctx.fillRect(0, gy, sc.W, sc.H - gy);
      ctx.fillStyle = "rgba(15,27,45,.25)"; var off = (st.p * D * 24) % 24; for (var q = -off; q < sc.W; q += 24){ ctx.fillRect(q, gy + 8, 2, 7); }
      ctx.fillStyle = "rgba(15,27,45,.2)"; ctx.fillRect(0, gy, sc.W, 1.5);
      /* valise */
      ctx.save(); ctx.translate(bx, gy - 6);
      ctx.fillStyle = PX.lin(sc, 0, -40 * u, 0, 0, [[0, "#2f5cae"], [1, "#1a3a80"]]); PX.rr(ctx, 0, -42 * u, 56 * u, 40 * u, 6); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14 * u, -38 * u); ctx.lineTo(14 * u, -6 * u); ctx.moveTo(42 * u, -38 * u); ctx.lineTo(42 * u, -6 * u); ctx.stroke();
      ctx.fillStyle = "#13233a"; [10, 46].forEach(function(qq){ ctx.beginPath(); ctx.arc(qq * u, 1, 5 * u, 0, 6.2832); ctx.fill(); }); ctx.restore();
      /* personne */
      var pxp = hx - 2, ph2 = 96 * u;
      PX.person(sc, pxp + 4 * u, gy + 2, ph2, {col:P.amber, armX:(hx - (pxp + 4 * u)) / (ph2 / 100), armY:(hy - gy - 2) / (ph2 / 100), step:Math.sin(st.p * D * 3.2) * 0.8 * (st.p > 0 && st.p < 1 ? 1 : 0)});
      /* poignée et force */
      S.draw.line(sc, ax, ay, hx, hy, "#46515f", 3.5);
      var len = 30 + f * 0.5;
      S.draw.arrow(sc, ax, ay, ax + len * Math.cos(ar), ay - len * Math.sin(ar), P.red, 3.4);
      S.draw.label(c2(sc), "F", ax + (len + 16) * Math.cos(ar) + 4, ay - (len + 16) * Math.sin(ar), {color:P.red, size:13});
      if (a > 0 && a < 90){
        S.draw.line(sc, ax, ay, ax + len * Math.cos(ar), ay, P.green, 2.2, [4, 3]); S.draw.line(sc, ax + len * Math.cos(ar), ay, ax + len * Math.cos(ar), ay - len * Math.sin(ar), P.amber, 2.2, [4, 3]);
        sc.ctx.strokeStyle = P.violet; sc.ctx.lineWidth = 1.6; sc.ctx.beginPath(); sc.ctx.arc(ax, ay, 26, -ar, 0); sc.ctx.stroke();
        S.draw.label(sc, "θ = " + a + "°", ax + 44, ay - 16 - 0, {color:P.violet, size:11.5});
      }
      if (st.hint) PX.grip(sc, hx, hy, P.red, "tire", 8); else PX.grip(sc, hx, hy, P.red, null, 6);
      S.draw.arrow(sc, 22, 22, sc.W - 22, 22, "#8a95a3", 2); S.draw.label(sc, "déplacement d = " + D + " m", sc.W / 2, 40, {color:P.mute || "#5f6b7a", size:11.5});
      S.draw.label(sc, "W = " + S.fmt(done, 0) + " J", sc.W - 12, sc.H - 14, {color:P.green, align:"right", size:13});
      g1.clear(); var ax2 = S.draw.axes(g1, {x0:0, x1:20, y0:0, y1:210, xl:"d (m)", yl:"force utile (N)", stepX:2, stepY:50});
      S.draw.area(g1, ax2, function(){ return Fx; }, 0, D * st.p, P.green, 0.28);
      S.draw.line(g1, ax2.X(0), ax2.Y(f), ax2.X(D), ax2.Y(f), "#b8c0cc", 1.5, [4, 4]); S.draw.label(g1, "F = " + f + " N", ax2.X(D) + 6, ax2.Y(f), {color:P.grey, align:"left", size:11});
      S.draw.line(g1, ax2.X(0), ax2.Y(Fx), ax2.X(D), ax2.Y(Fx), P.green, 3); S.draw.line(g1, ax2.X(D), ax2.Y(0), ax2.X(D), ax2.Y(Fx), P.green, 1.5, [3, 3]);
      S.draw.label(g1, "aire = W = " + S.fmt(done, 0) + " J", ax2.X(Math.max(D * 0.5, 5)), ax2.Y(Fx / 2 + 14), {color:P.green, size:12});
      ro.set(0, S.fmt(Fx, 1) + " N"); ro.set(1, S.fmt(W, 0) + " J"); ro.set(2, S.fmt(Fy, 1) + " N (verticale)");
      nt.set(a === 90 ? "θ = 90° : la force est perpendiculaire au déplacement, son travail est nul." : a === 0 ? "θ = 0° : toute la force sert à avancer, W = F·d = " + S.fmt(f * D, 0) + " J." : "Seule la composante F·cos θ = " + S.fmt(Fx, 1) + " N dans le sens du déplacement travaille. W = " + S.fmt(Fx, 1) + " N × " + D + " m = " + S.fmt(W, 0) + " J.", a === 90 ? "warn" : "");
    });
    function c2(x){ return x; }
  }
});

SFA.sim({
  id:"p4-c05-plan-incline", ch:"c05", tag:"Machine simple",
  titre:"Plan incliné : moins de force, plus de distance",
  resume:"Monter une charge d'une même hauteur par une rampe douce ou raide : le travail ne change pas.",
  but:"Glisse le sommet de la rampe pour changer l'angle. Change l'angle de la rampe, la hauteur à atteindre et la masse. Compare la force à fournir et la longueur de la rampe.",
  aRetenir:"Sans frottement, il faut une force F = m·g·sin α le long de la pente, sur une distance L = h / sin α. Le travail F·L = m·g·h est le même que pour soulever la charge verticalement : une machine simple change la force, pas le travail.",
  piege:"« La rampe me fait gagner de l'énergie » : non, elle me fait gagner de la FORCE en me faisant perdre de la DISTANCE. Avec des frottements, le travail à fournir est même plus grand.",
  build:function(k,S){
    var sc = PX.canvas(k, 0.52, 0.75), g1 = PX.canvas(k, 0.45, 0.62), Gi = {};
    var m = k.slider("Masse de la charge", 10, 100, 5, 50, "kg");
    var h = k.slider("Hauteur à atteindre", 0.5, 3, 0.5, 1.5, "m");
    var al = k.slider("Angle de la rampe α", 5, 60, 1, 20, "°");
    var ro = k.readouts(["Force sur la rampe", "Longueur de la rampe", "Travail sur la rampe", "Soulever tout droit"]);
    var nt = k.note("", "");
    PX.drag(k, sc, function(){ return [{x:Gi.x1, y:Gi.y1, r:14, set:function(px, py){ al.set(Math.max(5, Math.min(60, Math.round(Math.atan2(Gi.y0 - py, Math.max(10, px - Gi.x0)) * 180 / Math.PI)))); }}]; });
    k.draw(function(){
      var P = SFA.draw.palette, M = m.value, H = h.value, A = al.value * D2R, s = Math.sin(A);
      var Fp = M * G * s, L = H / s, Wm = M * G * H, Wp = Fp * L;
      sc.clear(); var base = H / Math.tan(A), scale = Math.min((sc.W - 60) / base, (sc.H - 50) / H), x0 = 30, y0 = sc.H - 24, x1 = x0 + base * scale, y1 = y0 - H * scale;
      Gi.x0 = x0; Gi.y0 = y0; Gi.x1 = x1; Gi.y1 = y1; var ctx = sc.ctx; PX.bg(sc, "#eef3fa", "#dfe7f2"); ctx.fillStyle = "#cdd6e2"; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var ux = Math.cos(A), uy = Math.sin(A), bxp = x0 + (x1 - x0) * 0.55, byp = y0 - (y0 - y1) * 0.55;
      ctx.save(); ctx.translate(bxp, byp); ctx.rotate(-A); ctx.fillStyle = PX.lin(sc, 0, -24, 0, 0, [[0, "#c98f4a"], [1, "#8a5a24"]]); PX.rr(ctx, -18, -24, 36, 24, 4); ctx.fill(); ctx.strokeStyle = "rgba(60,35,10,.6)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-18, -12); ctx.lineTo(18, -12); ctx.stroke(); ctx.restore();
      var cx = bxp - uy * 11, cy = byp - ux * 11;
      SFA.draw.arrow(sc, cx, cy, cx + ux * (14 + Fp * 0.12), cy - uy * (14 + Fp * 0.12), P.red, 3); P4.label(sc, "F", cx + ux * (24 + Fp * 0.12), cy - uy * (24 + Fp * 0.12) - 8, P.red);
      SFA.draw.arrow(sc, cx, cy, cx, cy + 14 + M * G * 0.12, P.amber, 3); P4.label(sc, "P", cx + 12, cy + 18 + M * G * 0.12, P.amber);
      S.draw.line(sc, x1 + 10, y0, x1 + 10, y1, P.green, 2); PX.grip(sc, x1, y1, P.red, null, 7); P4.label(sc, "h", x1 + 22, (y0 + y1) / 2, P.green);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:65, y0:0, y1:6, xl:"α (°)", yl:"rapports", stepX:10, stepY:1});
      S.draw.fn(g1, ax, function(a){ return Math.sin(a * D2R); }, P.red, 3); S.draw.fn(g1, ax, function(a){ return 1 / Math.sin(a * D2R); }, P.acc, 3);
      S.draw.line(g1, ax.X(0), ax.Y(1), ax.X(65), ax.Y(1), P.green, 2, [6, 4]);
      P4.label(g1, "rouge : F / (m·g) = sin α", ax.X(17), ax.Y(5.55), P.red, "left"); P4.label(g1, "bleu : L / h = 1 / sin α", ax.X(17), ax.Y(4.85), P.acc, "left"); P4.label(g1, "vert : (F·L)/(m·g·h) = 1", ax.X(17), ax.Y(4.15), P.green, "left");
      S.draw.dot(g1, ax.X(al.value), ax.Y(s), 5, P.red); if (1 / s <= 6) S.draw.dot(g1, ax.X(al.value), ax.Y(1 / s), 5, P.acc); else P4.label(g1, "L / h = " + S.fmt(1 / s, 1) + " (hors graphique)", ax.X(al.value) + 8, ax.Y(5.9), P.acc, "left");
      ro.set(0, S.fmt(Fp, 0) + " N"); ro.set(1, S.fmt(L, 2) + " m"); ro.set(2, S.fmt(Wp, 0) + " J"); ro.set(3, S.fmt(M * G, 0) + " N sur " + S.fmt(H, 1) + " m = " + S.fmt(Wm, 0) + " J");
      nt.set("Pente douce : force " + S.fmt(Fp / (M * G) * 100, 0) + " % du poids, rampe " + S.fmt(L / H, 1) + " fois plus longue que la hauteur. Travail identique (sans frottement).", "");
    });
  }
});

SFA.sim({
  id:"p4-c05-puissance-escalier", ch:"c05", tag:"Puissance",
  titre:"Grimper un escalier : énergie ou puissance ?",
  resume:"Monter en 20 s ou en 5 s : même énergie, mais pas la même puissance.",
  but:"Choisis ta masse, la hauteur et le temps de montée. Compare ta puissance à celle d'appareils courants.",
  aRetenir:"Le travail contre la pesanteur est W = m·g·h : il ne dépend pas du temps. La puissance P = W/t mesure la rapidité du transfert (watt = joule par seconde) : monter 2 fois plus vite demande 2 fois plus de puissance.",
  piege:"Énergie (J) et puissance (W) ne sont pas la même chose : un watt, c'est un joule PAR seconde. Le corps humain produit en réalité beaucoup plus de puissance chimique que la puissance utile calculée ici (rendement musculaire d'environ 25 %).",
  build:function(k,S){
    var g1 = k.canvas(250), b = k.canvas(160);
    var m = k.slider("Masse", 40, 100, 5, 65, "kg");
    var h = k.slider("Hauteur à gravir", 3, 30, 1, 9, "m");
    var t = k.slider("Temps de montée", 3, 120, 1, 20, "s");
    var ro = k.readouts(["Énergie fournie W = m·g·h", "Puissance moyenne P", "Équivalent en ampoules de 60 W"]);
    var nt = k.note("", "");
    k.draw(function(){
      var P = SFA.draw.palette, M = m.value, H = h.value, T = t.value, E = M * G * H, Pw = E / T;
      g1.clear(); var ymax = E / 3 * 1.05, ax = S.draw.axes(g1, {x0:0, x1:120, y0:0, y1:ymax, xl:"t (s)", yl:"P (W)", stepX:20});
      S.draw.fn(g1, ax, function(x){ return x < 3 ? E / 3 : E / x; }, P.acc, 3);
      S.draw.line(g1, ax.X(T), ax.B, ax.X(T), ax.Y(Pw), "#8a95a3", 1.2, [3, 3]); S.draw.line(g1, ax.L, ax.Y(Pw), ax.X(T), ax.Y(Pw), "#8a95a3", 1.2, [3, 3]); S.draw.dot(g1, ax.X(T), ax.Y(Pw), 6, P.red);
      P4.label(g1, "P = E / t (E = " + S.fmt(E, 0) + " J)", ax.X(118), ax.Y(ymax * 0.7), P.acc, "right");
      var ref = [["Toi", Pw, P.red], ["Ampoule", 60, "#8a95a3"], ["Cheval-vapeur", 735, "#8a95a3"], ["Bouilloire", 2000, "#8a95a3"]];
      P4.bars(b, ref.map(function(r){ return {n:r[0], v:r[1], col:r[2]}; }), {lo:0, hi:Math.max(2100, Pw * 1.05), unit:"W", fmt:function(q){ return S.fmt(q, 0); }});
      ro.set(0, S.fmt(E, 0) + " J"); ro.set(1, S.fmt(Pw, 0) + " W"); ro.set(2, S.fmt(Pw / 60, 1) + " ampoules");
      nt.set(Pw > 735 ? "Plus d'un cheval-vapeur (735 W) : c'est un effort de sprint, impossible à tenir longtemps." : Pw < 100 ? "Moins de 100 W : une puissance qu'on peut soutenir des heures." : "Puissance moyenne soutenable seulement quelques minutes.", Pw > 735 ? "warn" : "");
    });
  }
});

var DEV = [
  ["Centrale à gaz (cycle combiné)", 0.55, "électricité", "chaleur rejetée"],
  ["Centrale nucléaire", 0.33, "électricité", "chaleur rejetée"],
  ["Ligne haute tension + transformateurs", 0.93, "électricité livrée", "chaleur (effet Joule)"],
  ["Moteur électrique", 0.90, "énergie mécanique", "chaleur"],
  ["Lampe à incandescence", 0.05, "lumière", "chaleur"],
  ["Lampe LED", 0.40, "lumière", "chaleur"],
  ["Moteur d'une voiture à essence", 0.25, "mouvement", "chaleur"],
  ["Voiture électrique (batterie → roues)", 0.85, "mouvement", "chaleur"],
  ["Chaudière à condensation", 0.95, "chaleur utile", "chaleur perdue (fumées)"],
  ["Panneau solaire", 0.18, "électricité", "chaleur et réflexion"]
];
SFA.sim({
  id:"p4-c05-sankey", ch:"c05", tag:"Diagramme de Sankey",
  titre:"Chaîne énergétique et rendement global",
  resume:"Enchaîne jusqu'à trois appareils : les rendements se multiplient.",
  but:"Choisis des appareils à la suite (le deuxième et le troisième sont facultatifs) et l'énergie de départ. Touche un appareil pour en changer, tire sur la bande de gauche pour régler l'énergie de départ. Lis les pertes à chaque étape.",
  aRetenir:"Rendement η = énergie utile / énergie reçue, toujours inférieur à 100 %. Dans une chaîne, les rendements se multiplient : η<sub>total</sub> = η₁ × η₂ × η₃. Les pertes ne disparaissent pas : elles deviennent de l'énergie thermique dispersée.",
  piege:"Le rendement global n'est pas la moyenne des rendements : trois étages à 90 % ne donnent pas 90 % mais 73 %. (Valeurs de rendement : ordres de grandeur typiques, simplifiés.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.74, 1.05), st0 = {t:0, hint:true}, geo = {boxes:[]};
    var opts = DEV.map(function(x, i){ return [i, x[0] + " (η = " + S.fmt(x[1] * 100, 0) + " %)"]; });
    var optN = [["-1", "— (aucun)"]].concat(opts);
    var d1 = k.select("Appareil 1", opts, 0), d2 = k.select("Appareil 2", optN, 2), d3 = k.select("Appareil 3", optN, 5);
    var e0 = k.slider("Énergie de départ", 10, 100, 5, 100, "MJ", function(){ st0.hint = false; });
    var ro = k.readouts(["Rendement total", "Énergie utile finale", "Énergie dissipée"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st0.t += dt; k.redraw(); }); lp.play();
    var sels = [d1, d2, d3];
    c.pointer(function(type, p){
      if (type !== "down") return;
      geo.boxes.forEach(function(b, i){ if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h){ var el = sels[i].el; el.selectedIndex = (el.selectedIndex + 1) % el.options.length; st0.hint = false; k.redraw(); } });
    });
    PX.drag(k, c, function(){ return [{x:geo.hx, y:geo.hy, r:11, set:function(px, py){ st0.hint = false; e0.set(Math.max(10, Math.min(100, Math.round((py - geo.top) / geo.sc / 5) * 5))); }}]; });
    function chev(x0, y0, x1, y1, th, t, col){   /* petits chevrons qui défilent dans une bande */
      var ctx = c.ctx; ctx.save(); ctx.beginPath(); ctx.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0) || th, Math.abs(y1 - y0) || th); ctx.clip();
      ctx.strokeStyle = col; ctx.lineWidth = 2; var hz = Math.abs(x1 - x0) >= Math.abs(y1 - y0);
      for (var s = -20; s < 600; s += 22){ var q = (s + t * 36) % 600; if (hz){ var x = x0 + q; if (x > x1) continue; for (var yy = y0 + 10; yy < y0 + th - 6; yy += 16){ ctx.beginPath(); ctx.moveTo(x - 4, yy - 4); ctx.lineTo(x, yy); ctx.lineTo(x - 4, yy + 4); ctx.stroke(); } } else { var y = y0 + q; if (y > y1) continue; for (var xx = x0 + 8; xx < x0 + th - 4; xx += 14){ ctx.beginPath(); ctx.moveTo(xx - 4, y - 4); ctx.lineTo(xx, y); ctx.lineTo(xx + 4, y - 4); ctx.stroke(); } } }
      ctx.restore();
    }
    function wrap(txt, n){ var w = txt.split(" "), out = [], cur = ""; w.forEach(function(x){ if ((cur + " " + x).trim().length > n && cur){ out.push(cur); cur = x; } else cur = (cur + " " + x).trim(); }); if (cur) out.push(cur); return out.slice(0, 3); }
    k.draw(function(){
      var st = [d1.value, d2.value, d3.value].filter(function(v){ return +v >= 0; }).map(function(v){ return DEV[+v]; }), ph = PX.phone(c);
      var E = [e0.value], i; st.forEach(function(s){ E.push(E[E.length - 1] * s[1]); });
      var n = st.length, sc = (c.H * 0.34) / 100, top = 70, bw = ph ? 48 : 64, x0 = 10, srcW = ph ? 26 : 34, outW = ph ? 52 : 66;
      var gap = n ? (c.W - x0 - srcW - n * bw - outW) / n : 0, T = st0.t, boxH = 100 * sc + 16, yb = top + boxH;
      geo.sc = sc; geo.top = top; geo.boxes = [];
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#f7f9fc", "#eaeff6");
      var BL = "rgba(63,110,200,.92)", CH = "rgba(255,255,255,.38)", cx = x0 + srcW, bxs = [];
      for (i = 0; i < n; i++){ bxs.push(cx + gap); cx = cx + gap + bw; }
      /* boîtes des appareils (derrière les flux) */
      bxs.forEach(function(bx, j){
        ctx.fillStyle = PX.lin(c, 0, top - 14, 0, yb + 6, [[0, "#26405f"], [1, "#101d30"]]); PX.rr(ctx, bx, top - 14, bw, boxH + 22, 10); ctx.fill();
        geo.boxes.push({x:bx, y:top - 14, w:bw, h:boxH + 22});
        wrap(st[j][0].replace(/ \(.*\)/, ""), ph ? 9 : 12).forEach(function(l, q, arr){ S.draw.text(c, l, bx + bw / 2, 14 + q * 12.5, {size:ph ? 10 : 10.5, color:P.ink, weight:700}); });
        if (st0.hint && j === 0) S.draw.label(c, "touche", bx + bw / 2, yb + 4, {color:"#fff", fill:"rgba(255,255,255,.2)", size:10});
      });
      /* flux */
      var xsrc = x0, prevR = x0 + srcW;
      ctx.fillStyle = BL; ctx.fillRect(xsrc, top, srcW + (n ? gap : 0) + 1, E[0] * sc);
      chev(xsrc, top, xsrc + srcW + (n ? gap : 0), top + E[0] * sc, E[0] * sc, T, CH);
      S.draw.label(c, S.fmt(E[0], 0) + " MJ", xsrc + 2, top - 16, {color:P.acc, align:"left", size:PX.fs(c, 11.5)});
      geo.hx = xsrc + srcW / 2; geo.hy = top + E[0] * sc;
      for (i = 0; i < n; i++){
        var bx = bxs[i], yIn = E[i] * sc, yOut = E[i + 1] * sc, loss = E[i] - E[i + 1], lw = Math.max(3, loss * sc);
        var xl = Math.min(bx + bw * 0.5 - lw / 2, bx + bw + gap * 0.2 - lw), xr = xl + lw, xe = bx + bw + (i < n - 1 ? gap : outW) + 1;
        xl = Math.max(bx + 4, xl); xr = xl + lw;
        /* flux utile (reste en haut) */
        ctx.fillStyle = BL; ctx.fillRect(bx, top, xe - bx, yOut);
        chev(bx, top, xe, top + yOut, yOut, T, CH);
        if (i < n - 1) S.draw.label(c, S.fmt(E[i + 1], 1) + " MJ", bx + bw + gap / 2, top - 16 + 4, {color:P.acc, size:PX.fs(c, 11)});
        /* perte : se détache par le bas et part vers l'environnement */
        var ex = c.H - (ph ? 76 : 66);
        ctx.fillStyle = PX.lin(c, 0, top, 0, ex, [[0, "rgba(224,86,47,.95)"], [1, "rgba(224,86,47,.28)"]]);
        ctx.beginPath(); ctx.moveTo(bx, top + yOut);
        ctx.bezierCurveTo(bx + bw * 0.55, top + yOut, xr, top + yOut + 20, xr, yb);
        ctx.lineTo(xr, ex); ctx.lineTo(xl, ex); ctx.lineTo(xl, yb);
        ctx.bezierCurveTo(xl, top + yIn + 10, bx + bw * 0.3, top + yIn, bx, top + yIn); ctx.closePath(); ctx.fill();
        ctx.fillStyle = BL; ctx.beginPath(); ctx.moveTo(bx - 1, top); ctx.lineTo(bx + 1, top); ctx.lineTo(bx + 1, top + yIn); ctx.lineTo(bx - 1, top + yIn); ctx.fill();
        chev(xl, yb, xr, ex, lw, T, CH);
        S.draw.label(c, "−" + S.fmt(loss, 1) + " MJ", (xl + xr) / 2, ex + 14, {color:P.red, size:PX.fs(c, 11.5)});
        S.draw.label(c, st[i][3] || "chaleur", (xl + xr) / 2, ex + 34, {color:P.red, size:10.5, fill:"rgba(255,255,255,.0)"});
        /* flux entrant (prolonge celui de l'étage précédent) */
        if (i > 0){ ctx.fillStyle = BL; ctx.fillRect(bxs[i - 1] + bw - 1, top, bx - (bxs[i - 1] + bw) + 2, yIn); }
      }
      bxs.forEach(function(bx, j){
        S.draw.text(c, "η = " + S.fmt(st[j][1] * 100, 0) + " %", bx + bw / 2, 63, {size:PX.fs(c, 12), color:"#fff", weight:800});
      });
      ctx.fillStyle = PX.lin(c, 0, top, 0, top + E[n] * sc, [[0, "#3aa77f"], [1, "#24775a"]]); var ux = n ? bxs[n - 1] + bw : x0 + srcW; ctx.fillRect(ux + 1, top, c.W - ux - 6, E[n] * sc); chev(ux, top, c.W - 6, top + E[n] * sc, E[n] * sc, T, CH);
      S.draw.label(c, "utile : " + S.fmt(E[n], 1) + " MJ", c.W - 8, top - 16, {color:P.green, align:"right", size:PX.fs(c, 12)});
      if (n) S.draw.label(c, st[n - 1][2], c.W - 8, top + E[n] * sc + 16, {color:P.green, align:"right", size:11});
      if (st0.hint) PX.grip(c, geo.hx, geo.hy, P.acc, "tire", 7);
      var eta = E[n] / E[0];
      ro.set(0, S.fmt(eta * 100, 1) + " %"); ro.set(1, S.fmt(E[n], 1) + " MJ (" + S.fmt(E[n] / 3.6, 2) + " kWh)"); ro.set(2, S.fmt(E[0] - E[n], 1) + " MJ");
      nt.set(n === 0 ? "Choisis au moins un appareil." : "η total = " + st.map(function(s){ return S.fmt(s[1], 2); }).join(" × ") + " = " + S.fmt(eta, 3) + ". Sur " + S.fmt(E[0], 0) + " MJ de départ, " + S.fmt(E[0] - E[n], 1) + " MJ finissent en chaleur dans l'environnement.", "");
    });
  }
});
})();
