/* Chimie 6e · chapitre 3 : alcènes, polymères, plastiques (utilise les aides k6_ de theo-01.js). */
/* chaîne carbonée en zigzag, liaisons doubles aux indices de dbl ; sub = {i:[label,col]} substituants verticaux (haut si sommet haut) */
function k3_alk(x, y, s, n, dbl, col, sub) {
  var P = [], i; for (i = 0; i < n; i++) P.push({ x: x + i * .87 * s, y: y - (i % 2 ? .5 * s : 0) });
  for (i = 0; i < n - 1; i++) { if (dbl && dbl.indexOf(i) >= 0) k6_dbl(P[i].x, P[i].y, P[i + 1].x, P[i + 1].y, col || INK, 2.2); else LN(P[i].x, P[i].y, P[i + 1].x, P[i + 1].y, col || INK, 2.4); }
  if (sub) for (var k in sub) { var q = P[+k], sg = (+k % 2 ? -1 : 1), tv = (+k === 0 && n > 1) ? [-.87, -.5] : [0, sg]; var ex = q.x + tv[0] * .95 * s, ey = q.y + tv[1] * .95 * s; LN(q.x, q.y, ex, ey, sub[k][1], 2.4); k6_at(sub[k][0], ex, ey, sub[k][1], Math.max(13, s * .5)); }
  return P;
}
function k3_br(x1, x2, y, h, lab, col) {
  ctx.strokeStyle = col || INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x1 + 8, y - h); ctx.lineTo(x1, y - h); ctx.lineTo(x1, y + h); ctx.lineTo(x1 + 8, y + h);
  ctx.moveTo(x2 - 8, y - h); ctx.lineTo(x2, y - h); ctx.lineTo(x2, y + h); ctx.lineTo(x2 - 8, y + h); ctx.stroke();
  TB(lab, x2 + 4, y + h + 4, col || INK, 17, 'left');
}
function k3_chip(x, y, lab, col, hl) { ctx.fillStyle = col; ctx.globalAlpha = .9; ctx.beginPath(); ctx.roundRect(x - 34, y - 11, 68, 22, 5); ctx.fill(); ctx.globalAlpha = 1; TB(lab, x, y + 5, '#fff', 12); if (hl) { ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 40, y - 17, 80, 34, 9); ctx.stroke(); } }

SFA.theo("c03", {
  icon: function () {
    TB('n  CH₂=CH₂', W * .27, H * .42, BLUE_D, 24); TB('→', W * .5, H * .42, ORANGE, 30); TB('(–CH₂–CH₂–)ₙ', W * .75, H * .42, BLUE_D, 22);
    TB('polyaddition', W * .5, H * .68, ORANGE, 18); TB('alcènes · polymères · plastiques', W * .5, H * .88, GREY, 14);
  },
  anim: function (t) {
    var N = 6, j = Math.floor((t / 45) % (N + 3)), k = Math.min(j, N), y = H * .42, st = (W - 90) / (N - 1), x0 = 45, d = 15;
    TB('n monomères C=C  →  chaîne de polymère', W * .5, 24, BLUE_D, 15);
    for (var i = 0; i < N; i++) {
      var cx = x0 + i * st, joined = i < k, xa = cx - d, xb = cx + d;
      if (joined) LN(xa, y, xb, y, INK, 2.8); else k6_dbl(xa, y, xb, y, BLUE, 2.4);
      DOT(xa, y, 5, INK, true); DOT(xb, y, 5, INK, true);
      TB(joined ? '' : 'CH₂=CH₂', cx, y - 24, GREY, 13);
      if (i + 1 < N && i + 1 < k) LN(xb, y, x0 + (i + 1) * st - d, y, RED, 3);
      if (i + 1 < N && i + 1 === k) { var f = Math.min(1, ((t / 45) % 1) * 2); LN(xb, y, xb + (x0 + (i + 1) * st - d - xb) * f, y, RED, 3); }
    }
    if (k > 0) { var xe = x0 - d - 18; LN(x0 - d, y, xe, y, RED, 3, [3, 3]); }
    if (k >= N) { LN(x0 + (N - 1) * st + d, y, W - 18, y, RED, 3, [3, 3]); }
    if (k >= 4) { k3_br(x0 + 2 * st - d - 12, x0 + 2 * st + d + 12, y, 22, 'n', ORANGE); TB('motif –CH₂–CH₂–', x0 + 2 * st, y + 56, ORANGE, 14); }
    TB('chaque C=C s\'ouvre : le trait double devient simple, de nouvelles liaisons (rouge) relient les motifs', W * .5, H * .93, GREY, 12);
    TB('polyaddition : aucune molécule perdue · polycondensation : on libère H₂O', W * .5, H * .86, DGREEN, 13);
  },
  th: '<div class="tcard"><b class="h">Alcènes et réactions d\'addition</b><p>Un alcène possède une double liaison C=C : formule C<sub>n</sub>H<sub>2n</sub> (un seul C=C, sans cycle), nom en <i>-ène</i> avec la position de la liaison (but-2-ène). Il est insaturé : il peut « ajouter » des atomes.</p><ul>' +
    '<li>+ H<sub>2</sub> (Ni ou Pt) → alcane.</li><li>+ Br<sub>2</sub> → dibromoalcane : <b>l\'eau de brome orange se décolore</b> (test de la double liaison).</li><li>+ HBr → bromoalcane ; + H<sub>2</sub>O (catalyseur acide) → alcool.</li></ul>' +
    '<p><b>Règle de Markovnikov :</b> avec HBr ou H<sub>2</sub>O sur un alcène non symétrique, H se fixe sur le carbone qui porte déjà le plus d\'hydrogènes ; Br (ou OH) va sur le carbone le plus substitué. Propène + HBr → 2-bromopropane (majoritaire).</p></div>' +
    '<div class="tcard"><b class="h">Polyaddition</b><p>n monomères insaturés s\'additionnent les uns aux autres : la double liaison s\'ouvre et relie les motifs. <b>Aucune molécule n\'est perdue</b> : M(polymère) = n × M(monomère).</p>' +
    '<p>Exemples : éthène → polyéthylène PE ; propène → polypropylène PP ; chloroéthène → PVC ; styrène → polystyrène PS. Le <b>degré de polymérisation</b> n = M(polymère)/M(monomère).</p>' +
    '<p>Exemple chiffré : PE de 84 000 g/mol, M(C<sub>2</sub>H<sub>4</sub>) = 28 g/mol → n = 84 000/28 = 3 000.</p></div>' +
    '<div class="tcard"><b class="h">Polycondensation</b><p>Les monomères portent <b>deux fonctions</b> (diacide + diol, ou diacide + diamine). Chaque liaison formée libère une petite molécule, souvent H<sub>2</sub>O : c\'est une estérification (PET) ou une amidification (nylon) répétée.</p>' +
    '<p>PET : acide téréphtalique (166 g/mol) + éthane-1,2-diol (62 g/mol) → motif de 166 + 62 − 2 × 18 = 192 g/mol, avec 2 H<sub>2</sub>O libérées par motif. Pour une chaîne de 2n monomères : (2n − 1) H<sub>2</sub>O.</p></div>' +
    '<div class="tcard"><b class="h">Plastiques, tri et environnement</b><p><b>Thermoplastiques</b> (PE, PP, PET, PVC, PS) : ils ramollissent à chaud, donc se recyclent. <b>Thermodurcissables</b> : durcissent de façon irréversible.</p>' +
    '<p>Tri par densité : PP 0,90 et PEHD 0,95 flottent sur l\'eau (1,00 g/cm³) ; PS compact 1,05 et PET/PVC 1,38 coulent. Une solution saline (1,20) fait flotter le PS mais pas le PET.</p>' +
    '<p>Impact : déchets peu biodégradables, microplastiques, ressource fossile. Pistes : réduire, réutiliser, recycler, bioplastiques. <b>Pièges :</b> confondre polyaddition (rien n\'est libéré) et polycondensation ; oublier qu\'une double liaison = un Br<sub>2</sub>.</p></div>'
});

SFA.figs("c03", [
  /* 1 reconnaître un alcène */
  function (p) {
    var F = [['C₂H₆', 2, 6, null], ['C₃H₆', 3, 6, [1]], ['C₄H₁₀', 4, 10, null], ['C₅H₁₀', 5, 10, [1]]];
    TB('CₙH₂ₙ ?', W * .5, 22, BLUE_D, 15);
    F.forEach(function (f, i) {
      var cx = 66 + i * 109, ok = f[2] === 2 * f[1];
      ctx.strokeStyle = ok && p > 0 ? GREEN : AX; ctx.lineWidth = ok && p > 0 ? 3 : 1.6; ctx.beginPath(); ctx.roundRect(cx - 50, 40, 100, 200, 10); ctx.stroke();
      TB(f[0], cx, 72, BLUE_D, 18); T('2n = ' + 2 * f[1], cx, 98, GREY, 13);
      if (p > 0) {
        ctx.globalAlpha = p; TB(ok ? '✓ alcène' : '✗ alcane', cx, 126, ok ? DGREEN : DRED, 14);
        var s = 17, wch = (f[1] - 1) * .87 * s; k3_alk(cx - wch / 2, 190, s, f[1], ok ? [ok ? (i === 1 ? 0 : 0) : 0] : null, ok ? ORA2 : INK);
        TB(ok ? 'C=C' : '', cx, 224, ORA2, 13); ctx.globalAlpha = 1;
      } else TB('?', cx, 175, GREY, 40);
    });
  },
  /* 2 eau de brome et pent-1-ène */
  function (p) {
    var col = k6_mix(K6_OR, [248, 248, 244], p);
    k6_tube(90, 54, 56, 176, .62, col); ctx.fillStyle = 'rgba(250,240,170,.65)'; ctx.fillRect(63, 54 + 176 * .38, 54, 26);
    TB('pent-1-ène (dessus)', 90, 40, GREY, 13); TB('eau de brome', 90, 254, ORANGE, 13);
    k3_alk(190, 100, 26, 5, [0], BLUE); TB('pent-1-ène', 244, 128, BLUE_D, 13);
    TB('C=C  +  Br₂  →  C(Br)–C(Br)', 320, 170, INK, 14);
    if (p > 0) { ctx.globalAlpha = p; TB('solution incolore', 320, 206, DGREEN, 16); TB('(tant qu\'il reste de l\'alcène)', 320, 228, GREY, 13); ctx.globalAlpha = 1; }
    else TB('orange → ?', 320, 206, GREY, 16);
  },
  /* 3 addition de Br2 sur but-2-ène */
  function (p) {
    k3_alk(36, 80, 30, 4, [1], BLUE); TB('but-2-ène', 80, 124, BLUE_D, 13); TB('+ Br₂', 190, 74, ORANGE, 18); TB('5,6 g', 80, 142, INK, 13); TB('→', 250, 74, GREY, 30);
    if (p > 0) {
      ctx.globalAlpha = p; k3_alk(290, 80, 28, 4, null, INK, { 1: ['Br', DRED], 2: ['Br', DRED] }); TB('2,3-dibromobutane', 330, 124, DGREEN, 13);
      TB('0,100 mol Br₂ → 16 g', 120, 190, ORANGE, 15, 'left'); TB('produit : 5,6 + 16 = 21,6 g', 120, 220, DGREEN, 16, 'left'); TB('0,100 mol', 330, 142, GREY, 13);
      ctx.globalAlpha = 1;
    } else { TB('produit ?', 330, 90, GREY, 20); TB('m(Br₂) = ?', W * .5, 200, GREY, 18); }
  },
  /* 4 combien de monomères */
  function (p) {
    var y1 = 80, y2 = 190;
    k3_alk(120, y1 + 10, 24, 3, null, INK); k3_br(100, 218, y1, 26, 'n', ORANGE); TB('PE', 40, y1 + 6, BLUE_D, 18);
    var P = k3_alk(120, y2 + 10, 24, 3, null, INK, { 1: ['Cl', DGREEN] }); k3_br(100, 218, y2, 26, 'n', ORANGE); TB('PVC', 40, y2 + 6, BLUE_D, 18);
    TB('84 000 g/mol', 340, y1 - 6, INK, 15); TB('M(C₂H₄) = 28', 340, y1 + 16, GREY, 13);
    TB('187 500 g/mol', 340, y2 - 6, INK, 15); TB('M(C₂H₃Cl) = 62,5', 340, y2 + 16, GREY, 13);
    if (p > 0) { ctx.globalAlpha = p; TB('n = 3 000', 340, y1 + 44, DGREEN, 18); TB('n = 3 000', 340, y2 + 44, DGREEN, 18); TB('même n, PVC 2,2 × plus lourd', W * .5, 262, GREY, 13); ctx.globalAlpha = 1; }
    else { TB('n = ?', 340, y1 + 44, GREY, 18); TB('n = ?', 340, y2 + 44, GREY, 18); }
  },
  /* 5 PET : polycondensation */
  function (p) {
    function hex(cx, cy, r) { ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); for (var k = 0; k < 6; k++) { var a = PI / 6 + k * PI / 3; k ? ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, r * .55, 0, 7); ctx.stroke(); }
    TB('HOOC', 38, 62, ORA2, 15); LN(62, 58, 76, 58, INK, 2.2); hex(100, 58, 22); LN(124, 58, 138, 58, INK, 2.2); TB('COOH', 168, 62, ORA2, 15); TB('acide téréphtalique', 104, 100, ORA2, 13);
    TB('+', 232, 62, INK, 24); TB('HO–CH₂–CH₂–OH', 335, 62, BLUE, 16); TB('éthane-1,2-diol', 335, 100, BLUE_D, 13);
    LN(30, 120, W - 30, 120, AX, 1);
    if (p > 0) {
      ctx.globalAlpha = p; TB('–OC', 40, 172, ORA2, 15); hex(94, 168, 20); TB('CO–O–CH₂CH₂–O–', 200, 172, INK, 15); hex(302, 168, 20); TB('CO–', 350, 172, ORA2, 15);
      [[150, 215], [260, 215]].forEach(function (q) { ctx.fillStyle = '#e6f1fb'; ctx.beginPath(); ctx.arc(q[0], q[1], 14, 0, 7); ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.stroke(); TB('H₂O', q[0], q[1] + 5, BLUE_D, 11); });
      TB('liaison ester formée = 1 H₂O libérée', W * .5, 258, DGREEN, 14); ctx.globalAlpha = 1;
    } else { TB('polyaddition ou polycondensation ?', W * .5, 190, GREY, 16); }
  },
  /* 6 densités */
  function (p) {
    function bk(cx, lab, col) { k6_beaker(cx, 236, 150, 170, .78, col); TB(lab, cx, 258, BLUE_D, 13); }
    bk(120, 'eau 1,00 g/cm³', 'rgba(120,170,230,.35)'); bk(340, 'solution salée 1,20 g/cm³', 'rgba(60,120,200,.5)');
    var top = 236 - 170 * .78 + 16;
    [[120, [['PP 0,90', 0], ['PEHD 0,95', 0]], [['PS 1,05', 1], ['PET 1,38', 1]]], [340, [['PP 0,90', 0], ['PEHD 0,95', 0], ['PS 1,05', 0]], [['PET 1,38', 1]]]].forEach(function (b) {
      b[1].forEach(function (c, i) { k3_chip(b[0], top + 4 + i * 28, c[0], c[0].indexOf('PS') === 0 ? RED : BLUE_D, p > 0 && c[0].indexOf('PS') === 0); });
      b[2].forEach(function (c, i) { k3_chip(b[0], 220 - (b[2].length - 1 - i) * 28, c[0], c[0].indexOf('PS') === 0 ? RED : BLUE_D, p > 0 && c[0].indexOf('PS') === 0); });
    });
    if (p > 0) { ctx.globalAlpha = p; TB('PS : 1,00 < 1,05 < 1,20', W * .5, 22, DRED, 15); ctx.globalAlpha = 1; } else TB('quel plastique change de côté ?', W * .5, 22, GREY, 14);
  },
  /* 7 dosage du dibrome */
  function (p) {
    TB('0,20 mol/L de Br₂', W * .5, 22, BLUE_D, 14);
    k3_alk(40, 80, 20, 6, [0], BLUE); TB('hex-1-ène : 1 C=C', 90, 108, INK, 13); TB('0,0100 mol', 90, 126, GREY, 13);
    k3_alk(262, 80, 20, 6, [0, 4], BLUE); TB('hexa-1,5-diène : 2 C=C', 312, 108, INK, 13); TB('0,0100 mol', 312, 126, GREY, 13);
    var yb = 246, sc = 84 / 100;
    [[90, 50], [312, 100]].forEach(function (b) {
      ctx.strokeStyle = GREY; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.strokeRect(b[0] - 24, yb - 100 * sc, 48, 100 * sc); ctx.setLineDash([]);
      ctx.fillStyle = ORANGE; ctx.globalAlpha = .85; ctx.fillRect(b[0] - 24, yb - b[1] * sc * p, 48, b[1] * sc * p); ctx.globalAlpha = 1;
      if (p > .5) TB(b[1] + ' mL', b[0], yb - b[1] * sc * p - 8, DGREEN, 16); else TB('V = ?', b[0], yb - 100 * sc - 8, GREY, 14);
    });
    LN(40, yb, 400, yb, AX, 1.5);
  },
  /* 8 HBr sur le propène */
  function (p) {
    k3_alk(40, 74, 30, 3, [0], BLUE); TB('propène', 70, 110, BLUE_D, 13); TB('+ HBr', 160, 70, ORANGE, 18);
    TB('→', 220, 70, GREY, 28);
    var a = k3_alk(268, 130, 26, 3, null, INK, { 1: ['Br', p > 0 ? DGREEN : DRED] }); TB('2-bromopropane', 292, 160, p > 0 ? DGREEN : INK, 13);
    var b = k3_alk(268, 232, 26, 3, null, INK, { 0: ['Br', p > 0 ? GREY : DRED] }); TB('1-bromopropane', 292, 262, p > 0 ? GREY : INK, 13);
    if (p > 0) {
      ctx.globalAlpha = p; tag('majoritaire', 400, 114, DGREEN, 14); tag('minoritaire', 400, 232, GREY, 13);
      TB('Br sur le C central', 100, 190, DGREEN, 14); TB('(le plus substitué)', 100, 210, GREY, 13); ctx.globalAlpha = 1;
    } else TB('où va Br ?', 100, 200, GREY, 18);
  },
  /* 9 but-2-ène → butanone */
  function (p) {
    var xs = [W * .17, W * .5, W * .83], s = 24, fm = ['C₄H₈', 'C₄H₁₀O', 'C₄H₈O'], nm = ['but-2-ène', 'butan-2-ol', 'butanone'], L = ['A', 'B', 'C'];
    for (var i = 0; i < 3; i++) {
      ctx.strokeStyle = AX; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(xs[i] - 66, 40, 132, 160, 10); ctx.stroke();
      TB(L[i], xs[i], 62, BLUE_D, 22); TB(fm[i], xs[i], 84, ORANGE, 16);
      ctx.globalAlpha = 1 - p; TB('?', xs[i], 150, GREY, 40); ctx.globalAlpha = p;
      if (i === 0) k3_alk(xs[i] - 36, 162, s, 4, [1], BLUE);
      else k6_m(xs[i] - 36, 162, s, 4, i === 1 ? 'ol' : 'one', 1, ORA2);
      TB(nm[i], xs[i], 190, DGREEN, 13); ctx.globalAlpha = 1;
    }
    A(xs[0] + 70, 108, 56, 0, BLUE, '', 2.6); A(xs[1] + 70, 108, 56, 0, BLUE, '', 2.6);
    TB('+ H₂O', (xs[0] + xs[1]) / 2 + 4, 94, BLUE_D, 13); TB('[O]', (xs[1] + xs[2]) / 2 + 4, 94, BLUE_D, 13);
    TB('décolore Br₂', xs[0], 222, GREY, 13); TB('alcool secondaire', xs[1], 222, GREY, 13); TB('Fehling −', xs[2], 222, GREY, 13);
    k6_cap('M(C) = 72 g/mol', p > 0 ? DGREEN : GREY, 262);
  },
  /* 10 fabriquer 38,4 kg de PET */
  function (p) {
    var yb = 232, sc = 160 / 45.6, x1 = 100, x2 = 300;
    TB('conservation de la masse (kg)', W * .5, 22, BLUE_D, 14);
    LN(50, yb, 420, yb, AX, 1.5);
    var a = 33.2 * sc * p, b = 12.4 * sc * p, c = 38.4 * sc * p, d = 7.2 * sc * p;
    ctx.globalAlpha = .88; ctx.fillStyle = ORA2; ctx.fillRect(x1 - 40, yb - a, 80, a); ctx.fillStyle = BLUE; ctx.fillRect(x1 - 40, yb - a - b, 80, b);
    ctx.fillStyle = VIOLET; ctx.fillRect(x2 - 40, yb - c, 80, c); ctx.fillStyle = '#8ec3ee'; ctx.fillRect(x2 - 40, yb - c - d, 80, d); ctx.globalAlpha = 1;
    TB('monomères', x1, yb + 20, INK, 13); TB('produits', x2, yb + 20, INK, 13);
    TB('→', 200, yb - 70, GREY, 30);
    if (p > .55) {
      ctx.globalAlpha = k6_rev(p, .55, 1); TB('33,2 acide', x1, yb - a / 2 + 4, '#fff', 14); TB('12,4 diol', x1, yb - a - b / 2 + 4, '#fff', 14);
      TB('38,4 PET', x2, yb - c / 2 + 4, '#fff', 14); TB('7,2 eau', x2, yb - c - d / 2 + 5, BLUE_D, 14); TB('45,6 = 38,4 + 7,2', W * .5, 262, DGREEN, 15); ctx.globalAlpha = 1;
    } else TB('masses à trouver', W * .5, 130, GREY, 16);
  }
]);
