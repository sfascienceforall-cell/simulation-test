/* Physique 3e · chapitre 9 · La pression : solides, liquides, gaz (utilise les aides q_* de theo-01.js) */
(function () {
  function fr(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
  function nf(v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  /* tube de Torricelli : x = axe, yb = niveau de la cuve, hpx = hauteur de mercure en px, Ltube = hauteur du tube */
  function tube(x, yb, hpx, Lt, w, tilt) {
    ctx.save(); ctx.translate(x, yb); ctx.rotate(tilt || 0);
    ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2, -Lt, w, Lt); ctx.fillStyle = '#b9bdc4'; ctx.fillRect(-w / 2, -hpx / Math.cos(tilt || 0), w, hpx / Math.cos(tilt || 0));
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.strokeRect(-w / 2, -Lt, w, Lt); ctx.restore();
  }
  function cuve(x1, x2, y) { ctx.fillStyle = '#b9bdc4'; ctx.fillRect(x1, y, x2 - x1, 16); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.strokeRect(x1, y - 8, x2 - x1, 24); }

  SFA.theo("c09", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      TB('p = F / S', 230, 90, BLUE_D, 40); TB('pascal (Pa) = N/m²', 230, 124, GREY, 16);
      ctx.fillStyle = '#cfe3f6'; ctx.fillRect(40, 160, 380, 70); LN(40, 160, 420, 160, BLUE, 2.4); for (var i = 0; i < 7; i++) { A(80 + i * 50, 176, 0, 30, ORANGE, '', 2.4); }
      TB('solides · liquides · gaz', 230, 250, INK, 16);
    }),
    sub: [
      {
        t: "Force et surface",
        anim: q_an(function (t) {
          var ph = (t % 540) / 540, u = .5 - .5 * Math.cos(ph * 2 * PI), w = 30 + 270 * u, S = w / 6000, pp = 500 / S, d = 8 + 50 * (pp - 10000) / 90000, gy = 200, cx = 200;
          ctx.fillStyle = '#d9c6a0'; ctx.beginPath(); ctx.moveTo(10, gy); ctx.lineTo(cx - w / 2, gy); ctx.lineTo(cx - w / 2, gy + d); ctx.lineTo(cx + w / 2, gy + d); ctx.lineTo(cx + w / 2, gy); ctx.lineTo(400, gy); ctx.lineTo(400, 290); ctx.lineTo(10, 290); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
          ctx.fillStyle = '#9aa7b4'; ctx.fillRect(cx - w / 2, gy + d - 10, w, 10); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.strokeRect(cx - w / 2, gy + d - 10, w, 10);
          ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.fillRect(cx - 40, gy + d - 70, 80, 60); ctx.strokeRect(cx - 40, gy + d - 70, 80, 60); TB('F = 500 N', cx, gy + d - 34, BLUE_D, 15);
          A(cx, gy + d - 110, 0, 36, RED, '', 3.4); TB('S = ' + fr(S, 3) + ' m²', cx, 285, INK, 14);
          var tx = 440; TB('même force F = 500 N', tx, 60, BLUE_D, 18, 'left'); TB('surface S = ' + fr(S, 3) + ' m²', tx, 100, INK, 20, 'left');
          TB('p = F / S', tx, 150, ORANGE, 22, 'left'); q_box(tx + 120, 200, 240, 48, DRED, '#fdeaea', fr(pp / 1000, 1) + ' kPa', 26);
          TB(S < .02 ? 'petite surface : on s\'enfonce' : S > .035 ? 'grande surface : pression faible' : '', tx, 262, GREY, 14, 'left');
        }),
        th:
          '<div class="tcard"><b class="h">Définition de la pression</b><p>Une force <b>pressante</b> F s\'exerce <b>perpendiculairement</b> sur une surface S. La <b>pression</b> est la force répartie sur chaque unité de surface :</p><p style="text-align:center"><b>p = F / S</b></p><p>Unités : F en <b>newtons</b>, S en <b>m²</b>, p en <b>pascals</b> (Pa = N/m²). Autres unités : 1 hPa = 100 Pa ; 1 kPa = 1 000 Pa ; 1 bar = 100 000 Pa ; 1 cm² = 0,000 1 m².</p><p><b>Exemple :</b> 100 N sur 0,5 m² donnent p = 100 / 0,5 = <b>200 Pa</b>. Convertis d\'abord : 40 cm² = 0,004 m².</p></div>' +
          '<div class="tcard"><b class="h">Jouer sur la surface</b><p>À force égale, la pression est <b>d\'autant plus grande que la surface est petite</b>. On diminue S pour couper ou percer (couteau, clou, talon aiguille) ; on augmente S pour ne pas s\'enfoncer (raquettes, skis, chenilles, semelles larges).</p><p><b>Exemple :</b> un élève de 50 kg pèse F = 50 × 9,81 ≈ 490 N. Sur deux pieds (400 cm² = 0,04 m²) : p ≈ <b>12,3 kPa</b>. Sur un seul pied (0,02 m²) : p ≈ <b>24,5 kPa</b>, le double.</p><p><b>Piège :</b> la force pressante n\'est pas toujours le poids, et ce n\'est pas la force qui change avec les raquettes, mais la surface.</p></div>'
      },
      {
        t: "Pression dans un liquide",
        anim: q_an(function (t) {
          var ph = (t % 600) / 600, u = .5 - .5 * Math.cos(ph * 2 * PI), h = 20 * u, y0 = 40, k = 11, yp = y0 + h * k, px = 180;
          ctx.fillStyle = 'rgba(120,180,235,.3)'; ctx.fillRect(40, y0, 280, 250); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.strokeRect(40, y0, 280, 250); LN(40, y0, 320, y0, BLUE, 2.5);
          [0, 5, 10, 15, 20].forEach(function (v) { LN(40, y0 + v * k, 52, y0 + v * k, GREY, 1.2); T(v + ' m', 36, y0 + v * k + 4, GREY, 11, 'right'); });
          var pw = 9810 * h, ar = 6 + 40 * pw / 196200;
          DOT(px, yp, 10, '#fdf1e0'); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(px, yp, 10, 0, 7); ctx.stroke();
          A(px - 10 - ar, yp, ar, 0, RED, '', 3); A(px + 10 + ar, yp, -ar, 0, RED, '', 3); A(px, yp - 10 - ar, 0, ar, RED, '', 3); A(px, yp + 10 + ar, 0, -ar, RED, '', 3);
          var tx = 400; TB('profondeur h = ' + fr(h, 1) + ' m', tx, 60, INK, 20, 'left');
          TB('p eau = ρ·g·h', tx, 110, BLUE_D, 20, 'left'); TB('= 1 000 × 9,81 × ' + fr(h, 1), tx, 138, GREY, 15, 'left'); TB('= ' + nf(pw) + ' Pa', tx, 166, BLUE_D, 18, 'left');
          TB('+ p atm = 101 300 Pa', tx, 200, GREY, 15, 'left'); q_box(tx + 110, 244, 220, 42, DRED, '#fdeaea', 'p totale ≈ ' + fr((pw + 101300) / 100000, 2) + ' bar', 20);
        }),
        th:
          '<div class="tcard"><b class="h">Pression hydrostatique</b><p>Dans un liquide au repos, la pression augmente avec la <b>profondeur</b> h : <b>p = ρ · g · h</b> (en plus de la pression de l\'air à la surface). ρ est la masse volumique (eau : 1 000 kg/m³ ; mer : 1 030 kg/m³), g = 9,81 N/kg.</p><ul><li>Elle s\'exerce dans <b>toutes les directions</b>, perpendiculairement aux parois.</li><li>Elle ne dépend <b>que</b> de ρ et de h, pas de la forme ni de la largeur du récipient : même hauteur d\'eau = même pression au fond.</li><li>Tous les points d\'un même liquide à la même profondeur ont la même pression.</li></ul><p><b>Exemple :</b> à 15 m dans la mer, Δp = 1 030 × 9,81 × 15 ≈ 151 600 Pa ≈ <b>1,52 bar</b> ; avec la pression atmosphérique, p ≈ <b>2,53 bar</b>. Environ 1 bar de plus tous les 10 m dans l\'eau.</p></div>' +
          '<div class="tcard"><b class="h">Principe de Pascal et presse hydraulique</b><p>Une pression exercée sur un liquide incompressible enfermé se <b>transmet intégralement</b> dans tout le liquide. Dans une presse hydraulique, la pression est la même sous les deux pistons : <b>F₁ / S₁ = F₂ / S₂</b>.</p><p><b>Exemple :</b> pistons de 5 cm² et de 250 cm², 80 N sur le petit : F₂ = 80 × 250 / 5 = <b>4 000 N</b> (soit environ 408 kg soulevés). Mais le liquide déplacé est le même : S₁·d₁ = S₂·d₂, donc pour monter le grand piston de 2 cm, le petit descend de <b>100 cm</b>. On gagne en force, on perd en distance : le travail est conservé (80 N × 1 m = 4 000 N × 0,02 m = 80 J).</p></div>'
      },
      {
        t: "Pression atmosphérique",
        anim: q_an(function (t) {
          var ph = (t % 720) / 720, u = .5 - .5 * Math.cos(ph * 2 * PI), h = 4800 * u, p = 101300 * Math.exp(-h / 7900), hm = p / (13600 * 9.81) * 1000;
          ctx.fillStyle = '#d6dde4'; ctx.beginPath(); ctx.moveTo(20, 270); ctx.lineTo(150, 50); ctx.lineTo(190, 90); ctx.lineTo(210, 70); ctx.lineTo(330, 270); ctx.closePath(); ctx.fill(); ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.stroke();
          var my = 270 - 220 * u, mx = 20 + (150 - 20) * (220 * u) / 220; DOT(mx, my, 9, ORANGE); TB('h = ' + nf(h) + ' m', mx + 44, my + 4, ORANGE, 14, 'left');
          var bx = 470, yb = 262, k = 190 / 760; cuve(420, 520, yb);
          tube(bx, yb, hm * k, 215, 22, 0); LN(410, yb - hm * k, 440, yb - hm * k, DRED, 2, [4, 3]); TB('vide', bx + 34, yb - 205, GREY, 12, 'left');
          A(432, yb - 40, 0, 26, RED, '', 3); A(508, yb - 40, 0, 26, RED, '', 3); TB('p atm', 424, yb - 50, DRED, 13, 'right');
          var tx = 560; TB('p = ' + nf(p) + ' Pa', tx, 80, BLUE_D, 18, 'left'); TB('(≈ ' + nf(p / 100) + ' hPa)', tx, 106, GREY, 14, 'left');
          TB('colonne de mercure', tx, 160, INK, 14, 'left'); q_box(tx + 60, 195, 130, 42, DRED, '#fdeaea', nf(hm) + ' mm', 22);
          TB('h = p / (ρ·g)', tx, 250, GREY, 14, 'left');
        }),
        th:
          '<div class="tcard"><b class="h">L\'air aussi exerce une pression</b><p>L\'atmosphère a un poids : au niveau de la mer, la <b>pression atmosphérique</b> vaut environ <b>101 300 Pa</b> (1 013 hPa ≈ 1 bar). Elle <b>diminue avec l\'altitude</b> : environ 55 000 Pa au sommet du Mont Blanc (4 800 m). Elle s\'exerce dans toutes les directions : sur 1 dm² (0,01 m²) l\'air exerce ≈ 1 013 N au niveau de la mer, mais on ne le sent pas, car la pression agit aussi de l\'intérieur du corps et les forces se compensent.</p></div>' +
          '<div class="tcard"><b class="h">L\'expérience de Torricelli</b><p>Un tube rempli de mercure, retourné dans une cuve, se vide jusqu\'à ce que la pression due à la colonne équilibre la pression de l\'air : <b>p atm = ρ · g · h</b>. Au niveau de la mer : h = 101 300 / (13 600 × 9,81) ≈ <b>760 mm</b>. Au Mont Blanc : h ≈ <b>412 mm</b>.</p><ul><li>La hauteur <b>verticale</b> ne dépend ni du diamètre du tube, ni de son inclinaison (la colonne s\'allonge simplement), ni de sa longueur.</li><li>Au-dessus du mercure : le <b>vide</b>.</li></ul><p><b>Boire à la paille :</b> en aspirant, on diminue la pression dans la paille ; la pression atmosphérique sur le liquide du verre le <b>pousse</b> dans la paille. Rien ne « tire » ni n\'« aspire » : on ne peut que pousser par une pression.</p></div>' +
          '<div class="tcard"><b class="h">Méthode et pièges</b><ul><li>Toujours convertir en unités SI : Pa, N, m².</li><li>Pression dans un liquide : p = ρ·g·h ; ajouter p atm pour la pression totale.</li><li>Ne confonds pas <b>force</b> (N) et <b>pression</b> (Pa) : une grande force sur une grande surface peut donner une petite pression.</li><li>1 bar ≈ 1 atmosphère ≈ 10 m d\'eau.</li></ul></div>'
      }
    ]
  });

  SFA.figs("c09", [
    /* 0 p = F/S */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      ctx.fillStyle = '#c5ccd4'; ctx.fillRect(110, 190, 240, 18); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.strokeRect(110, 190, 240, 18); TB('S = 0,5 m²', 230, 232, INK, 16);
      for (var i = 0; i < 5; i++) A(140 + i * 45, 80, 0, 100, ORANGE, '', 3.2);
      TB('F = 100 N (perpendiculaire)', 230, 52, ORANGE, 16);
      if (g > 0) { ctx.globalAlpha = g; q_box(230, 262, 300, 32, DRED, '#fdeaea', 'p = 100 / 0,5 = 200 Pa', 17); ctx.globalAlpha = 1; } else TB('p = ?', 230, 262, GREY, 18);
    }),
    /* 1 Convertir */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), R = [['1 013 hPa', '101 300 Pa', '× 100'], ['2,5 bar', '250 kPa', '× 100 000 Pa'], ['40 cm²', '0,004 m²', '× 0,000 1']];
      R.forEach(function (r, i) {
        var y = 70 + i * 70; q_box(100, y, 150, 40, BLUE, '#eef4fb', r[0], 17);
        A(180, y, 70, 0, GREY, '', 2.4); TB(r[2], 215, y - 14, GREY, 11);
        if (g > i / 3) { ctx.globalAlpha = q_s(g, i / 3, i / 3 + .3); q_box(350, y, 160, 40, DGREEN, '#e9f6f0', r[1], 17); ctx.globalAlpha = 1; } else q_box(350, y, 160, 40, GREY, '#fafafa', '?', 17);
      });
      TB('unités SI : Pa et m²', 230, 258, INK, 14);
    }),
    /* 2 Raquettes */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), gy = 190;
      function snow(x1, x2, d, wc) { ctx.fillStyle = '#eef3f8'; ctx.beginPath(); ctx.moveTo(x1, gy); ctx.lineTo(wc[0], gy); ctx.lineTo(wc[0], gy + d); ctx.lineTo(wc[1], gy + d); ctx.lineTo(wc[1], gy); ctx.lineTo(x2, gy); ctx.lineTo(x2, 245); ctx.lineTo(x1, 245); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#8aa1b8'; ctx.lineWidth = 2; ctx.stroke(); }
      var d1 = 14 + 50 * g, d2 = 8 + 4 * g;
      snow(15, 225, d1, [95, 135]); snow(235, 445, d2, [290, 390]);
      pers(115, gy + d1 - 6, 95, BLUE, 1, '', 'center'); pers(340, gy + d2 - 6, 95, ORA2, 1, '', 'center');
      ctx.fillStyle = '#9aa7b4'; ctx.fillRect(290, gy + d2 - 6, 100, 6);
      TB('bottes : S petite', 115, 24, BLUE_D, 15); TB('raquettes : S grande', 340, 24, ORANGE, 15);
      if (g > 0) { ctx.globalAlpha = g; TB('p grande', 115, 268, DRED, 17); TB('p petite', 340, 268, DGREEN, 17); ctx.globalAlpha = 1; }
    }),
    /* 3 Un pied ou deux */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      function foot(x, y, col) { ctx.fillStyle = col + '44'; ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - 22, y - 50, 44, 100, 22); ctx.fill(); ctx.stroke(); }
      foot(80, 120, BLUE); foot(150, 120, BLUE); foot(340, 120, ORA2);
      TB('deux pieds', 115, 40, BLUE_D, 15); TB('S = 400 cm² = 0,04 m²', 115, 200, BLUE_D, 13); TB('un pied', 340, 40, ORANGE, 15); TB('S = 0,02 m²', 340, 200, ORANGE, 13);
      TB('F = 50 × 9,81 ≈ 490 N', 230, 238, INK, 14);
      if (g > 0) { ctx.globalAlpha = g; TB('p ≈ 12,3 kPa', 115, 264, DRED, 17); TB('p ≈ 24,5 kPa', 340, 264, DRED, 17); TB('×2', 230, 128, DGREEN, 30); ctx.globalAlpha = 1; } else TB('p ?', 230, 264, GREY, 18);
    }),
    /* 4 Au fond de la mer */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), y0 = 40, k = 14;
      ctx.fillStyle = 'rgba(120,180,235,.3)'; ctx.fillRect(50, y0, 120, 15 * k + 14); LN(50, y0, 170, y0, BLUE, 2.5);
      [0, 5, 10, 15].forEach(function (v) { LN(50, y0 + v * k, 62, y0 + v * k, GREY, 1.2); T(v + ' m', 46, y0 + v * k + 4, GREY, 11, 'right'); });
      DOT(120, y0 + 15 * k, 11, '#fdf1e0'); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(120, y0 + 15 * k, 11, 0, 7); ctx.stroke(); TB('plongeur', 120, y0 + 15 * k - 20, ORANGE, 13);
      var bx = 270, bw = 70, sc = 70; // 1 bar = 70 px
      ctx.fillStyle = GREY + '66'; ctx.fillRect(bx, 250 - 1.013 * sc, bw, 1.013 * sc); ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.strokeRect(bx, 250 - 1.013 * sc, bw, 1.013 * sc); TB('p atm', bx + bw + 10, 250 - .5 * sc, GREY, 14, 'left'); TB('1,01 bar', bx + bw + 10, 250 - .5 * sc + 18, GREY, 13, 'left');
      if (g > 0) {
        var h2 = 1.516 * sc * g; ctx.fillStyle = BLUE + '66'; ctx.fillRect(bx, 250 - 1.013 * sc - h2, bw, h2); ctx.strokeStyle = BLUE_D; ctx.strokeRect(bx, 250 - 1.013 * sc - h2, bw, h2);
        if (g > .9) { TB('ρ·g·h ≈ 1,52 bar', bx + bw + 10, 250 - 1.013 * sc - h2 / 2, BLUE_D, 14, 'left'); TB('p totale ≈ 2,53 bar', bx + bw / 2, 250 - 2.53 * sc - 10, DRED, 16); }
      } else TB('p totale = ?', bx + bw / 2, 100, GREY, 17);
      TB('15 m ; ρ = 1 030 kg/m³', 110, 270, INK, 13);
    }),
    /* 5 Deux récipients */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), yb = 220, hh = 130;
      ctx.fillStyle = 'rgba(120,180,235,.35)'; ctx.fillRect(40, yb - hh, 170, hh); ctx.fillRect(310, yb - hh, 40, hh);
      ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(40, yb - 160); ctx.lineTo(40, yb); ctx.lineTo(210, yb); ctx.lineTo(210, yb - 160); ctx.stroke(); ctx.beginPath(); ctx.moveTo(310, yb - 160); ctx.lineTo(310, yb); ctx.lineTo(350, yb); ctx.lineTo(350, yb - 160); ctx.stroke();
      LN(30, yb - hh, 360, yb - hh, BLUE, 1.6, [5, 4]); A(400, yb - hh, 0, hh, GREY, '', 2); A(400, yb, 0, -hh, GREY, '', 2); TB('20 cm', 405, yb - hh / 2 + 4, GREY, 13, 'left');
      A(125, yb - 28, 0, 22, RED, '', 3); A(330, yb - 28, 0, 22, RED, '', 3);
      if (g > 0) { ctx.globalAlpha = g; TB('même p = ρ·g·h ≈ 1 960 Pa', 230, 260, DGREEN, 16); ctx.globalAlpha = 1; } else TB('p au fond : comparer ?', 230, 260, GREY, 16);
    }),
    /* 6 Presse hydraulique */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), yb = 200;
      ctx.fillStyle = 'rgba(120,180,235,.35)'; ctx.fillRect(60, yb - 30, 330, 50); ctx.fillRect(75, yb - 60, 40, 30); ctx.fillRect(310, yb - 60, 60, 30);
      ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(75, 90); ctx.lineTo(75, yb - 30); ctx.lineTo(60, yb - 30); ctx.lineTo(60, yb + 20); ctx.lineTo(390, yb + 20); ctx.lineTo(390, yb - 30); ctx.lineTo(370, yb - 30); ctx.lineTo(370, 100); ctx.moveTo(115, 90); ctx.lineTo(115, yb - 30); ctx.lineTo(310, yb - 30); ctx.lineTo(310, 100); ctx.stroke();
      ctx.fillStyle = '#9aa7b4'; ctx.fillRect(77, yb - 66, 36, 8); ctx.fillRect(312, yb - 66, 56, 8);
      A(95, 80, 0, 40, BLUE, '', 3.4); TB('F₁ = 80 N', 95, 66, BLUE_D, 14); TB('S₁ = 5 cm²', 95, 245, INK, 13);
      ctx.fillStyle = '#fdf1e0'; ctx.fillRect(320, yb - 106, 40, 40); ctx.strokeStyle = ORANGE; ctx.strokeRect(320, yb - 106, 40, 40); TB('charge', 340, yb - 82, ORANGE, 12); TB('S₂ = 250 cm²', 340, 245, INK, 13);
      if (g > 0) { ctx.globalAlpha = g; A(340, yb - 118, 0, -45 * g, DRED, '', 4); TB('F₂ = 4 000 N', 322, 48, DRED, 15, 'right'); TB('≈ 408 kg', 322, 68, DGREEN, 14, 'right'); TB('petit piston : 100 cm ↓  ;  grand : 2 cm ↑', 230, 270, GREY, 13); ctx.globalAlpha = 1; } else TB('F₂ ?', 322, 48, GREY, 16, 'right');
    }),
    /* 7 Tube large, tube penché */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), yb = 230, h = 140, xs = [90, 230, 370];
      cuve(40, 420, yb); ctx.fillStyle = '#b9bdc4';
      LN(30, yb - h, 440, yb - h, BLUE, 1.6, [5, 4]);
      tube(xs[0], yb, h, 185, 20, 0); tube(xs[1], yb, h, 185, 44, 0);
      /* tube penché : colonne dont la hauteur verticale vaut h */
      tube(xs[2] - 10, yb, h, 185, 20, 0.25);
      TB('normal', xs[0], 262 + 6, INK, 13); TB('2 × plus large', xs[1], 268, INK, 13); TB('penché', xs[2], 268, INK, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('h ≈ 760 mm dans les 3 cas', 230, 22, DGREEN, 17); ctx.globalAlpha = 1; } else TB('quelle hauteur ?', 230, 22, GREY, 17);
    }),
    /* 8 Mont Blanc */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), k = 150 / 760;
      ctx.fillStyle = '#d6dde4'; ctx.beginPath(); ctx.moveTo(10, 250); ctx.lineTo(150, 60); ctx.lineTo(180, 90); ctx.lineTo(200, 75); ctx.lineTo(300, 250); ctx.closePath(); ctx.fill(); ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.stroke(); TB('4 800 m', 150, 50, INK, 13);
      TB('mer', 340, 258, INK, 13);
      cuve(310, 370, 225); tube(340, 225, 760 * k, 180, 16, 0); TB('760 mm', 352, 225 - 760 * k + 6, DGREEN, 13, 'left');
      cuve(398, 448, 225); tube(423, 225, 412 * k * g, 180, 16, 0);
      TB('sommet', 423, 258, INK, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('412 mm', 423, 225 - 412 * k - 8, DRED, 13); ctx.globalAlpha = 1; TB('p = 55 000 Pa → F = 550 N sur 1 dm²', 230, 274, DRED, 14); } else TB('hauteur au sommet ?', 230, 274, GREY, 14);
    }),
    /* 9 Boire à la paille */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), lv = 190 - 60 * g;
      ctx.fillStyle = 'rgba(240,160,60,.35)'; ctx.beginPath(); ctx.moveTo(150, 190); ctx.lineTo(310, 190); ctx.lineTo(300, 260); ctx.lineTo(160, 260); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(145, 150); ctx.lineTo(160, 262); ctx.lineTo(300, 262); ctx.lineTo(315, 150); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.fillRect(250, 50, 14, 200); ctx.strokeRect(250, 50, 14, 200);
      ctx.fillStyle = 'rgba(240,160,60,.5)'; ctx.fillRect(251, lv + 0, 12, 250 - lv);
      A(185, 160, 0, 26, RED, '', 3); A(215, 160, 0, 26, RED, '', 3); TB('p atm', 200, 148, DRED, 13);
      TB('bouche', 320, 54, INK, 14, 'left'); A(307, 60, -35, 0, GREY, '', 2);
      if (g > 0) { ctx.globalAlpha = g; TB('p plus faible', 328, 110, DGREEN, 14, 'left'); TB('dans la paille', 328, 128, DGREEN, 14, 'left'); TB('p atm pousse', 328, 180, DRED, 14, 'left'); TB('le liquide', 328, 198, DRED, 14, 'left'); ctx.globalAlpha = 1; } else TB('pourquoi', 328, 130, GREY, 15, 'left'); TB('monte-t-il ?', 328, 150, GREY, 15, 'left');
    })
  ]);
})();
