/* Physique 3e · chapitre 2 · Le circuit électrique et le courant (utilise les aides q_* de theo-01.js) */
(function () {
  function arrowH(x, y, len, col, lab, w) { A(x, y, len, 0, col, '', w || 3); if (lab) TB(lab, x + len / 2, y - 12, dk(col), 14); }
  function ampoule(x, y, b) {
    if (b > .02) { var g = ctx.createRadialGradient(x, y, 4, x, y, 70); g.addColorStop(0, 'rgba(255,214,60,' + .8 * b + ')'); g.addColorStop(1, 'rgba(255,214,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 70, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,240,170,' + (.2 + .7 * b) + ')'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 10, y + 28); ctx.lineTo(x - 10, y + 6); ctx.bezierCurveTo(x - 10, y - 8, x + 10, y - 8, x + 10, y + 6); ctx.lineTo(x + 10, y + 28); ctx.strokeStyle = b > .3 ? ORA2 : GREY; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#d5d8dc'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 16, y + 30, 32, 24, 3); ctx.fill(); ctx.stroke();
    LN(x - 16, y + 38, x + 16, y + 38, INK, 1.2); LN(x - 16, y + 46, x + 16, y + 46, INK, 1.2);
    DOT(x, y + 60, 5, INK); // plot central
    return { culot: [x - 16, y + 42], plot: [x, y + 62] };
  }
  function pilePlate(x, y, lab) { /* pile plate : corps + bornes + et − */
    ctx.fillStyle = '#eef6ef'; ctx.strokeStyle = DGREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - 50, y - 18, 100, 36, 6); ctx.fill(); ctx.stroke();
    q_sign(x - 28, y, 1, 20); q_sign(x + 28, y, -1, 20); if (lab) TB(lab, x, y + 6, DGREEN, 13);
    return { plus: [x - 28, y - 18], minus: [x + 28, y - 18] };
  }
  function elecs(x0, y0, x1, y1, n, off, gaps, S) {
    for (var i = 0; i < n; i++) { var s = i / n + off; var q = q_pos(x0, y0, x1, y1, s); q_elec(q[0], q[1], S || 5); }
  }

  SFA.theo("c02", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      var x0 = 80, y0 = 50, x1 = 380, y1 = 170;
      q_rect(x0, y0, x1, y1, [['t', 230, 24], ['r', 110, 22], ['l', 110, 12]]);
      q_pile(x0, 110, 'v'); q_inter(230, y0, true); q_lampe(x1, 110, 1, 18);
      for (var i = 0; i < 14; i++) { var q = q_pos(x0, y0, x1, y1, -i / 14 + .02); if (!((q[1] === y0 && Math.abs(q[0] - 230) < 26) || (q[0] === x1 && Math.abs(q[1] - 110) < 24) || (q[0] === x0 && Math.abs(q[1] - 110) < 14))) q_elec(q[0], q[1], 5); }
      A(160, 28, 40, 0, RED, '', 3);
      TB('circuit fermé', 230, 215, BLUE_D, 24); TB('I', 330, 238, ORANGE, 17); TB('e⁻ : − → +', 130, 238, BLUE_D, 15);
    }),
    anim: q_an(function (t) {
      var T = 600, tt = t % T, closed = tt > 140 && tt < 460, tc = q_c(tt - 140, 0, 320);
      var x0 = 130, y0 = 70, x1 = 570, y1 = 220;
      q_rect(x0, y0, x1, y1, [['t', 350, 28], ['r', 145, 22], ['l', 145, 16]]);
      var off = closed ? -(tc * 12 / 320 / 28) : -(12 / 28 * (tt >= 460 ? 1 : 0));
      if (tt >= 460) off = -(12 / 28);
      for (var i = 0; i < 28; i++) { q_elec(q_pos(x0, y0, x1, y1, i / 28 + off)[0], q_pos(x0, y0, x1, y1, i / 28 + off)[1], 5.5); }
      var lamp = closed ? q_c((tt - 140) / 10, 0, 1) : (tt >= 460 ? q_c(1 - (tt - 460) / 10, 0, 1) : 0);
      q_pile(x0, 145, 'v', ''); q_inter(350, y0, closed, ''); q_lampe(x1, 145, lamp, 20);
      TB('+', x0 - 22, 140, DRED, 20); TB('−', x0 - 22, 175, BLUE_D, 22);
      TB('pile', x0 - 38, 112, DGREEN, 14); TB('interrupteur', 350, y0 + 32, INK, 14); TB('lampe', x1, 190, INK, 14);
      if (closed) {
        A(300, y0 - 12, 100, 0, RED, '', 3.2); TB('courant conventionnel : + → −', 350, 40, DRED, 14);
        A(260, y1 + 22, 180, 0, BLUE, '', 3); TB('électrons : − → +  (tous en même temps)', 350, 265, BLUE_D, 14);
        TB('lampe allumée', 350, 145, DGREEN, 16);
      } else {
        TB('circuit ouvert : aucun courant, la lampe est éteinte', 350, 145, DRED, 16);
        TB('les électrons existent déjà dans les fils, mais restent sur place', 350, 265, GREY, 14);
      }
    }),
    th:
      '<div class="tcard"><b class="h">Les éléments d\'un circuit</b><p>Un circuit électrique comprend au minimum un <b>générateur</b> (pile, batterie, prise), un <b>récepteur</b> (lampe, moteur, résistance…) et des <b>fils conducteurs</b>, souvent un <b>interrupteur</b>. Pour qu\'un courant circule, la boucle doit être <b>fermée</b> : un interrupteur ouvert, un fil coupé ou un récepteur grillé interrompent tout le circuit.</p><ul><li>On dessine un <b>schéma normalisé</b> : fils en traits droits avec angles à 90°, symboles pour la pile (barre longue = <b>+</b>, barre courte = <b>−</b>), la lampe (cercle croisé), l\'interrupteur, la résistance (rectangle).</li><li>Une lampe a <b>deux bornes</b> : le culot et le plot central. Il faut relier chacune à une borne de la pile.</li></ul></div>' +
      '<div class="tcard"><b class="h">Le courant électrique</b><p>Dans un métal, des <b>électrons libres</b> se déplacent dans le réseau d\'atomes. Quand le circuit est fermé, la pile les met tous en mouvement d\'ensemble : c\'est le <b>courant électrique</b>. La pile ne « fournit » pas les électrons, elle les met en circulation.</p><ul><li>Les électrons vont de la borne <b>−</b> vers la borne <b>+</b> à l\'extérieur de la pile.</li><li>Par convention, historique, le <b>sens conventionnel du courant</b> est l\'inverse : de la borne <b>+</b> vers la borne <b>−</b>. C\'est le sens des flèches sur les schémas.</li></ul></div>' +
      '<div class="tcard"><b class="h">Lent, mais instantané</b><p>Les électrons avancent très lentement (de l\'ordre de <b>0,1 mm/s</b>), mais tous ceux du circuit démarrent <b>en même temps</b>, y compris ceux du filament de la lampe : elle s\'allume presque instantanément. C\'est comme un tuyau plein d\'eau : on pousse d\'un côté, l\'eau sort aussitôt de l\'autre.</p><p><b>Exemple :</b> I = 3 A dans un fil de cuivre de section S = 2 mm² (n = 8,5·10<sup>28</sup> électrons libres par m³). La vitesse de dérive vaut v = I / (n·e·S) = 3 / (8,5·10<sup>28</sup> × 1,6·10<sup>−19</sup> × 2·10<sup>−6</sup>) ≈ 1,1·10<sup>−4</sup> m/s ≈ <b>0,11 mm/s</b> : un électron met environ 2 h 30 pour parcourir 1 m.</p></div>' +
      '<div class="tcard"><b class="h">Conducteurs et isolants</b><ul><li><b>Conducteurs</b> : métaux (cuivre, aluminium, fer), graphite (mine de crayon), corps humain, eau salée.</li><li><b>Isolants</b> : plastique, caoutchouc, verre, bois sec, air, eau distillée.</li><li>Dans l\'eau salée, ce sont des <b>ions</b> qui transportent le courant ; l\'eau distillée en contient très peu.</li></ul><p>Un <b>testeur de continuité</b> (pile + lampe + deux pinces) permet de classer un matériau : la lampe brille s\'il conduit.</p></div>' +
      '<div class="tcard"><b class="h">Court-circuit : le danger</b><p>Il y a court-circuit quand un fil de résistance quasi nulle relie directement les deux bornes de la pile (ou les deux bornes d\'un récepteur). Le courant devient <b>énorme</b> : fils et pile chauffent, risque de brûlure ou d\'incendie. La chaleur dégagée est proportionnelle à I² : si I est multipliée par 11, la chaleur l\'est par 11² ≈ 120.</p><ul><li>Un fil branché en parallèle sur une lampe la <b>court-circuite</b> : elle s\'éteint, car tout le courant passe par le fil.</li><li>Les <b>fusibles</b> et disjoncteurs coupent le circuit en cas de surintensité.</li><li>Piège : <b>deux piles tête-bêche</b> (+ face à +) s\'annulent : 1,5 V − 1,5 V = 0 V, la lampe reste éteinte.</li></ul></div>'
  });

  function sw(x, y, closed) { q_inter(x, y, closed); }
  SFA.figs("c02", [
    /* 0 Lampe éteinte */
    q_fig(function (p) {
      var c = q_s(p, .05, .5), x0 = 70, y0 = 70, x1 = 390, y1 = 210;
      q_rect(x0, y0, x1, y1, [['t', 230, 24], ['r', 140, 22], ['l', 140, 12]]);
      q_pile(x0, 140, 'v'); TB('pile', x0 - 30, 112, DGREEN, 14);
      LN(212, y0, 248, y0 - 16 * (1 - c), INK, 2.6); ctx.fillStyle = '#fff'; ctx.fillRect(206, y0 - 14, 12, 28); DOT(212, y0, 3.5, INK); DOT(248, y0, 3.5, INK);
      ctx.fillStyle = '#fff'; ctx.fillRect(212, y0 - 4, 36, 8); LN(212, y0, 248, y0 - 17 * (1 - c), INK, 2.6); DOT(212, y0, 3.5, INK); DOT(248, y0, 3.5, INK);
      q_lampe(x1, 140, c, 22);
      TB('interrupteur ' + (c > .5 ? 'fermé' : 'ouvert'), 230, y0 - 28, c > .5 ? DGREEN : DRED, 15); TB('lampe', 345, 150, INK, 14, 'right');
      if (c > .6) { for (var i = 0; i < 12; i++) { var q = q_pos(x0, y0, x1, y1, i / 12 + .03); if (!(q[1] === y0 && Math.abs(q[0] - 230) < 26) && !(q[0] === x1 && Math.abs(q[1] - 140) < 26) && !(q[0] === x0 && Math.abs(q[1] - 140) < 16)) q_elec(q[0], q[1], 5); } TB('boucle fermée : la lampe brille', 230, 262, DGREEN, 16); }
      else TB('boucle ouverte : pas de courant', 230, 262, DRED, 16);
    }),
    /* 1 Deux sens */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 70, y0 = 70, x1 = 390, y1 = 210;
      q_rect(x0, y0, x1, y1, [['t', 230, 24], ['r', 140, 22], ['l', 140, 12]]);
      q_pile(x0, 140, 'v'); q_inter(230, y0, true); q_lampe(x1, 140, 1, 22);
      TB('+', x0 - 20, 130, DRED, 22); TB('−', x0 - 20, 160, BLUE_D, 24);
      if (g > 0) {
        A(150, y0 - 18, 80 * g, 0, RED, '', 3.4); if (g > .8) TB('(a) courant conventionnel : + → −', 230, 38, DRED, 14);
        A(150 + 80 * 0, y1 + 20, 130 * g, 0, BLUE, '', 3.4); if (g > .8) TB('(b) électrons : − → +', 230, 264, BLUE_D, 14);
        for (var i = 0; i < 8; i++) { var q = q_pos(x0, y0, x1, y1, -i / 8 + .5); if (q[0] > x0 + 20 && q[0] < x1 - 20 || q[1] === y1) q_elec(q[0], q[1], 5); }
      } else TB('sens du courant ?   sens des électrons ?', 230, 38, GREY, 15);
    }),
    /* 2 Allumage immédiat */
    q_fig(function (p) {
      var g = q_s(p, 0, .4), x0 = 40, y0 = 90, x1 = 420, y1 = 200;
      q_rect(x0, y0, x1, y1, [['t', 230, 24], ['r', 145, 22], ['l', 145, 12]]);
      q_pile(x0, 145, 'v'); q_inter(230, y0, true); q_lampe(x1, 145, g, 20);
      for (var i = 0; i < 26; i++) { var q = q_pos(x0, y0, x1, y1, i / 26 + .01); if (!(q[1] === y0 && Math.abs(q[0] - 230) < 26) && !(q[0] === x1 && Math.abs(q[1] - 145) < 26) && !(q[0] === x0 && Math.abs(q[1] - 145) < 16)) { q_elec(q[0], q[1], 5); if (g > 0.3) { var dx = q[1] === y0 ? -1 : q[1] === y1 ? 1 : q[0] === x1 ? -0 : 0; if (q[1] === y0) A(q[0], q[1] - 15, -14, 0, BLUE, '', 1.6); else if (q[1] === y1) A(q[0], q[1] + 15, 14, 0, BLUE, '', 1.6); else if (q[0] === x1) A(q[0] + 14, q[1], 0, -14, BLUE, '', 1.6); else A(q[0] - 14, q[1], 0, 14, BLUE, '', 1.6); } } }
      TB('10 m de fil  ·  v ≈ 0,1 mm/s', 230, 40, INK, 16);
      TB(g > .3 ? 'tous les électrons démarrent en même temps' : 'interrupteur qu\'on vient de fermer…', 230, 262, g > .3 ? DGREEN : GREY, 15);
      if (g > .3) TB('lampe allumée aussitôt', 230, 135, DGREEN, 15);
    }),
    /* 3 Conducteurs et isolants */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), names = ['cuivre', 'bois sec', 'graphite', 'eau salée', 'verre', 'aluminium'], cond = [1, 0, 1, 1, 0, 1];
      for (var i = 0; i < 6; i++) {
        var x = 80 + (i % 3) * 150, y = 85 + Math.floor(i / 3) * 100, c = cond[i];
        var fill = g > 0 ? (c ? 'rgba(29,158,117,' + .18 * g + ')' : 'rgba(226,75,74,' + .15 * g + ')') : '#f3f6fa';
        ctx.fillStyle = fill; ctx.strokeStyle = g > .3 ? (c ? GREEN : RED) : GREY; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(x - 62, y - 32, 124, 64, 10); ctx.fill(); ctx.stroke();
        TB(names[i], x, y + 5, INK, 16);
        if (g > .5) { ctx.globalAlpha = g; TB(c ? 'conducteur' : 'isolant', x, y + 50, c ? DGREEN : DRED, 14); ctx.globalAlpha = 1; }
      }
      TB(g > .5 ? 'les ions de l\'eau salée transportent le courant' : 'conducteur ou isolant ?', 230, 262, g > .5 ? DGREEN : GREY, 15);
    }),
    /* 4 Vitesse de dérive */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      ctx.fillStyle = '#f3c9a0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(30, 55, 400, 74, 18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fbe3cc'; ctx.beginPath(); ctx.ellipse(430, 92, 14, 37, 0, 0, 7); ctx.fill(); ctx.stroke();
      for (var i = 0; i < 16; i++) { var x = 60 + (i % 8) * 46, y = 80 + Math.floor(i / 8) * 26; q_elec(x, y, 6); if (g > 0) A(x + 6, y, 16 * g, 0, BLUE, '', 1.6); }
      TB('cuivre : S = 2 mm²', 130, 150, ORANGE, 14); TB('I = 3 A', 380, 150, ORANGE, 14);
      TB('v = I / (n · e · S)', 230, 190, INK, 18);
      TB('n = 8,5·10²⁸ m⁻³ · e = 1,6·10⁻¹⁹ C', 230, 214, GREY, 13);
      if (g > 0) { ctx.globalAlpha = g; q_box(230, 250, 380, 34, DGREEN, '#e6f6ee', 'v ≈ 0,11 mm/s  →  1 m en ≈ 2 h 30', 17); ctx.globalAlpha = 1; }
    }),
    /* 5 Lequel allume la lampe ? */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), lx = 150, ly = 90;
      var a = ampoule(lx, ly, g), pl = pilePlate(320, 215, '');
      ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(pl.plus[0], pl.plus[1]); ctx.lineTo(pl.plus[0], 182); ctx.lineTo(lx, 182); ctx.lineTo(a.plot[0], a.plot[1] + 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pl.minus[0], pl.minus[1]); ctx.lineTo(pl.minus[0], 184); ctx.lineTo(420, 184); ctx.lineTo(420, 262); ctx.lineTo(95, 262); ctx.lineTo(95, a.culot[1]); ctx.lineTo(a.culot[0], a.culot[1]); ctx.stroke();
      TB('culot', 90, a.culot[1] + 18, GREY, 13, 'right'); TB('plot', lx + 12, 166, GREY, 13, 'left');
      if (g > .3) TB('chaque borne de la lampe reliée à une borne de la pile', 230, 24, DGREEN, 14);
      else TB('il faut un fil par borne de la lampe', 230, 24, GREY, 14);
      if (g > .3) { ctx.globalAlpha = g; A(250, 262, -20, 0, BLUE, '', 2); ctx.globalAlpha = 1; }
    }),
    /* 6 Le fil en trop */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 50, y0 = 75, x1 = 340, y1 = 215;
      q_rect(x0, y0, x1, y1, [['l', 145, 12], ['r', 145, 22]]);
      q_pile(x0, 145, 'v'); TB('4,5 V', x0 + 24, 150, DGREEN, 14, 'left'); q_lampe(x1, 145, 1 - g, 20);
      var col = g > .2 ? RED : GREY; ctx.strokeStyle = col; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1 + 60, y0); ctx.lineTo(x1 + 60, y1); ctx.lineTo(x1, y1); ctx.stroke();
      TB('fil', x1 + 72, 150, g > .2 ? DRED : GREY, 15, 'left');
      TB(g > .3 ? 'I : 0,27 A \u2192 2,9 A  (\u00D7 11)' : 'I = 0,27 A, lampe allumée', 230, 36, g > .3 ? DRED : INK, 17);
      if (g > .5) { ctx.globalAlpha = g; TB('lampe éteinte · chaleur \u00D7 115 : danger', 230, 258, DRED, 16); ctx.globalAlpha = 1; }
    }),
    /* 7 Piles en opposition */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 40, y0 = 80, x1 = 420, y1 = 210;
      q_rect(x0, y0, x1, y1, [['t', 150, 20], ['t', 220, 20], ['r', 145, 22]]);
      ctx.save(); ctx.translate(300, 0); ctx.scale(-1, 1); q_pile(150, y0, 'h'); ctx.restore();
      q_pile(220, y0, 'h');
      q_lampe(x1, 145, 0, 22);
      TB('1,5 V', 150, y0 + 36, DGREEN, 14); TB('1,5 V', 220, y0 + 36, DGREEN, 14); TB('lampe 3 V', x1 - 34, 150, INK, 14, 'right');
      TB('+', 155, y0 - 22, DRED, 20); TB('+', 215, y0 - 22, DRED, 20);
      A(130, y0 - 48, 40, 0, GREEN, '', 3); A(240, y0 - 48, -40, 0, ORANGE, '', 3);
      if (g > 0) { ctx.globalAlpha = g; TB('1,5 − 1,5 = 0 V  →  lampe éteinte', 230, 262, DRED, 17); ctx.globalAlpha = 1; } else TB('bornes + face à face…', 230, 262, GREY, 16);
    }),
    /* 8 Testeur de matériaux */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), names = ['cuivre', 'mine', 'eau salée', 'eau distillée', 'caoutchouc'], br = [1, .85, .2, 0, 0];
      for (var i = 0; i < 5; i++) {
        var x = 50 + i * 90; q_lampe(x, 90, br[i], 18); TB(names[i], x, 150, INK, 13);
        TB('(' + (i + 1) + ')', x, 40, GREY, 13);
        if (g > 0) { ctx.globalAlpha = g; var c = br[i] > 0; q_box(x, 190, 80, 28, c ? GREEN : RED, c ? '#e6f6ee' : '#fdeaea', c ? 'conduit' : 'isole', 14); ctx.globalAlpha = 1; }
      }
      TB(g > .5 ? 'elle brille si le matériau conduit' : 'la lampe brille-t-elle ?', 230, 258, g > .5 ? DGREEN : GREY, 14);
    }),
    /* 9 Court-circuit de la pile */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 60, y0 = 70, x1 = 400, y1 = 215;
      q_rect(x0, y0, x1, y1, [['l', 142, 12], ['t', 240, 24], ['r', 142, 20]]);
      q_pile(x0, 142, 'v'); q_inter(240, y0, true); q_lampe(x1, 142, 0, 20);
      var col = g > .2 ? RED : INK; LN(x0 + 70, y0, x0 + 70, y1, col, 3.4);
      if (g > 0) { ctx.globalAlpha = g; for (var i = 0; i < 4; i++) { var y = 95 + i * 30; ctx.strokeStyle = ORA2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 86, y); ctx.bezierCurveTo(x0 + 96, y - 8, x0 + 80 + 18, y + 8, x0 + 108, y); ctx.stroke(); } TB('chaleur', x0 + 118, 150, ORA2, 14, 'left'); ctx.globalAlpha = 1; }
      TB('fil direct entre les bornes', x0 + 70, 245, g > .2 ? DRED : INK, 14);
      TB(g > .4 ? 'la lampe s\'éteint, le fil et la pile chauffent fortement' : 'que se passe-t-il ?', 230, 38, g > .4 ? DRED : GREY, 16);
    })
  ]);
})();
