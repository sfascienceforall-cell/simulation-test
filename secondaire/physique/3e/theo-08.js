/* Physique 3e · chapitre 8 · Résultante de forces et équilibre (utilise les aides q_* de theo-01.js) */
(function () {
  function fr(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
  function ceil(x1, x2, y) { LN(x1, y, x2, y, INK, 3); ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; for (var h = x1 + 2; h < x2; h += 9) { ctx.beginPath(); ctx.moveTo(h, y); ctx.lineTo(h + 6, y - 7); ctx.stroke(); } }
  function blk(x, y, w, h, lab, col) { ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = col || BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.stroke(); if (lab) TB(lab, x, y + 5, col || BLUE_D, 14); }
  function dashA(x, y, vx, vy, col) { ctx.globalAlpha = .55; LN(x, y, x + vx, y + vy, col, 1.4, [4, 4]); ctx.globalAlpha = 1; }

  SFA.theo("c08", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      var O = { x: 150, y: 170 };
      LN(O.x, O.y, O.x + 110, O.y - 0, AX, 0.1); dashA(O.x + 100, O.y, 40, -90, GREY); dashA(O.x + 40, O.y - 90, 100, 0, GREY);
      A(O.x, O.y, 100, 0, BLUE, '', 4); A(O.x, O.y, 40, -90, ORA2, '', 4); A(O.x, O.y, 140, -90, RED, '', 5);
      TB('F₁', O.x + 50, O.y + 20, BLUE_D, 16); TB('F₂', O.x + 4, O.y - 50, ORANGE, 16, 'right'); TB('R', O.x + 150, O.y - 98, DRED, 20, 'left');
      TB('R = 0 ⇒ équilibre', 360, 90, DGREEN, 20); TB('résultante', 360, 125, INK, 17); TB('v constante ou repos', 360, 150, GREY, 14);
      TB('forces · résultante · équilibre', 230, 238, INK, 17);
    }),
    anim: q_an(function (t) {
      var ph = (t % 720) / 720, al = 180 * (.5 - .5 * Math.cos(ph * 2 * PI)), a = al * D2R;
      var k = 3.1, O = { x: 170, y: 230 }, f1 = 30, f2 = 40, ax = f1 * k, ay = 0, bx = f2 * k * Math.cos(a), by = -f2 * k * Math.sin(a);
      var R = Math.sqrt(f1 * f1 + f2 * f2 + 2 * f1 * f2 * Math.cos(a));
      LN(O.x - 150, O.y, O.x + 330, O.y, '#e3e6ea', 1);
      dashA(O.x + ax, O.y, bx, by, ORA2); dashA(O.x + bx, O.y + by, ax, 0, BLUE);
      A(O.x, O.y, ax, 0, BLUE, '', 4); A(O.x, O.y, bx, by, ORA2, '', 4); A(O.x, O.y, ax + bx, by, RED, '', 5);
      DOT(O.x, O.y, 5, INK); TB('F₁ = 30 N', O.x + ax / 2, O.y + 22, BLUE_D, 14);
      TB('F₂ = 40 N', O.x + bx / 2 - 8, O.y + by / 2 - 10, ORANGE, 14, bx < 40 ? 'right' : 'center');
      var tx = 470; TB('angle α = ' + fr(al, 0) + '°', tx, 60, INK, 20, 'left');
      TB('R = ' + fr(R, 1) + ' N', tx, 105, DRED, 28, 'left');
      var nx = tx, ny = 150, nw = 200; LN(nx, ny, nx + nw, ny, AX, 2); [[10, '10'], [50, '50'], [70, '70']].forEach(function (m) { var xx = nx + m[0] / 70 * nw; LN(xx, ny - 5, xx, ny + 5, GREY, 1.4); T(m[1], xx, ny + 20, GREY, 12); });
      DOT(nx + R / 70 * nw, ny, 7, RED); T('N', nx + nw + 14, ny + 4, GREY, 12);
      TB('même sens (0°) : 70 N', tx, 205, GREY, 13, 'left'); TB('à angle droit : 50 N', tx, 227, GREY, 13, 'left'); TB('sens opposés (180°) : 10 N', tx, 249, GREY, 13, 'left');
    }),
    th:
      '<div class="tcard"><b class="h">La résultante : une force qui remplace toutes les autres</b><p>Quand plusieurs forces agissent sur un même objet, on peut les remplacer par une seule force, la <b>résultante</b> <b>R</b>, qui produit le même effet. Pour des forces de <b>même direction</b> :</p><ul><li><b>même sens</b> : on additionne les valeurs, R = F₁ + F₂ ;</li><li><b>sens opposés</b> : on soustrait, R = F₁ − F₂ (sens de la plus grande).</li></ul><p><b>Exemple :</b> 30 N vers la droite et 12 N vers la gauche donnent R = 30 − 12 = <b>18 N vers la droite</b>.</p></div>' +
      '<div class="tcard"><b class="h">Forces de directions différentes</b><p>On construit le <b>parallélogramme des forces</b> : on trace F₁ et F₂ depuis le même point, on complète le parallélogramme ; la résultante est la <b>diagonale</b> qui part de ce point.</p><ul><li>À <b>90°</b> : R² = F₁² + F₂² (Pythagore) et tan β = F₂ / F₁.</li><li>La valeur de R reste toujours comprise entre <b>|F₁ − F₂|</b> et <b>F₁ + F₂</b>.</li></ul><p><b>Exemple :</b> 30 N et 40 N à angle droit : R = √(900 + 1 600) = <b>50 N</b>, à β = arctan(40/30) ≈ <b>53°</b> de la force de 30 N.</p></div>' +
      '<div class="tcard"><b class="h">Équilibre et mouvement</b><p>Si la résultante est <b>nulle</b>, les forces se compensent : l\'objet est en <b>équilibre</b>. Il reste au repos ou garde une <b>vitesse constante en ligne droite</b>. C\'est le principe d\'inertie.</p><ul><li>Un livre sur une table : le poids P et la réaction N de la table se compensent (N = P).</li><li>Une voiture à 90 km/h constants : la force motrice compense les frottements ; la résultante est nulle.</li><li>Sans aucune force (ou sans frottement), un chariot continue à vitesse constante.</li></ul><p>Une résultante non nulle ne « maintient » pas le mouvement : elle <b>change</b> la vitesse. Le parachutiste atteint sa vitesse limite quand la résistance de l\'air égale son poids (R = 0).</p></div>' +
      '<div class="tcard"><b class="h">Objet suspendu à deux fils et frottement</b><p>Un objet de poids P suspendu à deux fils symétriques formant un angle α : chaque tension vaut <b>T = P / (2·cos(α/2))</b>. Plus les fils sont écartés, plus la tension est grande. Pour P = 49,05 N : α = 60° donne T ≈ 28 N ; α = 120° donne T ≈ 49 N.</p><p><b>Frottement :</b> au démarrage, f<sub>max</sub> = μ·m·g. Tant que la force de traction F ≤ f<sub>max</sub>, l\'objet ne bouge pas et f = F (R = 0). Au-delà, R = F − f et l\'accélération vaut a = R / m. Pour une caisse de 20 kg avec μ = 0,40 : f<sub>max</sub> ≈ 78,5 N.</p></div>' +
      '<div class="tcard"><b class="h">Méthode et pièges</b><ul><li>Fais toujours un <b>schéma</b> : toutes les forces, depuis le même point, avec une échelle.</li><li>Colinéaires : additionne ou soustrais ; sinon : parallélogramme ou Pythagore à 90°.</li><li>Vitesse constante ≠ aucune force : c\'est <b>résultante nulle</b>.</li><li>Les forces action-réaction agissent sur deux objets différents : elles ne s\'annulent pas.</li><li>Deux forces de valeurs différentes ne peuvent jamais avoir une résultante nulle.</li></ul></div>'
  });

  SFA.figs("c08", [
    /* 0 Additionner des forces */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), k = 2.6;
      TB('(a)', 25, 52, INK, 16, 'left'); blk(120, 65, 60, 40, '', BLUE_D);
      A(150, 58, 30 * k, 0, BLUE, '', 3.4); A(150, 74, 12 * k, 0, ORA2, '', 3.4); TB('30 N', 150 + 30 * k + 28, 62, BLUE_D, 13); TB('12 N', 150 + 12 * k + 28, 78, ORANGE, 13);
      TB('(b)', 25, 192, INK, 16, 'left'); blk(170, 205, 60, 40, '', BLUE_D);
      A(200, 198, 30 * k, 0, BLUE, '', 3.4); A(140, 214, -12 * k, 0, ORA2, '', 3.4); TB('30 N', 200 + 30 * k + 28, 202, BLUE_D, 13); TB('12 N', 140 - 12 * k - 28, 218, ORANGE, 13);
      if (g > 0) {
        ctx.globalAlpha = g; A(150, 112, 42 * k * g, 0, RED, '', 4.4); TB('R = 42 N', 150 + 42 * k + 8, 116, DRED, 16, 'left');
        A(200, 252, 18 * k * g, 0, RED, '', 4.4); TB('R = 18 N', 200 + 18 * k + 8, 256, DRED, 16, 'left'); ctx.globalAlpha = 1;
      } else { TB('R ?', 330, 112, GREY, 16); TB('R ?', 330, 252, GREY, 16); }
    }),
    /* 1 Livre sur la table */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      ctx.fillStyle = '#d9c6a0'; ctx.fillRect(60, 175, 340, 28); LN(60, 175, 400, 175, INK, 2.4);
      ctx.fillStyle = '#e6f1fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.fillRect(170, 135, 120, 40); ctx.strokeRect(170, 135, 120, 40); TB('livre', 195, 160, BLUE_D, 15);
      A(230, 155, 0, 70, RED, '', 4); TB('P', 250, 238, DRED, 17, 'left'); DOT(230, 155, 4, INK);
      if (g > 0) { ctx.globalAlpha = g; A(230, 155, 0, -70 * g, GREEN, '', 4); TB('N', 250, 80, DGREEN, 17, 'left'); TB('N = P  ⇒  R = 0', 430, 36, DGREEN, 17, 'right'); ctx.globalAlpha = 1; } else TB('R = ?', 430, 36, GREY, 17, 'right');
    }),
    /* 2 Voiture à vitesse constante */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      floor(20, 440, 200); ctx.save(); ctx.translate(230, 170); ctx.scale(2.6, 2.6); car(0, 0, BLUE_D); ctx.restore();
      A(300, 160, 70, 0, GREEN, '', 4); TB('moteur', 370, 140, DGREEN, 14); A(165, 160, -70, 0, RED, '', 4); TB('frottements', 105, 140, DRED, 14);
      TB('90 km/h constants', 230, 50, INK, 18);
      if (g > 0) { ctx.globalAlpha = g; TB('forces égales : R = 0', 230, 250, DGREEN, 18); ctx.globalAlpha = 1; } else TB('R ?', 230, 250, GREY, 18);
    }),
    /* 3 Deux forces perpendiculaires */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), k = 4, O = { x: 90, y: 235 };
      A(O.x, O.y, 30 * k, 0, BLUE, '', 4); TB('F₁ = 30 N', O.x + 60, O.y + 22, BLUE_D, 14); A(O.x, O.y, 0, -40 * k, ORA2, '', 4); TB('F₂ = 40 N', O.x - 8, O.y - 80, ORANGE, 14, 'right');
      if (g > 0) {
        dashA(O.x + 30 * k, O.y, 0, -40 * k * g, GREY); dashA(O.x, O.y - 40 * k, 30 * k * g, 0, GREY); A(O.x, O.y, 30 * k * g, -40 * k * g, RED, '', 5);
        if (g > .85) { TB('R = 50 N', O.x + 100, O.y - 100, DRED, 18, 'left'); TB('β ≈ 53°', O.x + 38, O.y - 14, DGREEN, 14, 'left'); ctx.strokeStyle = DGREEN; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(O.x, O.y, 34, -Math.atan2(40, 30), 0); ctx.stroke(); TB('R² = 30² + 40² = 2 500', 360, 70, INK, 14); }
      } else TB('R ?', 300, 130, GREY, 18);
    }),
    /* 4 Le lustre */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), c = { x: 230, y: 170 }, h = 110, dx = h * Math.tan(60 * D2R) * .9, hh = h * .9;
      ceil(10, 450, 42);
      LN(c.x - dx, 42, c.x, c.y, INK, 2.4); LN(c.x + dx, 42, c.x, c.y, INK, 2.4);
      DOT(c.x, c.y + 14, 14, '#fdf1e0'); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(c.x, c.y + 14, 14, 0, 7); ctx.stroke(); TB('5 kg', c.x - 24, c.y + 19, ORANGE, 13, 'right');
      var u = Math.hypot(dx, c.y - 42);
      A(c.x, c.y, 0, 62, RED, '', 3.4); TB('P', c.x + 12, c.y + 52, DRED, 15, 'left');
      TB('α = 120°', c.x, 76, INK, 15);
      if (g > 0) { ctx.globalAlpha = g; var ux = dx / u * 62, uy = -(c.y - 42) / u * 62; A(c.x, c.y, -ux, uy, GREEN, '', 3.4); A(c.x, c.y, ux, uy, GREEN, '', 3.4); TB('T', c.x - ux - 14, c.y + uy - 4, DGREEN, 16); TB('T', c.x + ux + 14, c.y + uy - 4, DGREEN, 16); TB('T = P / (2·cos 60°) ≈ 49 N', 230, 268, DGREEN, 16); ctx.globalAlpha = 1; } else TB('T = ?', 230, 268, GREY, 17);
    }),
    /* 5 On écarte les fils */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      [[115, 30, 'α = 60°', 28.3], [345, 60, 'α = 120°', 49.05]].forEach(function (s) {
        var x = s[0], hh = 55, dx = hh * Math.tan(s[1] * D2R), y0 = 40, yb = y0 + hh;
        ceil(x - 100, x + 100, y0); LN(x - dx, y0, x, yb, INK, 2.2); LN(x + dx, y0, x, yb, INK, 2.2); DOT(x, yb + 12, 12, '#fdf1e0'); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, yb + 12, 12, 0, 7); ctx.stroke();
        A(x, yb, 0, 49.05 * 1.2, RED, '', 3); TB('P', x + 14, yb + 66, DRED, 14, 'left'); TB(s[2], x, 28, INK, 14);
        if (g > 0) { ctx.globalAlpha = g; var l = Math.hypot(dx, hh), L = s[3] * 1.2 * g; A(x, yb, -dx / l * L, -hh / l * L, GREEN, '', 3); A(x, yb, dx / l * L, -hh / l * L, GREEN, '', 3); TB('T ≈ ' + fr(s[3], 0) + ' N', x, 215, DGREEN, 16); ctx.globalAlpha = 1; }
      });
      if (g > 0) TB('P = 49 N dans les deux cas', 230, 255, INK, 15); else TB('T ?    T ?', 230, 215, GREY, 17);
    }),
    /* 6 Tirer une caisse */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), k = 2.8;
      floor(20, 440, 100); blk(120, 80, 70, 36, '20 kg', ORANGE); A(155, 78, 50 * .9, 0, BLUE, '', 3.2); A(85, 86, -50 * .9, 0, RED, '', 3.2); TB('F = 50 N', 210, 62, BLUE_D, 13, 'left'); TB('f', 62, 90, DRED, 14, 'right');
      TB('μ = 0,40 ; f max = μ·m·g', 330, 40, INK, 14);
      var ox = 70, y1 = 135, y2 = 205; LN(ox, y1 + 16, ox + 100 * k, y1 + 16, AX, 1.5);
      ctx.fillStyle = BLUE + '55'; ctx.fillRect(ox, y1 - 8, 50 * k, 24); TB('F = 50', ox + 50 * k / 2, y1 + 9, BLUE_D, 13);
      ctx.fillStyle = BLUE + '55'; ctx.fillRect(ox, y2 - 8, 100 * k, 24); TB('F = 100', ox + 100 * k / 2, y2 + 9, BLUE_D, 13);
      LN(ox, y2 + 16, ox + 100 * k, y2 + 16, AX, 1.5);
      var fx = ox + 78.5 * k; LN(fx, y1 - 14, fx, y2 + 26, RED, 2.2, [5, 4]); TB('78,5 N', fx, y1 - 20, DRED, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('F < 78,5 N : immobile, f = F, R = 0', ox, y1 + 38, DGREEN, 13, 'left'); TB('F > 78,5 N : glisse, R = 21,5 N, a ≈ 1,1 m/s²', ox, y2 + 40, DRED, 13, 'left'); ctx.globalAlpha = 1; } else TB('bouge ?', 400, 175, GREY, 16);
    }),
    /* 7 Plus aucune force : chariot */
    q_fig(function (p) {
      var g = q_s(p, 0, .8), n = 5, X0 = 70, st = 70;
      ctx.fillStyle = '#e9ecef'; ctx.fillRect(20, 160, 420, 8); LN(20, 160, 440, 160, INK, 2.4);
      TB('rail sans frottement', 230, 34, INK, 16);
      for (var i = 0; i < n; i++) {
        var a = g * n >= i ? 1 : 0; var x = X0 + i * st + (i === Math.floor(g * n) ? 0 : 0);
        ctx.globalAlpha = a ? (i === n - 1 ? 1 : .6) : .12; blk(x, 135, 46, 28, '', BLUE_D); DOT(x - 12, 156, 5, '#555'); DOT(x + 12, 156, 5, '#555');
        ctx.globalAlpha = 1;
        if (a) { A(x, 105, 24, 0, GREEN, '', 2.4); LN(x, 168, x, 178, GREY, 1.2); T(String(i), x, 192, GREY, 11); }
      }
      TB('intervalles de temps égaux', 230, 218, GREY, 13);
      if (g > .9) { TB('distances égales : v constante', 230, 250, DGREEN, 17); } else TB('vitesse ?', 230, 250, GREY, 17);
    }),
    /* 8 Le parachutiste */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), cols = [[80, 'début', 0, 785, '↓ 785 N'], [230, 'plus tard', 400, 385, '↓ 385 N'], [380, 'vitesse limite', 785, 0, 'R = 0']];
      cols.forEach(function (c) {
        pers(c[0], 150, 56, ORA2, 1, '', 'center'); TB(c[1], c[0], 30, INK, 14);
        A(c[0], 133, 0, 785 * .07, RED, '', 3.4); TB('P', c[0] + 12, 133 + 785 * .07 + 14, DRED, 13, 'left');
        if (g > 0) { ctx.globalAlpha = g; if (c[2] > 0) A(c[0], 112, 0, -c[2] * .07 * g, GREEN, '', 3.4); TB('air ' + c[2] + ' N', c[0], 252 - 20, DGREEN, 13); TB('R : ' + c[4], c[0], 252, DRED, 14); ctx.globalAlpha = 1; }
      });
      if (g <= 0) TB('R ?', 230, 250, GREY, 17);
    }),
    /* 9 Valeurs possibles */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), O = { x: 70, y: 150 };
      A(O.x, O.y, 66, 0, BLUE, '', 3.4); A(O.x, O.y, 0, -88, ORA2, '', 3.4); TB('30 N', O.x + 40, O.y + 20, BLUE_D, 13); TB('40 N', O.x - 8, O.y - 50, ORANGE, 13, 'right'); TB('direction au choix', 140, 40, INK, 14);
      var nx = 40, ny = 230, nw = 380, kk = nw / 80; LN(nx, ny, nx + nw, ny, AX, 2);
      [0, 10, 30, 50, 70].forEach(function (v) { LN(nx + v * kk, ny - 5, nx + v * kk, ny + 5, GREY, 1.4); T(String(v), nx + v * kk, ny + 21, GREY, 12); }); T('N', nx + nw + 6, ny + 4, GREY, 12);
      if (g > 0) { ctx.globalAlpha = g; ctx.fillStyle = 'rgba(29,158,117,.3)'; ctx.fillRect(nx + 10 * kk, ny - 18, 60 * kk * g, 36); ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.strokeRect(nx + 10 * kk, ny - 18, 60 * kk * g, 36); DOT(nx + 0 * kk, ny, 7, RED, false); TB('impossible', nx + 5, ny - 28, DRED, 13, 'left'); TB('R possible : de 10 N à 70 N', 230, 192, DGREEN, 16); ctx.globalAlpha = 1; } else TB('R = ?', 260, 130, GREY, 18);
    })
  ]);
})();
