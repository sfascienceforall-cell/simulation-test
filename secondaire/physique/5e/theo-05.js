/* Physique 5e · chapitre 5 : frottements, plan incliné et projectiles */
/* trajectoire sans air : départ (x0,y0) en px, k px/m, v0 (m/s), angle (deg), hauteur initiale incluse dans y0 ; dessine jusqu'à la fraction f du vol */
function ph5_flight(v0, a, h0) { var vy = v0 * Math.sin(a * D2R); return (vy + Math.sqrt(vy * vy + 2 * 9.81 * h0)) / 9.81; }
function ph5_traj(x0, y0, k, v0, a, h0, col, lw, dash, f) {
  var T = ph5_flight(v0, a, h0), vx = v0 * Math.cos(a * D2R), vy = v0 * Math.sin(a * D2R); f = f == null ? 1 : f;
  ctx.strokeStyle = col; ctx.lineWidth = lw || 2.4; if (dash) ctx.setLineDash(dash); ctx.beginPath();
  for (var i = 0; i <= 60; i++) { var t = T * f * i / 60, x = x0 + vx * t * k, y = y0 - (vy * t - 4.905 * t * t) * k; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.setLineDash([]);
  var te = T * f; return {x: x0 + vx * te * k, y: y0 - (vy * te - 4.905 * te * te) * k, T: T};
}

SFA.theo("c05", {
  icon: function () {
    var gy = H * .84; ph_ground(gy, W * .04, W * .96);
    ph5_traj(W * .1, gy, W * .0185, 22, 55, 0, BLUE, 3.4); ph5_traj(W * .1, gy, W * .0185, 22, 35, 0, ORANGE, 3, [6, 5]);
    TB('f = μ·N', W * .74, H * .3, BLUE_D, 26); TB('projectiles', W * .74, H * .47, ORANGE, 17);
  },
  anim: function (t) {
    var L = 250, loop = Math.floor(t / L) % 3, fr = Math.min(1, (t % L) / (L * .72)), angs = [25, 45, 65], a = angs[loop], v0 = 20;
    var x0 = W * .06, gy = H * .84, k = (W * .62) / 42; ph_ground(gy, 0, W * .72);
    angs.forEach(function (aa) { ph5_traj(x0, gy, k, v0, aa, 0, aa === a ? 'rgba(0,0,0,0)' : '#d6d9dd', 1.6, [4, 4]); });
    var tr = ph5_traj(x0, gy, k, v0, a, 0, a === 45 ? ORANGE : BLUE, 2.6, null, fr);
    BALL(tr.x, tr.y, 8);
    var R = v0 * v0 * Math.sin(2 * a * D2R) / 9.81, Hm = Math.pow(v0 * Math.sin(a * D2R), 2) / 19.62, T = tr.T;
    TB('v₀ = 20 m/s ; sans frottement de l’air', W * .5, 24, BLUE_D, 14);
    var px = W * .74; TB('angle : ' + a + '°', px, H * .3, a === 45 ? ORANGE : BLUE_D, 18, 'left');
    TB('portée R = ' + R.toFixed(1).replace('.', ',') + ' m', px, H * .44, INK, 13, 'left'); TB('flèche H = ' + Hm.toFixed(1).replace('.', ',') + ' m', px, H * .54, INK, 13, 'left'); TB('durée T = ' + T.toFixed(2).replace('.', ',') + ' s', px, H * .64, INK, 13, 'left');
    TB('25° et 65° : même portée', px, H * .78, GREY, 12, 'left'); TB('45° : portée maximale', px, H * .87, GREY, 12, 'left');
    LN(x0 + R * k, gy - 6, x0 + R * k, gy + 6, RED, 2);
  },
  th: '<div class="tcard"><b class="h">Frottement solide</b><p>Un solide posé sur une surface subit une <b>réaction normale N</b> (perpendiculaire) et une force de <b>frottement f</b> (parallèle, opposée au glissement). <b>Statique</b> (pas de glissement) : f ≤ μ<sub>s</sub>·N, avec f égale à la force qui tend à faire glisser, jusqu’au seuil. <b>Dynamique</b> (glissement) : <b>f = μ<sub>c</sub>·N</b>, avec μ<sub>c</sub> &lt; μ<sub>s</sub>. Le coefficient ne dépend pas de l’aire de contact. Sur sol horizontal : N = m·g (sauf force verticale supplémentaire).</p></div>' +
  '<div class="tcard"><b class="h">Plan incliné</b><p>Axes parallèle et perpendiculaire au plan (angle α) : N = m·g·cos α ; composante motrice m·g·sin α. Glissement vers le bas : <b>a = g·(sin α − μ<sub>c</sub>·cos α)</b>. Un objet commence à glisser quand tan α = μ<sub>s</sub> (angle limite : α = 20° donne μ<sub>s</sub> = tan 20° ≈ 0,36). Pour pousser vers le haut : F = m·g·sin α + μ·N.</p></div>' +
  '<div class="tcard"><b class="h">Projectile sans frottement</b><p>Deux mouvements indépendants : <b>horizontal uniforme</b> (v<sub>x</sub> = v<sub>0</sub>·cos α) et <b>vertical uniformément accéléré</b> (a = −g). Pour un tir depuis le sol : durée T = 2·v<sub>0</sub>·sin α/g ; flèche H = (v<sub>0</sub>·sin α)²/(2g) ; portée R = v<sub>0</sub>²·sin 2α/g, maximale à 45°. Les angles α et 90° − α donnent la même portée. La trajectoire est une parabole.</p></div>' +
  '<div class="tcard"><b class="h">Depuis une hauteur et résistance de l’air</b><p>Depuis une falaise de hauteur h, on résout y = h + v<sub>0y</sub>·t − ½g·t² = 0 pour la durée, puis x = v<sub>x</sub>·t. La vitesse d’arrivée : v = √(v<sub>x</sub>² + v<sub>y</sub>²), angle arctan(|v<sub>y</sub>|/v<sub>x</sub>). Avec l’air, la traînée freine v<sub>x</sub> aussi : la balle monte moins haut, avance moins, la descente est plus raide que la montée et l’angle de portée maximale passe sous 45°.</p></div>' +
  '<div class="tcard"><b class="h">Exemple chiffré</b><p>Ballon à 20 m/s, 30° : v<sub>y</sub> = 10 m/s, T = 2·10/9,81 ≈ 2,04 s, H = 100/19,62 ≈ 5,10 m, R = 400·sin 60°/9,81 ≈ 35,3 m. Bloc de 5,0 kg à 30°, μ<sub>c</sub> = 0,20 : N = 42,5 N, f = 8,5 N, a = 9,81·(0,5 − 0,2·0,866) ≈ 3,2 m/s².</p></div>'
});

SFA.figs("c05", [
 /* 1 caisse 50 kg qui glisse */
 function (p) {
  var gy = H * .62, cx = W * .46; ph_box(cx, gy - 30, 90, 60, BLUE, '');
  A(cx, gy - 30, 0, -70, VIOLET, '', 3.4); TB('N', cx + 12, gy - 90, VIO_D, 14, 'left'); A(cx, gy - 30, 0, 72, ORANGE, '', 3.4); TB('P', cx + 12, gy + 36, ORANGE, 14, 'left');
  ph_ground(gy, W * .04, W * .96); ph_box(cx, gy - 30, 90, 60, BLUE, '50 kg');
  A(cx + 45, gy - 30, 56, 0, GREEN, '', 3); TB('v', cx + 112, gy - 36, DGREEN, 14, 'left');
  A(cx - 45, gy - 8, -56, 0, RED, '', 3.8); TB('f = ?', cx - 108, gy - 16, DRED, 14, 'right');
  TB('μ_c = 0,40', W * .5, H * .08, INK, 15);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('N = P = 50 × 9,81 = 490,5 N', W * .5, H * .93, VIO_D, 14); tag('f = μ·N ≈ 196 N', cx - 100, gy + 34, DRED, 15); ctx.globalAlpha = 1; }
 },
 /* 2 angle limite */
 function (p) {
  var th = 20 * D2R, gy = H * .84, x0 = W * .08, Lx = W * .74;
  var g = ph_incl(th, x0, gy, Lx, .58, 40); TB('20°', x0 + 70, gy - 8, GREY, 13);
  TB('l’objet commence à glisser', W * .5, H * .1, GREY, 14);
  A(g.C.x, g.C.y, -g.u.x * 50, -g.u.y * 50, GREEN, '', 3);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('tan α = μ_s', W * .26, H * .3, DRED, 15); tag('μ_s = tan 20° ≈ 0,36', W * .26, H * .44, DGREEN, 16); ctx.globalAlpha = 1; }
 },
 /* 3 bloc 5 kg sur plan 30° */
 function (p) {
  var th = 30 * D2R, gy = H * .88, x0 = W * .06, Lx = W * .64, kP = H * .0054;
  var g = ph_incl(th, x0, gy, Lx, .55, 44), C = g.C, u = g.u, n = g.n; TB('30°', x0 + 66, gy - 8, GREY, 13);
  A(C.x, C.y, 0, 49 * kP, RED, '', 3.2); TB('P = 49 N', C.x + 6, C.y + 49 * kP + 16, DRED, 13, 'left');
  A(C.x, C.y, n.x * 42.5 * kP, n.y * 42.5 * kP, VIOLET, '', 3.2);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(C.x, C.y, u.x * 8.5 * kP * q, u.y * 8.5 * kP * q, ORANGE, '', 3.4);
   if (q > .95) { TB('N ≈ 42,5 N', W * .98, H * .1, VIO_D, 14, 'right'); TB('f ≈ 8,5 N (vers le haut)', W * .98, H * .2, ORANGE, 14, 'right'); tag('a ≈ 3,2 m/s² vers le bas', W * .8, H * .36, DGREEN, 14); A(W * .78, H * .5, -u.x * 60, -u.y * 60 * -1 * -1, DGREEN, '', 3.2); } }
  else TB('μ_c = 0,20 ; m = 5,0 kg', W * .98, H * .1, GREY, 13, 'right');
 },
 /* 4 tir oblique 20 m/s 30° */
 function (p) {
  var x0 = W * .08, gy = H * .82, k = (W * .84) / 36; ph_ground(gy, W * .02, W * .98);
  ph5_traj(x0, gy, k, 20, 30, 0, BLUE, 2.8, [5, 5]);
  var fr = p > 0 ? ph_ease(p, 0, .8) : 0; ph5_traj(x0, gy, k, 20, 30, 0, BLUE, 3.2, null, fr);
  var tr = ph5_traj(x0, gy, k, 20, 30, 0, 'rgba(0,0,0,0)', 1, null, Math.max(fr, .0001)); BALL(tr.x, tr.y, 8);
  A(x0, gy, 10 * 7, -10 * 4.05, ORANGE, '', 3); TB('20 m/s', x0 + 76, gy - 50, ORANGE, 13, 'left'); arcA({x: x0, y: gy}, 42, 0, -30 * D2R, '', GREY); TB('30°', x0 + 54, gy - 8, GREY, 12);
  if (p > .8) { var q = ph_ease(p, .8, 1); ctx.globalAlpha = q; var xm = x0 + 17.65 * k, ym = gy - 5.10 * k; ph_dash(xm, ym, xm, gy); TB('H ≈ 5,10 m', xm + 6, (ym + gy) / 2 + 20, DGREEN, 13, 'left');
   LN(x0, gy + 18, x0 + 35.3 * k, gy + 18, ORANGE, 1.6); TB('R ≈ 35,3 m', x0 + 17.6 * k, gy + 34, ORANGE, 14); tag('T ≈ 2,04 s', W * .78, H * .3, DRED, 14); ctx.globalAlpha = 1; }
 },
 /* 5 QCM deux angles */
 function (p) {
  var x0 = W * .08, gy = H * .82, k = (W * .84) / 36; ph_ground(gy, W * .02, W * .98);
  ph5_traj(x0, gy, k, 19, 25, 0, BLUE, 3.2); TB('25°', x0 + 40, gy - 14, BLUE_D, 14);
  var R = 19 * 19 * Math.sin(50 * D2R) / 9.81; LN(x0 + R * k, gy - 6, x0 + R * k, gy + 6, DRED, 2.4); TB('R', x0 + R * k, gy + 24, DRED, 14);
  if (p > 0) { var q = ph_ease(p, 0, .8); ph5_traj(x0, gy, k, 19, 65, 0, ORANGE, 3.2, null, q); if (q > .9) { TB('65° = 90° − 25°', x0 + 20, H * .12, ORANGE, 15, 'left'); tag('même portée R', x0 + R * k / 2, gy + 30, DGREEN, 14); } }
  else TB('autre angle, même v₀, même R ?', W * .6, H * .2, GREY, 14);
 },
 /* 6 freinage sec / mouillé */
 function (p) {
  var gy1 = H * .4, gy2 = H * .8, x0 = W * .1, k = (W * .64) / 80;
  [[gy1, 'sec : μ = 0,70', 45.5, BLUE], [gy2, 'mouillé : μ = 0,40', 79.6, RED]].forEach(function (r) {
   ph_ground(r[0] + 10, W * .04, W * .96);
   function car(x, al) { ctx.globalAlpha = al; ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = r[3]; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x, r[0] - 24, 56, 24, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(x + 14, r[0] - 38, 26, 15, 5); ctx.fill(); ctx.stroke(); DOT(x + 12, r[0] + 2, 6, '#555'); DOT(x + 44, r[0] + 2, 6, '#555'); ctx.globalAlpha = 1; }
   car(x0, 1); A(x0 + 56, r[0] - 12, 36, 0, GREEN, '', 3); TB(r[1], x0, r[0] - 52, r[3] === BLUE ? BLUE_D : DRED, 13, 'left');
   if (p > 0) { var q = ph_ease(p, 0, .7); car(x0 + r[2] * k * q, .4); ctx.globalAlpha = q; LN(x0 + 28, r[0] + 26, x0 + 28 + r[2] * k * q, r[0] + 26, r[3], 2.4); TB('d ≈ ' + String(r[2]).replace('.', ',') + ' m', x0 + 28 + r[2] * k * q / 2, r[0] + 42, r[3] === BLUE ? BLUE_D : DRED, 14); ctx.globalAlpha = 1; } });
  TB('90 km/h, roues bloquées', W * .5, H * .08, GREY, 13);
 },
 /* 7 caisse 20 kg sur plan 20° */
 function (p) {
  var th = 20 * D2R, gy = H * .88, x0 = W * .06, Lx = W * .62, kP = H * .0017;
  var g = ph_incl(th, x0, gy, Lx, .52, 50), C = g.C, u = g.u, n = g.n; TB('20°', x0 + 66, gy - 8, GREY, 13); TB('20 kg', C.x, C.y + 5, BLUE_D, 13);
  A(C.x, C.y, 0, 196 * kP, RED, '', 3); TB('P', C.x + 8, C.y + 196 * kP + 10, DRED, 13, 'left');
  TB('μ_s = 0,45 ; μ_c = 0,30', W * .98, H * .08, GREY, 13, 'right');
  if (p > 0) { var q = ph_ease(p, 0, .6); A(C.x, C.y, u.x * 67.1 * kP * q, u.y * 67.1 * kP * q, ORANGE, '', 3.4); 
   if (q > .95) { TB('immobile : f = 67,1 N', W * .98, H * .2, ORANGE, 13, 'right'); TB('démarrer vers le haut : F > 150 N', W * .98, H * .32, DRED, 13, 'right'); TB('ensuite (vitesse constante) : F ≈ 122 N', W * .98, H * .44, DGREEN, 13, 'right'); } }
 },
 /* 8 brique à plat ou sur la tranche */
 function (p) {
  var gy = H * .72; ph_ground(gy, W * .04, W * .96);
  [[W * .27, 110, 36, 'grande face'], [W * .73, 36, 110, 'petite face']].forEach(function (b) {
   ctx.fillStyle = '#f3d9c6'; ctx.strokeStyle = ORA2; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(b[0] - b[1] / 2, gy - b[2], b[1], b[2], 3); ctx.fill(); ctx.stroke();
   A(b[0] + b[1] / 2, gy - b[2] / 2, 50, 0, BLUE, '', 3.4); TB(b[3], b[0], H * .1, GREY, 13);
   if (p > 0) { var q = ph_ease(p, 0, .6); A(b[0] - b[1] / 2, gy - 6, -50 * q, 0, RED, '', 3.6); } });
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('f = μ_c·N = μ_c·m·g', W * .5, H * .3, DRED, 15); tag('même force dans les deux cas', W * .5, H * .9, DGREEN, 15); ctx.globalAlpha = 1; }
  else TB('f ?', W * .27 - 80, gy - 14, DRED, 15);
 },
 /* 9 falaise */
 function (p) {
  var cx = W * .17, cy = H * .22, gy = H * .8, k = Math.min((H * .58) / 45, (W * .8) / 52); 
  ctx.fillStyle = '#e8e3da'; ctx.fillRect(0, cy, cx + 6, gy - cy); LN(cx + 6, cy, cx + 6, gy, INK, 2.4); LN(0, cy, cx + 6, cy, INK, 2.4); ph_ground(gy, 0, W * .98);
  var X0 = cx + 6; ph5_traj(X0, cy, k, 15, 30, 45, BLUE, 2.6, [5, 5]);
  var fr = p > 0 ? ph_ease(p, 0, .8) : 0, tr = ph5_traj(X0, cy, k, 15, 30, 45, BLUE, 3.2, null, fr); 
  var tt = ph5_traj(X0, cy, k, 15, 30, 45, 'rgba(0,0,0,0)', 1, null, Math.max(fr, .0001)); BALL(tt.x, tt.y, 7);
  LN(X0 - 24, cy, X0 - 24, gy, GREY, 1.4); TB('45 m', X0 - 30, (cy + gy) / 2, INK, 13, 'right');
  A(X0, cy, 15 * .866 * 3.2, -15 * .5 * 3.2, ORANGE, '', 3); TB('15 m/s, 30°', X0 + 56, cy - 22, ORANGE, 13, 'left');
  if (p > .8) { var q = ph_ease(p, .8, 1); ctx.globalAlpha = q; LN(X0, gy + 16, X0 + 50.5 * k, gy + 16, ORANGE, 1.6); TB('x ≈ 50,5 m', X0 + 25 * k, gy + 32, ORANGE, 14);
   var xe = X0 + 50.5 * k; A(xe - 58, gy - 66, 58, 66, RED, '', 3.4); TB('v ≈ 33,3 m/s, 67°', xe - 40, gy - 78, DRED, 13, 'right'); tag('t ≈ 3,89 s', W * .68, H * .3, DGREEN, 14); ctx.globalAlpha = 1; }
 },
 /* 10 golf : parabole vs air */
 function (p) {
  var x0 = W * .06, gy = H * .84, k = (W * .86) / 370; ph_ground(gy, W * .02, W * .98);
  ph5_traj(x0, gy, k, 60, 40, 0, GREY, 2.2, [6, 5]); TB('vide : parabole', x0 + 180 * k, gy - 76 * k - 10, GREY, 13);
  if (p > 0) { var q = ph_ease(p, 0, .8), x = 0, y = 0, vx = 60 * Math.cos(40 * D2R), vy = 60 * Math.sin(40 * D2R), dt = .01, kd = .0025, pts = [], tm = 0;
   while (y >= 0 && tm < 20) { var v = Math.hypot(vx, vy); vx -= kd * v * vx * dt; vy -= (9.81 + kd * v * vy) * dt; x += vx * dt; y += vy * dt; tm += dt; pts.push([x, y]); }
   var nn = Math.floor(pts.length * q); ctx.strokeStyle = RED; ctx.lineWidth = 3.4; ctx.beginPath(); for (var i = 0; i < nn; i += 4) { var P = pts[i]; i ? ctx.lineTo(x0 + P[0] * k, gy - P[1] * k) : ctx.moveTo(x0 + P[0] * k, gy - P[1] * k); } ctx.stroke();
   if (q > .95) { TB('avec l’air : moins haut, moins loin,', W * .98, H * .14, DRED, 13, 'right'); TB('descente plus raide que la montée', W * .98, H * .24, DRED, 13, 'right'); tag('angle optimal < 45°', W * .76, H * .5, DGREEN, 14); } }
  else TB('balle de golf frappée à grande vitesse', W * .5, H * .12, GREY, 14);
 }
]);
