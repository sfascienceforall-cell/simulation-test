/* Biologie 3e · chapitre 7 : la feuille et les échanges chez les végétaux */
b3.sto = function (x, y, open, down) {
  /* stomate dans l'épiderme (y = centre de l'épiderme) : deux cellules de garde, ostiole d'ouverture open (0..1) */
  var g = 1.5 + open * 6, d = down ? 1 : -1;
  b3.E(x - g - 5, y, 6, 8, "#6cb85a", DGREEN); b3.E(x + g + 5, y, 6, 8, "#6cb85a", DGREEN);
};
b3.leaf = function (x, y, w, h, pal, stoB, stoT, open) {
  var e = Math.max(7, h * .08), ph = h * .4, lh = h - 2 * e - ph, i, j;
  ctx.fillStyle = "#d9efcf"; ctx.fillRect(x, y, w, e); ctx.fillRect(x, y + h - e, w, e);
  ctx.fillStyle = "#c6e8b4"; ctx.fillRect(x, y + e, w, ph); ctx.fillStyle = "#eaf6df"; ctx.fillRect(x, y + e + ph, w, lh);
  var cw = 11, n = Math.floor(w / cw), cph = ph / pal;
  ctx.lineWidth = 1; ctx.strokeStyle = "#7fae6a";
  for (j = 0; j < pal; j++) for (i = 0; i < n; i++) { ctx.strokeRect(x + i * cw + 1, y + e + j * cph + 1, cw - 2, cph - 2); DOT(x + i * cw + cw / 2, y + e + j * cph + cph * .55, 2.2, "#2f9a43"); }
  for (i = 0; i < n / 1.6; i++) { var cx = x + 8 + i * cw * 1.6, cy = y + e + ph + lh * (.3 + .4 * ((i * 37) % 5) / 5); b3.E(cx, cy, 8, 6, "#d6ecc6", "#7fae6a"); DOT(cx, cy, 1.8, "#2f9a43"); }
  ctx.strokeStyle = "#4a8a3a"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  var s;
  for (s = 0; s < (stoB || []).length; s++) { ctx.fillStyle = "#fff"; ctx.fillRect(x + stoB[s] - 12, y + h - e - 1, 24, e + 3); b3.sto(x + stoB[s], y + h - e / 2, open == null ? 1 : open, true); }
  for (s = 0; s < (stoT || []).length; s++) { ctx.fillStyle = "#fff"; ctx.fillRect(x + stoT[s] - 12, y - 1, 24, e + 3); b3.sto(x + stoT[s], y + e / 2, open == null ? 1 : open, false); }
};
SFA.theo("c07", {
  icon: function () {
    b3.leaf(W * .1, H * .22, W * .8, H * .38, 2, [W * .25, W * .55], [], 1); b3.ar(W * .3, H * .85, W * .3, H * .65, GREY, 3); TB("CO₂", W * .3, H * .93, "#555", 15); b3.ar(W * .55, H * .64, W * .55, H * .84, BLUE, 3); TB("O₂ · H₂O", W * .58, H * .93, BLUE_D, 15);
    TB("stomates", W * .78, H * .78, DGREEN, 22);
  },
  anim: function (t) {
    ctx.save(); ctx.scale(W / 700, H / 300); var op = (Math.sin(t * .025) + 1) / 2, i;
    b3.leaf(190, 80, 450, 130, 2, [110, 330], [], op);
    b3.E(410, 150, 20, 20, "#d6ebfa", BLUE_D); b3.E(410, 143, 7, 7, "#4b9bd6", null); b3.E(410, 158, 7, 7, "#f0b040", null);
    TB("nervure", 410, 192, BLUE_D, 12);
    for (i = 0; i < 3; i++) b3.ar(240 + i * 150, 14, 240 + i * 150, 62, "#e8b100", 3);
    TB("lumière", 190, 40, "#a07d00", 13, "right");
    TB("épiderme", 180, 92, GREY, 12, "right"); TB("palissadique", 180, 120, DGREEN, 12, "right"); TB("(chloroplastes)", 180, 135, DGREEN, 11, "right"); TB("lacuneux (air)", 180, 175, "#5c8a4a", 12, "right"); TB("xylème : eau + sels", 410, 66, BLUE_D, 12);
    var sx = [300, 520];
    for (i = 0; i < 2; i++) {
      var x = sx[i]; var v = (t * .012 + i * .3) % 1; DOT(x - 8, 275 - v * 62, 4.5, "#777"); var v1 = (t * .012 + .5 + i * .3) % 1; DOT(x - 8, 275 - v1 * 62, 4.5, "#777");
      var v2 = (t * .012 + .25 + i * .3) % 1; DOT(x + 8, 208 + v2 * 62, 4.5, BLUE); var v3 = (t * .012 + .75 + i * .3) % 1; DOT(x + 2, 208 + v3 * 62, 4, "#9fd0f0");
      TB("stomate", x, 228, DGREEN, 13, "center");
    }
    TB("CO₂ entre", 190, 270, "#555", 14, "right"); TB("O₂ et vapeur d'eau sortent", 640, 285, BLUE_D, 14, "right");
    ctx.restore();
  },
  th: "<div class=\"tcard\"><b class=\"h\">Une feuille en coupe</b><p>La feuille est mince et plate : elle capte un maximum de lumière. De haut en bas : l'<b>épiderme supérieur</b> transparent et sa cuticule (protège, limite l'évaporation) ; le <b>parenchyme palissadique</b> (cellules allongées serrées, riches en <b>chloroplastes</b> : c'est là qu'a lieu l'essentiel de la photosynthèse) ; le <b>parenchyme lacuneux</b> (cellules espacées, avec des lacunes d'air pour la circulation des gaz) ; l'<b>épiderme inférieur</b> percé de <b>stomates</b>. Les <b>nervures</b> contiennent le <b>xylème</b> (sève brute : eau + sels minéraux des racines vers les feuilles) et le <b>phloème</b> (sève élaborée : sucres des feuilles vers le reste de la plante).</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Les stomates</b><p>Un <b>stomate</b> est une ouverture entre deux <b>cellules de garde</b> qui s'ouvre ou se ferme. Il laisse entrer le <b>CO₂</b> et sortir le <b>O₂</b> (en pleine lumière) et la <b>vapeur d'eau</b>. Ils sont surtout sur la face inférieure (hêtre : environ 210 par mm², aucun dessus), sauf chez les plantes flottantes (nénuphar : environ 460 par mm² sur la face supérieure, au contact de l'air).</p><p><i>Densité :</i> un champ de 0,4 mm de diamètre a une aire π × 0,2² ≈ 0,126 mm² ; avec 25 stomates : 25 / 0,126 ≈ <b>200 stomates par mm²</b>. Pour 40 cm² = 4 000 mm² : environ <b>800 000</b> stomates.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">La transpiration</b><p>L'eau s'évapore par les stomates : c'est la <b>transpiration</b>. Elle « aspire » la sève dans le xylème et refroidit la feuille. Elle augmente avec la chaleur, la lumière et le vent, et diminue quand l'air est humide.</p><p><i>Exemple :</i> 100 cm² de feuille perdent 2,6 g d'eau par heure. Un arbre de 200 m² de feuillage = 200 / 0,01 = 20 000 fois plus : 2,6 × 20 000 = 52 000 g = <b>52 L par heure</b>, soit environ 520 L en 10 h. <i>Potomètre :</i> la vitesse de la bulle (mm/min) × la section du tube (mm²) donne le volume absorbé : 1,2 mm/min × 2 mm² = 2,4 mm³/min = 144 mm³/h.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Le compromis CO₂ / eau</b><p>Ouvrir les stomates permet d'obtenir du CO₂ mais fait perdre de l'eau. Par forte chaleur et sol sec, les stomates se <b>ferment en partie</b> : la plante économise son eau, au prix d'une photosynthèse ralentie. La quasi-totalité de l'eau absorbée est évaporée : pour fixer 1 g de CO₂, une plante perd en moyenne 400 g d'eau, alors que la photosynthèse n'en consomme que 108 / 264 ≈ <b>0,41 g</b> (environ 0,1 % du total).</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Adaptations au milieu</b><p><b>Feuilles de soleil</b> : plus épaisses et plus petites, palissadique sur plusieurs couches, plus de stomates ; <b>feuilles d'ombre</b> : plus minces et étalées pour capter peu de lumière. <b>Plantes de milieux secs</b> (cactus) : cuticule épaisse, stomates enfoncés, feuilles réduites en épines. <b>Plantes aquatiques flottantes</b> : stomates sur la face supérieure. <i>Piège :</i> enduire de vaseline la face qui porte les stomates (chez le hêtre : la face inférieure) bloque presque toute la transpiration.</p></div>"
});

SFA.figs("c07", [
  /* 0 À quoi servent les stomates */
  function (p) {
    b3.leaf(W * .12, H * .3, W * .76, H * .3, 2, [W * .3, W * .55], [], 1); LN(W * .12, H * .6, W * .88, H * .6, "#4a8a3a", 2);
    var i; for (i = 0; i < 2; i++) { var x = W * (.12 + (i ? .55 : .3)); b3.ar(x - 12, H * .92, x - 12, H * .64, "#777", 3); b3.ar(x + 6, H * .64, x + 6, H * .92, BLUE, 3); }
    if (p > 0) { TB("CO₂ entre", W * .18, H * .8, "#555", 14); TB("O₂ + vapeur d'eau sortent", W * .82, H * .8, BLUE_D, 14, "right"); b3.pill("pleine lumière", W * .5, H * .1, "#fff7da", "#a07d00", 13); } else TB("quelles substances traversent ?", W * .5, H * .15, ORANGE, 15);
  },
  /* 1 Transporter l'eau */
  function (p) {
    var cx = W * .5, cy = H * .5; b3.E(cx, cy, 130, 100, "#eaf6df", "#7fae6a"); b3.E(cx, cy, 70, 55, "#d6ebfa", BLUE_D);
    var i; for (i = 0; i < 5; i++) DOT(cx - 40 + i * 17, cy - 18 + (i % 2) * 10, 9, p > 0 ? BLUE : "#8ec3ea"); for (i = 0; i < 4; i++) DOT(cx - 28 + i * 17, cy + 20, 6, "#f0b040");
    TB("xylème", cx - 100, cy - 46, p > 0 ? BLUE_D : GREY, 14); TB("phloème", cx + 90, cy + 40, "#a07d00", 14); TB("nervure en coupe", cx, H * .08, GREY, 14);
    if (p > 0) { b3.ar(cx - 94, cy - 36, cx - 60, cy - 16, BLUE, 2.5); b3.pill("eau + sels : racines → feuilles", cx, H * .93, "#e3f1fb", BLUE_D, 14); } else TB("quel tissu amène l'eau ?", cx, H * .93, ORANGE, 15);
  },
  /* 2 Densité de stomates */
  function (p) {
    var cx = W * .3, cy = H * .5, r = 90, i; b3.E(cx, cy, r, r, "#f2f7ec", INK); for (i = 0; i < 25; i++) { var a = i * 2.4, d = Math.sqrt((i + .5) / 25) * (r - 12); b3.E(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 5, 3.5, "#6cb85a", DGREEN, a); }
    LN(cx - r, cy + r + 14, cx + r, cy + r + 14, ORANGE, 2); TB("0,4 mm", cx, cy + r + 30, ORANGE, 13); TB("25 stomates", cx, cy - r - 10, DGREEN, 14);
    if (p > 0) { TB("aire = π × 0,2² ≈ 0,126 mm²", W * .56, H * .25, INK, 13, "left"); TB("25 / 0,126 ≈ 200 par mm²", W * .56, H * .45, DGREEN, 14, "left"); TB("× 4 000 mm² ≈ 800 000", W * .56, H * .65, DGREEN, 14, "left"); } else TB("densité ?", W * .75, H * .5, ORANGE, 22);
  },
  /* 3 Nénuphar et hêtre */
  function (p) {
    b3.leaf(W * .06, H * .3, W * .36, H * .26, 2, [W * .2], [], 1); TB("hêtre", W * .24, H * .22, DGREEN, 15); TB("≈ 210 / mm² dessous", W * .24, H * .72, INK, 13); b3.sun(W * .1, H * .12, 8, tGlob);
    ctx.fillStyle = "rgba(55,138,221,.25)"; ctx.fillRect(W * .52, H * .52, W * .44, H * .35); LN(W * .52, H * .52, W * .96, H * .52, BLUE, 2);
    b3.leaf(W * .56, H * .28, W * .36, H * .24, 2, [], [W * .12, W * .24], 1); TB("nénuphar", W * .74, H * .2, DGREEN, 15); TB("≈ 460 / mm² dessus", W * .74, H * .96, INK, 13);
    if (p > 0) { b3.pill("stomates au contact de l'air", W * .5, H * .08, "#e4f6ee", DGREEN, 13); } else TB("?", W * .5, H * .5, ORANGE, 28);
  },
  /* 4 Canicule et sol sec */
  function (p) {
    var cx = W * .3, cy = H * .5; b3.sun(W * .86, H * .15, 16, tGlob); ctx.fillStyle = "#e6d3a8"; ctx.fillRect(0, H * .8, W, H * .2); TB("sol sec", W * .18, H * .93, "#8a6a3a", 14);
    b3.ico("chene", W * .22, H * .5, 46);
    var open = p > 0 ? .25 : 1; var x = W * .7, y = H * .55; b3.E(x, y, 60, 28, "#fff", null); b3.E(x - 8 - open * 8, y, 14, 22, "#6cb85a", DGREEN); b3.E(x + 8 + open * 8, y, 14, 22, "#6cb85a", DGREEN);
    TB("stomate", x, y + 50, DGREEN, 14);
    if (p > 0) { b3.pill("se ferment en partie", x, H * .3, "#e4f6ee", DGREEN, 14); TB("eau économisée · photosynthèse ralentie", W * .5, H * .1, DRED, 14); } else TB("que font les stomates ?", W * .5, H * .1, ORANGE, 15);
  },
  /* 5 Un arbre qui transpire */
  function (p) {
    b3.ico("feuille", W * .15, H * .4, 26); TB("100 cm²", W * .15, H * .62, INK, 14); TB("2,6 g d'eau / h", W * .15, H * .75, BLUE_D, 14);
    b3.ar(W * .27, H * .4, W * .4, H * .4, ORANGE, 3); TB("× 20 000", W * .335, H * .32, ORANGE, 14);
    b3.ico("chene", W * .56, H * .46, 58); TB("200 m² de feuilles", W * .56, H * .85, INK, 14);
    if (p > 0) { b3.pill("52 L par heure", W * .85, H * .3, BLUE, "#fff", 15); b3.pill("≈ 520 L en 10 h", W * .85, H * .52, BLUE_D, "#fff", 15); } else TB("eau perdue ?", W * .85, H * .4, ORANGE, 18);
  },
  /* 6 Le potomètre */
  function (p) {
    var nm = ["A air calme", "B ventilateur", "C lampe", "D sac fermé"], v = [1.2, 3.0, 2.5, .3], gb = H * .8, k = H * .5 / 3, i; LN(W * .08, gb, W * .95, gb, INK, 2);
    for (i = 0; i < 4; i++) { var x = W * (.12 + i * .22); b3.box(x, gb - v[i] * k, W * .15, v[i] * k, ["#9ad28a", "#8ec3ea", "#f4c6a0", "#d6d6e0"][i], INK, 3); TB(nm[i], x + W * .075, gb + 17, INK, 12); if (p > 0) TB(String(v[i]).replace(".", ",") + " mm/min", x + W * .075, gb - v[i] * k - 8, INK, 13); }
    if (p > 0) { b3.pill("B = 2,5 × A", W * .3, H * .1, "#e3f1fb", BLUE_D, 14); b3.pill("D : air saturé dans le sac", W * .7, H * .1, "#fff3de", ORANGE, 13); } else TB("vitesse de la bulle (mm/min) ?", W * .5, H * .1, ORANGE, 15);
  },
  /* 7 Vaseline sur la feuille */
  function (p) {
    var i; b3.leaf(W * .06, H * .36, W * .38, H * .24, 2, [W * .1, W * .26], [], 1); b3.leaf(W * .56, H * .36, W * .38, H * .24, 2, [W * .1, W * .26], [], 1);
    ctx.fillStyle = "#ffe58a"; ctx.fillRect(W * .06, H * .36 - 6, W * .38, 6); ctx.fillRect(W * .56, H * .6, W * .38, 6);
    TB("vaseline dessus", W * .25, H * .27, "#8a6a00", 14); TB("vaseline dessous", W * .75, H * .76, "#8a6a00", 14);
    if (p > 0) { for (i = 0; i < 2; i++) b3.ar(W * (.16 + i * .16), H * .64, W * (.16 + i * .16), H * .86, BLUE, 3.5); TB("perd beaucoup", W * .25, H * .95, BLUE_D, 13); b3.cross(W * .75, H * .68, 12, RED); TB("perd très peu", W * .75, H * .95, DGREEN, 13); b3.pill("stomates dessous", W * .5, H * .1, "#e4f6ee", DGREEN, 13); } else TB("laquelle perd le moins d'eau ?", W * .5, H * .12, ORANGE, 15);
  },
  /* 8 Eau perdue, eau utilisée */
  function (p) {
    var x0 = W * .08, w = W * .84, y = H * .4; b3.box(x0, y, w, 44, "#8ec3ea", INK, 4); TB("eau transpirée : 400 g pour 1,0 g de CO₂", W * .5, y + 28, INK, 14);
    if (p > 0) { b3.box(x0 + w - 5, y - 8, 7, 60, RED, null, 2); TB("0,41 g utilisés par la photosynthèse", W * .88, y + 80, DRED, 14, "right"); b3.pill("≈ 0,1 %", W * .5, H * .2, DRED, "#fff", 16); TB("l'eau sert surtout à la sève et à la transpiration", W * .5, H * .92, DGREEN, 14); } else TB("part consommée ?", W * .5, H * .75, ORANGE, 16);
  },
  /* 9 Feuilles de soleil et d'ombre */
  function (p) {
    var n1 = p > 0 ? 3 : 2, n2 = p > 0 ? 1 : 2; b3.leaf(W * .06, H * .28, W * .38, H * .42, n1, [W * .1, W * .2, W * .3], [], 1); b3.leaf(W * .56, H * .38, W * .38, H * .26, n2, [W * .19], [], 1);
    b3.sun(W * .25, H * .1, 9, tGlob); TB("soleil", W * .25, H * .82, ORANGE, 15); TB("ombre", W * .75, H * .82, BLUE_D, 15);
    if (p > 0) { TB("épaisse · + de stomates", W * .25, H * .93, DGREEN, 12); TB("mince · étalée", W * .75, H * .93, DGREEN, 12); } else TB("quelles différences ?", W * .5, H * .1, ORANGE, 15);
  }
]);
