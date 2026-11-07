/* Physique 6e · chapitre 2 : Force de Lorentz et force de Laplace (aides ph_* : voir theo-01.js) */
function ph_B(x0, y0, x1, y1, st, out, col) { /* champ perpendiculaire à la feuille : ⊙ (vers le lecteur) ou × (dans la feuille) */
  ctx.strokeStyle = col || '#b7bdc4'; ctx.fillStyle = col || '#b7bdc4'; ctx.lineWidth = 1.3;
  for (var x = x0; x <= x1; x += st) for (var y = y0; y <= y1; y += st) {
    if (out) { ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke(); }
  }
}
function ph_q(x, y, sg, r) { DOT(x, y, r || 11, sg > 0 ? '#fcebeb' : '#e6f1fb'); ph_circ(x, y, r || 11, sg > 0 ? RED : BLUE); TB(sg > 0 ? '+' : '−', x, y + 5, sg > 0 ? DRED : BLUE_D, 15); }
function ph_arc(cx, cy, r, a0, a1, col, w, dash) { ctx.strokeStyle = col; ctx.lineWidth = w || 2; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1, a1 < a0); ctx.stroke(); ctx.setLineDash([]); }

SFA.theo("c02", {
  icon: function () {
    ph_B(W * .08, H * .12, W * .92, H * .82, 38, false, '#d5d9de');
    ph_arc(W * .5, H * .45, H * .26, 0, 7, BLUE, 3); ph_q(W * .5 + H * .26, H * .45, 1, 11);
    A(W * .5 + H * .26, H * .45, 0, 48, GREEN, '', 3.5); A(W * .5 + H * .26, H * .45, -48, 0, RED, '', 3.5);
    tag('F = q·v·B', W * .5, H * .88, BLUE_D, 24);
  },
  sub: [
    { t: "Force de Lorentz",
      anim: function (t) {
        var cx = W * .36, cy = H * .5, R = H * .3, a = t * .022, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        ph_B(W * .06, H * .08, W * .66, H * .92, 36, true, '#dde1e6');
        ph_arc(cx, cy, R, a - 2.2, a, BLUE, 3.5); ph_arc(cx, cy, R, 0, 7, '#cfe0f3', 1.2, [4, 5]);
        A(x, y, -Math.sin(a) * 52, Math.cos(a) * 52, GREEN, 'v', 3.2); A(x, y, -Math.cos(a) * 42, -Math.sin(a) * 42, RED, 'F', 3.2); ph_q(x, y, 1, 11);
        TB('B ⊙ (vers toi)', W * .1, H * .08, GREY, 14, 'left');
        TB('F ⟂ v et F ⟂ B', W * .84, H * .22, INK, 15); TB('F = |q|·v·B·sin θ', W * .84, H * .4, BLUE_D, 17);
        TB('r = m·v / (|q|·B)', W * .84, H * .58, DGREEN, 16); TB('T = 2π·m / (|q|·B)', W * .84, H * .74, DGREEN, 16); TB('v constante : F ne travaille pas', W * .84, H * .9, GREY, 12);
      },
      th: '<div class="tcard"><b class="h">La force de Lorentz</b><p>Un champ magnétique B agit sur une charge q qui se déplace à la vitesse v avec la force</p><p style="text-align:center"><b>F = |q|·v·B·sin θ</b> (θ = angle entre v et B)</p><p>F est <b>perpendiculaire à v et à B</b>. Le sens se trouve avec la <b>règle de la main droite</b> : index dans le sens de v, majeur dans le sens de B, le pouce donne F pour une charge <b>positive</b> (sens inverse pour une charge négative). Cas particuliers : <b>v = 0</b> (charge immobile) ⇒ F = 0 ; <b>v ∥ B</b> ⇒ F = 0 ; v ⟂ B ⇒ F maximale.</p></div>' +
        '<div class="tcard"><b class="h">Mouvement circulaire dans un champ uniforme</b><p>La force est toujours perpendiculaire à la vitesse : elle <b>ne change pas la valeur de v</b> (elle ne travaille pas), seulement sa direction. Si v ⟂ B, la trajectoire est un <b>cercle</b>. Force centripète : |q|·v·B = m·v²/r, d\'où</p><p style="text-align:center"><b>r = m·v / (|q|·B)</b> et <b>T = 2π·m / (|q|·B)</b></p><p>Le rayon est proportionnel à la vitesse et à la masse, inversement proportionnel au champ ; la <b>période ne dépend pas de la vitesse</b> : doubler v double r, mais le cercle est parcouru deux fois plus vite. Si v n\'est pas perpendiculaire à B, la trajectoire est une hélice.</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré et spectromètre de masse</b><p>Électron (m = 9,11·10<sup>−31</sup> kg, |q| = 1,60·10<sup>−19</sup> C) à 3,0·10<sup>6</sup> m/s dans B = 10 mT : r = 9,11·10<sup>−31</sup> × 3,0·10<sup>6</sup> / (1,60·10<sup>−19</sup> × 0,010) ≈ <b>1,7 mm</b>.</p><p>Dans un <b>spectromètre de masse</b>, des ions sont accélérés par une tension U (q·U = ½·m·v²) puis déviés dans B : r = (1/B)·√(2·m·U/q). À q, U et B égaux, les ions les plus lourds décrivent les plus grands demi-cercles : on sépare ainsi les isotopes (³⁵Cl et ³⁷Cl : environ 12 mm d\'écart pour des diamètres de 44 cm).</p><p><b>Pièges</b> : ne pas oublier de convertir mT en T ; une charge négative tourne en sens inverse d\'une charge positive ; α (2e, 4 u) et proton (e, 1 u) : r<sub>α</sub> ≈ 2·r<sub>p</sub> à même vitesse.</p></div>'
    },
    { t: "Force de Laplace et moteur",
      anim: function (t) {
        var y1 = H * .3, y2 = H * .7, xa = W * .13, xb = W * .66, s = Math.min(1, (t % 340) / 280), x = W * .22 + (xb - W * .3) * s * s;
        ph_B(W * .1, H * .12, xb + 20, H * .88, 36, true, '#dde1e6');
        LN(xa, y1, xb + 20, y1, INK, 3); LN(xa, y2, xb + 20, y2, INK, 3); LN(xa, y1, xa, y2, INK, 3);
        ctx.fillStyle = '#fff'; ctx.fillRect(xa - 9, H * .44, 18, H * .12); LN(xa - 12, H * .46, xa + 12, H * .46, INK, 3); LN(xa - 6, H * .54, xa + 6, H * .54, INK, 3);
        LN(x, y1, x, y2, ORANGE, 7); A(x + 10, y2 - 8, 0, -(y2 - y1) * .5, DRED, 'I', 2.6);
        A(x, H * .5, 34 + 90 * s, 0, RED, 'F', 4);
        TB('F = B·I·L·sin θ', W * .83, H * .3, BLUE_D, 17); TB('a = F / m', W * .83, H * .5, DGREEN, 17); TB('B ⊙, I ↑ ⇒ F →', W * .83, H * .7, INK, 15);
        TB('main droite : I, B, F', W * .83, H * .86, ORANGE, 13);
      },
      th: '<div class="tcard"><b class="h">La force de Laplace</b><p>Un fil de longueur L parcouru par un courant I dans un champ B subit la somme des forces de Lorentz sur ses charges mobiles :</p><p style="text-align:center"><b>F = B·I·L·sin θ</b> (θ = angle entre le fil et B)</p><p>F est perpendiculaire au fil et à B (main droite : index = sens du courant, majeur = B, pouce = F). Elle est <b>maximale</b> pour un fil perpendiculaire à B et <b>nulle</b> pour un fil parallèle à B.</p><p>Exemple : L = 25 cm, I = 6,0 A, B = 0,40 T, θ = 90° : F = 0,40 × 6,0 × 0,25 = <b>0,60 N</b>. Avec θ = 30° (L = 20 cm, I = 4,0 A, B = 0,50 T) : F = 0,50 × 4,0 × 0,20 × sin 30° = 0,20 N, moitié de la valeur à 90°.</p></div>' +
        '<div class="tcard"><b class="h">Rail de Laplace</b><p>Une tige de masse m posée sur deux rails, traversée par I dans un champ vertical B, subit une force horizontale F = B·I·L. Sans frottement, elle accélère : <b>a = F/m</b> (mouvement uniformément accéléré tant que I est constant), v² = 2·a·d, et l\'énergie électrique est convertie en énergie cinétique (puissance mécanique P = F·v).</p><p>Exemple : m = 40 g, L = 15 cm, B = 0,30 T, I = 4,0 A : F = 0,18 N, a = 4,5 m/s², et après 0,80 m : v = √(2 × 4,5 × 0,80) ≈ 2,7 m/s.</p></div>' +
        '<div class="tcard"><b class="h">Le moteur à courant continu</b><p>Une bobine de N spires (aire A = côté × côté) traversée par I dans B subit sur ses deux côtés actifs des forces opposées qui forment un <b>couple</b> : <b>Γ = N·B·I·A·cos α</b> (α = angle entre le plan de la bobine et B). Le couple est maximal quand le plan est parallèle à B (α = 0) et nul quand il lui est perpendiculaire.</p><p>Le <b>commutateur</b> (balais et collecteur) inverse le courant à chaque demi-tour pour que le couple garde toujours le même sens ; le couple moyen sur un tour vaut (2/π)·Γ<sub>max</sub>. Exemple : N = 50, 10 cm × 8 cm, I = 3,0 A, B = 0,25 T : F = 3,75 N sur un côté de 10 cm, Γ<sub>max</sub> = 0,30 N·m.</p><p><b>Pièges</b> : bien repérer θ (fil–champ) ou α (plan–champ) ; le sens de F s\'inverse si l\'on inverse I <i>ou</i> B (mais pas si on inverse les deux).</p></div>'
    }
  ]
});

SFA.figs("c02", [
  /* 0 · fil de 25 cm, 6,0 A, B = 0,40 T */
  function (p) {
    var y = H * .55, x1 = W * .2, x2 = W * .8;
    ph_B(W * .06, H * .1, W * .94, H * .94, 40, false, '#d5d9de');
    LN(x1, y, x2, y, ORANGE, 6); A(W * .5 - 25, y, 50, 0, DRED, '', 3); TB('I = 6,0 A', W * .5, y + 22 - 40, DRED, 14); ph_dim(x1, y + 26, x2, y + 26, 'L = 25 cm', GREY, 0);
    TB('B = 0,40 T (dans la feuille)', W * .06 + 4, H * .1 - 4 + 10, GREY, 13, 'left');
    ph_fade(p, 0, function () { A(W * .5, y - 5, 0, -p * H * .32, RED, '', 4.5); tag('F = 0,60 N', W * .5 + 62, y - H * .3, DRED, 17); });
  },
  /* 1 · charge immobile */
  function (p) {
    ph_B(W * .06, H * .1, W * .94, H * .94, 40, false, '#d5d9de');
    ph_q(W * .5, H * .5, 1, 18); TB('v = 0', W * .5, H * .5 + 44, INK, 17);
    ph_fade(p, 0, function () { A(W * .5 + 24, H * .5, 70, 0, '#e8b4b4', '', 4); tag('F = q·v·B·sin θ = 0', W * .5, H * .17, DRED, 18);
      LN(W * .5 + 52, H * .5 - 20, W * .5 + 112, H * .5 + 20, DRED, 4); LN(W * .5 + 52, H * .5 + 20, W * .5 + 112, H * .5 - 20, DRED, 4); });
  },
  /* 2 · rayon d'un électron */
  function (p) {
    var cx = W * .38, cy = H * .62, R = H * .3;
    ph_B(W * .04, H * .08, W * .96, H * .94, 40, false, '#dde1e6');
    ph_arc(cx, cy, R, 0, 7, BLUE, 2.5, [7, 5]); ph_q(cx, cy - R, -1, 12);
    A(cx, cy - R - 18, 0, 0, BLUE, '', 1); A(cx + 14, cy - R, 55, 0, GREEN, 'v', 3.2); A(cx, cy - R + 14, 0, 40, RED, 'F', 3);
    TB('v = 3,0·10⁶ m/s', cx + 20, cy - R - 20, GREEN, 14, 'left'); TB('B = 10 mT', W * .06, H * .13, GREY, 14, 'left');
    ph_fade(p, 0, function () { LN(cx, cy, cx + R * Math.cos(.6) * p, cy + R * Math.sin(.6) * p, ORA2, 3); DOT(cx, cy, 3.5, INK); tag('r ≈ 1,7 mm', cx + 40, cy + 14, ORA2, 17); });
  },
  /* 3 · fil incliné de 30° */
  function (p) {
    var ox = W * .5, oy = H * .52, a = H * .34, c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
    for (var k = 0; k < 5; k++) { var yy = H * .12 + k * H * .19; A(W * .08, yy, W * .84, 0, '#c2c8cf', '', 1.4); }
    TB('B = 0,50 T', W * .09, H * .07, GREY, 14, 'left');
    LN(ox - a * c * 1.15, oy + a * s * 1.15, ox + a * c * 1.15, oy - a * s * 1.15, ORANGE, 6); A(ox + 30 * c, oy - 30 * s, 50 * c, -50 * s, DRED, '', 3); TB('I = 4,0 A', ox + 100 * c - 40, oy - 100 * s - 22, DRED, 14);
    ph_arc(ox - a * c * 1.15, oy + a * s * 1.15, 52, 0, -Math.PI / 6, INK, 2); TB('30°', ox - a * c * 1.15 + 76, oy + a * s * 1.15 - 6, INK, 15);
    ph_fade(p, 0, function () { zsym(ox + 20, oy + 36, 17, RED, false); tag('F = 0,20 N (dans la feuille)', ox + 20, oy + 76, DRED, 15); tag('à 90° : 0,40 N', W * .8, H * .93, GREY, 14); });
  },
  /* 4 · proton, B vers le lecteur : sens de la force */
  function (p) {
    var x = W * .22, y = H * .3;
    ph_B(W * .06, H * .08, W * .94, H * .94, 40, true, '#d5d9de');
    ph_q(x, y, 1, 14); A(x + 16, y, 70, 0, GREEN, 'v', 3.2); TB('proton', x, y - 26, DRED, 14); TB('B vers toi', W * .88, H * .93, GREY, 14, 'right');
    ph_fade(p, 0, function () { A(x, y + 16, 0, p * 70, RED, '', 4); tag('F vers le bas', x + 62, y + 60, DRED, 16);
      ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(x, y + 140, 140, -Math.PI / 2, -Math.PI / 2 + 1.1 * p); ctx.stroke(); ctx.setLineDash([]); });
  },
  /* 5 · proton et particule alpha : mêmes v et B */
  function (p) {
    var O = { x: W * .36, y: H * .93 }, R = H * .19;
    ph_B(W * .04, H * .06, W * .96, H * .94, 40, false, '#dde1e6');
    var ph = 2 * Math.PI * p;
    [[R, RED, 'proton : r', 'p'], [2 * R, VIOLET, 'α : r ≈ 2·r', 'α']].forEach(function (c, i) {
      ctx.strokeStyle = c[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(O.x, O.y - c[0], c[0], Math.PI / 2, Math.PI / 2 - ph, true); ctx.stroke();
      var px = O.x + c[0] * Math.sin(ph), py = O.y - c[0] + c[0] * Math.cos(ph); DOT(px, py, 8, c[1]);
    });
    A(O.x, O.y, 62, 0, GREEN, 'v', 3); DOT(O.x, O.y, 4, INK);
    ph_fade(p, .1, function () { TB('p', O.x + R + 22, O.y - R, DRED, 16); TB('α', O.x + 2 * R + 22, O.y - 2 * R, VIO_D, 16); tag('r_α ≈ 2·r_p  et  T_α ≈ 2·T_p', W * .74, H * .12, INK, 14); });
  },
  /* 6 · spectromètre de masse : séparer ³⁵Cl et ³⁷Cl */
  function (p) {
    var y0 = H * .78, x0 = W * .2, r1 = W * .2, r2 = W * .2 + 6, e = ph_a(p, 0, .8);
    ph_B(W * .04, H * .08, W * .96, y0 - 4, 38, true, '#e3e6ea');
    LN(W * .04, y0, W * .96, y0, INK, 3); ctx.fillStyle = '#fff'; ctx.fillRect(x0 - 8, y0 - 2, 16, 5);
    ctx.fillStyle = '#e6f1fb'; ctx.fillRect(x0 - 36, y0 + 22, 72, 28); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.strokeRect(x0 - 36, y0 + 22, 72, 28); TB('1 500 V', x0, y0 + 41, BLUE_D, 13);
    A(x0, y0 + 20, 0, -18, GREEN, '', 3);
    [[r1, BLUE, '³⁵Cl'], [r2, RED, '³⁷Cl']].forEach(function (c) {
      var r = c[0]; ctx.strokeStyle = c[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x0 + r, y0, r, Math.PI, Math.PI + Math.PI * e); ctx.stroke(); });
    ph_fade(p, .5, function () { DOT(x0 + 2 * r1, y0, 5, BLUE); DOT(x0 + 2 * r2, y0, 5, RED);
      tag('22,0 cm', x0 + r1, y0 - r1 - 14, BLUE_D, 14); tag('22,6 cm', x0 + r2 + 70, y0 - r1 + 4, DRED, 14); tag('écart ≈ 12 mm', W * .82, y0 + 30, INK, 14); });
  },
  /* 7 · doubler la vitesse : r double, T inchangée */
  function (p) {
    var cx = W * .4, cy = H * .5, r1 = H * .17, r2 = H * .34, a = -.8;
    ph_B(W * .04, H * .06, W * .96, H * .94, 40, false, '#e3e6ea');
    ph_circ(cx, cy, r1, BLUE, [6, 4]); ph_circ(cx, cy, r2, VIOLET, [6, 4]); DOT(cx, cy, 3, INK);
    var tx = -Math.sin(a), ty = Math.cos(a);
    [[r1, 1, BLUE], [r2, 2, VIOLET]].forEach(function (c) { var x = cx + c[0] * Math.cos(a), y = cy + c[0] * Math.sin(a); ph_q(x, y, -1, 8); A(x, y, tx * 42 * c[1], ty * 42 * c[1], GREEN, '', 3); });
    TB('v', cx + r1 * Math.cos(a) + 36, cy + r1 * Math.sin(a) + 30, DGREEN, 14); TB('2v', cx + r2 * Math.cos(a) + 70, cy + r2 * Math.sin(a) + 54, DGREEN, 14);
    ph_fade(p, 0, function () { LN(cx, cy, cx + r2 * Math.cos(a), cy + r2 * Math.sin(a), ORA2, 2.5, [5, 4]); tag('r → 2r', W * .83, H * .3, VIO_D, 18); tag('T inchangée', W * .83, H * .5, DGREEN, 17); tag('T = 2π·m / (|q|·B)', W * .83, H * .7, INK, 13); });
  },
  /* 8 · rail de Laplace */
  function (p) {
    var y1 = H * .26, y2 = H * .68, xa = W * .08, xb = W * .92, x0 = W * .2, x1 = W * .2 + W * .5 * p;
    ph_B(W * .1, H * .12, xb - 4, H * .84, 40, true, '#e3e6ea');
    LN(xa, y1, xb, y1, INK, 3); LN(xa, y2, xb, y2, INK, 3); LN(xa, y1, xa, y2, INK, 3);
    if (p > 0) LN(x0, y1, x0, y2, '#d0d4d9', 4, [5, 4]); LN(x1, y1, x1, y2, ORANGE, 8); A(x1 + 14, y2 - 8, 0, -(y2 - y1) * .5, DRED, 'I', 2.6);
    TB('4,0 A · 15 cm · 0,30 T', W * .5, H * .93, GREY, 14);
    ph_dim(x0, y2 + 22, x0 + W * .5, y2 + 22, 'd = 0,80 m', GREY, 0);
    ph_fade(p, 0, function () { A(x1 + 2, H * .47, 56, 0, RED, '', 4.5); tag('F = 0,18 N', x1 + 30, H * .47 - 24, DRED, 15); tag('a = 4,5 m/s²', W * .42, H * .4, DGREEN, 15); tag('v ≈ 2,7 m/s', x1 - 62, H * .6, BLUE_D, 15); });
  },
  /* 9 · couple d'une bobine : vue en bout, plan à 60° de B */
  function (p) {
    var ox = W * .4, oy = H * .46, a = H * .25, ang = Math.PI / 3, c = Math.cos(ang), s = Math.sin(ang);
    for (var k = 0; k < 5; k++) A(W * .04, H * .1 + k * H * .2, W * .56 - (k % 2) * 4, 0, '#c9ced4', '', 1.4);
    TB('B = 0,25 T', W * .05, H * .06, GREY, 14, 'left');
    var e1 = { x: ox + a * c, y: oy - a * s }, e2 = { x: ox - a * c, y: oy + a * s };
    LN(e1.x, e1.y, e2.x, e2.y, ORANGE, 6); zsym(e1.x, e1.y, 12, DRED, true); zsym(e2.x, e2.y, 12, DRED, false); DOT(ox, oy, 4, INK);
    ph_arc(ox, oy, 54, 0, -ang, INK, 2); TB('60°', ox + 66, oy - 20, INK, 14);
    TB('50 spires · 3,0 A', W * .8, H * .1, GREY, 13); TB('10 cm × 8 cm', W * .8, H * .2, GREY, 13);
    ph_fade(p, 0, function () { A(e1.x, e1.y - 14, 0, -p * 48, RED, '', 4); A(e2.x, e2.y + 14, 0, p * 48, RED, '', 4);
      tag('F = 3,75 N', e1.x + 66, e1.y - 30, DRED, 15); tag('Γ(60°) = 0,15 N·m', W * .8, H * .5, INK, 15); tag('Γmax = 0,30 N·m', W * .8, H * .66, DGREEN, 15); tag('moyen ≈ 0,19 N·m', W * .8, H * .82, BLUE_D, 15); });
  }
]);
