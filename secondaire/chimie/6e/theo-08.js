/* Chimie 6e · chapitre 8 : piles et potentiels standards (utilise les aides k6_ de theo-01.js et k4_ de theo-04.js). */
var K8_XL = 110, K8_XR = 350, K8_BY = 232, K8_BW = 150, K8_BH = 100, K8_WY = 46, K8_ET = 78;
function k8_path(f) { /* point à la fraction f (0..1) du fil : monte, traverse, descend */
  var a = K8_ET - K8_WY, b = K8_XR - K8_XL, tot = 2 * a + b, s = (((f % 1) + 1) % 1) * tot;
  if (s < a) return { x: K8_XL, y: K8_ET - s };
  if (s < a + b) return { x: K8_XL + (s - a), y: K8_WY };
  return { x: K8_XR, y: K8_WY + (s - a - b) };
}
function k8_bpath(f) { /* point du pont salin */
  var x1 = K8_XL + 48, x2 = K8_XR - 48, yb = K8_BY - K8_BH * .45, yt = K8_BY - K8_BH - 14, a = yb - yt, b = x2 - x1, tot = 2 * a + b, s = (((f % 1) + 1) % 1) * tot;
  if (s < a) return { x: x1, y: yb - s };
  if (s < a + b) return { x: x1 + (s - a), y: yt };
  return { x: x2, y: yt + (s - a - b) };
}
/* o : L, R = {el, ion, col, sol} ; signs ; flow (temps pour animer les électrons) ; ions (temps pour animer les ions du pont) ; volt (texte) ; elec (alpha des flèches) */
function k8_pile(o) {
  var L = o.L, R = o.R, bw = K8_BW, bh = K8_BH, by = K8_BY;
  k6_beaker(K8_XL, by, bw, bh, .72, L.sol); k6_beaker(K8_XR, by, bw, bh, .72, R.sol);
  /* pont salin */
  var x1 = K8_XL + 48, x2 = K8_XR - 48, yb = by - bh * .45, yt = by - bh - 14;
  ctx.lineJoin = 'round'; ctx.lineCap = 'butt';
  [[INK, 16], ['#f3eaa6', 11]].forEach(function (c) { ctx.strokeStyle = c[0]; ctx.lineWidth = c[1]; ctx.beginPath(); ctx.moveTo(x1, yb); ctx.lineTo(x1, yt); ctx.lineTo(x2, yt); ctx.lineTo(x2, yb); ctx.stroke(); });
  /* électrodes */
  [[K8_XL, L], [K8_XR, R]].forEach(function (e) {
    var x = e[0], c = e[1]; ctx.fillStyle = c.col; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.fillRect(x - 8, K8_ET, 16, by - 14 - K8_ET); ctx.strokeRect(x - 8, K8_ET, 16, by - 14 - K8_ET);
    TB(c.el + ' | ' + c.ion, x, by + 20, INK, 14);
  });
  /* fil et voltmètre */
  LN(K8_XL, K8_ET, K8_XL, K8_WY, INK, 2.4); LN(K8_XL, K8_WY, K8_XR, K8_WY, INK, 2.4); LN(K8_XR, K8_WY, K8_XR, K8_ET, INK, 2.4);
  DOT(230, K8_WY, 19, '#fff', true); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(230, K8_WY, 19, 0, 7); ctx.stroke(); TB('V', 230, K8_WY + 6, INK, 17);
  TB(o.volt || '', 230, K8_WY - 28, o.volt && o.volt.indexOf('?') < 0 ? DGREEN : GREY, 16);
  if (o.signs) { TB('anode (−)', K8_XL - 14, K8_ET + 22, DRED, 13, 'right'); TB('cathode (+)', K8_XR + 14, K8_ET + 22, BLUE_D, 13, 'left'); }
  if (o.flow != null) for (var k = 0; k < 9; k++) { var q = k8_path(o.flow * .004 + k / 9); if (Math.abs(q.x - 230) < 22 && Math.abs(q.y - K8_WY) < 22) continue; DOT(q.x, q.y, 4.5, '#f4c20d', true); }
  if (o.ions != null) for (var j = 0; j < 4; j++) { var ph = (o.ions * .003 + j / 4) % 1, pc = k8_bpath(.08 + .84 * ph), pa = k8_bpath(.92 - .84 * ph); DOT(pc.x, pc.y - 2, 4, RED, true); DOT(pa.x, pa.y + 2, 4, BLUE, true); }
}
var K8_ZN = { el: 'Zn', ion: 'Zn²⁺', col: '#b9bec4', sol: 'rgba(200,205,210,.35)' }, K8_CU = { el: 'Cu', ion: 'Cu²⁺', col: '#d98a5a', sol: 'rgba(120,170,230,.40)' };

SFA.theo("c08", {
  icon: function () {
    k8_pile({ L: K8_ZN, R: K8_CU, signs: false, volt: '1,10 V' });
  },
  anim: function (t) {
    var u = (t % 900) / 900;
    k8_pile({ L: K8_ZN, R: K8_CU, signs: true, flow: t * 1.1, ions: t * 1.0, volt: 'E = 1,10 V' });
    var xz = K8_XL, xc = K8_XR; ctx.fillStyle = 'rgba(255,255,255,.0)';
    TB('Zn → Zn²⁺ + 2 e⁻', K8_XL, K8_BY + 40, DRED, 13); TB('Cu²⁺ + 2 e⁻ → Cu', K8_XR, K8_BY + 40, BLUE_D, 13);
    TB('e⁻ →', 165, K8_WY - 12, '#8a6a00', 13);
    TB('anions ←', 215, K8_BY - K8_BH - 24, BLUE_D, 13); TB('→ cations', 255, K8_BY - K8_BH - 42, DRED, 13);
  },
  th: '<div class="tcard"><b class="h">Principe d\'une pile</b><p>Une pile est une réaction d\'oxydoréduction <b>spontanée</b> dont les deux demi-réactions se font dans deux compartiments séparés : l\'énergie chimique devient énergie électrique.</p><ul>' +
    '<li><b>Anode</b> : oxydation (le réducteur du couple de plus petit E° cède des électrons), pôle <b>−</b>.</li><li><b>Cathode</b> : réduction (l\'oxydant du couple de plus grand E° capte des électrons), pôle <b>+</b>.</li><li>Les <b>électrons</b> circulent dans le fil de l\'anode vers la cathode ; le <b>courant conventionnel</b> va dans l\'autre sens (de + vers −).</li><li>Le <b>pont salin</b> ferme le circuit : des anions migrent vers l\'anode, des cations vers la cathode, ce qui garde les solutions neutres.</li></ul>' +
    '<p>Notation : (−) Zn | Zn<sup>2+</sup> ‖ Cu<sup>2+</sup> | Cu (+).</p></div>' +
    '<div class="tcard"><b class="h">Force électromotrice et capacité</b><p><b>f.é.m. = E°(cathode) − E°(anode)</b> (1 mol/L, 25 °C) : Daniell 0,34 − (−0,76) = 1,10 V ; fer-argent 0,80 − (−0,44) = 1,24 V. Elle dépend des couples et des concentrations, pas de la taille des béchers : un bécher plus grand donne une pile qui dure plus longtemps, pas une tension plus grande.</p>' +
    '<p>Électrons échangés : n(e<sup>−</sup>) = I·t/F (F = 96 500 C/mol). Chaque Zn consommé libère 2 e<sup>−</sup> : n(Zn) = n(e<sup>−</sup>)/2.</p></div>' +
    '<div class="tcard"><b class="h">Usure et équation de Nernst</b><p>Quand la pile débite, Q = [Zn<sup>2+</sup>]/[Cu<sup>2+</sup>] augmente et la tension baisse : <b>E = E° − (0,0592/n)·log Q</b> à 25 °C (≈ 0,030 pour n = 2). La pile est « à plat » quand Q = K, E = 0 ; K = 10<sup>nE°/0,0592</sup> (≈ 10<sup>37</sup> pour Daniell).</p>' +
    '<p><b>Pile de concentration</b> : mêmes couples des deux côtés, E = (0,0592/n)·log(c<sub>1</sub>/c<sub>2</sub>) : la cathode est dans la solution la plus concentrée ; la pile s\'arrête quand les concentrations s\'égalisent.</p></div>' +
    '<div class="tcard"><b class="h">Associations, méthode et exemple</b><p>En <b>série</b>, les f.é.m. s\'ajoutent, les résistances internes aussi ; en <b>parallèle</b> la tension reste celle d\'une branche, la résistance interne diminue. Une LED rouge demande ≈ 1,8 V : 3 piles « citron » Zn-Cu de 0,90 V en série la font briller.</p>' +
    '<p>Exemple : I = 0,50 A pendant 1 h → Q = 1 800 C → n(e<sup>−</sup>) = 1,87·10<sup>−2</sup> mol → n(Zn) = 9,3·10<sup>−3</sup> mol → 0,61 g de zinc consommé.</p><p><b>Pièges :</b> anode ≠ pôle + dans une pile (c\'est le pôle − ; l\'inverse en électrolyse) ; les électrons ne traversent pas la solution ; ne pas confondre sens des électrons et sens du courant.</p></div>'
});

SFA.figs("c08", [
  /* 1 anode et cathode de la pile Daniell */
  function (p) {
    k8_pile({ L: K8_ZN, R: K8_CU, signs: p > 0, volt: p > 0 ? '1,10 V' : 'E = ?' });
    if (p > 0) { ctx.globalAlpha = p; A(150, K8_WY + 14, 60, 0, '#8a6a00', '', 2.4); TB('e⁻', 180, K8_WY + 34, '#8a6a00', 13); TB('Zn → Zn²⁺ + 2 e⁻', K8_XL, K8_BY + 40, DRED, 13); TB('Cu²⁺ + 2 e⁻ → Cu', K8_XR, K8_BY + 40, BLUE_D, 13); ctx.globalAlpha = 1; }
  },
  /* 2 pont salin */
  function (p) {
    k8_pile({ L: K8_ZN, R: K8_CU, signs: false, volt: '1,10 V' });
    var yt = K8_BY - K8_BH - 14;
    if (p > 0) {
      ctx.globalAlpha = p; A(250, yt - 20, -70, 0, BLUE, '', 2.6); A(210, yt - 44, 70, 0, RED, '', 2.6);
      TB('anions → vers l\'anode', 230, yt - 28 + 0, BLUE_D, 13); TB('cations → vers la cathode', 230, yt - 52, DRED, 13);
      TB('neutralité électrique des solutions', W * .5, K8_BY + 42, DGREEN, 14); ctx.globalAlpha = 1;
    } else TB('que se déplace-t-il dans le pont ?', W * .5, K8_BY + 42, GREY, 15);
  },
  /* 3 pile fer-argent */
  function (p) {
    var FE = { el: 'Fe', ion: 'Fe²⁺', col: '#8f949a', sol: 'rgba(170,210,170,.35)' }, AG = { el: 'Ag', ion: 'Ag⁺', col: '#dfe3e8', sol: 'rgba(230,230,235,.5)' };
    k8_pile({ L: FE, R: AG, signs: true, volt: p > 0 ? '1,24 V' : 'E = ?' });
    if (p > 0) { ctx.globalAlpha = p; TB('Fe + 2 Ag⁺ → Fe²⁺ + 2 Ag', W * .5, K8_BY + 42, DGREEN, 14); ctx.globalAlpha = 1; } else TB('0,80 − (−0,44) = ?', W * .5, K8_BY + 42, GREY, 14);
  },
  /* 4 usure d'une pile Daniell */
  function (p) {
    var S = [['I = 0,50 A, t = 3 600 s', 'Q = I·t = 1 800 C'], ['n(e⁻) = Q / F', '= 1,87·10⁻² mol'], ['n(Zn) = n(Cu) = n(e⁻) / 2', '= 9,3·10⁻³ mol'], ['m(Zn) = 0,61 g', 'm(Cu) = 0,59 g']];
    S.forEach(function (s, i) {
      var y = 24 + i * 62, a = i === 0 ? 1 : k6_rev(p, (i - 1) * .3, (i - 1) * .3 + .3); ctx.strokeStyle = AX; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(40, y, 380, 46, 10); ctx.stroke();
      TB(s[0], 56, y + 28, INK, 15, 'left'); ctx.globalAlpha = a; TB(s[1], 404, y + 28, DGREEN, 16, 'right'); if (i < 3 && a > .1) A(230, y + 46, 0, 14, GREY, '', 2); ctx.globalAlpha = 1;
      if (i === 0) { } else if (a <= 0) TB('?', 404, y + 28, GREY, 18, 'right');
    });
  },
  /* 5 f.é.m. et taille */
  function (p) {
    function bks(x0, big) {
      k6_beaker(x0 + 40, 220, 64, 84, .7, 'rgba(200,205,210,.35)'); k6_beaker(x0 + 130, 220, big ? 110 : 64, big ? 150 : 84, .7, 'rgba(120,170,230,.4)');
      ctx.fillStyle = '#b9bec4'; ctx.fillRect(x0 + 34, 160, 12, 54); ctx.fillStyle = '#d98a5a'; ctx.fillRect(x0 + 124, big ? 130 : 160, 12, big ? 84 : 54);
      TB('Zn', x0 + 40, 246, INK, 13); TB('Cu', x0 + 130, 246, INK, 13);
      LN(x0 + 40, 160, x0 + 40, 100, INK, 2); LN(x0 + 40, 100, x0 + 130, 100, INK, 2); LN(x0 + 130, 100, x0 + 130, big ? 130 : 160, INK, 2);
      DOT(x0 + 85, 100, 17, '#fff', true); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x0 + 85, 100, 17, 0, 7); ctx.stroke(); TB('V', x0 + 85, 106, INK, 15);
      TB(p > 0 ? '1,10 V' : '?', x0 + 85, 66, p > 0 ? DGREEN : GREY, 18);
    }
    bks(10, false); bks(230, true);
    TB('petit bécher', 100, 24, GREY, 13); TB('bécher deux fois plus grand', 320, 24, GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('=', 230, 70, DGREEN, 26); ctx.globalAlpha = 1; }
  },
  /* 6 courant et électrons */
  function (p) {
    k8_pile({ L: K8_ZN, R: K8_CU, signs: true, flow: p > 0 ? 100 * p : 0, volt: '1,10 V' });
    A(156, K8_WY + 12, 52, 0, '#8a6a00', '', 2.4); TB('e⁻ (Zn → Cu)', 182, K8_WY + 34, '#8a6a00', 13);
    if (p > 0) { ctx.globalAlpha = p; A(300, K8_WY + 12, -52, 0, RED, '', 3); TB('courant I', 276, K8_WY + 34, DRED, 13); ctx.globalAlpha = 1; } else TB('sens du courant ?', W * .5, K8_BY + 42, GREY, 15);
  },
  /* 7 pile de concentration */
  function (p) {
    var C1 = { el: 'Cu', ion: 'Cu²⁺ 0,010', col: '#d98a5a', sol: 'rgba(160,200,235,.30)' }, C2 = { el: 'Cu', ion: 'Cu²⁺ 1,0', col: '#d98a5a', sol: 'rgba(60,120,200,.5)' };
    k8_pile({ L: C1, R: C2, signs: p > 0, volt: p > 0 ? '0,059 V' : 'E = ?' });
    if (p > 0) { ctx.globalAlpha = p; TB('cathode dans la solution la plus concentrée', W * .5, K8_BY + 42, DGREEN, 13); ctx.globalAlpha = 1; } else TB('E = 0,030 · log(c₁/c₂)', W * .5, K8_BY + 42, GREY, 14);
  },
  /* 8 LED avec des citrons */
  function (p) {
    for (var i = 0; i < 3; i++) { var x = 70 + i * 90; ctx.fillStyle = '#f6e04a'; ctx.strokeStyle = '#b8a01d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, 70, 32, 22, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#b9bec4'; ctx.fillRect(x - 14, 38, 6, 20); ctx.fillStyle = '#d98a5a'; ctx.fillRect(x + 8, 38, 6, 20); TB('0,90 V', x, 76, INK, 12); if (i < 2) LN(x + 11, 40, x + 90 - 17, 40, INK, 2); }
    LN(56, 40, 56, 22, INK, 2); LN(56, 22, 380, 22, INK, 2); LN(380, 22, 380, 70, INK, 2); LN(251, 40, 251, 40, INK, 2);
    ctx.fillStyle = p > 0 ? '#ff4d4d' : '#ddd'; ctx.beginPath(); ctx.moveTo(372, 70); ctx.lineTo(388, 70); ctx.lineTo(380, 86); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke(); TB('LED', 380, 108, INK, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('3 citrons : 2,7 V · 900 Ω → I ≈ 1,0 mA', W * .5, 150, DGREEN, 14); ctx.globalAlpha = 1; } else TB('combien de citrons ?', W * .5, 150, GREY, 15);
    var yb = 252, sc = 70 / 2; LN(100, yb, 360, yb, AX, 1.5);
    [[170, 2.0, '6 en série', ORA2], [290, 1.9, '2 × 3 en parallèle', BLUE]].forEach(function (b) { var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 30, yb - h, 60, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 0 + 14 - 1, INK, 12); if (p > .5) TB(k4_f(b[1], 1) + ' mA', b[0], yb - h - 6, DGREEN, 14); });
    if (p <= .1) TB('I = ?', 230, 210, GREY, 18);
  },
  /* 9 Nernst */
  function (p) {
    var gx = 50, gb = 226, gw = 360, gh = 150; function X(q) { return gx + gw * (q + 4) / 8; } function Y(e) { return gb - gh * (e - .98) / .24; }
    LN(gx, gb, gx + gw, gb, AX, 1.5); LN(gx, gb, gx, gb - gh - 8, AX, 1.5);
    for (var q = -4; q <= 4; q += 2) { TB('' + q, X(q), gb + 17, GREY, 12); } [1, 1.1, 1.2].forEach(function (e) { TB(k4_f(e, 2), gx - 6, Y(e) + 4, GREY, 12, 'right'); });
    TB('log Q', gx + gw, gb + 34, GREY, 13, 'right'); TB('E (V)', gx + 10, gb - gh - 6, GREY, 13, 'left');
    ctx.strokeStyle = BLUE_D; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(-4), Y(1.10 + .12)); ctx.lineTo(X(4), Y(1.10 - .12)); ctx.stroke();
    if (p > 0) {
      ctx.globalAlpha = p; DOT(X(-2), Y(1.16), 6, GREEN, true); TB('a) 1,16 V', X(-2) + 8, Y(1.16) - 12, DGREEN, 14, 'left'); DOT(X(2), Y(1.04), 6, RED, true); TB('b) 1,04 V', X(2) - 8, Y(1.04) + 22, DRED, 14, 'right'); DOT(X(0), Y(1.10), 5, GREY, true);
      TB('K = 10^(2 × 1,10 / 0,0592) ≈ 1,4·10³⁷', W * .5, 268, GREY, 13); ctx.globalAlpha = 1;
    } else { TB('E = 1,10 − 0,030·log Q', W * .5, 80, GREY, 16); TB('Q = [Zn²⁺]/[Cu²⁺]', W * .5, 268, GREY, 13); }
  },
  /* 10 aluminium contre argent */
  function (p) {
    TB('Al + 3 Ag⁺ → Al³⁺ + 3 Ag', W * .5, 26, BLUE_D, 15);
    var yb = 220, sc = 130 / 5.2; LN(60, yb, 400, yb, AX, 1.5);
    [[140, 5.00, 'Ag déposé', '#9aa0a6', '540 mg'], [320, 1.67, 'Al dissous', BLUE, '45 mg']].forEach(function (b, i) {
      var h = b[1] * sc * (i === 0 ? 1 : p); ctx.fillStyle = b[3]; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 40, yb - h, 80, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 14);
      if (i === 0 || p > .5) { ctx.globalAlpha = i === 0 ? 1 : k6_rev(p, .5, 1); TB(k4_f(b[1], 2) + ' mmol', b[0], yb - h - 22, INK, 14); TB(b[4], b[0], yb - h - 6, DGREEN, 14); ctx.globalAlpha = 1; }
    });
    if (p > .3) { ctx.globalAlpha = k6_rev(p, .3, .8); A(250, 120, 0, 0, GREY, '', 1); TB('÷ 3', 230, 150, DRED, 20); ctx.globalAlpha = 1; } else TB('m(Al) = ?', 320, 130, GREY, 20);
  }
]);
