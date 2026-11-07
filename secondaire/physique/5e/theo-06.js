/* Physique 5e · chapitre 6 : mouvement circulaire uniforme */
function ph6_circ(cx, cy, r, col, dash) { ctx.strokeStyle = col || '#d6d9dd'; ctx.lineWidth = 1.6; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
function ph6_top(cx, cy, r, a, ang) { /* position sur un cercle (angle anti-horaire écran) */ return {x: cx + r * Math.cos(a), y: cy - r * Math.sin(a)}; }

SFA.theo("c06", {
  icon: function () {
    var cx = W * .27, cy = H * .5, r = H * .34; ph6_circ(cx, cy, r, GREY, [5, 5]);
    var P = ph6_top(cx, cy, r, .9); LN(cx, cy, P.x, P.y, INK, 1.4); DOT(cx, cy, 4, INK); BALL(P.x, P.y, 10);
    A(P.x, P.y, -Math.sin(.9) * 56 * -1, -Math.cos(.9) * 56 * -1 * -1, GREEN, '', 3); A(P.x, P.y, (cx - P.x) * .5, (cy - P.y) * .5, RED, '', 3);
    TB('a = v²/R', W * .72, H * .4, BLUE_D, 30); TB('force centripète', W * .72, H * .6, ORANGE, 17);
  },
  anim: function (t) {
    var L = 400, ph = t % L, cut = ph > 270, cx = W * .3, cy = H * .55, R = Math.min(H * .34, W * .22), om = .035, a0 = 1.2;
    var a = a0 + om * Math.min(ph, 270);
    var P = ph6_top(cx, cy, R, a), vx = -Math.sin(a), vy = -Math.cos(a);   /* tangente anti-horaire en coordonnées écran */
    var tx = -Math.sin(a), ty = -Math.cos(a);
    ph6_circ(cx, cy, R, '#d6d9dd', [5, 5]); DOT(cx, cy, 4, INK);
    var Q = P;
    if (cut) { var d = (ph - 270) * 1.9; Q = {x: P.x + tx * d, y: P.y + ty * d * 1}; Q.y = P.y - (Math.cos(a) * 0) + ty * d - ty * d + ty * d; Q = {x: P.x + (-Math.sin(a)) * d, y: P.y + (-Math.cos(a)) * d}; }
    /* corde */
    if (!cut) LN(cx, cy, P.x, P.y, INK, 1.8); else { LN(cx, cy, P.x, P.y, '#d6d9dd', 1.4, [3, 4]); }
    BALL(Q.x, Q.y, 11);
    A(Q.x, Q.y, -Math.sin(a) * 58, -Math.cos(a) * 58, GREEN, '', 3.4); TB('v', Q.x + -Math.sin(a) * 78, Q.y + -Math.cos(a) * 78, DGREEN, 15);
    if (!cut) { A(P.x, P.y, (cx - P.x) * .42, (cy - P.y) * .42, RED, '', 3.6); TB('F = m·a', P.x + (cx - P.x) * .5 + 14, P.y + (cy - P.y) * .5, DRED, 14, 'left'); }
    TB('Mouvement circulaire uniforme', W * .5, 24, BLUE_D, 15);
    var px = W * .6; TB(cut ? 'corde coupée : plus de force' : 'v constante, direction variable', px, H * .3, cut ? DRED : GREY, 13, 'left');
    TB(cut ? 'l’objet part en ligne droite (inertie)' : 'a = v²/R dirigée vers le centre', px, H * .42, cut ? DRED : DRED, 13, 'left');
    TB('v = ωR   T = 2π/ω   f = 1/T', px, H * .6, INK, 14, 'left'); TB('F = m·v²/R = mω²R', px, H * .72, ORANGE, 15, 'left');
  },
  th: '<div class="tcard"><b class="h">Décrire le mouvement circulaire uniforme (MCU)</b><p>La trajectoire est un cercle de rayon R, parcouru à vitesse de valeur constante. La <b>période</b> T est la durée d’un tour (s), la <b>fréquence</b> f = 1/T (Hz), la <b>vitesse angulaire</b> <b>ω = 2π/T = 2π·f</b> (rad/s). La vitesse linéaire est <b>v = ω·R</b> et vaut aussi 2πR/T. Conversion : 1 tr/min = 2π/60 ≈ 0,105 rad/s ; 45 tr/min donnent f = 0,75 Hz, T ≈ 1,33 s, ω ≈ 4,71 rad/s.</p></div>' +
  '<div class="tcard"><b class="h">Une accélération, même à vitesse constante</b><p>Le vecteur vitesse, tangent au cercle, change de direction : il y a donc une accélération, perpendiculaire à v et <b>dirigée vers le centre</b> : <b>a = v²/R = ω²·R</b>. D’après ΣF = m·a, la résultante vaut <b>F = m·v²/R</b> et pointe vers le centre : c’est la <b>force centripète</b>. Ce n’est pas une force de plus : c’est le rôle que joue la tension, le frottement, la normale, la gravité… Si elle disparaît, l’objet part en ligne droite, tangentiellement.</p></div>' +
  '<div class="tcard"><b class="h">Méthode</b><ol><li>Fais le diagramme des forces vu de l’axe (vue de dessus ou de face).</li><li>Projette sur la direction <i>radiale</i> (vers le centre) : ΣF<sub>radial</sub> = m·v²/R.</li><li>Projette sur la verticale : ΣF = 0 (pas d’accélération verticale).</li><li>Résous. Virage plat : f<sub>max</sub> = μ·m·g = m·v²/R donne v<sub>max</sub> = √(μ·g·R), indépendante de la masse.</li></ol></div>' +
  '<div class="tcard"><b class="h">Virage relevé, pendule conique, Rotor</b><p><b>Virage relevé</b> d’angle θ sans frottement : tan θ = v²/(R·g). <b>Pendule conique</b> : T·cos θ = m·g et T·sin θ = m·v²/R, donc tan θ = v²/(R·g) aussi. <b>Rotor</b> : la normale joue le rôle de force centripète (N = m·ω²·R) et le frottement vertical porte le poids : μ·N ≥ m·g, d’où ω ≥ √(g/(μ·R)).</p></div>' +
  '<div class="tcard"><b class="h">Pièges et exemple chiffré</b><ul><li>La « force centrifuge » n’existe pas dans un référentiel galiléen : le passager qui se sent poussé vers l’extérieur tend à aller tout droit (inertie) pendant que la portière le pousse vers l’intérieur.</li><li>Vitesse constante ne veut pas dire résultante nulle.</li></ul><p><b>Pierre de 0,25 kg, corde 0,80 m, v = 4,0 m/s :</b> a = 16/0,80 = 20 m/s², F = 0,25 × 20 = 5,0 N, T = 2π·0,80/4,0 ≈ 1,26 s.</p></div>'
});

SFA.figs("c06", [
 /* 1 tourne-disque 45 tr/min */
 function (p) {
  var cx = W * .32, cy = H * .5, R = H * .36, a = p > 0 ? tGlob * .05 : .6;
  ctx.fillStyle = '#2f3237'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.strokeStyle = '#555'; ctx.lineWidth = 1; for (var r = R * .45; r < R; r += 6) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); }
  DOT(cx, cy, R * .3, ORANGE); DOT(cx, cy, 3, '#fff'); var P = ph6_top(cx, cy, R * .85, a); DOT(P.x, P.y, 6, '#fff'); LN(cx, cy, P.x, P.y, '#fff', 1.4);
  TB('45 tr/min', W * .75, H * .22, BLUE_D, 18);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; TB('f = 45/60 = 0,75 Hz', W * .62, H * .42, DGREEN, 15, 'left'); TB('T = 1/f ≈ 1,33 s', W * .62, H * .56, DRED, 15, 'left'); TB('ω = 2πf ≈ 4,71 rad/s', W * .62, H * .7, ORANGE, 15, 'left'); ctx.globalAlpha = 1; }
 },
 /* 2 manège : v et a */
 function (p) {
  var cx = W * .34, cy = H * .54, R = H * .34; ph6_circ(cx, cy, R, '#d6d9dd', [5, 5]); DOT(cx, cy, 4, INK); LN(cx, cy, cx + R, cy, GREY, 1.4); TB('R = 6,0 m', cx + R / 2, cy - 8, INK, 13);
  var P = {x: cx + R, y: cy}; pers(P.x + 8, P.y + 20, 36, VIOLET, 0);
  TB('ω = 0,50 rad/s', W * .74, H * .16, BLUE_D, 15);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(P.x, P.y, 0, -62 * q, GREEN, '', 3.6); A(P.x, P.y, -40 * q, 0, RED, '', 3.6);
   if (q > .95) { TB('v = ωR = 3,0 m/s', P.x + 18, P.y - 50, DGREEN, 14, 'left'); TB('a = ω²R = 1,5 m/s²', cx + R * .4, cy + R * .42, DRED, 14, 'left'); TB('vers le centre', cx + R * .4, cy + R * .42 + 18, DRED, 13, 'left'); } }
 },
 /* 3 pierre au bout d'une corde */
 function (p) {
  var cx = W * .36, cy = H * .5, R = H * .34; ph6_circ(cx, cy, R, '#d6d9dd', [5, 5]); DOT(cx, cy, 4, INK);
  var P = ph6_top(cx, cy, R, .0); LN(cx, cy, P.x, P.y, INK, 2); BALL(P.x, P.y, 11); TB('0,25 kg', P.x + 20, P.y + 4, DRED, 13, 'left'); TB('0,80 m', cx + R / 2, cy + 16, INK, 13);
  A(P.x, P.y, 0, -56, GREEN, '', 3.4); TB('4,0 m/s', P.x + 10, P.y - 66, DGREEN, 14, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(P.x, P.y, -R * .6 * q, 0, RED, '', 3.8); if (q > .95) { TB('a = v²/R = 20 m/s²', W * .98, H * .12, DRED, 14, 'right'); TB('F = 5,0 N', W * .98, H * .24, DRED, 14, 'right'); TB('T ≈ 1,26 s', W * .98, H * .36, ORANGE, 14, 'right'); } }
 },
 /* 4 virage plat */
 function (p) {
  var cx = W * .2, cy = H * .5, R = H * .4;
  ctx.strokeStyle = '#bfc4ca'; ctx.lineWidth = 30; ctx.beginPath(); ctx.arc(cx, cy, R, -PI / 2, PI / 2); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.arc(cx, cy, R, -PI / 2, PI / 2); ctx.stroke(); ctx.setLineDash([]);
  DOT(cx, cy, 4, INK); LN(cx, cy, cx + R * Math.cos(.7), cy + R * Math.sin(.7), GREY, 1.3, [4, 4]); TB('R = 50 m', cx + 10, cy - 12, INK, 13, 'left');
  var P = {x: cx + R * Math.cos(.7), y: cy + R * Math.sin(.7)}; ctx.fillStyle = '#e5f2ec'; ctx.strokeStyle = GREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(P.x - 12, P.y - 20, 24, 40, 6); ctx.fill(); ctx.stroke();
  TB('μ = 0,60', W * .62, H * .2, BLUE_D, 15, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(P.x, P.y, -50 * Math.cos(.7) * q, -50 * Math.sin(.7) * q, RED, '', 3.6); if (q > .95) { TB('f = μ·m·g = m·v²/R', W * .62, H * .42, DRED, 14, 'left'); tag('v_max ≈ 17,2 m/s ≈ 62 km/h', W * .72, H * .64, DGREEN, 14); TB('(indépendante de m)', W * .62, H * .8, GREY, 13, 'left'); } }
 },
 /* 5 QCM résultante */
 function (p) {
  var cx = W * .32, cy = H * .52, R = H * .34; ph6_circ(cx, cy, R, '#d6d9dd', [5, 5]); DOT(cx, cy, 4, INK); var P = ph6_top(cx, cy, R, .9);
  BALL(P.x, P.y, 11); A(P.x, P.y, -Math.sin(.9) * 56, -Math.cos(.9) * 56, GREEN, '', 3.4); TB('v', P.x - Math.sin(.9) * 76, P.y - Math.cos(.9) * 76, DGREEN, 15);
  TB('v constante, ΣF = ?', W * .7, H * .2, GREY, 15);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(P.x, P.y, (cx - P.x) * .5 * q, (cy - P.y) * .5 * q, RED, '', 3.8); if (q > .95) { tag('ΣF = m·v²/R', W * .72, H * .5, DRED, 16); TB('dirigée vers le centre', W * .72, H * .66, DRED, 14); } }
 },
 /* 6 Rotor */
 function (p) {
  var cx = W * .38, cy = H * .5, R = H * .4; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - R, H * .08); ctx.lineTo(cx - R, H * .92); ctx.moveTo(cx + R, H * .08); ctx.lineTo(cx + R, H * .92); ctx.stroke();
  LN(cx, H * .06, cx, H * .94, '#c8ccd0', 1.2, [6, 5]); TB('axe', cx + 14, H * .1, GREY, 11, 'left'); TB('R = 4,0 m', cx - R / 2, H * .96, INK, 12);
  pers(cx + R - 20, cy + 34, 62, VIOLET, 0);
  TB('μ = 0,40', W * .7, H * .14, GREY, 14, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6), px = cx + R - 8; A(px, cy, -62 * q, 0, RED, '', 3.4); A(px, cy, 0, -46 * q, GREEN, '', 3.4); A(px, cy, 0, 46 * q, ORANGE, '', 3.4);
   if (q > .95) { TB('N = m·ω²R', cx + R - 70, cy - 12, DRED, 13, 'right'); TB('f = P', px - 8, cy - 52, DGREEN, 13, 'right'); TB('P', px + 10, cy + 50, ORANGE, 13, 'left'); TB('ω ≥ √(g/μR)', W * .7, H * .36, DGREEN, 13, 'left'); TB('= 23,6 tr/min', W * .7, H * .46, DGREEN, 13, 'left'); TB('à 30 tr/min :', W * .7, H * .62, ORANGE, 13, 'left'); TB('a ≈ 4,0 g', W * .7, H * .72, ORANGE, 13, 'left'); } }
 },
 /* 7 virage relevé */
 function (p) {
  var th = 15 * D2R, gx = W * .12, gy = H * .84, Lx = W * .72, ys = gy - Lx * Math.tan(th);
  var g = ph_incl(th, gx, gy, Lx, .5, 46), C = g.C, u = g.u, n = g.n; TB('15°', gx + 70, gy - 6, GREY, 13);
  var kP = H * .3; A(C.x, C.y, 0, kP * .6, DRED, '', 3); TB('P', C.x + 10, C.y + kP * .6 + 14, DRED, 13, 'left');
  A(C.x, C.y, n.x * kP * .62, n.y * kP * .62, VIOLET, '', 3); TB('N', C.x + n.x * kP * .62 - 14, C.y + n.y * kP * .62, VIO_D, 13, 'right');
  TB('centre du virage', W * .04, H * .2, GREY, 12, 'left'); A(W * .3, H * .27, -60, 0, GREY, '', 2);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(C.x, C.y, -90 * q, 0, RED, '', 3.6); if (q > .95) { tag('tan θ = v²/(R·g)', W * .72, H * .14, DRED, 14); tag('v idéale ≈ 16,2 m/s (58 km/h)', W * .7, H * .27, DGREEN, 13); tag('v max (μ = 0,50) ≈ 29,5 m/s', W * .7, H * .4, ORANGE, 13); } }
 },
 /* 8 QCM poussé vers l'extérieur */
 function (p) {
  var cx = W * .2, cy = H * .46, R = H * .36;
  ctx.strokeStyle = '#bfc4ca'; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(cx, cy, R, -PI / 2, PI / 2); ctx.stroke();
  var a = .5, P = {x: cx + R * Math.cos(a), y: cy + R * Math.sin(a)}; ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(a + PI / 2); ctx.fillStyle = '#e5f2ec'; ctx.strokeStyle = GREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(-13, -22, 26, 44, 6); ctx.fill(); ctx.stroke(); DOT(0, 0, 6, VIOLET); ctx.restore();
  var tx = -Math.sin(a), ty = Math.cos(a); A(P.x, P.y, tx * 64, ty * 64, GREEN, '', 3.2); TB('il tend à aller tout droit', P.x + tx * 70 + 8, P.y + ty * 70 + 12, DGREEN, 13, 'left');
  TB('virage serré', W * .66, H * .12, GREY, 14);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(P.x + 14 * Math.cos(a), P.y + 14 * Math.sin(a), -48 * Math.cos(a) * q, -48 * Math.sin(a) * q, RED, '', 3.8); if (q > .95) { tag('la portière pousse vers l’intérieur', W * .66, H * .42, DRED, 13); tag('pas de force centrifuge réelle', W * .66, H * .56, INK, 13); } }
 },
 /* 9 pendule conique */
 function (p) {
  var px = W * .4, py = H * .12, L = H * .62, th = 30 * D2R, bx = px + L * Math.sin(th), by = py + L * Math.cos(th);
  LN(px - 50, py, px + 50, py, INK, 3); LN(px, py, px, H * .94, '#c8ccd0', 1.3, [6, 5]); LN(px, py, bx, by, INK, 2); arcA({x: px, y: py}, 50, PI / 2, PI / 2 - th, '', GREY); TB('30°', px + 24, py + 78, GREY, 12);
  ctx.strokeStyle = '#d6d9dd'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.ellipse(px, by, bx - px, 14, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]); BALL(bx, by, 11);
  TB('0,20 kg ; fil 1,00 m', W * .8, H * .12, GREY, 13);
  A(bx, by, 0, 52, RED, '', 3); TB('P', bx + 10, by + 62, DRED, 13, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(bx, by, (px - bx) / L * 90 * q, (py - by) / L * 90 * q, VIOLET, '', 3.4); A(bx, by, -66 * q, 0, ORANGE, '', 3);
   if (q > .95) { TB('R = 0,50 m', W * .8, H * .26, INK, 13); TB('T ≈ 2,27 N', W * .8, H * .38, VIO_D, 14); TB('v ≈ 1,68 m/s', W * .8, H * .5, DGREEN, 14); TB('période ≈ 1,87 s', W * .8, H * .62, DRED, 14); } }
 },
 /* 10 deux pièces sur un disque */
 function (p) {
  var cx = W * .5, cy = H * .5, R = H * .4; ctx.fillStyle = '#e4e8ed'; ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.stroke(); DOT(cx, cy, 3, INK);
  var r1 = R * .42, r2 = R * .84; LN(cx, cy, cx + r2, cy, GREY, 1.2, [4, 4]);
  DOT(cx + r1, cy, 9, '#d9b64a'); DOT(cx + r2, cy, 9, '#d9b64a'); TB('5 cm', cx + r1, cy + 26, INK, 12); TB('10 cm', cx + r2, cy + 26, INK, 12);
  TB('μ_s = 0,30', W * .12, H * .1, GREY, 13);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; A(cx + r2, cy, 0, -46, RED, '', 3.2); tag('glisse en premier : ≈ 52 tr/min', W * .5, H * .1, DRED, 13); tag('ω = √(μ·g/r)', W * .18, H * .9, INK, 13); tag('5 cm : ≈ 73 tr/min', W * .5, H * .92, GREY, 13); ctx.globalAlpha = 1; }
 }
]);
