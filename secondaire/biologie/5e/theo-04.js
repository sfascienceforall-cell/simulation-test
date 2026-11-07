/* Biologie 5e · chapitre 4 : homéostasie et thermorégulation */
(function () {
  var C = 'c04';

  function thermo(x, yb, h, T, tmin, tmax, col, lab, w) {            /* thermomètre vertical */
    var f = (T - tmin) / (tmax - tmin);
    BH.rr(x - 9, yb - h, 18, h, '#fff', GREY, 9, 2);
    BH.rr(x - 5, yb - h * BH.cl(f, 0, 1), 10, h * BH.cl(f, 0, 1), col, null, 4);
    BH.ci(x, yb + 8, 13, col, GREY, 2);
    if (lab) TB(lab, x, yb + 36, col === RED ? DRED : BLUE_D, w || 13);
  }
  function drop(x, y, s, col) { ctx.fillStyle = col || BLUE; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x + s * .9, y + s * .3, x, y + s); ctx.quadraticCurveTo(x - s * .9, y + s * .3, x, y - s); ctx.fill(); }

  SFA.theo(C, {
    icon: function () {
      thermo(W * .3, H * .72, H * .5, 37, 30, 42, RED, null);
      TB('37 °C', W * .3, H * .9, DRED, 20); TB('homéostasie', W * .62, H * .42, BLUE_D, 24); TB('thermorégulation', W * .62, H * .62, ORANGE, 18);
    },
    anim: function (t) {
      var u = (t % 480) / 480, air = 20 + 15 * Math.sin(2 * Math.PI * u), Tb = 37 + .02 * (air - 20) + .0;
      TB('La température du corps reste proche de 37 °C', W * .5, 16, BLUE_D, 14);
      var hot = air > 24, cold = air < 16;
      thermo(W * .12, H * .78, H * .5, air, 0, 40, hot ? ORA2 : BLUE, 'air ' + Math.round(air) + ' °C', 13);
      /* corps */
      var cx = W * .45, cy = H * .46; BH.el(cx, cy, W * .09, H * .2, '#fdece4', ORA2, 2.6);
      BH.ci(cx, cy - H * .27, H * .07, '#fdece4', ORA2, 2.6); TB(BH.fx(Tb, 1) + ' °C', cx, cy + 6, DRED, 19);
      TB('cerveau', cx, cy - H * .27 + 4, DRED, 10);
      /* effecteurs */
      var rx = W * .66;
      if (hot) {
        for (var i = 0; i < 6; i++) { var yy = (cy - H * .15 + ((i * 41 + t * 1.2) % 60)); drop(cx - W * .09 - 6 + (i % 3) * 10 + (i > 2 ? W * .2 : 0), yy, 5, BLUE); }
        TB('chaud :', rx, H * .28, DRED, 14, 'left'); TB('• vasodilatation', rx, H * .4, INK, 13, 'left'); TB('• sudation', rx, H * .5, INK, 13, 'left'); TB('→ pertes de chaleur', rx, H * .64, DGREEN, 13, 'left');
        for (i = 0; i < 4; i++) LN(cx + W * .1 + 4, cy - 20 + i * 14, cx + W * .1 + 24 + 6 * Math.sin(t * .1 + i), cy - 24 + i * 14, ORA2, 2, [3, 3]);
      } else if (cold) {
        for (i = 0; i < 5; i++) LN(cx - W * .1 - 8 + Math.sin(t * .8 + i) * 3, cy - 30 + i * 14, cx - W * .1 + 10 + Math.sin(t * .8 + i) * 3, cy - 30 + i * 14, BLUE_D, 2);
        TB('froid :', rx, H * .28, BLUE_D, 14, 'left'); TB('• vasoconstriction', rx, H * .4, INK, 13, 'left'); TB('• frissons', rx, H * .5, INK, 13, 'left'); TB('→ chaleur produite ↑', rx, H * .64, DGREEN, 13, 'left');
      } else { TB('air tempéré :', rx, H * .28, GREY, 14, 'left'); TB('production = pertes', rx, H * .42, DGREEN, 13, 'left'); }
      /* courbes */
      var gx = W * .26, gw = W * .68, gb = H * .93, gt = H * .8;
      LN(gx, gb, gx + gw, gb, AX, 1.4); LN(gx, gb - (gb - gt) * .5, gx + gw, gb - (gb - gt) * .5, GREEN, 1, [4, 4]);
      TB('T corps ≈ 37 °C (consigne)', gx, gt - 4, DGREEN, 11, 'left');
      for (i = 0; i <= 100; i++) { var uu = i / 100, tt = 37 + .02 * (20 + 15 * Math.sin(2 * Math.PI * uu) - 20); if (uu <= u) DOT(gx + gw * uu, gb - (gb - gt) * (.5 + (tt - 37) * 1.6), 1.6, DRED); }
    },
    th:
      '<div class="tcard"><b class="h">Milieu intérieur et homéostasie</b><p>Les cellules baignent dans le <b>milieu intérieur</b> (sang et liquide interstitiel). L’<b>homéostasie</b> est le maintien de ses paramètres (température ≈ 37 °C, glycémie ≈ 1 g/L, pH sanguin ≈ 7,4, quantité d’eau…) dans des limites étroites malgré les variations du milieu extérieur et de l’activité. Elle repose sur des rétrocontrôles : capteurs, centre de commande, effecteurs.</p></div>' +
      '<div class="tcard"><b class="h">Le bilan thermique</b><p>La température résulte d’un bilan : chaleur <b>produite</b> (métabolisme de base, contraction musculaire) moins chaleur <b>perdue</b> (rayonnement, convection, conduction, <b>évaporation de la sueur</b>). Si production > pertes, la chaleur est stockée :</p><p><b>ΔT = Q / (m · c)</b>, avec c ≈ 3,5 kJ·kg⁻¹·K⁻¹ pour le corps ; l’évaporation d’un gramme d’eau emporte ≈ <b>2,43 kJ</b>. Une puissance P pendant une durée t donne Q = P·t.</p><p><b>Exemple :</b> 200 W pendant 1 h = 720 kJ ; 720 / 2,43 ≈ 296 g de sueur à évaporer.</p></div>' +
      '<div class="tcard"><b class="h">Les effecteurs de la thermorégulation</b><p>Des thermorécepteurs (peau, centres) informent l’<b>hypothalamus</b>, qui compare la température à une consigne (≈ 37 °C). <b>Trop chaud</b> : vasodilatation cutanée (peau rouge), <b>sudation</b>, comportements (se dévêtir, s’abriter). <b>Trop froid</b> : vasoconstriction (peau pâle), <b>frissons</b> (contractions qui produisent de la chaleur), thermogenèse, comportements. Dans l’air humide, la sueur s’évapore mal : le refroidissement est moins efficace.</p></div>' +
      '<div class="tcard"><b class="h">Endothermes et ectothermes</b><p>Les <b>endothermes</b> (mammifères, oiseaux) produisent leur chaleur et gardent une température stable, au prix d’un métabolisme élevé (consommation d’O₂ qui augmente quand il fait froid). Les <b>ectothermes</b> (reptiles, amphibiens, poissons, insectes) dépendent de la chaleur extérieure : leur température et leur métabolisme suivent celle du milieu (souvent × 2 par tranche de 10 °C), mais ils dépensent beaucoup moins d’énergie.</p></div>' +
      '<div class="tcard"><b class="h">Fièvre ou coup de chaleur ?</b><p><b>Fièvre</b> : des pyrogènes (infection) relèvent la <b>consigne</b> de l’hypothalamus ; la régulation fonctionne : frissons et peau pâle jusqu’à atteindre la nouvelle consigne, sudation quand elle baisse. <b>Coup de chaleur</b> : la consigne reste à 37 °C mais la production dépasse les pertes (effort, air chaud et humide) : la régulation est dépassée, la peau est rouge et sèche, urgence vitale. <b>Piège :</b> un antipyrétique ne soigne pas un coup de chaleur.</p></div>'
  });

  SFA.figs(C, [
    /* 1 endothermes / ectothermes */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .46, h = H * .64, mx = function (T) { return O.x + (T - 0) / 40 * w; }, my = function (T) { return O.y - (T - 0) / 45 * h; };
      BH.axes(O.x, O.y, w + 8, h + 14, 'T air (°C)', 'T corps'); LN(mx(0), my(37), mx(40), my(37), RED, 3.4); TB('endotherme', mx(26), my(37) - 8, DRED, 13);
      LN(mx(5), my(5 + 2), mx(40), my(40 + 2), BLUE, 3.4); TB('ectotherme', mx(24), my(24) + 22, BLUE_D, 13);
      BH.rr(W * .66, H * .14, W * .3, H * .3, '#fdeaea', RED, 8, 1.8); BH.rr(W * .66, H * .52, W * .3, H * .3, '#e6f1fb', BLUE, 8, 1.8);
      ['chat', 'mésange', 'être humain'].forEach(function (s, i) { TB(s, W * .81, H * .24 + i * 17, p > 0 ? DRED : GREY, 13); });
      ['lézard', 'grenouille', 'serpent'].forEach(function (s, i) { TB(s, W * .81, H * .62 + i * 17, p > 0 ? BLUE_D : GREY, 13); });
      TB(p > 0 ? 'endothermes' : '?', W * .81, H * .1, DRED, 13); TB(p > 0 ? 'ectothermes' : '?', W * .81, H * .5, BLUE_D, 13);
      if (p > 0) BH.sol(p, 'homéostasie : milieu intérieur constant', W * .5, H * .95, DGREEN, 13);
    },
    /* 2 hypothalamus */
    function (p) {
      var y = H * .42;
      BH.rr(W * .04, y - 30, W * .24, 60, '#e6f1fb', BLUE_D, 10, 2); TB('thermorécepteurs', W * .16, y - 3, BLUE_D, 12); TB('(peau, centres)', W * .16, y + 13, BLUE_D, 11);
      BH.rr(W * .38, y - 36, W * .24, 72, p > 0 ? '#fde7e7' : '#fbe9d6', p > 0 ? RED : ORANGE, 10, p > 0 ? 3 : 2); TB('hypothalamus', W * .5, y - 8, DRED, 13); TB('consigne ≈ 37 °C', W * .5, y + 12, DRED, 12);
      BH.rr(W * .72, y - 30, W * .24, 60, '#e3f4ec', DGREEN, 10, 2); TB('effecteurs', W * .84, y - 4, DGREEN, 13);
      arrow(W * .29, y, W * .08, 0, BLUE, '', 3); arrow(W * .63, y, W * .08, 0, RED, '', 3);
      ['vaisseaux', 'glandes sudoripares', 'muscles'].forEach(function (s, i) { TB('• ' + s, W * .56, H * .66 + i * 15, GREY, 12, 'left'); });
      arrow(W * .84, y + 34, 0, H * .12, DGREEN, '', 2); TB('corrigent la température', W * .6, H * .86, DGREEN, 12, 'left');
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('compare, décide', W * .5, y - 48, DRED, 13); BH.a1(); BH.sol(p, 'centre de commande = hypothalamus', W * .5, H * .96, DGREEN, 13); }
    },
    /* 3 combien d'eau évaporer */
    function (p) {
      TB('200 W pendant 1 h', W * .26, H * .14, ORANGE, 15); TB('= 200 × 3 600 = 720 kJ', W * .26, H * .24, ORANGE, 14);
      for (var i = 0; i < 5; i++) { var a = i * .35 + 3.5; arrow(W * .26 + Math.cos(a) * 20, H * .52 + Math.sin(a) * 20, Math.cos(a) * 40, Math.sin(a) * 40, ORA2, '', 2); }
      BH.ci(W * .26, H * .54, 18, '#fdece4', ORA2, 2.4); TB('corps', W * .26, H * .54 + 5, ORA2, 11);
      BH.rr(W * .56, H * .22, W * .1, H * .5, '#fff', GREY, 6, 2); var lv = p > 0 ? BH.ph(p, 0, .7) : 0; BH.rr(W * .56 + 2, H * .72 - H * .5 * .6 * lv - 2, W * .1 - 4, H * .5 * .6 * lv, BLUE, null, 4);
      TB('sueur évaporée', W * .68, H * .35, BLUE_D, 13, 'left'); TB('2,43 kJ / g', W * .68, H * .45, GREY, 13, 'left');
      if (p > 0) { BH.al(BH.ph(p, .3, 1)); TB('720 / 2,43 ≈ 296 g', W * .68, H * .58, DGREEN, 14, 'left'); TB('≈ 0,3 L', W * .68, H * .68, DGREEN, 15, 'left'); for (i = 0; i < 4; i++) drop(W * .62 + i * 6, H * .18 - (i % 2) * 6, 4, BLUE); BH.a1(); BH.sol(p, 'm = Q / L  ≈ 0,3 kg par heure', W * .5, H * .93, DGREEN, 13); }
    },
    /* 4 chaleur stockée */
    function (p) {
      var O = { x: W * .14, y: H * .84 }, w = W * .8, h = H * .6, mx = function (t) { return O.x + t / 30 * w; }, my = function (T) { return O.y - (T - 36.5) / 2.5 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 't (min)', 'T corps (°C)'); [37, 38, 39].forEach(function (T) { LN(O.x - 3, my(T), O.x + 3, my(T), INK, 1.4); TB(T, O.x - 8, my(T) + 4, GREY, 12, 'right'); });
      LN(O.x, my(37), O.x + w, my(37), GREEN, 1.4, [5, 4]); TB('250 W stockés, aucune régulation', W * .55, H * .12, ORANGE, 13);
      var f = p > 0 ? BH.ph(p, 0, .8) : .0; if (p > 0) { LN(mx(0), my(37), mx(30 * f), my(37 + 1.84 * f), RED, 3.6); DOT(mx(30 * f), my(37 + 1.84 * f), 6, RED); }
      TB('Q = 250 × 1 800 = 450 kJ', W * .22, H * .3, INK, 13, 'left'); TB('m·c = 70 × 3,5 = 245 kJ/K', W * .22, H * .38, INK, 13, 'left');
      if (p > .6) { BH.sol(p, 'ΔT = 450 / 245 ≈ + 1,8 °C', W * .5, H * .95, DGREEN, 15); TB('38,8 °C', mx(30) - 6, my(38.84) - 12, DRED, 13, 'right'); }
    },
    /* 5 frissons et fièvre */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .66, mx = function (t) { return O.x + t / 10 * w; }, my = function (T) { return O.y - (T - 36.5) / 4 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 't', 'T (°C)'); LN(O.x, my(37), O.x + w, my(37), GREY, 1.4, [5, 4]); TB('37', O.x - 4, my(37) + 4, GREY, 12, 'right');
      var Tc = function (t) { return t < 2 ? 37 : 39.5; }, Tb = function (t) { return t < 2 ? 37 : 37 + 2.5 * (1 - Math.exp(-(t - 2) / 2.2)); };
      BH.fn(Tb, 0, 10, mx, my, RED, 3.4, 140); TB('température du corps', mx(7.5), my(Tb(7.5)) + 22, DRED, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); BH.poly([[mx(0), my(37)], [mx(2), my(37)], [mx(2), my(39.5)], [mx(10), my(39.5)]], DGREEN, 2.6, [6, 4]); TB('consigne relevée', mx(5.5), my(39.5) - 8, DGREEN, 13); BH.a1(); }
      DOT(mx(4.2), my(Tb(4.2)), 6, ORANGE); TB('38,5 °C', mx(4.2) + 8, my(Tb(4.2)) + 18, ORANGE, 13, 'left');
      if (p > 0) { BH.al(BH.ph(p, .4, 1)); tag('38,5 < consigne 39,5 : « froid » → frissons, peau pâle', W * .56, H * .05, DRED, 13); BH.a1(); }
    },
    /* 6 énergie d'un lézard */
    function (p) {
      var O = { x: W * .12, y: H * .78 }, h = H * .62, my = function (v) { return O.y - v / 160 * h; }, bw = W * .14;
      BH.axes(O.x, O.y, W * .8, h + 14, null, 'dépense (unités)');
      var data = [['lézard\n37 °C', 15, ORANGE], ['lézard\n27 °C', 7.5, ORANGE], ['lézard\n17 °C', 3.75, ORANGE], ['mammifère\n17 °C', 150, BLUE]];
      data.forEach(function (d, i) {
        var x = O.x + 20 + i * (bw + 18), show = p > 0 || i === 0 || i === 3; var v = d[1] * (p > 0 || i === 0 || i === 3 ? 1 : 0);
        if (show) { BH.al(i === 1 || i === 2 ? BH.ph(p, i * .15, i * .15 + .4) : 1); BH.rr(x, my(v), bw, O.y - my(v), d[2] === BLUE ? '#cfe3f8' : '#fbe9d6', d[2], 2, 2); TB(BH.fx(d[1]), x + bw / 2, my(v) - 6, d[2] === BLUE ? BLUE_D : ORANGE, 13); BH.a1(); }
        d[0].split('\n').forEach(function (s, k) { TB(s, x + bw / 2, O.y + 16 + k * 14, GREY, 11); });
      });
      TB('lézard : × 2 par +10 °C', W * .55, H * .12, ORANGE, 14, 'left');
      if (p > 0) { BH.sol(p, '150 / 3,75 = 40 : le mammifère dépense 40 fois plus', W * .52, H * .96, DGREEN, 13); }
    },
    /* 7 marathon */
    function (p) {
      var x0 = W * .06, sc = W * .88 / 700, y = H * .2;
      TB('production : 700 W', x0, y - 22, ORANGE, 14, 'left'); BH.rr(x0, y, 700 * sc, 30, '#fbe9d6', ORANGE, 4, 2);
      BH.rr(x0, y + 46, 100 * sc, 30, '#fdeaea', RED, 4, 2); TB('peau 100', x0 + 50 * sc, y + 66, DRED, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); BH.rr(x0 + 100 * sc, y + 46, 600 * sc, 30, '#cfe3f8', BLUE_D, 4, 2); TB('sueur : 600 W', x0 + 400 * sc, y + 66, BLUE_D, 13); BH.a1(); }
      TB('(a) 600 × 3 600 / 2 430 ≈ 0,89 kg/h', W * .06, H * .6, DGREEN, 13, 'left');
      BH.al(p > 0 ? BH.ph(p, .4, 1) : 0); TB('(b) 2 × 0,89 = 1,78 kg → 2,5 % de 70 kg', W * .06, H * .7, DGREEN, 13, 'left'); TB('(c) air humide : 700 − 100 − 450 = 150 W → 540 kJ/h', W * .06, H * .8, DRED, 12.5, 'left'); BH.sol(p, '540 / 245 ≈ + 2,2 °C par heure', W * .5, H * .93, DRED, 15); BH.a1();
      
    },
    /* 8 consommation d'oxygène */
    function (p) {
      var bx = W * .1, O = { y: H * .84 }, h = H * .6, bw = W * .15;
      [['air 30 °C', 1, '#cfe3f8', BLUE_D, 37], ['air 10 °C', 3, '#fbd9d8', RED, 37]].forEach(function (d, i) {
        var x = bx + i * (bw + 30), hh = h * d[1] / 3; BH.rr(x, O.y - hh, bw, hh, d[2], d[3], 2, 2); TB('O₂ × ' + d[1], x + bw / 2, O.y - hh - 6, d[3] === RED ? DRED : BLUE_D, 13); TB(d[0], x + bw / 2, O.y + 16, GREY, 12);
      });
      LN(bx - 6, O.y, bx + 2 * bw + 40, O.y, INK, 1.6); TB('consommation d’O₂', bx, H * .12, GREY, 12, 'left');
      var tx = W * .62; thermo(tx, H * .66, H * .46, 37, 30, 42, RED, null); TB('T corps = 37 °C', tx + 10, H * .84, DRED, 13); TB('dans les 2 cas', tx + 66, H * .5, DRED, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); arrow(bx + bw + 4, H * .36, 28, 0, DRED, '', 2.6); BH.a1(); BH.sol(p, 'T constante + O₂ ↑ au froid : endotherme', W * .5, H * .95, DGREEN, 13); }
    },
    /* 9 coup de chaleur et humidité */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .64, mx = function (t) { return O.x + t / 3 * w; }, my = function (T) { return O.y - (T - 37) / 5 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 't (h)', 'T (°C)'); [37, 40].forEach(function (T) { LN(O.x - 3, my(T), O.x + 3, my(T), INK, 1.4); TB(T, O.x - 8, my(T) + 4, GREY, 12, 'right'); });
      LN(O.x, my(40), O.x + w, my(40), RED, 1.4, [5, 4]); TB('40 °C', O.x + w, my(40) - 6, DRED, 12, 'right');
      var f = p > 0 ? BH.ph(p, 0, .8) : 0;
      BH.fn(function (t) { return 37 + .382 * t; }, 0, 3 * (f || .0001), mx, my, BLUE, 3.4, 80); BH.fn(function (t) { return 37 + 3.673 * t; }, 0, Math.min(1.36, 3 * (f || .0001)), mx, my, RED, 3.4, 80);
      TB('air à 50 % d’humidité : + 0,38 °C/h', W * .55, H * .22, BLUE_D, 13); TB('air à 80 % : + 3,7 °C/h', W * .55, H * .1, DRED, 13);
      if (p > 0) { BH.al(BH.ph(p, .5, 1)); DOT(mx(.8167), my(40), 6, RED); TB('49 min', mx(.8167) + 8, my(40) + 22, DRED, 14, 'left'); TB('≈ 8 h', mx(2.9), my(37 + .382 * 2.9) - 12, BLUE_D, 13, 'right'); BH.a1(); }
    },
    /* 10 deux personnes à 40 °C */
    function (p) {
      [[W * .25, 'A : coureur', 40.5, 37, DRED], [W * .75, 'B : enfant', 40, 41, ORANGE]].forEach(function (c, k) {
        var x = c[0], yb = H * .7, h = H * .5; TB(c[1], x, H * .1, c[4], 14);
        thermo(x - 20, yb, h, c[2], 36, 42, RED, null);
        var yc = yb - h * (c[3] - 36) / 6; ctx.fillStyle = DGREEN; ctx.beginPath(); ctx.moveTo(x - 4, yc); ctx.lineTo(x + 12, yc - 7); ctx.lineTo(x + 12, yc + 7); ctx.fill(); TB('consigne ' + c[3], x + 16, yc + 5, DGREEN, 12, 'left');
        TB(BH.fx(c[2], 1) + ' °C', x - 20, yb + 36, DRED, 14);
        TB(k ? 'grelotte, mains froides' : 'peau rouge et sèche', x, H * .19, GREY, 12);
        if (p > 0) { BH.al(BH.ph(p, k * .3, k * .3 + .5)); tag(k ? 'fièvre : consigne relevée' : 'coup de chaleur : régulation dépassée', x, H * .93, k ? ORANGE : DRED, 12.5); BH.a1(); }
      });
    }
  ]);
})();
