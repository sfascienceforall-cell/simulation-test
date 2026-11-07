/* Biologie 5e · chapitre 9 : cycle menstruel, fécondation et contraception */
(function () {
  var C = 'c09';

  function G(x, m, s, a) { return a * Math.exp(-.5 * Math.pow((x - m) / s, 2)); }
  var oest = function (d) { return 18 + G(d, 12.4, 2.3, 82) + G(d, 21, 3.2, 42); };
  var prog = function (d) { return 4 + G(d, 21.5, 3.2, 92); };
  var LHc = function (d) { return 10 + G(d, 13.6, .75, 82); };
  var FSHc = function (d) { return 22 + G(d, 3.5, 3, 26) + G(d, 13.6, .8, 24); };

  SFA.theo(C, {
    icon: function () {
      var x0 = W * .1, w = W * .8, y0 = H * .72, h = H * .5;
      BH.fn(function (d) { return oest(d); }, 1, 28, function (d) { return x0 + (d - 1) / 27 * w; }, function (v) { return y0 - v / 110 * h; }, ORANGE, 3);
      BH.fn(function (d) { return LHc(d); }, 1, 28, function (d) { return x0 + (d - 1) / 27 * w; }, function (v) { return y0 - v / 110 * h; }, RED, 3);
      BH.fn(function (d) { return prog(d); }, 1, 28, function (d) { return x0 + (d - 1) / 27 * w; }, function (v) { return y0 - v / 110 * h; }, GREEN, 3);
      LN(x0, y0, x0 + w, y0, INK, 2); TB('cycle menstruel', W * .5, H * .88, BLUE_D, 22);
    },
    anim: function (t) {
      var u = (t % 560) / 560, d = 1 + u * 27, gx = W * .08, gw = W * .62, gb = H * .92, gt = H * .56;
      var mx = function (x) { return gx + (x - 1) / 27 * gw; }, my = function (v) { return gb - v / 110 * (gb - gt); };
      TB('Cycle de 28 jours : jour ' + Math.floor(d), W * .5, 16, BLUE_D, 14);
      BH.axes(gx, gb, gw + 8, gb - gt + 8, null, null); [1, 7, 14, 21, 28].forEach(function (x) { TB(x, mx(x), gb + 13, GREY, 11); }); TB('jours', gx + gw + 14, gb + 4, GREY, 11, 'left');
      LN(mx(14), gb, mx(14), gt - 4, '#d7dde5', 1.4, [4, 4]); TB('ovulation', mx(14), gt - 8, GREY, 11);
      [[oest, ORANGE, 'œstrogènes'], [prog, GREEN, 'progestérone'], [LHc, RED, 'LH'], [FSHc, BLUE, 'FSH']].forEach(function (c, i) { BH.fn(c[0], 1, d, mx, my, c[1], 2.8, 120); TB(c[2], gx + gw + 10, gt + 6 + i * 16, c[1] === GREEN ? DGREEN : c[1] === RED ? DRED : c[1] === BLUE ? BLUE_D : ORANGE, 12, 'left'); });
      LN(mx(d), gb, mx(d), gt - 4, INK, 1.2, [3, 3]);
      /* ovaire */
      var ox = W * .15, oy = H * .27; BH.el(ox, oy, 42, 28, '#fbe9d6', ORANGE, 2);
      if (d < 14) { BH.ci(ox + 4, oy, 4 + 10 * (d - 1) / 13, '#fff', ORANGE, 2); BH.ci(ox + 4, oy, 2, '#fdeaea', DRED, 1.4); TB('follicule', ox, oy + 44, ORANGE, 11); }
      else if (d < 15) { BH.ci(ox + 30 + (d - 14) * 30, oy - 10, 5, '#fdeaea', DRED, 2); TB('ovulation', ox, oy + 44, DRED, 11); }
      else { BH.ci(ox + 4, oy, 11 * (d < 24 ? 1 : 1 - (d - 24) / 5 * .6), '#fff3c9', ORANGE, 2.4); TB('corps jaune', ox, oy + 44, ORANGE, 11); }
      /* endomètre */
      var en = d < 5 ? 10 + (5 - d) * 2 : d < 14 ? 10 + (d - 5) * 4 : d < 25 ? 46 + (d - 14) * 1.2 : 59 - (d - 25) * 14, ex = W * .4;
      BH.rr(ex - 32, oy + 28 - 62, 64, 62, '#f3eef9', VIOLET, 6, 1.6); BH.rr(ex - 30, oy + 26 - Math.max(6, en), 60, Math.max(6, en), '#e8b7c0', DRED, 3, 1.4); TB('endomètre', ex, oy + 44, DRED, 11);
      TB(d < 6 ? 'règles' : d < 14 ? 'phase folliculaire' : d < 15 ? 'ovulation' : 'phase lutéale', W * .74, H * .24, DRED, 13, 'left');
    },
    th:
      '<div class="tcard"><b class="h">Les acteurs hormonaux</b><p><b>Hypothalamus</b> : GnRH. <b>Hypophyse</b> : <b>FSH</b> (fait mûrir les follicules) et <b>LH</b> (déclenche l’ovulation, forme le corps jaune). <b>Ovaires</b> : <b>œstrogènes</b> (follicule, puis corps jaune) et <b>progestérone</b> (corps jaune). <b>Utérus</b> : l’endomètre épaissit sous l’action des œstrogènes puis se prépare à la nidation sous l’action de la progestérone.</p></div>' +
      '<div class="tcard"><b class="h">Les phases du cycle (28 jours)</b><p><b>Phase folliculaire</b> (J1 à J14) : FSH → maturation d’un follicule dominant ; les œstrogènes montent, l’endomètre prolifère ; ils freinent FSH et LH (rétrocontrôle négatif). Vers J12, des œstrogènes très élevés exercent un <b>rétrocontrôle positif</b> : <b>pic de LH</b> (J13-14) → <b>ovulation</b>. <b>Phase lutéale</b> (J14 à J28) : le follicule devient <b>corps jaune</b> qui sécrète progestérone et œstrogènes (rétrocontrôle négatif : FSH et LH bas) ; l’endomètre se prépare à la nidation. Sans fécondation, le corps jaune dégénère, les hormones chutent, les <b>règles</b> reviennent.</p></div>' +
      '<div class="tcard"><b class="h">Quand ovule-t-on ? La fenêtre fertile</b><p>La <b>phase lutéale dure ≈ 14 jours quelle que soit la durée du cycle</b> : c’est la phase folliculaire qui varie. Donc <b>ovulation = durée du cycle − 14</b> (24 j → J10 ; 28 j → J14 ; 35 j → J21). L’ovocyte vit ≈ 24 h, les spermatozoïdes jusqu’à ≈ 5 jours : la fenêtre fertile va de 5 jours avant l’ovulation au jour de l’ovulation. <b>Piège :</b> « ovulation au 14<sup>e</sup> jour » n’est vrai que pour un cycle de 28 jours.</p></div>' +
      '<div class="tcard"><b class="h">Fécondation, nidation, hCG</b><p>La <b>fécondation</b> a lieu dans la trompe ; le zygote se divise (morula à J+3, blastocyste à J+5) et se <b>niche</b> dans l’endomètre vers J+6 à J+10 après l’ovulation. Le trophoblaste sécrète l’<b>hCG</b>, qui maintient le corps jaune (donc la progestérone) : pas de règles. L’hCG double environ toutes les 48 h ; un test urinaire (seuil ≈ 25 mUI/mL) n’est fiable qu’à partir du jour du retard de règles. Ex. : 6 mUI/mL à J+10 → 12 (J+12) → 24 (J+14).</p></div>' +
      '<div class="tcard"><b class="h">Contraception et PMA</b><p><b>Pilule combinée</b> : œstrogène + progestatif de synthèse ; par rétrocontrôle négatif, FSH et LH restent bas : pas de maturation folliculaire, pas de pic de LH, <b>pas d’ovulation</b> (et glaire cervicale épaissie). Autres moyens : préservatif (seul à protéger aussi des IST), DIU, implant, contraception d’urgence. <b>PMA</b> : insémination, FIV, ICSI, en cas d’infertilité.</p></div>'
  });

  SFA.figs(C, [
    /* 1 hormone / rôle */
    function (p) {
      var hs = [['FSH', BLUE_D, 1], ['LH', DRED, 0], ['œstrogènes', ORANGE, 3], ['progestérone', DGREEN, 2]], rs = ['(a) déclenche l’ovulation', '(b) fait mûrir les follicules', '(c) prépare l’endomètre à la nidation', '(d) épaissit l’endomètre, provoque le pic de LH'];
      hs.forEach(function (h, i) { var y = H * (.16 + i * .22); BH.rr(W * .04, y - 15, W * .22, 30, '#fff', h[1], 15, 2.2); TB(h[0], W * .15, y + 5, h[1], 14); });
      rs.forEach(function (r, i) { var y = H * (.16 + i * .22); BH.rr(W * .52, y - 17, W * .45, 34, '#f4f6f9', GREY, 8, 1.6); TB(r.length > 34 ? r.slice(0, r.indexOf(' ', 18)) : r, W * .745, y + (r.length > 34 ? -2 : 5), INK, 11.5); if (r.length > 34) TB(r.slice(r.indexOf(' ', 18) + 1), W * .745, y + 12, INK, 11.5); });
      if (p > 0) hs.forEach(function (h, i) { BH.al(BH.ph(p, i * .2, i * .2 + .4)); var y1 = H * (.16 + i * .22), y2 = H * (.16 + h[2] * .22); LN(W * .26, y1, W * .52, y2, h[1], 3); BH.a1(); });
      else TB('?', W * .39, H * .5, GREY, 28);
    },
    /* 2 déclencheur de l'ovulation */
    function (p) {
      var O = { x: W * .1, y: H * .8 }, w = W * .82, h = H * .62, mx = function (d) { return O.x + (d - 8) / 9 * w; }, my = function (v) { return O.y - v / 110 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, 'jours', null); [8, 10, 12, 14, 16].forEach(function (d) { TB(d, mx(d), O.y + 14, GREY, 11); });
      BH.fn(oest, 8, 17, mx, my, ORANGE, 3.4, 100); TB('œstrogènes', mx(8.4), my(oest(8.4)) + 22, ORANGE, 13, 'left'); BH.fn(LHc, 8, 17, mx, my, RED, 3.4, 100); TB('LH', mx(14.6), my(LHc(13.6)) + 4, DRED, 14, 'left');
      LN(mx(14), O.y, mx(14), my(100), GREY, 1.4, [4, 4]); TB('ovulation', mx(14), O.y - 6 - h + 14, GREY, 12, 'left');
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); arrow(mx(12.4) + 4, my(100) - 6, mx(13.6) - mx(12.4) - 10, 0, DGREEN, '', 3.4); TB('rétrocontrôle +', mx(13), my(100) - 18, DGREEN, 13); BH.sol(p, 'pic d’œstrogènes → pic de LH → ovulation', W * .5, H * .96, DGREEN, 13); BH.a1(); }
    },
    /* 3 quand ovule-t-on */
    function (p) {
      var x0 = W * .17, w = W * .78, cyc = [[24, 10], [28, 14], [35, 21]];
      cyc.forEach(function (c, i) {
        var y = H * (.22 + i * .26), sc = w / 35; TB('cycle ' + c[0] + ' j', W * .01, y + 5, INK, 12, 'left'); BH.rr(x0 + 4, y - 11, c[0] * sc * .95, 22, '#eef0f3', GREY, 4, 1.4);
        BH.rr(x0 + 4 + (c[0] - 14) * sc * .95, y - 11, 14 * sc * .95, 22, '#f9ecd4', ORANGE, 0, 0); TB('phase lutéale 14 j', x0 + 4 + (c[0] - 7) * sc * .95, y - 16, ORANGE, 10);
        if (p > 0) { BH.al(BH.ph(p, i * .2, i * .2 + .4)); BH.rr(x0 + 4 + (c[1] - 6) * sc * .95, y - 11, 6 * sc * .95, 22, 'rgba(29,158,117,.35)', DGREEN, 2, 1.6); DOT(x0 + 4 + (c[1] - .5) * sc * .95, y, 6, RED); TB('J' + c[1], x0 + 4 + (c[1] - .5) * sc * .95, y + 28, DRED, 13); BH.a1(); }
      });
      if (p > 0) BH.sol(p, 'ovulation = durée − 14 · fenêtre : J−5 à J0', W * .5, H * .96, DGREEN, 13); else TB('ovulation ? fenêtre fertile ?', W * .5, H * .93, GREY, 14);
    },
    /* 4 doublement hCG */
    function (p) {
      var O = { x: W * .12, y: H * .82 }, w = W * .8, h = H * .62, mx = function (d) { return O.x + (d - 9) / 10 * w; }, my = function (v) { return O.y - Math.log10(v / 3) / 1.6 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, null, 'hCG (mUI/mL, log)'); TB('jour après l’ovulation', O.x + w * .5, O.y + 30, GREY, 12); [10, 12, 14, 16, 18].forEach(function (d) { TB(d, mx(d), O.y + 14, GREY, 11); });
      [6, 12, 24, 48, 96].forEach(function (v) { TB(v, O.x - 6, my(v) + 4, GREY, 11, 'right'); });
      LN(O.x, my(25), O.x + w, my(25), RED, 1.6, [5, 4]); TB('seuil du test : 25', O.x + w, my(25) - 6, DRED, 12, 'right');
      var f = p > 0 ? BH.ph(p, 0, .7) : 0.3; BH.fn(function (d) { return 6 * Math.pow(2, (d - 10) / 2); }, 10, 10 + 8 * f, mx, my, BLUE, 3.4, 80); DOT(mx(10), my(6), 5, BLUE_D); TB('6', mx(10) + 6, my(6) + 16, BLUE_D, 13, 'left');
      if (p > 0) { BH.al(BH.ph(p, .5, 1)); DOT(mx(14), my(24), 5, BLUE_D); DOT(mx(18), my(96), 5, BLUE_D); TB('24 (J14)', mx(14) - 6, my(24) + 18, BLUE_D, 12, 'right'); TB('96 (J18)', mx(18) - 6, my(96) - 8, BLUE_D, 13, 'right'); LN(mx(14.12), my(25), mx(14.12), O.y, DGREEN, 2, [4, 3]); TB('J14,1', mx(14.12) + 6, O.y - 8, DGREEN, 13, 'left'); BH.a1(); }
    },
    /* 5 règle du 14e jour */
    function (p) {
      var O = { x: W * .08, y: H * .78 }, w = W * .88, h = H * .5, d0 = 12, d1 = 23, bw = w / (d1 - d0 + 1), pr = { 16: .10, 17: .16, 18: .14, 19: .27, 20: .31, 21: .33 }, my = function (v) { return O.y - v / .36 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, null, null); TB('cycle de 35 jours : ovulation au jour 21', W * .5, H * .08, INK, 13);
      for (var d = d0; d <= d1; d++) { var x = O.x + 4 + (d - d0) * bw; TB(d, x + bw / 2, O.y + 14, d === 14 ? DRED : d === 19 ? DGREEN : GREY, 11); if (p > 0 && pr[d]) { BH.al(BH.ph(p, (d - 16) * .08, (d - 16) * .08 + .4)); BH.rr(x + 2, my(pr[d]), bw - 4, O.y - my(pr[d]), d === 19 ? '#cfeadf' : '#e6f1fb', d === 19 ? DGREEN : BLUE_D, 2, 1.4); TB(Math.round(pr[d] * 100) + '', x + bw / 2, my(pr[d]) - 5, d === 19 ? DGREEN : BLUE_D, 11); BH.a1(); } }
      BH.rr(O.x + 4, O.y - 22, 3 * bw, 20, 'rgba(226,75,74,.2)', DRED, 3, 1.4); TB('« jours 12-14 »', O.x + 4 + 1.5 * bw, O.y - 8, DRED, 11);
      DOT(O.x + 4 + 9.5 * bw, O.y + 28, 6, RED); TB('ovulation J21', O.x + 4 + 9.5 * bw, O.y + 44, DRED, 12);
      if (p > 0) { BH.al(BH.ph(p, .5, 1)); TB('J14 : ≈ 0 %', O.x + 4 + 2 * bw, H * .3, DRED, 14); TB('J19 : 27 %', O.x + 4 + 7.5 * bw, H * .3, DGREEN, 14); BH.a1(); } else TB('probabilité de conception (% par jour)', W * .5, H * .22, GREY, 12);
    },
    /* 6 pilule */
    function (p) {
      var y = H * .3;
      BH.rr(W * .03, y - 24, W * .22, 48, '#f3dff7', VIOLET, 24, 2.4); TB('pilule', W * .14, y - 2, VIOLET, 14); TB('de synthèse', W * .14, y + 14, VIOLET, 10.5);
      BH.rr(W * .36, y - 26, W * .24, 52, '#fbe9d6', ORANGE, 10, 2.4); TB('hypophyse', W * .48, y - 4, ORANGE, 13); TB('FSH et LH', W * .48, y + 13, DRED, 12);
      BH.rr(W * .72, y - 26, W * .24, 52, '#e3f4ec', DGREEN, 10, 2.4); TB('ovaires', W * .84, y - 4, DGREEN, 13); TB('follicule', W * .84, y + 13, GREY, 12);
      arrow(W * .26, y, W * .09, 0, RED, '', 3.4); LN(W * .292, y - 12, W * .292, y + 12, RED, 4); TB('frein (−)', W * .3, y - 36, DRED, 12); arrow(W * .61, y, W * .1, 0, BLUE, '', 3);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .5)); TB('FSH et LH restent bas', W * .48, H * .58, DRED, 14); BH.al(BH.ph(p, .3, .8)); TB('pas de maturation du follicule', W * .5, H * .68, DRED, 13); TB('pas de pic de LH', W * .5, H * .77, DRED, 13); BH.al(BH.ph(p, .6, 1)); BH.sol(p, 'pas d’ovulation', W * .5, H * .92, DGREEN, 17); BH.a1();
        LN(W * .72, y - 20, W * .96, y + 20, RED, 3); LN(W * .96, y - 20, W * .72, y + 20, RED, 3);
      } else TB('?', W * .5, H * .65, GREY, 30);
    },
    /* 7 dosages de LH */
    function (p) {
      var O = { x: W * .12, y: H * .8 }, w = W * .8, h = H * .62, mx = function (d) { return O.x + (d - 9.5) / 5 * w; }, my = function (v) { return O.y - v / 45 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, null, 'LH (UI/L)'); TB('jour du cycle', O.x + w * .5, O.y + 30, GREY, 12); [10, 11, 12, 13, 14].forEach(function (d) { TB(d, mx(d), O.y + 14, GREY, 11); });
      var A = [[10, 6], [12, 8], [13, 40], [14, 9]], B = [[10, 3], [12, 3], [13, 4], [14, 3]];
      BH.poly(A.map(function (q) { return [mx(q[0]), my(q[1])]; }), RED, 3); BH.poly(B.map(function (q) { return [mx(q[0]), my(q[1])]; }), BLUE, 3);
      A.forEach(function (q) { DOT(mx(q[0]), my(q[1]), 5, RED); TB(q[1], mx(q[0]) + 8, my(q[1]) - 6, DRED, 12, 'left'); }); B.forEach(function (q) { DOT(mx(q[0]), my(q[1]), 5, BLUE); });
      TB('A', mx(10) - 12, my(6) - 4, DRED, 15); TB('B (pilule)', mx(10.3), my(3) - 11, BLUE_D, 13, 'left');
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('pic de LH (J13)', mx(13) - 10, my(40) - 2, DRED, 13, 'right'); TB('→ ovulation vers J14', mx(13) - 10, my(40) + 16, DRED, 12, 'right'); BH.al(BH.ph(p, .5, 1)); TB('pas de pic : ovulation bloquée', mx(12.2), my(18), BLUE_D, 13); BH.a1(); }
    },
    /* 8 test trop précoce */
    function (p) {
      var O = { x: W * .1, y: H * .8 }, w = W * .84, h = H * .56, mx = function (d) { return O.x + d / 15 * w; }, my = function (v) { return O.y - v / 40 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, null, 'hCG (mUI/mL)'); TB('jours après le rapport / l’ovulation', O.x + w * .5, O.y + 30, GREY, 12); [0, 4, 8, 12, 14].forEach(function (d) { TB(d, mx(d), O.y + 14, GREY, 11); });
      ctx.fillStyle = 'rgba(155,119,221,.18)'; ctx.fillRect(mx(6), O.y - h - 6, mx(10) - mx(6), h + 6); TB('nidation (6-10 j)', mx(8), O.y - h + 2, VIOLET, 12);
      LN(O.x, my(25), O.x + w, my(25), RED, 1.6, [5, 4]); TB('seuil 25', O.x + w, my(25) - 6, DRED, 12, 'right');
      BH.fn(function (d) { return d < 7 ? 0 : 6 * Math.pow(2, (d - 10) / 2); }, 0, 15, mx, my, BLUE, 3.4, 150);
      arrow(mx(8), O.y - 24, 0, 24, ORANGE, '', 3); TB('test à J+8', mx(8), O.y - 30, ORANGE, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('hCG ≈ 3 < 25 : négatif', mx(8), my(3) - 52, DRED, 13); BH.al(BH.ph(p, .5, 1)); BH.sol(p, 'trop tôt : refaire le test vers le jour du retard (J+14)', W * .5, H * .96, DGREEN, 12.5); BH.a1(); }
    },
    /* 9 chronologie cycle de 28 j */
    function (p) {
      var x0 = W * .06, w = W * .88, y = H * .5, mx = function (d) { return x0 + (d - 1) / 27 * w; };
      LN(x0, y, x0 + w, y, INK, 2.4); [1, 7, 14, 21, 28].forEach(function (d) { LN(mx(d), y - 5, mx(d), y + 5, INK, 2); if (d < 14) TB('J' + d, mx(d), y + 20, GREY, 11); });
      var ev = [[14, 'ovulation\n+ fécondation', DRED, -1], [17, 'morula', ORANGE, 1], [19, 'blastocyste', ORANGE, -1], [21, 'nidation', VIOLET, 1], [28, 'hCG ≥ 25', DGREEN, -1]];
      ev.forEach(function (e, i) { var x = mx(e[0]), up = e[3] < 0, ty = y + (up ? -34 : 44); if (p > 0) BH.al(BH.ph(p, i * .15, i * .15 + .35)); else BH.al(.2); DOT(x, y, 6, e[2]); LN(x, y + (up ? -7 : 7), x, ty + (up ? 6 : -14), e[2], 1.4); var ls = ('J' + e[0] + '\n' + e[1]).split('\n'); ls.forEach(function (s, k) { TB(s, x, ty + k * 14 - (up ? (ls.length - 1) * 14 : 0), e[2], 12); }); BH.a1(); });
      TB('ovulation et fécondation : J14 (cycle de 28 j)', W * .5, H * .1, INK, 13);
      if (p > 0) { BH.sol(p, 'avant J28 l’hCG est sous le seuil : test peu fiable', W * .5, H * .9, DGREEN, 13); BH.al(BH.ph(p, .5, 1)); TB('(14 j après l’ovulation)', mx(28) + 4, y + 90, DGREEN, 11, 'right'); BH.a1(); }
    },
    /* 10 rétrocontrôle positif */
    function (p) {
      var O = { x: W * .1, y: H * .8 }, w = W * .82, h = H * .6, mx = function (d) { return O.x + (d - 8) / 9 * w; }, my = function (v) { return O.y - v / 110 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, 'jours', null); [8, 10, 12, 14, 16].forEach(function (d) { TB(d, mx(d), O.y + 14, GREY, 11); });
      ctx.fillStyle = 'rgba(29,158,117,.16)'; ctx.fillRect(mx(11.5), O.y - h - 4, mx(14) - mx(11.5), h + 4); TB('rétrocontrôle +', mx(12.75), O.y - h + 8, DGREEN, 12);
      BH.fn(oest, 8, 17, mx, my, ORANGE, 3.4, 100); BH.fn(LHc, 8, 17, mx, my, RED, 3.4, 100); TB('œstrogènes', mx(8.2), my(oest(8.2)) + 24, ORANGE, 13, 'left'); TB('LH', mx(14.6), my(40), DRED, 14, 'left');
      arrow(mx(12.4), my(100) + 20, 30, 0, DGREEN, '', 2.6);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); LN(mx(14), O.y, mx(14), O.y - h, DRED, 2, [5, 4]); TB('ovulation', mx(14), O.y - h - 8, DRED, 12); arrow(mx(15.3), my(62), 0, 30, DRED, '', 2.6); TB('le follicule disparaît :', mx(17), my(92), DRED, 12, 'right'); TB('œstrogènes ↓', mx(17), my(80), DRED, 12, 'right'); BH.sol(p, 'la boucle s’arrête avec l’ovulation', W * .5, H * .96, DGREEN, 14); BH.a1(); }
    }
  ]);
})();
