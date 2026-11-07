/* Biologie 5e · chapitre 10 : embryogenèse, développement et grossesse */
(function () {
  var C = 'c10';
  var LEN = [[2, .02], [4, .2], [6, .6], [8, 1.6], [12, 6], [20, 25], [32, 42], [40, 50]], WGT = [[2, 0], [8, 1], [12, 14], [20, 300], [32, 1700], [40, 3400]];

  function fetus(x, y, s, col) {                  /* silhouette enroulée simplifiée, s = taille de base */
    ctx.fillStyle = col || '#fbd9c9'; ctx.strokeStyle = ORA2; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, y, s * 1.0, s * .78, -.3, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x - s * .75, y - s * .5, s * .5, 0, 7); ctx.fill(); ctx.stroke();
    DOT(x - s * .85, y - s * .55, Math.max(1, s * .06), ORA2);
  }
  function hb(x, y, col, blocked) { BH.rr(x - 9, y - 9, 18, 18, blocked ? '#dcdfe4' : col, blocked ? GREY : DRED, 4, 1.8); TB(blocked ? 'CO' : 'O₂', x, y + 4, blocked ? '#555' : '#fff', 10); }

  SFA.theo(C, {
    icon: function () {
      fetus(W * .3, H * .46, 46); TB('40 SA', W * .68, H * .4, BLUE_D, 34); TB('de zygote à nouveau-né', W * .62, H * .66, ORANGE, 18); TB('grossesse', W * .5, H * .9, BLUE_D, 20);
    },
    anim: function (t) {
      var u = (t % 600) / 600, sa = 2 + u * 38, len = BH.it(LEN, sa), wg = BH.it(WGT, sa);
      var stage = sa < 3 ? 'zygote, morula, blastocyste' : sa < 11 ? 'embryon : organogenèse' : 'fœtus : croissance et maturation';
      TB('Du zygote au nouveau-né (en semaines d’aménorrhée)', W * .5, 16, BLUE_D, 14);
      var cx = W * .25, cy = H * .42, s = 4 + Math.sqrt(len) * 5.4;
      BH.ci(cx, cy, H * .3, '#fdf4ee', ORANGE, 2); TB('utérus', cx, cy + H * .3 - 8, ORANGE, 11);
      if (sa < 3) BH.ci(cx, cy, 5 + (sa - 2) * 10, '#fff', ORA2, 2.4); else fetus(cx + 10, cy + 2, Math.min(s, H * .17));
      TB(stage, W * .66, H * .2, sa < 11 ? DRED : DGREEN, 14);
      TB('SA ' + Math.floor(sa), W * .66, H * .34, BLUE_D, 24);
      TB('taille ≈ ' + BH.fx(len < 10 ? Math.round(len * 10) / 10 : Math.round(len), len < 10 ? 1 : 0) + ' cm', W * .66, H * .46, INK, 14); TB('poids ≈ ' + (wg < 1 ? '< 1' : Math.round(wg)) + ' g', W * .66, H * .56, INK, 14);
      var x0 = W * .06, w = W * .88, y = H * .84; BH.rr(x0, y, w, 12, '#e3e7ed', null, 4); BH.rr(x0 + w * 2 / 40, y, w * 8 / 40, 12, '#f7d9d8', null, 0); BH.rr(x0 + w * 10 / 40, y, w * 30 / 40, 12, '#cfeadf', null, 0);
      LN(x0 + w * 2 / 40, y - 4, x0 + w * 2 / 40, y + 16, RED, 2); DOT(x0 + w * sa / 40, y + 6, 8, BLUE_D);
      TB('2 : fécondation', x0 + w * 2 / 40, y + 30, DRED, 11); TB('10', x0 + w * 10 / 40, y + 30, GREY, 11); TB('40 : terme', x0 + w, y + 30, DGREEN, 11, 'right'); TB('embryon', x0 + w * 6 / 40, y - 8, DRED, 11); TB('fœtus', x0 + w * 25 / 40, y - 8, DGREEN, 11);
    },
    th:
      '<div class="tcard"><b class="h">Les grandes étapes</b><p>Fécondation (dans la trompe) → <b>zygote</b> → divisions : <b>morula</b> (J+3), <b>blastocyste</b> (J+5) → <b>nidation</b> (J+6 à J+10) → <b>gastrulation et organogenèse</b> : l’<b>embryon</b> (jusqu’à 10 SA, soit 8 semaines de développement) ébauche tous les organes → <b>fœtus</b> (de la 11<sup>e</sup> SA à la naissance) : croissance et maturation. Les <b>semaines d’aménorrhée (SA)</b> se comptent depuis le début des dernières règles ; la fécondation a lieu vers 2 SA. <b>Terme : 40 SA</b> = 38 semaines de développement = 266 jours.</p></div>' +
      '<div class="tcard"><b class="h">Le placenta</b><p>Il relie l’embryon à l’utérus : le sang maternel et le sang fœtal circulent de part et d’autre d’une <b>barrière mince</b> et <b>ne se mélangent pas</b>. Par diffusion, O₂ et nutriments passent vers le fœtus ; CO₂ et urée vont vers la mère. Le flux de diffusion est proportionnel à <b>surface × différence de pression / épaisseur</b> : un placenta plus petit ou plus épais fournit moins d’oxygène. Le placenta sécrète aussi des hormones (hCG, progestérone, œstrogènes) et laisse passer des anticorps maternels.</p></div>' +
      '<div class="tcard"><b class="h">Hémoglobine fœtale</b><p>La saturation en O₂ dépend de la pression P : <b>S = Pⁿ / (Pⁿ + P₅₀ⁿ)</b>. L’hémoglobine fœtale (HbF) a une <b>affinité plus forte</b> (P₅₀ ≈ 19 mmHg contre 27 mmHg pour l’HbA) : à 30 mmHg, HbF ≈ 77 % saturée contre ≈ 57 % pour HbA, donc elle capte l’O₂ du sang maternel. <b>Contenu en O₂ :</b> [Hb] × 1,34 × S + O₂ dissous. Le CO du tabac occupe l’hémoglobine (− 10 % de transport pour 10 % occupés).</p></div>' +
      '<div class="tcard"><b class="h">Périodes critiques et tératogènes</b><p>Un <b>tératogène</b> (alcool, thalidomide, rubéole, tabac, rayons…) agit selon le <b>moment</b> : pendant les 2 premières semaines de développement, c’est « tout ou rien » (échec de la nidation ou aucune conséquence) ; pendant l’<b>organogenèse</b>, risque de <b>malformations</b> de l’organe en formation à ce moment (membres entre 4 et 6 semaines) ; ensuite, effets sur la croissance et le système nerveux, qui reste vulnérable toute la grossesse. Aucune dose d’alcool n’est sans risque connu.</p></div>' +
      '<div class="tcard"><b class="h">Jumeaux</b><p><b>Monozygotes</b> (« vrais ») : un zygote qui se scinde ; génomes identiques, <b>même sexe</b>. <b>Dizygotes</b> (« faux ») : deux ovocytes fécondés par deux spermatozoïdes ; génomes différents comme des frères et sœurs, sexes identiques ou différents. Fille + garçon → forcément dizygotes. <b>Estimation de Weinberg :</b> les dizygotes de sexes différents représentent la moitié des dizygotes, donc DZ = 2 × (paires de sexes différents). <b>Exemple :</b> 1 000 paires dont 300 mixtes → DZ = 600, MZ = 400 (40 %).</p></div>'
  });

  SFA.figs(C, [
    /* 1 semaines d'aménorrhée */
    function (p) {
      var x0 = W * .06, w = W * .88, y = H * .4, mx = function (s) { return x0 + s / 40 * w; };
      TB('semaines d’aménorrhée (SA)', x0, H * .12, BLUE_D, 13, 'left'); LN(x0, y, x0 + w, y, INK, 2.4);
      [0, 2, 10, 24, 40].forEach(function (s) { LN(mx(s), y - 5, mx(s), y + 5, INK, 2); TB(s, mx(s), y - 12, BLUE_D, 12); });
      TB('règles', mx(0) - 2, y + 36, GREY, 11, 'left'); TB('fécondation', mx(2) + 8, y + 20, DRED, 11, 'left'); TB('terme', mx(40), y + 20, DGREEN, 11, 'right'); DOT(mx(24), y, 6, ORANGE);
      if (p > 0) {
        BH.al(BH.ph(p, 0, .5)); LN(mx(2), y + 48, mx(24), y + 48, ORANGE, 3); TB('(a) 24 − 2 = 22 semaines de développement', (mx(2) + mx(24)) / 2, y + 66, ORANGE, 13);
        BH.al(BH.ph(p, .4, 1)); LN(mx(2), y + 90, mx(40), y + 90, DGREEN, 3); TB('(b) 40 − 2 = 38 semaines = 266 jours', (mx(2) + mx(40)) / 2, y + 108, DGREEN, 13); BH.a1();
      }
    },
    /* 2 placenta */
    function (p) {
      BH.rr(W * .04, H * .14, W * .34, H * .66, '#fdeaea', RED, 14, 2.4); TB('sang maternel', W * .21, H * .24, DRED, 13);
      BH.rr(W * .62, H * .14, W * .34, H * .66, '#e6f1fb', BLUE_D, 14, 2.4); TB('sang fœtal', W * .79, H * .24, BLUE_D, 13);
      BH.rr(W * .4, H * .14, W * .2, H * .66, '#f4f1ea', ORANGE, 6, 2); TB('barrière', W * .5, H * .22, ORANGE, 12); TB('placentaire', W * .5, H * .22 + 14, ORANGE, 12);
      arrow(W * .24, H * .42, W * .5, 0, BLUE_D, '', 3.2); TB('O₂, nutriments', W * .5, H * .38, BLUE_D, 12); arrow(W * .76, H * .6, -W * .5, 0, DRED, '', 3.2); TB('CO₂, urée', W * .5, H * .66, DRED, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); LN(W * .5, H * .3, W * .5, H * .75, GREEN, 0); TB('✗ pas de mélange des sangs', W * .5, H * .9, DGREEN, 14); BH.sol(p, 'diffusion à travers la barrière', W * .5, H * .96, DGREEN, 12); BH.a1(); }
    },
    /* 3 croissance du fœtus */
    function (p) {
      var O = { x: W * .12, y: H * .82 }, w = W * .8, h = H * .62, mx = function (s) { return O.x + (s - 8) / 32 * w; }, my = function (g) { return O.y - g / 3600 * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, null, 'masse (g)'); TB('SA', O.x + w, O.y + 28, GREY, 12, 'right'); [8, 12, 24, 32, 40].forEach(function (s) { TB(s, mx(s), O.y + 14, GREY, 11); });
      var pts = [[8, 1], [12, 14], [20, 300], [32, 1700], [40, 3400]]; BH.poly(pts.map(function (q) { return [mx(q[0]), my(q[1])]; }), BLUE, 3.2);
      [[8, 1], [12, 14], [32, 1700], [40, 3400]].forEach(function (q) { DOT(mx(q[0]), my(q[1]), 5, BLUE_D); TB(q[1].toLocaleString('fr-FR'), mx(q[0]) - 6, my(q[1]) - 8, BLUE_D, 12, 'right'); });
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('3 400 / 1 = × 3 400', W * .42, H * .2, DRED, 15); BH.al(BH.ph(p, .4, 1)); LN(mx(32), my(1700), mx(40), my(1700), DGREEN, 2, [4, 3]); TB('(3 400 − 1 700) / 3 400 = 50 % gagnés après 32 SA', W * .52, H * .96, DGREEN, 12.5); BH.a1(); }
    },
    /* 4 flux d'O2 placentaire */
    function (p) {
      [[W * .26, 'référence', 12, 5, 100, BLUE_D], [W * .74, 'placenta altéré', 7.2, 7.5, 40, DRED]].forEach(function (c, k) {
        var x = c[0]; TB(c[1], x, H * .08, c[5], 14);
        BH.rr(x - 34, H * .2, 68 * c[2] / 12, 44, '#e6f1fb', c[5], 6, 2); TB('surface ' + BH.fx(c[2]) + ' m²', x, H * .2 - 8, c[5], 12);
        BH.rr(x - 34, H * .2 + 54, 68, c[3] * 3 + 4, '#fff3c9', ORANGE, 3, 1.8); TB('épaisseur ' + BH.fx(c[3]) + ' µm', x, H * .2 + 54 + c[3] * 3 + 18, ORANGE, 12);
        var bh = H * .17 * c[4] / 100; if (p > 0 || k === 0) { BH.al(k ? BH.ph(p, 0, .6) : 1); BH.rr(x - 11, H * .8 - bh - 2, 22, bh + 2, k ? '#fbd9d8' : '#cfe3f8', c[5], 2, 2); TB('flux ' + c[4] + ' %', x, H * .8 - bh - 8, c[5], 13); BH.a1(); }
      });
      TB('flux ∝ S × ΔP / e', W * .5, H * .97, INK, 13);
      if (p > 0) { BH.al(BH.ph(p, .4, 1)); TB('(7,2 / 12) × (5 / 7,5) = 0,6 × 0,67 = 0,40', W * .5, H * .89, DGREEN, 13); BH.a1(); }
    },
    /* 5 hémoglobine fœtale */
    function (p) {
      var O = { x: W * .12, y: H * .8 }, w = W * .8, h = H * .62, mx = function (P) { return O.x + P / 80 * w; }, my = function (S) { return O.y - S * h; };
      BH.axes(O.x, O.y, w + 6, h + 14, null, 'saturation'); TB('P (mmHg)', O.x + w * .5, O.y + 30, GREY, 12); [20, 40, 60, 80].forEach(function (P) { TB(P, mx(P), O.y + 14, GREY, 11); }); [.5, 1].forEach(function (S) { TB(S === 1 ? '100 %' : '50 %', O.x - 4, my(S) + 4, GREY, 11, 'right'); });
      var S = function (P, p50) { return Math.pow(P, 2.7) / (Math.pow(P, 2.7) + Math.pow(p50, 2.7)); };
      BH.fn(function (P) { return S(P, 27); }, 0, 80, mx, my, RED, 3.2, 100); BH.fn(function (P) { return S(P, 19); }, 0, 80, mx, my, BLUE, 3.2, 100);
      TB('HbA (P₅₀ = 27)', mx(52), my(.78) + 22, DRED, 12, 'left'); TB('HbF (P₅₀ = 19)', mx(36), my(.97) - 8, BLUE_D, 12, 'left'); LN(mx(30), O.y, mx(30), my(.8), GREY, 1.4, [4, 3]); TB('30', mx(30), O.y + 28, GREY, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); DOT(mx(30), my(.571), 6, RED); DOT(mx(30), my(.774), 6, BLUE); TB('57 %', mx(30) + 8, my(.571) + 14, DRED, 14, 'left'); TB('77 %', mx(30) - 8, my(.774) - 8, BLUE_D, 14, 'right'); BH.al(BH.ph(p, .5, 1)); BH.sol(p, 'HbF : plus d’affinité pour l’O₂', W * .5, H * .96, DGREEN, 13); BH.a1(); }
    },
    /* 6 moment dangereux */
    function (p) {
      var x0 = W * .28, w = W * .68, mx = function (s) { return x0 + s / 14 * w; }, y0 = H * .15;
      [['tout ou rien', 0, 2, GREY], ['membres', 4, 6, DRED], ['système nerveux', 3, 14, ORANGE]].forEach(function (r, i) { var y = y0 + i * H * .17; TB(r[0], x0 - 8, y + 5, INK, 11.5, 'right'); BH.rr(x0, y - 8, w, 16, '#f0f2f5', null, 4); BH.rr(mx(r[1]), y - 8, mx(r[2]) - mx(r[1]), 16, r[3] === GREY ? '#d7dde5' : r[3] === DRED ? '#fbd9d8' : '#fbe4c8', r[3], 4, 1.8); });
      LN(x0, H * .64, x0 + w, H * .64, INK, 2); [0, 2, 4, 6, 8, 10, 12, 14].forEach(function (s) { LN(mx(s), H * .64 - 4, mx(s), H * .64 + 4, INK, 1.6); TB(s, mx(s), H * .64 + 16, GREY, 11); }); TB('semaines après la fécondation (schéma)', x0 + w / 2, H * .64 + 31, GREY, 11);
      LN(mx(12), y0 - 22, mx(12), H * .64, RED, 2.4, [5, 4]); TB('prise à 12 sem.', mx(12), y0 - 28, DRED, 12);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); TB('membres déjà formés : pas de malformation des membres', W * .5, H * .87, DGREEN, 12.5); TB('mais d’autres effets restent possibles', W * .5, H * .95, ORANGE, 12.5); BH.a1(); }
    },
    /* 7 tabagisme et oxygène */
    function (p) {
      TB('16 g d’hémoglobine par dL', W * .5, H * .1, INK, 13);
      for (var i = 0; i < 10; i++) hb(W * (.14 + i * .08), H * .3, i < 8 ? RED : RED, p > 0 && i === 9);
      TB('contenu en O₂ = 16 × 1,34 × 0,774 + 0,09', W * .5, H * .5, BLUE_D, 13); TB('≈ 16,7 mL/dL', W * .5, H * .6, BLUE_D, 18);
      if (p > 0) { BH.al(BH.ph(p, 0, .5)); TB('CO sur 10 % de l’hémoglobine', W * .5, H * .43, '#555', 12); BH.al(BH.ph(p, .4, 1)); TB('14,4 × 1,34 × 0,774 + 0,09 ≈ 15,0 mL/dL', W * .5, H * .76, DRED, 13); BH.sol(p, '− 10 % de l’oxygène transporté', W * .5, H * .92, DRED, 15); BH.a1(); }
    },
    /* 8 jumeaux fille et garçon */
    function (p) {
      [[W * .26, 'monozygotes', false], [W * .74, 'dizygotes', true]].forEach(function (c, k) {
        var x = c[0]; TB(c[1], x, H * .08, k && p > 0 ? DGREEN : BLUE_D, 14);
        if (!c[2]) { BH.ci(x, H * .26, 15, '#fff', ORANGE, 2); TB('XX', x, H * .26 + 4, ORANGE, 11); arrow(x, H * .38, 0, H * .1, GREY, '', 2.4); TB('1 zygote scindé', x + 12, H * .44, GREY, 11, 'left'); BH.ci(x - 24, H * .66, 14, '#fdeaea', DRED, 2); BH.ci(x + 24, H * .66, 14, '#fdeaea', DRED, 2); TB('XX', x - 24, H * .66 + 4, DRED, 11); TB('XX', x + 24, H * .66 + 4, DRED, 11); TB('même sexe', x, H * .85, GREY, 12); }
        else { BH.ci(x - 26, H * .22, 14, '#fff', ORANGE, 2); BH.ci(x + 26, H * .22, 14, '#fff', ORANGE, 2); TB('2 ovocytes', x, H * .36, ORANGE, 11); arrow(x - 26, H * .4, 0, H * .09, GREY, '', 2.4); arrow(x + 26, H * .4, 0, H * .09, GREY, '', 2.4); BH.ci(x - 26, H * .66, 14, '#fdeaea', DRED, 2); BH.ci(x + 26, H * .66, 14, '#e6f1fb', BLUE_D, 2); TB('XX', x - 26, H * .66 + 4, DRED, 11); TB('XY', x + 26, H * .66 + 4, BLUE_D, 11); TB('fille', x - 26, H * .66 + 28, DRED, 12); TB('garçon', x + 26, H * .66 + 28, BLUE_D, 12); }
      });
      TB('?', W * .5, H * .5, GREY, 26);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); BH.sol(p, 'fille + garçon : forcément dizygotes', W * .5, H * .96, DGREEN, 14); BH.a1(); }
    },
    /* 9 Weinberg */
    function (p) {
      var x0 = W * .06, w = W * .88;
      [['(a)–(b) 700 + 300', [300, 300, 400], 1000, 'DZ ≠ sexe : 300 = ½ DZ → DZ = 600 · MZ = 400 (40 %)'], ['(c) 750 + 250', [250, 250, 500], 1000, 'DZ = 500 · MZ = 500 (50 %)']].forEach(function (r, k) {
        var y = H * (.3 + k * .34); TB(r[0], x0, y - 28, INK, 12.5, 'left'); var x = x0;
        [['DZ mixtes', '#e6f1fb', BLUE_D], ['DZ même sexe', '#cfe3f8', BLUE_D], ['MZ', '#fbd9d8', DRED]].forEach(function (s, i) {
          var wv = w * r[1][i] / r[2]; if (p > 0 || i === 0) { BH.rr(x, y, wv, 32, s[1], s[2], 3, 1.8); TB(r[1][i], x + wv / 2, y + 21, s[2], 14); if (k === 0) TB(s[0], x + wv / 2, y - 6, s[2], 11); } x += wv;
        });
        if (p > 0) { BH.al(BH.ph(p, k * .4, k * .4 + .5)); TB(r[3], W * .5, y + 52, DGREEN, 12.5); BH.a1(); }
      });
      if (!p) TB('part des monozygotes ?', W * .5, H * .62, GREY, 14);
    },
    /* 10 soirée avant le retard */
    function (p) {
      var x0 = W * .06, w = W * .88, y = H * .5, mx = function (s) { return x0 + s / 10 * w; };
      BH.rr(mx(2), y - 14, mx(4) - mx(2), 28, '#e3e7ed', GREY, 3, 1.6); TB('tout ou rien', (mx(2) + mx(4)) / 2, y - 22, GREY, 11); BH.rr(mx(4), y - 14, mx(10) - mx(4), 28, '#fbe4c8', ORANGE, 3, 1.6); TB('organogenèse : malformations', (mx(4) + mx(10)) / 2, y + 4, ORANGE, 12);
      LN(x0, y + 34, x0 + w, y + 34, INK, 2); for (var s = 0; s <= 10; s += 2) { LN(mx(s), y + 30, mx(s), y + 38, INK, 1.6); TB(s, mx(s), y + 52, GREY, 11); }
      DOT(mx(3), y - 52, 7, RED); LN(mx(3), y - 46, mx(3), y - 14, RED, 2); TB('soirée : 3 SA', mx(3), y - 70, DRED, 13); TB('(≈ 1 sem. après fécondation)', mx(3) + 10, y - 86, DRED, 11);
      DOT(mx(7), y - 52, 7, BLUE); LN(mx(7), y - 46, mx(7), y - 14, BLUE, 2); TB('7 SA : grossesse connue', mx(7), y - 70, BLUE_D, 13);
      if (p > 0) { BH.al(BH.ph(p, 0, .6)); BH.sol(p, 'période « tout ou rien » : pas d’effet sur l’embryon si la grossesse continue', W * .5, H * .86, DGREEN, 12.5); BH.al(BH.ph(p, .5, 1)); TB('mais éviter tout alcool dès maintenant', W * .5, H * .95, DRED, 13); BH.a1(); }
    }
  ]);
})();
