/* Physique 3e · chapitre 1 · Électrostatique. Contient aussi les petites aides communes q_* des theo-NN.js du cours. */
function q_c(v, a, b) { return Math.max(a, Math.min(b, v)); }
function q_s(p, a, b) { return q_c((p - a) / (b - a), 0, 1); }
/* dessine fn dans une zone de conception dw × dh, centrée et mise à l'échelle dans le canvas courant */
function q_fit(fn, dw, dh) {
  return function (a) {
    var w0 = W, h0 = H, u = Math.min(w0 / dw, h0 / dh);
    ctx.save(); ctx.translate((w0 - dw * u) / 2, (h0 - dh * u) / 2); ctx.scale(u, u); W = dw; H = dh;
    try { fn(a); } finally { W = w0; H = h0; ctx.restore(); }
  };
}
function q_fig(fn) { return q_fit(fn, 460, 280); }
function q_an(fn) { return q_fit(fn, 700, 300); }
function q_ic(fn) { return q_fit(fn, 460, 260); }
function q_sign(x, y, sg, s) { TB(sg > 0 ? '+' : '−', x, y + 5, sg > 0 ? DRED : BLUE_D, s || 17); }
function q_box(x, y, w, h, col, fill, lab, ls) {
  ctx.fillStyle = fill || '#fff'; ctx.strokeStyle = col || INK; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 6); ctx.fill(); ctx.stroke();
  if (lab) TB(lab, x, y + 5, dk(col || INK), ls || 14);
}
/* rectangle de fils avec des interruptions g = [[côté 't'|'b'|'l'|'r', centre, demi-largeur], …] */
function q_rect(x0, y0, x1, y1, g, col, w) {
  col = col || INK; w = w || 2.4; g = g || [];
  ctx.save(); ctx.lineCap = 'round';
  function side(a, b, fx, hz, sd) {
    var gs = g.filter(function (q) { return q[0] === sd; }).map(function (q) { return [q[1] - q[2], q[1] + q[2]]; }).sort(function (m, n) { return m[0] - n[0]; });
    var cur = a;
    function seg(s, e) { if (hz) LN(s, fx, e, fx, col, w); else LN(fx, s, fx, e, col, w); }
    gs.forEach(function (r) { if (r[0] > cur) seg(cur, r[0]); cur = r[1]; });
    if (cur < b) seg(cur, b);
  }
  side(x0, x1, y0, true, 't'); side(x0, x1, y1, true, 'b'); side(y0, y1, x0, false, 'l'); side(y0, y1, x1, false, 'r');
  ctx.restore();
}
/* position le long du rectangle (horaire depuis le coin haut-gauche), s dans [0,1[ */
function q_pos(x0, y0, x1, y1, s) {
  var w = x1 - x0, h = y1 - y0, L = 2 * (w + h), d = (((s % 1) + 1) % 1) * L;
  if (d < w) return [x0 + d, y0]; d -= w;
  if (d < h) return [x1, y0 + d]; d -= h;
  if (d < w) return [x1 - d, y1]; d -= w;
  return [x0, y1 - d];
}
/* pile : plaque longue (+) à gauche ou en haut, courte (−) de l'autre côté ; o = 'h' ou 'v' */
function q_pile(x, y, o, lab) {
  ctx.fillStyle = '#fff';
  if (o === 'v') { ctx.fillRect(x - 16, y - 9, 32, 18); LN(x - 15, y - 5, x + 15, y - 5, INK, 2.6); LN(x - 8, y + 5, x + 8, y + 5, INK, 4.5); if (lab) TB(lab, x + 22, y + 5, DGREEN, 13, 'left'); }
  else { ctx.fillRect(x - 9, y - 16, 18, 32); LN(x - 5, y - 15, x - 5, y + 15, INK, 2.6); LN(x + 5, y - 8, x + 5, y + 8, INK, 4.5); if (lab) TB(lab, x, y - 22, DGREEN, 13); }
}
function q_lampe(x, y, b, r, lab) {
  r = r || 15; b = b === undefined ? 1 : b;
  if (b > 0.02) { var g = ctx.createRadialGradient(x, y, 2, x, y, r * 2.4); g.addColorStop(0, 'rgba(255,214,60,' + (0.85 * b) + ')'); g.addColorStop(1, 'rgba(255,214,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,240,170,' + (0.25 + 0.7 * b) + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  var k = r * 0.7; LN(x - k, y - k, x + k, y + k, INK, 2); LN(x + k, y - k, x - k, y + k, INK, 2);
  if (lab) TB(lab, x, y + r + 16, INK, 13);
}
function q_resis(x, y, o, lab, len) {
  var L = len || 44, hw = o === 'v' ? 8 : L / 2, hh = o === 'v' ? L / 2 : 8;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.rect(x - hw, y - hh, 2 * hw, 2 * hh); ctx.fill(); ctx.stroke();
  if (lab) { if (o === 'v') TB(lab, x + 14, y + 5, INK, 13, 'left'); else TB(lab, x, y - 14, INK, 13); }
}
function q_inter(x, y, closed, lab) {
  ctx.fillStyle = '#fff'; ctx.fillRect(x - 20, y - 12, 40, 24);
  DOT(x - 18, y, 3.5, INK); DOT(x + 18, y, 3.5, INK);
  if (closed) LN(x - 18, y, x + 18, y, INK, 2.6); else LN(x - 18, y, x + 12, y - 15, INK, 2.6);
  if (lab) TB(lab, x, y + 22, INK, 13);
}
function q_meter(x, y, l, col, val) {
  DOT(x, y, 15, '#fff'); ctx.strokeStyle = col || INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.stroke();
  TB(l, x, y + 5, dk(col || INK), 15);
  if (val) TB(val, x, y - 22, dk(col || INK), 13);
}
/* électroscope : renvoie la géométrie {px,py (pivot), cx,cy (chapeau), l,r (bouts des feuilles)} */
function q_electro(cx, cy, ang, rodCol) {
  ctx.fillStyle = 'rgba(200,225,245,.35)'; ctx.strokeStyle = GREY; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(cx - 38, cy - 96, 76, 96, 10); ctx.fill(); ctx.stroke();
  var py = cy - 62;
  LN(cx, py, cx, cy - 122, rodCol || INK, 3); DOT(cx, cy - 128, 12, '#fff'); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy - 128, 12, 0, 7); ctx.stroke();
  var L = 36, lx = cx - L * Math.sin(ang), rx = cx + L * Math.sin(ang), ly = py + L * Math.cos(ang);
  LN(cx, py, lx, ly, ORANGE, 3.5); LN(cx, py, rx, ly, ORANGE, 3.5);
  return { px: cx, py: py, cx: cx, cy: cy - 128, l: [lx, ly], r: [rx, ly] };
}
function q_elec(x, y, r) { DOT(x, y, r || 5, '#d6e8fa'); ctx.strokeStyle = BLUE; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, r || 5, 0, 7); ctx.stroke(); TB('−', x, y + (r || 5) * .75, BLUE_D, (r || 5) * 2.1); }
function q_prot(x, y, r) { DOT(x, y, r || 5, '#fbe0e0'); ctx.strokeStyle = RED; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, r || 5, 0, 7); ctx.stroke(); TB('+', x, y + (r || 5) * .72, DRED, (r || 5) * 2.1); }

(function () {
  /* bloc d'atomes simplifié : + fixes (rangées) et électrons mobiles */
  function bloc(cx, cy, w, h) {
    ctx.fillStyle = '#f3f6fa'; ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8); ctx.fill(); ctx.stroke();
    for (var i = 0; i < 6; i++) { var q = col(cx, cy, w, h, i); q_prot(q[0], q[1], 9); }
  }
  function col(cx, cy, w, h, i) { return [cx - w / 2 + 38 + (i % 3) * (w - 76) / 2, cy - h / 4 + Math.floor(i / 3) * h / 2]; }
  function slot(cx, cy, w, h, i) { var q = col(cx, cy, w, h, i); return [q[0] + 17, q[1] + 13]; }

  SFA.theo("c01", {
    icon: q_ic(function () {
      ctx.fillStyle = '#f6f7f9'; ctx.fillRect(0, 0, W, H);
      // ballon négatif et pull positif, électrons qui passent
      ctx.fillStyle = '#e9f1fb'; ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(310, 112, 62, 72, 0, 0, 7); ctx.fill(); ctx.stroke();
      LN(310, 184, 306, 214, BLUE, 2);
      [[285, 90], [330, 88], [305, 125], [345, 128], [275, 130], [318, 160], [290, 160]].forEach(function (q) { q_elec(q[0], q[1], 8); });
      ctx.fillStyle = '#fbe9e8'; ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(40, 62, 120, 100, 10); ctx.fill(); ctx.stroke();
      [[68, 92], [118, 90], [140, 122], [76, 130], [112, 140]].forEach(function (q) { q_prot(q[0], q[1], 8); });
      A(168, 112, 62, 0, ORANGE, '', 3.5); TB('e⁻', 200, 100, ORANGE, 17);
      TB('Électrostatique', 230, 232, BLUE_D, 24); TB('q = N · e', 400, 232, ORANGE, 17);
    }),
    anim: q_an(function (t) {
      var T = 720, ph = (t % T) / T;
      ctx.globalAlpha = Math.min(1, ph / .05, (1 - ph) / .08);
      var e = q_c((ph - .05) / .15, 0, 1), m = q_c((ph - .22) / .28, 0, 1), s = q_c((ph - .64) / .2, 0, 1);
      var ap = e * (1 - s); ap = ap * ap * (3 - 2 * ap);
      var bw = 230, bh = 140, cy = 125, cxT = 130 + 105 * ap, cxB = 570 - 105 * ap;
      var osc = (ph > .2 && ph < .56) ? 7 * Math.sin(t / 5) : 0, cyB = cy + osc;
      bloc(cxT, cy, bw, bh); bloc(cxB, cyB, bw, bh);
      TB('tissu de laine', cxT, cy - bh / 2 - 12, INK, 15); TB('bâton de PVC', cxB, cyB - bh / 2 - 12, INK, 15);
      for (var i = 0; i < 6; i++) { var a = slot(cxB, cyB, bw, bh, i); q_elec(a[0], a[1], 7); }
      for (var j = 0; j < 6; j++) {
        var q0 = slot(cxT, cy, bw, bh, j);
        if (j < 3) {
          var c0 = col(cxB, cyB, bw, bh, j), tgt = [c0[0] - 17, c0[1] + 13];
          var mm = q_c(m * 1.25 - j * .12, 0, 1), arc = Math.sin(mm * PI) * 26;
          q_elec(q0[0] + (tgt[0] - q0[0]) * mm, q0[1] + (tgt[1] - q0[1]) * mm - arc, 7);
        } else q_elec(q0[0], q0[1], 7);
      }
      var n = Math.round(3 * m);
      TB('tissu : ' + (n ? '+' + n : '0'), cxT, 245, n ? DRED : INK, 18); TB('bâton : ' + (n ? '\u2212' + n : '0'), cxB, 245, n ? BLUE_D : INK, 18);
      TB('charge totale = ' + (n ? (n + ' \u2212 ' + n + ' = ') : '') + '0', 350, 283, DGREEN, 16);
      ctx.globalAlpha = 1;
      if (ph > .24 && ph < .6) TB('les électrons passent du tissu au bâton', 350, 22, ORANGE, 16);
      if (ph >= .64 && ph < .95) TB('rien n\'est créé : on a déplacé des électrons', 350, 22, ORANGE, 16);
    }),
    th:
      '<div class="tcard"><b class="h">La charge électrique</b><p>La matière est faite d\'atomes : un noyau chargé <b>positivement</b> (protons) entouré d\'<b>électrons</b>, chargés négativement. Un corps est <b>neutre</b> quand il possède autant de charges + que de charges −. Seuls les électrons peuvent se déplacer d\'un corps à l\'autre : les protons restent dans les noyaux.</p><ul><li>Corps <b>chargé négativement</b> = excès d\'électrons ; chargé <b>positivement</b> = manque d\'électrons.</li><li>Unité : le coulomb (C). La charge d\'un électron vaut <b>e = 1,6·10<sup>−19</sup> C</b> en valeur absolue ; toute charge est un multiple de e : <b>q = ±N·e</b>.</li><li><b>Conservation :</b> la charge ne se crée ni ne se détruit, elle se déplace. Le total ballon + pull reste nul.</li></ul></div>' +
      '<div class="tcard"><b class="h">Attraction et répulsion</b><p>Deux charges de <b>même signe se repoussent</b>, deux charges de <b>signes contraires s\'attirent</b>. Plus les corps sont proches, plus la force est grande.</p><ul><li>Les deux forces sont toujours égales en valeur et de sens opposés (action-réaction), même si l\'un des corps est plus chargé : +4 nC sur −1 nC, c\'est la même force dans les deux sens.</li><li>Une <b>répulsion</b> prouve que les deux corps sont chargés du même signe. Une <b>attraction</b> n\'est pas une preuve : un corps neutre est aussi attiré (voir polarisation).</li></ul></div>' +
      '<div class="tcard"><b class="h">Trois façons d\'électriser</b><ul><li><b>Frottement :</b> des électrons passent d\'un matériau à l\'autre (ballon + pull : le ballon gagne, le pull perd).</li><li><b>Contact :</b> un corps chargé touche un conducteur ; la charge se partage. Deux sphères identiques se partagent la charge en deux moitiés égales : −4,8 nC devient −2,4 nC et −2,4 nC.</li><li><b>Influence :</b> on approche sans toucher ; les charges mobiles du conducteur se déplacent. Si on relie à la terre (doigt) puis qu\'on retire la tige, le conducteur garde une charge de signe <b>contraire</b> à celle de la tige.</li></ul></div>' +
      '<div class="tcard"><b class="h">Conducteurs, isolants, polarisation</b><p>Dans un <b>conducteur</b> (métaux, graphite, eau salée), des charges sont libres de circuler. Dans un <b>isolant</b> (plastique, verre, bois sec), elles restent là où on les a mises. Un bâton de plastique frotté reste chargé ; une tige de cuivre tenue à la main se décharge dans la terre via le corps.</p><p>Un corps neutre approché d\'un corps chargé se <b>polarise</b> : ses charges se déplacent légèrement, le côté proche prend la charge contraire, et l\'attraction l\'emporte sur la répulsion (papier, filet d\'eau, feuilles de l\'électroscope).</p></div>' +
      '<div class="tcard"><b class="h">Méthode et pièges</b><p><b>Exemple :</b> un bâton gagne 5·10<sup>10</sup> électrons. |q| = N·e = 5·10<sup>10</sup> × 1,6·10<sup>−19</sup> = 8·10<sup>−9</sup> C ; il a gagné des électrons donc q = <b>−8 nC</b>.</p><ul><li>Piège : « positif » ne veut pas dire qu\'il a gagné des protons, mais qu\'il a <b>perdu des électrons</b>.</li><li>Piège : « neutre » ne veut pas dire « sans charges » : il y a des + et des − qui se compensent.</li><li>Contacts successifs : à chaque contact entre deux sphères identiques, on fait la <b>moyenne</b> des charges ; le total ne change pas.</li></ul></div>'
  });

  /* ---- électrons : mini-scène avec bâton et boules suspendues ---- */
  function susp(x, len, dx, col, lab) {
    LN(x - 22, 20, x + 22, 20, INK, 3);
    var bx = x + dx, by = 20 + Math.sqrt(len * len - dx * dx);
    LN(x, 20, bx, by, INK, 1.8); DOT(bx, by, 15, '#fff'); ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(bx, by, 15, 0, 7); ctx.stroke();
    if (lab) TB(lab, bx, by + 5, dk(col), 15);
    return [bx, by];
  }
  function rod(cx, cy, w, sg, ang) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang || 0); ctx.fillStyle = sg > 0 ? '#fbe9e8' : '#e6f1fb'; ctx.strokeStyle = sg > 0 ? RED : BLUE; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(-w / 2, -9, w, 18, 6); ctx.fill(); ctx.stroke(); for (var i = -2; i <= 2; i++) q_sign(i * w / 5.5, 0, sg, 15); ctx.restore(); }

  SFA.figs("c01", [
    /* 0 Qui prend les électrons ? */
    q_fig(function (p) {
      var m = q_s(p, 0, .7), f = q_s(p, .6, 1);
      ctx.fillStyle = '#fbf3e6'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(40, 70, 150, 140, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fdece4'; ctx.strokeStyle = m > 0 ? BLUE : ORA2; ctx.beginPath(); ctx.ellipse(350, 125, 66, 80, 0, 0, 7); ctx.fill(); ctx.stroke(); LN(350, 205, 346, 232, ORA2, 2);
      TB('pull en laine', 115, 238, ORANGE, 15); TB('ballon', 350, 258, m > 0 ? BLUE_D : ORA2, 15);
      A(200, 130, 88, 0, GREY, '', 3); TB('frottement', 245, 112, GREY, 14);
      if (m > 0) {
        ctx.globalAlpha = m; [[322, 100], [378, 104], [330, 148], [372, 152]].forEach(function (q) { q_elec(q[0], q[1], 9); });
        A(195, 180, 60 * m, 0, BLUE, '', 3); TB('e⁻', 225, 205, BLUE_D, 15); ctx.globalAlpha = 1;
      }
      if (f > 0) { ctx.globalAlpha = f; [[75, 105], [150, 100], [112, 140], [70, 175], [155, 172]].forEach(function (q) { q_sign(q[0], q[1], 1, 24); }); TB('pull : +', 115, 40, DRED, 17); TB('ballon : −', 350, 40, BLUE_D, 17); TB('total = 0', 230, 275, DGREEN, 18); ctx.globalAlpha = 1; }
      else TB('le ballon gagne des e⁻', 230, 40, INK, 15);
    }),
    /* 1 Compter les électrons */
    q_fig(function (p) {
      rod(230, 90, 280, -1); TB('bâton de PVC', 230, 52, INK, 14);
      TB('N = 5·10¹⁰ électrons en plus', 230, 150, BLUE_D, 17);
      TB('|q| = N · e', 230, 182, INK, 17);
      TB('= 5·10¹⁰ × 1,6·10⁻¹⁹ C', 230, 210, INK, 17);
      if (p > 0) { ctx.globalAlpha = q_s(p, 0, .6); q_box(230, 250, 280, 36, DGREEN, '#e6f6ee', 'q = −8·10⁻⁹ C = −8 nC', 18); ctx.globalAlpha = 1; }
    }),
    /* 2 Boule repoussée / attirée */
    q_fig(function (p) {
      var g = q_s(p, 0, .5);
      LN(230, 20, 230, 262, '#ddd', 1.5, [4, 4]);
      var a = susp(125, 150, 34, GREY, ''); rod(45, a[1], 64, -1, 0);
      var b = susp(315, 150, 34, GREY, ''); rod(425, b[1], 64, -1, 0);
      TB('tige −', 45, a[1] - 22, BLUE_D, 13); TB('tige −', 425, b[1] - 22, BLUE_D, 13);
      TB('A', a[0], a[1] + 5, INK, 15); TB('B', b[0], b[1] + 5, INK, 15);
      TB('A repoussée', 125, 250, DRED, 15); TB('B attirée', 345, 250, DGREEN, 15);
      if (g > 0) { ctx.globalAlpha = g; TB('A : −', a[0] + 14, a[1] + 40, BLUE_D, 18); TB('B : + ou neutre', b[0] - 20, b[1] + 40, DGREEN, 16); ctx.globalAlpha = 1; }
    }),
    /* 3 Isolant ou conducteur */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      rod(110, 90, 150, -1, -.15); TB('règle (plastique)', 110, 52, INK, 14);
      for (var i = 0; i < 4; i++) { ctx.fillStyle = '#e7e0c8'; ctx.fillRect(70 + i * 28, 180 - (i % 2) * 14, 10, 7); }
      A(110, 175, 0, -34, GREEN, '', 2.4); TB('papiers attirés', 110, 215, DGREEN, 14);
      LN(230, 20, 230, 262, '#ddd', 1.5, [4, 4]);
      ctx.fillStyle = '#f3c9a0'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.roundRect(290, 82, 140, 18, 6); ctx.fill(); ctx.stroke(); TB('tige de cuivre', 365, 62, INK, 14);
      ctx.fillStyle = '#f4d9c0'; ctx.strokeStyle = ORANGE; ctx.beginPath(); ctx.roundRect(262, 70, 50, 42, 8); ctx.fill(); ctx.stroke(); TB('main', 287, 96, INK, 13);
      for (var j = 0; j < 4; j++) { ctx.fillStyle = '#e7e0c8'; ctx.fillRect(330 + j * 22, 180, 10, 7); }
      TB('aucune attraction', 365, 215, DRED, 14);
      if (g > 0) {
        ctx.globalAlpha = g; A(287, 118, 0, 70 * g, BLUE, '', 3); floor(262, 312, 196); TB('e⁻ vers la terre', 300, 150, BLUE_D, 13, 'left');
        TB('isolant : garde sa charge', 110, 255, DGREEN, 14); TB('conducteur : se décharge', 365, 255, DRED, 14); ctx.globalAlpha = 1;
      }
    }),
    /* 4 Partage de charge */
    q_fig(function (p) {
      var g = q_s(p, 0, .5), tr = q_s(p, .35, 1), x1 = 130 + 25 * tr, x2 = 330 - 25 * tr;
      chg(x1, 125, 38, -1);
      if (tr < .5) { DOT(x2, 125, 38, '#f3f6fa'); ctx.strokeStyle = GREY; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x2, 125, 38, 0, 7); ctx.stroke(); TB('0', x2, 132, GREY, 22); }
      else chg(x2, 125, 38, -1);
      TB('tige', x1, 66, INK, 14); TB('sphère neutre', x2, 66, INK, 14);
      if (tr < .5) { TB('−4,8 nC', x1, 195, BLUE_D, 18); TB('0', x2, 195, INK, 18); }
      else { TB('−2,4 nC', x1, 195, BLUE_D, 18); TB('−2,4 nC', x2, 195, BLUE_D, 18); }
      if (g < .01) TB('N = ?  puis chaque charge après contact ?', 230, 30, GREY, 15);
      else { ctx.globalAlpha = g; TB('N = 4,8·10⁻⁹ / 1,6·10⁻¹⁹ = 3·10¹⁰ électrons', 230, 30, DGREEN, 16); ctx.globalAlpha = 1; }
      if (tr > 0) { ctx.globalAlpha = tr; TB('contact puis séparation : moitié chacune', 230, 255, ORANGE, 15); ctx.globalAlpha = 1; }
    }),
    /* 5 Électroscope : pourquoi les feuilles s'écartent */
    q_fig(function (p) {
      var g = q_s(p, 0, .8), ang = .08 + .4 * g;
      rod(185, 75, 120, 1, .45); TB('tige +', 140, 118, DRED, 14);
      var e = q_electro(310, 262, ang); TB('chapeau', e.cx + 20, e.cy - 18, GREY, 13, 'left');
      if (g > 0) {
        ctx.globalAlpha = g; q_sign(e.cx - 22, e.cy + 2, -1); q_sign(e.cx + 22, e.cy + 2, -1);
        q_sign(e.l[0] - 3, e.l[1] + 8, 1, 20); q_sign(e.r[0] + 3, e.r[1] + 8, 1, 20);
        A(e.px + 16, e.py + 4, 0, -34 * g, BLUE, '', 2.6); TB('e⁻ attirés', e.cx + 28, e.cy + 60, BLUE_D, 13, 'left');
        TB('feuilles +, elles se repoussent', 230, 20, DGREEN, 15); ctx.globalAlpha = 1;
      } else TB('feuilles ?', 230, 20, GREY, 15);
    }),
    /* 6 Charger par influence */
    q_fig(function (p) {
      var a2 = .25 + .75 * q_s(p, .15, .45), a3 = .25 + .75 * q_s(p, .5, .85);
      var e1 = q_electro(80, 225, .32); TB('1  tige près', 80, 268, GREY, 13);
      rod(80, 38, 100, -1, 0); q_sign(e1.cx, e1.cy - 20, 1, 15); q_sign(e1.l[0] - 2, e1.l[1] + 8, -1, 16); q_sign(e1.r[0] + 2, e1.r[1] + 8, -1, 16);
      ctx.globalAlpha = a2; var e2 = q_electro(230, 225, .04); TB('2  doigt', 230, 268, GREY, 13);
      rod(230, 38, 100, -1, 0); q_sign(e2.cx, e2.cy - 20, 1, 15); A(e2.cx + 18, e2.cy + 2, 46, 0, BLUE, '', 2.4); TB('e⁻', e2.cx + 80, e2.cy + 6, BLUE_D, 14);
      ctx.globalAlpha = a3; var e3 = q_electro(380, 225, .42); TB('3  on éloigne la tige', 380, 268, GREY, 13);
      q_sign(e3.cx, e3.cy - 20, 1, 15); q_sign(e3.l[0] - 2, e3.l[1] + 8, 1, 16); q_sign(e3.r[0] + 2, e3.r[1] + 8, 1, 16);
      ctx.globalAlpha = 1;
      if (p > .8) TB('résultat : positif', 380, 20, DRED, 17);
    }),
    /* 7 Deux forces, deux charges */
    q_fig(function (p) {
      var g = q_s(p, 0, .6);
      chg(120, 130, 38, 1); chg(340, 130, 28, -1);
      TB('A  +4 nC', 120, 198, DRED, 16); TB('B  −1 nC', 340, 198, BLUE_D, 16);
      if (g > 0) {
        var L = 55 * g; A(162, 125, L, 0, GREEN, '', 4); A(310, 125, -L, 0, GREEN, '', 4);
        if (g > .8) { TB('F de B sur A', 190, 95, DGREEN, 13); TB('F de A sur B', 285, 95, DGREEN, 13); TB('même valeur, sens opposés : attraction', 230, 250, DGREEN, 15); }
      } else TB('F de A sur B ?   F de B sur A ?', 230, 250, GREY, 15);
    }),
    /* 8 Contacts successifs */
    q_fig(function (p) {
      var s1 = q_s(p, 0, .4), s2 = q_s(p, .5, .9);
      var qa = 9 - 6 * s1, qb = -3 + 6 * s1, qc = 0;
      if (s2 > 0) { qb = 3 - 1.5 * s2; qc = 1.5 * s2; }
      function f(v) { return (v > .01 ? '+' : v < -.01 ? '−' : '') + (Math.round(Math.abs(v) * 100) / 100).toString().replace('.', ',') + ' nC'; }
      function sp(x, v, lab) { DOT(x, 110, 38, '#fff'); ctx.strokeStyle = v > .01 ? RED : v < -.01 ? BLUE : GREY; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, 110, 38, 0, 7); ctx.stroke(); TB(lab, x, 117, INK, 22); TB(f(v), x, 178, v > .01 ? DRED : v < -.01 ? BLUE_D : INK, 17); }
      sp(80, qa, 'A'); sp(230, qb, 'B'); sp(380, qc, 'C');
      if (s1 > .05 && s2 < .05) TB('A + B : (9 − 3) / 2 = 3 nC chacune', 230, 235, ORANGE, 15);
      if (s2 > .05) TB('B + C : (3 + 0) / 2 = 1,5 nC chacune', 230, 235, ORANGE, 15);
      if (p > .92) TB('total : 3 + 1,5 + 1,5 = 6 nC = 9 − 3', 230, 268, DGREEN, 15);
      else TB('total au départ : 9 − 3 + 0 = 6 nC', 230, 268, GREY, 15);
    }),
    /* 9 Filet d'eau */
    q_fig(function (p) {
      var g = q_s(p, 0, .7), k = 22 + 30 * g;
      ctx.fillStyle = '#c9ccd0'; ctx.fillRect(70, 18, 60, 20); ctx.fillRect(86, 18, 28, 40); TB('robinet', 140, 32, GREY, 13, 'left');
      ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
      for (var y = 0; y <= 190; y += 10) { var x = 100 + (y * y / 36100) * k; y ? ctx.lineTo(x, 58 + y) : ctx.moveTo(x, 58); } ctx.stroke();
      rod(215, 150, 150, -1, 1.5708); TB('règle chargée', 240, 150, INK, 14, 'left');
      TB('(− en exemple)', 240, 172, GREY, 13, 'left');
      if (g > 0) {
        ctx.globalAlpha = g;
        for (var i = 0; i < 4; i++) { var yy = 100 + i * 36, xx = 100 + ((yy - 58) * (yy - 58) / 36100) * k; q_sign(xx - 14, yy + 2, -1, 15); q_sign(xx + 14, yy + 2, 1, 15); }
        A(135, 120, 44, 0, GREEN, '', 3); ctx.globalAlpha = 1;
      }
      TB(g > .6 ? 'le côté proche prend la charge contraire' : 'filet d\'eau neutre', 230, 268, g > .6 ? DGREEN : INK, 15);
    })
  ]);
})();
