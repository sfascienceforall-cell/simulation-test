/* Mathématiques BA1 · chapitre 11 : grandes expériences mathématiques · théorie animée et devantures (préfixe m11_) */
function m11_rng(seed){ var s = seed >>> 0 || 1; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function m11_cl(p, a, b){ return Math.max(0, Math.min(1, (p - a) / (b - a))); }
function m11_fx(v, d){ return String(v.toFixed(d)).replace('.', ','); }
function m11_poly(pts, fill, stroke, w){ ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath(); if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = w || 2; ctx.stroke(); } }
function m11_bg(c){ ctx.fillStyle = c || '#f6f7fb'; ctx.fillRect(0, 0, W, H); }
function m11_gp(x, y, sz, fn){ ctx.save(); ctx.translate(x, y); fn(); ctx.restore(); }
function m11_ngon(cx, cy, r, n, rot){ var a = []; for (var i = 0; i < n; i++){ var t = rot + 2 * Math.PI * i / n; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } return a; }

/* échantillon Monte-Carlo partagé (déterministe) */
var m11_MC = (function(){ var r = m11_rng(2026), N = 4000, xs = [], ys = [], cum = [0], k = 0; for (var i = 0; i < N; i++){ var x = r(), y = r(); xs.push(x); ys.push(y); if (x * x + y * y <= 1) k++; cum.push(k); } return {N:N, xs:xs, ys:ys, cum:cum}; })();

function m11_square(x0, y0, s, n, dot){
  ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, s, s);
  ctx.strokeStyle = '#c9d1dc'; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, s, s);
  var i; for (i = 0; i < n; i++){ var ins = m11_MC.xs[i] * m11_MC.xs[i] + m11_MC.ys[i] * m11_MC.ys[i] <= 1; ctx.fillStyle = ins ? 'rgba(30,63,143,.75)' : 'rgba(214,51,108,.7)'; ctx.fillRect(x0 + m11_MC.xs[i] * s - dot / 2, y0 + (1 - m11_MC.ys[i]) * s - dot / 2, dot, dot); }
  ctx.strokeStyle = DGREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x0, y0 + s, s, -Math.PI / 2, 0); ctx.stroke();
}

SFA.theo("c11", {
  icon: function(){
    m11_bg('#f6f7fb');
    var s = H * .66, x0 = W * .07, y0 = H * .17; m11_square(x0, y0, s, 700, 2.4);
    TB('π', W * .66, H * .5, BLUE_D, 78, 'left');
    TB('≈ 3,14159', W * .5, H * .72, ORANGE, 22, 'left'); TB('le hasard calcule', W * .6, H * .88, DGREEN, 16, 'left');
  },
  anim: function(t){
    m11_bg('#fff');
    var N = 3000, n = Math.max(1, Math.floor((t * 4) % (N + 240))); if (n > N) n = N;
    var s = Math.min(H - 56, W * .38), x0 = 20, y0 = 30; m11_square(x0, y0, s, n, 2.2);
    TB('x² + y² ≤ 1', x0 + s * .55, y0 + s * .5, DGREEN, 14, 'left');
    var k = m11_MC.cum[n], est = 4 * k / n;
    var gx = x0 + s + 50, gw = W - gx - 24, gy = 34, gh = H - 98; LN(gx, gy + gh, gx + gw, gy + gh, AX, 1.4); LN(gx, gy, gx, gy + gh, AX, 1.4);
    function Y(v){ return gy + gh * (3.7 - v) / 1.1; } function X(i){ return gx + gw * Math.log(i + 1) / Math.log(N + 1); }
    LN(gx, Y(Math.PI), gx + gw, Y(Math.PI), GREEN, 1.8, [6, 4]); TB('π', gx - 12, Y(Math.PI) + 5, DGREEN, 16, 'right');
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.2; ctx.beginPath(); for (var i = 1; i <= n; i += (n > 600 ? 3 : 1)){ var e = 4 * m11_MC.cum[i] / i, yy = Math.max(gy, Math.min(gy + gh, Y(e))); if (i === 1) ctx.moveTo(X(i), yy); else ctx.lineTo(X(i), yy); } ctx.stroke();
    TB('estimation de π (abscisse logarithmique)', gx + gw / 2, gy - 12, GREY, 12);
    TB('n = ' + n + '   dedans : ' + k, x0, H - 14, INK, 14, 'left'); TB('4k/n = ' + m11_fx(est, 4) + '   écart ≈ ' + m11_fx(Math.abs(est - Math.PI), 4), gx, H - 14, DRED, 14, 'left');
    TB('Erreur typique ≈ 1,64/√n : 100 fois plus de points = 10 fois plus de précision', W * .5, 16, GREY, 12);
  },
  th: '<div class="tcard"><b class="h">1. Le hasard qui calcule : la loi des grands nombres</b><p>Quand on répète une expérience aléatoire <b>n</b> fois, la fréquence d\'un événement se rapproche de sa probabilité <b>p</b>. Mieux : l\'écart typique vaut √(p(1 − p)/n), il décroît en <b>1/√n</b>. Pour gagner un chiffre décimal, il faut 100 fois plus d\'essais. C\'est le moteur de Buffon (1733) et de la méthode de Monte-Carlo (1946).</p><p><i>Exemple chiffré</i> : 4 × (points dans le quart de disque)/n estime π, car la probabilité d\'être dans le quart de disque vaut π/4. Avec n = 2 000, l\'écart-type est ≈ 1,642/√2000 ≈ 0,037.</p></div>' +
    '<div class="tcard"><b class="h">2. Probabilités : de la binomiale à la cloche</b><p>Une bille de Galton à n rangées finit dans la case k avec la probabilité <b>C(n ; k)/2ⁿ</b> (loi binomiale). Quand n grandit, l\'histogramme épouse une <b>courbe en cloche</b> (théorème central limite) de moyenne n/2 et d\'écart-type √n/2. Même mécanisme pour la marche aléatoire : après n pas de ±1, la position a pour écart-type <b>√n</b>.</p><p><b>Piège</b> : Monty Hall et les anniversaires se calculent avec des probabilités conditionnelles ou le complémentaire : P(au moins deux dates identiques) = 1 − 365·364·…/365ⁿ ≈ 70,6 % pour n = 30. Changer de porte fait gagner avec la probabilité 2/3.</p></div>' +
    '<div class="tcard"><b class="h">3. Suites, limites et nombres célèbres</b><p>Archimède encadre π par des polygones à 6, 12, 24, 48, 96 côtés (le cercle de diamètre 1 a pour demi-périmètre π). Les intérêts composés donnent <b>(1 + 1/n)ⁿ → e ≈ 2,71828</b>. Fibonacci (1, 1, 2, 3, 5, 8…) vérifie F(n+1)/F(n) → <b>φ = (1 + √5)/2 ≈ 1,618</b> ; le tournesol place ses graines tous les <b>137,5°</b> (angle d\'or) et montre des spirales en nombres de Fibonacci (21 et 34).</p><p>L\'application logistique <b>xₙ₊₁ = r·xₙ(1 − xₙ)</b> a le point fixe 1 − 1/r, stable si |f′| = |2 − r| &lt; 1 ; puis cycles de période 2, 4, 8… et chaos vers r ≈ 3,57.</p></div>' +
    '<div class="tcard"><b class="h">4. Fractales, itérations et dimension</b><p>Le jeu du chaos (un point qui saute à mi-chemin d\'un sommet tiré au hasard) dessine le triangle de Sierpiński ; l\'ensemble de Mandelbrot est l\'ensemble des c tels que zₙ₊₁ = zₙ² + c reste borné. Une fractale a une dimension non entière : <b>d = ln n / ln(1/s)</b> (n copies réduites au rapport s). Sierpiński : d = ln 3/ln 2 ≈ 1,585. La suite de Collatz (n pair → n/2, impair → 3n + 1) retombe toujours sur 1... mais nul ne sait le prouver.</p></div>' +
    '<div class="tcard"><b class="h">5. Courbes, séries et graphes</b><p>Taylor : sin x ≈ <b>x − x³/3! + x⁵/5! − …</b> ; l\'erreur est bornée par |x|ⁿ⁺¹/(n+1)!. Brachistochrone : parmi toutes les courbes qui joignent A à B, la <b>cycloïde</b> est celle de plus courte durée de descente (Jean Bernoulli, 1696), meilleure que la droite. Épicycles : toute courbe fermée est une somme de cercles tournants (Fourier). Euler (1736) : un graphe connexe admet un chemin qui emprunte chaque arête une seule fois ssi il a <b>0 ou 2 sommets de degré impair</b> : les sept ponts de Königsberg en ont 4, c\'est impossible. Le ruban de Möbius n\'a qu\'une face et qu\'un bord.</p></div>'
});

SFA.figs("c11", [
  /* 1 Buffon */
  function(p){
    m11_bg('#fbf7ef'); var d = H * .28, ell = d * .8, r = m11_rng(7), i, y;
    for (i = 0; i < 4; i++){ y = H * .08 + i * d; LN(0, y, W * .62, y, '#b8956a', 2.4); }
    for (i = 0; i < 14; i++){ var cx = 14 + r() * (W * .62 - 28), cy = H * .08 + r() * 3 * d, a = r() * Math.PI, dx = Math.cos(a) * ell / 2, dy = Math.sin(a) * ell / 2;
      var y1 = cy - dy, y2 = cy + dy, hit = false; for (var k = 0; k < 4; k++){ var yl = H * .08 + k * d; if ((y1 - yl) * (y2 - yl) <= 0) hit = true; }
      LN(cx - dx, cy - dy, cx + dx, cy + dy, hit ? RED : BLUE_D, 3); }
    TB('d = 5 cm', W * .66, H * .2, GREY, 14, 'left'); TB('ℓ = 4 cm', W * .66, H * .34, GREY, 14, 'left'); TB('P = 2ℓ/(πd)', W * .66, H * .52, BLUE_D, 18, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('= 8/(5π)', W * .66, H * .68, DRED, 18, 'left'); TB('≈ 0,509', W * .66, H * .84, DRED, 24, 'left'); ctx.globalAlpha = 1;
  },
  /* 2 pi Monte-Carlo */
  function(p){
    m11_bg('#f6f7fb'); var s = H * .84, x0 = 18, y0 = H * .08; m11_square(x0, y0, s, 600, 2.4);
    TB('2 000 points', W * .56, H * .2, GREY, 16, 'left'); TB('1 570 dedans', W * .56, H * .38, BLUE_D, 18, 'left'); TB('1 570/2 000 = 0,785', W * .56, H * .56, INK, 16, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('π ≈ 4 × 0,785', W * .56, H * .74, DGREEN, 18, 'left'); TB('= 3,14', W * .56, H * .9, DRED, 26, 'left'); ctx.globalAlpha = 1;
  },
  /* 3 Monty Hall */
  function(p){
    m11_bg('#f6f7fb'); var dw = W * .17, dh = H * .5, gap = W * .07, x0 = (W - 3 * dw - 2 * gap) / 2, y0 = H * .14, i;
    for (i = 0; i < 3; i++){ var x = x0 + i * (dw + gap), open = i === 2, win = i === 1 && p > .3;
      ctx.fillStyle = open ? '#e8eef7' : win ? '#d9f2e6' : '#f1d9a8'; ctx.strokeStyle = i === 0 ? RED : win ? GREEN : '#8a6a2b'; ctx.lineWidth = i === 0 || win ? 4 : 2.4; ctx.beginPath(); ctx.roundRect(x, y0, dw, dh, 8); ctx.fill(); ctx.stroke();
      TB(String(i + 1), x + dw / 2, y0 - 8, INK, 16);
      if (open) TB('chèvre', x + dw / 2, y0 + dh / 2, GREY, 15); else if (win) TB('voiture', x + dw / 2, y0 + dh / 2, DGREEN, 15); else TB('?', x + dw / 2, y0 + dh / 2 + 10, '#8a6a2b', 36); }
    TB('ton choix', x0 + dw / 2, y0 + dh + 20, DRED, 14); TB('ouverte', x0 + 2 * (dw + gap) + dw / 2, y0 + dh + 20, GREY, 14);
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('rester : 1/3', W * .27, H * .93, DRED, 16); TB('changer : 2/3', W * .73, H * .93, DGREEN, 18); ctx.globalAlpha = 1;
  },
  /* 4 anniversaires */
  function(p){
    m11_bg('#fff'); var L = 46, R = 16, T = 22, B = 34, gw = W - L - R, gh = H - T - B; function X(n){ return L + gw * n / 60; } function Y(v){ return T + gh * (1 - v); }
    for (var g = 0; g <= 1; g += .25){ LN(L, Y(g), W - R, Y(g), '#e8ebf0', 1); TB(Math.round(g * 100) + ' %', L - 6, Y(g) + 4, GREY, 12, 'right'); }
    for (var n = 0; n <= 60; n += 10) TB(String(n), X(n), H - B + 18, GREY, 12);
    LN(L, T, L, T + gh, AX, 1.4); LN(L, T + gh, W - R, T + gh, AX, 1.4); TB('élèves dans la classe', W - R, H - 6, GREY, 12, 'right');
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath(); var pr = 1; for (n = 1; n <= 60; n++){ pr *= (365 - n + 1) / 365; var v = 1 - pr; if (n === 1) ctx.moveTo(X(n), Y(v)); else ctx.lineTo(X(n), Y(v)); } ctx.stroke();
    var q = 1; for (n = 1; n <= 30; n++) q *= (365 - n + 1) / 365; var v30 = 1 - q;
    LN(L, Y(.5), W - R, Y(.5), '#c9d1dc', 1.4, [5, 4]); DOT(X(30), Y(v30), 6, p > 0 ? RED : BLUE_D); TB('n = 30', X(30) + 10, Y(v30) + 22, INK, 14, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); LN(L, Y(v30), X(30), Y(v30), RED, 1.8, [5, 4]); TB('≈ ' + m11_fx(v30 * 100, 1) + ' %', X(30) - 14, Y(v30) - 10, DRED, 18, 'right'); ctx.globalAlpha = 1;
  },
  /* 5 Galton */
  function(p){
    m11_bg('#f6f7fb'); var n = 10, c = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1], L = 20, bw = (W - 2 * L) / 11, base = H - 38, sc = (H - 70) / 252;
    for (var k = 0; k <= n; k++){ var h = c[k] * sc, hi = k === 5; ctx.fillStyle = hi ? (p > 0 ? RED : ORANGE) : '#a9c1ea'; ctx.fillRect(L + k * bw + 3, base - h, bw - 6, h); TB(String(k), L + k * bw + bw / 2, base + 18, hi ? DRED : GREY, 13); if (hi || p > .6) TB(String(c[k]), L + k * bw + bw / 2, base - h - 6, INK, 12); }
    TB('C(10 ; k) / 1 024', W * .02, 22, BLUE_D, 15, 'left'); TB('case n° 5', W * .5, base + 34, DRED, 13);
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('P = 252/1 024 ≈ 0,246', W * .98, 22, DRED, 16, 'right'); ctx.globalAlpha = 1;
  },
  /* 6 Archimède */
  function(p){
    m11_bg('#f6f7fb'); var cx = W * .24, cy = H * .5, r = H * .36; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    var n = p > .4 ? 12 : 6, R = r / Math.cos(Math.PI / n); m11_poly(m11_ngon(cx, cy, r, n, -Math.PI / 2), 'rgba(46,107,85,.18)', DGREEN, 2.4); m11_poly(m11_ngon(cx, cy, R, n, -Math.PI / 2 + Math.PI / n), null, RED, 2.4);
    var P6 = 2 * Math.sqrt(3), p6 = 3, P12 = 2 * p6 * P6 / (p6 + P6), p12 = Math.sqrt(p6 * P12), P24 = 2 * p12 * P12 / (p12 + P12), p24 = Math.sqrt(p12 * P24);
    TB('diamètre 1', cx, cy + 5, GREY, 13); TB(n + ' côtés', W * .5, H * .16, INK, 16, 'left');
    TB('p₆ = 3 < π < P₆ = ' + m11_fx(P6, 4), W * .5, H * .34, INK, 12, 'left');
    ctx.globalAlpha = m11_cl(p, .3, .6); TB('12 côtés : ' + m11_fx(p12, 4) + ' < π < ' + m11_fx(P12, 4), W * .5, H * .52, DGREEN, 12, 'left'); ctx.globalAlpha = 1;
    ctx.globalAlpha = m11_cl(p, .6, .9); TB('24 côtés : ' + m11_fx(p24, 4) + ' < π < ' + m11_fx(P24, 4), W * .5, H * .7, DRED, 12, 'left'); ctx.globalAlpha = 1;
  },
  /* 7 logistique */
  function(p){
    m11_bg('#fff'); var r = 2.8, S = Math.min(H - 40, W * .5), x0 = 40, y0 = 14; function X(v){ return x0 + v * S; } function Y(v){ return y0 + S * (1 - v); }
    ctx.strokeStyle = '#e8ebf0'; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, S, S); LN(X(0), Y(0), X(1), Y(1), GREY, 1.6);
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 100; i++){ var v = i / 100, f = r * v * (1 - v); if (i) ctx.lineTo(X(v), Y(f)); else ctx.moveTo(X(v), Y(f)); } ctx.stroke();
    var steps = Math.round(m11_cl(p, 0, .9) * 14), x = .5; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(x), Y(0)); for (i = 0; i < steps; i++){ var y = r * x * (1 - x); ctx.lineTo(X(x), Y(y)); ctx.lineTo(X(y), Y(y)); x = y; } ctx.stroke();
    var xs = 1 - 1 / r; DOT(X(xs), Y(xs), 6, RED); TB('x* = 1 − 1/r ≈ 0,6429', X(xs) + 12, Y(xs) + 26, DRED, 13, 'left');
    TB('r = 2,8', x0 + S + 24, H * .2, BLUE_D, 18, 'left'); TB('x₀ = 0,5', x0 + S + 24, H * .36, GREY, 14, 'left'); TB('f′(x*) = 2 − r = −0,8', x0 + S + 24, H * .56, INK, 14, 'left'); ctx.globalAlpha = m11_cl(p, 0, .4); TB('|f′| < 1 : stable', x0 + S + 24, H * .74, DGREEN, 16, 'left'); ctx.globalAlpha = 1;
  },
  /* 8 tournesol */
  function(p){
    m11_bg('#fdf8e8'); var cx = W * .3, cy = H * .5, R = H * .44, N = 520, ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 1; i <= N; i++){ var rr = R * Math.sqrt(i / N), a = i * ga, col = '#c98a1a'; if (p > 0){ if (i % 21 === 0) col = RED; else if (i % 34 === 0) col = BLUE_D; else col = '#d9c58f'; } DOT(cx + rr * Math.cos(a), cy + rr * Math.sin(a), p > 0 && (i % 21 === 0 || i % 34 === 0) ? 4.2 : 3.2, col); }
    TB('137,5° par graine', W * .62, H * .2, INK, 14, 'left'); TB('21 et 34 spirales', W * .62, H * .42, p > 0 ? DRED : GREY, 14, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('21 et 34 : Fibonacci', W * .62, H * .62, DGREEN, 16, 'left'); TB('34/21 ≈ 1,619 ≈ φ', W * .62, H * .8, BLUE_D, 16, 'left'); ctx.globalAlpha = 1;
  },
  /* 9 Taylor */
  function(p){
    m11_bg('#fff'); var k = Math.min((W - 30) / 8, (H - 20) / 3.4), ox = W * .46, oy = H * .5; function X(x){ return ox + x * k; } function Y(y){ return oy - y * k; }
    LN(8, oy, W - 8, oy, AX, 1.3); LN(ox, H - 6, ox, 6, AX, 1.3);
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath(); for (var x = -4; x <= 4.001; x += .05){ if (x < -4 + .01) ctx.moveTo(X(x), Y(Math.sin(x))); else ctx.lineTo(X(x), Y(Math.sin(x))); } ctx.stroke();
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.beginPath(); var st = false; for (x = -4; x <= 4.001; x += .05){ var y = x - x * x * x / 6; if (Math.abs(y) > 1.7) continue; if (!st){ ctx.moveTo(X(x), Y(y)); st = true; } else ctx.lineTo(X(x), Y(y)); } ctx.globalAlpha = .45 + .55 * m11_cl(p, 0, .3); ctx.stroke(); ctx.globalAlpha = 1;
    DOT(X(.5), Y(Math.sin(.5)), 5, RED); TB('sin x', X(2.7), Y(.55) - 18, BLUE_D, 15, 'left'); TB('T₃(x) = x − x³/6', X(1.2), Y(1.45), ORANGE, 14, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('T₃(0,5) = 0,479167', W * .98, H * .86, DRED, 14, 'right'); TB('sin 0,5 = 0,479426', W * .98, H * .96, DGREEN, 14, 'right'); ctx.globalAlpha = 1;
  },
  /* 10 musée / Euler */
  function(p){
    m11_bg('#f6f7fb'); var cx = W * .36, cy = H * .52, R = H * .36, nm = ['A', 'B', 'C', 'D', 'E'], dg = [4, 3, 3, 2, 2], P = [[cx, cy - R * .05], [cx - R * 1.15, cy - R * .6], [cx + R * 1.15, cy - R * .6], [cx - R * .75, cy + R * .95], [cx + R * .75, cy + R * .95]];
    var E = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [2, 4]];
    E.forEach(function(e){ LN(P[e[0]][0], P[e[0]][1], P[e[1]][0], P[e[1]][1], '#9aa8c0', 3); });
    if (p > 0){ var path = [1, 2, 0, 1, 3, 0, 4, 2], q = Math.round(m11_cl(p, 0, .9) * 7); ctx.strokeStyle = RED; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(P[1][0], P[1][1]); for (var i = 1; i <= q; i++){ ctx.lineTo(P[path[i]][0], P[path[i]][1]); } ctx.stroke(); }
    for (var j = 0; j < 5; j++){ var odd = dg[j] % 2; DOT(P[j][0], P[j][1], 20, odd ? '#fdece4' : '#e6f1fb'); ctx.strokeStyle = odd ? ORA2 : BLUE; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(P[j][0], P[j][1], 20, 0, 7); ctx.stroke(); TB(nm[j] + ' · ' + dg[j], P[j][0], P[j][1] + 5, INK, 14); }
    TB('7 portes', W * .72, H * .22, INK, 16, 'left'); TB('2 salles impaires', W * .72, H * .42, ORA2, 15, 'left'); ctx.globalAlpha = m11_cl(p, 0, .4); TB('chemin de B à C', W * .72, H * .64, DRED, 16, 'left'); TB('(Euler)', W * .72, H * .8, GREY, 14, 'left'); ctx.globalAlpha = 1;
  },
  /* 11 cycloïde */
  function(p){
    m11_bg('#fff'); var a = .5, g = 9.81, k = Math.min((W * .56) / (Math.PI / 2), (H * .72) / 1), ox = 34, oy = 22; function X(x){ return ox + x * k; } function Y(y){ return oy + y * k; }
    var xB = Math.PI / 2, yB = 1;
    ctx.strokeStyle = GREEN; ctx.lineWidth = 3.2; ctx.beginPath(); for (var th = 0; th <= Math.PI + 1e-6; th += .04){ var x = a * (th - Math.sin(th)), y = a * (1 - Math.cos(th)); if (th === 0) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y)); } ctx.stroke();
    LN(X(0), Y(0), X(xB), Y(yB), RED, 3); DOT(X(0), Y(0), 6, INK); DOT(X(xB), Y(yB), 6, INK); TB('A', X(0) - 12, Y(0) - 8, INK, 15); TB('B', X(xB) + 14, Y(yB) + 4, INK, 15);
    var AB = Math.sqrt(xB * xB + yB * yB), Tl = AB * Math.sqrt(2 / (g * yB)), Tc = Math.PI * Math.sqrt(a / g), tau = p * Tl * 1.0;
    var thc = Math.min(Math.PI, tau / Math.sqrt(a / g)); DOT(X(a * (thc - Math.sin(thc))), Y(a * (1 - Math.cos(thc))), 8, GREEN);
    var sl = Math.min(AB, .5 * g * (yB / AB) * tau * tau); DOT(X(xB * sl / AB), Y(yB * sl / AB), 8, RED);
    TB('cycloïde', W * .72, H * .24, DGREEN, 16, 'left'); TB('droite', W * .72, H * .42, DRED, 16, 'left');
    if (p > 0){ TB('0,709 s', W * .72, H * .6, DGREEN, 15, 'left'); TB('0,841 s', W * .72, H * .76, DRED, 15, 'left'); TB('gain ≈ 16 %', W * .72, H * .93, INK, 17, 'left'); }
  },
  /* 12 marche aléatoire */
  function(p){
    m11_bg('#fff'); var L = 36, R = 14, T = 16, B = 20, gw = W - L - R, gh = H - T - B, M = 40; function X(i){ return L + gw * i / 100; } function Y(v){ return T + gh / 2 - v / M * gh / 2; }
    ctx.fillStyle = 'rgba(30,63,143,.08)'; ctx.beginPath(); for (var i = 0; i <= 100; i++) ctx.lineTo(X(i), Y(Math.sqrt(i))); for (i = 100; i >= 0; i--) ctx.lineTo(X(i), Y(-Math.sqrt(i))); ctx.fill();
    LN(L, Y(0), W - R, Y(0), AX, 1.3); LN(L, Y(20), W - R, Y(20), RED, 1.6, [5, 4]); LN(L, Y(-20), W - R, Y(-20), RED, 1.6, [5, 4]); TB('+20', L - 6, Y(20) + 4, DRED, 12, 'right'); TB('−20', L - 6, Y(-20) + 4, DRED, 12, 'right');
    var r = m11_rng(31), cols = [BLUE, ORANGE, GREEN, VIOLET, ORA2, '#378ADD'], w;
    for (w = 0; w < 6; w++){ var s = 0; ctx.strokeStyle = cols[w]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); for (i = 1; i <= 100; i++){ s += r() < .5 ? 1 : -1; ctx.lineTo(X(i), Y(s)); } ctx.stroke(); }
    TB('±√n', X(100) - 4, Y(10) - 26, BLUE_D, 13, 'right'); TB('pas', W - R, H - 4, GREY, 12, 'right'); ctx.globalAlpha = m11_cl(p, 0, .4); TB('σ = 10, 20 = 2σ : P ≈ 5,7 %', W * .5, 28, DRED, 15); ctx.globalAlpha = 1;
  },
  /* 13 Buffon contre Monte-Carlo */
  function(p){
    m11_bg('#f6f7fb'); var pb = 2 / Math.PI, nMC = Math.pow(1.96 * 1.642 / .01, 2), nB = Math.pow(1.96 * (2 / (pb * pb)) * Math.sqrt(pb * (1 - pb)) / .01, 2), L = W * .06, bw = W * .62, h = H * .2;
    TB('précision ± 0,01 à 95 %', W * .5, 26, GREY, 15);
    ctx.fillStyle = '#a9c1ea'; ctx.fillRect(L, H * .24, bw * nMC / nB, h); ctx.fillStyle = '#e8b27a'; ctx.fillRect(L, H * .58, bw, h);
    TB('points aléatoires', L, H * .24 - 6, BLUE_D, 14, 'left'); TB('aiguille de Buffon', L, H * .58 - 6, ORA2, 14, 'left');
    TB('≈ ' + m11_fx(nMC / 1e5, 1) + '·10⁵', L + bw * nMC / nB + 10, H * .24 + h * .65, INK, 15, 'left'); TB('≈ ' + m11_fx(nB / 1e5, 1) + '·10⁵', L + bw + 10, H * .58 + h * .65, INK, 15, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('Monte-Carlo ≈ 2 fois plus efficace', W * .5, H * .93, DRED, 16); ctx.globalAlpha = 1;
  },
  /* 14 Sierpiński */
  function(p){
    m11_bg('#f6f7fb'); var s = H * .8, x0 = 14, y0 = H * .93; var A = [x0, y0], Bp = [x0 + s * 1.05, y0], C = [x0 + s * .525, y0 - s * .91];
    function tri(a, b, c, d){ if (d === 0){ m11_poly([a, b, c], BLUE_D, null); return; } var ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2], ca = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2]; tri(a, ab, ca, d - 1); tri(ab, b, bc, d - 1); tri(ca, bc, c, d - 1); }
    var dep = p > 0 ? 6 : 5; tri(A, Bp, C, dep);
    var tx = x0 + s * 1.05 + 22;
    TB('étape +1 : × 3', tx, H * .2, INK, 14, 'left'); TB('côté ÷ 2', tx, H * .34, GREY, 14, 'left'); TB('d = ln 3 / ln 2', tx, H * .52, BLUE_D, 17, 'left');
    ctx.globalAlpha = m11_cl(p, 0, .4); TB('≈ 1,585', tx, H * .68, DRED, 22, 'left'); TB('3¹⁰ = 59 049', tx, H * .84, DGREEN, 15, 'left'); ctx.globalAlpha = 1;
  }
]);
