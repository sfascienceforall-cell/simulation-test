/* Physique 5e · chapitre 4 : troisième loi de Newton et quantité de mouvement */
function ph4_cart(x, gy, w, col, lab) { ph_box(x, gy - 17, w, 26, col, lab); DOT(x - w * .3, gy - 2, 5, '#555'); DOT(x + w * .3, gy - 2, 5, '#555'); }
function ph4_bars(x, y, labs, vals, cols, sc) { /* petits histogrammes horizontaux */ for (var i = 0; i < labs.length; i++) { TB(labs[i], x, y + i * 24 + 12, GREY, 12, 'left'); ctx.fillStyle = cols[i]; ctx.fillRect(x + 62, y + i * 24, vals[i] * sc, 16); } }

SFA.theo("c04", {
  icon: function () {
    TB('p = m·v', W * .5, H * .42, BLUE_D, 38); TB('Σp avant = Σp après', W * .5, H * .64, ORANGE, 19);
    ph4_cart(W * .2, H * .86, 34, BLUE, ''); ph4_cart(W * .34, H * .86, 34, ORANGE, ''); A(W * .27, H * .78, 0, 0, RED);
  },
  anim: function (t) {
    var Tc = 280, ph = Math.floor(t / Tc) % 2, el = ph === 0, tt = (t % Tc) / 60, gy = H * .5;
    var k = W * .66 / 19, x0 = W * .05, w = 44, d0 = 6;
    var u1 = el ? 1 : 2, u2 = el ? 4 : 2, tc = (d0 - w / k) / 3;
    var x1, x2;
    if (tt < tc) { x1 = x0 + 3 * tt * k; x2 = x0 + d0 * k; } else { x1 = x0 + 3 * tc * k + u1 * (tt - tc) * k; x2 = x0 + d0 * k + u2 * (tt - tc) * k; }
    ph_ground(gy + 16, 0, W * .74);
    ph4_cart(x1, gy, w, BLUE, '2 kg'); ph4_cart(x2, gy, w - 8, ORANGE, '1 kg');
    var before = tt < tc, v1 = before ? 3 : u1, v2 = before ? 0 : u2;
    A(x1 + w / 2 + 2, gy - 17, v1 * 14, 0, BLUE, '', 3); if (v2 > 0) A(x2 + w / 2 - 2, gy - 17, v2 * 14, 0, ORANGE, '', 3);
    var p = 2 * v1 + 1 * v2, Ec = .5 * 2 * v1 * v1 + .5 * v2 * v2;
    TB(el ? 'Choc élastique' : 'Choc mou (les chariots s’accrochent)', W * .5, 24, BLUE_D, 15);
    TB(before ? 'avant le choc' : 'après le choc', W * .5, H * .22, GREY, 13);
    var bx = W * .78; TB('p total', bx, H * .3, GREY, 12, 'left'); ctx.fillStyle = '#e6f1fb'; ctx.fillRect(bx, H * .34, W * .18, 12); ctx.fillStyle = BLUE; ctx.fillRect(bx, H * .34, p / 6 * W * .18, 12);
    TB(String(p).replace('.', ',') + ' kg·m/s', bx, H * .34 + 28, BLUE_D, 12, 'left');
    TB('Ec totale', bx, H * .58, GREY, 12, 'left'); ctx.fillStyle = '#fbeee3'; ctx.fillRect(bx, H * .62, W * .18, 12); ctx.fillStyle = Ec < 8.9 ? RED : ORANGE; ctx.fillRect(bx, H * .62, Ec / 9 * W * .18, 12);
    TB(Ec.toFixed(0) + ' J', bx, H * .62 + 28, Ec < 8.9 ? DRED : ORANGE, 12, 'left');
    TB('p se conserve toujours ; Ec seulement si le choc est élastique', W * .5, H * .93, INK, 12);
  },
  th: '<div class="tcard"><b class="h">Troisième loi : action et réaction</b><p>Si le corps A exerce une force F<sub>A→B</sub> sur B, alors B exerce sur A une force <b>F<sub>B→A</sub> = −F<sub>A→B</sub></b> : même norme, même direction, sens opposé. Ces deux forces <b>s’appliquent à deux corps différents</b> : elles ne s’annulent donc jamais. Un camion de 10 t et une voiture de 1 t subissent la même force de 20 kN, mais les accélérations diffèrent (2 et 20 m/s²) car les masses diffèrent.</p></div>' +
  '<div class="tcard"><b class="h">Quantité de mouvement et impulsion</b><p>La <b>quantité de mouvement</b> est le vecteur <b>p = m·v</b> (kg·m/s). La deuxième loi s’écrit ΣF = Δp/Δt. L’<b>impulsion</b> d’une force est J = F·Δt = Δp (en N·s = kg·m/s) ; si F varie, c’est l’aire sous la courbe F(t). Un coup de pied de 400 N pendant 0,020 s donne J = 8,0 N·s : un ballon de 0,45 kg part à v = 8,0/0,45 ≈ 17,8 m/s.</p><p>Même impulsion, durée plus longue : force plus faible. C’est le rôle de l’airbag (100 ms au lieu de 8 ms : 10,5 kN au lieu de 131 kN).</p></div>' +
  '<div class="tcard"><b class="h">Conservation de la quantité de mouvement</b><p>Dans un <b>système isolé</b> (forces extérieures nulles ou négligeables pendant le choc), <b>Σp avant = Σp après</b>, en tenant compte du sens (signes). Deux patineurs immobiles qui se repoussent : 0 = m<sub>A</sub>v<sub>A</sub> + m<sub>B</sub>v<sub>B</sub>, donc les vitesses sont opposées et inversement proportionnelles aux masses (recul d’un fusil).</p></div>' +
  '<div class="tcard"><b class="h">Types de chocs</b><ul><li><b>Choc élastique</b> : p et E<sub>c</sub> se conservent. Pour m<sub>2</sub> au repos : u<sub>1</sub> = (m<sub>1</sub> − m<sub>2</sub>)v<sub>1</sub>/(m<sub>1</sub> + m<sub>2</sub>), u<sub>2</sub> = 2m<sub>1</sub>v<sub>1</sub>/(m<sub>1</sub> + m<sub>2</sub>).</li><li><b>Choc mou</b> (objets collés) : p se conserve, v commune u = Σp/Σm, E<sub>c</sub> diminue (chaleur, déformation).</li><li>L’énergie <i>totale</i> se conserve toujours, la quantité de mouvement aussi : seule E<sub>c</sub> peut diminuer.</li></ul></div>' +
  '<div class="tcard"><b class="h">Exemple chiffré</b><p>Chariot de 2 kg à 3 m/s contre 1 kg immobile, choc mou : u = 6/3 = 2 m/s ; E<sub>c</sub> passe de 9 J à ½·3·2² = 6 J : 3 J perdus. Choc élastique : u<sub>1</sub> = 1 m/s, u<sub>2</sub> = 4 m/s (vérifie : 2·1 + 1·4 = 6 ✓ ; 1 + 8 = 9 J ✓).</p></div>'
});

SFA.figs("c04", [
 /* 1 ballon 0,45 kg à 20 m/s */
 function (p) {
  var cy = H * .55; ph_ground(cy + 36, 0, W);
  BALL(W * .26, cy, 24); TB('0,45 kg', W * .26, cy + 4, DRED, 12);
  A(W * .26 + 30, cy, 120, 0, GREEN, '', 4); TB('v = 20 m/s', W * .26 + 90, cy - 18, DGREEN, 15);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(W * .26, cy - 46, 180 * q, 0, ORANGE, '', 5); if (q > .95) { TB('p = m·v = 0,45 × 20', W * .5, H * .16, DRED, 14); TB('p = 9,0 kg·m/s', W * .5, H * .86, ORANGE, 20); } }
 },
 /* 2 coup de pied : F(t) */
 function (p) {
  var gx = W * .1, gb = H * .8, gw = W * .46, gh = H * .6;
  LN(gx, gb, gx + gw + 8, gb, AX, 1.5); LN(gx, gb + 4, gx, gb - gh - 10, AX, 1.5); TB('t (ms)', gx + gw + 8, gb + 16, GREY, 11, 'right'); TB('F (N)', gx + 4, gb - gh - 14, GREY, 11, 'left');
  var xe = gx + gw * .5, yF = gb - gh * .8; ph_dash(gx, yF, xe, yF); TB('400', gx - 4, yF + 4, INK, 11, 'right'); TB('20', xe, gb + 14, INK, 11);
  ctx.strokeStyle = BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(gx, gb); ctx.lineTo(gx, yF); ctx.lineTo(xe, yF); ctx.lineTo(xe, gb); ctx.stroke();
  ctx.fillStyle = 'rgba(55,138,221,.15)'; ctx.fillRect(gx, yF, (xe - gx) * ph_ease(p, 0, .6), gb - yF);
  var bx = W * .74, by = H * .56; BALL(bx, by, 22); TB('0,45 kg', bx, by + 4, DRED, 11); A(bx - 70, by, 40, 0, RED, '', 4); TB('pied', bx - 62, by - 18, DRED, 13);
  if (p > 0) { var q = ph_ease(p, .3, .9); ctx.globalAlpha = q; TB('aire = J', (gx + xe) / 2, (gb + yF) / 2 + 4, BLUE_D, 15); tag('J = 400 × 0,020 = 8,0 N·s', W * .66, H * .14, DRED, 13); A(bx + 24, by, 50 * q, 0, GREEN, '', 3.6); TB('v ≈ 17,8 m/s', bx + 20, by + 44, DGREEN, 13, 'left'); ctx.globalAlpha = 1; }
 },
 /* 3 camion contre voiture */
 function (p) {
  var gy = H * .66; ph_ground(gy + 12, 0, W);
  ctx.fillStyle = '#e8edf3'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(W * .06, gy - 52, 150, 52, 6); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(W * .06 + 150, gy - 36, 36, 36, 6); ctx.fill(); ctx.stroke();
  DOT(W * .06 + 30, gy + 4, 9, '#555'); DOT(W * .06 + 150, gy + 4, 9, '#555'); DOT(W * .06 + 170, gy + 4, 9, '#555'); TB('camion 10 t', W * .06 + 75, gy - 22, BLUE_D, 13);
  var cx = W * .06 + 232; ctx.fillStyle = '#e5f2ec'; ctx.strokeStyle = GREEN; ctx.beginPath(); ctx.roundRect(cx, gy - 28, 74, 28, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(cx + 16, gy - 42, 36, 16, 5); ctx.fill(); ctx.stroke(); DOT(cx + 16, gy + 4, 8, '#555'); DOT(cx + 58, gy + 4, 8, '#555');
  TB('voiture 1 t', cx + 37, gy - 50, DGREEN, 13);
  A(cx - 4, gy - 60 + 70 - 70, 0, 0, RED);
  var q = ph_ease(p, 0, .6); A(W * .06 + 186, gy - 18, 56, 0, RED, '', 4);
  if (p > 0) { A(cx, gy - 14, -56 * q, 0, VIOLET, '', 4); if (q > .95) { tag('F = 20 kN des deux côtés', W * .5, H * .12, DRED, 14); tag('a = 2 m/s²', W * .06 + 90, H * .88, DGREEN, 14); tag('a = 20 m/s²', cx + 40, H * .88, DGREEN, 14); } }
  else { TB('F = 20 kN', W * .06 + 210, gy - 60, DRED, 13); }
 },
 /* 4 choc mou */
 function (p) {
  var g1 = H * .36, g2 = H * .8;
  ph_ground(g1 + 12, W * .04, W * .96); ph_ground(g2 + 12, W * .04, W * .96);
  ph4_cart(W * .2, g1, 52, BLUE, '2 kg'); ph4_cart(W * .6, g1, 44, ORANGE, '1 kg'); A(W * .2 + 28, g1 - 17, 54, 0, BLUE, '', 3.2); TB('3 m/s', W * .2 + 70, g1 - 40, BLUE_D, 13); TB('avant', W * .05, g1 - 40, GREY, 12, 'left');
  TB('après', W * .05, g2 - 40, GREY, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; ph4_cart(W * .45, g2, 52, BLUE, '2 kg'); ph4_cart(W * .45 + 48, g2, 44, ORANGE, '1 kg'); A(W * .45 + 72, g2 - 17, 36, 0, GREEN, '', 3.2); TB('2 m/s', W * .45 + 118, g2 - 36, DGREEN, 13);
   tag('p = 6 kg·m/s conservée', W * .76, g1 + 40, DGREEN, 13); tag('Ec : 9 J → 6 J (3 J perdus)', W * .72, g2 + 44 - 20, DRED, 13); ctx.globalAlpha = 1; }
 },
 /* 5 patineurs */
 function (p) {
  var gy = H * .66; ph_ground(gy + 8, W * .04, W * .96);
  pers(W * .4, gy, 66, BLUE, 1, '', 'center'); pers(W * .6, gy, 72, ORANGE, -1, '', 'center');
  TB('A 50 kg', W * .4, gy + 28, BLUE_D, 13); TB('B 80 kg', W * .6, gy + 28, DRED, 13);
  if (p === 0) TB('immobiles, ils se repoussent', W * .5, H * .16, GREY, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(W * .36, gy - 36, -90 * q, 0, BLUE, '', 4); A(W * .64, gy - 36, 56 * q, 0, ORANGE, '', 4);
   if (q > .95) { TB('1,6 m/s', W * .16, gy - 56, BLUE_D, 14); TB('? = 1,0 m/s', W * .84, gy - 56, DRED, 14); tag('50 × 1,6 = 80 × v_B', W * .5, H * .12, INK, 14); tag('p total = 0 avant et après', W * .5, H * .9, DGREEN, 14); } }
 },
 /* 6 recul du fusil */
 function (p) {
  var cy = H * .46, gx = W * .52;
  ctx.fillStyle = '#7f8790'; ctx.beginPath(); ctx.roundRect(gx - 90, cy - 9, 150, 16, 4); ctx.fill(); ctx.fillStyle = '#9a7b3c'; ctx.beginPath(); ctx.roundRect(gx - 120, cy - 4, 60, 26, 6); ctx.fill();
  TB('fusil 4,0 kg', gx - 30, cy - 18, INK, 13);
  var bx = gx + 76 + (p > 0 ? 40 * ph_ease(p, 0, .5) : 0); DOT(bx, cy - 1, 6, ORA2); TB('balle 8,0 g', bx, cy + 24, DRED, 12);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(bx + 12, cy - 1, 50 * q, 0, ORANGE, '', 3.6); A(gx - 120, cy + 10, -22 * q, 0, BLUE, '', 3.6);
   if (q > .95) { TB('700 m/s', bx + 36, cy - 18, DRED, 13); TB('V = 1,4 m/s', gx - 130, cy + 40, BLUE_D, 13, 'right'); }
   var y2 = H * .72, sc = W * .5 / 1960; TB('Ec balle', W * .06, y2 + 12, DRED, 13, 'left'); ctx.fillStyle = ORA2; ctx.fillRect(W * .26, y2, 1960 * sc * q, 16); TB('1 960 J', W * .26 + 1960 * sc * q + 8, y2 + 13, DRED, 13, 'left');
   TB('Ec fusil', W * .06, y2 + 42, BLUE_D, 13, 'left'); ctx.fillStyle = BLUE; ctx.fillRect(W * .26, y2 + 30, Math.max(2, 3.9 * sc * q), 16); TB('3,9 J', W * .26 + 14, y2 + 43, BLUE_D, 13, 'left'); }
  else TB('p total = 0 avant le tir', W * .5, H * .86, GREY, 14);
 },
 /* 7 choc élastique de front */
 function (p) {
  var g1 = H * .36, g2 = H * .8; ph_ground(g1 + 12, W * .04, W * .96); ph_ground(g2 + 12, W * .04, W * .96);
  ph4_cart(W * .2, g1, 52, BLUE, '2 kg'); ph4_cart(W * .6, g1, 44, ORANGE, '1 kg'); A(W * .2 + 28, g1 - 17, 54, 0, BLUE, '', 3.2); TB('3 m/s', W * .2 + 70, g1 - 40, BLUE_D, 13); TB('avant', W * .05, g1 - 40, GREY, 12, 'left'); TB('après', W * .05, g2 - 40, GREY, 12, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; ph4_cart(W * .45, g2, 52, BLUE, '2 kg'); ph4_cart(W * .68, g2, 44, ORANGE, '1 kg'); A(W * .45 + 28, g2 - 17, 18, 0, BLUE, '', 3.2); A(W * .68 + 24, g2 - 17, 72, 0, ORANGE, '', 3.2);
   TB('1 m/s', W * .45 + 20, g2 - 40, BLUE_D, 13, 'left'); TB('4 m/s', W * .68 + 70, g2 - 38, DRED, 13); tag('p : 6 → 2 + 4 = 6 ✓   Ec : 9 → 1 + 8 = 9 J ✓', W * .5, H * .54, DGREEN, 13); ctx.globalAlpha = 1; }
 },
 /* 8 airbag : mêmes aires */
 function (p) {
  var gx = W * .1, gb = H * .82, gw = W * .84, gh = H * .62;
  LN(gx, gb, gx + gw + 8, gb, AX, 1.5); LN(gx, gb + 4, gx, gb - gh - 12, AX, 1.5); TB('t (ms)', gx + gw + 6, gb + 16, GREY, 11, 'right'); TB('F (kN)', gx + 6, gb - gh - 16, GREY, 11, 'left');
  var X = function (ms) { return gx + ms / 100 * gw; }, Y = function (kN) { return gb - kN / 131 * gh; };
  ctx.fillStyle = 'rgba(226,75,74,.2)'; ctx.fillRect(gx, Y(131), X(8) - gx, gb - Y(131)); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.strokeRect(gx, Y(131), X(8) - gx, gb - Y(131));
  TB('volant rigide', X(8) + 10, Y(131) + 16, DRED, 13, 'left'); TB('131 kN pendant 8 ms', X(8) + 10, Y(131) + 34, DRED, 13, 'left'); TB('8 ms', X(8), gb + 14, DRED, 11);
  if (p > 0) { var q = ph_ease(p, 0, .7); ctx.globalAlpha = q; ctx.fillStyle = 'rgba(29,158,117,.2)'; ctx.fillRect(gx, Y(10.5), X(100) - gx, gb - Y(10.5)); ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.strokeRect(gx, Y(10.5), X(100) - gx, gb - Y(10.5)); TB('airbag : 10,5 kN pendant 100 ms', X(55), Y(10.5) - 14, DGREEN, 13); TB('100 ms', X(100), gb + 28, DGREEN, 11, 'right');
   tag('même aire : J = 70 × 15 = 1 050 N·s', W * .6, H * .44, INK, 14); tag('191 g (rigide) contre 15 g (airbag)', W * .6, H * .58, DRED, 13); ctx.globalAlpha = 1; }
  else { TB('même arrêt (70 kg, 15 m/s), deux durées', W * .6, H * .36, GREY, 14); }
 },
 /* 9 QCM quelle grandeur n'est pas conservée */
 function (p) {
  var gy = H * .3; ph_ground(gy + 12, W * .04, W * .96);
  ph4_cart(W * .2, gy, 46, BLUE, ''); ph4_cart(W * .34, gy, 40, ORANGE, ''); A(W * .2 + 24, gy - 17, 36, 0, BLUE, '', 3); TB('avant', W * .06, gy - 30, GREY, 12, 'left');
  ph4_cart(W * .66, gy, 46, BLUE, ''); ph4_cart(W * .66 + 44, gy, 40, ORANGE, ''); A(W * .66 + 66, gy - 17, 24, 0, GREEN, '', 3); TB('collés', W * .72, gy - 38, GREY, 12, 'left');
  var y0 = H * .52, sc = W * .033, x0 = W * .3;
  TB('p totale', W * .06, y0 + 13, INK, 13, 'left'); ctx.fillStyle = BLUE; ctx.fillRect(x0, y0, 6 * sc * 2.2, 16); ctx.fillStyle = 'rgba(55,138,221,.45)'; ctx.fillRect(x0, y0 + 20, 6 * sc * 2.2, 16);
  TB('Ec totale', W * .06, y0 + 69, INK, 13, 'left'); ctx.fillStyle = ORANGE; ctx.fillRect(x0, y0 + 56, 9 * sc * 1.46, 16);
  TB('avant', x0 + 6 * sc * 2.2 + 8, y0 + 13, GREY, 11, 'left'); TB('après', x0 + 6 * sc * 2.2 + 8, y0 + 33, GREY, 11, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.fillStyle = RED; ctx.fillRect(x0, y0 + 76, 6 * sc * 1.46 * q, 16); TB('9 J → 6 J', x0 + 9 * sc * 1.46 + 8, y0 + 68, DRED, 12, 'left'); tag('Ec diminue : c’est elle qui n’est pas conservée', W * .5, H * .94, DRED, 13); }
  else TB('exemple : chariots de 2 kg et 1 kg, 3 m/s', W * .5, H * .94, GREY, 12);
 },
 /* 10 pendule balistique */
 function (p) {
  var px = W * .5, py = H * .1, L = H * .5, hgt = .15 * H * .9 * 0 + H * .13; LN(px - 90, py, px + 90, py, INK, 3);
  var th = p > 0 ? Math.acos(1 - hgt / L) * ph_ease(p, 0, .5) : 0, bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
  LN(px - 40, py, bx - 40, by, INK, 1.6); LN(px + 40, py, bx + 40, by, INK, 1.6);
  ctx.fillStyle = '#e8d9bd'; ctx.strokeStyle = '#9a7b3c'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(bx - 40, by, 80, 40, 5); ctx.fill(); ctx.stroke(); TB('2,0 kg', bx, by + 26, INK, 13);
  if (p === 0) { DOT(px - 120, by + 20, 5, ORA2); A(px - 110, by + 20, 50, 0, ORANGE, '', 3.4); TB('balle 10 g', px - 130, by + 44, DRED, 12, 'right'); TB('v = ?', px - 140, by + 4, DRED, 14, 'right'); }
  if (p > 0) { var q = ph_ease(p, .4, 1); ctx.globalAlpha = q; var yb = py + L + 20; ph_dash(px - 70, yb + 20, bx + 100, yb + 20); ph_dash(bx + 50, by, bx + 100, by); LN(bx + 90, by, bx + 90, py + L + 0, GREY, 1.4); TB('15 cm', bx + 98, (by + py + L) / 2 + 20, ORANGE, 13, 'left');
   tag('bloc + balle : 1,72 m/s', W * .22, H * .22, DGREEN, 13); tag('balle : v ≈ 345 m/s', W * .22, H * .36, DRED, 14); tag('99,5 % de l’Ec perdue', W * .22, H * .5, INK, 13); ctx.globalAlpha = 1; }
 },
 /* 11 vitesse maximale du chariot léger */
 function (p) {
  var x0 = W * .08, x1 = W * .92, y = H * .62, X = function (v) { return x0 + v / 12 * (x1 - x0); };
  ph4_cart(W * .16, H * .26, 52, BLUE, '3 kg'); ph4_cart(W * .5, H * .26, 36, ORANGE, '1 kg'); A(W * .16 + 28, H * .26 - 17, 46, 0, BLUE, '', 3); TB('4 m/s', W * .16 + 68, H * .26 - 40, BLUE_D, 13);
  LN(x0, y, x1, y, GREY, 2); [0, 3, 6, 12].forEach(function (v) { LN(X(v), y - 5, X(v), y + 5, GREY, 1.5); TB(v + ' m/s', X(v), y + 24, INK, 13); });
  TB('vitesse du chariot de 1 kg', W * .5, y - 40, GREY, 13);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.fillStyle = 'rgba(29,158,117,.3)'; ctx.fillRect(X(3), y - 12, (X(6) - X(3)) * q, 24); if (q > .9) { TB('mou', X(3), y - 18, DGREEN, 13); TB('élastique', X(6), y - 18, DGREEN, 13); TB('maximum : 6 m/s', X(6), y + 52, DRED, 15); LN(X(12) - 10, y - 10, X(12) + 10, y + 10, RED, 3); LN(X(12) - 10, y + 10, X(12) + 10, y - 10, RED, 3); } }
 }
]);
