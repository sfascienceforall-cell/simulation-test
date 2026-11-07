/* Biologie 5e · chapitre 7 : reproduction asexuée, sexuée et méiose */
(function () {
  var C = 'c07';

  /* chromosome : x,y centre, L longueur, col, dyade (2 chromatides) ou simple, a angle */
  function chrom(x, y, L, col, dy, mark, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = dy ? 4.2 : 4.6;
    if (dy) { LN(-3.4, -L / 2, -3.4, L / 2, col, 4.2); LN(3.4, -L / 2, 3.4, L / 2, col, 4.2); } else LN(0, -L / 2, 0, L / 2, col, 4.8);
    if (mark) { var c2 = col === RED ? BLUE : RED, mx = dy ? 3.4 * mark : 0; LN(mx, -L / 2, mx, -L / 2 + L * .3, c2, 4.2); }
    DOT(0, 0, 2.6, '#fff'); ctx.restore(); ctx.lineCap = 'butt';
  }
  function cellO(x, y, rx, ry, col, fill) { BH.el(x, y, rx, ry, fill || 'rgba(230,241,251,.7)', col || BLUE_D, 2.4); }
  function ease(x) { x = BH.cl(x, 0, 1); return x * x * (3 - 2 * x); }

  SFA.theo(C, {
    icon: function () {
      cellO(W * .26, H * .45, 50, 50, BLUE_D); chrom(W * .24, H * .45, 40, RED, true); chrom(W * .29, H * .45, 40, BLUE, true);
      arrow(W * .4, H * .45, W * .1, 0, GREY, '', 3);
      [[.62, .28], [.78, .28], [.62, .62], [.78, .62]].forEach(function (c, i) { cellO(W * c[0], H * c[1], 24, 24, BLUE_D); chrom(W * c[0], H * c[1], 22, i % 2 ? BLUE : RED, false); });
      TB('méiose', W * .5, H * .9, BLUE_D, 24);
    },
    anim: function (t) {
      var D = 110, st = Math.floor((t % (D * 6)) / D), f = ease(((t % (D * 6)) % D) / 40), names = ['prophase I : appariement et crossing-over', 'métaphase I', 'anaphase I : les homologues se séparent', 'télophase I : 2 cellules (n = 2)', 'méiose II : métaphase', 'anaphase II → 4 cellules haploïdes'];
      TB('Méiose (2n = 4)', W * .5, 16, BLUE_D, 14);
      var L = H * .22, cy = H * .56, lay = [
        [[.455, .43], [.545, .43], [.455, .70], [.545, .70]],
        [[.47, .43], [.53, .43], [.47, .70], [.53, .70]],
        [[.36, .43], [.64, .43], [.36, .70], [.64, .70]],
        [[.27, .45], [.73, .45], [.27, .68], [.73, .68]],
        [[.27, .45], [.73, .45], [.27, .68], [.73, .68]],
        [[.27, .45], [.73, .45], [.27, .68], [.73, .68]]];
      var cols = [RED, BLUE, RED, BLUE], lens = [L, L, L * .66, L * .66];
      /* cellules */
      if (st <= 2) cellO(W * .5, cy, W * .3 * (st === 2 ? 1.06 : 1), H * .34); else if (st < 5) { cellO(W * .27, cy, W * .21, H * .3); cellO(W * .73, cy, W * .21, H * .3); } else { [.14, .38, .62, .86].forEach(function (x) { cellO(W * x, cy, W * .1, H * .2); }); }
      if (st === 1) { LN(W * .5, H * .24, W * .5, H * .88, GREY, 1.4, [4, 4]); }
      if (st === 4) { LN(W * .27, H * .26, W * .27, H * .86, GREY, 1, [4, 4]); LN(W * .73, H * .26, W * .73, H * .86, GREY, 1, [4, 4]); }
      for (var i = 0; i < 4; i++) {
        var a = st > 0 ? lay[st - 1][i] : lay[0][i], b = lay[st][i], x = (a[0] + (b[0] - a[0]) * (st > 0 ? f : 1)) * W, y = (a[1] + (b[1] - a[1]) * (st > 0 ? f : 1)) * H;
        if (st < 5) chrom(x, y, lens[i], cols[i], true, i < 2 ? (i ? -1 : 1) : 0);
        else {
          var g = ease(((t % (D * 6)) % D) / 80), tx = i % 2 === 0 ? [.14, .38] : [.62, .86];
          chrom(a[0] * W + (tx[0] * W - a[0] * W) * g, y, lens[i] * .8, cols[i], false, 0); chrom(a[0] * W + (tx[1] * W - a[0] * W) * g, y, lens[i] * .8, cols[i], false, i < 2 ? 1 : 0);
        }
      }
      if (st === 0) { TB('crossing-over', W * .5, H * .29, ORANGE, 12); }
      TB(names[st], W * .5, H * .95, st === 5 ? DGREEN : DRED, 13);
      TB(st < 3 ? '2n = 4 (2 paires d’homologues)' : st < 5 ? 'n = 2 (chromosomes à 2 chromatides)' : '4 cellules n = 2, toutes différentes', W * .5, H * .15, GREY, 12);
    },
    th:
      '<div class="tcard"><b class="h">Reproduction asexuée et sexuée</b><p><b>Asexuée</b> : un seul parent, par mitose ; la descendance est un <b>clone</b> (génétiquement identique) ; rapide, sans partenaire (bourgeonnement, bouturage, stolons). <b>Sexuée</b> : deux parents, <b>gamètes</b> haploïdes et <b>fécondation</b> ; la descendance est <b>variée</b>, ce qui favorise l’adaptation quand le milieu change (maladie, climat). Contre-partie : plus lente, coûteuse.</p></div>' +
      '<div class="tcard"><b class="h">Haploïde et diploïde</b><p>Une cellule <b>diploïde</b> (2n) possède des paires de chromosomes homologues (un de chaque parent) : chez l’être humain 2n = 46 (23 paires). Les <b>gamètes</b> sont <b>haploïdes</b> (n = 23). La fécondation rétablit 2n = 46 (zygote). Quantité d’ADN (cellule à 6 pg en G1) : réplication (S) → 12 pg ; fin de méiose I → 6 pg ; fin de méiose II → 3 pg.</p></div>' +
      '<div class="tcard"><b class="h">La méiose : 2 divisions → 4 cellules</b><p>Après réplication, la <b>méiose I</b> (« réductionnelle ») : appariement des homologues en prophase I, <b>crossing-over</b>, séparation des <b>homologues</b> en anaphase I → 2 cellules haploïdes à chromosomes dupliqués. La <b>méiose II</b> (« équationnelle ») sépare les <b>chromatides</b> → 4 cellules haploïdes, génétiquement différentes. C’est l’anaphase I qui divise le nombre de chromosomes par deux.</p></div>' +
      '<div class="tcard"><b class="h">Le brassage génétique</b><p><b>Interchromosomique</b> : chaque paire se répartit au hasard (anaphase I) : <b>2ⁿ gamètes</b> différents (sans crossing-over) ; n = 23 : 2²³ = 8 388 608. Un gamète tout maternel : (½)²³ ≈ 1,2·10⁻⁷. <b>Intrachromosomique</b> : le crossing-over échange des fragments entre chromatides d’homologues. Fréquence de recombinaison = recombinants / total ; 1 % ≈ 1 centimorgan. Fécondation : (2²³)² ≈ 7,0·10¹³ zygotes possibles.</p></div>' +
      '<div class="tcard"><b class="h">Anomalies et pièges</b><p>Une <b>non-disjonction</b> (homologues en méiose I, ou chromatides sœurs en méiose II) donne des gamètes à n+1 ou n−1 chromosomes ; trisomie 21 : 47 chromosomes. Une non-disjonction en méiose II donne deux copies <i>identiques</i> du même chromosome ; en méiose I, deux homologues <i>différents</i>. <b>Piège :</b> la mitose conserve 2n et donne des cellules identiques ; seule la méiose réduit et brasse.</p></div>'
  });

  SFA.figs(C, [
    /* 1 mitose ou méiose */
    function (p) {
      [[W * .26, 'mitose', 2, BLUE_D, '1 division', '2 cellules 2n identiques'], [W * .74, 'méiose', 4, DRED, '2 divisions', '4 cellules n différentes']].forEach(function (c, k) {
        var x = c[0]; TB(c[1], x, H * .08, c[3], 16); cellO(x, H * .26, 30, 30, c[3]); chrom(x - 7, H * .26, 28, RED, true); chrom(x + 7, H * .26, 28, BLUE, true); TB('2n', x, H * .26 + 46, GREY, 12);
        arrow(x, H * .46, 0, H * .1, GREY, '', 2.6); TB(c[4], x + 8, H * .52 + 2, GREY, 12, 'left');
        var n = c[2]; for (var i = 0; i < n; i++) { var cx = x + (i - (n - 1) / 2) * (n === 2 ? 62 : 48); if (p > 0 || true) { BH.al(p > 0 ? BH.ph(p, i * .1, i * .1 + .4) : .25); cellO(cx, H * .72, n === 2 ? 24 : 19, n === 2 ? 24 : 19, c[3]); if (k) { chrom(cx - 3, H * .72, 20, i % 2 ? BLUE : RED, false); chrom(cx + 4, H * .72, 14, i % 3 ? BLUE : RED, false); } else { chrom(cx - 5, H * .72, 22, RED, false); chrom(cx + 5, H * .72, 22, BLUE, false); } BH.a1(); } }
        if (p > 0) { BH.al(BH.ph(p, .4, 1)); TB(c[5], x, H * .93, c[3], 12.5); BH.a1(); }
      });
    },
    /* 2 haploïde ou diploïde */
    function (p) {
      var cs = [['spermatozoïde', 23, 'n'], ['ovule', 23, 'n'], ['cellule de la peau', 46, '2n'], ['zygote', 46, '2n']];
      cs.forEach(function (c, i) {
        var x = W * (.13 + i * .245), y = H * .42, r = i === 1 ? 36 : i === 0 ? 20 : 30, hap = c[1] === 23, col = hap ? DGREEN : BLUE_D;
        if (i === 0) { BH.ci(x, y, 17, '#e3f4ec', col, 2.4); LN(x, y + 17, x - 8, y + 54, col, 2.4); } else BH.ci(x, y, r, hap ? '#e3f4ec' : '#e6f1fb', col, 2.4);
        TB(c[0], x, H * .8, INK, 12); TB(c[1], x, y + 6, col, i === 0 ? 15 : 20);
        if (p > 0) { BH.al(BH.ph(p, i * .15, i * .15 + .4)); TB(c[2], x, H * .1, col, 20); TB(hap ? 'haploïde' : 'diploïde', x, H * .9, col, 13); BH.a1(); }
      });
      if (!p) TB('n ou 2n ?', W * .5, H * .1, GREY, 18);
    },
    /* 3 2^n gamètes */
    function (p) {
      var O = { x: W * .1, y: H * .8 }, h = H * .6, bw = W * .15, data = [['drosophile', 4, 16, '2⁴ = 16'], ['maïs', 10, 1024, '2¹⁰ = 1 024'], ['humain', 23, 8388608, '2²³ ≈ 8,4·10⁶'], ['chien', 39, 5.5e11, '2³⁹ ≈ 5,5·10¹¹']];
      BH.axes(O.x, O.y, W * .84, h + 14, null, 'gamètes (échelle log)');
      data.forEach(function (d, i) {
        var x = O.x + 18 + i * (bw + 16), hh = h * Math.log10(d[2]) / 12; BH.rr(x, O.y - hh, bw, hh, ['#cfe3f8', '#cfeadf', '#fff3c9', '#fbd9d8'][i], [BLUE_D, DGREEN, ORANGE, DRED][i], 2, 2);
        TB(d[0], x + bw / 2, O.y + 16, INK, 12); TB('2n = ' + 2 * d[1], x + bw / 2, O.y + 30, GREY, 11);
        if (p > 0) { BH.al(BH.ph(p, i * .2, i * .2 + .4)); TB(d[3], x + bw / 2, O.y - hh - 8, [BLUE_D, DGREEN, ORANGE, DRED][i], 12); BH.a1(); }
      });
      TB('2ⁿ combinaisons de chromosomes', W * .5, H * .08, INK, 14);
    },
    /* 4 quantité d'ADN */
    function (p) {
      var O = { x: W * .12, y: H * .8 }, w = W * .8, h = H * .58, my = function (v) { return O.y - v / 13 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, null, 'ADN (pg)');
      var segs = [[0, 1.2, 6, 'G1'], [1.2, 2.2, 12, 'S → 12'], [2.2, 3.8, 12, 'prophase I…'], [3.8, 5, 6, 'méiose I → 6'], [5, 6.4, 3, 'méiose II → 3']], mx = function (x) { return O.x + x / 6.4 * w; };
      var pts = [[mx(0), my(6)], [mx(1.2), my(6)], [mx(1.2), my(12)], [mx(3.8), my(12)], [mx(3.8), my(6)], [mx(5), my(6)], [mx(5), my(3)], [mx(6.4), my(3)]];
      [3, 6, 12].forEach(function (v) { TB(v, O.x - 6, my(v) + 4, GREY, 12, 'right'); LN(O.x, my(v), O.x + w, my(v), '#eef0f3', 1); });
      var f = p > 0 ? BH.ph(p, 0, .8) : .45, tot = 0, L = []; for (var i = 1; i < pts.length; i++) { L.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); tot += L[i - 1]; }
      var q = tot * f, draw = [pts[0]]; for (i = 1; i < pts.length; i++) { if (q >= L[i - 1]) { draw.push(pts[i]); q -= L[i - 1]; } else { var r = q / L[i - 1]; draw.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * r, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * r]); break; } }
      BH.poly(draw, BLUE, 3.6);
      [['G1', 0, 1.2], ['S', 1.2, 2.2], ['prophase I, méiose I', 2.2, 5], ['méiose II', 5, 6.4]].forEach(function (s) { TB(s[0], mx((s[1] + s[2]) / 2), O.y + 15, GREY, 11); });
      if (p > 0) { BH.al(BH.ph(p, .6, 1)); TB('12 pg', mx(2.6), my(12) - 8, DRED, 14); TB('6 pg', mx(4.4), my(6) - 8, ORANGE, 14); TB('3 pg', mx(5.7), my(3) - 8, DGREEN, 14); BH.a1(); } else TB('6 pg', mx(.6), my(6) - 8, BLUE_D, 14);
    },
    /* 5 qui réduit le nombre de chromosomes */
    function (p) {
      [[W * .26, 'anaphase I', true], [W * .74, 'anaphase II', false]].forEach(function (c, k) {
        var x = c[0]; cellO(x, H * .45, W * .2, H * .32, c[2] && p > 0 ? DGREEN : BLUE_D); LN(x, H * .12, x, H * .78, GREY, 1, [4, 4]); TB(c[1], x, H * .08, c[2] && p > 0 ? DGREEN : BLUE_D, 14);
        if (c[2]) { [[-.1, .34], [-.1, .56]].forEach(function (q) { chrom(x + q[0] * W - 16, q[1] * H, 40, RED, true); }); [[.1, .34], [.1, .56]].forEach(function (q) { chrom(x + q[0] * W + 16, q[1] * H, 40, BLUE, true); }); arrow(x - 26, H * .45, -20, 0, GREY, '', 2); arrow(x + 26, H * .45, 20, 0, GREY, '', 2); TB('homologues', x, H * .72, INK, 12); }
        else { [[-.1, .34], [-.1, .56]].forEach(function (q) { chrom(x + q[0] * W - 16, q[1] * H, 40, RED, false); }); [[.1, .34], [.1, .56]].forEach(function (q) { chrom(x + q[0] * W + 16, q[1] * H, 40, RED, false); }); TB('chromatides', x, H * .72, INK, 12); arrow(x - 26, H * .45, -20, 0, GREY, '', 2); arrow(x + 26, H * .45, 20, 0, GREY, '', 2); }
        TB(c[2] ? '2n → n' : 'n → n', x, H * .88, c[2] && p > 0 ? DGREEN : GREY, 14);
      });
      if (p > 0) BH.sol(p, 'la réduction a lieu à l’anaphase I', W * .5, H * .97, DGREEN, 14);
    },
    /* 6 probabilités du brassage */
    function (p) {
      TB('23 paires : chaque chromosome vient de la mère ou du père', W * .5, H * .09, INK, 13);
      for (var j = 0; j < 2; j++) { var y = H * (.26 + j * .24); TB(j ? 'gamète mixte' : 'gamète 100 % maternel', W * .02, y - 16, j ? BLUE_D : DRED, 12, 'left'); for (var i = 0; i < 23; i++) { var x = W * (.04 + i * .0415); chrom(x, y + 6, 22, (j === 0 || (i * 7 + 3) % 5 < 2) ? RED : BLUE, false); } }
      TB('probabilité d’un gamète tout maternel : (½)²³', W * .5, H * .65, DRED, 14);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); TB('= 1 / 8 388 608 ≈ 1,2·10⁻⁷', W * .5, H * .74, DRED, 15); BH.al(BH.ph(p, .4, 1)); TB('zygotes possibles : 2²³ × 2²³ = 2⁴⁶ ≈ 7,0·10¹³', W * .5, H * .88, DGREEN, 14); BH.a1(); }
    },
    /* 7 recombinaison */
    function (p) {
      var x0 = W * .06; TB('parent : A B / a b  (gènes liés)  ×  a b / a b', W * .5, H * .08, INK, 13);
      chrom(W * .14, H * .26, 50, RED, false); chrom(W * .22, H * .26, 50, BLUE, false); TB('A', W * .14 - 10, H * .2, RED, 12); TB('B', W * .14 - 10, H * .32, RED, 12); TB('a', W * .22 + 10, H * .2, BLUE_D, 12); TB('b', W * .22 + 10, H * .32, BLUE_D, 12);
      var O = { x: W * .4, y: H * .84 }, w = W * .56, h = H * .6, my = function (v) { return O.y - v / 480 * h; }, bw = w / 4 - 8;
      BH.axes(O.x - 6, O.y, w + 8, h + 12, null, null);
      [['AaBb', 440, RED], ['aabb', 440, BLUE], ['Aabb', 60, ORANGE], ['aaBb', 60, ORANGE]].forEach(function (d, i) { var x = O.x + i * (bw + 8); BH.rr(x, my(d[1]), bw, O.y - my(d[1]), i < 2 ? '#e6f1fb' : '#fff3c9', d[2] === ORANGE ? ORANGE : d[2], 2, 2); TB(d[1], x + bw / 2, my(d[1]) - 6, d[2] === ORANGE ? ORANGE : INK, 13); TB(d[0], x + bw / 2, O.y + 15, INK, 12); });
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('recombinants :', W * .02, H * .5, ORANGE, 13, 'left'); TB('60 + 60 = 120', W * .02, H * .58, ORANGE, 13, 'left'); TB('120 / 1 000 = 12 %', W * .02, H * .68, ORANGE, 14, 'left'); BH.al(BH.ph(p, .5, 1)); TB('≈ 12 cM : liés', W * .02, H * .8, DGREEN, 14, 'left'); BH.a1(); } else TB('liés ou indépendants ?', W * .02, H * .6, GREY, 13, 'left');
    },
    /* 8 quel accident */
    function (p) {
      [[W * .26, 'non-disjonction en méiose I', 'deux homologues', 'différents', false], [W * .74, 'non-disjonction en méiose II', 'deux chromatides sœurs', 'identiques', true]].forEach(function (c, k) {
        var x = c[0]; TB(c[1], x, H * .08, c[4] && p > 0 ? DGREEN : BLUE_D, 12.5); cellO(x, H * .5, 34, 34, BLUE_D); chrom(x - 8, H * .5, 40, RED, false); if (c[4]) chrom(x + 8, H * .5, 40, RED, false); else chrom(x + 8, H * .5, 40, BLUE, false);
        TB('gamète n+1', x, H * .5 + 54, INK, 12); TB(c[2], x, H * .5 + 72, GREY, 12); TB(c[3], x, H * .5 + 88, c[4] && p > 0 ? DGREEN : GREY, 13);
        if (p > 0) { BH.al(BH.ph(p, 0, .5)); TB(c[4] ? '✓' : '✗', x, H * .22, c[4] ? DGREEN : DRED, 26); BH.a1(); }
      });
      if (p > 0) BH.sol(p, 'copies strictement identiques → méiose II', W * .5, H * .97, DGREEN, 13);
    },
    /* 9 clones ou graines */
    function (p) {
      [[W * .04, 'clones (stolons)', false], [W * .54, 'plants issus de graines', true]].forEach(function (g, k) {
        var s = H * .058, y0 = H * .2; TB(g[1], W * (k ? .75 : .25), H * .08, k ? BLUE_D : ORANGE, 13);
        for (var i = 0; i < 100; i++) {
          var cx = g[0] + (i % 10) * s * 1.15 + s / 2 + 4, cy = y0 + Math.floor(i / 10) * s + s / 2, col = k ? ['#7fb9e8', '#e8a95f', '#a89ee8', '#7dcaa8', '#e88a89'][i % 5] : ORANGE;
          var surv = k && (i === 7 || i === 23 || i === 41 || i === 66 || i === 88); if (p > 0) col = k ? (surv ? GREEN : '#d7dde5') : '#d7dde5'; DOT(cx, cy, s * .34, col); if (p > 0 && surv) { ctx.strokeStyle = DGREEN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, s * .46, 0, 7); ctx.stroke(); }
        }
      });
      TB('1 point = 10 plants', W * .5, H * .87, GREY, 11);
      if (p > 0) { BH.al(BH.ph(p, .2, 1)); TB('tous touchés', W * .25, H * .94, DRED, 14); TB('5 % survivent ≈ 50 plants', W * .75, H * .94, DGREEN, 14); BH.a1(); }
    },
    /* 10 deux enfants identiques */
    function (p) {
      TB('pour une paire : même chromosome maternel (½) et même paternel (½)', W * .5, H * .08, INK, 12.5);
      for (var i = 0; i < 23; i++) { var x = W * (.045 + i * .0415); BH.rr(x - 7, H * .18, 14, 44, '#e6f1fb', BLUE_D, 3, 1.4); LN(x, H * .18 + 6, x, H * .18 + 21, RED, 3); LN(x, H * .18 + 23, x, H * .18 + 38, BLUE, 3); }
      TB('= ¼ par paire', W * .5, H * .5, DRED, 16); TB('23 paires : (¼)²³ = 1 / 4²³', W * .5, H * .62, DRED, 15);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('4²³ = 2⁴⁶ ≈ 7,0·10¹³', W * .5, H * .74, INK, 14); BH.sol(p, 'probabilité ≈ 1,4·10⁻¹⁴', W * .5, H * .89, DGREEN, 17); BH.a1(); }
    }
  ]);
})();
