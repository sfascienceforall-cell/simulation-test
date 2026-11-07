/* Physique 3e · chapitre 3 · Intensité et tension (utilise les aides q_* de theo-01.js) */
(function () {
  var AM = ORA2, VM = BLUE;
  /* voltmètre branché en dérivation : fils depuis (xa,ya) et (xb,yb) jusqu'au voltmètre en (x,y) */
  function vder(x, y, xa, ya, xb, yb, val, col) {
    LN(xa, ya, x - 10, y + 12, INK, 1.8); LN(xb, yb, x + 10, y + 12, INK, 1.8); DOT(xa, ya, 3.5, INK); DOT(xb, yb, 3.5, INK);
    q_meter(x, y, 'V', col || VM, val);
  }
  /* voltmètre à droite d'un dipôle vertical : bornes (xa,ya) et (xb,yb) */
  function vdr(x, y, xa, ya, xb, yb, val, col) {
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xa + 22, ya); ctx.lineTo(x - 13, y - 8); ctx.moveTo(xb, yb); ctx.lineTo(xb + 22, yb); ctx.lineTo(x - 13, y + 8); ctx.stroke();
    DOT(xa, ya, 3.5, INK); DOT(xb, yb, 3.5, INK); q_meter(x, y, 'V', col || VM, val);
  }
  function fmt(v, d) { return v.toFixed(d).replace('.', ','); }

  SFA.theo("c03", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      var x0 = 60, y0 = 85, x1 = 340, y1 = 190;
      q_rect(x0, y0, x1, y1, [['l', 138, 12], ['r', 138, 17], ['t', 160, 17]]);
      q_pile(x0, 138, 'v'); q_lampe(x1, 138, 1, 15); q_meter(160, y0, 'A', AM);
      vdr(415, 138, x1, 122, x1, 154, '', VM);
      TB('I  (A)', 120, 232, AM, 24); TB('U  (V)', 330, 232, VM, 24);
      TB('en série', 160, 56, AM, 14); TB('en dérivation', 398, 106, VM, 14);
    }),
    anim: q_an(function (t) {
      var T = 720, ph = (t % T) / T, x0 = 90, y0 = 90, x1 = 480, y1 = 235;
      var a = q_c((ph - .15) / .08, 0, 1) * (1 - q_c((ph - .95) / .05, 0, 1)), v = q_c((ph - .5) / .08, 0, 1) * (1 - q_c((ph - .95) / .05, 0, 1));
      var gaps = [['l', 162, 12], ['r', 162, 18]];
      if (a > .5) { gaps.push(['t', 240, 18]); gaps.push(['b', 330, 18]); }
      q_rect(x0, y0, x1, y1, gaps);
      var off = -(t * 0.0018);
      for (var i = 0; i < 26; i++) { var q = q_pos(x0, y0, x1, y1, i / 26 + off), inG = false; gaps.forEach(function (g) { if ((g[0] === 't' && q[1] === y0 || g[0] === 'b' && q[1] === y1) && Math.abs(q[0] - g[1]) < g[2] + 4) inG = true; if ((g[0] === 'l' && q[0] === x0 || g[0] === 'r' && q[0] === x1) && Math.abs(q[1] - g[1]) < g[2] + 4) inG = true; }); if (!inG) q_elec(q[0], q[1], 5); }
      q_pile(x0, 162, 'v'); q_lampe(x1, 162, 1, 20);
      TB('+', x0 - 18, 152, DRED, 18); TB('−', x0 - 18, 185, BLUE_D, 20);
      if (a > .5) { ctx.globalAlpha = a; q_meter(240, y0, 'A', AM, '0,30 A'); q_meter(330, y1, 'A', AM, '0,30 A'); TB('A₁', 240, y0 - 40, GREY, 13); TB('A₂', 330, y1 + 34, GREY, 13); ctx.globalAlpha = 1; }
      if (v > .02) { ctx.globalAlpha = v; vdr(x1 + 90, 162, x1, 140, x1, 184, '6,0 V', VM); ctx.globalAlpha = 1; }
      if (ph < .15) TB('un circuit fermé : les charges circulent', 350, 40, GREY, 16);
      else if (ph < .5) { TB('ampèremètre EN SÉRIE : on ouvre le circuit pour l\'insérer', 350, 40, AM, 16); TB('même intensité avant et après la lampe', 350, 275, DGREEN, 15); }
      else if (ph < .95) { TB('voltmètre EN DÉRIVATION : on le branche aux bornes de la lampe', 350, 40, BLUE_D, 16); TB('le circuit reste fermé, rien n\'est coupé', 350, 275, DGREEN, 15); }
    }),
    th:
      '<div class="tcard"><b class="h">L\'intensité du courant</b><p>L\'<b>intensité</b> I est le <b>débit de charges</b> : la quantité de charge qui traverse une section de fil par seconde. <b>I = Q / t</b> (1 ampère = 1 coulomb par seconde). On la mesure avec un <b>ampèremètre</b> branché <b>en série</b> : on ouvre le circuit et on l\'insère dans la boucle.</p><ul><li>Unité : l\'ampère (A) ; 1 A = 1 000 mA.</li><li>Dans un circuit sans dérivation, l\'intensité est <b>la même partout</b> : une lampe ne « consomme » pas de courant, elle transforme de l\'énergie. L\'ampèremètre placé avant ou après la lampe indique la même valeur.</li></ul></div>' +
      '<div class="tcard"><b class="h">La tension électrique</b><p>La <b>tension</b> U est la différence d\'état électrique entre deux points ; c\'est elle qui « pousse » les charges. La pile maintient une tension entre ses bornes. On la mesure avec un <b>voltmètre</b> branché <b>en dérivation</b>, directement aux deux bornes du dipôle étudié, sans ouvrir le circuit.</p><ul><li>Unité : le volt (V) ; 1 V = 1 000 mV.</li><li>Aux bornes d\'un interrupteur <b>ouvert</b>, le voltmètre indique la tension de la pile (il n\'y a pas de courant, mais la différence entre les deux points subsiste). Aux bornes d\'un interrupteur fermé ou d\'un fil : 0 V.</li><li>En série, les tensions <b>s\'additionnent</b> : U<sub>pile</sub> = U<sub>1</sub> + U<sub>2</sub>.</li></ul></div>' +
      '<div class="tcard"><b class="h">Utiliser les appareils</b><ul><li><b>Série ou dérivation ?</b> Ampèremètre : en série (bornes A et COM). Voltmètre : en dérivation (bornes V et COM).</li><li><b>Calibre :</b> on part toujours du <b>plus grand</b> calibre, puis on descend jusqu\'à celui qui est juste au-dessus de la valeur attendue (plus précis). Avec un calibre trop petit, l\'appareil sature (ou son fusible grille).</li><li><b>Conversions :</b> 250 mA = 0,25 A ; 0,45 A = 450 mA ; 3 400 mV = 3,4 V.</li></ul><p><b>Exemple :</b> I ≈ 0,35 A avec les calibres 200 mA, 2 A, 10 A : 200 mA est dépassé, 10 A est trop grossier : on choisit <b>2 A</b>.</p></div>' +
      '<div class="tcard"><b class="h">Deux lampes en série : exemple chiffré</b><p>Pile de 9 V, deux lampes en série. Le voltmètre aux bornes de L<sub>1</sub> indique 5,4 V, l\'ampèremètre 0,18 A.</p><ul><li>Tension aux bornes de L<sub>2</sub> : U<sub>2</sub> = 9 − 5,4 = <b>3,6 V</b>.</li><li>Intensité entre L<sub>1</sub> et L<sub>2</sub> : la même, <b>0,18 A</b>.</li></ul><p>Pour trois lampes de 10 Ω, 20 Ω et 30 Ω en série sur 6 V : I = 6 / 60 = 0,10 A, et les tensions 1,0 V, 2,0 V et 3,0 V ont pour somme 6 V. Si on remplace la lampe de 20 Ω par un fil, I = 6 / 40 = 0,15 A : les deux autres brillent plus.</p></div>' +
      '<div class="tcard"><b class="h">Pièges et branchements à éviter</b><ul><li><b>Voltmètre en série :</b> sa résistance est énorme, le courant devient quasi nul, la lampe est éteinte et le voltmètre indique environ la tension de la pile.</li><li><b>Ampèremètre en dérivation :</b> sa résistance est quasi nulle : c\'est un court-circuit.</li><li>Une pile en fonctionnement affiche moins que sa tension à vide (4,5 V → 3,9 V) : une partie de la tension est perdue dans la résistance interne de la pile.</li><li>Des éléments en série <b>additionnent</b> leurs tensions (citrons de 0,95 V : deux en série donnent 1,9 V), alors qu\'en dérivation la tension reste celle d\'un seul.</li></ul></div>'
  });

  SFA.figs("c03", [
    /* 0 Série ou dérivation ? */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 70, y0 = 110, x1 = 390, y1 = 225;
      var gaps = [['l', 168, 12], ['r', 168, 17]]; if (g > .5) gaps.push(['t', 150, 17]);
      q_rect(x0, y0, x1, y1, gaps); q_pile(x0, 168, 'v'); q_lampe(x1, 168, 1, 15);
      q_meter(150, y0 - 50 * (1 - g), 'A', AM);
      var vy = 40, vx = 300;
      if (g > .05) { ctx.globalAlpha = g; vdr(425, 168, x1, 152, x1, 184, '', VM); ctx.globalAlpha = 1; } else q_meter(425, 100, 'V', VM);
      if (g > .7) { TB('ampèremètre : en série', 150, 86, DGREEN, 14); TB('dérivation', 425, 140, DGREEN, 13); } else TB('comment brancher A et V ?', 230, 262, GREY, 16);
      if (g > .7) TB('A en série (coupe la boucle) · V en dérivation (aux bornes de la lampe)', 230, 262, DGREEN, 13);
    }),
    /* 1 Convertir */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), rows = [['250 mA', '0,25 A', '÷ 1 000'], ['0,45 A', '450 mA', '× 1 000'], ['3 400 mV', '3,4 V', '÷ 1 000']];
      rows.forEach(function (r, i) {
        var y = 55 + i * 78; q_box(90, y, 130, 44, GREY, '#f3f6fa', r[0], 19);
        A(160, y, 70, 0, ORANGE, '', 3); TB(r[2], 200, y - 14, ORANGE, 13);
        if (g > 0) { ctx.globalAlpha = g; q_box(360, y, 150, 44, GREEN, '#e6f6ee', r[1], 20); ctx.globalAlpha = 1; } else q_box(360, y, 150, 44, GREY, '#fff', '?', 20);
      });
    }),
    /* 2 Avant et après la lampe */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 60, y0 = 85, x1 = 400, y1 = 220;
      q_rect(x0, y0, x1, y1, [['t', 130, 17], ['b', 330, 17], ['l', 152, 12], ['r', 152, 17]]); q_pile(x0, 152, 'v'); q_lampe(x1, 152, 1, 15);
      q_meter(130, y0, 'A', AM, '0,30 A'); TB('avant', 130, y0 + 32, GREY, 13);
      q_meter(330, y1, 'A', AM, g > .2 ? '0,30 A' : '?'); TB('après', 330, y1 + 36, GREY, 13);
      for (var i = 0; i < 6; i++) { var q = q_pos(x0, y0, x1, y1, i / 6 + .06); if (!(q[1] === y0 && Math.abs(q[0] - 130) < 20) && !(q[1] === y1 && Math.abs(q[0] - 330) < 20) && !(q[0] === x1 && Math.abs(q[1] - 152) < 20) && !(q[0] === x0 && Math.abs(q[1] - 152) < 15)) q_elec(q[0], q[1], 5); }
      TB(g > .4 ? 'l\'intensité ne s\'use pas : 0,30 A partout' : 'et après la lampe ?', 230, 30, g > .4 ? DGREEN : GREY, 17);
    }),
    /* 3 Choisir le calibre */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), cals = [['200 mA', 'dépassé !', RED], ['2 A', 'bon calibre', GREEN], ['10 A', 'trop grossier', ORANGE]], fr = [1.75, .175, .035];
      cals.forEach(function (c, i) {
        var y = 70 + i * 62, bx = 130, bw = 200;
        TB(c[0], 20, y + 5, INK, 17, 'left');
        ctx.fillStyle = '#eef1f4'; ctx.fillRect(bx, y - 12, bw, 24); ctx.strokeStyle = GREY; ctx.lineWidth = 1.6; ctx.strokeRect(bx, y - 12, bw, 24);
        var px = bx + Math.min(fr[i], 1.12) * bw;
        ctx.fillStyle = g > .3 ? c[2] + '66' : 'rgba(55,138,221,.3)'; ctx.fillRect(bx, y - 12, Math.min(fr[i], 1) * bw, 24);
        LN(px, y - 18, px, y + 18, BLUE_D, 3);
        if (g > .3) { ctx.globalAlpha = g; TB(c[1], 440, y + 5, c[2] === GREEN ? DGREEN : c[2] === RED ? DRED : ORANGE, 14, 'right'); ctx.globalAlpha = 1; }
      });
      TB('I ≈ 0,35 A', 255, 28, BLUE_D, 16);
      TB(g > .5 ? 'on commence par le plus grand calibre, puis on descend' : 'quel calibre ?', 230, 262, g > .5 ? DGREEN : GREY, 15);
    }),
    /* 4 Deux lampes en série */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 40, y0 = 100, x1 = 420, y1 = 220;
      q_rect(x0, y0, x1, y1, [['l', 160, 12], ['t', 130, 17], ['t', 235, 16], ['t', 340, 17], ['b', 230, 16]]);
      q_pile(x0, 160, 'v'); TB('9 V', x0 + 24, 165, DGREEN, 14, 'left');
      q_lampe(130, y0, 1, 15); q_lampe(340, y0, 1, 15); TB('L₁', 130, y0 + 34, INK, 13); TB('L₂', 340, y0 + 34, INK, 13);
      q_meter(235, y0, 'A', AM, g > .3 ? '0,18 A' : '?'); q_meter(230, y1, 'A', AM, '0,18 A');
      vder(130, 38, 116, y0 - 6, 144, y0 - 6, '5,4 V', VM);
      vder(340, 38, 326, y0 - 6, 354, y0 - 6, g > .3 ? '3,6 V' : '?', g > .3 ? GREEN : VM);
      if (g > .5) TB('U₂ = 9 − 5,4 = 3,6 V  ·  I identique', 230, 262, DGREEN, 16); else TB('U₂ ?   I entre L₁ et L₂ ?', 230, 262, GREY, 16);
    }),
    /* 5 Voltmètre mal branché */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 70, y0 = 80, x1 = 390, y1 = 210;
      q_rect(x0, y0, x1, y1, [['l', 145, 12], ['t', 230, 17], ['r', 145, 17]]);
      q_pile(x0, 145, 'v'); TB('4,5 V', x0 + 24, 150, DGREEN, 14, 'left');
      q_meter(230, y0, 'V', VM, g > .3 ? '≈ 4,5 V' : '?'); q_lampe(x1, 145, g > .3 ? 0 : 1, 17); TB('lampe', x1 - 30, 150, INK, 14, 'right');
      TB(g > .3 ? 'voltmètre en série : courant quasi nul' : 'voltmètre en série avec la lampe', 230, 258, g > .3 ? DRED : GREY, 15);
      if (g > .3) TB('lampe éteinte · V ≈ tension de la pile', 230, 36, DRED, 16);
    }),
    /* 6 Combien de citrons ? */
    q_fig(function (p) {
      var g = q_s(p, 0, .7);
      function lemon(x) { ctx.fillStyle = '#f6e27a'; ctx.strokeStyle = YEL; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(x, 120, 38, 28, 0, 0, 7); ctx.fill(); ctx.stroke(); LN(x - 14, 80, x - 14, 120, ORANGE, 3.5); LN(x + 14, 80, x + 14, 120, GREY, 3.5); }
      for (var i = 0; i < 3; i++) { var x = 85 + i * 95; lemon(x); TB('0,95 V', x, 170, INK, 13); if (i < 2) LN(x + 14, 82, x + 81, 82, INK, 2); }
      LN(85 - 14, 82, 40, 82, INK, 2); LN(40, 82, 40, 215, INK, 2); LN(40, 215, 400, 215, INK, 2); LN(400, 215, 400, 160, INK, 2); LN(275 + 14, 82, 400, 82, INK, 2); LN(400, 82, 400, 100, INK, 2);
      var on = g > .1, b = on ? g : 0;
      ctx.fillStyle = '#fff'; ctx.fillRect(385, 100, 30, 60);
      if (b > 0) { var gr = ctx.createRadialGradient(400, 130, 2, 400, 130, 44); gr.addColorStop(0, 'rgba(226,75,74,' + .7 * b + ')'); gr.addColorStop(1, 'rgba(226,75,74,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(400, 130, 44, 0, 7); ctx.fill(); }
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.fillStyle = '#fbe0e0'; ctx.beginPath(); ctx.moveTo(388, 108); ctx.lineTo(412, 108); ctx.lineTo(400, 132); ctx.closePath(); ctx.fill(); ctx.stroke(); LN(388, 134, 412, 134, INK, 2.4);
      TB('DEL 1,8 V', 400, 70, INK, 13);
      if (g > 0) { ctx.globalAlpha = g; TB('1 → 0,95 V   2 → 1,90 V   3 → 2,85 V', 215, 40, DGREEN, 15); TB('(a) 2 citrons en série suffisent (1,9 V > 1,8 V)', 230, 245, DGREEN, 14); TB('(b) en dérivation : toujours 0,95 V', 230, 267, DRED, 14); ctx.globalAlpha = 1; }
      else TB('combien de citrons en série ?', 215, 40, GREY, 16);
    }),
    /* 7 Interrupteur ouvert */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 70, y0 = 120, x1 = 390, y1 = 225;
      q_rect(x0, y0, x1, y1, [['l', 172, 12], ['t', 230, 22], ['r', 172, 17]]);
      q_pile(x0, 172, 'v'); TB('6 V', x0 + 24, 177, DGREEN, 14, 'left'); q_inter(230, y0, false); q_lampe(x1, 172, 0, 16);
      vder(230, 48, 212, y0, 248, y0 - 10, g > .3 ? '6,0 V' : '?', g > .3 ? GREEN : VM);
      TB(g > .4 ? 'la tension de la pile apparaît aux bornes de l\'interrupteur ouvert' : 'voltmètre aux bornes de l\'interrupteur ouvert', 230, 266, g > .4 ? DGREEN : GREY, 13);
    }),
    /* 8 Une lampe court-circuitée */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), x0 = 50, y0 = 55, x1 = 410, y1 = 120, xs = [130, 230, 330], R = ['10 Ω', '20 Ω', '30 Ω'];
      q_rect(x0, y0, x1, y1, [['l', 88, 12], ['t', 130, 24], ['t', 230, 24], ['t', 330, 24]]); q_pile(x0, 88, 'v'); TB('6 V', x0 + 22, 92, DGREEN, 13, 'left');
      xs.forEach(function (x, i) { q_resis(x, y0, 'h', R[i], 44); });
      if (g > .5) { LN(206, y0, 254, y0, RED, 4); }
      if (g > 0) {
        ctx.globalAlpha = g; TB('(a)', 24, 168, GREY, 14, 'left'); TB('(b)', 24, 218, GREY, 14, 'left'); var va = ['1,0 V', '2,0 V', '3,0 V'], vb = ['1,5 V', 'fil : 0 V', '4,5 V'];
        TB('I = 0,10 A', 436, 163, DGREEN, 14, 'right'); xs.forEach(function (x, i) { TB(va[i], x, 168, BLUE_D, 15); });
        TB('I = 0,15 A', 436, 213, DGREEN, 14, 'right'); xs.forEach(function (x, i) { TB(vb[i], x, 218, i === 1 ? DRED : BLUE_D, 15); });
        TB('les deux autres lampes brillent plus', 230, 262, DGREEN, 14); ctx.globalAlpha = 1;
      } else TB('I et les trois tensions ? puis avec un fil à la place de 20 Ω ?', 230, 175, GREY, 14);
    }),
    /* 9 La tension qui s'effondre */
    q_fig(function (p) {
      var g = q_s(p, 0, .7);
      ctx.setLineDash([5, 4]); ctx.strokeStyle = DGREEN; ctx.lineWidth = 2; ctx.strokeRect(25, 55, 130, 150); ctx.setLineDash([]);
      TB('pile', 90, 46, DGREEN, 14); q_pile(90, 90, 'v'); q_resis(90, 150, 'v', 'r', 44); TB('résistance interne', 90, 225, DGREEN, 13);
      LN(90, 80, 90, 55, INK, 2); LN(90, 172, 90, 205, INK, 2); LN(90, 108, 90, 128, INK, 2);
      LN(90, 55, 240, 55, INK, 2); LN(90, 205, 240, 205, INK, 2); LN(240, 55, 240, 100, INK, 2); LN(240, 160, 240, 205, INK, 2); q_lampe(240, 130, 1, 18);
      var bx = 290, bw = 150, f = 3.9 / 4.5;
      TB('à vide : 4,5 V', 365, 62, INK, 14);
      ctx.fillStyle = '#e6f6ee'; ctx.fillRect(bx, 72, bw, 26); ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.strokeRect(bx, 72, bw, 26); TB('4,5 V', bx + bw / 2, 90, DGREEN, 14);
      TB('en marche', 365, 130, INK, 14);
      ctx.fillStyle = '#eef1f4'; ctx.fillRect(bx, 140, bw, 26); ctx.strokeStyle = GREY; ctx.strokeRect(bx, 140, bw, 26);
      ctx.fillStyle = 'rgba(29,158,117,.3)'; ctx.fillRect(bx, 140, bw * f, 26); LN(bx + bw * f, 136, bx + bw * f, 170, GREEN, 3);
      TB('3,9 V', bx + bw * f / 2, 158, DGREEN, 14);
      if (g > 0) { ctx.globalAlpha = g; ctx.fillStyle = 'rgba(226,75,74,.3)'; ctx.fillRect(bx + bw * f, 140, bw * (1 - f), 26); TB('0,6 V', bx + bw * f + bw * (1 - f) / 2 - 4, 188, DRED, 13); TB('perdus dans la pile', 365, 214, DRED, 14); TB('4,5 − 3,9 = 0,6 V', 365, 238, DRED, 14); ctx.globalAlpha = 1; }
    })
  ]);
})();
