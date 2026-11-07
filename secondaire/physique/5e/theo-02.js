/* Physique 5e · chapitre 2 : équilibre statique et première loi de Newton */
function ph2_plank(x0, x1, y, th, thick) { /* planche inclinée de th autour de son milieu */
  var cx = (x0 + x1) / 2, h = (x1 - x0) / 2, c = Math.cos(th), s = Math.sin(th);
  ctx.save(); ctx.translate(cx, y); ctx.rotate(th); ctx.fillStyle = '#e8d9bd'; ctx.strokeStyle = '#9a7b3c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(-h, -(thick || 9), 2 * h, thick || 9); ctx.fill(); ctx.stroke(); ctx.restore();
}
function ph2_tri(x, y, w, h) { ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - w / 2, y + h); ctx.lineTo(x + w / 2, y + h); ctx.closePath(); ctx.fill(); }

SFA.theo("c02", {
  icon: function () {
    var cx = W * .28, y = H * .62;
    ph2_plank(W * .04, W * .52, y, 0, 10); ph2_tri(cx, y, 36, 40); ph_ground(y + 40, W * .1, W * .46);
    A(W * .12, y - 14, 0, 46, RED, '', 3); A(W * .44, y - 14, 0, 46, RED, '', 3);
    TB('ΣF = 0', W * .76, H * .38, BLUE_D, 30); TB('ΣM = 0', W * .76, H * .6, ORANGE, 26);
  },
  anim: function (t) {
    var cx = W * .5, py = H * .56, L = Math.min(W * .42, 300), kd = L / 2.4;
    var d2 = 0.7 + 1.5 * (.5 + .5 * Math.sin(t * .012));     /* distance du 2e enfant (m) */
    var d1 = 2.0, m1 = 30, m2 = 45, g = 9.81;
    var M1 = m1 * g * d1, M2 = m2 * g * d2, th = Math.max(-.2, Math.min(.2, (M2 - M1) * .0006));
    var eq = Math.abs(M2 - M1) < 14;
    ph2_tri(cx, py + 1, 34, 44); ph_ground(py + 45, cx - 150, cx + 150);
    ctx.save(); ctx.translate(cx, py); ctx.rotate(th);
    ctx.fillStyle = '#e8d9bd'; ctx.strokeStyle = '#9a7b3c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(-L, -9, 2 * L, 9); ctx.fill(); ctx.stroke();
    function kid(xm, col, lab, m) { var r = 9 + m * .12; ctx.fillStyle = col + '33'; ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(xm, -9 - r, r, 0, 7); ctx.fill(); ctx.stroke(); TB(lab, xm, -9 - r + 4, dk(col), 11); A(xm, -9, 0, 0, col); }
    kid(-d1 * kd, BLUE, '30', m1); kid(d2 * kd, ORANGE, '45', m2);
    ctx.restore();
    var xl = cx - d1 * kd * Math.cos(th), xr = cx + d2 * kd * Math.cos(th);
    TB('d₁ = 2,0 m', cx - d1 * kd / 2, py + 62, BLUE_D, 13); TB('d₂ = ' + d2.toFixed(2).replace('.', ',') + ' m', cx + d2 * kd / 2, py + 62, ORANGE, 13);
    TB('M₁ = m₁·g·d₁ = ' + Math.round(M1) + ' N·m', W * .04, H * .1, BLUE_D, 14, 'left');
    TB('M₂ = m₂·g·d₂ = ' + Math.round(M2) + ' N·m', W * .04, H * .2, ORANGE, 14, 'left');
    TB(eq ? 'ΣM = 0 : équilibre' : (M2 > M1 ? 'M₂ > M₁ : la planche tourne à droite' : 'M₁ > M₂ : la planche tourne à gauche'), W * .96, H * .1, eq ? DGREEN : GREY, 15, 'right');
    if (eq) TB('d₂ = 1,33 m', W * .96, H * .2, DGREEN, 14, 'right');
  },
  th: '<div class="tcard"><b class="h">Première loi de Newton : le principe d’inertie</b><p>Si la <b>résultante des forces est nulle</b> (ΣF = 0), un corps au repos reste au repos et un corps en mouvement garde un <b>mouvement rectiligne uniforme</b>. Il ne faut donc pas de force pour <i>maintenir</i> une vitesse : il en faut pour la <i>changer</i>. Une voiture à vitesse constante : la force motrice compense exactement les frottements.</p><p>La loi n’est valable que dans un <b>référentiel galiléen</b> (le sol, ou tout référentiel en translation rectiligne uniforme par rapport à lui). Dans un train qui accélère, on doit tenir compte du mouvement du référentiel.</p></div>' +
  '<div class="tcard"><b class="h">Équilibre de translation</b><p>Un point matériel est à l’équilibre si <b>ΣF = 0</b>, c’est-à-dire ΣF<sub>x</sub> = 0 et ΣF<sub>y</sub> = 0. Méthode : (1) isoler l’objet ; (2) dessiner toutes les forces (poids, tension, normale, frottement) ; (3) choisir des axes ; (4) projeter et résoudre. Un fil qui retient une masse m immobile ou montant à vitesse constante : T = m·g dans les deux cas (a = 0).</p></div>' +
  '<div class="tcard"><b class="h">Moment d’une force et équilibre de rotation</b><p>Le <b>moment</b> d’une force par rapport à un axe vaut <b>M = F·d</b>, où d est le <b>bras de levier</b> : la distance de l’axe à la <i>droite d’action</i> de la force (mesurée perpendiculairement). Il s’exprime en N·m. Il est positif ou négatif selon le sens de rotation provoqué.</p><p>Un solide étendu est en équilibre si <b>ΣF = 0</b> <i>et</i> <b>ΣM = 0</b> (par rapport à n’importe quel point : choisis le plus pratique, par exemple un appui inconnu, pour éliminer une force). Le poids d’un corps homogène s’applique en son <b>centre</b>.</p></div>' +
  '<div class="tcard"><b class="h">Pièges et exemple chiffré</b><ul><li>La vitesse constante n’exige pas de force motrice nulle, mais une résultante nulle.</li><li>Le « poids du chemin » : un appui peut tirer vers le bas (plongeoir) ; garde les signes des moments.</li><li>L’inertie n’est pas une force.</li></ul><p><b>Balançoire :</b> 30 kg à 2,0 m ; 45 kg à d. ΣM = 0 : 30·g·2,0 = 45·g·d, donc d = 60/45 ≈ 1,33 m. Le pivot porte N = (30 + 45)·9,81 ≈ 736 N.</p></div>'
});

SFA.figs("c02", [
 /* 1 palet sur la glace */
 function (p) {
  var gy = H * .66, x0 = W * .2, x1 = W * .92;
  ctx.fillStyle = '#e4f0fb'; ctx.fillRect(0, gy, W, H * .12); LN(0, gy, W, gy, BLUE, 2);
  TB('glace sans frottement', W * .5, gy + H * .1, BLUE_D, 13);
  var X = function (m) { return x0 + m / 50 * (x1 - x0 - 30); };
  function puck(x, a) { ctx.globalAlpha = a; ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x - 16, gy - 14, 32, 14, 4); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1; }
  if (p > 0) { puck(X(25), .35 * ph_ease(p, 0, .5)); puck(X(50), .35 * ph_ease(p, .2, .7)); }
  puck(X(0), 1);
  A(X(0) + 20, gy - 7, 62, 0, GREEN, '', 3.4); TB('v = 5 m/s', X(0) + 56, gy - 22, DGREEN, 14);
  A(X(0), gy - 16, 0, -48, VIOLET, '', 3); TB('N', X(0) - 12, gy - 54, VIO_D, 13, 'right'); A(X(0), gy - 4, 0, 40, RED, '', 3); TB('P', X(0) - 12, gy + 40, DRED, 13, 'right');
  if (p > 0) { var q = ph_ease(p, .2, .8); ctx.globalAlpha = q;
   LN(X(0), gy + 34, X(50), gy + 34, GREY, 1.5); [0, 25, 50].forEach(function (m) { LN(X(m), gy + 28, X(m), gy + 40, GREY, 1.5); TB(m + ' m', X(m), gy + 54, INK, 12); });
   TB('t = 0', X(0), H * .12, GREY, 12); TB('t = 5 s', X(25), H * .12, GREY, 12); TB('t = 10 s', X(50), H * .12, GREY, 12);
   tag('ΣF = 0 : v constante, d = 50 m', W * .5, H * .3, DGREEN, 14); ctx.globalAlpha = 1; }
 },
 /* 2 clé et écrou */
 function (p) {
  var ox = W * .2, oy = H * .5, L = W * .62;
  ctx.fillStyle = '#cfd6de'; ctx.strokeStyle = '#7f8790'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(ox - 6, oy - 9, L, 18, 8); ctx.fill(); ctx.stroke();
  ctx.beginPath(); for (var i = 0; i < 6; i++) { var a = i * PI / 3 + .3; ctx.lineTo(ox + 24 * Math.cos(a), oy + 24 * Math.sin(a)); } ctx.closePath(); ctx.fillStyle = '#9aa5b1'; ctx.fill(); ctx.stroke();
  DOT(ox, oy, 5, INK);
  var fx = ox + L * .8; A(fx, oy + 66, 0, -56, RED, '', 4); TB('F = 40 N', fx + 12, oy + 40, DRED, 15, 'left');
  LN(ox, oy + 44, fx, oy + 44, GREY, 1.4); LN(ox, oy + 38, ox, oy + 50, GREY, 1.4); LN(fx, oy + 38, fx, oy + 50, GREY, 1.4); TB('d = 25 cm', (ox + fx) / 2 - 20, oy + 36, INK, 13);
  rmark({x: fx, y: oy + 6}, {x: -1, y: 0}, {x: 0, y: 1}, 0);
  if (p > 0) { var q = ph_ease(p, 0, .7); ctx.strokeStyle = ORANGE; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.arc(ox, oy, 46, -PI * .15, -PI * .15 - PI * 1.4 * q, true); ctx.stroke();
   if (q > .9) { tag('M = F·d = 40 × 0,25', W * .62, H * .14, DRED, 15); TB('M = 10 N·m', W * .62, H * .28, ORANGE, 20); } }
 },
 /* 3 fil : repos / montée à vitesse constante */
 function (p) {
  [[W * .27, 'au repos', 0], [W * .73, 'v = 2 m/s constante', 1]].forEach(function (c) {
   var x = c[0], top = H * .08; LN(x - 40, top, x + 40, top, INK, 3); LN(x, top, x, H * .42, INK, 2);
   ph_box(x, H * .5, 44, 44, BLUE, '3 kg');
   if (c[2]) A(x + 56, H * .5 + 6, 0, -44, GREEN, '', 3.4), TB('v', x + 70, H * .38, DGREEN, 14, 'left');
   A(x - 28, H * .5 - 8, 0, -50, VIOLET, '', 3.4); A(x - 28, H * .5 + 8, 0, 50, RED, '', 3.4); TB('T', x - 44, H * .5 - 52, VIO_D, 14); TB('P', x - 44, H * .5 + 64, DRED, 14);
   TB(c[1], x, H * .84, GREY, 13);
   if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; tag('T = P = 29,4 N', x, H * .94, DGREEN, 14); ctx.globalAlpha = 1; } });
 },
 /* 4 balançoire */
 function (p) {
  var cx = W * .5, py = H * .55, kd = W * .22, th = 0;
  ph2_tri(cx, py + 1, 36, 48); ph_ground(py + 49, W * .1, W * .9);
  ph2_plank(W * .06, W * .94, py, 0, 9);
  var d2 = p > 0 ? 1.33 : 1.33; 
  function kid(x, col, lab, m) { var r = 11 + m * .1; ctx.fillStyle = col + '33'; ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, py - 9 - r, r, 0, 7); ctx.fill(); ctx.stroke(); TB(lab, x, py - 9 - r + 4, dk(col), 12); TB('kg', x, py - 9 - 2 * r - 6, dk(col), 11); A(x, py + 2, 0, 38, RED, '', 3); }
  kid(cx - 2 * kd, BLUE, '30', 30); kid(cx + d2 * kd, ORANGE, '45', 45);
  LN(cx - 2 * kd, py + 62, cx, py + 62, GREY, 1.4); TB('2,0 m', cx - kd, py + 80, INK, 13);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; LN(cx, py + 62, cx + d2 * kd, py + 62, ORANGE, 1.6); TB('d = 1,33 m', cx + d2 * kd / 2, py + 80, ORANGE, 14);
   A(cx, py + 56, 0, -58 * q, VIOLET, '', 3.4); TB('N = 736 N', cx + 10, py + 106, VIO_D, 14, 'left'); ctx.globalAlpha = 1; }
 },
 /* 5 QCM voiture à vitesse constante */
 function (p) {
  var gy = H * .72; ph_ground(gy + 12, W * .04, W * .96);
  ctx.fillStyle = '#e5f2ec'; ctx.strokeStyle = GREEN; ctx.lineWidth = 2.4; var cl = W * .5 - 65; ctx.beginPath(); ctx.roundRect(cl, gy - 36, 130, 36, 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(cl + 34, gy - 58, 62, 26, 8); ctx.fill(); ctx.stroke(); DOT(cl + 28, gy + 8, 10, '#555'); DOT(cl + 102, gy + 8, 10, '#555');
  var xc = cl + 65;
  A(xc - 40, H * .2, 80, 0, GREEN, '', 3.4); TB('v = 90 km/h = constante', xc, H * .2 - 14, DGREEN, 14);
  A(xc, gy - 18, 0, 0, RED);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(cl + 130, gy - 18, 70 * q, 0, BLUE, '', 4); A(cl, gy - 18, -70 * q, 0, RED, '', 4);
   if (q > .95) { TB('F motrice', cl + 150, gy - 36, BLUE_D, 13, 'left'); TB('frottements', cl - 18, gy - 36, DRED, 13, 'right'); tag('égales : ΣF = 0', W * .5, H * .92, DGREEN, 15); } }
  else { TB('F motrice ?   frottements ?', W * .5, H * .92, GREY, 14); }
 },
 /* 6 poutre sur deux appuis */
 function (p) {
  var xa = W * .1, xb = W * .9, y = H * .5, X = function (m) { return xa + m / 4 * (xb - xa); };
  ph2_plank(xa, xb, y, 0, 10); ph2_tri(xa, y, 26, 36); ph2_tri(xb, y, 26, 36); ph_ground(y + 36, xa - 30, xb + 30);
  TB('A', xa, y + 56, INK, 14); TB('B', xb, y + 56, INK, 14);
  pers(X(1), y - 10, 56, BLUE, 1); TB('60 kg', X(1) + 24, y - 40, BLUE_D, 13, 'left'); A(X(1), y + 2, 0, 30, RED, '', 3.6);
  A(X(2), y + 2, 0, 26, RED, '', 3); TB('poutre 20 kg', X(2) + 8, y + 22, DRED, 12, 'left');
  LN(xa, y - 80, X(1), y - 80, GREY, 1.4); TB('1,0 m', (xa + X(1)) / 2, y - 86, INK, 12); TB('4,0 m', (xa + xb) / 2, y + 104, INK, 12);
  if (p > 0) { var q = ph_ease(p, 0, .6); ph_arrp(xa, y + 36, xa, y - 38, q, VIOLET, '', 3.6); ph_arrp(xb, y + 36, xb, y - 38, q, VIOLET, '', 3.6);
   if (q > .95) { tag('N_A ≈ 540 N', xa + 40, y + 74, VIO_D, 14); tag('N_B ≈ 245 N', xb - 40, y + 74, VIO_D, 14); } }
 },
 /* 7 pendule dans un train */
 function (p) {
  var gy = H * .86, bx = W * .12, bw = W * .66, by = H * .12, bh = gy - by - 16;
  ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.fillStyle = '#f4f8fc'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill(); ctx.stroke();
  DOT(bx + bw * .25, gy - 6, 9, '#555'); DOT(bx + bw * .75, gy - 6, 9, '#555'); ph_ground(gy + 4, W * .02, W * .98);
  var px = bx + bw * .5, py = by + 8, L = bh * .62, th = 12 * D2R, bxx = px - L * Math.sin(th), byy = py + L * Math.cos(th);
  LN(px - 14, py, px + 14, py, INK, 3); ph_dash(px, py, px, py + L + 12);
  LN(px, py, bxx, byy, INK, 2); arcA({x: px, y: py}, 46, PI / 2, PI / 2 + th, '', GREY); TB('12°', px - 22, py + 62, GREY, 12);
  BALL(bxx, byy, 11); TB('0,30 kg', bxx - 20, byy + 4, BLUE_D, 12, 'right');
  A(bx + bw + 10, H * .4, 56, 0, ORANGE, '', 3.6); TB('a', bx + bw + 82, H * .4 + 5, ORANGE, 16, 'left');
  if (p > 0) { var q = ph_ease(p, 0, .6), k = 34;
   A(bxx, byy, (px - bxx) / L * 48 * q, (py - byy) / L * 48 * q, VIOLET, '', 3.2); A(bxx, byy, 0, 47 * q, RED, '', 3.2);
   if (q > .95) { TB('T ≈ 3,01 N', bxx + 40, byy - 36, VIO_D, 13, 'left'); TB('P = 2,94 N', bxx + 10, byy + 44, DRED, 13, 'left'); tag('a = g·tan 12° ≈ 2,09 m/s²', W * .5, H * .06, DGREEN, 13); } }
 },
 /* 8 QCM caisse qui glisse en avant */
 function (p) {
  var gy = H * .68, tx = W * .12, tw = W * .64;
  ctx.fillStyle = '#eef0f3'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(tx, gy - 18, tw, 18, 3); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d6e4f5'; ctx.beginPath(); ctx.roundRect(tx + tw + 4, gy - 58, 62, 58, 8); ctx.fill(); ctx.stroke();
  DOT(tx + 40, gy + 10, 11, '#555'); DOT(tx + tw - 20, gy + 10, 11, '#555'); DOT(tx + tw + 40, gy + 10, 11, '#555'); ph_ground(gy + 22, 0, W);
  var cxx = tx + tw - 130 + 45 * ph_ease(p, 0, .8); ph_box(cxx, gy - 18 - 22, 44, 44, ORANGE, '');
  A(cxx + 24, gy - 40, 40, 0, GREEN, '', 3); TB('v', cxx + 74, gy - 34, DGREEN, 14);
  A(tx + tw + 70, gy + 32, -70, 0, RED, '', 3.6); TB('le camion freine', tx + tw + 20, gy + 58, DRED, 13);
  if (p > 0) { var q = ph_ease(p, 0, .6); A(cxx + 20, gy - 18 - 4, -26 * q, 0, VIOLET, '', 3); TB('frottement (trop faible)', cxx - 60, gy - 70, VIO_D, 13, 'right'); tag('aucune force vers l’avant : inertie', W * .5, H * .12, DGREEN, 14); }
 },
 /* 9 plongeoir */
 function (p) {
  var xa = W * .1, xl = W * .88, y = H * .45, X = function (m) { return xa + m / 3 * (xl - xa); };
  ph2_plank(xa, xl, y, 0, 9); 
  ctx.fillStyle = '#9aa5b1'; ctx.fillRect(xa - 6, y - 4, 12, 60); ctx.fillRect(X(.8) - 6, y + 4, 12, 56); ph_ground(y + 60, xa - 40, X(.8) + 60);
  pers(xl - 6, y - 9, 56, BLUE, -1); TB('70 kg', xl - 6, y - 74, BLUE_D, 13); A(xl - 6, y - 4, 0, 40, RED, '', 3.4);
  A(X(1.5), y + 2, 0, 26, RED, '', 3); TB('12 kg', X(1.5) + 8, y + 24, DRED, 12, 'left');
  TB('A', xa, y + 78, INK, 14); TB('B', X(.8), y + 78, INK, 14); LN(xa, y + 94, X(.8), y + 94, GREY, 1.4); TB('0,80 m', (xa + X(.8)) / 2, y + 112, INK, 12); TB('3,0 m', (xa + xl) / 2 + 60, y + 112, INK, 12);
  if (p > 0) { var q = ph_ease(p, 0, .6); ph_arrp(xa, y - 30, xa, y + 40, q, VIOLET, '', 3.6); ph_arrp(X(.8), y + 40, X(.8), y - 34, q, VIOLET, '', 3.6);
   if (q > .95) { TB('A tire vers le bas : 1,99 kN', W * .04, H * .08, VIO_D, 14, 'left'); TB('B pousse vers le haut : 2,80 kN', W * .04, H * .19, VIO_D, 14, 'left'); } }
 },
 /* 10 règle équilibrée */
 function (p) {
  var xa = W * .08, xb = W * .92, y = H * .5, X = function (m) { return xa + m * (xb - xa); };
  ph2_plank(xa, xb, y, 0, 10); ph2_tri(X(.3), y, 30, 40); ph_ground(y + 40, xa, xb);
  LN(xa + 8, y - 10, xa + 8, y - 30, INK, 1.5); ph_box(xa + 8, y - 54, 30, 24, BLUE, 'm'); A(xa + 8, y - 4 + 0, 0, 0, RED);
  A(X(.5), y + 2, 0, 30, RED, '', 3.4); TB('règle 200 g', X(.5) + 10, y - 14, DRED, 13, 'left');
  
  LN(X(0), y + 70, X(.3), y + 70, GREY, 1.4); TB('0,30 m', X(.15), y + 88, INK, 12); TB('1,00 m', X(.5), y + 106, INK, 12);
  if (p > 0) { var q = ph_ease(p, 0, .6); ctx.globalAlpha = q; LN(X(.3), y + 70, X(.5), y + 70, ORANGE, 1.6); TB('0,20 m', X(.4), y + 88, ORANGE, 12);
   tag('m·g × 0,30 = 0,200·g × 0,20', W * .5, H * .12, DRED, 13); tag('m ≈ 133 g', W * .5, H * .24, DGREEN, 16); ctx.globalAlpha = 1; }
 }
]);
