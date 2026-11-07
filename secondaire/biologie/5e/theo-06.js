/* Biologie 5e · chapitre 6 : excrétion, reins et bilan hydrique */
(function () {
  var C = 'c06';

  /* néphron schématique : renvoie la liste de points du tubule (coordonnées canvas) */
  function nephron(x, y, w, h, hl) {
    var gx = x + w * .22, gy = y + h * .2, r = Math.min(w, h) * .13;
    var path = [[gx, gy + r], [gx, y + h * .55], [x + w * .12, y + h * .55], [x + w * .12, y + h * .88], [x + w * .5, y + h * .88], [x + w * .5, y + h * .35], [x + w * .72, y + h * .35], [x + w * .72, y + h * .95]];
    BH.poly(path, hl ? '#cfe3f8' : '#e3e7ed', 16); BH.poly(path, BLUE_D, 2, null);
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; BH.ci(gx, gy, r * 1.4, '#e6f1fb', BLUE_D, 2.4); BH.ci(gx, gy, r * .7, '#fbd9d8', RED, 2);
    return { gx: gx, gy: gy, r: r, path: path };
  }
  function along(path, s) {            /* point sur la polyligne, s dans [0,1] */
    var L = [], tot = 0, i; for (i = 1; i < path.length; i++) { var d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); L.push(d); tot += d; }
    var q = s * tot; for (i = 0; i < L.length; i++) { if (q <= L[i]) { var f = q / L[i]; return [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f]; } q -= L[i]; }
    return path[path.length - 1];
  }

  SFA.theo(C, {
    icon: function () {
      var n = nephron(W * .08, H * .06, W * .4, H * .8, true); TB('180 L → 1,5 L', W * .72, H * .4, BLUE_D, 26); TB('néphron', W * .72, H * .6, ORANGE, 20);
    },
    anim: function (t) {
      var n = nephron(W * .04, H * .08, W * .5, H * .74, true), N = 26;
      TB('Du filtrat à l’urine : l’eau est réabsorbée', W * .5, 16, BLUE_D, 14);
      TB('glomérule', n.gx + n.r * 1.7, n.gy - 6, BLUE_D, 12, 'left'); TB('tubule', W * .06, H * .86, BLUE_D, 12, 'left'); TB('urine', W * .04 + W * .5 * .72, H * .86, DRED, 12, 'center');
      for (var k = 0; k < N; k++) {
        var s = ((t * .0025 + k / N) % 1), type = k % 5, back = type < 4;   /* 4 sur 5 : eau/glucose réabsorbés */
        var pt = along(n.path, s), x = pt[0], y = pt[1];
        if (back && s > .35) { var f = Math.min(1, (s - .35) / .25); x += f * 26; y += f * 4; if (f >= 1) { x += 4; } }
        var col = type === 4 ? DRED : (type === 3 ? ORANGE : BLUE);
        if (back && s > .6) BH.al(Math.max(0, 1 - (s - .6) / .15)); DOT(x, y, type === 4 ? 4.2 : 3.4, col); BH.a1();
      }
      LN(W * .04 + W * .5 * .3 + 44, H * .08 + H * .74 * .34, W * .04 + W * .5 * .3 + 44, H * .08 + H * .74 * .9, '#fbd9d8', 6);
      TB('capillaire', W * .04 + W * .5 * .3 + 48, H * .5, DRED, 11, 'left');
      var x0 = W * .62; BH.rr(x0, H * .2, W * .34, 20, '#e3e7ed', null, 4); BH.rr(x0, H * .2, W * .34, 20, BLUE, null, 4); TB('filtrat : 180 L/jour', x0, H * .2 - 6, BLUE_D, 13, 'left');
      BH.rr(x0, H * .46, W * .34, 20, '#e3e7ed', null, 4); BH.rr(x0, H * .46, W * .34 * 1.5 / 180 * 6, 20, DRED, null, 4); TB('urine : 1 à 2 L/jour', x0, H * .46 - 6, DRED, 13, 'left');
      TB('> 99 % réabsorbé', x0, H * .7, DGREEN, 15, 'left'); DOT(x0 + 4, H * .8, 4, BLUE); TB('eau, glucose, sels', x0 + 12, H * .8 + 4, GREY, 11, 'left'); DOT(x0 + 4, H * .88, 4.2, DRED); TB('urée (déchets)', x0 + 12, H * .88 + 4, GREY, 11, 'left');
    },
    th:
      '<div class="tcard"><b class="h">Excrétion</b><p><b>Excréter</b>, c’est éliminer du milieu intérieur les <b>déchets du métabolisme</b> : <b>urée</b> (formée par le foie à partir des acides aminés, éliminée par les reins), CO₂ (poumons), un peu d’eau et de sels (sueur). À ne pas confondre avec la défécation (rejet de restes non digérés) : ceux-ci n’ont jamais été dans le milieu intérieur.</p></div>' +
      '<div class="tcard"><b class="h">Le néphron : filtration, réabsorption, sécrétion</b><p>Chaque rein contient environ un million de <b>néphrons</b>. 1) <b>Filtration</b> dans le glomérule (capsule de Bowman) : le plasma est filtré sous pression ; eau, glucose, urée et sels passent, mais pas les cellules ni les grosses protéines. <b>DFG ≈ 125 mL/min ≈ 180 L/jour.</b> 2) <b>Réabsorption</b> dans le tubule : plus de 99 % de l’eau, tout le glucose (sous le seuil), des sels retournent au sang. 3) <b>Sécrétion</b> : certains déchets (H⁺, médicaments) passent du sang au tubule. Résultat : <b>1 à 2 L d’urine par jour</b>.</p><p><b>Exemple :</b> 125 mL/min × 1 440 min = 180 L ; urine 1,5 L → (180 − 1,5) / 180 ≈ 99,2 % réabsorbé.</p></div>' +
      '<div class="tcard"><b class="h">Analyse d’urine et seuil rénal</b><p>Les transporteurs du glucose sont limités (<b>transport maximal Tm ≈ 225 mg/min</b>). Débit filtré = DFG × glycémie. Si ce débit dépasse Tm, le glucose en excès est excrété (<b>glycosurie</b>) : <b>seuil rénal = Tm / DFG ≈ 1,8 g/L</b>. <b>Bandelette urinaire :</b> glucose → hyperglycémie (diabète) ; protéines → filtre glomérulaire abîmé ; leucocytes et nitrites → infection urinaire ; sang → lésion.</p></div>' +
      '<div class="tcard"><b class="h">Bilan hydrique et ADH</b><p>Entrées d’eau (boissons, aliments, eau métabolique) = sorties (urine, sueur, selles, respiration). Le rein ajuste la sortie : l’<b>ADH</b> (hormone antidiurétique, libérée quand le sang est trop concentré ou le volume trop faible) rend le tubule collecteur perméable à l’eau : <b>urine plus concentrée et moins abondante</b>. Limite : le rein humain ne dépasse pas ≈ 1 200 mOsm/L, d’où un volume minimal d’urine = charge d’osmoles / concentration max. <b>Eau de mer</b> (≈ 1 000 mOsm/L) : la boire fait perdre plus d’eau qu’on n’en gagne.</p></div>' +
      '<div class="tcard"><b class="h">Dialyse et insuffisance rénale</b><p>Quand le DFG s’effondre, l’urée s’accumule (concentration à l’équilibre ∝ 1/DFG). L’<b>hémodialyse</b> épure le sang à travers une membrane : clairance K, durée t, volume d’eau corporelle V : <b>Kt/V</b> ; la concentration d’urée est multipliée par <b>e<sup>−Kt/V</sup></b>. Cible usuelle : Kt/V ≥ 1,2 par séance.</p><p><b>Exemple :</b> K = 210 mL/min, 4 h, V = 40 L : Kt/V = 0,21 × 240 / 40 = 1,26 ; baisse = 1 − e<sup>−1,26</sup> ≈ 72 %.</p></div>'
  });

  SFA.figs(C, [
    /* 1 étapes */
    function (p) {
      var n = nephron(W * .04, H * .06, W * .52, H * .84, p > 0);
      TB('glomérule + capsule', W * .04 + W * .52 * .22 + n.r * 1.8, n.gy - 8, BLUE_D, 12, 'left'); TB('tubule', W * .2, H * .96, BLUE_D, 12);
      BH.rr(W * .62, H * .1, W * .34, H * .26, '#e6f1fb', BLUE_D, 8, 1.6); TB('filtration', W * .79, H * .2, BLUE_D, 14); TB('glomérule', W * .79, H * .3, GREY, 12);
      BH.rr(W * .62, H * .4, W * .34, H * .26, '#e3f4ec', DGREEN, 8, 1.6); TB('réabsorption', W * .79, H * .5, DGREEN, 14); TB('tubule', W * .79, H * .6, GREY, 12);
      BH.rr(W * .62, H * .7, W * .34, H * .26, '#fdeaea', RED, 8, 1.6); TB('sécrétion', W * .79, H * .8, DRED, 14); TB('tubule', W * .79, H * .9, GREY, 12);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .4)); arrow(n.gx + 4, n.gy - n.r * 2.6, 0, n.r * 1.2, BLUE, '', 2.6); BH.al(BH.ph(p, .3, .7)); var a = n.path[3]; arrow(a[0] + 10, a[1] - 24, 30, 0, GREEN, '', 3); arrow(n.path[5][0] + 8, n.path[5][1] + 20, 26, 0, GREEN, '', 3);
        BH.al(BH.ph(p, .6, 1)); arrow(n.path[4][0] + 20, n.path[4][1] + 24, 0, -20, RED, '', 3); BH.a1();
      }
    },
    /* 2 excrétion */
    function (p) {
      [[W * .05, 'urée', 'reins', '#e6f1fb', BLUE_D, true], [W * .36, 'CO₂', 'poumons', '#e6f1fb', BLUE_D, true], [W * .67, 'restes non digérés', 'anus', '#fdeaea', RED, false]].forEach(function (c, i) {
        BH.rr(c[0], H * .18, W * .28, H * .5, c[3], c[4], 10, 2); TB(c[1], c[0] + W * .14, H * .3, c[4] === RED ? DRED : BLUE_D, 13);
        arrow(c[0] + W * .14, H * .36, 0, H * .12, c[4], '', 3); TB(c[2], c[0] + W * .14, H * .6, c[4] === RED ? DRED : BLUE_D, 14);
        if (p > 0) { BH.al(BH.ph(p, i * .2, i * .2 + .4)); TB(c[5] ? '✓ excrétion' : '✗ défécation', c[0] + W * .14, H * .84, c[5] ? DGREEN : DRED, 15); BH.a1(); }
      });
      TB('déchets du métabolisme éliminés du milieu intérieur', W * .5, H * .08, GREY, 13);
      if (p > 0) BH.sol(p, 'les restes non digérés ne sont pas des déchets du métabolisme', W * .5, H * .95, DGREEN, 12.5);
    },
    /* 3 filtrer 180 litres */
    function (p) {
      var x0 = W * .05, w = W * .9, y = H * .35; TB('DFG 125 mL/min × 1 440 min = 180 L/jour', W * .5, H * .12, BLUE_D, 15);
      BH.rr(x0, y, w, 38, '#cfe3f8', BLUE_D, 4, 2); TB('filtrat : 180 L', x0 + w / 2, y + 25, BLUE_D, 15);
      var fu = 1.5 / 180; if (p > 0) { BH.al(BH.ph(p, 0, .5)); BH.rr(x0, y + 54, w * (1 - fu), 30, '#cfeadf', DGREEN, 4, 2); BH.rr(x0 + w * (1 - fu), y + 54, Math.max(4, w * fu), 30, '#fbd9d8', RED, 2, 2); TB('réabsorbé : 178,5 L', x0 + w / 2, y + 74, DGREEN, 14); TB('urine : 1,5 L', x0 + w - 4, y + 104, DRED, 14, 'right'); BH.a1(); }
      else TB('1,5 L d’urine : quelle part est réabsorbée ?', W * .5, y + 74, GREY, 14);
      if (p > 0) BH.sol(p, '178,5 / 180 ≈ 99,2 % réabsorbé', W * .5, H * .88, DGREEN, 16);
    },
    /* 4 seuil rénal */
    function (p) {
      var O = { x: W * .14, y: H * .84 }, w = W * .78, h = H * .66, mx = function (g) { return O.x + g / 3 * w; }, my = function (v) { return O.y - v / 375 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, null, 'mg/min'); [1, 2, 3].forEach(function (g) { TB(g, mx(g), O.y + 14, GREY, 11); }); TB('glycémie (g/L)', O.x + w * .5, O.y + 30, GREY, 12);
      LN(O.x, my(225), O.x + w, my(225), RED, 1.6, [5, 4]); TB('Tm = 225', O.x + 6, my(225) - 6, DRED, 12, 'left');
      BH.fn(function (g) { return 125 * g; }, 0, 3, mx, my, BLUE, 3, 60); TB('filtré = 125 × glycémie', mx(.2), my(375) + 8, BLUE_D, 12, 'left');
      DOT(mx(1), my(125), 5, BLUE_D); TB('125 : tout réabsorbé', mx(1) + 6, my(125) + 18, BLUE_D, 12, 'left');
      if (p > 0) {
        BH.al(BH.ph(p, 0, .6)); ctx.fillStyle = 'rgba(226,75,74,.25)'; ctx.beginPath(); ctx.moveTo(mx(1.8), my(225)); ctx.lineTo(mx(2.4), my(300)); ctx.lineTo(mx(2.4), my(225)); ctx.fill();
        DOT(mx(2.4), my(300), 5, RED); TB('300 − 225 = 75 excrétés', mx(2.4) - 6, my(300) - 10, DRED, 12, 'right'); BH.al(BH.ph(p, .5, 1)); LN(mx(1.8), my(225), mx(1.8), O.y, DGREEN, 2, [4, 3]); TB('seuil 1,8 g/L', mx(1.8), O.y + 28, DGREEN, 13); BH.a1();
      }
    },
    /* 5 bilan de l'eau */
    function (p) {
      var by = H * .84, h = H * .62, sc = h / 3.4, bw = W * .17;
      BH.axes(W * .08, by, W * .86, h + 12, null, 'L/jour');
      var ent = [[1.5, '#cfe3f8', BLUE_D, 'boissons'], [.7, '#cfeadf', DGREEN, 'aliments'], [.3, '#fff3c9', ORANGE, 'métabolisme']];
      var y = by; ent.forEach(function (e) { BH.rr(W * .14, y - e[0] * sc, bw, e[0] * sc, e[1], e[2], 1, 1.6); y -= e[0] * sc; }); TB('entrées 2,5', W * .14 + bw / 2, by + 16, BLUE_D, 13);
      var sor = [[.5, '#fbd9d8', DRED, 'urine min'], [.1, '#e3e7ed', GREY, 'selles'], [2.0, '#cfe3f8', BLUE_D, 'sueur'], [.5, '#fff3c9', ORANGE, 'souffle, peau']];
      y = by; sor.forEach(function (e, i) { BH.al(p > 0 || i === 0 ? 1 : .35); BH.rr(W * .5, y - e[0] * sc, bw, e[0] * sc, e[1], e[2], 1, 1.6); BH.a1(); if (e[0] > .3) TB(e[3] + ' ' + BH.fx(e[0], 1), W * .5 + bw + 8, y - e[0] * sc / 2 + 4, e[2], 12, 'left'); y -= e[0] * sc; }); TB('sorties 3,1', W * .5 + bw / 2, by + 16, DRED, 13);
      LN(W * .1, by - 2.5 * sc, W * .5 + bw + 4, by - 2.5 * sc, GREEN, 1.6, [5, 4]); TB('2,5', W * .1 - 2, by - 2.5 * sc + 4, DGREEN, 12, 'right');
      if (p > 0) { BH.al(BH.ph(p, .3, 1)); BH.sol(p, 'déficit ≥ 3,1 − 2,5 = 0,6 L ≈ 0,9 % de 70 kg', W * .5, H * .96, DRED, 14); BH.a1(); }
      TB('jour d’effort', W * .5, H * .08, GREY, 13);
    },
    /* 6 bandelette */
    function (p) {
      var x0 = W * .08, y0 = H * .46; BH.rr(x0, y0 - 6, W * .56, 14, '#f5f1e6', GREY, 3, 1.6);
      var pads = [['glucose', '#7a5230', true], ['protéines', '#f3e9a3', false], ['leucocytes', '#f3dff7', false], ['nitrites', '#fbe4ee', false]];
      pads.forEach(function (d, i) { var x = x0 + 12 + i * W * .135; BH.rr(x, y0 - 8, W * .1, 18, p > 0 || i > 0 ? d[1] : '#eee', GREY, 2, 1.4); TB(d[0], x + W * .05, y0 - 18 - (i % 2) * 14, d[2] ? DRED : GREY, 12); TB(d[2] ? '++' : '−', x + W * .05, y0 + 30, d[2] ? DRED : GREY, 16); });
      TB('glycémie 2,4 g/L > seuil 1,8 g/L', W * .5, H * .12, ORANGE, 14);
      BH.rr(W * .72, H * .3, W * .24, H * .4, '#e6f1fb', BLUE_D, 8, 1.6); TB('plasma', W * .84, H * .38, BLUE_D, 12); TB('2,4 g/L', W * .84, H * .5, DRED, 15); TB('seuil 1,8', W * .84, H * .62, GREY, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); BH.sol(p, 'glycosurie : seuil rénal dépassé', W * .38, H * .72, DRED, 14); BH.al(BH.ph(p, .5, 1)); BH.sol(p, 'évoque un diabète (à confirmer)', W * .38, H * .84, DGREEN, 13); BH.a1(); }
    },
    /* 7 eau de mer */
    function (p) {
      TB('boit 1 L à 1 000 mOsm/L', W * .22, H * .12, BLUE_D, 13); BH.rr(W * .1, H * .2, W * .24, H * .5, '#cfe3f8', BLUE_D, 8, 2); TB('1 L', W * .22, H * .5, BLUE_D, 16);
      TB('+ 600 mOsm de déchets', W * .22, H * .8, ORANGE, 12);
      arrow(W * .37, H * .45, W * .12, 0, GREY, '', 3); TB('1 600 mOsm', W * .45, H * .36, DRED, 12); TB('à éliminer', W * .45, H * .5 + 14, GREY, 11);
      var vh = H * .5 * (p > 0 ? 1.33 * BH.ph(p, 0, .7) : .0);
      BH.rr(W * .56, H * .2, W * .24, H * .5, p > 0 ? '#fff' : '#fff', GREY, 8, 1.6); if (p > 0) { BH.rr(W * .56 + 2, H * .7 - vh * .75 - 2, W * .24 - 4, vh * .75, '#fbe4a0', ORANGE, 4, 1.6); TB('urine', W * .68, H * .5, DRED, 12); }
      TB('urine max : 1 200 mOsm/L', W * .68, H * .12, DRED, 13);
      if (p > 0) { BH.al(BH.ph(p, .3, 1)); TB('1 600 / 1 200 ≈ 1,33 L', W * .68, H * .8, DRED, 14); BH.sol(p, '1,33 L d’urine pour 1 L bu : − 0,33 L, déshydratation', W * .5, H * .95, DGREEN, 12.5); BH.a1(); }
    },
    /* 8 dialyse manquée */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .62, mx = function (d) { return O.x + d / 6 * w; }, my = function (c) { return O.y - (c - .2) / 2 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 'jours', 'urée (g/L)'); [.5, 1, 1.5].forEach(function (v) { TB(BH.fx(v, 1), O.x - 6, my(v) + 4, GREY, 11, 'right'); });
      var f = function (d) { return d < 2 ? .4 + .375 * d : d < 4 ? .4 + .375 * (d - 2) : .4 + .375 * (d - 4); };
      BH.poly([[mx(0), my(.4)], [mx(2), my(1.15)], [mx(2), my(.4)], [mx(4), my(1.15)]], BLUE, 3);
      arrow(mx(2), H * .1, 0, 18, GREEN, '', 2.4); TB('dialyse', mx(2) + 4, H * .09, DGREEN, 12, 'left'); arrow(mx(4), H * .1, 0, 18, GREEN, '', 2.4); TB('dialyse', mx(4) + 4, H * .09, DGREEN, 12, 'left');
      if (p > 0) { BH.al(BH.ph(p, 0, .7)); BH.poly([[mx(4), my(1.15)], [mx(4), my(.4)], [mx(6), my(1.15)]], RED, 3, [6, 4]); BH.poly([[mx(4), my(.4)], [mx(6), my(1.15)]], RED, 3.4); BH.a1(); }
      TB('15 g/j ÷ 40 L ≈ + 0,4 g/L par jour', W * .52, H * .24, INK, 13, 'left');
      if (p > 0) BH.sol(p, 'séance sautée : l’urée continue de monter (+ 0,4 g/L/j)', W * .5, H * .96, DRED, 13);
    },
    /* 9 Kt/V */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .62, mx = function (t) { return O.x + t / 360 * w; }, my = function (c) { return O.y - c / 1.5 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, null, 'urée (g/L)'); [0, 120, 240, 360].forEach(function (t) { TB(t, mx(t), O.y + 14, GREY, 11); }); TB('t (min)', O.x + w * .5, O.y + 30, GREY, 12); [.5, 1, 1.4].forEach(function (v) { TB(BH.fx(v, 1), O.x - 6, my(v) + 4, GREY, 11, 'right'); });
      var tau = 40000 / 210; BH.fn(function (t) { return 1.4 * Math.exp(-t / tau); }, 0, 360, mx, my, '#d7dde5', 2.4, 100); var f = p > 0 ? BH.ph(p, 0, .7) : 1; BH.fn(function (t) { return 1.4 * Math.exp(-t / tau); }, 0, 240 * f, mx, my, BLUE, 3.4, 100);
      TB('K = 0,7 × 300 = 210 mL/min · V = 40 L', W * .5, H * .1, INK, 13); TB('Kt/V = 0,21 × 240 / 40 = 1,26', W * .5, H * .19, BLUE_D, 14);
      DOT(mx(0), my(1.4), 5, BLUE_D); TB('1,40', mx(0) + 8, my(1.4) + 4, BLUE_D, 12, 'left'); LN(mx(240), my(0), mx(240), O.y, ORANGE, 1.6, [4, 3]);
      if (p > 0) { BH.al(BH.ph(p, .6, 1)); DOT(mx(240), my(.397), 6, DRED); TB('≈ 0,40 g/L (− 72 %)', mx(240) + 4, my(.397) - 16, DRED, 13, 'center'); BH.a1(); BH.sol(p, '(b) 200 mL/min : t = 1,2 × 40 / 0,14 ≈ 343 min = 5 h 43', W * .5, H * .96, DGREEN, 12.5); }
    },
    /* 10 DFG qui s'effondre */
    function (p) {
      var O = { x: W * .14, y: H * .84 }, w = W * .78, h = H * .62, mx = function (d) { return O.x + (140 - d) / 140 * w; }, my = function (c) { return O.y - c / 1.6 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, null, 'urée (g/L)'); TB('DFG (mL/min)', O.x + w * .5, O.y + 30, GREY, 12); [125, 90, 60, 30].forEach(function (d) { TB(d, mx(d), O.y + 14, GREY, 11); }); [.3, .6, 1.25].forEach(function (v) { TB(BH.fx(v, 2), O.x - 6, my(v) + 4, GREY, 11, 'right'); });
      BH.fn(function (d) { return 37.5 / d; }, 140, 25, mx, my, BLUE, 3.4, 100); TB('c = 37,5 / DFG', W * .6, H * .22, INK, 14);
      DOT(mx(125), my(.3), 6, BLUE_D); TB('0,30', mx(125) + 4, my(.3) - 12, BLUE_D, 13, 'left');
      if (p > 0) { BH.al(BH.ph(p, 0, .7)); DOT(mx(30), my(1.25), 6, DRED); LN(mx(30), my(1.25), mx(30), O.y, DRED, 1.4, [4, 3]); LN(O.x, my(1.25), mx(30), my(1.25), DRED, 1.4, [4, 3]); TB('1,25 g/L', mx(30) + 10, my(1.25) - 8, DRED, 14, 'left'); BH.a1(); BH.sol(p, '0,30 × 125 / 30 = 1,25 g/L', W * .5, H * .96, DGREEN, 14); }
      else TB('?', mx(30), my(1.0), GREY, 28);
    }
  ]);
})();
