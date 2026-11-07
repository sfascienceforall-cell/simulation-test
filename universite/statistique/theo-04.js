/* Biostatistique BA1 · chapitre 4 : lois binomiale, de Poisson et normale · théorie animée et devantures */
function us4_pmf(f, fn, k0, k1, hl, c, c2) { for (var k = k0; k <= k1; k++) { var v = fn(k), on = hl ? hl(k) : false; ctx.fillStyle = on ? (c2 || ORANGE) : (c || BLUE); ctx.globalAlpha = on ? .95 : .75; var w = Math.max(3, (f.X(1) - f.X(0)) * .72); ctx.fillRect(f.X(k) - w / 2, f.Y(v), w, f.B - f.Y(v)); ctx.globalAlpha = 1; } }
function us4_kt(a, b, st) { var r = []; for (var i = a; i <= b; i += st) r.push(i); return r; }

SFA.theo("c04", {
  icon: function () { TB('B(n ; p) · P(λ) · N(μ ; σ²)', W * .5, H * .45, BLUE_D, 26); TB('trois lois de référence', W * .5, H * .66, ORANGE, 18); },
  anim: function (t) {
    var n = 2 + Math.floor((t * .08) % 58), pr = .3, mu = n * pr, sg = Math.sqrt(n * pr * (1 - pr)), f = us_f(-.5, 40.5, 0, .5, 44, 48, 20, 46);
    TB('Binomiale B(n ; 0,3) : quand n grandit, elle ressemble à la cloche normale', W / 2, 26, BLUE_D, 15);
    var ymax = Math.max(.12, Math.min(.5, 1.25 * Math.max(us_bin(Math.round(mu), n, pr), .08))); f = us_f(-.5, 40.5, 0, ymax, 44, 48, 20, 46);
    us_ax(f, us4_kt(0, 40, 5), [0, +(ymax / 2).toFixed(2), +ymax.toFixed(2)], 'nombre de succès k');
    us4_pmf(f, function (k) { return us_bin(k, n, pr); }, 0, 40);
    us_fn(f, function (x) { return us_pdf(x, mu, sg); }, -.5, 40.5, RED, 2.6, 200);
    TB('n = ' + n + ' · np = ' + us_n(mu, 1) + ' · σ = ' + us_n(sg, 2), W - 24, 56, ORANGE, 15, 'right');
    TB(n * pr * (1 - pr) >= 9 ? 'np(1 − p) ≥ 9 : approximation correcte' : 'np(1 − p) < 9 : approximation médiocre', W - 24, 78, n * pr * (1 - pr) >= 9 ? DGREEN : DRED, 14, 'right');
  },
  th: '<div class="tcard"><b class="h">1. Loi binomiale B(n ; p)</b>' +
   '<p>Nombre de succès dans n essais <b>indépendants</b>, chacun de probabilité p (succès / échec). <code>P(X = k) = C(n,k)·pᵏ·(1 − p)ⁿ⁻ᵏ</code>, <code>E(X) = np</code>, <code>Var(X) = np(1 − p)</code>. Exemple : fratrie de 4 enfants, risque 1/4 chacun : <code>P(X = 2) = 6 × (1/4)² × (3/4)² = 54/256 = 0,211</code>. Pour 40 patients à 15 % : E = 6, Var = 5,1, σ = 2,26.</p></div>' +
   '<div class="tcard"><b class="h">2. Loi de Poisson P(λ)</b>' +
   '<p>Nombre d\'événements rares dans un intervalle (temps, volume, surface) lorsque les événements surviennent indépendamment à taux moyen λ : <code>P(X = k) = e^(−λ) λᵏ / k!</code>, <code>E(X) = Var(X) = λ</code>. Exemple (λ = 2 colonies par boîte) : <code>P(0) = e⁻² = 0,135</code>. Les sommes de Poisson indépendantes sont de Poisson : 3 plaques de moyenne 2 donnent λ = 6, donc <code>P(aucune colonie) = e⁻⁶ = 0,0025</code>. « Au moins un » : <code>1 − P(0)</code>.</p></div>' +
   '<div class="tcard"><b class="h">3. Loi normale N(μ ; σ²) et score z</b>' +
   '<p>Cloche symétrique centrée sur μ, d\'écart-type σ. On standardise : <code>z = (x − μ)/σ</code>, puis on lit la table de Φ(z) = P(Z ≤ z). Règle <b>68 – 95 – 99,7</b> : environ 68 % des valeurs à moins de 1σ, 95 % à moins de 2σ (plus exactement 1,96σ), 99,7 % à moins de 3σ. Exemple : glycémie N(95 ; 10²) : <code>P(X &lt; 110) = Φ(1,5) = 0,933</code>. Intervalle de référence central à 95 % : <code>μ ± 1,96σ</code>.</p>' +
   '<div class="warn"><b>Piège.</b> Avec 10 analyses indépendantes, chacune avec intervalle de référence à 95 %, un sujet sain a 1 − 0,95¹⁰ = 40 % de chance d\'avoir au moins une valeur « anormale ».</div></div>' +
   '<div class="tcard"><b class="h">4. Passer d\'une loi à l\'autre</b>' +
   '<p><b>Binomiale → Poisson</b> : n grand, p petit (n ≥ 50 et np ≤ 5 environ), avec λ = np. Exemple : n = 200, p = 0,02 donne λ = 4. <b>Binomiale → normale</b> : np(1 − p) suffisamment grand (≥ 9 environ), avec <b>correction de continuité</b> : <code>P(X ≤ k) ≈ Φ((k + 0,5 − np) / √(np(1−p)))</code>. Exemple : B(100 ; 0,3), P(X ≤ 35) : z = (35,5 − 30)/4,58 = 1,20, d\'où 0,885 (exact 0,884).</p>' +
   '<div class="tip"><b>Choix rapide.</b> Comptage d\'essais avec n fixé : binomiale. Comptage d\'événements rares sans n explicite : Poisson. Mesure continue symétrique : normale.</div></div>' +
   '<div class="tcard"><b class="h">5. Reconnaître la normalité</b>' +
   '<p>Une concentration biologique est souvent asymétrique à droite : moyenne &gt; médiane, « moyenne − 2s &lt; 0 ». La <b>droite de Henry</b> (graphe quantile-quantile) aligne les points si les données sont normales ; une courbure indique une asymétrie. La <b>transformation logarithmique</b> rend souvent la distribution à peu près normale (loi log-normale) ; on travaille alors sur ln(x) puis on revient par exponentielle.</p></div>'
});

SFA.figs("c04", [
 function (p) { us_ttl('Fratrie de 4 : B(4 ; 1/4)'); var f = us_f(-.7, 4.7, 0, .5, 44, 44, 20, 58); us_ax(f, [0, 1, 2, 3, 4], [0, .25, .5], 'enfants atteints'); us4_pmf(f, function (k) { return us_bin(k, 4, .25); }, 0, 4, function (k) { return p > 0 && k === 2; });
  for (var k = 0; k <= 4; k++) TB(us_n(us_bin(k, 4, .25), 3), f.X(k), f.Y(us_bin(k, 4, .25)) - 6, INK, 14); if (p > 0) { ctx.globalAlpha = p; tag('P(X = 2) = 6 × (1/16) × (9/16) = 0,211', W / 2, H - 12, ORANGE, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Colonies par boîte : Poisson λ = 2'); var f = us_f(-.7, 8.7, 0, .3, 44, 44, 20, 40); us_ax(f, [0, 1, 2, 3, 4, 5, 6, 7, 8], [0, .1, .2, .3], 'colonies k'); us4_pmf(f, function (k) { return us_poi(k, 2); }, 0, 8, function (k) { return p > 0 && k === 0; });
  if (p > 0) { ctx.globalAlpha = p; tag('P(0) = e⁻² = 0,135', f.X(4), f.Y(.2), ORANGE, 17); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('20 patients, guérison 0,7 chacun'); var f = us_f(3, 21, 0, .22, 44, 44, 20, 40); us_ax(f, us4_kt(4, 20, 2), [0, .1, .2], 'guéris k'); us4_pmf(f, function (k) { return us_bin(k, 20, .7); }, 3, 20, function (k) { return p > 0 && k === 14; });
  if (p > 0) { ctx.globalAlpha = p; tag('binomiale B(20 ; 0,7) · E = 14', f.X(8), f.Y(.17), ORANGE, 16); ctx.globalAlpha = 1; } else TB('succès / échec, essais indépendants', f.X(9), f.Y(.18), GREY, 15); },
 function (p) { us_ttl('B(40 ; 0,15) : effets indésirables'); var f = us_f(-.5, 16.5, 0, .2, 44, 44, 20, 58); us_ax(f, us4_kt(0, 16, 2), [0, .1, .2], 'patients touchés'); us4_pmf(f, function (k) { return us_bin(k, 40, .15); }, 0, 16, function (k) { return p > 0 && Math.abs(k - 6) <= 2.258; });
  LN(f.X(6), f.B, f.X(6), f.T + 14, RED, 2.4, [5, 4]); tag('E = 6', f.X(12), f.Y(.16), DRED, 15); if (p > 0) { ctx.globalAlpha = p; tag('Var = 40 × 0,15 × 0,85 = 5,1 · σ = 2,26', W / 2, H - 12, ORANGE, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Glycémie N(95 ; 10²) : P(X < 110)'); var f = us_f(60, 130, 0, .045, 24, 44, 20, 40), g = function (x) { return us_pdf(x, 95, 10); }; us_ax(f, [70, 80, 90, 100, 110, 120], false, 'mg/dL');
  us_fill(f, g, 60, 110, GREEN, .35 * (p > 0 ? 1 : 0)); us_fn(f, g, 60, 130, BLUE, 2.8); us_vl(f, 110, INK, 'z = 1,5', [4, 4], 2, f.T + 12); if (p > 0) { ctx.globalAlpha = p; tag('0,933', f.X(93), f.Y(.015), DGREEN, 18); tag('0,067', f.X(120), f.Y(.012), DRED, 16); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Dosage N(80 ; 5²) : entre 70 et 90'); var f = us_f(60, 100, 0, .09, 24, 44, 20, 40), g = function (x) { return us_pdf(x, 80, 5); }; us_ax(f, [65, 70, 75, 80, 85, 90, 95]); if (p > 0) us_fill(f, g, 70, 90, GREEN, .35 * p); us_fn(f, g, 60, 100, BLUE, 2.8);
  [70, 90].forEach(function (x) { us_vl(f, x, GREY, '', [4, 4], 1.6); }); if (p > 0) { ctx.globalAlpha = p; arrow(f.X(80), f.Y(.012), f.X(90) - f.X(80) - 4, 0, DGREEN, '', 2.2); arrow(f.X(80), f.Y(.012), f.X(70) - f.X(80) + 4, 0, DGREEN, '', 2.2); tag('± 2σ : ≈ 95 %', f.X(80), f.Y(.05), DGREEN, 17); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Bactéries par mL : Poisson λ = 3,2'); var f = us_f(-.7, 11.7, 0, .25, 44, 52, 20, 40); us_ax(f, us4_kt(0, 11, 1), [0, .1, .2], 'bactéries k'); us4_pmf(f, function (k) { return us_poi(k, 3.2); }, 0, 11, function (k) { return k >= 2; }, GREY, p > 0 ? BLUE : GREY);
  if (p > 0) { ctx.globalAlpha = p; tag('P(≥ 2) = 1 − 0,041 − 0,130 = 0,829', f.X(7.4), f.Y(.235), DGREEN, 15); ctx.globalAlpha = 1; } else TB('au moins 2 : 1 − P(0) − P(1)', f.X(7), f.Y(.2), GREY, 15); },
 function (p) { us_ttl('Hémoglobine N(140 ; 12²) : 120 à 160 g/L'); var f = us_f(100, 180, 0, .04, 24, 44, 20, 40), g = function (x) { return us_pdf(x, 140, 12); }; us_ax(f, [110, 120, 130, 140, 150, 160, 170]); if (p > 0) us_fill(f, g, 120, 160, GREEN, .35 * p); us_fn(f, g, 100, 180, BLUE, 2.8);
  [120, 160].forEach(function (x) { us_vl(f, x, GREY, '', [4, 4], 1.6); }); if (p > 0) { ctx.globalAlpha = p; tag('z = ± 1,67 → 0,904', f.X(140), f.Y(.017), DGREEN, 17); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('n = 200, p = 0,02 : binomiale ≈ Poisson'); var f = us_f(-.7, 14.7, 0, .25, 44, 44, 20, 40); us_ax(f, us4_kt(0, 14, 2), [0, .1, .2], 'événements k'); us4_pmf(f, function (k) { return us_bin(k, 200, .02); }, 0, 14);
  if (p > 0) { ctx.globalAlpha = p; for (var k = 0; k <= 14; k++) DOT(f.X(k), f.Y(us_poi(k, 4)), 5.5, ORA2); tag('Poisson λ = np = 4', f.X(9), f.Y(.2), ORA2, 17); ctx.globalAlpha = 1; } else TB('n grand, p petit', f.X(9), f.Y(.2), GREY, 16); },
 function (p) { us_ttl('B(100 ; 0,3) : P(X ≤ 35), correction de continuité'); var f = us_f(15, 45, 0, .1, 44, 44, 20, 62); us_ax(f, us4_kt(15, 45, 5), [0, .05, .1], 'k');
  us4_pmf(f, function (k) { return us_bin(k, 100, .3); }, 15, 45, function (k) { return k <= 35; }, GREY, BLUE); var g = function (x) { return us_pdf(x, 30, Math.sqrt(21)); }; us_fn(f, g, 15, 45, RED, 2.4, 160);
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, 35.5, DRED, 'x = 35,5', [4, 4], 2, f.T + 10); tag('z = 1,20 → 0,885 (exact 0,884)', W / 2, H - 12, DGREEN, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('3 plaques de culture, 2 colonies en moyenne'); var cx = [W * .2, W * .5, W * .8], r = Math.min(W * .1, H * .22), y = H * .46; for (var i = 0; i < 3; i++) { ctx.fillStyle = '#f4f8fc'; ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx[i], y, r, 0, 7); ctx.fill(); ctx.stroke(); var pos = p > 0 ? [] : [[.3, -.3], [-.4, .2]]; pos.forEach(function (q) { DOT(cx[i] + q[0] * r, y + q[1] * r, 4, ORA2); }); TB('P(0) = e⁻²', cx[i], y + r + 22, INK, 14); }
  if (p > 0) { ctx.globalAlpha = p; tag('e⁻² × e⁻² × e⁻² = e⁻⁶ = 0,0025', W / 2, H - 16, DGREEN, 16); ctx.globalAlpha = 1; } else TB('aucune colonie sur les 3 ?', W / 2, H - 16, GREY, 16); },
 function (p) { us_ttl('Glycémie des sujets sains N(90 ; 8²)'); var f = us_f(60, 120, 0, .06, 24, 44, 20, 50), g = function (x) { return us_pdf(x, 90, 8); }; us_ax(f, [70, 80, 90, 100, 110]); us_fn(f, g, 60, 120, BLUE, 2.8); us_fill(f, g, 60, 74.32, RED, .5); us_fill(f, g, 105.68, 120, RED, .5); us_fill(f, g, 74.32, 105.68, GREEN, .2);
  if (p > 0) { ctx.globalAlpha = p; us_vl(f, 74.32, DRED, '74,3', [4, 4], 1.8, f.T + 8); us_vl(f, 105.68, DRED, '105,7', [4, 4], 1.8, f.T + 8); tag('5 % hors intervalle · 10 analyses : 40 %', W / 2, H - 14, DRED, 16); ctx.globalAlpha = 1; } else TB('intervalle central à 95 %', W / 2, H - 14, GREY, 16); },
 function (p) { us_ttl('Marqueur : sains N(5 ; 1) et malades N(7 ; 1)'); var f = us_f(2, 10, 0, .5, 24, 44, 20, 50), g1 = function (x) { return us_pdf(x, 5, 1); }, g2 = function (x) { return us_pdf(x, 7, 1); }; us_ax(f, [3, 4, 5, 6, 7, 8, 9]);
  us_fill(f, g2, 6, 10, GREEN, .45); us_fill(f, g1, 6, 10, RED, .45); us_fn(f, g1, 2, 10, BLUE, 2.6); us_fn(f, g2, 2, 10, ORA2, 2.6); us_vl(f, 6, INK, 'seuil 6', false, 2.4);
  TB('sains', f.X(4), f.Y(.4) - 4, BLUE_D, 15); TB('malades', f.X(8), f.Y(.4) - 4, DRED, 15); if (p > 0) { ctx.globalAlpha = p; tag('Se = Sp = 0,841 · VPP = 37 % (π = 10 %)', W / 2, H - 14, DGREEN, 15); ctx.globalAlpha = 1; } else TB('Se = ? Sp = ?', W / 2, H - 14, GREY, 16); },
 function (p) { us_ttl('Effet rare (1 %), n = 400 : quelle loi ?'); var f = us_f(-3, 14.5, 0, .22, 44, 44, 20, 40); us_ax(f, us4_kt(0, 14, 2), [0, .1, .2], 'cas k'); us4_pmf(f, function (k) { return us_bin(k, 400, .01); }, 0, 14);
  if (p > 0) { ctx.globalAlpha = p; for (var k = 0; k <= 14; k++) DOT(f.X(k), f.Y(us_poi(k, 4)), 5.5, ORA2); us_fn(f, function (x) { return us_pdf(x, 4, 1.99); }, -3, 14.5, RED, 2.4, 160); tag('Poisson λ = 4 : convient', f.X(10), f.Y(.18), DGREEN, 15); tag('normale : non (queue < 0)', f.X(8.8), f.Y(.12), DRED, 15); ctx.globalAlpha = 1; } else TB('binomiale, Poisson ou normale ?', f.X(8), f.Y(.18), GREY, 16); }
]);
