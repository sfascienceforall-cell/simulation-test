/* Physique 6e · chapitre 8 : ondes électromagnétiques, interférences, spectres (aides : theo-01, 02, 06) */
function ph8_rainbow(x, y, w, h) { for (var i = 0; i < w; i += 2) { var u = i / w; ctx.fillStyle = 'hsl(' + Math.round(275 - 275 * u) + ',90%,55%)'; ctx.fillRect(x + i, y, 2.5, h); } }
function ph8_pol(x, y, h, ang, lab, col) { ctx.fillStyle = 'rgba(160,170,185,.25)'; ctx.fillRect(x - 5, y - h / 2, 10, h); ctx.strokeStyle = col || INK; ctx.lineWidth = 2.4; ctx.strokeRect(x - 5, y - h / 2, 10, h); for (var k = -2; k <= 2; k++) { var dy = k * h / 6, c = Math.cos(ang), s = Math.sin(ang); LN(x - 3 * 0, y + dy - 12 * s * 0, x, y + dy, col || INK, 0); } var L = h * .34; LN(x, y - L * Math.sin(ang) * 0 - 0, x, y, col || INK, 0); ctx.strokeStyle = col || INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x - L * .0 - 22 * 0, y); ctx.stroke(); var ex = Math.sin(ang) * L, ey = -Math.cos(ang) * L; LN(x - ex, y - ey, x + ex, y + ey, col || INK, 0); TB(lab, x, y + h / 2 + 15, col || INK, 13); }
function ph8_axis(x, y, ang, L, col) { LN(x - Math.sin(ang) * L, y + Math.cos(ang) * L * -1, x + Math.sin(ang) * L, y - Math.cos(ang) * L * -1, col, 3); }
function ph8_slits(fx, cy, d, h) { ctx.fillStyle = INK; ctx.fillRect(fx - 3, 0, 6, cy - d / 2 - 5); ctx.fillRect(fx - 3, cy - d / 2 + 5, 6, d - 10); ctx.fillRect(fx - 3, cy + d / 2 + 5, 6, h - cy - d / 2 - 5); }

SFA.theo("c08", {
  icon: function () {
    TB('c = λ·f', W * .5, H * .34, BLUE_D, 40); ph8_rainbow(W * .2, H * .56, W * .6, H * .12); TB('E = h·f', W * .5, H * .9, ORANGE, 24);
  },
  sub: [
    { t: "Spectre électromagnétique et photons",
      anim: function (t) {
        var x0 = W * .05, w = W * .9, y = H * .3, u = .5 + .5 * Math.sin(t * .008), lg = -12 + 16 * u; /* log10(λ) de -12 à +4 m */
        var names = ['γ', 'X', 'UV', 'IR', 'micro-ondes', 'radio']; var edge = [-12, -9, -7.4, -6.2, -3, -1, 4]; var cols = ['#7F77DD', '#5B8DEF', '#9A5FD0', '#D85A30', '#BA7517', '#378ADD'];
        for (var i = 0; i < 6; i++) { var a = x0 + w * (edge[i] + 12) / 16, b = x0 + w * (edge[i + 1] + 12) / 16; ctx.fillStyle = cols[i] + '55'; ctx.fillRect(a, y, b - a, H * .16); ctx.strokeStyle = cols[i]; ctx.lineWidth = 1.5; ctx.strokeRect(a, y, b - a, H * .16); TB(names[i], (a + b) / 2, y + H * .1, cols[i], 12); }
        var vx = x0 + w * (-6.35 + 12) / 16; ph8_rainbow(vx, y - H * .08, w * .018 + 4, H * .06); TB('visible', vx + 3, y - H * .1, INK, 12);
        var cx = x0 + w * u; LN(cx, y - H * .04, cx, y + H * .22, RED, 2.6); DOT(cx, y + H * .22, 5, RED);
        var lam = Math.pow(10, lg), f = 3e8 / lam, E = 6.63e-34 * f / 1.6e-19;
        function sc(v) { var e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e); return m.toFixed(1).replace('.', ',') + '·10' + String(e).replace(/-/g, '⁻').replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]; }); }
        TB('λ = ' + sc(lam) + ' m', W * .2, H * .72, DGREEN, 15); TB('f = ' + sc(f) + ' Hz', W * .5, H * .72, BLUE_D, 15); TB('E = ' + sc(E) + ' eV', W * .8, H * .72, DRED, 15);
        TB('λ ↓ , f ↑ , E ↑ : c = λ·f et E = h·f', W * .5, H * .9, INK, 15); TB('λ croît vers la droite ; f et E croissent vers la gauche', W * .5, H * .08, GREY, 13);
      },
      th: '<div class="tcard"><b class="h">Une famille d\'ondes</b><p>Les ondes électromagnétiques (champs électrique et magnétique qui se propagent, <b>transversales</b>, sans milieu) vont des ondes radio aux rayons γ. Dans le vide : <b>c = λ·f = 3,00·10<sup>8</sup> m/s</b>. Radio FM à 100 MHz : λ = 3,0 m. Ordre de fréquence croissante : radio, micro-ondes, infrarouge, <b>visible (400-700 nm)</b>, ultraviolet, rayons X, rayons γ.</p></div>' +
        '<div class="tcard"><b class="h">Le photon</b><p>Un rayonnement est formé de photons d\'énergie <b>E = h·f = h·c/λ</b> (h = 6,63·10<sup>−34</sup> J·s ; 1 eV = 1,60·10<sup>−19</sup> J ; hc ≈ 1 240 eV·nm). Lumière verte de 550 nm : f = 5,45·10<sup>14</sup> Hz et E = 3,6·10<sup>−19</sup> J ≈ 2,26 eV. Plus la fréquence est grande, plus les photons sont énergétiques (X et γ ionisants).</p></div>' +
        '<div class="tcard"><b class="h">Pièges</b><ul><li>Ne confonds pas λ (grande pour la radio) et f (grande pour les rayons X).</li><li>Quand une onde change de milieu, f est conservée ; λ = v/f change.</li><li>Convertis nm → m (10<sup>−9</sup>) avant de calculer.</li></ul></div>' },
    { t: "Interférences : fentes d'Young et réseau",
      anim: function (t) {
        var lamk = .7 + .3 * Math.sin(t * .01), fx = W * .12, sx = W * .6, cy = H * .5, d = H * .2;
        ph8_slits(fx, cy, d, H); for (var k = 0; k < 5; k++) A(W * .02 + k * 0, cy - 40 + k * 20, W * .08, 0, '#e8a07c', '', 1.6); LN(sx, 10, sx, H - 10, INK, 3);
        var lam = 0.1 * lamk; /* i en px */ var i0 = 34 * lamk;
        for (var y = 10; y < H - 10; y += 2) { var I = Math.pow(Math.cos(PI * (y - cy) / i0), 2); ctx.fillStyle = 'rgba(' + Math.round(220 * I) + ',' + Math.round(30 * I) + ',' + Math.round(30 * I) + ',1)'; ctx.fillRect(sx + 4, y, 22, 2); }
        ctx.strokeStyle = RED; ctx.lineWidth = 2.4; ctx.beginPath(); for (y = 10; y < H - 10; y += 2) { var I2 = Math.pow(Math.cos(PI * (y - cy) / i0), 2); y === 10 ? ctx.moveTo(sx + 40 + 100 * I2, y) : ctx.lineTo(sx + 40 + 100 * I2, y); } ctx.stroke();
        LN(sx + 24, cy - 3 * i0 + 0, sx + 24, cy - 2 * i0, GREEN, 0); ph_dim(sx + 160, cy, sx + 160, cy + i0, 'i', DGREEN, 12);
        tag('i = λ·D/a', W * .8, H * .08, DGREEN, 16); tag('λ ↓ → i ↓ (bleu : franges serrées)', W * .8, H * .93, BLUE_D, 13); tag('a', fx - 16, cy, GREY, 13); TB('λ = ' + Math.round(633 * lamk) + ' nm (relatif)', W * .3, H * .1, ORANGE, 14);
      },
      th: '<div class="tcard"><b class="h">Fentes d\'Young</b><p>Une lumière monochromatique (laser) éclaire deux fentes très fines distantes de a. Sur un écran à la distance D, on observe une alternance de franges brillantes (<b>Δ = k·λ</b>) et sombres (<b>Δ = (k + ½)·λ</b>) : la preuve du caractère ondulatoire de la lumière. L\'<b>interfrange</b> (distance entre deux franges brillantes voisines) est <b>i = λ·D/a</b>. λ = 633 nm, a = 0,40 mm, D = 1,50 m : i ≈ 2,4 mm.</p></div>' +
        '<div class="tcard"><b class="h">Utiliser i</b><p>i est proportionnelle à λ et à D, inversement proportionnelle à a. Passer du rouge (650 nm, i = 3,0 mm) au bleu (450 nm) : i = 3,0 × 450/650 ≈ 2,1 mm. Plongé dans l\'eau (n = 1,33), λ est divisée par n et i aussi : 6,4 mm → 4,8 mm. Mesure précise : mesure 10 interfranges et divise par 10 ; on peut en déduire λ = i·a/D (7,5 mm, a = 0,25 mm, D = 3,0 m → 625 nm, orange-rouge).</p></div>' +
        '<div class="tcard"><b class="h">Le réseau</b><p>Un réseau de N traits par mm a un pas <b>p = 1/N</b> (500 traits/mm → 2,0 µm). Les maxima sont aux angles <b>sin θ = n·λ/p</b> (n = 0, ±1, ±2 …) avec n·λ/p ≤ 1. Pour le sodium (589 nm), l\'ordre 1 est à 17,1° et l\'on voit les ordres 0, ±1, ±2, ±3 (7 maxima). Plus N est grand, plus les raies sont fines et le réseau sépare mieux les longueurs d\'onde.</p></div>' },
    { t: "Spectres et polarisation",
      anim: function (t) {
        var ang = t * .02, x0 = W * .08, y = H * .3;
        TB('spectre continu', W * .02, H * .1, GREY, 12, 'left'); ph8_rainbow(x0, y - 20, W * .38, 40); TB('lampe à filament', x0 + W * .19, y + 38, GREY, 12);
        var ya = H * .7; ph8_rainbow(x0, ya - 20, W * .38, 40); ctx.fillStyle = '#000'; ctx.fillRect(x0 + W * .38 * .63, ya - 20, 3, 40); ctx.fillRect(x0 + W * .38 * .632 + 6, ya - 20, 2, 40); TB('absorption : raies noires du sodium', x0 + W * .19, ya + 38, INK, 12);
        var px = W * .56, py = H * .5, tx = W * .6; var th = ang % PI;
        /* polariseur fixe vertical, analyseur tournant */
        LN(px, py - 60, px, py + 60, INK, 3); TB('polariseur', px, py + 78, INK, 12); var ax = W * .8; var ex = Math.sin(th) * 60, ey = -Math.cos(th) * 60; LN(ax - ex, py - ey, ax + ex, py + ey, RED, 3); TB('analyseur : ' + Math.round(th / D2R) + '°', ax, py + 78, DRED, 12);
        var I = Math.pow(Math.cos(th), 2); LN(px + 10, py, ax - 10, py, '#f0c24d', 4 + 8 * 0); LN(ax + 14, py, ax + 14 + 60 * I, py, '#f0c24d', 3 + 6 * I); TB('I = I₀·cos²θ = ' + Math.round(I * 100) + ' %', W * .7, H * .15, DGREEN, 15);
      },
      th: '<div class="tcard"><b class="h">Spectres d\'émission</b><p>Un corps chaud (filament, Soleil) émet un <b>spectre continu</b> dont la couleur dépend de sa température. Un gaz à basse pression excité émet un <b>spectre de raies</b> : chaque élément a ses raies, comme une empreinte (le sodium : doublet jaune à 589,0 et 589,6 nm). Chaque raie correspond à un photon d\'énergie E = h·f = différence entre deux niveaux d\'énergie de l\'atome.</p></div>' +
        '<div class="tcard"><b class="h">Spectre d\'absorption</b><p>Si la lumière blanche traverse un gaz froid, celui-ci absorbe exactement les longueurs d\'onde qu\'il peut émettre : on voit des <b>raies noires</b> sur le fond continu. C\'est ainsi qu\'on identifie les éléments dans l\'atmosphère des étoiles. 589,0 nm ↔ f = 5,093·10<sup>14</sup> Hz ; 589,6 nm ↔ 5,088·10<sup>14</sup> Hz, écart ≈ 5,2·10<sup>11</sup> Hz.</p></div>' +
        '<div class="tcard"><b class="h">Polarisation et loi de Malus</b><p>La lumière est une onde <b>transversale</b> : on peut la polariser (le champ E oscille dans un seul plan). Un polariseur transforme la lumière naturelle I₀ en lumière polarisée d\'intensité <b>I₀/2</b>. Après un analyseur faisant l\'angle θ avec la polarisation : <b>I = I₀·cos²θ</b> (loi de Malus). Polariseurs croisés (90°) : extinction. Un 3<sup>e</sup> polariseur à 45° entre les deux : I₀/2 → I₀/4 → <b>I₀/8</b>.</p></div>' +
        '<div class="tcard"><b class="h">Optimiser l\'intercalaire</b><p>Avec P₁, un intercalaire à β puis l\'analyseur à 90° : I = (I₀/8)·sin²(2β), maximum pour β = 45° (12,5 % de I₀). Pour I₀ = 80 W/m² : 40 W/m² après P₁ ; β = 60° donne 7,5 W/m² ; β = 45° donne 10 W/m².</p></div>' }
  ]
});

SFA.figs("c08", [
  /* 1 FM 100 MHz */
  function (p) {
    var x0 = W * .06, w = W * .88, y = H * .42; var edge = [-12, -9, -7.4, -6.2, -3, -1, 4], cols = ['#7F77DD', '#5B8DEF', '#9A5FD0', '#D85A30', '#BA7517', '#378ADD'], nm = ['γ', 'X', 'UV', 'IR', 'µ-ondes', 'radio'];
    for (var i = 0; i < 6; i++) { var a = x0 + w * (edge[i] + 12) / 16, b = x0 + w * (edge[i + 1] + 12) / 16; ctx.fillStyle = cols[i] + '44'; ctx.fillRect(a, y, b - a, 40); ctx.strokeStyle = cols[i]; ctx.lineWidth = 1.6; ctx.strokeRect(a, y, b - a, 40); if (b - a > 26) TB(nm[i], (a + b) / 2, y + 25, cols[i], 11); }
    var fm = x0 + w * (.48 + 12) / 16; DOT(fm, y + 20, 6, RED); A(fm, y - 36, 0, 28, RED, '', 3); TB('FM 100 MHz', fm - 6, y - 42, DRED, 15, 'right');
    ph_fade(p, 0, function () { tag('λ = c/f = 3,0 m', W * .5, H * .8, DGREEN, 20); });
  },
  /* 2 quelle fréquence est la plus grande */
  function (p) {
    var x0 = W * .06, w = W * .88, y = H * .4; var names = ['radio', 'micro-ondes', 'visible', 'rayons X'], cols = [BLUE, ORANGE, GREEN, VIOLET]; var bw = w / 4 - 8;
    for (var i = 0; i < 4; i++) { var h = 24 + i * 22; ctx.fillStyle = cols[i] + '44'; ctx.fillRect(x0 + i * (bw + 8), y + 70 - h, bw, h); ctx.strokeStyle = cols[i]; ctx.lineWidth = 2; ctx.strokeRect(x0 + i * (bw + 8), y + 70 - h, bw, h); TB(names[i], x0 + i * (bw + 8) + bw / 2, y + 90, INK, 12); }
    TB('fréquence f →', W * .5, H * .12, GREY, 15); ph_fade(p, 0, function () { var i = 3; ctx.lineWidth = 4; ctx.strokeStyle = DGREEN; ctx.strokeRect(x0 + i * (bw + 8) - 2, y + 70 - 90 - 2, bw + 4, 94); tag('rayons X : f la plus grande', W * .5, H * .9, DGREEN, 16); });
  },
  /* 3 photon vert */
  function (p) {
    var x0 = W * .06; ph8_rainbow(W * .08, H * .2, W * .84, 26); var gx = W * .08 + W * .84 * (550 - 400) / 300; A(gx, H * .12, 0, 24, DGREEN, '', 3); TB('550 nm', gx, H * .1, DGREEN, 14);
    ph6_string(W * .08, W * .6, H * .62, H * .1, W * .14, 0, '#2fa36f', 3); A(W * .62, H * .62, 50, 0, DGREEN, '', 3); DOT(W * .82, H * .62, 10, '#e9f7ef'); TB('photon', W * .82, H * .62 + 28, DGREEN, 13);
    ph_fade(p, 0, function () { tag('f = c/λ ≈ 5,45·10¹⁴ Hz', W * .5, H * .42, BLUE_D, 15); tag('E = h·f ≈ 3,6·10⁻¹⁹ J ≈ 2,26 eV', W * .5, H * .93, DGREEN, 15); });
  },
  /* 4 interfrange d'Young */
  function (p) {
    var fx = W * .14, cy = H * .5, sx = W * .8; ph8_slits(fx, cy, 40, H); LN(sx, 10, sx, H - 10, INK, 3); A(W * .02, cy, W * .09, 0, '#e8a07c', '', 2); TB('laser 633 nm', W * .06, cy - 22, ORANGE, 12, 'left'); ph_dim(fx, H * .8, sx, H * .8, 'D = 1,50 m', GREY, 0); TB('a = 0,40 mm', fx + 10, H * .17, GREY, 13, 'left');
    var i0 = 24; for (var y = cy - 120; y < cy + 120; y += 2) { var I = Math.pow(Math.cos(PI * (y - cy) / i0), 2); ctx.fillStyle = 'rgba(' + Math.round(225 * I) + ',' + Math.round(30 * I) + ',' + Math.round(30 * I) + ',1)'; ctx.fillRect(sx + 4, y, 22, 2); }
    ph_fade(p, 0, function () { ph_dim(sx + 40, cy, sx + 40, cy + i0, 'i', DGREEN, 10); tag('i = λ·D/a ≈ 2,4 mm', W * .46, H * .93, DGREEN, 17); });
  },
  /* 5 rouge ou bleu */
  function (p) {
    var sx = W * .2, w = W * .6; function fr(y0, i0, col, lab) { for (var y = y0 - 38; y < y0 + 38; y += 2) { var I = Math.pow(Math.cos(PI * (y - y0) / i0), 2); ctx.fillStyle = col(I); ctx.fillRect(sx, y, w, 2); } TB(lab, sx - 8, y0 + 4, INK, 13, 'right'); }
    fr(H * .3, 30, function (I) { return 'rgb(' + Math.round(235 * I) + ',' + Math.round(20 * I) + ',' + Math.round(20 * I) + ')'; }, 'rouge 650 nm');
    ph_dim(sx + w + 14, H * .3, sx + w + 14, H * .3 + 30, '3,0 mm', GREY, 28);
    if (p > 0) { var q = ph_a(p, 0, .5); ctx.globalAlpha = q; fr(H * .7, 30 * 450 / 650, function (I) { return 'rgb(' + Math.round(20 * I) + ',' + Math.round(60 * I) + ',' + Math.round(240 * I) + ')'; }, 'bleu 450 nm'); ph_dim(sx + w + 14, H * .7, sx + w + 14, H * .7 + 20.8, '2,1 mm', DGREEN, 28); tag('i diminue : 3,0 × 450/650 ≈ 2,1 mm', W * .5, H * .93, DGREEN, 15); ctx.globalAlpha = 1; } else TB('bleu 450 nm : ?', W * .5, H * .7, GREY, 18);
  },
  /* 6 un réseau */
  function (p) {
    var gx = W * .3, cy = H * .5, R = W * .5; ctx.fillStyle = INK; for (var k = -5; k <= 5; k++) ctx.fillRect(gx - 2, cy + k * 11 - 3, 4, 6); TB('500 traits/mm', gx, H * .1, INK, 14); TB('p = 2,0 µm', gx, H * .9, INK, 14); A(W * .04, cy, W * .2, 0, '#f0c24d', '', 3); TB('Na 589 nm', W * .02, cy - 18, ORANGE, 12, 'left');
    var ords = [0, 17.13, 36.1, 62.1]; ph_fade(p, 0, function () { ords.forEach(function (g, i) { [1, -1].forEach(function (sg) { if (!g && sg < 0) return; var a = g * D2R * sg; LN(gx, cy, gx + R * .55 * Math.cos(a), cy - R * .55 * Math.sin(a), '#e0a838', 2.4); }); }); ph_arc(gx, cy, 58, 0, -17.13 * D2R, DRED, 2); tag('17,1°', gx + 80, cy - 14, DRED, 14); tag('ordres 0, ±1, ±2, ±3 : 7 maxima', W * .66, H * .96, DGREEN, 14); });
  },
  /* 7 raies du sodium */
  function (p) {
    var x0 = W * .08, w = W * .84; ph8_rainbow(x0, H * .3, w, 50); var xa = x0 + w * (589 - 400) / 300; TB('spectre continu', x0, H * .26, GREY, 12, 'left');
    ph_fade(p, 0, function () { ctx.fillStyle = '#000'; ctx.fillRect(xa - 2, H * .3, 3, 50); ctx.fillRect(xa + 4, H * .3, 2.5, 50); A(xa, H * .72, 0, -50, DGREEN, '', 2.6); tag('raies noires : 589,0 et 589,6 nm', W * .5, H * .86, DGREEN, 14); tag('5,093·10¹⁴ Hz · 5,088·10¹⁴ Hz', W * .5, H * .1, BLUE_D, 14); });
    if (p <= 0) TB('vapeur froide de sodium ?', W * .5, H * .8, GREY, 16);
  },
  /* 8 le troisième polariseur */
  function (p) {
    var y = H * .5, xs = [W * .28, W * .52, W * .76], angs = [0, 45 * D2R, 90 * D2R], cols = [BLUE_D, p > 0 ? GREEN : GREY, DRED];
    A(W * .04, y, W * .13, 0, '#f0c24d', '', 3.4);
    for (var i = 0; i < 3; i++) { if (i == 1 && p <= 0) { ctx.setLineDash([4, 4]); } ctx.fillStyle = 'rgba(160,170,185,.2)'; ctx.fillRect(xs[i] - 5, y - 52, 10, 104); ctx.strokeStyle = cols[i]; ctx.lineWidth = 2.4; ctx.strokeRect(xs[i] - 5, y - 52, 10, 104); ctx.setLineDash([]); var ex = Math.sin(angs[i]) * 38, ey = -Math.cos(angs[i]) * 38; LN(xs[i] - ex, y - ey, xs[i] + ex, y + ey, cols[i], 3); }
    TB('0°', xs[0], y + 72, BLUE_D, 13); TB('90°', xs[2], y + 72, DRED, 13); TB('I₀', W * .1, y - 18, ORANGE, 15);
    if (p > 0) { TB('45°', xs[1], y + 72, DGREEN, 13); tag('I₀/2', (xs[0] + xs[1]) / 2, H * .22, BLUE_D, 14); tag('I₀/4', (xs[1] + xs[2]) / 2, H * .22, BLUE_D, 14); tag('I₀/8', W * .92, H * .22, DGREEN, 16); tag('sans intercalaire : 0', W * .5, H * .93, DRED, 14); } else TB('sortie : ?', W * .5, H * .9, GREY, 18);
  },
  /* 9 optimiser l'intercalaire */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .78, gh = H * .56; ph_axes(gx, gy, gw + 8, gh + 14, 'β (°)', 'I (W/m²)'); var X = function (b) { return gx + gw * b / 90; }, Y = function (I) { return gy - gh * I / 12; };
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); for (var b = 0; b <= 90; b += 2) { var I = 10 * Math.pow(Math.sin(2 * b * D2R), 2); b ? ctx.lineTo(X(b), Y(I)) : ctx.moveTo(X(b), Y(I)); } ctx.stroke(); TB('I = (I₀/8)·sin²(2β)', W * .5, H * .08, BLUE_D, 15);
    DOT(X(60), Y(7.5), 6, ORA2); TB('60° : 7,5', X(60) + 8, Y(7.5) - 10, ORANGE, 13, 'left'); ph_fade(p, 0, function () { DOT(X(45), Y(10), 7, DRED); LN(X(45), gy, X(45), Y(10), GREY, 1.2, [3, 4]); tag('maximum : 45°, 10 W/m² (12,5 %)', W * .52, H * .24, DGREEN, 14); });
  },
  /* 10 concevoir une expérience */
  function (p) {
    var fx = W * .14, cy = H * .5, sx = W * .78; ph8_slits(fx, cy, 40, H); LN(sx, 10, sx, H - 10, INK, 3); A(W * .02, cy, W * .09, 0, '#7ed9a0', '', 2); TB('532 nm', W * .06, cy - 20, DGREEN, 12, 'left'); TB('d = 0,25 mm · D = 3,0 m', W * .5, H * .08, INK, 14);
    var i0 = 22; for (var y = cy - 110; y < cy + 110; y += 2) { var I = Math.pow(Math.cos(PI * (y - cy) / i0), 2); ctx.fillStyle = 'rgba(' + Math.round(30 * I) + ',' + Math.round(220 * I) + ',' + Math.round(80 * I) + ',1)'; ctx.fillRect(sx + 4, y, 22, 2); }
    ph_fade(p, 0, function () { tag('i = 6,4 mm · 10 i ≈ 64 mm', W * .46, H * .3, DGREEN, 14); tag('eau : 4,8 mm', W * .46, H * .62, BLUE_D, 14); tag('i = 7,5 mm → 625 nm (orange-rouge)', W * .5, H * .93, DRED, 14); });
  }
]);
