/* Biostatistique BA1 · chapitre 2 : probabilités · théorie animée et devantures */
function us2_seq(n, pr, seed) { var s = seed, a = [], k = 0; for (var i = 0; i < n; i++) { s = (s * 1103515245 + 12345) % 2147483648; if (s / 2147483648 < pr) k++; a.push(k / (i + 1)); } return a; }
var US2_SEQ = us2_seq(800, .3, 7);
function us2_circ(x, y, r, c, al, lab) { ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); if (lab) TB(lab, x, y - r - 8, c === BLUE ? BLUE_D : DRED, 16); }
function us2_node(x, y, lab, c) { DOT(x, y, 5, c || INK); if (lab) TB(lab, x, y - 10, c || INK, 14); }
function us2_edge(x1, y1, x2, y2, lab, c) { LN(x1, y1, x2, y2, c || GREY, 2); if (lab) tag(lab, (x1 + x2) / 2, (y1 + y2) / 2, c || INK, 14); }

SFA.theo("c02", {
  icon: function () { TB('P(A | B)', W * .5, H * .45, BLUE_D, 34); TB('probabilités', W * .5, H * .66, ORANGE, 18); },
  anim: function (t) {
    var f = us_f(0, 800, 0, .6, 50, 44, 30, 44), n = Math.min(800, 2 + Math.floor(t * 2.2) % 900); if (n > 800) n = 800;
    TB('Loi des grands nombres : la fréquence observée tend vers la probabilité (p = 0,3)', W / 2, 26, BLUE_D, 15);
    us_ax(f, [0, 200, 400, 600, 800], [0, .1, .2, .3, .4, .5, .6], 'nombre de tirages n', 'fréquence');
    us_vl(f, 0, 'rgba(0,0,0,0)', '', false); LN(f.L, f.Y(.3), f.R, f.Y(.3), GREEN, 2, [6, 5]); TB('p = 0,3', f.R, f.Y(.3) - 8, DGREEN, 14, 'right');
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath(); for (var i = 1; i <= n; i++) { var x = f.X(i), y = f.Y(US2_SEQ[i - 1]); i > 1 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    DOT(f.X(n), f.Y(US2_SEQ[n - 1]), 5, ORANGE); TB('n = ' + n + '  fréquence = ' + us_n(US2_SEQ[n - 1], 3), W / 2, H - 8, ORANGE, 15);
  },
  th: '<div class="tcard"><b class="h">1. Fréquence et probabilité</b>' +
   '<p>La <b>fréquence relative</b> d\'un événement est <code>f = effectif / n</code>. Quand n augmente, elle se stabilise autour de la probabilité : c\'est la <b>loi des grands nombres</b>. Une probabilité est toujours comprise entre 0 et 1 ; si les issues sont équiprobables, <code>P(A) = cas favorables / cas possibles</code>. Une fréquence observée sur 400 patients estime la probabilité pour le patient suivant, avec une incertitude qui diminue avec n.</p></div>' +
   '<div class="tcard"><b class="h">2. Combiner des événements</b>' +
   '<p>Événement contraire : <code>P(Ā) = 1 − P(A)</code>. Union (A ou B) et intersection (A et B) : <code>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</code>. Si A et B sont <b>incompatibles</b> (A ∩ B = ∅), l\'intersection est nulle et les probabilités s\'additionnent. Le raccourci « au moins un » : <code>P(au moins un) = 1 − P(aucun)</code>. Exemple : 5 patients indépendants avec risque 0,2 : <code>1 − 0,8⁵ = 0,672</code>.</p></div>' +
   '<div class="tcard"><b class="h">3. Probabilité conditionnelle et indépendance</b>' +
   '<p><code>P(A | B) = P(A ∩ B) / P(B)</code>, d\'où la règle du produit <code>P(A ∩ B) = P(B) · P(A | B)</code>. A et B sont <b>indépendants</b> si <code>P(A ∩ B) = P(A)·P(B)</code>, c\'est-à-dire <code>P(A | B) = P(A)</code> : savoir B ne change rien à A.</p>' +
   '<div class="warn"><b>Piège.</b> Incompatibles et indépendants sont presque opposés : deux événements incompatibles de probabilités non nulles sont <b>dépendants</b> (si B arrive, A est impossible). Et <code>P(A | B) ≠ P(B | A)</code> en général (P(symptôme | malade) n\'est pas P(malade | symptôme)).</div></div>' +
   '<div class="tcard"><b class="h">4. Arbres, probabilités totales, tirages</b>' +
   '<p>Sur un arbre, on <b>multiplie</b> le long d\'une branche et on <b>additionne</b> les branches qui mènent au même résultat. Probabilités totales : <code>P(B) = Σ P(Aᵢ)·P(B | Aᵢ)</code>. Exemple : labo A (60 %, 2 % d\'erreurs), labo B (40 %, 5 %) : P(erreur) = 0,6·0,02 + 0,4·0,05 = 0,032 ; P(B | erreur) = 0,02/0,032 = 0,625. Tirages sans remise de 5 positifs et 3 négatifs : P(2 positifs) = 5/8 · 4/7 = 5/14.</p></div>' +
   '<div class="tcard"><b class="h">5. Dénombrement et variable discrète</b>' +
   '<p>Arrangements <code>A(n,k) = n!/(n−k)!</code> (ordre compté) ; combinaisons <code>C(n,k) = n!/(k!(n−k)!)</code> (ordre ignoré). Pour une variable discrète : <code>E(X) = Σ xᵢ·pᵢ</code> et <code>Var(X) = E(X²) − E(X)²</code>. Exemple : X = 0, 1, 2, 3, 4 avec probabilités 0,20 ; 0,30 ; 0,25 ; 0,15 ; 0,10 : E(X) = 1,65 ; E(X²) = 4,25 ; Var(X) = 4,25 − 2,7225 = 1,5275.</p>' +
   '<div class="tip"><b>Sans mémoire.</b> Quatre enfants sains ne rendent pas le cinquième plus à risque : le risque reste 1/4 pour chaque enfant (événements indépendants).</div></div>'
});

SFA.figs("c02", [
 function (p) { us_ttl('A et B incompatibles'); var r = H * .24, y = H * .55; us2_circ(W * .3, y, r, BLUE, .25, 'A : 0,30'); us2_circ(W * .7, y, r, RED, .25, 'B : 0,50'); TB('A ∩ B = ∅', W / 2, y + r + 24, GREY, 15);
  if (p > 0) { ctx.globalAlpha = p; tag('P(A ∪ B) = 0,30 + 0,50 = 0,80', W / 2, H - 22, DGREEN, 16); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('400 patients traités'); var cols = 40, rows = 10, cw = (W - 40) / cols, x0 = 20, y0 = H * .22, k = 0, hit = [];
  for (var i = 0; i < 400; i++) hit.push(((i * 37 + 11) % 400) < 38 ? 1 : 0);
  for (i = 0; i < 400; i++) { var c = i % cols, r = Math.floor(i / cols); ctx.fillStyle = hit[i] ? RED : '#d4e4f6'; ctx.fillRect(x0 + c * cw + 1, y0 + r * cw + 1, cw - 2, cw - 2); }
  TB('38 avec effet indésirable', W / 2, y0 + rows * cw + 26, DRED, 16); if (p > 0) { ctx.globalAlpha = p; tag('f = 38/400 = 0,095', W / 2, H - 18, DGREEN, 17); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Portoir de 10 échantillons'); var w = W * .06, g = W * .025, x0 = (W - (10 * w + 9 * g)) / 2, yb = H * .62;
  for (var i = 0; i < 10; i++) { var x = x0 + i * (w + g), pos = i < 3, h = H * .34; ctx.fillStyle = pos ? '#fbd5d4' : '#d9f0e8'; ctx.strokeStyle = pos ? RED : GREEN; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x, yb - h, w, h, [3, 3, w / 2, w / 2]); ctx.fill(); ctx.stroke(); TB(pos ? '+' : '−', x + w / 2, yb - h / 2 + 5, pos ? DRED : DGREEN, 18); }
  if (p > 0) { ctx.globalAlpha = p; tag('P(+) = 3/10 = 0,3', W * .3, H * .86, DRED, 16); tag('P(−) = 7/10 = 0,7', W * .72, H * .86, DGREEN, 16); ctx.globalAlpha = 1; } else TB('on en tire un au hasard', W / 2, H * .86, GREY, 15); },
 function (p) { us_ttl('Affections A et B'); var r = H * .27, y = H * .54, xa = W * .38, xb = W * .62; us2_circ(xa, y, r, BLUE, .2, ''); us2_circ(xb, y, r, RED, .2, ''); TB('A', xa - r - 10, y - r + 4, BLUE_D, 18); TB('B', xb + r + 10, y - r + 4, DRED, 18);
  if (p > 0) { ctx.globalAlpha = p; TB('30 %', W * .27, y + 6, BLUE_D, 17); TB('10 %', W / 2, y + 6, INK, 17); TB('15 %', W * .73, y + 6, DRED, 17); tag('ni A ni B : 45 %', W / 2, H - 18, DGREEN, 16); ctx.globalAlpha = 1; } else { TB('40 %', W * .27, y + 6, BLUE_D, 17); TB('10 %', W / 2, y + 6, INK, 17); TB('25 %', W * .73, y + 6, DRED, 17); } },
 function (p) { us_ttl('Toux chronique selon le tabagisme'); var cw = W * .2, ch = 38, x = W * .1, y = H * .24;
  us_tab(x, y, cw, ch, [['', 'toux', 'pas de toux', 'total'], ['fumeurs', { t: 36, c: p > 0 ? { b: '#fde3b8', f: INK } : null }, 44, 80], ['non-fumeurs', 18, 102, 120], ['total', { t: 54, c: p > 0 ? { b: '#d4ecff', f: INK } : null }, 146, 200]], 1);
  if (p > 0) { ctx.globalAlpha = p; TB('P(toux | fumeur) = 36/80 = 0,45', W / 2, y + 4 * ch + 26, ORANGE, 16); TB('P(fumeur | toux) = 36/54 = 0,67', W / 2, y + 4 * ch + 50, BLUE_D, 16); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('P(A) = 0,4 · P(B) = 0,5 · P(A ∩ B) = 0,2'); var s = Math.min(W * .5, H * .66), x0 = W / 2 - s / 2, y0 = H * .17;
  ctx.fillStyle = '#f3f6fa'; ctx.fillRect(x0, y0, s, s); ctx.fillStyle = 'rgba(55,138,221,.25)'; ctx.fillRect(x0, y0, s * .4, s); ctx.fillStyle = 'rgba(226,75,74,.25)'; ctx.fillRect(x0, y0 + s * .5, s, s * .5);
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, s, s); TB('A : 0,4', x0 + s * .2, y0 + s * .22, BLUE_D, 15); TB('B : 0,5', x0 + s * .72, y0 + s * .78, DRED, 15);
  if (p > 0) { ctx.globalAlpha = p; ctx.fillStyle = 'rgba(29,158,117,.55)'; ctx.fillRect(x0, y0 + s * .5, s * .4, s * .5); ctx.globalAlpha = 1; tag('0,2', x0 + s * .2, y0 + s * .75, DGREEN, 16); tag('0,4 × 0,5 = 0,2 : indépendants', W / 2, H - 14, DGREEN, 16); } },
 function (p) { us_ttl('Deux tubes sans remise : 5 positifs, 3 négatifs'); var x0 = W * .1, y0 = H * .5, x1 = W * .42, x2 = W * .72, yy = [H * .26, H * .74], yl = [H * .16, H * .36, H * .64, H * .84];
  us2_edge(x0, y0, x1, yy[0], '5/8', DGREEN); us2_edge(x0, y0, x1, yy[1], '3/8', DRED);
  us2_edge(x1, yy[0], x2, yl[0], '4/7', DGREEN); us2_edge(x1, yy[0], x2, yl[1], '3/7', DRED); us2_edge(x1, yy[1], x2, yl[2], '5/7', DGREEN); us2_edge(x1, yy[1], x2, yl[3], '2/7', DRED);
  var lv = [['PP', '0,357'], ['PN', '0,268'], ['NP', '0,268'], ['NN', '0,107']]; lv.forEach(function (v, i) { DOT(x2, yl[i], 5, INK); TB(v[0], x2 + 12, yl[i] + 5, INK, 15, 'left'); if (p > 0) { ctx.globalAlpha = p; TB(v[1], x2 + 48, yl[i] + 5, i === 0 ? DGREEN : ORANGE, 15, 'left'); ctx.globalAlpha = 1; } }); DOT(x0, y0, 5, INK); DOT(x1, yy[0], 5, INK); DOT(x1, yy[1], 5, INK); },
 function (p) { us_ttl('Laboratoires A et B : erreurs'); var x0 = W * .08, y0 = H * .5, x1 = W * .4, x2 = W * .66, yy = [H * .27, H * .73], yl = [H * .14, H * .38, H * .62, H * .86];
  us2_edge(x0, y0, x1, yy[0], 'A 0,6', BLUE_D); us2_edge(x0, y0, x1, yy[1], 'B 0,4', DRED);
  us2_edge(x1, yy[0], x2, yl[0], '0,02', DRED); us2_edge(x1, yy[0], x2, yl[1], '0,98', GREY); us2_edge(x1, yy[1], x2, yl[2], '0,05', DRED); us2_edge(x1, yy[1], x2, yl[3], '0,95', GREY);
  [[0, 'A·erreur 0,012'], [1, ''], [2, 'B·erreur 0,020'], [3, '']].forEach(function (v) { DOT(x2, yl[v[0]], 5, INK); if (p > 0 && v[1]) { ctx.globalAlpha = p; TB(v[1], x2 + 10, yl[v[0]] + 5, v[0] === 2 ? DRED : BLUE_D, 14, 'left'); ctx.globalAlpha = 1; } });
  if (p > 0) { ctx.globalAlpha = p; tag('P(erreur) = 0,032 · P(B | erreur) = 0,625', W / 2, H - 12, DGREEN, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Au moins une réaction sur 5 patients'); var x0 = W * .13, g = W * .15; for (var i = 0; i < 5; i++) pers(x0 + i * g, H * .56, H * .34, i === 2 && p > 0 ? RED : BLUE, 1, '', 'center'); TB('chacun : risque 0,2', W / 2, H * .72, GREY, 15);
  var bx = W * .1, bw = W * .8, by = H * .82, bh = 20; ctx.fillStyle = '#d9f0e8'; ctx.fillRect(bx, by, bw * .328, bh); ctx.fillStyle = '#fbd5d4'; ctx.fillRect(bx + bw * .328, by, bw * .672, bh); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.strokeRect(bx, by, bw, bh);
  if (p > 0) { ctx.globalAlpha = p; TB('aucun : 0,328', bx + bw * .164, by - 6, DGREEN, 14); TB('au moins un : 0,672', bx + bw * .664, by - 6, DRED, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Parents Aa × Aa : carré de Punnett'); var cw = Math.min(W * .15, 70), x = W * .12, y = H * .28, g = ['AA', 'Aa', 'Aa', 'aa'];
  us_tab(x, y, cw, cw * .62, [['', 'A', 'a'], ['A', { t: 'AA', c: { b: '#d9f0e8', f: DGREEN } }, { t: 'Aa', c: { b: '#fdf0d4', f: ORANGE } }], ['a', { t: 'Aa', c: { b: '#fdf0d4', f: ORANGE } }, { t: 'aa', c: { b: p > 0 ? '#fbc8c7' : '#fde9e9', f: DRED } }]], 1);
  TB('aa : atteint = 1/4', x + cw * 3.7, y + cw * 1.5, DRED, 16, 'left'); TB('Aa : porteur', x + cw * 3.7, y + cw * .95, ORANGE, 15, 'left');
  if (p > 0) { ctx.globalAlpha = p; tag('3 enfants : exactement un 27/64 · au moins un 37/64', W / 2, H - 38, DRED, 15); tag('enfant sain : porteur avec 2/3', W / 2, H - 14, ORANGE, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Donneur O négatif'); var s = Math.min(W * .46, H * .66), x0 = W / 2 - s / 2 - 50, y0 = H * .17;
  ctx.fillStyle = '#f3f6fa'; ctx.fillRect(x0, y0, s, s); ctx.fillStyle = 'rgba(55,138,221,.25)'; ctx.fillRect(x0, y0, s * .45, s); ctx.fillStyle = 'rgba(226,75,74,.25)'; ctx.fillRect(x0, y0 + s * .85, s, s * .15);
  ctx.fillStyle = p > 0 ? GREEN : 'rgba(29,158,117,.4)'; ctx.fillRect(x0, y0 + s * .85, s * .45, s * .15); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, s, s);
  TB('O : 0,45', x0 + s * .22, y0 + s * .4, BLUE_D, 15); TB('Rh− : 0,15', x0 + s * .75, y0 + s * .95, DRED, 14); var tx = x0 + s + 24;
  TB('P(O−)', tx, y0 + 20, INK, 15, 'left'); TB('= 0,45 × 0,15', tx, y0 + 44, INK, 15, 'left');
  if (p > 0) { ctx.globalAlpha = p; TB('= 0,0675', tx, y0 + 68, DGREEN, 16, 'left'); TB('10 donneurs :', tx, y0 + 104, INK, 15, 'left'); TB('1 − 0,9325¹⁰', tx, y0 + 126, INK, 15, 'left'); TB('= 0,503', tx, y0 + 150, DGREEN, 16, 'left'); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('1 000 personnes : maladie M et symptôme S'); var cw = W * .2, ch = 40, x = W * .1, y = H * .24;
  us_tab(x, y, cw, ch, [['', 'S', 'pas de S', 'total'], ['M', { t: 90, c: { b: p > 0 ? '#fbc8c7' : '#fde9e9', f: DRED } }, 10, 100], ['non M', { t: 180, c: p > 0 ? { b: '#d4ecff', f: INK } : null }, 720, 900], ['total', 270, 730, 1000]], 1);
  if (p > 0) { ctx.globalAlpha = p; TB('P(S | M) = 90/100 = 0,90', W / 2, y + 4 * ch + 26, DRED, 16); TB('P(M | S) = 90/270 = 0,33', W / 2, y + 4 * ch + 50, BLUE_D, 16); ctx.globalAlpha = 1; } else TB('P(S | M) ≠ P(M | S)', W / 2, y + 4 * ch + 28, GREY, 16); },
 function (p) { us_ttl('Consultations annuelles X (500 patients)'); var f = us_f(-.5, 4.5, 0, .35, 44, 40, 20, 40), v = [.2, .3, .25, .15, .1]; us_ax(f, [0, 1, 2, 3, 4], [0, .1, .2, .3], 'X');
  v.forEach(function (q, i) { ctx.fillStyle = BLUE; ctx.globalAlpha = .8; ctx.fillRect(f.X(i) - 18, f.Y(q), 36, f.B - f.Y(q)); ctx.globalAlpha = 1; TB(us_n(q, 2), f.X(i), f.Y(q) - 6, INK, 14); });
  if (p > 0) { ctx.globalAlpha = p; LN(f.X(1.65), f.B, f.X(1.65), f.T + 24, ORANGE, 2.6); us_tri(f.X(1.65), f.B - 4, ORANGE, true); tag('E(X) = 1,65 · Var = 1,53', f.X(2.3), f.T + 14, ORANGE, 15); ctx.globalAlpha = 1; } },
 function (p) { us_ttl('Quatre enfants sains… et le cinquième ?'); var x0 = W * .12, g = W * .16, y = H * .46; for (var i = 0; i < 4; i++) { DOT(x0 + i * g, y, 22, '#d9f0e8'); ctx.strokeStyle = GREEN; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x0 + i * g, y, 22, 0, 7); ctx.stroke(); TB('sain', x0 + i * g, y + 5, DGREEN, 13); }
  var cx = x0 + 4 * g, r = 28; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = GREY; ctx.lineWidth = 2.4; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(cx, y); ctx.arc(cx, y, r, -PI / 2, -PI / 2 + 2 * PI * .25 * Math.max(.0001, p), false); ctx.closePath(); ctx.fill(); if (p <= 0) TB('?', cx, y + 8, GREY, 22);
  TB('1er à 4e : passé, 5e : 1/4', W / 2, H * .78, GREY, 15); if (p > 0) { ctx.globalAlpha = p; tag('risque inchangé : 1/4', W / 2, H * .9, DRED, 16); ctx.globalAlpha = 1; } }
]);
