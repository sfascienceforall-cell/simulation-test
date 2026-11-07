/* Chimie 6e · chapitre 5 : titrages, tampons, pH des sels (utilise les aides k6_ de theo-01.js et k4_ de theo-04.js). */
/* pH d'un mélange : Va (mL) d'acide Ca ajoutés à V (mL) de base Cb ; Ka = 0 pour un acide fort */
function k5_ph(Ca, Va, Cb, V, Ka) {
  var Vt = Va + V, ca = Ca * Va / Vt, na = Cb * V / Vt, lo = 0, hi = 14, i;
  for (i = 0; i < 50; i++) {
    var m = (lo + hi) / 2, h = Math.pow(10, -m), A = Ka ? ca * Ka / (Ka + h) : ca, g = na + h - 1e-14 / h - A;
    if (g > 0) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
}
function k5_plot(x, y, w, h, vmax, vstep, fn) {
  function X(v) { return x + w * v / vmax; } function Y(ph) { return y + h - h * ph / 14; }
  LN(x, y + h, x + w, y + h, AX, 1.6); LN(x, y + h, x, y - 4, AX, 1.6);
  for (var v = 0; v <= vmax + 1e-9; v += vstep) { LN(X(v), y + h, X(v), y + h + 4, GREY, 1.2); TB('' + v, X(v), y + h + 17, GREY, 12); }
  for (var q = 0; q <= 14; q += 2) { LN(x - 4, Y(q), x, Y(q), GREY, 1.2); TB('' + q, x - 8, Y(q) + 4, GREY, 12, 'right'); }
  TB('pH', x - 6, y - 8, GREY, 13); TB('V (mL)', x + w, y + h + 32, GREY, 13, 'right');
  ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath();
  for (var k = 0; k <= 120; k++) { var vv = vmax * k / 120, ph = fn(vv); k ? ctx.lineTo(X(vv), Y(ph)) : ctx.moveTo(X(vv), Y(ph)); } ctx.stroke();
  return { X: X, Y: Y };
}
function k5_pt(G, v, ph, col, lab, dx, dy) { DOT(G.X(v), G.Y(ph), 6, col, true); if (lab) TB(lab, G.X(v) + (dx || 0), G.Y(ph) + (dy || 0), col === RED ? DRED : (col === GREEN ? DGREEN : col), 14, 'center'); }
function k5_vline(G, v, ph, col) { LN(G.X(v), G.Y(ph), G.X(v), G.Y(0), col, 1.6, [4, 4]); LN(G.X(0), G.Y(ph), G.X(v), G.Y(ph), col, 1.6, [4, 4]); }
var K5_IND = [['hélianthine', 3.1, 4.4, '#e0883a'], ['rouge de méthyle', 4.4, 6.2, '#d9534f'], ['BBT', 6.0, 7.6, '#2e9e5b'], ['phénolphtaléine', 8.2, 10.0, '#e0589a']];

SFA.theo("c05", {
  icon: function () {
    var G = k5_plot(40, 50, 180, 140, 40, 10, function (v) { return k5_ph(.1, 20, .1, v, 1.74e-5); });
    TB('pH = pKₐ + log([A⁻]/[HA])', W * .65, 36, BLUE_D, 17);
    TB('titrage', W * .76, 110, ORANGE, 26); TB('tampon', W * .76, 146, ORANGE, 26); TB('sels', W * .76, 182, ORANGE, 26);
    LN(G.X(20), G.Y(8.73), G.X(20), G.Y(0), RED, 1.6, [4, 4]); DOT(G.X(20), G.Y(8.73), 6, RED, true);
  },
  anim: function (t) {
    var u = (t % 600) / 600, V = Math.min(40, u * 1.2 * 40);
    var fn = function (v) { return k5_ph(.1, 20, .1, v, 1.74e-5); };
    var G = k5_plot(50, 24, W * .56, H - 74, 40, 10, fn);
    var pI = [8.2, 10.0]; ctx.fillStyle = 'rgba(224,88,154,.18)'; ctx.fillRect(G.X(0), G.Y(10), G.X(40) - G.X(0), G.Y(8.2) - G.Y(10)); TB('zone de virage : phénolphtaléine', G.X(40), G.Y(10) - 4, '#c0407f', 12, 'right');
    LN(G.X(0), G.Y(4.76), G.X(10), G.Y(4.76), GREEN, 1.4, [4, 4]); LN(G.X(10), G.Y(4.76), G.X(10), G.Y(0), GREEN, 1.4, [4, 4]); TB('½éq : pH = pKₐ', G.X(11), G.Y(2.2), DGREEN, 13, 'left');
    LN(G.X(20), G.Y(8.73), G.X(20), G.Y(0), RED, 1.4, [4, 4]); TB('éq : 8,73', G.X(21), G.Y(7.2), DRED, 13, 'left');
    var ph = fn(V); DOT(G.X(V), G.Y(ph), 7, ORANGE, true);
    var fx = W * .78, fy = H * .8; var pink = ph > 8.2 ? k6_mix([240, 240, 240], [224, 88, 154], Math.min(1, (ph - 8.2) / 1.2)) : 'rgb(240,240,240)';
    k6_burette(fx, 40, 80, 14, V / 40 * .9, 'rgba(120,170,230,.55)', 4); k6_flask(fx, fy, 90, 80, .55, pink);
    TB('V = ' + k4_f(V, 1) + ' mL', fx, fy + 22, INK, 14); TB('pH = ' + k4_f(ph, 2), fx, fy + 42, BLUE_D, 15);
  },
  th: '<div class="tcard"><b class="h">Titrage acido-basique et équivalence</b><p>Doser un acide (ou une base), c\'est le faire réagir avec une solution de concentration connue jusqu\'à l\'<b>équivalence</b> : les réactifs ont été mélangés dans les proportions stœchiométriques. La réaction support doit être rapide, totale et unique.</p>' +
    '<p>Pour H<sub>3</sub>O<sup>+</sup> + OH<sup>−</sup> → 2 H<sub>2</sub>O (rapport 1 : 1) : <b>c<sub>a</sub>·V<sub>a</sub> = c<sub>b</sub>·V<sub>eq</sub></b>. On repère l\'équivalence par pH-métrie (saut de pH, point d\'inflexion, méthode des tangentes) ou par un indicateur coloré.</p></div>' +
    '<div class="tcard"><b class="h">Allure des courbes et indicateurs</b><ul><li>Acide fort + base forte : pH<sub>éq</sub> = 7 (solution de NaCl).</li><li>Acide faible + base forte : pH<sub>éq</sub> &gt; 7 (la base faible A<sup>−</sup> est formée). À la <b>demi-équivalence</b> [HA] = [A<sup>−</sup>] donc <b>pH = pK<sub>a</sub></b>, et la courbe varie peu : c\'est la zone tampon.</li><li>Base faible + acide fort : pH<sub>éq</sub> &lt; 7.</li></ul>' +
    '<p><b>Indicateur :</b> sa zone de virage doit contenir le pH à l\'équivalence : hélianthine 3,1–4,4 ; rouge de méthyle 4,4–6,2 ; bleu de bromothymol 6,0–7,6 ; phénolphtaléine 8,2–10,0 (incolore → rose).</p></div>' +
    '<div class="tcard"><b class="h">Solutions tampons</b><p>Un tampon est un mélange d\'un acide faible et de sa base conjuguée en quantités comparables. <b>pH = pK<sub>a</sub> + log([base]/[acide])</b>. Son pH varie très peu par ajout modéré d\'acide ou de base, ou par dilution.</p>' +
    '<p>Efficace pour 0,1 &lt; [base]/[acide] &lt; 10, soit pH = pK<sub>a</sub> ± 1 ; pouvoir tampon maximal quand [base] = [acide]. Exemples : sang (H<sub>2</sub>CO<sub>3</sub>/HCO<sub>3</sub><sup>−</sup>, pH 7,4), phosphates. Un ajout de H<sub>3</sub>O<sup>+</sup> convertit de la base en acide (et inversement avec OH<sup>−</sup>).</p></div>' +
    '<div class="tcard"><b class="h">pH des sels, méthode et exemple</b><p>Dans l\'eau, un sel se dissocie ; on regarde chaque ion : Na<sup>+</sup>, K<sup>+</sup>, Cl<sup>−</sup>, NO<sub>3</sub><sup>−</sup> sont spectateurs (neutres) ; NH<sub>4</sub><sup>+</sup> est un acide faible ; CH<sub>3</sub>COO<sup>−</sup> est une base faible ; HCO<sub>3</sub><sup>−</sup> est un ampholyte : pH ≈ ½(pK<sub>a1</sub> + pK<sub>a2</sub>).</p>' +
    '<p>Exemple : 20,0 mL de CH<sub>3</sub>COOH 0,100 mol/L dosés par NaOH 0,100 mol/L : V<sub>éq</sub> = 20,0 mL ; à 10,0 mL pH = 4,76 ; à l\'équivalence [CH<sub>3</sub>COO<sup>−</sup>] = 0,0500 mol/L et pH = 7 + ½(4,76 + log 0,0500) = 8,73.</p><p><b>Pièges :</b> le pH à l\'équivalence n\'est pas toujours 7 ; l\'équivalence n\'est pas le virage « approximatif » ; tenir compte du volume total dans les concentrations.</p></div>'
});

SFA.figs("c05", [
  /* 1 concentration à l'équivalence */
  function (p) {
    var pink = k6_mix([240, 240, 240], [224, 88, 154], p);
    k6_burette(110, 40, 150, 24, .6 * p, 'rgba(120,170,230,.55)', 5, ['0', '5', '10', '15', '20', '25']);
    TB('NaOH 0,100 mol/L', 110, 24, BLUE_D, 13); k6_flask(250, 232, 120, 110, .4, pink); TB('10,0 mL de HCl, c = ?', 250, 254, INK, 13);
    if (p > 0) { ctx.globalAlpha = p; tag('V = 15,0 mL', 160, 190, DRED, 14); TB('n = 0,100 × 0,0150', 390, 80, INK, 14); TB('= 1,50·10⁻³ mol', 390, 104, INK, 14); TB('c = 0,150 mol/L', 390, 150, DGREEN, 18); ctx.globalAlpha = 1; }
    else TB('c = ?', 390, 130, GREY, 22);
  },
  /* 2 pH à l'équivalence acide fort / base forte */
  function (p) {
    var G = k5_plot(50, 30, 360, 190, 40, 10, function (v) { return k5_ph(.1, 20, .1, v, 0); });
    TB('HCl + NaOH', G.X(34), G.Y(3), GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; k5_vline(G, 20, 7, RED); k5_pt(G, 20, 7, RED, 'pH = 7', 40, -10); TB('solution de NaCl', G.X(23), G.Y(4.5), DGREEN, 14, 'left'); ctx.globalAlpha = 1; }
    else TB('pH à l\'équivalence ?', G.X(29), G.Y(5), GREY, 15);
  },
  /* 3 dosage de l'acide éthanoïque */
  function (p) {
    var f = function (v) { return k5_ph(.073, 20, .1, v, 1.74e-5); };
    var G = k5_plot(50, 30, 360, 190, 30, 5, f);
    if (p > 0) {
      ctx.globalAlpha = p; k5_vline(G, 7.3, 4.76, GREEN); k5_pt(G, 7.3, 4.76, GREEN, '', 0, 0); TB('pH = pKₐ = 4,76', G.X(9), G.Y(3.1), DGREEN, 14, 'left'); k5_vline(G, 14.6, f(14.6), RED); k5_pt(G, 14.6, f(14.6), RED, '', 0, 0); TB('équivalence', G.X(16), G.Y(6.2), DRED, 14, 'left');
      TB('V = 14,6 mL', G.X(30), G.Y(3.2), DGREEN, 14, 'right'); TB('c = 0,0730 mol/L', G.X(30), G.Y(1.7), DGREEN, 14, 'right'); ctx.globalAlpha = 1;
    } else TB('c = ? · pH à ½éq ?', G.X(30), G.Y(2.2), GREY, 15, 'right');
  },
  /* 4 pH d'un tampon */
  function (p) {
    var yb = 220, sc = 120 / .2; LN(30, yb, 190, yb, AX, 1.5);
    ctx.fillStyle = ORA2; ctx.globalAlpha = .85; ctx.fillRect(50, yb - .2 * sc, 50, .2 * sc); ctx.fillStyle = BLUE; ctx.fillRect(120, yb - .1 * sc, 50, .1 * sc); ctx.globalAlpha = 1;
    TB('acide 0,20', 75, yb + 18, INK, 13); TB('base 0,10', 145, yb + 18, INK, 13); TB('CH₃COOH / CH₃COO⁻', 110, 30, BLUE_D, 13);
    var x0 = 240, x1 = 440, y = 130; function X(ph) { return x0 + (x1 - x0) * (ph - 3.5) / 3; }
    LN(x0, y, x1, y, AX, 1.8); for (var v = 4; v <= 6; v++) { LN(X(v), y - 4, X(v), y + 4, GREY, 1.2); TB('' + v, X(v), y + 20, GREY, 12); } TB('pH', x1 + 2, y + 20, GREY, 13, 'left');
    DOT(X(4.76), y, 6, GREEN, true); TB('pKₐ 4,76', X(4.76), y - 18, DGREEN, 13);
    if (p > 0) { ctx.globalAlpha = p; DOT(X(4.46), y, 8, RED, true); TB('4,46', X(4.46) - 6, y + 44, DRED, 16); TB('log 0,50 = −0,30', 340, 190, INK, 13); DOT(X(5.76), y, 8, VIOLET, true); TB('5,76 : base/acide = 10', X(5.76) - 20, y - 40, VIOLET, 13); ctx.globalAlpha = 1; }
    else TB('pH = ?', 340, 190, GREY, 18);
  },
  /* 5 le sel le plus basique */
  function (p) {
    var x0 = 30, x1 = 430, y = 130, hh = 26; k4_scale(x0, x1, y, hh);
    var S = [['HCl', 1.0, RED, true], ['NH₄Cl', 5.1, ORA2, false], ['NaCl', 7.0, GREY, true], ['CH₃COONa', 8.9, BLUE_D, false]];
    TB('0,10 mol/L', W * .5, 22, BLUE_D, 14);
    S.forEach(function (s, i) {
      var xp = x0 + (x1 - x0) * s[1] / 14, up = (i % 2 === 0);
      if (p > 0) { ctx.globalAlpha = p; LN(xp, up ? y - hh / 2 : y + hh / 2, xp, up ? y - hh / 2 - 22 : y + hh / 2 + 22, s[2], 2.4); DOT(xp, up ? y - hh / 2 - 26 : y + hh / 2 + 26, 5, s[2], true); ctx.globalAlpha = 1; }
      TB(s[0] + (p > 0 ? ' ' + k4_f(s[1], 1) : ''), xp, up ? y - hh / 2 - 38 : y + hh / 2 + 46, s[2] === GREY ? INK : s[2], 14);
    });
    if (p > .5) TB('CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻ : basique', W * .5, 262, DGREEN, 14); else TB('pH le plus élevé ?', W * .5, 262, GREY, 15);
  },
  /* 6 quel indicateur */
  function (p) {
    var f = function (v) { return k5_ph(.1, 20, .1, v, 1.74e-5); };
    var G = k5_plot(46, 28, 236, 180, 40, 10, f);
    K5_IND.forEach(function (d, i) {
      var y1 = G.Y(d[2]), y2 = G.Y(d[1]), on = (i === 3);
      ctx.fillStyle = d[3]; ctx.globalAlpha = (p > 0 && !on) ? .25 : .8; ctx.fillRect(306, y1, 20, y2 - y1); ctx.globalAlpha = 1;
      TB(d[0], 332, (y1 + y2) / 2 + 4, p > 0 && on ? DGREEN : INK, 12, 'left');
    });
    DOT(G.X(20), G.Y(8.73), 6, RED, true); LN(G.X(20), G.Y(8.73), 304, G.Y(8.73), RED, 1.6, [4, 4]);
    if (p > 0) { ctx.globalAlpha = p; ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(302, G.Y(10) - 4, 152, G.Y(8.2) - G.Y(10) + 8, 6); ctx.stroke(); TB('pH_éq ≈ 8,7 dans 8,2–10,0', W * .5, 272, DGREEN, 14); ctx.globalAlpha = 1; }
    else TB('pH_éq ≈ 8,7', G.X(24), G.Y(8.73) + 22, DRED, 14, 'left');
  },
  /* 7 pH à l'équivalence */
  function (p) {
    var f = function (v) { return k5_ph(.1, 20, .1, v, 1.74e-5); };
    var G = k5_plot(50, 30, 360, 190, 40, 10, f);
    TB('20,0 mL · 0,100 mol/L', G.X(40), G.Y(1.2), GREY, 13, 'right');
    if (p > 0) { ctx.globalAlpha = p; k5_vline(G, 20, f(20), RED); k5_pt(G, 20, f(20), RED, '', 0, 0); TB('pH = 8,73', G.X(21), G.Y(7.2), DRED, 15, 'left'); TB('V_éq = 20,0 mL', G.X(40), G.Y(4.6), DGREEN, 14, 'right'); TB('[A⁻] = 0,0500 mol/L', G.X(40), G.Y(3.1), DGREEN, 14, 'right'); ctx.globalAlpha = 1; }
    else TB('V_éq ? [A⁻] ? pH ?', G.X(40), G.Y(4.6), GREY, 15, 'right');
  },
  /* 8 acide ajouté à un tampon */
  function (p) {
    var x0 = 40, x1 = 420, hh = 22;
    [['tampon (10,0 + 10,0 mmol)', 4.76, 4.58, 90, 'ΔpH = −0,18', DGREEN], ['eau pure (100 mL)', 7.0, 1.70, 192, 'ΔpH = −5,3', DRED]].forEach(function (r, i) {
      var y = r[3]; k4_scale(x0, x1, y, hh); TB(r[0], x0, y - 24, INK, 13, 'left');
      var ph = r[1] + (r[2] - r[1]) * p, xp = x0 + (x1 - x0) * ph / 14; DOT(xp, y, 8, '#fff', true); DOT(xp, y, 8, INK, false); DOT(x0 + (x1 - x0) * r[1] / 14, y + hh / 2 + 3, 3, GREY, true);
      TB('pH ' + k4_f(p > .5 ? r[2] : r[1], 2), x1, y - 24, p > .5 ? r[5] : GREY, 14, 'right');
      if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); TB(r[4], x1, y + 52, r[5], 15, 'right'); ctx.globalAlpha = 1; }
    });
    TB('+ 2,0 mmol de HCl', W * .5, 20, BLUE_D, 14);
  },
  /* 9 tampon phosphate */
  function (p) {
    function dish(cx, col, lab, val) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, 98, 34, 11, 0, PI, 0); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 46, 100); ctx.lineTo(cx + 46, 100); ctx.lineTo(cx + 34, 114); ctx.lineTo(cx - 34, 114); ctx.closePath(); ctx.stroke(); TB(lab, cx, 136, INK, 13); TB(val, cx, 158, p > 0 ? DGREEN : GREY, 17); }
    dish(70, '#e8e8e8', 'NaH₂PO₄', p > 0 ? '0,464 g' : '? g'); dish(190, '#dcdcdc', 'Na₂HPO₄', p > 0 ? '0,871 g' : '? g');
    TB('+', 130, 100, INK, 22); A(244, 110, 38, 12, GREY, '', 2.6);
    k6_flask(340, 190, 90, 120, .78, 'rgba(120,170,230,.3)'); TB('100 mL', 340, 212, GREY, 13);
    LN(296, 190 - 120 * .78, 384, 190 - 120 * .78, GREY, 1.2, [3, 3]);
    ctx.fillStyle = '#f4f6f8'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(60, 190, 120, 56, 8); ctx.fill(); ctx.stroke(); T(p > 0 ? 'pH 7,40' : 'pH ?', 120, 226, p > 0 ? DGREEN : GREY, 20);
    TB('pH-mètre', 120, 262, GREY, 13);
    TB(p > 0 ? 'base/acide = 10^0,20 = 1,585' : '0,100 mol/L de phosphate au total', 250, 24, BLUE_D, 14);
  },
  /* 10 dilution du bicarbonate */
  function (p) {
    var x0 = 30, x1 = 430, y = 130; function X(ph) { return x0 + (x1 - x0) * ph / 14; }
    var seg = [[0, 6.35, 'H₂CO₃', '#f6c9a8'], [6.35, 10.33, 'HCO₃⁻', '#bde3c8'], [10.33, 14, 'CO₃²⁻', '#c3d6f4']];
    seg.forEach(function (s) { ctx.fillStyle = s[3]; ctx.fillRect(X(s[0]), y - 20, X(s[1]) - X(s[0]), 40); TB(s[2], (X(s[0]) + X(s[1])) / 2, y + 6, INK, 16); });
    LN(x0, y + 20, x1, y + 20, AX, 1.5); for (var v = 0; v <= 14; v += 2) { LN(X(v), y + 20, X(v), y + 25, GREY, 1.2); TB('' + v, X(v), y + 40, GREY, 12); }
    TB('pKₐ 6,35', X(6.35), y - 28, DGREEN, 13); TB('pKₐ 10,33', X(10.33), y - 28, DGREEN, 13); TB('NaHCO₃ : ampholyte', W * .5, 24, BLUE_D, 14);
    if (p > 0) { ctx.globalAlpha = p; var xm = X(8.34); LN(xm, y - 46, xm, y + 20, RED, 2.6); TB('½ (6,35 + 10,33) = 8,34', xm, y - 54, DRED, 15); tag('0,10 mol/L', xm - 56, 210, BLUE_D, 13); tag('0,010 mol/L', xm + 56, 210, BLUE_D, 13); A(xm - 20, 196, 20, -30, GREY, '', 1.5); A(xm + 20, 196, -20, -30, GREY, '', 1.5); TB('même pH', xm, 252, DGREEN, 16); ctx.globalAlpha = 1; }
    else TB('pH après dilution ?', W * .5, 230, GREY, 16);
  }
]);
