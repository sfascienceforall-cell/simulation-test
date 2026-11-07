/* Physique 3e · chapitre 10 · Poussée d'Archimède, flottaison et fluides en mouvement (utilise les aides q_* de theo-01.js) */
(function () {
  function fr(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
  function water(x1, x2, yt, yb, a) { ctx.fillStyle = 'rgba(120,180,235,' + (a || .3) + ')'; ctx.fillRect(x1, yt, x2 - x1, yb - yt); LN(x1, yt, x2, yt, BLUE, 2.4); }
  function tank(x1, x2, yt, yb, ytop) { ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x1, ytop); ctx.lineTo(x1, yb); ctx.lineTo(x2, yb); ctx.lineTo(x2, ytop); ctx.stroke(); }
  function dyn(x, y0, L, reading, lab) {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 26, y0, 52, 70, 5); ctx.fill(); ctx.stroke();
    TB(lab, x, y0 + 40, DRED, 14); LN(x, y0 + 70, x, y0 + 70 + L, '#7f8790', 3);
  }
  function obj(x, y, w, h, col, lab) { ctx.fillStyle = col + '55'; ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, h, 4); ctx.fill(); ctx.stroke(); if (lab) TB(lab, x, y + h / 2 + 5, dk(col), 13); }

  SFA.theo("c10", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      water(30, 430, 120, 250, .3); tank(30, 430, 120, 250, 90);
      ctx.fillStyle = '#fdf1e0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(200, 140, 60, 50, 6); ctx.fill(); ctx.stroke();
      A(230, 190, 0, 46, RED, '', 3.4); A(230, 140, 0, -46, GREEN, '', 3.4); TB('P', 252, 232, DRED, 15, 'left'); TB('Π', 252, 110, DGREEN, 17, 'left');
      TB('Π = ρ · V · g', 120, 70, BLUE_D, 30); TB('flotte ou coule ?', 360, 70, ORANGE, 17);
      TB('Archimède · flottaison · portance', 230, 240, INK, 15, 'center');
    }),
    sub: [
      {
        t: "Poussée d'Archimède",
        anim: q_an(function (t) {
          var ph = (t % 600) / 600, u = ph < .15 ? 0 : ph < .75 ? (.5 - .5 * Math.cos((ph - .15) / .6 * PI)) : 1; if (ph > .9) u = 1 - (ph - .9) / .1; if (ph >= .75 && ph <= .9) u = 1;
          var wy = 150, bx = 210, top0 = 80, yTop = top0 + 90 * u, d = 60, immerse = q_c((yTop + d - wy) / d, 0, 1), P = 4.0, Pi = 1.0 * immerse;
          water(60, 360, wy, 285, .3); tank(60, 360, wy, 285, 70); LN(bx, 20, bx, yTop, '#7f8790', 3);
          ctx.fillStyle = '#fdf1e0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(bx - 40, yTop, 80, d, 5); ctx.fill(); ctx.stroke(); TB('V = 102 cm³', bx, yTop + 34, ORANGE, 13);
          A(bx + 56, yTop + 30, 0, 50, RED, '', 3.4); TB('P', bx + 74, yTop + 82, DRED, 15, 'left');
          if (Pi > .02) { A(bx - 56, yTop + 30, 0, -50 * Pi, GREEN, '', 3.4); TB('Π', bx - 74, yTop + 30 - 50 * Pi - 6, DGREEN, 16, 'right'); }
          var tx = 420; TB('poids dans l\'air : P = 4,0 N', tx, 60, DRED, 17, 'left'); TB('poussée : Π = ρ·V·g', tx, 110, DGREEN, 18, 'left');
          TB('= 1 000 × ' + fr(immerse * 102, 0) + '·10⁻⁶ × 9,81', tx, 138, GREY, 14, 'left'); TB('Π = ' + fr(Pi, 2) + ' N', tx, 166, DGREEN, 20, 'left');
          q_box(tx + 120, 226, 240, 48, BLUE_D, '#eef4fb', 'lecture : ' + fr(P - Pi, 2) + ' N', 22);
          TB('lecture = P − Π', tx, 275, GREY, 14, 'left');
        }),
        th:
          '<div class="tcard"><b class="h">La poussée d\'Archimède</b><p>Tout corps plongé dans un fluide (liquide ou gaz) subit de la part de ce fluide une force <b>verticale, dirigée vers le haut</b>, égale au <b>poids du fluide déplacé</b> :</p><p style="text-align:center"><b>Π = ρ<sub>fluide</sub> · V<sub>immergé</sub> · g</b></p><ul><li>Elle vient de la pression qui augmente avec la profondeur : la poussée vers le haut sous l\'objet est plus grande que la poussée vers le bas sur le dessus.</li><li>Elle dépend du <b>fluide</b>, du <b>volume immergé</b> et de g ; elle ne dépend <b>pas</b> de la masse ni de la matière de l\'objet.</li><li>Elle agit sur tout objet immergé, qu\'il flotte ou qu\'il coule.</li></ul><p><b>Exemple :</b> un cube de 200 cm³ (2·10⁻⁴ m³) dans l\'eau : Π = 1 000 × 2·10⁻⁴ × 9,81 ≈ <b>1,96 N</b>.</p></div>' +
          '<div class="tcard"><b class="h">Peser dans l\'eau</b><p>Un dynamomètre indique la force qui retient l\'objet : <b>lecture = P − Π</b>. Un objet de 4,0 N dans l\'air qui « pèse » 3,0 N dans l\'eau subit Π = <b>1,0 N</b>. On en déduit son volume V = Π / (ρ·g) ≈ 1,02·10⁻⁴ m³ ≈ <b>102 cm³</b>, sa masse m = P / g ≈ 0,408 kg et sa masse volumique ρ = m / V ≈ <b>4 000 kg/m³</b> (4,0 g/cm³).</p><p><b>Pièges :</b> convertir les volumes (1 cm³ = 10⁻⁶ m³ ; 1 L = 10⁻³ m³) ; utiliser le volume <b>immergé</b> ; ne pas confondre la poussée Π (en N) avec la masse volumique ρ.</p></div>'
      },
      {
        t: "Flotte ou coule ?",
        anim: q_an(function (t) {
          var ph = (t % 720) / 720, tt = ph / .85, wy = 150, yb = 280;
          water(40, 660, wy, yb, .28); tank(40, 660, wy, yb, 90);
          var O = [['liège', .24, '#c9a26b'], ['chêne', .70, '#b07a3c'], ['glace', .92, '#8fc8e8'], ['fer', 7.9, '#7f8790']], s = 64;
          O.forEach(function (o, i) {
            var x = 130 + i * 145, f = Math.min(o[1], 1), tgt = o[1] < 1 ? wy - s * (1 - f) : yb - s - 2, osc = ph < .85 ? 70 * Math.exp(-4 * tt) * Math.cos(tt * 18) : 0, y = o[1] < 1 ? tgt - Math.abs(osc) * (osc > 0 ? 1 : .3) : tgt - Math.max(0, 90 * (1 - q_c(tt * 2.2, 0, 1))) * 1;
            if (o[1] < 1) y = tgt - 80 * Math.max(0, 1 - tt * 3) + osc * .35;
            ctx.fillStyle = o[2] + '99'; ctx.strokeStyle = dk(o[2]); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - s / 2, y, s, s, 5); ctx.fill(); ctx.stroke();
            TB(o[0], x, y + s / 2 + 5, INK, 14);
            TB('ρ = ' + fr(o[1], o[1] > 1 ? 1 : 2), x, 50, dk(o[2]), 15); TB(o[1] < 1 ? 'flotte' : 'coule', x, 72, o[1] < 1 ? DGREEN : DRED, 16);
          });
          TB('ρ eau = 1,00 g/cm³ : flotte si ρ objet < ρ liquide', 350, 22, INK, 16);
        }),
        th:
          '<div class="tcard"><b class="h">Comparer le poids et la poussée</b><p>Un objet entièrement immergé est soumis à son poids P (vers le bas) et à la poussée Π (vers le haut).</p><ul><li>Π &lt; P : il <b>coule</b> ;</li><li>Π = P : il reste en équilibre entre deux eaux ;</li><li>Π &gt; P : il <b>remonte</b> et <b>flotte</b> à la surface, jusqu\'à ce que le volume immergé donne <b>Π = P</b>.</li></ul><p>Pour un objet plein et homogène, cela revient à comparer les masses volumiques : <b>ρ<sub>objet</sub> &lt; ρ<sub>liquide</sub> → flotte</b>. À la flottaison : ρ<sub>liquide</sub>·V<sub>immergé</sub> = m, donc <b>fraction immergée = ρ<sub>objet</sub> / ρ<sub>liquide</sub></b>.</p><p><b>Exemple :</b> un nageur de 70 kg et 70 L dans la Mer Morte (1 240 kg/m³) : V<sub>immergé</sub> = 70 / 1 240 ≈ 56,5 L, soit <b>81 %</b> de son volume (97 % en mer, 1 030 kg/m³).</p></div>' +
          '<div class="tcard"><b class="h">Bateaux, glaçons et ludions</b><ul><li><b>Navire en acier :</b> une coque creuse déplace beaucoup d\'eau pour peu de matière ; sa masse volumique <b>moyenne</b> (acier + air) est inférieure à celle de l\'eau.</li><li><b>Bateau de pâte :</b> 150 g de pâte (base 10 × 10 cm) déplacent 150 cm³ d\'eau, soit un tirant d\'eau de 1,5 cm ; avec des bords de 3 cm, il peut porter 300 g au total.</li><li><b>Glaçon qui fond :</b> il déplace une masse d\'eau égale à sa masse ; fondu, il occupe le même volume : le niveau ne change pas.</li><li><b>Ludion :</b> en comprimant l\'air (p·V = constante), son volume diminue, la poussée diminue et il coule.</li></ul></div>'
      },
      {
        t: "Fluides en mouvement : la portance",
        anim: q_an(function (t) {
          var ph = (t % 720) / 720, m = 1 + .5 * (1 - Math.cos(ph * 2 * PI)) / 1 * 1, v = 40 * (1 + (1 - Math.cos(ph * 2 * PI)) / 2), L = Math.pow(v / 40, 2);
          var cx = 230, cy = 160, rot = 0.14;
          function line(y0, bump, col) { ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.beginPath(); for (var x = 20; x <= 440; x += 6) { var yy = y0 - bump * Math.exp(-Math.pow((x - cx) / 75, 2)); x === 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
          [-70, -50, -32].forEach(function (o) { line(cy + o, 28 + o * -0.15, '#bcd3e8'); }); [32, 52, 72].forEach(function (o) { line(cy + o, -10, '#bcd3e8'); });
          for (var i = 0; i < 14; i++) { var yb = [-70, -50, -32, 32, 52, 72][i % 6] + cy, bp = i % 6 < 3 ? 28 + [-70, -50, -32][i % 6] * -0.15 : -10, sp = (v / 40) * (i % 6 < 3 ? 1.35 : 1), x = 20 + ((t * 1.1 * sp + i * 71) % 420), yy = yb - bp * Math.exp(-Math.pow((x - cx) / 75, 2)); DOT(x, yy, 3, i % 6 < 3 ? BLUE : GREY); }
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(0, 0, 96, 14, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
          TB('p basse (air rapide)', cx, cy - 92, BLUE_D, 14); TB('p plus haute (air plus lent)', cx, cy + 108, GREY, 14);
          A(cx, cy, 0, -40 * L * .7 - 20, GREEN, '', 4.4); TB('portance', cx + 14, cy - 40 * L * .7 - 34, DGREEN, 15, 'left');
          var tx = 500; TB('v = ' + fr(v, 0) + ' m/s', tx, 70, INK, 22, 'left'); TB('portance ≈ k·v²', tx, 120, DGREEN, 20, 'left'); TB('v × ' + fr(v / 40, 1), tx, 170, ORANGE, 18, 'left'); q_box(tx + 80, 224, 160, 46, DGREEN, '#e9f6f0', '× ' + fr(L, 1), 26);
          TB('(angle d\'attaque ≈ 8° fixe)', tx, 275, GREY, 13, 'left');
        }),
        th:
          '<div class="tcard"><b class="h">La portance d\'une aile</b><p>Un fluide en mouvement exerce aussi des forces. Une aile (ou une pale) dont le profil est incliné d\'un petit <b>angle d\'attaque</b> dévie l\'air vers le bas et le fait <b>circuler plus vite au-dessus</b> : la <b>pression y est plus basse</b> qu\'en dessous. Cette différence de pression produit une force dirigée vers le haut : la <b>portance</b>.</p><ul><li>À angle d\'attaque constant, la portance est proportionnelle à <b>v²</b> : doubler la vitesse la <b>multiplie par 4</b>.</li><li>Au-delà d\'un angle d\'environ 15°, l\'écoulement <b>décroche</b> et la portance chute : on ne peut pas augmenter l\'angle indéfiniment.</li><li>Un avion lent doit voler avec un plus grand angle d\'attaque.</li></ul><p><b>Fausse explication à éviter :</b> « l\'air doit mettre le même temps dessus et dessous ». Rien ne force les deux filets d\'air à arriver ensemble.</p></div>' +
          '<div class="tcard"><b class="h">Méthode et pièges du chapitre</b><ul><li>Poussée : Π = ρ<sub>fluide</sub>·V<sub>immergé</sub>·g, avec V en m³.</li><li>Pour décider flotte/coule, compare soit P et Π, soit ρ<sub>objet</sub> et ρ<sub>liquide</sub>.</li><li>La poussée ne dépend pas du poids de l\'objet : deux boules de même volume (plomb, aluminium) subissent la même poussée dans l\'eau.</li><li>Un objet qui coule reçoit quand même une poussée : il paraît plus léger.</li><li>La portance dépend de v², pas de v.</li></ul></div>'
      }
    ]
  });

  SFA.figs("c10", [
    /* 0 Calculer une poussée */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      water(40, 420, 100, 250, .3); tank(40, 420, 100, 250, 60);
      ctx.fillStyle = '#fdf1e0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.fillRect(190, 140, 80, 80); ctx.strokeRect(190, 140, 80, 80); TB('200 cm³', 230, 162, ORANGE, 15);
      DOT(230, 190, 3.5, DRED); A(230, 190, 0, 50, RED, '', 3.4); TB('P', 252, 245, DRED, 15, 'left');
      if (g > 0) { ctx.globalAlpha = g; A(230, 190, 0, -60 * g, GREEN, '', 4); TB('Π ≈ 1,96 N', 300, 150, DGREEN, 18, 'left'); TB('Π = 1 000 × 2·10⁻⁴ × 9,81', 230, 40, DGREEN, 15); ctx.globalAlpha = 1; } else TB('Π = ?', 320, 150, GREY, 18, 'left');
    }),
    /* 1 Flotte ou coule */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), wy = 120, yb = 250, O = [['chêne', .70, '#b07a3c'], ['fer', 7.9, '#7f8790'], ['glace', .92, '#8fc8e8'], ['liège', .24, '#c9a26b']], s = 50;
      water(20, 440, wy, yb, .28); tank(20, 440, wy, yb, 70);
      O.forEach(function (o, i) {
        var x = 70 + i * 107, y = o[1] < 1 ? wy - s * (1 - o[1]) : yb - s - 2;
        ctx.fillStyle = o[2] + '99'; ctx.strokeStyle = dk(o[2]); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - s / 2, y, s, s, 5); ctx.fill(); ctx.stroke();
        TB(o[0], x, 35, INK, 14); TB(fr(o[1], o[1] > 1 ? 1 : 2) + ' g/cm³', x, 54, GREY, 12);
        if (g > 0) { ctx.globalAlpha = g; TB(o[1] < 1 ? 'flotte' : 'coule', x, 272, o[1] < 1 ? DGREEN : DRED, 15); ctx.globalAlpha = 1; }
      });
      if (g <= 0) TB('eau : 1,00 g/cm³', 230, 272, GREY, 14);
    }),
    /* 2 Bateau en acier */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), wy = 130;
      water(20, 440, wy, 250, .28); tank(20, 440, wy, 250, 60);
      DOT(105, 215, 18, '#c8ced4'); ctx.strokeStyle = GREY; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(105, 215, 18, 0, 7); ctx.stroke(); TB('bille', 105, 248, INK, 13); TB('coule', 105, 40, DRED, 16);
      ctx.fillStyle = '#c8ced4'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(220, 110); ctx.lineTo(400, 110); ctx.lineTo(370, wy + 40); ctx.lineTo(250, wy + 40); ctx.closePath(); ctx.fill(); ctx.stroke(); TB('navire', 360, 100, INK, 13, 'left'); ctx.fillStyle = '#e9ecef'; ctx.fillRect(240, 88, 70, 22); ctx.strokeRect(240, 88, 70, 22); TB('flotte', 310, 40, DGREEN, 16);
      if (g > 0) { ctx.globalAlpha = g; ctx.fillStyle = 'rgba(29,158,117,.25)'; ctx.beginPath(); ctx.moveTo(250 + 6, wy); ctx.lineTo(370 - 6, wy); ctx.lineTo(370, wy + 40); ctx.lineTo(250, wy + 40); ctx.closePath(); ctx.fill(); A(310, wy + 20, 0, -50, GREEN, '', 3.4); TB('Π = poids de l\'eau déplacée = P', 230, 270, DGREEN, 14); ctx.globalAlpha = 1; }
    }),
    /* 3 Peser dans l'eau */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      dyn(110, 20, 60, 0, '4,0 N'); ctx.fillStyle = '#fdf1e0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(88, 150, 44, 44, 5); ctx.fill(); ctx.stroke(); TB('dans l\'air', 110, 225, INK, 14);
      water(250, 440, 140, 260, .3); tank(250, 440, 140, 260, 40);
      dyn(345, 20, 100, 0, '3,0 N'); ctx.fillStyle = '#fdf1e0'; ctx.strokeStyle = ORANGE; ctx.beginPath(); ctx.roundRect(323, 190, 44, 44, 5); ctx.fill(); ctx.stroke(); TB('dans l\'eau', 345, 272, INK, 14);
      if (g > 0) { ctx.globalAlpha = g; A(395, 220, 0, -50, GREEN, '', 3.4); TB('Π = 1,0 N', 395, 150, DGREEN, 14); TB('V ≈ 102 cm³', 180, 100, DGREEN, 15); TB('ρ ≈ 4,0 g/cm³', 180, 130, DRED, 15); ctx.globalAlpha = 1; } else TB('Π ? V ? ρ ?', 180, 100, GREY, 16);
    }),
    /* 4 Mer Morte */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      [[115, .97, 'eau de mer', '1 030'], [345, .81, 'Mer Morte', '1 240']].forEach(function (c) {
        var x = c[0], wy = 150, hh = 60, y = wy - hh * (1 - c[1] * (g > 0 ? 1 : .9));
        water(x - 100, x + 100, wy, 250, .3); tank(x - 100, x + 100, wy, 250, 70);
        ctx.fillStyle = '#fdf1e0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - 55, y, 110, hh, 14); ctx.fill(); ctx.stroke(); TB('70 kg · 70 L', x, y + 36, ORANGE, 13);
        TB(c[2] + ' (' + c[3] + ')', x, 40, INK, 14);
        if (g > 0) { ctx.globalAlpha = g; TB(Math.round(c[1] * 100) + ' % immergé', x, 274, c[1] > .9 ? BLUE_D : DRED, 15); ctx.globalAlpha = 1; }
      });
      if (g > 0) { ctx.globalAlpha = g; TB('13,5 L dehors', 345, 90, DGREEN, 14); ctx.globalAlpha = 1; } else TB('fraction immergée ?', 230, 274, GREY, 15);
    }),
    /* 5 Plomb ou aluminium */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), wy = 70;
      water(30, 430, wy, 260, .28); tank(30, 430, wy, 260, 40);
      [[130, '#5b6670', 'plomb', 1.5], [330, '#b9c3cc', 'aluminium', .6]].forEach(function (b) {
        DOT(b[0], 150, 32, b[1]); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(b[0], 150, 32, 0, 7); ctx.stroke(); TB(b[2], b[0], 155, b[3] > 1 ? '#fff' : INK, 11);
        A(b[0] + 44, 150, 0, 24 * (b[3] > 1 ? 2.3 : .9) + 10, RED, '', 3.4); TB('P', b[0] + 62, 156 + 24 * (b[3] > 1 ? 2.3 : .9) + 4, DRED, 14, 'left');
        if (g > 0) { ctx.globalAlpha = g; A(b[0] - 44, 150, 0, -52 * g, GREEN, '', 3.4); TB('Π', b[0] - 62, 120, DGREEN, 16, 'right'); ctx.globalAlpha = 1; }
      });
      if (g > 0) TB('même V, même liquide : même Π', 230, 272, DGREEN, 15); else TB('Π : plomb > aluminium ?', 230, 272, GREY, 15);
    }),
    /* 6 Bateau de pâte */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), k = 18, wy = 170, x = 230, w = 10 * k, hh = 3 * k, yb = wy + 1.5 * k;
      water(30, 430, wy, 250, .3); tank(30, 430, wy, 250, 100);
      ctx.fillStyle = '#e9c7a0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x - w / 2, yb - hh); ctx.lineTo(x - w / 2, yb); ctx.lineTo(x + w / 2, yb); ctx.lineTo(x + w / 2, yb - hh); ctx.lineTo(x + w / 2 - 8, yb - hh); ctx.lineTo(x + w / 2 - 8, yb - 8); ctx.lineTo(x - w / 2 + 8, yb - 8); ctx.lineTo(x - w / 2 + 8, yb - hh); ctx.closePath(); ctx.fill(); ctx.stroke();
      TB('150 g · base 10 × 10 cm', x, 60, ORANGE, 15);
      if (g > 0) { ctx.globalAlpha = g; LN(x + w / 2 + 14, wy, x + w / 2 + 14, yb, DGREEN, 2); TB('1,5 cm', x + w / 2 + 22, (wy + yb) / 2 + 4, DGREEN, 14, 'left'); LN(x - w / 2 - 14, yb - hh, x - w / 2 - 14, yb, ORANGE, 2); TB('3 cm', x - w / 2 - 22, yb - hh / 2 + 4, ORANGE, 14, 'right'); TB('V déplacé = 150 cm³  →  charge max 300 g', 230, 272, DRED, 14); ctx.globalAlpha = 1; } else TB('tirant d\'eau ?', 230, 272, GREY, 15);
    }),
    /* 7 Le glaçon qui fond */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), wy = 120;
      [[115, 0], [345, 1]].forEach(function (c) {
        var x = c[0]; ctx.fillStyle = 'rgba(120,180,235,.3)'; ctx.fillRect(x - 60, wy, 120, 120); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x - 60, 70); ctx.lineTo(x - 60, 240); ctx.lineTo(x + 60, 240); ctx.lineTo(x + 60, 70); ctx.stroke(); LN(x - 60, wy, x + 60, wy, BLUE, 2.4);
        if (c[1] === 0 || g < 1) { ctx.globalAlpha = c[1] === 0 ? 1 : 0; }
        if (c[1] === 0) { ctx.fillStyle = 'rgba(143,200,232,.75)'; ctx.strokeStyle = '#4a8db3'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x - 24, wy - 10, 48, 44, 4); ctx.fill(); ctx.stroke(); }
        ctx.globalAlpha = 1;
      });
      TB('glaçon flotte', 115, 40, BLUE_D, 15); TB('glaçon fondu', 345, 40, BLUE_D, 15);
      A(230, 160, 40, 0, GREY, '', 2.6); TB('fond', 230, 148, GREY, 13);
      LN(285, wy, 405, wy, RED, 1.6, [5, 4]);
      if (g > 0) { ctx.globalAlpha = g; TB('même niveau', 345, 264, DGREEN, 16); TB('V déplacé = V d\'eau de fonte', 115, 262, DGREEN, 13); ctx.globalAlpha = 1; } else TB('niveau ?', 345, 262, GREY, 16);
    }),
    /* 8 Ludion */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      [[115, 0], [345, 1]].forEach(function (c) {
        var x = c[0], sink = c[1] * 40 * g; ctx.fillStyle = 'rgba(120,180,235,.3)'; ctx.fillRect(x - 50, 70, 100, 180); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x - 50, 40); ctx.lineTo(x - 50, 250); ctx.lineTo(x + 50, 250); ctx.lineTo(x + 50, 40); ctx.stroke();
        var y = 100 + sink; ctx.fillStyle = '#fff'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - 10, y, 20, 54, 8); ctx.fill(); ctx.stroke();
        var ah = c[1] ? 24 : 30 * (g > 0 ? 1 : 1); ctx.fillStyle = 'rgba(200,225,245,.9)'; ctx.fillRect(x - 8, y + 2, 16, ah);
        TB(c[1] ? 'air 0,50 cm³' : 'air 0,62 cm³', x, 270, INK, 13);
      });
      TB('101,3 kPa : flotte', 115, 30, DGREEN, 14); TB('≈ 125,6 kPa : coule', 345, 30, DRED, 14);
      if (g > 0) { ctx.globalAlpha = g; A(345, 50, 0, 20, RED, '', 3); TB('on appuie', 335, 62, RED, 13, 'right'); TB('p·V = constante', 230, 160, DGREEN, 14); ctx.globalAlpha = 1; } else TB('p·V = cte ?', 230, 160, GREY, 14);
    }),
    /* 9 Portance */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), cx = 230, cy = 140;
      [-60, -42, -26].forEach(function (o) { ctx.strokeStyle = '#bcd3e8'; ctx.lineWidth = 1.4; ctx.beginPath(); for (var x = 20; x <= 440; x += 6) { var yy = cy + o - (24 + o * -.1) * Math.exp(-Math.pow((x - cx) / 70, 2)); x === 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); });
      [28, 46, 64].forEach(function (o) { ctx.strokeStyle = '#bcd3e8'; ctx.lineWidth = 1.4; ctx.beginPath(); for (var x = 20; x <= 440; x += 6) { var yy = cy + o + 8 * Math.exp(-Math.pow((x - cx) / 70, 2)); x === 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); });
      A(30, 200, 50, 0, BLUE, '', 3); TB('air', 55, 225, BLUE_D, 13);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(.14); ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.ellipse(0, 0, 90, 13, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      A(cx, cy, 0, -60, GREEN, '', 4); TB('portance', cx + 12, cy - 66, DGREEN, 14, 'left');
      if (g > 0) { ctx.globalAlpha = g; q_box(230, 258, 380, 36, DGREEN, '#e9f6f0', 'v × 2  →  portance × 4  (≈ v²)', 17); TB('décroche si l\'angle est trop grand', 330, 28, GREY, 13, 'center'); ctx.globalAlpha = 1; } else TB('v × 2 → ?', 230, 262, GREY, 17);
    })
  ]);
})();
