/* Chimie 6e · chapitre 4 : acides, bases, Ka, pH (utilise les aides k6_ de theo-01.js). */
function k4_scale(x0, x1, y, hh) {
  for (var k = 0; k < 14; k++) { ctx.fillStyle = 'hsl(' + (k < 7 ? k * 8 : (k === 7 ? 120 : 120 + (k - 7) * 20)) + ',70%,58%)'; ctx.fillRect(x0 + (x1 - x0) * k / 14, y - hh / 2, (x1 - x0) / 14 + 1, hh); }
  for (k = 0; k <= 14; k += 2) TB('' + k, x0 + (x1 - x0) * k / 14, y + hh / 2 + 16, GREY, 12);
}
function k4_mark(x0, x1, y, hh, ph, col, lab, up) {
  var xp = x0 + (x1 - x0) * Math.max(0, Math.min(14, ph)) / 14, d = up ? 1 : -1;
  LN(xp, y - d * hh / 2, xp, y - d * (hh / 2 + 18), col, 2.6); DOT(xp, y - d * (hh / 2 + 22), 5, col, true);
  if (lab) TB(lab, xp, y - d * (hh / 2 + 36) + (up ? 0 : 10), col, 14);
}
function k4_f(v, d) { return v.toFixed(d == null ? 2 : d).replace('.', ','); }
function k4_hash(i, a) { var v = Math.sin(i * 127.1 + a * 311.7) * 43758.5453; return v - Math.floor(v); }
/* bécher de particules : n = nombre d'acides, nd = nombre dissociés (réel), t = temps */
function k4_beaker(cx, by, w, h, n, nd, t, col, lab) {
  k6_beaker(cx, by, w, h, .8, col);
  for (var i = 0; i < n; i++) {
    var gc = i % 4, gr = Math.floor(i / 4), nr = Math.ceil(n / 4);
    var x = cx - w / 2 + 24 + (w - 48) * (gc + .5) / 4 + 5 * Math.sin(t * .03 + i * 1.7), y = by - h * .72 + (h * .62) * (gr + .5) / nr + 5 * Math.cos(t * .025 + i * 2.3);
    var dis = i < nd;
    if (dis) { DOT(x - 8, y, 7, RED, true); DOT(x + 8, y + 3, 6, BLUE, true); }
    else { DOT(x, y, 9, '#e8ebef', true); ctx.strokeStyle = GREY; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.stroke(); }
  }
  if (lab) TB(lab, cx, by + 20, INK, 13);
}
function k4_axe(x0, x1, y, lo, hi, step) { LN(x0, y, x1, y, AX, 1.6); for (var v = lo; v <= hi + 1e-9; v += step) { var x = x0 + (x1 - x0) * (v - lo) / (hi - lo); LN(x, y - 4, x, y + 4, GREY, 1.2); TB(('' + v).replace('.', ','), x, y + 20, GREY, 12); } }

SFA.theo("c04", {
  icon: function () {
    TB('pH', W * .5, H * .42, BLUE_D, 56); TB('= −log [H₃O⁺]', W * .5, H * .62, ORANGE, 22); TB('Kₐ · pKₐ · couples acide/base', W * .5, H * .85, GREY, 15);
  },
  anim: function (t) {
    var w = Math.min(190, W * .3), by = H * .78, h = H * .52;
    TB('même concentration, même nombre d\'acides dissous', W * .5, 22, BLUE_D, 14);
    var ndw = Math.floor(t / 70) % 3 === 0 ? 1 : 0;
    k4_beaker(W * .27, by, w, h, 12, 12, t, 'rgba(120,170,230,.25)', '');
    k4_beaker(W * .73, by, w, h, 12, ndw, t, 'rgba(120,170,230,.25)', '');
    TB('acide fort : HCl', W * .27, by + 20, INK, 14); TB('→ 100 % dissocié · pH = −log c', W * .27, by + 40, DGREEN, 13);
    TB('acide faible : CH₃COOH', W * .73, by + 20, INK, 14); TB('⇌ ≈ 1 % dissocié · pH = ½(pKₐ − log c)', W * .73, by + 40, ORANGE, 13);
    DOT(W * .5 - 62, 48, 6, RED, true); TB('H₃O⁺', W * .5 - 52, 52, INK, 13, 'left'); DOT(W * .5 + 6, 48, 5, BLUE, true); TB('A⁻', W * .5 + 16, 52, INK, 13, 'left'); DOT(W * .5 + 56, 48, 8, '#e8ebef', true); TB('HA', W * .5 + 68, 52, INK, 13, 'left');
  },
  th: '<div class="tcard"><b class="h">Couples acide/base et pH</b><p>Selon Brønsted, un <b>acide</b> cède un proton H<sup>+</sup>, une <b>base</b> le capte. Un couple s\'écrit acide/base : CH<sub>3</sub>COOH/CH<sub>3</sub>COO<sup>−</sup>, NH<sub>4</sub><sup>+</sup>/NH<sub>3</sub>. Une réaction acide-base est un <b>transfert de H<sup>+</sup></b> entre l\'acide d\'un couple et la base de l\'autre. L\'eau est amphotère : H<sub>3</sub>O<sup>+</sup>/H<sub>2</sub>O et H<sub>2</sub>O/OH<sup>−</sup>.</p>' +
    '<p>2 H<sub>2</sub>O ⇌ H<sub>3</sub>O<sup>+</sup> + OH<sup>−</sup>, K<sub>e</sub> = [H<sub>3</sub>O<sup>+</sup>][OH<sup>−</sup>] = 1,0·10<sup>−14</sup> à 25 °C. <b>pH = −log[H<sub>3</sub>O<sup>+</sup>]</b>, donc [H<sub>3</sub>O<sup>+</sup>] = 10<sup>−pH</sup> ; pH + pOH = 14. Une unité de pH = facteur 10 sur la concentration.</p></div>' +
    '<div class="tcard"><b class="h">Acides et bases forts ou faibles</b><p><b>Fort</b> : réaction totale avec l\'eau (HCl, HNO<sub>3</sub>, NaOH). Acide fort : pH = −log c. Base forte : pOH = −log c, pH = 14 − pOH.</p>' +
    '<p><b>Faible</b> : réaction limitée. K<sub>a</sub> = [A<sup>−</sup>][H<sub>3</sub>O<sup>+</sup>]/[HA], pK<sub>a</sub> = −log K<sub>a</sub>. Plus K<sub>a</sub> est grand (pK<sub>a</sub> petit), plus l\'acide est fort. Pour un acide faible peu dissocié : <b>pH = ½(pK<sub>a</sub> − log c)</b>. Taux de dissociation α = [A<sup>−</sup>]/c ; la formule exige α &lt; 5 % ; α augmente quand on dilue.</p>' +
    '<p>La <b>force</b> (K<sub>a</sub>) ne dépend pas de la concentration : 0,10 mol/L de HCl (pH 1,0) et 0,10 mol/L de CH<sub>3</sub>COOH (pH 2,9) n\'ont pas le même pH.</p></div>' +
    '<div class="tcard"><b class="h">Prévoir une réaction, diagramme de prédominance</b><p>Pour A<sub>1</sub>H + A<sub>2</sub><sup>−</sup> ⇌ A<sub>1</sub><sup>−</sup> + A<sub>2</sub>H : <b>K = 10<sup>pK<sub>a2</sub> − pK<sub>a1</sub></sup></b>. Elle est favorisée quand l\'acide le plus fort (pK<sub>a</sub> le plus petit) réagit avec la base la plus forte (règle du gamma).</p>' +
    '<p>Diagramme : pH &lt; pK<sub>a</sub> → la forme acide prédomine ; pH &gt; pK<sub>a</sub> → la forme basique prédomine ; pH = pK<sub>a</sub> → [A<sup>−</sup>] = [HA]. Pour NH<sub>4</sub><sup>+</sup>/NH<sub>3</sub> (9,25), dans le sang (7,4) c\'est NH<sub>4</sub><sup>+</sup> qui domine.</p></div>' +
    '<div class="tcard"><b class="h">Méthode et exemple chiffré</b><p>1) Fort ou faible ? 2) Formule adaptée. 3) Vérifier α &lt; 5 %, sinon résoudre h² + K<sub>a</sub>h − K<sub>a</sub>c = 0.</p>' +
    '<p>CH<sub>3</sub>COOH 0,10 mol/L (pK<sub>a</sub> = 4,76) : pH = ½(4,76 + 1,00) = 2,88 ; h = 1,3·10<sup>−3</sup> mol/L ; α = 1,3 %.</p>' +
    '<p><b>Pièges :</b> « faible » ne veut pas dire « dilué » ; ne pas appliquer pH = −log c à un acide faible ; Ba(OH)<sub>2</sub> libère 2 OH<sup>−</sup> ; à forte dilution (&lt; 10<sup>−6</sup> mol/L) l\'eau compte.</p></div>'
});

SFA.figs("c04", [
  /* 1 bases conjuguées */
  function (p) {
    var C = [['HF', 'F⁻'], ['NH₄⁺', 'NH₃'], ['H₂CO₃', 'HCO₃⁻'], ['H₂O', 'OH⁻']];
    C.forEach(function (c, i) {
      var cx = 60 + (i % 2) * 230, cy = 80 + Math.floor(i / 2) * 105;
      ctx.strokeStyle = AX; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(cx - 52, cy - 38, 220, 80, 10); ctx.stroke();
      TB(c[0], cx, cy + 8, ORA2, 22); TB('→', cx + 62, cy + 8, GREY, 22);
      if (p > 0) { ctx.globalAlpha = p; TB(c[1], cx + 120, cy + 8, BLUE_D, 22); ctx.globalAlpha = 1; } else TB('?', cx + 120, cy + 8, GREY, 24);
      A(cx + 14, cy - 8, 34, -14, RED, '', 2); TB('H⁺', cx + 66, cy - 26, DRED, 13);
    });
    TB('acide → base conjuguée + H⁺', W * .5, 262, BLUE_D, 14);
  },
  /* 2 lire un pH */
  function (p) {
    var x0 = 30, x1 = 430, y = 130, hh = 28; k4_scale(x0, x1, y, hh);
    TB('pH = 3', x0 + (x1 - x0) * 3 / 14, y - 54, INK, 15);
    k4_mark(x0, x1, y, hh, 3, INK, '', true);
    TB('[H₃O⁺] = 10^(−pH)', W * .5, 220, BLUE_D, 18);
    if (p > 0) { ctx.globalAlpha = p; TB('= 10⁻³ mol/L', W * .5, 250, DGREEN, 20); ctx.globalAlpha = 1; } else TB('= ?', W * .5, 250, GREY, 20);
  },
  /* 3 pH acide et base forts */
  function (p) {
    var x0 = 30, x1 = 430, y = 140, hh = 26; k4_scale(x0, x1, y, hh);
    var a = 7 + (1.70 - 7) * p, b = 7 + (11.70 - 7) * p;
    k4_mark(x0, x1, y, hh, a, RED, p > .7 ? 'HCl 0,020 : 1,70' : 'HCl 0,020', true);
    k4_mark(x0, x1, y, hh, b, BLUE_D, p > .7 ? 'NaOH 0,0050 : 11,70' : 'NaOH 0,0050', false);
    TB('pH', 12, y + 5, INK, 13); TB('acide fort : −log c', 110, 246, RED, 13); TB('base forte : 14 − (−log c)', 340, 246, BLUE_D, 13);
  },
  /* 4 Ka et pKa */
  function (p) {
    var x0 = 30, x1 = 430, y = 150; k4_axe(x0, x1, y, 2, 10, 1);
    TB('pKₐ', 12, y - 8, GREY, 13); TB('← acide plus fort', 100, 40, DGREEN, 13); TB('acide plus faible →', 360, 40, GREY, 13);
    var D = [['A', 1.8e-5, 4.74, 'K = 1,8·10⁻⁵', ORA2, -1], ['B', 6.8e-4, 3.17, 'K = 6,8·10⁻⁴', RED, -1], ['NH₄⁺', 5.6e-10, 9.25, 'pKₐ = 9,25', BLUE, 1]];
    D.forEach(function (d, i) {
      var xp = x0 + (x1 - x0) * (d[2] - 2) / 8; DOT(xp, y, 8, d[4], true);
      TB(d[0], xp, y - 24, d[4], 16);
      if (i < 2) { TB(d[3], xp, y - 46 - (i ? 0 : 16), GREY, 13); }
      if (p > 0) { ctx.globalAlpha = p; TB(i < 2 ? 'pKₐ = ' + k4_f(d[2], 2) : 'Kₐ = 5,6·10⁻¹⁰', xp, y + 46, DGREEN, 14); ctx.globalAlpha = 1; }
      else if (i < 2) TB('pKₐ ?', xp, y + 46, GREY, 14);
    });
    if (p > .6) TB('B plus fort que A', W * .5, 248, DGREEN, 16);
  },
  /* 5 pH de l'acide éthanoïque */
  function (p) {
    var x0 = 30, x1 = 430, y = 66, hh = 22; k4_scale(x0, x1, y, hh);
    TB('CH₃COOH 0,10 mol/L · pKₐ 4,76', W * .5, 24, BLUE_D, 14);
    for (var i = 0; i < 100; i++) { var cx = 150 + (i % 20) * 8.6, cy = 150 + Math.floor(i / 20) * 14, dis = (i === 7); DOT(cx, cy, dis && p > 0 ? 5 : 3.6, dis && p > 0 ? RED : '#c3c8ce', true); }
    TB('100 molécules', 66, 168, GREY, 13); TB('(1 dissociée)', 66, 186, p > 0 ? RED : GREY, 13);
    if (p > 0) { k4_mark(x0, x1, y, hh, 2.88, INK, '', false); ctx.globalAlpha = p; TB('pH = ½ (4,76 + 1,00) = 2,88', W * .5, 246, DGREEN, 17); TB('α ≈ 1,3 %', 360, 150, RED, 15); ctx.globalAlpha = 1; }
    else TB('pH = ?', W * .5, 246, GREY, 18);
  },
  /* 6 même concentration */
  function (p) {
    var by = 210, w = 170, h = 130;
    k4_beaker(115, by, w, h, 10, Math.round(10 * p), 0, 'rgba(120,170,230,.25)', 'HCl 0,10 mol/L');
    k4_beaker(345, by, w, h, 10, p > .5 ? 1 : 0, 0, 'rgba(120,170,230,.25)', 'CH₃COOH 0,10 mol/L');
    TB('même concentration', W * .5, 22, BLUE_D, 14);
    TB('pH 1,0', 115, 262, p > 0 ? DGREEN : GREY, 16); TB('pH 2,9', 345, 262, p > 0 ? DGREEN : GREY, 16);
    if (p > .5) { TB('100 % dissocié', 115, 50, DGREEN, 13); TB('≈ 1,3 % dissocié', 345, 50, ORANGE, 13); }
  },
  /* 7 sens d'une réaction */
  function (p) {
    var R = [['CH₃COOH', 'CH₃COO⁻', 4.76, 70], ['HCN', 'CN⁻', 9.21, 150], ['NH₄⁺', 'NH₃', 9.25, 205]];
    TB('acide', 130, 28, ORA2, 14); TB('base', 330, 28, BLUE_D, 14);
    R.forEach(function (r) { TB(r[0], 130, r[3] + 5, ORA2, 16); TB(r[1], 330, r[3] + 5, BLUE_D, 16); TB('pKₐ ' + k4_f(r[2], 2), 230, r[3] + 5, GREY, 13); });
    if (p > 0) {
      ctx.globalAlpha = p; A(160, 76, 140, 124, GREEN, '', 3.4); tag('a) K ≈ 3,1·10⁴ (totale)', 372, 182, DGREEN, 13);
      ctx.setLineDash([6, 5]); A(160, 142, 140, -62, RED, '', 2.6); ctx.setLineDash([]); tag('b) K ≈ 3,5·10⁻⁵ (nulle)', 372, 108, DRED, 13); ctx.globalAlpha = 1;
    } else TB('K = ?', W * .5, 238, GREY, 16);
    TB('règle du gamma : acide fort + base forte', W * .5, 262, GREY, 13);
  },
  /* 8 antiacide */
  function (p) {
    var yb = 206, sc = 140 / 9.49, x1 = 110, x2 = 290;
    TB('300 mL de suc gastrique, pH 1,5', W * .5, 22, BLUE_D, 14); LN(40, yb, 420, yb, AX, 1.5);
    var h1 = 9.49 * sc, hn = 6.90 * sc * p, hr = 9.49 * sc - hn;
    ctx.fillStyle = RED; ctx.globalAlpha = .85; ctx.fillRect(x1 - 40, yb - hr, 80, hr); ctx.fillStyle = '#c9ced4'; ctx.fillRect(x1 - 40, yb - h1, 80, hn); ctx.globalAlpha = 1;
    TB('H⁺ : 9,49 mmol', x1, yb + 20, INK, 13);
    ctx.fillStyle = BLUE; ctx.globalAlpha = .85; ctx.fillRect(x2 - 40, yb - 6.90 * sc, 80, 6.90 * sc); ctx.globalAlpha = 1; TB('2 × 3,45 = 6,90 mmol', x2, yb + 20, INK, 13); TB('Mg(OH)₂ 200 mg', x2, yb - 6.9 * sc - 8, BLUE_D, 13);
    if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB('reste 2,59', x1, yb - 2.59 * sc / 2 + 4, '#fff', 13); TB('pH = 2,06', W * .5, 264, DGREEN, 18); ctx.globalAlpha = 1; } else TB('pH après ?', W * .5, 264, GREY, 16);
  },
  /* 9 l'approximation échoue */
  function (p) {
    var gx = 50, gb = 232, gw = 380, gh = 170, xl = 2, xh = 6, yl = 3, yh = 6.2;
    function X(v) { return gx + gw * (v - xl) / (xh - xl); } function Y(v) { return gb - gh * (v - yl) / (yh - yl); }
    LN(gx, gb, gx + gw, gb, AX, 1.5); LN(gx, gb, gx, gb - gh - 6, AX, 1.5);
    for (var v = 2; v <= 6; v++) { TB('' + v, X(v), gb + 16, GREY, 12); } for (v = 3; v <= 6; v++) TB('' + v, gx - 10, Y(v) + 4, GREY, 12);
    TB('−log c', gx + gw - 20, gb + 34, GREY, 13); TB('pH', gx - 4, gb - gh - 14, GREY, 13);
    ctx.fillStyle = 'rgba(226,75,74,.07)'; ctx.fillRect(X(2.16), gb - gh, X(6) - X(2.16), gh); TB('α > 5 %', X(4.1), gb - gh + 18, DRED, 13);
    var Ka = 1.74e-5;
    ctx.strokeStyle = GREY; ctx.lineWidth = 2.4; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(X(2), Y(.5 * (4.76 + 2))); ctx.lineTo(X(6), Y(.5 * (4.76 + 6))); ctx.stroke(); ctx.setLineDash([]);
    TB('formule approchée', X(5.2), Y(4.3), GREY, 13);
    if (p > 0) {
      ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath();
      for (var k = 0; k <= 40; k++) { var x = 2 + 4 * k / 40 * p, c = Math.pow(10, -x), h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2, ph = -Math.log(h) / Math.LN10; k ? ctx.lineTo(X(x), Y(ph)) : ctx.moveTo(X(x), Y(ph)); } ctx.stroke();
      if (p > .8) { TB('exacte : 4,47', X(4), Y(4.47) - 14, DGREEN, 14); TB('approchée : 4,38', X(4) + 20, Y(4.38) + 22, GREY, 13); DOT(X(4), Y(4.47), 5, GREEN, true); DOT(X(4), Y(4.38), 5, GREY, true); }
    } else TB('c = 10⁻² puis 10⁻⁴ mol/L', W * .5, 268, GREY, 14);
  },
  /* 10 retrouver un pKa */
  function (p) {
    var x0 = 30, x1 = 430, y = 130; k4_axe(x0, x1, y, 3, 5, .5);
    TB('pKₐ', 12, y - 8, GREY, 13);
    [['HF', 3.17, BLUE], ['benzoïque', 4.20, VIOLET], ['éthanoïque', 4.76, ORA2]].forEach(function (a, i) {
      var xp = x0 + (x1 - x0) * (a[1] - 3) / 2; DOT(xp, y, 7, a[2], true); TB(a[0], xp, y - 20 - (i === 1 ? 20 : 0), a[2], 13);
    });
    TB('pH 2,90 · c = 0,100 mol/L', W * .5, 24, BLUE_D, 14);
    if (p > 0) {
      var xc = x0 + (x1 - x0) * (4.79 - 3) / 2; ctx.globalAlpha = p; LN(xc, y - 14, xc, y + 40, DGREEN, 3); TB('pKₐ ≈ 4,79', xc - 4, y + 60, DGREEN, 16);
      TB('h = 1,26·10⁻³ ; α = 1,3 % ; Kₐ ≈ 1,6·10⁻⁵', W * .5, 232, INK, 14); TB('→ acide éthanoïque', W * .5, 258, DGREEN, 16); ctx.globalAlpha = 1;
    } else TB('pKₐ = ?', W * .5, 232, GREY, 18);
  }
]);
