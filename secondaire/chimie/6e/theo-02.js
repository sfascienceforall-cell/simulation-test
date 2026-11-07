/* Chimie 6e · chapitre 2 : estérification, hydrolyse, saponification (utilise les aides k6_ de theo-01.js). */
function k2_f(v, d) { return v.toFixed(d == null ? 2 : d).replace('.', ','); }
/* ester : nA carbones côté acide (le dernier porte C=O), O d'ester, nB carbones côté alcool ; acide en ca, alcool en cb */
function k2_est(x, y, s, nA, nB, ca, cb) {
  var n = nA + 1 + nB, P = [], i;
  for (i = 0; i < n; i++) P.push({ x: x + i * .87 * s, y: y - (i % 2 ? .5 * s : 0) });
  for (i = 0; i < n - 1; i++) LN(P[i].x, P[i].y, P[i + 1].x, P[i + 1].y, i < nA ? ca : cb, 2.6);
  var c = P[nA - 1], up = ((nA - 1) % 2 === 1) ? -1 : 1;
  k6_dbl(c.x, c.y, c.x, c.y + up * .9 * s, ca, 2.2); k6_at('O', c.x, c.y + up * .9 * s, ca, 15);
  k6_at('O', P[nA].x, P[nA].y, INK, 15);
  return P;
}
/* barres : groupes {n, v0, v1, c} ; la barre passe de v0 à v1 avec p (contour pointillé = valeur initiale) */
function k2_bars(x0, yb, w, h, G, vmax, p, unit) {
  var bw = Math.min(54, w / G.length * .55), st = w / G.length;
  LN(x0, yb, x0 + w, yb, AX, 1.5);
  G.forEach(function (g, i) {
    var cx = x0 + st * (i + .5), v = g.v0 + (g.v1 - g.v0) * p, hh = v / vmax * h, h0 = g.v0 / vmax * h;
    if (g.v0 > 0) { ctx.strokeStyle = GREY; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.strokeRect(cx - bw / 2, yb - h0, bw, h0); ctx.setLineDash([]); }
    ctx.fillStyle = g.c; ctx.globalAlpha = .85; ctx.fillRect(cx - bw / 2, yb - hh, bw, hh); ctx.globalAlpha = 1;
    TB(g.n, cx, yb + 18, INK, 13);
    if (p > .55) { ctx.globalAlpha = k6_rev(p, .55, 1); TB(k2_f(g.v1, 2) + (unit || ''), cx, yb - Math.max(hh, h0) - 8, DGREEN, 14); ctx.globalAlpha = 1; }
    else if (g.v0 > 0) TB(k2_f(g.v0, 2), cx, yb - h0 - 8, GREY, 13);
  });
}

SFA.theo("c02", {
  icon: function () {
    var s = 30, y = H * .36;
    k6_m(44, y + 10, s, 2, 'ac', 0, ORA2, ORA2); TB('+', 122, y, INK, 24);
    k6_m(176, y + 10, s, 2, 'ol', 0, BLUE, BLUE); TB('⇌', 262, y, BLUE_D, 30);
    k2_est(296, y + 10, s, 2, 2, ORA2, BLUE); TB('ester + eau', 360, y + 72, BLUE_D, 16);
    TB('R–COOH + R′–OH ⇌ R–COO–R′ + H₂O', W * .5, H * .88, ORANGE, 17);
  },
  anim: function (t) {
    var u = (t % 720) / 720, tau = Math.min(1, u * 1.35);
    var gx = W * .08, gb = H * .82, gw = W * .5, gh = H * .66;
    LN(gx, gb, gx + gw, gb, AX, 1.5); LN(gx, gb, gx, gb - gh - 6, AX, 1.5);
    TB('t', gx + gw + 4, gb + 4, GREY, 13, 'left'); TB('n(ester) (mol)', gx, gb - gh - 12, GREY, 13, 'left');
    var ymax = 1, Y = function (v) { return gb - v / ymax * gh; };
    [[.667, BLUE, 'équimolaire : 0,67 mol'], [.903, GREEN, 'alcool ×3 : 0,90 mol']].forEach(function (c, i) {
      LN(gx, Y(c[0]), gx + gw, Y(c[0]), c[1], 1.2, [5, 4]); TB(c[2], gx + gw - 4, Y(c[0]) - 6, c[1] === GREEN ? DGREEN : BLUE_D, 13, 'right');
      ctx.strokeStyle = c[1]; ctx.lineWidth = 2.8; ctx.beginPath();
      for (var k = 0; k <= 60; k++) { var q = k / 60 * tau, v = c[0] * (1 - Math.exp(-4 * q)); k ? ctx.lineTo(gx + gw * q, Y(v)) : ctx.moveTo(gx, Y(v)); }
      ctx.stroke(); var vv = c[0] * (1 - Math.exp(-4 * tau)); DOT(gx + gw * tau, Y(vv), 5, c[1], true);
    });
    TB('on approche un équilibre, jamais 100 %', gx + gw / 2, gb + 20, GREY, 13);
    var x = c0(), bx = W * .66, bw = W * .3;
    function c0() { return .667 * (1 - Math.exp(-4 * tau)); }
    TB('Mélange équimolaire (1 mol + 1 mol)', bx + bw / 2, 22, BLUE_D, 13);
    k2_bars(bx, H * .82, bw, H * .5, [{ n: 'acide', v0: 1, v1: 1 - x, c: ORA2 }, { n: 'alcool', v0: 1, v1: 1 - x, c: BLUE }, { n: 'ester', v0: 0, v1: x, c: GREEN }, { n: 'eau', v0: 0, v1: x, c: '#9aa0a6' }], 1, 1);
    TB('catalyseur : plus vite, même équilibre', W * .5, H - 4, ORANGE, 13);
  },
  th: '<div class="tcard"><b class="h">Estérification : acide + alcool ⇌ ester + eau</b><p>R–COOH + R′–OH ⇌ R–COO–R′ + H<sub>2</sub>O. Le –OH de l\'acide et l\'H de l\'alcool partent sous forme d\'eau. Le <b>nom</b> d\'un ester se lit en deux temps : l\'acide donne « …oate », l\'alcool donne « de … yle » (éthanoate d\'éthyle, propanoate de méthyle).</p>' +
    '<p>La réaction est <b>lente</b> (on chauffe à reflux, on ajoute un catalyseur acide H<sub>2</sub>SO<sub>4</sub>) et <b>limitée</b> : double flèche ⇌. Le catalyseur accélère mais ne change pas l\'état d\'équilibre.</p></div>' +
    '<div class="tcard"><b class="h">Équilibre, rendement, hydrolyse</b><p>L\'hydrolyse est la réaction inverse : ester + eau ⇌ acide + alcool. Pour un alcool primaire, K = 4 (estérification) et K′ = 1/4 (hydrolyse). Quotient : K = [ester][eau] / ([acide][alcool]).</p>' +
    '<p><b>Rendement</b> = n(obtenue) / n(maximale, avec le réactif limitant). Mélange équimolaire : x²/(1 − x)² = 4, donc x/(1 − x) = 2 et x = 2/3 : rendement ≈ 67 %.</p>' +
    '<p>Pour <b>déplacer l\'équilibre</b> vers l\'ester : excès d\'un réactif (1 mol d\'acide + 3 mol d\'alcool : ≈ 90 %), ou élimination d\'un produit (eau piégée, ester distillé). Ajouter de l\'eau fait l\'inverse.</p></div>' +
    '<div class="tcard"><b class="h">Saponification : totale</b><p>Ester + OH<sup>−</sup> → carboxylate + alcool. L\'ion carboxylate R–COO<sup>−</sup> ne réagit plus avec l\'alcool : la transformation est <b>totale</b> (pas de double flèche).</p>' +
    '<p>Un triglycéride (huile ou graisse) + 3 NaOH → 3 savon (R–COO<sup>−</sup> Na<sup>+</sup>) + glycérol (propane-1,2,3-triol). Le savon a une tête hydrophile (COO<sup>−</sup>) et une queue hydrophobe : il forme des micelles autour des graisses.</p></div>' +
    '<div class="tcard"><b class="h">Méthode et exemple chiffré</b><p>1) Écris l\'équation et le tableau d\'avancement. 2) Réactif limitant : compare n/coefficient. 3) Rendement ou équilibre selon la réaction.</p>' +
    '<p>0,50 mol d\'acide + 0,50 mol d\'alcool : maximum 0,50 mol d\'ester ; à l\'équilibre 0,33 mol ; rendement 0,33/0,50 = 66 %.</p>' +
    '<p><b>Pièges :</b> oublier l\'eau formée dans K ; confondre limité (équilibre) et lent (vitesse) ; croire que le catalyseur améliore le rendement ; écrire une simple flèche pour l\'estérification.</p></div>'
});

SFA.figs("c02", [
  /* 1 écrire une estérification */
  function (p) {
    var s = 30;
    k6_m(40, 78, s, 2, 'ac', 0, ORA2, ORA2); TB('acide éthanoïque', 70, 124, ORA2, 13); TB('+', 150, 70, INK, 26);
    k6_m(200, 78, s, 2, 'ol', 0, BLUE, BLUE); TB('éthanol', 232, 124, BLUE_D, 13);
    TB('⇌', 330, 70, GREY, 34);
    if (p > 0) {
      ctx.globalAlpha = p; k2_est(30, 206, 30, 2, 2, ORA2, BLUE); TB('éthanoate d\'éthyle', 96, 258, DGREEN, 14);
      TB('+', 190, 214, INK, 24); TB('H₂O', 232, 218, DGREEN, 20);
      tag('88 g/mol', 350, 200, DGREEN, 16); TB('60 + 46 − 18 = 88', 350, 232, GREY, 13); ctx.globalAlpha = 1;
    } else { TB('ester ?', 100, 215, GREY, 24); TB('+', 190, 214, GREY, 24); TB('?', 240, 218, GREY, 28); TB('nom ? M = ?', 350, 215, GREY, 15); }
  },
  /* 2 l'autre produit */
  function (p) {
    T('R–COOH + R′–OH', 120, 90, INK, 17); TB('⇌', 244, 92, GREY, 30); T('R–COO–R′ +', 340, 90, INK, 17);
    TB('ester', 340, 118, BLUE_D, 13);
    if (p > 0) {
      ctx.globalAlpha = p; ctx.fillStyle = '#e6f1fb'; ctx.beginPath(); ctx.moveTo(W * .5, 150); ctx.bezierCurveTo(W * .5 - 20, 190, W * .5 - 34, 206, W * .5, 226); ctx.bezierCurveTo(W * .5 + 34, 206, W * .5 + 20, 190, W * .5, 150); ctx.fill();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.stroke();
      TB('H₂O', W * .5, 206, BLUE_D, 18); TB('–OH de l\'acide + H de l\'alcool', W * .5, 256, DGREEN, 14); ctx.globalAlpha = 1;
      A(W * .5, 142, 0, -30, BLUE, '', 2.2);
    } else { TB('?', W * .5, 205, GREY, 60); }
  },
  /* 3 rendement */
  function (p) {
    var x0 = 40, w = 380, y = 110, mx = 0.5, f = 0.33 / mx;
    TB('n(ester) en mol', W * .5, 30, BLUE_D, 14);
    ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.strokeRect(x0, y, w, 46); ctx.setLineDash([]);
    ctx.fillStyle = BLUE; ctx.globalAlpha = .85; ctx.fillRect(x0, y, w * f * p, 46); ctx.globalAlpha = 1;
    TB('0', x0, y + 70, GREY, 13); TB('0,50 mol (maximum)', x0 + w, y + 70, GREY, 13, 'right');
    var xe = x0 + w * 2 / 3; LN(xe, y - 12, xe, y + 58, RED, 2, [4, 3]); TB('équilibre ≈ 67 %', xe, y - 18, DRED, 13);
    if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB('0,33 mol obtenus', x0 + w * f / 2, y + 30, '#fff', 15); TB('rendement = 0,33 / 0,50 = 66 %', W * .5, 220, DGREEN, 17); ctx.globalAlpha = 1; }
    else TB('0,50 mol d\'acide + 0,50 mol d\'alcool', W * .5, 220, GREY, 14);
  },
  /* 4 nommer et hydrolyser */
  function (p) {
    var s = 32, P = k2_est(40, 110, s, 3, 1, ORA2, BLUE);
    TB('CH₃CH₂COOCH₃', W * .5, 22, INK, 15);
    if (p > 0) {
      ctx.globalAlpha = p; var mx = (P[2].x + P[3].x) / 2, my = (P[2].y + P[3].y) / 2;
      LN(mx - 8, my - 22, mx + 8, my + 22, RED, 3, [4, 3]);
      A(mx, 134, 0, 40, GREY, '', 2.4); TB('+ H₂O', mx + 40, 160, DGREEN, 14);
      k6_m(100, 225, 28, 3, 'ac', 0, ORA2, ORA2); TB('acide propanoïque', 130, 272, ORA2, 13); TB('+', 262, 215, INK, 24);
      TB('CH₃–OH', 340, 222, BLUE, 24); TB('méthanol', 340, 272, BLUE_D, 13);
      tag('propanoate de méthyle', W * .5, 52, DGREEN, 14); ctx.globalAlpha = 1;
    } else { TB('nom ? produits de l\'hydrolyse ?', W * .5, 220, GREY, 15); }
  },
  /* 5 améliorer le rendement */
  function (p) {
    var G = [['+ catalyseur', .667, GREY], ['excès d\'alcool', .903, GREEN], ['+ eau', .543, RED], ['attendre', .667, GREY]];
    TB('Rendement à l\'équilibre (1 mol + 1 mol de départ)', W * .5, 24, BLUE_D, 14);
    var x0 = 30, w = 400, yb = 214, h = 150, st = w / 4;
    LN(x0, yb, x0 + w, yb, AX, 1.5);
    G.forEach(function (g, i) {
      var cx = x0 + st * (i + .5), hh = g[1] * h * p; ctx.fillStyle = g[2]; ctx.globalAlpha = .85; ctx.fillRect(cx - 30, yb - hh, 60, hh); ctx.globalAlpha = 1;
      TB(g[0], cx, yb + 20, INK, 13);
      if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); TB(Math.round(g[1] * 100) + ' %', cx, yb - hh - 8, g[2] === GREEN ? DGREEN : INK, 15); ctx.globalAlpha = 1; }
    });
    var y67 = yb - .667 * h; LN(x0, y67, x0 + w, y67, RED, 1.2, [4, 4]);
    if (p > .6) TB('trait rouge : référence 67 %', W * .5, 258, DRED, 13); else TB('quelle modification ?', W * .5, 258, GREY, 14);
  },
  /* 6 saponification vs hydrolyse */
  function (p) {
    TB('Hydrolyse acide', 24, 44, ORANGE, 15, 'left');
    T('R–COO–R′ + H₂O', 95, 80, INK, 15); TB('⇌', 205, 86, ORANGE, 30); T('R–COOH + R′–OH', 320, 80, INK, 15);
    LN(24, 108, W - 24, 108, AX, 1);
    TB('Saponification', 24, 144, DGREEN, 15, 'left');
    T('R–COO–R′ + OH⁻', 95, 180, INK, 15); TB('→', 205, 186, DGREEN, 30); T('R–COO⁻', 268, 180, INK, 15); T('+ R′–OH', 372, 180, INK, 15);
    if (p > 0) {
      ctx.globalAlpha = p; ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(226, 160, 84, 32, 8); ctx.stroke();
      tag('ion carboxylate', 268, 214, DGREEN, 14);
      A(196, 206, -30, 0, RED, '', 2.4); TB('×', 176, 211, RED, 18);
      TB('retour impossible : transformation totale', W * .5, 254, DGREEN, 14); ctx.globalAlpha = 1;
    } else TB('limitée ou totale ?', W * .5, 254, GREY, 15);
  },
  /* 7 équilibre à résoudre */
  function (p) {
    TB('K = 4 : 1,0 mol d\'acide + 3,0 mol d\'alcool', W * .5, 24, BLUE_D, 14);
    k2_bars(40, 220, 380, 150, [{ n: 'acide', v0: 1, v1: .097, c: ORA2 }, { n: 'alcool', v0: 3, v1: 2.097, c: BLUE }, { n: 'ester', v0: 0, v1: .903, c: GREEN }, { n: 'eau', v0: 0, v1: .903, c: '#9aa0a6' }], 3.1, p, '');
    if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); TB('rendement ≈ 90 %', W * .5, 264, DGREEN, 16); ctx.globalAlpha = 1; } else TB('3x² − 16x + 12 = 0', W * .5, 264, GREY, 14);
  },
  /* 8 saponification : réactif limitant */
  function (p) {
    var x0 = 60, yb = 210, h = 140, sc = h / 2.1;
    TB('quantités de matière (mol)', W * .5, 22, BLUE_D, 14);
    LN(40, yb, 300, yb, AX, 1.5);
    ctx.fillStyle = BLUE; ctx.globalAlpha = .85; ctx.fillRect(x0, yb - .5 * sc, 60, .5 * sc); ctx.globalAlpha = 1; TB('huile', x0 + 30, yb + 18, INK, 13); TB('0,50', x0 + 30, yb - .5 * sc - 8, INK, 14);
    var bx = 170; ctx.fillStyle = ORA2; ctx.globalAlpha = .85; ctx.fillRect(bx, yb - 1.5 * sc * p, 60, 1.5 * sc * p); ctx.globalAlpha = 1;
    ctx.fillStyle = '#e3e6ea'; ctx.fillRect(bx, yb - 1.5 * sc * p - .5 * sc * p, 60, .5 * sc * p);
    ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.strokeRect(bx, yb - 2 * sc, 60, 2 * sc);
    TB('NaOH', bx + 30, yb + 18, INK, 13); TB('2,00', bx + 30, yb - 2 * sc - 8, INK, 14);
    if (p > .3) { ctx.globalAlpha = k6_rev(p, .3, 1); TB('utilisé 1,50', bx + 66, yb - .75 * sc + 4, DRED, 13, 'left'); TB('reste 0,50', bx + 66, yb - 1.75 * sc + 4, GREY, 13, 'left'); tag('limitant', x0 + 30, yb - .5 * sc - 32, DRED, 14);
      TB('savon : 456 g', 390, 60, DGREEN, 15); TB('glycérol : 46 g', 390, 86, DGREEN, 15); TB('NaOH en excès : 20 g', 390, 112, GREY, 13); ctx.globalAlpha = 1; }
    else TB('lequel manque ?', 390, 120, GREY, 15);
    TB('1 huile + 3 NaOH', W * .5, 258, GREY, 14);
  },
  /* 9 préparer un arôme */
  function (p) {
    TB('Pour obtenir 17,6 g d\'éthanoate d\'éthyle', W * .5, 24, BLUE_D, 14);
    var yb = 232, sc = 150 / 45, xs = [110, 300];
    LN(40, yb, 420, yb, AX, 1.5);
    [[18.0, 13.8, 'quantités égales'], [13.3, 30.6, 'alcool ×3']].forEach(function (c, i) {
      var h1 = c[0] * sc * p, h2 = c[1] * sc * p, x = xs[i];
      ctx.fillStyle = ORA2; ctx.globalAlpha = .85; ctx.fillRect(x - 36, yb - h1, 72, h1); ctx.fillStyle = BLUE; ctx.fillRect(x - 36, yb - h1 - h2, 72, h2); ctx.globalAlpha = 1;
      TB(c[2], x, yb + 20, INK, 13);
      if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); TB(k2_f(c[0], 1) + ' g acide', x + 40, yb - h1 / 2 + 4, DRED, 13, 'left'); TB(k2_f(c[1], 1) + ' g éthanol', x + 40, yb - h1 - h2 / 2 + 4, BLUE_D, 13, 'left'); ctx.globalAlpha = 1; }
    });
    if (p < .1) TB('?', xs[0], 130, GREY, 40), TB('?', xs[1], 130, GREY, 40);
  },
  /* 10 hydrolyse à l'équilibre */
  function (p) {
    TB('1,00 mol d\'ester + 1,00 mol d\'eau, K′ = 1/4', W * .5, 24, BLUE_D, 14);
    k2_bars(30, 220, 400, 150, [{ n: 'ester', v0: 1, v1: .667, c: BLUE }, { n: 'eau', v0: 1, v1: .667, c: '#9aa0a6' }, { n: 'acide', v0: 0, v1: .333, c: ORA2 }, { n: 'alcool', v0: 0, v1: .333, c: GREEN }], 1.1, p, '');
    if (p > .6) { ctx.globalAlpha = k6_rev(p, .6, 1); TB('même équilibre que l\'estérification', W * .5, 262, DGREEN, 14); ctx.globalAlpha = 1; } else TB('y = ?', W * .5, 262, GREY, 15);
  }
]);
