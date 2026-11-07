/* Physique 5e · chapitre 8 : champ et force électriques */
function ph8_plates(x0, x1, yT, yB, topPlus) { /* plaques horizontales */
  ctx.fillStyle = topPlus ? RED : BLUE; ctx.fillRect(x0, yT - 5, x1 - x0, 5); ctx.fillStyle = topPlus ? BLUE : RED; ctx.fillRect(x0, yB, x1 - x0, 5);
  TB(topPlus ? '+' : '−', x0 - 12, yT + 2, topPlus ? DRED : BLUE_D, 15); TB(topPlus ? '−' : '+', x0 - 12, yB + 8, topPlus ? BLUE_D : DRED, 15); }
function ph8_vplates(xL, xR, y0, y1) { ctx.fillStyle = RED; ctx.fillRect(xL - 5, y0, 5, y1 - y0); ctx.fillStyle = BLUE; ctx.fillRect(xR, y0, 5, y1 - y0); TB('+', xL - 14, y0 + 8, DRED, 16); TB('−', xR + 16, y0 + 8, BLUE_D, 16); }
function ph8_field(xs, ys, ex, ey) { for (var i = 0; i < xs.length; i++) for (var j = 0; j < ys.length; j++) A(xs[i], ys[j], ex, ey, '#b7bdc4', '', 1.6); }

SFA.theo("c08", {
  icon: function () {
    TB('E = F/q', W * .5, H * .4, BLUE_D, 38); TB('F = k·q₁q₂/r²', W * .5, H * .62, ORANGE, 20);
    chg(W * .13, H * .84, 12, 1); chg(W * .87, H * .84, 12, -1); LN(W * .2, H * .84, W * .8, H * .84, '#d6d9dd', 1.5, [4, 4]);
  },
  sub: [
   { t: "Loi de Coulomb et champ d’une charge",
     anim: function (t) {
       var cx = W * .16, cy = H * .54; var r = .12 + .26 * (.5 + .5 * Math.sin(t * .01));          /* m */
       var kpx = (W * .62) / .4, X = cx + 40 + r * kpx, E = 9e9 * 4e-9 / (r * r), F = E * 1e-9;
       for (var i = 0; i < 12; i++) { var a = i * PI / 6, c = Math.cos(a), s = Math.sin(a); A(cx + 26 * c, cy + 26 * s, 20 * c, 20 * s, '#b7bdc4', '', 1.6); }
       chg(cx, cy, 16, 1); TB('+4,0 nC', cx, cy + 36, DRED, 12);
       chg(X, cy, 10, 1); TB('+1,0 nC', X, cy + 28, DRED, 11);
       LN(cx + 40, cy + 62, X, cy + 62, GREY, 1.4); TB('r = ' + r.toFixed(2).replace('.', ',') + ' m', (cx + 40 + X) / 2, cy + 80, INK, 13);
       var L = Math.min(140, 36 / (r * r) * 1.8); A(X + 14, cy, L, 0, RED, '', 4); TB('F', X + 14 + L + 10, cy - 12, DRED, 14);
       TB('E = k·Q/r² = ' + Math.round(E).toLocaleString('fr-FR').replace(/ /g, ' ') + ' N/C', W * .5, H * .12, BLUE_D, 15);
       TB('F = q·E = ' + (F * 1e6).toFixed(2).replace('.', ',') + ' µN', W * .5, H * .22, DRED, 15);
       TB('r doublé → E et F divisés par 4', W * .5, H * .92, GREY, 13);
     },
     th: '<div class="tcard"><b class="h">Loi de Coulomb</b><p>Deux charges ponctuelles q<sub>1</sub> et q<sub>2</sub> à la distance r exercent l’une sur l’autre des forces de même norme : <b>F = k·|q<sub>1</sub>·q<sub>2</sub>|/r²</b>, k = 9,0·10<sup>9</sup> N·m²/C². Charges de même signe : <b>répulsion</b> ; de signes opposés : <b>attraction</b>. Elle est en 1/r² : doubler r divise F par 4 ; doubler une charge double F. Exemple : +2,0 µC et +3,0 µC à 30 cm : F = 9,0·10<sup>9</sup>·6,0·10<sup>−12</sup>/0,09 = 0,60 N, répulsive.</p></div>' +
     '<div class="tcard"><b class="h">Champ électrique</b><p>Une charge Q modifie l’espace : en chaque point, une charge d’essai q subit F = q·E. Le <b>champ</b> E = F/q (N/C ou V/m) est un vecteur. Pour une charge ponctuelle : <b>E = k·|Q|/r²</b>, dirigé <i>vers l’extérieur</i> si Q &gt; 0, vers Q si Q &lt; 0. Q = +4,0 nC à 20 cm : E = 900 N/C. La force sur une charge q est <b>F = q·E</b> : dans le sens de E si q &gt; 0, opposé si q &lt; 0.</p></div>' +
     '<div class="tcard"><b class="h">Plusieurs charges : superposition</b><p>Le champ (ou la force) total est la <b>somme vectorielle</b> des contributions de chaque charge. Méthode : calcule chaque norme séparément, dessine les vecteurs, additionne par composantes. Trois charges de +2,0 µC aux sommets d’un triangle équilatéral de 30 cm : chaque voisine exerce 0,40 N ; leur résultante vaut 2 × 0,40 × cos 30° ≈ 0,69 N, dirigée du centre vers la charge. Point où E = 0 entre +4,0 µC et +1,0 µC distantes de 0,60 m : 4/x² = 1/(0,60 − x)², donc x = 0,40 m.</p></div>' +
     '<div class="tcard"><b class="h">Lignes de champ</b><ul><li>Elles partent des charges + et arrivent sur les charges −, sans jamais se croiser.</li><li>Le champ est tangent à la ligne ; il est plus intense là où les lignes sont serrées.</li><li>Une charge lâchée sans vitesse démarre le long de la ligne de champ, mais sa trajectoire ne la suit pas si la ligne est courbe.</li></ul></div>' },
   { t: "Champ uniforme et condensateur plan",
     anim: function (t) {
       var xL = W * .1, xR = W * .62, yT = H * .22, yB = H * .74; ph8_plates(xL, xR, yT, yB, false);
       for (var x = xL + 30; x < xR - 20; x += 44) A(x, yB - 6, 0, -(yB - yT) + 16, '#cfd4da', '', 1.6);
       var s = (t % 240) / 240, vx = (xR - xL) * .45 * 0 + 0; var px = xL + 8 + s * (xR - xL - 16), a = (yB - yT) * .5, py = yB - 24 - a * s * s * 1.0;
       px = xL + 12 + s * (xR - xL - 24);
       var sx = px, sy = yT + 40 + (yB - yT - 80) * s * s * .0;
       /* particule positive qui entre horizontalement et est poussée vers le bas (plaque −) */
       sy = yT + 34 + (yB - yT - 70) * s * s;
       ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); for (var i = 0; i <= 30; i++) { var ss = i / 30; i ? ctx.lineTo(xL + 12 + ss * (xR - xL - 24), yT + 34 + (yB - yT - 70) * ss * ss) : ctx.moveTo(xL + 12 + ss * (xR - xL - 24), yT + 34 + (yB - yT - 70) * ss * ss); } ctx.stroke(); ctx.setLineDash([]);
       chg(sx, sy, 8, 1); A(sx, sy, 0, 34, RED, '', 3.4);
       TB('E = U/d', xR + 22, H * .36, BLUE_D, 18, 'left'); TB('F = q·E', xR + 22, H * .5, DRED, 18, 'left'); TB('a = qE/m', xR + 22, H * .64, ORANGE, 16, 'left');
       TB('Champ uniforme entre deux plaques : trajectoire parabolique', W * .5, 22, BLUE_D, 14);
       LN(xL - 18, yT, xL - 18, yB, GREY, 1.3); TB('d', xL - 28, (yT + yB) / 2, INK, 13, 'right');
     },
     th: '<div class="tcard"><b class="h">Condensateur plan</b><p>Deux plaques parallèles chargées de signes opposés, séparées de d, créent entre elles un champ <b>uniforme</b> (même direction, sens et norme partout) dirigé de la plaque + vers la plaque − : <b>E = U/d</b> (V/m). U = 400 V et d = 2,0 cm donnent E = 2,0·10<sup>4</sup> V/m. Une charge q placée entre les plaques subit <b>F = q·E = q·U/d</b> constante.</p></div>' +
     '<div class="tcard"><b class="h">Mouvement d’une charge dans E uniforme</b><p>La force est constante : a = q·E/m. Charge lâchée sans vitesse : mouvement rectiligne uniformément accéléré. Charge qui entre perpendiculairement au champ avec v<sub>0</sub> (longueur des plaques L) : mouvement uniforme selon l’axe des plaques (t = L/v<sub>0</sub>) et uniformément accéléré perpendiculairement : <b>déviation y = ½·a·t² = q·U·L²/(2·m·d·v<sub>0</sub>²)</b>. Elle est proportionnelle à U et inversement proportionnelle à v<sub>0</sub>² : doubler U et v<sub>0</sub> divise y par 2.</p></div>' +
     '<div class="tcard"><b class="h">Poids négligeable ?</b><p>Électron dans 2 000 N/C : F = 1,6·10<sup>−19</sup> × 2 000 = 3,2·10<sup>−16</sup> N, donc a ≈ 3,5·10<sup>14</sup> m/s², alors que son poids vaut 9,1·10<sup>−30</sup> N : négligeable. Pour une gouttelette d’huile (expérience de Millikan), le poids compte : à l’équilibre q·E = m·g, donc q = m·g·d/U ; on trouve toujours des multiples entiers de e : la charge est <b>quantifiée</b>.</p></div>' }
  ]
});

SFA.figs("c08", [
 /* 1 Coulomb */
 function (p) {
  var cy = H * .5, x1 = W * .22, x2 = W * .78; chg(x1, cy, 18, 1); chg(x2, cy, 22, 1); TB('+2,0 µC', x1, cy + 40, DRED, 13); TB('+3,0 µC', x2, cy + 44, DRED, 13);
  LN(x1, cy + 70, x2, cy + 70, GREY, 1.4); LN(x1, cy + 64, x1, cy + 76, GREY, 1.4); LN(x2, cy + 64, x2, cy + 76, GREY, 1.4); TB('r = 30 cm', W * .5, cy + 90, INK, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(x1 - 22, cy, -60 * q, 0, RED, '', 4); A(x2 + 26, cy, 60 * q, 0, RED, '', 4); if (q > .95) { tag('F = k·q₁q₂/r² = 0,60 N', W * .5, H * .22, DRED, 16); TB('répulsion', W * .5, cy + 5, DGREEN, 15); } }
  else TB('F = ?', W * .5, H * .22, GREY, 20);
 },
 /* 2 champ d'une charge */
 function (p) {
  var cx = W * .3, cy = H * .52; for (var i = 0; i < 12; i++) { var a = i * PI / 6, c = Math.cos(a), s = Math.sin(a); A(cx + 28 * c, cy + 28 * s, 28 * c, 28 * s, '#c3c8ce', '', 1.8); }
  chg(cx, cy, 20, 1); TB('+4,0 nC', cx, cy + 44, DRED, 13);
  var px = cx + W * .4; LN(cx + 20, cy, px, cy, GREY, 1.4, [4, 4]); TB('r = 20 cm', (cx + px) / 2, cy + 22, INK, 13); DOT(px, cy, 5, INK); TB('P', px, cy - 12, INK, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(px, cy, 56 * q, 0, ORANGE, '', 4); if (q > .95) { tag('E = k·Q/r² = 900 N/C', W * .66, H * .2, DRED, 15); TB('vers l’extérieur', W * .66, H * .86, DGREEN, 14); } }
  else TB('E en P ?', W * .66, H * .2, GREY, 18);
 },
 /* 3 champ uniforme : + et électron */
 function (p) {
  var xs = [], ys = []; for (var x = W * .1; x < W * .92; x += W * .16) xs.push(x); for (var y = H * .2; y < H * .85; y += H * .14) ys.push(y);
  ph8_field(xs, ys, W * .08, 0); TB('E = 2 000 N/C', W * .5, H * .08, BLUE_D, 15);
  chg(W * .3, H * .38, 13, 1); chg(W * .3, H * .72, 10, -1); TB('+5,0 µC', W * .3 - 24, H * .38 + 5, DRED, 12, 'right'); TB('électron', W * .3 - 18, H * .72 + 5, BLUE_D, 12, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(W * .3 + 16, H * .38, 70 * q, 0, RED, '', 4); A(W * .3 - 12, H * .72, -34 * q, 0, RED, '', 4); if (q > .95) { TB('F = 1,0·10⁻² N', W * .68, H * .4, DRED, 14, 'left'); TB('F = 3,2·10⁻¹⁶ N', W * .5, H * .86, DRED, 14, 'left'); TB('a ≈ 3,5·10¹⁴ m/s²', W * .5, H * .96, ORANGE, 13, 'left'); } }
 },
 /* 4 deux plaques 400 V, 2 cm */
 function (p) {
  var xL = W * .3, xR = W * .7, y0 = H * .14, y1 = H * .78; ph8_vplates(xL, xR, y0, y1);
  for (var y = y0 + 20; y < y1 - 10; y += 34) A(xL + 14, y, xR - xL - 28, 0, '#c3c8ce', '', 1.6);
  LN(xL, y1 + 18, xR, y1 + 18, GREY, 1.4); LN(xL, y1 + 12, xL, y1 + 24, GREY, 1.4); LN(xR, y1 + 12, xR, y1 + 24, GREY, 1.4); TB('d = 2,0 cm', W * .5, y1 + 38, INK, 13);
  TB('U = 400 V', W * .5, y0 - 8, BLUE_D, 15); chg(W * .5, (y0 + y1) / 2, 11, 1); TB('3,0 nC', W * .5, (y0 + y1) / 2 + 30, DRED, 12);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(W * .5 + 14, (y0 + y1) / 2, 50 * q, 0, RED, '', 4); if (q > .95) { TB('E = U/d = 2,0·10⁴ V/m', W * .76, H * .3, BLUE_D, 13, 'left'); TB('F = qE = 6,0·10⁻⁵ N', W * .76, H * .5, DRED, 13, 'left'); } }
 },
 /* 5 QCM doubler charge et distance */
 function (p) {
  [[W * .27, 'avant', 1, 1, 'F'], [W * .73, 'après', 2, 2, p > 0 ? 'F/2' : '?']].forEach(function (c) {
   var cy = H * .36, d = 52 * c[3], x1 = c[0] - d / 2 - 16, x2 = c[0] + d / 2 + 16, r1 = 9 + 4 * c[2];
   chg(x1, cy, r1, 1); chg(x2, cy, 11, 1); TB(c[2] === 2 ? '2q₁' : 'q₁', x1, cy + 34, DRED, 12); TB('q₂', x2, cy + 34, DRED, 12);
   LN(x1, cy - 34, x2, cy - 34, GREY, 1.3); TB(c[3] === 2 ? '2d' : 'd', c[0], cy - 42, INK, 13); TB(c[1], c[0], H * .08, GREY, 13);
   A(x2 + 14, cy, 26, 0, RED, '', 3.4); TB('F' + (c[4] === 'F/2' ? ' ?' : ''), x2 + 52, cy - 10, DRED, 13); });
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('F’ = k·(2q₁)q₂/(2d)² = F/2', W * .5, H * .7, DGREEN, 15); ctx.globalAlpha = 1; }
  else TB('F’ = ?', W * .5, H * .7, GREY, 20);
 },
 /* 6 où E = 0 ? */
 function (p) {
  function row(y, s2, xz, lab) { var x0 = W * .1, k = W * .8 / 1.4, X = function (m) { return x0 + m * k; }; LN(X(0) - 20, y, X(1.4), y, '#d6d9dd', 1.5); chg(X(0), y, 15, 1); chg(X(.6), y, 9, s2); TB('+4,0 µC', X(0), y + 32, DRED, 12); TB((s2 > 0 ? '+' : '−') + '1,0 µC', X(.6), y + 28, s2 > 0 ? DRED : BLUE_D, 12);
   if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; DOT(X(xz), y, 6, GREEN); A(X(xz), y - 6, -34, 0, RED, '', 2.6); A(X(xz), y - 22, 34 * 1, 0, BLUE, '', 2.6); TB(lab, X(xz), y - 40, DGREEN, 13); ctx.globalAlpha = 1; } else TB('E = 0 ?', X(.9), y - 14, GREY, 14); }
  row(H * .32, 1, .4, 'x = 0,40 m'); row(H * .74, -1, 1.2, 'x = 1,20 m');
  TB('(a)', W * .04, H * .32, INK, 13, 'left'); TB('(b)', W * .04, H * .74, INK, 13, 'left');
 },
 /* 7 triangle équilatéral */
 function (p) {
  var cx = W * .38, by = H * .84, s = H * .6, ty = by - s * .866, lx = cx - s / 2, rx = cx + s / 2;
  LN(lx, by, rx, by, '#d6d9dd', 1.5); LN(lx, by, cx, ty, '#d6d9dd', 1.5); LN(rx, by, cx, ty, '#d6d9dd', 1.5); chg(lx, by, 13, 1); chg(rx, by, 13, 1); chg(cx, ty, 13, 1); TB('30 cm', cx, by + 16, INK, 12);
  TB('3 × +2,0 µC', W * .86, H * .1, GREY, 13, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); [[1, 1], [-1, 1]].forEach(function (d) { A(cx, ty, d[0] * 36 * q, -d[1] * 62 * q * .62, '#d2a26b', '', 2.6); }); A(cx, ty - 14, 0, -66 * q, RED, '', 4.4);
   if (q > .95) { TB('0,40 N chacune', W * .98, H * .3, ORANGE, 13, 'right'); TB('F = 2 × 0,40 × cos 30°', W * .98, H * .44, DRED, 13, 'right'); TB('≈ 0,69 N, vers l’extérieur', W * .98, H * .58, DRED, 14, 'right'); } }
 },
 /* 8 QCM ligne de champ courbe */
 function (p) {
  var cx = W * .5, cy = H * .98, R = H * .74; chg(W * .12, H * .9, 12, 1); chg(W * .88, H * .9, 12, -1);
  ctx.strokeStyle = '#b7bdc4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, PI * 1.08, PI * 1.92); ctx.stroke();
  var a0 = PI * 1.12, P = {x: cx + R * Math.cos(a0), y: cy + R * Math.sin(a0)}; A(P.x + 4, P.y + 10, 34, -16, '#8a95a3', '', 1.8); TB('ligne de champ', cx, cy - R - 10, GREY, 13);
  DOT(P.x, P.y, 6, RED); TB('+ au repos', P.x - 8, P.y - 12, DRED, 12, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .8); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); var x = P.x, y = P.y, vx = .52, vy = -.0, tx = Math.cos(a0 + PI / 2), ty = Math.sin(a0 + PI / 2); vx = tx; vy = ty; ctx.moveTo(x, y); for (var i = 0; i < 90 * q; i++) { var ex = (cx - x), ey = (cy - y), n = Math.hypot(ex, ey); x += vx * 2.2; y += vy * 2.2; vx += .0 + ex / n * .008; vy += ey / n * .008 + .003; var sp = Math.hypot(vx, vy); vx = vx / sp * (sp < 1 ? sp : 1); vy = vy / sp * (sp < 1 ? sp : 1); ctx.lineTo(x, y); } ctx.stroke();
   if (q > .95) tag('démarre le long de la ligne, puis s’en écarte', W * .5, H * .18, DRED, 13); }
  else TB('trajectoire d’une charge lâchée ?', W * .5, H * .18, GREY, 14);
 },
 /* 9 Millikan */
 function (p) {
  var xL = W * .2, xR = W * .56, yT = H * .14, yB = H * .8; ph8_plates(xL, xR, yT, yB, true); TB('U = 562 V', (xL + xR) / 2, yT - 12, BLUE_D, 14); LN(xR + 20, yT, xR + 20, yB, GREY, 1.3); TB('d = 1,0 cm', xR + 26, (yT + yB) / 2, INK, 12, 'left');
  var cx = (xL + xR) / 2, cy = (yT + yB) / 2; for (var x = xL + 20; x < xR - 10; x += 44) A(x, yT + 12, 0, 22, '#cfd4da', '', 1.5);
  DOT(cx, cy, 10, '#e8c25a'); ctx.strokeStyle = '#9a7b3c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 7); ctx.stroke();
  A(cx, cy + 12, 0, 46, ORANGE, '', 3.4); TB('P = m·g', cx + 12, cy + 56, ORANGE, 13, 'left'); TB('goutte immobile', cx - 16, cy - 16, GREY, 12, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(cx, cy - 12, 0, -46 * q, RED, '', 3.4); if (q > .95) { TB('q·E', cx + 12, cy - 52, DRED, 13, 'left'); TB('m ≈ 3,67·10⁻¹⁵ kg', W * .66, H * .3, INK, 13, 'left'); TB('q = mgd/U ≈ 6,4·10⁻¹⁹ C', W * .66, H * .44, DRED, 13, 'left'); TB('= 4 e : charge quantifiée', W * .66, H * .58, DGREEN, 13, 'left'); } }
 },
 /* 10 déviation d'un électron */
 function (p) {
  var xL = W * .22, xR = W * .72, yT = H * .2, yB = H * .76; ph8_plates(xL, xR, yT, yB, true);
  var y0 = (yT + yB) / 2 - 12, hy = 100; ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 40; i++) { var s = i / 40; i ? ctx.lineTo(xL + s * (xR - xL), y0 + hy * .5 * s * s) : ctx.moveTo(xL + s * (xR - xL), y0 + hy * .5 * s * s); } ctx.stroke(); LN(xR, y0 + hy * .5, W * .96, y0 + hy * .5 + (hy * .5) * 2 * .35 * 1, BLUE, 2, [4, 4]);
  chg(W * .1, y0, 8, -1); A(W * .1 + 12, y0, 28, 0, GREEN, '', 3); TB('v₀', W * .1 + 46, y0 - 10, DGREEN, 13, 'left'); TB('y', xR + 10, y0 + hy * .25 + 6, BLUE_D, 14, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .7); ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); for (var j = 0; j <= 40 * q; j++) { var s2 = j / 40; j ? ctx.lineTo(xL + s2 * (xR - xL), y0 + hy * .25 * s2 * s2) : ctx.moveTo(xL + s2 * (xR - xL), y0 + hy * .25 * s2 * s2); } ctx.stroke();
   if (q > .95) { TB('y’', xR + 10, y0 + hy * .125 - 4, DRED, 14, 'left'); tag('2U et 2v₀ : y’ = 2/4 · y = y/2', W * .5, H * .93, DRED, 14); } }
  else TB('U → 2U et v₀ → 2v₀ : y devient ?', W * .5, H * .93, GREY, 14);
 }
]);
