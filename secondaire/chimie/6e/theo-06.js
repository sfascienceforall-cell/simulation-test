/* Chimie 6e · chapitre 6 : solubilité et précipitation (utilise les aides k6_ de theo-01.js et k4_ de theo-04.js). */
function k6s_log(x0, x1, y, lo, hi) {
  LN(x0, y, x1, y, AX, 1.8);
  for (var e = lo; e <= hi; e++) { var x = x0 + (x1 - x0) * (e - lo) / (hi - lo); LN(x, y - 4, x, y + 4, GREY, 1.2); TB('10' + String(e).replace('-', '⁻').replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]; }), x, y + 20, GREY, 11); }
  return function (v) { return x0 + (x1 - x0) * (Math.log(v) / Math.LN10 - lo) / (hi - lo); };
}
function k6s_crystal(x, y, s, col) { ctx.fillStyle = col || '#dfe5ec'; ctx.strokeStyle = GREY; ctx.lineWidth = 1.4; ctx.fillRect(x - s / 2, y - s / 2, s, s); ctx.strokeRect(x - s / 2, y - s / 2, s, s); }
function k6s_ion(x, y, pos, r) { DOT(x, y, r || 6, pos ? RED : BLUE, true); }

SFA.theo("c06", {
  icon: function () {
    TB('Kₛ = [Ag⁺][Cl⁻]', W * .5, H * .38, BLUE_D, 30); TB('Q > Kₛ  →  précipité', W * .5, H * .62, ORANGE, 22);
    for (var i = 0; i < 6; i++) k6s_crystal(W * .3 + i * 22, H * .85, 16);
  },
  anim: function (t) {
    var u = (t % 600) / 600, Q = Math.min(2, u * 2.2), bx = W * .3, by = H * .86, bw = Math.min(250, W * .42), bh = H * .6;
    k6_beaker(bx, by, bw, bh, .85, 'rgba(120,170,230,.22)');
    var nfree = Math.round(Math.min(Q, 1) * 7), exc = Math.max(0, Q - 1), ncr = 2 + Math.round(exc * 10);
    for (var i = 0; i < 7; i++) {
      if (i >= nfree) continue;
      var x = bx - bw / 2 + 24 + (bw - 48) * k4_hash(i, 3) + 7 * Math.sin(t * .04 + i), y = by - bh * .7 + bh * .45 * k4_hash(i, 4) + 7 * Math.cos(t * .035 + i * 2);
      k6s_ion(x, y, true, 6); k6s_ion(x + 15, y + 5, false, 6);
    }
    for (var c = 0; c < ncr; c++) k6s_crystal(bx - bw / 2 + 20 + (c % 10) * (bw - 40) / 10, by - 8 - Math.floor(c / 10) * 12, 12, '#cfd8e3');
    TB('AgCl(s) ⇌ Ag⁺ + Cl⁻', bx, by + 22, INK, 13);
    var gx = W * .62, gw = W * .32, gy = H * .36;
    TB('Q = [Ag⁺][Cl⁻]', gx + gw / 2, 30, BLUE_D, 15); ctx.fillStyle = '#eef1f4'; ctx.fillRect(gx, gy - 12, gw, 24);
    ctx.fillStyle = Q < 1 ? GREEN : RED; ctx.fillRect(gx, gy - 12, gw * Q / 2, 24); LN(gx + gw / 2, gy - 22, gx + gw / 2, gy + 22, INK, 2.4); TB('Kₛ', gx + gw / 2, gy + 40, INK, 14);
    TB(Q < .97 ? 'Q < Kₛ : solution non saturée' : (Q < 1.06 ? 'Q = Kₛ : saturée' : 'Q > Kₛ : le solide se forme'), gx + gw / 2, gy + 72, Q <= 1.06 ? DGREEN : DRED, 14);
    TB('rien ne précipite', gx + gw * .25, gy - 30, GREY, 12); TB('précipité', gx + gw * .75, gy - 30, GREY, 12);
  },
  th: '<div class="tcard"><b class="h">Équilibre de dissolution et produit de solubilité</b><p>Un sel peu soluble A<sub>x</sub>B<sub>y</sub>(s) se dissout jusqu\'à saturation : A<sub>x</sub>B<sub>y</sub>(s) ⇌ x A<sup>y+</sup> + y B<sup>x−</sup>. Le <b>produit de solubilité</b> est K<sub>s</sub> = [A<sup>y+</sup>]<sup>x</sup>·[B<sup>x−</sup>]<sup>y</sup> : le solide n\'y figure pas, et K<sub>s</sub> ne dépend que de la température.</p>' +
    '<p>AgCl : K<sub>s</sub> = [Ag<sup>+</sup>][Cl<sup>−</sup>] ; PbI<sub>2</sub> : K<sub>s</sub> = [Pb<sup>2+</sup>][I<sup>−</sup>]<sup>2</sup> ; Ag<sub>2</sub>CrO<sub>4</sub> : K<sub>s</sub> = [Ag<sup>+</sup>]<sup>2</sup>[CrO<sub>4</sub><sup>2−</sup>].</p></div>' +
    '<div class="tcard"><b class="h">Solubilité s</b><p>La solubilité s est la quantité maximale dissoute par litre (mol/L, ou g/L = s × M). Pour un sel de type AB (AgCl, BaSO<sub>4</sub>) : K<sub>s</sub> = s², <b>s = √K<sub>s</sub></b>. Pour un sel A<sub>2</sub>B ou AB<sub>2</sub> : K<sub>s</sub> = 4s³, <b>s = (K<sub>s</sub>/4)<sup>1/3</sup></b>.</p>' +
    '<p>On ne compare les K<sub>s</sub> pour classer les solubilités que si les sels ont la <b>même formule</b> : K<sub>s</sub>(Ag<sub>2</sub>CrO<sub>4</sub>) = 1,1·10<sup>−12</sup> est plus petit que celui d\'AgCl (1,8·10<sup>−10</sup>), mais le chromate est plus soluble (6,5·10<sup>−5</sup> contre 1,3·10<sup>−5</sup> mol/L).</p></div>' +
    '<div class="tcard"><b class="h">Précipiter ou non : le quotient Q</b><p>On calcule Q avec les concentrations <b>après mélange</b> (volume total !) : <b>Q &lt; K<sub>s</sub></b> : solution non saturée, pas de précipité ; <b>Q = K<sub>s</sub></b> : saturée ; <b>Q &gt; K<sub>s</sub></b> : un précipité se forme jusqu\'à Q = K<sub>s</sub>.</p>' +
    '<p><b>Précipitation sélective :</b> pour un même ion ajouté (Ag<sup>+</sup>), le début de précipitation exige [Ag<sup>+</sup>] = K<sub>s</sub>/[anion]. Le plus petit seuil précipite en premier (AgI avant AgCl pour des anions à 0,010 mol/L).</p></div>' +
    '<div class="tcard"><b class="h">Ion commun, pH, méthode et exemple</b><p><b>Ion commun</b> : la solubilité diminue. AgCl dans NaCl 0,050 mol/L : s = K<sub>s</sub>/[Cl<sup>−</sup>] = 1,8·10<sup>−10</sup>/0,050 = 3,6·10<sup>−9</sup> mol/L au lieu de 1,34·10<sup>−5</sup> (3 700 fois moins). Un anion basique (CO<sub>3</sub><sup>2−</sup>, OH<sup>−</sup>) : l\'ajout d\'acide augmente la solubilité (le calcaire se dissout dans le vinaigre).</p>' +
    '<p><b>Pièges :</b> oublier la dilution en mélangeant ; écrire K<sub>s</sub> avec le solide ; dans 4s³, oublier que [I<sup>−</sup>] = 2s ; croire qu\'un K<sub>s</sub> plus petit signifie toujours moins soluble.</p></div>'
});

SFA.figs("c06", [
  /* 1 écrire un produit de solubilité */
  function (p) {
    var R = [['AgCl(s) ⇌ Ag⁺ + Cl⁻', 'Kₛ = [Ag⁺][Cl⁻]'], ['PbI₂(s) ⇌ Pb²⁺ + 2 I⁻', 'Kₛ = [Pb²⁺][I⁻]²'], ['Ag₂CrO₄(s) ⇌ 2 Ag⁺ + CrO₄²⁻', 'Kₛ = [Ag⁺]²[CrO₄²⁻]']];
    R.forEach(function (r, i) {
      var y = 40 + i * 78; ctx.strokeStyle = AX; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(16, y - 20, W - 32, 64, 10); ctx.stroke();
      TB(String.fromCharCode(97 + i) + ')', 34, y + 12, GREY, 15); TB(r[0], 60, y + 4, INK, 16, 'left');
      if (p > 0) { ctx.globalAlpha = p; TB(r[1], 60, y + 32, DGREEN, 17, 'left'); ctx.globalAlpha = 1; } else TB('Kₛ = ?', 60, y + 32, GREY, 16, 'left');
    });
  },
  /* 2 Q et Ks */
  function (p) {
    var X = k6s_log(40, 420, 150, -12, -9);
    TB('échelle logarithmique', W * .5, 24, GREY, 13);
    ctx.fillStyle = 'rgba(29,158,117,.14)'; ctx.fillRect(40, 110, X(1.8e-10) - 40, 40); ctx.fillStyle = 'rgba(226,75,74,.14)'; ctx.fillRect(X(1.8e-10), 110, 420 - X(1.8e-10), 40);
    LN(X(1.8e-10), 96, X(1.8e-10), 168, INK, 2.6); TB('Kₛ = 1,8·10⁻¹⁰', X(1.8e-10) + 20, 88, INK, 14, 'center');
    DOT(X(4e-11), 130, 8, BLUE_D, true); TB('Q = 4,0·10⁻¹¹', X(4e-11) - 24, 112, BLUE_D, 14);
    if (p > 0) { ctx.globalAlpha = p; TB('non saturée', X(5e-11) , 190, DGREEN, 15); TB('précipité', X(1e-9) - 20, 190, DRED, 15); TB('Q < Kₛ : aucun précipité', W * .5, 245, DGREEN, 17); ctx.globalAlpha = 1; } else TB('que se passe-t-il ?', W * .5, 245, GREY, 16);
  },
  /* 3 solubilité AgCl, BaSO4 */
  function (p) {
    var yb = 220, sc = 130 / 1.6;
    LN(40, yb, 420, yb, AX, 1.5); TB('s (10⁻⁵ mol/L)', 40, 30, GREY, 13, 'left');
    [[130, 1.34, 'AgCl', ORA2, '1,9 mg/L'], [320, 1.05, 'BaSO₄', BLUE, '2,4 mg/L']].forEach(function (b) {
      var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 36, yb - h, 72, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 14);
      if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(k4_f(b[1], 2) + '·10⁻⁵', b[0], yb - h - 8, DGREEN, 15); TB(b[4], b[0], yb + 40, GREY, 13); ctx.globalAlpha = 1; }
    });
    if (p < .1) { TB('s = √Kₛ', 130, 130, GREY, 18); TB('s = √Kₛ', 320, 130, GREY, 18); TB('1,8·10⁻¹⁰', 130, 154, GREY, 13); TB('1,1·10⁻¹⁰', 320, 154, GREY, 13); }
  },
  /* 4 PbI2 */
  function (p) {
    TB('PbI₂(s) ⇌ Pb²⁺ + 2 I⁻ · Kₛ = 4s³', W * .5, 26, BLUE_D, 15);
    var yb = 220, sc = 130 / 2.8; LN(60, yb, 400, yb, AX, 1.5);
    [[150, 1.35, '[Pb²⁺] = s', RED], [310, 2.70, '[I⁻] = 2s', BLUE]].forEach(function (b) {
      var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 40, yb - h, 80, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 14);
      if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(k4_f(b[1], 2) + '·10⁻³ mol/L', b[0], yb - h - 8, DGREEN, 14); ctx.globalAlpha = 1; }
    });
    if (p < .1) TB('s = (Kₛ/4)^(1/3) = ?', W * .5, 130, GREY, 20);
  },
  /* 5 Ks plus grand, solubilité plus petite ? */
  function (p) {
    TB('Kₛ (échelle log)', 120, 24, BLUE_D, 14); TB('solubilité s (mol/L)', 340, 24, BLUE_D, 14);
    var yb = 212; LN(40, yb, 200, yb, AX, 1.5); LN(250, yb, 430, yb, AX, 1.5);
    [[80, 3.26, 'AgCl', ORA2, '1,8·10⁻¹⁰'], [160, 1.04, 'Ag₂CrO₄', BLUE, '1,1·10⁻¹²']].forEach(function (b) {
      var h = b[1] * 40; ctx.fillStyle = b[3]; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 24, yb - h, 48, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 13); TB(b[4], b[0], yb - h - 8, GREY, 13);
    });
    [[300, 1.3, 'AgCl', ORA2, '1,3·10⁻⁵'], [390, 6.5, 'Ag₂CrO₄', BLUE, '6,5·10⁻⁵']].forEach(function (b) {
      var h = b[1] * 22 * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 24, yb - h, 48, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 13);
      if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(b[4], b[0], yb - h - 8, DGREEN, 13); ctx.globalAlpha = 1; }
    });
    if (p < .1) TB('?', 345, 130, GREY, 50); else if (p > .6) TB('× 5', 345, 70, DRED, 18);
  },
  /* 6 ion commun */
  function (p) {
    TB('AgCl : effet d\'ion commun (échelle log)', W * .5, 24, BLUE_D, 14);
    var yb = 220; LN(60, yb, 400, yb, AX, 1.5); var sc = 130 / 5.3;
    [[150, 5.13, 'eau pure', ORA2, '1,34·10⁻⁵ mol/L'], [310, 1.56, 'NaCl 0,050 mol/L', BLUE, '3,6·10⁻⁹ mol/L']].forEach(function (b, i) {
      var h = b[1] * sc * (i === 0 ? 1 : p); ctx.fillStyle = b[3]; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 40, yb - h, 80, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 13);
      if (i === 0 || p > .5) { ctx.globalAlpha = i === 0 ? 1 : k6_rev(p, .5, 1); TB(b[4], b[0], yb - h - 8, i ? DGREEN : GREY, 14); ctx.globalAlpha = 1; }
    });
    if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); TB('≈ 3 700 fois moins soluble', W * .5, 262, DRED, 16); TB('s = Kₛ / [Cl⁻]', 310, 90, DGREEN, 15); ctx.globalAlpha = 1; } else TB('s dans NaCl ?', W * .5, 262, GREY, 16);
  },
  /* 7 dilution */
  function (p) {
    k6_beaker(60, 120, 60, 60, .7, 'rgba(120,170,230,.3)'); TB('50 mL Ag⁺', 60, 138, INK, 12); TB('2,0·10⁻⁵', 60, 56, GREY, 12);
    k6_beaker(150, 120, 60, 60, .7, 'rgba(120,170,230,.3)'); TB('50 mL Cl⁻', 150, 138, INK, 12); TB('2,0·10⁻⁵', 150, 56, GREY, 12);
    A(200, 90, 40, 0, GREY, '', 2.4); k6_beaker(300, 120, 84, 74, .8, 'rgba(120,170,230,.3)'); TB('100 mL', 300, 138, INK, 12);
    var X = k6s_log(40, 420, 214, -11, -9); LN(X(1.8e-10), 176, X(1.8e-10), 232, INK, 2.6); TB('Kₛ', X(1.8e-10), 170, INK, 14);
    DOT(X(4e-10), 214, 7, GREY, true); TB('Q sans dilution (faux)', X(4e-10) + 6, 196, GREY, 12);
    if (p > 0) { ctx.globalAlpha = p; DOT(X(1e-10), 214, 8, GREEN, true); TB('Q = 1,0·10⁻¹⁰', X(1e-10) - 10, 196, DGREEN, 14); TB('[Ag⁺] = [Cl⁻] = 1,0·10⁻⁵ : pas de précipité', W * .5, 268, DGREEN, 14); ctx.globalAlpha = 1; } else TB('Q après mélange ?', W * .5, 268, GREY, 15);
  },
  /* 8 qui précipite en premier */
  function (p) {
    var X = k6s_log(30, 430, 140, -16, -7);
    TB('[Ag⁺] croissant →', W * .5, 24, BLUE_D, 14); A(150, 44, 160, 0, BLUE, '', 2.4);
    TB('Cl⁻ = I⁻ = 0,010 mol/L', W * .5, 262, GREY, 13);
    DOT(X(8.5e-15), 140, 8, ORA2, true); TB('AgI', X(8.5e-15), 112, ORA2, 15); DOT(X(1.8e-8), 140, 8, BLUE, true); TB('AgCl', X(1.8e-8), 112, BLUE_D, 15);
    if (p > 0) { ctx.globalAlpha = p; TB('8,5·10⁻¹⁵', X(8.5e-15), 90, ORA2, 13); TB('1,8·10⁻⁸', X(1.8e-8), 90, BLUE_D, 13); TB('① AgI précipite en premier', 140, 204, DGREEN, 16, 'left'); TB('② quand AgCl commence : [I⁻] = 4,7·10⁻⁹ mol/L', 40, 232, INK, 14, 'left'); ctx.globalAlpha = 1; }
    else TB('lequel apparaît d\'abord ?', 140, 204, GREY, 16, 'left');
  },
  /* 9 dosage de Mohr */
  function (p) {
    var col = k6_mix([250, 220, 90], [190, 80, 60], p);
    k6_burette(110, 38, 150, 24, .72 * p, 'rgba(120,170,230,.5)', 5, ['0', '2', '4', '6', '8', '10']); TB('Ag⁺ 0,100 mol/L', 110, 24, BLUE_D, 13);
    k6_flask(240, 236, 110, 100, .45, col); TB('50,0 mL Cl⁻ + CrO₄²⁻', 240, 258, INK, 13);
    if (p > 0) { ctx.globalAlpha = p; tag('V = 7,2 mL', 160, 190, DRED, 14); TB('c(Cl⁻) = 0,0144 mol/L', 372, 70, DGREEN, 15); TB('Ag₂CrO₄ rouge pour', 372, 110, INK, 13); TB('[Ag⁺] ≈ 1,6·10⁻⁵ mol/L', 372, 130, INK, 13); TB('[Cl⁻] ≈ 1,1·10⁻⁵ mol/L', 372, 160, INK, 13); TB('(≈ 0,1 % restant)', 372, 180, GREY, 13); ctx.globalAlpha = 1; }
    else TB('c(Cl⁻) = ?', 372, 120, GREY, 18);
  },
  /* 10 calcaire et vinaigre */
  function (p) {
    var bx = 150, by = 236, bw = 180, bh = 150; k6_beaker(bx, by, bw, bh, .75, 'rgba(255,255,255,.0)');
    ctx.fillStyle = 'rgba(120,170,230,.18)'; ctx.fillRect(bx - bw / 2 + 1, by - bh * .75, bw - 2, bh * .75 - 1);
    var sz = 60 * (1 - .55 * p); ctx.fillStyle = '#e9e6dc'; ctx.strokeStyle = GREY; ctx.lineWidth = 1.6; ctx.fillRect(bx - sz / 2, by - sz * .6 - 1, sz, sz * .6); ctx.strokeRect(bx - sz / 2, by - sz * .6 - 1, sz, sz * .6);
    TB('CaCO₃(s)', bx, by + 20, INK, 13); TB('vinaigre', bx - 56, by - bh * .75 - 8, ORANGE, 13);
    if (p > 0) { ctx.globalAlpha = p; for (var i = 0; i < 7; i++) { var x = bx - 50 + i * 17, y = by - 40 - ((i * 23) % 70) - 20 * p; ctx.strokeStyle = '#7fa5c9'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 4 + i % 3, 0, 7); ctx.stroke(); } TB('CO₂', bx + 40, by - bh * .75 + 20, BLUE_D, 13); ctx.globalAlpha = 1; }
    TB('CaCO₃ ⇌ Ca²⁺ + CO₃²⁻', 345, 70, INK, 14);
    TB('+ H₃O⁺', 345, 108, ORA2, 15); A(345, 116, 0, 26, ORA2, '', 2.4); TB('HCO₃⁻ → CO₂ + H₂O', 345, 168, BLUE_D, 14);
    if (p > 0) { ctx.globalAlpha = p; TB('[CO₃²⁻] ↓', 345, 200, DRED, 16); TB('Q < Kₛ : dissolution', 345, 226, DGREEN, 15); ctx.globalAlpha = 1; } else TB('pourquoi se dissout-il ?', 345, 210, GREY, 15);
  }
]);
