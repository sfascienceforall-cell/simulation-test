/* Physique 3e · chapitre 5 · Circuits en série et en dérivation (utilise les aides q_* de theo-01.js) */
(function () {
  function seg(x, y, L, dx, dy, v, t, sp) { /* électrons le long d'un segment, vitesse v (px/image·0,5) */
    var n = Math.max(1, Math.floor(L / (sp || 24)));
    for (var i = 0; i < n; i++) { var d = (((i * (sp || 24) + v * t * .5) % L) + L) % L; q_elec(x + dx * d, y + dy * d, 4.5); }
  }
  function lampX(x, y, b) { q_lampe(x, y, b, 14); }
  function dim(x, y, lab, col) { TB(lab, x, y, col || INK, 13); }

  SFA.theo("c05", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      // série
      q_rect(25, 40, 205, 140, [['t', 85, 14], ['t', 145, 14], ['l', 90, 12]]); q_pile(25, 90, 'v'); q_lampe(85, 40, 1, 13); q_lampe(145, 40, 1, 13);
      // dérivation
      q_rect(255, 40, 435, 140, [['l', 90, 12]]); q_pile(255, 90, 'v');
      LN(345, 40, 345, 140, INK, 2.4); q_lampe(345, 90, 1, 13); q_lampe(435, 90, 1, 13); DOT(345, 40, 4, INK); DOT(345, 140, 4, INK);
      TB('en série', 115, 185, BLUE_D, 22); TB('en dérivation', 345, 185, ORANGE, 22);
      TB('même I partout', 115, 222, GREY, 14); TB('même U partout', 345, 222, GREY, 14);
    }),
    anim: q_an(function (t) {
      // ---- série ----
      var x0 = 30, y0 = 80, x1 = 300, y1 = 225;
      q_rect(x0, y0, x1, y1, [['l', 152, 12], ['t', 110, 24], ['t', 220, 24]]);
      var L = [[x0, 192, 152, 0, -1], [x0, 82, 0, 0, 0]];
      // trajet horizontal : électrons dans le sens antihoraire (de − vers +)
      seg(x0, y1, x1 - x0, 1, 0, 1, t); seg(x1, y1, y1 - y0, 0, -1, 1, t); seg(x1, y0, x1 - x0, -1, 0, 1, t); seg(x0, y0, y1 - y0, 0, 1, 1, t);
      q_pile(x0, 152, 'v'); q_resis(110, y0, 'h', '', 44); q_resis(220, y0, 'h', '', 44);
      TB('R₁ = 20 Ω', 110, y0 - 16, INK, 13); TB('R₂ = 40 Ω', 220, y0 - 16, INK, 13); TB('6 V', x0 + 24, 157, DGREEN, 13, 'left');
      TB('SÉRIE', 165, 30, BLUE_D, 20); TB('I = 0,10 A partout', 165, 252, BLUE_D, 15); TB('6 V = 2 V + 4 V : les tensions s\'additionnent', 165, 276, DGREEN, 13);
      TB('2 V', 110, y0 + 32, BLUE_D, 14); TB('4 V', 220, y0 + 32, BLUE_D, 14);
      // ---- dérivation ----
      var ox = 400, tx = 520, rx = 640, ty = 80, by = 225;
      LN(ox, ty, rx, ty, INK, 2.4); LN(ox, by, rx, by, INK, 2.4); LN(ox, ty, ox, 138, INK, 2.4); LN(ox, 168, ox, by, INK, 2.4); LN(tx, ty, tx, by, INK, 2.4); LN(rx, ty, rx, by, INK, 2.4);
      DOT(tx, ty, 4.5, INK); DOT(tx, by, 4.5, INK);
      seg(ox, by, tx - ox, 1, 0, 3, t); seg(tx, by, rx - tx, 1, 0, 1, t); seg(tx, by, by - ty, 0, -1, 2, t); seg(rx, by, by - ty, 0, -1, 1, t); seg(rx, ty, rx - tx, -1, 0, 1, t); seg(tx, ty, tx - ox, -1, 0, 3, t); seg(ox, ty, 58, 0, 1, 3, t); seg(ox, 168, by - 168, 0, 1, 3, t);
      q_pile(ox, 152, 'v'); q_resis(tx, 152, 'v', '', 44); q_resis(rx, 152, 'v', '', 44);
      TB('R₁ = 30 Ω', tx + 44, 156, INK, 13); TB('R₂ = 60 Ω', rx - 4, 112, INK, 13, 'center');
      TB('DÉRIVATION', 520, 30, ORANGE, 20); TB('U = 6 V sur chaque branche', 520, 252, ORANGE, 15); TB('I = I₁ + I₂ : 0,30 = 0,20 + 0,10 A', 520, 276, DGREEN, 13);
      TB('0,30 A', 462, ty - 8, ORA2, 13); TB('0,20 A', tx - 28, 200, ORA2, 13); TB('0,10 A', rx + 28, 200, ORA2, 13);
      LN(350, 20, 350, 285, '#ddd', 1.5, [4, 4]);
    }),
    th:
      '<div class="tcard"><b class="h">Montage en série</b><p>Les dipôles sont placés <b>à la suite</b> les uns des autres : il n\'y a qu\'un seul chemin pour le courant.</p><ul><li><b>Intensité :</b> la même partout, I = I<sub>1</sub> = I<sub>2</sub>.</li><li><b>Tensions :</b> elles s\'additionnent, U = U<sub>1</sub> + U<sub>2</sub> (+ …). Elles se répartissent proportionnellement aux résistances : U<sub>i</sub> = R<sub>i</sub> · I.</li><li><b>Résistance équivalente :</b> R = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub>.</li><li>Si un dipôle est coupé (lampe grillée), <b>tout</b> le circuit s\'arrête : c\'est le cas des vieilles guirlandes de Noël.</li></ul><p><b>Exemple :</b> 100 Ω + 220 Ω + 330 Ω = 650 Ω sur 12 V : I = 12 / 650 ≈ 18,5 mA ; U = 1,85 V ; 4,06 V ; 6,09 V (somme : 12 V).</p></div>' +
      '<div class="tcard"><b class="h">Montage en dérivation</b><p>Plusieurs <b>branches</b> sont reliées entre les deux mêmes points (les <b>nœuds</b>) : le courant se partage.</p><ul><li><b>Tension :</b> la même aux bornes de chaque branche (celle de la pile).</li><li><b>Intensités :</b> elles s\'additionnent, I = I<sub>1</sub> + I<sub>2</sub> (<b>loi des nœuds</b> : ce qui arrive est égal à ce qui repart).</li><li><b>Résistance équivalente :</b> 1/R = 1/R<sub>1</sub> + 1/R<sub>2</sub> ; pour deux branches, R = R<sub>1</sub>·R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>). Elle est <b>plus petite</b> que la plus petite des résistances.</li><li>Si une branche est coupée, les autres continuent de fonctionner : c\'est le montage de la maison.</li></ul><p><b>Exemples :</b> 100 Ω // 400 Ω = 40 000 / 500 = <b>80 Ω</b>. 60 Ω // 30 Ω sur 12 V : R = 20 Ω ; I<sub>1</sub> = 0,20 A, I<sub>2</sub> = 0,40 A, I = 0,60 A.</p></div>' +
      '<div class="tcard"><b class="h">Circuit mixte : la méthode</b><ol><li>Remplacer chaque <b>bloc en dérivation</b> par sa résistance équivalente.</li><li>Additionner les résistances en <b>série</b> : R<sub>totale</sub>.</li><li>I = U / R<sub>totale</sub> (courant dans la pile).</li><li>Revenir en arrière : tension aux bornes de chaque élément série (U = R·I), puis courants dans les branches (I<sub>i</sub> = U<sub>bloc</sub> / R<sub>i</sub>).</li></ol><p><b>Exemple :</b> 12 V ; R<sub>1</sub> = 20 Ω en série avec R<sub>2</sub> = 30 Ω // R<sub>3</sub> = 60 Ω. R<sub>23</sub> = 20 Ω ; R = 40 Ω ; I = 0,30 A ; U<sub>1</sub> = 6 V ; U<sub>bloc</sub> = 6 V ; I<sub>2</sub> = 0,20 A ; I<sub>3</sub> = 0,10 A (somme : 0,30 A).</p></div>' +
      '<div class="tcard"><b class="h">Que se passe-t-il quand on change quelque chose ?</b><ul><li>Lampe L<sub>1</sub> en série avec L<sub>2</sub> // L<sub>3</sub> (identiques). On dévisse L<sub>3</sub> : la résistance totale augmente, I diminue, L<sub>1</sub> brille <b>moins</b> ; la tension sur L<sub>2</sub> augmente (la moitié de la pile au lieu du tiers), L<sub>2</sub> brille <b>plus</b>.</li><li>Court-circuiter une lampe en série (la remplacer par un fil) diminue la résistance totale : les autres lampes brillent plus.</li><li>Ajouter une branche en dérivation fait <b>baisser</b> la résistance équivalente : la pile débite plus.</li></ul></div>' +
      '<div class="tcard"><b class="h">Diagnostiquer une panne</b><p>Avec un voltmètre aux bornes de chaque lampe d\'un circuit série qui ne marche pas :</p><ul><li>Une lampe <b>coupée</b> (filament grillé) montre <b>toute la tension de la pile</b> (le courant est nul donc les autres lampes n\'ont aucune tension : 0 V).</li><li>Une lampe <b>court-circuitée</b> montre 0 V alors que le courant circule.</li><li>Exemple : pile 6 V, mesures 0 V ; 6 V ; 0 V aux bornes de L<sub>1</sub>, L<sub>2</sub>, L<sub>3</sub> : c\'est <b>L<sub>2</sub> qui est coupée</b>.</li></ul></div>'
  });

  function pilev(x, y, lab) { q_pile(x, y, 'v'); if (lab) TB(lab, x + 24, y + 5, DGREEN, 13, 'left'); }
  SFA.figs("c05", [
    /* 0 Guirlande et maison */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), out = g > .2;
      // guirlande (série)
      var gap = [['l', 150, 12], ['t', 55, 13], ['t', 100, 13], ['t', 145, 13], ['t', 190, 13]];
      q_rect(25, 100, 215, 205, gap); pilev(25, 150, '');
      [55, 100, 145, 190].forEach(function (x, i) { var burnt = i === 1; q_lampe(x, 100, burnt && out ? 0 : (out ? 0 : 1), 13); if (burnt && out) { LN(x - 9, 91, x + 9, 109, RED, 3); } });
      TB('guirlande', 120, 62, BLUE_D, 16);
      // maison (dérivation)
      LN(250, 100, 250, 135, INK, 2.4); LN(250, 165, 250, 205, INK, 2.4); LN(250, 100, 440, 100, INK, 2.4); LN(250, 205, 440, 205, INK, 2.4); pilev(250, 150, '');
      [300, 350, 400, 440].forEach(function (x, i) { LN(x, 100, x, 205, INK, 2.4); var burnt = i === 1; q_lampe(x, 152, burnt && out ? 0 : 1, 13); if (burnt && out) LN(x - 9, 143, x + 9, 161, RED, 3); if (i < 3) { DOT(x, 100, 3.5, INK); DOT(x, 205, 3.5, INK); } });
      TB('maison', 350, 62, ORANGE, 16);
      if (out) { ctx.globalAlpha = g; TB('série : tout s\'éteint', 120, 245, DRED, 15); TB('dérivation : les autres brillent', 350, 245, DGREEN, 15); ctx.globalAlpha = 1; }
      else TB('une ampoule grille…', 230, 245, GREY, 16);
    }),
    /* 1 Deux lampes en série */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 50, y0 = 130, x1 = 410, y1 = 225;
      q_rect(x0, y0, x1, y1, [['l', 178, 12], ['t', 150, 17], ['t', 310, 17]]); pilev(x0, 178, '9 V');
      q_lampe(150, y0, 1, 15); q_lampe(310, y0, 1, 15); TB('L₁', 150, y0 + 38, INK, 14); TB('L₂', 310, y0 + 38, INK, 14);
      [150, 310].forEach(function (x) { q_meter(x, 55, 'V', BLUE, g > .2 ? '4,5 V' : '?'); LN(x - 12, y0 - 10, x - 10, 66, INK, 1.6); LN(x + 12, y0 - 10, x + 10, 66, INK, 1.6); });
      TB(g > .4 ? 'lampes identiques : 9 / 2 = 4,5 V chacune' : 'tension aux bornes de chacune ?', 230, 262, g > .4 ? DGREEN : GREY, 16);
    }),
    /* 2 Deux branches */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), ox = 40, tx = 140, rx = 240, ty = 60, by = 225;
      LN(ox, ty, rx, ty, INK, 2.4); LN(ox, by, rx, by, INK, 2.4); LN(ox, ty, ox, 125, INK, 2.4); LN(ox, 155, ox, by, INK, 2.4); LN(tx, ty, tx, by, INK, 2.4); LN(rx, ty, rx, by, INK, 2.4);
      DOT(tx, ty, 4, INK); DOT(tx, by, 4, INK); pilev(ox, 140, '6 V');
      q_lampe(tx, 175, 1, 14); q_lampe(rx, 175, 1, 14); q_meter(tx, 115, 'A', ORA2, '0,20 A'); q_meter(rx, 115, 'A', ORA2, '0,30 A');
      TB('branche 1', tx, 258, INK, 13); TB('branche 2', rx, 258, INK, 13);
      if (g > .2) { ctx.globalAlpha = g; TB('I = 0,20 + 0,30', 300, 112, DGREEN, 15, 'left'); TB('= 0,50 A', 300, 134, DGREEN, 17, 'left'); TB('U = 6 V', 300, 180, BLUE_D, 17, 'left'); TB('sur chaque lampe', 300, 200, BLUE_D, 13, 'left'); ctx.globalAlpha = 1; }
      else { TB('I de la pile ?', 300, 120, GREY, 15, 'left'); TB('U sur chaque lampe ?', 300, 180, GREY, 15, 'left'); }
    }),
    /* 3 On dévisse une lampe */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), ox = 60, tx = 200, rx = 340, ty = 70, by = 225;
      LN(ox, ty, rx, ty, INK, 2.4); LN(ox, by, rx, by, INK, 2.4); LN(ox, ty, ox, 128, INK, 2.4); LN(ox, 160, ox, by, INK, 2.4); LN(tx, ty, tx, by, INK, 2.4); DOT(tx, ty, 4, INK); DOT(tx, by, 4, INK);
      LN(rx, ty, rx, 118, INK, 2.4); LN(rx, 188, rx, by, INK, 2.4);
      pilev(ox, 144, '');
      q_lampe(tx, 155, 1, 15); TB('L₁', tx, 192, INK, 13);
      ctx.fillStyle = '#d5d8dc'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(rx - 14, 160, 28, 28, 3); ctx.fill(); ctx.stroke();
      q_lampe(rx, 104 - 6 * g, 0, 13); TB('L₂ dévissée', rx, 245, DRED, 14);
      A(rx + 36, 150, 0, -26, GREY, '', 2.4);
      if (g > .2) { ctx.globalAlpha = g; TB('L₁ brille comme avant', 150, 38, DGREEN, 16); TB('même tension (6 V), même intensité', 150, 262, DGREEN, 14); ctx.globalAlpha = 1; }
      else TB('que devient L₁ ?', 150, 38, GREY, 17);
    }),
    /* 4 Trois résistances */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), x0 = 40, y0 = 60, x1 = 420, y1 = 135, xs = [110, 230, 350], R = ['100 Ω', '220 Ω', '330 Ω'];
      q_rect(x0, y0, x1, y1, [['l', 98, 12], ['t', 110, 24], ['t', 230, 24], ['t', 350, 24]]); pilev(x0, 98, '12 V');
      xs.forEach(function (x, i) { q_resis(x, y0, 'h', R[i], 44); });
      var bx = 30, bw = 400, parts = [1.85, 4.06, 6.09], cols = ['#cfe3f7', '#fbe3c9', '#d7f0e4'], cx = bx;
      if (g > 0) {
        ctx.globalAlpha = g; parts.forEach(function (v, i) { var w2 = bw * v / 12; ctx.fillStyle = cols[i]; ctx.fillRect(cx, 175, w2, 28); ctx.strokeStyle = GREY; ctx.lineWidth = 1.4; ctx.strokeRect(cx, 175, w2, 28); TB(String(v).replace('.', ',') + ' V', cx + w2 / 2, 195, INK, 14); cx += w2; });
        TB('R = 650 Ω  ·  I = 12 / 650 ≈ 18,5 mA', 230, 238, DGREEN, 16); TB('1,85 + 4,06 + 6,09 = 12 V', 230, 264, DGREEN, 14); ctx.globalAlpha = 1;
      } else TB('R totale ?   I ?   tensions ?', 230, 215, GREY, 17);
    }),
    /* 5 Résistance équivalente */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), tx = 60, rx = 140, ty = 60, by = 200;
      LN(tx - 30, 130, tx, 130, INK, 2.4); LN(tx, ty, rx, ty, INK, 2.4); LN(tx, by, rx, by, INK, 2.4); LN(tx, ty, tx, by, INK, 2.4); LN(rx, ty, rx, by, INK, 2.4); LN(rx, 130, rx + 30, 130, INK, 2.4);
      q_resis(tx, 130, 'v', '', 44); q_resis(rx, 130, 'v', '', 44); TB('100 Ω', tx - 16, 126, INK, 13, 'right'); TB('400 Ω', rx + 16, 126, INK, 13, 'left');
      var bx = 285, bw = 160, bars = [['100 Ω', 100, GREY], ['400 Ω', 400, GREY], ['équivalente', 80, GREEN]];
      bars.forEach(function (b, i) { var y = 70 + i * 52, w2 = bw * b[1] / 400; if (i === 2 && g <= 0) return; ctx.globalAlpha = i === 2 ? g : 1; ctx.fillStyle = b[2] === GREEN ? 'rgba(29,158,117,.35)' : '#e2e6ea'; ctx.fillRect(bx, y - 14, w2, 28); ctx.strokeStyle = b[2]; ctx.lineWidth = 1.8; ctx.strokeRect(bx, y - 14, w2, 28); TB(b[0], bx - 8, y + 5, INK, 13, 'right'); if (i === 2) TB('80 Ω', bx + w2 + 6, y + 5, DGREEN, 15, 'left'); ctx.globalAlpha = 1; });
      if (g > 0) { ctx.globalAlpha = g; TB('R = 100 × 400 / 500 = 80 Ω', 230, 255, DGREEN, 16); ctx.globalAlpha = 1; } else TB('R équivalente ?', 230, 255, GREY, 16);
      if (g > .5) TB('plus petite que la plus petite', 345, 215, DGREEN, 13);
    }),
    /* 6 Deux branches : intensités */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), ox = 50, tx = 190, rx = 330, ty = 60, by = 215;
      LN(ox, ty, rx, ty, INK, 2.4); LN(ox, by, rx, by, INK, 2.4); LN(ox, ty, ox, 120, INK, 2.4); LN(ox, 150, ox, by, INK, 2.4); LN(tx, ty, tx, by, INK, 2.4); LN(rx, ty, rx, by, INK, 2.4); DOT(tx, ty, 4, INK); DOT(tx, by, 4, INK);
      pilev(ox, 135, '12 V'); q_resis(tx, 140, 'v', '60 Ω', 44); q_resis(rx, 140, 'v', '30 Ω', 44);
      if (g > 0) {
        ctx.globalAlpha = q_s(p, 0, .4); A(120, ty, 28, 0, ORA2, '', 7); TB('I = 0,60 A', 120, ty - 16, ORA2, 14);
        A(tx, 100, 0, 22, ORA2, '', 3); TB('0,20 A', tx - 14, 98, ORA2, 14, 'right'); A(rx, 100, 0, 22, ORA2, '', 5); TB('0,40 A', rx - 14, 98, ORA2, 14, 'right');
        ctx.globalAlpha = 1; TB('R = 60 × 30 / 90 = 20 Ω · I = 12 / 20 = 0,60 A', 230, 255, DGREEN, 14);
        TB('0,20 + 0,40 = 0,60 A (nœuds)', 230, 275, DGREEN, 13);
      } else TB('R ?  I ?  I₁ ?  I₂ ?', 230, 255, GREY, 16);
    }),
    /* 7 Trois lampes identiques */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      function circ(ox, off, b1, b2, b3, titre) {
        var x0 = ox, x1 = ox + 170, y0 = 80, y1 = 205, mx = x0 + 90, n2 = x1 - 5;
        LN(x0, y0, mx - 20, y0, INK, 2.4); LN(x0, y1, x1, y1, INK, 2.4); LN(x0, y0, x0, 128, INK, 2.4); LN(x0, 158, x0, y1, INK, 2.4); LN(mx + 20, y0, x1, y0, INK, 2.4);
        pilev(x0, 143, ''); q_lampe(mx, y0, b1, 13); TB('L₁', mx, y0 - 24, INK, 13);
        LN(mx + 40, y0, mx + 40, y1, INK, 2.4); DOT(mx + 40, y0, 4, INK); DOT(mx + 40, y1, 4, INK);
        q_lampe(mx + 40, 143, b2, 13); TB('L₂', mx + 62, 148, INK, 13, 'left');
        LN(x1, y0, x1, 118, INK, 2.4); LN(x1, 168, x1, y1, INK, 2.4);
        if (b3 !== null) q_lampe(x1, 143, b3, 13); else { ctx.fillStyle = '#d5d8dc'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x1 - 12, 138, 24, 24, 3); ctx.fill(); ctx.stroke(); }
        TB(titre, ox + 85, 38, GREY, 15);
      }
      circ(20, 0, .99, .25, .25, 'avant'); TB('L₃', 195, 190, INK, 13);
      ctx.globalAlpha = .35 + .65 * g; circ(250, 0, .55, .55, null, 'après (L₃ dévissée)'); ctx.globalAlpha = 1;
      if (g > .4) { ctx.globalAlpha = g; TB('L₁ moins, L₂ plus', 230, 262, DGREEN, 16); ctx.globalAlpha = 1; } else TB('L₁ ? L₂ ?', 230, 262, GREY, 16);
    }),
    /* 8 Circuit mixte */
    q_fig(function (p) {
      var x0 = 40, y0 = 75, tx = 270, rx = 400, y1 = 215;
      LN(x0, y0, 140, y0, INK, 2.4); LN(176, y0, rx, y0, INK, 2.4); LN(x0, y1, rx, y1, INK, 2.4); LN(x0, y0, x0, 128, INK, 2.4); LN(x0, 158, x0, y1, INK, 2.4); LN(tx, y0, tx, y1, INK, 2.4); LN(rx, y0, rx, y1, INK, 2.4); DOT(tx, y0, 4, INK); DOT(tx, y1, 4, INK);
      pilev(x0, 143, '12 V'); q_resis(158, y0, 'h', '', 36); TB('R₁ = 20 Ω', 158, y0 - 16, INK, 13);
      q_resis(tx, 145, 'v', '30 Ω', 44); q_resis(rx, 145, 'v', '60 Ω', 44);
      var s = [q_s(p, 0, .25), q_s(p, .2, .45), q_s(p, .4, .65), q_s(p, .6, .85)];
      if (s[0] > 0) { ctx.globalAlpha = s[0]; TB('R₂₃ = 20 Ω', 335, 255, DGREEN, 14); ctx.globalAlpha = 1; }
      if (s[1] > 0) { ctx.globalAlpha = s[1]; TB('R = 40 Ω  ·  I = 0,30 A', 140, 255, DGREEN, 14); ctx.globalAlpha = 1; }
      if (s[2] > 0) { ctx.globalAlpha = s[2]; TB('U₁ = 6 V', 158, y0 + 28, BLUE_D, 14); TB('6 V', 335, 112, BLUE_D, 14); ctx.globalAlpha = 1; }
      if (s[3] > 0) { ctx.globalAlpha = s[3]; TB('0,20 A', tx - 14, 190, ORA2, 14, 'right'); TB('0,10 A', rx + 14, 190, ORA2, 14, 'left'); ctx.globalAlpha = 1; }
      if (p <= 0.02) TB('R₂₃ ?  R ?  I ?  U₁ ?  I₂ ?  I₃ ?', 230, 265, GREY, 14);
    }),
    /* 9 Où est la panne ? */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), x0 = 40, y0 = 130, x1 = 420, y1 = 225, xs = [110, 230, 350];
      q_rect(x0, y0, x1, y1, [['l', 178, 12], ['t', 110, 17], ['t', 230, 17], ['t', 350, 17]]); pilev(x0, 178, '6 V');
      var vals = ['0 V', '6 V', '0 V'];
      xs.forEach(function (x, i) { q_lampe(x, y0, 0, 15); TB('L' + '₁₂₃'[i], x, y0 + 38, INK, 14); q_meter(x, 55, 'V', BLUE, vals[i]); LN(x - 12, y0 - 10, x - 10, 66, INK, 1.6); LN(x + 12, y0 - 10, x + 10, 66, INK, 1.6); });
      if (g > 0) { ctx.globalAlpha = g; ctx.strokeStyle = RED; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.arc(230, y0, 24, 0, 7); ctx.stroke(); q_box(230, 262, 340, 30, DRED, '#fdeaea', 'L₂ est coupée : elle reçoit les 6 V', 15); ctx.globalAlpha = 1; }
      else TB('aucune lampe ne brille : laquelle est en cause ?', 230, 262, GREY, 15);
    })
  ]);
})();
