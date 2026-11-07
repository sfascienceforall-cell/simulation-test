/* Biologie 5e · chapitre 1 : neurone et influx nerveux — théorie animée et devantures.
   Ce fichier définit aussi BH (petites aides de dessin partagées par les theo-NN.js de ce cours). */
window.BH = (function () {
  var B = {};
  B.cl = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  B.ph = function (p, a, b) { return B.cl((p - a) / (b - a), 0, 1); };
  B.fx = function (v, d) { return (d === undefined ? String(v) : v.toFixed(d)).replace('.', ','); };
  B.it = function (pts, x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) if (x <= pts[i][0]) { var a = pts[i - 1], b = pts[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
    return pts[pts.length - 1][1];
  };
  B.al = function (a) { ctx.globalAlpha = B.cl(a, 0, 1); };
  B.a1 = function () { ctx.globalAlpha = 1; };
  B.rr = function (x, y, w, h, fill, stroke, r, lw) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r === undefined ? 6 : r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.6; ctx.stroke(); }
  };
  B.el = function (x, y, rx, ry, fill, stroke, lw, rot) {
    ctx.beginPath(); ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), rot || 0, 0, 7);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.6; ctx.stroke(); }
  };
  B.ci = function (x, y, r, fill, stroke, lw) { B.el(x, y, r, r, fill, stroke, lw); };
  B.axes = function (x0, y0, w, h, xl, yl) {
    LN(x0, y0, x0 + w, y0, INK, 1.6); LN(x0, y0, x0, y0 - h, INK, 1.6);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(x0 + w + 6, y0); ctx.lineTo(x0 + w - 3, y0 - 4); ctx.lineTo(x0 + w - 3, y0 + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x0, y0 - h - 6); ctx.lineTo(x0 - 4, y0 - h + 3); ctx.lineTo(x0 + 4, y0 - h + 3); ctx.fill();
    if (xl) TB(xl, x0 + w, y0 + 16, GREY, 12, 'right'); if (yl) TB(yl, x0 + 8, y0 - h - 8, GREY, 12, 'left');
  };
  B.poly = function (pts, col, w, dash) {
    ctx.strokeStyle = col; ctx.lineWidth = w || 2.4; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); pts.forEach(function (q, i) { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.setLineDash([]);
  };
  B.fn = function (f, xa, xb, mx, my, col, w, n) {
    var pts = [], N = n || 120; for (var i = 0; i <= N; i++) { var x = xa + (xb - xa) * i / N; pts.push([mx(x), my(f(x))]); } B.poly(pts, col, w);
  };
  B.note = function (txt, x, y, col, size, a) { B.al(a === undefined ? 1 : a); tag(txt, x, y, col, size || 13); B.a1(); };
  B.sol = function (p, txt, x, y, col, size) { if (p > 0) { B.al(B.ph(p, 0.15, 0.6)); tag(txt, x, y, col || DGREEN, size || 14); B.a1(); } };
  /* potentiel d'action schématique : t en ms depuis le début du stimulus, V en mV */
  B.ap = function (t) { return B.it([[-9, -70], [0, -70], [0.3, -55], [0.8, 40], [1.6, -60], [2.2, -80], [3.5, -70], [99, -70]], t); };
  B.neuron = function (x0, y0, L, a) {
    /* corps cellulaire à gauche, dendrites, axone gainé de myéline, terminaisons à droite */
    var r = L * 0.07, xs = x0 + r * 2.6, xe = x0 + L;
    [[-1, -1], [-1.3, -0.2], [-1, 0.9], [-0.2, -1.4], [-0.3, 1.4]].forEach(function (d) {
      var ex = xs + d[0] * r * 1.6, ey = y0 + d[1] * r * 1.7;
      LN(xs, y0, ex, ey, BLUE_D, 2.4); LN(ex, ey, ex + d[0] * r * 0.5, ey + (d[1] > 0 ? 1 : -1) * r * 0.5, BLUE_D, 1.8);
      LN(ex, ey, ex - (d[1] > 0 ? 0.6 : -0.6) * r * 0.6 + d[0] * r * 0.2, ey + (d[1] > 0 ? 1 : -1) * r * 0.2, BLUE_D, 1.8);
    });
    LN(xs + r, y0, xe - L * 0.08, y0, BLUE_D, 3);
    var n = 5, a0 = xs + r * 2.2, a1 = xe - L * 0.12, sw = (a1 - a0) / n;
    for (var i = 0; i < n; i++) B.rr(a0 + i * sw + 3, y0 - 7, sw - 8, 14, '#fff3c9', ORANGE, 6, 1.6);
    B.ci(xs, y0, r, '#e6f1fb', BLUE_D, 2.6); B.ci(xs, y0, r * 0.38, BLUE, null);
    [[-1, -1.1], [0, 1.2], [1, -0.9], [1.4, 1]].forEach(function (d) {
      var bx = xe - L * 0.08, by = y0; LN(bx, by, xe + d[0] * 2, y0 + d[1] * r * 1.1, BLUE_D, 2); DOT(xe + d[0] * 2, y0 + d[1] * r * 1.1, 4, BLUE_D);
    });
    return { xs: xs, r: r, a0: a0, a1: a1, sw: sw, xe: xe };
  };
  return B;
})();

(function () {
  var C = 'c01';

  SFA.theo(C, {
    icon: function () {
      var x0 = W * .12, x1 = W * .88, yb = H * .62, yt = H * .22;
      var mx = function (t) { return x0 + (t + 1) / 6 * (x1 - x0); }, my = function (v) { return yb - (v + 80) / 125 * (yb - yt); };
      LN(x0, my(-55), x1, my(-55), GREY, 1.4, [5, 4]);
      BH.fn(BH.ap, -1, 5, mx, my, RED, 3.4);
      TB('+40 mV', mx(1.2), yt - 6, DRED, 14, 'left'); TB('−70 mV', x0, my(-70) + 18, BLUE_D, 13, 'left');
      TB('potentiel d’action', W * .5, H * .86, BLUE_D, 22);
    },
    anim: function (t) {
      var u = (t % 360) / 360, ax0 = W * .08, ax1 = W * .92, ay = H * .29, px = ax0 + (ax1 - ax0) * u;
      TB('Un potentiel d’action se propage le long de l’axone', W * .5, 16, BLUE_D, 14);
      BH.rr(ax0, ay - 12, ax1 - ax0, 24, '#eef4fb', BLUE_D, 12, 2);
      var g = ctx.createLinearGradient(px - 70, 0, px + 40, 0); g.addColorStop(0, 'rgba(226,75,74,0)'); g.addColorStop(.55, 'rgba(226,75,74,.85)'); g.addColorStop(1, 'rgba(226,75,74,0)');
      ctx.save(); ctx.beginPath(); ctx.roundRect(ax0, ay - 12, ax1 - ax0, 24, 12); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(px - 70, ay - 12, 110, 24); ctx.restore();
      TB('+', px - 6, ay + 5, '#fff', 16); TB('− − −', px + 52, ay + 5, BLUE_D, 13); 
      var lx = BH.cl(px, W * .16, W * .84); arrow(lx - 14, ay - 30, 0, 14, ORANGE, '', 2.4); TB('entrée de Na⁺', lx - 14, ay - 34, ORANGE, 12);
      arrow(lx - 52, ay + 34, 0, -14, DGREEN, '', 2.2); TB('sortie de K⁺', lx - 52, ay + 48, DGREEN, 12);
      /* courbe V(t) */
      var gx = W * .1, gw = W * .8, gb = H * .9, gt = H * .58;
      var mx = function (tm) { return gx + tm / 10 * gw; }, my = function (v) { return gb - (v + 85) / 130 * (gb - gt); };
      BH.axes(gx, gb, gw + 6, gb - gt + 14, 't (ms)', 'V (mV)');
      LN(gx, my(-55), gx + gw, my(-55), GREY, 1.3, [5, 4]); TB('seuil −55', gx + gw, my(-55) - 5, GREY, 12, 'right');
      LN(gx, my(-70), gx + gw, my(-70), AX, 1.2, [3, 4]); TB('repos −70', gx + gw, my(-70) + 14, GREY, 12, 'right');
      var tm = u * 10, shift = 2;
      BH.fn(function (x) { return BH.ap(x - shift); }, 0, 10, mx, my, '#d7dde5', 2.2);
      BH.fn(function (x) { return BH.ap(x - shift); }, 0, tm, mx, my, RED, 3.2, 80);
      var v = BH.ap(tm - shift); DOT(mx(tm), my(v), 6, RED); LN(mx(tm), my(v), mx(tm), gb, RED, 1, [3, 3]);
      var ph = tm < shift ? 'repos' : tm < shift + .8 ? 'dépolarisation (Na⁺ entre)' : tm < shift + 1.7 ? 'repolarisation (K⁺ sort)' : tm < shift + 3.3 ? 'hyperpolarisation' : 'retour au repos';
      TB(ph, gx + 12, gt - 4, tm >= shift && tm < shift + 1.7 ? DRED : BLUE_D, 13, 'left');
      var pt = gx + gw * (shift + .3) / 10; TB(Math.round(v) + ' mV', W * .5, gt + 4, INK, 13);
    },
    th:
      '<div class="tcard"><b class="h">Le neurone et le sens de l’influx</b><p>Un neurone comprend des <b>dendrites</b> (elles reçoivent les messages), un <b>corps cellulaire</b> (il contient le noyau et additionne les messages reçus), un <b>axone</b> (il conduit le message) et des <b>terminaisons axonales</b> (elles libèrent un neurotransmetteur). Certains axones sont entourés d’une <b>gaine de myéline</b>, isolante, interrompue par les <b>nœuds de Ranvier</b>. L’influx va toujours des dendrites vers les terminaisons.</p></div>' +
      '<div class="tcard"><b class="h">Potentiel de repos et potentiel d’action</b><p>Au repos, l’intérieur de l’axone est négatif par rapport à l’extérieur : <b>V ≈ −70 mV</b> (la pompe Na⁺/K⁺ maintient beaucoup de Na⁺ dehors et de K⁺ dedans). Si une stimulation dépolarise la membrane jusqu’au <b>seuil (≈ −55 mV)</b>, des canaux Na⁺ s’ouvrent : le Na⁺ entre et V monte jusqu’à ≈ <b>+40 mV</b> (dépolarisation). Puis les canaux Na⁺ se ferment et des canaux K⁺ s’ouvrent : le K⁺ sort et V redescend (repolarisation), avec un bref dépassement sous −70 mV (hyperpolarisation).</p><p>Amplitude du potentiel d’action (PA) : 40 − (−70) = <b>110 mV</b>.</p></div>' +
      '<div class="tcard"><b class="h">Tout ou rien, fréquence et période réfractaire</b><p>Sous le seuil : <b>aucun PA</b>. Au-dessus : un PA <b>toujours de même amplitude</b>, quelle que soit l’intensité du stimulus (loi du tout-ou-rien). L’intensité est codée par la <b>fréquence</b> des PA.</p><p>Après un PA, les canaux Na⁺ sont inactivés : c’est la <b>période réfractaire absolue</b> (≈ 1 à 2 ms), pendant laquelle aucun nouveau PA n’est possible. Elle limite la fréquence : <b>f<sub>max</sub> = 1 / durée de la période réfractaire</b> (2 ms → 500 Hz) et assure que l’influx ne revient pas en arrière.</p></div>' +
      '<div class="tcard"><b class="h">Vitesse de conduction</b><p>Fibre <b>nue</b> : conduction continue, lente (≈ 1 m/s pour les plus fines). Fibre <b>myélinisée</b> : conduction <b>saltatoire</b>, le PA saute de nœud en nœud (les ions n’entrent qu’aux nœuds) : jusqu’à 100 m/s, plus de dix fois plus vite. Un trajet se calcule par <b>t = d / v</b>. La perte de myéline (sclérose en plaques) ralentit ou bloque l’influx.</p><p><b>Exemple :</b> 1,2 m à 48 m/s → t = 1,2 / 48 = 0,025 s = 25 ms ; à 3,1 m/s → 0,39 s.</p></div>' +
      '<div class="tcard"><b class="h">Système nerveux et pièges</b><p><b>Système nerveux central</b> : encéphale + moelle épinière. <b>Périphérique</b> : nerfs (fibres sensitives vers le centre, fibres motrices vers les muscles et glandes). <b>Pièges :</b> un stimulus plus fort ne donne pas un PA plus grand ; le PA n’est pas un courant d’électrons dans un fil mais un déplacement d’ions à travers la membrane ; sous le seuil, la réponse locale s’éteint.</p></div>'
  });

  /* --- petits dessins réutilisés --- */
  function spk(x, y0, h, col, w) { BH.poly([[x - 3, y0], [x, y0 - h], [x + 3, y0]], col, w || 2.2); }
  function volt(O, w, h, vmin, vmax) { return function (v) { return O.y - (v - vmin) / (vmax - vmin) * h; }; }

  SFA.figs(C, [
    /* 1 rôle des parties */
    function (p) {
      var n = BH.neuron(W * .04, H * .54, W * .9);
      TB('Dendrites', n.xs - 20, H * .2, BLUE_D, 13, 'center'); TB('Corps cellulaire', n.xs - 30, H * .92, BLUE_D, 13, 'left');
      TB('Gaine de myéline', (n.a0 + n.a1) / 2, H * .38, ORANGE, 13); TB('Axone', (n.a0 + n.a1) / 2, H * .7, BLUE_D, 13);
      TB('Terminaisons', n.xe + 4, H * .27, BLUE_D, 13, 'right');
      arrow(W * .25, H * .1, W * .5, 0, GREY, '', 2); TB('sens de l’influx', W * .5, H * .06 + 2, GREY, 12);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .4)); TB('reçoivent', n.xs - 20, H * .26, DGREEN, 12); TB('intègre', n.xs - 30, H * .98, DGREEN, 12, 'left');
        BH.al(BH.ph(p, .3, .7)); TB('accélère l’influx', (n.a0 + n.a1) / 2, H * .44, DGREEN, 12); TB('conduit le PA', (n.a0 + n.a1) / 2, H * .76, DGREEN, 12);
        BH.al(BH.ph(p, .6, 1)); TB('libèrent le neurotransmetteur', n.xe + 4, H * .8, DGREEN, 12, 'right'); BH.a1();
      }
    },
    /* 2 atteindre le seuil */
    function (p) {
      var O = { x: W * .16, y: H * .88 }, h = H * .72, my = volt(O, 0, h, -80, 50);
      BH.axes(O.x, O.y, W * .76, h + 8, null, 'V (mV)');
      [[-70, 'repos −70', BLUE_D], [-55, 'seuil −55', GREY]].forEach(function (a) { LN(O.x, my(a[0]), O.x + W * .72, my(a[0]), a[2], 1.5, [5, 4]); TB(a[1], O.x - 6, my(a[0]) + 4, a[2], 12, 'right'); });
      var xa = W * .33, xb = W * .62;
      arrow(xa, my(-70), 0, my(-60) - my(-70), ORANGE, '', 3); TB('+10 mV', xa + 8, my(-65) + 4, ORANGE, 13, 'left');
      arrow(xb, my(-70), 0, my(-50) - my(-70), RED, '', 3); TB('+20 mV', xb - 8, my(-60) + 4, DRED, 13, 'right');
      DOT(xa, my(-60), 5, ORANGE); DOT(xb, my(-50), 5, RED);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .4)); TB('−60 mV : sous le seuil', xa + 6, my(-60) - 30, ORANGE, 13); TB('pas de PA', xa + 6, my(-60) - 14, ORANGE, 12);
        BH.al(BH.ph(p, .4, .9)); BH.fn(function (x) { return BH.ap(x * 1.6); }, 0, 4, function (x) { return xb + 10 + x * 24; }, my, RED, 3); TB('−50 mV : PA !', xb + 40, my(-50) - 40, DRED, 13); BH.a1();
      }
    },
    /* 3 tout ou rien */
    function (p) {
      var cols = [[W * .06, 'stimulus au seuil', 1], [W * .54, 'stimulus ×4', 4]];
      cols.forEach(function (c, k) {
        var x0 = c[0], w = W * .4, O = { x: x0 + 8, y: H * .85 }, my = volt(O, 0, H * .5, -80, 50);
        TB(c[1], x0 + w / 2, H * .1, BLUE_D, 14);
        B_bar(x0 + w * .2, H * .2, w * .6 * c[2] / 4, 10, k ? RED : ORANGE);
        BH.axes(O.x, O.y, w - 6, H * .58, null, null); LN(O.x, my(-55), O.x + w - 10, my(-55), GREY, 1.2, [4, 4]);
        BH.fn(function (x) { return BH.ap(x * 1.3); }, 0, 4, function (x) { return O.x + 20 + x * (w - 60) / 4 / 1.2; }, my, k ? RED : ORANGE, 3);
        if (p > 0) { BH.al(BH.ph(p, 0, .5)); LN(O.x + 14, my(40), O.x + w - 8, my(40), DGREEN, 1.2, [3, 3]); TB('+40 mV', O.x + w - 8, my(40) - 5, DGREEN, 12, 'right'); BH.a1(); }
      });
      function B_bar(x, y, w, h, c) { BH.rr(x, y, w, h, c, null, 3); }
      if (p > 0) { BH.al(BH.ph(p, .4, 1)); tag('même amplitude : 110 mV', W * .5, H * .96, DGREEN, 14); BH.a1(); }
    },
    /* 4 vitesse et durée */
    function (p) {
      var x0 = W * .08, x1 = W * .92, tau = p * 0.39, f1 = Math.min(1, tau / 0.025), f2 = Math.min(1, tau / 0.386);
      [[H * .3, 'fibre myélinisée : 48 m/s', ORANGE, f1, '25 ms'], [H * .68, 'fibre nue : ≈ 3,1 m/s', BLUE_D, f2, '≈ 0,39 s']].forEach(function (r, k) {
        TB(r[1], x0, r[0] - 30, r[2], 14, 'left');
        BH.rr(x0, r[0] - 8, x1 - x0, 16, k ? '#eef4fb' : '#fff3c9', r[2], 8, 2);
        if (!k) for (var i = 0; i < 8; i++) BH.rr(x0 + 8 + i * (x1 - x0 - 16) / 8, r[0] - 8, (x1 - x0 - 16) / 8 - 6, 16, null, ORANGE, 6, 1.4);
        DOT(x0 + (x1 - x0) * r[3], r[0], 9, RED);
        if (r[3] >= 1) TB(r[4], x1, r[0] + 32, DRED, 16, 'right');
      });
      TB('0', x0, H * .9, GREY, 12); TB('1,2 m', x1, H * .9, GREY, 12, 'right'); arrow(x0 + 16, H * .88, x1 - x0 - 50, 0, GREY, '', 1.6);
      if (p > 0) BH.sol(p, 't = d / v   (≈ 15 fois plus rapide)', W * .5, H * .96, DGREEN, 13);
    },
    /* 5 fréquence maximale */
    function (p) {
      var x0 = W * .1, w = W * .84, tmax = 20;
      [[H * .34, 2, 500, 'axone A : réfractaire 2 ms', RED], [H * .76, 5, 200, 'axone B : réfractaire 5 ms', BLUE]].forEach(function (r) {
        TB(r[3], x0, r[0] - 42, r[4] === RED ? DRED : BLUE_D, 13, 'left'); LN(x0, r[0] + 6, x0 + w, r[0] + 6, AX, 1.5);
        for (var s = 0; s * r[1] < tmax - .5; s++) {
          var x = x0 + w * (s * r[1] + .5) / tmax; BH.al(1); ctx.fillStyle = 'rgba(154,160,166,.25)'; ctx.fillRect(x, r[0] - 34, w * r[1] / tmax, 40); spk(x, r[0] + 6, 40, r[4], 3);
        }
        if (p > 0) { BH.al(BH.ph(p, .1, .7)); TB(r[2] + ' Hz', x0 + w, r[0] - 42, r[4] === RED ? DRED : BLUE_D, 16, 'right'); BH.a1(); }
      });
      [0, 5, 10, 15, 20].forEach(function (v) { TB(v, x0 + w * v / tmax, H * .94, GREY, 11); }); TB('t (ms)', x0 + w, H * .995 - 3, GREY, 11, 'right');
      if (p > 0) BH.sol(p, 'f max = 1 / durée', W * .5, H * .5 + 2, DGREEN, 13);
    },
    /* 6 enregistrements */
    function (p) {
      var rows = [[12, 0], [20, 3], [35, 10]], x0 = W * .24, w = W * .7;
      rows.forEach(function (r, k) {
        var y = H * (.27 + k * .27);
        TB(r[0] + ' mV', W * .02, y - 4, BLUE_D, 14, 'left'); LN(x0, y + 8, x0 + w, y + 8, AX, 1.3);
        BH.rr(x0 + w * .08, y + 12, w * .84, 5, '#e3e7ed', null, 2); BH.rr(x0 + w * .08, y + 12, w * .84 * r[0] / 35, 5, ORANGE, null, 2);
        if (p > 0) { var n = r[1]; BH.al(BH.ph(p, k * .22, k * .22 + .4)); for (var i = 0; i < n; i++) spk(x0 + w * (.1 + .8 * (i + .5) / Math.max(n, 1)), y + 8, 36, RED, 2.6); TB(n + ' PA', x0 + w + 4, y - 4, DRED, 13, 'right'); BH.a1(); }
      });
      TB('seuil : +15 mV', x0 + w * .08 + w * .84 * 15 / 35, H * .1, GREY, 12);
      LN(x0 + w * .08 + w * .84 * 15 / 35, H * .13, x0 + w * .08 + w * .84 * 15 / 35, H * .92, GREY, 1.3, [4, 4]);
    },
    /* 7 double douleur */
    function (p) {
      var yb = H * .86, yt = H * .22;
      var tau = p * 1.6, fA = Math.min(1, tau / 0.08), fB = Math.min(1, tau / 1.6);
      LN(W * .3, yb, W * .3, yt, AX, 14); LN(W * .7, yb, W * .7, yt, AX, 14);
      BH.rr(W * .26, yb - 4, W * .08, 14, '#eef4fb', BLUE_D, 4, 1.6); TB('orteil', W * .3, H * .97, BLUE_D, 12);
      BH.ci(W * .7, yt - 6, 18, '#fdece4', ORA2, 2); TB('encéphale', W * .7, yt - 32, DRED, 13);
      LN(W * .3, yb, W * .3, yt + 20, ORANGE, 4); LN(W * .3, yb, W * .3, yb - (yb - yt - 20) * fA, DRED, 6);
      DOT(W * .3, yb - (yb - yt - 20) * fA, 9, RED); DOT(W * .7, yb - (yb - yt - 20) * fB, 9, RED);
      TB('fibre myélinisée · 20 m/s', W * .3, yt - 32, ORANGE, 13); TB('fibre nue', W * .7 + 26, H * .5, BLUE_D, 13, 'left'); TB('1 m/s', W * .7 + 26, H * .5 + 16, BLUE_D, 13, 'left');
      TB('1,6 m', W * .5, H * .5, GREY, 14); arrow(W * .46, H * .56, 0, H * .22, GREY, '', 1.6);
      if (fA >= 1) TB('80 ms', W * .3 + 20, H * .3, DRED, 15, 'left'); if (fB >= 1) TB('1,6 s', W * .7 - 20, H * .3, DRED, 15, 'right');
      if (p > .9) BH.sol(p, 'écart ≈ 1,5 s', W * .5, H * .93, DGREEN, 14);
    },
    /* 8 fibre démyélinisée */
    function (p) {
      var x0 = W * .06, x1 = W * .94, xm = x0 + (x1 - x0) * .7, y = H * .3;
      BH.rr(x0, y - 8, xm - x0, 16, '#fff3c9', ORANGE, 8, 2); for (var i = 0; i < 6; i++) BH.rr(x0 + 8 + i * (xm - x0 - 16) / 6, y - 8, (xm - x0 - 16) / 6 - 6, 16, null, ORANGE, 6, 1.4);
      BH.rr(xm, y - 5, x1 - xm, 10, '#fdeaea', RED, 5, 2);
      TB('saine : 0,70 m à 60 m/s', (x0 + xm) / 2, y - 22, ORANGE, 13); TB('atteinte : 0,30 m à 12 m/s', (xm + x1) / 2, y + 30, DRED, 13);
      /* barres de temps */
      var bx = W * .08, bw = W * .84, sc = bw / 40, by = H * .62;
      TB('temps de trajet', bx, by - 16, GREY, 12, 'left');
      BH.rr(bx, by, 16.7 * sc, 22, '#e6f1fb', BLUE_D, 4, 1.8); TB('avant 16,7 ms', bx + 8, by + 16, BLUE_D, 12, 'left');
      if (p > 0) {
        var q = BH.ph(p, 0, .7); BH.al(q > 0 ? 1 : 0);
        BH.rr(bx, by + 34, 11.7 * sc * q, 22, '#fff3c9', ORANGE, 4, 1.8); BH.rr(bx + 11.7 * sc, by + 34, 25 * sc * q, 22, '#fdeaea', RED, 4, 1.8);
        if (q > .95) { TB('11,7', bx + 6 * sc, by + 50, ORANGE, 12); TB('25 ms', bx + 24 * sc, by + 50, DRED, 12); BH.sol(p, 'total ≈ 36,7 ms  →  ≈ 2,2 fois plus lent', W * .5, H * .95, DGREEN, 14); }
        BH.a1();
      }
    },
    /* 9 deux stimuli rapprochés */
    function (p) {
      [[W * .05, 1, 'écart 1 ms'], [W * .53, 8, 'écart 8 ms']].forEach(function (c, k) {
        var x0 = c[0], w = W * .42, O = { x: x0 + 6, y: H * .85 }, my = volt(O, 0, H * .5, -80, 50), sx = function (t) { return O.x + 14 + t * (w - 30) / 14; };
        TB(c[2], x0 + w / 2, H * .1, BLUE_D, 14); BH.axes(O.x, O.y, w - 4, H * .62, null, null); LN(O.x, my(-55), O.x + w - 8, my(-55), GREY, 1.2, [4, 4]);
        var s1 = 1, s2 = 1 + c[1]; BH.fn(function (x) { return BH.ap((x - s1) * 1.6); }, 0, 14, sx, my, RED, 3, 200);
        [s1, s2].forEach(function (s) { arrow(sx(s), H * .24, 0, 22, ORANGE, '', 2.6); }); TB('chocs', sx(s1), H * .2, ORANGE, 11, 'right');
        if (k) { var show = p > 0 ? BH.ph(p, 0, .5) : 0; BH.al(show); BH.fn(function (x) { return BH.ap((x - s2) * 1.6); }, s2 - 1, 14, sx, my, DRED, 3.4, 100); BH.a1(); }
        if (p > 0) {
          BH.al(BH.ph(p, 0, .5)); if (!k) { ctx.fillStyle = 'rgba(154,160,166,.3)'; ctx.fillRect(sx(1), H * .3, sx(3.4) - sx(1), H * .55); TB('réfractaire', sx(2.2), H * .5, GREY, 12); TB('1 seul PA', x0 + w / 2, H * .96, DRED, 14); }
          else TB('2 PA', x0 + w / 2, H * .96, DGREEN, 14); BH.a1();
        }
      });
    },
    /* 10 myéline, nœuds de Ranvier */
    function (p) {
      var x0 = W * .06, x1 = W * .94, y = H * .42, n = 6, sw = (x1 - x0) / n;
      LN(x0, y, x1, y, BLUE_D, 5);
      for (var i = 0; i < n; i++) BH.rr(x0 + i * sw + 10, y - 16, sw - 20, 32, '#fff3c9', ORANGE, 12, 2);
      for (i = 1; i < n; i++) { DOT(x0 + i * sw, y, 4, RED); }
      TB('nœud de Ranvier', x0 + 2 * sw, y + 48, DRED, 13); LN(x0 + 2 * sw, y + 20, x0 + 2 * sw, y + 33, DRED, 1.3);
      TB('internœud 1,2 mm', x0 + 3.5 * sw, y - 32, ORANGE, 13);
      var k = Math.min(n - 2, Math.floor(p * 5.5)), fr = (p * 5.5) % 1;
      for (i = 1; i < n - 1; i++) { arrow(x0 + i * sw + 8, y - 54, sw - 20, 0, GREY, '', 1.4); }
      if (p > 0) { var cx = x0 + (k + 1) * sw; ctx.save(); ctx.beginPath(); ctx.arc(cx, y, 9, 0, 7); ctx.fillStyle = 'rgba(226,75,74,.45)'; ctx.fill(); ctx.restore(); TB('Na⁺', cx, y - 66, RED, 12); }
      if (p > 0.1) { BH.sol(p, '1 000 nœuds · 20 µs par internœud · 1,2 m en 20 ms', W * .5, H * .78, DGREEN, 13); BH.al(BH.ph(p, .5, 1)); tag('fibre nue : ≈ 0,35 s, soit ≈ 17 fois plus lent', W * .5, H * .92, DRED, 13); BH.a1(); }
    },
    /* 11 anesthésique local */
    function (p) {
      var x0 = W * .06, x1 = W * .94, y = H * .45, xb = W * .55;
      BH.rr(x0, y - 14, x1 - x0, 28, '#eef4fb', BLUE_D, 14, 2);
      for (var i = 0; i < 4; i++) { var cx = xb - 24 + i * 16; BH.rr(cx - 4, y - 20, 8, 12, '#fff', GREEN, 2, 1.6); }
      TB('canaux Na⁺', xb - 5, y - 34, DGREEN, 12);
      /* molécule d'anesthésique */
      B2(xb - 5, y + 40);
      function B2(x, yy) { BH.ci(x, yy, 14, '#f3dff7', VIOLET, 2); BH.ci(x + 14, yy - 7, 9, '#f3dff7', VIOLET, 2); TB('lidocaïne', x - 2, yy + 32, VIOLET, 12); LN(x, yy - 14, x, y + 14, VIOLET, 1.6, [3, 3]); }
      var f = BH.ph(p, 0, .9), px = x0 + 20 + (xb - 40 - x0) * (p > 0 ? 1 : .25) * (p > 0 ? f * .98 + .02 : 1);
      var amp = p > 0 ? 1 - BH.ph(p, .45, .75) : 1;
      var g = ctx.createRadialGradient(px, y, 2, px, y, 38); g.addColorStop(0, 'rgba(226,75,74,' + .85 * Math.max(amp, 0) + ')'); g.addColorStop(1, 'rgba(226,75,74,0)'); ctx.fillStyle = g; ctx.fillRect(px - 40, y - 14, 80, 28);
      if (amp > .3) TB('PA', px, y + 5, '#fff', 14); TB('PA', x0 + 24, y - 34, DRED, 13, 'left');
      TB('douleur', x0 + 14, y + 52, ORA2, 13, 'left'); TB('encéphale', x1 - 6, y + 52, DRED, 13, 'right'); arrow(x1 - 70, y - 40, 40, 0, GREY, '', 1.8);
      if (p > 0) BH.sol(p, 'Na⁺ bloqué → seuil non atteint → pas d’influx', W * .5, H * .9, DGREEN, 13);
    }
  ]);
})();
