/* Biologie 5e · chapitre 5 : défenses de l'organisme et immunité */
(function () {
  var C = 'c05';

  function ab(x, y, s, col) { LN(x, y, x, y + s, col, 2.4); LN(x, y, x - s * .6, y - s * .6, col, 2.4); LN(x, y, x + s * .6, y - s * .6, col, 2.4); }   /* anticorps en Y */
  function bact(x, y, s, col, a) { ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0); BH.rr(-s, -s * .45, s * 2, s * .9, col || ORANGE, null, s * .45); ctx.restore(); }
  function macro(x, y, r) { ctx.fillStyle = '#e6f1fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); for (var i = 0; i <= 24; i++) { var a = i / 24 * 2 * Math.PI, rr = r * (1 + .1 * Math.sin(a * 5 + 1)); i ? ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)) : ctx.moveTo(x + rr, y); } ctx.closePath(); ctx.fill(); ctx.stroke(); BH.ci(x + r * .15, y, r * .3, '#cfe3f8', BLUE_D, 1.6); }

  SFA.theo(C, {
    icon: function () {
      macro(W * .3, H * .45, 40); bact(W * .46, H * .4, 12, ORANGE, .4); bact(W * .5, H * .55, 12, ORANGE, -.5);
      ab(W * .72, H * .4, 26, RED); ab(W * .84, H * .5, 26, RED); ab(W * .66, H * .6, 26, RED);
      TB('défenses', W * .5, H * .85, BLUE_D, 24);
    },
    anim: function (t) {
      var u = (t % 540) / 540, tmax = 14, gx = W * .1, gw = W * .84, gb = H * .92, gt = H * .56, day = u * tmax;
      TB('Immunité innée : tout de suite · adaptative : plus tard, avec mémoire', W * .5, 16, BLUE_D, 13);
      /* scène */
      macro(W * .28, H * .3, 34);
      for (var i = 0; i < 5; i++) { var ph = ((t * .012 + i * .2) % 1), x = W * .72 - ph * W * .36 - 10, y = H * .2 + (i % 3) * 18 + Math.sin(i * 2 + t * .05) * 3; if (x > W * .28 + 24) bact(x, y, 9, ORANGE, Math.sin(i + t * .03)); else BH.ci(W * .28 + 4, H * .3 + (i - 2) * 6, 3, ORANGE); }
      TB('macrophage', W * .28, H * .3 + 52, BLUE_D, 12); TB('bactéries', W * .6, H * .46, ORANGE, 12);
      if (day > 7) { for (i = 0; i < 4; i++) ab(W * .8 + (i % 2) * 18, H * .24 + (i > 1 ? 24 : 0) + Math.sin(t * .1 + i) * 2, 12, RED); TB('anticorps', W * .86, H * .43, DRED, 12); }
      /* courbes */
      BH.axes(gx, gb, gw + 6, gb - gt + 12, 'jours', null);
      var inn = function (d) { return d < 0 ? 0 : 30 * (1 - Math.exp(-d / .8)); }, ad = function (d) { return d < 5 ? 0 : 100 * (1 - Math.exp(-(d - 5) / 3)); };
      var mx = function (d) { return gx + d / tmax * gw; }, my = function (v) { return gb - v / 110 * (gb - gt); };
      BH.fn(inn, 0, day, mx, my, BLUE, 3.2, 100); BH.fn(ad, 0, day, mx, my, RED, 3.2, 100);
      TB('innée (immédiate, peu spécifique)', gx + 8, my(46), BLUE_D, 12, 'left'); TB('adaptative (≈ 7 j, spécifique, mémoire)', gx + gw, my(104), DRED, 12, 'right');
      LN(mx(day), gb, mx(day), gt - 6, GREY, 1, [3, 3]); TB('j ' + Math.floor(day), mx(day), gb + 14, GREY, 11);
    },
    th:
      '<div class="tcard"><b class="h">Barrières et immunité innée</b><p>Première ligne : <b>peau</b>, <b>muqueuses</b>, mucus, larmes, acidité de l’estomac. Si l’agent pathogène franchit la barrière, l’<b>immunité innée</b> réagit en minutes ou en heures, de façon <b>non spécifique</b> : <b>phagocytose</b> (macrophages, neutrophiles englobent et digèrent) et <b>inflammation</b> (vasodilatation, afflux de phagocytes ; rougeur, chaleur, gonflement, douleur). Elle contient l’infection pendant que l’adaptative se met en route.</p></div>' +
      '<div class="tcard"><b class="h">Immunité adaptative et mémoire</b><p>Un <b>antigène</b> (molécule étrangère) active les <b>lymphocytes</b> qui le reconnaissent (sélection clonale). Les <b>lymphocytes B</b> deviennent des plasmocytes qui sécrètent des <b>anticorps</b> spécifiques (immunité humorale). Les <b>lymphocytes T cytotoxiques</b> détruisent les cellules infectées (immunité cellulaire), aidés par les lymphocytes T auxiliaires (LT4). La réponse <b>primaire</b> apparaît après ≈ 7 jours ; des <b>cellules mémoire</b> persistent : lors d’un second contact, la réponse <b>secondaire</b> est plus rapide (≈ 2 jours) et bien plus intense (× 50 dans l’exemple de l’exercice).</p></div>' +
      '<div class="tcard"><b class="h">Vaccin et sérum</b><p><b>Vaccin</b> : antigène inoffensif (atténué, inactivé, fragment, ARNm) → l’organisme fabrique lui-même anticorps et cellules mémoire : protection <b>préventive, retardée et durable</b> (rappels parfois nécessaires). <b>Sérum</b> (sérothérapie) : anticorps tout faits, protection <b>immédiate mais brève</b> (demi-vie ≈ 7 jours, puis ils disparaissent) ; utile en urgence (tétanos, venin). Exemple : plaie au clou rouillé chez un non-vacciné → sérum <i>et</i> vaccin.</p></div>' +
      '<div class="tcard"><b class="h">VIH et immunité collective</b><p>Le <b>VIH</b> infecte les lymphocytes T4 (CD4) : leur nombre diminue, le système immunitaire s’effondre (<b>SIDA</b> si CD4 < 200/µL). Les <b>antirétroviraux</b> bloquent la multiplication du virus : charge virale indétectable, CD4 remontés, et risque de transmission quasi nul, mais le virus n’est pas éliminé. <b>Immunité collective :</b> si assez de personnes sont immunisées, l’épidémie s’éteint. Seuil = <b>1 − 1/R₀</b> ; R effectif = R₀ × (part de sensibles).</p><p><b>Exemple :</b> R₀ = 12 → 1 − 1/12 = 91,7 % ; R₀ = 1,5 → 33 %.</p></div>' +
      '<div class="tcard"><b class="h">Pièges</b><p>Un anticorps est <b>spécifique</b> d’un antigène ; la phagocytose ne l’est pas. Un sérum ne donne pas de mémoire. L’efficacité d’un vaccin (par ex. 97 %) n’est pas la couverture : part immunisée = couverture × efficacité. Séropositif ≠ SIDA.</p></div>'
  });

  SFA.figs(C, [
    /* 1 innée ou adaptative */
    function (p) {
      var items = [['peau', 0], ['phagocytose', 0], ['inflammation', 0], ['mucus', 0], ['anticorps', 1], ['LT cytotoxiques', 1], ['cellules mémoire', 1]];
      var sc = [[.2, .3], [.5, .22], [.3, .78], [.7, .55], [.22, .56], [.68, .84], [.45, .46]];
      var f = BH.ph(p, 0, .6), ci = 0, ca = 0;
      BH.al(BH.ph(p, 0, .5)); BH.rr(W * .03, H * .1, W * .45, H * .86, '#e6f1fb', BLUE, 10, 1.6); BH.rr(W * .52, H * .1, W * .45, H * .86, '#fdeaea', RED, 10, 1.6); BH.a1();
      TB(p > 0 ? 'innée' : 'innée ou adaptative ?', W * (p > 0 ? .255 : .5), H * .06, BLUE_D, 14); if (p > 0) TB('adaptative', W * .745, H * .06, DRED, 14);
      items.forEach(function (it, i) {
        var tx = it[1] ? W * .745 : W * .255, ty = H * (.2 + (it[1] ? ca++ : ci++) * .2), x = sc[i][0] * W + (tx - sc[i][0] * W) * f, y = sc[i][1] * H + (ty - sc[i][1] * H) * f;
        var col = p > 0 ? (it[1] ? DRED : BLUE_D) : GREY; BH.rr(x - 62, y - 14, 124, 28, '#fff', col, 14, 2); TB(it[0], x, y + 5, col, 13);
      });
    },
    /* 2 vaccin ou sérum */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .62, mx = function (d) { return O.x + d / 30 * w; }, my = function (v) { return O.y - v / 100 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 'jours', 'protection');
      BH.fn(function (d) { return 90 * Math.exp(-d * Math.LN2 / 7); }, 0, 30, mx, my, BLUE, 3.2, 100); TB('sérum', mx(1.5), my(90) - 8, BLUE_D, 13, 'left'); TB('immédiat, bref (t½ ≈ 7 j)', mx(12), my(14), BLUE_D, 12, 'left');
      
      if (p > 0) {
        BH.al(BH.ph(p, 0, .7)); BH.fn(function (d) { return 85 * (1 - Math.exp(-Math.max(0, d - 4) / 5)); }, 0, 30, mx, my, RED, 3.2, 100); TB('vaccin : retard puis durable', mx(8), my(85) - 14, DRED, 13, 'left');
        BH.a1(); BH.sol(p, 'vaccin = mémoire · sérum = prêt-à-porter', W * .5, H * .96, DGREEN, 14);
      } else { TB('?', mx(18), my(60), GREY, 30); }
    },
    /* 3 innée indispensable */
    function (p) {
      var O = { x: W * .14, y: H * .84 }, w = W * .74, h = H * .6, mx = function (t) { return O.x + t / 10 * w; }, my = function (n) { return O.y - Math.log10(n / 10) / 6 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 't (h)', 'bactéries (log)');
      [10, 1e3, 1e5, 1e7].forEach(function (n) { LN(O.x - 3, my(n), O.x + 3, my(n), INK, 1.4); TB(n === 10 ? '10' : '10' + (n === 1e3 ? '³' : n === 1e5 ? '⁵' : '⁷'), O.x - 7, my(n) + 4, GREY, 12, 'right'); });
      var f = p > 0 ? BH.ph(p, 0, .7) : 1; BH.fn(function (t) { return 10 * Math.pow(2, 2 * t); }, 0, 10 * f, mx, my, RED, 3.4, 100);
      TB('doublement toutes les 30 min', W * .3, H * .22, DRED, 13, 'left'); TB('N = 10 × 2²ᵗ', W * .3, H * .3, INK, 13, 'left');
      if (p > 0) { BH.al(BH.ph(p, .6, 1)); DOT(mx(10), my(10 * Math.pow(2, 20)), 6, DRED); TB('≈ 1,0·10⁷', mx(10) - 8, my(1e7) - 4, DRED, 14, 'right'); BH.a1(); BH.sol(p, 'adaptative : ≥ 7 jours → l’innée doit contenir l’infection', W * .5, H * .96, DGREEN, 13); }
    },
    /* 4 primaire / secondaire */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .82, h = H * .62, mx = function (d) { return O.x + d / 45 * w; }, my = function (v) { return O.y - Math.log10(v) / 4 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 'jours', 'anticorps (log)'); [1, 10, 100, 1000].forEach(function (n) { TB(n, O.x - 7, my(n) + 4, GREY, 11, 'right'); LN(O.x - 3, my(n), O.x + 3, my(n), INK, 1.2); });
      var ss = function (x) { x = BH.cl(x, 0, 1); return x * x * (3 - 2 * x); }; var prim = function (d) { return Math.pow(10, d < 21 ? 2 * ss((d - 7) / 7) : 2 - .05 * (d - 21)); }; BH.fn(prim, 0, 28, mx, my, BLUE, 3.4, 120);
      arrow(mx(0), my(1) - 30, 0, 22, ORANGE, '', 2.4); TB('contact 1', mx(0) + 8, my(1) - 36, ORANGE, 12, 'left'); arrow(mx(28), my(1) - 30, 0, 22, ORANGE, '', 2.4); TB('contact 2', mx(28), my(1) - 36, ORANGE, 12);
      TB('pic 100', mx(14), my(100) - 8, BLUE_D, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .7)); BH.fn(function (d) { return Math.pow(10, d < 35 ? 3.7 * ss((d - 30) / 5) : 3.7 - .05 * (d - 35)); }, 28, 45, mx, my, RED, 3.4, 120); TB('pic 5 000', mx(35), my(5000) - 8, DRED, 13); BH.a1(); BH.sol(p, '7 j → 2 j : × 3,5 plus rapide · 100 → 5 000 : × 50', W * .5, H * .96, DGREEN, 13); TB('cellules mémoire', mx(45), my(30), DRED, 12, 'right'); }
    },
    /* 5 immunité collective */
    function (p) {
      [[W * .05, 'rougeole R₀ = 12', 92, 1 - 1 / 12], [W * .54, 'grippe R₀ = 1,5', 33, 1 - 1 / 1.5]].forEach(function (g, k) {
        var x0 = g[0], y0 = H * .22, s = H * .062; TB(g[1], x0 + s * 5, H * .08, k ? BLUE_D : DRED, 14);
        for (var i = 0; i < 100; i++) { var cx = x0 + (i % 10) * s + s / 2, cy = y0 + Math.floor(i / 10) * s + s / 2, im = i < g[2], on = p > 0 && im && i < g[2] * BH.ph(p, 0, .7) + 1; DOT(cx, cy, s * .36, on ? (k ? BLUE : GREEN) : '#d7dde5'); }
        if (p > 0) { BH.al(BH.ph(p, .5, 1)); TB(BH.fx(g[3] * 100, 1) + ' % à immuniser', x0 + s * 5, H * .9, k ? BLUE_D : DGREEN, 14); BH.a1(); }
      });
      if (p > 0) { BH.al(BH.ph(p, .6, 1)); tag('couverture : 91,7 / 0,97 ≈ 94,5 %', W * .5, H * .975, DRED, 13); BH.a1(); }
    },
    /* 6 plaie au clou */
    function (p) {
      var cx = W * .28, cy = H * .38; ctx.fillStyle = '#f3dcc2'; ctx.fillRect(W * .04, cy - 8, W * .48, 50); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.strokeRect(W * .04, cy - 8, W * .48, 50);
      TB('peau', W * .1, cy + 14, ORANGE, 12);
      LN(cx, cy - 56, cx, cy + 26, '#a05a2c', 7); LN(cx, cy + 26, cx, cy + 36, '#a05a2c', 2); BH.rr(cx - 12, cy - 62, 24, 8, '#a05a2c', null, 3); TB('clou rouillé', cx + 38, cy - 40, '#a05a2c', 12, 'left');
      for (var i = 0; i < 5; i++) { DOT(cx + 14 + i * 14, cy + 24 + (i % 2) * 8, 4, VIOLET); } TB('toxine tétanique', cx + 10, cy + 56, VIOLET, 12, 'left');
      BH.rr(W * .58, H * .14, W * .38, H * .32, '#e6f1fb', BLUE, 8, 1.8); ab(W * .68, H * .3, 14, BLUE_D); ab(W * .78, H * .3, 14, BLUE_D); TB('sérum', W * .77, H * .4, BLUE_D, 13);
      BH.rr(W * .58, H * .52, W * .38, H * .3, '#fdeaea', RED, 8, 1.8); TB('vaccin', W * .77, H * .74, DRED, 13); LN(W * .68, H * .6, W * .68 + 14, H * .66, RED, 3); BH.ci(W * .8, H * .62, 8, '#fff', RED, 2);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); TB('neutralise la toxine', W * .77, H * .21, BLUE_D, 12); BH.al(BH.ph(p, .4, 1)); TB('mémoire durable', W * .77, H * .58, DRED, 12); BH.a1(); BH.sol(p, 'sérum (urgence) + vaccin (avenir)', W * .5, H * .93, DGREEN, 14); }
    },
    /* 7 suivi d'anticorps */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .64, mx = function (d) { return O.x + (d - 5) / 32 * w; }, my = function (v) { return O.y - Math.log10(Math.max(v, 1)) / 3.6 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 'jour', 'titre (log)'); [1, 10, 100, 1000].forEach(function (n) { TB(n, O.x - 7, my(n) + 4, GREY, 11, 'right'); });
      var pts = [[7, 1], [14, 10], [21, 80], [28, 40], [30, 200], [35, 3200]]; BH.poly(pts.map(function (q) { return [mx(q[0]), my(q[1])]; }), BLUE, 3);
      pts.forEach(function (q, i) { DOT(mx(q[0]), my(q[1]), 5, i > 3 ? RED : BLUE_D); if (i) TB(q[1], mx(q[0]), my(q[1]) - 9, i > 3 ? DRED : BLUE_D, 12); });
      TB('0', mx(7), my(1) - 9, BLUE_D, 12); arrow(mx(28), H * .1, 0, 22, ORANGE, '', 2.4); TB('2ᵉ dose', mx(28) + 6, H * .1, ORANGE, 12, 'left');
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); LN(mx(21), my(80), mx(28), my(80), GREY, 1.4, [4, 3]); TB('80 → 40 en 7 j : t½ = 7 j', mx(24), my(12), DGREEN, 12); BH.al(BH.ph(p, .5, 1)); TB('3 200 / 80 = 40', mx(35), my(3200) + 22, DRED, 13, 'right'); BH.a1(); BH.sol(p, 'réponse secondaire : rapide (jour 30 : 200)', W * .5, H * .96, DGREEN, 13); }
    },
    /* 8 VIH */
    function (p) {
      var O = { x: W * .12, y: H * .84 }, w = W * .8, h = H * .62, mx = function (t) { return O.x + t / 10 * w; }, my = function (v) { return O.y - v / 900 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, 'années', 'CD4 (/µL)'); [200, 650].forEach(function (v) { TB(v, O.x - 7, my(v) + 4, GREY, 11, 'right'); });
      LN(O.x, my(200), O.x + w, my(200), RED, 1.5, [5, 4]); TB('SIDA < 200', O.x + w, my(200) + 15, DRED, 12, 'right');
      BH.fn(function (t) { return 800 * Math.exp(-t / 6) + 40; }, 0, 10, mx, my, GREY, 2.6, 100); TB('sans traitement (schéma)', mx(5.8), my(310) - 26, GREY, 12, 'left');
      arrow(mx(1.2), H * .08, 0, 22, ORANGE, '', 2.4); TB('antirétroviraux', mx(1.2) + 8, H * .1, ORANGE, 12, 'left');
      var f = p > 0 ? BH.ph(p, 0, .7) : 0; BH.fn(function (t) { return t < 3 ? 400 + 250 * (1 - Math.exp(-t / 1.1)) / (1 - Math.exp(-3 / 1.1)) : 650; }, 0, Math.max(.01, 10 * f), mx, my, GREEN, 3.6, 100);
      DOT(mx(3), my(650), 6, GREEN); TB('650 à 3 ans', mx(3), my(650) - 12, DGREEN, 13);
      if (p > 0) { BH.al(BH.ph(p, .5, 1)); TB('charge virale indétectable : le virus est freiné,', W * .56, H * .2, DGREEN, 12); TB('pas éliminé ; transmission quasi nulle', W * .56, H * .27, DGREEN, 12); BH.a1(); }
    },
    /* 9 vacciner pour protéger les autres */
    function (p) {
      var x0 = W * .05, y0 = H * .14, s = H * .064;
      for (var i = 0; i < 100; i++) { var cx = x0 + (i % 10) * s + s / 2, cy = y0 + Math.floor(i / 10) * s + s / 2; DOT(cx, cy, s * .36, i < 72 ? BLUE : '#f2b5b4'); }
      TB('72 % immunisés (80 % × 90 %)', x0 + s * 5, H * .07, BLUE_D, 13);
      var bx = W * .5, bw = W * .44; TB('part immunisée', bx, H * .2, GREY, 12, 'left'); BH.rr(bx, H * .24, bw, 22, '#e3e7ed', null, 4); BH.rr(bx, H * .24, bw * .72, 22, BLUE, null, 4);
      LN(bx + bw * .8, H * .2, bx + bw * .8, H * .34, DRED, 2.4); TB('seuil 80 %', bx + bw * .8, H * .39, DRED, 12);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .5)); TB('R effectif = 5 × 0,28 = 1,4 > 1', bx, H * .56, DRED, 14, 'left'); TB('→ épidémie possible', bx, H * .64, DRED, 13, 'left');
        BH.al(BH.ph(p, .5, 1)); TB('vaccinés : 0,8 / 0,9 = 88,9 %', bx, H * .76, DGREEN, 13, 'left'); TB('+ 8,9 % de 10 000 ≈ 889', bx, H * .85, DGREEN, 13, 'left'); BH.a1();
      }
    },
    /* 10 sérum ou vaccin chez la souris */
    function (p) {
      var x0 = W * .1, cw = W * .26, rh = H * .2, y0 = H * .3;
      TB('jour 1', x0 + cw * 1.35, H * .1, GREY, 14); TB('jour 60', x0 + cw * 2.35, H * .1, GREY, 14); TB('toxine injectée', W * .6, H * .2, ORANGE, 12);
      var res = [['A  sérum', [1, 0]], ['B  vaccin', [0, 1]], ['C  rien', [0, 0]]];
      res.forEach(function (r, i) {
        var y = y0 + i * rh; TB(r[0], x0, y + 5, i === 0 ? BLUE_D : i === 1 ? DRED : GREY, 14, 'left');
        r[1].forEach(function (v, j) {
          var x = x0 + cw * (1.35 + j); BH.rr(x - cw * .4, y - rh * .35, cw * .8, rh * .7, '#fff', GREY, 8, 1.6);
          if (p > 0) { BH.al(BH.ph(p, (i + j) * .12, (i + j) * .12 + .4)); TB(v ? 'survit ✓' : 'meurt ✗', x, y + 5, v ? DGREEN : DRED, 14); BH.a1(); } else TB('?', x, y + 6, GREY, 18);
        });
      });
      if (p > 0) BH.sol(p, 'jour 60 : les anticorps injectés ont disparu (t½ ≈ 7 j)', W * .5, H * .93, DGREEN, 12.5);
    }
  ]);
})();
