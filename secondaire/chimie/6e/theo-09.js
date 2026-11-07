/* Chimie 6e · chapitre 9 : électrolyse (utilise les aides k6_ de theo-01.js, k4_ de theo-04.js et k8_ de theo-08.js). */
var K9_XC = 185, K9_XA = 275, K9_BY = 214, K9_BH = 100, K9_GY = 44, K9_ET = 76;
/* cellule d'électrolyse ; o : sol, cat, an (couleurs d'électrodes), coat (0..1 dépôt sur la cathode), tubes {h, o, ch, ox} fractions de remplissage, bub (temps), pol (alpha des signes), gas (couleur du gaz anodique) */
function k9_cell(o) {
  var by = K9_BY, bh = K9_BH, bw = 210, xc = K9_XC, xa = K9_XA;
  k6_beaker(230, by, bw, bh, .8, o.sol || 'rgba(120,170,230,.30)');
  function tube(x, fr, col) {
    var top = K9_ET + 10, bot = by - bh * .8 + 26, h = bot - top;
    ctx.fillStyle = 'rgba(120,170,230,.45)'; ctx.fillRect(x - 17, top, 34, h); ctx.fillStyle = col || '#fff'; ctx.fillRect(x - 17, top, 34, h * Math.max(0, Math.min(1, fr)));
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 17, bot); ctx.lineTo(x - 17, top + 8); ctx.arc(x, top + 8, 17, PI, 0); ctx.lineTo(x + 17, bot); ctx.stroke();
  }
  if (o.tubes) { tube(xc, o.tubes.h, '#fff'); tube(xa, o.tubes.o, o.tubes.col || '#fff'); }
  [[xc, o.cat || '#b9bec4'], [xa, o.an || '#2a2a2a']].forEach(function (e, i) {
    ctx.fillStyle = e[1]; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.fillRect(e[0] - 6, K9_ET, 12, by - 10 - K9_ET); ctx.strokeRect(e[0] - 6, K9_ET, 12, by - 10 - K9_ET);
    if (i === 0 && o.coat) { ctx.fillStyle = o.coatCol || '#dfe3e8'; ctx.globalAlpha = o.coat; ctx.fillRect(e[0] - 11, by - 60, 5, 48); ctx.fillRect(e[0] + 6, by - 60, 5, 48); ctx.globalAlpha = 1; }
  });
  LN(xc, K9_ET, xc, K9_GY, INK, 2.4); LN(xc, K9_GY, 216, K9_GY, INK, 2.4); LN(xa, K9_ET, xa, K9_GY, INK, 2.4); LN(xa, K9_GY, 244, K9_GY, INK, 2.4);
  LN(220, K9_GY - 9, 220, K9_GY + 9, INK, 4); LN(240, K9_GY - 15, 240, K9_GY + 15, INK, 2.4);
  TB('générateur', 230, K9_GY - 24, GREY, 13);
  if (o.pol) { ctx.globalAlpha = o.pol; TB('−', 206, K9_GY - 8, DRED, 20); TB('+', 254, K9_GY - 8, BLUE_D, 20); TB('cathode (−)', xc - 14, by + 22, DRED, 13); TB('anode (+)', xa + 14, by + 22, BLUE_D, 13); ctx.globalAlpha = 1; }
  if (o.bub != null) for (var k = 0; k < 6; k++) [[xc, o.tubes ? null : RED], [xa, o.tubes ? null : BLUE]].forEach(function (b, i) {
    if (o.tubes) return; var ph = ((o.bub * .012) + k / 6 + i * .3) % 1, y = by - 14 - ph * (bh * .75); ctx.strokeStyle = i ? (o.gasA || '#7fa5c9') : '#7fa5c9'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(b[0] + (i ? 14 : -14) + 4 * Math.sin(ph * 12 + k), y, 3.2, 0, 7); ctx.stroke();
  });
}
function k9_tag(txt, x, y, col, p) { if (p > 0) { ctx.globalAlpha = p; tag(txt, x, y, col, 14); ctx.globalAlpha = 1; } }

SFA.theo("c09", {
  icon: function () {
    TB('n(e⁻) = I·t / F', W * .5, H * .4, BLUE_D, 32); TB('électrolyse · Faraday', W * .5, H * .64, ORANGE, 20); TB('m = n·M · V = n·Vm', W * .5, H * .86, GREY, 15);
  },
  anim: function (t) {
    var u = (t % 700) / 700, fh = u * .95, fo = u * .475;
    k9_cell({ tubes: { h: fh, o: fo }, pol: 1, sol: 'rgba(120,170,230,.28)' });
    /* gaz dans les tubes : bulles */
    for (var k = 0; k < 5; k++) { var ph = ((t * .015) + k / 5) % 1; [[K9_XC, 1], [K9_XA, 1]].forEach(function (b, i) { var y = K9_BY - 20 - ph * 80; ctx.strokeStyle = '#7fa5c9'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(b[0] + 5 * Math.sin(ph * 10 + k), y, 3, 0, 7); ctx.stroke(); }); }
    TB('H₂', K9_XC, K9_ET + 50, BLUE_D, 18); TB('O₂', K9_XA, K9_ET + 50, DRED, 18);
    TB('2 H⁺ + 2 e⁻ → H₂', 70, 130, BLUE_D, 13, 'center'); TB('2 H₂O → O₂ + 4 H⁺ + 4 e⁻', 392, 130, DRED, 13, 'center');
    TB('V(H₂) = 2 × V(O₂)', 230, K9_BY + 44, DGREEN, 15);
    var en = ((t * 1.1) % 100) / 100; for (var j = 0; j < 7; j++) { var f = (en + j / 7) % 1, x, y; var a = K9_ET - K9_GY, b2 = K9_XA - K9_XC, tot = 2 * a + b2, s = (1 - f) * tot; if (s < a) { x = K9_XC; y = K9_ET - s; } else if (s < a + b2) { x = K9_XC + (s - a); y = K9_GY; } else { x = K9_XA; y = K9_GY + (s - a - b2); } /* du + (anode) vers le − (cathode) */ if (Math.abs(x - 230) < 16 && Math.abs(y - K9_GY) < 20) continue; DOT(x, y, 3.6, '#f4c20d', true); }
    TB('e⁻', 330, K9_GY - 6, '#8a6a00', 13);
  },
  th: '<div class="tcard"><b class="h">Principe de l\'électrolyse</b><p>L\'électrolyse force une réaction <b>non spontanée</b> avec un générateur : la tension appliquée doit dépasser la f.é.m. de la pile correspondante. L\'<b>anode</b> (oxydation) est reliée à la borne <b>+</b> ; la <b>cathode</b> (réduction) à la borne <b>−</b> : polarités inverses de celles d\'une pile, mais anode = oxydation partout. Les électrons vont de l\'anode vers la cathode <b>dans le circuit extérieur</b>, les ions assurent le courant dans la solution.</p>' +
    '<p>Eau acidifiée : cathode 2 H<sup>+</sup> + 2 e<sup>−</sup> → H<sub>2</sub> ; anode 2 H<sub>2</sub>O → O<sub>2</sub> + 4 H<sup>+</sup> + 4 e<sup>−</sup> ; bilan 2 H<sub>2</sub>O → 2 H<sub>2</sub> + O<sub>2</sub> (V(H<sub>2</sub>) = 2 V(O<sub>2</sub>)).</p></div>' +
    '<div class="tcard"><b class="h">Loi de Faraday</b><p>Q = I·t (en C, avec t en s) ; <b>n(e<sup>−</sup>) = I·t / F</b> (F = 96 500 C/mol) ; n(produit) = n(e<sup>−</sup>) / z, où z est le nombre d\'électrons de la demi-équation ; masse m = n·M ; volume d\'un gaz V = n·V<sub>m</sub>. Un <b>rendement faradique</b> η &lt; 1 impose Q réelle = Q théorique / η.</p>' +
    '<p>Exemple : 2,0 A pendant 10 min pour Ag<sup>+</sup> + e<sup>−</sup> → Ag : Q = 1 200 C ; n(e<sup>−</sup>) = 1,24·10<sup>−2</sup> mol ; m = 1,24·10<sup>−2</sup> × 108 = 1,34 g.</p></div>' +
    '<div class="tcard"><b class="h">Applications industrielles</b><ul><li><b>Procédé chlore-soude</b> (saumure NaCl) : anode 2 Cl<sup>−</sup> → Cl<sub>2</sub> + 2 e<sup>−</sup> ; cathode 2 H<sub>2</sub>O + 2 e<sup>−</sup> → H<sub>2</sub> + 2 OH<sup>−</sup> ; on obtient Cl<sub>2</sub>, H<sub>2</sub> et NaOH. Na<sup>+</sup> n\'est jamais réduit dans l\'eau.</li>' +
    '<li><b>Galvanoplastie</b> (cuivrage, argenture, nickelage) : l\'objet est la <b>cathode</b> (borne −), l\'anode est le métal du dépôt, qui se dissout.</li><li>Raffinage du cuivre, production de l\'aluminium.</li></ul></div>' +
    '<div class="tcard"><b class="h">Protéger un métal de la corrosion</b><p>Galvanisation (revêtement de zinc), peinture, ou <b>anode sacrificielle</b> : un métal plus réducteur (Zn, Mg, Al) relié au fer s\'oxyde à sa place. Un métal plus noble (Cu) accélérerait au contraire la corrosion du fer.</p>' +
    '<p><b>Méthode :</b> demi-équations → z → Faraday. <b>Pièges :</b> t en secondes ; deux fois plus d\'électrons que d\'atomes pour M²⁺ ; confondre pôle + et cathode ; oublier le rendement.</p></div>'
});

SFA.figs("c09", [
  /* 1 électrolyse de l'eau */
  function (p) {
    k9_cell({ tubes: { h: .8 * p, o: .4 * p }, pol: 1 });
    TB('H₂', K9_XC, K9_ET + 50, BLUE_D, 18); TB('O₂', K9_XA, K9_ET + 50, DRED, 18);
    if (p > 0) { ctx.globalAlpha = p; TB('2 H⁺ + 2 e⁻ → H₂', 76, 126, BLUE_D, 14); TB('2 H₂O → O₂ + 4 H⁺ + 4 e⁻', 384, 126, DRED, 13); TB('2 H₂O → 2 H₂ + O₂', W * .5, K9_BY + 44, DGREEN, 16); ctx.globalAlpha = 1; } else TB('quel gaz où ?', W * .5, K9_BY + 44, GREY, 15);
  },
  /* 2 anode d'une électrolyse */
  function (p) {
    TB('pile', 120, 30, BLUE_D, 16); TB('électrolyse', 340, 30, BLUE_D, 16); LN(230, 40, 230, 250, AX, 1.5);
    [[120, '−', 'spontanée', DRED], [340, '+', 'forcée par un générateur', BLUE_D]].forEach(function (c, i) {
      ctx.strokeStyle = AX; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(c[0] - 96, 60, 192, 80, 10); ctx.stroke();
      TB('anode', c[0] - 40, 94, INK, 17); TB('borne ' + c[1], c[0] + 40, 94, c[3], 17); TB(c[2], c[0], 124, GREY, 13);
    });
    if (p > 0) { ctx.globalAlpha = p; tag('oxydation', 120, 190, DGREEN, 17); tag('oxydation', 340, 190, DGREEN, 17); TB('l\'anode est toujours le siège de l\'oxydation', W * .5, 250, DGREEN, 14); ctx.globalAlpha = 1; } else { TB('?', 120, 200, GREY, 36); TB('?', 340, 200, GREY, 36); }
  },
  /* 3 argenture */
  function (p) {
    k9_cell({ cat: '#9aa0a6', an: '#e5e8ec', coat: p, coatCol: '#f4f6f8', pol: 1, bub: null });
    TB('Ag⁺', 230, K9_BY - 30, BLUE_D, 15); TB('I = 2,0 A', 66, 86, INK, 14); TB('t = 10 min', 66, 106, INK, 14);
    if (p > 0) { ctx.globalAlpha = p; TB('Q = 1 200 C → n(e⁻) = 1,24·10⁻² mol', W * .5, K9_BY + 44, INK, 14); TB('m(Ag) = 1,24·10⁻² × 108 = 1,34 g', W * .5, K9_BY + 64, DGREEN, 16); ctx.globalAlpha = 1; } else TB('Q ? n(e⁻) ? m ?', W * .5, K9_BY + 52, GREY, 15);
  },
  /* 4 volumes de gaz */
  function (p) {
    k9_cell({ tubes: { h: .8 * p, o: .4 * p }, pol: 1 });
    TB('0,50 A', 70, 70, GREY, 14); TB('30 min', 70, 90, GREY, 14);
    TB('H₂', K9_XC, K9_ET + 50, BLUE_D, 18); TB('O₂', K9_XA, K9_ET + 50, DRED, 18);
    if (p > 0) { ctx.globalAlpha = p; tag('112 mL', K9_XC - 56, 112, BLUE_D, 15); tag('56 mL', K9_XA + 56, 112, DRED, 15); TB('n(e⁻) = 9,33·10⁻³ mol', W * .5, K9_BY + 44, INK, 14); ctx.globalAlpha = 1; } else TB('V(H₂) ? V(O₂) ?', W * .5, K9_BY + 44, GREY, 15);
  },
  /* 5 cathode d'une saumure */
  function (p) {
    k9_cell({ pol: 1, bub: 80 + p * 600, sol: 'rgba(230,235,200,.45)', gasA: '#9bc53d' });
    TB('NaCl concentré', W * .5, K9_BY - 8, GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; tag('H₂ + OH⁻', 92, 120, BLUE_D, 15); tag('Cl₂', 400, 120, '#5f8a1a', 15); TB('2 H₂O + 2 e⁻ → H₂ + 2 OH⁻', 120, K9_BY + 44, DGREEN, 13); TB('Na⁺ ne se réduit pas dans l\'eau', 340, K9_BY + 44, GREY, 13); ctx.globalAlpha = 1; } else { TB('?', 92, 120, GREY, 36); TB('?', 400, 120, GREY, 36); }
  },
  /* 6 cuivrer une clé */
  function (p) {
    k9_cell({ cat: '#d9b44a', an: '#d98a5a', coat: p, coatCol: '#d98a5a', pol: p, sol: 'rgba(120,170,230,.40)' });
    TB('clé en laiton', 100, 130, INK, 13); TB('Cu', 330, 130, INK, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('clé = cathode (−) : Cu²⁺ + 2 e⁻ → Cu', W * .5, K9_BY + 44, DGREEN, 14); TB('Cu = anode (+) : se dissout', W * .5, K9_BY + 64, BLUE_D, 14); ctx.globalAlpha = 1; } else TB('quelle borne pour la clé ?', W * .5, K9_BY + 52, GREY, 15);
  },
  /* 7 nickelage */
  function (p) {
    ctx.fillStyle = '#c9ced4'; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.fillRect(40, 130, 130, 60); ctx.strokeRect(40, 130, 130, 60); ctx.fillStyle = '#7d8a90'; ctx.fillRect(40, 124, 130, 6); ctx.strokeRect(40, 124, 130, 6);
    TB('25 µm de Ni', 105, 112, DRED, 13); TB('S = 80 cm²', 105, 214, INK, 14); TB('2,0 A · η = 95 %', 105, 238, GREY, 13);
    var L = ['V = 80 × 25·10⁻⁴ = 0,20 cm³', 'm = 8,9 × 0,20 = 1,78 g', 'n(e⁻) = 2 × 1,78/59 = 6,03·10⁻² mol', '÷ 0,95 → Q = 6,13·10³ C', 't = Q / I ≈ 3,1·10³ s ≈ 51 min'];
    L.forEach(function (l, i) { var a = k6_rev(p, i * .17, i * .17 + .2); ctx.globalAlpha = a; TB(l, 204, 40 + i * 44, i === 4 ? DGREEN : INK, i === 4 ? 15 : 13, 'left'); if (i < 4 && a > 0) A(212, 46 + i * 44, 0, 18, GREY, '', 1.5); ctx.globalAlpha = 1; });
    if (p <= 0) TB('t = ?', 320, 150, GREY, 30);
  },
  /* 8 procédé chlore-soude */
  function (p) {
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.strokeRect(70, 80, 320, 130); ctx.setLineDash([6, 5]); LN(230, 80, 230, 210, GREY, 2.4); ctx.setLineDash([]); TB('membrane', 230, 226, GREY, 13);
    ctx.fillStyle = 'rgba(230,235,200,.5)'; ctx.fillRect(71, 110, 158, 99); ctx.fillStyle = 'rgba(120,170,230,.35)'; ctx.fillRect(231, 110, 158, 99);
    TB('anode (+)', 150, 100, BLUE_D, 14); TB('cathode (−)', 310, 100, DRED, 14); TB('2 Cl⁻ → Cl₂ + 2 e⁻', 150, 196, INK, 13); TB('2 H₂O + 2 e⁻ → H₂ + 2 OH⁻', 310, 196, INK, 12);
    A(150, 76, 0, -34, '#5f8a1a', '', 3); TB('Cl₂', 150, 36, '#5f8a1a', 16); A(310, 76, 0, -34, BLUE, '', 3); TB('H₂', 310, 36, BLUE_D, 16);
    if (p > 0) { ctx.globalAlpha = p; A(192, 150, 76, 0, RED, '', 2.4); TB('Na⁺', 232, 140, DRED, 13); TB('13,2 kg', 150, 252, '#5f8a1a', 16); TB('373 g', 310, 252, BLUE_D, 16); tag('14,9 kg de NaOH', 330, 150, DGREEN, 13); ctx.globalAlpha = 1; } else { TB('10 kA · 1 h', W * .5, 262, GREY, 14); }
  },
  /* 9 anodes sacrificielles */
  function (p) {
    var yb = 214, sc = 130 / 4.6; LN(40, yb, 430, yb, AX, 1.5); TB('durée de protection (ans), 12 kg, 0,80 A', W * .5, 24, BLUE_D, 14);
    [[80, 1.3, 'Zn', '#8fa6c9', 'z/M = 0,031'], [180, 1.9, 'Mg', '#d9a441', 'z/M = 0,083'], [280, 4.3, 'Al', '#9aa0a6', 'z/M = 0,111']].forEach(function (b) {
      var h = b[1] * sc * p; ctx.fillStyle = b[3]; ctx.globalAlpha = .88; ctx.fillRect(b[0] - 30, yb - h, 60, h); ctx.globalAlpha = 1; TB(b[2], b[0], yb + 20, INK, 15); TB(b[4], b[0], yb + 38, GREY, 12);
      if (p > .5) { ctx.globalAlpha = k6_rev(p, .5, 1); TB(k4_f(b[1], 1) + ' an' + (b[1] > 1.95 ? 's' : ''), b[0], yb - h - 8, DGREEN, 14); ctx.globalAlpha = 1; }
    });
    TB('Cu', 380, yb + 20, INK, 15); if (p > 0) { ctx.globalAlpha = p; tag('plus noble : ✗', 380, yb - 40, DRED, 13); ctx.globalAlpha = 1; } else TB('?', 380, yb - 40, GREY, 24);
  },
  /* 10 recharger une pile Daniell */
  function (p) {
    k8_pile({ L: K8_ZN, R: K8_CU, signs: false, volt: '', flow: p > 0 ? -100 * p : null });
    ctx.fillStyle = '#fff'; ctx.fillRect(206, K8_WY - 24, 48, 48); LN(226, K8_WY - 10, 226, K8_WY + 10, INK, 4); LN(236, K8_WY - 16, 236, K8_WY + 16, INK, 2.4); LN(K8_XL, K8_WY, 226, K8_WY, INK, 2.4); LN(236, K8_WY, K8_XR, K8_WY, INK, 2.4);
    TB('générateur', 230, K8_WY - 28, GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('−', 214, K8_WY - 10, DRED, 18); TB('+', 250, K8_WY - 10, BLUE_D, 18); TB('cathode (−)', K8_XL - 14, K8_ET + 22, DRED, 13, 'right'); TB('anode (+)', K8_XR + 14, K8_ET + 22, BLUE_D, 13, 'left'); TB('U > 1,10 V', W * .5, K8_BY + 42, DGREEN, 16); ctx.globalAlpha = 1; } else TB('où brancher le générateur ?', W * .5, K8_BY + 42, GREY, 15);
  }
]);
