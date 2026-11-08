/* Chapitre 2 · Équilibre statique et première loi de Newton */
SFA.sim({
  id: "p5-c02-palet", ch: "c02", tag: "Inertie",
  titre: "Le palet sur la glace : sans frottement, pas de force nécessaire",
  resume: "Règle le frottement et regarde la vitesse du palet évoluer.",
  but: "Lance le palet à une vitesse initiale. Fais varier le coefficient de frottement μ : à μ = 0, que devient la vitesse ? Change la masse : change-t-elle l'accélération ?",
  aRetenir: "Sans résultante de forces, la vitesse reste constante (principe d'inertie) : un mouvement rectiligne uniforme n'a pas besoin de force. Avec frottement, a = −μ·g, indépendante de la masse.",
  piege: "« Si ça avance, il y a une force dans le sens du mouvement » est faux. C'est le frottement, une force opposée au mouvement, qui arrête le palet ; sans lui, il continue indéfiniment.",
  build: function(k, S){
    var c = k.canvas(230), gr = k.canvas(190);
    var mu = k.slider("Coefficient de frottement μ", 0, 0.3, 0.01, 0.05, "");
    var v0 = k.slider("Vitesse initiale", 1, 8, 0.5, 4, "m/s");
    var m = k.slider("Masse du palet", 0.2, 5, 0.1, 1, "kg");
    var sp = k.seg("Temps", [[1, "Réel"], [4, "×4"]], 1);
    var ro = k.readouts(["Temps écoulé", "Vitesse v", "Force de frottement", "Distance parcourue", "ΣF"]);
    var nt = k.note("", "");
    var T = 0, x = 0, v = 0, hist = [], dots = [], nextDot = 0;
    function reset(){ T = 0; x = 0; v = v0.value; hist = [[0, v]]; dots = [0]; nextDot = 0.5; lp.play(); }
    var lp = k.loop(function(dt){
      var h = dt * sp.value, a = -mu.value * P5.g, n = Math.max(1, Math.ceil(h / 0.01));
      for (var i = 0; i < n; i++){
        var d = h / n; if (v <= 0){ v = 0; break; }
        var vn = Math.max(0, v + a * d); x += (v + vn) / 2 * d; v = vn; T += d;
        if (T - hist[hist.length - 1][0] > 0.2) hist.push([T, v]);
        if (T >= nextDot){ dots.push(x); nextDot += 0.5; }
      }
      if (v <= 0 && mu.value > 0) lp.pause();
      if (T > 60) lp.pause();
      k.redraw();
    });
    k.button("Lancer / relancer", reset, true);
    var cxp = 0, PXM = 46;
    /* manipulation directe : on tire la pointe de la flèche de vitesse pour régler la vitesse initiale */
    P5x.drag(c, k, function(){ return lp.running || T > 0 ? null : [{x: cxp + 22 + v0.value * 16, y: 78, r: 30, set: function(px){ v0.set(Math.round(P5.clamp((px - cxp - 22) / 16, 1, 8) * 2) / 2); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx;
      if (!hist.length){ v = v0.value; hist = [[0, v]]; dots = [0]; }
      if (!lp.running && T === 0) v = v0.value;
      P5x.sky(c, "#f4f9fe", "#e6f1fa");
      var iy = 118; cxp = c.W * 0.28;
      /* patinoire : glace avec reflets */
      ctx.fillStyle = P5x.lin(ctx, 0, iy, 0, c.H, [[0, "#cfe6f6"], [1, "#a9cfe8"]]); ctx.fillRect(0, iy, c.W, c.H - iy);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(0, iy, c.W, 2);
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.2;
      for (var s = 0; s < 6; s++){ var yy = iy + 14 + s * 17, ox = (-x * PXM * (0.4 + s * 0.12)) % 120; for (var q = ox - 120; q < c.W + 120; q += 120){ ctx.beginPath(); ctx.moveTo(q + s * 30, yy); ctx.lineTo(q + s * 30 + 46, yy); ctx.stroke(); } }
      /* règle graduée au sol (1 m) */
      var off = (x * PXM) % PXM; ctx.fillStyle = "rgba(15,27,45,.45)";
      for (var i = -1; i < c.W / PXM + 2; i++){ var px = cxp + i * PXM - off; ctx.fillRect(Math.round(px), iy + 6, 2, 9); }
      P5x.hint(c, "graduations : 1 m", {x: c.W - 10, y: c.H - 10, align: "right", size: 11.5, color: "#3d6a8a"});
      /* chronophotographie : un point toutes les 0,5 s */
      dots.forEach(function(d){ var px = cxp + (d - x) * PXM; if (px > -8 && px < c.W + 8){ S.draw.dot(c, px, iy - 12, 4, "rgba(31,75,158,.55)"); S.draw.line(c, px, iy - 8, px, iy + 1, "rgba(31,75,158,.3)", 1); } });
      /* palet */
      P5x.box(c, cxp, iy, 46, 20, "#2a3a55", "", {r: 6});
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(cxp - 18, iy - 14, 36, 3);
      var F = mu.value * m.value * P5.g;
      if (v > 0 && F > 0) P5.vec(c, cxp, iy - 10, cxp - Math.min(F * 8, 110) - 8, iy - 10, pal.red, "f", {dy: -14});
      if (v > 0.02) P5.vec(c, cxp + 26, 78, cxp + 22 + v * 16, 78, pal.acc, "v", {dy: -14, w: 3.2});
      else if (!lp.running && T === 0) P5.vec(c, cxp + 26, 78, cxp + 22 + v0.value * 16, 78, pal.acc, "v₀", {dy: -14, w: 3.2});
      S.draw.line(c, cxp + 26, 78, cxp + 26, iy - 22, "rgba(31,75,158,.35)", 1, [3, 3]);
      if (!lp.running && T === 0) P5x.handle(c, cxp + 22 + v0.value * 16, 78, pal.acc, 8);
      if (!lp.running && T === 0) P5x.hint(c, "Tire la pointe bleue pour régler v₀, puis lance", {y: 14});
      else P5x.hint(c, "points bleus : un point toutes les 0,5 s (chronophotographie)", {y: 14});
      if (v <= 0 && T > 0) P5x.banner(c, "Arrêt après " + S.fmt(x, 1) + " m et " + S.fmt(T, 1) + " s", pal.red, 40);
      else if (mu.value === 0 && T > 2) P5x.banner(c, "Aucune force : les points restent équidistants", pal.green, 40);
      /* graphe v(t) avec la prévision */
      gr.clear();
      var vi = v0.value, mg = mu.value * P5.g, tm = mg > 0 ? Math.max(4, Math.min(60, vi / mg * 1.25)) : Math.max(20, T * 1.1);
      var ax = S.draw.axes(gr, {x0: 0, x1: tm, y0: 0, y1: 8.5, xl: "t (s)", yl: "v (m/s)", stepY: 2});
      S.draw.fn(gr, ax, function(t){ return Math.max(0, vi - mg * t); }, "rgba(138,149,163,.7)", 2, [6, 4]);
      ctx = gr.ctx; ctx.strokeStyle = pal.acc; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath();
      hist.forEach(function(p, i){ if (i === 0) ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); else ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); });
      ctx.lineTo(ax.X(T), ax.Y(v)); ctx.stroke(); S.draw.dot(gr, ax.X(T), ax.Y(v), 6, pal.red);
      P5x.tag(gr, mu.value === 0 ? "pente nulle : v constante" : "pente = −μ·g = " + S.fmt(-mg, 2) + " m/s²", ax.X(tm * 0.97), ax.Y(7.6), pal.acc, {align: "right"});
      ro.set(0, S.fmt(T, 1) + " s"); ro.set(1, S.fmt(v, 2) + " m/s"); ro.set(2, S.fmt(v > 0 ? F : 0, 2) + " N"); ro.set(3, S.fmt(x, 1) + " m");
      ro.set(4, v > 0 ? S.fmt(-F, 2) + " N" : "0 N");
      if (mu.value === 0) nt.set("μ = 0 : ΣF = 0 et la vitesse reste " + S.fmt(v0.value, 1) + " m/s. Le palet continue tout seul, sans aucune force vers l'avant.", "ok");
      else nt.set("a = −μ·g = " + S.fmt(-mu.value * P5.g, 2) + " m/s² ; arrêt après " + S.fmt(v0.value / (mu.value * P5.g), 1) + " s et " + S.fmt(v0.value * v0.value / (2 * mu.value * P5.g), 1) + " m. La masse n'intervient pas dans a.", "");
    });
    reset();
  }
});

SFA.sim({
  id: "p5-c02-poutre", ch: "c02", tag: "Moments",
  titre: "La bascule : équilibre de rotation",
  resume: "Positions et masses → moments, et la poutre bascule ou reste en équilibre.",
  but: "Place deux masses sur une poutre légère (sa masse est négligée) posée sur un pivot. Trouve les positions pour lesquelles la poutre reste horizontale, puis déplace le pivot.",
  aRetenir: "Équilibre d'un solide : ΣF = 0 (le support compense le poids total) ET Σ des moments = 0. Moment = force × bras de levier : M = F·d.",
  piege: "L'équilibre ne dépend pas seulement des masses mais aussi des distances au pivot : une petite masse loin du pivot équilibre une grande masse proche.",
  build: function(k, S){
    var c = k.canvas(300);
    var m1 = k.slider("Masse 1 (bleue)", 1, 20, 1, 6, "kg");
    var x1 = k.slider("Position de la masse 1", 0, 10, 0.1, 2, "m");
    var m2 = k.slider("Masse 2 (rouge)", 1, 20, 1, 3, "kg");
    var x2 = k.slider("Position de la masse 2", 0, 10, 0.1, 8, "m");
    var xp = k.slider("Position du pivot", 2, 8, 0.1, 5, "m");
    k.button("Équilibrer avec la masse 2", function(){ var x = xp.value + m1.value * (xp.value - x1.value) / m2.value; if (x >= 0 && x <= 10) x2.set(Math.round(x * 10) / 10); });
    var ro = k.readouts(["Moment gauche (↺)", "Moment droit (↻)", "Σ moments", "Force du pivot"]);
    var nt = k.note("", ""), tilt = 0, G = {L: 0, ux: 0, py: 0, px: 0, a: [0, 0], b: [0, 0], p: [0, 0]};
    var lp = k.loop(function(dt){ var g = P5.g, net = m1.value * g * (x1.value - xp.value) + m2.value * g * (x2.value - xp.value), tgt = Math.abs(net) < 0.05 ? 0 : 0.22 * Math.tanh(net / 60); tilt += (tgt - tilt) * Math.min(1, dt * 5); k.redraw(); }); lp.play();
    /* manipulation directe : on glisse chaque masse le long de la poutre, et le pivot */
    P5x.drag(c, k, function(){ return [
      {x: G.a[0], y: G.a[1], r: 28, set: function(px){ x1.set(Math.round(P5.clamp((px - G.ux) / G.L * 10, 0, 10) * 10) / 10); }},
      {x: G.b[0], y: G.b[1], r: 28, set: function(px){ x2.set(Math.round(P5.clamp((px - G.ux) / G.L * 10, 0, 10) * 10) / 10); }},
      {x: G.p[0], y: G.p[1], r: 24, set: function(px){ xp.set(Math.round(P5.clamp((px - G.ux) / G.L * 10, 2, 8) * 10) / 10); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g; P5x.sky(c, "#f6f9fd", "#e8eff7");
      var mo1 = m1.value * g * (x1.value - xp.value), mo2 = m2.value * g * (x2.value - xp.value), net = mo1 + mo2, balanced = Math.abs(net) < 0.05;
      var L = c.W - 80, ux = 40, px = ux + xp.value / 10 * L, py = c.H - 96; G.L = L; G.ux = ux;
      P5x.ground(c, c.H - 38, {col: "#d9dee6"});
      /* pivot triangulaire */
      ctx.fillStyle = P5x.lin(ctx, 0, py, 0, py + 58, [[0, "#9aa6b6"], [1, "#6b7685"]]); ctx.beginPath(); ctx.moveTo(px, py + 4); ctx.lineTo(px - 26, c.H - 38); ctx.lineTo(px + 26, c.H - 38); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.translate(px, py); ctx.rotate(tilt);
      ctx.fillStyle = P5x.lin(ctx, 0, -7, 0, 7, [[0, "#e6c48f"], [1, "#b8946a"]]); P5x.rr(ctx, ux - px - 8, -7, L + 16, 14, 4); ctx.fill(); ctx.strokeStyle = "#8a6c45"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "rgba(60,40,10,.35)"; for (var i = 0; i <= 10; i++) ctx.fillRect(ux - px + i / 10 * L - 0.75, -7, 1.5, i % 5 ? 4 : 7);
      function mass(xm, mm, col){ var X = ux + xm / 10 * L - px, w = 22 + mm * 1.3; P5x.box(c, X, -7, w, w, col, mm + " kg", {size: 11}); return [X, -7 - w / 2]; }
      var a = mass(x1.value, m1.value, pal.acc), b = mass(x2.value, m2.value, pal.red);
      /* repères de bras de levier */
      ctx.restore();
      var ca = Math.cos(tilt), sa = Math.sin(tilt);
      function toScreen(p){ return [px + p[0] * ca - p[1] * sa, py + p[0] * sa + p[1] * ca]; }
      G.a = toScreen(a); G.b = toScreen(b); G.p = [px, py + 36];
      S.draw.dot(c, px, py, 4, "#33405a");
      /* règle graduée au sol, bras de levier */
      for (i = 0; i <= 10; i++){ var gx = ux + i / 10 * L; S.draw.line(c, gx, c.H - 38, gx, c.H - 32, "#6b7685", 1.5); S.draw.text(c, i + "", gx, c.H - 20, {size: 11.5, color: "#6b7685"}); }
      S.draw.text(c, "position (m)", c.W - 10, c.H - 6, {align: "right", size: 11, color: "#6b7685"});
      [[x1.value, pal.acc], [x2.value, pal.red]].forEach(function(e, j){ var X1 = ux + e[0] / 10 * L, xa = Math.min(X1, px), xb = Math.max(X1, px); S.draw.line(c, xa, c.H - 46, xb, c.H - 46, e[1], 3); if (xb - xa > 30) P5x.tag(c, "d = " + S.fmt(Math.abs(e[0] - xp.value), 1) + " m", (xa + xb) / 2, c.H - 58 - j * 0, e[1], {size: 11}); });
      P5x.handle(c, G.a[0], G.a[1], pal.acc, 7); P5x.handle(c, G.b[0], G.b[1], pal.red, 7); P5x.handle(c, G.p[0], G.p[1], "#33405a", 6.5);
      P5x.hint(c, "Glisse les masses et le pivot", {y: 14, size: 12});
      if (balanced) P5x.banner(c, "Équilibre : Σ moments = 0", pal.green, 22); else P5x.banner(c, "La poutre bascule à " + (net > 0 ? "droite (↻)" : "gauche (↺)"), pal.red, 22);
      var N = (m1.value + m2.value) * g;
      ro.set(0, S.fmt(Math.abs(Math.min(mo1, 0)) + Math.abs(Math.min(mo2, 0)), 1) + " N·m");
      ro.set(1, S.fmt(Math.max(mo1, 0) + Math.max(mo2, 0), 1) + " N·m");
      ro.set(2, S.fmt(net, 1) + " N·m"); ro.set(3, S.fmt(N, 1) + " N");
      if (balanced) nt.set("Équilibre : les moments se compensent (Σ ≈ 0) et le pivot porte (m₁ + m₂)·g = " + S.fmt(N, 1) + " N.", "ok");
      else nt.set("La poutre bascule vers le " + (net > 0 ? "côté droit (sens horaire)" : "côté gauche (sens anti-horaire)") + " : les moments ne se compensent pas (Σ = " + S.fmt(net, 1) + " N·m). Même si ΣF = 0, elle tourne.", "warn");
    });
  }
});

SFA.sim({
  id: "p5-c02-train", ch: "c02", tag: "Référentiels",
  titre: "Le pendule dans un train qui accélère",
  resume: "Accélération du train → inclinaison du fil.",
  but: "Fais accélérer ou freiner le train. Observe l'angle du fil, puis change la masse : l'angle change-t-il ? Relève le défi pour retrouver l'accélération à partir de l'angle.",
  aRetenir: "Vu du quai (référentiel galiléen), la boule accélère avec le train : T + P = m·a, d'où tan θ = a/g. L'angle ne dépend pas de la masse. La tension vaut T = m·√(g² + a²).",
  piege: "Dans le train, on dit « une force pousse la boule vers l'arrière » : c'est une force d'inertie, apparente, qui n'existe que dans un référentiel qui accélère. Dans un référentiel galiléen, aucune force ne pousse vers l'arrière.",
  build: function(k, S){
    var c = k.canvas(320);
    var a = k.slider("Accélération du train (+ : accélère, − : freine)", -6, 6, 0.1, 2, "m/s²");
    var m = k.slider("Masse de la boule", 0.1, 2, 0.1, 0.5, "kg");
    var seg = k.seg("Vue", [["quai", "Vue du quai"], ["train", "Vue du train"]], "quai");
    var ro = k.readouts(["Angle avec la verticale", "Tangente de l'angle (= a/g)", "Tension du fil", "Poids de la boule", "ΣF = m·a"]);
    var tg = [8, 18, 25], di = 0, nt = k.note("", "");
    k.button("Nouveau défi", function(){ di = (di + 1) % tg.length; });
    var th = 0, om = 0, sc = 0, L = 104, bob = {x: 0, y: 0};
    /* le fil se met en mouvement puis s'amortit vers l'angle d'équilibre : tan θ = a/g */
    var lp = k.loop(function(dt){
      var g = P5.g, A = a.value, n = 4, h = dt / n;
      for (var i = 0; i < n; i++){ var al = (A * Math.cos(th) - g * Math.sin(th)) / (L / 100) - 3.2 * om; om += al * h; th += om * h; }
      sc += (14 + A * 5) * dt * 6; k.redraw();
    });
    th = Math.atan(a.value / P5.g); lp.play();
    /* manipulation directe : on attrape la boule, l'angle choisi fixe a = g·tan θ */
    P5x.drag(c, k, function(){ return [{x: bob.x, y: bob.y, r: 34, set: function(px){ var s = P5.clamp((bob.cx - px) / L, -0.52, 0.52); a.set(Math.round(P5.g * Math.tan(Math.asin(s)) * 10) / 10); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, A = a.value, eq = Math.atan(A / g);
      var cx = c.W / 2, top = 96, wx0 = Math.max(14, cx - 215), wx1 = Math.min(c.W - 14, cx + 215), wy0 = 40, wy1 = 262;
      P5x.sky(c, "#cfe6fa", "#eaf4fb");
      /* paysage défilant : collines, poteaux, rails */
      var rel = seg.value === "quai" ? 1 : -1;
      ctx.fillStyle = "#cfe3d3"; ctx.beginPath(); ctx.moveTo(0, 250); for (var x = 0; x <= c.W; x += 20) ctx.lineTo(x, 226 + 12 * Math.sin((x + sc * 0.08) / 52)); ctx.lineTo(c.W, 300); ctx.lineTo(0, 300); ctx.fill();
      ctx.fillStyle = "#9bc3a4"; ctx.fillRect(0, 270, c.W, c.H - 270);
      ctx.fillStyle = "#6b5a4a"; ctx.fillRect(0, 278, c.W, 5);
      var off = ((sc * (seg.value === "quai" ? 0 : 1)) % 46 + 46) % 46; ctx.fillStyle = "rgba(0,0,0,.35)"; for (var q = -46; q < c.W + 46; q += 46) ctx.fillRect(q - off, 280, 8, 7);
      var po = ((sc * (seg.value === "quai" ? 0 : 1)) % 130 + 130) % 130;
      for (var p = -130; p < c.W + 130; p += 130){ var px = p - po; ctx.fillStyle = "#7d6a58"; ctx.fillRect(px, 196, 4, 84); ctx.fillRect(px - 10, 200, 24, 3); }
      /* wagon (légèrement transparent dans la vue du quai : on voit le pendule) */
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.18)"; ctx.shadowBlur = 12; P5x.rr(ctx, wx0, wy0, wx1 - wx0, wy1 - wy0, 14); ctx.fillStyle = "#f4f8fd"; ctx.fill(); ctx.restore();
      ctx.lineWidth = 3; ctx.strokeStyle = pal.acc; P5x.rr(ctx, wx0, wy0, wx1 - wx0, wy1 - wy0, 14); ctx.stroke();
      ctx.fillStyle = pal.acc; ctx.fillRect(wx0 + 4, wy1 - 26, wx1 - wx0 - 8, 22);
      for (var w = 0; w < 3; w++){ var wxx = wx0 + 30 + w * ((wx1 - wx0 - 60) / 3) + (w === 1 ? 0 : 0); if (w === 1) continue; ctx.fillStyle = "rgba(190,220,245,.45)"; P5x.rr(ctx, wxx, wy0 + 14, (wx1 - wx0 - 60) / 3 - 10, 54, 6); ctx.fill(); }
      S.draw.dot(c, wx0 + 60, wy1 + 14, 13, "#13233a"); S.draw.dot(c, wx1 - 60, wy1 + 14, 13, "#13233a"); S.draw.dot(c, wx0 + 60, wy1 + 14, 5, "#8fa0b5"); S.draw.dot(c, wx1 - 60, wy1 + 14, 5, "#8fa0b5");
      /* flèche du sens de marche et accélération du train */
      P5x.tag(c, "sens de marche →", wx1 - 6, wy0 - 14, "#4b5868", {align: "right"});
      if (Math.abs(A) > 0.05) P5.vec(c, cx - 6, wy1 - 14, cx - 6 + A * 14, wy1 - 14, pal.green, "", {w: 4});
      P5x.tag(c, "a = " + S.fmt(A, 1) + " m/s²", cx - 10 + Math.min(0, A * 14), wy1 - 34, pal.green, {align: "left"});
      /* pendule */
      var bx = cx - Math.sin(th) * L, by = top + Math.cos(th) * L; bob.x = bx; bob.y = by; bob.cx = cx;
      S.draw.line(c, cx, top, cx, top + L + 14, "rgba(15,27,45,.28)", 1.3, [4, 4]);
      ctx.fillStyle = "#8a95a3"; ctx.fillRect(cx - 14, top - 8, 28, 8);
      S.draw.line(c, cx, top, bx, by, pal.ink, 2.2);
      P5x.ball(c, bx, by, 12 + m.value * 2.5, pal.amber);
      /* angle */
      ctx.strokeStyle = pal.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, top, 44, Math.PI / 2, Math.PI / 2 + th, th < 0); ctx.stroke();
      if (Math.abs(th) > 0.04) S.draw.text(c, "θ", cx - Math.sin(th / 2) * 60, top + Math.cos(th / 2) * 60, {size: 14, color: pal.ink, math: true, italic: true});
      var P = m.value * g, T = m.value * Math.sqrt(g * g + A * A), s = 46 / P;
      P5.vec(c, bx, by, bx, by + P * s, pal.ink, "P", {dx: 12});
      var dxu = (cx - bx) / L, dyu = (top - by) / L;
      P5.vec(c, bx, by, bx + dxu * T * s, by + dyu * T * s, pal.red, "T", {dx: -12});
      if (seg.value === "quai"){
        if (Math.abs(A) > 0.05) P5.vec(c, bx + 4, by, bx + 4 + m.value * A * s, by, pal.green, "m·a", {dy: 16, size: 12.5});
        P5x.tag(c, "Vue du quai : T + P = m·a", cx, wy1 + 38, pal.green, {size: 12.5});
      } else {
        if (Math.abs(A) > 0.05) P5.vec(c, bx - 4, by, bx - 4 - m.value * A * s, by, pal.violet, "−m·a", {dy: 16, size: 12.5});
        P5x.tag(c, "Vue du train : T + P + (−m·a) = 0, force d'inertie", cx, wy1 + 38, pal.violet, {size: 12.5});
      }
      P5x.handle(c, bx, by - 14 - m.value * 2.5 + 2, pal.amber, 6.5);
      P5x.hint(c, "Attrape la boule et déplace-la : tu règles l'accélération", {y: 16, size: 12});
      var deg = eq * 180 / Math.PI, d = Math.abs(deg), ok = Math.abs(d - tg[di]) < 0.6;
      ro.set(0, S.fmt(d, 1) + " °" + (A > 0 ? " vers l'arrière" : A < 0 ? " vers l'avant" : "")); ro.set(1, S.fmt(Math.abs(A / g), 3));
      ro.set(2, S.fmt(T, 2) + " N"); ro.set(3, S.fmt(P, 2) + " N"); ro.set(4, S.fmt(m.value * A, 2) + " N");
      nt.set("<b>Défi " + (di + 1) + "/3.</b> Règle l'accélération pour que le fil fasse " + tg[di] + " ° avec la verticale. " + (ok ? "Réussi : a = g·tan θ = " + S.fmt(g * Math.tan(tg[di] * Math.PI / 180), 2) + " m/s² (calcule-le).": "Pas encore."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c02-nappe", ch: "c02", tag: "Niche utile",
  titre: "Le tour de la nappe : inertie en action",
  resume: "Tire la nappe d'un coup sec : le verre, presque immobile, reste sur la table. Tire doucement : il part avec la nappe.",
  but: "Règle l'accélération A de la traction puis « Tirer la nappe ! » : la scène se rejoue au ralenti, avec les forces sur le verre et les positions x(t) du verre et de la nappe. Défi : réussis le tour avec un verre déplacé de moins de 5 cm.",
  aRetenir: "Le verre n'est entraîné que par le frottement de la nappe, une force limitée (μ₁·m·g) qui ne lui donne au plus qu'une accélération μ₁·g. Si on tire plus vite que ça, la nappe glisse sous le verre ; plus A est grand, plus ce glissement est bref et plus le verre reste en place : D = μ₁·g·d·(1 + μ₁/μ₂) / (A − μ₁·g).",
  piege: "Ce n'est pas « il n'y a pas de force sur le verre » : il y a bien du frottement, vers l'avant. L'inertie signifie qu'une force limitée, agissant très peu de temps, ne change presque pas la vitesse du verre.",
  build: function(k, S){
    var c = k.canvas(0, {ratio: 0.56}), g2 = k.canvas(190);
    var A = k.slider("Accélération de la nappe A", 1, 200, 1, 20, "m/s²");
    var mu1 = k.slider("Frottement verre/nappe μ₁", 0.1, 0.8, 0.05, 0.4, "");
    var gv = k.seg("Graphe", [["xt", "Positions x(t)"], ["DA", "Déplacement D(A)"]], "DA");
    var ro = k.readouts(["Accélération max du verre μ₁·g", "Durée du glissement", "Déplacement D du verre", "Résultat"]);
    var nt = k.note("", "");
    var MU2 = 0.3, d0 = 0.20, w0 = 0.35, g = P5.g, edge = d0 + w0;
    var fr = null, tp = 0, scale = 1, tries = 0, wins = 0, defiOk = 0;
    /* intégration pas à pas (dt = 1 ms) ; frames : [t, x nappe, x verre, chute, v verre] */
    function run(){
      var a1 = A.value, m1 = mu1.value, xe = 0, ve = 0, xg = d0, vg = 0, t = 0, dt = 0.0005, out = [], fall = 0, yg = 0, vy = 0, tslip = 0, guard = 0;
      while (guard++ < 80000){
        var slip = a1 > m1 * g, under = xe < xg, ag;
        if (fall) ag = 0; else if (under) ag = slip ? m1 * g : a1; else ag = vg > 0 ? -MU2 * g : 0;
        if (under && !fall) tslip = t;
        if (!fall){ vg = Math.max(0, vg + ag * dt); if (!under && vg === 0){ out.push([t, xe, xg, yg, vg]); break; } xg += vg * dt; }
        ve += a1 * dt; xe += ve * dt; t += dt;
        if (xg > edge && !fall) fall = 1;
        if (fall){ vy += g * dt; yg += vy * dt; xg += vg * dt; if (yg > 0.62){ out.push([t, xe, xg, yg, vg]); break; } }
        if (guard % 10 === 0) out.push([t, xe, xg, yg, vg]);
      }
      fr = {frames: out, fell: !!fall, shift: xg - d0, A: a1, mu: m1, tslip: tslip, T: out[out.length - 1][0]};
      tp = 0; scale = Math.max(1, Math.min(400, 2.5 / fr.T)); tries++; gv.set("xt"); if (!fall) wins++;
      if (!fall && fr.shift < 0.05) defiOk++;
      lp.play();
    }
    var lp = k.loop(function(dt){ if (!fr){ lp.pause(); return; } tp += dt / scale; k.redraw(); if (tp > fr.T + 0.6 / scale) lp.pause(); });
    k.button("Tirer la nappe !", run, true);
    function frameAt(t){ var F = fr.frames, i = 0; while (i < F.length - 1 && F[i][0] < t) i++; return F[i]; }
    function Dcm(a, m1){ return a > m1 * g ? m1 * g * d0 * (1 + m1 / MU2) / (a - m1 * g) * 100 : Infinity; }
    var gx = null;
    P5x.drag(g2, k, function(){ return gx && gv.value === "DA" ? [{x: gx.X(A.value), y: gx.Y(Math.min(Dcm(A.value, mu1.value), 40)), r: 34, set: function(px){ A.set(Math.round(P5.clamp(gx.ix(px), 1, 200))); }}] : null; });
    function glass(ctx, x, y, s, tilt){
      ctx.save(); ctx.translate(x, y); ctx.rotate(tilt || 0);
      var w = 30 * s, h = 50 * s;
      ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w / 2 - 5 * s, 0); ctx.lineTo(-w / 2 + 5 * s, 0); ctx.closePath();
      ctx.fillStyle = "rgba(205,228,247,.55)"; ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = "rgba(70,150,225,.6)"; ctx.fillRect(-w, -h * 0.62, 2 * w, h); ctx.restore();
      ctx.strokeStyle = "#3f7fbf"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(-w / 2 + 5 * s, 0); ctx.lineTo(w / 2 - 5 * s, 0); ctx.lineTo(w / 2, -h); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(-w / 2 + 5 * s, -h + 5 * s, 3 * s, h * 0.68);
      ctx.restore();
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, W = c.W, H = c.H, a1 = A.value, m1 = mu1.value, s = Math.max(0.75, Math.min(1.2, W / 480));
      if (fr && (fr.A !== a1 || fr.mu !== m1)){ fr = null; lp.pause(); tp = 0; }
      var floor = H - 16, ty = H * 0.45, X0 = 18, sx = (W - 36) / 0.95, X = function(x){ return X0 + (x + 0.18) * sx; };
      var st = fr ? frameAt(tp) : [0, 0, d0, 0, 0], xe = st[1], xg = st[2], yg = st[3], onCloth = xe < xg, sliding = fr && onCloth && a1 > m1 * g;
      /* salle */
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, H, [[0, "#f6efe4"], [1, "#eadfcd"]]); ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(160,120,80,.10)"; for (var b = 0; b < W; b += 46) ctx.fillRect(b, 0, 2, floor);
      P5x.ground(c, floor, {col: "#cdb592"});
      /* table */
      var tx0 = X(-0.15), tx1 = X(edge);
      ctx.fillStyle = P5x.lin(ctx, 0, ty, 0, ty + 14, [[0, "#c79d6a"], [1, "#9d7448"]]); P5x.rr(ctx, tx0, ty, tx1 - tx0, 13, 3); ctx.fill();
      ctx.fillStyle = "#8a6440"; ctx.fillRect(tx0 + 10, ty + 13, 10, floor - ty - 13); ctx.fillRect(tx1 - 20, ty + 13, 10, floor - ty - 13);
      /* nappe : de son bout arrière (xe) jusqu'au bord, puis pend et est tirée par les mains */
      var cl = Math.max(X(xe), tx0), hx = tx1, drop = Math.min(floor - ty - 30, 60 + 0), pull = Math.max(0, (xe) * sx);
      if (cl < hx){ ctx.fillStyle = "#d9534f"; ctx.fillRect(cl, ty - 4, hx - cl, 5); ctx.fillStyle = "rgba(255,255,255,.7)"; for (var q = cl + 3; q < hx - 4; q += 12) ctx.fillRect(q, ty - 3, 6, 3); }
      var handX = Math.min(W - 18, tx1 + 30 + pull), handY = ty + 30;
      ctx.fillStyle = "#c9443f"; ctx.beginPath(); ctx.moveTo(Math.max(cl, hx - 1), ty - 4); ctx.lineTo(hx + 4, ty + 1); ctx.quadraticCurveTo(hx + 12, handY - 4, handX - 6, handY - 6); ctx.lineTo(handX - 6, handY + 6); ctx.quadraticCurveTo(hx + 4, handY + 10, hx, ty + 6); ctx.closePath(); ctx.fill();
      /* mains */
      ctx.fillStyle = "#f0c8a0"; ctx.strokeStyle = "#c79a74"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(handX, handY, 9, 7, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#3f5f9f"; ctx.fillRect(handX + 7, handY - 6, Math.max(0, W - handX), 12);
      P5.vec(c, Math.min(handX + 12, W - 60), handY - 22, Math.min(handX + 12, W - 60) + 18 + Math.min(1, a1 / 200) * 34, handY - 22, pal.red, "", {w: 3});
      P5x.tag(c, "A = " + S.fmt(a1, 0) + " m/s²", Math.min(handX + 6, W - 64), handY - 40, pal.red, {size: 11.5});
      S.draw.line(c, tx1, ty - 70 * s, tx1, ty - 6, "rgba(15,27,45,.35)", 1.3, [4, 4]);
      P5x.tag(c, "bord", tx1, ty - 76 * s, "#4b5868", {size: 11});
      /* chronophotographie du verre (fantômes) */
      if (fr){ for (var f = 1; f <= 5; f++){ var sf = frameAt(tp * f / 6); if (sf[3] > 0.01) continue; ctx.globalAlpha = 0.14; glass(ctx, X(sf[2]), (sf[1] < sf[2] ? ty - 4 : ty), s); } ctx.globalAlpha = 1; }
      /* verre */
      var surf = onCloth ? ty - 4 : ty, fell = fr && fr.fell && yg > 0.01, gyy = surf + yg * (floor - surf) / 0.62;
      if (fell && yg > 0.6){
        ctx.fillStyle = "rgba(120,170,225,.85)"; for (var e = 0; e < 10; e++){ var an = e * 0.65; ctx.beginPath(); ctx.arc(X(xg) + Math.cos(an) * (8 + e * 3), floor - 3 - Math.abs(Math.sin(an)) * 5, 2.4, 0, 7); ctx.fill(); }
        ctx.fillStyle = "rgba(70,150,225,.35)"; ctx.beginPath(); ctx.ellipse(X(xg), floor + 1, 34, 4, 0, 0, 7); ctx.fill();
        P5x.banner(c, "Le verre tombe et se brise !", pal.red, 20);
      } else {
        glass(ctx, X(xg), gyy, s, fell ? Math.min(1.2, yg * 3) : 0);
        var gc = X(xg), gm = gyy - 25 * s;
        if (fr && !fell && (sliding || st[4] > 0.005)){
          /* forces sur le verre : poids, réaction, frottement */
          P5.vec(c, gc, gm, gc, gm + 30, pal.ink, "P", {w: 2, size: 11});
          P5.vec(c, gc, gyy, gc, gyy - 52 * s - 26, pal.green, "N", {w: 2, size: 11, dx: 8});
          var fdir = sliding ? 1 : -1, fl = 14 + (sliding ? m1 : MU2) * 40;
          P5.vec(c, gc, gyy - 2, gc + fdir * fl, gyy - 2, pal.amber, "f", {w: 2.6, size: 11});
        }
      }
      if (fr && !fell && tp >= fr.T) P5x.banner(c, "Réussi : le verre a glissé de " + S.fmt(fr.shift * 100, 1) + " cm", pal.green, 20);
      if (!fr) P5x.hint(c, "Règle A puis « Tirer la nappe ! » · réussites : " + wins + "/" + tries, {y: 16, size: 11.5});
      else P5x.hint(c, "Ralenti ×" + S.fmt(scale, 0) + " · t = " + S.fmt(Math.min(tp, fr.T) * 1000, 0) + " ms", {y: 16, size: 11.5});
      /* graphes */
      g2.clear();
      var slip = a1 > m1 * g, D = Dcm(a1, m1);
      if (gv.value === "DA"){
        gx = S.draw.axes(g2, {x0: 0, x1: 200, y0: 0, y1: 40, xl: "A (m/s²)", yl: "D (cm)", stepX: 50, stepY: 10, l: 46});
        S.draw.area(g2, gx, function(){ return 40; }, 0, 200, pal.red, 0.07, w0 * 100);
        S.draw.line(g2, gx.X(0), gx.Y(w0 * 100), gx.X(200), gx.Y(w0 * 100), pal.red, 1.6, [6, 4]);
        P5x.tag(g2, "au-dessus de 35 cm : il tombe", gx.X(196), gx.Y(w0 * 100) + 13, pal.red, {align: "right", size: 11});
        S.draw.line(g2, gx.X(0), gx.Y(5), gx.X(200), gx.Y(5), pal.green, 1.4, [3, 3]);
        P5x.tag(g2, "défi : moins de 5 cm", gx.X(196), gx.Y(5) - 11, pal.green, {align: "right", size: 11});
        S.draw.fn(g2, gx, function(x){ var d = Dcm(x, m1); return isFinite(d) ? d : 1e4; }, pal.acc, 2.8);
        P5x.handle(g2, gx.X(a1), slip ? gx.Y(Math.min(D, 40)) : gx.Y(40), slip && D <= 5 ? pal.green : slip && D <= 35 ? pal.amber : pal.red, 7);
        P5x.hint(g2, "Glisse le point pour régler A", {x: g2.W - 10, y: 12, align: "right", size: 11});
      } else {
        gx = null;
        var Tm = fr ? fr.T : 0.4, ax = S.draw.axes(g2, {x0: 0, x1: Tm * 1000, y0: 0, y1: 1.0, xl: "t (ms)", yl: "x (m)", stepY: 0.25, l: 46});
        S.draw.line(g2, ax.X(0), ax.Y(edge), ax.X(Tm * 1000), ax.Y(edge), pal.red, 1.4, [6, 4]); P5x.tag(g2, "bord de la table", ax.X(Tm * 1000) - 4, ax.Y(edge) - 11, pal.red, {align: "right", size: 11});
        if (fr){
          var F = fr.frames, cx2 = g2.ctx;
          [[1, "#d9534f", "nappe (bout arrière)", d0 * 0], [2, pal.acc, "verre", 0]].forEach(function(sr){
            cx2.strokeStyle = sr[1]; cx2.lineWidth = 2.6; cx2.beginPath(); var st0 = true;
            for (var i = 0; i < F.length && F[i][0] <= tp; i++){ var yv = Math.min(F[i][sr[0]] + (sr[0] === 1 ? d0 * 0 : 0), 1.0); if (st0){ cx2.moveTo(ax.X(F[i][0] * 1000), ax.Y(yv)); st0 = false; } else cx2.lineTo(ax.X(F[i][0] * 1000), ax.Y(yv)); }
            cx2.stroke();
          });
          if (fr.tslip > 0) { S.draw.line(g2, ax.X(fr.tslip * 1000), ax.Y(0), ax.X(fr.tslip * 1000), ax.Y(1), pal.amber, 1.2, [3, 3]); P5x.tag(g2, "fin du glissement", ax.X(fr.tslip * 1000) + 4, ax.T + 10, "#8a5200", {align: "left", size: 11}); }
          S.draw.legend(g2, [["#d9534f", "nappe"], [pal.acc, "verre"]], 52, ax.T + 22, {});
        } else P5x.hint(g2, "Tire la nappe : les courbes se tracent en même temps que la scène", {x: g2.W / 2, y: g2.H / 2 - 10, align: "center", size: 11.5});
      }
      ro.set(0, S.fmt(m1 * g, 2) + " m/s²");
      ro.set(1, slip ? S.fmt(Math.sqrt(2 * d0 / (a1 - m1 * g)) * 1000, 0) + " ms" : "pas de glissement");
      ro.set(2, slip ? (D > 99 ? "> 99 cm" : S.fmt(D, 1) + " cm") : "il suit la nappe");
      ro.set(3, fr ? (fr.fell ? "tombe" : "reste (" + S.fmt(fr.shift * 100, 1) + " cm)") : "—");
      var dok = slip && D < 5;
      if (!slip) nt.set("A ≤ μ₁·g = " + S.fmt(m1 * g, 2) + " m/s² : le frottement suffit à entraîner le verre avec la nappe, sans glissement : il part avec elle et tombe.", "warn");
      else nt.set("<b>Défi</b> : verre déplacé de moins de 5 cm. Prévision : D = " + (D > 99 ? "plus de 99" : S.fmt(D, 1)) + " cm " + (D > w0 * 100 ? "> 35 cm : il atteint le bord et tombe." : dok ? "< 5 cm : défi réussi si tu tires !" : "< 35 cm : il reste sur la table, mais il glisse encore trop.") + (defiOk ? " · Défi réussi " + defiOk + " fois." : ""), D > w0 * 100 ? "warn" : dok ? "ok" : "");
    });
  }
});
