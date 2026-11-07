/* Biologie 3e · chapitre 6 : la respiration cellulaire */
b3.mito = function (x, y, s, hl) {
  b3.E(x, y, 34 * s, 20 * s, hl ? "#ffd6a8" : "#f7d9b5", hl ? ORANGE : "#b9783a", .1);
  ctx.strokeStyle = hl ? ORANGE : "#b9783a"; ctx.lineWidth = 1.6; ctx.beginPath(); for (var i = -2; i <= 2; i++) { ctx.moveTo(x + i * 11 * s, y - 14 * s + Math.abs(i) * 2 * s); ctx.lineTo(x + i * 11 * s, y + (i % 2 ? 2 : -2) * s); } ctx.stroke();
};
b3.cell = function (cx, cy, rx, ry, hl) {
  b3.E(cx, cy, rx + 8, ry + 8, "#eef7ea", "#7fae6a"); b3.E(cx, cy, rx, ry, "#f9f1e6", "#c9a06a");
  b3.E(cx - rx * .35, cy - ry * .2, ry * .28, ry * .28, "#c9b6e8", VIOLET); TB("noyau", cx - rx * .35, cy - ry * .2 + 4, "#4a3fa0", 12);
  b3.E(cx + rx * .4, cy - ry * .45, 30, 16, "#a9dc96", DGREEN, .3); TB("chloroplaste", cx + rx * .4, cy - ry * .45 - 22, DGREEN, 12);
  b3.mito(cx + rx * .3, cy + ry * .4, 1.1, hl); TB("mitochondrie", cx + rx * .3, cy + ry * .4 + 34, hl ? ORANGE : "#8a5a2b", 12);
  TB("paroi", cx - rx - 10, cy + ry + 14, "#5c8a4a", 12);
};
SFA.theo("c06", {
  icon: function () {
    TB("C₆H₁₂O₆ + 6 O₂", W * .5, H * .38, BLUE_D, 28); TB("→ 6 CO₂ + 6 H₂O + énergie", W * .5, H * .58, ORANGE, 22); b3.mito(W * .5, H * .82, 1.2, true);
  },
  anim: function (t) {
    ctx.save(); ctx.scale(W / 700, H / 300); var i;
    b3.E(350, 140, 180, 100, "#fdf6ec", "#c9a06a"); TB("cellule", 350, 56, GREY, 14);
    b3.mito(350, 140, 2.6, true); TB("mitochondrie", 350, 232, "#8a5a2b", 14);
    for (i = 0; i < 3; i++) { var u = (t * .006 + i / 3) % 1; b3.E(60 + u * 200, 120 + Math.sin(u * 6 + i) * 4, 12, 12, "#ffd6a8", ORANGE); TB("G", 60 + u * 200, 125 + Math.sin(u * 6 + i) * 4, ORANGE, 11); }
    for (i = 0; i < 4; i++) { var v = (t * .007 + i / 4) % 1; DOT(60 + v * 230, 170 + Math.sin(v * 5 + i) * 5, 6, BLUE); }
    TB("glucose", 90, 100, ORANGE, 14); TB("dioxygène O₂", 100, 205, BLUE_D, 14);
    for (i = 0; i < 4; i++) { var w = (t * .007 + i / 4) % 1; DOT(440 + w * 180, 110 + (i % 2) * 40 + Math.sin(w * 5) * 4, 6, GREY); }
    TB("CO₂ + eau", 560, 98, "#6a6a6a", 14);
    for (i = 0; i < 3; i++) { var a = (t * .05 + i * 2.1); b3.pill("ATP", 350 + Math.cos(a) * 62, 140 + Math.sin(a) * 50 - 0, "#ffe58a", "#7a5a00", 11); }
    ctx.strokeStyle = "rgba(226,75,74,.55)"; ctx.lineWidth = 3; for (i = 0; i < 3; i++) { ctx.beginPath(); var yy = 220 + i * 0, off = (t * .8 + i * 12) % 40; ctx.moveTo(480 + i * 16, 190 - off); ctx.bezierCurveTo(488 + i * 16, 180 - off, 472 + i * 16, 170 - off, 480 + i * 16, 160 - off); ctx.stroke(); }
    TB("chaleur", 520, 215, DRED, 13);
    b3.box(30, 245, 640, 44, "#f4f8fc", BLUE, 10); TB("glucose + O₂ → CO₂ + H₂O + énergie (≈ 32 % en ATP, le reste en chaleur)", 350, 272, INK, 15);
    b3.box(440, 14, 240, 30, "#fff3de", ORANGE, 8); TB("sans O₂ : fermentation, peu rentable", 560, 34, ORANGE, 13);
    ctx.restore();
  },
  th: "<div class=\"tcard\"><b class=\"h\">Le bilan de la respiration cellulaire</b><p>Dans chaque cellule vivante, le <b>glucose</b> réagit avec le <b>dioxygène</b> :</p><p style=\"text-align:center\"><b>glucose + dioxygène → dioxyde de carbone + eau + énergie</b><br>C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O</p><p>Elle se déroule surtout dans les <b>mitochondries</b>. En masse : 180 g de glucose + 192 g de O₂ → 264 g de CO₂ + 108 g d'eau (372 g de chaque côté : la masse se conserve).</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">L'énergie libérée</b><p>La respiration d'un gramme de glucose libère environ <b>15,6 kJ</b>. Une partie (environ 32 %) est stockée dans l'<b>ATP</b>, la molécule que la cellule utilise comme énergie immédiatement disponible ; le reste (environ 68 %) est dissipé en <b>chaleur</b>. <i>Exemple :</i> 50 g de glucose → 50 × 15,6 = <b>780 kJ</b> ; ATP : 780 × 0,32 ≈ 250 kJ ; chaleur : ≈ 530 kJ.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Du repas à la cellule</b><p>La <b>digestion</b> fournit le glucose, la <b>respiration pulmonaire</b> et la <b>circulation</b> apportent O₂ jusqu'aux cellules et ramènent CO₂ aux poumons. Ces deux « respirations » sont différentes : l'une est un échange de gaz entre l'air et le sang, l'autre est la réaction qui libère l'énergie dans les cellules. Les plantes respirent aussi, jour et nuit : dans le noir, une plante consomme O₂ et rejette CO₂.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Calculs de masses et réactif limitant</b><p>On utilise la proportionnalité avec 180 : 192 : 264 : 108. <i>Exemple :</i> 90 g de glucose (moitié) consomment 96 g de O₂ et donnent 132 g de CO₂ et 54 g d'eau. S'il y a 60 g de glucose et 50 g de O₂ : il faudrait 64 g de O₂ pour tout le glucose, donc <b>O₂ est limitant</b>. Il réagit en totalité : CO₂ = 50 × 264 / 192 ≈ <b>68,8 g</b> ; glucose consommé = 50 × 180 / 192 ≈ 46,9 g ; il en reste ≈ <b>13,1 g</b>.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Sans dioxygène : la fermentation</b><p>Les <b>levures</b> fermentent le glucose en alcool et CO₂ ; les <b>muscles</b> en manque d'O₂ produisent du <b>lactate</b>. L'énergie obtenue est bien plus faible (environ 2 ATP par glucose contre une trentaine). <i>Exemple :</i> 5 g de glucose donnent 5 × 88 / 180 ≈ 2,4 g de CO₂ par fermentation, mais 5 × 264 / 180 ≈ 7,3 g par respiration : 3 fois plus. Après un sprint, on reste essoufflé : on rembourse la <b>dette d'oxygène</b> (élimination du lactate, reconstitution des réserves).</p></div>"
});

SFA.figs("c06", [
  /* 0 Compléter le bilan */
  function (p) {
    var q = [["glucose", ORANGE], ["+", INK], ["O₂", BLUE], ["→", INK], ["CO₂", GREY], ["+", INK], ["H₂O", BLUE_D], ["+", INK], ["énergie", RED]], x = W * .03, i;
    var ws = [.15, .05, .1, .06, .1, .05, .1, .05, .16]; for (i = 0; i < 9; i++) { var w = W * ws[i], cx = x + w / 2; var blank = (i === 2 || i === 4 || i === 6) && p <= 0; if (i % 2 === 0) { b3.box(x, H * .38, w - 2, 44, blank ? "#fff3de" : "#f4f4f4", blank ? ORANGE : q[i][1], 8); TB(blank ? "?" : q[i][0], cx, H * .38 + 30, blank ? ORANGE : (q[i][1] === GREY ? "#555" : q[i][1]), i === 8 || i === 0 ? 12 : 16); } else TB(q[i][0], cx, H * .38 + 30, INK, 20); x += w; }
    TB("respiration cellulaire", W * .5, H * .18, BLUE_D, 17); if (p > 0) TB("C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", W * .5, H * .78, DGREEN, 16);
  },
  /* 1 Où ça se passe */
  function (p) { b3.cell(W * .5, H * .5, W * .36, H * .3, p > 0); if (p > 0) b3.pill("respiration cellulaire", W * .5, H * .93, ORANGE, "#fff", 14); },
  /* 2 Conservation des masses */
  function (p) {
    var y = H * .45; b3.box(W * .04, y - 48, W * .4, 96, "#fdf6ec", ORANGE, 12); b3.box(W * .56, y - 48, W * .4, 96, "#eef2f6", BLUE, 12);
    TB("90 g glucose", W * .24, y - 14, ORANGE, 15); TB("+ ? g O₂", W * .24, y + 16, BLUE_D, 15); TB("? g CO₂", W * .76, y - 14, "#555", 15); TB("+ ? g eau", W * .76, y + 16, BLUE_D, 15);
    b3.ar(W * .46, y, W * .54, y, INK, 3);
    if (p > 0) { b3.box(W * .04, y - 48, W * .4, 96, "#fdf6ec", ORANGE, 12); b3.box(W * .56, y - 48, W * .4, 96, "#eef2f6", BLUE, 12); TB("90 g glucose", W * .24, y - 14, ORANGE, 15); TB("+ 96 g O₂", W * .24, y + 16, BLUE_D, 15); TB("132 g CO₂", W * .76, y - 14, "#555", 15); TB("+ 54 g eau", W * .76, y + 16, BLUE_D, 15); TB("186 g", W * .24, y + 74, DGREEN, 18); TB("186 g", W * .76, y + 74, DGREEN, 18); TB("=", W * .5, y + 74, DGREEN, 22); } else TB("la masse se conserve-t-elle ?", W * .5, H * .88, ORANGE, 15);
  },
  /* 3 Énergie d'un gramme */
  function (p) {
    var x0 = W * .08, w = W * .84, y = H * .42;
    b3.box(x0, y, w, 46, "#f4f4f4", INK, 6); TB("50 g × 15,6 kJ/g", W * .5, y - 14, ORANGE, 16);
    if (p > 0) { var f = b3.f(p, 0, .6), wa = w * .32 * f; b3.box(x0, y, wa, 46, "#ffd84d", INK, 6); b3.box(x0 + w * .32, y, w * .68 * f, 46, "#f2a28a", INK, 6); TB("ATP ≈ 250 kJ", x0 + w * .16, y + 70, "#8a6a00", 14); TB("chaleur ≈ 530 kJ", x0 + w * .66, y + 70, DRED, 14); b3.pill("780 kJ en tout", W * .5, y + 26 * 0 - 46, DGREEN, "#fff", 14); } else { TB("780 kJ ?", W * .5, y + 30, ORANGE, 20); TB("part en ATP, part en chaleur ?", W * .5, H * .85, GREY, 14); }
  },
  /* 4 Plante dans le noir */
  function (p) {
    b3.box(W * .12, H * .15, W * .36, H * .65, "#2c2f4a", INK, 18); b3.ico("herbe", W * .3, H * .6, 36); b3.ico("feuille", W * .3, H * .35, 22); TB("24 h dans le noir", W * .3, H * .9, INK, 14);
    TB("O₂", W * .62, H * .3, BLUE_D, 22); TB("CO₂", W * .62, H * .6, "#555", 22);
    if (p > 0) { b3.ar(W * .74, H * .3, W * .74, H * .42, RED, 4); TB("diminue", W * .8, H * .38, DRED, 15, "left"); b3.ar(W * .74, H * .68, W * .74, H * .54, GREEN, 4); TB("augmente", W * .8, H * .6, DGREEN, 15, "left"); } else TB("?", W * .8, H * .45, ORANGE, 28);
  },
  /* 5 Réactif limitant */
  function (p) {
    var gb = H * .8, k = H * .5 / 64, bx = [W * .1, W * .36, W * .62], nm = ["glucose 60 g", "O₂ 50 g", "O₂ nécessaire 64 g"], v = [60, 50, 64], cl = ["#f2c9a0", "#8ec3ea", "#e3effb"], i;
    LN(W * .06, gb, W * .94, gb, INK, 2); for (i = 0; i < 3; i++) { b3.box(bx[i], gb - v[i] * k, W * .18, v[i] * k, cl[i], i === 2 ? BLUE : INK, 3); TB(nm[i], bx[i] + W * .09, gb + 17, INK, 12); }
    if (p > 0) { b3.pill("O₂ limitant", bx[1] + W * .09, gb - 50 * k - 16, RED, "#fff", 14); b3.box(bx[0], gb - 13.1 * k, W * .18, 13.1 * k, "#e08a3a", INK, 2); TB("13,1 g restent", bx[0] + W * .09, gb - 60 * k - 8, ORANGE, 13); TB("CO₂ ≈ 68,8 g", W * .5, H * .08, DGREEN, 16); } else TB("réactif limitant ?", W * .5, H * .1, ORANGE, 16);
  },
  /* 6 Fermentation ou respiration */
  function (p) {
    var gb = H * .8, k = H * .5 / 7.3, i; LN(W * .1, gb, W * .9, gb, INK, 2);
    b3.box(W * .2, gb - 2.44 * k, W * .22, 2.44 * k, "#f2c9a0", INK, 3); TB("fermentation", W * .31, gb + 18, INK, 14);
    TB("5 g de glucose", W * .5, H * .08, GREY, 14);
    if (p > 0) { b3.box(W * .58, gb - 7.33 * k, W * .22, 7.33 * k, "#8ec3ea", INK, 3); TB("respiration", W * .69, gb + 18, INK, 14); TB("≈ 2,4 g (1,4 L)", W * .31, gb - 2.44 * k - 8, ORANGE, 14); TB("≈ 7,3 g", W * .69, gb - 7.33 * k - 8, BLUE_D, 15); b3.pill("× 3", W * .5, H * .5, DGREEN, "#fff", 18); } else { TB("CO₂ ?", W * .31, gb - 2.44 * k - 8, ORANGE, 15); TB("?", W * .69, gb - 40, ORANGE, 28); }
  },
  /* 7 Essoufflé après le sprint */
  function (p) {
    var gx = W * .1, gb = H * .8, gw = W * .82, gh = H * .55, X = function (t) { return gx + t / 10 * gw; }, Y = function (v) { return gb - v / 8 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "temps", "O₂ consommé"); var pts = [[0, 1], [1.5, 1], [1.5, 2.5], [3, 2.5], [3, 5], [4.5, 4.2], [6, 2.8], [8, 1.5], [10, 1]];
    if (p > 0) { ctx.fillStyle = "rgba(226,75,74,.22)"; ctx.beginPath(); ctx.moveTo(X(3), Y(1)); pts.slice(4).forEach(function (q) { ctx.lineTo(X(q[0]), Y(q[1])); }); ctx.lineTo(X(10), Y(1)); ctx.closePath(); ctx.fill(); b3.pill("dette d'oxygène remboursée", X(6.4), Y(5.4), "#fdecea", DRED, 13); }
    b3.curve(pts.map(function (q) { return [X(q[0]), Y(q[1])]; }), BLUE, 3.5); LN(gx, Y(1), gx + gw, Y(1), AX, 1.2, [4, 4]); TB("repos", gx + 6, Y(1) - 6, GREY, 12, "left"); TB("sprint", X(1.5) + 2, Y(2.5) - 10, ORANGE, 13); TB("récupération", X(6), Y(1) + 34 - 24, BLUE_D, 12);
    b3.box(X(1.5), H * .2, X(3) - X(1.5), 8, "#ffd6a8", ORANGE, 3);
  },
  /* 8 Chiffrer la dette */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .84, gh = H * .55, X = function (t) { return gx + t / 30 * gw; }, Y = function (v) { return gb - v / 7 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "t (s)", "L O₂ / min"); [0, 30].forEach(function (t) { TB(t, X(t), gb + 18, GREY, 12); }); [2, 6].forEach(function (v) { TB(v, gx - 6, Y(v) + 4, GREY, 12, "right"); });
    LN(X(0), Y(6), X(30), Y(6), RED, 2.5, [6, 4]); TB("besoin 6,0", X(15), Y(6) - 8, DRED, 13); b3.box(X(0), Y(2), X(30) - X(0), gb - Y(2), "rgba(55,138,221,.28)", BLUE, 2); TB("consommé 2,0", X(15), Y(1) + 6, BLUE_D, 14);
    if (p > 0) { b3.box(X(0), Y(6), X(30) - X(0), Y(2) - Y(6), "rgba(226,75,74,.25)", null, 0); b3.pill("déficit 4,0 × 0,5 = 2,0 L", X(15), Y(4) + 4, "#fdecea", DRED, 14); b3.pill("lactate : 1 + 2 × 3,5 = 8,0 mmol/L", W * .5, H * .08 + 6, "#fff3de", ORANGE, 13); TB("remboursé en 2,0 / 1,5 ≈ 80 s", W * .5, H * .97, DGREEN, 14); }
  },
  /* 9 Deux respirations */
  function (p) {
    b3.lungs(W * .2, H * .5, .4, .7); TB("poumons", W * .2, H * .9, INK, 13); b3.ar(W * .34, H * .45, W * .6, H * .45, RED, 4); TB("sang : O₂", W * .47, H * .38, DRED, 13);
    b3.cell(W * .78, H * .5, W * .15, H * .22, true); b3.ar(W * .6, H * .62, W * .34, H * .62, GREY, 3); TB("CO₂", W * .47, H * .7, "#555", 13);
    if (p > 0) { b3.pill("pulmonaire : échange de gaz", W * .22, H * .1, "#e3f1fb", BLUE_D, 13); b3.pill("cellulaire : libère l'énergie", W * .76, H * .12, "#fff3de", ORANGE, 13); }
  }
]);
