/* Physique 6e · chapitre 9 : atome, noyau et radioactivité (aides : theo-01, 02, 06) */
function ph9_lev(x0, x1, y, lab, col, val) { LN(x0, y, x1, y, col || INK, 3); TB(lab, x0 - 8, y + 4, col || INK, 13, 'right'); if (val) TB(val, x1 + 8, y + 4, col || INK, 13, 'left'); }
function ph9_decayCurve(gx, gy, gw, gh, tmax, T, col) { ctx.strokeStyle = col || BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); for (var i = 0; i <= 120; i++) { var t = tmax * i / 120, v = Math.pow(.5, t / T); i ? ctx.lineTo(gx + gw * i / 120, gy - gh * v) : ctx.moveTo(gx, gy - gh * v); } ctx.stroke(); }
function ph9_nuc(x, y, r, a, z) { /* petit noyau : A en haut, Z en bas */ DOT(x, y, r, '#fdece4'); ctx.strokeStyle = ORA2; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); }

SFA.theo("c09", {
  icon: function () {
    TB('N = N₀·(½)^(t/T)', W * .5, H * .3, BLUE_D, 28); var cx = W * .3, cy = H * .72; DOT(cx, cy, 8, ORA2); ph_circ(cx, cy, 26, GREY); ph_circ(cx, cy, 46, GREY); DOT(cx + 26, cy, 4, BLUE_D); DOT(cx - 33, cy - 32, 4, BLUE_D); TB('Eₙ = −13,6/n²', W * .66, H * .76, ORANGE, 20);
  },
  sub: [
    { t: "Modèle de Bohr de l'hydrogène",
      anim: function (t) {
        var tr = [[3, 2], [2, 1], [4, 2], [1, 3]], k = Math.floor(t / 240) % tr.length, s = (t % 240) / 240, a = tr[k][0], b = tr[k][1];
        var lx0 = W * .08, lx1 = W * .38, y0 = H * .1, y1 = H * .88, Y = function (E) { return y0 + (y1 - y0) * (-E) / 13.6 * .96; };
        for (var n = 1; n <= 5; n++) { var E = -13.6 / (n * n); var hl = n === a || n === b; ph9_lev(lx0, lx1, Y(E), (hl || n < 4) ? 'n=' + n : '', hl ? DRED : GREY, (hl || n < 4) ? (E.toFixed(2)).replace('.', ',') + ' eV' : ''); }
        LN(lx0, Y(0), lx1, Y(0), GREY, 1.2, [4, 4]); TB('0', lx0 - 8, Y(0) + 4, GREY, 12, 'right');
        var m = s < .35 ? 0 : s < .6 ? (s - .35) / .25 : 1, ya = Y(-13.6 / (a * a)), yb = Y(-13.6 / (b * b)), ye = ya + (yb - ya) * m; DOT((lx0 + lx1) / 2, ye - 8, 6, BLUE_D);
        var cx = W * .72, cy = H * .5; for (n = 1; n <= 4; n++) ph_circ(cx, cy, 16 * n, n === a || n === b ? DRED : '#cfd6dd'); DOT(cx, cy, 5, ORA2);
        var ra = 16 * a, rb = 16 * b, r = ra + (rb - ra) * m, ang = t * .08 / (1 + .0 * r); DOT(cx + r * Math.cos(ang), cy + r * Math.sin(ang), 6, BLUE_D);
        var dE = Math.abs(-13.6 / (a * a) + 13.6 / (b * b)), em = a > b; if (s > .6) { var lam = 1240 / dE; tag((em ? 'photon émis' : 'photon absorbé') + ' : ' + dE.toFixed(2).replace('.', ',') + ' eV → ' + Math.round(lam) + ' nm', W * .55, H * .07, em ? DGREEN : ORANGE, 14); if (em) ph6_string(cx + 70, cx + 130, cy + 80 + 0 * 1, 10, 22, t * .2, DGREEN, 3); }
        TB(a + ' → ' + b, W * .55, H * .93, INK, 16);
      },
      th: '<div class="tcard"><b class="h">Niveaux d\'énergie</b><p>Dans le modèle de Bohr, l\'électron de l\'hydrogène ne peut occuper que certains niveaux : <b>E<sub>n</sub> = −13,6 eV/n²</b> (n = 1, 2, 3…). E₁ = −13,6 eV (état fondamental), E₂ = −3,40 eV, E₃ = −1,51 eV, E₄ = −0,85 eV ; E = 0 correspond à l\'atome ionisé. L\'énergie est <b>quantifiée</b>.</p></div>' +
        '<div class="tcard"><b class="h">Émission et absorption</b><p>En passant d\'un niveau n à un niveau p, l\'atome émet (n &gt; p) ou absorbe (n &lt; p) un photon d\'énergie <b>ΔE = |E<sub>n</sub> − E<sub>p</sub>| = h·f = h·c/λ</b>, soit <b>λ(nm) = 1 240/ΔE(eV)</b>. 4 → 2 : ΔE = 2,55 eV, λ ≈ 486 nm (visible, série de Balmer). 1 → 3 : il faut exactement 12,1 eV (λ ≈ 103 nm, UV) ; un photon rouge de 1,89 eV ne peut pas exciter l\'atome depuis n = 1.</p></div>' +
        '<div class="tcard"><b class="h">Limites</b><p>Seul le photon dont l\'énergie est <b>exactement</b> égale à un écart de niveaux est absorbé (sauf pour ioniser, où toute énergie supérieure convient). Le modèle de Bohr marche pour l\'hydrogène ; la mécanique quantique le remplace pour les autres atomes.</p></div>' },
    { t: "Rayonnements α, β, γ et protection",
      anim: function (t) {
        var y = H * .5, sx = W * .08; ph6_rr(sx - 22, y - 30, 44, 60, '#fdf6e8', ORANGE, 2.4); TB('source', sx, y + 50, ORANGE, 12);
        var xs = [W * .3, W * .5, W * .7], names = ['papier', 'aluminium (mm)', 'plomb (cm)'], cols = ['#d8c9a0', '#9aa7b5', '#555'], th = [4, 9, 18];
        for (var i = 0; i < 3; i++) { ctx.fillStyle = cols[i]; ctx.fillRect(xs[i] - th[i] / 2, y - 68, th[i], 136); TB(names[i], xs[i], y + 90, INK, 12); }
        var lanes = [[y - 38, 'α', RED, xs[0]], [y, 'β', BLUE, xs[1]], [y + 38, 'γ', GREEN, xs[2] + 8]];
        lanes.forEach(function (l, i) { LN(sx + 24, l[0], W * .95, l[0], '#e6e9ec', 1, [3, 4]); TB(l[1], W * .96, l[0] + 5, l[2], 16, 'left'); for (var k = 0; k < 4; k++) { var u = ((t * .006 + k / 4) % 1) * (W * .95 - sx - 24); var x = sx + 24 + u; if (x < l[3] - (l[3] === xs[2] + 8 ? 0 : 0)) DOT(x, l[0], 5, l[2]); else if (i === 2 && x < xs[2] + 8) { DOT(x, l[0], 5, l[2]); } else if (i === 2) DOT(x, l[0], 3, l[2]); } });
        tag('α : arrêtée par une feuille', xs[0] + 30, H * .08, DRED, 12); tag('β : arrêtée par quelques mm d\'Al', W * .55, H * .2, BLUE_D, 12); tag('γ : atténuée par le plomb, jamais arrêtée', W * .66, H * .93, DGREEN, 12);
      },
      th: '<div class="tcard"><b class="h">Les trois rayonnements</b><p><b>α</b> : noyau d\'hélium ⁴₂He (2 protons + 2 neutrons), très ionisant, arrêté par une feuille de papier ou la peau. <b>β<sup>−</sup></b> : électron (un neutron devient proton), arrêté par quelques mm d\'aluminium. <b>γ</b> : photon très énergétique émis par un noyau excité, très pénétrant, atténué par le plomb ou le béton. Les neutrons, eux, sont arrêtés par l\'eau ou le béton.</p></div>' +
        '<div class="tcard"><b class="h">Équations de désintégration</b><p>On conserve le nombre de nucléons A et la charge Z. <b>α</b> : ᴬ<sub>Z</sub>X → ᴬ⁻⁴<sub>Z−2</sub>Y + ⁴₂He ; radium 226 (Z = 88) → radon 222 (Z = 86) + α. <b>β<sup>−</sup></b> : ᴬ<sub>Z</sub>X → ᴬ<sub>Z+1</sub>Y + e<sup>−</sup> + antineutrino. Les noyaux fils sont souvent eux-mêmes radioactifs (chaînes).</p></div>' +
        '<div class="tcard"><b class="h">Protection</b><p>Trois moyens : <b>temps</b> d\'exposition court, <b>distance</b> (la dose varie comme 1/d² : de 1 à 4 m, ÷16) et <b>écran</b>. Chaque épaisseur de demi-atténuation divise l\'intensité par 2 : 400 → 25 µSv/h demande 4 demi-épaisseurs, soit 4 × 0,86 = 3,4 cm de plomb ou 4 × 4,7 ≈ 19 cm de béton. 25 µSv/h pendant 8 h : 0,20 mSv. Distingue <b>irradiation</b> (exposition à un rayonnement venu de l\'extérieur) et <b>contamination</b> (la substance radioactive est sur ou dans la personne : il faut la retirer).</p></div>' +
        '<div class="tcard"><b class="h">Fission et fusion</b><p>Fission : un noyau lourd (uranium 235) capturant un neutron se scinde en deux noyaux plus légers en libérant de l\'énergie (centrales nucléaires). Fusion : deux noyaux légers (hydrogène) fusionnent en un noyau plus lourd (hélium), source d\'énergie des étoiles. Dans les deux cas, la masse diminue et l\'énergie libérée est E = Δm·c².</p></div>' },
    { t: "Décroissance et demi-vie",
      anim: function (t) {
        var T = 100, tt = (t % 620) / 620 * 5.2 * T, n = 100, gx = W * .5, cols = 10, x0 = W * .06, y0 = H * .14, dx = W * .037, alive = 0;
        for (var i = 0; i < n; i++) { var u = ((i + .5) / n), td = -T * Math.log(1 - u * .995) / Math.LN2 * 1; var al = tt < td, cx = x0 + (i % cols) * dx * 1.5, cy = y0 + Math.floor(i / cols) * (H * .075); DOT(cx, cy, 7, al ? ORA2 : '#e1e4e8'); if (al) alive++; }
        var px = W * .56, py = H * .86, pw = W * .38, ph = H * .66; ph_axes(px, py, pw + 8, ph + 12, 't', 'N/N₀'); ph9_decayCurve(px, py, pw, ph, 5, 1, '#cfd6dd'); ctx.save(); ctx.beginPath(); ctx.rect(px, 0, pw * tt / (5 * T) , H); ctx.clip(); ph9_decayCurve(px, py, pw, ph, 5, 1, BLUE); ctx.restore();
        for (var k = 1; k <= 4; k++) { LN(px + pw * k / 5, py - 4, px + pw * k / 5, py + 4, INK, 1.5); TB(k + 'T', px + pw * k / 5, py + 17, INK, 11); TB(['50 %', '25 %', '12,5 %', '6,3 %'][k - 1], px + pw * k / 5 + 4, py - ph * Math.pow(.5, k) - 6, GREY, 11, 'left'); }
        DOT(px + pw * tt / (5 * T), py - ph * Math.pow(.5, tt / T), 6, ORA2); TB('N = ' + alive + ' noyaux', W * .06 + 60, H * .95, DRED, 15); TB('N = N₀·(½)^(t/T)', W * .75, H * .08, BLUE_D, 16);
      },
      th: '<div class="tcard"><b class="h">Une loi statistique</b><p>La désintégration d\'un noyau est <b>aléatoire</b>, mais pour un grand nombre N de noyaux le nombre qui se désintègrent par seconde est proportionnel à N. La <b>demi-vie T</b> (T<sub>½</sub>) est la durée au bout de laquelle la moitié des noyaux se sont désintégrés. Elle ne dépend ni de la température, ni de l\'état chimique, ni de la quantité.</p></div>' +
        '<div class="tcard"><b class="h">Loi de décroissance</b><p><b>N(t) = N₀·(½)<sup>t/T</sup> = N₀·e<sup>−λt</sup></b> avec la constante radioactive <b>λ = ln 2/T</b>. Après 1, 2, 3 demi-vies : 50 %, 25 %, 12,5 %. Iode 131 (T = 8,0 j), 80 mg : 40 mg à 8 j, 10 mg à 24 j, 2,5 mg à 40 j. Pour une fraction f restante : t = T·log₂(1/f).</p></div>' +
        '<div class="tcard"><b class="h">Activité</b><p>L\'<b>activité</b> A = λ·N (becquerels : 1 Bq = 1 désintégration/s) suit la même loi : A = A₀·(½)<sup>t/T</sup>. 4,0 MBq d\'iode 131 : A(20 j) = 4,0 × 2<sup>−2,5</sup> ≈ 0,71 MBq ; elle tombe à 1 % après T·log₂(100) ≈ 53 j. λ = ln 2/(8,0 × 86 400 s) ≈ 1,0·10<sup>−6</sup> s<sup>−1</sup>, donc N₀ = A₀/λ ≈ 4,0·10<sup>12</sup> noyaux.</p></div>' +
        '<div class="tcard"><b class="h">Datation au carbone 14</b><p>Le ¹⁴C (T = 5 730 ans) est renouvelé chez les êtres vivants, puis décroît après la mort. 12,5 % restant = 3 demi-vies = 17 190 ans ; 30 % restant : t = 5 730 × log₂(1/0,30) ≈ 9 950 ans ; après 2 000 ans il reste 0,5<sup>2000/5730</sup> ≈ 78,5 %. La méthode est fiable jusqu\'à environ 50 000 ans.</p></div>' }
  ]
});

SFA.figs("c09", [
  /* 1 niveaux de l'hydrogène */
  function (p) {
    var x0 = W * .3, x1 = W * .62, y0 = H * .1, y1 = H * .9, Y = function (E) { return y0 + (y1 - y0) * (-E) / 13.6 * .94; }; LN(x0, Y(0), x1, Y(0), GREY, 1.2, [4, 4]); TB('0 (ionisé)', x0 - 8, Y(0) + 4, GREY, 12, 'right');
    for (var n = 1; n <= 4; n++) ph9_lev(x0, x1, Y(-13.6 / (n * n)), n === 4 ? '' : 'n = ' + n, n === 2 || n === 3 ? DRED : GREY, n === 1 ? '−13,6 eV' : '');
    ph_fade(p, 0, function () { TB('−3,40 eV', x1 + 8, Y(-3.4) + 4, DRED, 15, 'left'); TB('−1,51 eV', x1 + 8, Y(-1.51) + 4, DRED, 15, 'left'); tag('Eₙ = −13,6/n²', W * .78, H * .5, DGREEN, 16); });
  },
  /* 2 deux demi-vies */
  function (p) {
    var gx = W * .12, gy = H * .84, gw = W * .76, gh = H * .6; ph_axes(gx, gy, gw + 8, gh + 12, '', 'N/N₀'); TB('t (jours)', gx + gw, gy + 32, INK, 13, 'right'); ph9_decayCurve(gx, gy, gw, gh, 20, 10, BLUE);
    [0, 10, 20].forEach(function (d) { TB(d, gx + gw * d / 20, gy + 16, INK, 12); }); DOT(gx, gy - gh, 5, ORA2); TB('100 %', gx + 40, gy - gh - 2, ORANGE, 13, 'left'); DOT(gx + gw / 2, gy - gh / 2, 5, ORA2); TB('50 %', gx + gw / 2 + 8, gy - gh / 2 - 8, ORANGE, 13, 'left');
    ph_fade(p, 0, function () { DOT(gx + gw, gy - gh / 4, 7, DRED); LN(gx, gy - gh / 4, gx + gw, gy - gh / 4, '#cfd6dd', 1.2, [3, 4]); tag('20 j = 2 T : 25 %', gx + gw - 70, gy - gh / 4 - 22, DRED, 17); });
  },
  /* 3 Balmer */
  function (p) {
    var x0 = W * .22, x1 = W * .6, y0 = H * .1, y1 = H * .9, Y = function (E) { return y0 + (y1 - y0) * (-E) / 13.6 * .94; }; for (var n = 1; n <= 5; n++) ph9_lev(x0, x1, Y(-13.6 / (n * n)), n === 3 || n === 5 ? '' : 'n = ' + n, n === 4 || n === 2 ? DRED : GREY, '');
    A((x0 + x1) / 2 - 30, Y(-.85), 0, Y(-3.4) - Y(-.85) - 8, DRED, '', 3.2); TB('4 → 2', (x0 + x1) / 2 - 40, (Y(-.85) + Y(-3.4)) / 2, DRED, 15, 'right');
    ph_fade(p, 0, function () { ph6_string(x1 + 6, W * .93, Y(-2.1), 9, 18, 0, '#2aa7c9', 3); tag('ΔE = 2,55 eV', W * .8, H * .3, DGREEN, 16); tag('λ = 1 240/2,55 ≈ 486 nm : visible', W * .62, H * .93, DGREEN, 14); });
  },
  /* 4 iode 131 */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .78, gh = H * .6; ph_axes(gx, gy, gw + 8, gh + 12, '', 'm (mg)'); TB('t (j)', gx + gw, gy + 32, INK, 13, 'right'); ph9_decayCurve(gx, gy, gw, gh, 40, 8, BLUE); var X = function (d) { return gx + gw * d / 40; }, Y = function (m) { return gy - gh * m / 80; };
    [0, 8, 16, 24, 32, 40].forEach(function (d) { TB(d, X(d), gy + 16, INK, 11); }); DOT(X(0), Y(80), 5, ORA2); TB('80 mg', X(0) + 40, Y(80) - 2, ORANGE, 13, 'left');
    ph_fade(p, 0, function () { [[24, 10], [40, 2.5]].forEach(function (a) { DOT(X(a[0]), Y(a[1]), 6, DRED); LN(X(a[0]), gy, X(a[0]), Y(a[1]), GREY, 1.2, [3, 4]); }); tag('24 j : 10 mg', X(24), Y(10) - 22, DRED, 15); tag('40 j : 2,5 mg', X(40) - 40, Y(2.5) - 28, DRED, 15); });
  },
  /* 5 désintégration α du radium */
  function (p) {
    var y = H * .5; ph6_rr(W * .06, y - 36, 100, 72, '#fdece4', ORA2, 2.4); TB('²²⁶₈₈Ra', W * .06 + 50, y + 8, DRED, 22); A(W * .06 + 110, y, 46, 0, GREY, '', 3);
    ph_fade(p, 0, function () { ph6_rr(W * .46, y - 36, 100, 72, '#e9f7ef', DGREEN, 2.4); TB('?Rn', W * .46 + 50, y + 8, DGREEN, 22); TB('+', W * .46 + 118, y + 8, INK, 22); ph6_rr(W * .765, y - 28, 84, 56, '#eef4fb', BLUE_D, 2.4); TB('⁴₂He (α)', W * .765 + 42, y + 8, BLUE_D, 18); tag('226 − 4 = 222 ; 88 − 2 = 86', W * .5, H * .85, DGREEN, 16); tag('radon 222 (Z = 86)', W * .5, H * .18, DGREEN, 16); });
    TB('A et Z conservés', W * .5, H * .08, GREY, 14);
  },
  /* 6 exciter l'hydrogène */
  function (p) {
    var x0 = W * .22, x1 = W * .56, y0 = H * .1, y1 = H * .9, Y = function (E) { return y0 + (y1 - y0) * (-E) / 13.6 * .94; }; for (var n = 1; n <= 4; n++) ph9_lev(x0, x1, Y(-13.6 / (n * n)), n === 4 ? '' : 'n = ' + n, n === 1 || n === 3 ? DRED : GREY, '');
    A((x0 + x1) / 2, Y(-13.6) - 6, 0, -(Y(-13.6) - Y(-1.51)) + 12, DRED, '', 3.2); ph6_string(W * .64, W * .94, Y(-5), 9, 16, 0, '#7F77DD', 3);
    ph_fade(p, 0, function () { tag('ΔE = 12,1 eV', W * .8, H * .24, DGREEN, 16); tag('λ ≈ 103 nm (UV)', W * .8, H * .42, DGREEN, 15); tag('rouge 1,89 eV : non', W * .8, H * .84, DRED, 14); });
  },
  /* 7 datation carbone 14 */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .78, gh = H * .6; ph_axes(gx, gy, gw + 8, gh + 12, 't (années)', '¹⁴C restant'); ph9_decayCurve(gx, gy, gw, gh, 20000, 5730, BLUE); var X = function (t) { return gx + gw * t / 20000; }, Y = function (v) { return gy - gh * v; };
    DOT(X(2000), Y(.785), 5, ORA2); TB('2 000 ans : 78,5 %', X(2000) + 8, Y(.785) - 10, ORANGE, 13, 'left');
    ph_fade(p, 0, function () { DOT(X(17190), Y(.125), 6, DRED); LN(X(17190), gy, X(17190), Y(.125), GREY, 1.2, [3, 4]); tag('12,5 % : 17 190 ans', X(17190) - 40, Y(.125) - 24, DRED, 14); DOT(X(9950), Y(.3), 6, DGREEN); LN(X(9950), gy, X(9950), Y(.3), GREY, 1.2, [3, 4]); tag('30 % : ≈ 9 950 ans', X(9950) + 56, Y(.3) - 18, DGREEN, 14); });
  },
  /* 8 contamination ou irradiation */
  function (p) {
    pers(W * .3, H * .78, 110, BLUE_D, 1, ''); for (var i = 0; i < 9; i++) DOT(W * .3 - 22 + (i * 37) % 44, H * .78 - 100 + (i * 23) % 80, 3, DRED);
    ph_fade(p, 0, function () { for (var k = 0; k < 6; k++) { var a = k * 1.04; A(W * .3 + 18 * Math.cos(a), H * .54 + 18 * Math.sin(a), 38 * Math.cos(a), 38 * Math.sin(a), '#e8a07c', '', 1.8); } tag('contaminé : poudre sur lui', W * .68, H * .3, DRED, 15); tag('à retirer : vêtements, douche', W * .68, H * .56, DGREEN, 14); });
    TB('irradié = source à distance', W * .5, H * .08, GREY, 13); TB('contaminé = source sur soi', W * .5, H * .93, INK, 14);
  },
  /* 9 blindage gamma */
  function (p) {
    var y = H * .5; ph6_rr(W * .04, y - 22, 42, 44, '#fdf6e8', ORANGE, 2.2); TB('γ', W * .04 + 21, y + 7, GREEN, 20); LN(W * .04 + 44, y, W * .95, y, '#e6e9ec', 1.5, [3, 4]); TB('400 µSv/h à 1 m', W * .26, y - 38, INK, 14);
    ctx.fillStyle = '#666'; ctx.fillRect(W * .42, y - 60, 14, 120); TB('plomb 3,4 cm', W * .42 + 7, y + 82, INK, 13); ctx.fillStyle = '#bbb'; ctx.fillRect(W * .6, y - 60, 40, 120); TB('béton 19 cm', W * .6 + 20, y + 82, INK, 13);
    ph_fade(p, 0, function () { tag('25 µSv/h', W * .88, y - 20, DGREEN, 15); tag('4 demi-épaisseurs : ÷ 16', W * .5, H * .12, DGREEN, 15); tag('sans écran : 4,0 m · 8 h : 0,20 mSv', W * .5, H * .93, DRED, 14); });
  },
  /* 10 activité de l'iode 131 */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .78, gh = H * .6; ph_axes(gx, gy, gw + 8, gh + 12, '', 'A (MBq)'); TB('t (j)', gx + gw, gy + 22, INK, 13, 'right'); ph9_decayCurve(gx, gy, gw, gh, 60, 8, BLUE); var X = function (d) { return gx + gw * d / 60; }, Y = function (a) { return gy - gh * a / 4; };
    DOT(X(0), Y(4), 5, ORA2); TB('4,0 MBq', X(0) + 40, Y(4) - 2, ORANGE, 13, 'left'); ph_fade(p, 0, function () { DOT(X(20), Y(.707), 6, DRED); LN(X(20), gy, X(20), Y(.707), GREY, 1.2, [3, 4]); tag('20 j : 0,71 MBq', X(20) + 40, Y(.707) - 30, DRED, 14); DOT(X(53.2), Y(.04), 6, DGREEN); tag('1 % à ≈ 53 j', X(53.2) - 20, Y(.04) - 30, DGREEN, 14); tag('λ ≈ 1,0·10⁻⁶ s⁻¹ · N₀ ≈ 4,0·10¹²', W * .5, H * .08, BLUE_D, 14); });
  }
]);
