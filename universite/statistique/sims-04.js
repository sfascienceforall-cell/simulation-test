/* Biostatistique BA1 · chapitre 4 : lois binomiale, de Poisson et normale */
(function(){
var P = SFA.draw.palette, F = SFA.fmt, ST = SFA.st, Phi = ST.Phi, rng = ST.rng, gauss = ST.gauss, binom = ST.binom, pois = ST.pois;
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function bars(c, ax, vals, k0, col, hi, hcol, wd){
  wd = wd || 0.42; vals.forEach(function(v, i){ var k = k0 + i, xa = ax.X(k - wd), xb = ax.X(k + wd); c.ctx.fillStyle = (hi && hi(k)) ? hcol : col; c.ctx.fillRect(xa, ax.Y(v), Math.max(1, xb - xa), ax.Y(0) - ax.Y(v)); });
}

/* 1 : planche de Galton ------------------------------------------- */
SFA.sim({
  id: "us-c04-binomiale", ch: "c04", tag: "Loi binomiale",
  titre: "Binomiale B(n ; p) : la planche de Galton",
  resume: "Chaque bille fait n choix gauche / droite : le nombre de « droite » suit une binomiale. Lâche des billes et vois la loi se dessiner.",
  but: "Fais varier n et p, lâche des billes : les barres orange (observé) épousent peu à peu les barres bleues (loi théorique). Choisis k en touchant une barre : les barres rouges sont les valeurs X ≤ k.",
  aRetenir: "E(X) = np ; Var(X) = np(1 − p) ; P(X = k) = C(n,k)·pᵏ·(1 − p)ⁿ⁻ᵏ. La loi est symétrique si p = 0,5 et s'étire à droite si p est petit.",
  piege: "La binomiale suppose des épreuves indépendantes et un même p : tirer sans remise dans une petite population la fausse (loi hypergéométrique).",
  build: function(k, S){
    var c = ST.canvas(k, 440, 1.05, 540), counts = [], tot = 0, balls = [], acc = 0;
    function reset(){ counts = []; for (var i = 0; i <= 60; i++) counts.push(0); tot = 0; balls = []; acc = 0; }
    reset();
    var n = k.slider("n (nombre d'épreuves)", 1, 60, 1, 12, "", reset), p = k.slider("p (probabilité de succès)", 0.01, 0.99, 0.01, 0.35, "", reset), kk = k.slider("k", 0, 60, 1, 4, "");
    var speed = k.seg("Vitesse de chute", [[4, "lent"], [20, "normal"], [400, "éclair"]], 20);
    function drop(){
      var N = n.value, pv = p.value, path = [0], s = 0;
      for (var i = 0; i < N; i++){ if (Math.random() < pv) s++; path.push(s); }
      if (speed.value >= 400){ counts[s]++; tot++; } else if (balls.length < 120) balls.push({path: path, t: 0});
    }
    var ani = k.loop(function(dt){
      acc += dt * speed.value * (speed.value >= 400 ? 1 : 1); var m = Math.floor(acc); acc -= m; for (var i = 0; i < m; i++) drop();
      var N = n.value, rate = 9 + 0 * N; balls.forEach(function(b){ b.t += dt * rate; });
      balls = balls.filter(function(b){ if (b.t >= N + 0.6){ counts[b.path[N]]++; tot++; return false; } return true; });
      if (tot > 3000 && !balls.length) ani.pause();
      k.redraw(); });
    k.button("Lancer / pause", function(){ if (ani.running) ani.pause(); else ani.play(); }, true);
    k.button("Lâcher 1 bille", function(){ var sv = speed.value; if (sv >= 400){ drop(); } else drop(); }); k.button("+ 500 billes", function(){ var N = n.value, pv = p.value; for (var j = 0; j < 500; j++){ var s = 0; for (var i = 0; i < N; i++) if (Math.random() < pv) s++; counts[s]++; tot++; } }); k.button("Recommencer", reset);
    ani.play();
    var ro = k.readouts(["P(X = k)", "P(X ≤ k)", "P(X ≥ k)", "E(X) ; σ"]);
    var nt = k.note("", "");
    var lay = {};
    c.pointer(function(type, q){ if ((type === "down" || type === "drag") && lay.cx){ var v = Math.round((q.x - lay.cx) / lay.pitch + n.value / 2); if (q.y > lay.hy0 - 6) { kk.set(ST.clamp(v, 0, n.value)); k.redraw(); } } });
    k.draw(function(){
      c.clear();
      var N = n.value, q = p.value, K = Math.min(kk.value, N), ctx = c.ctx, W = c.W, H = c.H;
      var mx = 16, pitch = (W - 2 * mx) / (N + 1), cx = W / 2, peg = N <= 16, boardH = peg ? Math.min(N * 20, H * 0.36) : H * 0.26, dy = boardH / N, top = 22;
      lay.cx = cx; lay.pitch = pitch; lay.hy0 = top + boardH + 10;
      var bx = function(j){ return cx + (j - N / 2) * pitch; };
      /* planche */
      if (peg){ for (var r = 0; r < N; r++) for (var i = 0; i <= r; i++){ var px = cx + (i - r / 2) * pitch, py = top + r * dy; ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 6.2832); ctx.fillStyle = S.draw.tint(P.ink, .35); ctx.fill(); } }
      else { ctx.save(); ctx.strokeStyle = S.draw.tint(P.ink, .12); ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(bx(0), top + boardH); ctx.moveTo(cx, top); ctx.lineTo(bx(N), top + boardH); ctx.stroke(); ctx.restore(); }
      balls.forEach(function(b){ var t = Math.min(b.t, N), j = Math.min(N - 1, Math.floor(t)), f = t - j, x1 = cx + (b.path[j] - j / 2) * pitch, x2 = cx + (b.path[j + 1] - (j + 1) / 2) * pitch;
        var e = f * f * (3 - 2 * f), x = N === 0 ? cx : x1 + (x2 - x1) * e, y = top + (j + f) * dy; if (b.t > N) y += (b.t - N) * 30;
        S.draw.dot(c, x, y, Math.max(3, Math.min(5.5, pitch * .3)), P.orange); });
      /* histogramme */
      var v = [], j, mxv = 0; for (j = 0; j <= N; j++){ v.push(binom(N, q, j)); mxv = Math.max(mxv, v[j], tot ? counts[j] / tot : 0); }
      var hb = H - 40, ht = lay.hy0 + 14, ymax = mxv * 1.12;
      var Y = function(val){ return hb - val / ymax * (hb - ht); };
      ctx.fillStyle = S.draw.tint(P.mat, .06); ctx.fillRect(mx, ht - 6, W - 2 * mx, hb - ht + 6);
      v.forEach(function(val, i){ var xa = bx(i) - pitch * .42, wd = pitch * .84; ctx.fillStyle = i <= K ? S.draw.tint(P.red, .5) : S.draw.tint(P.mat, .42); ctx.fillRect(xa, Y(val), Math.max(1, wd), hb - Y(val)); });
      if (tot) v.forEach(function(val, i){ var o = counts[i] / tot, xa = bx(i) - pitch * .2, wd = pitch * .4; ctx.fillStyle = S.draw.tint(P.orange, .92); ctx.fillRect(xa, Y(o), Math.max(1.5, wd), hb - Y(o)); });
      S.draw.line(c, mx, hb + .5, W - mx, hb + .5, P.axis, 1.25);
      var step = N > 40 ? 5 : N > 20 ? 2 : 1;
      for (j = 0; j <= N; j += step) S.draw.text(c, j, bx(j), hb + 13, {size: 11, color: j === K ? P.red : "#6b7685"});
      S.draw.text(c, "nombre de succès k", W - mx, H - 8, {size: 11.5, align: "right", color: "#3d4b5f"});
      S.draw.dot(c, bx(K), hb + .5, 6, P.red);
      S.draw.legend(c, [[S.draw.tint(P.mat, .6), "loi théorique"], [P.orange, "billes tombées (" + tot + ")"], [S.draw.tint(P.red, .6), "X ≤ k"]], W - 10, ht, {align: "right"});
      S.draw.label(c, "touche une barre pour choisir k", mx + 90, ht + 8, {color: P.mat, size: 10.5});
      var le = 0; for (j = 0; j <= K; j++) le += v[j];
      var eq = v[K];
      ro.set(0, F(eq, 4)); ro.set(1, F(le, 4)); ro.set(2, F(1 - le + eq, 4)); ro.set(3, F(N * q, 2) + " ; " + F(Math.sqrt(N * q * (1 - q)), 2));
      nt.set((kk.value > N ? "k ramené à n = " + N + " (X ne peut pas dépasser n). " : "") + (tot ? "Sur " + tot + " billes, " + pct(counts[K] / tot, 1) + " sont tombées en k = " + K + " (calcul : " + pct(eq, 1) + "). " : "") + "P(X ≤ k) est la somme des barres rouges.", kk.value > N ? "warn" : "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-poisson", ch: "c04", tag: "Événements rares",
  titre: "Poisson : comptages rares et approximation de la binomiale",
  resume: "Nombre de colonies, de désintégrations, de mutations : Poisson(λ) contre binomiale(n ; λ/n).",
  but: "Fais varier λ (nombre moyen d'événements, aussi en glissant le repère sur l'axe) puis superpose la binomiale de même moyenne avec n croissant.",
  aRetenir: "P(X = k) = e^(−λ)·λᵏ/k! ; E(X) = Var(X) = λ. La binomiale B(n ; p) tend vers Poisson(np) quand n est grand et p petit.",
  piege: "Poisson impose variance = moyenne. Si la variance observée est bien plus grande que la moyenne (agrégats, contagion), le modèle de Poisson ne convient pas.",
  build: function(k, S){
    var c = ST.canvas(k, 300, .72, 400);
    var lam = k.slider("λ (événements attendus)", 0.2, 15, 0.1, 3, ""), tg = k.toggle("Superposer la binomiale B(n ; λ/n)", true), n = k.slider("n de la binomiale", 20, 500, 10, 40, "");
    var ro = k.readouts(["P(X = 0)", "P(X ≥ 1)", "Écart max Poisson–binomiale", "σ"]);
    var nt = k.note("", "");
    var lay = {};
    ST.drag(c, function(){ return lay.ax ? [{id: "l", x: lay.ax.X(lam.value), y: lay.ax.Y(0), r: 16}] : []; }, function(id, q){ lam.set(ST.clamp(Math.round(lay.ax.ix(q.x) * 10) / 10, 0.2, 15)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var l = lam.value, N = n.value, kmax = Math.ceil(l + 4.5 * Math.sqrt(l) + 4), vp = [], vb = [], j, md = 0;
      for (j = 0; j <= kmax; j++){ vp.push(pois(l, j)); vb.push(binom(N, l / N, j)); md = Math.max(md, Math.abs(vp[j] - vb[j])); }
      var ymax = Math.max(Math.max.apply(null, vp), Math.max.apply(null, vb)) * 1.18;
      var ax = S.draw.axes(c, {x0: -1, x1: kmax + 1, y0: 0, y1: ymax, xl: "k", yl: "P(X = k)", stepX: kmax > 24 ? 4 : 2, t: 24}); lay.ax = ax;
      bars(c, ax, vp, 0, S.draw.tint(P.mat, .55));
      if (tg.value){ vb.forEach(function(v, i){ var xa = ax.X(i - 0.42), xb = ax.X(i + 0.42); c.ctx.strokeStyle = P.red; c.ctx.lineWidth = 2; c.ctx.strokeRect(xa, ax.Y(v), xb - xa, ax.Y(0) - ax.Y(v)); }); }
      S.draw.line(c, ax.X(l), ax.Y(0), ax.X(l), ax.T, S.draw.tint(P.ink, .5), 1.4, [4, 3]); S.draw.dot(c, ax.X(l), ax.Y(0), 7, P.ink);
      S.draw.legend(c, [[S.draw.tint(P.mat, .7), "Poisson(λ)"]].concat(tg.value ? [[P.red, "binomiale B(n ; λ/n)"]] : []), c.W - 10, 10, {align: "right"});
      ST.hint(c, "glisse λ", ax.X(l), ax.T + 10, P.ink);
      ro.set(0, F(Math.exp(-l), 4)); ro.set(1, F(1 - Math.exp(-l), 4)); ro.set(2, tg.value ? F(md, 4) : "—"); ro.set(3, F(Math.sqrt(l), 2));
      nt.set(tg.value ? (md < 0.005 ? "Les deux lois sont presque identiques (écart maximal " + F(md, 4) + ") : n grand et p petit." : "L'écart est visible : p = λ/n = " + F(l / N, 3) + " n'est pas assez petit. Augmente n.") : "E(X) = Var(X) = λ = " + F(l, 1) + ".", tg.value && md >= 0.005 ? "warn" : "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-normale", ch: "c04", tag: "Loi normale",
  titre: "Loi normale : aires, scores z et règle 68–95–99,7",
  resume: "Une glycémie N(μ ; σ²) : glisse deux bornes, lis l'aire (proportion) et les scores z.",
  but: "Règle la moyenne μ et l'écart-type σ de la glycémie à jeun (mg/dL), puis glisse les deux bornes a et b à la souris : la zone colorée est la proportion d'individus entre a et b.",
  aRetenir: "z = (x − μ)/σ ramène à la loi N(0 ; 1). À peu près 68 % des valeurs sont à moins de 1σ de μ, 95 % à moins de 2σ (exactement 1,96σ), 99,7 % à moins de 3σ.",
  piege: "Pour une loi continue, P(X = a) = 0 : seules les aires entre deux bornes ont un sens. La règle 68–95–99,7 n'est valable que pour une distribution (approximativement) normale.",
  build: function(k, S){
    var c = ST.canvas(k, 320, .72, 400);
    var mu = k.slider("Moyenne μ", 70, 120, 1, 90, "mg/dL"), sg = k.slider("Écart-type σ", 4, 20, 1, 8, "mg/dL");
    var a = k.slider("Borne a", 40, 160, 1, 82, "mg/dL"), b = k.slider("Borne b", 40, 160, 1, 106, "mg/dL");
    k.button("μ ± 1σ", function(){ a.set(mu.value - sg.value); b.set(mu.value + sg.value); }, true); k.button("μ ± 2σ", function(){ a.set(mu.value - 2 * sg.value); b.set(mu.value + 2 * sg.value); }); k.button("μ ± 3σ", function(){ a.set(mu.value - 3 * sg.value); b.set(mu.value + 3 * sg.value); });
    var bd = k.toggle("Montrer μ ± 1σ, 2σ, 3σ", false);
    var ro = k.readouts(["z(a)", "z(b)", "Proportion entre a et b", "Hors de [a ; b]"]);
    var nt = k.note("", "");
    var lay = {};
    ST.drag(c, function(){ if (!lay.ax) return []; var ax = lay.ax, m = mu.value, s = sg.value, f = function(x){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); };
      return [{id: "a", x: ax.X(a.value), y: ax.Y(f(a.value)), r: 16}, {id: "b", x: ax.X(b.value), y: ax.Y(f(b.value)), r: 16}]; },
      function(id, q){ var v = ST.clamp(Math.round(lay.ax.ix(q.x)), 40, 160); (id === "a" ? a : b).set(v); k.redraw(); });
    k.draw(function(){
      c.clear();
      var m = mu.value, s = sg.value, lo = Math.min(a.value, b.value), hi = Math.max(a.value, b.value);
      function f(x){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); }
      var ax = S.draw.axes(c, {x0: 40, x1: 160, y0: 0, y1: 0.11, xl: "glycémie (mg/dL)", stepX: 10, stepY: 0.02, t: 22}); lay.ax = ax;
      S.draw.area(c, ax, f, lo, hi, P.mat, 0.32);
      if (bd.value){ [1, 2, 3].forEach(function(q){ [-1, 1].forEach(function(sgn){ S.draw.line(c, ax.X(m + sgn * q * s), ax.Y(0), ax.X(m + sgn * q * s), ax.Y(f(m + sgn * q * s)), P.amber, 1.5, [4, 3]); }); S.draw.label(c, q + "σ", ax.X(m + q * s), ax.Y(0) - 14, {color: P.amber, size: 11}); }); }
      S.draw.fn(c, ax, f, P.mat, 2.8);
      S.draw.line(c, ax.X(m), ax.Y(0), ax.X(m), ax.Y(f(m)), P.ink, 1.5, [4, 3]);
      var za = (lo - m) / s, zb = (hi - m) / s, area = Phi(zb) - Phi(za);
      [[lo, "a"], [hi, "b"]].forEach(function(q){ S.draw.line(c, ax.X(q[0]), ax.Y(0), ax.X(q[0]), ax.Y(f(q[0])), P.ink, 2); S.draw.dot(c, ax.X(q[0]), ax.Y(f(q[0])), 7, P.ink); S.draw.label(c, q[1] + " = " + q[0], ax.X(q[0]), ax.Y(f(q[0])) - 16, {color: P.ink, size: 11.5}); });
      S.draw.label(c, pct(area, 1), ax.X((lo + hi) / 2), Math.min(ax.Y(f(m)) + 60, ax.Y(0) - 40), {color: P.mat, size: 14});
      S.draw.label(c, "μ = " + m, ax.X(m), ax.Y(f(m)) - 14, {color: P.ink, size: 11});
      ST.hint(c, "glisse a et b", c.W - 70, 12, P.mat);
      ro.set(0, F(za, 2)); ro.set(1, F(zb, 2)); ro.set(2, pct(area, 2)); ro.set(3, pct(1 - area, 2));
      nt.set(Math.abs(za + 1.96) < 0.03 && Math.abs(zb - 1.96) < 0.03 ? "Bornes à ±1,96σ : 95 % des valeurs sont à l'intérieur." : "Aire sous la courbe entre a et b = proportion de la population. Calcul : Φ(" + F(zb, 2) + ") − Φ(" + F(za, 2) + ").", "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-approx-normale", ch: "c04", tag: "Approximation",
  titre: "Approcher la binomiale par une normale : avec ou sans correction de continuité",
  resume: "Compare P(X ≤ k) exacte, approchée par la normale, avec et sans correction de continuité.",
  but: "Choisis n, p et k (touche une barre pour fixer k). Vérifie quand la courbe normale épouse les barres et quelle valeur (k ou k + 0,5) donne la meilleure approximation.",
  aRetenir: "B(n ; p) ≈ N(np ; np(1 − p)) si np et n(1 − p) sont suffisamment grands (règle usuelle ≥ 5, parfois ≥ 10). Correction de continuité : P(X ≤ k) ≈ Φ((k + 0,5 − np)/σ).",
  piege: "Sans correction, on perd une demi-barre : l'erreur est surtout visible pour n petit. Si p est proche de 0 ou 1, la normale est inadaptée : utilise la loi exacte ou Poisson.",
  build: function(k, S){
    var c = ST.canvas(k, 320, .72, 400);
    var n = k.slider("n", 5, 200, 1, 40, ""), p = k.slider("p", 0.02, 0.98, 0.01, 0.3, ""), kk = k.slider("k", 0, 200, 1, 10, "");
    var ro = k.readouts(["Exacte P(X ≤ k)", "Normale sans correction", "Normale avec correction", "Erreur avec correction"]);
    var nt = k.note("", "");
    var lay = {};
    c.pointer(function(type, q){ if ((type === "down" || type === "drag") && lay.ax){ kk.set(ST.clamp(Math.round(lay.ax.ix(q.x)), 0, n.value)); k.redraw(); } });
    k.draw(function(){
      c.clear();
      var N = n.value, q = p.value, K = Math.min(kk.value, N), m = N * q, s = Math.sqrt(N * q * (1 - q)), v = [], j, ex = 0;
      for (j = 0; j <= N; j++){ v.push(binom(N, q, j)); if (j <= K) ex += v[j]; }
      var x0 = Math.max(-1, m - 4.2 * s), x1 = Math.min(N + 1, m + 4.2 * s);
      var dens = function(x){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); };
      var ymax = Math.max(Math.max.apply(null, v), dens(m)) * 1.2;
      var ax = S.draw.axes(c, {x0: x0, x1: x1, y0: 0, y1: ymax, xl: "k", yl: "P(X = k)", stepX: Math.max(1, Math.round((x1 - x0) / 10)), t: 24}); lay.ax = ax;
      bars(c, ax, v, 0, S.draw.tint(P.mat, .42), function(t){ return t <= K; }, S.draw.tint(P.red, .55));
      S.draw.fn(c, ax, dens, P.green, 2.8);
      S.draw.line(c, ax.X(K + 0.5), ax.Y(0), ax.X(K + 0.5), ax.T, P.ink, 1.6, [5, 4]);
      S.draw.label(c, "k + 0,5", ax.X(K + 0.5), ax.T - 2, {color: P.ink, size: 11, base: "bottom"});
      S.draw.legend(c, [[S.draw.tint(P.mat, .7), "binomiale (X ≤ k en rouge)"], [P.green, "normale N(np ; np(1−p))"]], ax.L + 8, ax.T + 4);
      var a1 = Phi((K - m) / s), a2 = Phi((K + 0.5 - m) / s);
      ro.set(0, F(ex, 4)); ro.set(1, F(a1, 4)); ro.set(2, F(a2, 4)); ro.set(3, F(a2 - ex, 4));
      var okk = m >= 5 && N * (1 - q) >= 5;
      nt.set(okk ? "np = " + F(m, 1) + " et n(1 − p) = " + F(N * (1 - q), 1) + " : conditions usuelles remplies. La correction (k + 0,5) rapproche presque toujours de la valeur exacte." : "np = " + F(m, 1) + " ou n(1 − p) = " + F(N * (1 - q), 1) + " est inférieur à 5 : la loi est asymétrique, l'approximation normale est médiocre.", okk ? "ok" : "warn");
    });
  }
});

/* 5 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c04-log-qq", ch: "c04", tag: "Normalité",
  titre: "Reconnaître l'asymétrie : histogramme, droite de Henry, logarithme",
  resume: "Un dosage biologique à queue droite : la transformation logarithmique le rend (presque) normal.",
  but: "300 valeurs de type log-normal (dosage). Augmente l'asymétrie puis active le logarithme : l'histogramme se symétrise et la droite de Henry se redresse.",
  aRetenir: "Dans un diagramme quantile–quantile (droite de Henry), des points alignés indiquent une loi normale ; une courbure en « banane » indique une asymétrie. Le logarithme corrige une asymétrie à droite quand les valeurs sont positives.",
  piege: "Ces données sont simulées pour être log-normales : en pratique, aucun jeu de données n'est parfaitement normal ; on juge l'écart à l'œil, avec la taille de l'échantillon en tête. Pour des valeurs nulles, le logarithme n'est pas défini.",
  build: function(k, S){
    var c1 = ST.canvas(k, 210, .46, 270), c2 = ST.canvas(k, 240, .56, 320);
    var sg = k.slider("Dispersion de ln(X)", 0.1, 1, 0.05, 0.7, "");
    var lg = k.toggle("Appliquer le logarithme", false);
    var ro = k.readouts(["Moyenne", "Médiane", "Asymétrie (g₁)", "Échelle"]);
    var nt = k.note("", "");
    var r = rng(21), zs = []; for (var i = 0; i < 300; i++) zs.push(gauss(r));
    zs.sort(function(a, b){ return a - b; });
    k.draw(function(){
      c1.clear(); c2.clear();
      var s = sg.value, mu0 = Math.log(8), d = zs.map(function(z){ var x = Math.exp(mu0 + s * z); return lg.value ? Math.log(x) : x; });
      var n = d.length, mn = d.reduce(function(a, b){ return a + b; }, 0) / n, m2 = 0, m3 = 0;
      d.forEach(function(x){ m2 += Math.pow(x - mn, 2); m3 += Math.pow(x - mn, 3); }); m2 /= n; m3 /= n;
      var g1 = m3 / Math.pow(m2, 1.5), md = (d[149] + d[150]) / 2, sd = Math.sqrt(m2 * n / (n - 1));
      var lo = lg.value ? -1 : 0, hi = lg.value ? 5.5 : 80, nb = 26, cnt = [], j;
      for (j = 0; j < nb; j++) cnt.push(0);
      d.forEach(function(x){ var b = Math.floor((x - lo) / (hi - lo) * nb); if (b >= 0 && b < nb) cnt[b]++; });
      var ymax = Math.max(40, Math.ceil(Math.max.apply(null, cnt) * 1.15 / 10) * 10);
      var ax = S.draw.axes(c1, {x0: lo, x1: hi, y0: 0, y1: ymax, xl: lg.value ? "ln(concentration)" : "concentration (mg/L)", yl: "effectif", stepX: lg.value ? 1 : 10, b: 38, t: 22});
      cnt.forEach(function(q, b){ var xa = ax.X(lo + b * (hi - lo) / nb), xb = ax.X(lo + (b + 1) * (hi - lo) / nb); c1.ctx.fillStyle = S.draw.tint(P.mat, .6); c1.ctx.fillRect(xa + 0.5, ax.Y(q), xb - xa - 1, ax.Y(0) - ax.Y(q)); });
      S.draw.line(c1, ax.X(mn), ax.Y(0), ax.X(mn), ax.T, P.red, 2, [5, 4]); S.draw.line(c1, ax.X(md), ax.Y(0), ax.X(md), ax.T, P.green, 2, [5, 4]);
      S.draw.legend(c1, [[P.red, "moyenne", 1], [P.green, "médiane", 1]], c1.W - 10, 8, {align: "right"});
      var bx = S.draw.axes(c2, {x0: -3, x1: 3, y0: -3, y1: 5, xl: "quantile théorique z", yl: "valeur standardisée", stepX: 1, stepY: 1, b: 38, t: 22});
      S.draw.line(c2, bx.X(-3), bx.Y(-3), bx.X(3), bx.Y(3), P.grey, 1.4, [5, 4]);
      for (j = 0; j < n; j += 3){ S.draw.dot(c2, bx.X(ST.invPhi((j + 0.5) / n)), bx.Y((d[j] - mn) / sd), 3.2, P.mat); }
      S.draw.label(c2, "points alignés = loi normale", bx.X(2.9), bx.Y(-2.4), {color: P.mat, align: "right", size: 11});
      ro.set(0, F(mn, 2)); ro.set(1, F(md, 2)); ro.set(2, F(g1, 2)); ro.set(3, lg.value ? "ln(mg/L)" : "mg/L");
      nt.set(Math.abs(g1) > 0.7 ? "Asymétrie nette (g₁ = " + F(g1, 2) + ") : la moyenne dépasse la médiane et les points de la droite de Henry s'écartent en courbe de la diagonale. Essaie le logarithme." : "Asymétrie faible (g₁ = " + F(g1, 2) + ") : histogramme presque symétrique, points proches de la diagonale. Une moyenne ± écart-type est alors un résumé raisonnable.", Math.abs(g1) > 0.7 ? "warn" : "ok");
    });
  }
});
})();
