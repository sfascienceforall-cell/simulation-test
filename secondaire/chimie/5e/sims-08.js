/* Chapitre 8 · Équilibres chimiques et constante K */
SFA.sim({
  id: "c5-c08-boite", ch: "c08", tag: "Animation",
  titre: "Une boîte de particules : A ⇌ B qui ne s'arrête jamais",
  resume: "Chaque particule change de forme au hasard : les courbes se stabilisent, pas les particules.",
  but: "Choisis les vitesses des deux sens et lance la simulation. Observe les nombres de A et de B converger vers des valeurs stables, alors que des particules continuent à passer d'un état à l'autre.",
  aRetenir: "À l'équilibre, les quantités de A et de B ne varient plus, mais la réaction continue : la vitesse de A → B est égale à celle de B → A. C'est un équilibre DYNAMIQUE. Le rapport final B/A est égal à K = k₁/k₂ (ici k₁ : A → B ; k₂ : B → A).",
  piege: "Équilibre ne veut pas dire « moitié-moitié » : B/A = K. Si k₁ = 3·k₂, on a 3 B pour 1 A. Et les petites fluctuations (hasard) sont normales avec peu de particules : plus il y a de particules, plus la courbe est lisse.",
  build: function(k, S){
    var pal = S.draw.palette;
    var c = k.canvas(200), g = k.canvas(190);
    var N = k.slider("Nombre de particules", 20, 300, 10, 100, "", function(){ init(); });
    var k1 = k.slider("k₁ (A → B)", 0.05, 1, 0.05, 0.4, "/s"), k2 = k.slider("k₂ (B → A)", 0.05, 1, 0.05, 0.2, "/s");
    var start = k.seg("Départ", [["A", "tout en A"], ["B", "tout en B"]], "A", function(){ init(); });
    k.button("Relancer", function(){ init(); }, true);
    var ro = k.readouts(["Particules A", "Particules B", "K = k₁/k₂", "B/A mesuré", "A→B (par s)", "B→A (par s)"]);
    var nt = k.note("", "");
    var ps = [], hist = [], tt = 0, ev = [];
    function init(){ ps = []; hist = []; ev = []; tt = 0; for (var i = 0; i < N.value; i++) ps.push({x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, s: start.value === "A" ? "A" : "B"}); }
    var lp = k.loop(function(dt){
      var h = Math.min(dt, 0.05), a1 = 1 - Math.exp(-k1.value * h), a2 = 1 - Math.exp(-k2.value * h);
      ps.forEach(function(p){
        p.x += p.vx * h; p.y += p.vy * h; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; p.x = Math.max(0, Math.min(1, p.x)); p.y = Math.max(0, Math.min(1, p.y));
        p.vx += (Math.random() - 0.5) * 0.4 * h; p.vy += (Math.random() - 0.5) * 0.4 * h;
        if (p.s === "A"){ if (Math.random() < a1){ p.s = "B"; ev.push({t: tt, d: 1}); } } else { if (Math.random() < a2){ p.s = "A"; ev.push({t: tt, d: -1}); } }
      });
      tt += h; while (ev.length && ev[0].t < tt - 4) ev.shift();
      if (!hist.length || tt - hist[hist.length - 1][0] >= 0.25){ var nA = ps.filter(function(p){ return p.s === "A"; }).length; hist.push([tt, nA]); if (hist.length > 400) hist.shift(); }
      k.redraw();
    });
    lp.play();
    k.draw(function(){
      c.clear(); g.clear();
      c.ctx.strokeStyle = pal.grey; c.ctx.lineWidth = 2; c.ctx.strokeRect(1, 1, c.W - 2, c.H - 2);
      var nA = 0; ps.forEach(function(p){ if (p.s === "A") nA++; C5.atom(c, 10 + p.x * (c.W - 20), 10 + p.y * (c.H - 20), 5, p.s === "A" ? "#9db8ee" : "#f2a3a3", ""); });
      var nB = ps.length - nA, K = k1.value / k2.value, tot = ps.length, Aeq = tot / (1 + K);
      var tmax = Math.max(40, hist.length ? hist[hist.length - 1][0] * 1.05 : 40), t0 = Math.max(0, tmax - 120);
      var ax = S.draw.axes(g, {x0: t0, x1: Math.max(t0 + 40, tmax), y0: 0, y1: tot, xl: "t (s)", l: 40, t: 20});
      S.draw.text(g, "nombre de particules (A bleu, B rouge)", 46, 10, {size: 12, align: "left", color: pal.grey});
      S.draw.line(g, ax.X(t0), ax.Y(Aeq), ax.X(ax.x1), ax.Y(Aeq), pal.acc, 1.2, [5, 4]); S.draw.line(g, ax.X(t0), ax.Y(tot - Aeq), ax.X(ax.x1), ax.Y(tot - Aeq), pal.red, 1.2, [5, 4]);
      for (var i = 1; i < hist.length; i++){ S.draw.line(g, ax.X(hist[i - 1][0]), ax.Y(hist[i - 1][1]), ax.X(hist[i][0]), ax.Y(hist[i][1]), pal.acc, 2.2); S.draw.line(g, ax.X(hist[i - 1][0]), ax.Y(tot - hist[i - 1][1]), ax.X(hist[i][0]), ax.Y(tot - hist[i][1]), pal.red, 2.2); }
      var win = Math.min(4, Math.max(tt, 0.2)), d1 = ev.filter(function(e){ return e.d === 1; }).length / win, d2 = ev.filter(function(e){ return e.d === -1; }).length / win;
      ro.set(0, nA); ro.set(1, nB); ro.set(2, S.fmt(K, 2)); ro.set(3, nA ? S.fmt(nB / nA, 2) : "—"); ro.set(4, S.fmt(d1, 1)); ro.set(5, S.fmt(d2, 1));
      nt.set("Les pointillés indiquent les valeurs d'équilibre attendues (A : " + S.fmt(Aeq, 0) + ", B : " + S.fmt(tot - Aeq, 0) + "). Regarde les deux dernières cases : à l'équilibre, A → B et B → A ont lieu à la même vitesse, en moyenne.", "");
    });
    init();
  }
});

SFA.sim({
  id: "c5-c08-constante-k", ch: "c08", tag: "Classique",
  titre: "Même K, des équilibres différents : H₂ + I₂ ⇌ 2 HI",
  resume: "Trois concentrations de départ au choix : l'équilibre change, mais pas K.",
  but: "Choisis les concentrations initiales (ou un exemple) et regarde les concentrations à l'équilibre. Calcule K avec les valeurs de l'équilibre : tu retrouves toujours la même valeur.",
  aRetenir: "K = [HI]² / ([H₂]·[I₂]) à l'équilibre (concentrations en mol/L, à l'équilibre, à température donnée). K ne dépend pas des concentrations de départ : il ne dépend que de la réaction et de la température. Ici K ≈ 50 à environ 450 °C.",
  piege: "K n'est pas une concentration et ne se lit pas sur les mélanges de départ : on utilise les concentrations à l'ÉQUILIBRE. K > 1 ne veut pas dire « réaction complète » : ici, même en partant de 1,0 mol/L de chaque réactif, il reste 0,22 mol/L de chacun. Les corps solides et le solvant ne figurent pas dans K.",
  build: function(k, S){
    var pal = S.draw.palette, K = 50;
    var c = k.canvas(250);
    var a = k.slider("[H₂] initiale", 0, 1, 0.05, 1, "mol/L"), b = k.slider("[I₂] initiale", 0, 1, 0.05, 1, "mol/L"), d = k.slider("[HI] initiale", 0, 1, 0.05, 0, "mol/L");
    k.button("1,0 H₂ + 1,0 I₂", function(){ a.set(1); b.set(1); d.set(0); });
    k.button("0,2 H₂ + 1,0 I₂", function(){ a.set(0.2); b.set(1); d.set(0); });
    k.button("1,0 HI seul", function(){ a.set(0); b.set(0); d.set(1); });
    var ro = k.readouts(["[H₂] à l'équilibre", "[I₂] à l'équilibre", "[HI] à l'équilibre", "K calculé avec ces valeurs", "Sens de l'évolution"]);
    var nt = k.note("", "");
    k.draw(function(){
      var a0 = a.value, b0 = b.value, c0 = d.value; c.clear();
      var sp = [{nu: -1, c0: a0}, {nu: -1, c0: b0}, {nu: 2, c0: c0}], x = 0, ok = (a0 + b0 + c0) > 0;
      var lo = -c0 / 2, hi = Math.min(a0, b0);
      if (!ok) x = 0; else if (hi - lo < 1e-12) x = lo; else x = C5.solveX(sp, K);
      var e = [Math.max(0, a0 - x), Math.max(0, b0 - x), Math.max(0, c0 + 2 * x)], names = ["H₂", "I₂", "HI"], ini = [a0, b0, c0];
      var mx = Math.max(1, Math.max.apply(null, e.concat(ini)) * 1.1), x0 = 56, hh = c.H - 66, bw = (c.W - x0 - 20) / 3;
      var Y = function(v){ return 18 + (1 - v / mx) * hh; };
      S.draw.line(c, x0, Y(0), c.W - 10, Y(0), pal.grey, 1.5);
      for (var i = 0; i < 3; i++){
        var bx = x0 + i * bw + 8, w = bw / 2 - 10;
        c.ctx.strokeStyle = pal.grey; c.ctx.lineWidth = 2; c.ctx.strokeRect(bx, Y(ini[i]), w, Y(0) - Y(ini[i]));
        c.ctx.fillStyle = i === 2 ? pal.red : pal.acc; c.ctx.fillRect(bx + w + 4, Y(e[i]), w, Y(0) - Y(e[i]));
        S.draw.text(c, names[i], bx + w, Y(0) + 14, {size: 13}); S.draw.text(c, S.fmt(e[i], 3), bx + w + 4 + w / 2, Y(e[i]) - 8, {size: 12});
      }
      S.draw.text(c, "vide : au départ   plein : à l'équilibre   (mol/L)", c.W / 2, c.H - 8, {size: 12, color: pal.grey});
      S.draw.text(c, "mol/L", 14, 10, {size: 12, color: pal.grey, align: "left"});
      var kk = e[0] * e[1] > 1e-12 ? e[2] * e[2] / (e[0] * e[1]) : NaN;
      ro.set(0, S.fmt(e[0], 3)); ro.set(1, S.fmt(e[1], 3)); ro.set(2, S.fmt(e[2], 3)); ro.set(3, isNaN(kk) ? "—" : S.fmt(kk, 1));
      ro.set(4, !ok ? "—" : x > 1e-9 ? "vers la droite (HI formé)" : x < -1e-9 ? "vers la gauche (HI se décompose)" : "aucune évolution");
      nt.set(!ok ? "Aucune substance au départ : rien à voir." : isNaN(kk) ? "Il manque un réactif et pas de HI : aucune réaction possible, K n'est pas défini ici." : "Vérification : (" + S.fmt(e[2], 3) + ")² / (" + S.fmt(e[0], 3) + " × " + S.fmt(e[1], 3) + ") = " + S.fmt(kk, 1) + ". Change les départs : l'équilibre change, pas K.", isNaN(kk) ? "warn" : "ok");
    });
  }
});

SFA.sim({
  id: "c5-c08-quotient", ch: "c08", tag: "Défi",
  titre: "Q ou K ? Dans quel sens évolue le système",
  resume: "Compare le quotient Q au K ; lance l'évolution et regarde Q rejoindre K.",
  but: "Règle les concentrations actuelles, calcule Q = [HI]²/([H₂][I₂]) et compare à K = 50. Prévois le sens, puis lance l'évolution pour vérifier.",
  aRetenir: "Q a la même forme que K mais avec les concentrations du moment. Q < K : le système évolue vers la droite (plus de produits). Q > K : vers la gauche. Q = K : équilibre. Au cours de l'évolution, Q s'approche de K et l'atteint.",
  piege: "Q et K ne sont égaux qu'à l'équilibre. Q > K ne veut pas dire que la réaction a « fini » : cela veut dire qu'il y a trop de produits par rapport à l'équilibre : la réaction inverse prend le dessus. Les vitesses de la simulation sont arbitraires (seul le résultat final compte).",
  build: function(k, S){
    var pal = S.draw.palette, K = 50, KF = 0.5;
    var c = k.canvas(300), g = k.canvas(190);
    var a = k.slider("[H₂]", 0, 1.5, 0.05, 0.5, "mol/L", function(){ reset(); }), b = k.slider("[I₂]", 0, 1.5, 0.05, 0.5, "mol/L", function(){ reset(); }), d = k.slider("[HI]", 0, 2, 0.05, 1.5, "mol/L", function(){ reset(); });
    var run = false, st = [0.5, 0.5, 1.5], hist = [], tt = 0, speed = 1, tStop = 20, tm = 0, touched = false;
    function step(s, h){ var r = KF * s[0] * s[1] - (KF / K) * s[2] * s[2]; s[0] = Math.max(0, s[0] - r * h); s[1] = Math.max(0, s[1] - r * h); s[2] = Math.max(0, s[2] + 2 * r * h); }
    /* temps (simulé) nécessaire pour atteindre Q = K à 1 % près : règle la vitesse d'animation pour que Q rejoigne K quelles que soient les concentrations */
    function tConv(){
      var s = [a.value, b.value, d.value], t = 0, i;
      for (i = 0; i < 500000; i++){
        if (s[2] === 0 && (s[0] === 0 || s[1] === 0)) return 0;
        if (s[0] * s[1] > 1e-12 && Math.abs(Math.log(s[2] * s[2] / (s[0] * s[1]) / K)) < 0.01) return t;
        step(s, 0.02); t += 0.02;
      }
      return t;
    }
    function reset(){ run = false; tt = 0; st = [a.value, b.value, d.value]; hist = [[0, st[0], st[1], st[2]]]; var tc = tConv(); speed = Math.max(1, tc / 6); tStop = Math.max(20, tc * 1.3); }
    k.button("Laisser évoluer", function(){ reset(); run = true; }, true);
    k.button("Revenir au départ", function(){ reset(); });
    var ro = k.readouts(["Q = [HI]² / ([H₂][I₂])", "K", "Comparaison", "Le système évolue…"]);
    var nt = k.note("", "");
    var tilt = 0;
    k.loop(function(dt, t){
      tm = t;
      if (run){
        var simdt = Math.min(dt, 0.05) * speed, n = Math.max(1, Math.ceil(simdt / 0.02)), h = simdt / n, i;
        for (i = 0; i < n; i++){ step(st, h); tt += h; }
        if (tt - hist[hist.length - 1][0] >= Math.max(0.1, tStop / 300)) hist.push([tt, st[0], st[1], st[2]]);
        if (tt >= tStop) run = false;
      }
      k.redraw();
    }).play();
    k.draw(function(){
      c.clear(); g.clear(); var ctx = c.ctx;
      var H2 = st[0], I2 = st[1], HI = st[2];
      var Q = HI * HI / Math.max(H2 * I2, 1e-12), noReact = (HI === 0 && (H2 === 0 || I2 === 0)), qinf = H2 * I2 <= 1e-9 && HI > 0;
      /* enceinte : les nombres de particules suivent les concentrations */
      var bw = Math.min(230, c.W * 0.5), bh = 150, bx = 10, by = 10, sc = 14;
      C5.gasbox(c, bx, by, bw, bh, [
        {n: Math.min(40, H2 * sc), mol: [[-3.5, 0, 3.6, C5.CPK.H], [3.5, 0, 3.6, C5.CPK.H]]},
        {n: Math.min(40, I2 * sc), mol: [[-6, 0, 6, "#8a5cc4"], [6, 0, 6, "#8a5cc4"]]},
        {n: Math.min(60, HI * sc), mol: [[-4, 0, 3.6, C5.CPK.H], [5, 0, 6, "#8a5cc4"]]}
      ], tm);
      S.draw.legend(c, [["#b9c3d1", "H₂ (petites billes blanches)"], ["#8a5cc4", "I₂ (billes violettes)"], [pal.red, "HI = une blanche + une violette"]], bx, by + bh + 10, {box: false});
      /* balançoire Q / K */
      var rx = bx + bw + 18, rw = c.W - rx - 10, pcx = rx + rw / 2, py = 96;
      var tl = noReact ? 0 : qinf ? 1 : Math.max(-1, Math.min(1, Math.log(Q / K) / Math.LN10 / 2));
      tilt += (tl - tilt) * 0.2; var ang = tilt * 0.32, Lh = Math.min(70, rw / 2 - 12);
      S.draw.panel(c, rx - 6, by, rw + 2, bh, {shadow: false, title: "Balance Q / K"});
      var lx = pcx - Math.cos(ang) * Lh, ly = py + 14 + Math.sin(ang) * Lh * 0.9, rx2 = pcx + Math.cos(ang) * Lh, ry2 = py + 14 - Math.sin(ang) * Lh * 0.9;
      ctx.fillStyle = "#8e9aab"; ctx.beginPath(); ctx.moveTo(pcx, py + 14); ctx.lineTo(pcx - 12, py + 56); ctx.lineTo(pcx + 12, py + 56); ctx.closePath(); ctx.fill();
      S.draw.line(c, lx, ly, rx2, ry2, "#2c3a4e", 5);
      C5.atom(c, lx, ly - 4, 14, pal.red, "Q", "#ffffff"); C5.atom(c, rx2, ry2 - 4, 14, "#8a95a3", "K", "#ffffff");
      S.draw.text(c, noReact ? "Q indéfini" : "Q = " + (qinf ? "∞" : S.fmt(Q, Q < 10 ? 2 : 1)), pcx, by + 34, {size: 13, color: pal.red}); 
      /* sens de la réaction */
      var sens = noReact ? "aucune réaction" : Math.abs(Math.log(Q / K)) < 0.02 && !qinf ? "reste à l'équilibre" : (Q < K && !qinf) ? "vers la droite" : "vers la gauche";
      var yy = by + bh + 44;
      S.draw.label(c, sens === "vers la droite" ? "H₂ + I₂ → 2 HI  (sens direct)" : sens === "vers la gauche" ? "H₂ + I₂ ← 2 HI  (sens inverse)" : noReact ? "pas de réaction" : "H₂ + I₂ ⇌ 2 HI  (équilibre)", c.W / 2, yy, {color: sens === "vers la droite" ? pal.green : sens === "vers la gauche" ? pal.amber : pal.acc, size: 14});
      /* échelle logarithmique */
      var x0 = 30, x1 = c.W - 30, y = yy + 56, mid = (x0 + x1) / 2, lg = function(v){ return Math.max(-2, Math.min(2, Math.log(v / K) / Math.LN10)); }, X = function(l){ return mid + l / 2 * (x1 - x0) / 2; };
      ctx.fillStyle = "#cfe4d8"; ctx.fillRect(x0, y - 9, mid - x0, 18); ctx.fillStyle = "#f6d9a8"; ctx.fillRect(mid, y - 9, x1 - mid, 18);
      S.draw.text(c, "Q < K : droite →", (x0 + mid) / 2, y - 22, {size: 11.5, color: pal.green}); S.draw.text(c, "← Q > K : gauche", (mid + x1) / 2, y - 22, {size: 11.5, color: pal.amber});
      S.draw.line(c, mid, y - 14, mid, y + 14, pal.ink, 2); S.draw.text(c, "Q = K", mid, y + 26, {size: 12});
      var xm = noReact ? mid : qinf ? x1 : X(lg(Math.max(Q, 1e-12)));
      S.draw.dot(c, xm, y, 10, pal.red); S.draw.text(c, "Q", xm, y, {size: 11, color: "#ffffff"});
      var ax = S.draw.axes(g, {x0: 0, x1: Math.max(5, tt * 1.1), y0: 0, y1: Math.max(1.6, a.value, b.value, d.value, st[2] * 1.1), xl: "t (unités arbitraires)", l: 40, t: 20});
      S.draw.text(g, "concentrations (mol/L)", 46, 10, {size: 12, align: "left", color: pal.grey});
      var cols = [pal.acc, pal.violet, pal.red], lab = ["H₂", "I₂", "HI"];
      for (var s = 0; s < 3; s++){ for (var i = 1; i < hist.length; i++) S.draw.line(g, ax.X(hist[i - 1][0]), ax.Y(hist[i - 1][s + 1]), ax.X(hist[i][0]), ax.Y(hist[i][s + 1]), cols[s], 2.4); S.draw.dot(g, ax.X(tt), ax.Y(st[s]), 4.5, cols[s]); S.draw.text(g, lab[s], ax.X(ax.x1) - 4, ax.Y(st[s]) - 8, {size: 12, color: cols[s], align: "right"}); }
      ro.set(0, noReact ? "—" : qinf ? "→ ∞ (un réactif absent)" : S.fmt(Q, Q < 10 ? 2 : 1)); ro.set(1, "50"); ro.set(2, noReact ? "—" : (Math.abs(Math.log(Q / K)) < 0.02 && !qinf) ? "Q = K" : (Q < K && !qinf) ? "Q < K" : "Q > K"); ro.set(3, sens);
      nt.set(noReact ? "Sans HI et sans l'un des réactifs, rien ne peut se produire." : run ? "Observe Q se rapprocher de K : la balance se remet à l'horizontale." : "Prévois : " + sens + ". Puis appuie sur « Laisser évoluer » pour vérifier.", "");
    });
    reset();
  }
});

SFA.sim({
  id: "c5-c08-no2", ch: "c08", tag: "Niche utile",
  titre: "N₂O₄ ⇌ 2 NO₂ : la couleur d'un équilibre",
  resume: "Le gaz brun NO₂ et le gaz incolore N₂O₄ : température et pression changent la couleur.",
  but: "Monte la température : le mélange brunit. Puis change la pression et observe la couleur et la valeur de K. Quelle grandeur modifie K ?",
  aRetenir: "N₂O₄ (incolore) ⇌ 2 NO₂ (brun) est endothermique (ΔH ≈ +57 kJ/mol) : plus chaud → plus de NO₂, K augmente. Une pression plus grande favorise le côté qui a le moins de molécules de gaz (N₂O₄), mais K ne change pas : seule la température modifie K.",
  piege: "Pression et température n'agissent pas pareil : la pression déplace l'équilibre sans changer K ; la température change K lui-même. Modèle simplifié : gaz parfaits, ΔH constant, départ de N₂O₄ pur ; K_p(25 °C) ≈ 0,15 (en bar).",
  build: function(k, S){
    var pal = S.draw.palette, R = 8.31, DH = 57200, K298 = 0.148;
    var c = k.canvas(230), g = k.canvas(170);
    var T = k.slider("Température", 0, 100, 1, 25, "°C");
    var P = k.slider("Pression totale", 0.2, 5, 0.1, 1, "bar");
    var ro = k.readouts(["K_p à cette température", "Taux de dissociation α", "Fraction de NO₂ dans le gaz", "Couleur"]);
    var nt = k.note("", "");
    function Kp(t){ return K298 * Math.exp(DH / R * (1 / 298 - 1 / (t + 273))); }
    function alpha(t, p){ var kp = Kp(t); return Math.sqrt(kp / (kp + 4 * p)); }
    var tm = 0, lp = k.loop(function(dt, t){ tm = t; k.redraw(); }); lp.play();
    var rnd = C5.rng(11), seeds = []; for (var i = 0; i < 24; i++) seeds.push([rnd(), rnd(), rnd() * 6.28, rnd()]);
    k.draw(function(){
      c.clear(); g.clear();
      var al = alpha(T.value, P.value), xn = 2 * al / (1 + al), kp = Kp(T.value), ctx = c.ctx;
      var br = Math.round(255 - xn * 120), gg = Math.round(255 - xn * 175), bl = Math.round(255 - xn * 245);
      ctx.fillStyle = "rgb(" + br + "," + gg + "," + bl + ")"; ctx.fillRect(10, 10, c.W - 20, c.H - 20); ctx.strokeStyle = pal.ink; ctx.lineWidth = 2.5; ctx.strokeRect(10, 10, c.W - 20, c.H - 20);
      var nN2O4 = Math.round(12 * (1 - al)), nNO2 = Math.round(24 * al), idx = 0;
      for (var a = 0; a < nN2O4; a++, idx++){ var s = seeds[idx % 24], x = 30 + ((s[0] + Math.sin(tm * 0.6 + s[2]) * 0.05 + 1) % 1) * (c.W - 60), y = 30 + ((s[1] + Math.cos(tm * 0.5 + s[2]) * 0.05 + 1) % 1) * (c.H - 60);
        S.draw.line(c, x - 6, y, x + 6, y, pal.ink, 3); C5.atom(c, x - 8, y, 6, "#d6dde8", ""); C5.atom(c, x + 8, y, 6, "#d6dde8", ""); }
      for (var b = 0; b < nNO2; b++, idx++){ var s2 = seeds[(idx + 7) % 24], x2 = 30 + ((s2[0] + 0.37 * b / 24 + Math.sin(tm * 0.7 + s2[2]) * 0.06 + 2) % 1) * (c.W - 60), y2 = 30 + ((s2[1] + 0.21 * b / 24 + Math.cos(tm * 0.6 + s2[2]) * 0.06 + 2) % 1) * (c.H - 60); C5.atom(c, x2, y2, 6.5, "#b5651d", ""); }
      S.draw.text(c, "▬ N₂O₄ (incolore)    ● NO₂ (brun)", c.W / 2, c.H - 4 - 8, {size: 12, color: pal.ink, bg: "rgba(255,255,255,.7)"});
      var ax = S.draw.axes(g, {x0: 0, x1: 100, y0: 0, y1: 1, xl: "T (°C)", stepX: 20, stepY: 0.25, l: 44, t: 22});
      S.draw.text(g, "α (dissociation) à la pression choisie", 48, 10, {size: 12, align: "left", color: pal.grey});
      S.draw.fn(g, ax, function(t){ return alpha(t, P.value); }, pal.red, 2.6); S.draw.dot(g, ax.X(T.value), ax.Y(al), 7, pal.ink);
      ro.set(0, S.sci(kp, 3) + " bar"); ro.set(1, S.fmt(al * 100, 1) + " %"); ro.set(2, S.fmt(xn * 100, 0) + " %"); ro.set(3, xn < 0.1 ? "presque incolore" : xn < 0.4 ? "jaune-brun pâle" : xn < 0.75 ? "brun" : "brun foncé");
      nt.set("Kp = 4α²·P/(1 − α²) = " + S.sci(kp, 3) + " : K dépend de T seulement. À P = " + S.fmt(P.value, 1) + " bar, α = " + S.fmt(al * 100, 1) + " %.", "");
    });
  }
});
