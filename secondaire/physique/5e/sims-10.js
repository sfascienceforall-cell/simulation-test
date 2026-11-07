/* Chapitre 10 · Électrocinétique : lois de Kirchhoff et générateurs */
SFA.sim({
  id: "p5-c10-deux-mailles", ch: "c10", tag: "Classique",
  titre: "Circuit à deux mailles : lois des nœuds et des mailles",
  resume: "Deux générateurs, trois résistances → intensités calculées avec Kirchhoff.",
  but: "Règle les deux générateurs et les trois résistances. Observe les intensités I₁, I₂, I₃ et vérifie la loi des nœuds et celle des mailles. Défi : trouve des réglages pour lesquels I₂ = 0.",
  aRetenir: "Nœud : I₃ = I₁ + I₂ (ce qui entre = ce qui sort). Mailles (sens de parcours choisi) : E₁ − R₁·I₁ − R₃·I₃ = 0 et E₂ − R₂·I₂ − R₃·I₃ = 0. Un courant trouvé négatif signifie simplement que son sens réel est opposé au sens choisi (le générateur est alors récepteur).",
  piege: "La pile n'impose pas toujours son courant : il dépend du reste du circuit. Et oublier les signes dans la loi des mailles est l'erreur la plus fréquente : un élément parcouru dans le sens du courant (R·I) ou contre la f.é.m. compte négativement.",
  build: function(k, S){
    var c = k.canvas(290);
    var e1 = k.slider("f.é.m. E₁ (à gauche)", 0, 12, 0.5, 9, "V");
    var e2 = k.slider("f.é.m. E₂ (à droite)", 0, 12, 0.1, 6, "V");
    var r1 = k.slider("R₁", 1, 100, 1, 10, "Ω"), r2 = k.slider("R₂", 1, 100, 1, 20, "Ω"), r3 = k.slider("R₃ (au milieu)", 1, 100, 1, 30, "Ω");
    var ro = k.readouts(["I₁ (à travers E₁)", "I₂ (à travers E₂)", "I₃ = I₁ + I₂", "U₃ = R₃·I₃"]);
    var nt = k.note("", ""), eq = k.note("", "");
    function solve(){
      var D = r1.value * r2.value + r1.value * r3.value + r2.value * r3.value;
      var I1 = (e1.value * (r2.value + r3.value) - r3.value * e2.value) / D, I2 = (e2.value * (r1.value + r3.value) - r3.value * e1.value) / D;
      return {I1: I1, I2: I2, I3: I1 + I2, D: D};
    }
    var flow = 0, G = {};
    var lp = k.loop(function(dt){ flow += dt; k.redraw(); }); lp.play();
    /* manipulation directe : glisser verticalement une pile pour changer sa f.é.m. */
    P5x.drag(c, k, function(){ if (!G.L) return null; return [
      {x: G.L, y: G.by, r: 34, set: function(px, py){ e1.set(Math.round(P5.clamp((G.by + 60 - py) / 120 * 12, 0, 12) * 2) / 2); }},
      {x: G.R, y: G.by, r: 34, set: function(px, py){ e2.set(Math.round(P5.clamp((G.by + 60 - py) / 120 * 12, 0, 12) * 10) / 10); }}]; });
    k.draw(function(){
      c.clear(); var pal = S.draw.palette, ctx = c.ctx, s = solve();
      P5x.sky(c, "#f4f8fc", "#ffffff");
      var L = 104, M = c.W / 2, Rr = c.W - 104, T = 46, B = c.H - 46, mid = (T + B) / 2;
      G.L = L; G.R = Rr; G.by = T + 62;
      /* un fil : de (x1,y1) à (x2,y2) ; I > 0 = sens du tracé ; points mobiles */
      function wire(x1, y1, x2, y2, I){
        var col = Math.abs(I) < 0.002 ? "#aab4c2" : pal.green; S.draw.line(c, x1, y1, x2, y2, col, 3);
        if (Math.abs(I) < 0.002) return;
        var len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.floor(len / 26)), sp = Math.min(40, 8 + Math.abs(I) * 90), d = I > 0 ? 1 : -1;
        for (var q = 0; q < n; q++){ var t = (((q / n + d * flow * sp / len / 1) % 1) + 1) % 1; S.draw.dot(c, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 3.2, "#fff"); S.draw.dot(c, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 2, pal.green); }
      }
      /* branche gauche (I1 monte), droite (I2 monte), milieu (I3 descend) */
      wire(L, B, L, T, s.I1); wire(Rr, B, Rr, T, s.I2); wire(M, T, M, B, s.I3);
      /* fils du haut (de gauche à droite via M : I1 pousse vers M ; I2 vers M) */
      wire(L, T, M, T, s.I1); wire(Rr, T, M, T, s.I2); wire(M, B, L, B, s.I1); wire(M, B, Rr, B, s.I2);
      function res(x, y, lab, v){ ctx.fillStyle = "#fff"; ctx.fillRect(x - 12, y - 24, 24, 48); P5x.coil(c, x, y - 24, x, y + 24, 5, 9, "#6b4a2a", 3);
        S.draw.label(c, (c.W < 440 ? "" : lab + " = ") + S.fmt(v, 0) + " Ω", x + (x > M + 5 ? 20 : x < M - 5 ? -20 : 20), y, {size: 12, color: "#6b4a2a", align: x < M - 5 ? "right" : "left"}); }
      function bat(x, y, lab, v){ ctx.fillStyle = "#fff"; ctx.fillRect(x - 18, y - 10, 36, 20);
        S.draw.line(c, x - 14, y - 4, x + 14, y - 4, pal.red, 5); S.draw.line(c, x - 7, y + 6, x + 7, y + 6, pal.acc, 5);
        S.draw.text(c, "+", x + 24, y - 6, {size: 14, color: pal.red}); S.draw.text(c, "−", x + 24, y + 8, {size: 14, color: pal.acc});
        P5x.handle(c, x, y, pal.red, 6, false);
        S.draw.label(c, (c.W < 440 ? "" : lab + " = ") + S.fmt(v, 1) + " V", x + (x < M ? -30 : 30), y, {size: 12, color: pal.red, align: x < M ? "right" : "left"}); }
      bat(L, G.by, "E₁", e1.value); res(L, B - 62, "R₁", r1.value);
      res(M, mid, "R₃", r3.value);
      bat(Rr, G.by, "E₂", e2.value); res(Rr, B - 62, "R₂", r2.value);
      function cur(x, y, I, lab, dirUp){ var d = (I >= 0 ? 1 : -1) * (dirUp ? -1 : 1), L2 = 16 + Math.min(Math.abs(I) * 40, 30); P5.vec(c, x + 38 * (x > M + 5 ? -1 : 1) * 0 + (x < M - 5 ? 36 : x > M + 5 ? -36 : 36), y - d * L2 / 2, x + (x < M - 5 ? 36 : x > M + 5 ? -36 : 36), y + d * L2 / 2, pal.violet, lab, {w: 2.6, dx: 12, dy: 0}); }
      cur(L, mid + 20, s.I1, "I₁", true); cur(Rr, mid + 20, s.I2, "I₂", true); cur(M, T + 40, s.I3, "I₃", false);
      P5x.hint(c, "Glisse une pile (haut/bas) : change sa f.é.m.", {x: 12, y: 14});
      ro.set(0, S.fmt(s.I1, 3) + " A"); ro.set(1, S.fmt(s.I2, 3) + " A"); ro.set(2, S.fmt(s.I3, 3) + " A"); ro.set(3, S.fmt(r3.value * s.I3, 2) + " V");
      var m1 = e1.value - r1.value * s.I1 - r3.value * s.I3, m2 = e2.value - r2.value * s.I2 - r3.value * s.I3;
      eq.set("Nœud : " + S.fmt(s.I1, 3) + " + " + S.fmt(s.I2, 3) + " = " + S.fmt(s.I3, 3) + " A.<br>Maille 1 : " + S.fmt(e1.value, 1) + " − " + S.fmt(r1.value, 0) + " × " + S.fmt(s.I1, 3) + " − " + S.fmt(r3.value, 0) + " × " + S.fmt(s.I3, 3) + " = " + S.fmt(Math.abs(m1) < 1e-9 ? 0 : m1, 3) + " V ✓<br>Maille 2 : " + S.fmt(e2.value, 1) + " − " + S.fmt(r2.value, 0) + " × " + S.fmt(s.I2, 3) + " − " + S.fmt(r3.value, 0) + " × " + S.fmt(s.I3, 3) + " = " + S.fmt(Math.abs(m2) < 1e-9 ? 0 : m2, 3) + " V ✓", "");
      var ok = Math.abs(s.I2) < 0.01;
      nt.set(ok ? "Défi réussi : I₂ ≈ 0. Le générateur 2 ne débite rien : sa f.é.m. est exactement la tension U₃ = R₃·I₃ = " + S.fmt(r3.value * s.I3, 2) + " V." : (s.I1 < 0 ? "I₁ < 0 : le générateur 1 est traversé en sens inverse (il se recharge)." : s.I2 < 0 ? "I₂ < 0 : le générateur 2 est traversé en sens inverse (il se recharge)." : "Défi : règle E₂, R₁, R₂ ou R₃ pour obtenir I₂ = 0."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c10-pile", ch: "c10", tag: "Générateur réel",
  titre: "La pile réelle : f.é.m., résistance interne, tension en charge",
  resume: "Résistance de charge → tension aux bornes, rendement et puissance.",
  but: "Une pile réelle (E, r) alimente une résistance R. Fais varier R : que devient la tension aux bornes ? Trouve la valeur de R qui donne la plus grande puissance dans la charge, et le rendement correspondant.",
  aRetenir: "U = E − r·I : la tension aux bornes baisse quand le courant augmente. I = E/(R + r), rendement η = R/(R + r). La puissance transmise à la charge P = U·I est maximale pour R = r, mais le rendement n'est alors que de 50 %.",
  piege: "La « tension de la pile » (E) n'est mesurée que à vide. En charge, U < E. Et la puissance maximale n'est pas le meilleur rendement : pour un bon rendement, il faut R ≫ r.",
  build: function(k, S){
    var c = k.canvas(200), gr = k.canvas(190), g2 = k.canvas(170);
    var E = k.slider("f.é.m. E", 1.5, 12, 0.5, 9, "V");
    var r = k.slider("Résistance interne r", 0.1, 5, 0.1, 2, "Ω");
    var R = k.slider("Résistance de charge R", 0.1, 50, 0.1, 6, "Ω");
    k.button("R = r (puissance maximale)", function(){ R.set(Math.round(r.value * 10) / 10); });
    k.button("Pile à vide (R très grande)", function(){ R.set(50); });
    k.button("Court-circuit (R petite)", function(){ R.set(0.1); });
    var ro = k.readouts(["Courant I = E/(R + r)", "Tension U = E − r·I", "Puissance dans R", "Rendement", "Court-circuit E/r"]);
    var nt = k.note("", ""), flow = 0, gxu = null, gxp = null;
    var lp = k.loop(function(dt){ var I = E.value / (R.value + r.value); flow += Math.min(I / 4, 3) * 80 * dt; k.redraw(); }); lp.play();
    /* manipulation directe : on glisse le point de fonctionnement sur la droite U(I) (fixe R) ou sur la courbe P(R) */
    P5x.drag(gr, k, function(){ if (!gxu) return null; var I = E.value / (R.value + r.value); return [{x: gxu.X(I), y: gxu.Y(E.value - r.value * I), r: 34, set: function(px){ var i = P5.clamp(gxu.ix(px), E.value / 52, E.value / (r.value + 0.1)); R.set(Math.round(P5.clamp(E.value / i - r.value, 0.1, 50) * 10) / 10); }}]; });
    P5x.drag(g2, k, function(){ if (!gxp) return null; var I = E.value / (R.value + r.value); return [{x: gxp.X(R.value), y: gxp.Y(I * I * R.value), r: 34, set: function(px){ R.set(Math.round(P5.clamp(gxp.ix(px), 0.1, 50) * 10) / 10); }}]; });
    function polyAt(pts, s){ var L = 0, seg = []; for (var i = 0; i < pts.length - 1; i++){ var l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); L += l; } s = ((s % L) + L) % L; for (i = 0; i < seg.length; i++){ if (s <= seg[i]){ var f = s / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } s -= seg[i]; } return pts[0]; }
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx;
      var Ic = E.value / r.value, I = E.value / (R.value + r.value), U = E.value - r.value * I, P = U * I, eta = R.value / (R.value + r.value), Pm = E.value * E.value / (4 * r.value);
      /* ---- circuit ---- */
      P5x.sky(c, "#f7fafd", "#edf2f8");
      var W = c.W, sx = Math.min(1, W / 440), lx = 74 * sx + 4, rx = lx + 210 * sx, mid = (lx + rx) / 2, T = 32, B = c.H - 24, ym = (T + B) / 2, wire = "#5b6676";
      S.draw.line(c, lx, T, rx, T, wire, 3); S.draw.line(c, lx, B, rx, B, wire, 3); S.draw.line(c, lx, T, lx, ym - 44, wire, 3); S.draw.line(c, lx, ym + 52, lx, B, wire, 3); S.draw.line(c, rx, T, rx, ym - 36, wire, 3); S.draw.line(c, rx, ym + 36, rx, B, wire, 3);
      /* pile réelle : cadre pointillé, f.é.m. et résistance interne en série */
      ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.5; P5x.rr(ctx, lx - 34, ym - 52, 68, 112, 12); ctx.stroke(); ctx.restore();
      var heatR = Math.min(1, r.value * I * I / 40); ctx.fillStyle = S.draw.tint("#e0431f", 0.25 * heatR * 3); P5x.rr(ctx, lx - 34, ym - 52, 68, 112, 12); ctx.fill();
      S.draw.line(c, lx - 15, ym - 40, lx + 15, ym - 40, pal.red, 4); S.draw.line(c, lx - 8, ym - 30, lx + 8, ym - 30, "#33405a", 4); S.draw.line(c, lx, ym - 30, lx, ym - 14, wire, 3);
      S.draw.text(c, "+", lx + 22, ym - 44, {size: 13, color: pal.red}); S.draw.text(c, "E", lx - 24, ym - 36, {size: 13, math: true, italic: true, color: pal.red});
      P5x.coil(c, lx, ym - 14, lx, ym + 44, 4, 8, "#33405a", 2.6); S.draw.text(c, "r", lx - 24, ym + 15, {size: 13, math: true, italic: true});
      P5x.tag(c, "pile réelle", lx, ym + 76 > B - 6 ? B - 6 : ym + 76, "#4b5868", {size: 10.5, fill: "rgba(255,255,255,.9)"});
      /* résistance de charge qui chauffe avec la puissance */
      var heat = Math.min(1, P / Math.max(Pm, 1e-6)); ctx.fillStyle = S.draw.tint("#ff7a2f", 0.1 + 0.55 * heat); P5x.rr(ctx, rx - 16, ym - 36, 32, 72, 8); ctx.fill();
      P5x.coil(c, rx, ym - 36, rx, ym + 36, 5, 9, "#33405a", 2.6); S.draw.text(c, "R", rx + 26, ym, {size: 13, math: true, italic: true});
      /* ampèremètre (en série) et voltmètre (aux bornes) */
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#33405a"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(mid, T, 14, 0, 7); ctx.fill(); ctx.stroke(); S.draw.text(c, "A", mid, T, {size: 13, color: pal.acc});
      S.draw.line(c, mid, T, mid, ym - 16 + 0, "rgba(0,0,0,0)", 1); S.draw.line(c, mid, T + 0, mid, T, wire, 3);
      S.draw.line(c, mid, T, mid, ym - 15, wire, 2); S.draw.line(c, mid, ym + 15, mid, B, wire, 2);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(mid, ym, 15, 0, 7); ctx.fill(); ctx.stroke(); S.draw.text(c, "V", mid, ym, {size: 13, color: pal.green});
      S.draw.dot(c, mid, T, 0.1, wire);
      /* courant : points qui avancent (sens conventionnel, du + vers le circuit externe) */
      var loop = [[lx, ym - 44], [lx, T], [rx, T], [rx, B], [lx, B], [lx, ym + 52]], L = 0; for (var q = 0; q < loop.length - 1; q++) L += Math.hypot(loop[q + 1][0] - loop[q][0], loop[q + 1][1] - loop[q][1]);
      var nd = Math.round(L / 22); for (var i = 0; i < nd; i++){ var p = polyAt(loop, flow + i * L / nd); S.draw.dot(c, p[0], p[1], 3, "rgba(224,122,31," + Math.min(1, 0.35 + I / 3).toFixed(2) + ")"); }
      var dx = Math.min(W - 54, rx + 90 * sx + 40);
      S.draw.display(c, S.fmt(U, 2), dx, 54, {w: 84, h: 46, caption: "U (V)"}); S.draw.display(c, S.fmt(I, 3), dx, 122, {w: 84, h: 46, caption: "I (A)"});
      P5x.hint(c, "Modifie R : la résistance chauffe, la pile aussi", {x: 8, y: 12, size: 11});
      /* ---- U(I) ---- */
      gr.clear(); g2.clear();
      gxu = S.draw.axes(gr, {x0: 0, x1: Ic, y0: 0, y1: E.value * 1.1, xl: "I (A)", yl: "U (V)", l: 46});
      S.draw.line(gr, gxu.X(0), gxu.Y(E.value), gxu.X(Ic), gxu.Y(0), pal.acc, 3);
      S.draw.line(gr, gxu.X(0), gxu.Y(0), gxu.X(Math.min(Ic, E.value * 1.1 / R.value)), gxu.Y(Math.min(E.value * 1.1, Ic * R.value)), pal.red, 2, [6, 4]);
      S.draw.line(gr, gxu.X(I), gxu.Y(0), gxu.X(I), gxu.Y(U), "rgba(36,119,90,.45)", 1.3, [3, 3]); S.draw.line(gr, gxu.X(0), gxu.Y(U), gxu.X(I), gxu.Y(U), "rgba(36,119,90,.45)", 1.3, [3, 3]);
      P5x.handle(gr, gxu.X(I), gxu.Y(U), pal.green, 8);
      P5x.tag(gr, "pile : U = E − r·I", gxu.X(Ic * 0.97), gxu.Y(E.value * 0.5), pal.acc, {size: 11, align: "right"}); P5x.tag(gr, "charge : U = R·I", gxu.X(Ic * 0.97), gxu.Y(E.value * 0.2), pal.red, {size: 11, align: "right"});
      P5x.hint(gr, "Glisse le point : tu changes R", {x: gr.W - 8, y: 10, align: "right", size: 11});
      /* ---- P(R) et rendement ---- */
      gxp = S.draw.axes(g2, {x0: 0, x1: 50, y0: 0, y1: Pm * 1.12, xl: "R (Ω)", yl: "P (W)", l: 50, stepX: 10});
      S.draw.area(g2, gxp, function(x){ var i = E.value / (x + r.value); return i * i * x; }, 0, 50, pal.red, 0.08);
      S.draw.fn(g2, gxp, function(x){ var i = E.value / (x + r.value); return i * i * x; }, pal.red, 3);
      S.draw.line(g2, gxp.X(r.value), gxp.Y(0), gxp.X(r.value), gxp.Y(Pm), pal.grey, 1.2, [4, 4]); P5x.tag(g2, "R = r", gxp.X(r.value) + 8, gxp.Y(Pm) + 10, "#4b5868", {align: "left", size: 11});
      var g = g2.ctx; g.strokeStyle = pal.amber; g.lineWidth = 2.2; g.setLineDash([5, 4]); g.beginPath();
      for (i = 0; i <= 100; i++){ var x = 50 * i / 100, ee = x / (x + r.value); if (i === 0) g.moveTo(gxp.X(x), gxp.Y(ee * Pm * 1.12)); else g.lineTo(gxp.X(x), gxp.Y(ee * Pm * 1.12)); } g.stroke(); g.setLineDash([]);
      P5x.tag(g2, "rendement R/(R+r), échelle 0 → 100 %", g2.W - 8, 12, "#8a5200", {align: "right", size: 10.5});
      P5x.handle(g2, gxp.X(R.value), gxp.Y(P), pal.green, 8);
      ro.set(0, S.fmt(I, 3) + " A"); ro.set(1, S.fmt(U, 2) + " V"); ro.set(2, S.fmt(P, 2) + " W"); ro.set(3, S.fmt(100 * eta, 0) + " %"); ro.set(4, S.fmt(Ic, 1) + " A");
      var nearMax = Math.abs(R.value - r.value) < 0.15 * r.value + 0.05;
      nt.set(nearMax ? "R ≈ r : puissance maximale " + S.fmt(Pm, 2) + " W, mais rendement de 50 % seulement (autant de puissance perdue dans la pile)." : (R.value < r.value ? "R < r : forte intensité, la pile chauffe, la tension s'effondre (U = " + S.fmt(U, 2) + " V)." : "R > r : U est plus proche de E, le rendement monte (" + S.fmt(100 * eta, 0) + " %), mais la puissance utile baisse."), nearMax ? "ok" : "");
    });
  }
});


SFA.sim({
  id: "p5-c10-diviseur", ch: "c10", tag: "Diviseur de tension",
  titre: "Le pont diviseur de tension (potentiomètre) et l'effet de la charge",
  resume: "Position du curseur → tension de sortie, avec et sans charge.",
  but: "Un potentiomètre de résistance totale R<sub>tot</sub> est alimenté sous U<sub>e</sub>. Déplace le curseur et lis la tension de sortie. Branche ensuite une charge R<sub>ch</sub> : la tension de sortie change-t-elle ? Quelle règle de choix pour R<sub>ch</sub> ?",
  aRetenir: "Sans charge : U<sub>s</sub> = U<sub>e</sub>·R₂/(R₁ + R₂) : la tension se partage proportionnellement aux résistances. Avec une charge R<sub>ch</sub> en parallèle avec R₂, R₂ est remplacée par R₂·R<sub>ch</sub>/(R₂ + R<sub>ch</sub>) et U<sub>s</sub> baisse. Règle : R<sub>ch</sub> ≥ 10·R₂ pour que l'erreur reste inférieure à environ 10 %.",
  piege: "Le diviseur ne « fixe » la tension de sortie que si rien ne la charge : brancher un appareil de faible résistance fait chuter U<sub>s</sub>. C'est aussi pourquoi un voltmètre doit avoir une résistance très grande.",
  build: function(k, S){
    var c = k.canvas(250), gr = k.canvas(190);
    var ue = k.slider("Tension d'entrée U<sub>e</sub>", 1, 12, 0.5, 9, "V");
    var rt = k.slider("Résistance totale R<sub>tot</sub>", 1, 100, 1, 10, "kΩ");
    var al = k.slider("Position du curseur (fraction de R<sub>tot</sub> en bas)", 0, 1, 0.01, 0.5, "");
    var ld = k.toggle("Brancher une charge", true);
    var rc = k.slider("Résistance de charge R<sub>ch</sub>", 1, 100, 1, 10, "kΩ");
    var ro = k.readouts(["R₁ (haut)", "R₂ (bas)", "U_s sans charge", "U_s avec charge", "Écart"]);
    var nt = k.note("", ""), P0 = {x: 0, top: 0, bot: 0}, gx = null;
    function us(a, withLoad){ var R2 = a * rt.value, R1 = (1 - a) * rt.value; if (withLoad && R2 > 0) R2 = R2 * rc.value / (R2 + rc.value); if (R1 + R2 === 0) return 0; return ue.value * R2 / (R1 + R2); }
    /* manipulation directe : on glisse le curseur le long de la résistance, ou le point du graphe */
    P5x.drag(c, k, function(){ return [{x: P0.hx, y: P0.top + (P0.bot - P0.top) * (1 - al.value), r: 36, set: function(px, py){ al.set(Math.round(P5.clamp(1 - (py - P0.top) / (P0.bot - P0.top), 0, 1) * 100) / 100); }}]; });
    P5x.drag(gr, k, function(){ if (!gx) return null; return [{x: gx.X(al.value), y: gx.Y(us(al.value, ld.value)), r: 34, set: function(px){ al.set(Math.round(P5.clamp(gx.ix(px), 0, 1) * 100) / 100); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, a = al.value, R1 = (1 - a) * rt.value, R2 = a * rt.value, Us0 = us(a, false), Us1 = us(a, true), Us = ld.value ? Us1 : Us0;
      P5x.sky(c, "#f7fafd", "#edf2f8");
      var W = c.W, sx = Math.min(1, W / 440), T = 34, B = c.H - 28, bx = 46 * sx + 4, px = bx + 118 * sx, pw = 34, hx = px + pw / 2 + 52 * sx, lx = hx + 86 * sx, wire = "#5b6676";
      var pt = T + 20, pb = B - 20; P0.top = pt; P0.bot = pb; P0.hx = hx;
      /* fils */
      S.draw.line(c, bx, T, px, T, wire, 3); S.draw.line(c, px, T, px, pt, wire, 3); S.draw.line(c, bx, B, lx, B, wire, 3); S.draw.line(c, px, pb, px, B, wire, 3); S.draw.line(c, bx, T, bx, B - 56, wire, 3);
      /* générateur */
      var ym = (T + B) / 2; S.draw.line(c, bx - 14, ym - 12, bx + 14, ym - 12, pal.red, 4); S.draw.line(c, bx - 7, ym - 3, bx + 7, ym - 3, "#33405a", 4); S.draw.line(c, bx, ym - 3, bx, B, wire, 3); S.draw.line(c, bx, T, bx, ym - 12, wire, 3);
      S.draw.text(c, "+", bx + 20, ym - 18, {size: 13, color: pal.red}); P5x.tag(c, "Ue = " + S.fmt(ue.value, 1) + " V", bx, ym + 24, pal.red, {size: 11.5});
      /* potentiomètre : dégradé = potentiel le long de la résistance */
      ctx.fillStyle = P5x.lin(ctx, 0, pt, 0, pb, [[0, "rgba(224,70,50,.55)"], [1, "rgba(60,116,214,.55)"]]); P5x.rr(ctx, px - pw / 2, pt, pw, pb - pt, 8); ctx.fill(); ctx.strokeStyle = "#33405a"; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1; for (var q = 1; q < 10; q++){ var yy = pt + (pb - pt) * q / 10; ctx.beginPath(); ctx.moveTo(px - pw / 2 + 4, yy); ctx.lineTo(px + pw / 2 - 4, yy); ctx.stroke(); }
      P5x.tag(c, S.fmt(ue.value, 1) + " V", px - pw / 2 - 8, pt, pal.red, {align: "right", size: 11}); P5x.tag(c, "0 V", px - pw / 2 - 8, pb, pal.acc, {align: "right", size: 11});
      /* curseur */
      var yc = pt + (pb - pt) * (1 - a); S.draw.line(c, px + pw / 2, yc, hx, yc, pal.green, 3);
      ctx.fillStyle = pal.green; ctx.beginPath(); ctx.moveTo(px + pw / 2 + 2, yc); ctx.lineTo(px + pw / 2 + 14, yc - 7); ctx.lineTo(px + pw / 2 + 14, yc + 7); ctx.closePath(); ctx.fill();
      S.draw.dot(c, px, yc, 0.1, pal.green);
      P5x.tag(c, "R₁ = " + S.fmt(R1, 1) + " kΩ", px - pw / 2 - 8, (pt + yc) / 2 + (yc - pt < 30 ? -20 : 0), "#33405a", {align: "right", size: 11, fill: "rgba(255,255,255,.88)"});
      P5x.tag(c, "R₂ = " + S.fmt(R2, 1) + " kΩ", px - pw / 2 - 8, (pb + yc) / 2 + (pb - yc < 30 ? 20 : 0), "#33405a", {align: "right", size: 11, fill: "rgba(255,255,255,.88)"});
      /* sortie, charge, voltmètre */
      S.draw.line(c, hx, yc, lx, yc, pal.green, 3);
      if (ld.value){ S.draw.line(c, lx, yc, lx, yc + 6, wire, 3); P5x.coil(c, lx, yc + 6, lx, B, 5, 8, "#33405a", 2.6); P5x.tag(c, "R_ch = " + S.fmt(rc.value, 0) + " kΩ", lx - 12, (yc + B) / 2 + 6, "#33405a", {align: "right", size: 10.5, fill: "rgba(255,255,255,.88)"}); }
      else S.draw.dot(c, lx, yc, 4, pal.green);
      S.draw.display(c, S.fmt(Us, 2), Math.min(W - 52, lx + 60 * sx), Math.max(46, yc - 36), {w: 84, h: 46, caption: "U_s (V)", color: ld.value ? "#8a1f10" : "#13233a"});
      P5x.handle(c, hx, yc, pal.green, 8);
      P5x.hint(c, "Glisse le curseur vert le long de la résistance", {x: 8, y: 12, size: 11});
      /* graphe Us(a) */
      gr.clear();
      gx = S.draw.axes(gr, {x0: 0, x1: 1, y0: 0, y1: ue.value * 1.05, xl: "position du curseur", yl: "Us (V)", l: 46, stepX: 0.25});
      S.draw.fn(gr, gx, function(x){ return us(x, false); }, pal.grey, 2, [5, 4]);
      if (ld.value){ S.draw.area(gr, gx, function(x){ return us(x, false); }, 0, 1, pal.red, 0.08, function(x){ return us(x, true); }); S.draw.fn(gr, gx, function(x){ return us(x, true); }, pal.red, 3); }
      P5x.handle(gr, gx.X(a), gx.Y(Us), pal.green, 8);
      P5x.tag(gr, "pointillés : sans charge", gx.X(0.16), gx.Y(ue.value * 0.97), "#4b5868", {align: "left", size: 11});
      ro.set(0, S.fmt(R1, 1) + " kΩ"); ro.set(1, S.fmt(R2, 1) + " kΩ"); ro.set(2, S.fmt(Us0, 2) + " V"); ro.set(3, ld.value ? S.fmt(Us1, 2) + " V" : "—"); ro.set(4, ld.value && Us0 > 0 ? S.fmt(100 * (Us0 - Us1) / Us0, 0) + " %" : "—");
      nt.set(ld.value ? (R2 > 0 && rc.value >= 10 * R2 ? "R_ch ≥ 10·R₂ : l'erreur reste faible (" + S.fmt(100 * (Us0 - Us1) / Math.max(Us0, 1e-9), 0) + " %)." : "R_ch est comparable à R₂ : la charge « mange » une grande partie de la tension (écart " + S.fmt(100 * (Us0 - Us1) / Math.max(Us0, 1e-9), 0) + " %).") : "Sans charge : U_s = U_e·R₂/(R₁ + R₂) = " + S.fmt(Us0, 2) + " V, proportionnelle à la position du curseur.", ld.value && R2 > 0 && rc.value < 10 * R2 ? "warn" : "");
    });
  }
});


SFA.sim({
  id: "p5-c10-wheatstone", ch: "c10", tag: "Défi",
  titre: "Le pont de Wheatstone : mesurer une résistance inconnue",
  resume: "Règle la résistance variable jusqu'à l'équilibre du pont, puis calcule R<sub>x</sub>.",
  but: "Une résistance inconnue R<sub>x</sub> est placée dans un pont. Règle la résistance variable R<sub>v</sub> jusqu'à ce que la tension du pont soit nulle (galvanomètre au zéro). Calcule alors R<sub>x</sub> = R₁·R<sub>v</sub>/R₂, puis vérifie avec « Révéler ».",
  aRetenir: "Deux diviseurs de tension en parallèle. Le pont est équilibré (U<sub>AB</sub> = 0, aucun courant dans le galvanomètre) lorsque R₁/R₂ = R<sub>x</sub>/R<sub>v</sub>, donc R<sub>x</sub> = R₁·R<sub>v</sub>/R₂. L'équilibre ne dépend pas de la tension d'alimentation.",
  piege: "À l'équilibre, c'est la tension (et donc le courant) dans le galvanomètre qui est nulle, pas les courants dans les branches. Et la formule R<sub>x</sub> = R₁·R<sub>v</sub>/R₂ suppose que R₁ est du même côté que R<sub>x</sub> (en haut), R₂ du même côté que R<sub>v</sub> (en bas).",
  build: function(k, S){
    var c = k.canvas(270), gr = k.canvas(180);
    var R2s = k.select("R₂ (R₁ = 1 000 Ω)", [[100, "100 Ω"], [1000, "1 000 Ω"], [10000, "10 000 Ω"]], 1000);
    var rv = k.slider("Résistance variable R<sub>v</sub>", 1, 5000, 1, 1500, "Ω");
    k.button("Rv − 1 Ω", function(){ rv.set(rv.value - 1); });
    k.button("Rv + 1 Ω", function(){ rv.set(rv.value + 1); });
    var inc = [470, 1200, 220, 3300], ii = 0, show = k.toggle("Révéler R_x", false);
    k.button("Nouvelle résistance inconnue", function(){ ii = (ii + 1) % inc.length; });
    var ro = k.readouts(["Tension du pont U_AB", "V_A", "V_B", "R_x calculée si équilibre"]);
    var nt = k.note("", ""), UE = 10, R1 = 1000, needle = 0, geo = null, gx = null;
    var lp = k.loop(function(dt){ var Rx = inc[ii], R2 = parseFloat(R2s.value), dV = UE * R2 / (R1 + R2) - UE * rv.value / (Rx + rv.value), tgt = P5.clamp(dV / 2, -1, 1) * 1.0; needle += (tgt - needle) * Math.min(1, dt * 7); k.redraw(); }); lp.play();
    /* manipulation directe : on glisse le curseur de Rv le long de la résistance, ou le point du graphe */
    P5x.drag(c, k, function(){ return geo ? [{x: geo.hx, y: geo.hy, r: 36, set: function(px, py){ var t = P5.clamp(((px - geo.Bx) * (geo.Sx - geo.Bx) + (py - geo.By) * (geo.Sy - geo.By)) / (Math.pow(geo.Sx - geo.Bx, 2) + Math.pow(geo.Sy - geo.By, 2)), 0, 1); rv.set(Math.round(5000 * (1 - t))); }}] : null; });
    P5x.drag(gr, k, function(){ if (!gx) return null; var Rx = inc[ii], R2 = parseFloat(R2s.value), VA = UE * R2 / (R1 + R2); return [{x: gx.X(rv.value), y: gx.Y(P5.clamp(VA - UE * rv.value / (Rx + rv.value), -UE * 0.6, UE * 0.6)), r: 34, set: function(px){ rv.set(Math.round(P5.clamp(gx.ix(px), 1, 5000))); }}]; });
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, Rx = inc[ii], R2 = parseFloat(R2s.value);
      var VA = UE * R2 / (R1 + R2), VB = UE * rv.value / (Rx + rv.value), dV = VA - VB, bal = Math.abs(dV) < 0.02;
      P5x.sky(c, "#f7fafd", "#edf2f8");
      var cx = c.W / 2 - 10, cy = c.H / 2 + 2, dx = Math.min(c.W / 2 - 100, 140), dy = 90, wire = "#5b6676";
      var N = [cx, cy - dy], S2 = [cx, cy + dy], A = [cx - dx, cy], B = [cx + dx, cy];
      /* générateur à droite, relié à N et S */
      var gxr = Math.min(c.W - 26, B[0] + 64);
      S.draw.line(c, N[0], N[1], gxr, N[1], wire, 3); S.draw.line(c, S2[0], S2[1], gxr, S2[1], wire, 3); S.draw.line(c, gxr, N[1], gxr, cy - 14, wire, 3); S.draw.line(c, gxr, cy + 18, gxr, S2[1], wire, 3);
      S.draw.line(c, gxr - 13, cy - 14, gxr + 13, cy - 14, pal.red, 4); S.draw.line(c, gxr - 7, cy - 5, gxr + 7, cy - 5, "#33405a", 4); S.draw.line(c, gxr, cy - 5, gxr, cy + 18, wire, 3);
      P5x.tag(c, "10 V", gxr - 4, cy + 34, pal.red, {size: 11});
      /* résistances : en boîtes colorées selon la valeur */
      function res(p, q, lab, val, col, side){
        var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
        S.draw.line(c, p[0], p[1], q[0], q[1], wire, 3);
        ctx.save(); ctx.translate(mx, my); ctx.rotate(ang); ctx.fillStyle = S.draw.tint(col, 0.18); P5x.rr(ctx, -24, -9, 48, 18, 5); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.stroke(); ctx.restore();
        P5x.tag(c, lab + " = " + val, mx + side * 6, my - 22 * (side > 0 ? 1 : 1) * 0 + (side > 0 ? -22 : 22) * 0 + (lab === "R₁" || lab === "Rx" ? -24 : 24), "#33405a", {size: 11, align: side > 0 ? "left" : "right", fill: "rgba(255,255,255,.9)"});
      }
      res(N, A, "R₁", "1 000 Ω", pal.acc, -1); res(N, B, "Rx", show.value ? S.fmt(Rx, 0) + " Ω" : "?", pal.red, 1); res(A, S2, "R₂", S.fmt(R2, 0) + " Ω", pal.acc, -1); res(B, S2, "Rv", S.fmt(rv.value, 0) + " Ω", pal.amber, 1);
      /* curseur de Rv : poignée sur la résistance */
      var Bx = B[0], By = B[1], Sx = S2[0], Sy = S2[1], t = 1 - rv.value / 5000; geo = {Bx: Bx, By: By, Sx: Sx, Sy: Sy, hx: Bx + (Sx - Bx) * (1 - rv.value / 5000), hy: By + (Sy - By) * (1 - rv.value / 5000)};
      P5x.handle(c, geo.hx, geo.hy, pal.amber, 7.5);
      /* pont : galvanomètre */
      S.draw.line(c, A[0], A[1], B[0], B[1], wire, 3); S.draw.dot(c, A[0], A[1], 5, "#13233a"); S.draw.dot(c, B[0], B[1], 5, "#13233a");
      S.draw.text(c, "A", A[0] - 13, A[1], {size: 14}); S.draw.text(c, "B", B[0] + 13, B[1], {size: 14});
      if (bal) S.draw.glow(c, cx, cy, 52, "#46d68e", 0.6);
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.fill(); ctx.strokeStyle = bal ? pal.green : "#33405a"; ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = "#cbd3de"; ctx.lineWidth = 1; for (var q = -4; q <= 4; q++){ var an = q * 0.2; ctx.beginPath(); ctx.moveTo(cx + Math.sin(an) * 22, cy + 12 - Math.cos(an) * 22); ctx.lineTo(cx + Math.sin(an) * 26, cy + 12 - Math.cos(an) * 26); ctx.stroke(); }
      var an2 = needle * 0.9; S.draw.line(c, cx, cy + 12, cx + Math.sin(an2) * 25, cy + 12 - Math.cos(an2) * 25, pal.red, 2.6); S.draw.dot(c, cx, cy + 12, 2.5, "#33405a"); S.draw.text(c, "G", cx, cy - 15, {size: 12, color: "#4b5868"});
      P5x.tag(c, "+10 V", N[0] + 8, N[1] - 14, pal.red, {align: "left", size: 11}); P5x.tag(c, "0 V", S2[0] + 8, S2[1] + 14, pal.acc, {align: "left", size: 11});
      S.draw.display(c, S.fmt(dV * 1000, 0), 62, 36, {w: 90, h: 46, caption: "U_AB (mV)", color: bal ? "#13693f" : "#13233a"});
      P5x.hint(c, bal ? "Pont équilibré : le galvanomètre est au zéro" : "Glisse le curseur orange de Rv", {x: c.W - 8, y: 12, align: "right", size: 11, color: bal ? pal.green : "#6b7685"});
      /* graphe U_AB(Rv) */
      gr.clear();
      gx = S.draw.axes(gr, {x0: 0, x1: 5000, y0: -UE * 0.6, y1: UE * 0.6, xl: "Rv (Ω)", yl: "U_AB (V)", l: 46, stepX: 1000});
      var need = Rx * R2 / R1;
      if (need >= 1 && need <= 5000){ S.draw.line(gr, gx.X(need), gx.Y(-UE * 0.6), gx.X(need), gx.Y(UE * 0.6), "rgba(36,119,90,.35)", 1.3, [4, 4]); if (show.value) P5x.tag(gr, "équilibre : Rv = " + S.fmt(need, 0) + " Ω", gx.X(need) + 6, gx.Y(UE * 0.45), pal.green, {align: "left", size: 11}); }
      S.draw.fn(gr, gx, function(x){ return VA - UE * x / (Rx + x); }, pal.acc, 3);
      P5x.handle(gr, gx.X(rv.value), gx.Y(P5.clamp(dV, -UE * 0.6, UE * 0.6)), bal ? pal.green : pal.red, 8);
      var imposs = need > 5000 || need < 1;
      ro.set(0, S.fmt(dV * 1000, 0) + " mV"); ro.set(1, S.fmt(VA, 3) + " V"); ro.set(2, S.fmt(VB, 3) + " V"); ro.set(3, S.fmt(R1 * rv.value / R2, 0) + " Ω");
      nt.set(bal ? "Pont équilibré : V_A = V_B. R_x = R₁·R_v/R₂ = 1000 × " + S.fmt(rv.value, 0) + "/" + S.fmt(R2, 0) + " = " + S.fmt(R1 * rv.value / R2, 0) + " Ω" + (show.value ? " (valeur réelle : " + S.fmt(Rx, 0) + " Ω)." : ". Clique sur « Révéler » pour comparer.") : "Tension du pont : " + S.fmt(dV * 1000, 0) + " mV : " + (dV > 0 ? "V_A > V_B, augmente R_v." : "V_A < V_B, diminue R_v.") + " Cherche U_AB = 0 (boutons ± 1 Ω pour le réglage fin)." + (imposs ? " <b>Attention :</b> avec ce R₂, le pont ne peut pas être équilibré avec R_v ≤ 5 000 Ω : choisis un autre R₂." : ""), bal ? "ok" : imposs ? "warn" : "");
    });
  }
});
