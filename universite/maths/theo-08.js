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


/* ---- chapitre 8 ---- */
function um8_mat(rows, x, y, cw, rh, col, sz, br){ var n = rows.length, m = rows[0].length, w = m * cw, h = n * rh, i, j;
  umb_TB('', x, y, col, sz);
  LN(x + 4, y - rh * .7, x, y - rh * .7, col || INK, 2); LN(x, y - rh * .7, x, y - rh * .7 + h, col || INK, 2); LN(x, y - rh * .7 + h, x + 4, y - rh * .7 + h, col || INK, 2);
  LN(x + w - 4, y - rh * .7, x + w, y - rh * .7, col || INK, 2); LN(x + w, y - rh * .7, x + w, y - rh * .7 + h, col || INK, 2); LN(x + w, y - rh * .7 + h, x + w - 4, y - rh * .7 + h, col || INK, 2);
  for (i = 0; i < n; i++) for (j = 0; j < m; j++){ var c = br && br[i] && br[i][j] ? br[i][j] : (col || INK); umb_TB(String(rows[i][j]), x + cw * (j + .5), y + i * rh + 4, c, sz); } }
function um8_grid(m, a, b, c, d, col, n, fill){ /* image du carré unité et de la grille par [[a b][c d]] */
  var i; for (i = -n; i <= n; i++){ LN(m.X(a * i - b * n), m.Y(c * i - d * n), m.X(a * i + b * n), m.Y(c * i + d * n), 'rgba(120,130,150,.25)', 1); LN(m.X(a * -n + b * i), m.Y(c * -n + d * i), m.X(a * n + b * i), m.Y(c * n + d * i), 'rgba(120,130,150,.25)', 1); }
  ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(a), m.Y(c)); ctx.lineTo(m.X(a + b), m.Y(c + d)); ctx.lineTo(m.X(b), m.Y(d)); ctx.closePath(); ctx.fillStyle = fill || 'rgba(186,117,23,.25)'; ctx.fill(); ctx.strokeStyle = col || ORANGE; ctx.lineWidth = 2; ctx.stroke(); }

SFA.theo("c08", {
  icon: function(){
    ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0, 0, W, H);
    var m = {X:function(x){ return W * .66 + x * 34; }, Y:function(y){ return H * .64 - y * 34; }}; um8_grid(m, 1.6, .7, .3, 1.4, ORANGE, 3);
    umb_vec(m, 1.6, .3, BLUE, '', 3); umb_vec(m, .7, 1.4, VIOLET, '', 3);
    um8_mat([['a', 'b'], ['c', 'd']], W * .08, H * .38, 42, 38, BLUE_D, 24); TB('det = ad − bc', W * .08, H * .78, DRED, 20, 'left'); TB('Ax = b', W * .08, H * .9, DGREEN, 22, 'left');
  },
  anim: function(t){
    var s = .5 + .5 * Math.sin(t * 0.02), a = 1 + s * .9, b = s * .8, c = s * .3, d = 1 + s * .5, det = a * d - b * c;
    var m = {X:function(x){ return W * .24 + x * 52; }, Y:function(y){ return H * .78 - y * 52; }};
    LN(8, m.Y(0), W * .46, m.Y(0), AX, 1.4); LN(m.X(0), H - 8, m.X(0), 8, AX, 1.4);
    um8_grid(m, a, b, c, d, ORANGE, 3); umb_vec(m, a, c, BLUE, 'Ae₁', 3); umb_vec(m, b, d, VIOLET, 'Ae₂', 3); umb_vec(m, 1, 0, GREY, '', 1.6); umb_vec(m, 0, 1, GREY, '', 1.6);
    var x0 = W * .52; umb_TB('Une matrice transforme le plan', x0, H * .14, INK, 12, 'left');
    um8_mat([[umb_f(a), umb_f(b)], [umb_f(c), umb_f(d)]], x0, H * .36, 62, 34, BLUE_D, 13);
    umb_TB('colonnes = images de e₁ et e₂', x0, H * .62, GREY, 11, 'left'); umb_TB('aire du carré unité → ' + umb_f(det), x0, H * .78, DRED, 13, 'left'); umb_TB('det A = ad − bc = ' + umb_f(det), x0, H * .93, DRED, 13, 'left');
  },
  th: '<div class="tcard"><b class="h">1. Systèmes linéaires et géométrie</b><p>Un système de n équations à n inconnues s\'écrit <b>Ax = b</b> : A est la matrice des coefficients, x le vecteur des inconnues, b le second membre. Chaque équation est une droite (dans ℝ²) ou un plan (dans ℝ³). Il y a <b>zéro, une ou une infinité</b> de solutions, jamais deux : droites sécantes, parallèles distinctes, ou confondues.</p><p>Exemple : { 2x + y = 7 ; x − y = 2 } a pour unique solution (3 ; 1), le point d\'intersection des deux droites.</p></div>' +
    '<div class="tcard"><b class="h">2. Élimination de Gauss</b><p>Trois opérations qui <b>ne changent pas les solutions</b> : échanger deux lignes, multiplier une ligne par un réel non nul, ajouter à une ligne un multiple d\'une autre. On les applique à la matrice augmentée [A | b] pour la rendre <b>triangulaire</b> (échelonnée), puis on remonte en partant de la dernière équation. Le <b>rang</b> est le nombre de lignes non nulles après échelonnement.</p><p>Si une ligne devient (0 0 0 | c) avec c ≠ 0 : aucune solution. Si une ligne devient nulle (rang < nombre d\'inconnues) : une infinité de solutions, avec des paramètres libres. Exemple : x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2 donne z = 3, y = 2, x = 1.</p></div>' +
    '<div class="tcard"><b class="h">3. Calcul matriciel</b><p>On additionne des matrices de même taille terme à terme. Le <b>produit</b> AB (A de taille m × n, B de taille n × p) a pour entrée (i ; j) : (ligne i de A)·(colonne j de B). Il est <b>associatif</b> et distributif mais <b>pas commutatif</b> : en général AB ≠ BA. La matrice identité I vérifie AI = IA = A ; la transposée vérifie (AB)ᵀ = BᵀAᵀ.</p><p>Géométrie : A envoie e₁ sur sa première colonne et e₂ sur la seconde ; AB signifie « d\'abord B, puis A ».</p></div>' +
    '<div class="tcard"><b class="h">4. Déterminant</b><p>2 × 2 : det [[a ; b] ; [c ; d]] = <b>ad − bc</b>. 3 × 3 : développement selon une ligne (signes + − +), par exemple det = a(ei − fh) − b(di − fg) + c(dh − eg). Interprétation : |det| est l\'<b>aire</b> (ou le <b>volume</b>) de l\'image du carré (du cube) unité ; le signe indique si l\'orientation est conservée.</p><p>Propriétés : det(AB) = det A · det B ; det(Aᵀ) = det A ; échanger deux lignes change le signe ; det(kA) = kⁿ det A pour une matrice n × n. <b>det A = 0 ⇔ A non inversible ⇔ lignes (ou colonnes) dépendantes.</b></p></div>' +
    '<div class="tcard"><b class="h">5. Matrice inverse</b><p>A est inversible s\'il existe A⁻¹ telle que AA⁻¹ = A⁻¹A = I, ce qui équivaut à det A ≠ 0. En 2 × 2 : <b>A⁻¹ = (1/det A)·[[d ; −b] ; [−c ; a]]</b>. En général, on applique Gauss–Jordan à [A | I] jusqu\'à obtenir [I | A⁻¹]. Si A est inversible, Ax = b a pour unique solution <b>x = A⁻¹b</b> (les formules de Cramer en sont une écriture : xᵢ = det Aᵢ / det A).</p><p>Piège : (AB)⁻¹ = B⁻¹A⁻¹ (ordre inversé) ; (A + B)⁻¹ ≠ A⁻¹ + B⁻¹. Exemple : [[2 ; 1] ; [5 ; 3]] a pour déterminant 1 et pour inverse [[3 ; −1] ; [−5 ; 2]].</p></div>'
});
function umb_f(x){ return nfmt(Math.round(x * 100) / 100); }

SFA.figs("c08", [
  /* 1 système 2x2 : deux droites */
  function(p){ var m = umb_pl(5, 6.5, {ox:W * .12, oy:H * .88, k:Math.min(W / 12.5, H / 7.7), step:1, xl:'x', yl:'y'}); var X = m.X, Y = m.Y;
    LN(X(0.5), Y(6), X(4), Y(-1), BLUE, 3); LN(X(1.5), Y(-.5), X(5), Y(3), RED, 3);
    umb_TB('2x + y = 7', X(.6), Y(6.4), BLUE_D, 12, 'left'); umb_TB('x − y = 2', X(4.2), Y(3.7), DRED, 12, 'left');
    DOT(X(3), Y(1), 6, GREEN); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('(3 ; 1)', X(3) + 12, Y(1) + 24, DGREEN, 15, 'left'); ctx.globalAlpha = 1; }
    umb_TB('une solution =', W * .66, H * .14, GREY, 11, 'left'); umb_TB('une intersection', W * .66, H * .27, GREY, 11, 'left'); },
  /* 2 AB et BA */
  function(p){ var m = umb_pl(7.6, 7.6, {ox:W * .07, oy:H * .9, k:Math.min(W / 16, H / 8.6), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(2), m.Y(4)); ctx.lineTo(m.X(3), m.Y(7)); ctx.lineTo(m.X(1), m.Y(3)); ctx.closePath(); ctx.fillStyle = 'rgba(55,138,221,.2)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.globalAlpha = .35 + .65 * umb_clamp(p, 0, .6); ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(3), m.Y(1)); ctx.lineTo(m.X(7), m.Y(3)); ctx.lineTo(m.X(4), m.Y(2)); ctx.closePath(); ctx.fillStyle = 'rgba(216,90,48,.2)'; ctx.fill(); ctx.strokeStyle = ORA2; ctx.stroke(); ctx.globalAlpha = 1;
    umb_TB('AB', m.X(1.1), m.Y(6), BLUE_D, 14); umb_TB('BA', m.X(5.4), m.Y(1.3), DRED, 14);
    um8_mat([[2, 1], [4, 3]], W * .62, H * .2, 34, 30, BLUE_D, 12); umb_TB('= AB', W * .62 + 74, H * .2 + 20, BLUE_D, 11, 'left');
    um8_mat([[3, 4], [1, 2]], W * .62, H * .52, 34, 30, DRED, 12); umb_TB('= BA', W * .62 + 74, H * .52 + 20, DRED, 11, 'left'); umb_TB('AB ≠ BA', W * .66, H * .9, INK, 14, 'left'); },
  /* 3 det 2x2 */
  function(p){ var m = umb_pl(6.5, 4.8, {ox:W * .08, oy:H * .88, k:Math.min(W / 14, H / 7.2), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(3), m.Y(2)); ctx.lineTo(m.X(8), m.Y(6)); ctx.lineTo(m.X(5), m.Y(4)); ctx.closePath(); ctx.fillStyle = 'rgba(186,117,23,' + (.1 + .3 * p) + ')'; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.stroke();
    umb_vec(m, 3, 2, BLUE, 'c₁', 3); umb_vec(m, 5, 4, VIOLET, 'c₂', 3);
    umb_TB('M = [[3 ; 5] ; [2 ; 4]]', W * .1, H * .12, INK, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('aire = |3·4 − 5·2| = 2', W * .4, H * .95, DRED, 14, 'left'); ctx.globalAlpha = 1; } },
  /* 4 det 3x3 : parallélépipède */
  function(p){ var o = umb_v3(Math.min(W * .062, H * .082), 8, [1.2, 1.5, 1.8]); o.cx = W * .3; umb_ax3(o, 4, ['x', 'y', 'z']);
    var c1 = [2, 1, 0], c2 = [0, 3, 1], c3 = [1, 2, 4], O = [0, 0, 0]; function ad(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
    var f = 'rgba(186,117,23,' + (.1 + .12 * p) + ')'; umb_poly3(o, [O, c1, ad(c1, c2), c2], f, 'rgba(186,117,23,.7)'); umb_poly3(o, [O, c1, ad(c1, c3), c3], f, 'rgba(186,117,23,.7)'); umb_poly3(o, [O, c2, ad(c2, c3), c3], f, 'rgba(186,117,23,.7)');
    umb_poly3(o, [c3, ad(c1, c3), ad(ad(c1, c2), c3), ad(c2, c3)], f, 'rgba(186,117,23,.7)');
    umb_A3(o, O, c1, BLUE, 'c₁', 3); umb_A3(o, O, c2, VIOLET, 'c₂', 3); umb_A3(o, O, c3, RED, 'c₃', 3);
    umb_TB('M = [[2 ; 0 ; 1] ;', W * .6, H * .1, INK, 10, 'left'); umb_TB('[1 ; 3 ; 2] ; [0 ; 1 ; 4]]', W * .6, H * .23, INK, 10, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('volume = |det M|', W * .6, H * .42, DRED, 12, 'left'); umb_TB('= 21', W * .6, H * .56, DRED, 15, 'left'); ctx.globalAlpha = 1; } },
  /* 5 inverse */
  function(p){ var m = umb_pl(4, 8.6, {ox:W * .16, oy:H * .88, k:Math.min(W / 14, H / 10.2), step:1, xl:' ', yl:' '});
    ctx.beginPath(); ctx.moveTo(m.X(0), m.Y(0)); ctx.lineTo(m.X(2), m.Y(5)); ctx.lineTo(m.X(3), m.Y(8)); ctx.lineTo(m.X(1), m.Y(3)); ctx.closePath(); ctx.fillStyle = 'rgba(186,117,23,.2)'; ctx.fill(); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.beginPath(); ctx.rect(m.X(0), m.Y(1), m.k, m.k); ctx.fillStyle = 'rgba(55,138,221,.3)'; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.stroke();
    umb_TB('M(carré)', m.X(2.9), m.Y(8.2) + 6, DRED, 12, 'left'); umb_TB('carré unité', m.X(1.2), m.Y(.5) + 4, BLUE_D, 11, 'left');
    um8_mat([[2, 1], [5, 3]], W * .56, H * .27, 30, 28, BLUE_D, 12); umb_TB('det = 1', W * .56, H * .48, GREY, 11, 'left');
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('M⁻¹ =', W * .56, H * .72, DRED, 13, 'left'); um8_mat([[3, -1], [-5, 2]], W * .76, H * .7, 30, 28, DRED, 12); ctx.globalAlpha = 1; } },
  /* 6 droites parallèles */
  function(p){ var m = umb_pl(4.2, 3, {ox:W * .34, oy:H * .5, k:Math.min(W / 11, H / 6.4), step:1, xl:'x', yl:'y'});
    LN(m.X(-3.6), m.Y(3.3), m.X(4.4), m.Y(-.7), BLUE, 3); ctx.globalAlpha = .2 + .8 * umb_clamp(p, 0, .5); LN(m.X(-3.6), m.Y(3.55), m.X(4.4), m.Y(-.45), RED, 3); ctx.globalAlpha = 1;
    umb_TB('x + 2y = 3', m.X(1.6), m.Y(-.2) + 16, BLUE_D, 12, 'left'); umb_TB('2x + 4y = 7', m.X(-3.6), m.Y(3.55) - 12, DRED, 12, 'left');
    umb_TB('mêmes pentes', W * .64, H * .2, INK, 12, 'left'); umb_TB('seconds membres', W * .64, H * .33, INK, 11, 'left'); umb_TB('différents', W * .64, H * .45, INK, 11, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, .3, .8); umb_TB('aucune solution', W * .64, H * .7, DRED, 14, 'left'); ctx.globalAlpha = 1; } },
  /* 7 Gauss */
  function(p){ var cw = 44, x = W * .08, y = H * .26; um8_mat([[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]], x, y, cw, 32, BLUE_D, 13); umb_TB('[A | b]', x, y - 36, GREY, 11, 'left');
    var x2 = W * .55; umb_TB('→', W * .47, y + 32, ORANGE, 24); var t = [[1, 1, 1, 6], [0, -3, -1, -9], [0, 0, -7, -21]];
    ctx.globalAlpha = .25 + .75 * umb_clamp(p, 0, .4); um8_mat(t, x2, y, cw, 32, DRED, 13); ctx.globalAlpha = 1; umb_TB('forme triangulaire', x2, y - 36, GREY, 11, 'left');
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, .3, .7); umb_TB('z = 3  →  y = 2  →  x = 1', W * .5, H * .78, DGREEN, 15); ctx.globalAlpha = 1; } umb_TB('L₂ − 2L₁, L₃ − L₁, puis 3L₃ + L₂', W * .5, H * .93, GREY, 11); },
  /* 8 menu : barres empilées */
  function(p){ var base = H * .84, hh = H * .62, sc = hh / 150, bw = W * .13, xs = [W * .2, W * .45, W * .7], tg = [55, 140, 45], dat = [[20, 15, 20], [40, 90, 10], [10, 30, 5]], nm = ['protéines', 'glucides', 'lipides'], cols = [BLUE, ORANGE, GREEN];
    LN(W * .08, base, W * .9, base, AX, 1.5);
    for (var i = 0; i < 3; i++){ var yy = base; for (var j = 0; j < 3; j++){ var hj = dat[i][j] * sc * umb_clamp(p, 0, .6) + dat[i][j] * sc * .0 + (p > 0 ? 0 : dat[i][j] * sc); ctx.fillStyle = cols[j]; ctx.globalAlpha = .75; ctx.fillRect(xs[i] - bw / 2, yy - hj, bw, hj); ctx.globalAlpha = 1; if (hj > 14) umb_TB(['A', 'B', 'C'][j], xs[i], yy - hj / 2 + 5, '#fff', 11); yy -= hj; }
      LN(xs[i] - bw / 2 - 8, base - tg[i] * sc, xs[i] + bw / 2 + 8, base - tg[i] * sc, DRED, 2.2, [5, 3]); umb_TB(nm[i], xs[i], base + 16, INK, 11); umb_TB(tg[i] + ' g', xs[i] + bw / 2 + 12, base - tg[i] * sc + 4, DRED, 10, 'left'); }
    umb_TB('2 A + 3 B + 1 C', W * .5, H * .1, INK, 13); },
  /* 9 rang : plan */
  function(p){ var o = umb_v3(Math.min(W * .035, H * .05), -6, [3.5, 4.5, 4.5]); o.cx = W * .3; umb_ax3(o, 9, ['x', 'y', 'z']); umb_pp(o, [1, -2, 1], 0, 6, 'rgba(29,158,117,' + (.06 + .12 * p) + ')', 'rgba(15,110,86,.5)');
    umb_A3(o, [0, 0, 0], [1, 2, 3], BLUE, 'L₁', 3); umb_A3(o, [0, 0, 0], [4, 5, 6], VIOLET, 'L₂', 3); umb_A3(o, [0, 0, 0], [7, 8, 9], RED, 'L₃', 3);
    umb_TB('trois lignes dans un même plan', W * .47, H * .1, INK, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('rang = 2, det = 0', W * .47, H * .24, DRED, 15, 'left'); ctx.globalAlpha = 1; } },
  /* 10 paramètre : courbe det(m) */
  function(p){ var m = umb_pl(4, 5, {ox:W * .3, oy:H * .55, k:Math.min(W / 11, H / 9), step:1, xl:'m', yl:' '}); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath();
    for (var i = -34; i <= 34; i++){ var u = i / 10; var px = m.X(u), py = m.Y(4 - u * u); if (i === -34) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.stroke(); umb_TB('4 − m²', m.X(1.2), m.Y(3.6), BLUE_D, 13, 'left');
    DOT(m.X(2), m.Y(0), 6, RED); DOT(m.X(-2), m.Y(0), 6, RED); umb_TB('m = −2', m.X(-2), m.Y(0) + 24, DRED, 11); umb_TB('m = 2', m.X(2), m.Y(0) + 24, DRED, 11);
    umb_TB('det ≠ 0 : une solution', W * .62, H * .22, DGREEN, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .4); umb_TB('m = 2 : infinité', W * .62, H * .5, ORANGE, 13, 'left'); umb_TB('m = −2 : aucune', W * .62, H * .66, DRED, 13, 'left'); ctx.globalAlpha = 1; } },
  /* 11 chaussettes et chaussures : (AB)^-1 */
  function(p){ var y1 = H * .3, y2 = H * .72, xs = [W * .1, W * .36, W * .62, W * .88]; var lab = ['x', 'Bx', 'ABx']; 
    [[0, 'x'], [1, 'Bx'], [2, 'ABx']].forEach(function(e){ ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(W * (.1 + .3 * e[0]) - 30, y1 - 20, 60, 40, 8); ctx.fill(); ctx.stroke(); umb_TB(e[1], W * (.1 + .3 * e[0]), y1 + 5, BLUE_D, 13); });
    A(W * .1 + 32, y1, W * .3 - 66, 0, ORANGE, '', 3); A(W * .4 + 32, y1, W * .3 - 66, 0, ORANGE, '', 3); umb_TB('B', W * .25, y1 - 14, ORANGE, 14); umb_TB('A', W * .55, y1 - 14, ORANGE, 14);
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .5); A(W * .7 - 32, y1 + 30, -(W * .3 - 66), 0, DRED, '', 3); A(W * .4 - 32, y1 + 30, -(W * .3 - 66), 0, DRED, '', 3); umb_TB('A⁻¹', W * .55, y1 + 58, DRED, 14); umb_TB('B⁻¹', W * .25, y1 + 58, DRED, 14); umb_TB('(AB)⁻¹ = B⁻¹A⁻¹', W * .5, y2 + 18, DRED, 17); ctx.globalAlpha = 1; } else umb_TB('(AB)⁻¹ = ?', W * .5, y2 + 18, GREY, 17); },
  /* 12 compartiments */
  function(p){ function box(x, y, c, v, l){ ctx.fillStyle = '#fff'; ctx.strokeStyle = c; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(x - 55, y - 36, 110, 72, 12); ctx.fill(); ctx.stroke(); umb_TB(l, x, y - 12, c, 13); umb_TB(v, x, y + 16, INK, 16); }
    var xs = W * .24, xt = W * .76, yy = H * .46; var sh = p > 0.01 ? ['52 mg', '28 mg'] : ['?', '?'];
    box(xs, yy, RED, sh[0], 'sang S'); box(xt, yy, GREEN, sh[1], 'tissu T'); A(xs + 60, yy - 14, xt - xs - 120, 0, ORANGE, '', 3); A(xt - 60, yy + 14, -(xt - xs - 120), 0, ORANGE, '', 3);
    umb_TB('0,2 S', W * .5, yy - 24, ORANGE, 12); umb_TB('0,3 T', W * .5, yy + 36, ORANGE, 12); umb_TB('reste 0,8', xs, yy + 56, GREY, 11); umb_TB('reste 0,7', xt, yy + 56, GREY, 11);
    umb_TB('1 h plus tard : (S ; T) = (50 ; 30)', W * .5, H * .12, INK, 13); umb_TB('v = M⁻¹ · (50 ; 30)', W * .5, H * .9, DRED, 14); },
  /* 13 combustion */
  function(p){ var y = H * .3; umb_TB('2 C₄H₁₀ + 13 O₂  →  8 CO₂ + 10 H₂O', W * .5, y, INK, 14); var rows = [['C', 8, 8, BLUE], ['H', 20, 20, ORANGE], ['O', 26, 26, RED]], i;
    for (i = 0; i < 3; i++){ var r = rows[i], yy = H * .5 + i * 46; umb_TB(r[0], W * .12, yy + 5, r[3], 15); ctx.fillStyle = r[3]; ctx.globalAlpha = .65; var w1 = r[1] * 6.2 * umb_clamp(p, 0, .5), w2 = r[2] * 6.2 * umb_clamp(p, 0, .5); ctx.fillRect(W * .2, yy - 9, w1, 18); ctx.fillRect(W * .2, yy + 11, w2, 8); ctx.globalAlpha = 1; umb_TB(p > 0 ? r[1] + ' = ' + r[2] : '? = ?', W * .8, yy + 8, INK, 13, 'left'); }
    umb_TB('rang 3 pour 4 inconnues : une droite de solutions', W * .5, H * .93, GREY, 11); },
  /* 14 cube ×8 */
  function(p){ var o = umb_v3(Math.min(W * .1, H * .13), 12, [1.5, 1.5, 1]); o.cx = W * .4; function cube(a, f, s){ var v = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0], [0, 0, a], [a, 0, a], [a, a, a], [0, a, a]];
      umb_poly3(o, [v[4], v[5], v[6], v[7]], f, s); umb_poly3(o, [v[1], v[2], v[6], v[5]], f, s); umb_poly3(o, [v[3], v[2], v[6], v[7]], f, s); }
    umb_ax3(o, 3, ['x', 'y', 'z']); cube(1, 'rgba(55,138,221,.45)', BLUE); ctx.globalAlpha = .3 + .7 * umb_clamp(p, 0, .5); cube(2, 'rgba(216,90,48,.12)', ORA2); ctx.globalAlpha = 1;
    umb_TB('det(A) = 4', W * .68, H * .18, INK, 13, 'left'); umb_TB('2·A⁻¹Aᵀ', W * .68, H * .34, INK, 13, 'left'); umb_TB('2³ × (1/4) × 4', W * .68, H * .52, GREY, 12, 'left'); if (p > 0){ ctx.globalAlpha = umb_clamp(p, .2, .7); umb_TB('= 8', W * .68, H * .72, DRED, 20, 'left'); ctx.globalAlpha = 1; } }
]);
