/* Chapitre 4 · Troisième loi de Newton et quantité de mouvement */
SFA.sim({
  id: "p5-c04-chocs", ch: "c04", tag: "Classique",
  titre: "Deux chariots sur un rail : p se conserve, pas toujours Ec",
  resume: "Masses, vitesses, type de choc → p et énergie cinétique avant et après.",
  but: "Règle les masses, les vitesses et le coefficient de restitution e (0 = choc mou, les chariots restent collés ; 1 = choc élastique). Lance et compare p et Ec avant et après.",
  aRetenir: "Dans un système isolé, la quantité de mouvement totale p = m₁v₁ + m₂v₂ se conserve toujours. L'énergie cinétique ne se conserve que dans un choc élastique ; sinon, elle diminue (chaleur, déformation).",
  piege: "« Rien ne se perd » ne veut pas dire que Ec se conserve : dans un choc mou, une partie de l'énergie cinétique est transformée en chaleur et en déformation. La quantité de mouvement, elle, ne change jamais.",
  build: function(k, S){
    var c = k.canvas(170), gr = k.canvas(190);
    var m1 = k.slider("Masse du chariot 1 (bleu)", 0.5, 5, 0.1, 2, "kg");
    var v1 = k.slider("Vitesse du chariot 1", -4, 6, 0.1, 3, "m/s");
    var m2 = k.slider("Masse du chariot 2 (rouge)", 0.5, 5, 0.1, 1, "kg");
    var v2 = k.slider("Vitesse du chariot 2", -4, 4, 0.1, 0, "m/s");
    var e = k.slider("Type de choc : e (0 mou … 1 élastique)", 0, 1, 0.05, 1, "");
    var ro = k.readouts(["Quantité de mvt avant", "Quantité de mvt après", "Ec avant", "Ec après", "Énergie perdue"]);
    var nt = k.note("", ""), t = 0;
    function res(){
      var M1 = m1.value, M2 = m2.value, V1 = v1.value, V2 = v2.value, E = e.value, P = M1 * V1 + M2 * V2;
      var hit = V1 > V2;
      var u1 = hit ? (P + M2 * E * (V2 - V1)) / (M1 + M2) : V1, u2 = hit ? (P + M1 * E * (V1 - V2)) / (M1 + M2) : V2;
      return {P: P, hit: hit, u1: u1, u2: u2};
    }
    function posAt(tm){
      var r = res(), tc = r.hit ? 5 / (v1.value - v2.value) : Infinity, p1, p2;
      if (tm < tc){ p1 = 1 + v1.value * tm; p2 = 7 + v2.value * tm; }
      else { p1 = 1 + v1.value * tc + r.u1 * (tm - tc); p2 = 7 + v2.value * tc + r.u2 * (tm - tc); }
      return [p1, p2];
    }
    var lp = k.loop(function(dt){
      t += dt; var q = posAt(t);
      if (t > 9 || q[0] < -1.8 || q[0] > 12.8 || q[1] < -1.8 || q[1] > 12.8){ t = Math.min(t, 9); lp.pause(); }   /* un chariot va sortir de l'écran : on s'arrête */
      k.redraw();
    });
    k.button("Lancer / rejouer", function(){ t = 0; lp.play(); }, true);
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, r = res(), M1 = m1.value, M2 = m2.value;
      P5x.sky(c, "#f5f9fd", "#e8eff7");
      var X0 = 20, sc = (c.W - 40) / 14, ty = 118;
      ctx.fillStyle = P5x.lin(ctx, 0, ty, 0, ty + 8, [[0, "#d9b98a"], [1, "#b8946a"]]); P5x.rr(ctx, X0 - 6, ty, c.W - 28, 8, 3); ctx.fill();
      var gap = 5, x1 = 1, x2 = x1 + 1 + gap, tc = r.hit ? gap / (v1.value - v2.value) : Infinity;
      var p1, p2;
      if (t < tc){ p1 = x1 + v1.value * t; p2 = x2 + v2.value * t; }
      else { var xc1 = x1 + v1.value * tc, xc2 = x2 + v2.value * tc; p1 = xc1 + r.u1 * (t - tc); p2 = xc2 + r.u2 * (t - tc); }
      function cart(x, col, lab, w){ var px = X0 + (x + 2) * sc; P5x.cart(c, px + sc / 2, ty, sc, 38, col, lab, {size: 9.5}); }
      cart(p1, pal.acc, S.fmt(M1, 1) + " kg"); cart(p2, pal.red, S.fmt(M2, 1) + " kg");
      var u1 = t >= tc ? r.u1 : v1.value, u2 = t >= tc ? r.u2 : v2.value;
      P5x.tag(c, "1 : " + S.fmt(u1, 2) + " m/s", c.W * 0.27, 24, pal.acc, {size: 12.5}); P5x.tag(c, "2 : " + S.fmt(u2, 2) + " m/s", c.W * 0.73, 24, pal.red, {size: 12.5});
      P5x.banner(c, t >= tc && r.hit ? "après le choc" : "avant le choc", "#4b5868", 56, {size: 12});
      if (u1 !== 0) P5.vec(c, X0 + (p1 + 2) * sc + sc / 2, ty - 52, X0 + (p1 + 2) * sc + sc / 2 + u1 * 14, ty - 52, pal.acc, "", {w: 3}); if (u2 !== 0) P5.vec(c, X0 + (p2 + 2) * sc + sc / 2, ty - 52, X0 + (p2 + 2) * sc + sc / 2 + u2 * 14, ty - 52, pal.red, "", {w: 3});
      /* barres */
      gr.clear();
      var Eb = 0.5 * M1 * v1.value * v1.value + 0.5 * M2 * v2.value * v2.value, Ea = 0.5 * M1 * r.u1 * r.u1 + 0.5 * M2 * r.u2 * r.u2;
      var pb = r.P, pa = M1 * r.u1 + M2 * r.u2;
      var pm = Math.max(Math.abs(pb), 1), em = Math.max(Eb, 1);
      var W = gr.W, H = gr.H, g = gr.ctx, bw = Math.min(70, W / 8);
      function bars(x0, title, a, b, mx, unit, cola, colb, signed){
        var base = signed ? H - 62 - (H - 120) / 2 : H - 42, sc2 = (H - 120) / (signed ? 2 : 1) / mx;
        S.draw.line(gr, x0 - 10, base, x0 + 2 * bw + 20, base, pal.grey, 1.5);
        [[a, "avant", cola, 0], [b, "après", colb, bw + 10]].forEach(function(z){
          var hh = z[0] * sc2; g.fillStyle = z[2]; g.fillRect(x0 + z[3], base - Math.max(hh, 0), bw, Math.abs(hh));
          S.draw.text(gr, S.fmt(z[0], 1), x0 + z[3] + bw / 2, base - hh - (hh >= 0 ? 12 : -12), {size: 12});
          S.draw.text(gr, z[1], x0 + z[3] + bw / 2, H - 18, {size: 12, color: pal.grey});
        });
        S.draw.text(gr, title + " (" + unit + ")", x0 + bw + 5, 22, {size: 13});
      }
      bars(W * 0.08, "p totale", pb, pa, pm, "kg·m/s", "#9bb0d8", pal.acc, true);
      bars(W * 0.55, "Ec totale", Eb, Ea, em, "J", "#e2b27a", pal.amber, false);
      ro.set(0, S.fmt(pb, 2) + " kg·m/s"); ro.set(1, S.fmt(pa, 2) + " kg·m/s"); ro.set(2, S.fmt(Eb, 2) + " J"); ro.set(3, S.fmt(Ea, 2) + " J");
      ro.set(4, S.fmt(Eb - Ea, 2) + " J");
      if (!r.hit) nt.set("Le chariot 1 n'est pas plus rapide que le chariot 2 (v₁ ≤ v₂) : ils ne se rencontrent pas, rien ne change.", "warn");
      else if (e.value === 1) nt.set("Choc élastique : p et Ec se conservent tous les deux. Les chariots s'éloignent avec la même vitesse relative qu'à l'approche.", "ok");
      else if (e.value === 0) nt.set("Choc mou : les chariots restent collés (même vitesse). p se conserve, mais Ec diminue de " + S.fmt(Eb - Ea, 2) + " J, transformés en chaleur et déformation.", "");
      else nt.set("Choc inélastique : p se conserve toujours ; Ec diminue de " + S.fmt(Eb - Ea, 2) + " J (" + S.fmt(100 * (Eb - Ea) / Math.max(Eb, 1e-9), 0) + " % de l'énergie cinétique initiale).", "");
    });
  }
});

SFA.sim({
  id: "p5-c04-patineurs", ch: "c04", tag: "Action-réaction",
  titre: "Deux patineurs qui se repoussent",
  resume: "Masses → vitesses opposées, forces égales sur des corps différents.",
  but: "Deux patineurs au repos se repoussent pendant une courte durée. Change leurs masses et la force de poussée. Compare les forces, les vitesses et les énergies cinétiques.",
  aRetenir: "Troisième loi : la force de A sur B est égale et opposée à celle de B sur A, mais elles s'exercent sur deux corps différents. Chacun reçoit la même impulsion F·Δt : celui qui a la plus petite masse prend la plus grande vitesse (m₁v₁ = m₂v₂).",
  piege: "Les deux forces sont égales mais les effets ne le sont pas : a = F/m est plus grande pour le plus léger. Et les forces d'une paire action-réaction ne s'annulent jamais, car elles agissent sur des corps différents.",
  build: function(k, S){
    var c = k.canvas(260);
    var m1 = k.slider("Masse du patineur A", 30, 100, 1, 50, "kg");
    var m2 = k.slider("Masse du patineur B", 30, 100, 1, 80, "kg");
    var F = k.slider("Force de poussée", 50, 300, 10, 150, "N");
    var dt = k.slider("Durée de la poussée", 0.2, 1, 0.05, 0.5, "s");
    var ro = k.readouts(["Vitesse de A", "Vitesse de B", "Quantité de mvt de A", "Quantité de mvt de B", "Ec de A", "Ec de B"]);
    var nt = k.note("", ""), t = 0, T = 3;
    var lp = k.loop(function(d){ t += d; if (t > T + 1.2) lp.pause(); k.redraw(); });
    k.button("Pousser !", function(){ t = 0; lp.play(); }, true);
    t = 0; lp.play();
    var tx = 0;
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, Fo = F.value, d = dt.value, a1 = Fo / m1.value, a2 = Fo / m2.value, vA = a1 * d, vB = a2 * d;
      P5x.sky(c, "#eef5fb", "#f8fbff"); var iy = 170;
      ctx.fillStyle = P5x.lin(ctx, 0, iy, 0, c.H, [[0, "#cfe6f6"], [1, "#a9cfe8"]]); ctx.fillRect(0, iy, c.W, c.H - iy); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(0, iy, c.W, 2);
      var tt = Math.min(t, T);
      function pos(a, v){ return tt < d ? 0.5 * a * tt * tt : 0.5 * a * d * d + v * (tt - d); }
      var xa = -pos(a1, vA), xb = pos(a2, vB);
      var far = Math.max(Math.abs(0.5 * a1 * d * d + vA * (T - d)), Math.abs(0.5 * a2 * d * d + vB * (T - d)), 0.1);
      var sc = (c.W / 2 - 60) / far, cx = c.W / 2;
      var ax = cx + xa * sc - 22, bx = cx + xb * sc + 22, pushing = t < d;
      var hA = 40 + m1.value * 0.55, hB = 40 + m2.value * 0.55;
      /* traces sur la glace */
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 22, iy + 12); ctx.lineTo(ax, iy + 12); ctx.moveTo(cx + 22, iy + 12); ctx.lineTo(bx, iy + 12); ctx.stroke();
      /* patineurs : les bras se tendent pendant la poussée */
      P5x.person(c, ax, iy, hA, pal.acc, {label: "A", dir: 1, arm: pushing ? 0.34 : 0.1});
      P5x.person(c, bx, iy, hB, pal.red, {label: "B", dir: -1, arm: pushing ? 0.34 : 0.1});
      S.draw.line(c, ax - 16, iy + 2, ax + 16, iy + 2, "#4b5868", 3); S.draw.line(c, bx - 16, iy + 2, bx + 16, iy + 2, "#4b5868", 3);
      if (pushing){
        var yy = iy - Math.min(hA, hB) * 0.62, L = 36 + Fo * 0.28;
        P5.vec(c, ax + 10, yy, ax + 10 - L, yy, pal.acc, "F sur A", {dy: -16, size: 13, w: 3.6});
        P5.vec(c, bx - 10, yy, bx - 10 + L, yy, pal.red, "F sur B", {dy: -16, size: 13, w: 3.6});
        P5x.banner(c, "Pendant la poussée : forces égales, sur des corps différents", pal.ink, 20);
      } else if (t > 0){
        P5.vec(c, ax - 6, iy - hA - 18, ax - 6 - Math.min(90, vA * 40), iy - hA - 18, pal.acc, "", {w: 3.2});
        P5.vec(c, bx + 6, iy - hB - 18, bx + 6 + Math.min(90, vB * 40), iy - hB - 18, pal.red, "", {w: 3.2});
        P5x.tag(c, "vA = " + S.fmt(vA, 2) + " m/s", ax, iy - hA - 36, pal.acc, {size: 12}); P5x.tag(c, "vB = " + S.fmt(vB, 2) + " m/s", bx, iy - hB - 36, pal.red, {size: 12});
        P5x.banner(c, "Après : mouvement rectiligne uniforme", "#4b5868", 20);
      } else P5x.banner(c, "Au repos : p totale = 0", "#4b5868", 20);
      /* diagramme de p et Ec en direct */
      var EA = 0.5 * m1.value * vA * vA, EB = 0.5 * m2.value * vB * vB, pA = m1.value * vA, pB = m2.value * vB, by = c.H - 14;
      var vis = t >= d ? 1 : Math.min(1, t / d);
      P5x.tag(c, "p : A " + S.fmt(-pA * vis, 0) + " + B " + S.fmt(pB * vis, 0) + " = 0 kg·m/s", 10, by, pal.ink, {align: "left", size: 11.5});
      P5x.tag(c, "Ec : " + S.fmt((EA + EB) * vis, 0) + " J", c.W - 10, by, pal.amber, {align: "right", size: 11.5});
      ro.set(0, S.fmt(-vA, 2) + " m/s"); ro.set(1, S.fmt(vB, 2) + " m/s"); ro.set(2, S.fmt(-m1.value * vA, 1) + " kg·m/s"); ro.set(3, S.fmt(m2.value * vB, 1) + " kg·m/s");
      ro.set(4, S.fmt(EA, 1) + " J"); ro.set(5, S.fmt(EB, 1) + " J");
      nt.set("p total : " + S.fmt(-m1.value * vA + m2.value * vB, 1) + " kg·m/s = 0 (avant aussi). Rapport des vitesses vA/vB = mB/mA = " + S.fmt(vA / vB, 2) + ". L'énergie cinétique totale (" + S.fmt(EA + EB, 1) + " J) vient du travail musculaire : elle n'est pas conservée.", "");
    });
  }
});

SFA.sim({
  id: "p5-c04-canon", ch: "c04", tag: "Niche utile",
  titre: "Le recul du canon : même p, énergies très différentes",
  resume: "Masse du projectile → vitesse de recul et répartition de l'énergie.",
  but: "Tire un projectile avec un canon libre de reculer. Fais varier les masses et la vitesse de sortie : compare la quantité de mouvement et l'énergie cinétique du projectile et du canon.",
  aRetenir: "Système canon + projectile initialement immobile : p total = 0, donc M·V = m·v (recul V opposé). L'énergie cinétique se répartit en sens inverse des masses : Ec(canon)/Ec(projectile) = m/M, très petit pour un canon lourd.",
  piege: "Même quantité de mouvement ne veut pas dire même énergie : Ec = p²/(2m) est bien plus grande pour la petite masse. C'est pourquoi le canon recule lentement alors que le projectile emporte presque toute l'énergie.",
  build: function(k, S){
    var c = k.canvas(230), gr = k.canvas(230);
    var M = k.slider("Masse du canon M", 50, 2000, 10, 500, "kg");
    var m = k.slider("Masse du projectile m", 0.5, 20, 0.5, 5, "kg");
    var v = k.slider("Vitesse du projectile v", 100, 800, 10, 400, "m/s");
    var ro = k.readouts(["Vitesse de recul V", "Quantité de mvt du projectile", "Quantité de mvt du canon", "Ec projectile", "Ec canon", "Ec canon / Ec proj."]);
    var nt = k.note("", ""), t = 0.01;
    var lp = k.loop(function(d){ t += d; if (t > 3) lp.pause(); k.redraw(); });
    k.button("Tirer !", function(){ t = 0; lp.play(); }, true);
    t = 0; lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, V = m.value * v.value / M.value, Ep = 0.5 * m.value * v.value * v.value, Ec = 0.5 * M.value * V * V, tot = Ep + Ec;
      P5x.sky(c, "#eef5fb", "#f8fbff"); var gy = c.H - 46;
      P5x.ground(c, gy, {col: "#d3dbe6"});
      var s = 0.8 + 0.5 * Math.sqrt(M.value / 2000), cx0 = c.W * 0.42;
      var rec = t > 0.1 ? (1 - Math.exp(-(t - 0.1) * 3)) * Math.min(120, 22 + V * 14) : 0;
      var cx = cx0 - rec;
      /* traces des roues pour sentir le recul */
      ctx.fillStyle = "rgba(15,27,45,.22)"; for (var q = cx0; q > cx; q -= 12) ctx.fillRect(q, gy + 6, 5, 2);
      /* canon : tube incliné + affût + roue */
      var ang = -0.2; ctx.save(); ctx.translate(cx + 8, gy - 52 * s); ctx.rotate(ang);
      ctx.fillStyle = P5x.lin(ctx, 0, -9 * s, 0, 9 * s, [[0, "#7c879b"], [0.5, "#4d576b"], [1, "#2e364a"]]); P5x.rr(ctx, -14, -9 * s, 100 * s, 18 * s, 5); ctx.fill();
      ctx.fillStyle = "#2e364a"; ctx.fillRect(86 * s - 4, -11 * s, 8, 22 * s); ctx.restore();
      ctx.fillStyle = "#566176"; P5x.rr(ctx, cx - 34 * s, gy - 52 * s, 62 * s, 22 * s, 6); ctx.fill();
      S.draw.dot(c, cx - 4, gy - 18 * s, 20 * s, "#6b4a2b"); S.draw.dot(c, cx - 4, gy - 18 * s, 12 * s, "#8a6840"); S.draw.dot(c, cx - 4, gy - 18 * s, 4, "#2e364a");
      /* flash et fumée */
      var mx = cx + 8 + Math.cos(ang) * 86 * s, my = gy - 52 * s + Math.sin(ang) * 86 * s;
      if (t < 0.25 && t > 0.02) S.draw.glow(c, mx + 10, my, 46 * (1 - t * 2.5), "#ffb02e", 0.9);
      if (t > 0.05){ for (var j = 0; j < 4; j++){ var tt = t - 0.05; ctx.fillStyle = "rgba(180,190,205," + Math.max(0, 0.45 - tt * 0.18).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(mx + 10 + j * 12 + tt * 16, my - 4 - tt * 10 - j * 4, 8 + tt * 8 + j * 3, 0, 7); ctx.fill(); } }
      /* projectile */
      if (t > 0.05 && t < 1.6){ var d = (t - 0.05) * 320; P5x.ball(c, mx + Math.cos(ang) * d, my + Math.sin(ang) * d + (t - 0.05) * (t - 0.05) * 22, 3 + m.value / 3, "#c0321d"); }
      /* flèches de quantité de mouvement (longueurs égales) et de vitesse */
      var L = Math.min(110, c.W / 2 - 70), ay = 50;
      P5.vec(c, c.W / 2, ay, c.W / 2 + L, ay, pal.red, "p proj.", {dy: -1, dx: 22, size: 12.5, w: 3.4});
      P5.vec(c, c.W / 2, ay, c.W / 2 - L, ay, pal.acc, "p canon", {dy: -1, dx: -22, size: 12.5, w: 3.4});
      P5x.tag(c, "p totale = 0 : égales et opposées", c.W / 2, 20, pal.ink, {size: 12.5});
      P5x.tag(c, "V = " + S.fmt(V, 2) + " m/s · v = " + S.fmt(v.value, 0) + " m/s", c.W / 2, c.H - 14, "#4b5868", {size: 11.5});
      /* bilan en barres */
      gr.clear(); var W = gr.W, H = gr.H, g2 = gr.ctx, half = W / 2, pp = m.value * v.value;
      S.draw.text(gr, "Quantité de mouvement", half / 2, 16, {size: 12.5}); S.draw.text(gr, "Énergie cinétique", half + half / 2, 16, {size: 12.5});
      var base1 = H / 2 + 14, hh = (H - 70) / 2, bw = Math.min(56, half / 4);
      g2.fillStyle = "#e3e7ed"; g2.fillRect(14, base1, half - 28, 2);
      g2.fillStyle = pal.red; P5x.rr(g2, half / 2 + 12, base1 - hh, bw, hh, 5); g2.fill(); g2.fillStyle = pal.acc; P5x.rr(g2, half / 2 - 12 - bw, base1 + 2, bw, hh, 5); g2.fill();
      S.draw.text(gr, "+" + S.fmt(pp, 0), half / 2 + 12 + bw / 2, base1 - hh - 10, {size: 12, color: pal.red}); S.draw.text(gr, "−" + S.fmt(pp, 0), half / 2 - 12 - bw / 2, base1 + hh + 14, {size: 12, color: pal.acc});
      S.draw.text(gr, "proj.", half / 2 + 12 + bw / 2, base1 + 14, {size: 11.5, color: pal.red}); S.draw.text(gr, "canon", half / 2 - 12 - bw / 2, base1 - 12, {size: 11.5, color: pal.acc});
      S.draw.text(gr, "(kg·m/s)", half / 2, 32, {size: 11, color: pal.grey});
      var b2 = H - 36, hmax = H - 80, hp = hmax * Ep / tot, hc = Math.max(1.5, hmax * Ec / tot);
      g2.fillStyle = "#e3e7ed"; g2.fillRect(half + 14, b2, half - 28, 2);
      g2.fillStyle = pal.red; P5x.rr(g2, half + half / 2 + 12, b2 - hp, bw, hp, 5); g2.fill(); g2.fillStyle = pal.acc; g2.fillRect(half + half / 2 - 12 - bw, b2 - hc, bw, hc);
      S.draw.text(gr, S.fmt(Ep / 1000, 1) + " kJ", half + half / 2 + 12 + bw / 2, b2 - hp - 10, {size: 12, color: pal.red}); S.draw.text(gr, S.fmt(Ec / 1000, 2) + " kJ", half + half / 2 - 12 - bw / 2, b2 - hc - 10, {size: 12, color: pal.acc});
      S.draw.text(gr, "canon", half + half / 2 - 12 - bw / 2, b2 + 14, {size: 11.5, color: pal.acc}); S.draw.text(gr, "proj.", half + half / 2 + 12 + bw / 2, b2 + 14, {size: 11.5, color: pal.red});
      ro.set(0, S.fmt(V, 3) + " m/s"); ro.set(1, S.fmt(pp, 0) + " kg·m/s"); ro.set(2, S.fmt(-M.value * V, 0) + " kg·m/s");
      ro.set(3, S.fmt(Ep / 1000, 1) + " kJ"); ro.set(4, S.fmt(Ec / 1000, 2) + " kJ"); ro.set(5, S.fmt(Ec / Ep, 4));
      nt.set("M·V = m·v donne V = " + S.fmt(V, 3) + " m/s. Le rapport des énergies vaut m/M = " + S.fmt(m.value / M.value, 4) + " : le projectile emporte presque toute l'énergie. (Modèle simplifié : on néglige les gaz et le frottement.)" + (V > 20 ? " Recul de " + S.fmt(V, 0) + " m/s : un canon aussi léger serait projeté vers l'arrière, le modèle reste valable mais n'a plus rien de réaliste." : ""), V > 20 ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "p5-c04-airbag", ch: "c04", tag: "Impulsion",
  titre: "Airbag et crash test : la durée du choc change tout",
  resume: "Durée de l'arrêt → force moyenne subie par le passager.",
  but: "Un passager de masse m roulant à la vitesse v s'arrête complètement. Fais varier la durée Δt de l'arrêt (pare-brise, ceinture, airbag) et observe la force moyenne.",
  aRetenir: "Impulsion : F·Δt = Δp = m·Δv. Pour le même changement de quantité de mouvement, augmenter la durée Δt de l'arrêt diminue la force moyenne : F = m·v/Δt. Airbags, zones de déformation et casques allongent Δt.",
  piege: "L'airbag ne diminue pas la quantité de mouvement à absorber (m·v est le même) : il la répartit sur une durée plus longue. Et F est ici une force moyenne : le pic peut être plus grand.",
  build: function(k, S){
    var c = k.canvas(250), gr = k.canvas(210);
    var v = k.slider("Vitesse avant l'impact", 20, 130, 5, 50, "km/h");
    var m = k.slider("Masse du passager", 40, 110, 5, 75, "kg");
    var dt = k.slider("Durée de l'arrêt Δt", 5, 300, 5, 100, "ms");
    k.button("Pare-brise rigide (10 ms)", function(){ dt.set(10); crash(); });
    k.button("Ceinture seule (60 ms)", function(){ dt.set(60); crash(); });
    k.button("Ceinture + airbag (120 ms)", function(){ dt.set(120); crash(); });
    k.button("Rejouer le choc", function(){ crash(); }, true);
    var ro = k.readouts(["Quantité de mouvement m·v", "Force moyenne F", "F / poids", "Décélération", "Distance d'arrêt"]);
    var nt = k.note("", "");
    var t = 0, TOT = 3.2;
    var lp = k.loop(function(d){ t += d; if (t > TOT) lp.pause(); k.redraw(); });
    function crash(){ t = 0; lp.play(); }
    var gx = null;
    P5x.drag(gr, k, function(){ if (!gx) return null; var T = dt.value, p = m.value * v.value / 3.6 / (T / 1000) / 1000; return [{x: gx.X(T), y: gx.Y(Math.min(p, gx.y1)), r: 34, set: function(px){ dt.set(Math.round(P5.clamp(gx.ix(px), 5, 300) / 5) * 5); }}]; }, function(){ crash(); });
    crash();
    k.draw(function(){
      var pal = S.draw.palette, g = P5.g, V = v.value / 3.6, T = dt.value / 1000, p = m.value * V, F = p / T, a = V / T, d = V * T / 2, ag = a / g;
      var ctx = c.ctx, kind = dt.value < 30 ? 0 : dt.value < 90 ? 1 : 2, col = ag > 40 ? pal.red : ag > 15 ? pal.amber : pal.green;
      P5x.sky(c, "#eef5fb", "#f8fbff"); var gy = c.H - 40, wallX = c.W - 38;
      P5x.ground(c, gy, {col: "#c9d1db"});
      /* mur de béton */
      ctx.fillStyle = "#9aa6b6"; ctx.fillRect(wallX, 20, 40, gy - 20); ctx.fillStyle = "rgba(255,255,255,.25)"; for (var y = 36; y < gy; y += 24) ctx.fillRect(wallX, y, 40, 2);
      /* mouvement : approche puis choc */
      var tA = 1.0, dur = P5.clamp(T * 12, 0.4, 3.4), tc = Math.max(0, t - tA), u = Math.min(1, tc / dur);
      var carW = Math.min(200, c.W * 0.5), carX = wallX - carW / 2 - 2 - Math.max(0, (tA - t)) / tA * (c.W * 0.22);
      if (t < tA) carX = wallX - carW / 2 - 2 - (1 - t / tA) * (c.W * 0.22) * 1;
      var crumple = t > tA ? Math.min(18, 18 * Math.min(1, tc / 0.25)) : 0; carX -= crumple * 0; var cw = carW - crumple;
      var cxc = wallX - cw / 2 - 1;
      /* voiture : carrosserie, vitre, roues */
      var bot = gy - 12, ch = 74; ctx.save(); ctx.shadowColor = "rgba(15,27,45,.2)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
      P5x.rr(ctx, cxc - cw / 2, bot - ch, cw, ch, 12); ctx.fillStyle = P5x.lin(ctx, 0, bot - ch, 0, bot, [[0, "#5c8de0"], [1, "#2e5bb5"]]); ctx.fill(); ctx.restore();
      ctx.fillStyle = "rgba(220,238,252,.9)"; P5x.rr(ctx, cxc - cw * 0.40, bot - ch + 8, cw * 0.66, 32, 7); ctx.fill();
      S.draw.dot(c, cxc - cw * 0.3, bot, 13, "#13233a"); S.draw.dot(c, cxc + cw * 0.3, bot, 13, "#13233a"); S.draw.dot(c, cxc - cw * 0.3, bot, 5, "#9aa6b6"); S.draw.dot(c, cxc + cw * 0.3, bot, 5, "#9aa6b6");
      /* passager : se déplace vers l'avant pendant l'arrêt, de d (limité à l'habitacle) */
      var off = t > tA ? d * (2 * u - u * u) * 260 : 0; off = Math.min(off, cw * 0.28);
      var sx = cxc - cw * 0.08, hy = bot - 62; var px = sx + off;
      ctx.fillStyle = "#1d3f7a"; P5x.rr(ctx, sx - 24, bot - 50, 10, 38, 3); ctx.fill();        /* dossier */
      /* coussin / ceinture / tableau de bord */
      var dashX = cxc + cw * 0.22;
      if (kind === 2){ var infl = t > tA ? Math.min(1, tc / 0.15) : 0; if (infl > 0){ ctx.fillStyle = "rgba(255,255,255,.95)"; ctx.strokeStyle = "#9aa6b6"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dashX - 6, bot - 40, 8 + infl * 26, 0, 7); ctx.fill(); ctx.stroke(); } }
      ctx.fillStyle = "#33405a"; ctx.fillRect(dashX + 2, bot - 52, 12, 30);
      if (kind >= 1){ ctx.strokeStyle = "#f4c542"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx - 20, bot - 56); ctx.lineTo(px + 2, bot - 40); ctx.lineTo(sx - 16, bot - 16); ctx.stroke(); }
      P5x.person(c, px, bot - 8, 50, "#e9a23b", {lean: 0.05});
      /* force subie */
      if (t > tA && u < 1){ P5.vec(c, px + 12, bot - 36, px + 12 + Math.min(70, 20 + F / 1000 * 3), bot - 36, "#c0321d", "F", {size: 13, w: 3.6}); P5x.tag(c, S.fmt(F / 1000, 1) + " kN", px + 4, bot - 84, "#c0321d", {align: "left"}); }
      if (t > tA && u >= 1) P5x.banner(c, "Arrêt complet en " + dt.value + " ms · " + S.fmt(ag, 0) + " g", col, 22);
      else P5x.banner(c, t < tA ? "v = " + v.value + " km/h : le choc approche" : "Le passager continue : l'impact dure " + dt.value + " ms", "#4b5868", 22);
      P5x.tag(c, kind === 0 ? "arrêt brutal (tableau de bord)" : kind === 1 ? "ceinture de sécurité" : "ceinture + airbag", 10, c.H - 12, "#4b5868", {align: "left", size: 11.5});
      /* graphe F(t) : aire du rectangle = m·v (même impulsion) */
      gr.clear();
      var Fk = F / 1000, ymax = Math.max(20, Math.ceil(Fk * 1.35 / 10) * 10);
      gx = S.draw.axes(gr, {x0: 0, x1: 300, y0: 0, y1: ymax, xl: "t (ms)", yl: "F moyenne (kN)", stepX: 50, l: 54});
      [[10, "10 ms"], [60, "60 ms"], [120, "120 ms"]].forEach(function(r){ var fk = p / (r[0] / 1000) / 1000; if (fk > ymax) return; gr.ctx.strokeStyle = "rgba(138,149,163,.7)"; gr.ctx.lineWidth = 1.2; gr.ctx.setLineDash([4, 4]); gr.ctx.strokeRect(gx.X(0), gx.Y(fk), gx.X(r[0]) - gx.X(0), gx.Y(0) - gx.Y(fk)); gr.ctx.setLineDash([]); });
      var pw = m.value * g / 1000;
      gr.ctx.fillStyle = S.draw.tint(col, 0.22); gr.ctx.fillRect(gx.X(0), gx.Y(Math.min(Fk, ymax)), gx.X(dt.value) - gx.X(0), gx.Y(0) - gx.Y(Math.min(Fk, ymax)));
      gr.ctx.strokeStyle = col; gr.ctx.lineWidth = 2.6; gr.ctx.strokeRect(gx.X(0), gx.Y(Math.min(Fk, ymax)), gx.X(dt.value) - gx.X(0), gx.Y(0) - gx.Y(Math.min(Fk, ymax)));
      S.draw.line(gr, gx.X(0), gx.Y(pw), gx.X(300), gx.Y(pw), pal.grey, 1.5, [4, 4]);
      P5x.tag(gr, "poids du passager", gx.X(298), gx.Y(pw) - 11, "#4b5868", {align: "right", size: 11});
      P5x.tag(gr, "aire = F·Δt = m·v = " + S.fmt(p, 0) + " N·s (toujours la même)", gx.X(298), gx.T + 12, pal.acc, {align: "right", size: 11.5});
      P5x.handle(gr, gx.X(dt.value), gx.Y(Math.min(Fk, ymax)), col, 8);
      P5x.tag(gr, S.fmt(Fk, 1) + " kN", gx.X(dt.value) + 14, gx.Y(Math.min(Fk, ymax)) + 2, col, {align: "left"});
      ro.set(0, S.fmt(p, 0) + " kg·m/s"); ro.set(1, S.fmt(Fk, 1) + " kN"); ro.set(2, S.fmt(F / (m.value * g), 1) + " ×"); ro.set(3, S.fmt(ag, 1) + " g"); ro.set(4, S.fmt(d * 100, 0) + " cm");
      nt.set("F = m·v/Δt = " + S.fmt(p, 0) + " / " + S.fmt(T, 3) + " = " + S.fmt(Fk, 1) + " kN, soit " + S.fmt(F / (m.value * g), 0) + " fois le poids. " + (ag > 40 ? "Décélération supérieure à ≈ 40 g : ordre de grandeur où les blessures graves deviennent probables." : ag > 15 ? "Décélération élevée, difficile à supporter sans blessure sans retenue adaptée." : "Décélération raisonnable : bien mieux supportée."), ag > 40 ? "bad" : ag > 15 ? "warn" : "ok");
    });
  }
});
