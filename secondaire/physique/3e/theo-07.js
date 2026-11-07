/* Physique 3e · chapitre 7 · Forces, poids et masse (utilise les aides q_* de theo-01.js) */
(function () {
  function fr(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
  /* ressort vertical de (x, y0) à (x, y1) */
  function vspring(x, y0, y1, n) {
    var seg = (y1 - y0) / n; ctx.strokeStyle = '#7f8790'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y0);
    for (var i = 0; i < n; i++) ctx.lineTo(x + (i % 2 ? -10 : 10), y0 + seg * (i + .5));
    ctx.lineTo(x, y1); ctx.stroke();
  }
  function ceil(x, y) { LN(x - 26, y, x + 26, y, INK, 3); ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; for (var h = x - 24; h < x + 26; h += 9) { ctx.beginPath(); ctx.moveTo(h, y); ctx.lineTo(h + 6, y - 7); ctx.stroke(); } }
  function planet(x, y, r, col, lab) { DOT(x, y, r, col + '33'); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); if (lab) TB(lab, x, y + 5, dk(col), 14); }
  function hang(x, y0, P, k, mlab, col) {
    var yb = y0 + 22 + P * k; ceil(x, y0); vspring(x, y0, yb, 9);
    ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = col || BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x - 22, yb, 44, 46, 5); ctx.fill(); ctx.stroke();
    TB(mlab, x, yb + 16, col || BLUE_D, 14); DOT(x, yb + 32, 3.5, DRED); return yb + 32;
  }

  SFA.theo("c07", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      TB('P = m · g', 150, 95, BLUE_D, 34); TB('newtons', 150, 125, GREY, 15);
      ceil(350, 30); vspring(350, 30, 105, 8); ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(328, 105, 44, 34, 5); ctx.fill(); ctx.stroke();
      A(350, 122, 0, 85, RED, '', 4); TB('P', 372, 196, DRED, 16, 'left');
      TB('force · poids · masse', 150, 215, INK, 18); TB('1 N ≈ poids de 100 g', 150, 240, GREY, 13);
    }),
    anim: q_an(function (t) {
      var T = 720, ph = (t % T) / T * 4, i = Math.floor(ph) % 4, f = ph - Math.floor(ph);
      var AS = [['Terre', 9.81, BLUE], ['Lune', 1.62, GREY], ['Mars', 3.71, ORA2], ['Jupiter', 24.79, VIOLET]];
      var a = AS[(i + 3) % 4], b = AS[i], e = q_s(f, 0, .22); e = e * e * (3 - 2 * e);
      var g = a[1] + (b[1] - a[1]) * e, P = 3 * g;
      planet(95, 150, 52, b[2], b[0]); TB('g = ' + fr(b[1], 2) + ' N/kg', 95, 228, dk(b[2]), 16);
      var cy = hang(330, 30, Math.min(P, 40), 3.1, '3 kg', BLUE_D);
      A(330, cy, 0, Math.min(P, 40) * 2.0 + 6, RED, '', 4); TB('P', 352, cy + Math.min(P, 40) * 2 + 4, DRED, 17, 'left');
      var tx = 460; TB('masse : m = 3 kg', tx, 70, BLUE_D, 20, 'left'); TB('(la même partout)', tx, 92, GREY, 13, 'left');
      TB('poids : P = m · g', tx, 140, DRED, 20, 'left');
      TB('= 3 × ' + fr(g, 2) + ' = ' + fr(P, 1) + ' N', tx, 170, INK, 20, 'left');
      q_box(tx + 95, 220, 190, 40, DRED, '#fdeaea', 'P = ' + fr(P, 1) + ' N', 22);
      if (b[0] === 'Jupiter') TB('Jupiter : le ressort s\'allonge beaucoup', tx, 268, GREY, 13, 'left');
    }),
    th:
      '<div class="tcard"><b class="h">Qu\'est-ce qu\'une force ?</b><p>Une <b>force</b> est l\'action d\'un objet sur un autre. Elle peut <b>déformer</b> un objet ou <b>modifier son mouvement</b> (le mettre en mouvement, l\'arrêter, changer sa direction). On la mesure en <b>newtons</b> (N) avec un <b>dynamomètre</b>. Elle peut s\'exercer au contact (pousser une porte) ou à distance (la Terre attire une pomme).</p><p>Une force se décrit par <b>quatre caractéristiques</b> et se représente par une <b>flèche</b> (un vecteur) :</p><ul><li><b>point d\'application</b> : où elle agit (origine de la flèche) ;</li><li><b>direction</b> : la droite qui porte la flèche ;</li><li><b>sens</b> : vers où pointe la flèche ;</li><li><b>valeur</b> (intensité) : la longueur de la flèche, selon une <b>échelle</b> (par exemple 1 cm pour 10 N).</li></ul></div>' +
      '<div class="tcard"><b class="h">Poids et masse : deux grandeurs différentes</b><p>La <b>masse</b> m mesure la quantité de matière : elle s\'exprime en <b>kg</b>, se mesure avec une balance et <b>ne change jamais</b> d\'un lieu à l\'autre. Le <b>poids</b> P est la force d\'attraction de l\'astre sur l\'objet : en <b>newtons</b>, mesuré au dynamomètre, il <b>dépend de l\'astre</b>.</p><p><b>P = m · g</b>, où g est l\'intensité de la pesanteur (N/kg) : Terre 9,81 ; Lune 1,62 ; Mars 3,71 ; Jupiter 24,79.</p><p>Le poids a pour point d\'application le <b>centre de gravité</b>, il est <b>vertical</b> et dirigé <b>vers le bas</b>.</p><p><b>Exemple :</b> un astronaute de 80 kg pèse 80 × 9,81 ≈ <b>785 N</b> sur Terre et 80 × 1,62 ≈ <b>130 N</b> sur la Lune ; sa masse reste 80 kg.</p></div>' +
      '<div class="tcard"><b class="h">Le dynamomètre et la loi de Hooke</b><p>Un ressort s\'allonge proportionnellement à la force qu\'on lui applique : <b>F = k · Δℓ</b>, où k est la <b>raideur</b> du ressort (en N/m) et Δℓ son allongement (en <b>mètres</b>). C\'est le principe du dynamomètre : on gradue le ressort en newtons.</p><p><b>Exemple :</b> k = 40 N/m et Δℓ = 5 cm = 0,05 m donnent F = 40 × 0,05 = <b>2 N</b>.</p><p>Pour étalonner : on accroche des masses connues, on calcule F = m·g, et le rapport F / Δℓ doit rester constant (ici c\'est la pente de la droite F en fonction de Δℓ). Au-delà de la <b>limite d\'élasticité</b>, le ressort se déforme définitivement et la loi n\'est plus valable.</p></div>' +
      '<div class="tcard"><b class="h">Action et réaction</b><p>Quand un objet A exerce une force sur un objet B, B exerce sur A une force de <b>même valeur</b>, de <b>même direction</b> et de <b>sens opposé</b>. Ces deux forces s\'appliquent sur <b>deux objets différents</b> : elles ne s\'annulent donc pas entre elles.</p><p>Dans un tir à la corde, les deux équipes se tirent avec la même force ; celle qui gagne est celle dont les pieds poussent le plus fort sur le sol sans glisser. En orbite, les astronautes « flottent » car ils sont en chute libre avec la station : la gravité (g ≈ 8,7 N/kg à 400 km) existe toujours.</p></div>' +
      '<div class="tcard"><b class="h">Méthode et pièges</b><ul><li>Masse en <b>kg</b>, poids en <b>N</b> : ne dis jamais « mon poids est de 60 kilos ».</li><li>Convertir avant de calculer : g → kg (÷ 1 000), cm → m (÷ 100).</li><li>Pour une flèche : longueur = valeur ÷ échelle (6 kg → 58,9 N → 5,9 cm avec 1 cm pour 10 N).</li><li>Une masse ne devient jamais nulle ; seul le poids varie avec l\'astre.</li><li>Ne confonds pas k (N/m, propre au ressort) et g (N/kg, propre à l\'astre).</li></ul></div>'
  });

  SFA.figs("c07", [
    /* 0 Poids d'un livre : les quatre caractéristiques */
    q_fig(function (p) {
      floor(40, 420, 170); ctx.fillStyle = '#d9c6a0'; ctx.fillRect(40, 140, 380, 30);
      ctx.fillStyle = '#e6f1fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.fillRect(150, 112, 100, 28); ctx.strokeRect(150, 112, 100, 28); TB('livre', 200, 131, BLUE_D, 14);
      var g = q_s(p, 0, .3), h = q_s(p, .3, .6);
      A(200, 126, 0, 95, RED, '', 4); TB('P', 218, 224, DRED, 17, 'left');
      if (g > 0) { DOT(200, 126, 6, GREEN); ctx.globalAlpha = g; TB('① point d\'application', 270, 72, DGREEN, 14, 'left'); LN(262, 74, 206, 123, GREEN, 1.4, [3, 3]); ctx.globalAlpha = 1; }
      if (h > 0) { ctx.globalAlpha = h; LN(200, 62, 200, 100, ORANGE, 1.8, [5, 4]); TB('② verticale', 300, 190, ORANGE, 14, 'left'); TB('③ vers le bas', 300, 212, DRED, 14, 'left'); TB('④ P = m · g', 300, 234, BLUE_D, 14, 'left'); ctx.globalAlpha = 1; }
      if (p <= .02) TB('quelles caractéristiques ?', 330, 100, GREY, 14);
    }),
    /* 1 P = m·g : Terre et Lune */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      TB('Terre  g = 9,81', 115, 28, BLUE_D, 14); TB('Lune  g = 1,62', 345, 28, GREY, 14);
      var cy1 = hang(115, 40, 29.4, 4.1, '3 kg', BLUE_D), cy2 = hang(345, 40, 4.86, 4.1 * 29.4 / 29.4, '3 kg', BLUE_D);
      A(115, cy1, 0, 60 * (g > 0 ? g : .3), RED, '', 4); A(345, cy2, 0, 10 * (g > 0 ? g : .3) + 4, RED, '', 4);
      if (g > 0) { ctx.globalAlpha = g; TB('P = 3 × 9,81 ≈ 29,4 N', 115, 262, DRED, 16); TB('P = 3 × 1,62 ≈ 4,86 N', 345, 262, DRED, 16); ctx.globalAlpha = 1; } else { TB('P ?', 115, 262, GREY, 16); TB('P ?', 345, 262, GREY, 16); }
    }),
    /* 2 Astronaute sur la Lune */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      planet(115, 262, 82, BLUE, ''); planet(345, 262, 82, GREY, '');
      pers(115, 180, 60, ORA2, 1, '', 'center'); pers(345, 180, 60, ORA2, 1, '', 'center');
      TB('Terre', 115, 40, BLUE_D, 16); TB('Lune', 345, 40, GREY, 16);
      TB('80 kg', 115, 72, INK, 17); TB('80 kg', 345, 72, INK, 17);
      if (g > 0) { ctx.globalAlpha = g; TB('P ≈ 785 N', 115, 100, DRED, 16); TB('P ≈ 130 N', 345, 100, DRED, 16); TB('masse : inchangée', 230, 262, DGREEN, 17); ctx.globalAlpha = 1; } else TB('masse = ?', 230, 262, GREY, 17);
    }),
    /* 3 Échelle de la flèche */
    q_fig(function (p) {
      var k = 24, g = q_s(p, 0, .7);
      floor(150, 420, 150); ctx.fillStyle = '#f0e0c8'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(240, 110, 70, 40, 8); ctx.fill(); ctx.stroke(); TB('6 kg', 275, 128, ORANGE, 16); DOT(275, 140, 4, DRED); A(275, 140, 0, 58.9 / 10 * k * g, RED, '', 4);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 1.5; LN(60, 100, 60, 100 + k, INK, 3); LN(54, 100, 66, 100, INK, 2); LN(54, 100 + k, 66, 100 + k, INK, 2);
      TB('1 cm', 80, 116, INK, 14, 'left'); TB('= 10 N', 80, 136, INK, 14, 'left');
      if (g > .95) { TB('59 N ÷ 10 = 5,9 cm', 375, 215, DRED, 16); } else TB('longueur = ?', 375, 215, GREY, 16);
    }),
    /* 4 Rover sur Mars : barres */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      TB('rover : m = 900 kg', 230, 30, INK, 17);
      TB('Terre', 20, 88, BLUE_D, 15, 'left'); TB('Mars', 20, 168, ORA2, 15, 'left');
      ctx.fillStyle = BLUE + '55'; ctx.fillRect(90, 66, 300 * g, 34); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.strokeRect(90, 66, 300 * g, 34);
      ctx.fillStyle = ORA2 + '55'; ctx.fillRect(90, 146, 113.3 * g, 34); ctx.strokeStyle = ORA2; ctx.strokeRect(90, 146, 113.3 * g, 34);
      if (g > .9) { TB('8 829 N', 396, 89, DRED, 15, 'left'); TB('3 339 N', 210, 169, DRED, 15, 'left'); q_box(230, 240, 300, 40, DGREEN, '#e9f6f0', 'rapport ≈ 0,38', 20); } else { TB('P = ?', 230, 210, GREY, 17); }
    }),
    /* 5 Force d'un ressort */
    q_fig(function (p) {
      var g = q_s(p, 0, .6), d = 60 * 1; wall(50, 90, 190, 1);
      floor(50, 440, 190); LN(50, 150, 50, 150, INK);
      var x1 = 50, xb = 160 + d, ex = xb; spring(x1, ex, 160, 9);
      blockR(ex + 28, 160 - 6, 28, 22, BLUE_D); TB('ressort', 105, 128, GREY, 13);
      LN(160, 205, 160, 235, GREY, 1.4); LN(160 + d, 205, 160 + d, 235, GREY, 1.4); A(160 + d, 220, -d, 0, ORANGE, '', 2); LN(160, 220, 160 + d, 220, ORANGE, 2.4); TB('Δℓ = 5 cm', 160 + d / 2, 252, ORANGE, 14);
      TB('k = 40 N/m', 105, 40, BLUE_D, 18);
      if (g > 0) { ctx.globalAlpha = g; A(ex, 154, -70, 0, RED, '', 4); TB('F', ex - 82, 140, DRED, 16); TB('F = k·Δℓ = 40 × 0,05 = 2 N', 330, 90, DRED, 15); ctx.globalAlpha = 1; } else TB('F = ?', 330, 90, GREY, 17);
    }),
    /* 6 Étalonnage : graphe F(Δℓ) */
    q_fig(function (p) {
      var ox = 70, oy = 240, kx = 32, ky = 48;
      LN(ox, oy, ox + 340, oy, AX, 1.6); LN(ox, oy, ox, oy - 205, AX, 1.6); TB('Δℓ (cm)', ox + 345, oy + 16, GREY, 12, 'right'); TB('F (N)', ox + 8, oy - 210, GREY, 12, 'left');
      [0, 2, 4, 6, 8, 10].forEach(function (v) { LN(ox + v * kx, oy, ox + v * kx, oy + 4, GREY, 1); T(String(v), ox + v * kx, oy + 16, GREY, 11); });
      [1, 2, 3, 4].forEach(function (v) { LN(ox - 4, oy - v * ky, ox, oy - v * ky, GREY, 1); T(String(v), ox - 8, oy - v * ky + 4, GREY, 11, 'right'); });
      var g = q_s(p, 0, .5), h = q_s(p, .5, 1);
      if (g > 0) { ctx.globalAlpha = g; LN(ox, oy, ox + 10.4 * kx * g, oy - 10.4 * 0.3924 * ky * g, BLUE, 2.4); ctx.globalAlpha = 1; }
      [[2.5, .981], [5, 1.962], [7.5, 2.943], [10, 3.924]].forEach(function (d) { DOT(ox + d[0] * kx, oy - d[1] * ky, 5.5, ORA2); });
      TB('4 pesées : 100 à 400 g', 330, 40, ORA2, 14);
      if (h > 0) {
        ctx.globalAlpha = h; LN(ox + 8.75 * kx, oy, ox + 8.75 * kx, oy - 3.43 * ky, GREEN, 1.6, [4, 3]); LN(ox, oy - 3.43 * ky, ox + 8.75 * kx, oy - 3.43 * ky, GREEN, 1.6, [4, 3]); DOT(ox + 8.75 * kx, oy - 3.43 * ky, 5, GREEN);
        TB('350 g → 8,75 cm', ox + 8.75 * kx - 10, oy - 3.43 * ky - 12, DGREEN, 13, 'right'); TB('k = F/Δℓ ≈ 39 N/m', 90, 30, DRED, 16, 'left'); ctx.globalAlpha = 1;
      } else TB('droite ?', 90, 30, GREY, 16, 'left');
    }),
    /* 7 Flotter dans la station */
    q_fig(function (p) {
      var cx = 150, cy = 140;
      DOT(cx, cy, 70, '#cfe3f6'); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy, 70, 0, 7); ctx.stroke(); TB('Terre', cx, cy + 5, BLUE_D, 16);
      ctx.strokeStyle = GREY; ctx.lineWidth = 1.4; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, cy, 92, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      var a = -0.9 + p * 2.8, sx = cx + 92 * Math.cos(a), sy = cy + 92 * Math.sin(a);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(sx - 12, sy - 7, 24, 14, 3); ctx.fill(); ctx.stroke(); LN(sx - 24, sy, sx - 12, sy, BLUE, 4); LN(sx + 12, sy, sx + 24, sy, BLUE, 4);
      var dx = cx - sx, dy = cy - sy, l = Math.hypot(dx, dy); A(sx, sy, dx / l * 32, dy / l * 32, RED, '', 3);
      TB('400 km', cx + 80, cy - 100, GREY, 12);
      TB('g ≈ 8,7 N/kg', 340, 80, DRED, 18); TB('la gravité existe encore !', 340, 106, DRED, 14);
      var g = q_s(p, .1, .5);
      if (g > 0) { ctx.globalAlpha = g; q_box(340, 190, 220, 70, DGREEN, '#e9f6f0'); TB('station + astronautes', 340, 180, DGREEN, 14); TB('tombent ensemble', 340, 200, DGREEN, 14); TB('= chute libre', 340, 220, DGREEN, 14); ctx.globalAlpha = 1; }
    }),
    /* 8 Sur quel astre ? */
    q_fig(function (p) {
      var D = [['Lune', 1.62, GREY], ['Mars', 3.71, ORA2], ['Terre', 9.81, BLUE], ['Jupiter', 24.79, VIOLET]], g = q_s(p, 0, .6);
      TB('g (N/kg)', 230, 22, INK, 15);
      D.forEach(function (d, i) {
        var y = 44 + i * 50, w = 11 * d[1], mars = d[0] === 'Mars', hl = mars && g > .9;
        TB(d[0], 20, y + 24, dk(d[2]), 15, 'left'); ctx.fillStyle = d[2] + (hl ? 'aa' : '44'); ctx.fillRect(100, y + 6, w, 28); ctx.strokeStyle = d[2]; ctx.lineWidth = hl ? 3.2 : 1.8; ctx.strokeRect(100, y + 6, w, 28);
        TB(fr(d[1], 2), 100 + w + 8, y + 26, dk(d[2]), 14, 'left');
      });
      if (g > .5) { ctx.globalAlpha = q_s(p, .5, .9); TB('g = 45,4 ÷ 12,2 = 3,71 → Mars', 230, 262, DRED, 17); ctx.globalAlpha = 1; } else TB('45,4 N → quel astre ?', 230, 262, GREY, 16);
    }),
    /* 9 Tir à la corde */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      floor(20, 440, 150); LN(98, 100, 362, 100, ORANGE, 4); LN(230, 92, 230, 108, RED, 4);
      pers(80, 150, 70, BLUE, 1, 'A', 'center'); pers(380, 150, 70, ORA2, -1, 'B', 'center');
      A(112, 86, 55, 0, DRED, '', 3.4); TB('B sur A : 900 N', 100, 60, DRED, 14, 'left');
      A(348, 86, -55, 0, DRED, '', 3.4); TB('A sur B : 900 N', 360, 60, DRED, 14, 'right');
      if (g > 0) { ctx.globalAlpha = g; A(100, 178, 60, 0, DGREEN, '', 3.2); A(360, 178, -60, 0, DGREEN, '', 3.2); TB('sol sur A', 90, 205, DGREEN, 13); TB('sol sur B', 370, 205, DGREEN, 13); TB('les forces de la corde sont égales :', 230, 245, INK, 15); TB('le sol décide du gagnant', 230, 266, DGREEN, 16); ctx.globalAlpha = 1; } else TB('qui tire le plus fort ?', 230, 245, GREY, 17);
    })
  ]);
})();
