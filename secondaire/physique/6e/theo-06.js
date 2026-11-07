/* Physique 6e · chapitre 6 : ondes mécaniques (aides ph_* : voir theo-01.js et theo-02.js) */
function ph6_rr(x, y, w, h, fill, stroke, lw) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.5; ctx.stroke(); } }
function ph6_fl(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
function ph6_string(x0, x1, y, amp, lam, ph, col, lw) { ctx.strokeStyle = col || BLUE; ctx.lineWidth = lw || 3; ctx.beginPath(); for (var x = x0; x <= x1; x += 2) { var Y = y - amp * Math.sin(2 * PI * (x - x0) / lam - ph); x === x0 ? ctx.moveTo(x, Y) : ctx.lineTo(x, Y); } ctx.stroke(); }
function ph6_rings(cx, cy, lam, off, n, col, a0, a1) { ctx.strokeStyle = col; ctx.lineWidth = 1.6; for (var k = 0; k < n; k++) { var r = k * lam + (off % lam); if (r <= 0) continue; ctx.beginPath(); ctx.arc(cx, cy, r, a0 === undefined ? 0 : a0, a1 === undefined ? 7 : a1); ctx.stroke(); } }

SFA.theo("c06", {
  icon: function () {
    TB('v = λ·f', W * .5, H * .36, BLUE_D, 40); ph6_string(W * .1, W * .9, H * .74, H * .12, W * .26, 0, ORANGE, 3.5); ph_dim(W * .1, H * .9, W * .36, H * .9, 'λ', GREY, 0);
  },
  sub: [
    { t: "Onde progressive : v = λ·f",
      anim: function (t) {
        var x0 = W * .06, x1 = W * .94, lam = W * .22, ph = t * .05, y = H * .3;
        ph6_string(x0, x1, y, H * .12, lam, ph, BLUE, 3.4); LN(x0, y, x1, y, '#d9dde1', 1.2, [4, 4]);
        var px = W * .5, py = y - H * .12 * Math.sin(2 * PI * (px - x0) / lam - ph); LN(px, y - H * .2, px, y + H * .2, '#d9dde1', 1.2, [3, 4]); DOT(px, py, 7, ORA2); TB('le point oscille', px, y + H * .24, ORANGE, 13);
        A(W * .8, H * .56, 40, 0, GREEN, '', 3); TB('l\'onde avance : v', W * .78, H * .56 + 5, DGREEN, 14, 'right');
        ph_dim(x0 + lam * .75 - lam, y + H * .17, x0 + lam * .75, y + H * .17, 'λ', GREY, 0); ph_dim(W * .06 + lam * 1.75, y + H * .17, W * .06 + lam * 2.75, y + H * .17, 'λ', GREY, 0);
        /* onde longitudinale */
        var ly = H * .74; for (var i = 0; i < 46; i++) { var xx = x0 + i * (x1 - x0) / 45, d = 7 * Math.sin(2 * PI * (xx - x0) / lam - ph); LN(xx + d, ly - 18, xx + d, ly + 18, BLUE, 2); }
        TB('onde longitudinale : le milieu vibre dans le sens de propagation', W * .5, H * .96, GREY, 13); TB('T = 1/f      v = λ/T = λ·f', W * .5, H * .08, DGREEN, 16);
      },
      th: '<div class="tcard"><b class="h">Qu\'est-ce qu\'une onde mécanique ?</b><p>Une onde transporte de l\'<b>énergie et de l\'information sans transport de matière</b> : chaque point du milieu reproduit avec un retard le mouvement de la source. Elle est <b>transversale</b> si la perturbation est perpendiculaire à la propagation (corde, ondes à la surface de l\'eau) et <b>longitudinale</b> si elle est parallèle (son, ressort comprimé).</p></div>' +
        '<div class="tcard"><b class="h">Période, fréquence, longueur d\'onde</b><p>La <b>période</b> T (s) est la durée d\'une oscillation d\'un point ; la <b>fréquence</b> f = 1/T (Hz) est imposée par la source. La <b>longueur d\'onde</b> λ (m) est la distance parcourue pendant une période, ou la distance entre deux points qui vibrent en phase. La <b>célérité</b> : <b>v = λ/T = λ·f</b>. Exemple : f = 5,0 Hz, λ = 0,80 m donnent v = 4,0 m/s.</p></div>' +
        '<div class="tcard"><b class="h">La célérité dépend du milieu</b><p>v est fixée par le milieu, pas par la fréquence. Corde tendue : <b>v = √(T/μ)</b> (T tension en N, μ masse linéique en kg/m) : 36 N et 0,040 kg/m donnent 30 m/s ; à 50 Hz, λ = v/f = 0,60 m. Quand on change de milieu, <b>f ne change pas</b> mais v et λ changent. Ondes de marée en eau peu profonde : v = √(g·h).</p></div>' +
        '<div class="tcard"><b class="h">Pièges</b><ul><li>Un point du milieu <b>ne voyage pas</b> avec l\'onde : il oscille autour de sa position d\'équilibre.</li><li>Doubler f à milieu inchangé divise λ par 2 (v constante), il ne double pas v.</li><li>Convertis (cm, ms, km/h) avant de calculer.</li></ul></div>' },
    { t: "Réflexion, diffraction, interférences",
      anim: function (t) {
        var lam = 26, off = t * .35, sx = W * .06, sy = H * .5, wx = W * .36;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, wx, H); ctx.clip(); ph6_rings(sx, sy, lam, off, 20, '#7db5ec'); ctx.restore();
        ctx.fillStyle = INK; ctx.fillRect(wx - 3, 0, 6, sy - 24); ctx.fillRect(wx - 3, sy + 24, 6, H - sy - 24);
        ctx.save(); ctx.beginPath(); ctx.rect(wx, 0, W * .3, H); ctx.clip(); ph6_rings(wx, sy, lam, off, 14, BLUE); ctx.restore();
        tag('diffraction : fente a ≈ λ', wx + 70, H * .07, BLUE_D, 14); tag('sin θ = λ/a', wx + 70, H * .95, DGREEN, 15);
        var s1 = { x: W * .78, y: H * .36 }, s2 = { x: W * .78, y: H * .64 }; ctx.save(); ctx.beginPath(); ctx.rect(W * .66, 0, W * .34, H); ctx.clip(); ph6_rings(s1.x, s1.y, 22, off, 14, '#e0884b'); ph6_rings(s2.x, s2.y, 22, off, 14, '#6aa3dc'); ctx.restore();
        LN(W * .66, 0, W * .66, H, GREY, 1, [3, 4]); DOT(s1.x, s1.y, 5, DRED); DOT(s2.x, s2.y, 5, BLUE_D); tag('Δ = k·λ : renforcement', W * .83, H * .07, DRED, 13); tag('Δ = (k + ½)·λ : annulation', W * .83, H * .95, DGREEN, 13);
      },
      th: '<div class="tcard"><b class="h">Réflexion et superposition</b><p>Une onde qui rencontre un obstacle est <b>réfléchie</b> (même fréquence, même célérité). Sur une corde à extrémité fixe, l\'impulsion revient inversée ; à extrémité libre, elle revient non inversée. Deux ondes qui se croisent s\'additionnent (<b>principe de superposition</b>) puis repartent inchangées.</p></div>' +
        '<div class="tcard"><b class="h">Diffraction</b><p>Une onde qui traverse une ouverture de largeur a s\'étale d\'autant plus que a est proche de λ. Le premier minimum apparaît à <b>sin θ = λ/a</b>. Cuve à ondes : λ = 1,2 cm, a = 2,0 cm donne θ = 36,9° ; avec a = 0,80 cm &lt; λ, il n\'y a plus de minimum : l\'onde ressort quasi circulaire.</p></div>' +
        '<div class="tcard"><b class="h">Interférences</b><p>Deux sources cohérentes (même fréquence, déphasage constant) créent en un point P une onde dont l\'amplitude dépend de la <b>différence de marche Δ = |d₁ − d₂|</b>. <b>Δ = k·λ</b> (k entier) : interférence <b>constructive</b> ; <b>Δ = (k + ½)·λ</b> : <b>destructive</b>. Haut-parleurs en phase, λ = 0,60 m, d₁ = 3,0 m, d₂ = 3,9 m : Δ = 0,9 m = 1,5·λ, donc quasi-silence. Deux fentes distantes de d : maxima à <b>sin θ = m·λ/d</b> ; sur un écran à la distance D, interfrange i ≈ λ·D/d (petits angles).</p></div>' },
    { t: "Ondes stationnaires",
      anim: function (t) {
        var x0 = W * .1, x1 = W * .9, L = x1 - x0, n = 1 + Math.floor((t / 220) % 4), y = H * .42, A0 = H * .22, c = Math.cos(t * .09);
        ctx.strokeStyle = '#cfd6dd'; ctx.lineWidth = 2; ctx.beginPath(); for (var x = x0; x <= x1; x += 2) { var Y = y - A0 * Math.sin(n * PI * (x - x0) / L); x === x0 ? ctx.moveTo(x, Y) : ctx.lineTo(x, Y); } ctx.stroke();
        ctx.beginPath(); for (x = x0; x <= x1; x += 2) { Y = y - A0 * c * Math.sin(n * PI * (x - x0) / L); x === x0 ? ctx.moveTo(x, Y) : ctx.lineTo(x, Y); } ctx.strokeStyle = BLUE; ctx.lineWidth = 3.4; ctx.stroke();
        for (var k = 0; k <= n; k++) DOT(x0 + L * k / n, y, 6, DRED);
        LN(x0, y - A0 - 10, x0, y + A0 + 10, INK, 4); LN(x1, y - A0 - 10, x1, y + A0 + 10, INK, 4);
        TB('n = ' + n + ' : ' + (n + 1) + ' nœuds (●), ' + n + ' ventre' + (n > 1 ? 's' : ''), W * .5, H * .08, BLUE_D, 16); ph_dim(x0, y + A0 + 26, x0 + L / n, y + A0 + 26, 'λ/2', GREY, 0);
        TB('L = n·λ/2', W * .3, H * .9, DGREEN, 17); TB('f_n = n·v/(2L) = n·f₁', W * .7, H * .9, DRED, 17);
      },
      th: '<div class="tcard"><b class="h">Naissance</b><p>Une onde et son onde réfléchie, de même fréquence, se superposent : il apparaît des points <b>toujours immobiles (nœuds)</b> et des points d\'amplitude maximale (<b>ventres</b>). L\'onde ne se propage plus : toute la corde vibre en phase par fuseaux. Deux nœuds voisins sont distants de λ/2.</p></div>' +
        '<div class="tcard"><b class="h">Corde fixée aux deux bouts</b><p>Il faut un nœud à chaque extrémité : <b>L = n·λ/2</b>, soit <b>f<sub>n</sub> = n·v/(2L) = n·f₁</b> (n = 1, 2, 3 …) ; il y a n ventres et n + 1 nœuds. Les fréquences possibles forment une suite <b>discrète</b> : fondamental f₁ et harmoniques.</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré</b><p>Corde de guitare L = 0,65 m, f₁ = 110 Hz : v = 2·L·f₁ = 143 m/s. Harmoniques : 220 Hz et 330 Hz. Pour n = 3 : λ = 2L/3 = 0,43 m, 4 nœuds, distance entre nœuds λ/2 = 0,22 m. Pincer la corde plus tendue augmente v donc f<sub>1</sub> ; la raccourcir (doigt sur la frette) augmente aussi f<sub>1</sub>.</p></div>' }
  ]
});

SFA.figs("c06", [
  /* 1 célérité */
  function (p) {
    var x0 = W * .06, lam = W * .38, y = H * .5; ph6_string(x0, W * .94, y, H * .18, lam, 0, BLUE, 3.5); LN(x0, y, W * .94, y, '#d9dde1', 1.2, [4, 4]);
    ph_dim(x0 + lam * .25, y + H * .3, x0 + lam * 1.25, y + H * .3, 'λ = 0,80 m', GREY, 0); TB('f = 5,0 Hz', W * .5, H * .12, ORANGE, 17);
    ph_fade(p, 0, function () { A(W * .72, y - H * .3, 60, 0, GREEN, '', 3.4); tag('v = λ·f = 4,0 m/s', W * .5, H * .92, DGREEN, 18); });
  },
  /* 2 que fait un point */
  function (p) {
    var x0 = W * .06, lam = W * .34, y = H * .5, px = W * .42; ph6_string(x0, W * .94, y, H * .16, lam, .6, BLUE, 3.4); LN(x0, y, W * .94, y, '#d9dde1', 1.2, [4, 4]);
    var py = y - H * .16 * Math.sin(2 * PI * (px - x0) / lam - .6); DOT(px, py, 8, ORA2); A(W * .72, y - H * .3, 70, 0, GREEN, '', 3.4); TB('propagation', W * .78, y - H * .34, DGREEN, 14); TB('corde horizontale', W * .22, H * .9, GREY, 14);
    ph_fade(p, 0, function () { A(px, py, 0, -50, RED, '', 3.4); A(px, py, 0, 50, RED, '', 3.4); tag('oscille verticalement', px + 70, H * .88, DRED, 16); TB('onde transversale', W * .5, H * .12, DGREEN, 16); });
  },
  /* 3 corde tendue */
  function (p) {
    var x0 = W * .2, x1 = W * .94, y = H * .5; wall(W * .08, y - 44, y + 44, -1); ph6_string(W * .08, x1, y, H * .1, W * .2, 0, BLUE, 3.2); LN(x1, y, x1 + 0, y, INK, 3); A(x1 - 14, y, 18, 0, RED, '', 3); TB('T = 36 N', W * .84, y - 50, DRED, 16);
    TB('μ = 0,040 kg/m', W * .5, H * .12, INK, 16); ph_fade(p, 0, function () { tag('v = √(T/μ) = 30 m/s', W * .5, H * .78, DGREEN, 17); tag('à 50 Hz : λ = 0,60 m', W * .5, H * .93, BLUE_D, 16); });
  },
  /* 4 la vague du stade */
  function (p) {
    var n = 14, x0 = W * .08, dx = (W * .84) / (n - 1), gy = H * .78;
    for (var i = 0; i < n; i++) { var up = i >= 4 && i < 9, x = x0 + i * dx; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; DOT(x, gy - 48 - (up ? 10 : 0), 8, '#fdece4'); LN(x, gy - 40 - (up ? 10 : 0), x, gy, BLUE_D, 3); LN(x, gy - 30 - (up ? 10 : 0), x - 7, gy - 52 - (up ? 24 : 4), BLUE_D, 2.4); LN(x, gy - 30 - (up ? 10 : 0), x + 7, gy - 52 - (up ? 24 : 4), BLUE_D, 2.4); }
    LN(x0 - 20, gy, x0 + n * dx, gy, INK, 2.2); ph_dim(x0, gy + 22, x0 + dx, gy + 22, '0,50 m', GREY, 0); TB('0,040 s entre voisins', W * .5, H * .12, ORANGE, 15);
    ph_fade(p, 0, function () { A(x0 + dx * 9.5, H * .14, 60, 0, GREEN, '', 3.4); tag('v = 12,5 m/s = 45 km/h', W * .32, H * .26, DGREEN, 16); tag('20 personnes debout · bosse de 10 m', W * .5, H * .95, DRED, 15); });
  },
  /* 5 augmenter la fréquence */
  function (p) {
    var x0 = W * .08, w = W * .84; ph6_string(x0, x0 + w, H * .3, H * .11, w / 2, 0, BLUE, 3); ph6_string(x0, x0 + w, H * .68, H * .11, w / 4, 0, RED, 3);
    TB('40 Hz', x0 + w + 4, H * .3 - 24, BLUE_D, 14, 'right'); TB('80 Hz', x0 + w + 4, H * .68 - 24, DRED, 14, 'right'); ph_dim(x0, H * .45, x0 + w / 2, H * .45, 'λ', BLUE, 0); ph_dim(x0, H * .83, x0 + w / 4, H * .83, 'λ/2', RED, 0);
    ph_fade(p, 0, function () { tag('v inchangée · λ divisée par 2', W * .5, H * .95, DGREEN, 16); });
  },
  /* 6 corde de guitare */
  function (p) {
    var x0 = W * .1, x1 = W * .9, L = x1 - x0, y = H * .46, A0 = H * .2, c = p > 0 ? Math.cos(p * 9) : 1;
    ctx.strokeStyle = '#cfd6dd'; ctx.lineWidth = 2; ctx.beginPath(); for (var x = x0; x <= x1; x += 2) { var Y = y - A0 * Math.sin(3 * PI * (x - x0) / L); x === x0 ? ctx.moveTo(x, Y) : ctx.lineTo(x, Y); } ctx.stroke();
    ctx.beginPath(); for (x = x0; x <= x1; x += 2) { Y = y - A0 * c * Math.sin(3 * PI * (x - x0) / L); x === x0 ? ctx.moveTo(x, Y) : ctx.lineTo(x, Y); } ctx.strokeStyle = BLUE; ctx.lineWidth = 3.4; ctx.stroke();
    LN(x0, y - A0 - 8, x0, y + A0 + 8, INK, 4); LN(x1, y - A0 - 8, x1, y + A0 + 8, INK, 4); ph_dim(x0, H * .86, x1, H * .86, 'L = 0,65 m', GREY, 0); TB('f₁ = 110 Hz', W * .5, H * .1, ORANGE, 16);
    ph_fade(p, 0, function () { for (var k = 0; k <= 3; k++) DOT(x0 + L * k / 3, y, 6, DRED); tag('v = 143 m/s · 220 Hz · 330 Hz', W * .5, H * .22, DGREEN, 14); tag('n = 3 : λ = 0,43 m · nœuds tous les 0,22 m', W * .5, H * .76, DRED, 14); });
  },
  /* 7 fente et diffraction */
  function (p) {
    var sx = W * .08, wx = W * .42, cy = H * .5, lam = 14; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, wx, H); ctx.clip(); for (var k = 0; k < 14; k++) { var X = sx + k * lam; LN(X, 0, X, H, '#9ec5ee', 1.5); } ctx.restore();
    ctx.fillStyle = INK; ctx.fillRect(wx - 3, 0, 6, cy - 34); ctx.fillRect(wx - 3, cy + 34, 6, H - cy - 34); ph_dim(wx + 14, cy - 34, wx + 14, cy + 34, 'a', GREY, 12);
    ctx.save(); ctx.beginPath(); ctx.rect(wx, 0, W - wx, H); ctx.clip(); ph6_rings(wx, cy, lam, 3, 18, BLUE, -1.1, 1.1); ctx.restore(); tag('λ = 1,2 cm · a = 2,0 cm', W * .62, H * .08, INK, 14);
    ph_fade(p, 0, function () { var a = Math.asin(.6); LN(wx, cy, wx + 190 * Math.cos(a), cy - 190 * Math.sin(a), DRED, 2.4, [6, 4]); LN(wx, cy, wx + 190 * Math.cos(a), cy + 190 * Math.sin(a), DRED, 2.4, [6, 4]); tag('θ = 36,9°', wx + 130, cy - 80, DRED, 16); tag('a = 0,80 cm : pas de minimum', W * .5, H * .93, DGREEN, 14); });
  },
  /* 8 constructive ou destructive */
  function (p) {
    var P = { x: W * .78, y: H * .5 }, s1 = { x: W * .12, y: H * .3 }, s2 = { x: W * .12, y: H * .7 };
    ph6_rr(s1.x - 12, s1.y - 14, 24, 28, '#eef4fb', BLUE_D, 2); ph6_rr(s2.x - 12, s2.y - 14, 24, 28, '#eef4fb', BLUE_D, 2); LN(s1.x + 12, s1.y, P.x, P.y, BLUE, 2.2); LN(s2.x + 12, s2.y, P.x, P.y, RED, 2.2); DOT(P.x, P.y, 8, ORANGE);
    TB('P', P.x + 18, P.y + 5, ORANGE, 18); tag('3,0 m', W * .46, H * .32, BLUE_D, 15); tag('3,9 m', W * .46, H * .72, DRED, 15); TB('λ = 0,60 m, en phase', W * .5, H * .1, INK, 15);
    ph_fade(p, 0, function () { tag('Δ = 0,9 m = 1,5·λ', W * .5, H * .54, DGREEN, 17); tag('destructive : quasi-silence', W * .5, H * .93, DRED, 16); });
  },
  /* 9 deux fentes */
  function (p) {
    var fx = W * .16, cy = H * .5, Dp = H * .4 / .75, sx = fx + Dp; ctx.fillStyle = INK; ctx.fillRect(fx - 3, 0, 6, cy - 22); ctx.fillRect(fx - 3, cy - 12, 6, 24); ctx.fillRect(fx - 3, cy + 22, 6, H - cy - 22);
    ctx.fillStyle = '#fff'; ctx.fillRect(fx - 4, cy - 22, 8, 10); ctx.fillRect(fx - 4, cy + 12, 8, 10); LN(sx, 8, sx, H - 8, INK, 3); ph_dim(fx - 20, cy - 17, fx - 20, cy + 17, 'd', GREY, -12);
    tag('λ = 1,5 cm · d = 5,0 cm · D = 40 cm', W * .5, H * .97, INK, 13);
    ph_fade(p, 0, function () { [0, 17.46, -17.46, 36.87, -36.87].forEach(function (g) { var yy = cy - Math.tan(g * D2R) * Dp; LN(fx, cy, sx, yy, '#b9cfe6', 1.4); DOT(sx, yy, 5, DRED); });
      [64.16, -64.16].forEach(function (g) { var dy = -Math.sin(g * D2R) * 70, dx = Math.cos(g * D2R) * 70; A(fx, cy, dx, dy, '#b9cfe6', '', 1.6); });
      tag('m = 2 : 30,0 cm', sx + 62, cy - H * .4, BLUE_D, 13); tag('m = 1 : 12,6 cm', sx + 62, cy - H * .168, BLUE_D, 13); tag('0°, ±17,5°, ±36,9°, ±64,2°', W * .5, H * .86, DGREEN, 14); tag('7 maxima', sx + 52, cy + 4, DRED, 14); });
  },
  /* 10 tsunami */
  function (p) {
    var by = H * .86, x0 = W * .04, x1 = W * .96, shelf = W * .62; ctx.fillStyle = '#e9d9b8'; ctx.beginPath(); ctx.moveTo(x0, H); ctx.lineTo(x0, by - 56); ctx.lineTo(shelf - 40, by - 56); ctx.lineTo(shelf + 40, by - 8); ctx.lineTo(x1, by - 6); ctx.lineTo(x1, H); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(120,180,235,.35)'; ctx.fillRect(x0, H * .34, x1 - x0, H); ph6_string(x0, shelf - 20, H * .3, H * .05, W * .4, 0, BLUE, 3); ph6_string(shelf + 40, x1, H * .3, H * .11, W * .12, 0, BLUE, 3);
    TB('h = 4 000 m · v ≈ 198 m/s (713 km/h)', W * .3, H * .13, BLUE_D, 14); TB('h = 10 m · v ≈ 9,9 m/s', W * .8, H * .13, DRED, 13);
    ph_fade(p, 0, function () { tag('T ≈ 16,8 min', W * .3, H * .5, DGREEN, 15); tag('λ ≈ 10 km · amplitude ≈ 2,2 m', W * .72, H * .6, DGREEN, 14); });
  }
]);
