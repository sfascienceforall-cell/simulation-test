/* Biologie 5e · chapitre 3 : hormones, rétrocontrôle et glycémie */
(function () {
  var C = 'c03';

  function pancreas(x, y, w, h) {
    ctx.fillStyle = '#fbe9d6'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(x, y, w / 2, h / 2, -.12, 0, 7); ctx.fill(); ctx.stroke();
    BH.ci(x - w * .17, y, h * .2, '#cfe3f8', BLUE_D, 2); BH.ci(x + w * .17, y, h * .2, '#fbd9d8', RED, 2);
  }
  function cell(x, y, rx, ry, col, fill) { BH.el(x, y, rx, ry, fill || '#eef7f1', col || DGREEN, 2.4); }
  function gdot(x, y, r) { DOT(x, y, r || 3.6, ORANGE); }

  SFA.theo(C, {
    icon: function () {
      TB('1,0 g/L', W * .5, H * .4, BLUE_D, 40); TB('insuline ⇄ glucagon', W * .5, H * .66, ORANGE, 20);
      arrow(W * .22, H * .25, 0, 34, BLUE, '', 3); arrow(W * .78, H * .5, 0, -34, RED, '', 3);
    },
    anim: function (t) {
      var u = (t % 420) / 420, G = function (x) { return 1 + .32 * Math.sin(2 * Math.PI * x * 2) * (1 - .12 * x); };
      var g = G(u), ins = BH.cl((g - 1) / .3, 0, 1), glu = BH.cl((1 - g) / .3, 0, 1);
      TB('Rétrocontrôle négatif de la glycémie', W * .5, 16, BLUE_D, 14);
      pancreas(W * .3, H * .27, W * .26, H * .24); TB('pancréas', W * .3, H * .48, ORANGE, 12); TB('β', W * .3 - W * .045, H * .27 + 5, BLUE_D, 14); TB('α', W * .3 + W * .045, H * .27 + 5, DRED, 14);
      /* barres hormones */
      BH.rr(W * .56, H * .17, W * .34, 12, '#e3e7ed', null, 4); BH.rr(W * .56, H * .17, W * .34 * ins, 12, BLUE, null, 4); TB('insuline', W * .56, H * .17 - 5, BLUE_D, 12, 'left');
      BH.rr(W * .56, H * .35, W * .34, 12, '#e3e7ed', null, 4); BH.rr(W * .56, H * .35, W * .34 * glu, 12, RED, null, 4); TB('glucagon', W * .56, H * .35 - 5, DRED, 12, 'left');
      var act = ins > .05 ? 'insuline ↑ : le glucose entre dans les cellules → glycémie ↓' : glu > .05 ? 'glucagon ↑ : le foie libère du glucose → glycémie ↑' : 'équilibre';
      TB(act, W * .5, H * .6, ins > .05 ? BLUE_D : glu > .05 ? DRED : GREY, 13);
      /* courbe */
      var gx = W * .1, gw = W * .8, gb = H * .93, gt = H * .7, mx = function (x) { return gx + x * gw; }, my = function (v) { return gb - (v - .6) / .8 * (gb - gt); };
      BH.axes(gx, gb, gw + 6, gb - gt + 8, 't', null); TB('glycémie', gx + 8, gt - 6, GREY, 12, 'left');
      LN(gx, my(1), gx + gw, my(1), GREEN, 1.4, [5, 4]); TB('1,0', gx - 4, my(1) + 4, DGREEN, 12, 'right');
      BH.fn(G, 0, 1, mx, my, '#d7dde5', 2, 100); BH.fn(G, 0, u, mx, my, ins > .05 ? BLUE : glu > .05 ? RED : GREY, 3.2, 100); DOT(mx(u), my(g), 6, ins > .05 ? BLUE : RED);
      TB(BH.fx(g, 2) + ' g/L', gx + gw, gt - 6, INK, 13, 'right');
    },
    th:
      '<div class="tcard"><b class="h">Commande nerveuse et commande hormonale</b><p>Une <b>glande endocrine</b> libère une <b>hormone</b> dans le sang ; seules les <b>cellules cibles</b>, qui portent le récepteur adapté, répondent. Commande <b>nerveuse</b> : rapide (ms), localisée, brève. Commande <b>hormonale</b> : plus lente (secondes à heures), diffuse, durable. Ex. : l’insuline est produite par le pancréas (cellules β) ; ses cibles sont le foie, les muscles et le tissu adipeux.</p></div>' +
      '<div class="tcard"><b class="h">Le rétrocontrôle négatif</b><p>Un <b>capteur</b> mesure une grandeur, un <b>centre de commande</b> la compare à une <b>consigne</b>, des <b>effecteurs</b> corrigent l’écart <b>dans le sens opposé</b> à la variation. C’est le principe d’un thermostat : la grandeur reste proche de la consigne, mais jamais exactement (un écart résiduel subsiste d’autant plus faible que la correction est énergique). Le rétrocontrôle <b>positif</b> amplifie au contraire la variation (ex. pic de LH, chapitre 9).</p></div>' +
      '<div class="tcard"><b class="h">Régulation de la glycémie</b><p>Glycémie normale : <b>≈ 1 g/L</b> (0,7 à 1,1 g/L à jeun). Après un repas, la glycémie monte : les <b>cellules β</b> du pancréas sécrètent l’<b>insuline</b> (hypoglycémiante) : entrée du glucose dans les cellules, stockage sous forme de <b>glycogène</b> (foie, muscles) et de lipides. Entre les repas ou à l’effort, la glycémie baisse : les <b>cellules α</b> sécrètent le <b>glucagon</b> (hyperglycémiant) : le foie dégrade son glycogène et libère du glucose. Conversions : 1 g/L = 100 mg/dL ; M(glucose) = 180 g/mol, donc 1,26 g/L = 7,0 mmol/L.</p></div>' +
      '<div class="tcard"><b class="h">Les diabètes</b><p><b>Type 1</b> : destruction auto-immune des cellules β, pas d’insuline ; apparition souvent précoce ; traitement par injections d’insuline. <b>Type 2</b> : <b>résistance à l’insuline</b> (les cellules y répondent mal) puis épuisement du pancréas ; lié au surpoids et à la sédentarité ; insulinémie d’abord élevée. Diagnostic : glycémie à jeun ≥ 1,26 g/L (ou ≥ 2,00 g/L deux heures après 75 g de glucose). Trop d’insuline sans apport de glucose provoque une <b>hypoglycémie</b>.</p></div>' +
      '<div class="tcard"><b class="h">Méthode et exemples chiffrés</b><p><b>Conversion :</b> mmol/L = (g/L × 1 000) / 180. <b>Équilibre d’un système régulé :</b> écart = valeur d’équilibre − consigne ; plus le gain g est grand, plus l’écart est petit. <b>Calcul de dose (illustratif) :</b> 60 g de glucides à 12 g par unité = 5 U ; correction (1,9 − 1,1) / 0,4 = 2 U ; total 7 U. <b>Piège :</b> l’insuline <i>fait baisser</i> la glycémie ; le glucagon la fait monter.</p></div>'
  });

  SFA.figs(C, [
    /* 1 glande, hormone, cellule cible */
    function (p) {
      pancreas(W * .17, H * .3, W * .24, H * .26); TB('pancréas', W * .17, H * .54, ORANGE, 13); TB('(glande endocrine)', W * .17, H * .62, ORANGE, 11);
      LN(W * .3, H * .3, W * .72, H * .3, RED, 14); LN(W * .3, H * .3, W * .72, H * .3, '#fbd9d8', 10); TB('sang', W * .5, H * .22, DRED, 13);
      for (var i = 0; i < 5; i++) { var x = W * (.34 + .08 * i) + ((p > 0 ? p : 0) * 30) % (W * .08); DOT(x, H * .3, 3.6, i % 2 ? BLUE_D : DRED); }
      cell(W * .84, H * .3, W * .1, H * .17, DGREEN); TB('cellule', W * .84, H * .27, DGREEN, 12); TB('cible', W * .84, H * .33, DGREEN, 12);
      TB('hormones', W * .5, H * .42, INK, 13);
      BH.rr(W * .06, H * .72, W * .42, H * .2, '#e6f1fb', BLUE_D, 8, 2); TB('insuline (β) : ↓ glycémie', W * .27, H * .72 + 26, BLUE_D, 13);
      BH.rr(W * .52, H * .72, W * .42, H * .2, '#fdeaea', RED, 8, 2); TB('glucagon (α) : ↑ glycémie', W * .73, H * .72 + 26, DRED, 13);
      if (p > 0) { BH.al(BH.ph(p, .2, .8)); TB('par le sang → cibles', W * .5, H * .62, DGREEN, 13); BH.a1(); arrow(W * .27, H * .66, 0, 12, BLUE, '', 2.4); arrow(W * .73, H * .7, 0, -12, RED, '', 2.4); }
    },
    /* 2 qui fait baisser la glycémie */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .78, h = H * .62, mx = function (t) { return O.x + t / 4 * w; }, my = function (g) { return O.y - (g - .6) / 1 * h; };
      BH.axes(O.x, O.y, w + 6, h + 20, 't (h)', 'g/L'); LN(O.x, my(1), O.x + w, my(1), GREEN, 1.4, [5, 4]); TB('1,0', O.x - 4, my(1) + 4, DGREEN, 12, 'right');
      var gl = function (t) { return BH.it([[0, 1], [.3, 1.05], [1, 1.45], [2, 1.15], [3, 1.0], [4, 1.0]], t); };
      BH.fn(gl, 0, 4, mx, my, RED, 3.2, 100); TB('glycémie', mx(.9), my(1.45) - 12, DRED, 13);
      arrow(mx(.4), H * .12, 0, 20, ORANGE, '', 2.4); TB('repas', mx(.4) + 6, H * .1, ORANGE, 13, 'left');
      if (p > 0) {
        var ins = function (t) { return .6 + .75 * Math.exp(-Math.pow((t - 1.3) / .8, 2)); }; BH.al(BH.ph(p, 0, .6)); BH.fn(ins, 0, 4, mx, my, BLUE, 3.2, 100); TB('insuline', mx(1.5), my(1.35) - 12, BLUE_D, 13, 'left');
        BH.al(BH.ph(p, .5, 1)); arrow(mx(2.4), my(1.14) - 4, 0, 30, BLUE, '', 3); TB('le glucose entre dans les cellules', W * .66, H * .3, BLUE_D, 12); BH.sol(p, 'insuline → la glycémie redescend', W * .5, H * .95, DGREEN, 14); BH.a1();
      }
    },
    /* 3 convertir une glycémie */
    function (p) {
      var rows = [['1,26 g/L', '×100', '126 mg/dL', BLUE_D], ['1,26 g/L', '×1000 ÷ 180', '7,0 mmol/L', ORANGE]];
      rows.forEach(function (r, k) {
        var y = H * (.24 + k * .24);
        BH.rr(W * .05, y - 18, W * .26, 36, '#e6f1fb', BLUE_D, 8, 2); TB(r[0], W * .18, y + 5, BLUE_D, 15);
        arrow(W * .33, y, W * .12, 0, r[3], '', 3); TB(r[1], W * .39, y - 12, r[3], 12);
        BH.al(p > 0 ? BH.ph(p, k * .25, k * .25 + .4) : .25); BH.rr(W * .5, y - 18, W * .3, 36, '#fff3c9', ORANGE, 8, 2); TB(p > 0 ? r[2] : '?', W * .65, y + 5, DGREEN, 15); BH.a1();
      });
      BH.rr(W * .05, H * .74, W * .26, 36, '#fff3c9', ORANGE, 8, 2); TB('5,0 mmol/L', W * .18, H * .74 + 23, ORANGE, 15);
      arrow(W * .33, H * .74 + 18, W * .12, 0, GREEN, '', 3); TB('× 180 ÷ 1000', W * .39, H * .74 + 6, DGREEN, 12);
      BH.al(p > 0 ? BH.ph(p, .5, .9) : .25); BH.rr(W * .5, H * .74, W * .3, 36, '#e3f4ec', DGREEN, 8, 2); TB(p > 0 ? '0,90 g/L' : '?', W * .65, H * .74 + 23, DGREEN, 15); BH.a1();
      TB('M(glucose) = 180 g/mol', W * .5, H * .96, GREY, 12);
    },
    /* 4 pourquoi réguler */
    function (p) {
      var bx = W * .12, by = H * .86, hh = H * .7, sc = hh / 8.5, bw = W * .16;
      BH.axes(bx - 10, by, W * .78, hh + 14, null, 'g/L');
      BH.rr(bx + 10, by - 1 * sc, bw * .8, 1 * sc, '#cfeadf', DGREEN, 2, 2); TB('normale : 1 g/L', bx + 10 + bw / 2, by - 1 * sc - 8, DGREEN, 12);
      var f = BH.ph(p, 0, .7), hv = p > 0 ? 8 : 1; BH.rr(bx + 14 + 1.7 * bw, by - hv * sc * (p > 0 ? f * .875 + .125 : 1), bw * .8, hv * sc * (p > 0 ? f * .875 + .125 : 1), '#fbd9d8', RED, 2, 2);
      TB('sans régulation ?', bx + 14 + 2.1 * bw, by + 16, DRED, 12);
      BH.rr(W * .8, H * .12, 34, 54, '#fdece4', ORA2, 8, 2); TB('33 cl', W * .8 + 17, H * .12 + 32, ORA2, 11); TB('35 g de sucre', W * .8 + 17, H * .12 + 70, ORA2, 12); TB('5 L de sang', W * .8 + 17, H * .12 + 86, DRED, 12);
      if (p > 0) { BH.sol(p, '35 g / 5 L = + 7 g/L → 8 g/L', W * .5, H * .96, DRED, 14); BH.al(BH.ph(p, .5, 1)); TB('8 × la normale', W * .8 + 17, H * .5, DRED, 13); BH.a1(); }
    },
    /* 5 équilibre d'un thermostat */
    function (p) {
      var O = { x: W * .14, y: H * .84 }, w = W * .78, h = H * .62, mx = function (g) { return O.x + g / 5 * w; }, my = function (T) { return O.y - (T - 14) / 10 * h; };
      BH.axes(O.x, O.y, w + 6, h + 18, 'gain g', 'T éq. (°C)'); LN(O.x, my(22), O.x + w, my(22), GREEN, 1.6, [5, 4]); TB('consigne 22 °C', O.x + w, my(22) - 6, DGREEN, 12, 'right');
      var Te = function (g) { return 1.5 * g * 22 / (.05 + 1.5 * g); }; BH.fn(function (g) { return Math.max(14, Te(g)); }, 0, 5, mx, my, BLUE, 3, 100);
      [.5, 2].forEach(function (g, k) { DOT(mx(g), my(Te(g)), 6, k ? RED : ORANGE); });
      TB('g = 0,5', mx(.5), my(Te(.5)) + 24, ORANGE, 12); TB('g = 2', mx(2), my(Te(2)) + 24, DRED, 12);
      TB('T éq = b·g·Tc / (a + b·g)   (axe tronqué à 14 °C)', W * .5, H * .08, INK, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('20,6 °C', mx(.5) + 6, my(Te(.5)) - 12, ORANGE, 14, 'left'); BH.al(BH.ph(p, .4, 1)); TB('21,6 °C', mx(2), my(Te(2)) - 14, DRED, 14); BH.a1(); BH.sol(p, 'écarts : 1,4 °C puis 0,4 °C : plus g est grand, mieux c’est', W * .5, H * .96, DGREEN, 13); }
    },
    /* 6 profil hormonal */
    function (p) {
      [[W * .26, 'cellule normale', false], [W * .74, 'cellule résistante', true]].forEach(function (c) {
        var x = c[0], y = H * .56; cell(x, y, W * .17, H * .2, c[2] ? RED : DGREEN, c[2] ? '#fdf0f0' : '#eef7f1'); TB(c[1], x, y + 5, c[2] ? DRED : DGREEN, 13);
        for (var i = 0; i < 3; i++) { var rx = x - W * .1 + i * W * .1; BH.rr(rx - 7, y - H * .2 - 5, 14, 10, c[2] ? '#fff' : '#cfe3f8', BLUE_D, 2, 1.6); DOT(rx, y - H * .2 - 24, 5, BLUE); }
        TB('insuline', x, H * .2, BLUE_D, 12);
        if (!c[2]) { for (i = 0; i < 4; i++) { gdot(x - 24 + i * 16, H * .88 - (p > 0 ? 0 : 0), 3.6); arrow(x - 24 + i * 16, H * .88 - 18, 0, -16, ORANGE, '', 1.5); } }
        else { for (i = 0; i < 5; i++) gdot(x - 40 + i * 20, H * .9, 3.6); }
      });
      TB('glucose', W * .26, H * .96, ORANGE, 12); TB('glucose resté dans le sang', W * .74, H * .98, ORANGE, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); LN(W * .62, H * .28, W * .86, H * .36, RED, 3); LN(W * .86, H * .28, W * .62, H * .36, RED, 3); BH.al(BH.ph(p, .4, 1)); tag('diabète de type 2 : résistance', W * .5, H * .08, DRED, 14); BH.a1(); }
    },
    /* 7 bolus */
    function (p) {
      var x0 = W * .06, sc = W * .88 / 7.6, y = H * .5;
      BH.rr(x0, y - 24, 5 * sc, 48, '#cfe3f8', BLUE_D, 4, 2); TB('repas : 60 g / 12 = 5 U', x0 + 2.5 * sc, y + 5, BLUE_D, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); BH.rr(x0 + 5 * sc, y - 24, 2 * sc, 48, '#fbd9d8', RED, 4, 2); TB('2 U', x0 + 6 * sc, y + 5, DRED, 14); BH.a1(); }
      TB('repas', x0 + 2.5 * sc, y - 36, GREY, 12);
      TB('glycémie 1,9 g/L, cible 1,1 g/L', W * .5, H * .12, INK, 14); TB('1 U abaisse la glycémie de 0,4 g/L', W * .5, H * .22, GREY, 13);
      BH.al(p > 0 ? BH.ph(p, .2, .7) : 0); TB('correction : (1,9 − 1,1) / 0,4 = 2 U', x0 + 6 * sc, y + 42, DRED, 12); BH.a1();
      if (p > 0) BH.sol(p, 'total : 5 + 2 = 7 U', W * .5, H * .88, DGREEN, 17);
    },
    /* 8 bolus sans repas */
    function (p) {
      var O = { x: W * .12, y: H * .86 }, w = W * .8, h = H * .64, mx = function (t) { return O.x + t / 5 * w; }, my = function (g) { return O.y - (g - .3) / 1.1 * h; };
      ctx.fillStyle = 'rgba(226,75,74,.12)'; ctx.fillRect(O.x, my(.7), w, O.y - my(.7)); TB('hypoglycémie < 0,7 g/L', O.x + w - 4, my(.7) + 16, DRED, 12, 'right');
      BH.axes(O.x, O.y, w + 6, h + 18, 't (h)', 'g/L'); LN(O.x, my(.7), O.x + w, my(.7), RED, 1.4, [5, 4]);
      var g1 = function (t) { return 1.1 - .27 * t; };
      BH.fn(g1, 0, 3.2, mx, my, RED, 3.2, 80); arrow(mx(.5), H * .12, 0, 20, BLUE, '', 2.4); TB('bolus', mx(.5) + 6, H * .1, BLUE_D, 13, 'left');
      TB('pas de repas', mx(2.6), H * .2, GREY, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); arrow(mx(2.3), my(.5) + 6, 0, -26, RED, '', 3); TB('glucagon : insuffisant', mx(2.3) + 8, my(.5) - 24, DRED, 12, 'left'); BH.al(BH.ph(p, .5, 1)); tag('resucrage nécessaire', W * .62, H * .45, DGREEN, 14); BH.a1(); }
    },
    /* 9 hyperglycémie provoquée */
    function (p) {
      var O = { x: W * .12, y: H * .86 }, w = W * .54, h = H * .7, my = function (g) { return O.y - (g - .8) / 1.6 * h; }, xs = [O.x + w * .15, O.x + w * .85];
      ctx.fillStyle = 'rgba(226,75,74,.13)'; ctx.fillRect(O.x, my(2.4), w, my(2.0) - my(2.4)); ctx.fillStyle = 'rgba(226,150,40,.14)'; ctx.fillRect(O.x, my(2.0), w, my(1.4) - my(2.0));
      BH.axes(O.x, O.y, w + 8, h + 18, null, 'g/L'); TB('à jeun', xs[0], O.y + 16, GREY, 12); TB('2 h après 75 g', xs[1], O.y + 16, GREY, 12);
      TB('≥ 2,00 : diabète', O.x + w + 10, my(2.2) + 4, DRED, 12, 'left'); TB('1,40-1,99 : intolérance', O.x + w + 10, my(1.7) + 4, ORANGE, 12, 'left'); LN(O.x, my(1.26), xs[0] + 8, my(1.26), DRED, 1.5, [4, 3]); TB('1,26', O.x - 4, my(1.26) + 4, DRED, 12, 'right');
      [['A', .95, 1.00, GREEN, 'normal'], ['B', 1.30, 2.20, RED, 'diabète'], ['C', 1.05, 1.65, ORANGE, 'intolérance']].forEach(function (r, k) {
        LN(xs[0], my(r[1]), xs[1], my(r[2]), r[3], 3); DOT(xs[0], my(r[1]), 5, r[3]); DOT(xs[1], my(r[2]), 5, r[3]); TB(r[0], xs[0] - 12, my(r[1]) + 4, r[3], 14, 'right');
        if (p > 0) { BH.al(BH.ph(p, k * .25, k * .25 + .4)); TB(r[0] + ' : ' + r[4], xs[1] - 12, my(r[2]) + (k === 1 ? -14 : 22), r[3] === GREEN ? DGREEN : r[3] === RED ? DRED : r[3], 13, 'right'); BH.a1(); }
      });
    },
    /* 10 thyroïde */
    function (p) {
      var bx = [W * .08, W * .62], by = H * .3;
      BH.rr(bx[0], by, W * .28, H * .2, '#fbe9d6', ORANGE, 10, 2.4); TB('hypophyse', bx[0] + W * .14, by + H * .12, ORANGE, 14);
      BH.rr(bx[1], by, W * .28, H * .2, '#e3f4ec', DGREEN, 10, 2.4); TB('thyroïde', bx[1] + W * .14, by + H * .12, DGREEN, 14);
      arrow(bx[0] + W * .29, by + H * .07, W * .24, 0, BLUE, '', 3); TB('TSH', W * .5, by + H * .03, BLUE_D, 14);
      var yb = by + H * .38; LN(bx[1] + W * .14, by + H * .2, bx[1] + W * .14, yb, RED, 3, p > 0 ? [6, 5] : null); LN(bx[1] + W * .14, yb, bx[0] + W * .14, yb, RED, 3, p > 0 ? [6, 5] : null); LN(bx[0] + W * .14, yb, bx[0] + W * .14, by + H * .21, RED, 3, p > 0 ? [6, 5] : null);
      LN(bx[0] + W * .14 - 12, by + H * .22, bx[0] + W * .14 + 12, by + H * .22, RED, 4); TB('thyroxine', W * .5, yb + 17, DRED, 13); TB('frein (−)', W * .5, yb - 8, DRED, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); TB('thyroxine très basse', bx[1] + W * .14, by - 8, DRED, 13); BH.al(BH.ph(p, .4, 1)); TB('TSH ↑↑', W * .5, by - 16, BLUE_D, 18); BH.sol(p, 'frein supprimé → TSH élevée', W * .5, H * .93, DGREEN, 14); BH.a1(); }
    }
  ]);
})();
