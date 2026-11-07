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
function umb_P(o, x, y, z){ var ca = Math.cos(o.az), sa = Math.sin(o.az), ce = Math.cos(o.el), se = Math.sin(o.el), X = x * ca - y * sa, Y = x * sa + y * ca; return {x:o.cx + X * o.s, y:o.cy - (z * ce + Y * se) * o.s, d:Y * ce - z * se}; }
function umb_L3(o, a, b, col, w, dash){ var p = umb_P(o, a[0], a[1], a[2]), q = umb_P(o, b[0], b[1], b[2]); LN(p.x, p.y, q.x, q.y, col, w || 1.6, dash); }
function umb_A3(o, a, b, col, lab, w){ var p = umb_P(o, a[0], a[1], a[2]), q = umb_P(o, b[0], b[1], b[2]); A(p.x, p.y, q.x - p.x, q.y - p.y, col, lab || '', w || 2.6); }
function umb_D3(o, a, col, lab, r){ var p = umb_P(o, a[0], a[1], a[2]); DOT(p.x, p.y, r || 5, col); if (lab) TB(lab, p.x + 11, p.y - 9, col, 13); }
function umb_ax3(o, L, names){ var n = names || ['x', 'y', 'z'], g;
  for (g = -L; g <= L; g++){ umb_L3(o, [g, -L, 0], [g, L, 0], '#e9edf2', 1); umb_L3(o, [-L, g, 0], [L, g, 0], '#e9edf2', 1); }
  umb_A3(o, [0, 0, 0], [L, 0, 0], '#8a95a3', n[0], 1.4); umb_A3(o, [0, 0, 0], [0, L, 0], '#8a95a3', n[1], 1.4); umb_A3(o, [0, 0, 0], [0, 0, L], '#8a95a3', n[2], 1.4); }
function umb_poly3(o, pts, fill, stroke){ ctx.beginPath(); pts.forEach(function(q, i){ var p = umb_P(o, q[0], q[1], q[2]); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); } }
function umb_v3(s, dy){ return {cx:W / 2, cy:H / 2 + (dy || 0), s:s, az:0.7 + 0.35 * Math.sin(tG / 110), el:0.5}; }
function umb_o3(s, dy){ return {cx:W / 2, cy:H / 2 + (dy || 0), s:s, az:ORB.a, el:Math.max(.1, Math.min(1.3, ORB.b))}; }

var umb_FS = 1.28;
function umb_TB(t, x, y, c, sz, al){ TB(t, x, y, c, Math.round((sz || 12) * umb_FS), al); }

SFA.theo("c06", {
  icon: function(){
    ctx.fillStyle = '#f6f7fb'; ctx.fillRect(0, 0, W, H);
    var m = umb_pl(2.4, 1.6, {ox:W * .3, oy:H * .62, k:H * .26, grid:false, xl:false, yl:false});
    umb_circ(m, 1, '#c9d3ea', 1.5, [4, 4]); umb_seg(m, 1.5, 1.2, 1.5, 0, AX, 1.2, [4, 4]); umb_seg(m, 1.5, 1.2, 0, 1.2, AX, 1.2, [4, 4]);
    umb_arc(m, 34, 0, Math.atan2(1.2, 1.5), RED, 2.4); umb_vec(m, 1.5, 1.2, BLUE, '', 3.2); umb_pt(m, 1.5, 1.2, BLUE, '', 0, 0, 6);
    TB('a + bi', W * .45, H * .2, BLUE_D, 26, 'left'); TB('r e', W * .66, H * .5, DRED, 34, 'left'); TB('iθ', W * .66 + 55, H * .5 - 16, DRED, 22, 'left');
    TB('i² = −1', W * .64, H * .72, ORANGE, 24, 'left'); TB('e', W * .5, H * .92, INK, 15, 'left'); TB('iπ', W * .5 + 9, H * .92 - 7, INK, 11, 'left'); TB('= −1', W * .5 + 24, H * .92, INK, 15, 'left');
  },
  anim: function(t){
    var m = umb_pl(2.1, 1.45, {ox:W * .3, oy:H * .52, k:Math.min(H * .33, W * .13), grid:true, lab:false}); var b = 0.62, rb = 1.45;
    var a = (t * 0.018) % (2 * Math.PI), wx = rb * Math.cos(b), wy = rb * Math.sin(b), px = rb * Math.cos(a + b), py = rb * Math.sin(a + b);
    umb_circ(m, 1, '#c9d3ea', 1.4, [4, 4]); umb_circ(m, rb, '#f1c5c4', 1.4, [4, 4]);
    for (var i = 0; i < 40; i++){ var aa = a - i * 0.04; ctx.globalAlpha = 0.35 * (1 - i / 40); DOT(m.X(rb * Math.cos(aa + b)), m.Y(rb * Math.sin(aa + b)), 3, RED); } ctx.globalAlpha = 1;
    umb_vec(m, wx, wy, VIOLET, 'w', 2.4); umb_vec(m, Math.cos(a), Math.sin(a), BLUE, 'u', 2.4); umb_vec(m, px, py, RED, 'w·u', 3);
    umb_arc(m, 26, 0, a, BLUE, 2); umb_arc(m, 40, a, a + b, VIOLET, 2.2);
    var x0 = W * .58; TB('w = 1,45 (cos 35° + i sin 35°)', x0, H * .2, VIOLET, 14, 'left');
    umb_panel(['u tourne sur le cercle unité ;', 'w·u décrit le cercle de rayon |w| :', '', '|w·u| = |w| · |u| = 1,45', 'arg(w·u) = arg u + 35°'], x0, H * .36, 13, INK, 21);
    TB('multiplier = tourner + dilater', x0, H * .9, DRED, 14, 'left');
  },
  th: '<div class="tcard"><b class="h">1. Forme algébrique</b><p>On pose i² = −1. Tout nombre complexe s\'écrit z = a + bi avec a = Re(z) et b = Im(z) réels. On additionne partie réelle et partie imaginaire séparément ; on multiplie en développant puis en remplaçant i² par −1 : (2 + 3i)(1 − i) = 2 − 2i + 3i − 3i² = 5 + i.</p><p><b>Conjugué</b> : z̄ = a − bi. On a z + z̄ = 2a, z − z̄ = 2bi et <b>z·z̄ = a² + b²</b>, réel positif. Pour diviser, on multiplie haut et bas par le conjugué du dénominateur : (5 + i)/(2 − 3i) = (5 + i)(2 + 3i)/13 = (7 + 17i)/13. Les puissances de i se répètent par cycle de 4 : i, −1, −i, 1.</p></div>' +
    '<div class="tcard"><b class="h">2. Plan complexe, module et argument</b><p>z = a + bi se place au point (a ; b) du plan. Le <b>module</b> |z| = r = √(a² + b²) est la distance à l\'origine ; l\'<b>argument</b> θ est l\'angle orienté entre l\'axe réel positif et le vecteur, défini modulo 2π, avec cos θ = a/r et sin θ = b/r.</p><p><b>Forme trigonométrique</b> : z = r(cos θ + i sin θ). Attention au quadrant : arctan(b/a) ne donne le bon angle que pour a &gt; 0 ; si a &lt; 0 on ajoute π. Exemple : z = −1 + i a pour module √2 et argument 3π/4, donc z = √2(cos 3π/4 + i sin 3π/4).</p></div>' +
    '<div class="tcard"><b class="h">3. Forme exponentielle et Moivre</b><p><b>Formule d\'Euler</b> : e<sup>iθ</sup> = cos θ + i sin θ, donc z = r·e<sup>iθ</sup>. En particulier e<sup>iπ</sup> = −1. Les règles des exposants font tout le travail : e<sup>iα</sup>·e<sup>iβ</sup> = e<sup>i(α+β)</sup>.</p><p><b>Produit</b> : |z₁z₂| = |z₁||z₂| et arg(z₁z₂) = arg z₁ + arg z₂ — multiplier, c\'est tourner et dilater. <b>Quotient</b> : on divise les modules, on soustrait les arguments. <b>Moivre</b> : (r e<sup>iθ</sup>)<sup>n</sup> = r<sup>n</sup>e<sup>inθ</sup>. Exemple : (1 + i)<sup>10</sup> = (√2 e<sup>iπ/4</sup>)<sup>10</sup> = 32 e<sup>i5π/2</sup> = 32 i.</p></div>' +
    '<div class="tcard"><b class="h">4. Racines n-ièmes et équations du second degré</b><p>Les solutions de zⁿ = w = ρe<sup>iφ</sup> sont les <b>n</b> nombres z<sub>k</sub> = ρ<sup>1/n</sup>·e<sup>i(φ + 2kπ)/n</sup> (k = 0, …, n − 1) : ils forment un polygone régulier inscrit dans le cercle de rayon ρ<sup>1/n</sup>. Exemple : z³ = 8i → √3 + i, −√3 + i, −2i.</p><p>Pour az² + bz + c = 0 (a, b, c réels), Δ = b² − 4ac. Si Δ &lt; 0, les solutions sont complexes conjuguées z = (−b ± i√(−Δ))/(2a). Exemple : r² + 4r + 13 = 0 donne −2 ± 3i, d\'où des oscillations amorties e<sup>−2t</sup>cos 3t.</p></div>' +
    '<div class="tcard"><b class="h">5. Méthode, pièges et usages en sciences</b><p>• Avant de multiplier ou d\'élever à une puissance, passe en forme exponentielle ; avant d\'additionner, reste en forme algébrique. • |z₁ + z₂| ≤ |z₁| + |z₂| (jamais d\'égalité en général). • |z − a| = r est un cercle de centre a ; |z − a| = |z − b| est la médiatrice de [ab]. • Un argument se donne modulo 2π ; indique l\'intervalle choisi.</p><p>En physique et en médecine, les complexes décrivent les signaux sinusoïdaux (impédance d\'un tissu, ECG, oscillations amorties) : la partie réelle de A·e<sup>iωt</sup> est A cos ωt, et dériver revient à multiplier par iω.</p></div>'
});
SFA.figs("c06", [
  /* 1 somme */
  function(p){ var m = umb_pl(4.6, 3.2, {ox:W * .34, oy:H * .58, k:Math.min((W - 30) / 9, (H - 30) / 5.6)});
    umb_vec(m, 3, -2, BLUE, '3 − 2i', 2.8); umb_vec(m, 2, 3, VIOLET, '', 2.6, 3, -2); umb_TB('−1 + 5i', m.X(2.5) + 40, m.Y(.5), '#5249B5', 12);
    var u = umb_clamp(p, 0, .5); if (u > 0) umb_vec(m, 2 - 2 * u, 3 - u, ORANGE, '', 2.6, 2, 3);
    var u2 = umb_clamp(p, .5, 1); if (u2 > 0) umb_vec(m, 0, 2 * u2, RED, '', 3.4);
    umb_pt(m, 3, -2, BLUE, '', 0, 0, 4); umb_pt(m, 2, 3, VIOLET, '', 0, 0, 4); umb_TB('− (2 + i)', m.X(1) - 44, m.Y(3) - 6, '#a05a00', 12);
    if (p > .5) umb_pt(m, 0, 2, RED, '', 0, 0, 6); umb_note('somme = 2i', W * .76, H * .2, p > .5 ? DRED : GREY, 18); },
  /* 2 produit */
  function(p){ var m = umb_pl(6.2, 3.8, {ox:W * .22, oy:H * .5, k:Math.min((W - 30) / 12.4, (H - 20) / 7.6)});
    umb_vec(m, 2, 3, BLUE, '2 + 3i', 2.6); umb_vec(m, 1, -1, VIOLET, '1 − i', 2.6); umb_arc(m, 34, 0, Math.atan2(3, 2), BLUE, 2); umb_arc(m, 24, 0, -Math.PI / 4, VIOLET, 2);
    if (p > 0){ var u = umb_clamp(p, 0, 1); umb_vec(m, 5 * u, 1 * u, RED, p > .7 ? '5 + i' : '', 3.2); umb_arc(m, 46, 0, Math.atan2(1, 5) * u, RED, 2.4); umb_circ(m, Math.hypot(5, 1) * u, 'rgba(226,75,74,.25)', 1.2, [4, 4]); }
    umb_pt(m, 2, 3, BLUE, '', 0, 0, 4); umb_pt(m, 1, -1, VIOLET, '', 0, 0, 4);
    umb_note('56,3° + (−45°) = 11,3°', W * .72, H * .18, p > .6 ? DRED : GREY, 14); umb_note('|z₁||z₂| = √13·√2 = √26', W * .72, H * .3, p > .6 ? DRED : GREY, 14); },
  /* 3 module */
  function(p){ var m = umb_pl(5.2, 4.8, {ox:W * .55, oy:H * .85, k:Math.min((W - 30) / 10.4, (H - 20) / 9.6)});
    umb_seg(m, -3, 0, -3, 4, AX, 1.4, [4, 4]); umb_seg(m, 0, 4, -3, 4, AX, 1.4, [4, 4]); umb_vec(m, -3, 4, BLUE, '', 3); umb_pt(m, -3, 4, BLUE, '−3 + 4i', -48, -8, 6);
    umb_TB('3', m.X(-1.5), m.Y(0) + 16, VIOLET, 14); umb_TB('4', m.X(-3) - 14, m.Y(2), VIOLET, 14);
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .5); umb_TB('|z| = 5', m.X(-1.5) + 4, m.Y(2.1) - 10, DRED, 17); umb_circ(m, 5, 'rgba(226,75,74,.5)', 1.6, [5, 4]); ctx.globalAlpha = 1; umb_TB('√(3² + 4²)', W * .78, H * .3, DRED, 15); } },
  /* 4 quotient */
  function(p){ var m = umb_pl(6.5, 2.6, {ox:W * .24, oy:H * .5, k:Math.min((W - 30) / 13, (H - 20) / 5.2)});
    umb_vec(m, 5, 1, BLUE, '5 + i', 2.6); umb_vec(m, 2, -3, VIOLET, '2 − 3i', 2.6);
    umb_arc(m, 40, 0, Math.atan2(1, 5), BLUE, 2); umb_arc(m, 28, 0, Math.atan2(-3, 2), VIOLET, 2);
    var u = umb_clamp(p, 0, 1); umb_vec(m, 7 / 13 * u, 17 / 13 * u, RED, u > .7 ? '0,54 + 1,31i' : '', 3.2); if (u > .5) umb_arc(m, 54, 0, 1.1760 * u, RED, 2.4);
    umb_note('(5 + i)(2 + 3i) / 13', W * .7, H * .2, p > .5 ? DRED : GREY, 14); umb_note('arg : 11,3° − (−56,3°) = 67,4°', W * .7, H * .32, p > .5 ? DRED : GREY, 13); },
  /* 5 cycle de i */
  function(p){ var m = umb_pl(1.9, 1.5, {ox:W * .3, oy:H * .52, k:Math.min(H * .3, W * .13)}); umb_circ(m, 1, '#c9d3ea', 1.5);
    var L = ['1', 'i', '−1', '−i'], X = [1, 0, -1, 0], Y = [0, 1, 0, -1];
    for (var j = 0; j < 4; j++){ var a0 = j * Math.PI / 2 + .25, a1 = (j + 1) * Math.PI / 2 - .25; umb_arc(m, m.k * 1, a0, a1, '#b9c4e4', 2.2); umb_pt(m, X[j], Y[j], BLUE, '', 0, 0, 6); }
    umb_TB('i⁰ = 1', m.X(1) + 8, m.Y(0) + 18, BLUE_D, 13, 'left'); umb_TB('i¹ = i', m.X(0) + 8, m.Y(1) - 8, BLUE_D, 13, 'left'); umb_TB('i² = −1', m.X(-1) - 8, m.Y(0) + 18, BLUE_D, 13, 'right'); umb_TB('i³ = −i', m.X(0) + 8, m.Y(-1) + 16, BLUE_D, 13, 'left');
    var x0 = W * .58; umb_TB('2027 = 4 × 506 + 3', x0, H * .28, INK, 14, 'left'); umb_TB('2028 = 4 × 507 + 0', x0, H * .42, INK, 14, 'left');
    if (p > 0){ ctx.globalAlpha = umb_clamp(p, 0, .5); umb_TB('i²⁰²⁷ = i³ = −i', x0, H * .62, DRED, 15, 'left'); umb_TB('i²⁰²⁸ = i⁰ = 1', x0, H * .74, DRED, 15, 'left'); umb_TB('somme = 1 − i', x0, H * .88, DRED, 16, 'left'); ctx.globalAlpha = 1; umb_pt(m, 0, -1, RED, '', 0, 0, 9, 0); DOT(m.X(0), m.Y(-1), 9, RED, false); DOT(m.X(1), m.Y(0), 9, RED, false); } },
  /* 6 argument */
  function(p){ var m = umb_pl(2.8, 1.8, {ox:W * .5, oy:H * .78, k:Math.min((W - 30) / 5.6, (H - 20) / 3.2)}); umb_circ(m, 1, '#d9deea', 1.2);
    umb_vec(m, -1, 1, BLUE, '', 3); umb_pt(m, -1, 1, BLUE, '−1 + i', -46, -10, 6);
    umb_seg(m, 1, -1, 0, 0, '#e8b0af', 1.4, [4, 4]); umb_TB('−π/4 ?', m.X(1) + 6, m.Y(-1) - 4, '#c88', 13, 'left'); umb_TB('π/4 ?', m.X(1) + 6, m.Y(1) - 4, '#c88', 13, 'left');
    umb_arc(m, 36, 0, 3 * Math.PI / 4 * umb_clamp(p, 0, 1), RED, 2.8); if (p > .4) umb_TB('3π/4', m.X(0) + 6, m.Y(0) - 40, DRED, 16, 'left'); umb_arc(m, 22, Math.PI, 3 * Math.PI / 4, VIOLET, 2); umb_TB('π/4', m.X(-1) + 6, m.Y(0) + 4, '#5249B5', 11, 'left'); },
  /* 7 oscillation amortie */
  function(p){ var ox = W * .1, oy = H * .5, sx = (W * .86) / 4.2, sy = H * .36;
    LN(ox - 6, oy, W - 8, oy, '#9aa0a6', 1.3); LN(ox, 8, ox, H - 8, '#9aa0a6', 1.3); umb_TB('t', W - 14, oy - 8, GREY, 12); umb_TB('x', ox + 12, 16, GREY, 12);
    ctx.setLineDash([5, 4]); [-1, 1].forEach(function(s){ ctx.strokeStyle = '#e0a3a2'; ctx.lineWidth = 1.4; ctx.beginPath(); for (var i = 0; i <= 120; i++){ var t = 4.2 * i / 120, y = s * Math.exp(-2 * t); if (i) ctx.lineTo(ox + t * sx, oy - y * sy); else ctx.moveTo(ox + t * sx, oy - y * sy); } ctx.stroke(); }); ctx.setLineDash([]);
    var N = Math.round(300 * (p > 0 ? 1 : 1)); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.6; ctx.beginPath(); for (var i = 0; i <= N; i++){ var t = 4.2 * i / N, y = Math.exp(-2 * t) * Math.cos(3 * t); if (i) ctx.lineTo(ox + t * sx, oy - y * sy); else ctx.moveTo(ox + t * sx, oy - y * sy); } ctx.stroke();
    var T = 2 * Math.PI / 3; LN(ox + T * sx, oy - 40, ox + T * sx, oy + 40, GREEN, 2); umb_TB('T ≈ 2,09', ox + T * sx + 6, oy + 36, DGREEN, 13, 'left'); umb_TB('e^(−2t)', ox + .9 * sx, oy - 1.0 * sy * Math.exp(-1.8) - 12, DRED, 12);
    var m = umb_pl(3.5, 3.5, {ox:W * .8, oy:H * .26, k:Math.min(H * .06, 18), grid:false, xl:false, yl:false}); umb_pt(m, -2, 3, RED, '−2 + 3i', 8, -4, 4, 11); umb_pt(m, -2, -3, RED, '−2 − 3i', 8, 10, 4, 11);
    if (p > 0) umb_note('racines : −2 ± 3i', W * .74, H * .92, DRED, 14); },
  /* 8 Moivre */
  function(p){ var R = 36, k = Math.min((W * .46) / R, (H * .5) / R), ox = W * .3, oy = H * .64; ctx.strokeStyle = '#eceef1'; LN(8, oy, W * .62, oy, '#9aa0a6', 1.3); LN(ox, H - 8, ox, 8, '#9aa0a6', 1.3);
    var pts = []; for (var j = 0; j <= 10; j++){ var r = Math.pow(Math.SQRT2, j), a = j * Math.PI / 4; pts.push([ox + r * Math.cos(a) * k, oy - r * Math.sin(a) * k]); }
    var vis = 3 + Math.round(umb_clamp(p, 0, 1) * 8); ctx.strokeStyle = '#9bb3dd'; ctx.lineWidth = 1.8; ctx.beginPath(); for (j = 0; j <= 10; j++){ var rr = Math.pow(Math.SQRT2, j * 1); } ctx.beginPath(); for (var s = 0; s <= 400 * vis / 10; s++){ var jj = s / 40, r2 = Math.pow(Math.SQRT2, jj), a2 = jj * Math.PI / 4; if (s) ctx.lineTo(ox + r2 * Math.cos(a2) * k, oy - r2 * Math.sin(a2) * k); else ctx.moveTo(ox + r2 * Math.cos(a2) * k, oy - r2 * Math.sin(a2) * k); } ctx.stroke();
    for (j = 0; j <= Math.min(vis, 10); j++) DOT(pts[j][0], pts[j][1], j === 10 ? 6 : 3.5, j === 10 ? RED : BLUE);
    if (vis >= 10) umb_TB('(1 + i)¹⁰ = 32 i', pts[10][0] + 10, pts[10][1] + 4, DRED, 14, 'left'); umb_TB('1 + i', pts[1][0] + 6, pts[1][1] - 8, BLUE_D, 12, 'left');
    umb_panel(['1 + i = √2·e^(iπ/4)', 'à chaque puissance :', 'module × √2, angle + 45°', '', 'k = 10 : (√2)¹⁰ = 32', '10 × 45° = 450° ≡ 90°'], W * .6, H * .2, 10, INK, 22); },
  /* 9 conjugué du quotient */
  function(p){ var m = umb_pl(2.2, 1.5, {ox:W * .3, oy:H * .5, k:Math.min(H * .3, W * .11)}); umb_circ(m, 1, '#d9deea', 1.2);
    umb_vec(m, 1, 1, BLUE, '1 + i', 2.4); umb_vec(m, 1, -1, VIOLET, '1 − i', 2.4); umb_arc(m, 30, 0, Math.PI / 4, BLUE, 2); umb_arc(m, 38, 0, -Math.PI / 4, VIOLET, 2);
    var u = umb_clamp(p, 0, 1); umb_vec(m, 0, 1, GREEN, 'i', 3); umb_pt(m, 0, 1, GREEN, '', 0, 0, 6);
    if (u > .4){ ctx.globalAlpha = umb_clamp(p, .4, 1); umb_vec(m, 0, -1, RED, '−i = z̄', 3); umb_seg(m, 0.12, 1, 0.12, -1, '#e8b0af', 1.2, [4, 4]); ctx.globalAlpha = 1; }
    var x0 = W * .56; umb_panel(['z = (1 + i)/(1 − i)', '= (1 + i)² / 2', '= 2i / 2 = i'], x0, H * .3, 14, INK, 24); if (p > .4) umb_TB('conjugué : −i', x0, H * .8, DRED, 16, 'left'); },
  /* 10 racines cubiques */
  function(p){ var m = umb_pl(2.7, 2.7, {ox:W * .5, oy:H * .5, k:Math.min((W - 30) / 5.4, (H - 20) / 5.4)}); umb_circ(m, 2, '#d9deea', 1.5, [5, 4]);
    var rs = [[Math.sqrt(3), 1, '√3 + i'], [-Math.sqrt(3), 1, '−√3 + i'], [0, -2, '−2i']]; var u = umb_clamp(p, 0, 1);
    if (u > 0){ ctx.beginPath(); rs.forEach(function(q, i){ if (i) ctx.lineTo(m.X(q[0]), m.Y(q[1])); else ctx.moveTo(m.X(q[0]), m.Y(q[1])); }); ctx.closePath(); ctx.fillStyle = 'rgba(55,138,221,' + .1 * u + ')'; ctx.fill(); ctx.strokeStyle = 'rgba(55,138,221,' + .5 * u + ')'; ctx.lineWidth = 1.6; ctx.stroke(); }
    umb_vec(m, 0, 2, VIOLET, '', 2.6); umb_pt(m, 0, 2, VIOLET, '8i  (rayon 8)', 12, -2, 5, 12);
    rs.forEach(function(q, i){ umb_seg(m, 0, 0, q[0], q[1], '#cfd6e6', 1.4); ctx.globalAlpha = u; umb_pt(m, q[0], q[1], RED, q[2], q[0] > 0 ? 12 : (q[0] < 0 ? -12 : 14), q[1] > 0 ? -10 : 14, 6); ctx.globalAlpha = 1; });
    if (u > .5){ umb_arc(m, 26, 0, Math.PI / 6, DGREEN, 1.8); umb_TB('30°', m.X(0) + 36, m.Y(0) - 4, DGREEN, 12, 'left'); umb_TB('120°', m.X(0) - 6, m.Y(0) + 40, DGREEN, 12, 'right'); } },
  /* 11 robot */
  function(p){ var m = umb_pl(7.2, 7.2, {ox:W * .12, oy:H * .9, k:Math.min((W - 40) / 8, (H - 56) / 7.4)});
    umb_vec(m, 4, 2, BLUE, 'z = 4 + 2i', 2.8); umb_arc(m, 58, 0, Math.atan2(2, 4), BLUE, 1.6);
    var u = umb_clamp(p, 0, .55), v = umb_clamp(p, .5, 1), a0 = Math.atan2(2, 4), r0 = Math.hypot(4, 2);
    if (p > 0){ var a = a0 + u * Math.PI / 3; umb_vec(m, r0 * Math.cos(a), r0 * Math.sin(a), VIOLET, u > .9 ? 'rotation 60°' : '', 2.6); umb_arc(m, 76, a0, a, VIOLET, 2.2);
      if (v > 0){ var r = r0 * (1 + .5 * v), a1 = a0 + Math.PI / 3; umb_vec(m, r * Math.cos(a1), r * Math.sin(a1), RED, v > .9 ? 'z′ ≈ 0,40 + 6,70 i' : '', 3.2); umb_circ(m, r, 'rgba(226,75,74,.2)', 1.1, [4, 4]); } }
    umb_pt(m, 4, 2, BLUE, '', 0, 0, 4); umb_note('× 1,5 · e^(iπ/3)', W * .74, H * .85, p > .5 ? DRED : GREY, 15); },
  /* 12 lieu */
  function(p){ var m = umb_pl(3.4, 2.7, {ox:W * .45, oy:H * .56, k:Math.min((W - 30) / 6.8, (H - 20) / 5.4)});
    var u = umb_clamp(p, 0, 1); if (u > 0){ ctx.save(); ctx.globalAlpha = u; var ya = (1.5 - (-3.5)) / 2, yb = (1.5 - 3.5) / 2; umb_seg(m, -3.5, 2.5 * 0 + (1.5 + 3.5) / 2, 3.5, (1.5 - 3.5) / 2, RED, 3); ctx.restore(); }
    umb_pt(m, 0, 2, BLUE, 'A (2i)', 10, -8, 6); umb_pt(m, -1, 0, VIOLET, 'B (−1)', -4, 18, 6); umb_seg(m, 0, 2, -1, 0, '#cfd6e6', 1.4, [4, 4]);
    var x = 1.1, y = (1.5 - x) / 2, x2 = -1.9, y2 = (1.5 - x2) / 2; [[x, y], [x2, y2]].forEach(function(q, i){ ctx.globalAlpha = u > 0 ? Math.max(.25, u) : .35; umb_pt(m, q[0], q[1], ORANGE, 'M' + (i + 1), 10, -8, 5); umb_seg(m, q[0], q[1], 0, 2, '#e3b373', 1.3, [3, 3]); umb_seg(m, q[0], q[1], -1, 0, '#e3b373', 1.3, [3, 3]); ctx.globalAlpha = 1; });
    umb_note('|z − 2i| = |z + 1|', W * .74, H * .14, INK, 14); if (p > .5) umb_note('x + 2y = 3/2', W * .76, H * .9, DRED, 16); },
  /* 13 cos 3θ */
  function(p){ var m = umb_pl(1.6, 1.3, {ox:W * .3, oy:H * .55, k:Math.min(H * .33, W * .14)}); umb_circ(m, 1, '#cfd6e6', 1.5);
    var a = Math.PI / 9, u = umb_clamp(p, 0, 1); umb_vec(m, Math.cos(a), Math.sin(a), BLUE, '', 2.6); umb_arc(m, 36, 0, a, BLUE, 2.2); umb_pt(m, Math.cos(a), Math.sin(a), BLUE, 'θ = 20°', 10, -12, 4);
    umb_seg(m, Math.cos(a), 0, Math.cos(a), Math.sin(a), AX, 1.2, [3, 3]);
    if (u > 0){ ctx.globalAlpha = u; umb_vec(m, Math.cos(3 * a), Math.sin(3 * a), RED, '', 3); umb_arc(m, 52, 0, 3 * a, RED, 2.4); umb_pt(m, Math.cos(3 * a), Math.sin(3 * a), RED, '3θ = 60°', 10, -12, 5); umb_seg(m, Math.cos(3 * a), 0, Math.cos(3 * a), Math.sin(3 * a), '#e8b0af', 1.2, [3, 3]); ctx.globalAlpha = 1; }
    umb_panel(['(cos θ + i sin θ)³', '= cos 3θ + i sin 3θ', 'cos 3θ = 4cos³θ − 3cosθ', '8x³ − 6x − 1 = 0 pour x = cos 20°'], W * .5, H * .24, 10, INK, 26); },
  /* 14 racines 7e */
  function(p){ var m = umb_pl(1.4, 1.3, {ox:W * .3, oy:H * .5, k:Math.min(H * .34, W * .13)}); umb_circ(m, 1, '#cfd6e6', 1.5); var pts = [];
    for (var j = 0; j < 7; j++){ var a = 2 * Math.PI * j / 7; pts.push([Math.cos(a), Math.sin(a)]); }
    ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(m.X(q[0]), m.Y(q[1])); else ctx.moveTo(m.X(q[0]), m.Y(q[1])); }); ctx.closePath(); ctx.fillStyle = 'rgba(55,138,221,.08)'; ctx.fill(); ctx.strokeStyle = 'rgba(55,138,221,.55)'; ctx.lineWidth = 1.6; ctx.stroke();
    var u = umb_clamp(p, 0, 1); pts.forEach(function(q, i){ umb_pt(m, q[0], q[1], i ? BLUE : RED, '', 0, 0, 5); if (i && u > 0){ ctx.globalAlpha = u; umb_seg(m, q[0], q[1], q[0], 0, '#9bb3dd', 1.2, [3, 3]); umb_pt(m, q[0], 0, GREEN, '', 0, 0, 3.5); ctx.globalAlpha = 1; } });
    umb_panel(['1 + 2[cos 2π/7 + cos 4π/7', '          + cos 6π/7] = 0', '', 'cos 2π/7 ≈ 0,623', 'cos 4π/7 ≈ −0,223', 'cos 6π/7 ≈ −0,901'], W * .5, H * .2, 13, INK, 24); if (p > .5) umb_TB('somme = −1/2', W * .5, H * .92, DRED, 17, 'left'); }
]);
