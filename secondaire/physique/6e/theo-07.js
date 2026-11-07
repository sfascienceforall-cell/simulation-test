/* Physique 6e · chapitre 7 : le son (aides : theo-01, theo-02 et theo-06) */
function ph7_pipe(x0, x1, y, h, closedR, col) { ctx.strokeStyle = col || INK; ctx.lineWidth = 3; LN(x0, y - h / 2, x1, y - h / 2, col || INK, 3); LN(x0, y + h / 2, x1, y + h / 2, col || INK, 3); if (closedR) LN(x1, y - h / 2, x1, y + h / 2, col || INK, 5); }
function ph7_spk(x, y, s) { ph6_rr(x - s * .35, y - s * .5, s * .5, s, '#eef4fb', BLUE_D, 2); ctx.fillStyle = BLUE_D; ctx.beginPath(); ctx.moveTo(x + s * .15, y - s * .2); ctx.lineTo(x + s * .6, y - s * .55); ctx.lineTo(x + s * .6, y + s * .55); ctx.lineTo(x + s * .15, y + s * .2); ctx.closePath(); ctx.fill(); }
function ph7_stdwave(x0, x1, y, A0, n, c, col, open0) { /* n demi-fuseaux, extrémité gauche ouverte (ventre) si open0 */ ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); for (var x = x0; x <= x1; x += 2) { var u = (x - x0) / (x1 - x0), Y = y - A0 * c * (open0 ? Math.cos(n * PI * u) : Math.sin(n * PI * u)); x === x0 ? ctx.moveTo(x, Y) : ctx.lineTo(x, Y); } ctx.stroke(); }

SFA.theo("c07", {
  icon: function () {
    TB('L = 10·log(I/I₀)', W * .5, H * .34, BLUE_D, 28); ph6_string(W * .08, W * .92, H * .72, H * .1, W * .2, 0, ORANGE, 3.4); ph6_string(W * .08, W * .92, H * .72, H * .1, W * .2, 0, 'rgba(0,0,0,0)', 0); TB('dB', W * .5, H * .94, GREY, 14);
  },
  sub: [
    { t: "Hauteur, intensité, niveau sonore",
      anim: function (t) {
        var k = .5 + .5 * Math.sin(t * .01), f = 1.3 + 1.2 * (.5 + .5 * Math.sin(t * .006 + 2)), amp = H * (.06 + .12 * k), x0 = W * .05, w = W * .55, y = H * .4;
        LN(x0, y, x0 + w, y, '#d9dde1', 1.2, [4, 4]); ctx.strokeStyle = BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); for (var x = 0; x <= w; x += 2) { var Y = y - amp * Math.sin(2 * PI * f * x / (w * .5) - t * .15); x ? ctx.lineTo(x0 + x, Y) : ctx.moveTo(x0 + x, Y); } ctx.stroke();
        TB('hauteur : f = ' + Math.round(f * 220) + ' Hz (aigu si f grand)', x0 + w / 2, H * .1, ORANGE, 14); TB('intensité : amplitude', x0 + w / 2, H * .72, DRED, 14);
        var gx = W * .7, gy = H * .88, gh = H * .74, dB = 20 + 100 * k; LN(gx, gy, gx, gy - gh, GREY, 2); for (var d = 0; d <= 120; d += 20) { var yy = gy - gh * d / 120; LN(gx - 4, yy, gx + 4, yy, GREY, 1.4); TB(d, gx - 8, yy + 4, GREY, 11, 'right'); }
        ctx.fillStyle = dB > 85 ? RED : GREEN; ctx.fillRect(gx + 14, gy - gh * dB / 120, 34, gh * dB / 120); TB(Math.round(dB) + ' dB', gx + 31, gy - gh * dB / 120 - 8, dB > 85 ? DRED : DGREEN, 14);
        TB('85 dB : seuil de danger', gx + 54, gy - gh * 85 / 120 + 4, DRED, 11, 'left'); TB('L = 10·log(I/I₀)', W * .33, H * .93, DGREEN, 16);
      },
      th: '<div class="tcard"><b class="h">Le son, une onde longitudinale</b><p>Un son est une onde de compression-dilatation qui a besoin d\'un milieu (pas de son dans le vide). Dans l\'air : <b>v ≈ 340 m/s</b> à 20 °C ; plus précisément <b>v = 331,3 + 0,606·θ</b> (θ en °C). Elle est plus grande dans l\'eau (≈ 1 500 m/s) et les solides. Un son pur a une période T, une fréquence f = 1/T et λ = v/T : T = 2,5 ms donne 400 Hz et 0,85 m. L\'oreille entend d\'environ <b>20 Hz à 20 kHz</b>.</p></div>' +
        '<div class="tcard"><b class="h">Hauteur, intensité, timbre</b><p>La <b>hauteur</b> est liée à la fréquence (grave = f petite, aigu = f grande). Le <b>volume</b> est lié à l\'<b>amplitude</b> et donc à l\'intensité I = P/S (en W/m²). Le <b>timbre</b> vient du spectre d\'harmoniques : une même note jouée par deux instruments a la même fréquence fondamentale mais pas le même spectre. Monter le volume ne change pas la fréquence.</p></div>' +
        '<div class="tcard"><b class="h">Niveau sonore</b><p><b>L = 10·log(I/I₀)</b> avec I₀ = 10<sup>−12</sup> W/m² (seuil d\'audition ≈ 0 dB). I = 10<sup>−6</sup> W/m² : 60 dB ; 85 dB correspond à 3,2·10<sup>−4</sup> W/m². Doubler l\'intensité ajoute <b>3 dB</b> : deux sources de 60 dB donnent 63 dB, pas 120 dB. En champ libre, I varie en 1/r² : <b>L = L₁ − 20·log r</b> (−6 dB quand la distance double). 100 dB à 1 m : 80 dB à 10 m ; avec 8 sources identiques, +9 dB.</p></div>' +
        '<div class="tcard"><b class="h">Bruit et santé</b><p>Au-delà de 85 dB, une exposition prolongée abîme les cellules ciliées de l\'oreille interne (dommage irréversible) ; la douleur apparaît vers 120-130 dB. Écho : l\'oreille sépare deux sons distants d\'au moins 0,1 s, donc une paroi à plus de 17 m ; si l\'écho revient 1,2 s après, d = v·t/2 = 204 m.</p></div>' },
    { t: "Effet Doppler",
      anim: function (t) {
        var c = 1.1, u = .42, cyc = 560, tc = t % cyc, y = H * .5, x0 = W * .08;
        for (var k = 0; k * 20 <= tc; k++) { var te = k * 20, xe = x0 + u * te, r = (tc - te) * c; ctx.strokeStyle = '#6aa3dc'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(xe, y, r, 0, 7); ctx.stroke(); }
        var xs = x0 + u * tc; ph6_rr(xs - 22, y - 11, 44, 22, '#fdece4', ORA2, 2.4); DOT(xs - 12, y + 13, 5, INK); DOT(xs + 12, y + 13, 5, INK); A(xs + 26, y, 36, 0, RED, '', 3); TB('v_s', xs + 52, y - 8, DRED, 13);
        DOT(W * .94, y, 7, BLUE_D); DOT(W * .04 + 0, y, 0, BLUE_D); TB('devant : λ raccourcie → f plus aiguë', W * .72, H * .1, DRED, 14); TB('derrière : λ allongée → f plus grave', W * .25, H * .93, BLUE_D, 14); tag('f′ = f·v/(v − v_s) (approche)', W * .55, H * .22, DGREEN, 15); tag('f′ = f·v/(v + v_s) (éloignement)', W * .55, H * .82, DGREEN, 15);
      },
      th: '<div class="tcard"><b class="h">Le phénomène</b><p>Quand une source sonore et un observateur sont en mouvement relatif, la fréquence perçue diffère de la fréquence émise. Source qui s\'approche : les fronts d\'onde sont comprimés devant elle, λ diminue et la fréquence perçue augmente (plus aigu) ; source qui s\'éloigne : plus grave.</p></div>' +
        '<div class="tcard"><b class="h">Formules (source mobile, observateur fixe)</b><p><b>f′ = f·v/(v − v<sub>s</sub>)</b> à l\'approche ; <b>f′ = f·v/(v + v<sub>s</sub>)</b> à l\'éloignement. Ambulance de 700 Hz à 72 km/h = 20 m/s (v = 340 m/s) : à l\'approche f′ = 700 × 340/320 ≈ 744 Hz ; à l\'éloignement f′ = 700 × 340/360 ≈ 661 Hz ; écart ≈ 83 Hz. La fréquence ne dépend pas de la distance, seulement de la vitesse relative.</p></div>' +
        '<div class="tcard"><b class="h">Source supersonique</b><p>Si v<sub>s</sub> &gt; v, les fronts forment un <b>cône de Mach</b> de demi-angle <b>sin α = v/v<sub>s</sub></b> et l\'onde de choc (le « bang ») est perçue au passage du cône. Mach 2 : α = 30°. À 8 000 m d\'altitude, le bang arrive quand l\'avion a déjà dépassé de h/tan α ≈ 13,9 km la verticale de l\'observateur (≈ 20 s plus tard).</p></div>' },
    { t: "Tuyaux sonores",
      anim: function (t) {
        var c = Math.cos(t * .12), x0 = W * .12, x1 = W * .88, A0 = H * .09;
        ph7_pipe(x0, x1, H * .27, H * .24, false); ph7_stdwave(x0, x1, H * .27, A0, 1, c, BLUE, true); TB('ouvert-ouvert : L = n·λ/2', W * .5, H * .08, BLUE_D, 14); TB('f₁ = v/(2L)', x1 + 6, H * .29, DGREEN, 14, 'left');
        ph7_pipe(x0, x1, H * .7, H * .24, true); ph7_stdwave(x0, x1, H * .7, A0, .5, c, RED, true); TB('ouvert-fermé : L = (2k−1)·λ/4', W * .5, H * .51, DRED, 14); TB('f₁ = v/(4L)', x1 + 6, H * .72, DGREEN, 14, 'left');
        TB('ventre au bout ouvert, nœud au bout fermé', W * .5, H * .95, GREY, 13);
      },
      th: '<div class="tcard"><b class="h">Ondes stationnaires dans l\'air</b><p>La colonne d\'air d\'un tuyau de longueur L vibre en onde stationnaire : <b>ventre de vibration à une extrémité ouverte, nœud à une extrémité fermée</b>. Les fréquences possibles sont discrètes.</p></div>' +
        '<div class="tcard"><b class="h">Tuyau ouvert aux deux bouts</b><p>L = n·λ/2, donc <b>f<sub>n</sub> = n·v/(2L)</b>, n = 1, 2, 3… (tous les harmoniques). Flûte de 0,60 m à 20 °C : v = 343 m/s, f₁ = 286 Hz, puis 572 Hz et 859 Hz. À 30 °C : v = 349 m/s, f₁ = 291 Hz, soit environ +30 cents : l\'instrument devient plus aigu quand il chauffe.</p></div>' +
        '<div class="tcard"><b class="h">Tuyau fermé à un bout</b><p>L = (2k − 1)·λ/4, donc <b>f = (2k − 1)·v/(4L)</b> : seuls les harmoniques <b>impairs</b> existent. Pour L = 0,60 m à 20 °C : f₁ = 143 Hz, puis 429 Hz et 715 Hz. À longueur égale, le fondamental d\'un tuyau ouvert est le <b>double</b> de celui d\'un tuyau fermé : 1 m ouvert → f₁ = v/2, 1 m fermé → v/4.</p></div>' }
  ]
});

SFA.figs("c07", [
  /* 1 fréquence et longueur d'onde */
  function (p) {
    var gx = W * .1, gy = H * .52, gw = W * .8, A0 = H * .22; ph_axes(gx, H * .86, gw + 8, H * .76, 't', 'p'); ph6_string(gx, gx + gw, H * .48, A0, gw / 2.4, 0, BLUE, 3.4); ph_dim(gx, H * .86 - 0, gx + gw / 2.4, H * .86 - 0, 'T = 2,5 ms', GREY, -16);
    ph_fade(p, 0, function () { tag('f = 1/T = 400 Hz', W * .5, H * .1, DGREEN, 18); tag('λ = v/f = 0,85 m', W * .5, H * .93, BLUE_D, 18); });
  },
  /* 2 plus fort, pas plus aigu */
  function (p) {
    var x0 = W * .08, w = W * .84; ph6_string(x0, x0 + w, H * .3, H * .08, w / 3, 0, BLUE, 3); LN(x0, H * .3, x0 + w, H * .3, '#e2e5e8', 1, [3, 4]); ph6_string(x0, x0 + w, H * .7, H * .08 + (p > 0 ? H * .1 * ph_a(p, 0, .5) : 0), w / 3, 0, RED, 3);
    TB('volume faible', x0 + 4, H * .13, BLUE_D, 14, 'left'); TB('volume plus fort', x0 + 4, H * .5, DRED, 14, 'left'); LN(x0, H * .7, x0 + w, H * .7, '#e2e5e8', 1, [3, 4]);
    ph_fade(p, .1, function () { tag('même période → même fréquence', W * .5, H * .92, DGREEN, 15); tag('amplitude ↑ → intensité ↑', W * .7, H * .5, DRED, 14); });
  },
  /* 3 l'écho */
  function (p) {
    var gy = H * .78, hx = W * .12, wx = W * .84; LN(W * .04, gy, W * .96, gy, INK, 2.2); pers(hx, gy, 60, BLUE_D, 1, ''); ctx.fillStyle = '#c9c4bb'; ctx.beginPath(); ctx.moveTo(wx, gy); ctx.lineTo(wx, H * .2); ctx.lineTo(W * .96, H * .24); ctx.lineTo(W * .96, gy); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    A(hx + 20, gy - 40, 140, 0, ORANGE, '', 3); A(wx - 6, gy - 28, -140, 0, RED, '', 3); TB('1,2 s aller-retour', W * .5, H * .13, INK, 15); ph_dim(hx, gy + 22, wx, gy + 22, 'd = ?', GREY, 0);
    ph_fade(p, 0, function () { tag('d = v·t/2 = 204 m', W * .5, H * .5, DGREEN, 17); tag('écho distinct si d > 17 m (0,1 s)', W * .5, H * .93, DRED, 14); });
  },
  /* 4 niveau et intensité */
  function (p) {
    var gx = W * .14, gy = H * .84, gw = W * .76, gh = H * .66; ph_axes(gx, gy, gw + 8, gh + 12, 'log I', 'L (dB)'); var X = function (e) { return gx + gw * (e + 12) / 12.5; }, Y = function (L) { return gy - gh * L / 100; };
    LN(X(-12), Y(0), X(0), Y(120), BLUE, 3); [[-6, 60], [-3.5, 85]].forEach(function (a) { DOT(X(a[0]), Y(a[1]), 5, ORA2); LN(gx, Y(a[1]), X(a[0]), Y(a[1]), '#cfd6dd', 1.2, [3, 4]); });
    TB('0 dB = 10⁻¹² W/m²', gx + 8, Y(0) - 8, GREY, 12, 'left'); TB('L = 10·log(I/I₀)', W * .5, H * .08, BLUE_D, 16);
    ph_fade(p, 0, function () { tag('10⁻⁶ W/m² → 60 dB', X(-6) + 10, Y(60) + 30, DGREEN, 15); tag('85 dB → 3,2·10⁻⁴ W/m²', X(-3.5) - 34, Y(85) - 14, DRED, 15); });
  },
  /* 5 deux sources de 60 dB */
  function (p) {
    ph7_spk(W * .14, H * .32, 40); ph7_spk(W * .14, H * .68, 40); DOT(W * .72, H * .5, 8, ORANGE); LN(W * .2, H * .32, W * .72, H * .5, '#b9cfe6', 2, [5, 4]); LN(W * .2, H * .68, W * .72, H * .5, '#b9cfe6', 2, [5, 4]); TB('60 dB chacune', W * .4, H * .2, BLUE_D, 15); TB('chaque enceinte : I', W * .4, H * .84, INK, 14);
    ph_fade(p, 0, function () { tag('2·I → +3 dB', W * .56, H * .5, DGREEN, 17); tag('60 + 3 = 63 dB (pas 120)', W * .5, H * .94, DRED, 17); });
  },
  /* 6 niveau et distance */
  function (p) {
    var gx = W * .12, gy = H * .84, gw = W * .78, gh = H * .66; ph_axes(gx, gy, gw + 8, gh + 12, 'r (m)', 'L (dB)'); var X = function (r) { return gx + gw * Math.log10(r) / 1.5; }, Y = function (L) { return gy - gh * (L - 60) / 45; };
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); for (var r = 1; r <= 31; r *= 1.06) { var L = 100 - 20 * Math.log10(r); r === 1 ? ctx.moveTo(X(r), Y(L)) : ctx.lineTo(X(r), Y(L)); } ctx.stroke();
    [1, 10].forEach(function (r) { DOT(X(r), Y(100 - 20 * Math.log10(r)), 5, ORA2); TB(r + ' m', X(r), gy + 16, INK, 12); }); TB('100 dB à 1 m', X(1) + 8, Y(100) - 8, ORANGE, 13, 'left'); TB('−6 dB par doublement de distance', W * .6, H * .1, BLUE_D, 14);
    ph_fade(p, 0, function () { DOT(X(10), Y(80), 6, DGREEN); tag('10 m : 80 dB', X(10) + 6, Y(80) - 16, DGREEN, 14); DOT(X(5.62), Y(85), 6, DRED); LN(gx, Y(85), X(5.62), Y(85), '#cfd6dd', 1.2, [3, 4]); tag('85 dB à 5,6 m', X(5.62) - 56, Y(85) - 16, DRED, 14); tag('8 sources à 20 m : 83 dB', W * .62, H * .93, BLUE_D, 14); });
  },
  /* 7 l'ambulance */
  function (p) {
    var y = H * .52, xs = W * .46; for (var k = 1; k <= 6; k++) { ctx.strokeStyle = '#8fb9e6'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(xs - k * 12 + 0, y, 16 * k - 0, 0, 7); ctx.stroke(); }
    ctx.fillStyle = '#fff'; ph6_rr(xs - 28, y - 14, 56, 28, '#fff', RED, 2.6); TB('+', xs, y + 7, RED, 22); DOT(xs - 14, y + 17, 6, INK); DOT(xs + 14, y + 17, 6, INK); A(xs + 32, y, 40, 0, RED, '', 3); tag('72 km/h = 20 m/s', xs + 6, y - 38, DRED, 14);
    DOT(W * .93, y, 7, BLUE_D); TB('700 Hz émis', W * .2, H * .1, INK, 15);
    ph_fade(p, 0, function () { tag('approche : ≈ 744 Hz', W * .76, H * .3, DGREEN, 15); tag('éloignement : ≈ 661 Hz', W * .27, H * .84, BLUE_D, 15); tag('écart ≈ 83 Hz', W * .62, H * .93, DRED, 15); });
  },
  /* 8 tuyau ouvert ou fermé */
  function (p) {
    var x0 = W * .1, x1 = W * .9; ph7_pipe(x0, x1, H * .28, H * .22, true); ph7_stdwave(x0, x1, H * .28, H * .08, .5, 1, RED, true); ph7_pipe(x0, x1, H * .66, H * .22, false); ph7_stdwave(x0, x1, H * .66, H * .08, 1, 1, BLUE, true);
    TB('fermé, L = 1,0 m', x0, H * .1, DRED, 14, 'left'); TB('ouvert, L = 1,0 m', x0, H * .48, BLUE_D, 14, 'left');
    ph_fade(p, 0, function () { tag('λ = 4L → f = v/4L', W * .68, H * .1, DRED, 14); tag('λ = 2L → f = v/2L', W * .68, H * .48, BLUE_D, 14); tag('ouvert : deux fois plus aigu', W * .5, H * .92, DGREEN, 16); });
  },
  /* 9 une flûte */
  function (p) {
    var x0 = W * .1, x1 = W * .9; ph7_pipe(x0, x1, H * .3, H * .2, false); ph7_stdwave(x0, x1, H * .3, H * .07, 1, 1, BLUE, true); ph_dim(x0, H * .5, x1, H * .5, 'L = 0,60 m', GREY, 0); TB('flûte, 20 °C : v = 343 m/s', W * .5, H * .1, INK, 14);
    ph_fade(p, 0, function () { tag('286 · 572 · 859 Hz', W * .3, H * .66, DGREEN, 16); tag('30 °C : 291 Hz (+30 cents)', W * .7, H * .66, DRED, 14); tag('fermé : 143 · 429 · 715 Hz', W * .5, H * .88, BLUE_D, 15); });
  },
  /* 10 le mur du son */
  function (p) {
    var ax = W * .88, ay = H * .2, gy = H * .84, ox = ax - (gy - ay) / Math.tan(30 * D2R); LN(W * .04, gy, W * .96, gy, INK, 2.2); ph6_rr(ax - 24, ay - 8, 48, 16, '#eef4fb', BLUE_D, 2); A(ax + 28, ay, 30, 0, RED, '', 3); DOT(ox, gy - 6, 6, DRED); TB('observateur', ox + 4, gy + 18, DRED, 13, 'left'); TB('h = 8 000 m · Mach 2', W * .5, H * .08, INK, 14);
    LN(ax, ay, ox, gy, BLUE, 2.6); ph_arc(ax, ay, 56, PI, PI + 30 * D2R, GREY, 1.6); LN(ox, ay, ox, gy, GREY, 1.2, [3, 4]); LN(ox, ay, ax, ay, GREY, 1.2, [3, 4]);
    ph_fade(p, 0, function () { tag('sin α = 1/2 → α = 30°', ax - 90, ay + 34, DGREEN, 14); tag('13,9 km après la verticale, 20 s plus tard', W * .5, H * .66, DRED, 13); tag('Mach 1,5 : 41,8° · 8,9 km · 17,5 s', W * .5, H * .94, BLUE_D, 14); });
  }
]);
