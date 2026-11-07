/* Physique 4e · chapitre 4 · Énergie cinétique et potentielle */
(function(){
var G = 9.8;
var NODES = [[0,30],[28,0],[58,20],[78,4],[100,30]];
function seg(x){ for (var i = 0; i < NODES.length - 1; i++) if (x <= NODES[i + 1][0]) return i; return NODES.length - 2; }
function trY(x){ var i = seg(x), a = NODES[i], b = NODES[i + 1]; return a[1] + (b[1] - a[1]) * (1 - Math.cos(Math.PI * (x - a[0]) / (b[0] - a[0]))) / 2; }
function trD(x){ var i = seg(x), a = NODES[i], b = NODES[i + 1]; return (b[1] - a[1]) / 2 * Math.sin(Math.PI * (x - a[0]) / (b[0] - a[0])) * Math.PI / (b[0] - a[0]); }
function agm(a, b){ for (var i = 0; i < 30; i++){ var t = (a + b) / 2; b = Math.sqrt(a * b); a = t; } return a; }

SFA.sim({
  id:"p4-c04-montagnes-russes", ch:"c04", tag:"Classique",
  titre:"Montagnes russes : barres Ec, Ep, Em",
  resume:"Un chariot sans frottement : l'énergie passe de potentielle à cinétique et inversement.",
  but:"Glisse la ligne verte (hauteur de départ) pour lâcher le chariot de plus haut ou de plus bas. Choisis la hauteur de départ. Le chariot est lâché sans vitesse. Regarde les barres. Déplace aussi le niveau de référence de E<sub>p</sub>.",
  aRetenir:"Sans frottement, E<sub>m</sub> = E<sub>c</sub> + E<sub>p</sub> reste constante : E<sub>c</sub> = ½·m·v², E<sub>p</sub> = m·g·h. Le chariot ne peut jamais dépasser sa hauteur de départ. Sa vitesse ne dépend pas de sa masse.",
  piege:"E<sub>p</sub> dépend du niveau choisi pour h = 0 : changer de référence change E<sub>p</sub> (et E<sub>m</sub>), mais jamais E<sub>c</sub> ni les échanges d'énergie. Si la hauteur de départ est inférieure à celle d'une bosse, le chariot ne la franchit pas.",
  build:function(k,S){
    var c = PX.canvas(k, 0.55, 0.78), b = k.canvas(120), st = {x:0, u:0}, Gr = {};
    var H0, m, ref;
    function reset(){ var h = H0 ? H0.value : 24; st.x = 28 / Math.PI * Math.acos(Math.max(-1, 1 - (30 - h) / 15)); st.u = 0; }
    H0 = k.slider("Hauteur de départ", 5, 29, 1, 24, "m", function(){ reset(); lp.play(); });
    m = k.slider("Masse du chariot (avec passagers)", 100, 800, 50, 400, "kg");
    ref = k.slider("Niveau de référence (E<sub>p</sub> = 0) à", 0, 10, 1, 0, "m");
    var ro = k.readouts(["Hauteur h", "Vitesse v", "Ec", "Ep (rapportée au niveau choisi)"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){
      var n = Math.ceil(dt / 0.004), d = dt / n, i;
      for (i = 0; i < n; i++){
        var yd = trD(st.x), q = Math.sqrt(1 + yd * yd);
        st.u += -G * yd / q * d; st.x += st.u / q * d;
        if (st.x < 0){ st.x = 0; st.u = Math.abs(st.u); } if (st.x > 100){ st.x = 100; st.u = -Math.abs(st.u); }
      }
      k.redraw();
    });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Relâcher", function(){ reset(); lp.play(); });
    reset(); lp.play();
    PX.drag(k, c, function(){ return [{x:Gr.x, y:Gr.y, r:14, set:function(px, py){ H0.set(Math.max(5, Math.min(29, Math.round((Gr.gnd - py) / Gr.sc)))); reset(); lp.play(); }}]; });
    k.draw(function(){
      var P = SFA.draw.palette, M = m.value, R = ref.value, Hh = H0.value, y = trY(st.x);
      var pad = 12, gnd = c.H - 20, sc = (gnd - 24) / 32, RX = function(x){ return pad + x / 100 * (c.W - 2 * pad); }, RY = function(h){ return gnd - h * sc; };
      c.clear(); PX.bg(c, "#d4e6f8", "#f0f6fc"); var ctx = c.ctx; ctx.beginPath(); ctx.moveTo(RX(0), gnd + 10);
      for (var x = 0; x <= 100; x += 1) ctx.lineTo(RX(x), RY(trY(x)));
      ctx.lineTo(RX(100), gnd + 10); ctx.closePath(); ctx.fillStyle = PX.lin(c, 0, 0, 0, c.H, [[0, "#b9c4d3"], [1, "#98a6b8"]]); ctx.fill();
      ctx.beginPath(); for (x = 0; x <= 100; x += 1){ if (x) ctx.lineTo(RX(x), RY(trY(x))); else ctx.moveTo(RX(x), RY(trY(x))); } ctx.strokeStyle = "#5f6b7a"; ctx.lineWidth = 3; ctx.stroke();
      S.draw.line(c, pad, RY(Hh), c.W - pad, RY(Hh), P.green, 1.5, [6, 4]); Gr.x = c.W - 40; Gr.y = RY(Hh); Gr.gnd = gnd; Gr.sc = sc; PX.grip(c, Gr.x, Gr.y, P.green, null, 7); P4.label(c, "hauteur de départ", c.W - 16, RY(Hh) - 9, P.green, "right");
      S.draw.line(c, pad, RY(R), c.W - pad, RY(R), P.violet, 1.5, [2, 4]); P4.label(c, "Ep = 0", 18, RY(R) - 9, P.violet, "left");
      var cx = RX(st.x), cy = RY(y); PX.ball(c, cx, cy - 9, 9, P.red);
      var Ep = M * G * (y - R), Ec = Math.max(0, M * G * (Hh - y)), Em = M * G * (Hh - R), v = Math.sqrt(2 * Ec / M);
      var big = Math.max(M * G * 30, 1);
      P4.bars(b, [{n:"Ep", v:Ep / 1000, col:P.green}, {n:"Ec", v:Ec / 1000, col:P.red}, {n:"Em", v:Em / 1000, col:P.acc}], {lo:-M * G * 10 / 1000, hi:big / 1000, unit:"kJ", fmt:function(q){ return S.fmt(q, 1); }});
      ro.set(0, S.fmt(y, 1) + " m"); ro.set(1, S.fmt(v, 1) + " m/s = " + S.fmt(v * 3.6, 0) + " km/h"); ro.set(2, S.fmt(Ec / 1000, 1) + " kJ"); ro.set(3, S.fmt(Ep / 1000, 1) + " kJ");
      nt.set(Hh < 20 ? "Départ à " + Hh + " m : la 2e bosse (20 m) est trop haute, le chariot fait des allers-retours dans la 1re vallée." : Hh <= 20.5 ? "Départ à 20 m : le chariot arrive tout juste au sommet de la bosse." : "Départ à " + Hh + " m : le chariot franchit la 2e bosse (20 m) et ressort avec de la vitesse.", Hh < 20 ? "warn" : "");
    });
  }
});

SFA.sim({
  id:"p4-c04-pendule", ch:"c04", tag:"Animation",
  titre:"Le pendule : Ec et Ep qui s'échangent",
  resume:"Amplitude, longueur et masse : qu'est-ce qui change la vitesse en bas ?",
  but:"Attrape la boule et écarte-la (amplitude), choisis la longueur du fil et la masse. Compare la vitesse au point bas avec la formule.",
  aRetenir:"Au point bas, E<sub>p</sub> est minimale et E<sub>c</sub> maximale : v = √(2·g·L·(1 − cos θ₀)). Cette vitesse ne dépend pas de la masse. À l'amplitude maximale, v = 0 et E<sub>p</sub> est maximale.",
  piege:"« Un pendule plus lourd va plus vite » : faux, la masse s'élimine dans ½·m·v² = m·g·h. La période, pour de petites amplitudes, ne dépend ni de la masse ni de l'amplitude (T ≈ 2π·√(L/g)).",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.85, 1.12), st = {th:0, w:0, trail:[], hint:true}, geo = {};
    var th0, L, m;
    function reset(){ st.th = (th0 ? th0.value : 40) * Math.PI / 180; st.w = 0; st.trail = []; }
    th0 = k.slider("Amplitude θ₀", 5, 80, 5, 40, "°", function(){ st.hint = false; reset(); });
    L = k.slider("Longueur du fil L", 0.5, 3, 0.1, 1.5, "m", reset);
    m = k.slider("Masse de la boule", 0.1, 2, 0.1, 0.5, "kg");
    var ro = k.readouts(["v au point bas (formule)", "v maintenant", "Période T (valeur exacte)", "T ≈ 2π√(L/g)"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var n = Math.ceil(dt / 0.004), d = dt / n, i, g = G / L.value; for (i = 0; i < n; i++){ st.w += -g * Math.sin(st.th) * d; st.th += st.w * d; } st.trail.push([st.th, 0]); if (st.trail.length > 16) st.trail.shift(); k.redraw(); });
    k.button("▶ / ❚❚", function(){ if (lp.running) lp.pause(); else lp.play(); }, true);
    k.button("↺ Relâcher", function(){ reset(); lp.play(); });
    reset(); lp.play();
    PX.drag(k, c, function(){ return [{x:geo.bx, y:geo.by, r:geo.r + 6, set:function(px, py){ st.hint = false; lp.pause(); var a = Math.atan2(px - geo.px, py - geo.py); a = Math.max(-1.4, Math.min(1.4, a)); var deg = Math.max(5, Math.min(80, Math.round(Math.abs(a) * 180 / Math.PI / 5) * 5)); th0.set(deg); st.th = Math.sign(a || 1) * deg * Math.PI / 180; st.w = 0; st.trail = []; }}]; }, function(){ lp.play(); });
    k.draw(function(){
      var Lm = L.value, M = m.value, T0 = th0.value * Math.PI / 180, th = st.th, ph = PX.phone(c);
      var pw = c.W * (ph ? 0.3 : 0.3), aw = c.W - pw, px = aw / 2, py = 34;
      var pxm = Math.min(110, (c.H - 80) / Lm, (aw / 2 - 22) / (Lm * Math.sin(Math.max(0.3, T0)))), r = Lm * pxm, br = 9 + M * 6;
      var bx = px + r * Math.sin(th), by = py + r * Math.cos(th);
      geo.bx = bx; geo.by = by; geo.px = px; geo.py = py; geo.r = br;
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#f4f6fa", "#e6ebf3");
      ctx.fillStyle = "#6b7787"; ctx.fillRect(px - 70, py - 12, 140, 10);
      ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; for (var i = -64; i <= 64; i += 12){ ctx.beginPath(); ctx.moveTo(px + i, py - 12); ctx.lineTo(px + i - 6, py - 20); ctx.stroke(); }
      /* position la plus basse, amplitude, trace */
      S.draw.line(c, px, py, px, py + r + br + 8, "#c9d1dc", 1.4, [4, 4]);
      ctx.save(); ctx.strokeStyle = P.green; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(px, py, r, Math.PI / 2 - T0, Math.PI / 2 + T0); ctx.stroke(); ctx.restore();
      S.draw.line(c, px - r * Math.sin(T0) - 14, py + r * Math.cos(T0), px + r * Math.sin(T0) + 14, py + r * Math.cos(T0), "rgba(36,119,90,.35)", 1, [2, 4]);
      st.trail.forEach(function(q, j){ var a = q[0]; ctx.fillStyle = "rgba(192,50,29," + (0.04 + 0.025 * j) + ")"; ctx.beginPath(); ctx.arc(px + r * Math.sin(a), py + r * Math.cos(a), br * 0.8, 0, 6.2832); ctx.fill(); });
      var Em = M * G * Lm * (1 - Math.cos(T0)), Ep = M * G * Lm * (1 - Math.cos(th)), Ec = Math.max(0, Em - Ep), v = Math.sqrt(2 * Ec / M), f = Em > 0 ? Ec / Em : 0;
      S.draw.line(c, px, py, bx, by, "#46515f", 2.2);
      ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.2832); ctx.fillStyle = "#13233a"; ctx.fill();
      PX.ball(c, bx, by, br, "rgb(" + Math.round(192 - 156 * (1 - f)) + "," + Math.round(50 + 70 * (1 - f)) + "," + Math.round(29 + 61 * (1 - f)) + ")", {shadowY:py + r + br + 8, shadowA:0.12 + 0.1 * f});
      PX.dimh = null;
      var hh = Lm * (1 - Math.cos(th));
      PX.dim(c, px - r * Math.sin(T0) - 14, py + r, px - r * Math.sin(T0) - 14, py + r - hh * pxm, "h = " + S.fmt(hh, 2) + " m", P.green, [-8, 0]);
      if (v > 0.05){ var dir = st.w >= 0 ? 1 : -1; S.draw.arrow(c, bx, by, bx + dir * Math.cos(th) * Math.min(90, 8 + v * 11), by - dir * Math.sin(th) * Math.min(90, 8 + v * 11), P.amber, 3.2); }
      if (st.hint) PX.grip(c, bx, by, P.red, "attrape", br);
      S.draw.label(c, "L = " + S.fmt(Lm, 1) + " m", px + 8, py + r / 2, {color:P.grey, size:11, align:"left"});
      /* réservoirs d'énergie */
      var tx = aw + 6, tw = pw - 10, ty0 = 40, ty1 = c.H - 38, bw = tw / 3 - 6, cols = [["Ep", Ep, P.green], ["Ec", Ec, P.red], ["Em", Em, P.acc]];
      S.draw.panel(c, tx - 4, 6, tw + 4, c.H - 12, {title:"Énergie", shadow:false});
      cols.forEach(function(q, j){ var x = tx + j * (bw + 6) + 2, hgt = Em > 0 ? (ty1 - ty0) * q[1] / Em : 0;
        ctx.fillStyle = "#eef1f5"; PX.rr(ctx, x, ty0, bw, ty1 - ty0, 5); ctx.fill();
        ctx.save(); PX.rr(ctx, x, ty0, bw, ty1 - ty0, 5); ctx.clip(); ctx.fillStyle = q[2]; ctx.fillRect(x, ty1 - hgt, bw, hgt); ctx.restore();
        S.draw.label(c, q[0], x + bw / 2, ty1 + 12, {color:q[2], size:11.5});
        S.draw.label(c, S.fmt(q[1], 1), x + bw / 2, ty0 - 10 + 0, {color:q[2], size:ph ? 10 : 11, fill:"rgba(255,255,255,.0)"}); });
      var vb = Math.sqrt(2 * G * Lm * (1 - Math.cos(T0))), T = 2 * Math.PI * Math.sqrt(Lm / G), Tex = T / agm(1, Math.cos(T0 / 2));
      ro.set(0, S.fmt(vb, 2) + " m/s"); ro.set(1, S.fmt(v, 2) + " m/s"); ro.set(2, S.fmt(Tex, 2) + " s"); ro.set(3, S.fmt(T, 2) + " s");
      nt.set("La masse (" + S.fmt(M, 1) + " kg) n'intervient pas dans v ni dans T. Plus l'amplitude est grande, plus T exacte s'écarte de la formule des petits angles (" + S.fmt((Tex / T - 1) * 100, 1) + " % ici).", "");
    });
  }
});

SFA.sim({
  id:"p4-c04-ec-vitesse", ch:"c04", tag:"Piège",
  titre:"Doubler la vitesse : l'énergie cinétique ×4",
  resume:"Compare l'énergie de deux véhicules et la hauteur de chute équivalente.",
  but:"Glisse les points 1 et 2 sur la courbe pour changer les vitesses. Règle la masse et deux vitesses. Regarde le rapport des énergies et la hauteur d'où il faudrait tomber pour avoir la même énergie.",
  aRetenir:"E<sub>c</sub> = ½·m·v² : proportionnelle à m, mais au CARRÉ de v. Vitesse ×2 → énergie ×4 ; vitesse ×3 → énergie ×9. Une vitesse v équivaut à une chute libre de hauteur h = v²/(2g).",
  piege:"Passer de 50 à 100 km/h ne double pas l'énergie du choc, elle est multipliée par 4. Il faut aussi convertir les km/h en m/s avant de calculer en joules (÷ 3,6).",
  build:function(k,S){
    var g1 = PX.canvas(k, 0.55, 0.72), b = k.canvas(90), Gq = {};
    var m = k.slider("Masse du véhicule", 500, 2000, 100, 1000, "kg");
    var v1 = k.slider("Vitesse 1", 10, 130, 5, 50, "km/h");
    var v2 = k.slider("Vitesse 2", 10, 130, 5, 100, "km/h");
    var ro = k.readouts(["Ec à la vitesse 1", "Ec à la vitesse 2", "Rapport Ec2/Ec1", "Chute équivalente (vitesse 2)"]);
    var nt = k.note("", "");
    g1.pointer(function(type, p){ if (type === "up" || type === "move" || !Gq.ax) return; var vv = Math.max(10, Math.min(130, Math.round(Gq.ax.ix(p.x) / 5) * 5)); if (type === "down" || !Gq.pick) Gq.pick = Math.abs(vv - v1.value) <= Math.abs(vv - v2.value) ? v1 : v2; Gq.pick.set(vv); k.redraw(); });
    g1.cv.addEventListener("pointerup", function(){ Gq.pick = null; });
    k.draw(function(){
      var P = SFA.draw.palette, M = m.value, a = v1.value / 3.6, bb = v2.value / 3.6;
      var Ec = function(v){ return 0.5 * M * v * v / 1000; };
      var e1 = Ec(a), e2 = Ec(bb), top = Ec(130 / 3.6) * 1.05;
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:140, y0:0, y1:top, xl:"v (km/h)", yl:"Ec (kJ)", stepX:20});
      Gq.ax = ax; S.draw.fn(g1, ax, function(x){ return Ec(x / 3.6); }, P.acc, 3);
      S.draw.line(g1, ax.X(0), ax.Y(0), ax.X(130), ax.Y(Ec(130 / 3.6) ), "#b8c0cc", 1.5, [5, 4]); P4.label(g1, "(si Ec était proportionnelle à v)", ax.X(95), ax.Y(Ec(95 / 3.6)) + 34, "#8a95a3");
      [[v1.value, e1, P.green, "1"], [v2.value, e2, P.red, "2"]].forEach(function(q){ S.draw.line(g1, ax.X(q[0]), ax.B, ax.X(q[0]), ax.Y(q[1]), q[2], 1.5, [3, 3]); S.draw.line(g1, ax.L, ax.Y(q[1]), ax.X(q[0]), ax.Y(q[1]), q[2], 1.5, [3, 3]); S.draw.dot(g1, ax.X(q[0]), ax.Y(q[1]), 6, q[2]); P4.label(g1, q[3], ax.X(q[0]) - 10, ax.Y(q[1]) - 10, q[2]); });
      P4.bars(b, [{n:"Ec 1", v:e1, col:P.green}, {n:"Ec 2", v:e2, col:P.red}], {lo:0, hi:top, unit:"kJ", fmt:function(q){ return S.fmt(q, 0); }});
      var rat = e2 / e1, hh = bb * bb / (2 * G);
      ro.set(0, S.fmt(e1, 1) + " kJ"); ro.set(1, S.fmt(e2, 1) + " kJ"); ro.set(2, "× " + S.fmt(rat, 2)); ro.set(3, S.fmt(hh, 1) + " m");
      nt.set("Rapport des vitesses : " + S.fmt(v2.value / v1.value, 2) + ". Rapport des énergies : " + S.fmt(rat, 2) + " = (" + S.fmt(v2.value / v1.value, 2) + ")². Aucune dépendance en m dans ce rapport.", "");
    });
  }
});

SFA.sim({
  id:"p4-c04-lancer-energie", ch:"c04", tag:"Graphes",
  titre:"Une balle lancée : Ec et Ep selon la hauteur",
  resume:"Les deux énergies en fonction de la hauteur : l'une monte exactement comme l'autre descend.",
  but:"Choisis la vitesse de lancer et la masse. Fais monter la balle (attrape-la, curseur ou animation) et regarde les réservoirs d'énergie et les trois courbes E(h).",
  aRetenir:"Ep = m·g·h est une droite croissante ; Ec = Em − Ep est une droite décroissante ; Em est constante. Elles se croisent à mi-hauteur de la montée. Au sommet : Ec = 0 et Ep = Em.",
  piege:"Au sommet, l'énergie n'a pas disparu : toute l'énergie cinétique est devenue potentielle. La vitesse est nulle, pas l'énergie totale. (Sans frottement de l'air.)",
  build:function(k,S){
    var P = S.draw.palette, c = PX.canvas(k, 0.7, 1.0), g1 = PX.canvas(k, 0.5, 0.7), st = {t:0, hint:true}, geo = {}, A = {};
    var v0 = k.slider("Vitesse de lancer", 5, 30, 1, 20, "m/s");
    var m = k.slider("Masse de la balle", 0.1, 2, 0.1, 0.5, "kg");
    var fr = k.slider("Position de la balle (0 % = sol, 100 % = sommet)", 0, 100, 1, 50, "%", function(val){ st.t = (1 - Math.sqrt(1 - val / 100)) * v0.value / G; st.up = true; });
    var ro = k.readouts(["Hauteur h", "Ec", "Ep", "Em = Ec + Ep"]);
    var nt = k.note("", "");
    var lp = k.loop(function(dt){ var tv = 2 * v0.value / G; st.t += dt; if (st.t >= tv){ st.t = tv; lp.pause(); } var hm = v0.value * v0.value / (2 * G), hh = v0.value * st.t - 0.5 * G * st.t * st.t; fr.set(Math.round(100 * hh / hm)); st.up = st.t < v0.value / G; k.redraw(); });
    k.button("▶ Lancer (monte puis redescend)", function(){ st.t = 0; st.hint = false; lp.play(); }, true);
    k.button("❚❚ Pause", function(){ lp.pause(); });
    st.t = (1 - Math.sqrt(0.5)) * 20 / G; st.up = true;
    function setH(h){ var hm = v0.value * v0.value / (2 * G), f = Math.max(0, Math.min(100, Math.round(100 * h / hm))); fr.set(f); st.t = (1 - Math.sqrt(1 - f / 100)) * v0.value / G; }
    PX.drag(k, c, function(){ return [{x:geo.bx, y:geo.by, r:12, set:function(px, py){ st.hint = false; lp.pause(); setH((geo.gnd - py) / geo.scl); }}]; });
    g1.pointer(function(type, p){ if (type === "up" || type === "move" || !A.ax) return; lp.pause(); st.hint = false; setH(Math.max(0, A.ax.ix(p.x))); k.redraw(); });
    k.draw(function(){
      var M = m.value, V0 = v0.value, hm = V0 * V0 / (2 * G), Em = 0.5 * M * V0 * V0, h = fr.value / 100 * hm, ph = PX.phone(c);
      var Ep = M * G * h, Ec = Math.max(0, Em - Ep), v = Math.sqrt(2 * Ec / M);
      var yTop = 30, gnd = c.H - 30, scl = (gnd - yTop) / (hm * 1.05), bx = c.W * 0.2, by = gnd - h * scl;
      geo.bx = bx; geo.by = by - 9; geo.gnd = gnd; geo.scl = scl;
      c.clear(); var ctx = c.ctx;
      PX.bg(c, "#d4e6f8", "#f0f6fc"); PX.ground(c, gnd, "#8fb87a", 30);
      var Y = PX.vruler(c, 34, gnd, yTop, 0, hm * 1.05, P4.nice(hm / 5), "m");
      S.draw.line(c, 38, Y(hm), c.W * 0.4, Y(hm), P.green, 1.4, [5, 4]); S.draw.label(c, "sommet " + S.fmt(hm, 1) + " m", c.W * 0.3, Y(hm) - 12, {color:P.green, size:11});
      S.draw.line(c, 38, Y(hm / 2), c.W * 0.4, Y(hm / 2), "rgba(95,107,122,.5)", 1.2, [2, 4]); S.draw.label(c, "mi-hauteur", c.W * 0.3, Y(hm / 2) - 11, {color:P.grey, size:10.5});
      ctx.save(); ctx.strokeStyle = "rgba(95,107,122,.35)"; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(bx, gnd); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
      PX.ball(c, bx, by - 9, 9 + M * 3, "rgb(" + Math.round(36 + 156 * (Ec / Em)) + "," + Math.round(119 - 69 * (Ec / Em)) + "," + Math.round(90 - 61 * (Ec / Em)) + ")", {shadowY:gnd + 3, shadowA:0.2});
      if (v > 0.1) S.draw.arrow(c, bx + 24, by - 9, bx + 24, by - 9 - (st.up ? 1 : -1) * Math.min(60, 6 + v * 1.8), P.amber, 3);
      if (st.hint) PX.grip(c, bx, by - 9, P.red, "attrape-moi", 8);
      /* réservoirs */
      var tx0 = c.W * 0.46, bw = (c.W - tx0 - 14) / 3 - 8;
      [["Ep", Ep, P.green], ["Ec", Ec, P.red], ["Em", Ec + Ep, P.acc]].forEach(function(q, j){ var x = tx0 + j * (bw + 8), hg = (gnd - yTop) * q[1] / Em;
        ctx.fillStyle = "rgba(255,255,255,.7)"; PX.rr(ctx, x, yTop, bw, gnd - yTop, 6); ctx.fill(); ctx.strokeStyle = "#d3d9e2"; ctx.lineWidth = 1; ctx.stroke();
        ctx.save(); PX.rr(ctx, x, yTop, bw, gnd - yTop, 6); ctx.clip(); ctx.fillStyle = PX.lin(c, 0, gnd - hg, 0, gnd, [[0, q[2]], [1, PX.shade(q[2], -0.2)]]); ctx.fillRect(x, gnd - hg, bw, hg); ctx.restore();
        S.draw.label(c, q[0], x + bw / 2, gnd + 15, {color:q[2], size:12});
        S.draw.label(c, S.fmt(q[1], 1) + " J", x + bw / 2, yTop + 14 > gnd - hg - 10 ? gnd - hg + 14 : gnd - hg - 12, {color:q[2], size:ph ? 10 : 11}); });
      /* graphique E(h) */
      g1.clear(); var ax = S.draw.axes(g1, {x0:0, x1:hm, y0:0, y1:Em * 1.12, xl:"h (m)", yl:"énergie (J)"}); A.ax = ax;
      S.draw.line(g1, ax.X(0), ax.Y(Em), ax.X(hm), ax.Y(Em), P.acc, 3); S.draw.line(g1, ax.X(0), ax.Y(0), ax.X(hm), ax.Y(Em), P.green, 3); S.draw.line(g1, ax.X(0), ax.Y(Em), ax.X(hm), ax.Y(0), P.red, 3);
      S.draw.label(g1, "Em", ax.X(hm * 0.4), ax.Y(Em) - 13, {color:P.acc}); S.draw.label(g1, "Ep", ax.X(hm * 0.9), ax.Y(Em * 0.82) + 12, {color:P.green}); S.draw.label(g1, "Ec", ax.X(hm * 0.1), ax.Y(Em * 0.82) - 12, {color:P.red});
      S.draw.dot(g1, ax.X(hm / 2), ax.Y(Em / 2), 5, "#8a95a3"); S.draw.label(g1, "Ec = Ep", ax.X(hm / 2) + 36, ax.Y(Em / 2) + 20, {color:P.grey, size:11});
      S.draw.line(g1, ax.X(h), ax.B, ax.X(h), ax.T, "#b8c0cc", 1, [3, 3]); S.draw.dot(g1, ax.X(h), ax.Y(Ep), 6, P.green); S.draw.dot(g1, ax.X(h), ax.Y(Ec), 6, P.red);
      ro.set(0, S.fmt(h, 1) + " m (h max = " + S.fmt(hm, 1) + ")"); ro.set(1, S.fmt(Ec, 1) + " J"); ro.set(2, S.fmt(Ep, 1) + " J"); ro.set(3, S.fmt(Ec + Ep, 1) + " J");
      nt.set(fr.value >= 100 ? "Sommet : v = 0, Ec = 0, Ep = Em." : fr.value === 0 ? "Au sol (h = 0) : Ep = 0, toute l'énergie est cinétique : v = " + S.fmt(V0, 0) + " m/s." : "Ec = Ep quand h = h max / 2 = " + S.fmt(hm / 2, 1) + " m.", "");
    });
  }
});
})();
