/* Physique 5e · chapitre 9 : potentiel, énergie électrique et condensateur */
function ph9_capV(x, y, h, gap, qk) { /* condensateur dessiné verticalement (plaques horizontales de largeur h), qk = remplissage 0..1 */
  ctx.fillStyle = 'rgba(226,75,74,' + (.15 + .5 * qk) + ')'; ctx.fillRect(x - h / 2, y - gap / 2 - 5, h, 5);
  ctx.fillStyle = 'rgba(55,138,221,' + (.15 + .5 * qk) + ')'; ctx.fillRect(x - h / 2, y + gap / 2, h, 5);
  LN(x - h / 2, y - gap / 2, x + h / 2, y - gap / 2, RED, 3); LN(x - h / 2, y + gap / 2, x + h / 2, y + gap / 2, BLUE, 3);
}
function ph9_cap(x, y, h, gap) { /* symbole : plaques verticales, fils horizontaux */
  LN(x - gap / 2, y - h / 2, x - gap / 2, y + h / 2, INK, 3.4); LN(x + gap / 2, y - h / 2, x + gap / 2, y + h / 2, INK, 3.4);
}
function ph9_bat(x, y, h) { LN(x - 5, y - h / 2, x - 5, y + h / 2, INK, 3.4); LN(x + 5, y - h * .3, x + 5, y + h * .3, INK, 3.4); TB('+', x - 14, y - h / 2 + 4, DRED, 13); }
function ph9_res(x, y, w) { ph_rr(x - w / 2, y - 9, w, 18, '#fdf6e8', ORANGE, 2); }
function ph9_dim(x1, y1, x2, y2, lab, col) { LN(x1, y1, x2, y2, col, 1.6); var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1; A(x1, y1, dx / l * 8, dy / l * 8, col, '', 1.6); A(x2, y2, -dx / l * 8, -dy / l * 8, col, '', 1.6); tag(lab, (x1 + x2) / 2 + 36 * (dy ? 1 : 0), (y1 + y2) / 2 - 8 * (dy ? 0 : -2), col === GREY ? INK : col, 13); }
function ph9_fade(p, a, fn) { var k = ph_ease(p, a, a + .25); if (k <= 0) return; ctx.globalAlpha = k; fn(); ctx.globalAlpha = 1; }
function ph9_curve(gx, gy, gw, gh, tmax, f, col, lw) { ctx.strokeStyle = col; ctx.lineWidth = lw || 3; ctx.beginPath(); for (var i = 0; i <= 120; i++) { var tt = tmax * i / 120, X = gx + gw * i / 120, Y = gy - gh * f(tt); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }

SFA.theo("c09", {
  icon: function () {
    TB('W = q·U', W * .5, H * .3, BLUE_D, 34); TB('E = ½·C·U²', W * .5, H * .52, ORANGE, 24);
    var gx = W * .22, gy = H * .88, gw = W * .56, gh = H * .22; ph9_curve(gx, gy, gw, gh, 5, function (t) { return 1 - Math.exp(-t); }, RED, 3); LN(gx, gy, gx + gw, gy, GREY, 1.4); TB('τ = R·C', W * .5, H * .96, GREY, 13);
  },
  sub: [
    { t: "Potentiel, tension et énergie",
      anim: function (t) {
        var s = (t % 260) / 260, e = s < .85 ? s / .85 : 1, xL = W * .1, xR = W * .56, yT = H * .22, yB = H * .74;
        ctx.fillStyle = RED; ctx.fillRect(xL - 6, yT, 6, yB - yT); ctx.fillStyle = BLUE; ctx.fillRect(xR, yT, 6, yB - yT);
        TB('A', xL - 3, yT - 8, DRED, 15); TB('B', xR + 3, yT - 8, BLUE_D, 15); TB('V_A = 300 V', xL - 3, yB + 22, DRED, 13, 'left'); TB('V_B = 100 V', xR + 3, yB + 22, BLUE_D, 13, 'right');
        for (var y = yT + 22; y < yB; y += 36) A(xL + 14, y, xR - xL - 28, 0, '#d0d4d9', '', 1.5);
        var cx = xL + 12 + e * (xR - xL - 24), cy = (yT + yB) / 2; chg(cx, cy, 11, 1); A(cx + 13, cy, 28 + 26 * e, 0, RED, '', 3.4);
        var bx = W * .68, bw = W * .26, by = H * .78, hh = H * .56, fr = e;
        TB('U_AB = V_A − V_B = 200 V', W * .5, H * .08, BLUE_D, 16);
        ctx.fillStyle = '#eef0f2'; ctx.fillRect(bx, by - hh, bw / 2 - 4, hh); ctx.fillStyle = '#eef0f2'; ctx.fillRect(bx + bw / 2 + 4, by - hh, bw / 2 - 4, hh);
        ctx.fillStyle = ORANGE; ctx.fillRect(bx, by - hh * fr, bw / 2 - 4, hh * fr); ctx.fillStyle = RED; ctx.fillRect(bx + bw / 2 + 4, by - hh * fr, bw / 2 - 4, hh * fr);
        TB('énergie', bx + bw / 4 - 2, by + 18, ORANGE, 12); TB('cinétique', bx + bw / 4 - 2, by + 32, ORANGE, 12); TB('q·U_AB', bx + bw * .75 + 2, by + 18, DRED, 13);
        TB('W = q·U = ΔE_c', W * .5, H * .93, DGREEN, 16);
      },
      th: '<div class="tcard"><b class="h">Potentiel et tension</b><p>Le <b>potentiel électrique</b> V en un point (en volts, 1 V = 1 J/C) mesure l\'énergie potentielle par coulomb. La <b>tension</b> (différence de potentiel) entre A et B est <b>U<sub>AB</sub> = V<sub>A</sub> − V<sub>B</sub></b>. Une charge positive est poussée par le champ vers les potentiels décroissants ; une charge négative va vers les potentiels croissants. Dans un champ uniforme : <b>U = E·d</b> (E en V/m).</p></div>' +
        '<div class="tcard"><b class="h">Travail électrique et énergie cinétique</b><p>Le travail du champ pour déplacer une charge q de A à B vaut <b>W = q·U<sub>AB</sub></b> (en J, avec q en C et U en V), quel que soit le chemin. S\'il n\'y a pas d\'autre force : W = ΔE<sub>c</sub>, donc <b>q·U = ½·m·v² − ½·m·v₀²</b>. Partant du repos : <b>v = √(2·q·U/m)</b>. L\'<b>électronvolt</b> : 1 eV = 1,6·10<sup>−19</sup> J, énergie gagnée par un électron sous 1 V.</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré</b><p>Une charge de +2,0 µC et de masse 1,0 g va de V<sub>A</sub> = 300 V à V<sub>B</sub> = 100 V : U<sub>AB</sub> = 200 V, W = 2,0·10<sup>−6</sup> × 200 = 4,0·10<sup>−4</sup> J, donc v = √(2 × 4,0·10<sup>−4</sup>/1,0·10<sup>−3</sup>) ≈ 0,89 m/s. Un électron accéléré sous 100 V gagne 100 eV = 1,6·10<sup>−17</sup> J et atteint 5,9·10<sup>6</sup> m/s.</p></div>' +
        '<div class="tcard"><b class="h">Pièges</b><ul><li>Convertis toujours en unités SI (µC → C, g → kg, kV → V).</li><li>Le signe de W dépend du sens : vérifie qu\'une charge + « descend » bien le potentiel.</li><li>Au-delà de quelques centaines de kV, la formule classique donne v &gt; c : il faut alors la relativité.</li></ul></div>' },
    { t: "Condensateur, charge et décharge",
      anim: function (t) {
        var tau = 1, T = (t % 420) / 420 * 5.2, ch = T < 5 ? 1 - Math.exp(-T / tau) : 1;
        var gx = W * .08, gy = H * .84, gw = W * .46, gh = H * .6; ph_axes(gx, gy, gw + 10, gh + 12, 't', 'U_C');
        LN(gx, gy - gh, gx + gw, gy - gh, GREY, 1.2, [4, 4]); TB('E', gx - 8, gy - gh + 4, INK, 13, 'right');
        ph9_curve(gx, gy, gw, gh, 5.2, function (tt) { return 1 - Math.exp(-tt / tau); }, '#cfd6dd', 2.4);
        ctx.save(); ctx.beginPath(); ctx.rect(gx, 0, gw * T / 5.2, H); ctx.clip(); ph9_curve(gx, gy, gw, gh, 5.2, function (tt) { return 1 - Math.exp(-tt / tau); }, RED, 3.2); ctx.restore();
        DOT(gx + gw * T / 5.2, gy - gh * ch, 6, ORA2); LN(gx + gw / 5.2, gy, gx + gw / 5.2, gy - gh * .632, GREY, 1.2, [3, 4]); DOT(gx + gw / 5.2, gy - gh * .632, 4, DRED); TB('τ : 63 %', gx + gw / 5.2 + 8, gy - gh * .632 + 16, DRED, 12, 'left'); TB('τ', gx + gw / 5.2, gy + 16, INK, 13);
        var cx = W * .76, cy = H * .52; ph9_capV(cx, cy, 96, 36 + 0, ch); TB('+Q', cx + 66, cy - 22, DRED, 14); TB('−Q', cx + 66, cy + 28, BLUE_D, 14);
        TB('U_C = ' + (9 * ch).toFixed(1).replace('.', ',') + ' V', cx, H * .13, DRED, 16); TB('Q = C·U_C', cx, H * .92, BLUE_D, 15);
        TB('U_C = E(1 − e^(−t/RC))', W * .3, H * .08, BLUE_D, 15);
      },
      th: '<div class="tcard"><b class="h">Capacité et énergie</b><p>Un <b>condensateur</b> est formé de deux conducteurs (armatures) séparés par un isolant. Sous la tension U, il porte les charges +Q et −Q : <b>Q = C·U</b> (C en farads, 1 F = 1 C/V ; on utilise µF, nF, pF). Pour deux plaques parallèles : C = ε₀·S/d. Il stocke l\'énergie <b>E = ½·C·U² = ½·Q·U</b>. Exemple : 470 µF sous 12 V : Q = 5,64 mC et E ≈ 34 mJ. Doubler U double Q mais multiplie E par 4.</p></div>' +
        '<div class="tcard"><b class="h">Charge à travers une résistance</b><p>Branché sur un générateur de f.é.m. E via une résistance R, le condensateur se charge : <b>U<sub>C</sub>(t) = E·(1 − e<sup>−t/τ</sup>)</b>, avec la <b>constante de temps τ = R·C</b> (en s). Le courant initial vaut E/R puis décroît vers 0. À t = τ, U<sub>C</sub> = 63 % de E ; à 3τ, 95 % ; à 5τ, 99 %. Pour la décharge : <b>U<sub>C</sub> = U₀·e<sup>−t/τ</sup></b> (37 % à τ).</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré</b><p>C = 47 µF, R = 22 kΩ, E = 9,0 V : τ = 22·10³ × 47·10<sup>−6</sup> ≈ 1,03 s. Après 1,0 s : U<sub>C</sub> = 9,0 × (1 − e<sup>−0,97</sup>) ≈ 5,6 V. Pour atteindre 99 % : t = τ·ln 100 ≈ 4,8 s. Doubler R double τ, mais la tension finale reste E.</p></div>' +
        '<div class="tcard"><b class="h">Bilan d\'énergie</b><p>Pour charger C sous E, le générateur fournit Q·E = C·E² ; le condensateur ne stocke que ½·C·E². L\'autre moitié est <b>dissipée par effet Joule dans R</b>, quelle que soit la valeur de R. Un flash photo (150 µF, 330 V) stocke ≈ 8,2 J qu\'il libère en 1 ms : P ≈ 8 kW.</p></div>' }
  ]
});

SFA.figs("c09", [
  /* 1 électron accéléré par 100 V */
  function (p) {
    var xL = W * .16, xR = W * .8, yT = H * .2, yB = H * .8, cy = H * .5; ctx.fillStyle = BLUE; ctx.fillRect(xL - 6, yT, 6, yB - yT); ctx.fillStyle = RED; ctx.fillRect(xR, yT, 6, yB - yT);
    TB('−', xL - 16, yT + 8, BLUE_D, 18); TB('+', xR + 18, yT + 8, DRED, 18); for (var y = yT + 20; y < yB; y += 36) A(xR - 14, y, -(xR - xL - 30), 0, '#e1e4e8', '', 1.4);
    var e = ph_ease(p, 0, .7), ex = xL + 18 + e * (xR - xL - 60); chg(ex, cy, 11, -1);
    if (p > 0) A(ex + 14, cy, 20 + 70 * e, 0, ORA2, '', 3.6);
    TB('U = 100 V', W * .5, yB + 24, INK, 15); TB('e⁻ au repos', xL + 18, cy + 30, BLUE_D, 13, 'left');
    if (p > .55) { tag('E_c = q·U = 100 eV = 1,6·10⁻¹⁷ J', W * .5, H * .1, DGREEN, 15); tag('v ≈ 5,9·10⁶ m/s', W * .5, H * .22, BLUE_D, 15); }
  },
  /* 2 condensateur 470 µF, 12 V */
  function (p) {
    var x0 = W * .2, x1 = W * .66, y0 = H * .3, y1 = H * .72, ym = (y0 + y1) / 2;
    LN(x0, y0, x1 - 7, y0, INK, 2.4); LN(x1 - 7, y0, x1 - 7, ym - 22, INK, 2.4); LN(x1 + 7, y1, x1 + 7, ym + 22, INK, 2.4); LN(x0, y1, x1 + 7, y1, INK, 2.4);
    LN(x0, y0, x0, ym - 24, INK, 2.4); LN(x0, ym + 24, x0, y1, INK, 2.4); ph9_bat(x0, ym, 44);
    ctx.strokeStyle = INK; ctx.lineWidth = 3.4; LN(x1 - 7, ym - 22, x1 - 7, ym + 22, INK, 3.4); LN(x1 + 7, ym - 22, x1 + 7, ym + 22, INK, 3.4);
    TB('12 V', x0 - 18, ym + 34, DRED, 15, 'right'); TB('470 µF', x1 + 24, ym + 5, BLUE_D, 16, 'left');
    ph9_fade(p, 0, function () { tag('Q = C·U = 5,64 mC', W * .5, H * .12, DGREEN, 17); tag('E = ½·C·U² ≈ 34 mJ', W * .5, H * .9, BLUE_D, 17); });
  },
  /* 3 travail entre deux points */
  function (p) {
    var gx = W * .1, gy = H * .82, gw = W * .8, gh = H * .56; LN(gx, gy, gx + gw, gy, GREY, 1.4); LN(gx, gy, gx, gy - gh - 8, GREY, 1.6); TB('V (V)', gx + 6, gy - gh - 12, GREY, 12, 'left');
    var VY = function (v) { return gy - gh * v / 330; }; LN(gx + gw * .15, VY(300), gx + gw * .85, VY(100), BLUE, 2.6, [6, 5]);
    var xa = gx + gw * .15, xb = gx + gw * .85; DOT(xa, VY(300), 6, DRED); DOT(xb, VY(100), 6, BLUE_D); TB('A : 300 V', xa, VY(300) - 14, DRED, 14); TB('B : 100 V', xb, VY(100) + 24, BLUE_D, 14);
    var e = ph_ease(p, 0, .6), cx = xa + (xb - xa) * e, cy = VY(300) + (VY(100) - VY(300)) * e; chg(cx, cy - 16, 11, 1); TB('+2,0 µC', cx, cy - 36, DRED, 12);
    if (p > .5) { ph9_dim(xa - 22, VY(100), xa - 22, VY(300), 'U_AB = 200 V', DGREEN); LN(xa - 22, VY(100), xa + 6, VY(100), '#cfd4da', 1.2, [3, 4]); tag('W = q·U = 4,0·10⁻⁴ J → v ≈ 0,89 m/s', W * .52, H * .1, DGREEN, 14); }
  },
  /* 4 constante de temps */
  function (p) {
    var gx = W * .12, gy = H * .84, gw = W * .76, gh = H * .6, tau = 1.034; ph_axes(gx, gy, gw + 10, gh + 14, 't (s)', 'U_C (V)');
    LN(gx, gy - gh, gx + gw, gy - gh, GREY, 1.2, [4, 4]); TB('9,0 V', gx - 6, gy - gh + 4, INK, 12, 'right');
    ph9_curve(gx, gy, gw, gh, 6, function (t) { return 1 - Math.exp(-t / tau); }, RED, 3.2); var X = function (t) { return gx + gw * t / 6; }, Y = function (v) { return gy - gh * v; };
    DOT(X(tau), Y(.632), 5, DRED); LN(X(tau), gy, X(tau), Y(.632), GREY, 1.2, [3, 4]); TB('τ ≈ 1,03 s', X(tau), gy + 17, DRED, 13);
    TB('R = 22 kΩ · C = 47 µF', W * .6, H * .1, INK, 14);
    if (p > 0) { var q = ph_ease(p, 0, .4); ctx.globalAlpha = q; DOT(X(1), Y(1 - Math.exp(-1 / tau)), 6, DGREEN); tag('1,0 s → 5,6 V', X(1) + 10, Y(.62) + 34, DGREEN, 14); DOT(X(4.76), Y(.99), 6, ORA2); LN(X(4.76), gy, X(4.76), Y(.99), GREY, 1.2, [3, 4]); tag('99 % à 4,8 s', X(4.76) - 20, Y(.99) + 26, ORANGE, 14); ctx.globalAlpha = 1; }
  },
  /* 5 doubler la tension */
  function (p) {
    var by = H * .84, bw = W * .13, hh = H * .56, xs = [W * .14, W * .3, W * .56, W * .72], lab = ['Q', 'Q′', 'E', 'E′'], v = [1, 2, 1, 4], col = [BLUE, BLUE, ORANGE, ORANGE];
    LN(W * .08, by, W * .92, by, GREY, 1.4);
    for (var i = 0; i < 4; i++) { var k = i % 2 ? (p > 0 ? ph_ease(p, 0, .6) : 0) : 1, hv = hh * .22 * (1 + (v[i] - 1) * k) * (i < 2 ? 1.6 : 1); ctx.fillStyle = col[i] + (i % 2 ? '' : '88'); ctx.fillRect(xs[i], by - hv, bw, hv); TB(lab[i], xs[i] + bw / 2, by + 17, INK, 14); }
    TB('Q = C·U', (xs[0] + xs[1] + bw) / 2, H * .1, BLUE_D, 16); TB('E = ½·C·U²', (xs[2] + xs[3] + bw) / 2, H * .1, ORANGE, 16); TB('U → 2U', W * .5, H * .22, INK, 15);
    if (p > .6) { tag('× 2', xs[1] + bw / 2, by - hh * .22 * 3.2 - 12, DGREEN, 16); tag('× 4', xs[3] + bw / 2, by - hh * .22 * 4 - 12, DGREEN, 16); }
  },
  /* 6 le flash */
  function (p) {
    var cx = W * .26, cy = H * .5; ph9_capV(cx, cy, 90, 30, 1); TB('150 µF', cx, cy + 56, BLUE_D, 15); TB('330 V', cx, cy - 52, DRED, 15);
    var lx = W * .66, ly = H * .46; ctx.fillStyle = '#fff6c2'; ctx.beginPath(); ctx.moveTo(lx - 16, ly - 56); ctx.lineTo(lx + 22, ly - 56); ctx.lineTo(lx + 2, ly - 8); ctx.lineTo(lx + 28, ly - 8); ctx.lineTo(lx - 18, ly + 62); ctx.lineTo(lx - 6, ly + 8); ctx.lineTo(lx - 28, ly + 8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.stroke();
    if (p > 0) for (var i = 0; i < 8; i++) { var a = i * PI / 4 + .2; LN(lx + 44 * Math.cos(a), ly + 44 * Math.sin(a) + 2, lx + 66 * Math.cos(a), ly + 66 * Math.sin(a) + 2, YEL, 3); }
    A(cx + 60, cy, 80, 0, GREY, '', 2.4);
    ph9_fade(p, 0, function () { tag('E = ½·C·U² ≈ 8,2 J', W * .3, H * .12, DGREEN, 15); tag('P ≈ 8,2 kW en 1 ms', W * .66, H * .9, DRED, 15); tag('≈ 0,83 m pour 1 kg', W * .3, H * .9, BLUE_D, 14); });
  },
  /* 7 formule classique */
  function (p) {
    var gx = W * .12, gy = H * .84, gw = W * .78, gh = H * .62; ph_axes(gx, gy, gw + 10, gh + 14, 'U (kV)', 'v/c');
    var X = function (u) { return gx + gw * u / 300; }, Y = function (v) { return gy - gh * v / 1.2; };
    LN(gx, Y(1), gx + gw, Y(1), DRED, 2, [6, 5]); TB('c', gx - 8, Y(1) + 4, DRED, 14, 'right');
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var u = 0; u <= 300; u += 5) { var v = Math.sqrt(u / 255.9); u ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)); } ctx.stroke();
    TB('formule classique', X(205), Y(.5), BLUE_D, 14);
    DOT(X(5), Y(Math.sqrt(5 / 255.9)), 5, ORA2); TB('5 kV : 0,14 c', X(5) + 10, Y(.14) - 6, ORANGE, 13, 'left');
    if (p > 0) { var q = ph_ease(p, 0, .5); ctx.globalAlpha = q; DOT(X(255.9), Y(1), 7, DRED); LN(X(255.9), gy, X(255.9), Y(1), GREY, 1.2, [3, 4]); tag('256 kV → v = c ?!', X(255.9) - 20, Y(1) + 30, DRED, 15); tag('au-delà : v > c, impossible', W * .5, H * .08, DGREEN, 14); ctx.globalAlpha = 1; }
  },
  /* 8 doubler la résistance */
  function (p) {
    var gx = W * .1, gy = H * .84, gw = W * .8, gh = H * .56; ph_axes(gx, gy, gw + 10, gh + 14, 't', 'U_C'); LN(gx, gy - gh, gx + gw, gy - gh, GREY, 1.2, [4, 4]); TB('E', gx - 6, gy - gh + 4, INK, 14, 'right');
    ph9_curve(gx, gy, gw, gh, 8, function (t) { return 1 - Math.exp(-t / 1); }, BLUE, 3.2); TB('R', gx + gw * .2, gy - gh * .9, BLUE_D, 16);
    var q = ph_ease(p, 0, .6); if (p > 0) { ctx.globalAlpha = q; ph9_curve(gx, gy, gw, gh, 8, function (t) { return 1 - Math.exp(-t / 2); }, RED, 3.2); TB('2R', gx + gw * .5, gy - gh * .55, DRED, 16); ctx.globalAlpha = 1; }
    if (p > .5) { tag('τ → 2τ', W * .55, H * .1, DGREEN, 16); tag('même tension finale E', W * .5, gy - gh - 12, INK, 13); }
    else TB('τ = R·C', W * .5, H * .1, GREY, 16);
  },
  /* 9 bilan d'énergie */
  function (p) {
    var x0 = W * .1, wBar = W * .8, y = H * .36, h = 52, tot = 8.1; ph_rr(x0, y, wBar, h, '#fbeedd', ORANGE, 2); TB('Énergie fournie par le générateur : Q·E = 8,1 mJ', W * .5, y - 14, ORANGE, 15); TB('100 %', W * .5, y + 32, ORANGE, 18);
    if (p > 0) { var q = ph_ease(p, 0, .6); ph_rr(x0, y + 80, wBar / 2 * q, h, '#e6f1fb', BLUE_D, 2); ph_rr(x0 + wBar / 2, y + 80, wBar / 2 * q, h, '#fcebeb', DRED, 2);
      if (q > .95) { TB('condensateur', x0 + wBar / 4, y + 80 + 28, BLUE_D, 14); TB('½·C·E² = 4,05 mJ', x0 + wBar / 4, y + 80 + 46, BLUE_D, 13); TB('chaleur dans R', x0 + wBar * .75, y + 80 + 28, DRED, 14); TB('4,05 mJ (50 %)', x0 + wBar * .75, y + 80 + 46, DRED, 13); } }
    else TB('100 µF · 47 kΩ · 9,0 V', W * .5, y + 98, GREY, 16);
    TB('τ = 4,7 s ; 95 % à ≈ 14 s ; I₀ ≈ 0,19 mA', W * .5, H * .12, p > .6 ? DGREEN : GREY, 14);
  },
  /* 10 électron entre plaques */
  function (p) {
    var xL = W * .08, xR = W * .64, yT = H * .22, yB = H * .76, cy = (yT + yB) / 2; ctx.fillStyle = BLUE; ctx.fillRect(xL - 6, yT, 6, yB - yT); ctx.fillStyle = RED; ctx.fillRect(xR, yT, 6, yB - yT);
    TB('−', xL - 14, yT + 8, BLUE_D, 17); TB('+', xR + 16, yT + 8, DRED, 17); for (var y = yT + 18; y < yB; y += 34) A(xR - 12, y, -(xR - xL - 26), 0, '#e1e4e8', '', 1.4);
    LN((xL + xR) / 2, yT, (xL + xR) / 2, yB, GREY, 1.2, [4, 4]); TB('mi-chemin', (xL + xR) / 2, yT - 8, GREY, 12); ph9_dim(xL, yB + 22, xR, yB + 22, 'd = 2,0 cm · U = 400 V', GREY, 0);
    var e = ph_ease(p, 0, .6), ex = xL + 16 + e * (xR - xL - 34); chg(ex, cy, 10, -1);
    var gx = W * .72, gy = H * .76, gh = H * .5; LN(gx, gy, gx + W * .24, gy, GREY, 1.4); TB('E_c', gx + 4, gy - gh - 6, ORANGE, 13, 'left');
    ctx.fillStyle = ORANGE + '88'; ctx.fillRect(gx + 10, gy - gh * .5, 36, gh * .5); ctx.fillStyle = ORANGE; ctx.fillRect(gx + 62, gy - gh, 36, gh); TB('mi', gx + 28, gy + 15, INK, 12); TB('arrivée', gx + 82, gy + 15, INK, 12);
    ph9_fade(p, .35, function () { tag('v(mi) = v_finale / √2 ≈ 0,71', W * .4, H * .1, DGREEN, 15); });
  }
]);
