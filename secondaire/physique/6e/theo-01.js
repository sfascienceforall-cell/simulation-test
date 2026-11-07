/* Physique 6e · chapitre 1 : Magnétisme et champ magnétique — théorie animée + devantures.
   Les aides ph_* définies ici sont réutilisées par les autres fichiers theo-NN.js de ce cours. */
function ph_a(p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); }
function ph_fade(p, a, fn) { var k = ph_a(p, a, a + .25); if (k <= 0) return; ctx.globalAlpha = k; fn(); ctx.globalAlpha = 1; }
function ph_head(x, y, dx, dy, col, s) {
  var l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; s = s || 7; ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x + dx * s, y + dy * s); ctx.lineTo(x - dx * s * .6 - dy * s * .55, y - dy * s * .6 + dx * s * .55);
  ctx.lineTo(x - dx * s * .6 + dy * s * .55, y - dy * s * .6 - dx * s * .55); ctx.closePath(); ctx.fill();
}
function ph_mag(x, y, w, h, flip) {
  var l = flip ? 'N' : 'S', r = flip ? 'S' : 'N', cl = l === 'N' ? DRED : BLUE_D, cr = r === 'N' ? DRED : BLUE_D;
  ctx.fillStyle = l === 'N' ? '#fcebeb' : '#e6f1fb'; ctx.fillRect(x - w / 2, y - h / 2, w / 2, h);
  ctx.fillStyle = r === 'N' ? '#fcebeb' : '#e6f1fb'; ctx.fillRect(x, y - h / 2, w / 2, h);
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  TB(l, x - w / 4, y + h * .2, cl, Math.round(h * .6)); TB(r, x + w / 4, y + h * .2, cr, Math.round(h * .6));
}
function ph_needle(x, y, a, L) {
  var c = Math.cos(a), s = Math.sin(a), w = L * .24;
  ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x + c * L, y + s * L); ctx.lineTo(x - s * w, y + c * w); ctx.lineTo(x + s * w, y - c * w); ctx.fill();
  ctx.fillStyle = '#bfc5cc'; ctx.beginPath(); ctx.moveTo(x - c * L, y - s * L); ctx.lineTo(x - s * w, y + c * w); ctx.lineTo(x + s * w, y - c * w); ctx.fill(); DOT(x, y, 2.2, INK);
}
function ph_dim(x1, y1, x2, y2, lab, col, off) {
  col = col || GREY; LN(x1, y1, x2, y2, col, 1.4); ph_head(x1, y1, x1 - x2, y1 - y2, col, 6); ph_head(x2, y2, x2 - x1, y2 - y1, col, 6);
  var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1; tag(lab, (x1 + x2) / 2 - dy / l * (off || 0), (y1 + y2) / 2 + dx / l * (off || 0), col === GREY ? INK : col, 13);
}
function ph_axes(x0, y0, w, h, xl, yl) {
  LN(x0, y0, x0 + w, y0, INK, 1.8); LN(x0, y0, x0, y0 - h, INK, 1.8); ph_head(x0 + w, y0, 1, 0, INK, 7); ph_head(x0, y0 - h, 0, -1, INK, 7);
  TB(xl, x0 + w, y0 + 17, INK, 13, 'right'); TB(yl, x0 + 8, y0 - h - 4, INK, 13, 'left');
}
function ph_circ(x, y, r, col, dash) { ctx.strokeStyle = col; ctx.lineWidth = 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
function ph_coil(x1, x2, y, R, n) {
  var d = (x2 - x1) / n, rx = Math.min(R * .3, d * .9);
  for (var i = 0; i < n; i++) { var x = x1 + d * (i + .5);
    ctx.strokeStyle = '#e1b27a'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(x, y, rx, R, 0, Math.PI / 2, -Math.PI / 2, true); ctx.stroke();
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(x, y, rx, R, 0, -Math.PI / 2, Math.PI / 2, true); ctx.stroke(); }
}
function ph_dB(x, y, cx, cy, d) {
  var ux = 0, uy = 0;
  [[cx + d, cy, 1], [cx - d, cy, -1]].forEach(function (q) { var dx = x - q[0], dy = y - q[1], r2 = dx * dx + dy * dy + 1, r3 = r2 * Math.sqrt(r2); ux += q[2] * dx / r3; uy += q[2] * dy / r3; });
  var l = Math.hypot(ux, uy) || 1; return [ux / l, uy / l];
}
function ph_dipLines(cx, cy, d, nl, col, off) {
  /* lignes fermées : on part du plan médian et on suit le champ vers le pôle S (avant) et vers le pôle N (arrière) */
  var ss = [.45, .9, 1.5, 2.2].slice(0, nl).map(function (v) { return v * d; });
  ss.forEach(function (sv) { [-1, 1].forEach(function (sg) {
    var tr = function (dir, stop) { var x = cx, y = cy + sg * sv, o = []; for (var s = 0; s < 800; s++) {
      var b = ph_dB(x, y, cx, cy, d); x += 3 * dir * b[0]; y += 3 * dir * b[1]; o.push([x, y]);
      if (Math.hypot(x - stop, y - cy) < 10 || x < -30 || x > W + 30 || y < -30 || y > H + 30) break; } return o; };
    var F = tr(1, cx - d), Bk = tr(-1, cx + d).reverse(), pts = Bk.concat([[cx, cy + sg * sv]], F);
    ctx.strokeStyle = col; ctx.lineWidth = 1.7; if (off !== undefined) { ctx.setLineDash([7, 7]); ctx.lineDashOffset = -off; }
    ctx.beginPath(); pts.forEach(function (q, i) { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
    var m = Bk.length; ph_head(pts[m][0], pts[m][1], pts[m + 1][0] - pts[m][0], pts[m + 1][1] - pts[m][1], col, 6); }); });
}
function ph_wireCirc(cx, cy, radii, t, dir, col) { /* cercles de champ autour d'un fil vu en bout ; dir = +1 courant vers le lecteur (sens anti-horaire) */
  radii.forEach(function (r, i) {
    ph_circ(cx, cy, r, col, [4, 5]);
    for (var k = 0; k < 3; k++) { var a = -dir * (t * .012 * (1 + .5 / (i + 1))) + k * 2.094 + i; ph_head(cx + r * Math.cos(a), cy + r * Math.sin(a), dir * Math.sin(a), -dir * Math.cos(a), col, 7); }
  });
}

SFA.theo("c01", {
  icon: function () {
    ph_dipLines(W * .5, H * .42, W * .1, 3, 'rgba(55,138,221,.75)'); ph_mag(W * .5, H * .42, W * .18 + 16, H * .13);
    tag('B = μ₀·n·I', W * .5, H * .86, BLUE_D, 24);
  },
  sub: [
    { t: "Aimant et Terre",
      anim: function (t) {
        var cx = W * .5, cy = H * .5, d = W * .12;
        ph_dipLines(cx, cy, d, 4, BLUE, t * .5); ph_mag(cx, cy, d * 2 + 16, H * .14);
        var u = t * .012, px = cx + W * .33 * Math.cos(u), py = cy + H * .4 * Math.sin(u), b = ph_dB(px, py, cx, cy, d);
        ph_needle(px, py, Math.atan2(b[1], b[0]), 16);
        tag('les lignes sortent du pôle N et entrent par le pôle S', W * .5, H * .08, INK, 14);
        tag("l'aiguille s'oriente le long de la ligne de champ", W * .5, H * .95, ORANGE, 14);
      },
      th: '<div class="tcard"><b class="h">Aimant, pôles et lignes de champ</b><p>Un aimant possède un pôle <b>Nord</b> et un pôle <b>Sud</b>. Deux pôles de même nom se repoussent, deux pôles de noms contraires s\'attirent. Autour de lui règne un <b>champ magnétique</b> <b>B</b>, grandeur vectorielle qui s\'exprime en <b>tesla</b> (T).</p><p>On le visualise par des <b>lignes de champ</b> : elles sortent du pôle Nord, rentrent par le pôle Sud (à l\'intérieur de l\'aimant elles vont du S au N : ce sont des courbes <b>fermées</b>). En chaque point, le vecteur B est <b>tangent</b> à la ligne ; l\'aiguille d\'une boussole s\'y oriente. Plus les lignes sont serrées, plus le champ est intense.</p></div>' +
        '<div class="tcard"><b class="h">Pas de monopôle</b><p>Si l\'on casse un aimant, on n\'isole jamais un pôle : on obtient deux aimants plus petits, chacun avec son Nord et son Sud. Un aimant est fait d\'une multitude de petits aimants atomiques alignés.</p><p><b>Ordres de grandeur</b> : champ terrestre ≈ 20 à 60 µT ; aimant de frigo ≈ 5 mT ; aimant au néodyme ≈ 0,3 à 1 T ; IRM ≈ 1,5 à 3 T.</p></div>' +
        '<div class="tcard"><b class="h">Le champ magnétique terrestre</b><p>La Terre se comporte comme un énorme aimant (dû à des courants dans son noyau liquide). Le pôle Nord d\'une boussole pointe vers le <b>nord géographique</b> : il y est donc attiré par un pôle <b>Sud</b> d\'aimant. Le pôle magnétique voisin du Nord géographique est donc, du point de vue des aimants, un pôle Sud.</p><p>Aux latitudes de la Belgique, le champ terrestre fait un angle d\'environ 65° avec l\'horizontale (inclinaison) ; une boussole horizontale ne « sent » que la <b>composante horizontale</b> B<sub>H</sub> ≈ 19 µT. La direction indiquée s\'écarte de quelques degrés du nord géographique (déclinaison).</p><p><b>Piège</b> : une boussole est un aimant léger, elle ne s\'oriente que si aucun autre champ plus fort n\'est présent (aimant, fil parcouru par un courant).</p></div>'
    },
    { t: "Fil parcouru par un courant",
      anim: function (t) {
        var cx = W * .3, cy = H * .5, ph = Math.floor(t / 300) % 2, dir = ph ? -1 : 1, k = Math.min(W, H * 1.6);
        ph_wireCirc(cx, cy, [k * .12, k * .22, k * .32], t, dir, BLUE);
        zsym(cx, cy, 12, DRED, dir > 0); TB(dir > 0 ? 'I vers toi' : 'I vers la feuille', cx, cy + k * .32 + 30, DRED, 14);
        [0, 1.571, 3.142, 4.712].forEach(function (a) { var r = k * .22, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); ph_needle(x, y, Math.atan2(-dir * Math.cos(a), dir * Math.sin(a)), 12); });
        TB('B = 2·10⁻⁷ · I / r', W * .72, H * .3, BLUE_D, 22); TB("le champ tourne autour du fil", W * .72, H * .5, INK, 14); TB("pouce = courant, doigts = champ", W * .72, H * .6, ORANGE, 14);
        TB('(main droite)', W * .72, H * .7, ORANGE, 14);
      },
      th: '<div class="tcard"><b class="h">Un courant crée un champ (Œrsted)</b><p>Tout fil parcouru par un courant crée un champ magnétique. Pour un <b>fil rectiligne très long</b>, les lignes de champ sont des <b>cercles centrés sur le fil</b>, dans un plan perpendiculaire à lui. Le champ à la distance r vaut</p><p style="text-align:center"><b>B = μ₀·I / (2π·r) = 2·10<sup>−7</sup> · I / r</b> (B en T, I en A, r en m)</p><p>avec μ₀ = 4π·10<sup>−7</sup> T·m/A. B est proportionnel à I et inversement proportionnel à r.</p></div>' +
        '<div class="tcard"><b class="h">Sens : la règle de la main droite</b><p>Pouce de la main droite dans le sens du courant : les doigts qui s\'enroulent autour du fil donnent le sens du champ. Si le courant sort de la feuille (vers toi, symbole ⊙), le champ tourne dans le sens <b>anti-horaire</b> ; s\'il entre (⊗), dans le sens horaire. En changeant le sens du courant, on inverse le sens du champ.</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré et superposition</b><p>I = 8 A, r = 4,0 cm = 0,040 m : B = 2·10<sup>−7</sup> × 8 / 0,040 = <b>4,0·10<sup>−5</sup> T = 40 µT</b>, du même ordre que le champ terrestre.</p><p>Quand plusieurs sources agissent, les champs s\'<b>additionnent vectoriellement</b>. Une boussole placée près d\'un fil dévie : tan δ = B<sub>fil</sub> / B<sub>H</sub> si les deux champs sont perpendiculaires. Entre deux fils parallèles parcourus par des courants de même sens, les champs s\'opposent ; avec des courants de sens contraires, ils s\'ajoutent.</p><p><b>Pièges</b> : convertir r en mètres ; le champ <i>n\'est pas</i> dirigé vers le fil mais tangent au cercle.</p></div>'
    },
    { t: "Bobine et solénoïde",
      anim: function (t) {
        var cx = W * .5, cy = H * .55, L = W * .5, R = H * .17;
        ph_coil(cx - L / 2, cx + L / 2, cy, R, 11);
        [-.55, 0, .55].forEach(function (f, i) {
          var yk = cy + f * R, ry = H * (.2 + .06 * Math.abs(f) * 2) + (f < 0 ? 0 : 0);
          ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.setLineDash([8, 7]); ctx.lineDashOffset = -t * .7; ctx.beginPath(); ctx.moveTo(cx - L / 2, yk); ctx.lineTo(cx + L / 2, yk);
          if (f <= 0) ctx.ellipse(cx, yk, L / 2, ry + 8 * i, 0, 0, Math.PI, true); else ctx.ellipse(cx, yk, L / 2, ry, 0, 0, Math.PI, false);
          ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
        });
        TB('S', cx - L / 2 - 16, cy + 6, BLUE_D, 20); TB('N', cx + L / 2 + 18, cy + 6, DRED, 20);
        TB('B = μ₀ · n · I', W * .5, H * .1, BLUE_D, 22); TB('n = N / L  (spires par mètre)', W * .5, H * .97, INK, 14);
        tag('champ uniforme à l’intérieur', cx, cy - 4, DGREEN, 13);
      },
      th: '<div class="tcard"><b class="h">Une bobine = un aimant</b><p>En enroulant le fil en N spires jointives, on superpose les champs de chaque spire. Le champ d\'une <b>bobine</b> ressemble à celui d\'un barreau aimanté : une face Nord (d\'où sortent les lignes) et une face Sud. La règle de la main droite s\'applique : doigts dans le sens du courant dans les spires, pouce vers le pôle Nord.</p></div>' +
        '<div class="tcard"><b class="h">Le solénoïde long</b><p>Pour un solénoïde dont la longueur L est grande devant son diamètre, le champ <b>à l\'intérieur</b> est quasi <b>uniforme</b>, parallèle à l\'axe, et vaut</p><p style="text-align:center"><b>B = μ₀ · n · I = μ₀ · N · I / L</b> avec n = N/L (spires par mètre)</p><p>Il est presque nul à l\'extérieur. B ne dépend ni du diamètre des spires ni de la position sur l\'axe (loin des bouts).</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré</b><p>N = 600 spires, L = 30 cm = 0,30 m, I = 1,5 A : n = 600 / 0,30 = 2 000 m<sup>−1</sup> ; B = 4π·10<sup>−7</sup> × 2 000 × 1,5 = <b>3,8·10<sup>−3</sup> T = 3,8 mT</b>, soit environ 80 fois le champ terrestre.</p><p>Étirer le solénoïde (même N) double L donc divise B par 2 ; il faudrait doubler I pour compenser.</p></div>' +
        '<div class="tcard"><b class="h">Pièges et électroaimant</b><p>• Utiliser n en <b>m<sup>−1</sup></b> (cm → m). • Un noyau de fer doux multiplie B par plusieurs centaines : c\'est le principe de l\'<b>électroaimant</b> (grues de ferraille, relais, IRM supraconductrice). • Un fil droit seul ne peut pas atteindre 0,05 T : il faudrait s\'en approcher à 0,02 mm avec 5 A. La bobine, elle, y arrive avec environ 2 000 spires.</p></div>'
    }
  ]
});

SFA.figs("c01", [
  /* 0 · champ d'un fil : 8 A à 4,0 cm */
  function (p) {
    var x = W * .27, y = H * .52, r = Math.min(W * .4, H * .36);
    ph_circ(x, y, r, '#a9c8ec', [5, 5]); zsym(x, y, 15, DRED, true); TB('I = 8 A', x, y - 28, DRED, 15);
    DOT(x + r, y, 6, INK); TB('P', x + r + 14, y + 20, INK, 15);
    ph_dim(x + 16, y + 12, x + r - 8, y + 12, 'r = 4,0 cm', GREY, 16);
    ph_head(x + r * Math.cos(-1.1), y + r * Math.sin(-1.1), Math.sin(-1.1), -Math.cos(-1.1), BLUE, 8);
    ph_fade(p, 0, function () { A(x + r, y, 0, -p * H * .3, BLUE, '', 4); tag('B = 40 µT', x + r + 52, y - H * .22, BLUE_D, 17); });
  },
  /* 1 · couper un aimant */
  function (p) {
    var cx = W * .5, cy = H * .5, w = W * .6, h = H * .22;
    if (p < .15) { ph_mag(cx, cy, w, h); LN(cx, cy - h, cx, cy + h, DRED, 2.4, [5, 4]); TB('✂', cx, cy - h - 8, DRED, 22); TB('?', cx, cy + h + 34, ORANGE, 26); return; }
    var g = ph_a(p, .15, .8) * W * .1;
    ph_mag(cx - w / 4 - g / 2, cy, w / 2, h); ph_mag(cx + w / 4 + g / 2, cy, w / 2, h);
    TB('deux aimants complets', cx, cy + h + 38, DGREEN, 17);
  },
  /* 2 · solénoïde 600 spires, 30 cm, 1,5 A */
  function (p) {
    var x1 = W * .15, x2 = W * .85, cy = H * .46, R = H * .2;
    ph_coil(x1, x2, cy, R, 14);
    ph_dim(x1, cy + R + 28, x2, cy + R + 28, 'L = 30 cm', GREY, 0);
    TB('N = 600 spires', W * .5, cy - R - 16, INK, 15); TB('I = 1,5 A', x1 - 4, cy - R - 16, DRED, 15, 'left');
    ph_fade(p, 0, function () { for (var k = 0; k < 3; k++) A(W * .3, cy - R * .5 + k * R * .5, W * .4 * p, 0, BLUE, '', 3); tag('B ≈ 3,8 mT', W * .5, cy + 5, BLUE_D, 18); });
  },
  /* 3 · retrouver I : graphe B(r) */
  function (p) {
    var x0 = W * .13, y0 = H * .84, w = W * .8, h = H * .7, X = function (r) { return x0 + r / 8 * w; }, Y = function (b) { return y0 - b / 200 * h; };
    ph_axes(x0, y0, w, h, 'r (cm)', 'B (µT)');
    ph_fade(p, 0, function () { ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var r = 1; r <= 8.01; r += .1) { var q = r === 1 ? ctx.moveTo(X(r), Y(200 / r)) : ctx.lineTo(X(r), Y(200 / r)); } ctx.stroke(); tag('I = 10 A', X(5.2), Y(200 / 5.2) - 24, BLUE_D, 17); });
    LN(X(2), y0, X(2), Y(100), GREY, 1.3, [4, 4]); LN(x0, Y(100), X(2), Y(100), GREY, 1.3, [4, 4]);
    DOT(X(2), Y(100), 7, ORA2); TB('2,0 cm', X(2), y0 + 17, INK, 13); TB('100 µT', x0 + 4, Y(100) - 6, INK, 13, 'left');
    if (p <= 0) TB('I = ?', X(3.3), Y(100) - 14, ORA2, 18);
  },
  /* 4 · sens du champ d'un fil (vue de dessus, boussole au nord) */
  function (p) {
    var x = W * .5, y = H * .6, r = H * .36;
    ph_circ(x, y, r, '#a9c8ec', [5, 5]); zsym(x, y, 13, DRED, true); TB('I ↑ (vers toi)', x, y + 36, DRED, 14);
    [[-1.571, 1], [1.571, 1], [0, 1], [3.14, 1]].forEach(function (a) { ph_head(x + r * Math.cos(a[0]), y + r * Math.sin(a[0]), Math.sin(a[0]), -Math.cos(a[0]), BLUE, 7); });
    TB('N', x, y - r - 40, INK, 17); TB('S', x, y + r + 22, GREY, 15); TB('O', x - r - 30, y + 5, INK, 16); TB('E', x + r + 28, y + 5, GREY, 15);
    var py = y - r; DOT(x, py, 27, '#fff'); ph_circ(x, py, 27, GREY); ph_needle(x, py, -1.571 - p * .6, 20);
    ph_fade(p, 0, function () { A(x - 30, py, -p * r * .8, 0, BLUE, '', 4); tag('B du fil → ouest', x - r * .75, py - 20, BLUE_D, 15); });
  },
  /* 5 · étirer un solénoïde */
  function (p) {
    var x1 = W * .08, R = H * .12, y1 = H * .26, y2 = H * .66;
    ph_coil(x1, x1 + W * .3, y1, R, 10); TB('20 cm', x1 + W * .3 + 12, y1 + 5, INK, 14, 'left');
    ph_coil(x1, x1 + W * .6, y2, R, 10); TB('40 cm', x1 + W * .6 + 12, y2 + 5, INK, 14, 'left');
    TB('N = 400 spires, I = 2,0 A', W * .5, H * .95, GREY, 14);
    ph_fade(p, 0, function () { A(x1 + 6, y1, W * .3 * p - 12, 0, BLUE, '', 4.5); A(x1 + 6, y2, W * .15 * p - 6, 0, BLUE, '', 2.6);
      tag('B = 5,0 mT', W * .74, y1, BLUE_D, 17); tag('B = 2,5 mT', W * .85, y2 + R + 22, BLUE_D, 17); });
  },
  /* 6 · déviation d'une boussole */
  function (p) {
    var ox = W * .5, oy = H * .9, bh = H * .52, bf = bh * Math.tan(Math.PI / 6);
    A(ox, oy, 0, -bh, DGREEN, '', 4); TB('B_H = 19 µT', ox + 10, oy - bh * .55, DGREEN, 14, 'left');
    A(ox, oy, -bf, 0, BLUE, '', 4); TB('B du fil', ox - bf * .5, oy + 20, BLUE_D, 14);
    DOT(ox, oy, 4, INK);
    ph_fade(p, 0, function () {
      LN(ox - bf, oy, ox - bf, oy - bh, GREY, 1.3, [4, 4]); LN(ox, oy - bh, ox - bf, oy - bh, GREY, 1.3, [4, 4]);
      A(ox, oy, -bf * p, -bh * p, RED, '', 4.5); ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ox, oy, bh * .5, -Math.PI / 2 - Math.PI / 6 * p, -Math.PI / 2); ctx.stroke();
      tag('δ = 30°', ox - 30, oy - bh * .62, INK, 15); tag('tan 30° = B_fil / B_H', W * .8, H * .34, RED, 14); tag('I ≈ 1,6 A', W * .8, H * .5, RED, 19);
    });
  },
  /* 7 · pôle Nord et boussole : la Terre est un aimant */
  function (p) {
    var cx = W * .36, cy = H * .5, r = H * .33, hm = r * .62;
    DOT(cx, cy, r, '#eaf4ee'); ctx.strokeStyle = DGREEN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    [1.55, 2.3].forEach(function (s) { [1, -1].forEach(function (sg) {
      var P0 = [cx, cy + hm], P1 = [cx + sg * r * s, cy + hm * 1.6], P2 = [cx + sg * r * s, cy - hm * 1.6], P3 = [cx, cy - hm];
      ctx.strokeStyle = BLUE; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.bezierCurveTo(P1[0], P1[1], P2[0], P2[1], P3[0], P3[1]); ctx.stroke();
      ph_head((P0[0] + 3 * P1[0] + 3 * P2[0] + P3[0]) / 8, cy, 0, -1, BLUE, 7); }); });
    ctx.fillStyle = '#e6f1fb'; ctx.fillRect(cx - 11, cy - hm, 22, hm); ctx.fillStyle = '#fcebeb'; ctx.fillRect(cx - 11, cy, 22, hm); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(cx - 11, cy - hm, 22, 2 * hm);
    TB('S', cx, cy - hm * .4, BLUE_D, 16); TB('N', cx, cy + hm * .62, DRED, 16);
    TB('N géo', cx, cy - r - 10, INK, 15); TB('S géo', cx, cy + r + 19, GREY, 14);
    var bx = W * .8, by = H * .38; DOT(bx, by, 24, '#fff'); ph_circ(bx, by, 24, GREY); ph_needle(bx, by, -1.571, 19); TB('N', bx, by - 31, INK, 14);
    ph_fade(p, 0, function () { tag('pôle Sud magnétique', cx + 30, cy - hm - 20, BLUE_D, 14); A(bx, by - 52, 0, -1, RED, '', 1);
      tag('le N de l’aiguille est attiré', bx, by + 48, DRED, 13); tag('par un pôle SUD', bx, by + 70, DRED, 13); });
  },
  /* 8 · concevoir un électroaimant */
  function (p) {
    var x1 = W * .1, x2 = W * .62, cy = H * .45, R = H * .17;
    ctx.fillStyle = '#d9dde2'; ctx.fillRect(x1 - 6, cy - R * .55, x2 - x1 + 40, R * 1.1); ctx.strokeStyle = GREY; ctx.lineWidth = 1.5; ctx.strokeRect(x1 - 6, cy - R * .55, x2 - x1 + 40, R * 1.1);
    ph_coil(x1, x2, cy, R, 16); TB('fer doux', x2 + 52, cy - R * .8, GREY, 13);
    var e = ph_a(p, 0, .6), gy = H * .84;
    for (var i = 0; i < 3; i++) { var tx = x2 + 22, ty = cy + R * .55 + 12 + i * 15, fx = W * .55 + i * 45, fy = gy; var x = fx + (tx - fx) * e + (i - 1) * 4 * e, y = fy + (ty - fy) * e;
      ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 7, y - 6, 14, 12, 6); ctx.stroke(); }
    floor(W * .5, W * .95, gy + 8);
    TB('I = 5,0 A', x1, cy - R - 16, DRED, 15, 'left'); TB('L = 25 cm', (x1 + x2) / 2, cy + R + 30, INK, 14);
    tag('B = 0,050 T', W * .3, H * .13, BLUE_D, 16);
    ph_fade(p, .3, function () { tag('N = B·L / (μ₀·I) ≈ 2 000 spires', W * .5, H * .96, ORA2, 15); });
  },
  /* 9 · deux fils parallèles : courants opposés, champ à mi-distance */
  function (p) {
    var x1 = W * .22, x2 = W * .78, y = H * .5, m = W * .5;
    ph_circ(x1, y, W * .28, '#cfe0f3', [4, 5]); ph_circ(x2, y, W * .28, '#cfe0f3', [4, 5]);
    zsym(x1, y, 14, DRED, true); zsym(x2, y, 14, DRED, false); TB('I = 10 A', x1, y + 38, DRED, 14); TB('I = 10 A', x2, y + 38, DRED, 14);
    DOT(m, y, 5, INK); TB('M', m + 12, y + 20, INK, 15); ph_dim(x1 + 18, y + 62, x2 - 18, y + 62, '4,0 cm', GREY, 0);
    ph_fade(p, 0, function () { A(m - 8, y, 0, -p * 52, RED, '', 3.2); A(m + 8, y, 0, -p * 52, BLUE, '', 3.2); A(m + 70, y, 0, -p * 104, INK, '', 4.5);
      tag('B₁ + B₂ = 200 µT', m + 70, y - 122, INK, 15); tag('chacun : 100 µT', m, y - 78, DGREEN, 13); });
  }
]);
