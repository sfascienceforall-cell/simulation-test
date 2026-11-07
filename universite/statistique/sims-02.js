/* Biostatistique BA1 · chapitre 2 : probabilités */
(function(){
var P = SFA.draw.palette, F = SFA.fmt, ST = SFA.st;
var rng = ST.rng;
function frac(num, den){ return num + "/" + den; }

/* 1 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-frequence", ch: "c02", tag: "Loi des grands nombres",
  titre: "La fréquence se stabilise : jusqu'à quand les écarts durent-ils ?",
  resume: "Lance des essais de probabilité p : sept séries en parallèle, la fréquence converge, lentement et sans monotonie.",
  but: "Choisis p (par exemple la probabilité qu'un traitement guérisse) et lance l'animation : la série en rouge est la tienne, les six autres montrent que chaque série a sa propre trajectoire.",
  aRetenir: "La fréquence relative tend vers p quand n grandit (loi des grands nombres). Les fluctuations sont de l'ordre de √(p(1−p)/n) : 100 fois plus d'essais pour 10 fois moins d'écart.",
  piege: "La loi des grands nombres ne « rattrape » pas les écarts passés : après une série de succès, la probabilité du prochain essai reste p.",
  build: function(k, S){
    var c = ST.canvas(k, 330, .85, 460), N = 5000, NR = 7, runs, last, acc = 0, streak, bestStreak;
    function reset(){ runs = []; for (var i = 0; i < NR; i++) runs.push([0]); last = []; streak = 0; bestStreak = 0; acc = 0; }
    reset();
    var p = k.slider("Probabilité p de succès", 0.05, 0.95, 0.05, 0.3, "", function(){ reset(); });
    var speed = k.seg("Vitesse", [[15, "lent"], [150, "normal"], [1500, "rapide"]], 150);
    function step(m){ var pv = p.value;
      for (var i = 0; i < m && runs[0].length <= N; i++){
        runs.forEach(function(r, q){ var ok = Math.random() < pv ? 1 : 0; r.push(r[r.length - 1] + ok); if (q === 0){ last.push(ok); if (last.length > 60) last.shift(); streak = ok ? streak + 1 : 0; if (streak > bestStreak) bestStreak = streak; } });
      } }
    var ani = k.loop(function(dt){ acc += dt * speed.value; var m = Math.floor(acc); acc -= m; if (m) step(m); if (runs[0].length > N) ani.pause(); k.redraw(); });
    k.button("Lancer / pause", function(){ if (ani.running) ani.pause(); else if (runs[0].length <= N) ani.play(); }, true);
    k.button("+ 10 essais", function(){ step(10); }); k.button("+ 1000", function(){ step(1000); }); k.button("Recommencer", function(){ ani.pause(); reset(); });
    var ro = k.readouts(["Essais n", "Succès", "Fréquence f", "|f − p|"]);
    var nt = k.note("Lance l'animation : chaque série démarre à 0 ou 1 (la fréquence saute) puis se resserre autour de p.", "");
    k.draw(function(){
      c.clear();
      var L = 48, R = 14, T = 14, B = 62, W = c.W, H = c.H, ctx = c.ctx, pv = p.value;
      function X(n){ return L + Math.log(Math.max(1, n)) / Math.log(N) * (W - L - R); }
      function Y(f){ return H - B - f * (H - T - B); }
      ctx.save(); ctx.font = "600 11.5px Mulish, system-ui"; ctx.fillStyle = "#6b7685"; ctx.strokeStyle = P.grid; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var g = 0; g <= 1.0001; g += 0.2){ ctx.beginPath(); ctx.moveTo(L, Math.round(Y(g)) + .5); ctx.lineTo(W - R, Math.round(Y(g)) + .5); ctx.stroke(); ctx.fillText(F(g, 1), L - 7, Y(g)); }
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [1, 10, 100, 1000, 5000].forEach(function(n){ ctx.beginPath(); ctx.moveTo(Math.round(X(n)) + .5, T); ctx.lineTo(Math.round(X(n)) + .5, H - B); ctx.stroke(); ctx.fillText(n, X(n), H - B + 6); });
      ctx.restore();
      S.draw.text(c, "nombre d'essais n (échelle logarithmique)", W - R, H - B + 28, {size: 11.5, align: "right", color: "#3d4b5f"});
      /* couloir ±2√(p(1−p)/n) */
      ctx.save(); ctx.fillStyle = S.draw.tint(P.mat, .13); ctx.beginPath();
      var n, e, st = 1.12;
      for (n = 1; n <= N; n = Math.ceil(n * st)){ e = 2 * Math.sqrt(pv * (1 - pv) / n); var yy = Y(Math.min(1, pv + e)); if (n === 1) ctx.moveTo(X(n), yy); else ctx.lineTo(X(n), yy); }
      ctx.lineTo(X(N), Y(Math.min(1, pv + 2 * Math.sqrt(pv * (1 - pv) / N))));
      for (n = N; n >= 1; n = Math.floor(n / st)){ e = 2 * Math.sqrt(pv * (1 - pv) / n); ctx.lineTo(X(n), Y(Math.max(0, pv - e))); if (n === 1) break; }
      ctx.closePath(); ctx.fill(); ctx.restore();
      S.draw.line(c, L, Y(pv), W - R, Y(pv), P.ink, 1.5, [6, 4]);
      S.draw.label(c, "p = " + F(pv, 2), W - R - 4, Y(pv) - 12, {color: P.ink, align: "right", size: 11});
      var m = runs[0].length - 1;
      function path(r, col, w){
        var mm = r.length - 1; if (mm < 1) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; ctx.beginPath();
        var stp = Math.max(1, Math.floor(mm / 600)); for (var i = 1; i <= mm; i += stp){ var f = r[i] / i; if (i === 1) ctx.moveTo(X(i), Y(f)); else ctx.lineTo(X(i), Y(f)); } ctx.lineTo(X(mm), Y(r[mm] / mm)); ctx.stroke(); ctx.restore(); }
      for (var q = 1; q < NR; q++) path(runs[q], S.draw.tint(P.mat, .5), 1.4);
      path(runs[0], P.red, 2.4);
      if (m >= 1) S.draw.dot(c, X(m), Y(runs[0][m] / m), 5, P.red);
      S.draw.legend(c, [[P.red, "ta série"], [S.draw.tint(P.mat, .7), "6 autres séries"], [S.draw.tint(P.mat, .3), "couloir ± 2 écarts typiques"]], W - R - 4, T + 20, {align: "right"});
      /* bande des 60 derniers essais */
      var ty = H - 20, cw = Math.min(10, (W - L - R) / 60);
      S.draw.text(c, "derniers essais :", L, ty - 11, {size: 10.5, align: "left", color: "#6b7685"});
      last.forEach(function(o, i){ ctx.fillStyle = o ? P.green : S.draw.tint(P.grey, .45); S.draw.rrect(c, L + i * cw, ty - 3, cw - 1.5, 13, 3); ctx.fill(); });
      ro.set(0, m); ro.set(1, m ? runs[0][m] : "—"); ro.set(2, m ? F(runs[0][m] / m, 4) : "—"); ro.set(3, m ? F(Math.abs(runs[0][m] / m - pv), 4) : "—");
      if (m) nt.set("Après " + m + " essais : fréquence " + F(runs[0][m] / m, 3) + " pour p = " + F(pv, 2) + ". Écart typique attendu : " + F(Math.sqrt(pv * (1 - pv) / m), 4) + " (couloir = ± 2 écarts typiques). Plus longue série de succès : " + bestStreak + " — mais le prochain essai reste à p.", "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-venn", ch: "c02", tag: "Événements",
  titre: "Union, intersection, incompatibles ou indépendants ?",
  resume: "Un carré d'aire 1 découpé en quatre zones : glisse les frontières, lis P(A∪B), P(A|B) et le verdict d'indépendance.",
  but: "Le carré est l'ensemble de tous les cas (aire 1). Glisse la frontière verticale (P(A)) et les deux frontières de B (P(B|A) à gauche, P(B|non A) à droite) : A et B sont indépendants quand les deux frontières sont à la même hauteur.",
  aRetenir: "P(A∪B) = P(A) + P(B) − P(A∩B). Incompatibles : P(A∩B) = 0. Indépendants : P(A∩B) = P(A)·P(B), c'est-à-dire P(B|A) = P(B|non A) : mêmes frontières.",
  piege: "Incompatibles et indépendants sont presque l'opposé : deux événements incompatibles de probabilités non nulles sont dépendants (si A arrive, B n'arrive pas).",
  build: function(k, S){
    var c = ST.canvas(k, 330, .82, 440);
    var pa = k.slider("P(A)", 0.05, 0.95, 0.01, 0.4, ""), b1 = k.slider("P(B | A)", 0, 1, 0.01, 0.5, ""), b0 = k.slider("P(B | non A)", 0, 1, 0.01, 0.5, "");
    k.button("Rendre A et B indépendants", function(){ b0.set(b1.value); }, true);
    k.button("Rendre A et B incompatibles", function(){ b1.set(0); });
    var ro = k.readouts(["P(A∩B)", "P(A∪B)", "P(A|B)", "P(A)·P(B)"]);
    var nt = k.note("", "");
    var lay = {};
    ST.drag(c, function(){ if (!lay.s) return [];
      var s = lay.s, a = pa.value;
      return [{id: "a", x: lay.X0 + a * s, y: lay.Y0 - 2, r: 16}, {id: "b1", x: lay.X0 + a * s / 2, y: lay.Y0 + b1.value * s, r: 16}, {id: "b0", x: lay.X0 + a * s + (1 - a) * s / 2, y: lay.Y0 + b0.value * s, r: 16}]; },
      function(id, p){ var s = lay.s;
        if (id === "a") pa.set(ST.clamp(Math.round((p.x - lay.X0) / s * 100) / 100, .05, .95));
        else if (id === "b1") b1.set(ST.clamp(Math.round((p.y - lay.Y0) / s * 100) / 100, 0, 1));
        else b0.set(ST.clamp(Math.round((p.y - lay.Y0) / s * 100) / 100, 0, 1)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var a = pa.value, x1 = b1.value, x0 = b0.value, pab = a * x1, pb = pab + (1 - a) * x0, pu = a + pb - pab, ctx = c.ctx;
      var s = Math.min(c.W - 70, c.H - 70), X0 = (c.W - s) / 2, Y0 = 26; lay.s = s; lay.X0 = X0; lay.Y0 = Y0;
      var wA = a * s, hA = x1 * s, hN = x0 * s;
      function rect(xx, yy, w, h, col, lab){ ctx.fillStyle = col; ctx.fillRect(xx, yy, w, h); if (lab && w > 44 && h > 17) S.draw.text(c, lab, xx + w / 2, yy + h / 2, {size: 12, color: P.ink}); }
      rect(X0, Y0, wA, hA, S.draw.tint(P.violet, .55), "A∩B  " + F(pab, 2));
      rect(X0, Y0 + hA, wA, s - hA, S.draw.tint(P.mat, .34), "A seul  " + F(a - pab, 2));
      rect(X0 + wA, Y0, s - wA, hN, S.draw.tint(P.orange, .45), "B seul  " + F(pb - pab, 2));
      rect(X0 + wA, Y0 + hN, s - wA, s - hN, S.draw.tint(P.grey, .22), "ni A ni B  " + F(1 - pu, 2));
      /* niveau de B qui rendrait A et B indépendants (colonne non A) */
      S.draw.line(c, X0 + wA, Y0 + hA, X0 + s, Y0 + hA, P.violet, 1.6, [5, 4]);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.strokeRect(X0, Y0, s, s); S.draw.line(c, X0 + wA, Y0, X0 + wA, Y0 + s, P.ink, 2);
      S.draw.label(c, "A  (" + F(a, 2) + ")", X0 + wA / 2, Y0 + s + 18, {color: P.mat, size: 12.5}); S.draw.label(c, "non A  (" + F(1 - a, 2) + ")", X0 + wA + (s - wA) / 2, Y0 + s + 18, {color: "#4a5a6e", size: 12.5});
      S.draw.label(c, "B", X0 - 18, Y0 + (Math.max(hA, hN)) / 2, {color: P.orange, size: 13});
      /* poignées */
      S.draw.dot(c, X0 + wA, Y0 - 2, 8, P.ink); S.draw.dot(c, X0 + wA / 2, Y0 + hA, 8, P.violet); S.draw.dot(c, X0 + wA + (s - wA) / 2, Y0 + hN, 8, P.orange);
      ST.hint(c, "glisse les poignées", c.W - 82, 12, P.mat);
      var indep = Math.abs(pab - a * pb) < 0.0051;
      ro.set(0, F(pab, 3)); ro.set(1, F(pu, 3)); ro.set(2, pb > 0 ? F(pab / pb, 3) : "—"); ro.set(3, F(a * pb, 3));
      if (pab === 0) nt.set("Incompatibles : A et B ne peuvent pas arriver ensemble (la zone violette disparaît). Ils sont dépendants, car P(A|B) = 0 ≠ P(A) = " + F(a, 2) + ".", "warn");
      else if (indep) nt.set("Indépendants : les deux frontières de B sont à la même hauteur, P(A|B) = P(A) = " + F(a, 2) + ". Savoir que B arrive ne change rien à la probabilité de A.", "ok");
      else nt.set("Dépendants : P(A|B) = " + F(pab / pb, 2) + (pab / pb > a ? " > " : " < ") + "P(A) = " + F(a, 2) + " (B " + (pab / pb > a ? "favorise" : "défavorise") + " A). Frontières à des hauteurs différentes : " + F(x1, 2) + " contre " + F(x0, 2) + ".", "warn");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-arbre", ch: "c02", tag: "Arbre",
  titre: "Arbre de probabilités : avec ou sans remise",
  resume: "Deux tirages dans une urne : les branches, la multiplication le long du chemin, puis une vraie série de tirages.",
  but: "Choisis le contenu de l'urne et le mode de tirage ; l'épaisseur d'une branche est proportionnelle à sa probabilité. Tire des paires et compare la fréquence observée au résultat du calcul.",
  aRetenir: "Le long d'un chemin, on multiplie les probabilités conditionnelles ; entre chemins, on additionne. Sans remise, la 2e probabilité dépend du 1er résultat.",
  piege: "Sans remise, la probabilité que la 2e boule soit rouge vaut quand même R/(R+B) avant d'avoir regardé la 1re : par symétrie, l'ordre ne compte pas.",
  build: function(k, S){
    var c = ST.canvas(k, 350, .95, 470);
    var cnt = {RR: 0, RB: 0, BR: 0, BB: 0}, tot = 0, lastp = "";
    function reset(){ cnt = {RR: 0, RB: 0, BR: 0, BB: 0}; tot = 0; lastp = ""; }
    var R = k.slider("Boules rouges R", 1, 10, 1, 5, "", reset), B = k.slider("Boules bleues B", 1, 10, 1, 3, "", reset);
    var rem = k.toggle("Avec remise", false, reset);
    function pair(){
      var r = R.value, b = B.value, n = r + b, first = Math.random() * n < r ? "R" : "B", rr = r - (first === "R" && !rem.value ? 1 : 0), bb = b - (first === "B" && !rem.value ? 1 : 0), second = Math.random() * (rr + bb) < rr ? "R" : "B";
      cnt[first + second]++; tot++; lastp = first + second; }
    k.button("Tirer 1 paire", function(){ pair(); }, true); k.button("Tirer 500 paires", function(){ for (var i = 0; i < 500; i++) pair(); }); k.button("Recommencer", reset);
    var ro = k.readouts(["P(2 rouges)", "P(1 de chaque)", "P(2 bleues)", "P(2e rouge)"]);
    var nt = k.note("", "");
    k.draw(function(){
      c.clear();
      var r = R.value, b = B.value, n = r + b, wr = rem.value;
      var n2 = wr ? n : n - 1, rr = wr ? r : r - 1, bb = wr ? b : b - 1;
      var W = c.W, H = c.H, ctx = c.ctx, narrow = W < 420, x0 = narrow ? 38 : 58, x1 = W * (narrow ? .32 : .34), x2 = W * (narrow ? .56 : .6), yy = [H * 0.3, H * 0.74];
      var leaves = [[H * 0.18, "RR", r / n * rr / n2, frac(r, n) + " × " + frac(rr, n2)], [H * 0.42, "RB", r / n * (n2 - rr) / n2, frac(r, n) + " × " + frac(n2 - rr, n2)],
        [H * 0.66, "BR", b / n * (n2 - bb) / n2, frac(b, n) + " × " + frac(n2 - bb, n2)], [H * 0.9, "BB", b / n * bb / n2, frac(b, n) + " × " + frac(bb, n2)]];
      var cols = [P.red, P.mat];
      /* urne : boules rangées en pile */
      var ux = 8, uy = 8, uw = narrow ? 62 : 84, uh = narrow ? 54 : 66;
      S.draw.panel(c, ux, uy, uw, uh, {shadow: false, radius: 8});
      var tb = r + b, rad = Math.min(8, (uw - 12) / 5 / 1.05);
      for (var q = 0; q < tb; q++){ var col = q < r ? P.red : P.mat; c.ctx.beginPath(); c.ctx.arc(ux + 9 + (q % 5) * (rad * 2.1) + rad, uy + 12 + Math.floor(q / 5) * (rad * 2.1) + rad, rad, 0, 6.2832); c.ctx.fillStyle = col; c.ctx.fill(); }
      S.draw.text(c, wr ? "avec remise" : "sans remise", ux + uw / 2, uy + uh - 7, {size: 9.5, color: "#6b7685"});
      var rootY = H * 0.54;
      yy.forEach(function(y, i){ var pr = i ? b / n : r / n; S.draw.line(c, x0, rootY, x1, y, S.draw.tint(cols[i], .85), 2 + 9 * pr);
        S.draw.dot(c, x1, y, 5.5, cols[i]); S.draw.label(c, i ? frac(b, n) : frac(r, n), (x0 + x1) / 2 - 2, (rootY + y) / 2 + (i ? 15 : -15), {color: cols[i], size: 12}); });
      S.draw.dot(c, x0, rootY, 6, P.ink);
      leaves.forEach(function(l, i){
        var y1 = yy[i < 2 ? 0 : 1], isR = (i === 0 || i === 2), col = isR ? P.red : P.mat, lab = i === 0 ? frac(rr, n2) : i === 1 ? frac(n2 - rr, n2) : i === 2 ? frac(n2 - bb, n2) : frac(bb, n2);
        var pr = i === 0 ? rr / n2 : i === 1 ? (n2 - rr) / n2 : i === 2 ? (n2 - bb) / n2 : bb / n2;
        S.draw.line(c, x1, y1, x2, l[0], S.draw.tint(col, .85), 2 + 9 * pr); S.draw.dot(c, x2, l[0], 5.5, col);
        S.draw.label(c, lab, (x1 + x2) / 2, (y1 + l[0]) / 2 + (i % 2 ? 13 : -13), {color: col, size: 12});
        var hl = lastp === l[1];
        S.draw.text(c, l[1] + " = " + F(l[2], 4), x2 + 12, l[0] - 9, {size: 12.5, align: "left", color: hl ? P.orange : P.ink});
        S.draw.text(c, l[3], x2 + 12, l[0] + 6, {size: 10.5, align: "left", color: "#6b7685", weight: 600});
        if (tot){ var o = cnt[l[1]] / tot, bw = Math.max(0, W - x2 - 24), hh = 6, by = l[0] + 16;
          ctx.fillStyle = S.draw.tint(P.grey, .25); ctx.fillRect(x2 + 12, by, bw, hh); ctx.fillStyle = S.draw.tint(P.orange, .85); ctx.fillRect(x2 + 12, by, bw * o, hh);
          S.draw.line(c, x2 + 12 + bw * l[2], by - 2, x2 + 12 + bw * l[2], by + hh + 2, P.ink, 1.5); }
      });
      if (tot) S.draw.label(c, "observé sur " + tot + " paires (barre orange) ; trait noir : calcul", W - 10, 14, {color: P.orange, align: "right", size: 10.5});
      var pRR = leaves[0][2], pMix = leaves[1][2] + leaves[2][2], pBB = leaves[3][2];
      ro.set(0, F(pRR, 4)); ro.set(1, F(pMix, 4)); ro.set(2, F(pBB, 4)); ro.set(3, F(leaves[0][2] + leaves[2][2], 4));
      nt.set(wr ? "Avec remise : les deux tirages sont indépendants, P(2 rouges) = (R/N)² = " + F(Math.pow(r / n, 2), 4) + ". Les branches du 2e étage sont les mêmes quelle que soit la 1re boule." : "Sans remise : après une rouge il reste " + rr + " rouge(s) sur " + n2 + " ; après une bleue, " + r + " sur " + n2 + ". Les tirages sont dépendants. Vérifie que P(2e rouge) = " + frac(r, n) + " = " + F(r / n, 4) + ".", wr ? "ok" : "warn");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-contingence", ch: "c02", tag: "Tableau de contingence",
  titre: "Dépendance ou indépendance dans un tableau 2×2",
  resume: "Exposition et maladie : un diagramme en mosaïque où les aires sont les effectifs, à comparer à l'indépendance.",
  but: "Chaque colonne est un groupe (largeur = effectif), la partie rouge est la part de malades. Glisse la frontière entre les groupes ou le haut de chaque zone rouge : à l'indépendance, les deux zones rouges ont la même hauteur.",
  aRetenir: "Indépendance : P(M|E) = P(M|non E) = P(M). Effectif attendu = (total de la ligne × total de la colonne) / N. Plus l'observé s'écarte de l'attendu, plus la dépendance est marquée.",
  piege: "P(M|E) et P(E|M) sont deux probabilités différentes : parmi les malades, 80 % d'exposés ne signifie pas que 80 % des exposés tombent malades.",
  build: function(k, S){
    var c = ST.canvas(k, 400, 1.02, 520);
    var nE = k.slider("Effectif des exposés", 50, 500, 10, 200, ""), nN = k.slider("Effectif des non-exposés", 50, 500, 10, 300, "");
    var rE = k.slider("Risque chez les exposés", 1, 60, 1, 30, "%"), rN = k.slider("Risque chez les non-exposés", 1, 60, 1, 10, "%");
    k.button("Rendre les risques égaux (indépendance)", function(){ var N = nE.value + nN.value; var a = Math.round(nE.value * rE.value / 100), cc = Math.round(nN.value * rN.value / 100); rN.set(Math.round((a + cc) / N * 100)); rE.set(Math.round((a + cc) / N * 100)); }, true);
    var ro = k.readouts(["P(M|E)", "P(M|non E)", "P(M)", "Risque relatif"]);
    var nt = k.note("", "");
    var lay = {}, YMAX = .7;
    ST.drag(c, function(){ if (!lay.s) return []; var tE = nE.value, tN = nN.value, N = tE + tN, wE = tE / N * lay.w;
      return [{id: "div", x: lay.x0 + wE, y: lay.y0 + lay.h + 4, r: 16}, {id: "rE", x: lay.x0 + wE / 2, y: lay.y0 + lay.h - lay.h * Math.min(1, rE.value / 100 / YMAX)},
        {id: "rN", x: lay.x0 + wE + (lay.w - wE) / 2, y: lay.y0 + lay.h - lay.h * Math.min(1, rN.value / 100 / YMAX)}]; },
      function(id, p){
        if (id === "div"){ var sh = ST.clamp((p.x - lay.x0) / lay.w, .1, .9), tN = nN.value, nv = Math.round(sh / (1 - sh) * tN / 10) * 10; nE.set(ST.clamp(nv, 50, 500)); }
        else { var rv = ST.clamp(Math.round((lay.y0 + lay.h - p.y) / lay.h * YMAX * 100), 1, 60); (id === "rE" ? rE : rN).set(rv); }
        k.redraw(); });
    k.draw(function(){
      c.clear();
      var tE = nE.value, tN = nN.value, a = Math.round(tE * rE.value / 100), b = tE - a, cc = Math.round(tN * rN.value / 100), d = tN - cc, N = tE + tN, nm = a + cc;
      var pE = a / tE, pN = cc / tN, pM = nm / N, ctx = c.ctx, W = c.W;
      /* mosaïque : hauteur 100 % = taux 70 % (zoom sur le bas) */
      var x0 = 44, w = W - x0 - 14, y0 = 26, h = Math.round(c.H * 0.46); lay.x0 = x0; lay.w = w; lay.y0 = y0; lay.h = h; lay.s = 1;
      var wE = tE / N * w, gap = 3;
      function col(x, wd, p, name, colr){
        var hp = h * Math.min(1, p / YMAX);
        ctx.fillStyle = S.draw.tint(P.green, .14); ctx.fillRect(x, y0, wd, h);
        ctx.fillStyle = S.draw.tint(P.red, .72); ctx.fillRect(x, y0 + h - hp, wd, hp);
        S.draw.text(c, F(p * 100, 1) + " % malades", x + wd / 2, y0 + h - hp - 24, {size: 12, color: P.red});
        S.draw.text(c, name, x + wd / 2, y0 + h + 16, {size: 12.5, color: colr});
      }
      col(x0, wE - gap, pE, "exposés (" + tE + ")", P.mat); col(x0 + wE + gap, w - wE - gap, pN, "non-exposés (" + tN + ")", P.orange);
      /* niveau attendu sous indépendance */
      S.draw.line(c, x0, y0 + h - h * Math.min(1, pM / YMAX), x0 + w, y0 + h - h * Math.min(1, pM / YMAX), P.ink, 1.8, [6, 4]);
      S.draw.label(c, "P(M) = " + F(pM * 100, 1) + " % : niveau si indépendants", x0 + w - 4, y0 + h - h * Math.min(1, pM / YMAX) - 26, {color: P.ink, align: "right", size: 10.5});
      S.draw.text(c, "% de malades", x0 - 6, y0 - 12, {size: 10.5, align: "left", color: "#6b7685"});
      /* poignées */
      S.draw.dot(c, x0 + wE, y0 + h + 4, 8, P.ink); S.draw.dot(c, x0 + wE / 2, y0 + h - h * Math.min(1, pE / YMAX), 8, P.red); S.draw.dot(c, x0 + wE + (w - wE) / 2, y0 + h - h * Math.min(1, pN / YMAX), 8, P.red);
      ST.hint(c, "glisse les poignées", W - 84, 12, P.mat);
      /* tableau observé / attendu */
      var ty = y0 + h + 44, cw = Math.min(104, (W - 28) / 4), tx = 14, rh = 28;
      var ex = [tE * nm / N, tE * (N - nm) / N, tN * nm / N, tN * (N - nm) / N];
      var head = ["", "Malades", "Sains", "Total"], rows = [["Exposés", a, b, tE, ex[0], ex[1]], ["Non-exp.", cc, d, tN, ex[2], ex[3]], ["Total", nm, N - nm, N]];
      ctx.save(); ctx.font = "800 11px Mulish, system-ui"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
      head.forEach(function(hh, j){ ctx.fillStyle = "#6b7685"; ctx.fillText(hh.toUpperCase(), tx + cw * (j + .5), ty + rh / 2 - 4); });
      rows.forEach(function(rw, i){
        var yy = ty + rh * (i + 1) - 2; ctx.fillStyle = i < 2 ? "#f3f6fa" : "#e8edf3"; ctx.fillRect(tx, yy, cw * 4 - 4, rh - 3);
        ctx.fillStyle = P.ink; ctx.textAlign = "left"; ctx.font = "700 12px Mulish, system-ui"; ctx.fillText(rw[0], tx + 6, yy + rh / 2 - 1); ctx.textAlign = "center";
        for (var j = 1; j < 4; j++){ ctx.font = "700 13px Mulish, system-ui"; ctx.fillStyle = P.ink; ctx.fillText(rw[j], tx + cw * (j + .5), yy + rh / 2 - (i < 2 && j < 3 ? 4 : 1));
          if (i < 2 && j < 3){ ctx.font = "600 10px Mulish, system-ui"; ctx.fillStyle = P.teal; ctx.fillText("att. " + F(rw[3 + j], 1), tx + cw * (j + .5), yy + rh / 2 + 8); } }
      });
      ctx.restore();
      ro.set(0, F(pE, 3)); ro.set(1, F(pN, 3)); ro.set(2, F(pM, 3)); ro.set(3, F(pE / pN, 2));
      var same = Math.abs(pE - pN) < 0.005;
      nt.set(same ? "Risques égaux : les effectifs observés coïncident avec les attendus (en bleu-vert). M et E sont indépendants (aux arrondis près)." : "Les risques diffèrent (RR = " + F(pE / pN, 2) + ") : " + a + " exposés malades observés contre " + F(ex[0], 1) + " attendus sous indépendance. M et E sont dépendants dans cet échantillon ; savoir si l'écart est dû au hasard relève d'un test (chapitre 9).", same ? "ok" : "warn");
    });
  }
});

/* 5 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c02-anniversaire", ch: "c02", tag: "Contre-intuitif",
  titre: "Le paradoxe des anniversaires",
  resume: "Dans un groupe de 23 personnes, deux d'entre elles partagent un anniversaire une fois sur deux. Et pour le tien ?",
  but: "Fais varier la taille du groupe, tire des groupes au hasard sur le calendrier (les doublons s'allument) et compare avec les deux probabilités calculées.",
  aRetenir: "P(au moins un doublon) = 1 − (365·364·…·(365−n+1)) / 365ⁿ. On compte le nombre de paires, n(n−1)/2, pas le nombre de personnes. Même logique : le risque d'un « faux positif » parmi de nombreuses comparaisons croît vite.",
  piege: "« Au moins deux » ≠ « quelqu'un a mon anniversaire » : le second exige 253 autres personnes pour dépasser 50 %. On suppose ici 365 jours équiprobables, indépendants (modèle simplifié).",
  build: function(k, S){
    var cal = ST.canvas(k, 150, .34, 200), c = ST.canvas(k, 250, .58, 330);
    var days = [], tries = 0, hits = 0, mine = 0, tmine = 0, MY = 120;
    function reset(){ days = []; tries = 0; hits = 0; mine = 0; tmine = 0; }
    var n = k.slider("Taille du groupe n", 2, 80, 1, 23, "personnes", reset);
    function once(){ days = []; var seen = {}, dup = false, my = false; for (var i = 0; i < n.value; i++){ var d = Math.floor(Math.random() * 365); days.push(d); if (seen[d]) dup = true; seen[d] = 1; if (d === MY) my = true; } tries++; if (dup) hits++; tmine++; if (my) mine++; }
    k.button("Tirer un groupe", function(){ once(); }, true); k.button("Tirer 200 groupes", function(){ for (var i = 0; i < 200; i++) once(); }); k.button("Effacer", reset);
    var ro = k.readouts(["Paires", "P(un doublon)", "P(quelqu'un a le tien)", "n minimal pour 50 %"]);
    var nt = k.note("", "");
    function pd(m){ var q = 1; for (var i = 0; i < m; i++) q *= (365 - i) / 365; return 1 - q; }
    function pm(m){ return 1 - Math.pow(364 / 365, m); }
    k.draw(function(){
      cal.clear(); c.clear();
      var m = n.value, ctx = cal.ctx, cols = 40, rows = 10, cs = (cal.W - 20) / cols, gx = 10, gy = 8, cnt = {};
      days.forEach(function(d){ cnt[d] = (cnt[d] || 0) + 1; });
      for (var d = 0; d < 365; d++){ var cx = gx + (d % cols) * cs, cy = gy + Math.floor(d / cols) * cs, q = cnt[d] || 0;
        ctx.fillStyle = q > 1 ? P.red : q === 1 ? S.draw.tint(P.mat, .9) : S.draw.tint(P.grey, .2); S.draw.rrect(cal, cx + .6, cy + .6, cs - 1.6, cs - 1.6, 2); ctx.fill();
        if (d === MY){ ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.stroke(); } }
      S.draw.label(cal, "ton anniversaire", gx + (MY % cols) * cs + cs + 6, gy + Math.floor(MY / cols) * cs + cs / 2, {color: P.amber, size: 10.5, align: "left"});
      S.draw.legend(cal, [[P.mat, "un anniversaire"], [P.red, "doublon"]], cal.W - 8, cal.H - 44, {align: "right"});
      if (tries) S.draw.text(cal, tries + " groupe(s) de " + m + " : " + hits + " avec un doublon (" + F(hits / tries * 100, 0) + " %)", gx, cal.H - 12, {size: 11.5, align: "left", color: P.ink});
      else S.draw.text(cal, "Les 365 jours de l'année. Clique sur « Tirer un groupe ».", gx, cal.H - 12, {size: 11.5, align: "left", color: "#6b7685"});
      var ax = S.draw.axes(c, {x0: 0, x1: 80, y0: 0, y1: 1, xl: "n personnes", yl: "probabilité", stepX: 10, stepY: 0.25});
      S.draw.line(c, ax.X(0), ax.Y(0.5), ax.X(80), ax.Y(0.5), P.grey, 1, [4, 4]);
      S.draw.fn(c, ax, function(x){ return pd(Math.max(1, Math.round(x))); }, P.red, 2.8);
      S.draw.fn(c, ax, function(x){ return pm(Math.max(1, Math.round(x))); }, P.mat, 2.8);
      S.draw.dot(c, ax.X(m), ax.Y(pd(m)), 6.5, P.red); S.draw.dot(c, ax.X(m), ax.Y(pm(m)), 6.5, P.mat);
      S.draw.line(c, ax.X(m), ax.Y(0), ax.X(m), ax.Y(1), S.draw.tint(P.ink, .25), 1, [3, 3]);
      S.draw.label(c, "deux personnes quelconques", ax.X(79), ax.Y(.5) - 13, {color: P.red, align: "right", size: 11.5});
      S.draw.label(c, "quelqu'un a TON anniversaire", ax.X(79), ax.Y(pm(79)) - 15, {color: P.mat, align: "right", size: 11.5});
      if (tries) S.draw.dot(c, ax.X(m), ax.Y(hits / tries), 4.5, P.ink);
      ro.set(0, m * (m - 1) / 2); ro.set(1, F(pd(m) * 100, 1) + " %"); ro.set(2, F(pm(m) * 100, 1) + " %"); ro.set(3, "23");
      nt.set(tries ? "Observé sur " + tries + " groupes : " + F(hits / tries * 100, 1) + " % de doublons (point noir) pour " + F(pd(m) * 100, 1) + " % calculés ; ton anniversaire est partagé dans " + F(mine / tmine * 100, 1) + " % des groupes (calcul : " + F(pm(m) * 100, 1) + " %)." : "Avec " + m + " personnes il y a " + (m * (m - 1) / 2) + " paires de personnes : voilà pourquoi un doublon est si probable.", "ok");
    });
  }
});
})();
