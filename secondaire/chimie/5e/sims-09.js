/* Chapitre 9 · Déplacement d'un équilibre : principe de Le Chatelier */
/* équilibre gazeux : espèces {nu, n0} ; renvoie l'avancement ξ à l'équilibre pour K_p et P_totale */
C5.eqGas = function(nu, n0, Kp, P){
  var lo = 1e-12, hi = 1 - 1e-12, x, i, j;
  for (i = 0; i < 120; i++){
    x = (lo + hi) / 2; var n = [], tot = 0;
    for (j = 0; j < nu.length; j++){ n.push(n0[j] + nu[j] * x); tot += n[j]; }
    var f = -Math.log(Kp);
    for (j = 0; j < nu.length; j++) f += nu[j] * Math.log(P * n[j] / tot);
    if (f < 0) lo = x; else hi = x;
  }
  return (lo + hi) / 2;
};
C5.RX = {
  no2: {n: "N₂O₄ ⇌ 2 NO₂", nu: [-1, 2], n0: [1, 0], dH: 57200, Kref: 0.148, Tref: 298, Tmin: 0, Tmax: 100, T0: 25, Pmin: 0.2, Pmax: 5, Pstep: 0.1, P0: 1, nameP: "NO₂", idx: 1, dn: 1,
        ylab: "taux de dissociation α (%)", Pref: [0.5, 1, 2]},
  nh3: {n: "N₂ + 3 H₂ ⇌ 2 NH₃ (Haber-Bosch)", nu: [-1, -3, 2], n0: [1, 3, 0], dH: -105000, Kref: 1.45e-5, Tref: 773, Tmin: 300, Tmax: 700, T0: 450, Pmin: 1, Pmax: 400, Pstep: 1, P0: 200, nameP: "NH₃", idx: 2, dn: -2,
        ylab: "conversion de N₂ (%)", Pref: [1, 100, 300]},
  hi: {n: "H₂ + I₂ ⇌ 2 HI", nu: [-1, -1, 2], n0: [1, 1, 0], dH: -9400, Kref: 50, Tref: 721, Tmin: 300, Tmax: 500, T0: 450, Pmin: 1, Pmax: 20, Pstep: 1, P0: 1, nameP: "HI", idx: 2, dn: 0,
        ylab: "conversion de H₂ (%)", Pref: [1, 5, 20]}
};
C5.Kp = function(r, tC){ return r.Kref * Math.exp(-r.dH / 8.31 * (1 / (tC + 273) - 1 / r.Tref)); };

SFA.sim({
  id: "c5-c09-perturbation", ch: "c09", tag: "Animation",
  titre: "Perturber un équilibre : le système réagit",
  resume: "À l'équilibre H₂ + I₂ ⇌ 2 HI, ajoute ou retire une espèce et regarde les courbes se réajuster.",
  but: "Le mélange est à l'équilibre. Ajoute un réactif, puis un produit, retire du HI, puis active le catalyseur. Pour chaque action, prévois le sens avant de regarder la courbe.",
  aRetenir: "Principe de Le Chatelier : quand on perturbe un système à l'équilibre, il évolue dans le sens qui s'oppose à la perturbation. Ajout d'un réactif ou retrait d'un produit : déplacement vers la droite. Ajout d'un produit ou retrait d'un réactif : vers la gauche. Après la perturbation Q ≠ K, puis Q rejoint K.",
  piege: "Un catalyseur ne déplace pas l'équilibre : il accélère seulement l'arrivée à l'équilibre (essaie !). Et « déplacé vers la droite » ne veut pas dire que K a changé : à température constante K reste égal à 50 ; c'est Q qui a bougé. Les vitesses de la simulation sont arbitraires.",
  build: function(k, S){
    var pal = S.draw.palette, K = 50;
    var c = k.canvas(390);
    var dose = k.slider("Quantité ajoutée ou retirée", 0.1, 1, 0.1, 0.5, "mol/L");
    var cat = k.toggle("Catalyseur (réactions 20 fois plus rapides)", false);
    var st, hist, tt, marks, fly = [], tm = 0;
    function eq(){ var x = C5.solveX([{nu: -1, c0: 1}, {nu: -1, c0: 1}, {nu: 2, c0: 0}], K); return [1 - x, 1 - x, 2 * x]; }
    function reset(){ st = eq(); tt = 8; hist = []; for (var q = 0; q <= 8; q += 0.5) hist.push([q, st[0], st[1], st[2]]); marks = []; fly = []; }
    function add(i, d, lab){ if (d < 0 && st[i] <= 0.001) return; st[i] = Math.max(0, st[i] + d); marks.push([tt, lab]); fly.push({sp: i, dir: d > 0 ? 1 : -1, t: 0}); }
    k.button("+ H₂", function(){ add(0, dose.value, "+H₂"); }, true); k.button("+ I₂", function(){ add(1, dose.value, "+I₂"); }); k.button("+ HI", function(){ add(2, dose.value, "+HI"); });
    k.button("− HI", function(){ add(2, -dose.value, "−HI"); }); k.button("− H₂", function(){ add(0, -dose.value, "−H₂"); }); k.button("Tout remettre à l'équilibre", function(){ reset(); });
    var ro = k.readouts(["Q", "K", "Sens d'évolution", "[H₂]", "[I₂]", "[HI]"]);
    var nt = k.note("", "");
    reset();
    k.loop(function(dt, t){
      tm = t;
      var kf = 0.5 * (cat.value ? 20 : 1), h = 0.002, n = Math.round(Math.min(dt, 0.05) / h);
      for (var i = 0; i < n; i++){ var r = kf * st[0] * st[1] - (kf / K) * st[2] * st[2]; st[0] = Math.max(0, st[0] - r * h); st[1] = Math.max(0, st[1] - r * h); st[2] += 2 * r * h; tt += h; }
      if (tt - hist[hist.length - 1][0] >= 0.1){ hist.push([tt, st[0], st[1], st[2]]); if (hist.length > 700) hist.shift(); }
      fly.forEach(function(f){ f.t += dt; }); fly = fly.filter(function(f){ return f.t < 0.9; });
      k.redraw();
    }).play();
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      var sc = 16, bw = Math.min(250, c.W * 0.55), bh = 140, bx = 10, by = 8;
      C5.gasbox(c, bx, by, bw, bh, [
        {n: Math.min(60, st[0] * sc), mol: [[-3.5, 0, 3.6, C5.CPK.H], [3.5, 0, 3.6, C5.CPK.H]]},
        {n: Math.min(60, st[1] * sc), mol: [[-6, 0, 6, "#8a5cc4"], [6, 0, 6, "#8a5cc4"]]},
        {n: Math.min(80, st[2] * sc), mol: [[-4, 0, 3.6, C5.CPK.H], [5, 0, 6, "#8a5cc4"]]}
      ], tm);
      var SPC = [C5.CPK.H, "#8a5cc4", pal.red];
      fly.forEach(function(f){ for (var q = 0; q < 5; q++){ var u = f.t / 0.9, x = bx + 24 + (q * 0.21 + f.sp * 0.3) % 1 * (bw - 48), y = f.dir > 0 ? by - 12 + u * 60 : by + 50 - u * 60; ctx.globalAlpha = 1 - u * 0.7; C5.atom(c, x, y, 5, SPC[f.sp], ""); ctx.globalAlpha = 1; } });
      if (cat.value) S.draw.label(c, "catalyseur", bx + bw - 44, by + bh - 14, {color: pal.violet, size: 11.5});
      var Q = st[2] * st[2] / Math.max(st[0] * st[1], 1e-12), rel = Q / K;
      /* Q/K à droite de l'enceinte */
      var rx = bx + bw + 14, rw = c.W - rx - 8;
      S.draw.panel(c, rx, by, rw, bh, {shadow: false, title: "Q comparé à K"});
      var sens = Math.abs(rel - 1) < 0.01 ? "équilibre" : rel < 1 ? "→ droite" : "← gauche";
      S.draw.display(c, st[0] * st[1] < 1e-9 ? "∞" : S.fmt(Q, Q < 10 ? 2 : 1), rx + rw / 2, by + 60, {w: Math.min(100, rw - 14), h: 46, caption: "Q (K = 50)", size: 19, color: Math.abs(rel - 1) < 0.01 ? "#1e7a46" : "#a02b1c"});
      S.draw.label(c, sens, rx + rw / 2, by + 112, {color: Math.abs(rel - 1) < 0.01 ? pal.green : rel < 1 ? pal.green : pal.amber, size: 13});
      [["#b9c3d1", "H₂ (2 blanches)"], ["#8a5cc4", "I₂ (2 violettes)"], [pal.red, "HI (1 + 1)"]].forEach(function(l, i){ var xx = 10 + i * Math.max(100, (c.W - 20) / 3); S.draw.dot(c, xx + 5, by + bh + 14, 5, l[0]); S.draw.text(c, l[1], xx + 14, by + bh + 14, {size: 11, color: pal.grey, align: "left"}); });
      var ty = by + bh + 44, tmax = Math.max(20, tt + 2), t0 = Math.max(0, tmax - 60), top = Math.max(2, st[0], st[1], st[2]) * 1.1;
      var ax = S.draw.axes(c, {x0: t0, x1: t0 + Math.max(20, tmax - t0), y0: 0, y1: top, xl: "t (s)", l: 40, t: ty, b: 34});
      S.draw.text(c, "concentrations (mol/L)", 46, ty - 8, {size: 12, align: "left", color: pal.grey});
      var cols = [pal.acc, pal.violet, pal.red], lab = ["H₂", "I₂", "HI"];
      for (var s = 0; s < 3; s++){ for (var i = 1; i < hist.length; i++){ if (hist[i][0] < t0) continue; S.draw.line(c, ax.X(hist[i - 1][0]), ax.Y(hist[i - 1][s + 1]), ax.X(hist[i][0]), ax.Y(hist[i][s + 1]), cols[s], s === 1 ? 1.6 : 2.4, s === 1 ? [4, 3] : null); } S.draw.text(c, lab[s], ax.X(ax.x1) - 4, ax.Y(st[s]) - 8, {size: 12, color: cols[s], align: "right"}); }
      marks.forEach(function(m){ if (m[0] >= t0){ S.draw.line(c, ax.X(m[0]), ax.T, ax.X(m[0]), ax.B, pal.grey, 1, [3, 3]); S.draw.text(c, m[1], ax.X(m[0]) + 3, ax.T + 10, {size: 12, color: pal.grey, align: "left"}); } });
      ro.set(0, st[0] * st[1] < 1e-9 ? "→ ∞ (H₂ ou I₂ épuisé)" : S.fmt(Q, Q < 10 ? 2 : 1)); ro.set(1, "50"); ro.set(2, Math.abs(rel - 1) < 0.01 ? "équilibre atteint" : rel < 1 ? "vers la droite" : "vers la gauche");
      ro.set(3, S.fmt(st[0], 3)); ro.set(4, S.fmt(st[1], 3)); ro.set(5, S.fmt(st[2], 3));
      nt.set(Math.abs(rel - 1) < 0.01 ? "Équilibre : Q = K. Perturbe-le pour voir la réaction." : rel < 1 ? "Q < K : on a trop de réactifs (ou pas assez de produits) : le système forme du HI pour s'opposer." : "Q > K : on a trop de produit (ou trop peu de réactif) : le système consomme du HI.", Math.abs(rel - 1) < 0.01 ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c09-temperature-pression", ch: "c09", tag: "Graphe",
  titre: "Température et pression : qui pousse l'équilibre où ?",
  resume: "Trois équilibres gazeux : chaud/froid, haute/basse pression, avec les rendements calculés.",
  but: "Choisis un équilibre. Monte la température, puis la pression, et regarde le rendement d'équilibre. Compare : lequel réagit à la pression ? Lequel à la température ? Ajoute un catalyseur : que change-t-il ?",
  aRetenir: "Si on élève T, l'équilibre se déplace dans le sens ENDOTHERMIQUE (et K change). Si on élève P, il se déplace dans le sens qui diminue le nombre de moles de gaz (K ne change pas). H₂ + I₂ ⇌ 2 HI : même nombre de moles de gaz de chaque côté, la pression n'a aucun effet.",
  piege: "Un catalyseur ne change pas le rendement d'équilibre : il fait seulement arriver plus vite. Et la pression ne modifie jamais K : seul T le fait. Modèle simplifié : gaz parfaits, ΔH constant, mélange de départ stœchiométrique ; K_p(T) par la loi de van't Hoff avec R = 8,31 J/(mol·K).",
  build: function(k, S){
    var pal = S.draw.palette, RX = C5.RX;
    var c = k.canvas(250);
    var rx = k.select("Équilibre", Object.keys(RX).map(function(x){ return [x, RX[x].n]; }), "nh3", function(v){ setRanges(v); });
    var T = k.slider("Température", 300, 700, 5, 450, "°C"), P = k.slider("Pression totale", 1, 400, 1, 200, "bar");
    var cat = k.toggle("Catalyseur", false);
    var ro = k.readouts(["ΔH de la réaction directe", "K_p à cette température", "Rendement à l'équilibre", "Produit dans le mélange", "Si T monte…", "Si P monte…"]);
    var nt = k.note("", "");
    function setRanges(v){
      var r = RX[v]; T.el.min = r.Tmin; T.el.max = r.Tmax; T.el.step = 5; P.el.min = r.Pmin; P.el.max = r.Pmax; P.el.step = r.Pstep;
      T.set(r.T0); P.set(r.P0);
    }
    function yieldOf(r, tC, p){ return C5.eqGas(r.nu, r.n0, C5.Kp(r, tC), p); }
    k.draw(function(){
      var r = RX[rx.value]; c.clear();
      var x = yieldOf(r, T.value, P.value), kp = C5.Kp(r, T.value), n = r.n0.map(function(a, i){ return a + r.nu[i] * x; }), tot = n.reduce(function(a, b){ return a + b; }, 0);
      var ax = S.draw.axes(c, {x0: r.Tmin, x1: r.Tmax, y0: 0, y1: 100, xl: "T (°C)", stepY: 20, l: 46, t: 20});
      S.draw.text(c, r.ylab, 50, 10, {size: 12, align: "left", color: pal.grey});
      var cols = [pal.grey, "#6fa0d8", "#2f6bd0"];
      r.Pref.forEach(function(pp, i){ S.draw.fn(c, ax, function(t){ return 100 * yieldOf(r, t, pp); }, cols[i], 2, [5, 4]); S.draw.text(c, pp + " bar", ax.X(r.Tmin) + 8, ax.Y(100 * yieldOf(r, r.Tmin, pp)) + (i % 2 ? 12 : -10), {size: 12, color: cols[i], align: "left"}); });
      S.draw.fn(c, ax, function(t){ return 100 * yieldOf(r, t, P.value); }, pal.red, 3);
      S.draw.dot(c, ax.X(T.value), ax.Y(100 * x), 7, pal.ink);
      S.draw.text(c, "courbe rouge : P = " + P.value + " bar", ax.X(r.Tmax) - 4, ax.T + 12, {size: 12, color: pal.red, align: "right"});
      ro.set(0, (r.dH > 0 ? "+" : "") + S.fmt(r.dH / 1000, 0) + " kJ/mol (" + (r.dH > 0 ? "endo" : "exo") + ")"); ro.set(1, S.sci(kp, 3)); ro.set(2, S.fmt(100 * x, 1) + " %");
      ro.set(3, S.fmt(100 * n[r.idx] / tot, 1) + " % de " + r.nameP + " (en moles)");
      ro.set(4, r.dH > 0 ? "plus de produit (K ↑)" : "moins de produit (K ↓)"); ro.set(5, r.dn > 0 ? "moins de produit (vers N₂O₄)" : r.dn < 0 ? "plus de produit (moins de moles de gaz)" : "aucun effet");
      nt.set(cat.value ? "Le catalyseur est actif : le rendement d'équilibre est EXACTEMENT le même (" + S.fmt(100 * x, 1) + " %). Il accélère seulement l'obtention de cet équilibre." : (r.dn === 0 ? "Même nombre de moles de gaz de part et d'autre : la pression ne change pas le rendement (les courbes sont superposées)." : "Les courbes en pointillés montrent l'effet de la pression : " + (r.dn < 0 ? "plus P est grande, plus le rendement est élevé." : "plus P est grande, plus le rendement est faible.")), cat.value ? "ok" : "");
    });
    setRanges("nh3");
  }
});

SFA.sim({
  id: "c5-c09-haber", ch: "c09", tag: "Défi industriel",
  titre: "Le procédé Haber-Bosch : trouver le bon compromis",
  resume: "Carte rendement(T, P) de N₂ + 3 H₂ ⇌ 2 NH₃, vitesse et coût : touche la carte pour choisir.",
  but: "Touche la carte pour choisir T et P. Lis le rendement d'équilibre, la vitesse (avec catalyseur) et le coût de compression. Défi : au moins 30 % de NH₃, une vitesse relative ≥ 0,2 et P ≤ 250 bar.",
  aRetenir: "Haber-Bosch : exothermique et diminution du nombre de moles de gaz (4 → 2). Le rendement est meilleur à basse température et haute pression. Mais à basse température, c'est trop lent : on compromet ≈ 400–500 °C avec un catalyseur au fer, et ≈ 150–300 bar (limite de coût et de sécurité). On recycle les réactifs non convertis.",
  piege: "Le rendement maximal d'équilibre ne se trouve pas à la température où la réaction est la plus rapide. Un catalyseur permet de réagir à plus basse température (meilleur rendement) : il ne déplace pas l'équilibre. Modèle simplifié (ΔH constant, mélange stœchiométrique, K_p(500 °C) ≈ 1,45·10⁻⁵ bar⁻²).",
  build: function(k, S){
    var pal = S.draw.palette, r = C5.RX.nh3, R = 8.31;
    var c = k.canvas(300);
    var T = k.slider("Température", 300, 700, 5, 450, "°C"), P = k.slider("Pression", 1, 400, 1, 200, "bar");
    var cat = k.toggle("Catalyseur au fer (Eₐ = 100 au lieu de 230 kJ/mol)", true);
    var ro = k.readouts(["NH₃ dans le mélange (équilibre)", "Conversion de N₂", "Vitesse relative", "Coût de compression relatif", "Défi"]);
    var nt = k.note("", "");
    var cache = null;
    function yv(tC, p){ return C5.eqGas(r.nu, r.n0, C5.Kp(r, tC), p); }
    function frac(tC, p){ var x = yv(tC, p); return 2 * x / (4 - 2 * x); }
    function rate(tC){ var Ea = cat.value ? 100000 : 230000, ref = Math.exp(-100000 / R * (1 / 723)); return Math.exp(-Ea / R / (tC + 273)) / ref; }
    function heat(ax){
      if (cache && cache.w === c.W && cache.h === c.H) return cache.cv;
      var cv = document.createElement("canvas"); cv.width = Math.round(ax.R - ax.L); cv.height = Math.round(ax.B - ax.T); var g = cv.getContext("2d");
      var nx = 50, ny = 36, cw = cv.width / nx, ch = cv.height / ny;
      for (var i = 0; i < nx; i++) for (var j = 0; j < ny; j++){
        var t = 300 + (i + 0.5) / nx * 400, p = 1 + (1 - (j + 0.5) / ny) * 399, y = Math.min(0.7, frac(t, p)) / 0.7;
        g.fillStyle = "rgb(" + Math.round(245 - 205 * y) + "," + Math.round(248 - 150 * y) + "," + Math.round(255 - 70 * y) + ")"; g.fillRect(i * cw, j * ch, cw + 1, ch + 1);
      }
      cache = {w: c.W, h: c.H, cv: cv}; return cv;
    }
    var ax0 = null;
    c.pointer(function(type, p){ if ((type === "down" || type === "drag") && ax0){ T.set(Math.max(300, Math.min(700, Math.round(ax0.ix(p.x) / 5) * 5))); P.set(Math.max(1, Math.min(400, Math.round(ax0.iy(p.y))))); k.redraw(); } });
    k.draw(function(){
      c.clear();
      var ax = S.draw.axes(c, {x0: 300, x1: 700, y0: 1, y1: 400, xl: "T (°C)", stepX: 50, stepY: 50, grid: false, l: 48, t: 20}); ax0 = ax;
      c.ctx.drawImage(heat(ax), ax.L, ax.T);
      ax = S.draw.axes(c, {x0: 300, x1: 700, y0: 1, y1: 400, xl: "T (°C)", stepX: 50, stepY: 50, grid: false, l: 48, t: 20});
      S.draw.text(c, "P (bar) · plus foncé = plus de NH₃ à l'équilibre", 50, 10, {size: 12, align: "left", color: pal.grey});
      /* limites du défi : vitesse ≥ 0,2 (avec catalyseur), P ≤ 250 */
      var tmin = 300; for (var t = 300; t <= 700; t++){ if (rate(t) >= 0.2){ tmin = t; break; } }
      c.ctx.save(); c.ctx.strokeStyle = pal.green; c.ctx.lineWidth = 2; c.ctx.setLineDash([6, 4]);
      c.ctx.beginPath(); c.ctx.moveTo(ax.X(tmin), ax.T); c.ctx.lineTo(ax.X(tmin), ax.B); c.ctx.moveTo(ax.L, ax.Y(250)); c.ctx.lineTo(ax.R, ax.Y(250)); c.ctx.stroke(); c.ctx.restore();
      S.draw.text(c, cat.value ? "vitesse ≥ 0,2 →" : "(sans catalyseur : trop lent partout)", ax.X(tmin) + 4, ax.B - 12, {size: 12, color: pal.green, align: "left"}); S.draw.text(c, "P ≤ 250 bar ↓", ax.R - 4, ax.Y(250) + 12, {size: 12, color: pal.green, align: "right"});
      S.draw.dot(c, ax.X(T.value), ax.Y(P.value), 8, pal.red); c.ctx.strokeStyle = "#fff"; c.ctx.lineWidth = 2; c.ctx.beginPath(); c.ctx.arc(ax.X(T.value), ax.Y(P.value), 8, 0, 6.3); c.ctx.stroke();
      var x = yv(T.value, P.value), f = 2 * x / (4 - 2 * x), rt = rate(T.value);
      ro.set(0, S.fmt(100 * f, 1) + " %"); ro.set(1, S.fmt(100 * x, 1) + " %"); ro.set(2, rt < 0.001 && !cat.value ? "≈ 0 (pas de catalyseur)" : S.sci(rt, 2)); ro.set(3, S.fmt(P.value / 200, 2) + " (200 bar = 1)");
      var win = f >= 0.30 && rt >= 0.2 && P.value <= 250;
      ro.set(4, win ? "réussi" : "à chercher");
      nt.set(win ? "Défi réussi : " + S.fmt(100 * f, 1) + " % de NH₃ avec une vitesse de " + S.sci(rt, 2) + " et " + P.value + " bar." : "Défi : NH₃ ≥ 30 %, vitesse ≥ 0,2, P ≤ 250 bar. Indice : plus froid = meilleur rendement mais plus lent ; la pression coûte cher.", win ? "ok" : "");
    });
  }
});

SFA.sim({
  id: "c5-c09-gaz-dissous", ch: "c09", tag: "Niche utile",
  titre: "Boisson gazeuse et plongeur : le gaz dissous suit la pression",
  resume: "Loi de Henry : plus la pression est grande, plus de gaz est dissous. On ouvre, on remonte : il sort.",
  but: "Boisson : règle T et la pression, ouvre la bouteille et regarde le CO₂ s'échapper. Plongeur : choisis la profondeur de séjour puis fais remonter : combien de gaz dissous en excès ?",
  aRetenir: "CO₂(g) ⇌ CO₂(aq) : à l'équilibre, la quantité de gaz dissous est proportionnelle à la pression partielle (loi de Henry : c = k_H·p). Ouvrir la bouteille fait chuter la pression : l'équilibre se déplace vers le gaz, le CO₂ sort. Un liquide chaud dissout moins de gaz qu'un liquide froid. Même principe pour l'azote du plongeur.",
  piege: "Pression et température n'agissent pas dans le même sens sur la solubilité d'un gaz : plus P ↑, plus de gaz dissous ; plus T ↑, MOINS de gaz dissous. Le dégazage n'est pas instantané (l'équilibre est atteint lentement). Pour le plongeur, le modèle suppose des tissus saturés (séjour long) ; en pratique ils ne le sont pas toujours, d'où l'importance des paliers de décompression.",
  build: function(k, S){
    var pal = S.draw.palette, KH20 = 0.034;   /* mol/(L·atm) à 25 °C */
    var c = k.canvas(330), g = k.canvas(160);
    var mode = k.seg("Situation", [["b", "Boisson gazeuse"], ["d", "Plongeur"]], "b");
    var T = k.slider("Température du liquide", 2, 30, 1, 8, "°C");
    var P = k.slider("Pression de CO₂ dans la bouteille", 1, 5, 0.1, 3, "atm");
    var open = k.toggle("Bouteille ouverte", false);
    var D = k.slider("Profondeur du séjour", 10, 60, 5, 40, "m"), d = k.slider("Profondeur actuelle", 0, 60, 1, 40, "m");
    var tm = 0, cNow = null, tOpen = 0, lastOpen = false;
    function kH(t){ return KH20 * Math.exp(2400 * (1 / (t + 273) - 1 / 298)); }
    var lp = k.loop(function(dt, t){ tm = t; k.redraw(); }); lp.play();
    var ro = k.readouts(["Grandeur", "Grandeur", "Grandeur", "Grandeur"]);
    var nt = k.note("", "");
    var rows = ro, labs = k.ctrl.querySelectorAll(".ro small");
    c.pointer(function(type, p){ if (mode.value === "d" && (type === "down" || type === "drag")){ d.set(Math.max(0, Math.min(60, Math.round((p.y - 24) / (280 / 60))))); k.redraw(); } });
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx, M = mode.value;
      var L = M === "b" ? ["Constante de Henry k_H", "CO₂ dissous", "Masse de CO₂ par litre", "Gaz libérable"] : ["Pression au fond", "N₂ dissous au fond", "Excès à cette profondeur", "Volume de gaz libérable"];
      for (var q = 0; q < 4; q++) labs[q].textContent = L[q];
      for (q = 1; q <= 5; q++) k.ctrl.children[q].style.display = ((q <= 3) === (M === "b")) ? "" : "none";
      if (M === "b"){
        var cEq = kH(T.value) * P.value, cOut = kH(T.value) * 0.0004;
        if (open.value !== lastOpen){ lastOpen = open.value; tOpen = tm; }
        var tau = 8 * Math.exp(-(T.value - 20) / 20);   /* minutes de simulation ÷ 10 pour l'animation */
        var cShow = open.value ? cOut + (cEq - cOut) * Math.exp(-(tm - tOpen) / 5) : cEq;
        var bx = c.W / 2 - 56, byy = 62, bw2 = 112, bh2 = 214, lvl = byy + 34;
        C5.bench(c, byy + bh2 + 2);
        var bp = function(){ ctx.beginPath(); ctx.moveTo(bx, byy + 44); ctx.quadraticCurveTo(bx, byy + 22, bx + 34, byy + 14); ctx.lineTo(bx + 34, byy - 22); ctx.lineTo(bx + bw2 - 34, byy - 22); ctx.lineTo(bx + bw2 - 34, byy + 14); ctx.quadraticCurveTo(bx + bw2, byy + 22, bx + bw2, byy + 44); ctx.lineTo(bx + bw2, byy + bh2 - 12); ctx.quadraticCurveTo(bx + bw2, byy + bh2, bx + bw2 - 14, byy + bh2); ctx.lineTo(bx + 14, byy + bh2); ctx.quadraticCurveTo(bx, byy + bh2, bx, byy + bh2 - 12); ctx.closePath(); };
        ctx.save(); bp(); ctx.fillStyle = "rgba(225,238,250,.45)"; ctx.fill(); ctx.clip();
        var lg = ctx.createLinearGradient(0, lvl, 0, byy + bh2); lg.addColorStop(0, "#f8d78c"); lg.addColorStop(1, "#d99a2b"); ctx.fillStyle = lg; ctx.fillRect(bx, lvl, bw2, byy + bh2 - lvl);
        ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(bx, lvl, bw2, 2);
        var nb = Math.round(46 * cShow / (kH(2) * 5));
        for (var i = 0; i < nb; i++){ var ph = (tm * (0.35 + (i % 4) * 0.12) + i * 0.173) % 1, bxp = bx + 10 + ((i * 0.618) % 1) * (bw2 - 20) + Math.sin(ph * 8 + i) * 2, byp = byy + bh2 - 10 - ph * (byy + bh2 - 10 - lvl), br = 1.8 + (i % 3) * 1.2; ctx.beginPath(); ctx.arc(bxp, byp, br, 0, 6.3); ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.fill(); ctx.strokeStyle = "rgba(160,100,20,.5)"; ctx.lineWidth = 0.8; ctx.stroke(); }
        if (open.value) for (var f = 0; f < 14; f++){ ctx.beginPath(); ctx.arc(bx + 10 + f * 7.5, lvl - 1 + Math.sin(tm * 4 + f) * 1.5, 4.5 + (f % 3), 0, 6.3); ctx.fillStyle = "rgba(255,255,255," + Math.min(0.95, 0.2 + (cShow - cOut) / (cEq + 1e-9)) + ")"; ctx.fill(); }
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx + 10, byy + 60); ctx.lineTo(bx + 10, byy + bh2 - 24); ctx.stroke();
        ctx.restore(); ctx.save(); bp(); ctx.strokeStyle = "#51627a"; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.stroke(); ctx.restore();
        if (!open.value){ ctx.fillStyle = pal.red; S.draw.rrect(c, bx + 30, byy - 32, bw2 - 60, 12, 4); ctx.fill(); }
        else for (var pf = 0; pf < 5; pf++){ var u = (tm * 0.7 + pf * 0.2) % 1; ctx.globalAlpha = (1 - u) * Math.min(1, (cShow - cOut) / (cEq * 0.3 + 1e-9)); S.draw.text(c, "CO₂", bx + bw2 / 2 + Math.sin(pf * 2.3 + tm) * 16, byy - 30 - u * 34, {size: 12, color: pal.grey}); ctx.globalAlpha = 1; }
        S.draw.display(c, open.value ? "≈ 0,0004 atm" : S.fmt(P.value, 1) + " atm", c.W - 54, byy + 8, {w: 92, h: 46, caption: "p(CO₂) au-dessus", size: 15});
        S.draw.text(c, open.value ? "ouverte : p(CO₂) = 0,0004 atm" : "fermée : p(CO₂) = " + S.fmt(P.value, 1) + " atm", c.W / 2, 14, {size: 12});
        S.draw.text(c, "liquide à " + T.value + " °C", c.W / 2, byy + bh2 + 16, {size: 12, color: pal.grey});
        var ax = S.draw.axes(g, {x0: 0, x1: 6, y0: 0, y1: 0.4, xl: "p(CO₂) (atm)", stepX: 1, stepY: 0.1, l: 48, t: 22});
        S.draw.text(g, "CO₂ dissous (mol/L) à l'équilibre", 52, 10, {size: 12, align: "left", color: pal.grey});
        S.draw.fn(g, ax, function(p){ return kH(T.value) * p; }, pal.acc, 2.6); S.draw.fn(g, ax, function(p){ return kH(4) * p; }, pal.grey, 1.6, [5, 4]); S.draw.text(g, "pointillés : à 4 °C", ax.X(5.9), ax.Y(kH(4) * 5.9) + 14, {size: 12, color: pal.grey, align: "right"});
        S.draw.dot(g, ax.X(open.value ? 0.0004 : P.value), ax.Y(open.value ? cOut : cEq), 7, pal.red);
        rows.set(0, S.fmt(kH(T.value), 4) + " mol/(L·atm)"); rows.set(1, S.fmt(cShow, 4) + " mol/L"); rows.set(2, S.fmt(cShow * 44, 2) + " g/L");
        rows.set(3, S.fmt(Math.max(0, cShow - cOut) * 24, 2) + " L de gaz par L de boisson");
        nt.set(open.value ? "Ouverte : la pression chute, le CO₂ dissous (" + S.fmt(cEq, 3) + " mol/L) retourne vers le gaz : la quantité dissoute décroît vers " + S.fmt(cOut, 5) + " mol/L (la boisson devient plate)." : "À " + T.value + " °C : k_H = " + S.fmt(kH(T.value), 4) + " ; plus chaud ⇒ k_H plus petit ⇒ moins de CO₂ dissous (d'où la mousse d'une boisson tiède).", open.value ? "" : "");
      } else {
        var kN = 5.2e-4, Pd = 1 + D.value / 10, dd = Math.min(d.value, D.value), Pa = 1 + dd / 10, excess = kN * 0.79 * (Pd - Pa), vol = excess * 25 * 1000;
        var t0 = 24, hh = 280, sc2 = hh / 60, dyy = t0 + dd * sc2, dx = c.W / 2 + 20;
        var sea = ctx.createLinearGradient(0, t0, 0, t0 + hh); sea.addColorStop(0, "#c6ecfb"); sea.addColorStop(1, "#1d4a82"); ctx.fillStyle = sea; ctx.fillRect(10, t0, c.W - 20, hh);
        ctx.fillStyle = "#e9f6fc"; ctx.fillRect(10, t0 - 10, c.W - 20, 10); S.draw.line(c, 10, t0, c.W - 10, t0, "#ffffff", 2);
        for (var dm0 = 0; dm0 <= 60; dm0 += 10){ var yy = t0 + dm0 * sc2; S.draw.line(c, 10, yy, 26, yy, "rgba(255,255,255,.8)", 1.4); S.draw.text(c, dm0 + " m", 30, yy - (dm0 === 0 ? -8 : 0), {size: 11, color: dm0 > 30 ? "#e6f1fb" : "#33506f", align: "left"}); }
        var yD = t0 + D.value * sc2; S.draw.line(c, 70, yD, c.W - 14, yD, "rgba(255,230,120,.9)", 1.6, [6, 4]); S.draw.text(c, "séjour : " + D.value + " m", c.W - 16, yD - 9, {size: 11.5, color: "#ffe27a", align: "right"});
        /* plongeur : bouteille, corps, palmes, masque */
        ctx.save(); ctx.translate(dx, dyy);
        ctx.fillStyle = "#e8c630"; S.draw.rrect(c, -18, -12, 11, 28, 5); ctx.fill();
        ctx.fillStyle = "#1c2433"; ctx.beginPath(); ctx.ellipse(0, 4, 16, 10, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = "#2a3d63"; ctx.beginPath(); ctx.ellipse(-2, 5, 12, 7, 0, 0, 6.3); ctx.fill();
        ctx.fillStyle = "#f3c99b"; ctx.beginPath(); ctx.arc(16, -2, 7, 0, 6.3); ctx.fill(); ctx.fillStyle = "#8fd3e0"; ctx.fillRect(18, -6, 6, 6);
        ctx.strokeStyle = "#1c2433"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-14, 8); ctx.lineTo(-30, 14); ctx.stroke(); ctx.fillStyle = "#1c2433"; ctx.beginPath(); ctx.moveTo(-30, 14); ctx.lineTo(-40, 8); ctx.lineTo(-40, 22); ctx.closePath(); ctx.fill();
        ctx.restore();
        var nb2 = Math.round(Math.min(34, vol / 1.6 + 3));
        for (var j = 0; j < nb2; j++){ var ph2 = (tm * (0.4 + (j % 4) * 0.12) + j * 0.21) % 1, by2 = dyy - 12 - ph2 * Math.min(dyy - t0 - 6, 130); if (by2 < t0) continue; ctx.beginPath(); ctx.arc(dx + 14 + Math.sin(ph2 * 9 + j) * 6, by2, 1.8 + (j % 3) * 1.2, 0, 6.3); ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 0.8; ctx.stroke(); }
        S.draw.display(c, dd + " m", c.W - 58, t0 + 36, {w: 92, h: 42, caption: "profondeur", size: 16});
        S.draw.text(c, "glisse le plongeur vers le haut ou le bas", c.W / 2, t0 + hh + 14, {size: 12, color: pal.grey});
        var ax2 = S.draw.axes(g, {x0: 0, x1: 60, y0: 0, y1: Math.max(60, kN * 0.79 * 6 * 25 * 1000 + 5), xl: "profondeur actuelle (m)", stepX: 10, l: 48, t: 22});
        S.draw.text(g, "gaz libérable (mL de N₂ par L de tissu)", 52, 10, {size: 12, align: "left", color: pal.grey});
        S.draw.fn(g, ax2, function(x){ return x > D.value ? 0 : kN * 0.79 * (Pd - (1 + x / 10)) * 25 * 1000; }, pal.red, 2.6); S.draw.dot(g, ax2.X(dd), ax2.Y(vol), 7, pal.ink);
        rows.set(0, S.fmt(Pd, 1) + " atm à " + D.value + " m"); rows.set(1, S.fmt(kN * 0.79 * Pd * 1000, 2) + " mmol/L de N₂ dissous"); rows.set(2, S.fmt(excess * 1000, 2) + " mmol/L en excès");
        rows.set(3, S.fmt(vol, 0) + " mL de gaz par L de tissu");
        nt.set(dd >= D.value ? "Au fond, tout est en équilibre : rien n'est en excès." : "En remontant, la pression baisse mais l'azote reste dissous : il est en excès et peut former des bulles. Remonte par paliers (lentement) pour le laisser s'échapper par les poumons.", dd >= D.value ? "ok" : "warn");
      }
    });
  }
});
