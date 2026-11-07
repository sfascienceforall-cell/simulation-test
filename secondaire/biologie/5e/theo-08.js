/* Biologie 5e · chapitre 8 : appareils reproducteurs et gamétogenèse */
(function () {
  var C = 'c08';

  function sperm(x, y, r, col) { BH.ci(x, y, r, '#e3f4ec', col || DGREEN, 2); ctx.strokeStyle = col || DGREEN; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x, y + r); ctx.quadraticCurveTo(x - r * .8, y + r * 2, x + r * .3, y + r * 3); ctx.stroke(); }
  function gcell(x, y, r, col, fill) { BH.ci(x, y, r, fill || '#e6f1fb', col || BLUE_D, 2); }
  function seg(a, b) { return BH.cl(a, 0, 1) * (b || 1); }

  SFA.theo(C, {
    icon: function () {
      gcell(W * .25, H * .25, 24, BLUE_D); [.12, .22, .32, .42].forEach(function (x) { sperm(W * x, H * .6, 9); });
      gcell(W * .78, H * .25, 30, DRED, '#fdeaea'); gcell(W * .74, H * .62, 24, DRED, '#fdeaea'); [.86, .92, .97].forEach(function (x) { gcell(W * x, H * .62, 5, GREY, '#fff'); });
      TB('4 gamètes', W * .27, H * .93, DGREEN, 16); TB('1 gamète', W * .78, H * .93, DRED, 16);
    },
    anim: function (t) {
      var T = 150, k = Math.floor((t % (T * 4)) / T), ph = ((t % (T * 4)) % T) / T, a1 = k >= 1 ? (k === 1 ? ph : 1) : 0, a2 = k >= 2 ? (k === 2 ? ph : 1) : 0;
      TB('Spermatogenèse : 1 → 4 · Ovogenèse : 1 → 1', W * .5, 16, BLUE_D, 14);
      LN(W * .5, H * .1, W * .5, H * .9, '#eef0f3', 2);
      /* spermatogenèse */
      gcell(W * .25, H * .22, 24, BLUE_D); TB('spermatocyte I', W * .25, H * .22 + 42, BLUE_D, 11);
      if (a1 > 0) { BH.al(a1); [.15, .35].forEach(function (x) { gcell(W * x, H * .56, 18, BLUE_D); }); TB('méiose I', W * .25, H * .45, GREY, 11); BH.a1(); }
      if (a2 > 0) { BH.al(a2); [.09, .21, .29, .41].forEach(function (x, i) { sperm(W * (x + (i < 2 ? -.0 : 0)), H * .78, 9); }); TB('4 spermatozoïdes', W * .25, H * .96, DGREEN, 13); BH.a1(); }
      /* ovogenèse */
      gcell(W * .75, H * .22, 30, DRED, '#fdeaea'); TB('ovocyte I', W * .75, H * .22 + 46, DRED, 11);
      if (a1 > 0) { BH.al(a1); gcell(W * .68, H * .56, 26, DRED, '#fdeaea'); gcell(W * .9, H * .56, 9, GREY, '#fff'); TB('globule polaire 1', W * .9, H * .56 + 22, GREY, 10); BH.a1(); }
      if (a2 > 0) { BH.al(a2); gcell(W * .64, H * .8, 24, DRED, '#fdeaea'); gcell(W * .78, H * .8, 7, GREY, '#fff'); gcell(W * .86, H * .8, 7, GREY, '#fff'); gcell(W * .94, H * .8, 7, GREY, '#fff'); TB('1 ovule + 3 globules polaires', W * .75, H * .96, DRED, 13); BH.a1(); }
    },
    th:
      '<div class="tcard"><b class="h">Les appareils reproducteurs</b><p><b>Masculin</b> : testicules (spermatozoïdes + testostérone), épididyme (maturation), canal déférent, vésicules séminales et prostate (liquide séminal), urètre, pénis. <b>Féminin</b> : ovaires (ovocytes + œstrogènes et progestérone), trompes de Fallope (lieu de la fécondation), utérus (nidation et grossesse), vagin. Les gonades ont deux rôles : produire les gamètes et sécréter des hormones sexuelles.</p></div>' +
      '<div class="tcard"><b class="h">Spermatogenèse</b><p>Elle débute à la <b>puberté</b> dans les tubes séminifères et est <b>continue</b> (environ 100 millions de spermatozoïdes par jour, ≈ 1 200 par seconde). Un spermatocyte I donne, après la méiose I puis II, <b>4 spermatozoïdes</b>, petits et mobiles (tête, pièce intermédiaire, flagelle). Elle dépend de la testostérone (cellules de Leydig), de la FSH et de la LH.</p><p><b>Exemple :</b> 10⁸ par jour × 365 j × 27 ans ≈ 10¹² spermatozoïdes entre 13 et 40 ans.</p></div>' +
      '<div class="tcard"><b class="h">Ovogenèse</b><p>Le stock d’<b>ovocytes I</b> est constitué <b>avant la naissance</b> (≈ 1 million à la naissance, ≈ 350 000 à la puberté) ; ils sont bloqués en prophase I. Chaque cycle, un ovocyte I achève la méiose I : <b>ovocyte II + 1<sup>er</sup> globule polaire</b>, puis se bloque en métaphase II. L’<b>ovulation</b> libère un <b>ovocyte II</b> (et non un ovule). La méiose II ne s’achève que s’il y a fécondation : <b>ovule + 2<sup>e</sup> globule polaire</b>. Une cellule mère donne <b>1 seul</b> gamète, gros et riche en réserves ; la plupart des ovocytes dégénèrent (<b>atrésie</b>) : ≈ 400 sont ovulés sur toute une vie.</p></div>' +
      '<div class="tcard"><b class="h">Puberté et hormones sexuelles</b><p>À la puberté, l’hypothalamus libère la GnRH, qui stimule la sécrétion hypophysaire de <b>FSH et LH</b> ; celles-ci commandent les gonades. Chez le garçon, la <b>testostérone</b> provoque les caractères sexuels secondaires et la spermatogenèse ; chez la fille, les <b>œstrogènes</b> (seins, hanches) ; les premières règles apparaissent en moyenne ≈ 2 ans après le début du développement des seins. Les hormones sexuelles exercent un <b>rétrocontrôle négatif</b> sur l’hypophyse : une testostérone prise comme dopage freine la LH et la FSH, donc la fertilité.</p></div>' +
      '<div class="tcard"><b class="h">Infertilité et pièges</b><p>Causes : production de gamètes insuffisante (spermogramme : ≥ 16 millions/mL, mobilité progressive ≥ 30 %, formes normales ≥ 4 %), obstacle sur les voies génitales, trouble hormonal, âge (le stock d’ovocytes diminue). Un résultat isolé hors norme est à confirmer et n’est pas la stérilité. <b>Pièges :</b> « ovule » ≠ « ovocyte II » ; la spermatogenèse est continue, l’ovogenèse est cyclique et limitée par le stock.</p></div>'
  });

  SFA.figs(C, [
    /* 1 comparaison */
    function (p) {
      TB('spermatogenèse', W * .25, H * .08, DGREEN, 14); TB('ovogenèse', W * .75, H * .08, DRED, 14); LN(W * .5, H * .1, W * .5, H * .96, '#eef0f3', 2);
      gcell(W * .25, H * .2, 18, BLUE_D); [.1, .22, .28, .4].forEach(function (x) { sperm(W * x, H * .52, 8); }); arrow(W * .25, H * .3, 0, H * .12, GREY, '', 2);
      gcell(W * .75, H * .2, 24, DRED, '#fdeaea'); gcell(W * .66, H * .54, 22, DRED, '#fdeaea'); [.8, .88, .95].forEach(function (x) { gcell(W * x, H * .54, 6, GREY, '#fff'); }); arrow(W * .75, H * .32, 0, H * .12, GREY, '', 2);
      var rows = [['début', 'puberté', 'avant la naissance'], ['production', 'continue', 'cyclique (stock)'], ['gamètes', '4, petits', '1, gros']];
      rows.forEach(function (r, i) { var y = H * (.7 + i * .1); tag(r[0], W * .5, y - 4, GREY, 11); TB(p > 0 ? r[1] : '?', W * .25, y, DGREEN, 12.5); TB(p > 0 ? r[2] : '?', W * .75, y, DRED, 12.5); });
    },
    /* 2 ovule ou ovocyte */
    function (p) {
      BH.el(W * .26, H * .5, W * .2, H * .4, '#fbe9d6', ORANGE, 2.4); BH.ci(W * .26, H * .42, 40, '#fff', ORANGE, 2); BH.ci(W * .34, H * .38, 15, '#fdeaea', DRED, 2.4); TB('ovaire', W * .26, H * .88, ORANGE, 13); TB('follicule', W * .2, H * .6, ORANGE, 11);
      arrow(W * .42, H * .38, W * .12, -H * .12, DRED, '', 3);
      var x = W * .76, y = H * .38; for (var i = 0; i < 16; i++) { var a = i / 16 * 2 * Math.PI; BH.ci(x + 50 * Math.cos(a), y + 50 * Math.sin(a), 6, '#fff3c9', ORANGE, 1.4); }
      BH.ci(x, y, 40, '#fdeaea', DRED, 2.6); chromLine(x, y); gcell(x + 40, y - 40, 8, GREY, '#fff');
      TB('cellules folliculaires', x, y + 72, ORANGE, 11); TB('globule polaire', x + 6, y - 64, GREY, 11);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('ovocyte II', x, H * .08, DRED, 16); BH.al(BH.ph(p, .4, 1)); TB('bloqué en métaphase II', x, y + 90, DRED, 13); BH.sol(p, 'ovule seulement après fécondation', W * .5, H * .96, DGREEN, 13); BH.a1(); } else TB('?', x, H * .08, GREY, 20);
      function chromLine(cx, cy) { LN(cx - 14, cy, cx + 14, cy, DRED, 4); [-10, 0, 10].forEach(function (d) { LN(cx + d, cy - 12, cx + d, cy + 12, BLUE_D, 3); }); }
    },
    /* 3 compter les gamètes */
    function (p) {
      var x0 = W * .06, w = W * .88;
      TB('250 spermatocytes I', x0, H * .1, BLUE_D, 13, 'left'); BH.rr(x0, H * .14, w * .25, 22, '#cfe3f8', BLUE_D, 3, 1.8);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); arrow(x0 + w * .27, H * .14 + 11, w * .05, 0, GREY, '', 2); BH.rr(x0 + w * .34, H * .14, w * .66, 22, '#cfeadf', DGREEN, 3, 1.8); TB('× 4 = 1 000 spermatozoïdes', x0 + w * .67, H * .14 + 16, DGREEN, 13); BH.a1(); }
      TB('250 ovocytes I', x0, H * .46, DRED, 13, 'left'); BH.rr(x0, H * .5, w * .25, 22, '#fbd9d8', DRED, 3, 1.8);
      if (p > 0) { BH.al(BH.ph(p, .3, .9)); arrow(x0 + w * .27, H * .5 + 11, w * .05, 0, GREY, '', 2); BH.rr(x0 + w * .34, H * .5, w * .22, 22, '#fbd9d8', DRED, 3, 1.8); TB('250 ovules', x0 + w * .45, H * .5 + 16, DRED, 12); BH.rr(x0 + w * .56, H * .5, w * .44, 22, '#e3e7ed', GREY, 3, 1.8); TB('750 globules polaires', x0 + w * .78, H * .5 + 16, GREY, 12); BH.a1(); }
      if (p > 0) BH.sol(p, 'ovogenèse : 1 ovule + 3 globules polaires (au plus)', W * .5, H * .86, DGREEN, 13);
    },
    /* 4 production continue */
    function (p) {
      var x0 = W * .08, w = W * .84, y = H * .4; TB('10⁸ spermatozoïdes / jour', W * .5, H * .1, BLUE_D, 15);
      LN(x0, y, x0 + w, y, INK, 2); for (var a = 13; a <= 40; a += 9) { LN(x0 + w * (a - 13) / 27, y - 5, x0 + w * (a - 13) / 27, y + 5, INK, 2); TB(a + ' ans', x0 + w * (a - 13) / 27, y + 22, GREY, 12); } TB('40 ans', x0 + w, y + 22, GREY, 12);
      var f = p > 0 ? BH.ph(p, 0, .8) : 0; BH.rr(x0, y - 20, w * f, 12, '#cfe3f8', BLUE_D, 3, 1.6);
      TB('(a) 10⁸ / 86 400 s ≈ 1 157 ≈ 1 200 par seconde', W * .5, H * .66, INK, 13);
      if (p > 0) { BH.al(BH.ph(p, .4, 1)); TB('(b) 27 ans × 365 j × 10⁸ ≈ 9,9·10¹¹', W * .5, H * .78, INK, 13); BH.sol(p, '≈ 10¹² spermatozoïdes', W * .5, H * .92, DGREEN, 16); BH.a1(); }
    },
    /* 5 ovocytes ovulés */
    function (p) {
      var x0 = W * .06, w = W * .88, bh = 26;
      [['naissance', 1000000, '#cfe3f8', BLUE_D, '1 000 000'], ['puberté', 350000, '#e3f4ec', DGREEN, '350 000'], ['ovulés', 400, '#fbd9d8', DRED, '≈ 400']].forEach(function (b, i) {
        var y = H * (.2 + i * .22); TB(b[0], x0, y - 8, b[3], 13, 'left'); BH.rr(x0, y, Math.max(3, w * b[1] / 1e6), bh, b[2], b[3], 3, 1.8); if (i === 0) TB(b[4], x0 + w - 8, y + 19, b[3], 14, 'right'); else TB(b[4], x0 + Math.max(3, w * b[1] / 1e6) + 8, y + 19, b[3], 14, 'left');
      });
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('400 / 1 000 000 = 0,04 %', W * .5, H * .78, DRED, 14); TB('400 / 350 000 ≈ 0,11 %', W * .5, H * .86, DRED, 14); BH.al(BH.ph(p, .5, 1)); BH.sol(p, 'presque tout le stock dégénère (atrésie)', W * .5, H * .96, DGREEN, 13); BH.a1(); }
    },
    /* 6 pas de règles à 12 ans */
    function (p) {
      var x0 = W * .08, w = W * .84, y = H * .56, mx = function (a) { return x0 + (a - 8) / 8 * w; };
      LN(x0, y, x0 + w, y, INK, 2.4); for (var a = 8; a <= 16; a += 2) { LN(mx(a), y - 5, mx(a), y + 5, INK, 2); TB(a + ' ans', mx(a), y + 20, GREY, 12); }
      DOT(mx(11), y, 8, ORANGE); TB('début du développement', mx(11) + 10, y - 38, ORANGE, 12, 'right'); TB('des seins (11 ans)', mx(11) + 10, y - 22, ORANGE, 12, 'right');
      ctx.fillStyle = 'rgba(29,158,117,.18)'; ctx.fillRect(mx(12.3), y - 14, mx(14.5) - mx(12.3), 28); TB('premières règles : en moyenne ≈ 2 ans après', mx(13.4), y + 46, DGREEN, 12);
      arrow(mx(12), y - 70, 0, 38, DRED, '', 3); TB('12 ans', mx(12), y - 76, DRED, 14);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); DOT(mx(13), y, 8, DGREEN); TB('≈ 13 ans', mx(13), y - 22, DGREEN, 13); BH.sol(p, 'tout à fait habituel : pas d’anomalie', W * .5, H * .95, DGREEN, 14); BH.a1(); }
    },
    /* 7 testostérone et dopage */
    function (p) {
      var bx = [W * .04, W * .38, W * .72], by = H * .3;
      [['hypophyse', '#fbe9d6', ORANGE], ['testicules', '#e3f4ec', DGREEN]].forEach(function (b, i) { var x = bx[i * 2 > 1 ? 2 : 0]; BH.rr(x, by, W * .24, H * .18, b[1], b[2], 10, 2.4); TB(b[0], x + W * .12, by + H * .11, b[2], 13); });
      arrow(W * .29, by + H * .09, W * .41, 0, BLUE, '', 3); TB('LH, FSH', W * .5, by + H * .09 - 8, BLUE_D, 13);
      var yb = by + H * .38; LN(bx[2] + W * .12, by + H * .18, bx[2] + W * .12, yb, RED, 3); LN(bx[2] + W * .12, yb, bx[0] + W * .12, yb, RED, 3); LN(bx[0] + W * .12, yb, bx[0] + W * .12, by + H * .19, RED, 3); LN(bx[0] + W * .12 - 12, by + H * .2, bx[0] + W * .12 + 12, by + H * .2, RED, 4);
      TB('testostérone : frein (−)', W * .5, yb + 16, DRED, 13);
      arrow(W * .86, H * .9, 0, -(H * .9 - yb) + 4, ORANGE, '', 3); TB('injection', W * .86, H * .96, ORANGE, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); TB('LH ↓ FSH ↓', W * .5, by - 16, DRED, 17); BH.al(BH.ph(p, .4, 1)); TB('testicules au repos : spermatogenèse ↓', W * .45, H * .93, DGREEN, 12); BH.a1(); }
    },
    /* 8 spermogramme */
    function (p) {
      var rows = [['concentration', 10, 16, 30, 'millions/mL', false], ['mobilité progressive', 45, 30, 70, '%', true], ['formes normales', 6, 4, 12, '%', true]], x0 = W * .3, w = W * .62;
      rows.forEach(function (r, i) {
        var y = H * (.22 + i * .22); TB(r[0], x0 - 8, y + 5, INK, 12.5, 'right'); BH.rr(x0, y - 9, w, 20, '#eef0f3', null, 3); BH.rr(x0, y - 9, w * r[1] / r[3], 20, r[5] || p === 0 ? '#cfe3f8' : '#fbd9d8', r[5] || p === 0 ? BLUE_D : DRED, 3, 1.8);
        LN(x0 + w * r[2] / r[3], y - 15, x0 + w * r[2] / r[3], y + 17, DRED, 2.4); TB('réf. ' + r[2], x0 + w * r[2] / r[3], y - 18, DRED, 11); TB(r[1], x0 + w * r[1] / r[3] - 6, y + 5, INK, 13, 'right');
        if (p > 0) { BH.al(BH.ph(p, i * .2, i * .2 + .4)); TB(r[5] ? '✓' : '✗', x0 + w + 6, y + 6, r[5] ? DGREEN : DRED, 18, 'left'); BH.a1(); }
      });
      if (p > 0) { BH.sol(p, 'seule la concentration est basse : à confirmer', W * .5, H * .9, DGREEN, 13); TB('(≠ stérilité)', W * .5, H * .97, GREY, 12); }
    },
    /* 9 ovocytes perdus par jour */
    function (p) {
      var O = { x: W * .16, y: H * .74 }, w = W * .76, h = H * .52, mx = function (a) { return O.x + (a - 12) / 25 * w; }, my = function (v) { return O.y - v / 400000 * h; };
      BH.axes(O.x, O.y, w + 6, h + 16, null, 'ovocytes'); TB('âge (ans)', O.x + w * .5, O.y + 30, GREY, 12);
      [12, 25, 37].forEach(function (a) { TB(a, mx(a), O.y + 14, GREY, 11); }); [25000, 350000].forEach(function (v) { TB(v >= 100000 ? '350 000' : '25 000', O.x - 4, my(v) + 4, GREY, 11, 'right'); });
      BH.fn(function (a) { return 350000 - 13000 * (a - 12); }, 12, 37, mx, my, BLUE, 3.4, 40); DOT(mx(12), my(350000), 5, BLUE_D); DOT(mx(37), my(25000), 5, DRED);
      TB('perte : 325 000 en 25 ans', W * .52, H * .14, INK, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('13 000 / an ≈ 36 / jour', W * .52, H * .23, DRED, 15); BH.al(BH.ph(p, .5, 1)); TB('12 ovulations par an : 12 / 13 000 ≈ 0,09 %', W * .5, H * .95, DGREEN, 12.5); BH.a1(); }
    },
    /* 10 chronologie */
    function (p) {
      var x0 = W * .05, w = W * .9, y = H * .46; LN(x0, y, x0 + w, y, INK, 2.4);
      var ev = [['avant naissance', 'ovocyte I bloqué\nen prophase I', .12], ['puberté (cycles)', 'méiose I finie :\novocyte II + GP1', .37], ['ovulation', 'ovocyte II libéré\n(métaphase II)', .63], ['fécondation', 'méiose II finie :\novule + GP2', .88]];
      ev.forEach(function (e, i) { var x = x0 + w * e[2]; DOT(x, y, 7, i === 3 ? DGREEN : BLUE_D); TB(e[0], x, y - 24, i === 3 ? DGREEN : BLUE_D, 12); e[1].split('\n').forEach(function (s, k) { TB(s.trim(), x, y + 28 + k * 15, i === 3 ? DGREEN : INK, 11); }); });
      if (p > 0) { BH.al(BH.ph(p, 0, .7)); LN(x0 + w * .08, y - 50, x0 + w * .9, y - 50, DGREEN, 3); TB('seule la 2ᵉ proposition est correcte', W * .5, y - 62, DGREEN, 13); BH.a1(); BH.sol(p, 'la méiose II ne s’achève que s’il y a fécondation', W * .5, H * .93, DGREEN, 13); } else TB('quel enchaînement ?', W * .5, H * .1, GREY, 15);
    }
  ]);
})();
