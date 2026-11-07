/* Biologie 5e · chapitre 2 : synapse, réflexe et intégration nerveuse */
(function () {
  var C = 'c02';

  /* synapse schématique : x0..x1 largeur, yc = milieu de la fente ; renvoie des repères */
  function syn(x0, x1, yt, yc, yb, nv, vesicOut) {
    var gap = 16, m = { x0: x0, x1: x1, yPre: yc - gap / 2, yPost: yc + gap / 2 };
    BH.rr(x0, yt, x1 - x0, m.yPre - yt, '#e6f1fb', BLUE_D, 18, 2.4);
    BH.rr(x0, m.yPost, x1 - x0, yb - m.yPost, '#eef7f1', DGREEN, 18, 2.4);
    for (var i = 0; i < nv; i++) { var vx = x0 + (x1 - x0) * (.16 + .68 * i / Math.max(1, nv - 1)), vy = m.yPre - 22 - (i % 2) * 10; BH.ci(vx, vy, 7, '#fff3c9', ORANGE, 1.6); if (!vesicOut) DOT(vx, vy, 2.4, ORANGE); }
    for (i = 0; i < 5; i++) { var rx = x0 + (x1 - x0) * (.2 + .6 * i / 4); BH.rr(rx - 6, m.yPost - 1, 12, 8, '#fff', DGREEN, 2, 1.6); }
    return m;
  }

  SFA.theo(C, {
    icon: function () {
      var m = syn(W * .22, W * .78, H * .08, H * .48, H * .78, 4);
      for (var k = 0; k < 7; k++) DOT(W * (.3 + k * .06), H * .48 + ((k * 5) % 3 - 1) * 3, 3.6, ORA2);
      TB('synapse', W * .5, H * .93, BLUE_D, 22);
    },
    anim: function (t) {
      var u = (t % 360) / 360, x0 = W * .16, x1 = W * .62, yt = H * .12, yc = H * .5, yb = H * .9;
      var m = syn(x0, x1, yt, yc, yb, 6, true);
      TB('Transmission synaptique chimique', W * .5, 16, BLUE_D, 14);
      var ph = u < .15 ? 'un potentiel d’action arrive' : u < .3 ? 'les vésicules fusionnent avec la membrane' : u < .65 ? 'le neurotransmetteur diffuse dans la fente' : 'il se fixe sur les récepteurs : PPSE';
      TB(ph, W * .5, H * .97, DRED, 13);
      /* PA dans la terminaison */
      if (u < .2) { var ya = yt + (m.yPre - yt) * u / .2; BH.al(1 - u / .25); ctx.fillStyle = 'rgba(226,75,74,.55)'; ctx.fillRect(x0 + 6, ya - 8, x1 - x0 - 12, 16); BH.a1(); TB('PA', W * .5, ya + 5, '#fff', 13); }
      var s = BH.ph(u, .15, .3), d = BH.ph(u, .3, .65), b = BH.ph(u, .65, .8);
      for (var i = 0; i < 6; i++) {
        var vx = x0 + (x1 - x0) * (.16 + .68 * i / 5), vy0 = m.yPre - 22 - (i % 2) * 10;
        if (u < .15) { BH.ci(vx, vy0, 7, '#fff3c9', ORANGE, 1.6); DOT(vx, vy0, 2.4, ORANGE); }
        else if (u < .3) { var yy = vy0 + (m.yPre - 6 - vy0) * s; BH.ci(vx, yy, 7, '#fff3c9', ORANGE, 1.6); DOT(vx, yy, 2.4, ORANGE); }
        if (u >= .3) {
          var n = 3; for (var k = 0; k < n; k++) {
            var tx = x0 + (x1 - x0) * (.2 + .6 * ((i + k * 2) % 5) / 4) + (k - 1) * 9, ty = m.yPost - 4;
            var px = vx + (tx - vx) * d + Math.sin(i * 3 + k + u * 40) * 5 * (1 - d), py = m.yPre - 6 + (ty - (m.yPre - 6)) * d;
            if (b > 0 && (i + k) % 2 === 0) { px = tx; py = ty - 4; } DOT(px, py, 3.6, ORA2);
          }
        }
      }
      if (b > 0) { BH.al(Math.sin(b * Math.PI)); ctx.fillStyle = 'rgba(29,158,117,.35)'; ctx.fillRect(x0 + 6, m.yPost + 8, x1 - x0 - 12, 26); BH.a1(); }
      TB('neurone présynaptique', x1 + 8, yt + 28, BLUE_D, 12, 'left'); TB('fente synaptique', x1 + 8, yc + 4, GREY, 12, 'left'); TB('neurone postsynaptique', x1 + 8, yb - 20, DGREEN, 12, 'left');
      TB('vésicules', x0 + 8, yt + 14, ORANGE, 12, 'left'); TB('récepteurs', x0 + 8, yb - 6, DGREEN, 12, 'left');
    },
    th:
      '<div class="tcard"><b class="h">La synapse chimique</b><p>Les neurones ne se touchent pas : la <b>fente synaptique</b> (≈ 20 nm) sépare la terminaison <b>présynaptique</b> du neurone <b>postsynaptique</b>. Séquence : un PA arrive → entrée de Ca²⁺ → les <b>vésicules</b> libèrent le <b>neurotransmetteur</b> (exocytose) → il diffuse dans la fente → il se fixe sur des <b>récepteurs</b> de la membrane postsynaptique → des canaux ioniques s’ouvrent. Ensuite le neurotransmetteur est dégradé par une enzyme ou recapté. La transmission est <b>unidirectionnelle</b> (pré → post). Exemple : l’acétylcholine à la jonction neuromusculaire.</p></div>' +
      '<div class="tcard"><b class="h">Intégration : PPSE, PPSI et sommation</b><p>Une synapse <b>excitatrice</b> provoque un potentiel postsynaptique excitateur (PPSE, dépolarisation, par ex. +2 mV) ; une synapse <b>inhibitrice</b> un PPSI (hyperpolarisation, −2 mV). Le neurone postsynaptique <b>additionne</b> tout : <b>sommation spatiale</b> (plusieurs synapses en même temps) et <b>sommation temporelle</b> (messages rapprochés dans le temps, avant que la dépolarisation ne s’efface). Un PA naît si le potentiel atteint le <b>seuil (−55 mV)</b>.</p><p><b>Exemple :</b> repos −70 mV, seuil −55 mV : il faut +15 mV, soit ⌈15 / 2⌉ = 8 synapses excitatrices ; avec 3 inhibitrices actives (−6 mV), il en faut 11.</p></div>' +
      '<div class="tcard"><b class="h">Arc réflexe et acte volontaire</b><p>Arc réflexe : <b>récepteur → neurone sensitif → centre nerveux (moelle épinière) → neurone moteur → effecteur (muscle)</b>. Le message entre par la racine dorsale et sort par la racine ventrale. Le réflexe est <b>involontaire, rapide, stéréotypé</b> : il court-circuite l’encéphale. Un acte volontaire passe par le cortex : trajet plus long, plus de synapses et un temps d’intégration (≈ 100 ms).</p><p><b>Durée = Σ (d / v) + nombre de synapses × 1 ms.</b> Ex. : 1,8 m à 50 m/s = 36 ms ; + 2 synapses = <b>38 ms</b>.</p></div>' +
      '<div class="tcard"><b class="h">Substances et synapses</b><p>Beaucoup de médicaments et de drogues agissent sur la synapse : le <b>curare</b> bloque les récepteurs de l’acétylcholine (muscle paralysé alors que le nerf conduit) ; les <b>insecticides organophosphorés</b> inhibent l’enzyme qui dégrade l’acétylcholine (neurotransmetteur accumulé : contractions puis paralysie) ; la <b>cocaïne</b> bloque la recapture de la dopamine ; la <b>nicotine</b> imite l’acétylcholine. <b>Piège :</b> le potentiel d’action ne « saute » pas la fente : le message y est chimique.</p></div>'
  });

  SFA.figs(C, [
    /* 1 arc réflexe */
    function (p) {
      var y = H * .5, xs = [W * .1, W * .27, W * .5, W * .73, W * .9], names = [['récepteur'], ['neurone', 'sensitif'], ['moelle', 'épinière'], ['neurone', 'moteur'], ['muscle']];
      BH.rr(W * .4, H * .26, W * .2, H * .48, p > 0 ? '#e3f4ec' : '#eef1f5', p > 0 ? DGREEN : GREY, 18, 2.4);
      for (var i = 0; i < 4; i++) { var c = i < 2 ? BLUE_D : DRED; arrow(xs[i] + 16, y, xs[i + 1] - xs[i] - 38, 0, i < 2 ? BLUE : RED, '', 3); }
      DOT(xs[0], y, 12, '#fdece4'); BH.ci(xs[0], y, 12, '#fdece4', ORA2, 2.4); BH.rr(xs[4] - 22, y - 14, 44, 28, '#fff3c9', ORANGE, 10, 2.4);
      BH.ci(xs[2], y, 12, '#e6f1fb', BLUE_D, 2.4);
      names.forEach(function (n, i) { n.forEach(function (ln, k) { TB(ln, xs[i], y + 46 + k * 15, i === 2 ? DGREEN : INK, 12.5); }); BH.al(p > 0 ? BH.ph(p, i * .15, i * .15 + .3) : 1); if (p > 0) { BH.ci(xs[i], y - 52, 11, DGREEN, null); TB(i + 1, xs[i], y - 47, '#fff', 13); } BH.a1(); });
      TB('réflexe rotulien : centre nerveux = moelle épinière', W * .5, H * .94, p > 0 ? DGREEN : GREY, 13); TB('(racine dorsale)', xs[2] - 70, H * .2, BLUE_D, 11); TB('(racine ventrale)', xs[2] + 70, H * .2, DRED, 11);
    },
    /* 2 que traverse le message */
    function (p) {
      var m = syn(W * .08, W * .66, H * .08, H * .46, H * .86, 5, false);
      TB('présynaptique', W * .68, H * .16, BLUE_D, 12, 'left'); TB('postsynaptique', W * .68, H * .8, DGREEN, 12, 'left'); TB('fente', W * .68, H * .47, GREY, 12, 'left');
      var f = BH.ph(p, 0, .7);
      for (var i = 0; i < 9; i++) { var x = W * (.14 + .06 * i), y = m.yPre - 6 + (m.yPost - m.yPre + 4) * (p > 0 ? f : 0); if (p > 0 || i < 5) DOT(x, p > 0 ? y : m.yPre - 14, 4, ORA2); }
      if (p > 0) { BH.al(BH.ph(p, .5, 1)); for (i = 0; i < 5; i++) arrow(W * (.16 + i * .11), m.yPre - 38, 0, 26, ORA2, '', 1.6); BH.a1(); BH.sol(p, 'neurotransmetteur : pré → post (chimique)', W * .5, H * .96, DGREEN, 13); }
    },
    /* 3 combien de synapses */
    function (p) {
      var O = { x: W * .12, y: H * .86 }, h = H * .66, my = function (v) { return O.y - (v + 70) / 20 * h; };
      BH.axes(O.x, O.y, W * .8, h + 20, null, 'V (mV)');
      LN(O.x, my(-55), O.x + W * .78, my(-55), RED, 1.6, [5, 4]); TB('seuil −55', O.x - 4, my(-55) - 6, DRED, 12, 'left'); TB('repos −70', O.x + 6, my(-70) + 15, BLUE_D, 12, 'left');
      var n = 8, bw = W * .06;
      for (var i = 0; i < n; i++) { var x = O.x + 24 + i * bw, v0 = -70 + 2 * i; if (p > 0 || i < 4) { BH.al(p > 0 ? BH.ph(p, i * .06, i * .06 + .2) : 1); BH.rr(x, my(v0 + 2), bw - 4, my(v0) - my(v0 + 2), '#cfeadf', DGREEN, 1, 1.4); BH.a1(); } }
      TB('+2 mV par synapse', W * .72, my(-68) - 2, DGREEN, 12);
      if (p > 0) { BH.al(BH.ph(p, .5, 1)); TB('(a) 8 × 2 = 16 mV > 15 mV', W * .6, H * .2, DGREEN, 14); TB('→ 8 synapses excitatrices', W * .6, H * .28, DGREEN, 13);
        BH.a1();
        tag('(b) + 3 inhibitrices (−6 mV) → 11 synapses', W * .56, H * .96, DRED, 13); }
    },
    /* 4 durée d'un réflexe de retrait */
    function (p) {
      var xs = [W * .1, W * .5, W * .9], y = H * .35;
      LN(xs[0], y, xs[2], y, AX, 8); BH.ci(xs[0], y, 14, '#fdece4', ORA2, 2.4); BH.ci(xs[1], y, 16, '#e6f1fb', BLUE_D, 2.4); BH.rr(xs[2] - 18, y - 12, 36, 24, '#fff3c9', ORANGE, 8, 2.4);
      TB('pied', xs[0], y - 24, ORA2, 13); TB('moelle', xs[1], y - 28, BLUE_D, 13); TB('muscle', xs[2], y - 24, ORANGE, 13);
      TB('0,9 m', (xs[0] + xs[1]) / 2, y + 26, GREY, 13); TB('0,9 m', (xs[1] + xs[2]) / 2, y + 26, GREY, 13); TB('v = 50 m/s', W * .5, y + 46, GREY, 13);
      DOT(xs[0] + (xs[2] - xs[0]) * Math.min(1, p * 1.2), y, 8, RED);
      var bx = W * .08, bw = W * .84, by = H * .66, sc = bw / 38;
      TB('durée du réflexe', bx, by - 12, GREY, 12, 'left');
      var seg = [[18, 'conduction 18 ms', '#cfe3f8', BLUE_D], [1, '', '#fff3c9', ORANGE], [18, '18 ms', '#cfe3f8', BLUE_D], [1, '', '#fff3c9', ORANGE]], x = bx;
      var q = BH.ph(p, 0, .8) * 38; seg.forEach(function (s, i) { var wv = Math.max(0, Math.min(s[0], q - (x - bx) / sc)); if (wv > 0) BH.rr(x, by, wv * sc, 26, s[2], s[3], 3, 1.5); x += s[0] * sc; });
      TB('0,9 / 50', bx + 9 * sc, by + 17, BLUE_D, 12); TB('0,9 / 50', bx + 28 * sc, by + 17, BLUE_D, 12);
      if (p > 0) { BH.sol(p, '2 × 18 ms + 2 × 1 ms (synapses) = 38 ms', W * .5, H * .92, DGREEN, 14); TB('1 ms', bx + 18.5 * sc, by + 44, ORANGE, 12); TB('1 ms', bx + 37.5 * sc, by + 44, ORANGE, 12); }
    },
    /* 5 réflexe ou volontaire */
    function (p) {
      var bx = W * .06, bw = W * .88, sc = bw / 150, y1 = H * .3, y2 = H * .62;
      TB('réflexe de retrait', bx, y1 - 16, DGREEN, 14, 'left'); BH.rr(bx, y1, 25 * sc, 28, '#cfeadf', DGREEN, 3, 1.8); TB('25 ms', bx + 25 * sc + 8, y1 + 19, DGREEN, 14, 'left');
      TB('action volontaire', bx, y2 - 16, BLUE_D, 14, 'left');
      var parts = [[40, '#cfe3f8', BLUE_D, ''], [5, '#fff3c9', ORANGE, ''], [100, '#f7d9d8', DRED, 'intégration corticale 100 ms']], x = bx, q = p > 0 ? BH.ph(p, 0, .6) * 145 : 145;
      parts.forEach(function (s, i) { var wv = Math.max(0, Math.min(s[0], q - (x - bx) / sc)); if (wv > 0) BH.rr(x, y2, wv * sc, 28, s[1], s[2], 3, 1.8); x += s[0] * sc; });
      TB('conduction 2,4 m : 40', bx + 2, y2 + 46, BLUE_D, 12, 'left'); TB('5 syn. : 5', bx + 52 * sc, y2 + 62, ORANGE, 12, 'left'); TB('intégration : 100 ms', bx + 95 * sc, y2 + 19, DRED, 13);
      if (p > .3) { BH.sol(p, '145 ms ≈ 5,8 × le réflexe · intégration ≈ 69 %', W * .5, H * .95, DGREEN, 14); }
    },
    /* 6 règle qui tombe */
    function (p) {
      var xr = W * .5, sc = H * .4 / 30, yh = H * .45, fall = 20 * sc * Math.min(1, p * 1.5), yb = yh + fall;
      BH.rr(xr - 14, yb - 30 * sc, 28, 30 * sc, '#fff3c9', ORANGE, 3, 2);
      for (var c = 0; c <= 30; c += 2) { LN(xr - 14, yb - c * sc, xr - 14 + (c % 10 === 0 ? 13 : 7), yb - c * sc, ORANGE, 1.2); if (c % 10 === 0) TB(c, xr + 4, yb - c * sc + 4, ORANGE, 11, 'left'); }
      LN(xr - 62, yh, xr - 18, yh, BLUE_D, 5); LN(xr + 18, yh, xr + 62, yh, BLUE_D, 5);
      TB('doigts', xr - 66, yh + 5, BLUE_D, 12, 'right');
      TB('chute de 20 cm', W * .08, H * .3, GREY, 13, 'left'); arrow(W * .14, yh - 20 * sc, 0, 20 * sc, GREY, '', 2);
      TB('d = ½ g t²', W * .68, H * .3, INK, 15, 'left'); TB('t = √(2d / g)', W * .68, H * .3 + 24, INK, 15, 'left');
      if (p > .4) { BH.sol(p, 't = √(2 × 0,20 / 9,81)', W * .76, H * .62, DGREEN, 14); BH.sol(p, '≈ 0,20 s', W * .76, H * .72, DGREEN, 16); }
    },
    /* 7 insecticide et acétylcholine */
    function (p) {
      var m = syn(W * .08, W * .62, H * .08, H * .44, H * .8, 4, false), n = p > 0 ? 6 + Math.round(18 * BH.ph(p, 0, .8)) : 5;
      for (var i = 0; i < n; i++) DOT(W * (.12 + (i * 37 % 46) / 100) + 0, m.yPre + 1 + ((i * 7) % 3) * 4 + 3, 3.5, ORA2);
      var ex = W * .8, ey = m.yPre + 8; BH.rr(ex - 16, ey - 12, 32, 24, '#f3dff7', VIOLET, 6, 2); LN(ex - 20, ey - 16, ex + 20, ey + 16, RED, 4); LN(ex + 20, ey - 16, ex - 20, ey + 16, RED, 4);
      TB('organophosphoré', ex, ey - 28, RED, 12); TB('enzyme inhibée', ex, ey + 38, VIOLET, 12); TB('ACh en excès', W * .35, H * .58, ORA2, 13); TB('muscle', W * .35, H * .73, DGREEN, 13);
      if (p > 0) { BH.sol(p, 'ACh non dégradée : récepteurs activés en continu', W * .5, H * .93, DGREEN, 13); BH.al(BH.ph(p, .4, 1)); tag('contraction prolongée → paralysie', W * .5, H * .86, DRED, 13); BH.a1(); }
    },
    /* 8 curare */
    function (p) {
      var y = H * .42; LN(W * .08, y, W * .55, y, AX, 7); BH.rr(W * .62, y - 28, W * .3, 56, '#fff3c9', ORANGE, 14, 2.4);
      TB('nerf moteur', W * .3, y - 20, BLUE_D, 13); TB('muscle', W * .77, y - 4, ORANGE, 14); TB('synapse', W * .585, y + 46, VIOLET, 13);
      BH.ci(W * .585, y, 11, '#f3dff7', VIOLET, 2.4); arrow(W * .14, y - 52, 0, 34, ORANGE, '', 2.6); TB('stimulation 1', W * .14, y - 58, ORANGE, 12);
      arrow(W * .8, y - 62, 0, 28, ORANGE, '', 2.6); TB('stimulation 2', W * .8, y - 68, ORANGE, 12);
      TB('PA ✓', W * .38, y + 28, DGREEN, 14);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .4)); LN(W * .585 - 12, y - 12, W * .585 + 12, y + 12, RED, 4); LN(W * .585 + 12, y - 12, W * .585 - 12, y + 12, RED, 4); TB('curare', W * .585, y - 36, RED, 13); BH.a1();
        BH.al(BH.ph(p, .3, .7)); TB('stimulation 1 : pas de contraction ✗', W * .5, H * .78, DRED, 13); BH.al(BH.ph(p, .6, 1)); TB('stimulation 2 : contraction ✓', W * .5, H * .86, DGREEN, 13); BH.a1();
        BH.sol(p, 'curare : bloque la synapse neuromusculaire', W * .5, H * .96, DGREEN, 13);
      } else { TB('?', W * .585, y + 5, VIOLET, 18); }
    },
    /* 9 fréquence minimale de décharge */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .6, tmax = 40, sc = h / 18, T = 7.6, tau = 10, a = 8;
      var mx = function (t) { return O.x + t / tmax * w; }, my = function (v) { return O.y - v * sc; };
      BH.axes(O.x, O.y, w + 6, h + 24, 't (ms)', 'V − V repos (mV)');
      var e = Math.exp(-T / tau), pts = [], v0 = a * e / (1 - e);
      for (var t = 0; t <= tmax; t += .2) { var k = Math.floor(t / T), tl = t - k * T, vv = (v0 + a) * Math.exp(-tl / tau); if (tl < .2 && k > 0) pts.push([mx(t - .001), my((v0 + a) * Math.exp(-T / tau))]); pts.push([mx(t), my(vv)]); }
      LN(O.x, my(15), O.x + w, my(15), RED, 1.6, [5, 4]); TB('seuil +15 mV', O.x + w, my(15) - 6, DRED, 12, 'right');
      var f = p > 0 ? BH.ph(p, 0, .8) : 1; var np = Math.floor(pts.length * f); B2(pts.slice(0, np));
      function B2(q) { if (q.length > 1) BH.poly(q, BLUE_D, 2.6); }
      for (var k2 = 0; k2 * T < tmax; k2++) { arrow(mx(k2 * T), O.y + 4, 0, -14, ORANGE, '', 2); }
      TB('↑ salves de +8 mV', O.x + 4, O.y + 18, ORANGE, 12, 'left');
      if (p > 0.5) { BH.sol(p, 'pic = 8 / (1 − e^(−T/10)) = 15 → T ≈ 7,6 ms', W * .56, H * .2, DGREEN, 13); BH.sol(p, 'f ≈ 131 Hz', W * .62, H * .95, DGREEN, 14); }
    },
    /* 10 section racine sensitive */
    function (p) {
      var cx = W * .3, cy = H * .52;
      ctx.fillStyle = '#e9edf2'; ctx.beginPath(); ctx.ellipse(cx, cy, W * .15, H * .3, 0, 0, 7); ctx.fill(); ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#cfd6df'; ctx.beginPath(); ctx.ellipse(cx - 16, cy - 16, 14, 24, -.4, 0, 7); ctx.ellipse(cx + 16, cy - 16, 14, 24, .4, 0, 7); ctx.ellipse(cx - 18, cy + 22, 20, 15, .3, 0, 7); ctx.ellipse(cx + 18, cy + 22, 20, 15, -.3, 0, 7); ctx.fill();
      LN(cx - 10, cy - H * .28, cx - 30, H * .12, BLUE, 4); LN(cx + 10, cy + H * .28, cx + 30, H * .9, RED, 4);
      TB('racine dorsale (sensitive)', cx - 6, H * .06, BLUE_D, 12, 'left'); TB('racine ventrale (motrice)', cx + 46, H * .94, DRED, 12, 'left');
      var xx = cx - 24, yy = H * .2; LN(xx - 11, yy - 11, xx + 11, yy + 11, DRED, 4); LN(xx + 11, yy - 11, xx - 11, yy + 11, DRED, 4);
      BH.rr(W * .62, H * .16, W * .32, H * .12, '#fff3c9', ORANGE, 8, 2); TB('quadriceps', W * .78, H * .16 + 24, ORANGE, 13);
      arrow(cx + 32, H * .86, W * .78 - cx - 30, -H * .52, RED, '', 2, [5, 4]);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); tag('réflexe rotulien : aboli', W * .78, H * .5, DRED, 13); BH.al(BH.ph(p, .4, 1)); tag('contraction volontaire :', W * .78, H * .64, DGREEN, 13); tag('conservée', W * .78, H * .74, DGREEN, 13); BH.a1(); }
    }
  ]);
})();
