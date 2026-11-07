/* Physique 6e · chapitre 5 : Oscillations et vibrations (aides ph_* : voir theo-01.js) */
function ph5_pend(px, py, L, th, r, col) { /* pendule : pivot, tige, boule */
  LN(px - 38, py, px + 38, py, INK, 3); for (var h = -34; h < 38; h += 10) LN(px + h, py, px + h - 6, py - 6, '#bbb', 1);
  var bx = px + L * Math.sin(th), by = py + L * Math.cos(th); LN(px, py, bx, by, INK, 2); DOT(bx, by, r, '#eef4fb'); ph_circ(bx, by, r, col || BLUE); return { x: bx, y: by };
}
function ph5_vspring(x, y1, y2, n, w) { var seg = (y2 - y1) / n; ctx.strokeStyle = '#7f8790'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y1); for (var i = 0; i < n; i++) ctx.lineTo(x + (i % 2 ? w : -w), y1 + seg * (i + .5)); ctx.lineTo(x, y2); ctx.stroke(); }
function ph5_ck(x, y, ok, s) { s = s || 9; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; if (ok) { ctx.strokeStyle = DGREEN; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .8); ctx.stroke(); } else { LN(x - s * .8, y - s * .8, x + s * .8, y + s * .8, DRED, 3.5); LN(x - s * .8, y + s * .8, x + s * .8, y - s * .8, DRED, 3.5); } }

SFA.theo("c05", {
  icon: function () {
    var y = H * .4; wall(W * .08, y - 34, y + 34, -1); spring(W * .08, W * .46, y, 9); blockR(W * .54, y, 24, 22, BLUE); floor(W * .08, W * .9, y + 24);
    sinCurve(W * .62, y, W * .3, H * .1, .09, 0, ORA2, 2.5);
    tag('T = 2π√(m/k)', W * .5, H * .85, BLUE_D, 24);
  },
  sub: [
    { t: "Oscillateurs libres",
      anim: function (t) {
        var w = t * .045, A0 = W * .09, floorY = H * .36;
        wall(W * .04, floorY - 34, floorY + 34, -1); var bx = W * .24 + A0 * Math.cos(w); spring(W * .04, bx - 24, floorY, 9); blockR(bx, floorY, 24, 22, BLUE); floor(W * .04, W * .46, floorY + 24);
        LN(W * .24, floorY - 38, W * .24, floorY + 40, GREY, 1.2, [3, 4]);
        var pv = { x: W * .76, y: H * .08 }, th = .42 * Math.cos(w); ph5_pend(pv.x, pv.y, H * .5, th, 14, ORA2); ctx.strokeStyle = GREY; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(pv.x, pv.y); ctx.lineTo(pv.x, pv.y + H * .55); ctx.stroke(); ctx.setLineDash([]);
        var gx = W * .06, gy = H * .82, gw = W * .88; LN(gx, gy, gx + gw, gy, AX, 1.5); sinCurve(gx, gy, gw, H * .1, .06, -(w % 1000), BLUE, 2.5);
        TB('x(t)', gx + 4, gy - H * .12, BLUE_D, 13, 'left'); TB('T = 2π√(m/k)', W * .24, H * .62, BLUE_D, 16); TB('T = 2π√(L/g)', W * .76, H * .66, DRED, 16);
        TB('A', W * .24 + A0 / 2, floorY - 44, GREY, 13); LN(W * .24, floorY - 38, W * .24 + A0, floorY - 38, GREY, 1.4);
      },
      th: '<div class="tcard"><b class="h">Décrire une oscillation</b><p>Un système écarté de sa <b>position d\'équilibre</b> et soumis à une <b>force de rappel</b> oscille. On le décrit par son <b>amplitude</b> A (écart maximal), sa <b>période</b> T (durée d\'une oscillation complète, en s), sa <b>fréquence</b> <b>f = 1/T</b> (en Hz) et sa pulsation ω = 2π·f. Si la force de rappel est proportionnelle à l\'élongation (F = −k·x), le mouvement est <b>sinusoïdal</b> : x(t) = A·cos(ωt + φ).</p></div>' +
        '<div class="tcard"><b class="h">Masse-ressort et énergie</b><p>Pour une masse m au bout d\'un ressort de raideur k : <b>T = 2π·√(m/k)</b>. La période augmente avec m, diminue avec k et <b>ne dépend pas de l\'amplitude</b> (isochronisme). Exemple : m = 0,80 kg, k = 50 N/m : T = 2π·√(0,80/50) ≈ <b>0,80 s</b>, f ≈ 1,26 Hz. Pour mesurer k : 20 oscillations en 14,0 s donnent T = 0,70 s ; avec m = 250 g, k = 4π²·m/T² ≈ <b>20 N/m</b>.</p><p>L\'énergie mécanique se conserve (sans frottement) et passe sans cesse de l\'énergie potentielle élastique à l\'énergie cinétique : <b>E = ½·k·A² = ½·m·v<sub>max</sub>²</b>, avec v<sub>max</sub> = A·ω. Exemple : m = 0,50 kg, k = 200 N/m, A = 6,0 cm : E = 0,36 J, v<sub>max</sub> = 1,2 m/s ; à x = 3,0 cm, v = √(k/m·(A² − x²)) ≈ 1,04 m/s.</p></div>' +
        '<div class="tcard"><b class="h">Pendule simple</b><p>Pour de <b>petits angles</b> (moins de 15° environ) : <b>T = 2π·√(L/g)</b>. Elle dépend de la longueur L et de g, <b>pas de la masse ni de l\'amplitude</b>. Pour T = 1,00 s sur Terre : L = g·T²/4π² ≈ 24,8 cm. Sur la Lune (g = 1,62 m/s²), un pendule de 2,0 s sur Terre bat en 2,0 × √(9,81/1,62) ≈ <b>4,9 s</b>.</p><p>À grand angle, la formule sous-estime T : pour 60°, la vraie période est environ 1,073 fois plus longue (2,84 s → 3,04 s pour L = 2,00 m, soit +7,3 %).</p><p><b>Pièges</b> : T en secondes et L en mètres ; ne pas confondre T (période) et f (fréquence) ; doubler m ne change pas la période du pendule, mais la change pour le ressort (×√2).</p></div>'
    },
    { t: "Amortissement et résonance",
      anim: function (t) {
        var s = 1 + .85 * Math.sin(t * .012), Q = 8, gx = W * .08, gy = H * .84, gw = W * .54, gh = H * .66;
        ph_axes(gx, gy, gw + 8, gh + 10, 'f_ex', 'amplitude');
        var amp = function (r) { return 1 / Math.sqrt((1 - r * r) * (1 - r * r) + r * r / (Q * Q)); }, X = function (r) { return gx + r / 2 * gw; }, Y = function (a) { return gy - a / 9 * gh; };
        ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var r = .15; r <= 1.95; r += .01) { r === .15 ? ctx.moveTo(X(r), Y(amp(r))) : ctx.lineTo(X(r), Y(amp(r))); } ctx.stroke();
        var a = amp(s); LN(X(s), gy, X(s), Y(a), GREY, 1.4, [3, 4]); DOT(X(s), Y(a), 7, ORA2); TB('f₀', X(1), gy + 17, INK, 14);
        var bx = W * .82, by = H * .5, ex = Math.min(60, a * 6) * Math.sin(t * .35);
        wall(W * .7, by - 40, by + 40, -1); spring(W * .7, bx + ex - 22, by, 8); blockR(bx + ex, by, 22, 20, BLUE); floor(W * .7, W * .96, by + 24);
        TB('amplitude : ' + (a > 6 ? 'maximale !' : a > 2.5 ? 'forte' : 'faible'), W * .83, H * .8, a > 6 ? DRED : INK, 15); TB('résonance : f_ex ≈ f₀', W * .5, H * .08, DRED, 16);
      },
      th: '<div class="tcard"><b class="h">Amortissement</b><p>Les frottements dissipent l\'énergie mécanique en chaleur : l\'amplitude décroît, souvent selon <b>A(t) = A₀·e<sup>−γ·t</sup></b> (avec b = 2·m·γ pour un coefficient de frottement b). Trois régimes : <b>pseudo-périodique</b> (frottement faible, l\'oscillateur oscille en s\'atténuant), <b>critique</b> (b = 2√(k·m) : retour à l\'équilibre le plus rapide <i>sans</i> osciller, c\'est le réglage visé pour les amortisseurs d\'une voiture) et <b>apériodique</b> (frottement fort : retour lent, sans oscillation).</p><p>Exemple : une amplitude qui passe de 10 cm à 5,0 cm en 4,0 s donne γ = ln 2/4,0 ≈ 0,173 s<sup>−1</sup> ; après 10 s, A = 10·e<sup>−1,73</sup> ≈ 1,8 cm. L\'énergie étant proportionnelle à A², elle diminue de 75 % en 4,0 s.</p></div>' +
        '<div class="tcard"><b class="h">Oscillations forcées et résonance</b><p>Si l\'on excite un oscillateur par une force périodique de fréquence f<sub>ex</sub>, il finit par osciller à f<sub>ex</sub>. Son amplitude est <b>maximale quand f<sub>ex</sub> ≈ f₀</b>, sa fréquence propre : c\'est la <b>résonance</b>. Plus le frottement est faible (facteur de qualité Q élevé), plus le pic est haut et étroit : l\'amplitude à la résonance est proportionnelle à Q.</p><p>Exemple : une passerelle de masse modale 1,0·10<sup>5</sup> kg et de raideur modale 3,6·10<sup>6</sup> N/m a f₀ = (1/2π)·√(k/m) ≈ <b>0,955 Hz</b> ; une foule dont la force latérale est à 0,95 Hz la fait entrer en résonance. Remèdes : changer f₀ (raidir : pour 1,5 Hz il faut k = m·(2πf)² ≈ 8,9·10<sup>6</sup> N/m) ou amortir (Q de 50 à 10 divise l\'amplitude par 5).</p><p><b>Pièges</b> : la résonance se produit à la fréquence <i>propre</i>, pas forcément à grande fréquence ; elle est utile (instruments, radio, IRM) autant que dangereuse (ponts, immeubles).</p></div>'
    }
  ]
});

SFA.figs("c05", [
  /* 0 · période d'un ressort : 0,80 kg, 50 N/m */
  function (p) {
    var fy = H * .62, bx = W * .5, A0 = W * .13;
    wall(W * .06, fy - 40, fy + 40, -1); spring(W * .06, bx - 26, fy, 10); blockR(bx, fy, 26, 24, BLUE); floor(W * .06, W * .94, fy + 26);
    LN(bx, fy - 56, bx, fy + 30, GREY, 1.2, [3, 4]); ph_dim(bx, fy - 64, bx + A0, fy - 64, 'A', GREY, 0); ph_dim(bx - A0, fy - 64, bx, fy - 64, 'A', GREY, 0);
    ctx.setLineDash([4, 4]); blockR(bx + A0, fy, 26, 24, '#b9c4d1'); blockR(bx - A0, fy, 26, 24, '#b9c4d1'); ctx.setLineDash([]);
    TB('m = 0,80 kg', bx, fy + 54, INK, 15); TB('k = 50 N/m', W * .26, fy - 30, INK, 15);
    ph_fade(p, 0, function () { tag('T = 2π√(m/k) ≈ 0,80 s', W * .5, H * .12, DGREEN, 18); tag('f ≈ 1,26 Hz', W * .5, H * .26, BLUE_D, 17); });
  },
  /* 1 · ce qui change la période : pendule */
  function (p) {
    var pv = { x: W * .36, y: H * .1 }, L = H * .62, th = .42, B = ph5_pend(pv.x, pv.y, L, th, 17, BLUE);
    ctx.strokeStyle = GREY; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(pv.x, pv.y); ctx.lineTo(pv.x, pv.y + L + 10); ctx.stroke(); ctx.setLineDash([]); ph_arc(pv.x, pv.y, 54, Math.PI / 2, Math.PI / 2 - th, GREY, 1.6);
    TB('θ₀', pv.x + 22, pv.y + 76, INK, 15); TB('m', B.x + 30, B.y + 5, INK, 15); TB('L', (pv.x + B.x) / 2 + 18, (pv.y + B.y) / 2 + 4, INK, 17);
    ph_fade(p, 0, function () { ph5_ck(W * .62, H * .28, false); TB('masse m', W * .7, H * .3, INK, 15, 'left'); ph5_ck(W * .62, H * .5, false); TB('amplitude θ₀', W * .7, H * .52, INK, 15, 'left'); ph5_ck(W * .62, H * .72, true); TB('longueur L', W * .7, H * .74, DGREEN, 16, 'left'); });
  },
  /* 2 · longueur d'un pendule de 1,00 s */
  function (p) {
    var pv = { x: W * .2, y: H * .1 }, L = H * .55; ph5_pend(pv.x, pv.y, L, .3, 15, BLUE);
    ph_dim(pv.x - 44, pv.y, pv.x - 44, pv.y + L, p > 0 ? 'L = 24,8 cm' : 'L = ?', ORA2, 0);
    var gx = W * .5, gy = H * .5, gw = W * .44; LN(gx, gy, gx + gw, gy, AX, 1.5); sinCurve(gx, gy, gw, H * .3, 2 * Math.PI / (gw * .5), 0, BLUE, 3);
    ph_dim(gx, gy + H * .36, gx + gw * .5, gy + H * .36, 'T = 1,00 s', GREY, 0);
    ph_fade(p, 0, function () { tag('L = g·T²/4π² = 24,8 cm', W * .6, H * .92, DGREEN, 15); });
  },
  /* 3 · mesurer une raideur : 20 oscillations en 14,0 s */
  function (p) {
    var x = W * .3; LN(x - 50, H * .07, x + 50, H * .07, INK, 4); for (var h = -46; h < 50; h += 10) LN(x + h, H * .07, x + h - 6, H * .07 - 7, '#bbb', 1);
    ph5_vspring(x, H * .07, H * .56, 12, 15); blockR(x, H * .66, 30, 22, BLUE); TB('250 g', x, H * .66 + 5, BLUE_D, 14);
    A(x + 56, H * .66, 0, 26, GREY, '', 2); A(x + 56, H * .66, 0, -26, GREY, '', 2);
    var cx = W * .72, cy = H * .38; DOT(cx, cy, 52, '#fff'); ph_circ(cx, cy, 52, INK); for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; LN(cx + Math.cos(a) * 44, cy + Math.sin(a) * 44, cx + Math.cos(a) * 50, cy + Math.sin(a) * 50, GREY, 1.5); }
    LN(cx, cy, cx + 38 * Math.cos(-Math.PI / 2 + 14 / 60 * 2 * Math.PI), cy + 38 * Math.sin(-Math.PI / 2 + 14 / 60 * 2 * Math.PI), RED, 2.5); DOT(cx, cy, 3, INK);
    TB('14,0 s', cx, cy + 78, INK, 18); TB('20 oscillations', cx, cy + 100, GREY, 14);
    ph_fade(p, 0, function () { tag('T = 14,0/20 = 0,70 s', W * .72, H * .82, BLUE_D, 15); tag('k = 4π²m/T² ≈ 20 N/m', W * .6, H * .94, DGREEN, 16); });
  },
  /* 4 · pendule sur la Lune */
  function (p) {
    [[W * .27, 'Terre', 'g = 9,81 m/s²', '#e6f1fb', BLUE, 'T = 2,0 s'], [W * .74, 'Lune', 'g = 1,62 m/s²', '#eceff2', GREY, 'T = ?']].forEach(function (c, i) {
      var pv = { x: c[0], y: H * .12 }, L = H * .5; ph5_pend(pv.x, pv.y, L, .45, 14, i ? ORA2 : BLUE); ph5_pend(pv.x, pv.y, L, -.45, 14, '#c5ccd4');
      DOT(c[0], H * .86, 15, c[3]); ph_circ(c[0], H * .86, 15, c[4]); TB(c[1], c[0] + 22, H * .87 - 5, INK, 15, 'left'); TB(c[2], c[0], H * .96, GREY, 13);
      TB(i && p > 0 ? 'T ≈ 4,9 s' : c[5], c[0], H * .72, i && p > 0 ? DRED : DGREEN, 19);
    });
    ph_fade(p, 0, function () { tag('T ∝ 1/√g', W * .5, H * .38, DRED, 17); });
  },
  /* 5 · énergie d'un oscillateur : parabole */
  function (p) {
    var x0 = W * .5, y0 = H * .84, kx = W * .4 / 7, ky = H * .62 / .45, X = function (x) { return x0 + x * kx; }, Y = function (e) { return y0 - e * ky; };
    ph_axes(x0 - W * .46, y0, W * .94, H * .72, 'x (cm)', 'E (J)'); LN(x0, y0 + 6, x0, y0 - H * .72, INK, 1.2);
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); for (var x = -6.6; x <= 6.61; x += .2) { var e = .5 * 200 * x * x * 1e-4; x === -6.6 ? ctx.moveTo(X(x), Y(e)) : ctx.lineTo(X(x), Y(e)); } ctx.stroke(); TB('Ep = ½kx²', X(4.7), Y(.42), ORANGE, 14, 'left');
    TB('−6', X(-6), y0 + 17, INK, 12); TB('+6', X(6), y0 + 17, INK, 12); TB('3', X(3), y0 + 17, INK, 12);
    ph_fade(p, 0, function () { LN(X(-6.6), Y(.36), X(6.6), Y(.36), DGREEN, 2.2, [6, 4]); TB('E = 0,36 J', X(-6.4), Y(.36) - 7, DGREEN, 14, 'left');
      LN(X(3), Y(0), X(3), Y(.09), ORANGE, 5); LN(X(3), Y(.09), X(3), Y(.36), BLUE, 5); tag('Ec = 0,27 J', X(3) + 66, Y(.22), BLUE_D, 14); tag('v ≈ 1,04 m/s', X(-.2), Y(.22), DGREEN, 15); });
  },
  /* 6 · régimes d'amortissement */
  function (p) {
    var x0 = W * .1, y0 = H * .5, w = W * .84, h = H * .34, X = function (t) { return x0 + t / 9 * w; }, Y = function (v) { return y0 - v * h; };
    ph_axes(x0, y0, w + 6, h + 18, 't', 'x'); LN(x0, y0, x0, y0 + h * .55, INK, 1.8);
    var curves = [[function (t) { return Math.exp(-.28 * t) * Math.cos(2.4 * t); }, BLUE, 'faible : oscille', 0], [function (t) { return (1 + t) * Math.exp(-t); }, GREEN, 'critique', 1], [function (t) { var r1 = -.268, r2 = -3.73; return (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1); }, ORA2, 'fort : lent', 2]];
    curves.forEach(function (c) { var hi = c[3] === 1 && p > 0; ctx.strokeStyle = c[1]; ctx.lineWidth = hi ? 5 : 2.6; ctx.globalAlpha = (p > 0 && !hi) ? .45 : 1; ctx.beginPath(); for (var t = 0; t <= 9; t += .05) { t ? ctx.lineTo(X(t), Y(c[0](t))) : ctx.moveTo(X(t), Y(c[0](t))); } ctx.stroke(); ctx.globalAlpha = 1; });
    TB('faible : oscille', X(4.2), Y(-.62), BLUE_D, 13, 'left'); TB('fort : lent', X(6.8), Y(.38), ORANGE, 13, 'left');
    ph_fade(p, 0, function () { tag('critique : retour le plus rapide', W * .6, H * .1, DGREEN, 15); });
  },
  /* 7 · grand angle : 60° */
  function (p) {
    var pv = { x: W * .38, y: H * .08 }, L = H * .68, th = Math.PI / 3, B = ph5_pend(pv.x, pv.y, L, th, 17, BLUE);
    ctx.strokeStyle = GREY; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(pv.x, pv.y); ctx.lineTo(pv.x, pv.y + L + 10); ctx.stroke(); ctx.setLineDash([]); ph_arc(pv.x, pv.y, 58, Math.PI / 2, Math.PI / 2 - th, INK, 2); TB('60°', pv.x + 34, pv.y + 76, INK, 15);
    ctx.strokeStyle = '#cbd3dc'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(pv.x, pv.y, L, Math.PI / 2 - th, Math.PI / 2 + th); ctx.stroke(); ctx.setLineDash([]);
    ph_dim(pv.x + Math.cos(th) * 30, pv.y - Math.sin(th) * 30, B.x + Math.cos(th) * 30, B.y - Math.sin(th) * 30, 'L = 2,00 m', GREY, 0);
    ph_fade(p, 0, function () { tag('formule : 2,84 s', W * .8, H * .3, ORA2, 15); tag('réelle ≈ 3,04 s', W * .8, H * .5, DRED, 17); tag('+7,3 %', W * .8, H * .68, INK, 15); });
  },
  /* 8 · passerelle : résonance, Q = 50 puis Q = 10 */
  function (p) {
    var x0 = W * .1, y0 = H * .82, w = W * .84, h = H * .62, X = function (f) { return x0 + (f - .5) / 1 * w; }, Y = function (a) { return y0 - a / 50 * h; };
    ph_axes(x0, y0, w + 6, h + 10, 'f (Hz)', 'amplitude'); var f0 = .955;
    var amp = function (f, Q) { var r = f / f0; return 1 / Math.sqrt((1 - r * r) * (1 - r * r) + r * r / (Q * Q)); };
    var drw = function (Q, col, lw) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); for (var f = .5; f <= 1.5; f += .002) { f === .5 ? ctx.moveTo(X(f), Y(amp(f, Q))) : ctx.lineTo(X(f), Y(amp(f, Q))); } ctx.stroke(); };
    drw(50, BLUE, 3); LN(X(.95), y0, X(.95), y0 - h - 6, DRED, 2, [5, 4]); TB('0,95 Hz (foule)', X(.95) - 8, y0 - h + 8, DRED, 13, 'right'); TB('f₀ = 0,955 Hz', X(.955) + 10, y0 + 17, INK, 13, 'left');
    ph_fade(p, 0, function () { drw(10, GREEN, 3); tag('Q = 50', X(1.2), Y(16), BLUE_D, 15); tag('Q = 10 : ÷ 5', X(1.2), Y(9), DGREEN, 15); });
  },
  /* 9 · mesurer l'amortissement : 10 cm → 5 cm en 4 s */
  function (p) {
    var x0 = W * .1, y0 = H * .5, w = W * .86, h = H * .34, X = function (t) { return x0 + t / 10 * w; }, Y = function (v) { return y0 - v / 10 * h; };
    ph_axes(x0, y0, w + 6, h + 18, 't (s)', 'x (cm)'); LN(x0, y0, x0, y0 + h + 10, INK, 1.8);
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath(); for (var t = 0; t <= 10; t += .03) { var v = 10 * Math.exp(-.1733 * t) * Math.cos(2 * Math.PI * t); t ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); } ctx.stroke();
    DOT(X(0), Y(10), 5, ORA2); DOT(X(4), Y(5), 5, ORA2); TB('10 cm', X(0) + 8, Y(10) - 6, ORA2, 13, 'left'); TB('5,0 cm', X(4), Y(5) - 10, ORA2, 13); LN(X(4), y0 - 6, X(4), y0 + 6, GREY, 1.5); TB('4,0 s', X(4), y0 + 22, INK, 12);
    ph_fade(p, 0, function () { ctx.strokeStyle = ORA2; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); for (var t = 0; t <= 10; t += .1) { var v = 10 * Math.exp(-.1733 * t); t ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); } ctx.stroke(); ctx.setLineDash([]); DOT(X(10), Y(1.77), 5, DRED); TB('1,8 cm', X(10) - 4, Y(1.77) - 12, DRED, 13, 'right');
      tag('γ ≈ 0,173 s⁻¹ · b ≈ 0,173 kg/s', W * .55, H * .86, DGREEN, 14); tag('75 % de l’énergie perdue en 4 s', W * .55, H * .96, INK, 13); });
  }
]);
