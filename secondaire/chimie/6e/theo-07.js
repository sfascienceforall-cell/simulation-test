/* Chimie 6e · chapitre 7 : oxydoréduction (utilise les aides k6_ de theo-01.js et k4_ de theo-04.js). */
function k7_no(x0, x1, y, lo, hi) {
  LN(x0, y, x1, y, AX, 1.8);
  for (var v = lo; v <= hi; v++) { var x = x0 + (x1 - x0) * (v - lo) / (hi - lo); LN(x, y - 4, x, y + 4, GREY, 1.2); TB((v > 0 ? '+' : (v < 0 ? '−' : '')) + Math.abs(v), x, y + 18, GREY, 12); }
  return function (v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); };
}
function k7_e(x, y, col) { DOT(x, y, 5, '#f4c20d', true); ctx.strokeStyle = '#a07800'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.stroke(); }
function k7_ion(x, y, r, lab, fill, ink) { DOT(x, y, r, fill, true); ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); TB(lab, x, y + 5, ink, 13); }

SFA.theo("c07", {
  icon: function () {
    TB('Ox + n e⁻ ⇌ Red', W * .5, H * .36, BLUE_D, 28); TB('Zn + Cu²⁺ → Zn²⁺ + Cu', W * .5, H * .6, ORANGE, 20); TB('E° · nombre d\'oxydation', W * .5, H * .84, GREY, 15);
  },
  anim: function (t) {
    var u = (t % 420) / 420, y = H * .4, xl = W * .22, xr = W * .78;
    TB('transfert d\'électrons : réducteur → oxydant', W * .5, 24, BLUE_D, 15);
    var moved = u > .62, trav = k6_rev(u, .25, .62);
    if (!moved) k7_ion(xl, y, 30, 'Zn', '#eef1f4', INK); else k7_ion(xl, y, 30, 'Zn²⁺', '#fcebeb', DRED);
    if (!moved) k7_ion(xr, y, 30, 'Cu²⁺', '#e6f1fb', BLUE_D); else k7_ion(xr, y, 30, 'Cu', '#fdece4', ORA2);
    TB(moved ? 'n.o. +2' : 'n.o. 0', xl, y + 54, moved ? DRED : INK, 14); TB(moved ? 'n.o. 0' : 'n.o. +2', xr, y + 54, moved ? ORA2 : BLUE_D, 14);
    TB('réducteur', xl, y - 44, DRED, 14); TB('oxydant', xr, y - 44, BLUE_D, 14);
    if (u > .2 && u <= .62) for (var k = 0; k < 2; k++) { var f = Math.max(0, Math.min(1, trav - k * .12)); k7_e(xl + 36 + (xr - xl - 72) * f, y - 8 + k * 16 + 6 * Math.sin(f * PI * 2)); }
    A(xl + 40, y + 4, xr - xl - 80, 0, GREY, '', 1.4);
    TB('Zn → Zn²⁺ + 2 e⁻  (oxydation)', xl + 10, H * .78, DRED, 14, 'left'); TB('Cu²⁺ + 2 e⁻ → Cu  (réduction)', xl + 10, H * .88, BLUE_D, 14, 'left');
    TB('2 e⁻', W * .5, y - 26, '#8a6a00', 13);
  },
  th: '<div class="tcard"><b class="h">Oxydant, réducteur, demi-équations</b><p>Un <b>oxydant</b> capte des électrons, un <b>réducteur</b> en cède. Un couple s\'écrit Ox/Red : Ox + n e<sup>−</sup> ⇌ Red. L\'<b>oxydation</b> est une perte d\'électrons, la <b>réduction</b> un gain. Une réaction d\'oxydoréduction transfère des électrons entre l\'oxydant d\'un couple et le réducteur d\'un autre : Ox<sub>1</sub> + Red<sub>2</sub> → Red<sub>1</sub> + Ox<sub>2</sub>.</p>' +
    '<p>Zn + Cu<sup>2+</sup> → Zn<sup>2+</sup> + Cu : Zn → Zn<sup>2+</sup> + 2 e<sup>−</sup> (oxydation) ; Cu<sup>2+</sup> + 2 e<sup>−</sup> → Cu (réduction).</p></div>' +
    '<div class="tcard"><b class="h">Équilibrer en milieu acide</b><ol><li>Équilibrer l\'élément principal.</li><li>Équilibrer O avec H<sub>2</sub>O.</li><li>Équilibrer H avec H<sup>+</sup>.</li><li>Équilibrer les charges avec e<sup>−</sup>.</li><li>Multiplier pour égaliser les électrons, additionner, simplifier ; <b>vérifier charges et atomes</b>.</li></ol>' +
    '<p>MnO<sub>4</sub><sup>−</sup> + 8 H<sup>+</sup> + 5 e<sup>−</sup> → Mn<sup>2+</sup> + 4 H<sub>2</sub>O ; Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> + 14 H<sup>+</sup> + 6 e<sup>−</sup> → 2 Cr<sup>3+</sup> + 7 H<sub>2</sub>O.</p></div>' +
    '<div class="tcard"><b class="h">Nombre d\'oxydation (n.o.)</b><p>Corps simple : 0 ; ion monoatomique : sa charge ; O : −2 (sauf peroxydes : −1) ; H : +1 (sauf hydrures : −1) ; la somme des n.o. égale la charge de l\'espèce. Une <b>oxydation</b> = augmentation du n.o., une <b>réduction</b> = diminution. Le nombre d\'électrons échangés est la variation du n.o.</p>' +
    '<p>MnO<sub>4</sub><sup>−</sup> : n.o.(Mn) + 4 × (−2) = −1 donc +7. <b>Dismutation</b> : un même élément est oxydé et réduit (Cl<sub>2</sub> → Cl<sup>−</sup> et ClO<sup>−</sup> : 0 → −1 et +1).</p></div>' +
    '<div class="tcard"><b class="h">Potentiels standards et prévision</b><p>Plus E° est élevé, plus l\'oxydant est fort. Une réaction spontanée oppose l\'<b>oxydant du couple de plus grand E°</b> au <b>réducteur du couple de plus petit E°</b> (règle du gamma). E° : Zn<sup>2+</sup>/Zn −0,76 V ; Fe<sup>2+</sup>/Fe −0,44 V ; Cu<sup>2+</sup>/Cu +0,34 V ; Ag<sup>+</sup>/Ag +0,80 V ; Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup>/Cr<sup>3+</sup> +1,33 V ; MnO<sub>4</sub><sup>−</sup>/Mn<sup>2+</sup> +1,51 V.</p>' +
    '<p>Applications : galvanisation (le zinc protège le fer), dosages redox (permanganate, dichromate). Exemple : 100 mL de Cu<sup>2+</sup> à 0,20 mol/L + Zn en excès : 0,020 mol de Cu, soit 1,27 g déposés. <b>Pièges :</b> équilibrer les électrons avant d\'additionner ; la réaction n\'a pas lieu « en sens inverse » (Cu ne réduit pas Zn<sup>2+</sup>).</p></div>'
});

SFA.figs("c07", [
  /* 1 oxydant, réducteur, couples */
  function (p) {
    k6_beaker(150, 238, 200, 170, .7, 'rgba(120,170,230,.35)');
    ctx.fillStyle = '#b9bec4'; ctx.fillRect(140, 90, 26, 130); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(140, 90, 26, 130);
    for (var i = 0; i < 5; i++) { ctx.fillStyle = ORA2; ctx.globalAlpha = p; ctx.fillRect(166, 120 + i * 18, 7, 11); ctx.globalAlpha = 1; }
    TB('Zn', 153, 80, INK, 15); k7_ion(80, 150, 17, 'Cu²⁺', '#e6f1fb', BLUE_D); k7_ion(230, 175, 17, 'Cu²⁺', '#e6f1fb', BLUE_D); k7_ion(95, 200, 17, 'Cu²⁺', '#e6f1fb', BLUE_D);
    if (p > 0) { ctx.globalAlpha = p; k7_ion(210, 120, 17, 'Zn²⁺', '#fcebeb', DRED); tag('Cu²⁺ : oxydant', 370, 90, BLUE_D, 14); tag('Zn : réducteur', 370, 130, DRED, 14); TB('Zn → Zn²⁺ + 2 e⁻', 370, 190, DRED, 14); TB('Cu²⁺ + 2 e⁻ → Cu', 370, 214, BLUE_D, 14); ctx.globalAlpha = 1; }
    else TB('oxydant ? réducteur ?', 370, 130, GREY, 14);
  },
  /* 2 n.o. du manganèse */
  function (p) {
    var cx = 140, cy = 140, L = 62;
    [[0, -L, 30, -L + 5], [0, L, 30, L + 5], [-L, 0, -L, -26], [L, 0, L, -26]].forEach(function (d) { LN(cx, cy, cx + d[0], cy + d[1], INK, 2.4); k7_ion(cx + d[0], cy + d[1], 16, 'O', '#fcebeb', DRED); TB('−2', cx + d[2], cy + d[3], DRED, 13); });
    k7_ion(cx, cy, 24, 'Mn', '#f3eefe', VIOLET);
    TB('MnO₄⁻', 340, 60, BLUE_D, 26); TB('n.o.(Mn) + 4 × (−2) = −1', 340, 120, INK, 14);
    if (p > 0) { ctx.globalAlpha = p; TB('+7', cx + 36, cy + 40, VIOLET, 22); TB('n.o.(Mn) = −1 + 8 = +7', 340, 170, DGREEN, 17); ctx.globalAlpha = 1; } else { TB('?', cx + 36, cy + 40, GREY, 26); TB('n.o.(Mn) = ?', 340, 170, GREY, 17); }
  },
  /* 3 qui réagit avec qui */
  function (p) {
    var C = [['Ag⁺', 'Ag', .80], ['Cu²⁺', 'Cu', .34], ['Fe²⁺', 'Fe', -.44], ['Zn²⁺', 'Zn', -.76]];
    function Y(e) { return 120 - e * 80; } /* 0,80 -> 56 ; -0,76 -> 181 */
    TB('oxydant', 110, 28, BLUE_D, 14); TB('réducteur', 350, 28, DRED, 14); TB('E° (V)', 230, 28, GREY, 13);
    C.forEach(function (c) { TB(c[0], 110, Y(c[2]) + 5, BLUE_D, 17); TB(c[1], 350, Y(c[2]) + 5, DRED, 17); TB(k4_f(c[2], 2), 230, Y(c[2]) + 5, GREY, 13); });
    if (p > 0) {
      ctx.globalAlpha = p; var g = function (xs, ys, xe, ye, col, dash) { ctx.setLineDash(dash || []); A(xs, ys, xe - xs, ye - ys, col, '', 3); ctx.setLineDash([]); };
      g(134, Y(.34) + 8, 322, Y(-.44) - 6, GREEN); TB('a)', 292, Y(-.44) - 18, DGREEN, 16);
      g(134, Y(-.76) - 6, 322, Y(.34) + 8, RED, [6, 4]); TB('b) ✗', 205, Y(-.76) + 28, DRED, 16);
      g(134, Y(.8) + 8, 322, Y(.34) - 6, GREEN); TB('c)', 296, Y(.34) - 22, DGREEN, 16);
      TB('règle du gamma : réaction si Ox de E° élevé + Red de E° bas', W * .5, 250, GREY, 13); ctx.globalAlpha = 1;
    } else TB('flèche = réaction ?', W * .5, 250, GREY, 15);
  },
  /* 4 masse de cuivre déposée */
  function (p) {
    TB('100 mL de Cu²⁺ 0,20 mol/L + Zn : n = 0,020 mol', W * .5, 24, BLUE_D, 14);
    var yb = 216, sc = 130 / 1.4; LN(60, yb, 400, yb, AX, 1.5);
    [[120, 1.27, 'Cu déposé', ORA2], [260, 1.30, 'Zn dissous', '#9aa0a6']].forEach(function (b) {
      var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 40, yb - h, 80, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 14);
      if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(k4_f(b[1], 2) + ' g', b[0], yb - h - 8, DGREEN, 15); ctx.globalAlpha = 1; }
    });
    if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); tag('Δm plaque = −0,03 g', 380, 110, DRED, 14); TB('M(Zn) > M(Cu)', 380, 140, GREY, 13); ctx.globalAlpha = 1; } else TB('m(Cu) ? m(Zn) ? Δm ?', 380, 120, GREY, 14);
    TB('1 mol de Zn pour 1 mol de Cu', W * .5, 262, GREY, 13);
  },
  /* 4b placeholder supprimé volontairement */
  /* 5 lire une équation redox */
  function (p) {
    TB('nombre d\'oxydation', W * .5, 22, BLUE_D, 14);
    var X = k7_no(40, 420, 90, 0, 8);
    k7_ion(X(7), 90, 15, 'Mn', '#f3eefe', VIOLET); k7_ion(X(2), 90, 15, 'Mn', '#f3eefe', VIOLET);
    TB('MnO₄⁻', X(7), 56, VIOLET, 14); TB('Mn²⁺', X(2), 56, VIOLET, 14);
    var X2 = k7_no(40, 420, 190, 0, 8); k7_ion(X2(2), 190, 13, 'Fe', '#fdece4', ORA2); k7_ion(X2(3), 190, 13, 'Fe', '#fdece4', ORA2); TB('Fe²⁺', X2(2), 160, ORA2, 14); TB('Fe³⁺', X2(3), 160, ORA2, 14);
    if (p > 0) { ctx.globalAlpha = p; A(X(7) - 20, 128, X(2) - X(7) + 40, 0, BLUE, '', 3); TB('+7 → +2 : réduction, 5 e⁻ captés', W * .5, 150, BLUE_D, 14); A(X2(2) + 20, 226, X2(3) - X2(2) - 40 + 20, 0, RED, '', 3); TB('+2 → +3 : oxydation, × 5', 300, 238, DRED, 14); TB('MnO₄⁻ = oxydant', W * .5, 262, DGREEN, 16); ctx.globalAlpha = 1; }
    else TB('qui est l\'oxydant ?', W * .5, 255, GREY, 16);
  },
  /* 6 clou galvanisé */
  function (p) {
    ctx.fillStyle = '#c9ced4'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(60, 130, 300, 30, 6); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(40, 120, 24, 50, 6); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(62, 127); ctx.lineTo(358, 127); ctx.moveTo(62, 163); ctx.lineTo(358, 163); ctx.stroke();
    ctx.fillStyle = '#c96a3c'; ctx.fillRect(196, 126, 36, 38); TB('fer à nu', 214, 188, DRED, 13); TB('zinc (Zn)', 130, 112, BLUE_D, 13);
    ctx.fillStyle = 'rgba(120,170,230,.3)'; ctx.beginPath(); ctx.ellipse(214, 118, 40, 14, 0, PI, 0); ctx.fill(); TB('goutte d\'eau', 214, 82, GREY, 13);
    if (p > 0) {
      ctx.globalAlpha = p; k7_ion(130, 62, 0.1, '', '#fff', '#fff'); TB('Zn²⁺', 150, 96, BLUE_D, 13); k7_e(170, 150); k7_e(182, 146); k7_e(194, 150); A(150, 146, 44, 0, '#8a6a00', '', 2);
      TB('Zn → Zn²⁺ + 2 e⁻', 120, 232, BLUE_D, 14); TB('le fer reste protégé', 340, 232, DGREEN, 15); ctx.globalAlpha = 1;
    } else TB('qui s\'oxyde en premier ?', W * .5, 232, GREY, 16);
    TB('E°(Zn²⁺/Zn) = −0,76 < E°(Fe²⁺/Fe) = −0,44', W * .5, 262, GREY, 13);
  },
  /* 7 dichromate + Fe(II) */
  function (p) {
    var col = k6_mix(K6_OR, K6_GR, p), cx = 340, cy = 130;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, 44, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke(); TB(p > .5 ? '2 Cr³⁺' : 'Cr₂O₇²⁻', cx, cy + 6, '#fff', 17);
    for (var i = 0; i < 6; i++) { var y = 36 + i * 38, x = 70; k7_ion(x, y, 15, p > .5 ? 'Fe³⁺' : 'Fe²⁺', p > .5 ? '#fcebeb' : '#e8f4ee', p > .5 ? DRED : DGREEN); ctx.setLineDash([4, 3]); LN(x + 16, y, cx - 44, cy + (y - cy) * .35, GREY, 1.2); ctx.setLineDash([]); if (p < .5) k7_e(x + 50 + i * 5, y); }
    TB('6 e⁻', 206, 252, '#8a6a00', 15); TB('+ 14 H⁺', cx, 200, GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('1 Cr₂O₇²⁻ pour 6 Fe²⁺', cx, 36, DGREEN, 15); TB('V = 20,8 mL', cx, 236, DGREEN, 20); ctx.globalAlpha = 1; } else TB('V = ?', cx, 236, GREY, 20);
  },
  /* 8 du carbone moyen aux électrons */
  function (p) {
    var s = 32, y = 120, xs = [58, 190, 322];
    k6_m(xs[0], y, s, 2, 'ol', 0, ORA2); k6_m(xs[1], y, s, 2, 'al', 0, ORA2); k6_m(xs[2], y, s, 2, 'ac', 0, ORA2);
    A(xs[0] + 68, y, 40, 0, BLUE, '', 2.6); A(xs[1] + 68, y, 40, 0, BLUE, '', 2.6);
    TB('éthanol', xs[0] + 18, y + 74, BLUE_D, 14); TB('éthanal', xs[1] + 18, y + 74, BLUE_D, 14); TB('acide éthanoïque', xs[2] + 18, y + 74, BLUE_D, 14);
    if (p > 0) {
      ctx.globalAlpha = p; ['−2', '−1', '0'].forEach(function (v, i) { tag('n.o. moyen C : ' + v, xs[i] + 18, y + 118, DGREEN, 13); });
      TB('− 2 e⁻', xs[0] + 90, y - 22, DRED, 14); TB('− 2 e⁻', xs[1] + 90, y - 22, DRED, 14); TB('4 e⁻ au total', W * .5, 270, DGREEN, 16); ctx.globalAlpha = 1;
    } else TB('n.o. du carbone ?', W * .5, 270, GREY, 16);
  },
  /* 9 doser l'eau oxygénée */
  function (p) {
    k6_burette(100, 40, 150, 24, .74 * p, 'rgba(127,63,191,.55)', 5, ['0', '4', '8', '12', '16', '20']); TB('MnO₄⁻ 0,0200 mol/L', 100, 24, VIOLET, 13);
    k6_flask(220, 236, 110, 100, .4, k6_mix([245, 245, 245], [236, 190, 220], p)); TB('20,0 mL de H₂O₂ dilué', 220, 258, INK, 13);
    if (p > 0) { ctx.globalAlpha = p; tag('V = 14,8 mL', 150, 190, DRED, 14); TB('2 MnO₄⁻ + 5 H₂O₂ + 6 H⁺', 350, 52, INK, 12); TB('n(MnO₄⁻) = 2,96·10⁻⁴ mol', 350, 94, INK, 13); TB('n(H₂O₂) = 7,40·10⁻⁴ mol', 350, 118, INK, 13); TB('c = 0,0370 mol/L', 350, 154, DGREEN, 15); TB('commerciale : 0,370 mol/L', 350, 184, DGREEN, 14); TB('= 12,6 g/L', 350, 206, DGREEN, 14); ctx.globalAlpha = 1; }
    else TB('c = ?', 350, 130, GREY, 22);
  },
  /* 10 dismutation */
  function (p) {
    k7_ion(W * .5, 80, 30, 'Cl₂', '#eef1f4', INK); TB('n.o. 0', W * .5, 130, INK, 14);
    A(W * .5 - 30, 100, -90, 50, BLUE, '', 2.6); A(W * .5 + 30, 100, 90, 50, RED, '', 2.6);
    k7_ion(100, 190, 28, 'Cl⁻', '#e6f1fb', BLUE_D); k7_ion(360, 190, 28, 'ClO⁻', '#fcebeb', DRED);
    if (p > 0) { ctx.globalAlpha = p; TB('n.o. −1 : réduit', 100, 242, BLUE_D, 14); TB('n.o. +1 : oxydé', 360, 242, DRED, 14); TB('dismutation : même élément oxydé ET réduit', W * .5, 28, DGREEN, 15); ctx.globalAlpha = 1; }
    else TB('n.o. du chlore ?', W * .5, 250, GREY, 16);
  }
]);
