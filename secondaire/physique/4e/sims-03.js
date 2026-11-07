/* Physique 4e · chapitre 3 · Chute libre et graphes du mouvement */
(function(){
var G = 9.8;
function lnch(u){ u = Math.abs(u); return u + Math.log1p(Math.exp(-2 * u)) - Math.LN2; }
/* chute avec résistance de l'air : v = vt·tanh(g·t/vt) ; x = (vt²/g)·ln cosh(g·t/vt). vt = Infinity : chute libre. */
function posFall(vt, t){ return isFinite(vt) ? vt * vt / G * lnch(G * t / vt) : 0.5 * G * t * t; }
function velFall(vt, t){ return isFinite(vt) ? vt * Math.tanh(G * t / vt) : G * t; }
function timeFall(vt, h){
  if (!isFinite(vt)) return Math.sqrt(2 * h / G);
  var lo = 0, hi = Math.sqrt(2 * h / G) + h / Math.max(0.01, vt) * 2 + 1, i;
  for (i = 0; i < 80; i++){ var m = (lo + hi) / 2; if (posFall(vt, m) < h) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
window.P4chute = {posFall:posFall, velFall:velFall, timeFall:timeFall};

var OBJ = {
  acier:{n:"Bille d'acier", vt:120, r:8, col:"#5f6b7a"},
  tennis:{n:"Balle de tennis", vt:25, r:11, col:"#a3b81a"},
  papier:{n:"Feuille de papier à plat", vt:3, r:0, col:"#8a95a3", shape:"sheet"},
  boule:{n:"Feuille froissée", vt:12, r:7, col:"#b8c0cc"},
  plume:{n:"Plume", vt:1.5, r:0, col:"#b45309", shape:"feather"}
};
function drawObj(c, o, x, y){
  var ctx = c.ctx; ctx.save(); ctx.fillStyle = o.col; ctx.strokeStyle = "#13233a"; ctx.lineWidth = 1.5;
  if (o.shape === "sheet"){ ctx.fillRect(x - 16, y - 12, 32, 4); ctx.strokeRect(x - 16, y - 12, 32, 4); }
  else if (o.shape === "feather"){ ctx.beginPath(); ctx.ellipse(x, y - 11, 4, 13, 0.5, 0, 6.2832); ctx.fill(); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(x, y - o.r, o.r, 0, 6.2832); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

SFA.sim({
  id:"p4-c03-tube-vide", ch:"c03", tag:"Classique",
  titre:"Tube à vide : qui tombe le premier ?",
  resume:"Lâche deux objets dans un tube dont tu règles la quantité d'air.",
  but:"Choisis deux objets (ou touche-les pour en changer), la hauteur et la pression de l'air dans le tube (100 % = air normal, 0 % = vide). Lance la chute : les points successifs sont pris à intervalles de temps égaux.",
  aRetenir:"Dans le vide, tous les objets tombent avec la même accélération g ≈ 9,8 m/s², quelle que soit leur masse. Dans l'air, la résistance dépend de la forme et de la surface : elle ralentit surtout les objets légers et « étalés ».",
  piege:"Ce n'est pas la masse qui fait tomber plus vite : dans le vide, la plume et la bille arrivent ensemble. (Les vitesses limites utilisées ici sont des ordres de grandeur pour un modèle simplifié.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.92, 1.3), st = {t:0, run:false, tt:0};
    var keys = Object.keys(OBJ), opts = keys.map(function(i){ return [i, OBJ[i].n]; });
    var selA = k.select("Objet A (à gauche)", opts, "acier"), selB = k.select("Objet B (à droite)", opts, "plume");
    var h = k.slider("Hauteur de chute", 2, 50, 1, 10, "m");
    var p = k.slider("Air dans le tube", 0, 100, 10, 100, "%");
    var sp = k.seg("Animation", [[1,"×1"],[3,"×3"]], 1);
    var ro = k.readouts(["Temps de A", "Temps de B", "Vitesse au sol de A", "Vitesse au sol de B"]);
    var nt = k.note("", "");
    var mol = [], seed = 11, i;
    function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 110; i++) mol.push({x:rnd(), y:rnd(), vx:(rnd() - 0.5) * 0.22, vy:(rnd() - 0.5) * 0.22});
    var lp = k.loop(function(dt){
      st.tt += dt;
      mol.forEach(function(m){ m.x += m.vx * dt; m.y += m.vy * dt; if (m.x < 0 || m.x > 1) m.vx = -m.vx; if (m.y < 0 || m.y > 1) m.vy = -m.vy; m.x = Math.max(0, Math.min(1, m.x)); m.y = Math.max(0, Math.min(1, m.y)); });
      if (st.run) st.t += dt * sp.value;
      k.redraw();
    });
    lp.play();
    k.button("▶ Lâcher", function(){ st.t = 0; st.run = true; }, true);
    k.button("↺ Remettre en haut", function(){ st.run = false; st.t = 0; });
    function vtOf(o){ var pp = p.value / 100; return pp <= 0 ? Infinity : o.vt / Math.sqrt(pp); }
    var L = {};   /* géométrie, pour la saisie */
    c.pointer(function(type, q){
      if (type !== "down" || st.t > 0) return;
      if (Math.abs(q.y - L.y0) < 34){
        var side = q.x < c.W / 2 ? selA : selB, cur = keys.indexOf(side.value);
        if (Math.abs(q.x - (q.x < c.W / 2 ? L.xa : L.xb)) < 40){ side.set(keys[(cur + 1) % keys.length]); k.redraw(); }
      }
    });
    function drawObj2(o, x, y, tt, air, flying){
      var ctx = c.ctx, R = Math.max(9, c.W / 40), ph = o === OBJ.plume ? 1.3 : 0;
      ctx.save(); ctx.translate(x, y);
      var fl = flying ? Math.sin(tt * 5 + ph) * air : 0;
      if (o.shape === "sheet"){ ctx.translate(fl * 9, 0); ctx.rotate(fl * 0.45); ctx.fillStyle = "#fdfdf7"; ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; PX.rr(ctx, -R * 1.5, -2, R * 3, 4, 1.5); ctx.fill(); ctx.stroke(); }
      else if (o.shape === "feather"){ ctx.translate(fl * 10, 0); ctx.rotate(0.3 + fl * 0.6); ctx.fillStyle = "#d9822b"; ctx.strokeStyle = "#8a4b0f"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(0, 0, R * 0.42, R * 1.35, 0, 0, 6.2832); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -R * 1.5); ctx.lineTo(0, R * 1.6); ctx.stroke(); }
      else if (o === OBJ.boule){ ctx.beginPath(); for (var a = 0; a < 9; a++){ var ang = a / 9 * 6.2832, rr = R * (0.78 + 0.18 * ((a * 7) % 3) / 2); a ? ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr) : ctx.moveTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } ctx.closePath(); ctx.fillStyle = "#e4e8ee"; ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.stroke(); }
      else { PX.ball(c, 0, 0, o === OBJ.acier ? R * 0.8 : R, o.col); if (o === OBJ.tennis){ ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(-R * 1.1, 0, R * 0.95, -0.9, 0.9); ctx.stroke(); } }
      ctx.restore();
    }
    k.draw(function(){
      var H = h.value, oA = OBJ[selA.value], oB = OBJ[selB.value], vA = vtOf(oA), vB = vtOf(oB), air = p.value / 100;
      var tA = timeFall(vA, H), tB = timeFall(vB, H), tm = Math.max(tA, tB);
      if (st.run && st.t > tm + 0.8) st.run = false;
      var ph = PX.phone(c), x0 = 52, x1 = c.W - 14, yT = 58, yB = c.H - (ph ? 124 : 80);
      var y0 = yT + 20, y1 = yB - 14, sc = (y1 - y0) / H;
      L.y0 = y0; L.xa = x0 + (x1 - x0) * 0.3; L.xb = x0 + (x1 - x0) * 0.7;
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#f3f6fb", "#e3e9f2");
      /* tube de verre */
      ctx.save();
      ctx.fillStyle = PX.lin(c, x0, 0, x1, 0, [[0, "rgba(190,210,240," + (0.1 + 0.35 * air) + ")"], [0.5, "rgba(235,243,255," + (0.18 + 0.3 * air) + ")"], [1, "rgba(190,210,240," + (0.1 + 0.35 * air) + ")"]]);
      PX.rr(ctx, x0, yT - 10, x1 - x0, yB - yT + 20, 12); ctx.fill(); ctx.strokeStyle = "rgba(95,107,122,.8)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.55)"; PX.rr(ctx, x0 + 8, yT, 5, yB - yT - 6, 3); ctx.fill();
      /* molécules d'air */
      ctx.fillStyle = "rgba(47,127,209,.55)";
      var n = Math.round(air * mol.length);
      for (var j = 0; j < n; j++){ ctx.beginPath(); ctx.arc(x0 + 12 + mol[j].x * (x1 - x0 - 24), yT - 2 + mol[j].y * (yB - yT), 1.9, 0, 6.2832); ctx.fill(); }
      ctx.restore();
      /* bouchon du haut (support de largage) et socle */
      ctx.fillStyle = PX.lin(c, 0, yT - 24, 0, yT - 8, [[0, "#6b7787"], [1, "#3c4756"]]); PX.rr(ctx, x0 - 4, yT - 26, x1 - x0 + 8, 18, 6); ctx.fill();
      ctx.fillStyle = PX.lin(c, 0, yB + 4, 0, yB + 20, [[0, "#6b7787"], [1, "#3c4756"]]); PX.rr(ctx, x0 - 6, yB + 4, x1 - x0 + 12, 18, 6); ctx.fill();
      PX.vruler(c, x0 - 8, y1, y0, 0, H, P4.nice(H / 6), "m");
      /* chronophotographie : un point toutes les dtS secondes */
      var dtS = P4.nice(Math.min(tA, tB) / 5), cnt = 0;
      [[oA, L.xa, vA, tA], [oB, L.xb, vB, tB]].forEach(function(q){
        ctx.save(); ctx.globalAlpha = 0.22;
        for (var s = dtS; s < Math.min(st.t, q[3]) && cnt < 120; s += dtS, cnt++) drawObj2(q[0], q[1], y0 + posFall(q[2], s) * sc, 0, 0, false);
        ctx.restore();
        var done = st.t >= q[3], yy = y0 + Math.min(H, posFall(q[2], Math.min(st.t, q[3]))) * sc;
        drawObj2(q[0], q[1], yy, st.tt, air, st.run && !done);
        S.draw.label(c, q[0].n, q[1], 16, {color:P.acc, size:PX.fs(c, 12)});
        var tl = Math.min(st.t, q[3]);
        S.draw.label(c, S.fmt(tl, 2) + " s", q[1], yB + (ph ? 40 : 42), {color:done ? P.red : "#2c3a4e", size:13});
        if (done && st.t > 0) S.draw.label(c, "arrivé", q[1], yB - 4, {color:P.green, size:11});
      });
      if (st.t === 0){ S.draw.label(c, "touche un objet pour le changer", c.W / 2, y0 + 30, {color:P.grey, size:11}); }
      S.draw.display(c, p.value === 0 ? "VIDE" : S.fmt(p.value, 0) + " %", c.W / 2, yB + (ph ? 90 : 52), {w:ph ? 84 : 96, h:ph ? 36 : 42, caption:"AIR DANS LE TUBE", size:ph ? 15 : 18});
      S.draw.label(c, "● toutes les " + S.fmt(dtS, 2) + " s", x1 - 6, yT + 6, {color:P.grey, size:11, align:"right"});
      ro.set(0, S.fmt(tA, 2) + " s"); ro.set(1, S.fmt(tB, 2) + " s");
      ro.set(2, S.fmt(velFall(vA, tA), 1) + " m/s"); ro.set(3, S.fmt(velFall(vB, tB), 1) + " m/s");
      var d = Math.abs(tA - tB);
      if (p.value === 0) nt.set("Vide : t = √(2h/g) = " + S.fmt(Math.sqrt(2 * H / G), 2) + " s pour tout le monde. Même accélération, même temps.", "");
      else if (d < 0.02) nt.set("Arrivée simultanée (à 0,02 s près) : la résistance de l'air est négligeable pour ces deux objets sur cette hauteur.", "");
      else nt.set((tA < tB ? oA.n : oB.n) + " arrive en premier (écart " + S.fmt(d, 2) + " s). Réduis l'air dans le tube : l'écart diminue.", "warn");
    });
  }
});

SFA.sim({
  id:"p4-c03-lancer-vertical", ch:"c03", tag:"Graphes",
  titre:"Lancer vertical : montée, sommet, descente",
  resume:"Une balle lancée vers le haut : hauteur max., durée de vol et graphiques.",
  but:"Choisis la vitesse de lancer ou tire sur la ligne verte (hauteur max.) pour la régler. Observe la balle et les graphiques y(t) et v(t). Défi : choisis la cible et atteins-la.",
  aRetenir:"Pendant tout le vol (montée, sommet, descente), l'accélération vaut −g (vers le bas). Au sommet, v = 0 mais a ≠ 0. h<sub>max</sub> = v₀²/(2g) ; durée de vol = 2·v₀/g ; on repasse au sol à la même vitesse (en sens inverse).",
  piege:"« Au sommet, l'accélération est nulle » : FAUX. C'est la vitesse qui est nulle un instant, pas l'accélération. Sans air, la montée dure autant que la descente.",
  build:function(k,S){
    var P = S.draw.palette, sc = PX.canvas(k, 0.78, 1.05), gy = PX.canvas(k, 0.32, 0.55), gv = PX.canvas(k, 0.32, 0.55), st = {t:0.8, hint:true}, A = {};
    var v0 = k.slider("Vitesse de lancer", 1, 40, 1, 15, "m/s", function(){ st.hint = false; });
    var tgt = k.select("Défi : hauteur max. visée", [[0,"Libre"],[10,"10 m"],[20,"20 m"],[40,"40 m"]], 0);
    var ts = k.slider("Instant t", 0, 8.2, 0.05, 0.8, "s", function(val){ st.t = val; });
    var ro = k.readouts(["Hauteur max.", "Durée de vol", "y(t)", "v(t)"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; var tv = 2 * v0.value / G; if (st.t >= tv){ st.t = tv; lp.pause(); } ts.set(st.t); k.redraw(); });
    k.button("▶ Lancer", function(){ st.t = 0; ts.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    var geo = {};
    PX.drag(k, sc, function(){ return [{x:geo.hx, y:geo.hy, r:11, set:function(px, py){ st.hint = false; var hm = Math.max(0.6, (geo.gnd - py) / geo.sc); v0.set(Math.max(1, Math.min(40, Math.round(Math.sqrt(2 * G * hm))))); }}]; });
    [[gy, "y"], [gv, "v"]].forEach(function(q){ var g = q[0]; g.pointer(function(type, p){ if (type === "up" || type === "move" || !A.ax) return; var tv = 2 * v0.value / G; st.t = Math.max(0, Math.min(tv, A.ax.ix(p.x))); lp.pause(); ts.set(st.t); k.redraw(); }); });
    k.draw(function(){
      var V0 = v0.value, tv = 2 * V0 / G, hm = V0 * V0 / (2 * G), T = Math.min(st.t, tv), tg = +tgt.value;
      var y = V0 * T - 0.5 * G * T * T, v = V0 - G * T, ph = PX.phone(sc);
      var yTop = 26, gnd = sc.H - 38, Hs = Math.max(hm * 1.12, tg * 1.1, 6), scl = (gnd - yTop) / Hs, xm = sc.W * 0.56;
      geo.gnd = gnd; geo.sc = scl;
      sc.clear(); var ctx = sc.ctx;
      PX.bg(sc, "#cfe3f7", "#eef5fc"); PX.cloud(sc, sc.W * 0.2, 56, 0.9, 0.7); PX.cloud(sc, sc.W * 0.8, 98, 0.7, 0.6);
      PX.ground(sc, gnd, "#8fb87a", 38);
      var Ym = PX.vruler(sc, 40, gnd, yTop, 0, Hs, P4.nice(Hs / 6), "m");
      PX.person(sc, sc.W * 0.28, gnd + 8, ph ? 54 : 70, {col:P.acc, armX:12, armY:T > 0 && T < 0.25 ? -92 : -56});
      /* cible et sommet */
      if (tg > 0){ var yt = Ym(tg), ok = Math.abs(hm - tg) < 0.5; S.draw.line(sc, 44, yt, sc.W - 14, yt, ok ? P.green : P.red, 2, [2, 4]); S.draw.label(sc, "cible " + tg + " m", 80, yt - 12, {color:ok ? P.green : P.red, size:11.5}); if (ok) S.draw.glow(sc, xm, yt, 60, P.green, 0.45); }
      var yh = Ym(hm); geo.hx = sc.W - 34; geo.hy = yh;
      S.draw.line(sc, 44, yh, sc.W - 40, yh, P.green, 1.6, [6, 4]);
      S.draw.label(sc, "h max = " + S.fmt(hm, 1) + " m", sc.W - 62, yh - 13, {color:P.green, align:"right", size:11.5});
      PX.grip(sc, geo.hx, yh, P.green, st.hint ? "tire" : null, 8);
      /* chronophotographie : montée à gauche, descente à droite */
      var dtS = P4.nice(tv / 9);
      ctx.save();
      for (var s = dtS; s < Math.min(T, tv) - 1e-6; s += dtS){ var ys = V0 * s - 0.5 * G * s * s, up = s <= V0 / G; ctx.fillStyle = up ? "rgba(36,119,90,.45)" : "rgba(194,106,12,.5)"; ctx.beginPath(); ctx.arc(xm + (up ? -26 : 26), Ym(ys), 5, 0, 6.2832); ctx.fill(); }
      ctx.restore();
      S.draw.label(sc, "montée", xm - 26, gnd - 12, {color:P.green, size:10.5}); S.draw.label(sc, "descente", xm + 28, gnd - 12, {color:P.amber, size:10.5});
      var yb = Ym(y);
      PX.ball(sc, xm, yb - 9, 9, P.acc, {shadowY:gnd + 2, shadowA:0.2});
      if (Math.abs(v) > 0.05) S.draw.arrow(sc, xm + 18, yb - 9, xm + 18, yb - 9 - Math.sign(v) * Math.min(70, 8 + Math.abs(v) * 1.6), P.amber, 3);
      S.draw.arrow(sc, xm - 18, yb - 9, xm - 18, yb - 9 + 30, P.red, 3);
      S.draw.label(sc, "v", xm + 32, yb - 9 - Math.sign(v || 1) * 18, {color:P.amber, size:12}); S.draw.label(sc, "g", xm - 32, yb + 14, {color:P.red, size:12});
      if (Math.abs(v) < 0.2) S.draw.label(sc, "sommet : v = 0, a = −g", xm, yb - 34, {color:P.ink, size:11.5});
      /* graphiques */
      gy.clear(); var a1 = S.draw.axes(gy, {x0:0, x1:tv, y0:0, y1:hm * 1.15, yl:"y (m)"}); A.ax = a1;
      S.draw.area(gy, a1, function(t){ return V0 * t - 0.5 * G * t * t; }, 0, T, P.acc, 0.13);
      S.draw.fn(gy, a1, function(t){ return V0 * t - 0.5 * G * t * t; }, P.acc, 3); S.draw.dot(gy, a1.X(T), a1.Y(y), 6, P.red);
      S.draw.dot(gy, a1.X(V0 / G), a1.Y(hm), 4.5, P.green);
      gv.clear(); var a2 = S.draw.axes(gv, {x0:0, x1:tv, y0:-V0 * 1.1, y1:V0 * 1.1, xl:"t (s)", yl:"v (m/s)"});
      S.draw.line(gv, a2.X(0), a2.Y(V0), a2.X(tv), a2.Y(-V0), P.green, 3); S.draw.dot(gv, a2.X(T), a2.Y(v), 6, P.red);
      S.draw.label(gv, "pente = −g", a2.X(tv * 0.74), a2.Y(V0 * 0.4), {color:P.green, size:11.5});
      ro.set(0, S.fmt(hm, 1) + " m"); ro.set(1, S.fmt(tv, 2) + " s"); ro.set(2, S.fmt(y, 1) + " m"); ro.set(3, S.fmt(v, 1) + " m/s");
      if (tg > 0) nt.set(Math.abs(hm - tg) < 0.5 ? "Cible atteinte : h max = " + S.fmt(hm, 1) + " m. Vitesse de lancer nécessaire : √(2·g·h) = " + S.fmt(Math.sqrt(2 * G * tg), 1) + " m/s." : "h max = " + S.fmt(hm, 1) + " m : " + (hm < tg ? "trop bas, lance plus vite." : "trop haut, lance moins vite."), Math.abs(hm - tg) < 0.5 ? "" : "warn");
      else nt.set(Math.abs(v) < 0.2 ? "Sommet : v ≈ 0, mais a = −g ≠ 0." : v > 0 ? "Montée : v > 0 et diminue de 9,8 m/s chaque seconde." : "Descente : v < 0, |v| augmente de 9,8 m/s chaque seconde.", "");
    });
  }
});

var ASTRES = [["Lune", 1.62, "#8a95a3"], ["Mars", 3.71, "#b45309"], ["Vénus", 8.87, "#b8860b"], ["Terre", 9.8, "#1e3f8f"], ["Jupiter", 24.8, "#b42318"]];
SFA.sim({
  id:"p4-c03-astres", ch:"c03", tag:"Comparaison",
  titre:"Chute sur d'autres astres",
  resume:"Le même objet lâché sur la Lune, Mars, Vénus, la Terre et Jupiter.",
  but:"Lâche un objet de la même hauteur sur cinq astres (touche un astre pour l'étudier). Change sa masse : le temps de chute ne bouge pas, son poids oui.",
  aRetenir:"L'accélération de chute g dépend de l'astre (Lune 1,6 ; Terre 9,8 ; Jupiter 24,8 m/s²), pas de l'objet. Le temps de chute est t = √(2h/g). Masse (kg) et poids (N, P = m·g) sont deux grandeurs différentes.",
  piege:"La masse ne change pas d'un astre à l'autre ; le poids, si. Un objet de 10 kg reste de 10 kg sur la Lune mais pèse environ six fois moins. (Chute sans atmosphère, modèle simplifié.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.95, 1.4), st = {t:0};
    var h = k.slider("Hauteur de chute", 2, 100, 1, 20, "m");
    var m = k.slider("Masse de l'objet", 1, 100, 1, 10, "kg");
    var sel = k.select("Astre étudié", ASTRES.map(function(a){ return [a[0], a[0] + " (g = " + S.fmt(a[1], 2) + ")"]; }), "Terre");
    var ro = k.readouts(["g de l'astre", "Temps de chute", "Vitesse à l'arrivée", "Poids de l'objet"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ st.t += dt; k.redraw(); });
    k.button("▶ Lâcher", function(){ st.t = 0; lp.play(); }, true);
    k.button("↺ Remettre en haut", function(){ lp.pause(); st.t = 0; });
    var X0 = 44;
    c.pointer(function(type, p){ if (type !== "down") return; var i = Math.floor((p.x - X0) / ((c.W - X0 - 6) / 5)); if (i >= 0 && i < 5){ sel.set(ASTRES[i][0]); k.redraw(); } });
    function planet(x, gnd, w, a, i){
      var ctx = c.ctx, R = w * 0.78, cy = gnd + R * 0.72;
      ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, gnd - 12, w, c.H); ctx.clip();
      var g = ctx.createRadialGradient(x - R * 0.2, cy - R * 0.9, R * 0.1, x, cy, R * 1.1); g.addColorStop(0, PX.shade(a[2], 0.35)); g.addColorStop(1, PX.shade(a[2], -0.35));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, R, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.14)";
      if (i === 0){ [[-0.3, 7, 6], [0.15, 13, 8], [0.32, 6, 4]].forEach(function(q){ ctx.beginPath(); ctx.ellipse(x + q[0] * w, gnd + q[1], q[2], q[2] * 0.4, 0, 0, 6.2832); ctx.fill(); }); }
      if (i === 3){ ctx.fillStyle = "rgba(60,150,90,.8)"; ctx.beginPath(); ctx.ellipse(x - w * 0.12, gnd + 9, w * 0.2, 5, 0, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + w * 0.25, gnd + 15, w * 0.1, 4, 0, 0, 6.2832); ctx.fill(); }
      if (i === 4){ ctx.fillStyle = "rgba(255,240,220,.35)"; [8, 17, 26].forEach(function(dy, j){ ctx.fillRect(x - w / 2, gnd + dy, w, 3 + (j % 2)); }); }
      ctx.restore();
    }
    k.draw(function(){
      var H = h.value, M = m.value, ph = PX.phone(c), top = 70, gnd = c.H - (ph ? 92 : 84), scl = (gnd - top) / H, cw = (c.W - X0 - 6) / 5, tmax = 0;
      var tfs = ASTRES.map(function(a){ return Math.sqrt(2 * H / a[1]); }), dtS = P4.nice(Math.max.apply(null, tfs) / 10);
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#101b33", "#26365a");
      ctx.fillStyle = "rgba(255,255,255,.7)"; for (var i = 0; i < 46; i++){ ctx.fillRect((i * 97.3) % c.W, (i * 53.7) % (gnd - 20), 1.4, 1.4); }
      PX.vruler(c, X0 - 8, gnd, top, 0, H, P4.nice(H / 6), "m", {col:"#aeb9cc"});
      S.draw.line(c, X0 - 4, top, c.W - 6, top, "rgba(255,255,255,.35)", 1.4, [5, 4]);
      var order = tfs.map(function(t, j){ return [t, j]; }).sort(function(a, b){ return a[0] - b[0]; }), rank = {}; order.forEach(function(o, r){ rank[o[1]] = r + 1; });
      ASTRES.forEach(function(a, i){
        var g = a[1], tf = tfs[i], x = X0 + cw * (i + 0.5), d = Math.min(H, 0.5 * g * st.t * st.t), on = a[0] === sel.value, r = 6 + 7 * Math.sqrt(M / 100);
        tmax = Math.max(tmax, tf);
        if (on){ ctx.fillStyle = "rgba(244,197,66,.10)"; ctx.fillRect(x - cw / 2 + 2, 30, cw - 4, gnd - 30 + 6); }
        planet(x, gnd, cw - 6, a, i);
        ctx.save(); ctx.fillStyle = "rgba(255,255,255,.28)";
        for (var s = dtS; s < Math.min(st.t, tf) - 1e-6; s += dtS){ ctx.beginPath(); ctx.arc(x, top + 0.5 * g * s * s * scl, r * 0.55, 0, 6.2832); ctx.fill(); }
        ctx.restore();
        PX.ball(c, x, top + d * scl - 0, r, on ? "#f4c542" : "#e8edf5");
        S.draw.label(c, a[0], x, 16, {color:on ? P.yellow : "#e8edf5", fill:"rgba(255,255,255,.12)", size:PX.fs(c, 12.5)});
        S.draw.label(c, "g = " + S.fmt(g, 1), x, 42, {color:"#aeb9cc", fill:"rgba(255,255,255,.08)", size:10.5});
        var done = st.t >= tf;
        S.draw.label(c, S.fmt(Math.min(st.t, tf), 2) + " s", x, gnd + (ph ? 40 : 38), {color:done ? P.red : "#2c3a4e", fill:"rgba(255,255,255,.93)", size:12});
        S.draw.label(c, "P = " + S.fmt(M * g, 0) + " N", x, gnd + (ph ? 64 : 62), {color:"#2c3a4e", fill:"rgba(255,255,255,.88)", size:10.5});
        if (st.t >= tmax && st.t > 0) S.draw.label(c, rank[i] + (rank[i] === 1 ? "ᵉʳ" : "ᵉ"), x, gnd + (ph ? 80 : 80), {color:P.yellow, fill:"rgba(255,255,255,.1)", size:11});
      });
      if (st.t > tmax + 0.8) lp.pause();
      var g0 = ASTRES.filter(function(a){ return a[0] === sel.value; })[0][1], t0 = Math.sqrt(2 * H / g0);
      ro.set(0, S.fmt(g0, 2) + " m/s²"); ro.set(1, S.fmt(t0, 2) + " s"); ro.set(2, S.fmt(g0 * t0, 1) + " m/s"); ro.set(3, S.fmt(M * g0, 1) + " N");
      nt.set("Masse : " + M + " kg partout. Rapport Terre/" + sel.value + " pour le poids : " + S.fmt(9.8 / g0, 2) + ". Temps de chute indépendant de la masse.", "");
    });
  }
});

SFA.sim({
  id:"p4-c03-parachute", ch:"c03", tag:"Vitesse limite",
  titre:"Le parachutiste et la vitesse limite",
  resume:"La vitesse augmente, puis plafonne : v(t) tend vers une vitesse limite.",
  but:"Change la surface qui freine (corps groupé, bras écartés, parachute) et la masse. Regarde la résistance de l'air R grandir jusqu'à égaler le poids P, et compare avec la chute sans air (pointillés).",
  aRetenir:"Avec l'air, la résistance grandit avec la vitesse. Quand elle égale le poids, a = 0 et la vitesse reste constante : c'est la vitesse limite v<sub>lim</sub>. Une plus grande surface donne une vitesse limite plus faible.",
  piege:"« Vitesse limite » ne veut pas dire « le parachutiste s'arrête de tomber » : il continue de tomber à vitesse constante. Et plus la masse est grande, plus v<sub>lim</sub> est grande. (Modèle simplifié : v<sub>lim</sub> = √(2·m·g/(ρ·S)) avec ρ = 1,2 kg/m³, S = surface efficace.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.8, 1.1), g1 = PX.canvas(k, 0.42, 0.62), st = {t:6}, A = {};
    var pos = k.seg("Position / équipement", [[0.7,"Corps groupé"],[1,"Bras écartés"],[25,"Parachute"]], 0.7, function(v){ surf.set(+v); });
    var surf = k.slider("Surface efficace S", 0.5, 30, 0.1, 0.7, "m²", function(){ pos.set(-1); });
    var m = k.slider("Masse (avec équipement)", 50, 120, 5, 80, "kg");
    var ts = k.slider("Instant t", 0, 30, 0.5, 6, "s", function(val){ st.t = val; });
    var ro = k.readouts(["Vitesse limite", "v(t)", "a(t)", "Temps pour 95 % de v lim"]);
    var nt = k.note("Repères : S ≈ 0,7 m² (corps groupé), 1 m² (bras écartés), 25 m² (parachute ouvert).", "");
    var lp = k.loop(function(dt){ st.t = Math.min(30, st.t + dt * 2); ts.set(st.t); if (st.t >= 30) lp.pause(); k.redraw(); });
    k.button("▶ Lancer", function(){ st.t = 0; ts.set(0); lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    g1.pointer(function(type, p){ if (type === "up" || type === "move" || !A.ax) return; st.t = Math.max(0, Math.min(30, Math.round(A.ax.ix(p.x) * 2) / 2)); lp.pause(); ts.set(st.t); k.redraw(); });
    function diver(x, y, s, sc, ph){
      var ctx = c.ctx; ctx.save(); ctx.translate(x, y); ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (s >= 3){   /* parachute ouvert */
        var r = 12 + 4.6 * Math.sqrt(s) * sc;
        ctx.strokeStyle = "rgba(15,27,45,.55)"; ctx.lineWidth = 1;
        [-1, -0.5, 0, 0.5, 1].forEach(function(q){ ctx.beginPath(); ctx.moveTo(q * r, -48 * sc); ctx.lineTo(0, -4 * sc); ctx.stroke(); });
        var g = ctx.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, "#e0562f"); g.addColorStop(0.5, "#f7f0e4"); g.addColorStop(1, "#e0562f");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-r, -48 * sc); ctx.quadraticCurveTo(0, -48 * sc - r * 1.5, r, -48 * sc); ctx.quadraticCurveTo(0, -48 * sc + 8, -r, -48 * sc); ctx.fill(); ctx.strokeStyle = "rgba(15,27,45,.5)"; ctx.stroke();
        ctx.strokeStyle = P.acc; ctx.lineWidth = 7 * sc; ctx.beginPath(); ctx.moveTo(0, -4 * sc); ctx.lineTo(0, 22 * sc); ctx.stroke();
        ctx.strokeStyle = "#233047"; ctx.lineWidth = 5 * sc; ctx.beginPath(); ctx.moveTo(0, 22 * sc); ctx.lineTo(-3 * sc, 40 * sc); ctx.moveTo(0, 22 * sc); ctx.lineTo(4 * sc, 40 * sc); ctx.stroke();
        ctx.fillStyle = "#f0c9a0"; ctx.beginPath(); ctx.arc(0, -10 * sc, 6 * sc, 0, 6.2832); ctx.fill();
      } else if (s >= 0.85){   /* bras et jambes écartés, ventre vers le sol */
        ctx.strokeStyle = P.acc; ctx.lineWidth = 9 * sc; ctx.beginPath(); ctx.moveTo(-26 * sc, 0); ctx.lineTo(18 * sc, 0); ctx.stroke();
        ctx.lineWidth = 5 * sc; ctx.beginPath(); ctx.moveTo(10 * sc, -2 * sc); ctx.lineTo(26 * sc, -24 * sc); ctx.moveTo(10 * sc, 2 * sc); ctx.lineTo(28 * sc, 20 * sc); ctx.stroke();
        ctx.strokeStyle = "#233047"; ctx.beginPath(); ctx.moveTo(-26 * sc, -2 * sc); ctx.lineTo(-48 * sc, -22 * sc); ctx.moveTo(-26 * sc, 2 * sc); ctx.lineTo(-50 * sc, 16 * sc); ctx.stroke();
        ctx.fillStyle = "#f0c9a0"; ctx.beginPath(); ctx.arc(26 * sc, 0, 7 * sc, 0, 6.2832); ctx.fill();
      } else {   /* corps groupé, tête en bas */
        ctx.strokeStyle = P.acc; ctx.lineWidth = 9 * sc; ctx.beginPath(); ctx.moveTo(0, -30 * sc); ctx.lineTo(0, 12 * sc); ctx.stroke();
        ctx.lineWidth = 4 * sc; ctx.beginPath(); ctx.moveTo(0, 6 * sc); ctx.lineTo(-6 * sc, 26 * sc); ctx.moveTo(0, 8 * sc); ctx.lineTo(6 * sc, 26 * sc); ctx.stroke();
        ctx.strokeStyle = "#233047"; ctx.beginPath(); ctx.moveTo(0, -28 * sc); ctx.lineTo(-9 * sc, -44 * sc); ctx.moveTo(0, -26 * sc); ctx.lineTo(8 * sc, -44 * sc); ctx.stroke();
        ctx.fillStyle = "#f0c9a0"; ctx.beginPath(); ctx.arc(0, 18 * sc + 12 * sc, 6.5 * sc, 0, 6.2832); ctx.fill();
      }
      ctx.restore();
    }
    k.draw(function(){
      var Sf = surf.value, M = m.value, vt = Math.sqrt(2 * M * G / (1.2 * Sf)), T = st.t, v = velFall(vt, T), a = G * (1 - (v / vt) * (v / vt)), alt = posFall(vt, T);
      var ph = PX.phone(c), W = c.W, split = W * 0.62, Pw = M * G, R = Pw * (v / vt) * (v / vt);
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#2f6fb5", "#bcd9f2");
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, c.H); ctx.clip();
      var per = c.H + 160;
      [[0.18, 40, 1.0, 0.35], [0.72, 150, 0.8, 0.3], [0.4, 270, 1.2, 0.5], [0.85, 380, 0.9, 0.55], [0.1, 520, 1.1, 0.7]].forEach(function(q){
        var yy = ((q[1] - alt * 0.9 * q[3]) % per + per) % per - 60; PX.cloud(c, q[0] * split, yy, q[2] * (ph ? 0.8 : 1), 0.55 + 0.4 * q[3]);
      });
      ctx.strokeStyle = "rgba(255,255,255," + Math.min(0.6, v / 70) + ")"; ctx.lineWidth = 1.6;
      for (var i = 0; i < 14; i++){ var sx = (i * 61.7) % split, sy = ((i * 97.3 + alt * 3.2) % c.H), len = 6 + v * 0.5; ctx.beginPath(); ctx.moveTo(sx, c.H - sy); ctx.lineTo(sx, c.H - sy - len); ctx.stroke(); }
      ctx.restore();
      var sc = Math.min(1.8, c.H / 230); diver(split * 0.5, c.H * 0.5, Sf, sc, ph);
      S.draw.label(c, "chute : " + S.fmt(alt, 0) + " m", 10, 16, {align:"left", color:P.ink, size:12});
      S.draw.label(c, S.fmt(v, 0) + " m/s", split * 0.5, c.H - 18, {color:P.red, size:14, weight:800});
      /* panneau des forces */
      var px = split + 8, pw = W - px - 8, cx = px + pw / 2, cy = c.H * 0.5, uF = (c.H * 0.34) / (120 * G);
      S.draw.panel(c, px, 8, pw, c.H - 16, {title:"Forces", shadow:false});
      S.draw.line(c, cx, 34, cx, c.H - 14, "#e3e7ed", 1.5, [3, 4]);
      S.draw.arrow(c, cx - pw * 0.17, cy, cx - pw * 0.17, cy + Pw * uF, P.red, 5);
      S.draw.arrow(c, cx + pw * 0.17, cy, cx + pw * 0.17, cy - Math.max(0.5, R * uF), P.acc, 5);
            S.draw.label(c, "P = " + S.fmt(Pw, 0) + " N", cx - pw * 0.17, cy + Pw * uF + 18 > c.H - 38 ? c.H - 40 : cy + Pw * uF + 16, {color:P.red, size:ph ? 10.5 : 11.5});
      S.draw.label(c, "R = " + S.fmt(R, 0) + " N", cx + pw * 0.17, cy - Math.max(0.5, R * uF) - 14 < 56 ? 58 : cy - R * uF - 14, {color:P.acc, size:ph ? 10.5 : 11.5});
      S.draw.label(c, Math.abs(Pw - R) < 0.02 * Pw ? "P = R : v constante" : "P − R = " + S.fmt(Pw - R, 0) + " N", cx, c.H - 38 - 18, {color:Math.abs(Pw - R) < 0.02 * Pw ? P.green : P.ink, size:ph ? 10.5 : 11.5});
      /* graphique v(t) */
      var ymax = Math.max(vt * 1.2, 20);
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:30, y0:0, y1:ymax, xl:"t (s)", yl:"v (m/s)", stepX:5}); A.ax = ax;
      S.draw.area(g1, ax, function(t){ return velFall(vt, t); }, 0, T, P.acc, 0.12);
      S.draw.fn(g1, ax, function(t){ return G * t; }, "#b8c0cc", 2, [6, 5]);
      S.draw.line(g1, ax.X(0), ax.Y(vt), ax.X(30), ax.Y(vt), P.red, 1.8, [7, 4]); S.draw.label(g1, "v lim = " + S.fmt(vt, 1) + " m/s", ax.X(30) - 4, ax.Y(vt) - 12, {color:P.red, align:"right", size:11.5});
      S.draw.fn(g1, ax, function(t){ return velFall(vt, t); }, P.acc, 3.2);
      S.draw.dot(g1, ax.X(T), ax.Y(v), 6, P.amber);
      S.draw.label(g1, "sans air : v = g·t", ax.X(1.2), ax.Y(Math.min(ymax * 0.92, G * 4.2)), {color:"#8a95a3", align:"left", size:11});
      ro.set(0, S.fmt(vt, 1) + " m/s = " + S.fmt(vt * 3.6, 0) + " km/h"); ro.set(1, S.fmt(v, 1) + " m/s"); ro.set(2, S.fmt(a, 2) + " m/s²");
      ro.set(3, S.fmt(1.8318 * vt / G, 1) + " s");
      nt.set(a < 0.05 * G ? "a ≈ 0 : la résistance de l'air équilibre le poids. La vitesse ne change presque plus." : "À cet instant a = " + S.fmt(a, 1) + " m/s² : plus petite que g = 9,8 m/s², car l'air freine déjà.", "");
    });
  }
});
})();
