/* Physique 6e · chapitre 3 : Induction électromagnétique (aides ph_* : voir theo-01.js, theo-02.js) */
function ph3_loop(cx, cy, a, th, col) { /* spire vue de côté : tourne autour de l'axe vertical, th = angle entre la normale et B (horizontal) */
  var rx = Math.max(3, a * .55 * Math.abs(Math.sin(th))); ctx.strokeStyle = col || ORANGE; ctx.lineWidth = 4;
  ctx.fillStyle = 'rgba(186,117,23,.12)'; ctx.beginPath(); ctx.ellipse(cx, cy, rx, a, 0, 0, 7); ctx.fill(); ctx.stroke(); LN(cx, cy - a - 14, cx, cy + a + 14, GREY, 1.5, [4, 4]);
}
function ph3_meter(x, y, r, v, lab) { /* galvanomètre à zéro central, v dans [-1,1] */
  DOT(x, y, r, '#fff'); ph_circ(x, y, r, INK); ctx.strokeStyle = GREY; ctx.lineWidth = 1.2;
  for (var k = -4; k <= 4; k++) { var a = -Math.PI / 2 + k * .3; LN(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95, GREY, 1.2); }
  var an = -Math.PI / 2 + v * 1.2; LN(x, y + r * .25, x + Math.cos(an) * r * .85, y + r * .25 + Math.sin(an) * r * .85 - r * .25 * 0, RED, 2.6); DOT(x, y + r * .25, 3, INK); TB(lab || 'V', x, y + r * .72, INK, 13);
}

SFA.theo("c03", {
  icon: function () {
    ph_coil(W * .22, W * .55, H * .4, H * .17, 8); ph_mag(W * .75, H * .4, W * .2, H * .12, true); A(W * .62, H * .56, 52, 0, GREEN, '', 3);
    tag('e = − N·ΔΦ / Δt', W * .5, H * .86, BLUE_D, 22);
  },
  sub: [
    { t: "Flux, Faraday et Lenz",
      anim: function (t) {
        var w = t * .02, mx = W * .3 + W * .13 * Math.sin(w), v = Math.cos(w), cx = W * .6, cy = H * .55, R = H * .2;
        ph_coil(cx - W * .09, cx + W * .09, cy, R, 7);
        ph_mag(mx, cy, W * .2, H * .12, true);
        A(mx, cy - H * .15, v * 46, 0, GREEN, '', 3); TB(Math.abs(v) < .12 ? 'v ≈ 0' : 'v', mx, cy - H * .22, DGREEN, 14);
        if (v > .12) { tag('face N : repousse', cx - W * .09, cy + R + 22, DRED, 14); } else if (v < -.12) { tag('face S : retient', cx - W * .09, cy + R + 22, BLUE_D, 14); }
        ph3_meter(W * .87, H * .3, H * .16, -v, 'e');
        LN(cx + W * .09, cy - R, W * .87 - 4, cy - R, INK, 2); LN(W * .87 - 4, cy - R, W * .87 - 4, H * .3 + H * .16, INK, 2);
        TB(Math.abs(v) < .12 ? 'aimant arrêté : e = 0' : 'flux qui varie : e ≠ 0', W * .5, H * .1, Math.abs(v) < .12 ? GREY : DGREEN, 16);
        TB('e = − N · ΔΦ / Δt', W * .5, H * .93, BLUE_D, 18);
      },
      th: '<div class="tcard"><b class="h">Le flux magnétique</b><p>Le flux de B à travers une spire d\'aire S vaut <b>Φ = B·S·cos α</b>, où α est l\'angle entre B et la <b>normale</b> à la spire. Unité : le <b>weber</b> (1 Wb = 1 T·m²). Il est maximal quand la spire est perpendiculaire à B (α = 0) et nul quand son plan est parallèle à B (α = 90°). Pour N spires, le flux total est N·Φ.</p><p>Exemples : S = 50 cm² = 5,0·10<sup>−3</sup> m², B = 0,20 T, α = 0 : Φ = <b>1,0·10<sup>−3</sup> Wb</b>. Spire de 100 cm² à α = 60° dans 0,30 T : Φ = 0,30 × 0,010 × 0,5 = <b>1,5·10<sup>−3</sup> Wb</b>.</p></div>' +
        '<div class="tcard"><b class="h">La loi de Faraday</b><p>Quand le flux à travers un circuit varie, il apparaît une <b>force électromotrice induite</b> :</p><p style="text-align:center"><b>e = − N · ΔΦ / Δt</b> (valeur moyenne ; instantanément e = −N·dΦ/dt)</p><p>Ce n\'est pas le flux qui compte mais sa <b>variation</b> : un aimant immobile, même très puissant, n\'induit rien. Le flux peut varier parce que B change, que S change ou que l\'angle α change. Plus la variation est rapide, plus la tension est grande : le produit |e|·Δt = N·ΔΦ reste constant.</p><p>Exemple : N = 200, ΔΦ = 4,0·10<sup>−4</sup> Wb en 0,020 s : |e| = 200 × 4,0·10<sup>−4</sup> / 0,020 = <b>4,0 V</b>. En allant deux fois plus vite : 8,0 V.</p></div>' +
        '<div class="tcard"><b class="h">La loi de Lenz</b><p>Le courant induit a un <b>sens tel que ses effets s\'opposent à la cause qui lui donne naissance</b> (le signe « − » de la loi de Faraday). Approcher un pôle Nord d\'une bobine : le flux augmente, la bobine crée une face Nord en regard, qui <b>repousse</b> l\'aimant. L\'éloigner : le flux diminue, la face voisine devient un pôle Sud qui <b>attire</b> l\'aimant et freine son éloignement. Il faut donc fournir un travail : l\'énergie mécanique se transforme en énergie électrique (conservation de l\'énergie).</p><p><b>Piège</b> : Lenz ne dit pas que l\'induit « annule » le flux, mais qu\'il s\'oppose à sa <i>variation</i>.</p></div>' +
        '<div class="tcard"><b class="h">Courants de Foucault</b><p>Dans un conducteur massif (plaque, tube de cuivre), la variation de flux crée des courants induits qui tournent en boucles. D\'après Lenz, ils <b>freinent</b> le mouvement et <b>chauffent</b> le métal par effet Joule. Un aimant lâché dans un tube de cuivre atteint ainsi une <b>vitesse limite</b> quand la force de freinage (qui croît avec v) égale son poids : à 0,15 m/s pour un aimant de 20 g, la force vaut 0,196 N et la puissance dissipée environ 29 mW. Applications : freins de camion et de train, plaques à induction ; on lamelle les noyaux des transformateurs pour les limiter.</p></div>'
    },
    { t: "L'alternateur",
      anim: function (t) {
        var th = t * .03, cx = W * .27, cy = H * .5, a = H * .27;
        ctx.fillStyle = '#fcebeb'; ctx.fillRect(W * .03, cy - a - 10, W * .07, 2 * a + 20); ctx.fillStyle = '#e6f1fb'; ctx.fillRect(W * .44, cy - a - 10, W * .07, 2 * a + 20);
        TB('N', W * .065, cy + 8, DRED, 22); TB('S', W * .475, cy + 8, BLUE_D, 22);
        for (var k = -2; k <= 2; k++) A(W * .11, cy + k * a * .4, W * .32 - 6, 0, '#b9d4f2', '', 1.5);
        ph3_loop(cx, cy, a * .85, th);
        var gx = W * .6, gw = W * .36, gy = cy, ga = H * .3; ph_axes(gx, gy, gw + 10, ga + 10, 't', 'e');
        ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; ctx.beginPath(); for (var i = 0; i <= gw; i += 2) { var yy = gy - ga * Math.sin(i / gw * 2 * Math.PI); i ? ctx.lineTo(gx + i, yy) : ctx.moveTo(gx + i, yy); } ctx.stroke();
        var ph = th % (2 * Math.PI), px = gx + ph / (2 * Math.PI) * gw, py = gy - ga * Math.sin(ph); LN(px, gy, px, py, GREY, 1.3, [3, 3]); DOT(px, py, 6, ORA2);
        TB('e = N·B·S·ω·sin(ωt)', W * .78, H * .1, BLUE_D, 16); TB('50 tours/s → 50 Hz', W * .78, H * .93, INK, 14); TB('spire en rotation', cx, H * .95, GREY, 13);
      },
      th: '<div class="tcard"><b class="h">Principe</b><p>Une bobine de N spires d\'aire S tourne à la fréquence f (ω = 2π·f) dans un champ uniforme B. Le flux Φ = B·S·cos(ωt) varie sinusoïdalement, donc la tension induite aussi :</p><p style="text-align:center"><b>e(t) = N·B·S·ω·sin(ωt)</b> avec <b>e<sub>max</sub> = N·B·S·2π·f</b></p><p>La fréquence de la tension est celle de la rotation : 50 tours par seconde (3 000 tours/min) donnent 50 Hz, période T = 1/f = 20 ms.</p></div>' +
        '<div class="tcard"><b class="h">Valeur efficace</b><p>La valeur efficace est celle d\'une tension continue qui chaufferait autant : <b>e<sub>eff</sub> = e<sub>max</sub> / √2</b>. Exemple : N = 250, S = 150 cm² = 0,015 m², B = 0,12 T, f = 50 Hz : e<sub>max</sub> = 250 × 0,12 × 0,015 × 2π × 50 ≈ <b>141 V</b>, e<sub>eff</sub> ≈ 100 V.</p><p>Pour obtenir 325 V de maximum (230 V efficaces) avec B = 0,40 T et S = 200 cm² = 0,020 m² à 50 Hz : N = 325 / (0,40 × 0,020 × 314) ≈ <b>130 spires</b>.</p></div>' +
        '<div class="tcard"><b class="h">Pour augmenter la tension</b><p>Il y a quatre leviers : plus de spires N, un champ B plus fort, une plus grande aire S, une rotation plus rapide (f). Dans une centrale, la turbine (vapeur, eau, vent) fournit la puissance mécanique ; l\'alternateur la convertit en puissance électrique, et la loi de Lenz explique que plus on débite de courant, plus il est « dur » à faire tourner.</p><p><b>Pièges</b> : toujours convertir les cm² en m² ; ω = 2π·f en rad/s ; ne pas confondre e<sub>max</sub> et e<sub>eff</sub>.</p></div>'
    }
  ]
});

SFA.figs("c03", [
  /* 0 · flux d'une spire de 50 cm² dans 0,20 T */
  function (p) {
    var cx = W * .45, cy = H * .52, rx = W * .1, ry = H * .28;
    for (var k = -2; k <= 2; k++) A(W * .06, cy + k * ry * .42, W * .86, 0, '#b9d4f2', '', 1.6);
    ctx.fillStyle = 'rgba(186,117,23,.14)'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill(); ctx.stroke();
    A(cx, cy, W * .14, 0, DGREEN, 'n', 3); TB('B = 0,20 T', W * .08, H * .12, BLUE_D, 15, 'left'); TB('S = 50 cm²', cx, cy + ry + 22, ORANGE, 15);
    ph_fade(p, 0, function () { tag('Φ = B·S = 1,0 mWb', W * .74, H * .22, DGREEN, 17); });
  },
  /* 1 · aimant immobile dans une bobine */
  function (p) {
    var x1 = W * .12, x2 = W * .56, cy = H * .55, R = H * .21;
    ph_coil(x1, x2, cy, R, 9); ph_mag((x1 + x2) / 2, cy, W * .3, H * .13); TB('aimant immobile', (x1 + x2) / 2, cy + R + 26, INK, 14);
    LN(x2, cy - R, W * .8, cy - R, INK, 2); LN(W * .8, cy - R, W * .8, H * .36, INK, 2); LN(x1, cy + R, x1, H * .93, INK, 2); LN(x1, H * .93, W * .8, H * .93, INK, 2); LN(W * .8, H * .93, W * .8, H * .64, INK, 2);
    ph3_meter(W * .8, H * .5, H * .14, 0, 'V');
    ph_fade(p, 0, function () { tag('ΔΦ = 0  ⇒  e = 0 V', W * .5, H * .12, DGREEN, 18); });
  },
  /* 2 · loi de Faraday : graphe Φ(t) */
  function (p) {
    var x0 = W * .14, y0 = H * .8, w = W * .76, h = H * .62, X = function (t) { return x0 + t / 25 * w; }, Y = function (f) { return y0 - f / .5 * h; };
    ph_axes(x0, y0, w + 8, h + 8, 't (ms)', 'Φ (mWb)');
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(20), Y(.4)); ctx.stroke(); LN(X(20), Y(.4), X(25), Y(.4), BLUE, 3.5);
    LN(X(20), y0, X(20), Y(.4), GREY, 1.3, [4, 4]); LN(x0, Y(.4), X(20), Y(.4), GREY, 1.3, [4, 4]); TB('20', X(20), y0 + 17, INK, 13); TB('0,40', x0 - 6, Y(.4) + 4, INK, 13, 'right');
    TB('N = 200 spires', W * .45, H * .08, GREY, 14, 'left');
    ph_fade(p, 0, function () { tag('pente = ΔΦ/Δt', X(16), Y(.2), ORA2, 15); tag('|e| = N·ΔΦ/Δt = 4,0 V', W * .62, H * .72, DGREEN, 17); });
  },
  /* 3 · spire inclinée : normale à 60° de B */
  function (p) {
    var ox = W * .42, oy = H * .52, a = H * .32, ang = Math.PI / 3;
    for (var k = -2; k <= 2; k++) A(W * .05, oy + k * a * .5, W * .6, 0, '#c4d9f0', '', 1.5);
    var nx = Math.cos(-ang), ny = Math.sin(-ang);
    LN(ox - ny * a, oy + nx * a, ox + ny * a, oy - nx * a, ORANGE, 6); A(ox, oy, nx * 78, ny * 78, DGREEN, 'n', 3.4);
    ph_arc(ox, oy, 46, 0, -ang, INK, 2); TB('60°', ox + 62, oy - 16, INK, 14); TB('B = 0,30 T', W * .06, H * .08, BLUE_D, 14, 'left'); TB('S = 100 cm²', ox - 6, oy + a + 18, ORANGE, 14, 'right');
    ph_fade(p, 0, function () { tag('Φ = B·S·cos 60° = 1,5 mWb', W * .76, H * .3, DGREEN, 15); tag('plan ∥ B : Φ = 0', W * .76, H * .72, GREY, 15); });
  },
  /* 4 · on éloigne un pôle Nord */
  function (p) {
    var x1 = W * .08, x2 = W * .38, cy = H * .5, R = H * .2;
    ph_coil(x1, x2, cy, R, 6); ph_mag(W * .74, cy, W * .3, H * .14, true); A(W * .74, cy - H * .16, W * .16, 0, GREEN, 'v', 3.2);
    TB('on éloigne le pôle N', W * .74, cy + H * .26, INK, 14);
    ph_fade(p, 0, function () { DOT(x2 + 22, cy, 15, '#e6f1fb'); ph_circ(x2 + 22, cy, 15, BLUE); TB('S', x2 + 22, cy + 6, BLUE_D, 17); tag('face S : attire l’aimant', W * .5, H * .12, BLUE_D, 16); A(x2 + 40, cy, 36, 0, '#cfd6de', '', 2.5); });
  },
  /* 5 · tension d'un alternateur */
  function (p) {
    var x0 = W * .1, y0 = H * .52, w = W * .8, A0 = H * .32, X = function (t) { return x0 + t / 40 * w; };
    ph_axes(x0, y0, w + 6, A0 + 14, 't (ms)', 'e (V)');
    LN(x0, y0 + A0 + 10, x0, y0, INK, 1.8);
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3; ctx.beginPath(); for (var t = 0; t <= 40.01; t += .5) { var q = ctx.lineTo(X(t), y0 - A0 * Math.sin(2 * Math.PI * t / 20)); } ctx.stroke();
    LN(x0, y0 - A0, X(5), y0 - A0, GREY, 1.3, [4, 4]); TB('141 V', x0 + 4, y0 - A0 - 6, BLUE_D, 14, 'left');
    ph_fade(p, 0, function () { var ye = y0 - A0 * .7071; LN(x0, ye, x0 + w, ye, DGREEN, 2, [6, 4]); tag('e_eff ≈ 100 V', X(30), ye - 16, DGREEN, 15); ph_dim(X(0), y0 + A0 + 4, X(20), y0 + A0 + 4, 'T = 20 ms', GREY, 0); });
    TB('250 spires · 50 Hz', W * .62, H * .1, GREY, 14);
  },
  /* 6 · alternateur : 325 V, 3 000 tr/min */
  function (p) {
    var cx = W * .38, cy = H * .5, a = H * .27;
    ctx.fillStyle = '#fcebeb'; ctx.fillRect(W * .04, cy - a - 8, W * .07, 2 * a + 16); ctx.fillStyle = '#e6f1fb'; ctx.fillRect(W * .65, cy - a - 8, W * .07, 2 * a + 16);
    TB('N', W * .075, cy + 8, DRED, 22); TB('S', W * .685, cy + 8, BLUE_D, 22); for (var k = -2; k <= 2; k++) A(W * .12, cy + k * a * .4, W * .52 - 6, 0, '#b9d4f2', '', 1.5);
    ph3_loop(cx, cy, a * .85, .75); ph_arc(cx, cy + a + 30, 26, 0, 4.6, ORA2, 3); ph_head(cx + 26, cy + a + 30, 0, -1, ORA2, 8);
    LN(cx, cy + a + 14, cx, cy + a + 32, GREY, 2);
    TB('3 000 tr/min', cx + 40, cy + a + 36, ORA2, 14, 'left'); TB('B = 0,40 T · 200 cm² · 50 Hz', W * .5, H * .08, GREY, 14);
    ph_fade(p, 0, function () { tag('N ≈ 130 spires', W * .84, H * .35, DGREEN, 16); tag('e_max = 325 V', W * .84, H * .5, BLUE_D, 15); tag('e_eff = 230 V', W * .84, H * .65, BLUE_D, 15); });
  },
  /* 7 · aimant dans un tube de cuivre : vitesse limite */
  function (p) {
    var tx1 = W * .3, tx2 = W * .52, y1 = H * .05, y2 = H * .95, my = H * .5;
    ctx.fillStyle = 'rgba(205,127,50,.35)'; ctx.fillRect(tx1, y1, 10, y2 - y1); ctx.fillRect(tx2 - 10, y1, 10, y2 - y1); ctx.strokeStyle = ORANGE; ctx.lineWidth = 2; ctx.strokeRect(tx1, y1, 10, y2 - y1); ctx.strokeRect(tx2 - 10, y1, 10, y2 - y1);
    TB('tube de cuivre', tx2 + 14, y1 + 24, ORANGE, 14, 'left');
    [-1, 1].forEach(function (s) { var yy = my + s * H * .2; ctx.strokeStyle = DRED; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse((tx1 + tx2) / 2, yy, (tx2 - tx1) / 2 - 2, 8, 0, 0, 7); ctx.stroke(); });
    ctx.save(); ctx.translate((tx1 + tx2) / 2, my); ctx.fillStyle = '#fcebeb'; ctx.fillRect(-18, -34, 36, 34); ctx.fillStyle = '#e6f1fb'; ctx.fillRect(-18, 0, 36, 34); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(-18, -34, 36, 68); TB('N', 0, -10, DRED, 16); TB('S', 0, 24, BLUE_D, 16); ctx.restore();
    var mx = (tx1 + tx2) / 2; A(mx, my + 36, 0, 58, GREEN, '', 4); TB('P', mx + 14, my + 82, DGREEN, 16, 'left');
    ph_fade(p, 0, function () { A(mx, my - 36, 0, -58 * p, RED, '', 4); TB('F', mx + 14, my - 72, DRED, 16, 'left'); A(W * .8, H * .3, 0, 50, BLUE, '', 3); TB('v constante', W * .8, H * .3 - 12, BLUE_D, 14); tag('F = P', W * .8, H * .72, DGREEN, 20); });
  },
  /* 8 · variation totale de flux : e(t) et aires égales */
  function (p) {
    var x0 = W * .1, y0 = H * .5, w = W * .86, k = H * .38 / 2.2, X = function (t) { return x0 + t / 95 * w; }, Y = function (e) { return y0 - e * k; };
    ph_axes(x0, y0, w + 6, H * .42, 't (ms)', 'e (V)'); LN(x0, y0, x0, y0 + H * .4, INK, 1.8);
    [[0, 25, .96, BLUE, '0,96 V'], [40, 52.5, 1.92, VIOLET, '1,92 V'], [65, 90, -.96, RED, '−0,96 V']].forEach(function (b) {
      ctx.fillStyle = b[3] + (p > 0 ? '44' : '1a'); ctx.fillRect(X(b[0]), Math.min(Y(0), Y(b[2])), X(b[1]) - X(b[0]), Math.abs(Y(b[2]) - Y(0))); ctx.strokeStyle = b[3]; ctx.lineWidth = 2.5; ctx.strokeRect(X(b[0]), Math.min(Y(0), Y(b[2])), X(b[1]) - X(b[0]), Math.abs(Y(b[2]) - Y(0)));
      tag(b[4], (X(b[0]) + X(b[1])) / 2, b[2] > 0 ? Y(b[2]) - 16 : Y(b[2]) + 20, b[3] === BLUE ? BLUE_D : b[3] === RED ? DRED : VIO_D, 14); });
    ph_fade(p, 0, function () { tag('aires égales : e·Δt = N·ΔΦ = 0,024 V·s', W * .5, H * .93, DGREEN, 15); });
    TB('25 ms', X(12.5), y0 + 18, GREY, 12); TB('12,5 ms', X(46), y0 + 18, GREY, 12); TB('25 ms', X(77.5), y0 - 8, GREY, 12);
  },
  /* 9 · bilan d'énergie : l'énergie potentielle part en chaleur */
  function (p) {
    var x0 = W * .06, w = W * .88, y = [H * .2, H * .46, H * .72];
    TB('énergie potentielle perdue : m·g·h', x0, y[0] - 20, INK, 14, 'left'); ctx.fillStyle = '#bfe3d3'; ctx.fillRect(x0, y[0] - 12, w, 28); TB('0,118 J', x0 + w / 2, y[0] + 8, DGREEN, 16);
    ph_fade(p, 0, function () {
      TB('chaleur dans le tube', x0, y[1] - 20, INK, 14, 'left'); ctx.fillStyle = '#f3c89c'; ctx.fillRect(x0, y[1] - 12, w * ph_a(p, 0, .7), 28); if (p > .7) TB('≈ 0,118 J', x0 + w / 2, y[1] + 8, ORANGE, 16);
      TB('énergie cinétique finale', x0, y[2] - 20, INK, 14, 'left'); ctx.fillStyle = BLUE; ctx.fillRect(x0, y[2] - 12, 3, 28); TB('2,3·10⁻⁴ J : négligeable', x0 + 14, y[2] + 8, BLUE_D, 15, 'left');
      tag('F = m·g = 0,196 N · P ≈ 29 mW', W * .5, H * .92, RED, 15); });
    if (p <= 0) TB('chaleur ? Ec ?', W * .5, H * .68, GREY, 17);
  }
]);
