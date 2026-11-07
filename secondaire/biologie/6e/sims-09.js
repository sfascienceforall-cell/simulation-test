/* Chapitre 9 · Écologie : populations, niches et interactions */
(function(){
var B = window.B6;

SFA.sim({
  id: "b6-c09-logistique", ch: "c09", tag: "Classique",
  titre: "Croissance logistique, capacité d'accueil et prélèvement",
  resume: "Une population croît d'abord vite, puis se stabilise à la capacité d'accueil K. Que se passe-t-il si l'on prélève une part chaque année ?",
  but: "Règle le taux de croissance r, la capacité d'accueil K et l'effectif de départ. Le trait pointillé gris montre ce que donnerait une croissance exponentielle sans limite. Avec « prélèvement », tu simules une pêche ou une chasse.",
  aRetenir: "Croissance logistique : dN/dt = r·N·(1 − N/K). La croissance est la plus rapide quand N = K/2 (valeur r·K/4) et elle s'annule à N = K. Sans limitation, une population croîtrait de façon exponentielle ; les ressources, l'espace ou les maladies la limitent. Un prélèvement trop fort (supérieur à r) mène à l'extinction ; le rendement durable maximal est obtenu pour un prélèvement de r/2 environ.",
  piege: "K n'est pas une valeur fixe de la nature : elle dépend du milieu et change avec lui. Et prélever « la croissance maximale » n'est pas sans risque : au rendement maximal, la population est à K/2 et un aléa (mauvaise année) peut la faire s'effondrer. Modèle simplifié : pas de hasard ni de structure d'âge.",
  build: function(k, S){
    var c = k.canvas(370), P = S.draw.palette;
    var r = k.slider("Taux de croissance r", 0.1, 1.5, 0.05, 0.5, "/an");
    var K = k.slider("Capacité d'accueil K", 100, 2000, 50, 1000, "individus");
    var n0 = k.slider("Effectif de départ", 1, 500, 1, 20, "");
    var h = k.slider("Prélèvement (part de la population par an)", 0, 80, 5, 0, "%");
    var ro = k.readouts(["Effectif d'équilibre", "Croissance maximale (r'·K'/4)", "Prélèvement durable (individus/an)", "Maximum possible r·K/4"]);
    var note = k.note("", "");
    k.draw(function(){
      c.clear(); var R = r.value, KK = K.value, N0 = n0.value, hh = h.value / 100, a = R - hh, b = R / KK;
      function N(t){ if (Math.abs(a) < 1e-9) return N0 / (1 + b * N0 * t); return a * N0 * Math.exp(a * t) / (a + b * N0 * (Math.exp(a * t) - 1)); }
      var T = 40, ymax = Math.max(KK * 1.15, N0 * 1.1), ax = S.draw.axes(c, {x0: 0, x1: T, y0: 0, y1: ymax, stepX: 5, xl: "temps (années)", yl: "effectif N", l: 54});
      S.draw.fn(c, ax, function(t){ return N0 * Math.exp(R * t); }, "#aab4c0", 1.8, [6, 4]);
      var Ne = Math.max(0, a / b); if (hh > 0 && a > 0){ S.draw.line(c, ax.L, ax.Y(Ne), ax.R, ax.Y(Ne), P.amber, 1.4, [4, 3]); }
      S.draw.line(c, ax.L, ax.Y(KK), ax.R, ax.Y(KK), P.green, 1.4, [4, 3]); S.draw.text(c, "K", ax.L + 10, ax.Y(KK) - 9, {size: 12, color: P.green});
      S.draw.line(c, ax.L, ax.Y(KK / 2), ax.R, ax.Y(KK / 2), "#d4dae1", 1.2, [2, 3]); S.draw.text(c, "K/2", ax.L + 14, ax.Y(KK / 2) - 9, {size: 12, color: P.grey});
      S.draw.fn(c, ax, N, P.acc, 3);
      S.draw.text(c, "exponentielle (sans limite)", ax.R - 4, ax.T + 12, {size: 12, color: "#7d8895", align: "right"});
      var Ke = Math.max(0, KK * (1 - hh / R)), rr = R - hh;
      ro.set(0, S.fmt(Ne, 0)); ro.set(1, rr > 0 ? S.fmt(rr * Ke / 4, 1) + " /an" : "0"); ro.set(2, S.fmt(hh * Ne, 1)); ro.set(3, S.fmt(R * KK / 4, 1) + " /an (pour h = " + S.fmt(R / 2 * 100, 0) + " %)");
      note.set(a <= 0 && hh > 0 ? "Le prélèvement (" + S.fmt(hh * 100, 0) + " %/an) est supérieur ou égal à r : la population décline jusqu'à l'extinction." : hh > 0 ? "Avec un prélèvement de " + S.fmt(hh * 100, 0) + " %/an, la population se stabilise à " + S.fmt(Ne, 0) + " individus, et fournit " + S.fmt(hh * Ne, 1) + " individus par an. Essaie h = " + S.fmt(R / 2 * 100, 0) + " % pour le rendement maximal." : "Sans prélèvement : croissance presque exponentielle au début, puis ralentissement et stabilisation à K.", a <= 0 && hh > 0 ? "warn" : "");
    });
  }
});

SFA.sim({
  id: "b6-c09-competition", ch: "c09", tag: "Quantitatif",
  titre: "Compétition entre deux espèces : exclusion ou coexistence ?",
  resume: "Deux espèces partagent des ressources : selon leurs capacités d'accueil et l'intensité de la compétition, l'une disparaît ou les deux coexistent.",
  but: "Règle les capacités d'accueil K₁, K₂ et les effets de compétition α (α₁₂ : effet d'un individu de l'espèce 2 sur l'espèce 1, exprimé en équivalents de l'espèce 1). Touche le plan N₁–N₂ pour choisir les effectifs de départ ; la trajectoire et les deux courbes d'effectifs se calculent.",
  aRetenir: "Modèle de Lotka–Volterra : dNᵢ/dt = r·Nᵢ·(1 − (Nᵢ + αᵢⱼ·Nⱼ)/Kᵢ). L'espèce 1 peut s'installer si K₁ > α₁₂·K₂ ; l'espèce 2 peut s'installer si K₂ > α₂₁·K₁. Les deux conditions vraies : coexistence stable. Une seule vraie : l'espèce correspondante élimine l'autre (principe d'exclusion compétitive de Gause). Aucune vraie : le gagnant dépend des effectifs de départ.",
  piege: "Coexister demande que chaque espèce se limite davantage elle-même que l'autre : la compétition entre espèces doit être plus faible que la compétition au sein de chaque espèce (α < 1 de manière suffisante). Modèle simplifié : r identique pour les deux espèces (r = 0,5 par an), milieu constant.",
  build: function(k, S){
    var c = k.canvas(440), P = S.draw.palette, st = [20, 20];
    var K1 = k.slider("K₁ (capacité d'accueil de l'espèce 1)", 50, 200, 10, 100, ""), K2 = k.slider("K₂ (capacité d'accueil de l'espèce 2)", 50, 200, 10, 80, "");
    var a12 = k.slider("α₁₂ : effet de l'espèce 2 sur l'espèce 1", 0, 2, 0.1, 0.5, ""), a21 = k.slider("α₂₁ : effet de l'espèce 1 sur l'espèce 2", 0, 2, 0.1, 0.6, "");
    var ro = k.readouts(["Espèce 1 peut s'installer ?", "Espèce 2 peut s'installer ?", "Issue"]);
    var note = k.note("", "");
    var M = 220;
    c.pointer(function(t, p){ if (t === "up") return; var ax = geo(); if (p.y > ax.B || p.y < ax.T) return; st = [Math.max(1, Math.min(M, ax.ix(p.x))), Math.max(1, Math.min(M, ax.iy(p.y)))]; k.redraw(); });
    function geo(){ var W = c.W, B0 = 250 - 28, T0 = 12, L0 = 46, R0 = 16; return {L: L0, B: B0, T: T0, ix: function(px){ return (px - L0) / (W - L0 - R0) * M; }, iy: function(py){ return (B0 - py) / (B0 - T0) * M; }}; }
    k.draw(function(){
      c.clear(); var ctx = c.ctx, k1 = K1.value, k2 = K2.value, A12 = a12.value, A21 = a21.value, r = 0.5;
      var h1 = 250; var ax1 = (function(){ var W = c.W, T = 12, Bm = 28, L = 46, R = 16, H = h1; var a = {x0: 0, x1: M, y0: 0, y1: M, L: L, R: W - R, T: T, B: H - Bm}; a.X = function(x){ return L + x / M * (W - L - R); }; a.Y = function(y){ return H - Bm - y / M * (H - T - Bm); }; return a; })();
      ctx.save(); ctx.strokeStyle = "#8a95a3"; ctx.strokeRect(ax1.L, ax1.T, ax1.R - ax1.L, ax1.B - ax1.T); ctx.font = "600 12px Mulish, sans-serif"; ctx.fillStyle = "#5f6b7a"; ctx.textAlign = "center";
      for (var g = 0; g <= M; g += 50){ ctx.fillText(g, ax1.X(g), ax1.B + 12); ctx.textAlign = "right"; ctx.fillText(g, ax1.L - 4, ax1.Y(g)); ctx.textAlign = "center"; ctx.strokeStyle = "#edf0f4"; ctx.beginPath(); ctx.moveTo(ax1.X(g), ax1.T); ctx.lineTo(ax1.X(g), ax1.B); ctx.moveTo(ax1.L, ax1.Y(g)); ctx.lineTo(ax1.R, ax1.Y(g)); ctx.stroke(); }
      ctx.restore(); S.draw.text(c, "N₁", ax1.R - 8, ax1.B - 10, {size: 12, color: P.acc}); S.draw.text(c, "N₂", ax1.L + 16, ax1.T + 8, {size: 12, color: P.red});
      /* isoclines */
      ctx.save(); ctx.beginPath(); ctx.rect(ax1.L, ax1.T, ax1.R - ax1.L, ax1.B - ax1.T); ctx.clip();
      function seg(x1, y1, x2, y2, col){ S.draw.line(c, ax1.X(x1), ax1.Y(y1), ax1.X(x2), ax1.Y(y2), col, 2.2, [7, 4]); }
      seg(k1, 0, 0, A12 > 0 ? k1 / A12 : 1e5, P.acc); seg(A21 > 0 ? k2 / A21 : 1e5, 0, 0, k2, P.red);
      /* trajectoire */
      var n1 = st[0], n2 = st[1], dt = 0.1, T = 80, tr = [[0, n1, n2]];
      function f(a, b){ return [r * a * (1 - (a + A12 * b) / k1), r * b * (1 - (b + A21 * a) / k2)]; }
      for (var i = 0; i < T / dt; i++){
        var q1 = f(n1, n2), q2 = f(n1 + dt / 2 * q1[0], n2 + dt / 2 * q1[1]), q3 = f(n1 + dt / 2 * q2[0], n2 + dt / 2 * q2[1]), q4 = f(n1 + dt * q3[0], n2 + dt * q3[1]);
        n1 += dt / 6 * (q1[0] + 2 * q2[0] + 2 * q3[0] + q4[0]); n2 += dt / 6 * (q1[1] + 2 * q2[1] + 2 * q3[1] + q4[1]); n1 = Math.max(0, n1); n2 = Math.max(0, n2); if (i % 5 === 4) tr.push([(i + 1) * dt, n1, n2]);
      }
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2.4; ctx.beginPath(); tr.forEach(function(p, j){ var X = ax1.X(p[1]), Y = ax1.Y(p[2]); if (j === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }); ctx.stroke(); ctx.restore();
      S.draw.dot(c, ax1.X(st[0]), ax1.Y(st[1]), 6, P.green); S.draw.dot(c, ax1.X(tr[tr.length - 1][1]), ax1.Y(tr[tr.length - 1][2]), 6, P.red);
      S.draw.text(c, "pointillés : isoclines · touche pour le départ", c.W / 2, h1 + 2, {size: 12, color: P.grey});
      /* séries temporelles */
      var y0 = h1 + 20, hh = c.H - y0 - 8, W = c.W, L = 46, R = 16, ymax = Math.max(k1, k2, 50) * 1.1;
      var X = function(t){ return L + t / T * (W - L - R); }, Y = function(v){ return y0 + hh - 22 - v / ymax * (hh - 28); };
      ctx.strokeStyle = "#8a95a3"; ctx.strokeRect(L, Y(ymax), W - L - R, Y(0) - Y(ymax));
      [[1, P.acc], [2, P.red]].forEach(function(s){ ctx.strokeStyle = s[1]; ctx.lineWidth = 2.6; ctx.beginPath(); tr.forEach(function(p, j){ if (j === 0) ctx.moveTo(X(p[0]), Y(p[s[0]])); else ctx.lineTo(X(p[0]), Y(p[s[0]])); }); ctx.stroke(); });
      S.draw.text(c, "temps (années)", c.W / 2, Y(0) + 13, {size: 12, color: P.grey}); S.draw.text(c, "espèce 1", X(T) - 6, Y(tr[tr.length - 1][1]) - 8, {size: 12, color: P.acc, align: "right"}); S.draw.text(c, "espèce 2", X(T) - 6, Y(tr[tr.length - 1][2]) + 10, {size: 12, color: P.red, align: "right"});
      var i1 = k1 > A12 * k2, i2 = k2 > A21 * k1;
      ro.set(0, i1 ? "oui (K₁ > α₁₂·K₂)" : "non"); ro.set(1, i2 ? "oui (K₂ > α₂₁·K₁)" : "non");
      var out = i1 && i2 ? "Coexistence stable" : i1 ? "L'espèce 1 élimine l'espèce 2" : i2 ? "L'espèce 2 élimine l'espèce 1" : "Dépend des effectifs de départ";
      ro.set(2, out); note.set(i1 && i2 ? "Chaque espèce limite plus sa propre croissance que celle de l'autre : elles coexistent à l'équilibre (point d'intersection des deux droites)." : i1 || i2 ? "Une seule espèce peut s'installer dans le milieu de l'autre : exclusion compétitive, quelle que soit la position de départ." : "Chacune empêche l'autre de s'installer : un seul résultat possible selon qui est le plus nombreux au départ.", "");
    });
  }
});

SFA.sim({
  id: "b6-c09-proie-predateur", ch: "c09", tag: "Oscillations",
  titre: "Proies et prédateurs : des oscillations couplées",
  resume: "Plus il y a de proies, plus les prédateurs prospèrent ; plus ils sont nombreux, plus ils épuisent les proies : les effectifs oscillent.",
  but: "Règle les paramètres de croissance et de prédation, ou touche le plan proies–prédateurs pour choisir les effectifs de départ. Active la capacité d'accueil pour les proies : les oscillations s'amortissent.",
  aRetenir: "Le modèle de Lotka–Volterra décrit des oscillations dont le pic des prédateurs est décalé par rapport à celui des proies : ni l'un ni l'autre ne disparaît. À l'équilibre, N_proies = m/(e·a) et N_prédateurs = r/a. La période est d'environ 2π/√(r·m) (petites oscillations). Une capacité d'accueil pour les proies amortit les oscillations vers un équilibre.",
  piege: "Les prédateurs ne « régulent » pas seuls les proies : le cycle est un couplage dans les deux sens. Et dans la réalité, les oscillations sont rarement aussi régulières (hasard, autres proies, maladies, climat). Modèle simplifié : les effectifs ne tombent jamais à zéro, même très bas.",
  build: function(k, S){
    var c = k.canvas(470), P = S.draw.palette, st = [80, 30], sx = 180, sy = 150;
    var r = k.slider("Croissance des proies r", 0.2, 1, 0.05, 0.5, "/an"), a = k.slider("Efficacité de la prédation a", 0.005, 0.03, 0.001, 0.01, "");
    var m = k.slider("Mortalité des prédateurs m", 0.1, 0.8, 0.05, 0.3, "/an"), Kt = k.toggle("Proies limitées par leur milieu (K = 150)", false);
    var ro = k.readouts(["Équilibre proies", "Équilibre prédateurs", "Période (modèle sans K)", "Maxima observés (proies / prédateurs)"]);
    var note = k.note("", ""), e = 0.5, TT = 80;
    function geo(){ return {L: 46, R: c.W - 16, T: 202, B: c.H - 14}; }
    c.pointer(function(t, p){ if (t === "up") return; var g = geo(); if (p.y < g.T) return; st = [Math.max(2, Math.min(sx, (p.x - g.L) / (g.R - g.L) * sx)), Math.max(2, Math.min(sy, (g.B - p.y) / (g.B - g.T) * sy))]; k.redraw(); });
    k.draw(function(){
      c.clear(); var ctx = c.ctx, R = r.value, A = a.value, Mo = m.value, K = Kt.value ? 150 : 1e12, x = st[0], y = st[1], dt = 0.05, tr = [[0, x, y]];
      function f(u, v){ return [R * u * (1 - u / K) - A * u * v, e * A * u * v - Mo * v]; }
      for (var i = 0; i < TT / dt; i++){ var q1 = f(x, y), q2 = f(x + dt / 2 * q1[0], y + dt / 2 * q1[1]), q3 = f(x + dt / 2 * q2[0], y + dt / 2 * q2[1]), q4 = f(x + dt * q3[0], y + dt * q3[1]);
        x += dt / 6 * (q1[0] + 2 * q2[0] + 2 * q3[0] + q4[0]); y += dt / 6 * (q1[1] + 2 * q2[1] + 2 * q3[1] + q4[1]); x = Math.max(1e-3, x); y = Math.max(1e-3, y); if (i % 4 === 3) tr.push([(i + 1) * dt, x, y]); }
      var mxX = 0, mxY = 0; tr.forEach(function(p){ mxX = Math.max(mxX, p[1]); mxY = Math.max(mxY, p[2]); });
      var ex0 = Mo / (e * A); sx = Math.max(150, 3 * ex0); sy = Math.max(100, 3 * (R / A)); var xs = mxX * 1.1, ys = mxY * 1.1;
      var ax = S.draw.axes(c, {x0: 0, x1: TT, y0: 0, y1: Math.max(xs, ys), stepX: 10, t: 12, b: c.H - 160, xl: "temps (années)", yl: "effectifs", l: 46});
      var ex = Mo / (e * A), ey = Kt.value ? R * (1 - ex / 150) / A : R / A, extinct = Kt.value && ex >= 150;
      if (extinct){ ex = 150; ey = 0; }   /* proies trop limitées par leur milieu pour nourrir des prédateurs : équilibre (K, 0) */
      ctx.save(); ctx.beginPath(); ctx.rect(ax.L, ax.T, ax.R - ax.L, ax.B - ax.T); ctx.clip();
      [[1, P.acc], [2, P.red]].forEach(function(s){ ctx.strokeStyle = s[1]; ctx.lineWidth = 2.6; ctx.beginPath(); tr.forEach(function(p, j){ var X = ax.X(p[0]), Y = ax.Y(p[s[0]]); if (j === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }); ctx.stroke(); }); ctx.restore();
      S.draw.text(c, "proies", ax.R - 6, ax.T + 10, {size: 12, color: P.acc, align: "right"}); S.draw.text(c, "prédateurs", ax.R - 6, ax.T + 28, {size: 12, color: P.red, align: "right"});
      /* plan de phase */
      var g = geo(); ctx.strokeStyle = "#8a95a3"; ctx.strokeRect(g.L, g.T, g.R - g.L, g.B - g.T);
      var PX = function(u){ return g.L + u / sx * (g.R - g.L); }, PY = function(v){ return g.B - v / sy * (g.B - g.T); };
      ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); tr.forEach(function(p, j){ var X = PX(p[1]), Y = PY(p[2]); if (j === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }); ctx.stroke();
      S.draw.dot(c, PX(st[0]), PY(st[1]), 6, P.green); S.draw.dot(c, PX(ex), PY(ey), 5, P.red); ctx.restore();
      S.draw.text(c, "plan de phase : proies → , prédateurs ↑ · touche pour le départ", c.W / 2, g.T - 8, {size: 12, color: P.grey});
      var per = 2 * Math.PI / Math.sqrt(R * Mo);
      ro.set(0, S.fmt(ex, 0)); ro.set(1, S.fmt(ey, 0)); ro.set(2, Kt.value ? "amortie (pas de période pure)" : "≈ " + S.fmt(per, 1) + " ans"); ro.set(3, S.fmt(mxX, 0) + " / " + S.fmt(mxY, 0));
      note.set(extinct ? "Les proies, limitées à K = 150, ne sont pas assez nombreuses pour nourrir les prédateurs (il en faudrait " + S.fmt(Mo / (e * A), 0) + ") : les prédateurs disparaissent et les proies reviennent à K (point rouge)." : Kt.value ? "Avec une capacité d'accueil, les oscillations s'amortissent : les effectifs convergent vers l'équilibre (point rouge)." : "Les prédateurs atteignent leur maximum un peu après les proies : leur courbe est décalée dans le temps. L'équilibre (point rouge) n'est jamais atteint : la trajectoire tourne autour.", "");
    });
  }
});

SFA.sim({
  id: "b6-c09-niches", ch: "c09", tag: "Niche utile",
  titre: "Niche écologique, chevauchement et types d'interactions",
  resume: "Deux espèces utilisent une même ressource : plus leurs niches se chevauchent, plus la compétition est forte. Puis identifie le type d'interaction.",
  but: "Mode « Niches » : fais glisser les deux courbes (ou règle les curseurs) pour modifier leur position et leur largeur sur le gradient de taille des graines ; lis le chevauchement. Mode « Interactions » : donne l'effet (−, 0, +) de chaque espèce sur l'autre et trouve le nom de l'interaction.",
  aRetenir: "L'habitat est le lieu où vit une espèce ; la niche écologique est l'ensemble de ses conditions et de ses ressources utilisées (ce qu'elle mange, quand, où…). Un chevauchement faible limite la compétition : les espèces coexistent en se partageant les ressources. Interactions : mutualisme (+ +), commensalisme (+ 0), parasitisme ou prédation (+ −), compétition (− −), amensalisme (0 −), neutralisme (0 0).",
  piege: "Habitat et niche ne sont pas synonymes : plusieurs espèces partagent un même habitat avec des niches différentes. Et le parasitisme ne tue pas toujours l'hôte : un parasite qui tue son hôte trop vite se prive de sa ressource. Chevauchement calculé avec l'indice de Pianka sur deux courbes en cloche (modèle).",
  build: function(k, S){
    var c = k.canvas(380), P = S.draw.palette, ex = 0, msg = "", okm = true;
    var mode = k.seg("Mode", [["n", "Niches"], ["i", "Interactions"]], "n");
    var m1 = k.slider("Position de l'espèce A (taille des graines)", 2, 18, 0.5, 7, "mm"), m2 = k.slider("Position de l'espèce B", 2, 18, 0.5, 11, "mm");
    var s1 = k.slider("Largeur de la niche A", 0.5, 4, 0.1, 1.5, "mm"), s2 = k.slider("Largeur de la niche B", 0.5, 4, 0.1, 1.5, "mm");
    var ea = k.seg("Effet de B sur A", [["-", "−"], ["0", "0"], ["+", "+"]], "0", function(){ msg = ""; }), eb = k.seg("Effet de A sur B", [["-", "−"], ["0", "0"], ["+", "+"]], "0", function(){ msg = ""; });
    k.button("Valider (exemple)", function(){ var q = EX[ex % EX.length], good = ea.value === q[1] && eb.value === q[2]; okm = good; msg = good ? "Exact : " + q[3] : "Pas tout à fait : " + q[3]; });
    k.button("Exemple suivant", function(){ ex++; msg = ""; });
    var ro = k.readouts(["Chevauchement (Pianka)", "Interaction (réponse choisie)"]);
    var note = k.note("", "");
    var EX = [["Abeille (A) et fleur (B) : l'abeille se nourrit du nectar, la fleur est pollinisée", "+", "+", "mutualisme (+ +)."], ["Rémora (A) accroché à un requin (B) : il se nourrit des restes ; le requin n'est pas affecté", "+", "0", "commensalisme (+ 0)."],
      ["Tique (A) sur un chien (B) : la tique se nourrit de son sang", "+", "-", "parasitisme (+ −)."], ["Deux lions (A et B) chassant la même gazelle limitée", "-", "-", "compétition (− −)."],
      ["Noyer (A) dont les feuilles libèrent une substance qui gêne les plantes (B) sous son feuillage, sans bénéfice pour lui", "0", "-", "amensalisme (0 −)."], ["Renard (A) et chevreuil (B), sans aucun contact ni ressource commune", "0", "0", "neutralisme (0 0)."]];
    function name(a, b){ var s = [a, b].sort().join(""); return {"++": "mutualisme", "+0": "commensalisme", "+-": "parasitisme ou prédation", "--": "compétition", "-0": "amensalisme", "00": "neutralisme"}[s.split("").sort().join("")] || {"0+": "commensalisme", "-+": "parasitisme ou prédation", "-0": "amensalisme", "0-": "amensalisme", "+0": "commensalisme"}[s] || "—"; }
    function nm(a, b){ var k2 = a + b; var T = {"++": "mutualisme", "+0": "commensalisme", "0+": "commensalisme", "+-": "parasitisme ou prédation", "-+": "parasitisme ou prédation", "--": "compétition", "0-": "amensalisme", "-0": "amensalisme", "00": "neutralisme"}; return T[k2]; }
    var drag = 0;
    c.pointer(function(t, p){ if (mode.value !== "n" || t === "up") return; var x = (p.x - 40) / (c.W - 56) * 20;   /* axe des x : 0 à 20 mm */ if (t === "down"){ drag = Math.abs(x - m1.value) < Math.abs(x - m2.value) ? 1 : 2; } if (t === "drag" || t === "down"){ (drag === 1 ? m1 : m2).set(Math.max(2, Math.min(18, Math.round(x * 2) / 2))); k.redraw(); } });
    k.draw(function(){
      c.clear(); var ctx = c.ctx;
      if (mode.value === "n"){
        var u1 = m1.value, u2 = m2.value, sa = s1.value, sb = s2.value, f = function(x, u, s){ return Math.exp(-Math.pow(x - u, 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)); };
        var ax = S.draw.axes(c, {x0: 0, x1: 20, y0: 0, y1: 0.9, stepX: 2, stepY: 0.3, yl: "utilisation de la ressource", l: 40, t: 14, b: 44});
        var dx = 0.02, ov = 0, sab = 0, saa = 0, sbb = 0;
        ctx.fillStyle = "rgba(180,35,24,.25)"; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); for (var x = 0; x <= 20; x += dx){ var a = f(x, u1, sa), b = f(x, u2, sb), mn = Math.min(a, b); ov += mn * dx; sab += a * b * dx; saa += a * a * dx; sbb += b * b * dx; ctx.lineTo(ax.X(x), ax.Y(mn)); } ctx.lineTo(ax.X(20), ax.Y(0)); ctx.closePath(); ctx.fill();
        S.draw.fn(c, ax, function(x){ return f(x, u1, sa); }, P.acc, 3); S.draw.fn(c, ax, function(x){ return f(x, u2, sb); }, P.green, 3);
        S.draw.text(c, "A", ax.X(u1), ax.Y(f(u1, u1, sa)) - 12, {size: 14, color: P.acc}); S.draw.text(c, "B", ax.X(u2), ax.Y(f(u2, u2, sb)) - 12, {size: 14, color: P.green});
        var pia = sab / Math.sqrt(saa * sbb); S.draw.text(c, "taille des graines (mm) · zone rouge = ressource utilisée par les deux", c.W / 2, ax.B + 30, {size: 12, color: P.red});
        ro.set(0, S.fmt(pia, 2) + " (0 = aucun, 1 = total)"); ro.set(1, "—");
        note.set(pia > 0.8 ? "Chevauchement très fort : compétition intense, l'une des deux espèces risque d'être exclue (principe de Gause)." : pia > 0.4 ? "Chevauchement partiel : compétition modérée, coexistence possible si chaque espèce se limite surtout elle-même." : "Chevauchement faible : les espèces se partagent la ressource, la compétition est limitée.", pia > 0.8 ? "warn" : "ok");
      } else {
        var q = EX[ex % EX.length];
        var words = q[0].split(" "), line = "", ly = 40, maxc = Math.floor((c.W - 20) / 6.6); c.clear();
        words.forEach(function(w){ if ((line + " " + w).length > maxc){ S.draw.text(c, line, c.W / 2, ly, {size: 13}); ly += 19; line = w; } else line = line ? line + " " + w : w; }); S.draw.text(c, line, c.W / 2, ly, {size: 13});
        var Ax = c.W * 0.25, Bx = c.W * 0.75, cy = 190, sg = function(v){ return v === "-" ? "−" : v; }, cc = function(v){ return v === "+" ? P.green : v === "-" ? P.red : P.grey; };
        [[Ax, "A"], [Bx, "B"]].forEach(function(q){ ctx.fillStyle = "#e8eef7"; ctx.strokeStyle = P.acc; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(q[0], cy, 34, 0, 6.2832); ctx.fill(); ctx.stroke(); S.draw.text(c, q[1], q[0], cy, {size: 22, color: P.acc}); });
        S.draw.arrow(c, Ax + 36, cy - 14, Bx - 38, cy - 14, cc(eb.value), 3); S.draw.text(c, "effet de A sur B : " + sg(eb.value), c.W / 2, cy - 34, {size: 13, color: cc(eb.value)});
        S.draw.arrow(c, Bx - 36, cy + 14, Ax + 38, cy + 14, cc(ea.value), 3); S.draw.text(c, "effet de B sur A : " + sg(ea.value), c.W / 2, cy + 36, {size: 13, color: cc(ea.value)});
        S.draw.text(c, "+ : avantagé · 0 : sans effet · − : désavantagé", c.W / 2, 300, {size: 12, color: P.grey});
        ro.set(0, "—"); ro.set(1, nm(ea.value, eb.value));
        note.set(msg || "Choisis l'effet de B sur A et de A sur B, puis valide. Interaction choisie : <b>" + nm(ea.value, eb.value) + "</b>.", msg ? (okm ? "ok" : "warn") : "");
      }
    });
  }
});
})();
