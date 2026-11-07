/* Chimie 6e · chapitre 1 : alcools, aldéhydes, cétones, acides carboxyliques.
   Ce fichier définit aussi les aides de dessin « k6_ » partagées par les autres theo-NN.js du cours. */
function k6_rev(p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); }
function k6_mix(c1, c2, f) { var r = []; for (var i = 0; i < 3; i++) r.push(Math.round(c1[i] + (c2[i] - c1[i]) * f)); return 'rgb(' + r.join(',') + ')'; }
var K6_OR = [232, 146, 58], K6_GR = [46, 158, 91];
function k6_at(txt, x, y, col, sz) {
  sz = sz || 14; ctx.font = '600 ' + sz + 'px system-ui'; var w = ctx.measureText(txt).width + 4;
  ctx.fillStyle = '#fff'; ctx.fillRect(x - w / 2, y - sz * .62, w, sz * 1.24);
  ctx.fillStyle = col || INK; ctx.textAlign = 'center'; ctx.fillText(txt, x, y + sz * .36);
}
function k6_dbl(x1, y1, x2, y2, c, w) {
  var dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l * 2.6, ny = dx / l * 2.6;
  LN(x1 + nx, y1 + ny, x2 + nx, y2 + ny, c, w || 2.2); LN(x1 - nx, y1 - ny, x2 - nx, y2 - ny, c, w || 2.2);
}
/* squelette : chaîne en zigzag de n carbones, départ en bas à gauche ; fonction fn ('ol','al','one','ac') portée par le carbone pos */
function k6_m(x, y, s, n, fn, pos, col, cc) {
  var P = [], i; for (i = 0; i < n; i++) P.push({ x: x + i * .87 * s, y: y - (i % 2 ? .5 * s : 0) });
  ctx.strokeStyle = cc || INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath();
  for (i = 0; i < n; i++) i ? ctx.lineTo(P[i].x, P[i].y) : ctx.moveTo(P[i].x, P[i].y); ctx.stroke();
  if (!fn) return P;
  var b = P[pos], c = col || ORA2, L = .95 * s, low = (pos % 2 === 0), sg = low ? 1 : -1, term = (pos === 0 || pos === n - 1);
  var tv = pos === 0 ? [-.87, -.5] : [.87, low ? -.5 : .5], sz = Math.max(13, Math.min(17, s * .5));
  function g(v, dbl, lab) {
    var ex = b.x + v[0] * L, ey = b.y + v[1] * L;
    if (dbl) k6_dbl(b.x, b.y, ex, ey, c, 2.2); else LN(b.x, b.y, ex, ey, c, 2.4);
    k6_at(lab, ex, ey, c, sz);
  }
  if (fn === 'ol') g(term ? tv : [0, sg], 0, 'OH');
  if (fn === 'al') g(tv, 1, 'O');
  if (fn === 'one') g([0, sg], 1, 'O');
  if (fn === 'ac') { g(tv, 1, 'O'); g([0, sg], 0, 'OH'); }
  return P;
}
/* alcool tertiaire (CH3)3C-OH : croix centrée */
function k6_tert(cx, cy, s, col) {
  var c = col || ORA2;
  LN(cx, cy, cx, cy - s, c, 2.4); k6_at('OH', cx, cy - s, c, 15);
  LN(cx, cy, cx - s, cy, INK, 2.4); LN(cx, cy, cx + s, cy, INK, 2.4); LN(cx, cy, cx, cy + s, INK, 2.4);
}
function k6_tubeP(cx, top, w, h) { ctx.beginPath(); ctx.moveTo(cx - w / 2, top); ctx.lineTo(cx - w / 2, top + h - w / 2); ctx.arc(cx, top + h - w / 2, w / 2, PI, 0, true); ctx.lineTo(cx + w / 2, top); }
function k6_tube(cx, top, w, h, lev, col) {
  ctx.save(); k6_tubeP(cx, top, w, h); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(cx - w, top + h * (1 - lev), 2 * w, h); ctx.restore();
  k6_tubeP(cx, top, w, h); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
  LN(cx - w / 2 - 4, top, cx + w / 2 + 4, top, INK, 2.2);
}
function k6_flask(cx, by, w, h, lev, col) {
  var nw = w * .3, tp = by - h;
  function path() { ctx.beginPath(); ctx.moveTo(cx - nw / 2, tp); ctx.lineTo(cx - nw / 2, tp + h * .38); ctx.lineTo(cx - w / 2, by); ctx.lineTo(cx + w / 2, by); ctx.lineTo(cx + nw / 2, tp + h * .38); ctx.lineTo(cx + nw / 2, tp); }
  ctx.save(); path(); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(cx - w, by - h * lev, 2 * w, h); ctx.restore();
  path(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke(); LN(cx - nw / 2 - 3, tp, cx + nw / 2 + 3, tp, INK, 2.2);
}
function k6_beaker(cx, by, w, h, lev, col) {
  ctx.fillStyle = col; ctx.fillRect(cx - w / 2 + 1, by - h * lev, w - 2, h * lev - 1);
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(cx - w / 2 - 3, by - h); ctx.lineTo(cx - w / 2, by - h); ctx.lineTo(cx - w / 2, by); ctx.lineTo(cx + w / 2, by); ctx.lineTo(cx + w / 2, by - h); ctx.lineTo(cx + w / 2 + 3, by - h); ctx.stroke();
}
/* burette : surface du liquide à la fraction sf (0 = haut, 1 = bas) */
function k6_burette(cx, top, h, w, sf, col, ticks, lab) {
  var y0 = top, y1 = top + h;
  ctx.fillStyle = col; ctx.fillRect(cx - w / 2 + 1, y0 + h * sf, w - 2, h * (1 - sf));
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.strokeRect(cx - w / 2, y0, w, h);
  for (var k = 0; k <= (ticks || 5); k++) { var yy = y0 + h * k / (ticks || 5); LN(cx + w / 2, yy, cx + w / 2 + 6, yy, GREY, 1.3); if (lab) T(lab[k], cx + w / 2 + 9, yy + 4, GREY, 11, 'left'); }
  LN(cx, y1, cx, y1 + 12, INK, 2.2);
}
function k6_cap(txt, col, y) { TB(txt, W * .5, y || H - 12, col || GREY, 13); }
function k6_title(txt) { TB(txt, W * .5, 22, BLUE_D, 14); }
function k6_chip(txt, x, y, col, alpha) { if (alpha <= 0) return; ctx.globalAlpha = alpha; tag(txt, x, y, col, 14); ctx.globalAlpha = 1; }

SFA.theo("c01", {
  icon: function () {
    var s = 40, y = H * .5, xs = [W * .12 + 14, W * .44 + 14, W * .76 + 14];
    k6_m(xs[0], y, s, 2, 'ol', 0, ORA2); k6_m(xs[1], y, s, 2, 'al', 0, ORA2); k6_m(xs[2], y, s, 2, 'ac', 0, ORA2);
    A(W * .245, y + 4, W * .125, 0, BLUE, '', 3); A(W * .565, y + 4, W * .125, 0, BLUE, '', 3);
    TB('[O]', W * .31, y - 12, BLUE_D, 17); TB('[O]', W * .63, y - 12, BLUE_D, 17);
    TB('alcool', xs[0] + 17, y + 82, BLUE_D, 16); TB('aldéhyde', xs[1] + 17, y + 82, BLUE_D, 16); TB('acide', xs[2] + 17, y + 82, BLUE_D, 16);
    TB('–OH · –CHO · –CO– · –COOH', W * .5, H * .15, ORANGE, 18);
  },
  anim: function (t) {
    var ph = (t / 420) % 1, s = 46, y = H * .34, xs = [W * .1, W * .43, W * .76], col = [BLUE_D, BLUE_D, BLUE_D];
    var f1 = k6_rev(ph, .1, .4), f2 = k6_rev(ph, .5, .8), stage = ph < .45 ? 0 : (ph < .95 ? 1 : 0);
    var names = ['éthanol', 'éthanal', 'acide éthanoïque'], fns = ['ol', 'al', 'ac'], tx = ['CH₃–CH₂–OH', 'CH₃–CHO', 'CH₃–COOH'];
    for (var i = 0; i < 3; i++) {
      var on = (i === 0) || (i === 1 && ph > .25) || (i === 2 && ph > .65);
      ctx.globalAlpha = on ? 1 : .22; k6_m(xs[i] + 22, y, s, 2, fns[i], 0, i === 0 ? ORA2 : (i === 1 ? ORANGE : RED));
      TB(names[i], xs[i] + 40, y + 78, BLUE_D, 15); T(tx[i], xs[i] + 40, y + 98, INK, 14); ctx.globalAlpha = 1;
    }
    A(W * .295, y - 6, W * .09 * f1, 0, BLUE, '', 3); A(W * .625, y - 6, W * .09 * f2, 0, BLUE, '', 3);
    if (f1 > 0) TB('−2 H', W * .34, y - 24, DGREEN, 13); if (f2 > 0) TB('+ O', W * .67, y - 24, DGREEN, 13);
    var cc = k6_mix(K6_OR, K6_GR, Math.min(1, ph * 1.15));
    k6_beaker(W * .09, H * .97, 54, 52, .75, cc); TB('Cr₂O₇²⁻ (orange)', W * .15, H * .86, ORANGE, 13, 'left'); TB('→ Cr³⁺ (vert)', W * .15, H * .93, DGREEN, 13, 'left');
    TB('primaire : aldéhyde puis acide', W * .5, H * .8, ORANGE, 13, 'left'); TB('secondaire : cétone (stop)', W * .5, H * .87, ORANGE, 13, 'left'); TB('tertiaire : aucune réaction', W * .5, H * .94, DRED, 13, 'left');
  },
  th: '<div class="tcard"><b class="h">Les quatre groupes fonctionnels</b><p>Le groupe fonctionnel décide du nom et du comportement d\'une molécule. Chaîne carbonée la plus longue contenant la fonction, numérotée pour donner le plus petit indice à la fonction.</p><ul>' +
    '<li><b>Alcool</b> R–OH : suffixe <i>-ol</i> (éthanol, propan-2-ol). Le OH est lié à un carbone saturé.</li>' +
    '<li><b>Aldéhyde</b> R–CHO : suffixe <i>-al</i>, toujours en bout de chaîne (éthanal, propanal).</li>' +
    '<li><b>Cétone</b> R–CO–R\' : suffixe <i>-one</i>, le C=O est entre deux carbones (propanone, butan-2-one).</li>' +
    '<li><b>Acide carboxylique</b> R–COOH : « acide … -oïque », en bout de chaîne (acide éthanoïque).</li></ul>' +
    '<p>Classe d\'un alcool : on compte les carbones liés au C–OH. <b>1 : primaire, 2 : secondaire, 3 : tertiaire.</b></p></div>' +
    '<div class="tcard"><b class="h">Structure et propriétés physiques</b><p>La liaison O–H est polarisée : l\'H d\'une molécule est attiré par l\'O d\'une autre. Cette <b>liaison hydrogène</b> relie les molécules et élève la température d\'ébullition.</p>' +
    '<p>À masses voisines : propane (44 g/mol) bout à −42 °C, éthanal (44 g/mol, sans OH) à 20 °C, éthanol (46 g/mol) à 78 °C, acide éthanoïque (60 g/mol) à 118 °C. Les acides se lient même par deux (dimères).</p>' +
    '<p>Les petits alcools et acides sont miscibles à l\'eau (liaisons H avec l\'eau) ; la solubilité diminue quand la chaîne carbonée s\'allonge.</p></div>' +
    '<div class="tcard"><b class="h">Oxydation ménagée</b><p>On l\'obtient avec un oxydant doux : dichromate Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> acidifié (orange → vert de Cr<sup>3+</sup>) ou permanganate MnO<sub>4</sub><sup>−</sup> (violet → Mn<sup>2+</sup>), sans casser la chaîne.</p><ul>' +
    '<li>Alcool <b>primaire</b> → aldéhyde → acide carboxylique.</li><li>Alcool <b>secondaire</b> → cétone (pas plus loin).</li><li>Alcool <b>tertiaire</b> : aucune oxydation ménagée (le C–OH n\'a pas d\'H).</li></ul>' +
    '<p><b>Tests :</b> DNPH (précipité jaune-orange) pour aldéhyde et cétone ; liqueur de Fehling (précipité rouge brique) et réactif de Tollens (miroir d\'argent) pour l\'aldéhyde seul ; papier pH ou BBT pour l\'acide.</p></div>' +
    '<div class="tcard"><b class="h">Méthode et exemple chiffré</b><p>3 CH<sub>3</sub>CH<sub>2</sub>OH + 2 Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup> + 16 H<sup>+</sup> → 3 CH<sub>3</sub>COOH + 4 Cr<sup>3+</sup> + 11 H<sub>2</sub>O</p>' +
    '<p>4,6 g d\'éthanol (M = 46 g/mol) : n = 4,6/46 = 0,10 mol. Rapport 2/3 : n(Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup>) = 0,10 × 2/3 = 0,067 mol.</p>' +
    '<p><b>Pièges :</b> un aldéhyde s\'oxyde facilement en acide si on le laisse dans l\'oxydant (on le distille au fur et à mesure) ; ne pas confondre aldéhyde (H sur le C=O) et cétone ; oxydation ménagée ≠ combustion (qui donne CO<sub>2</sub> et H<sub>2</sub>O).</p></div>'
});

SFA.figs("c01", [
  /* 1 reconnaître la fonction */
  function (p) {
    var s = 30, cells = [[W * .25, H * .3, 'a)', 2, 'ol', 0, 'alcool'], [W * .75, H * .3, 'b)', 3, 'one', 1, 'cétone'], [W * .25, H * .72, 'c)', 3, 'al', 0, 'aldéhyde'], [W * .75, H * .72, 'd)', 2, 'ac', 0, 'acide carboxylique']];
    cells.forEach(function (c) {
      TB(c[2], c[0] - 85, c[1] - 14, GREY, 14);
      k6_m(c[0] - (c[3] - 1) * .87 * s / 2 + 4, c[1] + 6, s, c[3], c[4], c[5], ORA2);
      k6_chip(c[6], c[0], c[1] + 52, DGREEN, p);
    });
  },
  /* 2 le groupe carboxyle */
  function (p) {
    var cx = W * .5, cy = H * .5, L = 62;
    LN(cx, cy, cx - L, cy + 36, INK, 3); TB('R', cx - L - 8, cy + 46, INK, 22);
    k6_dbl(cx, cy, cx, cy - L, ORA2, 3); k6_at('O', cx, cy - L, ORA2, 22);
    LN(cx, cy, cx + L * .9, cy + 40, ORA2, 3); k6_at('OH', cx + L * .9, cy + 40, ORA2, 22);
    DOT(cx, cy, 5, INK, true);
    TB('Quel groupe ?', W * .5, 24, BLUE_D, 15);
    if (p > 0) {
      ctx.globalAlpha = p; ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.ellipse(cx + 18, cy - 14, 76, 74, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      tag('C=O + O–H sur le même C', cx, H - 44, DGREEN, 14); tag('–COOH : carboxyle', cx, H - 18, DGREEN, 15); ctx.globalAlpha = 1;
    } else { TB('R–C(=O)–OH', cx, H - 22, GREY, 15); }
  },
  /* 3 nommer et classer des alcools */
  function (p) {
    var s = 28, xs = [W * .17, W * .5, W * .83], names = ['butan-2-ol', '2-méthylpropan-2-ol', 'butan-1-ol'], cls = ['secondaire', 'tertiaire', 'primaire'], nb = [2, 3, 1];
    TB('a)', xs[0] - 66, 40, GREY, 14); TB('b)', xs[1] - 55, 40, GREY, 14); TB('c)', xs[2] - 66, 40, GREY, 14);
    var A1 = k6_m(xs[0] - 42, H * .52, s, 4, 'ol', 1, ORA2), cc = [A1[1], { x: xs[1], y: H * .46 }, null];
    k6_tert(xs[1], H * .46, 40, ORA2);
    var C1 = k6_m(xs[2] - 42, H * .52, s, 4, 'ol', 0, ORA2);
    var nei = [[A1[0], A1[2]], [{ x: xs[1] - 40, y: H * .46 }, { x: xs[1] + 40, y: H * .46 }, { x: xs[1], y: H * .46 + 40 }], [C1[1]]];
    var main = [A1[1], { x: xs[1], y: H * .46 }, C1[0]];
    if (p > 0) {
      ctx.globalAlpha = p;
      for (var k = 0; k < 3; k++) { ctx.strokeStyle = RED; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(main[k].x, main[k].y, 11, 0, 7); ctx.stroke(); nei[k].forEach(function (q) { DOT(q.x, q.y, 6, BLUE, true); }); }
      for (var j = 0; j < 3; j++) { TB(nb[j] + ' C voisin' + (nb[j] > 1 ? 's' : ''), xs[j], H * .76, BLUE_D, 14); TB(cls[j], xs[j], H * .87, DGREEN, 15); }
      ctx.globalAlpha = 1;
    } else { for (var j2 = 0; j2 < 3; j2++) TB(names[j2], xs[j2], H * .84, GREY, 13); }
    k6_title('Nomme et classe');
  },
  /* 4 formules et masses molaires */
  function (p) {
    var s = 32; var xs = [W * .27, W * .73];
    k6_m(xs[0] - 49, H * .46, s, 4, 'ac', 0, ORA2); k6_m(xs[1] - 49, H * .46, s, 4, 'al', 0, ORA2);
    TB('acide butanoïque', xs[0], H * .66, BLUE_D, 14); TB('butanal', xs[1], H * .66, BLUE_D, 14);
    TB('C₄H₈O₂', xs[0], H * .8, ORANGE, 20); TB('C₄H₈O', xs[1], H * .8, ORANGE, 20);
    if (p > 0) {
      ctx.globalAlpha = p; TB('88 g/mol', xs[0], H * .93, DGREEN, 17); TB('72 g/mol', xs[1], H * .93, DGREEN, 17);
      TB('Δ = 16 g/mol (un O)', W * .5, H * .17, RED, 15); ctx.globalAlpha = 1;
    } else TB('M = ?', W * .5, H * .93, GREY, 15);
  },
  /* 5 liaison hydrogène et températures d'ébullition */
  function (p) {
    function eth(x, yy) {
      LN(x, yy + 14, x + 22, yy, INK, 2.4); LN(x + 22, yy, x + 44, yy + 14, INK, 2.4); LN(x + 44, yy + 14, x + 60, yy + 3, INK, 2.4);
      DOT(x + 44, yy + 14, 12, '#fde0e0', true); TB('O', x + 44, yy + 19, DRED, 14); DOT(x + 60, yy + 3, 8, '#cfe3f8', true); TB('H', x + 60, yy + 7, BLUE_D, 11);
    }
    TB('éthanol : liaisons H', W * .25, 26, BLUE_D, 14);
    eth(14, 70); eth(122, 138);
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.6; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(74, 74); ctx.lineTo(166, 152); ctx.stroke(); ctx.setLineDash([]);
    tag('liaison H', 102, 118, BLUE_D, 14); TB('δ+', 82, 62, BLUE_D, 13); TB('δ−', 174, 134, DRED, 13);
    TB('Téb (°C)', W * .73, 26, BLUE_D, 14);
    var gb = H * .6, sc = H * .36 / 78;
    LN(W * .58, gb, W * .96, gb, AX, 1.5);
    TB('propane', W * .68, H - 12, INK, 13); TB('éthanol', W * .86, H - 12, INK, 13);
    var bs = [[W * .68, -42, BLUE], [W * .86, 78, RED]];
    bs.forEach(function (b) {
      var h = b[1] * sc * p; ctx.fillStyle = b[2]; ctx.globalAlpha = .85;
      if (b[1] > 0) ctx.fillRect(b[0] - 18, gb - h, 36, h); else ctx.fillRect(b[0] - 18, gb, 36, -h); ctx.globalAlpha = 1;
    });
    if (p > .6) { TB('−42', W * .68, gb + 42 * sc + 18, DRED, 15); TB('+78', W * .86, gb - 78 * sc - 8, DRED, 15); }
    else TB('M ≈ 44-46 g/mol', W * .73, H * .2, GREY, 13);
  },
  /* 6 quel alcool résiste */
  function (p) {
    var xs = [W * .13, W * .38, W * .63, W * .88], nm = [['éthanol'], ['propan-2-ol'], ['2-méthyl-', 'propan-2-ol'], ['propan-1-ol']], cl = ['primaire', 'secondaire', 'tertiaire', 'primaire'], f = p;
    for (var i = 0; i < 4; i++) {
      var react = i !== 2, col = react ? k6_mix(K6_OR, K6_GR, f) : k6_mix(K6_OR, K6_OR, 0);
      k6_tube(xs[i], 52, 40, 130, .7, col);
      nm[i].forEach(function (l, k) { TB(l, xs[i], 206 + k * 16, INK, 13); });
      TB(cl[i], xs[i], 252, GREY, 13);
    }
    k6_title('Dichromate acidifié (orange)');
    if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); tag('aucune réaction', xs[2], 112, DRED, 14); ctx.globalAlpha = 1; }
  },
  /* 7 éthylotest */
  function (p) {
    function tube(y, frac, lab) {
      var x0 = W * .1, x1 = W * .9;
      ctx.fillStyle = k6_mix(K6_OR, K6_OR, 0); ctx.beginPath(); ctx.roundRect(x0, y, x1 - x0, 34, 17); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y, x1 - x0, 34, 17); ctx.clip(); ctx.fillStyle = 'rgb(46,158,91)'; ctx.fillRect(x0, y, (x1 - x0) * frac, 34); ctx.restore();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(x0, y, x1 - x0, 34, 17); ctx.stroke();
      TB(lab, W * .5, y - 8, BLUE_D, 14);
    }
    tube(70, .4 * p, 'limite légale : 0,22 mg/L'); tube(150, p, 'c = ? : tout le tube vire');
    TB('Cr₂O₇²⁻ orange → Cr³⁺ vert', W * .5, 28, DGREEN, 14);
    if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB('≈ 40 %', W * .1 + (W * .8) * .2, 129, '#fff', 14); TB('0,55 mg/L', W * .5, 208, DRED, 18); TB('2,5 × la limite', W * .5, 232, DRED, 14); ctx.globalAlpha = 1; }
    else { TB('0,0080 mmol de dichromate dans le tube', W * .5, 232, GREY, 13); }
  },
  /* 8 de l'alcool au dichromate */
  function (p) {
    k6_burette(W * .2, 40, 190, 26, .0 + p * (222 / 250), k6_mix(K6_OR, K6_OR, 0), 5, ['0', '50', '100', '150', '200', '250']);
    TB('Cr₂O₇²⁻ 0,100 mol/L', W * .2 + 4, 262, BLUE_D, 13, 'center');
    k6_flask(W * .52, 208, 96, 110, .45, k6_mix([240, 240, 240], K6_GR, p)); TB('2,0 g de propan-1-ol', W * .52, 238, INK, 13);
    TB('M = 60 g/mol', W * .52, 258, GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('n = 0,0333 mol', W * .86, 70, BLUE_D, 15); TB('× 2/3', W * .86, 100, GREY, 15); TB('0,0222 mol', W * .86, 130, BLUE_D, 15); TB('V = 222 mL', W * .86, 175, DGREEN, 20); ctx.globalAlpha = 1; }
  },
  /* 9 identifier A, B, C */
  function (p) {
    var xs = [W * .17, W * .5, W * .83], s = 30, fm = ['C₃H₈O', 'C₃H₆O', 'C₃H₆O₂'], nm = ['propan-1-ol', 'propanal', 'acide propanoïque'], fn = ['ol', 'al', 'ac'], L = ['A', 'B', 'C'];
    for (var i = 0; i < 3; i++) {
      ctx.strokeStyle = AX; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(xs[i] - 66, 48, 132, 160, 10); ctx.stroke();
      TB(L[i], xs[i], 74, BLUE_D, 22); TB(fm[i], xs[i], 100, ORANGE, 17);
      ctx.globalAlpha = 1 - p; TB('?', xs[i], 150, GREY, 40); ctx.globalAlpha = p;
      k6_m(xs[i] - 26, 134, s, 3, fn[i], 0, ORA2); TB(nm[i], xs[i], 200, DGREEN, 13); ctx.globalAlpha = 1;
    }
    A(xs[0] + 70, 123, 56, 0, BLUE, '', 2.6); A(xs[1] + 70, 123, 56, 0, BLUE, '', 2.6);
    TB('défaut', (xs[0] + xs[1]) / 2 + 4, 100, BLUE_D, 13); TB('excès', (xs[1] + xs[2]) / 2 + 4, 100, BLUE_D, 13);
    TB('Fehling +', xs[1], 226, DRED, 14); TB('acide', xs[2], 226, DRED, 14); TB('Cr₂O₇²⁻ acidifié', xs[0], 226, GREY, 13);
    k6_cap('Alcool primaire : seul à donner aldéhyde puis acide', GREY, 262);
  },
  /* 10 quatre alcools C4H10O */
  function (p) {
    var s = 24, cx = [W * .25, W * .75], cy = [H * .3, H * .74];
    var nm = ['butan-1-ol', 'butan-2-ol', '2-méthylpropan-1-ol', '2-méthylpropan-2-ol'], ok = [1, 1, 1, 0];
    k6_m(cx[0] - 36, cy[0] + 12, s, 4, 'ol', 0, ORA2);
    k6_m(cx[1] - 36, cy[0] + 12, s, 4, 'ol', 1, ORA2);
    var P = k6_m(cx[0] - 24, cy[1] + 12, s, 3, 'ol', 0, ORA2); LN(P[1].x, P[1].y, P[1].x, P[1].y - 26, INK, 2.4);
    k6_tert(cx[1], cy[1] - 4, 26, ORA2);
    for (var i = 0; i < 4; i++) {
      var x = cx[i % 2], y = cy[Math.floor(i / 2)];
      TB(nm[i], x, y + 42, INK, 13);
      if (p > 0) { ctx.globalAlpha = p; var gx = x + 78, gy = y - 14; if (ok[i]) { DOT(gx, gy, 12, GREEN, true); LN(gx - 6, gy, gx - 1, gy + 5, '#fff', 3); LN(gx - 1, gy + 5, gx + 7, gy - 5, '#fff', 3); } else { DOT(gx, gy, 12, RED, true); LN(gx - 5, gy - 5, gx + 5, gy + 5, '#fff', 3); LN(gx + 5, gy - 5, gx - 5, gy + 5, '#fff', 3); } ctx.globalAlpha = 1; }
    }
  }
]);
