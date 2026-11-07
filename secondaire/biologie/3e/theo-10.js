/* Biologie 3e · chapitre 10 : perturbations, impact humain et biodiversité */
b3.larva = function (x, y, s, col, tails) {
  for (var i = 0; i < 6; i++) b3.E(x - s * .6 + i * s * .24, y, s * (.2 - i * .008), s * (.16 - i * .006), col, "#5b4a2a");
  b3.E(x + s * .75, y, s * .18, s * .17, col, "#5b4a2a"); DOT(x + s * .8, y - 2, 1.8, INK);
  for (i = 0; i < 3; i++) LN(x - s * .2 + i * s * .2, y + s * .12, x - s * .25 + i * s * .2, y + s * .35, "#5b4a2a", 1.6);
  for (i = 0; i < (tails || 0); i++) LN(x - s * .62, y + (i - (tails - 1) / 2) * 4, x - s * .98, y + (i - (tails - 1) / 2) * 10, "#5b4a2a", 1.6);
};
b3.lake = function (x, y, w, h, alg, o2) {
  /* coupe d'étang : alg = épaisseur d'algues (0..1) ; o2 = 0..1 teinte de l'eau */
  var g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "#c8e4f6"); g.addColorStop(1, o2 < .35 ? "#9aa58a" : "#8ec3ea"); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (alg > 0) { ctx.fillStyle = "rgba(70,160,60," + (.35 + .5 * alg) + ")"; ctx.fillRect(x, y, w, 6 + alg * 20); for (var i = 0; i < 14 * alg; i++) DOT(x + 10 + (i * 53) % (w - 20), y + 4 + (i * 17) % (6 + alg * 20), 3, "#3f9a3a"); }
  ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h);
};
b3.fishD = function (x, y, s, dead) { ctx.save(); ctx.translate(x, y); if (dead) { ctx.scale(1, -1); } b3.ico("poisson", 0, 0, s); ctx.restore(); if (dead) b3.cross(x + s * .4, y - 2, 5, RED); };
SFA.theo("c10", {
  icon: function () {
    b3.lake(W * .1, H * .25, W * .8, H * .5, .8, .2); b3.fishD(W * .3, H * .62, 22, true); b3.fishD(W * .6, H * .65, 22, true); TB("eutrophisation", W * .5, H * .15, DGREEN, 22); TB("seuils · bioindicateurs · gestion durable", W * .5, H * .92, ORANGE, 17);
  },
  anim: function (t) {
    ctx.save(); ctx.scale(W / 700, H / 300);
    var st = Math.floor(t / 150) % 5, f = (t % 150) / 150, lab = ["1  les engrais ruissellent (azote, phosphore)", "2  les algues prolifèrent", "3  elles meurent, la lumière n'arrive plus", "4  les bactéries décomposent : O₂ consommé", "5  manque de O₂ : les poissons meurent"], i;
    ctx.fillStyle = "#cfe8b8"; ctx.fillRect(0, 100, 180, 120); ctx.fillStyle = "#9ad28a"; ctx.fillRect(0, 100, 180, 10); TB("champ", 90, 160, DGREEN, 14); b3.ico("herbe", 40, 138, 16); b3.ico("herbe", 140, 138, 16);
    var alg = [0, .4, 1, .9, .9][st], o2 = [9, 8.6, 5.5, 2, .9][st], dead = st === 4; b3.lake(180, 100, 330, 120, alg, o2 < 3 ? .2 : .8);
    if (st === 0) for (i = 0; i < 6; i++) { var u = (f + i / 6) % 1; DOT(170 + u * 80, 112 + u * 4, 4, ORANGE); } TB("engrais N, P", 100, 90, ORANGE, 13);
    for (i = 0; i < 3; i++) b3.fishD(260 + i * 90, 190 - (i % 2) * 40, 18, dead);
    if (st === 3) for (i = 0; i < 6; i++) { var v = (f * 1.5 + i / 6) % 1; DOT(200 + i * 52, 205 - v * 6, 3, "#6b5a3a"); }
    b3.sun(560, 40, 16, t); if (st >= 2) { ctx.fillStyle = "rgba(255,255,255,.5)"; }
    b3.box(540, 90, 140, 130, "#f4f8fc", BLUE, 10); TB("O₂ dissous", 610, 112, BLUE_D, 13); b3.box(560, 124, 100, 20, "#e8eef4", null, 4); b3.box(560, 124, 100 * o2 / 9, 20, o2 > 4 ? "#7cc470" : o2 > 2 ? "#f0b040" : RED, null, 4); TB(String(o2).replace(".", ",") + " mg/L", 610, 170, INK, 14);
    TB(st === 4 ? "mortalité" : "poissons", 610, 195, st === 4 ? DRED : DGREEN, 13);
    b3.box(20, 240, 660, 36, "#fff3de", ORANGE, 10); TB(lab[st], 350, 264, INK, 15);
    for (i = 0; i < 5; i++) DOT(300 + i * 25, 290, 4, i === st ? ORANGE : AX);
    ctx.restore();
  },
  th: "<div class=\"tcard\"><b class=\"h\">Seuils et bascules</b><p>Un écosystème encaisse les perturbations (pollution, surpêche, engrais, espèces introduites) <b>jusqu'à un seuil</b> ; au-delà, il <b>bascule</b> vers un autre état, parfois difficile à inverser. Comprendre les seuils permet de gérer durablement.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">L'eutrophisation</b><p>Un excès d'<b>azote et de phosphore</b> (engrais, eaux usées) fait proliférer les <b>algues</b>. Elles bloquent la lumière, meurent, et leur <b>décomposition par les bactéries consomme le dioxygène</b> : les poissons meurent par asphyxie. La nuit, sans photosynthèse mais avec la respiration des algues et des bactéries, le O₂ est au minimum à l'<b>aube</b> : c'est là que les poissons meurent.</p><p><i>Exemple :</i> 2 000 L d'eau par m² à 9 mg/L : 18 g de O₂ dissous. 20 g d'algues (glucose) en décomposition consomment 20 × 192 / 180 ≈ <b>21,3 g</b> : le O₂ est épuisé. <i>Besoins minimaux :</i> truite 6 mg/L, gardon 4, carpe 2 : un étang à 3,1 mg/L ne garde que la carpe.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Les bioindicateurs</b><p>Une espèce <b>sensible</b> (larve de plécoptère, d'éphémère) ne vit que dans une eau propre et bien oxygénée ; une espèce <b>tolérante</b> (tubifex, chironome rouge) survit dans une eau polluée. Leur présence renseigne sur la qualité du milieu. <i>Indice simplifié :</i> IB = 1,5 × (sensibilité du taxon le plus sensible) + 0,5 × (nombre de taxa, plafonné à 5). <i>Exemple :</i> gammares (3), aselles (2), tubifex (1) : 1,5 × 3 + 0,5 × 3 = <b>6</b> (moyen). Avec en plus éphémères (4) et plécoptères (5) : 1,5 × 5 + 0,5 × 5 = <b>10</b> (très bonne).</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Surexploitation et rendement maximal durable</b><p>Un stock se renouvelle ; on peut prélever sans l'épuiser jusqu'à un maximum. Dans un modèle : <b>RMD = r × K / 4</b>. <i>Exemples :</i> r = 0,4 et K = 1 000 t : RMD = 100 t/an ; r = 0,3 : 75 t/an. Pêcher 150 t chaque année, au-dessus du RMD, conduit à l'<b>effondrement</b> du stock. <i>Quota fixe ou part du stock ?</i> Après un choc qui fait tomber le stock de 500 à 375 t, le renouvellement vaut g = 0,4 × 375 × (1 − 0,375) = <b>93,75 t</b> : un quota fixe de 100 t dépasse le renouvellement et épuise le stock, alors que 20 % du stock (75 t) laisse le stock se rétablir.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Espèces invasives et gestion durable</b><p>Une espèce introduite devient <b>invasive</b> quand, dans son nouveau milieu, elle a <b>peu de prédateurs et de parasites</b> et exploite bien les ressources : elle prolifère aux dépens des espèces locales. Agir : à long terme contre l'eutrophisation, <b>réduire les apports d'azote et de phosphore</b> (épuration des eaux, moins d'engrais, bandes enherbées le long des cours d'eau) ; pour la pêche, quotas adaptés au renouvellement ; protéger les milieux et surveiller par des bioindicateurs.</p></div>"
});

SFA.figs("c10", [
  /* 0 Engrais et poissons */
  function (p) {
    var nm = ["engrais", "algues ↑", "mortes", "O₂ ↓", "poissons ↓"], cl = [ORANGE, GREEN, "#8a6a3a", BLUE, RED], i, x;
    b3.lake(W * .05, H * .55, W * .9, H * .3, p > 0 ? 1 : .2, p > 0 ? .2 : .9); for (i = 0; i < 3; i++) b3.fishD(W * (.25 + i * .25), H * .72, 16, p > 0);
    for (i = 0; i < 5; i++) { x = W * (.1 + i * .2); if (p > 0 || i === 0) { b3.box(x - 36, H * .15, 72, 34, cl[i] + "33", cl[i], 10); TB(nm[i], x, H * .15 + 22, INK, 14); if (i < 4 && p > 0) b3.ar(x + 38, H * .15 + 17, x + W * .2 - 38, H * .15 + 17, GREY, 2.5); } }
    if (p <= 0) TB("pourquoi les poissons meurent-ils ?", W * .6, H * .28, ORANGE, 15);
  },
  /* 1 Un bon indicateur */
  function (p) {
    var nm = ["plécoptère", "tubifex", "chironome rouge", "aselle"], cl = ["#b9a06a", "#d9858a", "#c4453f", "#8d8d85"], i;
    for (i = 0; i < 4; i++) { var x = W * (.27 + (i % 2) * .46), y = H * (.28 + Math.floor(i / 2) * .38); b3.box(x - W * .21, y - 30, W * .42, 78, i === 0 && p > 0 ? "#e4f6ee" : "#f7f7f7", i === 0 && p > 0 ? GREEN : "#d0d0d0", 10); b3.larva(x, y, 54, cl[i], i === 0 ? 3 : 0); TB(nm[i], x, y + 40, i === 0 && p > 0 ? DGREEN : INK, 13); }
    if (p > 0) { b3.pill("eau propre et oxygénée", W * .5, H * .95, DGREEN, "#fff", 14); } else TB("lequel indique une eau propre ?", W * .5, H * .96, ORANGE, 14);
  },
  /* 2 Calculer un indice */
  function (p) {
    var x0 = W * .1, w = W * .8, y = H * .5, X = function (v) { return x0 + v / 10 * w; }, i, cl = ["#f2a28a", "#f4c6a0", "#d8ec9a", "#8fd18f"], zn = ["mauvaise", "moyenne", "bonne", "très bonne"];
    for (i = 0; i < 4; i++) { b3.box(X(i * 2.5), y - 20, X(2.5) - x0 - 2, 40, cl[i], null, 4); TB(zn[i], X(i * 2.5 + 1.25), y + 4, INK, 12); }
    [0, 5, 10].forEach(function (v) { TB(v, X(v), y + 36, GREY, 12); });
    TB("relevé 1 : 1,5 × 3 + 0,5 × 3", W * .5, H * .13, BLUE_D, 14); TB("relevé 2 : 1,5 × 5 + 0,5 × 5", W * .5, H * .26, DGREEN, 14);
    if (p > 0) { DOT(X(6), y - 32, 7, BLUE); TB("6", X(6), y - 44, BLUE_D, 15); DOT(X(10), y - 32, 7, GREEN); TB("10", X(10) - 10, y - 44, DGREEN, 15); b3.ar(X(6) + 10, y - 32, X(10) - 12, y - 32, GREY, 2.5); b3.pill("la dépollution a fonctionné", W * .5, H * .88, "#e4f6ee", DGREEN, 14); } else TB("IB = ?", W * .5, H * .8, ORANGE, 20);
  },
  /* 3 Rendement maximal */
  function (p) {
    var gx = W * .12, gb = H * .78, gw = W * .8, gh = H * .58, X = function (n) { return gx + n / 1000 * gw; }, Y = function (v) { return gb - v / 170 * gh; }, i;
    b3.axes(gx, gb, gw + 8, gh + 14, "stock N (t)", "renouvellement (t/an)"); var pts = []; for (i = 0; i <= 50; i++) { var n = i * 20; pts.push([X(n), Y(.4 * n * (1 - n / 1000))]); } b3.curve(pts, GREEN, 3.5);
    [0, 500, 1000].forEach(function (n) { TB(n, X(n), gb + 18, GREY, 12); });
    if (p > 0) { DOT(X(500), Y(100), 7, ORANGE); TB("RMD = 0,4 × 1 000 / 4 = 100 t/an", X(500), Y(100) - 14, ORANGE, 14); LN(gx, Y(150), gx + gw, Y(150), RED, 2, [6, 4]); TB("150 t/an : au-dessus de la courbe → effondrement", gx + gw, Y(150) - 6, DRED, 12, "right"); TB("(0,3 : 75 t/an)", X(500), Y(100) + 28, GREY, 12); } else TB("rendement maximal ?", X(500), Y(60), ORANGE, 16);
  },
  /* 4 Espèce invasive */
  function (p) {
    TB("milieu d'origine", W * .25, H * .1, DGREEN, 14); TB("nouveau milieu", W * .75, H * .1, DRED, 14); LN(W * .5, H * .14, W * .5, H * .92, AX, 1.5, [4, 4]);
    b3.ico("lapin", W * .22, H * .5, 28); b3.ico("renard", W * .22, H * .78, 24); b3.ar(W * .22, H * .68, W * .22, H * .6, RED, 3); TB("prédateurs, parasites", W * .25, H * .94, GREY, 12);
    b3.ico("lapin", W * .66, H * .46, 28); TB("espèce introduite", W * .75, H * .94, GREY, 12);
    if (p > 0) { var pts = [], i; for (i = 0; i <= 20; i++) pts.push([W * .78 + i * 4, H * .78 - Math.pow(1.22, i) * 1.6]); b3.curve(pts, RED, 3.5); b3.cross(W * .78, H * .86, 11, GREY); b3.pill("peu de prédateurs : elle prolifère", W * .75, H * .22, "#fdecea", DRED, 13); } else TB("pourquoi prolifère-t-elle ?", W * .75, H * .22, ORANGE, 14);
  },
  /* 5 Quatre étangs */
  function (p) {
    var v = [8.1, 4.8, 3.1, .9], nm = ["A", "B", "C", "D"], gb = H * .78, k = H * .55 / 9, i;
    LN(W * .08, gb, W * .94, gb, INK, 2); [[6, "truite 6", "#f2a28a"], [4, "gardon 4", ORANGE], [2, "carpe 2", "#6aa84f"]].forEach(function (q) { LN(W * .08, gb - q[0] * k, W * .94, gb - q[0] * k, q[2], 1.6, [6, 4]); TB(q[1], W * .94, gb - q[0] * k - 4, q[2] === "#6aa84f" ? DGREEN : q[2] === ORANGE ? ORANGE : DRED, 12, "right"); });
    for (i = 0; i < 4; i++) { var x = W * (.14 + i * .17); b3.box(x, gb - v[i] * k, W * .11, v[i] * k, "#8ec3ea99", BLUE_D, 3); TB(nm[i], x + W * .055, gb + 17, INK, 15); TB(String(v[i]).replace(".", ","), x + W * .055, gb - v[i] * k - 6, BLUE_D, 13); if (p > 0) TB(["3 esp.", "2 esp.", "carpe", "aucune"][i], x + W * .055, gb + 34, i === 3 ? DRED : DGREEN, 12); }
    TB("O₂ minimal (mg/L)", W * .08, H * .08, GREY, 13, "left"); if (p > 0) TB("ordre : A, B, C, D", W * .6, H * .08, DGREEN, 14);
  },
  /* 6 Quota ou part du stock */
  function (p) {
    var gx = W * .12, gb = H * .78, gw = W * .8, gh = H * .58, X = function (n) { return gx + n / 1000 * gw; }, Y = function (v) { return gb - v / 120 * gh; }, i;
    b3.axes(gx, gb, gw + 8, gh + 14, "stock N (t)", "t/an"); var pts = []; for (i = 0; i <= 50; i++) { var n = i * 20; pts.push([X(n), Y(.4 * n * (1 - n / 1000))]); } b3.curve(pts, GREEN, 3.5);
    LN(X(0), Y(100), X(1000), Y(100), RED, 2.2, [6, 4]); TB("quota 100 t", X(1000), Y(100) - 6, DRED, 12, "right"); LN(X(0), Y(0), X(700), Y(140), BLUE, 2.2); TB("20 % du stock", X(700), Y(140) - 6, BLUE_D, 12, "right");
    [0, 375, 500, 1000].forEach(function (n) { TB(n, X(n), gb + 18, GREY, 11); });
    if (p > 0) { LN(X(375), gb, X(375), Y(93.75), ORANGE, 1.6, [4, 3]); DOT(X(375), Y(93.75), 6, ORANGE); TB("g = 93,75", X(375) + 8, Y(93.75) + 22, ORANGE, 13, "left"); b3.pill("quota 100 > 93,75 : effondrement", W * .6, H * .06, "#fdecea", DRED, 13); b3.pill("75 < 93,75 : rétablissement", W * .6, H * .17, "#e4f6ee", DGREEN, 13); } else TB("après un choc à 375 t ?", W * .6, H * .1, ORANGE, 15);
  },
  /* 7 Les poissons meurent à l'aube */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .84, gh = H * .55, X = function (h) { return gx + h / 24 * gw; }, Y = function (v) { return gb - v / 10 * gh; }, i;
    b3.axes(gx, gb, gw + 8, gh + 14, "heure", "O₂ dissous"); [0, 6, 12, 18, 24].forEach(function (h) { TB(h, X(h), gb + 18, GREY, 12); });
    var pts = []; for (i = 0; i <= 48; i++) { var h = i * .5, v = 5.8 + 3 * Math.sin(6.2832 * (h - 11.5) / 24); pts.push([X(h), Y(v)]); } b3.curve(pts, BLUE, 3.5);
    LN(gx, Y(4), gx + gw, Y(4), RED, 1.6, [5, 4]); TB("seuil vital", gx + gw, Y(4) - 5, DRED, 12, "right"); b3.box(X(7), H * .08, X(12) - X(7), 8, "#ffe58a", null, 3); TB("jour : photosynthèse", X(11), H * .07 + 14, "#a07d00", 12);
    if (p > 0) { DOT(X(6), Y(2.8), 8, RED); b3.pill("minimum à l'aube", X(6) + 30, Y(2.8) + 26, "#fdecea", DRED, 14); b3.ar(X(6), Y(2.8) + 12, X(6), Y(2.8) + 2, RED, 2); } else TB("quand le O₂ est-il minimal ?", W * .6, H * .45, ORANGE, 15);
  },
  /* 8 Bilan d'oxygène d'un étang */
  function (p) {
    var gb = H * .8, k = H * .5 / 22, x = [W * .2, W * .56]; LN(W * .08, gb, W * .92, gb, INK, 2);
    b3.box(x[0], gb - 18 * k, W * .2, 18 * k, "#8ec3ea", INK, 3); TB("O₂ dissous", x[0] + W * .1, gb + 17, INK, 13); TB("18 g/m²", x[0] + W * .1, gb - 18 * k - 8, BLUE_D, 15);
    if (p > 0) { b3.box(x[1], gb - 21.3 * k, W * .2, 21.3 * k, "#f2a28a", INK, 3); TB("consommé par 20 g d'algues", x[1] + W * .1, gb + 17, INK, 12); TB("21,3 g", x[1] + W * .1, gb - 21.3 * k - 8, DRED, 15); b3.pill("21,3 > 18 : O₂ épuisé", W * .5, H * .1, "#fdecea", DRED, 15); } else { TB("?", x[1] + W * .1, gb - 40, ORANGE, 30); TB("décomposition de 20 g d'algues", x[1] + W * .1, gb + 17, INK, 12); }
  },
  /* 9 Agir contre l'eutrophisation */
  function (p) {
    ctx.fillStyle = "#cfe8b8"; ctx.fillRect(0, H * .35, W * .3, H * .4); TB("champs", W * .15, H * .56, DGREEN, 14); b3.lake(W * .5, H * .4, W * .46, H * .35, p > 0 ? .1 : .9, p > 0 ? .9 : .2);
    var i; for (i = 0; i < 3; i++) b3.ar(W * .3, H * (.45 + i * .08), p > 0 && i > 0 ? W * .38 : W * .5, H * (.45 + i * .08), ORANGE, p > 0 ? 1.5 : 3);
    TB("azote, phosphore", W * .4, H * .36, ORANGE, 13);
    if (p > 0) { ctx.fillStyle = "#6cb85a"; ctx.fillRect(W * .33, H * .38, 14, H * .4); TB("bande enherbée", W * .38, H * .87, DGREEN, 13); b3.pill("réduire les apports de P et N", W * .5, H * .12, "#e4f6ee", DGREEN, 14); b3.check(W * .85, H * .25, 12); } else TB("quelle mesure à long terme ?", W * .5, H * .15, ORANGE, 15);
  }
]);
