/* Physique 3e · chapitre 4 · Résistance et loi d'Ohm (utilise les aides q_* de theo-01.js) */
(function () {
  var COL = { noir: '#222', marron: '#7B4A1E', rouge: '#D33', orange: '#F08A24', jaune: '#E8C81A', vert: '#2E9E4D', bleu: '#2F6FD6', violet: '#7F4FB5', gris: '#999', blanc: '#fff', or: '#C9A227', argent: '#C0C0C0' };
  /* résistance à bagues centrée en (x,y), largeur w */
  function res(x, y, w, bands, show) {
    LN(x - w / 2 - 28, y, x - w / 2, y, INK, 2.6); LN(x + w / 2, y, x + w / 2 + 28, y, INK, 2.6);
    ctx.fillStyle = '#ecd9b0'; ctx.strokeStyle = '#a98c55'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 18, w, 36, 12); ctx.fill(); ctx.stroke();
    var n = bands.length, xs = [];
    bands.forEach(function (b, i) { var bx = x - w / 2 + 22 + i * ((w - 44 - (i === n - 1 ? 0 : 0)) / (n - 1)); if (i === n - 1) bx = x + w / 2 - 16; xs.push(bx); ctx.fillStyle = COL[b]; ctx.fillRect(bx - 5, y - 18, 10, 36); if (b === 'blanc') { ctx.strokeStyle = '#999'; ctx.lineWidth = 1; ctx.strokeRect(bx - 5, y - 18, 10, 36); } });
    return xs;
  }
  function axes(ox, oy, w, h, xl, yl) {
    LN(ox - 4, oy, ox + w + 10, oy, AX, 1.6); LN(ox, oy + 4, ox, oy - h - 10, AX, 1.6);
    ctx.fillStyle = AX; ctx.beginPath(); ctx.moveTo(ox + w + 14, oy); ctx.lineTo(ox + w + 6, oy - 4); ctx.lineTo(ox + w + 6, oy + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox, oy - h - 14); ctx.lineTo(ox - 4, oy - h - 6); ctx.lineTo(ox + 4, oy - h - 6); ctx.fill();
    TB(xl, ox + w + 10, oy + 16, GREY, 13, 'right'); TB(yl, ox + 8, oy - h - 12, GREY, 13, 'left');
  }
  function tickX(ox, oy, w, vmax, vals, unit) { vals.forEach(function (v) { var x = ox + v / vmax * w; LN(x, oy, x, oy + 4, GREY, 1); T(String(v).replace('.', ','), x, oy + 15, GREY, 11); }); }
  function tickY(ox, oy, h, vmax, vals) { vals.forEach(function (v) { var y = oy - v / vmax * h; LN(ox - 4, y, ox, y, GREY, 1); T(String(v).replace('.', ','), ox - 7, y + 4, GREY, 11, 'right'); }); }

  SFA.theo("c04", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      res(230, 70, 130, ['marron', 'noir', 'orange', 'or']);
      TB('U = R · I', 230, 165, BLUE_D, 46); TB('la loi d\'Ohm', 230, 215, ORANGE, 22);
      TB('R en ohms (Ω)', 100, 245, GREY, 14); TB('I en ampères', 370, 245, GREY, 14);
    }),
    anim: q_an(function (t) {
      var T = 600, ph = (t % T) / T, Im = .5, I = Im * q_c(ph / .85, 0, 1);
      var ox = 90, oy = 255, w = 360, h = 205, kx = w / .5, ky = h / 12;
      axes(ox, oy, w, h, 'I (A)', 'U (V)'); tickX(ox, oy, w, .5, [.1, .2, .3, .4, .5]); tickY(ox, oy, h, 12, [2, 4, 6, 8, 10, 12]);
      // droite ohmique U = 20 I
      LN(ox, oy, ox + Im * kx, oy - 20 * Im * ky, BLUE, 3.2);
      // lampe U = 24 I^2
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.setLineDash([7, 5]); ctx.beginPath(); for (var i = 0; i <= 50; i++) { var q = i / 100, x = ox + q * kx, y = oy - 24 * q * q * ky; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
      TB('conducteur ohmique', ox + 150, oy - 20 * .36 * ky - 18, BLUE_D, 14, 'right'); TB('lampe à filament', ox + .5 * kx - 4, oy - 24 * .25 * ky + 36, ORANGE, 14, 'right');
      var Uo = 20 * I, Ul = 24 * I * I;
      if (I > .005) {
        LN(ox + I * kx, oy, ox + I * kx, oy - Uo * ky, '#b9bdc4', 1.2, [4, 4]);
        DOT(ox + I * kx, oy - Uo * ky, 6, BLUE); DOT(ox + I * kx, oy - Ul * ky, 6, ORANGE);
      }
      var tx = 500;
      TB('I = ' + I.toFixed(2).replace('.', ',') + ' A', tx, 60, INK, 17, 'left');
      TB('ohmique :', tx, 100, BLUE_D, 15, 'left'); TB('U/I = ' + (I > .005 ? (Uo / I).toFixed(0) : '20') + ' Ω', tx, 124, BLUE_D, 17, 'left'); TB('constant : droite', tx, 146, BLUE_D, 13, 'left');
      TB('lampe :', tx, 190, ORANGE, 15, 'left'); TB('U/I = ' + (I > .005 ? (Ul / I).toFixed(0) : '0') + ' Ω', tx, 214, ORANGE, 17, 'left'); TB('augmente : courbe', tx, 236, ORANGE, 13, 'left');
    }),
    th:
      '<div class="tcard"><b class="h">La résistance électrique</b><p>Un <b>dipôle</b> s\'oppose plus ou moins au passage du courant : c\'est sa <b>résistance R</b>, en <b>ohms</b> (Ω ; 1 kΩ = 1 000 Ω ; 1 MΩ = 10<sup>6</sup> Ω). À tension égale, plus R est grande, plus l\'intensité est petite. Un <b>conducteur ohmique</b> (résistor) est un dipôle dont la résistance est constante.</p></div>' +
      '<div class="tcard"><b class="h">La loi d\'Ohm</b><p>Pour un conducteur ohmique : <b>U = R · I</b> (U en V, R en Ω, I en A). Donc <b>I = U / R</b> et <b>R = U / I</b>.</p><ul><li><b>Exemple :</b> R = 47 Ω, I = 0,20 A : U = 47 × 0,20 = <b>9,4 V</b>.</li><li><b>Exemple :</b> R = 330 Ω sous 12 V : I = 12 / 330 ≈ 0,036 A = <b>36 mA</b>.</li><li>La <b>caractéristique</b> U(I) d\'un conducteur ohmique est une <b>droite passant par l\'origine</b> ; sa pente vaut R. Doubler U double I : R ne change pas.</li><li>Un dipôle dont U/I varie n\'est <b>pas ohmique</b> : la lampe à filament (1,5 V ; 0,25 A → 6 Ω ; 6 V ; 0,50 A → 12 Ω) s\'échauffe et sa résistance augmente.</li></ul></div>' +
      '<div class="tcard"><b class="h">Résistance d\'un fil</b><p><b>R = ρ · L / S</b> : proportionnelle à la longueur L, inversement proportionnelle à la section S, et dépendante du matériau par la résistivité ρ (Ω·mm²/m si S en mm² et L en m).</p><ul><li>Fil deux fois plus long : R double. Section deux fois plus grande : R est divisée par deux. Longueur 2L et section 2S : R inchangée.</li><li><b>Exemple :</b> nichrome ρ = 1,10 Ω·mm²/m, L = 4,0 m, d = 0,50 mm. S = π·d²/4 ≈ 0,196 mm², R = 1,10 × 4,0 / 0,196 ≈ <b>22 Ω</b>, et sous 12 V : I ≈ 0,54 A.</li></ul></div>' +
      '<div class="tcard"><b class="h">Le code des couleurs</b><p>Les bagues se lisent à partir de celle qui est la plus proche d\'une extrémité : <b>1<sup>er</sup> chiffre, 2<sup>e</sup> chiffre, multiplicateur (10<sup>n</sup>), tolérance</b>.</p><p>noir 0 · marron 1 · rouge 2 · orange 3 · jaune 4 · vert 5 · bleu 6 · violet 7 · gris 8 · blanc 9 ; tolérance : or ± 5 %, argent ± 10 %.</p><ul><li>marron – noir – orange – or : 10 × 10<sup>3</sup> = <b>10 kΩ ± 5 %</b>, soit entre 9,5 kΩ et 10,5 kΩ.</li><li>390 Ω = 39 × 10 : orange – blanc – marron.</li></ul></div>' +
      '<div class="tcard"><b class="h">Applications et pièges</b><ul><li><b>Protéger une DEL</b> (2,0 V ; 20 mA) sur 9 V : la résistance en série reçoit 9 − 2,0 = 7 V, donc R = 7 / 0,020 = 350 Ω. On prend la valeur normalisée <b>supérieure</b> (390 Ω) : I = 7 / 390 ≈ 18 mA, la DEL est protégée.</li><li><b>Thermistance CTN :</b> sa résistance diminue quand la température augmente ; sous tension constante, l\'intensité augmente (I = U / R).</li><li>Piège : « I augmente quand U augmente donc c\'est ohmique » est faux : il faut que <b>U/I reste constant</b> (droite par l\'origine).</li><li>Piège : R ne dépend ni de U ni de I (pour un résistor) ; elle ne dépend que du dipôle.</li></ul></div>'
  });

  SFA.figs("c04", [
    /* 0 Appliquer U = R·I */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      res(230, 120, 140, ['jaune', 'violet', 'noir', 'or']); TB('R = 47 Ω', 230, 80, INK, 19);
      A(150, 175, 160, 0, ORANGE, '', 3); TB('I = 0,20 A', 230, 200, ORANGE, 17);
      LN(150, 70, 150, 60, INK, 0); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(150, 56); ctx.lineTo(310, 56); ctx.lineTo(310, 100); ctx.stroke();
      TB(g > .3 ? 'U = 9,4 V' : 'U = ?', 230, 48, g > .3 ? DGREEN : BLUE_D, 17);
      if (g > 0) { ctx.globalAlpha = g; q_box(230, 252, 320, 36, DGREEN, '#e6f6ee', 'U = 47 × 0,20 = 9,4 V', 19); ctx.globalAlpha = 1; }
    }),
    /* 1 Lire une résistance */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), xs = res(230, 110, 230, ['marron', 'noir', 'orange', 'or']);
      var lab = ['1', '0', '×10³', '± 5 %'];
      if (g > 0) { ctx.globalAlpha = g; xs.forEach(function (x, i) { LN(x, 130, x, 150, GREY, 1.4); TB(lab[i], x, 172, i === 3 ? ORANGE : BLUE_D, 18); }); TB('marron', xs[0], 60, GREY, 12); TB('noir', xs[1], 60, GREY, 12); TB('orange', xs[2], 60, GREY, 12); TB('or', xs[3], 60, GREY, 12); q_box(230, 225, 300, 36, DGREEN, '#e6f6ee', '10 kΩ ± 5 %  (9,5 à 10,5 kΩ)', 17); ctx.globalAlpha = 1; }
      else TB('quelle valeur ? quelle tolérance ?', 230, 200, GREY, 17);
    }),
    /* 2 Calculer une intensité */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 70, y0 = 90, x1 = 390, y1 = 210;
      q_rect(x0, y0, x1, y1, [['l', 150, 12], ['t', 230, 24], ['b', 230, 16]]); q_pile(x0, 150, 'v'); TB('12 V', x0 + 24, 155, DGREEN, 15, 'left');
      q_resis(230, y0, 'h', '330 Ω', 44); q_meter(230, y1, 'A', ORA2, g > .3 ? '36 mA' : '?');
      TB(g > .3 ? 'I = U / R = 12 / 330 ≈ 0,036 A = 36 mA' : 'I = U / R ?', 230, 262, g > .3 ? DGREEN : GREY, 17);
    }),
    /* 3 On double la tension */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), ox = 70, oy = 235, w = 300, h = 190;
      axes(ox, oy, w, h, 'I', 'U');
      LN(ox, oy, ox + 280, oy - 175, BLUE, 3);
      var x1 = ox + 100, y1 = oy - 62.5, x2 = ox + 200, y2 = oy - 125;
      [[x1, y1, 'I', 'U'], [x2, y2, '2I', '2U']].forEach(function (q) { LN(q[0], oy, q[0], q[1], '#b9bdc4', 1.4, [4, 4]); LN(ox, q[1], q[0], q[1], '#b9bdc4', 1.4, [4, 4]); DOT(q[0], q[1], 6, ORANGE); TB(q[2], q[0], oy + 17, INK, 14); TB(q[3], ox - 12, q[1] + 5, INK, 14); });
      if (g > 0) { ctx.globalAlpha = g; TB('R = U / I = 2U / 2I', 390, 130, DGREEN, 16, 'center'); TB('inchangée', 390, 154, DGREEN, 16); TB('la pente est la même', 390, 186, BLUE_D, 14); ctx.globalAlpha = 1; }
      else TB('R ?', 390, 130, GREY, 22);
    }),
    /* 4 Ohmique ou non */
    q_fig(function (p) {
      var g = q_s(p, 0, .7);
      function panel(ox, ti, imax, pts, ohm) {
        var oy = 200, w = 180, h = 140; axes(ox, oy, w, h, imax > 1 ? 'I (mA)' : 'I (A)', 'U (V)'); TB(ti, ox + w / 2, 30, INK, 14);
        pts.forEach(function (q) { DOT(ox + q[0] / imax * w, oy - q[1] / 4.5 * h, 5.5, ORANGE); });
        tickY(ox, oy, h, 4.5, [1, 2, 3, 4]);
        if (g > 0) { ctx.globalAlpha = g; ctx.strokeStyle = ohm ? BLUE : RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy); if (ohm) ctx.lineTo(ox + 4.1 / 4.5 * 0 + w * .96, oy - h * (4 / 4.5) * .96 * 1.0); else { pts.forEach(function (q) { ctx.lineTo(ox + q[0] / imax * w, oy - q[1] / 4.5 * h); }); } ctx.stroke(); ctx.globalAlpha = 1; }
      }
      panel(40, 'dipôle A  (I en mA)', 100, [[21, 1], [40, 2], [61, 3], [80, 4]], true);
      panel(250, 'dipôle B  (I en A)', .6, [[.2, 1], [.32, 2], [.41, 3], [.48, 4]], false);
      if (g > 0) { ctx.globalAlpha = g; TB('U/I ≈ 50 Ω : constant', 130, 245, DGREEN, 14); TB('U/I : 5 → 8,3 Ω', 340, 245, DRED, 14); TB('A est ohmique, B ne l\'est pas', 230, 270, DGREEN, 15); ctx.globalAlpha = 1; }
      else TB('lequel est ohmique ?', 230, 262, GREY, 16);
    }),
    /* 5 Longueur et section */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      function wire(y, L, d, lab, col) { ctx.fillStyle = '#f3c9a0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(60, y - d / 2, L, d, d / 2.5); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fbe3cc'; ctx.beginPath(); ctx.ellipse(60 + L, y, d / 4, d / 2, 0, 0, 7); ctx.fill(); ctx.stroke(); TB(lab, 60 + L / 2, y + d / 2 + 22, col, 16); }
      wire(75, 140, 22, 'L, S  →  R', INK);
      wire(175, 280, 44, '2L, 2S  →  ?', g > .3 ? DGREEN : INK);
      LN(60, 48, 200, 48, GREY, 1.4); TB('L', 130, 40, GREY, 13); LN(60, 132, 340, 132, GREY, 1.4); TB('2L', 200, 124, GREY, 13);
      if (g > .3) { ctx.globalAlpha = g; TB('R\' = ρ · 2L / 2S = R', 230, 262, DGREEN, 18); ctx.globalAlpha = 1; } else TB('R ∝ L  et  R ∝ 1 / S', 230, 262, GREY, 16);
    }),
    /* 6 Fil de chauffage */
    q_fig(function (p) {
      var g = q_s(p, 0, 1);
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 200; i++) { var x = 30 + i, y = 52 + 20 * Math.sin(i / 4.5); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      TB('nichrome : L = 4,0 m', 130, 100, ORANGE, 14); TB('ρ = 1,10 Ω·mm²/m', 130, 120, GREY, 13);
      DOT(335, 70, 28, '#f3c9a0'); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(335, 70, 28, 0, 7); ctx.stroke(); LN(307, 70, 363, 70, BLUE_D, 1.6); TB('d = 0,50 mm', 335, 118, BLUE_D, 14);
      TB('12 V', 410, 70, DGREEN, 17);
      var L = [['S = π d² / 4 ≈ 0,196 mm²', .05], ['R = ρ L / S = 1,10 × 4,0 / 0,196 ≈ 22 Ω', .35], ['I = U / R = 12 / 22 ≈ 0,54 A', .65]];
      L.forEach(function (l, i) { var a = q_s(p, l[1], l[1] + .25); if (a > 0) { ctx.globalAlpha = a; TB(l[0], 230, 165 + i * 38, i === 2 ? DGREEN : INK, 17); ctx.globalAlpha = 1; } });
      if (p <= .05) TB('(a) S ?   (b) R ?   (c) I ?', 230, 200, GREY, 17);
    }),
    /* 7 La lampe est-elle ohmique ? */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), ox = 70, oy = 230, w = 300, h = 190, kx = w / .6, ky = h / 7;
      axes(ox, oy, w, h, 'I (A)', 'U (V)'); tickX(ox, oy, w, .6, [.25, .5]); tickY(ox, oy, h, 7, [1.5, 3, 6]);
      var P1 = [ox + .25 * kx, oy - 1.5 * ky], P2 = [ox + .5 * kx, oy - 6 * ky];
      LN(ox, oy, ox + .5 * kx, oy - 3 * ky, GREY, 1.6, [5, 5]);
      DOT(P1[0], P1[1], 6, ORANGE); DOT(P2[0], P2[1], 6, ORANGE);
      if (g > 0) { ctx.globalAlpha = g; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 50; i++) { var q = i / 100, x = ox + q * kx, y = oy - 24 * q * q * ky; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        TB('si ohmique : 3 V', ox + .5 * kx + 8, oy - 3 * ky - 6, GREY, 12, 'left'); TB('mesuré : 6 V', ox + .5 * kx + 10, oy - 6 * ky + 4, DRED, 14, 'left'); TB('U/I : 6 Ω → 12 Ω', 175, 70, DRED, 16, 'center'); TB('R varie : pas ohmique', 175, 96, DRED, 16); ctx.globalAlpha = 1; }
      else TB('U ×4 mais I seulement ×2 ?', 175, 80, GREY, 15);
    }),
    /* 8 Protéger une DEL */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), x0 = 50, y0 = 55, x1 = 330, y1 = 130;
      q_rect(x0, y0, x1, y1, [['l', 92, 12], ['t', 190, 24], ['r', 92, 17]]); q_pile(x0, 92, 'v'); TB('9 V', x0 + 22, 97, DGREEN, 14, 'left');
      q_resis(190, y0, 'h', 'R ?', 44);
      ctx.fillStyle = '#fff'; ctx.fillRect(x1 - 14, 76, 28, 32); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.fillStyle = '#fbe0e0'; ctx.beginPath(); ctx.moveTo(x1 - 12, 78); ctx.lineTo(x1 + 12, 78); ctx.lineTo(x1, 98); ctx.closePath(); ctx.fill(); ctx.stroke(); LN(x1 - 12, 100, x1 + 12, 100, INK, 2.4); TB('DEL 2,0 V · 20 mA', x1, 150, INK, 12);
      var bx = 30, bw = 400, f = 7 / 9;
      ctx.fillStyle = '#e6f1fb'; ctx.fillRect(bx, 160, bw * f, 28); ctx.fillStyle = '#fbe0e0'; ctx.fillRect(bx + bw * f, 160, bw * (1 - f), 28); ctx.strokeStyle = GREY; ctx.lineWidth = 1.6; ctx.strokeRect(bx, 160, bw, 28);
      TB('Uᴿ = 9 − 2,0 = 7 V', bx + bw * f / 2, 180, BLUE_D, 14); TB('2,0 V', bx + bw * f + bw * (1 - f) / 2, 180, DRED, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('R = 7 / 0,020 = 350 Ω  →  390 Ω (I ≈ 18 mA)', 230, 222, DGREEN, 16); var xs = res(150, 258, 100, ['orange', 'blanc', 'marron', 'or']); TB('390 Ω', 300, 264, INK, 15); ctx.globalAlpha = 1; }
      else TB('Uᴿ ?   R ?   quelles bagues ?', 230, 235, GREY, 16);
    }),
    /* 9 La thermistance */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), ox = 55, oy = 225, w = 200, h = 160;
      axes(ox, oy, w, h, 'T', 'R'); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 190; i += 5) { var x = ox + i, y = oy - 20 - 140 * Math.exp(-i / 55); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      var a = 40, b = 140, ya = oy - 20 - 140 * Math.exp(-a / 55), yb = oy - 20 - 140 * Math.exp(-b / 55);
      DOT(ox + a, ya, 6, ORANGE); DOT(ox + b, yb, 6, RED); TB('froide', ox + a, oy + 17, ORANGE, 13); TB('chaude', ox + b, oy + 17, DRED, 13);
      TB('R diminue quand T augmente', ox + w / 2 + 10, 28, BLUE_D, 14);
      ctx.fillStyle = '#eef1f4'; ctx.fillRect(310, 70, 36, 150); ctx.fillRect(375, 70, 36, 150);
      var i1 = 5 / 150, i2 = 5 / 40; // illustration relative
      ctx.fillStyle = ORANGE; ctx.fillRect(310, 220 - 150 * .25, 36, 150 * .25); TB('I', 328, 240, INK, 14);
      if (g > 0) { ctx.globalAlpha = g; ctx.fillStyle = RED; ctx.fillRect(375, 220 - 150 * .8 * g, 36, 150 * .8 * g); TB('I', 393, 240, INK, 14); TB('I augmente', 360, 55, DRED, 16); ctx.globalAlpha = 1; }
      else TB('I = U / R : que devient-elle ?', 360, 55, GREY, 14);
      TB('U = 5 V', 360, 262, DGREEN, 14);
    })
  ]);
})();
