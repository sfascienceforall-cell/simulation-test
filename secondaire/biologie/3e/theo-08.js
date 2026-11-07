/* Biologie 3e · chapitre 8 : la photosynthèse */
b3.chloro = function (x, y, s) {
  b3.E(x, y, 90 * s, 52 * s, "#a9dc96", DGREEN, .08);
  for (var i = -2; i <= 2; i++) for (var j = 0; j < 3; j++) b3.E(x + i * 24 * s + (j % 2) * 6 * s, y - 20 * s + j * 18 * s, 9 * s, 5 * s, "#3fa24a", "#237a33");
};
b3.hex = function (x, y, r, c) { ctx.beginPath(); for (var i = 0; i < 6; i++) { var a = i * 1.0472; i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.stroke(); };
SFA.theo("c08", {
  icon: function () {
    b3.sun(W * .12, H * .22, 16, 0); TB("6 CO₂ + 6 H₂O", W * .5, H * .5, BLUE_D, 28); TB("→ C₆H₁₂O₆ + 6 O₂", W * .5, H * .72, DGREEN, 24); TB("lumière · chlorophylle", W * .62, H * .2, ORANGE, 16);
  },
  anim: function (t) {
    ctx.save(); ctx.scale(W / 700, H / 300); var i;
    b3.sun(640, 36, 20, t); for (i = 0; i < 3; i++) b3.ar(610 - i * 20, 58 + i * 8, 540 - i * 20, 98 + i * 8, "#e8b100", 3);
    ctx.fillStyle = "#e6d3a8"; ctx.fillRect(0, 232, 300, 40); LN(0, 232, 300, 232, "#a8895a", 2);
    LN(150, 232, 150, 120, "#6aa84f", 8); b3.E(105, 150, 48, 22, "#8fd18f", DGREEN, -.4); b3.E(200, 125, 52, 24, "#8fd18f", DGREEN, .4); b3.E(150, 108, 30, 14, "#8fd18f", DGREEN, 0);
    for (i = -2; i <= 2; i++) LN(150, 232, 150 + i * 26, 268, "#9a7a4a", 3);
    TB("sol : eau + sels minéraux", 150, 288, "#8a6a3a", 13);
    b3.E(480, 160, 112, 80, "rgba(201,232,190,.5)", DGREEN); LN(255, 140, 370, 130, GREY, 1.2, [3, 3]); b3.chloro(480, 160, 1.1); TB("chloroplaste", 480, 215, DGREEN, 14);
    for (i = 0; i < 4; i++) { var u = (t * .007 + i / 4) % 1; DOT(260 + u * 160, 40 + u * 90, 5, "#777"); } TB("CO₂ (air)", 330, 52, "#555", 14);
    for (i = 0; i < 4; i++) { var v = (t * .007 + i / 4) % 1; DOT(150 + v * 6, 232 - v * 100 * 1, 4.5, BLUE); } for (i = 0; i < 3; i++) { var v2 = (t * .007 + i / 3) % 1; DOT(160 + v2 * 220, 130 + v2 * 30 - 0, 4.5, BLUE); } TB("eau", 190, 220, BLUE_D, 13, "left");
    for (i = 0; i < 3; i++) { var w = (t * .007 + i / 3) % 1; DOT(500 + w * 40, 110 - w * 70, 5, BLUE_D); } TB("O₂ rejeté", 560, 70, BLUE_D, 14);
    var g = (t * .005) % 1; b3.hex(540 + g * 100, 200 + g * 20, 9, "#ffd6a8"); TB("glucose → amidon", 620, 255, ORANGE, 13);
    b3.box(20, 12, 250, 30, "#f4f8fc", BLUE, 8); TB("6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂", 145, 32, INK, 13); 
    ctx.restore();
  },
  th: "<div class=\"tcard\"><b class=\"h\">Le bilan</b><p>La <b>photosynthèse</b> transforme l'énergie lumineuse en énergie chimique, dans les <b>chloroplastes</b> des cellules vertes :</p><p style=\"text-align:center\"><b>dioxyde de carbone + eau → glucose + dioxygène</b><br>(lumière, chlorophylle)<br>6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂</p><p>Le glucose sert à la respiration, à fabriquer d'autres molécules (cellulose…) ou est stocké sous forme d'<b>amidon</b>. Le CO₂ vient de l'air, l'eau du sol, et l'énergie du Soleil.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Conditions et facteurs limitants</b><p>Il faut de la <b>lumière</b>, du <b>CO₂</b>, de l'<b>eau</b>, de la <b>chlorophylle</b> (et une température adaptée). Le <b>facteur limitant</b> est celui qui manque le plus : augmenter un autre facteur ne change rien. <i>Exemple :</i> à l'air normal (400 ppm), la photosynthèse augmente avec l'éclairement jusqu'à 60 %, puis plafonne à 30 unités. En doublant le CO₂ (800 ppm), le plateau monte à 50 : à 80 % d'éclairement, <b>le CO₂ est limitant</b> ; avant 60 %, c'est la lumière.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Mettre en évidence</b><p><b>Amidon</b> : on plonge la feuille dans l'eau bouillante, on la décolore à l'alcool, puis on ajoute de l'<b>eau iodée</b> : <b>bleu-noir</b> = amidon présent, brun-jaune = absent. Feuille panachée (bord blanc, sans chlorophylle) cachée en partie par de l'aluminium : seule la partie <b>verte et éclairée</b> forme de l'amidon, donc la <b>lumière et la chlorophylle</b> sont nécessaires. <b>Dioxygène</b> : une plante aquatique éclairée dégage des bulles qui ravivent une braise.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Bilan en masses et rendement</b><p>264 g de CO₂ + 108 g d'eau → 180 g de glucose + 192 g de O₂ (372 g de chaque côté). <i>Exemple :</i> 22 g de CO₂ (÷ 12) → 9 g d'eau, <b>15 g de glucose</b>, <b>16 g de O₂</b> ; 31 g avant et après. <b>Rendement</b> = énergie stockée / énergie reçue : une prairie reçoit 3 600 MJ/m²/an et stocke 1 000 g × 17 kJ/g = 17 000 kJ, soit environ <b>0,5 %</b>.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">D'où vient la masse d'une plante ?</b><p><b>Van Helmont</b> (XVIIᵉ siècle) fait pousser un saule de 2,3 kg dans 90,7 kg de terre : après cinq ans, l'arbre pèse 76,7 kg (gain de 74,4 kg) alors que la terre n'a perdu que 57 g, soit 0,057 / 74,4 ≈ <b>0,08 %</b> du gain. La masse vient surtout du <b>CO₂ de l'air</b> et de l'<b>eau</b>, pas de la terre. <b>Bilan sur 24 h :</b> la photosynthèse a lieu à la lumière, la respiration jour et nuit. Avec 10 mL/h de O₂ produits et 2 mL/h consommés : jour : +8 mL/h × 12 = +96 mL ; nuit : −2 × 12 = −24 mL ; <b>bilan : +72 mL</b>. Dans le noir, la plante respire en consommant ses réserves.</p></div>"
});

SFA.figs("c08", [
  /* 0 Bilan de la photosynthèse */
  function (p) {
    b3.sun(W * .1, H * .17, 12, tGlob); var i, q = [["CO₂", "#777"], ["eau", BLUE], ["glucose", ORANGE], ["O₂", BLUE_D]], x = [.08, .3, .58, .82];
    for (i = 0; i < 4; i++) { var bl = p <= 0 && i >= 2; b3.box(W * x[i], H * .42, W * .16, 46, bl ? "#fff3de" : "#f4f4f4", bl ? ORANGE : q[i][1], 8); TB(bl ? "?" : q[i][0], W * (x[i] + .08), H * .42 + 30, bl ? ORANGE : q[i][1] === "#777" ? "#555" : q[i][1], 15); }
    TB("+", W * .26, H * .42 + 32, INK, 22); TB("+", W * .78, H * .42 + 32, INK, 22); b3.ar(W * .48, H * .42 + 23, W * .56, H * .42 + 23, INK, 3);
    TB("lumière · chlorophylle", W * .52, H * .36, "#a07d00", 13); if (p > 0) { TB("l'énergie vient de la lumière du Soleil", W * .5, H * .82, DGREEN, 15); } else TB("d'où vient l'énergie ?", W * .5, H * .82, ORANGE, 15);
  },
  /* 1 Les conditions */
  function (p) {
    var nm = ["lumière", "CO₂", "eau", "chlorophylle"], i; b3.ico("chene", W * .22, H * .5, 44);
    for (i = 0; i < 4; i++) { var y = H * (.2 + i * .2); b3.box(W * .5, y - 18, W * .4, 36, p > 0 ? "#e4f6ee" : "#f4f4f4", p > 0 ? GREEN : GREY, 8); TB(nm[i], W * .6, y + 5, INK, 15, "left"); if (p > 0) b3.check(W * .56, y, 8, GREEN); }
    if (p <= 0) TB("?", W * .22, H * .88, ORANGE, 24);
  },
  /* 2 Bilan en masses */
  function (p) {
    var q = [["CO₂", "22 g", "#777"], ["eau", "9 g", BLUE], ["glucose", "15 g", ORANGE], ["O₂", "16 g", BLUE_D]], x = [.05, .27, .58, .8], i;
    for (i = 0; i < 4; i++) { b3.box(W * x[i], H * .35, W * .17, 70, "#f4f4f4", q[i][2], 8); TB(q[i][0], W * (x[i] + .085), H * .35 + 24, q[i][2] === "#777" ? "#555" : q[i][2], 15); TB(i === 0 || p > 0 ? q[i][1] : "? g", W * (x[i] + .085), H * .35 + 52, i === 0 ? INK : p > 0 ? DGREEN : ORANGE, 17); }
    TB("+", W * .245, H * .35 + 42, INK, 22); TB("+", W * .765, H * .35 + 42, INK, 22); b3.ar(W * .46, H * .35 + 35, W * .56, H * .35 + 35, INK, 3);
    if (p > 0) { TB("22 + 9 = 31 g", W * .22, H * .78, DGREEN, 16); TB("=", W * .5, H * .78, DGREEN, 20); TB("15 + 16 = 31 g", W * .78, H * .78, DGREEN, 16); } else TB("conservation de la masse ?", W * .5, H * .78, ORANGE, 15);
  },
  /* 3 Lire un test à l'iode */
  function (p) {
    var cx = W * .3, cy = H * .5; b3.E(cx, cy, 120, 80, "#f1eadc", "#b9a98a"); b3.E(cx, cy, 92, 58, "#2a2f55", null); ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 92, 58, 0, 0, 7); ctx.clip(); ctx.fillStyle = "#c9a86a"; ctx.fillRect(cx - 12, cy - 70, 24, 140); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 92, 58, 0, 0, 7); ctx.clip(); ctx.fillStyle = "#c9a86a"; ctx.fillRect(cx - 12, cy - 70, 24, 140); ctx.restore(); LN(cx - 12, cy - 58, cx - 12, cy + 58, "rgba(0,0,0,.2)", 1);
    TB("bleu-noir", cx - 52, cy + 4, "#fff", 13); TB("brun-jaune", cx, cy + 74, "#8a6a2a", 13); TB("brun-jaune", cx + 70, cy - 76, "#8a6a2a", 13); TB("aluminium", cx, cy - 72 + 2, GREY, 12);
    if (p > 0) { b3.pill("lumière nécessaire", W * .79, H * .3, "#fff7da", "#a07d00", 14); b3.pill("chlorophylle nécessaire", W * .79, H * .5, "#e4f6ee", DGREEN, 14); TB("→ amidon seulement là", W * .79, H * .7, INK, 13); } else TB("conclusion ?", W * .79, H * .5, ORANGE, 20);
  },
  /* 4 Quel facteur limite */
  function (p) {
    var gx = W * .12, gb = H * .78, gw = W * .8, gh = H * .58, X = function (v) { return gx + v / 100 * gw; }, Y = function (v) { return gb - v / 55 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "éclairement (%)", "photosynthèse"); [0, 60, 80, 100].forEach(function (v) { TB(v, X(v), gb + 18, GREY, 12); });
    b3.curve([[X(0), Y(0)], [X(60), Y(30)], [X(100), Y(30)]], BLUE, 3.5); TB("400 ppm", X(88), Y(30) + 20, BLUE_D, 13); b3.curve([[X(0), Y(0)], [X(60), Y(30)], [X(100), Y(50)]], GREEN, 3.5); TB("800 ppm", X(94), Y(50) - 10, DGREEN, 13); LN(X(80), gb, X(80), Y(40), ORANGE, 1.5, [5, 4]); DOT(X(80), Y(30), 6, RED);
    if (p > 0) { b3.pill("à 80 % : le CO₂ limite", X(48), Y(48), "#fdecea", DRED, 14); b3.ar(X(80), Y(36), X(80), Y(41), RED, 3); } else TB("quel facteur limite à 80 % ?", X(48), Y(48), ORANGE, 15);
  },
  /* 5 La terre de van Helmont */
  function (p) {
    b3.box(W * .1, H * .55, W * .32, H * .3, "#c8a878", "#8a6a3a", 4); b3.ico("chene", W * .26, H * .38, 30); TB("saule 2,3 kg", W * .26, H * .2, INK, 14); TB("terre 90,7 kg", W * .26, H * .96, "#8a6a3a", 14);
    b3.ar(W * .46, H * .5, W * .56, H * .5, ORANGE, 3); TB("5 ans", W * .51, H * .43, ORANGE, 13);
    b3.box(W * .6, H * .62, W * .32, H * .23, "#c8a878", "#8a6a3a", 4); b3.ico("chene", W * .76, H * .42, 40); TB("saule 76,7 kg", W * .76, H * .17, INK, 14);
    if (p > 0) { b3.pill("gain : + 74,4 kg", W * .5, H * .08 + 4, DGREEN, "#fff", 15); TB("terre : − 57 g (0,08 %)", W * .76, H * .96, DRED, 14); b3.ar(W * .55, H * .3, W * .68, H * .36, "#777", 3); TB("CO₂ + eau", W * .55, H * .26, "#555", 13); } else TB("d'où vient la masse ?", W * .5, H * .08 + 4, ORANGE, 15);
  },
  /* 6 Rendement d'une prairie */
  function (p) {
    var x0 = W * .08, w = W * .84, y = H * .38; b3.box(x0, y, w, 40, "#ffe58a", INK, 4); TB("énergie solaire reçue : 3 600 MJ = 3 600 000 kJ", W * .5, y + 25, "#6a5200", 14);
    b3.box(x0, y + 70, Math.max(3, w * 17000 / 3600000), 40, ORANGE, INK, 1); TB("17 000 kJ stockés (1 000 g × 17 kJ/g)", x0 + 8, y + 140, ORANGE, 14, "left");
    if (p > 0) { b3.pill("rendement ≈ 0,5 %", W * .5, H * .12, DGREEN, "#fff", 16); TB("CO₂ absorbé ≈ 1 467 g · O₂ rejeté ≈ 1 067 g", W * .5, H * .96, INK, 14); } else TB("rendement ?", W * .5, H * .12, ORANGE, 16);
  },
  /* 7 Plante dans le noir */
  function (p) {
    b3.box(W * .06, H * .12, W * .4, H * .7, "#2c2f4a", INK, 16); b3.ico("herbe", W * .26, H * .6, 36); b3.ico("feuille", W * .26, H * .34, 20); TB("obscurité", W * .26, H * .9, INK, 14);
    b3.box(W * .52, H * .25, W * .44, 40, "#fff3de", ORANGE, 8); TB("réserves : amidon, sucres", W * .74, H * .25 + 25, ORANGE, 13); b3.ar(W * .74, H * .25 + 44, W * .74, H * .6, ORANGE, 3);
    if (p > 0) { TB("respiration", W * .74, H * .68, DGREEN, 16); TB("→ CO₂ + énergie", W * .74, H * .78, DGREEN, 14); b3.pill("jusqu'à épuisement", W * .74, H * .92, "#fdecea", DRED, 13); } else TB("?", W * .74, H * .72, ORANGE, 26);
  },
  /* 8 Bilan sur 24 heures */
  function (p) {
    var gx = W * .1, gb = H * .78, gw = W * .84, gh = H * .55, X = function (h) { return gx + h / 24 * gw; }, Y = function (v) { return gb - (v + 30) / 130 * gh; };
    b3.axes(gx, gb, gw + 8, gh + 14, "heures", "O₂ net (mL)"); LN(gx, Y(0), gx + gw, Y(0), AX, 1.2, [4, 4]); [0, 12, 24].forEach(function (h) { TB(h, X(h), gb + 18, GREY, 12); }); TB("0", gx - 6, Y(0) + 4, GREY, 12, "right");
    b3.box(X(0), H * .93, X(12) - X(0), 8, "#ffe58a", null, 3); b3.box(X(12), H * .93, X(24) - X(12), 8, "#2c2f4a", null, 3); TB("jour", X(6), H * .91, "#a07d00", 12); TB("nuit", X(18), H * .91, INK, 12);
    if (p > 0) { b3.curve([[X(0), Y(0)], [X(12), Y(96)], [X(24), Y(72)]], GREEN, 3.5); DOT(X(12), Y(96), 5, GREEN); DOT(X(24), Y(72), 6, RED); TB("+ 96", X(12), Y(96) - 10, DGREEN, 14); TB("+ 72 mL", X(24) - 4, Y(72) - 10, DRED, 14, "right"); TB("+ 8 mL/h", X(4), Y(60), DGREEN, 13); TB("− 2 mL/h", X(18), Y(86), DRED, 13); } else TB("bilan sur 24 h ?", W * .5, H * .45, ORANGE, 18);
  },
  /* 9 D'où vient la masse d'un arbre */
  function (p) {
    b3.ico("chene", W * .5, H * .5, 56); ctx.fillStyle = "#e6d3a8"; ctx.fillRect(W * .2, H * .8, W * .6, H * .15);
    b3.ar(W * .15, H * .2, W * .42, H * .38, p > 0 ? "#555" : GREY, p > 0 ? 9 : 3); TB("CO₂ de l'air", W * .13, H * .13, "#555", 14, "left");
    b3.ar(W * .6, H * .88, W * .55, H * .68, p > 0 ? BLUE : GREY, p > 0 ? 6 : 3); TB("eau", W * .65, H * .86, BLUE_D, 14, "left");
    b3.ar(W * .4, H * .88, W * .45, H * .7, "#8a6a3a", p > 0 ? 1.5 : 3); TB("sels minéraux", W * .3, H * .86, "#8a6a3a", 13, "right");
    if (p > 0) b3.pill("matière sèche : air + eau, très peu de terre", W * .62, H * .06 + 8, "#e4f6ee", DGREEN, 14); else TB("d'où vient la matière ?", W * .75, H * .3, ORANGE, 16);
  }
]);
