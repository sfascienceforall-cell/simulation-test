/* Chimie 6e · chapitre 10 : chimie du quotidien (utilise les aides k6_ de theo-01.js, k4_ de theo-04.js et k5_ de theo-05.js). */
/* acide citrique (triacide) : pH d'un mélange de Va mL de H3A (Ca) et V mL de NaOH (Cb) */
function k10_poly(Ca, Va, Cb, V) {
  var K1 = Math.pow(10, -3.13), K2 = Math.pow(10, -4.76), K3 = Math.pow(10, -6.40), Vt = Va + V, ca = Ca * Va / Vt, na = Cb * V / Vt, lo = 0, hi = 14;
  for (var i = 0; i < 50; i++) {
    var m = (lo + hi) / 2, h = Math.pow(10, -m), d = h * h * h + K1 * h * h + K1 * K2 * h + K1 * K2 * K3, A = ca * (K1 * h * h + 2 * K1 * K2 * h + 3 * K1 * K2 * K3) / d, g = na + h - 1e-14 / h - A;
    if (g > 0) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}
function k10_bag(cx, cy, w, h, lab, col, fs) {
  ctx.fillStyle = col || '#f1e3c4'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(cx - w / 2, cy - h / 2); ctx.lineTo(cx + w / 2, cy - h / 2); ctx.lineTo(cx + w / 2 - 6, cy + h / 2); ctx.lineTo(cx - w / 2 + 6, cy + h / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.fillRect(cx - w / 2 + 10, cy - h / 6, w - 20, h / 3); TB(lab, cx, cy + 6, DGREEN, fs || 16);
}

SFA.theo("c10", {
  icon: function () {
    k10_bag(W * .27, H * .5, 140, 130, 'NPK 15-5-10', null, 15);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(W * .56, H * .22, 150, 120, 8); ctx.fill(); ctx.stroke();
    TB('vinaigre 7°', W * .56 + 75, H * .22 + 32, BLUE_D, 17); TB('CH₃COOH · E260', W * .56 + 75, H * .22 + 62, GREY, 13); TB('acide citrique E330', W * .56 + 75, H * .22 + 86, GREY, 13); TB('économie d\'atomes', W * .56 + 75, H * .22 + 110, ORANGE, 13);
    TB('étiquettes · dosages · chimie verte', W * .5, H * .92, GREY, 14);
  },
  anim: function (t) {
    var u = (t % 540) / 540, mv = k6_rev(u, .3, .65);
    TB('économie d\'atomes : 60 + 46 → 88 + 18', W * .5, 22, BLUE_D, 14);
    var n = 106, cs = 11, g = 14;
    for (var i = 0; i < n; i++) {
      var waste = i >= 88, c0 = i % 11, r0 = Math.floor(i / 11);
      var x0 = W * .06 + c0 * g, y0 = H * .22 + r0 * g;
      var x1, y1; if (!waste) { x1 = W * .52 + (i % 11) * g; y1 = H * .22 + Math.floor(i / 11) * g; } else { var j = i - 88; x1 = W * .52 + (j % 6) * g; y1 = H * .22 + 9 * g + Math.floor(j / 6) * g; }
      var x = x0 + (x1 - x0) * mv, y = y0 + (y1 - y0) * mv, col = mv > .5 ? (waste ? '#b9bec4' : GREEN) : (i < 60 ? ORA2 : BLUE);
      ctx.fillStyle = col; ctx.globalAlpha = .9; ctx.fillRect(x, y, cs, cs); ctx.globalAlpha = 1;
    }
    TB('réactifs : 106 g/mol', W * .06 + 5.5 * g, H * .22 - 8, INK, 13); TB('produit voulu : 88', W * .52 + 5 * g, H * .22 - 8, DGREEN, 13); TB('déchet : H₂O 18', W * .52 + 3 * g, H * .22 + 12.6 * g + 8, GREY, 13);
    if (mv > .9) { TB('88 / 106 = 83 %', W * .83, H * .45, DGREEN, 20); TB('(≠ rendement)', W * .83, H * .45 + 24, GREY, 14); }
  },
  th: '<div class="tcard"><b class="h">Lire la chimie des produits courants</b><p>Le groupe fonctionnel explique le rôle : éthanol (alcool, désinfectant), glycérol (trialcool, hydratant), acide citrique (triacide + alcool, acidifiant E330), acide éthanoïque (vinaigre, E260), éthanoate d\'éthyle (ester, solvant et arôme), savon (carboxylate). Sur une étiquette, les ingrédients sont classés par masse décroissante ; les additifs portent un code E (E211 = benzoate de sodium, conservateur).</p>' +
    '<p><b>Esprit critique :</b> « naturel » ne veut pas dire sans danger, « chimique » ne veut pas dire toxique : tout est constitué de molécules ; c\'est la dose et la structure qui comptent.</p></div>' +
    '<div class="tcard"><b class="h">Doser un produit courant (vinaigre, boisson)</b><p>Titrage acido-basique avec la soude : n(OH<sup>−</sup>) = z·n(acide) à l\'équivalence (z = 1 pour l\'acide éthanoïque, 3 pour l\'acide citrique). On dilue souvent le vinaigre 10 fois : c(vinaigre) = 10 × c(diluée).</p>' +
    '<p>Degré du vinaigre = g d\'acide pour 100 mL = c × M / 10. Exemple : V<sub>éq</sub> = 17,4 mL (NaOH 0,100 mol/L, 20,0 mL de dilué) → c<sub>dil</sub> = 0,0870 mol/L → c = 0,870 mol/L → 5,2 g/100 mL. L\'équivalence est basique (CH<sub>3</sub>COO<sup>−</sup>, ou citrate) : indicateur = phénolphtaléine.</p></div>' +
    '<div class="tcard"><b class="h">Les engrais NPK</b><p>« NPK 15-5-10 » : pourcentages en masse d\'<b>N</b>, de <b>P<sub>2</sub>O<sub>5</sub></b> et de <b>K<sub>2</sub>O</b>. Éléments purs : P = 62/142 = 43,7 % de P<sub>2</sub>O<sub>5</sub> ; K = 78/94 = 83,0 % de K<sub>2</sub>O. Dose d\'engrais = besoin / teneur.</p>' +
    '<p>50 kg de 15-5-10 : 7,5 kg de N ; 2,5 kg de P<sub>2</sub>O<sub>5</sub> (1,09 kg de P) ; 5,0 kg de K<sub>2</sub>O (4,15 kg de K). Pour 180 kg/ha de N avec un 20-10-10 : 900 kg/ha d\'engrais, soit 90 kg/ha de P<sub>2</sub>O<sub>5</sub>.</p></div>' +
    '<div class="tcard"><b class="h">Chimie verte : économie d\'atomes et facteur E</b><p><b>Économie d\'atomes</b> = M(produit voulu) / ΣM(réactifs) × 100 : propriété de l\'équation, indépendante du rendement. <b>Facteur E</b> = masse de déchets / masse de produit obtenu : plus il est petit, mieux c\'est.</p>' +
    '<p>Estérification : 88/(60 + 46) = 83 % (l\'eau est perdue). Hydratation de l\'éthène : 100 %. Substitution C<sub>2</sub>H<sub>5</sub>Br + NaOH : 46/149 = 31 %, E ≈ 3 à 80 % de rendement. <b>Pièges :</b> confondre rendement et économie d\'atomes ; oublier la dilution ; comparer des teneurs d\'oxydes à des éléments purs.</p></div>'
});

SFA.figs("c10", [
  /* 1 fonctions dans une étiquette */
  function (p) {
    var C = [['éthanol', 'alcool'], ['glycérol', 'alcool (×3)'], ['acide citrique', 'acide carboxylique (×3) + alcool'], ['éthanoate d\'éthyle', 'ester']];
    C.forEach(function (c, i) {
      var cx = 118 + (i % 2) * 226, cy = 20 + Math.floor(i / 2) * 124; ctx.strokeStyle = AX; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(cx - 108, cy, 216, 112, 10); ctx.stroke(); TB(c[0], cx, cy + 20, BLUE_D, 14);
      if (i === 0) k6_m(cx - 20, cy + 70, 26, 2, 'ol', 0, ORA2);
      if (i === 1) { var P = k6_m(cx - 26, cy + 76, 26, 3, null, 0); [[0, -.87, -.5], [1, 0, -1], [2, .87, -.5]].forEach(function (d) { var q = P[d[0]], ex = q.x + d[1] * 24, ey = q.y + d[2] * 24; LN(q.x, q.y, ex, ey, ORA2, 2.4); k6_at('OH', ex, ey, ORA2, 14); }); }
      if (i === 2) { T('HOOC–CH₂–C(OH)–CH₂–COOH', cx, cy + 62, INK, 12); T('COOH', cx + 14, cy + 82, INK, 12); }
      if (i === 3) k2_est(cx - 66, cy + 80, 26, 2, 2, ORA2, BLUE);
      if (p > 0) { ctx.globalAlpha = p; tag(c[1], cx, cy + 104, DGREEN, 12); ctx.globalAlpha = 1; }
    });
  },
  /* 2 NPK 15-5-10 */
  function (p) {
    k10_bag(120, 140, 170, 190, 'NPK 15-5-10', null, 17);
    var yb = 220, sc = 130 / 16; LN(250, yb, 440, yb, AX, 1.5);
    [[290, 15, 'N', BLUE], [352, 5, 'P₂O₅', ORA2], [414, 10, 'K₂O', VIOLET]].forEach(function (b) { var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 22, yb - h, 44, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 18, INK, 14); if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(b[1] + ' %', b[0], yb - h - 8, DGREEN, 15); ctx.globalAlpha = 1; } });
    if (p <= .1) TB('?  ?  ?', 350, 120, GREY, 36); else if (p > .6) TB('en masse', 350, 40, GREY, 14);
  },
  /* 3 teneur d'un vinaigre */
  function (p) {
    k6_burette(90, 40, 150, 24, .696 * p, 'rgba(120,170,230,.55)', 5, ['0', '5', '10', '15', '20', '25']); TB('NaOH 0,100 mol/L', 90, 24, BLUE_D, 13);
    k6_flask(210, 232, 110, 100, .4, k6_mix([245, 245, 245], [224, 88, 154], p)); TB('20,0 mL vinaigre ÷ 10', 210, 254, INK, 13);
    if (p > 0) { ctx.globalAlpha = p; tag('17,4 mL', 140, 186, DRED, 14); TB('c dilué = 0,0870 mol/L', 350, 70, INK, 14); TB('× 10 → 0,870 mol/L', 350, 100, INK, 14); TB('0,870 × 60 = 52,2 g/L', 350, 136, INK, 14); TB('≈ 5,2 g / 100 mL', 350, 172, DGREEN, 18); ctx.globalAlpha = 1; } else TB('degré = ?', 350, 120, GREY, 22);
  },
  /* 4 composition d'un sac d'engrais */
  function (p) {
    TB('sac de 50 kg · NPK 15-5-10', W * .5, 26, BLUE_D, 14);
    var x0 = 30, w = 400, y = 70, h = 50, S = [[7.5, 'N', BLUE], [2.5, 'P₂O₅', ORA2], [5, 'K₂O', VIOLET], [35, 'autres', '#d5d9de']], x = x0;
    S.forEach(function (s) { var ww = w * s[0] / 50 * p; ctx.fillStyle = s[2]; ctx.fillRect(x, y, ww, h); x += ww; });
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x0, y, w, h);
    if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB('7,5 kg N', x0 + 28, y + 70, BLUE_D, 13); TB('2,5 kg P₂O₅', x0 + 90, y + 92, ORA2, 13); TB('5,0 kg K₂O', x0 + 168, y + 70, VIOLET, 13); TB('P : 2,5 × 62/142 = 1,09 kg', W * .5, 220, DGREEN, 15); TB('K : 5,0 × 78/94 = 4,15 kg', W * .5, 246, DGREEN, 15); ctx.globalAlpha = 1; }
    else TB('masses de N, P₂O₅, K₂O ? de P ? de K ?', W * .5, 200, GREY, 15);
  },
  /* 5 économie d'atomes (QCM) */
  function (p) {
    TB('CH₃COOH + C₂H₅OH → ester + H₂O', W * .5, 26, BLUE_D, 14);
    var x0 = 30, w = 400, y = 76, h = 48; ctx.fillStyle = ORA2; ctx.fillRect(x0, y, w * 60 / 106, h); ctx.fillStyle = BLUE; ctx.fillRect(x0 + w * 60 / 106, y, w * 46 / 106, h); TB('acide 60', x0 + w * 30 / 106, y + 30, '#fff', 14); TB('alcool 46', x0 + w * 83 / 106, y + 30, '#fff', 14); TB('réactifs : 106 g/mol', W * .5, y - 8, INK, 13);
    var y2 = 156; ctx.fillStyle = GREEN; ctx.globalAlpha = .9; ctx.fillRect(x0, y2, w * 88 / 106 * p, h); ctx.fillStyle = '#b9bec4'; ctx.fillRect(x0 + w * 88 / 106 * p, y2, w * 18 / 106 * p, h); ctx.globalAlpha = 1;
    if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB('ester 88', x0 + w * 44 / 106, y2 + 30, '#fff', 14); TB('H₂O', x0 + w * 97 / 106, y2 + 30, INK, 13); TB('88 / 106 = 83 %', W * .5, 240, DGREEN, 20); TB('(le rendement de 67 % est une autre grandeur)', W * .5, 262, GREY, 13); ctx.globalAlpha = 1; } else TB('économie d\'atomes ?', W * .5, 220, GREY, 16);
  },
  /* 6 oubli de la dilution */
  function (p) {
    k6_beaker(80, 140, 80, 80, .8, 'rgba(120,170,230,.45)'); TB('vinaigre', 80, 160, INK, 13); A(130, 100, 50, 0, GREY, '', 2.4); TB('÷ 10', 155, 86, GREY, 14);
    k6_beaker(240, 140, 80, 80, .5, 'rgba(120,170,230,.25)'); TB('dilué : 0,100 mol/L', 240, 160, INK, 13); TB('(dosé)', 240, 178, GREY, 13);
    var yb = 252, sc = 56; LN(300, yb, 440, yb, AX, 1.5);
    [[330, .10, 'oubli', RED, '0,10'], [410, 1.0, 'correct', GREEN, '1,00']].forEach(function (b) { var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 22, yb - h, 44, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 16, INK, 12); if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(b[4], b[0], yb - h - 6, b[3] === RED ? DRED : DGREEN, 14); ctx.globalAlpha = 1; } });
    if (p > .5) TB('10 fois trop faible', 360, 120, DRED, 15); else TB('erreur ?', 360, 120, GREY, 16);
    TB('mol/L', 290, yb - 4, GREY, 12, 'right');
  },
  /* 7 facteur E */
  function (p) {
    var yb = 224, sc = 130 / 150; LN(50, yb, 410, yb, AX, 1.5); TB('masses (g) pour 1 mol d\'éthanol visé', W * .5, 22, BLUE_D, 14);
    [[130, 36.8, 112.2, 'substitution', 'EA 31 % · E ≈ 3,05'], [330, 43.7, 2.3, 'hydratation', 'EA 100 % · E ≈ 0,05']].forEach(function (b) {
      var h1 = b[1] * sc * p, h2 = b[2] * sc * p; ctx.fillStyle = GREEN; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 38, yb - h1, 76, h1); ctx.fillStyle = '#b9bec4'; ctx.fillRect(b[0] - 38, yb - h1 - h2, 76, h2); ctx.globalAlpha = 1; TB(b[3], b[0], yb + 18, INK, 14);
      if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(k4_f(b[1], 1) + ' g produit', b[0] + 44, yb - h1 / 2 + 4, DGREEN, 12, 'left'); TB(k4_f(b[2], 1) + ' g déchets', b[0] + 44, yb - h1 - h2 / 2 + 4 - (h2 < 12 ? 10 : 0), GREY, 12, 'left'); TB(b[4], b[0], yb + 40, DRED, 13); ctx.globalAlpha = 1; }
    });
    if (p <= .1) TB('EA ? E ?', W * .5, 130, GREY, 24);
  },
  /* 8 vérifier l'étiquette */
  function (p) {
    var x0 = 40, x1 = 420, y = 130; function X(v) { return x0 + (x1 - x0) * (v - 21) / 4; }
    LN(x0, y, x1, y, AX, 1.8); for (var v = 21; v <= 25; v++) { LN(X(v), y - 4, X(v), y + 4, GREY, 1.2); TB('' + v, X(v), y + 20, GREY, 12); } TB('V_éq (mL)', x1, y + 40, GREY, 13, 'right');
    TB('vinaigre « 7° » dilué 10 fois', W * .5, 24, BLUE_D, 14);
    DOT(X(22.6), y, 8, RED, true); TB('mesuré 22,6', X(22.6) - 8, y - 22, DRED, 14, 'right');
    if (p > 0) { ctx.globalAlpha = p; DOT(X(23.3), y, 8, GREEN, true); TB('attendu 23,3', X(23.3) + 8, y - 22, DGREEN, 14, 'left'); TB('étiquette : 7,00 g/100 mL', W * .5, 200, DGREEN, 15); TB('mesure : 6,78 g/100 mL (−3,1 %)', W * .5, 226, DRED, 15); ctx.globalAlpha = 1; }
    else TB('V_éq attendu ?', W * .5, 210, GREY, 18);
  },
  /* 9 acide citrique */
  function (p) {
    var f = function (v) { return k10_poly(.0312, 20, .1, v); };
    var G = k5_plot(50, 28, 370, 190, 25, 5, f);
    ctx.fillStyle = 'rgba(224,88,154,.16)'; ctx.fillRect(G.X(0), G.Y(10), G.X(25) - G.X(0), G.Y(8.2) - G.Y(10)); TB('phénolphtaléine', G.X(1), G.Y(10) - 4, '#c0407f', 12, 'left');
    TB('C₆H₈O₇ + 3 OH⁻', G.X(24), G.Y(1), GREY, 13, 'right');
    if (p > 0) { ctx.globalAlpha = p; LN(G.X(18.7), G.Y(f(18.7)), G.X(18.7), G.Y(0), RED, 1.6, [4, 4]); DOT(G.X(18.7), G.Y(f(18.7)), 6, RED, true); TB('V_éq = 18,7 mL', G.X(1), G.Y(11), DRED, 14, 'left'); TB('c = 0,0312 mol/L ≈ 6,0 g/L', G.X(1), G.Y(12.6), DGREEN, 14, 'left'); ctx.globalAlpha = 1; }
    else TB('équivalence ?', G.X(1), G.Y(12), GREY, 15, 'left');
  },
  /* 10 engrais, besoin en azote */
  function (p) {
    k10_bag(90, 130, 140, 130, 'NPK 20-10-10', null, 14);
    TB('900 kg/ha d\'engrais', 90, 214, INK, 13); TB('besoin : 180 kg/ha de N', 90, 238, GREY, 13);
    var yb = 224, sc = 150 / 190; LN(190, yb, 440, yb, AX, 1.5);
    [[240, 180, 'N', BLUE], [330, 90, 'P₂O₅', ORA2], [410, 90, 'K₂O', VIOLET]].forEach(function (b, i) { var h = b[1] * sc * (i === 0 ? 1 : p); ctx.fillStyle = b[3]; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 28, yb - h, 56, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 18, INK, 14); if (i === 0 || p > .5) { ctx.globalAlpha = i === 0 ? 1 : k6_rev(p, .5, 1); TB(b[1] + ' kg/ha', b[0], yb - h - 8, i === 0 ? INK : DGREEN, 14); ctx.globalAlpha = 1; } });
    if (p <= .1) TB('P₂O₅ ?', 370, 110, GREY, 26);
  }
]);
