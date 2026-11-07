/* Biologie 3e · chapitre 2 : flux d'énergie, pyramides et rendement */
function b3_pyr(x, y, w, h, n, fr, cols, labs, p) {
  /* pyramide empilée : n niveaux, du bas vers le haut, largeur du bas = w, largeur × fr à chaque niveau */
  for (var i = 0; i < n; i++) { var ww = w * Math.pow(fr, i), yy = y - (i + 1) * h; b3.box(x - ww / 2, yy, ww, h - 3, cols[i], INK, 4); if (labs && labs[i]) TB(labs[i], x, yy + h / 2 + 3, INK, 13); }
}
SFA.theo("c02", {
  icon: function () {
    var y = H * .78, i; for (i = 0; i < 4; i++) { var w = 210 * Math.pow(.5, i); b3.box(W * .3 - w / 2, y - (i + 1) * 40, w, 36, ["#9ad28a", "#8ec3ea", "#f4c6a0", "#f2a28a"][i], INK, 4); }
    TB("× 10 %", W * .72, H * .42, ORANGE, 38); TB("rendement", W * .72, H * .6, BLUE_D, 18); b3.ar(W * .56, H * .3, W * .56, H * .6, RED, 3, [5, 4]);
  },
  anim: function (t) {
    var cx = W * .35, base = H * .92, h = H * .2, cols = ["#9ad28a", "#8ec3ea", "#f4c6a0", "#f2a28a"], val = ["20 000 kJ", "2 000 kJ", "200 kJ", "20 kJ"], nm = ["Producteurs", "Conso. I", "Conso. II", "Conso. III"], i;
    for (i = 0; i < 4; i++) {
      var w = 260 * Math.pow(.6, i), y = base - (i + 1) * h; b3.box(cx - w / 2, y, w, h - 4, cols[i], INK, 4); TB(val[i], cx, y + h / 2 + 3, INK, 14);
      TB(nm[i], cx - w / 2 - 10, y + h / 2 + 4, GREY, 13, "right");
      if (i < 3) { var ph = (t * .013 + i * .3) % 1; DOT(cx + (ph - .5) * 20, y - ph * 8 + 4, 5 - i, ORANGE); }
      var a = .6 + .4 * Math.sin(t * .05 - i); b3.ar(cx + w / 2 + 6, y + h / 2, W * .575, y + h / 2, "rgba(226,75,74," + a + ")", 3 + (i === 0 ? 2 : 0));
    }
    b3.sun(W * .08, H * .1, 14, t); b3.ar(W * .08 + 22, H * .1 + 12, cx - 100, base - h + 6, "#e8b100", 3);
    b3.box(W * .6, H * .1, W * .37, H * .78, "#fdf6ec", "#e0c9a0", 12);
    TB("À chaque transfert :", W * .785, H * .2, INK, 15); TB("≈ 10 % passe au niveau suivant", W * .785, H * .32, DGREEN, 14);
    TB("≈ 90 % est perdu :", W * .785, H * .46, DRED, 14); TB("chaleur (respiration)", W * .785, H * .56, DRED, 13); TB("déchets, parties non mangées", W * .785, H * .65, DRED, 13);
    TB("l'énergie ne se recycle pas", W * .785, H * .8, ORANGE, 15);
  },
  th: "<div class=\"tcard\"><b class=\"h\">L'énergie traverse l'écosystème en sens unique</b><p>L'énergie entre dans un écosystème sous forme de <b>lumière</b> : les producteurs en transforment une petite partie en énergie chimique (matière organique). Chaque consommateur obtient son énergie en mangeant. À chaque maillon, une grande partie est perdue sous forme de <b>chaleur</b> (respiration), de <b>déchets</b> et de parties non consommées. Contrairement à la matière, <b>l'énergie ne se recycle pas</b> : les décomposeurs n'en renvoient pas aux producteurs, ils en dégradent eux aussi.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Rendement et règle des 10 %</b><p><b>Rendement d'un transfert</b> = énergie du niveau suivant ÷ énergie du niveau précédent × 100. En moyenne, il est d'environ <b>10 %</b>.</p><p><i>Exemple :</i> producteurs : 50 000 kJ → consommateurs I : 5 000 kJ → II : 500 kJ → III : 50 kJ. Perte totale : (50 000 − 50) / 50 000 = <b>99,9 %</b>. Autre exemple : 3 500 / 28 000 = 0,125, soit <b>12,5 %</b>.</p><p>Conséquence : les chaînes dépassent rarement 4 ou 5 maillons, car il ne reste presque plus d'énergie au sommet.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Les trois pyramides</b><ul><li><b>Pyramide des nombres</b> : nombre d'individus par niveau. Elle peut être inversée (1 chêne, 1 000 chenilles).</li><li><b>Pyramide de biomasse</b> : masse de matière vivante présente. Elle peut être inversée (lac : phytoplancton 12 g/m², zooplancton 30 g/m²) car le phytoplancton se renouvelle très vite.</li><li><b>Pyramide d'énergie ou de production</b> : énergie (ou production) par unité de temps. Elle est <b>toujours droite</b>, car l'énergie diminue forcément à chaque niveau.</li></ul></div>" +
    "<div class=\"tcard\"><b class=\"h\">Régime alimentaire et surface agricole</b><p>Manger un végétal, c'est un seul transfert ; manger de la viande, c'est un transfert de plus : environ 10 kcal végétales pour 1 kcal animale (4 % pour le bœuf, 12 % pour le poulet). Un régime avec beaucoup de viande exige donc beaucoup plus de surface cultivée.</p><p><i>Exemple :</i> si 350 m² nourrissent une personne en régime 100 % végétal, un régime à 30 % de calories animales demande 350 × (0,7 + 0,3 × 10) = 350 × 3,7 = <b>1 295 m²</b>.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Bioaccumulation</b><p>Un polluant <b>persistant</b> (non dégradé, non éliminé) s'accumule dans les tissus : les prédateurs en mangent beaucoup avec beaucoup de proies, donc sa concentration <b>augmente à chaque maillon</b>. <i>Exemple :</i> 2 µg/kg dans le phytoplancton, × 5 à chaque maillon : 10 → 50 → <b>250 µg/kg</b> chez le brochet. Les grands prédateurs sont les plus exposés. <i>Piège :</i> l'énergie, elle, diminue le long de la chaîne, alors que le polluant se concentre.</p></div>"
});

SFA.figs("c02", [
  /* 0 Énergie d'un niveau à l'autre */
  function (p) {
    b3.box(W * .1, H * .55, W * .34, H * .3, "#9ad28a", INK, 6); b3.box(W * .56, H * .55, W * .34, H * .3, "#8ec3ea", INK, 6);
    TB("producteurs", W * .27, H * .67, INK, 14); TB("20 000 kJ", W * .27, H * .78, INK, 16); TB("conso. I", W * .73, H * .67, INK, 14);
    b3.ar(W * .46, H * .7, W * .54, H * .7, ORANGE, 4); TB("10 %", W * .5, H * .64, ORANGE, 15);
    b3.ico("herbe", W * .27, H * .3, 30); b3.ico("lapin", W * .73, H * .3, 30);
    if (p > 0) { TB("20 000 × 0,10 = 2 000 kJ", W * .5, H * .93, DGREEN, 16); TB("2 000", W * .73, H * .78, DGREEN, 16); } else TB("?", W * .73, H * .78, ORANGE, 24);
  },
  /* 1 Chaînes courtes */
  function (p) {
    var cx = W * .35, base = H * .9, h = H * .17, cols = ["#9ad28a", "#8ec3ea", "#f4c6a0", "#f2a28a", "#e8c9f0"], i;
    for (i = 0; i < 5; i++) { var w = 230 * Math.pow(.6, i); b3.box(cx - w / 2, base - (i + 1) * h, w, h - 4, cols[i], INK, 4); }
    TB("100 %", cx, base - h / 2 + 3, INK, 13); TB("10 %", cx, base - 1.5 * h + 3, INK, 13); TB("1 %", cx, base - 2.5 * h + 3, INK, 13); TB("0,1 %", cx, base - 3.5 * h + 3, INK, 12); TB("0,01 %", cx, base - 4.5 * h + 3, INK, 11);
    TB("Pourquoi si peu de maillons ?", W * .74, H * .3, ORANGE, 15);
    if (p > 0) { b3.pill("trop peu d'énergie au sommet", W * .74, H * .55, "#fdecea", DRED, 14); TB("(90 % perdus à chaque maillon)", W * .74, H * .67, DRED, 13); }
  },
  /* 2 Quatre niveaux */
  function (p) {
    var vals = [50000, 5000, 500, 50], lab = ["producteurs", "conso. I", "conso. II", "conso. III"], gx = W * .12, gb = H * .85, i;
    LN(gx - 6, gb, W * .95, gb, INK, 2);
    for (i = 0; i < 4; i++) { var x = gx + i * W * .21, hh = Math.max(4, Math.sqrt(vals[i] / 50000) * H * .6); if (i === 0 || p > 0) { b3.box(x, gb - hh, W * .15, hh, ["#9ad28a", "#8ec3ea", "#f4c6a0", "#f2a28a"][i], INK, 3); TB(vals[i].toString().replace(/\B(?=(\d{3})+$)/g, " "), x + W * .075, gb - hh - 8, INK, 14); } else TB("?", x + W * .075, gb - 20, ORANGE, 22); TB(lab[i], x + W * .075, gb + 18, INK, 12); }
    TB("kJ (échelle racine pour la lisibilité)", W * .5, H * .08, GREY, 12);
    if (p > 0) b3.pill("perte totale : 99,9 %", W * .72, H * .3, "#fdecea", DRED, 15);
  },
  /* 3 Calculer un rendement */
  function (p) {
    b3.box(W * .06, H * .4, W * .34, H * .38, "#9ad28a", INK, 6); b3.box(W * .6, H * .5, W * .34, H * .28, "#8ec3ea", INK, 6);
    TB("producteurs", W * .23, H * .55, INK, 14); TB("28 000 kJ", W * .23, H * .68, INK, 16); TB("conso. I", W * .77, H * .6, INK, 14); TB("3 500 kJ", W * .77, H * .71, INK, 16);
    b3.ar(W * .42, H * .6, W * .58, H * .6, ORANGE, 4); TB("?", W * .5, H * .53, ORANGE, 18);
    if (p > 0) { TB("3 500 / 28 000 = 12,5 %", W * .5, H * .22, DGREEN, 16); TB("conso. II : 3 500 × 0,125 = 437,5 kJ", W * .5, H * .92, DGREEN, 14); }
    else TB("rendement du transfert ?", W * .5, H * .22, ORANGE, 15);
  },
  /* 4 Un chêne, mille chenilles */
  function (p) {
    var k, i; b3.ico("chene", W * .2, H * .45, 40); for (i = 0; i < 12; i++) b3.ico("chenille", W * .5 + (i % 4) * 34 - 50, H * .18 + Math.floor(i / 4) * 28, 12);
    TB("1 chêne", W * .2, H * .8, INK, 15); TB("1 000 chenilles", W * .56, H * .62, INK, 15);
    b3.pill("pyramide des nombres inversée", W * .5, H * .06 + 8, "#fdf1d9", ORANGE, 13);
    if (p > 0) { var x0 = W * .8, base = H * .88; b3.box(x0 - 50, base - 50, 100, 46, "#9ad28a", INK, 4); b3.box(x0 - 25, base - 100, 50, 46, "#8ec3ea", INK, 4); TB("énergie", x0, base + 16, GREEN, 13); TB("droite", x0, base - 112, DGREEN, 14); }
  },
  /* 5 Surface et régime */
  function (p) {
    var a = 350, b = 1295, sc = W * .62 / b;
    b3.box(W * .1, H * .22, a * sc, 40, "#9ad28a", INK, 4); TB("100 % végétal : 350 m²", W * .1, H * .17, DGREEN, 14, "left");
    b3.box(W * .1, H * .56, p > 0 ? b * sc * b3.f(p, 0, .6) : a * sc, 40, p > 0 ? "#f4c6a0" : "#eee", INK, 4);
    TB("30 % animal (rendement 10 %)", W * .1, H * .51, ORANGE, 14, "left");
    if (p > 0) { TB("350 × (0,7 + 0,3 × 10) = 1 295 m²", W * .1, H * .78, DGREEN, 15, "left"); TB("100 ha : 2 857 pers. contre 772", W * .1, H * .9, INK, 14, "left"); } else TB("?", W * .1 + a * sc + 14, H * .66, ORANGE, 24, "left");
  },
  /* 6 Bœuf ou poulet */
  function (p) {
    var gx = W * .14, gb = H * .82, cols = [GREEN, "#d9534f", ORANGE], v = [2500, 14500, 6167], nm = ["végétal", "bœuf", "poulet"], i;
    LN(gx - 6, gb, W * .95, gb, INK, 2);
    for (i = 0; i < 3; i++) { var x = gx + i * W * .28, hh = v[i] / 14500 * H * .6 * (i === 0 ? 1 : b3.f(p, 0, .6)); b3.box(x, gb - hh, W * .2, hh, cols[i] + "99", INK, 3); TB(nm[i], x + W * .1, gb + 18, INK, 14); if (i === 0 || p > 0) TB(["2 500", "14 500 (× 5,8)", "≈ 6 170 (× 2,5)"][i], x + W * .1, gb - hh - 8, INK, 13); }
    TB("kcal végétales par jour pour 2 500 kcal consommées", W * .5, H * .08, GREY, 13);
    if (p > 0) { } else { b3.pill("20 % de viande", W * .5, H * .3, "#fdf1d9", ORANGE, 14); }
  },
  /* 7 Concentration le long d'une chaîne */
  function (p) {
    var ic = ["plancton", "zoo", "poisson", "poisson"], nm = ["phytoplancton", "zooplancton", "petit poisson", "brochet"], val = ["2", "10", "50", "250"], i;
    for (i = 0; i < 4; i++) {
      var x = W * (.12 + i * .25), s = 14 + i * 7; b3.ico(ic[i], x, H * .38, i === 3 ? 34 : 24); TB(nm[i], x, H * .62, INK, 13); if (i < 3) { b3.ar(x + 42, H * .38, x + W * .25 - 42, H * .38, GREY, 2.5); TB("× 5", x + W * .125, H * .3, ORANGE, 14); }
      if (i === 0 || p > 0) { ctx.globalAlpha = i === 0 ? 1 : b3.f(p, i * .15, i * .15 + .3); b3.pill(val[i] + " µg/kg", x, H * .78, i === 3 ? DRED : "#fdecea", i === 3 ? "#fff" : DRED, 14); ctx.globalAlpha = 1; }
      else TB("?", x, H * .8, ORANGE, 20);
    }
  },
  /* 8 Biomasse inversée dans un lac */
  function (p) {
    var base = H * .8, x0 = W * .27, x1 = W * .75;
    TB("biomasse (g/m²)", x0, H * .1, INK, 14); b3.box(x0 - 24, base - 34, 48, 32, "#9ad28a", INK, 3); b3.box(x0 - 60, base - 72, 120, 32, "#f4c6a0", INK, 3);
    TB("12", x0, base - 13, INK, 14); TB("30", x0, base - 51, INK, 14); TB("phytoplancton", x0, base + 20, DGREEN, 13); TB("zooplancton", x0, base - 80, ORANGE, 13); TB("inversée", x0, H * .22, DRED, 14);
    TB("production (g/m²/an)", x1, H * .1, INK, 14);
    if (p > 0) { b3.box(x1 - 66, base - 34, 132, 32, "#9ad28a", INK, 3); b3.box(x1 - 7, base - 72, 14, 32, "#f4c6a0", INK, 3); TB("876", x1, base - 13, INK, 14); TB("91", x1 + 14, base - 56, INK, 14, "left"); TB("droite", x1, H * .22, DGREEN, 14); b3.pill("rendement ≈ 10 %", x1, base + 22, DGREEN, "#fff", 13); } else TB("?", x1, base - 30, ORANGE, 30);
    LN(W * .5, H * .12, W * .5, H * .9, AX, 1.5, [4, 4]);
  },
  /* 9 Recyclage de l'énergie ? */
  function (p) {
    var y = H * .5; b3.sun(W * .07, y, 13, tGlob); b3.ar(W * .12, y, W * .2, y, "#e8b100", 3);
    var xs = [.3, .56, .82], nm = ["producteurs", "consommateurs", "décomposeurs"], cl = ["#9ad28a", "#8ec3ea", "#e4d9c4"], i;
    for (i = 0; i < 3; i++) { b3.box(W * xs[i] - 52, y - 24, 104, 48, cl[i], INK, 8); TB(nm[i], W * xs[i], y + 5, INK, 12); if (i < 2) b3.ar(W * xs[i] + 54, y, W * xs[i + 1] - 54, y, GREY, 2.5); b3.ar(W * xs[i], y + 26, W * xs[i], y + 58, RED, 3); }
    TB("chaleur perdue", W * .56, y + 80, DRED, 14);
    if (p > 0) { b3.ar(W * .82, y - 28, W * .3, y - 70, GREY, 3, [6, 5]); b3.cross(W * .56, y - 50, 14, RED); b3.pill("pas de retour d'énergie", W * .5, H * .12, "#fdecea", DRED, 14); }
    else TB("l'énergie circule-t-elle en boucle ?", W * .5, H * .12, ORANGE, 14);
  }
]);
