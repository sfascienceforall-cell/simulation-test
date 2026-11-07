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


function um8_mat(rows, x, y, cw, rh, col, sz, br){ var n = rows.length, m = rows[0].length, w = m * cw, h = n * rh, i, j;
  umb_TB('', x, y, col, sz);
  LN(x + 4, y - rh * .7, x, y - rh * .7, col || INK, 2); LN(x, y - rh * .7, x, y - rh * .7 + h, col || INK, 2); LN(x, y - rh * .7 + h, x + 4, y - rh * .7 + h, col || INK, 2);
  LN(x + w - 4, y - rh * .7, x + w, y - rh * .7, col || INK, 2); LN(x + w, y - rh * .7, x + w, y - rh * .7 + h, col || INK, 2); LN(x + w, y - rh * .7 + h, x + w - 4, y - rh * .7 + h, col || INK, 2);
  for (i = 0; i < n; i++) for (j = 0; j < m; j++){ var c = br && br[i] && br[i][j] ? br[i][j] : (col || INK); umb_TB(String(rows[i][j]), x + cw * (j + .5), y + i * rh + 4, c, sz); } }
function um8_grid(m, a, b, c, d, col, n, fill){ /* image du carré unité et de la grille par [[a b][c d]] */
  var i; for (i = -n; i <= n; i++){ LN(m.X(a * i - b * n), m.Y(c * i - d * n), m.X(a * i + b * n), m.Y(c * i + d * n), 'rgba(120,130,150,.25)', 1); LN(m.X(a * -n + b * i), m.Y(c * -n + d * i), m.X(a * n + b * i), m.Y(c * n + d * i), 'rgba(120,130,150,.25)', 1); }
  ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(a), m.Y(c)); ctx.lineTo(m.X(a + b), m.Y(c + d)); ctx.lineTo(m.X(b), m.Y(d)); ctx.closePath(); ctx.fillStyle = fill || 'rgba(186,117,23,.25)'; ctx.fill(); ctx.strokeStyle = col || ORANGE; ctx.lineWidth = 2; ctx.stroke(); }

function umb_f(x){ return nfmt(Math.round(x * 100) / 100); }

function um9_ell(m, A, col, w, fill, vis){ /* image du cercle unité par A=[a,b,c,d] */
  ctx.beginPath(); for (var i = 0; i <= 90; i++){ var q = i / 90 * 2 * Math.PI, x = Math.cos(q), y = Math.sin(q), X = m.X(A[0] * x + A[1] * y), Y = m.Y(A[2] * x + A[3] * y); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
  if (fill){ ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.stroke(); }
function um9_axes(m, xr, yr){ LN(m.X(-xr), m.Y(0), m.X(xr), m.Y(0), '#9aa0a6', 1.4); LN(m.X(0), m.Y(-yr), m.X(0), m.Y(yr), '#9aa0a6', 1.4); }

SFA.theo("c09", {
  icon: function(){
    ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0, 0, W, H);
    var m = {X:function(x){ return W * .3 + x * 40; }, Y:function(y){ return H * .55 - y * 40; }};
    um8_grid(m, 1.5, .5, .5, 1.5, ORANGE, 3, 'rgba(186,117,23,.2)'); umb_vec(m, 1, 1, GREEN, '', 3.2); umb_vec(m, 1, -1, BLUE, '', 3.2);
    LN(m.X(-2.4), m.Y(-2.4), m.X(2.4), m.Y(2.4), 'rgba(15,110,86,.45)', 2, [6, 4]);
    TB('A v = λ v', W * .64, H * .36, DGREEN, 30, 'left'); TB('det(A − λI) = 0', W * .64, H * .56, BLUE_D, 20, 'left'); TB('A = P D P⁻¹', W * .64, H * .76, DRED, 22, 'left');
  },
  anim: function(t){
    var s = .5 + .5 * Math.sin(t * 0.018), a = 1 + s * 1, b = s * 1, d = a; /* A(s) = [[1+s ; s] ; [s ; 1+s]] : valeurs propres 1 + 2s et 1 */
    var m = {X:function(x){ return W * .27 + x * 44; }, Y:function(y){ return H * .54 - y * 44; }};
    um9_axes(m, 3, 3.2); um8_grid(m, a, b, b, d, ORANGE, 4, 'rgba(186,117,23,.18)');
    LN(m.X(-3.4), m.Y(-3.4), m.X(3.4), m.Y(3.4), 'rgba(15,110,86,.55)', 2, [6, 4]); LN(m.X(-2.4), m.Y(2.4), m.X(2.4), m.Y(-2.4), 'rgba(55,138,221,.55)', 2, [6, 4]);
    var r = Math.SQRT1_2; umb_vec(m, r, r, GREEN, '', 2.4); umb_vec(m, (1 + 2 * s) * r, (1 + 2 * s) * r, DGREEN, '', 3.2); umb_vec(m, r, -r, BLUE, '', 2.4);
    var x0 = W * .56; umb_TB('A = [[' + umb_f(a) + ' ; ' + umb_f(b) + '] ; [' + umb_f(b) + ' ; ' + umb_f(d) + ']]', x0, H * .14, INK, 12, 'left');
    umb_TB('direction verte (1 ; 1) : étirée ×' + umb_f(1 + 2 * s), x0, H * .38, DGREEN, 12, 'left'); umb_TB('direction bleue (1 ; −1) : reste ×1', x0, H * .54, BLUE_D, 12, 'left');
    umb_TB('les deux droites ne tournent pas :', x0, H * .74, INK, 12, 'left'); umb_TB('ce sont les directions propres', x0, H * .88, INK, 12, 'left');
  },
  th: '<div class="tcard"><b class="h">1. Application linéaire et matrice</b><p>Une application f de ℝ² dans ℝ² est <b>linéaire</b> si f(u + v) = f(u) + f(v) et f(λu) = λf(u). Elle fixe l\'origine, garde les droites et le parallélisme. Elle est entièrement connue par les images de e₁ et e₂ : ces vecteurs sont les <b>colonnes</b> de sa matrice A, et f(x) = Ax. Le déterminant donne le facteur d\'aire : |det A|, avec un signe négatif si l\'orientation est retournée.</p><p>Exemple : la dilatation de rapports 3 et ½ a pour matrice [[3 ; 0] ; [0 ; ½]], et envoie (2 ; 4) sur (6 ; 2).</p></div>' +
    '<div class="tcard"><b class="h">2. Transformations usuelles et composition</b><p><b>Rotation d\'angle θ</b> : [[cos θ ; −sin θ] ; [sin θ ; cos θ]] (det = 1). <b>Dilatation</b> : diag(p ; q). <b>Cisaillement</b> : [[1 ; k] ; [0 ; 1]] (det = 1, l\'aire est conservée). <b>Projection</b> sur l\'axe x : [[1 ; 0] ; [0 ; 0]] (det = 0). <b>Réflexion</b> par rapport à l\'axe x : [[1 ; 0] ; [0 ; −1]] (det = −1).</p><p>Composer g après f se traduit par le produit <b>BA</b> (f d\'abord, avec la matrice A). Comme le produit n\'est pas commutatif, l\'ordre des transformations compte : projeter puis cisailler n\'est pas cisailler puis projeter.</p></div>' +
    '<div class="tcard"><b class="h">3. Valeurs propres et vecteurs propres</b><p>Un vecteur v ≠ 0 est <b>propre</b> pour A, de <b>valeur propre</b> λ, si <b>Av = λv</b> : A ne change pas sa direction, elle l\'étire (λ > 1), le contracte (|λ| < 1) ou le retourne (λ < 0). Les valeurs propres sont les racines du <b>polynôme caractéristique</b> det(A − λI) = λ² − (tr A)λ + det A. Pour chacune, on résout (A − λI)v = 0.</p><p>Exemple : A = [[4 ; 1] ; [2 ; 3]] : λ² − 7λ + 10 = 0, donc λ = 5 (vecteur (1 ; 1)) et λ = 2 (vecteur (1 ; −2)). Toujours : λ₁ + λ₂ = trace et λ₁λ₂ = déterminant. Pour une matrice triangulaire, les valeurs propres sont sur la diagonale. Si Δ < 0, elles sont complexes (rotation).</p></div>' +
    '<div class="tcard"><b class="h">4. Diagonalisation et puissances</b><p>Si A possède deux vecteurs propres indépendants v₁, v₂, on forme P = [v₁ v₂] et D = diag(λ₁ ; λ₂) : <b>A = PDP⁻¹</b>. Alors <b>Aⁿ = PDⁿP⁻¹</b>, avec Dⁿ = diag(λ₁ⁿ ; λ₂ⁿ). Dit autrement : si x₀ = c₁v₁ + c₂v₂, alors Aⁿx₀ = c₁λ₁ⁿv₁ + c₂λ₂ⁿv₂. Le terme de plus grand |λ| domine à long terme.</p><p>Une matrice symétrique réelle est toujours diagonalisable, avec des vecteurs propres orthogonaux (elle transforme le cercle en ellipse dont les axes sont ses directions propres). [[1 ; 1] ; [0 ; 1]] n\'est pas diagonalisable : une seule direction propre.</p></div>' +
    '<div class="tcard"><b class="h">5. Applications : populations, chaînes de Markov, Fibonacci</b><p>Une grandeur qui évolue par xₙ₊₁ = Axₙ se prédit grâce aux valeurs propres : |λ| < 1 amortit, |λ| > 1 amplifie. <b>Chaîne de Markov</b> : A a des colonnes de somme 1, λ = 1 est valeur propre, son vecteur propre normalisé est la répartition stationnaire. <b>Modèle de Leslie</b> : la valeur propre dominante est le taux de croissance, son vecteur propre la répartition stable par âge. <b>Fibonacci</b> : M = [[1 ; 1] ; [1 ; 0]] a pour valeur propre dominante le nombre d\'or φ ≈ 1,618.</p></div>'
});

SFA.figs("c09", [
  /* 1 dilatation */
  function(p){ var m = umb_pl(7.5, 5, {ox:W * .12, oy:H * .86, k:Math.min(W / 16, H / 6), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.rect(m.X(0), m.Y(1), m.k, m.k); ctx.fillStyle = 'rgba(55,138,221,.22)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.rect(m.X(0), m.Y(.5), 3 * m.k, .5 * m.k); ctx.fillStyle = 'rgba(186,117,23,' + (.08 + .22 * p) + ')'; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.stroke();
    umb_vec(m, 2, 4, VIOLET, '', 3); umb_TB('(2 ; 4)', m.X(2) + 8, m.Y(4) - 8, VIOLET, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_vec(m, 6, 2, RED, '', 3.2); umb_TB('(6 ; 2)', m.X(6) + 8, m.Y(2) - 10, DRED, 13, 'left'); ctx.globalAlpha = 1; }
    um8_mat([[3, 0], [0, '½']], W * .64, H * .18, 34, 28, BLUE_D, 12); },
  /* 2 image d'un vecteur */
  function(p){ var m = umb_pl(2.8, 8, {ox:W * .3, oy:H * .88, k:Math.min(W / 8, H / 9.4), step:1, xl:' ', yl:' '});
    umb_vec(m, 1, 2, BLUE, '', 3); umb_TB('x = (1 ; 2)', m.X(1) + 10, m.Y(2) + 4, BLUE_D, 13, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_vec(m, 0, 7, RED, '', 3.2); umb_TB('Ax = (0 ; 7)', m.X(0) + 12, m.Y(7) + 4, DRED, 14, 'left'); ctx.globalAlpha = 1; }
    um8_mat([[2, -1], [1, 3]], W * .62, H * .3, 36, 30, INK, 13); umb_TB('A', W * .62 - 20, H * .3 + 20, GREY, 12); },
  /* 3 rotation 90° */
  function(p){ var m = umb_pl(3.4, 3.4, {ox:W * .4, oy:H * .54, k:Math.min(W / 8, H / 7), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.rect(m.X(0), m.Y(1), m.k, m.k); ctx.fillStyle = 'rgba(55,138,221,.18)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.stroke();
    ctx.beginPath(); ctx.rect(m.X(-1), m.Y(1), m.k, m.k); ctx.fillStyle = 'rgba(216,90,48,' + (.05 + .2 * p) + ')'; ctx.fill(); ctx.strokeStyle = ORA2; ctx.stroke();
    umb_vec(m, 1, 0, BLUE, 'e₁', 3); umb_vec(m, 0, 1, VIOLET, 'e₂', 3); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_vec(m, 0, 1, DRED, '', 3.4); umb_vec(m, -1, 0, DRED, '', 3.4); umb_TB('Re₁ = (0 ; 1)', m.X(.1) + 12, m.Y(1.2), DRED, 12, 'left'); umb_TB('Re₂ = (−1 ; 0)', m.X(-1.1), m.Y(-.35), DRED, 12, 'left'); ctx.globalAlpha = 1; }
    umb_arc(m, m.k * .6, 0, Math.PI / 2, GREEN, 2.4); umb_TB('90°', m.X(.55), m.Y(.55), DGREEN, 12); },
  /* 4 vecteurs propres */
  function(p){ var m = umb_pl(4, 4.4, {ox:W * .4, oy:H * .56, k:Math.min(W / 9, H / 9.4), step:1, xl:' ', yl:' '});
    LN(m.X(-3), m.Y(-3), m.X(3), m.Y(3), 'rgba(15,110,86,.4)', 2, [6, 4]); LN(m.X(-2), m.Y(4), m.X(2), m.Y(-4), 'rgba(55,138,221,.4)', 2, [6, 4]);
    umb_vec(m, 1, 1, GREEN, '', 3); umb_vec(m, 1, -2, BLUE, '', 3); umb_TB('v₁ = (1 ; 1)', m.X(1) - 10, m.Y(1) - 14, DGREEN, 12, 'left'); umb_TB('v₂ = (1 ; −2)', m.X(1) + 10, m.Y(-2) + 4, BLUE_D, 12, 'left');
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_vec(m, 5, 5, DGREEN, '', 3); umb_vec(m, 2, -4, BLUE_D, '', 3); umb_TB('5 v₁', m.X(5) - 6, m.Y(3.9), DGREEN, 13, 'left'); umb_TB('2 v₂', m.X(2) + 8, m.Y(-4) - 6, BLUE_D, 13, 'left'); ctx.globalAlpha = 1; }
    um8_mat([[4, 1], [2, 3]], W * .66, H * .2, 32, 28, INK, 12); },
  /* 5 PS et SP */
  function(p){ var m = umb_pl(3.2, 2.6, {ox:W * .1, oy:H * .78, k:Math.min(W / 7.4, H / 5), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.rect(m.X(0), m.Y(1), m.k, m.k); ctx.fillStyle = 'rgba(55,138,221,.2)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(1), m.Y(0)); ctx.lineTo(m.X(2), m.Y(1)); ctx.lineTo(m.X(1), m.Y(1)); ctx.closePath(); ctx.fillStyle = 'rgba(186,117,23,.16)'; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.stroke(); umb_TB('S(carré)', m.X(1.5), m.Y(1.35), ORANGE, 11);
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); LN(m.X(0), m.Y(-.25), m.X(2), m.Y(-.25), DRED, 5); LN(m.X(0), m.Y(-.65), m.X(1), m.Y(-.65), DGREEN, 5); umb_TB('PS : [0 ; 2]', m.X(2.15), m.Y(-.2), DRED, 12, 'left'); umb_TB('SP : [0 ; 1]', m.X(1.15), m.Y(-.6), DGREEN, 12, 'left'); ctx.globalAlpha = 1; }
    umb_TB('S = [[1 ; 1] ; [0 ; 1]]', W * .62, H * .16, INK, 12, 'left'); umb_TB('P = [[1 ; 0] ; [0 ; 0]]', W * .62, H * .3, INK, 12, 'left'); umb_TB('PS ≠ SP', W * .62, H * .5, DRED, 15, 'left'); },
  /* 6 triangulaire */
  function(p){ um8_mat([[3, 5], [0, -2]], W * .12, H * .4, 56, 46, INK, 22, [[DRED, INK], [INK, DRED]]);
    ctx.strokeStyle = 'rgba(163,45,45,.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * .12 + 6, H * .4 - 22); ctx.lineTo(W * .12 + 106, H * .4 + 70); ctx.stroke();
    umb_TB('la diagonale', W * .12 + 50, H * .4 - 54, DRED, 12); var m = {k:36, X:function(x){ return W * .72 + x * 36; }, Y:function(y){ return H * .5 - y * 36; }}; um9_axes(m, 2.2, 2.6);
    umb_vec(m, 1, 0, DGREEN, '', 3); umb_vec(m, -1, 1, BLUE_D, '', 3); umb_TB('λ = 3', m.X(1) - 4, m.Y(0) + 20, DGREEN, 12); umb_TB('λ = −2', m.X(-1) - 10, m.Y(1) - 8, BLUE_D, 12);
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('λ = 3 et λ = −2', W * .12, H * .88, DGREEN, 16, 'left'); ctx.globalAlpha = 1; } },
  /* 7 ellipse */
  function(p){ var m = umb_pl(6.4, 4.4, {ox:W * .46, oy:H * .52, k:Math.min(W / 13.5, H / 9), step:1, xl:' ', yl:' '}); var A = [5, -2, -2, 2];
    um9_ell(m, [1, 0, 0, 1], 'rgba(55,138,221,.8)', 1.6); um9_ell(m, A, ORANGE, 2.6, 'rgba(186,117,23,' + (.06 + .12 * p) + ')');
    var u1 = [2 / Math.sqrt(5), -1 / Math.sqrt(5)], u2 = [1 / Math.sqrt(5), 2 / Math.sqrt(5)]; umb_vec(m, 6 * u1[0], 6 * u1[1], GREEN, '', 3); umb_vec(m, u2[0], u2[1], VIOLET, '', 3);
    umb_TB('6 v₁', m.X(6 * u1[0]) + 6, m.Y(6 * u1[1]) + 18, DGREEN, 13, 'left'); umb_TB('1 v₂', m.X(u2[0]) - 18, m.Y(u2[1]) - 6, VIOLET, 12, 'left');
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); LN(m.X(-6.2 * u1[0]), m.Y(-6.2 * u1[1]), m.X(6.2 * u1[0]), m.Y(6.2 * u1[1]), 'rgba(15,110,86,.45)', 1.6, [5, 4]); ctx.globalAlpha = 1; }
    umb_TB('A = PDP⁻¹', W * .03, H * .12, INK, 14, 'left'); umb_TB('D = diag(6 ; 1)', W * .03, H * .93, DRED, 12, 'left'); },
  /* 8 maladie */
  function(p){ function box(x, y, c, l, v){ ctx.fillStyle = '#fff'; ctx.strokeStyle = c; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(x - 52, y - 34, 104, 68, 12); ctx.fill(); ctx.stroke(); umb_TB(l, x, y - 8, c, 13); umb_TB(v, x, y + 18, INK, 15); }
    var xs = W * .22, xm = W * .78, yy = H * .4; box(xs, yy, DGREEN, 'sains', p > 0 ? '2/3' : 'S'); box(xm, yy, DRED, 'malades', p > 0 ? '1/3' : 'M');
    A(xs + 56, yy - 14, xm - xs - 112, 0, ORANGE, '', 3); A(xm - 56, yy + 14, -(xm - xs - 112), 0, ORANGE, '', 3); umb_TB('10 %', W * .5, yy - 24, ORANGE, 13); umb_TB('20 %', W * .5, yy + 38, ORANGE, 13);
    ctx.fillStyle = 'rgba(15,110,86,.2)'; ctx.fillRect(W * .15, H * .72, W * .7, 16); ctx.fillStyle = 'rgba(15,110,86,.7)'; ctx.fillRect(W * .15, H * .72, W * .7 * (p > 0 ? 2 / 3 : .5), 16); umb_TB('λ = 1 et λ = 0,7', W * .5, H * .93, DRED, 14); },
  /* 9 carrés des valeurs propres */
  function(p){ var y1 = H * .3, y2 = H * .68, x0 = W * .5, k = W * .045; function nl(y){ LN(W * .06, y, W * .94, y, AX, 2); for (var v = -4; v <= 9; v++){ LN(x0 + v * k * 1.1, y - 4, x0 + v * k * 1.1, y + 4, GREY, 1); } }
    nl(y1); nl(y2); umb_TB('valeurs propres de A', W * .5, y1 - 28, INK, 12); umb_TB('valeurs propres de A²', W * .5, y2 - 28, INK, 12); var X = function(v){ return x0 + v * k * 1.1; };
    DOT(X(2), y1, 7, BLUE); DOT(X(-3), y1, 7, RED); umb_TB('2', X(2), y1 + 24, BLUE_D, 13); umb_TB('−3', X(-3), y1 + 24, DRED, 13);
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); A(X(2), y1 + 8, 0, y2 - y1 - 18, GREY, '', 1.6); DOT(X(4), y2, 7, BLUE); A(X(-3), y1 + 8, X(9) - X(-3), y2 - y1 - 18, GREY, '', 1.6); DOT(X(9), y2, 7, RED); umb_TB('4', X(4), y2 + 24, BLUE_D, 13); umb_TB('9', X(9), y2 + 24, DRED, 13); ctx.globalAlpha = 1; } umb_TB('λ ↦ λ²', W * .12, H * .5, ORANGE, 15, 'left'); },
  /* 10 spirale complexe */
  function(p){ var m = umb_pl(13, 6, {ox:W * .62, oy:H * .5, k:Math.min(W / 30, H / 14), step:5, xl:'Re', yl:'Im', grid:true}); var pts = [[1, 0], [1, 2], [-3, 4], [-11, -2]], i;
    for (i = 0; i < 3; i++){ ctx.globalAlpha = i === 2 ? umb_clamp(p, 0, .3) * 2 : 1; if (i === 2 && p === 0) ctx.globalAlpha = .25; LN(m.X(0), m.Y(0), m.X(pts[i + 1][0]), m.Y(pts[i + 1][1]), 'rgba(127,119,221,.4)', 1.4, [4, 3]); ctx.globalAlpha = 1; }
    for (i = 0; i < 4; i++){ var a = (i === 3 ? (p > 0 ? 1 : .3) : 1); ctx.globalAlpha = a; DOT(m.X(pts[i][0]), m.Y(pts[i][1]), 5.5, i === 3 ? RED : BLUE); umb_TB('A' + (i ? (i === 1 ? '' : (i === 2 ? '²' : '³')) : '⁰') + 'e₁', m.X(pts[i][0]) + 8, m.Y(pts[i][1]) - 10, i === 3 ? DRED : BLUE_D, 12, 'left'); ctx.globalAlpha = 1; }
    umb_TB('λ = 1 ± 2i', W * .03, H * .16, INK, 15, 'left'); umb_TB('|λ| = √5, θ ≈ 63,4°', W * .03, H * .32, GREY, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('A³e₁ = (−11 ; −2)', W * .03, H * .5, DRED, 14, 'left'); ctx.globalAlpha = 1; } },
  /* 11 det nul : écrasement */
  function(p){ var m = umb_pl(4, 6.6, {ox:W * .4, oy:H * .54, k:Math.min(W / 9.6, H / 13.4), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.rect(m.X(0), m.Y(1), m.k, m.k); ctx.fillStyle = 'rgba(55,138,221,.2)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.stroke();
    LN(m.X(-1.6), m.Y(-3.2), m.X(3.2), m.Y(6.4), 'rgba(216,90,48,.5)', 2, [6, 4]); LN(m.X(0), m.Y(0), m.X(3 * p), m.Y(6 * p), ORA2, 5);
    umb_TB('image : la droite y = 2x', m.X(.8), m.Y(6.3), DRED, 12, 'left');
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); LN(m.X(-2), m.Y(1), m.X(2), m.Y(-1), 'rgba(15,110,86,.7)', 2, [6, 4]); umb_vec(m, 2, -1, DGREEN, '', 3); umb_TB('Av = 0 (λ = 0)', m.X(2) - 4, m.Y(-1) + 22, DGREEN, 12, 'left'); ctx.globalAlpha = 1; }
    um8_mat([[1, 2], [2, 4]], W * .7, H * .2, 30, 28, INK, 12); umb_TB('det = 0', W * .7, H * .42, GREY, 12, 'left'); },
  /* 12 Leslie 2 classes : barres 100 % */
  function(p){ var gens = [[100, 100], [300, 50], [400, 150], [700, 200], [1100, 350], [1750, 550]], bw = W * .1, base = H * .8, hh = H * .55, i;
    for (i = 0; i < gens.length; i++){ var j = gens[i][0], a = gens[i][1], tt = j + a, x = W * .1 + i * W * .14; var hj = hh * j / tt, ha = hh * a / tt; ctx.fillStyle = 'rgba(29,158,117,.75)'; ctx.fillRect(x, base - hj, bw, hj); ctx.fillStyle = 'rgba(127,119,221,.8)'; ctx.fillRect(x, base - hj - ha, bw, ha); umb_TB(String(i), x + bw / 2, base + 16, GREY, 11); umb_TB(Math.round(j / tt * 100) + ' %', x + bw / 2, base - hj / 2 + 4, '#fff', 10); }
    umb_TB('génération n', W * .5, base + 34, GREY, 11); umb_TB('jeunes', W * .9, base - hh * .4, DGREEN, 11); umb_TB('adultes', W * .9, base - hh * .93, VIOLET, 11);
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); LN(W * .06, base - hh * .764, W * .85, base - hh * .764, DRED, 2.2, [6, 4]); umb_TB('→ 76,4 % de jeunes', W * .5, base - hh - 12, DRED, 13); ctx.globalAlpha = 1; } umb_TB('λ ≈ 1,618', W * .12, H * .1, INK, 14, 'left'); },
  /* 13 Fibonacci : rapports */
  function(p){ var fib = [1, 1], i; for (i = 2; i < 14; i++) fib.push(fib[i - 1] + fib[i - 2]); var gx = W * .12, gw = W * .8, gy = H * .15, gh = H * .62, ymin = 1, ymax = 2.05, Y = function(v){ return gy + gh - (v - ymin) / (ymax - ymin) * gh; };
    LN(gx, gy + gh, gx + gw, gy + gh, AX, 1.5); LN(gx, gy, gx, gy + gh, AX, 1.5); umb_TB('F(n+1)/F(n)', gx + 10, gy - 4, GREY, 11, 'left'); umb_TB('n', gx + gw, gy + gh + 16, GREY, 11);
    var N = p > 0 ? 12 : 6; ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.beginPath(); for (i = 0; i < N; i++){ var X = gx + (i + .5) / 12 * gw, V = fib[i + 1] / fib[i]; if (i) ctx.lineTo(X, Y(V)); else ctx.moveTo(X, Y(V)); } ctx.stroke();
    for (i = 0; i < N; i++) DOT(gx + (i + .5) / 12 * gw, Y(fib[i + 1] / fib[i]), 4, BLUE);
    LN(gx, Y(1.618034), gx + gw, Y(1.618034), DRED, 2, [6, 4]); umb_TB('φ ≈ 1,618', gx + gw - 6, Y(1.618034) - 8, DRED, 13, 'right'); umb_TB('M = [[1 ; 1] ; [1 ; 0]]', W * .5, H * .93, INK, 13); },
  /* 14 limite : projection */
  function(p){ var m = umb_pl(4.2, 3.4, {ox:W * .18, oy:H * .7, k:Math.min(W / 11, H / 7.2), step:1, xl:' ', yl:' '}); var v1 = [2, 1], v2 = [-1, 1];
    LN(m.X(-1), m.Y(-.5), m.X(5), m.Y(2.5), 'rgba(15,110,86,.45)', 2, [6, 4]); umb_vec(m, 2, 1, GREEN, '', 3); umb_vec(m, -1, 1, VIOLET, '', 3); umb_TB('v₁ (λ = 1)', m.X(2) + 6, m.Y(1) + 20, DGREEN, 12, 'left'); umb_TB('v₂ (λ = ½)', m.X(-1) - 4, m.Y(1) - 10, VIOLET, 12, 'left');
    var n, c1 = 4 / 3, c2 = 5 / 3, N = p > 0 ? 6 : 3; for (n = 0; n < N; n++){ var f = Math.pow(.5, n), x = c1 * v1[0] + c2 * f * v2[0], y = c1 * v1[1] + c2 * f * v2[1]; DOT(m.X(x), m.Y(y), n === 0 ? 6 : 4.5, n === 0 ? BLUE : RED); if (n === 0) umb_TB('x₀', m.X(x) + 12, m.Y(y) - 8, BLUE_D, 12, 'left'); if (n > 0){ var f0 = Math.pow(.5, n - 1); LN(m.X(c1 * v1[0] + c2 * f0 * v2[0]), m.Y(c1 * v1[1] + c2 * f0 * v2[1]), m.X(x), m.Y(y), 'rgba(226,75,74,.5)', 1.4, [3, 3]); } }
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); DOT(m.X(8 / 3), m.Y(4 / 3), 7, DGREEN); umb_TB('limite : projection de x₀', m.X(8 / 3) + 10, m.Y(4 / 3) - 16, DGREEN, 12, 'left'); ctx.globalAlpha = 1; }
    umb_TB('Aⁿ → P·diag(1 ; 0)·P⁻¹', W * .6, H * .12, INK, 13, 'left'); }
]);
