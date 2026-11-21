/* Chapitre 7 · Vitesse d'une réaction et catalyse */
C5.hexRGB = C5.hexRGB || function(h){ h = String(h); if (/^#[0-9a-f]{3}$/i.test(h)) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(h); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [150, 150, 150]; };
C5.mix = C5.mix || function(h, f){ var r = C5.hexRGB(h); return "rgb(" + r.map(function(v){ return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }).join(",") + ")"; };
C5.ball3 = C5.ball3 || function(ctx, x, y, r, hex, a){
  if (!(r > 0)) return; ctx.save(); if (a != null) ctx.globalAlpha = a;
  var g = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.06, x, y, r * 1.04);
  g.addColorStop(0, C5.mix(hex, 0.8)); g.addColorStop(0.45, hex); g.addColorStop(1, C5.mix(hex, -0.48));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
};
C5.profile = function(c, S, opt){   /* profil énergétique d'une réaction : dessine et renvoie la fonction */
  var pal = S.draw.palette, sm = function(x){ return x * x * (3 - 2 * x); };
  function mk(e, d){
    var peak = function(a){ var m = -1e9; for (var i = 0; i <= 100; i++){ var x = i / 100, v = d * sm(x) + a * 4 * x * (1 - x); if (v > m) m = v; } return m; };
    var lo = 0, hi = 20 * (e + Math.abs(d) + 10); for (var it = 0; it < 60; it++){ var mid = (lo + hi) / 2; if (peak(mid) < e) lo = mid; else hi = mid; }
    var A = (lo + hi) / 2; return function(x){ return d * sm(x) + A * 4 * x * (1 - x); };
  }
  return mk(opt.e, opt.d);
};

SFA.sim({
  id: "c5-c07-collisions", ch: "c07", tag: "Animation",
  titre: "Théorie des collisions : seuls les chocs assez violents réagissent",
  resume: "Particules A et B qui se heurtent dans une boîte : température, concentration, Eₐ, catalyseur.",
  but: "Lance la simulation et compte les chocs efficaces. Double le nombre de particules, puis monte la température, puis abaisse Eₐ (ou ajoute le catalyseur). Dans quel cas la réaction va-t-elle le plus vite ?",
  aRetenir: "Une réaction a lieu quand deux particules se rencontrent (choc) avec une énergie au moins égale à Eₐ (choc efficace) et une orientation convenable. Plus de particules → plus de chocs. Plus chaud → chocs plus fréquents ET plus violents → bien plus de chocs efficaces. Un catalyseur abaisse Eₐ.",
  piege: "Tous les chocs ne sont pas efficaces : la plupart rebondissent sans réaction. Et élever T de 10 K n'augmente le nombre de chocs que de 1 à 2 %, mais le nombre de chocs EFFICACES bien davantage (environ × 2 pour une réaction réelle d'Eₐ ≈ 50 kJ/mol ; avec les petites Eₐ de la simulation, l'effet est plus modeste). Simulation en 2D, sans orientation, résultats statistiques : ils varient d'un lancement à l'autre.",
  build: function(k, S){
    var pal = S.draw.palette, S300 = 45, R = 6;
    var c = k.canvas(250), g = k.canvas(150);
    var N = k.slider("Particules A et B (de chaque sorte)", 5, 40, 1, 20, "", function(){ init(); });
    var T = k.slider("Température", 250, 500, 10, 300, "K");
    var Ea = k.slider("Énergie d'activation Eₐ", 0.5, 6, 0.1, 2.5, "×kT(300 K)");
    var cat = k.toggle("Catalyseur (Eₐ − 40 %)", false);
    k.button("Relancer", function(){ init(); }, true);
    var ro = k.readouts(["Chocs A–B (5 dernières s)", "Dont efficaces", "Part efficace (mesurée)", "Part efficace théorique", "Réactifs restants"]);
    var nt = k.note("", "");
    var ps = [], hist = [], ev = [], tt = 0, prod = 0;
    function gauss(){ var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function init(){
      ps = []; hist = []; ev = []; tt = 0; prod = 0;
      var W = c.W, H = c.H;
      for (var i = 0; i < 2 * N.value; i++) ps.push({x: 20 + Math.random() * (W - 40), y: 20 + Math.random() * (H - 40), ux: gauss(), uy: gauss(), s: i < N.value ? "A" : "B", on: true});
    }
    var lp = k.loop(function(dt){
      var W = c.W, H = c.H, sc = S300 * Math.sqrt(T.value / 300), thr = Ea.value * (cat.value ? 0.6 : 1), i, j;
      var steps = 2, h = dt / steps;
      for (var st = 0; st < steps; st++){
        ps.forEach(function(p){ if (!p.on) return; p.x += p.ux * sc * h; p.y += p.uy * sc * h;
          if (p.x < R){ p.x = R; p.ux = Math.abs(p.ux); } if (p.x > W - R){ p.x = W - R; p.ux = -Math.abs(p.ux); }
          if (p.y < R){ p.y = R; p.uy = Math.abs(p.uy); } if (p.y > H - R){ p.y = H - R; p.uy = -Math.abs(p.uy); } });
        for (i = 0; i < ps.length; i++){ var a = ps[i]; if (!a.on || a.s !== "A") continue;
          for (j = 0; j < ps.length; j++){ var b = ps[j]; if (!b.on || b.s !== "B") continue;
            var dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
            if (d2 < 4 * R * R){
              var rvx = (b.ux - a.ux), rvy = (b.uy - a.uy), appr = rvx * dx + rvy * dy;
              if (appr >= 0) continue;   /* ils s'éloignent déjà */
              var dd0 = Math.sqrt(d2) || 1, vnn = Math.abs(rvx * dx + rvy * dy) / dd0, relE = vnn * vnn / 4 * (T.value / 300), eff = relE >= thr;   /* énergie le long de la ligne des centres, en unités de kT(300 K) */
              ev.push({t: tt, eff: eff});
              if (eff){ a.s = "P"; b.on = false; prod++; a.flash = 0.4; }
              else { var d = Math.sqrt(d2) || 1, nx = dx / d, ny = dy / d, vn = rvx * nx + rvy * ny; a.ux += vn * nx; a.uy += vn * ny; b.ux -= vn * nx; b.uy -= vn * ny; }
            }
          }
        }
        tt += h;
      }
      while (ev.length && ev[0].t < tt - 5) ev.shift();
      if (hist.length === 0 || tt - hist[hist.length - 1][0] >= 0.5){ hist.push([tt, ps.filter(function(p){ return p.on && p.s === "A"; }).length]); if (hist.length > 160) hist.shift(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear();
      c.ctx.strokeStyle = pal.grey; c.ctx.lineWidth = 2; c.ctx.strokeRect(1, 1, c.W - 2, c.H - 2);
      ps.forEach(function(p){ if (!p.on) return;
        C5.atom(c, p.x, p.y, R, p.s === "A" ? "#9db8ee" : p.s === "B" ? "#f2a3a3" : "#8fd0a8", "");
        if (p.flash > 0){ c.ctx.strokeStyle = pal.amber; c.ctx.lineWidth = 2; c.ctx.beginPath(); c.ctx.arc(p.x, p.y, R + 5, 0, 6.3); c.ctx.stroke(); p.flash -= 0.02; } });
      S.draw.text(c, "A", 14, 12, {size: 12, color: "#4a6fc7", align: "left"}); S.draw.text(c, "B", 30, 12, {size: 12, color: "#c44", align: "left"}); S.draw.text(c, "produit", 62, 12, {size: 12, color: pal.green, align: "left"});
      var nA = ps.filter(function(p){ return p.on && p.s === "A"; }).length, nA0 = N.value;
      var x1 = Math.max(60, tt * 1.05), ax = S.draw.axes(g, {x0: 0, x1: x1, y0: 0, y1: nA0, xl: "t (s)", l: 40, t: 20});
      S.draw.text(g, "nombre de A restants", 46, 10, {size: 12, align: "left", color: pal.grey});
      for (var i = 1; i < hist.length; i++) S.draw.line(g, ax.X(hist[i - 1][0]), ax.Y(hist[i - 1][1]), ax.X(hist[i][0]), ax.Y(hist[i][1]), pal.acc, 2.4);
      var tot = ev.length, ef = ev.filter(function(e){ return e.eff; }).length, win = Math.min(5, Math.max(tt, 0.1));
      var th = Math.exp(-Ea.value * (cat.value ? 0.6 : 1) / (T.value / 300));
      ro.set(0, S.fmt(tot / win, 1) + " /s"); ro.set(1, S.fmt(ef / win, 2) + " /s"); ro.set(2, tot ? S.fmt(ef / tot * 100, 0) + " %" : "—"); ro.set(3, S.fmt(th * 100, 1) + " %"); ro.set(4, nA + " sur " + nA0);
      nt.set(nA === 0 ? "Tous les réactifs ont réagi. Relance et change un paramètre." : "La part théorique de chocs efficaces est e^(−Eₐ/kT) : elle dépend de T et de Eₐ, pas du nombre de particules (qui ne change que la fréquence des chocs).", "");
    });
    init();
  }
});

SFA.sim({
  id: "c5-c07-effervescent", ch: "c07", tag: "Classique",
  titre: "Le comprimé effervescent : surface de contact et température",
  resume: "Coupe le comprimé en morceaux, chauffe l'eau : en combien de temps disparaît-il ?",
  but: "Deux verres côte à côte : à gauche le comprimé entier, à droite le comprimé coupé en n³ morceaux (jusqu'à la poudre), dans de l'eau à la même température. Lâche-les en même temps et compare les bulles et les chronomètres. Lis le temps de disparition. Relève le défi : moins de 5 s.",
  aRetenir: "Une réaction entre un solide et un liquide a lieu à la surface du solide : plus la surface de contact est grande (poudre, petits morceaux), plus la réaction est rapide. Couper un cube en n×n×n petits cubes multiplie la surface totale par n. La température, elle, accélère la réaction : ordre de grandeur, × 2 environ par 10 K.",
  piege: "Couper en morceaux ne change pas la quantité de gaz produit au total : seulement le temps nécessaire. La règle « × 2 pour 10 K » est empirique (vraie pour beaucoup de réactions à température ordinaire, pas une loi exacte). Le temps de référence (60 s) est une valeur choisie pour la simulation.",
  build: function(k, S){
    var pal = S.draw.palette, T0 = 60, ANIM = 9;
    var c = k.canvas(0, {ratio: 0.66}); Object.defineProperty(c, "ratio", {get: function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); return w < 460 ? 1.02 : 0.68; }, configurable: true}); c.resize();
    var g = k.canvas(190);
    var run = {s: 0, on: true}, B = [[], []], spawn = [0, 0];
    function restart(){ run.s = 0; run.on = true; B = [[], []]; }
    var n = k.slider("Coupes par arête n (n³ morceaux)", 1, 10, 1, 8, "", restart);
    var T = k.slider("Température de l'eau", 5, 80, 1, 20, "°C", restart);
    k.button("▶ Lâcher les deux comprimés", restart, true);
    var ro = k.readouts(["Nombre de morceaux n³", "Surface totale", "Facteur de température", "Temps de disparition"]);
    var nt = k.note("", "");
    var tm = 0, rnd = (function(s){ return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(31), PCS = [];
    for (var i = 0; i < 64; i++) PCS.push([rnd() * 2 - 1, rnd(), rnd()]);
    function tEnd(nn, TT){ return T0 / (nn * Math.pow(2, (TT - 20) / 10)); }
    k.loop(function(dt, t){
      tm = t; var fT = Math.pow(2, (T.value - 20) / 10), tRef = T0 / fT;
      if (run.on){ run.s += dt * tRef / ANIM; if (run.s > tRef * 1.08){ run.s = tRef * 1.08; run.on = false; } }
      /* bulles : débit ∝ vitesse de réaction (surface restante × n × facteur T), ramené à la durée de l'animation */
      [1, n.value].forEach(function(nn, gi){
        var te = tEnd(nn, T.value), p = Math.min(1, run.s / te), rate = p < 1 ? 70 * (tRef / te) * Math.pow(1 - p, 2) : 0;
        spawn[gi] += rate * dt;
        while (spawn[gi] >= 1){ spawn[gi] -= 1; if (B[gi].length < 260) B[gi].push({x: rnd() * 2 - 1, y: 0, v: 40 + rnd() * 50, r: 1 + rnd() * 2.2, ph: rnd() * 6}); }
        B[gi].forEach(function(b){ b.y += b.v * dt; b.v += 30 * dt; b.r = Math.min(4.5, b.r + dt * 1.2); });
      });
      k.redraw();
    }).play();
    function lin(x0, y0, x1, y1, st){ var gg = c.ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(function(q){ gg.addColorStop(q[0], q[1]); }); return gg; }
    function block(x, y, s){   /* morceau de comprimé en volume ; (x, y) = milieu du bas de la face avant */
      if (s < 0.6) return; var ctx = c.ctx, d = s * 0.3;
      ctx.fillStyle = "#e7dcc0"; ctx.beginPath(); ctx.moveTo(x + s / 2, y - s); ctx.lineTo(x + s / 2 + d, y - s - d * 0.7); ctx.lineTo(x + s / 2 + d, y - d * 0.7); ctx.lineTo(x + s / 2, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fffdf4"; ctx.beginPath(); ctx.moveTo(x - s / 2, y - s); ctx.lineTo(x - s / 2 + d, y - s - d * 0.7); ctx.lineTo(x + s / 2 + d, y - s - d * 0.7); ctx.lineTo(x + s / 2, y - s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = lin(x - s / 2, y - s, x + s / 2, y, [[0, "#fbf7ea"], [1, "#efe5cb"]]); ctx.fillRect(x - s / 2, y - s, s, s);
      if (s > 10){ ctx.fillStyle = "rgba(196,150,60,.35)"; for (var q = 0; q < 6; q++){ ctx.beginPath(); ctx.arc(x - s / 2 + s * ((q * 0.37 + 0.15) % 1), y - s + s * ((q * 0.61 + 0.2) % 1), 1, 0, 6.2832); ctx.fill(); } }
      ctx.strokeStyle = "rgba(170,140,80,.55)"; ctx.lineWidth = 0.8; ctx.strokeRect(x - s / 2, y - s, s, s);
    }
    k.draw(function(){
      c.clear(); g.clear();
      var W = c.W, H = c.H, ctx = c.ctx, nn = n.value, te = tEnd(nn, T.value), fT = Math.pow(2, (T.value - 20) / 10), tRef = T0 / fT, hot = (T.value - 5) / 75, phn = W < 460;
      /* décor : mur carrelé et table */
      ctx.fillStyle = lin(0, 0, 0, H, [[0, "#f3f6fa"], [1, "#e6ecf3"]]); ctx.fillRect(0, 0, W, H);
      var yT = H * 0.8, tile = Math.max(24, W / 16);
      ctx.strokeStyle = "rgba(160,175,195,.3)"; ctx.lineWidth = 1; for (var tx = 0; tx < W; tx += tile){ ctx.beginPath(); ctx.moveTo(tx + 0.5, 0); ctx.lineTo(tx + 0.5, yT); ctx.stroke(); } for (var ty = 0; ty < yT; ty += tile){ ctx.beginPath(); ctx.moveTo(0, ty + 0.5); ctx.lineTo(W, ty + 0.5); ctx.stroke(); }
      ctx.fillStyle = lin(0, yT, 0, H, [[0, "#d7dee8"], [1, "#bfc9d6"]]); ctx.fillRect(0, yT, W, H - yT); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fillRect(0, yT, W, 2);
      var wc = [Math.round(176 + 60 * hot), Math.round(216 - 20 * hot), Math.round(244 - 50 * hot)];
      var gw = Math.min(170, W * (phn ? 0.36 : 0.3)), gh = H * 0.6, gtop = yT - gh;
      [[W * 0.27, 1, "comprimé entier"], [W * 0.73, nn, nn === 1 ? "entier aussi (n = 1)" : "coupé : " + Math.pow(nn, 3) + " morceaux"]].forEach(function(G, gi){
        var cx = G[0], m = G[1], tE = tEnd(m, T.value), p = Math.min(1, run.s / tE), rem = Math.pow(1 - p, 3), x0 = cx - gw / 2, tap = gw * 0.07, bot = yT - 10, wl = gtop + gh * 0.2;
        function gp(){ ctx.beginPath(); ctx.moveTo(x0, gtop); ctx.lineTo(x0 + tap, yT); ctx.lineTo(x0 + gw - tap, yT); ctx.lineTo(x0 + gw, gtop); ctx.closePath(); }
        ctx.save(); ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.ellipse(cx + 6, yT + 4, gw * 0.55, 6, 0, 0, 6.2832); ctx.fill(); ctx.restore();
        ctx.save(); gp(); ctx.fillStyle = "rgba(230,240,250,.4)"; ctx.fill(); ctx.clip();
        ctx.fillStyle = lin(0, wl, 0, bot, [[0, "rgba(" + wc.join(",") + ",.55)"], [1, "rgba(" + wc.map(function(v){ return Math.round(v * 0.85); }).join(",") + ",.8)"]]); ctx.fillRect(x0, wl, gw, bot - wl);
        /* morceaux posés au fond */
        var side0 = gw * 0.4, ps = side0 / m * Math.pow(rem, 1 / 3), inner = gw - 2 * tap - 16;
        if (m === 1) block(cx - side0 * 0.12, bot, ps);
        else { var cnt = Math.min(64, m * m * m); for (var q = 0; q < cnt; q++){ var P = PCS[q], spread = Math.min(1, 0.25 + Math.sqrt(cnt) * 0.1); block(cx + P[0] * inner * 0.45 * spread, bot - P[1] * Math.min(14, side0 * 0.35) * (m <= 3 ? 1.6 : 0.6), ps * (0.8 + 0.4 * P[2])); }
          if (m >= 4 && rem > 0.01){ ctx.fillStyle = "rgba(245,238,215,.9)"; for (var d2 = 0; d2 < 40; d2++){ ctx.beginPath(); ctx.arc(cx + ((d2 * 0.618) % 1 * 2 - 1) * inner * 0.45, bot - 1 - ((d2 * 0.39) % 1) * 4, 1.2 * Math.pow(rem, 1 / 3), 0, 6.2832); ctx.fill(); } } }
        /* bulles de CO₂ */
        ctx.lineWidth = 1;
        B[gi] = B[gi].filter(function(b){ return bot - 6 - b.y > wl + 2; });
        B[gi].forEach(function(b){ var bx = cx + b.x * inner * 0.45 * (m === 1 ? 0.5 : 1) + Math.sin(b.ph + b.y * 0.08) * 3, by = bot - 6 - b.y;
          ctx.beginPath(); ctx.arc(bx, by, b.r, 0, 6.2832); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fill(); ctx.strokeStyle = "rgba(70,120,190,.55)"; ctx.stroke(); });
        /* mousse en surface, proportionnelle au débit de bulles */
        var foam = Math.min(1, B[gi].length / 140);
        if (foam > 0.02){ ctx.fillStyle = "rgba(255,255,255,.9)"; for (var f2 = 0; f2 < 26; f2++){ var fx = x0 + 6 + f2 / 25 * (gw - 12), fr = (2 + 4 * foam) * (0.7 + 0.5 * Math.sin(f2 * 2.1 + tm * 4)); ctx.beginPath(); ctx.arc(fx, wl + 1 - fr * 0.3, fr, 0, 6.2832); ctx.fill(); } }
        ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(x0, wl, gw, 2);
        ctx.restore();
        /* gouttelettes qui sautent au-dessus du verre */
        for (var sp = 0; sp < Math.round(14 * foam); sp++){ var ph = (tm * 1.6 + sp * 0.29) % 1, sx = cx + ((sp * 0.618) % 1 * 2 - 1) * gw * 0.38; ctx.fillStyle = "rgba(120,170,220," + (0.7 * (1 - ph)) + ")"; ctx.beginPath(); ctx.arc(sx, wl - 4 - Math.sin(ph * Math.PI) * 18, 1.4, 0, 6.2832); ctx.fill(); }
        /* verre */
        ctx.save(); ctx.strokeStyle = "rgba(81,98,122,.75)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, gtop); ctx.lineTo(x0 + tap, yT); ctx.lineTo(x0 + gw - tap, yT); ctx.lineTo(x0 + gw, gtop); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, gtop, gw / 2, 6, 0, 0, 6.2832); ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 + 9, gtop + 14); ctx.lineTo(x0 + 9 + tap * 0.8, yT - 14); ctx.stroke(); ctx.restore();
        S.draw.label(c, G[2], cx, gtop - 18, {color: gi ? pal.acc : pal.ink, size: phn ? 11 : 12.5});
        var done = run.s >= tE, shown = Math.min(run.s, tE);
        S.draw.display(c, S.fmt(shown, shown < 10 ? 1 : 0) + " s", cx, yT + (H - yT) / 2 + 2, {w: phn ? 78 : 96, h: Math.min(40, (H - yT) - 8), caption: done ? "DISSOUS" : "CHRONOMÈTRE", size: phn ? 14 : 17, screen: done ? "#dff3e6" : "#e8f3ec", color: done ? pal.green : "#13233a"});
      });
      S.draw.label(c, "eau à " + T.value + " °C", W / 2, phn ? 32 : gtop + gh * 0.35, {color: hot > 0.4 ? pal.red : pal.acc, size: 12});
      S.draw.text(c, "animation accélérée : " + ANIM + " s ↔ " + S.fmt(tRef, tRef < 10 ? 1 : 0) + " s réelles", W / 2, 12, {size: 11.5, color: pal.grey, halo: true});
      var xmax = 70, ax = S.draw.axes(g, {x0: 0, x1: xmax, y0: 0, y1: 1, xl: "t (s)", yl: "masse restante", stepX: 10, stepY: 0.25, l: 52});
      S.draw.fn(g, ax, function(t){ return Math.pow(Math.max(0, 1 - t / T0), 3); }, pal.grey, 1.8, [5, 4]);
      if (T.value !== 20) S.draw.fn(g, ax, function(t){ return Math.pow(Math.max(0, 1 - t / tRef), 3); }, pal.amber, 2);
      S.draw.fn(g, ax, function(t){ return Math.pow(Math.max(0, 1 - t / te), 3); }, pal.acc, 2.8);
      S.draw.text(g, "pointillés : n = 1, 20 °C (60 s)" + (T.value !== 20 ? " · orange : entier à " + T.value + " °C" : ""), ax.X(xmax) - 4, ax.Y(0.8), {size: 11.5, color: pal.grey, align: "right", halo: true});
      if (te <= xmax) S.draw.dot(g, ax.X(te), ax.Y(0), 6, pal.red); else S.draw.text(g, "disparition après " + xmax + " s (hors graphe)", ax.X(xmax) - 4, ax.Y(0.5), {size: 12, color: pal.red, align: "right"});
      var pc = Math.min(1, run.s / te);
      S.draw.dot(g, ax.X(Math.min(pc * te, xmax)), ax.Y(Math.pow(1 - pc, 3)), 5, pal.amber);
      ro.set(0, Math.pow(nn, 3)); ro.set(1, "× " + nn); ro.set(2, "× " + S.fmt(fT, 2)); ro.set(3, S.fmt(te, te < 10 ? 2 : 1) + " s");
      nt.set(te <= 5 ? "Défi réussi : moins de 5 s. Surface ×" + nn + " et température ×" + S.fmt(fT, 1) + " se multiplient." : "Défi : fais descendre le temps sous 5 s (agis sur n ET sur T).", te <= 5 ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c07-profil-catalyseur", ch: "c07", tag: "Graphe",
  titre: "Profil énergétique : ce que fait (et ne fait pas) un catalyseur",
  resume: "Le catalyseur abaisse la barrière sans changer ΔH. Combien de fois plus vite ?",
  but: "Regarde les molécules tenter de franchir la colline d'énergie : seules celles qui ont assez d'énergie passent. Règle Eₐ, ΔH et la température. Active le catalyseur et abaisse la barrière : compte les passages sur chaque chemin. Compare le facteur d'accélération et vérifie que les niveaux des réactifs et produits n'ont pas bougé.",
  aRetenir: "Un catalyseur offre un autre chemin réactionnel avec une Eₐ plus basse : la réaction va plus vite, dans les deux sens. Il n'est pas consommé, ne change ni ΔH ni les quantités finales. Facteur d'accélération : k_cat/k = e^((Eₐ − Eₐ')/RT).",
  piege: "Le catalyseur ne « donne pas d'énergie » et ne rend pas la réaction plus exothermique : ΔH est identique. Il ne change pas non plus le rendement final. Et une petite baisse de Eₐ a un effet énorme (exponentielle). R = 8,31 J/(mol·K), valeurs arrondies. L'animation est qualitative : les énergies des molécules y sont exagérées (×8) pour qu'on voie des passages ; les vraies proportions sont dans les cadres chiffrés.",
  build: function(k, S){
    var pal = S.draw.palette, R = 8.31, FX = 8;
    var c = k.canvas(0, {ratio: 0.66}); Object.defineProperty(c, "ratio", {get: function(){ var w = Math.max(260, c.cv.parentNode ? c.cv.parentNode.clientWidth : 600); return w < 460 ? 0.98 : 0.68; }, configurable: true}); c.resize();
    var Ea = k.slider("Eₐ sans catalyseur", 30, 150, 5, 80, "kJ/mol");
    var dH = k.slider("ΔH", -100, 60, 5, -40, "kJ/mol");
    var T = k.slider("Température", 250, 600, 10, 300, "K");
    var cat = k.toggle("Ajouter un catalyseur", true);
    var dEa = k.slider("Abaissement de Eₐ par le catalyseur", 0, 100, 5, 30, "kJ/mol");
    k.button("↺ Remettre les compteurs à zéro", function(){ cnt = [0, 0]; t0 = tm; }, true);
    var ro = k.readouts(["Eₐ directe", "Eₐ avec catalyseur", "Part de chocs efficaces e^(−Eₐ/RT)", "Facteur d'accélération", "Pour comparaison : +10 K donne"]);
    var nt = k.note("", "");
    var rnd = (function(s){ return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })(41);
    var tm = 0, t0 = 0, cnt = [0, 0], pf = {key: ""}, M = [[], []];
    for (var L = 0; L < 2; L++) for (var i = 0; i < 8; i++) M[L].push({h: 0.03 + (i % 4) * 0.042, row: Math.floor(i / 4), x: 0.03 + (i % 4) * 0.042, dir: 0, E: 0, wait: rnd() * 2, st: "well", sp: rnd() * 6, ph: rnd() * 6});
    function prof(e, d){ var key = e + "|" + d; if (pf[key]) return pf[key]; var f0 = C5.profile(c, S, {e: e, d: d}), f = function(x){ return f0(Math.max(0, Math.min(1, (x - 0.2) / 0.6))); }, xp = 0.5, mv = -1e9; for (var q = 0; q <= 200; q++){ var v = f(q / 200); if (v > mv){ mv = v; xp = q / 200; } } pf[key] = {f: f, xp: xp}; return pf[key]; }
    function params(){ var e = Math.max(Ea.value, Math.max(0, dH.value) + 10), d = dH.value, dd = cat.value ? Math.min(dEa.value, e - Math.max(0, d) - 5) : 0; return {e: e, d: d, dd: dd, e2: e - dd}; }
    k.loop(function(dt, t){
      tm = t; var P = params(), kTa = FX * R * T.value / 1000, lanes = [prof(P.e, P.d), P.dd > 0 ? prof(P.e2, P.d) : null];
      lanes.forEach(function(Lp, li){ if (!Lp) return;
        M[li].forEach(function(m){
          m.sp += dt * 2.5;
          if (m.st === "well"){ m.wait -= dt; m.x = m.h; if (m.wait <= 0){ m.st = "go"; m.dir = 1; m.E = -kTa * Math.log(1 - rnd() * 0.999999); } }
          else if (m.st === "prod"){ m.wait -= dt; m.x = 1 - m.h; if (m.wait <= 0){ m.st = "well"; m.x = m.h; m.wait = 0.2 + rnd() * 0.6; } }
          else {
            var ke = m.E - Lp.f(m.x), v = 0.14 + 0.55 * Math.sqrt(Math.max(0, ke) / Math.max(10, P.e));
            m.x += m.dir * v * dt;
            if (m.dir > 0 && m.x < Lp.xp && Lp.f(m.x) >= m.E){ m.dir = -1; }
            if (m.dir > 0 && m.x >= 1 - m.h){ m.st = "prod"; m.wait = 1.2 + rnd() * 1.2; cnt[li]++; }
            if (m.dir < 0 && m.x <= m.h){ m.st = "well"; m.wait = 0.15 + rnd() * 0.5; }
          }
        });
      });
      k.redraw();
    }).play();
    function mol(ctx, x, y, r, prod, ring, sp){   /* petite molécule en volume : réactif (bleu + blanc) ou produit (vert + jaune) */
      var dx = Math.cos(sp) * r * 0.9, dy = Math.sin(sp) * r * 0.35;
      var a = [[x - dx, y - dy], [x + dx, y + dy]], cols = prod ? ["#3fb878", "#f4c542"] : ["#4f7be0", "#eef1f6"];
      if (dy > 0) a.reverse(), cols.reverse();
      ctx.save(); ctx.fillStyle = "rgba(15,27,45,.12)"; ctx.beginPath(); ctx.ellipse(x, y + r * 1.05, r * 1.4, r * 0.3, 0, 0, 6.2832); ctx.fill(); ctx.restore();
      C5.ball3(ctx, a[0][0], a[0][1], r * 0.85, cols[0]); C5.ball3(ctx, a[1][0], a[1][1], r * 0.85, cols[1]);
      if (ring){ ctx.save(); ctx.strokeStyle = ring; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, r * 1.75, 0, 6.2832); ctx.stroke(); ctx.restore(); }
    }
    k.draw(function(){
      var Pm = params(), e = Pm.e, d = Pm.d, dd = Pm.dd, e2 = Pm.e2, ctx = c.ctx, W = c.W, H = c.H; c.clear();
      var bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#f2f6fc"); bg.addColorStop(1, "#ffffff"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      var lo = Math.min(0, d) - 20, hi = e + 30;
      var ax = S.draw.axes(c, {x0: 0, x1: 1, y0: lo, y1: hi, yl: "H (kJ/mol)", stepX: 5, l: 54, b: 24, t: W < 460 ? 58 : 40});
      var A = prof(e, d), Bc = dd > 0 ? prof(e2, d) : null;
      /* colline d'énergie : aire sous la courbe */
      S.draw.area(c, ax, A.f, 0, 1, "#7d9fd8", 0.2, lo);
      if (Bc) S.draw.area(c, ax, Bc.f, 0, 1, "#3fb878", 0.16, lo);
      S.draw.fn(c, ax, A.f, pal.acc, 3.2);
      if (Bc) S.draw.fn(c, ax, Bc.f, pal.green, 3, [7, 5]);
      S.draw.line(c, ax.X(0), ax.Y(0), ax.X(0.45), ax.Y(0), pal.grey, 1.5, [4, 3]); S.draw.line(c, ax.X(0.55), ax.Y(d), ax.X(1), ax.Y(d), pal.grey, 1.5, [4, 3]);
      S.draw.text(c, "réactifs", ax.X(0.02), ax.Y(0) + 16, {size: 12, align: "left", color: pal.grey, halo: true}); S.draw.text(c, "produits", ax.X(0.98), ax.Y(d) + (d >= 0 ? -14 : 16), {size: 12, align: "right", color: pal.grey, halo: true});
      var xa = A.xp - 0.04; S.draw.arrow(c, ax.X(xa), ax.Y(0), ax.X(xa), ax.Y(e), pal.acc, 2.4); S.draw.text(c, "Eₐ = " + e, ax.X(xa) - 6, ax.Y(e * 0.6), {size: 12, color: pal.acc, align: "right", halo: true});
      if (dd > 0){ var xb = Bc.xp + 0.04; S.draw.arrow(c, ax.X(xb), ax.Y(0), ax.X(xb), ax.Y(e2), pal.green, 2.4); S.draw.text(c, "Eₐ' = " + e2, ax.X(xb) + 6, ax.Y(e2 * 0.45), {size: 12, color: pal.green, align: "left", halo: true}); }
      /* molécules qui tentent de franchir la barrière */
      var rr = Math.max(5, Math.min(8, W / 70));
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, 0, ax.R - ax.L, H); ctx.clip();
      [[A, 0, null], [Bc, 1, pal.green]].forEach(function(q){ if (!q[0]) return; M[q[1]].forEach(function(m, j){
        var x = ax.X(m.x), y = ax.Y(q[0].f(m.x)) - rr * 1.1;
        if (m.st === "well" || m.st === "prod") y -= Math.abs(Math.sin(tm * 4 + m.ph)) * rr * 0.4 + m.row * rr * 2 + (q[1] ? rr * 4.2 : 0);
        mol(ctx, x, y, rr, m.st === "prod" || (m.st === "go" && m.x > q[0].xp), q[2], m.sp + j);
        if (m.st === "go" && m.dir > 0){ var yE = ax.Y(m.E); if (yE > ax.T){ ctx.save(); ctx.strokeStyle = q[1] ? "rgba(36,119,90,.45)" : "rgba(31,75,158,.4)"; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x - 10, yE); ctx.lineTo(x + 10, yE); ctx.stroke(); ctx.restore(); } }
      }); });
      ctx.restore();
      var dur = Math.max(1, tm - t0);
      S.draw.label(c, "sans catalyseur : " + cnt[0] + " passage" + (cnt[0] > 1 ? "s" : ""), 60, 14, {color: pal.acc, align: "left", size: 12});
      var phn = W < 460; if (dd > 0) S.draw.label(c, "avec catalyseur : " + cnt[1] + " passage" + (cnt[1] > 1 ? "s" : ""), phn ? 60 : W - 10, phn ? 36 : 14, {color: pal.green, align: phn ? "left" : "right", size: 12});
      S.draw.text(c, phn ? "animation qualitative (énergies ×" + FX + ")" : "animation qualitative · énergies exagérées ×" + FX + " · tiret = énergie de la molécule", W - 10, H - 8, {size: 10, color: pal.grey, align: "right", halo: true});
      var frac = Math.exp(-(cat.value ? e2 : e) * 1000 / (R * T.value)), acc = dd > 0 ? Math.exp(dd * 1000 / (R * T.value)) : 1, f10 = Math.exp(e * 1000 / R * (1 / T.value - 1 / (T.value + 10)));
      ro.set(0, e + " kJ/mol"); ro.set(1, dd > 0 ? e2 + " kJ/mol" : "—"); ro.set(2, S.sci(frac)); ro.set(3, dd > 0 ? "× " + S.sci(acc) : "× 1 (pas de catalyseur)"); ro.set(4, "× " + S.fmt(f10, 2) + " (sans catalyseur)");
      var clampTxt = (cat.value && dEa.value > dd ? " Abaissement limité à " + dd + " kJ/mol : la barrière doit rester au-dessus des niveaux des réactifs et des produits." : "") + (e !== Ea.value ? " Eₐ relevée à " + e + " kJ/mol : elle ne peut pas être inférieure à ΔH + 10." : "");
      nt.set((dd > 0 ? "ΔH reste " + d + " kJ/mol : le catalyseur ne change que la hauteur de la barrière (vitesse), pas l'écart entre réactifs et produits." : "Sans catalyseur : seul un chauffage (ou plus de concentration) accélère la réaction.") + clampTxt, clampTxt ? "warn" : dd > 0 ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c07-horloge-iode", ch: "c07", tag: "Niche utile",
  titre: "L'horloge à iode : le virage qui arrive d'un coup",
  resume: "Un mélange incolore devient bleu-noir soudainement : le délai dépend de la vitesse.",
  but: "Choisis les concentrations et la température, lance l'horloge et attends le virage. Double [I⁻] : le délai est-il divisé par 2 ? Relève le défi : un virage en 30 s (± 3 s).",
  aRetenir: "S₂O₈²⁻ + 2 I⁻ → 2 SO₄²⁻ + I₂ produit I₂ à vitesse v = k[S₂O₈²⁻][I⁻]. Tant qu'il reste du thiosulfate, I₂ est détruit aussitôt : rien ne se voit. Quand tout le thiosulfate est consommé, I₂ s'accumule et colore l'amidon. Délai t = [S₂O₃²⁻] / (2v) : il est inversement proportionnel à la vitesse.",
  piege: "L'instant du virage n'est pas la fin de la réaction : celle-ci a commencé dès le premier instant, mais elle était « cachée » par le thiosulfate. Le modèle suppose une vitesse constante pendant le délai et une règle « × 2 par 10 K » pour k (k(25 °C) = 5·10⁻³ L/(mol·s), valeur de la simulation).",
  build: function(k, S){
    var pal = S.draw.palette, K25 = 5e-3;
    var c = k.canvas(320), g = k.canvas(190);
    var s2 = k.slider("[S₂O₈²⁻] dans le mélange", 0.02, 0.10, 0.01, 0.04, "mol/L");
    var iod = k.slider("[I⁻] dans le mélange", 0.02, 0.20, 0.01, 0.08, "mol/L");
    var thio = k.slider("[S₂O₃²⁻] (thiosulfate)", 0.001, 0.005, 0.001, 0.002, "mol/L");
    var T = k.slider("Température", 5, 50, 1, 25, "°C");
    var clk = 0, running = false, defi = false, tm = 0;
    k.button("Lancer l'horloge", function(){ clk = 0; running = true; }, true);
    k.button("Défi : virage à 30 s", function(){ s2.set(0.04); iod.set(0.08); thio.set(0.001); T.set(25); defi = true; clk = 0; running = true; });
    var ro = k.readouts(["Vitesse de formation de I₂", "Délai avant virage", "Horloge"]);
    var nt = k.note("", "");
    function par(){ var kk = K25 * Math.pow(2, (T.value - 25) / 10), v = kk * s2.value * iod.value, td = thio.value / (2 * v); return {k: kk, v: v, td: td}; }
    k.loop(function(dt, t){ tm = t; if (running){ var P = par(); clk += dt * Math.max(1, P.td / 8); if (clk > P.td * 1.5){ running = false; clk = P.td * 1.5; } } k.redraw(); }).play();
    k.draw(function(){
      var P = par(), td = P.td; c.clear(); g.clear();
      var blue = clk >= td, ctx = c.ctx, fx = c.W * 0.32, by = 250, inten = blue ? Math.min(1, (clk - td) / (td * 0.35) + 0.3) : 0;
      C5.bench(c, by + 16);
      /* plaque agitatrice + barreau aimanté qui tourne */
      S.draw.rrect(c, fx - 78, by + 2, 156, 14, 5); ctx.fillStyle = "#3a4558"; ctx.fill();
      /* erlenmeyer */
      var neck = 17, top = 24, sh = 96, wid = 72;
      ctx.save(); ctx.beginPath(); ctx.moveTo(fx - neck, top); ctx.lineTo(fx - neck, sh - 10); ctx.lineTo(fx - wid, by); ctx.lineTo(fx + wid, by); ctx.lineTo(fx + neck, sh - 10); ctx.lineTo(fx + neck, top);
      ctx.fillStyle = "rgba(230,240,250,.4)"; ctx.fill(); ctx.clip();
      var lvl = 130, gl = ctx.createLinearGradient(0, lvl, 0, by);
      var cc = function(a){ return "rgba(" + Math.round(244 - 222 * inten) + "," + Math.round(238 - 208 * inten) + "," + Math.round(196 - 114 * inten) + "," + a + ")"; };
      gl.addColorStop(0, cc(0.8)); gl.addColorStop(1, cc(0.95)); ctx.fillStyle = gl; ctx.fillRect(fx - wid, lvl, wid * 2, by - lvl);
      if (running || blue){ ctx.strokeStyle = "rgba(255,255,255," + (0.25 + 0.2 * (1 - inten)) + ")"; ctx.lineWidth = 2; for (var s = 0; s < 3; s++){ ctx.beginPath(); ctx.arc(fx, by - 28, 14 + s * 14, tm * 2 + s, tm * 2 + s + 3); ctx.stroke(); } }
      ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillRect(fx - wid, lvl, wid * 2, 2.5);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = "#51627a"; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(fx - neck - 4, top); ctx.lineTo(fx - neck, top); ctx.lineTo(fx - neck, sh - 10); ctx.lineTo(fx - wid, by); ctx.lineTo(fx + wid, by); ctx.lineTo(fx + neck, sh - 10); ctx.lineTo(fx + neck, top); ctx.lineTo(fx + neck + 4, top); ctx.stroke();
      ctx.restore();
      var ba = (running ? tm * 10 : 0), bxl = Math.cos(ba) * 22; ctx.strokeStyle = "#f4f6fa"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(fx - bxl, by - 6); ctx.lineTo(fx + bxl, by - 6); ctx.stroke();
      S.draw.label(c, blue ? "bleu-noir !" : clk > 0 ? "incolore…" : "prêt", fx, 12, {color: blue ? pal.acc : pal.grey, size: 13});
      /* panneau : chrono et réserve de thiosulfate */
      var px = c.W * 0.32 + wid + 14, pw = c.W - px - 10, tleft = Math.max(0, Math.min(1, 1 - 2 * P.v * clk / thio.value));
      S.draw.panel(c, px, 20, pw, 214, {title: "Dans le flacon", shadow: false});
      S.draw.display(c, S.fmt(clk, 0) + " s", px + pw / 2, 74, {w: Math.min(110, pw - 16), h: 46, caption: "chronomètre", size: 20});
      var gx = px + 14, gy = 112, gh = 104, gw = (pw - 36) / 2 - 4;
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(gx, gy, gw, gh); ctx.fillStyle = "#4f7be0"; ctx.fillRect(gx, gy + gh * (1 - tleft), gw, gh * tleft);
      var I2 = Math.max(0, P.v * clk - thio.value / 2), I2max = Math.max(1e-9, P.v * P.td * 1.5 - thio.value / 2), fI = Math.min(1, I2 / I2max);
      ctx.fillStyle = "#e3e7ed"; ctx.fillRect(gx + gw + 8, gy, gw, gh); ctx.fillStyle = "#1c1c4a"; ctx.fillRect(gx + gw + 8, gy + gh * (1 - fI), gw, gh * fI);
      S.draw.text(c, "S₂O₃²⁻", gx + gw / 2, gy + gh + 12, {size: 11, color: pal.grey}); S.draw.text(c, "I₂ libre", gx + gw * 1.5 + 8, gy + gh + 12, {size: 11, color: pal.grey});
      var xmax = td * 1.6, ax = S.draw.axes(g, {x0: 0, x1: xmax, y0: 0, y1: P.v * td * 1.6 * 1000 + 1e-9, xl: "t (s)", l: 50});
      S.draw.text(g, "[I₂] en mmol/L", 54, 10, {size: 12, align: "left", color: pal.grey});
      S.draw.fn(g, ax, function(t){ return P.v * t * 1000; }, pal.grey, 1.8, [5, 4]);
      S.draw.fn(g, ax, function(t){ return Math.max(0, P.v * t - thio.value / 2) * 1000; }, pal.acc, 3);
      S.draw.line(g, ax.X(td), ax.T, ax.X(td), ax.B, pal.red, 1.5, [4, 4]); S.draw.text(g, "virage", ax.X(td) + 4, ax.B - 12, {size: 12, color: pal.red, align: "left"});
      if (clk > 0) S.draw.dot(g, ax.X(Math.min(clk, xmax)), ax.Y(P.v * Math.min(clk, xmax) * 1000), 5, pal.amber);
      S.draw.text(g, "I₂ formé (total)", ax.X(xmax) - 4, ax.Y(P.v * xmax * 1000) + 12, {size: 12, color: pal.grey, align: "right"}); S.draw.text(g, "I₂ libre", ax.X(xmax) - 4, ax.Y(Math.max(0, P.v * xmax - thio.value / 2) * 1000) + 24, {size: 12, color: pal.acc, align: "right"});
      ro.set(0, S.sci(P.v) + " mol/(L·s)"); ro.set(1, S.fmt(td, td < 10 ? 1 : 0) + " s"); ro.set(2, running ? "en cours (accéléré)" : blue ? "terminé" : "non lancée");
      var okd = Math.abs(td - 30) <= 3;
      nt.set(defi ? (okd ? "Défi réussi : délai = " + S.fmt(td, 1) + " s." : "Défi : ajuste les concentrations pour un délai de 30 s ± 3 s (actuellement " + S.fmt(td, 1) + " s). Pense : délai ∝ [S₂O₃²⁻] / ([S₂O₈²⁻][I⁻]).") : "Si [I⁻] ou [S₂O₈²⁻] double, la vitesse double et le délai est divisé par 2 ; plus de thiosulfate retarde le virage.", okd && defi ? "ok" : "");
    });
  }
});
