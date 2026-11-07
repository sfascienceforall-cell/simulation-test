/* Physique 6e · chapitre 10 : physique et santé ; climat et énergie (aides : theo-01, 02, 06) */
function ph10_probe(x, y, w) { ph6_rr(x - w / 2, y - 26, w, 26, '#eef4fb', BLUE_D, 2.4); TB('sonde', x, y - 8, BLUE_D, 12); }
function ph10_dots(x1, y1, x2, y2, t, col, n) { var L = Math.hypot(x2 - x1, y2 - y1); for (var k = 0; k < (n || L / 24); k++) { var u = ((t * .01) + k / (n || L / 24)) % 1; DOT(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u, 3, col); } }
function ph10_bar(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); }

SFA.theo("c10", {
  icon: function () {
    TB('d = v·t/2', W * .3, H * .3, BLUE_D, 28); TB('I = I₀·e^(−μx)', W * .68, H * .5, ORANGE, 24); TB('+ 33 °C', W * .5, H * .8, DRED, 30); TB('effet de serre', W * .5, H * .93, GREY, 14);
  },
  sub: [
    { t: "Échographie",
      anim: function (t) {
        var px = W * .12, py = H * .18, bot = H * .9; ph10_probe(px, py, 56); ctx.fillStyle = '#fbe9e1'; ctx.fillRect(px - 28, py, 56 + W * .0, 0); ctx.fillStyle = '#fbe9e1'; ctx.fillRect(W * .06, py, W * .5, bot - py); LN(W * .06, H * .52, W * .56, H * .52, '#8a5b3c', 2.4); LN(W * .06, H * .7, W * .56, H * .7, '#8a5b3c', 2.4); TB('interface 1', W * .58, H * .52 + 4, GREY, 12, 'left'); TB('interface 2', W * .58, H * .7 + 4, GREY, 12, 'left');
        var cyc = 300, s = (t % cyc) / cyc, ys = [H * .52, H * .7], go = s < .5 ? s * 2 : 0; var k = Math.floor(s * 2); var tgt = k === 0 ? ys[0] : ys[1]; var yy;
        var u = (s * 2) % 1; var up = u < .5 ? u * 2 : (1 - u) * 2; var tg = k === 0 ? ys[0] : ys[1]; yy = py + (tg - py) * up; DOT(px, yy, 6, ORA2); ph6_rr(px + 14, yy - 5, 18, 10, '#fff', ORA2, 1.2);
        var Tk = k === 0 ? 65 : 130; TB('t = ' + Math.round(Tk * u) + ' µs  (aller-retour : ' + Tk + ' µs)', W * .72, H * .35, DGREEN, 14); TB('d = v·t/2', W * .72, H * .2, BLUE_D, 18); TB('v = 1 540 m/s', W * .72, H * .8, INK, 14);
        TB('les ultrasons (MHz) sont réfléchis aux interfaces', W * .5, H * .96, GREY, 13);
      },
      th: '<div class="tcard"><b class="h">Principe</b><p>Une sonde émet de brèves impulsions d\'<b>ultrasons</b> (ondes mécaniques de fréquence 2-15 MHz, inaudibles et non ionisantes) et capte les <b>échos</b> réfléchis aux interfaces entre tissus. La profondeur d\'une interface se déduit du temps aller-retour : <b>d = v·t/2</b>, avec v ≈ 1 540 m/s dans les tissus mous. t = 130 µs : d ≈ 10 cm ; temps d\'écho pour 12 cm : ≈ 156 µs.</p></div>' +
        '<div class="tcard"><b class="h">Résolution et pénétration</b><p>Le détail minimal visible est de l\'ordre de λ = v/f : 1 540/5·10<sup>6</sup> ≈ 0,31 mm à 5 MHz, 0,15 mm à 10 MHz. Mais les hautes fréquences sont <b>plus atténuées</b> (≈ 0,5 dB par cm et par MHz) : on choisit une fréquence élevée pour les organes superficiels et plus basse pour les organes profonds. Compromis résolution/profondeur.</p></div>' +
        '<div class="tcard"><b class="h">Réflexion et gel</b><p>La fraction d\'énergie réfléchie à une interface dépend de l\'écart des impédances acoustiques : <b>R = ((Z₂ − Z₁)/(Z₂ + Z₁))²</b>. Entre l\'air et la peau, R est proche de 1 : presque tout est réfléchi, d\'où le <b>gel</b> qui chasse l\'air et assure un bon contact. Entre tissu mou (1,63 MRayl) et graisse (1,38) : R ≈ 0,69 %, ce qui reste détectable. Niveau de l\'écho = −10·log(1/R) − 2 × 0,5 × f(MHz) × profondeur(cm) : 3,5 MHz à 12 cm donne −63,6 dB (détectable, seuil −90 dB), 7 MHz donne −105,6 dB (non détecté).</p></div>' },
    { t: "Rayons X et doses",
      anim: function (t) {
        var y = H * .45, x0 = W * .06, x1 = W * .94, bx = W * .38, bw = W * .26;
        ph6_rr(x0, y - 16, 30, 32, '#fdf6e8', ORANGE, 2); TB('tube X', x0 + 15, y + 34, ORANGE, 11); ctx.fillStyle = '#fbe9e1'; ctx.fillRect(bx, y - 70, bw, 140); ctx.fillStyle = '#e6e2d6'; ctx.fillRect(bx + bw * .35, y - 15, bw * .3, 50); ctx.strokeStyle = '#8a5b3c'; ctx.lineWidth = 2; ctx.strokeRect(bx, y - 70, bw, 140); TB('tissus', bx + bw / 2, y - 76, '#8a5b3c', 12); TB('os', bx + bw / 2, y + 52, GREY, 12);
        [[y - 46, .13], [y + 16, .0], [y + 56, .13]].forEach(function (r, i) { var yy = r[0]; var bone = i === 1; for (var k = 0; k < 6; k++) { var u = ((t * .006 + k / 6) % 1), x = x0 + 34 + u * (x1 - x0 - 60); var inb = x > bx && x < bx + bw; var alive = !(inb && (bone ? (x - bx) / bw > .35 + (.15 * (k % 2)) : (x - bx) / bw > .8 - .3 * (k % 3) / 3) && k % 3 !== 0); if (x > bx + bw * .5 && bone && k % 5 !== 0) alive = false; if (alive) DOT(x, yy, 3.4, VIOLET); } });
        ph6_rr(x1 - 10, y - 70, 10, 140, '#eceef1', GREY, 1.5); TB('détecteur', x1 - 8, y + 90, GREY, 11, 'right'); ctx.fillStyle = 'rgba(60,60,60,.65)'; ctx.fillRect(x1 - 10, y - 15, 10, 50);
        tag('os : plus absorbant → « ombre »', W * .5, H * .12, DRED, 14); tag('I = I₀·e^(−μ·x)', W * .5, H * .93, DGREEN, 16);
      },
      th: '<div class="tcard"><b class="h">Radiographie</b><p>Un faisceau de rayons X (photons de 20-120 keV) traverse le corps ; l\'intensité transmise suit <b>I = I₀·e<sup>−μ·x</sup></b> (μ : coefficient d\'atténuation, x : épaisseur). Les os (Ca, plus dense) absorbent bien plus que les tissus mous : ils apparaissent en clair sur le film. 60 keV, μ = 0,206 cm<sup>−1</sup>, 10 cm de tissus : I/I₀ = e<sup>−2,06</sup> ≈ 12,8 % ; 87 % sont absorbés ou diffusés. Un scanner reconstruit une image en coupes à partir de nombreuses projections.</p></div>' +
        '<div class="tcard"><b class="h">Énergie et contraste</b><p>À basse énergie (30 keV) l\'os absorbe beaucoup plus que les tissus : contraste ≈ 99 %. À 100 keV, l\'atténuation est plus faible et plus uniforme : contraste ≈ 31 %. Il faut choisir l\'énergie pour un bon contraste sans dose excessive.</p></div>' +
        '<div class="tcard"><b class="h">Doses et risques</b><p>La <b>dose efficace</b> (mSv) mesure l\'effet biologique du rayonnement reçu. Rayonnement naturel ≈ 2,4 mSv/an en moyenne ; radio dentaire ≈ 0,005 mSv ; vol aller transatlantique ≈ 0,04 mSv ; scanner du thorax ≈ 7 mSv. Exemple : 7 + 2 × 0,005 + 4 × 0,04 = 7,17 mSv ajoutés, soit ≈ 1 090 jours de rayonnement naturel (≈ 3 ans). Principes : <b>justification</b> (bénéfice &gt; risque) et <b>optimisation</b> (dose aussi faible que raisonnablement possible, ALARA). Les rayons X sont ionisants ; les ultrasons ne le sont pas.</p></div>' },
    { t: "Effet de serre et bilan énergétique",
      anim: function (t) {
        var gy = H * .86, ay = H * .45;
        ctx.fillStyle = '#dff0d8'; ctx.fillRect(0, gy, W, H - gy); TB('surface', W * .06, gy + 16, DGREEN, 12, 'left'); ctx.fillStyle = 'rgba(120,170,230,.22)'; ctx.fillRect(W * .02, ay - 14, W * .62, 28); TB('atmosphère (gaz à effet de serre)', W * .33, ay + 4, BLUE_D, 12);
        var xs = W * .14; ph10_dots(xs, H * .06, xs, gy - 4, t * 3, '#f0b429', 8); TB('340 W/m²', xs + 8, H * .1, ORANGE, 13, 'left'); ph10_dots(xs + 40, H * .3, xs + 90, H * .08, t * 3, '#f0b429', 3); TB('102 réfléchis', xs + 96, H * .1, GREY, 12, 'left');
        var x2 = W * .34; ph10_dots(x2, gy, x2, ay + 18, t * 2, RED, 6); TB('387', x2 - 6, H * .68, DRED, 13, 'right'); ph10_dots(x2, ay - 16, x2, H * .06, t * 2, RED, 4); TB('238 vers l\'espace', x2 + 8, H * .24, DRED, 13, 'left');
        var x3 = W * .5; ph10_dots(x3, ay + 18, x3, gy - 4, t * 2, VIOLET, 5); TB('149 (contre-rayonnement)', x3 + 8, H * .65, VIOLET, 13, 'left');
        TB('sans atmosphère : −18 °C', W * .82, H * .45, BLUE_D, 14); TB('avec : +14 °C', W * .82, H * .55, DRED, 16); tag('absorbé : 238 W/m² = émis par la Terre vers l\'espace', W * .5, H * .96, DGREEN, 13);
      },
      th: '<div class="tcard"><b class="h">Bilan sans atmosphère</b><p>Le Soleil apporte en moyenne 340 W/m² au sommet de l\'atmosphère ; avec un albédo de 0,30, <b>238 W/m²</b> sont absorbés. À l\'équilibre, la Terre émet autant : σ·T<sup>4</sup> = 238 (loi de Stefan, σ = 5,67·10<sup>−8</sup> W·m<sup>−2</sup>·K<sup>−4</sup>), donc T ≈ 255 K = <b>−18 °C</b>. La température réelle moyenne est d\'environ +14 °C.</p></div>' +
        '<div class="tcard"><b class="h">Effet de serre naturel</b><p>L\'atmosphère laisse passer le rayonnement solaire visible mais absorbe une partie de l\'infrarouge émis par la surface (vapeur d\'eau, CO₂, CH₄, N₂O) et en renvoie la moitié vers le sol. Modèle à une couche (ε = 0,77) : la surface émet 238/(1 − ε/2) = 387 W/m², soit T ≈ 287 K = 14 °C, et reçoit un contre-rayonnement ≈ 149 W/m². L\'effet de serre naturel apporte ≈ +33 °C : sans lui, la Terre serait gelée.</p></div>' +
        '<div class="tcard"><b class="h">Effet de serre renforcé</b><p>Les émissions humaines augmentent les concentrations de gaz à effet de serre. Le <b>forçage radiatif</b> du CO₂ vaut <b>ΔF = 5,35·ln(C/C₀)</b> (W/m²) ; avec ΔT ≈ 0,8·ΔF à l\'équilibre, un doublement de C donne ΔF = 3,7 W/m² et ΔT ≈ 3,0 °C. Ne confonds pas <b>effet de serre</b> (nécessaire, naturel) et <b>réchauffement climatique</b> (conséquence du renforcement). Autres leviers : albédo (glace), nuages, océans.</p></div>' +
        '<div class="tcard"><b class="h">Analyser des données énergétiques</b><p>Compare toujours les ordres de grandeur et les unités : puissance (W) = énergie (J)/durée (s) ; 1 kWh = 3,6 MJ. Un bilan correct conserve l\'énergie : ce qui entre = ce qui sort + ce qui s\'accumule.</p></div>' }
  ]
});

SFA.figs("c10", [
  /* 1 profondeur par échographie */
  function (p) {
    ph10_probe(W * .2, H * .2, 60); ctx.fillStyle = '#fbe9e1'; ctx.fillRect(W * .08, H * .2, W * .5, H * .7); LN(W * .08, H * .66, W * .58, H * .66, '#8a5b3c', 3); TB('interface', W * .6, H * .66 + 5, GREY, 13, 'left'); A(W * .2, H * .22, 0, 80, ORA2, '', 3); TB('130 µs', W * .72, H * .3, INK, 16);
    ph_fade(p, 0, function () { A(W * .26, H * .66, 0, -80, RED, '', 3); ph_dim(W * .06, H * .2, W * .06, H * .66, '', DGREEN, 0); tag('d = v·t/2 ≈ 10 cm', W * .72, H * .6, DGREEN, 16); });
  },
  /* 2 quelle onde */
  function (p) {
    ph10_probe(W * .2, H * .28, 70); ctx.fillStyle = '#fbe9e1'; ctx.fillRect(W * .08, H * .28, W * .6, H * .62); for (var k = 1; k <= 5; k++) { ctx.strokeStyle = '#8fb9e6'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W * .2, H * .28, k * 36, .3, PI - .3); ctx.stroke(); }
    TB('ondes mécaniques', W * .8, H * .3, BLUE_D, 14); TB('f ≈ MHz', W * .8, H * .42, BLUE_D, 16); ph_fade(p, 0, function () { tag('ultrasons : non ionisants', W * .5, H * .93, DGREEN, 17); });
  },
  /* 3 résolution et fréquence */
  function (p) {
    var x0 = W * .06, w = W * .88; ph6_string(x0, x0 + w, H * .3, H * .1, w / 5, 0, BLUE, 3); ph6_string(x0, x0 + w, H * .65, H * .1, w / 10, 0, RED, 3); TB('5 MHz', x0 + w, H * .12, BLUE_D, 15, 'right'); TB('10 MHz', x0 + w, H * .5, DRED, 15, 'right');
    ph_fade(p, 0, function () { ph_dim(x0, H * .46, x0 + w / 5, H * .46, '', BLUE, 0); tag('λ = 0,31 mm', x0 + w * .3, H * .46 + 0, BLUE_D, 13); ph_dim(x0, H * .81, x0 + w / 10, H * .81, '', RED, 0); tag('λ = 0,15 mm', x0 + w * .22, H * .81, DRED, 13); tag('10 MHz : meilleure résolution', W * .5, H * .95, DGREEN, 15); });
  },
  /* 4 atténuation des rayons X */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .76, gh = H * .6; ph_axes(gx, gy, gw + 8, gh + 12, '', 'I/I₀'); TB('x (cm)', gx + gw, gy + 30, INK, 13, 'right'); var X = function (x) { return gx + gw * x / 15; }, Y = function (v) { return gy - gh * v; };
    ctx.strokeStyle = BLUE; ctx.lineWidth = 3.2; ctx.beginPath(); for (var x = 0; x <= 15; x += .25) { x ? ctx.lineTo(X(x), Y(Math.exp(-.206 * x))) : ctx.moveTo(X(x), Y(1)); } ctx.stroke(); TB('60 keV · μ = 0,206 cm⁻¹', W * .6, H * .1, INK, 14); [0, 5, 10, 15].forEach(function (x) { TB(x, X(x), gy + 16, INK, 11); });
    ph_fade(p, 0, function () { DOT(X(10), Y(.1275), 7, DRED); LN(X(10), gy, X(10), Y(.1275), GREY, 1.2, [3, 4]); tag('10 cm : 12,8 % traversent', W * .6, H * .32, DRED, 15); tag('87 % atténués', W * .6, H * .46, DGREEN, 16); });
  },
  /* 5 sans atmosphère */
  function (p) {
    var cx = W * .66, cy = H * .5, R = 58; ctx.fillStyle = '#cfe6f7'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.strokeStyle = BLUE_D; ctx.lineWidth = 2.4; ctx.stroke(); TB('Terre', cx, cy + 5, BLUE_D, 15);
    for (var k = -2; k <= 2; k++) A(W * .08, cy + k * 22, W * .14, 0, '#f0b429', '', 2.6); TB('Soleil', W * .1, cy - 62, ORANGE, 14); TB('sans atmosphère', cx, H * .12, INK, 15); TB('albédo 0,30', W * .2, H * .86, GREY, 13);
    ph_fade(p, 0, function () { ph6_rr(W * .86 - 28, H * .22, 36, 120, '#fff', INK, 2); ctx.fillStyle = BLUE; ctx.fillRect(W * .86 - 22, H * .22 + 100, 24, 14); tag('≈ −18 °C', W * .86 - 10, H * .88, DRED, 17); });
  },
  /* 6 bilan de doses */
  function (p) {
    var x0 = W * .08, w = W * .84, y = H * .3, tot = 9.57; function seg(a, b, col, lab, ty) { ctx.fillStyle = col; ctx.fillRect(x0 + w * a / tot, y, w * (b - a) / tot, 44); }
    seg(0, 2.4, '#8fb9e6'); seg(2.4, 9.4, '#e8a07c'); seg(9.4, 9.57, '#e0584b'); TB('naturel 2,4 mSv', x0 + w * 1.2 / tot, y + 66, BLUE_D, 13); TB('scanner 7 mSv', x0 + w * 5.9 / tot, y + 28, DRED, 16);
    TB('radios 0,01 + vols 0,16', x0 + w * 7.5 / tot, y - 10, GREY, 12);
    ph_fade(p, 0, function () { tag('ajouté : 7,17 mSv', W * .6, H * .72, DRED, 16); tag('total : 9,57 mSv', W * .6, H * .56 + 0, DGREEN, 16); tag('≈ 1 090 jours de naturel (≈ 3 ans)', W * .5, H * .92, BLUE_D, 14); });
  },
  /* 7 énergie et contraste */
  function (p) {
    var gx = W * .1, gy = H * .84, gw = W * .84, gh = H * .56; LN(gx, gy, gx + gw, gy, GREY, 1.5); var bw = gw / 5; function B(i, v, col, lab) { var h = gh * (Math.log10(v) + 5.5) / 5.5; ctx.fillStyle = col; ctx.fillRect(gx + i * (bw * 1.25) + 10, gy - h, bw, h); TB(lab, gx + i * (bw * 1.25) + 10 + bw / 2, gy + 16, INK, 11); }
    B(0, 3.6e-3, '#8fb9e6', 'tissus'); B(1, 4.6e-5, '#e8a07c', 'tissus+os'); B(2, 7.7e-2, '#8fb9e6', 'tissus'); B(3, 5.3e-2, '#e8a07c', 'tissus+os'); TB('30 keV', gx + bw * 1.1, H * .1, BLUE_D, 15); TB('100 keV', gx + bw * 3.5, H * .1, BLUE_D, 15); TB('transmission (échelle log)', W * .5, H * .96, GREY, 12);
    ph_fade(p, 0, function () { tag('contraste 99 %', gx + bw * 1.1, H * .24, DGREEN, 15); tag('contraste 31 %', gx + bw * 3.5, H * .24, DRED, 15); });
  },
  /* 8 le gel d'échographie */
  function (p) {
    ph10_probe(W * .3, H * .2, 70); ctx.fillStyle = '#fbe9e1'; ctx.fillRect(W * .12, H * .4, W * .6, H * .5); ctx.fillStyle = '#e8f4fb'; ctx.fillRect(W * .12, H * .26, W * .6, 0); TB('peau', W * .76, H * .5, GREY, 13, 'left');
    if (p <= 0) { ctx.fillStyle = '#fff'; ctx.fillRect(W * .12, H * .2, W * .6, H * .2); ctx.strokeStyle = GREY; ctx.lineWidth = 1; ctx.strokeRect(W * .12, H * .2, W * .6, H * .2); TB('air', W * .76, H * .34, GREY, 13, 'left'); A(W * .2, H * .22, 0, H * .15, ORA2, '', 3); A(W * .26, H * .38, 0, -H * .15, RED, '', 3); TB('quasi tout réfléchi', W * .5, H * .96, DRED, 15); }
    else { ctx.fillStyle = 'rgba(120,200,240,.45)'; ctx.fillRect(W * .12, H * .26, W * .6, H * .14); TB('gel', W * .76, H * .34, BLUE_D, 13, 'left'); A(W * .2, H * .3, 0, H * .5, ORA2, '', 3); A(W * .4, H * .3, 0, H * .5, ORA2, '', 3); tag('gel : plus d\'air, bon contact, impédances voisines', W * .5, H * .96, DGREEN, 13); }
  },
  /* 9 échographie profonde */
  function (p) {
    var gx = W * .12, gy = H * .82, gw = W * .76, gh = H * .6; ph_axes(gx, gy, gw + 8, gh + 12, '', 'niveau (dB)'); TB('f (MHz)', gx + gw, gy + 28, INK, 13, 'right'); var Y = function (L) { return gy - gh * (L + 120) / 120; };
    LN(gx, Y(-90), gx + gw, Y(-90), DRED, 2, [6, 5]); TB('seuil −90 dB', gx + gw, Y(-90) - 8, DRED, 13, 'right'); ctx.fillStyle = BLUE; ctx.fillRect(gx + gw * .18, Y(-63.6), 60, gy - Y(-63.6)); TB('3,5', gx + gw * .18 + 30, gy + 16, INK, 13); TB('−63,6', gx + gw * .18 + 30, Y(-63.6) - 8, BLUE_D, 13);
    TB('R = 0,69 % · écho à 12 cm : 156 µs', W * .5, H * .08, INK, 14); ph_fade(p, 0, function () { ctx.fillStyle = RED; ctx.fillRect(gx + gw * .6, Y(-105.6), 60, gy - Y(-105.6)); TB('7', gx + gw * .6 + 30, gy + 16, INK, 13); TB('−105,6', gx + gw * .6 + 30, Y(-105.6) - 8, DRED, 13); tag('3,5 MHz : détectable', gx + gw * .3, H * .27, DGREEN, 14); tag('7 MHz : non détecté', gx + gw * .74, H * .45, DRED, 14); });
  },
  /* 10 modèle à une couche */
  function (p) {
    var gy = H * .88, ay = H * .45; ctx.fillStyle = '#dff0d8'; ctx.fillRect(0, gy, W, H - gy); ctx.fillStyle = 'rgba(120,170,230,.25)'; ctx.fillRect(W * .08, ay - 12, W * .84, 24); TB('couche de gaz à effet de serre (ε = 0,77)', W * .5, ay + 4, BLUE_D, 12);
    A(W * .14, H * .06, 0, gy - H * .1, '#f0b429', '', 3); TB('340', W * .14 + 8, H * .12, ORANGE, 13, 'left'); A(W * .3, H * .22, 40, -H * .12, GREY, '', 2); TB('102', W * .3 + 46, H * .1, GREY, 12, 'left');
    ph_fade(p, 0, function () { A(W * .46, gy, 0, -(gy - ay - 16), RED, '', 3); TB('387', W * .46 - 8, H * .7, DRED, 14, 'right'); A(W * .46, ay - 16, 0, -(ay - H * .08), RED, '', 3); TB('238', W * .46 + 8, H * .2, DRED, 13, 'left'); A(W * .62, ay + 16, 0, gy - ay - 24, VIOLET, '', 3); TB('149', W * .62 + 8, H * .7, VIOLET, 13, 'left');
      tag('T = 287 K = 14 °C', W * .84, H * .68, DGREEN, 15); tag('sans couche : 255 K', W * .84, H * .8, GREY, 13); tag('2 × CO₂ : ΔT ≈ 3,0 °C', W * .8, H * .14, DRED, 14); });
    TB('238 absorbés', W * .24, H * .62, ORANGE, 13);
  }
]);
