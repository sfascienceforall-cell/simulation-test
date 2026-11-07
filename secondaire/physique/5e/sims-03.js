/* Chapitre 3 · Deuxième loi de Newton */
SFA.sim({
  id: "p5-c03-chariot", ch: "c03", tag: "Classique",
  titre: "Le chariot tiré par une masse suspendue",
  resume: "Masse du chariot et masse suspendue → accélération mesurée.",
  but: "Fais varier la masse du chariot M, la masse suspendue m et le frottement. Prévois l'accélération avec ΣF = m·a avant de lâcher le chariot, puis compare au graphe.",
  aRetenir: "Le système (chariot + masse suspendue) est accéléré par la seule force motrice m·g : (M + m)·a = m·g − f. Donc a < g toujours, et plus on ajoute de masse au chariot, plus a diminue.",
  piege: "La tension du fil n'est pas égale à m·g : la masse suspendue accélère, donc T = m·(g − a) < m·g. Elle n'égale m·g que si a = 0.",
  build: function(k, S){
    var c = k.canvas(250), gr = k.canvas(190);
    var M = k.slider("Masse du chariot M", 0.2, 2, 0.1, 1, "kg");
    var m = k.slider("Masse suspendue m", 0.02, 0.5, 0.01, 0.1, "kg");
    var mu = k.slider("Frottement du chariot (μ)", 0, 0.3, 0.01, 0, "");
    var ro = k.readouts(["Force motrice m·g", "Accélération a", "Tension T du fil", "Vitesse v", "a / g"]);
    var nt = k.note("", "");
    var t = 0, x = 0, v = 0, L = 1.2;
    function acc(){ var mg = m.value * P5.g, f = mu.value * M.value * P5.g; return mg > f ? (mg - f) / (M.value + m.value) : 0; }
    var lp = k.loop(function(dt){
      var a = acc(); if (x < L){ v += a * dt; x += v * dt; t += dt; } else lp.pause();
      if (x >= L){ x = L; }
      k.redraw();
    });
    k.button("Lâcher le chariot", function(){ t = 0; x = 0; v = 0; lp.play(); }, true);
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, a = acc();
      c.clear(); P5x.sky(c, "#eef3fa", "#f9fbfe");
      var X0 = 24, tw = c.W - 110, ty = 98;
      /* table */
      ctx.fillStyle = P5x.lin(ctx, 0, ty, 0, ty + 12, [[0, "#d9b98c"], [1, "#b8945f"]]); ctx.fillRect(X0 - 10, ty, tw + 30, 12);
      ctx.fillStyle = "#a07c4c"; ctx.fillRect(X0 + 6, ty + 12, 10, c.H - ty - 12); ctx.fillRect(X0 + tw - 6, ty + 12, 10, c.H - ty - 12);
      for (var gx = 0; gx <= 12; gx++){ var mx = X0 + 20 + gx * (tw - 90) / 12; ctx.fillStyle = "rgba(15,27,45,.35)"; ctx.fillRect(mx, ty + 12, 1.5, gx % 5 ? 4 : 8); }
      var cw = 62, ch = 38, px = X0 + 20 + (x / L) * (tw - 90) - cw / 2 + cw / 2;
      var pulx = X0 + tw + 14, puly = ty - 14;
      /* poulie */
      S.draw.line(c, pulx, puly + 10, pulx, ty + 2, pal.grey, 3);
      ctx.fillStyle = "#9aa6b6"; ctx.beginPath(); ctx.arc(pulx, puly, 13, 0, 2 * Math.PI); ctx.fill(); ctx.fillStyle = "#e8edf3"; ctx.beginPath(); ctx.arc(pulx, puly, 8, 0, 2 * Math.PI); ctx.fill(); S.draw.dot(c, pulx, puly, 3, pal.ink);
      var hang = 46 + (x / L) * 70, mby = ty + hang + 30;
      S.draw.line(c, px + cw / 2, ty - ch / 2 - 4 + 0, pulx, puly - 13, pal.ink, 1.6);
      S.draw.line(c, pulx + 13, puly, pulx + 13, mby - 30, pal.ink, 1.6);
      P5x.cart(c, px, ty, cw, ch, pal.acc, "M", {size: 13});
      var mw = 20 + 40 * (m.value - 0.02) / 0.48;
      P5x.box(c, pulx + 13, mby, mw, 20 + 12 * m.value / 0.5 + 10, pal.red, "m", {size: 12});
      /* forces sur le chariot (échelle : 10 px par N) et sur la masse */
      var sc = 22;
      var Tn = a > 0 ? M.value * (a + mu.value * g) : m.value * g;
      if (a > 0 || m.value * g > 0){ P5.vec(c, px + 6, ty - ch - 8, px + 6 + Math.min(70, Tn * sc), ty - ch - 8, pal.green, "T", {dy: -6}); }
      if (a > 0) P5.vec(c, pulx + 36, mby - 14, pulx + 36, mby - 14 + Math.min(60, m.value * g * sc), pal.ink, "m·g", {dx: 6});
      S.draw.label(c, "x = " + S.fmt(x, 2) + " m   t = " + S.fmt(t, 2) + " s   v = " + S.fmt(v, 2) + " m/s", 10, 16, {color: pal.acc, size: 12, align: "left"});
      /* graphe a(m) */
      gr.clear();
      var Mv = M.value, mus = mu.value;
      var ax = S.draw.axes(gr, {x0: 0, x1: 0.5, y0: 0, y1: 10, xl: "m (kg)", yl: "a (m/s²)", stepX: 0.1, stepY: 2});
      S.draw.fn(gr, ax, function(mm){ var F = mm * g - mus * Mv * g; return F > 0 ? F / (Mv + mm) : 0; }, pal.acc);
      S.draw.line(gr, ax.X(0), ax.Y(g), ax.X(0.5), ax.Y(g), pal.red, 1.5, [6, 4]); S.draw.text(gr, "g", ax.X(0.49), ax.Y(g) - 9, {color: pal.red, size: 12});
      S.draw.dot(gr, ax.X(m.value), ax.Y(a), 6, pal.green);
      var T = a > 0 ? Mv * (a + mus * g) : m.value * g;
      ro.set(0, S.fmt(m.value * g, 2) + " N"); ro.set(1, S.fmt(a, 2) + " m/s²"); ro.set(2, S.fmt(T, 2) + " N"); ro.set(3, S.fmt(v, 2) + " m/s"); ro.set(4, S.fmt(a / g, 3));
      if (a === 0) nt.set("Le chariot ne démarre pas : la force motrice m·g est inférieure ou égale au frottement μ·M·g.", "warn");
      else nt.set("(M + m)·a = m·g − μ·M·g : a = " + S.fmt(a, 2) + " m/s², soit " + S.fmt(100 * a / g, 0) + " % de g. Le fil tire le chariot avec T = " + S.fmt(T, 2) + " N, moins que m·g = " + S.fmt(m.value * g, 2) + " N.", "");
    });
  }
});

SFA.sim({
  id: "p5-c03-forces", ch: "c03", tag: "Défi",
  titre: "Diagramme de forces : trouve la résultante et l'accélération",
  resume: "Règle les forces horizontales et le frottement ; atteins l'accélération demandée.",
  but: "Un bloc est tiré vers la droite et vers la gauche, avec un frottement. Calcule ΣF et a, puis relève les défis : fais en sorte que l'accélération vaille la valeur demandée.",
  aRetenir: "On additionne les forces avec leur signe (droite +, gauche −), on obtient ΣF, puis a = ΣF/m. Le poids et la réaction normale se compensent ici (mouvement horizontal) : ils n'interviennent pas dans a.",
  piege: "Le frottement s'oppose au mouvement, il ne le crée pas, et il ne peut pas retourner le bloc : si les forces appliquées sont plus faibles que le frottement maximal, le bloc reste immobile et a = 0 (pas d'accélération négative).",
  build: function(k, S){
    var c = k.canvas(330);
    var m = k.slider("Masse du bloc", 0.5, 10, 0.5, 4, "kg");
    var fd = k.slider("Force vers la droite", 0, 50, 1, 20, "N");
    var fg = k.slider("Force vers la gauche", 0, 50, 1, 5, "N");
    var fr = k.slider("Frottement maximal", 0, 30, 1, 3, "N");
    var ro = k.readouts(["Forces appliquées (→ +)", "Frottement actif", "ΣF", "Accélération a", "v après 5 s"]);
    var tg = [2, 0.5, 4, 0], di = 0, nt = k.note("", "");
    k.button("Nouveau défi", function(){ di = (di + 1) % tg.length; });
    var xo = 0, v = 0, lp = k.loop(function(dt){
      var s0 = st(), vn = v + s0.a * dt;
      if (v !== 0 && vn * v <= 0 && Math.abs(s0.app) <= fr.value) vn = 0;
      v = vn; xo += v * dt; if (Math.abs(xo) > 1e5) xo = 0; k.redraw();
    });
    k.button("Animer / réinitialiser", function(){ xo = 0; v = 0; lp.play(); });
    function st(){
      var app = fd.value - fg.value, f = 0, a = 0;
      if (Math.abs(app) <= fr.value && Math.abs(v) < 1e-9){ f = -app; a = 0; }
      else { var s = (Math.abs(v) > 1e-9 ? Math.sign(v) : Math.sign(app)); f = -s * fr.value; a = (app + f) / m.value; }
      return {app: app, f: f, a: a, net: app + f};
    }
    var SC = 2.3, cxm = 0, bw = 84, tipD = {x: 0, y: 0}, tipG = {x: 0, y: 0};
    P5x.drag(c, k, function(){ return [
      {x: tipD.x, y: tipD.y, r: 30, set: function(px){ fd.set(Math.round(P5.clamp((px - cxm - bw / 2) / SC, 0, 50))); }},
      {x: tipG.x, y: tipG.y, r: 30, set: function(px){ fg.set(Math.round(P5.clamp((cxm - bw / 2 - px) / SC, 0, 50))); }}]; });
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, s = st(); P5x.sky(c, "#f4f8fd", "#e9f0f8");
      var ty = 160, cx = c.W / 2; cxm = cx;
      SC = Math.min(2.3, (c.W / 2 - bw / 2 - 26) / 50);
      P5x.ground(c, ty, {col: "#d3dbe6", pas: 40, off: xo * 40});
      var bh = 44 + m.value * 3.4, w = bw;
      /* ombre portée et bloc */
      P5x.box(c, cx, ty, w, bh, "#3f6fc6", S.fmt(m.value, 1) + " kg", {size: 14});
      var yy = ty - bh / 2, P = m.value * P5.g;
      /* cordes et poignées */
      var rx = cx + w / 2 + fd.value * SC, lx = cx - w / 2 - fg.value * SC;
      tipD.x = rx; tipD.y = yy; tipG.x = lx; tipG.y = yy;
      if (fd.value > 0){ S.draw.line(c, cx + w / 2, yy, rx, yy, "rgba(15,27,45,.2)", 5); P5.vec(c, cx + w / 2, yy, rx, yy, pal.acc, "F₁", {dy: -16, size: 14, w: 3.4}); }
      if (fg.value > 0){ S.draw.line(c, cx - w / 2, yy, lx, yy, "rgba(15,27,45,.2)", 5); P5.vec(c, cx - w / 2, yy, lx, yy, pal.red, "F₂", {dy: -16, size: 14, w: 3.4}); }
      P5x.handle(c, rx, yy, pal.acc, 8); P5x.handle(c, lx, yy, pal.red, 8);
      if (Math.abs(s.f) > 0) P5.vec(c, cx, ty - 4, cx + s.f * SC, ty - 4, pal.amber, "f", {dy: 14, size: 14, w: 3});
      /* poids et réaction : très courts, ils se compensent */
      P5.vec(c, cx, yy - bh / 2 - 4 + 0, cx, yy - bh / 2 - 30, pal.green, "N", {dx: 14, size: 12, w: 2.4});
      P5.vec(c, cx - 22, yy - bh / 2 - 30, cx - 22, yy - bh / 2 - 4, pal.ink, "P", {dx: -14, size: 12, w: 2.4});
      P5x.hint(c, "Tire les poignées pour régler F₁ et F₂ · P = N = " + S.fmt(P, 1) + " N", {y: 14, size: 12});
      /* bilan des forces bout à bout sur une droite graduée */
      var by = 262, mid = c.W / 2, u = Math.min(2.2, (c.W / 2 - 22) / 52);
      S.draw.line(c, mid - 52 * u, by, mid + 52 * u, by, "#c3ccd8", 2);
      for (var q = -50; q <= 50; q += 10){ S.draw.line(c, mid + q * u, by - 4, mid + q * u, by + 4, "#9aa6b6", 1.4); if (q % 20 === 0) S.draw.text(c, S.fmt(q, 0), mid + q * u, by + 15, {size: 10.5, color: pal.grey, weight: 700}); }
      var acc = 0, rows = [[fd.value, pal.acc, "F₁"], [-fg.value, pal.red, "F₂"], [s.f, pal.amber, "f"]];
      rows.forEach(function(r, i){ if (Math.abs(r[0]) < 1e-9) return; var y = by - 40 + i * 11; P5.vec(c, mid + acc * u, y, mid + (acc + r[0]) * u, y, r[1], "", {w: 3.2}); S.draw.line(c, mid + (acc + r[0]) * u, y, mid + (acc + r[0]) * u, by, "rgba(15,27,45,.15)", 1, [2, 3]); acc += r[0]; });
      if (Math.abs(acc) > 1e-9){ P5.vec(c, mid, by - 2, mid + acc * u, by - 2, pal.green, "", {w: 4.4}); }
      S.draw.dot(c, mid + acc * u, by, 5, pal.green);
      P5x.tag(c, "ΣF = " + S.fmt(s.net, 1) + " N", mid + acc * u, by + 34, pal.green, {size: 12.5});
      P5x.hint(c, "bilan : les flèches mises bout à bout", {x: 10, y: by - 58, size: 11.5});
      ro.set(0, S.fmt(s.app, 1) + " N"); ro.set(1, S.fmt(s.f, 1) + " N"); ro.set(2, S.fmt(s.net, 1) + " N"); ro.set(3, S.fmt(s.a, 2) + " m/s²");
      ro.set(4, S.fmt(s.a * 5, 1) + " m/s");
      var ok = Math.abs(s.a - tg[di]) < 0.03 && (tg[di] !== 0 || fd.value + fg.value > 0);
      nt.set("<b>Défi " + (di + 1) + "/4.</b> Obtiens a = " + S.fmt(tg[di], 1) + " m/s²" + (tg[di] === 0 ? " (sans utiliser des forces égales à zéro)" : "") + ". " + (ok ? "Réussi : ΣF = m·a = " + S.fmt(m.value * tg[di], 1) + " N." : "Pas encore : il te faut ΣF = m·a = " + S.fmt(m.value * tg[di], 1) + " N."), ok ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "p5-c03-fusee", ch: "c03", tag: "Niche utile",
  titre: "La fusée : masse qui diminue, accélération qui augmente",
  resume: "Poussée, masse et débit de carburant → accélération, vitesse et altitude.",
  but: "Règle la poussée, la masse à vide et le carburant. Trouve des réglages où la fusée décolle, puis cherche l'altitude maximale. Observe l'accélération pendant la combustion.",
  aRetenir: "ΣF = F − m·g = m·a, donc a = F/m − g. Comme la masse m diminue (le carburant brûle) alors que F reste constante, l'accélération augmente pendant la poussée. La fusée ne décolle que si F > m·g, où m est sa masse à cet instant (carburant compris).",
  piege: "Une poussée égale au poids ne fait pas « monter lentement » : la résultante est nulle et la fusée reste au sol (ou à vitesse constante). Après la fin de la poussée, la fusée monte encore (elle garde sa vitesse), puis retombe : seule la gravité agit.",
  build: function(k, S){
    var sc1 = k.canvas(310), gr = k.canvas(170);
    var F = k.slider("Poussée F", 200, 3000, 50, 1200, "N");
    var m0 = k.slider("Masse à vide", 5, 40, 1, 20, "kg");
    var mc = k.slider("Masse de carburant", 2, 30, 1, 12, "kg");
    var q = k.slider("Débit de carburant", 0.5, 5, 0.1, 2, "kg/s");
    var ro = k.readouts(["a au départ", "a avant l'extinction", "Durée de poussée", "Vitesse max", "Altitude max"]);
    var nt = k.note("", ""), tr = null, tp = 0;
    function simulate(){
      var g = P5.g, dt = 0.02, t = 0, h = 0, v = 0, fuel = mc.value, out = [[0, 0, 0, 0, fuel]], vmax = 0, hmax = 0, tb = mc.value / q.value, ground = true, tLift = 0;
      while (t < 400){
        var burn = fuel > 1e-9, m = m0.value + Math.max(fuel, 0), a = (burn ? F.value : 0) / m - g;
        if (ground){
          if (a <= 0){
            if (burn){ fuel -= q.value * dt; t += dt; continue; }
            break;
          }
          ground = false; tLift = t;
          out.push([t, 0, 0, 0, Math.max(fuel, 0)]);
        }
        v += a * dt; h += v * dt; if (burn){ fuel -= q.value * dt; } t += dt;
        if (h <= 0){ h = 0; out.push([t, 0, v, a, Math.max(fuel, 0)]); break; }
        vmax = Math.max(vmax, v); hmax = Math.max(hmax, h);
        out.push([t, h, v, a, Math.max(fuel, 0)]);
      }
      return {pts: out, tb: tb, vmax: vmax, hmax: hmax, launched: !ground, T: ground ? 0 : t, tLift: tLift};
    }
    function key(){ return [F.value, m0.value, mc.value, q.value].join("|"); }
    var lp = k.loop(function(dt){ tp += dt * 2; if (tr && tp > tr.T + 1.5) lp.pause(); k.redraw(); });
    function launch(){ tr = simulate(); tr.key = key(); tp = 0; lp.play(); }
    k.button("Lancer (temps ×2)", launch, true);
    var tip = {x: 0, y: 0, base: 0};
    P5x.drag(sc1, k, function(){ return [{x: tip.x, y: tip.y, r: 30, set: function(px, py){ F.set(Math.round(P5.clamp(200 + (py - tip.base - 14) / 60 * 2800, 200, 3000) / 50) * 50); }}]; });
    function rocket(c, x, yb, s, flame, flick){
      var ctx = c.ctx, w = 22 * s, h = 62 * s;
      if (flame > 0){ var fl = (flame * 70 + 10) * s * (1 + 0.12 * Math.sin(flick * 40)); var g = ctx.createLinearGradient(0, yb, 0, yb + fl); g.addColorStop(0, "#fff3b0"); g.addColorStop(0.35, "#ffb02e"); g.addColorStop(1, "rgba(224,80,30,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w * 0.42, yb); ctx.quadraticCurveTo(x, yb + fl * 1.3, x + w * 0.42, yb); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "#c0321d"; ctx.beginPath(); ctx.moveTo(x - w / 2, yb - h * 0.3); ctx.lineTo(x - w, yb + 2); ctx.lineTo(x - w / 2, yb - 3); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + w / 2, yb - h * 0.3); ctx.lineTo(x + w, yb + 2); ctx.lineTo(x + w / 2, yb - 3); ctx.fill();
      ctx.fillStyle = P5x.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, "#eef2f8"], [0.5, "#ffffff"], [1, "#b9c4d3"]]); P5x.rr(ctx, x - w / 2, yb - h, w, h, w * 0.3); ctx.fill(); ctx.strokeStyle = "#8a95a3"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = "#c0321d"; ctx.beginPath(); ctx.moveTo(x - w / 2, yb - h * 0.8); ctx.quadraticCurveTo(x, yb - h * 1.45, x + w / 2, yb - h * 0.8); ctx.closePath(); ctx.fill();
      S.draw.dot(c, x, yb - h * 0.55, w * 0.22, "#2f7fd1"); ctx.fillStyle = "#6b7685"; ctx.fillRect(x - w * 0.38, yb - 1, w * 0.76, 4);
    }
    k.draw(function(){
      var pal = S.draw.palette, ctx = sc1.ctx, g = P5.g, mt = m0.value + mc.value;
      if (!tr || tr.key !== key()){ tr = simulate(); tr.key = key(); tp = 0; if (!lp.running) tp = 0; }
      var R = tr, pts = R.pts, T = Math.max(R.T, 5), hmax = Math.max(R.hmax, 10);
      sc1.clear(); gr.clear();
      var H = sc1.H, W = sc1.W, split = Math.min(190, W * 0.42);
      /* ciel qui fonce avec l'altitude */
      var idx = 0; while (idx < pts.length - 1 && pts[idx][0] < tp) idx++; var pc = R.launched ? pts[Math.min(idx, pts.length - 1)] : [0, 0, 0, 0, mc.value];
      var frac = Math.sqrt(Math.min(1, pc[1] / (hmax * 1.05)));
      ctx.fillStyle = P5x.lin(ctx, 0, 0, 0, H, [[0, "#1b2f55"], [Math.max(0.15, 0.6 - frac * 0.5), "#6aa7de"], [1, "#d6eaf8"]]); ctx.fillRect(0, 0, split, H);
      ctx.fillStyle = "#6fa27a"; ctx.fillRect(0, H - 34, split, 34); ctx.fillStyle = "#4d7d58"; ctx.fillRect(0, H - 34, split, 4);
      ctx.fillStyle = "#98a4b3"; ctx.fillRect(split / 2 - 34, H - 40, 68, 8);
      var cx = split / 2, groundY = H - 40, topY = 78, yb = groundY - frac * (groundY - topY - 70) - 0;
      /* traînée de fumée */
      if (R.launched){ for (var i = 0; i < pts.length && pts[i][0] <= tp; i += 3){ var f2 = Math.sqrt(Math.min(1, pts[i][1] / (hmax * 1.05))), yy = groundY - f2 * (groundY - topY - 70); if (pts[i][4] > 0){ ctx.fillStyle = "rgba(255,255,255," + (0.5 - 0.4 * (tp - pts[i][0]) / Math.max(tp, 1)).toFixed(2) + ")"; ctx.beginPath(); ctx.arc(cx + Math.sin(i) * 5, yy + 8, 5 + (tp - pts[i][0]) * 2, 0, 7); ctx.fill(); } } }
      var burning = pc[4] > 1e-6 && (R.launched ? pc[0] <= (R.tLift + mc.value / q.value + 0.05) : true);
      var lift = R.launched;
      var flame = (pc[4] > 1e-6) ? F.value / 3000 : 0;
      if (!lift && tp > 0.1) flame = 0.35 * F.value / 3000;
      rocket(sc1, cx, yb, 0.95, flame, tp);
      tip.x = cx; tip.y = yb + (flame > 0 ? 18 + F.value / 3000 * 60 : 24); tip.base = yb;
      if (!lp.running || !lift) P5x.handle(sc1, cx, yb + 14 + 2 + (F.value - 200) / 2800 * 60, "#e07a1f", 7.5);
      /* jauge de carburant */
      ctx.fillStyle = "rgba(255,255,255,.9)"; P5x.rr(ctx, 12, 40, 14, 96, 4); ctx.fill(); ctx.strokeStyle = "#9aa6b6"; ctx.stroke();
      var fl = Math.max(0, pc[4]) / mc.value; ctx.fillStyle = fl > 0.25 ? "#2f9e6f" : "#c0321d"; P5x.rr(ctx, 14, 42 + 92 * (1 - fl), 10, 92 * fl, 3); ctx.fill();
      S.draw.text(sc1, "carburant", 8, 148, {size: 11, color: "#fff", align: "left"});
      S.draw.text(sc1, S.fmt(Math.max(0, pc[4]), 1) + " kg", 8, 32, {size: 11.5, color: "#fff", align: "left"});
      P5x.hint(sc1, "Tire la flamme pour régler F", {x: 8, y: 14, align: "left", size: 11, color: "#fff"});
      /* graphe altitude */
      var ax = S.draw.axes(sc1, {x0: 0, x1: T * 1.02, y0: 0, y1: hmax * 1.1, xl: "t (s)", yl: "altitude (m)", l: split + 56, r: 14, t: 26});
      ctx.save(); ctx.beginPath(); ctx.rect(split + 4, 0, W, H); ctx.clip();
      var fin = R.launched ? R.tb : 0;
      if (R.launched){
        S.draw.line(sc1, ax.X(fin), ax.Y(0), ax.X(fin), ax.Y(hmax * 1.1), pal.amber, 1.6, [5, 4]);
        P5x.tag(sc1, "fin de poussée", ax.X(fin) + 4, ax.T + 40, "#8a5200", {align: "left", size: 11});
        S.draw.area(sc1, ax, function(t){ var j = 0; while (j < pts.length - 1 && pts[j][0] < t) j++; return pts[j][1]; }, 0, Math.min(tp, R.T), pal.acc, 0.1);
        ctx.strokeStyle = pal.acc; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath(); var st0 = false;
        pts.forEach(function(p){ if (p[0] > tp) return; if (!st0){ ctx.moveTo(ax.X(p[0]), ax.Y(p[1])); st0 = true; } else ctx.lineTo(ax.X(p[0]), ax.Y(p[1])); }); ctx.stroke();
        S.draw.dot(sc1, ax.X(pc[0]), ax.Y(pc[1]), 6.5, pal.red);
      }
      ctx.restore();
      if (!R.launched) P5x.banner(sc1, "F ≤ m·g : la fusée reste au sol", pal.red, 44); 
      var a0 = F.value / mt - g, a1 = F.value / m0.value - g;
      /* graphe accélération */
      var ymax = Math.max(F.value / m0.value - g, 10) * 1.1, ymin = Math.min(-12, -g - 2);
      var ax2 = S.draw.axes(gr, {x0: 0, x1: T * 1.02, y0: ymin, y1: ymax, xl: "t (s)", yl: "a (m/s²)", l: 60});
      if (R.launched){
        S.draw.line(gr, ax2.X(0), ax2.Y(-g), ax2.X(T * 1.02), ax2.Y(-g), "rgba(192,50,29,.5)", 1.4, [5, 4]); P5x.tag(gr, "−g (chute libre)", ax2.X(T * 0.55), ax2.Y(-g) - 12, pal.red, {align: "center", size: 11});
        gr.ctx.strokeStyle = pal.green; gr.ctx.lineWidth = 3; gr.ctx.beginPath(); var s2 = false;
        pts.forEach(function(p){ if (p[0] > tp) return; if (!s2){ gr.ctx.moveTo(ax2.X(p[0]), ax2.Y(p[3])); s2 = true; } else gr.ctx.lineTo(ax2.X(p[0]), ax2.Y(p[3])); }); gr.ctx.stroke();
        S.draw.dot(gr, ax2.X(pc[0]), ax2.Y(pc[3]), 5.5, pal.green);
      }
      ro.set(0, a0 > 0 ? S.fmt(a0, 2) + " m/s²" : "0 (reste au sol)"); ro.set(1, a1 > 0 ? S.fmt(a1, 2) + " m/s²" : "0 (reste au sol)"); ro.set(2, S.fmt(mc.value / q.value, 1) + " s");
      ro.set(3, R.launched ? S.fmt(R.vmax, 1) + " m/s" : "0"); ro.set(4, R.launched ? S.fmt(R.hmax, 0) + " m" : "0 m");
      if (!R.launched) nt.set("F = " + S.fmt(F.value, 0) + " N ≤ m·g, même avec le réservoir vide (m₀·g = " + S.fmt(m0.value * g, 0) + " N) : la résultante n'est jamais positive, la fusée reste au sol (le sol compense la différence).", "warn");
      else if (R.tLift > 0.05) nt.set("F = " + S.fmt(F.value, 0) + " N est inférieure au poids initial (" + S.fmt(mt * g, 0) + " N) : la fusée reste posée pendant " + S.fmt(R.tLift, 1) + " s, le temps que le carburant brûlé l'allège jusqu'à m·g < F, puis elle décolle (modèle simplifié : g constant, pas de frottement de l'air).", "warn");
      else nt.set("Poussée " + S.fmt(F.value, 0) + " N pour un poids initial de " + S.fmt(mt * g, 0) + " N. L'accélération passe de " + S.fmt(a0, 1) + " à " + S.fmt(a1, 1) + " m/s² pendant la combustion (modèle simplifié : g constant, pas de frottement de l'air).", "");
    });
    launch();
  }
});

SFA.sim({
  id: "p5-c03-ascenseur", ch: "c03", tag: "Poids apparent",
  titre: "L'ascenseur et la balance : le poids apparent",
  resume: "Accélération de la cabine → indication de la balance.",
  but: "Place une personne sur une balance dans une cabine et fais varier l'accélération de la cabine. Que lit la balance au démarrage en montée, à vitesse constante, et si le câble casse (a = −g) ?",
  aRetenir: "La balance mesure la réaction normale N : N − m·g = m·a, donc N = m·(g + a) (a positif vers le haut). a > 0 : plus lourd ; a = 0 : poids normal ; a = −g : N = 0, impondérabilité.",
  piege: "La balance ne donne pas la vitesse : monter ou descendre à vitesse constante donne la même lecture. C'est le signe de l'accélération qui compte (monter en freinant donne a < 0, comme descendre en accélérant).",
  build: function(k, S){
    var c = k.canvas(330), gr = k.canvas(170);
    var a = k.slider("Accélération de la cabine (+ : vers le haut)", -12, 6, 0.1, 2, "m/s²");
    var m = k.slider("Masse de la personne", 40, 100, 1, 70, "kg");
    k.button("Démarrage en montée", function(){ a.set(2); });
    k.button("Vitesse constante", function(){ a.set(0); });
    k.button("Câble rompu", function(){ a.set(-9.81); });
    var ro = k.readouts(["Poids réel m·g", "Réaction N", "La balance indique", "N / (m·g)"]);
    var nt = k.note("", "");
    var pos = 0.5, vel = 0, tt = 0;
    var lp = k.loop(function(dt){ dt = Math.min(dt, 0.05); var A = a.value; vel += A * dt; pos += vel * dt * 0.05;
      if (pos > 0.9 || pos < 0.1){ pos = Math.min(0.9, Math.max(0.1, pos)); vel = 0; }
      k.redraw(); });
    lp.play();
    k.draw(function(){
      var pal = S.draw.palette, ctx = c.ctx, g = P5.g, A = a.value;
      var N = Math.max(0, m.value * (g + A)), P = m.value * g;
      c.clear(); P5x.sky(c, "#eef3fa", "#f9fbfe");
      var sx = c.W / 2 - 100, sw = 200, top = 14, bot = c.H - 14;
      /* gaine */
      ctx.fillStyle = "#dde5ef"; ctx.fillRect(sx - 8, top, sw + 16, bot - top); ctx.fillStyle = "#f4f7fb"; ctx.fillRect(sx, top, sw, bot - top);
      for (var yy = top + 20; yy < bot; yy += 40){ ctx.fillStyle = "#c9d3df"; ctx.fillRect(sx - 8, yy, 8, 2); ctx.fillRect(sx + sw, yy, 8, 2); }
      var ch = 236, cy = top + 14 + (1 - pos) * (bot - top - ch - 28);
      ctx.strokeStyle = "#6b7685"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c.W / 2, top); ctx.lineTo(c.W / 2, cy); ctx.stroke();
      var cx = sx + 20, cw = sw - 40;
      ctx.save(); ctx.shadowColor = "rgba(15,27,45,.25)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
      P5x.rr(ctx, cx, cy, cw, ch, 6); ctx.fillStyle = P5x.lin(ctx, 0, cy, 0, cy + ch, [[0, "#fdfefe"], [1, "#e4ecf6"]]); ctx.fill(); ctx.restore();
      ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.5; P5x.rr(ctx, cx, cy, cw, ch, 6); ctx.stroke();
      ctx.fillStyle = "#13233a"; ctx.fillRect(cx, cy + ch - 12, cw, 12);
      /* balance */
      var bx = c.W / 2, by = cy + ch - 12;
      P5x.rr(ctx, bx - 38, by - 12, 76, 12, 3); ctx.fillStyle = "#9aa6b6"; ctx.fill();
      S.draw.display(c, S.fmt(N / g, 1) + " kg", cx + cw - 54, cy + 52, {w: 84, h: 44, size: 14, caption: "balance"});
      /* personne : s'écrase un peu si N > P, flotte si N = 0 */
      var lift = N === 0 ? 10 : 0, sq = Math.max(-0.08, Math.min(0.1, (N / P - 1) * 0.12));
      P5x.person(c, bx, by - 12 - lift, 92 * (1 - sq), pal.amber, {arm: 0.2});
      /* vecteurs : P et N à côté de la personne */
      var sc = 40 / P, hy = by - 112;
      P5.vec(c, bx + 46, hy, bx + 46, hy + P * sc, pal.ink, "P", {dx: 14});
      if (N > 0) P5.vec(c, bx - 46, hy, bx - 46, hy - N * sc, pal.red, "N", {dx: -14});
      /* accélération */
      if (Math.abs(A) > 0.05){ var al = Math.max(-80, Math.min(80, A * 9)); P5.vec(c, sx - 34, top + 150, sx - 34, top + 150 - al, pal.green, "a", {dx: -14}); }
      S.draw.label(c, "a = " + S.fmt(A, 1) + " m/s²", sx - 34, top + 14, {color: pal.green, size: 12});
      S.draw.label(c, "ΣF = N − P = m·a", sx + sw + 12, top + 14, {color: pal.acc, size: 12, align: "left"});
      if (N === 0) S.draw.label(c, "impondérabilité", bx, cy + 18, {color: pal.amber, size: 12});
      /* graphe N(a) */
      gr.clear();
      var ax = S.draw.axes(gr, {x0: -12, x1: 6, y0: 0, y1: m.value * (g + 6) * 1.05 / 1, xl: "a (m/s²)", yl: "N (N)", stepX: 3, l: 56});
      S.draw.fn(gr, ax, function(x){ return Math.max(0, m.value * (g + x)); }, pal.acc);
      S.draw.dot(gr, ax.X(A), ax.Y(N), 6, pal.red);
      S.draw.line(gr, ax.X(-g), ax.Y(0), ax.X(-g), ax.Y(ax.y1 * 0.3), pal.amber, 1.5, [4, 4]); S.draw.text(gr, "−g", ax.X(-g) + 4, ax.Y(ax.y1 * 0.33), {align: "left", size: 12, color: pal.amber});
      ro.set(0, S.fmt(P, 0) + " N"); ro.set(1, S.fmt(N, 0) + " N"); ro.set(2, S.fmt(N / g, 1) + " kg"); ro.set(3, S.fmt(N / P, 2));
      if (Math.abs(A + g) < 0.06) nt.set("a ≈ −g : chute libre, N ≈ 0 : la personne et la balance tombent ensemble, la balance indique ≈ 0 kg (impondérabilité).", "warn");
      else if (A < -g) nt.set("a < −g : la cabine descend plus vite qu'en chute libre ; la personne est plaquée au plafond et la balance indique 0 (N = 0 sur la balance).", "bad");
      else if (A > 0) nt.set("a > 0 (vers le haut) : la balance indique " + S.fmt(N / g, 1) + " kg, plus que " + S.fmt(m.value, 0) + " kg : la cabine monte en accélérant ou descend en freinant.", "");
      else if (A < 0) nt.set("a < 0 (vers le bas) : la balance indique " + S.fmt(N / g, 1) + " kg : la cabine monte en freinant ou descend en accélérant.", "");
      else nt.set("a = 0 : N = m·g, la balance indique la masse " + S.fmt(m.value, 0) + " kg, que la cabine soit à l'arrêt, monte ou descende à vitesse constante.", "ok");
    });
  }
});
