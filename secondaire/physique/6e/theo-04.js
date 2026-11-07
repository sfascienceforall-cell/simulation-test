/* Physique 6e · chapitre 4 : Courant alternatif, transformateur et réseau (aides ph_* : voir theo-01.js) */
function ph4_scope(x, y, w, h) { /* écran d'oscilloscope 10 × 8 divisions */
  ctx.fillStyle = '#10261e'; ctx.beginPath(); ctx.roundRect(x - 6, y - 6, w + 12, h + 12, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(120,220,160,.28)'; ctx.lineWidth = 1;
  for (var i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(x + i * w / 10, y); ctx.lineTo(x + i * w / 10, y + h); ctx.stroke(); }
  for (var j = 0; j <= 8; j++) { ctx.beginPath(); ctx.moveTo(x, y + j * h / 8); ctx.lineTo(x + w, y + j * h / 8); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(120,220,160,.6)'; ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
  return { dx: w / 10, dy: h / 8, cy: y + h / 2 };
}
function ph4_trace(x, cy, w, dx, dy, amp, per, ph, col) { /* trace sinusoïdale : amp en div, per en div */
  ctx.strokeStyle = col || '#6dff9f'; ctx.lineWidth = 3; ctx.shadowColor = col || '#6dff9f'; ctx.shadowBlur = 6; ctx.beginPath();
  for (var i = 0; i <= w; i += 2) { var yy = cy - amp * dy * Math.sin(2 * Math.PI * (i / dx) / per + (ph || 0)); i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x + i, yy); } ctx.stroke(); ctx.shadowBlur = 0;
}
function ph4_trafo(cx, cy, w, h, n1, n2, flux) { /* noyau feuilleté + deux bobines ; flux = déplacement (−1..1) des flèches dans le noyau */
  var xo1 = cx - w / 2, xo2 = cx + w / 2, yo1 = cy - h / 2, yo2 = cy + h / 2, lg = w * .16;
  ctx.fillStyle = '#d9dde2'; ctx.fillRect(xo1, yo1, w, h); ctx.fillStyle = '#fff'; ctx.fillRect(xo1 + lg, yo1 + lg, w - 2 * lg, h - 2 * lg); ctx.strokeStyle = GREY; ctx.lineWidth = 2; ctx.strokeRect(xo1, yo1, w, h); ctx.strokeRect(xo1 + lg, yo1 + lg, w - 2 * lg, h - 2 * lg);
  [[xo1 + lg / 2, n1, BLUE_D], [xo2 - lg / 2, n2, DGREEN]].forEach(function (c) { var n = c[1], y0 = cy - h * .3, dy = h * .6 / Math.max(1, n - 1); for (var i = 0; i < n; i++) LN(c[0] - lg / 2 - 7, y0 + i * dy, c[0] + lg / 2 + 7, y0 + i * dy, c[2], 3.5); });
  if (flux !== undefined) { var mx = xo1 + lg / 2, my = yo1 + lg / 2, Mx = xo2 - lg / 2, My = yo2 - lg / 2, per = 2 * (Mx - mx) + 2 * (My - my);
    for (var k = 0; k < 8; k++) { var s = (((k / 8 + flux * .06) % 1) + 1) % 1 * per, x, y, dx = 0, dy = 0;
      if (s < Mx - mx) { x = mx + s; y = my; dx = 1; } else if (s < Mx - mx + My - my) { x = Mx; y = my + s - (Mx - mx); dy = 1; } else if (s < 2 * (Mx - mx) + My - my) { x = Mx - (s - (Mx - mx) - (My - my)); y = My; dx = -1; } else { x = mx; y = My - (s - 2 * (Mx - mx) - (My - my)); dy = -1; }
      ph_head(x, y, dx * (flux >= 0 ? 1 : -1), dy * (flux >= 0 ? 1 : -1), ORA2, 7); } }
  return { xl: xo1 + lg / 2, xr: xo2 - lg / 2, top: yo1, bot: yo2 };
}
function ph4_pyl(x, y, s, col) { ctx.strokeStyle = col || INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - s * .4, y + s); ctx.lineTo(x, y); ctx.lineTo(x + s * .4, y + s); ctx.moveTo(x - s * .6, y + s * .25); ctx.lineTo(x + s * .6, y + s * .25); ctx.moveTo(x - s * .5, y + s * .6); ctx.lineTo(x + s * .5, y + s * .6); ctx.stroke(); }

SFA.theo("c04", {
  icon: function () {
    var x0 = W * .08, w = W * .84, y0 = H * .42; LN(x0, y0, x0 + w, y0, AX, 1.5); sinCurve(x0, y0, w, H * .26, 2 * Math.PI * 2 / w, 0, BLUE, 3.5);
    tag('230 V · 50 Hz', W * .5, H * .86, BLUE_D, 24);
  },
  sub: [
    { t: "Tension alternative et oscilloscope",
      anim: function (t) {
        var sx = W * .06, sy = H * .08, sw = W * .66, sh = H * .78, S = ph4_scope(sx, sy, sw, sh), ph = -t * .03;
        ph4_trace(sx, S.cy, sw, S.dx, S.dy, 3, 4, ph, '#6dff9f');
        LN(sx, S.cy - 3 * S.dy, sx + sw, S.cy - 3 * S.dy, '#ffd166', 1.5, [5, 4]); LN(sx, S.cy - 3 * S.dy * .7071, sx + sw, S.cy - 3 * S.dy * .7071, '#ff9f9f', 1.5, [5, 4]);
        TB('U max', sx + 8, S.cy - 3 * S.dy - 5, '#ffd166', 13, 'left'); TB('U eff', sx + sw - 8, S.cy - 2.1 * S.dy - 5, '#ff9f9f', 13, 'right');
        TB('T', sx + S.dx * 2, S.cy + S.dy * 3.6, '#fff', 14); TB('U = U max · sin(2π·f·t)', W * .85, H * .22, BLUE_D, 14); TB('f = 1 / T', W * .85, H * .4, INK, 18);
        TB('U eff = U max / √2', W * .85, H * .58, DRED, 15); TB('230 V · 50 Hz', W * .85, H * .76, DGREEN, 16); TB('(325 V max, T = 20 ms)', W * .85, H * .87, GREY, 12);
      },
      th: '<div class="tcard"><b class="h">Tension sinusoïdale</b><p>La tension du réseau s\'écrit u(t) = U<sub>max</sub>·sin(2π·f·t). Elle est caractérisée par son <b>amplitude</b> U<sub>max</sub>, sa <b>période</b> T (durée d\'une oscillation complète) et sa <b>fréquence</b> <b>f = 1/T</b>. En Belgique : f = 50 Hz, donc T = 1/50 = 20 ms.</p><p>La <b>valeur efficace</b> est celle d\'une tension continue qui produirait le même échauffement dans une résistance : <b>U<sub>eff</sub> = U<sub>max</sub>/√2</b> ≈ 0,707·U<sub>max</sub>. Les voltmètres et ampèremètres alternatifs affichent des valeurs efficaces. La prise annoncée à 230 V a donc U<sub>max</sub> = 230 × √2 ≈ <b>325 V</b> (et 650 V crête à crête).</p></div>' +
        '<div class="tcard"><b class="h">Lire un oscilloscope</b><p>L\'écran est quadrillé en divisions. Horizontalement, la <b>base de temps</b> (ms/div) ; verticalement la <b>sensibilité</b> (V/div).</p><p>• Période : T = (nombre de divisions pour un cycle) × (base de temps). Ex. 4 div × 5 ms/div = 20 ms, donc f = 1/0,020 = <b>50 Hz</b>.<br>• Amplitude : U<sub>max</sub> = (divisions de l\'axe à la crête) × (sensibilité). Ex. 3,2 div × 5 V/div = <b>16 V</b>, crête à crête 32 V, U<sub>eff</sub> = 16/√2 ≈ 11,3 V.</p><p><b>Pièges</b> : ne pas lire la crête à crête comme l\'amplitude ; ne pas oublier de convertir ms en s pour f en Hz.</p></div>'
    },
    { t: "Transformateur",
      anim: function (t) {
        var w = t * .05, f = Math.sin(w), cx = W * .4, cy = H * .5;
        var G = ph4_trafo(cx, cy, W * .34, H * .52, 14, 4, Math.cos(w) * 1.5);
        TB('N₁ grand', G.xl, G.bot + 22, BLUE_D, 14); TB('N₂ petit', G.xr, G.bot + 22, DGREEN, 14);
        var gx = W * .02, gy = H * .17, hh = H * .1; LN(gx, gy, gx + W * .2, gy, AX, 1); sinCurve(gx, gy, W * .2, hh, 2 * Math.PI / (W * .1), -w * .6, BLUE, 2.5); TB('u₁', gx + 4, gy - hh - 4, BLUE_D, 13, 'left');
        var hx = W * .62, hy = H * .17; LN(hx, hy, hx + W * .16, hy, AX, 1); sinCurve(hx, hy, W * .16, hh * .35, 2 * Math.PI / (W * .1), -w * .6, DGREEN, 2.5); TB('u₂', hx + 4, hy - hh * .35 - 4, DGREEN, 13, 'left');
        TB('U₂ / U₁ = N₂ / N₁', W * .83, H * .42, BLUE_D, 15); TB('= I₁ / I₂', W * .83, H * .55, DGREEN, 15); TB('flux variable', cx, cy + 4, ORA2, 14); TB('→ tension induite', cx, cy + 22, ORA2, 13);
        TB('seulement en alternatif', W * .5, H * .96, GREY, 13);
      },
      th: '<div class="tcard"><b class="h">Principe</b><p>Un transformateur est formé de deux bobines (N<sub>1</sub> spires au primaire, N<sub>2</sub> au secondaire) enroulées sur un <b>noyau de fer doux</b> feuilleté. Le courant alternatif du primaire crée un flux variable dans le noyau ; par induction (Faraday), ce flux fait apparaître une tension alternative au secondaire.</p><p style="text-align:center"><b>U<sub>2</sub>/U<sub>1</sub> = N<sub>2</sub>/N<sub>1</sub></b> (rapport de transformation) ; pour un transformateur idéal : <b>U<sub>1</sub>·I<sub>1</sub> = U<sub>2</sub>·I<sub>2</sub></b>, donc <b>I<sub>1</sub>/I<sub>2</sub> = N<sub>2</sub>/N<sub>1</sub></b>.</p><p>Si N<sub>2</sub> &lt; N<sub>1</sub> : <b>abaisseur</b> (tension réduite, courant augmenté) ; si N<sub>2</sub> &gt; N<sub>1</sub> : <b>élévateur</b>.</p></div>' +
        '<div class="tcard"><b class="h">Exemple chiffré</b><p>N<sub>1</sub> = 1 150, N<sub>2</sub> = 60, U<sub>1</sub> = 230 V : U<sub>2</sub> = 230 × 60/1 150 = <b>12 V</b>. Si le secondaire débite 2,0 A, le primaire absorbe I<sub>1</sub> = 2,0 × 60/1 150 ≈ <b>0,10 A</b> (la puissance, 24 W, est conservée).</p><p>Un chargeur réel de 10 W délivre 5,0 V avec un rendement de 85 % : P<sub>1</sub> = 10/0,85 ≈ 11,8 W, I<sub>1</sub> = 11,8/230 ≈ 0,051 A, et 1,8 W partent en chaleur.</p></div>' +
        '<div class="tcard"><b class="h">Limites et pièges</b><p>• Un transformateur ne fonctionne <b>qu\'en alternatif</b> : branché sur une pile (courant continu), le flux est constant, donc aucune tension n\'est induite au secondaire (on ne voit qu\'un bref signal à la connexion ou la déconnexion).<br>• Il ne crée pas d\'énergie : un élévateur augmente U mais diminue I.<br>• Pertes réelles : effet Joule dans les fils, courants de Foucault et hystérésis dans le noyau ; le rendement dépasse 95 % pour les gros transformateurs. Rendement η = P<sub>2</sub>/P<sub>1</sub>.</p></div>'
    },
    { t: "Transport et redressement",
      anim: function (t) {
        var mode = Math.floor(t / 320) % 2, y = H * .36, xa = W * .24, xb = W * .76, n = mode ? 5 : 16, sp = t * .9;
        ctx.fillStyle = '#eef4fb'; ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2; ctx.fillRect(W * .02, y - 22, W * .1, 44); ctx.strokeRect(W * .02, y - 22, W * .1, 44); TB('centrale', W * .07, y + 5, BLUE_D, 13);
        ctx.fillStyle = '#eef4fb'; ctx.fillRect(W * .88, y - 22, W * .1, 44); ctx.strokeRect(W * .88, y - 22, W * .1, 44); TB('ville', W * .93, y + 5, BLUE_D, 13);
        LN(W * .12, y, xa, y, INK, 3); LN(xb, y, W * .88, y, INK, 3); ph_circ(xa - 6, y, 11, BLUE_D); ph_circ(xa + 6, y, 11, BLUE_D); ph_circ(xb - 6, y, 11, BLUE_D); ph_circ(xb + 6, y, 11, BLUE_D);
        if (!mode) { ctx.fillStyle = 'rgba(226,75,74,.18)'; ctx.fillRect(xa + 18, y - 14, xb - xa - 36, 28); }
        LN(xa + 18, y, xb - 18, y, mode ? INK : DRED, 4);
        for (var i = 0; i < n; i++) { var x = xa + 18 + (((i / n) * (xb - xa - 36) + sp) % (xb - xa - 36)); DOT(x, y, mode ? 4 : 5, mode ? BLUE : ORA2); }
        TB(mode ? 'U très élevée : I faible' : 'U modérée : I élevée', W * .5, y - 40, mode ? DGREEN : DRED, 16);
        TB('P perdue = R · I²', W * .5, H * .66, INK, 18); TB(mode ? 'I ÷ 10  ⇒  pertes ÷ 100' : 'I élevée ⇒ forte chauffe de la ligne', W * .5, H * .8, mode ? DGREEN : DRED, 15);
        TB('I = P / U', W * .5, H * .93, BLUE_D, 16);
      },
      th: '<div class="tcard"><b class="h">Pourquoi la haute tension ?</b><p>Pour transporter une puissance P = U·I, on peut avoir une grande tension et un petit courant, ou l\'inverse. Or la ligne de résistance R dissipe par <b>effet Joule</b> : <b>P<sub>perdue</sub> = R·I² = R·(P/U)²</b>. Multiplier U par 10 divise I par 10 et les pertes par <b>100</b>.</p><p>Exemple : P = 50 MW, R = 8 Ω. À 25 kV : I = 2 000 A, P<sub>perdue</sub> = 32 MW (64 %). À 150 kV : I = 333 A, P<sub>perdue</sub> ≈ 0,89 MW (1,8 %).</p></div>' +
        '<div class="tcard"><b class="h">Le réseau</b><p>La centrale produit à une tension de quelques dizaines de kV ; un transformateur <b>élévateur</b> la porte à plusieurs centaines de kV (jusqu\'à 380 kV en Belgique) pour le transport sur de longues distances ; des transformateurs <b>abaisseurs</b> la ramènent par étapes à 230 V chez l\'utilisateur. Dimensionnement : pour une ville de 20 MW sur une ligne de 5,0 Ω, les pertes valent 0,20 MW (1 %) à 100 kV ; pour qu\'elles restent inférieures à 0,50 %, il faut U ≥ √(R·P/0,005) ≈ 141 kV. Énergie perdue en 24 h à 100 kV : 0,20 MW × 24 h = 4,8 MWh.</p></div>' +
        '<div class="tcard"><b class="h">Redressement et lissage</b><p>Une <b>diode</b> ne laisse passer le courant que dans un sens : une diode seule donne un redressement <b>simple alternance</b> ; un <b>pont de 4 diodes</b> redresse les deux alternances. La valeur moyenne de la tension redressée double alternance vaut <b>2·U<sub>max</sub>/π ≈ 0,64·U<sub>max</sub></b> (12 V max : 7,6 V).</p><p>Un <b>condensateur</b> en parallèle sur la charge « comble les creux » : l\'ondulation vaut ΔU ≈ U<sub>max</sub>/(2·f·R·C), valable si R·C ≫ T. Pour ΔU = 0,30 V avec U<sub>max</sub> = 12 V, f = 50 Hz, R = 100 Ω : C = 12/(2 × 50 × 100 × 0,30) = 4,0·10<sup>−3</sup> F = <b>4 000 µF</b>. L\'ondulation a la fréquence 2f = 100 Hz.</p><p><b>Pièges</b> : valeur moyenne ≠ valeur efficace ; une pile n\'alimente pas un transformateur.</p></div>'
    }
  ]
});

SFA.figs("c04", [
  /* 0 · 230 V efficaces → 325 V max */
  function (p) {
    var x0 = W * .09, w = W * .84, y0 = H * .5, A0 = H * .34;
    ph_axes(x0, y0, w + 8, A0 + 16, 't', 'u (V)'); LN(x0, y0, x0, y0 + A0 + 16, INK, 1.8);
    sinCurve(x0, y0, w, A0, 2 * Math.PI * 2 / w, 0, BLUE, 3.5);
    TB('prise : 230 V', W * .6, H * .08, GREY, 14);
    ph_fade(p, 0, function () { LN(x0, y0 - A0, x0 + w, y0 - A0, ORA2, 2, [6, 4]); LN(x0, y0 + A0, x0 + w, y0 + A0, ORA2, 2, [6, 4]); tag('+325 V', x0 + 40, y0 - A0 - 2, ORA2, 16); tag('−325 V', x0 + 40, y0 + A0 + 2, ORA2, 16); tag('U_max = 230·√2 = 325 V', W * .62, y0 + 4, DGREEN, 16); });
  },
  /* 1 · lire une période : 4 div à 5 ms/div */
  function (p) {
    var sx = W * .08, sy = H * .08, sw = W * .84, sh = H * .72, S = ph4_scope(sx, sy, sw, sh); ph4_trace(sx, S.cy, sw, S.dx, S.dy, 2.2, 4, 0);
    TB('5 ms/div', sx + 6, sy + sh + 28, GREY, 14, 'left');
    ph_fade(p, 0, function () { ph_dim(sx + S.dx * 0, sy + sh * .12, sx + S.dx * 4, sy + sh * .12, '4 div × 5 ms = 20 ms', '#ffd166', 0); tag('T = 20 ms  →  f = 50 Hz', W * .68, H * .93, DGREEN, 17); });
  },
  /* 2 · lire une amplitude : 3,2 div à 5 V/div */
  function (p) {
    var sx = W * .08, sy = H * .08, sw = W * .84, sh = H * .72, S = ph4_scope(sx, sy, sw, sh); ph4_trace(sx, S.cy, sw, S.dx, S.dy, 3.2, 5, 0);
    TB('5 V/div', sx + sw, sy + sh + 28, GREY, 14, 'right');
    ph_fade(p, 0, function () { var px = sx + S.dx * 1.25; A(px, S.cy, 0, -3.2 * S.dy * p, '#ffd166', '', 3); tag('U_max = 3,2 × 5 = 16 V', sx + S.dx * 3.9, S.cy - 3.2 * S.dy - 6 + 20, '#946a00', 15);
      tag('crête à crête 32 V', W * .55, H * .92, DGREEN, 15); tag('U_eff ≈ 11,3 V', W * .2, H * .92, BLUE_D, 15); });
  },
  /* 3 · chargeur abaisseur 1150 → 60 spires */
  function (p) {
    var cx = W * .5, cy = H * .5, G = ph4_trafo(cx, cy, W * .4, H * .56, 14, 4);
    TB('N₁ = 1 150', G.xl, G.top - 12, BLUE_D, 15); TB('N₂ = 60', G.xr, G.top - 12, DGREEN, 15); TB('U₁ = 230 V', W * .13, cy, BLUE_D, 15); TB('I₂ = 2,0 A', W * .87, cy + 24, DGREEN, 14);
    ph_fade(p, 0, function () { tag('U₂ = 12 V', W * .87, cy - 10, DGREEN, 18); tag('I₁ ≈ 0,10 A', W * .13, cy + 28, BLUE_D, 16); });
    if (p <= 0) TB('U₂ = ?', W * .87, cy - 4, GREY, 17);
  },
  /* 4 · transformateur sur une pile */
  function (p) {
    var cx = W * .5, cy = H * .5, G = ph4_trafo(cx, cy, W * .36, H * .54, 4, 12);
    LN(G.xl - 20, cy - 18, G.xl - 20, H * .12, INK, 2); LN(G.xl - 20, H * .12, W * .12, H * .12, INK, 2); LN(G.xl - 20, cy + 18, G.xl - 20, H * .88, INK, 2); LN(G.xl - 20, H * .88, W * .12, H * .88, INK, 2);
    LN(W * .12, H * .12, W * .12, H * .42, INK, 2); LN(W * .12, H * .58, W * .12, H * .88, INK, 2); LN(W * .09, H * .42, W * .15, H * .42, INK, 3); LN(W * .105, H * .47, W * .135, H * .47, INK, 3); TB('9 V =', W * .07, H * .56, BLUE_D, 15, 'left');
    ph3_meter(W * .86, cy, H * .15, 0, 'V');
    ph_fade(p, 0, function () { tag('flux constant', cx, cy + 4, ORA2, 14); tag('U₂ = 0 V', W * .86, H * .84, DGREEN, 18); });
  },
  /* 5 · haute tension : 25 kV ou 150 kV */
  function (p) {
    var x0 = W * .06, w = W * .88, rows = [[H * .27, '25 kV : I = 2 000 A', .64, '32 MW perdus (64 %)'], [H * .67, '150 kV : I = 333 A', .0178, '0,89 MW perdus (1,8 %)']];
    TB('50 MW envoyés, ligne de 8 Ω', W * .5, H * .08, GREY, 14);
    rows.forEach(function (r) { TB(r[1], x0, r[0] - 22, INK, 15, 'left'); ctx.fillStyle = '#d6efe4'; ctx.fillRect(x0, r[0] - 12, w, 30); ctx.strokeStyle = DGREEN; ctx.lineWidth = 1.5; ctx.strokeRect(x0, r[0] - 12, w, 30); });
    ph_fade(p, 0, function () { rows.forEach(function (r) { ctx.fillStyle = ORA2; ctx.fillRect(x0, r[0] - 12, Math.max(3, w * r[2] * ph_a(p, 0, .6)), 30); }); tag(rows[0][3], W * .64, rows[0][0] + 42, DRED, 14); tag(rows[1][3], W * .52, rows[1][0] + 42, DGREEN, 14); });
  },
  /* 6 · pourquoi les pertes sont divisées par 100 */
  function (p) {
    var y1 = H * .3, y2 = H * .68;
    [[y1, 'U', 'I', 110, 'P = R·I²  →  100', DRED], [y2, '10·U', 'I/10', 18, 'P = R·(I/10)²  →  1', DGREEN]].forEach(function (c, i) {
      LN(W * .06, c[0], W * .94, c[0], INK, 5); TB(c[1], W * .06, c[0] - 16, BLUE_D, 15, 'left');
      A(W * .3, c[0] - 14, c[3], 0, i ? GREEN : RED, c[2], i ? 2 : 6);
      if (!i) { ctx.fillStyle = 'rgba(226,75,74,.18)'; ctx.fillRect(W * .5, c[0] - 12, W * .44, 24); }
      ph_fade(p, 0, function () { tag(c[4], W * .74, c[0] + (i ? 34 : 34), c[5], 15); });
    });
    ph_fade(p, .4, function () { tag('÷ 10 sur I  ⇒  ÷ 100 sur les pertes', W * .5, H * .93, ORA2, 16); });
  },
  /* 7 · chargeur réel : bilan de puissance */
  function (p) {
    var y = H * .4, hh = 60;
    ctx.fillStyle = '#d6e6f7'; ctx.fillRect(W * .05, y - hh / 2, W * .3, hh); TB('P₁ = 10/0,85', W * .2, y - 4, BLUE_D, 15); TB('≈ 11,8 W', W * .2, y + 16, BLUE_D, 15);
    ph_head(W * .38, y, 1, 0, GREY, 9); LN(W * .35, y, W * .38, y, GREY, 3);
    ctx.fillStyle = '#bfe3d3'; ctx.fillRect(W * .42, y - hh * .85 / 2, W * .46, hh * .85); TB('utile : 10 W (5,0 V · 2,0 A)', W * .65, y + 5, DGREEN, 14);
    ph_fade(p, 0, function () { ctx.fillStyle = '#f3c89c'; ctx.fillRect(W * .42, y + hh * .43 + 4, W * .08, hh * .15 + 6); TB('chaleur 1,8 W', W * .52, y + hh * .43 + 20, ORANGE, 14, 'left'); });
    TB('230 V → 5,0 V · rendement 85 %', W * .5, H * .1, GREY, 14);
    ph_fade(p, .2, function () { tag('I₁ ≈ 0,051 A', W * .25, H * .78, BLUE_D, 15); tag('I₂ = 2,0 A', W * .62, H * .78, DGREEN, 15); tag('N₂/N₁ ≈ 0,022', W * .44, H * .93, INK, 15); });
  },
  /* 8 · lissage par condensateur */
  function (p) {
    var x0 = W * .09, w = W * .86, y0 = H * .82, h = H * .62, X = function (t) { return x0 + t / 30 * w; }, Y = function (u) { return y0 - u / 12 * h; };
    ph_axes(x0, y0, w + 6, h + 10, 't (ms)', 'u (V)'); TB('12 V', x0 - 6, Y(12) + 4, INK, 12, 'right');
    ctx.strokeStyle = p > .5 ? '#c9d9ec' : BLUE; ctx.lineWidth = p > .5 ? 2 : 3; ctx.beginPath(); for (var t = 0; t <= 30.01; t += .3) { var v = 12 * Math.abs(Math.sin(Math.PI * t / 10)); t ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); } ctx.stroke();
    ph_fade(p, 0, function () { LN(x0, Y(7.64), x0 + w, Y(7.64), DGREEN, 2, [6, 4]); tag('moyenne 7,6 V', W * .5, Y(7.64) + 18, DGREEN, 14); });
    ph_fade(p, .5, function () { ctx.strokeStyle = ORA2; ctx.lineWidth = 3.2; ctx.beginPath(); var vc = 0; for (var t = 0; t <= 30.01; t += .1) { var vr = 12 * Math.abs(Math.sin(Math.PI * t / 10)); vc = Math.max(vr, vc * Math.exp(-.1 / 25)); t ? ctx.lineTo(X(t), Y(vc)) : ctx.moveTo(X(t), Y(vc)); } ctx.stroke();
      tag('C ≈ 4 000 µF', W * .76, H * .12, ORA2, 16); tag('ΔU ≈ 0,30 V (non à l’échelle)', W * .5, H * .96, GREY, 13); });
  },
  /* 9 · dimensionner une ligne : pertes en fonction de U */
  function (p) {
    var x0 = W * .13, y0 = H * .84, w = W * .8, h = H * .68, X = function (u) { return x0 + (u - 50) / 150 * w; }, Y = function (l) { return y0 - l / 4 * h; };
    ph_axes(x0, y0, w + 6, h + 8, 'U (kV)', 'pertes (%)');
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); for (var u = 50; u <= 200.1; u += 2) { u === 50 ? ctx.moveTo(X(u), Y(100 / (u * u / 100))) : ctx.lineTo(X(u), Y(100 / (u * u / 100))); } ctx.stroke();
    DOT(X(100), Y(1), 6, ORA2); LN(X(100), y0, X(100), Y(1), GREY, 1.3, [4, 4]); TB('100 kV : 1 %', X(100) + 10, Y(1) - 12, ORA2, 14, 'left'); TB('100', X(100), y0 + 17, INK, 12);
    LN(x0, Y(.5), x0 + w, Y(.5), RED, 1.8, [6, 4]); TB('seuil 0,5 %', x0 + w, Y(.5) - 8, DRED, 13, 'right');
    ph_fade(p, 0, function () { DOT(X(141.4), Y(.5), 7, DGREEN); LN(X(141.4), y0, X(141.4), Y(.5), DGREEN, 1.6, [4, 4]); tag('U ≥ 141 kV', X(141.4) + 10, Y(1.5), DGREEN, 16); });
  }
]);
