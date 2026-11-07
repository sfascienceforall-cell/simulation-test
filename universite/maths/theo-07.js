/* Mathématiques BA1 · aides de dessin pour la théorie et les devantures (préfixe umb_) */
function umb_clamp(p, a, b){ return Math.max(0, Math.min(1, (p - a) / (b - a))); }
function umb_pl(xr, yr, o){
  o = o || {}; var ox = o.ox != null ? o.ox : W / 2, oy = o.oy != null ? o.oy : H / 2 + (o.dy || 0);
  var k = o.k || Math.min((W - 24) / (2 * xr), (H - 22) / (2 * yr)), m = {k:k, ox:ox, oy:oy, X:function(x){ return ox + x * k; }, Y:function(y){ return oy - y * k; }};
  if (o.grid !== false){ ctx.strokeStyle = '#eceef1'; ctx.lineWidth = 1; var st = o.step || 1, i;
    for (i = Math.ceil(-ox / k / st) * st; ox + i * k < W; i += st){ ctx.beginPath(); ctx.moveTo(ox + i * k, 0); ctx.lineTo(ox + i * k, H); ctx.stroke(); }
    for (i = Math.ceil(-(H - oy) / k / st) * st; oy - i * k > 0; i += st){ ctx.beginPath(); ctx.moveTo(0, oy - i * k); ctx.lineTo(W, oy - i * k); ctx.stroke(); } }
  LN(8, oy, W - 8, oy, '#9aa0a6', 1.4); LN(ox, H - 6, ox, 6, '#9aa0a6', 1.4);
  if (o.xl !== false) T(o.xl || 'Re', W - 18, oy - 8, GREY, 12); if (o.yl !== false) T(o.yl || 'Im', ox + 16, 14, GREY, 12);
  if (o.lab){ var s2 = o.step || 1; ctx.font = '10px Mulish,system-ui,sans-serif'; ctx.fillStyle = GREY; ctx.textAlign = 'center';
    for (var v = Math.ceil(-ox / k / s2) * s2; ox + v * k < W - 20; v += s2){ if (v) ctx.fillText(String(v), ox + v * k, oy + 13); }
    ctx.textAlign = 'right'; for (v = Math.ceil(-(H - oy) / k / s2) * s2; oy - v * k > 14; v += s2){ if (v) ctx.fillText(String(v), ox - 5, oy - v * k + 4); } }
  return m;
}
function umb_vec(m, x, y, col, lab, w, x0, y0){ x0 = x0 || 0; y0 = y0 || 0; var vx = (x - x0) * m.k, vy = -(y - y0) * m.k; A(m.X(x0), m.Y(y0), vx, vy, col, lab || '', w || 2.6); }
function umb_pt(m, x, y, col, lab, dx, dy, r, sz){ DOT(m.X(x), m.Y(y), r || 5, col); if (lab) umb_TB(lab, m.X(x) + (dx == null ? 12 : dx), m.Y(y) + (dy == null ? -9 : dy), col === GREEN ? DGREEN : col === BLUE ? BLUE_D : col === RED ? DRED : col, sz || 11); }
function umb_seg(m, x1, y1, x2, y2, col, w, dash){ LN(m.X(x1), m.Y(y1), m.X(x2), m.Y(y2), col || INK, w || 1.6, dash); }
function umb_arc(m, r, a0, a1, col, w, cx, cy){ ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.beginPath(); ctx.arc(m.X(cx || 0), m.Y(cy || 0), r, -a0, -a1, a1 > a0); ctx.stroke(); }
function umb_circ(m, r, col, w, dash, cx, cy){ ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.arc(m.X(cx || 0), m.Y(cy || 0), r * m.k, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
function umb_note(txt, x, y, col, size, al){ umb_TB(txt, x, y, col || INK, size || 13, al || 'center'); }
function umb_panel(lines, x, y, size, col, lh){ lines.forEach(function(s, i){ umb_TB(s, x, y + i * (lh || size * 1.5) * umb_FS * .9, col || INK, size, 'left'); }); }
/* 3D : o = {cx, cy, s, az, el} ; z vers le haut */
function umb_P(o, x, y, z){ x -= o.tx || 0; y -= o.ty || 0; z -= o.tz || 0; var ca = Math.cos(o.az), sa = Math.sin(o.az), ce = Math.cos(o.el), se = Math.sin(o.el), X = x * ca - y * sa, Y = x * sa + y * ca; return {x:o.cx + X * o.s, y:o.cy - (z * ce + Y * se) * o.s, d:Y * ce - z * se}; }
function umb_L3(o, a, b, col, w, dash){ var p = umb_P(o, a[0], a[1], a[2]), q = umb_P(o, b[0], b[1], b[2]); LN(p.x, p.y, q.x, q.y, col, w || 1.6, dash); }
function umb_A3(o, a, b, col, lab, w){ var p = umb_P(o, a[0], a[1], a[2]), q = umb_P(o, b[0], b[1], b[2]); A(p.x, p.y, q.x - p.x, q.y - p.y, col, lab || '', w || 2.6); }
function umb_D3(o, a, col, lab, r){ var p = umb_P(o, a[0], a[1], a[2]); DOT(p.x, p.y, r || 5, col); if (lab) TB(lab, p.x + 11, p.y - 9, col, 13); }
function umb_ax3(o, L, names){ var n = names || ['x', 'y', 'z'], g;
  for (g = -L; g <= L; g++){ umb_L3(o, [g, -L, 0], [g, L, 0], '#e9edf2', 1); umb_L3(o, [-L, g, 0], [L, g, 0], '#e9edf2', 1); }
  umb_A3(o, [0, 0, 0], [L, 0, 0], '#8a95a3', n[0], 1.4); umb_A3(o, [0, 0, 0], [0, L, 0], '#8a95a3', n[1], 1.4); umb_A3(o, [0, 0, 0], [0, 0, L], '#8a95a3', n[2], 1.4); }
function umb_poly3(o, pts, fill, stroke){ ctx.beginPath(); pts.forEach(function(q, i){ var p = umb_P(o, q[0], q[1], q[2]); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); } }
function umb_v3(s, dy, t){ t = t || [0, 0, 0]; return {cx:W / 2, cy:H / 2 + (dy || 0), s:s, az:0.7 + 0.35 * Math.sin(tG / 110), el:0.5, tx:t[0], ty:t[1], tz:t[2]}; }
function umb_o3(s, dy, t){ t = t || [0, 0, 0]; return {cx:W / 2, cy:H / 2 + (dy || 0), s:s, az:ORB.a, el:Math.max(.1, Math.min(1.3, ORB.b)), tx:t[0], ty:t[1], tz:t[2]}; }

var umb_FS = 1.28;
function umb_TB(t, x, y, c, sz, al){ TB(t, x, y, c, Math.round((sz || 12) * umb_FS), al); }

function umb_cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function umb_dotv(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function umb_pp(o, n, d, L, fill, stroke){ var nn = umb_dotv(n, n), p0 = [n[0] * d / nn, n[1] * d / nn, n[2] * d / nn], h = Math.abs(n[2]) > .9 * Math.sqrt(nn) ? [1, 0, 0] : [0, 0, 1], e1 = umb_cross(n, h), l1 = Math.sqrt(umb_dotv(e1, e1)); e1 = e1.map(function(x){ return x / l1; });
  var e2 = umb_cross(n, e1), l2 = Math.sqrt(umb_dotv(e2, e2)); e2 = e2.map(function(x){ return x / l2; });
  function Q(a, b){ return [p0[0] + e1[0] * a * L + e2[0] * b * L, p0[1] + e1[1] * a * L + e2[1] * b * L, p0[2] + e1[2] * a * L + e2[2] * b * L]; }
  umb_poly3(o, [Q(-1, -1), Q(1, -1), Q(1, 1), Q(-1, 1)], fill || 'rgba(29,158,117,.16)', stroke || 'rgba(15,110,86,.7)'); }

SFA.theo("c07", {
  icon: function(){
    ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0, 0, W, H);
    var o = {cx:W * .36, cy:H * .62, s:H * .12, az:.8, el:.5};
    umb_ax3(o, 3, ['x', 'y', 'z']); umb_poly3(o, [[0, 0, 0], [2, 0, 0], [2.6, 2, 0], [.6, 2, 0]], 'rgba(186,117,23,.18)', 'rgba(186,117,23,.7)');
    umb_A3(o, [0, 0, 0], [2, 0, 0], BLUE, 'u', 3); umb_A3(o, [0, 0, 0], [.6, 2, 0], VIOLET, 'v', 3); umb_A3(o, [0, 0, 0], [0, 0, 2.6], RED, 'u×v', 3.2);
    TB('u · v', W * .72, H * .25, BLUE_D, 28, 'left'); TB('u × v', W * .72, H * .45, DRED, 28, 'left'); TB('ax+by+cz=d', W * .66, H * .68, DGREEN, 20, 'left'); TB('A + t·d', W * .72, H * .86, ORANGE, 22, 'left');
  },
  anim: function(t){
    var o = umb_o3(Math.min(W * .12, H * .15), H * .06, [0, 0, 1.2]); o.cx = W * .34;
    var a = 0.9 + 0.5 * Math.sin(t * 0.017), u = [3, 0, 0.8], v = [3 * Math.cos(a) * .6 + .2, 3 * Math.sin(a), 0.8 * Math.sin(a) + .6]; var w = umb_cross(u, v), nw = Math.sqrt(umb_dotv(w, w)), f = 3.2 / nw;
    umb_ax3(o, 3.5, ['x', 'y', 'z']); umb_poly3(o, [[0, 0, 0], u, [u[0] + v[0], u[1] + v[1], u[2] + v[2]], v], 'rgba(186,117,23,.2)', 'rgba(186,117,23,.75)');
    umb_A3(o, [0, 0, 0], [w[0] * f, w[1] * f, w[2] * f], RED, 'u × v', 3.2); umb_A3(o, [0, 0, 0], u, BLUE, 'u', 3); umb_A3(o, [0, 0, 0], v, VIOLET, 'v', 3);
    var d = umb_dotv(u, v), x0 = W * .62; umb_note('Fais tourner la scène à la souris', x0 + 70, H * .1, GREY, 11);
    umb_panel(['u · v = ' + nfmt(Math.round(d * 100) / 100), 'aire = ‖u × v‖ = ' + nfmt(Math.round(nw * 100) / 100), '(u × v)·u = 0', '(u × v)·v = 0', '', 'u × v ⟂ plan(u, v)'], x0, H * .28, 11, INK, 20);
  },
  th: '<div class="tcard"><b class="h">1. Vecteurs de l\'espace</b><p>Un vecteur de ℝ³ est un triplet u = (x ; y ; z). Si A et B sont deux points, le vecteur AB = B − A = (x_B − x_A ; y_B − y_A ; z_B − z_A). On additionne composante par composante et on multiplie par un réel λ composante par composante. <b>Norme</b> : ‖u‖ = √(x² + y² + z²) (Pythagore deux fois). Deux vecteurs sont <b>colinéaires</b> si l\'un est un multiple de l\'autre.</p><p>Exemple : A(1 ; 2 ; 3), B(4 ; 0 ; 5) donnent AB = (3 ; −2 ; 2), ‖AB‖ = √17 ≈ 4,12.</p></div>' +
    '<div class="tcard"><b class="h">2. Produit scalaire</b><p>u·v = x₁x₂ + y₁y₂ + z₁z₂ = <b>‖u‖‖v‖ cos θ</b>, où θ ∈ [0° ; 180°] est l\'angle entre les vecteurs. Il donne l\'angle (cos θ = u·v/(‖u‖‖v‖)), l\'orthogonalité (<b>u·v = 0 ⇔ u ⟂ v</b>) et la projection orthogonale de v sur u : (u·v/‖u‖²)·u. Il est commutatif et distributif, et u·u = ‖u‖².</p><p>Exemple : u = (1 ; 2 ; 2), v = (2 ; 3 ; 6) : u·v = 20, ‖u‖ = 3, ‖v‖ = 7, cos θ = 20/21, θ ≈ 17,8°.</p></div>' +
    '<div class="tcard"><b class="h">3. Produit vectoriel et produit mixte</b><p>u × v = (y₁z₂ − z₁y₂ ; z₁x₂ − x₁z₂ ; x₁y₂ − y₁x₂). C\'est un vecteur <b>orthogonal à u et à v</b> (sens donné par la règle de la main droite), de norme ‖u‖‖v‖ sin θ = <b>aire du parallélogramme</b> construit sur u et v. Il est anticommutatif : v × u = −u × v ; et u × v = 0 ⇔ u ∥ v.</p><p><b>Produit mixte</b> : (u × v)·w. Sa valeur absolue est le volume du parallélépipède (le tétraèdre en vaut le sixième). Exemple : u = (1 ; 2 ; 3), v = (2 ; −1 ; 0) donnent u × v = (3 ; 6 ; −5).</p></div>' +
    '<div class="tcard"><b class="h">4. Droites de l\'espace</b><p>La droite passant par A de vecteur directeur d : <b>M(t) = A + t·d</b>, soit x = x_A + t·d_x, y = y_A + t·d_y, z = z_A + t·d_z. Il faut <b>deux</b> équations cartésiennes pour l\'écrire sans paramètre. Position relative de deux droites : parallèles (d₁ ∥ d₂), sécantes (un point commun), ou <b>gauches</b> (ni l\'un ni l\'autre ; AB·(d₁ × d₂) ≠ 0).</p><p>Distance d\'un point P à la droite : ‖AP × d‖/‖d‖. Distance entre deux droites gauches : |AB·(d₁ × d₂)|/‖d₁ × d₂‖.</p></div>' +
    '<div class="tcard"><b class="h">5. Plans de l\'espace</b><p>Un plan est décrit par <b>ax + by + cz = d</b> : le vecteur n = (a ; b ; c) est <b>normal</b> au plan. Pour trouver l\'équation : par un point A et une normale n (n·(M − A) = 0), ou par trois points (n = AB × AC). Distance d\'un point P au plan : |ax_P + by_P + cz_P − d|/‖n‖.</p><p>Droite A + t·v et plan : on remplace dans l\'équation du plan ; si n·v ≠ 0, un seul point d\'impact t = (d − n·A)/(n·v) ; si n·v = 0, la droite est parallèle au plan ou contenue dans celui-ci. Deux plans non parallèles se coupent selon une droite de direction n₁ × n₂. Piège : l\'équation d\'un plan n\'est pas unique (on peut la multiplier par un réel non nul).</p></div>'
});
SFA.figs("c07", [
  /* 1 norme */
  function(p){ var o = umb_v3(Math.min(W * 0.098, H * 0.130), 12, [1, -1.5, 3]); umb_ax3(o, 4, ['x', 'y', 'z']);
    var u = [2, -3, 6]; umb_L3(o, [0, 0, 0], [2, 0, 0], '#9bb3dd', 1.6, [4, 3]); umb_L3(o, [2, 0, 0], [2, -3, 0], '#9bb3dd', 1.6, [4, 3]); umb_L3(o, [2, -3, 0], u, '#9bb3dd', 1.6, [4, 3]);
    umb_A3(o, [0, 0, 0], u, BLUE, '', 3.2); umb_D3(o, u, BLUE, 'u', 5); umb_TB('u = (2 ; −3 ; 6)', W * .6, H * .12, INK, 12, 'left'); umb_TB('√(4 + 9 + 36)', W * .6, H * .26, GREY, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('‖u‖ = √49 = 7', W * .6, H * .4, DRED, 15, 'left'); ctx.globalAlpha = 1; } },
  /* 2 produit scalaire */
  function(p){ var o = umb_v3(Math.min(W * 0.091, H * 0.117), 18, [1.5, 1, 1.5]); umb_ax3(o, 4, ['x', 'y', 'z']); var u = [1, 2, -1], v = [3, 0, 4];
    umb_A3(o, [0, 0, 0], u, BLUE, 'u', 3); umb_A3(o, [0, 0, 0], v, VIOLET, 'v', 3);
    var k = umb_dotv(u, v) / umb_dotv(u, u), pr = [u[0] * k * p, u[1] * k * p, u[2] * k * p]; if (p > 0){ umb_L3(o, v, [u[0] * k, u[1] * k, u[2] * k], '#7ab8a0', 1.4, [4, 3]); umb_A3(o, [0, 0, 0], pr, GREEN, '', 4.5); }
    umb_TB('u·v = 3 + 0 − 4 = −1', W * .62, H * .14, p > .5 ? DRED : GREY, 14, 'left'); umb_TB('angle obtus : projection', W * .62, H * .26, GREY, 11, 'left'); umb_TB('dans le sens opposé à u', W * .62, H * .36, GREY, 11, 'left'); },
  /* 3 vecteur directeur */
  function(p){ var o = umb_v3(Math.min(W * 0.098, H * 0.130), 10, [2.5, 1, 4]); umb_ax3(o, 5, ['x', 'y', 'z']); var A = [1, 2, 3], B = [4, 0, 5];
    umb_L3(o, [-1, 4, 1], [6, -2, 7], '#c4cde3', 1.6, [5, 4]); umb_D3(o, A, BLUE, 'A', 5); umb_D3(o, B, VIOLET, 'B', 5);
    var u = umb_clamp(p, 0, 1); umb_A3(o, A, [A[0] + 3 * u, A[1] - 2 * u, A[2] + 2 * u], RED, '', 3.4); umb_TB('AB = B − A', W * .74, H * .16, INK, 13); if (p > .5) umb_TB('= (3 ; −2 ; 2)', W * .74, H * .3, DRED, 15); },
  /* 4 angle */
  function(p){ var o = umb_v3(Math.min(W * 0.098, H * 0.130), 22, [1, 1.5, 2]); umb_ax3(o, 4, ['x', 'y', 'z']); var u = [1, 2, 2], v = [2, 3, 6].map(function(x){ return x * .6; });
    umb_A3(o, [0, 0, 0], u, BLUE, 'u', 3); umb_A3(o, [0, 0, 0], v, VIOLET, 'v', 3);
    var e1 = u.map(function(x){ return x / 3; }), r = [v[0] - umb_dotv(v, e1) * e1[0], v[1] - umb_dotv(v, e1) * e1[1], v[2] - umb_dotv(v, e1) * e1[2]], nr = Math.sqrt(umb_dotv(r, r)), e2 = r.map(function(x){ return x / nr; }), th = Math.acos(20 / 21) * umb_clamp(p, 0, 1);
    var prev = null; for (var i = 0; i <= 12; i++){ var a = th * i / 12, q = [e1[0] * 1.6 * Math.cos(a) + e2[0] * 1.6 * Math.sin(a), e1[1] * 1.6 * Math.cos(a) + e2[1] * 1.6 * Math.sin(a), e1[2] * 1.6 * Math.cos(a) + e2[2] * 1.6 * Math.sin(a)]; if (prev) umb_L3(o, prev, q, RED, 2.6); prev = q; }
    umb_TB('cos θ = 20/21', W * .7, H * .2, INK, 14); if (p > .5) umb_TB('θ ≈ 17,8°', W * .7, H * .34, DRED, 16); },
  /* 5 produit vectoriel */
  function(p){ var o = umb_v3(Math.min(W * 0.098, H * 0.130), 10, [1, 1, 0]); umb_ax3(o, 4, ['x', 'y', 'z']); var u = [1, 2, 3], v = [2, -1, 0], w = [3, 6, -5].map(function(x){ return x * .45; });
    umb_poly3(o, [[0, 0, 0], u, [3, 1, 3], v], 'rgba(186,117,23,.18)', 'rgba(186,117,23,.7)'); umb_A3(o, [0, 0, 0], u, BLUE, 'u', 3); umb_A3(o, [0, 0, 0], v, VIOLET, 'v', 3);
    var s = umb_clamp(p, 0, 1); umb_A3(o, [0, 0, 0], w.map(function(x){ return x * s; }), RED, s > .8 ? 'u×v' : '', 3.4); umb_TB('u × v = (3 ; 6 ; −5)', W * .6, H * .12, p > .5 ? DRED : GREY, 13, 'left'); },
  /* 6 orthogonalité */
  function(p){ var o = umb_v3(Math.min(W * 0.098, H * 0.130), 20, [.5, .5, 0]); umb_ax3(o, 3.5, ['x', 'y', 'z']); var u = [2, 1, -2], v = [1, 2, 2];
    umb_A3(o, [0, 0, 0], u, BLUE, 'u', 3); umb_A3(o, [0, 0, 0], v, VIOLET, 'v', 3); var a = [.5, .25, -.5], b = [.25, .5, .5], c = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    umb_L3(o, a, c, RED, 1.8); umb_L3(o, b, c, RED, 1.8); umb_TB('2×1 + 1×2 + (−2)×2', W * .6, H * .16, INK, 12, 'left'); umb_TB('= 0', W * .6, H * .3, p > .3 ? DRED : GREY, 18, 'left'); umb_TB('u ⟂ v', W * .6, H * .46, p > .3 ? DRED : GREY, 16, 'left'); },
  /* 7 aire triangle */
  function(p){ var o = umb_v3(Math.min(W * 0.098, H * 0.130), 12, [2, 1.5, 2]); umb_ax3(o, 4, ['x', 'y', 'z']); var A = [1, 0, 2], B = [3, 1, 1], C = [2, 3, 4];
    umb_poly3(o, [A, B, C], 'rgba(55,138,221,.2)', BLUE); umb_D3(o, A, BLUE, 'A', 4); umb_D3(o, B, BLUE, 'B', 4); umb_D3(o, C, BLUE, 'C', 4);
    var m = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3]; var s = umb_clamp(p, 0, 1); umb_A3(o, m, [m[0] + .5 * s, m[1] - .5 * s, m[2] + .5 * s], RED, '', 3.4); umb_TB('AB × AC = (5 ; −5 ; 5)', W * .55, H * .12, INK, 12, 'left'); if (p > .4) umb_TB('aire = 5√3/2 ≈ 4,33', W * .55, H * .26, DRED, 15, 'left'); },
  /* 8 plan par 3 points */
  function(p){ var o = umb_v3(Math.min(W * 0.130, H * 0.169), 20, [.6, 1, 1.2]); umb_ax3(o, 3.5, ['x', 'y', 'z']); var A = [1, 0, 0], B = [0, 2, 0], C = [0, 0, 3];
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .6); umb_pp(o, [6, 3, 2], 6, 3.2, 'rgba(29,158,117,.12)', 'rgba(15,110,86,.4)'); ctx.globalAlpha = 1; }
    umb_poly3(o, [A, B, C], 'rgba(55,138,221,.22)', BLUE); umb_D3(o, A, RED, 'A', 5); umb_D3(o, B, RED, 'B', 5); umb_D3(o, C, RED, 'C', 5);
    umb_TB('n = AB × AC = (6 ; 3 ; 2)', W * .56, H * .12, INK, 12, 'left'); if (p > .3) umb_TB('6x + 3y + 2z = 6', W * .56, H * .26, DRED, 16, 'left'); },
  /* 9 distance point plan */
  function(p){ var o = umb_v3(Math.min(W * 0.111, H * 0.143), 15, [1, 1.5, 2]); umb_ax3(o, 4, ['x', 'y', 'z']); var n = [2, -1, 2], P = [1, 2, 3];
    umb_pp(o, n, 1, 3.2, 'rgba(29,158,117,.16)', 'rgba(15,110,86,.7)'); var k = (umb_dotv(n, P) - 1) / 9, F = [P[0] - n[0] * k, P[1] - n[1] * k, P[2] - n[2] * k];
    umb_D3(o, P, RED, 'P', 6); var s = umb_clamp(p, 0, 1), Q = [P[0] + (F[0] - P[0]) * s, P[1] + (F[1] - P[1]) * s, P[2] + (F[2] - P[2]) * s]; umb_L3(o, P, Q, DRED, 2.6, [5, 3]); if (s > .95) umb_D3(o, F, DRED, '', 4);
    umb_TB('2x − y + 2z = 1', W * .56, H * .12, DGREEN, 13, 'left'); if (p > .4) umb_TB('d = |5| / 3 = 5/3', W * .56, H * .26, DRED, 16, 'left'); },
  /* 10 faisceau */
  function(p){ var o = umb_v3(Math.min(W * 0.058, H * 0.078), 14, [0, 3, -2]); umb_ax3(o, 6, ['x', 'y', 'z']); umb_pp(o, [2, 1, -1], 7, 7, 'rgba(29,158,117,.16)', 'rgba(15,110,86,.7)');
    var A = [1, 2, 0]; function L(t){ return [1 + t, 2 - t, 2 * t]; } umb_L3(o, L(-4), L(1), BLUE, 2.8); umb_D3(o, A, BLUE, 'source', 5);
    var s = umb_clamp(p, 0, 1); umb_D3(o, L(-3 * s), RED, '', 7); if (s > .9) umb_D3(o, L(-3), RED, 'entrée (−2 ; 5 ; −6)', 7); umb_TB('2x + y − z = 7', W * .64, H * .12, DGREEN, 13, 'left'); umb_TB('t = −3', W * .64, H * .26, p > .5 ? DRED : GREY, 15, 'left'); },
  /* 11 distance point droite */
  function(p){ var o = umb_v3(Math.min(W * 0.104, H * 0.137), 16, [1.5, 1.5, 2.5]); umb_ax3(o, 4, ['x', 'y', 'z']); var A = [0, 0, 1], d = [1, 2, 2], P = [2, 1, 4], t = 10 / 9, F = [A[0] + d[0] * t, A[1] + d[1] * t, A[2] + d[2] * t];
    umb_L3(o, [-.8, -1.6, -.6], [2, 4, 5], BLUE, 2.6); umb_D3(o, A, BLUE, 'A', 4); umb_A3(o, A, [A[0] + d[0], A[1] + d[1], A[2] + d[2]], VIOLET, 'd', 2.6); umb_D3(o, P, RED, 'P', 6);
    var s = umb_clamp(p, 0, 1); umb_L3(o, P, [P[0] + (F[0] - P[0]) * s, P[1] + (F[1] - P[1]) * s, P[2] + (F[2] - P[2]) * s], DRED, 2.6, [5, 3]); if (s > .9) umb_D3(o, F, DRED, '', 4); umb_TB('‖AP × d‖ / ‖d‖', W * .6, H * .12, INK, 13, 'left'); if (p > .4) umb_TB('= √26 / 3 ≈ 1,70', W * .6, H * .26, DRED, 15, 'left'); },
  /* 12 droites gauches */
  function(p){ var o = umb_v3(Math.min(W * 0.130, H * 0.182), 20, [0, 0, 1]); umb_ax3(o, 3, ['x', 'y', 'z']); function L1(s){ return [1 + s, 2 * s, 0]; } function L2(t){ return [0, 1 + t, 2 + t]; }
    umb_L3(o, L1(-2.2), L1(1.6), BLUE, 2.8); umb_L3(o, L2(-3.2), L2(.9), VIOLET, 2.8); umb_TB('D₁', o.cx + 120, H * .85, BLUE_D, 14); umb_TB('D₂', o.cx - 120, H * .2, '#5249B5', 14);
    var s = -2 / 3, t = -13 / 6, a = L1(s), b = L2(t), u = umb_clamp(p, 0, 1); umb_L3(o, a, [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u], RED, 3.4); umb_D3(o, a, RED, '', 4); umb_D3(o, b, RED, '', 4);
    umb_TB('n = d₁ × d₂ = (2 ; −1 ; 1)', W * .52, H * .1, INK, 12, 'left'); if (p > .3) umb_TB('distance = 1/√6 ≈ 0,41', W * .52, H * .24, DRED, 14, 'left'); },
  /* 13 tétraèdre */
  function(p){ var o = umb_v3(Math.min(W * 0.104, H * 0.143), 12, [2, 2, 2]); umb_ax3(o, 4, ['x', 'y', 'z']); var A = [1, 1, 0], B = [3, 1, 1], C = [2, 4, 1], D = [2, 2, 5];
    umb_poly3(o, [A, B, C], 'rgba(55,138,221,.22)', BLUE); [[A, D], [B, D], [C, D]].forEach(function(e){ umb_L3(o, e[0], e[1], '#b08a50', 1.8); }); umb_poly3(o, [A, B, D], 'rgba(186,117,23,.08)', null); umb_poly3(o, [B, C, D], 'rgba(186,117,23,.08)', null);
    umb_D3(o, A, BLUE, 'A', 4); umb_D3(o, B, BLUE, 'B', 4); umb_D3(o, C, BLUE, 'C', 4); umb_D3(o, D, RED, 'D', 6); umb_TB('V = |(AB × AC)·AD| / 6', W * .58, H * .12, INK, 12, 'left'); if (p > .3) umb_TB('= 13/3 ≈ 4,33 cm³', W * .58, H * .26, DRED, 13, 'left'); },
  /* 14 Lagrange */
  function(p){ var ox = W * .12, oy = H * .78, L = Math.min(W * .62, H * 1.3), th = 0.9, hy = L * Math.cos(th), vy = L * Math.sin(th);
    LN(ox, oy, ox + L, oy, GREY, 1.4); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + hy, oy); ctx.lineTo(ox + hy, oy - vy); ctx.closePath(); ctx.fillStyle = 'rgba(55,138,221,.1)'; ctx.fill();
    A(ox, oy, hy, 0, RED, '', 3); A(ox + hy, oy, 0, -vy, DGREEN, '', 3); A(ox, oy, hy, -vy, BLUE, '', 3);
    umb_TB('|u·v|', ox + hy / 2, oy + 20, DRED, 14); umb_TB('‖u × v‖', ox + hy + 12, oy - vy / 2, DGREEN, 14, 'left'); umb_TB('‖u‖‖v‖', ox + hy / 2 - 30, oy - vy / 2 - 12, BLUE_D, 14); ctx.strokeStyle = VIOLET; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ox, oy, 30, 0, -th, true); ctx.stroke(); umb_TB('θ', ox + 40, oy - 12, VIOLET, 14);
    umb_TB('‖u × v‖² + (u·v)² = ‖u‖²‖v‖²', W * .52, H * .12, INK, 12, 'left'); if (p > .3) umb_TB('(sin²θ + cos²θ = 1)', W * .52, H * .26, DRED, 14, 'left'); }
]);
