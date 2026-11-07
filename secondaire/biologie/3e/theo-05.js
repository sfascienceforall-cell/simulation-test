/* Biologie 3e · chapitre 5 : respiration, échanges gazeux et circulation */
b3.lungs = function (cx, cy, s, ph) {
  /* thorax + poumons + diaphragme ; s = amplitude 0..1 (0 expiration, 1 inspiration) ; échelle ph = taille */
  var k = ph || 1, r = (46 + 14 * s) * k;
  ctx.strokeStyle = "#b9a98a"; ctx.lineWidth = 3; ctx.fillStyle = "#faf6ee"; ctx.beginPath(); ctx.roundRect(cx - 98 * k - 8 * s * k, cy - 78 * k - 4 * s * k, 196 * k + 16 * s * k, 150 * k + 8 * s * k, 40 * k); ctx.fill(); ctx.stroke();
  LN(cx, cy - 120 * k, cx, cy - 36 * k, "#d49a8f", 9 * k); LN(cx, cy - 36 * k, cx - 40 * k, cy - 10 * k, "#d49a8f", 6 * k); LN(cx, cy - 36 * k, cx + 40 * k, cy - 10 * k, "#d49a8f", 6 * k);
  b3.E(cx - 50 * k, cy - 4 * k, r * .66, r * 1.15, "#f6c8c0", "#d98b7f"); b3.E(cx + 50 * k, cy - 4 * k, r * .66, r * 1.15, "#f6c8c0", "#d98b7f");
  ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.beginPath(); var dy = cy + 72 * k + 16 * s * k; ctx.moveTo(cx - 98 * k, cy + 56 * k); ctx.quadraticCurveTo(cx, dy - 36 * k - 14 * s * k + 36 * k * (1 - s) * 0, cx + 98 * k, cy + 56 * k); ctx.stroke();
};
SFA.theo("c05", {
  icon: function () {
    b3.lungs(W * .27, H * .52, .6, .85); TB("O₂", W * .62, H * .35, BLUE, 38); TB("CO₂", W * .84, H * .55, GREY, 34); b3.ar(W * .56, H * .5, W * .74, H * .5, BLUE, 3); b3.ar(W * .74, H * .64, W * .56, H * .64, GREY, 3); TB("respiration", W * .7, H * .88, BLUE_D, 20);
  },
  anim: function (t) {
    var ph = Math.sin(t * .03), s = (ph + 1) / 2, insp = Math.cos(t * .03) > 0, i;
    ctx.save(); ctx.scale(W / 700, H / 300);
    b3.lungs(160, 150, s, 1.0);
    b3.ar(160, insp ? 8 : 40, 160, insp ? 40 : 8, insp ? BLUE : GREY, 4); TB(insp ? "air entre" : "air sort", 215, 22, insp ? BLUE_D : GREY, 14, "left");
    TB(insp ? "INSPIRATION" : "EXPIRATION", 160, 285, insp ? BLUE_D : ORANGE, 15);
    TB(insp ? "diaphragme ↓ · côtes ↑ · volume ↑ · pression ↓" : "diaphragme ↑ · côtes ↓ · volume ↓ · pression ↑", 160, 268, INK, 12);
    b3.ar(160, 210 + 16 * s - 18, 160, 226 + 16 * s - 10 + (insp ? 8 : -8) * 0, ORANGE, 0.1);
    TB("diaphragme", 270, 226 + 16 * s, ORANGE, 12, "left");
    /* alvéole */
    b3.E(520, 150, 62, 62, "#e3f1fb", BLUE); TB("alvéole", 520, 125, BLUE_D, 14);
    ctx.strokeStyle = RED; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(520, 150, 74, -1.0, 1.0); ctx.stroke(); ctx.strokeStyle = "#f9c4c3"; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(520, 150, 74, -1.0, 1.0); ctx.stroke();
    TB("capillaire", 650, 90, DRED, 13); TB("sang", 650, 106, DRED, 13);
    for (i = 0; i < 4; i++) { var u = (t * .006 + i / 4) % 1; DOT(520 + 20 + u * 62, 125 + u * 0 - u * 30 + 30, 5, BLUE); DOT(520 + 80 - u * 62 + 0, 190 - u * 0 - u * 45 + 20 * 0, 4, "rgba(0,0,0,0)"); }
    for (i = 0; i < 4; i++) { var u1 = (t * .007 + i / 4) % 1, yy = 128 + i * 12; DOT(540 + u1 * 40, yy, 5, BLUE); }
    for (i = 0; i < 3; i++) { var u2 = (t * .007 + i / 3) % 1, yy2 = 150 + i * 14; DOT(620 - u2 * 40, yy2, 5, GREY); }
    TB("O₂ → sang", 520, 238, BLUE_D, 14); TB("CO₂ → air", 520, 256, "#6a6a6a", 14);
    TB("inspiré : 20,9 % O₂ · expiré : 16,5 % O₂", 520, 284, INK, 13);
    TB("ventilation + circulation = O₂ livré aux cellules", 520, 22, ORANGE, 13);
    ctx.restore();
  },
  th: "<div class=\"tcard\"><b class=\"h\">Le trajet de l'air</b><p>fosses nasales → pharynx → <b>larynx</b> → <b>trachée</b> → <b>bronches</b> → <b>bronchioles</b> → <b>alvéoles</b>. Les alvéoles sont de minuscules sacs à paroi très mince, entourés de capillaires sanguins : leur grand nombre offre une surface d'échange de plusieurs dizaines de m².</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">La ventilation : un mécanisme de pression</b><p><b>Inspiration</b> : le diaphragme se contracte et descend, les côtes se soulèvent, le <b>volume du thorax augmente</b>, la <b>pression diminue</b> et l'air entre. <b>Expiration</b> : le diaphragme remonte, le volume diminue, la pression augmente et l'air sort (passive au repos).</p><p><i>Loi de Boyle</i> (à température constante) : P × V = constante. Exemple : 101,3 kPa × 2,5 L = P × 3,0 L donc P ≈ <b>84,4 kPa</b> : la pression est inférieure à celle de l'air extérieur, l'air entre.</p><p><b>Débit ventilatoire</b> = fréquence × volume d'air par mouvement. Au repos : 15 × 0,5 = <b>7,5 L/min</b> ; à l'effort : 40 × 2,0 = <b>80 L/min</b> (environ 11 fois plus).</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Les échanges gazeux dans l'alvéole</b><p>Par <b>diffusion</b>, O₂ passe de l'air alvéolaire vers le sang et CO₂ passe du sang vers l'air. L'air expiré contient moins d'O₂ (16,5 % contre 20,9 %) et plus de CO₂ (environ 4 % contre 0,04 %). Part de O₂ prélevée : (20,9 − 16,5) / 20,9 ≈ <b>21 %</b>. Avec 7,5 L d'air par minute : 7,5 × 0,044 ≈ <b>0,33 L de O₂ par minute</b>. Le dioxygène est transporté par l'<b>hémoglobine</b> des globules rouges.</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">À l'effort : cœur et poumons ensemble</b><p>Les muscles ont besoin de plus de O₂ : la ventilation <b>et</b> le rythme cardiaque augmentent. <b>Débit cardiaque</b> = fréquence cardiaque × volume d'éjection. Au repos : 70 × 70 mL = 4,9 L/min ; à l'effort : 150 × 110 mL = 16,5 L/min (× 3,4). Fréquence maximale estimée : 220 − âge (205 à 15 ans) ; la <b>zone d'endurance</b> correspond à 60-70 % de ce maximum (123 à 143 bpm).</p></div>" +
    "<div class=\"tcard\"><b class=\"h\">Altitude et monoxyde de carbone</b><p><b>Altitude</b> : l'air contient toujours environ 21 % de dioxygène, mais la <b>pression est plus faible</b> : il y a moins de molécules de O₂ par litre, donc moins d'O₂ passe dans le sang. <b>Tabac</b> : le monoxyde de carbone CO se fixe sur l'hémoglobine bien plus solidement que O₂ et l'occupe. Si 10 % de l'hémoglobine est occupée : 195 × 0,9 ≈ 175 mL de O₂ par litre de sang au lieu de 195, et le cœur doit augmenter son débit d'environ 11 % pour livrer la même quantité. <i>Piège :</i> une saturation de 97 % ne dit rien de l'hémoglobine déjà bloquée par le CO.</p></div>"
});

SFA.figs("c05", [
  /* 0 Chemin de l'air */
  function (p) {
    var nm = ["fosses nasales", "larynx", "trachée", "bronches", "bronchioles", "alvéoles"], y = [.1, .24, .38, .55, .72, .88], i, x = W * .3;
    LN(x, H * .06, x, H * .42, "#d49a8f", 12); LN(x, H * .42, x - 50, H * .6, "#d49a8f", 8); LN(x, H * .42, x + 50, H * .6, "#d49a8f", 8); LN(x - 50, H * .6, x - 80, H * .74, "#d49a8f", 4); LN(x + 50, H * .6, x + 80, H * .74, "#d49a8f", 4);
    for (i = 0; i < 5; i++) DOT(x - 100 + i * 16 + (i > 1 ? 18 : 0) + (i > 2 ? 22 : 0), H * .82 + (i % 2) * 8, 9, "#f6c8c0"); for (i = 0; i < 5; i++) DOT(x + 60 + i * 16, H * .82 + (i % 2) * 8, 9, "#f6c8c0");
    for (i = 0; i < 6; i++) { TB(nm[i], W * .55, H * (y[i] + .02), p > 0 ? INK : GREY, 14, "left"); if (p > 0) { DOT(W * .52, H * y[i], 11, BLUE); TB(i + 1, W * .52, H * y[i] + 5, "#fff", 13); } }
    if (p <= 0) TB("ordre ?", W * .8, H * .5, ORANGE, 20);
  },
  /* 1 Échange dans l'alvéole */
  function (p) {
    b3.E(W * .33, H * .5, 80, 80, "#e3f1fb", BLUE); TB("air", W * .33, H * .5 + 5, BLUE_D, 17); ctx.strokeStyle = "#f9c4c3"; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(W * .33, H * .5, 100, -1.1, 1.1); ctx.stroke(); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W * .33, H * .5, 111, -1.1, 1.1); ctx.stroke(); ctx.beginPath(); ctx.arc(W * .33, H * .5, 89, -1.1, 1.1); ctx.stroke();
    TB("sang", W * .72, H * .2, DRED, 16);
    if (p > 0) { var a = b3.f(p, 0, .5); ctx.globalAlpha = a; b3.ar(W * .5, H * .4, W * .72, H * .4, BLUE, 4); TB("O₂ → sang", W * .73, H * .4 - 12, BLUE_D, 15, "left"); b3.ar(W * .72, H * .62, W * .5, H * .62, "#6a6a6a", 4); TB("CO₂ → air", W * .73, H * .62 + 22, "#6a6a6a", 15, "left"); ctx.globalAlpha = 1; } else TB("quels gaz, dans quel sens ?", W * .78, H * .85, ORANGE, 14);
  },
  /* 2 Débit ventilatoire */
  function (p) {
    var gb = H * .86, k = H * .38 / 80;
    b3.box(W * .08, H * .12, W * .38, H * .26, "#e3f1fb", BLUE, 10); TB("repos", W * .27, H * .2, BLUE_D, 14); TB("15 × 0,5 L", W * .27, H * .32, INK, 16);
    b3.box(W * .54, H * .12, W * .38, H * .26, "#fdecea", RED, 10); TB("effort", W * .73, H * .2, DRED, 14); TB("40 × 2,0 L", W * .73, H * .32, INK, 16);
    LN(W * .06, gb, W * .94, gb, INK, 2); var f = p > 0 ? b3.f(p, 0, .6) : 0;
    b3.box(W * .12, gb - 7.5 * k * Math.max(f, p > 0 ? 0 : 1), W * .26, 7.5 * k * Math.max(f, p > 0 ? 0 : 1), "#8ec3ea", INK, 3); b3.box(W * .6, gb - 80 * k * f, W * .26, 80 * k * f, "#f2a28a", INK, 3);
    if (p > 0) { TB("7,5 L/min", W * .25, gb - 7.5 * k - 8, BLUE_D, 15); TB("80 L/min", W * .73, gb - 80 * k * f - 8, DRED, 15); TB("× 11", W * .5, H * .66, ORANGE, 24); } else TB("débit par minute ?", W * .5, H * .6, ORANGE, 16);
  },
  /* 3 Combien de O₂ prélevé */
  function (p) {
    var gb = H * .8, k = H * .55 / 21; LN(W * .1, gb, W * .9, gb, INK, 2);
    b3.box(W * .2, gb - 20.9 * k, W * .2, 20.9 * k, "#8ec3ea", INK, 3); TB("inspiré", W * .3, gb + 18, INK, 14); TB("20,9 %", W * .3, gb - 20.9 * k - 8, BLUE_D, 15);
    b3.box(W * .6, gb - 16.5 * k, W * .2, 16.5 * k, "#b9dbf2", INK, 3); TB("expiré", W * .7, gb + 18, INK, 14); TB("16,5 %", W * .7, gb - 16.5 * k - 8, BLUE_D, 15);
    if (p > 0) { b3.box(W * .6, gb - 20.9 * k, W * .2, 4.4 * k, "#f2a28a", RED, 2); TB("4,4", W * .7, gb - 20.9 * k + 4.4 * k / 2 + 5, DRED, 13); b3.pill("4,4 / 20,9 ≈ 21 %", W * .5, H * .08 + 6, DGREEN, "#fff", 15); TB("× 7,5 L/min = 0,33 L/min", W * .5, H * .95, DGREEN, 14); } else TB("O₂ de l'air (en %)", W * .5, H * .1, GREY, 14);
  },
  /* 4 Mécanique de l'inspiration */
  function (p) {
    var s = p > 0 ? b3.f(p, 0, .7) : 0; b3.lungs(W * .38, H * .55, s, .85);
    if (p > 0) { ctx.globalAlpha = s; b3.ar(W * .38, H * .02, W * .38, H * .17, BLUE, 4); b3.ar(W * .38, H * .78, W * .38, H * .92, ORANGE, 4); b3.ar(W * .66, H * .5, W * .72, H * .4, ORANGE, 3); ctx.globalAlpha = 1; TB("1 diaphragme ↓ et côtes ↑", W * .78, H * .28, ORANGE, 13, "left"); TB("2 volume ↑", W * .78, H * .46, DGREEN, 14, "left"); TB("3 pression ↓", W * .78, H * .62, DRED, 14, "left"); TB("4 l'air entre", W * .78, H * .78, BLUE_D, 14, "left"); } else TB("l'inspiration : quelle séquence ?", W * .5, H * .06 + 4, ORANGE, 15);
  },
  /* 5 Loi de Boyle */
  function (p) {
    var x0 = W * .1, y0 = H * .62, h = 60, i;
    for (i = 0; i < 2; i++) { var v = i ? 3.0 : 2.5, w = v * 52, x = i ? W * .56 : x0; if (i && p <= 0) continue; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(x, y0 - h, w, h); ctx.fillStyle = "rgba(142,195,234,.35)"; ctx.fillRect(x, y0 - h, w, h); LN(x + w + 4, y0 - h - 6, x + w + 4, y0 + 6, ORANGE, 6); LN(x + w + 4, y0 - h / 2, x + w + 30, y0 - h / 2, ORANGE, 4); TB(i ? "3,0 L" : "2,5 L", x + w / 2, y0 + 24, INK, 15); TB(i ? "84,4 kPa" : "101,3 kPa", x + w / 2, y0 - h - 12, i ? DRED : BLUE_D, 16); }
    if (p > 0) { b3.ar(W * .47, y0 - h / 2, W * .55, y0 - h / 2, ORANGE, 3); b3.pill("101,3 × 2,5 = P × 3,0", W * .5, H * .12, "#fff3de", ORANGE, 15); b3.pill("P < pression extérieure : l'air entre", W * .5, H * .9, "#e3f1fb", BLUE_D, 14); } else { TB("?", W * .6, y0 - h / 2 + 8, ORANGE, 32); TB("P × V = constante", W * .5, H * .12, GREY, 15); }
  },
  /* 6 Zone d'endurance */
  function (p) {
    var x0 = W * .08, w = W * .84, y = H * .45, X = function (v) { return x0 + v / 205 * w; };
    b3.box(x0, y - 16, w, 32, "#f4f4f4", "#c8ccd0", 8);
    if (p > 0) { b3.box(X(123), y - 16, X(143.5) - X(123), 32, "#9ad28a", DGREEN, 4); TB("123 à 143 bpm", X(133), y - 28, DGREEN, 14); }
    [0, 70, 150, 205].forEach(function (v) { LN(X(v), y + 16, X(v), y + 24, INK, 1.5); TB(v, X(v), y + 40, GREY, 13); });
    DOT(X(150), y, 9, RED); TB("battements par minute", W * .5, H * .1, GREY, 14); TB("205 = 220 − 15", X(205), y + 66, ORANGE, 13, "right");
    if (p > 0) { b3.pill("150 / 205 = 73 % : au-dessus de la zone", W * .5, H * .88, "#fdecea", DRED, 14); } else TB("dans la zone d'endurance ?", W * .5, H * .88, ORANGE, 15);
  },
  /* 7 Moins d'oxygène en altitude */
  function (p) {
    var i, bx = [W * .1, W * .56];
    for (i = 0; i < 2; i++) { b3.box(bx[i], H * .2, W * .34, H * .58, "#f4f9fd", BLUE, 8); var n = i ? 8 : 26; for (var j = 0; j < n; j++) { var a = (j * 97.3) % 1, b = (j * 53.7) % 1; DOT(bx[i] + 12 + a * (W * .34 - 24), H * .2 + 12 + b * (H * .58 - 24), 5, j % 5 ? "#c9d3dc" : BLUE); } TB(i ? "sommet" : "niveau de la mer", bx[i] + W * .17, H * .88, INK, 14); }
    if (p > 0) { b3.pill("21 % de O₂ dans les deux", W * .5, H * .1, "#e3f1fb", BLUE_D, 14); TB("moins de molécules par litre", bx[1] + W * .17, H * .97, DRED, 13); } else TB("composition de l'air ?", W * .5, H * .1, ORANGE, 15);
  },
  /* 8 Le cœur du fumeur */
  function (p) {
    var gb = H * .8, k = H * .55 / 200; LN(W * .1, gb, W * .9, gb, INK, 2);
    b3.box(W * .2, gb - 195 * k, W * .22, 195 * k, "#8ec3ea", INK, 3); TB("non-fumeur", W * .31, gb + 18, INK, 14); TB("195 mL/L", W * .31, gb - 195 * k - 8, BLUE_D, 15);
    var f = p > 0 ? 1 : 0; if (p > 0) { b3.box(W * .58, gb - 175.5 * k, W * .22, 175.5 * k, "#b9dbf2", INK, 3); b3.box(W * .58, gb - 195 * k, W * .22, 19.5 * k, "#555", INK, 2); TB("fumeur", W * .69, gb + 18, INK, 14); TB("≈ 175 mL/L", W * .69, gb - 195 * k - 8, DRED, 15); b3.pill("débit cardiaque + 11 %", W * .5, H * .08 + 8, "#fdecea", DRED, 14); TB("CO", W * .69, gb - 195 * k + 14 * 1.1, "#fff", 12); } else { TB("fumeur", W * .69, gb + 18, INK, 14); TB("?", W * .69, gb - 50, ORANGE, 30); TB("O₂ transporté par litre de sang", W * .5, H * .1, GREY, 14); }
  },
  /* 9 Monoxyde de carbone */
  function (p) {
    b3.E(W * .5, H * .45, W * .38, H * .3, "#f9d7d6", RED); TB("globule rouge", W * .5, H * .18, DRED, 14); var i, n = 20, c = 0;
    for (i = 0; i < n; i++) { var x = W * .22 + (i % 10) * W * .062, y = H * .36 + Math.floor(i / 10) * 34, co = i % 7 === 3 && c < 3 ? (c++, true) : false; b3.box(x, y, 22, 22, co ? "#444" : (i === n - 1 ? "#fff" : "#8ec3ea"), co ? INK : BLUE_D, 4); if (co) TB("CO", x + 11, y + 15, "#fff", 10); else if (i < n - 1) TB("O₂", x + 11, y + 15, INK, 10); }
    if (p > 0) { b3.pill("15 % de l'hémoglobine bloquée par CO", W * .5, H * .78, "#fdecea", DRED, 14); TB("97 % : seulement la part restée libre", W * .5, H * .92, DRED, 13); } else TB("saturation 97 % · 15 % liée au CO", W * .5, H * .85, ORANGE, 15);
  }
]);
