/* Physique 3e · chapitre 6 · Puissance, énergie électrique et sécurité (utilise les aides q_* de theo-01.js) */
(function () {
  function axes(ox, oy, w, h, xl, yl) {
    LN(ox - 4, oy, ox + w + 10, oy, AX, 1.6); LN(ox, oy + 4, ox, oy - h - 10, AX, 1.6);
    ctx.fillStyle = AX; ctx.beginPath(); ctx.moveTo(ox + w + 14, oy); ctx.lineTo(ox + w + 6, oy - 4); ctx.lineTo(ox + w + 6, oy + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox, oy - h - 14); ctx.lineTo(ox - 4, oy - h - 6); ctx.lineTo(ox + 4, oy - h - 6); ctx.fill();
    TB(xl, ox + w + 10, oy + 16, GREY, 13, 'right'); TB(yl, ox + 8, oy - h - 12, GREY, 13, 'left');
  }
  function tick(x, y, lab, ax) { if (ax === 'x') { LN(x, y, x, y + 4, GREY, 1); T(lab, x, y + 15, GREY, 11); } else { LN(x - 4, y, x, y, GREY, 1); T(lab, x - 7, y + 4, GREY, 11, 'right'); } }
  function plug(x, y) { ctx.fillStyle = '#e9ecef'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 16, y - 16, 32, 32, 6); ctx.fill(); ctx.stroke(); DOT(x - 6, y, 3.5, INK); DOT(x + 6, y, 3.5, INK); }

  SFA.theo("c06", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      // éclair
      ctx.fillStyle = YEL; ctx.beginPath(); ctx.moveTo(215, 20); ctx.lineTo(180, 100); ctx.lineTo(210, 100); ctx.lineTo(192, 165); ctx.lineTo(252, 80); ctx.lineTo(220, 80); ctx.lineTo(245, 20); ctx.closePath(); ctx.fill();
      TB('P = U · I', 95, 80, BLUE_D, 30); TB('E = P · t', 365, 80, ORANGE, 30);
      TB('watts', 95, 112, GREY, 15); TB('kWh', 365, 112, GREY, 15);
      TB('puissance, énergie, sécurité', 230, 215, INK, 20); TB('fusible · différentiel · terre', 230, 243, GREY, 14);
    }),
    anim: q_an(function (t) {
      var T = 600, ph = (t % T) / T, e = q_c(ph / .85, 0, 1), th = 1.5 * e;
      var ox = 80, oy = 250, w = 360, h = 190, kx = w / 2, ky = h / 2.5;
      axes(ox, oy, w, h, 't (h)', 'P (kW)'); [.5, 1, 1.5, 2].forEach(function (v) { tick(ox + v * kx * 1, oy, String(v).replace('.', ','), 'x'); });
      tick(ox, oy - 2 * ky, '2', 'y'); tick(ox, oy - 1 * ky, '1', 'y');
      LN(ox, oy - 2 * ky, ox + 2 * kx, oy - 2 * ky, BLUE, 2, [5, 4]);
      ctx.fillStyle = 'rgba(186,117,23,.28)'; ctx.fillRect(ox, oy - 2 * ky, th * kx, 2 * ky); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.strokeRect(ox, oy - 2 * ky, th * kx, 2 * ky);
      LN(ox + th * kx, oy, ox + th * kx, oy - 2 * ky, ORANGE, 3);
      TB('bouilloire : P = 2 kW', ox + 190, oy - 2 * ky - 10, BLUE_D, 14);
      TB('aire du rectangle = énergie', ox + 18, oy - ky + 5, DRED, 14, 'left');
      var tx = 500;
      TB('P = U · I', tx, 70, BLUE_D, 20, 'left'); TB('2 000 = 230 × 8,7', tx, 94, GREY, 13, 'left');
      TB('E = P · t', tx, 140, ORANGE, 20, 'left');
      TB(String((2).toFixed(1)).replace('.', ',') + ' kW × ' + th.toFixed(2).replace('.', ',') + ' h', tx, 166, INK, 15, 'left');
      q_box(tx + 80, 206, 160, 40, ORANGE, '#fdf1e0', (2 * th).toFixed(2).replace('.', ',') + ' kWh', 22);
      TB('0,30 € / kWh → ' + (2 * th * .3).toFixed(2).replace('.', ',') + ' €', tx, 250, DGREEN, 14, 'left');
    }),
    th:
      '<div class="tcard"><b class="h">La puissance électrique</b><p>La <b>puissance</b> P mesure l\'énergie transférée <b>par seconde</b>. Pour un appareil sous la tension U traversé par l\'intensité I : <b>P = U · I</b> (en watts, W ; 1 kW = 1 000 W).</p><ul><li>Sèche-cheveux : 230 V × 8 A = <b>1 840 W</b>.</li><li>Avec la loi d\'Ohm : P = R·I² = U² / R (pour un résistor).</li><li><b>Plaque signalétique :</b> « 230 V – 2 200 W » donne les valeurs normales : I = P / U = 2 200 / 230 ≈ <b>9,6 A</b> et R = U² / P = 230² / 2 200 ≈ <b>24 Ω</b>.</li></ul></div>' +
      '<div class="tcard"><b class="h">L\'énergie électrique et son coût</b><p><b>E = P · t</b>. Unités : le joule (J = W·s), le <b>wattheure</b> (Wh) et le <b>kilowattheure</b> (kWh), avec 1 kWh = 1 000 Wh = 3,6·10<sup>6</sup> J. Attention : le kWh est une unité d\'<b>énergie</b>, pas de puissance. On paie l\'énergie : coût = E (en kWh) × prix du kWh.</p><ul><li>Ampoule 60 W pendant 5 h : E = 300 Wh = 0,3 kWh ; à 0,30 €/kWh : <b>0,09 €</b>.</li><li>Bouilloire 2 000 W, 20 min par jour pendant 30 jours : 2 kW × (1/3 h) × 30 = <b>20 kWh</b>, soit 6,00 €.</li><li>LED 9 W au lieu de 60 W, 5 h par jour pendant 30 jours : on économise 51 W × 150 h = 7,65 kWh (≈ 2,30 €).</li></ul></div>' +
      '<div class="tcard"><b class="h">L\'effet Joule</b><p>Tout conducteur parcouru par un courant <b>chauffe</b> : la puissance dissipée en chaleur est <b>P = R · I²</b>. Elle est utile dans un grille-pain, nuisible dans un fil. <b>Doubler I multiplie la chaleur par 4</b> (I au carré).</p><p><b>Exemple :</b> une rallonge de 0,5 Ω parcourue par 16 A dissipe 0,5 × 16² = 128 W. En 10 min (600 s) : E = 76 800 J ≈ 0,021 kWh. Enroulée, la chaleur ne s\'évacue pas : pour 100 g de cuivre (385 J/kg/K), cela ferait théoriquement ΔT = 76 800 / (0,1 × 385) ≈ 2 000 °C. Il faut <b>dérouler</b> la rallonge.</p></div>' +
      '<div class="tcard"><b class="h">Protéger l\'installation et les personnes</b><ul><li><b>Fusible / disjoncteur :</b> coupent le circuit si l\'intensité dépasse la valeur permise (surcharge ou court-circuit). Un circuit de 16 A sous 230 V supporte au plus 230 × 16 = <b>3 680 W</b> : bouilloire (9,6 A) + four (10,9 A) font 20,5 A, c\'est trop.</li><li><b>Disjoncteur différentiel (30 mA) :</b> compare le courant qui entre et celui qui sort ; si la différence atteint 30 mA, du courant fuit (par exemple dans un corps humain) : il coupe aussitôt.</li><li><b>Prise de terre :</b> le fil vert-jaune relie les carcasses métalliques à la terre. En cas de défaut, le courant s\'écoule par ce fil plutôt que par la personne qui touche l\'appareil.</li></ul></div>' +
      '<div class="tcard"><b class="h">Méthode et pièges</b><ul><li>Convertir avant de calculer : W → kW (÷ 1 000), minutes → heures (÷ 60).</li><li>Appareils en même temps : on <b>additionne les puissances</b> (ou les intensités en dérivation) avant de comparer à la limite du disjoncteur.</li><li>Un appareil ne « consomme » pas de courant ni d\'électrons : il transforme de l\'énergie électrique en chaleur, lumière, mouvement…</li><li>1 000 W pendant 3 h : <b>3 kWh</b> (et pas 3 000 kW, ni 333 W).</li></ul></div>'
  });

  SFA.figs("c06", [
    /* 0 Calculer une puissance */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      ctx.fillStyle = '#e6f1fb'; ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(130, 75, 160, 62, 28); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(290, 85); ctx.lineTo(335, 70); ctx.lineTo(335, 142); ctx.lineTo(290, 127); ctx.closePath(); ctx.fillStyle = '#d3e6f8'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e6f1fb'; ctx.beginPath(); ctx.roundRect(175, 135, 34, 70, 8); ctx.fill(); ctx.stroke();
      for (var i = 0; i < 3; i++) { ctx.strokeStyle = ORA2; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(345, 85 + i * 22); ctx.bezierCurveTo(375, 75 + i * 22, 385, 95 + i * 22, 415, 85 + i * 22); ctx.stroke(); }
      LN(192, 205, 192, 240, INK, 2.4); LN(192, 240, 70, 240, INK, 2.4); plug(54, 240);
      TB('230 V', 100, 190, BLUE_D, 18); TB('8 A', 100, 215, ORANGE, 18);
      if (g > 0) { ctx.globalAlpha = g; q_box(230, 30, 320, 36, DGREEN, '#e6f6ee', 'P = U · I = 230 × 8 = 1 840 W', 18); ctx.globalAlpha = 1; } else TB('P = ?', 230, 40, GREY, 20);
    }),
    /* 1 Énergie d'une ampoule */
    q_fig(function (p) {
      var g = q_s(p, 0, .7);
      q_lampe(90, 90, 1, 30); TB('60 W', 90, 150, INK, 18);
      DOT(230, 90, 42, '#fff'); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(230, 90, 42, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(55,138,221,.25)'; ctx.beginPath(); ctx.moveTo(230, 90); ctx.arc(230, 90, 40, -PI / 2, -PI / 2 + 2 * PI * 5 / 12); ctx.closePath(); ctx.fill(); LN(230, 90, 230, 56, INK, 2.4); LN(230, 90, 230 + 28 * Math.sin(2 * PI * 5 / 12), 90 - 28 * Math.cos(2 * PI * 5 / 12), INK, 2.4);
      TB('5 h', 230, 150, INK, 18); TB('0,30 € / kWh', 380, 95, GREY, 15);
      if (g > 0) { ctx.globalAlpha = g; TB('E = P · t = 60 W × 5 h = 300 Wh = 0,3 kWh', 230, 205, DGREEN, 16); q_box(230, 247, 220, 34, DGREEN, '#e6f6ee', '0,3 × 0,30 = 0,09 €', 18); ctx.globalAlpha = 1; } else TB('E ?   coût ?', 230, 220, GREY, 18);
    }),
    /* 2 Quelle unité ? */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), t = [['Puissance', 'W'], ['Énergie', 'J · Wh · kWh'], ['Tension', 'V'], ['Intensité', 'A']];
      t.forEach(function (r, i) { var x = 115 + (i % 2) * 230, y = 65 + Math.floor(i / 2) * 75, hl = g > .3 && i === 1; q_box(x, y, 190, 54, hl ? GREEN : GREY, hl ? '#e6f6ee' : '#f3f6fa'); TB(r[0], x, y - 4, INK, 14); TB(r[1], x, y + 17, hl ? DGREEN : BLUE_D, 16); });
      TB('kWh = ?', 230, 235, GREY, 22);
      if (g > .3) { ctx.globalAlpha = g; TB('E = P · t  :  kW × h = kWh', 230, 235, DGREEN, 20); TB('c\'est une énergie', 230, 262, DGREEN, 15); ctx.globalAlpha = 1; }
    }),
    /* 3 Plaque signalétique */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      ctx.fillStyle = '#eef1f4'; ctx.strokeStyle = GREY; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(110, 25, 240, 80, 8); ctx.fill(); ctx.stroke();
      TB('BOUILLOIRE', 230, 52, GREY, 14); TB('230 V ~    2 200 W', 230, 88, INK, 22);
      if (g > 0) { ctx.globalAlpha = g; TB('I = P / U = 2 200 / 230 ≈ 9,6 A', 230, 160, DGREEN, 18); TB('R = U² / P = 230² / 2 200 ≈ 24 Ω', 230, 200, DGREEN, 18); TB('(ou R = U / I = 230 / 9,6)', 230, 232, GREY, 14); ctx.globalAlpha = 1; }
      else { TB('I ?', 160, 170, GREY, 22); TB('R ?', 300, 170, GREY, 22); }
    }),
    /* 4 Bouilloire et ampoules */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), rows = [['bouilloire', 20, ORANGE, '20 kWh · 6,00 €'], ['ampoule 60 W', 9, GREY, '9 kWh'], ['LED 9 W', 1.35, GREEN, '1,35 kWh']];
      rows.forEach(function (r, i) { var y = 60 + i * 62, w2 = 250 * r[1] / 20 * g; TB(r[0], 20, y + 5, INK, 14, 'left'); ctx.fillStyle = r[2] + '55'; ctx.fillRect(130, y - 16, Math.max(w2, 2), 32); ctx.strokeStyle = r[2]; ctx.lineWidth = 2; ctx.strokeRect(130, y - 16, Math.max(w2, 2), 32); if (g > .6) { ctx.globalAlpha = g; TB(r[3], 138 + w2, y + 5, dk(r[2]), 14, 'left'); ctx.globalAlpha = 1; } });
      TB('(a) kWh sur 30 jours', 230, 24, GREY, 13);
      if (g > .6) { ctx.globalAlpha = g; TB('(b) économie : 9 − 1,35 = 7,65 kWh ≈ 2,30 €', 230, 262, DGREEN, 16); ctx.globalAlpha = 1; } else TB('énergie sur 30 jours ?', 230, 262, GREY, 16);
    }),
    /* 5 Un radiateur de 1 000 W */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), ox = 70, oy = 215, w = 320, h = 150, kx = w / 4, ky = h / 1.5;
      axes(ox, oy, w, h, 't (h)', 'P (kW)'); [1, 2, 3].forEach(function (v) { tick(ox + v * kx, oy, String(v), 'x'); }); tick(ox, oy - ky, '1', 'y');
      ctx.fillStyle = 'rgba(186,117,23,' + .3 * g + ')'; ctx.fillRect(ox, oy - ky, 3 * kx * g, ky); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.strokeRect(ox, oy - ky, 3 * kx, ky);
      TB('1 000 W = 1 kW', ox + 1.5 * kx, oy - ky - 10, BLUE_D, 15);
      if (g > .4) { ctx.globalAlpha = g; TB('E = 1 kW × 3 h = 3 kWh', ox + 1.5 * kx, oy - ky / 2 + 6, DRED, 18); ctx.globalAlpha = 1; } else TB('E ?', ox + 1.5 * kx, oy - ky / 2 + 6, GREY, 20);
    }),
    /* 6 Trop sur un seul circuit */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), app = [['bouilloire', 2200, '9,6 A'], ['four', 2500, '10,9 A'], ['radiateur', 2000, '8,7 A']], bx = 110, kx = 300 / 5000;
      app.forEach(function (a, i) { var y = 60 + i * 50; TB(a[0], 20, y + 5, INK, 14, 'left'); ctx.fillStyle = '#cfe3f7'; ctx.fillRect(bx, y - 14, a[1] * kx, 28); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.strokeRect(bx, y - 14, a[1] * kx, 28); TB(a[1] + ' W', bx + 8, y + 5, INK, 13, 'left'); if (g > .3) { ctx.globalAlpha = g; TB(a[2], bx + a[1] * kx + 8, y + 5, ORANGE, 14, 'left'); ctx.globalAlpha = 1; } });
      var lx = bx + 3680 * kx; LN(lx, 30, lx, 200, RED, 3, [6, 4]); TB('16 A → 3 680 W max', lx, 218, DRED, 14);
      if (g > .5) { ctx.globalAlpha = g; TB('deux appareils : toujours > 3 680 W', 230, 252, DRED, 16); ctx.globalAlpha = 1; } else TB('lesquels en même temps ?', 230, 252, GREY, 16);
    }),
    /* 7 Doubler l'intensité */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), ox = 70, oy = 230, w = 300, h = 190, kx = w / 2.4, ky = h / 4.6;
      axes(ox, oy, w, h, 'I', 'P Joule'); ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var i = 0; i <= 240; i += 4) { var x = ox + i / 100 * kx, y = oy - Math.pow(i / 100, 2) * ky; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      var pts = [[1, 1, 'I', 'P'], [2, 4, '2I', '4P']];
      pts.forEach(function (q, k) { var x = ox + q[0] * kx, y = oy - q[1] * ky; LN(x, oy, x, y, '#b9bdc4', 1.3, [4, 4]); LN(ox, y, x, y, '#b9bdc4', 1.3, [4, 4]); DOT(x, y, 6, k ? RED : ORANGE); TB(q[2], x, oy + 17, INK, 14); if (k === 0 || g > .2) TB(q[3], ox - 14, y + 5, k ? DRED : INK, 14, 'right'); });
      TB('P = R · I²', 250, 60, INK, 18, 'left');
      if (g > .3) { ctx.globalAlpha = g; TB('I ×2  →  chaleur ×4', 330, 130, DRED, 19, 'center'); ctx.globalAlpha = 1; } else TB('chaleur ?', 330, 130, GREY, 19);
    }),
    /* 8 La rallonge enroulée */
    q_fig(function (p) {
      var g = q_s(p, 0, 1);
      for (var r = 12; r <= 50; r += 7) { ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(70, 90, r, 0, 7); ctx.stroke(); }
      for (var j = 0; j < 4; j++) { ctx.strokeStyle = RED; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40 + j * 20, 36); ctx.bezierCurveTo(32 + j * 20, 26, 48 + j * 20, 18, 40 + j * 20, 8); ctx.stroke(); }
      TB('0,5 Ω · 16 A · 10 min', 230, 40, INK, 15); TB('chaleur piégée', 70, 160, DRED, 14);
      LN(170, 90, 430, 90, ORANGE, 4); TB('déroulée : la chaleur s\'évacue', 300, 120, DGREEN, 14);
      var L = [['P = R·I² = 0,5 × 16² = 128 W', .05], ['E = 128 × 600 = 76,8 kJ ≈ 0,021 kWh', .3], ['ΔT = E / (m·c) ≈ 2 000 °C (théorique)', .55]];
      L.forEach(function (l, i) { var a = q_s(p, l[1], l[1] + .25); if (a > 0) { ctx.globalAlpha = a; TB(l[0], 230, 180 + i * 30, i === 2 ? DRED : INK, 16); ctx.globalAlpha = 1; } });
      if (p > .8) { ctx.globalAlpha = q_s(p, .8, 1); TB('dérouler la rallonge !', 230, 272, DGREEN, 17); ctx.globalAlpha = 1; } else if (p <= .05) TB('P ?  E ?  ΔT ?', 230, 210, GREY, 17);
    }),
    /* 9 Le différentiel */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      q_box(70, 95, 100, 70, INK, '#eef1f4'); TB('différentiel', 70, 88, INK, 13); TB('30 mA', 70, 110, DRED, 15);
      LN(120, 80, 300, 80, INK, 2.6); LN(120, 112, 300, 112, INK, 2.6); q_box(330, 96, 60, 56, BLUE, '#eef4fb', 'appareil', 12);
      LN(300, 80, 300, 80, INK, 2); LN(300, 80, 300, 90, INK, 2.6); LN(300, 112, 300, 106, INK, 2.6);
      A(160, 66, 40, 0, ORA2, '', 3); TB('I entrant', 180, 50, ORA2, 13); A(260, 128, -40, 0, ORA2, '', 3); TB('I sortant', 240, 150, ORA2, 13);
      if (g > 0) {
        ctx.globalAlpha = g; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(330, 125); ctx.lineTo(330, 175); ctx.stroke(); ctx.setLineDash([]); pers(360, 235, 70, ORA2, -1, '', 'center'); LN(330, 175, 352, 190, RED, 3); floor(300, 420, 236); A(330, 150, 0, 26, RED, '', 3); TB('fuite 30 mA', 400, 170, DRED, 14);
        q_box(230, 262, 400, 30, DRED, '#fdeaea', 'I entrant − I sortant ≥ 30 mA  →  il coupe', 14); ctx.globalAlpha = 1;
      } else { TB('quand déclenche-t-il ?', 230, 235, GREY, 17); }
    })
  ]);
})();
