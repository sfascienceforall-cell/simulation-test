/* Biostatistique BA1 · chapitre 5 : échantillonnage et théorème central limite */
(function(){
var P = SFA.draw.palette, F = SFA.fmt, ST = SFA.st, rng = ST.rng, gauss = ST.gauss;
function pct(x, d){ return F(x * 100, d === undefined ? 1 : d) + " %"; }
function npdf(x, m, s){ return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); }

/* 1 ---------------------------------------------------------------- */
var POP = {
  normale: {nom: "normale N(50 ; 10²)", m: 50, s: 10, draw: function(r){ return 50 + 10 * gauss(r); }, f: function(x){ return npdf(x, 50, 10); }},
  uniforme: {nom: "uniforme sur [0 ; 100]", m: 50, s: 100 / Math.sqrt(12), draw: function(r){ return 100 * r(); }, f: function(x){ return x >= 0 && x <= 100 ? 0.01 : 0; }},
  expo: {nom: "exponentielle de moyenne 50", m: 50, s: 50, draw: function(r){ return -50 * Math.log(1 - r()); }, f: function(x){ return x >= 0 ? Math.exp(-x / 50) / 50 : 0; }},
  bimodale: {nom: "bimodale (deux sous-populations)", m: 50, s: Math.sqrt(36 + 625), draw: function(r){ return (r() < 0.5 ? 25 : 75) + 6 * gauss(r); }, f: function(x){ return 0.5 * npdf(x, 25, 6) + 0.5 * npdf(x, 75, 6); }}
};
SFA.sim({
  id: "us-c05-tcl", ch: "c05", tag: "Théorème central limite",
  titre: "Distribution des moyennes : quelle que soit la population de départ",
  resume: "Population uniforme, exponentielle ou bimodale : l'histogramme des moyennes devient une cloche quand n grandit.",
  but: "Choisis la population (courbe du haut) et la taille n de l'échantillon, puis tire des échantillons : les points du haut sont le dernier échantillon, la barre qui tombe en bas est sa moyenne.",
  aRetenir: "Pour n assez grand, la moyenne X̄ suit approximativement N(μ ; σ²/n), quelle que soit la population (de variance finie). L'écart-type de X̄ vaut σ/√n. Plus la population est asymétrique, plus n doit être grand (souvent n ≥ 30, davantage si l'asymétrie est forte).",
  piege: "Le théorème central limite concerne la distribution des moyennes, pas celle des valeurs individuelles : les individus gardent la forme de la population, même avec n = 1000.",
  build: function(k, S){
    var c1 = ST.canvas(k, 170, .36, 220), c2 = ST.canvas(k, 250, .56, 330), means = [], last = null, lastMean = null;
    var pop = k.select("Population", [["normale", "Normale"], ["uniforme", "Uniforme"], ["expo", "Exponentielle (asymétrique)"], ["bimodale", "Bimodale"]], "expo", function(){ means = []; last = null; });
    var n = k.slider("Taille n de l'échantillon", 1, 100, 1, 5, "", function(){ means = []; last = null; });
    function tire(m){ var pp = POP[pop.value]; for (var j = 0; j < m; j++){ var t = 0, a = []; for (var i = 0; i < n.value; i++){ var v = pp.draw(Math.random); a.push(v); t += v; } means.push(t / n.value); if (j === m - 1){ last = a; lastMean = t / n.value; } } }
    var ani = k.loop(function(){ tire(4); if (means.length > 6000) ani.pause(); k.redraw(); });
    k.button("Tirer 1 échantillon", function(){ tire(1); }, true); k.button("+ 200", function(){ tire(200); }); k.button("+ 2000", function(){ tire(2000); }); k.button("Animation / pause", function(){ if (ani.running) ani.pause(); else ani.play(); }); k.button("Recommencer", function(){ means = []; last = null; });
    var ro = k.readouts(["Échantillons tirés", "Moyenne des moyennes", "Écart-type des moyennes", "σ/√n théorique"]);
    var nt = k.note("", "");
    tire(300);
    k.draw(function(){
      c1.clear(); c2.clear();
      var pp = POP[pop.value], N = n.value, se = pp.s / Math.sqrt(N);
      var ax1 = S.draw.axes(c1, {x0: 0, x1: 150, y0: 0, y1: pop.value === "uniforme" ? 0.02 : pop.value === "expo" ? 0.025 : 0.045, stepX: 25, stepY: 0.01, b: 32, t: 16, xl: "population (valeurs individuelles)"});
      S.draw.area(c1, ax1, pp.f, 0, 150, P.violet, 0.16); S.draw.fn(c1, ax1, pp.f, P.violet, 2.6);
      if (last){ var rj = rng(7); last.forEach(function(v, i){ if (v >= 0 && v <= 150) S.draw.dot(c1, ax1.X(v), ax1.Y(0) - 7 - (i % 5) * 5, 3.2, S.draw.tint(P.orange, .85)); });
        S.draw.line(c1, ax1.X(lastMean), ax1.Y(0), ax1.X(lastMean), ax1.T, P.orange, 2); S.draw.label(c1, "moyenne de l'échantillon " + F(lastMean, 1), ax1.X(lastMean) + (lastMean > 100 ? -6 : 6), ax1.T + 8, {color: P.orange, align: lastMean > 100 ? "right" : "left", size: 10.5}); }
      var x0 = Math.max(0, 50 - 4 * se), x1 = 50 + 4 * se, nb = 40, bw = (x1 - x0) / nb, cnt = [], j;
      for (j = 0; j < nb; j++) cnt.push(0);
      means.forEach(function(m){ var b = Math.floor((m - x0) / bw); if (b >= 0 && b < nb) cnt[b]++; });
      var tot = means.length, dmax = Math.max(npdf(50, 50, se), 1e-9);
      var ymax = Math.max(tot ? Math.max.apply(null, cnt) / (tot * bw) : 0, dmax) * 1.2;
      var ax = S.draw.axes(c2, {x0: x0, x1: x1, y0: 0, y1: ymax, stepY: ymax, b: 38, t: 22, xl: "moyenne X̄ de l'échantillon"});
      cnt.forEach(function(q, b){ var d = tot ? q / (tot * bw) : 0, xa = ax.X(x0 + b * bw), xb = ax.X(x0 + (b + 1) * bw); c2.ctx.fillStyle = S.draw.tint(P.mat, .6); c2.ctx.fillRect(xa + 0.5, ax.Y(d), xb - xa - 1, ax.Y(0) - ax.Y(d)); });
      S.draw.fn(c2, ax, function(x){ return npdf(x, 50, se); }, P.red, 2.8);
      if (last && lastMean >= x0 && lastMean <= x1){ S.draw.dot(c2, ax.X(lastMean), ax.Y(0) - 10, 6.5, P.orange); }
      S.draw.legend(c2, [[S.draw.tint(P.mat, .7), "histogramme des moyennes"], [P.red, "N(50 ; (σ/√n)²)"]], c2.W - 10, 8, {align: "right"});
      var mm = 0, sd = 0; if (tot){ means.forEach(function(m){ mm += m; }); mm /= tot; } if (tot > 1){ means.forEach(function(m){ sd += (m - mm) * (m - mm); }); sd = Math.sqrt(sd / (tot - 1)); }
      ro.set(0, tot); ro.set(1, tot ? F(mm, 2) : "—"); ro.set(2, tot > 1 ? F(sd, 2) : "—"); ro.set(3, F(se, 2));
      nt.set("Population " + pp.nom + " : μ = 50, σ = " + F(pp.s, 1) + ". " + (N < 10 && pop.value !== "normale" ? "Avec n = " + N + " petit, la forme de la population se voit encore dans l'histogramme des moyennes." : N >= 30 ? "n ≥ 30 : l'histogramme des moyennes est proche d'une cloche." : "Augmente n pour voir la cloche apparaître."), "ok");
    });
  }
});

/* 2 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c05-erreur-standard", ch: "c05", tag: "Précision",
  titre: "L'erreur standard décroît en 1/√n : le prix d'une précision double",
  resume: "Pour diviser l'erreur par 2, il faut 4 fois plus de sujets ; par 10, il en faut 100 fois plus.",
  but: "Fixe σ puis glisse le point rouge le long de la courbe ES = σ/√n. Glisse aussi la ligne verte (erreur standard visée) : le graphique donne l'effectif nécessaire.",
  aRetenir: "ES = σ/√n. Pour atteindre une ES cible : n = (σ/ES)². Les premiers sujets apportent le plus : au-delà d'un certain effectif, chaque sujet supplémentaire rapporte peu.",
  piege: "L'ES mesure le hasard d'échantillonnage, pas les biais : doubler n ne corrige pas un échantillon non représentatif.",
  build: function(k, S){
    var c = ST.canvas(k, 320, .75, 420);
    var sg = k.slider("Écart-type σ de la grandeur", 5, 30, 1, 12, ""), n = k.slider("Effectif n", 2, 500, 1, 36, ""), cb = k.slider("Erreur standard visée", 0.5, 5, 0.1, 1.5, "");
    var ro = k.readouts(["ES actuelle", "ES avec 4n", "ES avec 100n", "n pour l'ES visée"]);
    var nt = k.note("", "");
    var lay = {};
    ST.drag(c, function(){ if (!lay.ax) return []; var ax = lay.ax, s = sg.value;
      return [{id: "n", x: ax.X(n.value), y: ax.Y(s / Math.sqrt(n.value)), r: 16}, {id: "t", x: ax.X(30), y: ax.Y(cb.value), r: 14, dist: function(q){ return Math.abs(q.y - ax.Y(cb.value)); }}]; },
      function(id, q){ if (id === "n") n.set(ST.clamp(Math.round(lay.ax.ix(q.x)), 2, 500)); else cb.set(ST.clamp(Math.round(lay.ax.iy(q.y) * 10) / 10, 0.5, 5)); k.redraw(); });
    k.draw(function(){
      c.clear();
      var s = sg.value, N = n.value, se = s / Math.sqrt(N), need = Math.ceil(Math.pow(s / cb.value, 2) - 1e-9);
      var ax = S.draw.axes(c, {x0: 0, x1: 500, y0: 0, y1: s / Math.sqrt(2) + 1, xl: "effectif n", yl: "erreur standard σ/√n", stepX: 100, t: 22}); lay.ax = ax;
      S.draw.area(c, ax, function(x){ return s / Math.sqrt(Math.max(x, 2)); }, 2, 500, P.mat, 0.08);
      S.draw.fn(c, ax, function(x){ return s / Math.sqrt(Math.max(x, 2)); }, P.mat, 3);
      S.draw.line(c, ax.X(0), ax.Y(cb.value), ax.X(500), ax.Y(cb.value), P.green, 2, [6, 4]);
      S.draw.dot(c, ax.X(30), ax.Y(cb.value), 7, P.green);
      S.draw.label(c, "ES visée " + F(cb.value, 1), ax.X(500) - 4, ax.Y(cb.value) - 14, {color: P.green, align: "right", size: 11.5});
      if (need <= 500){ S.draw.line(c, ax.X(need), ax.Y(cb.value), ax.X(need), ax.Y(0), S.draw.tint(P.green, .6), 1.4, [3, 3]); S.draw.label(c, "n = " + need, ax.X(need), ax.Y(0) - 14, {color: P.green, size: 11.5}); }
      S.draw.line(c, ax.X(N), ax.Y(se), ax.X(N), ax.Y(0), S.draw.tint(P.red, .5), 1.2, [3, 3]);
      if (4 * N <= 500){ S.draw.line(c, ax.X(N), ax.Y(se), ax.X(4 * N), ax.Y(se / 2), P.amber, 1.4, [3, 3]); S.draw.dot(c, ax.X(4 * N), ax.Y(se / 2), 6, P.amber); S.draw.label(c, "4n : ES ÷ 2", ax.X(4 * N), ax.Y(se / 2) + 16, {color: P.amber, size: 11.5}); }
      S.draw.dot(c, ax.X(N), ax.Y(se), 7.5, P.red);
      S.draw.label(c, "n = " + N + " : ES = " + F(se, 2), ax.X(N) + (N > 330 ? -12 : 12), ax.Y(se) - 16, {color: P.red, align: N > 330 ? "right" : "left", size: 11.5});
      ST.hint(c, "glisse le point et la ligne verte", c.W - 130, 12, P.mat);
      ro.set(0, F(se, 2)); ro.set(1, F(se / 2, 2)); ro.set(2, F(se / 10, 2)); ro.set(3, need);
      nt.set(need > 500 ? "Pour une ES de " + F(cb.value, 1) + " avec σ = " + s + ", il faut n = " + need + " sujets : au-delà de l'échelle du graphique, c'est le coût de la précision." : "Pour atteindre ES = " + F(cb.value, 1) + ", il faut au moins n = " + need + " sujets.", need > 500 ? "warn" : "ok");
    });
  }
});

/* 3 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c05-biais-selection", ch: "c05", tag: "Biais",
  titre: "Comment on échantillonne compte plus que combien",
  resume: "Une population de 400 personnes, une proportion à estimer : quatre manières de choisir l'échantillon.",
  but: "La part de personnes sportives décroît quand on s'éloigne de la salle de sport (à gauche). Choisis une méthode, tire des échantillons : les personnes choisies sont cerclées d'orange et l'histogramme montre où tombent les estimations par rapport à la vraie proportion.",
  aRetenir: "Un échantillon aléatoire est sans biais ; sa précision augmente avec n. Un échantillon de convenance est biaisé : agrandir n ne supprime pas le biais. Un tirage systématique de pas égal à une période de la liste peut aussi être très mauvais.",
  piege: "Pas de formule qui répare un biais de sélection après coup : ce qu'on a oublié de mesurer reste invisible. Modèle simplifié : une population de 400 personnes en grille 25 × 16.",
  build: function(k, S){
    var c1 = ST.canvas(k, 330, .7, 360), c2 = ST.canvas(k, 230, .52, 290);
    var COLS = 25, ROWS = 16, r0 = rng(3), pop = [], i, j, tot = 0, memo = {};
    for (j = 0; j < ROWS; j++) for (i = 0; i < COLS; i++){ var t = r0() < 0.78 - 0.56 * i / (COLS - 1) ? 1 : 0; pop.push(t); tot += t; }
    var pTrue = tot / 400, cur = [], ests = [];
    var NAMES = {alea: "Aléatoire simple", conv: "De convenance", syst: "Systématique (pas 25)", grap: "Par grappes (4 lignes)"};
    var me = k.select("Méthode", [["alea", "Aléatoire simple"], ["conv", "De convenance (près de la salle)"], ["syst", "Systématique (1 sur 25)"], ["grap", "Par grappes (4 lignes entières)"]], "alea", function(){ ests = []; cur = []; auto(); });
    var n = k.slider("Taille n (aléatoire, convenance)", 10, 100, 5, 40, "", function(){ ests = []; cur = []; auto(); });
    function tirage(){
      var idx = [], a, m = n.value, q, tmp;
      if (me.value === "alea"){ a = []; for (i = 0; i < 400; i++) a.push(i); for (i = 0; i < m; i++){ q = i + Math.floor(Math.random() * (400 - i)); tmp = a[i]; a[i] = a[q]; a[q] = tmp; idx.push(a[i]); } }
      else if (me.value === "conv"){ var cand = []; for (i = 0; i < 400; i++) cand.push(i); cand.sort(function(u, v){ return (u % COLS) - (v % COLS) || u - v; }); cand = cand.slice(0, 2 * m); for (i = 0; i < m; i++){ q = i + Math.floor(Math.random() * (cand.length - i)); tmp = cand[i]; cand[i] = cand[q]; cand[q] = tmp; idx.push(cand[i]); } }
      else if (me.value === "syst"){ var st = Math.floor(Math.random() * COLS); for (i = st; i < 400; i += COLS) idx.push(i); }
      else { a = []; for (i = 0; i < ROWS; i++) a.push(i); for (i = 0; i < 4; i++){ q = i + Math.floor(Math.random() * (ROWS - i)); tmp = a[i]; a[i] = a[q]; a[q] = tmp; for (j = 0; j < COLS; j++) idx.push(a[i] * COLS + j); } }
      return idx;
    }
    function est(idx){ var s = 0; idx.forEach(function(q){ s += pop[q]; }); return s / idx.length; }
    function many(m){ for (var z = 0; z < m; z++) ests.push(est(tirage())); }
    function auto(){ cur = tirage(); ests = [est(cur)]; many(299); }
    k.button("Tirer 1 échantillon", function(){ cur = tirage(); ests.push(est(cur)); }, true);
    k.button("Tirer 400 échantillons", function(){ many(400); });
    k.button("Recommencer", function(){ ests = []; cur = []; auto(); });
    var ro = k.readouts(["Vraie proportion", "Moyenne des estimations", "Biais", "Écart-type des estimations"]);
    var nt = k.note("", "");
    auto();
    k.draw(function(){
      c1.clear(); c2.clear();
      var gx = 12, gw = c1.W - 24, cs = Math.min(gw / COLS, (c1.H - 100) / ROWS), x0 = (c1.W - cs * COLS) / 2, y0 = 30, sel = {}, ctx = c1.ctx;
      cur.forEach(function(q){ sel[q] = 1; });
      /* dégradé « distance à la salle » */
      var g = ctx.createLinearGradient(x0, 0, x0 + cs * COLS, 0); g.addColorStop(0, S.draw.tint(P.green, .22)); g.addColorStop(1, S.draw.tint(P.green, .02)); ctx.fillStyle = g; ctx.fillRect(x0, y0 - 4, cs * COLS, cs * ROWS + 8);
      for (var q = 0; q < 400; q++){ var cx = x0 + (q % COLS) * cs + cs / 2, cy = y0 + Math.floor(q / COLS) * cs + cs / 2; ctx.beginPath(); ctx.arc(cx, cy, cs * 0.34, 0, 6.2832); ctx.fillStyle = pop[q] ? S.draw.tint(P.green, .9) : S.draw.tint(P.grey, .42); ctx.fill();
        if (sel[q]){ ctx.lineWidth = 2.4; ctx.strokeStyle = P.orange; ctx.beginPath(); ctx.arc(cx, cy, cs * 0.47, 0, 6.2832); ctx.stroke(); } }
      ctx.fillStyle = P.ink; S.draw.rrect(c1, 4, y0 - 4, 7, 22, 2); ctx.fill();
      S.draw.text(c1, "salle de sport", x0, 12, {size: 11.5, color: P.ink, align: "left"});
      S.draw.text(c1, "loin de la salle", x0 + cs * COLS, 12, {size: 11.5, color: "#6b7685", align: "right"});
      S.draw.legend(c1, [[P.green, "sportif"], [S.draw.tint(P.grey, .8), "non sportif"], [P.orange, "dans l'échantillon"]], x0 + 2, y0 + cs * ROWS + 8, {box: false});
      var ax = S.draw.axes(c2, {x0: 0, x1: 1, y0: 0, y1: 1, xl: "proportion estimée", stepX: 0.1, stepY: 1, b: 38, t: 18, l: 14});
      var nb = 40, cnt = [], m;
      for (m = 0; m < nb; m++) cnt.push(0);
      ests.forEach(function(e){ cnt[Math.min(nb - 1, Math.floor(e * nb))]++; });
      var cm = Math.max.apply(null, cnt.concat([1]));
      cnt.forEach(function(v, b){ var xa = ax.X(b / nb), xb = ax.X((b + 1) / nb), h = v / cm * (ax.Y(0) - ax.Y(1)) * 0.92; c2.ctx.fillStyle = S.draw.tint(P.mat, .65); c2.ctx.fillRect(xa + 0.5, ax.Y(0) - h, xb - xa - 1, h); });
      var mm = 0, sd = 0; if (ests.length){ ests.forEach(function(e){ mm += e; }); mm /= ests.length; } if (ests.length > 1){ ests.forEach(function(e){ sd += (e - mm) * (e - mm); }); sd = Math.sqrt(sd / (ests.length - 1)); }
      if (ests.length >= 100) memo[me.value] = {m: mm, sd: sd};
      S.draw.line(c2, ax.X(pTrue), ax.Y(0), ax.X(pTrue), ax.Y(1), P.red, 2.6);
      S.draw.label(c2, "vraie proportion " + pct(pTrue, 1), ax.X(pTrue) + (pTrue > 0.55 ? -6 : 6), ax.Y(1) + 8, {color: P.red, align: pTrue > 0.55 ? "right" : "left", size: 11});
      if (ests.length >= 2){ S.draw.line(c2, ax.X(mm), ax.Y(0), ax.X(mm), ax.Y(1) + 28, P.orange, 2.4, [5, 3]); S.draw.label(c2, "moyenne des estimations " + pct(mm, 1), ax.X(mm) + (mm > 0.55 ? -6 : 6), ax.Y(1) + 32, {color: P.orange, align: mm > 0.55 ? "right" : "left", size: 11}); }
      ro.set(0, pct(pTrue, 1)); ro.set(1, ests.length ? pct(mm, 1) : "—"); ro.set(2, ests.length ? F((mm - pTrue) * 100, 1) + " pt" : "—"); ro.set(3, ests.length > 1 ? F(sd * 100, 1) + " pt" : "—");
      var biased = ests.length >= 100 && Math.abs(mm - pTrue) > 0.04;
      var cmp = Object.keys(memo).map(function(key){ return NAMES[key] + " : " + pct(memo[key].m, 0) + " ± " + F(memo[key].sd * 100, 0); }).join(" · ");
      nt.set(biased ? "Les estimations sont centrées à " + pct(mm, 1) + " au lieu de " + pct(pTrue, 1) + " : biais de " + F((mm - pTrue) * 100, 1) + " points. Augmenter n ne le réduirait pas." : me.value === "syst" ? "Pas égal à la longueur d'une ligne : on prend toujours la même colonne, donc 16 personnes proches ou éloignées de la salle. Pas de biais en moyenne, mais une dispersion énorme." : "Estimations centrées sur la vraie valeur (biais faible) ; la dispersion mesure la précision. " + (me.value === "grap" ? "Les grappes sont des lignes entières : elles couvrent toutes les distances à la salle." : ""), biased ? "bad" : "ok");
      if (cmp) nt.set(nt.el.innerHTML + "<br><small>Comparaison (moyenne ± écart-type, en points) : " + cmp + "</small>", biased ? "bad" : "ok");
    });
  }
});

/* 4 ---------------------------------------------------------------- */
SFA.sim({
  id: "us-c05-regression-moyenne", ch: "c05", tag: "Piège classique",
  titre: "Régression vers la moyenne : les extrêmes se « calment » tout seuls",
  resume: "On sélectionne les 10 % de tensions les plus élevées ; à la 2e mesure, elles baissent, sans aucun traitement.",
  but: "Chaque point est un patient mesuré deux fois (tension systolique). Règle la corrélation entre les deux mesures et la part des patients retenus sur la 1re mesure : les patients rouges « baissent » d'eux-mêmes.",
  aRetenir: "Si la corrélation entre deux mesures est ρ < 1, les sujets extrêmes à la 1re mesure sont en moyenne moins extrêmes à la 2e : écart attendu ≈ ρ × (écart à la moyenne à la 1re). Une baisse « avant-après » sans groupe témoin ne prouve pas l'efficacité d'un traitement.",
  piege: "C'est un phénomène statistique, pas un effet du temps ou d'une intervention. Modèle : deux mesures de loi normale (moyenne 125, écart-type 15 mmHg), corrélation ρ.",
  build: function(k, S){
    var c = ST.canvas(k, 300, .7, 380), c2 = ST.canvas(k, 190, .42, 240);
    var rho = k.slider("Corrélation ρ entre les 2 mesures", 0, 1, 0.05, 0.6, ""), q = k.slider("Part retenue (les plus élevés)", 5, 50, 5, 10, "%");
    var ro = k.readouts(["Moyenne retenus (mesure 1)", "Moyenne retenus (mesure 2)", "Baisse spontanée", "Prévu : 125 + ρ(m1 − 125)"]);
    var nt = k.note("", "");
    var r = rng(8), z1 = [], e = []; for (var i = 0; i < 300; i++){ z1.push(gauss(r)); e.push(gauss(r)); }
    k.draw(function(){
      c.clear(); c2.clear();
      var rr = rho.value, pts = z1.map(function(z, j){ return {x: 125 + 15 * z, y: 125 + 15 * (rr * z + Math.sqrt(1 - rr * rr) * e[j])}; });
      var xs = pts.map(function(p){ return p.x; }).sort(function(a, b){ return b - a; }), cut = xs[Math.round(q.value / 100 * 300) - 1];
      var ax = S.draw.axes(c, {x0: 70, x1: 180, y0: 70, y1: 180, xl: "mesure 1 (mmHg)", yl: "mesure 2", stepX: 20, stepY: 20, b: 38, t: 22, equal: false});
      var sx = 0, sy = 0, cn = 0, sel = [];
      pts.forEach(function(p){ var s = p.x >= cut; if (s){ sx += p.x; sy += p.y; cn++; sel.push(p); } S.draw.dot(c, ax.X(p.x), ax.Y(p.y), s ? 4.2 : 3, s ? S.draw.tint(P.red, .85) : S.draw.tint(P.mat, .4)); });
      S.draw.line(c, ax.X(70), ax.Y(70), ax.X(180), ax.Y(180), P.grey, 1.4, [5, 4]);
      S.draw.line(c, ax.X(70), ax.Y(125 + rr * (70 - 125)), ax.X(180), ax.Y(125 + rr * (180 - 125)), P.green, 2.4);
      S.draw.legend(c, [[P.grey, "y = x (aucun changement)", 1], [P.green, "droite de régression"], [P.red, "patients retenus"]], ax.R - 8, ax.B - 62, {align: "right"});
      var m1 = sx / cn, m2 = sy / cn;
      /* avant → après des patients retenus */
      var L = 90, R = c2.W - 90, T = 24, B = c2.H - 16, Yv = function(v){ return B - (v - 70) / 110 * (B - T); };
      S.draw.text(c2, "mesure 1", L, 10, {size: 11.5, color: "#3d4b5f"}); S.draw.text(c2, "mesure 2", R, 10, {size: 11.5, color: "#3d4b5f"});
      S.draw.line(c2, L, T - 4, L, B, P.axis, 1.3); S.draw.line(c2, R, T - 4, R, B, P.axis, 1.3);
      [80, 125, 170].forEach(function(v){ S.draw.text(c2, v, L - 10, Yv(v), {size: 10.5, align: "right", color: "#6b7685", weight: 600}); S.draw.line(c2, L, Yv(v), R, Yv(v), v === 125 ? S.draw.tint(P.ink, .25) : P.grid, 1, v === 125 ? [4, 4] : null); });
      sel.forEach(function(p){ S.draw.line(c2, L, Yv(p.x), R, Yv(p.y), S.draw.tint(P.red, .22), 1.2); });
      S.draw.line(c2, L, Yv(m1), R, Yv(m2), P.red, 3.4); S.draw.dot(c2, L, Yv(m1), 5, P.red); S.draw.dot(c2, R, Yv(m2), 5, P.red);
      S.draw.label(c2, F(m1, 0), L - 8, Yv(m1) - 12, {color: P.red, align: "right", size: 11}); S.draw.label(c2, F(m2, 0), R + 8, Yv(m2) + 12, {color: P.red, align: "left", size: 11});
      S.draw.text(c2, "moyenne 125", R + 10, Yv(125), {size: 10.5, align: "left", color: "#6b7685", weight: 600});
      ro.set(0, F(m1, 1)); ro.set(1, F(m2, 1)); ro.set(2, F(m1 - m2, 1) + " mmHg"); ro.set(3, F(125 + rr * (m1 - 125), 1));
      nt.set(rr > 0.97 ? "Corrélation presque parfaite : la 2e mesure répète la 1re, il n'y a pas de régression vers la moyenne." : rr < 0.03 ? "Mesures indépendantes : les patients retenus retombent en moyenne à 125 mmHg à la 2e mesure." : "Les " + cn + " patients retenus (rouge) passent de " + F(m1, 1) + " à " + F(m2, 1) + " mmHg en moyenne, sans aucun traitement. Un essai sans groupe témoin attribuerait à tort cette baisse au traitement.", rr > 0.97 ? "ok" : "warn");
    });
  }
});
})();
