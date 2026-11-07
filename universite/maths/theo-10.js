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


function umb_f(x){ return nfmt(Math.round(x * 100) / 100); }
var UM10_ST = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
function um10_cm(u, br){ u = Math.max(0, Math.min(1, u)); var x = u * 4, i = Math.min(3, Math.floor(x)), t = x - i, a = UM10_ST[i], b = UM10_ST[i + 1], k = br || 1; return 'rgb(' + Math.min(255, Math.round((a[0] + (b[0] - a[0]) * t) * k)) + ',' + Math.min(255, Math.round((a[1] + (b[1] - a[1]) * t) * k)) + ',' + Math.min(255, Math.round((a[2] + (b[2] - a[2]) * t) * k)) + ')'; }
/* surface z = f(x, y) en facettes triées ; o = repère 3D (umb_P), [x0,x1]×[y0,y1], zr = [zmin, zmax] */
function um10_surf(o, f, x0, x1, y0, y1, n, zr, zs, zc){ var G = [], Q = [], i, j; zs = zs || 1; zc = zc || 0;
  for (i = 0; i <= n; i++){ G.push([]); for (j = 0; j <= n; j++){ var x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * j / n, z = f(x, y); G[i].push({x:x, y:y, z:z, p:umb_P(o, x, y, (z - zc) * zs)}); } }
  for (i = 0; i < n; i++) for (j = 0; j < n; j++) Q.push([i, j, G[i][j].p.d + G[i + 1][j + 1].p.d]);
  Q.sort(function(a, b){ return b[2] - a[2]; });
  Q.forEach(function(q){ var a = G[q[0]][q[1]], b = G[q[0] + 1][q[1]], c = G[q[0] + 1][q[1] + 1], d = G[q[0]][q[1] + 1], zm = (a.z + b.z + c.z + d.z) / 4, sh = 0.72 + 0.3 * Math.max(0, Math.min(1, 0.5 + ((b.z - a.z) + (c.z - d.z)) * 0.05 * -1));
    ctx.beginPath(); ctx.moveTo(a.p.x, a.p.y); ctx.lineTo(b.p.x, b.p.y); ctx.lineTo(c.p.x, c.p.y); ctx.lineTo(d.p.x, d.p.y); ctx.closePath(); ctx.fillStyle = um10_cm((zm - zr[0]) / (zr[1] - zr[0]), sh); ctx.fill(); ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .7; ctx.stroke(); }); }
/* lignes de niveau d'une fonction dans un repère 2D m = {X, Y} (marching squares) */
function um10_cont(m, f, xr, yr, levels, col, w, n){ n = n || 56; var Z = [], i, j; for (i = 0; i <= n; i++){ Z.push([]); for (j = 0; j <= n; j++) Z[i].push(f(-xr + 2 * xr * i / n, -yr + 2 * yr * j / n)); }
  ctx.strokeStyle = col; ctx.lineWidth = w || 1.4; ctx.beginPath();
  levels.forEach(function(lev){ for (i = 0; i < n; i++) for (j = 0; j < n; j++){ var xa = -xr + 2 * xr * i / n, xb = -xr + 2 * xr * (i + 1) / n, ya = -yr + 2 * yr * j / n, yb = -yr + 2 * yr * (j + 1) / n, a = Z[i][j], b = Z[i + 1][j], c = Z[i + 1][j + 1], d = Z[i][j + 1], P = [];
      function ip(u, v, x1, y1, x2, y2){ var t = (lev - u) / (v - u); P.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]); }
      if ((a < lev) !== (b < lev)) ip(a, b, xa, ya, xb, ya); if ((b < lev) !== (c < lev)) ip(b, c, xb, ya, xb, yb); if ((d < lev) !== (c < lev)) ip(d, c, xa, yb, xb, yb); if ((a < lev) !== (d < lev)) ip(a, d, xa, ya, xa, yb);
      if (P.length === 2){ ctx.moveTo(m.X(P[0][0]), m.Y(P[0][1])); ctx.lineTo(m.X(P[1][0]), m.Y(P[1][1])); } else if (P.length === 4){ ctx.moveTo(m.X(P[0][0]), m.Y(P[0][1])); ctx.lineTo(m.X(P[3][0]), m.Y(P[3][1])); ctx.moveTo(m.X(P[1][0]), m.Y(P[1][1])); ctx.lineTo(m.X(P[2][0]), m.Y(P[2][1])); } } }); ctx.stroke(); }
function um10_clip(x, y, w, h){ ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }

SFA.theo("c10", {
  icon: function(){
    ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0, 0, W, H);
    var o = {cx:W * .3, cy:H * .58, s:H * .1, az:.75, el:.55}; um10_surf(o, function(x, y){ return 2.4 * Math.exp(-(x * x + y * y) / 2.2); }, -3, 3, -3, 3, 22, [0, 2.4], 1.1, 1.0);
    TB('f(x ; y)', W * .6, H * .28, BLUE_D, 28, 'left'); TB('∂f/∂x   ∂f/∂y', W * .6, H * .5, DRED, 20, 'left'); TB('∇f', W * .6, H * .7, DGREEN, 26, 'left'); TB('z = f(x ; y)', W * .6, H * .88, ORANGE, 16, 'left');
  },
  anim: function(t){
    var o = {cx:W * .3, cy:H * .6, s:Math.min(W * .055, H * .12), az:.6 + .5 * Math.sin(t * .008), el:.55}; var cz = .5 + .5 * Math.sin(t * .02), c = .3 + 1.9 * cz, f = function(x, y){ return 2.4 * Math.exp(-(x * x + y * y) / 2.2); };
    um10_surf(o, f, -3.4, 3.4, -3.4, 3.4, 22, [0, 2.4], 1.1, 1.0); var zc = (c - 1.0) * 1.1, i;
    umb_poly3(o, [[-3.4, -3.4, zc], [3.4, -3.4, zc], [3.4, 3.4, zc], [-3.4, 3.4, zc]], 'rgba(226,75,74,.14)', 'rgba(226,75,74,.55)');
    var r = Math.sqrt(2.2 * Math.log(2.4 / c)); ctx.strokeStyle = RED; ctx.lineWidth = 3.2; ctx.beginPath(); for (i = 0; i <= 80; i++){ var q = i / 80 * 2 * Math.PI, p = umb_P(o, r * Math.cos(q), r * Math.sin(q), zc); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); } ctx.stroke();
    var x0 = W * .6; umb_TB('plan z = c, c = ' + umb_f(c), x0, H * .14, DRED, 12, 'left'); umb_TB('courbe de niveau :', x0, H * .32, INK, 12, 'left'); umb_TB('cercle de rayon ' + umb_f(r), x0, H * .46, DRED, 12, 'left');
    var m = {X:function(x){ return x0 + 62 + x * 18; }, Y:function(y){ return H * .78 - y * 18; }}; ctx.strokeStyle = '#d8dce3'; ctx.strokeRect(x0 + 62 - 3.4 * 18, H * .78 - 3.4 * 18, 6.8 * 18, 6.8 * 18);
    for (i = 1; i < 6; i++){ var rr = Math.sqrt(2.2 * Math.log(2.4 / (.4 * i))); ctx.strokeStyle = 'rgba(15,27,45,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), rr * 18, 0, 7); ctx.stroke(); } ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), r * 18, 0, 7); ctx.stroke(); umb_note('Fais tourner la scène à la souris', W * .3, H * .08, GREY, 10);
  },
  th: '<div class="tcard"><b class="h">1. Fonctions de deux variables, graphe et niveaux</b><p>Une fonction f : D ⊂ ℝ² → ℝ associe un réel z = f(x ; y) à chaque point du domaine D (à déterminer : dénominateur ≠ 0, radicande ≥ 0, argument du logarithme > 0). Son <b>graphe</b> est la surface z = f(x ; y) de ℝ³. Une <b>courbe de niveau</b> c est l\'ensemble {(x ; y) : f(x ; y) = c} : une coupe de la surface par le plan horizontal z = c, vue de dessus. Courbes serrées = pente forte.</p><p>Exemples : x² + y² (paraboloïde, niveaux = cercles), x² − y² (selle, niveaux = hyperboles), √(9 − x² − y²) (demi-sphère sur un disque de rayon 3).</p></div>' +
    '<div class="tcard"><b class="h">2. Dérivées partielles et plan tangent</b><p><b>∂f/∂x</b> = dérivée de f par rapport à x en <b>gardant y constant</b> (pente de la coupe y = cte) ; de même ∂f/∂y. Définition : ∂f/∂x(a ; b) = lim [f(a + h ; b) − f(a ; b)]/h. Toutes les règles à une variable s\'appliquent (produit, chaîne). Exemple : f = x²y³ donne f_x = 2xy³, f_y = 3x²y².</p><p><b>Plan tangent</b> en (a ; b) : z = f(a ; b) + f_x(a ; b)(x − a) + f_y(a ; b)(y − b). Il donne l\'approximation linéaire f(a + h ; b + k) ≈ f(a ; b) + f_x h + f_y k. Dérivées secondes : f_xx, f_yy, f_xy = f_yx (théorème de Schwarz si elles sont continues).</p></div>' +
    '<div class="tcard"><b class="h">3. Gradient et dérivée directionnelle</b><p>Le <b>gradient</b> ∇f = (f_x ; f_y) est un vecteur du plan (x ; y). La dérivée de f dans la direction du vecteur <b>unitaire</b> u est <b>D_u f = ∇f · u = ‖∇f‖ cos α</b> (α = angle entre u et ∇f). Donc : la croissance est la plus rapide dans la direction de ∇f (pente ‖∇f‖), la décroissance la plus rapide dans celle de −∇f, et f est constante (D_u f = 0) dans les directions perpendiculaires, c\'est-à-dire le long de la courbe de niveau : <b>∇f ⟂ courbe de niveau</b>.</p><p>Exemple : f = x² + 3xy en (1 ; 2) : ∇f = (8 ; 3) ; avec u = (3 ; 4)/5, D_u f = 7,2 ; pente maximale √73 ≈ 8,54.</p></div>' +
    '<div class="tcard"><b class="h">4. Extrema libres : points critiques et hessienne</b><p>Un extremum local à l\'intérieur du domaine est un <b>point critique</b> : ∇f = 0. Pour le classer, on calcule la hessienne H = [[f_xx ; f_xy] ; [f_xy ; f_yy]] et D = det H = f_xx f_yy − f_xy². <b>D > 0 et f_xx > 0</b> : minimum local ; <b>D > 0 et f_xx < 0</b> : maximum local ; <b>D < 0</b> : point-selle (col) ; D = 0 : on ne peut pas conclure.</p><p>Méthode : (1) résoudre f_x = f_y = 0 ; (2) calculer D en chaque point ; (3) conclure ; (4) sur un domaine fermé borné, comparer aussi aux valeurs sur le bord. Exemple : f = x³ + y³ − 3xy a un col en (0 ; 0) et un minimum local en (1 ; 1).</p></div>' +
    '<div class="tcard"><b class="h">5. Extrema liés : multiplicateurs de Lagrange</b><p>Pour optimiser f sous une contrainte g(x ; y) = c, on cherche les points où <b>∇f = λ∇g</b> et g = c : la courbe de niveau de f est <b>tangente</b> à la contrainte (gradients parallèles). Système de trois équations à trois inconnues (x, y, λ) ; on compare ensuite les valeurs de f aux candidats. Sur une courbe fermée et bornée, f continue atteint son maximum et son minimum.</p><p>Exemple : maximiser x²y sur x² + y² = 3 : 2xy = 2λx, x² = 2λy donnent y = ±1, x² = 2 ; maximum 2 en (±√2 ; 1), minimum −2 en (±√2 ; −1). Application : boîte de volume donné de surface minimale.</p></div>'
});
SFA.figs("c10", [
  /* 1 domaine : disque */
  function(p){ var m = umb_pl(4.6, 3.8, {ox:W * .3, oy:H * .52, k:Math.min(W / 10.5, H / 8.2), step:1, xl:'x', yl:'y'});
    ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), 3 * m.k, 0, 7); ctx.fillStyle = 'rgba(55,138,221,' + (.12 + .12 * p) + ')'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.6; ctx.stroke();
    DOT(m.X(1), m.Y(1.5), 5, DGREEN); DOT(m.X(2.6), m.Y(2.6), 5, RED); umb_TB('dedans', m.X(1) + 8, m.Y(1.5) + 16, DGREEN, 11, 'left'); umb_TB('dehors', m.X(2.6) + 8, m.Y(2.6) + 16, DRED, 11, 'left');
    umb_TB('f = √(9 − x² − y²)', W * .66, H * .14, INK, 12, 'left'); umb_TB('x² + y² ≤ 9', W * .66, H * .3, BLUE_D, 14, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('disque de rayon 3', W * .66, H * .5, DRED, 13, 'left'); ctx.globalAlpha = 1; } },
  /* 2 courbe de niveau f = 4 */
  function(p){ var m = umb_pl(3.2, 5.6, {ox:W * .4, oy:H * .8, k:Math.min(W / 8, H / 8.2), step:1, xl:'x', yl:'y'}); var cs = [0, 2, 6], i; ctx.save(); um10_clip(0, 0, W, H);
    cs.forEach(function(c){ ctx.strokeStyle = 'rgba(55,138,221,.35)'; ctx.lineWidth = 1.6; ctx.beginPath(); for (i = -32; i <= 32; i++){ var x = i / 10, px = m.X(x), py = m.Y(c - 2 * x * x); if (i === -32) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); });
    ctx.strokeStyle = RED; ctx.lineWidth = 3.2; ctx.globalAlpha = .35 + .65 * umb_clamp(p, 0, .4); ctx.beginPath(); for (i = -32; i <= 32; i++){ var x2 = i / 10, px2 = m.X(x2), py2 = m.Y(4 - 2 * x2 * x2); if (i === -32) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2); } ctx.stroke(); ctx.globalAlpha = 1; ctx.restore();
    DOT(m.X(1), m.Y(-3), 5.5, VIOLET); umb_TB('(1 ; −3)', m.X(1) + 8, m.Y(-3) + 18, VIOLET, 12, 'left'); umb_TB('f = 2x² + y', W * .62, H * .14, INK, 13, 'left'); umb_TB('f(1 ; −3) = −1', W * .62, H * .3, VIOLET, 12, 'left'); umb_TB('niveau 4 : y = 4 − 2x²', W * .62, H * .46, DRED, 12, 'left'); },
  /* 3 dérivée partielle */
  function(p){ umb_TB('f(x ; y) = x² · y³', W * .5, H * .26, INK, 20); umb_TB('x varie', W * .27, H * .52, RED, 14); umb_TB('y reste constant', W * .62, H * .52, GREY, 14);
    ctx.strokeStyle = 'rgba(226,75,74,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * .3, H * .31); ctx.lineTo(W * .27, H * .45); ctx.stroke(); ctx.strokeStyle = 'rgba(154,160,166,.7)'; ctx.beginPath(); ctx.moveTo(W * .62, H * .31); ctx.lineTo(W * .62, H * .45); ctx.stroke();
    if (p <= 0) umb_TB('∂f/∂x = ?', W * .5, H * .74, BLUE_D, 18); else { ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('∂f/∂x = 2x · y³', W * .5, H * .74, DRED, 20); ctx.globalAlpha = 1; } },
  /* 4 f_x, f_y */
  function(p){ umb_TB('f = x·e^(xy) + y²', W * .5, H * .2, INK, 18); var y0 = H * .42; umb_TB('∂f/∂x : produit  →  (1 + xy)·e^(xy)', W * .06, y0, RED, 13, 'left'); umb_TB('∂f/∂y : x constant  →  x²·e^(xy) + 2y', W * .06, y0 + 34, BLUE_D, 13, 'left');
    DOT(W * .1, H * .78, 4, VIOLET); umb_TB('en (1 ; 0)', W * .14, H * .8, VIOLET, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('f_x = 1', W * .42, H * .8, DRED, 15, 'left'); umb_TB('f_y = 1', W * .68, H * .8, DRED, 15, 'left'); ctx.globalAlpha = 1; } },
  /* 5 plan tangent */
  function(p){ var o = umb_v3(Math.min(W * .1, H * .15), 10, [1, 1, 1]); o.cx = W * .33; umb_ax3(o, 2.6, ['x', 'y', 'z']); um10_surf(o, function(x, y){ return x * x + x * y + y * y; }, -.2, 2.2, -.2, 2.2, 14, [0, 14.5], .3, 3);
    var f0 = 3; function pl(x, y){ return 3 * x + 3 * y - 3; } var q = [[.2, .2], [1.8, .2], [1.8, 1.8], [.2, 1.8]].map(function(a){ return [a[0], a[1], (pl(a[0], a[1]) - 3) * .3]; });
    umb_poly3(o, q.map(function(a){ return [a[0], a[1], a[2]]; }), 'rgba(226,75,74,' + (.08 + .22 * p) + ')', 'rgba(226,75,74,.8)'); umb_D3(o, [1, 1, 0], RED, '(1 ; 1)', 5);
    umb_TB('f = x² + xy + y²', W * .62, H * .14, INK, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('plan tangent :', W * .62, H * .34, DRED, 12, 'left'); umb_TB('z = 3x + 3y − 3', W * .62, H * .48, DRED, 14, 'left'); ctx.globalAlpha = 1; } },
  /* 6 selle : niveaux */
  function(p){ var m = umb_pl(3.4, 3.4, {ox:W * .4, oy:H * .52, k:Math.min(W / 8.4, H / 7.2), step:1, xl:'x', yl:'y'}); ctx.save(); um10_clip(m.X(-3.4), m.Y(3.4), 6.8 * m.k, 6.8 * m.k);
    um10_cont(m, function(x, y){ return x * x - y * y; }, 3.4, 3.4, [-4, -2, -1, 1, 2, 4], 'rgba(55,138,221,.7)', 1.6); ctx.strokeStyle = RED; ctx.lineWidth = 3.4; ctx.globalAlpha = .4 + .6 * umb_clamp(p, 0, .4); ctx.beginPath(); ctx.moveTo(m.X(-3.4), m.Y(-3.4)); ctx.lineTo(m.X(3.4), m.Y(3.4)); ctx.moveTo(m.X(-3.4), m.Y(3.4)); ctx.lineTo(m.X(3.4), m.Y(-3.4)); ctx.stroke(); ctx.globalAlpha = 1; ctx.restore();
    umb_TB('f = x² − y²', W * .72, H * .14, INK, 12, 'left'); umb_TB('niveau 0 :', W * .72, H * .34, DRED, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('y = x et y = −x', W * .72, H * .48, DRED, 12, 'left'); ctx.globalAlpha = 1; } },
  /* 7 dérivée directionnelle */
  function(p){ var m = umb_pl(3.2, 3.2, {ox:W * .3, oy:H * .52, k:Math.min(W / 8.2, H / 7), step:1, xl:'x', yl:'y'}); ctx.save(); um10_clip(m.X(-3.2), m.Y(3.2), 6.4 * m.k, 6.4 * m.k); um10_cont(m, function(x, y){ return x * x + 3 * x * y; }, 3.2, 3.2, [-6, -3, 0, 3, 6, 9, 12, 15], 'rgba(55,138,221,.45)', 1.4); um10_cont(m, function(x, y){ return x * x + 3 * x * y; }, 3.2, 3.2, [7], 'rgba(15,27,45,.8)', 2); ctx.restore();
    umb_vec(m, 1 + 8 * .15, 2 + 3 * .15, RED, '', 3.2, 1, 2); umb_vec(m, 1 + .6 * 1.3, 2 + .8 * 1.3, BLUE, '', 3, 1, 2); DOT(m.X(1), m.Y(2), 5.5, INK); umb_TB('∇f', m.X(2.25), m.Y(2.52) - 8, DRED, 12, 'left'); umb_TB('u', m.X(1.9), m.Y(3.2) - 10, BLUE_D, 12, 'left');
    umb_TB('f = x² + 3xy', W * .6, H * .14, INK, 12, 'left'); umb_TB('∇f(1 ; 2) = (8 ; 3)', W * .6, H * .3, DRED, 12, 'left'); umb_TB('u = (3 ; 4)/5', W * .6, H * .44, BLUE_D, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('D_u f = 36/5 = 7,2', W * .6, H * .62, DRED, 14, 'left'); ctx.globalAlpha = 1; } },
  /* 8 température : ellipses */
  function(p){ var m = umb_pl(4.6, 3.4, {ox:W * .3, oy:H * .52, k:Math.min(W / 10.4, H / 7.4), step:1, xl:'x', yl:'y'}); [3, 6, 9, 12].forEach(function(r2, i){ ctx.strokeStyle = 'rgba(' + (226 - i * 30) + ',' + (75 + i * 24) + ',' + (74 + i * 28) + ',.75)'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(m.X(0), m.Y(0), Math.sqrt(r2) * m.k, Math.sqrt(r2 / 2) * m.k, 0, 0, 7); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(15,27,45,.85)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(m.X(0), m.Y(0), Math.sqrt(3) * m.k, Math.sqrt(1.5) * m.k, 0, 0, 7); ctx.stroke(); DOT(m.X(1), m.Y(1), 6, INK); umb_TB('T = 20 − x² − 2y²', W * .64, H * .14, INK, 11, 'left');
    umb_vec(m, 1 - .7, 1 - 1.4, RED, '', 3.2, 1, 1); umb_TB('∇T', m.X(.3) - 22, m.Y(-.4) + 4, DRED, 11, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_vec(m, 1 + .7, 1 + 1.4, DGREEN, '', 3.6, 1, 1); umb_vec(m, 1 + 1.4, 1 - .7, GREY, '', 3, 1, 1); umb_TB('−∇T', m.X(1.7) + 4, m.Y(2.4) - 8, DGREEN, 12, 'left'); umb_TB('plus forte baisse : −∇T', W * .64, H * .6, DGREEN, 11, 'left'); umb_TB('T constante : ⟂ ∇T', W * .64, H * .76, GREY, 11, 'left'); ctx.globalAlpha = 1; } },
  /* 9 hessienne : selle quadratique */
  function(p){ var m = umb_pl(3.4, 3.4, {ox:W * .38, oy:H * .52, k:Math.min(W / 8.8, H / 7.2), step:1, xl:'x', yl:'y'}); ctx.save(); um10_clip(m.X(-3.4), m.Y(3.4), 6.8 * m.k, 6.8 * m.k);
    um10_cont(m, function(x, y){ return x * x - 4 * x * y + y * y; }, 3.4, 3.4, [-12, -6, -3, 3, 6, 12, 20], 'rgba(55,138,221,.65)', 1.5); ctx.restore(); DOT(m.X(0), m.Y(0), 6, RED);
    umb_TB('f = x² − 4xy + y²', W * .64, H * .14, INK, 10, 'left'); umb_TB('H = [[2 ; −4] ; [−4 ; 2]]', W * .64, H * .3, BLUE_D, 10, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('D = −12 < 0', W * .64, H * .48, DRED, 11, 'left'); umb_TB('point-selle', W * .64, H * .62, DRED, 14, 'left'); LN(m.X(-3.4), m.Y(-3.4), m.X(3.4), m.Y(3.4), 'rgba(226,75,74,.55)', 2, [6, 4]); ctx.globalAlpha = 1; } },
  /* 10 x³ + y³ − 3xy */
  function(p){ var m = umb_pl(2.4, 2.4, {ox:W * .34, oy:H * .52, k:Math.min(W / 6.2, H / 5.4), step:1, xl:'x', yl:'y'}); ctx.save(); um10_clip(m.X(-2.4), m.Y(2.4), 4.8 * m.k, 4.8 * m.k);
    um10_cont(m, function(x, y){ return x * x * x + y * y * y - 3 * x * y; }, 2.4, 2.4, [-.8, -.4, .5, 1.5, 3, 6], 'rgba(55,138,221,.6)', 1.5); um10_cont(m, function(x, y){ return x * x * x + y * y * y - 3 * x * y; }, 2.4, 2.4, [0], 'rgba(15,27,45,.7)', 2); ctx.restore();
    ctx.globalAlpha = .3 + .7 * umb_clamp(p, 0, .4); DOT(m.X(0), m.Y(0), 7, ORANGE); DOT(m.X(1), m.Y(1), 7, BLUE_D); umb_TB('col', m.X(0) - 18, m.Y(0) + 18, ORANGE, 11); umb_TB('minimum', m.X(1) + 8, m.Y(1) - 10, BLUE_D, 11, 'left'); ctx.globalAlpha = 1;
    umb_TB('f = x³ + y³ − 3xy', W * .64, H * .14, INK, 11, 'left'); umb_TB('f_x = f_y = 0', W * .64, H * .3, GREY, 11, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('(0 ; 0) : D = −9', W * .64, H * .48, ORANGE, 12, 'left'); umb_TB('(1 ; 1) : D = 27, f = −1', W * .64, H * .62, BLUE_D, 12, 'left'); ctx.globalAlpha = 1; } },
  /* 11 D = 0 : trois cas */
  function(p){ var gx = [W * .17, W * .5, W * .83], i, labs = ['x⁴', '−x⁴', 'x³'], cols = [BLUE, RED, ORANGE], nat = ['minimum', 'maximum', 'ni l\'un ni l\'autre'];
    for (i = 0; i < 3; i++){ var cx = gx[i], cy = H * .46, sx = W * .085, sy = H * .22; LN(cx - W * .13, cy, cx + W * .13, cy, AX, 1.2); LN(cx, cy - H * .3, cx, cy + H * .3, AX, 1.2); ctx.strokeStyle = cols[i]; ctx.lineWidth = 3; ctx.beginPath(); for (var j = -20; j <= 20; j++){ var x = j / 20 * 1.4, y = i === 0 ? x * x * x * x : i === 1 ? -x * x * x * x : x * x * x * .9; var px = cx + x * sx * 1.1, py = cy - y * sy * (i === 2 ? 1 : 1.2) * .8; if (j === -20) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); DOT(cx, cy, 5, INK); umb_TB(labs[i], cx, H * .18, cols[i], 14); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB(nat[i], cx, H * .84, cols[i], 11); ctx.globalAlpha = 1; } }
    umb_TB('dans les trois cas : f_xx = 0 et D = 0 en (0 ; 0)', W * .5, H * .95, GREY, 10); },
  /* 12 boîte */
  function(p){ var o = umb_v3(Math.min(W * .075, H * .12), 14, [2, 2, 1]); o.cx = W * .3; var a = 4, h = 2; function box(f, s){ var v = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0], [0, 0, h], [a, 0, h], [a, a, h], [0, a, h]]; umb_poly3(o, [v[0], v[1], v[2], v[3]], f, s); umb_poly3(o, [v[0], v[1], v[5], v[4]], f, s); umb_poly3(o, [v[1], v[2], v[6], v[5]], f, s); umb_poly3(o, [v[2], v[3], v[7], v[6]], f, s); umb_poly3(o, [v[3], v[0], v[4], v[7]], f, s); }
    box('rgba(186,117,23,.16)', 'rgba(186,117,23,.8)'); umb_TB('x', umb_P(o, 2, -.3, 0).x, umb_P(o, 2, -.3, 0).y + 14, BLUE_D, 13); umb_TB('y', umb_P(o, a + .4, 2, 0).x + 8, umb_P(o, a + .4, 2, 0).y + 6, BLUE_D, 13); umb_TB('z', umb_P(o, 0, 0, h / 2).x - 14, umb_P(o, 0, 0, h / 2).y, BLUE_D, 13);
    umb_TB('V = xyz = 32', W * .62, H * .14, INK, 12, 'left'); umb_TB('S = xy + 64/x + 64/y', W * .62, H * .3, BLUE_D, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('x = y = 4, z = 2', W * .62, H * .5, DRED, 14, 'left'); umb_TB('S min = 48 dm²', W * .62, H * .66, DRED, 14, 'left'); ctx.globalAlpha = 1; } },
  /* 13 Lagrange x²y */
  function(p){ var m = umb_pl(2.6, 2.6, {ox:W * .34, oy:H * .52, k:Math.min(W / 6.8, H / 5.6), step:1, xl:'x', yl:'y'}); ctx.save(); um10_clip(m.X(-2.6), m.Y(2.6), 5.2 * m.k, 5.2 * m.k); um10_cont(m, function(x, y){ return x * x * y; }, 2.6, 2.6, [-4, -2, -1, 1, 2, 4], 'rgba(55,138,221,.4)', 1.4); um10_cont(m, function(x, y){ return x * x * y; }, 2.6, 2.6, [2], 'rgba(226,75,74,.9)', 2.6); um10_cont(m, function(x, y){ return x * x * y; }, 2.6, 2.6, [-2], 'rgba(226,75,74,.9)', 2.6); ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.8; ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), Math.sqrt(3) * m.k, 0, 7); ctx.stroke();
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); [[1.4142, 1, DRED], [-1.4142, 1, DRED], [1.4142, -1, BLUE_D], [-1.4142, -1, BLUE_D]].forEach(function(q){ DOT(m.X(q[0]), m.Y(q[1]), 6, q[2]); }); umb_TB('max = 2', m.X(0), m.Y(1.5) - 22, DRED, 12); umb_TB('min = −2', m.X(0), m.Y(-1.5) + 28, BLUE_D, 12); ctx.globalAlpha = 1; }
    umb_TB('f = x²y', W * .66, H * .14, INK, 12, 'left'); umb_TB('x² + y² = 3', W * .66, H * .3, INK, 12, 'left'); umb_TB('∇f = λ∇g', W * .66, H * .46, DGREEN, 13, 'left'); },
  /* 14 disque */
  function(p){ var m = umb_pl(3, 2.6, {ox:W * .27, oy:H * .52, k:Math.min(W / 8.4, H / 5.6), step:1, xl:'x', yl:'y'}); ctx.beginPath(); ctx.arc(m.X(0), m.Y(0), Math.SQRT2 * m.k, 0, 7); ctx.fillStyle = 'rgba(55,138,221,.14)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.6; ctx.stroke();
    [-2, 0].forEach(function(c){ LN(m.X(-2.2), m.Y(c + 2.2), m.X(2.2), m.Y(c - 2.2), 'rgba(15,27,45,.3)', 1.2, [4, 3]); }); LN(m.X(-.4), m.Y(2.4), m.X(2.4), m.Y(-.4), RED, 2.8); umb_vec(m, 1 + .55, 1 + .55, DRED, '', 3.2, 1, 1); DOT(m.X(1), m.Y(1), 6.5, RED);
    umb_TB('x + y = 2', m.X(1.9), m.Y(.4) + 14, DRED, 11, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('max = 2 en (1 ; 1)', W * .66, H * .62, DRED, 13, 'left'); ctx.globalAlpha = 1; }
    umb_TB('f = x + y', W * .66, H * .14, INK, 12, 'left'); umb_TB('x² + y² ≤ 2', W * .66, H * .3, BLUE_D, 12, 'left'); umb_TB('∇f = (1 ; 1) ≠ 0', W * .66, H * .45, GREY, 11, 'left'); }
]);
