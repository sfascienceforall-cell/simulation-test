/* Physique 5e · chapitre 10 : électrocinétique, lois de Kirchhoff et générateurs */
function ph10_fade(p, a, fn) { var k = ph_ease(p, a, a + .25); if (k <= 0) return; ctx.globalAlpha = k; fn(); ctx.globalAlpha = 1; }
function ph10_frame(x0, y0, x1, y1) { LN(x0, y0, x1, y0, INK, 2.4); LN(x1, y0, x1, y1, INK, 2.4); LN(x1, y1, x0, y1, INK, 2.4); LN(x0, y1, x0, y0, INK, 2.4); }
function ph10_bat(x, y, vert, plusFirst, lab) { /* plusFirst : + en haut (vert) ou à gauche (horiz) */
  ctx.fillStyle = '#fff';
  if (vert) { ctx.fillRect(x - 20, y - 14, 40, 28); var yl = plusFirst ? y - 5 : y + 5, ys = plusFirst ? y + 5 : y - 5; LN(x - 16, yl, x + 16, yl, INK, 3.4); LN(x - 9, ys, x + 9, ys, INK, 3.4); LN(x, y - 14, x, yl, INK, 2.4); LN(x, ys, x, y + 14, INK, 2.4); TB('+', x + 24, (plusFirst ? y - 6 : y + 14), DRED, 14); if (lab) TB(lab, x - 24, y + 5, DRED, 14, 'right'); }
  else { ctx.fillRect(x - 14, y - 20, 28, 40); var xl = plusFirst ? x - 5 : x + 5, xs = plusFirst ? x + 5 : x - 5; LN(xl, y - 16, xl, y + 16, INK, 3.4); LN(xs, y - 9, xs, y + 9, INK, 3.4); TB('+', (plusFirst ? x - 14 : x + 14), y - 22, DRED, 14); if (lab) TB(lab, x, y + 36, DRED, 14); }
}
function ph10_res(x, y, w, h, lab, col) { ph_rr(x - w / 2, y - h / 2, w, h, '#fdf6e8', col || ORANGE, 2.2); if (lab) TB(lab, x, y + 5, ORANGE, Math.min(14, h * .7)); }
function ph10_curve(gx, gy, gw, gh, f, col, lw, n) { ctx.strokeStyle = col; ctx.lineWidth = lw || 3; ctx.beginPath(); n = n || 120; for (var i = 0; i <= n; i++) { var u = i / n, X = gx + gw * u, Y = gy - gh * f(u); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
function ph10_flow(x1, y1, x2, y2, t, col) { var L = Math.hypot(x2 - x1, y2 - y1); for (var k = 0; k < L / 26; k++) { var u = (((t * .01) + k * 26 / L) % 1); DOT(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u, 3.4, col); } }

SFA.theo("c10", {
  icon: function () {
    TB('Σ I = 0', W * .5, H * .3, BLUE_D, 34); TB('Σ U = 0', W * .5, H * .52, ORANGE, 30); TB('U = E − r·I', W * .5, H * .78, DRED, 22);
  },
  sub: [
    { t: "Lois de Kirchhoff",
      anim: function (t) {
        var nx = W * .3, ny = H * .5; DOT(nx, ny, 7, INK);
        LN(W * .04, H * .22, nx, ny, INK, 2.6); LN(W * .04, H * .78, nx, ny, INK, 2.6); LN(nx, ny, W * .56, H * .3, INK, 2.6); LN(nx, ny, W * .56, H * .7, INK, 2.6);
        ph10_flow(W * .04, H * .22, nx, ny, t * 3, ORA2); ph10_flow(W * .04, H * .78, nx, ny, t * 1.5, ORA2); ph10_flow(nx, ny, W * .56, H * .3, t * 2.2, ORA2); ph10_flow(nx, ny, W * .56, H * .7, t * 2.3, ORA2);
        TB('3,0 A', W * .08, H * .18, DRED, 14); TB('1,5 A', W * .08, H * .9, DRED, 14); TB('2,0 A', W * .56, H * .22, BLUE_D, 14); TB('I = 2,5 A', W * .56, H * .86, BLUE_D, 14);
        TB('Nœud : Σ I_entrants = Σ I_sortants', W * .3, H * .08, DGREEN, 15); TB('3,0 + 1,5 = 2,0 + 2,5', W * .3, H * .97, DGREEN, 14);
        var x0 = W * .66, y0 = H * .26, x1 = W * .95, y1 = H * .78; ph10_frame(x0, y0, x1, y1); ph10_bat(x0, (y0 + y1) / 2, true, true, 'E'); ph10_res(x1, (y0 + y1) / 2, 40, 26, 'R'); ph10_res((x0 + x1) / 2, y0, 40, 20, 'r');
        var u = (t * .01) % 1; DOT(x0 + (x1 - x0) * u, y0, 4, ORA2); TB('Maille : E − r·I − R·I = 0', (x0 + x1) / 2, H * .12, DGREEN, 14);
      },
      th: '<div class="tcard"><b class="h">Vocabulaire</b><p>Un <b>nœud</b> est un point où se rejoignent au moins trois fils ; une <b>branche</b> relie deux nœuds ; une <b>maille</b> est une boucle fermée de branches. Choisis d\'abord un <b>sens positif</b> pour chaque courant (le signe du résultat dira si le choix était bon) et un sens de parcours pour chaque maille.</p></div>' +
        '<div class="tcard"><b class="h">Loi des nœuds</b><p>La charge ne s\'accumule pas : <b>Σ I<sub>entrants</sub> = Σ I<sub>sortants</sub></b>. Exemple : 3,0 A et 1,5 A arrivent, 2,0 A repart : le dernier fil emporte 4,5 − 2,0 = 2,5 A.</p></div>' +
        '<div class="tcard"><b class="h">Loi des mailles</b><p>En parcourant une maille, la somme algébrique des tensions est nulle : <b>Σ U = 0</b>. Règle de signes : une f.é.m. compte + si on la traverse de − vers + (dans le sens de la flèche de la source) et − dans l\'autre cas ; une résistance traversée dans le sens du courant compte <b>−R·I</b>. Deux piles de 10 V et 4 V en opposition sur 3,0 Ω : 10 − 4 − 3,0·I = 0, donc I = 2,0 A.</p></div>' +
        '<div class="tcard"><b class="h">Méthode pour deux mailles</b><ol><li>Nomme I₁, I₂, I₃ et applique la loi des nœuds (I₃ = I₁ + I₂).</li><li>Écris une équation par maille indépendante.</li><li>Résous le système 2×2. Un courant négatif circule dans le sens opposé à celui choisi.</li><li>Vérifie par une maille non utilisée (la maille extérieure).</li></ol></div>' },
    { t: "Générateur réel et diviseur de tension",
      anim: function (t) {
        var E = 9, r = 1.5, Rm = 3 + 12 * (.5 + .5 * Math.sin(t * .012)), I = E / (Rm + r), U = E - r * I;
        var gx = W * .08, gy = H * .82, gw = W * .46, gh = H * .6; ph_axes(gx, gy, gw + 10, gh + 14, 'I (A)', 'U (V)');
        var X = function (i) { return gx + gw * i / 6; }, Y = function (u) { return gy - gh * u / 10; }; LN(X(0), Y(9), X(6), Y(9 - 1.5 * 6), BLUE, 3);
        TB('E = 9,0 V', gx + 6, Y(9) - 8, INK, 13, 'left'); TB('pente : −r', X(3.2), Y(5.1) - 16, DRED, 14); DOT(X(I), Y(U), 7, ORA2); LN(X(I), gy, X(I), Y(U), GREY, 1.2, [3, 4]); LN(gx, Y(U), X(I), Y(U), GREY, 1.2, [3, 4]);
        TB('U = E − r·I', W * .3, H * .08, BLUE_D, 16);
        var x0 = W * .66, y0 = H * .22, x1 = W * .94, y1 = H * .56; ph10_frame(x0, y0, x1, y1); ph10_bat(x0, (y0 + y1) / 2, true, true, 'E'); ph10_res(x1, (y0 + y1) / 2, 30, 22, 'R'); ph10_res((x0 + x1) / 2, y0, 36, 18, 'r');
        TB('I = ' + I.toFixed(2).replace('.', ',') + ' A', (x0 + x1) / 2, H * .72, DRED, 15); TB('U = ' + U.toFixed(2).replace('.', ',') + ' V', (x0 + x1) / 2, H * .85, BLUE_D, 15); TB('R = ' + Rm.toFixed(1).replace('.', ',') + ' Ω', (x0 + x1) / 2, H * .96, ORANGE, 14);
      },
      th: '<div class="tcard"><b class="h">Pile réelle</b><p>Un générateur réel équivaut à une f.é.m. <b>E</b> en série avec une <b>résistance interne r</b>. La tension à ses bornes est <b>U = E − r·I</b> : elle diminue quand le courant débité augmente. À vide (I = 0), U = E. Branchée sur R : <b>I = E/(R + r)</b>. Pile de 4,5 V, r = 1,5 Ω sur 7,5 Ω : I = 0,50 A, U = 3,75 V.</p></div>' +
        '<div class="tcard"><b class="h">Mesurer E et r</b><p>On mesure U à vide (= E), puis U pour un courant I connu : <b>r = (E − U)/I</b>. Une pile de 9,0 V qui tombe à 8,1 V sous 0,60 A a r = 0,9/0,60 = 1,5 Ω. La caractéristique U(I) est une droite de pente −r.</p></div>' +
        '<div class="tcard"><b class="h">Puissance et rendement</b><p>Puissance reçue par R : P = R·I² = E²·R/(R + r)². Elle est <b>maximale pour R = r</b> (P<sub>max</sub> = E²/4r) avec un rendement η = R/(R + r) de seulement 50 %. Pour 12 V et r = 0,50 Ω : R = 0,50 Ω donne 72 W ; R = 4,5 Ω donne 25,9 W mais η = 90 %.</p></div>' +
        '<div class="tcard"><b class="h">Diviseur de tension et appareils</b><p>Deux résistances en série sous U<sub>e</sub> : <b>U<sub>s</sub> = U<sub>e</sub>·R₂/(R₁ + R₂)</b>. Mais une charge ou un voltmètre branché en parallèle sur R₂ diminue la résistance du bas et la tension : 4,7 kΩ et 3,3 kΩ sous 12 V donnent 4,95 V, qui tombent à 3,12 V avec une charge de 3,3 kΩ. Un voltmètre doit avoir une résistance très grande. Pont de Wheatstone : équilibré (V<sub>A</sub> = V<sub>B</sub>) si R₁/R₂ = R<sub>x</sub>/R<sub>v</sub>.</p></div>' }
  ]
});

SFA.figs("c10", [
  /* 1 loi des nœuds */
  function (p) {
    var nx = W * .45, ny = H * .5; LN(W * .06, H * .25, nx, ny, INK, 3); LN(W * .06, H * .75, nx, ny, INK, 3); LN(nx, ny, W * .9, H * .3, INK, 3); LN(nx, ny, W * .9, H * .72, INK, 3); DOT(nx, ny, 8, INK);
    A(W * .12, H * .28, 50, 24, ORA2, '', 3); A(W * .12, H * .72, 50, -24, ORA2, '', 3); A(W * .62, H * .42, 60, -18, ORA2, '', 3);
    TB('3,0 A', W * .1, H * .18, DRED, 15); TB('1,5 A', W * .1, H * .9, DRED, 15); TB('2,0 A', W * .86, H * .2, BLUE_D, 15);
    if (p > 0) { A(W * .62, H * .6, 60, 18, GREEN, '', 3.4); tag('I = 2,5 A', W * .84, H * .86, DGREEN, 17); tag('3,0 + 1,5 = 2,0 + I', W * .5, H * .1, DGREEN, 15); } else TB('I = ?', W * .84, H * .86, GREY, 18);
  },
  /* 2 pile réelle */
  function (p) {
    var x0 = W * .2, x1 = W * .75, y0 = H * .3, y1 = H * .76, ym = (y0 + y1) / 2; ph10_frame(x0, y0, x1, y1); ph10_bat(x0, ym, true, true, ''); ph10_res(x1, ym, 56, 30, '7,5 Ω'); ph10_res((x0 + x1) / 2, y0, 56, 22, '1,5 Ω');
    TB('E = 4,5 V', x0 - 20, ym + 5, DRED, 14, 'right'); TB('r (pile)', (x0 + x1) / 2, y0 - 20, ORANGE, 13); TB('R', x1 + 36, ym + 5, ORANGE, 15, 'left');
    ph10_fade(p, 0, function () { A(x0 + 40, y1 + 0, 70, 0, RED, '', 3); TB('I = 0,50 A', W * .5, y1 + 26, DRED, 15); tag('U = E − r·I = 3,75 V', W * .5, H * .12, DGREEN, 17); });
  },
  /* 3 mesurer r */
  function (p) {
    var gx = W * .12, gy = H * .84, gw = W * .76, gh = H * .62; ph_axes(gx, gy, gw + 10, gh + 14, 'I (A)', 'U (V)'); var X = function (i) { return gx + gw * i / .8; }, Y = function (u) { return gy - gh * (u - 7) / 2.4; };
    TB('7', gx - 6, gy + 4, GREY, 11, 'right'); LN(X(0), Y(9), X(.8), Y(9 - 1.5 * .8), BLUE, 3); DOT(X(0), Y(9), 6, DRED); TB('9,0 V (à vide)', X(0) + 10, Y(9) - 10, DRED, 14, 'left'); DOT(X(.6), Y(8.1), 6, ORA2); TB('8,1 V à 0,60 A', X(.6) + 8, Y(8.1) - 12, ORANGE, 14, 'left');
    if (p > 0) { var q = ph_ease(p, 0, .5); ctx.globalAlpha = q; LN(X(.6), Y(9), X(.6), Y(8.1), DGREEN, 3); LN(X(0), Y(9), X(.6), Y(9), DGREEN, 1.4, [4, 4]); tag('chute 0,9 V', X(.6) + 56, Y(8.55), DGREEN, 14); tag('r = 0,9/0,60 = 1,5 Ω ; R = 13,5 Ω', W * .5, H * .08, DGREEN, 15); ctx.globalAlpha = 1; }
  },
  /* 4 pont diviseur et charge */
  function (p) {
    var x = W * .3, y0 = H * .14, y1 = H * .86; LN(x, y0, x, y0 + 14, INK, 2.4); ph10_res(x, y0 + 40, 30, 52, '', ORANGE); LN(x, y0 + 66, x, H * .5, INK, 2.4); ph10_res(x, H * .5 + 26, 30, 52, '', ORANGE); LN(x, H * .5 + 52, x, y1, INK, 2.4);
    TB('R₁ = 4,7 kΩ', x + 26, y0 + 44, ORANGE, 14, 'left'); TB('R₂ = 3,3 kΩ', x + 26, H * .5 + 30, ORANGE, 14, 'left'); TB('12 V', x - 18, H * .5 + 4, DRED, 15, 'right'); LN(x, H * .5, x + 150, H * .5, INK, 2.4, [4, 4]); DOT(x, H * .5, 4, INK);
    ph10_fade(p, 0, function () { tag('U_s = 4,95 V', W * .72, H * .3, DGREEN, 17); ph_rr(x + 150 - 27, H * .62, 54, 40, '#fdf6e8', ORANGE, 2); TB('3,3 kΩ', x + 150, H * .62 + 25, ORANGE, 13); LN(x + 150, H * .5, x + 150, H * .62, INK, 2.4); LN(x + 150, H * .62 + 40, x + 150, y1, INK, 2.4); LN(x, y1, x + 150, y1, INK, 2.4); tag('avec charge : 3,12 V', W * .72, H * .94, DRED, 16); });
  },
  /* 5 deux piles en opposition */
  function (p) {
    var x0 = W * .22, x1 = W * .76, y0 = H * .3, y1 = H * .76, ym = (y0 + y1) / 2; ph10_frame(x0, y0, x1, y1); ph10_bat(x0, ym, true, true, '10 V'); ph10_bat(x1, ym, true, false, ''); TB('4 V', x1 + 24, ym + 5, BLUE_D, 14, 'left'); ph10_res((x0 + x1) / 2, y0, 56, 22, '3,0 Ω');
    ctx.setLineDash([]); ph10_fade(p, 0, function () { A(x0 + 60, y0 - 22, 90, 0, RED, '', 3.2); TB('I = 2,0 A', W * .5, H * .88, DRED, 17); tag('10 − 4 − 3,0·I = 0', W * .5, H * .12, DGREEN, 16); });
  },
  /* 6 deux mailles */
  function (p) {
    var xl = W * .16, xm = W * .5, xr = W * .84, yt = H * .22, yb = H * .8, ym = (yt + yb) / 2; LN(xl, yt, xr, yt, INK, 2.4); LN(xl, yb, xr, yb, INK, 2.4); LN(xl, yt, xl, yb, INK, 2.4); LN(xm, yt, xm, yb, INK, 2.4); LN(xr, yt, xr, yb, INK, 2.4);
    ph10_bat(xl, yt + 46, true, true, ''); ph10_res(xl, yb - 46, 28, 46, '', ORANGE); ph10_res(xm, ym, 28, 56, '', ORANGE); ph10_bat(xr, yt + 46, true, true, ''); ph10_res(xr, yb - 46, 28, 46, '', ORANGE);
    TB('E₁ 12 V', xl - 22, yt + 50, DRED, 13, 'right'); TB('R₁ 2 Ω', xl - 22, yb - 42, ORANGE, 13, 'right'); TB('R₃ 6 Ω', xm + 22, ym + 5, ORANGE, 13, 'left'); TB('E₂ 6 V', xr + 22, yt + 50, DRED, 13, 'left'); TB('R₂ 3 Ω', xr + 22, yb - 42, ORANGE, 13, 'left');
    ph10_fade(p, 0, function () { A(xl + 30, ym - 20, 0, -34, RED, '', 3); TB('I₁ = 2,0 A', xl + 12, ym - 44, DRED, 13, 'left'); A(xm - 30, ym - 28, 0, 34, GREEN, '', 3); TB('I₃ = 1,33 A', xm - 36, ym + 30, DGREEN, 13, 'right'); A(xr - 30, ym - 20, 0, 34, BLUE, '', 3); TB('I₂ = −0,67 A', xr - 38, ym - 30, BLUE_D, 13, 'right'); });
  },
  /* 7 adaptation de puissance */
  function (p) {
    var gx = W * .12, gy = H * .84, gw = W * .78, gh = H * .6; ph_axes(gx, gy, gw + 10, gh + 14, 'R (Ω)', 'P (W)'); var Pf = function (R) { return 144 * R / ((R + .5) * (R + .5)); };
    ph10_curve(gx, gy, gw, gh, function (u) { return Pf(.02 + u * 5) / 80; }, BLUE, 3.2); var X = function (R) { return gx + gw * (R - .02) / 5; }, Y = function (P) { return gy - gh * P / 80; };
    TB('E = 12 V ; r = 0,50 Ω', W * .62, H * .14, INK, 14); DOT(X(4.5), Y(Pf(4.5)), 5, ORANGE); TB('4,5 Ω : 26 W', X(4.5) - 6, Y(Pf(4.5)) - 26, ORANGE, 13, 'right');
    if (p > 0) { var q = ph_ease(p, 0, .4); ctx.globalAlpha = q; DOT(X(.5), Y(72), 7, DRED); LN(X(.5), gy, X(.5), Y(72), GREY, 1.2, [3, 4]); tag('R = r : 72 W (η = 50 %)', W * .6, H * .3, DGREEN, 15); ctx.globalAlpha = 1; }
  },
  /* 8 voltmètre qui perturbe */
  function (p) {
    var x = W * .3, y0 = H * .12, y1 = H * .88, ym = H * .5; ph10_res(x, y0 + 34, 28, 54, '', ORANGE); LN(x, y0, x, y0 + 7, INK, 2.4); LN(x, y0 + 61, x, ym, INK, 2.4); ph10_res(x, ym + 36, 28, 54, '', ORANGE); LN(x, ym + 63, x, y1, INK, 2.4);
    TB('10 kΩ', x + 24, y0 + 38, ORANGE, 14, 'left'); TB('10 kΩ', x + 24, ym + 40, ORANGE, 14, 'left'); TB('12 V', x - 18, ym + 4, DRED, 15, 'right');
    var vx = W * .72; LN(x, ym, vx, ym, INK, 2.4); LN(x, y1, vx, y1, INK, 2.4); LN(vx, ym, vx, ym + 22, INK, 2.4); LN(vx, ym + 74, vx, y1, INK, 2.4); DOT(vx, ym + 48, 26, '#fff'); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(vx, ym + 48, 26, 0, 7); ctx.stroke(); TB('V', vx, ym + 55, BLUE_D, 22);
    TB('10 kΩ', vx + 34, ym + 52, BLUE_D, 13, 'left'); ph10_fade(p, 0, function () { tag('lit 4,0 V (et non 6,0 V)', W * .56, H * .08, DGREEN, 16); tag('R_éq = 5 kΩ', W * .6, H * .93, DRED, 15); }); if (p <= 0) TB('lit … ?', W * .56, H * .08, GREY, 18);
  },
  /* 9 pont de Wheatstone */
  function (p) {
    var cx = W * .4, cy = H * .5, d = H * .36, top = { x: cx, y: cy - d }, bot = { x: cx, y: cy + d }, L = { x: cx - d, y: cy }, R = { x: cx + d, y: cy };
    function seg(a, b, lab, off) { LN(a.x, a.y, b.x, b.y, INK, 2.4); var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; ph_rr(mx - 20, my - 10, 40, 20, '#fdf6e8', ORANGE, 2); TB(lab, mx + off, my + 4, ORANGE, 12); }
    ctx.save(); ctx.fillStyle = '#fff';
    LN(top.x, top.y, L.x, L.y, INK, 2.4); LN(top.x, top.y, R.x, R.y, INK, 2.4); LN(L.x, L.y, bot.x, bot.y, INK, 2.4); LN(R.x, R.y, bot.x, bot.y, INK, 2.4); ctx.restore();
    function bx(a, b, lab, ox, oy) { var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; ph_rr(mx - 19, my - 10, 38, 20, '#fdf6e8', ORANGE, 2); TB(lab, mx + ox, my + oy, ORANGE, 12); }
    bx(top, L, '', 0, 0); bx(L, bot, '', 0, 0); bx(top, R, '', 0, 0); bx(R, bot, '', 0, 0);
    TB('R₁ 1 000', (top.x + L.x) / 2 - 30, (top.y + L.y) / 2 - 12, ORANGE, 12, 'right'); TB('R₂ 100', (L.x + bot.x) / 2 - 24, (L.y + bot.y) / 2 + 22, ORANGE, 12, 'right'); TB('R_x', (top.x + R.x) / 2 + 28, (top.y + R.y) / 2 - 10, ORANGE, 13, 'left'); TB('R_v', (R.x + bot.x) / 2 + 28, (R.y + bot.y) / 2 + 22, ORANGE, 13, 'left');
    LN(L.x, L.y, R.x, R.y, GREY, 1.6, [5, 4]); DOT(L.x, L.y, 5, INK); DOT(R.x, R.y, 5, INK); TB('A', L.x - 14, L.y + 5, INK, 14); TB('B', R.x + 14, R.y + 5, INK, 14); TB('10 V', top.x, top.y - 12, DRED, 14);
    ph10_fade(p, 0, function () { tag('équilibre : R_x = 3 300 Ω', W * .8, H * .22, DGREEN, 14); tag('R_v = 300 Ω : U_AB ≈ 76 mV', W * .72, H * .92, DRED, 13); });
  },
  /* 10 deux piles en parallèle */
  function (p) {
    var x0 = W * .12, x1 = W * .86, y0 = H * .3, y1 = H * .78, xa = W * .3, xb = W * .5; LN(x0, y0, x1, y0, INK, 2.4); LN(x0, y1, x1, y1, INK, 2.4); LN(x0, y0, x0, y1, INK, 2.4); LN(xa, y0, xa, y1, INK, 2.4); LN(x1, y0, x1, y1, INK, 2.4);
    var ym = (y0 + y1) / 2; ph10_bat(x0, ym - 20, true, true, ''); ph10_res(x0, ym + 40, 24, 36, '', ORANGE); ph10_bat(xa, ym - 20, true, true, ''); ph10_res(xa, ym + 40, 24, 36, '', ORANGE); ph10_res(x1, ym, 28, 50, '', ORANGE);
    TB('E, r', x0 + 18, ym + 10, DRED, 13, 'left'); TB('E, r', xa + 18, ym + 10, DRED, 13, 'left'); TB('R', x1 - 22, ym + 5, ORANGE, 15, 'right');
    ph10_fade(p, 0, function () { tag('équivalent : E et r/2', W * .5, H * .12, DGREEN, 17); TB('chaque pile débite I/2', W * .5, H * .93, DRED, 15); A(x0 + 10, y0 - 14, 60, 0, RED, '', 3); });
  }
]);
