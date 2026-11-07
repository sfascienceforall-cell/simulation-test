/* Physique 5e · chapitre 3 : deuxième loi de Newton */
function ph3_cab(x, y, w, h, col) { ctx.fillStyle = '#f4f8fc'; ctx.strokeStyle = col || BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.stroke(); }
function ph3_pulley(x, y, r) { DOT(x, y, r, '#e2e6ea'); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); DOT(x, y, 3, INK); }

SFA.theo("c03", {
  icon: function () {
    TB('ΣF = m·a', W * .5, H * .46, BLUE_D, 38); TB('accélération ∝ force', W * .5, H * .68, ORANGE, 18);
    ph_box(W * .22, H * .8, 40, 24, BLUE, ''); A(W * .1, H * .8, 38, 0, ORANGE, '', 3);
  },
  anim: function (t) {
    var T = 300, k = Math.floor(t / T) % 3, ms = [1, 2, 4], m = ms[k], F = 12, a = F / m, s = (t % T) / 60, v = a * s;
    var gy = H * .66, cx = W * .4, bw = 26 + m * 8, bh = 22 + m * 8;
    /* sol qui défile */
    var off = ((t % T) / 60 * (t % T) / 60 * a * 1.1) % 26; 
    LN(0, gy, W, gy, INK, 2.4);
    for (var x = -30; x < W + 30; x += 26) { var xx = x - off; LN(xx, gy, xx - 8, gy + 9, '#b9bdc4', 1.3); }
    ph_box(cx, gy - bh / 2, bw, bh, BLUE, m + ' kg');
    DOT(cx - bw / 3, gy - 0, 0.1, INK);
    A(cx + bw / 2, gy - bh / 2, 60, 0, ORANGE, '', 4.4); TB('ΣF = 12 N', cx + bw / 2 + 44, gy - bh / 2 - 22, ORANGE, 14);
    var vx = W * .08, vy = H * .16;
    TB('m = ' + m + ' kg  →  a = F/m = ' + String(a).replace('.', ',') + ' m/s²', W * .5, 26, BLUE_D, 15);
    TB('t = ' + s.toFixed(1).replace('.', ',') + ' s', W * .08, H * .84, GREY, 14, 'left');
    TB('v = a·t = ' + v.toFixed(1).replace('.', ',') + ' m/s', W * .08, H * .94, DGREEN, 15, 'left');
    var bar = Math.min(1, v / 40) * W * .4; ctx.fillStyle = '#e6f1fb'; ctx.fillRect(W * .5, H * .86, W * .4, 12); ctx.fillStyle = GREEN; ctx.fillRect(W * .5, H * .86, bar, 12);
    TB('vitesse', W * .5, H * .86 - 6, GREY, 11, 'left');
    TB('même force, masse plus grande : accélération plus petite', W * .5, H * .42, GREY, 12);
  },
  th: '<div class="tcard"><b class="h">Deuxième loi de Newton</b><p>La résultante des forces qui s’exercent sur un corps de masse m produit une accélération de même direction et de même sens que la résultante : <b>ΣF = m·a</b> (N = kg·m/s²). À force égale, plus la masse est grande, plus l’accélération est petite. Avec ΣF = 0, on retrouve le principe d’inertie.</p></div>' +
  '<div class="tcard"><b class="h">Masse et poids</b><p>La <b>masse</b> m (kg) mesure l’inertie : elle ne change pas d’un lieu à l’autre. Le <b>poids</b> P = m·g (N) est la force d’attraction exercée par l’astre : g ≈ 9,81 N/kg sur Terre, 1,62 N/kg sur la Lune. Un astronaute de 60 kg pèse ≈ 589 N sur Terre et 97,2 N sur la Lune, mais sa masse reste 60 kg. En chute libre (frottement négligé), a = g quel que soit m.</p></div>' +
  '<div class="tcard"><b class="h">Méthode : le diagramme des forces isolées</b><ol><li>Isole le corps (ou chaque corps séparément) et dessine <i>toutes</i> les forces qu’il subit : poids, normale, tension, frottement, poussée.</li><li>Choisis un axe orienté dans le sens du mouvement (ou de l’accélération).</li><li>Écris ΣF = m·a avec les signes : forces dans le sens de l’axe positives.</li><li>Résous. Dans un système relié par un fil, les accélérations sont égales (fil tendu) et la tension est la même des deux côtés d’une poulie sans frottement.</li></ol></div>' +
  '<div class="tcard"><b class="h">Poids apparent</b><p>La balance mesure la <b>normale</b> N, pas le poids. Dans un ascenseur d’accélération a (positive vers le haut) : N − m·g = m·a, donc <b>N = m·(g + a)</b>. Accélération vers le haut : on « pèse plus » ; vers le bas : on « pèse moins » ; en chute libre (a = −g) : N = 0, apesanteur apparente. La balance ne dit rien du sens de la vitesse.</p></div>' +
  '<div class="tcard"><b class="h">Pièges et exemple chiffré</b><ul><li>Au sommet d’un lancer vertical, v = 0 mais a = g vers le bas : une vitesse nulle n’implique pas une accélération nulle.</li><li>La tension d’un fil entre deux masses n’égale pas m·g (sauf à l’équilibre).</li></ul><p><b>Chariot de 0,80 kg tiré par 0,050 kg :</b> a = m₂·g/(m₁ + m₂) = 0,4905/0,85 ≈ 0,577 m/s² et T = m₁·a ≈ 0,462 N, inférieur à m₂·g = 0,49 N.</p></div>'
});

SFA.figs("c03", [
 /* 1 résultante 12 N sur chariot 3 kg */
 function (p) {
  var gy = H * .66, x0 = W * .12; ph_ground(gy, 0, W);
  var X = function (s) { return x0 + (s / 5) * (W * .62); };
  function cart(x, al) { ctx.globalAlpha = al; ph_box(x, gy - 20, 56, 30, BLUE, '3 kg'); DOT(x - 16, gy - 4, 6, '#555'); DOT(x + 16, gy - 4, 6, '#555'); ctx.globalAlpha = 1; }
  if (p > 0) { [1, 2, 3, 4, 5].forEach(function (s) { cart(X(s) + 0 * s, .22 * ph_ease(p, s * .08, s * .08 + .3)); }); }
  cart(X(0), 1); A(X(0) - 28, gy - 20, -46 + 0, 0, 0, '');
  A(X(0) + 30, gy - 20, 56, 0, ORANGE, '', 4.4); TB('12 N', X(0) + 60, gy - 40, ORANGE, 15);
  TB('au repos à t = 0', X(0), H * .12, GREY, 13);
  if (p > 0) { var q = ph_ease(p, .1, .8); ctx.globalAlpha = q; TB('t = 5 s', X(5), H * .12, GREY, 13); A(X(5) + 30, gy - 20, 120 * q, 0, GREEN, '', 3.6);
   tag('a = 12/3 = 4 m/s²', W * .4, H * .88, DRED, 15); tag('v = 4 × 5 = 20 m/s', X(5) + 50, gy - 50, DGREEN, 14); ctx.globalAlpha = 1; }
 },
 /* 2 astronaute Terre / Lune */
 function (p) {
  [[W * .27, 'Terre', '#d6e9fb', BLUE, 9.81, '589 N', 1], [W * .73, 'Lune', '#e9eaec', GREY, 1.62, '97,2 N', 1.62 / 9.81]].forEach(function (c) {
   var x = c[0], gy = H * .7; ctx.fillStyle = c[2]; ctx.beginPath(); ctx.ellipse(x, gy + 70, W * .21, 62, 0, Math.PI, 0); ctx.fill();
   ctx.strokeStyle = c[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, gy + 70, W * .21, 62, 0, Math.PI, 0); ctx.stroke();
   TB(c[1] + '  g = ' + String(c[4]).replace('.', ',') + ' N/kg', x, H * .08, c[3] === GREY ? INK : BLUE_D, 13);
   pers(x, gy + 6, 60, VIOLET, 1); TB('60 kg', x - 40, gy - 20, VIO_D, 13, 'right');
   if (p > 0) { var q = ph_ease(p, 0, .6); A(x + 30, gy - 30, 0, 70 * c[6] * q + 0.1, RED, '', 3.6); if (q > .95) TB('P = ' + c[5], x + 42, gy - 30 + 70 * c[6] * 1 + 4, DRED, 14, 'left'); }
  });
  if (p > 0 && ph_ease(p, .4, 1) > .5) tag('la masse reste 60 kg', W * .5, H * .22, DGREEN, 14);
 },
 /* 3 voiture 0 -> 100 km/h */
 function (p) {
  var gx = W * .56, gb = H * .8, gw = W * .38, gh = H * .56;
  LN(gx, gb, gx + gw + 8, gb, AX, 1.5); LN(gx, gb + 4, gx, gb - gh - 8, AX, 1.5); TB('t (s)', gx + gw, gb + 16, GREY, 11, 'right'); TB('v (km/h)', gx + 4, gb - gh - 12, GREY, 11, 'left');
  TB('8', gx + gw * .8, gb + 14, INK, 11); TB('100', gx - 6, gb - gh * .8 + 4, INK, 11, 'right');
  LN(gx, gb, gx + gw * .8, gb - gh * .8, BLUE, 3.4); ph_dash(gx + gw * .8, gb, gx + gw * .8, gb - gh * .8); ph_dash(gx, gb - gh * .8, gx + gw * .8, gb - gh * .8);
  var cy = H * .5; ctx.fillStyle = '#e5f2ec'; ctx.strokeStyle = GREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(W * .16, cy - 24, 84, 24, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(W * .16 + 20, cy - 40, 40, 18, 6); ctx.fill(); ctx.stroke();
  DOT(W * .16 + 18, cy + 2, 8, '#555'); DOT(W * .16 + 68, cy + 2, 8, '#555'); TB('1 200 kg', W * .16 + 42, cy - 50, BLUE_D, 13);
  TB('0 → 100 km/h en 8,0 s', W * .27, H * .12, INK, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(W * .16 + 84, cy - 12, 70 * q, 0, BLUE, '', 4.2); A(W * .16, cy - 12, -34 * q, 0, RED, '', 3.4);
   if (q > .95) { TB('F motrice 4,67 kN', W * .16 + 90, cy + 40, BLUE_D, 13, 'left'); TB('500 N', W * .16 - 2, cy - 22, DRED, 12, 'right'); tag('a ≈ 3,47 m/s²', W * .27, H * .78, DRED, 14); tag('ΣF ≈ 4,17 kN', W * .27, H * .9, DGREEN, 14); } }
 },
 /* 4 chariot + poulie + masse suspendue */
 function (p) {
  var ty = H * .42, tx0 = W * .16, tx1 = W * .72;
  LN(tx0, ty, tx1, ty, INK, 3); ctx.fillStyle = '#e8d9bd'; ctx.fillRect(tx0, ty, tx1 - tx0, 12); ctx.strokeStyle = '#9a7b3c'; ctx.lineWidth = 1.5; ctx.strokeRect(tx0, ty, tx1 - tx0, 12);
  ph3_pulley(tx1 + 8, ty - 2, 14);
  var cx = W * .36; ph_box(cx, ty - 20, 62, 36, BLUE, '0,80 kg'); DOT(cx - 18, ty - 1, 5, '#555'); DOT(cx + 18, ty - 1, 5, '#555');
  LN(cx + 31, ty - 24, tx1 + 8, ty - 16, INK, 1.6); var hx = tx1 + 22; LN(hx, ty - 2, hx, H * .66, INK, 1.6); ph_box(hx, H * .66 + 18, 30, 30, ORANGE, '');
  TB('0,050 kg', hx - 24, H * .66 + 22, DRED, 12, 'right');
  A(hx, H * .66 + 33, 0, 36, RED, '', 3.2); TB('P = 0,49 N', hx + 10, H * .66 + 70, DRED, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(cx + 31, ty - 20, 70 * q, 0, VIOLET, '', 3.6); A(hx, H * .66 + 5, 0, -34 * q, VIOLET, '', 3.2);
   if (q > .95) { tag('T ≈ 0,462 N', cx + 90, ty - 52, VIO_D, 14); tag('a ≈ 0,577 m/s²', W * .38, H * .9, DGREEN, 14); } }
 },
 /* 5 QCM pierre au sommet */
 function (p) {
  var x = W * .34, ytop = H * .2, ybot = H * .84; LN(x, ybot, x, ytop, '#d6d9dd', 1.6, [5, 5]);
  BALL(x, ybot, 10); A(x + 24, ybot, 0, -54, GREEN, '', 3); TB('v ↑', x + 46, ybot - 28, DGREEN, 13, 'left'); TB('départ', x - 18, ybot + 4, GREY, 12, 'right');
  BALL(x, ytop, 13); TB('sommet : v = 0', x + 26, ytop + 5, INK, 14, 'left');
  BALL(x, H * .52, 10); ctx.globalAlpha = .45; A(x + 24, H * .52, 0, 50, GREEN, '', 3); ctx.globalAlpha = 1; TB('v ↓', x + 46, H * .52 + 28, DGREEN, 13, 'left');
  TB('a au sommet ?', W * .7, H * .5, GREY, 18);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(x, ytop + 14, 0, 44 * q, RED, '', 4.2); if (q > .95) { TB('P = m·g', x - 14, ytop + 40, DRED, 13, 'right'); tag('a = g = 9,81 m/s², vers le bas', W * .7, H * .64, DRED, 14); } }
 },
 /* 6 freinage */
 function (p) {
  var gy = H * .62, x0 = W * .2, x1 = W * .97, X = function (m) { return x0 + m / 30 * (x1 - x0 - 90); };
  ph_ground(gy + 12, 0, W);
  function car(x, al) { ctx.globalAlpha = al; ctx.fillStyle = '#e5f2ec'; ctx.strokeStyle = GREEN; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x, gy - 28, 84, 28, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(x + 20, gy - 44, 40, 18, 6); ctx.fill(); ctx.stroke(); DOT(x + 18, gy + 4, 8, '#555'); DOT(x + 66, gy + 4, 8, '#555'); ctx.globalAlpha = 1; }
  car(X(0), 1); A(X(0) + 84, gy - 14, 50, 0, GREEN, '', 3.4); TB('72 km/h', X(0) + 150, gy - 10, DGREEN, 13, 'left'); A(X(0), gy - 14, -52, 0, RED, '', 4); TB('6 300 N', X(0) - 20, gy - 28, DRED, 13, 'right');
  TB('900 kg', X(0) + 42, gy - 54, BLUE_D, 13);
  if (p > 0) { var q = ph_ease(p, 0, .7); car(X(28.6), .35 * q); ctx.globalAlpha = q;
   LN(X(0) + 42, gy + 40, X(28.6) + 42, gy + 40, ORANGE, 2); LN(X(0) + 42, gy + 34, X(0) + 42, gy + 46, ORANGE, 2); LN(X(28.6) + 42, gy + 34, X(28.6) + 42, gy + 46, ORANGE, 2);
   TB('d ≈ 28,6 m', X(14) + 42, gy + 62, ORANGE, 14); tag('a = −7,0 m/s²', W * .3, H * .14, DRED, 14); tag('t = 20/7 ≈ 2,86 s', W * .72, H * .14, DGREEN, 14); ctx.globalAlpha = 1; }
 },
 /* 7 ascenseur */
 function (p) {
  var cx = W * .38, cy = H * .5, w = W * .3, h = H * .66;
  ctx.strokeStyle = '#b9bdc4'; ctx.lineWidth = 3; LN(cx, H * .02, cx, cy - h / 2, INK, 3);
  ph3_cab(cx, cy, w, h); TB('cabine 500 kg', cx, cy - h / 2 + 18, BLUE_D, 12);
  ph_box(cx, cy + h / 2 - 8, w * .6, 12, GREY, ''); pers(cx, cy + h / 2 - 14, 54, VIOLET, 1); TB('65 kg', cx + 28, cy + 4, VIO_D, 12, 'left');
  A(cx + w / 2 + 22, cy + 30, 0, -66, ORANGE, '', 3.6); TB('a = 1,5 m/s² ↑', cx + w / 2 + 34, cy - 50, ORANGE, 13, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(cx - 30, cy + h / 2 - 20, 0, -54 * q * 1.2, VIOLET, '', 3.2); A(cx - 30, cy + h / 2 - 20 - 0, 0, 0, RED);
   ph_arrp(cx, cy - h / 2, cx, cy - h / 2 - 38, q, VIOLET, '', 3.6);
   if (q > .95) { tag('N − m·g = m·a', W * .74, H * .72, INK, 13); tag('N = 735 N → balance : 74,9 kg', W * .66, H * .86, VIO_D, 13); tag('T ≈ 6,39 kN', cx + 56, cy - h / 2 - 8, VIO_D, 13); } }
 },
 /* 8 balance qui indique 56 kg */
 function (p) {
  var cx = W * .36, cy = H * .5, w = W * .3, h = H * .7;
  ph3_cab(cx, cy, w, h); pers(cx - 14, cy + h / 2 - 22, 66, VIOLET, 1); TB('70 kg', cx - 14, cy - 18, VIO_D, 12);
  ph_box(cx, cy + h / 2 - 12, w * .7, 14, GREY, '');
  ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx + 8, cy + h / 2 - 40, 44, 20, 4); ctx.fill(); ctx.stroke(); TB('56 kg', cx + 30, cy + h / 2 - 25, DRED, 13);
  TB('Que peut-on conclure ?', W * .72, H * .2, GREY, 15);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(W * .72, H * .38, 0, 60 * q, ORANGE, '', 4.2); if (q > .95) { TB('a = 1,96 m/s²', W * .72, H * .36, DRED, 15); TB('dirigée vers le bas', W * .72, H * .78, ORANGE, 14); tag('N = 56·g < P = 70·g', W * .72, H * .9, DGREEN, 13); } }
 },
 /* 9 fusée-jouet */
 function (p) {
  function rocket(x, y, sc, lab, fl) { ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.3; ctx.beginPath(); ctx.moveTo(x, y - 54 * sc); ctx.quadraticCurveTo(x + 18 * sc, y - 30 * sc, x + 14 * sc, y + 20 * sc); ctx.lineTo(x - 14 * sc, y + 20 * sc); ctx.quadraticCurveTo(x - 18 * sc, y - 30 * sc, x, y - 54 * sc); ctx.fill(); ctx.stroke();
   ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(x - 14 * sc, y + 20 * sc); ctx.lineTo(x - 26 * sc, y + 34 * sc); ctx.lineTo(x - 10 * sc, y + 20 * sc); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 14 * sc, y + 20 * sc); ctx.lineTo(x + 26 * sc, y + 34 * sc); ctx.lineTo(x + 10 * sc, y + 20 * sc); ctx.fill();
   ctx.fillStyle = ORA2; ctx.beginPath(); ctx.moveTo(x - 8 * sc, y + 20 * sc); ctx.lineTo(x, y + (36 + 12 * Math.sin(tGlob * .5)) * sc); ctx.lineTo(x + 8 * sc, y + 20 * sc); ctx.fill();
   TB(lab, x - 26, y - 6, BLUE_D, 12, 'right'); }
  var xs = [W * .22, W * .64];
  rocket(xs[0], H * .52, 1, '20 kg'); rocket(xs[1], H * .52, 1, '15 kg');
  TB('décollage', xs[0], H * .08, GREY, 13); TB('avant l’extinction', xs[1], H * .08, GREY, 13);
  [0, 1].forEach(function (i) { A(xs[i] + 30, H * .56, 0, -62, ORANGE, '', 3.6); TB('300 N', xs[i] + 40, H * .56 - 70, ORANGE, 12, 'left'); A(xs[i] + 30, H * .56, 0, (i ? 46 : 62), RED, '', 3.2); });
  TB('P = 196 N', xs[0] + 40, H * .56 + 70, DRED, 12, 'left'); TB('P = 147 N', xs[1] + 40, H * .56 + 54, DRED, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('a = (300 − 196)/20 = 5,19 m/s²', xs[0] + 20, H * .94, DGREEN, 12); tag('a = (300 − 147)/15 = 10,19 m/s²', xs[1] + 20, H * .94, DGREEN, 12); ctx.globalAlpha = 1; }
 },
 /* 10 machine d'Atwood */
 function (p) {
  var cx = W * .5, py = H * .2, r = 24; LN(cx - 50, py - r - 12, cx + 50, py - r - 12, INK, 3); LN(cx, py - r - 12, cx, py - 2, INK, 2); ph3_pulley(cx, py, r);
  var yL = H * .62, yR = H * .5, xL = cx - r, xR = cx + r;
  LN(xL, py, xL, yL, INK, 1.6); LN(xR, py, xR, yR, INK, 1.6);
  ph_box(xL, yL + 22, 46, 44, BLUE, '3,0 kg'); ph_box(xR, yR + 17, 38, 34, ORANGE, '2,0 kg');
  A(xL, yL + 44, 0, 38, RED, '', 3.2); TB('29,4 N', xL - 10, yL + 78, DRED, 12, 'right'); A(xR, yR + 34, 0, 26, RED, '', 3.2); TB('19,6 N', xR + 10, yR + 64, DRED, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ph_arrp(xL, yL, xL, yL - 31, q, VIOLET, '', 3.4); ph_arrp(xR, yR, xR, yR - 31, q, VIOLET, '', 3.4);
   if (q > .95) { TB('T', xL + 12, yL - 14, VIO_D, 14, 'left'); TB('T', xR + 12, yR - 14, VIO_D, 14, 'left'); A(xL - 52, yL + 4, 0, 34, DRED, '', 3); TB('a', xL - 66, yL + 34, DRED, 14, 'right'); A(xR + 52, yR + 40, 0, -34, DRED, '', 3); TB('a', xR + 66, yR + 18, DRED, 14, 'left');
    tag('a = 1,96 m/s²   T ≈ 23,5 N', W * .5, H * .95, DGREEN, 14); } }
 }
]);
